# Vue SPA 定位器规范

> ⚠️ **强制规范**：针对 Vue 2/3 + Element UI/TDesign 项目的定位器最佳实践。

## 1. Vue 编译产物稳定性

### 1.1 不稳定的属性（禁止依赖）

| 属性类型 | 示例 | 原因 |
|----------|------|------|
| Scoped CSS 属性 | `data-v-7ba5bd90` | 每次构建哈希变化 |
| CSS Modules 类名 | `searchInput_1a2b3c` | 每次构建哈希变化 |
| 动态生成的 ID | `el-id-xxx-n` | 运行时动态生成 |
| 层级过深的选择器 | `div > div > div > input` | 结构变化即失效 |

**禁止使用示例**：

```javascript
// ❌ 禁止：依赖 Scoped CSS 属性
page.locator('[data-v-7ba5bd90]')

// ❌ 禁止：依赖 CSS Modules 哈希类名
page.locator('.searchInput_1a2b3c')

// ❌ 禁止：依赖动态 ID
page.locator('#el-id-1234-5')

// ❌ 禁止：过深的层级选择器
page.locator('div.container > div.wrapper > div.content > div.form > input')
```

### 1.2 稳定的属性（推荐依赖）

| 属性类型 | 示例 | 稳定性 | 说明 |
|----------|------|--------|------|
| data-testid | `data-testid="search-input"` | ⭐⭐⭐⭐⭐ | 最佳方案（需开发配合） |
| placeholder | `请输入姓名` | ⭐⭐⭐⭐⭐ | 用户可见，不受编译影响 |
| 用户可见文本 | `登录`、`查询` | ⭐⭐⭐⭐⭐ | 业务文案，相对稳定 |
| UI 库公开类名 | `.el-input__inner` | ⭐⭐⭐⭐ | UI 库 API 的一部分 |
| 原生 HTML 标签 | `button`、`input` | ⭐⭐⭐⭐⭐ | 语义化标签 |
| ARIA 角色（部分） | `role="button"` | ⭐⭐⭐⭐ | 仅限原生标签隐式角色 |

---

## 2. Element UI 组件定位策略

### 2.1 稳定类名参考

| 组件 | 稳定类名 | 说明 |
|------|----------|------|
| Input | `.el-input__inner` | 实际输入框元素 |
| Button | `.el-button` | 按钮容器 |
| Table | `.el-table` | 表格容器 |
| Table Row | `.el-table__row` | 表格数据行 |
| Table Header | `.el-table__header-wrapper` | 表头容器 |
| Table Cell | `.el-table__cell` | 表格单元格 |
| Tab | `.el-tabs__item` | Tab 项 |
| Tab Active | `.el-tabs__item.is-active` | 激活的 Tab |
| Pagination | `.el-pagination` | 分页容器 |
| Pagination Total | `.el-pagination__total` | 总数显示 |
| Dialog | `.el-dialog` | 弹窗容器 |
| Dialog Body | `.el-dialog__body` | 弹窗内容区 |
| Form Item | `.el-form-item` | 表单项 |
| Form Label | `.el-form-item__label` | 表单标签 |
| Select | `.el-select` | 下拉选择器 |
| Select Dropdown | `.el-select-dropdown__item` | 下拉选项 |

### 2.2 TDesign 稳定类名参考

| 组件 | 稳定类名 | 说明 |
|------|----------|------|
| Input | `.t-input__inner` | 实际输入框 |
| Button | `.t-button` | 按钮 |
| Table | `.t-table` | 表格 |
| Table Row | `.t-table__row` | 表格行 |
| Tab | `.t-tabs__nav-item` | Tab 项 |
| Pagination | `.t-pagination` | 分页 |
| Dialog | `.t-dialog` | 弹窗 |

### 2.3 ARIA 角色可用性

| 组件 | Element UI 2.x | Element Plus (Vue 3) | TDesign |
|------|----------------|---------------------|---------|
| Button | ✅ 隐式 `role="button"` | ✅ | ✅ |
| Input | ✅ 隐式 `role="textbox"` | ✅ | ✅ |
| Link | ✅ 隐式 `role="link"` | ✅ | ✅ |
| Tab | ❌ 无 role | ✅ `role="tab"` | ✅ |
| Table Header | ⚠️ 文本嵌套在 .cell 中 | ⚠️ | ⚠️ |
| Dialog | ✅ `role="dialog"` | ✅ | ✅ |
| Checkbox | ✅ 隐式 | ✅ | ✅ |
| Radio | ✅ 隐式 | ✅ | ✅ |

**重要**：Element UI 2.x 的 Tab 组件**不添加** `role="tab"`，使用 `getByRole('tab')` **会失败**。

---

## 3. 定位器优先级（Vue SPA 专用）

### 3.1 优先级排序

```
优先级1: data-testid（如果可用）
   page.locator('[data-testid="search-input"]')

优先级2: UI 库公开类名 + 文本/属性
   page.locator('.el-input__inner[placeholder*="姓名"]')
   page.locator('.el-tabs__item').filter({ hasText: '敏感内容待办' })

优先级3: 原生语义标签 + 隐式 ARIA（仅限 button/input/link）
   page.getByRole('button', { name: '查询' })
   page.getByRole('textbox')

优先级4: 用户可见文本
   page.getByPlaceholder('请输入姓名')
   page.getByText('登录', { exact: true })

优先级5: UI 库容器 + getByText
   page.locator('.el-table__header-wrapper').getByText('申请单号')

优先级6: 结构化选择器（最后手段）
   page.locator('table tbody tr:first-child a').first()
```

