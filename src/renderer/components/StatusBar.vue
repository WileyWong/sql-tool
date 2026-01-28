<template>
  <div class="status-bar">
    <div class="left">
      <span class="status-item">
        {{ connectionStatus }}
      </span>
      <span v-if="serverVersion" class="status-item">
        {{ serverVersion }}
      </span>
      <!-- hover 操作提示 -->
      <span v-if="hoverHint" class="status-item hover-hint">
        {{ hoverHint }}
      </span>
    </div>
    <div class="right">
      <span class="status-item">{{ cursorPosition }}</span>
      <span class="status-item">UTF-8</span>
      <span class="status-item">LF</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

// 获取当前标签页的连接
const currentTabConnection = computed(() => {
  const tab = editorStore.activeTab
  if (!tab?.connectionId) return null
  return connectionStore.connections.find(c => c.id === tab.connectionId) || null
})

const connectionStatus = computed(() => {
  const conn = currentTabConnection.value
  if (!conn) return '🔴 未连接'
  switch (conn.status) {
    case 'connected': return '🟢 已连接'
    case 'connecting': return '🟡 连接中...'
    case 'error': return '🔴 连接错误'
    default: return '⚪ 未连接'
  }
})

const serverVersion = computed(() => {
  const conn = currentTabConnection.value
  if (conn?.status === 'connected') {
    return 'MySQL 8.0'
  }
  return ''
})

const cursorPosition = computed(() => {
  return `行: 1, 列: 1`
})

// hover 提示
const hoverHint = computed(() => editorStore.hoverHint)
</script>

<style scoped>
.status-bar {
  background: #007acc;
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: white;
}

.left,
.right {
  display: flex;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* hover 提示样式 */
.hover-hint {
  color: #4fc3f7;
  font-style: italic;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
