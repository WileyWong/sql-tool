import mysql, { Connection } from 'mysql2/promise'
import type { ConnectionConfig, TestConnectionResult, TableMeta, ColumnMeta, ViewMeta, FunctionMeta } from '@shared/types'
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
    `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, COLUMN_COMMENT
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [database, table]
  )
  
  return (rows as {
    COLUMN_NAME: string
    DATA_TYPE: string
    IS_NULLABLE: string
    COLUMN_KEY: string
    COLUMN_DEFAULT: string | null
    COLUMN_COMMENT: string
  }[]).map(r => ({
    name: r.COLUMN_NAME,
    type: r.DATA_TYPE,
    nullable: r.IS_NULLABLE === 'YES',
    primaryKey: r.COLUMN_KEY === 'PRI',
    defaultValue: r.COLUMN_DEFAULT || undefined,
    comment: r.COLUMN_COMMENT || undefined
  }))
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
