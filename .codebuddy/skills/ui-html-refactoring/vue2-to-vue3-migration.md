# Vue 2 → Vue 3 迁移指南

## 概述

Vue 2.x 到 Vue 3.x 的迁移指南，包含破坏性变更处理、渐进式迁移策略和常见问题解决方案。

## 迁移策略

### 渐进式迁移路径

```
阶段1：准备工作
├── 升级 Vue 2.7（获得 Composition API）
├── 安装 @vue/compat 兼容层
└── 修复已知废弃警告

阶段2：核心迁移
├── 升级到 Vue 3 + @vue/compat
├── 逐个处理兼容性警告
└── 移除 @vue/compat

阶段3：优化重构
├── 迁移到 <script setup>
├── 提取 Composables
└── 采用 Vue 3 新特性
```

### 迁移优先级

| 优先级 | 变更类型 | 说明 |
|--------|----------|------|
| P0 | 破坏性变更 | 必须处理，否则无法运行 |
| P1 | 废弃特性 | 仍可运行但有警告 |
| P2 | 推荐改进 | 可选，提升代码质量 |

## 破坏性变更处理

### 全局 API 变更

```javascript
// Vue 2
import Vue from 'vue'
Vue.component('MyComponent', { /* ... */ })
Vue.directive('focus', { /* ... */ })
Vue.mixin({ /* ... */ })
Vue.use(VueRouter)
new Vue({ render: h => h(App) }).$mount('#app')

// Vue 3
import { createApp } from 'vue'
const app = createApp(App)
app.component('MyComponent', { /* ... */ })
app.directive('focus', { /* ... */ })
app.mixin({ /* ... */ })
app.use(router)
app.mount('#app')
```

### v-model 变更

```vue
<!-- Vue 2 -->
<ChildComponent v-model="value" />
<!-- 等价于 -->
<ChildComponent :value="value" @input="value = $event" />

<!-- Vue 3 -->
<ChildComponent v-model="value" />
<!-- 等价于 -->
<ChildComponent :modelValue="value" @update:modelValue="value = $event" />

<!-- Vue 3 子组件 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(newValue) {
  emit('update:modelValue', newValue)
}
</script>
```

### .sync 修饰符移除

```vue
<!-- Vue 2 -->
<ChildComponent :title.sync="pageTitle" />

<!-- Vue 3：使用 v-model -->
<ChildComponent v-model:title="pageTitle" />

<!-- Vue 3 子组件 -->
<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['update:title'])

function updateTitle(newTitle) {
  emit('update:title', newTitle)
}
</script>
```

### v-if/v-for 优先级

```vue
<!-- Vue 2：v-for 优先级更高 -->
<li v-for="item in items" v-if="item.active">{{ item.name }}</li>

<!-- Vue 3：v-if 优先级更高，上述代码会报错 -->
<!-- 解决方案1：使用 template -->
<template v-for="item in items" :key="item.id">
  <li v-if="item.active">{{ item.name }}</li>
</template>

<!-- 解决方案2：使用 computed 过滤 -->
<li v-for="item in activeItems" :key="item.id">{{ item.name }}</li>
```

### key 使用变更

```vue
<!-- Vue 2：v-if/v-else 分支需要 key -->
<div v-if="condition" key="a">A</div>
<div v-else key="b">B</div>

<!-- Vue 3：自动生成唯一 key，无需手动指定 -->
<div v-if="condition">A</div>
<div v-else>B</div>

<!-- Vue 3：template v-for 的 key 放在 template 上 -->
<template v-for="item in items" :key="item.id">
  <div>{{ item.name }}</div>
  <div>{{ item.desc }}</div>
</template>
```

### $listeners 移除

```javascript
// Vue 2
export default {
  created() {
    console.log(this.$listeners)
  }
}

// Vue 3：$listeners 合并到 $attrs
export default {
  created() {
    console.log(this.$attrs)  // 包含事件监听器
  }
}

// Vue 3 <script setup>：使用 useAttrs
import { useAttrs } from 'vue'
const attrs = useAttrs()
```

### $children 移除

```javascript
// Vue 2
this.$children.forEach(child => child.doSomething())

// Vue 3：使用 ref
<template>
  <ChildComponent ref="childRef" />
</template>

<script setup>
import { ref } from 'vue'
const childRef = ref(null)

function callChild() {
  childRef.value?.doSomething()
}
</script>
```

### filters 移除

```vue
<!-- Vue 2 -->
<template>
  <p>{{ message | capitalize }}</p>
  <p>{{ date | formatDate }}</p>
</template>

<script>
export default {
  filters: {
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<!-- Vue 3：使用 computed 或方法 -->
<template>
  <p>{{ capitalizedMessage }}</p>
  <p>{{ formatDate(date) }}</p>
</template>

<script setup>
import { computed } from 'vue'

const capitalizedMessage = computed(() => 
  message.value.charAt(0).toUpperCase() + message.value.slice(1)
)

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
</script>
```

### 事件 API 变更

```javascript
// Vue 2：使用 $on/$off/$once
const eventBus = new Vue()
eventBus.$on('event', handler)
eventBus.$off('event', handler)
eventBus.$once('event', handler)

// Vue 3：使用 mitt 或 tiny-emitter
import mitt from 'mitt'
const emitter = mitt()
emitter.on('event', handler)
emitter.off('event', handler)
// once 需要手动实现
function once(event, handler) {
  const wrapper = (...args) => {
    handler(...args)
    emitter.off(event, wrapper)
  }
  emitter.on(event, wrapper)
}
```

