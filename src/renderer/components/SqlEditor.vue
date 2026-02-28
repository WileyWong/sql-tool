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
        :label="(tab.isDirty ? '* ' : '') + tab.title"
        :name="tab.id"
      >
        <template #label>
          <el-tooltip
            :content="getTabTooltip(tab)"
            placement="bottom"
            :show-after="300"
          >
            <span>{{ (tab.isDirty ? '* ' : '') + tab.title }}</span>
          </el-tooltip>
        </template>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 连接信息栏 -->
    <div class="connection-info">
      <div class="info-item">
        <span class="label">{{ $t('editor.server') }}:</span>
        <el-select 
          v-model="selectedConnectionId" 
          class="info-select"
          filterable
          clearable
          :placeholder="$t('editor.selectConnection')"
          popper-class="info-select-dropdown"
          :filter-method="filterConnections"
          @visible-change="handleConnectionDropdownVisibleChange"
        >
          <el-option 
            v-for="conn in filteredConnections" 
            :key="conn.id" 
            :value="conn.id"
            :label="conn.name"
          />
        </el-select>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.database') }}:</span>
        <el-select 
          v-model="selectedDatabase" 
          class="info-select"
          filterable
          clearable
          :placeholder="$t('editor.selectDatabase')"
          popper-class="info-select-dropdown"
          :filter-method="filterDatabases"
          @visible-change="handleDatabaseDropdownVisibleChange"
        >
          <el-option 
            v-for="db in filteredDatabases" 
            :key="db" 
            :value="db"
            :label="db"
          />
        </el-select>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.user') }}:</span>
        <span class="value">{{ currentUser }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.maxRows') }}:</span>
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
import { useI18n } from 'vue-i18n'
import * as monaco from 'monaco-editor'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs'
import { useEditorStore } from '../stores/editor'
import { useConnectionStore } from '../stores/connection'
import { useResultStore } from '../stores/result'
import { eventBus, type EventBusEvents } from '../utils/eventBus'
import { registerSqlDarkTheme, getDefaultTheme } from '../config/monaco-theme'
import { useLanguageServer } from '../composables/useLanguageServer'
import { useEditorModel } from '../composables/useEditorModel'
import { DEFAULT_MAX_ROWS } from '../constants/layout'

const { t } = useI18n()
const editorStore = useEditorStore()
const connectionStore = useConnectionStore()
const resultStore = useResultStore()

// 使用 Composables
const languageServer = useLanguageServer()
const editorModelManager = useEditorModel()

// 注入保存确认对话框
const saveConfirmDialog = inject<{ show: (tabId: string, title: string, filePath?: string) => Promise<'save' | 'dontSave' | 'cancel'> }>('saveConfirmDialog')
// 注入数据操作（用于关闭 Tab 时清理状态）
const dataOperations = inject<{ hasUnsavedChanges: () => boolean; clearChanges: () => void; cleanupTab: (tabId: string) => void }>('dataOperations')

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let sortableInstance: Sortable | null = null

// 获取选中的文本（如果有选中则返回选中内容，否则返回全部）
function getSelectedText(): string {
  if (!editor) return editorStore.currentSql
  
  const selection = editor.getSelection()
  if (selection && !selection.isEmpty()) {
    const selectedText = editor.getModel()?.getValueInRange(selection)
    if (selectedText && selectedText.trim()) {
      return selectedText.trim()
    }
  }
  return editorStore.currentSql
}

// 暴露方法给父组件
defineExpose({
  getSelectedText
})

const tabs = computed(() => editorStore.tabs)
const activeTabId = computed({
  get: () => editorStore.activeTabId || '',
  set: (val) => editorStore.switchTab(val)
})

// 连接信息
const connections = computed(() => connectionStore.connections)
const selectedConnectionId = ref('')
const selectedDatabase = ref('')
const maxRowsInput = ref(String(DEFAULT_MAX_ROWS))

// 过滤相关
const connectionFilterText = ref('')
const databaseFilterText = ref('')

// 过滤后的连接列表
const filteredConnections = computed(() => {
  if (!connectionFilterText.value) {
    return connections.value
  }
  const keyword = connectionFilterText.value.toLowerCase()
  return connections.value.filter(conn => 
    conn.name.toLowerCase().includes(keyword)
  )
})

// 过滤后的数据库列表
const filteredDatabases = computed(() => {
  if (!selectedConnectionId.value) return []
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  if (!conn || conn.status !== 'connected') return []
  const allDatabases = connectionStore.getDatabaseNames(selectedConnectionId.value)
  
  if (!databaseFilterText.value) {
    return allDatabases
  }
  const keyword = databaseFilterText.value.toLowerCase()
  return allDatabases.filter(db => 
    db.toLowerCase().includes(keyword)
  )
})

// 连接过滤方法
const filterConnections = (query: string) => {
  connectionFilterText.value = query
}

// 数据库过滤方法
const filterDatabases = (query: string) => {
  databaseFilterText.value = query
}

// 连接下拉框显示/隐藏时重置过滤
const handleConnectionDropdownVisibleChange = (visible: boolean) => {
  if (!visible) {
    connectionFilterText.value = ''
  }
}

// 数据库下拉框显示/隐藏时重置过滤
const handleDatabaseDropdownVisibleChange = (visible: boolean) => {
  if (!visible) {
    databaseFilterText.value = ''
  }
}

// 标志：是否正在恢复标签页设置（防止 watch 触发时覆盖数据）
let isRestoringTabSettings = false

// 当前用户
const currentUser = computed(() => {
  if (!selectedConnectionId.value) return '-'
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  return conn?.username || '-'
})

// 语法验证回调
function scheduleValidation() {
  languageServer.scheduleValidation(() => {
    languageServer.validateDocument(editor?.getModel() ?? null)
  })
}

// 切换 Model 封装
function switchToTabModel(tabId: string, content: string) {
  editorModelManager.switchToTabModel(editor, tabId, content, scheduleValidation)
}

// 监听标签页切换，恢复该标签页的连接设置
watch(() => editorStore.activeTab, (tab, oldTab) => {
  if (tab) {
    // 切换结果面板到对应的编辑器标签页
    resultStore.switchToEditorTab(tab.id)
    
    // 设置标志，防止 watch 触发时覆盖 databaseName
    isRestoringTabSettings = true
    selectedConnectionId.value = tab.connectionId || ''
    selectedDatabase.value = tab.databaseName || ''
    maxRowsInput.value = String(tab.maxRows || DEFAULT_MAX_ROWS)
    
    // 同步重置标志（不需要等待 nextTick）
    isRestoringTabSettings = false
    
    // 切换 Monaco Model（高性能方案）
    if (editor) {
      switchToTabModel(tab.id, tab.content)
    }
    
    // 仅在连接或数据库变化时更新 Language Server
    const connectionChanged = tab.connectionId !== oldTab?.connectionId
    const databaseChanged = tab.databaseName !== oldTab?.databaseName
    
    if (connectionChanged || databaseChanged) {
      // 延迟更新，避免阻塞切换
      queueMicrotask(() => {
        languageServer.checkAndUpdateContext(selectedConnectionId.value, selectedDatabase.value)
        if (databaseChanged) {
          languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value)
        }
      })
    }
  }
}, { immediate: true })

