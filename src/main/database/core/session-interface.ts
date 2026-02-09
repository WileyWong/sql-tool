/**
 * 数据库会话管理器接口定义
 * 每个编辑器 Tab 独占一个物理数据库连接，保证会话隔离
 */

import type { QueryResult, ExplainResult, QueryError } from '@shared/types'
import type { QueryOptions } from './interface'

/**
 * 会话连接状态
 */
export interface SessionInfo {
  tabId: string
  connectionId: string
  database?: string
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
}

/**
 * 数据库会话管理器接口
 * 每个编辑器 Tab 独占一个物理数据库连接
 */
export interface ISessionManager {
  readonly type: string

  /**
   * 为 Tab 创建独占会话连接
   * @param tabId 编辑器 Tab ID
   * @param connectionId 服务器连接 ID（用于获取连接配置）
   * @param database 初始数据库
   * @throws 连接数达到上限时抛出错误
   */
  createSession(tabId: string, connectionId: string, database?: string): Promise<void>

  /**
   * 销毁 Tab 的会话连接
   * 释放物理连接，清理所有相关资源
   */
  destroySession(tabId: string): Promise<void>

  /**
   * 销毁某个服务器下的所有会话
   * 用于断开服务器连接时的批量清理
   */
  destroySessionsByConnection(connectionId: string): Promise<void>

  /**
   * 销毁所有会话
   */
  destroyAllSessions(): Promise<void>

  /**
   * 同步版本的全量清理（用于进程退出前）
   */
  destroyAllSessionsSync(): void

  /**
   * 获取会话信息
   */
  getSessionInfo(tabId: string): SessionInfo | undefined

  /**
   * 获取某个服务器的活跃会话数
   */
  getSessionCount(connectionId: string): number

  /**
   * 检查会话连接是否有效
   */
  isSessionAlive(tabId: string): Promise<boolean>

  /**
   * 在 Tab 的独占连接上执行查询
   */
  executeQuery(
    tabId: string,
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult[]>

  /**
   * 取消 Tab 正在执行的查询
   */
  cancelQuery(tabId: string): Promise<boolean>

  /**
   * 获取执行计划
   */
  explainQuery(
    tabId: string,
    sql: string,
    currentDatabase?: string
  ): Promise<ExplainResult | QueryError>

  /**
   * 批量执行 SQL（在 Tab 的独占连接上，使用事务）
   */
  executeBatch(
    tabId: string,
    sqls: string[]
  ): Promise<{
    success: boolean
    message?: string
    results?: Array<{ sql: string; affectedRows: number }>
  }>

  /**
   * 执行 DDL（在 Tab 的独占连接上）
   */
  executeDDL(tabId: string, sql: string): Promise<{ success: boolean; message?: string }>

  /**
   * 启动僵尸会话检测定时任务
   */
  startZombieDetection(checkTabExists: (tabId: string) => Promise<boolean>): void

  /**
   * 停止僵尸会话检测
   */
  stopZombieDetection(): void
}
