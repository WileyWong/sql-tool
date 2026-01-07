# 错误处理规范

## 错误分类

### 网络层错误

| 错误类型 | 识别方式 | 处理策略 |
|---------|---------|---------|
| 网络断开 | `!error.response` | 提示检查网络，支持重试 |
| 请求超时 | `error.code === 'ECONNABORTED'` | 提示稍后重试 |
| DNS解析失败 | `error.code === 'ENOTFOUND'` | 提示检查网络 |
| 连接拒绝 | `error.code === 'ECONNREFUSED'` | 提示服务不可用 |

### HTTP状态码错误

| 状态码 | 含义 | 处理策略 |
|--------|------|---------|
| 400 | 请求参数错误 | 显示具体错误信息 |
| 401 | 未授权 | 跳转登录页 |
| 403 | 权限不足 | 提示无权限 |
| 404 | 资源不存在 | 提示资源不存在 |
| 422 | 验证错误 | 显示字段级错误 |
| 429 | 请求过多 | 提示稍后重试 |
| 500 | 服务器错误 | 提示服务异常 |
| 502/503/504 | 网关错误 | 提示服务暂不可用 |

### 业务逻辑错误

| 错误码 | 含义 | 处理策略 |
|--------|------|---------|
| 10001 | 用户不存在 | 显示业务提示 |
| 10002 | 密码错误 | 显示业务提示 |
| ... | ... | 根据业务定义 |

## Vue3 错误处理

### 响应拦截器

```typescript
// src/utils/request.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus'; // 或其他UI库
import router from '@/router';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 业务状态码检查
    if (data.code !== 0) {
      handleBusinessError(data);
      return Promise.reject(new Error(data.message));
    }
    
    return response;
  },
  (error: AxiosError) => {
    handleHttpError(error);
    return Promise.reject(error);
  }
);

// HTTP错误处理
function handleHttpError(error: AxiosError) {
  // 网络错误
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试');
    } else {
      ElMessage.error('网络连接失败，请检查网络');
    }
    return;
  }

  const { status, data } = error.response as AxiosResponse;
  
  switch (status) {
    case 400:
      ElMessage.error((data as any)?.message || '请求参数错误');
      break;
    case 401:
      handleUnauthorized();
      break;
    case 403:
      ElMessage.error('权限不足，无法执行此操作');
      break;
    case 404:
      ElMessage.error('请求的资源不存在');
      break;
    case 422:
      // 验证错误，由调用方处理
      break;
    case 429:
      ElMessage.error('请求过于频繁，请稍后重试');
      break;
    case 500:
      ElMessage.error('服务器内部错误');
      break;
    case 502:
    case 503:
    case 504:
      ElMessage.error('服务暂时不可用，请稍后重试');
      break;
    default:
      ElMessage.error(`请求失败 (${status})`);
  }
}

// 业务错误处理
function handleBusinessError(data: { code: number; message: string }) {
  ElMessage.error(data.message || '操作失败');
}

// 未授权处理
function handleUnauthorized() {
  // 清除Token
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // 跳转登录
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath },
  });
  
  ElMessage.warning('登录已过期，请重新登录');
}

export default request;
```

### Composable错误处理

```typescript
// src/composables/useRequest.ts
import { ref, Ref } from 'vue';

interface UseRequestOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useRequest<T, P extends any[]>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (...args: P): Promise<T | null> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await requestFn(...args);
      data.value = result;
      options.onSuccess?.(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      options.onError?.(err);
      return null;
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
```

### 表单验证错误处理

```typescript
// src/composables/useFormErrors.ts
import { ref, Ref } from 'vue';
import { AxiosError } from 'axios';

interface ValidationErrors {
  [field: string]: string;
}

export function useFormErrors() {
  const errors = ref<ValidationErrors>({});

  const setErrors = (newErrors: ValidationErrors) => {
    errors.value = newErrors;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const clearFieldError = (field: string) => {
    delete errors.value[field];
  };

  const handleValidationError = (error: AxiosError) => {
    if (error.response?.status === 422) {
      const data = error.response.data as { errors?: ValidationErrors };
      if (data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.value[field];
  };

  return {
    errors,
    setErrors,
    clearErrors,
    clearFieldError,
    handleValidationError,
    getFieldError,
  };
}

// 使用示例
const { errors, handleValidationError, clearErrors } = useFormErrors();

const handleSubmit = async () => {
  clearErrors();
  try {
    await userService.create(formData);
  } catch (error) {
    handleValidationError(error as AxiosError);
  }
};
```

