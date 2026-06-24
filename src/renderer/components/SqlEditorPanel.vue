<template>
  <div class="sql-panel">
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
        <el-tooltip
          v-if="selectedConnectionId"
          :content="connectionStatusTooltip"
          placement="bottom"
          :show-after="300"
        >
          <span 
            class="connection-status-icon"
            :class="connectionStatusClass"
            @click.stop="handleConnectionStatusClick"
          >
            <el-icon :class="connectionStatusIconClass">
              <component :is="connectionStatusIcon" />
            </el-icon>
          </span>
        </el-tooltip>
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

    <!-- 视图创建语句弹窗 -->
    <ViewCreateSqlDialog
      v-model="viewCreateDialogVisible"
      :connection-id="viewCreateInfo.connectionId"
      :database="viewCreateInfo.database"
      :view-name="viewCreateInfo.viewName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as monaco from 'monaco-editor'
import { ElMessage } from 'element-plus'
import { Connection, Loading } from '@element-plus/icons-vue'
import { useEditorStore } from '../stores/editor'
import { useConnectionStore } from '../stores/connection'
import { useResultStore } from '../stores/result'
import { eventBus, type EventBusEvents } from '../utils/eventBus'
import { registerSqlDarkTheme, getDefaultTheme } from '../config/monaco-theme'
import { useLanguageServer } from '../composables/useLanguageServer'
import { useEditorModel } from '../composables/useEditorModel'
import ViewCreateSqlDialog from './ViewCreateSqlDialog.vue'
import { DEFAULT_MAX_ROWS } from '../constants/layout'

const { t } = useI18n()
const editorStore = useEditorStore()
const connectionStore = useConnectionStore()
const resultStore = useResultStore()

const languageServer = useLanguageServer()
const editorModelManager = useEditorModel()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

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

defineExpose({ getSelectedText })

const connections = computed(() => connectionStore.connections)
const selectedConnectionId = ref('')
const selectedDatabase = ref('')
const maxRowsInput = ref(String(DEFAULT_MAX_ROWS))

const isRefreshingStatus = ref(false)
const metadataRefreshedKey = ref('')

const viewCreateDialogVisible = ref(false)
const viewCreateInfo = ref({ connectionId: '', database: '', viewName: '' })

const hasMetadataRefreshed = computed(() => {
  if (!selectedConnectionId.value || !selectedDatabase.value) return false
  return metadataRefreshedKey.value === `${selectedConnectionId.value}|${selectedDatabase.value}`
})

const connectionStatus = computed(() => {
  if (!selectedConnectionId.value) return 'disconnected'
  const conn = connectionStore.connections.find(c => c.id === selectedConnectionId.value)
  return conn?.status || 'disconnected'
})

const connectionStatusIcon = computed(() => {
  if (isRefreshingStatus.value) return Loading
  return Connection
})

const connectionStatusIconClass = computed(() => {
  if (isRefreshingStatus.value) return ''
  const s = connectionStatus.value
  if (s === 'connected') return hasMetadataRefreshed.value ? 'status-connected-metadata' : 'status-connected-nometa'
  if (s === 'connecting') return 'status-connecting'
  if (s === 'error') return 'status-error'
  return 'status-disconnected'
})

const connectionStatusClass = computed(() => {
  return isRefreshingStatus.value ? 'refreshing' : ''
})

const connectionStatusTooltip = computed(() => {
  if (isRefreshingStatus.value) return t('editor.connectingStatus')
  const s = connectionStatus.value
  if (s === 'connected') return hasMetadataRefreshed.value ? t('editor.metadataReady') : t('editor.needRefreshMetadata')
  if (s === 'connecting') return t('editor.connectingStatus')
  if (s === 'error') return t('editor.clickToReconnect')
  return t('editor.clickToConnect')
})

