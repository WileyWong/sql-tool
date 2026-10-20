<template>
  <div class="result-table" @contextmenu.prevent>
    <!-- 表格容器 -->
    <div class="table-container">
      <!-- 表头容器（隐藏水平滚动条，由表体控制） -->
      <div class="table-header-wrapper">
        <div class="table-header" ref="tableHeaderRef">
          <!-- 复选框列头 -->
          <div 
            class="header-cell checkbox-cell"
            :style="{ width: CHECKBOX_COLUMN_WIDTH + 'px' }"
          >
            <el-checkbox
              :model-value="isAllSelected"
              :indeterminate="isIndeterminate"
              :disabled="!canSelect"
              @change="handleSelectAll"
            />
          </div>
          <!-- 数据列头 -->
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
          :style="{ height: `${totalHeight}px` }"
        >
          <!-- 原始数据行 -->
          <div
            v-for="virtualRow in rowVirtualizer.getVirtualItems()"
            :key="`row-${virtualRow.index}`"
            class="table-row"
            :class="{ 
              'striped': virtualRow.index % 2 === 1,
              'selected': isRowSelected(virtualRow.index)
            }"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              minWidth: `${totalWidth}px`,
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }"
          >
            <!-- 复选框单元格 -->
            <div
              class="table-cell checkbox-cell"
              :style="{ width: CHECKBOX_COLUMN_WIDTH + 'px' }"
            >
              <el-checkbox
                :model-value="isRowSelected(virtualRow.index)"
                :disabled="!canSelect"
                @change="(val: boolean) => handleSelectRow(virtualRow.index, val)"
              />
            </div>
            <!-- 数据单元格 -->
            <div
              v-for="col in data.columns"
              :key="col.name"
              class="table-cell"
              :class="{ 'modified': isCellModified(virtualRow.index, col.name) }"
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
                  ref="editInputRef"
                  v-model="editValue"
                  class="edit-input"
                  @keydown.enter="confirmEdit"
                  @keydown.escape="cancelEdit"
                  @blur="handleEditBlur"
                />
              </div>
              <!-- 显示模式 -->
              <span v-else :class="{ 'null-value': getCellValue(virtualRow.index, col.name) === null }">
                {{ formatCellValue(getCellValue(virtualRow.index, col.name), col.type) }}
              </span>
            </div>
          </div>
          
          <!-- 新增行 -->
          <div
            v-for="(newRow, idx) in dataOps?.state.newRows || []"
            :key="`new-${newRow.tempId}`"
            class="table-row new-row"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              minWidth: `${totalWidth}px`,
              height: `${ROW_HEIGHT}px`,
              transform: `translateY(${getNewRowTop(idx)}px)`
            }"
          >
            <!-- 复选框单元格（新增行不可选） -->
            <div
              class="table-cell checkbox-cell"
              :style="{ width: CHECKBOX_COLUMN_WIDTH + 'px' }"
            >
              <span class="new-row-badge">{{ $t('common.new') }}</span>
            </div>
            <!-- 数据单元格 -->
            <div
              v-for="col in data.columns"
              :key="col.name"
              class="table-cell"
              :style="{ width: columnWidths[col.name] + 'px', minWidth: '50px' }"
              @dblclick="handleNewRowDblClick(newRow.tempId, col)"
            >
              <!-- 编辑模式 -->
              <div
                v-if="isEditingNewRow(newRow.tempId, col.name)"
                class="edit-cell"
              >
                <input
                  ref="editInputRef"
                  v-model="editValue"
                  class="edit-input"
                  @keydown.enter="confirmNewRowEdit"
                  @keydown.escape="cancelEdit"
                  @blur="handleEditBlur"
                />
              </div>
              <!-- 显示模式 -->
              <span v-else :class="{ 'null-value': !newRow.data[col.name] }">
                {{ formatCellValue(newRow.data[col.name], col.type) || 'NULL' }}
              </span>
            </div>
          </div>
        </div>
        <!-- 空数据提示 -->
        <div v-if="data.rows.length === 0 && (!dataOps?.state.newRows || dataOps.state.newRows.length === 0)" class="empty-text">{{ $t('result.noData') }}</div>
      </div>
    </div>
    
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>{{ $t('result.totalRows', { count: data.rowCount }) }}</span>
      <span v-if="dataOps?.state.newRows?.length">+ {{ dataOps.state.newRows.length }} {{ $t('result.addRow') }}</span>
      <span v-if="dataOps?.state.pendingChanges?.size">{{ dataOps.state.pendingChanges.size }} {{ $t('editor.modified') }}</span>
      <span>{{ $t('result.executionTime') }} {{ data.executionTime }}ms</span>
      <span v-if="editingCell" class="editing-hint">{{ $t('common.confirm') }}</span>
      <span v-else-if="data.editable" class="editable-hint">{{ $t('result.editMode') }}</span>
    </div>
    
    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="context-menu-item" @click="handleViewCell">{{ $t('contextMenu.viewData') }}</div>
    </div>
    
    <!-- 查看弹出层 -->
    <el-dialog
      v-model="viewDialog.visible"
      :title="$t('contextMenu.viewData')"
      width="600px"
      :close-on-press-escape="true"
      @close="closeViewDialog"
    >
      <div class="view-dialog-content">
        <div class="view-format-tabs">
          <el-radio-group v-model="viewDialog.format" size="small">
            <el-radio-button value="raw">Raw</el-radio-button>
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
        <el-button @click="closeViewDialog">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { ElMessage } from 'element-plus'
