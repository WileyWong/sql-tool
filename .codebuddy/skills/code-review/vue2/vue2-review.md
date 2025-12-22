# Vue 2 Options API 代码审查指南

基于 Vue 2 Options API 的专业代码审查。

> 📚 **参考**: [Vue 2 技术栈](mdc:.codebuddy/spec/global/knowledge/stack/vue2.md)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-vue2-{时间戳}.md`

## ⚠️ Vue 2 特性说明

Vue 2 已于 2023 年 12 月 31 日停止维护（EOL）。新项目建议使用 Vue 3，现有项目应考虑迁移计划。

| 特性 | 说明 | 审查要点 |
|------|------|----------|
| `Vue.set` / `$set` | 响应式新增属性 | 必须使用，否则不响应 |
| `Vue.observable` | 简单状态管理 | 替代小型 Vuex 场景 |
| `Vue.nextTick` | DOM 更新后回调 | 操作 DOM 前必须调用 |
| `filters` | 模板过滤器 | Vue 3 已移除，建议迁移 |
| `$on/$off/$once` | 事件总线 | 注意内存泄漏 |
| `errorCaptured` | 错误边界 | 子组件错误处理 |

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理、命名清晰 |
| Options API | 20% | 选项顺序、computed/watch 正确使用 |
| Mixins | 15% | 命名冲突、依赖清晰、适度使用 |
| 性能优化 | 20% | key 使用、懒加载、keep-alive |
| 安全性 | 15% | XSS 防护、输入验证 |
| 可维护性 | 10% | 代码清晰、注释完整 |

## 组件设计审查

### 组件大小

| 指标 | 阈值 | 说明 |
|------|------|------|
| 组件行数 | ≤ 300 行 | 超过应拆分 |
| 模板行数 | ≤ 100 行 | 复杂模板提取子组件 |
| Props 数量 | ≤ 10 个 | 过多考虑重构 |
| data 属性 | ≤ 10 个 | 过多考虑拆分 |
| methods 方法 | ≤ 10 个 | 过多考虑提取 |

### 组件命名

```javascript
// ✅ 多词组件名
export default {
  name: 'UserProfile'
}

export default {
  name: 'OrderList'
}

// ❌ 单词组件名
export default {
  name: 'Profile'
}
```

### Options 顺序规范

```javascript
export default {
  name: 'ComponentName',        // 1. 组件名（必须）
  
  // 2. 副作用
  mixins: [],
  extends: undefined,
  
  // 3. 组件依赖
  components: {},
  directives: {},
  filters: {},
  
  // 4. 接口
  props: {},
  
  // 5. 本地状态
  data() {
    return {}
  },
  computed: {},
  
  // 6. 事件
  watch: {},
  
  // 7. 生命周期（按调用顺序）
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  
  // 8. 方法
  methods: {}
}
```

### Props 定义

```javascript
// ✅ 完整 Props 定义
props: {
  userId: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'user',
    validator(value) {
      return ['admin', 'user', 'guest'].includes(value)
    }
  },
  config: {
    type: Object,
    default: () => ({})  // 对象/数组必须用工厂函数
  }
}

// ❌ 简单数组定义
props: ['userId', 'userName', 'role']
```

## 响应式系统审查

### data 函数

```javascript
// ✅ data 必须是函数
data() {
  return {
    count: 0,
    user: null
  }
}

// ❌ data 是对象（组件复用时共享状态）
data: {
  count: 0
}
```

### 响应式陷阱

```javascript
// ❌ 新增属性不响应
this.user.newProp = 'value'

// ✅ 使用 Vue.set
this.$set(this.user, 'newProp', 'value')

// ❌ 数组索引赋值不响应
this.items[0] = newItem

// ✅ 使用 Vue.set 或数组方法
this.$set(this.items, 0, newItem)
this.items.splice(0, 1, newItem)

// ❌ 直接修改数组长度
this.items.length = 0

// ✅ 使用 splice
this.items.splice(0)
```

### computed vs methods

```javascript
// ✅ 派生状态用 computed（有缓存）
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  },
  filteredList() {
    return this.items.filter(item => item.active)
  }
}

