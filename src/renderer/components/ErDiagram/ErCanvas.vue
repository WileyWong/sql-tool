<template>
  <div ref="canvasContainer" class="er-canvas" tabindex="0" @keydown.delete.prevent="handleDeleteKey">
    <!-- 框选矩形 -->
    <div v-if="rubberBand.show" class="rubber-band" :style="rubberBandStyle"></div>

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
      <div v-if="selectedCells.size >= 2" class="menu-item dangerous" @click="handleBatchDelete">
        🗑 删除选中 ({{ selectedCells.size }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Graph, Markup } from '@antv/x6'
import { useEditorStore } from '../../stores/editor'
import { useErdStore } from '../../stores/erd'
import { useConnectionStore } from '../../stores/connection'
import type { ErTableData } from '../../../shared/types/erd'
import { buildTableHtml } from './erdUtils'

const { t } = useI18n()
const editorStore = useEditorStore()
const erdStore = useErdStore()
const connectionStore = useConnectionStore()

const canvasContainer = ref<HTMLElement>()
const erdPanel = inject<{
  openTableSelector: () => void
  openFormatDialog: (color: string) => void
  openRelationDialog: (sourceTable: ErTableData, targetTable: ErTableData, edgeId: string) => void
  getConnectionId: () => string
  getDatabase: () => string
}>('erdPanel')

const contextMenu = ref({ visible: false, x: 0, y: 0, type: 'canvas' as 'canvas' | 'node' | 'edge' })
let contextMenuCell: import('@antv/x6').Cell | null = null  // 右键菜单目标 Cell

// ===== 框选状态 =====
const rubberBand = ref({ show: false, x: 0, y: 0, width: 0, height: 0 })
const rubberBandStyle = computed(() => ({
  left: `${rubberBand.value.x}px`,
  top: `${rubberBand.value.y}px`,
  width: `${rubberBand.value.width}px`,
  height: `${rubberBand.value.height}px`
}))
const selectedCells = reactive(new Set<string>())  // 多选 cell ID 集合
let rubberBandStart = { x: 0, y: 0 }

/** x6 可视化 Graph 实例 —— 画布上所有节点、连线、事件都由它管理 */
let graph: Graph | null = null

/** 框选全局事件处理器（挂 document，卸载时移除） */
let rbMoveHandler: ((e: MouseEvent) => void) | null = null
let rbUpHandler: (() => void) | null = null

/** 上一次选中的 Cell（节点或连线），用于取消高亮时恢复样式 */
let lastSelectedCell: import('@antv/x6').Cell | null = null

/** 清除所有多选高亮 */
function clearAllSelectedCells() {
  if (!graph) return
  selectedCells.forEach(id => {
    const cell = graph!.getCellById(id)
    if (cell) {
      if (cell.isNode()) {
        const d = (cell as any).getData?.() as ErTableData | undefined
        if (d?.fields) cell.setAttrs({ fo: { html: buildTableHtml(d, false) } })
      } else if (cell.isEdge()) { cell.attr('line/stroke', '#888888'); cell.attr('line/strokeWidth', 2) }
    }
  })
  selectedCells.clear()
}

/** 判断 cell 的 bounding box 是否与矩形相交（框选检测） */
function isCellInRect(cell: import('@antv/x6').Cell, rect: { x: number; y: number; width: number; height: number }): boolean {
  const bbox = cell.getBBox()
  return !(bbox.x + bbox.width < rect.x || rect.x + rect.width < bbox.x ||
           bbox.y + bbox.height < rect.y || rect.y + rect.height < bbox.y)
}

/** 清除选中高亮：节点 → 重建 HTML 去掉蓝色边框；连线 → 恢复灰色 */
function clearSelectionHighlight() {
  if (!lastSelectedCell || !graph) return
  if (lastSelectedCell.isNode()) {
    const data = (lastSelectedCell as any).getData?.() as ErTableData | undefined
    if (data?.fields) {
      lastSelectedCell.setAttrs({ fo: { html: buildTableHtml(data, false) } })
    }
  } else if (lastSelectedCell.isEdge()) {
    lastSelectedCell.attr('line/stroke', '#888888')
    lastSelectedCell.attr('line/strokeWidth', 2)
  }
  lastSelectedCell = null
}

/**
 * 初始化 x6 画布
 *
 * 架构概览:
 *   节点渲染: 注册 'er-table-node' 自定义节点
 *     ├── markup: rect(body) + foreignObject(fo) 双层结构
 *     │   ├── body rect: SVG 层，fillOpacity=0 透明但可命中鼠标事件
 *     │   └── fo foreignObject: HTML 层，pointer-events=none 穿透到 body
 *     ├── ports: 上/右/下/左 4 个端口圆圈，hover 时程序化显示
 *     └── propHooks: 节点实例化时自动将 table 数据注入 fo.html
 *
 *   Graph 配置:
 *     ├── connecting: manhattan 直角路由，端口拖出→节点落点
 *     ├── mousewheel: Ctrl+滚轮缩放
 *     └── panning: Ctrl+左键拖拽平移画布（避免与框选拖拽冲突）
 *
 *   事件绑定:
 *     ├── node:mouseenter/mouseleave → 端口显隐
 *     ├── edge:connected → 连线完成（去重+样式+注册关系）
 *     ├── edge:dblclick → 打开字段选择弹窗
 *     ├── cell:click / blank:click → 选中高亮
 *     └── cell:contextmenu / blank:contextmenu → 右键菜单
 */
function initGraph() {
  if (!canvasContainer.value) return

  // ===== 注册自定义节点类型 'er-table-node' =====
  // markup 决定节点的 DOM 结构，propHooks 在每个节点 add 时自动执行
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
        fill: '#ffffff',
        fillOpacity: 0,
        strokeWidth: 0,
        refWidth: '100%',
        refHeight: '100%',
        rx: 8,
        ry: 8
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
        width: 220,
        style: { pointerEvents: 'none' }
      }
    },
    portMarkup: [
      { tagName: 'circle', selector: 'portBody', attrs: { r: 6, magnet: true, stroke: '#888', strokeWidth: 2, fill: '#2d2d2d' } }
    ],
    ports: {
      groups: {
        top:    { position: 'top' },
        right:  { position: 'right' },
        bottom: { position: 'bottom' },
        left:   { position: 'left' }
      },
      items: [
        { id: 'port-top',    group: 'top' },
        { id: 'port-right',  group: 'right' },
        { id: 'port-bottom', group: 'bottom' },
        { id: 'port-left',   group: 'left' }
      ]
    },
    propHooks(metadata: any) {
      const { table } = metadata
      if (table) {
        metadata.attrs = {
          ...metadata.attrs,
          fo: {
            ...metadata.attrs?.fo,
            html: buildTableHtml(table)
          }
        }
      }
      return metadata
    }
  }, true)

  // ===== 创建 x6 Graph 实例 =====
  // connecting: 连线交互配置（manhattan 直角路由、端口拖出→节点落点）
  // mousewheel: 滚轮缩放  panning: Shift+拖拽平移画布
  graph = new Graph({
    container: canvasContainer.value,
    background: { color: '#1e1e1e' },
    grid: { size: 10, visible: true },
    autoResize: true,
    connecting: {
      router: { name: 'manhattan', args: { padding: 20 } },
      connector: { name: 'rounded' },
      allowBlank: false,
      allowLoop: false,
      allowNode: true,       // 允许落到目标节点任意位置完成连线
      allowPort: true,
      allowMulti: false,
      highlight: true,
      validateConnection({ sourceCell, targetCell }) {
        if (!sourceCell || !targetCell) return false
        if (sourceCell.id === targetCell.id) return false
        // 检查是否已存在同方向连线
        const allEdges = graph!.getEdges()
        const hasDup = allEdges.some(e => {
          const s = e.getSourceCellId()
          const t = e.getTargetCellId()
          return s === sourceCell.id && t === targetCell.id
        })
        if (hasDup) return false
        return true
      },
      createEdge() { return this.createEdge({ shape: 'edge' }) }
    },
    mousewheel: { enabled: true, modifiers: 'ctrl', zoomAtMousePosition: true },  // Ctrl+滚轮缩放
    panning: { enabled: true, modifiers: 'ctrl' },  // Ctrl+左键拖拽平移画布
    interacting: { edgeMovable: false }
  })

  // ===== 端口 hover 显隐 =====
  // x6 端口在注册时定义，通过 setPortProp() 动态控制 visibility
  // 鼠标进入节点 → 显示 4 个方向的端口圆圈；离开 → 隐藏
  const allPorts = ['port-top', 'port-right', 'port-bottom', 'port-left']
  graph.on('node:mouseenter', ({ node }) => {
    allPorts.forEach(pid => node.setPortProp(pid, 'attrs/portBody/style/visibility', 'visible'))
  })
  graph.on('node:mouseleave', ({ node }) => {
    allPorts.forEach(pid => node.setPortProp(pid, 'attrs/portBody/style/visibility', 'hidden'))
  })
  graph.on('node:added', ({ node }) => {
    allPorts.forEach(pid => node.setPortProp(pid, 'attrs/portBody/style/visibility', 'hidden'))
  })

  // ===== 连线完成事件 =====
  // 用户从端口拖出连线并在目标节点释放后触发
  // 1. 去重检查（A→B 同方向只保留一条线）
  // 2. 设置连线样式（灰色、无箭头）
  // 3. 注册关系到 erdStore
  graph.on('edge:connected', ({ edge, currentCell }) => {
    const sourceCell = edge.getSourceCell()
    if (!sourceCell || !currentCell) return
    // 检查除去当前边外是否已存在同方向连线
    const allEdges = graph!.getEdges()
    const dupCount = allEdges.filter(e => {
      if (e.id === edge.id) return false
      const s = e.getSourceCellId(); const t = e.getTargetCellId()
      return s === sourceCell.id && t === currentCell.id
    }).length
    if (dupCount > 0) {
      graph!.removeCell(edge)
      return
    }
    edge.setLabels([])
    edge.setAttrs({ line: { stroke: '#888888', strokeWidth: 2, targetMarker: null } })
    erdStore.addRelation(sourceCell.id, currentCell.id, edge.id)
  })

  // 双击连线 → 打开字段选择
  graph.on('edge:dblclick', ({ edge }) => {
    const sourceNode = edge.getSourceNode()
    const targetNode = edge.getTargetNode()
    if (sourceNode && targetNode && erdPanel) {
      erdPanel.openRelationDialog(
        (sourceNode as any).getData() as ErTableData,
        (targetNode as any).getData() as ErTableData,
        edge.id
      )
    }
  })

  // ===== 选中高亮 =====
  // 节点：重建 fo.html 把边框从 #555 改成蓝色 #4fc3f7
  // 连线：修改 stroke 颜色为蓝色加粗
  function applySelectionHighlight(cell: import('@antv/x6').Cell) {
    if (cell.isNode()) {
      const data = (cell as any).getData?.() as ErTableData | undefined
      if (data?.fields) {
        cell.setAttrs({ fo: { html: buildTableHtml(data, true) } })
      }
    } else if (cell.isEdge()) {
      cell.attr('line/stroke', '#4fc3f7')
      cell.attr('line/strokeWidth', 3)
    }
  }

  // cell:click —— x6 统一事件，节点和连线点击都会触发
  graph.on('cell:click', ({ cell }) => {
    clearAllSelectedCells()
    clearSelectionHighlight()
    applySelectionHighlight(cell)
    lastSelectedCell = cell
    erdStore.selectedCell = cell
    canvasContainer.value?.focus()
  })
  graph.on('blank:click', () => {
    clearAllSelectedCells()
    clearSelectionHighlight()
    erdStore.selectedCell = null
    canvasContainer.value?.focus()
  })

  // ===== 右键菜单 =====
  // cell:contextmenu —— 节点/连线上右键 → 显示“格式”/“删除”
  // blank:contextmenu —— 画布空白区域右键 → 显示“添加表”
  // 用 contextMenuCell 单独存储右键目标，防止 blank:mousedown 把 selectedCell 清掉
  graph.on('cell:contextmenu', ({ e, cell }) => {
    e.preventDefault()
    erdStore.selectedCell = cell
    contextMenuCell = cell  // 存储右键目标，防止 blank:mousedown 清掉 selectedCell
    if (cell.isNode()) {
      contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'node' }
    } else if (cell.isEdge()) {
      contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'edge' }
    }
  })
  graph.on('blank:contextmenu', ({ e }) => {
    e.preventDefault()
    erdStore.selectedCell = null
    contextMenu.value = { visible: true, x: e.clientX, y: e.clientY, type: 'canvas' }
  })

  // ===== 框选 =====
  // blank:mousedown → 开始框选（记录起点，显示矩形）
  // document mousemove → 更新矩形大小
  // document mouseup → 查找矩形内 cell，多选高亮
  graph.on('blank:mousedown', ({ e }) => {
    // Ctrl 按下时留给 panning，不触发框选
    if (e.ctrlKey || e.metaKey) return
    clearAllSelectedCells()
    erdStore.selectedCell = null
    contextMenu.value.visible = false
    canvasContainer.value?.focus()
    // 记录框选起点
    const rect = canvasContainer.value!.getBoundingClientRect()
    rubberBandStart = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    rubberBand.value = { show: true, x: rubberBandStart.x, y: rubberBandStart.y, width: 0, height: 0 }
  })

  rbMoveHandler = (e: MouseEvent) => {
    if (!rubberBand.value.show) return
    const rect = canvasContainer.value!.getBoundingClientRect()
    const cx = e.clientX - rect.left; const cy = e.clientY - rect.top
    rubberBand.value.x = Math.min(rubberBandStart.x, cx)
    rubberBand.value.y = Math.min(rubberBandStart.y, cy)
    rubberBand.value.width = Math.abs(cx - rubberBandStart.x)
    rubberBand.value.height = Math.abs(cy - rubberBandStart.y)
  }
  rbUpHandler = () => {
    if (!rubberBand.value.show || !graph) return
    rubberBand.value.show = false
    if (rubberBand.value.width < 5 && rubberBand.value.height < 5) return  // 太小=点击
    // 查找矩形内的 cell 并高亮
    graph.getCells().forEach(cell => {
      if (isCellInRect(cell, rubberBand.value)) {
        selectedCells.add(cell.id)
        if (cell.isNode()) {
          const d = (cell as any).getData?.() as ErTableData | undefined
          if (d?.fields) cell.setAttrs({ fo: { html: buildTableHtml(d, true) } })
        }
        else if (cell.isEdge()) { cell.attr('line/stroke', '#4fc3f7'); cell.attr('line/strokeWidth', 3) }
      }
    })
  }
  document.addEventListener('mousemove', rbMoveHandler!)
  document.addEventListener('mouseup', rbUpHandler!)

  // 将 Graph 实例注入 erdStore，后续增删改操作都通过 erdStore 方法
  erdStore.setGraph(graph)

  // 从 editorStore 恢复上次保存的 ER 图数据
  const tab = editorStore.activeTab
  if (tab?.erdData) {
    renderFromErdData(tab.erdData)
  }
}

