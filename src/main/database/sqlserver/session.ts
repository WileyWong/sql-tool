/**
 * SQL Server 会话管理器
 * 每个编辑器 Tab 独占一个 ConnectionPool(min:1, max:1)
 */

import sql from 'mssql'
import type {
  ConnectionConfig,
  SqlServerOptions,
  QueryResult,
  QueryResultSet,
  QueryMessage,
  QueryError,
  ExplainResult,
  ExplainNode
} from '@shared/types'
import { Defaults } from '@shared/constants'
import type { ISessionManager, SessionInfo } from '../core/session-interface'
import type { QueryOptions } from '../core/interface'
import { getConnectionConfig } from '../core/config-store'
import { t } from '../../i18n'

/**
 * 序列化值，将不可克隆的类型转换为可序列化的格式
 */
function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (typeof value === 'bigint') return value.toString()
  if (Buffer.isBuffer(value)) return '0x' + value.toString('hex').toUpperCase()
  if (value instanceof Uint8Array) return '0x' + Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  if (value instanceof ArrayBuffer) return '0x' + Array.from(new Uint8Array(value)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(serializeValue)
  if (typeof value === 'object') {
    const proto = Object.getPrototypeOf(value)
    if (proto === Object.prototype || proto === null) {
      const result: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = serializeValue(val)
      }
      return result
    }
    try { return String(value) } catch { return '[Object]' }
  }
  return value
}

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
 * SQL Server 独占会话
 */
interface SqlServerSession {
  tabId: string
  connectionId: string
  pool: sql.ConnectionPool
  database?: string
  config: ConnectionConfig
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
  /** 正在执行的请求对象，用于取消查询 */
  runningRequest?: sql.Request
  /** 僵尸检测：渲染进程无响应计数 */
  suspiciousCount: number
}

/**
 * SQL Server 会话管理器实现
 */
export class SqlServerSessionManager implements ISessionManager {
  readonly type = 'sqlserver'

  private sessions = new Map<string, SqlServerSession>()
  private connectionSessions = new Map<string, Set<string>>()
  private maxSessionsPerConnection = Defaults.MAX_SESSIONS_PER_CONNECTION
  private zombieTimer: ReturnType<typeof setInterval> | null = null

  // ==================== 会话生命周期 ====================

  async createSession(tabId: string, connectionId: string, database?: string): Promise<void> {
    const currentCount = this.getSessionCount(connectionId)
    if (currentCount >= this.maxSessionsPerConnection) {
      throw new Error(`已达到最大连接数限制(${this.maxSessionsPerConnection})，请关闭部分编辑器后重试`)
    }

    if (this.sessions.has(tabId)) {
      await this.destroySession(tabId)
    }

    const config = getConnectionConfig(connectionId)
    if (!config) throw new Error('连接配置不存在')

    const options = config.options as SqlServerOptions | undefined

    const sqlConfig: sql.config = {
      server: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: database || config.database || undefined,
      options: {
        encrypt: options?.encrypt ?? true,
        trustServerCertificate: options?.trustServerCertificate ?? true,
        enableArithAbort: true
      },
      pool: {
        min: 1,
        max: 1  // 关键：限制为单连接，保证会话隔离
      },
      connectionTimeout: Defaults.CONNECTION_TIMEOUT,
      requestTimeout: Defaults.QUERY_TIMEOUT || 30000
    }

    if (options?.domain) {
      sqlConfig.domain = options.domain
    }

    const pool = await new sql.ConnectionPool(sqlConfig).connect()

    const session: SqlServerSession = {
      tabId,
      connectionId,
      pool,
      database,
      config,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      status: 'active',
      suspiciousCount: 0
    }
    this.sessions.set(tabId, session)

    if (!this.connectionSessions.has(connectionId)) {
      this.connectionSessions.set(connectionId, new Set())
    }
    this.connectionSessions.get(connectionId)!.add(tabId)

    console.log(`[SqlServerSession] 会话已创建: tabId=${tabId}, connectionId=${connectionId}, 当前该服务器会话数: ${this.getSessionCount(connectionId)}`)
  }

