<template>
  <div class="result-table" @contextmenu.prevent>
    <el-table
      :data="data.rows"
      border
      stripe
      size="small"
      height="100%"
      :empty-text="'查询返回 0 行'"
      @cell-dblclick="handleCellDblClick"
      @cell-contextmenu="handleCellContextMenu"
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
            {{ formatValue(row[col.name], col.type) }}
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
    
    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="context-menu-item" @click="handleViewCell">查看</div>
    </div>
    
    <!-- 查看弹出层 -->
    <el-dialog
      v-model="viewDialog.visible"
      title="查看内容"
      width="600px"
      :close-on-press-escape="true"
      @close="closeViewDialog"
    >
      <div class="view-dialog-content">
        <div class="view-format-tabs">
          <el-radio-group v-model="viewDialog.format" size="small">
            <el-radio-button value="raw">原始值</el-radio-button>
            <el-radio-button value="json">JSON</el-radio-button>
            <el-radio-button value="xml">XML</el-radio-button>
          </el-radio-group>
        </div>
        <div class="view-content-wrapper">
          <!-- 原始值：纯文本显示 -->
          <pre v-if="viewDialog.format === 'raw'" class="view-content">{{ formattedViewContent }}</pre>
          <!-- JSON：带语法高亮和折叠 -->
          <JsonTreeViewer v-else-if="viewDialog.format === 'json'" :value="viewDialog.value" />
          <!-- XML：带语法高亮和折叠 -->
          <XmlTreeViewer v-else-if="viewDialog.format === 'xml'" :value="viewDialog.value" />
        </div>
      </div>
      <template #footer>
        <el-button @click="closeViewDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { QueryResultSet } from '@shared/types'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { useResultStore } from '../stores/result'
import JsonTreeViewer from './JsonTreeViewer.vue'
import XmlTreeViewer from './XmlTreeViewer.vue'

const props = defineProps<{
  data: QueryResultSet
}>()

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()
const resultStore = useResultStore()

// 编辑状态
const editingCell = ref<{ rowIndex: number; column: string } | null>(null)
const editValue = ref<string>('')
const originalValue = ref<unknown>(null)

// 右键菜单状态
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  cellValue: null as unknown
})

// 查看弹出层状态
const viewDialog = ref({
  visible: false,
  value: null as unknown,
  format: 'raw' as 'raw' | 'json' | 'xml'
})

// 格式化查看内容（仅用于原始值模式）
const formattedViewContent = computed(() => {
  const value = viewDialog.value.value
  if (value === null) return 'NULL'
  if (value === undefined) return ''
  
  const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return strValue
})

// 处理右键菜单
function handleCellContextMenu(row: Record<string, unknown>, column: { property: string }, _cell: HTMLElement, event: MouseEvent) {
  event.preventDefault()
  
  const value = row[column.property]
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    cellValue: value
  }
}

// 查看单元格内容
function handleViewCell() {
  viewDialog.value = {
    visible: true,
    value: contextMenu.value.cellValue,
    format: 'raw'
  }
  contextMenu.value.visible = false
}

// 关闭查看弹出层
function closeViewDialog() {
  viewDialog.value.visible = false
}

// 关闭右键菜单
function closeContextMenu() {
  contextMenu.value.visible = false
}

// 点击其他地方关闭右键菜单
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.context-menu')) {
    closeContextMenu()
  }
}

// 监听点击事件关闭右键菜单
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 计算列宽
function getColumnWidth(name: string): number {
  const baseWidth = Math.max(name.length * 10, 80)
  return Math.min(baseWidth, 300)
}

