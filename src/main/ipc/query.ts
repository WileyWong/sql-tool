import { IpcMain } from 'electron'
import { IpcChannels, Defaults } from '@shared/constants'
import { executeQuery, cancelQuery, explainQuery, updateCell } from '../database/query-executor'

export function setupQueryHandlers(ipcMain: IpcMain): void {
  // 执行 SQL
  ipcMain.handle(IpcChannels.QUERY_EXECUTE, async (_, data: { connectionId: string; sql: string; maxRows?: number; database?: string }) => {
    const results = await executeQuery(data.connectionId, data.sql, data.maxRows || Defaults.MAX_ROWS, data.database)
    return { success: true, results }
  })
  
  // 取消查询
  ipcMain.handle(IpcChannels.QUERY_CANCEL, async (_, connectionId: string) => {
    const cancelled = await cancelQuery(connectionId)
    return { success: cancelled }
  })
  
  // 获取执行计划
  ipcMain.handle(IpcChannels.QUERY_EXPLAIN, async (_, data: { connectionId: string; sql: string }) => {
    const result = await explainQuery(data.connectionId, data.sql)
    if ('type' in result && result.type === 'error') {
      return { success: false, error: result }
    }
    return { success: true, explain: result }
  })
  
  // 更新单元格
  ipcMain.handle(IpcChannels.QUERY_UPDATE_CELL, async (_, data: {
    connectionId: string
    database: string
    table: string
    primaryKeys: { column: string; value: unknown }[]
    column: string
    newValue: unknown
  }) => {
    return updateCell(
      data.connectionId,
      data.database,
      data.table,
      data.primaryKeys,
      data.column,
      data.newValue
    )
  })
}
