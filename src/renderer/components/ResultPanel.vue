<template>
  <div class="result-panel">
    <!-- 标签页头部 -->
    <div class="panel-header">
      <el-tabs v-model="activeTabId" type="border-card" class="result-tabs">
        <!-- 结果集标签页 -->
        <el-tab-pane
          v-for="tab in resultTabs"
          :key="tab.id"
          :label="tab.title"
          :name="tab.id"
        >
          <!-- 结果表格 -->
          <template v-if="tab.type === 'resultset'">
            <ResultTable 
              :data="tab.data as QueryResultSet" 
              :data-operations="dataOps"
              @cell-change="handleCellChange"
            />
          </template>
          
          <!-- 执行计划 -->
          <template v-else-if="tab.type === 'explain'">
            <ExplainView :data="tab.data as ExplainResult" />
          </template>
        </el-tab-pane>
        
        <!-- 消息标签页 -->
        <el-tab-pane label="消息" name="message">
          <div class="message-list">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message-item', msg.type]"
            >
              <span class="time">{{ formatTime(msg.time) }}</span>
              <span class="text">{{ msg.text }}</span>
            </div>
            <div v-if="messages.length === 0" class="empty-message">
              暂无消息
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 工具栏按钮区域 -->
      <div class="toolbar-area" v-if="showOperationsToolbar">
        <!-- 数据操作工具栏 -->
        <DataOperationsToolbar
          :data-ops="dataOps"
          @add-row="handleAddRow"
          @revert="handleRevert"
          @operation="handleOperation"
        />
      </div>
      
      <!-- 导出按钮（下拉菜单样式） -->
      <div class="export-buttons" v-if="canExport">
        <el-dropdown trigger="hover" @command="handleExport">
          <button class="export-btn">
            📥 导出 <span class="dropdown-arrow">▼</span>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="xlsx">Excel (.xlsx)</el-dropdown-item>
              <el-dropdown-item command="csv">CSV (.csv)</el-dropdown-item>
              <el-dropdown-item command="json">JSON (.json)</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <!-- SQL 确认对话框 -->
    <ConfirmSqlDialog
      v-model="confirmDialog.visible"
      :type="confirmDialog.type"
      :sqls="confirmDialog.sqls"
      :loading="confirmDialog.loading"
      @confirm="handleConfirmExecute"
      @cancel="handleCancelExecute"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useResultStore } from '../stores/result'
import { useEditorStore } from '../stores/editor'
import { formatValueForExport } from '../utils/formatters'
import ResultTable from './ResultTable.vue'
import ExplainView from './ExplainView.vue'
import DataOperationsToolbar from './DataOperationsToolbar.vue'
import ConfirmSqlDialog from './ConfirmSqlDialog.vue'
import { useDataOperations } from '../composables/useDataOperations'
import type { QueryResultSet, ExplainResult } from '@shared/types'

const resultStore = useResultStore()
const editorStore = useEditorStore()

const resultTabs = computed(() => resultStore.tabs)
const messages = computed(() => resultStore.messages)

const activeTabId = computed({
  get: () => resultStore.activeTabId,
  set: (val) => resultStore.switchTab(val)
})

// 是否可以导出（当前标签页是结果集）
const canExport = computed(() => {
  const activeTab = resultStore.activeTab
  return activeTab && activeTab.type === 'resultset'
})

// 获取当前结果集
const currentResultSet = computed(() => {
  const activeTab = resultStore.activeTab
  if (activeTab && activeTab.type === 'resultset') {
    return activeTab.data as QueryResultSet
  }
  return null
})

// 是否显示操作工具栏
const showOperationsToolbar = computed(() => {
  return currentTabIsResultSet.value
})

// 当前标签页是否是结果集
const currentTabIsResultSet = computed(() => {
  const activeTab = resultStore.activeTab
  return activeTab && activeTab.type === 'resultset'
})

// 数据操作
const dataOps = useDataOperations({
  resultSet: currentResultSet,
  connectionId: computed(() => editorStore.activeTab?.connectionId ?? null)
})

// 确认对话框状态
const confirmDialog = reactive({
  visible: false,
  type: 'delete' as 'delete' | 'update' | 'insert' | 'mixed',
  sqls: [] as string[],
  loading: false
})

