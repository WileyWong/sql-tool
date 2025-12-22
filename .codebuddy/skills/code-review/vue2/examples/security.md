# Vue 2 安全性审查示例

> ⚠️ **Vue 2 EOL 安全警告**：Vue 2 已于 2023 年 12 月 31 日停止维护，不再接收安全补丁。建议尽快迁移到 Vue 3。

## 原型污染 (CWE-1321)

### 问题代码

```javascript
export default {
  name: 'SettingsForm',
  data() {
    return {
      settings: {
        theme: 'light',
        language: 'zh-CN'
      }
    }
  },
  methods: {
    // ❌ 危险：直接合并用户输入
    updateSettings(userInput) {
      Object.assign(this.settings, userInput)
    },
    
    // ❌ 危险：递归深度合并
    deepMerge(target, source) {
      for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          target[key] = this.deepMerge(target[key] || {}, source[key])
        } else {
          target[key] = source[key]
        }
      }
      return target
    },
    
    // ❌ 危险：从 URL 参数解析配置
    loadFromUrl() {
      const params = new URLSearchParams(location.search)
      const config = JSON.parse(params.get('config') || '{}')
      Object.assign(this.settings, config)
    }
  }
}

// 攻击示例：
// userInput = { "__proto__": { "isAdmin": true } }
// 或 URL: ?config={"__proto__":{"isAdmin":true}}
```

**问题分析**：
- P0 🔴 `Object.assign` 可被原型污染攻击
- P0 🔴 递归合并可污染 `Object.prototype`
- P0 🔴 从 URL 解析 JSON 配置极其危险

### 修复后代码

```javascript
export default {
  name: 'SettingsForm',
  data() {
    return {
      settings: {
        theme: 'light',
        language: 'zh-CN'
      }
    }
  },
  methods: {
    // ✅ 安全：白名单过滤
    updateSettings(userInput) {
      const ALLOWED_KEYS = ['theme', 'language', 'fontSize', 'notifications']
      const sanitized = {}
      
      for (const key of ALLOWED_KEYS) {
        if (key in userInput && this.isValidValue(key, userInput[key])) {
          sanitized[key] = userInput[key]
        }
      }
      
      Object.assign(this.settings, sanitized)
    },
    
    // ✅ 安全：值验证
    isValidValue(key, value) {
      // 禁止危险的 key
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return false
      }
      
      // 类型检查
      const validators = {
        theme: v => ['light', 'dark', 'auto'].includes(v),
        language: v => ['zh-CN', 'en-US', 'ja-JP'].includes(v),
        fontSize: v => typeof v === 'number' && v >= 12 && v <= 24,
        notifications: v => typeof v === 'boolean'
      }
      
      return validators[key] ? validators[key](value) : false
    },
    
    // ✅ 安全：使用 Object.create(null) 创建无原型对象
    createSafeObject(source) {
      const safe = Object.create(null)
      const ALLOWED_KEYS = ['theme', 'language']
      
      for (const key of ALLOWED_KEYS) {
        if (key in source) {
          safe[key] = source[key]
        }
      }
      
      return safe
    },
    
    // ✅ 安全：安全的深度合并
    safeDeepMerge(target, source) {
      const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype']
      
      for (const key in source) {
        if (FORBIDDEN_KEYS.includes(key)) {
          console.warn(`Blocked dangerous key: ${key}`)
          continue
        }
        
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
          continue
        }
        
        const value = source[key]
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          target[key] = this.safeDeepMerge(target[key] || {}, value)
        } else {
          target[key] = value
        }
      }
      
      return target
    }
  }
}
```

---

## 动态模板注入 (Template Injection)

### 问题代码

```javascript
// ❌ 极其危险：动态编译用户输入的模板
export default {
  name: 'DynamicContent',
  props: {
    userTemplate: String
  },
  render(h) {
    // ❌ 危险：Vue.compile 用户输入
    const { render } = Vue.compile(this.userTemplate)
    return render.call(this, h)
  }
}

// ❌ 危险：new Vue 使用用户模板
function createDynamicComponent(userTemplate) {
  return new Vue({
    template: userTemplate,  // 模板注入！
    data: () => ({ /* ... */ })
  })
}

// ❌ 危险：v-html 渲染用户模板
// <div v-html="userTemplate"></div>
```

