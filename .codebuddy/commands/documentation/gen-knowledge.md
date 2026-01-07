---
command_name: 构建项目知识库
description: 为当前项目建立完整的知识库 - 调用 doc-knowledge-extractor agent 自动提取、组织和维护项目知识。支持 Spring Boot、Vue、Python 等多种技术栈，采用自顶向下的方法论逐章节生成17-18个模块化文档。触发词：建立知识库、生成项目文档、代码文档化。
---

# Command: 构建项目知识库

> ⚠️ **必须遵守**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `kb/` (项目根目录下的知识库目录)

> 强制要求：文档质量要高，不要应付生成
---

使用技能 doc-extract-knowledge 创建知识库