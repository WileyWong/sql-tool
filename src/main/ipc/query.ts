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
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)

      // 懒初始化：如果该 Tab 还没有会话，自动创建
      if (!sessionManager.getSessionInfo(data.tabId)) {
        await sessionManager.createSession(data.tabId, data.connectionId, data.database)
      }

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
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)

      // 懒初始化
      if (!sessionManager.getSessionInfo(data.tabId)) {
        await sessionManager.createSession(data.tabId, data.connectionId, data.database)
      }

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
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)

      // 懒初始化
      if (!sessionManager.getSessionInfo(data.tabId)) {
        await sessionManager.createSession(data.tabId, data.connectionId, data.database)
      }

      return sessionManager.executeBatch(data.tabId, data.sqls)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  })
}
