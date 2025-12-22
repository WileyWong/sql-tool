---
name: init-project-memory
description: 初始化项目记忆系统 - 为项目创建 constitution.md、guidelines.md 和 context.md，建立项目的核心原则、开发指南和上下文信息。适用于新项目启动或现有项目的记忆系统建立。
category: initialization
keywords: [项目记忆, 上下文管理, 知识库, 项目索引, AI助手配置]
---

# Skill: 初始化项目记忆

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ❌ 禁止输出多份项目记忆，禁止输出其他格式比如`constitution-frontend.md`、`guidelines-frontend.md`、`context-frontend.md`
> - ❌ 禁止为多个工程同时生成不同的项目记忆，项目记忆只能保持一份，不应该区分前端和后端等
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

## 🎯 用途

为项目创建项目记忆系统，包括：
- **项目宪章** (constitution.md) - 核心原则和技术约束
- **开发指南** (guidelines.md) - 编写规范和最佳实践
- **项目上下文** (context.md) - 当前技术栈和项目状态

所有文件存储在 `.spec-code/memory/` 目录中，是项目的核心治理文档。

## 何时使用

**触发信号**:
- 新项目启动，需要建立项目记忆系统
- 现有项目缺少项目记忆，需要补充
- 项目原则或技术栈发生变更，需要更新记忆
- 团队成员需要了解项目的核心约束和规范

**前置条件**:
- ✅ 项目已创建（至少有 README.md）
- ✅ 项目目标已明确
- ✅ 技术栈已确定

**何时不用**:
- 只是修改某个字段 → 直接编辑对应文件
- 只是查看项目记忆 → 直接阅读 `.spec-code/memory/` 中的文件
- 项目还在需求阶段 → 先完成需求澄清

> **注意**: 初始化项目记忆时，如果已经存在项目记忆，则更新项目记忆，不重新生成，不能自定义项目记忆文件名称。
> **强制**：项目记忆文件只能是下面这几个，不能生成其他文件
   - `constitution.md` - 项目宪章
   - `guidelines.md` - 开发指南，guidelines.md中不能包含项目未实际使用的技术或者代码示例
   - `context.md` - 项目上下文

## 执行流程

### 步骤 1: 检测项目记忆状态

**目标**: 确定是否需要初始化或更新项目记忆

**操作**:

1. **检查 `.spec-code/memory/` 目录是否存在**
   - 如果不存在 → 进入**初始化流程**
   - 如果存在 → 提示用户已初始化，询问是否要更新

2. **检查必要文件**
   - `constitution.md` - 项目宪章
   - `guidelines.md` - 开发指南
   - `context.md` - 项目上下文

**验证方式**:
```bash
# 检查目录是否存在
ls -la .spec-code/memory/

# 检查文件是否完整
ls -la .spec-code/memory/constitution.md
ls -la .spec-code/memory/guidelines.md
ls -la .spec-code/memory/context.md
```

### 步骤 2: 检测用户语言 ⭐ 重要

**目标**: 确定输出语言，确保一致性

**操作**:

1. **分析用户输入语言**
   - 中文输入 → 所有输出使用中文
   - 英文输入 → 所有输出使用英文
   - 其他语言 → 询问用户偏好

2. **记录语言选择**
   - 在生成的文件中保持一致
   - 不要混合使用多种语言

**验证方式**:
- 检查所有生成的文件是否使用了统一的语言
- 确认没有中英文混合

### 步骤 3: 收集项目信息

**目标**: 收集必要的项目信息，为后续生成提供基础

**操作**:

1. **收集项目基本信息**
   - 项目名称
   - 项目简介（1-2 句话）
   - 项目类型（后端/前端/全栈/库/工具）

2. **提取技术栈信息**
   - 从 `package.json`/`pom.xml`/`requirements.txt` 等提取
   - 编程语言和版本
   - 主要框架和版本
   - 数据库类型和版本
   - 其他关键技术

3. **收集核心原则**（可选）
   - 代码质量标准
   - 测试策略
   - 文档要求
   - 开发工作流
   - 如果用户不确定，使用默认原则

**验证方式**:
- 确认所有必要信息已收集
- 技术栈信息与项目配置文件一致
- 核心原则清晰明确

### 步骤 4: 创建 `.spec-code/memory/` 目录

**目标**: 创建项目记忆的存储目录

**操作**:

```bash
mkdir -p .spec-code/memory
```

**验证方式**:
```bash
ls -la .spec-code/
# 应该看到 memory 目录
```

### 步骤 5: 生成 constitution.md

**目标**: 创建项目宪章，定义核心原则和技术约束

**使用模板**: [constitution-template.md](mdc:skills/init-project-memory/templates/constitution-template.md)

