# Vue2 Mixin 模式最佳实践

## 概述

在 Vue2 中，Mixin 是实现代码复用的主要方式，类似于 Vue3 中的 Composable。本文档介绍 API 调用相关的 Mixin 模式最佳实践。

## 目录结构

```
src/
├── mixins/
│   ├── listMixin.js          # 列表页Mixin
│   ├── formMixin.js          # 表单页Mixin
│   ├── detailMixin.js        # 详情页Mixin
│   └── crudMixin.js          # CRUD操作Mixin
└── api/
    └── user.js               # 用户API
```

## 列表页 Mixin

### 基础版本

```javascript
// src/mixins/listMixin.js

/**
 * 列表页通用Mixin
 * 提供分页、搜索、加载状态等功能
 */
export default {
  data() {
    return {
      // 列表数据
      list: [],
      // 加载状态
      loading: false,
      // 分页信息
      pagination: {
        page: 1,
        size: 20,
        total: 0,
      },
      // 查询参数
      queryParams: {},
      // 选中项
      selectedRows: [],
      selectedRowKeys: [],
    };
  },

  computed: {
    /**
     * 是否有选中项
     */
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
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
        this.$message?.error('获取列表失败');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.pagination.page = 1;
      this.clearSelection();
      this.fetchList();
    },

    /**
     * 重置搜索
     */
    handleReset() {
      this.queryParams = {};
      this.pagination.page = 1;
      this.clearSelection();
      this.fetchList();
    },

    /**
     * 刷新列表
     */
    handleRefresh() {
      this.clearSelection();
      this.fetchList();
    },

    /**
     * 分页变化
     * @param {number} page
     */
    handlePageChange(page) {
      this.pagination.page = page;
      this.fetchList();
    },

    /**
     * 每页条数变化
     * @param {number} size
     */
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.fetchList();
    },

    /**
     * 选择变化
     * @param {Array} selectedRowKeys
     * @param {Array} selectedRows
     */
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    /**
     * 清除选择
     */
    clearSelection() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
    },
  },

  mounted() {
    this.fetchList();
  },
};
```

### 使用示例

```vue
<template>
  <div class="user-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input 
        v-model="queryParams.keyword" 
        placeholder="搜索用户" 
        clearable 
        @keyup.enter.native="handleSearch"
      />
      <el-select v-model="queryParams.status" placeholder="状态" clearable>
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button 
        type="danger" 
        :disabled="!hasSelected" 
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table 
      v-loading="loading" 
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
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
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
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

    handleAdd() {
      this.$router.push('/users/create');
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

    async handleBatchDelete() {
      await this.$confirm(
        `确定删除选中的 ${this.selectedRowKeys.length} 条记录？`,
        '提示',
        { type: 'warning' }
      );
      try {
        await Promise.all(this.selectedRowKeys.map(id => userApi.delete(id)));
        this.$message.success('批量删除成功');
        this.clearSelection();
        this.fetchList();
      } catch (error) {
        // 错误已在拦截器中处理
      }
    },
  },
};
</script>
```

## 表单页 Mixin

```javascript
// src/mixins/formMixin.js

/**
 * 表单页通用Mixin
 * 提供表单验证、提交、重置等功能
 */
export default {
  data() {
    return {
      // 表单数据
      form: {},
      // 表单规则（子组件覆盖）
      rules: {},
      // 提交状态
      submitting: false,
      // 编辑模式
      isEdit: false,
      // 编辑ID
      editId: null,
    };
  },

  computed: {
    /**
     * 页面标题
     */
    pageTitle() {
      return this.isEdit ? '编辑' : '新增';
    },
  },

  methods: {
    /**
     * 初始化表单
     * 子组件可覆盖
     */
    initForm() {
      return {};
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.form = this.initForm();
      this.$refs.form?.resetFields();
    },

    /**
     * 验证表单
     * @returns {Promise<boolean>}
     */
    async validateForm() {
      try {
        await this.$refs.form.validate();
        return true;
      } catch {
        return false;
      }
    },

    /**
     * 提交表单
     * 子组件需要实现 submitApi 方法
     */
    async handleSubmit() {
      if (!this.submitApi) {
        console.error('请实现 submitApi 方法');
        return;
      }

      const valid = await this.validateForm();
      if (!valid) return;

      this.submitting = true;
      try {
        if (this.isEdit) {
          await this.submitApi(this.editId, this.form);
          this.$message.success('更新成功');
        } else {
          await this.submitApi(this.form);
          this.$message.success('创建成功');
        }
        this.handleSuccess();
      } catch (error) {
        // 错误已在拦截器中处理
      } finally {
        this.submitting = false;
      }
    },

    /**
     * 提交成功回调
     * 子组件可覆盖
     */
    handleSuccess() {
      this.$router.back();
    },

    /**
     * 取消
     */
    handleCancel() {
      this.$router.back();
    },

    /**
     * 加载编辑数据
     * 子组件需要实现 fetchDetailApi 方法
     */
    async loadEditData() {
      if (!this.fetchDetailApi || !this.editId) return;

      try {
        const data = await this.fetchDetailApi(this.editId);
        this.form = { ...this.form, ...data };
      } catch (error) {
        this.$message.error('加载数据失败');
        this.$router.back();
      }
    },
  },

  created() {
    this.form = this.initForm();
    
    // 判断编辑模式
    const { id } = this.$route.params;
    if (id) {
      this.isEdit = true;
      this.editId = id;
      this.loadEditData();
    }
  },
};
```

