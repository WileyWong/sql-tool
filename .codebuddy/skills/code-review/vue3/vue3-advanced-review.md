# Vue 3 进阶专项审查指南

基于 Vue 3 生态的进阶代码审查，覆盖 Pinia、Vue Router 4、Teleport、Suspense 等。

> 📚 **前置**: 请先阅读 [Vue 3 基础审查指南](vue3-review.md)
> ⚠️ **版本要求**: Vue 3.2+，部分特性需要更高版本

## 进阶审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Pinia 状态管理 | 30% | Store 设计、持久化、类型安全 |
| Vue Router 4 | 30% | 路由守卫、动态路由、导航故障 |
| Teleport & Suspense | 20% | 正确使用、错误处理、性能 |
| 高级 Composition API | 20% | 依赖注入、模板引用、响应式 Props |

---

## 一、Pinia 状态管理

### 1.1 Store 设计模式

```typescript
// ✅ Setup Store（推荐）：更灵活，支持任何 Composable
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // state
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const loading = ref(false)
  
  // getters
  const isLoggedIn = computed(() => !!user.value)
  const fullName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )
  
  // actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      user.value = response.user
      token.value = response.token
    } finally {
      loading.value = false
    }
  }
  
  function logout() {
    user.value = null
    token.value = ''
  }
  
  return {
    // state
    user,
    token,
    loading,
    // getters
    isLoggedIn,
    fullName,
    // actions
    login,
    logout
  }
})

// ✅ Options Store：更接近 Vuex 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用 this 访问其他 getter
    doubleCountPlusOne(): number {
      return this.doubleCount + 1
    }
  },
  
  actions: {
    increment() {
      this.count++
    },
    async fetchCount() {
      this.count = await api.getCount()
    }
  }
})
```

### 1.2 Store 组织结构

```
stores/
├── index.ts              # 导出所有 store
├── user.ts               # 用户相关
├── cart.ts               # 购物车
├── product.ts            # 商品
└── modules/              # 复杂模块
    ├── order/
    │   ├── index.ts
    │   ├── types.ts
    │   └── api.ts
    └── payment/
        ├── index.ts
        └── types.ts
```

```typescript
// stores/index.ts
export { useUserStore } from './user'
export { useCartStore } from './cart'
export { useProductStore } from './product'

// ✅ Store 间通信
// stores/cart.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useProductStore } from './product'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const productStore = useProductStore()
  
  const items = ref<CartItem[]>([])
  
  // 使用其他 store 的数据
  const canCheckout = computed(() => 
    userStore.isLoggedIn && items.value.length > 0
  )
  
  async function addToCart(productId: string) {
    const product = await productStore.getProduct(productId)
    if (product && product.stock > 0) {
      items.value.push({
        productId,
        quantity: 1,
        price: product.price
      })
    }
  }
  
  return { items, canCheckout, addToCart }
})
```

### 1.3 持久化策略

```typescript
// ✅ 使用 pinia-plugin-persistedstate
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// store 中配置持久化
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const preferences = ref<UserPreferences>({})
  
  return { token, preferences }
}, {
  persist: {
    // 只持久化部分状态
    paths: ['token', 'preferences'],
    // 自定义存储
    storage: localStorage,
    // 自定义序列化
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})

// ✅ 敏感数据加密存储
import CryptoJS from 'crypto-js'

const encryptedStorage = {
  getItem(key: string): string | null {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  },
  setItem(key: string, value: string): void {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString()
    localStorage.setItem(key, encrypted)
  },
  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}

export const useAuthStore = defineStore('auth', () => {
  // ...
}, {
  persist: {
    storage: encryptedStorage,
    paths: ['token']
  }
})

// ❌ 不要持久化敏感信息到明文存储
export const useBadStore = defineStore('bad', () => {
  const password = ref('')  // ❌ 不应该存储密码
  const creditCard = ref('')  // ❌ 不应该存储信用卡
  return { password, creditCard }
}, {
  persist: true  // ❌ 危险！
})
```

### 1.4 类型安全

