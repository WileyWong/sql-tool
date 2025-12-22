# 使用示例

## 1. 基础API调用

### Vue示例

```vue
<template>
  <div>
    <h1>用户列表</h1>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <ul v-else>
      <li v-for="user in data" :key="user.id">
        {{ user.name }} - {{ user.email }}
        <button @click="handleDelete(user.id)">删除</button>
      </li>
    </ul>
    
    <div>
      <button 
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page <= 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.page }} 页，共 {{ Math.ceil(pagination.total / pagination.pageSize) }} 页</span>
      <button 
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers, useUserActions } from '../composables/useUsers';

const { data, loading, error, pagination, changePage, refresh } = useUsers();
const { deleteUser } = useUserActions();

const handleDelete = async (id: number) => {
  try {
    await deleteUser(id);
    refresh();
  } catch (error) {
    console.error('删除失败:', error);
  }
};
</script>
```

## 2. 文件上传示例

### Vue文件上传组件

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FileService } from '../services/file-service';

const uploading = ref(false);
const progress = ref(0);
const uploadedUrl = ref<string | null>(null);

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  uploading.value = true;
  progress.value = 0;
  
  try {
    const response = await FileService.uploadFile(file, (p) => {
      progress.value = p;
    });
    if (response.success) {
      uploadedUrl.value = response.data.url;
    }
  } catch (error) {
    console.error('上传失败:', error);
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div>
    <input 
      type="file" 
      @change="handleFileUpload"
      :disabled="uploading"
    />
    
    <div v-if="uploading">
      <div>上传进度: {{ progress }}%</div>
      <progress :value="progress" max="100" />
    </div>
    
    <div v-if="uploadedUrl">
      <p>上传成功!</p>
      <a :href="uploadedUrl" target="_blank" rel="noopener noreferrer">
        查看文件
      </a>
    </div>
  </div>
</template>
```

## 3. 错误处理示例

```typescript
import { UserService } from '../services/user-service';

// 带重试的API调用
async function fetchUserWithRetry(id: number, maxRetries = 3): Promise<User | null> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await UserService.getUserById(id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      lastError = error;
      
      // 如果是网络错误，等待后重试
      if (error.code === 'NETWORK_ERROR' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      // 其他错误直接抛出
      throw error;
    }
  }
  
  throw lastError!;
}
```

## 4. Composable 组合式函数示例

```typescript
import { ref } from 'vue';

// 通用API Composable
export function useApi<T, P extends any[]>(
  apiFunction: (...params: P) => Promise<T>
) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (...params: P) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await apiFunction(...params);
      data.value = result;
      return result;
    } catch (err: any) {
      const errorMessage = err.message || '请求失败';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}

// 使用示例
const userApi = useApi(UserService.getUserById);

// 在组件中使用
const handleGetUser = async (id: number) => {
  try {
    const user = await userApi.execute(id);
    console.log('用户信息:', user);
  } catch (error) {
    console.error('获取用户失败:', error);
  }
};
```