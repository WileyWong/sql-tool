# Command 模板

此目录包含 Command 文件的通用模板和片段。

## 模板列表

### memory-reference-template.md
**用途**: Command 文件中引用项目记忆的标准模板

**使用场景**: 所有 Command 文件都应该在开头包含项目记忆引用部分

**关键内容**:
- 引用项目宪章、开发指南、项目上下文
- 强调文档生成约束（必须包含）
- 执行前检查清单
- 执行后验证命令

**示例**:
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
...
```

## 使用指南

### 1. 创建新 Command 时

1. 复制 `memory-reference-template.md` 的内容
2. 粘贴到 Command 文件的开头（在 frontmatter 和标题之后）
3. 根据 Command 的具体需求，自定义"关键约束"部分
4. **保留文档生成约束**，这是强制要求

### 2. 更新现有 Command 时

如果现有 Command 缺少项目记忆引用部分：
1. 在文件开头添加项目记忆引用
2. 确保包含文档生成约束
3. 根据 Command 特点添加特定约束

## 注意事项

⚠️ **文档生成约束是强制要求**

所有 Command 的"关键约束"部分都必须包含：
```markdown
1. **文档生成约束**: 禁止主动生成总结文档，只在明确要求时生成 - 详见 [文档生成原则](../../standards/common/document-generation-rules.md)
```

这确保 AI 助手在执行 Command 时不会自动生成不必要的文档。

## 相关资源

- [项目宪章](../../../memory/constitution.md)
- [开发指南](../../../memory/guidelines.md)
- [文档生成原则](../../standards/common/document-generation-rules.md)
- [Commands 系统文档](../../../docs/COMMANDS.md)
