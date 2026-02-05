/**
 * Language Server Composable
 * 封装 SQL Language Server 的所有交互逻辑
 */

import { ref } from 'vue'
import * as monaco from 'monaco-editor'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'

// 补全项类型
export interface CompletionItemResult {
  label: string
  kind: number
  insertText: string
  insertTextFormat?: number
  detail?: string
  documentation?: string
  sortText?: string
}

// 诊断结果类型
export interface DiagnosticResult {
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
  message: string
  severity: number
}

// 文本编辑结果类型
export interface TextEditResult {
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
  newText: string
}

// LSP CompletionItemKind 到 Monaco CompletionItemKind 的映射
const COMPLETION_KIND_MAP: Record<number, monaco.languages.CompletionItemKind> = {
  1: monaco.languages.CompletionItemKind.Text,
  2: monaco.languages.CompletionItemKind.Method,
  3: monaco.languages.CompletionItemKind.Function,
  4: monaco.languages.CompletionItemKind.Constructor,
  5: monaco.languages.CompletionItemKind.Field,
  6: monaco.languages.CompletionItemKind.Variable,
  7: monaco.languages.CompletionItemKind.Class,
  8: monaco.languages.CompletionItemKind.Interface,
  9: monaco.languages.CompletionItemKind.Module,
  10: monaco.languages.CompletionItemKind.Property,
  11: monaco.languages.CompletionItemKind.Unit,
  12: monaco.languages.CompletionItemKind.Value,
  13: monaco.languages.CompletionItemKind.Enum,
  14: monaco.languages.CompletionItemKind.Keyword,
  15: monaco.languages.CompletionItemKind.Snippet,
  16: monaco.languages.CompletionItemKind.Color,
  17: monaco.languages.CompletionItemKind.File,
  18: monaco.languages.CompletionItemKind.Reference,
  19: monaco.languages.CompletionItemKind.Folder,
  20: monaco.languages.CompletionItemKind.EnumMember,
  21: monaco.languages.CompletionItemKind.Constant,
  22: monaco.languages.CompletionItemKind.Struct,
  23: monaco.languages.CompletionItemKind.Event,
  24: monaco.languages.CompletionItemKind.Operator,
  25: monaco.languages.CompletionItemKind.TypeParameter
}

// LSP DiagnosticSeverity 到 Monaco MarkerSeverity 的映射
const SEVERITY_MAP: Record<number, monaco.MarkerSeverity> = {
  1: monaco.MarkerSeverity.Error,
  2: monaco.MarkerSeverity.Warning,
  3: monaco.MarkerSeverity.Info,
  4: monaco.MarkerSeverity.Hint
}

