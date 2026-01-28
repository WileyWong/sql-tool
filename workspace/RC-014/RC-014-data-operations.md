# RC-014 结果集数据操作功能 - 技术方案设计

> 版本: 1.1  
> 日期: 2026-01-28  
> 需求文档: requirements/requirements_change/requirements_change_14.md

## 1. 方案概述

### 1.1 设计目标

在现有结果表格基础上，新增批量删除、新增行、批量提交修改、还原等功能，同时将回车保存改为回车退出编辑。

### 1.2 设计原则

- **最小化冲击**: 抽离数据操作逻辑为独立 composable，减少对 ResultTable.vue 的改动
- **职责分离**: 表格负责展示和编辑交互，数据操作逻辑独立管理
- **组件化**: 操作工具栏抽取为独立组件，便于后续扩展
- **复用现有**: 复用现有的主键检测、SQL 执行、类型格式化逻辑

### 1.3 整体架构变更

```
变更前:
ResultPanel.vue
└── ResultTable.vue (展示 + 编辑)

变更后:
ResultPanel.vue
├── DataOperationsToolbar.vue (新增，操作工具栏组件)
│   ├── 新增按钮
│   ├── 还原按钮
│   ├── 操作按钮（删除/提交）
│   └── [预留扩展位置]
├── ResultTable.vue (展示 + 编辑交互)
├── ConfirmSqlDialog.vue (新增，SQL 确认对话框)
└── useDataOperations.ts (新增，数据操作逻辑)
    ├── 选中行管理
    ├── 修改跟踪
    ├── 新增行管理
    ├── SQL 语句生成
    └── 确认对话框控制
```

---

## 2. 详细设计

### 2.1 新增文件

#### 2.1.1 `src/renderer/composables/useDataOperations.ts`

**职责**: 管理数据操作状态和逻辑

