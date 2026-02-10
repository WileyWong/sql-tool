/**
 * 查询请求
 */
export interface QueryRequest {
  connectionId: string
  sql: string
  maxRows?: number
}

/**
 * 列定义
 */
export interface ColumnDef {
  name: string
  type: string
  isPrimaryKey?: boolean
}

/**
 * 查询结果集
 */
export interface QueryResultSet {
  type: 'resultset'
  columns: ColumnDef[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTime: number
  // 可编辑相关
  editable?: boolean
  tableName?: string
  databaseName?: string
  primaryKeys?: string[]
}

/**
 * 非查询结果（INSERT/UPDATE/DELETE）
 */
export interface QueryMessage {
  type: 'message'
  affectedRows: number
  message: string
  executionTime: number
}

/**
 * 查询错误
 */
export interface QueryError {
  type: 'error'
  code: string
  message: string
  sqlState?: string
}

/**
 * 查询结果（联合类型）
 */
export type QueryResult = QueryResultSet | QueryMessage | QueryError

/**
 * 执行计划节点（MySQL 格式）
 */
export interface ExplainNode {
  id: number
  selectType: string
  table: string
  partitions?: string
  type: string
  possibleKeys?: string
  key?: string
  keyLen?: string
  ref?: string
  rows: number
  filtered: number
  extra?: string
}

/**
 * SQL Server 执行计划节点
 */
export interface SqlServerExplainNode {
  id: number
  nodeId: string
  physicalOp: string
  logicalOp: string
  estimateRows: number
  estimateCpu?: number
  estimateIo?: number
  estimatedTotalSubtreeCost?: number
  actualRows?: number
  actualExecutions?: number
  outputList: string[]
  children: SqlServerExplainNode[]
  depth?: number
}

/**
 * 执行计划结果
 */
export interface ExplainResult {
  databaseType: import('./connection').DatabaseType
  nodes: ExplainNode[] | SqlServerExplainNode[]
  raw: Record<string, unknown>[] | string
  truncated?: boolean
  totalCount?: number
}

/**
 * 执行状态
 */
export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error' | 'cancelled'
