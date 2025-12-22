# 项目记忆模板

本目录包含用于初始化项目记忆系统的模板文件。

## 模板文件

### [constitution-template.md](mdc:skills/init-project-memory/templates/constitution-template.md)
项目宪章模板 - 定义项目的核心原则、技术约束和治理规则

**用途**：
- 定义项目的核心原则（4-6条）
- 明确技术约束（编程语言、框架、数据库等）
- 规定开发工作流（分支策略、提交规范、代码审查）
- 设定质量标准（代码质量、测试要求、文档要求）
- 定义输出目录规范和文档生成约束

### [guidelines-template.md](mdc:skills/init-project-memory/templates/guidelines-template.md)
开发指南模板 - 定义编码规范、最佳实践和常见问题

**用途**：
- 定义命名规范（文件、变量、函数、类）
- 规定代码格式（缩进、行宽、换行）
- 提供最佳实践（错误处理、日志记录、性能优化、安全实践）
- 解答常见问题

### [context-template.md](mdc:skills/init-project-memory/templates/context-template.md)
项目上下文模板 - 记录当前技术栈、项目结构和最近变更

**用途**：
- 记录项目概述和核心原则
- 列出活跃技术栈（后端、前端、数据库、工具链）
- 描述项目结构
- 提供构建和测试命令
- 记录最近变更

## 使用方式

这些模板由 [init-project-memory](mdc:skills/init-project-memory/SKILL.md) 技能使用，用于生成项目记忆文件到 `.spec-code/memory/` 目录。

模板中的占位符（如 `{{PROJECT_NAME}}`）会在生成时被替换为实际的项目信息。

## 模板变量

常用的模板变量包括：

- `{{PROJECT_NAME}}` - 项目名称
- `{{PROJECT_DESCRIPTION}}` - 项目简介
- `{{PROJECT_TYPE}}` - 项目类型（后端/前端/全栈/库/工具）
- `{{PRIMARY_LANGUAGE}}` - 主要编程语言
- `{{BACKEND_FRAMEWORK}}` - 后端框架
- `{{FRONTEND_FRAMEWORK}}` - 前端框架
- `{{PRIMARY_DATABASE}}` - 主数据库
- `{{LAST_UPDATE_DATE}}` - 最后更新日期

更多变量请参考各模板文件。

## 相关文档

- [init-project-memory 技能文档](mdc:skills/init-project-memory/SKILL.md)
- [项目记忆系统说明](mdc:spec/docs/project-memory-system.md)
