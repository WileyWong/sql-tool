<template>
  <div class="erd-panel">
    <!-- 连接信息栏 -->
    <div class="connection-info">
      <div class="info-item">
        <span class="label">{{ $t('editor.server') }}:</span>
        <el-select 
          v-model="selectedConnectionId" 
          class="info-select"
          filterable
          clearable
          :placeholder="$t('editor.selectConnection')"
        >
          <el-option 
            v-for="conn in connections" 
            :key="conn.id" 
            :value="conn.id"
            :label="conn.name"
          />
        </el-select>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.database') }}:</span>
        <el-select 
          v-model="selectedDatabase" 
          class="info-select"
          filterable
          clearable
          :placeholder="$t('editor.selectDatabase')"
        >
          <el-option 
            v-for="db in filteredDatabases" 
            :key="db" 
            :value="db"
            :label="db"
          />
        </el-select>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.user') }}:</span>
        <span class="value">{{ currentUser }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ $t('editor.maxRows') }}:</span>
        <input type="text" value="N/A" class="max-rows-input" disabled />
      </div>
    </div>
    
    <!-- ER 图画布 -->
    <div class="canvas-container">
      <ErCanvas />
    </div>

    <!-- 表选择弹窗 -->
    <TableSelectorDialog
      v-model="tableSelectorVisible"
      :connection-id="selectedConnectionId"
      :database-name="selectedDatabase"
      :drop-position="tableSelectorDropPosition"
      :added-table-names="addedTableNames"
      @confirm="handleAddTables"
    />

    <!-- 格式设置弹窗 -->
    <FormatDialog
      v-model="formatDialogVisible"
      :current-color="editingTableColor"
      @confirm="handleFormatConfirm"
    />

    <!-- 关系字段选择弹窗 -->
    <RelationFieldDialog
      v-model="relationDialogVisible"
      :source-table="sourceTableForRelation"
      :target-table="targetTableForRelation"
      :edge-id="activeEdgeId"
      @confirm="handleRelationConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { useConnectionStore } from '../../stores/connection'
import { useEditorStore } from '../../stores/editor'
import { useErdStore } from '../../stores/erd'
import ErCanvas from './ErCanvas.vue'
import TableSelectorDialog from './TableSelectorDialog.vue'
import FormatDialog from './FormatDialog.vue'
import RelationFieldDialog from './RelationFieldDialog.vue'
import type { ErTableData } from '../../../shared/types/erd'

const connectionStore = useConnectionStore()
const editorStore = useEditorStore()
const erdStore = useErdStore()

const selectedConnectionId = ref('')
const selectedDatabase = ref('')

const connections = computed(() => connectionStore.connections)
const filteredDatabases = computed(() => {
  if (!selectedConnectionId.value) return []
  const conn = connections.value.find(c => c.id === selectedConnectionId.value)
  if (!conn || conn.status !== 'connected') return []
  return connectionStore.getDatabaseNames(selectedConnectionId.value)
})

const currentUser = computed(() => {
  if (!selectedConnectionId.value) return '-'
  return connections.value.find(c => c.id === selectedConnectionId.value)?.username || '-'
})

// 同步标签页连接设置到连接信息栏
watch(() => editorStore.activeTab, (tab) => {
  if (tab && tab.tabType === 'erd') {
    selectedConnectionId.value = tab.connectionId || ''
    selectedDatabase.value = tab.databaseName || ''
  }
}, { immediate: true })

// 连接/数据库变化同步回 editorStore
watch(selectedConnectionId, (newId, oldId) => {
  if (newId) {
    editorStore.updateTabConnection(newId, undefined)
    connectionStore.connect(newId).catch(() => {})
  }
  if (oldId && oldId !== newId) {
    editorStore.updateTabConnection(newId || undefined, undefined)
  }
})

watch(selectedDatabase, (newDb) => {
  editorStore.updateTabConnection(selectedConnectionId.value || undefined, newDb || undefined)
})

// 弹窗状态
const tableSelectorVisible = ref(false)
const formatDialogVisible = ref(false)
const editingTableColor = ref('#2d2d2d')
const relationDialogVisible = ref(false)
const sourceTableForRelation = ref<ErTableData | null>(null)
const targetTableForRelation = ref<ErTableData | null>(null)
const activeEdgeId = ref('')

const tableSelectorDropPosition = ref<{ x: number; y: number } | null>(null)

// 当前连接+数据库下已在画布上的表名（用于表选择器过滤）
const addedTableNames = computed(() => {
  erdStore.graphVersion  // 依赖版本号触发响应式更新（graph 是 shallowRef，节点增删不触发）
  const g = erdStore.graph
  if (!g) return []
  return g.getNodes()
    .map(n => n.getData() as ErTableData)
    .filter(d => d.connectionId === selectedConnectionId.value
              && d.databaseName === selectedDatabase.value)
    .map(d => d.name)
})

// 暴露给 ErCanvas
provide('erdPanel', {
  openTableSelector: (pos?: { x: number; y: number } | null) => {
    tableSelectorDropPosition.value = pos ?? null
    tableSelectorVisible.value = true
  },
  openFormatDialog: (color: string) => {
    editingTableColor.value = color || '#2d2d2d'
    formatDialogVisible.value = true
  },
  openRelationDialog: (sourceTable: ErTableData, targetTable: ErTableData, edgeId: string) => {
    sourceTableForRelation.value = sourceTable
    targetTableForRelation.value = targetTable
    activeEdgeId.value = edgeId
    relationDialogVisible.value = true
  },
  getConnectionId: () => selectedConnectionId.value,
  getDatabase: () => selectedDatabase.value
})

// 弹窗回调
function handleAddTables(tables: ErTableData[]) {
  tables.forEach(t => erdStore.addTable(t))
}

function handleFormatConfirm(color: string) {
  const tableId = erdStore.selectedCell?.id
  if (tableId && erdStore.selectedCell?.isNode()) {
    erdStore.updateTableBackground(tableId, color)
  }
}

function handleRelationConfirm(sourceFields: string[], targetFields: string[]) {
  erdStore.updateRelationFields(activeEdgeId.value, sourceFields, targetFields)
}
</script>

<style scoped>
.erd-panel { display: flex; flex-direction: column; height: 100%; background: var(--bg-base); }
.canvas-container { flex: 1; min-height: 0; overflow: hidden; }

.connection-info { background: var(--bg-surface); padding: 8px 12px; display: flex; gap: 20px; font-size: 12px; border-bottom: 1px solid var(--border-color); }
.info-item { display: flex; align-items: center; gap: 6px; }
.info-item .label { color: var(--text-placeholder); }
.info-item .value { color: #4ec9b0; font-weight: 500; }

.info-select { width: 180px; }
.info-select :deep(.el-select__wrapper) { background-color: var(--bg-elevated); box-shadow: 0 0 0 1px var(--border-color) inset; }
.info-select :deep(.el-select__wrapper:hover) { box-shadow: 0 0 0 1px var(--color-primary) inset; }
.info-select :deep(.el-select__selected-item) { color: #4ec9b0 !important; }

.max-rows-input { width: 70px; background: var(--bg-elevated); color: #666; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; font-size: 12px; outline: none; text-align: center; }
</style>