**攻击示例**：
```javascript
// 攻击者输入的模板
const maliciousTemplate = `
  <div>
    {{ constructor.constructor('alert(document.cookie)')() }}
  </div>
`

// 或利用 Vue 表达式
const xssTemplate = `
  <img src="x" onerror="alert('XSS')">
  {{ $root.$options.methods }}
`
```

### 修复后代码

```javascript
// ✅ 安全方案1：使用预定义模板 + 数据绑定
export default {
  name: 'SafeContent',
  props: {
    content: String,
    type: {
      type: String,
      validator: v => ['text', 'markdown', 'html'].includes(v)
    }
  },
  computed: {
    // ✅ 只允许安全的内容类型
    renderedContent() {
      switch (this.type) {
        case 'text':
          return this.escapeHtml(this.content)
        case 'markdown':
          return this.renderMarkdown(this.content)
        case 'html':
          return this.sanitizeHtml(this.content)
        default:
          return this.escapeHtml(this.content)
      }
    }
  },
  methods: {
    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    },
    
    renderMarkdown(md) {
      // 使用安全的 markdown 解析器
      return marked.parse(md, { sanitize: true })
    },
    
    sanitizeHtml(html) {
      // 使用 DOMPurify 过滤
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
        ALLOWED_ATTR: ['href', 'title', 'target']
      })
    }
  }
}

// ✅ 安全方案2：组件白名单
const ALLOWED_COMPONENTS = {
  'user-card': () => import('@/components/UserCard.vue'),
  'comment-box': () => import('@/components/CommentBox.vue'),
  'profile-view': () => import('@/components/ProfileView.vue')
}

export default {
  name: 'DynamicComponent',
  props: {
    componentName: String,
    componentProps: Object
  },
  computed: {
    safeComponent() {
      // ✅ 只允许白名单中的组件
      if (this.componentName in ALLOWED_COMPONENTS) {
        return ALLOWED_COMPONENTS[this.componentName]
      }
      console.warn(`Blocked component: ${this.componentName}`)
      return null
    }
  },
  render(h) {
    if (!this.safeComponent) {
      return h('div', { class: 'error' }, '组件不可用')
    }
    return h(this.safeComponent, {
      props: this.sanitizeProps(this.componentProps)
    })
  },
  methods: {
    sanitizeProps(props) {
      // 过滤危险的 props
      const safe = {}
      const FORBIDDEN = ['__proto__', 'constructor', 'prototype']
      
      for (const [key, value] of Object.entries(props || {})) {
        if (!FORBIDDEN.includes(key) && typeof value !== 'function') {
          safe[key] = value
        }
      }
      return safe
    }
  }
}
```

---

## Event Bus 内存泄漏（安全隐患）

### 问题代码

```javascript
// ❌ 全局 Event Bus 泄漏风险
const eventBus = new Vue()

export default {
  name: 'LeakyComponent',
  mounted() {
    // 注册事件但忘记清理
    eventBus.$on('user-login', this.handleLogin)
    eventBus.$on('data-refresh', this.handleRefresh)
    eventBus.$on('notification', this.handleNotification)
  },
  // ❌ 没有 beforeDestroy 清理！
  methods: {
    handleLogin(user) {
      // 组件销毁后仍可能被调用
      this.user = user  // 可能导致错误
      this.fetchUserData()  // 可能发起无效请求
    },
    handleRefresh() {
      this.loadData()
    },
    handleNotification(msg) {
      this.$message.info(msg)
    }
  }
}
```

**安全隐患**：
- P1 🟠 内存泄漏：组件销毁后事件处理器仍在内存中
- P1 🟠 数据泄露：销毁后的组件可能仍处理敏感数据
- P2 🟡 状态污染：可能修改已销毁组件的状态

### 修复后代码

