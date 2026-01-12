<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="1100px"
    :close-on-click-modal="false"
    @close="handleClose"
    class="table-design-dialog"
  >
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    
    <div v-else class="design-container">
      <!-- 表基本信息 -->
      <div class="table-info-section">
        <el-form :model="tableForm" label-width="80px" inline>
          <el-form-item label="表名" required>
            <el-input v-model="tableForm.name" placeholder="请输入表名" style="width: 200px" />
          </el-form-item>
          <el-form-item label="引擎">
            <el-select v-model="tableForm.engine" placeholder="选择引擎" style="width: 120px">
              <el-option
                v-for="e in engines"
                :key="e.engine"
                :label="e.engine"
                :value="e.engine"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字符集">
            <el-select v-model="tableForm.charset" placeholder="选择字符集" style="width: 140px" @change="handleCharsetChange">
              <el-option
                v-for="c in charsets"
                :key="c.charset"
                :label="c.charset"
                :value="c.charset"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序规则">
            <el-select v-model="tableForm.collation" placeholder="选择排序规则" style="width: 200px">
              <el-option
                v-for="c in filteredCollations"
                :key="c.collation"
                :label="c.collation"
                :value="c.collation"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="注释">
            <el-input v-model="tableForm.comment" placeholder="表注释" style="width: 200px" />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 页签：列定义 / 索引定义 -->
      <el-tabs v-model="activeTab" class="design-tabs">
        <!-- 列定义 -->
        <el-tab-pane label="列定义" name="columns">
          <div class="columns-toolbar">
            <el-button size="small" type="primary" @click="addColumn">
              <el-icon><Plus /></el-icon> 添加列
            </el-button>
            <el-button size="small" type="danger" @click="removeSelectedColumns" :disabled="selectedColumns.length === 0">
              <el-icon><Delete /></el-icon> 删除选中
            </el-button>
          </div>
          
          <el-table
            :data="tableForm.columns"
            stripe
            border
            size="small"
            class="columns-table"
            max-height="300"
            @selection-change="handleColumnSelectionChange"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column label="列名" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.name" size="small" placeholder="列名" />
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                <el-select v-model="row.type" size="small" filterable @change="handleTypeChange(row)">
                  <el-option-group
                    v-for="(types, group) in dataTypeGroups"
                    :key="group"
                    :label="group"
                  >
                    <el-option
                      v-for="t in types"
                      :key="t"
                      :label="t"
                      :value="t"
                    />
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="长度" width="80">
              <template #default="{ row }">
                <el-input-number
                  v-if="typeNeedsLength(row.type)"
                  v-model="row.length"
                  size="small"
                  :min="1"
                  :controls="false"
                  style="width: 100%"
                />
                <span v-else class="disabled-cell">-</span>
              </template>
            </el-table-column>
            <el-table-column label="小数" width="70">
              <template #default="{ row }">
                <el-input-number
                  v-if="typeNeedsDecimals(row.type)"
                  v-model="row.decimals"
                  size="small"
                  :min="0"
                  :controls="false"
                  style="width: 100%"
                />
                <span v-else class="disabled-cell">-</span>
              </template>
            </el-table-column>
            <el-table-column label="非空" width="60" align="center">
              <template #default="{ row }">
                <el-checkbox v-model="row.notNull" />
              </template>
            </el-table-column>
            <el-table-column label="主键" width="60" align="center">
              <template #default="{ row }">
                <el-checkbox v-model="row.primaryKey" @change="handlePrimaryKeyChange(row)" />
              </template>
            </el-table-column>
            <el-table-column label="自增" width="60" align="center">
              <template #default="{ row }">
                <el-checkbox v-model="row.autoIncrement" :disabled="!row.primaryKey" />
              </template>
            </el-table-column>
            <el-table-column label="无符号" width="70" align="center">
              <template #default="{ row }">
                <el-checkbox v-if="typeSupportsUnsigned(row.type)" v-model="row.unsigned" />
                <span v-else class="disabled-cell">-</span>
              </template>
            </el-table-column>
            <el-table-column label="默认值" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.defaultValue" size="small" placeholder="默认值" />
              </template>
            </el-table-column>
            <el-table-column label="注释" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.comment" size="small" placeholder="注释" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <!-- 索引定义 -->
        <el-tab-pane label="索引定义" name="indexes">
          <div class="indexes-toolbar">
            <el-button size="small" type="primary" @click="addIndex">
              <el-icon><Plus /></el-icon> 添加索引
            </el-button>
            <el-button size="small" type="danger" @click="removeSelectedIndexes" :disabled="selectedIndexes.length === 0">
              <el-icon><Delete /></el-icon> 删除选中
            </el-button>
          </div>
          
          <el-table
            :data="tableForm.indexes"
            stripe
            border
            size="small"
            class="indexes-table"
            max-height="300"
            @selection-change="handleIndexSelectionChange"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column label="索引名" min-width="150">
              <template #default="{ row }">
                <el-input v-model="row.name" size="small" placeholder="索引名" :disabled="row.type === 'PRIMARY'" />
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                <el-select v-model="row.type" size="small" :disabled="row.type === 'PRIMARY'">
                  <el-option label="PRIMARY" value="PRIMARY" />
                  <el-option label="UNIQUE" value="UNIQUE" />
                  <el-option label="INDEX" value="INDEX" />
                  <el-option label="FULLTEXT" value="FULLTEXT" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="列" min-width="250">
              <template #default="{ row }">
                <el-select
                  v-model="row.columnNames"
                  multiple
                  size="small"
                  placeholder="选择列"
                  style="width: 100%"
                >
                  <el-option
                    v-for="col in tableForm.columns.filter(c => c.name)"
                    :key="col.name"
                    :label="col.name"
                    :value="col.name"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <!-- SQL 预览 -->
      <div class="sql-preview-section">
        <div class="preview-header">
          <span>SQL 预览</span>
          <el-button size="small" text @click="refreshPreview">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
        <pre class="sql-preview">{{ generatedSql }}</pre>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleExecute" :loading="executing">
          {{ isEditMode ? '修改表' : '创建表' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { useConnectionStore } from '../stores/connection'
import { MySQLDataTypes, typeNeedsLength, typeNeedsDecimals, typeSupportsUnsigned } from '@shared/types/database'

const connectionStore = useConnectionStore()

// 对话框可见性
const visible = computed({
  get: () => connectionStore.tableDesignDialogVisible,
  set: (val) => {
    if (!val) connectionStore.closeTableDesignDialog()
  }
})

// 是否编辑模式
const isEditMode = computed(() => connectionStore.tableDesignMode === 'edit')

// 对话框标题
const dialogTitle = computed(() => {
  const info = connectionStore.tableDesignInfo
  if (!info) return '表设计'
  if (isEditMode.value) {
    return `修改表 - ${info.database}.${info.table}`
  }
  return `创建表 - ${info.database}`
})

// 当前激活的页签
const activeTab = ref('columns')

// 加载状态
const loading = ref(false)
const executing = ref(false)

// 字符集、排序规则、引擎列表
const charsets = ref<{ charset: string; defaultCollation: string; description: string }[]>([])
const collations = ref<{ collation: string; charset: string; isDefault: boolean }[]>([])
const engines = ref<{ engine: string; support: string; comment: string; isDefault: boolean }[]>([])

// 根据选中的字符集过滤排序规则
const filteredCollations = computed(() => {
  if (!tableForm.charset) return collations.value
  return collations.value.filter(c => c.charset === tableForm.charset)
})

// 数据类型分组
const dataTypeGroups = {
  '整数': MySQLDataTypes.INTEGER,
  '浮点': MySQLDataTypes.FLOAT,
  '字符串': MySQLDataTypes.STRING,
  '二进制': MySQLDataTypes.BINARY,
  '日期时间': MySQLDataTypes.DATETIME,
  '其他': MySQLDataTypes.OTHER
}

// 用于生成唯一 key
let columnKeyCounter = 0
let indexKeyCounter = 0

function generateColumnKey(): string {
  return `col_${++columnKeyCounter}_${Date.now()}`
}

function generateIndexKey(): string {
  return `idx_${++indexKeyCounter}_${Date.now()}`
}

// 列表单项类型
interface ColumnFormItem {
  _key: string  // 唯一标识，用于跟踪列的变化
  name: string
  type: string
  length?: number
  decimals?: number
  notNull: boolean
  primaryKey: boolean
  autoIncrement: boolean
  unsigned: boolean
  defaultValue: string
  comment: string
}

// 索引表单项类型
interface IndexFormItem {
  _key: string  // 唯一标识，用于跟踪索引的变化
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT'
  columnNames: string[]
}

// 表单数据
const tableForm = reactive<{
  name: string
  engine: string
  charset: string
  collation: string
  comment: string
  columns: ColumnFormItem[]
  indexes: IndexFormItem[]
}>({
  name: '',
  engine: '',
  charset: '',
  collation: '',
  comment: '',
  columns: [],
  indexes: []
})

// 选中的列和索引
const selectedColumns = ref<ColumnFormItem[]>([])
const selectedIndexes = ref<IndexFormItem[]>([])

// 原始表结构（用于编辑模式对比生成 ALTER 语句）
const originalColumns = ref<ColumnFormItem[]>([])
const originalIndexes = ref<IndexFormItem[]>([])
const originalTableName = ref('')

// 生成的 SQL
const generatedSql = ref('')

// 监听对话框打开
watch(() => connectionStore.tableDesignDialogVisible, async (newVal) => {
  if (newVal && connectionStore.tableDesignInfo) {
    await initDialog()
  }
})

// 监听表单变化，自动刷新 SQL 预览
watch(
  () => [
    tableForm.name,
    tableForm.engine,
    tableForm.charset,
    tableForm.collation,
    tableForm.comment,
    JSON.stringify(tableForm.columns),
    JSON.stringify(tableForm.indexes)
  ],
  () => {
    if (!loading.value) {
      refreshPreview()
    }
  },
  { deep: false }
)

// 初始化对话框
async function initDialog() {
  loading.value = true
  const info = connectionStore.tableDesignInfo!
  
  try {
    // 重置表单
    resetForm()
    
    // 并行加载元数据
    const [charsetsResult, collationsResult, enginesResult, defaultCharsetResult] = await Promise.all([
      connectionStore.getCharsets(info.connectionId),
      connectionStore.getCollations(info.connectionId),
      connectionStore.getEngines(info.connectionId),
      connectionStore.getDefaultCharset(info.connectionId, info.database)
    ])
    
    if (charsetsResult.success && charsetsResult.charsets) {
      charsets.value = charsetsResult.charsets
    }
    if (collationsResult.success && collationsResult.collations) {
      collations.value = collationsResult.collations
    }
    if (enginesResult.success && enginesResult.engines) {
      engines.value = enginesResult.engines
      // 设置默认引擎
      const defaultEngine = enginesResult.engines.find(e => e.isDefault)
      if (defaultEngine) {
        tableForm.engine = defaultEngine.engine
      }
    }
    if (defaultCharsetResult.success) {
      tableForm.charset = defaultCharsetResult.charset || 'utf8mb4'
      tableForm.collation = defaultCharsetResult.collation || 'utf8mb4_general_ci'
    }
    
    // 如果是编辑模式，加载现有表结构
    if (isEditMode.value && info.table) {
      await loadExistingTable(info.connectionId, info.database, info.table)
    } else {
      // 创建模式，添加一个默认列
      addColumn()
    }
    
    // 刷新 SQL 预览
    refreshPreview()
  } finally {
    loading.value = false
  }
}

// 重置表单
function resetForm() {
  tableForm.name = ''
  tableForm.engine = ''
  tableForm.charset = ''
  tableForm.collation = ''
  tableForm.comment = ''
  tableForm.columns = []
  tableForm.indexes = []
  selectedColumns.value = []
  selectedIndexes.value = []
  originalColumns.value = []
  originalIndexes.value = []
  originalTableName.value = ''
  generatedSql.value = ''
  activeTab.value = 'columns'
}

// 加载现有表结构
async function loadExistingTable(connectionId: string, database: string, table: string) {
  tableForm.name = table
  originalTableName.value = table
  
  // 加载列信息
  const columnsResult = await window.api.database.columns(connectionId, database, table)
  if (columnsResult.success && columnsResult.columns) {
    const parsedColumns = columnsResult.columns.map((col: { 
      name: string
      type: string
      columnType: string
      nullable: boolean
      primaryKey: boolean
      autoIncrement: boolean
      defaultValue?: string
      comment?: string
    }) => {
      // 解析列类型获取长度和小数位
      const typeMatch = col.columnType.match(/^(\w+)(?:\((\d+)(?:,(\d+))?\))?/)
      const baseType = typeMatch ? typeMatch[1].toUpperCase() : col.type.toUpperCase()
      const length = typeMatch && typeMatch[2] ? parseInt(typeMatch[2]) : undefined
      const decimals = typeMatch && typeMatch[3] ? parseInt(typeMatch[3]) : undefined
      const unsigned = col.columnType.toLowerCase().includes('unsigned')
      
      const key = generateColumnKey()
      return {
        _key: key,
        name: col.name,
        type: baseType,
        length,
        decimals,
        notNull: !col.nullable,
        primaryKey: col.primaryKey,
        autoIncrement: col.autoIncrement,
        unsigned,
        defaultValue: col.defaultValue || '',
        comment: col.comment || ''
      }
    })
    
    tableForm.columns = parsedColumns
    // 深拷贝保存原始列结构（保留 _key 用于匹配）
    originalColumns.value = JSON.parse(JSON.stringify(parsedColumns))
  }
  
  // 加载索引信息
  const indexesResult = await connectionStore.getTableIndexes(connectionId, database, table)
  if (indexesResult.success && indexesResult.indexes) {
    const parsedIndexes = indexesResult.indexes
      .filter(idx => idx.type !== 'SPATIAL') // 暂不支持 SPATIAL
      .map(idx => {
        const key = generateIndexKey()
        return {
          _key: key,
          name: idx.name,
          type: idx.type as 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT',
          columnNames: idx.columns.map(c => c.columnName)
        }
      })
    
    tableForm.indexes = parsedIndexes
    // 深拷贝保存原始索引结构（保留 _key 用于匹配）
    originalIndexes.value = JSON.parse(JSON.stringify(parsedIndexes))
  }
}

// 添加列
function addColumn() {
  tableForm.columns.push({
    _key: generateColumnKey(),
    name: '',
    type: 'VARCHAR',
    length: 255,
    decimals: undefined,
    notNull: false,
    primaryKey: false,
    autoIncrement: false,
    unsigned: false,
    defaultValue: '',
    comment: ''
  })
}

// 删除选中的列
function removeSelectedColumns() {
  tableForm.columns = tableForm.columns.filter(c => !selectedColumns.value.includes(c))
  selectedColumns.value = []
}

// 处理列选择变化
function handleColumnSelectionChange(selection: ColumnFormItem[]) {
  selectedColumns.value = selection
}

// 处理类型变化
function handleTypeChange(row: ColumnFormItem) {
  // 根据类型设置默认长度
  if (row.type === 'VARCHAR' && !row.length) {
    row.length = 255
  } else if (row.type === 'INT' && !row.length) {
    row.length = 11
  } else if (row.type === 'DECIMAL') {
    if (!row.length) row.length = 10
    if (!row.decimals) row.decimals = 2
  }
  
  // 清除不适用的属性
  if (!typeNeedsLength(row.type)) {
    row.length = undefined
  }
  if (!typeNeedsDecimals(row.type)) {
    row.decimals = undefined
  }
  if (!typeSupportsUnsigned(row.type)) {
    row.unsigned = false
  }
  
  refreshPreview()
}

// 处理主键变化
function handlePrimaryKeyChange(row: ColumnFormItem) {
  if (!row.primaryKey) {
    row.autoIncrement = false
  }
  refreshPreview()
}

// 添加索引
function addIndex() {
  tableForm.indexes.push({
    _key: generateIndexKey(),
    name: `idx_${tableForm.indexes.length + 1}`,
    type: 'INDEX',
    columnNames: []
  })
}

// 删除选中的索引
function removeSelectedIndexes() {
  tableForm.indexes = tableForm.indexes.filter(i => !selectedIndexes.value.includes(i))
  selectedIndexes.value = []
}

// 处理索引选择变化
function handleIndexSelectionChange(selection: IndexFormItem[]) {
  selectedIndexes.value = selection
}

// 处理字符集变化
function handleCharsetChange() {
  // 自动选择默认排序规则
  const defaultCollation = charsets.value.find(c => c.charset === tableForm.charset)?.defaultCollation
  if (defaultCollation) {
    tableForm.collation = defaultCollation
  }
  refreshPreview()
}

// 刷新 SQL 预览
function refreshPreview() {
  generatedSql.value = generateSQL()
}

// 生成 SQL
function generateSQL(): string {
  if (!tableForm.name) return '-- 请输入表名'
  if (tableForm.columns.length === 0) return '-- 请添加至少一列'
  
  const info = connectionStore.tableDesignInfo
  if (!info) return ''
  
  if (isEditMode.value) {
    return generateAlterSQL(info.database)
  } else {
    return generateCreateSQL(info.database)
  }
}

// 生成 CREATE TABLE SQL
function generateCreateSQL(database: string): string {
  const lines: string[] = []
  lines.push(`CREATE TABLE \`${database}\`.\`${tableForm.name}\` (`)
  
  const columnDefs: string[] = []
  const primaryKeyColumns: string[] = []
  
  // 列定义
  for (const col of tableForm.columns) {
    if (!col.name) continue
    
    let def = `  \`${col.name}\` ${col.type}`
    
    // 长度
    if (typeNeedsLength(col.type) && col.length) {
      if (typeNeedsDecimals(col.type) && col.decimals !== undefined) {
        def += `(${col.length},${col.decimals})`
      } else {
        def += `(${col.length})`
      }
    }
    
    // UNSIGNED
    if (col.unsigned && typeSupportsUnsigned(col.type)) {
      def += ' UNSIGNED'
    }
    
    // NOT NULL
    if (col.notNull || col.primaryKey) {
      def += ' NOT NULL'
    } else {
      def += ' NULL'
    }
    
    // AUTO_INCREMENT
    if (col.autoIncrement && col.primaryKey) {
      def += ' AUTO_INCREMENT'
    }
    
    // DEFAULT
    if (col.defaultValue && !col.autoIncrement) {
      // 判断是否需要引号
      const needQuotes = !['CURRENT_TIMESTAMP', 'NULL', 'TRUE', 'FALSE'].includes(col.defaultValue.toUpperCase()) 
        && !/^\d+(\.\d+)?$/.test(col.defaultValue)
      def += ` DEFAULT ${needQuotes ? `'${col.defaultValue}'` : col.defaultValue}`
    }
    
    // COMMENT
    if (col.comment) {
      def += ` COMMENT '${col.comment.replace(/'/g, "''")}'`
    }
    
    columnDefs.push(def)
    
    if (col.primaryKey) {
      primaryKeyColumns.push(col.name)
    }
  }
  
  // 主键（从列定义中收集，或从索引定义中获取）
  const primaryIndex = tableForm.indexes.find(i => i.type === 'PRIMARY')
  if (primaryIndex && primaryIndex.columnNames.length > 0) {
    columnDefs.push(`  PRIMARY KEY (${primaryIndex.columnNames.map(c => `\`${c}\``).join(', ')})`)
  } else if (primaryKeyColumns.length > 0) {
    columnDefs.push(`  PRIMARY KEY (${primaryKeyColumns.map(c => `\`${c}\``).join(', ')})`)
  }
  
  // 其他索引
  for (const idx of tableForm.indexes) {
    if (idx.type === 'PRIMARY' || idx.columnNames.length === 0) continue
    
    let indexDef = '  '
    if (idx.type === 'UNIQUE') {
      indexDef += 'UNIQUE '
    } else if (idx.type === 'FULLTEXT') {
      indexDef += 'FULLTEXT '
    }
    indexDef += `KEY \`${idx.name}\` (${idx.columnNames.map(c => `\`${c}\``).join(', ')})`
    columnDefs.push(indexDef)
  }
  
  lines.push(columnDefs.join(',\n'))
  
  // 表选项
  let tableOptions = ')'
  if (tableForm.engine) {
    tableOptions += ` ENGINE=${tableForm.engine}`
  }
  if (tableForm.charset) {
    tableOptions += ` DEFAULT CHARSET=${tableForm.charset}`
  }
  if (tableForm.collation) {
    tableOptions += ` COLLATE=${tableForm.collation}`
  }
  if (tableForm.comment) {
    tableOptions += ` COMMENT='${tableForm.comment.replace(/'/g, "''")}'`
  }
  
  lines.push(tableOptions + ';')
  
  return lines.join('\n')
}

