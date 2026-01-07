# Vue 2 进阶专项审查指南

基于 Vue 2 生态的进阶代码审查，覆盖 Vuex、@vue/composition-api、Vue 3 迁移准备等。

> 📚 **前置**: 请先阅读 [Vue 2 基础审查指南](vue2-review.md)
> ⚠️ **EOL 提醒**: Vue 2 已于 2023 年 12 月 31 日停止维护，建议规划迁移

## 进阶审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Vuex 状态管理 | 30% | Module 设计、命名空间、最佳实践 |
| Composition API | 20% | @vue/composition-api 使用 |
| Vue 3 迁移准备 | 30% | 废弃 API 检测、兼容性评估 |
| 遗留代码治理 | 20% | Mixins 重构、技术债务清理 |

---

## 一、Vuex 状态管理

### 1.1 Module 设计

```javascript
// ✅ 规范的 Module 结构
// store/modules/user.js
const state = () => ({
  user: null,
  token: '',
  loading: false,
  error: null
})

const getters = {
  isLoggedIn: (state) => !!state.user,
  fullName: (state) => state.user 
    ? `${state.user.firstName} ${state.user.lastName}` 
    : '',
  // 访问根状态
  hasPermission: (state, getters, rootState) => (permission) => {
    return rootState.permissions.list.includes(permission)
  }
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_USER(state) {
    state.user = null
    state.token = ''
    state.error = null
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await authApi.login(credentials)
      commit('SET_USER', response.user)
      commit('SET_TOKEN', response.token)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async logout({ commit, dispatch }) {
    try {
      await authApi.logout()
    } finally {
      commit('CLEAR_USER')
      // 调用其他模块的 action
      dispatch('cart/clearCart', null, { root: true })
    }
  },
  
  // 带根命名空间的 action
  async fetchUserWithPermissions({ commit, dispatch }) {
    const user = await dispatch('fetchUser')
    await dispatch('permissions/fetchPermissions', user.id, { root: true })
    return user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 1.2 命名空间最佳实践

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import product from './modules/product'

Vue.use(Vuex)

export default new Vuex.Store({
  // ✅ 根状态（尽量少用）
  state: {
    appVersion: '1.0.0',
    isOnline: true
  },
  
  mutations: {
    SET_ONLINE(state, status) {
      state.isOnline = status
    }
  },
  
  // ✅ 命名空间模块
  modules: {
    user,
    cart,
    product
  },
  
  // ✅ 严格模式（开发环境）
  strict: process.env.NODE_ENV !== 'production'
})

// ✅ 组件中使用命名空间模块
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    // 方式1：字符串路径
    ...mapState('user', ['user', 'loading']),
    ...mapGetters('user', ['isLoggedIn', 'fullName']),
    
    // 方式2：createNamespacedHelpers
    // 见下方示例
  },
  
  methods: {
    ...mapActions('user', ['login', 'logout'])
  }
}

// ✅ 使用 createNamespacedHelpers（推荐）
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapActions } = createNamespacedHelpers('user')

export default {
  computed: {
    ...mapState(['user', 'loading']),
    ...mapGetters(['isLoggedIn', 'fullName'])
  },
  
  methods: {
    ...mapActions(['login', 'logout'])
  }
}
```

### 1.3 Mutation vs Action

```javascript
// ✅ Mutation：同步、原子操作
mutations: {
  // 单一职责
  SET_USER(state, user) {
    state.user = user
  },
  
  // ❌ 不要在 mutation 中做异步操作
  FETCH_USER(state) {
    api.getUser().then(user => {
      state.user = user  // ❌ 异步修改状态
    })
  },
  
  // ❌ 不要在 mutation 中调用其他 mutation
  SET_USER_AND_TOKEN(state, { user, token }) {
    this.commit('SET_USER', user)  // ❌ 不要这样
    this.commit('SET_TOKEN', token)
  }
}

// ✅ Action：异步、组合操作
actions: {
  // 异步操作
  async fetchUser({ commit }) {
    const user = await api.getUser()
    commit('SET_USER', user)
    return user
  },
  
  // 组合多个 mutation
  async login({ commit }, credentials) {
    const { user, token } = await api.login(credentials)
    commit('SET_USER', user)
    commit('SET_TOKEN', token)
  },
  
  // 调用其他 action
  async initApp({ dispatch }) {
    await dispatch('fetchUser')
    await dispatch('fetchSettings')
  }
}
```

### 1.4 Vuex 常见问题

