<template>
  <div class="result-table">
    <el-table
      :data="data.rows"
      border
      stripe
      size="small"
      height="100%"
      :empty-text="'查询返回 0 行'"
      @cell-dblclick="handleCellDblClick"
    >
      <el-table-column
        v-for="col in data.columns"
        :key="col.name"
        :prop="col.name"
        :label="col.name"
        :min-width="getColumnWidth(col.name)"
        show-overflow-tooltip
      >
        <template #header>
          <div class="column-header">
            <span class="column-name" :class="{ 'primary-key': col.isPrimaryKey }">
              {{ col.name }}
              <span v-if="col.isPrimaryKey" class="pk-icon">🔑</span>
            </span>
            <span class="column-type">{{ col.type }}</span>
          </div>
        </template>
        <template #default="{ row, $index }">
          <!-- 编辑模式 -->
          <div
            v-if="isEditing($index, col.name)"
            class="edit-cell"
          >
            <input
              ref="editInput"
              v-model="editValue"
              class="edit-input"
              @keydown.enter="confirmEdit"
              @keydown.escape="cancelEdit"
              @blur="cancelEdit"
            />
          </div>
          <!-- 显示模式 -->
          <span v-else :class="{ 'null-value': row[col.name] === null }">
            {{ formatValue(row[col.name]) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>{{ data.rowCount }} 行</span>
      <span>耗时 {{ data.executionTime }}ms</span>
      <span v-if="data.editable" class="editable-hint">可编辑</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { QueryResultSet } from '@shared/types'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'

const props = defineProps<{
  data: QueryResultSet
}>()

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

// 编辑状态
const editingCell = ref<{ rowIndex: number; column: string } | null>(null)
const editValue = ref<string>('')
const originalValue = ref<unknown>(null)

// 计算列宽
function getColumnWidth(name: string): number {
  const baseWidth = Math.max(name.length * 10, 80)
  return Math.min(baseWidth, 300)
}

// 格式化值
function formatValue(value: unknown): string {
  if (value === null) return 'NULL'
  if (value === undefined) return ''
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

// 判断是否正在编辑
function isEditing(rowIndex: number, column: string): boolean {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.column === column
}

// 双击单元格
function handleCellDblClick(row: Record<string, unknown>, column: { property: string }, _cell: unknown, _event: Event) {
  // 检查是否可编辑
  if (!props.data.editable || !props.data.primaryKeys?.length) {
    return
  }
  
  // 不允许编辑主键列
  if (props.data.primaryKeys.includes(column.property)) {
    ElMessage.warning('主键列不可编辑')
    return
  }
  
  const rowIndex = props.data.rows.indexOf(row)
  if (rowIndex === -1) return
  
  // 进入编辑模式
  editingCell.value = { rowIndex, column: column.property }
  originalValue.value = row[column.property]
  editValue.value = row[column.property] === null ? '' : String(row[column.property])
  
  // 聚焦输入框
  nextTick(() => {
    const input = document.querySelector('.edit-input') as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  })
}

// 确认编辑
async function confirmEdit() {
  if (!editingCell.value || !props.data.editable) return
  
  const { rowIndex, column } = editingCell.value
  const row = props.data.rows[rowIndex]
  
  // 值没变化，直接取消
  const newValue = editValue.value === '' ? null : editValue.value
  if (newValue === originalValue.value || (newValue === null && originalValue.value === null)) {
    cancelEdit()
    return
  }
  
  // 构建主键条件
  const primaryKeys = props.data.primaryKeys!.map(pk => ({
    column: pk,
    value: row[pk]
  }))
  
  // 使用当前标签页的连接ID
  const connectionId = editorStore.activeTab?.connectionId
  if (!connectionId || !props.data.databaseName || !props.data.tableName) {
    ElMessage.error('无法获取连接信息')
    cancelEdit()
    return
  }
  
  // 检查连接是否有效
  const conn = connectionStore.connections.find(c => c.id === connectionId)
  if (!conn || conn.status !== 'connected') {
    ElMessage.error('连接已断开')
    cancelEdit()
    return
  }
  
  // 执行更新
  const result = await window.api.query.updateCell(
    connectionId,
    props.data.databaseName,
    props.data.tableName,
    primaryKeys,
    column,
    newValue
  )
  
  if (result.success) {
    // 更新本地数据
    row[column] = newValue
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(result.message || '更新失败')
  }
  
  editingCell.value = null
}

// 取消编辑
function cancelEdit() {
  editingCell.value = null
  editValue.value = ''
  originalValue.value = null
}
</script>

<style scoped>
.result-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.result-table :deep(.el-table) {
  flex: 1;
  background: #1e1e1e;
  color: #d4d4d4;
  --el-table-border-color: #555;
  --el-table-header-bg-color: #2d2d2d;
  --el-table-tr-bg-color: #1e1e1e;
  --el-table-row-hover-bg-color: #2a2d2e;
  --el-fill-color-lighter: #252526;
}

.result-table :deep(.el-table th.el-table__cell) {
  background: #2d2d2d;
  color: #d4d4d4;
}

.result-table :deep(.el-table td.el-table__cell) {
  border-color: #555;
}

.result-table :deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background: #252526;
}

.result-table :deep(.el-table__empty-text) {
  color: #858585;
}

.column-header {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.column-name {
  font-weight: 600;
  color: #d4d4d4;
}

.column-name.primary-key {
  color: #dcdcaa;
}

.pk-icon {
  font-size: 10px;
  margin-left: 4px;
}

.column-type {
  font-size: 10px;
  color: #858585;
  font-weight: normal;
}

.null-value {
  color: #858585;
  font-style: italic;
}

.status-bar {
  height: 24px;
  padding: 0 12px;
  background: #2d2d2d;
  border-top: 1px solid #555;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: #4ec9b0;
}

.editable-hint {
  color: #dcdcaa;
  margin-left: auto;
}

/* 编辑单元格样式 */
.edit-cell {
  margin: -8px -12px;
  padding: 0;
}

.edit-input {
  width: 100%;
  padding: 8px 12px;
  background: #3c3c3c;
  border: 2px solid #0e639c;
  color: #d4d4d4;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
}

.edit-input:focus {
  background: #2d2d2d;
}
</style>