function markMetadataRefreshed(connId?: string, dbName?: string) {
  const cid = connId || selectedConnectionId.value
  const db = dbName || selectedDatabase.value
  if (cid && db) metadataRefreshedKey.value = `${cid}|${db}`
}

async function handleConnectionStatusClick() {
  if (isRefreshingStatus.value || !selectedConnectionId.value) return
  isRefreshingStatus.value = true
  try {
    const connId = selectedConnectionId.value
    const conn = connectionStore.connections.find(c => c.id === connId)
    if (!conn || conn.status !== 'connected') {
      const result = await connectionStore.connect(connId)
      if (!result.success) {
        ElMessage.error(t('error.connectionFailed', { message: result.message || t('error.unknown') }))
        return
      }
      await languageServer.checkAndUpdateContext(connId, selectedDatabase.value)
    }
    await languageServer.checkAndUpdateMetadata(connId, selectedDatabase.value, true)
    markMetadataRefreshed(connId, selectedDatabase.value)
    ElMessage.success(t('editor.metadataRefreshed'))
  } catch (err: any) {
    ElMessage.error(err?.message || t('error.unknown'))
  } finally {
    isRefreshingStatus.value = false
  }
}

const connectionFilterText = ref('')
const databaseFilterText = ref('')
const filteredConnections = computed(() => {
  if (!connectionFilterText.value) return connections.value
  const kw = connectionFilterText.value.toLowerCase()
  return connections.value.filter(c => c.name.toLowerCase().includes(kw))
})
const filteredDatabases = computed(() => {
  if (!selectedConnectionId.value) return []
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  if (!conn || conn.status !== 'connected') return []
  const all = connectionStore.getDatabaseNames(selectedConnectionId.value)
  if (!databaseFilterText.value) return all
  const kw = databaseFilterText.value.toLowerCase()
  return all.filter(db => db.toLowerCase().includes(kw))
})
const filterConnections = (q: string) => { connectionFilterText.value = q }
const filterDatabases = (q: string) => { databaseFilterText.value = q }
const handleConnectionDropdownVisibleChange = (v: boolean) => { if (!v) connectionFilterText.value = '' }
const handleDatabaseDropdownVisibleChange = (v: boolean) => { if (!v) databaseFilterText.value = '' }

let isRestoringTabSettings = false
const currentUser = computed(() => {
  if (!selectedConnectionId.value) return '-'
  return connections.value.find(c => c.id === selectedConnectionId.value)?.username || '-'
})

function scheduleValidation() {
  languageServer.scheduleValidation(() => {
    languageServer.validateDocument(editor?.getModel() ?? null)
  })
}

function switchToTabModel(tabId: string, content: string) {
  editorModelManager.switchToTabModel(editor, tabId, content, scheduleValidation)
}

watch(() => editorStore.activeTab, (tab, oldTab) => {
  if (tab) {
    resultStore.switchToEditorTab(tab.id)
    isRestoringTabSettings = true
    selectedConnectionId.value = tab.connectionId || ''
    selectedDatabase.value = tab.databaseName || ''
    maxRowsInput.value = String(tab.maxRows || DEFAULT_MAX_ROWS)
    isRestoringTabSettings = false
    if (editor) switchToTabModel(tab.id, tab.content)
    const connChanged = tab.connectionId !== oldTab?.connectionId
    const dbChanged = tab.databaseName !== oldTab?.databaseName
    if (connChanged || dbChanged) {
      queueMicrotask(() => {
        languageServer.checkAndUpdateContext(selectedConnectionId.value, selectedDatabase.value)
        if (dbChanged) languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value)
      })
    }
  }
}, { immediate: true })

watch(() => editorStore.contentUpdateTrigger, () => {
  const tab = editorStore.activeTab
  if (tab && editor) switchToTabModel(tab.id, tab.content)
})