/** 从持久化数据恢复画布上的节点和连线 */
function renderFromErdData(data: Parameters<typeof erdStore.addTable>[0] extends ErTableData ? any : never) {
  if (!graph) return
  const d = data as import('../../../shared/types/erd').ErDiagramFile
  // 恢复所有表节点（propHooks 会自动将 table 数据注入 foreignObject）
  d.tables.forEach((t: ErTableData) => {
    graph!.addNode({
      id: t.id,
      shape: 'er-table-node',
      x: t.x,
      y: t.y,
      width: 220,
      height: Math.max(100, Math.min(t.fields.length, 5) * 22 + 55),
      table: t,
      data: t
    })
  })
  d.relations.forEach((r: import('../../../shared/types/erd').ErRelationData) => {
    graph!.addEdge({
      id: r.id,
      source: { cell: r.sourceTableId },
      target: { cell: r.targetTableId },
      router: { name: 'manhattan', args: { padding: 20 } },
      connector: { name: 'rounded' },
      attrs: { line: { stroke: '#888888', strokeWidth: 2 } },
      vertices: r.vertices,
      data: { id: r.id, sourceTableId: r.sourceTableId, targetTableId: r.targetTableId, sourceFields: r.sourceFields, targetFields: r.targetFields }
    })
    if (r.sourceFields.length > 0 || r.targetFields.length > 0) {
      const labelText = r.sourceFields.map((s, i) => `${s} = ${r.targetFields[i] || r.targetFields[0]}`).join('\n')
      const edge = graph!.getCellById(r.id)
      if (edge && edge.isEdge()) {
        edge.setLabels([{ attrs: { text: { text: labelText, fill: '#d4d4d4', fontSize: 11 }, rect: { fill: '#1e1e1e', stroke: '#555555', strokeWidth: 1, rx: 4, ry: 4 } } }])
      }
    }
  })
}