// 格式化日期时间值
function formatDateTime(value: unknown, type: string): string | null {
  if (value === null || value === undefined) return null
  
  const upperType = type.toUpperCase()
  
  // 处理 DATE 类型
  if (upperType === 'DATE') {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // 处理 DATETIME 类型 (包括 DATETIME(fsp))
  // 注意：MySQL 返回的类型可能只是 DATETIME，即使字段定义了精度
  if (upperType.startsWith('DATETIME')) {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const ms = date.getMilliseconds()
    
    // 如果有毫秒值，显示毫秒
    if (ms > 0) {
      const msStr = String(ms).padStart(3, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${msStr}`
    }
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 处理 TIMESTAMP 类型 (包括 TIMESTAMP(fsp))
  if (upperType.startsWith('TIMESTAMP')) {
    const date = new Date(value as string | number | Date)
    if (isNaN(date.getTime())) return String(value)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const ms = date.getMilliseconds()
    
    // 如果有毫秒值，显示毫秒
    if (ms > 0) {
      const msStr = String(ms).padStart(3, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${msStr}`
    }
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 处理 TIME 类型 (包括 TIME(fsp))
  if (upperType.startsWith('TIME')) {
    // TIME 类型可能是字符串格式 "HH:mm:ss" 或毫秒数
    const strValue = String(value)
    // 如果已经是时间格式，直接返回（保留毫秒部分如果有的话）
    const timeMatch = strValue.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/)
    if (timeMatch) {
      const [, hours, minutes, seconds, ms] = timeMatch
      if (ms && parseInt(ms, 10) > 0) {
        return `${hours}:${minutes}:${seconds}.${ms}`
      }
      return `${hours}:${minutes}:${seconds}`
    }
    return strValue
  }
  
  // 处理 YEAR 类型
  if (upperType === 'YEAR') {
    // YEAR 类型可能是数字或字符串
    const yearValue = typeof value === 'number' ? value : parseInt(String(value), 10)
    if (!isNaN(yearValue)) {
      return String(yearValue)
    }
    return String(value)
  }
  
  return null
}

// 格式化值
function formatValue(value: unknown, columnType?: string): string {
  if (value === null) return 'NULL'
  if (value === undefined) return ''
  
  // 尝试日期时间格式化
  if (columnType) {
    const formatted = formatDateTime(value, columnType)
    if (formatted !== null) return formatted
  }
  
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
  // 对于对象类型，使用 JSON.stringify 格式化，保持与显示一致
  if (row[column.property] === null) {
    editValue.value = ''
  } else if (typeof row[column.property] === 'object') {
    editValue.value = JSON.stringify(row[column.property])
  } else {
    editValue.value = String(row[column.property])
  }
  
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
  let newValue: unknown = editValue.value === '' ? null : editValue.value
  
  // 如果原始值是对象类型，说明这是一个 JSON 字段
  if (originalValue.value !== null && typeof originalValue.value === 'object' && newValue !== null) {
    // 对于 JSON 字段，我们需要传递字符串给数据库
    // 首先验证是否是有效的 JSON
    try {
      const parsedValue = JSON.parse(newValue as string)
      // 如果解析成功，比较解析后的值与原始值
      if (JSON.stringify(parsedValue) === JSON.stringify(originalValue.value)) {
        cancelEdit()
        return
      }
      // 对于 JSON 字段，传递字符串给数据库
      newValue = newValue as string
    } catch (error) {
      // JSON 解析失败，保持字符串形式，让数据库来验证
      // 这里不做前端验证，按需求文档要求依赖数据库错误反馈
    }
  } else {
    // 非 JSON 字段的常规比较
    if (newValue === originalValue.value || (newValue === null && originalValue.value === null)) {
      cancelEdit()
      return
    }
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
    
    // 生成行的唯一标识（使用主键值）
    const rowKey = props.data.primaryKeys!.map(pk => `${pk}:${row[pk]}`).join('|')
    // 标记结果有修改
    resultStore.markAsModified(rowKey, { ...row })
    
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

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: #2d2d2d;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 0;
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.context-menu-item {
  padding: 6px 16px;
  color: #d4d4d4;
  cursor: pointer;
  font-size: 13px;
}

.context-menu-item:hover {
  background: #094771;
}

/* 查看弹出层样式 */
.view-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-format-tabs {
  display: flex;
  justify-content: flex-start;
}

.view-content-wrapper {
  max-height: 400px;
  overflow: auto;
}

.view-content {
  margin: 0;
  padding: 12px;
  color: #d4d4d4;
  background: #1e1e1e;
  border: 1px solid #555;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
