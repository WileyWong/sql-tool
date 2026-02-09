<template>
  <div class="toolbar">
    <!-- 文件操作 -->
    <button class="toolbar-btn secondary" @click="handleNewConnection">
      📁 {{ $t('toolbar.newConnection') }}
    </button>
    <button class="toolbar-btn secondary" @click="handleNew">
      📄 {{ $t('toolbar.newQuery') }}
    </button>
    <button class="toolbar-btn secondary" @click="handleOpen">
      📂 {{ $t('toolbar.openFile') }}
    </button>
    <button class="toolbar-btn secondary" @click="handleSave">
      💾 {{ $t('toolbar.save') }}
    </button>
    
    <div class="toolbar-divider"></div>
    
    <!-- 执行操作 -->
    <button 
      class="toolbar-btn run" 
      :disabled="!canExecute || isRunning"
      @click="handleExecute"
    >
      ▶ {{ $t('toolbar.execute') }}
    </button>
    <button 
      class="toolbar-btn secondary" 
      :disabled="!isRunning"
      @click="handleStop"
    >
      ⏹ {{ $t('toolbar.stop') }}
    </button>
    <button 
      class="toolbar-btn secondary" 
      :disabled="!canExecute || isRunning"
      @click="handleExplain"
    >
      📊 {{ $t('toolbar.explain') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { useResultStore } from '../stores/result'
import { eventBus } from '../utils/eventBus'

const { t } = useI18n()
const connectionStore = useConnectionStore()
const editorStore = useEditorStore()
const resultStore = useResultStore()

// 注入结果覆盖确认对话框
const resultOverwriteDialog = inject<{ show: () => Promise<'submit' | 'discard' | 'cancel'> }>('resultOverwriteDialog')

// 注入 SQL 编辑器（获取选中文本）
const sqlEditor = inject<{ getSelectedText: () => string }>('sqlEditor')

// 注入数据操作状态（统一跟踪机制）
const dataOperations = inject<{ hasUnsavedChanges: () => boolean; clearChanges: () => void }>('dataOperations')

// 获取当前标签页的连接（每个标签页独立的连接）
const currentTabConnection = computed(() => {
  const tab = editorStore.activeTab
  if (!tab?.connectionId) return null
  const conn = connectionStore.connections.find(c => c.id === tab.connectionId)
  return conn && conn.status === 'connected' ? conn : null
})

const canExecute = computed(() => !!currentTabConnection.value)
const isRunning = computed(() => resultStore.executionStatus === 'running')

// 新建连接
function handleNewConnection() {
  connectionStore.openNewConnectionDialog()
}

// 新建
function handleNew() {
  editorStore.createTab()
}

// 打开
async function handleOpen() {
  await editorStore.openFile()
}

// 保存
async function handleSave() {
  const result = await editorStore.saveFile()
  if (result.success) {
    ElMessage.success(t('message.saveSuccess'))
    // 更新最近文件菜单
    const recentFiles = await window.api.file.getRecentFiles()
    await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
  } else if (!(result as { canceled?: boolean }).canceled) {
    ElMessage.error(result.message || t('error.saveFailed', { message: '' }))
  }
}

// 执行
async function handleExecute() {
  if (!currentTabConnection.value) {
    ElMessage.warning(t('error.noDatabase'))
    return
  }
  
  // 获取选中的 SQL（如果有选中则执行选中部分，否则执行全部）
  const sql = sqlEditor?.getSelectedText() || editorStore.currentSql
  if (!sql.trim()) {
    ElMessage.warning(t('error.noSql'))
    return
  }
  
  // 检查是否有未保存的修改
  if (dataOperations?.hasUnsavedChanges()) {
    if (!resultOverwriteDialog) {
      // 降级到 confirm
      const confirmed = window.confirm(t('result.confirmDiscard'))
      if (!confirmed) {
        return
      }
    } else {
      const result = await resultOverwriteDialog.show()
      if (result === 'cancel') {
        return
      }
      if (result === 'submit') {
        // 用户选择提交，提示用户先手动提交修改
        ElMessage.warning(t('result.unsavedChanges'))
        return
      }
      // result === 'discard' 时清除修改标记并继续执行
      dataOperations?.clearChanges()
    }
  }
  
  resultStore.setExecutionStatus('running')
  resultStore.setCurrentExecutingSql(sql)
  resultStore.clearResults()
  
  try {
    const maxRows = editorStore.activeTab?.maxRows || 5000
    const database = editorStore.activeTab?.databaseName
    const tabId = editorStore.activeTab?.id
    const result = await window.api.query.execute(currentTabConnection.value.id, tabId!, sql, maxRows, database)
    if (result.success && result.results) {
      resultStore.handleQueryResults(result.results)
      resultStore.setExecutionStatus('success')
    } else {
      resultStore.setExecutionStatus('error')
    }
  } catch (error) {
    resultStore.addMessage('error', String(error))
    resultStore.setExecutionStatus('error')
  }
}

// 停止
async function handleStop() {
  if (!currentTabConnection.value) return
  
  const tabId = editorStore.activeTab?.id
  if (!tabId) return
  
  const result = await window.api.query.cancel(currentTabConnection.value.id, tabId)
  if (result.success) {
    resultStore.addMessage('warning', t('message.queryCancelled'))
    resultStore.setExecutionStatus('cancelled')
  }
}

// 执行计划
async function handleExplain() {
  if (!currentTabConnection.value) {
    ElMessage.warning(t('error.noDatabase'))
    return
  }
  
  // 获取选中的 SQL（如果有选中则执行选中部分，否则执行全部）
  const sql = sqlEditor?.getSelectedText() || editorStore.currentSql
  if (!sql.trim()) {
    ElMessage.warning(t('error.noSql'))
    return
  }
  
  resultStore.setExecutionStatus('running')
  
  try {
    const database = editorStore.activeTab?.databaseName
    const tabId = editorStore.activeTab?.id
    const result = await window.api.query.explain(currentTabConnection.value.id, tabId!, sql, database)
    if (result.success && result.explain) {
      resultStore.handleExplainResult(result.explain)
      resultStore.setExecutionStatus('success')
    } else {
      resultStore.addMessage('error', String(result.error))
      resultStore.setExecutionStatus('error')
    }
  } catch (error) {
    resultStore.addMessage('error', String(error))
    resultStore.setExecutionStatus('error')
  }
}

// 监听右键菜单执行事件
onMounted(() => {
  eventBus.on('execute-sql', handleExecute)
})

onUnmounted(() => {
  eventBus.off('execute-sql', handleExecute)
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.toolbar-btn {
  padding: 6px 14px;
  background: #0e639c;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn:hover:not(:disabled) {
  background: #1177bb;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.secondary {
  background: #3c3c3c;
  border: 1px solid #555;
}

.toolbar-btn.secondary:hover:not(:disabled) {
  background: #505050;
}

.toolbar-btn.run {
  background: #388a34;
}

.toolbar-btn.run:hover:not(:disabled) {
  background: #45a341;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #555;
  margin: 0 4px;
}
</style>
