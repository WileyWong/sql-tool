import sql from 'mssql'
import { Defaults } from '@shared/constants'
import { raceWithTimeout } from '../core/connection-health'

/**
 * 短超时探活。pool.connected 在连接被中间设备悄悄拆掉后仍可能为 true。
 * 探活失败时取消请求；调用方需要再关掉连接池并新建。
 */
export async function probeSqlServerPool(pool: sql.ConnectionPool, timeoutMs = Defaults.PROBE_TIMEOUT): Promise<boolean> {
  if (!pool.connected) return false
  const request = pool.request()
  try {
    await raceWithTimeout(
      request.query('SELECT 1'),
      timeoutMs,
      () => { try { request.cancel() } catch { /* 取消失败时由关闭连接池收尾 */ } },
      'SQL Server probe timeout'
    )
    return true
  } catch {
    return false
  }
}

/** 关闭连接池。死连接上的 close() 可能不返回，超时后放弃等待。 */
export async function closeSqlServerPool(pool: sql.ConnectionPool, timeoutMs = 2000): Promise<void> {
  await Promise.race([
    pool.close().then(() => undefined).catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))
  ])
}
