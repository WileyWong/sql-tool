/**
 * 数据库驱动初始化
 * 注册所有支持的数据库驱动和会话管理器
 */

import { DriverFactory } from './core/factory'
import { MySQLDriver, MySQLSessionManager } from './mysql'
import { SqlServerDriver, SqlServerSessionManager } from './sqlserver'

/**
 * 初始化并注册所有数据库驱动和会话管理器
 */
export function initializeDrivers(): void {
  // 注册 MySQL 驱动 + 会话管理器
  DriverFactory.registerDriver('mysql', new MySQLDriver())
  DriverFactory.registerSessionManager('mysql', new MySQLSessionManager())
  
  // 注册 SQL Server 驱动 + 会话管理器
  DriverFactory.registerDriver('sqlserver', new SqlServerDriver())
  DriverFactory.registerSessionManager('sqlserver', new SqlServerSessionManager())
  
  console.log('[Database] 已注册驱动:', DriverFactory.getRegisteredTypes().join(', '))
  console.log('[Database] 已注册会话管理器:', DriverFactory.getRegisteredSessionTypes().join(', '))
}

/**
 * 清理所有驱动和会话管理器（断开所有连接）
 */
export async function cleanupDrivers(): Promise<void> {
  // 先清理所有会话管理器
  const sessionTypes = DriverFactory.getRegisteredSessionTypes()
  for (const type of sessionTypes) {
    try {
      const sessionManager = DriverFactory.getSessionManager(type)
      sessionManager.stopZombieDetection()
      await sessionManager.destroyAllSessions()
    } catch (error) {
      console.error(`[Database] 清理会话管理器 ${type} 时出错:`, error)
    }
  }
  
  // 再清理驱动
  const types = DriverFactory.getRegisteredTypes()
  for (const type of types) {
    try {
      const driver = DriverFactory.getDriver(type)
      await driver.disconnectAll()
    } catch (error) {
      console.error(`[Database] 清理驱动 ${type} 时出错:`, error)
    }
  }
  
  DriverFactory.clearAll()
}

/**
 * 同步清理所有会话（用于进程异常退出）
 */
export function cleanupSessionsSync(): void {
  const sessionTypes = DriverFactory.getRegisteredSessionTypes()
  for (const type of sessionTypes) {
    try {
      const sessionManager = DriverFactory.getSessionManager(type)
      sessionManager.stopZombieDetection()
      sessionManager.destroyAllSessionsSync()
    } catch (error) {
      console.error(`[Database] 同步清理会话管理器 ${type} 时出错:`, error)
    }
  }
}
