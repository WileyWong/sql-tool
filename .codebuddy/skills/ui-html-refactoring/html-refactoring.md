# HTML结构优化指南

优化HTML文档结构，提升语义化、可访问性和可维护性。

## 执行流程

```
现有HTML代码
      ↓
步骤1：结构分析 → 识别语义问题、嵌套问题、冗余标签
      ↓
步骤2：语义化重构 → 使用正确的语义标签替换div/span
      ↓
步骤3：可访问性增强 → 添加ARIA属性、alt文本、焦点管理
      ↓
步骤4：结构优化 → 减少嵌套层级、消除冗余标签
```

## 步骤1：结构分析

### 1.1 常见问题识别

| 问题类型 | 识别特征 | 影响 |
|----------|----------|------|
| div滥用 | 大量无语义div嵌套 | SEO差、可访问性差 |
| 嵌套过深 | 超过5层嵌套 | 维护困难、性能影响 |
| 冗余包装 | 单子元素的容器 | 代码冗余 |
| 语义缺失 | 无header/main/footer | 结构不清晰 |
| 表单问题 | 缺少label关联 | 可访问性差 |

### 1.2 诊断检查项

- [ ] 页面是否有明确的 `<header>/<main>/<footer>` 结构
- [ ] 导航是否使用 `<nav>` 标签
- [ ] 列表内容是否使用 `<ul>/<ol>/<dl>`
- [ ] 表格数据是否使用 `<table>` 而非div模拟
- [ ] 表单控件是否有关联的 `<label>`
- [ ] 图片是否有有意义的 `alt` 属性

## 步骤2：语义化重构

### 2.1 页面结构语义化

**重构前**：
```html
<div class="header">...</div>
<div class="content">...</div>
<div class="footer">...</div>
```

**重构后**：
```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

### 2.2 语义标签对照表

| 场景 | 错误用法 | 正确用法 |
|------|----------|----------|
| 页面头部 | `<div class="header">` | `<header>` |
| 主要内容 | `<div class="content">` | `<main>` |
| 页面底部 | `<div class="footer">` | `<footer>` |
| 导航区域 | `<div class="nav">` | `<nav>` |
| 独立内容块 | `<div class="article">` | `<article>` |
| 侧边栏 | `<div class="sidebar">` | `<aside>` |
| 内容分区 | `<div class="section">` | `<section>` |
| 图文组合 | `<div class="figure">` | `<figure>` + `<figcaption>` |
| 时间日期 | `<span>2024-01-01</span>` | `<time datetime="2024-01-01">` |
| 联系信息 | `<div class="contact">` | `<address>` |

### 2.3 标题层级规范

```html
<!-- 正确：层级递进 -->
<h1>页面标题</h1>
  <h2>一级章节</h2>
    <h3>二级章节</h3>
  <h2>另一个一级章节</h2>

<!-- 错误：跳级 -->
<h1>页面标题</h1>
  <h3>直接跳到h3</h3>  <!-- 不应跳过h2 -->
```

**规范**：
- 每个页面只有一个 `<h1>`
- 标题层级不跳级（h1→h2→h3）
- 不要为了样式而选择标题级别

### 2.4 列表语义化

**重构前**：
```html
<div class="list">
  <div class="item">项目1</div>
  <div class="item">项目2</div>
</div>
```

**重构后**：
```html
<ul>
  <li>项目1</li>
  <li>项目2</li>
</ul>
```

**列表类型选择**：
- `<ul>`：无序列表（项目符号）
- `<ol>`：有序列表（数字序号）
- `<dl>`：定义列表（术语+描述）

## 步骤3：可访问性增强

### 3.1 图片可访问性

```html
<!-- 信息性图片：提供描述 -->
<img src="chart.png" alt="2024年销售趋势图，显示Q4增长30%">

<!-- 装饰性图片：空alt -->
<img src="decoration.png" alt="">

<!-- 复杂图片：使用figcaption -->
<figure>
  <img src="diagram.png" alt="系统架构图">
  <figcaption>图1：微服务架构示意图，展示了服务间的调用关系</figcaption>
