<template>
  <div class="result-table" @contextmenu.prevent>
    <!-- 表格容器 -->
    <div class="table-container">
      <!-- 表头容器（隐藏水平滚动条，由表体控制） -->
      <div class="table-header-wrapper">
        <div class="table-header" ref="tableHeaderRef">
          <div 
            v-for="col in data.columns" 
            :key="col.name"
            class="header-cell"
            :style="{ width: columnWidths[col.name] + 'px', minWidth: '50px' }"
            @mousedown.prevent="handleHeaderMouseDown($event, col.name)"
          >
            <div class="column-header">
              <span class="column-name" :class="{ 'primary-key': col.isPrimaryKey }">
                {{ col.name }}
                <span v-if="col.isPrimaryKey" class="pk-icon">🔑</span>
              </span>
              <span class="column-type">{{ col.type }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 虚拟滚动表体 -->
      <div 
        ref="scrollContainerRef" 
        class="table-body"
        @scroll="handleScroll"
      >
        <div 
          class="table-body-inner"
          :style="{ height: `${rowVirtualizer.getTotalSize()}px` }"
        >
          <div
            v-for="virtualRow in rowVirtualizer.getVirtualItems()"
            :key="virtualRow.index"
            class="table-row"
            :class="{ 'striped': virtualRow.index % 2 === 1 }"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }"
          >
            <div
              v-for="col in data.columns"
              :key="col.name"
              class="table-cell"
              :style="{ width: columnWidths[col.name] + 'px', minWidth: '50px' }"
              @dblclick="handleCellDblClick(data.rows[virtualRow.index], col, virtualRow.index)"
              @contextmenu.prevent="handleCellContextMenu(data.rows[virtualRow.index], col, $event)"
            >
              <!-- 编辑模式 -->
              <div
                v-if="isEditing(virtualRow.index, col.name)"
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
              <span v-else :class="{ 'null-value': data.rows[virtualRow.index][col.name] === null }">
                {{ formatCellValue(data.rows[virtualRow.index][col.name], col.type) }}
              </span>
            </div>
          </div>
        </div>
        <!-- 空数据提示 -->
        <div v-if="data.rows.length === 0" class="empty-text">查询返回 0 行</div>
      </div>
    </div>
    
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>{{ data.rowCount }} 行</span>
      <span>耗时 {{ data.executionTime }}ms</span>
      <span v-if="editingCell" class="editing-hint">编辑后回车保存</span>
      <span v-else-if="data.editable" class="editable-hint">可编辑</span>
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
import { ref, nextTick, computed, onMounted, onUnmounted, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { ElMessage } from 'element-plus'
import type { QueryResultSet, ColumnDef } from '@shared/types'
import { useConnectionStore } from '../stores/connection'
import { useEditorStore } from '../stores/editor'
import { formatDateTime, formatBitValue, formatCellValue } from '../utils/formatters'
import JsonTreeViewer from './JsonTreeViewer.vue'
import XmlTreeViewer from './XmlTreeViewer.vue'

const props = defineProps<{
  data: QueryResultSet
}>()

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null)
const tableHeaderRef = ref<HTMLElement | null>(null)

// 行高
const ROW_HEIGHT = 36

// 列宽状态
const columnWidths = ref<Record<string, number>>({})

// 列宽拖动状态
const resizing = ref<{
  column: string
  startX: number
  startWidth: number
} | null>(null)

// 初始化列宽
function initColumnWidths() {
  const widths: Record<string, number> = {}
  for (const col of props.data.columns) {
    if (!columnWidths.value[col.name]) {
      const baseWidth = Math.max(col.name.length * 10, 80)
      widths[col.name] = Math.min(baseWidth, 300)
    } else {
      widths[col.name] = columnWidths.value[col.name]
    }
  }
  columnWidths.value = widths
}

// 处理表头鼠标按下 - 检测是否在右边缘（拖动区域）
function handleHeaderMouseDown(event: MouseEvent, columnName: string) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const resizeZone = 5 // 右边缘5px为拖动区域
  
  if (offsetX >= rect.width - resizeZone) {
    startResize(event, columnName)
  }
}

