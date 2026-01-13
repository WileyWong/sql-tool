import type { QueryResult, QueryResultSet, QueryMessage, QueryError, ExplainResult, ExplainNode } from '@shared/types'
import { getConnectionWithReconnect } from './connection-manager'
import { Defaults } from '@shared/constants'
import { splitStatementsToTexts } from '../sql-language-server/services/sqlParserService'

// 正在执行的查询（用于取消）
const runningQueries = new Map<string, { connectionId: string; threadId: number }>()

/**
 * 解析 SQL 获取单表信息
 * 返回 { tableName, databaseName } 或 null（非单表查询）
 */
function parseSingleTableQuery(sql: string): { tableName: string; databaseName?: string } | null {
  const trimmed = sql.trim()
  
  // 只处理 SELECT 语句
  if (!/^\s*SELECT\s/i.test(trimmed)) {
    return null
  }
  
  // 简单解析：匹配 FROM 后的表名
  // 支持格式：FROM table, FROM `table`, FROM db.table, FROM `db`.`table`
  const fromMatch = trimmed.match(/\bFROM\s+(`?[\w]+`?\.)?`?([\w]+)`?/i)
  if (!fromMatch) {
    return null
  }
  
  // 检查是否有 JOIN（多表查询）
  if (/\bJOIN\b/i.test(trimmed)) {
    return null
  }
  
  // 检查是否有多个表（逗号分隔）
  const afterFrom = trimmed.substring(trimmed.search(/\bFROM\b/i) + 5)
  const beforeWhere = afterFrom.split(/\bWHERE\b/i)[0]
  if (beforeWhere.includes(',')) {
    return null
  }
  
  const databaseName = fromMatch[1]?.replace(/`/g, '').replace('.', '') || undefined
  const tableName = fromMatch[2]
  
  return { tableName, databaseName }
}

/**
 * 获取表的主键列
 */
async function getTablePrimaryKeys(
  connectionId: string,
  database: string,
  table: string
): Promise<string[]> {
  try {
    const connection = await getConnectionWithReconnect(connectionId)
    if (!connection) return []
    
    const [rows] = await connection.query(
      `SELECT COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = 'PRIMARY'
       ORDER BY ORDINAL_POSITION`,
      [database, table]
    )
    return (rows as { COLUMN_NAME: string }[]).map(r => r.COLUMN_NAME)
  } catch {
    return []
  }
}

/**
 * 执行 SQL 查询
 */
export async function executeQuery(
  connectionId: string,
  sql: string,
  maxRows: number = Defaults.MAX_ROWS,
  currentDatabase?: string
): Promise<QueryResult[]> {
  let connection
  try {
    connection = await getConnectionWithReconnect(connectionId)
  } catch (error: unknown) {
    const err = error as { message?: string }
    return [{
      type: 'error',
      code: 'E4001',
      message: err.message || '数据库连接已断开，重连失败'
    }]
  }
  
  if (!connection) {
    return [{
      type: 'error',
      code: 'E4001',
      message: '请先选择数据库连接'
    }]
  }
  
  const trimmedSql = sql.trim()
  if (!trimmedSql) {
    return [{
      type: 'error',
      code: 'E4002',
      message: '请输入 SQL 语句'
    }]
  }
  
  // 如果指定了数据库，先切换到该数据库
  if (currentDatabase) {
    try {
      await connection.query(`USE \`${currentDatabase}\``)
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      return [{
        type: 'error',
        code: err.code || 'E4003',
        message: `切换数据库失败: ${err.message || currentDatabase}`
      }]
    }
  }
  
  // 记录查询开始
  const queryId = `${connectionId}-${Date.now()}`
  const threadId = (connection as unknown as { threadId: number }).threadId
  runningQueries.set(queryId, { connectionId, threadId })
  
  const results: QueryResult[] = []
  
  try {
    // 分割多条 SQL 语句
    const statements = splitStatementsToTexts(trimmedSql)
    
    for (const statement of statements) {
      if (!statement.trim()) continue
      
      const stmtStartTime = Date.now()
      
      try {
        // 判断是否是 SELECT 语句，添加 LIMIT
        const isSelect = /^\s*SELECT\s/i.test(statement)
        let execSql = statement
        
        if (isSelect && !hasLimit(statement)) {
          execSql = `${statement} LIMIT ${maxRows}`
        }
        
        const [rows, fields] = await connection.query(execSql)
        const executionTime = Date.now() - stmtStartTime
        
        if (Array.isArray(rows) && fields) {
          // 解析单表信息
          const tableInfo = parseSingleTableQuery(statement)
          let editable = false
          let primaryKeys: string[] = []
          let tableName: string | undefined
          let databaseName: string | undefined
          
          if (tableInfo && currentDatabase) {
            databaseName = tableInfo.databaseName || currentDatabase
            tableName = tableInfo.tableName
            primaryKeys = await getTablePrimaryKeys(connectionId, databaseName, tableName)
            editable = primaryKeys.length > 0
          }
          
          // SELECT 结果
          const resultSet: QueryResultSet = {
            type: 'resultset',
            columns: (fields as { name: string; type: number }[]).map(f => ({
              name: f.name,
              type: getTypeName(f.type),
              isPrimaryKey: primaryKeys.includes(f.name)
            })),
            rows: rows as Record<string, unknown>[],
            rowCount: (rows as unknown[]).length,
            executionTime,
            editable,
            tableName,
            databaseName,
            primaryKeys: primaryKeys.length > 0 ? primaryKeys : undefined
          }
          results.push(resultSet)
        } else {
          // INSERT/UPDATE/DELETE 结果
          const result = rows as { affectedRows: number; insertId?: number }
          const message: QueryMessage = {
            type: 'message',
            affectedRows: result.affectedRows,
            message: `影响 ${result.affectedRows} 行${result.insertId ? `，插入 ID: ${result.insertId}` : ''}`,
            executionTime
          }
          results.push(message)
        }
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string; sqlState?: string }
        const queryError: QueryError = {
          type: 'error',
          code: err.code || 'E4004',
          message: err.message || 'SQL 执行错误',
          sqlState: err.sqlState
        }
        results.push(queryError)
        // 遇错停止
        break
      }
    }
  } finally {
    runningQueries.delete(queryId)
  }
  
  return results
}

