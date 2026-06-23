/**
 * ER 图状态管理 Store
 * 
 * 职责（单一责任原则）：
 * - 持有运行时画布状态（Graph 实例、选中态、拖拽状态）
 * - 是 ER 操作的唯一写入入口
 * - isDirty 单向同步到 editorStore.activeTab.isDirty
 */
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { Graph, Cell } from '@antv/x6'
import type { ErDiagramFile, ErTableData, ErRelationData } from '../../shared/types/erd'
import { createEmptyErDiagram } from '../../shared/types/erd'
import { useEditorStore } from './editor'
import {
  buildTableHtml,
  buildNodeMeta,
  buildEdgeMeta,
  buildEdgeLabel,
} from '../components/ErDiagram/erdUtils'
import { v4 as uuidv4 } from 'uuid'

export const useErdStore = defineStore('erd', () => {
  // === 运行时状态 ===
  const graph = shallowRef<Graph | null>(null)
  const selectedCell = shallowRef<Cell | null>(null)
  const isDirty = ref(false)
  const graphVersion = ref(0)  // 画布节点变更版本号，驱动 addedTableNames 等响应式更新
  
  // 当前活跃的 ER 图标签页 ID（用于关联 editorStore 中的 tab）
  const activeTabId = ref<string | null>(null)

  // === 初始化 ===
  function init(tabId: string) {
    activeTabId.value = tabId
    isDirty.value = false
  }

  // === Graph 注册 ===
  function setGraph(g: Graph) {
    graph.value = g
  }

  /** 设置/清除当前选中的 cell（由画布 cell:selected/unselected 事件驱动） */
  function setSelectedCell(cell: Cell | null) {
    selectedCell.value = cell
  }

  /**
   * 从持久化数据恢复画布（唯一渲染入口）
   *
   * 注意：恢复属于"加载已有数据"，不应标记 isDirty。
   * 节点/连线/标签的创建规则统一走 erdUtils 工厂函数。
   */
  function renderFromErdData(data: ErDiagramFile) {
    if (!graph.value) return
    data.tables.forEach(t => graph.value!.addNode(buildNodeMeta(t)))
    data.relations.forEach(r => {
      graph.value!.addEdge(buildEdgeMeta(r))
      const label = buildEdgeLabel(r.sourceFields, r.targetFields)
      if (label) {
        const edge = graph.value!.getCellById(r.id)
        if (edge?.isEdge()) edge.setLabels([label])
      }
    })
    graphVersion.value++
  }

  // === 节点操作 ===
  function addTable(table: ErTableData) {
    if (!graph.value) return

    // 兜底：未指定坐标时按节点数量网格排布
    if (table.x === undefined || table.y === undefined) {
      const count = graph.value.getNodes().length
      table.x = 50 + (count % 4) * 260
      table.y = 50 + Math.floor(count / 4) * 300
    }

    graph.value.addNode(buildNodeMeta(table))
    graphVersion.value++
    markDirty()
  }

  function removeTable(tableId: string) {
    if (!graph.value) return
    const cell = graph.value.getCellById(tableId)
    if (cell) {
      // 删除关联的连线
      const connectedEdges = graph.value.getConnectedEdges(cell)
      connectedEdges.forEach(e => graph.value!.removeEdge(e.id))
      graph.value.removeNode(cell.id)
    }
    graphVersion.value++
    markDirty()
  }

  /** 批量删除节点/连线（节点会连带删除其关联连线） */
  function removeCells(cells: Cell[]) {
    if (!graph.value || cells.length === 0) return
    cells.forEach(c => {
      if (c.isNode()) removeTable(c.id)
      else if (c.isEdge()) removeRelation(c.id)
    })
    if (selectedCell.value && cells.some(c => c.id === selectedCell.value!.id)) {
      selectedCell.value = null
    }
  }

  // === 连线操作 ===
  function addRelation(sourceTableId: string, targetTableId: string, existingEdgeId?: string) {
    if (!graph.value) return
    if (sourceTableId === targetTableId) return // 禁止自引用

    let edge;
    if (existingEdgeId) {
      // 连接 UI 创建的边已存在，复用并更新数据
      edge = graph.value.getCellById(existingEdgeId)
      if (edge && edge.isEdge()) {
        edge.setData({
          id: existingEdgeId,
          sourceTableId,
          targetTableId,
          sourceFields: [] as string[],
          targetFields: [] as string[]
        })
      }
    } else {
      // 程序化创建新边
      const edgeId = `edge-${uuidv4()}`
      graph.value.addEdge(buildEdgeMeta({
        id: edgeId,
        sourceTableId,
        targetTableId,
        sourceFields: [],
        targetFields: [],
      }))
    }
    markDirty()
  }

  function removeRelation(edgeId: string) {
    if (!graph.value) return
    graph.value.removeEdge(edgeId)
    markDirty()
  }

  function updateRelationFields(edgeId: string, sourceFields: string[], targetFields: string[]) {
    if (!graph.value) return
    const edge = graph.value.getCellById(edgeId)
    if (!edge || !edge.isEdge()) return

    const data = edge.getData()
    data.sourceFields = sourceFields
    data.targetFields = targetFields
    edge.setData(data)

    // 更新连线标签（统一走 erdUtils.buildEdgeLabel）
    const label = buildEdgeLabel(sourceFields, targetFields)
    edge.setLabels(label ? [label] : [])
    markDirty()
  }

  // === 格式操作 ===
  function updateTableBackground(tableId: string, color: string) {
    if (!graph.value) return
    const node = graph.value.getCellById(tableId)
    if (!node || !node.isNode()) return

    const data = node.getData() as ErTableData
    data.backgroundColor = color
    node.setData(data)
    node.setAttrs({ fo: { html: buildTableHtml({ ...data, backgroundColor: color }) } })
    markDirty()
  }

  function removeSelected() {
    if (!graph.value || !selectedCell.value) return
    
    if (selectedCell.value.isNode()) {
      removeTable(selectedCell.value.id)
    } else if (selectedCell.value.isEdge()) {
      removeRelation(selectedCell.value.id)
    }
    selectedCell.value = null
  }

  // === 序列化 ===
  function serializeToErdData(): ErDiagramFile {
    if (!graph.value) return createEmptyErDiagram()

    const nodes = graph.value.getNodes()
    const edges = graph.value.getEdges()

    const tables: ErTableData[] = nodes.map(node => {
      const data = node.getData() as ErTableData
      const position = node.getPosition()
      return {
        ...data,
        x: position.x,
        y: position.y
      }
    })

    const relations: ErRelationData[] = edges.map(edge => {
      const data = edge.getData()
      const vertices = edge.getVertices()
      const sourceCell = edge.getSourceCell()
      const targetCell = edge.getTargetCell()
      return {
        id: data.id || edge.id,
        sourceTableId: sourceCell ? sourceCell.id : data.sourceTableId,
        targetTableId: targetCell ? targetCell.id : data.targetTableId,
        sourceFields: data.sourceFields || [],
        targetFields: data.targetFields || [],
        vertices: vertices.length > 0 ? vertices.map(v => ({ x: v.x, y: v.y })) : undefined
      }
    })

    return {
      version: 1,
      name: '',
      savedAt: new Date().toISOString(),
      tables,
      relations
    }
  }

  // === isDirty 管理 ===
  function markDirty() {
    isDirty.value = true
    syncDirtyToEditor()
  }

  function markClean() {
    isDirty.value = false
    syncDirtyToEditor()
  }

  function syncDirtyToEditor() {
    const editorStore = useEditorStore()
    const tab = editorStore.tabs.find(t => t.id === activeTabId.value)
    if (tab) {
      tab.isDirty = isDirty.value
    }
  }

  // === 清理 ===
  function dispose() {
    graph.value?.dispose()
    graph.value = null
    selectedCell.value = null
    isDirty.value = false
    graphVersion.value = 0
    activeTabId.value = null
  }

  return {
    // 状态
    graph,
    selectedCell,
    isDirty,
    activeTabId,
    graphVersion,

    // 初始化
    init,
    setGraph,
    setSelectedCell,
    renderFromErdData,

    // 节点
    addTable,
    removeTable,
    removeCells,

    // 连线
    addRelation,
    removeRelation,
    updateRelationFields,

    // 格式
    updateTableBackground,
    removeSelected,

    // 序列化
    serializeToErdData,

    // isDirty
    markDirty,
    markClean,

    // 清理
    dispose
  }
})
