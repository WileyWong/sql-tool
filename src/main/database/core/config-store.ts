/**
 * 连接配置存储
 * 管理所有连接的配置，供驱动层访问
 */

import type { ConnectionConfig, DatabaseType } from '@shared/types'

// 连接配置存储
const connectionConfigs = new Map<string, ConnectionConfig>()

/**
 * 存储连接配置
 */
export function storeConnectionConfig(config: ConnectionConfig): void {
  connectionConfigs.set(config.id, config)
}

/**
 * 获取连接配置
 */
export function getConnectionConfig(connectionId: string): ConnectionConfig | undefined {
  return connectionConfigs.get(connectionId)
}

/**
 * 删除连接配置
 */
export function removeConnectionConfig(connectionId: string): void {
  connectionConfigs.delete(connectionId)
}

/**
 * 获取连接的数据库类型
 */
export function getConnectionDbType(connectionId: string): DatabaseType {
  const config = connectionConfigs.get(connectionId)
  // 向后兼容：如果没有 type 字段，默认为 mysql
  return config?.type || 'mysql'
}

/**
 * 清空所有连接配置
 */
export function clearConnectionConfigs(): void {
  connectionConfigs.clear()
}

/**
 * 获取所有连接配置
 */
export function getAllConnectionConfigs(): ConnectionConfig[] {
  return Array.from(connectionConfigs.values())
}
