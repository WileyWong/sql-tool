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
import { useI18n } from 'vue-i18n'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { getDatabaseTypeConfig } from '@shared/types/connection'

const { t } = useI18n()
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
  if (!conn) return `🔴 ${t('status.disconnected')}`
  switch (conn.status) {
    case 'connected': return `🟢 ${t('connection.connected')}`
    case 'connecting': return `🟡 ${t('connection.connecting')}`
    case 'error': return `🔴 ${t('error.connectionFailed', { message: '' }).replace('：', '')}`
    default: return `⚪ ${t('status.disconnected')}`
  }
})

const serverVersion = computed(() => {
  const conn = currentTabConnection.value
  if (conn?.status === 'connected') {
    return getDatabaseTypeConfig(conn.type || 'mysql').name
  }
  return ''
})

const cursorPosition = computed(() => {
  return t('status.position', { line: 1, column: 1 })
})

// hover 提示
const hoverHint = computed(() => editorStore.hoverHint)
</script>

<style scoped>
.status-bar {
  background: var(--color-status-bar);
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
