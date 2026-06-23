<template>
  <div ref="canvasContainer" class="er-canvas" tabindex="0" @keydown.delete.prevent="handleDeleteKey">
    <!-- 右键菜单 -->
    <div 
      v-if="contextMenu.visible" 
      class="context-menu" 
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @mousedown.prevent.stop
    >
      <div v-if="contextMenu.type === 'canvas'" class="menu-item" @click="handleAddTable">
        ➕ {{ $t('erd.addTable') }}
      </div>
      <div v-if="contextMenu.type === 'node'" class="menu-item" @click="handleFormatNode">
        🎨 {{ $t('erd.format') }}
      </div>
      <div v-if="contextMenu.type === 'node' || contextMenu.type === 'edge'" class="menu-item dangerous" @click="handleDeleteSelected">
        🗑 {{ $t('erd.deleteElement') }}
      </div>
      <div v-if="contextMenu.type === 'canvas' && selectionCellCount >= 2" class="menu-item dangerous" @click="handleDeleteSelected">
        🗑 删除选中 ({{ selectionCellCount }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Graph, Markup, Selection } from '@antv/x6'
import { useEditorStore } from '../../stores/editor'
import { useErdStore } from '../../stores/erd'
import { useConnectionStore } from '../../stores/connection'
import type { ErTableData } from '../../../shared/types/erd'
import { buildTableHtml, buildEdgeAttrs, ER_STYLE } from './erdUtils'

const { t } = useI18n()
const editorStore = useEditorStore()
const erdStore = useErdStore()
const connectionStore = useConnectionStore()

const canvasContainer = ref<HTMLElement>()
const erdPanel = inject<{
  openTableSelector: (pos?: { x: number; y: number } | null) => void
  openFormatDialog: (color: string) => void
  openRelationDialog: (sourceTable: ErTableData, targetTable: ErTableData, edgeId: string) => void
  getConnectionId: () => string
  getDatabase: () => string
}>('erdPanel')

const contextMenu = ref({ visible: false, x: 0, y: 0, type: 'canvas' as 'canvas' | 'node' | 'edge' })
const dropPosition = ref<{ x: number; y: number } | null>(null)

const selectionCellCount = ref(0)

/** x6 Graph + Selection 插件实例 */
let graph: Graph | null = null
let selection: Selection | null = null

/** ===== 选中高亮辅助（手工更新 HTML 边框颜色） ===== */
function applyHighlight(cell: import('@antv/x6').Cell) {
  if (cell.isNode()) {
    const d = (cell as any).getData?.() as ErTableData | undefined
    if (d?.fields) cell.setAttrs({ fo: { html: buildTableHtml(d, true) } })
  } else if (cell.isEdge()) {
    cell.attr('line/stroke', ER_STYLE.edgeColorSelected)
    cell.attr('line/strokeWidth', ER_STYLE.edgeWidthSelected)
  }
}
function removeHighlight(cell: import('@antv/x6').Cell) {
  if (cell.isNode()) {
    const d = (cell as any).getData?.() as ErTableData | undefined
    if (d?.fields) cell.setAttrs({ fo: { html: buildTableHtml(d, false) } })
  } else if (cell.isEdge()) {
    cell.attr('line/stroke', ER_STYLE.edgeColor)
    cell.attr('line/strokeWidth', ER_STYLE.edgeWidth)
  }
}

/**
 * 初始化 x6 画布 + Selection 插件
 *
 * 架构概览:
 *   节点渲染: 注册 'er-table-node' 自定义节点
 *     ├── markup: rect(body) + foreignObject(fo) 双层结构
 *     └── ports: 上/右/下/左 4 个端口圆圈，hover 时程序化显示
 *
 *   Graph 配置:
 *     ├── connecting: manhattan 直角路由，端口拖出→节点落点
 *     ├── mousewheel: Ctrl+滚轮缩放
 *     └── panning: Ctrl+左键拖拽平移
 *
 *   Selection 插件:
 *     ├── rubberband: 无修饰键左键拖拽 = 框选
 *     ├── multiple: true → Shift+click 追加选择
 *     └── movable: true → 选中节点可批量拖拽移动
 *
 *   事件绑定:
 *     ├── node:mouseenter/mouseleave → 端口显隐
 *     ├── edge:connected → 连线完成
 *     ├── edge:dblclick → 打开字段选择
 *     ├── cell:selected/unselected → 手工高亮
 *     └── cell:contextmenu / blank:contextmenu → 右键菜单
 */
function initGraph() {
  if (!canvasContainer.value) return

  const foMarkup = Markup.getForeignObjectMarkup()
  // @ts-ignore - x6 v3 registerNode type overload
  Graph.registerNode('er-table-node', {
    inherit: 'rect',
    markup: [
      { tagName: 'rect', selector: 'body' },
      foMarkup
    ],
    attrs: {
      body: {
        fill: '#ffffff', fillOpacity: 0, strokeWidth: 0,
        refWidth: '100%', refHeight: '100%', rx: 8, ry: 8
      },
      fo: {
        refWidth: '100%', refHeight: '100%', width: 220,
        style: { pointerEvents: 'none' }
      }
    },
    portMarkup: [
      { tagName: 'circle', selector: 'portBody', attrs: { r: 6, magnet: true, stroke: '#888', strokeWidth: 2, fill: '#2d2d2d' } }
    ],
    ports: {
      groups: {
        top: { position: 'top' }, right: { position: 'right' },
        bottom: { position: 'bottom' }, left: { position: 'left' }
      },
      items: [
        { id: 'port-top', group: 'top' }, { id: 'port-right', group: 'right' },
        { id: 'port-bottom', group: 'bottom' }, { id: 'port-left', group: 'left' }
      ]
    },
    propHooks(metadata: any) {
      const { table } = metadata
      if (table) {
        metadata.attrs = { ...metadata.attrs, fo: { ...metadata.attrs?.fo, html: buildTableHtml(table) } }
      }
      return metadata
    }
  }, true)

  graph = new Graph({
    container: canvasContainer.value,
    autoResize: true,
    background: { color: ER_STYLE.canvasBg },
    grid: { size: 10, visible: true },
    connecting: {
      router: { name: 'manhattan', args: { padding: ER_STYLE.manhattanPadding } },
      connector: { name: 'rounded' },
      allowBlank: false, allowLoop: false,
      allowNode: true, allowPort: true, allowMulti: false,
      highlight: true,
      validateConnection({ sourceCell, targetCell }) {
        if (!sourceCell || !targetCell) return false
        if (sourceCell.id === targetCell.id) return false
        const hasDup = graph!.getEdges().some(e => {
          return e.getSourceCellId() === sourceCell.id && e.getTargetCellId() === targetCell.id
        })
        return !hasDup
      },
      createEdge() { return this.createEdge({ shape: 'edge' }) }
    },
    mousewheel: { enabled: true, modifiers: 'ctrl', zoomAtMousePosition: true },
    panning: { enabled: true, modifiers: 'ctrl' },
    interacting: { edgeMovable: true }
  })

  // ===== Selection 插件（框选 + 多选拖拽） =====
  selection = new Selection({
    enabled: true,
    rubberband: true,    // 无修饰键左键拖拽 = 框选
    multiple: true,      // Shift/Ctrl+click 多选
    movable: true,       // 选中节点可批量拖拽移动
    strict: false,       // 不需要完全包围
  })
  graph.use(selection)

  // Selection 插件自带高亮类 .x6-node-selected，但我们是 foreignObject，
  // 仍需手工更新 fo.html。用 cell:selected/unselected 事件同步视觉高亮，
  // 同时把选中态同步到 erdStore.selectedCell（格式/删除统一走 selectedCell）。
  graph.on('cell:selected', ({ cell }) => {
    erdStore.setSelectedCell(cell)
    applyHighlight(cell)
    updateSelectionCount()
  })
  graph.on('cell:unselected', ({ cell }) => {
    if (erdStore.selectedCell?.id === cell.id) erdStore.setSelectedCell(null)
    removeHighlight(cell)
    updateSelectionCount()
  })

  // ===== 端口 hover 显隐 =====
  const allPorts = ['port-top', 'port-right', 'port-bottom', 'port-left']
  graph.on('node:mouseenter', ({ node }) => allPorts.forEach(p => node.setPortProp(p, 'attrs/portBody/style/visibility', 'visible')))
  graph.on('node:mouseleave', ({ node }) => allPorts.forEach(p => node.setPortProp(p, 'attrs/portBody/style/visibility', 'hidden')))
  graph.on('node:added', ({ node }) => allPorts.forEach(p => node.setPortProp(p, 'attrs/portBody/style/visibility', 'hidden')))

  // ===== 连线完成 =====
  // 去重已由 connecting.validateConnection 保证（重复时直接阻止连接），此处无需再判重。
  graph.on('edge:connected', ({ edge, currentCell }) => {
    const sourceCell = edge.getSourceCell()
    if (!sourceCell || !currentCell) return
    edge.setLabels([])
    edge.setAttrs(buildEdgeAttrs())
    erdStore.addRelation(sourceCell.id, currentCell.id, edge.id)
  })

  // ===== 双击连线 → 字段选择 =====
  graph.on('edge:dblclick', ({ edge }) => {
    const sourceNode = edge.getSourceNode(); const targetNode = edge.getTargetNode()
    if (sourceNode && targetNode && erdPanel) {
      erdPanel.openRelationDialog(sourceNode.getData() as ErTableData, targetNode.getData() as ErTableData, edge.id)
    }
  })

  // ===== 右键菜单 =====
  graph.on('cell:contextmenu', ({ e, cell }) => {
    e.preventDefault()
    // 若右键的 cell 不在当前选区，则单选它 → 触发 cell:selected 同步 selectedCell
    if (graph && !graph.isSelected(cell)) {
      graph.cleanSelection()
      graph.select(cell)
    }
    updateSelectionCount()
    if (cell.isNode()) contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'node' }
    else if (cell.isEdge()) contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'edge' }
  })
  graph.on('blank:contextmenu', ({ e }) => {
    e.preventDefault()
    updateSelectionCount()
    if (graph) {
      const local = graph.clientToLocal(e.clientX, e.clientY)
      dropPosition.value = { x: local.x, y: local.y }
    }
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'canvas' }
  })

  // 关闭菜单
  graph.on('blank:mousedown', () => {
    contextMenu.value.visible = false
    canvasContainer.value?.focus()
  })

  erdStore.setGraph(graph)

  // 从持久化数据恢复画布（渲染逻辑统一收敛在 erdStore）
  const tab = editorStore.activeTab
  if (tab?.erdData) erdStore.renderFromErdData(tab.erdData)
}

