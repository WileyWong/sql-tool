# API命名规范

## 文件命名

### 服务文件

> **⭐ 统一命名风格**: 所有技术栈统一使用 `{resource}Service` 命名模式

| 技术栈 | 命名模式 | 示例 |
|--------|---------|------|
| Vue3 | `{resource}Service.ts` | `userService.ts`, `orderService.ts` |
| Vue2 | `{resource}Service.js/ts` | `userService.js`, `orderService.ts` |
| 小程序 | `{resource}Service.js/ts` | `userService.js`, `orderService.ts` |

> **⚠️ 废弃的命名模式**（兼容老项目，新项目勿用）:
> - `{resource}Api.ts` → 统一改为 `{resource}Service.ts`
> - `{resource}.api.ts` → 统一改为 `{resource}Service.ts`

### 类型文件

| 技术栈 | 命名模式 | 示例 |
|--------|---------|------|
| Vue3/Vue2 | `{resource}.types.ts` 或 `types/{resource}.ts` | `user.types.ts` |
| 小程序 | `{resource}.d.ts` 或 `types/{resource}.ts` | `user.d.ts` |

### Composable文件（Vue3）

```
use{Resource}.ts
use{Resource}{Action}.ts
```

示例：
- `useUser.ts`
- `useUserList.ts`
- `useUserCreate.ts`

## 函数命名

### API服务函数

```typescript
// 查询列表
get{Resource}List()
fetch{Resource}s()
query{Resource}s()

// 查询单个
get{Resource}ById(id)
get{Resource}Detail(id)
fetch{Resource}(id)

// 创建
create{Resource}(data)
add{Resource}(data)

// 更新
update{Resource}(id, data)
modify{Resource}(id, data)

// 删除
delete{Resource}(id)
remove{Resource}(id)

// 批量操作
batch{Action}{Resource}(ids)
bulk{Action}{Resource}(data)
```

### 示例

```typescript
// ✅ 正确
getUserList(params: UserQueryParams): Promise<PageResponse<User>>
getUserById(id: number): Promise<User>
createUser(data: CreateUserRequest): Promise<User>
updateUser(id: number, data: UpdateUserRequest): Promise<User>
deleteUser(id: number): Promise<void>

// ❌ 错误
getUsers()      // 不够明确
user()          // 动词缺失
fetchUserData() // 冗余
```

## 类型命名

### 请求类型

```typescript
// 查询参数
{Resource}QueryParams
{Resource}ListParams
{Resource}SearchParams

// 创建请求
Create{Resource}Request
{Resource}CreateDTO

// 更新请求
Update{Resource}Request
{Resource}UpdateDTO

// 通用请求体
{Resource}Payload
```

### 响应类型

```typescript
// 实体类型
{Resource}
{Resource}VO
{Resource}Detail

// 列表响应
{Resource}ListResponse
PageResponse<{Resource}>

// API响应包装
ApiResponse<T>
```

### 示例

```typescript
// ✅ 正确
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// ❌ 错误
interface UserData {}      // 不够明确
interface UserInfo {}      // 与User重复
interface UserReq {}       // 缩写不规范
```

## Composable命名（Vue3）

### 函数命名

```typescript
// 资源操作
use{Resource}()           // 综合操作
use{Resource}List()       // 列表查询
use{Resource}Detail()     // 详情查询
use{Resource}Create()     // 创建操作
use{Resource}Update()     // 更新操作
use{Resource}Delete()     // 删除操作

// 通用功能
useApi()                  // 通用API调用
usePagination()           // 分页
useSearch()               // 搜索
useLoading()              // 加载状态
```

### 返回值命名

```typescript
// 状态
data, list, detail        // 数据
loading, isLoading        // 加载状态
error, errorMessage       // 错误信息

// 分页
pagination, paging        // 分页信息
page, pageSize            // 当前页/页大小
total, totalPages         // 总数/总页数
hasNext, hasPrev          // 是否有下一页/上一页

// 方法
fetch, refetch, refresh   // 获取数据
create, add               // 创建
update, modify            // 更新
remove, del               // 删除
reset                     // 重置
```

### 示例

```typescript
// ✅ 正确
export function useUserList() {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const pagination = reactive({
    page: 1,
    size: 20,
    total: 0,
  });

  const fetchUsers = async () => { /* ... */ };
  const changePage = (page: number) => { /* ... */ };

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    pagination,
    fetchUsers,
    changePage,
  };
}
```

## 常量命名

### API路径

```typescript
// 模块化路径
const API_PREFIX = '/api/v1';

const USER_API = {
  LIST: `${API_PREFIX}/users`,
  DETAIL: (id: number) => `${API_PREFIX}/users/${id}`,
  CREATE: `${API_PREFIX}/users`,
  UPDATE: (id: number) => `${API_PREFIX}/users/${id}`,
  DELETE: (id: number) => `${API_PREFIX}/users/${id}`,
};
```

### 错误码

```typescript
const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
};
```

## 小程序特殊规范

### 文件命名

```
api/
├── index.ts          # 统一导出
├── request.ts        # 请求封装
├── user.api.ts       # 用户API
└── types/
    └── user.d.ts     # 用户类型
```

### 函数命名

```typescript
// 小程序推荐使用更简洁的命名
export const userApi = {
  getList: (params: UserQueryParams) => request.get('/users', params),
  getById: (id: number) => request.get(`/users/${id}`),
  create: (data: CreateUserRequest) => request.post('/users', data),
  update: (id: number, data: UpdateUserRequest) => request.put(`/users/${id}`, data),
  delete: (id: number) => request.delete(`/users/${id}`),
};
```
