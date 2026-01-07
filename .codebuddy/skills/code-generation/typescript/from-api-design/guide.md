# TypeScript 从 API 设计生成代码指南

## 适用场景

- 输入：后端 API 文档或 OpenAPI 规范
- 输出：Vue 3 + TypeScript 前端代码

## 生成内容

### 1. 类型定义

```typescript
// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  status: UserStatus;
  createTime: string;
}

export type UserStatus = 'active' | 'inactive';

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface UserQueryParams {
  username?: string;
  status?: UserStatus;
  pageNum: number;
  pageSize: number;
}
```

### 2. API 封装

```typescript
// api/user.ts
import { get, post, put, del } from './request';
import type { User, CreateUserRequest, UserQueryParams } from '@/types';

export const userApi = {
  getById: (id: number) => 
    get<User>(`/api/v1/users/${id}`),
  
  create: (data: CreateUserRequest) => 
    post<User>('/api/v1/users', data),
  
  update: (id: number, data: Partial<User>) => 
    put<User>(`/api/v1/users/${id}`, data),
  
  delete: (id: number) => 
    del<void>(`/api/v1/users/${id}`),
  
  list: (params: UserQueryParams) => 
    get<PageResponse<User>>('/api/v1/users', params),
};
```

### 3. Composable

```typescript
// composables/useUser.ts
import { ref, readonly } from 'vue';
import { userApi } from '@/api';
import type { User } from '@/types';

export function useUser(id: number) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      user.value = await userApi.getById(id);
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  fetchUser();

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    refresh: fetchUser,
  };
}
```

### 4. Vue 组件

```vue
<script setup lang="ts">
import { useUser } from '@/composables/useUser';

const props = defineProps<{
  userId: number;
}>();

const { user, loading, error } = useUser(props.userId);
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else-if="user">
    <h2>{{ user.username }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>
```

## 检查清单

- [ ] 生成类型定义
- [ ] 封装 API 调用
- [ ] 创建 Composable
- [ ] 生成 Vue 组件
- [ ] 类型完整准确

## 参考

- [TypeScript 类型规范](../../standards/typescript/typing.md)
- [Vue 3 规范](../../standards/typescript/vue3.md)
