---
name: ba-06-ui-html-prototype
description: UI原型设计工作流，包含三个任务：设计元素分析、交互设计、HTML原型生成。从用户旅程和用户故事中提取设计需求，设计交互流程，生成可运行的HTML原型。适用于敏捷开发流程中的UI设计阶段。**必须严格按流程执行，绝对不能跳过或省略**
---

# UI原型设计

将用户旅程和用户故事转化为可落地的UI设计规范和可运行的HTML原型。

## 工作流程

```
用户旅程 + 用户故事
        ↓
  任务1：设计元素分析 → 页面结构、组件清单、字段定义、组件匹配、Layout结构图
        ↓
  任务2：交互设计 → 流程图、交互点、状态流转
        ↓
  任务3：HTML原型 → 可运行的HTML文件
```

## 任务详情

| 任务 | 输入 | 输出 | 详细说明 |
|------|------|------|---------|
| 任务1：设计元素 | 用户旅程、用户故事 | 页面结构、组件清单、字段定义、**组件库匹配**、**Layout结构图** | [task1-design-elements.md](task1-design-elements.md) |
| 任务2：交互设计 | 任务1输出 | PlantUML图、交互点、状态流转 | [task2-interaction-design.md](task2-interaction-design.md) |
| 任务3：HTML原型 | 任务1+2输出 | 可运行HTML文件 | [task3-html-prototype.md](task3-html-prototype.md) |

## 资源文件

| 类别 | 文件 | 说明 |
|------|------|------|
| **示例案例** | [examples.md](examples.md) | 输入/输出示例对 |
| **实际原型** | [examples/](examples/) | 完整HTML原型文件 |
| **PC端模板** | [examples/html-master-page-layout.html](examples/html-master-page-layout.html) | TDesign风格PC主页面布局骨架 |
| **H5移动端模板** | [templates/h5/interviewer-h5-prototype.html](templates/h5/interviewer-h5-prototype.html) | H5移动端多页滑动模板 |
| **设计令牌** | [examples/index.css](examples/index.css) | 企业TDesign CSS变量 |
| **布局样式** | [examples/layout.css](examples/layout.css) | 页面布局样式 |
| **React指南** | [references/tdesign-guide.md](references/tdesign-guide.md) | TDesign React使用规范 |
| **Vue指南** | [references/tdesign-vue-next-guide.md](references/tdesign-vue-next-guide.md) | TDesign Vue Next使用规范 |
| **Vue原始数据** | [references/tdesign-vue-next-raw-data.md](references/tdesign-vue-next-raw-data.md) | TDesign Vue组件列表、图标、Tailwind配置 |

### 代码模板

| 模板 | 适用场景 | 特性 |
|------|---------|------|
| [PC端主页面布局](examples/html-master-page-layout.html) | 后台管理系统、PC Web应用 | 顶部导航、左侧菜单、内容区域 |
| [H5移动端模板](templates/h5/interviewer-h5-prototype.html) | 移动端H5、活动页、营销页 | 全屏滑动、数据卡片、动画效果、触摸手势 |

### 实际原型示例

| 原型 | 场景 | 复杂度 | 类型 |
|------|------|--------|------|
| [ba-04-INVEST原则评估表单](examples/ba-04-INVEST原则评估表单-invest-evaluation-form.html) | INVEST评估表单（ba-04） | 中 | PC端 |
| [US-015-配置BG级审批规则](examples/US-015-配置BG级审批规则-approval-rule-config.html) | BG级审批规则配置（US-015） | 高 | PC端 |
| [面试官年度H5](templates/h5/interviewer-h5-prototype.html) | 年度数据回顾H5活动页 | 高 | H5移动端 |

## 快速开始

### 一次性执行全流程

```
请执行UI原型设计全流程，输入材料如下：

【用户旅程关键阶段】
1. {阶段1} → 2. {阶段2} → 3. {阶段3}

【用户故事列表】
- US-01: 作为{角色}，我需要{功能}，以便{价值}
- US-02: ...

依次完成：设计元素分析 → 交互设计 → HTML原型生成
```

### 单独执行某个任务

**任务1**：`请分析以下用户旅程和用户故事，提取设计元素：...`

**任务2**：`基于以下设计元素，设计交互流程：...`

**任务3**：`基于以下设计元素和交互流程，生成HTML原型：...`

## 设计规范速查（TDesign）

| 类别 | 变量 | 值 |
|------|------|-----|
| 主色调 | `--td-brand-color` | #125FFF（企业蓝） |
| 成功色 | `--td-success-color` | #2BA471 |
| 警告色 | `--td-warning-color` | #FF9C12 |
| 错误色 | `--td-error-color` | #D54941 |
| 间距 | `--td-size-4/6/8` | 8px / 16px / 24px |
| 圆角 | `--td-radius-default/medium` | 3px / 6px |
| 防抖 | - | 输入框200ms、按钮300ms |
| 提示时长 | - | 成功2-3秒、错误5秒 |

**样式表**: 
- [examples/index.css](examples/index.css) - 企业TDesign设计令牌
- [examples/layout.css](examples/layout.css) - 页面布局样式
- TDesign组件库通过CDN引入（见代码模板）

## 成功标准

- ✅ 页面结构覆盖用户旅程100%阶段
- ✅ 组件清单覆盖用户故事100%功能点
- ✅ 设计元素100%匹配到组件库组件
- ✅ 每个页面有对应的Layout结构图
- ✅ 交互流程覆盖正常+异常场景
- ✅ HTML原型可在浏览器直接打开运行
- ✅ 使用TDesign设计系统和企业自定义样式（或用户指定的组件库）

## 📝 版本历史

- **v1.0** (2025-12-17): 初始版本
  - 设计元素分析、交互设计、HTML原型生成三任务工作流
  - PC端和H5移动端模板支持
  - TDesign React/Vue 组件库集成
  - 完整示例和设计令牌

---

**作者**: johnsonyang