## 响应式系统变更

### Vue.set/Vue.delete 移除

```javascript
// Vue 2
Vue.set(this.user, 'age', 25)
Vue.delete(this.user, 'age')

// Vue 3：直接赋值即可响应
this.user.age = 25
delete this.user.age

// Vue 3 Composition API
const user = reactive({ name: 'John' })
user.age = 25  // 响应式
delete user.age  // 响应式
```

### 数组响应式

```javascript
// Vue 2：某些操作不触发响应
this.items[0] = newItem  // 不响应
this.items.length = 0     // 不响应

// Vue 3：都可以响应
const items = reactive(['a', 'b', 'c'])
items[0] = 'new'  // 响应式
items.length = 0  // 响应式
```

## 生命周期变更

### 钩子重命名

```javascript
// Vue 2 Options API
export default {
  beforeDestroy() { /* ... */ },
  destroyed() { /* ... */ }
}

// Vue 3 Options API
export default {
  beforeUnmount() { /* ... */ },
  unmounted() { /* ... */ }
}

// Vue 3 Composition API
import { onBeforeUnmount, onUnmounted } from 'vue'

onBeforeUnmount(() => { /* ... */ })
onUnmounted(() => { /* ... */ })
```

## 组件变更

### 函数式组件

```javascript
// Vue 2：functional: true
export default {
  functional: true,
  render(h, { props, children }) {
    return h('div', props, children)
  }
}

// Vue 3：普通函数即可
function FunctionalComponent(props, { slots }) {
  return h('div', props, slots.default?.())
}

// 或使用 <script setup>
<script setup>
defineProps(['title'])
</script>
<template>
  <div>{{ title }}</div>
</template>
```

### 异步组件

```javascript
// Vue 2
const AsyncComponent = () => import('./Component.vue')

const AsyncComponentWithOptions = () => ({
  component: import('./Component.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})

// Vue 3
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => 
  import('./Component.vue')
)

const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./Component.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

## 插件和库迁移

### Vue Router

```javascript
// Vue 2 + Vue Router 3
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [/* ... */]
})

new Vue({ router }).$mount('#app')

// Vue 3 + Vue Router 4
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [/* ... */]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### Vuex → Pinia

```javascript
// Vue 2 + Vuex
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) { state.count++ }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => commit('increment'), 1000)
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})

// 组件中使用
this.$store.state.count
this.$store.commit('increment')
this.$store.dispatch('asyncIncrement')
this.$store.getters.doubleCount

// Vue 3 + Pinia
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ },
    async asyncIncrement() {
      await new Promise(r => setTimeout(r, 1000))
      this.count++
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})

// 组件中使用
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
counter.count
counter.increment()
counter.asyncIncrement()
counter.doubleCount
```

## 迁移检查清单

### 阶段1：准备
- [ ] 升级到 Vue 2.7
- [ ] 修复所有 Vue 2 废弃警告
- [ ] 更新构建工具（Vite 或 Vue CLI 5）
- [ ] 检查第三方库 Vue 3 兼容性

### 阶段2：核心迁移
- [ ] 全局 API 改为应用实例 API
- [ ] v-model 改为 modelValue + update:modelValue
- [ ] .sync 改为 v-model:propName
- [ ] 移除 filters，改用 computed/方法
- [ ] 移除 $listeners，使用 $attrs
- [ ] 移除 $children，使用 ref
- [ ] 事件总线改用 mitt
- [ ] beforeDestroy → beforeUnmount
- [ ] destroyed → unmounted

### 阶段3：库迁移
- [ ] Vue Router 3 → 4
- [ ] Vuex → Pinia（推荐）或 Vuex 4
- [ ] 更新其他 Vue 插件

### 阶段4：优化
- [ ] 迁移到 `<script setup>`
- [ ] 提取 Composables
- [ ] 添加 TypeScript 类型
- [ ] 使用 Vue 3 新特性（Teleport、Suspense等）

## 常见问题

### 问题1：第三方组件库不兼容

**解决方案**：
1. 检查是否有 Vue 3 版本
2. 寻找替代库
3. 使用 @vue/compat 兼容模式

### 问题2：全局 mixin 不生效

```javascript
// Vue 2
Vue.mixin({ /* ... */ })

// Vue 3：需要在应用实例上注册
const app = createApp(App)
app.mixin({ /* ... */ })
```

### 问题3：this 在 setup 中不可用

```javascript
// Vue 2 Options API
methods: {
  doSomething() {
    this.$router.push('/home')
    this.$store.dispatch('action')
  }
}

// Vue 3 Composition API
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'  // 或 Pinia

const router = useRouter()
const store = useStore()

function doSomething() {
  router.push('/home')
  store.dispatch('action')
}
```

### 问题4：响应式丢失

```javascript
// 错误：解构丢失响应式
const { count } = store  // count 不再响应式

// 正确：使用 storeToRefs（Pinia）
import { storeToRefs } from 'pinia'
const { count } = storeToRefs(store)

// 正确：使用 toRefs（reactive 对象）
import { toRefs } from 'vue'
const { count } = toRefs(state)
```
