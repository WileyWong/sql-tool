# TypeScript重构与优化指南

优化TypeScript代码，提升类型安全性、代码可维护性和开发体验。

## 执行流程

```
现有TypeScript代码
      ↓
步骤1：类型分析 → 识别any类型、类型断言滥用、类型定义问题
      ↓
步骤2：类型重构 → 定义接口/类型、泛型抽象、类型收窄
      ↓
步骤3：代码重构 → 模块化、类设计、工具类型应用
      ↓
步骤4：配置优化 → tsconfig严格模式、路径别名、声明文件
```

## 步骤1：类型分析

### 1.1 类型问题识别

| 问题类型 | 识别特征 | 影响 |
|----------|----------|------|
| any滥用 | 大量 `any` 类型 | 失去类型检查 |
| 类型断言过多 | 频繁 `as Type` | 可能运行时错误 |
| 重复类型定义 | 相似接口多处定义 | 维护困难 |
| 类型过于宽泛 | `string` 代替字面量联合 | 类型不精确 |
| 缺少null检查 | 未处理可选属性 | 运行时错误 |

### 1.2 诊断检查项

- [ ] 是否存在 `any` 类型（应尽量消除）
- [ ] 是否有不必要的类型断言
- [ ] 是否有重复的类型定义
- [ ] 是否正确处理了 `null`/`undefined`
- [ ] 是否使用了适当的泛型

## 步骤2：类型重构

### 2.1 消除any类型

**重构前**：
```typescript
function processData(data: any): any {
    return data.items.map((item: any) => item.name);
}
```

**重构后**：
```typescript
interface DataItem {
    id: number;
    name: string;
}

interface DataResponse {
    items: DataItem[];
    total: number;
}

function processData(data: DataResponse): string[] {
    return data.items.map(item => item.name);
}
```

### 2.2 接口与类型定义

**接口定义**：
```typescript
// 基础接口
interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

// 接口继承
interface AdminUser extends User {
    role: 'admin';
    permissions: string[];
}

// 可选属性
interface UserProfile {
    avatar?: string;
    bio?: string;
    website?: string;
}
```

**类型别名**：
```typescript
// 联合类型
type Status = 'pending' | 'approved' | 'rejected';

// 交叉类型
type UserWithProfile = User & UserProfile;

// 函数类型
type EventHandler<T> = (event: T) => void;

// 条件类型
type Nullable<T> = T | null;
```

### 2.3 泛型应用

**泛型函数**：
```typescript
// 重构前
function getFirst(arr: any[]): any {
    return arr[0];
}

// 重构后
function getFirst<T>(arr: T[]): T | undefined {
    return arr[0];
}
```

**泛型接口**：
```typescript
// API响应通用结构
interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// 分页数据
interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 使用
type UserListResponse = ApiResponse<PaginatedData<User>>;
```

**泛型约束**：
```typescript
// 约束必须有id属性
interface HasId {
    id: number | string;
}

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
    return items.find(item => item.id === id);
}
```

### 2.4 类型收窄

**类型守卫**：
```typescript
// 自定义类型守卫
function isUser(obj: unknown): obj is User {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'name' in obj
    );
}

// 使用
function processInput(input: unknown) {
    if (isUser(input)) {
        console.log(input.name); // 类型已收窄为User
    }
}
```

**区分联合类型**：
```typescript
interface SuccessResult {
    success: true;
    data: User;
}

interface ErrorResult {
    success: false;
    error: string;
}

type Result = SuccessResult | ErrorResult;

function handleResult(result: Result) {
    if (result.success) {
        console.log(result.data); // 类型收窄为SuccessResult
    } else {
        console.error(result.error); // 类型收窄为ErrorResult
    }
}
```

## 步骤3：代码重构

### 3.1 工具类型应用

**内置工具类型**：
```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Partial: 所有属性可选
type UserUpdate = Partial<User>;

// Required: 所有属性必填
type RequiredUser = Required<User>;

// Pick: 选取部分属性
type UserPublic = Pick<User, 'id' | 'name'>;

// Omit: 排除部分属性
type UserWithoutPassword = Omit<User, 'password'>;

// Readonly: 只读
type ReadonlyUser = Readonly<User>;

// Record: 键值对映射
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

**自定义工具类型**：
```typescript
// 深度Partial
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 非空类型
type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};