function updateSelectionCount() {
  selectionCellCount.value = graph?.getSelectedCells().length ?? 0
}

function handleDeleteKey() {
  erdStore.removeCells(graph?.getSelectedCells() ?? [])
  contextMenu.value.visible = false
}

function handleAddTable() {
  contextMenu.value.visible = false
  const connId = connectionStore.connections.find(c => c.status === 'connected')?.id
  if (!connId) { ElMessage.warning(t('erd.noDatabase')); return }
  erdPanel?.openTableSelector(dropPosition.value)
  dropPosition.value = null
}

function handleFormatNode() {
  contextMenu.value.visible = false
  const cell = erdStore.selectedCell
  if (!cell?.isNode()) return
  const data = cell.getData() as ErTableData
  erdPanel?.openFormatDialog(data.backgroundColor || ER_STYLE.defaultBg)
}

/** 删除当前选中的节点/连线（右键菜单"删除"与"删除选中 N"共用） */
function handleDeleteSelected() {
  contextMenu.value.visible = false
  erdStore.removeCells(graph?.getSelectedCells() ?? [])
}

watch(() => editorStore.activeTabId, (newId) => {
  if (newId !== erdStore.activeTabId) {
    erdStore.dispose()
    graph = null
    selection = null
  }
})

onMounted(() => {
  erdStore.init(editorStore.activeTabId || '')
  initGraph()
})

onUnmounted(() => {
  erdStore.dispose()
  graph = null
  selection = null
})
</script>

<style scoped>
.er-canvas { width: 100%; height: 100%; outline: none; position: relative; }

.context-menu {
  position: fixed;
  background: var(--bg-surface, #2d2d2d);
  border: 1px solid var(--border-color, #555);
  border-radius: 6px;
  padding: 4px 0;
  min-width: 160px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text-primary, #d4d4d4);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.menu-item:hover { background: var(--bg-elevated, #3c3c3c); }
.menu-item.dangerous { color: #f48771; }
.menu-item.dangerous:hover { background: rgba(244, 135, 113, 0.15); }
</style>