```javascript
// ✅ 安全的 Event Bus 使用
const eventBus = new Vue()

export default {
  name: 'SafeComponent',
  data() {
    return {
      user: null,
      isDestroyed: false  // 销毁标记
    }
  },
  mounted() {
    // ✅ 注册事件
    eventBus.$on('user-login', this.handleLogin)
    eventBus.$on('data-refresh', this.handleRefresh)
  },
  beforeDestroy() {
    // ✅ 必须清理所有注册的事件
    this.isDestroyed = true
    eventBus.$off('user-login', this.handleLogin)
    eventBus.$off('data-refresh', this.handleRefresh)
  },
  methods: {
    handleLogin(user) {
      // ✅ 检查组件是否已销毁
      if (this.isDestroyed) return
      
      this.user = user
      this.fetchUserData()
    },
    handleRefresh() {
      if (this.isDestroyed) return
      this.loadData()
    }
  }
}

// ✅ 更好的方案：封装安全的 Event Bus
// utils/safeEventBus.js
class SafeEventBus {
  constructor() {
    this.bus = new Vue()
    this.componentEvents = new WeakMap()
  }
  
  // 注册事件并关联组件
  on(component, event, handler) {
    this.bus.$on(event, handler)
    
    // 记录组件注册的事件
    if (!this.componentEvents.has(component)) {
      this.componentEvents.set(component, [])
    }
    this.componentEvents.get(component).push({ event, handler })
  }
  
  // 清理组件的所有事件
  offAll(component) {
    const events = this.componentEvents.get(component)
    if (events) {
      events.forEach(({ event, handler }) => {
        this.bus.$off(event, handler)
      })
      this.componentEvents.delete(component)
    }
  }
  
  emit(event, ...args) {
    this.bus.$emit(event, ...args)
  }
}

export const safeEventBus = new SafeEventBus()

// 组件中使用
import { safeEventBus } from '@/utils/safeEventBus'

export default {
  mounted() {
    safeEventBus.on(this, 'user-login', this.handleLogin)
  },
  beforeDestroy() {
    // ✅ 一次性清理所有事件
    safeEventBus.offAll(this)
  }
}

// ✅ 最佳方案：使用 Vuex 替代 Event Bus
// store/modules/user.js
export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user)
    }
  }
}
```

---

## XSS 防护

### 问题代码

```vue
<template>
  <div>
    <!-- ❌ 问题1：直接渲染用户输入的 HTML -->
    <div v-html="userComment"></div>
    
    <!-- ❌ 问题2：URL 未验证 -->
    <a :href="userLink">用户链接</a>
    
    <!-- ❌ 问题3：动态组件名未验证 -->
    <component :is="userComponentName" />
  </div>
</template>

<script>
export default {
  name: 'UserContent',
  data() {
    return {
      userComment: '',      // 来自用户输入
      userLink: '',         // 来自用户输入
      userComponentName: '' // 来自用户输入
    }
  }
}
</script>
```

**问题分析**：
- P0 🔴 `v-html` 直接渲染用户输入，存在 XSS 风险
- P1 🟠 URL 未验证，可能执行 `javascript:` 协议
- P1 🟠 动态组件名未验证，可能加载恶意组件

### 修复后代码

```vue
<template>
  <div>
    <!-- ✅ 修复1：使用 DOMPurify 过滤 -->
    <div v-html="sanitizedComment"></div>
    
    <!-- ✅ 修复2：验证 URL 协议 -->
    <a :href="safeLink">用户链接</a>
    
    <!-- ✅ 修复3：白名单验证组件名 -->
    <component v-if="isValidComponent" :is="userComponentName" />
  </div>
</template>

<script>
import DOMPurify from 'dompurify'

// 允许的组件白名单
const ALLOWED_COMPONENTS = ['UserCard', 'CommentBox', 'ProfileView']

// 允许的 URL 协议
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

export default {
  name: 'UserContent',
  data() {
    return {
      userComment: '',
      userLink: '',
      userComponentName: ''
    }
  },
  computed: {
    // ✅ 使用 DOMPurify 过滤 HTML
    sanitizedComment() {
      return DOMPurify.sanitize(this.userComment, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'title']
      })
    },
    // ✅ 验证 URL 安全性
    safeLink() {
      try {
        const url = new URL(this.userLink)
        if (ALLOWED_PROTOCOLS.includes(url.protocol)) {
          return this.userLink
        }
      } catch (e) {
        // 无效 URL
      }
      return '#'
    },
    // ✅ 白名单验证组件
    isValidComponent() {
      return ALLOWED_COMPONENTS.includes(this.userComponentName)
    }
  }
}
</script>
```

