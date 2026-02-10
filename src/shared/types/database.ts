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
  schema?: string  // SQL Server 表所属 schema
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
  autoIncrement: boolean // 是否自增 (MySQL: auto_increment, SQL Server: identity)
  defaultValue?: string
  characterSet?: string  // 字符编码
  collation?: string     // 排序规则
  comment?: string
  // SQL Server 特有
  isIdentity?: boolean   // 是否为 identity 列
  seed?: number          // identity seed
  increment?: number     // identity increment
  defaultConstraintName?: string  // 默认值约束名（SQL Server 专用，编辑模式删除/修改默认值时需要）
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
 * 列定义（用于创建/修改表）
 */
export interface ColumnDefinition {
  name: string
  type: string           // 数据类型 (如 VARCHAR)
  length?: number        // 长度 (如 VARCHAR(255) 的 255)
  decimals?: number      // 小数位数 (DECIMAL)
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean
  defaultValue?: string
  comment?: string
  unsigned?: boolean     // 无符号（整数类型）
  characterSet?: string  // 字符集（字符串类型）
  collation?: string     // 排序规则（字符串类型）
}

/**
 * 索引定义（用于创建/修改表）
 */
export interface IndexDefinition {
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT'
  columns: { name: string; length?: number }[]
}

/**
 * 表定义（用于创建/修改表）
 */
export interface TableDefinition {
  name: string
  columns: ColumnDefinition[]
  indexes: IndexDefinition[]
  engine?: string
  charset?: string
  collation?: string
  comment?: string
}

/**
 * MySQL 数据类型枚举
 */
