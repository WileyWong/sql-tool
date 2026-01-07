# POM 生成规范

> ⚠️ **本文档为强制规范，非建议性指引。所有内容必须严格遵循。**

## 输入方式

| 类型 | 说明 | 处理方式 |
|------|------|----------|
| 录制代码 | Playwright 录制的测试代码 | 解析提取定位器 |
| 页面 URL | 目标页面地址 | MCP 获取快照后分析 |
| 页面快照 | 已获取的 A11y 快照 | 直接分析 |

---

## 录制代码解析

### 识别特征

```javascript
// 必须包含以下特征之一
import { test, expect } from '@playwright/test';
// 或
const { test, expect } = require('@playwright/test');
```

### 定位器提取规则

| 优先级 | 方法 | 正则模式 | 输出格式 |
|--------|------|----------|----------|
| 1 | getByTestId | `getByTestId\('([^']+)'\)` | `[data-testid='$1']` |
| 2 | getByRole | `getByRole\('([^']+)'.*name:\s*'([^']+)'` | `role=$1[name='$2']` |
| 3 | getByLabel | `getByLabel\('([^']+)'\)` | `label=$1` |
| 4 | getByPlaceholder | `getByPlaceholder\('([^']+)'\)` | `[placeholder='$1']` |
| 5 | getByText | `getByText\('([^']+)'\)` | `text=$1` |
| 6 | locator | `locator\('([^']+)'\)` | `$1` |

### 操作映射

| Playwright 方法 | 操作类型 | 参数 |
|-----------------|----------|------|
| `goto(url)` | navigate | url |
| `fill(value)` | fill | value |
| `click()` | click | - |
| `check()` | check | - |
| `uncheck()` | uncheck | - |
| `selectOption(value)` | select | value |
| `press(key)` | press | key |
| `hover()` | hover | - |

### 断言映射

| Playwright 断言 | 断言类型 | 预期值 |
|-----------------|----------|--------|
| `toBeVisible()` | visible | true |
| `toBeHidden()` | visible | false |
| `toHaveText(text)` | text | text |
| `toHaveValue(value)` | value | value |
| `toBeChecked()` | checked | true |
| `toBeEnabled()` | enabled | true |
| `toBeDisabled()` | enabled | false |

### 元素自动命名

| 定位方式 | 命名规则 | 示例 |
|----------|----------|------|
| data-testid | 直接使用 | `username` → `username` |
| role + name | 类型 + 动作 | `button[登录]` → `loginBtn` |
| text | 内容缩写 | `text=提交` → `submitText` |
| placeholder | 字段名 | `placeholder=请输入用户名` → `usernameInput` |

命名冲突时添加序号：`submitBtn`、`submitBtn2`、`submitBtn3`

---

## URL/快照输入流程

### 1. 获取快照

**有 URL 时**：
```
1. browser_navigate → 目标 URL
2. browser_snapshot → 获取 A11y 快照
```

**有快照时**：直接使用

### 2. 分析元素

识别可交互元素：
- 按钮（button, [role="button"]）
- 输入框（input, textarea）
- 链接（a, [role="link"]）
- 选择器（select, [role="combobox"]）
- 复选框/单选框（checkbox, radio）

---

## POM.yaml 格式

```yaml
metadata:
  name: PageName           # 页面名称（PascalCase）
  url: /path               # 页面路径
  description: 页面描述     # 中文描述
  generated_at: ISO8601    # 生成时间
  source: recording        # 来源: recording | snapshot | url

elements:
  elementId:               # 元素 ID（camelCase）
    locator: "selector"    # 定位器
    description: 描述       # 中文描述
    type: input            # 类型
    navigation_type: none  # 可选：导航类型（见下方说明）
    fallback:              # 可选：降级定位器
      - "backup-selector1"
      - "backup-selector2"
```

## 导航类型（navigation_type）

对于可能触发页面跳转的元素（按钮、链接等），标注其导航行为：

| 值 | 说明 | AI 执行时处理方式 |
|----|------|------------------|
| `none` | 无导航（默认） | 普通点击 |
| `new_tab` | 打开新标签页 | 点击后检测并切换标签页 |
| `navigation` | 当前页跳转 | 点击后等待页面加载 |
| `spa` | SPA 路由跳转 | 点击后等待 URL 变化 |

**示例**：
```yaml
elements:
  processBtn:
    locator: "text=去处理"
    description: 去处理按钮（打开详情页）
    type: button
    navigation_type: new_tab  # 标注会打开新标签页
```

> 详见 [click-navigation-spec.md](click-navigation-spec.md)

## 元素类型

| 类型 | 说明 | 常见操作 |
|------|------|---------|
| `input` | 输入框 | fill, clear |
| `button` | 按钮 | click |
| `link` | 链接 | click |
| `select` | 下拉框 | selectOption |
| `checkbox` | 复选框 | check, uncheck |
| `radio` | 单选框 | check |
| `text` | 文本元素 | getText, assert |

