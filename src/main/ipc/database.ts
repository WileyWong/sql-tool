import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import { getDatabases, getTables, getColumns, getViews, getFunctions } from '../database/connection-manager'

export function setupDatabaseHandlers(ipcMain: IpcMain): void {
  // 获取数据库列表
  ipcMain.handle(IpcChannels.DATABASE_LIST, async (_, connectionId: string) => {
    try {
      const databases = await getDatabases(connectionId)
      return { success: true, databases }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取数据库列表失败' }
    }
  })
  
  // 获取表列表
  ipcMain.handle(IpcChannels.DATABASE_TABLES, async (_, data: { connectionId: string; database: string }) => {
    try {
      const tables = await getTables(data.connectionId, data.database)
      return { success: true, tables }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取表列表失败' }
    }
  })
  
  // 获取列信息
  ipcMain.handle(IpcChannels.DATABASE_COLUMNS, async (_, data: { connectionId: string; database: string; table: string }) => {
    try {
      const columns = await getColumns(data.connectionId, data.database, data.table)
      return { success: true, columns }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取列信息失败' }
    }
  })
  
  // 获取视图列表
  ipcMain.handle(IpcChannels.DATABASE_VIEWS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const views = await getViews(data.connectionId, data.database)
      return { success: true, views }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取视图列表失败' }
    }
  })
  
  // 获取函数列表
  ipcMain.handle(IpcChannels.DATABASE_FUNCTIONS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const functions = await getFunctions(data.connectionId, data.database)
      return { success: true, functions }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取函数列表失败' }
    }
  })
}
