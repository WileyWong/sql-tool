# TypeScript 类型定义规范

## 基本原则

```typescript
// ✅ 优先使用 interface
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 联合类型/交叉类型用 type
type Status = 'active' | 'inactive';
type UserWithRole = User & { role: Role };

// ✅ 明确类型，避免 any
function getUser(id: number): Promise<User> {}

// ❌ 避免 any
function getUser(id: any): any {}
```

## 类型定义

### 接口定义

```typescript
// ✅ 可选属性
interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;  // 可选
}

// ✅ 只读属性
interface User {
  readonly id: number;
  name: string;
}

// ✅ 索引签名
interface Dictionary<T> {
  [key: string]: T;
}
```

### 泛型

```typescript
// ✅ API 响应泛型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ✅ 分页响应
interface PageResponse<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 使用
type UserListResponse = ApiResponse<PageResponse<User>>;
```

### 工具类型

```typescript
// ✅ Partial - 所有属性可选
type UpdateUserDTO = Partial<User>;

// ✅ Pick - 选取属性
type UserBasic = Pick<User, 'id' | 'name'>;

// ✅ Omit - 排除属性
type CreateUserDTO = Omit<User, 'id' | 'createTime'>;

// ✅ Required - 所有属性必填
type RequiredUser = Required<User>;

// ✅ Record - 键值对
type UserMap = Record<number, User>;
```

## Vue 类型

### Props 类型

```typescript
// ✅ 使用 interface 定义 Props
interface Props {
  userId: number;
  showAvatar?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
  size: 'medium',
});
```

### Emits 类型

```typescript
// ✅ 类型化 emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string, oldValue: string];
  'submit': [data: FormData];
}>();
```

### Ref 类型

```typescript
// ✅ 明确 ref 类型
const user = ref<User | null>(null);
const users = ref<User[]>([]);
const loading = ref(false);  // 自动推断为 boolean

// ✅ DOM ref
const inputRef = ref<HTMLInputElement | null>(null);
```

## API 类型

```typescript
// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  status: UserStatus;
  createTime: string;
}

export type UserStatus = 'active' | 'inactive' | 'banned';

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface UserQueryParams {
  username?: string;
  status?: UserStatus;
  pageNum: number;
  pageSize: number;
}
```

## 检查清单

- [ ] 优先使用 interface
- [ ] 避免使用 any
- [ ] 使用泛型定义通用类型
- [ ] 使用工具类型简化定义
- [ ] Props/Emits 明确类型
- [ ] API 类型单独文件管理

## 参考

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vue TypeScript](https://vuejs.org/guide/typescript/overview.html)