import type { QueryResultSet, ColumnDef } from '@shared/types'
import { formatCellValue, formatEditValue, parseEditValue } from '../utils/formatters'
import JsonTreeViewer from './JsonTreeViewer.vue'
import XmlTreeViewer from './XmlTreeViewer.vue'
import type { UseDataOperationsReturn } from '../composables/useDataOperations'
import { useResultStore } from '../stores/result'

const { t } = useI18n()

const props = defineProps<{
  data: QueryResultSet
  dataOperations?: UseDataOperationsReturn
  editorTabId?: string  // 编辑器标签页 ID，用于列宽持久化
}>()

const emit = defineEmits<{
  (e: 'cell-change', rowKey: string, column: string, oldValue: unknown, newValue: unknown): void
}>()

// 数据操作对象（可选）
const dataOps = computed(() => props.dataOperations)

// Result Store（用于列宽持久化）
const resultStore = useResultStore()

// 常量
const ROW_HEIGHT = 36
const CHECKBOX_COLUMN_WIDTH = 40
const MIN_COLUMN_WIDTH = 50
const MAX_COLUMN_WIDTH = 300
const CHAR_WIDTH = 8           // 单字符宽度（英文）
const CHINESE_CHAR_WIDTH = 16  // 中文字符宽度
const CELL_PADDING = 24        // 单元格 padding
const TYPE_LABEL_WIDTH = 30    // 类型标签额外宽度

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null)
const tableHeaderRef = ref<HTMLElement | null>(null)

// 列宽状态
const columnWidths = ref<Record<string, number>>({})

// 列宽拖动状态
const resizing = ref<{
  column: string
  startX: number
  startWidth: number
} | null>(null)

/**
 * 计算文本宽度（考虑中英文）
 */
function getTextWidth(text: string): number {
  let width = 0
  for (const char of text) {
    // 中文字符（Unicode 范围）
    if (/[\u4e00-\u9fa5]/.test(char)) {
      width += CHINESE_CHAR_WIDTH
    } else {
      width += CHAR_WIDTH
    }
  }
  return width
}

/**
 * 计算单列宽度
 */
