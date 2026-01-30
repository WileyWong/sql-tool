import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import type { SupportedLocale } from '../i18n'

// 延迟初始化路径，确保 app 已就绪
let CONFIG_DIR: string
let SETTINGS_FILE: string

function getConfigDir(): string {
  if (!CONFIG_DIR) {
    CONFIG_DIR = join(app.getPath('userData'), 'config')
  }
  return CONFIG_DIR
}

function getSettingsFile(): string {
  if (!SETTINGS_FILE) {
    SETTINGS_FILE = join(getConfigDir(), 'settings.json')
  }
  return SETTINGS_FILE
}

interface AppSettings {
  locale?: SupportedLocale
}

/**
 * 确保配置目录存在
 */
function ensureConfigDir(): void {
  const configDir = getConfigDir()
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true })
  }
}

/**
 * 读取设置
 */
export function loadSettings(): AppSettings {
  try {
    ensureConfigDir()
    const settingsFile = getSettingsFile()
    if (!existsSync(settingsFile)) {
      return {}
    }
    const data = readFileSync(settingsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to load settings:', error)
    return {}
  }
}

/**
 * 保存设置
 */
export function saveSettings(settings: AppSettings): void {
  try {
    ensureConfigDir()
    const existingSettings = loadSettings()
    const mergedSettings = { ...existingSettings, ...settings }
    writeFileSync(getSettingsFile(), JSON.stringify(mergedSettings, null, 2), 'utf-8')
    console.log('[Settings] Saved:', mergedSettings, 'to', getSettingsFile())
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

/**
 * 获取保存的语言设置
 */
export function getSavedLocale(): SupportedLocale | undefined {
  const settings = loadSettings()
  console.log('[Settings] Loaded locale:', settings.locale, 'from', getSettingsFile())
  return settings.locale
}

/**
 * 保存语言设置
 */
export function saveLocale(locale: SupportedLocale): void {
  saveSettings({ locale })
}
