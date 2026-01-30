<template>
  <div class="data-operations-toolbar">
    <!-- 新增按钮 -->
    <el-tooltip :content="addButtonTooltip" placement="top">
      <el-button
        :icon="Plus"
        size="small"
        :disabled="!dataOps.addButtonEnabled.value"
        @click="handleAddRow"
      />
    </el-tooltip>
    
    <!-- 还原按钮 -->
    <el-tooltip :content="$t('result.rollbackChanges')" placement="top">
      <el-button
        :icon="RefreshLeft"
        size="small"
        :disabled="!dataOps.revertButtonEnabled.value"
        @click="handleRevert"
      />
    </el-tooltip>
    
    <!-- 操作按钮（删除/提交） -->
    <el-tooltip :content="operationButtonTooltip" placement="top">
      <el-button
        :icon="operationButtonIcon"
        size="small"
        :type="operationButtonType"
        :disabled="!dataOps.operationButtonState.value.enabled"
        @click="handleOperation"
      />
    </el-tooltip>
    
    <!-- 预留扩展插槽 -->
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, RefreshLeft, Delete, Check } from '@element-plus/icons-vue'
import type { UseDataOperationsReturn } from '../composables/useDataOperations'

const { t } = useI18n()

const props = defineProps<{
  dataOps: UseDataOperationsReturn
}>()

const emit = defineEmits<{
  (e: 'add-row'): void
  (e: 'revert'): void
  (e: 'operation', type: 'delete' | 'submit'): void
}>()

// 新增按钮 tooltip
const addButtonTooltip = computed(() => {
  if (props.dataOps.isJoinQuery.value) {
    return t('result.noEditableTable')
  }
  if (!props.dataOps.addButtonEnabled.value) {
    return t('result.noEditableTable')
  }
  return t('result.addRow')
})

// 操作按钮图标
const operationButtonIcon = computed(() => {
  return props.dataOps.operationButtonState.value.mode === 'delete' ? Delete : Check
})

// 操作按钮类型
const operationButtonType = computed(() => {
  return props.dataOps.operationButtonState.value.mode === 'delete' ? 'danger' : 'primary'
})

// 操作按钮 tooltip
const operationButtonTooltip = computed(() => {
  const state = props.dataOps.operationButtonState.value
  if (!props.dataOps.canOperate.value) {
    if (props.dataOps.isJoinQuery.value) {
      return t('result.noEditableTable')
    }
    return t('result.noEditableTable')
  }
  // 返回本地化的按钮提示
  if (state.mode === 'delete') {
    return t('result.deleteRow')
  }
  return t('result.commitChanges')
})

// 新增行
function handleAddRow() {
  emit('add-row')
}

// 还原
function handleRevert() {
  emit('revert')
}

// 操作按钮点击
function handleOperation() {
  const mode = props.dataOps.operationButtonState.value.mode
  emit('operation', mode === 'delete' ? 'delete' : 'submit')
}
</script>

<style scoped>
.data-operations-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
}

.data-operations-toolbar .el-button {
  padding: 6px 10px;
  transition: all 0.2s ease;
}

/* 可用状态 - 新增按钮（绿色主题） */
.data-operations-toolbar .el-button:not(:disabled):has(.el-icon-plus) {
  color: #67c23a;
  border-color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

.data-operations-toolbar .el-button:not(:disabled):has(.el-icon-plus):hover {
  background-color: #67c23a;
  color: #fff;
}

/* 可用状态 - 还原按钮（橙色主题） */
.data-operations-toolbar .el-button:not(:disabled):has(.el-icon-refresh-left) {
  color: #e6a23c;
  border-color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

.data-operations-toolbar .el-button:not(:disabled):has(.el-icon-refresh-left):hover {
  background-color: #e6a23c;
  color: #fff;
}

/* 禁用状态 - 更明显的视觉区分 */
.data-operations-toolbar .el-button.is-disabled {
  opacity: 0.4;
  background-color: transparent !important;
  border-color: #606266 !important;
  color: #606266 !important;
}

/* 按钮分组分隔线（可选，用于后续扩展） */
.data-operations-toolbar .separator {
  width: 1px;
  height: 16px;
  background: var(--el-border-color);
  margin: 0 4px;
}
</style>
