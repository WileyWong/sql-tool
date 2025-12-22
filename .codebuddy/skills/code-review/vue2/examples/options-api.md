# Vue 2 Options API 审查示例

## 组件结构规范

### 问题代码

```javascript
// ❌ 问题：选项顺序混乱、缺少 name、data 不是函数
export default {
  methods: {
    fetchData() { /* ... */ }
  },
  data: {  // 错误：应该是函数
    items: [],
    loading: false
  },
  computed: {
    itemCount() {
      return this.items.length
    }
  },
  props: ['userId'],
  mounted() {
    this.fetchData()
  }
}
```

**问题分析**：
- P1 🟠 缺少组件 name 属性
- P1 🟠 data 是对象而非函数
- P2 🟡 Options 顺序不规范
- P2 🟡 Props 缺少类型定义

### 修复后代码

```javascript
// ✅ 修复：规范的组件结构
export default {
  name: 'UserList',
  
  props: {
    userId: {
      type: [Number, String],
      required: true
    }
  },
  
  data() {
    return {
      items: [],
      loading: false
    }
  },
  
  computed: {
    itemCount() {
      return this.items.length
    }
  },
  
  mounted() {
    this.fetchData()
  },
  
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const response = await api.getItems(this.userId)
        this.items = response.data
      } finally {
        this.loading = false
      }
    }
  }
}
```

---

## computed vs methods

### 问题代码

```vue
<template>
  <div>
    <p>总价: {{ getTotal() }}</p>
    <p>折扣价: {{ getDiscountPrice() }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ formatPrice(item.price) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PriceList',
  data() {
    return {
      items: [],
      discount: 0.9
    }
  },
  methods: {
    // ❌ 问题：派生状态用 methods，每次渲染都重新计算
    getTotal() {
      return this.items.reduce((sum, item) => sum + item.price, 0)
    },
    getDiscountPrice() {
      return this.getTotal() * this.discount
    },
    formatPrice(price) {
      return `¥${price.toFixed(2)}`
    }
  }
}
</script>
```

**问题分析**：
- P2 🟡 `getTotal()` 应该用 computed，避免重复计算
- P2 🟡 `getDiscountPrice()` 应该用 computed
- ✅ `formatPrice()` 用 methods 正确（需要参数）

### 修复后代码

```vue
<template>
  <div>
    <p>总价: {{ total }}</p>
    <p>折扣价: {{ discountPrice }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ formatPrice(item.price) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PriceList',
  data() {
    return {
      items: [],
      discount: 0.9
    }
  },
  computed: {
    // ✅ 修复：派生状态用 computed，有缓存
    total() {
      return this.items.reduce((sum, item) => sum + item.price, 0)
    },
    discountPrice() {
      return this.total * this.discount
    }
  },
  methods: {
    // ✅ 需要参数的格式化函数用 methods
    formatPrice(price) {
      return `¥${price.toFixed(2)}`
    }
  }
}
</script>
```

---

## watch 使用

### 问题代码

```javascript
export default {
  name: 'UserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        profile: {
          avatar: '',
          bio: ''
        }
      },
      formValid: false
    }
  },
  watch: {
    // ❌ 问题：深度监听整个对象，性能开销大
    user: {
      handler(newVal) {
        this.validateForm()
      },
      deep: true
    },
    // ❌ 问题：用 watch 实现派生状态
    'user.name': function(name) {
      this.formValid = name.length > 0 && this.user.email.length > 0
    },
    'user.email': function(email) {
      this.formValid = this.user.name.length > 0 && email.length > 0
    }
  },
  methods: {
    validateForm() {
      // 验证逻辑
    }
  }
}
```

**问题分析**：
- P1 🟠 深度监听整个 user 对象，任何属性变化都触发
- P2 🟡 用 watch 实现 formValid，应该用 computed

### 修复后代码

```javascript
export default {
  name: 'UserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        profile: {
          avatar: '',
          bio: ''
        }
      }
    }
  },
  computed: {
    // ✅ 修复：派生状态用 computed
    formValid() {
      return this.user.name.length > 0 && this.user.email.length > 0
    }
  },
  watch: {
    // ✅ 修复：精确监听需要的属性
    'user.name'(newName) {
      this.onNameChange(newName)
    },
    'user.email'(newEmail) {
      this.onEmailChange(newEmail)
    },
    // ✅ 如果确实需要监听 profile 变化
    'user.profile': {
      handler(newProfile) {
        this.onProfileChange(newProfile)
      },
      deep: true  // 只对 profile 深度监听
    }
  },
  methods: {
    onNameChange(name) {
      // 名称变化时的副作用
    },
    onEmailChange(email) {
      // 邮箱变化时的副作用
    },
    onProfileChange(profile) {
      // 资料变化时的副作用
    }
  }
}
```

