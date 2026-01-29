<template>
  <div class="toolbar">
    <!-- 文件操作 -->
    <button class="toolbar-btn secondary" @click="handleNewConnection">
      📁 新建连接
    </button>
    <button class="toolbar-btn secondary" @click="handleNew">
      📄 新建查询
    </button>
    <button class="toolbar-btn secondary" @click="handleOpen">
      📂 打开文件
    </button>
    <button class="toolbar-btn secondary" @click="handleSave">
      💾 保存
    </button>
    
    <div class="toolbar-divider"></div>
    
    <!-- 执行操作 -->
    <button 
      class="toolbar-btn run" 
      :disabled="!canExecute || isRunning"
      @click="handleExecute"
    >
      ▶ 执行
    </button>
    <button 
      class="toolbar-btn secondary" 
      :disabled="!isRunning"
      @click="handleStop"
    >
      ⏹ 停止
    </button>
    <button 
      class="toolbar-btn secondary" 
      :disabled="!canExecute || isRunning"
      @click="handleExplain"
    >
      📊 执行计划
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { useResultStore } from '../stores/result'

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
    ElMessage.success('保存成功')
    // 更新最近文件菜单
    const recentFiles = await window.api.file.getRecentFiles()
    await window.api.menu.updateRecentFiles(recentFiles.slice(0, 10))
  } else if (!(result as { canceled?: boolean }).canceled) {
    ElMessage.error(result.message || '保存失败')
  }
}

// 执行
async function handleExecute() {
  if (!currentTabConnection.value) {
    ElMessage.warning('请先连接数据库')
    return
  }
  
  // 获取选中的 SQL（如果有选中则执行选中部分，否则执行全部）
  const sql = sqlEditor?.getSelectedText() || editorStore.currentSql
  if (!sql.trim()) {
    ElMessage.warning('请输入 SQL 语句')
    return
  }
  
  // 检查是否有未保存的修改
  if (dataOperations?.hasUnsavedChanges()) {
    if (!resultOverwriteDialog) {
      // 降级到 confirm
      const confirmed = window.confirm('当前查询结果有未保存的修改，是否继续执行新的查询？\n\n点击"确定"放弃修改并执行，点击"取消"取消执行。')
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
        ElMessage.warning('请先点击提交按钮保存修改，然后再执行新的查询')
        return
      }
      // result === 'discard' 时清除修改标记并继续执行
      dataOperations?.clearChanges()
    }
  }
  
  resultStore.setExecutionStatus('running')
  resultStore.clearResults()
  resultStore.addMessage('info', '开始执行查询...')
  
  try {
    const maxRows = editorStore.activeTab?.maxRows || 5000
    const database = editorStore.activeTab?.databaseName
    const result = await window.api.query.execute(currentTabConnection.value.id, sql, maxRows, database)
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
  
  const result = await window.api.query.cancel(currentTabConnection.value.id)
  if (result.success) {
    resultStore.addMessage('warning', '查询已取消')
    resultStore.setExecutionStatus('cancelled')
  }
}

// 执行计划
async function handleExplain() {
  if (!currentTabConnection.value) {
    ElMessage.warning('请先连接数据库')
    return
  }
  
  // 获取选中的 SQL（如果有选中则执行选中部分，否则执行全部）
  const sql = sqlEditor?.getSelectedText() || editorStore.currentSql
  if (!sql.trim()) {
    ElMessage.warning('请输入 SQL 语句')
    return
  }
  
  resultStore.setExecutionStatus('running')
  
  try {
    const database = editorStore.activeTab?.databaseName
    const result = await window.api.query.explain(currentTabConnection.value.id, sql, database)
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
