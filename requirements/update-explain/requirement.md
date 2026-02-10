# 执行计划展示组件改造需求文档

## 1. 背景与目标

### 1.1 背景
当前 `ExplainView.vue` 组件仅针对 MySQL 的 `EXPLAIN` 输出格式设计，无法正确展示 SQL Server 的执行计划。SQL Server 需要使用 `SHOWPLAN_XML` 获取执行计划，其数据格式与 MySQL 完全不同。

### 1.2 目标
- 支持 MySQL 和 SQL Server 两种数据库的执行计划展示
- 根据不同数据库类型展示不同的可视化界面
- 将组件拆分，避免单个组件代码过于复杂

---

## 2. 功能需求

### 2.1 组件架构

```
src/renderer/components/
├── ExplainView.vue              # 入口组件（保留在原位置，根据 databaseType 分发）
└── explain/
    ├── ExplainViewMysql.vue     # MySQL 执行计划展示
    ├── ExplainViewSqlServer.vue # SQL Server 执行计划展示
    └── PlanNode.vue             # SQL Server 节点子组件
```

### 2.2 类型定义改造

**文件**: `src/shared/types/query.ts`

```typescript
import type { DatabaseType } from './connection'

/**
 * 执行计划结果
 */
export interface ExplainResult {
  databaseType: DatabaseType  // 使用 'mysql' | 'sqlserver' 类型
  nodes: ExplainNode[] | SqlServerExplainNode[]
  raw: Record<string, unknown>[] | string  // MySQL: 数组 / SQL Server: XML字符串
  // SQL Server 特有字段
  truncated?: boolean
  totalCount?: number
}

/**
 * 执行计划节点（MySQL 格式）
 */
export interface ExplainNode {
  id: number
  selectType: string
  table: string
  partitions?: string
  type: string
  possibleKeys?: string
  key?: string
  keyLen?: string
  ref?: string
  rows: number
  filtered: number
  extra?: string
}

/**
 * SQL Server 执行计划节点（组件内部使用）
 */
export interface SqlServerExplainNode {
  id: number
  nodeId: string
  physicalOp: string
  logicalOp: string
  estimateRows: number
  estimateCpu?: number
  estimateIo?: number
  estimatedTotalSubtreeCost?: number
  actualRows?: number
  actualExecutions?: number
  outputList: string[]
  children: SqlServerExplainNode[]
  depth?: number  // 前端计算，用于缩进
}
```

### 2.3 后端改造

#### 2.3.1 依赖安装

```bash
npm install fast-xml-parser
```

#### 2.3.2 清理废弃文件

**文件**: `src/main/database/query-executor.ts`

当前架构使用 SessionManager 模式（`mysql/session.ts` 和 `sqlserver/session.ts`），`query-executor.ts` 已不再被引用，**可以删除**。

#### 2.3.3 MySQL Session 改造

**文件**: `src/main/database/mysql/session.ts`

修改 `explainQuery` 方法，返回格式增加 `databaseType`：

```typescript
import type { DatabaseType } from '@shared/types'

async explainQuery(tabId: string, sql: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
  // ... 原有逻辑 ...
  
  return {
    databaseType: 'mysql' as DatabaseType,  // 使用类型
    nodes: rawRows.map(row => ({...})),
    raw: rawRows
  }
}
```

#### 2.3.4 SQL Server Session 改造

**文件**: `src/main/database/sqlserver/session.ts`

修改 `explainQuery` 方法，使用 `SHOWPLAN_XML` 并在后端完成解析：

