# 点击导航处理规范

> ⚠️ **本文档为强制规范，非建议性指引。所有内容必须严格遵循。**

## 问题背景

Web 应用中点击元素后可能出现多种导航行为：

| 导航类型 | 触发方式 | 特征 |
|----------|----------|------|
| 当前页跳转 | `location.href` / `<a>` | URL 变化，页面重载 |
| 新标签页 | `window.open()` / `target="_blank"` | 新标签页创建 |
| 弹窗 | `window.open(url, '', 'popup')` | 新窗口（非标签页） |
| SPA 路由 | Vue Router / React Router | URL 变化，页面不重载 |
| 无变化 | AJAX / 弹窗组件 | URL 不变，DOM 更新 |

**核心问题**：Playwright MCP 的 `browser_click` 执行后，如果是 `window.open()` 打开新标签页，当前上下文仍停留在原页面，需要手动切换。

---

## 通用处理策略

### 操作类型：`点击并导航`

新增操作类型 `点击并导航`，AI 执行时自动检测导航类型并处理。

#### 执行流程

```
1. 记录点击前状态
   - current_url: 当前页面 URL
   - tab_count: 当前标签页数量

2. 执行点击
   - browser_click(ref=目标元素)

3. 等待响应（1-2秒）

4. 检测变化类型
   - browser_tabs(action=list) 获取标签页列表
   - 比较 tab_count 变化

5. 分支处理
   ├─ 新标签页打开 (tab_count 增加)
   │  └─ browser_tabs(action=select, index=新标签页索引)
   │  └─ browser_snapshot() 获取新页面快照
   │  └─ 返回 { type: 'new_tab', page: 新页面 }
   │
   ├─ 当前页跳转 (URL 变化)
   │  └─ 等待页面加载完成
   │  └─ browser_snapshot() 获取新页面快照
   │  └─ 返回 { type: 'navigation', page: 当前页面 }
   │
   └─ 无导航变化
      └─ 检查是否有弹窗/DOM变化
      └─ 返回 { type: 'no_change', page: 当前页面 }
```

---

## MCP 执行步骤模板

### 场景一：点击后可能打开新标签页

```yaml
steps:
  # 步骤1: 记录初始状态（通过快照获取当前URL）
  - step: 1
    action: 截图
    description: 记录点击前状态
    
  # 步骤2: 执行点击
  - step: 2
    action: 点击
    target: 去处理按钮
    description: 点击目标元素
    
  # 步骤3: 检测并切换标签页
  - step: 3
    action: 切换到新标签
    wait_strategy: 网络空闲
    description: 如果打开了新标签页则切换
    
  # 步骤4: 获取目标页面快照
  - step: 4
    action: 截图
    description: 获取导航后页面状态
```

### 场景二：使用组合操作 `点击并导航`

```yaml
steps:
  - step: 1
    action: 点击并导航
    target: 去处理按钮
    wait_strategy: 网络空闲
    description: 点击并自动处理导航（当前页跳转或新标签页）
```

---

## AI 执行指令

当 AI 使用 MCP 工具执行测试时，遇到可能触发导航的点击操作，必须按以下流程处理：

### 标准执行流程

```markdown
## 点击导航处理流程

### 1. 点击前准备
- 调用 `browser_tabs(action=list)` 记录当前标签页数量
- 记录当前页面 URL（从快照中获取）

### 2. 执行点击
- 调用 `browser_click(ref=目标元素)`

### 3. 等待响应
- 等待 1-2 秒让页面响应

### 4. 检测导航类型
- 调用 `browser_tabs(action=list)` 获取最新标签页列表
- 比较标签页数量变化

### 5. 分支处理

#### 5.1 新标签页打开（标签页数量增加）
```
browser_tabs(action=select, index=新标签页索引)
browser_snapshot()  // 获取新页面快照
```

#### 5.2 当前页跳转（URL变化）
```
browser_snapshot()  // 获取新页面快照
```

#### 5.3 无变化
```
browser_snapshot()  // 检查DOM变化
```
```

---

## 测试用例设计规范

### 涉及导航的用例必须包含

1. **明确的导航预期**：在用例描述中说明预期的导航类型
2. **导航后验证**：验证目标页面的 URL 或内容
3. **清理步骤**：如果打开新标签页，需要关闭或切换回原页面

### 用例模板

```yaml
case:
  id: TC-XXX-点击去处理-001
  name: 点击去处理打开详情页
  description: |
    点击列表中的"去处理"按钮，应打开新标签页显示详情页
    预期导航类型：新标签页
  
  steps:
    - step: 1
      action: 点击并导航
      target: processBtn
      description: 点击"去处理"按钮
      
    - step: 2
      action: 断言
      assert_type: URL包含
      expected: /detail
      description: 验证已跳转到详情页
      
    - step: 3
      action: 截图
      description: 记录详情页状态
      
    - step: 4
      action: 关闭标签页
      description: 关闭详情页，返回列表页
```

---

## POM 元素标注

对于可能触发导航的元素，在 POM 中添加 `navigation_type` 属性：

```yaml
elements:
  processBtn:
    locator: "text=去处理"
    description: 去处理按钮
    type: button
    navigation_type: new_tab  # 可选值: new_tab | navigation | spa | none
```

### navigation_type 枚举

| 值 | 说明 | 处理方式 |
|----|------|----------|
| `new_tab` | 打开新标签页 | 点击后检测并切换标签页 |
| `navigation` | 当前页跳转 | 点击后等待页面加载 |
| `spa` | SPA 路由跳转 | 点击后等待 URL 变化 |
| `none` | 无导航 | 普通点击 |

---

## 操作类型参考更新

在 Sheet8（元数据-操作类型参考）中添加：

| 操作类型 | 说明 | Playwright方法 | 适用场景 |
|----------|------|----------------|----------|
| 点击并导航 | 点击并自动处理导航 | `click + waitForEvent/waitForURL` | 可能触发页面跳转或新标签页的点击 |
| 切换到新标签 | 切换到最新打开的标签页 | `context.pages()[index]` | 点击后打开了新标签页 |
| 关闭标签页 | 关闭当前标签页 | `page.close()` | 测试完成后清理 |

---

## 检查清单

AI 执行点击操作时的检查清单：

```
□ 识别元素是否可能触发导航（链接、按钮等）
□ 检查元素是否有 target="_blank" 或 onclick="window.open"
□ 点击前记录标签页数量
□ 点击后检测标签页变化
□ 如有新标签页，切换到新标签页
□ 获取目标页面快照
□ 验证导航结果（URL、页面内容）
□ 测试结束后清理（关闭多余标签页）
```

---

## 常见问题

### Q1: 如何判断元素会打开新标签页？

**方法1**：检查 HTML 属性
```javascript
// 检查是否有 target="_blank"
element.getAttribute('target') === '_blank'
// 检查是否有 onclick 包含 window.open
element.getAttribute('onclick')?.includes('window.open')
```

**方法2**：通过 POM 标注
```yaml
elements:
  processBtn:
    navigation_type: new_tab
```

**方法3**：执行时动态检测（推荐）
- 点击前后比较标签页数量

### Q2: 新标签页打开后如何获取？

```
1. browser_tabs(action=list)  // 获取所有标签页
2. browser_tabs(action=select, index=N)  // 切换到目标标签页
3. browser_snapshot()  // 获取页面快照
```

### Q3: 如何处理 window.open 被浏览器拦截？

Playwright 默认不会拦截 `window.open`，但如果遇到问题：
1. 确保在用户交互（点击）上下文中触发
2. 检查浏览器配置是否允许弹窗