```typescript
// 类型定义
export interface DataOperationsState {
  // 选中行（用于删除）
  selectedRowKeys: Set<string>
  
  // 修改跟踪：rowKey -> { column -> { oldValue, newValue } }
  pendingChanges: Map<string, Map<string, { oldValue: unknown; newValue: unknown }>>
  
  // 新增行列表
  newRows: Array<{
    tempId: string  // 临时ID（前端生成）
    data: Record<string, unknown>
  }>
  
  // 原始数据快照（用于还原）
  originalData: Record<string, unknown>[] | null
}

export interface DataOperationsOptions {
  // 结果集数据（响应式）
  resultSet: Ref<QueryResultSet | null>
  // 连接ID
  connectionId: Ref<string | null>
}

export function useDataOperations(options: DataOperationsOptions) {
  // --- 状态 ---
  const state = reactive<DataOperationsState>({
    selectedRowKeys: new Set(),
    pendingChanges: new Map(),
    newRows: [],
    originalData: null
  })
  
  // --- 计算属性 ---
  
  // 是否可操作（单表查询 + 有主键）
  const canOperate = computed(() => {
    const rs = options.resultSet.value
    if (!rs) return false
    return rs.editable === true && (rs.primaryKeys?.length ?? 0) > 0
  })
  
  // 是否是联表查询
  const isJoinQuery = computed(() => {
    const rs = options.resultSet.value
    return rs?.editable === false && rs?.tableName === undefined
  })
  
  // 是否有选中行
  const hasSelectedRows = computed(() => state.selectedRowKeys.size > 0)
  
  // 是否有未提交修改
  const hasChanges = computed(() => 
    state.pendingChanges.size > 0 || state.newRows.length > 0
  )
  
  // 操作按钮状态
  const operationButtonState = computed(() => {
    if (hasSelectedRows.value) {
      return { mode: 'delete', enabled: true, tooltip: '删除选中行' }
    }
    if (hasChanges.value) {
      return { mode: 'submit', enabled: true, tooltip: '提交修改' }
    }
    return { mode: 'submit', enabled: false, tooltip: '无修改' }
  })
  
  // 还原按钮状态
  const revertButtonEnabled = computed(() => hasChanges.value)
  
  // 新增按钮状态
  const addButtonEnabled = computed(() => {
    const rs = options.resultSet.value
    // 单表查询才能新增（不需要主键）
    return rs?.tableName !== undefined && !isJoinQuery.value
  })
  
  // --- 方法 ---
  
  // 初始化（查询完成后调用）
  function initialize(data: QueryResultSet) {
    state.selectedRowKeys.clear()
    state.pendingChanges.clear()
    state.newRows = []
    // 深拷贝原始数据用于还原
    state.originalData = JSON.parse(JSON.stringify(data.rows))
  }
  
  // 切换行选中状态
  function toggleRowSelection(rowKey: string, selected: boolean) {
    if (selected) {
      state.selectedRowKeys.add(rowKey)
    } else {
      state.selectedRowKeys.delete(rowKey)
    }
  }
  
  // 全选/取消全选
  function toggleAllSelection(selected: boolean) {
    if (selected) {
      options.resultSet.value?.rows.forEach((row, index) => {
        state.selectedRowKeys.add(getRowKey(row, index))
      })
    } else {
      state.selectedRowKeys.clear()
    }
  }
  
  // 记录单元格修改
  function recordChange(rowKey: string, column: string, oldValue: unknown, newValue: unknown) {
    if (!state.pendingChanges.has(rowKey)) {
      state.pendingChanges.set(rowKey, new Map())
    }
    const rowChanges = state.pendingChanges.get(rowKey)!
    
    // 如果改回原始值，移除该修改记录
    const existingChange = rowChanges.get(column)
    const originalVal = existingChange?.oldValue ?? oldValue
    if (originalVal === newValue) {
      rowChanges.delete(column)
      if (rowChanges.size === 0) {
        state.pendingChanges.delete(rowKey)
      }
    } else {
      rowChanges.set(column, { oldValue: originalVal, newValue })
    }
  }
  
  // 新增空行
  function addNewRow() {
    const tempId = `new_${Date.now()}_${Math.random().toString(36).slice(2)}`
    state.newRows.push({
      tempId,
      data: {}  // 空对象，用户自行填写
    })
    return tempId
  }
  
  // 更新新增行数据
  function updateNewRowData(tempId: string, column: string, value: unknown) {
    const row = state.newRows.find(r => r.tempId === tempId)
    if (row) {
      if (value === '' || value === null || value === undefined) {
        delete row.data[column]
      } else {
        row.data[column] = value
      }
    }
  }
  
  // 还原所有修改
  function revertAll() {
    state.pendingChanges.clear()
    state.newRows = []
    // 恢复原始数据
    if (state.originalData && options.resultSet.value) {
      options.resultSet.value.rows = JSON.parse(JSON.stringify(state.originalData))
    }
  }
  
  // 生成 DELETE SQL
  function generateDeleteSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs || !rs.primaryKeys?.length) return []
    
    const sqls: string[] = []
    const tableName = `\`${rs.databaseName}\`.\`${rs.tableName}\``
    
    state.selectedRowKeys.forEach(rowKey => {
      const rowIndex = parseInt(rowKey.split('_')[1] || rowKey)
      const row = rs.rows[rowIndex]
      if (!row) return
      
      const whereConditions = rs.primaryKeys!.map(pk => {
        const value = row[pk]
        return `\`${pk}\` = ${formatSqlValue(value)}`
      }).join(' AND ')
      
      sqls.push(`DELETE FROM ${tableName} WHERE ${whereConditions};`)
    })
    
    return sqls
  }
  
  // 生成 UPDATE SQL
  function generateUpdateSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs || !rs.primaryKeys?.length) return []
    
    const sqls: string[] = []
    const tableName = `\`${rs.databaseName}\`.\`${rs.tableName}\``
    
    state.pendingChanges.forEach((changes, rowKey) => {
      const rowIndex = parseInt(rowKey.split('_')[1] || rowKey)
      const row = rs.rows[rowIndex]
      if (!row) return
      
      const setClauses: string[] = []
      changes.forEach((change, column) => {
        setClauses.push(`\`${column}\` = ${formatSqlValue(change.newValue)}`)
      })
      
      const whereConditions = rs.primaryKeys!.map(pk => {
        const value = row[pk]
        return `\`${pk}\` = ${formatSqlValue(value)}`
      }).join(' AND ')
      
      sqls.push(`UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${whereConditions};`)
    })
    
    return sqls
  }
  
  // 生成 INSERT SQL
  function generateInsertSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs) return []
    
    const sqls: string[] = []
    const tableName = `\`${rs.databaseName}\`.\`${rs.tableName}\``
    
    state.newRows.forEach(newRow => {
      const columns = Object.keys(newRow.data)
      if (columns.length === 0) return  // 跳过完全空的行
      
      const columnNames = columns.map(c => `\`${c}\``).join(', ')
      const values = columns.map(c => formatSqlValue(newRow.data[c])).join(', ')
      
      sqls.push(`INSERT INTO ${tableName} (${columnNames}) VALUES (${values});`)
    })
    
    return sqls
  }
  
  // 执行删除
  async function executeDelete(): Promise<{ success: boolean; message?: string }> {
    const sqls = generateDeleteSQL()
    if (sqls.length === 0) {
      return { success: false, message: '没有要删除的数据' }
    }
    
    // 执行 SQL
    const result = await window.api.query.executeBatch(
      options.connectionId.value!,
      sqls
    )
    
    if (result.success) {
      // 清除选中状态
      state.selectedRowKeys.clear()
    }
    
    return result
  }
  
  // 执行提交（UPDATE + INSERT）
  async function executeSubmit(): Promise<{ success: boolean; message?: string }> {
    const updateSqls = generateUpdateSQL()
    const insertSqls = generateInsertSQL()
    const allSqls = [...updateSqls, ...insertSqls]
    
    if (allSqls.length === 0) {
      return { success: false, message: '没有要提交的修改' }
    }
    
    // 执行 SQL
    const result = await window.api.query.executeBatch(
      options.connectionId.value!,
      allSqls
    )
    
    if (result.success) {
      // 清除修改状态
      state.pendingChanges.clear()
      state.newRows = []
    }
    
    return result
  }
  
  // 获取行的唯一标识（基于主键或索引）
  function getRowKey(row: Record<string, unknown>, index: number): string {
    const rs = options.resultSet.value
    if (rs?.primaryKeys?.length) {
      return rs.primaryKeys.map(pk => String(row[pk])).join('_')
    }
    return `row_${index}`
  }
  
  // 检查单元格是否已修改
  function isCellModified(rowKey: string, column: string): boolean {
    return state.pendingChanges.get(rowKey)?.has(column) ?? false
  }
  
  // 检查行是否是新增行
  function isNewRow(tempId: string): boolean {
    return state.newRows.some(r => r.tempId === tempId)
  }
  
  return {
    // 状态
    state: readonly(state),
    
    // 计算属性
    canOperate,
    isJoinQuery,
    hasSelectedRows,
    hasChanges,
    operationButtonState,
    revertButtonEnabled,
    addButtonEnabled,
    
    // 方法
    initialize,
    toggleRowSelection,
    toggleAllSelection,
    recordChange,
    addNewRow,
    updateNewRowData,
    revertAll,
    generateDeleteSQL,
    generateUpdateSQL,
    generateInsertSQL,
    executeDelete,
    executeSubmit,
    getRowKey,
    isCellModified,
    isNewRow
  }
}

