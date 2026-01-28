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
    <el-tooltip content="还原所有修改" placement="top">
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
import { Plus, RefreshLeft, Delete, Check } from '@element-plus/icons-vue'
import type { UseDataOperationsReturn } from '../composables/useDataOperations'

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
    return '联表查询不支持新增'
  }
  if (!props.dataOps.addButtonEnabled.value) {
    return '当前查询不支持新增'
  }
  return '新增行'
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
      return '联表查询不支持操作'
    }
    return '无主键，不支持操作'
  }
  return state.tooltip
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
  gap: 4px;
  padding: 0 8px;
}

.data-operations-toolbar .el-button {
  padding: 4px 8px;
}

/* 按钮分组分隔线（可选，用于后续扩展） */
.data-operations-toolbar .separator {
  width: 1px;
  height: 16px;
  background: var(--el-border-color);
  margin: 0 4px;
}
</style>
