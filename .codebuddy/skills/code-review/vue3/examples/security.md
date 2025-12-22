# 安全性示例

> 📚 本文档提供 Vue 3 前端安全的最佳实践示例

## 目录

- [XSS 防护](#xss-防护)
- [敏感信息处理](#敏感信息处理)
- [输入验证](#输入验证)
- [CSRF 防护](#csrf-防护)
- [原型污染防护](#原型污染防护) (CWE-1321)
- [动态组件安全](#动态组件安全)
- [SSR 状态泄漏防护](#ssr-状态泄漏防护)

---

## XSS 防护

### ❌ 反例：直接渲染用户输入

```vue
<script setup lang="ts">
import { ref } from 'vue'

const userBio = ref('<script>alert("XSS")</script>')
const userComment = ref('<img src=x onerror="alert(\'XSS\')">')
</script>

<template>
  <div>
    <!-- ❌ XSS 漏洞 - 直接渲染 HTML -->
    <div v-html="userBio"></div>
    
    <!-- ❌ XSS 漏洞 - URL 未验证 -->
    <a :href="userInput">Click me</a>
  </div>
</template>
```

**问题**:
- 用户输入可能包含恶意脚本
- 直接渲染会执行恶意代码
- 可能导致 Cookie 窃取、钓鱼攻击等

---

### ✅ 正例 1：默认使用文本插值（自动转义）

```vue
<script setup lang="ts">
import { ref } from 'vue'

const userInput = ref('<script>alert("XSS")</script>')
</script>

<template>
  <!-- ✅ 文本插值自动转义 HTML -->
  <div>{{ userInput }}</div>
  
  <!-- 渲染结果：&lt;script&gt;alert("XSS")&lt;/script&gt; -->
</template>
```

**原理**:
- Vue 文本插值会自动转义 HTML 特殊字符
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

---

### ✅ 正例 2：使用 DOMPurify 清理 HTML

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'

const userBio = ref(`
  <h3>User Bio</h3>
  <p>Hello <strong>World</strong></p>
  <script>alert('XSS')</script>
  <img src=x onerror="alert('XSS')">
`)

// ✅ 使用 DOMPurify 清理 HTML
const sanitizedBio = computed(() => 
  DOMPurify.sanitize(userBio.value, {
    ALLOWED_TAGS: ['h3', 'p', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href', 'title']
  })
)
</script>

<template>
  <!-- ✅ 渲染清理后的 HTML -->
  <div v-html="sanitizedBio"></div>
  
  <!-- 输出：
    <h3>User Bio</h3>
    <p>Hello <strong>World</strong></p>
  -->
</template>
```

**安装 DOMPurify**:
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

---

### ✅ 正例 3：URL 安全检查

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const userUrl = ref('javascript:alert("XSS")')

// ✅ 检查 URL 是否安全
const isSafeUrl = (url: string): boolean => {
  const safeProtocols = ['http:', 'https:', 'mailto:']
  
  try {
    const parsedUrl = new URL(url)
    return safeProtocols.includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

const sanitizedUrl = computed(() => 
  isSafeUrl(userUrl.value) ? userUrl.value : '#'
)
</script>

<template>
  <!-- ✅ 只渲染安全的 URL -->
  <a :href="sanitizedUrl">{{ userUrl }}</a>
  
  <!-- ❌ 不安全 URL 会被替换为 # -->
</template>
```

**危险协议**:
- `javascript:` - 执行 JavaScript 代码
- `data:` - 可能包含恶意代码
- `vbscript:` - 执行 VBScript 代码

---

## 敏感信息处理

### ❌ 反例：暴露敏感信息

```typescript
<script setup lang="ts">
// ❌ 硬编码 API Key
const API_KEY = 'sk-1234567890abcdef'
const SECRET_TOKEN = 'secret-token-12345'

// ❌ 直接在客户端存储敏感信息
localStorage.setItem('userPassword', 'password123')
localStorage.setItem('apiKey', API_KEY)

// ❌ 在请求头暴露敏感信息
async function fetchData() {
  const response = await fetch('/api/data', {
    headers: {
      'X-API-Key': API_KEY  // ❌ 暴露在客户端
    }
  })
}
</script>
```

**问题**:
- API Key 暴露在客户端代码
- 敏感信息明文存储在 localStorage
- 可通过浏览器开发工具查看

---

### ✅ 正例 1：使用环境变量

```typescript
<script setup lang="ts">
// ✅ 使用环境变量（构建时替换）
const apiUrl = import.meta.env.VITE_API_URL
const appVersion = import.meta.env.VITE_APP_VERSION

// ⚠️ 注意：环境变量仍会打包到客户端代码
// 不要在环境变量中存储真正的 Secret（如 API Key）
</script>
```

**.env 文件**:
```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0

# ❌ 不要这样做
# VITE_API_KEY=sk-1234567890abcdef
```

---

### ✅ 正例 2：通过后端代理

```typescript
<script setup lang="ts">
// ✅ 通过后端代理，不暴露 API Key
async function fetchData() {
  // 后端会自动添加 API Key
  const response = await fetch('/api/data', {
    credentials: 'include'  // ✅ 发送 Cookie（后端验证）
  })
  
  const data = await response.json()
  return data
}
</script>
```

**后端代理示例（Express）**:
```javascript
// server.js
app.get('/api/data', async (req, res) => {
  // ✅ API Key 存储在后端环境变量
  const response = await fetch('https://external-api.com/data', {
    headers: {
      'X-API-Key': process.env.API_KEY
    }
  })
  
  const data = await response.json()
  res.json(data)
})
```

---

### ✅ 正例 3：安全存储敏感数据

```typescript
<script setup lang="ts">
// ✅ 使用 sessionStorage（关闭浏览器后清除）
sessionStorage.setItem('userSession', 'session-token')

// ✅ 使用 HttpOnly Cookie（JavaScript 无法访问）
// 由后端设置：
// Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

// ❌ 永远不要在客户端存储密码
// localStorage.setItem('password', 'xxx')  // 绝对禁止！

// ✅ 只存储非敏感的用户偏好
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'zh-CN')
</script>
```

---

## 输入验证

### ❌ 反例：无输入验证

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

// ❌ 直接提交，无验证
async function submitForm() {
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <input v-model="email" type="text" />
    <input v-model="password" type="text" />
    <button type="submit">Submit</button>
  </form>
</template>
```

**问题**:
- 无邮箱格式验证
- 无密码强度验证
- 可能提交空值
- 后端可能收到非法数据

---

### ✅ 正例 1：使用 vee-validate

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// ✅ 定义验证规则
const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain uppercase letter')
    .matches(/[a-z]/, 'Password must contain lowercase letter')
    .matches(/[0-9]/, 'Password must contain number')
    .required('Password is required')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

// ✅ 验证通过后提交
const onSubmit = handleSubmit(async (values) => {
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  })
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input name="email" type="email" />
      <span class="error">{{ errors.email }}</span>
    </div>
    
    <div>
      <input name="password" type="password" />
      <span class="error">{{ errors.password }}</span>
    </div>
    
    <button type="submit">Submit</button>
  </form>
</template>
```

**安装 vee-validate**:
```bash
npm install vee-validate yup
```

---

### ✅ 正例 2：手动验证

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref('')
const password = ref('')

// ✅ 邮箱验证
const emailError = computed(() => {
  if (!email.value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return 'Invalid email format'
  }
  return ''
})

// ✅ 密码验证
const passwordError = computed(() => {
  if (!password.value) return 'Password is required'
  if (password.value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[A-Z]/.test(password.value)) {
    return 'Password must contain uppercase letter'
  }
  if (!/[a-z]/.test(password.value)) {
    return 'Password must contain lowercase letter'
  }
  if (!/[0-9]/.test(password.value)) {
    return 'Password must contain number'
  }
  return ''
})

// ✅ 表单是否有效
const isValid = computed(() => 
  !emailError.value && !passwordError.value
)

async function submitForm() {
  if (!isValid.value) return
  
  // 提交数据
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
}
</script>
```

---

## CSRF 防护

### ❌ 反例：无 CSRF 防护

```typescript
<script setup lang="ts">
// ❌ 直接发送 POST 请求，无 CSRF Token
async function deleteUser(id: number) {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })
}
</script>
```

**问题**:
- 恶意网站可以伪造请求
- 用户可能在不知情的情况下执行操作

---

### ✅ 正例：使用 CSRF Token

```typescript
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const csrfToken = ref('')

// ✅ 从后端获取 CSRF Token
onMounted(async () => {
  const response = await fetch('/api/csrf-token')
  const data = await response.json()
  csrfToken.value = data.token
})

// ✅ 发送请求时携带 CSRF Token
async function deleteUser(id: number) {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken.value
    }
  })
}
</script>
```

**后端示例（Express）**:
```javascript
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() })
})

