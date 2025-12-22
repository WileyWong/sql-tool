# Vue 2 性能优化审查示例

> ⚠️ **Vue 2 EOL 提醒**：Vue 2 已于 2023 年 12 月 31 日停止维护。性能优化时也需考虑迁移到 Vue 3 的计划。

## filters 废弃说明

### Vue 2 filters（Vue 3 已移除）

```vue
<!-- Vue 2 支持，Vue 3 已移除 -->
<template>
  <div>
    <!-- ⚠️ filters 在 Vue 3 中已移除 -->
    <p>{{ price | currency }}</p>
    <p>{{ date | formatDate }}</p>
  </div>
</template>

<script>
export default {
  filters: {
    currency(value) {
      return '¥' + value.toFixed(2)
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString()
    }
  }
}
</script>
```

### 迁移方案：使用 computed 或 methods

```vue
<template>
  <div>
    <!-- ✅ 推荐：使用 computed 或 methods -->
    <p>{{ formattedPrice }}</p>
    <p>{{ formatDate(date) }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      price: 99.9,
      date: '2025-12-18'
    }
  },
  computed: {
    // ✅ 单值使用 computed
    formattedPrice() {
      return '¥' + this.price.toFixed(2)
    }
  },
  methods: {
    // ✅ 需要参数时使用 methods
    formatDate(value) {
      return new Date(value).toLocaleDateString()
    }
  }
}
</script>
```

### 全局 filters 迁移

```javascript
// ❌ Vue 2 全局 filter（Vue 3 不支持）
Vue.filter('currency', value => '¥' + value.toFixed(2))

// ✅ 迁移方案：全局方法或工具函数
// utils/formatters.js
export const formatters = {
  currency(value) {
    return '¥' + Number(value).toFixed(2)
  },
  date(value, format = 'YYYY-MM-DD') {
    // 格式化逻辑
  },
  truncate(value, length = 20) {
    if (!value) return ''
    return value.length > length ? value.slice(0, length) + '...' : value
  }
}

// 组件中使用
import { formatters } from '@/utils/formatters'

export default {
  methods: {
    ...formatters
  }
}
```

---

## v-for 优化

### 问题代码

```vue
<template>
  <div>
    <!-- ❌ 问题1：缺少 key -->
    <div v-for="item in items">{{ item.name }}</div>
    
    <!-- ❌ 问题2：使用 index 作为 key -->
    <div v-for="(item, index) in items" :key="index">
      {{ item.name }}
    </div>
    
    <!-- ❌ 问题3：v-if 和 v-for 同时使用 -->
    <div v-for="item in items" :key="item.id" v-if="item.active">
      {{ item.name }}
    </div>
  </div>
</template>
```

**问题分析**：
- P1 🟠 缺少 key 导致 DOM 更新效率低
- P2 🟡 使用 index 作为 key，列表变化时可能导致错误渲染
- P1 🟠 v-if 和 v-for 同时使用，每次渲染都要遍历整个列表

### 修复后代码

```vue
<template>
  <div>
    <!-- ✅ 修复1：使用唯一 ID 作为 key -->
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    
    <!-- ✅ 修复2：使用 computed 过滤 -->
    <div v-for="item in activeItems" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemList',
  data() {
    return {
      items: []
    }
  },
  computed: {
    // ✅ 使用 computed 过滤，有缓存
    activeItems() {
      return this.items.filter(item => item.active)
    }
  }
}
</script>
```

---

## 组件懒加载

### 问题代码

```javascript
// ❌ 问题：同步导入所有组件
import HeavyChart from '@/components/HeavyChart.vue'
import DataTable from '@/components/DataTable.vue'
import RichEditor from '@/components/RichEditor.vue'

export default {
  name: 'Dashboard',
  components: {
    HeavyChart,
    DataTable,
    RichEditor
  }
}
```

**问题分析**：
- P1 🟠 所有组件同步加载，增加首屏加载时间
- P2 🟡 用户可能不会使用所有组件

### 修复后代码

```javascript
export default {
  name: 'Dashboard',
  components: {
    // ✅ 异步组件
    HeavyChart: () => import('@/components/HeavyChart.vue'),
    DataTable: () => import('@/components/DataTable.vue'),
    
    // ✅ 带加载状态的异步组件
    RichEditor: () => ({
      component: import('@/components/RichEditor.vue'),
      loading: {
        template: '<div class="loading">加载中...</div>'
      },
      error: {
        template: '<div class="error">加载失败</div>'
      },
      delay: 200,    // 延迟显示 loading
      timeout: 10000 // 超时时间
    })
  }
}
```

---

## keep-alive 缓存

