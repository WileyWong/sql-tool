# Composables 设计模式

## 概述

Vue 3 Composables 设计模式指南，包含常用模式、设计原则和最佳实践。

## 设计原则

| 原则 | 说明 |
|------|------|
| 单一职责 | 每个 Composable 只做一件事 |
| 可组合 | Composables 可以相互组合使用 |
| 无副作用 | 纯函数优先，副作用明确标注 |
| 类型安全 | 完整的 TypeScript 类型定义 |
| 可测试 | 易于单元测试 |

## 基础模式

### 状态管理模式

```typescript
// composables/useToggle.ts
import { ref, type Ref } from 'vue'

interface UseToggleReturn {
  value: Ref<boolean>
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
}

export function useToggle(initial = false): UseToggleReturn {
  const value = ref(initial)
  
  const toggle = () => { value.value = !value.value }
  const setTrue = () => { value.value = true }
  const setFalse = () => { value.value = false }
  
  return { value, toggle, setTrue, setFalse }
}

// 使用
const { value: isOpen, toggle, setFalse: close } = useToggle()
```

### 计数器模式

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

interface UseCounterOptions {
  min?: number
  max?: number
  step?: number
}

export function useCounter(initial = 0, options: UseCounterOptions = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options
  const count = ref(initial)
  
  const isMin = computed(() => count.value <= min)
  const isMax = computed(() => count.value >= max)
  
  function increment() {
    if (count.value + step <= max) {
      count.value += step
    }
  }
  
  function decrement() {
    if (count.value - step >= min) {
      count.value -= step
    }
  }
  
  function set(value: number) {
    count.value = Math.min(Math.max(value, min), max)
  }
  
  function reset() {
    count.value = initial
  }
  
  return { count, isMin, isMax, increment, decrement, set, reset }
}
```

### 列表管理模式

```typescript
// composables/useList.ts
import { ref, computed } from 'vue'

export function useList<T extends { id: string | number }>(initial: T[] = []) {
  const items = ref<T[]>(initial)
  
  const isEmpty = computed(() => items.value.length === 0)
  const count = computed(() => items.value.length)
  
  function add(item: T) {
    items.value.push(item)
  }
  
  function remove(id: T['id']) {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }
  
  function update(id: T['id'], updates: Partial<T>) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      Object.assign(item, updates)
    }
  }
  
  function find(id: T['id']): T | undefined {
    return items.value.find(item => item.id === id)
  }
  
  function clear() {
    items.value = []
  }
  
  return { items, isEmpty, count, add, remove, update, find, clear }
}
```

## 异步模式

### 数据获取模式

```typescript
// composables/useFetch.ts
import { ref, shallowRef, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  refetch?: boolean
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions = {}
) {
  const { immediate = true, refetch = true } = options
  
  const data = shallowRef<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(toValue(url))
      if (!response.ok) throw new Error(response.statusText)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  if (refetch) {
    watchEffect(() => {
      toValue(url)  // 触发依赖追踪
      if (immediate || data.value !== null) {
        execute()
      }
    })
  } else if (immediate) {
    execute()
  }
  
  return { data, error, loading, execute }
}
```

### 防抖/节流模式

```typescript
// composables/useDebouncedRef.ts
import { ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(value: T, delay = 300): Ref<T> {
  const debouncedValue = ref(value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>
  
  watch(() => value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  return debouncedValue
}

// composables/useThrottleFn.ts
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): T {
  let lastTime = 0
  
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      return fn(...args)
    }
  }) as T
}
```

### 轮询模式

```typescript
// composables/usePolling.ts
import { ref, onUnmounted } from 'vue'

interface UsePollingOptions {
  interval?: number
  immediate?: boolean
}

export function usePolling<T>(
  fetcher: () => Promise<T>,
  options: UsePollingOptions = {}
) {
  const { interval = 5000, immediate = true } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isPolling = ref(false)
  
  let timer: ReturnType<typeof setInterval> | null = null
  
  async function execute() {
    try {
      data.value = await fetcher()
      error.value = null
    } catch (e) {
      error.value = e as Error
    }
  }
  
  function start() {
    if (isPolling.value) return
    isPolling.value = true
    if (immediate) execute()
    timer = setInterval(execute, interval)
  }
  
  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isPolling.value = false
  }
  
  onUnmounted(stop)
  
  return { data, error, isPolling, start, stop, execute }
}
```

## DOM 模式

### 事件监听模式

```typescript
// composables/useEventListener.ts
import { onMounted, onUnmounted, unref, type MaybeRef } from 'vue'

