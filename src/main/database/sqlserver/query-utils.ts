export interface SqlServerTableRef {
  databaseName?: string
  schemaName: string
  tableName: string
}

export function escapeSqlServerIdentifier(name: string): string {
  return name.replace(/]/g, ']]')
}

export function sameSqlServerDatabase(current: string | undefined, next: string | undefined): boolean {
  if (!current || !next) return false
  return current.localeCompare(next, undefined, { sensitivity: 'accent' }) === 0
}

function unquoteIdentifier(identifier: string): string {
  const trimmed = identifier.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).replace(/]]/g, ']')
  }
  return trimmed
}

/**
 * 单表 SELECT 的表引用。JOIN、多表、非 SELECT 返回 null。
 * 一段名字视为 dbo 下的表，两段视为 schema.table，三段视为 db.schema.table。
 */
export function parseSqlServerSingleTable(sqlText: string): SqlServerTableRef | null {
  const trimmed = sqlText.trim()
  if (!/^\s*SELECT\b/i.test(trimmed)) return null
  if (/\bJOIN\b/i.test(trimmed)) return null

  const fromMatch = trimmed.match(/\bFROM\s+((?:\[[^\]]+\]|[#@\w]+)(?:\s*\.\s*(?:\[[^\]]+\]|[#@\w]+)?){0,2})/i)
  if (!fromMatch) return null

  const fromIndex = trimmed.search(/\bFROM\b/i)
  const afterFrom = trimmed.substring(fromIndex + 4)
  const beforeWhere = afterFrom.split(/\bWHERE\b/i)[0]
  if (beforeWhere.includes(',')) return null

  const parts = fromMatch[1].split(/\s*\.\s*/).map(unquoteIdentifier)
  let databaseName: string | undefined
  let schemaName = 'dbo'
  let tableName: string

  if (parts.length === 1) {
    tableName = parts[0]
  } else if (parts.length === 2) {
    schemaName = parts[0]
    tableName = parts[1]
  } else if (parts.length === 3) {
    databaseName = parts[0]
    schemaName = parts[1] || 'dbo'
    tableName = parts[2]
  } else {
    return null
  }

  if (!tableName || tableName.startsWith('#') || tableName.startsWith('@')) return null
  return { databaseName, schemaName, tableName }
}

/** 批次里有 USE，会改掉连接当前库。 */
export function batchChangesDatabase(sqlText: string): boolean {
  return /(?:^|;)\s*USE\s+/i.test(sqlText)
}

/**
 * 连接在发出语句前就已经不可用。
 * 不把查询超时算进去，避免把已经执行过的语句再跑一遍。
 */
export function isSqlServerConnectionClosedError(error: unknown): boolean {
  const err = error as { code?: string; message?: string }
  const code = String(err.code || '').toUpperCase()
  if (code === 'ECONNCLOSED' || code === 'ENOTOPEN' || code === 'ESOCKET' || code === 'ECONNRESET') {
    return true
  }
  const message = err.message || ''
  return /connection is closed|connection not yet open|connection lost|socket hang up/i.test(message)
}