---

## Props 定义

### 问题代码

```javascript
export default {
  name: 'UserCard',
  // ❌ 问题：简单数组定义，无类型、无默认值
  props: ['user', 'showAvatar', 'onEdit', 'config'],
  methods: {
    handleEdit() {
      // ❌ 问题：直接调用 prop 函数
      this.onEdit(this.user)
    }
  }
}
```

**问题分析**：
- P1 🟠 Props 缺少类型定义
- P2 🟡 缺少必填标记和默认值
- P2 🟡 使用函数 prop 而非事件

### 修复后代码

```javascript
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
      validator(value) {
        return value.id && value.name
      }
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    config: {
      type: Object,
      // ✅ 对象默认值必须用工厂函数
      default: () => ({
        theme: 'light',
        size: 'medium'
      })
    }
  },
  methods: {
    handleEdit() {
      // ✅ 修复：使用事件而非函数 prop
      this.$emit('edit', this.user)
    }
  }
}
```

---

## 生命周期清理

### 问题代码

```javascript
export default {
  name: 'LiveChart',
  data() {
    return {
      chartData: []
    }
  },
  mounted() {
    // ❌ 问题：事件监听未清理
    window.addEventListener('resize', this.handleResize)
    
    // ❌ 问题：定时器未清理
    setInterval(this.fetchData, 5000)
    
    // ❌ 问题：第三方库实例未销毁
    this.chart = new Chart(this.$refs.canvas, {})
    
    // ❌ 问题：Event Bus 未清理
    this.$root.$on('data-update', this.handleUpdate)
  },
  methods: {
    handleResize() { /* ... */ },
    fetchData() { /* ... */ },
    handleUpdate() { /* ... */ }
  }
}
```

**问题分析**：
- P0 🔴 事件监听未清理，导致内存泄漏
- P0 🔴 定时器未清理，组件销毁后继续执行
- P0 🔴 Event Bus 未清理，导致内存泄漏
- P1 🟠 第三方库实例未销毁

### 修复后代码

```javascript
export default {
  name: 'LiveChart',
  data() {
    return {
      chartData: []
    }
  },
  mounted() {
    // ✅ 修复：保存引用以便清理
    window.addEventListener('resize', this.handleResize)
    
    // ✅ 修复：保存定时器 ID
    this.timer = setInterval(this.fetchData, 5000)
    
    // ✅ 修复：保存实例引用
    this.chart = new Chart(this.$refs.canvas, {})
    
    // ✅ 修复：Event Bus 事件
    this.$root.$on('data-update', this.handleUpdate)
  },
  // ✅ 修复：在 beforeDestroy 中清理所有资源
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener('resize', this.handleResize)
    
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    // 销毁第三方库实例
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
    
    // 清理 Event Bus
    this.$root.$off('data-update', this.handleUpdate)
  },
  methods: {
    handleResize() { /* ... */ },
    fetchData() { /* ... */ },
    handleUpdate() { /* ... */ }
  }
}
```

---

## Vue.nextTick 使用

### 问题代码

```javascript
export default {
  name: 'InputFocus',
  data() {
    return {
      showInput: false,
      message: ''
    }
  },
  methods: {
    // ❌ 问题：DOM 更新时机错误
    showAndFocus() {
      this.showInput = true
      this.$refs.input.focus()  // 错误：DOM 还未更新
    },
    
    // ❌ 问题：获取更新后的 DOM 尺寸
    updateAndMeasure() {
      this.message = 'Updated content with more text'
      const height = this.$refs.content.offsetHeight  // 错误：获取的是旧高度
      console.log('Height:', height)
    }
  }
}
```

**问题分析**：
- P1 🟠 数据更新后立即操作 DOM，此时 DOM 还未更新
- P1 🟠 获取的是更新前的 DOM 尺寸

### 修复后代码

```javascript
export default {
  name: 'InputFocus',
  data() {
    return {
      showInput: false,
      message: ''
    }
  },
  methods: {
    // ✅ 修复：使用 $nextTick 等待 DOM 更新
    showAndFocus() {
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.input.focus()  // DOM 已更新
      })
    },
    
    // ✅ 修复：使用 async/await 语法
    async updateAndMeasure() {
      this.message = 'Updated content with more text'
      await this.$nextTick()
      const height = this.$refs.content.offsetHeight  // 获取更新后的高度
      console.log('Height:', height)
    },
    
    // ✅ 批量更新后获取 DOM
    async batchUpdate() {
      this.item1 = 'value1'
      this.item2 = 'value2'
      this.item3 = 'value3'
      
      // 一次 nextTick 等待所有更新
      await this.$nextTick()
      
      // 现在可以安全地操作 DOM
      this.measureAllItems()
    }
  }
}
```