```typescript
import { XMLParser } from 'fast-xml-parser'

const MAX_EXPLAIN_NODES = 2000  // 节点数量上限

async explainQuery(tabId: string, sqlText: string, currentDatabase?: string): Promise<ExplainResult | QueryError> {
  // ... 前置检查不变 ...
  
  try {
    await pool.request().batch('SET SHOWPLAN_XML ON')
    const result = await pool.request().batch(sqlText)
    await pool.request().batch('SET SHOWPLAN_XML OFF')

    // 获取 XML 格式的执行计划
    const recordsets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[]
    let planXml = ''
    
    if (recordsets && recordsets.length > 0) {
      for (const recordset of recordsets) {
        for (const row of recordset) {
          // SQL Server XML 列名是 GUID 格式
          const text = row['XML_F52E2B61-18A1-11d1-B105-00805F49916B'] || row[Object.keys(row)[0]]
          if (text) planXml += String(text)
        }
      }
    }

    // 后端解析 XML，提取精简结构
    const { nodes, truncated, totalCount } = this.parseShowPlanXML(planXml)
    
    // 原始 XML 仅在较小时传递（< 1MB）
    const raw = planXml.length > 1024 * 1024 
      ? `[XML too large: ${(planXml.length / 1024 / 1024).toFixed(2)}MB]`
      : planXml

    return {
      databaseType: 'sqlserver',
      nodes,
      raw,
      truncated,
      totalCount
    }
  } catch (error) {
    try { await pool.request().batch('SET SHOWPLAN_XML OFF') } catch { }
    // ... 错误处理 ...
  }
}

private parseShowPlanXML(xml: string): { 
  nodes: SqlServerExplainNode[], 
  truncated: boolean, 
  totalCount: number 
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: false,
    removeNSPrefix: true  // 移除命名空间前缀
  })
  
  const doc = parser.parse(xml)
  const stmt = doc.ShowPlanXML?.BatchSequence?.Batch?.Statements?.StmtSimple
  
  if (!stmt) {
    return { nodes: [], truncated: false, totalCount: 0 }
  }
  
  // 递归提取 RelOp 节点
  const allNodes: SqlServerExplainNode[] = []
  
  function extractRelOp(relOp: any, depth: number): SqlServerExplainNode | null {
    if (!relOp) return null
    
    const node: SqlServerExplainNode = {
      id: allNodes.length,
      nodeId: relOp['@_NodeId'] || '',
      physicalOp: relOp['@_PhysicalOp'] || '',
      logicalOp: relOp['@_LogicalOp'] || '',
      estimateRows: parseFloat(relOp['@_EstimateRows'] || '0'),
      estimateCpu: parseFloat(relOp['@_EstimateCPU'] || '0'),
      estimateIo: parseFloat(relOp['@_EstimateIO'] || '0'),
      estimatedTotalSubtreeCost: parseFloat(relOp['@_EstimatedTotalSubtreeCost'] || '0'),
      actualRows: undefined,
      actualExecutions: undefined,
      outputList: [],
      children: [],
      depth
    }
    
    // 解析实际执行数据（如果有）
    const runTime = relOp.RunTimeInformation?.RunTimeCountersPerThread
    if (runTime) {
      node.actualRows = parseInt(runTime['@_ActualRows'] || '0')
      node.actualExecutions = parseInt(runTime['@_ActualExecutions'] || '0')
    }
    
    // 解析输出列
    const outputList = relOp.OutputList?.ColumnReference
    if (outputList) {
      const columns = Array.isArray(outputList) ? outputList : [outputList]
      node.outputList = columns.map((c: any) => 
        c['@_Column'] || `${c['@_Table']}.${c['@_Column']}`
      ).filter(Boolean)
    }
    
    allNodes.push(node)
    
    // 递归处理子节点（限制总数量）
    // 注意：子 RelOp 可能直接作为属性，也可能嵌套在操作符节点内部
    if (allNodes.length < MAX_EXPLAIN_NODES) {
      // 1. 直接子 RelOp（直接在 RelOp 元素下）
      const directChildren = relOp.RelOp
      if (directChildren) {
        const childArray = Array.isArray(directChildren) ? directChildren : [directChildren]
        for (const child of childArray) {
          if (allNodes.length >= MAX_EXPLAIN_NODES) break
          const childNode = extractRelOp(child, depth + 1)
          if (childNode) {
            node.children.push(childNode)
          }
        }
      }
      
      // 2. 嵌套在操作符节点内的 RelOp（如 NestedLoops/RelOp、Hash/RelOp、MergeJoin/RelOp 等）
      // 常见操作符节点名列表（可根据需要扩展）
      const operatorTypes = [
        'NestedLoops', 'Hash', 'Merge', 'Concat', 'Sort', 'Filter',
        'ComputeScalar', 'StreamAggregate', 'HashMatch', 'MergeJoin'
      ]
      
      for (const opType of operatorTypes) {
        if (allNodes.length >= MAX_EXPLAIN_NODES) break
        const opNode = relOp[opType]
        if (opNode && opNode.RelOp) {
          const nestedChildren = Array.isArray(opNode.RelOp) ? opNode.RelOp : [opNode.RelOp]
          for (const child of nestedChildren) {
            if (allNodes.length >= MAX_EXPLAIN_NODES) break
            const childNode = extractRelOp(child, depth + 1)
            if (childNode) {
              node.children.push(childNode)
            }
          }
        }
      }
    }
    
    return node
  }
  
  // 支持多语句
  const statements = Array.isArray(stmt) ? stmt : [stmt]
  const roots: SqlServerExplainNode[] = []
  
  for (const statement of statements) {
    if (allNodes.length >= MAX_EXPLAIN_NODES) break
    const queryPlan = statement.QueryPlan
    if (queryPlan?.RelOp) {
      const root = extractRelOp(queryPlan.RelOp, 0)
      if (root) roots.push(root)
    }
  }
  
  return {
    nodes: roots,
    truncated: allNodes.length >= MAX_EXPLAIN_NODES,
    totalCount: allNodes.length
  }
}
```