app.delete('/api/users/:id', csrfProtection, (req, res) => {
  // 验证 CSRF Token
  // ...
})
```

---

## 原型污染防护 (CWE-1321)

### ❌ 反例：直接合并用户输入

```typescript
<script setup lang="ts">
// ❌ 危险：直接使用 Object.assign 合并用户输入
function updateSettings(userInput: object) {
  Object.assign(settings, userInput)
}

// ❌ 危险：JSON.parse 后直接使用
async function loadConfig() {
  const response = await fetch('/api/config')
  const config = await response.json()
  
  // 攻击者可能注入 __proto__ 或 constructor
  if (config.isAdmin) {
    // 可能被绕过
  }
}

// ❌ 危险：递归合并对象
function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = deepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]  // __proto__.isAdmin = true
    }
  }
  return target
}
</script>
```

**攻击示例**:
```json
{
  "__proto__": {
    "isAdmin": true
  }
}
```

---

### ✅ 正例 1：白名单过滤

```typescript
<script setup lang="ts">
interface Settings {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

// ✅ 安全：只允许特定属性
function updateSettings(userInput: Record<string, unknown>) {
  const allowedKeys: (keyof Settings)[] = ['theme', 'language', 'notifications']
  const sanitized: Partial<Settings> = {}
  
  for (const key of allowedKeys) {
    if (key in userInput && !key.startsWith('__')) {
      // 类型验证
      const value = userInput[key]
      
      switch (key) {
        case 'theme':
          if (value === 'light' || value === 'dark') {
            sanitized.theme = value
          }
          break
        case 'language':
          if (typeof value === 'string') {
            sanitized.language = value
          }
          break
        case 'notifications':
          if (typeof value === 'boolean') {
            sanitized.notifications = value
          }
          break
      }
    }
  }
  
  Object.assign(settings, sanitized)
}
</script>
```

### ✅ 正例 2：使用 Object.create(null)

```typescript
<script setup lang="ts">
// ✅ 安全：创建无原型的对象
function createSafeObject<T extends object>(source: T): T {
  const safe = Object.create(null)
  
  for (const key of Object.keys(source)) {
    // 过滤危险属性
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue
    }
    
    const value = (source as any)[key]
    
    if (typeof value === 'object' && value !== null) {
      safe[key] = createSafeObject(value)
    } else {
      safe[key] = value
    }
  }
  
