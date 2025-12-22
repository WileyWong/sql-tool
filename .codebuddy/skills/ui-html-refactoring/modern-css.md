# 现代 CSS 特性指南

现代 CSS 新特性应用指南，覆盖 2023-2024 年浏览器已广泛支持的特性。

## 特性概览

| 特性 | 浏览器支持 | 适用场景 |
|------|-----------|----------|
| Container Queries | Chrome 105+, Safari 16+ | 组件级响应式 |
| CSS Layers | Chrome 99+, Safari 15.4+ | 样式优先级管理 |
| CSS Nesting | Chrome 120+, Safari 17.2+ | 减少重复选择器 |
| :has() 选择器 | Chrome 105+, Safari 15.4+ | 父元素选择 |
| Subgrid | Chrome 117+, Safari 16+ | 嵌套网格对齐 |
| 逻辑属性 | Chrome 87+, Safari 15+ | 国际化布局 |
| color-mix() | Chrome 111+, Safari 16.2+ | 动态颜色混合 |
| 视口单位 | Chrome 108+, Safari 15.4+ | 移动端视口适配 |

## Container Queries（容器查询）

### 基础用法

```css
/* 定义容器 */
.card-container {
    container-type: inline-size;
    container-name: card;
}

/* 基于容器宽度的响应式 */
@container card (min-width: 400px) {
    .card {
        display: flex;
        flex-direction: row;
    }
    .card-image {
        width: 40%;
    }
}

@container card (max-width: 399px) {
    .card {
        display: flex;
        flex-direction: column;
    }
    .card-image {
        width: 100%;
    }
}
```

### 容器查询单位

```css
.card-title {
    /* cqw: 容器宽度的1% */
    font-size: clamp(1rem, 5cqw, 2rem);
}

.card-content {
    /* cqi: 容器内联尺寸的1% */
    padding: 2cqi;
}
```

### 实战：自适应卡片组件

```css
.widget-container {
    container-type: inline-size;
}

.widget {
    display: grid;
    gap: 1rem;
    padding: 1rem;
}

/* 小容器：垂直布局 */
@container (max-width: 300px) {
    .widget {
        grid-template-columns: 1fr;
    }
    .widget-actions {
        flex-direction: column;
    }
}

/* 中等容器：两列布局 */
@container (min-width: 301px) and (max-width: 600px) {
    .widget {
        grid-template-columns: 1fr 1fr;
    }
}

/* 大容器：完整布局 */
@container (min-width: 601px) {
    .widget {
        grid-template-columns: 200px 1fr auto;
    }
}
```

## CSS Layers（级联层）

### 基础用法

```css
/* 定义层级顺序（后面的优先级更高） */
@layer reset, base, components, utilities;

/* 重置层 */
@layer reset {
    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
}

/* 基础层 */
@layer base {
    body {
        font-family: system-ui, sans-serif;
        line-height: 1.5;
    }
    a {
        color: var(--app-brand-color);
    }
}

/* 组件层 */
@layer components {
    .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
    }
    .card {
        background: var(--app-bg-container);
        border-radius: var(--app-radius-lg);
    }
}

/* 工具类层（最高优先级） */
@layer utilities {
    .hidden { display: none !important; }
    .flex-center { display: flex; align-items: center; justify-content: center; }
}
```

### 嵌套层

```css
@layer framework {
    @layer base {
        /* 框架基础样式 */
    }
    @layer components {
        /* 框架组件样式 */
    }
}

/* 引用嵌套层 */
@layer framework.components {
    .btn {
        /* 覆盖框架按钮样式 */
    }
}
```

### 第三方样式隔离

```css
/* 将第三方样式放入低优先级层 */
@layer third-party {
    @import url('third-party-lib.css');
}

/* 自定义样式自动覆盖第三方 */
@layer custom {
    .third-party-component {
        /* 自定义覆盖 */
    }
}
```

## CSS Nesting（原生嵌套）