// 生成 ALTER TABLE SQL
function generateAlterSQL(database: string): string {
  const statements: string[] = []
  const tableName = `\`${database}\`.\`${originalTableName.value}\``
  
  // 1. 检查表名是否变化
  if (tableForm.name !== originalTableName.value) {
    statements.push(`ALTER TABLE ${tableName} RENAME TO \`${database}\`.\`${tableForm.name}\`;`)
  }
  
  // 使用新表名（如果改名了）
  const targetTable = `\`${database}\`.\`${tableForm.name}\``
  
  // 2. 对比列变化 - 基于 _key 跟踪
  const newColumns = tableForm.columns.filter(c => c.name)
  const originalColMap = new Map(originalColumns.value.map(c => [c._key, c]))
  const newColMap = new Map(newColumns.map(c => [c._key, c]))
  
  // 2.1 删除的列（原始列中存在但新列中不存在的）
  for (const origCol of originalColumns.value) {
    if (!newColMap.has(origCol._key)) {
      statements.push(`ALTER TABLE ${targetTable} DROP COLUMN \`${origCol.name}\`;`)
    }
  }
  
  // 2.2 修改的列（使用 CHANGE COLUMN 支持重命名）
  for (const newCol of newColumns) {
    const origCol = originalColMap.get(newCol._key)
    if (origCol) {
      // 原始列存在，检查是否有变化
      if (origCol.name !== newCol.name || isColumnChanged(origCol, newCol)) {
        const colDef = buildColumnDefinition(newCol)
        statements.push(`ALTER TABLE ${targetTable} CHANGE COLUMN \`${origCol.name}\` ${colDef};`)
      }
    }
  }
  
  // 2.3 新增的列（新列中存在但原始列中不存在的）
  let prevColName: string | null = null
  for (const newCol of newColumns) {
    if (!originalColMap.has(newCol._key)) {
      const colDef = buildColumnDefinition(newCol)
      const position = prevColName ? `AFTER \`${prevColName}\`` : 'FIRST'
      statements.push(`ALTER TABLE ${targetTable} ADD COLUMN ${colDef} ${position};`)
    }
    prevColName = newCol.name
  }
  
  // 3. 对比索引变化 - 基于 _key 跟踪
  const originalIdxMap = new Map(originalIndexes.value.map(i => [i._key, i]))
  const newIdxMap = new Map(tableForm.indexes.filter(i => i.columnNames.length > 0).map(i => [i._key, i]))
  
  // 3.1 删除的索引
  for (const origIdx of originalIndexes.value) {
    if (!newIdxMap.has(origIdx._key)) {
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP PRIMARY KEY;`)
      } else {
        statements.push(`ALTER TABLE ${targetTable} DROP INDEX \`${origIdx.name}\`;`)
      }
    }
  }
  
  // 3.2 新增或修改的索引
  for (const idx of tableForm.indexes) {
    if (idx.columnNames.length === 0) continue
    
    const origIdx = originalIdxMap.get(idx._key)
    if (!origIdx) {
      // 新增索引
      statements.push(buildAddIndexStatement(targetTable, idx))
    } else if (isIndexChanged(origIdx, idx)) {
      // 修改索引（先删后加）
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP PRIMARY KEY;`)
      } else {
        statements.push(`ALTER TABLE ${targetTable} DROP INDEX \`${origIdx.name}\`;`)
      }
      statements.push(buildAddIndexStatement(targetTable, idx))
    }
  }
  
  if (statements.length === 0) {
    return '-- 没有检测到变更'
  }
  
  return statements.join('\n\n')
}