export function useLanguageServer() {
  const connectionStore = useConnectionStore()
  const editorStore = useEditorStore()
  
  // 当前连接和数据库状态（避免重复更新）
  const lastConnectionId = ref<string | undefined>()
  const lastDatabaseName = ref<string | undefined>()
  
  // 当前 hover 的表信息（用于点击处理）
  const currentHoverTableInfo = ref<{ name: string } | null>(null)
  
  // Disposables
  let completionDisposable: monaco.IDisposable | null = null
  let hoverDisposable: monaco.IDisposable | null = null
  let formatDisposable: monaco.IDisposable | null = null
  let commandDisposable: monaco.IDisposable | null = null
  let validateTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 转换补全项类型
   */
  function convertCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
    return COMPLETION_KIND_MAP[kind] || monaco.languages.CompletionItemKind.Text
  }

  /**
   * 转换诊断严重性
   */
  function convertDiagnosticSeverity(severity: number): monaco.MarkerSeverity {
    return SEVERITY_MAP[severity] || monaco.MarkerSeverity.Error
  }

  /**
   * 更新 Language Server 上下文
   */
  async function updateContext(connectionId: string | null, databaseName: string | null) {
    try {
      await window.api.sqlLanguageServer.setContext(connectionId, databaseName)
    } catch (error) {
      console.error('更新 Language Server 上下文失败:', error)
    }
  }

  /**
   * 更新 Language Server 元数据
   */
  async function updateMetadata(
    connectionId: string | undefined,
    databaseName: string | undefined,
    forceRefresh = false
  ) {
    if (!connectionId || !databaseName) {
      await window.api.sqlLanguageServer.clear()
      return
    }

    try {
      // 先检查是否已有元数据
      let dbMeta = connectionStore.getDatabaseMeta(connectionId, databaseName)
      
      // 如果没有表数据或列数据不完整，使用 tablesWithColumns 一次性加载
      const needsFullLoad = forceRefresh || 
        !dbMeta || 
        dbMeta.tables.length === 0 || 
        dbMeta.tables.some(t => !t.columns || t.columns.length === 0)
      
      if (needsFullLoad) {
        // 使用新的 API 一次性获取所有表及其列信息
        await connectionStore.loadTablesWithColumns(connectionId, databaseName)
        await connectionStore.loadViews(connectionId, databaseName)
        dbMeta = connectionStore.getDatabaseMeta(connectionId, databaseName)
      }
      
      if (dbMeta) {
        // 更新表元数据
        const tables = dbMeta.tables.map(t => ({
          name: t.name,
          comment: t.comment,
          columns: t.columns.map(c => ({
            name: c.name,
            type: c.type,
            nullable: c.nullable !== false,
            defaultValue: c.defaultValue,
            comment: c.comment,
            isPrimaryKey: c.primaryKey
          }))
        }))
        await window.api.sqlLanguageServer.updateTables(tables)

        // 更新视图元数据
        const views = dbMeta.views.map(v => ({
          name: v.name,
          comment: undefined as string | undefined
        }))
        await window.api.sqlLanguageServer.updateViews(views)
      } else {
        await window.api.sqlLanguageServer.clear()
      }
    } catch (error) {
      console.error('更新 Language Server 元数据失败:', error)
    }
  }

  /**
   * 检查并更新上下文（仅在变化时）
   */
  async function checkAndUpdateContext(connectionId: string | undefined, databaseName: string | undefined) {
    if (connectionId !== lastConnectionId.value) {
      lastConnectionId.value = connectionId
      await updateContext(connectionId || null, databaseName || null)
    }
  }

  /**
   * 检查并更新元数据（仅在变化时）
   */
  async function checkAndUpdateMetadata(
    connectionId: string | undefined,
    databaseName: string | undefined,
    forceRefresh = false
  ) {
    if (databaseName !== lastDatabaseName.value || forceRefresh) {
      lastDatabaseName.value = databaseName
      await updateMetadata(connectionId, databaseName, forceRefresh)
    }
  }

  /**
   * 注册 Language Server 提供者
   */
  function registerProviders() {
    // 自动补全
    completionDisposable = monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters: ['.', ' '],
      provideCompletionItems: async (model, position) => {
        const documentText = model.getValue()
        const line = position.lineNumber - 1 // Monaco 是 1-based，LSP 是 0-based
        const character = position.column - 1

        try {
          const result = await window.api.sqlLanguageServer.completion(documentText, line, character)
          
          if (!result.success || !result.items.length) {
            return { suggestions: [] }
          }

          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          }

          const suggestions: monaco.languages.CompletionItem[] = result.items.map((item: CompletionItemResult) => ({
            label: item.label,
            kind: convertCompletionItemKind(item.kind),
            insertText: item.insertText,
            insertTextRules: item.insertTextFormat === 2 
              ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
              : undefined,
            detail: item.detail,
            documentation: item.documentation,
            sortText: item.sortText,
            range
          }))

          return { suggestions }
        } catch (error) {
          console.error('补全请求失败:', error)
          return { suggestions: [] }
        }
      }
    })

    // 悬浮提示
    hoverDisposable = monaco.languages.registerHoverProvider('sql', {
      provideHover: async (model, position) => {
        const documentText = model.getValue()
        const line = position.lineNumber - 1
        const character = position.column - 1

        try {
          const result = await window.api.sqlLanguageServer.hover(documentText, line, character)
          
          if (!result.success || !result.hover) {
            // 清除状态栏提示和表信息
            editorStore.setHoverHint(null)
            currentHoverTableInfo.value = null
            return null
          }

          // 如果是表 hover，设置状态栏提示和保存表信息
          if (result.tableInfo) {
            editorStore.setHoverHint('💡 点击表名打开表管理')
            currentHoverTableInfo.value = result.tableInfo
          } else {
            editorStore.setHoverHint(null)
            currentHoverTableInfo.value = null
          }

          return {
            contents: [{ value: result.hover.contents.value }]
          }
        } catch (error) {
          console.error('悬浮提示请求失败:', error)
          editorStore.setHoverHint(null)
          currentHoverTableInfo.value = null
          return null
        }
      }
    })

    // 格式化
    formatDisposable = monaco.languages.registerDocumentFormattingEditProvider('sql', {
      provideDocumentFormattingEdits: async (model) => {
        const documentText = model.getValue()

        try {
          const result = await window.api.sqlLanguageServer.format(documentText)
          
          if (!result.success || !result.edits.length) {
            return []
          }

          return result.edits.map((edit: TextEditResult) => ({
            range: {
              startLineNumber: edit.range.start.line + 1,
              startColumn: edit.range.start.character + 1,
              endLineNumber: edit.range.end.line + 1,
              endColumn: edit.range.end.character + 1
            },
            text: edit.newText
          }))
        } catch (error) {
          console.error('格式化请求失败:', error)
          return []
        }
      }
    })
  }

  /**
   * 延迟验证语法
   */
  function scheduleValidation(callback: () => void) {
    if (validateTimer) {
      clearTimeout(validateTimer)
    }
    validateTimer = setTimeout(callback, 500)
  }

  /**
   * 验证文档语法
   */
  async function validateDocument(model: monaco.editor.ITextModel | null) {
    if (!model) return

    const documentText = model.getValue()

    try {
      const result = await window.api.sqlLanguageServer.validate(documentText)
      
      if (!result.success) {
        monaco.editor.setModelMarkers(model, 'sql', [])
        return
      }

      const markers: monaco.editor.IMarkerData[] = result.diagnostics.map((d: DiagnosticResult) => ({
        severity: convertDiagnosticSeverity(d.severity),
        message: d.message,
        startLineNumber: d.range.start.line + 1,
        startColumn: d.range.start.character + 1,
        endLineNumber: d.range.end.line + 1,
        endColumn: d.range.end.character + 1
      }))

      monaco.editor.setModelMarkers(model, 'sql', markers)
    } catch (error) {
      console.error('语法验证失败:', error)
    }
  }

  /**
   * 格式化文档
   */
  async function formatDocument(editor: monaco.editor.IStandaloneCodeEditor | null) {
    if (!editor) return

    const model = editor.getModel()
    if (!model) return

    const documentText = model.getValue()

    try {
      const result = await window.api.sqlLanguageServer.format(documentText)
      
      if (result.success && result.edits.length > 0) {
        const edit = result.edits[0]
        editor.setValue(edit.newText)
      }
    } catch (error) {
      console.error('格式化失败:', error)
    }
  }

  /**
   * 打开表管理对话框（处理 hover 中的表名点击）
   */
  function openTableManageFromHover() {
    const tableInfo = currentHoverTableInfo.value
    const connectionId = lastConnectionId.value
    const databaseName = lastDatabaseName.value
    
    if (tableInfo && connectionId && databaseName) {
      connectionStore.openTableManageDialog(connectionId, databaseName, tableInfo.name)
    }
  }

  /**
   * 清除 hover 状态（当 hover widget 关闭时调用）
   */
  function clearHoverState() {
    editorStore.setHoverHint(null)
    currentHoverTableInfo.value = null
  }

  /**
   * 清理资源
   */
  function dispose() {
    if (validateTimer) {
      clearTimeout(validateTimer)
      validateTimer = null
    }
    
    completionDisposable?.dispose()
    hoverDisposable?.dispose()
    formatDisposable?.dispose()
    commandDisposable?.dispose()
    
    completionDisposable = null
    hoverDisposable = null
    formatDisposable = null
    commandDisposable = null
    
    // 清除状态
    editorStore.setHoverHint(null)
    currentHoverTableInfo.value = null
  }

  return {
    // 状态
    lastConnectionId,
    lastDatabaseName,
    currentHoverTableInfo,
    
    // 上下文管理
    updateContext,
    updateMetadata,
    checkAndUpdateContext,
    checkAndUpdateMetadata,
    
    // 提供者注册
    registerProviders,
    
    // 验证与格式化
    scheduleValidation,
    validateDocument,
    formatDocument,
    
    // Hover 交互
    openTableManageFromHover,
    clearHoverState,
    
    // 资源清理
    dispose
  }
}
