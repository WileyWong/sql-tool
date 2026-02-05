/**
 * 数据库驱动工厂
 */

import type { DatabaseType, ConnectionConfig } from '@shared/types'
import type { IDatabaseDriver } from './interface'

/**
 * 驱动工厂
 */
export class DriverFactory {
  private static drivers = new Map<DatabaseType, IDatabaseDriver>()

  /**
   * 注册驱动
   */
  static registerDriver(type: DatabaseType, driver: IDatabaseDriver): void {
    this.drivers.set(type, driver)
  }

  /**
   * 获取驱动实例（单例）
   */
  static getDriver(type: DatabaseType): IDatabaseDriver {
    const driver = this.drivers.get(type)
    if (!driver) {
      throw new Error(`不支持的数据库类型: ${type}`)
    }
    return driver
  }

  /**
   * 根据连接配置获取驱动
   * @param config 连接配置，必须包含 type 字段
   */
  static getDriverForConfig(config: { type?: DatabaseType }): IDatabaseDriver {
    // 向后兼容：如果没有 type 字段，默认为 mysql
    const type = config.type || 'mysql'
    return this.getDriver(type)
  }

  /**
   * 检查驱动是否已注册
   */
  static hasDriver(type: DatabaseType): boolean {
    return this.drivers.has(type)
  }

  /**
   * 获取所有已注册的驱动类型
   */
  static getRegisteredTypes(): DatabaseType[] {
    return Array.from(this.drivers.keys())
  }

  /**
   * 清除所有驱动实例
   */
  static clearDrivers(): void {
    this.drivers.clear()
  }
}

/**
 * 便捷的驱动获取函数
 */
export function getDriver(type: DatabaseType): IDatabaseDriver {
  return DriverFactory.getDriver(type)
}

/**
 * 根据连接配置获取驱动
 */
export function getDriverForConfig(config: ConnectionConfig | { type?: DatabaseType }): IDatabaseDriver {
  return DriverFactory.getDriverForConfig(config)
}
