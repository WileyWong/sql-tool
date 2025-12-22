---
command_id: tools.init-memory
command_name: 初始化项目记忆
category: tools
description: 初始化项目记忆系统 - 调用 init-project-memory Skill 为项目创建 constitution.md、guidelines.md 和 context.md
---

# Command: 初始化项目记忆

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ❌ 禁止输出多份项目记忆，禁止输出其他格式比如`constitution-frontend.md`、`guidelines-frontend.md`、`context-frontend.md`
> - ❌ 禁止为多个工程同时生成不同的项目记忆，项目记忆只能保持一份，不应该区分前端和后端等
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `.spec-code/memory/` 目录
> - 文件列表: `constitution.md`、`guidelines.md`、`context.md`，禁止输出多份项目记忆，禁止输出其他格式比如`constitution-frontend.md`、`guidelines-frontend.md`、`context-frontend.md`
> - 文件头部: 必须包含 YAML Frontmatter

## 🎯 用途

为项目创建项目记忆系统，包括：
- **项目宪章** (constitution.md) - 核心原则和技术约束
- **开发指南** (guidelines.md) - 编写规范和最佳实践
- **项目上下文** (context.md) - 当前技术栈和项目状态

所有文件存储在 `.spec-code/memory/` 目录中。

**本 Command 通过调用 [init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md) 来完成初始化工作**。

## 📋 前置条件

- [ ] 项目已创建(至少有 README.md)
- [ ] 项目目标已明确
- [ ] 技术栈已确定

## 🔄 执行流程

### 步骤 1: 验证前置条件

**AI 助手需要检查**:

1. **项目是否已创建**
   - 检查是否存在 README.md
   - 检查是否存在 package.json/pom.xml/requirements.txt 等配置文件
   - 如果不存在，提示用户先创建项目

2. **项目目标是否明确**
   - 从 README.md 中提取项目描述
   - 如果描述不清晰，询问用户补充

3. **技术栈是否确定**
   - 从配置文件中提取技术栈
   - 如果不确定，询问用户确认

### 步骤 2: 调用 init-project-memory Skill

**AI 助手需要**:

1. **触发 Skill**
   - 调用 [init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md)
   - 传递必要的参数（项目信息、用户语言等）

2. **Skill 执行流程**
   - Skill 会自动执行以下步骤：
     - 检测项目记忆状态
     - 检测用户语言
     - 收集项目信息
     - 创建 `.spec-code/memory/` 目录
     - 生成 constitution.md
     - 生成 guidelines.md
     - 生成 context.md
     - 更新 AI 助手配置
     - 验证和报告

3. **监控 Skill 执行**
   - 确保 Skill 成功完成
   - 如果出现错误，提供帮助

### 步骤 3: 验证生成的文件

**AI 助手需要检查**:

1. **检查文件是否存在**
   ```bash
   ls -la .spec-code/memory/
   ```

2. **检查文件格式**
   - 所有文件都包含 YAML Frontmatter
   - 所有文件都是有效的 Markdown

3. **检查文件内容**
   - constitution.md 包含 4-6 条核心原则
   - constitution.md 包含明确的技术约束
   - guidelines.md 包含编码规范和最佳实践，项目中没有实际使用的东西`guidelines.md`中就不应该出现
   - context.md 包含当前技术栈和项目结构

### 步骤 4: 更新 AI 助手配置（如需要）

**如果存在 CLAUDE.md 或 CODEBUDDY.md**:
- 在文件开头添加项目记忆引用部分
- 引用 `.spec-code/memory/` 中的文件
- 包含核心原则摘要
- 包含关键约束

**如果不存在**:
- 提示用户是否需要创建 AI 助手配置文件

### 步骤 5: 生成完成报告

**生成报告**:
```markdown
## 项目记忆初始化完成 ✅

### 创建的文件
- ✅ .spec-code/memory/constitution.md - 项目宪章
- ✅ .spec-code/memory/guidelines.md - 开发指南
- ✅ .spec-code/memory/context.md - 项目上下文

### 核心原则
1. [原则 1]
2. [原则 2]
...

### 技术栈 (基于项目的实际配置)
- 后端: [技术栈]
- 前端: [技术栈]
- 数据库: [数据库]

### 输出目录规范
- **变更 ID 格式**: YYYY-MM-DD-feature-name
- **输出路径**: workspace/{变更ID}/{阶段}/{文件名}
- **阶段分类**: requirements/design/planning/implementation/documentation/deployment
- **YAML Frontmatter**: 所有输出文件必须包含 change_id、document_type、stage、created_at、author 等字段

### 下一步
1. 审查 .spec-code/memory/constitution.md，确认核心原则和输出目录规范
2. 根据需要调整 .spec-code/memory/guidelines.md
3. 在 Commands 和 Skills 中引用项目记忆
4. 按照输出目录规范组织所有生成的文档
```

## 📤 输出

### 文件输出
- `.spec-code/memory/constitution.md` - 项目宪章
- `.spec-code/memory/guidelines.md` - 开发指南
- `.spec-code/memory/context.md` - 项目上下文

## 🔗 相关资源

### 核心 Skill
- **[init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md)** - 本 Command 调用的核心 Skill

### 使用的 Templates
- [constitution-template.md](mdc:templates/project/constitution-template.md)
- [guidelines-template.md](mdc:templates/project/guidelines-template.md)
- [context-template.md](mdc:templates/project/context-template.md)

