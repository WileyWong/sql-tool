<template>
  <div class="er-table-node" :style="{ backgroundColor: bgColor }">
    <div class="table-name">{{ tableName }}</div>
    <div class="divider"></div>
    <div class="field" v-for="(field, index) in displayFields" :key="field.name" :class="{ 'field-alt': index % 2 === 1 }">
      <span class="field-name" :class="{ 'pk': field.isPrimaryKey }">{{ field.isPrimaryKey ? '🔑' : '' }}{{ field.name }}</span>
      <span class="field-type">{{ field.type }}</span>
    </div>
    <div class="more-fields" v-if="allFields.length > 5">...等 {{ allFields.length }} 个字段</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Node } from '@antv/x6'
import type { ErFieldData } from '../../../shared/types/erd'

interface Props { node: Node }
const props = defineProps<Props>()

const nodeData = computed(() => props.node.getData() as any)
const tableName = computed(() => nodeData.value?.name || 'Unknown')
const allFields = computed<ErFieldData[]>(() => nodeData.value?.fields || [])
const displayFields = computed(() => allFields.value.slice(0, 5))
const bgColor = computed(() => nodeData.value?.backgroundColor || '#2d2d2d')
</script>

<style scoped>
.er-table-node {
  border: 1px solid #555;
  border-radius: 8px;
  width: 220px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  cursor: pointer;
}
.table-name {
  padding: 8px 12px;
  font-weight: bold;
  color: #d4d4d4;
  font-size: 13px;
  text-align: center;
}
.divider {
  height: 1px;
  background: #555;
  margin: 0 8px;
}
.field {
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.field-alt { background-color: rgba(255,255,255,0.03); }
.field-name { color: #d4d4d4; }
.field-name.pk { color: #f5b801; }
.field-type { color: #888; font-size: 11px; }
.more-fields {
  padding: 4px 12px;
  color: #666;
  font-size: 11px;
  text-align: center;
  border-top: 1px solid rgba(85,85,85,0.4);
  margin-top: 2px;
}
</style>
