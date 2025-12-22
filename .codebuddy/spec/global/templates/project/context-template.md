---
template_id: project.context
template_name: 项目上下文模板
category: project
description: 项目上下文模板 - 记录当前技术栈、项目结构和最近变更
version: 0.1.0
---

# {{PROJECT_NAME}} - 项目上下文

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Template 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构


**最后更新**: {{LAST_UPDATE_DATE}}

本文档由 `spec-update-memory.sh` 自动生成，记录项目的当前状态。

---

## 项目概述

{{PROJECT_OVERVIEW}}

---

## 核心原则

{{CORE_PRINCIPLES}}

---

## 活跃技术栈

### 后端
{{BACKEND_TECH_STACK}}

### 前端
{{FRONTEND_TECH_STACK}}

### 数据库
{{DATABASE_TECH_STACK}}

### 工具链
{{TOOLCHAIN}}

---

## 项目结构

{{PROJECT_STRUCTURE}}

---

## 构建和测试

### 安装依赖
{{INSTALL_DEPENDENCIES}}

### 启动开发服务器
{{START_DEV_SERVER}}

### 运行测试
{{RUN_TESTS}}

### 构建生产版本
{{BUILD_PRODUCTION}}

---

## 最近变更

{{RECENT_CHANGES}}

---

**注意**: 此文件由脚本自动生成，请勿手动编辑。如需更新，请运行 `./scripts/spec-update-memory.sh`。
