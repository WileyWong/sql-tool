---
name: ui-html-refactoring
description: 前端页面重构与优化。包含HTML结构优化、CSS架构重构、JavaScript代码优化、TypeScript类型重构、Vue 2.x/3.x组件重构、现代CSS特性、可访问性测试。适用于代码质量提升、性能优化、可维护性改进、Vue项目迁移。触发词：页面重构、HTML优化、CSS重构、JS优化、TS重构、Vue重构、Vue迁移、Composables、前端重构、可访问性、A11y、Container Queries。
---

# 前端页面重构与优化

对现有前端页面进行全面重构，提升代码质量、性能和可维护性。

## 技能概览

| 模块 | 内容 | 详细指南 |
|------|------|----------|
| **HTML重构** | 语义化、可访问性、结构优化 | [html-refactoring.md](html-refactoring.md) |
| **CSS重构** | 变量体系、工具类、选择器合并 | [css-refactoring.md](css-refactoring.md) |
| **现代CSS** | Container Queries、CSS Layers、:has() | [modern-css.md](modern-css.md) |
| **JS重构** | 模块化、ES6+、性能优化 | [js-refactoring.md](js-refactoring.md) |
| **TS重构** | 类型安全、泛型、工具类型 | [ts-refactoring.md](ts-refactoring.md) |
| **Vue 2重构** | Options API优化、Mixins治理 | [vue2-refactoring.md](vue2-refactoring.md) |
| **Vue 3重构** | Composition API、Composables、3.4/3.5新特性 | [vue3-refactoring.md](vue3-refactoring.md) |
| **Vue迁移** | Vue 2→3迁移指南 | [vue2-to-vue3-migration.md](vue2-to-vue3-migration.md) |
| **Vue+TS** | Vue TypeScript最佳实践 | [vue-typescript.md](vue-typescript.md) |
| **Composables** | Composables设计模式 | [composables-patterns.md](composables-patterns.md) |
| **可访问性测试** | A11y自动化测试与手动检查 | [accessibility-testing.md](accessibility-testing.md) |

## 适用场景

- 存量H5/Web页面质量提升
- 代码重复率过高需要优化
- 缺乏统一设计令牌/类型体系
- 可访问性/SEO需要改进
- 维护成本高需要重构
- Vue 2.x 项目优化重构
- Vue 2→3 版本迁移
- Vue 项目 TypeScript 改造

## 场景判断

根据重构需求选择执行路径：

| 需求 | 执行模块 |
|------|----------|
| 全面重构 | HTML → CSS → JS/TS（按顺序） |
| 仅优化样式 | CSS重构 |
| 使用现代CSS | 现代CSS特性指南 |
| 仅优化脚本 | JS或TS重构 |
| 仅优化结构 | HTML重构 |
| 提升可访问性 | HTML重构 + 可访问性测试 |
| 消除重复代码 | CSS变量化 + JS模块化 |
| Vue 2项目优化 | Vue 2重构 |
| Vue 3项目优化 | Vue 3重构 + Composables |
| Vue 2→3迁移 | Vue迁移指南 |
| Vue+TS改造 | Vue+TS最佳实践 |
| 可访问性审计 | 可访问性测试指南 |

## 综合执行流程

```
现有前端代码
      ↓
步骤1：分析诊断 → 识别各层面问题
      ↓
步骤2：HTML重构 → 语义化、可访问性、结构优化
      ↓
步骤3：CSS重构 → 变量体系、工具类、选择器合并
      ↓
步骤4：JS/TS重构 → 模块化、类型安全、性能优化
      ↓
步骤5：验证测试 → 功能验证、性能测试、可访问性检查
```

## 快速参考

### HTML重构要点

| 要点 | 说明 |
|------|------|
| 语义化标签 | 使用 `header/main/footer/nav/article/section` 替代无语义div |
| 标题层级 | 每页一个h1，层级递进不跳级 |
| 可访问性 | 图片alt、表单label、ARIA属性、键盘导航 |
| 结构优化 | 嵌套不超过5层，消除冗余包装 |

详见：[html-refactoring.md](html-refactoring.md)

### CSS重构要点

| 要点 | 说明 |
|------|------|
| 变量体系 | 3层结构：基础令牌 → 语义令牌 → 组件令牌 |
| 命名规范 | `--{scope}-{category}-{property}` 格式 |
| 工具类 | 抽取高频布局模式（flex-center等） |
| 选择器合并 | 合并相同样式，提取公共属性 |
| 响应式 | 移动优先、断点变量化、弹性布局 |

详见：[css-refactoring.md](css-refactoring.md)

### JavaScript重构要点

| 要点 | 说明 |
|------|------|
| 函数拆分 | 单一职责，函数不超过50行 |
| 模块化 | 提取公共函数，合理组织模块 |
| ES6+语法 | 解构、模板字符串、箭头函数、可选链 |
| 性能优化 | 事件委托、防抖节流、批量DOM操作 |
| 错误处理 | try-catch、全局错误监听 |

