import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import * as queryService from '../services/queryService'

/**
 * SQL 查询 IPC controller（薄层）
 * 业务逻辑见 services/queryService.ts
 */
export function setupQueryHandlers(ipcMain: IpcMain): void {
  // 执行 SQL（通过 SessionManager，使用 tabId 标识独占会话）
  ipcMain.handle(IpcChannels.QUERY_EXECUTE, async (_, data: {
    connectionId: string
    tabId: string
    sql: string
    maxRows?: number
    database?: string
  }) => {
    return queryService.execute(data)
  })

  // 取消查询
  ipcMain.handle(IpcChannels.QUERY_CANCEL, async (_, data: { connectionId: string; tabId: string }) => {
    return queryService.cancel(data)
  })

  // 获取执行计划
  ipcMain.handle(IpcChannels.QUERY_EXPLAIN, async (_, data: {
    connectionId: string
    tabId: string
    sql: string
    database?: string
  }) => {
    return queryService.explain(data)
  })

  // 批量执行 SQL
  ipcMain.handle(IpcChannels.QUERY_EXECUTE_BATCH, async (_, data: {
    connectionId: string
    tabId: string
    sqls: string[]
    database?: string
  }) => {
    return queryService.executeBatch(data)
  })
}