// 提取函数返回类型
type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
    T extends (...args: any) => Promise<infer R> ? R : never;
```

### 3.2 类设计

**抽象类与接口**：
```typescript
// 接口定义契约
interface Repository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    delete(id: string): Promise<void>;
}

// 抽象类提供部分实现
abstract class BaseRepository<T extends { id: string }> implements Repository<T> {
    protected abstract collection: string;
    
    abstract findById(id: string): Promise<T | null>;
    abstract findAll(): Promise<T[]>;
    
    async save(entity: T): Promise<T> {
        // 通用保存逻辑
        console.log(`Saving to ${this.collection}`);
        return entity;
    }
    
    async delete(id: string): Promise<void> {
        // 通用删除逻辑
        console.log(`Deleting ${id} from ${this.collection}`);
    }
}

// 具体实现
class UserRepository extends BaseRepository<User> {
    protected collection = 'users';
    
    async findById(id: string): Promise<User | null> {
        // 具体实现
        return null;
    }
    
    async findAll(): Promise<User[]> {
        // 具体实现
        return [];
    }
}
```

### 3.3 枚举与常量

**字符串枚举**：
```typescript
enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled'
}

// 使用
function updateStatus(orderId: string, status: OrderStatus) {
    // ...
}
updateStatus('123', OrderStatus.Shipped);
```

**const断言**：
```typescript
// 替代枚举的方案
const ORDER_STATUS = {
    Pending: 'pending',
    Processing: 'processing',
    Shipped: 'shipped',
} as const;

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
// 类型为 'pending' | 'processing' | 'shipped'
```

### 3.4 模块组织

```typescript
// types/user.ts - 类型定义
export interface User { ... }
export type UserRole = 'admin' | 'user';

// services/user.service.ts - 业务逻辑
import type { User, UserRole } from '../types/user';

export class UserService {
    async getUser(id: string): Promise<User> { ... }
}

// 使用 import type 仅导入类型（不影响运行时）
import type { User } from '../types/user';
```

## 步骤4：配置优化

### 4.1 严格模式配置

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "noImplicitThis": true,
        "alwaysStrict": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    }
}
```

### 4.2 路径别名

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@components/*": ["src/components/*"],
            "@utils/*": ["src/utils/*"],
            "@types/*": ["src/types/*"]
        }
    }
}
```

使用：
```typescript
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
import type { User } from '@types/user';
```

### 4.3 声明文件

**为第三方库添加类型**：
```typescript
// types/legacy-lib.d.ts
declare module 'legacy-lib' {
    export function doSomething(input: string): number;
    export interface Config {
        debug: boolean;
        timeout: number;
    }
}
```

**全局类型扩展**：
```typescript
// types/global.d.ts
declare global {
    interface Window {
        __APP_CONFIG__: {
            apiUrl: string;
            version: string;
        };
    }
}

export {}; // 确保这是一个模块
```

## 验证清单

### 类型安全
- [ ] 无 `any` 类型（或有充分理由）
- [ ] 无不必要的类型断言
- [ ] 正确处理 `null`/`undefined`
- [ ] 使用了适当的泛型

### 代码质量
- [ ] 接口/类型定义清晰
- [ ] 无重复的类型定义
- [ ] 使用了工具类型简化代码
- [ ] 模块组织合理

### 配置
- [ ] 启用了严格模式
- [ ] 配置了路径别名
- [ ] 有必要的声明文件

## 常见反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| `any` 滥用 | 失去类型检查 | 定义具体类型 |
| `as any` | 绕过类型检查 | 使用类型守卫 |
| `!` 非空断言 | 可能运行时错误 | 正确处理null |
| 过度类型断言 | 可能类型不匹配 | 使用泛型或类型守卫 |
| 导出 `any` | 污染其他模块 | 定义明确类型 |
| `@ts-ignore` | 隐藏问题 | 修复类型错误 |
