/**
 * SQL Server 数据库驱动实现
 */

import sql from 'mssql'
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
  ExplainNode,
  SqlServerOptions
} from '@shared/types'
import { Defaults } from '@shared/constants'
import type { IDatabaseDriver, QueryOptions } from '../core/interface'
import { t } from '../../i18n'

// 连接信息（包含连接池和配置）
interface SqlServerConnectionInfo {
  pool: sql.ConnectionPool
  config: ConnectionConfig
}

/**
 * 序列化值，将不可克隆的类型转换为可序列化的格式
 * Electron IPC 无法克隆 BigInt、Buffer、Uint8Array 等特殊类型
 */
function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }
  
  // 处理 BigInt
  if (typeof value === 'bigint') {
    return value.toString()
  }
  
  // 处理 Buffer
  if (Buffer.isBuffer(value)) {
    return '0x' + value.toString('hex').toUpperCase()
  }
  
  // 处理 Uint8Array (SQL Server timestamp/rowversion 返回此类型)
  if (value instanceof Uint8Array) {
    return '0x' + Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  }
  
  // 处理 ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return '0x' + Array.from(new Uint8Array(value)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  }
  
  // 处理 Date
  if (value instanceof Date) {
    return value.toISOString()
  }
  
  // 处理数组
  if (Array.isArray(value)) {
    return value.map(serializeValue)
  }
  
  // 处理对象 - 检查是否为普通对象
  if (typeof value === 'object') {
    // 检查对象的构造函数，只处理普通对象
    const proto = Object.getPrototypeOf(value)
    if (proto === Object.prototype || proto === null) {
      const result: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = serializeValue(val)
      }
      return result
    }
    // 对于其他复杂对象，尝试转为字符串
    try {
      return String(value)
    } catch {
      return '[Object]'
    }
  }
  
  return value
}

/**
 * 序列化行数据
 */
function serializeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => {
    const serializedRow: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row)) {
      serializedRow[key] = serializeValue(value)
    }
    return serializedRow
  })
}

/**
 * SQL Server 驱动实现
 */
export class SqlServerDriver implements IDatabaseDriver {
  readonly type = 'sqlserver'
  
  // 活跃连接池
  private connections = new Map<string, SqlServerConnectionInfo>()
  
  // 正在执行的查询请求（用于取消）
  private runningRequests = new Map<string, sql.Request>()