export const MySQLDataTypes = {
  // 整数类型
  INTEGER: ['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT'],
  // 浮点类型
  FLOAT: ['FLOAT', 'DOUBLE', 'DECIMAL'],
  // 字符串类型
  STRING: ['CHAR', 'VARCHAR', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'],
  // 二进制类型
  BINARY: ['BINARY', 'VARBINARY', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB', 'LONGBLOB'],
  // 日期时间类型
  DATETIME: ['DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'YEAR'],
  // 其他类型
  OTHER: ['ENUM', 'SET', 'JSON', 'BIT']
} as const

/**
 * 获取所有 MySQL 数据类型
 */
export function getAllMySQLDataTypes(): string[] {
  return [
    ...MySQLDataTypes.INTEGER,
    ...MySQLDataTypes.FLOAT,
    ...MySQLDataTypes.STRING,
    ...MySQLDataTypes.BINARY,
    ...MySQLDataTypes.DATETIME,
    ...MySQLDataTypes.OTHER
  ]
}

/**
 * 判断数据类型是否需要长度参数
 * 包括：字符串类型的长度、数值类型的精度、日期时间类型的小数秒精度(fsp)
 */
export function typeNeedsLength(type: string): boolean {
  const needsLength = [
    'CHAR', 'VARCHAR', 'BINARY', 'VARBINARY', 'BIT', 
    'DECIMAL', 'FLOAT', 'DOUBLE',
    // 日期时间类型支持小数秒精度 (fsp: 0-6)
    'DATETIME', 'TIME', 'TIMESTAMP'
  ]
  return needsLength.includes(type.toUpperCase())
}

/**
 * 判断数据类型是否需要小数位数
 */
export function typeNeedsDecimals(type: string): boolean {
  return ['DECIMAL', 'FLOAT', 'DOUBLE'].includes(type.toUpperCase())
}

/**
 * 判断数据类型是否为支持小数秒精度(fsp)的日期时间类型
 * 支持的类型: DATETIME, TIME, TIMESTAMP (精度范围 0-6)
 */
export function typeNeedsFsp(type: string): boolean {
  return ['DATETIME', 'TIME', 'TIMESTAMP'].includes(type.toUpperCase())
}

/**
 * 判断数据类型是否支持 UNSIGNED
 */
export function typeSupportsUnsigned(type: string): boolean {
  return [...MySQLDataTypes.INTEGER, ...MySQLDataTypes.FLOAT].includes(type.toUpperCase() as never)
}

/**
 * 判断数据类型是否支持字符集
 */
export function typeSupportsCharset(type: string): boolean {
  return MySQLDataTypes.STRING.includes(type.toUpperCase() as never)
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
  schema?: string  // SQL Server 表所属 schema
  data?: TableMeta | ViewMeta | FunctionMeta
}

/**
 * SQL Server 数据类型枚举
 */
export const SqlServerDataTypes = {
  // 整数类型
  INTEGER: ['TINYINT', 'SMALLINT', 'INT', 'BIGINT'],
  // 浮点类型
  FLOAT: ['FLOAT', 'REAL', 'DECIMAL', 'NUMERIC', 'MONEY', 'SMALLMONEY'],
  // 字符串类型
  STRING: ['CHAR', 'VARCHAR', 'NCHAR', 'NVARCHAR', 'TEXT', 'NTEXT'],
  // 二进制类型
  BINARY: ['BINARY', 'VARBINARY', 'IMAGE'],
  // 日期时间类型
  DATETIME: ['DATE', 'TIME', 'DATETIME', 'DATETIME2', 'SMALLDATETIME', 'DATETIMEOFFSET'],
  // 其他类型
  OTHER: ['BIT', 'UNIQUEIDENTIFIER', 'XML', 'SQL_VARIANT', 'GEOGRAPHY', 'GEOMETRY', 'HIERARCHYID']
} as const

/**
 * 获取所有 SQL Server 数据类型
 */
export function getAllSqlServerDataTypes(): string[] {
  return [
    ...SqlServerDataTypes.INTEGER,
    ...SqlServerDataTypes.FLOAT,
    ...SqlServerDataTypes.STRING,
    ...SqlServerDataTypes.BINARY,
    ...SqlServerDataTypes.DATETIME,
    ...SqlServerDataTypes.OTHER
  ]
}

/**
 * 判断 SQL Server 数据类型是否需要长度参数
 */
export function sqlServerTypeNeedsLength(type: string): boolean {
  const needsLength = [
    'CHAR', 'VARCHAR', 'NCHAR', 'NVARCHAR',
    'BINARY', 'VARBINARY',
    'DECIMAL', 'NUMERIC',
    'DATETIME2', 'TIME', 'DATETIMEOFFSET'
  ]
  return needsLength.includes(type.toUpperCase())
}

/**
 * 判断 SQL Server 数据类型是否需要小数位数
 */
export function sqlServerTypeNeedsDecimals(type: string): boolean {
  return ['DECIMAL', 'NUMERIC'].includes(type.toUpperCase())
}

/**
 * 判断 SQL Server 数据类型是否支持 MAX 长度
 */
export function sqlServerTypeSupportsMax(type: string): boolean {
  return ['VARCHAR', 'NVARCHAR', 'VARBINARY'].includes(type.toUpperCase())
}

/**
 * 判断 SQL Server 数据类型是否为时间精度类型（精度范围 0-7）
 */
export function sqlServerTypeNeedsFsp(type: string): boolean {
  return ['DATETIME2', 'TIME', 'DATETIMEOFFSET'].includes(type.toUpperCase())
}

/**
 * SQL Server 列定义表单项
 */
export interface SqlServerColumnFormItem {
  _key: string
  name: string
  type: string
  length?: number | 'MAX'
  decimals?: number
  notNull: boolean
  primaryKey: boolean
  identity: boolean
  identitySeed: number
  identityIncrement: number
  defaultValue: string
  comment: string
}

/**
 * SQL Server 索引定义表单项
 */
export interface SqlServerIndexFormItem {
  _key: string
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX'
  clustered: boolean
  columns: {
    name: string
    order: 'ASC' | 'DESC'
  }[]
}
