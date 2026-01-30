import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'
import enUS from './locales/en-US.json'

// 支持的语言列表
export const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 语言选项（用于设置界面）
export const LOCALE_OPTIONS: { value: SupportedLocale; label: string }[] = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en-US', label: 'English' }
]

/**
 * 检测系统语言并智能匹配
 */
function detectSystemLocale(): SupportedLocale {
  const systemLocale = navigator.language
  
  // 智能匹配
  if (systemLocale.startsWith('zh-TW') || systemLocale.startsWith('zh-HK')) {
    return 'zh-TW'
  }
  if (systemLocale.startsWith('zh')) {
    return 'zh-CN'
  }
  if (systemLocale.startsWith('en')) {
    return 'en-US'
  }
  
  // 默认回退到英文
  return 'en-US'
}

/**
 * 创建 i18n 实例
 * 初始使用系统语言，之后会从主进程同步用户保存的设置
 */
export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 允许在模板中使用 $t()
  locale: detectSystemLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

/**
 * 从主进程同步语言设置
 * 应在应用启动后调用
 */
export async function syncLocaleFromMain(): Promise<void> {
  try {
    const savedLocale = await window.api?.locale?.getLocale()
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as SupportedLocale)) {
      i18n.global.locale.value = savedLocale as SupportedLocale
      console.log('[i18n] Synced locale from main:', savedLocale)
    }
  } catch (error) {
    console.error('[i18n] Failed to sync locale from main:', error)
  }
}

export default i18n
