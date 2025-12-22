# 可访问性测试指南

前端可访问性（A11y）自动化测试与手动检查指南。

## 测试工具链

### 命令行工具

| 工具 | 用途 | 安装命令 |
|------|------|----------|
| axe-core | 可访问性规则引擎 | `npm install axe-core` |
| pa11y | 命令行可访问性测试 | `npm install -g pa11y` |
| lighthouse | 综合性能/可访问性审计 | Chrome DevTools 内置 |
| html-validate | HTML 验证 | `npm install -g html-validate` |

### 浏览器扩展

| 扩展 | 功能 |
|------|------|
| axe DevTools | 页面可访问性扫描 |
| WAVE | 可视化可访问性问题 |
| Accessibility Insights | 微软可访问性工具 |
| HeadingsMap | 标题层级可视化 |
| Landmarks | 地标区域可视化 |

## 自动化测试

### pa11y 命令行测试

```bash
# 基础测试
pa11y https://example.com

# 指定标准（WCAG 2.1 AA）
pa11y --standard WCAG2AA https://example.com

# 输出 JSON 格式
pa11y --reporter json https://example.com > report.json

# 忽略特定规则
pa11y --ignore "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail" https://example.com

# 等待页面加载
pa11y --wait 3000 https://example.com

# 测试本地文件
pa11y ./index.html
```

### pa11y 配置文件

```javascript
// .pa11yci.json
{
    "defaults": {
        "standard": "WCAG2AA",
        "timeout": 30000,
        "wait": 1000,
        "chromeLaunchConfig": {
            "args": ["--no-sandbox"]
        }
    },
    "urls": [
        "http://localhost:3000/",
        "http://localhost:3000/login",
        "http://localhost:3000/dashboard",
        {
            "url": "http://localhost:3000/form",
            "actions": [
                "click element #submit-btn",
                "wait for element .error-message to be visible"
            ]
        }
    ]
}
```

### axe-core 集成测试

```javascript
// Jest + axe-core
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('可访问性测试', () => {
    it('首页应无可访问性违规', async () => {
        const { container } = render(<HomePage />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })
    
    it('表单组件应无可访问性违规', async () => {
        const { container } = render(<LoginForm />)
        const results = await axe(container, {
            rules: {
                // 禁用特定规则
                'color-contrast': { enabled: false }
            }
        })
        expect(results).toHaveNoViolations()
    })
})
```

### Cypress + axe 集成

```javascript
// cypress/support/commands.js
import 'cypress-axe'

// cypress/e2e/accessibility.cy.js
describe('可访问性测试', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.injectAxe()
    })
    
    it('首页应符合 WCAG 2.1 AA', () => {
        cy.checkA11y(null, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa']
            }
        })
    })
    
    it('导航组件应可访问', () => {
        cy.checkA11y('.main-nav')
    })
    
    it('表单交互后应可访问', () => {
        cy.get('#email').type('invalid-email')
        cy.get('#submit').click()
        cy.checkA11y('.form-container')
    })
})
```

### Playwright + axe 集成

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('可访问性测试', () => {
    test('首页应无严重违规', async ({ page }) => {
        await page.goto('/')
        
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()
        
        expect(results.violations).toEqual([])
    })
    
    test('模态框应可访问', async ({ page }) => {
        await page.goto('/')
        await page.click('#open-modal')
        await page.waitForSelector('.modal')
        
        const results = await new AxeBuilder({ page })
            .include('.modal')
            .analyze()
        
        expect(results.violations).toEqual([])
    })
})
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Start server
        run: npm run preview &
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173/
            http://localhost:4173/login
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

```javascript
// lighthouserc.json
{
    "ci": {
        "collect": {
            "numberOfRuns": 3
        },
        "assert": {
            "assertions": {
                "categories:accessibility": ["error", { "minScore": 0.9 }],
                "categories:best-practices": ["warn", { "minScore": 0.8 }]
            }
        }
    }
}
```

## 手动检查清单

### 键盘导航

```markdown
- [ ] 所有交互元素可通过 Tab 键访问
- [ ] 焦点顺序符合视觉顺序
- [ ] 焦点状态清晰可见
- [ ] 可通过 Escape 键关闭模态框/下拉菜单
- [ ] 可通过 Enter/Space 激活按钮和链接
- [ ] 下拉菜单支持方向键导航
- [ ] 无键盘陷阱（焦点可离开所有区域）
```

