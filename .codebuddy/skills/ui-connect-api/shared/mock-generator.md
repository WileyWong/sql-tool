# Mock数据生成指南

## 概述

从接口定义生成Mock数据，用于前端开发和测试。本指南适用于所有技术栈（Vue3/Vue2/小程序）。

## Mock数据策略

### 基于类型生成

| 数据类型 | Mock策略 |
|---------|---------|
| number | 随机数或递增ID |
| string | 根据字段名生成 |
| boolean | 随机true/false |
| Date/string(date) | 随机日期 |
| enum/联合类型 | 随机选择 |
| T[]/Array | 生成数组 |

### 基于字段名生成

| 字段名模式 | Mock值 |
|-----------|--------|
| id, *Id | 递增数字 |
| name, *Name | 随机姓名 |
| email | 随机邮箱 |
| phone, mobile | 随机手机号 |
| avatar, *Url | 随机图片URL |
| *At, *Time | 随机时间 |
| status | 枚举值随机 |
| description, content | 随机文本 |

---

## TypeScript 版本

### Mock数据文件

```typescript
// src/mock/user.mock.ts
import type { User, UserQueryParams, PageResponse } from '@/types/user';

// Mock用户数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    fullName: '张三',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    username: 'lisi',
    email: 'lisi@example.com',
    fullName: '李四',
    status: 'active',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
];

// Mock服务
export const mockUserService = {
  getList(params?: UserQueryParams): Promise<PageResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page = 1, size = 20, keyword, status } = params || {};
        
        let filtered = [...mockUsers];
        
        if (keyword) {
          filtered = filtered.filter(
            (u) =>
              u.username.includes(keyword) ||
              u.fullName.includes(keyword) ||
              u.email.includes(keyword)
          );
        }
        
        if (status) {
          filtered = filtered.filter((u) => u.status === status);
        }
        
        const start = (page - 1) * size;
        const items = filtered.slice(start, start + size);
        
        resolve({
          items,
          pagination: {
            page,
            size,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
            hasNext: start + size < filtered.length,
            hasPrev: page > 1,
          },
        });
      }, 300);
    });
  },

  getById(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('用户不存在'));
        }
      }, 200);
    });
  },

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...data,
          id: mockUsers.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 300);
    });
  },

  update(id: number, data: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers[index] = {
            ...mockUsers[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          resolve(mockUsers[index]);
        } else {
          reject(new Error('用户不存在'));
        }
      }, 300);
    });
  },

  delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers.splice(index, 1);
          resolve();
        } else {
          reject(new Error('用户不存在'));
        }
      }, 200);
    });
  },
};
```

### Mock工具函数（TypeScript）

```typescript
// src/mock/utils.ts

export function generateId(): number {
  return Math.floor(Math.random() * 1000000);
}

export function generateString(length: number = 8): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

export function generateEmail(): string {
  return `${generateString(8)}@example.com`;
}

export function generatePhone(): string {
  return `1${['3', '5', '7', '8', '9'][Math.floor(Math.random() * 5)]}${Array(9)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('')}`;
}

export function generateDate(start?: Date, end?: Date): string {
  const startTime = start?.getTime() || new Date('2024-01-01').getTime();
  const endTime = end?.getTime() || Date.now();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime).toISOString();
}

export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateArray<T>(
  generator: (index: number) => T,
  count: number
): T[] {
  return Array.from({ length: count }, (_, i) => generator(i));
}

const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];

export function generateChineseName(): string {
  return randomPick(surnames) + randomPick(givenNames) + (Math.random() > 0.5 ? randomPick(givenNames) : '');
}
```

---

## JavaScript 版本

### Mock数据文件

```javascript
// src/mock/user.mock.js

const mockUsers = [
  {
    id: 1,
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    fullName: '张三',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    username: 'lisi',
    email: 'lisi@example.com',
    fullName: '李四',
    status: 'active',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
];

/**
 * Mock服务
 */
export const mockUserService = {
  /**
   * 获取用户列表
   * @param {Object} params
   * @returns {Promise}
   */
  getList(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { page = 1, size = 20, keyword, status } = params || {};
        
        let filtered = [...mockUsers];
        
        if (keyword) {
          filtered = filtered.filter(
            (u) =>
              u.username.includes(keyword) ||
              u.fullName.includes(keyword) ||
              u.email.includes(keyword)
          );
        }
        
        if (status) {
          filtered = filtered.filter((u) => u.status === status);
        }
        
        const start = (page - 1) * size;
        const items = filtered.slice(start, start + size);
        
        resolve({
          items,
          pagination: {
            page,
            size,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
          },
        });
      }, 300);
    });
  },

  /**
   * 获取用户详情
   * @param {number} id
   * @returns {Promise}
   */
  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.id === id);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('用户不存在'));
        }
      }, 200);
    });
  },

  /**
   * 创建用户
   * @param {Object} data
   * @returns {Promise}
   */
  create(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...data,
          id: mockUsers.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 300);
    });
  },

  /**
   * 更新用户
   * @param {number} id
   * @param {Object} data
   * @returns {Promise}
   */
  update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers[index] = {
            ...mockUsers[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          resolve(mockUsers[index]);
        } else {
          reject(new Error('用户不存在'));
        }
      }, 300);
    });
  },

  /**
   * 删除用户
   * @param {number} id
   * @returns {Promise}
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers.splice(index, 1);
          resolve();
        } else {
          reject(new Error('用户不存在'));
        }
      }, 200);
    });
  },
};

export default mockUserService;
```

### Mock工具函数（JavaScript）

