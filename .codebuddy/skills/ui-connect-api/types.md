# 类型定义系统

TypeScript类型定义确保端到端类型安全。

## 通用API类型

```typescript
// src/types/api.ts
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;  
  };
}

export interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string>;
}
```

## 业务实体类型

```typescript
// src/types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  keyword?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
```

## 最佳实践

✅ **使用泛型**：
```typescript
const response = await api.get<ApiResponse<User>>('/users/123');
const user: User = response.data.data; // 类型安全
```

✅ **联合类型**：
```typescript
type Status = 'active' | 'inactive' | 'suspended'; // 而不是 string
```

✅ **可选字段**：
```typescript
interface UpdateUserRequest {
  email?: string;    // 可选
  fullName?: string; // 可选
}
```