```typescript
// ✅ 完整的类型定义
// types/user.ts
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserState {
  user: User | null
  token: string
  loading: boolean
  error: string | null
}

// stores/user.ts
import type { User, LoginCredentials } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  // ✅ 类型安全的 action
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      user.value = response.user
      token.value = response.token
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // ✅ 类型安全的 getter
  const userRole = computed<User['role'] | null>(() => user.value?.role ?? null)
  
  return { user, token, loading, error, login, userRole }
})

// ✅ 组件中使用
const userStore = useUserStore()

// 类型推断正确
const userName: string = userStore.user?.firstName ?? ''
const isAdmin: boolean = userStore.userRole === 'admin'
```

### 1.5 测试 Store

```typescript
// stores/__tests__/user.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock API
vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn()
  }
}))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should login successfully', async () => {
    const store = useUserStore()
    
    // Mock 返回值
    authApi.login.mockResolvedValue({
      user: { id: 1, email: 'test@example.com' },
      token: 'mock-token'
    })
    
    const result = await store.login({
      email: 'test@example.com',
      password: 'password'
    })
    
    expect(result).toBe(true)
    expect(store.user).toEqual({ id: 1, email: 'test@example.com' })
    expect(store.token).toBe('mock-token')
    expect(store.isLoggedIn).toBe(true)
  })
  
  it('should handle login error', async () => {
    const store = useUserStore()
    
    authApi.login.mockRejectedValue(new Error('Invalid credentials'))
    
    const result = await store.login({
      email: 'test@example.com',
      password: 'wrong'
    })
    
    expect(result).toBe(false)
    expect(store.error).toBe('Invalid credentials')
    expect(store.user).toBeNull()
  })
})
```

---

## 二、Vue Router 4

### 2.1 路由守卫

```typescript
// router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

// ✅ 全局前置守卫
export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    // 需要认证的路由
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }
    
    // 需要特定角色
    if (to.meta.roles && !to.meta.roles.includes(userStore.userRole)) {
      return next({ name: 'Forbidden' })
    }
    
    next()
  })
  
  // ✅ 全局后置钩子（用于分析、页面标题等）
  router.afterEach((to, from) => {
    // 更新页面标题
    document.title = to.meta.title as string || 'App'
    
    // 发送页面访问分析
    analytics.trackPageView(to.fullPath)
  })
}

// ✅ 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (userStore.userRole !== 'admin') {
        return next({ name: 'Forbidden' })
      }
      next()
    },
    children: [
      // ...
    ]
  }
]

// ✅ 组件内守卫
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

const hasUnsavedChanges = ref(false)

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('有未保存的更改，确定离开吗？')
    if (!answer) return false
  }
})

onBeforeRouteUpdate(async (to, from) => {
  // 路由参数变化时重新加载数据
  if (to.params.id !== from.params.id) {
    await loadData(to.params.id as string)
  }
})
```

### 2.2 动态路由

```typescript
// ✅ 基于权限的动态路由
// router/dynamic.ts
import type { RouteRecordRaw } from 'vue-router'

// 静态路由（所有用户可访问）
export const staticRoutes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/404', name: 'NotFound', component: () => import('@/views/404.vue') }
]

// 动态路由（根据权限加载）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { roles: ['admin', 'user'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { roles: ['admin'] }
  }
]

// 根据用户角色过滤路由
export function filterRoutesByRole(routes: RouteRecordRaw[], role: string): RouteRecordRaw[] {
  return routes.filter(route => {
    if (route.meta?.roles) {
      return route.meta.roles.includes(role)
    }
    return true
  }).map(route => {
    if (route.children) {
      return {
        ...route,
        children: filterRoutesByRole(route.children, role)
      }
    }
    return route
  })
}

// 添加动态路由
export function addDynamicRoutes(router: Router, role: string) {
  const accessibleRoutes = filterRoutesByRole(asyncRoutes, role)
  
  accessibleRoutes.forEach(route => {
    router.addRoute(route)
  })
  
  // 添加 404 通配路由（必须最后添加）
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  })
}

// ✅ 在登录后添加路由
async function handleLogin() {
  const success = await userStore.login(credentials)
  if (success) {
    addDynamicRoutes(router, userStore.userRole!)
    
    // 跳转到原目标或首页
    const redirect = route.query.redirect as string
    router.push(redirect || '/dashboard')
  }
}

// ✅ 登出时移除动态路由
function handleLogout() {
  userStore.logout()
  
  // 重置路由
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
  })
  
  // 替换 matcher
  router.matcher = newRouter.matcher
  
  router.push('/login')
}
```

