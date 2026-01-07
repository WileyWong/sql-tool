# Vue3 API调用最佳实践

## 目录结构

```
src/
├── api/                    # 或 services/
│   ├── index.ts            # 统一导出
│   ├── request.ts          # Axios实例配置
│   ├── userService.ts      # 用户服务
│   └── orderService.ts     # 订单服务
├── composables/
│   ├── useRequest.ts       # 通用请求Composable
│   ├── useList.ts          # 列表Composable
│   └── useUsers.ts         # 用户相关Composable
├── types/
│   ├── api.ts              # API通用类型
│   ├── user.ts             # 用户类型
│   └── order.ts            # 订单类型
└── utils/
    ├── http.ts             # HTTP工具函数
    └── cache.ts            # 缓存工具
```

## Service层规范

### 服务类定义

```typescript
// src/services/userService.ts
import { get, post, put, del } from '@/utils/http';
import type { 
  User, 
  UserQueryParams, 
  CreateUserRequest, 
  UpdateUserRequest,
  PageResponse 
} from '@/types/user';

export const userService = {
  /**
   * 获取用户列表
   */
  getList(params: UserQueryParams): Promise<PageResponse<User>> {
    return get('/users', params);
  },

  /**
   * 获取用户详情
   */
  getById(id: number): Promise<User> {
    return get(`/users/${id}`);
  },

  /**
   * 创建用户
   */
  create(data: CreateUserRequest): Promise<User> {
    return post('/users', data);
  },

  /**
   * 更新用户
   */
  update(id: number, data: UpdateUserRequest): Promise<User> {
    return put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<void> {
    return del(`/users/${id}`);
  },

  /**
   * 批量删除
   */
  batchDelete(ids: number[]): Promise<void> {
    return post('/users/batch-delete', { ids });
  },
};
```

### 统一导出

```typescript
// src/services/index.ts
export { userService } from './userService';
export { orderService } from './orderService';
export { authService } from './authService';
```

## 组件中的使用

### 列表页面

```vue
<template>
  <div class="user-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="params.keyword"
        placeholder="搜索用户"
        clearable
        @clear="refresh"
        @keyup.enter="refresh"
      />
      <el-select v-model="params.status" placeholder="状态" clearable @change="refresh">
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
      <el-button type="primary" @click="refresh">搜索</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="items">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @size-change="changePageSize"
      @current-change="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus';
import { useUserList } from '@/composables/useUsers';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';

const {
  items,
  loading,
  pagination,
  params,
  refresh,
  changePage,
  changePageSize,
} = useUserList();

const handleEdit = (user: User) => {
  // 打开编辑弹窗
};

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除该用户？', '提示', {
    type: 'warning',
  });

  try {
    await userService.delete(id);
    ElMessage.success('删除成功');
    refresh();
  } catch {
    // 错误已在拦截器中处理
  }
};
</script>
```

### 表单页面

```vue
<template>
  <el-form
    ref="formRef"
    :model="values"
    :rules="rules"
    label-width="100px"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="values.username" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="values.email" type="email" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="values.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="submitting" native-type="submit">
        提交
      </el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useForm } from '@/composables/useForm';
import { userService } from '@/services/userService';
import type { CreateUserRequest } from '@/types/user';

const formRef = ref<FormInstance>();

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 个字符', trigger: 'blur' },
  ],
};

const { values, submitting, reset, handleSubmit } = useForm<CreateUserRequest>({
  initialValues: {
    username: '',
    email: '',
    password: '',
  },
  onSubmit: async (data) => {
    // 表单验证
    await formRef.value?.validate();
    // 提交
    await userService.create(data);
  },
  onSuccess: () => {
    ElMessage.success('创建成功');
    reset();
  },
});
</script>
```

## 性能优化

### 请求缓存

```typescript
// src/utils/cache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class RequestCache {
  private cache = new Map<string, CacheItem<any>>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const requestCache = new RequestCache();
```

### 请求去重

```typescript
// src/utils/dedup.ts
const pending = new Map<string, Promise<any>>();

export function dedup<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (pending.has(key)) {
    return pending.get(key)!;
  }

  const promise = fn().finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}
```

## 错误边界

```typescript
// src/composables/useErrorBoundary.ts
import { ref, onErrorCaptured } from 'vue';

export function useErrorBoundary() {
  const error = ref<Error | null>(null);

  onErrorCaptured((err) => {
    error.value = err;
    // 返回 false 阻止错误继续传播
    return false;
  });

  const reset = () => {
    error.value = null;
  };

  return { error, reset };
}
```

## 测试友好设计

```typescript
// src/services/__tests__/userService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { userService } from '../userService';
import request from '@/utils/request';

vi.mock('@/utils/request');

describe('userService', () => {
  it('should fetch user list', async () => {
    const mockData = {
      items: [{ id: 1, username: 'test' }],
      pagination: { page: 1, size: 20, total: 1 },
    };

    vi.mocked(request.get).mockResolvedValue({ data: { data: mockData } });

    const result = await userService.getList({ page: 1, size: 20 });
    expect(result).toEqual(mockData);
  });
});
```
