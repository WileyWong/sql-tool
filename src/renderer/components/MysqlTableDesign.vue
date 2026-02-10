<template>
  <div v-if="loading" class="loading-container">
    <el-icon class="is-loading"><Loading /></el-icon>
    <span>{{ $t('common.loading') }}</span>
  </div>
  
  <div v-else class="design-container">
    <!-- 表基本信息 -->
    <div class="table-info-section">
      <el-form :model="tableForm" label-width="80px" inline>
        <el-form-item :label="$t('table.tableName')" required>
          <el-input v-model="tableForm.name" :placeholder="$t('table.tableNamePlaceholder')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('table.engine')">
          <el-select v-model="tableForm.engine" :placeholder="$t('table.enginePlaceholder')" style="width: 120px">
            <el-option
              v-for="e in engines"
              :key="e.engine"
              :label="e.engine"
              :value="e.engine"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.charset')">
          <el-select v-model="tableForm.charset" :placeholder="$t('table.charsetPlaceholder')" style="width: 140px" @change="handleCharsetChange">
            <el-option
              v-for="c in charsets"
              :key="c.charset"
              :label="c.charset"
              :value="c.charset"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.collation')">
          <el-select v-model="tableForm.collation" :placeholder="$t('table.collationPlaceholder')" style="width: 200px">
            <el-option
              v-for="c in filteredCollations"
              :key="c.collation"
              :label="c.collation"
              :value="c.collation"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.comment')">
          <el-input v-model="tableForm.comment" :placeholder="$t('table.tableCommentPlaceholder')" style="width: 200px" />
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 页签：列定义 / 索引定义 -->
    <el-tabs v-model="activeTab" class="design-tabs">
      <!-- 列定义 -->
      <el-tab-pane :label="$t('table.columnsDefinition')" name="columns">
        <div class="columns-toolbar">
          <el-button size="small" type="primary" @click="addColumn">
            <el-icon><Plus /></el-icon> {{ $t('table.addColumn') }}
          </el-button>
          <el-button size="small" type="danger" @click="removeSelectedColumns" :disabled="selectedColumns.length === 0">
            <el-icon><Delete /></el-icon> {{ $t('common.deleteSelected') }}
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
          <el-table-column :label="$t('table.columnName')" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row.name" size="small" :placeholder="$t('table.columnNamePlaceholder')" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.type')" width="120">
            <template #default="{ row }">
              <el-select v-model="row.type" size="small" filterable @change="handleTypeChange(row)">
                <el-option-group
                  v-for="(types, group) in dataTypeGroups"
                  :key="group"
                  :label="$t(`table.dataTypeGroups.${group}`)"
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
          <el-table-column :label="$t('table.length')" width="80">
            <template #default="{ row }">
              <el-input-number
                v-if="typeNeedsFsp(row.type)"
                v-model="row.length"
                size="small"
                :min="0"
                :max="6"
                :controls="false"
                style="width: 100%"
                :placeholder="$t('table.precision')"
              />
              <el-input-number
                v-else-if="typeNeedsLength(row.type)"
                v-model="row.length"
                size="small"
                :min="1"
                :controls="false"
                style="width: 100%"
              />
              <span v-else class="disabled-cell">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.decimalPlaces')" width="70">
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
          <el-table-column :label="$t('table.notNull')" width="60" align="center">
            <template #default="{ row }">
              <el-checkbox v-model="row.notNull" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.primaryKey')" width="60" align="center">
            <template #default="{ row }">
              <el-checkbox v-model="row.primaryKey" @change="handlePrimaryKeyChange(row)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.autoIncrement')" width="60" align="center">
            <template #default="{ row }">
              <el-checkbox v-model="row.autoIncrement" :disabled="!row.primaryKey" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.unsigned')" width="70" align="center">
            <template #default="{ row }">
              <el-checkbox v-if="typeSupportsUnsigned(row.type)" v-model="row.unsigned" />
              <span v-else class="disabled-cell">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.defaultValue')" min-width="100">
            <template #default="{ row }">
              <el-input v-model="row.defaultValue" size="small" :placeholder="$t('table.defaultValuePlaceholder')" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.comment')" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row.comment" size="small" :placeholder="$t('table.commentPlaceholder')" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <!-- 索引定义 -->
      <el-tab-pane :label="$t('table.indexesDefinition')" name="indexes">
        <div class="indexes-toolbar">
          <el-button size="small" type="primary" @click="addIndex">
            <el-icon><Plus /></el-icon> {{ $t('table.addIndex') }}
          </el-button>
          <el-button size="small" type="danger" @click="removeSelectedIndexes" :disabled="selectedIndexes.length === 0">
            <el-icon><Delete /></el-icon> {{ $t('common.deleteSelected') }}
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
          <el-table-column :label="$t('table.indexName')" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row.name" size="small" :placeholder="$t('table.indexNamePlaceholder')" :disabled="row.type === 'PRIMARY'" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.type')" width="120">
            <template #default="{ row }">
              <el-select v-model="row.type" size="small" :disabled="row.type === 'PRIMARY'">
                <el-option label="PRIMARY" value="PRIMARY" />
                <el-option label="UNIQUE" value="UNIQUE" />
                <el-option label="INDEX" value="INDEX" />
                <el-option label="FULLTEXT" value="FULLTEXT" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.columns')" min-width="250">
            <template #default="{ row }">
              <el-select
                v-model="row.columnNames"
                multiple
                size="small"
                :placeholder="$t('table.indexColumnsPlaceholder')"
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
        <span>{{ $t('table.sqlPreview') }}</span>
        <el-button size="small" text @click="refreshPreview">
          <el-icon><Refresh /></el-icon> {{ $t('common.refresh') }}
        </el-button>
      </div>
      <pre class="sql-preview">{{ generatedSql }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { useConnectionStore } from '../stores/connection'
import { MySQLDataTypes, typeNeedsLength, typeNeedsDecimals, typeSupportsUnsigned, typeNeedsFsp } from '@shared/types/database'

const props = defineProps<{
  connectionId: string
  database: string
  table?: string
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const connectionStore = useConnectionStore()

const isEditMode = computed(() => props.mode === 'edit')

const activeTab = ref('columns')
const loading = ref(false)
const executing = ref(false)

const charsets = ref<{ charset: string; defaultCollation: string; description: string }[]>([])
const collations = ref<{ collation: string; charset: string; isDefault: boolean }[]>([])
const engines = ref<{ engine: string; support: string; comment: string; isDefault: boolean }[]>([])

const filteredCollations = computed(() => {
  if (!tableForm.charset) return collations.value
  return collations.value.filter(c => c.charset === tableForm.charset)
})

const dataTypeGroups = {
  'integer': MySQLDataTypes.INTEGER,
  'float': MySQLDataTypes.FLOAT,
  'string': MySQLDataTypes.STRING,
  'binary': MySQLDataTypes.BINARY,
  'datetime': MySQLDataTypes.DATETIME,
  'other': MySQLDataTypes.OTHER
}

let columnKeyCounter = 0
let indexKeyCounter = 0

function generateColumnKey(): string {
  return `col_${++columnKeyCounter}_${Date.now()}`
}

function generateIndexKey(): string {
  return `idx_${++indexKeyCounter}_${Date.now()}`
}

interface ColumnFormItem {
  _key: string
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

interface IndexFormItem {
  _key: string
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT'
  columnNames: string[]
}

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

const selectedColumns = ref<ColumnFormItem[]>([])
const selectedIndexes = ref<IndexFormItem[]>([])

const originalColumns = ref<ColumnFormItem[]>([])
const originalIndexes = ref<IndexFormItem[]>([])
const originalTableName = ref('')

const generatedSql = ref('')

onMounted(async () => {
  await initDialog()
})

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

async function initDialog() {
  loading.value = true
  
  try {
    resetForm()
    
    const [charsetsResult, collationsResult, enginesResult, defaultCharsetResult] = await Promise.all([
      connectionStore.getCharsets(props.connectionId),
      connectionStore.getCollations(props.connectionId),
      connectionStore.getEngines(props.connectionId),
      connectionStore.getDefaultCharset(props.connectionId, props.database)
    ])
    
    if (charsetsResult.success && charsetsResult.charsets) {
      charsets.value = charsetsResult.charsets
    }
    if (collationsResult.success && collationsResult.collations) {
      collations.value = collationsResult.collations
    }
    if (enginesResult.success && enginesResult.engines) {
      engines.value = enginesResult.engines
      const defaultEngine = enginesResult.engines.find(e => e.isDefault)
      if (defaultEngine) {
        tableForm.engine = defaultEngine.engine
      }
    }
    if (defaultCharsetResult.success) {
      tableForm.charset = defaultCharsetResult.charset || 'utf8mb4'
      tableForm.collation = defaultCharsetResult.collation || 'utf8mb4_general_ci'
    }
    
    if (isEditMode.value && props.table) {
      await loadExistingTable(props.connectionId, props.database, props.table)
    } else {
      addColumn()
    }
    
    refreshPreview()
  } finally {
    loading.value = false
  }
}

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

async function loadExistingTable(connectionId: string, database: string, table: string) {
  tableForm.name = table
  originalTableName.value = table
  
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
    originalColumns.value = JSON.parse(JSON.stringify(parsedColumns))
  }
  
  const indexesResult = await connectionStore.getTableIndexes(connectionId, database, table)
  if (indexesResult.success && indexesResult.indexes) {
    const parsedIndexes = indexesResult.indexes
      .filter(idx => idx.type !== 'SPATIAL')
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
    originalIndexes.value = JSON.parse(JSON.stringify(parsedIndexes))
  }
}

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

function removeSelectedColumns() {
  tableForm.columns = tableForm.columns.filter(c => !selectedColumns.value.includes(c))
  selectedColumns.value = []
}

function handleColumnSelectionChange(selection: ColumnFormItem[]) {
  selectedColumns.value = selection
}

function handleTypeChange(row: ColumnFormItem) {
  if (row.type === 'VARCHAR' && !row.length) {
    row.length = 255
  } else if (row.type === 'INT' && !row.length) {
    row.length = 11
  } else if (row.type === 'DECIMAL') {
    if (!row.length) row.length = 10
    if (!row.decimals) row.decimals = 2
  } else if (['DATETIME', 'TIME', 'TIMESTAMP'].includes(row.type)) {
    row.length = undefined
  }
  
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

function handlePrimaryKeyChange(row: ColumnFormItem) {
  if (!row.primaryKey) {
    row.autoIncrement = false
  }
  refreshPreview()
}

function addIndex() {
  tableForm.indexes.push({
    _key: generateIndexKey(),
    name: `idx_${tableForm.indexes.length + 1}`,
    type: 'INDEX',
    columnNames: []
  })
}

function removeSelectedIndexes() {
  tableForm.indexes = tableForm.indexes.filter(i => !selectedIndexes.value.includes(i))
  selectedIndexes.value = []
}

function handleIndexSelectionChange(selection: IndexFormItem[]) {
  selectedIndexes.value = selection
}

function handleCharsetChange() {
  const defaultCollation = charsets.value.find(c => c.charset === tableForm.charset)?.defaultCollation
  if (defaultCollation) {
    tableForm.collation = defaultCollation
  }
  refreshPreview()
}

function refreshPreview() {
  generatedSql.value = generateSQL()
}

function generateSQL(): string {
  if (!tableForm.name) return t('table.pleaseInputTableName')
  if (tableForm.columns.length === 0) return t('table.pleaseAddColumn')
  
  if (isEditMode.value) {
    return generateAlterSQL(props.database)
  } else {
    return generateCreateSQL(props.database)
  }
}

function generateCreateSQL(database: string): string {
  const lines: string[] = []
  lines.push(`CREATE TABLE \`${database}\`.\`${tableForm.name}\` (`)
  
  const columnDefs: string[] = []
  const primaryKeyColumns: string[] = []
  
  for (const col of tableForm.columns) {
    if (!col.name) continue
    
    let def = `  \`${col.name}\` ${col.type}`
    
    if (typeNeedsLength(col.type) && col.length) {
      if (typeNeedsDecimals(col.type) && col.decimals !== undefined) {
        def += `(${col.length},${col.decimals})`
      } else {
        def += `(${col.length})`
      }
    }
    
    if (col.unsigned && typeSupportsUnsigned(col.type)) {
      def += ' UNSIGNED'
    }
    
    if (col.notNull || col.primaryKey) {
      def += ' NOT NULL'
    } else {
      def += ' NULL'
    }
    
    if (col.autoIncrement && col.primaryKey) {
      def += ' AUTO_INCREMENT'
    }
    
    if (col.defaultValue && !col.autoIncrement) {
      const needQuotes = !['CURRENT_TIMESTAMP', 'NULL', 'TRUE', 'FALSE'].includes(col.defaultValue.toUpperCase()) 
        && !/^\d+(\.\d+)?$/.test(col.defaultValue)
      def += ` DEFAULT ${needQuotes ? `'${col.defaultValue}'` : col.defaultValue}`
    }
    
    if (col.comment) {
      def += ` COMMENT '${col.comment.replace(/'/g, "''")}'`
    }
    
    columnDefs.push(def)
    
    if (col.primaryKey) {
      primaryKeyColumns.push(col.name)
    }
  }
  
  const primaryIndex = tableForm.indexes.find(i => i.type === 'PRIMARY')
  if (primaryIndex && primaryIndex.columnNames.length > 0) {
    columnDefs.push(`  PRIMARY KEY (${primaryIndex.columnNames.map(c => `\`${c}\``).join(', ')})`)
  } else if (primaryKeyColumns.length > 0) {
    columnDefs.push(`  PRIMARY KEY (${primaryKeyColumns.map(c => `\`${c}\``).join(', ')})`)
  }
  
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

function generateAlterSQL(database: string): string {
  const statements: string[] = []
  const tableName = `\`${database}\`.\`${originalTableName.value}\``
  
  if (tableForm.name !== originalTableName.value) {
    statements.push(`ALTER TABLE ${tableName} RENAME TO \`${database}\`.\`${tableForm.name}\`;`)
  }
  
  const targetTable = `\`${database}\`.\`${tableForm.name}\``
  
  const newColumns = tableForm.columns.filter(c => c.name)
  const originalColMap = new Map(originalColumns.value.map(c => [c._key, c]))
  const newColMap = new Map(newColumns.map(c => [c._key, c]))
  
  for (const origCol of originalColumns.value) {
    if (!newColMap.has(origCol._key)) {
      statements.push(`ALTER TABLE ${targetTable} DROP COLUMN \`${origCol.name}\`;`)
    }
  }
  
  for (const newCol of newColumns) {
    const origCol = originalColMap.get(newCol._key)
    if (origCol) {
      if (origCol.name !== newCol.name || isColumnChanged(origCol, newCol)) {
        const colDef = buildColumnDefinition(newCol)
        statements.push(`ALTER TABLE ${targetTable} CHANGE COLUMN \`${origCol.name}\` ${colDef};`)
      }
    }
  }
  
  let prevColName: string | null = null
  for (const newCol of newColumns) {
    if (!originalColMap.has(newCol._key)) {
      const colDef = buildColumnDefinition(newCol)
      const position = prevColName ? `AFTER \`${prevColName}\`` : 'FIRST'
      statements.push(`ALTER TABLE ${targetTable} ADD COLUMN ${colDef} ${position};`)
    }
    prevColName = newCol.name
  }
  
  const originalIdxMap = new Map(originalIndexes.value.map(i => [i._key, i]))
  const newIdxMap = new Map(tableForm.indexes.filter(i => i.columnNames.length > 0).map(i => [i._key, i]))
  
  for (const origIdx of originalIndexes.value) {
    if (!newIdxMap.has(origIdx._key)) {
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP PRIMARY KEY;`)
      } else {
        statements.push(`ALTER TABLE ${targetTable} DROP INDEX \`${origIdx.name}\`;`)
      }
    }
  }
  
  for (const idx of tableForm.indexes) {
    if (idx.columnNames.length === 0) continue
    
    const origIdx = originalIdxMap.get(idx._key)
    if (!origIdx) {
      statements.push(buildAddIndexStatement(targetTable, idx))
    } else if (isIndexChanged(origIdx, idx)) {
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP PRIMARY KEY;`)
      } else {
        statements.push(`ALTER TABLE ${targetTable} DROP INDEX \`${origIdx.name}\`;`)
      }
      statements.push(buildAddIndexStatement(targetTable, idx))
    }
  }
  
  if (statements.length === 0) {
    return t('table.noChangesDetected')
  }
  
  return statements.join('\n\n')
}