### 2.3 导航故障处理

```typescript
import { 
  NavigationFailureType, 
  isNavigationFailure,
  useRouter 
} from 'vue-router'

const router = useRouter()

// ✅ 处理导航故障
async function navigateTo(path: string) {
  try {
    await router.push(path)
  } catch (failure) {
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      // 导航被守卫中断
      console.log('Navigation aborted:', failure.to.fullPath)
    } else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
      // 导航被新导航取消
      console.log('Navigation cancelled:', failure.to.fullPath)
    } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      // 已经在目标路由
      console.log('Already at:', failure.to.fullPath)
    } else {
      // 未知错误
      console.error('Navigation error:', failure)
    }
  }
}

// ✅ 使用 router.push 的返回值
const result = await router.push('/dashboard')

if (result) {
  // 导航失败
  console.log('Navigation failed:', result)
} else {
  // 导航成功
  console.log('Navigation succeeded')
}

// ✅ 全局错误处理
router.onError((error, to, from) => {
  // 处理路由加载错误（如懒加载失败）
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // 可能是部署更新，刷新页面
    window.location.href = to.fullPath
  }
})
```

### 2.4 路由元信息与类型

```typescript
// router/types.ts
import 'vue-router'

// ✅ 扩展路由元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: Array<'admin' | 'user' | 'guest'>
    keepAlive?: boolean
    transition?: string
  }
}

// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: true,
      roles: ['admin', 'user'],
      keepAlive: true,
      transition: 'fade'
    }
  }
]

// ✅ 在组件中使用类型安全的 meta
const route = useRoute()
const title = route.meta.title  // 类型：string | undefined
const roles = route.meta.roles  // 类型：Array<'admin' | 'user' | 'guest'> | undefined
```

### 2.5 滚动行为

```typescript
// ✅ 自定义滚动行为
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器后退/前进）
    if (savedPosition) {
      return savedPosition
    }
    
    // 如果有锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    // 同一页面不滚动
    if (to.path === from.path) {
      return false
    }
    
    // 默认滚动到顶部
    return { top: 0, behavior: 'smooth' }
  }
})

// ✅ 异步滚动（等待内容加载）
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ top: 0 })
    }, 300)  // 等待过渡动画
  })
}
```

---

## 三、Teleport & Suspense

### 3.1 Teleport 使用

```vue
<!-- ✅ 基本用法：Modal -->
<template>
  <button @click="showModal = true">打开弹窗</button>
  
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h2>弹窗标题</h2>
        <p>弹窗内容</p>
        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const showModal = ref(false)
</script>

<!-- ✅ 条件禁用 Teleport -->
<template>
  <Teleport to="body" :disabled="inline">
    <div class="tooltip">{{ content }}</div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
  inline?: boolean  // 内联模式时不传送
}>()
</script>

<!-- ✅ 多个 Teleport 到同一目标 -->
<template>
  <!-- 通知容器 -->
  <Teleport to="#notification-container">
    <Notification 
      v-for="notification in notifications" 
      :key="notification.id"
      :data="notification"
    />
  </Teleport>
</template>

<!-- index.html -->
<body>
  <div id="app"></div>
  <div id="notification-container"></div>
</body>
```

### 3.2 Teleport 最佳实践

```vue
<!-- ✅ 封装可复用的 Modal 组件 -->
<!-- components/BaseModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div 
          class="modal-content"
          :style="{ width: width }"
          @click.stop
        >
          <header v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h3>{{ title }}</h3>
            </slot>
            <button 
              v-if="closable" 
              class="modal-close" 
              @click="close"
            >
              ×
            </button>
          </header>
          
          <main class="modal-body">
            <slot />
          </main>
          
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  width?: string
  closable?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '500px',
  closable: true,
  closeOnOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

// ✅ ESC 键关闭
onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}
</script>

<!-- 使用 -->
<BaseModal v-model="showModal" title="用户信息">
  <UserForm />
  <template #footer>
    <button @click="showModal = false">取消</button>
    <button @click="submit">确认</button>
  </template>
</BaseModal>
```

