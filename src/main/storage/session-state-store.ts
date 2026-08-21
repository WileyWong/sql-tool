import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, unlinkSync } from 'fs'

// 延迟初始化路径，确保 app 已就绪
let CONFIG_DIR: string
let SESSION_STATE_FILE: string

function getConfigDir(): string {
  if (!CONFIG_DIR) {
    CONFIG_DIR = join(app.getPath('userData'), 'config')
  }
  return CONFIG_DIR
}

function getSessionStateFile(): string {
  if (!SESSION_STATE_FILE) {
    SESSION_STATE_FILE = join(getConfigDir(), 'session-state.json')
  }
  return SESSION_STATE_FILE
}

export interface SerializedTab {
  id: string
  title: string
  baseTitle?: string
  content: string
  filePath?: string
  isDirty: boolean
  connectionId?: string
  databaseName?: string
  maxRows: number
}

export interface SessionState {
  version: number
  savedAt: string
  activeTabId: string | null
  tabCounter: number
  tabs: SerializedTab[]
}

function ensureConfigDir(): void {
  const configDir = getConfigDir()
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true })
  }
}

function atomicWriteFile(file: string, data: string): void {
  const tmp = `${file}.tmp`
  writeFileSync(tmp, data, 'utf-8')
  try {
    renameSync(tmp, file)
  } catch {
    // Windows 上目标文件已存在时 rename 可能失败，回退为直接覆盖
    writeFileSync(file, data, 'utf-8')
    try { unlinkSync(tmp) } catch { /* ignore */ }
  }
}

/**
 * 读取会话状态
 */
export function loadSessionState(): SessionState | null {
  try {
    ensureConfigDir()
    const file = getSessionStateFile()
    if (!existsSync(file)) {
      return null
    }
    const data = readFileSync(file, 'utf-8')
    const state = JSON.parse(data) as SessionState
    // 基本校验
    if (!state || !Array.isArray(state.tabs)) {
      return null
    }
    return state
  } catch (error) {
    console.error('[SessionState] Failed to load:', error)
    return null
  }
}

/**
 * 保存会话状态。空 tabs 一律拒绝写入，避免 debug 退出/渲染进程重载时把有效会话覆盖掉。
 */
export function saveSessionState(state: SessionState): void {
  try {
    if (!state?.tabs || state.tabs.length === 0) {
      console.warn('[SessionState] Skip saving empty tabs')
      return
    }
    ensureConfigDir()
    atomicWriteFile(getSessionStateFile(), JSON.stringify(state, null, 2))
    console.log('[SessionState] Saved', state.tabs.length, 'tabs')
  } catch (error) {
    console.error('[SessionState] Failed to save:', error)
  }
}