  async destroySession(tabId: string): Promise<void> {
    const session = this.sessions.get(tabId)
    if (!session) return

    try {
      await session.pool.close()
    } catch {
      // 忽略关闭错误
    }

    this.connectionSessions.get(session.connectionId)?.delete(tabId)
    if (this.connectionSessions.get(session.connectionId)?.size === 0) {
      this.connectionSessions.delete(session.connectionId)
    }

    this.sessions.delete(tabId)
    console.log(`[SqlServerSession] 会话已销毁: tabId=${tabId}`)
  }

  async destroySessionsByConnection(connectionId: string): Promise<void> {
    const tabIds = this.connectionSessions.get(connectionId)
    if (!tabIds) return

    for (const tabId of [...tabIds]) {
      await this.destroySession(tabId)
    }
  }

  async destroyAllSessions(): Promise<void> {
    for (const tabId of [...this.sessions.keys()]) {
      await this.destroySession(tabId)
    }
  }

  destroyAllSessionsSync(): void {
    for (const [tabId, session] of this.sessions) {
      try {
        session.pool.close().catch(() => {})
      } catch {
        // 忽略
      }
      this.sessions.delete(tabId)
    }
    this.connectionSessions.clear()
  }

  getSessionInfo(tabId: string): SessionInfo | undefined {
    const session = this.sessions.get(tabId)
    if (!session) return undefined
    return {
      tabId: session.tabId,
      connectionId: session.connectionId,
      database: session.database,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      status: session.status
    }
  }

  getSessionCount(connectionId: string): number {
    return this.connectionSessions.get(connectionId)?.size || 0
  }

  async isSessionAlive(tabId: string): Promise<boolean> {
    const session = this.sessions.get(tabId)
    if (!session) return false
    try {
      await session.pool.request().batch('SELECT 1')
      return true
    } catch {
      return false
    }
  }

  // ==================== 查询操作 ====================

