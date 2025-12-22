# Vue 3.x 重构指南

## 概述

Vue 3.x 项目重构指南，聚焦 Composition API、响应式系统、TypeScript 集成和性能优化。

## 重构优先级

| 优先级 | 重构项 | 收益 |
|--------|--------|------|
| P0 | 采用 `<script setup>` | 简洁性 |
| P0 | 提取 Composables | 复用性 |
| P1 | 优化响应式使用 | 性能 |
| P1 | 规范 Props/Emits | 类型安全 |
| P2 | 使用新特性 | 开发体验 |

## Composition API 规范

### `<script setup>` 结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '@/types'

// 2. Props 和 Emits
const props = defineProps<{
  userId: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', user: User): void
  (e: 'delete', id: string): void
}>()

// 3. Composables
const router = useRouter()
const { user, loading, fetchUser } = useUser(props.userId)

// 4. 响应式状态
const localState = ref('')
const isEditing = ref(false)

// 5. 计算属性
const displayName = computed(() => user.value?.name ?? '未知')

// 6. 方法
function handleSubmit() {
  emit('update', user.value!)
}

// 7. 生命周期
onMounted(() => {
  fetchUser()
})
</script>
```

### 响应式 API 选择

| API | 适用场景 | 示例 |
|-----|----------|------|
| `ref` | 基本类型、需要替换整个值 | `ref(0)`、`ref('')` |
| `reactive` | 对象/数组、不需要替换整体 | `reactive({ name: '' })` |
| `computed` | 派生状态 | `computed(() => a + b)` |
| `shallowRef` | 大对象、只关心引用变化 | `shallowRef(bigData)` |
| `shallowReactive` | 大对象、只关心顶层属性 | `shallowReactive(config)` |

### ref vs reactive 选择

```typescript
// 使用 ref：基本类型、需要重新赋值
const count = ref(0)
const user = ref<User | null>(null)

// 修改
count.value++
user.value = newUser

// 使用 reactive：对象、不需要重新赋值
const form = reactive({
  name: '',
  email: '',
  age: 0
})

// 修改
form.name = 'John'
Object.assign(form, newFormData)

// 注意：reactive 不能重新赋值
// form = newForm  // 错误！会丢失响应式
```

## Props 和 Emits

### 类型安全的 Props

```typescript
// 基础定义
const props = defineProps<{
  title: string
  count?: number
  items: string[]
}>()

// 带默认值
const props = withDefaults(defineProps<{
  title: string
  count?: number
  theme?: 'light' | 'dark'
}>(), {
  count: 0,
  theme: 'light'
})

// 复杂类型
interface Props {
  user: User
  onUpdate?: (user: User) => void
  config?: {
    readonly: boolean
    showHeader: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({ readonly: false, showHeader: true })
})
```

### 类型安全的 Emits

```typescript
// 基础定义
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
  (e: 'change'): void
}>()

// Vue 3.3+ 简化语法
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
  change: []
}>()

// 使用
emit('update', 'new value')
emit('delete', 123)
emit('change')
```

### v-model 实现

```typescript
// 单个 v-model
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 使用 computed 简化
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 多个 v-model
const props = defineProps<{
  firstName: string
  lastName: string
}>()

const emit = defineEmits<{
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
}>()

// 父组件使用
// <UserForm v-model:first-name="first" v-model:last-name="last" />
```

## Composables 设计

### 基础结构

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  
  const double = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initial
  }
  
  return {
    count,      // 状态
    double,     // 计算属性
    increment,  // 方法
    decrement,
    reset
  }
}
```

### 异步数据 Composable

```typescript
// composables/useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
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

  // 自动执行，URL 变化时重新请求
  watchEffect(() => {
    execute()
  })

  return { data, error, loading, refetch: execute }
}

// 使用
const userId = ref(1)
const { data: user, loading } = useFetch<User>(
  () => `/api/users/${userId.value}`
)
```

### 带生命周期的 Composable