#### 2.3.3 Query Executor 改造

**文件**: `src/main/database/query-executor.ts`

该文件已不再被引用（当前架构使用 SessionManager 模式），**可以直接删除**。

### 2.4 前端组件改造

#### 2.4.1 组件架构

**目录结构**：

```
src/renderer/components/
├── ExplainView.vue              # 入口组件（保留在原位置）
└── explain/
    ├── ExplainViewMysql.vue     # MySQL 执行计划展示
    ├── ExplainViewSqlServer.vue # SQL Server 执行计划展示
    └── PlanNode.vue             # SQL Server 节点子组件
```

**说明**：
- 保留 `ExplainView.vue` 在根目录作为入口（无需修改 `ResultPanel.vue` 引用）
- 将现有 MySQL 实现迁移至 `explain/ExplainViewMysql.vue`
- 新建 SQL Server 组件

#### 2.4.2 入口组件 (ExplainView.vue)

**文件**: `src/renderer/components/ExplainView.vue`

```vue
<template>
  <div class="explain-view">
    <ExplainViewMysql v-if="data.databaseType === 'mysql'" :data="data" />
    <ExplainViewSqlServer v-else-if="data.databaseType === 'sqlserver'" :data="data" />
    <div v-else class="unsupported">
      不支持的数据库类型
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExplainResult } from '@shared/types'
import ExplainViewMysql from './explain/ExplainViewMysql.vue'
import ExplainViewSqlServer from './explain/ExplainViewSqlServer.vue'

defineProps<{
  data: ExplainResult
}>()
</script>
```

#### 2.4.3 MySQL 组件 (explain/ExplainViewMysql.vue)

将现有 `ExplainView.vue` 内容迁移至此，展示：
- 流程图视图（节点卡片 + 连接线）
- 原始数据表格（el-table 展示 EXPLAIN 各列）

**类型守卫处理**：
MySQL 的 `raw` 是数组类型，需确保访问前添加类型检查：

```typescript
// 原始数据表格展示
const rawData = computed(() => {
  if (Array.isArray(props.data.raw)) {
    return props.data.raw as Record<string, unknown>[]
  }
  return []
})
```

#### 2.4.4 SQL Server 组件 (explain/ExplainViewSqlServer.vue)

**说明：** 使用项目已有的 `@tanstack/vue-virtual` 实现虚拟滚动，与 `ResultTable.vue` 保持一致。

**功能需求：**

1. **数据接收**
   - 接收后端已解析的节点树（无需前端 XML 解析）
   - 支持最多 2000 个节点
   - 显示截断警告（如果后端返回 truncated=true）

2. **虚拟滚动展示**
   - 使用 `@tanstack/vue-virtual` 的 `useVirtualizer`
   - 无论节点数量多少，只渲染可视区域 DOM
   - 节点高度固定（40px），确保滚动流畅

3. **树形结构平铺**
   - 将树形结构平铺为列表（支持虚拟滚动）
   - 根据节点展开状态动态调整列表
   - 缩进表示层级关系

4. **节点交互**
   - 点击展开/折叠子节点
   - 悬停显示详细信息（Tooltip）
   - 高亮关键路径（成本最高的分支）

5. **关键信息面板**
   - 查询总成本（EstimatedTotalSubtreeCost）
   - 并行度（DegreeOfParallelism）
   - 内存授予（MemoryGrant）
   - 编译时间/执行时间

6. **原始数据展示**
   - XML 大小 < 1MB 时提供原始 XML 查看（代码高亮）
   - XML 过大时提示文件大小，不提供直接查看

**组件实现示例：**

