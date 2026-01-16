/**
 * 元数据服务
 * 管理数据库元数据（表、字段、视图、函数）
 * 函数列表从外部 JSON 配置文件加载，支持热更新
 */

import fs from 'fs'
import type { TableMetadata, ViewMetadata, FunctionMetadata, ColumnMetadata } from '../types'
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
interface MySQLFunctionsConfig {
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

export class MetadataService {
  private tables: Map<string, TableMetadata> = new Map()
  private views: Map<string, ViewMetadata> = new Map()
  private functions: FunctionMetadata[] = []
  private functionsLoadResult: FunctionLoadResult | null = null
  private currentConnectionId: string | null = null
  private currentDatabase: string | null = null

  constructor() {
    // 初始化时加载函数列表
    this.loadFunctions()
  }

  /**
   * 从 JSON 配置文件加载 MySQL 函数列表
   */
  loadFunctions(): FunctionLoadResult {
    const configPath = getResourcePath('mysql-functions.json')
    
    try {
      if (!fs.existsSync(configPath)) {
        console.warn(`[MetadataService] MySQL functions config not found: ${configPath}`)
        this.functionsLoadResult = {
          functions: [],
          loadedAt: new Date(),
          source: configPath,
          error: 'Config file not found'
        }
        return this.functionsLoadResult
      }

      const content = fs.readFileSync(configPath, 'utf-8')
      const config: MySQLFunctionsConfig = JSON.parse(content)
      
      // 从所有分类中提取函数
      const allFunctions: FunctionMetadata[] = []
      for (const categoryKey of Object.keys(config.categories)) {
        const category = config.categories[categoryKey]
        if (category.functions && Array.isArray(category.functions)) {
          allFunctions.push(...category.functions)
        }
      }

      this.functions = allFunctions
      this.functionsLoadResult = {
        functions: allFunctions,
        loadedAt: new Date(),
        source: configPath
      }

      console.log(`[MetadataService] Loaded ${allFunctions.length} MySQL functions from ${configPath}`)
      return this.functionsLoadResult
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`[MetadataService] Failed to load MySQL functions: ${errorMessage}`)
      
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
   * 获取所有函数
   */
  getFunctions(): FunctionMetadata[] {
    return this.functions
  }

  /**
   * 获取函数信息
   */
  getFunction(funcName: string): FunctionMetadata | undefined {
    return this.functions.find(f => f.name.toLowerCase() === funcName.toLowerCase())
  }

  /**
   * 按分类获取函数（从配置文件重新读取以获取分类信息）
   */
  getFunctionsByCategory(): Map<string, { label: string; functions: FunctionMetadata[] }> {
    const result = new Map<string, { label: string; functions: FunctionMetadata[] }>()
    const configPath = getResourcePath('mysql-functions.json')
    
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8')
        const config: MySQLFunctionsConfig = JSON.parse(content)
        
        for (const [key, category] of Object.entries(config.categories)) {
          result.set(key, {
            label: category.label,
            functions: category.functions
          })
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
    // 注意：不清空 functions，因为它们是全局的 MySQL 内置函数
  }

  /**
   * 获取当前上下文
   */
  getContext(): { connectionId: string | null; database: string | null } {
    return {
      connectionId: this.currentConnectionId,
      database: this.currentDatabase
    }
  }
}
