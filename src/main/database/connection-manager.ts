import mysql, { Connection } from 'mysql2/promise'
import type { ConnectionConfig, TestConnectionResult, TableMeta, ColumnMeta, ViewMeta, FunctionMeta, IndexMeta, IndexColumnMeta } from '@shared/types'
import { Defaults } from '@shared/constants'

// 连接信息（包含连接对象和配置）
interface ConnectionInfo {
  connection: Connection
  config: ConnectionConfig
}

// 活跃连接池
const activeConnections = new Map<string, ConnectionInfo>()

/**
 * 测试数据库连接
 */
export async function testConnection(config: ConnectionConfig): Promise<TestConnectionResult> {
  let connection: Connection | null = null
  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database || undefined,
      connectTimeout: Defaults.CONNECTION_TIMEOUT
    })
    
    // 获取服务器版本
    const [rows] = await connection.query('SELECT VERSION() as version')
    const version = (rows as { version: string }[])[0]?.version || 'Unknown'
    
    return {
      success: true,
      message: '连接成功',
      serverVersion: version
    }
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    let message = '连接失败'
    
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      message = '无法连接到服务器，请检查服务地址'
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      message = '认证失败，请检查用户名和密码'
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      message = '数据库不存在'
    } else if (err.message) {
      message = err.message
    }
    
    return {
      success: false,
      message
    }
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

/**
 * 创建 MySQL 连接
 */
async function createConnection(config: ConnectionConfig): Promise<Connection> {
  return await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database || undefined,
    connectTimeout: Defaults.CONNECTION_TIMEOUT,
    multipleStatements: true
  })
}

/**
 * 建立数据库连接
 */
export async function connect(config: ConnectionConfig): Promise<void> {
  // 如果已有连接，先断开
  if (activeConnections.has(config.id)) {
    await disconnect(config.id)
  }
  
  const connection = await createConnection(config)
  
  activeConnections.set(config.id, { connection, config })
}

/**
 * 断开数据库连接
 */
export async function disconnect(connectionId: string): Promise<void> {
  const info = activeConnections.get(connectionId)
  if (info) {
    try {
      await info.connection.end()
    } catch {
      // 忽略断开连接时的错误
    }
    activeConnections.delete(connectionId)
  }
}

/**
 * 检查连接是否有效
 */
async function isConnectionAlive(connection: Connection): Promise<boolean> {
  try {
    await connection.ping()
    return true
  } catch {
    return false
  }
}

/**
 * 获取活跃连接（带自动重连）
 * 如果连接已断开，会自动尝试重连
 */
export async function getConnectionWithReconnect(connectionId: string): Promise<Connection | undefined> {
  const info = activeConnections.get(connectionId)
  if (!info) {
    return undefined
  }
  
  // 检查连接是否有效
  const isAlive = await isConnectionAlive(info.connection)
  
  if (isAlive) {
    return info.connection
  }
  
  // 连接已断开，尝试重连
  console.log(`[ConnectionManager] 连接 ${connectionId} 已断开，尝试重连...`)
  
  try {
    // 尝试关闭旧连接（忽略错误）
    try {
      await info.connection.end()
    } catch {
      // 忽略
    }
    
    // 创建新连接
    const newConnection = await createConnection(info.config)
    
    // 更新连接池
    activeConnections.set(connectionId, { connection: newConnection, config: info.config })
    
    console.log(`[ConnectionManager] 连接 ${connectionId} 重连成功`)
    return newConnection
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error(`[ConnectionManager] 连接 ${connectionId} 重连失败:`, err.message)
    // 重连失败，从连接池中移除
    activeConnections.delete(connectionId)
    throw new Error(`数据库连接已断开，重连失败: ${err.message || '未知错误'}`)
  }
}

/**
 * 获取活跃连接（不检查连接状态，用于向后兼容）
 */
export function getConnection(connectionId: string): Connection | undefined {
  const info = activeConnections.get(connectionId)
  return info?.connection
}

/**
 * 获取数据库列表
 */