// ❌ 用 methods 实现派生状态（无缓存）
methods: {
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
// 模板中每次渲染都会重新计算
```

### Vue.nextTick 使用

```javascript
// ❌ 常见错误：DOM 更新时机问题
methods: {
  updateAndFocus() {
    this.showInput = true
    this.$refs.input.focus()  // 错误：DOM 还未更新
  }
}

// ✅ 正确：使用 $nextTick
methods: {
  updateAndFocus() {
    this.showInput = true
    this.$nextTick(() => {
      this.$refs.input.focus()  // DOM 已更新
    })
  },
  
  // 或使用 async/await
  async updateAndFocusAsync() {
    this.showInput = true
    await this.$nextTick()
    this.$refs.input.focus()
  }
}

// ⚠️ 避免嵌套 $nextTick
methods: {
  // ❌ 反模式
  badPattern() {
    this.$nextTick(() => {
      this.$nextTick(() => {
        // 嵌套 nextTick 说明逻辑有问题
      })
    })
  }
}
```

### Vue.observable 简单状态管理

```javascript
// ✅ 适用于小型应用，替代 Vuex
// store.js
import Vue from 'vue'

export const store = Vue.observable({
  user: null,
  theme: 'light',
  notifications: []
})

export const mutations = {
  setUser(user) {
    store.user = user
  },
  setTheme(theme) {
    store.theme = theme
  },
  addNotification(notification) {
    store.notifications.push(notification)
  }
}

// 组件中使用
import { store, mutations } from '@/store'

export default {
  computed: {
    user() {
      return store.user
    },
    theme() {
      return store.theme
    }
  },
  methods: {
    login(userData) {
      mutations.setUser(userData)
    }
  }
}

// ⚠️ 注意：Vue.observable 不支持 devtools 调试
// 大型应用仍建议使用 Vuex
```

### watch 使用

```javascript
// ✅ 监听简单值
watch: {
  searchQuery(newVal) {
    this.search(newVal)
  }
}

// ✅ 监听对象属性（精确监听）
watch: {
  'user.profile.name'(newName) {
    this.updateName(newName)
  }
}

// ⚠️ 深度监听（谨慎使用，性能开销大）
watch: {
  user: {
    handler(newVal) {
      this.onUserChange(newVal)
    },
    deep: true
  }
}

// ✅ 立即执行
watch: {
  userId: {
    handler(id) {
      this.fetchUser(id)
    },
    immediate: true
  }
}
```

## Mixins 审查

### 命名冲突检查

```javascript
// ❌ 危险：多个 mixin 同名属性
const mixinA = {
  data() {
    return { loading: false }
  }
}

const mixinB = {
  data() {
    return { loading: true }  // 冲突！
  }
}

// ✅ 使用命名前缀
const loadingMixin = {
  data() {
    return { 
      mixin_loading: false  // 前缀区分
    }
  }
}
```

### 隐式依赖检查

```javascript
// ❌ mixin 依赖组件的属性（隐式依赖）
const formMixin = {
  methods: {
    submit() {
      this.apiCall(this.formData)  // 依赖组件的 formData
    }
  }
}

// ✅ 通过参数传递
const formMixin = {
  methods: {
    submit(data, apiCall) {
      return apiCall(data)
    }
  }
}
```

### Mixin 替代方案

```javascript
// 方案1：提取为工具函数
// utils/form.js
export function validateForm(data, rules) {
  // 验证逻辑
}

export function submitForm(api, data) {
  // 提交逻辑
}

// 组件中使用
import { validateForm, submitForm } from '@/utils/form'

export default {
  methods: {
    handleSubmit() {
      if (validateForm(this.formData, this.rules)) {
        submitForm(this.api, this.formData)
      }
    }
  }
}

// 方案2：高阶组件（HOC）
// components/WithLoading.vue
export default {
  props: ['loading'],
  render() {
    return this.loading 
      ? this.$slots.loading 
      : this.$slots.default
  }
}

// 方案3：Vue.observable 共享状态
// store/loading.js
import Vue from 'vue'

export const loadingState = Vue.observable({
  isLoading: false,
  error: null
})

export function setLoading(status) {
  loadingState.isLoading = status
}

export function setError(error) {
  loadingState.error = error
}
```

## 组件通信审查

### Props 单向数据流

```javascript
// ❌ 直接修改 prop
methods: {
  updateUser() {
    this.user.name = 'New Name'  // 错误！
  }
}

// ✅ 通过事件通知父组件
methods: {
  updateUser() {
    this.$emit('update', { ...this.user, name: 'New Name' })
  }
}

// ✅ 使用 .sync 修饰符
// 子组件
this.$emit('update:user', newUser)
// 父组件
<ChildComponent :user.sync="user" />
```

### 事件命名

```javascript
// ✅ 事件名使用 kebab-case
this.$emit('item-selected', item)
this.$emit('form-submit', data)

// ❌ 使用 camelCase
this.$emit('itemSelected', item)
```

### 跨层级通信

```javascript
// ✅ provide/inject（依赖注入）
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'updateTheme']
}

// ⚠️ 注意：provide 的数据不是响应式的
// 需要响应式时使用 Vue.observable
provide() {
  return {
    state: Vue.observable({ theme: 'light' })
  }
}
```

## Event Bus 审查 (高频问题)

### Event Bus 内存泄漏

```javascript
// ❌ 典型错误：Event Bus 未清理
const eventBus = new Vue()

