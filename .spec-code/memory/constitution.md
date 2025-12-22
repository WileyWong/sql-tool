---
name: constitution
description: 项目宪章 - 核心原则和技术约束
created_at: 2025-12-19
author: AI Assistant
---

# 项目宪章

## 项目基本信息

- **项目名称**: SQL Tool
- **项目简介**: MySQL 数据库客户端工具，支持连接管理、SQL 编辑、查询执行和结果展示
- **项目类型**: 桌面应用（Electron）

## 核心原则

### I. 代码质量优先

所有代码必须通过 Linter 检查，遵循 ESLint 规范。组件化开发，模块职责单一。

### II. 文档与代码同步

需求文档、设计文档与代码实现保持同步更新。

### III. 文档生成约束 ⭐

- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 优先原地修改现有文档
- 禁止在根目录创建文档（除 README.md）

### IV. UI 严格遵循设计稿

UI 实现必须严格按照设计稿来实现，不得随意调整布局和样式。

### V. 安全第一

- 数据库连接密码使用 MAC 地址 + AES 对称加密存储
- 敏感信息不得明文存储

### VI. 模块化与组件化

按模块、按组件化的方式实现，确保代码可维护性和可复用性。

## 技术约束

### 必须使用

- **框架**: Electron + Vue 3
- **开发语言**: JavaScript + HTML + CSS
- **UI 组件库**: Element Plus
- **数据库**: MySQL（客户端连接）

### 打包要求

- Windows: 免安装包
- macOS: 安装包

## 开发工作流

### 分支策略

- `main`: 稳定发布分支
- `develop`: 开发分支
- `feature/*`: 功能分支

### 提交规范

使用 Conventional Commits 规范：
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 样式
- `refactor`: 重构
- `test`: 测试

## 质量标准

### 代码质量

- ESLint 检查通过
- 无控制台错误和警告
- 组件职责单一

### UI 质量

- 严格遵循设计稿
- 响应式布局支持
- 用户交互流畅

### 性能要求

- SQL 执行默认超时: 10 分钟
- 结果集最大行数: 5000 行（用户可调整）

## 输出目录规范

### 变更 ID 格式

YYYY-MM-DD-feature-name

### 输出路径规则

workspace/{变更ID}/{阶段}/{文件名}

### 阶段分类

- requirements: 需求文档
- design: 设计文档
- planning: 计划文档
- implementation: 实现代码
- documentation: 文档
- deployment: 部署配置

### YAML Frontmatter 必填字段

- change_id: 变更 ID
- document_type: 文档类型
- stage: 所属阶段
- created_at: 创建时间
- author: 作者
