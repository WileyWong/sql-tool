import type { QueryMessage, QueryResult, QueryResultSet } from '@shared/types'
import { t } from '../../i18n'
import { getMysqlFieldTypeName, type MysqlResultField } from './field-type'

export interface MysqlOkPacket {
  affectedRows: number
  insertId?: number
  serverStatus?: number
  warningStatus?: number
  changedRows?: number
}

export interface NormalizedMysqlResult {
  rows: unknown
  fields: unknown
}

function isOkPacket(value: unknown): value is MysqlOkPacket {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  if (!('affectedRows' in obj)) return false
  return 'serverStatus' in obj
    || 'warningStatus' in obj
    || 'changedRows' in obj
    || obj.constructor?.name === 'ResultSetHeader'
}

/**
 * mysql2 在 multipleStatements 下会把多条语句的结果收成数组：
 * - 多条 DML：rows = [OkPacket, ...]，fields = [undefined, ...]
 * - 多条 SELECT：rows = [Row[], ...]，fields = [FieldPacket[], ...]
 * 单条 SELECT 则是 rows = Row[]，fields = FieldPacket[]（元素带 name）。
 */
export function normalizeMysqlQueryResult(rows: unknown, fields: unknown): NormalizedMysqlResult[] {
  if (Array.isArray(rows) && rows.length > 0) {
    const first = rows[0]
    if (isOkPacket(first) || Array.isArray(first)) {
      const fieldList = Array.isArray(fields) ? fields : []
      return rows.map((one, i) => ({ rows: one, fields: fieldList[i] }))
    }
    if (Array.isArray(fields) && fields.length > 0 && (fields[0] === undefined || Array.isArray(fields[0]))) {
      return rows.map((one, i) => ({ rows: one, fields: fields[i] }))
    }
  }
  return [{ rows, fields }]
}

export function toQueryColumns(
  fields: unknown,
  primaryKeys: string[] = []
): QueryResultSet['columns'] {
  if (!Array.isArray(fields)) return []
  return fields
    .filter((f): f is MysqlResultField => !!f && typeof f === 'object')
    .map(f => ({
      name: f.name || '',
      type: getMysqlFieldTypeName(f),
      isPrimaryKey: primaryKeys.includes(f.name || '')
    }))
}

export function toQueryMessage(
  result: MysqlOkPacket,
  executionTime: number
): QueryMessage {
  const affectedRows = result.affectedRows ?? 0
  const affectedRowsKey = affectedRows === 1 ? 'result.rowAffected' : 'result.rowsAffected'
  const affectedRowsText = t(affectedRowsKey).replace('{count}', String(affectedRows))
  return {
    type: 'message',
    affectedRows,
    message: `${affectedRowsText}${result.insertId ? `, Insert ID: ${result.insertId}` : ''}`,
    executionTime
  }
}

export function toQueryResultFromNormalized(
  normalized: NormalizedMysqlResult,
  executionTime: number,
  extras?: {
    editable?: boolean
    tableName?: string
    databaseName?: string
    primaryKeys?: string[]
  }
): QueryResult {
  const { rows, fields } = normalized
  if (isOkPacket(rows)) {
    return toQueryMessage(rows, executionTime)
  }
  if (Array.isArray(rows)) {
    const primaryKeys = extras?.primaryKeys ?? []
    return {
      type: 'resultset',
      columns: toQueryColumns(fields, primaryKeys),
      rows: rows as Record<string, unknown>[],
      rowCount: rows.length,
      executionTime,
      editable: extras?.editable,
      tableName: extras?.tableName,
      databaseName: extras?.databaseName,
      primaryKeys: primaryKeys.length > 0 ? primaryKeys : undefined
    }
  }
  return toQueryMessage({ affectedRows: 0 }, executionTime)
}
