import { describe, it, expect } from 'vitest'
import { validateConnectionForm } from '../../src/main/services/connectionService'
import type { ConnectionForm } from '../../src/shared/types'

function form(overrides: Partial<ConnectionForm> = {}): ConnectionForm {
  return {
    name: 'test',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'pwd',
    ...overrides,
  } as ConnectionForm
}

describe('connectionService.validateConnectionForm', () => {
  it('合法表单返回 null', () => {
    expect(validateConnectionForm(form())).toBeNull()
  })

  it('缺少必填字段返回 E1001', () => {
    expect(validateConnectionForm(form({ host: '' }))).toEqual({ error: 'E1001', message: '请填写必填字段' })
  })

  it('名称超过 50 字符返回 E1005', () => {
    expect(validateConnectionForm(form({ name: 'a'.repeat(51) }))?.error).toBe('E1005')
  })

  it('端口超出范围返回 E1003', () => {
    expect(validateConnectionForm(form({ port: 99999 }))?.error).toBe('E1003')
    expect(validateConnectionForm(form({ port: 65536 }))?.error).toBe('E1003')
  })

  it('端口为 0/未填时回退到类型默认端口，不报错（与原实现一致）', () => {
    expect(validateConnectionForm(form({ port: undefined }))).toBeNull()
    expect(validateConnectionForm(form({ port: 0 }))).toBeNull()
  })
})
