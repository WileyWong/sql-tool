import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import { DriverFactory } from '../database/core/factory'
import { getConnectionDbType } from '../database/core/config-store'

export function setupDatabaseHandlers(ipcMain: IpcMain): void {
  // 获取数据库列表
  ipcMain.handle(IpcChannels.DATABASE_LIST, async (_, connectionId: string) => {
    try {
      const dbType = getConnectionDbType(connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const databases = await driver.getDatabases(connectionId)
      return { success: true, databases }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取数据库列表失败' }
    }
  })
  
  // 获取表列表
  ipcMain.handle(IpcChannels.DATABASE_TABLES, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const tables = await driver.getTables(data.connectionId, data.database)
      return { success: true, tables }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取表列表失败' }
    }
  })
  
  // 获取表列表（包含列信息）
  ipcMain.handle(IpcChannels.DATABASE_TABLES_WITH_COLUMNS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const tables = await driver.getTablesWithColumns(data.connectionId, data.database)
      return { success: true, tables }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取表列表失败' }
    }
  })
  
  // 获取列信息
  ipcMain.handle(IpcChannels.DATABASE_COLUMNS, async (_, data: { connectionId: string; database: string; table: string; schema?: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const columns = await driver.getColumns(data.connectionId, data.database, data.table, data.schema)
      return { success: true, columns }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取列信息失败' }
    }
  })
  
  // 获取视图列表
  ipcMain.handle(IpcChannels.DATABASE_VIEWS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const views = await driver.getViews(data.connectionId, data.database)
      return { success: true, views }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取视图列表失败' }
    }
  })
  
  // 获取函数列表
  ipcMain.handle(IpcChannels.DATABASE_FUNCTIONS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const functions = await driver.getFunctions(data.connectionId, data.database)
      return { success: true, functions }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取函数列表失败' }
    }
  })
  
  // 获取表的建表语句
  ipcMain.handle(IpcChannels.DATABASE_TABLE_CREATE_SQL, async (_, data: { connectionId: string; database: string; table: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const sql = await driver.getTableCreateSql(data.connectionId, data.database, data.table)
      return { success: true, sql }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取建表语句失败' }
    }
  })
  
  // 获取表的索引信息
  ipcMain.handle(IpcChannels.DATABASE_INDEXES, async (_, data: { connectionId: string; database: string; table: string; schema?: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const indexes = await driver.getIndexes(data.connectionId, data.database, data.table, data.schema)
      return { success: true, indexes }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取索引信息失败' }
    }
  })
  
  // 获取字符集列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_CHARSETS, async (_, connectionId: string) => {
    try {
      const dbType = getConnectionDbType(connectionId)
      const driver = DriverFactory.getDriver(dbType)
      
      // 检查驱动是否支持 getCharsets 方法
      if (!driver.getCharsets) {
        return { success: true, charsets: [] }
      }
      
      const charsets = await driver.getCharsets(connectionId)
      return { success: true, charsets }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取字符集列表失败' }
    }
  })
  
  // 获取排序规则列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_COLLATIONS, async (_, data: { connectionId: string; charset?: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      
      // 检查驱动是否支持 getCollations 方法
      if (!driver.getCollations) {
        return { success: true, collations: [] }
      }
      
      const collations = await driver.getCollations(data.connectionId, data.charset)
      return { success: true, collations }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取排序规则列表失败' }
    }
  })
  
  // 获取存储引擎列表（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_ENGINES, async (_, connectionId: string) => {
    try {
      const dbType = getConnectionDbType(connectionId)
      const driver = DriverFactory.getDriver(dbType)
      
      // 检查驱动是否支持 getEngines 方法
      if (!driver.getEngines) {
        return { success: true, engines: [] }
      }
      
      const engines = await driver.getEngines(connectionId)
      return { success: true, engines }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取存储引擎列表失败' }
    }
  })
  
  // 获取数据库默认字符集（MySQL 特有）
  ipcMain.handle(IpcChannels.DATABASE_DEFAULT_CHARSET, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      
      // 检查驱动是否支持 getDefaultCharset 方法
      if (!driver.getDefaultCharset) {
        return { success: true, charset: '', collation: '' }
      }
      
      const result = await driver.getDefaultCharset(data.connectionId, data.database)
      return { success: true, ...result }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取默认字符集失败' }
    }
  })
  
  // 执行 DDL 语句
  ipcMain.handle(IpcChannels.DDL_EXECUTE, async (_, data: { connectionId: string; sql: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      const result = await driver.executeDDL(data.connectionId, data.sql)
      return result
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '执行 DDL 失败' }
    }
  })

  // 获取 Schema 列表（SQL Server 特有）
  ipcMain.handle(IpcChannels.DATABASE_SCHEMAS, async (_, data: { connectionId: string; database: string }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const driver = DriverFactory.getDriver(dbType)
      
      if (!driver.getSchemas) {
        return { success: true, schemas: [] }
      }
      
      const schemas = await driver.getSchemas(data.connectionId, data.database)
      return { success: true, schemas }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '获取 Schema 列表失败' }
    }
  })
}
