# 组件设计示例

> 📚 本文档提供 Vue 3 组件设计的最佳实践示例

## 目录

- [组件粒度](#组件粒度)
- [Props 定义](#props-定义)
- [Emits 定义](#emits-定义)
- [组件命名](#组件命名)
- [组件通信](#组件通信)
- [泛型组件](#泛型组件) **[Vue 3.3+]**
- [defineSlots 类型安全](#defineslots-类型安全) **[Vue 3.3+]**
- [defineModel 简化 v-model](#definemodel-简化-v-model) **[Vue 3.4+]**

---

## 组件粒度

### ❌ 反例：组件过于庞大

```vue
<!-- UserManagement.vue - 450 行，职责过多 -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 用户列表相关
const users = ref<User[]>([])
const loading = ref(false)
const error = ref<Error | null>(null)

// 搜索相关
const searchQuery = ref('')
const searchResults = computed(() => {
  return users.value.filter(u => 
    u.name.includes(searchQuery.value)
  )
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => 
  Math.ceil(searchResults.value.length / pageSize.value)
)
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return searchResults.value.slice(start, start + pageSize.value)
})

// 详情相关
const selectedUser = ref<User | null>(null)
const showDetail = ref(false)

// 编辑相关
const editingUser = ref<User | null>(null)
const showEditModal = ref(false)

// ... 100+ 行业务逻辑
// ... 200+ 行模板代码
</script>

<template>
  <!-- 300+ 行模板 -->
  <div class="user-management">
    <!-- 搜索框 -->
    <div class="search-bar">...</div>
    
    <!-- 用户列表 -->
    <div class="user-list">...</div>
    
    <!-- 分页组件 -->
    <div class="pagination">...</div>
    
    <!-- 用户详情 -->
    <div v-if="showDetail" class="user-detail">...</div>
    
    <!-- 编辑弹窗 -->
    <div v-if="showEditModal" class="edit-modal">...</div>
  </div>
</template>
```

**问题**:
- 组件过大（450 行）
- 职责不清（列表 + 搜索 + 分页 + 详情 + 编辑）
- 难以维护和测试
- 代码复用性差

---

### ✅ 正例：合理拆分组件

```vue
<!-- UserManagement.vue - 主组件（80 行） -->
<script setup lang="ts">
import { ref } from 'vue'
import UserSearch from './UserSearch.vue'
import UserList from './UserList.vue'
import UserPagination from './UserPagination.vue'
import UserDetail from './UserDetail.vue'
import UserEditModal from './UserEditModal.vue'
import { useUsers } from '@/composables/useUsers'

// 使用 Composable 管理用户数据
const { users, loading, error, fetchUsers } = useUsers()

// 搜索状态
const searchQuery = ref('')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 详情状态
const selectedUser = ref<User | null>(null)
const showDetail = ref(false)

// 编辑状态
const editingUser = ref<User | null>(null)
const showEditModal = ref(false)

// 事件处理
function handleUserSelect(user: User) {
  selectedUser.value = user
  showDetail.value = true
}

function handleUserEdit(user: User) {
  editingUser.value = user
  showEditModal.value = true
}

function handleUserSave(user: User) {
  // 保存逻辑
  showEditModal.value = false
}
</script>

<template>
  <div class="user-management">
    <UserSearch v-model="searchQuery" />
    
    <UserList
      :users="users"
      :loading="loading"
      :error="error"
      @select="handleUserSelect"
      @edit="handleUserEdit"
    />
    
    <UserPagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="users.length"
    />
    
    <UserDetail
      v-if="showDetail"
      :user="selectedUser"
      @close="showDetail = false"
    />
    
    <UserEditModal
      v-if="showEditModal"
      :user="editingUser"
      @save="handleUserSave"
      @close="showEditModal = false"
    />
  </div>
</template>
```

```vue
<!-- UserList.vue - 列表组件（60 行） -->
<script setup lang="ts">
interface Props {
  users: User[]
  loading?: boolean
  error?: Error | null
}

interface Emits {
  (e: 'select', user: User): void
  (e: 'edit', user: User): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<Emits>()
</script>

<template>
  <div class="user-list">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error.message }}</div>
    <div v-else>
      <div
        v-for="user in users"
        :key="user.id"
        class="user-item"
        @click="emit('select', user)"
      >
        <span>{{ user.name }}</span>
        <button @click.stop="emit('edit', user)">Edit</button>
      </div>
    </div>
  </div>
</template>
```

**优点**:
- 组件小而聚焦（每个 < 100 行）
- 职责单一（一个组件只做一件事）
- 易于测试和复用
- 代码可读性高

---

## Props 定义

### ❌ 反例：Props 类型不明确

```vue
<script setup lang="ts">
// ❌ 类型太宽泛
const props = defineProps({
  user: Object,        // 类型不明确
  count: Number,       // 缺少验证
  status: String,      // 无枚举限制
  items: Array,        // 数组元素类型未知
  callback: Function   // 函数签名未知
})
</script>
```

**问题**:
- 类型不安全（`Object`、`Array` 太宽泛）
- 无法在编译时发现类型错误
- IDE 无法提供代码提示
- 缺少运行时验证

---

### ✅ 正例：使用 TypeScript 定义 Props

```vue
<script setup lang="ts">
// 定义类型
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface Item {
  id: number
  title: string
}

// Props 接口定义
interface Props {
  user: User
  count?: number
  status?: 'active' | 'inactive' | 'pending'
  items?: Item[]
  onUpdate?: (user: User) => void
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  status: 'pending',
  items: () => []
})
</script>
```

**优点**:
- 类型安全（编译时检查）
- IDE 代码提示完整
- 代码可读性高
- 默认值清晰

---

### ✅ 高级用例：Props 验证

```vue
<script setup lang="ts">
interface Props {
  age: number
  email: string
  url: string
}

const props = defineProps<Props>()

// 运行时验证（可选）
import { computed } from 'vue'

const isValid = computed(() => {
  if (props.age < 0 || props.age > 150) {
    console.warn('Invalid age:', props.age)
    return false
  }
  
  if (!props.email.includes('@')) {
    console.warn('Invalid email:', props.email)
    return false
  }
  
  return true
})
</script>
```

---

## Emits 定义

### ❌ 反例：没有定义 Emits

```vue
<script setup lang="ts">
// ❌ 没有类型定义
const emit = defineEmits()

function handleClick() {
  emit('click', { id: 1 })  // ❌ 类型不安全
}

function handleUpdate(value: string) {
  emit('update', value)     // ❌ 可能拼写错误
}
</script>
```

**问题**:
- 事件名称可能拼写错误
- 事件参数类型不明确
- IDE 无法提供代码提示

---

### ✅ 正例：明确定义 Emits 类型

```vue
<script setup lang="ts">
// 定义 Emits 接口
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: { id: number; name: string }): void
  (e: 'cancel'): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()

// 使用时有类型检查
function handleSubmit() {
  emit('submit', { id: 1, name: 'John' })  // ✅ 类型检查
  // emit('submit', { id: '1' })           // ❌ 编译错误
  // emit('submitt', {})                   // ❌ 事件名错误
}

function handleCancel() {
  emit('cancel')  // ✅ 正确
}
</script>
```

**优点**:
- 事件名称有类型检查
- 事件参数有类型检查
- IDE 代码提示完整

---

### ✅ 高级用例：v-model 双向绑定

```vue
<script setup lang="ts">
// 单个 v-model
interface Emits {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

function updateValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <input :value="modelValue" @input="updateValue($event.target.value)" />
</template>
```

```vue
<script setup lang="ts">
// 多个 v-model
interface Props {
  firstName: string
  lastName: string
}

interface Emits {
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div>
    <input
      :value="firstName"
      @input="emit('update:firstName', $event.target.value)"
    />
    <input
      :value="lastName"
      @input="emit('update:lastName', $event.target.value)"
    />
  </div>
</template>

<!-- 使用 -->
<UserName
  v-model:first-name="user.firstName"
  v-model:last-name="user.lastName"
/>
```

---

## 组件命名

### ❌ 反例：命名不规范

```
components/
  ├─ user.vue           ❌ 全小写
  ├─ UserDetail.vue     ✅ 正确
  ├─ userlist.vue       ❌ 全小写
  ├─ User_Edit.vue      ❌ 下划线
  └─ user-profile.vue   ❌ 短横线（文件名）
```

---

### ✅ 正例：PascalCase 命名

```
components/
  ├─ UserList.vue       ✅ PascalCase
  ├─ UserDetail.vue     ✅ PascalCase
  ├─ UserEditModal.vue  ✅ 多词组合
  ├─ UserProfile.vue    ✅ 清晰语义
  └─ UserAvatar.vue     ✅ 功能明确
```

**命名规范**:
- 文件名使用 **PascalCase**（大驼峰）
- 多个单词组合（避免单词命名，如 `User.vue`）
- 语义清晰（一眼看出组件功能）
- 避免缩写（`UserProfile.vue` 而非 `UsrProf.vue`）

---

## 组件通信

### Props 向下传递，Events 向上传递

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'

const count = ref(0)

function handleIncrement(value: number) {
  count.value += value
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <!-- Props 向下传递 -->
    <Child :count="count" @increment="handleIncrement" />
  </div>
</template>
```

```vue
<!-- Child.vue -->
<script setup lang="ts">
interface Props {
  count: number
}

interface Emits {
  (e: 'increment', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Events 向上传递
function increment() {
  emit('increment', 1)
}
</script>

<template>
  <div>
    <p>Current: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

---

### Provide / Inject（避免 Prop Drilling）

```vue
<!-- Grandparent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const theme = ref<'light' | 'dark'>('light')

// 提供数据
provide('theme', theme)
</script>

<template>
  <Parent />
</template>
```

```vue
<!-- GrandChild.vue（跨多层组件） -->
<script setup lang="ts">
import { inject, Ref } from 'vue'

// 注入数据
const theme = inject<Ref<'light' | 'dark'>>('theme')
</script>

<template>
  <div :class="theme">Theme: {{ theme }}</div>
</template>
```

**使用场景**:
- 跨多层组件传递数据
- 避免 Props 层层传递（Prop Drilling）
- 全局主题、语言、用户信息等

---

## 泛型组件 **[Vue 3.3+]**

### ❌ 反例：类型不够灵活

```vue
<script setup lang="ts">
interface Props {
  items: any[]  // ❌ 使用 any
  selected: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', item: any): void  // ❌ 类型不安全
}>()
</script>

<template>
  <div v-for="item in items" :key="item.id" @click="emit('select', item)">
    {{ item.label }}
  </div>
</template>
```

---

### ✅ 正例：使用泛型组件

```vue
<!-- GenericList.vue -->
<script setup lang="ts" generic="T extends { id: string | number }">
// ✅ 使用 generic 属性定义泛型
interface Props {
  items: T[]
  selected?: T
  labelKey?: keyof T
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'name' as keyof T
})

const emit = defineEmits<{
  (e: 'select', item: T): void
  (e: 'update:selected', item: T): void
}>()

function handleSelect(item: T) {
  emit('select', item)
  emit('update:selected', item)
}
</script>

<template>
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      :class="{ selected: selected?.id === item.id }"
      @click="handleSelect(item)"
    >
      {{ item[labelKey] }}
    </div>
  </div>
</template>
```

```vue
<!-- 使用泛型组件 -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

interface Product {
  id: string
  title: string
  price: number
}

const users = ref<User[]>([])
const products = ref<Product[]>([])
const selectedUser = ref<User>()
const selectedProduct = ref<Product>()
</script>

<template>
  <!-- ✅ 类型自动推断 -->
  <GenericList
    :items="users"
    v-model:selected="selectedUser"
    label-key="name"
    @select="(user) => console.log(user.email)"
  />
  
  <GenericList
    :items="products"
    v-model:selected="selectedProduct"
    label-key="title"
    @select="(product) => console.log(product.price)"
  />
</template>
```

**优点**:
- 类型安全（编译时检查）
- 代码复用（一个组件支持多种类型）
- IDE 完整提示

---

## defineSlots 类型安全 **[Vue 3.3+]**

### ❌ 反例：插槽无类型

```vue
<script setup lang="ts">
// ❌ 插槽参数无类型定义
</script>

<template>
  <div>
    <slot name="item" :item="item" :index="index" />
  </div>
</template>
```

---

### ✅ 正例：使用 defineSlots

```vue
<!-- TypedSlotList.vue -->
<script setup lang="ts" generic="T">
interface Props {
  items: T[]
}

const props = defineProps<Props>()

// ✅ 定义插槽类型
const slots = defineSlots<{
  default(props: { items: T[] }): any
  item(props: { item: T; index: number }): any
  empty(): any
  header?(props: { count: number }): any
}>()
</script>

<template>
  <div class="list">
    <div v-if="slots.header" class="header">
      <slot name="header" :count="items.length" />
    </div>
    
    <template v-if="items.length > 0">
      <div v-for="(item, index) in items" :key="index" class="item">
        <slot name="item" :item="item" :index="index" />
      </div>
    </template>
    
    <template v-else>
      <slot name="empty">
        <div class="empty">No items</div>
      </slot>
    </template>
  </div>
</template>
```

```vue
<!-- 使用带类型的插槽 -->
<script setup lang="ts">
interface Todo {
  id: number
  text: string
  done: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Build app', done: false }
])
</script>

<template>
  <TypedSlotList :items="todos">
    <template #header="{ count }">
      <h2>Todos ({{ count }})</h2>
    </template>
    
    <!-- ✅ item 和 index 有正确类型 -->
    <template #item="{ item, index }">
      <div :class="{ done: item.done }">
        {{ index + 1 }}. {{ item.text }}
      </div>
    </template>
    
    <template #empty>
      <p>No todos yet!</p>
    </template>
  </TypedSlotList>
</template>
```

---

## defineModel 简化 v-model **[Vue 3.4+]**

### ❌ 反例：手动实现 v-model（繁琐）

```vue
<script setup lang="ts">
// ❌ 手动定义 props 和 emits
const props = defineProps<{
  modelValue: string
  count: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:count', value: number): void
}>()

// ❌ 需要手动触发更新
function updateValue(value: string) {
  emit('update:modelValue', value)
}

function updateCount(value: number) {
  emit('update:count', value)
}
</script>

<template>
  <input :value="modelValue" @input="updateValue($event.target.value)" />
  <input type="number" :value="count" @input="updateCount(+$event.target.value)" />
</template>
```

---

### ✅ 正例：使用 defineModel

```vue
<!-- ModelInput.vue -->
<script setup lang="ts">
// ✅ 使用 defineModel 简化 v-model
const modelValue = defineModel<string>({ required: true })
const count = defineModel<number>('count', { default: 0 })

// 可以直接修改，自动触发更新
function increment() {
  count.value++
}

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div>
    <input v-model="modelValue" />
    <button @click="clear">Clear</button>
    
    <input type="number" v-model="count" />
    <button @click="increment">+1</button>
  </div>
</template>
```

```vue
<!-- 使用组件 -->
<script setup lang="ts">
const text = ref('')
const number = ref(0)
</script>

<template>
  <!-- ✅ 简洁的 v-model 绑定 -->
  <ModelInput v-model="text" v-model:count="number" />
</template>
```

**优点**:
- 代码更简洁
- 类型自动推断
- 可直接修改值

---

## 📚 相关资源

- [vue-review.md](../vue3-review.md) - 完整审查流程
- [Vue 3 官方文档 - 组件基础](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue 3.3 发布说明](https://blog.vuejs.org/posts/vue-3-3)
- [Vue 3.4 发布说明](https://blog.vuejs.org/posts/vue-3-4)
