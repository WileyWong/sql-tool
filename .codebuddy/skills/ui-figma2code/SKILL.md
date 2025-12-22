---
name: ui-figma2code
description: 从 Figma 设计稿生成高质量 Vue3+TDesign 前端代码。提供完整的设计稿解析、代码生成和项目集成能力，支持端到端的开发流程。触发词：Figma、设计稿、Vue、TDesign、前端还原。
category: ui
keywords: [设计转代码, Figma, UI自动化, 组件生成, 设计协同]
---

# Skill: Figma 设计稿转代码

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈

## 🎯 Skill 概述

### 功能
从 Figma 设计稿生成高质量的 Vue3+TDesign 前端代码，支持设计稿解析、代码生成和项目集成的完整流程。

### 适用场景
- 现有项目扩展：在已有 Vue3 项目中添加新组件或页面
- 新项目开发：从零开始创建完整的前端项目
- 设计稿还原：将 Figma 设计稿精确转换为可运行的前端代码
- 组件库集成：基于 TDesign 组件库快速构建业务组件
- 响应式开发：支持不同屏幕尺寸的自适应布局

### 触发词
用户可能会用到的关键词：
- Figma、设计稿、UI 还原
- Vue3、Vue、前端组件
- TDesign、组件库
- 前端还原、页面开发
- 响应式布局、移动端适配

### 不适用的场景
- 复杂的后端逻辑开发
- 非 Vue3 技术栈的项目
- 不使用 TDesign 组件库的项目
- 纯静态页面（建议使用原生 HTML/CSS）

## 📋 指令

### 步骤 1: 模式检测和确认

**目标**: 确定工作模式和技术栈配置

**操作**:
1. 检查当前目录环境（存在 package.json 则为原子能力模式）
2. 如果目录为空，询问用户选择模式（原子能力模式/完整项目模式）
3. 确认使用 Vue3 + TDesign + Vite 技术栈

**验证**: 工作模式明确，技术栈确认完毕

**错误处理**: 如果环境不符合要求，提示用户准备相应环境

### 步骤 2: 设计稿分析

**目标**: 从 Figma 设计稿中提取设计规范和组件信息

**操作**:
1. 获取设计稿信息（Figma 链接、截图或描述）
2. 识别页面布局结构（Header、Sidebar、Main、Footer）
3. 提取设计规范（颜色、字体、间距、圆角、阴影）
4. 识别可复用组件并映射到 TDesign 组件
5. 分析组件层级关系和交互逻辑

**验证**: 设计规范完整，组件清单明确，TDesign 组件映射合理

**错误处理**: 如果设计稿信息不完整，要求用户补充；如果 TDesign 组件无法满足需求，提供自定义组件方案

### 步骤 3: 项目结构处理

**目标**: 根据工作模式处理项目结构

**操作**:
1. **原子能力模式**: 分析现有项目结构，确认组件目录，检查 TDesign 依赖
2. **完整项目模式**: 创建标准 Vue3 项目结构，生成配置文件（package.json、vite.config.ts、tsconfig.json）
3. 确保项目结构符合 Vue3 + TDesign 最佳实践
4. 配置必要的开发工具（ESLint、Prettier、TypeScript）

**验证**: 项目结构符合规范，配置文件正确完整，依赖版本兼容

**错误处理**: 如果项目结构不符合规范，提供标准化建议；如果依赖冲突，提供解决方案

### 步骤 4: 样式系统生成

**目标**: 生成设计系统的样式变量和通用样式

**操作**:
1. 基于设计稿提取的规范创建样式变量文件（variables.less）
2. 生成常用混合宏文件（mixins.less）
3. 创建全局样式文件，确保与 TDesign 主题一致
4. 配置样式预处理器（推荐 Less）

**验证**: 样式变量与设计稿一致，混合宏功能完整，样式文件正确导入项目

**错误处理**: 如果样式冲突，提供样式隔离方案；如果变量命名不规范，提供标准化建议

### 步骤 5: 组件代码生成

**目标**: 生成符合设计稿的高质量组件代码

**操作**:
1. 基于设计稿分析结果生成 Vue3 组件
2. 使用 TypeScript 进行类型定义，确保类型安全
3. 集成 TDesign 组件，实现业务功能
4. 添加响应式设计和性能优化
5. 生成完整的组件样式（Less/SCSS）

**验证**: 组件可编译通过，功能正常，样式还原度高，类型检查无错误