### 3.2 各场景推荐定位方式

| 场景 | 推荐方式 | 示例 |
|------|----------|------|
| 搜索输入框 | UI 库类名 + placeholder | `.el-input__inner[placeholder*="关键词"]` |
| 提交按钮 | getByRole + name | `getByRole('button', { name: '提交' })` |
| Tab 切换 | UI 库类名 + filter | `.el-tabs__item` + `filter({ hasText })` |
| 表格表头 | UI 库容器 + getByText | `.el-table__header-wrapper` + `getByText('列名')` |
| 表格行 | UI 库类名 | `.el-table__row` |
| 分页 | UI 库类名 + first | `.el-pagination` + `.first()` |
| 弹窗 | getByRole | `getByRole('dialog')` |
| 链接 | getByRole + name | `getByRole('link', { name: '详情' })` |

---

## 4. 禁止使用的定位方式

| 禁止方式 | 原因 | 替代方案 |
|----------|------|----------|
| `[data-v-xxxxx]` | 构建不稳定 | UI 库类名 |
| `.className_hash` | CSS Modules 不稳定 | UI 库类名 |
| `getByRole('tab')` (Element UI 2.x) | 无 role 属性 | `.el-tabs__item` + filter |
| `getByRole('columnheader', { name })` | 文本嵌套 | `.el-table__header-wrapper` + getByText |
| `#el-id-xxx-n` | 动态 ID | 其他稳定属性 |
| 超过 3 层的选择器 | 结构脆弱 | 更具体的类名 |

---

## 5. Vue SPA 异步处理

### 5.1 常见异步场景

| 场景 | 问题 | 解决方案 |
|------|------|----------|
| 路由切换 | DOM 重建 | 重新获取定位器 |
| 异步数据加载 | 元素延迟出现 | `waitForLoadState('networkidle')` |
| Vue 响应式更新 | DOM 未同步 | 等待目标元素或 `waitForTimeout` |
| 懒加载组件 | 组件延迟渲染 | `waitFor({ state: 'visible' })` |
| 虚拟滚动 | 元素不在 DOM 中 | 滚动后再定位 |

### 5.2 推荐等待策略

```javascript
// 1. 页面导航后等待网络空闲
await page.goto('/path');
await page.waitForLoadState('networkidle', { timeout: 30000 });

// 2. 等待核心元素出现（优于等待标题）
await page.locator('.el-table, [class*="list"]').first().waitFor({ state: 'visible' });

// 3. 操作前等待元素可交互
await locator.waitFor({ state: 'visible', timeout: 10000 });
await locator.click();

// 4. 数据变更后等待 DOM 更新
await input.fill('keyword');
await page.waitForTimeout(500); // 等待 Vue 响应式更新
// 或等待特定元素变化
await page.locator('.result-item').waitFor({ state: 'visible' });

// 5. 等待加载状态消失
await page.locator('.el-loading-mask').waitFor({ state: 'hidden' });
```

---

## 6. 分层降级策略

### 6.1 POM 定义模式

每个可能不稳定的元素都应提供主定位器和备选定位器：

```javascript
class ExamplePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Tab：主定位器（Element UI 类名）+ 备选（ARIA role）
    this.tabSensitiveTodo = page.locator('.el-tabs__item').filter({ hasText: '敏感内容待办' });
    this.tabSensitiveTodoFallback = page.getByRole('tab', { name: /敏感内容待办/ });
    
    // 输入框：主定位器（类名+placeholder）+ 备选（role）
    this.searchInput = page.locator('.el-input__inner[placeholder*="关键词"]').first();
    this.searchInputFallback = page.getByRole('textbox', { name: /关键词/ });
    
    // 表头：主定位器（容器+文本）+ 备选（th）
    this.colName = page.locator('.el-table__header-wrapper').getByText('姓名');
    this.colNameFallback = page.locator('th').filter({ hasText: '姓名' }).first();
  }
}
```

### 6.2 方法封装降级逻辑

```javascript
async clickTab() {
  // 优先级1: Element UI 类名
  if (await this.tabSensitiveTodo.isVisible().catch(() => false)) {
    await this.tabSensitiveTodo.click();
    return;
  }
  // 优先级2: ARIA role（Element Plus 有效）
  if (await this.tabSensitiveTodoFallback.isVisible().catch(() => false)) {
    await this.tabSensitiveTodoFallback.click();
    return;
  }
  // 元素不存在（可能已在目标页）
  console.log('Tab not found, assuming already on target page');
}
```

---

## 7. 检查清单

生成 POM 时必须检查：

```
□ 所有 Tab 元素使用 .el-tabs__item + filter（非 getByRole('tab')）
□ 所有表头使用 .el-table__header-wrapper + getByText（非 th:has-text）
□ 所有可能重复的元素添加 .first()
□ 为复杂元素提供 Fallback 定位器
□ 方法中封装降级逻辑，spec 只调用方法
□ 未使用 data-v-xxx 属性
□ 未使用带哈希的 CSS Modules 类名
□ 未使用超过 3 层的选择器
```