function buildColumnDefinition(col: ColumnFormItem): string {
  let def = `\`${col.name}\` ${col.type}`
  
  if (typeNeedsLength(col.type) && col.length) {
    if (typeNeedsDecimals(col.type) && col.decimals !== undefined) {
      def += `(${col.length},${col.decimals})`
    } else {
      def += `(${col.length})`
    }
  }
  
  if (col.unsigned && typeSupportsUnsigned(col.type)) {
    def += ' UNSIGNED'
  }
  
  if (col.notNull || col.primaryKey) {
    def += ' NOT NULL'
  } else {
    def += ' NULL'
  }
  
  if (col.autoIncrement && col.primaryKey) {
    def += ' AUTO_INCREMENT'
  }
  
  if (col.defaultValue && !col.autoIncrement) {
    const needQuotes = !['CURRENT_TIMESTAMP', 'NULL', 'TRUE', 'FALSE'].includes(col.defaultValue.toUpperCase()) 
      && !/^\d+(\.\d+)?$/.test(col.defaultValue)
    def += ` DEFAULT ${needQuotes ? `'${col.defaultValue}'` : col.defaultValue}`
  }
  
  if (col.comment) {
    def += ` COMMENT '${col.comment.replace(/'/g, "''")}'`
  }
  
  return def
}

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

