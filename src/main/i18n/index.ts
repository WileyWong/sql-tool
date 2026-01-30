/**
 * 主进程国际化模块
 */
import { app } from 'electron'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'
import enUS from './locales/en-US'
import { getSavedLocale, saveLocale as persistLocale } from '../storage/settings-store'

// 支持的语言类型
export type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US'

// 语言包映射
const messages: Record<SupportedLocale, typeof zhCN> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS
}

// 当前语言
let currentLocale: SupportedLocale = 'zh-CN'

/**
 * 设置当前语言并持久化保存
 */
export function setLocale(locale: SupportedLocale): void {
  if (locale in messages) {
    currentLocale = locale
    // 持久化保存用户选择
    persistLocale(locale)
    console.log('[i18n] Locale set to:', locale)
  }
}

/**
 * 获取当前语言
 */
export function getLocale(): SupportedLocale {
  return currentLocale
}

/**
 * 翻译函数
 * @param key 翻译键，支持点号分隔的路径，如 'menu.file'
 */
export function t(key: string): string {
  const keys = key.split('.')
  let result: unknown = messages[currentLocale]
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k]
    } else {
      return key // 找不到翻译时返回键名
    }
  }
  
  return typeof result === 'string' ? result : key
}

/**
 * 检测系统语言并智能匹配
 * 使用 Electron 的 app.getLocale() 获取系统语言
 */
export function detectSystemLocale(): SupportedLocale {
  // 使用 Electron API 获取系统语言
  const systemLocale = app.getLocale()
  
  // 匹配繁体中文
  if (systemLocale === 'zh-TW' || systemLocale === 'zh-HK' || 
      systemLocale.startsWith('zh-Hant')) {
    return 'zh-TW'
  }
  
  // 匹配简体中文
  if (systemLocale === 'zh-CN' || systemLocale.startsWith('zh')) {
    return 'zh-CN'
  }
  
  // 默认英文
  return 'en-US'
}

/**
 * 初始化主进程国际化
 * 优先使用用户保存的语言设置，否则检测系统语言
 */
export function initI18n(): void {
  const savedLocale = getSavedLocale()
  console.log('[i18n] Init - saved locale:', savedLocale)
  if (savedLocale && savedLocale in messages) {
    currentLocale = savedLocale
    console.log('[i18n] Using saved locale:', savedLocale)
  } else {
    currentLocale = detectSystemLocale()
    console.log('[i18n] Using system locale:', currentLocale)
  }
}