export function useEventListener<K extends keyof WindowEventMap>(
  target: MaybeRef<Window | null>,
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: MaybeRef<HTMLElement | null>,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): void

export function useEventListener(
  target: MaybeRef<EventTarget | null>,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) {
  onMounted(() => {
    const el = unref(target)
    el?.addEventListener(event, handler, options)
  })
  
  onUnmounted(() => {
    const el = unref(target)
    el?.removeEventListener(event, handler, options)
  })
}
```

### 鼠标位置模式

```typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
```

### 元素尺寸模式

```typescript
// composables/useElementSize.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useElementSize(target: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)
  
  let observer: ResizeObserver | null = null
  
  function update() {
    if (target.value) {
      width.value = target.value.offsetWidth
      height.value = target.value.offsetHeight
    }
  }
  
  onMounted(() => {
    update()
    observer = new ResizeObserver(update)
    if (target.value) {
      observer.observe(target.value)
    }
  })
  
  onUnmounted(() => {
    observer?.disconnect()
  })
  
  return { width, height }
}
```

## 存储模式

### LocalStorage 模式

```typescript
// composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>
  
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )
  
  return value
}

// 使用
const theme = useLocalStorage('theme', 'light')
const settings = useLocalStorage('settings', { notifications: true })
```

### SessionStorage 模式

```typescript
// composables/useSessionStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  const storedValue = sessionStorage.getItem(key)
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>
  
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )
  
  return value
}
```

## 组合模式

### Composable 组合

```typescript
// composables/useUserProfile.ts
import { computed } from 'vue'
import { useFetch } from './useFetch'
import { useLocalStorage } from './useLocalStorage'

export function useUserProfile(userId: string) {
  // 组合多个 Composables
  const { data: user, loading, error, execute: refetch } = useFetch<User>(
    () => `/api/users/${userId}`
  )
  
  const preferences = useLocalStorage(`user-${userId}-prefs`, {
    theme: 'light',
    language: 'zh-CN'
  })
  
  const displayName = computed(() => 
    user.value?.nickname || user.value?.name || '未知用户'
  )
  
  const isAdmin = computed(() => 
    user.value?.role === 'admin'
  )
  
  return {
    user,
    loading,
    error,
    refetch,
    preferences,
    displayName,
    isAdmin
  }
}
```

### 工厂模式

```typescript
// composables/createAsyncState.ts
import { ref, shallowRef } from 'vue'

interface AsyncStateOptions<T> {
  immediate?: boolean
  initialState?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function createAsyncState<T, P extends any[]>(
  asyncFn: (...args: P) => Promise<T>,
  options: AsyncStateOptions<T> = {}
) {
  const { initialState = null, onSuccess, onError } = options
  
  const data = shallowRef<T | null>(initialState)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute(...args: P): Promise<T | null> {
    loading.value = true
    error.value = null
    
    try {
      const result = await asyncFn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e as Error
      error.value = err
      onError?.(err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}

// 使用
const { data: users, loading, execute: fetchUsers } = createAsyncState(
  (page: number) => api.getUsers({ page }),
  { onError: (e) => console.error('Failed to fetch users:', e) }
)

await fetchUsers(1)
```

## 设计检查清单

### 命名规范
- [ ] 以 `use` 开头
- [ ] 使用 camelCase
- [ ] 名称描述功能（如 `useFetch`、`useLocalStorage`）

### 返回值设计
- [ ] 返回对象而非数组（易于解构重命名）
- [ ] 状态和方法分离清晰
- [ ] computed 用于派生状态

### 类型安全
- [ ] 完整的 TypeScript 类型
- [ ] 泛型支持（如需要）
- [ ] 返回类型明确

### 副作用处理
- [ ] 使用 onMounted/onUnmounted 管理生命周期
- [ ] 清理定时器/事件监听
- [ ] 取消未完成的请求

### 可测试性
- [ ] 纯函数优先
- [ ] 依赖可注入
- [ ] 状态可重置