### 3.3 Suspense 使用

```vue
<!-- ✅ 基本用法 -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<!-- ✅ 异步 setup 组件 -->
<!-- AsyncComponent.vue -->
<script setup lang="ts">
// 顶层 await 会使组件变成异步组件
const data = await fetchData()
const user = await fetchUser()
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <p>{{ user.name }}</p>
  </div>
</template>

<!-- ✅ 错误处理 -->
<template>
  <ErrorBoundary>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </ErrorBoundary>
</template>

<!-- ErrorBoundary.vue -->
<script setup lang="ts">
const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  return false  // 阻止错误继续传播
})
</script>

<template>
  <div v-if="error" class="error">
    <p>加载失败：{{ error.message }}</p>
    <button @click="error = null">重试</button>
  </div>
  <slot v-else />
</template>
```

### 3.4 Suspense 高级用法

```vue
<!-- ✅ 嵌套 Suspense -->
<template>
  <Suspense>
    <template #default>
      <div>
        <UserHeader />  <!-- 快速加载 -->
        
        <Suspense>
          <template #default>
            <UserPosts />  <!-- 慢速加载 -->
          </template>
          <template #fallback>
            <PostsSkeleton />
          </template>
        </Suspense>
      </div>
    </template>
    <template #fallback>
      <PageSkeleton />
    </template>
  </Suspense>
</template>

<!-- ✅ Suspense 事件 -->
<template>
  <Suspense
    @pending="onPending"
    @resolve="onResolve"
    @fallback="onFallback"
  >
    <AsyncComponent />
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
function onPending() {
  console.log('开始加载')
}

function onResolve() {
  console.log('加载完成')
}

function onFallback() {
  console.log('显示 fallback')
}
</script>

<!-- ✅ 配合 Transition -->
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Suspense>
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          <Loading />
        </template>
      </Suspense>
    </Transition>
  </RouterView>
</template>
```

---

## 四、高级 Composition API

### 4.1 依赖注入 (Provide/Inject)

```typescript
// ✅ 类型安全的依赖注入
// types/injection.ts
import type { InjectionKey, Ref } from 'vue'

export interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')

// App.vue（提供者）
<script setup lang="ts">
import { provide, ref } from 'vue'
import { ThemeKey, type ThemeContext } from '@/types/injection'

const theme = ref<'light' | 'dark'>('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide(ThemeKey, {
  theme,
  toggleTheme
})
</script>

// 子组件（消费者）
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey } from '@/types/injection'

const themeContext = inject(ThemeKey)

if (!themeContext) {
  throw new Error('ThemeContext not provided')
}

const { theme, toggleTheme } = themeContext
</script>

// ✅ 带默认值的 inject
const theme = inject(ThemeKey, {
  theme: ref('light'),
  toggleTheme: () => {}
})

// ✅ 封装为 Composable
// composables/useTheme.ts
export function useTheme() {
  const context = inject(ThemeKey)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
```

### 4.2 模板引用 [Vue 3.5+]

```vue
<!-- ✅ useTemplateRef（Vue 3.5+） -->
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" type="text" />
</template>

<!-- ✅ 传统方式（Vue 3.0+） -->
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" type="text" />
</template>

<!-- ✅ 组件引用 -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'

const childRef = useTemplateRef<InstanceType<typeof ChildComponent>>('child')

function callChildMethod() {
  childRef.value?.someMethod()
}
</script>

<template>
  <ChildComponent ref="child" />
</template>

<!-- ChildComponent.vue -->
<script setup lang="ts">
function someMethod() {
  console.log('Called from parent')
}

// 暴露给父组件
defineExpose({
  someMethod
})
</script>

<!-- ✅ v-for 中的引用 -->
<script setup lang="ts">
const itemRefs = ref<HTMLDivElement[]>([])

function setItemRef(el: HTMLDivElement | null, index: number) {
  if (el) {
    itemRefs.value[index] = el
  }
}
</script>

<template>
  <div 
    v-for="(item, index) in items" 
    :key="item.id"
    :ref="(el) => setItemRef(el as HTMLDivElement, index)"
  >
    {{ item.name }}
  </div>
</template>
```

