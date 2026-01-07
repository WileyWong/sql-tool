# TypeScript 从 API 设计生成代码 - 示例

## 示例1: 用户管理

### 输入: API 文档

```yaml
paths:
  /api/v1/users:
    post:
      summary: 创建用户
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                password:
                  type: string
                email:
                  type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer }
                  data: { type: integer }
                  message: { type: string }
    get:
      summary: 查询用户列表
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: size
          in: query
          schema: { type: integer, default: 10 }
          
  /api/v1/users/{id}:
    get:
      summary: 获取用户详情
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
```

### 输出: Types

```typescript
// src/types/user.ts

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email?: string;
}

/**
 * 用户信息
 */
export interface UserVO {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email?: string;
  /** 状态 */
  status: number;
  /** 创建时间 */
  createTime: string;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
}

/**
 * 分页响应
 */
export interface PageResult<T> {
  /** 数据列表 */
  records: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  current: number;
  /** 每页数量 */
  size: number;
}

/**
 * 通用响应
 */
export interface Result<T> {
  /** 状态码 */
  code: number;
  /** 数据 */
  data: T;
  /** 消息 */
  message: string;
}
```

### 输出: API Service

```typescript
// src/api/user.ts

import request from '@/utils/request';
import type { 
  CreateUserRequest, 
  UserVO, 
  PageQuery, 
  PageResult, 
  Result 
} from '@/types/user';

/**
 * 用户 API
 */
export const userApi = {
  /**
   * 创建用户
   */
  create(data: CreateUserRequest): Promise<Result<number>> {
    return request.post('/api/v1/users', data);
  },

  /**
   * 获取用户详情
   */
  getById(id: number): Promise<Result<UserVO>> {
    return request.get(`/api/v1/users/${id}`);
  },

  /**
   * 查询用户列表
   */
  list(params?: PageQuery): Promise<Result<PageResult<UserVO>>> {
    return request.get('/api/v1/users', { params });
  },

  /**
   * 更新用户
   */
  update(id: number, data: Partial<CreateUserRequest>): Promise<Result<void>> {
    return request.put(`/api/v1/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<Result<void>> {
    return request.delete(`/api/v1/users/${id}`);
  },
};
```

### 输出: Composable

```typescript
// src/composables/useUser.ts

import { ref, reactive } from 'vue';
import { userApi } from '@/api/user';
import type { UserVO, CreateUserRequest, PageQuery } from '@/types/user';

/**
 * 用户管理 Composable
 */
export function useUser() {
  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const userList = ref<UserVO[]>([]);
  const currentUser = ref<UserVO | null>(null);
  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0,
  });

  /**
   * 获取用户列表
   */
  async function fetchList(params?: PageQuery) {
    loading.value = true;
    error.value = null;
    try {
      const res = await userApi.list({
        page: params?.page ?? pagination.current,
        size: params?.size ?? pagination.size,
      });
      if (res.code === 0) {
        userList.value = res.data.records;
        pagination.total = res.data.total;
        pagination.current = res.data.current;
      } else {
        error.value = res.message;
      }
    } catch (e) {
      error.value = '获取用户列表失败';
      console.error('fetchList error:', e);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取用户详情
   */
  async function fetchById(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const res = await userApi.getById(id);
      if (res.code === 0) {
        currentUser.value = res.data;
      } else {
        error.value = res.message;
      }
    } catch (e) {
      error.value = '获取用户详情失败';
      console.error('fetchById error:', e);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 创建用户
   */
  async function create(data: CreateUserRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const res = await userApi.create(data);
      if (res.code === 0) {
        await fetchList(); // 刷新列表
        return true;
      } else {
        error.value = res.message;
        return false;
      }
    } catch (e) {
      error.value = '创建用户失败';
      console.error('create error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 删除用户
   */
  async function remove(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const res = await userApi.delete(id);
      if (res.code === 0) {
        await fetchList(); // 刷新列表
        return true;
      } else {
        error.value = res.message;
        return false;
      }
    } catch (e) {
      error.value = '删除用户失败';
      console.error('remove error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    // 状态
    loading,
    error,
    userList,
    currentUser,
    pagination,
    // 方法
    fetchList,
    fetchById,
    create,
    remove,
  };
}
```

### 输出: Vue 组件

```vue
<!-- src/views/user/UserList.vue -->

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUser } from '@/composables/useUser';
import type { CreateUserRequest } from '@/types/user';

// 使用 composable
const { 
  loading, 
  error, 
  userList, 
  pagination,
  fetchList, 
  create, 
  remove 
} = useUser();

// 初始化
onMounted(() => {
  fetchList();
});

// 分页变化
function handlePageChange(page: number) {
  fetchList({ page });
}

// 创建用户
async function handleCreate(data: CreateUserRequest) {
  const success = await create(data);
  if (success) {
    // 提示成功
  }
}

// 删除用户
async function handleDelete(id: number) {
  if (confirm('确定要删除该用户吗？')) {
    const success = await remove(id);
    if (success) {
      // 提示成功
    }
  }
}
</script>

<template>
  <div class="user-list">
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 用户列表 -->
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.status === 1 ? '启用' : '禁用' }}</td>
          <td>{{ user.createTime }}</td>
          <td>
            <button @click="handleDelete(user.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div class="pagination">
      <span>共 {{ pagination.total }} 条</span>
      <button 
        :disabled="pagination.current <= 1"
        @click="handlePageChange(pagination.current - 1)"
      >
        上一页
      </button>
      <span>{{ pagination.current }} / {{ Math.ceil(pagination.total / pagination.size) }}</span>
      <button 
        :disabled="pagination.current >= Math.ceil(pagination.total / pagination.size)"
        @click="handlePageChange(pagination.current + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  padding: 20px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
```
