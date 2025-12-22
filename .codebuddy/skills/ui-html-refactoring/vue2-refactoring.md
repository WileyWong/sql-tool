# Vue 2.x 重构指南

## 概述

Vue 2.x 项目重构指南，聚焦 Options API 优化、组件设计、Mixins 治理和性能提升。

## 重构优先级

| 优先级 | 重构项 | 收益 |
|--------|--------|------|
| P0 | 消除巨型组件 | 可维护性 |
| P0 | 治理 Mixins 滥用 | 可读性 |
| P1 | 优化响应式数据 | 性能 |
| P1 | 规范组件通信 | 可维护性 |
| P2 | 统一代码风格 | 一致性 |

## Options API 重构

### 组件结构规范

```javascript
export default {
  name: 'UserProfile',  // 必须：组件名
  
  // 1. 副作用（触发组件外的影响）
  mixins: [],
  extends: undefined,
  
  // 2. 接口（组件的输入输出）
  props: {},
  emits: [],  // Vue 2.4+
  
  // 3. 本地状态
  data() {
    return {}
  },
  computed: {},
  
  // 4. 事件（响应式事件的回调）
  watch: {},
  
  // 5. 生命周期钩子（按调用顺序）
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  
  // 6. 非响应式属性
  methods: {}
}
```

### 拆分巨型组件

**问题识别**：组件超过 300 行、data/methods 超过 10 个属性

**重构前**：
```javascript
export default {
  data() {
    return {
      // 用户相关
      userName: '',
      userEmail: '',
      userAvatar: '',
      // 订单相关
      orderList: [],
      orderTotal: 0,
      // 筛选相关
      filterStatus: 'all',
      filterDate: null
    }
  },
  methods: {
    fetchUser() { /* ... */ },
    updateUser() { /* ... */ },
    fetchOrders() { /* ... */ },
    filterOrders() { /* ... */ },
    calculateTotal() { /* ... */ }
  }
}
```

**重构后**：拆分为多个专注组件
```javascript
// UserInfo.vue - 用户信息组件
export default {
  name: 'UserInfo',
  props: ['userId'],
  data() {
    return {
      userName: '',
      userEmail: '',
      userAvatar: ''
    }
  },
  methods: {
    async fetchUser() { /* ... */ },
    async updateUser() { /* ... */ }
  }
}

// OrderList.vue - 订单列表组件
export default {
  name: 'OrderList',
  props: ['userId'],
  data() {
    return {
      orderList: [],
      filterStatus: 'all',
      filterDate: null
    }
  },
  computed: {
    filteredOrders() {
      return this.orderList.filter(/* ... */)
    },
    orderTotal() {
      return this.filteredOrders.reduce((sum, o) => sum + o.amount, 0)
    }
  }
}
```

### 优化 computed 属性

```javascript
// 重构前：methods 中计算
methods: {
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
// 模板中：{{ getFullName() }}

// 重构后：computed 缓存
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
// 模板中：{{ fullName }}
```

### 优化 watch 使用

```javascript
// 重构前：深度监听整个对象
watch: {
  user: {
    handler(newVal) {
      this.updateProfile(newVal)
    },
    deep: true  // 性能问题：任何属性变化都触发
  }
}

// 重构后：精确监听需要的属性
watch: {
  'user.profile.name'(newName) {
    this.updateName(newName)
  },
  'user.profile.email'(newEmail) {
    this.updateEmail(newEmail)
  }
}
```

## Mixins 治理

### 问题识别

| 问题 | 表现 |
|------|------|
| 命名冲突 | 多个 mixin 定义同名属性/方法 |
| 隐式依赖 | mixin 依赖组件的 data/methods |
| 难以追踪 | 不知道属性来自哪个 mixin |
| 嵌套 mixin | mixin 引用其他 mixin |

### 重构策略

**策略1：转换为工具函数**

```javascript
// 重构前：mixin
const formMixin = {
  data() {
    return { loading: false, error: null }
  },
  methods: {
    async submitForm(data) {
      this.loading = true
      try {
        await this.apiCall(data)
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
}

// 重构后：工具函数 + 组件内状态
// utils/form.js
export async function submitWithLoading(apiCall, data) {
  try {
    return { data: await apiCall(data), error: null }
  } catch (e) {
    return { data: null, error: e.message }
  }
}

// 组件中使用
import { submitWithLoading } from '@/utils/form'

export default {
  data() {
    return { loading: false, error: null }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      const { data, error } = await submitWithLoading(this.api, this.formData)
      this.error = error
      this.loading = false
    }
  }
}
```

**策略2：转换为高阶组件**