function isIndexChanged(orig: IndexFormItem, curr: IndexFormItem): boolean {
  if (orig.type !== curr.type) return true
  if (orig.columnNames.length !== curr.columnNames.length) return true
  for (let i = 0; i < orig.columnNames.length; i++) {
    if (orig.columnNames[i] !== curr.columnNames[i]) return true
  }
  return false
}

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

// 公开执行方法供父组件调用
async function handleExecute() {
  if (!tableForm.name) {
    ElMessage.warning(t('table.tableNameRequired'))
    return
  }
  if (tableForm.columns.filter(c => c.name).length === 0) {
    ElMessage.warning(t('table.atLeastOneColumn'))
    return
  }
  
  const sql = isEditMode.value 
    ? generateAlterSQL(props.database)
    : generateCreateSQL(props.database)
  
  if (isEditMode.value && sql === t('table.noChangesDetected')) {
    ElMessage.info(t('table.noChanges'))
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `<div style="max-height: 400px; overflow: auto;"><pre style="white-space: pre-wrap; word-break: break-all; font-size: 12px;">${sql}</pre></div>`,
      isEditMode.value ? t('table.confirmAlter') : t('table.confirmCreate'),
      {
        confirmButtonText: t('common.execute'),
        cancelButtonText: t('common.cancel'),
        dangerouslyUseHTMLString: true,
        customClass: 'sql-confirm-dialog'
      }
    )
    
    executing.value = true
    
    const statements = sql.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'))
    
    for (const stmt of statements) {
      const trimmedStmt = stmt.trim()
      if (!trimmedStmt) continue
      
      const result = await connectionStore.executeDDL(props.connectionId, trimmedStmt + ';')
      
      if (!result.success) {
        ElMessage.error(result.message || t('common.executeFailed'))
        return
      }
    }
    
    ElMessage.success(isEditMode.value ? t('table.alterSuccess') : t('table.createSuccess'))
    emit('success')
  } catch {
    // 用户取消
  } finally {
    executing.value = false
  }
}

defineExpose({
  handleExecute,
  executing
})
</script>