export async function getDatabases(connectionId: string): Promise<string[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query('SHOW DATABASES')
  return (rows as { Database: string }[]).map(r => r.Database)
}

/**
 * 获取表列表
 */
export async function getTables(connectionId: string, database: string): Promise<TableMeta[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SELECT TABLE_NAME, TABLE_COMMENT 
     FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
    [database]
  )
  
  return (rows as { TABLE_NAME: string; TABLE_COMMENT: string }[]).map(r => ({
    name: r.TABLE_NAME,
    comment: r.TABLE_COMMENT || undefined,
    columns: []
  }))
}

/**
 * 获取表的列信息
 */
export async function getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SELECT 
      COLUMN_NAME, 
      DATA_TYPE, 
      COLUMN_TYPE,
      IS_NULLABLE, 
      COLUMN_KEY, 
      COLUMN_DEFAULT, 
      EXTRA,
      CHARACTER_SET_NAME,
      COLLATION_NAME,
      COLUMN_COMMENT
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [database, table]
  )
  
  return (rows as {
    COLUMN_NAME: string
    DATA_TYPE: string
    COLUMN_TYPE: string
    IS_NULLABLE: string
    COLUMN_KEY: string
    COLUMN_DEFAULT: string | null
    EXTRA: string
    CHARACTER_SET_NAME: string | null
    COLLATION_NAME: string | null
    COLUMN_COMMENT: string
  }[]).map(r => ({
    name: r.COLUMN_NAME,
    type: r.DATA_TYPE,
    columnType: r.COLUMN_TYPE,
    nullable: r.IS_NULLABLE === 'YES',
    primaryKey: r.COLUMN_KEY === 'PRI',
    autoIncrement: r.EXTRA.includes('auto_increment'),
    defaultValue: r.COLUMN_DEFAULT || undefined,
    characterSet: r.CHARACTER_SET_NAME || undefined,
    collation: r.COLLATION_NAME || undefined,
    comment: r.COLUMN_COMMENT || undefined
  }))
}

/**
 * 获取表的建表语句
 */
export async function getTableCreateSql(connectionId: string, database: string, table: string): Promise<string> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SHOW CREATE TABLE \`${database}\`.\`${table}\``
  )
  
  const result = rows as { Table: string; 'Create Table': string }[]
  return result[0]?.['Create Table'] || ''
}

/**
 * 获取表的索引信息
 */
export async function getIndexes(connectionId: string, database: string, table: string): Promise<IndexMeta[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SHOW INDEX FROM \`${database}\`.\`${table}\``
  )
  
  const indexRows = rows as {
    Key_name: string
    Seq_in_index: number
    Column_name: string
    Collation: string | null
    Cardinality: number | null
    Sub_part: number | null
    Non_unique: number
    Index_type: string
  }[]
  
  // 按索引名分组
  const indexMap = new Map<string, IndexMeta>()
  
  for (const row of indexRows) {
    const indexName = row.Key_name
    
    if (!indexMap.has(indexName)) {
      // 确定索引类型
      let indexType: IndexMeta['type'] = 'INDEX'
      if (indexName === 'PRIMARY') {
        indexType = 'PRIMARY'
      } else if (row.Non_unique === 0) {
        indexType = 'UNIQUE'
      } else if (row.Index_type === 'FULLTEXT') {
        indexType = 'FULLTEXT'
      } else if (row.Index_type === 'SPATIAL') {
        indexType = 'SPATIAL'
      }
      
      indexMap.set(indexName, {
        name: indexName,
        type: indexType,
        columns: []
      })
    }
    
    const index = indexMap.get(indexName)!
    const columnMeta: IndexColumnMeta = {
      columnName: row.Column_name,
      seqInIndex: row.Seq_in_index,
      order: row.Collation === 'D' ? 'DESC' : 'ASC',
      cardinality: row.Cardinality ?? undefined,
      subPart: row.Sub_part ?? undefined
    }
    
    index.columns.push(columnMeta)
  }
  
  // 对每个索引的列按序号排序
  for (const index of indexMap.values()) {
    index.columns.sort((a, b) => a.seqInIndex - b.seqInIndex)
  }
  
  return Array.from(indexMap.values())
}

