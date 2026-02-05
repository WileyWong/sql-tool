/**
 * 元数据服务
 * 管理数据库元数据（表、字段、视图、函数）
 * 函数列表从外部 JSON 配置文件加载，支持热更新和版本过滤
 * 支持多数据库类型（MySQL、SQL Server）
 */

import fs from 'fs'
import type { TableMetadata, ViewMetadata, FunctionMetadata, ColumnMetadata } from '../types'
import type { DatabaseType } from '@shared/types'
import { getResourcePath } from '../../utils/resourcePath'

/**
 * JSON 配置文件中的函数分类结构
 */
interface FunctionCategory {
  label: string
  functions: FunctionMetadata[]
}

/**
 * JSON 配置文件结构
 */
interface FunctionsConfig {
  version: string
  description: string
  lastUpdated: string
  source: string
  categories: Record<string, FunctionCategory>
}

/**
 * 函数加载结果
 */
interface FunctionLoadResult {
  functions: FunctionMetadata[]
  loadedAt: Date
  source: string
  error?: string
}

/**
 * 解析版本号为数字数组，便于比较
 * @param version 版本字符串，如 "8.0.32", "5.7.44-log", "15.0.2000.5"
 * @returns 版本数字数组 [major, minor, patch, build]
 */
function parseVersion(version: string): number[] {
  // 移除版本号后的非数字部分（如 "-log", "-community"）
  const cleanVersion = version.replace(/[^0-9.]/g, '').split('-')[0]
  const parts = cleanVersion.split('.')
  return [
    parseInt(parts[0] || '0', 10),
    parseInt(parts[1] || '0', 10),
    parseInt(parts[2] || '0', 10),
    parseInt(parts[3] || '0', 10)
  ]
}

/**
 * 比较两个版本号
 * @returns -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const p1 = parseVersion(v1)
  const p2 = parseVersion(v2)
  
  for (let i = 0; i < 4; i++) {
    if (p1[i] < p2[i]) return -1
    if (p1[i] > p2[i]) return 1
  }
  return 0
}

/**
 * 检查函数是否在指定版本中受支持
 */
function isFunctionSupported(func: FunctionMetadata, dbVersion: string): boolean {
  // 如果没有设置版本限制，则所有版本都支持
  if (!func.minVersion && !func.maxVersion) {
    return true
  }
  
  // 检查最低版本要求
  if (func.minVersion && compareVersions(dbVersion, func.minVersion) < 0) {
    return false
  }
  
  // 检查最高版本限制
  if (func.maxVersion && compareVersions(dbVersion, func.maxVersion) > 0) {
    return false
  }
  
  return true
}

/**
 * 根据数据库类型获取函数配置文件路径
 */
function getFunctionsConfigPath(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlserver':
      return getResourcePath('sqlserver-functions.json')
    case 'mysql':
    default:
      return getResourcePath('mysql-functions.json')
  }
}

export class MetadataService {
  private tables: Map<string, TableMetadata> = new Map()
  private views: Map<string, ViewMetadata> = new Map()
  private allFunctions: FunctionMetadata[] = []  // 所有函数（未过滤）
  private functions: FunctionMetadata[] = []      // 当前版本支持的函数
  private functionsLoadResult: FunctionLoadResult | null = null
  private currentConnectionId: string | null = null
  private currentDatabase: string | null = null
  private currentDbVersion: string | null = null  // 当前数据库版本
  private currentDbType: DatabaseType = 'mysql'   // 当前数据库类型

  constructor() {
    // 初始化时加载函数列表
    this.loadFunctions()
  }

  /**
   * 设置数据库类型，并重新加载函数列表
   */
  setDatabaseType(dbType: DatabaseType): void {
    if (this.currentDbType === dbType) {
      return // 类型未变化，无需重新加载
    }
    
    this.currentDbType = dbType
    this.loadFunctions()
    console.log(`[MetadataService] Database type set to ${dbType}`)
  }

  /**
   * 获取当前数据库类型
   */
  getDatabaseType(): DatabaseType {
    return this.currentDbType
  }

