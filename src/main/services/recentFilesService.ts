/**
 * 最近文件服务
 * 管理最近打开文件列表的持久化存储和读取
 */

import { app } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const MAX_RECENT_FILES = 10
const STORAGE_FILE = 'recent-files.json'

class RecentFilesService {
  private filePath: string
  private recentFiles: string[] = []

  constructor() {
    this.filePath = join(app.getPath('userData'), STORAGE_FILE)
    this.load()
  }

  /**
   * 从文件加载最近文件列表
   */
  private load(): void {
    try {
      if (existsSync(this.filePath)) {
        const data = readFileSync(this.filePath, 'utf-8')
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          this.recentFiles = parsed.filter(item => typeof item === 'string')
        }
      }
    } catch (error) {
      console.error('Failed to load recent files:', error)
      this.recentFiles = []
    }
  }

  /**
   * 保存最近文件列表到文件
   */
  private save(): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.recentFiles, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to save recent files:', error)
    }
  }

  /**
   * 获取最近文件列表
   */
  getRecentFiles(): string[] {
    return [...this.recentFiles]
  }

  /**
   * 添加文件到最近列表
   * 如果已存在则移到首位，超过最大数量则移除最旧的
   */
  addRecentFile(filePath: string): void {
    // 移除已存在的相同路径
    const index = this.recentFiles.indexOf(filePath)
    if (index !== -1) {
      this.recentFiles.splice(index, 1)
    }

    // 添加到首位
    this.recentFiles.unshift(filePath)

    // 限制最大数量
    if (this.recentFiles.length > MAX_RECENT_FILES) {
      this.recentFiles = this.recentFiles.slice(0, MAX_RECENT_FILES)
    }
    this.save()
  }

  /**
   * 从列表移除指定文件
   */
  removeRecentFile(filePath: string): void {
    const index = this.recentFiles.indexOf(filePath)
    if (index !== -1) {
      this.recentFiles.splice(index, 1)
      this.save()
    }
  }

  /**
   * 清空最近文件列表
   */
  clear(): void {
    this.recentFiles = []
    this.save()
  }
}

// 单例导出
export const recentFilesService = new RecentFilesService()