export default {
  name: 'UserComponent',
  mounted() {
    eventBus.$on('user-login', this.handleLogin)  // 注册事件
    eventBus.$on('data-update', this.handleUpdate)
  }
  // 忘记在 beforeDestroy 中 $off → 内存泄漏！
}

// ✅ 正确做法：必须清理
export default {
  name: 'UserComponent',
  mounted() {
    eventBus.$on('user-login', this.handleLogin)
    eventBus.$on('data-update', this.handleUpdate)
  },
  beforeDestroy() {
    // 必须清理所有注册的事件
    eventBus.$off('user-login', this.handleLogin)
    eventBus.$off('data-update', this.handleUpdate)
  },
  methods: {
    handleLogin(user) { /* ... */ },
    handleUpdate(data) { /* ... */ }
  }
}

// ✅ 更好的做法：使用 $once 或 Vuex
export default {
  mounted() {
    // 只监听一次
    eventBus.$once('app-ready', this.onAppReady)
  }
}

// ✅ 最佳实践：避免 Event Bus，使用 Vuex
// store/modules/user.js
export default {
  state: { user: null },
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

### Event Bus 事件命名

```javascript
// ❌ 魔法字符串，容易拼写错误
eventBus.$emit('userLogin', user)
eventBus.$on('user-login', handler)  // 不匹配！

// ✅ 使用常量定义事件名
// constants/events.js
export const EVENTS = {
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  DATA_UPDATE: 'data:update'
}

// 使用
import { EVENTS } from '@/constants/events'

eventBus.$emit(EVENTS.USER_LOGIN, user)
eventBus.$on(EVENTS.USER_LOGIN, handler)
```

## 性能优化审查

### v-for 优化

```vue
<!-- ❌ 缺少 key -->
<li v-for="item in items">{{ item.name }}</li>

<!-- ✅ 使用唯一 key -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- ❌ v-if 与 v-for 同时使用 -->
<li v-for="item in items" v-if="item.active" :key="item.id">
  {{ item.name }}
</li>

<!-- ✅ 使用 computed 过滤 -->
<li v-for="item in activeItems" :key="item.id">
  {{ item.name }}
</li>

<script>
computed: {
  activeItems() {
    return this.items.filter(item => item.active)
  }
}
</script>
```

### 组件懒加载

```javascript
// ✅ 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

// ✅ 异步组件
components: {
  HeavyChart: () => import('@/components/HeavyChart.vue')
}

// ✅ 带加载状态的异步组件
components: {
  HeavyChart: () => ({
    component: import('@/components/HeavyChart.vue'),
    loading: LoadingComponent,
    error: ErrorComponent,
    delay: 200,
    timeout: 3000
  })
}
```

### keep-alive 缓存

```vue
<!-- ✅ 缓存动态组件 -->
<keep-alive>
  <component :is="currentTab" />
</keep-alive>

<!-- ✅ 条件缓存 -->
<keep-alive include="UserList,OrderList" :max="10">
  <router-view />
</keep-alive>

<!-- ✅ 使用 activated/deactivated 钩子 -->
<script>
export default {
  activated() {
    // 组件激活时刷新数据
    this.fetchData()
  },
  deactivated() {
    // 组件停用时清理
    this.cleanup()
  }
}
</script>
```

### 非响应式数据

```javascript
export default {
  data() {
    return {
      // 需要响应式的数据
      formData: { name: '', email: '' }
    }
  },
  created() {
    // 不需要响应式的大型数据
    this.chartInstance = null
    this.staticConfig = Object.freeze({
      // 大量静态配置
    })
  }
}
```

## 安全性审查

### XSS 防护

```vue
<!-- ❌ 危险：直接渲染 HTML -->
<div v-html="userInput"></div>

<!-- ✅ 安全：使用 DOMPurify -->
<script>
import DOMPurify from 'dompurify'

export default {
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.userInput)
    }
  }
}
</script>

<template>
  <div v-html="sanitizedHtml"></div>
</template>
```

### 输入验证

```javascript
// ✅ 前端验证
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(8) }
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.doSubmit()
      }
    }
  }
}
```

### 敏感信息保护

```javascript
// ❌ 控制台打印敏感信息
console.log('Token:', token)

// ✅ 开发环境才打印
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### 原型污染防护 (CWE-1321)

```javascript
// ❌ 危险：直接合并用户输入
methods: {
  updateSettings(userInput) {
    Object.assign(this.settings, userInput)  // 原型污染风险
  }
}

// ❌ 危险：递归合并用户输入
function deepMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = deepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]  // __proto__.isAdmin = true
    }
  }
  return target
}