/**
 * 取消正在执行的查询
 */
export async function cancelQuery(connectionId: string): Promise<boolean> {
  try {
    const connection = await getConnectionWithReconnect(connectionId)
    if (!connection) {
      return false
    }
    
    // 找到该连接的正在执行的查询
    for (const [queryId, info] of runningQueries) {
      if (info.connectionId === connectionId) {
        try {
          await connection.query(`KILL QUERY ${info.threadId}`)
          runningQueries.delete(queryId)
          return true
        } catch {
          return false
        }
      }
    }
  } catch {
    return false
  }
  
  return false
}

/**
 * 获取执行计划
 */
export async function explainQuery(connectionId: string, sql: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
  let connection
  try {
    connection = await getConnectionWithReconnect(connectionId)
  } catch (error: unknown) {
    const err = error as { message?: string }
    return {
      type: 'error',
      code: 'E4001',
      message: err.message || '数据库连接已断开，重连失败'
    }
  }
  
  if (!connection) {
    return {
      type: 'error',
      code: 'E4001',
      message: '请先选择数据库连接'
    }
  }
  
  // 只支持 SELECT 语句
  if (!/^\s*SELECT\s/i.test(sql.trim())) {
    return {
      type: 'error',
      code: 'E4004',
      message: '执行计划仅支持 SELECT 语句'
    }
  }
  
  // 如果指定了数据库，先切换到该数据库
  if (currentDatabase) {
    try {
      await connection.query(`USE \`${currentDatabase}\``)
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string }
      return {
        type: 'error',
        code: err.code || 'E4003',
        message: `切换数据库失败: ${err.message || currentDatabase}`
      }
    }
  }
  
  try {
    const [rows] = await connection.query(`EXPLAIN ${sql}`)
    const rawRows = rows as Record<string, unknown>[]
    
    const nodes: ExplainNode[] = rawRows.map(row => ({
      id: Number(row.id) || 0,
      selectType: String(row.select_type || ''),
      table: String(row.table || ''),
      partitions: row.partitions ? String(row.partitions) : undefined,
      type: String(row.type || ''),
      possibleKeys: row.possible_keys ? String(row.possible_keys) : undefined,
      key: row.key ? String(row.key) : undefined,
      keyLen: row.key_len ? String(row.key_len) : undefined,
      ref: row.ref ? String(row.ref) : undefined,
      rows: Number(row.rows) || 0,
      filtered: Number(row.filtered) || 0,
      extra: row.Extra ? String(row.Extra) : undefined
    }))
    
    return {
      nodes,
      raw: rawRows
    }
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    return {
      type: 'error',
      code: err.code || 'E4004',
      message: err.message || '获取执行计划失败'
    }
  }
}

/**
 * 检查 SQL 是否已有 LIMIT
 */
function hasLimit(sql: string): boolean {
  return /\bLIMIT\s+\d+/i.test(sql)
}

/**
 * 获取 MySQL 类型名称
 */
function getTypeName(typeCode: number): string {
  const types: Record<number, string> = {
    0: 'DECIMAL',
    1: 'TINYINT',
    2: 'SMALLINT',
    3: 'INT',
    4: 'FLOAT',
    5: 'DOUBLE',
    6: 'NULL',
    7: 'TIMESTAMP',
    8: 'BIGINT',
    9: 'MEDIUMINT',
    10: 'DATE',
    11: 'TIME',
    12: 'DATETIME',
    13: 'YEAR',
    15: 'VARCHAR',
    16: 'BIT',
    245: 'JSON',
    246: 'DECIMAL',
    252: 'BLOB',
    253: 'VARCHAR',
    254: 'CHAR'
  }
  return types[typeCode] || 'UNKNOWN'
}

/**
 * 更新单元格值
 */
export async function updateCell(
  connectionId: string,
  database: string,
  table: string,
  primaryKeys: { column: string; value: unknown }[],
  column: string,
  newValue: unknown
): Promise<{ success: boolean; message?: string }> {
  let connection
  try {
    connection = await getConnectionWithReconnect(connectionId)
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: err.message || '数据库连接已断开，重连失败' }
  }
  
  if (!connection) {
    return { success: false, message: '连接不存在' }
  }
  
  try {
    // 构建 WHERE 条件
    const whereConditions = primaryKeys.map(pk => `\`${pk.column}\` = ?`).join(' AND ')
    const whereValues = primaryKeys.map(pk => pk.value)
    
    // 构建 UPDATE 语句
    const sql = `UPDATE \`${database}\`.\`${table}\` SET \`${column}\` = ? WHERE ${whereConditions}`
    const values = [newValue, ...whereValues]
    
    const [result] = await connection.query(sql, values)
    const res = result as { affectedRows: number }
    
    if (res.affectedRows === 1) {
      return { success: true }
    } else if (res.affectedRows === 0) {
      return { success: false, message: '未找到匹配的记录' }
    } else {
      return { success: false, message: `影响了 ${res.affectedRows} 行，请检查主键是否唯一` }
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: err.message || '更新失败' }
  }
}