> **浏览器兼容性提醒**：CSS Nesting 需要 Chrome 120+、Safari 17.2+、Firefox 117+ 支持。
> 在生产环境使用前，请确认目标用户浏览器版本，或使用 PostCSS 等工具进行编译转换。

### 基础语法

```css
/* 原生 CSS 嵌套 */
/* 兼容性：Chrome 120+, Safari 17.2+, Firefox 117+ */
.card {
    background: var(--app-bg-container);
    border-radius: var(--app-radius-lg);
    
    /* 子元素 */
    & .card-header {
        padding: 1rem;
        border-bottom: 1px solid var(--app-border-color);
    }
    
    & .card-body {
        padding: 1rem;
    }
    
    /* 伪类 */
    &:hover {
        box-shadow: var(--app-shadow-md);
    }
    
    /* 伪元素 */
    &::before {
        content: '';
    }
    
    /* 媒体查询嵌套 */
    @media (min-width: 768px) {
        padding: 2rem;
    }
}
```

### 复杂嵌套

```css
.nav {
    display: flex;
    
    & .nav-item {
        padding: 0.5rem 1rem;
        
        & a {
            text-decoration: none;
            color: var(--app-text-primary);
            
            &:hover {
                color: var(--app-brand-color);
            }
            
            &.active {
                font-weight: bold;
            }
        }
    }
    
    /* 响应式 */
    @media (max-width: 768px) {
        flex-direction: column;
        
        & .nav-item {
            padding: 1rem;
        }
    }
}
```

### 与 SCSS 对比

```css
/* SCSS 写法 */
.btn {
    padding: 0.5rem 1rem;
    &-primary { background: blue; }
    &-secondary { background: gray; }
}

/* 原生 CSS（需要完整选择器） */
.btn {
    padding: 0.5rem 1rem;
}
.btn-primary { background: blue; }
.btn-secondary { background: gray; }

/* 或使用 :is() */
.btn {
    padding: 0.5rem 1rem;
    
    &:is(.btn-primary) { background: blue; }
    &:is(.btn-secondary) { background: gray; }
}
```

## :has() 选择器

### 基础用法

```css
/* 包含图片的卡片 */
.card:has(img) {
    padding-top: 0;
}

/* 包含必填字段的表单组 */
.form-group:has(input:required) {
    & label::after {
        content: ' *';
        color: red;
    }
}

/* 包含错误的表单组 */
.form-group:has(input:invalid) {
    border-color: red;
}

/* 包含选中复选框的行 */
tr:has(input[type="checkbox"]:checked) {
    background-color: var(--app-bg-selected);
}
```

### 实战场景

```css
/* 空状态检测 */
.list:has(:not(li)) {
    &::after {
        content: '暂无数据';
        display: block;
        text-align: center;
        color: var(--app-text-secondary);
    }
}

/* 相邻元素样式 */
.input:has(+ .error-message) {
    border-color: red;
}

/* 父元素状态影响 */
.sidebar:has(.menu-item:hover) {
    background-color: var(--app-bg-hover);
}

/* 焦点管理 */
.form:has(:focus-visible) {
    box-shadow: 0 0 0 2px var(--app-brand-color);
}
```

### 复杂选择器组合

```css
/* 包含展开菜单的导航 */
nav:has(.dropdown.open) {
    z-index: 1000;
}

/* 包含视频的文章 */
article:has(video, iframe[src*="youtube"]) {
    max-width: 100%;
}

/* 暗色模式下包含图片的卡片 */
@media (prefers-color-scheme: dark) {
    .card:has(img) {
        background: #1a1a1a;
    }
}
```

## Subgrid