```javascript
// ❌ 问题1：直接修改状态
export default {
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    updateName() {
      this.user.name = 'New Name'  // ❌ 直接修改
    }
  }
}

// ✅ 解决：通过 mutation 修改
export default {
  methods: {
    ...mapMutations('user', ['SET_USER']),
    updateName() {
      this.SET_USER({ ...this.user, name: 'New Name' })
    }
  }
}

// ❌ 问题2：在 getter 中修改状态
getters: {
  processedList(state) {
    state.list.sort()  // ❌ 修改了原数组
    return state.list
  }
}

// ✅ 解决：返回新数组
getters: {
  processedList(state) {
    return [...state.list].sort()
  }
}

// ❌ 问题3：循环依赖
// moduleA.js
actions: {
  async init({ dispatch }) {
    await dispatch('moduleB/init', null, { root: true })
  }
}
// moduleB.js
actions: {
  async init({ dispatch }) {
    await dispatch('moduleA/init', null, { root: true })  // ❌ 循环
  }
}

// ✅ 解决：在根 store 中协调
// store/index.js
actions: {
  async initApp({ dispatch }) {
    await dispatch('moduleA/init')
    await dispatch('moduleB/init')
  }
}

// ❌ 问题4：过度使用 Vuex
// 组件内部状态不需要放 Vuex
export default {
  data() {
    return {
      isDropdownOpen: false,  // ✅ 组件内部状态
      formData: {}  // ✅ 表单临时数据
    }
  }
}
```

### 1.5 Vuex 持久化

```javascript
// ✅ 使用 vuex-persistedstate
import createPersistedState from 'vuex-persistedstate'

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // 只持久化部分状态
      paths: ['user.token', 'settings'],
      
      // 自定义存储
      storage: window.sessionStorage,
      
      // 过滤 mutation
      filter: (mutation) => {
        return mutation.type !== 'user/SET_LOADING'
      }
    })
  ],
  modules: {
    user,
    settings
  }
})

// ✅ 敏感数据加密
import SecureLS from 'secure-ls'

const ls = new SecureLS({ encodingType: 'aes' })

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ['user.token'],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key)
      }
    })
  ]
})
```

---

## 二、@vue/composition-api

### 2.1 基础使用

```javascript
// ✅ 安装和配置
// main.js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)

// ✅ 在组件中使用
import { 
  ref, 
  reactive, 
  computed, 
  watch, 
  onMounted, 
  onUnmounted 
} from '@vue/composition-api'

export default {
  setup(props, context) {
    // 响应式数据
    const count = ref(0)
    const user = reactive({
      name: '',
      email: ''
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    function increment() {
      count.value++
    }
    
    // 生命周期
    onMounted(() => {
      console.log('Component mounted')
    })
    
    onUnmounted(() => {
      console.log('Component unmounted')
    })
    
    // 监听
    watch(count, (newVal, oldVal) => {
      console.log(`Count changed: ${oldVal} -> ${newVal}`)
    })
    
    // 返回给模板使用
    return {
      count,
      user,
      doubleCount,
      increment
    }
  }
}
```

### 2.2 Composables 封装

```javascript
// ✅ 封装可复用逻辑
// composables/useCounter.js
import { ref, computed } from '@vue/composition-api'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}

// composables/useFetch.js
import { ref, onMounted } from '@vue/composition-api'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}

// 组件中使用
import { useCounter } from '@/composables/useCounter'
import { useFetch } from '@/composables/useFetch'

export default {
  setup() {
    const { count, increment } = useCounter(10)
    const { data: users, loading } = useFetch('/api/users')
    
    return {
      count,
      increment,
      users,
      loading
    }
  }
}
```

### 2.3 与 Vuex 配合

```javascript
// ✅ 在 setup 中使用 Vuex
import { computed } from '@vue/composition-api'
import { useStore } from '@/composables/useStore'

// composables/useStore.js
import { getCurrentInstance } from '@vue/composition-api'

export function useStore() {
  const vm = getCurrentInstance()
  if (!vm) {
    throw new Error('useStore must be called within setup()')
  }
  return vm.proxy.$store
}

// 组件中使用
export default {
  setup() {
    const store = useStore()
    
    // 访问状态
    const user = computed(() => store.state.user.user)
    const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
    
    // 调用 action
    async function login(credentials) {
      await store.dispatch('user/login', credentials)
    }
    
    // 调用 mutation
    function setLoading(status) {
      store.commit('user/SET_LOADING', status)
    }
    
    return {
      user,
      isLoggedIn,
      login,
      setLoading
    }
  }
}

// ✅ 封装 Vuex 模块为 Composable
// composables/useUserStore.js
import { computed } from '@vue/composition-api'
import { useStore } from './useStore'

export function useUserStore() {
  const store = useStore()
  
  const user = computed(() => store.state.user.user)
  const token = computed(() => store.state.user.token)
  const loading = computed(() => store.state.user.loading)
  const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
  
  function login(credentials) {
    return store.dispatch('user/login', credentials)
  }
  
  function logout() {
    return store.dispatch('user/logout')
  }
  
  return {
    user,
    token,
    loading,
    isLoggedIn,
    login,
    logout
  }
}
```

