# TypeScript 命名规范

> 继承自 [通用命名规范](../common/naming.md)

## 变量命名

```typescript
// ✅ 小驼峰
const userName = 'John';
const isActive = true;
const maxRetryCount = 3;

// ✅ 常量全大写
const API_BASE_URL = '/api/v1';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ❌ 错误
const user_name = 'John';  // 不要下划线
const UserName = 'John';   // 变量不要大写开头
```

## 类型命名

```typescript
// ✅ 接口：大驼峰，I 前缀可选
interface User {
  id: number;
  name: string;
}

interface IUserService {
  getUser(id: number): Promise<User>;
}

// ✅ 类型别名：大驼峰
type UserId = number;
type UserStatus = 'active' | 'inactive';

// ✅ 枚举：大驼峰，成员大驼峰
enum OrderStatus {
  Pending = 'PENDING',
  Paid = 'PAID',
  Shipped = 'SHIPPED',
}
```

## 函数命名

```typescript
// ✅ 动词开头，小驼峰
function getUserById(id: number): User {}
function createOrder(data: CreateOrderDTO): Order {}
function isValidEmail(email: string): boolean {}
function hasPermission(user: User, action: string): boolean {}

// ✅ 事件处理：handle 前缀
function handleClick(event: MouseEvent): void {}
function handleSubmit(data: FormData): void {}

// ✅ 异步函数
async function fetchUserList(): Promise<User[]> {}
```

## Vue 组件命名

```typescript
// ✅ 组件文件：大驼峰或 kebab-case
// UserProfile.vue 或 user-profile.vue

// ✅ 组件名：大驼峰
export default defineComponent({
  name: 'UserProfile',
});

// ✅ Props：小驼峰
interface Props {
  userId: number;
  showAvatar?: boolean;
}

// ✅ Emits：kebab-case
const emit = defineEmits<{
  'update:value': [value: string];
  'item-click': [item: Item];
}>();
```

## Composables 命名

```typescript
// ✅ use 前缀
export function useUser(id: number) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  
  return { user, loading };
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // ...
}
```

## 文件命名

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 组件 | 大驼峰 | `UserProfile.vue` |
| Composables | 小驼峰，use 前缀 | `useUser.ts` |
| 工具函数 | 小驼峰 | `dateUtils.ts` |
| 类型定义 | 小驼峰 | `user.types.ts` |
| API | 小驼峰 | `userApi.ts` |
| 常量 | 小驼峰 | `constants.ts` |

## 检查清单

- [ ] 变量使用小驼峰
- [ ] 常量使用全大写下划线
- [ ] 类型/接口使用大驼峰
- [ ] 函数动词开头
- [ ] Vue 组件大驼峰
- [ ] Composables 用 use 前缀

## 参考

- [通用命名规范](../common/naming.md)
- [Vue 风格指南](https://vuejs.org/style-guide/)
