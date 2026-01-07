# data-testid 规范指南

为前端元素添加测试标识，保证自动化测试顺利进行。

## 概述

`data-testid` 是专门用于自动化测试的 HTML 属性，与样式和功能解耦，确保测试代码的稳定性。

### 为什么需要 data-testid

| 选择器类型 | 稳定性 | 问题 |
|------------|--------|------|
| CSS 类名 | ❌ 低 | 样式重构会破坏测试 |
| ID | ⚠️ 中 | 可能与业务逻辑冲突 |
| 文本内容 | ❌ 低 | 国际化会破坏测试 |
| **data-testid** | ✅ 高 | 专用于测试，不受其他因素影响 |

---

## 1. 命名规范

### 1.1 基本格式

```
data-testid="{type}-{name}[-{modifier}]"
```

- **type**: 元素类型前缀（必须）
- **name**: 元素名称，使用 kebab-case（必须）
- **modifier**: 修饰符，如索引、ID、状态（可选）

### 1.2 类型前缀对照表

| 前缀 | 适用元素 | 示例 |
|------|----------|------|
| `btn` | 按钮 | `btn-submit`, `btn-cancel`, `btn-delete` |
| `input` | 输入框 | `input-email`, `input-search`, `input-phone` |
| `select` | 下拉选择框 | `select-country`, `select-status` |
| `checkbox` | 复选框 | `checkbox-agree`, `checkbox-remember` |
| `radio` | 单选框 | `radio-gender-male`, `radio-payment-card` |
| `switch` | 开关 | `switch-notification`, `switch-dark-mode` |
| `link` | 链接 | `link-home`, `link-profile`, `link-logout` |
| `nav` | 导航 | `nav-main`, `nav-sidebar`, `nav-breadcrumb` |
| `menu` | 菜单 | `menu-user`, `menu-settings` |
| `tab` | 选项卡 | `tab-info`, `tab-settings`, `tab-history` |
| `panel` | 面板/选项卡内容 | `panel-info`, `panel-settings` |
| `modal` | 模态框 | `modal-confirm`, `modal-alert`, `modal-form` |
| `dialog` | 对话框 | `dialog-warning`, `dialog-success` |
| `drawer` | 抽屉 | `drawer-filter`, `drawer-detail` |
| `form` | 表单 | `form-login`, `form-register`, `form-search` |
| `table` | 表格 | `table-users`, `table-orders` |
| `row` | 表格行 | `row-user-1`, `row-order-abc` |
| `cell` | 表格单元格 | `cell-name`, `cell-status`, `cell-action` |
| `list` | 列表 | `list-menu`, `list-notifications` |
| `item` | 列表项 | `item-menu-0`, `item-notification-1` |
| `card` | 卡片 | `card-product`, `card-user` |
| `page` | 页面容器 | `page-dashboard`, `page-profile` |
| `section` | 区块 | `section-header`, `section-footer` |
| `text` | 文本显示 | `text-title`, `text-error`, `text-total` |
| `label` | 标签文本 | `label-status`, `label-category` |
| `badge` | 徽章 | `badge-count`, `badge-status` |
| `tag` | 标签 | `tag-category`, `tag-priority` |
| `icon` | 图标按钮 | `icon-close`, `icon-menu`, `icon-search` |
| `img` | 图片 | `img-avatar`, `img-banner` |
| `dropdown` | 下拉框 | `dropdown-language`, `dropdown-user` |
| `tooltip` | 提示框 | `tooltip-help`, `tooltip-info` |
| `popover` | 弹出框 | `popover-detail`, `popover-action` |
| `pagination` | 分页 | `pagination-main`, `pagination-table` |
| `loading` | 加载状态 | `loading-spinner`, `loading-skeleton` |
| `empty` | 空状态 | `empty-list`, `empty-search` |
| `error` | 错误状态 | `error-message`, `error-boundary` |
| `alert` | 警告提示 | `alert-success`, `alert-warning` |
| `toast` | 轻提示 | `toast-message` |
| `progress` | 进度条 | `progress-upload`, `progress-step` |
| `stepper` | 步骤条 | `stepper-checkout`, `stepper-wizard` |
| `tree` | 树形控件 | `tree-menu`, `tree-folder` |
| `node` | 树节点 | `node-folder-1`, `node-file-abc` |

### 1.3 命名规则

```
✅ 正确示例：
data-testid="btn-submit"
data-testid="input-user-name"
data-testid="row-order-12345"
data-testid="modal-confirm-delete"

❌ 错误示例：
data-testid="submitButton"      // 不要用驼峰
data-testid="btn_submit"        // 不要用下划线
data-testid="button"            // 太泛泛
data-testid="btn-1"             // 无意义的数字
```