  /**
   * 从 JSON 配置文件加载函数列表
   */
  loadFunctions(): FunctionLoadResult {
    const configPath = getFunctionsConfigPath(this.currentDbType)
    
    try {
      if (!fs.existsSync(configPath)) {
        console.warn(`[MetadataService] Functions config not found: ${configPath}`)
        this.functionsLoadResult = {
          functions: [],
          loadedAt: new Date(),
          source: configPath,
          error: 'Config file not found'
        }
        return this.functionsLoadResult
      }

      const content = fs.readFileSync(configPath, 'utf-8')
      const config: FunctionsConfig = JSON.parse(content)
      
      // 从所有分类中提取函数
      const allFunctions: FunctionMetadata[] = []
      for (const categoryKey of Object.keys(config.categories)) {
        const category = config.categories[categoryKey]
        if (category.functions && Array.isArray(category.functions)) {
          allFunctions.push(...category.functions)
        }
      }

      this.allFunctions = allFunctions
      // 如果已设置版本，则过滤；否则使用全部函数
      this.functions = this.currentDbVersion 
        ? this.filterFunctionsByVersion(allFunctions, this.currentDbVersion)
        : allFunctions
        
      this.functionsLoadResult = {
        functions: this.functions,
        loadedAt: new Date(),
        source: configPath
      }

      console.log(`[MetadataService] Loaded ${allFunctions.length} ${this.currentDbType} functions from ${configPath}`)
      if (this.currentDbVersion) {
        console.log(`[MetadataService] Filtered to ${this.functions.length} functions for version ${this.currentDbVersion}`)
      }
      return this.functionsLoadResult
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`[MetadataService] Failed to load functions: ${errorMessage}`)
      
      this.functionsLoadResult = {
        functions: [],
        loadedAt: new Date(),
        source: configPath,
        error: errorMessage
      }
      return this.functionsLoadResult
    }
  }

  /**
   * 根据数据库版本过滤函数
   */
  private filterFunctionsByVersion(functions: FunctionMetadata[], dbVersion: string): FunctionMetadata[] {
    return functions.filter(func => isFunctionSupported(func, dbVersion))
  }

  /**
   * 重新加载函数列表（支持热更新）
   */
  reloadFunctions(): FunctionLoadResult {
    return this.loadFunctions()
  }

  /**
   * 获取函数加载状态
   */
  getFunctionsLoadStatus(): FunctionLoadResult | null {
    return this.functionsLoadResult
  }

  /**
   * 设置数据库版本，并重新过滤函数列表
   * @param version MySQL 版本字符串，如 "8.0.32", "5.7.44"
   */
  setDatabaseVersion(version: string | null): void {
    if (this.currentDbVersion === version) {
      return // 版本未变化，无需重新过滤
    }
    
    this.currentDbVersion = version
    
    if (version) {
      this.functions = this.filterFunctionsByVersion(this.allFunctions, version)
      console.log(`[MetadataService] Database version set to ${version}, ${this.functions.length}/${this.allFunctions.length} functions available`)
    } else {
      this.functions = this.allFunctions
      console.log(`[MetadataService] Database version cleared, all ${this.allFunctions.length} functions available`)
    }
    
    // 更新加载结果
    if (this.functionsLoadResult) {
      this.functionsLoadResult = {
        ...this.functionsLoadResult,
        functions: this.functions
      }
    }
  }

  /**
   * 获取当前数据库版本
   */
  getDatabaseVersion(): string | null {
    return this.currentDbVersion
  }

  /**
   * 设置当前连接和数据库
   */
  setContext(connectionId: string | null, database: string | null): void {
    this.currentConnectionId = connectionId
    this.currentDatabase = database
  }

  /**
   * 更新表元数据
   */
  updateTables(tables: TableMetadata[]): void {
    this.tables.clear()
    for (const table of tables) {
      this.tables.set(table.name.toLowerCase(), table)
    }
  }

  /**
   * 更新视图元数据
   */
  updateViews(views: ViewMetadata[]): void {
    this.views.clear()
    for (const view of views) {
      this.views.set(view.name.toLowerCase(), view)
    }
  }

  /**
   * 获取所有表
   */
  getTables(): TableMetadata[] {
    return Array.from(this.tables.values())
  }

  /**
   * 获取所有视图
   */
  getViews(): ViewMetadata[] {
    return Array.from(this.views.values())
  }

  /**
   * 获取指定表的字段
   */
  getColumns(tableName: string): ColumnMetadata[] {
    const table = this.tables.get(tableName.toLowerCase())
    return table?.columns || []
  }

  /**
   * 获取表信息
   */
  getTable(tableName: string): TableMetadata | undefined {
    return this.tables.get(tableName.toLowerCase())
  }

  /**
   * 获取视图信息
   */
  getView(viewName: string): ViewMetadata | undefined {
    return this.views.get(viewName.toLowerCase())
  }

  /**
   * 获取所有函数（已根据当前数据库版本过滤）
   */
  getFunctions(): FunctionMetadata[] {
    return this.functions
  }

  /**
   * 获取所有函数（未过滤）
   */
  getAllFunctions(): FunctionMetadata[] {
    return this.allFunctions
  }

  /**
   * 获取函数信息
   */
  getFunction(funcName: string): FunctionMetadata | undefined {
    return this.functions.find(f => f.name.toLowerCase() === funcName.toLowerCase())
  }

  /**
   * 按分类获取函数（从配置文件重新读取以获取分类信息）
   * @param filterByVersion 是否根据当前数据库版本过滤，默认 true
   */
  getFunctionsByCategory(filterByVersion: boolean = true): Map<string, { label: string; functions: FunctionMetadata[] }> {
    const result = new Map<string, { label: string; functions: FunctionMetadata[] }>()
    const configPath = getFunctionsConfigPath(this.currentDbType)
    
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8')
        const config: FunctionsConfig = JSON.parse(content)
        
        for (const [key, category] of Object.entries(config.categories)) {
          let functions = category.functions
          
          // 根据版本过滤
          if (filterByVersion && this.currentDbVersion) {
            functions = this.filterFunctionsByVersion(functions, this.currentDbVersion)
          }
          
          // 只添加有函数的分类
          if (functions.length > 0) {
            result.set(key, {
              label: category.label,
              functions
            })
          }
        }
      }
    } catch (error) {
      console.error('[MetadataService] Failed to get functions by category:', error)
    }
    
    return result
  }

  /**
   * 检查表是否存在
   */
  hasTable(tableName: string): boolean {
    return this.tables.has(tableName.toLowerCase())
  }

  /**
   * 检查视图是否存在
   */
  hasView(viewName: string): boolean {
    return this.views.has(viewName.toLowerCase())
  }

  /**
   * 清空元数据
   */
  clear(): void {
    this.tables.clear()
    this.views.clear()
    this.currentConnectionId = null
    this.currentDatabase = null
    // 清空版本时恢复所有函数
    this.currentDbVersion = null
    this.functions = this.allFunctions
  }

  /**
   * 获取当前上下文
   */
  getContext(): { connectionId: string | null; database: string | null; dbVersion: string | null; dbType: DatabaseType } {
    return {
      connectionId: this.currentConnectionId,
      database: this.currentDatabase,
      dbVersion: this.currentDbVersion,
      dbType: this.currentDbType
    }
  }
}
