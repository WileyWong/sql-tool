import { describe, it, expect } from 'vitest'
import { deepSerialize } from '../../src/main/services/queryService'

describe('queryService.deepSerialize', () => {
  it('BigInt 转为字符串', () => {
    const out = deepSerialize({ id: BigInt('9007199254740993') }) as { id: string }
    expect(out.id).toBe('9007199254740993')
  })

  it('Uint8Array 转为 0x 十六进制大写', () => {
    const out = deepSerialize({ data: new Uint8Array([0x0a, 0x10]) }) as { data: string }
    expect(out.data).toBe('0x0A10')
  })

  it('普通值保持不变', () => {
    expect(deepSerialize({ a: 1, b: 'x', c: null })).toEqual({ a: 1, b: 'x', c: null })
  })
})