### 基础用法

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.grid-item {
    display: grid;
    /* 继承父网格的列定义 */
    grid-template-columns: subgrid;
    /* 跨越2列 */
    grid-column: span 2;
}
```

### 实战：对齐卡片内容

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.card {
    display: grid;
    grid-template-rows: auto 1fr auto;
    /* 使用 subgrid 对齐所有卡片的标题、内容、操作区 */
    grid-row: span 3;
}

/* 所有卡片的标题对齐 */
.card-header {
    grid-row: 1;
}

/* 所有卡片的内容区对齐 */
.card-body {
    grid-row: 2;
}

/* 所有卡片的操作区对齐 */
.card-footer {
    grid-row: 3;
}
```

## 逻辑属性

### 基础对照

| 物理属性 | 逻辑属性 | 说明 |
|----------|----------|------|
| `margin-left` | `margin-inline-start` | 行内起始边距 |
| `margin-right` | `margin-inline-end` | 行内结束边距 |
| `margin-top` | `margin-block-start` | 块级起始边距 |
| `margin-bottom` | `margin-block-end` | 块级结束边距 |
| `padding-left/right` | `padding-inline` | 行内内边距 |
| `padding-top/bottom` | `padding-block` | 块级内边距 |
| `width` | `inline-size` | 行内尺寸 |
| `height` | `block-size` | 块级尺寸 |
| `text-align: left` | `text-align: start` | 文本起始对齐 |
| `border-left` | `border-inline-start` | 行内起始边框 |

### 实战应用

```css
/* 国际化友好的布局 */
.sidebar {
    /* 替代 width */
    inline-size: 250px;
    /* 替代 padding-left/right */
    padding-inline: 1rem;
    /* 替代 border-right */
    border-inline-end: 1px solid var(--app-border-color);
}

.content {
    /* 替代 margin-left */
    margin-inline-start: 250px;
    /* 替代 padding */
    padding-block: 2rem;
    padding-inline: 1.5rem;
}

/* RTL 语言自动适配 */
html[dir="rtl"] .sidebar {
    /* 无需额外样式，逻辑属性自动翻转 */
}
```

### 简写属性

```css
.box {
    /* margin-inline: start end */
    margin-inline: 1rem 2rem;
    
    /* margin-block: start end */
    margin-block: 0.5rem 1rem;
    
    /* padding-inline 和 padding-block 同理 */
    padding-inline: 1rem;
    padding-block: 0.5rem 1rem;
    
    /* 尺寸 */
    inline-size: 100%;
    max-inline-size: 800px;
    block-size: auto;
}
```

## color-mix()

### 基础用法

```css
:root {
    --app-brand-color: #3b82f6;
    
    /* 混合颜色 */
    --app-brand-light: color-mix(in srgb, var(--app-brand-color) 30%, white);
    --app-brand-dark: color-mix(in srgb, var(--app-brand-color) 70%, black);
    
    /* 透明度变体 */
    --app-brand-10: color-mix(in srgb, var(--app-brand-color) 10%, transparent);
    --app-brand-50: color-mix(in srgb, var(--app-brand-color) 50%, transparent);
}
```

### 动态悬停效果

```css
.btn {
    background: var(--btn-bg, var(--app-brand-color));
    
    &:hover {
        /* 悬停时加深 10% */
        background: color-mix(in srgb, var(--btn-bg, var(--app-brand-color)) 90%, black);
    }
    
    &:active {
        /* 点击时加深 20% */
        background: color-mix(in srgb, var(--btn-bg, var(--app-brand-color)) 80%, black);
    }
}
```

### 色彩空间选择

```css
/* srgb: 标准 RGB 混合 */
color-mix(in srgb, red 50%, blue)

/* oklch: 感知均匀的色彩空间（推荐） */
color-mix(in oklch, red 50%, blue)

/* hsl: 色相-饱和度-亮度 */
color-mix(in hsl, red 50%, blue)
```

## 新视口单位

### 单位对照

| 单位 | 说明 | 适用场景 |
|------|------|----------|
| `svh/svw` | 小视口高度/宽度 | 移动端地址栏展开时 |
| `lvh/lvw` | 大视口高度/宽度 | 移动端地址栏收起时 |
| `dvh/dvw` | 动态视口高度/宽度 | 自动适应地址栏变化 |

