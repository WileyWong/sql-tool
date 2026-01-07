# Vue2 API调用最佳实践

## 目录结构

```
src/
├── api/                    # 或 services/
│   ├── index.js            # 统一导出
│   ├── request.js          # Axios实例配置
│   ├── user.js             # 用户服务
│   └── order.js            # 订单服务
├── mixins/
│   └── listMixin.js        # 列表页Mixin
└── utils/
    └── http.js             # HTTP工具函数
```

## Service层规范

### JavaScript版本

```javascript
// src/api/user.js
import { get, post, put, del } from '@/utils/http';

/**
 * 用户服务
 */
export default {
  /**
   * 获取用户列表
   * @param {object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页条数
   * @param {string} params.keyword - 搜索关键词
   * @returns {Promise<{items: Array, pagination: object}>}
   */
  getList(params) {
    return get('/users', params);
  },

  /**
   * 获取用户详情
   * @param {number} id - 用户ID
   * @returns {Promise<object>}
   */
  getById(id) {
    return get(`/users/${id}`);
  },

  /**
   * 创建用户
   * @param {object} data - 用户数据
   * @returns {Promise<object>}
   */
  create(data) {
    return post('/users', data);
  },

  /**
   * 更新用户
   * @param {number} id - 用户ID
   * @param {object} data - 更新数据
   * @returns {Promise<object>}
   */
  update(id, data) {
    return put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise<void>}
   */
  delete(id) {
    return del(`/users/${id}`);
  },
};
```

### TypeScript版本