### 2.4 @vue/composition-api 限制

```javascript
// ⚠️ 与 Vue 3 的差异

// 1. 没有 <script setup>
// Vue 2 必须使用 setup() 函数

// 2. 没有 defineProps/defineEmits
// 必须使用 props 和 context.emit
export default {
  props: {
    title: String
  },
  setup(props, { emit }) {
    function handleClick() {
      emit('click')
    }
    return { handleClick }
  }
}

// 3. getCurrentInstance 返回值不同
import { getCurrentInstance } from '@vue/composition-api'

export default {
  setup() {
    const instance = getCurrentInstance()
    // Vue 2: instance.proxy 访问组件实例
    // Vue 3: instance.proxy 或 instance.ctx
    
    const router = instance.proxy.$router
    const route = instance.proxy.$route
    
    return {}
  }
}

// 4. 部分 API 不可用
// - effectScope（需要 Vue 3.2+）
// - useTemplateRef（需要 Vue 3.5+）
// - defineModel（需要 Vue 3.4+）

// 5. ref 在模板中需要 .value（某些情况）
// Vue 3 自动解包，Vue 2 可能需要手动
```

---

## 三、Vue 3 迁移准备

### 3.1 废弃 API 检测

```javascript
// ❌ Vue 3 中移除的 API

// 1. 过滤器（filters）
// Vue 2
Vue.filter('currency', (value) => `$${value.toFixed(2)}`)
// 模板中：{{ price | currency }}

// ✅ Vue 3 替代：方法或计算属性
const formatCurrency = (value) => `$${value.toFixed(2)}`
// 模板中：{{ formatCurrency(price) }}

// 2. $on/$off/$once（事件总线）
// Vue 2
const eventBus = new Vue()
eventBus.$on('event', handler)
eventBus.$emit('event', data)

// ✅ Vue 3 替代：mitt 或 tiny-emitter
import mitt from 'mitt'
const emitter = mitt()
emitter.on('event', handler)
emitter.emit('event', data)

// 3. $children
// Vue 2
this.$children.forEach(child => child.doSomething())

// ✅ Vue 3 替代：ref 或 provide/inject
// 使用 ref
<child-component ref="child" />
this.$refs.child.doSomething()

// 4. $listeners
// Vue 2
<child v-on="$listeners" />

// ✅ Vue 3：合并到 $attrs
<child v-bind="$attrs" />

// 5. $scopedSlots
// Vue 2
this.$scopedSlots.default({ item })

// ✅ Vue 3：统一使用 $slots
this.$slots.default({ item })

// 6. Vue.set / Vue.delete
// Vue 2
Vue.set(this.obj, 'newProp', value)
Vue.delete(this.obj, 'prop')

// ✅ Vue 3：直接操作（Proxy 响应式）
this.obj.newProp = value
delete this.obj.prop

// 7. 函数式组件语法
// Vue 2
export default {
  functional: true,
  render(h, { props, children }) {
    return h('div', props, children)
  }
}

// ✅ Vue 3：普通函数
const FunctionalComponent = (props, { slots }) => {
  return h('div', props, slots.default())
}
```

### 3.2 兼容性评估清单

```javascript
// 检查清单：Vue 3 迁移准备度

/**
 * 1. 依赖检查
 * 运行以下命令检查依赖兼容性
 */
// npx vue-migration-helper

/**
 * 2. 代码模式检查
 */
const migrationChecklist = {
  // 高优先级（必须修改）
  high: [
    'filters 使用',
    '$on/$off/$once 事件总线',
    '$children 访问',
    'Vue.set/Vue.delete 使用',
    'functional: true 函数式组件',
    'keyCode 修饰符（@keyup.13）',
    'v-on.native 修饰符'
  ],
  
  // 中优先级（建议修改）
  medium: [
    '$listeners 使用',
    '$scopedSlots 使用',
    'v-bind.sync 修饰符',
    'slot 特性语法',
    'v-model 自定义参数'
  ],
  
  // 低优先级（可选修改）
  low: [
    'render 函数 h 参数',
    'transition class 名称',
    'watch 数组行为'
  ]
}

// 检测脚本
// scripts/check-vue3-compatibility.js
const fs = require('fs')
const glob = require('glob')

const patterns = {
  filters: /Vue\.filter\(|filters:\s*{|\|\s*\w+\s*}}/g,
  eventBus: /\$on\(|\$off\(|\$once\(/g,
  children: /\$children/g,
  vueSet: /Vue\.set\(|this\.\$set\(/g,
  functional: /functional:\s*true/g,
  keyCode: /@keyup\.\d+|@keydown\.\d+/g,
  native: /\.native/g
}

glob('src/**/*.{vue,js}', (err, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    
    Object.entries(patterns).forEach(([name, pattern]) => {
      const matches = content.match(pattern)
      if (matches) {
        console.log(`[${name}] ${file}: ${matches.length} occurrences`)
      }
    })
  })
})
```