---

## 输入验证

### 问题代码

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ❌ 问题：无输入验证 -->
    <input v-model="form.email" type="text" />
    <input v-model="form.password" type="password" />
    <input v-model="form.age" type="text" />
    <button type="submit">提交</button>
  </form>
</template>

<script>
export default {
  name: 'UserForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
        age: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      // ❌ 问题：直接提交未验证的数据
      await api.register(this.form)
    }
  }
}
</script>
```

**问题分析**：
- P1 🟠 邮箱格式未验证
- P1 🟠 密码强度未验证
- P2 🟡 年龄类型未验证

### 修复后代码（使用 Vuelidate）

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input 
        v-model="form.email" 
        type="email"
        :class="{ error: $v.form.email.$error }"
      />
      <span v-if="$v.form.email.$error" class="error-msg">
        <template v-if="!$v.form.email.required">邮箱必填</template>
        <template v-else-if="!$v.form.email.email">邮箱格式不正确</template>
      </span>
    </div>
    
    <div>
      <input 
        v-model="form.password" 
        type="password"
        :class="{ error: $v.form.password.$error }"
      />
      <span v-if="$v.form.password.$error" class="error-msg">
        <template v-if="!$v.form.password.required">密码必填</template>
        <template v-else-if="!$v.form.password.minLength">
          密码至少 {{ $v.form.password.$params.minLength.min }} 位
        </template>
        <template v-else-if="!$v.form.password.strongPassword">
          密码需包含大小写字母和数字
        </template>
      </span>
    </div>
    
    <div>
      <input 
        v-model.number="form.age" 
        type="number"
        :class="{ error: $v.form.age.$error }"
      />
      <span v-if="$v.form.age.$error" class="error-msg">
        <template v-if="!$v.form.age.between">
          年龄需在 {{ $v.form.age.$params.between.min }} - {{ $v.form.age.$params.between.max }} 之间
        </template>
      </span>
    </div>
    
    <button type="submit" :disabled="$v.$invalid">提交</button>
  </form>
</template>

<script>
import { required, email, minLength, between } from 'vuelidate/lib/validators'

// 自定义验证器：强密码
const strongPassword = (value) => {
  if (!value) return true
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)
}

export default {
  name: 'UserForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
        age: null
      }
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { 
        required, 
        minLength: minLength(8),
        strongPassword
      },
      age: { between: between(1, 120) }
    }
  },
  methods: {
    async handleSubmit() {
      // ✅ 触发验证
      this.$v.$touch()
      
      if (this.$v.$invalid) {
        return
      }
      
      try {
        await api.register(this.form)
        this.$message.success('注册成功')
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>
```

---

## 敏感信息保护

### 问题代码

```javascript
export default {
  name: 'PaymentForm',
  data() {
    return {
      cardNumber: '',
      cvv: '',
      token: localStorage.getItem('auth_token')
    }
  },
  methods: {
    async processPayment() {
      // ❌ 问题1：控制台打印敏感信息
      console.log('Processing payment:', {
        card: this.cardNumber,
        cvv: this.cvv,
        token: this.token
      })
      
      // ❌ 问题2：错误信息包含敏感数据
      try {
        await api.pay(this.cardNumber, this.cvv)
      } catch (e) {
        // 错误可能包含卡号等信息
        this.$message.error(`支付失败: ${e.message}`)
      }
    }
  },
  // ❌ 问题3：敏感数据暴露在 Vue Devtools
  computed: {
    debugInfo() {
      return {
        card: this.cardNumber,
        token: this.token
      }
    }
  }
}
```

**问题分析**：
- P0 🔴 控制台打印敏感信息
- P1 🟠 错误信息可能泄露敏感数据
- P2 🟡 Vue Devtools 可查看敏感数据

### 修复后代码

