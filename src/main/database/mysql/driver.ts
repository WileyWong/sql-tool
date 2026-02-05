/**
 * MySQL 数据库驱动实现
 */

import mysql, { Connection } from 'mysql2/promise'
import type { 
  ConnectionConfig, 
  TestConnectionResult, 
  TableMeta, 
  ColumnMeta, 
  ViewMeta, 
  FunctionMeta, 
  IndexMeta, 
  IndexColumnMeta,
  QueryResult,
  QueryResultSet,
  QueryMessage,
  QueryError,
  ExplainResult,
  ExplainNode
} from '@shared/types'
import { Defaults } from '@shared/constants'
import type { IDatabaseDriver, QueryOptions } from '../core/interface'
import { splitStatementsToTexts } from '../../sql-language-server/services/sqlParserService'
import { t } from '../../i18n'

// 连接信息（包含连接对象和配置）
interface MySQLConnectionInfo {
  connection: Connection
  config: ConnectionConfig
}

/**
 * MySQL 驱动实现
 */
export class MySQLDriver implements IDatabaseDriver {
  readonly type = 'mysql'
  
  // 活跃连接池
  private connections = new Map<string, MySQLConnectionInfo>()
  
  // 正在执行的查询（用于取消）
  private runningQueries = new Map<string, { connectionId: string; threadId: number }>()