```vue
<template>
  <div class="explain-sqlserver">
    <!-- 警告提示 -->
    <el-alert 
      v-if="data.truncated" 
      type="warning" 
      :title="`执行计划过于复杂，仅展示前 ${data.nodes.length} 个节点（共 ${data.totalCount} 个）`"
      show-icon
      closable
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
          v-for="virtualRow in rowVirtualizer.getVirtualItems()"
          :key="virtualRow.key"
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
    <div v-else-if="typeof data.raw === 'string'" class="xml-too-large">
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

// 展开的节点 key 集合
const expandedKeys = ref<Set<string>>(new Set())

// 平铺的树形节点（包含深度信息）
interface FlatNode extends SqlServerExplainNode {
  depth: number
  key: string
}

const flattenedNodes = computed<FlatNode[]>(() => {
  const result: FlatNode[] = []
  
  function walk(node: SqlServerExplainNode, depth: number) {
    result.push({ 
      ...node, 
      depth, 
      key: `${node.nodeId}-${depth}` 
    })
    
    // 只有展开的节点才包含子节点
    if (expandedKeys.value.has(node.nodeId) && node.children?.length > 0) {
      node.children.forEach(child => walk(child, depth + 1))
    }
  }
  
  props.data.nodes.forEach(root => walk(root, 0))
  return result
})

// 虚拟滚动配置（与 ResultTable.vue 一致，使用 computed 确保响应式）
const rowVirtualizer = useVirtualizer(computed(() => ({
  count: flattenedNodes.value.length,
  getScrollElement: () => scrollRef.value,
  estimateSize: () => NODE_HEIGHT,
  overscan: 10
})))

const totalHeight = computed(() => rowVirtualizer.getTotalSize())

// 计算总成本（取根节点）
const totalCost = computed(() => {
  const root = props.data.nodes[0] as SqlServerExplainNode | undefined
  return root?.estimatedTotalSubtreeCost || 0
})

// 展开/折叠切换
function toggleExpand(node: FlatNode) {
  if (expandedKeys.value.has(node.nodeId)) {
    expandedKeys.value.delete(node.nodeId)
  } else {
    expandedKeys.value.add(node.nodeId)
  }
  // 展开状态变化后，虚拟滚动会自动重新计算
}

// 默认展开第一层
onMounted(() => {
  props.data.nodes.forEach(node => {
    expandedKeys.value.add(node.nodeId)
  })
})
</script>

<style scoped>
.explain-sqlserver {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: #1e1e1e;
}

.node-list {
  flex: 1;
  overflow: auto;
  border: 1px solid #333;
  border-radius: 4px;
}

.node-list-inner {
  width: 100%;
}

.virtual-row {
  box-sizing: border-box;
}
</style>
```

**PlanNode 子组件：**

```vue
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
    <div class="node-content">
      <span class="op-type">{{ node.physicalOp }}</span>
      <span class="op-detail" v-if="node.logicalOp !== node.physicalOp">
        ({{ node.logicalOp }})
      </span>
      <span class="rows">行数: {{ formatRows(node.estimateRows) }}</span>
      <span class="cost" v-if="node.estimatedTotalSubtreeCost && node.estimatedTotalSubtreeCost > 0">
        成本: {{ node.estimatedTotalSubtreeCost.toFixed(4) }}
      </span>
    </div>
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
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.expand-placeholder {
  width: 16px;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  font-size: 13px;
}

.op-type {
  font-weight: 600;
  color: #4ec9b0;
}

.op-detail {
  color: #858585;
}

.rows, .cost {
  color: #d4d4d4;
  font-size: 12px;
}
</style>
```

---

## 3. 非功能需求

### 3.1 性能需求

| 指标 | 要求 |
|-----|------|
| 后端 XML 解析时间 | < 500ms（XML < 10MB） |
| 前端首次渲染时间 | < 300ms（节点数 < 2000） |
| 滚动帧率 | 保持 60fps |
| 内存占用 | 不随节点数增长而线性增长 |

### 3.2 XML 体积问题处理

**风险：** 复杂查询的 SHOWPLAN_XML 可能达到数 MB，直接传递到前端会导致：
1. IPC 传输耗时
2. 前端内存占用高
3. 页面卡顿甚至崩溃

**解决方案（后端预处理）：**

1. **后端解析**：使用 `fast-xml-parser` 在渲染进程外完成 XML 解析
2. **节点数限制**：最多提取 2000 个节点，超过时截断并返回警告
3. **原始 XML 控制**：仅当 XML < 1MB 时才传递给前端

