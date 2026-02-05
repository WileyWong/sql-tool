/**
 * 支持的数据库类型
 */
export type DatabaseType = 'mysql' | 'sqlserver'

/**
 * 数据库类型配置
 */
export interface DatabaseTypeConfig {
  type: DatabaseType
  name: string
  defaultPort: number
  icon?: string
}

/**
 * 数据库类型列表
 */
export const DatabaseTypes: DatabaseTypeConfig[] = [
  { type: 'mysql', name: 'MySQL', defaultPort: 3306 },
  { type: 'sqlserver', name: 'SQL Server', defaultPort: 1433 }
]

/**
 * 获取数据库类型配置
 */
export function getDatabaseTypeConfig(type: DatabaseType): DatabaseTypeConfig {
  return DatabaseTypes.find(t => t.type === type) || DatabaseTypes[0]
}

/**
 * 获取默认端口
 */
export function getDefaultPort(type: DatabaseType): number {
  return getDatabaseTypeConfig(type).defaultPort
}

/**
 * 获取连接的数据库类型（处理向后兼容）
 * @param config 连接配置
 * @returns 数据库类型，默认为 'mysql'
 */
export function getConnectionType(config: Partial<ConnectionConfig>): DatabaseType {
  // 如果没有 type 字段，默认为 mysql（向后兼容）
  return config.type || 'mysql'
}

/**
 * SQL Server 连接选项
 */
export interface SqlServerOptions {
  encrypt?: boolean            // 是否加密连接
  trustServerCertificate?: boolean  // 是否信任服务器证书
  domain?: string              // Windows 域认证
}

/**
 * 数据库连接配置
 */
export interface ConnectionConfig {
  id: string
  type: DatabaseType           // 数据库类型
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
  options?: SqlServerOptions   // SQL Server 特有选项
  createdAt: number
  updatedAt: number
}

/**
 * 连接状态
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

/**
 * 连接信息（运行时）
 */
export interface ConnectionInfo extends ConnectionConfig {
  status: ConnectionStatus
  error?: string
  /** 数据库服务器版本（连接成功后获取） */
  serverVersion?: string
}

/**
 * 新建/编辑连接表单
 */
export interface ConnectionForm {
  type: DatabaseType           // 数据库类型
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
  options?: SqlServerOptions   // SQL Server 特有选项
}

/**
 * 测试连接结果
 */
export interface TestConnectionResult {
  success: boolean
  message: string
  serverVersion?: string
}
