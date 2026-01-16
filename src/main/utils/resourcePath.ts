/**
 * 资源路径工具函数
 * 用于获取打包后 resources 目录中的资源文件路径
 */

import { app } from 'electron'
import path from 'path'

/**
 * 获取资源文件的绝对路径
 * @param filename 资源文件名（如 mysql-functions.json）
 * @returns 资源文件的绝对路径
 * 
 * 开发环境：项目根目录/resources/filename
 * 生产环境：应用根目录/resources/filename
 */
export function getResourcePath(filename: string): string {
  if (app.isPackaged) {
    // 生产环境：resources 目录在 app.getAppPath() 同级的 resources 目录中
    // 或者通过 extraResources 配置放在 process.resourcesPath 下
    return path.join(process.resourcesPath, 'resources', filename)
  }
  // 开发环境：项目根目录/resources
  return path.join(app.getAppPath(), 'resources', filename)
}

/**
 * 获取 resources 目录的绝对路径
 * @returns resources 目录的绝对路径
 */
export function getResourceDir(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'resources')
  }
  return path.join(app.getAppPath(), 'resources')
}