```typescript
// composables/useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  event: K,
  handler: (e: WindowEventMap[K]) => void
) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}

// 使用
useEventListener(window, 'resize', () => {
  console.log('Window resized')
})
```

## 生命周期优化

### 生命周期对照

| Vue 2 Options API | Vue 3 Composition API |
|-------------------|----------------------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |

### 正确使用生命周期

```typescript
import { 
  onMounted, 
  onUnmounted, 
  onBeforeUnmount,
  watch 
} from 'vue'

// 初始化
onMounted(() => {
  initChart()
  startPolling()
})

// 清理
onBeforeUnmount(() => {
  stopPolling()
})

onUnmounted(() => {
  destroyChart()
})

// watch 自动清理
watch(source, (newVal) => {
  const timer = setTimeout(() => {
    // do something
  }, 1000)
  
  // 返回清理函数
  return () => clearTimeout(timer)
})
```

## 性能优化

### shallowRef/shallowReactive

```typescript
// 大型数据使用 shallowRef
const bigList = shallowRef<Item[]>([])

// 更新时需要替换整个引用
bigList.value = [...bigList.value, newItem]

// 或使用 triggerRef 手动触发
bigList.value.push(newItem)
triggerRef(bigList)
```

### v-memo 优化列表

```vue
<!-- 仅当 item.id 或 selected 变化时重新渲染 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, selected === item.id]">
  <p>{{ item.name }}</p>
  <p>{{ selected === item.id ? 'Selected' : '' }}</p>
</div>
```

### 异步组件

```typescript
import { defineAsyncComponent } from 'vue'

// 基础用法
const AsyncModal = defineAsyncComponent(() => 
  import('./Modal.vue')
)

// 带加载状态
const AsyncChart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000
})
```

### Suspense 使用

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncDashboard />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
// AsyncDashboard.vue 可以有 async setup
const data = await fetchDashboardData()
</script>
```

## 新特性应用

### Teleport

```vue
<!-- 将内容渲染到 body -->
<Teleport to="body">
  <Modal v-if="showModal" @close="showModal = false" />
</Teleport>

<!-- 条件禁用 -->
<Teleport to="body" :disabled="isMobile">
  <Tooltip :content="tip" />
</Teleport>
```

### Provide/Inject 类型安全

```typescript
// types/injection.ts
import type { InjectionKey, Ref } from 'vue'

export interface UserContext {
  user: Ref<User | null>
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const userKey: InjectionKey<UserContext> = Symbol('user')

// Provider
import { provide, ref } from 'vue'
import { userKey } from '@/types/injection'

const user = ref<User | null>(null)
provide(userKey, {
  user,
  login: async (credentials) => { /* ... */ },
  logout: () => { user.value = null }
})

// Consumer
import { inject } from 'vue'
import { userKey } from '@/types/injection'

const userContext = inject(userKey)
if (!userContext) throw new Error('User context not provided')
```

## Vue 3.4+ 新特性

### defineModel()（Vue 3.4+）

简化 v-model 双向绑定实现：

```vue
<script setup lang="ts">
// 之前的写法
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Vue 3.4+ 新写法
const model = defineModel<string>()

// 带默认值
const count = defineModel<number>({ default: 0 })

// 多个 v-model
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')

// 带验证
const email = defineModel<string>({
  required: true,
  validator: (value) => value.includes('@')
})
</script>

<template>
  <input v-model="model" />
</template>
```

### v-bind 同名简写（Vue 3.4+）

```vue
<template>
  <!-- 之前的写法 -->
  <div :id="id" :class="class" :style="style"></div>
  
  <!-- Vue 3.4+ 简写 -->
  <div :id :class="className" :style></div>
  
