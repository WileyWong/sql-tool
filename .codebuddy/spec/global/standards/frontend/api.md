# 前端接口调用规范

**版本**: 1.0  
**最后更新**: 2025-11-01  
**适用范围**: 所有前端项目

---

## 📋 概述

本文档定义了前端调用后端 API 的标准规范,包括请求封装、错误处理、数据转换等。

---

## 🔧 Axios 封装

### 1. 请求实例配置

```typescript
// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

/**
 * 统一响应格式
 */
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 创建 Axios 实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    // 添加 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;
    
    // 成功响应
    if (code === 0) {
      return data;
    }
    
    // 业务错误
    ElMessage.error(message || '请求失败');
    return Promise.reject(new Error(message));
  },
  (error) => {
    // HTTP 错误
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          ElMessage.error('未登录或登录已过期');
          // 跳转登录页
          break;
        case 403:
          ElMessage.error('没有权限');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误');
          break;
        default:
          ElMessage.error('请求失败');
      }
    } else {
      ElMessage.error('网络错误');
    }
    
    return Promise.reject(error);
  }
);

export default request;
```

---

## 📡 API 服务封装

### 1. 按模块组织 API

```typescript
// src/api/user.ts
import request from '@/utils/request';

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  getList(params: {
    pageNo: number;
    pageSize: number;
  }): Promise<PageResponse<User>> {
    return request.get('/api/users', { params });
  },

  /**
   * 获取用户详情
   */
  getById(id: number): Promise<User> {
    return request.get(`/api/users/${id}`);
  },

  /**
   * 创建用户
   */
  create(data: UserCreateRequest): Promise<number> {
    return request.post('/api/users', data);
  },

  /**
   * 更新用户
   */
  update(id: number, data: UserUpdateRequest): Promise<void> {
    return request.put(`/api/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<void> {
    return request.delete(`/api/users/${id}`);
  },
};
```

---

## 🎯 在组件中使用

### Vue 3 示例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi } from '@/api/user';

const users = ref<User[]>([]);
const loading = ref(false);

/**
 * 加载用户列表
 */
const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await userApi.getList({
      pageNo: 1,
      pageSize: 10,
    });
    users.value = response.records;
  } catch (error) {
    console.error('加载用户列表失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>
```

---

## ✅ 接口调用检查清单

- [ ] 使用统一的 request 实例
- [ ] API 按模块组织
- [ ] 所有 API 都有类型定义
- [ ] 错误处理完善
- [ ] Loading 状态管理

---

**维护者**: 前端团队  
**最后更新**: 2025-11-01
