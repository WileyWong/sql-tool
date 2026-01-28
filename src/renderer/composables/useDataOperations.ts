import { reactive, computed, readonly, type Ref, type ComputedRef } from 'vue'
import type { QueryResultSet } from '@shared/types'

/**
 * 数据操作状态
 */
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

/**
 * 数据操作选项
 */
export interface DataOperationsOptions {
  // 结果集数据（响应式）
  resultSet: Ref<QueryResultSet | null>
  // 连接ID
  connectionId: Ref<string | null>
}

/**
 * useDataOperations 返回值类型
 */
export interface UseDataOperationsReturn {
  // 状态
  state: Readonly<DataOperationsState>
  
  // 计算属性
  canOperate: ComputedRef<boolean>
  isJoinQuery: ComputedRef<boolean>
  hasSelectedRows: ComputedRef<boolean>
  hasChanges: ComputedRef<boolean>
  operationButtonState: ComputedRef<{ mode: 'delete' | 'submit'; enabled: boolean; tooltip: string }>
  revertButtonEnabled: ComputedRef<boolean>
  addButtonEnabled: ComputedRef<boolean>
  
  // 方法
  initialize: (data: QueryResultSet) => void
  toggleRowSelection: (rowKey: string, selected: boolean) => void
  toggleAllSelection: (selected: boolean) => void
  recordChange: (rowKey: string, column: string, oldValue: unknown, newValue: unknown) => void
  addNewRow: () => string
  updateNewRowData: (tempId: string, column: string, value: unknown) => void
  revertAll: () => void
  generateDeleteSQL: () => string[]
  generateUpdateSQL: () => string[]
  generateInsertSQL: () => string[]
  executeDelete: () => Promise<{ success: boolean; message?: string; deletedRowKeys?: string[] }>
  executeSubmit: () => Promise<{ success: boolean; message?: string; committedNewRows?: Array<{ tempId: string; data: Record<string, unknown> }> }>
  applyChangesToLocalData: () => void
  getRowKey: (row: Record<string, unknown>, index: number) => string
  isCellModified: (rowKey: string, column: string) => boolean
  isNewRow: (tempId: string) => boolean
}

/**
 * 数据操作逻辑 Composable
 * 管理选中行、修改跟踪、新增行、SQL 生成等逻辑
 */