### 4.3 响应式 Props 解构 [Vue 3.5+]

```vue
<!-- ✅ Vue 3.5+ 响应式 Props 解构 -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  disabled?: boolean
}

// 直接解构，保持响应性
const { title, count = 0, disabled = false } = defineProps<Props>()

// 可以直接在模板和 watch 中使用
watch(() => count, (newCount) => {
  console.log('Count changed:', newCount)
})
</script>

<template>
  <div :class="{ disabled }">
    <h1>{{ title }}</h1>
    <span>{{ count }}</span>
  </div>
</template>

<!-- ❌ Vue 3.4 及之前：解构会丢失响应性 -->
<script setup lang="ts">
const props = defineProps<Props>()

// ❌ 解构后不再响应
const { title, count } = props

// ✅ 使用 toRefs
const { title, count } = toRefs(props)

// ✅ 或直接使用 props
watch(() => props.count, (newCount) => {
  console.log('Count changed:', newCount)
})
</script>
```

### 4.4 defineModel [Vue 3.4+]

```vue
<!-- ✅ 简化 v-model -->
<!-- CustomInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>

<!-- 使用 -->
<CustomInput v-model="text" />

<!-- ✅ 带修饰符 -->
<script setup lang="ts">
const [model, modifiers] = defineModel<string>()

// 访问修饰符
if (modifiers.trim) {
  // v-model.trim 被使用
}
</script>

<!-- ✅ 多个 v-model -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>

<template>
  <input v-model="firstName" placeholder="First Name" />
  <input v-model="lastName" placeholder="Last Name" />
</template>

<!-- 使用 -->
<UserForm v-model:firstName="first" v-model:lastName="last" />

<!-- ✅ 带验证的 defineModel -->
<script setup lang="ts">
const count = defineModel<number>({
  default: 0,
  validator: (value) => value >= 0
})
</script>
```

### 4.5 高级 Composables 模式

```typescript
// ✅ 可取消的异步操作
export function useCancellableRequest<T>(
  fetcher: (signal: AbortSignal) => Promise<T>
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  let abortController: AbortController | null = null
  
  async function execute() {
    // 取消之前的请求
    abortController?.abort()
    abortController = new AbortController()
    
    loading.value = true
    error.value = null
    
    try {
      data.value = await fetcher(abortController.signal)
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        error.value = e
      }
    } finally {
      loading.value = false
    }
  }
  
  function cancel() {
    abortController?.abort()
  }
  
  // 组件卸载时自动取消
  onUnmounted(cancel)
  
  return { data, error, loading, execute, cancel }
}

// ✅ 防抖/节流 Composable
export function useDebouncedRef<T>(value: T, delay = 300) {
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

// ✅ 响应式 LocalStorage
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )
  
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return data
}
```

---

## 审查检查清单

### Pinia 检查

- [ ] Store 职责单一，不过于庞大
- [ ] Setup Store 用于复杂逻辑，Options Store 用于简单场景
- [ ] 敏感数据不持久化或加密存储
- [ ] Store 间通信通过 action 而非直接修改
- [ ] 完整的 TypeScript 类型定义

### Vue Router 检查

- [ ] 路由守卫正确处理认证和授权
- [ ] 动态路由在登出时正确清理
- [ ] 导航故障有适当处理
- [ ] 路由元信息类型扩展完整
- [ ] 滚动行为符合用户预期

### Teleport & Suspense 检查

- [ ] Modal/Tooltip 等使用 Teleport 避免 z-index 问题
- [ ] Suspense 有 fallback 和错误处理
- [ ] 异步组件有合理的加载状态
- [ ] 嵌套 Suspense 用于分层加载

### Composition API 检查

- [ ] 依赖注入使用 InjectionKey 保证类型安全
- [ ] 模板引用正确处理 null
- [ ] Props 解构考虑 Vue 版本兼容性
- [ ] Composables 正确清理副作用

---

## 相关资源

- [Vue 3 基础审查指南](vue3-review.md)
- [Vue 3 检查清单](vue3-checklist.md)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue Router 4 官方文档](https://router.vuejs.org/)
- [Vue 3.5 发布说明](https://blog.vuejs.org/posts/vue-3-5)