---

## 2. 动态元素处理

### 2.1 列表项

```html
<!-- 使用唯一业务 ID（推荐） -->
<tr v-for="user in users" :key="user.id" :data-testid="`row-user-${user.id}`">
  <td :data-testid="`cell-name-${user.id}`">{{ user.name }}</td>
  <td>
    <button :data-testid="`btn-edit-${user.id}`">编辑</button>
    <button :data-testid="`btn-delete-${user.id}`">删除</button>
  </td>
</tr>

<!-- 使用索引（无唯一 ID 时） -->
<li v-for="(item, index) in items" :key="index" :data-testid="`item-menu-${index}`">
  {{ item.label }}
</li>
```

### 2.2 动态组件

```vue
<template>
  <!-- 模态框 -->
  <div v-if="showModal" :data-testid="`modal-${modalType}`">
    <button :data-testid="`btn-close-${modalType}`">关闭</button>
  </div>
  
  <!-- 选项卡 -->
  <div v-for="tab in tabs" :key="tab.key">
    <button :data-testid="`tab-${tab.key}`" @click="activeTab = tab.key">
      {{ tab.label }}
    </button>
  </div>
  <div :data-testid="`panel-${activeTab}`">
    <!-- 内容 -->
  </div>
</template>
```

### 2.3 条件渲染

```html
<!-- 状态相关的 testid -->
<div :data-testid="isLoading ? 'loading-spinner' : 'content-main'">
  <template v-if="isLoading">加载中...</template>
  <template v-else>内容</template>
</div>

<!-- 或分开写 -->
<div v-if="isLoading" data-testid="loading-spinner">加载中...</div>
<div v-else data-testid="content-main">内容</div>
```

---

## 3. 必须添加 data-testid 的场景

### 3.1 交互元素（必须 ⭐）

| 元素 | 说明 | 示例 |
|------|------|------|
| 提交按钮 | 表单提交、确认操作 | `btn-submit`, `btn-confirm` |
| 取消按钮 | 取消操作、关闭弹窗 | `btn-cancel`, `btn-close` |
| 删除按钮 | 删除操作 | `btn-delete`, `btn-remove` |
| 编辑按钮 | 编辑操作 | `btn-edit`, `btn-modify` |
| 搜索按钮 | 搜索触发 | `btn-search` |
| 导航链接 | 页面跳转 | `link-home`, `link-detail` |
| 分页控件 | 翻页操作 | `pagination-main`, `btn-next-page` |
| 排序控件 | 排序操作 | `btn-sort-name`, `btn-sort-date` |
| 筛选控件 | 筛选操作 | `btn-filter`, `select-status` |

### 3.2 表单元素（必须 ⭐）

| 元素 | 说明 | 示例 |
|------|------|------|
| 文本输入 | 用户输入 | `input-username`, `input-email` |
| 密码输入 | 密码字段 | `input-password` |
| 下拉选择 | 选择操作 | `select-country`, `select-role` |
| 复选框 | 多选 | `checkbox-agree`, `checkbox-all` |
| 单选框 | 单选 | `radio-gender-male` |
| 开关 | 切换状态 | `switch-notification` |
| 日期选择 | 日期输入 | `input-date-start`, `input-date-end` |
| 文件上传 | 文件选择 | `input-file-avatar` |
| 表单容器 | 表单整体 | `form-login`, `form-register` |

### 3.3 数据展示（必须 ⭐）

| 元素 | 说明 | 示例 |
|------|------|------|
| 表格行 | 数据行定位 | `row-user-123` |
| 列表项 | 列表项定位 | `item-order-456` |
| 状态文本 | 状态显示 | `text-status`, `badge-status` |
| 计数数字 | 统计数据 | `text-total`, `badge-count` |
| 错误提示 | 错误信息 | `text-error`, `alert-error` |
| 成功提示 | 成功信息 | `alert-success`, `toast-success` |

### 3.4 容器元素（推荐）

| 元素 | 说明 | 示例 |
|------|------|------|
| 页面容器 | 页面根元素 | `page-dashboard` |
| 模态框 | 弹窗容器 | `modal-confirm` |
| 抽屉 | 侧边抽屉 | `drawer-filter` |
| 选项卡面板 | Tab 内容区 | `panel-settings` |
| 卡片 | 卡片容器 | `card-user-info` |

---

## 4. 完整重构示例

### 4.1 登录表单

