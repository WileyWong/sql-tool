import type { ErTableData } from '../../../shared/types/erd'

/** 生成表节点的 innerHTML */
export function buildTableHtml(table: ErTableData, selected = false): string {
  const border = selected ? '2px solid #4fc3f7' : '2px solid #555'
  const displayFields = (table.fields || []).slice(0, 5)
  const fieldsHtml = displayFields.map((f, i) => {
    const bg = i % 2 === 1 ? 'background:rgba(255,255,255,0.03);' : ''
    const pkIcon = f.isPrimaryKey ? '🔑' : ''
    return `<div style="padding:3px 12px;display:flex;justify-content:space-between;font-size:12px;${bg}"><span style="color:#d4d4d4;">${pkIcon}${esc(f.name)}</span><span style="color:#888;font-size:11px;">${esc(f.type)}</span></div>`
  }).join('')
  
  const moreHtml = table.fields.length > 5
    ? `<div style="padding:3px 12px;color:#666;font-size:11px;text-align:center;border-top:1px solid rgba(85,85,85,0.4);margin-top:2px;">...等 ${table.fields.length} 个字段</div>`
    : ''

  return `<div style="border:${border};border-radius:8px;width:220px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;background:${table.backgroundColor || '#2d2d2d'};font-family:sans-serif;"><div style="padding:8px 12px;font-weight:bold;color:#d4d4d4;font-size:13px;text-align:center;">${esc(table.name)}</div><div style="height:1px;background:#555;margin:0 8px;"></div>${fieldsHtml}${moreHtml}</div>`
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