```javascript
export default {
  name: 'PaymentForm',
  data() {
    return {
      cardNumber: '',
      cvv: ''
    }
  },
  created() {
    // ✅ 敏感数据不放在响应式 data 中
    this._token = localStorage.getItem('auth_token')
  },
  methods: {
    async processPayment() {
      // ✅ 只在开发环境打印，且脱敏
      if (process.env.NODE_ENV === 'development') {
        console.log('Processing payment:', {
          card: this.maskCardNumber(this.cardNumber),
          cvv: '***'
        })
      }
      
      try {
        // ✅ 使用加密传输
        const encryptedCard = this.encryptData(this.cardNumber)
        const encryptedCvv = this.encryptData(this.cvv)
        
        await api.pay({
          card: encryptedCard,
          cvv: encryptedCvv
        })
        
        this.$message.success('支付成功')
        
        // ✅ 处理完成后清除敏感数据
        this.clearSensitiveData()
      } catch (e) {
        // ✅ 错误信息不包含敏感数据
        this.$message.error('支付失败，请稍后重试')
        
        // ✅ 记录错误但不包含敏感信息
        this.logError('payment_failed', {
          errorCode: e.code,
          // 不记录卡号、CVV 等
        })
      }
    },
    
    // ✅ 卡号脱敏
    maskCardNumber(cardNumber) {
      if (!cardNumber || cardNumber.length < 4) return '****'
      return '**** **** **** ' + cardNumber.slice(-4)
    },
    
    // ✅ 数据加密（示例）
    encryptData(data) {
      // 实际应使用加密库
      return btoa(data)
    },
    
    // ✅ 清除敏感数据
    clearSensitiveData() {
      this.cardNumber = ''
      this.cvv = ''
    },
    
    // ✅ 安全的错误日志
    logError(type, data) {
      // 发送到日志服务，不包含敏感信息
    }
  },
  
  // ✅ 组件销毁时清除敏感数据
  beforeDestroy() {
    this.clearSensitiveData()
    this._token = null
  }
}
```

---

## CSRF 防护

### 问题代码

```javascript
export default {
  name: 'TransferForm',
  methods: {
    async transfer() {
      // ❌ 问题：无 CSRF 防护
      await axios.post('/api/transfer', {
        to: this.targetAccount,
        amount: this.amount
      })
    }
  }
}
```

**问题分析**：
- P0 🔴 敏感操作无 CSRF Token 验证

### 修复后代码

```javascript
// utils/request.js
import axios from 'axios'

const request = axios.create({
  baseURL: '/api'
})

// ✅ 请求拦截器添加 CSRF Token
request.interceptors.request.use(config => {
  // 从 cookie 或 meta 标签获取 CSRF Token
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    || getCookie('XSRF-TOKEN')
  
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken
  }
  
  return config
})

export default request

// 组件中使用
import request from '@/utils/request'

export default {
  name: 'TransferForm',
  methods: {
    async transfer() {
      // ✅ 使用带 CSRF 防护的请求
      await request.post('/transfer', {
        to: this.targetAccount,
        amount: this.amount
      })
    }
  }
}
```

---

## 权限控制

### 问题代码

```vue
<template>
  <div>
    <!-- ❌ 问题：仅前端隐藏，后端无校验 -->
    <button v-if="isAdmin" @click="deleteUser">删除用户</button>
    
    <!-- ❌ 问题：敏感数据直接显示 -->
    <div>用户密码: {{ user.password }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserManage',
  computed: {
    isAdmin() {
      return this.$store.state.user.role === 'admin'
    }
  },
  methods: {
    async deleteUser() {
      // ❌ 问题：未验证权限
      await api.deleteUser(this.userId)
    }
  }
}
</script>
```

**问题分析**：
- P0 🔴 仅前端权限控制，可被绕过
- P0 🔴 敏感数据（密码）直接显示

### 修复后代码