**填充内容** (⭐ 必须基于当前项目的实际情况):

1. **项目基本信息**
   - 项目名称、简介、类型
   - 来自步骤 3 的收集信息

2. **核心原则**（4-6 条）
   - 代码质量优先
   - 文档与代码同步
   - **文档生成约束** ⭐ 必须包含
   - 测试驱动开发
   - 持续集成
   - 安全第一

3. **技术约束**
   - 编程语言和版本
   - 主要框架和版本
   - 数据库类型和版本
   - 禁止使用的技术（如果有）

4. **开发工作流**
   - 分支策略
   - 提交规范
   - 代码审查流程
   - 发布流程

5. **质量标准**
   - 测试覆盖率要求
   - 代码质量指标
   - 文档要求
   - 性能要求

6. **输出目录规范** ⭐ 必须包含
   - 变更 ID 格式规则（YYYY-MM-DD-feature-name）
   - 输出路径规则（workspace/{变更ID}/{阶段}/{文件名}）
   - 阶段分类（requirements/design/planning/implementation/documentation/deployment）
   - YAML Frontmatter 必填字段

**关键要求**:
> - ❌ 禁止虚构内容，必须强制扫描项目的实际代码，提取真实的技术栈
> - ❌ `.spec-code/memory`下只能包含名称为 `constitution.md`、`guidelines.md`、`context.md`的文件，如果有额外的其他文件，必须强制合并，必要时读取用户工程信息整合之后重新初始化
> - ❌ 禁止输出多份项目记忆，禁止输出其他格式比如`constitution-frontend.md`、`guidelines-frontend.md`、`context-frontend.md`
> - ❌ 禁止为多个工程同时生成不同的项目记忆，项目记忆只能保持一份，不应该区分前端和后端等
- ✅ 扫描项目的实际代码，提取真实的技术栈
  - 检查 `package.json`/`pom.xml`/`requirements.txt` 等
  - 检查 `.eslintrc`/`.prettierrc`/`tsconfig.json` 等
  - 检查 `src/` 目录结构
- ✅ **必须包含文档生成约束** - 防止 AI 生成不必要的文档
- ✅ **必须包含输出目录规范** - 确保所有输出文件遵循规范
- ✅ 使用用户的语言（中文/英文）生成所有内容

**输出**: `.spec-code/memory/constitution.md`

**示例**:
```markdown
---
name: constitution
description: 项目宪章 - 核心原则和技术约束
created_at: 2025-11-05
author: AI Assistant
---

# 项目宪章

## 项目基本信息
- **项目名称**: 用户管理系统
- **项目简介**: 为企业提供完整的用户管理和权限控制解决方案
- **项目类型**: 全栈应用

## 核心原则

### I. 代码质量优先
所有代码必须通过 Linter 和测试才能合并。

### II. 文档与代码同步
文档与代码同等重要，必须同步更新。

### III. 文档生成约束 ⭐
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 优先原地修改现有文档

### IV. 测试驱动开发
所有功能必须有对应的测试。

### V. 持续集成
所有代码必须通过 CI/CD 流程。

### VI. 安全第一
所有代码必须通过安全审计。

## 技术约束
- 后端: Java 17 + Spring Boot 3.x
- 前端: Vue 3 + Vite
- 数据库: PostgreSQL 14+
- 缓存: Redis 7.x

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
```

### 步骤 6: 生成 guidelines.md

**目标**: 使用项目现有代码，创建开发指南，定义编写规范和最佳实践，guidelines.md中不能包含项目未实际使用的技术或者代码示例

> - ❌ 禁止虚构最佳实践
> 注意：如果项目没有现有的代码，可以跳过这一步。所有的 命名规范、代码格式、最佳实践等 都必须来源于项目现有代码，不能虚构。
> 再次强调，guidelines.md 是基于当前项目的代码生成的，不是虚构的。

**使用模板**: [guidelines-template.md](mdc:skills/init-project-memory/templates/guidelines-template.md)

**填充内容** (⭐ 必须基于当前项目的实际代码):

1. **命名规范**
   - 文件命名
   - 变量命名
   - 函数命名
   - 类命名

2. **代码格式**
   - 缩进规范
   - 行宽限制
   - 换行规则
   - 空行规则

3. **最佳实践**
   - 错误处理
   - 日志记录
   - 性能优化
   - 安全考虑

4. **常见问题和解决方案**
   - 常见错误
   - 解决方案
   - 代码示例

**关键要求**:
- ✅ **必须基于当前项目的实际代码**
- ✅ 根据技术栈生成对应的编码规范
- ✅ 根据项目类型生成对应的最佳实践
- ✅ **扫描项目的实际代码**，提取真实的编码风格和模式
  - 分析现有代码的命名规范
  - 分析现有代码的结构模式
  - 分析现有代码的最佳实践
  - 提取实际的代码示例（从项目中复制，不虚构）