### 使用示例

```vue
<template>
  <div class="user-form">
    <h2>{{ pageTitle }}用户</h2>
    
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码" 
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin';
import userApi from '@/api/user';

export default {
  name: 'UserForm',
  mixins: [formMixin],

  data() {
    return {
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
      },
    };
  },

  methods: {
    // 初始化表单
    initForm() {
      return {
        username: '',
        email: '',
        password: '',
        status: 'active',
      };
    },

    // 实现 fetchDetailApi
    fetchDetailApi(id) {
      return userApi.getById(id);
    },

    // 实现 submitApi
    submitApi(idOrData, data) {
      if (this.isEdit) {
        return userApi.update(idOrData, data);
      }
      return userApi.create(idOrData);
    },
  },
};
</script>
```

## 详情页 Mixin

```javascript
// src/mixins/detailMixin.js

/**
 * 详情页通用Mixin
 */
export default {
  data() {
    return {
      // 详情数据
      detail: null,
      // 加载状态
      loading: false,
      // 详情ID
      detailId: null,
    };
  },

  methods: {
    /**
     * 加载详情
     * 子组件需要实现 fetchDetailApi 方法
     */
    async fetchDetail() {
      if (!this.fetchDetailApi || !this.detailId) return;

      this.loading = true;
      try {
        this.detail = await this.fetchDetailApi(this.detailId);
      } catch (error) {
        this.$message.error('加载详情失败');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 返回
     */
    handleBack() {
      this.$router.back();
    },
  },

  created() {
    const { id } = this.$route.params;
    if (id) {
      this.detailId = id;
      this.fetchDetail();
    }
  },
};
```

## CRUD Mixin

```javascript
// src/mixins/crudMixin.js

/**
 * CRUD操作Mixin
 * 整合列表、表单、详情功能
 */
export default {
  data() {
    return {
      // 弹窗可见性
      dialogVisible: false,
      // 弹窗标题
      dialogTitle: '',
      // 当前操作类型
      actionType: '', // 'create' | 'edit' | 'view'
      // 当前操作的记录
      currentRecord: null,
    };
  },

  methods: {
    /**
     * 打开新增弹窗
     */
    openCreateDialog() {
      this.actionType = 'create';
      this.dialogTitle = '新增';
      this.currentRecord = null;
      this.dialogVisible = true;
    },

    /**
     * 打开编辑弹窗
     * @param {Object} record
     */
    openEditDialog(record) {
      this.actionType = 'edit';
      this.dialogTitle = '编辑';
      this.currentRecord = { ...record };
      this.dialogVisible = true;
    },

    /**
     * 打开查看弹窗
     * @param {Object} record
     */
    openViewDialog(record) {
      this.actionType = 'view';
      this.dialogTitle = '查看';
      this.currentRecord = { ...record };
      this.dialogVisible = true;
    },

    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.dialogVisible = false;
      this.currentRecord = null;
    },

    /**
     * 弹窗提交成功回调
     */
    onDialogSuccess() {
      this.closeDialog();
      this.fetchList?.();
    },
  },
};
```

## Mixin 组合使用

```vue
<script>
import listMixin from '@/mixins/listMixin';
import crudMixin from '@/mixins/crudMixin';
import userApi from '@/api/user';

export default {
  name: 'UserManagement',
  mixins: [listMixin, crudMixin],

  methods: {
    fetchListApi(params) {
      return userApi.getList(params);
    },

    async handleDelete(id) {
      await this.$confirm('确定删除？', '提示', { type: 'warning' });
      await userApi.delete(id);
      this.$message.success('删除成功');
      this.fetchList();
    },
  },
};
</script>
```

## 注意事项

1. **命名冲突**: 多个 Mixin 混入时注意避免 data、methods 命名冲突
2. **this 指向**: Mixin 中的 this 指向组件实例
3. **生命周期**: Mixin 的生命周期钩子会与组件的合并执行
4. **依赖注入**: 复杂场景建议使用 provide/inject 或 Vuex

## 检查清单

```yaml
mixin_checklist:
  设计规范:
    - [ ] Mixin 职责单一
    - [ ] 命名清晰明确
    - [ ] 避免命名冲突
  
  使用规范:
    - [ ] 正确实现抽象方法
    - [ ] 理解生命周期合并
    - [ ] 处理 this 指向
  
  代码质量:
    - [ ] JSDoc 注释完整
    - [ ] 错误处理完善
    - [ ] 状态管理清晰
```
