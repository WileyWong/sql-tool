# 响应式系统示例

> 📚 本文档提供 Vue 3 响应式系统的最佳实践示例

## 目录

- [ref vs reactive](#ref-vs-reactive)
- [computed 使用](#computed-使用)
- [响应性丢失问题](#响应性丢失问题)
- [shallowRef 和 shallowReactive](#shallowref-和-shallowreactive)
- [triggerRef 手动触发](#triggerref-手动触发)
- [customRef 自定义响应式](#customref-自定义响应式)
- [effectScope 管理](#effectscope-管理) **[Vue 3.2+]**

---

## ref vs reactive

### ❌ 反例：混合使用

```typescript
<script setup lang="ts">
import { ref, reactive } from 'vue'

const count = ref(0)              // ref
const user = reactive({ name: 'John' })  // reactive
const list = ref([])              // ref
const form = reactive({ email: '' })     // reactive

// ❌ 访问方式不一致
console.log(count.value)          // .value
console.log(user.name)            // 直接访问
console.log(list.value)           // .value
console.log(form.email)           // 直接访问
</script>
```

**问题**:
- 访问方式不一致（有的 `.value`，有的直接访问）
- 容易出错（忘记 `.value`）
- 代码可读性差

---

### ✅ 正例 1：全部使用 ref（推荐）

```typescript
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  name: string
  email: string
}

const count = ref(0)
const user = ref<User>({ name: 'John', email: 'john@example.com' })
const list = ref<User[]>([])
const form = ref({ email: '' })

// ✅ 统一的访问方式：xxx.value
console.log(count.value)
console.log(user.value.name)
console.log(list.value)
console.log(form.value.email)

// ✅ 修改也统一
count.value++
user.value.name = 'Jane'
list.value.push({ name: 'Bob', email: 'bob@example.com' })
form.value.email = 'new@example.com'
</script>
```

**优点**:
- 访问方式统一（全部 `.value`）
- 避免响应性丢失问题
- 类型推断更准确

---

### ✅ 正例 2：合理使用 reactive + toRefs

```typescript
<script setup lang="ts">
import { reactive, toRefs } from 'vue'

interface State {
  count: number
  user: { name: string; email: string }
  list: User[]
}

// reactive 定义状态
const state = reactive<State>({
  count: 0,
  user: { name: 'John', email: 'john@example.com' },
  list: []
})

// ✅ 使用 toRefs 导出，保持响应性
const { count, user, list } = toRefs(state)

// 访问时需要 .value
console.log(count.value)
console.log(user.value.name)

// 修改时需要 .value
count.value++
user.value.name = 'Jane'
</script>
```

**使用场景**:
- 需要将多个状态组合在一起
- 从 Composable 返回多个响应式变量

---

### 🎯 选择建议

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 单个值 | `ref` | 简单直接 |
| 对象 | `ref` | 避免解构问题 |
| 数组 | `ref` | 避免解构问题 |
| 多个相关状态 | `reactive` + `toRefs` | 状态组合 |
| Composable 返回 | `ref` 或 `reactive` + `toRefs` | 保持一致性 |

---

## computed 使用

### ❌ 反例：computed 中有副作用

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

const users = ref<User[]>([])

// ❌ computed 中有副作用（console.log）
const sortedUsers = computed(() => {
  console.log('Sorting users')  // ❌ 副作用
  return users.value.sort((a, b) => a.name.localeCompare(b.name))
})

// ❌ computed 中修改状态
const filteredUsers = computed(() => {
  if (users.value.length > 100) {
    loading.value = true  // ❌ 修改其他状态
  }
  return users.value.filter(u => u.active)
})

// ❌ computed 返回函数（应该用 method）
const getUserById = computed(() => {
  return (id: number) => users.value.find(u => u.id === id)
})
</script>
```

**问题**:
- `computed` 应该是纯函数（无副作用）
- `computed` 中不应该修改其他状态
- 带参数的查询应该用 method

---

### ✅ 正例：computed 用于派生状态

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  active: boolean
  role: 'admin' | 'user'
}

const users = ref<User[]>([])

// ✅ computed 用于派生状态（无副作用）
const userCount = computed(() => users.value.length)

const activeUsers = computed(() => 
  users.value.filter(u => u.active)
)

const adminUsers = computed(() =>
  users.value.filter(u => u.role === 'admin')
)

const sortedUsers = computed(() =>
  [...users.value].sort((a, b) => a.name.localeCompare(b.name))
)

// ✅ 复杂计算
const userStats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.active).length,
  inactive: users.value.filter(u => !u.active).length,
  admins: users.value.filter(u => u.role === 'admin').length
}))

// ✅ method 用于带参数的查询
function getUserById(id: number): User | undefined {
  return users.value.find(u => u.id === id)
}

function getUsersByRole(role: 'admin' | 'user'): User[] {
  return users.value.filter(u => u.role === role)
}
</script>
```

**computed 原则**:
- 纯函数（无副作用）
- 不修改其他状态
- 用于派生状态（过滤、映射、计算）
- 带参数的查询用 method

---

### ✅ 副作用处理：使用 watchEffect

```typescript
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const users = ref<User[]>([])

// ✅ 使用 watchEffect 处理副作用
watchEffect(() => {
  console.log('Users changed:', users.value.length)
  
  // 发送分析数据
  if (users.value.length > 0) {
    analytics.track('users_loaded', { count: users.value.length })
  }
})
</script>
```

---

## 响应性丢失问题

### ❌ 反例：解构 reactive 丢失响应性

```typescript
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'John'
})

// ❌ 解构后失去响应性
const { count, name } = state

function increment() {
  count++  // ❌ 不会触发更新
}

function updateName() {
  name = 'Jane'  // ❌ 不会触发更新
}
</script>

<template>
  <!-- ❌ UI 不会更新 -->
  <div>{{ count }}</div>
  <div>{{ name }}</div>
</template>
```

**问题**:
- 解构 `reactive` 对象会丢失响应性
- UI 不会更新

---

### ✅ 正例 1：使用 toRefs 保持响应性

```typescript
<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  name: 'John'
})

// ✅ 使用 toRefs 保持响应性
const { count, name } = toRefs(state)

function increment() {
  count.value++  // ✅ 正确更新
}

function updateName() {
  name.value = 'Jane'  // ✅ 正确更新
}
</script>

<template>
  <!-- ✅ UI 会更新 -->
  <div>{{ count }}</div>
  <div>{{ name }}</div>
</template>
```

---

### ✅ 正例 2：直接使用 state

```typescript
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'John'
})

function increment() {
  state.count++  // ✅ 正确更新
}

function updateName() {
  state.name = 'Jane'  // ✅ 正确更新
}
</script>

<template>
  <!-- ✅ UI 会更新 -->
  <div>{{ state.count }}</div>
  <div>{{ state.name }}</div>
</template>
```

---

### ✅ 正例 3：使用 ref（推荐）

```typescript
<script setup lang="ts">
import { ref } from 'vue'

// ✅ 使用 ref，避免解构问题
const count = ref(0)
const name = ref('John')

function increment() {
  count.value++  // ✅ 正确更新
}

function updateName() {
  name.value = 'Jane'  // ✅ 正确更新
}
</script>

<template>
  <!-- ✅ UI 会更新 -->
  <div>{{ count }}</div>
  <div>{{ name }}</div>
</template>
```

---

## shallowRef 和 shallowReactive

### 使用场景：优化大对象性能

```typescript
<script setup lang="ts">
import { ref, shallowRef } from 'vue'

// ❌ 深层响应式（性能开销大）
const deepData = ref({
  level1: {
    level2: {
      level3: {
        level4: {
          value: 0
        }
      }
    }
  }
})

// ✅ 浅层响应式（性能优化）
const shallowData = shallowRef({
  level1: {
    level2: {
      level3: {
        level4: {
          value: 0
        }
      }
    }
  }
})

// 修改深层属性不会触发更新
shallowData.value.level1.level2.level3.level4.value = 1  // ❌ 不会更新

// 替换整个对象会触发更新
shallowData.value = {
  level1: {
    level2: {
      level3: {
        level4: {
          value: 1
        }
      }
    }
  }
}  // ✅ 会更新
</script>
```

**使用场景**:
- 大型对象或数组（深层响应式性能开销大）
- 只需要跟踪顶层属性变化
- 与不可变数据结构（Immutable.js）配合使用

---

### ✅ 实际用例：大数据列表

```typescript
<script setup lang="ts">
import { shallowRef } from 'vue'

// 10000 条数据
const largeList = shallowRef<Item[]>([])

async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  
  // ✅ 替换整个数组（触发更新）
  largeList.value = data
}

function addItem(item: Item) {
  // ✅ 使用不可变方式更新
  largeList.value = [...largeList.value, item]
}

function removeItem(id: number) {
  // ✅ 使用不可变方式更新
  largeList.value = largeList.value.filter(item => item.id !== id)
}
</script>
```

**原则**:
- 使用 `shallowRef` 存储大数据
- 更新时替换整个对象/数组（不可变方式）
- 避免直接修改深层属性

---

## triggerRef 手动触发

### 使用场景：shallowRef 深层修改后触发更新

```typescript
<script setup lang="ts">
import { shallowRef, triggerRef } from 'vue'

interface User {
  id: number
  profile: {
    name: string
    avatar: string
  }
}

// 使用 shallowRef 优化性能
const user = shallowRef<User>({
  id: 1,
  profile: {
    name: 'John',
    avatar: '/avatar.png'
  }
})

// ❌ 直接修改深层属性不会触发更新
function updateNameWrong() {
  user.value.profile.name = 'Jane'
  // UI 不会更新
}

// ✅ 方法1：替换整个对象
function updateNameReplace() {
  user.value = {
    ...user.value,
    profile: {
      ...user.value.profile,
      name: 'Jane'
    }
  }
}

// ✅ 方法2：修改后手动触发
function updateNameTrigger() {
  user.value.profile.name = 'Jane'
  triggerRef(user)  // 手动触发更新
}
</script>

<template>
  <div>{{ user.profile.name }}</div>
</template>
```

### 批量更新优化

```typescript
import { shallowRef, triggerRef } from 'vue'

const items = shallowRef<Item[]>([])

// ✅ 批量修改后只触发一次更新
function batchUpdate(updates: Map<number, Partial<Item>>) {
  updates.forEach((update, id) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      Object.assign(item, update)
    }
  })
  
  // 所有修改完成后，只触发一次更新
  triggerRef(items)
}
```

---

## customRef 自定义响应式

### 使用场景：防抖 ref

```typescript
import { customRef } from 'vue'

// ✅ 创建防抖 ref
function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>
  
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()  // 追踪依赖
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()  // 触发更新
        }, delay)
      }
    }
  })
}

// 使用
const searchQuery = useDebouncedRef('', 500)
// 输入时会延迟 500ms 才触发更新
```

### 使用场景：验证 ref

```typescript
import { customRef, ref } from 'vue'

interface ValidatedRefOptions<T> {
  validator: (value: T) => boolean
  errorMessage?: string
}

function useValidatedRef<T>(
  initialValue: T,
  options: ValidatedRefOptions<T>
) {
  const error = ref<string | null>(null)
  
  const value = customRef<T>((track, trigger) => {
    let internalValue = initialValue
    
    return {
      get() {
        track()
        return internalValue
      },
      set(newValue) {
        if (options.validator(newValue)) {
          internalValue = newValue
          error.value = null
          trigger()
        } else {
          error.value = options.errorMessage || 'Validation failed'
        }
      }
    }
  })
  
  return { value, error }
}

// 使用
const { value: email, error: emailError } = useValidatedRef('', {
  validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  errorMessage: 'Invalid email format'
})
```

### 使用场景：localStorage 同步 ref

```typescript
import { customRef } from 'vue'

function useLocalStorageRef<T>(key: string, defaultValue: T) {
  return customRef<T>((track, trigger) => {
    // 初始化时从 localStorage 读取
    const stored = localStorage.getItem(key)
    let value: T = stored ? JSON.parse(stored) : defaultValue
    
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        // 同步到 localStorage
        localStorage.setItem(key, JSON.stringify(newValue))
        trigger()
      }
    }
  })
}

// 使用
const theme = useLocalStorageRef('theme', 'light')
theme.value = 'dark'  // 自动同步到 localStorage
```

---

## effectScope 管理 **[Vue 3.2+]**

### 基础用法

```typescript
import { effectScope, ref, watch, watchEffect, computed, onScopeDispose } from 'vue'

// ✅ 创建独立的响应式作用域
const scope = effectScope()

scope.run(() => {
  const counter = ref(0)
  const doubled = computed(() => counter.value * 2)
  
  watch(counter, (val) => {
    console.log('Counter changed:', val)
  })
  
  watchEffect(() => {
    console.log('Doubled:', doubled.value)
  })
})

// 停止作用域内的所有响应式效果
scope.stop()
```

### 在 Composable 中使用

```typescript
import { effectScope, ref, watch, onScopeDispose } from 'vue'

export function useFeatureWithScope() {
  const scope = effectScope()
  
  const state = ref({
    count: 0,
    name: ''
  })
  
  scope.run(() => {
    // 所有 watcher 都在 scope 内
    watch(() => state.value.count, (count) => {
      console.log('Count:', count)
    })
    
    watch(() => state.value.name, (name) => {
      console.log('Name:', name)
    })
    
    // 定时器也可以在 scope 内管理
    const timer = setInterval(() => {
      state.value.count++
    }, 1000)
    
    onScopeDispose(() => {
      clearInterval(timer)
    })
  })
  
  // 组件卸载时自动清理
  onScopeDispose(() => {
    scope.stop()
  })
  
  return {
    state,
    // 手动停止
    stop: () => scope.stop()
  }
}
```

### 嵌套 scope

```typescript
import { effectScope, ref, watch, getCurrentScope } from 'vue'

const parentScope = effectScope()

parentScope.run(() => {
  const parentRef = ref(0)
  
  // 子 scope
  const childScope = effectScope()
  
  childScope.run(() => {
    const childRef = ref(0)
    
    watch(childRef, () => {
      console.log('Child ref changed')
    })
  })
  
  // 停止子 scope 不影响父 scope
  childScope.stop()
  
  // 父 scope 的 watcher 仍然有效
  watch(parentRef, () => {
    console.log('Parent ref changed')
  })
})

// 停止父 scope 会停止所有嵌套的 scope
parentScope.stop()
```

### 获取当前 scope

```typescript
import { effectScope, getCurrentScope, onScopeDispose } from 'vue'

function useCleanup(cleanup: () => void) {
  const scope = getCurrentScope()
  
  if (scope) {
    onScopeDispose(cleanup)
  } else {
    console.warn('useCleanup called outside of scope')
  }
}

// 使用
const scope = effectScope()
scope.run(() => {
  useCleanup(() => {
    console.log('Cleanup called')
  })
})
```

---

## 📚 相关资源

- [vue3-review.md](../vue3-review.md) - 完整审查流程
- [Vue 3 官方文档 - 响应式基础](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 官方文档 - 响应式进阶](https://vuejs.org/api/reactivity-advanced.html)