function handleDeleteKey() {
  if (selectedCells.size > 0) {
    selectedCells.forEach(id => {
      const cell = graph?.getCellById(id)
      if (cell?.isNode()) erdStore.removeTable(id)
      else if (cell?.isEdge()) erdStore.removeRelation(id)
    })
    selectedCells.clear()
  } else {
    clearSelectionHighlight()
    erdStore.removeSelected()
  }
  contextMenu.value.visible = false
}

function handleBatchDelete() {
  contextMenu.value.visible = false
  selectedCells.forEach(id => {
    const cell = graph?.getCellById(id)
    if (cell?.isNode()) erdStore.removeTable(id)
    else if (cell?.isEdge()) erdStore.removeRelation(id)
  })
  selectedCells.clear()
  contextMenuCell = null
}

function handleAddTable() {
  contextMenu.value.visible = false
  const connId = connectionStore.connections.find(c => c.status === 'connected')?.id
  if (!connId) { ElMessage.warning(t('erd.noDatabase')); return }
  erdPanel?.openTableSelector()
}

function handleFormatNode() {
  contextMenu.value.visible = false
  const cell = contextMenuCell || erdStore.selectedCell
  if (!cell || !cell.isNode()) return
  const data = (cell as any).getData() as ErTableData
  erdPanel?.openFormatDialog(data.backgroundColor || '#2d2d2d')
}

