/**
 * 连接管理服务
 *
 * 承载 ipc/connection.ts 中的全部业务逻辑，使其可脱离 Electron/IPC 单元测试。
 * Controller 仅负责取参与返回，所有判断/编排在此实现。
 */
import { v4 as uuidv4 } from 'uuid'
import {
  loadConnections,
  saveConnection,
  deleteConnection,
  isConnectionNameExists,
} from '../storage/connection-store'
import { DriverFactory } from '../database/core/factory'
import { storeConnectionConfig, removeConnectionConfig } from '../database/core/config-store'
import type { ConnectionConfig, ConnectionForm, DatabaseType } from '@shared/types'
import { getDefaultPort } from '@shared/types'

export interface ValidationError {
  error: string
  message: string
}

/**
 * 纯校验函数：校验连接表单的格式（必填、长度、端口范围）。
 * 不访问存储，便于单元测试。名称唯一性校验在 save() 中单独处理。
 */
export function validateConnectionForm(connection: ConnectionForm): ValidationError | null {
  if (!connection.name || !connection.host || !connection.username || !connection.password) {
    return { error: 'E1001', message: '请填写必填字段' }
  }
  if (connection.name.length > 50) {
    return { error: 'E1005', message: '连接名称过长，最多50字符' }
  }
  const dbType: DatabaseType = connection.type || 'mysql'
  const port = connection.port || getDefaultPort(dbType)
  if (port < 1 || port > 65535) {
    return { error: 'E1003', message: '端口号必须在 1-65535 范围内' }
  }
  return null
}

/** 获取连接列表 */
export function list(): ConnectionConfig[] {
  return loadConnections()
}

/** 保存（新增/更新）连接 */
export function save(connection: ConnectionForm, id?: string) {
  const validationError = validateConnectionForm(connection)
  if (validationError) {
    return { success: false, ...validationError }
  }
  if (isConnectionNameExists(connection.name, id)) {
    return { success: false, error: 'E1004', message: '连接名称已存在，请使用其他名称' }
  }

  const dbType: DatabaseType = connection.type || 'mysql'
  const config: ConnectionConfig = {
    id: id || uuidv4(),
    name: connection.name,
    type: dbType,
    host: connection.host,
    port: connection.port || getDefaultPort(dbType),
    username: connection.username,
    password: connection.password,
    database: connection.database,
    options: connection.options,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const connections = saveConnection(config)
  return { success: true, connections, connectionId: config.id }
}

/** 删除连接（先断开已建立的连接，再移除配置） */
export async function remove(connectionId: string) {
  const config = loadConnections().find(c => c.id === connectionId)
  if (config) {
    try {
      const driver = DriverFactory.getDriverForConfig(config)
      await driver.disconnect(connectionId)
    } catch {
      // 忽略断开连接时的错误
    }
    removeConnectionConfig(connectionId)
  }
  const connections = deleteConnection(connectionId)
  return { success: true, connections }
}

/** 测试连接 */
export async function test(config: ConnectionConfig) {
  try {
    const driver = DriverFactory.getDriverForConfig(config)
    return await driver.testConnection(config)
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '测试连接失败') }
  }
}

/** 连接数据库 */
export async function connect(connectionId: string) {
  const config = loadConnections().find(c => c.id === connectionId)
  if (!config) {
    return { success: false, message: '连接配置不存在' }
  }
  try {
    const driver = DriverFactory.getDriverForConfig(config)
    // 存储连接配置供后续使用
    storeConnectionConfig(config)
    const result = await driver.connect(config)
    return { success: true, message: '连接成功', serverVersion: result.version }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '连接失败') }
  }
}

/** 断开连接（先清理该服务器下的所有编辑器会话，再断开系统共享连接） */
export async function disconnect(connectionId: string) {
  const config = loadConnections().find(c => c.id === connectionId)
  if (config) {
    try {
      const sessionManager = DriverFactory.getSessionManager(config.type || 'mysql')
      await sessionManager.destroySessionsByConnection(connectionId)
    } catch {
      // 忽略会话清理错误
    }
    try {
      const driver = DriverFactory.getDriverForConfig(config)
      await driver.disconnect(connectionId)
    } catch {
      // 忽略断开连接时的错误
    }
  }
  return { success: true }
}

function errMessage(error: unknown, fallback: string): string {
  return (error as { message?: string })?.message || fallback
}
