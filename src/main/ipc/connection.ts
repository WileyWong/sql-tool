import { IpcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { IpcChannels } from '@shared/constants'
import { loadConnections, saveConnection, deleteConnection, isConnectionNameExists } from '../storage/connection-store'
import { testConnection, connect, disconnect } from '../database/connection-manager'
import type { ConnectionConfig, ConnectionForm } from '@shared/types'

export function setupConnectionHandlers(ipcMain: IpcMain): void {
  // 获取连接列表
  ipcMain.handle(IpcChannels.CONNECTION_LIST, async () => {
    return loadConnections()
  })
  
  // 保存连接
  ipcMain.handle(IpcChannels.CONNECTION_SAVE, async (_, data: { connection: ConnectionForm; id?: string }) => {
    const { connection, id } = data
    
    // 验证必填字段
    if (!connection.name || !connection.host || !connection.username || !connection.password) {
      return { success: false, error: 'E1001', message: '请填写必填字段' }
    }
    
    // 验证名称长度
    if (connection.name.length > 50) {
      return { success: false, error: 'E1005', message: '连接名称过长，最多50字符' }
    }
    
    // 验证端口
    const port = connection.port || 3306
    if (port < 1 || port > 65535) {
      return { success: false, error: 'E1003', message: '端口号必须在 1-65535 范围内' }
    }
    
    // 检查名称是否重复
    if (isConnectionNameExists(connection.name, id)) {
      return { success: false, error: 'E1004', message: '连接名称已存在，请使用其他名称' }
    }
    
    const config: ConnectionConfig = {
      id: id || uuidv4(),
      name: connection.name,
      host: connection.host,
      port,
      username: connection.username,
      password: connection.password,
      database: connection.database,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    const connections = saveConnection(config)
    return { success: true, connections, connectionId: config.id }
  })
  
  // 删除连接
  ipcMain.handle(IpcChannels.CONNECTION_DELETE, async (_, connectionId: string) => {
    // 先断开连接
    await disconnect(connectionId)
    const connections = deleteConnection(connectionId)
    return { success: true, connections }
  })
  
  // 测试连接
  ipcMain.handle(IpcChannels.CONNECTION_TEST, async (_, config: ConnectionConfig) => {
    return testConnection(config)
  })
  
  // 连接数据库
  ipcMain.handle(IpcChannels.CONNECTION_CONNECT, async (_, connectionId: string) => {
    const connections = loadConnections()
    const config = connections.find(c => c.id === connectionId)
    
    if (!config) {
      return { success: false, message: '连接配置不存在' }
    }
    
    try {
      const result = await connect(config)
      return { success: true, message: '连接成功', serverVersion: result.version }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '连接失败' }
    }
  })
  
  // 断开连接
  ipcMain.handle(IpcChannels.CONNECTION_DISCONNECT, async (_, connectionId: string) => {
    await disconnect(connectionId)
    return { success: true }
  })
}