// 辅助函数：格式化 SQL 值
function formatSqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }
  if (value instanceof Date) {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`
  }
  // 字符串转义单引号
  return `'${String(value).replace(/'/g, "''")}'`
}
```

#### 2.1.2 `src/renderer/components/ConfirmSqlDialog.vue`

**职责**: SQL 预览确认对话框

```vue
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="confirm-dialog-content">
      <p class="warning-text">{{ warningText }}</p>
      <div class="sql-preview" :class="{ scrollable: sqls.length > 10 }">
        <pre><code>{{ sqls.join('\n') }}</code></pre>
      </div>
      <p class="count-text">共 {{ sqls.length }} 条语句</p>
    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认执行</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  type: 'delete' | 'update' | 'insert' | 'mixed'
  sqls: string[]
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

function handleConfirm() {
  emit('confirm')
  visible.value = false
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
  color: var(--el-color-warning);
  margin-bottom: 16px;
}

.sql-preview {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
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
}

.count-text {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 8px;
  text-align: right;
}
</style>
```

#### 2.1.3 `src/renderer/components/DataOperationsToolbar.vue`

**职责**: 数据操作工具栏组件，管理新增、还原、删除/提交等操作按钮

**设计说明**:
- 独立组件，便于后续扩展更多操作按钮
- 接收 `useDataOperations` 返回的数据操作对象
- 通过事件向父组件通知操作意图，具体执行由父组件控制

```vue
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
```

**扩展示例**（后续可能添加的功能）:

```vue
<!-- 父组件中使用插槽扩展 -->
<DataOperationsToolbar :data-ops="dataOps" @add-row="..." @revert="..." @operation="...">
  <template #extra>
    <!-- 分隔线 -->
    <div class="separator"></div>
    <!-- 导出选中行 -->
    <el-tooltip content="导出选中行" placement="top">
      <el-button :icon="Download" size="small" :disabled="!hasSelectedRows" />
    </el-tooltip>
    <!-- 复制选中行 -->
    <el-tooltip content="复制选中行" placement="top">
      <el-button :icon="CopyDocument" size="small" :disabled="!hasSelectedRows" />
    </el-tooltip>
  </template>
</DataOperationsToolbar>
```

---

### 2.2 修改文件

#### 2.2.1 `src/renderer/components/ResultPanel.vue`

**变更点**: 引入 DataOperationsToolbar 组件（工具栏逻辑已抽取到独立组件）

```diff
<template>
  <div class="result-panel" :class="{ collapsed: isCollapsed }">
    <div class="panel-header">
      <el-tabs v-model="activeTabId" type="card" @tab-remove="handleTabRemove">
        <!-- 标签页内容不变 -->
      </el-tabs>
      
