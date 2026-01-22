import { IpcMain, dialog } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { IpcChannels } from '@shared/constants'
import { recentFilesService } from '../services/recentFilesService'
import * as ExcelJS from 'exceljs'

export function setupFileHandlers(ipcMain: IpcMain): void {
  // 打开文件
  ipcMain.handle(IpcChannels.FILE_OPEN, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'SQL Files', extensions: ['sql'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true }
    }
    
    const filePath = result.filePaths[0]
    try {
      const content = readFileSync(filePath, 'utf-8')  
      // 添加到最近文件列表
      recentFilesService.addRecentFile(filePath)
      return { success: true, filePath, content }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '读取文件失败' }
    }
  })
  
  // 读取指定路径文件
  ipcMain.handle(IpcChannels.FILE_READ, async (_, filePath: string) => {
    try {
      if (!existsSync(filePath)) {
        return { success: false, message: '文件不存在' }
      }
      const content = readFileSync(filePath, 'utf-8')
      // 添加到最近文件列表
      recentFilesService.addRecentFile(filePath)
      return { success: true, content }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '读取文件失败' }
    }
  })
  
  // 保存文件
  ipcMain.handle(IpcChannels.FILE_SAVE, async (_, data: { filePath: string; content: string }) => {
    try {
      writeFileSync(data.filePath, data.content, 'utf-8')
      // 添加到最近文件列表
      recentFilesService.addRecentFile(data.filePath)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '保存文件失败' }
    }
  })
  
  // 另存为
  ipcMain.handle(IpcChannels.FILE_SAVE_AS, async (_, content: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'SQL Files', extensions: ['sql'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      defaultPath: 'query.sql'
    })
    
    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true }
    }
    
    try {
      writeFileSync(result.filePath, content, 'utf-8')
      // 添加到最近文件列表
      recentFilesService.addRecentFile(result.filePath)
      return { success: true, filePath: result.filePath }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '保存文件失败' }
    }
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
    
    try {
      if (format === 'xlsx') {
        // Excel 格式
        await exportToExcel(result.filePath, columns, rows)
      } else if (format === 'csv') {
        // CSV 格式
        const header = columns.map(c => `"${c.name}"`).join(',')
        const dataRows = rows.map(row => 
          columns.map(c => {
            const value = row[c.name]
            if (value === null || value === undefined) return ''
            if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
            return String(value)
          }).join(',')
        )
        const content = [header, ...dataRows].join('\n')
        writeFileSync(result.filePath, '\ufeff' + content, 'utf-8') // BOM for Excel compatibility
      } else {
        // JSON 格式
        const content = JSON.stringify(rows, null, 2)
        writeFileSync(result.filePath, content, 'utf-8')
      }
      
      return { success: true, filePath: result.filePath }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { success: false, message: err.message || '导出失败' }
    }
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

/**
 * 导出数据到 Excel 文件
 */
async function exportToExcel(
  filePath: string,
  columns: { name: string; type: string }[],
  rows: Record<string, unknown>[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'SQL Tool'
  workbook.created = new Date()
  
  const worksheet = workbook.addWorksheet('Query Result')
  
  // 设置列定义
  worksheet.columns = columns.map(col => ({
    header: col.name,
    key: col.name,
    width: Math.max(col.name.length + 2, 15)
  }))
  
  // 添加数据行
  rows.forEach(row => {
    const rowData: Record<string, unknown> = {}
    columns.forEach(col => {
      let value = row[col.name]
      // 处理特殊类型
      if (value === null || value === undefined) {
        value = ''
      } else if (typeof value === 'object') {
        value = JSON.stringify(value)
      } else if (value instanceof Date) {
        // 保持日期格式
        value = value
      }
      rowData[col.name] = value
    })
    worksheet.addRow(rowData)
  })
  
  // 设置列头样式
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }
  headerRow.border = {
    bottom: { style: 'thin', color: { argb: 'FF999999' } }
  }
  
  // 冻结首行
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]
  
  // 自动调整列宽（基于内容）
  worksheet.columns.forEach((column) => {
    if (column.values) {
      let maxLength = 0
      column.values.forEach((value) => {
        const length = value ? String(value).length : 0
        if (length > maxLength) {
          maxLength = length
        }
      })
      column.width = Math.min(Math.max(maxLength + 2, 10), 50)
    }
  })
  
  await workbook.xlsx.writeFile(filePath)
}
