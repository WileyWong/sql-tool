# CSS重构与优化指南

对现有CSS代码进行架构重构，消除重复代码，建立规范化的样式体系。

## 执行流程

```
现有CSS代码
      ↓
步骤1：分析诊断 → 识别重复代码、变量化机会、可抽取模式
      ↓
步骤2：设计令牌 → 定义CSS变量体系（基础层+语义层+组件层）
      ↓
步骤3：样式重构 → 抽取工具类、合并选择器、创建组件基类
      ↓
步骤4：验证优化 → 视觉还原、对比度检查、效果评估
```

## 步骤1：分析诊断

### 1.1 自动诊断（推荐）

```bash
python scripts/analyze-css.py styles.css
```

输出诊断报告包含：重复颜色、重复间距、重复布局模式、可变量化属性统计。

### 1.2 手动识别标准

| 类型 | 识别特征 | 抽取方式 |
|------|----------|----------|
| 重复颜色 | 相同色值出现3+次 | CSS变量 |
| 重复间距 | 相同padding/margin | 间距变量 |
| 布局模式 | 相同flex/grid配置 | 工具类 |
| 尺寸变体 | 同类元素不同尺寸 | 基类+修饰符 |
| 状态样式 | hover/active/disabled | 状态类 |

## 步骤2：设计令牌体系

### 2.1 CSS变量3层结构

```css
:root {
    /* ========== 第一层：基础设计令牌 ========== */
    --app-brand-color: #125FFF;
    --app-text-primary: rgba(0,0,0,0.9);
    --app-text-anti: #FFFFFF;
    --app-bg-container: #FFFFFF;
    --app-bg-page: #F5F7FA;
    --app-radius-sm: 6px;
    --app-radius-md: 9px;
    --app-radius-lg: 12px;
    --app-radius-round: 50%;
    --app-shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
    --app-shadow-md: 0 4px 16px rgba(0,0,0,0.12);
    --app-space-xs: 8px;
    --app-space-sm: 16px;
    --app-space-md: 24px;
    --app-space-lg: 32px;
    
    /* ========== 第二层：语义化令牌 ========== */
    --app-theme-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --app-theme-start: #667eea;
    --app-theme-end: #764ba2;
    --app-bg-gradient: linear-gradient(180deg, #667eea 0%, #764ba2 50%, var(--app-bg-page) 100%);
    
    /* ========== 第三层：组件级令牌 ========== */
    --app-card-bg: var(--app-bg-container);
    --app-card-radius: var(--app-radius-lg);
    --app-card-shadow: var(--app-shadow-md);
}
```

### 2.2 变量命名规范

#### 分层命名策略

根据项目是否使用设计系统（如 TDesign），采用不同的命名策略：

| 变量来源 | 前缀 | 示例 | 说明 |
|----------|------|------|------|
| **设计系统** | `--td-*` | `--td-brand-color` | TDesign 等组件库官方变量，**保持原样不修改** |
| **应用级** | `--app-*` | `--app-page-bg` | 业务自定义变量，用于扩展设计系统 |
| **桥接变量** | `--app-*` | `--app-brand: var(--td-brand-color)` | 解耦设计系统依赖，便于切换 |
| **组件级** | `--{component}-*` | `--card-radius` | 组件内部变量 |

#### 场景选择

```
使用 TDesign/其他设计系统？
    ├── 是 → 保留 --td-* 变量，扩展用 --app-*
    └── 否 → 统一使用 --app-* 前缀
```

#### 命名格式

```
格式：--{scope}-{category}-{property}[-{variant}]

示例：
--app-brand-color       /* 应用级：品牌色 */
--app-theme-gradient    /* 主题级：主题渐变 */
--app-bg-gradient       /* 背景级：页面渐变 */
--card-radius           /* 组件级：卡片圆角 */
```

#### TDesign 项目示例

```css
:root {
    /* TDesign 官方变量（保持原样） */
    /* --td-brand-color, --td-font-size-body-medium 等由组件库提供 */
    
    /* 应用级扩展变量 */
    --app-page-bg: var(--td-bg-color-container);
    --app-card-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    /* 桥接变量（解耦设计系统） */
    --app-brand-color: var(--td-brand-color);
    --app-text-primary: var(--td-text-color-primary);
}
```

