# 模板文件说明

本目录包含 `ui-figma2code` Skill 使用的各种模板文件。

## 组件模板

### component-template.vue
Vue3 + TypeScript 组件模板，包含：
- 标准的 template/script/style 结构
- TypeScript Props 和 Events 定义
- 响应式数据和计算属性示例

## 项目配置模板（完整项目模式）

### package-template.json
项目 package.json 模板，包含：
- Vue3 + TDesign + Vite 依赖
- 标准的 npm scripts
- TypeScript 和 ESLint 配置

### tsconfig-template.json
TypeScript 配置模板，包含：
- 严格模式类型检查
- 路径别名配置
- Vue3 支持

### eslintrc-template.js
ESLint 配置模板，包含：
- Vue3 推荐规则
- TypeScript 规则
- 代码风格规则

### prettierrc-template.json
Prettier 代码格式化配置

### main-template.ts
应用入口文件模板，包含：
- Vue3 应用初始化
- TDesign 导入和注册
- 路由配置

## 样式模板

### variables-template.less
样式变量模板，包含：
- 颜色系统
- 字体系统
- 间距和圆角
- 阴影和过渡

### mixins-template.less
Less mixins 工具库，包含：
- Flexbox 布局
- 文本省略
- 滚动条自定义
- 响应式工具

## 文档模板

### readme-template.md
项目 README 模板，包含：
- 项目说明
- 快速开始指南
- 项目结构说明
- 开发规范

---

**使用说明**: 这些模板会在执行 Skill 时自动应用，无需手动修改。