### 屏幕阅读器

```markdown
- [ ] 页面有描述性标题
- [ ] 图片有有意义的 alt 文本
- [ ] 表单字段有关联的 label
- [ ] 错误消息与表单字段关联
- [ ] 动态内容更新有 aria-live 通知
- [ ] 自定义组件有正确的 ARIA 角色
- [ ] 链接文本描述目标（非"点击这里"）
```

### 视觉设计

```markdown
- [ ] 文本对比度 ≥ 4.5:1（正文）
- [ ] 大文本对比度 ≥ 3:1（18px+ 或 14px 粗体）
- [ ] 非文本对比度 ≥ 3:1（图标、边框）
- [ ] 不仅依赖颜色传达信息
- [ ] 文本可放大到 200% 不丢失内容
- [ ] 响应式布局支持 320px 宽度
```

### 表单可访问性

```markdown
- [ ] 所有输入有可见 label
- [ ] 必填字段有明确标识
- [ ] 错误消息清晰具体
- [ ] 错误字段有视觉+程序化标识
- [ ] 表单有清晰的提交反馈
- [ ] 自动完成属性正确设置
```

## 常见问题修复

### 对比度不足

```css
/* 问题：对比度不足 */
.text-gray {
    color: #999;  /* 对比度 2.8:1 */
}

/* 修复：提高对比度 */
.text-gray {
    color: #767676;  /* 对比度 4.5:1 */
}

/* 使用 CSS 变量便于管理 */
:root {
    --text-secondary: #767676;  /* 确保 4.5:1 对比度 */
}
```

### 缺少焦点样式

```css
/* 问题：移除焦点样式 */
button:focus {
    outline: none;  /* 不可访问 */
}

/* 修复：自定义焦点样式 */
button:focus-visible {
    outline: 2px solid var(--app-brand-color);
    outline-offset: 2px;
}

/* 全局焦点样式 */
:focus-visible {
    outline: 2px solid var(--app-brand-color);
    outline-offset: 2px;
}
```

### 缺少 label 关联

```html
<!-- 问题：无 label 关联 -->
<input type="email" placeholder="邮箱">

<!-- 修复：显式 label -->
<label for="email">邮箱地址</label>
<input type="email" id="email" name="email">

<!-- 修复：隐式 label -->
<label>
    邮箱地址
    <input type="email" name="email">
</label>

<!-- 修复：aria-label（无可见 label 时） -->
<input type="search" aria-label="搜索内容" placeholder="搜索...">
```

### 图片缺少 alt

```html
<!-- 问题：缺少 alt -->
<img src="chart.png">

<!-- 修复：信息性图片 -->
<img src="chart.png" alt="2024年销售趋势图，Q4增长30%">

<!-- 修复：装饰性图片 -->
<img src="decoration.png" alt="">

<!-- 修复：复杂图片 -->
<figure>
    <img src="diagram.png" alt="系统架构图">
    <figcaption>图1：微服务架构示意图</figcaption>
</figure>
```

### 自定义组件缺少 ARIA

```html
<!-- 问题：div 模拟按钮 -->
<div class="btn" onclick="submit()">提交</div>

<!-- 修复：添加 ARIA 属性 -->
<div class="btn" 
     role="button" 
     tabindex="0"
     onclick="submit()"
     onkeydown="if(event.key==='Enter'||event.key===' ')submit()">
    提交
</div>

<!-- 最佳：使用原生按钮 -->
<button class="btn" onclick="submit()">提交</button>
```

### 动态内容无通知

```html
<!-- 问题：动态更新无通知 -->
<div id="status"></div>

<!-- 修复：添加 aria-live -->
<div id="status" aria-live="polite" aria-atomic="true"></div>

<!-- 错误消息使用 assertive -->
<div id="error" role="alert" aria-live="assertive"></div>
```

### 模态框焦点管理