  async executeQuery(
    tabId: string,
    sqlText: string,
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    let pool: sql.ConnectionPool
    try {
      pool = await this.getSessionPool(tabId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return [{
        type: 'error',
        code: 'E4001',
        message: err.message || '数据库连接已断开，重连失败'
      }]
    }

    const session = this.sessions.get(tabId)!
    session.lastActiveAt = Date.now()

    const trimmedSql = sqlText.trim()
    if (!trimmedSql) {
      return [{
        type: 'error',
        code: 'E4002',
        message: '请输入 SQL 语句'
      }]
    }

    const maxRows = options?.maxRows || Defaults.MAX_ROWS
    const currentDatabase = options?.currentDatabase

    if (currentDatabase) {
      try {
        await pool.request().batch(`USE [${currentDatabase}]`)
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
    const batches = this.splitByGo(trimmedSql)

    for (const batch of batches) {
      if (!batch.trim()) continue

      const batchStartTime = Date.now()

      // 对整个 batch 做 SELECT TOP 改写（逐条处理 batch 内的 SELECT 语句）
      const execBatch = this.rewriteSelectsInBatch(batch, maxRows)

      try {
        const request = pool.request()
        // 开启 arrayRowMode，避免同名列被合并为数组
        request.arrayRowMode = true
        session.runningRequest = request
        // 使用 batch() 而非 query()，底层走 execSqlBatch 而非 sp_executesql
        // 这样 SET 命令在连接级别生效，临时表、会话状态都能跨 batch 保持
        const result = await request.batch(execBatch)
        const executionTime = Date.now() - batchStartTime

        // arrayRowMode 下 recordsets 中每行是 unknown[]，columns 按索引保留所有列（含同名列）
        const recordsets = result.recordsets as unknown as unknown[][][]

        if (recordsets && recordsets.length > 0) {
          for (let i = 0; i < recordsets.length; i++) {
            const arrayRows = recordsets[i]
            // batch() 不会把 columns 放到 result.columns 上（这是 query() 独有的），
            // 但每个 recordset 数组上有一个非枚举的 columns 属性（由 mssql 内部设置）
            // arrayRowMode 下该属性是数组，保留了所有列（含同名列）
            const columnsInfo = ((arrayRows as any).columns || []) as Array<{
              name: string
              type: any
              index: number
            }>

            // 处理同名列：生成唯一列名
            const uniqueNames: string[] = []
            const nameCount = new Map<string, number>()
            for (const col of columnsInfo) {
              const baseName = col.name
              const count = nameCount.get(baseName) || 0
              if (count > 0) {
                uniqueNames.push(`${baseName}_${count}`)
              } else {
                uniqueNames.push(baseName)
              }
              nameCount.set(baseName, count + 1)
            }

            // 将数组行转换为对象行（使用唯一列名）
            const objectRows: Record<string, unknown>[] = arrayRows.map(row => {
              const obj: Record<string, unknown> = {}
              for (let j = 0; j < uniqueNames.length; j++) {
                obj[uniqueNames[j]] = row[j]
              }
              return obj
            })

            const tableInfo = this.parseSingleTableQuery(batch)
            let editable = false
            let primaryKeys: string[] = []
            let tableName: string | undefined
            let databaseName: string | undefined

            if (tableInfo && currentDatabase) {
              databaseName = tableInfo.databaseName || currentDatabase
              tableName = tableInfo.tableName
              primaryKeys = await this.getTablePrimaryKeys(pool, databaseName, tableName)
              editable = primaryKeys.length > 0
            }

            const serializedRows = serializeRows(objectRows)
            const serializedColumns: { name: string; type: string; isPrimaryKey: boolean }[] =
              uniqueNames.map((name, idx) => ({
                name,
                type: this.getTypeName(columnsInfo[idx].type),
                isPrimaryKey: primaryKeys.includes(columnsInfo[idx].name)
              }))

            const resultSet: QueryResultSet = {
              type: 'resultset',
              columns: serializedColumns,
              rows: serializedRows,
              rowCount: arrayRows.length,
              executionTime: i === 0 ? executionTime : 0,
              editable,
              tableName: tableName ? String(tableName) : undefined,
              databaseName: databaseName ? String(databaseName) : undefined,
              primaryKeys: primaryKeys.length > 0 ? [...primaryKeys] : undefined
            }
            results.push(resultSet)
          }
        } else {
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
        break
      } finally {
        session.runningRequest = undefined
      }
    }

    return results
  }

  async cancelQuery(tabId: string): Promise<boolean> {
    const session = this.sessions.get(tabId)
    if (!session || !session.runningRequest) return false

    try {
      session.runningRequest.cancel()
      return true
    } catch {
      return false
    }
  }

  async explainQuery(tabId: string, sqlText: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
    let pool: sql.ConnectionPool
    try {
      pool = await this.getSessionPool(tabId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return {
        type: 'error',
        code: 'E4001',
        message: err.message || '数据库连接已断开，重连失败'
      }
    }

    const session = this.sessions.get(tabId)!
    session.lastActiveAt = Date.now()

    if (!/^\s*SELECT\s/i.test(sqlText.trim())) {
      return {
        type: 'error',
        code: 'E4004',
        message: '执行计划仅支持 SELECT 语句'
      }
    }

    if (currentDatabase) {
      try {
        await pool.request().batch(`USE [${currentDatabase}]`)
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
      await pool.request().batch('SET SHOWPLAN_TEXT ON')
      const result = await pool.request().batch(sqlText)
      await pool.request().batch('SET SHOWPLAN_TEXT OFF')

      const nodes: ExplainNode[] = []
      let nodeId = 0

      const recordsets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[]
      if (recordsets && recordsets.length > 0) {
        for (const recordset of recordsets) {
          for (const row of recordset) {
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
      try { await pool.request().batch('SET SHOWPLAN_TEXT OFF') } catch { /* 忽略 */ }
      const err = error as { code?: string; message?: string }
      return {
        type: 'error',
        code: err.code || 'E4004',
        message: err.message || '获取执行计划失败'
      }
    }
  }

  async executeBatch(
    tabId: string,
    sqls: string[]
  ): Promise<{ success: boolean; message?: string; results?: Array<{ sql: string; affectedRows: number }> }> {
    let pool: sql.ConnectionPool
    try {
      pool = await this.getSessionPool(tabId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '数据库连接已断开，重连失败' }
    }

    const session = this.sessions.get(tabId)!
    session.lastActiveAt = Date.now()

    if (sqls.length === 0) {
      return { success: false, message: '没有要执行的 SQL 语句' }
    }

    const results: Array<{ sql: string; affectedRows: number }> = []
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      for (const sqlText of sqls) {
        try {
          const request = new sql.Request(transaction)
          const result = await request.query(sqlText)
          const affectedRows = result.rowsAffected.reduce((a, b) => a + b, 0)
          results.push({ sql: sqlText, affectedRows })
        } catch (error: unknown) {
          await transaction.rollback()
          const err = error as { message?: string }
          return { success: false, message: `执行失败: ${err.message || '未知错误'}\nSQL: ${sqlText}` }
        }
      }

      await transaction.commit()
      return { success: true, results }
    } catch (error: unknown) {
      try { await transaction.rollback() } catch { /* 忽略 */ }
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  }

  async executeDDL(tabId: string, sqlText: string): Promise<{ success: boolean; message?: string }> {
    let pool: sql.ConnectionPool
    try {
      pool = await this.getSessionPool(tabId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '连接不存在' }
    }

    const session = this.sessions.get(tabId)!
    session.lastActiveAt = Date.now()

    try {
      await pool.request().batch(sqlText)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '执行失败' }
    }
  }

  // ==================== 僵尸检测 ====================

  startZombieDetection(checkTabExists: (tabId: string) => Promise<boolean>): void {
    if (this.zombieTimer) return

    this.zombieTimer = setInterval(async () => {
      for (const [tabId, session] of this.sessions) {
        if (Date.now() - session.lastActiveAt > Defaults.SESSION_IDLE_TIMEOUT) {
          console.log(`[SqlServerSession] 会话空闲超时: tabId=${tabId}`)
          await this.destroySession(tabId)
          continue
        }

        if (!await this.isSessionAlive(tabId)) {
          console.warn(`[SqlServerSession] 僵尸会话（连接已断开）: tabId=${tabId}`)
          await this.destroySession(tabId)
          continue
        }

        try {
          const exists = await checkTabExists(tabId)
          if (!exists) {
            console.warn(`[SqlServerSession] 僵尸会话（Tab 已关闭）: tabId=${tabId}`)
            await this.destroySession(tabId)
          } else {
            session.suspiciousCount = 0
          }
        } catch {
          session.suspiciousCount++
          if (session.suspiciousCount >= 3) {
            console.warn(`[SqlServerSession] 僵尸会话（渲染进程无响应）: tabId=${tabId}`)
            await this.destroySession(tabId)
          }
        }
      }
    }, Defaults.ZOMBIE_DETECTION_INTERVAL)
  }

  stopZombieDetection(): void {
    if (this.zombieTimer) {
      clearInterval(this.zombieTimer)
      this.zombieTimer = null
    }
  }

  // ==================== 私有方法 ====================

  private async getSessionPool(tabId: string): Promise<sql.ConnectionPool> {
    const session = this.sessions.get(tabId)
    if (!session) throw new Error('会话不存在，请先执行查询以建立连接')

    try {
      await session.pool.request().batch('SELECT 1')
      return session.pool
    } catch {
      session.status = 'reconnecting'
      console.log(`[SqlServerSession] 会话连接 ${tabId} 已断开，尝试重连...`)

      try {
        try { await session.pool.close() } catch { /* 忽略 */ }

        const options = session.config.options as SqlServerOptions | undefined
        const sqlConfig: sql.config = {
          server: session.config.host,
          port: session.config.port,
          user: session.config.username,
          password: session.config.password,
          database: session.database || session.config.database || undefined,
          options: {
            encrypt: options?.encrypt ?? true,
            trustServerCertificate: options?.trustServerCertificate ?? true,
            enableArithAbort: true
          },
          pool: { min: 1, max: 1 },
          connectionTimeout: Defaults.CONNECTION_TIMEOUT,
          requestTimeout: Defaults.QUERY_TIMEOUT || 30000
        }

        if (options?.domain) {
          sqlConfig.domain = options.domain
        }

        const newPool = await new sql.ConnectionPool(sqlConfig).connect()
        session.pool = newPool
        session.status = 'active'
        session.lastActiveAt = Date.now()

        console.log(`[SqlServerSession] 会话连接 ${tabId} 重连成功（会话状态已重置）`)
        return newPool
      } catch (error: unknown) {
        session.status = 'disconnected'
        const err = error as { message?: string }
        throw new Error(`数据库连接已断开，重连失败: ${err.message || '未知错误'}`)
      }
    }
  }

  private async getTablePrimaryKeys(
    pool: sql.ConnectionPool,
    database: string,
    table: string
  ): Promise<string[]> {
    try {
      await pool.request().batch(`USE [${database}]`)
      const result = await pool.request()
        .query(`
          SELECT c.name AS column_name
          FROM sys.indexes i
          INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
          INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
          INNER JOIN sys.tables t ON i.object_id = t.object_id
          WHERE t.name = '${table.replace(/'/g, "''")}' AND i.is_primary_key = 1
          ORDER BY ic.key_ordinal
        `)
      return result.recordset.map(r => r.column_name)
    } catch {
      return []
    }
  }

  private splitByGo(sqlText: string): string[] {
    return sqlText.split(/^\s*GO\s*$/gim)
  }

  private splitStatements(sqlText: string): string[] {
    const statements: string[] = []
    let current = ''
    let inString = false
    let stringChar = ''

    for (let i = 0; i < sqlText.length; i++) {
      const char = sqlText[i]

      if (inString) {
        current += char
        if (char === stringChar && sqlText[i + 1] !== stringChar) {
          inString = false
        } else if (char === stringChar && sqlText[i + 1] === stringChar) {
          current += sqlText[++i]
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
   * 对整个 batch 中的 SELECT 语句添加 TOP 限制
   * 先用 splitStatements 拆分出各语句，对符合条件的 SELECT 加上 TOP，然后重新拼接
   */
  private rewriteSelectsInBatch(batchSql: string, maxRows: number): string {
    const statements = this.splitStatements(batchSql)
    const rewritten = statements.map(stmt => {
      const isSelect = /^\s*SELECT\s/i.test(stmt)
      if (isSelect && !this.hasTop(stmt) && !this.hasOffset(stmt)) {
        return stmt.replace(/^\s*SELECT\s/i, `SELECT TOP ${maxRows} `)
      }
      return stmt
    })
    return rewritten.join(';\n')
  }

  private hasTop(sqlText: string): boolean {
    return /\bSELECT\s+TOP\s+/i.test(sqlText)
  }

  private hasOffset(sqlText: string): boolean {
    return /\bOFFSET\s+\d+\s+ROWS?\b/i.test(sqlText)
  }

  private parseSingleTableQuery(sqlText: string): { tableName: string; databaseName?: string } | null {
    const trimmed = sqlText.trim()
    if (!/^\s*SELECT\s/i.test(trimmed)) return null

    const fromMatch = trimmed.match(/\bFROM\s+(\[?\w+\]?\.)?(\[?\w+\]?\.)?(\[?\w+\]?)/i)
    if (!fromMatch) return null
    if (/\bJOIN\b/i.test(trimmed)) return null

    const afterFrom = trimmed.substring(trimmed.search(/\bFROM\b/i) + 5)
    const beforeWhere = afterFrom.split(/\bWHERE\b/i)[0]
    if (beforeWhere.includes(',')) return null

    const tableName = fromMatch[3].replace(/\[|\]/g, '')
    let databaseName: string | undefined
    if (fromMatch[1] && fromMatch[2]) {
      databaseName = fromMatch[1].replace(/\[|\]|\./g, '')
    }

    return { tableName, databaseName }
  }

  private getTypeName(typeInfo: sql.ISqlType | (() => sql.ISqlType) | sql.ISqlTypeFactory): string {
    if (!typeInfo) return 'UNKNOWN'
    // mssql 的 TYPES（如 TYPES.Bit, TYPES.Int）是函数，且带有 declaration 属性（如 'bit', 'int'）
    // 直接用 declaration 获取类型名，避免调用函数后拿到的 type 仍是函数引用（无法序列化到渲染进程）
    const declaration = (typeInfo as any).declaration
    if (typeof declaration === 'string') {
      return declaration.toUpperCase()
    }
    if (typeof typeInfo === 'function') {
      // 回退：使用函数名
      return typeInfo.name ? typeInfo.name.toUpperCase() : 'UNKNOWN'
    }
    const typeProp = (typeInfo as { type?: any }).type
    if (typeProp) {
      // type 属性可能也是一个带 declaration 的函数
      if (typeof typeProp === 'string') return typeProp
      if (typeof typeProp?.declaration === 'string') return typeProp.declaration.toUpperCase()
    }
    return 'UNKNOWN'
  }
}
