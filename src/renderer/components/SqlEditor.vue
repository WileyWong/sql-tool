<template>
  <div class="sql-editor">
    <!-- 标签页 -->
    <el-tabs
      v-model="activeTabId"
      type="card"
      closable
      @tab-remove="handleTabRemove"
      @tab-change="handleTabChange"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.id"
        :label="tab.title + (tab.isDirty ? ' *' : '')"
        :name="tab.id"
      />
    </el-tabs>
    
    <!-- 连接信息栏 -->
    <div class="connection-info">
      <div class="info-item">
        <span class="label">服务器:</span>
        <select v-model="selectedConnectionId" class="info-select">
          <option value="">请选择连接</option>
          <option 
            v-for="conn in connections" 
            :key="conn.id" 
            :value="conn.id"
          >
            {{ conn.name }}
          </option>
        </select>
      </div>
      <div class="info-item">
        <span class="label">数据库:</span>
        <select v-model="selectedDatabase" class="info-select">
          <option value="">请选择数据库</option>
          <option 
            v-for="db in databases" 
            :key="db" 
            :value="db"
          >
            {{ db }}
          </option>
        </select>
      </div>
      <div class="info-item">
        <span class="label">用户:</span>
        <span class="value">{{ currentUser }}</span>
      </div>
      <div class="info-item">
        <span class="label">最大行数:</span>
        <input 
          type="text" 
          v-model="maxRowsInput" 
          class="max-rows-input"
          @input="handleMaxRowsInput"
          @change="handleMaxRowsChange"
        />
      </div>
    </div>
    
    <!-- 编辑器容器 -->
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '../stores/editor'
import { useConnectionStore } from '../stores/connection'

// 补全项类型
interface CompletionItemResult {
  label: string
  kind: number
  insertText: string
  insertTextFormat?: number
  detail?: string
  documentation?: string
  sortText?: string
}

// 诊断结果类型
interface DiagnosticResult {
  range: { start: { line: number; character: number }; end: { line: number; character: number } }
  message: string
  severity: number
}

// 编辑结果类型
interface TextEditResult {
  range: { start: { line: number; character: number }; end: { line: number; character: number } }
  newText: string
}

const editorStore = useEditorStore()
const connectionStore = useConnectionStore()

// 注入保存确认对话框
const saveConfirmDialog = inject<{ show: (tabId: string, title: string, filePath?: string) => Promise<'save' | 'dontSave' | 'cancel'> }>('saveConfirmDialog')

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let completionDisposable: monaco.IDisposable | null = null
let hoverDisposable: monaco.IDisposable | null = null
let formatDisposable: monaco.IDisposable | null = null
let validateTimer: ReturnType<typeof setTimeout> | null = null
// 标志：是否正在程序化设置内容（防止触发 isDirty）
let isSettingContent = false

const tabs = computed(() => editorStore.tabs)
const activeTabId = computed({
  get: () => editorStore.activeTabId || '',
  set: (val) => editorStore.switchTab(val)
})

// 连接信息
const connections = computed(() => connectionStore.connections)
const selectedConnectionId = ref('')
const selectedDatabase = ref('')
const maxRowsInput = ref('5000')

// 当前用户
const currentUser = computed(() => {
  if (!selectedConnectionId.value) return '-'
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  return conn?.username || '-'
})

// 数据库列表
const databases = computed(() => {
  if (!selectedConnectionId.value) return []
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  if (!conn || conn.status !== 'connected') return []
  return connectionStore.getDatabaseNames(selectedConnectionId.value)
})

// 监听标签页切换，恢复该标签页的连接设置
watch(() => editorStore.activeTab, (tab) => {
  if (tab) {
    selectedConnectionId.value = tab.connectionId || ''
    selectedDatabase.value = tab.databaseName || ''
    maxRowsInput.value = String(tab.maxRows || 5000)
    
    // 更新编辑器内容（程序化设置，不触发 isDirty）
    if (editor) {
      const currentValue = editor.getValue()
      if (currentValue !== tab.content) {
        isSettingContent = true
        editor.setValue(tab.content)
        isSettingContent = false
      }
    }
  }
}, { immediate: true })