// 监听内容更新触发器（用于复用空标签页时刷新编辑器）
watch(() => editorStore.contentUpdateTrigger, () => {
  const tab = editorStore.activeTab
  if (tab && editor) {
    // 使用 Model 切换方式
    switchToTabModel(tab.id, tab.content)
  }
})

// 监听当前标签页的连接设置变化（用于响应外部切换，如双击数据库树）
watch(() => editorStore.activeTab?.connectionId, (newConnectionId) => {
  // 恢复标签页设置时跳过
  if (isRestoringTabSettings) return
  if (newConnectionId !== undefined && newConnectionId !== selectedConnectionId.value) {
    selectedConnectionId.value = newConnectionId || ''
  }
})

watch(() => editorStore.activeTab?.databaseName, (newDatabaseName) => {
  // 恢复标签页设置时跳过
  if (isRestoringTabSettings) return
  if (newDatabaseName !== undefined && newDatabaseName !== selectedDatabase.value) {
    selectedDatabase.value = newDatabaseName || ''
  }
})

// 监听连接选择变化
watch(selectedConnectionId, async (newId, oldId) => {
  if (newId) {
    const conn = connections.value.find(c => c.id === newId)
    if (conn && conn.status !== 'connected') {
      const result = await connectionStore.connect(newId)
      if (!result.success) {
        ElMessage.error(t('error.connectionFailed', { message: result.message || t('error.unknown') }))
        return
      }
    }
    connectionStore.setCurrentConnection(newId)
  }
  
  // 恢复标签页设置时不更新（避免覆盖 databaseName）
  if (!isRestoringTabSettings) {
    // 连接切换时，主动销毁旧 session 释放连接资源
    const tabId = editorStore.activeTabId
    if (tabId && oldId && oldId !== newId) {
      window.api.session.destroy(tabId, oldId).catch(() => {})
    }
    editorStore.updateTabConnection(newId || undefined, selectedDatabase.value || undefined)
  }
  
  // 使用 Composable 更新上下文
  await languageServer.checkAndUpdateContext(newId, selectedDatabase.value)
})

