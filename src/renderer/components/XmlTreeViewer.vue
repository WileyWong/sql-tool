<template>
  <div class="xml-tree-viewer">
    <template v-if="error">
      <pre class="view-content error-content">{{ error }}</pre>
    </template>
    <template v-else-if="root">
      <div class="tree-toolbar">
        <el-button size="small" @click="expandAll">{{ $t('common.expandAll') }}</el-button>
        <el-button size="small" @click="collapseAll">{{ $t('common.collapseAll') }}</el-button>
      </div>
      <div class="tree-content">
        <XmlTreeNode 
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

// XML 树节点类型
interface XmlNode {
  key: string
  path: string
  type: 'element' | 'text' | 'comment' | 'cdata'
  tagName?: string
  attributes?: Record<string, string>
  value?: string
  children?: XmlNode[]
}

// XML 树节点组件
const XmlTreeNode = defineComponent({
  name: 'XmlTreeNode',
  props: {
    node: { type: Object as () => XmlNode, required: true },
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
      
      // 文本节点
      if (node.type === 'text') {
        return h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'xml-text' }, node.value)
        ])
      }
      
      // 注释节点
      if (node.type === 'comment') {
        return h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'xml-comment' }, `<!-- ${node.value} -->`)
        ])
      }
      
      // CDATA 节点
      if (node.type === 'cdata') {
        return h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'xml-cdata' }, `<![CDATA[${node.value}]]>`)
        ])
      }
      
      // 元素节点
      const attrs = node.attributes || {}
      const attrParts: ReturnType<typeof h>[] = []
      for (const [key, val] of Object.entries(attrs)) {
        attrParts.push(h('span', { class: 'xml-attr-name' }, ` ${key}`))
        attrParts.push(h('span', { class: 'xml-punctuation' }, '='))
        attrParts.push(h('span', { class: 'xml-attr-value' }, `"${val}"`))
      }
      
      // 无子节点 - 自闭合标签
      if (!hasChildren.value) {
        return h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'xml-punctuation' }, '<'),
          h('span', { class: 'xml-tag' }, node.tagName),
          ...attrParts,
          h('span', { class: 'xml-punctuation' }, ' />')
        ])
      }
      
      const collapsed = isCollapsed.value
      
      const children: ReturnType<typeof h>[] = [
        h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { 
            class: ['tree-toggle', collapsed ? 'collapsed' : 'expanded'],
            onClick: toggleCollapse
          }, collapsed ? '▶' : '▼'),
          h('span', { class: 'xml-punctuation' }, '<'),
          h('span', { class: 'xml-tag' }, node.tagName),
          ...attrParts,
          h('span', { class: 'xml-punctuation' }, '>'),
          collapsed ? h('span', { class: 'xml-collapsed-hint' }, '...') : null,
          collapsed ? [
            h('span', { class: 'xml-punctuation' }, '</'),
            h('span', { class: 'xml-tag' }, node.tagName),
            h('span', { class: 'xml-punctuation' }, '>')
          ] : null
        ])
      ]
      
      if (!collapsed && node.children) {
        for (const child of node.children) {
          children.push(h(XmlTreeNode, {
            node: child,
            collapsedKeys: props.collapsedKeys,
            indent: indent + 1,
            onToggle: (path: string) => emit('toggle', path)
          }))
        }
        children.push(h('div', { class: 'tree-node', style: indentStyle }, [
          h('span', { class: 'tree-toggle-placeholder' }),
          h('span', { class: 'xml-punctuation' }, '</'),
          h('span', { class: 'xml-tag' }, node.tagName),
          h('span', { class: 'xml-punctuation' }, '>')
        ]))
      }
      
      return h('div', { class: 'tree-node-group' }, children)
    }
  }
})

// 折叠状态
const collapsedKeys = ref<Set<string>>(new Set())

// 解析 XML 为树结构
function parseXmlToTree(xmlStr: string): { root: XmlNode | null; error: string | null } {
  try {
    const trimmed = xmlStr.trim()
    if (!trimmed.startsWith('<')) {
      return { root: null, error: `无法解析为 XML:\n${xmlStr}` }
    }
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(trimmed, 'application/xml')
    
    // 检查解析错误
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      return { root: null, error: `XML 解析错误:\n${parseError.textContent}` }
    }
    
    function nodeToTree(node: Node, path: string): XmlNode | null {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        const attrs: Record<string, string> = {}
        for (const attr of Array.from(el.attributes)) {
          attrs[attr.name] = attr.value
        }
        
        const children: XmlNode[] = []
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = nodeToTree(node.childNodes[i], `${path}/${el.tagName}[${i}]`)
          if (child) children.push(child)
        }
        
        return {
          key: el.tagName,
          path,
          type: 'element',
          tagName: el.tagName,
          attributes: Object.keys(attrs).length > 0 ? attrs : undefined,
          children: children.length > 0 ? children : undefined
        }
      }
      
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (text) {
          return { key: '#text', path, type: 'text', value: text }
        }
      }
      
      if (node.nodeType === Node.COMMENT_NODE) {
        return { key: '#comment', path, type: 'comment', value: node.textContent || '' }
      }
      
      if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return { key: '#cdata', path, type: 'cdata', value: node.textContent || '' }
      }
      
      return null
    }
    
    const root = nodeToTree(doc.documentElement, 'root')
    return { root, error: null }
  } catch (e) {
    return { root: null, error: `XML 解析错误:\n${e}` }
  }
}

// 收集所有节点路径
function collectNodePaths(node: XmlNode, paths: string[] = []): string[] {
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
  return parseXmlToTree(strValue)
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
.xml-tree-viewer {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.tree-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
}

.tree-toolbar :deep(.el-button) {
  background: var(--bg-elevated);
  border-color: var(--border-color);
  color: var(--text-primary);
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

/* XML 语法高亮 */
.tree-content :deep(.xml-tag) {
  color: #569cd6;
}

.tree-content :deep(.xml-attr-name) {
  color: #9cdcfe;
}

.tree-content :deep(.xml-attr-value) {
  color: #ce9178;
}

.tree-content :deep(.xml-punctuation) {
  color: #808080;
}

.tree-content :deep(.xml-text) {
  color: #d4d4d4;
}

.tree-content :deep(.xml-comment) {
  color: #6a9955;
  font-style: italic;
}

.tree-content :deep(.xml-cdata) {
  color: #ce9178;
}

.tree-content :deep(.xml-collapsed-hint) {
  color: #858585;
  font-style: italic;
  margin: 0 4px;
}
</style>