详见：[js-refactoring.md](js-refactoring.md)

### TypeScript重构要点

| 要点 | 说明 |
|------|------|
| 消除any | 定义具体接口/类型 |
| 泛型应用 | 通用函数、API响应、仓库模式 |
| 类型收窄 | 类型守卫、区分联合类型 |
| 工具类型 | Partial/Pick/Omit/Record等 |
| 严格模式 | 启用strict及相关检查 |

详见：[ts-refactoring.md](ts-refactoring.md)

### Vue重构要点

| 要点 | 说明 |
|------|------|
| Vue 2优化 | 拆分巨型组件、治理Mixins、规范Props/Events |
| Vue 3优化 | 使用`<script setup>`、提取Composables、类型安全 |
| Vue迁移 | 全局API变更、v-model变更、生命周期重命名 |
| Composables | 单一职责、可组合、类型安全、清理副作用 |

详见：[vue2-refactoring.md](vue2-refactoring.md)、[vue3-refactoring.md](vue3-refactoring.md)、[vue2-to-vue3-migration.md](vue2-to-vue3-migration.md)

## 效果评估指标

### 代码质量指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| CSS代码减少率 | ≥50% | 通过变量化和合并 |
| 变量覆盖率 | ≥80% | 颜色/间距/圆角等 |
| 选择器复用率 | ≥50% | 工具类和基类复用 |
| any类型数量 | 0（业务代码） | TypeScript类型安全 |
| 函数平均行数 | ≤30 | 函数职责单一 |
| 嵌套层级 | ≤3 | 代码可读性 |

### 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| LCP | < 2.5s | 最大内容绘制 |
| CLS | < 0.1 | 累积布局偏移 |
| CSS文件大小 | < 50KB (gzip) | 生产环境压缩后 |
| 关键CSS | < 14KB | 首屏内联样式 |
| 可访问性评分 | ≥ 90 | Lighthouse A11y |

## 资源文件

| 类别 | 文件 | 说明 |
|------|------|------|
| HTML指南 | [html-refactoring.md](html-refactoring.md) | HTML结构优化详细指南 |
| CSS指南 | [css-refactoring.md](css-refactoring.md) | CSS重构详细指南 |
| 现代CSS | [modern-css.md](modern-css.md) | 现代CSS特性指南 |
| JS指南 | [js-refactoring.md](js-refactoring.md) | JavaScript优化详细指南 |
| TS指南 | [ts-refactoring.md](ts-refactoring.md) | TypeScript重构详细指南 |
| Vue 2指南 | [vue2-refactoring.md](vue2-refactoring.md) | Vue 2.x重构指南 |
| Vue 3指南 | [vue3-refactoring.md](vue3-refactoring.md) | Vue 3.x重构指南（含3.4/3.5新特性） |
| Vue迁移 | [vue2-to-vue3-migration.md](vue2-to-vue3-migration.md) | Vue 2→3迁移指南 |
| Vue+TS | [vue-typescript.md](vue-typescript.md) | Vue TypeScript最佳实践 |
| Composables | [composables-patterns.md](composables-patterns.md) | Composables设计模式 |
| 可访问性测试 | [accessibility-testing.md](accessibility-testing.md) | A11y测试指南 |
| 检查清单 | [checklist.md](checklist.md) | 综合检查清单 |
| CSS示例 | [examples.md](examples.md) | 重构前后对比示例 |
| CSS模板 | [templates/refactored.css](templates/refactored.css) | 重构后CSS模板 |
| CSS诊断 | [scripts/analyze-css.py](scripts/analyze-css.py) | CSS自动诊断工具 |
| JS诊断 | [scripts/analyze-js.py](scripts/analyze-js.py) | JS自动诊断工具 |
| TS诊断 | [scripts/analyze-ts.py](scripts/analyze-ts.py) | TS自动诊断工具 |
| HTML诊断 | [scripts/analyze-html.py](scripts/analyze-html.py) | HTML自动诊断工具 |

## 📝 版本历史

- **v1.1.0** (2025-12-17): 功能增强
  - 新增 modern-css.md：Container Queries、CSS Layers、:has()、Subgrid 等
  - 新增 accessibility-testing.md：A11y 自动化测试指南
  - 新增 analyze-html.py：HTML 结构诊断脚本
  - 更新 vue3-refactoring.md：Vue 3.4/3.5 新特性（defineModel、useTemplateRef 等）
  - 更新 css-refactoring.md：性能指标、容器查询、逻辑属性
  - 更新 checklist.md：现代 CSS 和可访问性检查项
  - 优化效果评估指标：区分代码质量和性能指标

- **v1.0.0** (2025-12-17): 初始版本
  - HTML/CSS/JS/TS/Vue 2/Vue 3 重构指南
  - Vue 2→3 迁移指南
  - Composables 设计模式
  - 综合检查清单和示例
  - CSS/JS/TS 诊断脚本
  - Vue 组件模板

---

**作者**: johnsonyang
