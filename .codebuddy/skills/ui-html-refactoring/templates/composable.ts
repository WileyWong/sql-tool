/**
 * Composable 模板
 * 用于 Vue 3 可复用逻辑的标准结构
 */
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'

// ============ 类型定义 ============
interface UseFeatureOptions {
  /** 是否自动初始化 */
  autoInit?: boolean
  /** 初始值 */
  initialValue?: unknown
  /** 回调函数 */
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

interface UseFeatureReturn {
  /** 数据 */
  data: Ref<unknown>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<Error | null>
  /** 是否为空 */
  isEmpty: Ref<boolean>
  /** 获取数据 */
  fetch: () => Promise<void>
  /** 重置状态 */
  reset: () => void
}

// ============ Composable 实现 ============
export function useFeature(options: UseFeatureOptions = {}): UseFeatureReturn {
  const {
    autoInit = true,
    initialValue = null,
    onSuccess,
    onError
  } = options

  // -------- 响应式状态 --------
  const data = ref<unknown>(initialValue)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // -------- 计算属性 --------
  const isEmpty = computed(() => {
    return !data.value || (Array.isArray(data.value) && data.value.length === 0)
  })

  // -------- 方法 --------
  async function fetch() {
    loading.value = true
    error.value = null

    try {
      // 替换为实际的异步操作
      // data.value = await api.fetchData()
      onSuccess?.(data.value)
    } catch (err) {
      error.value = err as Error
      onError?.(err as Error)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    data.value = initialValue
    loading.value = false
    error.value = null
  }

  // -------- 生命周期 --------
  onMounted(() => {
    if (autoInit) {
      fetch()
    }
  })

  // 清理逻辑
  let cleanupFn: (() => void) | null = null

  onUnmounted(() => {
    cleanupFn?.()
  })

  // -------- 返回值 --------
  return {
    data,
    loading,
    error,
    isEmpty,
    fetch,
    reset
  }
}

// ============ 使用示例 ============
/*
import { useFeature } from '@/composables/useFeature'

const { data, loading, error, fetch, reset } = useFeature({
  autoInit: true,
  onSuccess: (data) => console.log('加载成功', data),
  onError: (err) => console.error('加载失败', err)
})
*/
