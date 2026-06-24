import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import * as sessionService from '../services/sessionService'

/**
 * 会话管理 IPC controller（薄层）
 * 业务逻辑见 services/sessionService.ts
 */
export function setupSessionHandlers(ipcMain: IpcMain): void {
  // 创建会话
  ipcMain.handle(IpcChannels.SESSION_CREATE, async (_, data: { tabId: string; connectionId: string; database?: string }) => {
    return sessionService.createSession(data.tabId, data.connectionId, data.database)
  })

  // 销毁会话
  ipcMain.handle(IpcChannels.SESSION_DESTROY, async (_, data: { tabId: string; connectionId: string }) => {
    return sessionService.destroySession(data.tabId, data.connectionId)
  })

  // 获取会话状态
  ipcMain.handle(IpcChannels.SESSION_STATUS, async (_, data: { tabId: string; connectionId: string }) => {
    return sessionService.getStatus(data.tabId, data.connectionId)
  })

  // 获取某服务器的会话数
  ipcMain.handle(IpcChannels.SESSION_COUNT, async (_, data: { connectionId: string }) => {
    return sessionService.getCount(data.connectionId)
  })
}
