# TypeScript/Vue 最佳实践

## 类型安全

```typescript
// ✅ 类型守卫
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// ✅ 非空断言（确定不为空时）
const element = document.getElementById('app')!;

// ✅ 可选链
const city = user?.address?.city;

// ✅ 空值合并
const name = user.nickname ?? user.username ?? '匿名';
```

## API 封装

```typescript
// api/request.ts
import axios from 'axios';
import type { ApiResponse } from '@/types';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? '请求失败';
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await request.get<any, ApiResponse<T>>(url, { params });
  return res.data;
}

export async function post<T>(url: string, data?: object): Promise<T> {
  const res = await request.post<any, ApiResponse<T>>(url, data);
  return res.data;
}

// api/user.ts
import { get, post } from './request';
import type { User, CreateUserRequest } from '@/types';

export const userApi = {
  getById: (id: number) => get<User>(`/users/${id}`),
  create: (data: CreateUserRequest) => post<User>('/users', data),
  list: (params: UserQueryParams) => get<PageResponse<User>>('/users', params),
};
```

## 状态管理 (Pinia)

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { userApi } from '@/api';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const isLoggedIn = computed(() => currentUser.value !== null);

  async function fetchCurrentUser() {
    currentUser.value = await userApi.getCurrent();
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem('token');
  }

  return {
    currentUser,
    isLoggedIn,
    fetchCurrentUser,
    logout,
  };
});
```

## 错误处理

```typescript
// ✅ 异步错误处理
async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await api.getData();
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('未知错误');
    console.error('获取数据失败:', e);
  } finally {
    loading.value = false;
  }
}

// ✅ 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info);
  // 上报错误
};
```

## 性能优化

```typescript
// ✅ 组件懒加载
const UserProfile = defineAsyncComponent(() => 
  import('@/components/UserProfile.vue')
);

// ✅ v-memo 缓存
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  {{ item.name }}
</div>

// ✅ shallowRef 大数据
const bigList = shallowRef<Item[]>([]);

// ✅ 防抖
import { useDebounceFn } from '@vueuse/core';

const debouncedSearch = useDebounceFn((keyword: string) => {
  fetchSearchResults(keyword);
}, 300);
```

## 检查清单

- [ ] 避免使用 any
- [ ] API 响应类型化
- [ ] 使用 Pinia 管理状态
- [ ] 异步操作有错误处理
- [ ] 大组件懒加载
- [ ] 列表使用 v-memo

## 参考

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [VueUse](https://vueuse.org/)
