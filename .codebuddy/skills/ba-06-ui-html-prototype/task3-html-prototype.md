# 任务3：HTML原型生成

生成可交互的HTML原型页面，包含样式、交互逻辑和用户反馈机制。

**前置依赖**: 需要先完成任务1（设计元素）和任务2（交互流程）

## 输入材料

```
【材料1：设计元素（来自任务1）】
{粘贴任务1的完整输出：页面结构分析、UI组件清单、数据字段定义}

【材料2：交互流程（来自任务2）】
{粘贴任务2的关键交互说明表格、交互反馈设计表格和状态流转定义}
```

## 技术规范

### 基础技术栈
- 纯HTML + CSS + JavaScript，无需框架
- 所有代码在一个HTML文件中（含内联CSS和JS）
- 可直接在浏览器打开运行

### 设计系统：TDesign + 企业自定义

使用 **TDesign** 设计系统，结合企业自定义样式表：

```html
<!-- TDesign Web Components（通过CDN引入） -->
<link rel="stylesheet" href="https://unpkg.com/tdesign-web-components@latest/dist/tdesign.css">
<script src="https://unpkg.com/tdesign-web-components@latest/dist/TDesign%20Web%20Components.min.js"></script>

<!-- 项目自定义样式（在examples/目录下） -->
<link rel="stylesheet" href="index.css">
<link rel="stylesheet" href="layout.css">
```

**资源文件说明**：

| 文件 | 说明 |
|------|------|
| `examples/index.css` | 企业TDesign设计令牌（26KB） |
| `examples/layout.css` | 页面布局样式（12KB） |
| TDesign CDN | TDesign Web Components 通过CDN引入 |

**样式表说明**：
- `examples/index.css` - 企业基于TDesign定义的完整设计令牌
- 包含品牌色、语义色、字体、间距、圆角、阴影等变量
- 支持亮色/暗黑主题切换（`theme-mode="dark"`）

**TDesign使用指南**：
- React项目：见 [references/tdesign-guide.md](references/tdesign-guide.md)
- Vue项目：见 [references/tdesign-vue-next-guide.md](references/tdesign-vue-next-guide.md)
- Vue组件原始数据：见 [references/tdesign-vue-next-raw-data.md](references/tdesign-vue-next-raw-data.md)（组件列表、图标、Tailwind配置）

### 代码模板

根据项目类型选择对应模板：

#### PC端模板

参考 [examples/html-master-page-layout.html](examples/html-master-page-layout.html) 获取完整的主页面布局骨架，包含：
- TDesign Web Components 引入
- 顶部导航栏、左侧菜单、内容区域布局
- 侧边栏交互（展开/收起、移动端适配）
- 用户下拉菜单交互

#### H5移动端模板

参考 [templates/h5/interviewer-h5-prototype.html](templates/h5/interviewer-h5-prototype.html) 获取H5移动端模板，包含：
- TDesign CSS变量（内联，无需CDN）
- 全屏多页滑动切换（触摸手势支持）
- 数据卡片、统计展示组件
- 数字滚动动画效果
- 页面指示器和导航
- 移动端适配（max-width: 414px）

**H5模板适用场景**：
- 活动页、营销页
- 年度回顾、数据报告
- 移动端表单、问卷
- 微信H5分享页

**实际原型参考**：
- [examples/ba-04-INVEST原则评估表单-invest-evaluation-form.html](examples/ba-04-INVEST原则评估表单-invest-evaluation-form.html) - INVEST评估表单（PC端）
- [examples/US-015-配置BG级审批规则-approval-rule-config.html](examples/US-015-配置BG级审批规则-approval-rule-config.html) - 审批规则配置（PC端）
- [templates/h5/interviewer-h5-prototype.html](templates/h5/interviewer-h5-prototype.html) - 面试官年度H5（移动端）

### TDesign 核心变量速查

| 类别 | 变量 | 说明 |
|------|------|------|
| 品牌色 | `--td-brand-color` | 主色 #125FFF |
| 品牌色悬停 | `--td-brand-color-hover` | 悬停态 |
| 成功色 | `--td-success-color` | #2BA471 |
| 警告色 | `--td-warning-color` | #FF9C12 |
| 错误色 | `--td-error-color` | #D54941 |
| 文字主色 | `--td-text-color-primary` | rgba(0,0,0,0.9) |
| 文字次要 | `--td-text-color-secondary` | rgba(0,0,0,0.6) |
| 边框色 | `--td-component-border` | 组件边框 |
| 背景色 | `--td-bg-color-container` | 容器背景 |
| 间距 | `--td-size-4/6/8` | 8px/16px/24px |
| 圆角 | `--td-radius-default/medium` | 3px/6px |
| 阴影 | `--td-shadow-1/2/3` | 三级阴影 |

### 交互功能规范

| 功能 | 规范 |
|------|------|
| 表单验证 | 必填、长度、格式，实时反馈 |
| 数据存储 | localStorage模拟持久化 |
| 提示消息 | success/error/warning/info，自动消失 |
| 按钮状态 | hover/active/loading/disabled |
| 防抖设置 | 输入框200ms、按钮300ms |

## 功能区域（根据设计元素动态确定）

根据任务1的输出，生成以下类型的功能区域：

### 1. 数据选择区域
对应任务1中的**选择类组件**（单选、多选、下拉、搜索选择等）：
- 选项卡片/列表（可点击选择，选中高亮）
- 搜索框（实时过滤，防抖200ms）
- 分类筛选（展开/收起）

### 2. 表单输入区域
对应任务1中的**数据字段定义**：
- 输入框（带字数统计、实时验证）
- 文本域（带引导提示）
- 上传组件（进度显示、格式校验）
- 日期/时间选择器

### 3. 数据展示区域（如有）
对应任务1中的**展示类组件**：
- 数据表格（排序、分页）
- 卡片列表（hover效果）
- 统计数据（数值、图表）

### 4. 操作区域
对应任务1中的**操作类组件**：
- 主操作按钮（带loading状态）
- 次要操作按钮（重置、取消）
- 批量操作栏（选中计数、批量按钮）

## 必要通用组件

1. **Toast提示** - success/error/warning/info，自动消失
2. **模态对话框** - 确认操作，支持ESC关闭
3. **按钮loading** - 防重复提交

## 质量要求

| 维度 | 要求 |
|------|------|
| 视觉一致性 | CSS变量管理颜色，间距8/16/24px |
| 交互完整性 | 按钮状态、表单验证、操作反馈 |
| 代码可读性 | 语义化HTML、中文注释、函数单一职责 |

## 验证与反馈循环

生成HTML后，执行以下验证：

```
验证清单：
- [ ] 1. 在浏览器打开HTML文件，检查页面正常渲染
- [ ] 2. 对照任务1的UI组件清单，确认所有组件已实现
- [ ] 3. 对照任务2的交互点说明，测试每个交互
- [ ] 4. 测试表单验证（必填、格式、边界值）
- [ ] 5. 测试按钮loading状态和防重复提交
- [ ] 6. 测试Toast提示（4种类型）
- [ ] 7. 测试模态对话框（ESC关闭、遮罩关闭）
```

**如有遗漏或问题，返回补充修复后再次验证。**

## 分步骤生成（可选）

如果一次性生成过长，可分步骤：

1. **步骤1**：生成HTML结构 + CSS样式 + 模拟数据
2. **步骤2**：添加表单验证 + 按钮交互 + localStorage
3. **步骤3**：完善Toast + 模态框 + 防抖优化

## 输出格式

直接输出完整的HTML文件代码，不要有任何前言或解释。
