<template>
  <el-dialog v-model="visible" :title="$t('erd.selectRelationFields')" width="600px" :close-on-click-modal="false" append-to-body>
    <div class="relation-fields">
      <div class="columns">
        <div class="col">
          <div class="col-title">{{ sourceTable?.name || '' }}</div>
          <div class="col-title-sub">{{ $t('erd.sourceFields') }}</div>
          <div class="field-list">
            <div v-for="f in sourceFields" :key="f.name" class="field-item">
              <el-checkbox :model-value="selectedSource.includes(f.name)" @change="(v: boolean) => toggleSource(f.name, v)">
                🔑 {{ f.name }} <span class="f-type">{{ f.type }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="col-title">{{ targetTable?.name || '' }}</div>
          <div class="col-title-sub">{{ $t('erd.targetFields') }}</div>
          <div class="field-list">
            <div v-for="f in targetFields" :key="f.name" class="field-item">
              <el-checkbox :model-value="selectedTarget.includes(f.name)" @change="(v: boolean) => toggleTarget(f.name, v)">
                🔑 {{ f.name }} <span class="f-type">{{ f.type }}</span>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ErTableData, ErFieldData } from '../../../shared/types/erd'

const props = defineProps<{ modelValue: boolean; sourceTable: ErTableData | null; targetTable: ErTableData | null; edgeId: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean]; confirm: [sourceFields: string[], targetFields: string[]] }>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

const sourceFields = ref<ErFieldData[]>([])
const targetFields = ref<ErFieldData[]>([])
const selectedSource = ref<string[]>([])
const selectedTarget = ref<string[]>([])

watch(() => props.sourceTable, t => { sourceFields.value = t?.fields || []; selectedSource.value = [] })
watch(() => props.targetTable, t => { targetFields.value = t?.fields || []; selectedTarget.value = [] })

function toggleSource(name: string, checked: boolean) {
  if (checked) selectedSource.value.push(name)
  else selectedSource.value = selectedSource.value.filter(f => f !== name)
}
function toggleTarget(name: string, checked: boolean) {
  if (checked) selectedTarget.value.push(name)
  else selectedTarget.value = selectedTarget.value.filter(f => f !== name)
}
function handleConfirm() {
  emit('confirm', selectedSource.value, selectedTarget.value)
  visible.value = false
}
</script>

<style scoped>
.columns { display: flex; gap: 16px; }
.col { flex: 1; }
.col-title { font-weight: bold; color: var(--text-primary); margin-bottom: 2px; }
.col-title-sub { color: var(--text-placeholder); font-size: 12px; margin-bottom: 8px; }
.field-list { max-height: 300px; overflow-y: auto; }
.field-item { padding: 3px 0; }
.f-type { color: var(--text-placeholder); font-size: 11px; margin-left: 4px; }
</style>
