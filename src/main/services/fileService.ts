/**
 * 文件服务
 *
 * 承载 ipc/file.ts 中的文件读写与导出逻辑（不含 Electron dialog，dialog 留在 controller）。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import * as ExcelJS from 'exceljs'
import { recentFilesService } from './recentFilesService'

export interface ExportColumn {
  name: string
  type: string
}

export type ExportFormat = 'csv' | 'json' | 'xlsx'

function errMessage(error: unknown, fallback: string): string {
  return (error as { message?: string })?.message || fallback
}

/** 读取文件内容，并加入最近文件列表 */
export function readFileContent(filePath: string): { success: boolean; content?: string; message?: string } {
  try {
    if (!existsSync(filePath)) {
      return { success: false, message: '文件不存在' }
    }
    const content = readFileSync(filePath, 'utf-8')
    recentFilesService.addRecentFile(filePath)
    return { success: true, content }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '读取文件失败') }
  }
}

/** 写入文件内容，并加入最近文件列表 */
export function writeFileContent(filePath: string, content: string): { success: boolean; message?: string } {
  try {
    writeFileSync(filePath, content, 'utf-8')
    recentFilesService.addRecentFile(filePath)
    return { success: true }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '保存文件失败') }
  }
}

/**
 * 构造 CSV 文本内容（纯函数，便于单元测试）。
 * 字符串值用双引号包裹并转义内部双引号；null/undefined 输出为空。
 */
export function buildCsvContent(columns: ExportColumn[], rows: Record<string, unknown>[]): string {
  const header = columns.map(c => `"${c.name}"`).join(',')
  const dataRows = rows.map(row =>
    columns.map(c => {
      const value = row[c.name]
      if (value === null || value === undefined) return ''
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
      return String(value)
    }).join(',')
  )
  return [header, ...dataRows].join('\n')
}

/** 导出查询结果到指定路径（csv/json/xlsx） */
export async function exportData(
  filePath: string,
  columns: ExportColumn[],
  rows: Record<string, unknown>[],
  format: ExportFormat
): Promise<{ success: boolean; message?: string }> {
  try {
    if (format === 'xlsx') {
      await exportToExcel(filePath, columns, rows)
    } else if (format === 'csv') {
      writeFileSync(filePath, '\ufeff' + buildCsvContent(columns, rows), 'utf-8') // BOM for Excel compatibility
    } else {
      writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf-8')
    }
    return { success: true }
  } catch (error: unknown) {
    return { success: false, message: errMessage(error, '导出失败') }
  }
}

/**
 * 导出数据到 Excel 文件
 */
async function exportToExcel(
  filePath: string,
  columns: ExportColumn[],
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
    width: Math.max(col.name.length + 2, 15),
  }))

  // 添加数据行
  rows.forEach(row => {
    const rowData: Record<string, unknown> = {}
    columns.forEach(col => {
      let value = row[col.name]
      // 处理特殊类型
      if (value === null || value === undefined) {
        value = ''
      } else if (value instanceof Date) {
        // 保持日期格式
        value = value
      } else if (typeof value === 'object') {
        value = JSON.stringify(value)
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
    fgColor: { argb: 'FFE0E0E0' },
  }
  headerRow.border = {
    bottom: { style: 'thin', color: { argb: 'FF999999' } },
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
