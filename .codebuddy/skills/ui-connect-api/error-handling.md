# 错误处理策略

统一的错误处理机制，提供友好的用户体验。

## 错误分类

### 网络错误
```typescript
// 无响应（网络断开、服务器不可达）
if (!error.response) {
  showErrorMessage('网络连接失败，请检查网络');
  return;
}
```

### HTTP状态码错误
```typescript
const { status, data } = error.response;

switch (status) {
  case 400:
    showErrorMessage(data.message || '请求参数错误');
    break;
  case 401:
    handleAuthError();
    break;
  case 403:
    showErrorMessage('权限不足');
    break;
  case 404:
    showErrorMessage('请求的资源不存在');
    break;
  case 422:
    handleValidationError(data.errors);
    break;
  case 500:
    showErrorMessage('服务器内部错误');
    break;
}
```

## 表单验证错误处理

```typescript
interface ValidationErrors {
  [field: string]: string;
}

const handleValidationError = (errors: ValidationErrors) => {
  Object.entries(errors).forEach(([field, message]) => {
    // 显示字段级错误
    showFieldError(field, message);
  });
};

// Vue中的使用
const fieldErrors = ref<ValidationErrors>({});

const handleSubmit = async (data: CreateUserRequest) => {
  try {
    await UserService.createUser(data);
    fieldErrors.value = {}; // 清空错误
  } catch (error) {
    if (error.response?.status === 422) {
      fieldErrors.value = error.response.data.errors || {};
    }
  }
};
```

## 重试机制

```typescript
async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // 只对特定错误重试（如网络错误、5xx错误）
      const shouldRetry = !error.response || 
                         error.response.status >= 500;
      
      if (!shouldRetry) throw error;
      
      // 指数退避
      const waitTime = delay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// 使用示例
const fetchUsers = async () => {
  try {
    const users = await requestWithRetry(
      () => UserService.getUsers(),
      3, // 重试3次
      1000 // 初始延迟1秒
    );
    setUsers(users.items);
  } catch (error) {
    console.error('获取用户失败:', error);
  }
};
```

## 全局错误处理

### Vue错误处理
```typescript
// src/main.ts
import { createApp } from 'vue';

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err, info);
  // 发送错误到监控服务
  // reportError(err, { instance, info });
};

// 全局未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // 发送错误到监控服务
  // reportError(event.reason);
});
```

## 用户友好的错误提示

```typescript
// src/utils/errorMessage.ts
const ErrorMessages: Record<string, string> = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器繁忙，请稍后重试',
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  AUTH_ERROR: '登录已过期，请重新登录',
  PERMISSION_ERROR: '权限不足，无法执行此操作',
  NOT_FOUND_ERROR: '请求的资源不存在',
};

export function getErrorMessage(error: any): string {
  // API错误
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // 网络错误
  if (!error.response) {
    return ErrorMessages.NETWORK_ERROR;
  }
  
  // HTTP状态码错误
  const status = error.response.status;
  switch (status) {
    case 401:
      return ErrorMessages.AUTH_ERROR;
    case 403:
      return ErrorMessages.PERMISSION_ERROR;
    case 404:
      return ErrorMessages.NOT_FOUND_ERROR;
    case 422:
      return ErrorMessages.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorMessages.SERVER_ERROR;
    default:
      return `请求失败 (${status})`;
  }
}
```