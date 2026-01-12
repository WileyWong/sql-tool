import mysql, { Connection } from 'mysql2/promise'
import type { ConnectionConfig, TestConnectionResult, TableMeta, ColumnMeta, ViewMeta, FunctionMeta, IndexMeta, IndexColumnMeta } from '@shared/types'
import { Defaults } from '@shared/constants'

// 活跃连接池
const activeConnections = new Map<string, Connection>()

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
 * 建立数据库连接
 */
export async function connect(config: ConnectionConfig): Promise<void> {
  // 如果已有连接，先断开
  if (activeConnections.has(config.id)) {
    await disconnect(config.id)
  }
  
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database || undefined,
    connectTimeout: Defaults.CONNECTION_TIMEOUT,
    multipleStatements: true
  })
  
  activeConnections.set(config.id, connection)
}

/**
 * 断开数据库连接
 */
export async function disconnect(connectionId: string): Promise<void> {
  const connection = activeConnections.get(connectionId)
  if (connection) {
    await connection.end()
    activeConnections.delete(connectionId)
  }
}

/**
 * 获取活跃连接
 */
export function getConnection(connectionId: string): Connection | undefined {
  return activeConnections.get(connectionId)
}

/**
 * 获取数据库列表
 */
export async function getDatabases(connectionId: string): Promise<string[]> {
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
  const connection = getConnection(connectionId)
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
 * 断开所有连接
 */
export async function disconnectAll(): Promise<void> {
  for (const [id] of activeConnections) {
    await disconnect(id)
  }
}
