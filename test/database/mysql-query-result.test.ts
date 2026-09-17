import { describe, it, expect } from 'vitest'
import {
  normalizeMysqlQueryResult,
  toQueryColumns,
  toQueryResultFromNormalized
} from '../../src/main/database/mysql/query-result'
import { splitStatementsToTexts } from '../../src/main/sql-language-server/services/sqlParserService'

describe('normalizeMysqlQueryResult', () => {
  it('把多条 DML 的 OkPacket 数组拆开，不把 undefined fields 当结果集', () => {
    const rows = [
      { affectedRows: 10, insertId: 0, serverStatus: 0 },
      { affectedRows: 500, insertId: 1, serverStatus: 0 }
    ]
    const fields = [undefined, undefined]
    const normalized = normalizeMysqlQueryResult(rows, fields)
    expect(normalized).toHaveLength(2)

    const results = normalized.map(item => toQueryResultFromNormalized(item, 12))
    expect(results.every(r => r.type === 'message')).toBe(true)
    expect(results[0]).toMatchObject({ type: 'message', affectedRows: 10 })
    expect(results[1]).toMatchObject({ type: 'message', affectedRows: 500 })
  })

  it('单条 SELECT 仍按结果集处理', () => {
    const rows = [{ id: 1, name: 'pku' }]
    const fields = [{ name: 'id', type: 3 }, { name: 'name', type: 253 }]
    const normalized = normalizeMysqlQueryResult(rows, fields)
    expect(normalized).toHaveLength(1)
    const result = toQueryResultFromNormalized(normalized[0], 5)
    expect(result).toMatchObject({ type: 'resultset', rowCount: 1 })
  })

  it('toQueryColumns 跳过 undefined field，避免读 name 崩溃', () => {
    expect(toQueryColumns([undefined, { name: 'id', type: 3 }])).toEqual([
      { name: 'id', type: 'INT', isPrimaryKey: false }
    ])
    expect(toQueryColumns(undefined)).toEqual([])
  })
})

describe('splitStatementsToTexts', () => {
    it('不把 SQL 字符串里成对单引号当成字符串结束，避免从 VALUES 中间切开', () => {
    const sql = `INSERT INTO t (name) VALUES ('Xi''an University', '西安');
INSERT INTO t (name) VALUES ('ok');`
    const statements = splitStatementsToTexts(sql)
    expect(statements).toHaveLength(2)
    expect(statements[0]).toContain("Xi''an University")
    expect(statements[1]).toContain("'ok'")
  })

  it('字符串内的分号不拆句', () => {
    const sql = `INSERT INTO t VALUES ('a;b'); DELETE FROM t;`
    expect(splitStatementsToTexts(sql)).toHaveLength(2)
  })
})