// 跟踪当前已初始化的结果集，避免切换标签页时重复初始化
let initializedResultSet: QueryResultSet | null = null

// 监听结果数据变化，初始化数据操作状态
watch(currentResultSet, (newVal) => {
  if (newVal && newVal !== initializedResultSet) {
    // 如果 dataOps 标记有未保存修改，保留修改状态（切换标签页场景）
    const preserveChanges = dataOps.hasChanges.value
    dataOps.initialize(newVal, preserveChanges)
    initializedResultSet = newVal
  }
}, { immediate: true })

// 新增行
function handleAddRow() {
  dataOps.addNewRow()
}

// 还原
function handleRevert() {
  dataOps.revertAll()
  ElMessage.info('已还原所有修改')
}

// 操作按钮点击（接收来自工具栏的操作类型）
function handleOperation(type: 'delete' | 'submit') {
  if (type === 'delete') {
    // 删除确认
    confirmDialog.type = 'delete'
    confirmDialog.sqls = dataOps.generateDeleteSQL()
    confirmDialog.visible = true
  } else {
    // 提交确认
    const updateSqls = dataOps.generateUpdateSQL()
    const insertSqls = dataOps.generateInsertSQL()
    confirmDialog.sqls = [...updateSqls, ...insertSqls]
    if (updateSqls.length > 0 && insertSqls.length > 0) {
      confirmDialog.type = 'mixed'
    } else if (insertSqls.length > 0) {
      confirmDialog.type = 'insert'
    } else {
      confirmDialog.type = 'update'
    }
    confirmDialog.visible = true
  }
}

// 确认执行
async function handleConfirmExecute() {
  const type = confirmDialog.type
  confirmDialog.loading = true
  
  try {
    if (type === 'delete') {
      const result = await dataOps.executeDelete()
      
      if (result.success) {
        ElMessage.success('删除成功')
        // 删除成功后，直接从当前结果集中移除已删除的行
        if (result.deletedRowKeys && result.deletedRowKeys.length > 0) {
          removeDeletedRows(result.deletedRowKeys)
        }
      } else {
        ElMessage.error(result.message || '删除失败')
      }
    } else {
      const result = await dataOps.executeSubmit()
      
      if (result.success) {
        ElMessage.success('提交成功')
        // 合并新增行到结果集（UPDATE 修改已在 executeSubmit 内部应用）
        if (result.committedNewRows && result.committedNewRows.length > 0) {
          mergeNewRowsToResult(result.committedNewRows)
        }
      } else {
        ElMessage.error(result.message || '提交失败')
      }
    }
  } finally {
    confirmDialog.loading = false
    confirmDialog.visible = false
  }
}

// 从当前结果集中移除已删除的行
function removeDeletedRows(deletedRowKeys: string[]) {
  const activeTab = resultStore.activeTab
  if (!activeTab || activeTab.type !== 'resultset') return
  
  const resultSet = activeTab.data as QueryResultSet
  
  if (deletedRowKeys.length === 0) return
  
  const deletedKeysSet = new Set(deletedRowKeys)
  
  // 过滤掉已删除的行
  resultSet.rows = resultSet.rows.filter((row, index) => {
    const rowKey = dataOps.getRowKey(row, index)
    return !deletedKeysSet.has(rowKey)
  })
  
  // 更新行数
  resultSet.rowCount = resultSet.rows.length
}

// 将新提交的行合并到结果集中（避免刷新后消失）
function mergeNewRowsToResult(committedNewRows: Array<{ tempId: string; data: Record<string, unknown> }>) {
  const activeTab = resultStore.activeTab
  if (!activeTab || activeTab.type !== 'resultset') return
  
  const resultSet = activeTab.data as QueryResultSet
  
  if (committedNewRows.length === 0) return
  
  // 将新增行数据转换为结果集行格式
  for (const newRow of committedNewRows) {
    const rowData: Record<string, unknown> = {}
    
    // 为每一列填充值（包括空值）
    for (const col of resultSet.columns) {
      if (newRow.data.hasOwnProperty(col.name)) {
        rowData[col.name] = newRow.data[col.name]
      } else {
        rowData[col.name] = null
      }
    }
    
    // 添加到结果集末尾
    resultSet.rows.push(rowData)
  }
  
  // 更新行数
  resultSet.rowCount = resultSet.rows.length
}