function calculateColumnWidth(
  columnName: string,
  sampleRows: Record<string, unknown>[]
): number {
  // 1. 计算表头宽度
  const headerWidth = getTextWidth(columnName) + TYPE_LABEL_WIDTH + CELL_PADDING

  // 2. 计算数据内容最大宽度
  let maxDataWidth = 0
  for (const row of sampleRows) {
    const value = row[columnName]
    const displayValue = value === null || value === undefined ? 'NULL' : String(value)
    const textWidth = getTextWidth(displayValue) + CELL_PADDING
    maxDataWidth = Math.max(maxDataWidth, textWidth)
  }

  // 3. 取较大值并应用限制
  const calculatedWidth = Math.max(headerWidth, maxDataWidth)
  return Math.min(Math.max(calculatedWidth, MIN_COLUMN_WIDTH), MAX_COLUMN_WIDTH)
}

/**
 * 获取采样行数
 */
function getSampleRowCount(): number {
  if (!scrollContainerRef.value) {
    return 20 // 默认采样 20 行
  }
  const containerHeight = scrollContainerRef.value.clientHeight || 400
  const visibleRows = Math.ceil(containerHeight / ROW_HEIGHT)
  return Math.min(Math.max(visibleRows, 10), 20) // 10-20 行
}

// 初始化列宽（动态计算 + 持久化恢复）
function initColumnWidths() {
  // 1. 尝试从 store 恢复列宽
  if (props.editorTabId) {
    const savedWidths = resultStore.getColumnWidths(props.editorTabId)
    if (savedWidths && Object.keys(savedWidths).length > 0) {
      // 检查列是否匹配（可能 SQL 变了）
      const savedColumns = new Set(Object.keys(savedWidths))
      const columnsMatch = props.data.columns.every(c => savedColumns.has(c.name))
      
      if (columnsMatch) {
        columnWidths.value = { ...savedWidths }
        return
      }
    }
  }
  
  // 2. 动态计算列宽
  const sampleCount = getSampleRowCount()
  const sampleRows = props.data.rows.slice(0, sampleCount)
  
  const widths: Record<string, number> = {}
  for (const col of props.data.columns) {
    widths[col.name] = calculateColumnWidth(col.name, sampleRows)
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

// 拖动结束 - 保存列宽到 store
function handleResizeEnd() {
  // 保存列宽到 store
  if (props.editorTabId) {
    resultStore.saveColumnWidths(props.editorTabId, columnWidths.value)
  }
  
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

// 计算总行数（原始数据 + 新增行）
const totalRowCount = computed(() => {
  return props.data.rows.length + (dataOps.value?.state.newRows?.length || 0)
})

// 计算总高度
const totalHeight = computed(() => {
  return totalRowCount.value * ROW_HEIGHT
})

// 计算表格总宽度（用于确保行背景完整覆盖）
const totalWidth = computed(() => {
  const columnsWidth = props.data.columns.reduce((sum, col) => {
    return sum + (columnWidths.value[col.name] || MIN_COLUMN_WIDTH)
  }, 0)
  return columnsWidth + CHECKBOX_COLUMN_WIDTH
})

// 虚拟化配置（仅用于原始数据行）
const rowVirtualizer = useVirtualizer(computed(() => ({
  count: props.data.rows.length,
  getScrollElement: () => scrollContainerRef.value,
  estimateSize: () => ROW_HEIGHT,
  overscan: 10
})))

// 编辑状态
const editingCell = ref<{ rowIndex: number; column: string } | null>(null)
const editingNewRow = ref<{ tempId: string; column: string } | null>(null)
const editValue = ref<string>('')
const originalValue = ref<unknown>(null)
const editInputRef = ref<HTMLInputElement | null>(null)

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

// 判断是否正在编辑新增行
function isEditingNewRow(tempId: string, column: string): boolean {
  return editingNewRow.value?.tempId === tempId && editingNewRow.value?.column === column
}

// 获取单元格值（优先返回 pending changes 中的修改值）
function getCellValue(rowIndex: number, column: string): unknown {
  if (!dataOps.value) {
    return props.data.rows[rowIndex][column]
  }
  
  const row = props.data.rows[rowIndex]
  const rowKey = dataOps.value.getRowKey(row, rowIndex)
  
  // 检查是否有 pending change
  const pendingChange = dataOps.value.state.pendingChanges.get(rowKey)?.get(column)
  if (pendingChange) {
    return pendingChange.newValue
  }
  
  return row[column]
}

// 双击单元格
function handleCellDblClick(_row: Record<string, unknown>, column: ColumnDef, rowIndex: number) {
  // 检查是否可编辑
  if (!props.data.editable || !props.data.primaryKeys?.length) {
    return
  }
  
  // 不允许编辑主键列
  if (props.data.primaryKeys.includes(column.name)) {
    ElMessage.warning(t('result.noEditableTable'))
    return
  }
  
  // 进入编辑模式
  editingCell.value = { rowIndex, column: column.name }
  editingNewRow.value = null
  
  // 获取单元格值（优先从 pendingChanges 获取修改后的值）
  const cellValue = getCellValue(rowIndex, column.name)
  originalValue.value = cellValue
  
  // 根据类型格式化编辑值
  editValue.value = formatEditValue(cellValue, column.type)
  
  // 聚焦输入框
  nextTick(() => {
    const inputEl = Array.isArray(editInputRef.value) ? editInputRef.value[0] : editInputRef.value
    inputEl?.focus()
    inputEl?.select()
  })
}

// 双击新增行单元格
function handleNewRowDblClick(tempId: string, column: ColumnDef) {
  if (!dataOps.value) return
  
  const newRow = dataOps.value.state.newRows.find(r => r.tempId === tempId)
  if (!newRow) return
  
  editingNewRow.value = { tempId, column: column.name }
  editingCell.value = null
  originalValue.value = newRow.data[column.name]
  editValue.value = formatEditValue(newRow.data[column.name], column.type)
  
  nextTick(() => {
    const inputEl = Array.isArray(editInputRef.value) ? editInputRef.value[0] : editInputRef.value
    inputEl?.focus()
    inputEl?.select()
  })
}

// 确认编辑（仅退出编辑模式，不保存到数据库）
function confirmEdit() {
  if (!editingCell.value || !dataOps.value) {
    cancelEdit()
    return
  }
  
  const { rowIndex, column } = editingCell.value
  const row = props.data.rows[rowIndex]
  
  // 获取列类型信息
  const colDef = props.data.columns.find(c => c.name === column)
  const columnType = colDef?.type ?? ''
  
  // 解析新值，根据原始值类型做类型还原
  const newValue = parseEditValue(editValue.value, columnType, originalValue.value)
  
  // 记录修改（通知父组件）
  const rowKey = dataOps.value.getRowKey(row, rowIndex)
  emit('cell-change', rowKey, column, originalValue.value, newValue)
  
  // 退出编辑模式
  editingCell.value = null
  editValue.value = ''
  originalValue.value = null
}

// 确认新增行编辑
function confirmNewRowEdit() {
  if (!editingNewRow.value || !dataOps.value) {
    cancelEdit()
    return
  }
  
  const { tempId, column } = editingNewRow.value
  
  // 获取列类型信息，根据类型转换值
  const colDef = props.data.columns.find(c => c.name === column)
  const columnType = colDef?.type ?? ''
  const newValue = parseEditValue(editValue.value, columnType, originalValue.value)
  
  // 更新新增行数据
  dataOps.value.updateNewRowData(tempId, column, newValue)
  
  // 退出编辑模式
  editingNewRow.value = null
  editValue.value = ''
  originalValue.value = null
}

// 取消编辑
function cancelEdit() {
  editingCell.value = null
  editingNewRow.value = null
  editValue.value = ''
  originalValue.value = null
}

// 处理编辑框失去焦点
function handleEditBlur() {
  // 延迟处理，让点击事件先执行
  setTimeout(() => {
    if (editingCell.value) {
      confirmEdit()
    } else if (editingNewRow.value) {
      confirmNewRowEdit()
    }
  }, 200)
}

// 当数据变化时，重置滚动位置
watch(() => props.data.rows, () => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollTop = 0
  }
})

// --- 复选框相关 ---

// 是否可以选中（有主键且非联表查询）
const canSelect = computed(() => {
  return props.data.editable === true && (props.data.primaryKeys?.length ?? 0) > 0
})

// 是否全选
const isAllSelected = computed(() => {
  if (!dataOps.value || props.data.rows.length === 0) return false
  return props.data.rows.every((row, index) => {
    const rowKey = dataOps.value!.getRowKey(row, index)
    return dataOps.value!.state.selectedRowKeys.has(rowKey)
  })
})

// 是否部分选中
const isIndeterminate = computed(() => {
  if (!dataOps.value || props.data.rows.length === 0) return false
  const selectedCount = props.data.rows.filter((row, index) => {
    const rowKey = dataOps.value!.getRowKey(row, index)
    return dataOps.value!.state.selectedRowKeys.has(rowKey)
  }).length
  return selectedCount > 0 && selectedCount < props.data.rows.length
})

// 行是否选中
function isRowSelected(rowIndex: number): boolean {
  if (!dataOps.value) return false
  const row = props.data.rows[rowIndex]
  const rowKey = dataOps.value.getRowKey(row, rowIndex)
  return dataOps.value.state.selectedRowKeys.has(rowKey)
}

// 处理选择行
function handleSelectRow(rowIndex: number, selected: boolean) {
  if (!dataOps.value) return
  const row = props.data.rows[rowIndex]
  const rowKey = dataOps.value.getRowKey(row, rowIndex)
  dataOps.value.toggleRowSelection(rowKey, selected)
}

// 处理全选
function handleSelectAll(selected: boolean) {
  if (!dataOps.value) return
  dataOps.value.toggleAllSelection(selected)
}

// --- 修改标识相关 ---

// 单元格是否已修改
function isCellModified(rowIndex: number, column: string): boolean {
  if (!dataOps.value) return false
  const row = props.data.rows[rowIndex]
  const rowKey = dataOps.value.getRowKey(row, rowIndex)
  return dataOps.value.isCellModified(rowKey, column)
}

// --- 新增行位置计算 ---

// 获取新增行的顶部位置
function getNewRowTop(idx: number): number {
  return (props.data.rows.length + idx) * ROW_HEIGHT
}
</script>

<style scoped>
.result-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-base);
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
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.table-header {
  display: flex;
  will-change: transform;
  padding-left: 0;
}

