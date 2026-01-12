/**
 * 数据库元数据
 */
export interface DatabaseMeta {
  name: string
  tables: TableMeta[]
  views: ViewMeta[]
  functions: FunctionMeta[]
}

/**
 * 表元数据
 */
export interface TableMeta {
  name: string
  columns: ColumnMeta[]
  comment?: string
}

/**
 * 列元数据
 */
export interface ColumnMeta {
  name: string
  type: string           // 数据类型 (如 varchar)
  columnType: string     // 完整类型 (如 varchar(255))
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean // 是否自增
  defaultValue?: string
  characterSet?: string  // 字符编码
  collation?: string     // 排序规则
  comment?: string
}

/**
 * 索引列元数据
 */
export interface IndexColumnMeta {
  columnName: string
  seqInIndex: number      // 列在索引中的序号
  order: 'ASC' | 'DESC'   // 排序方向
  cardinality?: number    // 基数
  subPart?: number        // 前缀长度 (用于部分索引)
}

/**
 * 索引元数据
 */
export interface IndexMeta {
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT' | 'SPATIAL'
  columns: IndexColumnMeta[]
}

/**
 * 视图元数据
 */
export interface ViewMeta {
  name: string
  columns: ColumnMeta[]
}

/**
 * 函数元数据
 */
export interface FunctionMeta {
  name: string
  type: 'FUNCTION' | 'PROCEDURE'
}

/**
 * 树节点类型
 */
export type TreeNodeType = 
  | 'connection'
  | 'database'
  | 'tables'
  | 'table'
  | 'views'
  | 'view'
  | 'functions'
  | 'function'

/**
 * 树节点数据
 */
export interface TreeNode {
  id: string
  label: string
  type: TreeNodeType
  children?: TreeNode[]
  isLeaf?: boolean
  connectionId?: string
  databaseName?: string
  data?: TableMeta | ViewMeta | FunctionMeta
}
