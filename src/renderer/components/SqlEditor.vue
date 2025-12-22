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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '../stores/editor'
import { useConnectionStore } from '../stores/connection'

const editorStore = useEditorStore()
const connectionStore = useConnectionStore()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

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
    
    // 更新编辑器内容
    if (editor) {
      const currentValue = editor.getValue()
      if (currentValue !== tab.content) {
        editor.setValue(tab.content)
      }
    }
  }
}, { immediate: true })

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
})

// 监听数据库选择变化
watch(selectedDatabase, (newDb) => {
  editorStore.updateTabConnection(selectedConnectionId.value || undefined, newDb || undefined)
})

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
    editorStore.updateContent(value)
  })
  
  // 注册自动补全
  registerCompletionProvider()
}

// 注册自动补全提供者
function registerCompletionProvider() {
  monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: ['.', ' '],
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      })
      
      const suggestions: monaco.languages.CompletionItem[] = []
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }
      
      // SQL 关键字
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
        'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
        'CREATE', 'TABLE', 'VIEW', 'INDEX', 'FUNCTION', 'PROCEDURE', 'TRIGGER',
        'ALTER', 'DROP', 'TRUNCATE',
        'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON',
        'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
        'UNION', 'ALL', 'DISTINCT', 'AS',
        'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'NOT NULL', 'DEFAULT',
        'INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP', 'BOOLEAN', 'DECIMAL'
      ]
      
      // 判断上下文
      const upperText = textUntilPosition.toUpperCase()
      
      // FROM/JOIN 后提示表名
      if (/\b(FROM|JOIN)\s+$/i.test(textUntilPosition)) {
        addTableSuggestions(suggestions, range)
      }
      // 表别名后提示字段
      else if (/\.\s*$/.test(textUntilPosition)) {
        const match = textUntilPosition.match(/(\w+)\.\s*$/)
        if (match) {
          addColumnSuggestions(suggestions, range, match[1])
        }
      }
      // WHERE/ON/SELECT 后提示字段
      else if (/\b(WHERE|ON|SELECT)\s+.*$/i.test(textUntilPosition) && !/\bFROM\b/i.test(textUntilPosition.split(/WHERE|ON/i).pop() || '')) {
        addColumnSuggestions(suggestions, range)
        addKeywordSuggestions(suggestions, range, keywords)
      }
      // 默认提示关键字
      else {
        addKeywordSuggestions(suggestions, range, keywords)
        addTableSuggestions(suggestions, range)
      }
      
      return { suggestions }
    }
  })
}

// 添加关键字建议
function addKeywordSuggestions(
  suggestions: monaco.languages.CompletionItem[],
  range: monaco.IRange,
  keywords: string[]
) {
  for (const keyword of keywords) {
    suggestions.push({
      label: keyword,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: keyword,
      range
    })
  }
}

// 添加表名建议
function addTableSuggestions(
  suggestions: monaco.languages.CompletionItem[],
  range: monaco.IRange
) {
  const conn = connectionStore.currentConnection
  if (!conn) return
  
  const databases = connectionStore.getDatabaseNames(conn.id)
  for (const dbName of databases) {
    const dbMeta = connectionStore.getDatabaseMeta(conn.id, dbName)
    if (dbMeta) {
      for (const table of dbMeta.tables) {
        suggestions.push({
          label: table.name,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: table.name,
          detail: `表 - ${dbName}`,
          range
        })
      }
      for (const view of dbMeta.views) {
        suggestions.push({
          label: view.name,
          kind: monaco.languages.CompletionItemKind.Interface,
          insertText: view.name,
          detail: `视图 - ${dbName}`,
          range
        })
      }
    }
  }
}

// 添加字段建议
function addColumnSuggestions(
  suggestions: monaco.languages.CompletionItem[],
  range: monaco.IRange,
  tableAlias?: string
) {
  const conn = connectionStore.currentConnection
  if (!conn) return
  
  const databases = connectionStore.getDatabaseNames(conn.id)
  for (const dbName of databases) {
    const dbMeta = connectionStore.getDatabaseMeta(conn.id, dbName)
    if (dbMeta) {
      for (const table of dbMeta.tables) {
        // 如果指定了表别名，只显示该表的字段
        if (tableAlias && table.name.toLowerCase() !== tableAlias.toLowerCase()) {
          continue
        }
        for (const column of table.columns) {
          suggestions.push({
            label: column.name,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: column.name,
            detail: `${column.type} - ${table.name}`,
            range
          })
        }
      }
    }
  }
}

// 标签页移除
function handleTabRemove(tabId: string | number) {
  editorStore.closeTab(String(tabId))
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

onMounted(() => {
  editorStore.init()
  initEditor()
  // 添加键盘快捷键监听
  window.addEventListener('keydown', handleSaveShortcut)
})

onUnmounted(() => {
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