  /**
   * 测试数据库连接
   */
  async testConnection(config: ConnectionConfig): Promise<TestConnectionResult> {
    let pool: sql.ConnectionPool | null = null
    try {
      pool = await this.createConnection(config)
      
      // 获取服务器版本
      const result = await pool.request().query('SELECT @@VERSION as version')
      const version = result.recordset[0]?.version || 'Unknown'
      // 提取版本号（只取第一行）
      const versionLine = version.split('\n')[0].trim()
      
      return {
        success: true,
        message: '连接成功',
        serverVersion: versionLine
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string; originalError?: { code?: string } }
      let message = '连接失败'
      
      const errorCode = err.code || err.originalError?.code
      
      if (errorCode === 'ETIMEDOUT' || errorCode === 'ECONNREFUSED') {
        message = '无法连接到服务器，请检查服务地址'
      } else if (errorCode === 'ELOGIN') {
        message = '认证失败，请检查用户名和密码'
      } else if (errorCode === 'ENOTOPEN') {
        message = '无法打开数据库连接'
      } else if (err.message) {
        message = err.message
      }
      
      return {
        success: false,
        message
      }
    } finally {
      if (pool) {
        await pool.close()
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
    
    const pool = await this.createConnection(config)
    
    // 获取服务器版本
    const result = await pool.request().query('SELECT @@VERSION as version')
    const version = result.recordset[0]?.version?.split('\n')[0].trim() || 'Unknown'
    
    this.connections.set(config.id, { pool, config })
    
    return { version }
  }

  /**
   * 断开数据库连接
   */
  async disconnect(connectionId: string): Promise<void> {
    const info = this.connections.get(connectionId)
    if (info) {
      try {
        await info.pool.close()
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
      await info.pool.request().query('SELECT 1')
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取数据库版本
   */
  async getVersion(connectionId: string): Promise<string | null> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) return null
    
    try {
      const result = await pool.request().query('SELECT @@VERSION as version')
      return result.recordset[0]?.version?.split('\n')[0].trim() || null
    } catch {
      return null
    }
  }

  /**
   * 获取数据库列表
   */
  async getDatabases(connectionId: string): Promise<string[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    const result = await pool.request().query(`
      SELECT name 
      FROM sys.databases 
      WHERE state_desc = 'ONLINE'
      ORDER BY name
    `)
    
    return result.recordset.map(r => r.name)
  }

  /**
   * 获取表列表
   */
  async getTables(connectionId: string, database: string): Promise<TableMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request().query(`
      SELECT 
        t.name AS table_name,
        ep.value AS table_comment
      FROM sys.tables t
      LEFT JOIN sys.extended_properties ep 
        ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 
        AND ep.name = 'MS_Description'
      WHERE SCHEMA_NAME(t.schema_id) = 'dbo'
      ORDER BY t.name
    `)
    
    return result.recordset.map(r => ({
      name: r.table_name,
      comment: r.table_comment || undefined,
      columns: []
    }))
  }

  /**
   * 获取表列表（包含列信息）
   * 一次性获取所有表及其列信息，用于 Language Server 元数据加载
   */
  async getTablesWithColumns(connectionId: string, database: string): Promise<TableMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    // 获取所有表
    const tablesResult = await pool.request().query(`
      SELECT 
        t.name AS table_name,
        ep.value AS table_comment
      FROM sys.tables t
      LEFT JOIN sys.extended_properties ep 
        ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 
        AND ep.name = 'MS_Description'
      WHERE SCHEMA_NAME(t.schema_id) = 'dbo'
      ORDER BY t.name
    `)
    
    // 一次性获取所有表的列信息
    const columnsResult = await pool.request().query(`
      SELECT 
        t.name AS table_name,
        c.name AS column_name,
        ty.name AS data_type,
        ty.name + 
          CASE 
            WHEN ty.name IN ('varchar', 'nvarchar', 'char', 'nchar', 'varbinary') 
              THEN '(' + IIF(c.max_length = -1, 'MAX', 
                IIF(ty.name IN ('nvarchar', 'nchar'), CAST(c.max_length/2 AS VARCHAR), CAST(c.max_length AS VARCHAR))) + ')'
            WHEN ty.name IN ('decimal', 'numeric') 
              THEN '(' + CAST(c.precision AS VARCHAR) + ',' + CAST(c.scale AS VARCHAR) + ')'
            WHEN ty.name IN ('datetime2', 'time', 'datetimeoffset')
              THEN '(' + CAST(c.scale AS VARCHAR) + ')'
            ELSE ''
          END AS column_type,
        c.is_nullable,
        CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS is_primary_key,
        c.is_identity,
        ic.seed_value,
        ic.increment_value,
        dc.definition AS default_value,
        ep.value AS column_comment,
        c.column_id
      FROM sys.columns c
      INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      INNER JOIN sys.tables t ON c.object_id = t.object_id
      INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      LEFT JOIN (
        SELECT ic.column_id, ic.object_id
        FROM sys.index_columns ic
        INNER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
        WHERE i.is_primary_key = 1
      ) pk ON c.column_id = pk.column_id AND c.object_id = pk.object_id
      LEFT JOIN sys.identity_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
      LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
      WHERE s.name = 'dbo'
      ORDER BY t.name, c.column_id
    `)
    
    // 构建表映射
    const tableMap = new Map<string, TableMeta>()
    
    for (const row of tablesResult.recordset) {
      tableMap.set(row.table_name, {
        name: row.table_name,
        comment: row.table_comment || undefined,
        columns: []
      })
    }
    
    // 将列信息添加到对应的表
    for (const row of columnsResult.recordset) {
      const table = tableMap.get(row.table_name)
      if (table) {
        table.columns.push({
          name: row.column_name,
          type: row.data_type,
          columnType: row.column_type,
          nullable: row.is_nullable === true || row.is_nullable === 1,
          primaryKey: row.is_primary_key === 1,
          autoIncrement: row.is_identity === true || row.is_identity === 1,
          isIdentity: row.is_identity === true || row.is_identity === 1,
          seed: row.seed_value !== null ? Number(row.seed_value) : undefined,
          increment: row.increment_value !== null ? Number(row.increment_value) : undefined,
          defaultValue: row.default_value ? this.cleanDefaultValue(row.default_value) : undefined,
          comment: row.column_comment || undefined
        })
      }
    }
    
    return Array.from(tableMap.values())
  }

  /**
   * 获取表的列信息
   */
  async getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request()
      .input('table', sql.NVarChar, table)
      .query(`
        SELECT 
          c.name AS column_name,
          ty.name AS data_type,
          ty.name + 
            CASE 
              WHEN ty.name IN ('varchar', 'nvarchar', 'char', 'nchar', 'varbinary') 
                THEN '(' + IIF(c.max_length = -1, 'MAX', 
                  IIF(ty.name IN ('nvarchar', 'nchar'), CAST(c.max_length/2 AS VARCHAR), CAST(c.max_length AS VARCHAR))) + ')'
              WHEN ty.name IN ('decimal', 'numeric') 
                THEN '(' + CAST(c.precision AS VARCHAR) + ',' + CAST(c.scale AS VARCHAR) + ')'
              WHEN ty.name IN ('datetime2', 'time', 'datetimeoffset')
                THEN '(' + CAST(c.scale AS VARCHAR) + ')'
              ELSE ''
            END AS column_type,
          c.is_nullable,
          CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS is_primary_key,
          c.is_identity,
          ic.seed_value,
          ic.increment_value,
          dc.definition AS default_value,
          ep.value AS column_comment
        FROM sys.columns c
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        LEFT JOIN (
          SELECT ic.column_id, ic.object_id
          FROM sys.index_columns ic
          INNER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
          WHERE i.is_primary_key = 1
        ) pk ON c.column_id = pk.column_id AND c.object_id = pk.object_id
        LEFT JOIN sys.identity_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
        LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
        LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
        WHERE t.name = @table AND s.name = 'dbo'
        ORDER BY c.column_id
      `)
    
    return result.recordset.map(r => ({
      name: r.column_name,
      type: r.data_type,
      columnType: r.column_type,
      nullable: r.is_nullable === true || r.is_nullable === 1,
      primaryKey: r.is_primary_key === 1,
      autoIncrement: r.is_identity === true || r.is_identity === 1,
      isIdentity: r.is_identity === true || r.is_identity === 1,
      seed: r.seed_value !== null ? Number(r.seed_value) : undefined,
      increment: r.increment_value !== null ? Number(r.increment_value) : undefined,
      defaultValue: r.default_value ? this.cleanDefaultValue(r.default_value) : undefined,
      comment: r.column_comment || undefined
    }))
  }

