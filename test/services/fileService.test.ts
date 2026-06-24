import { describe, it, expect } from 'vitest'
import { buildCsvContent } from '../../src/main/services/fileService'

const columns = [
  { name: 'id', type: 'int' },
  { name: 'name', type: 'varchar' },
]

describe('fileService.buildCsvContent', () => {
  it('生成带表头的 CSV', () => {
    const csv = buildCsvContent(columns, [{ id: 1, name: 'Alice' }])
    expect(csv).toBe('"id","name"\n1,"Alice"')
  })

  it('字符串内的双引号被转义', () => {
    const csv = buildCsvContent(columns, [{ id: 2, name: 'a"b' }])
    expect(csv).toBe('"id","name"\n2,"a""b"')
  })

  it('null/undefined 输出为空', () => {
    const csv = buildCsvContent(columns, [{ id: null, name: undefined }])
    expect(csv).toBe('"id","name"\n,')
  })
})