```javascript
// 打开模态框时
function openModal() {
    const modal = document.getElementById('modal')
    modal.classList.add('open')
    
    // 保存之前的焦点
    previousFocus = document.activeElement
    
    // 焦点移到模态框
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    firstFocusable?.focus()
    
    // 设置焦点陷阱
    modal.addEventListener('keydown', trapFocus)
}

// 关闭模态框时
function closeModal() {
    const modal = document.getElementById('modal')
    modal.classList.remove('open')
    
    // 移除焦点陷阱
    modal.removeEventListener('keydown', trapFocus)
    
    // 恢复之前的焦点
    previousFocus?.focus()
}

// 焦点陷阱
function trapFocus(e) {
    if (e.key !== 'Tab') return
    
    const modal = e.currentTarget
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
    }
}
```

## WCAG 2.1 快速参考

### 级别 A（必须满足）

| 准则 | 要求 |
|------|------|
| 1.1.1 非文本内容 | 图片有 alt 文本 |
| 1.3.1 信息和关系 | 使用语义化标签 |
| 1.4.1 颜色使用 | 不仅依赖颜色 |
| 2.1.1 键盘 | 所有功能可键盘操作 |
| 2.1.2 无键盘陷阱 | 焦点可离开所有区域 |
| 2.4.1 跳过块 | 提供跳过导航链接 |
| 2.4.2 页面标题 | 页面有描述性标题 |
| 3.1.1 页面语言 | 设置 lang 属性 |
| 4.1.1 解析 | HTML 有效 |
| 4.1.2 名称、角色、值 | 自定义组件有 ARIA |

### 级别 AA（应该满足）

| 准则 | 要求 |
|------|------|
| 1.4.3 对比度（最小） | 文本 4.5:1，大文本 3:1 |
| 1.4.4 文本缩放 | 200% 缩放不丢失内容 |
| 1.4.10 重排 | 320px 宽度可用 |
| 1.4.11 非文本对比度 | UI 组件 3:1 |
| 2.4.6 标题和标签 | 标题描述性 |
| 2.4.7 焦点可见 | 焦点状态可见 |
| 3.2.3 一致导航 | 导航顺序一致 |
| 3.2.4 一致标识 | 相同功能一致标识 |
| 3.3.3 错误建议 | 提供错误修正建议 |

## 测试报告模板

```markdown
# 可访问性测试报告

## 测试概要

- **测试日期**: 2024-XX-XX
- **测试页面**: https://example.com
- **测试标准**: WCAG 2.1 AA
- **测试工具**: axe-core 4.x, pa11y 6.x

## 测试结果

### 自动化测试

| 页面 | 违规数 | 严重 | 重要 | 次要 |
|------|--------|------|------|------|
| 首页 | 3 | 0 | 2 | 1 |
| 登录 | 5 | 1 | 3 | 1 |
| 仪表盘 | 2 | 0 | 1 | 1 |

### 手动测试

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 键盘导航 | ✅ 通过 | |
| 屏幕阅读器 | ⚠️ 部分通过 | 动态内容缺少通知 |
| 对比度 | ✅ 通过 | |
| 焦点管理 | ❌ 失败 | 模态框无焦点陷阱 |

## 问题详情

### 严重问题

1. **登录表单缺少 label**
   - 位置: /login 页面
   - 元素: `<input type="email">`
   - 修复: 添加关联的 label 元素

### 重要问题

2. **对比度不足**
   - 位置: 全局
   - 元素: `.text-muted`
   - 当前: 3.2:1
   - 要求: 4.5:1
   - 修复: 将颜色从 #999 改为 #767676

## 修复建议

1. 优先修复严重问题
2. 添加自动化测试到 CI 流程
3. 培训团队可访问性意识
```

## 检查清单

### 自动化测试
- [ ] 配置 pa11y/axe-core
- [ ] 集成到 CI/CD 流程
- [ ] 设置可访问性评分阈值
- [ ] 定期运行 Lighthouse 审计

### 手动测试
- [ ] 键盘导航测试
- [ ] 屏幕阅读器测试（NVDA/VoiceOver）
- [ ] 缩放测试（200%）
- [ ] 高对比度模式测试

### 开发流程
- [ ] 代码审查包含可访问性检查
- [ ] 使用语义化 HTML
- [ ] 测试自定义组件的 ARIA
- [ ] 验证颜色对比度
