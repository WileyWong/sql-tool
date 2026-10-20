import { describe, expect, it } from 'vitest'
import {
  batchChangesDatabase,
  isSqlServerConnectionClosedError,
  parseSqlServerSingleTable,
  sameSqlServerDatabase
} from '../../src/main/database/sqlserver/query-utils'

describe('parseSqlServerSingleTable', () => {
  it('一段表名默认 dbo', () => {
    expect(parseSqlServerSingleTable('SELECT * FROM users')).toEqual({
      schemaName: 'dbo',
      tableName: 'users'
    })
  })

  it('两段按 schema.table 解析', () => {
    expect(parseSqlServerSingleTable('select top 100 * from dbo.Users')).toEqual({
      schemaName: 'dbo',
      tableName: 'Users'
    })
  })

  it('三段方括号名解析出库、schema 和表', () => {
    expect(parseSqlServerSingleTable('SELECT TOP 100 * FROM [AdventureWorks].[dbo].[Users]')).toEqual({
      databaseName: 'AdventureWorks',
      schemaName: 'dbo',
      tableName: 'Users'
    })
  })

  it('db..table 的空 schema 回落到 dbo', () => {
    expect(parseSqlServerSingleTable('SELECT * FROM App..Orders')).toEqual({
      databaseName: 'App',
      schemaName: 'dbo',
      tableName: 'Orders'
    })
  })

  it('JOIN、多表和非 SELECT 不查主键', () => {
    expect(parseSqlServerSingleTable('SELECT * FROM a JOIN b ON a.id = b.id')).toBeNull()
    expect(parseSqlServerSingleTable('SELECT * FROM a, b')).toBeNull()
    expect(parseSqlServerSingleTable('UPDATE users SET name = 1')).toBeNull()
  })

  it('临时表不查主键', () => {
    expect(parseSqlServerSingleTable('SELECT * FROM #temp')).toBeNull()
  })

  it('WHERE 里的逗号不算多表', () => {
    expect(parseSqlServerSingleTable('SELECT * FROM users WHERE id IN (1, 2)')).toEqual({
      schemaName: 'dbo',
      tableName: 'users'
    })
  })
})

describe('sameSqlServerDatabase', () => {
  it('忽略大小写', () => {
    expect(sameSqlServerDatabase('AdventureWorks', 'adventureworks')).toBe(true)
  })

  it('缺一边时不算同一个库', () => {
    expect(sameSqlServerDatabase(undefined, 'adventureworks')).toBe(false)
  })
})

describe('batchChangesDatabase', () => {
  it('识别独立的 USE', () => {
    expect(batchChangesDatabase('USE other\nSELECT 1')).toBe(true)
    expect(batchChangesDatabase('SELECT 1; USE other')).toBe(true)
    expect(batchChangesDatabase('SELECT * FROM users')).toBe(false)
  })
})

describe('isSqlServerConnectionClosedError', () => {
  it('连接已关闭要重连', () => {
    expect(isSqlServerConnectionClosedError({ code: 'ECONNCLOSED', message: 'Connection is closed.' })).toBe(true)
    expect(isSqlServerConnectionClosedError({ message: 'Connection lost - socket hang up' })).toBe(true)
  })

  it('查询超时和 SQL 错误不重试', () => {
    expect(isSqlServerConnectionClosedError({ code: 'ETIMEOUT', message: 'Timeout: Request failed to complete' })).toBe(false)
    expect(isSqlServerConnectionClosedError({ code: 'EREQUEST', message: 'Invalid object name' })).toBe(false)
  })
})
