# 请求配置规范

## 基础配置

### Axios配置（Vue3/Vue2）

```typescript
// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建实例
const request: AxiosInstance = axios.create({
  // 基础URL
  baseURL: import.meta.env.VITE_API_URL || '/api',
  
  // 超时时间（毫秒）
  timeout: 10000,
  
  // 默认请求头
  headers: {
    'Content-Type': 'application/json',
  },
  
  // 跨域携带Cookie
  withCredentials: false,
});

export default request;
```

### 小程序配置

```typescript
// utils/request.ts
const BASE_URL = 'https://api.example.com';
const TIMEOUT = 10000;

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

export function request<T = any>(config: RequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${config.url}`,
      method: config.method || 'GET',
      data: config.data,
      timeout: config.timeout || TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...config.header,
      },
      success: (res) => {
        // 处理响应
      },
      fail: reject,
    });
  });
}
```

## 请求拦截器

### Token注入

```typescript
// Vue3/Vue2
request.interceptors.request.use(
  (config) => {
    // 从存储获取Token
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 小程序
function getAuthHeader(): Record<string, string> {
  const token = wx.getStorageSync('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
```

### 请求追踪

```typescript
// 添加请求ID用于追踪
request.interceptors.request.use((config) => {
  config.headers['X-Request-ID'] = generateRequestId();
  config.headers['X-Timestamp'] = Date.now().toString();
  return config;
});

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
```

### 请求日志（开发环境）

```typescript
if (import.meta.env.DEV) {
  request.interceptors.request.use((config) => {
    console.log(
      `[Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.params || config.data
    );
    return config;
  });
}
```

## 响应拦截器

### 数据解包

```typescript
// 自动解包响应数据
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回data，跳过Axios包装
    return response.data;
  },
  (error) => Promise.reject(error)
);

// 或保留完整响应，在Service层解包
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);
```

### 业务状态码处理

```typescript
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data;
    
    // 业务成功
    if (code === 0) {
      return response;
    }
    
    // 业务失败
    return Promise.reject(new Error(message || '请求失败'));
  }
);
```

## Token刷新

### 自动刷新机制

```typescript
// src/utils/tokenRefresh.ts
import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 订阅Token刷新
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// 通知所有订阅者
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
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
    // 刷新失败，清除Token
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
}

// 响应拦截器中使用
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 正在刷新，等待新Token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(request(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshToken();
      isRefreshing = false;

      if (newToken) {
        onTokenRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return request(originalRequest);
      }

      // 刷新失败，跳转登录
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
```

## 请求取消

### AbortController（推荐）

```typescript
// 创建可取消的请求
function createCancelableRequest<T>(
  requestFn: (signal: AbortSignal) => Promise<T>
): { request: Promise<T>; cancel: () => void } {
  const controller = new AbortController();
  
  return {
    request: requestFn(controller.signal),
    cancel: () => controller.abort(),
  };
}

// 使用示例
const { request, cancel } = createCancelableRequest((signal) =>
  axios.get('/users', { signal })
);

// 取消请求
cancel();
```

### Vue3 Composable

```typescript
// src/composables/useCancelableRequest.ts
import { onUnmounted } from 'vue';

export function useCancelableRequest() {
  const controllers = new Set<AbortController>();

  const createSignal = (): AbortSignal => {
    const controller = new AbortController();
    controllers.add(controller);
    return controller.signal;
  };

  const cancelAll = () => {
    controllers.forEach((controller) => controller.abort());
    controllers.clear();
  };

  // 组件卸载时自动取消
  onUnmounted(() => {
    cancelAll();
  });

  return { createSignal, cancelAll };
}

// 使用示例
const { createSignal } = useCancelableRequest();

const fetchUsers = async () => {
  const response = await axios.get('/users', { signal: createSignal() });
  return response.data;
};
```

## 并发控制

### 请求去重

```typescript
// src/utils/requestDedup.ts
const pendingRequests = new Map<string, Promise<any>>();

function generateKey(config: AxiosRequestConfig): string {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || config.data)}`;
}

export function deduplicateRequest<T>(
  config: AxiosRequestConfig,
  requestFn: () => Promise<T>
): Promise<T> {
  const key = generateKey(config);

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
```

### 请求节流

```typescript
// src/utils/throttleRequest.ts
const lastRequestTime = new Map<string, number>();

export function throttleRequest(
  key: string,
  minInterval: number = 1000
): boolean {
  const now = Date.now();
  const lastTime = lastRequestTime.get(key) || 0;

  if (now - lastTime < minInterval) {
    return false; // 节流，不发送请求
  }

  lastRequestTime.set(key, now);
  return true;
}
```

## 代理配置

### Vite开发代理

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/upload': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
});
```

### Vue CLI开发代理

```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

## 环境配置

### 环境变量

```bash
# .env.development
VITE_API_URL=/api
VITE_UPLOAD_URL=/upload

# .env.production
VITE_API_URL=https://api.example.com
VITE_UPLOAD_URL=https://upload.example.com
```

### 多环境配置

```typescript
// src/config/api.ts
interface ApiConfig {
  baseURL: string;
  timeout: number;
  uploadURL: string;
}

const configs: Record<string, ApiConfig> = {
  development: {
    baseURL: '/api',
    timeout: 30000,
    uploadURL: '/upload',
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 10000,
    uploadURL: 'https://upload.example.com',
  },
  staging: {
    baseURL: 'https://staging-api.example.com',
    timeout: 15000,
    uploadURL: 'https://staging-upload.example.com',
  },
};

export const apiConfig = configs[import.meta.env.MODE] || configs.production;
```
