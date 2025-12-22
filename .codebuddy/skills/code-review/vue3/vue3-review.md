# Vue 3 + TypeScript 代码审查指南

基于 Vue 3 Composition API + TypeScript 的专业代码审查。

> 📚 **参考**: [Vue 3 技术栈](mdc:.codebuddy/spec/global/knowledge/stack/vue3.md)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-vue-{时间戳}.md`

## ⚠️ 版本兼容性说明

本指南涵盖 Vue 3.0 - 3.5 版本特性，部分 API 需要特定版本支持。审查时请注意项目的 Vue 版本。

| 版本 | 主要特性 |
|------|----------|
| **Vue 3.0** | Composition API、Teleport、Fragments |
| **Vue 3.2** | `<script setup>`、`v-memo`、`effectScope` |
| **Vue 3.3** | `defineSlots`、泛型组件、`defineOptions` |
| **Vue 3.4** | `defineModel`、改进的响应式系统 |
| **Vue 3.5** | `useTemplateRef`、响应式 Props 解构 |

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理、命名清晰 |
| 响应式系统 | 20% | ref/reactive 正确使用、避免响应性丢失 |
| Composables | 15% | 封装合理、副作用清理、类型安全 |
| 性能优化 | 20% | 虚拟滚动、懒加载、避免重渲染 |
| 安全性 | 15% | XSS 防护、输入验证 |
| 可维护性 | 10% | 类型完整、测试覆盖、代码清晰 |

## 组件设计审查

### 组件大小

| 指标 | 阈值 | 说明 |
|------|------|------|
| 组件行数 | ≤ 300 行 | 超过应拆分 |
| 模板行数 | ≤ 100 行 | 复杂模板提取子组件 |
| Props 数量 | ≤ 10 个 | 过多考虑重构 |

### 组件命名

```vue
<!-- ✅ 多词组件名 -->
<UserProfile />
<OrderList />

<!-- ❌ 单词组件名 -->
<Profile />
<List />
```

### Props 类型定义

```typescript
// ✅ 完整类型定义
interface Props {
  userId: number
  userName: string
  role?: 'admin' | 'user'
  onUpdate?: (user: User) => void
}

const props = withDefaults(defineProps<Props>(), {
  role: 'user'
})

// ❌ 缺少类型
const props = defineProps(['userId', 'userName'])
```

### Emits 类型定义

```typescript
// ✅ 带类型的 Emits
const emit = defineEmits<{
  update: [user: User]
  delete: [id: number]
}>()

// ❌ 无类型
const emit = defineEmits(['update', 'delete'])
```

## 响应式系统审查

### ref vs reactive

```typescript
// ✅ 基本类型用 ref
const count = ref(0)
const name = ref('')

// ✅ 对象用 reactive
const user = reactive({
  id: 1,
  name: 'John',
  email: 'john@example.com'
})

// ❌ 对象用 ref（需要 .value）
const user = ref({ id: 1, name: 'John' })
```

### 避免响应性丢失

```typescript
// ❌ 解构丢失响应性
const { name, email } = user

// ✅ 使用 toRefs
const { name, email } = toRefs(user)

// ✅ 使用 computed
const userName = computed(() => user.name)
```

### computed 使用

```typescript
// ✅ 派生状态用 computed
const fullName = computed(() => `${user.firstName} ${user.lastName}`)

// ❌ 用 ref + watch 实现派生状态
const fullName = ref('')
watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})
```

## Composables 审查

### 命名规范

```typescript
// ✅ use 前缀
export function useUser() { }
export function useFetch() { }
export function useLocalStorage() { }

// ❌ 无前缀
export function getUser() { }
export function fetchData() { }
```

### 副作用清理

```typescript
// ✅ 清理副作用
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}

// ❌ 未清理
export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
    // 忘记清理！
  })
}
```

### 返回值类型

```typescript
// ✅ 明确返回类型
interface UseUserReturn {
  user: Ref<User | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  fetchUser: (id: number) => Promise<void>
}

export function useUser(): UseUserReturn {
  // ...
}
```

### effectScope 管理 **[Vue 3.2+]**

```typescript
// ✅ 使用 effectScope 管理多个响应式效果
import { effectScope, onScopeDispose } from 'vue'

export function useFeature() {
  const scope = effectScope()
  
  scope.run(() => {
    const state = ref(0)
    
    watch(state, () => {
      console.log('state changed')
    })
    
    watchEffect(() => {
      console.log('effect:', state.value)
    })
  })
  
  // 清理所有效果
  onScopeDispose(() => {
    scope.stop()
  })
  
  return { scope }
}

// ❌ 手动管理多个 watcher
export function useFeature() {
  const stop1 = watch(...)
  const stop2 = watchEffect(...)
  
  onUnmounted(() => {
    stop1()
    stop2()
    // 容易遗漏
  })
}
```

### 异步 Composables

```typescript
// ✅ 异步 Composable 正确模式
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = shallowRef<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  // 返回 Promise 供 Suspense 使用
  const promise = execute()
  
  return {
    data,
    error,
    loading,
    execute,
    // 供 async setup 使用
    promise
  }
}

// ❌ 在 Composable 中直接 await（会阻塞）
export async function useAsyncData() {
  const data = await fetch('/api/data')  // ❌ 阻塞
  return { data }
}
```

## 性能优化审查

### 大列表虚拟滚动

```vue
<!-- ❌ 直接渲染大列表 -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

