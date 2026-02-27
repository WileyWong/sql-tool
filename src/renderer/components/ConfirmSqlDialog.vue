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
      <p class="count-text">{{ $t('dialog.confirmSql.statementCount', { count: sqls.length }) }}</p>
    </div>
    <template #footer>
      <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { WarningFilled, InfoFilled } from '@element-plus/icons-vue'

const { t } = useI18n()

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
    case 'delete': return t('dialog.confirmSql.deleteTitle')
    case 'update': return t('dialog.confirmSql.updateTitle')
    case 'insert': return t('dialog.confirmSql.insertTitle')
    case 'mixed': return t('dialog.confirmSql.mixedTitle')
  }
})

const warningText = computed(() => {
  switch (props.type) {
    case 'delete': return t('dialog.confirmSql.deleteWarning')
    case 'update': return t('dialog.confirmSql.updateWarning')
    case 'insert': return t('dialog.confirmSql.insertWarning')
    case 'mixed': return t('dialog.confirmSql.mixedWarning')
  }
})

const confirmButtonType = computed(() => {
  return props.type === 'delete' ? 'danger' : 'primary'
})

const confirmButtonText = computed(() => {
  switch (props.type) {
    case 'delete': return t('dialog.confirmSql.confirmDelete')
    case 'update': return t('dialog.confirmSql.confirmUpdate')
    case 'insert': return t('dialog.confirmSql.confirmInsert')
    case 'mixed': return t('dialog.confirmSql.confirmSubmit')
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
  background: var(--bg-base);
  border: 1px solid var(--border-color);
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