+     <!-- 数据操作工具栏（独立组件） -->
+     <DataOperationsToolbar
+       v-if="showOperationsToolbar"
+       :data-ops="dataOps"
+       @add-row="handleAddRow"
+       @revert="handleRevert"
+       @operation="handleOperation"
+     />
      
      <!-- 导出按钮（保持不变） -->
      <div class="export-dropdown">
        <!-- ... -->
      </div>
    </div>
    
    <!-- 结果内容 -->
    <div class="panel-content">
      <ResultTable
        v-if="currentTab?.type === 'resultset'"
        :data="currentTab.data as QueryResultSet"
+       :data-operations="dataOps"
+       @cell-change="handleCellChange"
      />
      <!-- 其他内容不变 -->
    </div>
    
+   <!-- SQL 确认对话框 -->
+   <ConfirmSqlDialog
+     v-model="confirmDialog.visible"
+     :type="confirmDialog.type"
+     :sqls="confirmDialog.sqls"
+     @confirm="handleConfirmExecute"
+   />
  </div>
</template>

<script setup lang="ts">
+ import { useDataOperations } from '../composables/useDataOperations'
+ import DataOperationsToolbar from './DataOperationsToolbar.vue'
+ import ConfirmSqlDialog from './ConfirmSqlDialog.vue'

// ... 现有代码 ...

+ // 数据操作
+ const dataOps = useDataOperations({
+   resultSet: computed(() => currentResultSet.value),
+   connectionId: computed(() => editorStore.activeTab?.connectionId ?? null)
+ })

+ // 确认对话框状态
+ const confirmDialog = reactive({
+   visible: false,
+   type: 'delete' as 'delete' | 'update' | 'insert' | 'mixed',
+   sqls: [] as string[]
+ })

+ // 是否显示操作工具栏
+ const showOperationsToolbar = computed(() => {
+   return currentTab.value?.type === 'resultset'
+ })

+ // 新增行
+ function handleAddRow() {
+   const tempId = dataOps.addNewRow()
+   // ResultTable 会响应新增行
+ }

+ // 还原
+ function handleRevert() {
+   dataOps.revertAll()
+   ElMessage.info('已还原所有修改')
+ }

+ // 操作按钮点击（接收来自工具栏的操作类型）
+ function handleOperation(type: 'delete' | 'submit') {
+   if (type === 'delete') {
+     // 删除确认
+     confirmDialog.type = 'delete'
+     confirmDialog.sqls = dataOps.generateDeleteSQL()
+     confirmDialog.visible = true
+   } else {
+     // 提交确认
+     const updateSqls = dataOps.generateUpdateSQL()
+     const insertSqls = dataOps.generateInsertSQL()
+     confirmDialog.sqls = [...updateSqls, ...insertSqls]
+     if (updateSqls.length > 0 && insertSqls.length > 0) {
+       confirmDialog.type = 'mixed'
+     } else if (insertSqls.length > 0) {
+       confirmDialog.type = 'insert'
+     } else {
+       confirmDialog.type = 'update'
+     }
+     confirmDialog.visible = true
+   }
+ }

+ // 确认执行
+ async function handleConfirmExecute() {
+   const type = confirmDialog.type
+   let result: { success: boolean; message?: string }
+   
+   if (type === 'delete') {
+     result = await dataOps.executeDelete()
+   } else {
+     result = await dataOps.executeSubmit()
+   }
+   
+   if (result.success) {
+     ElMessage.success(type === 'delete' ? '删除成功' : '提交成功')
+     // 刷新数据 - 重新执行查询
+     await refreshData()
+   } else {
+     ElMessage.error(result.message || '操作失败')
+   }
+ }

+ // 单元格修改回调
+ function handleCellChange(rowKey: string, column: string, oldValue: unknown, newValue: unknown) {
+   dataOps.recordChange(rowKey, column, oldValue, newValue)
+ }

+ // 监听结果数据变化，初始化数据操作状态
+ watch(currentResultSet, (newVal) => {
+   if (newVal) {
+     dataOps.initialize(newVal)
+   }
+ })
</script>

+ <style scoped>
+ /* 无需新增工具栏样式，已移至 DataOperationsToolbar.vue */
+ </style>
```

#### 2.2.2 `src/renderer/components/ResultTable.vue`

**变更点**:
1. 新增复选框列
2. 修改回车行为（退出编辑而非保存）
3. 新增行展示
4. 修改标识样式

```diff
<script setup lang="ts">
+ import type { DataOperationsReturn } from '../composables/useDataOperations'

const props = defineProps<{
  data: QueryResultSet
+ dataOperations?: DataOperationsReturn
}>()

+ const emit = defineEmits<{
+   (e: 'cell-change', rowKey: string, column: string, oldValue: unknown, newValue: unknown): void
+ }>()

// ... 现有代码 ...