```vue
<template>
  <div>
    <!-- ✅ 前端权限控制（仅用于 UI 展示） -->
    <button 
      v-if="hasPermission('user:delete')" 
      @click="deleteUser"
    >
      删除用户
    </button>
    
    <!-- ✅ 敏感数据不显示 -->
    <div>用户状态: {{ user.status }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserManage',
  computed: {
    ...mapGetters(['hasPermission'])
  },
  methods: {
    async deleteUser() {
      // ✅ 二次确认
      const confirmed = await this.$confirm('确定删除该用户？')
      if (!confirmed) return
      
      try {
        // ✅ 后端会验证权限和 Token
        await api.deleteUser(this.userId)
        this.$message.success('删除成功')
      } catch (e) {
        if (e.code === 'FORBIDDEN') {
          this.$message.error('无权限执行此操作')
        } else {
          this.$message.error('操作失败')
        }
      }
    }
  }
}
</script>
```

---

## 审查结果模板

```markdown
## Vue 2 安全性审查结果

### 审查信息
- **组件**: UserManage.vue
- **审查级别**: 专业审查
- **审查时间**: 2025-12-18

### ⚠️ Vue 2 EOL 安全提醒
Vue 2 已停止维护，不再接收安全补丁。建议：
- [ ] 制定 Vue 3 迁移计划
- [ ] 定期检查依赖漏洞
- [ ] 加强安全审查频率

### 安全评分

| 类别 | 得分 | 说明 |
|------|------|------|
| XSS 防护 | 60 | 存在 v-html 未过滤 |
| 输入验证 | 70 | 部分字段缺少验证 |
| 敏感信息 | 50 | 控制台打印敏感数据 |
| CSRF 防护 | 80 | 已配置 Token |
| 权限控制 | 75 | 需加强后端校验 |
| 原型污染防护 | 40 | Object.assign 用户输入 |
| 模板安全 | 60 | 动态组件未白名单 |
| Event Bus | 55 | 存在未清理的事件 |
| **综合得分** | **61** | C级 |

### 问题清单

| 优先级 | 问题 | 位置 | 风险类型 | 修复建议 |
|--------|------|------|---------|---------|
| P0 🔴 | v-html 未过滤 | template | XSS | 使用 DOMPurify |
| P0 🔴 | 控制台打印密码 | methods | 信息泄露 | 移除或脱敏 |
| P0 🔴 | Object.assign 用户输入 | updateSettings | 原型污染 | 白名单过滤 |
| P0 🔴 | Vue.compile 用户输入 | render | 模板注入 | 禁止动态编译 |
| P1 🟠 | URL 未验证 | computed | XSS | 验证协议白名单 |
| P1 🟠 | 表单无验证 | methods | 数据完整性 | 添加 Vuelidate |
| P1 🟠 | Event Bus 未清理 | mounted | 内存泄漏 | beforeDestroy 清理 |
| P1 🟠 | 动态组件无白名单 | template | 组件注入 | 添加白名单 |
| P2 🟡 | 错误信息过详细 | catch | 信息泄露 | 通用错误提示 |

### 安全检查命令

```bash
# 依赖漏洞检查
npm audit
npm audit fix

# v-html 使用检查
grep -rn "v-html" src/ --include="*.vue"

# 动态模板检查
grep -rn "Vue.compile" src/ --include="*.js"
grep -rn "new Vue.*template" src/ --include="*.js"

# 原型污染风险检查
grep -rn "Object.assign.*\$" src/ --include="*.vue"
grep -rn "__proto__" src/ --include="*.js"

# Event Bus 泄漏检查
grep -r "\$on(" src/ --include="*.vue" -l | xargs grep -L "\$off("

# 敏感信息打印检查
grep -rn "console.log.*token\|password\|secret" src/ --include="*.js"
```

### 修复优先级

1. **立即修复 (P0)** - 本次发布前
   - 移除或过滤所有 v-html
   - 清理控制台敏感信息打印
   - 修复原型污染风险
   - 禁止动态模板编译

2. **本周修复 (P1)**
   - 添加输入验证
   - URL 安全验证
   - Event Bus 清理
   - 动态组件白名单

3. **下迭代修复 (P2)**
   - 优化错误提示
   - 加强日志安全

### Vue 3 迁移安全改进

| Vue 2 问题 | Vue 3 改进 |
|-----------|-----------|
| filters 可能存在 XSS | 已移除 filters |
| Event Bus 内存泄漏 | 推荐 mitt/pinia |
| $on/$off 手动管理 | Composition API 自动清理 |
| functional: true | 默认性能优化 |
```