```javascript
// src/mock/utils.js

/**
 * 生成随机ID
 * @returns {number}
 */
export function generateId() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * 生成随机字符串
 * @param {number} length
 * @returns {string}
 */
export function generateString(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length);
}

/**
 * 生成随机邮箱
 * @returns {string}
 */
export function generateEmail() {
  return `${generateString(8)}@example.com`;
}

/**
 * 生成随机手机号
 * @returns {string}
 */
export function generatePhone() {
  const prefixes = ['13', '15', '17', '18', '19'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let number = '';
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return prefix + number;
}

/**
 * 生成随机日期
 * @param {Date} [start]
 * @param {Date} [end]
 * @returns {string}
 */
export function generateDate(start, end) {
  const startTime = start ? start.getTime() : new Date('2024-01-01').getTime();
  const endTime = end ? end.getTime() : Date.now();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime).toISOString();
}

/**
 * 从数组中随机选择
 * @param {Array} arr
 * @returns {*}
 */
export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 生成Mock数组
 * @param {Function} generator
 * @param {number} count
 * @returns {Array}
 */
export function generateArray(generator, count) {
  return Array.from({ length: count }, (_, i) => generator(i));
}

const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];

/**
 * 生成随机中文姓名
 * @returns {string}
 */
export function generateChineseName() {
  return randomPick(surnames) + randomPick(givenNames) + (Math.random() > 0.5 ? randomPick(givenNames) : '');
}
```

---

## 使用 Mock.js 库

### TypeScript 版本

```typescript
// src/mock/user.mockjs.ts
import Mock from 'mockjs';
import type { User } from '@/types/user';

const userTemplate = {
  'id|+1': 1,
  username: '@word(5, 10)',
  email: '@email',
  fullName: '@cname',
  'status|1': ['active', 'inactive', 'suspended'],
  createdAt: '@datetime("yyyy-MM-ddTHH:mm:ssZ")',
  updatedAt: '@datetime("yyyy-MM-ddTHH:mm:ssZ")',
};

export function generateMockUsers(count: number = 10): User[] {
  return Mock.mock({
    [`list|${count}`]: [userTemplate],
  }).list;
}

Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options: any) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '20');
  
  const allUsers = generateMockUsers(100);
  const start = (page - 1) * size;
  const items = allUsers.slice(start, start + size);
  
  return {
    code: 0,
    message: 'success',
    data: { items, pagination: { page, size, total: allUsers.length } },
  };
});
```

### JavaScript 版本

```javascript
// src/mock/user.mockjs.js
import Mock from 'mockjs';

const userTemplate = {
  'id|+1': 1,
  username: '@word(5, 10)',
  email: '@email',
  fullName: '@cname',
  'status|1': ['active', 'inactive', 'suspended'],
  createdAt: '@datetime("yyyy-MM-ddTHH:mm:ssZ")',
  updatedAt: '@datetime("yyyy-MM-ddTHH:mm:ssZ")',
};

/**
 * 生成Mock用户数据
 * @param {number} count
 * @returns {Array}
 */
export function generateMockUsers(count = 10) {
  return Mock.mock({
    [`list|${count}`]: [userTemplate],
  }).list;
}

Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '20');
  
  const allUsers = generateMockUsers(100);
  const start = (page - 1) * size;
  const items = allUsers.slice(start, start + size);
  
  return {
    code: 0,
    message: 'success',
    data: { items, pagination: { page, size, total: allUsers.length } },
  };
});
```

---

## 环境切换

### Vue3 (Vite)

```typescript
// src/services/userService.ts
import { mockUserService } from '@/mock/user.mock';
import { realUserService } from './userService.real';

export const userService = import.meta.env.VITE_USE_MOCK === 'true'
  ? mockUserService
  : realUserService;
```

```bash
# .env.development
VITE_USE_MOCK=true

# .env.production
VITE_USE_MOCK=false
```

### Vue2 (Vue CLI)

```javascript
// src/api/user.js
import mockUserService from '@/mock/user.mock';
import realUserService from './user.real';

const userService = process.env.VUE_APP_USE_MOCK === 'true'
  ? mockUserService
  : realUserService;

export default userService;
```

```bash
# .env.development
VUE_APP_USE_MOCK=true

# .env.production
VUE_APP_USE_MOCK=false
```

### 小程序

```javascript
// config/env.js
const env = {
  development: { useMock: true, baseUrl: 'https://dev-api.example.com' },
  production: { useMock: false, baseUrl: 'https://api.example.com' },
};

const currentEnv = __wxConfig.envVersion || 'release';
const envMap = { develop: 'development', trial: 'development', release: 'production' };

module.exports = env[envMap[currentEnv] || 'production'];
```

```javascript
// api/user.api.js
const config = require('../config/env');
const mockUserApi = require('../mock/user.mock');
const realUserApi = require('./user.real');

const userApi = config.useMock ? mockUserApi : realUserApi;
module.exports = userApi;
```

---

## 检查清单

```yaml
mock_checklist:
  数据完整性:
    - [ ] 所有字段都有Mock值
    - [ ] 数据类型正确
    - [ ] 枚举值在有效范围内
  
  功能完整性:
    - [ ] CRUD操作都已Mock
    - [ ] 分页逻辑正确
    - [ ] 筛选逻辑正确
    - [ ] 错误情况已处理
  
  使用体验:
    - [ ] 模拟网络延迟
    - [ ] 数据看起来真实
    - [ ] 环境切换方便
  
  小程序特有（如适用）:
    - [ ] 响应格式符合小程序规范
    - [ ] 支持下拉刷新场景
    - [ ] 支持上拉加载场景
```
