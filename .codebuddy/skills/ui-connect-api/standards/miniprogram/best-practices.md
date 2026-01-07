# 小程序API调用最佳实践

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
│   └── user.d.ts           # 用户类型
├── utils/
│   └── upload.ts           # 上传工具
└── config/
    └── env.ts              # 环境配置
```

## API服务规范

### TypeScript版本

```typescript
// api/user.api.ts
import { http } from './request';
import type { User, UserQueryParams, CreateUserRequest, PageResponse } from '../types/user';

export const userApi = {
  /**
   * 获取用户列表
   */
  getList(params?: UserQueryParams): Promise<PageResponse<User>> {
    return http.get('/users', params);
  },

  /**
   * 获取用户详情
   */
  getById(id: number): Promise<User> {
    return http.get(`/users/${id}`);
  },

  /**
   * 创建用户
   */
  create(data: CreateUserRequest): Promise<User> {
    return http.post('/users', data);
  },

  /**
   * 更新用户
   */
  update(id: number, data: Partial<CreateUserRequest>): Promise<User> {
    return http.put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<void> {
    return http.delete(`/users/${id}`);
  },
};
```

### JavaScript版本

```javascript
// api/user.api.js
const { get, post, put, del } = require('./request');

module.exports = {
  /**
   * 获取用户列表
   * @param {object} params - 查询参数
   * @returns {Promise}
   */
  getList(params) {
    return get('/users', params);
  },

  /**
   * 获取用户详情
   * @param {number} id - 用户ID
   * @returns {Promise}
   */
  getById(id) {
    return get(`/users/${id}`);
  },

  /**
   * 创建用户
   * @param {object} data - 用户数据
   * @returns {Promise}
   */
  create(data) {
    return post('/users', data);
  },

  /**
   * 更新用户
   * @param {number} id - 用户ID
   * @param {object} data - 更新数据
   * @returns {Promise}
   */
  update(id, data) {
    return put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise}
   */
  delete(id) {
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

Page({
  data: {
    users: [] as User[],
    loading: false,
    page: 1,
    size: 20,
    total: 0,
    hasMore: true,
  },

  onLoad() {
    this.fetchUsers();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true });
    this.fetchUsers().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.fetchUsers(true);
    }
  },

  async fetchUsers(append = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const params: UserQueryParams = {
        page: this.data.page,
        size: this.data.size,
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

  handleUserTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/user/detail/detail?id=${id}` });
  },

  async handleDelete(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset;

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

Page({
  data: {
    form: {
      username: '',
      email: '',
      password: '',
    } as CreateUserRequest,
    submitting: false,
    errors: {} as Record<string, string>,
  },

  onInputChange(e: WechatMiniprogram.Input) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;

    this.setData({
      [`form.${field}`]: value,
      [`errors.${field}`]: '', // 清除错误
    });
  },

  validate(): boolean {
    const { form } = this.data;
    const errors: Record<string, string> = {};

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

  async handleSubmit() {
    if (!this.validate()) return;

    this.setData({ submitting: true });

    try {
      await userApi.create(this.data.form);
      wx.showToast({ title: '创建成功' });

      // 返回上一页
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

### WXML模板

```xml
<!-- pages/user/list/list.wxml -->
<view class="user-list">
  <!-- 用户列表 -->
  <view class="user-item" 
        wx:for="{{users}}" 
        wx:key="id"
        data-id="{{item.id}}"
        bindtap="handleUserTap">
    <view class="user-info">
      <text class="username">{{item.username}}</text>
      <text class="email">{{item.email}}</text>
    </view>
    <view class="user-actions">
      <button size="mini" 
              type="warn" 
              data-id="{{item.id}}"
              catchtap="handleDelete">
        删除
      </button>
    </view>
  </view>

  <!-- 加载状态 -->
  <view class="loading" wx:if="{{loading}}">
    <text>加载中...</text>
  </view>

  <!-- 无更多数据 -->
  <view class="no-more" wx:if="{{!hasMore && users.length > 0}}">
    <text>没有更多了</text>
  </view>

  <!-- 空状态 -->
  <view class="empty" wx:if="{{!loading && users.length === 0}}">
    <text>暂无数据</text>
  </view>
</view>
```

## Behavior复用

```typescript
// behaviors/listBehavior.ts

export const listBehavior = Behavior({
  data: {
    list: [],
    loading: false,
    page: 1,
    size: 20,
    total: 0,
    hasMore: true,
  },

  methods: {
    // 子页面需要实现此方法
    fetchListApi(_params: any): Promise<any> {
      throw new Error('请实现 fetchListApi 方法');
    },

    async fetchList(append = false) {
      if (this.data.loading) return;

      this.setData({ loading: true });

      try {
        const params = {
          page: this.data.page,
          size: this.data.size,
          ...this.getQueryParams?.() || {},
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

    onPullDownRefresh() {
      this.setData({ page: 1, hasMore: true });
      this.fetchList().finally(() => {
        wx.stopPullDownRefresh();
      });
    },

    onReachBottom() {
      if (this.data.hasMore && !this.data.loading) {
        this.setData({ page: this.data.page + 1 });
        this.fetchList(true);
      }
    },
  },
});
```

### 使用Behavior

```typescript
// pages/user/list/list.ts
import { listBehavior } from '../../../behaviors/listBehavior';
import { userApi } from '../../../api/user.api';

Page({
  behaviors: [listBehavior],

  onLoad() {
    this.fetchList();
  },

  // 实现 fetchListApi
  fetchListApi(params: any) {
    return userApi.getList(params);
  },

  // 可选：自定义查询参数
  getQueryParams() {
    return {
      keyword: this.data.keyword,
    };
  },
});
```

## 状态管理

```typescript
// store/user.ts
import { userApi } from '../api/user.api';
import type { User } from '../types/user';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

const state: UserState = {
  currentUser: null,
  isLoggedIn: false,
};

export const userStore = {
  get state() {
    return state;
  },

  async login(code: string) {
    // 登录逻辑
  },

  async fetchCurrentUser() {
    try {
      const user = await userApi.getById(wx.getStorageSync('userId'));
      state.currentUser = user;
      state.isLoggedIn = true;
    } catch (error) {
      state.currentUser = null;
      state.isLoggedIn = false;
    }
  },

  logout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userId');
    state.currentUser = null;
    state.isLoggedIn = false;
  },
};
```
