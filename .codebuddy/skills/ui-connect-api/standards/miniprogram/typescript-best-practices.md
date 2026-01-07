# 小程序 TypeScript 最佳实践

## 概述

本文档介绍在微信小程序中使用 TypeScript 进行 API 调用的最佳实践。

## 项目配置

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationDir": "./typings",
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "lib": ["ES2017"],
    "types": ["miniprogram-api-typings"]
  },
  "include": [
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "miniprogram_npm"
  ]
}
```

### 安装类型定义

```bash
npm install miniprogram-api-typings --save-dev
```

## 目录结构

```
miniprogram/
├── api/
│   ├── index.ts            # 统一导出
│   ├── request.ts          # 请求封装
│   ├── user.api.ts         # 用户API
│   └── order.api.ts        # 订单API
├── types/
│   ├── api.d.ts            # API通用类型
│   ├── user.d.ts           # 用户类型
│   └── order.d.ts          # 订单类型
├── utils/
│   └── upload.ts           # 上传工具
└── config/
    └── env.ts              # 环境配置
```

## 类型定义规范

### 通用API类型

```typescript
// types/api.d.ts

/** API响应结构 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 分页参数 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/** 分页信息 */
export interface Pagination {
  page: number;
  size: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** 分页响应 */
export interface PageResponse<T> {
  items: T[];
  pagination: Pagination;
}

/** 请求配置 */
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  showLoading?: boolean;
  loadingText?: string;
  showError?: boolean;
}
```

### 业务类型定义

```typescript
// types/user.d.ts

/** 用户状态 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/** 用户实体 */
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/** 用户查询参数 */
export interface UserQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: UserStatus;
}

/** 创建用户请求 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

/** 更新用户请求 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  status?: UserStatus;
}
```

## 请求封装

### TypeScript版本请求封装

```typescript
// api/request.ts
import type { ApiResponse, RequestConfig } from '../types/api';

// ============ 配置区域 ============

const BASE_URL = 'https://api.example.com';
const TIMEOUT = 30000;
const TOKEN_KEY = 'access_token';
const LOGIN_PAGE = '/pages/login/index';

// ============ 工具函数 ============

export function getToken(): string {
  return wx.getStorageSync(TOKEN_KEY) || '';
}

export function setToken(token: string): void {
  wx.setStorageSync(TOKEN_KEY, token);
}

export function clearToken(): void {
  wx.removeStorageSync(TOKEN_KEY);
}

function redirectToLogin(): void {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentPath = currentPage ? `/${currentPage.route}` : '';
  
  if (currentPath === LOGIN_PAGE) return;
  
  clearToken();
  wx.redirectTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(currentPath)}`
  });
}

// ============ 错误处理 ============

const BusinessErrorMessages: Record<number, string> = {
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  500: '服务器内部错误'
};

function handleBusinessError(response: ApiResponse): void {
  const message = BusinessErrorMessages[response.code] || response.message || '操作失败';
  
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
  
  if (response.code === 401) {
    redirectToLogin();
  }
}

function handleHttpError(statusCode: number): void {
  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求地址不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  };
  
  wx.showToast({
    title: messages[statusCode] || `请求失败(${statusCode})`,
    icon: 'none',
    duration: 2000
  });
  
  if (statusCode === 401) {
    redirectToLogin();
  }
}

// ============ 核心请求函数 ============

export function request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
  const {
    url,
    method,
    data,
    header = {},
    timeout = TIMEOUT,
    showLoading = false,
    loadingText = '加载中...',
    showError = true
  } = config;
  
  if (showLoading) {
    wx.showLoading({ title: loadingText, mask: true });
  }
  
  return new Promise((resolve, reject) => {
    const token = getToken();
    
    wx.request({
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      timeout,
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }
        
        const response = res.data as ApiResponse<T>;
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (response.code === 0 || response.code === 200) {
            resolve(response);
          } else {
            if (showError) {
              handleBusinessError(response);
            }
            reject(response);
          }
        } else {
          if (showError) {
            handleHttpError(res.statusCode);
          }
          reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        if (showLoading) {
          wx.hideLoading();
        }
        
        if (showError) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none',
            duration: 2000
          });
        }
        reject(err);
      }
    });
  });
}

// ============ 便捷方法 ============

export function get<T = any>(
  url: string, 
  params?: any, 
  config?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'GET', data: params, ...config });
}

export function post<T = any>(
  url: string, 
  data?: any, 
  config?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'POST', data, ...config });
}

export function put<T = any>(
  url: string, 
  data?: any, 
  config?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'PUT', data, ...config });
}

export function del<T = any>(
  url: string, 
  params?: any, 
  config?: Partial<RequestConfig>
): Promise<ApiResponse<T>> {
  return request<T>({ url, method: 'DELETE', data: params, ...config });
}
```

## API服务定义

```typescript
// api/user.api.ts
import { get, post, put, del } from './request';
import type { 
  User, 
  UserQueryParams, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../types/user';
import type { PageResponse } from '../types/api';

export const userApi = {
  /**
   * 获取用户列表
   */
  getList(params?: UserQueryParams): Promise<PageResponse<User>> {
    return get('/users', params);
  },

  /**
   * 获取用户详情
   */
  getById(id: number): Promise<User> {
    return get(`/users/${id}`);
  },

  /**
   * 创建用户
   */
  create(data: CreateUserRequest): Promise<User> {
    return post('/users', data);
  },

  /**
   * 更新用户
   */
  update(id: number, data: UpdateUserRequest): Promise<User> {
    return put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<void> {
    return del(`/users/${id}`);
  },
};
```

## 页面中使用

### 列表页面

```typescript
// pages/user/list/list.ts
import { userApi } from '../../../api/user.api';
import type { User, UserQueryParams } from '../../../types/user';
import type { Pagination } from '../../../types/api';