### 问题代码

```vue
<template>
  <div>
    <!-- ❌ 问题：频繁切换的组件未缓存 -->
    <component :is="currentTab" />
    
    <!-- ❌ 问题：所有路由组件都缓存 -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'TabContainer',
  data() {
    return {
      currentTab: 'TabA'
    }
  }
}
</script>
```

**问题分析**：
- P2 🟡 频繁切换的组件每次都重新创建
- P1 🟠 所有路由都缓存可能导致内存问题

### 修复后代码

```vue
<template>
  <div>
    <!-- ✅ 修复：缓存动态组件 -->
    <keep-alive>
      <component :is="currentTab" />
    </keep-alive>
    
    <!-- ✅ 修复：选择性缓存路由组件 -->
    <keep-alive include="UserList,OrderList" :max="10">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'TabContainer',
  data() {
    return {
      currentTab: 'TabA'
    }
  }
}
</script>
```

### keep-alive 生命周期

```javascript
export default {
  name: 'CachedComponent',
  data() {
    return {
      data: null
    }
  },
  // ✅ 组件激活时调用
  activated() {
    // 刷新数据
    this.fetchData()
  },
  // ✅ 组件停用时调用
  deactivated() {
    // 清理临时状态
    this.cleanup()
  },
  methods: {
    fetchData() { /* ... */ },
    cleanup() { /* ... */ }
  }
}
```

---

## 响应式数据优化

### 问题代码

```javascript
export default {
  name: 'DataViewer',
  data() {
    return {
      // ❌ 问题：大型静态配置放在 data 中
      chartConfig: {
        // 大量静态配置...
        options: { /* 100+ 行配置 */ }
      },
      // ❌ 问题：第三方库实例放在 data 中
      chartInstance: null
    }
  },
  mounted() {
    this.chartInstance = new Chart(this.$refs.canvas, this.chartConfig)
  }
}
```

**问题分析**：
- P2 🟡 静态配置不需要响应式，增加内存开销
- P2 🟡 第三方库实例不应该是响应式的

### 修复后代码

```javascript
// 静态配置提取到外部
const CHART_CONFIG = Object.freeze({
  options: { /* 100+ 行配置 */ }
})

export default {
  name: 'DataViewer',
  data() {
    return {
      // ✅ 只保留需要响应式的数据
      chartData: []
    }
  },
  created() {
    // ✅ 非响应式数据放在 created 中
    this.chartConfig = CHART_CONFIG
    this.chartInstance = null
  },
  mounted() {
    this.chartInstance = new Chart(this.$refs.canvas, {
      ...this.chartConfig,
      data: this.chartData
    })
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
      this.chartInstance = null
    }
  }
}
```

---

## 计算属性缓存

### 问题代码

```vue
<template>
  <div>
    <!-- ❌ 问题：模板中调用方法 -->
    <p>总价: {{ calculateTotal() }}</p>
    <p>折扣: {{ calculateDiscount() }}</p>
    <p>税费: {{ calculateTax() }}</p>
    <p>最终价格: {{ calculateFinal() }}</p>
    
    <ul>
      <li v-for="item in items" :key="item.id">
        <!-- ❌ 问题：每个 item 都调用方法 -->
        {{ formatPrice(item.price) }} - {{ getStatusText(item.status) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PriceCalculator',
  data() {
    return {
      items: [],
      discountRate: 0.9,
      taxRate: 0.1
    }
  },
  methods: {
    calculateTotal() {
      return this.items.reduce((sum, item) => sum + item.price, 0)
    },
    calculateDiscount() {
      return this.calculateTotal() * (1 - this.discountRate)
    },
    calculateTax() {
      return (this.calculateTotal() - this.calculateDiscount()) * this.taxRate
    },
    calculateFinal() {
      return this.calculateTotal() - this.calculateDiscount() + this.calculateTax()
    },
    formatPrice(price) {
      return `¥${price.toFixed(2)}`
    },
    getStatusText(status) {
      const map = { 1: '待付款', 2: '已付款', 3: '已发货' }
      return map[status] || '未知'
    }
  }
}
</script>
```

**问题分析**：
- P1 🟠 `calculateTotal()` 等方法每次渲染都重新计算
- P2 🟡 方法之间有依赖，导致重复计算

### 修复后代码