- ✅ 使用用户的语言（中文/英文）生成所有内容
- ✅ 彻底移除了所有项目中不存在的虚构代码示例，并用项目的实际代码替换

**输出**: `.spec-code/memory/guidelines.md`

### 步骤 7: 生成 context.md

**目标**: 创建项目上下文，记录当前技术栈和项目状态

> - ❌ 禁止虚构内容，必须强制扫描项目的实际内容得到项目上下文

**使用模板**: [context-template.md](mdc:skills/init-project-memory/templates/context-template.md)

**填充内容** (⭐ 必须基于当前项目的实际代码):

1. **项目概述**
   - 从 README.md 提取项目概述
   - 项目定位和核心概念

2. **活跃技术栈**
   - 从 `package.json`/`pom.xml` 等提取**实际技术栈**
   - 开发语言、工具框架、AI 助手

3. **项目结构**
   - 核心目录说明
   - 关键文件说明

4. **当前开发阶段**
   - Phase 1/2/3 进度
   - 当前优先级

5. **最近变更**
   - 从 Git 历史提取最近变更

6. **代码结构和示例**
   - **扫描项目源代码**，提取实际的代码结构
   - 如果是 Node.js 项目：扫描 `src/` 或 `lib/` 目录
   - 如果是 Java 项目：扫描 `src/main/java`
   - 如果是 Python 项目：扫描 `src/` 或项目根目录
   - 如果是前端项目：扫描 `src/components`、`src/pages` 等
   - **不要虚构代码示例**，只使用项目中实际存在的代码

**关键要求**:
- ✅ 所有信息基于项目的实际代码
- ✅ 代码示例来自项目的实际代码，不虚构
- ✅ 项目结构基于实际的 `src/` 目录结构

**输出**: `.spec-code/memory/context.md`

### 步骤 8: 更新 AI 助手配置

**目标**: 在 AI 助手配置文件中添加项目记忆引用

**操作**:

1. **检查是否存在 CLAUDE.md 或 CODEBUDDY.md**
   - 如果存在 → 在文件开头添加项目记忆引用部分
   - 如果不存在 → 提示用户是否需要创建

2. **添加项目记忆引用**
   ```markdown
   > 📚 **项目记忆引用**
   > - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
   > - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的编写规范
   > - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构
   ```

3. **包含核心原则摘要**
   - 从 constitution.md 提取核心原则
   - 简要说明关键约束

**验证方式**:
- 检查 CLAUDE.md/CODEBUDDY.md 是否包含项目记忆引用
- 确认引用链接正确

### 步骤 9: 验证和报告

**目标**: 验证所有文件已正确生成，并生成完成报告

**验证清单**:

- [ ] `.spec-code/memory/constitution.md` 已创建
- [ ] `.spec-code/memory/guidelines.md` 已创建
- [ ] `.spec-code/memory/context.md` 已创建
- [ ] 所有文件格式正确（Markdown + YAML Frontmatter）
- [ ] 所有必填字段已填充
- [ ] ⭐ 所有内容使用了用户的语言（中文/英文，不混合）
- [ ] ⭐ constitution.md 中的技术约束基于项目的实际配置文件
- [ ] ⭐ constitution.md 中包含文档生成约束
- [ ] ⭐ constitution.md 中包含输出目录规范
- [ ] ⭐ guidelines.md 中的代码示例来自项目的实际代码
- [ ] ⭐ context.md 中的项目结构和代码示例基于实际的 src/ 目录结构
- [ ] AI 助手配置已更新（如果存在）

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

### 代码示例 (来自项目的实际代码)
- [示例 1]
- [示例 2]
...

