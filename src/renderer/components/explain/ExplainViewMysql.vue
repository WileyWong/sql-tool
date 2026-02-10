<template>
  <div class="explain-view-mysql">
    <!-- 流程图视图 -->
    <div class="explain-flow">
      <div
        v-for="(node, index) in mysqlNodes"
        :key="index"
        class="explain-node"
      >
        <div class="node-header">
          <span class="node-id">#{{ node.id }}</span>
          <span class="node-type">{{ node.selectType }}</span>
        </div>
        <div class="node-content">
          <div class="node-table">
            <el-icon><Grid /></el-icon>
            {{ node.table || '(无表)' }}
          </div>
          <div class="node-info">
            <div class="info-item">
              <span class="label">访问类型:</span>
              <el-tag :type="getAccessTypeColor(node.type)" size="small">
                {{ node.type }}
              </el-tag>
            </div>
            <div v-if="node.key" class="info-item">
              <span class="label">使用索引:</span>
              <span class="value">{{ node.key }}</span>
            </div>
            <div class="info-item">
              <span class="label">扫描行数:</span>
              <span class="value">{{ node.rows }}</span>
            </div>
            <div class="info-item">
              <span class="label">过滤比例:</span>
              <span class="value">{{ node.filtered }}%</span>
            </div>
            <div v-if="node.extra" class="info-item extra">
              <span class="label">额外信息:</span>
              <span class="value">{{ node.extra }}</span>
            </div>
          </div>
        </div>
        <!-- 连接线 -->
        <div v-if="index < mysqlNodes.length - 1" class="node-connector">
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>
    </div>
    
    <!-- 原始数据表格 -->
    <div class="explain-table">
      <h4>原始 EXPLAIN 结果</h4>
      <el-table :data="rawData" border size="small">
        <el-table-column prop="id" label="id" width="60" />
        <el-table-column prop="select_type" label="select_type" width="120" />
        <el-table-column prop="table" label="table" width="120" />
        <el-table-column prop="type" label="type" width="80" />
        <el-table-column prop="possible_keys" label="possible_keys" min-width="150" />
        <el-table-column prop="key" label="key" width="120" />
        <el-table-column prop="key_len" label="key_len" width="80" />
        <el-table-column prop="ref" label="ref" width="100" />
        <el-table-column prop="rows" label="rows" width="80" />
        <el-table-column prop="filtered" label="filtered" width="80" />
        <el-table-column prop="Extra" label="Extra" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Grid, ArrowDown } from '@element-plus/icons-vue'
import type { ExplainResult, ExplainNode } from '@shared/types'

const props = defineProps<{
  data: ExplainResult
}>()

const mysqlNodes = computed(() => props.data.nodes as ExplainNode[])

const rawData = computed(() => {
  if (Array.isArray(props.data.raw)) {
    return props.data.raw as Record<string, unknown>[]
  }
  return []
})

function getAccessTypeColor(type: string): 'success' | 'warning' | 'danger' | 'info' {
  const goodTypes = ['system', 'const', 'eq_ref', 'ref']
  const okTypes = ['range', 'index']
  const badTypes = ['ALL']
  
  if (goodTypes.includes(type)) return 'success'
  if (okTypes.includes(type)) return 'warning'
  if (badTypes.includes(type)) return 'danger'
  return 'info'
}
</script>

<style scoped>
.explain-view-mysql {
  padding: 16px;
  overflow: auto;
  background: #1e1e1e;
}

.explain-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.explain-node {
  width: 300px;
  background: #2d2d2d;
  border: 1px solid #555;
  border-radius: 8px;
  overflow: hidden;
}

.node-header {
  background: #3c3c3c;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #555;
}

.node-id {
  font-weight: 600;
  color: #4ec9b0;
}

.node-type {
  font-size: 12px;
  color: #858585;
}

.node-content {
  padding: 12px;
}

.node-table {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #d4d4d4;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.info-item .label {
  color: #858585;
  flex-shrink: 0;
}

.info-item .value {
  color: #d4d4d4;
}

.info-item.extra {
  flex-direction: column;
  align-items: flex-start;
}

.info-item.extra .value {
  background: #3c3c3c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  word-break: break-all;
}

.node-connector {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  color: #555;
}

.explain-table {
  margin-top: 24px;
}

.explain-table h4 {
  margin-bottom: 12px;
  color: #d4d4d4;
}

.explain-table :deep(.el-table) {
  background: #1e1e1e;
  color: #d4d4d4;
  --el-table-border-color: #555;
  --el-table-header-bg-color: #2d2d2d;
  --el-table-tr-bg-color: #1e1e1e;
  --el-table-row-hover-bg-color: #2a2d2e;
}

.explain-table :deep(.el-table th.el-table__cell) {
  background: #2d2d2d;
  color: #d4d4d4;
}
</style>
