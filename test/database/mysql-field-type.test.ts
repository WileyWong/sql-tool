import { describe, it, expect } from 'vitest'
import { getMysqlFieldTypeName } from '../../src/main/database/mysql/field-type'

describe('getMysqlFieldTypeName', () => {
  it('将 MYSQL_TYPE_BLOB + 非 binary charset 识别为 TEXT', () => {
    expect(getMysqlFieldTypeName({
      type: 252,
      characterSet: 45, // utf8mb4
      columnLength: 65535 * 4
    })).toBe('TEXT')
  })

  it('将 MYSQL_TYPE_BLOB + binary charset 识别为 BLOB', () => {
    expect(getMysqlFieldTypeName({
      type: 252,
      characterSet: 63,
      columnLength: 65535
    })).toBe('BLOB')
  })

  it('utf8mb4 TINYTEXT / MEDIUMTEXT / LONGTEXT', () => {
    expect(getMysqlFieldTypeName({ type: 252, characterSet: 45, columnLength: 255 * 4 })).toBe('TINYTEXT')
    expect(getMysqlFieldTypeName({ type: 252, characterSet: 45, columnLength: 16777215 * 4 })).toBe('MEDIUMTEXT')
    expect(getMysqlFieldTypeName({ type: 252, characterSet: 45, columnLength: 4294967295 })).toBe('LONGTEXT')
  })

  it('latin1 TEXT 长度为 65535 仍识别为 TEXT', () => {
    expect(getMysqlFieldTypeName({ type: 252, charsetNr: 8, columnLength: 65535 })).toBe('TEXT')
  })

  it('缺少 charset 时按非 binary 处理，避免把 TEXT 标成 BLOB', () => {
    expect(getMysqlFieldTypeName({ type: 252 })).toBe('TEXT')
  })

  it('兼容 charsetNr / columnType 字段名', () => {
    expect(getMysqlFieldTypeName({ columnType: 252, charsetNr: 45, length: 262140 })).toBe('TEXT')
  })
})