// 开始拖动调整列宽
function startResize(event: MouseEvent, columnName: string) {
  resizing.value = {
    column: columnName,
    startX: event.clientX,
    startWidth: columnWidths.value[columnName] || 100
  }
  
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

// 拖动中
function handleResizeMove(event: MouseEvent) {
  if (!resizing.value) return
  
  const diff = event.clientX - resizing.value.startX
  const newWidth = Math.max(50, resizing.value.startWidth + diff)
  columnWidths.value[resizing.value.column] = newWidth
}

// 拖动结束
function handleResizeEnd() {
  resizing.value = null
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// 监听数据变化，初始化列宽
watch(() => props.data.columns, () => {
  initColumnWidths()
}, { immediate: true })

// 虚拟化配置
const rowVirtualizer = useVirtualizer(computed(() => ({
  count: props.data.rows.length,
  getScrollElement: () => scrollContainerRef.value,
  estimateSize: () => ROW_HEIGHT,
  overscan: 10
})))

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

// 处理滚动 - 同步表头水平滚动
function handleScroll() {
  if (scrollContainerRef.value && tableHeaderRef.value) {
    tableHeaderRef.value.style.transform = `translateX(-${scrollContainerRef.value.scrollLeft}px)`
  }
}

// 处理右键菜单
function handleCellContextMenu(row: Record<string, unknown>, column: ColumnDef, event: MouseEvent) {
  event.preventDefault()
  
  const value = row[column.name]
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
  // 清理拖动事件
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
})

// 判断是否正在编辑
function isEditing(rowIndex: number, column: string): boolean {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.column === column
}

// 双击单元格
function handleCellDblClick(row: Record<string, unknown>, column: ColumnDef, rowIndex: number) {
  // 检查是否可编辑
  if (!props.data.editable || !props.data.primaryKeys?.length) {
    return
  }
  
  // 不允许编辑主键列
  if (props.data.primaryKeys.includes(column.name)) {
    ElMessage.warning('主键列不可编辑')
    return
  }
  
  // 获取列的类型信息
  const columnType = column.type || ''
  
  // 进入编辑模式
  editingCell.value = { rowIndex, column: column.name }
  originalValue.value = row[column.name]

  // 根据类型格式化编辑值
  const cellValue = row[column.name]
  if (cellValue === null) {
    editValue.value = ''
  } else {
    // 尝试 BIT 类型格式化
    const formattedBit = formatBitValue(cellValue, columnType)
    if (formattedBit !== null) {
      editValue.value = formattedBit
    } else if (typeof cellValue === 'object') {
      // 检查是否是日期时间类型（可能传回 Date 对象）
      const formattedDate = formatDateTime(cellValue, columnType)
      if (formattedDate !== null) {
        editValue.value = formattedDate
      } else {
        editValue.value = JSON.stringify(cellValue)
      }
    } else {
      // 尝试日期时间格式化
      const formattedDate = formatDateTime(cellValue, columnType)
      if (formattedDate !== null) {
        editValue.value = formattedDate
      } else {
        editValue.value = String(cellValue)
      }
    }
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
    
    // 数据已成功写入数据库，清除修改标记（如果之前有的话）
    // 注意：这里不需要标记为有修改，因为数据已经持久化了
    
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

// 当数据变化时，重置滚动位置
watch(() => props.data.rows, () => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollTop = 0
  }
})
</script>

<style scoped>
.result-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header-wrapper {
  overflow-x: hidden;
  overflow-y: visible;
  flex-shrink: 0;
  background: #2d2d2d;
  border-bottom: 1px solid #555;
}

.table-header {
  display: flex;
  will-change: transform;
}

.header-cell {
  border-right: 1px solid #555;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.header-cell::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
}

.header-cell:hover::after {
  background: rgba(14, 99, 156, 0.4);
}

.header-cell:last-child {
  border-right: none;
}

.column-header {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  overflow: hidden;
}

.column-name {
  font-weight: 600;
  color: #d4d4d4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-body {
  flex: 1;
  overflow: auto;
  position: relative;
}

.table-body-inner {
  position: relative;
  width: 100%;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #555;
  background: #1e1e1e;
}

.table-row.striped {
  background: #252526;
}

.table-row:hover {
  background: #2a2d2e;
}

.table-cell {
  padding: 8px 12px;
  border-right: 1px solid #555;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #d4d4d4;
  font-size: 12px;
  flex-shrink: 0;
  cursor: default;
}

.table-cell:last-child {
  border-right: none;
}

.null-value {
  color: #858585;
  font-style: italic;
}

.empty-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #858585;
  font-size: 14px;
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
  flex-shrink: 0;
}

.editable-hint {
  color: #dcdcaa;
  margin-left: auto;
}

.editing-hint {
  color: #4fc3f7;
  margin-left: auto;
  font-weight: 500;
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

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.table-body::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.table-body::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