  return safe
}

// 使用
const userInput = JSON.parse(untrustedData)
const safeData = createSafeObject(userInput)
</script>
```

### ✅ 正例 3：使用 Map 替代对象

```typescript
<script setup lang="ts">
// ✅ 安全：使用 Map 存储用户数据
const userSettings = new Map<string, unknown>()

function updateSetting(key: string, value: unknown) {
  // Map 不受原型污染影响
  if (typeof key === 'string' && key.length > 0) {
    userSettings.set(key, value)
  }
}

function getSetting(key: string): unknown {
  return userSettings.get(key)
}
</script>
```

### ✅ 正例 4：冻结原型

```typescript
// main.ts - 应用启动时冻结原型
Object.freeze(Object.prototype)
Object.freeze(Array.prototype)
Object.freeze(Function.prototype)

// 注意：这可能影响某些第三方库
```

---

## 动态组件安全

### ❌ 反例：用户可控的组件名

```vue
<script setup lang="ts">
const componentName = ref(route.query.component)  // 来自 URL
</script>

<template>
  <!-- ❌ 危险：用户可以加载任意组件 -->
  <component :is="componentName" />
</template>
```

---

### ✅ 正例：白名单验证

```vue
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

// ✅ 定义允许的组件白名单
const allowedComponents = {
  UserProfile: () => import('./UserProfile.vue'),
  UserSettings: () => import('./UserSettings.vue'),
  UserDashboard: () => import('./UserDashboard.vue')
} as const

type ComponentName = keyof typeof allowedComponents

const props = defineProps<{
  componentName: string
}>()

// ✅ 验证组件名是否在白名单中
const currentComponent = computed(() => {
  const name = props.componentName as ComponentName
  
  if (name in allowedComponents) {
    return defineAsyncComponent(allowedComponents[name])
  }
  
  console.warn(`Unknown component: ${props.componentName}`)
  return null
})
</script>

<template>
  <Suspense>
    <component v-if="currentComponent" :is="currentComponent" />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### ✅ 高级用例：带权限的动态组件

```vue
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useUserStore } from '@/stores/user'

interface ComponentConfig {
  loader: () => Promise<any>
  requiredRole?: 'admin' | 'user' | 'guest'
}

const allowedComponents: Record<string, ComponentConfig> = {
  UserProfile: {
    loader: () => import('./UserProfile.vue'),
    requiredRole: 'user'
  },
  AdminPanel: {
    loader: () => import('./AdminPanel.vue'),
    requiredRole: 'admin'
  },
  PublicInfo: {
    loader: () => import('./PublicInfo.vue')
    // 无需角色，公开访问
  }
}

const props = defineProps<{
  componentName: string
}>()

const userStore = useUserStore()

const currentComponent = computed(() => {
  const config = allowedComponents[props.componentName]
  
  if (!config) {
    console.warn(`Unknown component: ${props.componentName}`)
    return null
  }
  
  // 检查权限
  if (config.requiredRole && userStore.role !== config.requiredRole) {
    console.warn(`Insufficient permissions for: ${props.componentName}`)
    return null
  }
  
  return defineAsyncComponent(config.loader)
})
</script>
```