.header-cell {
  border-right: 1px solid var(--border-color);
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.header-cell.checkbox-cell {
  justify-content: center;
  padding: 0;
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
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-base);
}

.table-row.striped {
  background: var(--bg-sidebar);
}

.table-row:hover {
  background: #2a2d2e;
}

.table-row.selected {
  background: rgba(64, 158, 255, 0.1);
}

.table-row.new-row {
  background: rgba(103, 194, 58, 0.1);
}

.table-row.new-row:hover {
  background: rgba(103, 194, 58, 0.15);
}

.table-cell {
  padding: 8px 12px;
  border-right: 1px solid var(--border-color);
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
  font-size: 12px;
  flex-shrink: 0;
  cursor: default;
  display: flex;
  align-items: center;
  position: relative;  /* 为编辑输入框提供定位上下文 */
}

.table-cell.checkbox-cell {
  justify-content: center;
  padding: 0;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell.modified {
  border-left: 3px solid #e6a23c;
  padding-left: 9px;
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
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  z-index: 1;
}

.edit-input {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  background: var(--bg-elevated);
  border: 2px solid var(--color-primary);
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
}

.edit-input:focus {
  background: var(--bg-surface);
}

/* 新增行标识 */
.new-row-badge {
  font-size: 10px;
  color: #67c23a;
  background: rgba(103, 194, 58, 0.2);
  padding: 2px 4px;
  border-radius: 2px;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
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
  color: var(--text-primary);
  background: var(--bg-base);
  border: 1px solid var(--border-color);
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
  background: var(--bg-base);
}

.table-body::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 5px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
</style>