interface PageData {
  users: User[];
  loading: boolean;
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
  keyword: string;
}

Page<PageData, WechatMiniprogram.Page.CustomOption>({
  data: {
    users: [],
    loading: false,
    page: 1,
    size: 20,
    total: 0,
    hasMore: true,
    keyword: '',
  },

  onLoad() {
    this.fetchUsers();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.fetchUsers().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.fetchUsers(true);
    }
  },

  async fetchUsers(append = false): Promise<void> {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const params: UserQueryParams = {
        page: this.data.page,
        size: this.data.size,
        keyword: this.data.keyword || undefined,
      };

      const { items, pagination } = await userApi.getList(params);

      this.setData({
        users: append ? [...this.data.users, ...items] : items,
        total: pagination.total,
        hasMore: pagination.hasNext,
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  onSearchInput(e: WechatMiniprogram.Input): void {
    this.setData({ keyword: e.detail.value });
  },

  onSearch(): void {
    this.setData({ page: 1, hasMore: true });
    this.fetchUsers();
  },

  handleUserTap(e: WechatMiniprogram.TouchEvent): void {
    const { id } = e.currentTarget.dataset as { id: number };
    wx.navigateTo({ url: `/pages/user/detail/detail?id=${id}` });
  },

  async handleDelete(e: WechatMiniprogram.TouchEvent): Promise<void> {
    const { id } = e.currentTarget.dataset as { id: number };

    const { confirm } = await wx.showModal({
      title: '提示',
      content: '确定删除该用户？',
    });

    if (!confirm) return;

    try {
      await userApi.delete(id);
      wx.showToast({ title: '删除成功' });
      this.fetchUsers();
    } catch (error) {
      // 错误已在请求封装中处理
    }
  },
});
```

### 表单页面

```typescript
// pages/user/form/form.ts
import { userApi } from '../../../api/user.api';
import type { CreateUserRequest } from '../../../types/user';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

interface PageData {
  form: FormData;
  errors: FormErrors;
  submitting: boolean;
}

Page<PageData, WechatMiniprogram.Page.CustomOption>({
  data: {
    form: {
      username: '',
      email: '',
      password: '',
    },
    errors: {},
    submitting: false,
  },

  onInputChange(e: WechatMiniprogram.Input): void {
    const { field } = e.currentTarget.dataset as { field: keyof FormData };
    const { value } = e.detail;

    this.setData({
      [`form.${field}`]: value,
      [`errors.${field}`]: '',
    });
  },

  validate(): boolean {
    const { form } = this.data;
    const errors: FormErrors = {};

    if (!form.username.trim()) {
      errors.username = '请输入用户名';
    } else if (form.username.length < 3) {
      errors.username = '用户名至少3个字符';
    }

    if (!form.email.trim()) {
      errors.email = '请输入邮箱';
    } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(form.email)) {
      errors.email = '邮箱格式不正确';
    }

    if (!form.password) {
      errors.password = '请输入密码';
    } else if (form.password.length < 6) {
      errors.password = '密码至少6个字符';
    }

    this.setData({ errors });
    return Object.keys(errors).length === 0;
  },

  async handleSubmit(): Promise<void> {
    if (!this.validate()) return;

    this.setData({ submitting: true });

    try {
      const request: CreateUserRequest = {
        username: this.data.form.username,
        email: this.data.form.email,
        password: this.data.form.password,
      };

      await userApi.create(request);
      wx.showToast({ title: '创建成功' });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      // 错误已在请求封装中处理
    } finally {
      this.setData({ submitting: false });
    }
  },
});
```

## Behavior 复用

```typescript
// behaviors/listBehavior.ts
import type { Pagination } from '../types/api';

interface ListData<T> {
  list: T[];
  loading: boolean;
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
}

export const listBehavior = Behavior({
  data: {
    list: [],
    loading: false,
    page: 1,
    size: 20,
    total: 0,
    hasMore: true,
  } as ListData<any>,

  methods: {
    // 子页面需要实现此方法
    fetchListApi(_params: any): Promise<{ items: any[]; pagination: Pagination }> {
      throw new Error('请实现 fetchListApi 方法');
    },

    getQueryParams(): Record<string, any> {
      return {};
    },

    async fetchList(append = false): Promise<void> {
      if (this.data.loading) return;

      this.setData({ loading: true });

      try {
        const params = {
          page: this.data.page,
          size: this.data.size,
          ...this.getQueryParams(),
        };

        const { items, pagination } = await this.fetchListApi(params);

        this.setData({
          list: append ? [...this.data.list, ...items] : items,
          total: pagination.total,
          hasMore: pagination.hasNext,
        });
      } catch (error) {
        console.error('获取列表失败:', error);
      } finally {
        this.setData({ loading: false });
      }
    },

    onPullDownRefresh(): void {
      this.setData({ page: 1, hasMore: true });
      this.fetchList().finally(() => {
        wx.stopPullDownRefresh();
      });
    },

    onReachBottom(): void {
      if (this.data.hasMore && !this.data.loading) {
        this.setData({ page: this.data.page + 1 });
        this.fetchList(true);
      }
    },
  },
});
```

## 检查清单

```yaml
typescript_checklist:
  项目配置:
    - [ ] tsconfig.json 配置正确
    - [ ] miniprogram-api-typings 已安装
    - [ ] 路径别名配置正确
  
  类型定义:
    - [ ] API响应类型完整
    - [ ] 业务实体类型完整
    - [ ] 请求参数类型完整
    - [ ] 分页类型正确
  
  API服务:
    - [ ] 泛型使用正确
    - [ ] 返回类型明确
    - [ ] 参数类型正确
  
  页面组件:
    - [ ] Page泛型正确使用
    - [ ] 事件类型正确
    - [ ] dataset类型断言
  
  编译验证:
    - [ ] tsc --noEmit 成功
    - [ ] 小程序开发者工具编译成功
```
