<template>
  <div class="json-tree-viewer">
    <template v-if="error">
      <pre class="view-content error-content">{{ error }}</pre>
    </template>
    <template v-else-if="root">
      <div class="tree-toolbar">
        <el-button size="small" @click="expandAll">{{ $t('common.expandAll') }}</el-button>
        <el-button size="small" @click="collapseAll">{{ $t('common.collapseAll') }}</el-button>
      </div>
      <div class="tree-content">
        <JsonTreeNode 
          :node="root" 
          :collapsed-keys="collapsedKeys"
          @toggle="toggleNode"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h, defineComponent } from 'vue'

const props = defineProps<{
  value: unknown
}>()

// JSON 树节点类型
interface JsonNode {
  key: string
  path: string
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  value?: unknown
  children?: JsonNode[]
  length?: number
}

// JSON 树节点组件
const JsonTreeNode = defineComponent({
  name: 'JsonTreeNode',
  props: {
    node: { type: Object as () => JsonNode, required: true },
    collapsedKeys: { type: Object as () => Set<string>, required: true },
    indent: { type: Number, default: 0 }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const isCollapsed = computed(() => props.collapsedKeys.has(props.node.path))
    const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
    
    const toggleCollapse = () => {
      if (hasChildren.value) {
        emit('toggle', props.node.path)
      }
    }
    
    return () => {
      const node = props.node
      const indent = props.indent
      const indentStyle = { paddingLeft: `${indent * 16}px` }
      
      // 渲染值的语法高亮
      const renderValue = (n: JsonNode) => {
        if (n.type === 'null') return h('span', { class: 'json-null' }, 'null')
        if (n.type === 'boolean') return h('span', { class: 'json-boolean' }, String(n.value))
        if (n.type === 'number') return h('span', { class: 'json-number' }, String(n.value))
        if (n.type === 'string') return h('span', { class: 'json-string' }, `"${n.value}"`)
        return null
      }
      
      // 如果是叶子节点（无子节点）
      if (!hasChildren.value) {
        return h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          node.key ? h('span', { class: 'json-key' }, `"${node.key}": `) : null,
          renderValue(node)
        ])
      }
      
      // 有子节点
      const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}']
      const collapsed = isCollapsed.value
      
      const children: ReturnType<typeof h>[] = [
        h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { 
            class: ['tree-toggle', collapsed ? 'collapsed' : 'expanded'],
            onClick: toggleCollapse
          }, collapsed ? '▶' : '▼'),
          node.key ? h('span', { class: 'json-key' }, `"${node.key}": `) : null,
          h('span', { class: 'json-bracket' }, bracket[0]),
          collapsed ? h('span', { class: 'json-collapsed-hint' }, `... ${node.length} items`) : null,
          collapsed ? h('span', { class: 'json-bracket' }, bracket[1]) : null
        ])
      ]
      
      if (!collapsed && node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]
          children.push(h(JsonTreeNode, {
            node: child,
            collapsedKeys: props.collapsedKeys,
            indent: indent + 1,
            onToggle: (path: string) => emit('toggle', path)
          }))
        }
        children.push(h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'json-bracket' }, bracket[1])
        ]))
      }
      
      return h('div', { class: 'tree-node-group' }, children)
    }
  }
})

// 折叠状态
const collapsedKeys = ref<Set<string>>(new Set())

// 解析 JSON 为树结构
function parseJsonToTree(value: unknown, key: string = '', path: string = 'root'): JsonNode {
  if (value === null) {
    return { key, path, type: 'null', value: null }
  }
  
  if (Array.isArray(value)) {
    const children = value.map((item, idx) => 
      parseJsonToTree(item, String(idx), `${path}[${idx}]`)
    )
    return { key, path, type: 'array', children, length: value.length }
  }
  
  if (typeof value === 'object') {
    const children = Object.entries(value).map(([k, v]) => 
      parseJsonToTree(v, k, `${path}.${k}`)
    )
    return { key, path, type: 'object', children, length: Object.keys(value).length }
  }
  
  if (typeof value === 'string') {
    return { key, path, type: 'string', value }
  }
  
  if (typeof value === 'number') {
    return { key, path, type: 'number', value }
  }
  
  if (typeof value === 'boolean') {
    return { key, path, type: 'boolean', value }
  }
  
  return { key, path, type: 'null', value: null }
}

// 收集所有节点路径
function collectNodePaths(node: JsonNode, paths: string[] = []): string[] {
  if (node.children && node.children.length > 0) {
    paths.push(node.path)
    for (const child of node.children) {
      collectNodePaths(child, paths)
    }
  }
  return paths
}

// 解析结果
const parseResult = computed(() => {
  const value = props.value
  if (value === null || value === undefined) {
    return { root: null, error: 'NULL' }
  }
  
  const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
  
  try {
    const parsed = JSON.parse(strValue)
    const root = parseJsonToTree(parsed)
    return { root, error: null }
  } catch {
    return { root: null, error: `无法解析为 JSON:\n${strValue}` }
  }
})

const root = computed(() => parseResult.value.root)
const error = computed(() => parseResult.value.error)

// 切换节点折叠状态
function toggleNode(path: string) {
  if (collapsedKeys.value.has(path)) {
    collapsedKeys.value.delete(path)
  } else {
    collapsedKeys.value.add(path)
  }
  collapsedKeys.value = new Set(collapsedKeys.value)
}

// 全部展开
function expandAll() {
  collapsedKeys.value = new Set()
}

// 全部折叠
function collapseAll() {
  const paths: string[] = []
  if (root.value) {
    collectNodePaths(root.value, paths)
  }
  collapsedKeys.value = new Set(paths)
}

// 监听 value 变化，重置折叠状态
watch(() => props.value, () => {
  collapsedKeys.value = new Set()
})
</script>

<style scoped>
.json-tree-viewer {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  background: #1e1e1e;
  border: 1px solid #555;
  border-radius: 4px;
}

.tree-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #555;
  display: flex;
  gap: 8px;
}

.tree-toolbar :deep(.el-button) {
  background: #3c3c3c;
  border-color: #555;
  color: #d4d4d4;
}

.tree-toolbar :deep(.el-button:hover) {
  background: #4c4c4c;
  border-color: #666;
}

.tree-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.view-content {
  margin: 0;
  padding: 12px;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-content {
  color: #f48771;
}

/* 树节点样式 */
.tree-content :deep(.tree-node) {
  display: flex;
  align-items: flex-start;
  white-space: nowrap;
}

.tree-content :deep(.tree-node-group) {
  display: flex;
  flex-direction: column;
}

.tree-content :deep(.tree-toggle) {
  width: 16px;
  cursor: pointer;
  color: #858585;
  user-select: none;
  flex-shrink: 0;
}

.tree-content :deep(.tree-toggle:hover) {
  color: #d4d4d4;
}

.tree-content :deep(.tree-toggle-placeholder) {
  width: 16px;
  flex-shrink: 0;
}

/* JSON 语法高亮 */
.tree-content :deep(.json-key) {
  color: #9cdcfe;
}

.tree-content :deep(.json-string) {
  color: #ce9178;
}

.tree-content :deep(.json-number) {
  color: #b5cea8;
}

.tree-content :deep(.json-boolean) {
  color: #569cd6;
}

.tree-content :deep(.json-null) {
  color: #569cd6;
}

.tree-content :deep(.json-bracket) {
  color: #d4d4d4;
}

.tree-content :deep(.json-collapsed-hint) {
  color: #858585;
  font-style: italic;
  margin: 0 4px;
}
</style>