// ✅ 安全：白名单过滤
methods: {
  updateSettings(userInput) {
    const allowedKeys = ['theme', 'language', 'notifications']
    const sanitized = {}
    
    for (const key of allowedKeys) {
      if (key in userInput && !key.startsWith('__')) {
        sanitized[key] = userInput[key]
      }
    }
    
    Object.assign(this.settings, sanitized)
  }
}

// ✅ 使用 Object.create(null) 避免原型链
const safeObject = Object.create(null)
```

### 动态模板编译安全

```javascript
// ❌ 危险：动态编译用户输入
new Vue({
  template: userProvidedTemplate  // 模板注入风险！
})

// ❌ 危险：Vue.compile 用户输入
const { render } = Vue.compile(userInput)

// ✅ 安全：使用预定义模板 + 数据绑定
new Vue({
  template: '<div>{{ safeContent }}</div>',
  data: {
    safeContent: userInput  // 自动转义
  }
})

// ✅ 安全：组件白名单
const ALLOWED_COMPONENTS = ['UserCard', 'CommentBox']

export default {
  computed: {
    safeComponent() {
      if (ALLOWED_COMPONENTS.includes(this.componentName)) {
        return this.componentName
      }
      return 'DefaultComponent'
    }
  }
}
```

## 可维护性审查

### 事件清理

```javascript
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.timer = setInterval(this.poll, 5000)
  },
  // ✅ 必须在 beforeDestroy 清理
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.timer)
  }
}
```

### Event Bus 清理

```javascript
// ❌ 常见遗漏
export default {
  mounted() {
    this.$root.$on('global-event', this.handler)
  }
  // 忘记清理！
}

// ✅ 必须清理
export default {
  mounted() {
    this.$root.$on('global-event', this.handler)
  },
  beforeDestroy() {
    this.$root.$off('global-event', this.handler)
  }
}
```

### 错误处理

```javascript
// ✅ 全局错误处理
Vue.config.errorHandler = function (err, vm, info) {
  console.error('Vue Error:', err)
  // 上报错误
}

// ✅ 组件级错误处理（错误边界）
export default {
  errorCaptured(err, vm, info) {
    console.error('Component Error:', err)
    // 可以显示降级 UI
    this.hasError = true
    return false  // 阻止向上传播
  },
  data() {
    return {
      hasError: false
    }
  }
}
```

### 生命周期边界情况

```javascript
// ❌ beforeCreate 中访问 data（undefined）
export default {
  beforeCreate() {
    console.log(this.message)  // undefined！
  },
  data() {
    return { message: 'Hello' }
  }
}

// ✅ created 中可以访问 data
export default {
  created() {
    console.log(this.message)  // 'Hello'
    // 但 $el 还不可用
  }
}

// ✅ mounted 中可以访问 DOM
export default {
  mounted() {
    console.log(this.$el)  // DOM 元素
    console.log(this.$refs.input)  // ref 元素
  }
}

// ⚠️ 父子组件生命周期顺序
// 父 beforeCreate → 父 created → 父 beforeMount
// → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
// → 父 mounted
```

## 检查工具

### ESLint 检查

```bash
npm run lint

# Vue 2 专用规则
npx eslint --ext .vue,.js src/ --rule 'vue/no-v-html: warn'
```

### 组件大小检查

```bash
node tools/check-component-size.js
node tools/check-component-size.js --threshold=200
```

### Event Bus 使用检查

```bash
# 查找 $on 但没有对应 $off 的文件
grep -r "\$on(" src/ --include="*.vue" -l | xargs grep -L "\$off("

# 查找 Event Bus 使用
grep -rn "new Vue()" src/ --include="*.js" | grep -v "main.js"
```

### 安全漏洞检查

```bash
# 依赖漏洞检查
npm audit

# 查找危险模式
grep -rn "v-html" src/ --include="*.vue"
grep -rn "Vue.compile" src/ --include="*.js"
```

## 评分细则

### 组件设计 (20%)

| 子项 | 占比 |
|------|------|
| 职责单一 | 40% |
| 大小合理 | 30% |
| 命名规范 | 30% |

### Options API (20%)

| 子项 | 占比 |
|------|------|
| 选项顺序规范 | 30% |
| computed 正确使用 | 35% |
| watch 合理使用 | 35% |

### Mixins (15%)

| 子项 | 占比 |
|------|------|
| 无命名冲突 | 40% |
| 无隐式依赖 | 30% |
| 适度使用 | 30% |

### 性能优化 (20%)

| 子项 | 占比 |
|------|------|
| v-for 优化 | 40% |
| 懒加载 | 30% |
| keep-alive | 30% |

## 相关资源

- [检查清单](vue2-checklist.md)
- [Options API 示例](examples/options-api.md)
- [Mixins 治理示例](examples/mixins.md)
- [性能优化示例](examples/performance.md)
- [安全性示例](examples/security.md)
