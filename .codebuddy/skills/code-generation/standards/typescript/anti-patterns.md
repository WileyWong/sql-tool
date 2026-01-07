# TypeScript/Vue 错误示例集

## 类型问题

```typescript
// ❌ 使用 any
function process(data: any): any {
  return data.value;
}

// ✅ 正确
function process<T extends { value: unknown }>(data: T): T['value'] {
  return data.value;
}

// ❌ 类型断言滥用
const user = response as User;  // 可能运行时错误

// ✅ 正确：类型守卫
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

if (isUser(response)) {
  // response 类型为 User
}
```

## Vue 响应式问题

```typescript
// ❌ 解构丢失响应式
const { user } = useUser();  // user 不再是响应式！

// ✅ 正确
const { user } = useUser();  // user 是 ref
// 或
const userStore = useUser();
// 使用 userStore.user

// ❌ 直接赋值替换 reactive
const state = reactive({ list: [] });
state = { list: [1, 2, 3] };  // 丢失响应式！

// ✅ 正确
state.list = [1, 2, 3];

// ❌ ref 忘记 .value
const count = ref(0);
count = 1;  // 错误！

// ✅ 正确
count.value = 1;
```

## 异步问题

```typescript
// ❌ 忘记 await
async function fetchData() {
  const data = api.getData();  // 返回 Promise，不是数据！
  console.log(data);  // [object Promise]
}

// ✅ 正确
async function fetchData() {
  const data = await api.getData();
  console.log(data);
}

// ❌ 在 setup 外使用 await
const data = await fetchData();  // 阻塞渲染！

// ✅ 正确
onMounted(async () => {
  data.value = await fetchData();
});
```

## 内存泄漏

```typescript
// ❌ 未清理定时器
onMounted(() => {
  setInterval(() => {
    // ...
  }, 1000);
});

// ✅ 正确
let timer: number;
onMounted(() => {
  timer = setInterval(() => {
    // ...
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timer);
});

// ❌ 未移除事件监听
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// ✅ 正确
onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
```

## v-for 问题

```vue
<!-- ❌ 没有 key -->
<div v-for="item in items">{{ item.name }}</div>

<!-- ❌ 使用 index 作为 key -->
<div v-for="(item, index) in items" :key="index">
  {{ item.name }}
</div>

<!-- ✅ 正确：使用唯一 id -->
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>
```

## 参考

- [Vue 常见问题](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript 常见错误](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