- // 回车确认编辑（修改）
- async function confirmEdit() {
-   if (!editingCell.value || !props.data.editable) return
-   
-   const { rowIndex, column } = editingCell.value
-   const row = props.data.rows[rowIndex]
-   
-   let newValue: unknown = editValue.value === '' ? null : editValue.value
-   if (newValue === originalValue.value) {
-     cancelEdit()
-     return
-   }
-   
-   // ... 执行 UPDATE ...
- }

+ // 回车退出编辑（不保存到数据库，只记录修改）
+ function confirmEdit() {
+   if (!editingCell.value) return
+   
+   const { rowIndex, column } = editingCell.value
+   const row = props.data.rows[rowIndex]
+   const rowKey = props.dataOperations?.getRowKey(row, rowIndex) ?? `row_${rowIndex}`
+   
+   let newValue: unknown = editValue.value === '' ? null : editValue.value
+   
+   // 如果值有变化，记录修改
+   if (newValue !== originalValue.value) {
+     // 更新本地数据显示
+     row[column] = newValue
+     // 通知父组件记录修改
+     emit('cell-change', rowKey, column, originalValue.value, newValue)
+   }
+   
+   // 退出编辑模式
+   cancelEdit()
+ }

+ // 检查单元格是否已修改
+ function isCellModified(row: Record<string, unknown>, column: string, rowIndex: number): boolean {
+   if (!props.dataOperations) return false
+   const rowKey = props.dataOperations.getRowKey(row, rowIndex)
+   return props.dataOperations.isCellModified(rowKey, column)
+ }

+ // 检查行是否是新增行
+ function isNewRow(row: Record<string, unknown>): boolean {
+   return row.__isNewRow === true
+ }

+ // 合并后的数据行（原有数据 + 新增行）
+ const allRows = computed(() => {
+   const rows = [...props.data.rows]
+   if (props.dataOperations) {
+     props.dataOperations.state.newRows.forEach(newRow => {
+       rows.push({
+         ...newRow.data,
+         __isNewRow: true,
+         __tempId: newRow.tempId
+       })
+     })
+   }
+   return rows
+ })

+ // 复选框是否禁用
+ const checkboxDisabled = computed(() => {
+   return !props.dataOperations?.canOperate.value
+ })

+ // 是否全选
+ const isAllSelected = computed(() => {
+   if (!props.dataOperations) return false
+   return props.dataOperations.state.selectedRowKeys.size === props.data.rows.length
+ })

+ // 切换行选择
+ function handleRowSelect(row: Record<string, unknown>, rowIndex: number, selected: boolean) {
+   if (!props.dataOperations) return
+   const rowKey = props.dataOperations.getRowKey(row, rowIndex)
+   props.dataOperations.toggleRowSelection(rowKey, selected)
+ }

+ // 全选/取消全选
+ function handleSelectAll(selected: boolean) {
+   props.dataOperations?.toggleAllSelection(selected)
+ }
</script>

<template>
  <div class="result-table">
    <!-- 表头 -->
    <div class="table-header-wrapper" ref="headerWrapperRef">
      <div class="table-header" :style="{ width: totalWidth + 'px' }">
+       <!-- 复选框列头 -->
+       <div class="header-cell checkbox-cell" style="width: 40px;">
+         <el-checkbox
+           :model-value="isAllSelected"
+           :disabled="checkboxDisabled"
+           @change="handleSelectAll"
+         />
+       </div>
        <!-- 数据列头 -->
        <div
          v-for="col in props.data.columns"
          :key="col.name"
          class="header-cell"
          :style="{ width: (columnWidths[col.name] || 150) + 'px' }"
        >
          <!-- ... 原有内容 ... -->
        </div>
      </div>
    </div>
    
    <!-- 表体 -->
    <div class="table-body" ref="scrollContainerRef">
      <div :style="{ height: rowVirtualizer.getTotalSize() + 'px', position: 'relative' }">
        <div
          v-for="virtualRow in rowVirtualizer.getVirtualItems()"
          :key="virtualRow.key"
          class="table-row"
+         :class="{
+           'new-row': isNewRow(allRows[virtualRow.index]),
+           'selected-row': props.dataOperations?.state.selectedRowKeys.has(
+             props.dataOperations.getRowKey(allRows[virtualRow.index], virtualRow.index)
+           )
+         }"
          :style="{ transform: `translateY(${virtualRow.start}px)` }"
        >
+         <!-- 复选框单元格 -->
+         <div class="table-cell checkbox-cell" style="width: 40px;">
+           <el-checkbox
+             v-if="!isNewRow(allRows[virtualRow.index])"
+             :model-value="props.dataOperations?.state.selectedRowKeys.has(
+               props.dataOperations.getRowKey(allRows[virtualRow.index], virtualRow.index)
+             )"
+             :disabled="checkboxDisabled"
+             @change="(val) => handleRowSelect(allRows[virtualRow.index], virtualRow.index, val as boolean)"
+           />
+         </div>
          <!-- 数据单元格 -->
          <div
            v-for="col in props.data.columns"
            :key="col.name"
            class="table-cell"