// 监听内容更新触发器（用于复用空标签页时刷新编辑器）
watch(() => editorStore.contentUpdateTrigger, () => {
  const tab = editorStore.activeTab
  if (tab && editor) {
    const currentValue = editor.getValue()
    if (currentValue !== tab.content) {
      isSettingContent = true
      editor.setValue(tab.content)
      isSettingContent = false
    }
  }
})

// 监听当前标签页的连接设置变化（用于响应外部切换，如双击数据库树）
watch(() => editorStore.activeTab?.connectionId, (newConnectionId) => {
  if (newConnectionId !== undefined && newConnectionId !== selectedConnectionId.value) {
    selectedConnectionId.value = newConnectionId || ''
  }
})

watch(() => editorStore.activeTab?.databaseName, (newDatabaseName) => {
  if (newDatabaseName !== undefined && newDatabaseName !== selectedDatabase.value) {
    selectedDatabase.value = newDatabaseName || ''
  }
})

// 监听连接选择变化
watch(selectedConnectionId, async (newId) => {
  if (newId) {
    const conn = connections.value.find(c => c.id === newId)
    if (conn && conn.status !== 'connected') {
      await connectionStore.connect(newId)
    }
    connectionStore.setCurrentConnection(newId)
  }
  // 保存到当前标签页
  editorStore.updateTabConnection(newId || undefined, selectedDatabase.value || undefined)
  
  // 更新 Language Server 上下文
  updateLanguageServerContext()
})

// 监听数据库选择变化
watch(selectedDatabase, async (newDb) => {
  console.log('[SqlEditor] selectedDatabase changed:', newDb)
  editorStore.updateTabConnection(selectedConnectionId.value || undefined, newDb || undefined)
  
  // 更新 Language Server 元数据
  await updateLanguageServerMetadata()
})

/**
 * 更新 Language Server 上下文
 */
async function updateLanguageServerContext() {
  try {
    await window.api.sqlLanguageServer.setContext(
      selectedConnectionId.value || null,
      selectedDatabase.value || null
    )
  } catch (error) {
    console.error('更新 Language Server 上下文失败:', error)
  }
}

/**
 * 更新 Language Server 元数据
 */
async function updateLanguageServerMetadata() {
  console.log('[SqlEditor] updateLanguageServerMetadata called', {
    connectionId: selectedConnectionId.value,
    database: selectedDatabase.value
  })
  
  if (!selectedConnectionId.value || !selectedDatabase.value) {
    console.log('[SqlEditor] No connection or database selected, clearing metadata')
    await window.api.sqlLanguageServer.clear()
    return
  }

  try {
    // 先检查是否已有元数据
    let dbMeta = connectionStore.getDatabaseMeta(selectedConnectionId.value, selectedDatabase.value)
    
    // 如果没有表数据，主动加载
    if (!dbMeta || dbMeta.tables.length === 0) {
      console.log('[SqlEditor] No tables cached, loading...')
      await connectionStore.loadTables(selectedConnectionId.value, selectedDatabase.value)
      await connectionStore.loadViews(selectedConnectionId.value, selectedDatabase.value)
      dbMeta = connectionStore.getDatabaseMeta(selectedConnectionId.value, selectedDatabase.value)
      
      // 加载所有表的列信息
      if (dbMeta && dbMeta.tables.length > 0) {
        console.log('[SqlEditor] Loading columns for', dbMeta.tables.length, 'tables...')
        await Promise.all(
          dbMeta.tables.map(table => 
            connectionStore.loadColumns(selectedConnectionId.value!, selectedDatabase.value!, table.name)
          )
        )
        // 重新获取更新后的元数据
        dbMeta = connectionStore.getDatabaseMeta(selectedConnectionId.value, selectedDatabase.value)
      }
    }
    
    // console.log('[SqlEditor] dbMeta:', dbMeta ? `${dbMeta.tables.length} tables, ${dbMeta.views.length} views` : 'null')
    
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
      // console.log('[SqlEditor] Updating tables:', tables.length)
      await window.api.sqlLanguageServer.updateTables(tables)

      // 更新视图元数据
      const views = dbMeta.views.map(v => ({
        name: v.name,
        comment: undefined as string | undefined
      }))
      // console.log('[SqlEditor] Updating views:', views.length)
      await window.api.sqlLanguageServer.updateViews(views)
      
      // console.log('[SqlEditor] Metadata update complete')
    } else {
      console.log('[SqlEditor] No dbMeta found, clearing metadata')
      await window.api.sqlLanguageServer.clear()
    }
  } catch (error) {
    console.error('更新 Language Server 元数据失败:', error)
  }
}

