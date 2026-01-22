/**
 * SQL Language Server 类型定义
 */

/**
 * 光标上下文类型
 */
export type CursorContextType =
  | 'STATEMENT_START'      // 语句开始，提示关键字
  | 'SELECT_COLUMNS'       // SELECT 列位置
  | 'FROM_CLAUSE'          // FROM 后，提示表/视图/函数
  | 'JOIN_CLAUSE'          // JOIN 后，提示表/视图/函数
  | 'WHERE_CLAUSE'         // WHERE 后，提示字段/函数
  | 'ON_CLAUSE'            // ON 后，提示字段
  | 'ORDER_BY_CLAUSE'      // ORDER BY 后，提示字段
  | 'GROUP_BY_CLAUSE'      // GROUP BY 后，提示字段
  | 'TABLE_DOT'            // 表名. 后，提示该表字段
  | 'SUBQUERY_COLUMNS'     // 子查询字段
  | 'IN_COMMENT'           // 注释内，不提示
  | 'DDL_CREATE'           // CREATE 语句
  | 'DDL_ALTER'            // ALTER 语句
  | 'UNKNOWN'              // 未知，提示关键字+表

/**
 * 光标上下文
 */
export interface CursorContext {
  type: CursorContextType
  tables?: TableRef[]           // 当前语句涉及的表
  targetTable?: string          // 表名. 后的目标表
  subqueryColumns?: string[]    // 子查询字段列表
}

/**
 * 表引用（含别名）
 */
export interface TableRef {
  name: string
  alias?: string
  database?: string
  /** 是否是子查询 */
  isSubquery?: boolean
  /** 子查询的列（显式列名或 * 展开后的列） */
  subqueryColumns?: string[]
  /** 子查询是否使用 SELECT * */
  subquerySelectsStar?: boolean
  /** 子查询内部的表名（用于 SELECT * 时获取字段） */
  subqueryInnerTables?: string[]
}

/**
 * 数据库元数据
 */
export interface DatabaseMetadata {
  connectionId: string
  databaseName: string
  tables: TableMetadata[]
  views: ViewMetadata[]
  functions: FunctionMetadata[]
}

/**
 * 表元数据
 */
export interface TableMetadata {
  name: string
  comment?: string
  columns: ColumnMetadata[]
}

/**
 * 字段元数据
 */
export interface ColumnMetadata {
  name: string
  type: string
  nullable: boolean
  defaultValue?: string
  comment?: string
  isPrimaryKey?: boolean
}

/**
 * 视图元数据
 */
export interface ViewMetadata {
  name: string
  comment?: string
}

/**
 * 函数元数据
 */
export interface FunctionMetadata {
  name: string
  signature: string
  description?: string
  returnType?: string
  /** 最低支持的 MySQL 版本（如 "5.7.0", "8.0.0"），null 或不设置表示所有版本支持 */
  minVersion?: string | null
  /** 最高支持的 MySQL 版本（如 "5.7.99"），null 或不设置表示无上限 */
  maxVersion?: string | null
}

/**
 * Language Server 配置
 */
export interface LanguageServerConfig {
  connectionId?: string
  databaseName?: string
}

/**
 * 元数据更新事件
 */
export interface MetadataUpdateEvent {
  type: 'connection' | 'database' | 'table'
  connectionId: string
  databaseName?: string
  tableName?: string
}