// 取消执行
function handleCancelExecute() {
  confirmDialog.visible = false
}

// 刷新数据（重新执行当前查询）
async function refreshData() {
  const activeTab = editorStore.activeTab
  if (!activeTab?.connectionId) return
  
  // 获取当前查询的 SQL
  const sql = activeTab.content
  if (!sql.trim()) return
  
  // 重新执行查询
  const result = await window.api.query.execute(
    activeTab.connectionId,
    sql,
    undefined,
    activeTab.databaseName
  )
  
  if (result.success && result.results) {
    // 更新结果
    resultStore.handleQueryResults(result.results)
  }
}

// 导出 refreshData 和 hasUnsavedChanges 供外部使用
defineExpose({ 
  refreshData,
  hasUnsavedChanges: () => dataOps.hasChanges.value,
  clearChanges: () => dataOps.revertAll()
})

// 单元格修改回调
function handleCellChange(rowKey: string, column: string, oldValue: unknown, newValue: unknown) {
  dataOps.recordChange(rowKey, column, oldValue, newValue)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 深度序列化，确保数据可以通过 IPC 传输
function deepSerialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    if (value instanceof Date) {
      return value.toISOString()
    }
    if (typeof value === 'object' && value !== null && value.type === 'Buffer' && Array.isArray(value.data)) {
      return btoa(String.fromCharCode(...value.data))
    }
    return value
  }))
}

// 导出
async function handleExport(format: 'csv' | 'json' | 'xlsx') {
  const data = currentResultSet.value
  if (!data) {
    ElMessage.warning('没有可导出的数据')
    return
  }
  
  // 格式化导出数据
  const formattedRows = data.rows.map(row => {
    const formattedRow: Record<string, unknown> = {}
    data.columns.forEach(col => {
      formattedRow[col.name] = formatValueForExport(row[col.name], col.type)
    })
    return formattedRow
  })
  
  // 深度序列化确保 IPC 可传输
  const columns = deepSerialize(data.columns)
  const rows = deepSerialize(formattedRows)
  
  const result = await window.api.file.export(columns, rows, format)
  if (result.success) {
    ElMessage.success(`导出成功: ${result.filePath}`)
  } else if (!result.canceled) {
    ElMessage.error(result.message || '导出失败')
  }
}
</script>

<style scoped>
.result-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.panel-header {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.result-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-panel :deep(.el-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-color: #555;
}

.result-panel :deep(.el-tabs__header) {
  background: #2d2d2d;
  border-bottom: 1px solid #555;
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 200px;
}

.result-panel :deep(.el-tabs__nav-wrap) {
  flex: 1;
}

.result-panel :deep(.el-tabs__item) {
  color: #d4d4d4;
  border-color: #555 !important;
}

.result-panel :deep(.el-tabs__item:hover) {
  color: #fff;
}

.result-panel :deep(.el-tabs__item.is-active) {
  color: #fff;
  background: #094771;
}

.result-panel :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  background: #1e1e1e;
  padding: 0;
}

.result-panel :deep(.el-tab-pane) {
  height: 100%;
  overflow: auto;
}

/* 工具栏区域 */
.toolbar-area {
  position: absolute;
  top: 0;
  right: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  z-index: 10;
}

/* 导出按钮样式 */
.export-buttons {
  position: absolute;
  top: 0;
  right: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.export-btn {
  padding: 4px 12px;
  background: #3c3c3c;
  border: 1px solid #555;
  color: #d4d4d4;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-btn:hover {
  background: #505050;
  border-color: #0e639c;
  color: #fff;
}

.dropdown-arrow {
  font-size: 8px;
  margin-left: 2px;
}

.message-list {
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}

.message-item {
  padding: 4px 0;
  display: flex;
  gap: 12px;
}

.message-item .time {
  color: #858585;
  flex-shrink: 0;
}

.message-item.info .text {
  color: #d4d4d4;
}

.message-item.success .text {
  color: #4ec9b0;
}

.message-item.warning .text {
  color: #e6a23c;
}

.message-item.error .text {
  color: #f48771;
}

.empty-message {
  color: #858585;
  text-align: center;
  padding: 20px;
}
</style>