// 构建列定义字符串
function buildColumnDefinition(col: ColumnFormItem): string {
  let def = `\`${col.name}\` ${col.type}`
  
  // 长度
  if (typeNeedsLength(col.type) && col.length) {
    if (typeNeedsDecimals(col.type) && col.decimals !== undefined) {
      def += `(${col.length},${col.decimals})`
    } else {
      def += `(${col.length})`
    }
  }
  
  // UNSIGNED
  if (col.unsigned && typeSupportsUnsigned(col.type)) {
    def += ' UNSIGNED'
  }
  
  // NOT NULL
  if (col.notNull || col.primaryKey) {
    def += ' NOT NULL'
  } else {
    def += ' NULL'
  }
  
  // AUTO_INCREMENT
  if (col.autoIncrement && col.primaryKey) {
    def += ' AUTO_INCREMENT'
  }
  
  // DEFAULT
  if (col.defaultValue && !col.autoIncrement) {
    const needQuotes = !['CURRENT_TIMESTAMP', 'NULL', 'TRUE', 'FALSE'].includes(col.defaultValue.toUpperCase()) 
      && !/^\d+(\.\d+)?$/.test(col.defaultValue)
    def += ` DEFAULT ${needQuotes ? `'${col.defaultValue}'` : col.defaultValue}`
  }
  
  // COMMENT
  if (col.comment) {
    def += ` COMMENT '${col.comment.replace(/'/g, "''")}'`
  }
  
  return def
}