<!-- ✅ 使用虚拟滚动 -->
<VirtualList :items="items" :item-height="50">
  <template #default="{ item }">
    {{ item.name }}
  </template>
</VirtualList>
```

### 组件懒加载

```typescript
// ✅ 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

// ✅ 组件懒加载
const HeavyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
)
```

### 避免不必要的重渲染

```vue
<!-- ✅ 使用 v-once 静态内容 -->
<div v-once>{{ staticContent }}</div>

<!-- ✅ 使用 v-memo 缓存 -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  {{ item.name }}
</div>
```

### shallowRef 优化

```typescript
// ✅ 大对象用 shallowRef
const largeData = shallowRef<LargeObject[]>([])

// 整体替换触发更新
largeData.value = newData
```

## 安全性审查

### XSS 防护

```vue
<!-- ❌ 危险：直接渲染 HTML -->
<div v-html="userInput"></div>

<!-- ✅ 安全：使用 DOMPurify -->
<script setup>
import DOMPurify from 'dompurify'

const sanitizedHtml = computed(() => 
  DOMPurify.sanitize(userInput.value)
)
</script>

<template>
  <div v-html="sanitizedHtml"></div>
</template>
```

### 输入验证

```typescript
// ✅ 前端验证
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8)
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})
```

### 敏感信息保护

```typescript
// ❌ 控制台打印敏感信息
console.log('Token:', token)

// ✅ 生产环境禁用
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

### 原型污染防护 (CWE-1321)

```typescript
// ❌ 危险：直接合并用户输入
function updateSettings(userInput: object) {
  Object.assign(settings, userInput)  // 可能污染原型
}

// ❌ 危险：使用 JSON.parse 后直接使用
const config = JSON.parse(userInput)
if (config.isAdmin) { ... }  // 可能被注入

// ✅ 安全：验证并过滤属性
function updateSettings(userInput: Record<string, unknown>) {
  const allowedKeys = ['theme', 'language', 'notifications']
  const sanitized: Record<string, unknown> = {}
  
  for (const key of allowedKeys) {
    if (key in userInput && !key.startsWith('__')) {
      sanitized[key] = userInput[key]
    }
  }
  
  Object.assign(settings, sanitized)
}

// ✅ 使用 Object.create(null) 避免原型链
const safeObject = Object.create(null)
```

### 动态组件安全

```vue
<!-- ❌ 危险：用户可控的组件名 -->
<component :is="userInput" />

<!-- ✅ 安全：白名单验证 -->
<script setup lang="ts">
const allowedComponents = {
  UserProfile: () => import('./UserProfile.vue'),
  UserSettings: () => import('./UserSettings.vue')
} as const

const currentComponent = computed(() => {
  const name = props.componentName
  if (name in allowedComponents) {
    return defineAsyncComponent(allowedComponents[name as keyof typeof allowedComponents])
  }
  return null
})
</script>

<template>
  <component v-if="currentComponent" :is="currentComponent" />
</template>
```

### SSR 状态泄漏防护

```typescript
// ❌ 危险：SSR 中使用全局状态（会在请求间共享）
const globalState = reactive({ user: null })

export function useUser() {
  return globalState  // 不同用户会共享状态！
}

// ✅ 安全：每个请求创建新状态
export function useUser() {
  const state = reactive({ user: null })
  return state
}

// ✅ 使用 Pinia 的 SSR 安全模式
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  return { user }
})
```

## 可维护性审查

### TypeScript 严格模式

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 消除 any

```typescript
// ❌ 使用 any
const data: any = response.data

// ✅ 定义具体类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const data: ApiResponse<User> = response.data
```

### 测试覆盖

```typescript
// 组件测试示例
import { mount } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'

describe('UserProfile', () => {
  it('renders user name', () => {
    const wrapper = mount(UserProfile, {
      props: { user: { name: 'John' } }
    })
    expect(wrapper.text()).toContain('John')
  })
})
```

## 检查工具

### ESLint 检查

```bash
npm run lint

# Vue 3 专用规则
npx eslint --ext .vue,.ts,.tsx src/ --rule 'vue/no-v-html: warn'
```

### 组件大小检查

```bash
node tools/check-component-size.js
node tools/check-component-size.js --threshold=200
```

### 测试覆盖率

```bash
npm run test:coverage
```

### Vue 版本特性检查

```bash
# 检查是否使用了高版本特性
npx vue-tsc --noEmit

# 检查 Vue 版本
npm list vue
```

## 评分细则

### 组件设计 (20%)

| 子项 | 占比 |
|------|------|
| 职责单一 | 40% |
| 大小合理 | 30% |
| 命名规范 | 30% |

### 响应式系统 (20%)

| 子项 | 占比 |
|------|------|
| ref/reactive 正确使用 | 40% |
| 避免响应性丢失 | 30% |
| computed 合理使用 | 30% |

### 性能优化 (20%)

| 子项 | 占比 |
|------|------|
| 大列表优化 | 40% |
| 懒加载 | 30% |
| 避免重渲染 | 30% |

## 相关资源

- [检查清单](vue-checklist.md)
- [组件设计示例](examples/component-design.md)
- [响应式示例](examples/reactivity.md)
- [性能优化示例](examples/performance.md)
- [安全性示例](examples/security.md)