watch(() => editorStore.activeTab?.connectionId, (n) => { if (!isRestoringTabSettings && n !== undefined && n !== selectedConnectionId.value) selectedConnectionId.value = n || '' })
watch(() => editorStore.activeTab?.databaseName, (n) => { if (!isRestoringTabSettings && n !== undefined && n !== selectedDatabase.value) selectedDatabase.value = n || '' })

watch(selectedConnectionId, async (newId, oldId) => {
  if (newId) {
    const conn = connections.value.find(c => c.id === newId)
    if (conn && conn.status !== 'connected') {
      const r = await connectionStore.connect(newId)
      if (!r.success) { ElMessage.error(t('error.connectionFailed', { message: r.message || t('error.unknown') })); return }
    }
    connectionStore.setCurrentConnection(newId)
  }
  if (!isRestoringTabSettings) {
    const tabId = editorStore.activeTabId
    if (tabId && oldId && oldId !== newId) window.api.session.destroy(tabId, oldId).catch(() => {})
    editorStore.updateTabConnection(newId || undefined, selectedDatabase.value || undefined)
  }
  await languageServer.checkAndUpdateContext(newId, selectedDatabase.value)
  if (oldId && oldId !== newId) metadataRefreshedKey.value = ''
})

watch(selectedDatabase, async (n, o) => {
  if (!isRestoringTabSettings) {
    const tabId = editorStore.activeTabId
    const connId = selectedConnectionId.value
    if (tabId && connId && o && o !== n) window.api.session.destroy(tabId, connId).catch(() => {})
    editorStore.updateTabConnection(connId || undefined, n || undefined)
  }
  await languageServer.checkAndUpdateMetadata(selectedConnectionId.value, n)
  markMetadataRefreshed(selectedConnectionId.value, n || undefined)
})

function handleMaxRowsInput(e: Event) {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9]/g, '')
  maxRowsInput.value = target.value
}
function handleMaxRowsChange() {
  editorStore.updateTabMaxRows(parseInt(maxRowsInput.value) || DEFAULT_MAX_ROWS)
}

function initEditor() {
  if (!editorContainer.value) return
  registerSqlDarkTheme()
  const currentTab = editorStore.activeTab
  const initialModel = currentTab ? editorModelManager.getOrCreateModel(currentTab.id, currentTab.content, scheduleValidation) : null
  editor = monaco.editor.create(editorContainer.value, {
    model: initialModel, language: 'sql', theme: getDefaultTheme(),
    automaticLayout: true, minimap: { enabled: false }, fontSize: 14,
    lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', tabSize: 2,
    suggestOnTriggerCharacters: true, quickSuggestions: true
  })
  languageServer.registerProviders()
  editor.addAction({ id: 'sql.format', label: '格式化 SQL', keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF], run: () => languageServer.formatDocument(editor) })
  editor.addAction({ id: 'sql.execute', label: t('common.execute'), contextMenuGroupId: 'navigation', contextMenuOrder: 0, run: () => eventBus.emit('execute-sql') })
  editor.addAction({ id: 'sql.format-context', label: t('contextMenu.formatSql'), contextMenuGroupId: 'navigation', contextMenuOrder: 1, run: () => languageServer.formatDocument(editor) })
  ;(editor as any).onDidChangeHoverVisibility?.((e: { visible: boolean }) => { if (!e.visible) languageServer.clearHoverState() })
}

function handleHoverClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const hoverWidget = target.closest('.monaco-hover')
  if (!hoverWidget) { languageServer.clearHoverState(); return }
  const codeElement = target.tagName === 'CODE' ? target : target.closest('code')
  if (codeElement && languageServer.currentHoverActions.value) {
    const hoverContent = hoverWidget.querySelector('.monaco-hover-content')
    if (hoverContent) {
      const hr = hoverContent.querySelector('hr')
      if (hr) {
        const isAfterHr = !!(hr.compareDocumentPosition(codeElement) & Node.DOCUMENT_POSITION_FOLLOWING)
        if (isAfterHr) {
          const actionIndex = languageServer.currentHoverActions.value.findIndex(a => a.title === codeElement.textContent)
          if (actionIndex !== -1 && editor) { e.preventDefault(); e.stopPropagation(); languageServer.executeHoverAction(editor, actionIndex); return }
        }
      }
    }
  }
  const hoverContent2 = hoverWidget.querySelector('.monaco-hover-content')
  if (!hoverContent2) return
  const fp = hoverContent2.querySelector('p')
  if (languageServer.currentHoverTableInfo.value && codeElement && fp && fp.contains(codeElement)) {
    const tn = languageServer.currentHoverTableInfo.value.name
    if (codeElement.textContent === tn) { e.preventDefault(); e.stopPropagation(); languageServer.openTableManageFromHover(); return }
  }
  if (languageServer.currentHoverViewInfo.value && codeElement && fp && fp.contains(codeElement)) {
    const vn = languageServer.currentHoverViewInfo.value.name
    if (codeElement.textContent === vn) {
      e.preventDefault(); e.stopPropagation()
      const connId = languageServer.lastConnectionId.value; const db = languageServer.lastDatabaseName.value
      if (connId && db) { viewCreateInfo.value = { connectionId: connId, database: db, viewName: vn }; viewCreateDialogVisible.value = true }
      return
    }
  }
}

function handleMouseMove(e: MouseEvent) {
  if (!languageServer.currentHoverTableInfo.value && !languageServer.currentHoverViewInfo.value && !languageServer.currentHoverActions.value) return
  const target = e.target as HTMLElement
  const hoverWidget = document.querySelector('.monaco-hover')
  if (hoverWidget && hoverWidget.contains(target)) return
  const editorEl = editorContainer.value
  if (editorEl && editorEl.contains(target)) {
    if (!hoverWidget || !document.body.contains(hoverWidget)) languageServer.clearHoverState()
    return
  }
  languageServer.clearHoverState()
}

function handleConnectionTreeRefresh(payload: EventBusEvents['connectionTree:refresh']) {
  if (payload.connectionId === selectedConnectionId.value && (!payload.databaseName || payload.databaseName === selectedDatabase.value)) {
    languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value, true)
    markMetadataRefreshed(selectedConnectionId.value, selectedDatabase.value)
  }
}

onMounted(async () => {
  initEditor()
  document.addEventListener('click', handleHoverClick)
  document.addEventListener('mousemove', handleMouseMove)
  eventBus.on('connectionTree:refresh', handleConnectionTreeRefresh)
  const connId = selectedConnectionId.value; const db = selectedDatabase.value
  if (connId) {
    const conn = connectionStore.connections.find(c => c.id === connId)
    if (!conn || conn.status !== 'connected') {
      const result = await connectionStore.connect(connId)
      if (result.success) { await languageServer.checkAndUpdateContext(connId, db); await languageServer.checkAndUpdateMetadata(connId, db, true); markMetadataRefreshed(connId, db) }
    } else { await languageServer.checkAndUpdateMetadata(connId, db, true); markMetadataRefreshed(connId, db) }
  } else { await languageServer.checkAndUpdateMetadata(selectedConnectionId.value, selectedDatabase.value) }
})

onUnmounted(() => {
  languageServer.dispose()
  editorModelManager.disposeAllModels()
  editor?.dispose()
  document.removeEventListener('click', handleHoverClick)
  document.removeEventListener('mousemove', handleMouseMove)
  eventBus.off('connectionTree:refresh', handleConnectionTreeRefresh)
})
</script>

<style scoped>
.sql-panel { display: flex; flex-direction: column; height: 100%; background: var(--bg-base); }
.editor-container { flex: 1; min-height: 0; }

