# 类型定义规范

## 通用API响应类型

### 基础响应结构

```typescript
// 统一API响应格式
interface ApiResponse<T = any> {
  code: number;           // 业务状态码 (0 或 200 表示成功)
  message: string;        // 提示信息
  data: T;                // 响应数据
  timestamp?: string;     // 时间戳
  requestId?: string;     // 请求ID
}
```

### 分页响应结构

> **⚠️ 重要**: 分页响应格式因项目而异，**必须根据后端实际返回格式定义**。
> 以下为常见格式参考，生成代码时需先确认项目实际使用的格式。

#### 常见分页格式对照表

| 后端框架 | 列表字段 | 总数字段 | 页码字段 | 每页条数 |
|---------|---------|---------|---------|---------|
| **Spring Boot** | `content` | `totalElements` | `number` (从0开始) | `size` |
| **Django REST** | `results` | `count` | - (使用 next/previous URL) | - |
| **Laravel** | `data` | `total` | `current_page` | `per_page` |
| **自定义格式A** | `list` | `total` | `page` | `pageSize` |
| **自定义格式B** | `items` | `pagination.total` | `pagination.page` | `pagination.size` |
| **游标分页** | `items` | - | - (使用 cursor) | `limit` |

#### 格式示例

```typescript
// ========== 格式1: Spring Boot 风格 ==========
interface SpringPageResponse<T> {
  content: T[];           // 数据列表
  totalElements: number;  // 总条数
  totalPages: number;     // 总页数
  number: number;         // 当前页码（从0开始）
  size: number;           // 每页条数
  first: boolean;         // 是否第一页
  last: boolean;          // 是否最后一页
}

// ========== 格式2: 扁平结构（常见自定义格式）==========
interface FlatPageResponse<T> {
  list: T[];              // 数据列表
  total: number;          // 总条数
  page: number;           // 当前页码（从1开始）
  pageSize: number;       // 每页条数
}

// ========== 格式3: 嵌套结构 ==========
interface NestedPageResponse<T> {
  items: T[];             // 数据列表
  pagination: {
    page: number;         // 当前页码（从1开始）
    size: number;         // 每页条数
    total: number;        // 总条数
    totalPages: number;   // 总页数
    hasNext: boolean;     // 是否有下一页
    hasPrev: boolean;     // 是否有上一页
  };
}

// ========== 格式4: 游标分页（大数据量场景）==========
interface CursorPageResponse<T> {
  items: T[];             // 数据列表
  cursor: string | null;  // 下一页游标，null 表示无更多数据
  hasMore: boolean;       // 是否有更多数据
}

// ========== 格式5: Django REST 风格 ==========
interface DjangoPageResponse<T> {
  count: number;          // 总条数
  next: string | null;    // 下一页 URL
  previous: string | null;// 上一页 URL
  results: T[];           // 数据列表
}
```

#### 使用指南

1. **新项目**: 与后端约定统一格式后，在项目中定义 `PageResponse<T>` 类型
2. **现有项目**: 根据后端实际返回格式定义类型，不要强行改变
3. **对接第三方API**: 直接使用第三方API的响应格式

```typescript
// 示例：根据项目实际情况定义
// 假设后端返回 { list, total, page, pageSize } 格式
interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 计算属性可在前端补充
const totalPages = Math.ceil(response.total / response.pageSize);
const hasNext = response.page < totalPages;
const hasPrev = response.page > 1;
```

// 错误响应格式
interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string>;  // 字段级错误
  stack?: string;                   // 仅开发环境
}
```

## 请求参数类型

### 分页参数

```typescript
interface PaginationParams {
  page?: number;          // 页码，从1开始
  size?: number;          // 每页条数
  sort?: string;          // 排序字段
  order?: 'asc' | 'desc'; // 排序方向
}
```

### 查询参数

```typescript
// 通用查询参数
interface QueryParams extends PaginationParams {
  keyword?: string;       // 关键词搜索
  startTime?: string;     // 开始时间
  endTime?: string;       // 结束时间
  status?: string;        // 状态筛选
}

// 业务查询参数示例
interface UserQueryParams extends PaginationParams {
  keyword?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  departmentId?: number;
}
```

### 请求体类型

```typescript
// 创建请求 - 必填字段
interface CreateUserRequest {
  username: string;       // 必填
  email: string;          // 必填
  password: string;       // 必填
  fullName?: string;      // 可选
}

