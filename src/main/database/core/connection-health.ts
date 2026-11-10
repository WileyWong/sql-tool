import { Defaults } from '@shared/constants'

/** 距离上次成功使用超过阈值时，先探活再把语句发到可能已经失效的连接上。 */
export function shouldProbeConnection(lastActiveAt: number, now = Date.now()): boolean {
  return now - lastActiveAt > Defaults.PROBE_AFTER_IDLE
}

/**
 * 给一次网络操作加上超时。超时后执行 onTimeout（用来销毁套接字），
 * 工作承诺若在超时之后才拒绝，不会变成未处理拒绝。
 */
export async function raceWithTimeout<T>(
  work: Promise<T>,
  timeoutMs: number,
  onTimeout: () => void,
  message: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let settled = false
  work.catch(() => {})

  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          if (settled) return
          try { onTimeout() } catch { /* 销毁失败不影响超时结果 */ }
          reject(new Error(message))
        }, timeoutMs)
      })
    ])
  } finally {
    settled = true
    if (timer) clearTimeout(timer)
  }
}