+           :class="{
+             'cell-modified': isCellModified(allRows[virtualRow.index], col.name, virtualRow.index)
+           }"
            :style="{ width: (columnWidths[col.name] || 150) + 'px' }"
            @dblclick="handleCellDblClick(allRows[virtualRow.index], col, virtualRow.index)"
          >
            <!-- ... 原有内容 ... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
+ /* 复选框列 */
+ .checkbox-cell {
+   display: flex;
+   align-items: center;
+   justify-content: center;
+   flex-shrink: 0;
+ }

+ /* 新增行样式 */
+ .new-row {
+   background-color: rgba(103, 194, 58, 0.1);
+ }
+ .new-row:hover {
+   background-color: rgba(103, 194, 58, 0.2);
+ }

+ /* 选中行样式 */
+ .selected-row {
+   background-color: rgba(64, 158, 255, 0.1);
+ }

+ /* 已修改单元格样式 */
+ .cell-modified {
+   position: relative;
+ }
+ .cell-modified::before {
+   content: '';
+   position: absolute;
+   left: 0;
+   top: 4px;
+   bottom: 4px;
+   width: 3px;
+   background-color: #e6a23c;
+   border-radius: 2px;
+ }
</style>
```

#### 2.2.3 `src/main/database/query-executor.ts`

**变更点**: 新增批量执行 SQL 方法

```diff
+ /**
+  * 批量执行 SQL 语句（用于删除、更新、新增）
+  */
+ export async function executeBatch(
+   connectionId: string,
+   sqls: string[]
+ ): Promise<{ success: boolean; message?: string; results?: { sql: string; affectedRows: number }[] }> {
+   const manager = ConnectionManager.getInstance()
+   const connection = manager.getConnection(connectionId)
+   
+   if (!connection) {
+     return { success: false, message: '连接不存在' }
+   }
+   
+   const results: { sql: string; affectedRows: number }[] = []
+   
+   try {
+     // 开启事务
+     await connection.beginTransaction()
+     
+     for (const sql of sqls) {
+       const [result] = await connection.query(sql)
+       const affectedRows = (result as { affectedRows?: number }).affectedRows ?? 0
+       results.push({ sql, affectedRows })
+     }
+     
+     // 提交事务
+     await connection.commit()
+     
+     return { success: true, results }
+   } catch (error) {
+     // 回滚事务
+     await connection.rollback()
+     
+     const message = error instanceof Error ? error.message : String(error)
+     return { success: false, message }
+   }
+ }
```

#### 2.2.4 `src/preload/index.ts`

**变更点**: 暴露批量执行 API

```diff
const api = {
  query: {
    execute: (connectionId: string, sql: string, maxRows: number, database?: string) =>
      ipcRenderer.invoke('query:execute', connectionId, sql, maxRows, database),
    updateCell: (connectionId: string, database: string, table: string, primaryKeys: any[], column: string, value: unknown) =>
      ipcRenderer.invoke('query:updateCell', connectionId, database, table, primaryKeys, column, value),
+   executeBatch: (connectionId: string, sqls: string[]) =>
+     ipcRenderer.invoke('query:executeBatch', connectionId, sqls),
  },
  // ...
}
```

#### 2.2.5 `src/main/ipc/query-handlers.ts`

**变更点**: 注册批量执行处理器

```diff
+ ipcMain.handle('query:executeBatch', async (_, connectionId: string, sqls: string[]) => {
+   return await executeBatch(connectionId, sqls)
+ })
```

---

## 3. 数据流图

### 3.1 删除流程

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  用户勾选行      │───►│  selectedRowKeys │───►│  删除按钮可用    │
└─────────────────┘    │  Set 状态更新     │    └─────────────────┘
                       └──────────────────┘            │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  执行成功       │◄───│  executeBatch    │◄───│  确认对话框      │
│  刷新数据       │    │  (事务)          │    │  显示 DELETE SQL │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3.2 修改流程

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  双击编辑       │───►│  editingCell     │───►│  回车退出编辑    │
└─────────────────┘    │  状态更新        │    └─────────────────┘
                       └──────────────────┘            │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  本地数据更新   │◄───│  pendingChanges  │◄───│  记录修改        │
│  显示橙色标记   │    │  Map 状态更新     │    │  (rowKey,column) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  执行成功       │◄───│  executeBatch    │◄───│  点击提交按钮    │
│  清除修改状态   │    │  (事务)          │    │  确认 UPDATE SQL │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3.3 新增流程

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  点击新增按钮   │───►│  newRows 数组     │───►│  表格显示新行    │
└─────────────────┘    │  添加空对象       │    │  浅绿色背景      │
                       └──────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  用户输入数据   │───►│  updateNewRowData │───►│  newRows.data    │
└─────────────────┘    │  更新指定单元格   │    │  更新字段值      │
                       └──────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  执行成功       │◄───│  executeBatch    │◄───│  点击提交按钮    │
│  刷新数据       │    │  (事务)          │    │  确认 INSERT SQL │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 4. 接口设计

### 4.1 IPC 接口

| 接口 | 方法 | 参数 | 返回 |
|------|------|------|------|
| `query:executeBatch` | POST | `connectionId: string, sqls: string[]` | `{ success: boolean, message?: string, results?: { sql: string, affectedRows: number }[] }` |

### 4.2 组件 Props

#### ResultTable.vue

```typescript
interface Props {
  data: QueryResultSet
  dataOperations?: DataOperationsReturn  // 可选，不传则禁用操作功能
}
```

#### ConfirmSqlDialog.vue

```typescript
interface Props {
  modelValue: boolean  // 对话框可见性
  type: 'delete' | 'update' | 'insert' | 'mixed'
  sqls: string[]
}
```

#### DataOperationsToolbar.vue

```typescript
interface Props {
  dataOps: UseDataOperationsReturn  // useDataOperations 返回值
}
```

### 4.3 Emits

#### ResultTable.vue

```typescript
interface Emits {
  (e: 'cell-change', rowKey: string, column: string, oldValue: unknown, newValue: unknown): void
}
```

#### ConfirmSqlDialog.vue

```typescript
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}
```

#### DataOperationsToolbar.vue

```typescript
interface Emits {
  (e: 'add-row'): void      // 新增行按钮点击
  (e: 'revert'): void       // 还原按钮点击
  (e: 'operation', type: 'delete' | 'submit'): void  // 操作按钮点击
}
```

### 4.4 插槽

#### DataOperationsToolbar.vue

```typescript
interface Slots {
  extra?: () => VNode[]  // 扩展按钮插槽，用于后续添加更多操作按钮
}
```

---

## 5. 状态管理

### 5.1 useDataOperations 状态

```typescript
interface DataOperationsState {
  // 选中行 Key 集合
  selectedRowKeys: Set<string>
  
