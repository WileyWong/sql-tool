import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import { DriverFactory } from '../database/core/factory'
import { getConnectionDbType } from '../database/core/config-store'

export function setupSessionHandlers(ipcMain: IpcMain): void {
  // 创建会话
  ipcMain.handle(IpcChannels.SESSION_CREATE, async (_, data: {
    tabId: string
    connectionId: string
    database?: string
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      await sessionManager.createSession(data.tabId, data.connectionId, data.database)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '创建会话失败' }
    }
  })

  // 销毁会话
  ipcMain.handle(IpcChannels.SESSION_DESTROY, async (_, data: {
    tabId: string
    connectionId: string
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      await sessionManager.destroySession(data.tabId)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '销毁会话失败' }
    }
  })

  // 获取会话状态
  ipcMain.handle(IpcChannels.SESSION_STATUS, async (_, data: {
    tabId: string
    connectionId: string
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      const info = sessionManager.getSessionInfo(data.tabId)
      return { success: true, session: info || null }
    } catch {
      return { success: true, session: null }
    }
  })

  // 获取某服务器的会话数
  ipcMain.handle(IpcChannels.SESSION_COUNT, async (_, data: {
    connectionId: string
  }) => {
    try {
      const dbType = getConnectionDbType(data.connectionId)
      const sessionManager = DriverFactory.getSessionManager(dbType)
      const count = sessionManager.getSessionCount(data.connectionId)
      return { success: true, count }
    } catch {
      return { success: true, count: 0 }
    }
  })
}
