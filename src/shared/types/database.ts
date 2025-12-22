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
  type: string
  nullable: boolean
  primaryKey: boolean
  defaultValue?: string
  comment?: string
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
