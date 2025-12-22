/**
 * 数据库连接配置
 */
export interface ConnectionConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
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
}

/**
 * 新建/编辑连接表单
 */
export interface ConnectionForm {
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
}

/**
 * 测试连接结果
 */
export interface TestConnectionResult {
  success: boolean
  message: string
  serverVersion?: string
}
