<template>
  <div 
    class="plan-node" 
    :style="{ paddingLeft: `${node.depth * 20 + 12}px` }"
    @click="handleClick"
  >
    <!-- 展开图标 -->
    <span 
      v-if="hasChildren" 
      class="expand-icon"
      :class="{ expanded }"
    >
      ▶
    </span>
    <span v-else class="expand-placeholder"></span>
    
    <!-- 节点内容 -->
    <el-tooltip
      :content="tooltipContent"
      placement="right"
      :show-after="500"
    >
      <div class="node-content">
        <span class="op-type">{{ node.physicalOp }}</span>
        <span class="op-detail" v-if="node.logicalOp !== node.physicalOp">
          ({{ node.logicalOp }})
        </span>
        <span class="rows">行数: {{ formatRows(node.estimateRows) }}</span>
        <span class="cost" v-if="node.estimatedTotalSubtreeCost && node.estimatedTotalSubtreeCost > 0">
          成本: {{ node.estimatedTotalSubtreeCost.toFixed(4) }}
        </span>
        <span class="actual-rows" v-if="node.actualRows !== undefined">
          实际: {{ formatRows(node.actualRows) }}
        </span>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SqlServerExplainNode } from '@shared/types'

interface FlatNode extends SqlServerExplainNode {
  depth: number
  key: string
}

const props = defineProps<{
  node: FlatNode
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const hasChildren = computed(() => props.node.children?.length > 0)

const tooltipContent = computed(() => {
  const n = props.node
  const parts = [
    `物理操作: ${n.physicalOp}`,
    `逻辑操作: ${n.logicalOp}`,
    `预估行数: ${formatRows(n.estimateRows)}`,
    `子树成本: ${n.estimatedTotalSubtreeCost?.toFixed(6) || '0'}`,
  ]
  if (n.estimateCpu) parts.push(`CPU 成本: ${n.estimateCpu.toFixed(6)}`)
  if (n.estimateIo) parts.push(`IO 成本: ${n.estimateIo.toFixed(6)}`)
  if (n.actualRows !== undefined) parts.push(`实际行数: ${formatRows(n.actualRows)}`)
  if (n.actualExecutions !== undefined) parts.push(`实际执行次数: ${n.actualExecutions}`)
  if (n.outputList.length > 0) parts.push(`输出列: ${n.outputList.join(', ')}`)
  return parts.join('\n')
})

function handleClick() {
  if (hasChildren.value) {
    emit('toggle')
  }
}

function formatRows(rows: number): string {
  if (rows >= 1000000) return (rows / 1000000).toFixed(2) + 'M'
  if (rows >= 1000) return (rows / 1000).toFixed(2) + 'K'
  return rows.toFixed(0)
}
</script>

<style scoped>
.plan-node {
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background 0.2s;
}

.plan-node:hover {
  background: #2a2a2a;
}

.expand-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #858585;
  transition: transform 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.expand-placeholder {
  width: 16px;
  flex-shrink: 0;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  font-size: 13px;
  min-width: 0;
}

.op-type {
  font-weight: 600;
  color: #4ec9b0;
  white-space: nowrap;
}

.op-detail {
  color: #858585;
  white-space: nowrap;
}

.rows, .cost, .actual-rows {
  color: #d4d4d4;
  font-size: 12px;
  white-space: nowrap;
}

.actual-rows {
  color: #dcdcaa;
}
</style>
