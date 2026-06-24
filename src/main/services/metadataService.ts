/**
 * 数据库元数据服务
 *
 * 承载 ipc/database.ts 中的元数据查询逻辑（统一的 driver 解析 + try/catch 包装）。
 */
import { DriverFactory } from '../database/core/factory'
import { getConnectionDbType } from '../database/core/config-store'

function driverFor(connectionId: string) {
  return DriverFactory.getDriver(getConnectionDbType(connectionId))
}

function errMessage(error: unknown, fallback: string): string {
  return (error as { message?: string })?.message || fallback
}

/** 获取数据库列表 */
export async function getDatabases(connectionId: string) {
  try {
    const databases = await driverFor(connectionId).getDatabases(connectionId)
    return { success: true, databases }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取数据库列表失败') }
  }
}

/** 获取表列表 */
export async function getTables(connectionId: string, database: string) {
  try {
    const tables = await driverFor(connectionId).getTables(connectionId, database)
    return { success: true, tables }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取表列表失败') }
  }
}

/** 获取表列表（包含列信息） */
export async function getTablesWithColumns(connectionId: string, database: string) {
  try {
    const tables = await driverFor(connectionId).getTablesWithColumns(connectionId, database)
    return { success: true, tables }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取表列表失败') }
  }
}

/** 获取列信息 */
export async function getColumns(connectionId: string, database: string, table: string, schema?: string) {
  try {
    const columns = await driverFor(connectionId).getColumns(connectionId, database, table, schema)
    return { success: true, columns }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取列信息失败') }
  }
}

/** 获取视图列表 */
export async function getViews(connectionId: string, database: string) {
  try {
    const views = await driverFor(connectionId).getViews(connectionId, database)
    return { success: true, views }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取视图列表失败') }
  }
}

/** 获取函数列表 */
export async function getFunctions(connectionId: string, database: string) {
  try {
    const functions = await driverFor(connectionId).getFunctions(connectionId, database)
    return { success: true, functions }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取函数列表失败') }
  }
}

/** 获取表的建表语句 */
export async function getTableCreateSql(connectionId: string, database: string, table: string) {
  try {
    const sql = await driverFor(connectionId).getTableCreateSql(connectionId, database, table)
    return { success: true, sql }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取建表语句失败') }
  }
}

/** 获取视图的创建语句 */
export async function getViewCreateSql(connectionId: string, database: string, view: string, schema?: string) {
  try {
    const sql = await driverFor(connectionId).getViewCreateSql(connectionId, database, view, schema)
    return { success: true, sql }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取视图创建语句失败') }
  }
}

/** 获取表的索引信息 */
export async function getIndexes(connectionId: string, database: string, table: string, schema?: string) {
  try {
    const indexes = await driverFor(connectionId).getIndexes(connectionId, database, table, schema)
    return { success: true, indexes }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取索引信息失败') }
  }
}

/** 获取字符集列表（MySQL 特有） */
export async function getCharsets(connectionId: string) {
  try {
    const driver = driverFor(connectionId)
    if (!driver.getCharsets) return { success: true, charsets: [] }
    const charsets = await driver.getCharsets(connectionId)
    return { success: true, charsets }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取字符集列表失败') }
  }
}

/** 获取排序规则列表（MySQL 特有） */
export async function getCollations(connectionId: string, charset?: string) {
  try {
    const driver = driverFor(connectionId)
    if (!driver.getCollations) return { success: true, collations: [] }
    const collations = await driver.getCollations(connectionId, charset)
    return { success: true, collations }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取排序规则列表失败') }
  }
}

/** 获取存储引擎列表（MySQL 特有） */
export async function getEngines(connectionId: string) {
  try {
    const driver = driverFor(connectionId)
    if (!driver.getEngines) return { success: true, engines: [] }
    const engines = await driver.getEngines(connectionId)
    return { success: true, engines }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取存储引擎列表失败') }
  }
}

/** 获取数据库默认字符集（MySQL 特有） */
export async function getDefaultCharset(connectionId: string, database: string) {
  try {
    const driver = driverFor(connectionId)
    if (!driver.getDefaultCharset) return { success: true, charset: '', collation: '' }
    const result = await driver.getDefaultCharset(connectionId, database)
    return { success: true, ...result }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取默认字符集失败') }
  }
}

/** 执行 DDL 语句 */
export async function executeDDL(connectionId: string, sql: string) {
  try {
    return await driverFor(connectionId).executeDDL(connectionId, sql)
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '执行 DDL 失败') }
  }
}

/** 获取 Schema 列表（SQL Server 特有） */
export async function getSchemas(connectionId: string, database: string) {
  try {
    const driver = driverFor(connectionId)
    if (!driver.getSchemas) return { success: true, schemas: [] }
    const schemas = await driver.getSchemas(connectionId, database)
    return { success: true, schemas }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '获取 Schema 列表失败') }
  }
}
