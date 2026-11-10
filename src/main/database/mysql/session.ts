/**
 * MySQL 会话管理器
 * 每个编辑器 Tab 独占一个物理 MySQL 连接
 */

import type { Connection } from 'mysql2/promise'
import type {
  ConnectionConfig,
  DatabaseType,
  QueryResult,
  QueryError,
  ExplainResult,
  ExplainNode
} from '@shared/types'
import { Defaults } from '@shared/constants'
import type { ISessionManager, SessionInfo } from '../core/session-interface'
import type { QueryOptions } from '../core/interface'
import { getConnectionConfig } from '../core/config-store'
import { splitStatementsToTexts } from '../../sql-language-server/services/sqlParserService'
import { normalizeMysqlQueryResult, toQueryResultFromNormalized } from './query-result'
import {
  closeMysqlConnection,
  destroyMysqlConnection,
  isMysqlConnectionUsable,
  openMysqlConnection,
  pingMysql,
  queryMysql
} from './connection'
import { shouldProbeConnection } from '../core/connection-health'

/**
 * MySQL 独占会话
 */
interface MySQLSession {
  tabId: string
  connectionId: string
  connection: Connection
  database?: string
  config: ConnectionConfig
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
  /** 正在执行的查询的线程 ID，用于取消查询 */
  runningQueryThreadId?: number
  /** 是否已请求取消当前查询 */
  cancelled: boolean
  /** 僵尸检测：渲染进程无响应计数 */
  suspiciousCount: number
}

/**
 * MySQL 会话管理器实现
 */
export class MySQLSessionManager implements ISessionManager {
  readonly type = 'mysql'

  /** tabId → 会话 */
  private sessions = new Map<string, MySQLSession>()

  /** connectionId → Set<tabId>（反向索引，用于批量清理） */
  private connectionSessions = new Map<string, Set<string>>()

  /** 每个服务器的最大会话数 */
  private maxSessionsPerConnection = Defaults.MAX_SESSIONS_PER_CONNECTION

  /** 僵尸检测定时器 */
  private zombieTimer: ReturnType<typeof setInterval> | null = null
  /** 上一轮检测尚未结束时不再叠一轮，避免死连接把定时器堆起来 */
  private zombieChecking = false

  // ==================== 会话生命周期 ====================

  async createSession(tabId: string, connectionId: string, database?: string): Promise<void> {
    // 1. 检查连接限额
    const currentCount = this.getSessionCount(connectionId)
    if (currentCount >= this.maxSessionsPerConnection) {
      throw new Error(`已达到最大连接数限制(${this.maxSessionsPerConnection})，请关闭部分编辑器后重试`)
    }

    // 2. 如果该 Tab 已有会话，先销毁
    if (this.sessions.has(tabId)) {
      await this.destroySession(tabId)
    }

    // 3. 获取连接配置
    const config = getConnectionConfig(connectionId)
    if (!config) throw new Error('连接配置不存在')

    // 4. 创建独占物理连接
    const connection = await openMysqlConnection(config, database)

    // 5. 注册会话
    const session: MySQLSession = {
      tabId,
      connectionId,
      connection,
      database,
      config,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      status: 'active',
      cancelled: false,
      suspiciousCount: 0
    }
    this.sessions.set(tabId, session)

    // 6. 更新反向索引
    if (!this.connectionSessions.has(connectionId)) {
      this.connectionSessions.set(connectionId, new Set())
    }
    this.connectionSessions.get(connectionId)!.add(tabId)

    console.log(`[MySQLSession] 会话已创建: tabId=${tabId}, connectionId=${connectionId}, 当前该服务器会话数: ${this.getSessionCount(connectionId)}`)
  }

  async destroySession(tabId: string): Promise<void> {
    const session = this.sessions.get(tabId)
    if (!session) return

    await closeMysqlConnection(session.connection)

    // 2. 清理反向索引
    this.connectionSessions.get(session.connectionId)?.delete(tabId)
    if (this.connectionSessions.get(session.connectionId)?.size === 0) {
      this.connectionSessions.delete(session.connectionId)
    }

    // 3. 移除会话
    this.sessions.delete(tabId)

    console.log(`[MySQLSession] 会话已销毁: tabId=${tabId}`)
  }

