import { IpcMain, dialog } from 'electron'
import { IpcChannels } from '@shared/constants'
import { recentFilesService } from '../services/recentFilesService'
import * as fileService from '../services/fileService'

/**
 * 文件操作 IPC controller（薄层）
 * dialog 交互（取路径）留在 controller，文件读写/导出逻辑见 services/fileService.ts
 */
export function setupFileHandlers(ipcMain: IpcMain): void {
  // 打开文件
  ipcMain.handle(IpcChannels.FILE_OPEN, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'SQL 文件 & ER 图', extensions: ['sql', 'json'] },
        { name: 'SQL Files', extensions: ['sql'] },
        { name: 'ER 图', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true }
    }

    const filePath = result.filePaths[0]
    const r = fileService.readFileContent(filePath)
    return r.success ? { success: true, filePath, content: r.content } : r
  })

  // 读取指定路径文件
  ipcMain.handle(IpcChannels.FILE_READ, async (_, filePath: string) => {
    return fileService.readFileContent(filePath)
  })

  // 保存文件
  ipcMain.handle(IpcChannels.FILE_SAVE, async (_, data: { filePath: string; content: string }) => {
    return fileService.writeFileContent(data.filePath, data.content)
  })

  // 另存为
  ipcMain.handle(IpcChannels.FILE_SAVE_AS, async (_, content: string, fileType?: string) => {
    const isErd = fileType === 'erd'
    const result = await dialog.showSaveDialog({
      filters: isErd
        ? [
            { name: 'ER 图', extensions: ['erd.json'] },
            { name: 'JSON 文件', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        : [
            { name: 'SQL Files', extensions: ['sql'] },
            { name: 'All Files', extensions: ['*'] }
          ],
      defaultPath: isErd ? 'diagram.erd.json' : 'query.sql'
    })

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true }
    }

    const r = fileService.writeFileContent(result.filePath, content)
    return r.success ? { success: true, filePath: result.filePath } : r
  })

  // 导出查询结果
  ipcMain.handle(IpcChannels.FILE_EXPORT, async (_, data: {
    columns: { name: string; type: string }[]
    rows: Record<string, unknown>[]
    format: 'csv' | 'json' | 'xlsx'
  }) => {
    const { columns, rows, format } = data

    const filters = format === 'xlsx'
      ? [{ name: 'Excel Files', extensions: ['xlsx'] }]
      : format === 'csv'
      ? [{ name: 'CSV Files', extensions: ['csv'] }]
      : [{ name: 'JSON Files', extensions: ['json'] }]

    const result = await dialog.showSaveDialog({
      filters,
      defaultPath: `export.${format}`
    })

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true }
    }

    const r = await fileService.exportData(result.filePath, columns, rows, format)
    return r.success ? { success: true, filePath: result.filePath } : r
  })

  // 获取最近文件列表
  ipcMain.handle(IpcChannels.RECENT_FILES_GET, () => {
    return recentFilesService.getRecentFiles()
  })

  // 添加到最近文件
  ipcMain.handle(IpcChannels.RECENT_FILES_ADD, (_, filePath: string) => {
    recentFilesService.addRecentFile(filePath)
  })

  // 移除最近文件
  ipcMain.handle(IpcChannels.RECENT_FILES_REMOVE, (_, filePath: string) => {
    recentFilesService.removeRecentFile(filePath)
  })
}