---

## SSR 状态泄漏防护

### ❌ 反例：模块级全局状态

```typescript
// ❌ 危险：SSR 中会在不同请求间共享
// stores/user.ts
import { reactive } from 'vue'

// 模块级状态 - SSR 中会被所有请求共享！
const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false
})

export function useUser() {
  return state  // 用户 A 的数据可能泄漏给用户 B
}
```

---

### ✅ 正例 1：每次调用创建新状态

```typescript
// stores/user.ts
import { reactive, readonly } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ✅ 安全：每次调用创建新状态
export function useUser() {
  const state = reactive<UserState>({
    user: null,
    token: null,
    isAuthenticated: false
  })
  
  function login(user: User, token: string) {
    state.user = user
    state.token = token
    state.isAuthenticated = true
  }
  
  function logout() {
    state.user = null
    state.token = null
    state.isAuthenticated = false
  }
  
  return {
    state: readonly(state),
    login,
    logout
  }
}
```

### ✅ 正例 2：使用 Pinia（SSR 安全）

```typescript
// stores/user.ts
import { defineStore } from 'pinia'

// ✅ Pinia 自动处理 SSR 状态隔离
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!user.value)
  
  function login(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
  }
  
  function logout() {
    user.value = null
    token.value = null
  }
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
```

### ✅ 正例 3：请求级别的 Provide/Inject

```typescript
// server.ts (SSR 入口)
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

export function createApp() {
  const app = createSSRApp(App)
  
  // ✅ 每个请求创建新的 Pinia 实例
  const pinia = createPinia()
  app.use(pinia)
  
  // ✅ 请求级别的数据
  const requestContext = {
    requestId: generateRequestId(),
    timestamp: Date.now()
  }
  
  app.provide('requestContext', requestContext)
  
  return { app, pinia }
}
```

### ✅ 正例 4：敏感数据不序列化到客户端

```typescript
// composables/useAuth.ts
import { ref, computed } from 'vue'

export function useAuth() {
  const user = ref<User | null>(null)
  const _internalToken = ref<string | null>(null)  // 不暴露
  
  // ✅ 只暴露必要的公开信息
  const publicUser = computed(() => {
    if (!user.value) return null
    
    return {
      id: user.value.id,
      name: user.value.name,
      // ❌ 不包含敏感信息
      // email: user.value.email,
      // token: _internalToken.value
    }
  })
  
  return {
    user: publicUser,
    isAuthenticated: computed(() => !!user.value)
  }
}
```

---

## 📚 安全检查清单

### XSS 防护
- [ ] 默认使用文本插值（`{{ }}`），避免 `v-html`
- [ ] 必须使用 `v-html` 时，用 DOMPurify 清理
- [ ] URL 验证（避免 `javascript:`、`data:` 协议）
- [ ] 属性绑定验证（`:href`、`:src` 等）

### 敏感信息
- [ ] 无硬编码的 API Key / Token
- [ ] 敏感操作通过后端代理
- [ ] 使用 HttpOnly Cookie 存储 Session
- [ ] 环境变量不包含真正的 Secret

### 输入验证
- [ ] 所有表单输入有验证（vee-validate 或手动）
- [ ] 邮箱格式验证
- [ ] 密码强度验证
- [ ] 特殊字符过滤

### CSRF 防护
- [ ] 所有状态变更请求（POST/PUT/DELETE）使用 CSRF Token
- [ ] 使用 SameSite Cookie
- [ ] 验证 Referer 头（可选）

### 原型污染防护
- [ ] 不直接 Object.assign 用户输入
- [ ] 使用白名单过滤属性
- [ ] 过滤 `__proto__`、`constructor`、`prototype`
- [ ] 考虑使用 Map 替代对象

### 动态组件安全
- [ ] 动态组件使用白名单
- [ ] 验证用户权限
- [ ] 记录未知组件访问日志

### SSR 安全
- [ ] 无模块级全局状态
- [ ] 使用 Pinia 或请求级状态
- [ ] 敏感数据不序列化到客户端
- [ ] 每个请求创建新的应用实例

---

## 📚 相关资源

- [vue3-review.md](../vue3-review.md) - 完整审查流程
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE-1321: 原型污染](https://cwe.mitre.org/data/definitions/1321.html)
- [DOMPurify 文档](https://github.com/cure53/DOMPurify)
- [vee-validate 文档](https://vee-validate.logaretm.com/)
- [Vue 3 安全最佳实践](https://vuejs.org/guide/best-practices/security.html)
- [Pinia SSR 指南](https://pinia.vuejs.org/ssr/)