export function useDataOperations(options: DataOperationsOptions): UseDataOperationsReturn {
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
      return { mode: 'delete' as const, enabled: true, tooltip: '删除选中行' }
    }
    if (hasChanges.value) {
      return { mode: 'submit' as const, enabled: true, tooltip: '提交修改' }
    }
    return { mode: 'submit' as const, enabled: false, tooltip: '无修改' }
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
  function addNewRow(): string {
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
    state.selectedRowKeys.clear()
    // 注意：不恢复 originalData，因为那是原始查询结果
  }
  
  // 将 pending changes 应用到本地数据（提交成功后调用）
  function applyChangesToLocalData() {
    const rs = options.resultSet.value
    if (!rs) return
    
    // 应用 UPDATE 修改到本地数据
    for (const [rowKey, changes] of state.pendingChanges) {
      const row = findRowByKey(rowKey)
      if (!row) continue
      
      for (const [column, change] of changes) {
        row[column] = change.newValue
      }
    }
  }
  
  // 生成 DELETE SQL 语句
  function generateDeleteSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs || !rs.tableName || !rs.databaseName || !rs.primaryKeys?.length) return []
    
    const sqls: string[] = []
    
    for (const rowKey of state.selectedRowKeys) {
      // 从 rowKey 解析主键值
      const row = findRowByKey(rowKey)
      if (!row) continue
      
      // 构建 WHERE 条件
      const whereConditions = rs.primaryKeys!.map(pk => {
        const value = row[pk]
        return `\`${pk}\` = ${formatSqlValue(value)}`
      }).join(' AND ')
      
      const sql = `DELETE FROM \`${rs.databaseName}\`.\`${rs.tableName}\` WHERE ${whereConditions};`
      sqls.push(sql)
    }
    
    return sqls
  }
  
  // 生成 UPDATE SQL 语句
  function generateUpdateSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs || !rs.tableName || !rs.databaseName || !rs.primaryKeys?.length) return []
    
    const sqls: string[] = []
    
    for (const [rowKey, changes] of state.pendingChanges) {
      const row = findRowByKey(rowKey)
      if (!row || changes.size === 0) continue
      
      // 构建 SET 子句
      const setClauses: string[] = []
      for (const [column, change] of changes) {
        setClauses.push(`\`${column}\` = ${formatSqlValue(change.newValue)}`)
      }
      
      // 构建 WHERE 条件（使用主键）
      const whereConditions = rs.primaryKeys!.map(pk => {
        const value = row[pk]
        return `\`${pk}\` = ${formatSqlValue(value)}`
      }).join(' AND ')
      
      const sql = `UPDATE \`${rs.databaseName}\`.\`${rs.tableName}\` SET ${setClauses.join(', ')} WHERE ${whereConditions};`
      sqls.push(sql)
    }
    
    return sqls
  }
  
  // 生成 INSERT SQL 语句
  function generateInsertSQL(): string[] {
    const rs = options.resultSet.value
    if (!rs || !rs.tableName || !rs.databaseName) return []
    
    const sqls: string[] = []
    
    for (const newRow of state.newRows) {
      if (Object.keys(newRow.data).length === 0) continue
      
      const columns = Object.keys(newRow.data)
      const values = columns.map(col => formatSqlValue(newRow.data[col]))
      
      const sql = `INSERT INTO \`${rs.databaseName}\`.\`${rs.tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${values.join(', ')});`
      sqls.push(sql)
    }
    
    return sqls
  }
  
  // 执行删除
  async function executeDelete(): Promise<{ success: boolean; message?: string; deletedRowKeys?: string[] }> {
    const sqls = generateDeleteSQL()
    if (sqls.length === 0) {
      return { success: false, message: '没有要删除的行' }
    }
    
    // 保存当前选中的行 keys（用于后续从界面移除）
    const deletedRowKeys = Array.from(state.selectedRowKeys)
    
    // 执行 SQL
    const result = await window.api.query.executeBatch(
      options.connectionId.value!,
      sqls
    )
    
    if (result.success) {
      // 清除选中状态
      state.selectedRowKeys.clear()
    }
    
    return {
      ...result,
      deletedRowKeys
    }
  }
  
  // 执行提交（UPDATE + INSERT）
  async function executeSubmit(): Promise<{ success: boolean; message?: string; committedNewRows?: Array<{ tempId: string; data: Record<string, unknown> }> }> {
    const updateSqls = generateUpdateSQL()
    const insertSqls = generateInsertSQL()
    const allSqls = [...updateSqls, ...insertSqls]
    
    if (allSqls.length === 0) {
      return { success: false, message: '没有要提交的修改' }
    }
    
    // 保存已提交的新行数据（用于更新UI）
    const committedNewRows = [...state.newRows]
    
    // 执行 SQL
    const result = await window.api.query.executeBatch(
      options.connectionId.value!,
      allSqls
    )
    
    if (result.success) {
      // 先将修改应用到本地数据（在清空 pendingChanges 之前）
      applyChangesToLocalData()
      // 再清除修改状态
      state.pendingChanges.clear()
      state.newRows = []
    }
    
    return {
      ...result,
      committedNewRows
    }
  }
  
  // 获取行的唯一标识（基于主键或索引）
  function getRowKey(row: Record<string, unknown>, index: number): string {
    const rs = options.resultSet.value
    if (rs?.primaryKeys?.length) {
      return rs.primaryKeys.map(pk => String(row[pk])).join('_')
    }
    return `row_${index}`
  }
  
  // 根据 rowKey 查找行数据
  function findRowByKey(rowKey: string): Record<string, unknown> | null {
    const rs = options.resultSet.value
    if (!rs) return null
    
    for (let i = 0; i < rs.rows.length; i++) {
      if (getRowKey(rs.rows[i], i) === rowKey) {
        return rs.rows[i]
      }
    }
    return null
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
    state: readonly(state) as Readonly<DataOperationsState>,
    
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
    applyChangesToLocalData,
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
