# Vue + TypeScript 最佳实践

## 概述

Vue 项目中 TypeScript 的最佳实践，包含类型定义、组件类型、API 类型和常见模式。

## 项目配置

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    
    // Vue 相关
    "types": ["vite/client"],
    
    // 路径别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

## 组件类型

### Props 类型定义

```typescript
// 基础类型
const props = defineProps<{
  title: string
  count: number
  active: boolean
  items: string[]
  user: User
}>()

// 可选属性 + 默认值
interface Props {
  title: string
  count?: number
  theme?: 'light' | 'dark'
  config?: {
    showHeader: boolean
    maxItems: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  theme: 'light',
  config: () => ({ showHeader: true, maxItems: 10 })
})

// 复杂类型
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface TableProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    title: string
    width?: number
  }>
  loading?: boolean
  onRowClick?: (row: T) => void
}

const props = defineProps<TableProps<User>>()
```

### Emits 类型定义

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

// 复杂事件类型
interface FormData {
  name: string
  email: string
}

const emit = defineEmits<{
  (e: 'submit', data: FormData): void
  (e: 'validate', field: keyof FormData, valid: boolean): void
  (e: 'reset'): void
}>()
```

### Slots 类型定义

```typescript
// 定义插槽类型
const slots = defineSlots<{
  default(props: { item: User; index: number }): any
  header(props: { title: string }): any
  footer(): any
}>()

// 使用
<template>
  <div>
    <slot name="header" :title="title" />
    <slot v-for="(item, index) in items" :item="item" :index="index" />
    <slot name="footer" />
  </div>
</template>
```

### Expose 类型定义

```typescript
// 子组件
const inputRef = ref<HTMLInputElement | null>(null)

function focus() {
  inputRef.value?.focus()
}

function clear() {
  // ...
}

defineExpose({
  focus,
  clear
})

// 父组件使用
interface InputExpose {
  focus: () => void
  clear: () => void
}

const inputRef = ref<InstanceType<typeof MyInput> | null>(null)
// 或更精确
const inputRef = ref<InputExpose | null>(null)

function handleFocus() {
  inputRef.value?.focus()
}
```

## Composables 类型

### 基础 Composable

```typescript
// composables/useCounter.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'

interface UseCounterReturn {
  count: Ref<number>
  double: ComputedRef<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(initial = 0): UseCounterReturn {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initial }
  
  return { count, double, increment, decrement, reset }
}
```

### 异步 Composable

```typescript
// composables/useFetch.ts
import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'

interface UseFetchOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseFetchReturn<T> {
  data: ShallowRef<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { immediate = true, initialData = null, onSuccess, onError } = options
  
  const data = shallowRef<T | null>(initialData)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const resolvedUrl = typeof url === 'function' ? url() : url
      const response = await fetch(resolvedUrl)
      if (!response.ok) throw new Error(response.statusText)
      
      const result = await response.json() as T
      data.value = result
      onSuccess?.(result)
    } catch (e) {
      const err = e as Error
      error.value = err
      onError?.(err)
    } finally {
      loading.value = false
    }
  }
  
  if (immediate) execute()
  
  return { data, error, loading, execute }
}
```

### 泛型 Composable

```typescript
// composables/useList.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'

interface UseListReturn<T> {
  items: Ref<T[]>
  isEmpty: ComputedRef<boolean>
  count: ComputedRef<number>
  add: (item: T) => void
  remove: (predicate: (item: T) => boolean) => void
  clear: () => void
  find: (predicate: (item: T) => boolean) => T | undefined
}

export function useList<T>(initial: T[] = []): UseListReturn<T> {
  const items = ref<T[]>(initial) as Ref<T[]>
  
  const isEmpty = computed(() => items.value.length === 0)
  const count = computed(() => items.value.length)
  
  function add(item: T) {
    items.value.push(item)
  }
  
  function remove(predicate: (item: T) => boolean) {
    items.value = items.value.filter(item => !predicate(item))
  }
  
  function clear() {
    items.value = []
  }
  
  function find(predicate: (item: T) => boolean): T | undefined {
    return items.value.find(predicate)
  }
  
  return { items, isEmpty, count, add, remove, clear, find }
}
```

## API 类型

### 请求/响应类型

```typescript
// types/api.ts

// 通用响应结构
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页响应
interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户相关
interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: string
}

interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

interface UpdateUserRequest {
  name?: string
  email?: string
  avatar?: string
}

