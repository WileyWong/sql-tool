import type { ErTableData, ErRelationData } from '../../../shared/types/erd'

/**
 * ER 图样式与尺寸常量（唯一来源）
 *
 * 所有节点/连线/标签的颜色、尺寸、路由参数统一在此定义，
 * 避免散落在 erd.ts、ErCanvas.vue、erdUtils.ts 中重复出现魔法值。
 */
export const ER_STYLE = {
  /** 表节点固定宽度 */
  nodeWidth: 220,
  /** 表节点最小高度 */
  nodeMinHeight: 100,
  /** 单个字段行高（用于估算节点高度） */
  fieldRowHeight: 22,
  /** 最多展示的字段数 */
  maxVisibleFields: 5,
  /** 表节点默认背景色 */
  defaultBg: '#2d2d2d',
  /** 画布背景色 */
  canvasBg: '#1e1e1e',
  /** 连线默认颜色 */
  edgeColor: '#888888',
  /** 连线选中颜色 */
  edgeColorSelected: '#4fc3f7',
  /** 连线默认线宽 */
  edgeWidth: 2,
  /** 连线选中线宽 */
  edgeWidthSelected: 3,
  /** manhattan 路由 padding */
  manhattanPadding: 20,
  /** 节点层级（高于连线，保证 port 磁吸点始终在最上层可抓取） */
  nodeZIndex: 10,
  /** 连线层级（低于节点，避免连线压住节点 port 导致无法建新连线） */
  edgeZIndex: 1,
} as const

/** 根据字段数量估算表节点高度 */
export function getNodeHeight(fieldCount: number): number {
  return Math.max(
    ER_STYLE.nodeMinHeight,
    Math.min(fieldCount, ER_STYLE.maxVisibleFields) * ER_STYLE.fieldRowHeight + 55
  )
}

/** 生成 x6 addNode 所需的节点元数据（唯一来源） */
export function buildNodeMeta(table: ErTableData) {
  return {
    id: table.id,
    shape: 'er-table-node',
    x: table.x,
    y: table.y,
    width: ER_STYLE.nodeWidth,
    height: getNodeHeight((table.fields || []).length),
    zIndex: ER_STYLE.nodeZIndex,
    table,
    data: table,
  }
}

/** 生成连线的默认 attrs（灰色直角线 + 目标端箭头，恢复/手画保持一致） */
export function buildEdgeAttrs() {
  return {
    line: {
      stroke: ER_STYLE.edgeColor,
      strokeWidth: ER_STYLE.edgeWidth,
      targetMarker: { name: 'block', width: 12, height: 8 },
    },
  }
}

/**
 * 生成连线关联字段标签（唯一来源）
 * @returns 单个 label 对象；无关联字段时返回 null（调用方据此 setLabels([])）
 */
export function buildEdgeLabel(sourceFields: string[], targetFields: string[]) {
  if (!sourceFields?.length || !targetFields?.length) return null
  const text = sourceFields
    .map((s, i) => `${s} = ${targetFields[i] || targetFields[0]}`)
    .join('\n')
  return {
    attrs: {
      text: { text, fill: '#d4d4d4', fontSize: 11 },
      rect: {
        fill: '#1e1e1e',
        stroke: '#555555',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
        refWidth: '120%',
        refHeight: '120%',
        refX: -10,
        refY: -10,
      },
    },
  }
}

/** 生成 x6 addEdge 所需的连线元数据（唯一来源） */
export function buildEdgeMeta(relation: ErRelationData) {
  return {
    id: relation.id,
    source: { cell: relation.sourceTableId },
    target: { cell: relation.targetTableId },
    router: { name: 'manhattan', args: { padding: ER_STYLE.manhattanPadding } },
    connector: { name: 'rounded' },
    attrs: buildEdgeAttrs(),
    labels: [] as any[],
    zIndex: ER_STYLE.edgeZIndex,
    vertices: relation.vertices,
    data: {
      id: relation.id,
      sourceTableId: relation.sourceTableId,
      targetTableId: relation.targetTableId,
      sourceFields: relation.sourceFields || [],
      targetFields: relation.targetFields || [],
    },
  }
}

/** 生成表节点的 innerHTML */
export function buildTableHtml(table: ErTableData, selected = false): string {
  const border = selected ? `2px solid ${ER_STYLE.edgeColorSelected}` : '2px solid #555'
  const displayFields = (table.fields || []).slice(0, ER_STYLE.maxVisibleFields)
  const fieldsHtml = displayFields.map((f, i) => {
    const bg = i % 2 === 1 ? 'background:rgba(255,255,255,0.03);' : ''
    const pkIcon = f.isPrimaryKey ? '🔑' : ''
    return `<div style="padding:3px 12px;display:flex;justify-content:space-between;font-size:12px;${bg}"><span style="color:#d4d4d4;">${pkIcon}${esc(f.name)}</span><span style="color:#888;font-size:11px;">${esc(f.type)}</span></div>`
  }).join('')

  const fieldCount = (table.fields || []).length
  const moreHtml = fieldCount > ER_STYLE.maxVisibleFields
    ? `<div style="padding:3px 12px;color:#666;font-size:11px;text-align:center;border-top:1px solid rgba(85,85,85,0.4);margin-top:2px;">...等 ${fieldCount} 个字段</div>`
    : ''

  return `<div style="border:${border};border-radius:8px;width:${ER_STYLE.nodeWidth}px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;background:${table.backgroundColor || ER_STYLE.defaultBg};font-family:sans-serif;"><div style="padding:8px 12px;font-weight:bold;color:#d4d4d4;font-size:13px;text-align:center;">${esc(table.name)}</div><div style="height:1px;background:#555;margin:0 8px;"></div>${fieldsHtml}${moreHtml}</div>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