### 下一步
1. 审查 .spec-code/memory/constitution.md，确认核心原则和输出目录规范
2. 根据需要调整 .spec-code/memory/guidelines.md
3. 在 Commands 和 Skills 中引用项目记忆
4. 按照输出目录规范组织所有生成的文档
```

## 📤 输出

### 文件输出

```
.spec-code/memory/
├── constitution.md      # 项目宪章
├── guidelines.md        # 开发指南
└── context.md          # 项目上下文
```

### 文件格式

所有文件都必须包含 YAML Frontmatter：

```yaml
---
name: constitution
description: 项目宪章 - 核心原则和技术约束
created_at: 2025-11-05
author: AI Assistant
---
```

## 🔗 相关资源

### 使用的 Templates
- [constitution-template.md](mdc:skills/init-project-memory/templates/constitution-template.md)
- [guidelines-template.md](mdc:skills/init-project-memory/templates/guidelines-template.md)
- [context-template.md](mdc:skills/init-project-memory/templates/context-template.md)

### 相关 Skills
- [init-frontend-scaffold](mdc:global/skills/init-frontend-scaffold/SKILL.md) - 初始化前端脚手架
- [init-backend-scaffold](mdc:global/skills/init-backend-scaffold/SKILL.md) - 初始化后端脚手架

### 相关文档
- [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
- [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)

## 📚 最佳实践

### 1. 核心原则的选择

**默认原则** (适用于大多数项目):
1. 代码质量优先
2. 文档与代码同步
3. **文档生成约束** - 禁止主动生成总结文档 ⭐
4. 测试驱动开发
5. 持续集成
6. 安全第一

**必须包含的原则**:
- ⭐ **文档生成约束** - 所有项目都必须包含此原则

### 2. 技术约束的定义

**必须明确**:
- 编程语言和版本
- 主要框架和版本
- 数据库类型和版本

**可选但推荐**:
- 禁止使用的技术
- 性能要求（响应时间、吞吐量）
- 安全要求（认证、授权、加密）
- 部署环境（Docker、Kubernetes）

### 3. 保持文档简洁

- constitution.md: 1-2 页
- guidelines.md: 3-5 页
- context.md: 自动生成，无需手动编辑

### 4. 定期更新项目记忆

**建议频率**:
- 每月更新一次 context.md（自动提取最近变更）
- 技术栈变更时更新 constitution.md
- 编码规范调整时更新 guidelines.md

## ⚠️ 注意事项

### 1. 必须包含文档生成约束 ⭐

**所有项目的 constitution.md 都必须包含文档生成约束**:
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 原地修改优先，不创建新版本文件
- 禁止在根目录创建文档（除 README.md）

这是**强制要求**，确保 AI 助手不会生成不必要的文档。

### 2. 技术约束要具体

- ✅ "使用 Java 17 或更高版本"
- ❌ "使用 Java"

### 3. 代码示例必须来自实际项目

- ✅ 从项目中复制真实的代码片段
- ❌ 虚构不存在的代码示例

### 4. 语言一致性

- ✅ 全部中文或全部英文
- ❌ 中英文混合

## 🐛 常见问题

### Q1: 项目记忆存储在哪里？

A: 所有项目记忆文件存储在 `.spec-code/memory/` 目录中。

### Q2: 如何修改已有的项目记忆？

A: 直接编辑 `.spec-code/memory/` 中的对应文件，或重新运行此 Skill 覆盖。

### Q3: 为什么必须包含文档生成约束？

A: 文档生成约束是为了防止 AI 助手在完成任务后自动生成不必要的总结文档、分析报告等。通过在项目宪章中明确约束，AI 助手会遵守这一规则，只在用户明确要求时才生成文档。

### Q4: 如果我确实需要生成文档怎么办？

A: 明确告诉 AI 助手"生成文档"、"创建总结"、"写一份报告"等，AI 助手会按照你的要求生成。文档约束只是禁止**主动**生成，不影响**按需**生成。

### Q5: 如何自动更新项目上下文？

A: 运行脚本 `./scripts/spec-update-memory.sh` 或使用全局命令 `spec-update-memory`，自动提取项目信息并更新 context.md。

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
- [ ] `constitution.md` 包含输出目录规范
- [ ] `guidelines.md` 包含编码规范和最佳实践
- [ ] `guidelines.md` 包含代码示例（来自项目实际代码）
- [ ] `context.md` 包含当前技术栈和项目结构
- [ ] `context.md` 包含项目概述和最近变更
- [ ] 所有内容使用了用户的语言（中文/英文，不混合）
- [ ] 技术约束基于项目的实际 package.json/pom.xml 等
- [ ] 代码示例来自项目的实际代码，不是虚构的
- [ ] 项目结构基于实际的 src/ 目录结构
- [ ] AI 助手配置已更新（如果存在 CLAUDE.md 或 CODEBUDDY.md）

## 📊 成功标准

初始化完成后，应该满足:

- [ ] `.spec-code/memory/constitution.md` 包含 4-6 条核心原则
- [ ] `.spec-code/memory/constitution.md` **必须包含文档生成约束** ⭐
- [ ] `.spec-code/memory/constitution.md` 包含明确的技术约束
- [ ] `.spec-code/memory/constitution.md` 包含输出目录规范
- [ ] `.spec-code/memory/guidelines.md` 包含编码规范和最佳实践
- [ ] `.spec-code/memory/context.md` 包含当前技术栈和项目结构
- [ ] 所有文件格式正确（Markdown + YAML Frontmatter）
- [ ] AI 助手配置已更新（如果存在）
- [ ] 所有内容使用了统一的语言（中文或英文）
- [ ] 技术约束和代码示例基于项目的实际情况
