import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import * as metadataService from '../services/metadataService'

/**
 * 数据库元数据 IPC controller（薄层）
 * 业务逻辑见 services/metadataService.ts
 */
export function setupDatabaseHandlers(ipcMain: IpcMain): void {
  // 获取数据库列表
  ipcMain.handle(IpcChannels.DATABASE_LIST, async (_, connectionId: string) => {
    return metadataService.getDatabases(connectionId)
  })

  // 获取表列表
  ipcMain.handle(IpcChannels.DATABASE_TABLES, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getTables(data.connectionId, data.database)
  })

  // 获取表列表（包含列信息）
  ipcMain.handle(IpcChannels.DATABASE_TABLES_WITH_COLUMNS, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getTablesWithColumns(data.connectionId, data.database)
  })

  // 获取列信息
  ipcMain.handle(IpcChannels.DATABASE_COLUMNS, async (_, data: { connectionId: string; database: string; table: string; schema?: string }) => {
    return metadataService.getColumns(data.connectionId, data.database, data.table, data.schema)
  })

  // 获取视图列表
  ipcMain.handle(IpcChannels.DATABASE_VIEWS, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getViews(data.connectionId, data.database)
  })

  // 获取函数列表
  ipcMain.handle(IpcChannels.DATABASE_FUNCTIONS, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getFunctions(data.connectionId, data.database)
  })

  // 获取表的建表语句
  ipcMain.handle(IpcChannels.DATABASE_TABLE_CREATE_SQL, async (_, data: { connectionId: string; database: string; table: string }) => {
    return metadataService.getTableCreateSql(data.connectionId, data.database, data.table)
  })

  // 获取视图的创建语句
  ipcMain.handle(IpcChannels.DATABASE_VIEW_CREATE_SQL, async (_, data: { connectionId: string; database: string; view: string; schema?: string }) => {
    return metadataService.getViewCreateSql(data.connectionId, data.database, data.view, data.schema)
  })

  // 获取表的索引信息
  ipcMain.handle(IpcChannels.DATABASE_INDEXES, async (_, data: { connectionId: string; database: string; table: string; schema?: string }) => {
    return metadataService.getIndexes(data.connectionId, data.database, data.table, data.schema)
  })

  // 获取字符集列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_CHARSETS, async (_, connectionId: string) => {
    return metadataService.getCharsets(connectionId)
  })

  // 获取排序规则列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_COLLATIONS, async (_, data: { connectionId: string; charset?: string }) => {
    return metadataService.getCollations(data.connectionId, data.charset)
  })

  // 获取存储引擎列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_ENGINES, async (_, connectionId: string) => {
    return metadataService.getEngines(connectionId)
  })

  // 获取数据库默认字符集（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_DEFAULT_CHARSET, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getDefaultCharset(data.connectionId, data.database)
  })

  // 执行 DDL 语句
  ipcMain.handle(IpcChannels.DDL_EXECUTE, async (_, data: { connectionId: string; sql: string }) => {
    return metadataService.executeDDL(data.connectionId, data.sql)
  })

  // 获取 Schema 列表（SQL Server 特有）
  ipcMain.handle(IpcChannels.DATABASE_SCHEMAS, async (_, data: { connectionId: string; database: string }) => {
    return metadataService.getSchemas(data.connectionId, data.database)
  })
}