// 监听数据库选择变化
watch(selectedDatabase, async (newDb, oldDb) => {
  if (!isRestoringTabSettings) {
    // 切换数据库时，销毁旧 session 释放连接，下次执行时会自动重建
    const tabId = editorStore.activeTabId
    const connId = selectedConnectionId.value
    if (tabId && connId && oldDb && oldDb !== newDb) {
      window.api.session.destroy(tabId, connId).catch(() => {})
    }
    editorStore.updateTabConnection(connId || undefined, newDb || undefined)
  }
  
  // 使用 Composable 更新元数据
  await languageServer.checkAndUpdateMetadata(selectedConnectionId.value, newDb)
})

function handleMaxRowsInput(e: Event) {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9]/g, '')
  maxRowsInput.value = target.value
}

function handleMaxRowsChange() {
  const maxRows = parseInt(maxRowsInput.value) || DEFAULT_MAX_ROWS
  editorStore.updateTabMaxRows(maxRows)
}

// 初始化编辑器
function initEditor() {
  if (!editorContainer.value) return
  
  // 注册自定义主题
  registerSqlDarkTheme()
  
  // 获取当前标签页的 Model
  const currentTab = editorStore.activeTab
  const initialModel = currentTab 
    ? editorModelManager.getOrCreateModel(currentTab.id, currentTab.content, scheduleValidation)
    : null
  
  editor = monaco.editor.create(editorContainer.value, {
    model: initialModel,  // 直接使用 Model
    language: 'sql',
    theme: getDefaultTheme(),
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
  
  // 注册 Language Server 提供者
  languageServer.registerProviders()
  
  // 注册格式化快捷键
  editor.addAction({
    id: 'sql.format',
    label: '格式化 SQL',
    keybindings: [
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF
    ],
    run: () => languageServer.formatDocument(editor)
  })
  
  // 注册执行 SQL 右键菜单
  editor.addAction({
    id: 'sql.execute',
    label: t('common.execute'),
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 0,
    run: () => {
      eventBus.emit('execute-sql')
    }
  })
  
  // 监听 hover widget 的显示/隐藏（用于清除状态栏提示）
  // @ts-ignore - Monaco 内部 API，可能不在类型定义中
  editor.onDidChangeHoverVisibility?.((e: { visible: boolean }) => {
    if (!e.visible) {
      languageServer.clearHoverState()
    }
  })
}

// 获取标签页 Tooltip 内容
function getTabTooltip(tab: typeof editorStore.tabs[0]): string {
  if (!tab.filePath) {
    // 从未保存的文件
    return t('editor.unsaved')
  }
  if (tab.isDirty) {
    // 已保存但被修改
    return `${tab.filePath} (${t('editor.modified')})`
  }
  // 已保存且未修改
  return tab.filePath
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
  
  // 清理该标签页的结果数据
  resultStore.cleanupEditorTab(id)
  // 清理该标签页的数据操作状态
  dataOperations?.cleanupTab(id)
  // 清理该标签页的 Monaco Model
  editorModelManager.disposeTabModel(id)
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
      // 更新最近文件菜单
      const recentFiles = await window.api.file.getRecentFiles()
      await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
    }
  }
}

/**
 * 处理 hover widget 点击事件
 * 只有点击表名（code 标签）时才打开表管理对话框
 */
function handleHoverClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  
  // 检查点击的是否在 hover widget 内
  const hoverWidget = target.closest('.monaco-hover')
  if (!hoverWidget) {
    // 点击非 hover 区域，清除 hover 状态
    languageServer.clearHoverState()
    return
  }
  
  // 检查是否有当前 hover 的表信息
  if (!languageServer.currentHoverTableInfo.value) return
  
  // 检查点击的是否是 code 标签（表名被反引号包裹，会渲染为 code）
  // 或者点击的元素的父元素是 code
  const codeElement = target.tagName === 'CODE' ? target : target.closest('code')
  if (!codeElement) return
  
  // 获取 hover 内容的第一个段落（表名所在行）
  const hoverContent = hoverWidget.querySelector('.monaco-hover-content')
  if (!hoverContent) return
  
  // 检查这个 code 是否在第一个段落中（表名行）
  const firstParagraph = hoverContent.querySelector('p')
  if (firstParagraph && firstParagraph.contains(codeElement)) {
    // 验证 code 内容是否与当前 hover 的表名一致
    const tableName = languageServer.currentHoverTableInfo.value.name
    if (codeElement.textContent === tableName) {
      e.preventDefault()
      e.stopPropagation()
      languageServer.openTableManageFromHover()
    }
  }
}