function handleDeleteSelected() {
  contextMenu.value.visible = false
  clearSelectionHighlight()
  // 优先用 contextMenuCell（防止被 blank:mousedown 清掉）
  const target = contextMenuCell || erdStore.selectedCell
  if (target && target.isNode()) {
    erdStore.removeTable(target.id)
  } else if (target && target.isEdge()) {
    erdStore.removeRelation(target.id)
  }
  contextMenuCell = null
  erdStore.selectedCell = null
}

/** 切换标签页时销毁旧 Graph，释放内存 */
watch(() => editorStore.activeTabId, (newId) => {
  if (newId !== erdStore.activeTabId) {
    erdStore.dispose()
    graph = null
    lastSelectedCell = null
  }
})

onMounted(() => {
  erdStore.init(editorStore.activeTabId || '')
  initGraph()
})

onUnmounted(() => {
  if (rbMoveHandler) document.removeEventListener('mousemove', rbMoveHandler)
  if (rbUpHandler) document.removeEventListener('mouseup', rbUpHandler)
  rbMoveHandler = null
  rbUpHandler = null
  erdStore.dispose()
  graph = null
  lastSelectedCell = null
})
</script>

<style scoped>
.er-canvas { width: 100%; height: 100%; outline: none; position: relative; }

.rubber-band {
  position: absolute;
  border: 1px dashed #4fc3f7;
  background: rgba(79, 195, 247, 0.1);
  pointer-events: none;
  z-index: 9999;
}

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




