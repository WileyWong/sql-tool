/**
 * 数据库驱动初始化
 * 注册所有支持的数据库驱动
 */

import { DriverFactory } from './core/factory'
import { MySQLDriver } from './mysql'
import { SqlServerDriver } from './sqlserver'

/**
 * 初始化并注册所有数据库驱动
 */
export function initializeDrivers(): void {
  // 注册 MySQL 驱动
  DriverFactory.registerDriver('mysql', new MySQLDriver())
  
  // 注册 SQL Server 驱动
  DriverFactory.registerDriver('sqlserver', new SqlServerDriver())
  
  console.log('[Database] 已注册驱动:', DriverFactory.getRegisteredTypes().join(', '))
}

/**
 * 清理所有驱动（断开所有连接）
 */
export async function cleanupDrivers(): Promise<void> {
  const types = DriverFactory.getRegisteredTypes()
  
  for (const type of types) {
    try {
      const driver = DriverFactory.getDriver(type)
      await driver.disconnectAll()
    } catch (error) {
      console.error(`[Database] 清理驱动 ${type} 时出错:`, error)
    }
  }
  
  DriverFactory.clearDrivers()
}
