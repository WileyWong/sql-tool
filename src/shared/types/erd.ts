/**
 * ER 图数据类型定义
 */

export interface ErFieldData {
  name: string                     // 字段名
  type: string                     // 字段类型（如 varchar(255)）
  isPrimaryKey?: boolean
}

export interface ErTableData {
  id: string                       // UUID
  name: string                     // 表名
  schema?: string                  // schema（SQL Server）
  databaseName: string             // 所属数据库
  connectionId: string             // 所属连接 ID
  x: number                        // 画布坐标 X
  y: number                        // 画布坐标 Y
  backgroundColor?: string         // 背景色，默认 '#2d2d2d'
  fields: ErFieldData[]            // 所有字段
}

export interface ErRelationData {
  id: string                       // UUID
  sourceTableId: string            // 源表节点 ID
  targetTableId: string            // 目标表节点 ID
  sourceFields: string[]           // 源表关联字段名列表
  targetFields: string[]           // 目标表关联字段名列表
  vertices?: { x: number; y: number }[]  // 连线拐点
}

export interface ErDiagramFile {
  version: 1
  name: string                     // ER 图名称
  savedAt: string                  // ISO 时间
  tables: ErTableData[]
  relations: ErRelationData[]
}

/** 创建空的 ER 图数据 */
export function createEmptyErDiagram(): ErDiagramFile {
  return {
    version: 1,
    name: '',
    savedAt: new Date().toISOString(),
    tables: [],
    relations: []
  }
}
