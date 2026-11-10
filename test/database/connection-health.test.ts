import { describe, expect, it } from 'vitest'
import { Defaults } from '../../src/shared/constants'
import { raceWithTimeout, shouldProbeConnection } from '../../src/main/database/core/connection-health'
import { isMysqlConnectionUsable } from '../../src/main/database/mysql/connection'
import type { Connection } from 'mysql2/promise'

describe('shouldProbeConnection', () => {
  it('刚用过的连接不再探活', () => {
    const now = 1_000_000
    expect(shouldProbeConnection(now - Defaults.PROBE_AFTER_IDLE, now)).toBe(false)
    expect(shouldProbeConnection(now - 1000, now)).toBe(false)
  })

  it('空闲超过阈值后探活', () => {
    const now = 1_000_000
    expect(shouldProbeConnection(now - Defaults.PROBE_AFTER_IDLE - 1, now)).toBe(true)
  })
})

describe('raceWithTimeout', () => {
  it('工作先完成时返回其结果', async () => {
    let called = false
    await expect(raceWithTimeout(Promise.resolve('ok'), 50, () => { called = true }, 'timed out')).resolves.toBe('ok')
    expect(called).toBe(false)
  })

  it('工作先失败时抛出原来的错误', async () => {
    await expect(raceWithTimeout(Promise.reject(new Error('down')), 50, () => {}, 'timed out')).rejects.toThrow('down')
  })

  it('超时后销毁并拒绝', async () => {
    let called = false
    const work = new Promise<string>((resolve) => setTimeout(() => resolve('late'), 200))
    await expect(raceWithTimeout(work, 20, () => { called = true }, 'timed out')).rejects.toThrow('timed out')
    expect(called).toBe(true)
  })

  it('超时之后工作才失败，不会冒出未处理拒绝', async () => {
    let rejectWork: (error: Error) => void = () => {}
    const work = new Promise<void>((_, reject) => { rejectWork = reject })
    await expect(raceWithTimeout(work, 20, () => {}, 'timed out')).rejects.toThrow('timed out')
    rejectWork(new Error('late'))
    await new Promise((resolve) => setTimeout(resolve, 30))
  })
})

describe('isMysqlConnectionUsable', () => {
  function stub(state: string | undefined): Connection {
    return { connection: state === undefined ? {} : { state } } as unknown as Connection
  }

  it('只有握手完成或已认证的连接可以继续使用', () => {
    expect(isMysqlConnectionUsable(stub('authenticated'))).toBe(true)
    expect(isMysqlConnectionUsable(stub('connected'))).toBe(true)
    expect(isMysqlConnectionUsable(stub('disconnected'))).toBe(false)
    expect(isMysqlConnectionUsable(stub('error'))).toBe(false)
    expect(isMysqlConnectionUsable(stub(undefined))).toBe(true)
  })
})
