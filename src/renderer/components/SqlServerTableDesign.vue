<template>
  <div v-if="loading" class="loading-container">
    <el-icon class="is-loading"><Loading /></el-icon>
    <span>{{ $t('common.loading') }}</span>
  </div>
  
  <div v-else class="design-container">
    <!-- 表基本信息 -->
    <div class="table-info-section">
      <el-form :model="tableForm" label-width="80px" inline>
        <el-form-item :label="$t('table.schema')">
          <el-select
            v-model="tableForm.schema"
            :placeholder="$t('table.schemaPlaceholder')"
            style="width: 140px"
            :disabled="isEditMode"
          >
            <el-option
              v-for="s in schemas"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.tableName')" required>
          <el-input v-model="tableForm.name" :placeholder="$t('table.tableNamePlaceholder')" style="width: 200px" />
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
          <el-table-column :label="$t('table.type')" width="130">
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
                v-if="sqlServerTypeNeedsFsp(row.type)"
                v-model="row.length"
                size="small"
                :min="0"
                :max="7"
                :controls="false"
                style="width: 100%"
                :placeholder="$t('table.precision')"
              />
              <el-input-number
                v-else-if="sqlServerTypeNeedsLength(row.type)"
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
                v-if="sqlServerTypeNeedsDecimals(row.type)"
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
          <el-table-column :label="$t('table.identity')" width="60" align="center">
            <template #default="{ row }">
              <el-tooltip
                v-if="isEditMode && row._origIdentity"
                :content="$t('table.identityReadonly')"
                placement="top"
              >
                <el-checkbox v-model="row.identity" disabled />
              </el-tooltip>
              <el-tooltip
                v-else-if="!row.primaryKey || !isIntegerType(row.type)"
                :content="$t('table.identityRequiresPK')"
                placement="top"
              >
                <el-checkbox v-model="row.identity" disabled />
              </el-tooltip>
              <el-checkbox v-else v-model="row.identity" />
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
import {
  SqlServerDataTypes,
  sqlServerTypeNeedsLength,
  sqlServerTypeNeedsDecimals,
  sqlServerTypeNeedsFsp,
  type SqlServerColumnFormItem,
  type SqlServerIndexFormItem
} from '@shared/types/database'
import type { IndexMeta, IndexColumnMeta } from '@shared/types/database'