**错误处理**: 如果 TDesign 组件不满足需求，提供自定义组件方案；如果样式冲突，提供隔离方案

### 步骤 6: 质量保证和优化

**目标**: 确保代码质量和性能优化

**操作**:
1. 执行代码质量检查（ESLint、TypeScript 类型检查）
2. 应用性能优化策略（v-memo、shallowRef、组件懒加载）
3. 添加错误处理和边界情况处理
4. 生成项目文档（仅完整项目模式）

**验证**: 所有检查通过，性能指标良好，错误处理完善

**错误处理**: 修复代码质量问题，优化性能瓶颈，完善错误处理逻辑

## 📝 示例

### 示例 1: 统计卡片组件（原子能力模式）

**输入**:
```
需求：在现有项目中添加统计卡片组件
设计稿：包含图标、数值、标签、趋势的卡片
当前项目：Vue 3 + TDesign（已存在）
```

**执行步骤**:
1. 模式检测：发现 package.json，自动使用原子能力模式
2. 设计稿分析：提取卡片组件设计规范（颜色、字体、间距）
3. 组件生成：创建 StatCard.vue 组件
4. 样式适配：使用现有项目的样式变量
5. 集成示例：提供使用示例代码

**预期输出**:
```
src/components/business/StatCard.vue  # 新增组件
使用示例代码                          # 集成指导
```

**实际结果**:
✅ 成功生成统计卡片组件，包含完整的 TypeScript 类型定义和响应式设计

### 示例 2: 管理后台首页（完整项目模式）

**输入**:
```
需求：创建管理后台首页
Figma设计稿：
- 左侧导航菜单（可收起）
- 顶部用户信息栏
- 主内容区包含：统计卡片、数据图表、操作按钮
- 整体采用蓝色主题，现代简约风格
技术栈：Vue 3 + TDesign
```

**执行步骤**:
1. 模式选择：完整项目模式
2. 设计稿分析：识别 Layout 布局、StatCard 组件、Chart 组件
3. 项目创建：生成 Vue3+Vite+TDesign 项目结构
4. 样式系统：创建蓝色主题变量文件
5. 组件开发：AppLayout.vue、Header.vue、Sidebar.vue、StatCard.vue、Dashboard.vue
6. 质量保证：ESLint检查、类型验证、文档生成

**预期输出**:
```
project-dashboard/
├── src/components/layout/
├── src/components/business/
├── src/views/Dashboard.vue
├── src/assets/styles/
├── package.json
├── vite.config.ts
└── README.md
```

**实际结果**:
✅ 成功创建完整的管理后台项目，包含布局组件、业务组件、样式系统和项目配置

### 示例 3: 移动端商品卡片（响应式设计）

**输入**:
```
需求：移动端商品卡片组件
设计稿：商品图片、标题、价格、标签
响应式要求：支持桌面端和移动端适配
```

**执行步骤**:
1. 设计稿分析：提取商品卡片设计规范
2. 响应式设计：定义不同屏幕尺寸的适配规则
3. 组件开发：创建 ProductCard.vue 组件
4. 样式优化：使用媒体查询实现响应式布局
5. 性能优化：图片懒加载、组件缓存

**预期输出**:
```vue
<product-card
  :image="product.image"
  :title="product.title"
  :price="product.price"
  :tags="product.tags"
/>
```

**实际结果**:
✅ 成功生成支持响应式设计的商品卡片组件，在不同设备上显示效果良好

## 🎓 最佳实践

### 1. 组件设计原则

**说明**: 遵循单一职责原则，每个组件只负责一个特定功能

**示例**:
```vue
<!-- ✅ 好的组件设计 -->
<stat-card />        <!-- 只负责统计展示 -->
<data-table />       <!-- 只负责表格展示 -->
<search-form />      <!-- 只负责搜索功能 -->

<!-- ❌ 避免的设计 -->
<dashboard-all />    <!-- 包含所有功能，职责不清 -->
```

### 2. TypeScript 类型定义

**说明**: 使用严格的类型定义，提高代码质量和开发体验

**示例**:
```typescript
// ✅ 清晰的 Props 定义
interface StatCardProps {
  icon: 'user' | 'chart' | 'money' | 'order'  // 枚举类型
  value: string | number                       // 联合类型
  label: string                                // 必需属性
  trend?: number                               // 可选属性
  formatter?: (value: any) => string           // 函数类型
}

// ❌ 模糊的 Props 定义
interface BadProps {
  data: any        // 避免 any 类型
  config: object   // 避免 object 类型
}
```

