/**
 * 会话管理服务
 *
 * 承载 ipc/session.ts 中的会话 CRUD 逻辑。
 */
import { DriverFactory } from '../database/core/factory'
import { getConnectionDbType } from '../database/core/config-store'

function sessionManagerFor(connectionId: string) {
  return DriverFactory.getSessionManager(getConnectionDbType(connectionId))
}

function errMessage(error: unknown, fallback: string): string {
  return (error as { message?: string })?.message || fallback
}

/** 创建会话 */
export async function createSession(tabId: string, connectionId: string, database?: string) {
  try {
    await sessionManagerFor(connectionId).createSession(tabId, connectionId, database)
    return { success: true }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '创建会话失败') }
  }
}

/** 销毁会话 */
export async function destroySession(tabId: string, connectionId: string) {
  try {
    await sessionManagerFor(connectionId).destroySession(tabId)
    return { success: true }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '销毁会话失败') }
  }
}

/** 获取会话状态 */
export function getStatus(tabId: string, connectionId: string) {
  try {
    const info = sessionManagerFor(connectionId).getSessionInfo(tabId)
    return { success: true, session: info || null }
  } catch {
    return { success: true, session: null }
  }
}

/** 获取某服务器的会话数 */
export function getCount(connectionId: string) {
  try {
    const count = sessionManagerFor(connectionId).getSessionCount(connectionId)
    return { success: true, count }
  } catch {
    return { success: true, count: 0 }
  }
}