```html
<!-- 重构前 -->
<div class="login-form">
  <input type="text" placeholder="用户名">
  <input type="password" placeholder="密码">
  <input type="checkbox"> 记住我
  <button>登录</button>
  <a href="/register">注册账号</a>
</div>

<!-- 重构后 -->
<form data-testid="form-login" class="login-form" @submit.prevent="handleLogin">
  <div class="form-group">
    <label for="username">用户名</label>
    <input 
      id="username"
      type="text" 
      data-testid="input-username"
      v-model="username"
      aria-required="true"
    >
  </div>
  
  <div class="form-group">
    <label for="password">密码</label>
    <input 
      id="password"
      type="password" 
      data-testid="input-password"
      v-model="password"
      aria-required="true"
    >
  </div>
  
  <div class="form-group">
    <label>
      <input 
        type="checkbox" 
        data-testid="checkbox-remember"
        v-model="rememberMe"
      >
      记住我
    </label>
  </div>
  
  <button type="submit" data-testid="btn-login">登录</button>
  <a href="/register" data-testid="link-register">注册账号</a>
  
  <div v-if="errorMessage" data-testid="text-error" role="alert">
    {{ errorMessage }}
  </div>
</form>
```

### 4.2 数据表格

```html
<!-- 重构前 -->
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>状态</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="user in users">
      <td>{{ user.name }}</td>
      <td>{{ user.status }}</td>
      <td>
        <button @click="edit(user)">编辑</button>
        <button @click="remove(user)">删除</button>
      </td>
    </tr>
  </tbody>
</table>
<div class="pagination">
  <button @click="prevPage">上一页</button>
  <span>第 {{ page }} 页</span>
  <button @click="nextPage">下一页</button>
</div>

<!-- 重构后 -->
<table data-testid="table-users" role="grid" aria-label="用户列表">
  <thead>
    <tr>
      <th scope="col">
        <button data-testid="btn-sort-name" @click="sortBy('name')">
          姓名
          <span aria-hidden="true">{{ sortIcon('name') }}</span>
        </button>
      </th>
      <th scope="col">状态</th>
      <th scope="col">操作</th>
    </tr>
  </thead>
  <tbody>
    <tr 
      v-for="user in users" 
      :key="user.id"
      :data-testid="`row-user-${user.id}`"
    >
      <td :data-testid="`cell-name-${user.id}`">{{ user.name }}</td>
      <td>
        <span 
          :data-testid="`badge-status-${user.id}`"
          :class="statusClass(user.status)"
        >
          {{ user.status }}
        </span>
      </td>
      <td>
        <button 
          :data-testid="`btn-edit-${user.id}`" 
          @click="edit(user)"
          aria-label="编辑用户"
        >
          编辑
        </button>
        <button 
          :data-testid="`btn-delete-${user.id}`" 
          @click="remove(user)"
          aria-label="删除用户"
        >
          删除
        </button>
      </td>
    </tr>
  </tbody>
</table>

<!-- 空状态 -->
<div v-if="users.length === 0" data-testid="empty-users">
  暂无数据
</div>

<!-- 分页 -->
<nav data-testid="pagination-users" aria-label="分页导航">
  <button 
    data-testid="btn-prev-page" 
    @click="prevPage"
    :disabled="page === 1"
    :aria-disabled="page === 1"
  >
    上一页
  </button>
  <span data-testid="text-page-info">第 {{ page }} 页，共 {{ totalPages }} 页</span>
  <button 
    data-testid="btn-next-page" 
    @click="nextPage"
    :disabled="page === totalPages"
    :aria-disabled="page === totalPages"
  >
    下一页
  </button>
</nav>
```

### 4.3 模态框

```html
<!-- 重构前 -->
<div v-if="showModal" class="modal">
  <div class="modal-content">
    <h2>确认删除</h2>
    <p>确定要删除吗？</p>
    <button @click="confirm">确定</button>
    <button @click="cancel">取消</button>
  </div>
</div>

<!-- 重构后 -->
<div 
  v-if="showModal" 
  data-testid="modal-confirm-delete"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  class="modal"
>
  <div class="modal-content">
    <h2 id="modal-title" data-testid="text-modal-title">确认删除</h2>
    <p id="modal-description" data-testid="text-modal-description">
      确定要删除该记录吗？此操作不可撤销。
    </p>
    <div class="modal-actions">
      <button 
        data-testid="btn-confirm-delete" 
        @click="confirm"
        class="btn-danger"
      >
        确定删除
      </button>
      <button 
        data-testid="btn-cancel-delete" 
        @click="cancel"
        ref="cancelBtn"
      >
        取消
      </button>
    </div>
  </div>
</div>
```

### 4.4 选项卡