## Vue2 错误处理

### 响应拦截器

```javascript
// src/utils/request.js
import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';
import store from '@/store';

const request = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
});

request.interceptors.response.use(
  response => {
    const { data } = response;
    
    if (data.code !== 0) {
      Message.error(data.message || '操作失败');
      return Promise.reject(new Error(data.message));
    }
    
    return response;
  },
  error => {
    if (!error.response) {
      Message.error('网络连接失败，请检查网络');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        store.dispatch('user/logout');
        router.push('/login');
        Message.warning('登录已过期');
        break;
      case 403:
        Message.error('权限不足');
        break;
      case 404:
        Message.error('资源不存在');
        break;
      case 500:
        Message.error('服务器错误');
        break;
      default:
        Message.error(data?.message || `请求失败 (${status})`);
    }

    return Promise.reject(error);
  }
);

export default request;
```

## 小程序错误处理

### 请求封装

```typescript
// utils/request.ts
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;
  showError?: boolean;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const { showLoading = true, showError = true, ...config } = options;

  if (showLoading) {
    wx.showLoading({ title: '加载中...' });
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      url: `${getApp().globalData.baseUrl}${config.url}`,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`,
        ...config.header,
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }

        const { statusCode, data } = res as WechatMiniprogram.RequestSuccessCallbackResult;
        const responseData = data as ApiResponse<T>;

        // HTTP状态码检查
        if (statusCode !== 200) {
          handleHttpError(statusCode, showError);
          reject(new Error(`HTTP Error: ${statusCode}`));
          return;
        }

        // 业务状态码检查
        if (responseData.code !== 0) {
          if (showError) {
            wx.showToast({ title: responseData.message, icon: 'none' });
          }
          reject(new Error(responseData.message));
          return;
        }

        resolve(responseData.data);
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }

        if (showError) {
          wx.showToast({ title: '网络请求失败', icon: 'none' });
        }

        reject(err);
      },
    });
  });
}

function handleHttpError(statusCode: number, showError: boolean) {
  if (!showError) return;

  switch (statusCode) {
    case 401:
      wx.showToast({ title: '请重新登录', icon: 'none' });
      wx.navigateTo({ url: '/pages/login/login' });
      break;
    case 403:
      wx.showToast({ title: '权限不足', icon: 'none' });
      break;
    case 404:
      wx.showToast({ title: '资源不存在', icon: 'none' });
      break;
    case 500:
      wx.showToast({ title: '服务器错误', icon: 'none' });
      break;
    default:
      wx.showToast({ title: `请求失败 (${statusCode})`, icon: 'none' });
  }
}
```

## 重试机制

### 自动重试

```typescript
// src/utils/retry.ts
interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    shouldRetry = (error) => !error.response || error.response.status >= 500,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (!shouldRetry(error) || attempt === maxRetries - 1) {
        throw error;
      }

      // 指数退避
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

// 使用示例
const users = await withRetry(
  () => userService.getList(),
  { maxRetries: 3, delay: 1000 }
);
```

## 错误上报

### 错误收集

```typescript
// src/utils/errorReporter.ts
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  method?: string;
  status?: number;
  timestamp: string;
  userAgent: string;
  userId?: string;
}

export function reportError(error: any, context?: Record<string, any>) {
  const report: ErrorReport = {
    message: error.message || String(error),
    stack: error.stack,
    url: error.config?.url || window.location.href,
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    userId: localStorage.getItem('userId') || undefined,
    ...context,
  };

  // 发送到监控服务
  if (import.meta.env.PROD) {
    // Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: report });
    }

    // 或自定义上报
    navigator.sendBeacon('/api/errors', JSON.stringify(report));
  } else {
    console.error('[Error Report]', report);
  }
}
```