```javascript
// 重构前：mixin 提供通用功能
const paginationMixin = {
  data() {
    return { page: 1, pageSize: 10, total: 0 }
  },
  methods: {
    changePage(page) { this.page = page }
  }
}

// 重构后：高阶组件
// components/WithPagination.vue
export default {
  name: 'WithPagination',
  props: ['total', 'pageSize'],
  data() {
    return { currentPage: 1 }
  },
  methods: {
    changePage(page) {
      this.currentPage = page
      this.$emit('page-change', page)
    }
  },
  render() {
    return this.$scopedSlots.default({
      page: this.currentPage,
      changePage: this.changePage
    })
  }
}

// 使用
<WithPagination :total="100" @page-change="fetchData">
  <template #default="{ page, changePage }">
    <DataList :page="page" />
    <Pagination :current="page" @change="changePage" />
  </template>
</WithPagination>
```

## 组件通信优化

### Props 规范化

```javascript
// 重构前：缺少验证
props: ['user', 'onUpdate']

// 重构后：完整定义
props: {
  user: {
    type: Object,
    required: true,
    validator(value) {
      return value.id && value.name
    }
  },
  readonly: {
    type: Boolean,
    default: false
  }
}
```

### 事件规范化

```javascript
// 重构前：直接修改 prop
methods: {
  updateName(name) {
    this.user.name = name  // 错误：修改 prop
  }
}

// 重构后：通过事件通知父组件
methods: {
  updateName(name) {
    this.$emit('update:user', { ...this.user, name })
  }
}

// 父组件使用 .sync 修饰符
<UserEditor :user.sync="currentUser" />
```

### 跨层级通信

```javascript
// 重构前：多层 props 传递
// Grandparent → Parent → Child

// 重构后：provide/inject
// Grandparent.vue
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  }
}

// Child.vue（任意层级）
export default {
  inject: ['theme', 'updateTheme'],
  methods: {
    changeTheme() {
      this.updateTheme('dark')
    }
  }
}
```

## 响应式优化

### 避免响应式陷阱

```javascript
// 问题1：新增属性不响应
this.user.newProp = 'value'  // 不会触发更新

// 解决：使用 Vue.set
this.$set(this.user, 'newProp', 'value')

// 问题2：数组索引赋值不响应
this.items[0] = newItem  // 不会触发更新

// 解决：使用 Vue.set 或 splice
this.$set(this.items, 0, newItem)
// 或
this.items.splice(0, 1, newItem)
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
    // 不需要响应式的数据（大型静态数据）
    this.chartInstance = null
    this.staticConfig = Object.freeze({
      options: { /* 大量配置 */ }
    })
  }
}
```

## 性能优化

### 列表渲染优化

```vue
<!-- 重构前：缺少 key -->
<li v-for="item in items">{{ item.name }}</li>

<!-- 重构后：使用唯一 key -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- 优化：避免 v-if 与 v-for 同时使用 -->
<!-- 重构前 -->
<li v-for="item in items" v-if="item.active">{{ item.name }}</li>

<!-- 重构后：使用 computed 过滤 -->
<li v-for="item in activeItems" :key="item.id">{{ item.name }}</li>

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
// 重构前：同步导入
import HeavyChart from './HeavyChart.vue'

// 重构后：异步组件
const HeavyChart = () => import('./HeavyChart.vue')

// 带加载状态
const HeavyChart = () => ({
  component: import('./HeavyChart.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### keep-alive 缓存

```vue
<!-- 缓存动态组件 -->
<keep-alive>
  <component :is="currentTab" />
</keep-alive>

<!-- 条件缓存 -->
<keep-alive include="UserList,OrderList" :max="10">
  <router-view />
</keep-alive>
```

## 重构检查清单

### 组件结构
- [ ] 组件行数 ≤ 300
- [ ] data 属性 ≤ 10 个
- [ ] methods 方法 ≤ 10 个
- [ ] 组件有明确的 name 属性

### Mixins
- [ ] 无命名冲突
- [ ] 无隐式依赖
- [ ] 无嵌套 mixin
- [ ] 考虑迁移为工具函数

### Props/Events
- [ ] Props 有类型和默认值
- [ ] 无直接修改 Props
- [ ] 事件命名使用 kebab-case
- [ ] 复杂数据使用 .sync 或 v-model

### 响应式
- [ ] 新增属性使用 $set
- [ ] 大型静态数据使用 Object.freeze
- [ ] 非响应式数据不放 data

### 性能
- [ ] v-for 有唯一 key
- [ ] v-if 和 v-for 不同时使用
- [ ] 大组件使用异步加载
- [ ] 合理使用 keep-alive
