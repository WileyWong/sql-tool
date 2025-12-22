# 最佳实践

性能优化、安全考虑和代码质量的最佳实践。

## 性能优化

### 请求去重
```typescript
// src/utils/requestCache.ts
const pendingRequests = new Map<string, Promise<any>>();

export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

// 使用示例
const fetchUser = (id: number) => {
  return deduplicateRequest(
    `user-${id}`,
    () => UserService.getUserById(id)
  );
};
```

### 请求缓存
```typescript
// src/utils/cache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // 生存时间（毫秒）
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
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const requestCache = new RequestCache();

// 使用示例
const fetchUserWithCache = async (id: number): Promise<User> => {
  const cacheKey = `user-${id}`;
  
  // 尝试从缓存获取
  const cached = requestCache.get<User>(cacheKey);
  if (cached) return cached;
  
  // 从API获取
  const user = await UserService.getUserById(id);
  
  // 缓存结果（5分钟）
  requestCache.set(cacheKey, user, 5 * 60 * 1000);
  
  return user;
};
```

### 防抖和节流
```typescript
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// 使用示例 - 搜索防抖
const debouncedSearch = debounce((keyword: string) => {
  UserService.getUsers({ keyword }).then(setUsers);
}, 500);
```

## 安全考虑

### XSS防护
```typescript
// 对用户输入进行转义
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 在显示用户数据时使用
const UserCard = ({ user }: { user: User }) => (
  <div>
    <h3>{escapeHtml(user.fullName)}</h3>
    <p>{escapeHtml(user.email)}</p>
  </div>
);
```

### CSRF防护
```typescript
// 添加CSRF Token
request.interceptors.request.use((config) => {
  const csrfToken = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  )?.content;
  
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
});
```

### 敏感数据处理
```typescript
// 不在日志中记录敏感信息
const sanitizeForLog = (data: any) => {
  const sensitive = ['password', 'token', 'secret', 'key'];
  const sanitized = { ...data };
  
  sensitive.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// 在请求拦截器中使用
request.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log('[Request]', config.method?.toUpperCase(), 
                config.url, sanitizeForLog(config.data));
  }
  return config;
});
```

## 代码质量

### 类型安全
```typescript
// 使用严格的类型定义
interface StrictApiResponse<T> {
  readonly code: number;
  readonly message: string;
  readonly data: T;
  readonly timestamp: string;
}

// 使用类型守卫
function isApiResponse<T>(obj: any): obj is StrictApiResponse<T> {
  return obj && 
         typeof obj.code === 'number' &&
         typeof obj.message === 'string' &&
         obj.data !== undefined &&
         typeof obj.timestamp === 'string';
}

// 在响应拦截器中验证
request.interceptors.response.use((response) => {
  if (!isApiResponse(response.data)) {
    console.warn('Invalid API response format:', response.data);
  }
  return response;
});
```

### 错误边界
```typescript
// 为API调用添加错误边界
export function withErrorBoundary<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  fallback?: (error: Error, ...args: Parameters<T>) => ReturnType<T>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error);
      
      if (fallback) {
        return fallback(error as Error, ...args);
      }
      
      throw error;
    }
  }) as T;
}

// 使用示例
export const UserServiceWithErrorBoundary = {
  getUsers: withErrorBoundary(
    UserService.getUsers,
    (error) => ({ items: [], pagination: defaultPagination })
  ),
};
```

### 测试友好的设计
```typescript
// 依赖注入，便于测试
export class ApiService {
  constructor(
    private httpClient: AxiosInstance = request,
    private cache: RequestCache = requestCache
  ) {}
  
  async getUsers(): Promise<User[]> {
    const response = await this.httpClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  }
}

// 测试中可以注入mock
const mockHttpClient = {
  get: jest.fn().mockResolvedValue({
    data: { data: [{ id: 1, name: 'Test User' }] }
  })
} as any;

const apiService = new ApiService(mockHttpClient);
```

## 监控和日志

### 性能监控
```typescript
// 请求性能监控
request.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

request.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    
    // 记录慢请求
    if (duration > 3000) {
      console.warn(`Slow request: ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  }
);
```

### 错误上报
```typescript
// 错误上报服务
export function reportError(error: Error, context?: any) {
  // 发送到监控服务（如Sentry）
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  }
  
  // 或发送到自定义错误收集API
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {
    // 静默处理上报失败
  });
}
```