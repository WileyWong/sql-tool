import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { encrypt, decrypt } from './encryption'
import type { ConnectionConfig } from '@shared/types'

const CONFIG_DIR = join(app.getPath('userData'), 'config')
const CONNECTIONS_FILE = join(CONFIG_DIR, 'connections.dat')

/**
 * 确保配置目录存在
 */
function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

/**
 * 读取所有连接配置
 */
export function loadConnections(): ConnectionConfig[] {
  try {
    ensureConfigDir()
    if (!existsSync(CONNECTIONS_FILE)) {
      return []
    }
    const encryptedData = readFileSync(CONNECTIONS_FILE, 'utf-8')
    if (!encryptedData) {
      return []
    }
    const decryptedData = decrypt(encryptedData)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Failed to load connections:', error)
    return []
  }
}

/**
 * 保存所有连接配置
 */
export function saveConnections(connections: ConnectionConfig[]): void {
  ensureConfigDir()
  const data = JSON.stringify(connections)
  const encryptedData = encrypt(data)
  writeFileSync(CONNECTIONS_FILE, encryptedData, 'utf-8')
}

/**
 * 添加或更新连接
 */
export function saveConnection(connection: ConnectionConfig): ConnectionConfig[] {
  const connections = loadConnections()
  const index = connections.findIndex(c => c.id === connection.id)
  
  if (index >= 0) {
    // 更新
    connections[index] = { ...connection, updatedAt: Date.now() }
  } else {
    // 新增
    connections.push({ ...connection, createdAt: Date.now(), updatedAt: Date.now() })
  }
  
  saveConnections(connections)
  return connections
}

/**
 * 删除连接
 */
export function deleteConnection(connectionId: string): ConnectionConfig[] {
  const connections = loadConnections()
  const filtered = connections.filter(c => c.id !== connectionId)
  saveConnections(filtered)
  return filtered
}

/**
 * 检查连接名称是否已存在
 */
export function isConnectionNameExists(name: string, excludeId?: string): boolean {
  const connections = loadConnections()
  return connections.some(c => c.name === name && c.id !== excludeId)
}
