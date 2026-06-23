<template>
  <el-dialog v-model="visible" :title="$t('erd.selectTables')" width="500px" :close-on-click-modal="false" append-to-body>
    <div class="table-selector">
      <el-input v-model="searchText" :placeholder="$t('common.search')" clearable class="search-input" />
      <div class="table-list" v-loading="loading">
        <el-checkbox-group v-model="selectedTables">
          <div v-for="table in filteredTables" :key="table" class="table-item">
            <el-checkbox :label="table" :value="table">{{ table }}</el-checkbox>
          </div>
        </el-checkbox-group>
        <div v-if="!loading && filteredTables.length === 0" class="empty">{{ $t('common.noData') }}</div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :disabled="selectedTables.length === 0" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useConnectionStore } from '../../stores/connection'
import type { ErTableData } from '../../../shared/types/erd'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  modelValue: boolean
  connectionId: string
  databaseName: string
  dropPosition?: { x: number; y: number } | null
  addedTableNames?: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean]; confirm: [tables: ErTableData[]] }>()

const connectionStore = useConnectionStore()
const visible = ref(props.modelValue)
const searchText = ref('')
const selectedTables = ref<string[]>([])
const loading = ref(false)

watch(() => props.modelValue, (v) => { visible.value = v; if (v) { searchText.value = ''; selectedTables.value = []; loadTables() } })
watch(visible, (v) => emit('update:modelValue', v))

const allTables = ref<string[]>([])

async function loadTables() {
  if (!props.connectionId || !props.databaseName) return
  loading.value = true
  try {
    await connectionStore.loadTablesWithColumns(props.connectionId, props.databaseName)
    const meta = connectionStore.getDatabaseMeta(props.connectionId, props.databaseName)
    if (meta?.tables) {
      allTables.value = meta.tables.map(t => typeof t === 'string' ? t : t.name || t.tableName || '')
    }
  } catch { allTables.value = [] }
  finally { loading.value = false }
}

const filteredTables = computed(() => {
  const added = new Set(props.addedTableNames || [])
  let list = allTables.value.filter(t => !added.has(t))
  if (!searchText.value) return list
  const kw = searchText.value.toLowerCase()
  return list.filter(t => t.toLowerCase().includes(kw))
})

function handleConfirm() {
  const meta = connectionStore.getDatabaseMeta(props.connectionId, props.databaseName)
  const baseX = props.dropPosition?.x ?? 50
  const baseY = props.dropPosition?.y ?? 50
  const tables: ErTableData[] = selectedTables.value.map((name, i) => {
    let fields: any[] = []
    if (meta) {
      const tableMeta = meta.tables?.find(t => (typeof t === 'string' ? t === name : (t.name || t.tableName) === name))
      fields = (tableMeta && typeof tableMeta === 'object' && 'columns' in tableMeta) ? (tableMeta as any).columns || [] : []
    }
    return {
      id: `table-${uuidv4()}`,
      name,
      databaseName: props.databaseName,
      connectionId: props.connectionId,
      x: baseX + (i % 4) * 260,
      y: baseY + Math.floor(i / 4) * 300,
      fields: fields.map((f: any) => ({
        name: f.name || f.column_name || f.COLUMN_NAME || '',
        type: f.type || f.data_type || f.DATA_TYPE || f.column_type || f.COLUMN_TYPE || '',
        isPrimaryKey: f.isPrimaryKey || f.is_primary_key || false
      }))
    }
  })
  emit('confirm', tables)
  visible.value = false
}
</script>

<style scoped>
.table-selector { display: flex; flex-direction: column; gap: 12px; }
.search-input { margin-bottom: 4px; }
.table-list { max-height: 350px; overflow-y: auto; }
.table-item { padding: 4px 0; }
.empty { text-align: center; color: var(--text-placeholder); padding: 20px; }
</style>
