# Vue 3 开发规范

## 组件结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@/types';

// 2. Props & Emits
interface Props {
  userId: number;
  showAvatar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
});

const emit = defineEmits<{
  'update:value': [value: string];
}>();

// 3. Composables
const router = useRouter();
const { user, loading } = useUser(props.userId);

// 4. 响应式数据
const searchText = ref('');
const selectedIds = ref<number[]>([]);

// 5. 计算属性
const filteredList = computed(() => {
  return list.value.filter(item => 
    item.name.includes(searchText.value)
  );
});

// 6. 方法
function handleSubmit() {
  emit('update:value', searchText.value);
}

// 7. 生命周期
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="user-profile">
    <UserAvatar v-if="showAvatar" :user="user" />
    <div class="user-info">
      <h2>{{ user?.name }}</h2>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  gap: 16px;
}
</style>
```

## 响应式

```typescript
// ✅ ref - 基础类型
const count = ref(0);
const name = ref('');
const loading = ref(false);

// ✅ ref - 对象/数组
const user = ref<User | null>(null);
const users = ref<User[]>([]);

// ✅ reactive - 复杂对象
const form = reactive({
  username: '',
  password: '',
  remember: false,
});

// ✅ computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// ✅ watch
watch(userId, (newId) => {
  fetchUser(newId);
});

watch(
  () => props.userId,
  (newId) => fetchUser(newId),
  { immediate: true }
);
```

## Composables

```typescript
// composables/useUser.ts
export function useUser(id: MaybeRef<number>) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      user.value = await userApi.getById(unref(id));
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  // 监听 id 变化自动刷新
  watch(() => unref(id), fetchUser, { immediate: true });

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchUser,
  };
}

// 使用
const { user, loading, refresh } = useUser(props.userId);
```

## 模板规范

```vue
<template>
  <!-- ✅ v-if/v-else -->
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>{{ data }}</div>

  <!-- ✅ v-for 必须有 key -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>

  <!-- ✅ 事件绑定 -->
  <button @click="handleClick">点击</button>
  <input @input="handleInput" @keyup.enter="handleSubmit" />

  <!-- ✅ 双向绑定 -->
  <input v-model="searchText" />
  <CustomInput v-model:value="inputValue" />
</template>
```

## 检查清单

- [ ] 使用 `<script setup>` 语法
- [ ] Props/Emits 类型化
- [ ] 复用逻辑提取为 Composables
- [ ] v-for 必须有 key
- [ ] 使用 scoped 样式

## 参考

- [Vue 3 官方文档](https://vuejs.org/)
- [Vue 风格指南](https://vuejs.org/style-guide/)