.connection-info { background: var(--bg-surface); padding: 8px 12px; display: flex; gap: 20px; font-size: 12px; border-bottom: 1px solid var(--border-color); }
.info-item { display: flex; align-items: center; gap: 6px; }
.info-item .label { color: var(--text-placeholder); }
.info-item .value { color: #4ec9b0; font-weight: 500; }

.connection-status-icon { display: inline-flex; align-items: center; cursor: pointer; padding: 2px; border-radius: 3px; transition: background 0.2s; flex-shrink: 0; }
.connection-status-icon:hover { background: var(--bg-hover, rgba(255,255,255,0.05)); }
.connection-status-icon.refreshing { cursor: wait; animation: status-spin 1s linear infinite; }
@keyframes status-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.connection-status-icon .el-icon { font-size: 14px; transition: color 0.3s; }
.connection-status-icon .el-icon.status-connected-nometa { color: #4ec9b0; opacity: 0.55; }
.connection-status-icon .el-icon.status-connected-metadata { color: #4ec9b0; }
.connection-status-icon .el-icon.status-connecting { color: #e6a23c; }
.connection-status-icon .el-icon.status-error { color: #f48771; }
.connection-status-icon .el-icon.status-disconnected { color: #909399; }

.info-select { width: 180px; }
.info-select :deep(.el-select__wrapper) { background-color: var(--bg-elevated); box-shadow: 0 0 0 1px var(--border-color) inset; }
.info-select :deep(.el-select__wrapper:hover) { box-shadow: 0 0 0 1px var(--color-primary) inset; }
.info-select :deep(.el-select__wrapper.is-focused) { box-shadow: 0 0 0 1px var(--color-primary) inset; }
.info-select :deep(.el-select__selected-item) { color: #4ec9b0 !important; }
.info-select :deep(.el-select__placeholder span) { color: #4ec9b0 !important; }

.max-rows-input { width: 70px; background: var(--bg-elevated); color: #4ec9b0; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; font-size: 12px; font-weight: 500; outline: none; text-align: center; }
.max-rows-input:hover { border-color: var(--color-primary); }
.max-rows-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 1px var(--color-primary); }
</style>

<style>
.info-select-dropdown .el-select-dropdown__item { background-color: transparent !important; }
.info-select-dropdown .el-select-dropdown__item:hover { background-color: var(--bg-elevated) !important; }
.info-select-dropdown .el-select-dropdown__item.is-hovering { background-color: var(--bg-elevated) !important; }
.monaco-editor .monaco-hover { max-width: 600px !important; }
.monaco-editor .monaco-hover-content { max-height: 300px !important; overflow-y: auto !important; }
.monaco-editor .monaco-hover-content::-webkit-scrollbar { width: 8px; }
.monaco-editor .monaco-hover-content::-webkit-scrollbar-track { background: var(--bg-base); }
.monaco-editor .monaco-hover-content::-webkit-scrollbar-thumb { background-color: var(--scrollbar-thumb); border-radius: 4px; }
.monaco-editor .monaco-hover-content::-webkit-scrollbar-thumb:hover { background-color: var(--scrollbar-thumb-hover); }
.monaco-editor .monaco-hover-content p:first-of-type > strong + code { color: #4fc3f7 !important; cursor: pointer !important; border-bottom: 1px dashed #4fc3f7; transition: all 0.2s ease; padding: 1px 4px; border-radius: 3px; }
.monaco-editor .monaco-hover-content p:first-of-type > strong + code:hover { color: #81d4fa !important; border-bottom-style: solid; background-color: rgba(79, 195, 247, 0.2) !important; }
.monaco-editor .monaco-hover-content hr ~ p > code { color: #4fc3f7 !important; cursor: pointer !important; border-bottom: 1px dashed #4fc3f7; transition: all 0.15s ease; padding: 1px 4px; border-radius: 3px; }
.monaco-editor .monaco-hover-content hr ~ p > code:hover { color: #81d4fa !important; border-bottom-color: #81d4fa; background-color: rgba(79, 195, 247, 0.1) !important; }
</style>