```vue
<template>
  <div>
    <!-- ✅ 修复：使用 computed -->
    <p>总价: {{ total }}</p>
    <p>折扣: {{ discount }}</p>
    <p>税费: {{ tax }}</p>
    <p>最终价格: {{ finalPrice }}</p>
    
    <ul>
      <li v-for="item in formattedItems" :key="item.id">
        <!-- ✅ 修复：预处理数据 -->
        {{ item.formattedPrice }} - {{ item.statusText }}
      </li>
    </ul>
  </div>
</template>

<script>
const STATUS_MAP = { 1: '待付款', 2: '已付款', 3: '已发货' }

export default {
  name: 'PriceCalculator',
  data() {
    return {
      items: [],
      discountRate: 0.9,
      taxRate: 0.1
    }
  },
  computed: {
    // ✅ 使用 computed，有缓存
    total() {
      return this.items.reduce((sum, item) => sum + item.price, 0)
    },
    discount() {
      return this.total * (1 - this.discountRate)
    },
    tax() {
      return (this.total - this.discount) * this.taxRate
    },
    finalPrice() {
      return this.total - this.discount + this.tax
    },
    // ✅ 预处理列表数据
    formattedItems() {
      return this.items.map(item => ({
        ...item,
        formattedPrice: `¥${item.price.toFixed(2)}`,
        statusText: STATUS_MAP[item.status] || '未知'
      }))
    }
  }
}
</script>
```

---

## 事件监听优化

### 问题代码

```javascript
export default {
  name: 'ScrollHandler',
  mounted() {
    // ❌ 问题：高频事件未节流
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleScroll() {
      // 每次滚动都执行，可能每秒触发几十次
      this.updatePosition()
    },
    handleResize() {
      // 每次 resize 都执行
      this.recalculateLayout()
    }
  }
}
```

**问题分析**：
- P1 🟠 scroll/resize 是高频事件，未节流会导致性能问题
- P0 🔴 事件监听未清理

### 修复后代码

```javascript
import { throttle, debounce } from 'lodash-es'

export default {
  name: 'ScrollHandler',
  created() {
    // ✅ 创建节流/防抖函数
    this.throttledScroll = throttle(this.handleScroll, 100)
    this.debouncedResize = debounce(this.handleResize, 200)
  },
  mounted() {
    // ✅ 使用节流/防抖后的函数
    window.addEventListener('scroll', this.throttledScroll)
    window.addEventListener('resize', this.debouncedResize)
  },
  beforeDestroy() {
    // ✅ 清理事件监听
    window.removeEventListener('scroll', this.throttledScroll)
    window.removeEventListener('resize', this.debouncedResize)
    
    // ✅ 取消待执行的节流/防抖
    this.throttledScroll.cancel()
    this.debouncedResize.cancel()
  },
  methods: {
    handleScroll() {
      this.updatePosition()
    },
    handleResize() {
      this.recalculateLayout()
    }
  }
}
```

---

## Render Functions 优化

### 何时使用 Render Functions

```javascript
// ✅ 适用场景：高度动态的组件
export default {
  name: 'DynamicHeading',
  props: {
    level: {
      type: Number,
      required: true,
      validator: v => v >= 1 && v <= 6
    }
  },
  render(h) {
    // 动态创建 h1-h6 标签
    return h(
      'h' + this.level,
      this.$slots.default
    )
  }
}

// 模板方式需要大量 v-if（不推荐）
// <h1 v-if="level === 1">...</h1>
// <h2 v-else-if="level === 2">...</h2>
// ...
```

### Render Function 性能优化

```javascript
export default {
  name: 'OptimizedList',
  props: {
    items: Array,
    columns: Array
  },
  render(h) {
    // ✅ 避免在 render 中创建新函数
    const { items, columns, handleClick } = this
    
    return h('table', [
      h('thead', [
        h('tr', columns.map(col => 
          h('th', { key: col.key }, col.title)
        ))
      ]),
      h('tbody', items.map(item =>
        h('tr', { key: item.id }, columns.map(col =>
          h('td', { key: col.key }, [
            col.render 
              ? col.render(h, item[col.key], item)
              : item[col.key]
          ])
        ))
      ))
    ])
  },
  methods: {
    handleClick(item) {
      this.$emit('click', item)
    }
  }
}
```

### JSX 语法（需要 babel 插件）

```javascript
// babel.config.js 需要配置 @vue/babel-preset-jsx
export default {
  name: 'JsxComponent',
  props: {
    user: Object
  },
  render() {
    const { user } = this
    
    return (
      <div class="user-card">
        <img src={user.avatar} alt={user.name} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button onClick={() => this.$emit('edit', user)}>
          编辑
        </button>
      </div>
    )
  }
}
```

---

## Functional Components（无状态组件）

### 问题代码

```javascript
// ❌ 简单展示组件使用完整组件
export default {
  name: 'UserAvatar',
  props: {
    src: String,
    size: {
      type: Number,
      default: 40
    }
  },
  template: `
    <img 
      :src="src" 
      :style="{ width: size + 'px', height: size + 'px' }"
      class="avatar"
    />
  `
}
```

