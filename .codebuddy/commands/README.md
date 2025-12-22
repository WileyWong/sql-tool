# Commands 目录

本目录包含所有用户可调用的命令（Commands），这些命令编排多个 Skills 形成完整的工作流。

## 📚 完整文档

请查看本 README 了解：
- 所有 8 个 Commands 的详细说明
- Commands 与 Skills 的关系
- 推荐的工作流和最佳实践

## ⚡ 当前状态

当前包含 **12 个核心命令**：

**保留的核心 Commands**：
- **归档类** (1 个) - 变更管理
- **Spec 开发类** (4 个) - 用于开发 Spec-Code 本身
- **工具类** (3 个) - 项目初始化、记忆管理和知识库构建
- **Spec-Coding** (4 个) - 需求分析、方案设计、代码生成、长任务执行 ⭐ 新增

**设计理念**：
- ✅ Commands 专注于编排复杂工作流
- ✅ 简单任务直接使用 Skills（减少层级）
- ✅ 避免 Commands 和 Skills 功能重复
- ✅ 降低学习成本和维护成本

## 📁 目录结构

```
commands/
├── archive/          # 归档管理命令（1 个）
│   └── archive-change.md                # 归档变更
├── spec-dev/         # Spec-Code 开发命令（4 个）
│   ├── gen-skill.md                     # 生成 Skill
│   ├── gen-skill-general.md             # 生成通用 Skill
│   ├── gen-command.md                   # 生成 Command
│   └── gen-agent.md                     # 生成 Agent
├── tools/            # 工具类命令（3 个）
│   ├── init-memory.md                   # 初始化项目记忆
│   ├── init-project.md                  # 初始化项目
│   └── gen-knowledge.md                 # 生成项目知识库
├── spec-coding/      # Spec-Coding 命令（4 个）
│   ├── requirement.md                   # 需求分析
│   ├── design.md                        # 方案设计
│   ├── gen-code-with-review.md          # 代码生成与审查
│   └── run-long-task.md                 # 执行长任务 ⭐ 新增
└── README.md
```

## 🎯 Commands 概览（12 个核心命令）

### 归档管理（1 个）
- `archive.archive-change` - 归档变更

### Spec-Code 开发（4 个）
- `spec-dev.gen-skill` - 生成 Skill
- `spec-dev.gen-skill-general` - 生成通用 Skill
- `spec-dev.gen-command` - 生成 Command
- `spec-dev.gen-agent` - 生成 Agent

### 工具类（3 个）
- `tools.init-memory` - 初始化项目记忆
- `tools.init-project` - 初始化项目结构
- `tools.gen-knowledge` - 生成项目知识库

### Spec-Coding（4 个）
- `spec-coding.requirement` - 需求分析
- `spec-coding.design` - 方案设计
- `spec-coding.gen-code-with-review` - 代码生成与审查
- `spec-coding.run-long-task` - 执行长任务 ⭐ 新增（驱动长时间运行 Agent）

## 📝 Command 结构

每个 Command 是一个 Markdown 文件，包含：

```markdown
---
description: [命令描述]
---

# Command Name

## 命令元数据
- ID: category.command-name
- 分类: [分类]
- 复杂度: [Low/Medium/High]
- 预估时间: [预估时间]

## 命令描述
[详细描述]

## 前置条件检查
[前置条件]

## 执行流程
### Phase 1: [阶段名称]
**REQUIRED SKILL**: 使用 `skills:category/skill-name`
[执行步骤]

### Phase 2: [阶段名称]
**REQUIRED TEMPLATE**: 使用 `templates:category/template-name.md`
[执行步骤]

## 输出产物
[输出产物]

## 验收标准
[验收标准]
```

## 🚀 如何使用 Command

### IDE 集成模式

在 Cursor/Claude/CodeBuddy 中直接调用：

```
/design.gen-db-design
```

### CLI 模式（待实现）

```bash
spec run design.gen-db-design
```

## ✍️ 如何编写 Command

参考：[Skill/Command/Template 编写指南](../docs/SKILL-COMMAND-TEMPLATE-GUIDE.md)

## 🤝 贡献新 Command

欢迎贡献新的 Command！请参考 [贡献指南](../docs/CONTRIBUTING-GUIDE.md)。

## 📞 需要帮助？

如果你在使用 Command 时遇到问题，请：
1. 查看 [Commands 系统完整指南](../docs/COMMANDS.md)
2. 查看具体 Command 的 `Troubleshooting` 部分
3. 搜索 GitHub Issues
4. 创建新 Issue 寻求帮助