/**
 * 获取视图列表
 */
export async function getViews(connectionId: string, database: string): Promise<ViewMeta[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SELECT TABLE_NAME
     FROM information_schema.VIEWS
     WHERE TABLE_SCHEMA = ?`,
    [database]
  )
  
  return (rows as { TABLE_NAME: string }[]).map(r => ({
    name: r.TABLE_NAME,
    columns: []
  }))
}

/**
 * 获取函数和存储过程列表
 */
export async function getFunctions(connectionId: string, database: string): Promise<FunctionMeta[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SELECT ROUTINE_NAME, ROUTINE_TYPE
     FROM information_schema.ROUTINES
     WHERE ROUTINE_SCHEMA = ?`,
    [database]
  )
  
  return (rows as { ROUTINE_NAME: string; ROUTINE_TYPE: string }[]).map(r => ({
    name: r.ROUTINE_NAME,
    type: r.ROUTINE_TYPE as 'FUNCTION' | 'PROCEDURE'
  }))
}

/**
 * 获取可用的字符集列表
 */
export async function getCharsets(connectionId: string): Promise<{ charset: string; defaultCollation: string; description: string }[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query('SHOW CHARACTER SET')
  
  return (rows as { Charset: string; 'Default collation': string; Description: string }[]).map(r => ({
    charset: r.Charset,
    defaultCollation: r['Default collation'],
    description: r.Description
  }))
}

/**
 * 获取可用的排序规则列表
 */
export async function getCollations(connectionId: string, charset?: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  let sql = 'SHOW COLLATION'
  const params: string[] = []
  
  if (charset) {
    sql += ' WHERE Charset = ?'
    params.push(charset)
  }
  
  const [rows] = await connection.query(sql, params)
  
  return (rows as { Collation: string; Charset: string; Default: string }[]).map(r => ({
    collation: r.Collation,
    charset: r.Charset,
    isDefault: r.Default === 'Yes'
  }))
}

/**
 * 获取可用的存储引擎列表
 */
export async function getEngines(connectionId: string): Promise<{ engine: string; support: string; comment: string; isDefault: boolean }[]> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query('SHOW ENGINES')
  
  return (rows as { Engine: string; Support: string; Comment: string }[])
    .filter(r => r.Support !== 'NO')
    .map(r => ({
      engine: r.Engine,
      support: r.Support,
      comment: r.Comment,
      isDefault: r.Support === 'DEFAULT'
    }))
}

/**
 * 获取数据库默认字符集
 */
export async function getDefaultCharset(connectionId: string, database: string): Promise<{ charset: string; collation: string }> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  const [rows] = await connection.query(
    `SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
     FROM information_schema.SCHEMATA 
     WHERE SCHEMA_NAME = ?`,
    [database]
  )
  
  const result = rows as { DEFAULT_CHARACTER_SET_NAME: string; DEFAULT_COLLATION_NAME: string }[]
  if (result.length === 0) {
    return { charset: 'utf8mb4', collation: 'utf8mb4_general_ci' }
  }
  
  return {
    charset: result[0].DEFAULT_CHARACTER_SET_NAME,
    collation: result[0].DEFAULT_COLLATION_NAME
  }
}

/**
 * 执行 DDL 语句
 */
export async function executeDDL(connectionId: string, sql: string): Promise<{ success: boolean; message?: string }> {
  const connection = await getConnectionWithReconnect(connectionId)
  if (!connection) {
    throw new Error('连接不存在')
  }
  
  try {
    await connection.query(sql)
    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    return { 
      success: false, 
      message: err.message || '执行失败'
    }
  }
}

/**
 * 断开所有连接
 */
export async function disconnectAll(): Promise<void> {
  for (const [id] of activeConnections) {
    await disconnect(id)
  }
}