  async destroySessionsByConnection(connectionId: string): Promise<void> {
    const tabIds = this.connectionSessions.get(connectionId)
    if (!tabIds) return

    // 拷贝后遍历，因为 destroySession 会修改 Set
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
      destroyMysqlConnection(session.connection)
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
      await pingMysql(session.connection)
      return true
    } catch {
      session.status = 'disconnected'
      return false
    }
  }

  // ==================== 查询操作 ====================

  async executeQuery(
    tabId: string,
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    let connection: Connection
    try {
      connection = await this.getSessionConnection(tabId)
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

    // 如果指定了数据库，先切换
    if (currentDatabase) {
      try {
        await queryMysql(connection, `USE \`${currentDatabase}\``)
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string }
        return [{
          type: 'error',
          code: err.code || 'E4003',
          message: `切换数据库失败: ${err.message || currentDatabase}`
        }]
      }
    }

    // 记录查询线程 ID（用于取消）
    const threadId = (connection as unknown as { threadId: number }).threadId
    session.runningQueryThreadId = threadId
    session.cancelled = false  // 重置取消标记

    const results: QueryResult[] = []


    try {
      const statements = splitStatementsToTexts(trimmedSql)

      for (const statement of statements) {
        if (!statement.trim()) continue

        const stmtStartTime = Date.now()

        try {
          const isSelect = /^\s*SELECT\s/i.test(statement)
          let execSql = statement

          if (isSelect && !this.hasLimit(statement)) {
            execSql = statement.replace(/;\s*$/, '').trim()
            execSql = `${execSql} LIMIT ${maxRows}`
          }

          const [rows, fields] = await queryMysql(connection, execSql)
          const executionTime = Date.now() - stmtStartTime
          const normalizedList = normalizeMysqlQueryResult(rows, fields)

          let extras: {
            editable?: boolean
            tableName?: string
            databaseName?: string
            primaryKeys?: string[]
          } | undefined

          const hasResultSet = normalizedList.some(item => Array.isArray(item.rows) && !('affectedRows' in (item.rows as object)))
          if (hasResultSet) {
            const tableInfo = this.parseSingleTableQuery(statement)
            if (tableInfo && currentDatabase) {
              const databaseName = tableInfo.databaseName || currentDatabase
              const tableName = tableInfo.tableName
              const primaryKeys = await this.getTablePrimaryKeys(connection, databaseName, tableName)
              extras = {
                databaseName,
                tableName,
                primaryKeys,
                editable: primaryKeys.length > 0
              }
            }
          }

          for (const item of normalizedList) {
            results.push(toQueryResultFromNormalized(item, executionTime, extras))
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
          break
        }
      }
    } finally {
      // 保存取消状态（在 finally 中检查，因为此时查询已返回）
      const wasCancelled = session.cancelled
      session.runningQueryThreadId = undefined
      session.cancelled = false

      // 如果取消请求已发送，判断是否真正被中断
      if (wasCancelled) {
        const wasKilled = results.some(r =>
          r.type === 'error' &&
          ((r as QueryError).code === 'ER_QUERY_INTERRUPTED' || (r as QueryError).sqlState === '70100')
        )
        // 通过特殊属性传递取消信息（不污染 QueryResult 类型）
        ;(results as unknown as { __cancelled?: boolean; __wasKilled?: boolean }).__cancelled = true
        ;(results as unknown as { __cancelled?: boolean; __wasKilled?: boolean }).__wasKilled = wasKilled
      }
    }

    return results
  }

  async cancelQuery(tabId: string): Promise<boolean> {
    const session = this.sessions.get(tabId)
    if (!session || !session.runningQueryThreadId) return false

    // 先标记已请求取消（无论 KILL 是否发送成功）
    session.cancelled = true

    try {
      // 使用同一个连接执行 KILL QUERY 需要另一个连接
      // 创建临时连接来执行 KILL
      const tempConn = await openMysqlConnection(session.config)
      try {
        await queryMysql(tempConn, `KILL QUERY ${session.runningQueryThreadId}`, undefined, Defaults.CONNECTION_TIMEOUT)
        return true
      } finally {
        await closeMysqlConnection(tempConn)
      }
    } catch {
      return false
    }
  }

  async explainQuery(tabId: string, sql: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
    let connection: Connection
    try {
      connection = await this.getSessionConnection(tabId)
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

    if (!/^\s*SELECT\s/i.test(sql.trim())) {
      return {
        type: 'error',
        code: 'E4004',
        message: '执行计划仅支持 SELECT 语句'
      }
    }

    if (currentDatabase) {
      try {
        await queryMysql(connection, `USE \`${currentDatabase}\``)
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
      const [rows] = await queryMysql(connection, `EXPLAIN ${sql}`)
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
        databaseType: 'mysql' as DatabaseType,
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

  async executeBatch(
    tabId: string,
    sqls: string[]
  ): Promise<{ success: boolean; message?: string; results?: Array<{ sql: string; affectedRows: number }> }> {
    let connection: Connection
    try {
      connection = await this.getSessionConnection(tabId)
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

    try {
      await queryMysql(connection, 'START TRANSACTION')

      for (const sql of sqls) {
        try {
          const [result] = await queryMysql(connection, sql)
          const res = result as { affectedRows: number }
          results.push({ sql, affectedRows: res.affectedRows || 0 })
        } catch (error: unknown) {
          await queryMysql(connection, 'ROLLBACK')
          const err = error as { message?: string }
          return { success: false, message: `执行失败: ${err.message || '未知错误'}\nSQL: ${sql}` }
        }
      }

      await queryMysql(connection, 'COMMIT')
      return { success: true, results }
    } catch (error: unknown) {
      try { await queryMysql(connection, 'ROLLBACK') } catch { /* 忽略 */ }
      const err = error as { message?: string }
      return { success: false, message: err.message || '批量执行失败' }
    }
  }

  async executeDDL(tabId: string, sql: string): Promise<{ success: boolean; message?: string }> {
    let connection: Connection
    try {
      connection = await this.getSessionConnection(tabId)
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '连接不存在' }
    }

    const session = this.sessions.get(tabId)!
    session.lastActiveAt = Date.now()

    try {
      await queryMysql(connection, sql)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '执行失败' }
    }
  }

  // ==================== 僵尸检测 ====================

  startZombieDetection(checkTabExists: (tabId: string) => Promise<boolean>): void {
    if (this.zombieTimer) return

    this.zombieTimer = setInterval(() => {
      if (this.zombieChecking) return
      this.zombieChecking = true
      void this.sweepZombieSessions(checkTabExists).finally(() => {
        this.zombieChecking = false
      })
    }, Defaults.ZOMBIE_DETECTION_INTERVAL)
  }

  private async sweepZombieSessions(checkTabExists: (tabId: string) => Promise<boolean>): Promise<void> {
    for (const [tabId, session] of this.sessions) {
        // 查询进行中时不要探活：ping 会排在当前语句后面，超时会把正在用的连接销毁
        if (session.runningQueryThreadId) continue

        if (Date.now() - session.lastActiveAt > Defaults.SESSION_IDLE_TIMEOUT) {
          console.log(`[MySQLSession] 会话空闲超时: tabId=${tabId}`)
          await this.destroySession(tabId)
          continue
        }

        // 检查物理连接是否已断开
        if (!await this.isSessionAlive(tabId)) {
          console.warn(`[MySQLSession] 僵尸会话（连接已断开）: tabId=${tabId}`)
          await this.destroySession(tabId)
          continue
        }

        // 通过 IPC 询问渲染进程该 Tab 是否还存在
        try {
          const exists = await checkTabExists(tabId)
          if (!exists) {
            console.warn(`[MySQLSession] 僵尸会话（Tab 已关闭）: tabId=${tabId}`)
            await this.destroySession(tabId)
          } else {
            session.suspiciousCount = 0
          }
        } catch {
          session.suspiciousCount++
          if (session.suspiciousCount >= 3) {
            console.warn(`[MySQLSession] 僵尸会话（渲染进程无响应）: tabId=${tabId}`)
            await this.destroySession(tabId)
          }
        }
    }
  }

  stopZombieDetection(): void {
    if (this.zombieTimer) {
      clearInterval(this.zombieTimer)
      this.zombieTimer = null
    }
  }

  // ==================== 私有方法 ====================

  /**
   * 获取会话连接（带自动重连）
   */
  private async getSessionConnection(tabId: string): Promise<Connection> {
    const session = this.sessions.get(tabId)
    if (!session) throw new Error('会话不存在，请先执行查询以建立连接')

    const broken = session.status !== 'active' || !isMysqlConnectionUsable(session.connection)
    if (!broken && !shouldProbeConnection(session.lastActiveAt)) {
      return session.connection
    }

    if (!broken) {
      try {
        await pingMysql(session.connection)
        return session.connection
      } catch {
        console.log(`[MySQLSession] 会话连接 ${tabId} 探活失败，尝试重连...`)
      }
    } else {
      console.log(`[MySQLSession] 会话连接 ${tabId} 已失效，尝试重连...`)
    }

    return this.reopenSession(session)
  }

  private async reopenSession(session: MySQLSession): Promise<Connection> {
    session.status = 'reconnecting'
    await closeMysqlConnection(session.connection)

    try {
      const newConnection = await openMysqlConnection(session.config, session.database)
      session.connection = newConnection
      session.status = 'active'
      session.lastActiveAt = Date.now()
      console.log(`[MySQLSession] 会话连接 ${session.tabId} 重连成功（会话状态已重置）`)
      return newConnection
    } catch (error: unknown) {
      session.status = 'disconnected'
      const err = error as { message?: string }
      throw new Error(`数据库连接已断开，重连失败: ${err.message || '未知错误'}`)
    }
  }

  /**
   * 获取表主键（在会话连接上执行）
   */
  private async getTablePrimaryKeys(
    connection: Connection,
    database: string,
    table: string
  ): Promise<string[]> {
    try {
      const [rows] = await queryMysql(connection, 
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

  private parseSingleTableQuery(sql: string): { tableName: string; databaseName?: string } | null {
    const trimmed = sql.trim()
    if (!/^\s*SELECT\s/i.test(trimmed)) return null

    const fromMatch = trimmed.match(/\bFROM\s+(`?[\w]+`?\.)?`?([\w]+)`?/i)
    if (!fromMatch) return null
    if (/\bJOIN\b/i.test(trimmed)) return null

    const afterFrom = trimmed.substring(trimmed.search(/\bFROM\b/i) + 5)
    const beforeWhere = afterFrom.split(/\bWHERE\b/i)[0]
    if (beforeWhere.includes(',')) return null

    const databaseName = fromMatch[1]?.replace(/`/g, '').replace('.', '') || undefined
    const tableName = fromMatch[2]

    return { tableName, databaseName }
  }

  private hasLimit(sql: string): boolean {
    return /\bLIMIT\s+\d+/i.test(sql)
  }

}