### 3. 样式组织规范

**说明**: 使用设计令牌和 BEM 命名规范，确保样式的一致性和可维护性

**示例**:
```less
// ✅ 使用变量
.button {
  padding: @spacing-md;
  color: @primary-color;
  border-radius: @border-radius-md;
}

// ✅ BEM 命名
.stat-card {}                    // Block
.stat-card__content {}           // Element
.stat-card__trend--up {}         // Modifier
```

## ⚠️ 常见陷阱

### 陷阱 1: TDesign 组件样式不生效

**问题**: 组件渲染异常或样式缺失

**解决方案**: 
1. 确保正确导入 TDesign 样式文件
2. 检查 vite.config.ts 中的 CSS 配置
3. 验证样式变量文件路径正确

### 陷阱 2: TypeScript 类型错误

**问题**: 编译时报告类型错误

**解决方案**:
1. 为自定义组件添加完整的类型定义
2. 检查 tsconfig.json 配置
3. 安装必要的类型包（如 @types/node）

## 🔗 相关资源

### 相关 Skills
- [init-frontend-scaffold](mdc:skills/init-frontend-scaffold/SKILL.md) - 初始化前端项目脚手架
- [ui-connect-api](mdc:skills/ui-connect-api/SKILL.md) - 对接后端 API
- [ui-responsive-design](mdc:skills/ui-responsive-design/SKILL.md) - 响应式设计

### 相关 Commands
- [gen-vue-component](mdc:commands/ui/gen-vue-component.md) - 生成 Vue 组件
- [gen-frontend-project](mdc:commands/ui/gen-frontend-project.md) - 生成前端项目

### 相关文档
- [Vue 3 技术栈](mdc:.codebuddy/spec/global/knowledge/stack/vue3.md)
- [TDesign 组件库指南](mdc:docs/ui/tdesign-guide.md)

## 📚 支持文件

此 Skill 包含以下支持文件：

- **reference.md** - 详细的技术参考和 API 文档
- **examples.md** - 更多使用示例和最佳实践
- **checklist.md** - 验证清单和故障排除
- **templates/** - 组件模板和配置文件模板

## ✅ 验证清单

使用此 Skill 前，请检查：

- [ ] 已获取 Figma 设计稿（链接/截图/描述）
- [ ] 已确定工作模式（原子能力/完整项目）
- [ ] 使用 Vue3 + TDesign 技术栈
- [ ] Node.js 环境已安装（v16+）

使用此 Skill 后，请验证：

- [ ] 组件可编译通过
- [ ] 功能正常，样式还原度高
- [ ] TypeScript 类型检查无错误
- [ ] ESLint 检查无警告
- [ ] 响应式布局工作正常

## 🐛 故障排除

### 问题 1: 项目启动失败

**症状**: `npm run dev` 报错

**原因**: Node.js 版本不兼容或依赖版本冲突

**解决方案**:
1. 检查 Node.js 版本：`node --version`（需要 v16+）
2. 清理依赖：`rm -rf node_modules && npm install`
3. 检查 package.json 中的依赖版本

### 问题 2: 组件样式异常

**症状**: 组件显示不正确或样式缺失

**原因**: TDesign 样式未正确导入或 CSS 变量未定义

**解决方案**:
1. 检查 main.ts 中的样式导入
2. 验证 vite.config.ts 中的 CSS 配置
3. 确认样式变量文件路径正确

## 📞 获取帮助

如果遇到问题：

1. 查看 **checklist.md** 中的验证清单
2. 查看 **examples.md** 中的使用示例
3. 查看 **reference.md** 中的详细参考
4. 查看本文档的"故障排除"部分
5. 联系项目团队

---

**版本**: 3.1.0 (Vue3 专版)  
**最后更新**: 2025-11-10  
**维护者**: Spec-Code Team

**更新日志**:
- **v3.1.0** (2025-11-10): Vue3 技术栈专版
  - ✅ 专注 Vue3 + TDesign 技术栈
  - ✅ 移除 React 相关内容，简化技术选择
  - ✅ 增强 Vue3 Composition API 最佳实践
  - ✅ 优化 TypeScript 和 Vite 集成
  - ✅ 提供更专业的 Vue3 代码示例