// 判断列是否有变化
function isColumnChanged(orig: ColumnFormItem, curr: ColumnFormItem): boolean {
  return orig.type !== curr.type ||
    orig.length !== curr.length ||
    orig.decimals !== curr.decimals ||
    orig.notNull !== curr.notNull ||
    orig.primaryKey !== curr.primaryKey ||
    orig.autoIncrement !== curr.autoIncrement ||
    orig.unsigned !== curr.unsigned ||
    orig.defaultValue !== curr.defaultValue ||
    orig.comment !== curr.comment
}

// 判断索引是否有变化
function isIndexChanged(orig: IndexFormItem, curr: IndexFormItem): boolean {
  if (orig.type !== curr.type) return true
  if (orig.columnNames.length !== curr.columnNames.length) return true
  for (let i = 0; i < orig.columnNames.length; i++) {
    if (orig.columnNames[i] !== curr.columnNames[i]) return true
  }
  return false
}

// 构建添加索引语句
function buildAddIndexStatement(tableName: string, idx: IndexFormItem): string {
  const columns = idx.columnNames.map(c => `\`${c}\``).join(', ')
  
  if (idx.type === 'PRIMARY') {
    return `ALTER TABLE ${tableName} ADD PRIMARY KEY (${columns});`
  } else if (idx.type === 'UNIQUE') {
    return `ALTER TABLE ${tableName} ADD UNIQUE KEY \`${idx.name}\` (${columns});`
  } else if (idx.type === 'FULLTEXT') {
    return `ALTER TABLE ${tableName} ADD FULLTEXT KEY \`${idx.name}\` (${columns});`
  } else {
    return `ALTER TABLE ${tableName} ADD INDEX \`${idx.name}\` (${columns});`
  }
}

