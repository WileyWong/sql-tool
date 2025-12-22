# 性能优化示例

> 📚 本文档提供 Vue 3 性能优化的最佳实践示例

## 目录

- [避免不必要的渲染](#避免不必要的渲染)
- [虚拟滚动](#虚拟滚动)
- [组件懒加载](#组件懒加载)
- [防抖和节流](#防抖和节流)
- [v-memo 高级用法](#v-memo-高级用法) **[Vue 3.2+]**
- [effectScope 管理](#effectscope-管理) **[Vue 3.2+]**
- [SSR 性能优化](#ssr-性能优化)

---

## 避免不必要的渲染

### ❌ 反例：模板中创建新对象/函数

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <!-- ❌ 每次渲染都创建新对象 -->
    <div :style="{ color: 'red', fontSize: '16px' }">
      {{ count }}
    </div>
    
    <!-- ❌ 每次渲染都创建新函数 -->
    <button @click="() => count++">Increment</button>
    
    <!-- ❌ 每次渲染都创建新数组 -->
    <UserList :ids="[1, 2, 3]" />
  </div>
</template>
```

**问题**:
- 每次渲染都创建新对象/函数/数组
- 子组件接收新 Props，触发不必要的渲染
- 性能开销大

---

### ✅ 正例：在 setup 中定义

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

const count = ref(0)

// ✅ 在 setup 中定义一次
const style = reactive({
  color: 'red',
  fontSize: '16px'
})

// ✅ 在 setup 中定义函数
function increment() {
  count.value++
}

// ✅ 在 setup 中定义数组
const userIds = [1, 2, 3]
</script>

<template>
  <div>
    <!-- ✅ 复用同一个对象 -->
    <div :style="style">{{ count }}</div>
    
    <!-- ✅ 复用同一个函数 -->
    <button @click="increment">Increment</button>
    
    <!-- ✅ 复用同一个数组 -->
    <UserList :ids="userIds" />
  </div>
</template>
```

**优点**:
- 对象/函数/数组只创建一次
- 子组件 Props 不变，避免不必要的渲染
- 性能提升

---

## 虚拟滚动

### ❌ 反例：渲染大列表

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 10000 条数据
const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  description: `Description for item ${i}`
})))
</script>

<template>
  <div class="list">
    <!-- ❌ 一次性渲染 10000 个 DOM 节点 -->
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
    >
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.list {
  height: 600px;
  overflow: auto;
}

.item {
  height: 60px;
  border-bottom: 1px solid #eee;
}
</style>
```

**问题**:
- 页面渲染卡顿（10000 个 DOM 节点）
- 滚动不流畅
- 内存占用高

---

### ✅ 正例：使用虚拟滚动

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useVirtualList } from '@vueuse/core'

interface Item {
  id: number
  name: string
  description: string
}

// 10000 条数据
const allItems = ref<Item[]>(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  }))
)

// ✅ 使用虚拟滚动，只渲染可见区域的元素
const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 60,      // 每个元素高度
    overscan: 5          // 上下预渲染 5 个元素
  }
)
</script>

<template>
  <div v-bind="containerProps" style="height: 600px; overflow: auto">
    <div v-bind="wrapperProps">
      <!-- ✅ 只渲染可见区域 + overscan 的元素（约 20 个） -->
      <div
        v-for="{ data, index } in list"
        :key="index"
        class="item"
        style="height: 60px"
      >
        <h3>{{ data.name }}</h3>
        <p>{{ data.description }}</p>
      </div>
    </div>
  </div>
</template>
```

**优点**:
- 只渲染可见区域的元素（约 20 个 DOM 节点）
- 滚动流畅
- 内存占用低
- 性能提升 10-100 倍

**安装 VueUse**:
```bash
npm install @vueuse/core
```

---

### ✅ 自定义虚拟滚动（可变高度）

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVirtualList } from '@vueuse/core'

const items = ref([
  { id: 1, name: 'Short item', height: 40 },
  { id: 2, name: 'Medium item', height: 80 },
  { id: 3, name: 'Tall item', height: 120 },
  // ...
])

// ✅ 可变高度虚拟滚动
const { list, containerProps, wrapperProps } = useVirtualList(
  items,
  {
    itemHeight: (index) => items.value[index].height,
    overscan: 5
  }
)
</script>
```

---

## 组件懒加载

### ❌ 反例：全部同步加载

```typescript
<script setup lang="ts">
// ❌ 全部同步加载
import UserProfile from './UserProfile.vue'
import UserSettings from './UserSettings.vue'
import UserOrders from './UserOrders.vue'
import UserAnalytics from './UserAnalytics.vue'
import UserMessages from './UserMessages.vue'

// 打包后体积过大（500KB+）
</script>
```

**问题**:
- 首屏加载时间长
- 打包文件体积大
- 白屏时间长

---

### ✅ 正例 1：路由级别懒加载

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user',
      name: 'User',
      // ✅ 路由级别懒加载
      component: () => import('@/views/User.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      // ✅ 懒加载 + chunk 命名
      component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue')
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('@/views/Analytics.vue')
    }
  ]
})
```

**优点**:
- 按路由拆分代码（Code Splitting）
- 首屏只加载必要代码
- 其他路由按需加载

---

### ✅ 正例 2：组件级别懒加载

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// ✅ 关键组件同步加载
import UserProfile from './UserProfile.vue'

// ✅ 非关键组件异步加载
const UserSettings = defineAsyncComponent(() =>
  import('./UserSettings.vue')
)

const UserOrders = defineAsyncComponent(() =>
  import('./UserOrders.vue')
)

const UserAnalytics = defineAsyncComponent(() =>
  import('./UserAnalytics.vue')
)

// ✅ 懒加载 + 加载状态
const UserMessages = defineAsyncComponent({
  loader: () => import('./UserMessages.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,          // 200ms 后显示 loading
  timeout: 3000        // 3s 超时显示错误
})
</script>

<template>
  <div>
    <!-- 关键组件同步加载 -->
    <UserProfile />
    
    <!-- 非关键组件懒加载 -->
    <Suspense>
      <UserSettings />
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>
```

---

### ✅ 正例 3：条件懒加载

```vue
<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const showAnalytics = ref(false)

// ✅ 只在需要时加载
const UserAnalytics = showAnalytics.value 
  ? defineAsyncComponent(() => import('./UserAnalytics.vue'))
  : null
</script>

<template>
  <div>
    <button @click="showAnalytics = true">Show Analytics</button>
    
    <!-- ✅ 点击按钮后才加载组件 -->
    <component :is="UserAnalytics" v-if="showAnalytics" />
  </div>
</template>
```

---

## 防抖和节流

### ❌ 反例：频繁触发事件

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const results = ref([])

// ❌ 每次输入都触发搜索（性能问题）
async function handleSearch() {
  const response = await fetch(`/api/search?q=${searchQuery.value}`)
  results.value = await response.json()
}
</script>

<template>
  <!-- ❌ 每次输入都触发（可能每秒 10+ 次） -->
  <input v-model="searchQuery" @input="handleSearch" />
</template>
```

**问题**:
- 频繁发送 API 请求（每次输入都触发）
- 浪费服务器资源
- 影响性能

---

### ✅ 正例 1：使用防抖（Debounce）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')
const results = ref([])

// ✅ 防抖：500ms 内不再输入才触发
const handleSearch = useDebounceFn(async () => {
  const response = await fetch(`/api/search?q=${searchQuery.value}`)
  results.value = await response.json()
}, 500)
</script>

<template>
  <!-- ✅ 停止输入 500ms 后才触发搜索 -->
  <input v-model="searchQuery" @input="handleSearch" />
  
  <div v-for="item in results" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

**适用场景**:
- 搜索输入（等用户输入完成）
- 表单验证（等用户输入完成）
- 窗口 resize 事件

---

### ✅ 正例 2：使用节流（Throttle）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'

const scrollY = ref(0)

// ✅ 节流：每 100ms 最多执行一次
const handleScroll = useThrottleFn(() => {
  scrollY.value = window.scrollY
  console.log('Scroll position:', scrollY.value)
}, 100)
</script>

<template>
  <div @scroll="handleScroll">
    <!-- 滚动内容 -->
  </div>
</template>
```

**适用场景**:
- 滚动事件（每 100ms 更新一次）
- 鼠标移动事件
- 无限滚动加载

---

### 🎯 防抖 vs 节流

| 类型 | 说明 | 适用场景 | 示例 |
|------|------|----------|------|
| **防抖** | 等待一段时间后执行（期间再次触发则重新计时） | 等用户操作完成 | 搜索输入、表单验证 |
| **节流** | 固定时间间隔执行一次（期间多次触发只执行一次） | 持续触发的事件 | 滚动事件、鼠标移动 |

---

### ✅ 手动实现防抖（不使用 VueUse）

```typescript
<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

// 手动实现防抖
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const handleSearch = debounce(async () => {
  console.log('Searching:', searchQuery.value)
}, 500)
</script>
```

---

## 📚 其他性能优化技巧

### 1. 使用 v-once 优化静态内容

```vue
<template>
  <!-- ✅ 静态内容只渲染一次 -->
  <div v-once>
    <h1>{{ staticTitle }}</h1>
    <p>{{ staticDescription }}</p>
  </div>
</template>
```

### 2. 使用 v-memo 优化列表

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
    <!-- ✅ 只有 id 或 name 变化才重新渲染 -->
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
  </div>
</template>
```

### 3. Keep-alive 缓存组件

```vue
<template>
  <keep-alive>
    <!-- ✅ 缓存组件状态，避免重新渲染 -->
    <component :is="currentView" />
  </keep-alive>
</template>
```

---

## v-memo 高级用法 **[Vue 3.2+]**

### 基础用法

```vue
<template>
  <!-- ✅ 只有依赖项变化才重新渲染 -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
    <ExpensiveComponent :item="item" />
  </div>
</template>
```

### 高级用法：条件渲染优化

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Item {
  id: number
  name: string
  selected: boolean
  lastUpdated: Date
}

const items = ref<Item[]>([])
const selectedId = ref<number | null>(null)

// 选择项变化时的处理
function selectItem(id: number) {
  selectedId.value = id
}
</script>

<template>
  <div class="list">
    <!-- ✅ v-memo 优化：只在 selected 状态变化时重新渲染该项 -->
    <div
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id === selectedId]"
      :class="{ selected: item.id === selectedId }"
      @click="selectItem(item.id)"
    >
      <span>{{ item.name }}</span>
      <!-- 复杂的子组件 -->
      <ItemDetails :item="item" />
    </div>
  </div>
</template>
```

### v-memo 与 v-for 配合

```vue
<script setup lang="ts">
const items = ref([
  { id: 1, text: 'Item 1', checked: false },
  { id: 2, text: 'Item 2', checked: true },
  // ... 大量数据
])

function toggleItem(id: number) {
  const item = items.value.find(i => i.id === id)
  if (item) item.checked = !item.checked
}
</script>

<template>
  <div class="checkbox-list">
    <!-- 
      ✅ 只有 checked 状态变化的项才会重新渲染
      其他项保持缓存状态
    -->
    <label
      v-for="item in items"
      :key="item.id"
      v-memo="[item.checked]"
    >
      <input
        type="checkbox"
        :checked="item.checked"
        @change="toggleItem(item.id)"
      />
      {{ item.text }}
    </label>
  </div>
</template>
```

### ⚠️ v-memo 注意事项

```vue
<template>
  <!-- ❌ 错误：v-memo 依赖项不完整 -->
  <div v-for="item in items" :key="item.id" v-memo="[item.id]">
    {{ item.name }}  <!-- name 变化不会更新 -->
  </div>
  
  <!-- ❌ 错误：在 v-for 外使用空数组（永不更新） -->
  <div v-memo="[]">
    {{ count }}  <!-- 永远不会更新 -->
  </div>
  
  <!-- ✅ 正确：包含所有需要响应的依赖 -->
  <div v-for="item in items" :key="item.id" v-memo="[item.id, item.name, item.selected]">
    {{ item.name }}
  </div>
</template>
```

---

## effectScope 管理 **[Vue 3.2+]**

### 问题：多个 watcher 难以管理

```typescript
// ❌ 手动管理多个 watcher 容易遗漏
export function useFeature() {
  const stop1 = watch(source1, callback1)
  const stop2 = watch(source2, callback2)
  const stop3 = watchEffect(callback3)
  
  onUnmounted(() => {
    stop1()
    stop2()
    stop3()
    // 容易遗漏某个 stop
  })
}
```

### ✅ 使用 effectScope 统一管理

```typescript
import { effectScope, ref, watch, watchEffect, onScopeDispose } from 'vue'

export function useFeature() {
  const scope = effectScope()
  
  const data = ref(null)
  const loading = ref(false)
  
  scope.run(() => {
    // 所有响应式效果都在 scope 内创建
    watch(data, (newData) => {
      console.log('Data changed:', newData)
    })
    
    watchEffect(() => {
      if (loading.value) {
        console.log('Loading...')
      }
    })
    
    // 可以嵌套更多效果
    const interval = setInterval(() => {
      console.log('Tick')
    }, 1000)
    
    // scope 内的清理
    onScopeDispose(() => {
      clearInterval(interval)
    })
  })
  
  // 组件卸载时自动停止所有效果
  onScopeDispose(() => {
    scope.stop()
  })
  
  return { data, loading }
}
```

### 高级用法：可分离的 scope

```typescript
import { effectScope, ref, watch } from 'vue'

export function useDetachedScope() {
  // detached: true 表示不与父 scope 关联
  const scope = effectScope(true)
  
  const isActive = ref(true)
  
  function start() {
    if (!isActive.value) return
    
    scope.run(() => {
      watch(someSource, callback)
    })
  }
  
  function stop() {
    scope.stop()
    isActive.value = false
  }
  
  // 需要手动停止，不会随组件卸载自动停止
  return { start, stop, isActive }
}
```

### 实际应用：可暂停的数据同步

```typescript
import { effectScope, ref, watch, onScopeDispose } from 'vue'

export function useSyncData(source: Ref<any>) {
  const scope = effectScope()
  const isPaused = ref(false)
  const syncCount = ref(0)
  
  function startSync() {
    if (scope.active) return
    
    scope.run(() => {
      watch(source, async (newValue) => {
        if (isPaused.value) return
        
        await syncToServer(newValue)
        syncCount.value++
      }, { immediate: true })
    })
  }
  
  function pauseSync() {
    isPaused.value = true
  }
  
  function resumeSync() {
    isPaused.value = false
  }
  
  function stopSync() {
    scope.stop()
  }
  
  onScopeDispose(stopSync)
  
  return {
    isPaused,
    syncCount,
    startSync,
    pauseSync,
    resumeSync,
    stopSync
  }
}
```

---

## SSR 性能优化

### 避免 SSR 状态泄漏

```typescript
// ❌ 危险：模块级状态在 SSR 中会跨请求共享
const globalState = reactive({ user: null })

export function useUser() {
  return globalState  // 不同用户会看到相同状态！
}

// ✅ 安全：每次调用创建新状态
export function useUser() {
  const state = reactive({ user: null })
  return state
}
```

### SSR 专用 Composable

```typescript
import { ref, onMounted } from 'vue'

export function useClientOnly<T>(fetcher: () => T | Promise<T>) {
  const data = ref<T | null>(null)
  const isClient = ref(false)
  
  onMounted(async () => {
    isClient.value = true
    data.value = await fetcher()
  })
  
  return { data, isClient }
}

// 使用
const { data: windowWidth, isClient } = useClientOnly(() => window.innerWidth)
```

### 条件性 Hydration

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// ✅ 仅在客户端加载的组件
const ClientOnlyChart = defineAsyncComponent(() =>
  import('./Chart.vue')
)
</script>

<template>
  <div>
    <!-- SSR 时渲染占位符 -->
    <ClientOnly>
      <ClientOnlyChart :data="chartData" />
      <template #fallback>
        <div class="chart-placeholder">Loading chart...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

### SSR 数据预取优化

```typescript
// composables/useAsyncData.ts
import { ref, onServerPrefetch, onMounted } from 'vue'

export function useAsyncData<T>(
  key: string,
  fetcher: () => Promise<T>
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(true)
  
  async function refresh() {
    pending.value = true
    error.value = null
    
    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }
  
  // SSR 时预取数据
  onServerPrefetch(async () => {
    await refresh()
  })
  
  // 客户端 hydration 后检查是否需要重新获取
  onMounted(() => {
    if (data.value === null) {
      refresh()
    }
  })
  
  return { data, error, pending, refresh }
}
```

---

## 📚 相关资源

- [vue3-review.md](../vue3-review.md) - 完整审查流程
- [VueUse 文档](https://vueuse.org/)
- [Vue 3 官方文档 - 性能优化](https://vuejs.org/guide/best-practices/performance.html)
- [Vue 3 官方文档 - SSR](https://vuejs.org/guide/scaling-up/ssr.html)