---

## errorCaptured 错误边界

### 问题代码

```javascript
// ❌ 问题：子组件错误导致整个应用崩溃
export default {
  name: 'ParentComponent',
  components: {
    ChildComponent  // 可能抛出错误的子组件
  }
}
```

**问题分析**：
- P1 🟠 子组件错误会向上传播，可能导致整个应用崩溃
- P2 🟡 用户看到白屏，体验差

### 修复后代码

```javascript
// ✅ 修复：使用 errorCaptured 作为错误边界
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      errorMessage: ''
    }
  },
  // ✅ 捕获子组件错误
  errorCaptured(err, vm, info) {
    this.hasError = true
    this.errorMessage = err.message
    
    // 记录错误日志
    console.error('Error captured:', err)
    console.error('Component:', vm.$options.name)
    console.error('Info:', info)
    
    // 上报错误
    this.reportError(err, vm, info)
    
    // 返回 false 阻止错误继续向上传播
    return false
  },
  methods: {
    reportError(err, vm, info) {
      // 发送到错误监控服务
    },
    retry() {
      this.hasError = false
      this.errorMessage = ''
    }
  },
  render(h) {
    if (this.hasError) {
      // 显示降级 UI
      return h('div', { class: 'error-fallback' }, [
        h('p', '组件加载出错'),
        h('p', this.errorMessage),
        h('button', { on: { click: this.retry } }, '重试')
      ])
    }
    // 正常渲染子组件
    return this.$slots.default[0]
  }
}

// 使用错误边界包裹可能出错的组件
// <ErrorBoundary>
//   <RiskyComponent />
// </ErrorBoundary>
```

---

## 生命周期边界情况

### 问题代码

```javascript
export default {
  name: 'LifecycleDemo',
  // ❌ 问题：beforeCreate 中访问 data
  beforeCreate() {
    console.log(this.message)  // undefined！
    this.fetchData()  // 方法不存在！
  },
  data() {
    return {
      message: 'Hello'
    }
  },
  methods: {
    fetchData() { /* ... */ }
  }
}
```

**问题分析**：
- P1 🟠 beforeCreate 中 data 和 methods 还不可用
- P2 🟡 不了解生命周期顺序导致的问题

### 修复后代码

```javascript
export default {
  name: 'LifecycleDemo',
  
  // beforeCreate: data/methods 不可用
  beforeCreate() {
    // 只能访问 this.$options
    console.log('Component options:', this.$options.name)
  },
  
  // ✅ created: data/methods 可用，但 $el 不可用
  created() {
    console.log(this.message)  // 'Hello' ✅
    this.fetchData()  // ✅ 方法可用
    
    // ❌ 但 DOM 还不存在
    // console.log(this.$el)  // undefined
    // console.log(this.$refs.input)  // undefined
  },
  
  // ✅ mounted: DOM 可用
  mounted() {
    console.log(this.$el)  // DOM 元素 ✅
    console.log(this.$refs.input)  // ref 元素 ✅
    
    // 可以安全地操作 DOM
    this.$refs.input.focus()
  },
  
  data() {
    return {
      message: 'Hello'
    }
  },
  
  methods: {
    fetchData() {
      // API 调用
    }
  }
}

// ⚠️ 父子组件生命周期顺序
// 创建阶段（由外向内）：
//   父 beforeCreate → 父 created → 父 beforeMount
//   → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
//   → 父 mounted
//
// 更新阶段：
//   父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
//
// 销毁阶段（由内向外）：
//   父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed
```

---

## 审查结果模板

```markdown
## Vue 2 Options API 审查结果

### 审查信息
- **组件**: UserList.vue
- **审查级别**: 标准审查
- **审查时间**: 2025-12-18

### 评分

| 维度 | 得分 | 说明 |
|------|------|------|
| 组件设计 | 75 | 组件较大，建议拆分 |
| Options API | 85 | 选项顺序规范 |
| Mixins | 90 | 无滥用 |
| 性能优化 | 70 | 缺少懒加载 |
| 安全性 | 80 | 需加强输入验证 |
| 可维护性 | 75 | 部分方法缺少注释 |
| **综合得分** | **78** | B级 |

### 问题清单

| 优先级 | 问题 | 位置 | 修复建议 |
|--------|------|------|---------|
| P1 🟠 | 事件监听未清理 | mounted | 在 beforeDestroy 中清理 |
| P2 🟡 | 派生状态用 methods | getTotal() | 改为 computed |
| P2 🟡 | Props 缺少类型 | props | 添加类型定义 |
| P3 🟢 | 方法缺少注释 | methods | 添加 JSDoc 注释 |
```
