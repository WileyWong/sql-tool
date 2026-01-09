<template>
  <div class="status-bar">
    <div class="left">
      <span class="status-item">
        {{ connectionStatus }}
      </span>
      <span v-if="serverVersion" class="status-item">
        {{ serverVersion }}
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

const connectionStore = useConnectionStore()

const connectionStatus = computed(() => {
  const conn = connectionStore.currentConnection
  if (!conn) return '🔴 未连接'
  switch (conn.status) {
    case 'connected': return '🟢 已连接'
    case 'connecting': return '🟡 连接中...'
    case 'error': return '🔴 连接错误'
    default: return '⚪ 未连接'
  }
})

const serverVersion = computed(() => {
  const conn = connectionStore.currentConnection
  if (conn?.status === 'connected') {
    return 'MySQL 8.0'
  }
  return ''
})

const cursorPosition = computed(() => {
  return `行: 1, 列: 1`
})
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
</style>