```typescript
// 处理流程
SQL Server SHOWPLAN_XML (可能 5-10MB)
    ↓
后端 fast-xml-parser 解析 (耗时 < 500ms)
    ↓
提取精简节点结构 (最多 2000 个)
    ↓
IPC 传输 (数据量 < 100KB)
    ↓
前端虚拟滚动渲染 (流畅 60fps)
```

**场景覆盖：**

| 场景 | XML 大小 | 节点数 | 处理方式 |
|-----|---------|-------|---------|
| 日常查询 | < 50KB | < 50 | 完整解析，完整传输 |
| 复杂报表 | 500KB-2MB | 50-500 | 完整解析，不传输原始 XML |
| 极端复杂 | 5-10MB | 500-2000 | 截断至 2000 节点，警告提示 |

**截断提示 UI：**
当后端返回 `truncated: true` 时，前端显示警告：
```
⚠️ 执行计划过于复杂，仅展示前 2000 个节点（共 2345 个）
```

### 3.3 兼容性

- SQL Server 2012+（SHOWPLAN_XML 格式基本稳定）
- 支持实际执行计划（Actual Execution Plan）和估计执行计划（Estimated Execution Plan）

---

## 4. 验收标准

### 4.1 功能验收

- [ ] MySQL EXPLAIN 展示与改造前保持一致
- [ ] SQL Server SHOWPLAN_XML 后端能正确解析
- [ ] SQL Server 执行计划以树形结构展示
- [ ] 支持节点展开/折叠
- [ ] 节点数超过 2000 时显示截断警告
- [ ] XML < 1MB 时支持查看原始 XML
- [ ] 组件能根据 `databaseType` 自动切换展示方式

### 4.2 性能验收

- [ ] 后端解析 5MB XML 耗时 < 500ms
- [ ] 前端渲染 2000 个节点保持 60fps 滚动
- [ ] 首次渲染时间 < 300ms
- [ ] 内存占用不随节点数线性增长

---

## 5. 任务拆分

| 序号 | 任务 | 负责人 | 预计工时 |
|-----|------|-------|---------|
| 1 | 安装 fast-xml-parser 依赖 | - | 0.5h |
| 2 | 类型定义改造（databaseType 使用 DatabaseType 类型） | - | 0.5h |
| 3 | MySQL Session 改造（添加 databaseType） | - | 0.5h |
| 4 | SQL Server Session 改造（SHOWPLAN_XML + 后端解析） | - | 2h |
| 5 | 删除废弃的 query-executor.ts | - | 0.5h |
| 6 | 创建 explain/ 目录结构 | - | 0.5h |
| 7 | 实现 explain/ExplainViewMysql.vue（从现有代码迁移） | - | 1h |
| 8 | 实现 explain/ExplainViewSqlServer.vue（@tanstack/vue-virtual + 树形结构） | - | 3h |
| 9 | 实现 explain/PlanNode.vue 子组件 | - | 1h |
| 10 | 更新 ExplainView.vue 为入口组件 | - | 0.5h |
| 11 | 测试验证（MySQL + SQL Server） | - | 2h |

**总计：约 12 小时**

**注：**
- 使用项目已有的 `@tanstack/vue-virtual` 实现虚拟滚动
- 保留 `ExplainView.vue` 在原位置作为入口，无需修改 `ResultPanel.vue`

---

## 6. 附录

### 6.1 完整类型定义

**`src/shared/types/query.ts` 更新后：**

```typescript
import type { DatabaseType } from './connection'

/**
 * 执行计划节点（MySQL 格式）
 */
export interface ExplainNode {
  id: number
  selectType: string
  table: string
  partitions?: string
  type: string
  possibleKeys?: string
  key?: string
  keyLen?: string
  ref?: string
  rows: number
  filtered: number
  extra?: string
}

/**
 * SQL Server 执行计划节点
 */
export interface SqlServerExplainNode {
  id: number
  nodeId: string
  physicalOp: string
  logicalOp: string
  estimateRows: number
  estimateCpu?: number
  estimateIo?: number
  estimatedTotalSubtreeCost?: number
  actualRows?: number
  actualExecutions?: number
  outputList: string[]
  children: SqlServerExplainNode[]
  depth?: number  // 前端计算，用于缩进
}

/**
 * 执行计划结果
 */
export interface ExplainResult {
  databaseType: DatabaseType  // 'mysql' | 'sqlserver'
  nodes: ExplainNode[] | SqlServerExplainNode[]
  raw: Record<string, unknown>[] | string
  // SQL Server 特有字段
  truncated?: boolean
  totalCount?: number
}
```

