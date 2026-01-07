# Vue3 Axios配置规范

## 完整配置示例

```typescript
// src/utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 扩展配置类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _startTime?: number;
  }
}

// 创建实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 记录请求开始时间（用于性能监控）
    config._startTime = Date.now();

    // Token注入
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 请求追踪ID
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 性能日志
    logRequestDuration(response.config);

    // 业务状态码检查
    const { code, message } = response.data;
    if (code !== 0) {
      ElMessage.error(message || '请求失败');
      return Promise.reject(new Error(message));
    }

    return response;
  },
  async (error: AxiosError) => {
    // 性能日志
    if (error.config) {
      logRequestDuration(error.config);
    }

    // 处理HTTP错误
    await handleHttpError(error);
    return Promise.reject(error);
  }
);

// 生成请求ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// 记录请求耗时
function logRequestDuration(config: InternalAxiosRequestConfig) {
  if (config._startTime) {
    const duration = Date.now() - config._startTime;
    if (duration > 3000) {
      console.warn(`[Slow Request] ${config.url} took ${duration}ms`);
    }
  }
}

// HTTP错误处理
async function handleHttpError(error: AxiosError) {
  if (!error.response) {
    ElMessage.error('网络连接失败，请检查网络');
    return;
  }

  const { status } = error.response;

  switch (status) {
    case 401:
      await handleUnauthorized(error);
      break;
    case 403:
      ElMessage.error('权限不足');
      break;
    case 404:
      ElMessage.error('资源不存在');
      break;
    case 422:
      // 验证错误由调用方处理
      break;
    case 429:
      ElMessage.error('请求过于频繁');
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      ElMessage.error('服务暂时不可用');
      break;
    default:
      ElMessage.error(`请求失败 (${status})`);
  }
}

// 401处理（含Token刷新）
async function handleUnauthorized(error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig;

  // 已重试过，跳转登录
  if (originalRequest._retry) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
    return;
  }

  // 尝试刷新Token
  originalRequest._retry = true;
  const newToken = await refreshToken();

  if (newToken) {
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return request(originalRequest);
  }

  // 刷新失败，跳转登录
  router.push('/login');
}

// 刷新Token
async function refreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await axios.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    return accessToken;
  } catch {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
}

export default request;
```

## 类型安全的请求方法

```typescript
// src/utils/http.ts
import request from './request';
import type { AxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// GET请求
export async function get<T>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.get<ApiResponse<T>>(url, { params, ...config });
  return response.data.data;
}

// POST请求
export async function post<T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.post<ApiResponse<T>>(url, data, config);
  return response.data.data;
}

// PUT请求
export async function put<T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.put<ApiResponse<T>>(url, data, config);
  return response.data.data;
}

// DELETE请求
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await request.delete<ApiResponse<T>>(url, config);
  return response.data.data;
}

// 文件上传
export async function upload<T>(
  url: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request.post<ApiResponse<T>>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return response.data.data;
}
```

## 请求取消

```typescript
// src/composables/useCancelToken.ts
import { onUnmounted, ref } from 'vue';

export function useCancelToken() {
  const controllers = ref<AbortController[]>([]);

  const createSignal = (): AbortSignal => {
    const controller = new AbortController();
    controllers.value.push(controller);
    return controller.signal;
  };

  const cancelAll = () => {
    controllers.value.forEach((c) => c.abort());
    controllers.value = [];
  };

  onUnmounted(cancelAll);

  return { createSignal, cancelAll };
}
```

## 开发代理配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```