```html
<!-- 重构前 -->
<div class="tabs">
  <div v-for="tab in tabs" @click="activeTab = tab.key">
    {{ tab.label }}
  </div>
</div>
<div v-if="activeTab === 'info'">基本信息内容</div>
<div v-if="activeTab === 'settings'">设置内容</div>

<!-- 重构后 -->
<div class="tabs" role="tablist" aria-label="用户信息选项卡">
  <button
    v-for="tab in tabs"
    :key="tab.key"
    :data-testid="`tab-${tab.key}`"
    role="tab"
    :aria-selected="activeTab === tab.key"
    :aria-controls="`panel-${tab.key}`"
    :tabindex="activeTab === tab.key ? 0 : -1"
    @click="activeTab = tab.key"
  >
    {{ tab.label }}
  </button>
</div>

<div 
  v-show="activeTab === 'info'"
  id="panel-info"
  data-testid="panel-info"
  role="tabpanel"
  aria-labelledby="tab-info"
>
  基本信息内容
</div>

<div 
  v-show="activeTab === 'settings'"
  id="panel-settings"
  data-testid="panel-settings"
  role="tabpanel"
  aria-labelledby="tab-settings"
>
  设置内容
</div>
```

---

## 5. 检查清单

### 5.1 必须检查项

- [ ] 所有按钮有 `data-testid`
- [ ] 所有表单输入有 `data-testid`
- [ ] 所有导航链接有 `data-testid`
- [ ] 表格行有唯一 `data-testid`
- [ ] 列表项有唯一 `data-testid`
- [ ] 模态框/对话框有 `data-testid`
- [ ] 关键状态文本有 `data-testid`
- [ ] 分页控件有 `data-testid`

### 5.2 命名规范检查

- [ ] 使用正确的类型前缀
- [ ] 使用 kebab-case 命名
- [ ] 名称具有描述性
- [ ] 动态元素使用唯一标识符
- [ ] 无重复的 `data-testid`

### 5.3 与可访问性结合

- [ ] 交互元素同时有 `aria-label`（无可见文本时）
- [ ] 表单元素有关联的 `label`
- [ ] 状态变化有 `aria-live` 通知
- [ ] 模态框有正确的 ARIA 属性

---

## 6. 自动化测试示例

### 6.1 Playwright 测试

```typescript
import { test, expect } from '@playwright/test'

test.describe('登录功能', () => {
  test('成功登录', async ({ page }) => {
    await page.goto('/login')
    
    // 使用 data-testid 定位元素
    await page.getByTestId('input-username').fill('testuser')
    await page.getByTestId('input-password').fill('password123')
    await page.getByTestId('btn-login').click()
    
    // 验证跳转
    await expect(page).toHaveURL('/dashboard')
  })
  
  test('登录失败显示错误', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByTestId('input-username').fill('wronguser')
    await page.getByTestId('input-password').fill('wrongpass')
    await page.getByTestId('btn-login').click()
    
    // 验证错误提示
    await expect(page.getByTestId('text-error')).toBeVisible()
  })
})

test.describe('用户列表', () => {
  test('编辑用户', async ({ page }) => {
    await page.goto('/users')
    
    // 点击特定用户的编辑按钮
    await page.getByTestId('btn-edit-123').click()
    
    // 验证模态框打开
    await expect(page.getByTestId('modal-edit-user')).toBeVisible()
  })
  
  test('分页功能', async ({ page }) => {
    await page.goto('/users')
    
    // 点击下一页
    await page.getByTestId('btn-next-page').click()
    
    // 验证页码更新
    await expect(page.getByTestId('text-page-info')).toContainText('第 2 页')
  })
})
```

### 6.2 Cypress 测试

```javascript
describe('登录功能', () => {
  it('成功登录', () => {
    cy.visit('/login')
    
    cy.get('[data-testid="input-username"]').type('testuser')
    cy.get('[data-testid="input-password"]').type('password123')
    cy.get('[data-testid="btn-login"]').click()
    
    cy.url().should('include', '/dashboard')
  })
})

describe('用户列表', () => {
  it('删除用户', () => {
    cy.visit('/users')
    
    // 点击删除按钮
    cy.get('[data-testid="btn-delete-123"]').click()
    
    // 确认删除
    cy.get('[data-testid="modal-confirm-delete"]').should('be.visible')
    cy.get('[data-testid="btn-confirm-delete"]').click()
    
    // 验证用户被删除
    cy.get('[data-testid="row-user-123"]').should('not.exist')
  })
})
```

---

## 版本历史

- **v1.0.0** (2026-01-04): 初始版本
  - 完整的命名规范
  - 类型前缀对照表
  - 动态元素处理指南
  - 完整重构示例
  - 自动化测试示例

---

**作者**: spec-code Team