const props = defineProps<{
  connectionId: string
  database: string
  table?: string
  schema?: string
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

const schemas = ref<string[]>([])

const dataTypeGroups = {
  'integer': SqlServerDataTypes.INTEGER,
  'float': SqlServerDataTypes.FLOAT,
  'string': SqlServerDataTypes.STRING,
  'binary': SqlServerDataTypes.BINARY,
  'datetime': SqlServerDataTypes.DATETIME,
  'other': SqlServerDataTypes.OTHER
}

// Integer types that support IDENTITY
const INTEGER_TYPES = ['TINYINT', 'SMALLINT', 'INT', 'BIGINT', 'DECIMAL', 'NUMERIC']

function isIntegerType(type: string): boolean {
  return INTEGER_TYPES.includes(type.toUpperCase())
}

let columnKeyCounter = 0
let indexKeyCounter = 0

function generateColumnKey(): string {
  return `col_${++columnKeyCounter}_${Date.now()}`
}

function generateIndexKey(): string {
  return `idx_${++indexKeyCounter}_${Date.now()}`
}

interface ColumnFormItem extends SqlServerColumnFormItem {
  _origIdentity?: boolean
  _origDefaultValue?: string
  _origDefaultConstraintName?: string
  _origComment?: string
}

type IndexFormItem = SqlServerIndexFormItem & {
  columnNames: string[]
}

const tableForm = reactive<{
  schema: string
  name: string
  comment: string
  columns: ColumnFormItem[]
  indexes: IndexFormItem[]
}>({
  schema: 'dbo',
  name: '',
  comment: '',
  columns: [],
  indexes: []
})

const selectedColumns = ref<ColumnFormItem[]>([])
const selectedIndexes = ref<IndexFormItem[]>([])

const originalColumns = ref<ColumnFormItem[]>([])
const originalIndexes = ref<IndexFormItem[]>([])
const originalTableName = ref('')
const originalComment = ref('')

const generatedSql = ref('')

onMounted(async () => {
  await initDialog()
})

watch(
  () => [
    tableForm.schema,
    tableForm.name,
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
    
    // Load schemas
    const schemasResult = await connectionStore.getSchemas(props.connectionId, props.database)
    if (schemasResult.success && schemasResult.schemas) {
      schemas.value = schemasResult.schemas
    }
    
    if (isEditMode.value && props.table) {
      tableForm.schema = props.schema || 'dbo'
      await loadExistingTable(props.connectionId, props.database, props.table, tableForm.schema)
    } else {
      tableForm.schema = props.schema || 'dbo'
      addColumn()
    }
    
    refreshPreview()
  } finally {
    loading.value = false
  }
}

function resetForm() {
  tableForm.schema = 'dbo'
  tableForm.name = ''
  tableForm.comment = ''
  tableForm.columns = []
  tableForm.indexes = []
  selectedColumns.value = []
  selectedIndexes.value = []
  originalColumns.value = []
  originalIndexes.value = []
  originalTableName.value = ''
  originalComment.value = ''
  generatedSql.value = ''
  activeTab.value = 'columns'
}

async function loadExistingTable(connectionId: string, database: string, table: string, schema: string) {
  tableForm.name = table
  originalTableName.value = table
  
  const columnsResult = await window.api.database.columns(connectionId, database, table, schema)
  if (columnsResult.success && columnsResult.columns) {
    const parsedColumns: ColumnFormItem[] = columnsResult.columns.map((col: {
      name: string
      type: string
      columnType: string
      nullable: boolean
      primaryKey: boolean
      autoIncrement: boolean
      isIdentity?: boolean
      seed?: number
      increment?: number
      defaultValue?: string
      defaultConstraintName?: string
      comment?: string
    }) => {
      const { baseType, length, decimals } = parseColumnType(col.columnType)
      
      const key = generateColumnKey()
      return {
        _key: key,
        name: col.name,
        type: baseType,
        length,
        decimals,
        notNull: !col.nullable,
        primaryKey: col.primaryKey,
        identity: col.isIdentity || false,
        identitySeed: col.seed ?? 1,
        identityIncrement: col.increment ?? 1,
        defaultValue: col.defaultValue || '',
        comment: col.comment || '',
        _origIdentity: col.isIdentity || false,
        _origDefaultValue: col.defaultValue || '',
        _origDefaultConstraintName: col.defaultConstraintName || '',
        _origComment: col.comment || ''
      }
    })
    
    tableForm.columns = parsedColumns
    originalColumns.value = JSON.parse(JSON.stringify(parsedColumns))
    
    // Extract table comment from extended properties (use first column's table-level comment if available)
    // The table comment is loaded separately - we'll get it from the table meta
    const dbMeta = connectionStore.getDatabaseMeta(connectionId, database)
    if (dbMeta) {
      const tableMeta = dbMeta.tables.find(t => t.name === table && t.schema === schema)
      if (tableMeta?.comment) {
        tableForm.comment = tableMeta.comment
        originalComment.value = tableMeta.comment
      }
    }
  }
  
  const indexesResult = await window.api.database.indexes(connectionId, database, table, schema)
  if (indexesResult.success && indexesResult.indexes) {
    const parsedIndexes: IndexFormItem[] = indexesResult.indexes
      .filter((idx: IndexMeta) => idx.type !== 'SPATIAL' && idx.type !== 'FULLTEXT')
      .map((idx: IndexMeta) => {
        const key = generateIndexKey()
        return {
          _key: key,
          name: idx.name,
          type: idx.type as 'PRIMARY' | 'UNIQUE' | 'INDEX',
          clustered: idx.type === 'PRIMARY',
          columns: idx.columns.map((c: IndexColumnMeta) => ({ name: c.columnName, order: c.order || 'ASC' as const })),
          columnNames: idx.columns.map((c: IndexColumnMeta) => c.columnName)
        }
      })
    
    tableForm.indexes = parsedIndexes
    originalIndexes.value = JSON.parse(JSON.stringify(parsedIndexes))
  }
}

function parseColumnType(columnType: string): { baseType: string; length?: number; decimals?: number } {
  // e.g. "nvarchar(50)", "decimal(10,2)", "int", "datetime2(7)", "nvarchar(MAX)"
  const match = columnType.match(/^(\w+)(?:\((\w+)(?:,(\d+))?\))?/)
  if (!match) return { baseType: columnType.toUpperCase() }
  
  const baseType = match[1].toUpperCase()
  const lenStr = match[2]
  const decStr = match[3]
  
  if (lenStr === 'MAX') {
    return { baseType, length: -1 } // -1 represents MAX
  }
  
  const length = lenStr ? parseInt(lenStr) : undefined
  const decimals = decStr ? parseInt(decStr) : undefined
  
  return { baseType, length, decimals }
}

function addColumn() {
  tableForm.columns.push({
    _key: generateColumnKey(),
    name: '',
    type: 'NVARCHAR',
    length: 50,
    decimals: undefined,
    notNull: false,
    primaryKey: false,
    identity: false,
    identitySeed: 1,
    identityIncrement: 1,
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
  const type = row.type.toUpperCase()
  
  if (type === 'NVARCHAR' && !row.length) {
    row.length = 50
  } else if (type === 'VARCHAR' && !row.length) {
    row.length = 255
  } else if (['DECIMAL', 'NUMERIC'].includes(type)) {
    if (!row.length) row.length = 18
    if (!row.decimals) row.decimals = 2
  } else if (['DATETIME2', 'TIME', 'DATETIMEOFFSET'].includes(type)) {
    row.length = 7
  }
  
  if (!sqlServerTypeNeedsLength(type)) {
    row.length = undefined
  }
  if (!sqlServerTypeNeedsDecimals(type)) {
    row.decimals = undefined
  }
  
  // Disable identity if not integer type
  if (!isIntegerType(type)) {
    row.identity = false
  }
  
  refreshPreview()
}

function handlePrimaryKeyChange(row: ColumnFormItem) {
  if (!row.primaryKey) {
    row.identity = false
  }
  refreshPreview()
}

function addIndex() {
  tableForm.indexes.push({
    _key: generateIndexKey(),
    name: `IX_${tableForm.name || 'table'}_${tableForm.indexes.length + 1}`,
    type: 'INDEX',
    clustered: false,
    columns: [],
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

function refreshPreview() {
  generatedSql.value = generateSQL()
}

function generateSQL(): string {
  if (!tableForm.name) return t('table.pleaseInputTableName')
  if (tableForm.columns.length === 0) return t('table.pleaseAddColumn')
  
  if (isEditMode.value) {
    return generateAlterSQL()
  } else {
    return generateCreateSQL()
  }
}

function generateCreateSQL(): string {
  const schemaName = tableForm.schema || 'dbo'
  const statements: string[] = []
  const lines: string[] = []
  lines.push(`CREATE TABLE [${props.database}].[${schemaName}].[${tableForm.name}] (`)
  
  const columnDefs: string[] = []
  const primaryKeyColumns: string[] = []
  
  for (const col of tableForm.columns) {
    if (!col.name) continue
    
    let def = `  [${col.name}] ${buildDataType(col)}`
    
    if (col.identity && col.primaryKey && isIntegerType(col.type)) {
      def += ` IDENTITY(${col.identitySeed},${col.identityIncrement})`
    }
    
    if (col.notNull || col.primaryKey) {
      def += ' NOT NULL'
    } else {
      def += ' NULL'
    }
    
    if (col.defaultValue && !col.identity) {
      def += ` DEFAULT ${formatDefaultValue(col.defaultValue)}`
    }
    
    columnDefs.push(def)
    
    if (col.primaryKey) {
      primaryKeyColumns.push(col.name)
    }
  }
  
  // PRIMARY KEY constraint inline
  const primaryIndex = tableForm.indexes.find(i => i.type === 'PRIMARY')
  if (primaryIndex && primaryIndex.columnNames.length > 0) {
    columnDefs.push(`  CONSTRAINT [PK_${tableForm.name}] PRIMARY KEY CLUSTERED (${primaryIndex.columnNames.map(c => `[${c}]`).join(', ')})`)
  } else if (primaryKeyColumns.length > 0) {
    columnDefs.push(`  CONSTRAINT [PK_${tableForm.name}] PRIMARY KEY CLUSTERED (${primaryKeyColumns.map(c => `[${c}]`).join(', ')})`)
  }
  
  lines.push(columnDefs.join(',\n'))
  lines.push(');')
  statements.push(lines.join('\n'))
  
  // Non-PK indexes are created separately
  for (const idx of tableForm.indexes) {
    if (idx.type === 'PRIMARY' || idx.columnNames.length === 0) continue
    statements.push(buildCreateIndexStatement(schemaName, tableForm.name, idx))
  }
  
  // Table comment via sp_addextendedproperty
  if (tableForm.comment) {
    statements.push(buildAddTableComment(schemaName, tableForm.name, tableForm.comment))
  }
  
  // Column comments via sp_addextendedproperty
  for (const col of tableForm.columns) {
    if (!col.name || !col.comment) continue
    statements.push(buildAddColumnComment(schemaName, tableForm.name, col.name, col.comment))
  }
  
  return statements.join('\nGO\n')
}

function generateAlterSQL(): string {
  const schemaName = tableForm.schema || 'dbo'
  const statements: string[] = []
  // Rename table
  if (tableForm.name !== originalTableName.value) {
    statements.push(`EXEC sp_rename '${schemaName}.${originalTableName.value}', '${tableForm.name}', 'OBJECT';`)
  }
  
  const targetTable = `[${props.database}].[${schemaName}].[${tableForm.name}]`
  
  const newColumns = tableForm.columns.filter(c => c.name)
  const originalColMap = new Map(originalColumns.value.map(c => [c._key, c]))
  const newColMap = new Map(newColumns.map(c => [c._key, c]))
  
  // Drop removed columns
  for (const origCol of originalColumns.value) {
    if (!newColMap.has(origCol._key)) {
      // Drop default constraint first if exists
      if (origCol._origDefaultConstraintName) {
        statements.push(`ALTER TABLE ${targetTable} DROP CONSTRAINT [${origCol._origDefaultConstraintName}];`)
      }
      statements.push(`ALTER TABLE ${targetTable} DROP COLUMN [${origCol.name}];`)
    }
  }
  
  // Modify changed columns
  for (const newCol of newColumns) {
    const origCol = originalColMap.get(newCol._key)
    if (origCol) {
      const colChanged = isColumnChanged(origCol, newCol)
      const defaultChanged = origCol.defaultValue !== newCol.defaultValue
      const commentChanged = origCol._origComment !== newCol.comment
      
      if (colChanged) {
        // Drop old default constraint before ALTER COLUMN
        if (origCol._origDefaultConstraintName && (defaultChanged || isColumnTypeChanged(origCol, newCol))) {
          statements.push(`ALTER TABLE ${targetTable} DROP CONSTRAINT [${origCol._origDefaultConstraintName}];`)
        }
        
        // ALTER COLUMN (cannot change identity, just type/null)
        let alterDef = `ALTER TABLE ${targetTable} ALTER COLUMN [${origCol.name}] ${buildDataType(newCol)}`
        if (newCol.notNull || newCol.primaryKey) {
          alterDef += ' NOT NULL'
        } else {
          alterDef += ' NULL'
        }
        statements.push(alterDef + ';')
        
        // Rename column if name changed
        if (origCol.name !== newCol.name) {
          statements.push(`EXEC sp_rename '${schemaName}.${tableForm.name}.${origCol.name}', '${newCol.name}', 'COLUMN';`)
        }
        
        // Re-add default constraint if needed
        if (newCol.defaultValue && !newCol.identity) {
          const constraintName = `DF_${tableForm.name}_${newCol.name}`
          statements.push(`ALTER TABLE ${targetTable} ADD CONSTRAINT [${constraintName}] DEFAULT ${formatDefaultValue(newCol.defaultValue)} FOR [${newCol.name}];`)
        }
      } else if (defaultChanged) {
        // Only default value changed
        if (origCol._origDefaultConstraintName) {
          statements.push(`ALTER TABLE ${targetTable} DROP CONSTRAINT [${origCol._origDefaultConstraintName}];`)
        }
        if (newCol.defaultValue && !newCol.identity) {
          const constraintName = `DF_${tableForm.name}_${newCol.name}`
          statements.push(`ALTER TABLE ${targetTable} ADD CONSTRAINT [${constraintName}] DEFAULT ${formatDefaultValue(newCol.defaultValue)} FOR [${newCol.name}];`)
        }
      }
      
      // Column comment change
      if (commentChanged) {
        if (origCol._origComment) {
          if (newCol.comment) {
            statements.push(buildUpdateColumnComment(schemaName, tableForm.name, newCol.name, newCol.comment))
          } else {
            statements.push(buildDropColumnComment(schemaName, tableForm.name, newCol.name))
          }
        } else if (newCol.comment) {
          statements.push(buildAddColumnComment(schemaName, tableForm.name, newCol.name, newCol.comment))
        }
      }
    }
  }
  
  // Add new columns
  for (const newCol of newColumns) {
    if (!originalColMap.has(newCol._key)) {
      let colDef = `ALTER TABLE ${targetTable} ADD [${newCol.name}] ${buildDataType(newCol)}`
      
      if (newCol.identity && newCol.primaryKey && isIntegerType(newCol.type)) {
        colDef += ` IDENTITY(${newCol.identitySeed},${newCol.identityIncrement})`
      }
      
      if (newCol.notNull || newCol.primaryKey) {
        colDef += ' NOT NULL'
      } else {
        colDef += ' NULL'
      }
      
      if (newCol.defaultValue && !newCol.identity) {
        colDef += ` DEFAULT ${formatDefaultValue(newCol.defaultValue)}`
      }
      
      statements.push(colDef + ';')
      
      if (newCol.comment) {
        statements.push(buildAddColumnComment(schemaName, tableForm.name, newCol.name, newCol.comment))
      }
    }
  }
  
  // Index changes
  const originalIdxMap = new Map(originalIndexes.value.map(i => [i._key, i]))
  const newIdxMap = new Map(tableForm.indexes.filter(i => i.columnNames.length > 0).map(i => [i._key, i]))
  
  for (const origIdx of originalIndexes.value) {
    if (!newIdxMap.has(origIdx._key)) {
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP CONSTRAINT [${origIdx.name}];`)
      } else {
        statements.push(`DROP INDEX [${origIdx.name}] ON ${targetTable};`)
      }
    }
  }
  
  for (const idx of tableForm.indexes) {
    if (idx.columnNames.length === 0) continue
    
    const origIdx = originalIdxMap.get(idx._key)
    if (!origIdx) {
      if (idx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} ADD CONSTRAINT [PK_${tableForm.name}] PRIMARY KEY CLUSTERED (${idx.columnNames.map(c => `[${c}]`).join(', ')});`)
      } else {
        statements.push(buildCreateIndexStatement(schemaName, tableForm.name, idx))
      }
    } else if (isIndexChanged(origIdx, idx)) {
      // Drop and recreate
      if (origIdx.type === 'PRIMARY') {
        statements.push(`ALTER TABLE ${targetTable} DROP CONSTRAINT [${origIdx.name}];`)
        statements.push(`ALTER TABLE ${targetTable} ADD CONSTRAINT [PK_${tableForm.name}] PRIMARY KEY CLUSTERED (${idx.columnNames.map(c => `[${c}]`).join(', ')});`)
      } else {
        statements.push(`DROP INDEX [${origIdx.name}] ON ${targetTable};`)
        statements.push(buildCreateIndexStatement(schemaName, tableForm.name, idx))
      }
    }
  }
  
  // Table comment change
  if (tableForm.comment !== originalComment.value) {
    if (originalComment.value) {
      if (tableForm.comment) {
        statements.push(buildUpdateTableComment(schemaName, tableForm.name, tableForm.comment))
      } else {
        statements.push(buildDropTableComment(schemaName, tableForm.name))
      }
    } else if (tableForm.comment) {
      statements.push(buildAddTableComment(schemaName, tableForm.name, tableForm.comment))
    }
  }
  
  if (statements.length === 0) {
    return t('table.noChangesDetected')
  }
  
  return statements.join('\n\n')
}

// ==================== Helper functions ====================

function buildDataType(col: ColumnFormItem): string {
  let dt = col.type.toUpperCase()
  
  if (sqlServerTypeNeedsLength(dt) && col.length !== undefined) {
    if (col.length === -1) {
      dt += '(MAX)'
    } else if (sqlServerTypeNeedsDecimals(dt) && col.decimals !== undefined) {
      dt += `(${col.length},${col.decimals})`
    } else {
      dt += `(${col.length})`
    }
  }
  
  return dt
}

function formatDefaultValue(value: string): string {
  const upper = value.toUpperCase().trim()
  // SQL Server special values
  if (['GETDATE()', 'GETUTCDATE()', 'NEWID()', 'NEWSEQUENTIALID()', 'NULL', 'SYSDATETIME()', 'SYSUTCDATETIME()'].includes(upper)) {
    return upper
  }
  // Numeric
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return value
  }
  // Already quoted
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith("N'") && value.endsWith("'"))) {
    return value
  }
  // Wrap in quotes
  return `N'${value.replace(/'/g, "''")}'`
}

function buildCreateIndexStatement(schemaName: string, tableName: string, idx: IndexFormItem): string {
  const unique = idx.type === 'UNIQUE' ? 'UNIQUE ' : ''
  const cols = idx.columnNames.map(c => `[${c}]`).join(', ')
  return `CREATE ${unique}NONCLUSTERED INDEX [${idx.name}] ON [${props.database}].[${schemaName}].[${tableName}] (${cols});`
}

function buildAddTableComment(schema: string, table: string, comment: string): string {
  return `EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'${comment.replace(/'/g, "''")}', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}';`
}

function buildUpdateTableComment(schema: string, table: string, comment: string): string {
  return `EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'${comment.replace(/'/g, "''")}', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}';`
}

function buildDropTableComment(schema: string, table: string): string {
  return `EXEC sp_dropextendedproperty @name = N'MS_Description', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}';`
}

function buildAddColumnComment(schema: string, table: string, column: string, comment: string): string {
  return `EXEC sp_addextendedproperty @name = N'MS_Description', @value = N'${comment.replace(/'/g, "''")}', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}', @level2type = N'COLUMN', @level2name = N'${column}';`
}

function buildUpdateColumnComment(schema: string, table: string, column: string, comment: string): string {
  return `EXEC sp_updateextendedproperty @name = N'MS_Description', @value = N'${comment.replace(/'/g, "''")}', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}', @level2type = N'COLUMN', @level2name = N'${column}';`
}

function buildDropColumnComment(schema: string, table: string, column: string): string {
  return `EXEC sp_dropextendedproperty @name = N'MS_Description', @level0type = N'SCHEMA', @level0name = N'${schema}', @level1type = N'TABLE', @level1name = N'${table}', @level2type = N'COLUMN', @level2name = N'${column}';`
}

function isColumnChanged(orig: ColumnFormItem, curr: ColumnFormItem): boolean {
  return orig.name !== curr.name ||
    isColumnTypeChanged(orig, curr) ||
    orig.notNull !== curr.notNull ||
    orig.primaryKey !== curr.primaryKey
}

function isColumnTypeChanged(orig: ColumnFormItem, curr: ColumnFormItem): boolean {
  return orig.type !== curr.type ||
    orig.length !== curr.length ||
    orig.decimals !== curr.decimals
}

function isIndexChanged(orig: IndexFormItem, curr: IndexFormItem): boolean {
  if (orig.type !== curr.type) return true
  if (orig.columnNames.length !== curr.columnNames.length) return true
  for (let i = 0; i < orig.columnNames.length; i++) {
    if (orig.columnNames[i] !== curr.columnNames[i]) return true
  }
  return false
}

// Public method for parent component
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
    ? generateAlterSQL()
    : generateCreateSQL()
  
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
    
    // Split by GO separator or semicolons
    const blocks = sql.split(/\nGO\n/)
    
    for (const block of blocks) {
      const stmts = block.split(/;\s*\n/).filter(s => s.trim() && !s.trim().startsWith('--'))
      
      for (const stmt of stmts) {
        const trimmedStmt = stmt.trim()
        if (!trimmedStmt) continue
        
        const result = await connectionStore.executeDDL(props.connectionId, trimmedStmt + ';')
        
        if (!result.success) {
          ElMessage.error(result.message || t('common.executeFailed'))
          return
        }
      }
    }
    
    ElMessage.success(isEditMode.value ? t('table.alterSuccess') : t('table.createSuccess'))
    emit('success')
  } catch {
    // User cancelled
  } finally {
    executing.value = false
  }
}

defineExpose({
  handleExecute,
  executing
})
</script>