### 6.2 SQL Server SHOWPLAN_XML 示例结构

```xml
<?xml version="1.0" encoding="utf-16"?>
<ShowPlanXML xmlns="http://schemas.microsoft.com/sqlserver/2004/07/showplan" Version="1.9" Build="15.0.4249.2">
  <BatchSequence>
    <Batch>
      <Statements>
        <StmtSimple StatementText="SELECT * FROM Users WHERE Id = 1" StatementId="1" StatementCompId="1" StatementType="SELECT" StatementSubTreeCost="0.0032816" StatementEstRows="1" StatementOptmLevel="TRIVIAL" QueryHash="0x5F3C7B8E9A1D2F4C" QueryPlanHash="0x1A2B3C4D5E6F7G8H">
          <StatementSetOptions QUOTED_IDENTIFIER="true" ARITHABORT="true" CONCAT_NULL_YIELDS_NULL="true" ANSI_NULLS="true" ANSI_PADDING="true" ANSI_WARNINGS="true" NUMERIC_ROUNDABORT="false" />
          <QueryPlan DegreeOfParallelism="1" MemoryGrant="1024" CachedPlanSize="16" CompileTime="2" CompileCPU="2" CompileMemory="104">
            <MemoryGrantInfo SerialRequiredMemory="16" SerialDesiredMemory="24" GrantedMemory="1024" MaxUsedMemory="16" />
            <OptimizerHardwareDependentProperties EstimatedAvailableMemoryGrant="209715" EstimatedPagesCached="52428" EstimatedAvailableDegreeOfParallelism="4" MaxCompileMemory="1048576" />
            <RelOp NodeId="0" PhysicalOp="Nested Loops" LogicalOp="Inner Join" EstimateRows="1" EstimateIO="0" EstimateCPU="4.18e-06" AvgRowSize="29" EstimatedTotalSubtreeCost="0.0032816" Parallel="0" EstimateRebinds="0" EstimateRewinds="0">
              <OutputList>
                <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Id" />
                <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Name" />
              </OutputList>
              <NestedLoops Optimized="0">
                <OuterReferences>
                  <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Id" />
                </OuterReferences>
                <RelOp NodeId="1" PhysicalOp="Index Seek" LogicalOp="Index Seek" EstimateRows="1" EstimateIO="0.003125" EstimateCPU="0.000158" AvgRowSize="11" EstimatedTotalSubtreeCost="0.003283" TableCardinality="1000">
                  <OutputList>
                    <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Id" />
                  </OutputList>
                  <IndexScan Ordered="1" ScanDirection="FORWARD" ForcedIndex="0" ForceSeek="0" ForceScan="0" NoExpandHint="0" Storage="RowStore">
                    <DefinedValues>
                      <DefinedValue>
                        <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Id" />
                      </DefinedValue>
                    </DefinedValues>
                    <Object Database="[TestDB]" Schema="[dbo]" Table="[Users]" Index="[PK_Users]" IndexKind="Clustered" Storage="RowStore" />
                    <SeekPredicates>
                      <SeekPredicateNew>
                        <SeekKeys>
                          <Prefix ScanType="EQ">
                            <RangeColumns>
                              <ColumnReference Database="[TestDB]" Schema="[dbo]" Table="[Users]" Column="Id" />
                            </RangeColumns>
                            <RangeExpressions>
                              <ScalarOperator ScalarString="[@Id]">
                                <Identifier>
                                  <ColumnReference Column="@Id" />
                                </Identifier>
                              </ScalarOperator>
                            </RangeExpressions>
                          </Prefix>
                        </SeekKeys>
                      </SeekPredicateNew>
                    </SeekPredicates>
                  </IndexScan>
                </RelOp>
              </NestedLoops>
            </RelOp>
          </QueryPlan>
        </StmtSimple>
      </Statements>
    </Batch>
  </BatchSequence>
</ShowPlanXML>
```

### 6.3 参考文档

- [SQL Server SHOWPLAN_XML Schema](https://learn.microsoft.com/en-us/sql/relational-databases/showplan-logical-and-physical-operators-reference)
- [MySQL EXPLAIN Output Format](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)
- [fast-xml-parser Documentation](https://github.com/NaturalIntelligence/fast-xml-parser)
