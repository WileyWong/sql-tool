/**
 * 数据库驱动接口定义
 */

import type { 
  ConnectionConfig, 
  TestConnectionResult,
  TableMeta,
  ColumnMeta,
  ViewMeta,
  FunctionMeta,
  IndexMeta,
  QueryResult,
  ExplainResult,
  QueryError
} from '@shared/types'

/**
 * 查询选项
 */
export interface QueryOptions {
  maxRows?: number
  timeout?: number
  currentDatabase?: string
}

/**
 * 数据库驱动接口
 * 所有数据库驱动必须实现此接口
 */
export interface IDatabaseDriver {
  /**
   * 获取驱动类型
   */
  readonly type: string

  /**
   * 测试连接
   */
  testConnection(config: ConnectionConfig): Promise<TestConnectionResult>

  /**
   * 建立连接
   */
  connect(config: ConnectionConfig): Promise<{ version: string }>

  /**
   * 断开连接
   */
  disconnect(connectionId: string): Promise<void>

  /**
   * 断开所有连接
   */
  disconnectAll(): Promise<void>

  /**
   * 检查连接是否有效
   */
  isConnected(connectionId: string): Promise<boolean>

  /**
   * 获取数据库版本
   */
  getVersion(connectionId: string): Promise<string | null>

  // ==================== 元数据操作 ====================

  /**
   * 获取数据库列表
   */
  getDatabases(connectionId: string): Promise<string[]>

  /**
   * 获取表列表
   */
  getTables(connectionId: string, database: string): Promise<TableMeta[]>

  /**
   * 获取表列表（包含列信息）
   * 一次性获取所有表及其列信息，用于 Language Server 元数据加载
   */
  getTablesWithColumns(connectionId: string, database: string): Promise<TableMeta[]>

  /**
   * 获取表列信息
   */
  getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]>

  /**
   * 获取视图列表
   */
  getViews(connectionId: string, database: string): Promise<ViewMeta[]>

  /**
   * 获取函数/存储过程列表
   */
  getFunctions(connectionId: string, database: string): Promise<FunctionMeta[]>

  /**
   * 获取索引信息
   */
  getIndexes(connectionId: string, database: string, table: string): Promise<IndexMeta[]>

  /**
   * 获取表的创建语句
   */
  getTableCreateSql(connectionId: string, database: string, table: string): Promise<string>

  // ==================== 查询操作 ====================

  /**
   * 执行查询
   */
  executeQuery(
    connectionId: string, 
    sql: string, 
    options?: QueryOptions
  ): Promise<QueryResult[]>

  /**
   * 取消正在执行的查询
   */
  cancelQuery(connectionId: string): Promise<boolean>

  /**
   * 获取执行计划
   */
  explainQuery(
    connectionId: string, 
    sql: string, 
    currentDatabase?: string
  ): Promise<ExplainResult | QueryError>

  /**
   * 批量执行 SQL
   */
  executeBatch(
    connectionId: string,
    sqls: string[]
  ): Promise<{ 
    success: boolean; 
    message?: string; 
    results?: Array<{ sql: string; affectedRows: number }> 
  }>

  // ==================== DDL 操作 ====================

  /**
   * 执行 DDL 语句
   */
  executeDDL(connectionId: string, sql: string): Promise<{ success: boolean; message?: string }>

  // ==================== 数据库特有功能（可选） ====================

  /**
   * 获取字符集列表（MySQL 特有）
   */
  getCharsets?(connectionId: string): Promise<{ charset: string; defaultCollation: string; description: string }[]>

  /**
   * 获取排序规则列表（MySQL 特有）
   */
  getCollations?(connectionId: string, charset?: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]>

  /**
   * 获取存储引擎列表（MySQL 特有）
   */
  getEngines?(connectionId: string): Promise<{ engine: string; support: string; comment: string; isDefault: boolean }[]>

  /**
   * 获取默认字符集（MySQL 特有）
   */
  getDefaultCharset?(connectionId: string, database: string): Promise<{ charset: string; collation: string }>

  /**
   * 获取 schema 列表（SQL Server 特有）
   */
  getSchemas?(connectionId: string, database: string): Promise<string[]>
}