### 实战应用

```css
/* 全屏容器（推荐使用 dvh） */
.hero {
    min-height: 100dvh;
    /* 回退方案 */
    min-height: 100vh;
}

/* 固定底部导航 */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* 使用 svh 确保不被地址栏遮挡 */
    padding-bottom: calc(100svh - 100dvh);
}

/* 全屏模态框 */
.modal-fullscreen {
    height: 100dvh;
    width: 100dvw;
}
```

## 用户偏好媒体查询

### prefers-reduced-motion

```css
/* 默认动画 */
.animated {
    transition: transform 0.3s ease;
}

/* 尊重用户减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
    .animated {
        transition: none;
    }
    
    .carousel {
        animation: none;
    }
}
```

### prefers-color-scheme

```css
:root {
    /* 亮色模式默认值 */
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
    }
}

/* 或使用 light-dark() 函数 */
/* ⚠️ 兼容性警告：需要 Chrome 123+, Safari 17.5+, Firefox 120+ */
/* 企业环境（Chrome 120+）建议使用上方的 prefers-color-scheme 媒体查询替代 */
:root {
    color-scheme: light dark;
    --bg-color: light-dark(#ffffff, #1a1a1a);
    --text-color: light-dark(#1a1a1a, #ffffff);
}
```

### prefers-contrast

```css
@media (prefers-contrast: more) {
    :root {
        --text-color: #000000;
        --bg-color: #ffffff;
        --border-color: #000000;
    }
    
    .btn {
        border: 2px solid currentColor;
    }
}

@media (prefers-contrast: less) {
    :root {
        --text-color: #666666;
        --border-color: #cccccc;
    }
}
```

## 兼容性处理

### 特性检测

```css
/* 检测 Container Queries 支持 */
@supports (container-type: inline-size) {
    .card-container {
        container-type: inline-size;
    }
}

/* 检测 :has() 支持 */
@supports selector(:has(*)) {
    .form-group:has(input:invalid) {
        border-color: red;
    }
}

/* 检测 CSS Nesting 支持 */
/* 注意：CSS Nesting 需要 Chrome 120+, Safari 17.2+, Firefox 117+ */
/* 对于不支持的浏览器，建议使用 PostCSS Nesting 插件进行编译 */
@supports (selector(&)) {
    .card {
        & .card-header {
            padding: 1rem;
        }
    }
}
```

### 渐进增强策略

```css
/* 基础样式（所有浏览器） */
.card {
    padding: 1rem;
}

/* 媒体查询回退 */
@media (min-width: 400px) {
    .card {
        display: flex;
    }
}

/* 容器查询增强（支持的浏览器） */
@supports (container-type: inline-size) {
    .card-container {
        container-type: inline-size;
    }
    
    @container (min-width: 400px) {
        .card {
            display: flex;
        }
    }
}
```

## 重构检查清单

### 容器查询
- [ ] 组件级响应式使用 Container Queries
- [ ] 定义了 container-type 和 container-name
- [ ] 使用容器查询单位（cqw/cqi）

### CSS Layers
- [ ] 定义了清晰的层级顺序
- [ ] 第三方样式放入低优先级层
- [ ] 工具类放入最高优先级层

### 原生嵌套
- [ ] 使用 & 符号正确嵌套
- [ ] 媒体查询在选择器内嵌套
- [ ] 嵌套层级不超过 3 层

### :has() 选择器
- [ ] 用于父元素状态选择
- [ ] 用于表单验证状态
- [ ] 提供不支持浏览器的回退

### 逻辑属性
- [ ] 国际化项目使用逻辑属性
- [ ] 使用 inline/block 替代 left/right/top/bottom
- [ ] 使用 start/end 替代 left/right 对齐

### 用户偏好
- [ ] 尊重 prefers-reduced-motion
- [ ] 支持 prefers-color-scheme
- [ ] 考虑 prefers-contrast