// 关闭对话框
function handleClose() {
  connectionStore.closeTableDesignDialog()
}

// 执行 SQL
async function handleExecute() {
  // 验证
  if (!tableForm.name) {
    ElMessage.warning('请输入表名')
    return
  }
  if (tableForm.columns.filter(c => c.name).length === 0) {
    ElMessage.warning('请添加至少一列')
    return
  }
  
  const info = connectionStore.tableDesignInfo
  if (!info) return
  
  // 根据模式生成不同的 SQL
  const sql = isEditMode.value 
    ? generateAlterSQL(info.database)
    : generateCreateSQL(info.database)
  
  // 检查是否有变更
  if (isEditMode.value && sql === '-- 没有检测到变更') {
    ElMessage.info('没有检测到变更')
    return
  }
  
  // 确认执行
  try {
    await ElMessageBox.confirm(
      `<div style="max-height: 400px; overflow: auto;"><pre style="white-space: pre-wrap; word-break: break-all; font-size: 12px;">${sql}</pre></div>`,
      isEditMode.value ? '确认修改表' : '确认创建表',
      {
        confirmButtonText: '执行',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'sql-confirm-dialog'
      }
    )
    
    executing.value = true
    
    // 编辑模式可能有多条语句，需要逐条执行
    const statements = sql.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'))
    
    for (const stmt of statements) {
      const trimmedStmt = stmt.trim()
      if (!trimmedStmt) continue
      
      const result = await connectionStore.executeDDL(info.connectionId, trimmedStmt + ';')
      
      if (!result.success) {
        ElMessage.error(result.message || '执行失败')
        return
      }
    }
    
    ElMessage.success(isEditMode.value ? '表修改成功' : '表创建成功')
    connectionStore.closeTableDesignDialog()
    
    // 刷新表列表
    await connectionStore.loadTables(info.connectionId, info.database)
  } catch {
    // 用户取消
  } finally {
    executing.value = false
  }
}
</script>