// API 函数类型
type GetUser = (id: number) => Promise<ApiResponse<User>>
type GetUsers = (params: { page: number; pageSize: number }) => Promise<ApiResponse<PaginatedResponse<User>>>
type CreateUser = (data: CreateUserRequest) => Promise<ApiResponse<User>>
type UpdateUser = (id: number, data: UpdateUserRequest) => Promise<ApiResponse<User>>
type DeleteUser = (id: number) => Promise<ApiResponse<null>>
```

### API 封装

```typescript
// api/user.ts
import { http } from '@/utils/http'
import type { User, CreateUserRequest, UpdateUserRequest, ApiResponse, PaginatedResponse } from '@/types/api'

export const userApi = {
  getUser(id: number): Promise<ApiResponse<User>> {
    return http.get(`/users/${id}`)
  },
  
  getUsers(params: { page: number; pageSize: number }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return http.get('/users', { params })
  },
  
  createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return http.post('/users', data)
  },
  
  updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return http.put(`/users/${id}`, data)
  },
  
  deleteUser(id: number): Promise<ApiResponse<null>> {
    return http.delete(`/users/${id}`)
  }
}
```

## Provide/Inject 类型

```typescript
// types/injection.ts
import type { InjectionKey, Ref } from 'vue'

// 定义注入类型
export interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}

export interface UserContext {
  user: Ref<User | null>
  isLoggedIn: Ref<boolean>
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

// 创建注入 key
export const themeKey: InjectionKey<ThemeContext> = Symbol('theme')
export const userKey: InjectionKey<UserContext> = Symbol('user')

// Provider 组件
// App.vue
import { provide, ref } from 'vue'
import { themeKey, userKey } from '@/types/injection'

const theme = ref<'light' | 'dark'>('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide(themeKey, { theme, toggleTheme })

// Consumer 组件
import { inject } from 'vue'
import { themeKey } from '@/types/injection'

const themeContext = inject(themeKey)
if (!themeContext) {
  throw new Error('Theme context not provided')
}

const { theme, toggleTheme } = themeContext
```

## 常见类型模式

### 组件实例类型

```typescript
import type { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// 获取组件实例类型
type MyComponentInstance = InstanceType<typeof MyComponent>

// 使用
const componentRef = ref<MyComponentInstance | null>(null)
```

### 事件处理类型

```typescript
// 原生事件
function handleClick(event: MouseEvent) {
  console.log(event.clientX, event.clientY)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    // ...
  }
}

// 表单事件
function handleSubmit(event: Event) {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
}
```

### 模板 ref 类型

```typescript
// 单个元素
const inputRef = ref<HTMLInputElement | null>(null)
const divRef = ref<HTMLDivElement | null>(null)

// 组件 ref
import MyComponent from './MyComponent.vue'
const componentRef = ref<InstanceType<typeof MyComponent> | null>(null)

// 动态 ref 列表
const itemRefs = ref<HTMLLIElement[]>([])

// 模板中
<template>
  <input ref="inputRef" />
  <MyComponent ref="componentRef" />
  <li v-for="item in items" :ref="el => itemRefs.push(el as HTMLLIElement)">
    {{ item }}
  </li>
</template>
```

### 工具类型应用

```typescript
// 使用 Partial 创建可选更新类型
interface User {
  id: number
  name: string
  email: string
}

type UpdateUserData = Partial<Omit<User, 'id'>>

// 使用 Pick 选择部分属性
type UserPreview = Pick<User, 'id' | 'name'>

// 使用 Record 创建映射类型
type UserRolePermissions = Record<'admin' | 'user' | 'guest', string[]>

// 使用 Extract/Exclude 过滤联合类型
type Status = 'pending' | 'active' | 'completed' | 'cancelled'
type ActiveStatus = Extract<Status, 'pending' | 'active'>
type FinishedStatus = Exclude<Status, 'pending' | 'active'>
```

## 类型检查清单

### 组件类型
- [ ] Props 有完整类型定义
- [ ] Emits 有类型定义
- [ ] Slots 有类型定义（如需要）
- [ ] Expose 有类型定义（如需要）
- [ ] 模板 ref 有正确类型

### Composables
- [ ] 返回值有明确类型
- [ ] 参数有类型定义
- [ ] 泛型使用正确

### API
- [ ] 请求/响应有类型定义
- [ ] 错误类型有处理
- [ ] 分页类型统一

### 通用
- [ ] 无 any 类型
- [ ] 无 @ts-ignore
- [ ] 无不必要的类型断言
- [ ] 使用 import type 导入纯类型
