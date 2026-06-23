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
import type { Graph, Cell, Node, Edge } from '@antv/x6'
import type { ErDiagramFile, ErTableData, ErRelationData, ErFieldData } from '../../shared/types/erd'
import { createEmptyErDiagram } from '../../shared/types/erd'
import { useEditorStore } from './editor'
import { buildTableHtml } from '../components/ErDiagram/erdUtils'
import { v4 as uuidv4 } from 'uuid'

export const useErdStore = defineStore('erd', () => {
  // === 运行时状态 ===
  const graph = shallowRef<Graph | null>(null)
  const selectedCell = shallowRef<Cell | null>(null)
  const isDirty = ref(false)
  
  // 当前活跃的 ER 图标签页 ID（用于关联 editorStore 中的 tab）
  const activeTabId = ref<string | null>(null)

  // === 初始化 ===
  function init(tabId: string, data?: ErDiagramFile) {
    activeTabId.value = tabId
    if (data) {
      // 从持久化数据恢复
      isDirty.value = false
    } else {
      // 新建空白 ER 图
      isDirty.value = false
    }
  }

  // === Graph 注册 ===
  function setGraph(g: Graph) {
    graph.value = g
  }

  // === 节点操作 ===
  function addTable(table: ErTableData) {
    if (!graph.value) return
    
    // 分配画布位置（如果没有指定坐标）
    if (table.x === undefined || table.y === undefined) {
      const nodes = graph.value.getNodes()
      const offsetX = nodes.length > 0 ? (nodes.length % 4) * 260 : 50
      const offsetY = nodes.length > 0 ? Math.floor(nodes.length / 4) * 300 : 50
      table.x = offsetX + 50
      table.y = offsetY + 50
    }

    graph.value.addNode({
      id: table.id,
      shape: 'er-table-node',
      x: table.x,
      y: table.y,
      width: 220,
      height: Math.max(100, Math.min(table.fields.length, 5) * 22 + 55),
      table: table,
      data: table
    })
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
    markDirty()
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
      graph.value.addEdge({
        id: edgeId,
        source: { cell: sourceTableId },
        target: { cell: targetTableId },
        router: {
          name: 'manhattan',
          args: { padding: 20 }
        },
        connector: { name: 'rounded' },
        attrs: {
          line: {
            stroke: '#888888',
            strokeWidth: 2,
            targetMarker: null
          }
        },
        labels: [],
        data: {
          id: edgeId,
          sourceTableId,
          targetTableId,
          sourceFields: [] as string[],
          targetFields: [] as string[]
        }
      })
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

    // 更新连线标签
    if (sourceFields.length > 0 && targetFields.length > 0) {
      const labelText = sourceFields.map((s, i) => {
        const t = targetFields[i] || targetFields[0]
        return `${s} = ${t}`
      }).join('\n')
      
      edge.setLabels([{
        attrs: {
          text: { text: labelText, fill: '#d4d4d4', fontSize: 11 },
          rect: {
            fill: '#1e1e1e',
            stroke: '#555555',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
            refWidth: '120%',
            refHeight: '120%',
            refX: -10,
            refY: -10
          }
        }
      }])
    } else {
      edge.setLabels([])
    }
    markDirty()
  }

  // === 格式操作 ===
  function updateTableBackground(tableId: string, color: string) {
    if (!graph.value) return
    const node = graph.value.getCellById(tableId)
    if (!node || !node.isNode()) return

    const data = node.getData() as import('../../../shared/types/erd').ErTableData
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
    activeTabId.value = null
  }

  return {
    // 状态
    graph,
    selectedCell,
    isDirty,
    activeTabId,

    // 初始化
    init,
    setGraph,

    // 节点
    addTable,
    removeTable,

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