## 命名规范

- 页面ID：小写驼峰，如 `loginPage`
- 元素ID：小写驼峰，描述功能，如 `submitBtn`、`usernameInput`

---

## 定位器策略

### 通用策略（默认）

| 优先级 | 定位方式 | 示例 | 稳定性 |
|--------|----------|------|--------|
| 1 | data-testid | `[data-testid='login-btn']` | ⭐⭐⭐ |
| 2 | role + name | `role=button[name='登录']` | ⭐⭐⭐ |
| 3 | text | `text=登录` | ⭐⭐ |
| 4 | placeholder | `[placeholder='请输入']` | ⭐⭐ |
| 5 | 语义化类名 | `.login-button` | ⭐⭐ |
| 6 | CSS 选择器 | `button.primary` | ⭐ |

### 无 ARIA 页面策略

当页面不遵守 ARIA 规范且无 data-testid 时：

| 禁止 | 替代方案 |
|------|----------|
| `getByRole('button', { name: 'X' })` | `getByText('X')` |
| `getByRole('textbox', { name: 'X' })` | `getByPlaceholder('X')` |
| `getByTestId('X')` | `getByText('X')` 或 `.class` |

---

## 不稳定定位器检测

### 检测规则

| 模式 | 正则 | 问题 |
|------|------|------|
| Vue scoped CSS | `data-v-[a-f0-9]+` | 每次构建变化 |
| CSS Modules 哈希 | `_[a-z0-9]{5,}$` | 每次构建变化 |
| Element UI 动态 ID | `el-id-\d+-\d+` | 运行时生成 |
| 纯数字 ID | `^#\d+$` | 无语义 |
| 过长 XPath | `/html/body/div[3]/...` | 结构敏感 |

### 警告输出

```markdown
⚠️ **定位器稳定性警告**

| 元素 | 定位器 | 问题 | 建议 |
|------|--------|------|------|
| btn1 | `[data-v-abc123]` | Vue scoped CSS | 添加 data-testid |
| input2 | `.form_input_x7k2f` | CSS Modules 哈希 | 使用语义化类名 |
```

---

## 参考模板

特定场景可参考现有模板：

| 模板 | 路径 | 说明 |
|------|------|------|
| OA 登录 | `templates/pages/oa-login/template.yaml` | 腾讯 OA 登录页（含隐藏字段处理） |

---

## Vue SPA 组件定位

针对 Vue 2/3 + Element UI/TDesign 项目。

### Element UI

| 组件 | 推荐定位方式 | 避免使用 |
|------|-------------|----------|
| Tab | `.el-tabs__item` + `filter({ hasText })` | `getByRole('tab')` |
| Table Header | `.el-table__header-wrapper` + `getByText()` | `th:has-text()` |
| Input | `.el-input__inner[placeholder*="xxx"]` | `getByRole('textbox')` |
| Button | `getByText()` 或 `.el-button` + `filter({ hasText })` | - |
| Pagination | `.el-pagination` + `.first()` | 不带 `.first()` |
| Dialog | `.el-dialog` 或 `getByRole('dialog')` | - |

### TDesign

| 组件 | 推荐定位方式 |
|------|-------------|
| Tab | `.t-tabs__nav-item` + `filter({ hasText })` |
| Table Header | `.t-table__header` + `getByText()` |
| Input | `.t-input__inner[placeholder*="xxx"]` |
| Button | `getByText()` 或 `.t-button` + `filter({ hasText })` |
| Pagination | `.t-pagination` + `.first()` |

### 降级定位器

复杂元素必须提供主/备选定位器：

```yaml
elements:
  tabSettings:
    locator: ".el-tabs__item:has-text('设置')"
    fallback:
      - "role=tab[name='设置']"
    description: 设置标签页
    type: button
```

---

## 输出示例

### 输入（录制代码）

```javascript
import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByTestId('username').fill('testuser');
  await page.getByTestId('password').fill('password123');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page.getByText('欢迎')).toBeVisible();
});
```

### 输出（POM.yaml）

```yaml
metadata:
  name: LoginPage
  url: /login
  description: 登录页面
  source: recording

elements:
  username:
    locator: "[data-testid='username']"
    description: 用户名输入框
    type: input
  password:
    locator: "[data-testid='password']"
    description: 密码输入框
    type: input
  loginBtn:
    locator: "role=button[name='登录']"
    description: 登录按钮
    type: button
  welcomeMsg:
    locator: "text=欢迎"
    description: 欢迎信息
    type: text
```

---

## 检查清单

生成 POM 时必须检查：

```
□ 所有元素 ID 使用 camelCase
□ 所有定位器经过稳定性检测
□ 复杂元素提供 fallback 定位器
□ 未使用 data-v-xxx 属性
□ 未使用带哈希的 CSS Modules 类名
□ 未使用超过 3 层的选择器
□ 可能重复的元素添加 .first()
```

**参考文档**：[vue-spa-locator-spec.md](vue-spa-locator-spec.md)