## 步骤3：样式重构

### 3.1 抽取通用工具类

```css
/* 布局工具类 */
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-col { display: flex; flex-direction: column; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.text-center { text-align: center; }
```

### 3.2 创建组件基类+变体

```css
/* 基类定义通用属性 */
.avatar-base { 
    border-radius: var(--app-radius-round); 
    background: var(--app-theme-gradient);
    color: var(--app-text-anti);
}
/* 尺寸变体 */
.avatar-sm { width: 60px; height: 60px; font-size: 28px; }
.avatar-md { width: 80px; height: 80px; font-size: 40px; }
.avatar-lg { width: 100px; height: 100px; font-size: 48px; }
```

### 3.3 合并多选择器

**重构前**：
```css
.page-welcome { background: linear-gradient(...); }
.page-data { background: linear-gradient(...); }
.page-no-access { background: linear-gradient(...); }
```

**重构后**：
```css
.page-welcome, .page-data, .page-no-access { 
    background: var(--app-bg-gradient); 
}
```

### 3.4 提取公共属性

**重构前**：
```css
.card-a { background: #fff; border-radius: 12px; box-shadow: ...; padding: 48px 32px; }
.card-b { background: #fff; border-radius: 12px; box-shadow: ...; padding: 48px 32px; }
.card-c { background: #fff; border-radius: 12px; box-shadow: ...; padding: 40px 32px; }
```

**重构后**：
```css
.card-a, .card-b, .card-c { 
    background: var(--app-bg-container); 
    border-radius: var(--app-radius-lg); 
}
.card-a, .card-b { padding: 48px var(--app-space-lg); box-shadow: var(--app-shadow-md); }
.card-c { padding: 40px var(--app-space-lg); box-shadow: var(--app-shadow-sm); }
```

### 3.5 深色背景文字处理

| 文字类型 | 最小对比度 | 推荐方案 |
|----------|------------|----------|
| 正文标题 | 4.5:1 | `color: #fff` + `text-shadow: 0 1px 2px rgba(0,0,0,0.2)` |
| 辅助文字 | 3:1 | `rgba(255,255,255,0.85)` |
| 次要信息 | 3:1 | `rgba(255,255,255,0.7)` |

```css
.page-title { 
    color: var(--app-text-anti);
    text-shadow: 0 1px 2px rgba(0,0,0,0.2); 
}
.page-desc { color: rgba(255,255,255,0.85); }
.page-tip { color: rgba(255,255,255,0.7); }
```

## 响应式重构

### 核心原则

| 原则 | 说明 |
|------|------|
| **移动优先** | 基础样式为移动端，通过 `min-width` 逐步增强 |
| **断点变量化** | 断点值统一管理，便于全局调整 |
| **弹性布局优先** | 优先使用 `%`/`vw`/`flex`/`clamp()`，减少硬编码 |
| **媒体查询合并** | 分散的媒体查询按断点集中到文件末尾 |

### 断点变量化

```css
:root {
    --app-breakpoint-sm: 576px;   /* 手机横屏 */
    --app-breakpoint-md: 768px;   /* 平板竖屏 */
    --app-breakpoint-lg: 992px;   /* 平板横屏/小桌面 */
    --app-breakpoint-xl: 1200px;  /* 桌面端 */
}
```

### 弹性尺寸技术

```css
/* 使用clamp()实现弹性字体 */
.page-title { font-size: clamp(24px, 5vw, 40px); }

/* 使用百分比+max-width实现弹性容器 */
.card-base { width: 90%; max-width: 400px; margin: 0 auto; }

/* 使用flex实现自适应布局 */
.grid-auto { display: flex; flex-wrap: wrap; gap: var(--app-space-sm); }
.grid-auto > * { flex: 1 1 280px; }
```

### 媒体查询合并

```css
/* ========== 移动端基础样式（默认） ========== */
.card-base { padding: var(--app-space-sm); }
.page-title { font-size: 24px; }

/* ========== 平板及以上 ========== */
@media (min-width: 768px) {
    .card-base { max-width: 400px; padding: var(--app-space-md); }
    .page-title { font-size: 32px; }
}

/* ========== 桌面端 ========== */
@media (min-width: 992px) {
    .card-base { max-width: 500px; }
    .page-title { font-size: 40px; }
}
```