### 修复后代码：Functional Component

```javascript
// ✅ 使用 functional component（无状态、无实例）
export default {
  name: 'UserAvatar',
  functional: true,  // 标记为 functional
  props: {
    src: String,
    size: {
      type: Number,
      default: 40
    }
  },
  render(h, context) {
    const { props, data } = context
    
    return h('img', {
      ...data,  // 传递 class、style 等
      attrs: {
        src: props.src
      },
      style: {
        width: props.size + 'px',
        height: props.size + 'px'
      },
      class: ['avatar', data.class]
    })
  }
}

// 或使用 .vue 文件
// UserAvatar.vue
// <template functional>
//   <img 
//     :src="props.src"
//     :style="{ width: props.size + 'px', height: props.size + 'px' }"
//     :class="['avatar', data.class]"
//   />
// </template>
```

### Functional Component 适用场景

```javascript
// ✅ 适用场景：
// 1. 纯展示组件（无状态）
// 2. 高频渲染的列表项
// 3. 包装组件

// 示例：列表项组件
export default {
  name: 'ListItem',
  functional: true,
  props: {
    item: Object,
    index: Number
  },
  render(h, { props, listeners }) {
    const { item, index } = props
    
    return h('li', {
      class: ['list-item', { even: index % 2 === 0 }],
      on: {
        click: () => listeners.click && listeners.click(item)
      }
    }, [
      h('span', { class: 'index' }, index + 1),
      h('span', { class: 'name' }, item.name),
      h('span', { class: 'value' }, item.value)
    ])
  }
}

// ⚠️ 注意：Vue 3 中所有组件默认就是 functional 性能
// 迁移时可移除 functional: true
```

---

## 大数据列表优化

### 问题代码

```vue
<template>
  <!-- ❌ 问题：一次性渲染大量数据 -->
  <div class="list">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []  // 可能有 10000+ 条数据
    }
  },
  async mounted() {
    this.items = await api.getAllItems()  // 一次性加载全部
  }
}
</script>
```

### 修复后代码：虚拟滚动

```vue
<template>
  <!-- ✅ 使用虚拟滚动（vue-virtual-scroller） -->
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  components: { RecycleScroller },
  data() {
    return {
      items: []
    }
  },
  async mounted() {
    this.items = await api.getAllItems()
  }
}
</script>

<style>
.scroller {
  height: 400px;
}
.item {
  height: 50px;
  line-height: 50px;
}
</style>
```

### 分页加载方案

```javascript
export default {
  data() {
    return {
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      finished: false
    }
  },
  methods: {
    // ✅ 分页加载
    async loadMore() {
      if (this.loading || this.finished) return
      
      this.loading = true
      try {
        const { data, total } = await api.getItems({
          page: this.page,
          pageSize: this.pageSize
        })
        
        this.items.push(...data)
        this.total = total
        this.page++
        
        if (this.items.length >= total) {
          this.finished = true
        }
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.loadMore()
  }
}
```

---

## 审查结果模板

```markdown
## Vue 2 性能审查结果

### 审查信息
- **组件**: Dashboard.vue
- **审查级别**: 专业审查
- **审查时间**: 2025-12-18

### 性能指标

| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| 首屏加载 | 3.2s | < 2s | ❌ |
| 组件渲染 | 120ms | < 50ms | ❌ |
| 内存占用 | 85MB | < 50MB | ❌ |

### 问题清单

| 优先级 | 问题 | 位置 | 影响 | 修复建议 |
|--------|------|------|------|---------|
| P0 🔴 | 事件监听未清理 | mounted | 内存泄漏 | beforeDestroy 清理 |
| P1 🟠 | v-for 缺少 key | template | 渲染效率 | 添加唯一 key |
| P1 🟠 | 大组件同步加载 | components | 首屏时间 | 异步组件 |
| P1 🟠 | 高频事件未节流 | scroll | CPU 占用 | throttle/debounce |
| P2 🟡 | 静态数据响应式 | data | 内存占用 | Object.freeze |
| P2 🟡 | 模板调用方法 | template | 重复计算 | 改用 computed |

### 优化建议

1. **首屏优化**
   - 路由懒加载
   - 组件异步加载
   - 图片懒加载

2. **运行时优化**
   - 使用 computed 替代 methods
   - 高频事件节流/防抖
   - keep-alive 缓存

3. **内存优化**
   - 静态数据 Object.freeze
   - 非响应式数据不放 data
   - 及时清理事件监听和定时器
```