function handleMaxRowsInput(e: Event) {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9]/g, '')
  maxRowsInput.value = target.value
}

function handleMaxRowsChange() {
  const maxRows = parseInt(maxRowsInput.value) || 5000
  editorStore.updateTabMaxRows(maxRows)
}

// 初始化编辑器
function initEditor() {
  if (!editorContainer.value) return
  
  editor = monaco.editor.create(editorContainer.value, {
    value: editorStore.currentSql,
    language: 'sql',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    suggestOnTriggerCharacters: true,
    quickSuggestions: true
  })
  
  // 内容变化监听
  editor.onDidChangeModelContent(() => {
    const value = editor?.getValue() || ''
    
    // 只有用户手动编辑时才标记为脏
    if (!isSettingContent) {
      editorStore.updateContent(value)
    }
    
    // 延迟验证语法
    scheduleValidation()
  })
  
  // 注册 Language Server 提供者
  registerLanguageServerProviders()
  
  // 注册格式化快捷键
  editor.addAction({
    id: 'sql.format',
    label: '格式化 SQL',
    keybindings: [
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF
    ],
    run: formatDocument
  })
}

/**
 * 注册 Language Server 提供者
 */
function registerLanguageServerProviders() {
  // 自动补全
  completionDisposable = monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: ['.', ' ', '\n'],
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
          return null
        }

        return {
          contents: [{ value: result.hover.contents.value }]
        }
      } catch (error) {
        console.error('悬浮提示请求失败:', error)
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
 * 转换补全项类型
 */
function convertCompletionItemKind(kind: number): monaco.languages.CompletionItemKind {
  // LSP CompletionItemKind 到 Monaco CompletionItemKind 的映射
  const kindMap: Record<number, monaco.languages.CompletionItemKind> = {
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
  return kindMap[kind] || monaco.languages.CompletionItemKind.Text
}

/**
 * 延迟验证语法
 */
function scheduleValidation() {
  if (validateTimer) {
    clearTimeout(validateTimer)
  }
  validateTimer = setTimeout(validateDocument, 500)
}

/**
 * 验证文档语法
 */
async function validateDocument() {
  if (!editor) return

  const model = editor.getModel()
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
 * 转换诊断严重性
 */
function convertDiagnosticSeverity(severity: number): monaco.MarkerSeverity {
  // LSP DiagnosticSeverity: 1=Error, 2=Warning, 3=Information, 4=Hint
  const severityMap: Record<number, monaco.MarkerSeverity> = {
    1: monaco.MarkerSeverity.Error,
    2: monaco.MarkerSeverity.Warning,
    3: monaco.MarkerSeverity.Info,
    4: monaco.MarkerSeverity.Hint
  }
  return severityMap[severity] || monaco.MarkerSeverity.Error
}

/**
 * 格式化文档
 */
async function formatDocument() {
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

// 标签页移除（带保存确认）
async function handleTabRemove(tabId: string | number) {
  const id = String(tabId)
  const tab = editorStore.tabs.find(t => t.id === id)
  
  if (tab && tab.isDirty) {
    // 有未保存的更改，弹出确认对话框
    if (!saveConfirmDialog) {
      // 降级到 window.confirm
      const fileName = tab.filePath ? tab.filePath.split(/[/\\]/).pop() : tab.title
      const result = window.confirm(`文件 "${fileName}" 已修改，是否保存更改？\n\n点击"确定"保存，点击"取消"不保存并关闭。`)
      
      if (result) {
        const saveResult = await editorStore.saveTabById(id)
        if (!saveResult.success && saveResult.canceled) {
          return
        }
      }
    } else {
      const result = await saveConfirmDialog.show(
        tab.id,
        tab.title,
        tab.filePath
      )
      
      if (result === 'save') {
        // 用户选择保存
        const saveResult = await editorStore.saveTabById(id)
        if (!saveResult.success && saveResult.canceled) {
          // 用户取消了另存为对话框，不关闭标签页
          return
        }
      } else if (result === 'cancel') {
        // 用户取消，不关闭标签页
        return
      }
      // result === 'dontSave' 时继续关闭
    }
  }
  
  editorStore.closeTab(id)
}

// 标签页切换
function handleTabChange(tabId: string | number) {
  editorStore.switchTab(String(tabId))
}

// 保存快捷键处理
async function handleSaveShortcut(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    const result = await editorStore.saveFile()
    if (result.success) {
      // 可以添加保存成功的提示
    }
  }
}

onMounted(async () => {
  editorStore.init()
  initEditor()
  // 添加键盘快捷键监听
  window.addEventListener('keydown', handleSaveShortcut)
  
  // 初始化 Language Server 元数据
  await updateLanguageServerMetadata()
})

onUnmounted(() => {
  // 清理定时器
  if (validateTimer) {
    clearTimeout(validateTimer)
  }
  
  // 清理 disposables
  completionDisposable?.dispose()
  hoverDisposable?.dispose()
  formatDisposable?.dispose()
  
  editor?.dispose()
  // 移除键盘快捷键监听
  window.removeEventListener('keydown', handleSaveShortcut)
})
</script>

<style scoped>
.sql-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.sql-editor :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 8px;
  background: #2d2d2d;
  border-bottom: 1px solid #555;
}

.sql-editor :deep(.el-tabs__nav-wrap) {
  background: #2d2d2d;
}

.sql-editor :deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  color: #d4d4d4;
  border-color: #555 !important;
  background: #2d2d2d;
}

.sql-editor :deep(.el-tabs__item:hover) {
  color: #fff;
}

.sql-editor :deep(.el-tabs__item.is-active) {
  color: #fff;
  background: #1e1e1e;
  border-bottom-color: #0e639c !important;
}

.sql-editor :deep(.el-tabs__nav) {
  border-color: #555;
}

/* 连接信息栏 */
.connection-info {
  background: #2d2d2d;
  padding: 8px 12px;
  display: flex;
  gap: 20px;
  font-size: 12px;
  border-bottom: 1px solid #555;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item .label {
  color: #888;
}

.info-item .value {
  color: #4ec9b0;
  font-weight: 500;
}

.info-select {
  background: #3c3c3c;
  color: #4ec9b0;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 24px 4px 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M3 4.5L6 8l3-3.5H3z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.info-select:hover {
  border-color: #0e639c;
}

.info-select:focus {
  border-color: #0e639c;
  box-shadow: 0 0 0 1px #0e639c;
}

.info-select option {
  background: #2d2d2d;
  color: #d4d4d4;
}

.max-rows-input {
  width: 70px;
  background: #3c3c3c;
  color: #4ec9b0;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  text-align: center;
}

.max-rows-input:hover {
  border-color: #0e639c;
}

.max-rows-input:focus {
  border-color: #0e639c;
  box-shadow: 0 0 0 1px #0e639c;
}

.editor-container {
  flex: 1;
  min-height: 0;
}
</style>
