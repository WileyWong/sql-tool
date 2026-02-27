<template>
  <div class="explain-sqlserver">
    <!-- 警告提示 -->
    <el-alert 
      v-if="data.truncated" 
      type="warning" 
      :title="`执行计划过于复杂，仅展示前 ${data.nodes.length} 个节点（共 ${data.totalCount} 个）`"
      show-icon
      closable
      style="margin-bottom: 12px;"
    />
    
    <!-- 关键指标面板 -->
    <div class="metrics-panel">
      <div class="metric">
        <span class="label">总成本:</span>
        <span class="value">{{ totalCost.toFixed(4) }}</span>
      </div>
      <div class="metric">
        <span class="label">节点数:</span>
        <span class="value">{{ flattenedNodes.length }}</span>
      </div>
    </div>
    
    <!-- 虚拟滚动节点列表 -->
    <div ref="scrollRef" class="node-list">
      <div 
        class="node-list-inner"
        :style="{ height: `${totalHeight}px`, position: 'relative' }"
      >
        <div
          v-for="virtualRow in virtualItems"
          :key="virtualRow.index"
          class="virtual-row"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`
          }"
        >
          <PlanNode
            :node="flattenedNodes[virtualRow.index]"
            :expanded="expandedKeys.has(flattenedNodes[virtualRow.index].nodeId)"
            @toggle="toggleExpand(flattenedNodes[virtualRow.index])"
          />
        </div>
      </div>
    </div>
    
    <!-- 原始 XML 查看 -->
    <details v-if="typeof data.raw === 'string' && !data.raw.startsWith('[XML')" class="raw-xml">
      <summary>原始 XML</summary>
      <pre><code>{{ data.raw }}</code></pre>
    </details>
    <div v-else-if="typeof data.raw === 'string' && data.raw.startsWith('[XML')" class="xml-too-large">
      {{ data.raw }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { ExplainResult, SqlServerExplainNode } from '@shared/types'
import PlanNode from './PlanNode.vue'

const props = defineProps<{
  data: ExplainResult
}>()

const scrollRef = ref<HTMLDivElement>()
const NODE_HEIGHT = 40

const expandedKeys = ref<Set<string>>(new Set())

interface FlatNode extends SqlServerExplainNode {
  depth: number
  key: string
}

const sqlServerNodes = computed(() => props.data.nodes as SqlServerExplainNode[])

const flattenedNodes = computed<FlatNode[]>(() => {
  const result: FlatNode[] = []
  
  function walk(node: SqlServerExplainNode, depth: number) {
    result.push({ 
      ...node, 
      depth, 
      key: `${node.nodeId}-${depth}` 
    })
    
    if (expandedKeys.value.has(node.nodeId) && node.children?.length > 0) {
      node.children.forEach(child => walk(child, depth + 1))
    }
  }
  
  sqlServerNodes.value.forEach(root => walk(root, 0))
  return result
})

const rowVirtualizer = useVirtualizer(computed(() => ({
  count: flattenedNodes.value.length,
  getScrollElement: () => scrollRef.value ?? null,
  estimateSize: () => NODE_HEIGHT,
  overscan: 10
})))

const virtualItems = computed(() => rowVirtualizer.value.getVirtualItems())
const totalHeight = computed(() => rowVirtualizer.value.getTotalSize())

const totalCost = computed(() => {
  const root = sqlServerNodes.value[0]
  return root?.estimatedTotalSubtreeCost || 0
})

function toggleExpand(node: FlatNode) {
  const newSet = new Set(expandedKeys.value)
  if (newSet.has(node.nodeId)) {
    newSet.delete(node.nodeId)
  } else {
    newSet.add(node.nodeId)
  }
  expandedKeys.value = newSet
}

onMounted(() => {
  const newSet = new Set<string>()
  sqlServerNodes.value.forEach(node => {
    newSet.add(node.nodeId)
  })
  expandedKeys.value = newSet
})
</script>

<style scoped>
.explain-sqlserver {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: var(--bg-base);
}

.metrics-panel {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--bg-surface);
  border-radius: 4px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric .label {
  color: #858585;
  font-size: 13px;
}

.metric .value {
  color: #4ec9b0;
  font-weight: 600;
  font-size: 13px;
}

.node-list {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.node-list-inner {
  width: 100%;
}

.virtual-row {
  box-sizing: border-box;
}

.raw-xml {
  margin-top: 16px;
  color: #d4d4d4;
}

.raw-xml summary {
  cursor: pointer;
  padding: 8px 0;
  color: #858585;
  font-size: 13px;
}

.raw-xml pre {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
  line-height: 1.5;
}

.xml-too-large {
  margin-top: 16px;
  color: #858585;
  font-size: 13px;
  padding: 8px 12px;
  background: var(--bg-surface);
  border-radius: 4px;
}
</style>
