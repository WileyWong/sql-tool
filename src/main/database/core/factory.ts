/**
 * 数据库驱动工厂
 */

import type { DatabaseType, ConnectionConfig } from '@shared/types'
import type { IDatabaseDriver } from './interface'
import type { ISessionManager } from './session-interface'

/**
 * 驱动工厂
 */
export class DriverFactory {
  private static drivers = new Map<DatabaseType, IDatabaseDriver>()
  private static sessionManagers = new Map<DatabaseType, ISessionManager>()

  /**
   * 注册驱动
   */
  static registerDriver(type: DatabaseType, driver: IDatabaseDriver): void {
    this.drivers.set(type, driver)
  }

  /**
   * 注册会话管理器
   */
  static registerSessionManager(type: DatabaseType, manager: ISessionManager): void {
    this.sessionManagers.set(type, manager)
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
   * 获取会话管理器
   */
  static getSessionManager(type: DatabaseType): ISessionManager {
    const manager = this.sessionManagers.get(type)
    if (!manager) {
      throw new Error(`不支持的数据库类型: ${type}`)
    }
    return manager
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
   * 获取所有已注册的会话管理器类型
   */
  static getRegisteredSessionTypes(): DatabaseType[] {
    return Array.from(this.sessionManagers.keys())
  }

  /**
   * 清除所有驱动实例
   */
  static clearDrivers(): void {
    this.drivers.clear()
  }

  /**
   * 清除所有会话管理器
   */
  static clearSessionManagers(): void {
    this.sessionManagers.clear()
  }

  /**
   * 清除所有（驱动 + 会话管理器）
   */
  static clearAll(): void {
    this.drivers.clear()
    this.sessionManagers.clear()
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

/**
 * 便捷的会话管理器获取函数
 */
export function getSessionManager(type: DatabaseType): ISessionManager {
  return DriverFactory.getSessionManager(type)
}