## 性能优化

1. **选择器优化**：避免超过3层嵌套
2. **动画性能**：使用 `transform`/`opacity` 触发GPU加速
3. **关键CSS**：首屏样式内联，非关键样式异步加载
4. **避免重绘**：减少影响布局的属性变更

## 暗色模式

```css
@media (prefers-color-scheme: dark) {
    :root {
        --app-bg-container: #1a1a1a;
        --app-bg-page: #121212;
        --app-text-primary: rgba(255,255,255,0.9);
        --app-shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
    }
}
```

## 兼容性

CSS变量支持：Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+

**降级方案**（如需支持IE11）：
```css
.card { 
    background: #fff; /* 回退值 */
    background: var(--app-bg-container); 
}
```

## 样式分层结构

```
1. 设计令牌层（CSS Variables）     - :root 变量定义
2. 基础重置层（Reset/Normalize）   - 浏览器默认样式重置
3. 通用工具类层（Utilities）       - 布局、间距、文本工具类
4. 组件样式层（Components）        - 组件基类和变体
5. 页面布局层（Layout）            - 页面级布局样式
6. 状态修饰层（States/Modifiers）  - 状态和修饰符样式
```

## 效果评估指标

### 代码质量指标

| 指标 | 计算方式 | 目标值 |
|------|----------|--------|
| 代码行数减少率 | (原行数-新行数)/原行数 | ≥50% |
| 变量覆盖率 | 使用变量的属性/可变量化属性 | ≥80% |
| 选择器复用率 | 复用选择器/总选择器 | ≥50% |

### 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| CSS 文件大小 | < 50KB (gzip) | 生产环境压缩后 |
| 关键 CSS | < 14KB | 首屏内联样式 |
| LCP (Largest Contentful Paint) | < 2.5s | 最大内容绘制 |
| CLS (Cumulative Layout Shift) | < 0.1 | 累积布局偏移 |
| 首次绘制时间 | < 1.8s | FCP |

### 性能优化策略

```css
/* 1. 关键 CSS 内联 */
/* 将首屏必需样式内联到 <head> 中 */
<style>
  /* 关键样式：布局、字体、首屏组件 */
  .header { ... }
  .hero { ... }
</style>

/* 2. 非关键 CSS 异步加载 */
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>

/* 3. 按需加载组件样式 */
/* 使用 CSS Modules 或 Scoped CSS */
```

## 高级响应式技术

### 容器查询（Container Queries）

```css
/* 定义容器 */
.card-container {
    container-type: inline-size;
    container-name: card;
}

/* 基于容器宽度响应 */
@container card (min-width: 400px) {
    .card {
        display: flex;
        flex-direction: row;
    }
}

@container card (max-width: 399px) {
    .card {
        display: flex;
        flex-direction: column;
    }
}
```

### 逻辑属性（国际化友好）

```css
/* 使用逻辑属性替代物理属性 */
.sidebar {
    /* 替代 margin-left */
    margin-inline-start: 1rem;
    /* 替代 padding-left/right */
    padding-inline: 1rem;
    /* 替代 border-right */
    border-inline-end: 1px solid var(--app-border-color);
}

/* RTL 语言自动适配 */
html[dir="rtl"] .sidebar {
    /* 无需额外样式，逻辑属性自动翻转 */
}
```

### 用户偏好适配

```css
/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 高对比度偏好 */
@media (prefers-contrast: more) {
    :root {
        --app-text-primary: #000000;
        --app-bg-container: #ffffff;
        --app-border-color: #000000;
    }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
    :root {
        --app-bg-container: #1a1a1a;
        --app-bg-page: #121212;
        --app-text-primary: rgba(255,255,255,0.9);
    }
}
```

### 新视口单位

```css
/* 动态视口高度（推荐用于移动端全屏） */
.hero {
    min-height: 100dvh;
    /* 回退 */
    min-height: 100vh;
}

/* 小视口高度（地址栏展开时） */
.modal {
    max-height: 100svh;
}
```

详见：[modern-css.md](modern-css.md)