```typescript
// src/api/user.ts
import { get, post, put, del } from '@/utils/http';

export interface User {
  id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface PageResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export default {
  getList(params?: UserQueryParams): Promise<PageResponse<User>> {
    return get('/users', params);
  },

  getById(id: number): Promise<User> {
    return get(`/users/${id}`);
  },

  create(data: CreateUserRequest): Promise<User> {
    return post('/users', data);
  },

  update(id: number, data: Partial<CreateUserRequest>): Promise<User> {
    return put(`/users/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return del(`/users/${id}`);
  },
};
```

## Mixin模式

### 列表页Mixin

```javascript
// src/mixins/listMixin.js
export default {
  data() {
    return {
      // 列表数据
      list: [],
      // 加载状态
      loading: false,
      // 分页
      pagination: {
        page: 1,
        size: 20,
        total: 0,
      },
      // 查询参数
      queryParams: {},
    };
  },

  methods: {
    /**
     * 获取列表数据
     * 子组件需要实现 fetchListApi 方法
     */
    async fetchList() {
      if (!this.fetchListApi) {
        console.error('请实现 fetchListApi 方法');
        return;
      }

      this.loading = true;
      try {
        const params = {
          ...this.queryParams,
          page: this.pagination.page,
          size: this.pagination.size,
        };
        const { items, pagination } = await this.fetchListApi(params);
        this.list = items;
        this.pagination.total = pagination.total;
      } catch (error) {
        console.error('获取列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.pagination.page = 1;
      this.fetchList();
    },

    /**
     * 重置搜索
     */
    handleReset() {
      this.queryParams = {};
      this.pagination.page = 1;
      this.fetchList();
    },

    /**
     * 分页变化
     */
    handlePageChange(page) {
      this.pagination.page = page;
      this.fetchList();
    },

    /**
     * 每页条数变化
     */
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.fetchList();
    },
  },

  mounted() {
    this.fetchList();
  },
};
```

### 使用Mixin

```vue
<template>
  <div class="user-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="queryParams.keyword" placeholder="搜索用户" clearable />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import listMixin from '@/mixins/listMixin';
import userApi from '@/api/user';

export default {
  name: 'UserList',
  mixins: [listMixin],

  methods: {
    // 实现 fetchListApi
    fetchListApi(params) {
      return userApi.getList(params);
    },

    handleEdit(user) {
      this.$router.push(`/users/${user.id}/edit`);
    },

    async handleDelete(id) {
      await this.$confirm('确定删除该用户？', '提示', { type: 'warning' });
      try {
        await userApi.delete(id);
        this.$message.success('删除成功');
        this.fetchList();
      } catch (error) {
        // 错误已在拦截器中处理
      }
    },
  },
};
</script>
```

## 表单处理

```vue
<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import userApi from '@/api/user';

export default {
  name: 'UserForm',

  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少 6 个字符', trigger: 'blur' },
        ],
      },
      submitting: false,
    };
  },

  methods: {
    async handleSubmit() {
      try {
        await this.$refs.form.validate();
      } catch {
        return;
      }

      this.submitting = true;
      try {
        await userApi.create(this.form);
        this.$message.success('创建成功');
        this.$router.push('/users');
      } catch (error) {
        // 错误已在拦截器中处理
      } finally {
        this.submitting = false;
      }
    },

    handleReset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>
```

## 响应式注意事项

### 动态添加属性

Vue2 无法检测对象属性的添加或删除。对于已经创建的实例，Vue 不允许动态添加根级别的响应式属性。

```javascript
// ❌ 错误：直接添加属性不会触发视图更新
this.user.email = 'new@email.com';

// ✅ 正确：使用 Vue.set 或 this.$set
import Vue from 'vue';

// 方式1：使用 Vue.set
Vue.set(this.user, 'email', 'new@email.com');

// 方式2：使用实例方法 this.$set（推荐）
this.$set(this.user, 'email', 'new@email.com');

// 方式3：替换整个对象
this.user = { ...this.user, email: 'new@email.com' };
```

### 数组更新检测

Vue2 不能检测以下数组变动：
- 直接通过索引设置项：`this.items[index] = newValue`
- 修改数组长度：`this.items.length = newLength`

```javascript
// ❌ 错误：直接通过索引设置
this.items[0] = 'newValue';

// ✅ 正确：使用 Vue.set
Vue.set(this.items, 0, 'newValue');
// 或
this.$set(this.items, 0, 'newValue');

// ✅ 正确：使用数组变异方法
this.items.splice(0, 1, 'newValue');
```

### API响应数据处理

```javascript
export default {
  data() {
    return {
      user: {
        id: null,
        name: '',
        // 预先声明可能的属性
      },
    };
  },

  methods: {
    async fetchUser(id) {
      try {
        const response = await userService.getById(id);
        // ✅ 使用 Object.assign 保持响应式
        Object.assign(this.user, response.data);
        
        // 或者替换整个对象
        // this.user = response.data;
      } catch (error) {
        console.error('获取用户失败:', error);
      }
    },

    // 动态添加新字段
    addUserField(key, value) {
      this.$set(this.user, key, value);
    },

    // 删除字段
    removeUserField(key) {
      this.$delete(this.user, key);
    },
  },
};
```

### 深层嵌套对象

```javascript
// 深层嵌套对象的响应式处理
export default {
  data() {
    return {
      form: {
        user: {
          profile: {
            address: {
              city: '',
            },
          },
        },
      },
    };
  },

  methods: {
    updateCity(newCity) {
      // ✅ 直接修改已声明的属性是响应式的
      this.form.user.profile.address.city = newCity;
    },

    addNewNestedField() {
      // ❌ 错误：添加新的嵌套属性
      this.form.user.profile.phone = '123456';

      // ✅ 正确：使用 $set
      this.$set(this.form.user.profile, 'phone', '123456');
    },
  },
};
```

## Vuex集成

### 模块化最佳实践

使用 `namespaced: true` 确保模块的封装性和可维护性。

```javascript
// src/store/modules/user.js
import userService from '@/api/userService';

const state = {
  list: [],
  current: null,
  loading: false,
};

const mutations = {
  SET_LIST(state, list) {
    state.list = list;
  },
  SET_CURRENT(state, user) {
    state.current = user;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
};

const actions = {
  async fetchList({ commit }, params) {
    commit('SET_LOADING', true);
    try {
      const { items } = await userService.getList(params);
      commit('SET_LIST', items);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchById({ commit }, id) {
    commit('SET_LOADING', true);
    try {
      const user = await userService.getById(id);
      commit('SET_CURRENT', user);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
```