/**
 * 监听鼠标移动，检测 hover widget 是否关闭
 */
function handleMouseMove(e: MouseEvent) {
  // 如果没有 hover 状态，不需要检测
  if (!languageServer.currentHoverTableInfo.value) return
  
  const target = e.target as HTMLElement
  // 检查鼠标是否在 hover widget 或编辑器内
  const hoverWidget = document.querySelector('.monaco-hover')
  const editorElement = editorContainer.value
  
  if (hoverWidget && hoverWidget.contains(target)) {
    // 鼠标在 hover widget 内，保持状态
    return
  }
  
  if (editorElement && editorElement.contains(target)) {
    // 鼠标在编辑器内但不在 hover widget 内
    // 检查 hover widget 是否还存在（可能已关闭）
    if (!hoverWidget || !document.body.contains(hoverWidget)) {
      languageServer.clearHoverState()
    }
    return
  }
  
  // 鼠标离开了编辑器区域，清除状态
  languageServer.clearHoverState()
}

/**
 * 处理连接树刷新事件
 */
function handleConnectionTreeRefresh(payload: EventBusEvents['connectionTree:refresh']) {
  // 检查是否是当前编辑器使用的连接和数据库
  if (
    payload.connectionId === selectedConnectionId.value &&
    (!payload.databaseName || payload.databaseName === selectedDatabase.value)
  ) {
    // 强制刷新 Language Server 元数据
    languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value, true)
  }
}

// 初始化标签页拖拽排序
function initTabSortable() {
  // 等待 DOM 更新
  setTimeout(() => {
    const tabNav = document.querySelector('.sql-editor .el-tabs__nav') as HTMLElement
    if (!tabNav) return

    sortableInstance = new Sortable(tabNav, {
      animation: 150,
      draggable: '.el-tabs__item',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      delay: 0,
      onEnd: (evt) => {

        // 如果位置没有变化，不做任何操作
        if (evt.oldIndex === evt.newIndex) return

        // 获取新的标签页顺序
        const newOrder: string[] = []
        const tabItems = tabNav.querySelectorAll('.el-tabs__item')
        tabItems.forEach((item) => {
          // 从 data-name 属性获取 tab id
          const tabId = item.getAttribute('data-name')
          if (tabId) {
            newOrder.push(tabId)
          }
        })

        // 更新 store 中的标签页顺序
        if (newOrder.length > 0) {
          editorStore.reorderTabs(newOrder)
        }
      }
    })
  }, 100)
}

onMounted(async () => {
  editorStore.init()
  initEditor()
  // 添加键盘快捷键监听
  window.addEventListener('keydown', handleSaveShortcut)

  // 添加 hover widget 点击监听
  document.addEventListener('click', handleHoverClick)

  // 添加鼠标移动监听，用于检测 hover widget 关闭
  document.addEventListener('mousemove', handleMouseMove)

  // 监听连接树刷新事件
  eventBus.on('connectionTree:refresh', handleConnectionTreeRefresh)

  // 初始化 Language Server 元数据
  await languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value)

  // 初始化标签页拖拽排序
  initTabSortable()
})

onUnmounted(() => {
  // 清理 Language Server 资源
  languageServer.dispose()

  // 清理所有 Model
  editorModelManager.disposeAllModels()

  editor?.dispose()
  // 移除键盘快捷键监听
  window.removeEventListener('keydown', handleSaveShortcut)

  // 移除 hover widget 点击监听
  document.removeEventListener('click', handleHoverClick)

  // 移除鼠标移动监听
  document.removeEventListener('mousemove', handleMouseMove)

  // 移除事件总线监听
  eventBus.off('connectionTree:refresh', handleConnectionTreeRefresh)

  // 销毁 Sortable 实例
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})
</script>

<style scoped>
.sql-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-base);
}

.sql-editor :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 8px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.sql-editor :deep(.el-tabs__nav-wrap) {
  background: var(--bg-surface);
}