// 更新请求 - 全部可选
interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  status?: 'active' | 'inactive';
}

// 使用 Partial 简化
type UpdateUserRequest = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
```

## 实体类型

### 基础实体

```typescript
// 基础字段
interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 业务实体
interface User extends BaseEntity {
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
}

// 枚举类型
type UserStatus = 'active' | 'inactive' | 'suspended';
type UserRole = 'admin' | 'user' | 'guest';

// 或使用 enum
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
```

### 关联实体

```typescript
// 嵌套类型
interface Order extends BaseEntity {
  orderNo: string;
  status: OrderStatus;
  totalAmount: number;
  user: Pick<User, 'id' | 'username' | 'fullName'>;  // 部分用户信息
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}
```

## 工具类型

### 常用工具类型

```typescript
// 使 T 的所有属性可选
type PartialEntity<T> = Partial<T>;

// 使 T 的所有属性必填
type RequiredEntity<T> = Required<T>;

// 选取 T 的部分属性
type PickEntity<T, K extends keyof T> = Pick<T, K>;

// 排除 T 的部分属性
type OmitEntity<T, K extends keyof T> = Omit<T, K>;

// 创建请求类型（排除自动生成字段）
type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// 更新请求类型（所有字段可选，排除不可更新字段）
type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// 列表项类型（简化版）
type ListItem<T> = Pick<T, 'id'> & Partial<T>;
```

### 示例

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// 创建用户请求
type CreateUserRequest = CreateRequest<User>;
// 等价于: { username: string; email: string; password: string; fullName: string; avatar: string; status: UserStatus; }

// 更新用户请求
type UpdateUserRequest = UpdateRequest<User>;
// 等价于: { username?: string; email?: string; password?: string; fullName?: string; avatar?: string; status?: UserStatus; }

// 用户列表项
type UserListItem = Pick<User, 'id' | 'username' | 'fullName' | 'status'>;
```

## 泛型使用

### API服务泛型

```typescript
// 通用GET请求
async function get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  const response = await axios.get<ApiResponse<T>>(url, { params });
  return response.data;
}

// 通用POST请求
async function post<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>> {
  const response = await axios.post<ApiResponse<T>>(url, data);
  return response.data;
}

// 使用示例
const users = await get<User[]>('/users');
const user = await post<User, CreateUserRequest>('/users', { username: 'test', ... });
```

### Composable泛型

```typescript
// 通用列表Composable
function useList<T, P extends PaginationParams = PaginationParams>(
  fetchFn: (params: P) => Promise<PageResponse<T>>,
  defaultParams?: Partial<P>
) {
  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const params = reactive<P>({ page: 1, size: 20, ...defaultParams } as P);
  
  const fetch = async () => {
    loading.value = true;
    try {
      const response = await fetchFn(params);
      items.value = response.items;
    } finally {
      loading.value = false;
    }
  };

  return { items, loading, params, fetch };
}

// 使用示例
const { items: users, loading, fetch } = useList<User, UserQueryParams>(
  (params) => userService.getList(params),
  { status: 'active' }
);
```

## 类型守卫

### 响应类型守卫

```typescript
// 检查是否为成功响应
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { code: 0 } {
  return response.code === 0;
}

// 检查是否为分页响应
function isPageResponse<T>(data: any): data is PageResponse<T> {
  return data && Array.isArray(data.items) && typeof data.pagination === 'object';
}

// 使用示例
const response = await userService.getList(params);
if (isSuccessResponse(response)) {
  // response.data 类型安全
  console.log(response.data);
}
```

### 错误类型守卫

```typescript
// 检查是否为API错误
function isApiError(error: any): error is ApiError {
  return error && typeof error.code === 'number' && typeof error.message === 'string';
}

// 检查是否为Axios错误
function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError === true;
}
```

## 小程序类型适配

### 请求类型

```typescript
// 小程序请求配置
interface WxRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

// 小程序响应
interface WxResponse<T = any> {
  data: T;
  statusCode: number;
  header: Record<string, string>;
}
```

### 类型声明文件

```typescript
// types/api.d.ts
declare namespace API {
  interface Response<T = any> {
    code: number;
    message: string;
    data: T;
  }

  interface PageResult<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
  }

  namespace User {
    interface Entity {
      id: number;
      username: string;
      // ...
    }

    interface CreateParams {
      username: string;
      // ...
    }

    interface QueryParams {
      keyword?: string;
      // ...
    }
  }
}
```