  // 待提交修改
  // Map<rowKey, Map<column, { oldValue, newValue }>>
  pendingChanges: Map<string, Map<string, { oldValue: unknown; newValue: unknown }>>
  
  // 新增行列表
  newRows: Array<{
    tempId: string
    data: Record<string, unknown>
  }>
  
  // 原始数据快照（用于还原）
  originalData: Record<string, unknown>[] | null
}
```

### 5.2 状态生命周期

```
查询执行完成
    │
    ▼
initialize()
    │ 清空 selectedRowKeys
    │ 清空 pendingChanges
    │ 清空 newRows
    │ 保存 originalData
    ▼
用户操作...
    │
    ├─► 勾选行 → selectedRowKeys.add/delete
    ├─► 编辑单元格 → pendingChanges.set
    ├─► 新增行 → newRows.push
    └─► 还原 → revertAll()
         │ 清空 pendingChanges
         │ 清空 newRows
         │ 恢复 originalData
    │
    ▼
执行成功
    │
    ▼
刷新数据（重新执行查询）
    │
    ▼
initialize() (新一轮)
```

---

## 6. UI 交互设计

### 6.1 工具栏布局

```
┌──────────────────────────────────────────────────────────────────┐
│ [结果] [消息]        [+] [↩] [🗑️/✓]           [导出▼]           │
│                      ^^^ 数据操作按钮
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 按钮状态矩阵

| 场景 | 新增 | 还原 | 删除/提交 |
|------|------|------|-----------|
| 无主键 | 禁用 | 禁用 | 禁用 |
| 联表查询 | 禁用 | 禁用 | 禁用 |
| 单表有主键，无选中无修改 | 可用 | 禁用 | 禁用 |
| 单表有主键，有选中 | 可用 | 禁用 | 删除模式 |
| 单表有主键，有修改 | 可用 | 可用 | 提交模式 |
| 单表有主键，有选中+有修改 | 可用 | 可用 | 删除模式（优先） |

### 6.3 视觉标识

| 元素 | 样式 |
|------|------|
| 新增行 | 浅绿色背景 `rgba(103, 194, 58, 0.1)` |
| 选中行 | 浅蓝色背景 `rgba(64, 158, 255, 0.1)` |
| 已修改单元格 | 左边框橙色标记 `#e6a23c` |
| 禁用复选框 | 灰色，鼠标为 not-allowed |

---

## 7. 错误处理

### 7.1 前端错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| 无连接 | 按钮禁用 |
| 无主键 | 按钮禁用 + tooltip 说明 |
| 联表查询 | 按钮禁用 + tooltip 说明 |
| 执行失败 | ElMessage.error 显示错误信息 |

