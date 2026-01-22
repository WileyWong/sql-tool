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
            <ResultTable :data="tab.data as QueryResultSet" />
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useResultStore } from '../stores/result'
import ResultTable from './ResultTable.vue'
import ExplainView from './ExplainView.vue'
import type { QueryResultSet, ExplainResult } from '@shared/types'

const resultStore = useResultStore()

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

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 深度序列化，确保数据可以通过 IPC 传输
// 使用 JSON.stringify 的 replacer 处理特殊类型
function deepSerialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    if (value instanceof Date) {
      return value.toISOString()
    }
    // 处理 Buffer 对象 { type: 'Buffer', data: [...] }
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
  
  // 深度序列化确保 IPC 可传输
  const columns = deepSerialize(data.columns)
  const rows = deepSerialize(data.rows)
  
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