  /**
   * 测试数据库连接
   */
  async testConnection(config: ConnectionConfig): Promise<TestConnectionResult> {
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
  async connect(config: ConnectionConfig): Promise<{ version: string }> {
    // 如果已有连接，先断开
    if (this.connections.has(config.id)) {
      await this.disconnect(config.id)
    }
    
    const connection = await this.createConnection(config)
    
    // 获取服务器版本
    const [rows] = await connection.query('SELECT VERSION() as version')
    const version = (rows as { version: string }[])[0]?.version || 'Unknown'
    
    this.connections.set(config.id, { connection, config })
    
    return { version }
  }

  /**
   * 断开数据库连接
   */
  async disconnect(connectionId: string): Promise<void> {
    const info = this.connections.get(connectionId)
    if (info) {
      try {
        await info.connection.end()
      } catch {
        // 忽略断开连接时的错误
      }
      this.connections.delete(connectionId)
    }
  }

  /**
   * 断开所有连接
   */
  async disconnectAll(): Promise<void> {
    for (const [id] of this.connections) {
      await this.disconnect(id)
    }
  }

  /**
   * 检查连接是否有效
   */
  async isConnected(connectionId: string): Promise<boolean> {
    const info = this.connections.get(connectionId)
    if (!info) return false
    
    try {
      await info.connection.ping()
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取数据库版本
   */
  async getVersion(connectionId: string): Promise<string | null> {
    const connection = await this.getConnectionWithReconnect(connectionId)
    if (!connection) return null
    
    try {
      const [rows] = await connection.query('SELECT VERSION() as version')
      return (rows as { version: string }[])[0]?.version || null
    } catch {
      return null
    }
  }

  /**
   * 获取数据库列表
   */
  async getDatabases(connectionId: string): Promise<string[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
    if (!connection) {
      throw new Error('连接不存在')
    }
    
    const [rows] = await connection.query('SHOW DATABASES')
    return (rows as { Database: string }[]).map(r => r.Database)
  }

  /**
   * 获取表列表
   */
  async getTables(connectionId: string, database: string): Promise<TableMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 获取表列表（包含列信息）
   * 一次性获取所有表及其列信息，用于 Language Server 元数据加载
   */
  async getTablesWithColumns(connectionId: string, database: string): Promise<TableMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
    if (!connection) {
      throw new Error('连接不存在')
    }
    
    // 获取所有表
    const [tableRows] = await connection.query(
      `SELECT TABLE_NAME, TABLE_COMMENT 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
      [database]
    )
    
    // 一次性获取所有列信息
    const [columnRows] = await connection.query(
      `SELECT 
        TABLE_NAME,
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
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME, ORDINAL_POSITION`,
      [database]
    )
    
    // 构建表映射
    const tableMap = new Map<string, TableMeta>()
    
    for (const row of (tableRows as { TABLE_NAME: string; TABLE_COMMENT: string }[])) {
      tableMap.set(row.TABLE_NAME, {
        name: row.TABLE_NAME,
        comment: row.TABLE_COMMENT || undefined,
        columns: []
      })
    }
    
    // 将列信息添加到对应的表
    for (const row of (columnRows as {
      TABLE_NAME: string
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
    }[])) {
      const table = tableMap.get(row.TABLE_NAME)
      if (table) {
        table.columns.push({
          name: row.COLUMN_NAME,
          type: row.DATA_TYPE,
          columnType: row.COLUMN_TYPE,
          nullable: row.IS_NULLABLE === 'YES',
          primaryKey: row.COLUMN_KEY === 'PRI',
          autoIncrement: row.EXTRA.includes('auto_increment'),
          defaultValue: row.COLUMN_DEFAULT || undefined,
          characterSet: row.CHARACTER_SET_NAME || undefined,
          collation: row.COLLATION_NAME || undefined,
          comment: row.COLUMN_COMMENT || undefined
        })
      }
    }
    
    return Array.from(tableMap.values())
  }

  /**
   * 获取表的列信息
   */
  async getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 获取视图列表
   */
  async getViews(connectionId: string, database: string): Promise<ViewMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
  async getFunctions(connectionId: string, database: string): Promise<FunctionMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 获取表的索引信息
   */
  async getIndexes(connectionId: string, database: string, table: string): Promise<IndexMeta[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 获取表的建表语句
   */
  async getTableCreateSql(connectionId: string, database: string, table: string): Promise<string> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 执行 SQL 查询
   */
  async executeQuery(
    connectionId: string,
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    let connection
    try {
      connection = await this.getConnectionWithReconnect(connectionId)
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
    
    const maxRows = options?.maxRows || Defaults.MAX_ROWS
    const currentDatabase = options?.currentDatabase
    
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
    this.runningQueries.set(queryId, { connectionId, threadId })
    
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
          
          if (isSelect && !this.hasLimit(statement)) {
            // 移除末尾的分号和空白，再添加 LIMIT
            execSql = statement.replace(/;\s*$/, '').trim()
            execSql = `${execSql} LIMIT ${maxRows}`
          }
          
          const [rows, fields] = await connection.query(execSql)
          const executionTime = Date.now() - stmtStartTime
          
          if (Array.isArray(rows) && fields) {
            // 解析单表信息
            const tableInfo = this.parseSingleTableQuery(statement)
            let editable = false
            let primaryKeys: string[] = []
            let tableName: string | undefined
            let databaseName: string | undefined
            
            if (tableInfo && currentDatabase) {
              databaseName = tableInfo.databaseName || currentDatabase
              tableName = tableInfo.tableName
              primaryKeys = await this.getTablePrimaryKeys(connectionId, databaseName, tableName)
              editable = primaryKeys.length > 0
            }
            
            // SELECT 结果
            const resultSet: QueryResultSet = {
              type: 'resultset',
              columns: (fields as { name: string; type: number }[]).map(f => ({
                name: f.name,
                type: this.getTypeName(f.type),
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
            const affectedRowsKey = result.affectedRows === 1 ? 'result.rowAffected' : 'result.rowsAffected'
            const affectedRowsText = t(affectedRowsKey).replace('{count}', String(result.affectedRows))
            const message: QueryMessage = {
              type: 'message',
              affectedRows: result.affectedRows,
              message: `${affectedRowsText}${result.insertId ? `, Insert ID: ${result.insertId}` : ''}`,
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
      this.runningQueries.delete(queryId)
    }
    
    return results
  }

  /**
   * 取消正在执行的查询
   */
  async cancelQuery(connectionId: string): Promise<boolean> {
    try {
      const connection = await this.getConnectionWithReconnect(connectionId)
      if (!connection) {
        return false
      }
      
      // 找到该连接的正在执行的查询
      for (const [queryId, info] of this.runningQueries) {
        if (info.connectionId === connectionId) {
          try {
            await connection.query(`KILL QUERY ${info.threadId}`)
            this.runningQueries.delete(queryId)
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
  async explainQuery(connectionId: string, sql: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
    let connection
    try {
      connection = await this.getConnectionWithReconnect(connectionId)
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
   * 更新单元格值
   */
  async updateCell(
    connectionId: string,
    database: string,
    table: string,
    primaryKeys: { column: string; value: unknown }[],
    column: string,
    newValue: unknown
  ): Promise<{ success: boolean; message?: string }> {
    let connection
    try {
      connection = await this.getConnectionWithReconnect(connectionId)
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

  /**
   * 批量执行 SQL 语句（带事务支持）
   */
  async executeBatch(
    connectionId: string,
    sqls: string[]
  ): Promise<{ success: boolean; message?: string; results?: Array<{ sql: string; affectedRows: number }> }> {
    let connection
    try {
      connection = await this.getConnectionWithReconnect(connectionId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '数据库连接已断开，重连失败' }
    }
    
    if (!connection) {
      return { success: false, message: '连接不存在' }
    }
    
    if (sqls.length === 0) {
      return { success: false, message: '没有要执行的 SQL 语句' }
    }
    
    const results: Array<{ sql: string; affectedRows: number }> = []
    
    try {
      // 开始事务
      await connection.query('START TRANSACTION')
      
      for (const sql of sqls) {
        try {
          const [result] = await connection.query(sql)
          const res = result as { affectedRows: number }
          results.push({ sql, affectedRows: res.affectedRows || 0 })
        } catch (error: unknown) {
          // 执行失败，回滚事务
          await connection.query('ROLLBACK')
          const err = error as { message?: string }
          return { success: false, message: `执行失败: ${err.message || '未知错误'}\nSQL: ${sql}` }
        }
      }
      
      // 提交事务
      await connection.query('COMMIT')
      
      return { success: true, results }
    } catch (error: unknown) {
      // 发生错误，尝试回滚
      try {
        await connection.query('ROLLBACK')
      } catch {
        // 忽略回滚错误
      }
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  }

  /**
   * 执行 DDL 语句
   */
  async executeDDL(connectionId: string, sql: string): Promise<{ success: boolean; message?: string }> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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

  // ==================== MySQL 特有功能 ====================

  /**
   * 获取可用的字符集列表
   */
  async getCharsets(connectionId: string): Promise<{ charset: string; defaultCollation: string; description: string }[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
  async getCollations(connectionId: string, charset?: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
  async getEngines(connectionId: string): Promise<{ engine: string; support: string; comment: string; isDefault: boolean }[]> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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
  async getDefaultCharset(connectionId: string, database: string): Promise<{ charset: string; collation: string }> {
    const connection = await this.getConnectionWithReconnect(connectionId)
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

  // ==================== 私有方法 ====================

  /**
   * 创建 MySQL 连接
   */
  private async createConnection(config: ConnectionConfig): Promise<Connection> {
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
   * 获取活跃连接（带自动重连）
   */
  private async getConnectionWithReconnect(connectionId: string): Promise<Connection | undefined> {
    const info = this.connections.get(connectionId)
    if (!info) {
      return undefined
    }
    
    // 检查连接是否有效
    const isAlive = await this.isConnectionAlive(info.connection)
    
    if (isAlive) {
      return info.connection
    }
    
    // 连接已断开，尝试重连
    console.log(`[MySQLDriver] 连接 ${connectionId} 已断开，尝试重连...`)
    
    try {
      // 尝试关闭旧连接（忽略错误）
      try {
        await info.connection.end()
      } catch {
        // 忽略
      }
      
      // 创建新连接
      const newConnection = await this.createConnection(info.config)
      
      // 更新连接池
      this.connections.set(connectionId, { connection: newConnection, config: info.config })
      
      console.log(`[MySQLDriver] 连接 ${connectionId} 重连成功`)
      return newConnection
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.error(`[MySQLDriver] 连接 ${connectionId} 重连失败:`, err.message)
      // 重连失败，从连接池中移除
      this.connections.delete(connectionId)
      throw new Error(`数据库连接已断开，重连失败: ${err.message || '未知错误'}`)
    }
  }

  /**
   * 检查连接是否存活
   */
  private async isConnectionAlive(connection: Connection): Promise<boolean> {
    try {
      await connection.ping()
      return true
    } catch {
      return false
    }
  }

  /**
   * 解析 SQL 获取单表信息
   */
  private parseSingleTableQuery(sql: string): { tableName: string; databaseName?: string } | null {
    const trimmed = sql.trim()
    
    // 只处理 SELECT 语句
    if (!/^\s*SELECT\s/i.test(trimmed)) {
      return null
    }
    
    // 简单解析：匹配 FROM 后的表名
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
  private async getTablePrimaryKeys(
    connectionId: string,
    database: string,
    table: string
  ): Promise<string[]> {
    try {
      const connection = await this.getConnectionWithReconnect(connectionId)
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
   * 检查 SQL 是否已有 LIMIT
   */
  private hasLimit(sql: string): boolean {
    return /\bLIMIT\s+\d+/i.test(sql)
  }

  /**
   * 获取 MySQL 类型名称
   */
  private getTypeName(typeCode: number): string {
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
}
