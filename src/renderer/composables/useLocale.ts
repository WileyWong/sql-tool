import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_OPTIONS, type SupportedLocale } from '../i18n'

/**
 * 语言切换 Composable
 */
export function useLocale() {
  const { locale, t } = useI18n()
  
  /**
   * 当前语言（可读写）
   */
  const currentLocale = computed({
    get: () => locale.value as SupportedLocale,
    set: (val: SupportedLocale) => {
      locale.value = val
      // 通知主进程更新菜单语言并持久化保存
      window.api?.locale?.setLocale(val)
    }
  })
  
  /**
   * 切换语言
   */
  function setLocale(newLocale: SupportedLocale) {
    currentLocale.value = newLocale
  }
  
  return {
    currentLocale,
    localeOptions: LOCALE_OPTIONS,
    setLocale,
    t
  }
}