  <!-- 等价于 -->
  <div :id="id" :class="className" :style="style"></div>
</template>

<script setup>
const id = ref('my-id')
const className = ref('my-class')  // 注意：class 是保留字，使用 className
const style = ref({ color: 'red' })
</script>
```

### 改进的 watch（Vue 3.4+）

```typescript
// watch 支持 once 选项
watch(source, (newVal) => {
  console.log('只触发一次')
}, { once: true })

// 暂停和恢复 watch（需要 VueUse 库）
// 注意：watchPausable 是 VueUse 的 API，非 Vue 核心
// 安装：npm install @vueuse/core
// 文档：https://vueuse.org/core/watchPausable/
import { watchPausable } from '@vueuse/core'

const { pause, resume, stop } = watchPausable(source, (newVal) => {
  console.log(newVal)
})

pause()  // 暂停监听
resume() // 恢复监听
stop()   // 停止监听
```

### useTemplateRef()（Vue 3.5+）

类型安全的模板引用：

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

// Vue 3.5+ 新方式
const inputRef = useTemplateRef<HTMLInputElement>('input')

// 之前的写法
// const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

### Deferred Teleport（Vue 3.5+）

延迟 Teleport 直到目标元素存在：

```vue
<template>
  <!-- defer 属性：等待目标元素挂载后再传送 -->
  <Teleport defer to="#dynamic-container">
    <Modal />
  </Teleport>
  
  <!-- 动态创建的容器 -->
  <div v-if="showContainer" id="dynamic-container"></div>
</template>
```

### useId()（Vue 3.5+）

生成唯一 ID，支持 SSR：

```vue
<script setup>
import { useId } from 'vue'

// 生成唯一 ID
const id = useId()
// 输出类似: "v-0", "v-1", ...
</script>

<template>
  <label :for="id">用户名</label>
  <input :id="id" type="text" />
</template>
```

### 响应式 Props 解构（Vue 3.5+）

```vue
<script setup lang="ts">
// Vue 3.5+ 支持响应式解构
const { count = 0, title } = defineProps<{
  count?: number
  title: string
}>()

// 解构后仍保持响应式
watchEffect(() => {
  console.log(count, title)
})
</script>
```

### onWatcherCleanup()（Vue 3.5+）

在 watch 回调中注册清理函数：

```typescript
import { watch, onWatcherCleanup } from 'vue'

watch(source, async (newVal) => {
  const controller = new AbortController()
  
  // 注册清理函数
  onWatcherCleanup(() => {
    controller.abort()
  })
  
  const data = await fetch(url, {
    signal: controller.signal
  })
})
```

## 重构检查清单

### 语法规范
- [ ] 使用 `<script setup>` 语法
- [ ] Props/Emits 有完整类型定义
- [ ] 使用 `withDefaults` 设置默认值
- [ ] v-model 实现符合规范
- [ ] Vue 3.4+ 使用 `defineModel()` 简化 v-model
- [ ] Vue 3.4+ 使用 v-bind 同名简写

### Composables
- [ ] 通用逻辑提取为 Composable
- [ ] Composable 命名以 `use` 开头
- [ ] 返回值结构清晰（状态、计算属性、方法）
- [ ] 有适当的清理逻辑

### 响应式
- [ ] 基本类型使用 ref
- [ ] 对象使用 ref 或 reactive（一致性）
- [ ] 大数据使用 shallowRef/shallowReactive
- [ ] 避免解构丢失响应式
- [ ] Vue 3.5+ 可使用响应式 Props 解构

### 性能
- [ ] 大列表使用 v-memo
- [ ] 大组件使用异步加载
- [ ] 合理使用 Suspense
- [ ] 清理定时器/事件监听

### Vue 3.4+ 新特性
- [ ] 使用 `defineModel()` 简化双向绑定
- [ ] 使用 v-bind 同名简写
- [ ] 使用 `watch({ once: true })` 替代手动停止

### Vue 3.5+ 新特性
- [ ] 使用 `useTemplateRef()` 获取类型安全的模板引用
- [ ] 使用 `useId()` 生成唯一 ID
- [ ] 使用 `onWatcherCleanup()` 清理异步操作
- [ ] 使用 `defer` Teleport 处理动态目标