### 3.3 渐进式迁移策略

```javascript
// ✅ 策略1：使用 @vue/compat（兼容构建）
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')
    
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2  // Vue 2 兼容模式
            }
          }
        }
      })
  }
}

// ✅ 策略2：组件级迁移
// 新组件使用 Composition API
// 旧组件保持 Options API，逐步迁移

// ✅ 策略3：功能模块迁移
// 1. 先迁移工具函数和 Composables
// 2. 再迁移简单组件
// 3. 最后迁移复杂组件和页面

// ✅ 迁移顺序建议
const migrationOrder = [
  // 第一阶段：基础设施
  '1. 升级构建工具（Vite 或 Vue CLI 5）',
  '2. 升级 Vue Router 3 → 4',
  '3. 升级 Vuex 3 → 4（或迁移到 Pinia）',
  
  // 第二阶段：代码迁移
  '4. 移除废弃 API（filters、$on 等）',
  '5. 迁移 Mixins 到 Composables',
  '6. 更新组件语法',
  
  // 第三阶段：优化
  '7. 使用 <script setup>',
  '8. 使用 TypeScript',
  '9. 性能优化'
]
```

### 3.4 常见迁移问题

```javascript
// 问题1：v-model 变化
// Vue 2
<custom-input v-model="value" />
// 等价于
<custom-input :value="value" @input="value = $event" />

// Vue 3
<custom-input v-model="value" />
// 等价于
<custom-input :modelValue="value" @update:modelValue="value = $event" />

// ✅ 迁移方案：更新组件
// Vue 2 组件
export default {
  props: ['value'],
  methods: {
    updateValue(val) {
      this.$emit('input', val)
    }
  }
}

// Vue 3 组件
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue(val) {
      this.$emit('update:modelValue', val)
    }
  }
}

// 问题2：v-if/v-for 优先级
// Vue 2: v-for 优先级高于 v-if
// Vue 3: v-if 优先级高于 v-for

// ❌ Vue 2 代码（Vue 3 中行为不同）
<li v-for="item in items" v-if="item.active">

// ✅ 迁移方案：使用 computed 或 template
<template v-for="item in items">
  <li v-if="item.active" :key="item.id">
</template>

// 或
<li v-for="item in activeItems" :key="item.id">

// 问题3：生命周期钩子重命名
// Vue 2 → Vue 3
// beforeDestroy → beforeUnmount
// destroyed → unmounted

// 问题4：$attrs 包含 class 和 style
// Vue 2: class 和 style 不在 $attrs 中
// Vue 3: class 和 style 在 $attrs 中

// ✅ 迁移方案：显式处理
export default {
  inheritAttrs: false,
  setup(props, { attrs }) {
    // Vue 3 中 attrs 包含 class 和 style
    const { class: className, style, ...restAttrs } = attrs
    return { className, style, restAttrs }
  }
}
```

---

## 四、遗留代码治理

### 4.1 Mixins 重构

```javascript
// ❌ 问题 Mixin
// mixins/formMixin.js
export default {
  data() {
    return {
      loading: false,
      errors: {}
    }
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        await this.doSubmit()  // 隐式依赖
        this.onSuccess()  // 隐式依赖
      } catch (e) {
        this.errors = e.errors
        this.onError(e)  // 隐式依赖
      } finally {
        this.loading = false
      }
    }
  }
}

// ✅ 重构为 Composable
// composables/useForm.js
import { ref } from '@vue/composition-api'

export function useForm(options = {}) {
  const loading = ref(false)
  const errors = ref({})
  
  async function submit(submitFn, { onSuccess, onError } = {}) {
    loading.value = true
    errors.value = {}
    
    try {
      const result = await submitFn()
      onSuccess?.(result)
      return result
    } catch (e) {
      errors.value = e.errors || {}
      onError?.(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function clearErrors() {
    errors.value = {}
  }
  
  function setError(field, message) {
    errors.value[field] = message
  }
  
  return {
    loading,
    errors,
    submit,
    clearErrors,
    setError
  }
}

// 组件中使用
export default {
  setup() {
    const { loading, errors, submit } = useForm()
    
    async function handleSubmit() {
      await submit(
        () => api.createUser(formData.value),
        {
          onSuccess: () => router.push('/users'),
          onError: (e) => console.error(e)
        }
      )
    }
    
    return {
      loading,
      errors,
      handleSubmit
    }
  }
}
```

