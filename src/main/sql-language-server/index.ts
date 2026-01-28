/**
 * SQL Language Server 入口
 * 通过 IPC 与 Renderer 进程通信
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { CompletionProvider } from './providers/completionProvider'
import { DiagnosticProvider } from './providers/diagnosticProvider'
import { HoverProvider } from './providers/hoverProvider'
import { FormattingProvider } from './providers/formattingProvider'
import { MetadataService } from './services/metadataService'
import type { TableMetadata, ViewMetadata } from './types'

// 服务实例
let metadataService: MetadataService
let completionProvider: CompletionProvider
let diagnosticProvider: DiagnosticProvider
let hoverProvider: HoverProvider
let formattingProvider: FormattingProvider

/**
 * 初始化 SQL Language Server
 */
export function initSqlLanguageServer(): void {
  // 创建服务实例
  metadataService = new MetadataService()
  completionProvider = new CompletionProvider(metadataService)
  diagnosticProvider = new DiagnosticProvider()
  hoverProvider = new HoverProvider(metadataService)
  formattingProvider = new FormattingProvider()

  // 注册 IPC 处理器
  registerIpcHandlers()

  console.log('SQL Language Server 已初始化')
}

/**
 * 注册 IPC 处理器
 */
function registerIpcHandlers(): void {
  // 自动补全
  ipcMain.handle('sql-ls:completion', async (
    _event: IpcMainInvokeEvent,
    documentText: string,
    line: number,
    character: number
  ) => {
    try {
      const items = completionProvider.provideCompletionItems(
        documentText,
        { line, character }
      )
      return { success: true, items }
    } catch (error: any) {
      console.error('补全请求失败:', error)
      return { success: false, error: error.message, items: [] }
    }
  })

  // 语法诊断
  ipcMain.handle('sql-ls:validate', async (
    _event: IpcMainInvokeEvent,
    documentText: string
  ) => {
    try {
      const diagnostics = diagnosticProvider.validate(documentText)
      return { success: true, diagnostics }
    } catch (error: any) {
      console.error('诊断请求失败:', error)
      return { success: false, error: error.message, diagnostics: [] }
    }
  })

  // 悬浮提示
  ipcMain.handle('sql-ls:hover', async (
    _event: IpcMainInvokeEvent,
    documentText: string,
    line: number,
    character: number
  ) => {
    try {
      const result = hoverProvider.provideHover(
        documentText,
        { line, character }
      )
      if (result) {
        return {
          success: true,
          hover: result.hover,
          tableInfo: result.tableInfo
        }
      }
      return { success: true, hover: null }
    } catch (error: any) {
      console.error('悬浮提示请求失败:', error)
      return { success: false, error: error.message, hover: null }
    }
  })

  // 代码格式化
  ipcMain.handle('sql-ls:format', async (
    _event: IpcMainInvokeEvent,
    documentText: string
  ) => {
    try {
      const edits = formattingProvider.formatDocument(documentText)
      return { success: true, edits }
    } catch (error: any) {
      console.error('格式化请求失败:', error)
      return { success: false, error: error.message, edits: [] }
    }
  })

  // 更新元数据 - 表
  ipcMain.handle('sql-ls:updateTables', async (
    _event: IpcMainInvokeEvent,
    tables: TableMetadata[]
  ) => {
    try {
      metadataService.updateTables(tables)
      return { success: true }
    } catch (error: any) {
      console.error('更新表元数据失败:', error)
      return { success: false, error: error.message }
    }
  })

  // 更新元数据 - 视图
  ipcMain.handle('sql-ls:updateViews', async (
    _event: IpcMainInvokeEvent,
    views: ViewMetadata[]
  ) => {
    try {
      metadataService.updateViews(views)
      return { success: true }
    } catch (error: any) {
      console.error('更新视图元数据失败:', error)
      return { success: false, error: error.message }
    }
  })

  // 设置上下文
  ipcMain.handle('sql-ls:setContext', async (
    _event: IpcMainInvokeEvent,
    connectionId: string | null,
    database: string | null
  ) => {
    try {
      metadataService.setContext(connectionId, database)
      return { success: true }
    } catch (error: any) {
      console.error('设置上下文失败:', error)
      return { success: false, error: error.message }
    }
  })

  // 设置数据库版本（用于过滤函数列表）
  ipcMain.handle('sql-ls:setDatabaseVersion', async (
    _event: IpcMainInvokeEvent,
    version: string | null
  ) => {
    try {
      metadataService.setDatabaseVersion(version)
      return { success: true, functionsCount: metadataService.getFunctions().length }
    } catch (error: any) {
      console.error('设置数据库版本失败:', error)
      return { success: false, error: error.message }
    }
  })

  // 清空元数据
  ipcMain.handle('sql-ls:clear', async () => {
    try {
      metadataService.clear()
      return { success: true }
    } catch (error: any) {
      console.error('清空元数据失败:', error)
      return { success: false, error: error.message }
    }
  })
}

/**
 * 获取元数据服务（供其他模块使用）
 */
export function getMetadataService(): MetadataService {
  return metadataService
}