</figure>
```

### 3.2 表单可访问性

```html
<!-- 显式label关联 -->
<label for="email">邮箱地址</label>
<input type="email" id="email" name="email" required>

<!-- 隐式label包裹 -->
<label>
  <span>用户名</span>
  <input type="text" name="username">
</label>

<!-- 必填字段提示 -->
<label for="phone">
  手机号码 <span aria-hidden="true">*</span>
  <span class="sr-only">（必填）</span>
</label>
<input type="tel" id="phone" required aria-required="true">

<!-- 错误提示关联 -->
<input type="email" id="email" aria-describedby="email-error" aria-invalid="true">
<span id="email-error" role="alert">请输入有效的邮箱地址</span>
```

### 3.3 ARIA属性使用

| 场景 | ARIA属性 | 示例 |
|------|----------|------|
| 自定义按钮 | `role="button"` | `<div role="button" tabindex="0">` |
| 展开/收起 | `aria-expanded` | `<button aria-expanded="false">` |
| 加载状态 | `aria-busy` | `<div aria-busy="true">` |
| 实时更新 | `aria-live` | `<div aria-live="polite">` |
| 隐藏装饰 | `aria-hidden` | `<span aria-hidden="true">★</span>` |
| 描述关联 | `aria-describedby` | `<input aria-describedby="hint">` |
| 标签关联 | `aria-labelledby` | `<div aria-labelledby="title">` |

### 3.4 键盘导航

```html
<!-- 可聚焦的自定义元素 -->
<div role="button" tabindex="0" 
     onkeydown="if(event.key==='Enter'||event.key===' ')this.click()">
  自定义按钮
</div>

<!-- 跳过导航链接 -->
<a href="#main-content" class="skip-link">跳转到主要内容</a>

<!-- 焦点陷阱（模态框） -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">确认操作</h2>
  <!-- 焦点应限制在对话框内 -->
</div>
```

### 3.5 屏幕阅读器专用样式

```css
/* 视觉隐藏但屏幕阅读器可读 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 步骤4：结构优化

### 4.1 减少嵌套层级

**重构前**（6层嵌套）：
```html
<div class="wrapper">
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="content">实际内容</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

**重构后**（3层嵌套）：
```html
<main class="container">
  <article class="card">
    <p>实际内容</p>
  </article>
</main>
```

### 4.2 消除冗余包装

**重构前**：
```html
<div class="btn-wrapper">
  <button class="btn">提交</button>
</div>
```

**重构后**：
```html
<button class="btn">提交</button>
```

### 4.3 合理使用Fragment

在框架中避免不必要的包装元素：

```jsx
// React: 使用Fragment
<>
  <Header />
  <Main />
  <Footer />
</>

// Vue: 使用template
<template>
  <Header />
  <Main />
  <Footer />
</template>
```

## 验证清单

### 语义化检查
- [ ] 页面有且仅有一个 `<h1>`
- [ ] 标题层级正确递进
- [ ] 使用了适当的语义标签
- [ ] 列表内容使用 `<ul>/<ol>/<dl>`

### 可访问性检查
- [ ] 所有图片有合适的 `alt` 属性
- [ ] 表单控件有关联的 `<label>`
- [ ] 自定义交互元素可键盘操作
- [ ] 颜色不是传达信息的唯一方式
- [ ] 页面有跳过导航的链接

### 结构检查
- [ ] 嵌套层级不超过5层
- [ ] 无冗余的包装元素
- [ ] HTML代码缩进一致
- [ ] 属性使用双引号

## 常见反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| `<div onclick>` | 不可键盘访问 | 使用 `<button>` |
| `<a href="#">` | 无语义 | 使用 `<button>` |
| `<br><br>` 换行 | 滥用换行 | 使用CSS margin |
| `<table>` 布局 | 语义错误 | 使用CSS布局 |
| 空链接/按钮 | 可访问性差 | 添加文本或aria-label |