.sql-editor :deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  color: var(--text-primary);
  border-color: var(--border-color) !important;
  background: var(--bg-surface);
}

.sql-editor :deep(.el-tabs__item:hover) {
  color: var(--text-bright);
}

.sql-editor :deep(.el-tabs__item.is-active) {
  color: var(--text-bright);
  background: var(--bg-base);
  border-bottom-color: var(--color-primary) !important;
}

.sql-editor :deep(.el-tabs__nav) {
  border-color: var(--border-color);
}

/* 连接信息栏 */
.connection-info {
  background: var(--bg-surface);
  padding: 8px 12px;
  display: flex;
  gap: 20px;
  font-size: 12px;
  border-bottom: 1px solid var(--border-color);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item .label {
  color: var(--text-placeholder);
}

.info-item .value {
  color: #4ec9b0;
  font-weight: 500;
}

.info-select {
  width: 180px;
}

.info-select :deep(.el-select__wrapper) {
  background-color: var(--bg-elevated);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.info-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.info-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.info-select :deep(.el-select__selected-item) {
  color: #4ec9b0 !important;
}

.info-select :deep(.el-select__placeholder span) {
  color: #4ec9b0 !important;
}

.info-select :deep(.el-input__wrapper) {
  background-color: var(--bg-elevated);
  box-shadow: 0 0 0 1px var(--border-color) inset;
  border-radius: 4px;
  padding: 0 8px;
  height: 28px;
}

.info-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.info-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.info-select :deep(.el-input__inner) {
  color: #4ec9b0;
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  line-height: 28px;
}

.info-select :deep(.el-input__inner::placeholder) {
  color: var(--text-placeholder);
}

.info-select :deep(.el-select__caret) {
  color: var(--text-placeholder);
}

.info-select :deep(.el-select__suffix) {
  color: var(--text-placeholder);
}

.max-rows-input {
  width: 70px;
  background: var(--bg-elevated);
  color: #4ec9b0;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  text-align: center;
}

.max-rows-input:hover {
  border-color: var(--color-primary);
}

.max-rows-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.editor-container {
  flex: 1;
  min-height: 0;
}

/* 拖拽排序样式 - 保持默认鼠标样式 */
.sql-editor :deep(.el-tabs__item) {
  user-select: none;
}

/* Sortable 拖拽时的占位符样式 */
.sql-editor :deep(.sortable-ghost) {
  opacity: 0.4;
  background: #094771 !important;
  border: 1px dashed var(--color-primary) !important;
}

/* Sortable 拖拽中的元素样式 */
.sql-editor :deep(.sortable-drag) {
  opacity: 0.8;
  background: var(--bg-base) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
</style>

<!-- 全局样式：下拉框样式 -->
<style>
.info-select-dropdown .el-select-dropdown__item {
  background-color: transparent !important;
}

.info-select-dropdown .el-select-dropdown__item:hover {
  background-color: var(--bg-elevated) !important;
}

.info-select-dropdown .el-select-dropdown__item.is-hovering {
  background-color: var(--bg-elevated) !important;
}

/* Monaco hover widget 样式优化 */
.monaco-editor .monaco-hover {
  max-width: 600px !important;
}

.monaco-editor .monaco-hover-content {
  max-height: 300px !important;
  overflow-y: auto !important;
}

/* hover widget 滚动条样式 */
.monaco-editor .monaco-hover-content::-webkit-scrollbar {
  width: 8px;
}

.monaco-editor .monaco-hover-content::-webkit-scrollbar-track {
  background: var(--bg-base);
}

.monaco-editor .monaco-hover-content::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

.monaco-editor .monaco-hover-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

/* hover widget 中表名 code 标签样式 - 可点击效果 */
/* 只选择第一个 p 标签中紧跟 strong 后的 code（即 **表**: `表名` 中的表名） */
/* 排除 li 中的 code（字段列表中的列名） */
.monaco-editor .monaco-hover-content p:first-of-type > strong + code {
  color: #4fc3f7 !important;
  cursor: pointer !important;
  border-bottom: 1px dashed #4fc3f7;
  transition: all 0.2s ease;
  padding: 1px 4px;
  border-radius: 3px;
}

.monaco-editor .monaco-hover-content p:first-of-type > strong + code:hover {
  color: #81d4fa !important;
  border-bottom-style: solid;
  background-color: rgba(79, 195, 247, 0.2) !important;
}
</style>
