import { IpcMain } from 'electron'
import { IpcChannels, Defaults } from '@shared/constants'
import { DriverFactory } from '../database/core/factory'
import { getConnectionDbType } from '../database/core/config-store'

/**
 * 深度序列化对象，确保可以通过 IPC 传输
 * 处理 BigInt、Buffer、Date 等特殊类型
 */
function deepSerialize(obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj, (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    if (Buffer.isBuffer(value)) {
      return '0x' + value.toString('hex').toUpperCase()
    }
    if (value instanceof Uint8Array) {
      return '0x' + Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
    }
    return value
  }))
}

/**
 * 确保 Tab 的会话与请求的 connectionId 一致
 * 如果不存在会话则创建；如果 connectionId 变更则先销毁旧会话再创建新的
 */
async function ensureSession(tabId: string, connectionId: string, database?: string): Promise<void> {
  const dbType = getConnectionDbType(connectionId)
  const sessionManager = DriverFactory.getSessionManager(dbType)

  const existingSession = sessionManager.getSessionInfo(tabId)
  if (existingSession) {
    if (existingSession.connectionId === connectionId) {
      // 连接未变更，复用现有会话
      return
    }
    // 连接已变更，销毁旧会话（可能是不同的数据库类型，需要用旧类型的 sessionManager）
    try {
      const oldDbType = getConnectionDbType(existingSession.connectionId)
      const oldSessionManager = DriverFactory.getSessionManager(oldDbType)
      await oldSessionManager.destroySession(tabId)
      console.log(`[Query] 连接变更，已销毁旧会话: tabId=${tabId}, oldConnectionId=${existingSession.connectionId}, newConnectionId=${connectionId}`)
    } catch (err) {
      console.warn(`[Query] 销毁旧会话失败: tabId=${tabId}`, err)
      // 旧连接配置可能已不存在（已断开），尝试用当前 sessionManager 清理
      try { await sessionManager.destroySession(tabId) } catch { /* ignore */ }
    }
  }

  // 创建新会话
  await sessionManager.createSession(tabId, connectionId, database)
}

export function setupQueryHandlers(ipcMain: IpcMain): void {
  // 执行 SQL（通过 SessionManager，使用 tabId 标识独占会话）
  ipcMain.handle(IpcChannels.QUERY_EXECUTE, async (_, data: {
    connectionId: string
    tabId: string
    sql: string
    maxRows?: number
    database?: string
  }) => {
    try {
      await ensureSession(data.tabId, data.connectionId, data.database)

      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      const results = await sessionManager.executeQuery(data.tabId, data.sql, {
        maxRows: data.maxRows || Defaults.MAX_ROWS,
        currentDatabase: data.database
      })
      // 使用深度序列化确保所有数据都可以通过 IPC 传输
      return deepSerialize({ success: true, results })
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { 
        success: false, 
        results: [{ type: 'error', code: 'E4000', message: err.message || '执行失败' }] 
      }
    }
  })
  
  // 取消查询（通过 SessionManager，使用 tabId）
  ipcMain.handle(IpcChannels.QUERY_CANCEL, async (_, data: {
    connectionId: string
    tabId: string
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      const cancelled = await sessionManager.cancelQuery(data.tabId)
      return { success: cancelled }
    } catch {
      return { success: false }
    }
  })
  
  // 获取执行计划（通过 SessionManager，使用 tabId）
  ipcMain.handle(IpcChannels.QUERY_EXPLAIN, async (_, data: {
    connectionId: string
    tabId: string
    sql: string
    database?: string
  }) => {
    try {
      await ensureSession(data.tabId, data.connectionId, data.database)

      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      const result = await sessionManager.explainQuery(data.tabId, data.sql, data.database)
      
      if ('type' in result && result.type === 'error') {
        return { success: false, error: result }
      }
      return { success: true, explain: result }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { 
        success: false, 
        error: { type: 'error', code: 'E4000', message: err.message || '获取执行计划失败' } 
      }
    }
  })
  
  // 批量执行 SQL（通过 SessionManager，使用 tabId）
  ipcMain.handle(IpcChannels.QUERY_EXECUTE_BATCH, async (_, data: {
    connectionId: string
    tabId: string
    sqls: string[]
    database?: string
  }) => {
    try {
      await ensureSession(data.tabId, data.connectionId, data.database)

      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      return sessionManager.executeBatch(data.tabId, data.sqls)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  })
}
