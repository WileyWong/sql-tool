import { describe, expect, it } from 'vitest'
import { formatEditValue, parseEditValue } from '../../src/renderer/utils/formatters'

describe('parseEditValue 日期时间往返', () => {
  it('DATETIME 编辑框没改时交还 ISO 原值', () => {
    const original = '2026-03-15T02:30:45.123Z'
    const shown = formatEditValue(original, 'DATETIME2')
    expect(shown).not.toBe(original)
    expect(parseEditValue(shown, 'DATETIME2', original)).toBe(original)
  })

  it('DATE 编辑框没改时交还 ISO 原值', () => {
    const original = '2026-03-15T00:00:00.000Z'
    const shown = formatEditValue(original, 'DATE')
    expect(parseEditValue(shown, 'DATE', original)).toBe(original)
  })

  it('TIME 去掉末尾零后，没改仍交还原值', () => {
    const original = '08:30:00.0000000'
    expect(formatEditValue(original, 'TIME')).toBe('08:30:00')
    expect(parseEditValue('08:30:00', 'TIME', original)).toBe(original)
  })

  it('真正改过的时间按新文本返回', () => {
    const original = '2026-03-15T02:30:45.123Z'
    expect(parseEditValue('2026-03-15 11:00:00', 'DATETIME2', original)).toBe('2026-03-15 11:00:00')
  })
})
