---
template_id: command.memory-reference
template_name: 项目记忆引用模板
category: command
description: Command 文件中引用项目记忆的标准模板
version: 0.1.0
---

## 🧠 项目记忆引用

**必须遵守**:
- 📜 [项目宪章](../../memory/constitution.md) - 核心原则和技术约束
- 📖 [开发指南](../../memory/guidelines.md) - 编写规范和最佳实践
- 🔍 [项目上下文](../../memory/context.md) - 当前技术栈和项目结构

**关键约束**:
1. **文档生成约束**: 禁止主动生成总结文档，只在明确要求时生成 - 详见 [文档生成原则](../../standards/common/document-generation-rules.md)
2. **核心原则**: 遵循 `memory/constitution.md` 中定义的核心原则
3. **技术约束**: 遵循 `memory/constitution.md` 中定义的技术约束
4. **编码规范**: 遵循 `memory/guidelines.md` 中定义的编码规范

**执行前检查**:
1. 读取 `memory/context.md` 了解当前技术栈和项目结构
2. 读取 `memory/constitution.md` 了解核心原则和技术约束
3. 读取 `memory/guidelines.md` 了解编写规范和最佳实践
4. 确认理解文档生成约束，不主动生成总结文档

**执行后验证**:
```bash
./scripts/validate-compliance.sh [生成的文档路径]
```

---

## 使用说明

此模板用于在 Command 文件中引用项目记忆。将此部分复制到 Command 文件的开头（在 `# Command: xxx` 之后）。

### 示例

```markdown
# Command: 生成数据库设计

## 🧠 项目记忆引用

**必须遵守**:
- 📜 [项目宪章](../../memory/constitution.md) - 核心原则和技术约束
- 📖 [开发指南](../../memory/guidelines.md) - 编写规范和最佳实践
- 🔍 [项目上下文](../../memory/context.md) - 当前技术栈和项目结构

**关键约束**:
1. **文档生成约束**: 禁止主动生成总结文档，只在明确要求时生成
2. **数据库类型**: 从 `memory/context.md` 读取当前项目使用的数据库
3. **命名规范**: 遵循 `memory/constitution.md` 中定义的命名规范
...
```

### 自定义关键约束

根据 Command 的具体需求，可以在"关键约束"部分添加特定的约束项，例如：
- 数据库设计：数据库类型、命名规范
- 代码生成：编程语言、框架版本
- API 文档：API 规范、认证方式

但**文档生成约束**必须保留，这是所有 Command 的强制要求。
