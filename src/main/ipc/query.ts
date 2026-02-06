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
  // 执行 SQL
  ipcMain.handle(IpcChannels.QUERY_EXECUTE, async (_, data: { connectionId: string; sql: string; maxRows?: number; database?: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const results = await driver.executeQuery(data.connectionId, data.sql, {
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
  
  // 取消查询
  ipcMain.handle(IpcChannels.QUERY_CANCEL, async (_, connectionId: string) => {
    try {
      const dbType = getConnectionDbType(connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const cancelled = await driver.cancelQuery(connectionId)
      return { success: cancelled }
    } catch {
      return { success: false }
    }
  })
  
  // 获取执行计划
  ipcMain.handle(IpcChannels.QUERY_EXPLAIN, async (_, data: { connectionId: string; sql: string; database?: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const result = await driver.explainQuery(data.connectionId, data.sql, data.database)
      
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
  
  // 批量执行 SQL
  ipcMain.handle(IpcChannels.QUERY_EXECUTE_BATCH, async (_, data: {
    connectionId: string
    sqls: string[]
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      return driver.executeBatch(data.connectionId, data.sqls)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  })
}
