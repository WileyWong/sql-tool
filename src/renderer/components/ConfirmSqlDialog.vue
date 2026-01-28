<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
    class="confirm-sql-dialog"
  >
    <div class="confirm-dialog-content">
      <p class="warning-text">
        <el-icon v-if="type === 'delete'" class="warning-icon"><WarningFilled /></el-icon>
        <el-icon v-else class="info-icon"><InfoFilled /></el-icon>
        {{ warningText }}
      </p>
      <div class="sql-preview" :class="{ scrollable: sqls.length > 10 }">
        <pre><code>{{ sqls.join('\n') }}</code></pre>
      </div>
      <p class="count-text">共 {{ sqls.length }} 条语句</p>
    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button 
        :type="confirmButtonType" 
        @click="handleConfirm"
        :loading="loading"
      >
        {{ confirmButtonText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WarningFilled, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
  type: 'delete' | 'update' | 'insert' | 'mixed'
  sqls: string[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = computed(() => {
  switch (props.type) {
    case 'delete': return '确认删除'
    case 'update': return '确认修改'
    case 'insert': return '确认新增'
    case 'mixed': return '确认提交'
  }
})

const warningText = computed(() => {
  switch (props.type) {
    case 'delete': return '删除后不可恢复，是否继续？'
    case 'update': return '即将执行以下 UPDATE 语句，是否继续？'
    case 'insert': return '即将执行以下 INSERT 语句，是否继续？'
    case 'mixed': return '即将执行以下 SQL 语句，是否继续？'
  }
})

const confirmButtonType = computed(() => {
  return props.type === 'delete' ? 'danger' : 'primary'
})

const confirmButtonText = computed(() => {
  switch (props.type) {
    case 'delete': return '确认删除'
    case 'update': return '确认修改'
    case 'insert': return '确认新增'
    case 'mixed': return '确认提交'
  }
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  visible.value = false
}
</script>

<style scoped>
.confirm-dialog-content {
  padding: 0 20px;
}

.warning-text {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon {
  color: var(--el-color-warning);
  font-size: 18px;
}

.info-icon {
  color: var(--el-color-info);
  font-size: 18px;
}

.sql-preview {
  background: #1e1e1e;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  overflow-x: auto;
}

.sql-preview.scrollable {
  max-height: 200px;
  overflow-y: auto;
}

.sql-preview pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  color: #d4d4d4;
  line-height: 1.6;
}

.count-text {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 8px;
  text-align: right;
}
</style>