### 7.2 后端错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| 连接断开 | 返回 `{ success: false, message: '连接不存在' }` |
| SQL 执行错误 | 事务回滚，返回 MySQL 原始错误信息 |
| 影响行数异常 | 返回警告信息 |

---

## 8. 测试要点

### 8.1 单元测试

- [ ] `useDataOperations` - 状态管理逻辑
- [ ] `formatSqlValue` - SQL 值格式化
- [ ] `generateDeleteSQL` - DELETE 语句生成
- [ ] `generateUpdateSQL` - UPDATE 语句生成
- [ ] `generateInsertSQL` - INSERT 语句生成

### 8.2 集成测试

- [ ] 删除流程：勾选 → 确认 → 执行 → 刷新
- [ ] 修改流程：编辑 → 回车 → 提交 → 执行 → 刷新
- [ ] 新增流程：新增 → 输入 → 提交 → 执行 → 刷新
- [ ] 还原流程：修改 → 还原 → 恢复原始数据
- [ ] 事务回滚：部分 SQL 执行失败时回滚

### 8.3 边界测试

- [ ] 无主键查询
- [ ] 联表查询
- [ ] 复合主键
- [ ] NULL 值处理
- [ ] 特殊字符转义（单引号等）
- [ ] 大批量操作（100+ 行）

---

## 9. 开发计划

### 9.1 任务拆分

| 序号 | 任务 | 预估工时 | 依赖 |
|------|------|----------|------|
| 1 | 新增 `useDataOperations.ts` | 4h | - |
| 2 | 新增 `ConfirmSqlDialog.vue` | 2h | - |
| 3 | 新增 `DataOperationsToolbar.vue` | 1.5h | 1 |
| 4 | 修改 `ResultTable.vue` - 复选框列 | 2h | 1 |
| 5 | 修改 `ResultTable.vue` - 回车行为 | 1h | 1 |
| 6 | 修改 `ResultTable.vue` - 新增行展示 | 2h | 1 |
| 7 | 修改 `ResultTable.vue` - 修改标识 | 1h | 1 |
| 8 | 修改 `ResultPanel.vue` - 集成工具栏 | 2h | 2,3 |
| 9 | 修改 `query-executor.ts` - 批量执行 | 2h | - |
| 10 | 修改 `preload/index.ts` - API 暴露 | 0.5h | 9 |
| 11 | 修改 IPC handlers - 注册处理器 | 0.5h | 9 |
| 12 | 联调测试 | 4h | 1-11 |
| 13 | Bug 修复 | 2h | 12 |

**总预估**: 24.5h

### 9.2 开发顺序

```
阶段1: 基础设施（并行）
├── 任务1: useDataOperations.ts
├── 任务2: ConfirmSqlDialog.vue
└── 任务9-11: 后端批量执行 API

阶段2: 前端集成（串行）
├── 任务3: DataOperationsToolbar.vue（新增）
├── 任务4: 复选框列
├── 任务5: 回车行为变更
├── 任务6: 新增行展示
├── 任务7: 修改标识
└── 任务8: ResultPanel 集成

阶段3: 测试与修复
├── 任务12: 联调测试
└── 任务13: Bug 修复
```

---

## 10. 风险评估

| 风险 | 等级 | 应对措施 |
|------|------|----------|
| 虚拟滚动与复选框联动 | 中 | 使用 rowKey 而非 index 标识 |
| 大批量 SQL 执行超时 | 中 | 事务分批提交 + 进度提示 |
| 并发修改冲突 | 低 | 乐观锁或提示用户刷新 |
| 数据类型转换错误 | 中 | 复用现有 formatters |

---

## 11. 附录

### 11.1 相关文件清单

| 文件 | 类型 | 说明 |
|------|------|------|
| `src/renderer/composables/useDataOperations.ts` | 新增 | 数据操作核心逻辑 |
| `src/renderer/components/ConfirmSqlDialog.vue` | 新增 | SQL 确认对话框 |
| `src/renderer/components/DataOperationsToolbar.vue` | 新增 | 数据操作工具栏组件 |
| `src/renderer/components/ResultTable.vue` | 修改 | 结果表格组件 |
| `src/renderer/components/ResultPanel.vue` | 修改 | 结果面板组件 |
| `src/main/database/query-executor.ts` | 修改 | 新增批量执行方法 |
| `src/preload/index.ts` | 修改 | 暴露批量执行 API |
| `src/main/ipc/query-handlers.ts` | 修改 | 注册 IPC 处理器 |

### 11.2 类型定义扩展

```typescript
// src/shared/types/query.ts 扩展

// 批量执行结果
export interface BatchExecuteResult {
  success: boolean
  message?: string
  results?: Array<{
    sql: string
    affectedRows: number
  }>
}
```
