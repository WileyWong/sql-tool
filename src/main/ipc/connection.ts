import { IpcMain } from 'electron'
import { IpcChannels } from '@shared/constants'
import type { ConnectionConfig, ConnectionForm } from '@shared/types'
import * as connectionService from '../services/connectionService'

/**
 * 连接管理 IPC controller（薄层）
 * 仅做参数提取与结果返回，业务逻辑见 services/connectionService.ts
 */
export function setupConnectionHandlers(ipcMain: IpcMain): void {
  // 获取连接列表
  ipcMain.handle(IpcChannels.CONNECTION_LIST, async () => {
    return connectionService.list()
  })

  // 保存连接
  ipcMain.handle(IpcChannels.CONNECTION_SAVE, async (_, data: { connection: ConnectionForm; id?: string }) => {
    return connectionService.save(data.connection, data.id)
  })

  // 删除连接
  ipcMain.handle(IpcChannels.CONNECTION_DELETE, async (_, connectionId: string) => {
    return connectionService.remove(connectionId)
  })

  // 测试连接
  ipcMain.handle(IpcChannels.CONNECTION_TEST, async (_, config: ConnectionConfig) => {
    return connectionService.test(config)
  })

  // 连接数据库
  ipcMain.handle(IpcChannels.CONNECTION_CONNECT, async (_, connectionId: string) => {
    return connectionService.connect(connectionId)
  })

  // 断开连接
  ipcMain.handle(IpcChannels.CONNECTION_DISCONNECT, async (_, connectionId: string) => {
    return connectionService.disconnect(connectionId)
  })
}
