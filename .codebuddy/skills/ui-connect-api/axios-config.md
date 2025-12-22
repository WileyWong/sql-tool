# Axios配置与拦截器

统一的Axios实例配置，实现自动Token管理和错误处理。

## 基础配置

```typescript
// src/utils/request.ts
import axios, { AxiosInstance } from 'axios';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 请求拦截器

```typescript
request.interceptors.request.use(
  (config) => {
    // 自动添加Token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求追踪ID
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => Promise.reject(error)
);

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
```

## 响应拦截器

```typescript
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status } = error.response || {};
    
    switch (status) {
      case 401:
        // Token刷新逻辑
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            localStorage.setItem('access_token', newToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return request(error.config);
          }
        } catch {
          // 跳转登录
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        break;
        
      case 403:
        showErrorMessage('权限不足');
        break;
        
      case 404:
        showErrorMessage('资源不存在');
        break;
        
      case 500:
        showErrorMessage('服务器错误，请稍后再试');
        break;
    }
    
    return Promise.reject(error);
  }
);
```

## Token刷新

```typescript
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;
  
  try {
    const response = await axios.post('/auth/refresh', { refreshToken });
    return response.data.data.accessToken;
  } catch {
    return null;
  }
}
```

## CORS代理配置

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
    },
  },
});
```