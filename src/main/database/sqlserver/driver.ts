/**
 * SQL Server 数据库驱动实现
 * 仅负责系统操作（连接管理 + 元数据查询），使用共享连接池
 * 用户查询操作已迁移到 SqlServerSessionManager（session.ts）
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
  SqlServerOptions
} from '@shared/types'
import { Defaults } from '@shared/constants'
import type { IDatabaseDriver } from '../core/interface'

// 连接信息（包含连接池和配置）
interface SqlServerConnectionInfo {
  pool: sql.ConnectionPool
  config: ConnectionConfig
}

/**
 * SQL Server 驱动实现
 * 仅负责系统操作（连接管理 + 元数据查询），使用共享连接池
 */
export class SqlServerDriver implements IDatabaseDriver {
  readonly type = 'sqlserver'
  
  // 系统共享连接池：每个 connectionId 一个，用于元数据查询
  private connections = new Map<string, SqlServerConnectionInfo>()

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
        s.name AS schema_name,
        ep.value AS table_comment
      FROM sys.tables t
      INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      LEFT JOIN sys.extended_properties ep 
        ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 
        AND ep.name = 'MS_Description'
      ORDER BY s.name, t.name
    `)
    
    return result.recordset.map(r => ({
      name: r.table_name,
      comment: r.table_comment || undefined,
      schema: r.schema_name,
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
        s.name AS schema_name,
        ep.value AS table_comment
      FROM sys.tables t
      INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      LEFT JOIN sys.extended_properties ep 
        ON ep.major_id = t.object_id 
        AND ep.minor_id = 0 
        AND ep.name = 'MS_Description'
      ORDER BY s.name, t.name
    `)
    
    // 一次性获取所有表的列信息
    const columnsResult = await pool.request().query(`
      SELECT 
        s.name AS schema_name,
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
        dc.name AS default_constraint_name,
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
      ORDER BY s.name, t.name, c.column_id
    `)
    
    // 构建表映射（使用 schema.table 作为 key）
    const tableMap = new Map<string, TableMeta>()
    
    for (const row of tablesResult.recordset) {
      const key = `${row.schema_name}.${row.table_name}`
      tableMap.set(key, {
        name: row.table_name,
        schema: row.schema_name,
        comment: row.table_comment || undefined,
        columns: []
      })
    }
    
    // 将列信息添加到对应的表
    for (const row of columnsResult.recordset) {
      const key = `${row.schema_name}.${row.table_name}`
      const table = tableMap.get(key)
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
          defaultConstraintName: row.default_constraint_name || undefined,
          comment: row.column_comment || undefined
        })
      }
    }
    
    return Array.from(tableMap.values())
  }

  /**
   * 获取表的列信息
   */
  async getColumns(connectionId: string, database: string, table: string, schema?: string): Promise<ColumnMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const schemaFilter = schema || 'dbo'
    const result = await pool.request()
      .input('table', sql.NVarChar, table)
      .input('schema', sql.NVarChar, schemaFilter)
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
          dc.name AS default_constraint_name,
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
        WHERE t.name = @table AND s.name = @schema
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
      defaultConstraintName: r.default_constraint_name || undefined,
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
  async getIndexes(connectionId: string, database: string, table: string, schema?: string): Promise<IndexMeta[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    const schemaFilter = schema || 'dbo'
    const result = await pool.request()
      .input('table', sql.NVarChar, table)
      .input('schema', sql.NVarChar, schemaFilter)
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
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        WHERE t.name = @table AND s.name = @schema AND i.name IS NOT NULL
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
  async getTableCreateSql(connectionId: string, database: string, table: string, schema?: string): Promise<string> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }
    
    const schemaName = schema || 'dbo'
    
    // 切换到指定数据库
    await pool.request().query(`USE [${database}]`)
    
    // 获取列信息
    const columns = await this.getColumns(connectionId, database, table, schemaName)
    
    // 获取主键信息
    const pkResult = await pool.request()
      .input('table', sql.NVarChar, table)
      .input('schema', sql.NVarChar, schemaName)
      .query(`
        SELECT 
          i.name AS pk_name,
          c.name AS column_name
        FROM sys.indexes i
        INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        INNER JOIN sys.tables t ON i.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        WHERE t.name = @table AND s.name = @schema AND i.is_primary_key = 1
        ORDER BY ic.key_ordinal
      `)
    
    // 构建 CREATE TABLE 语句
    let createSql = `CREATE TABLE [${schemaName}].[${table}] (\n`
    
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

  // ==================== SQL Server 特有功能 ====================

  /**
   * 执行 DDL 语句（系统级操作，使用共享连接池）
   */
  async executeDDL(connectionId: string, ddlSql: string): Promise<{ success: boolean; message?: string }> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      return { success: false, message: '连接不存在' }
    }
    try {
      // CREATE/DROP DATABASE 必须在 master 上下文中执行
      // 使用 batch() 将 USE master 和 DDL 合并执行，确保在同一连接上
      const isDatabaseDDL = /^\s*(CREATE|ALTER|DROP)\s+DATABASE\b/i.test(ddlSql)
      if (isDatabaseDDL) {
        await pool.request().batch(`USE [master]; ${ddlSql}`)
      } else {
        await pool.request().query(ddlSql)
      }
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '执行失败' }
    }
  }

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

  /**
   * 获取排序规则列表（SQL Server）
   */
  async getCollations(connectionId: string, _charset?: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]> {
    const pool = await this.getPoolWithReconnect(connectionId)
    if (!pool) {
      throw new Error('连接不存在')
    }

    const result = await pool.request().query(`SELECT name FROM sys.fn_helpcollations() ORDER BY name`)
    return result.recordset.map((row: { name: string }) => ({
      collation: row.name,
      charset: '',
      isDefault: false
    }))
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
}