### 4.2 技术债务清理

```javascript
// ✅ 识别和清理技术债务

// 1. 未使用的代码
// 使用工具检测
// npx depcheck
// npx unimported

// 2. 重复代码
// 使用 jscpd 检测
// npx jscpd src/

// 3. 过大的组件
// scripts/check-component-size.js
const fs = require('fs')
const glob = require('glob')

const MAX_LINES = 300

glob('src/**/*.vue', (err, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8')
    const lines = content.split('\n').length
    
    if (lines > MAX_LINES) {
      console.log(`[LARGE] ${file}: ${lines} lines`)
    }
  })
})

// 4. 深层嵌套
// 检测超过 3 层的嵌套组件

// 5. 循环依赖
// 使用 madge 检测
// npx madge --circular src/

// ✅ 重构策略
const refactoringStrategy = {
  // 提取子组件
  extractComponent: `
    1. 识别可复用的 UI 片段
    2. 提取为独立组件
    3. 通过 props/events 通信
  `,
  
  // 提取 Composable
  extractComposable: `
    1. 识别可复用的逻辑
    2. 提取为 Composable
    3. 在多个组件中复用
  `,
  
  // 简化状态管理
  simplifyState: `
    1. 组件内部状态不放 Vuex
    2. 跨组件状态才用 Vuex
    3. 考虑用 provide/inject 替代部分 Vuex
  `
}
```

### 4.3 性能债务清理

```javascript
// ✅ 性能问题检测和修复

// 1. 不必要的响应式
// ❌ 大型静态数据也是响应式
export default {
  data() {
    return {
      staticConfig: { /* 大量静态配置 */ }  // ❌
    }
  }
}

// ✅ 使用 Object.freeze
export default {
  data() {
    return {
      // 响应式数据
      formData: {}
    }
  },
  created() {
    // 非响应式数据
    this.staticConfig = Object.freeze({ /* 大量静态配置 */ })
  }
}

// 2. 计算属性缓存失效
// ❌ 每次都创建新对象
computed: {
  processedList() {
    return this.list.map(item => ({
      ...item,
      processed: true
    }))
  }
}

// ✅ 使用 ID 映射
computed: {
  processedList() {
    return this.list.map(item => {
      // 复用已处理的项
      if (this.processedCache[item.id]) {
        return this.processedCache[item.id]
      }
      const processed = { ...item, processed: true }
      this.processedCache[item.id] = processed
      return processed
    })
  }
}

// 3. 事件监听器泄漏
// ❌ 忘记清理
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.timer = setInterval(this.poll, 5000)
    this.$root.$on('global-event', this.handleGlobal)
  }
  // 忘记 beforeDestroy
}

// ✅ 完整清理
export default {
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.timer = setInterval(this.poll, 5000)
    this.$root.$on('global-event', this.handleGlobal)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.timer)
    this.$root.$off('global-event', this.handleGlobal)
  }
}
```

---

## 审查检查清单

### Vuex 检查

- [ ] 模块使用命名空间
- [ ] Mutation 只做同步操作
- [ ] Action 处理异步和错误
- [ ] 不直接修改状态
- [ ] 组件内部状态不放 Vuex
- [ ] 敏感数据加密存储

### Composition API 检查

- [ ] 正确使用 @vue/composition-api
- [ ] Composables 封装合理
- [ ] 与 Vuex 配合正确
- [ ] 了解与 Vue 3 的差异

### Vue 3 迁移检查

- [ ] 检测废弃 API 使用
- [ ] 评估依赖兼容性
- [ ] 制定迁移计划
- [ ] 优先迁移高风险代码

### 技术债务检查

- [ ] 清理未使用代码
- [ ] 重构过大组件
- [ ] 消除循环依赖
- [ ] 修复性能问题
- [ ] 完善错误处理

---

## 相关资源

- [Vue 2 基础审查指南](vue2-review.md)
- [Vue 2 检查清单](vue2-checklist.md)
- [Vuex 官方文档](https://vuex.vuejs.org/)
- [@vue/composition-api](https://github.com/vuejs/composition-api)
- [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
- [Vue 3 迁移构建](https://v3-migration.vuejs.org/migration-build.html)