<style scoped>
.table-design-dialog :deep(.el-dialog__body) {
  padding: 10px 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px;
  color: #909399;
}

.design-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-info-section {
  background: #2d2d30;
  padding: 12px;
  border-radius: 4px;
}

.table-info-section :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-info-section :deep(.el-form-item__label) {
  color: #e0e0e0;
}

.design-tabs {
  min-height: 350px;
}

.columns-toolbar,
.indexes-toolbar {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
}

.columns-table,
.indexes-table {
  width: 100%;
}

.disabled-cell {
  color: #666;
  text-align: center;
  display: block;
}

.sql-preview-section {
  background: #1e1e1e;
  border-radius: 4px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #2d2d30;
  color: #e0e0e0;
  font-size: 13px;
}

.sql-preview {
  margin: 0;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow: auto;
}

.dialog-footer {
  text-align: right;
}

/* 深色主题样式覆盖 */
:deep(.el-table) {
  --el-table-bg-color: #1e1e1e;
  --el-table-tr-bg-color: #1e1e1e;
  --el-table-header-bg-color: #2d2d30;
  --el-table-row-hover-bg-color: #2a2d2e;
  --el-table-border-color: #4c4d4f;
  --el-table-text-color: #e0e0e0;
  --el-table-header-text-color: #e0e0e0;
}

/* 斑马纹行背景色 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: #252526;
}

:deep(.el-tabs__item) {
  color: #909399;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #4c4d4f;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  background-color: #3c3c3c;
  box-shadow: 0 0 0 1px #4c4d4f inset;
}

:deep(.el-input__inner) {
  color: #e0e0e0;
}

:deep(.el-checkbox__inner) {
  background-color: #3c3c3c;
  border-color: #4c4d4f;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