  /**
   * 获取视图列表
   */
  async getViews(connectionId: string, database: string): Promise<ViewMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request().query(`
      SELECT name
      FROM sys.views
      WHERE SCHEMA_NAME(schema_id) = 'dbo'
      ORDER BY name
    `)
    
    return result.recordset.map(r => ({
      name: r.name,
      columns: []
    }))
  }

  /**
   * 获取函数和存储过程列表
   */
  async getFunctions(connectionId: string, database: string): Promise<FunctionMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request().query(`
      SELECT 
        name,
        type_desc
      FROM sys.objects
      WHERE type IN ('P', 'FN', 'IF', 'TF')
        AND SCHEMA_NAME(schema_id) = 'dbo'
      ORDER BY name
    `)
    
    return result.recordset.map(r => ({
      name: r.name,
      type: r.type_desc === 'SQL_STORED_PROCEDURE' ? 'PROCEDURE' : 'FUNCTION'
    }))
  }

  /**
   * 获取表的索引信息
   */
  async getIndexes(connectionId: string, database: string, table: string): Promise<IndexMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request()
      .input('table', sql.NVarChar, table)
      .query(`
        SELECT 
          i.name AS index_name,
          i.is_primary_key,
          i.is_unique,
          i.type_desc AS index_type,
          ic.key_ordinal,
          c.name AS column_name,
          ic.is_descending_key
        FROM sys.indexes i
        INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        INNER JOIN sys.tables t ON i.object_id = t.object_id
        WHERE t.name = @table AND i.name IS NOT NULL
        ORDER BY i.index_id, ic.key_ordinal
      `)
    
    // 按索引名分组
    const indexMap = new Map<string, IndexMeta>()
    
    for (const row of result.recordset) {
      const indexName = row.index_name
      
      if (!indexMap.has(indexName)) {
        // 确定索引类型
        let indexType: IndexMeta['type'] = 'INDEX'
        if (row.is_primary_key) {
          indexType = 'PRIMARY'
        } else if (row.is_unique) {
          indexType = 'UNIQUE'
        } else if (row.index_type === 'CLUSTERED') {
          indexType = 'INDEX'
        }
        
        indexMap.set(indexName, {
          name: indexName,
          type: indexType,
          columns: []
        })
      }
      
      const index = indexMap.get(indexName)!
      const columnMeta: IndexColumnMeta = {
        columnName: row.column_name,
        seqInIndex: row.key_ordinal,
        order: row.is_descending_key ? 'DESC' : 'ASC'
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
   * 获取表的建表语句（SQL Server 没有直接的 SHOW CREATE TABLE，需要手动构建）
   */
  async getTableCreateSql(connectionId: string, database: string, table: string): Promise<string> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    // 获取列信息
    const columns = await this.getColumns(connectionId, database, table)
    
    // 获取主键信息
    const pkResult = await pool.request()
      .input('table', sql.NVarChar, table)
      .query(`
        SELECT 
          i.name AS pk_name,
          c.name AS column_name
        FROM sys.indexes i
        INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        INNER JOIN sys.tables t ON i.object_id = t.object_id
        WHERE t.name = @table AND i.is_primary_key = 1
        ORDER BY ic.key_ordinal
      `)
    
    // 构建 CREATE TABLE 语句
    let createSql = `CREATE TABLE [dbo].[${table}] (\n`
    
    const columnDefs: string[] = []
    for (const col of columns) {
      let colDef = `  [${col.name}] ${col.columnType}`
      
      if (col.isIdentity) {
        const seed = col.seed ?? 1
        const increment = col.increment ?? 1
        colDef += ` IDENTITY(${seed},${increment})`
      }
      
      if (!col.nullable) {
        colDef += ' NOT NULL'
      } else {
        colDef += ' NULL'
      }
      
      if (col.defaultValue !== undefined) {
        colDef += ` DEFAULT ${col.defaultValue}`
      }
      
      columnDefs.push(colDef)
    }
    
    // 添加主键约束
    if (pkResult.recordset.length > 0) {
      const pkName = pkResult.recordset[0].pk_name
      const pkColumns = pkResult.recordset.map(r => `[${r.column_name}]`).join(', ')
      columnDefs.push(`  CONSTRAINT [${pkName}] PRIMARY KEY CLUSTERED (${pkColumns})`)
    }
    
    createSql += columnDefs.join(',\n')
    createSql += '\n)'
    
    return createSql
  }

  /**
   * 执行 SQL 查询
   */
  async executeQuery(
    connectionId: string,
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    let pool: sql.ConnectionPool | undefined
    try {
      pool = await this.getPoolWithReconnect(connectionId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return [{
        type: 'error',
        code: 'E4001',
        message: err.message || '数据库连接已断开，重连失败'
      }]
    }
    
    if (!pool) {
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
        await pool.request().query(`USE [${currentDatabase}]`)
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string }
        return [{
          type: 'error',
          code: err.code || 'E4003',
          message: `切换数据库失败: ${err.message || currentDatabase}`
        }]
      }
    }
    const results: QueryResult[] = []
    
    // 分割多条 SQL 语句（按 GO 分隔）
    const batches = this.splitByGo(trimmedSql)
    
    for (const batch of batches) {
      if (!batch.trim()) continue
      
      // 按分号分割语句
      const statements = this.splitStatements(batch)
      
      for (const statement of statements) {
        if (!statement.trim()) continue
        
        const stmtStartTime = Date.now()
        const queryId = `${connectionId}-${Date.now()}`
        
        try {
          // 判断是否是 SELECT 语句，添加 TOP
          const isSelect = /^\s*SELECT\s/i.test(statement)
          let execSql = statement
          
          if (isSelect && !this.hasTop(statement) && !this.hasOffset(statement)) {
            // 在 SELECT 后添加 TOP
            execSql = statement.replace(/^\s*SELECT\s/i, `SELECT TOP ${maxRows} `)
          }
          
          // 创建请求对象用于可能的取消
          const request = pool.request()
          this.runningRequests.set(queryId, request)
          const result = await request.query(execSql)
          const executionTime = Date.now() - stmtStartTime
          
          // 处理可能的多个结果集
          const recordsets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[]
          if (recordsets && recordsets.length > 0) {
            for (let i = 0; i < recordsets.length; i++) {
              const recordset = recordsets[i]
              const columns = recordset.columns
              
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
              
              // SELECT 结果 - 序列化行数据以确保可以通过 IPC 传输
              const serializedRows = serializeRows(recordset as unknown as Record<string, unknown>[])
              
              // 构建列信息 - 确保只包含可序列化的数据
              const serializedColumns: { name: string; type: string; isPrimaryKey: boolean }[] = []
              if (columns) {
                for (const name of Object.keys(columns)) {
                  serializedColumns.push({
                    name: String(name),
                    type: this.getTypeName(columns[name].type),
                    isPrimaryKey: primaryKeys.includes(name)
                  })
                }
              }
              
              const resultSet: QueryResultSet = {
                type: 'resultset',
                columns: serializedColumns,
                rows: serializedRows,
                rowCount: recordset.length,
                executionTime: i === 0 ? executionTime : 0,
                editable,
                tableName: tableName ? String(tableName) : undefined,
                databaseName: databaseName ? String(databaseName) : undefined,
                primaryKeys: primaryKeys.length > 0 ? [...primaryKeys] : undefined
              }
              results.push(resultSet)
            }
          } else {
            // INSERT/UPDATE/DELETE 结果
            const affectedRows = result.rowsAffected.reduce((a, b) => a + b, 0)
            const affectedRowsKey = affectedRows === 1 ? 'result.rowAffected' : 'result.rowsAffected'
            const affectedRowsText = t(affectedRowsKey).replace('{count}', String(affectedRows))
            const message: QueryMessage = {
              type: 'message',
              affectedRows,
              message: affectedRowsText,
              executionTime
            }
            results.push(message)
          }
        } catch (error: unknown) {
          const err = error as { code?: string; message?: string; number?: number; state?: string }
          const queryError: QueryError = {
            type: 'error',
            code: err.code || err.number?.toString() || 'E4004',
            message: err.message || 'SQL 执行错误',
            sqlState: err.state
          }
          results.push(queryError)
          // 遇错停止
          break
        } finally {
          this.runningRequests.delete(queryId)
        }
      }
    }
    
    return results
  }

  /**
   * 取消正在执行的查询
   */
  async cancelQuery(connectionId: string): Promise<boolean> {
    // SQL Server 的 mssql 库不支持直接取消查询
    // 但我们可以尝试关闭连接池重新建立连接
    for (const [queryId, request] of this.runningRequests) {
      if (queryId.startsWith(connectionId)) {
        try {
          request.cancel()
          this.runningRequests.delete(queryId)
          return true
        } catch {
          return false
        }
      }
    }
    return false
  }

  /**
   * 获取执行计划
   */
  async explainQuery(connectionId: string, sqlText: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
    let pool: sql.ConnectionPool | undefined
    try {
      pool = await this.getPoolWithReconnect(connectionId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return {
        type: 'error',
        code: 'E4001',
        message: err.message || '数据库连接已断开，重连失败'
      }
    }
    
    if (!pool) {
      return {
        type: 'error',
        code: 'E4001',
        message: '请先选择数据库连接'
      }
    }
    
    // 只支持 SELECT 语句
    if (!/^\s*SELECT\s/i.test(sqlText.trim())) {
      return {
        type: 'error',
        code: 'E4004',
        message: '执行计划仅支持 SELECT 语句'
      }
    }
    
    // 如果指定了数据库，先切换到该数据库
    if (currentDatabase) {
      try {
        await pool.request().query(`USE [${currentDatabase}]`)
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
      // 使用 SET SHOWPLAN_TEXT ON 获取文本格式的执行计划
      await pool.request().query('SET SHOWPLAN_TEXT ON')
      const result = await pool.request().query(sqlText)
      await pool.request().query('SET SHOWPLAN_TEXT OFF')
      
      // 解析执行计划结果
      const nodes: ExplainNode[] = []
      let nodeId = 0
      
      const recordsets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[]
      if (recordsets && recordsets.length > 0) {
        for (const recordset of recordsets) {
          for (const row of recordset) {
            // SHOWPLAN_TEXT 返回的是 StmtText 列
            const planText = row['StmtText'] || row[Object.keys(row)[0]]
            if (planText) {
              nodes.push({
                id: nodeId++,
                selectType: 'SIMPLE',
                table: '',
                type: 'TEXT',
                rows: 0,
                filtered: 0,
                extra: String(planText)
              })
            }
          }
        }
      }
      
      return {
        nodes,
        raw: recordsets as unknown as Record<string, unknown>[]
      }
    } catch (error: unknown) {
      // 确保关闭 SHOWPLAN
      try {
        await pool.request().query('SET SHOWPLAN_TEXT OFF')
      } catch {
        // 忽略
      }
      
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
    let pool: sql.ConnectionPool | undefined
    try {
      pool = await this.getPoolWithReconnect(connectionId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '数据库连接已断开，重连失败' }
    }
    
    if (!pool) {
      return { success: false, message: '连接不存在' }
    }
    
    try {
      // 切换到指定数据库
      await pool.request().query(`USE [${database}]`)
      
      // 构建 WHERE 条件
      const whereConditions = primaryKeys.map(pk => `[${pk.column}] = @pk_${pk.column}`).join(' AND ')
      
      // 构建 UPDATE 语句
      const sqlText = `UPDATE [dbo].[${table}] SET [${column}] = @newValue WHERE ${whereConditions}`
      
      const request = pool.request()
      request.input('newValue', newValue)
      
      // 添加主键参数
      for (const pk of primaryKeys) {
        request.input(`pk_${pk.column}`, pk.value)
      }
      
      const result = await request.query(sqlText)
      const affectedRows = result.rowsAffected[0] || 0
      
      if (affectedRows === 1) {
        return { success: true }
      } else if (affectedRows === 0) {
        return { success: false, message: '未找到匹配的记录' }
      } else {
        return { success: false, message: `影响了 ${affectedRows} 行，请检查主键是否唯一` }
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
    let pool: sql.ConnectionPool | undefined
    try {
      pool = await this.getPoolWithReconnect(connectionId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '数据库连接已断开，重连失败' }
    }
    
    if (!pool) {
      return { success: false, message: '连接不存在' }
    }
    
    if (sqls.length === 0) {
      return { success: false, message: '没有要执行的 SQL 语句' }
    }
    
    const results: Array<{ sql: string; affectedRows: number }> = []
    const transaction = new sql.Transaction(pool)
    
    try {
      // 开始事务
      await transaction.begin()
      
      for (const sqlText of sqls) {
        try {
          const request = new sql.Request(transaction)
          const result = await request.query(sqlText)
          const affectedRows = result.rowsAffected.reduce((a, b) => a + b, 0)
          results.push({ sql: sqlText, affectedRows })
        } catch (error: unknown) {
          // 执行失败，回滚事务
          await transaction.rollback()
          const err = error as { message?: string }
          return { success: false, message: `执行失败: ${err.message || '未知错误'}\nSQL: ${sqlText}` }
        }
      }
      
      // 提交事务
      await transaction.commit()
      
      return { success: true, results }
    } catch (error: unknown) {
      // 发生错误，尝试回滚
      try {
        await transaction.rollback()
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
  async executeDDL(connectionId: string, sqlText: string): Promise<{ success: boolean; message?: string }> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    try {
      await pool.request().query(sqlText)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string }
      return { 
        success: false, 
        message: err.message || '执行失败'
      }
    }
  }

  // ==================== SQL Server 特有功能 ====================

  /**
   * 获取 Schema 列表（SQL Server 特有）
   */
  async getSchemas(connectionId: string, database: string): Promise<string[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const result = await pool.request().query(`
      SELECT name 
      FROM sys.schemas 
      WHERE principal_id = 1 
      ORDER BY name
    `)
    
    return result.recordset.map(r => r.name)
  }

  // ==================== 私有方法 ====================

  /**
   * 创建 SQL Server 连接池
   */
  private async createConnection(config: ConnectionConfig): Promise<sql.ConnectionPool> {
    const options = config.options as SqlServerOptions | undefined
    
    const sqlConfig: sql.config = {
      server: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database || undefined,
      options: {
        encrypt: options?.encrypt ?? true,
        trustServerCertificate: options?.trustServerCertificate ?? true,
        enableArithAbort: true
      },
      connectionTimeout: Defaults.CONNECTION_TIMEOUT,
      requestTimeout: Defaults.QUERY_TIMEOUT || 30000
    }

    // Windows 域认证
    if (options?.domain) {
      sqlConfig.domain = options.domain
    }

    return await new sql.ConnectionPool(sqlConfig).connect()
  }

  /**
   * 获取连接池（带自动重连）
   */
  private async getPoolWithReconnect(connectionId: string): Promise<sql.ConnectionPool | undefined> {
    const info = this.connections.get(connectionId)
    if (!info) {
      return undefined
    }
    
    // 检查连接是否有效
    const isAlive = await this.isPoolAlive(info.pool)
    
    if (isAlive) {
      return info.pool
    }
    
    // 连接已断开，尝试重连
    console.log(`[SqlServerDriver] 连接 ${connectionId} 已断开，尝试重连...`)
    
    try {
      // 尝试关闭旧连接（忽略错误）
      try {
        await info.pool.close()
      } catch {
        // 忽略
      }
      
      // 创建新连接
      const newPool = await this.createConnection(info.config)
      
      // 更新连接池
      this.connections.set(connectionId, { pool: newPool, config: info.config })
      
      console.log(`[SqlServerDriver] 连接 ${connectionId} 重连成功`)
      return newPool
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.error(`[SqlServerDriver] 连接 ${connectionId} 重连失败:`, err.message)
      // 重连失败，从连接池中移除
      this.connections.delete(connectionId)
      throw new Error(`数据库连接已断开，重连失败: ${err.message || '未知错误'}`)
    }
  }

  /**
   * 检查连接池是否存活
   */
  private async isPoolAlive(pool: sql.ConnectionPool): Promise<boolean> {
    try {
      await pool.request().query('SELECT 1')
      return true
    } catch {
      return false
    }
  }

  /**
   * 按 GO 分隔符拆分 SQL 批次
   */
  private splitByGo(sql: string): string[] {
    // GO 必须单独一行
    return sql.split(/^\s*GO\s*$/gim)
  }

  /**
   * 按分号分割 SQL 语句（简单实现）
   */
  private splitStatements(sql: string): string[] {
    // 简单按分号分割，不处理字符串中的分号
    // 实际应用中可能需要更复杂的解析
    const statements: string[] = []
    let current = ''
    let inString = false
    let stringChar = ''
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i]
      
      if (inString) {
        current += char
        if (char === stringChar && sql[i + 1] !== stringChar) {
          inString = false
        } else if (char === stringChar && sql[i + 1] === stringChar) {
          current += sql[++i]
        }
      } else if (char === "'" || char === '"') {
        inString = true
        stringChar = char
        current += char
      } else if (char === ';') {
        if (current.trim()) {
          statements.push(current.trim())
        }
        current = ''
      } else {
        current += char
      }
    }
    
    if (current.trim()) {
      statements.push(current.trim())
    }
    
    return statements
  }

  /**
   * 检查 SQL 是否已有 TOP
   */
  private hasTop(sql: string): boolean {
    return /\bSELECT\s+TOP\s+/i.test(sql)
  }

  /**
   * 检查 SQL 是否已有 OFFSET（分页）
   */
  private hasOffset(sql: string): boolean {
    return /\bOFFSET\s+\d+\s+ROWS?\b/i.test(sql)
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
    // 支持 [database].[schema].[table] 或 [schema].[table] 或 [table] 格式
    const fromMatch = trimmed.match(/\bFROM\s+(\[?\w+\]?\.)?(\[?\w+\]?\.)?(\[?\w+\]?)/i)
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
    
    // 解析表名
    const tableName = fromMatch[3].replace(/\[|\]/g, '')
    let databaseName: string | undefined
    
    // 如果有三部分，第一部分是数据库名
    if (fromMatch[1] && fromMatch[2]) {
      databaseName = fromMatch[1].replace(/\[|\]|\./g, '')
    }
    
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
      const pool = await this.getPoolWithReconnect(connectionId)
      if (!pool) return []
      
      // 切换到指定数据库
      await pool.request().query(`USE [${database}]`)
      
      const result = await pool.request()
        .input('table', sql.NVarChar, table)
        .query(`
          SELECT c.name AS column_name
          FROM sys.indexes i
          INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
          INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
          INNER JOIN sys.tables t ON i.object_id = t.object_id
          WHERE t.name = @table AND i.is_primary_key = 1
          ORDER BY ic.key_ordinal
        `)
      
      return result.recordset.map(r => r.column_name)
    } catch {
      return []
    }
  }

  /**
   * 清理默认值（移除外层括号）
   */
  private cleanDefaultValue(value: string): string {
    // SQL Server 的默认值通常带有外层括号，如 ((0)) 或 (N'')
    let cleaned = value
    while (cleaned.startsWith('(') && cleaned.endsWith(')')) {
      const inner = cleaned.slice(1, -1)
      // 检查是否是平衡的括号
      let depth = 0
      let balanced = true
      for (const char of inner) {
        if (char === '(') depth++
        if (char === ')') depth--
        if (depth < 0) {
          balanced = false
          break
        }
      }
      if (balanced && depth === 0) {
        cleaned = inner
      } else {
        break
      }
    }
    return cleaned
  }

  /**
   * 获取 SQL Server 类型名称
   */
  private getTypeName(typeInfo: sql.ISqlType | (() => sql.ISqlType) | sql.ISqlTypeFactory): string {
    // mssql 库的列类型处理
    if (typeof typeInfo === 'function') {
      try {
        const type = (typeInfo as () => sql.ISqlType)()
        return (type as { type?: string }).type || 'UNKNOWN'
      } catch {
        return 'UNKNOWN'
      }
    }
    return (typeInfo as { type?: string }).type || 'UNKNOWN'
  }
}
