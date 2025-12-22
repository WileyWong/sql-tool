# Vue集成

在Vue组件中使用API并管理状态。

## Composable函数

```typescript
// src/composables/useUsers.ts
import { ref, reactive, onMounted, watch } from 'vue';
import { UserService } from '@/services/user.service';
import type { User, UserQueryParams } from '@/types/user';

export function useUsers(params: UserQueryParams = {}) {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await UserService.getUsers(params);
      users.value = response.items;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchUsers();
  });

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    refetch: fetchUsers,
  };
}
```

## 列表组件示例

```vue
<!-- src/components/UserList.vue -->
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">
      Error: {{ error.message }}
    </div>
    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-item">
        {{ user.fullName }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '@/composables/useUsers';

const { users, loading, error } = useUsers({ size: 10 });
</script>
```

## 表单提交

```vue
<!-- src/components/CreateUserForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="formData.username"
      type="text"
      placeholder="用户名"
      required
    />
    <input
      v-model="formData.email"
      type="email"
      placeholder="邮箱"
      required
    />
    <input
      v-model="formData.password"
      type="password"
      placeholder="密码"
      required
    />
    <input
      v-model="formData.fullName"
      type="text"
      placeholder="姓名"
      required
    />
    <button type="submit" :disabled="submitting">
      {{ submitting ? '创建中...' : '创建用户' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { UserService } from '@/services/user.service';
import type { CreateUserRequest } from '@/types/user';

const formData = reactive<CreateUserRequest>({
  username: '',
  email: '',
  password: '',
  fullName: '',
});

const submitting = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    const user = await UserService.createUser(formData);
    console.log('创建成功:', user);
    
    // 重置表单
    Object.assign(formData, {
      username: '',
      email: '',
      password: '',
      fullName: '',
    });
  } catch (error) {
    console.error('创建失败:', error);
  } finally {
    submitting.value = false;
  }
};
</script>
```

## 搜索与分页

```vue
<template>
  <div>
    <!-- 搜索框 -->
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="搜索用户"
      @input="handleSearch"
    />
    
    <!-- 用户列表 -->
    <div v-for="user in users" :key="user.id">
      {{ user.fullName }}
    </div>
    
    <!-- 分页 -->
    <div>
      <button 
        :disabled="!pagination.hasPrev" 
        @click="handlePageChange(pagination.page - 1)"
      >
        上一页
      </button>
      <span>第 {{ pagination.page }} / {{ pagination.totalPages }} 页</span>
      <button 
        :disabled="!pagination.hasNext" 
        @click="handlePageChange(pagination.page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { UserService } from '@/services/user.service';
import type { User, UserQueryParams } from '@/types/user';

const users = ref<User[]>([]);
const loading = ref(false);
const searchKeyword = ref('');

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
});

const queryParams = reactive<UserQueryParams>({
  page: 1,
  size: 20,
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await UserService.getUsers(queryParams);
    users.value = response.items;
    Object.assign(pagination, response.pagination);
  } finally {
    loading.value = false;
  }
};

// 防抖搜索
let searchTimer: number | null = null;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    queryParams.keyword = searchKeyword.value;
    queryParams.page = 1;
  }, 500);
};

const handlePageChange = (page: number) => {
  queryParams.page = page;
};

// 监听查询参数变化
watch(queryParams, fetchUsers, { immediate: true });
</script>
```