### 相关 Commands
- [init-project](init-project.md) - 初始化项目结构

### 相关文档
- [文档生成原则](mdc:standards/common/document-generation-rules.md)
- [Skill 设计指南](mdc:docs/best-practices/08-skill-design-guide.md)

## 📚 最佳实践

### 1. 核心原则的选择

**默认原则** (适用于大多数项目):
1. 代码质量优先
2. 文档与代码同步
3. **文档生成约束** - 禁止主动生成总结文档，只在明确要求时生成 ⭐
4. 测试驱动开发
5. 持续集成
6. 安全第一

**必须包含的原则**:
- ⭐ **文档生成约束** - 所有项目都必须包含此原则，防止 AI 助手生成不必要的文档

### 2. 技术约束的定义

**必须明确**:
- 编程语言和版本
- 主要框架和版本
- 数据库类型和版本

**可选但推荐**:
- 禁止使用的技术
- 性能要求(响应时间、吞吐量)
- 安全要求(认证、授权、加密)
- 部署环境(Docker、Kubernetes)

### 3. 保持文档简洁

- constitution.md: 1-2 页
- guidelines.md: 3-5 页
- context.md: 自动生成，无需手动编辑

## ⚠️ 注意事项

### 1. 必须包含文档生成约束 ⭐

**所有项目的 constitution.md 都必须包含文档生成约束**:
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 原地修改优先，不创建新版本文件
- 禁止在根目录创建文档(除 README.md)

这是**强制要求**，确保 AI 助手不会生成不必要的文档。

### 2. 技术约束要具体

- ✅ "使用 Java 17 或更高版本"
- ❌ "使用 Java"

### 3. 代码示例必须来自实际项目

- ✅ 从项目中复制真实的代码片段
- ❌ 虚构不存在的代码示例

### 4. Command 与 Skill 的关系

**本 Command 的作用**:
- 编排和协调 init-project-memory Skill 的执行
- 验证前置条件
- 验证生成的文件
- 更新 AI 助手配置
- 生成完成报告

**Skill 的作用**:
- 执行具体的初始化步骤
- 收集项目信息
- 生成项目记忆文件
- 提供详细的执行反馈

## 🐛 常见问题

### Q1: 项目记忆存储在哪里？

A: 所有项目记忆文件存储在 `.spec-code/memory/` 目录中，参考 spec-kit 的最佳实践。

### Q2: 如何修改已有的项目记忆？

A: 直接编辑 `.spec-code/memory/` 中的对应文件，或重新运行此 Command 覆盖。

### Q3: 为什么必须包含文档生成约束？

A: 文档生成约束是为了防止 AI 助手在完成任务后自动生成不必要的总结文档、分析报告等。通过在项目宪章中明确约束，AI 助手会遵守这一规则，只在用户明确要求时才生成文档。

### Q4: 如果我确实需要生成文档怎么办？

A: 明确告诉 AI 助手"生成文档"、"创建总结"、"写一份报告"等，AI 助手会按照你的要求生成。文档约束只是禁止**主动**生成，不影响**按需**生成。

### Q5: Command 和 Skill 有什么区别？

A: 
- **Skill** (init-project-memory) 是原子性的能力，负责执行具体的初始化步骤
- **Command** (init-memory) 是工作流程，负责编排 Skill 的执行、验证结果、更新配置等

---

## ✅ 验证清单

生成完成后，验证以下项目：

- [ ] 目录存在: `.spec-code/memory/`
- [ ] 文件存在: `constitution.md`、`guidelines.md`、`context.md`
- [ ] 所有文件包含 YAML Frontmatter
- [ ] 所有文件包含 `created_at` 字段
- [ ] 所有文件包含 `author` 字段
- [ ] `constitution.md` 包含 4-6 条核心原则
- [ ] `constitution.md` **必须包含文档生成约束**
- [ ] `constitution.md` 包含明确的技术约束
- [ ] `guidelines.md` 包含编码规范和最佳实践
- [ ] `guidelines.md` 包含代码示例（来自项目实际代码）
- [ ] `context.md` 包含当前技术栈和项目结构
- [ ] `context.md` 包含项目概述和最近变更
- [ ] 所有内容使用了用户的语言（中文/英文，不混合）
- [ ] 技术约束基于项目的实际 package.json/pom.xml 等
- [ ] 代码示例来自项目的实际代码，不是虚构的
- [ ] 项目结构基于实际的 src/ 目录结构
- [ ] AI 助手配置已更新（如果存在 CLAUDE.md 或 CODEBUDDY.md）
- [ ] Skill 执行成功
- [ ] 验证脚本通过

## 📊 成功标准

初始化完成后，应该满足:

- [ ] `.spec-code/memory/constitution.md` 包含 4-6 条核心原则
- [ ] `.spec-code/memory/constitution.md` **必须包含文档生成约束** ⭐
- [ ] `.spec-code/memory/constitution.md` 包含明确的技术约束
- [ ] `.spec-code/memory/guidelines.md` 包含编码规范和最佳实践
- [ ] `.spec-code/memory/context.md` 包含当前技术栈和项目结构
- [ ] 所有文件格式正确(Markdown + YAML Frontmatter)
- [ ] AI 助手配置已更新(如果存在)
- [ ] init-project-memory Skill 成功执行
