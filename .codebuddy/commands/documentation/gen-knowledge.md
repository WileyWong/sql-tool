---
command_id: documentation.gen-knowledge
command_name: 构建项目知识库
category: documentation
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
> - 文件格式: Markdown + YAML Frontmatter
> - 命名规范: 小写字母 + 连字符 + `.md`

> 强制要求：文档质量要高，不要应付生成
---

## 🎯 用途

为代码库自动建立**结构化的知识库**，包括：
- **分类索引文档** - API、业务逻辑、数据模型等14个分类
- **总索引** - 自动生成的 README.md，包含统计和导航
- **维护机制** - 版本控制和更新记录

**核心优势**:
- ✅ **自动化** - 通过 agent 自动扫描和提取
- ✅ **结构化** - 按技术栈分类组织
- ✅ **可维护** - 批量操作确保一致性
- ✅ **多技术栈** - 支持 Spring Boot、Vue、Python 等

**适用场景**:
- 遗留系统文档化（无文档或文档过时）
- 新项目知识沉淀（快速建立知识体系）
- 团队协作知识管理（新人快速上手）
- 代码审查和重构（理解现有架构）

---

## 📋 前置条件

在执行此Command前，请确保：

- [ ] 项目代码库可访问
- [ ] 确定了项目的主要技术栈（Spring Boot / Vue / Python / 其他）
- [ ] 有读写权限可在项目根目录创建输出目录
- [ ] doc-knowledge-extractor agent 已配置（`.codebuddy/agents/doc-knowledge-extractor.md`）

---

## 💡 参数传递

本Command支持以下参数:

### 全部参数捕获
```bash
/build-knowledge ./src spring-boot "优先生成核心文档"
# 参数1: 项目路径（默认当前目录）
# 参数2: 技术栈类型
# 参数3: 特殊需求
```

### 位置参数
- `$1` - 项目路径（可选，默认当前工作目录）
- `$2` - 技术栈类型（可选，如: spring-boot, vue, python, microservice）
- `$3` - 特殊需求（可选，如: "只生成P0文档", "分阶段生成"）

**如果参数不完整，交互式询问**：

```markdown
请提供以下信息：

1. **项目路径**: [默认为当前目录]
   
2. **技术栈类型**: [选择一项]
   - spring-boot - Spring Boot 项目（生成14个分类）
   - vue - Vue 3 项目（生成10个分类）
   - microservice - 微服务架构（多模块处理）
   - python - Python 项目
   - generic - 通用代码库（自适应）

3. **生成策略**: [选择一项]
   - full - 完整生成所有文档（默认）
   - p0-only - 只生成P0核心文档（API、Service、Mapper）
   - staged - 分阶段生成（P0 → P1 → P2）
```

---

## 🔄 执行流程

### Phase 1: 激活 doc-knowledge-extractor Agent

**Objective**: 加载专业的知识提取 agent 并传递上下文

**MANDATORY STEPS**:

1. **MUST** 激活 doc-knowledge-extractor agent
   - Agent 路径: `.codebuddy/agents/doc-knowledge-extractor.md`
   - **Verification**: 
     - [ ] Agent 文件存在且格式正确
     - [ ] Agent 包含对 doc-extract-proj-top-down skill 的引用

2. **MUST** 传递项目上下文给 agent
   - **输入信息**:
     - 项目路径
     - 技术栈类型
     - 生成策略（full/p0-only/staged）
     - 特殊需求（如有）
   - **Verification**:
     - [ ] 所有必要信息已传递
     - [ ] Agent 正确识别了技术栈

**让我们一步步思考** agent 需要哪些信息来完成知识提取...

**🚪 Phase Gate 1**:
- [ ] doc-knowledge-extractor agent 已激活
- [ ] 项目上下文已完整传递
- [ ] Agent 确认可以开始执行

**Cannot proceed to Phase 2 without all checks passing.**

---

### Phase 2: Agent 执行知识提取流程

**Objective**: Agent 调用 doc-extract-proj-top-down skill 完成知识提取

**MANDATORY STEPS**:

1. **MUST** Agent 调用 doc-extract-proj-top-down skill
   - Skill 会自动执行以下步骤：
     - 步骤1: 生成项目大纲（总索引）
     - 步骤2: 逐章节生成（17-18个模块化文档）
     - 步骤3: 每章生成后询问用户是否继续或优化
     - 步骤4: 数据库扫描（可选）
     - 步骤5: 最终检查
   
2. **MUST** 监控 skill 执行进度
   - **验证每个步骤的输出**:
     - [ ] 项目大纲（总索引）已生成
     - [ ] 逐章节生成中，每章完成后询问用户
     - [ ] 所有章节文档已生成
     - [ ] 数据库扫描完成（如适用）
     - [ ] 最终检查通过

3. **MUST** 处理异常情况
   - 如遇到以下情况，暂停并询问用户：
     - 代码结构复杂，无法自动分析
     - 文档数量超出预期（>20个文档）
     - Skill 执行失败

**🚪 Phase Gate 2**:
- [ ] doc-extract-proj-top-down skill 执行成功
- [ ] 项目大纲已生成
- [ ] 所有章节文档已生成
- [ ] 无执行错误

**Cannot proceed to Phase 3 without all checks passing.**

---

### Phase 3: 验证知识库质量

**Objective**: 多层次质量验证，确保知识库可用性

**Quality Gates - MUST PASS ALL**:

#### Gate 1: 结构完整性
- [ ] 输出目录已创建（根据技能配置）
- [ ] 项目总索引文档存在（如 `{project_name}-knowledge.md`）
- [ ] 所有章节文档已生成（根据技术栈）：
  - Spring Boot: 17-18个模块化文档
  - Vue: 对应前端架构文档
  - 其他: 自适应数量
- [ ] 每个文档都包含必需的节（基本信息、目录、清单、统计）

#### Gate 2: 文档关联性
- [ ] 文档间引用准确有效
- [ ] 所有文档链接有效（无死链）
- [ ] 总索引包含所有章节文档的导航链接
- [ ] 文档间引用格式统一

#### Gate 3: 内容质量
- [ ] 统计数据准确（类数量、方法数量等）
- [ ] 包路径正确
- [ ] 代码示例格式正确
- [ ] 没有明显的提取错误

#### Gate 4: 维护机制
- [ ] 所有文档都包含维护记录节
- [ ] 维护记录位置正确（文档末尾）
- [ ] 维护记录格式统一
- [ ] 版本号正确（v1.0）

**自动化验证**（如有）:

```bash
# 验证知识库结构
!`find kb/ -name "*.md" | wc -l`

# 验证 README 存在
!`test -f kb/README.md && echo "✅ README exists" || echo "❌ README missing"`

# 检查死链
!`./scripts/check-md-links.sh kb/`
```

**🚪 Phase Gate 3**:
- [ ] 所有 Quality Gates 通过
- [ ] 自动化验证通过（如有）
- [ ] 无质量问题
- [ ] 知识库可以正常使用

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: 生成知识库使用指南

**Objective**: 为用户生成知识库的使用说明

**MANDATORY STEPS**:

1. **MUST** 在控制台输出知识库摘要
   - **输出内容**:
     ```markdown
     ✅ 知识库构建完成！
     
     📊 统计信息:
     - 文档总数: {数量}
     - API 数量: {数量}
     - 业务逻辑类数量: {数量}
     - 数据模型数量: {数量}
     
     📁 知识库位置:
     - 总索引: kb/README.md
     - 分类文档: kb/*.md
     
     🚀 快速开始:
     1. 打开 kb/README.md 查看总览
     2. 通过快速导航跳转到具体分类
     3. 参考相关文档节查找关联信息
     
     📝 维护建议:
     - 代码变更后及时更新对应文档
     - 使用维护记录跟踪变更历史
     - 定期运行此 Command 重新生成知识库
     ```

2. **MUST** 提示用户如何维护知识库
   - 增量更新策略
   - 版本管理建议
   - 团队协作方式

**🚪 Final Gate**:
- [ ] 知识库摘要已输出
- [ ] 使用指南已提供
- [ ] 维护建议已说明
- [ ] 用户可以开始使用知识库

### Phase 5: 初始化项目记忆，完善知识库的引用
调用技能 `init-project-memory` 初始化项目记忆，将知识库索引放到项目记忆中合适的位置

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ **doc-knowledge-extractor agent 不存在或配置错误**
  - Action: 引导用户先配置 agent
  
- ❌ **项目路径不可访问或为空目录**
  - Action: 请求用户提供正确的项目路径
  
- ❌ **无法识别技术栈（无明显的框架标识）**
  - Action: 询问用户明确指定技术栈
  
- ❌ **项目规模过大（>10,000个文件）**
  - Action: 建议用户指定子目录或模块
  
- ❌ **doc-extract-proj-top-down skill 执行失败**
  - Action: 检查错误日志，修复后重试
  
- ❌ **生成的文档数量为0或异常少（<3个）**
  - Action: 检查代码结构，可能需要手动指定包路径

---

## 📝 输出格式

### 文件位置
```
spec-docs/                        # 知识库根目录（或其他配置目录）
├── {project_name}-knowledge.md   # 总索引
├── architecture/                 # 架构章节（10-11个文档）
├── data/                         # 数据章节（3个文档）
├── integration/                  # 集成章节（2个文档）
├── deployment/                   # 部署章节（1个文档）
└── history/                      # 历史章节（1个文档）
```

### 文件头部 (YAML Frontmatter)

每个分类文档包含:

```yaml
---
title: HTTP API 索引
category: service-api-http
description: 项目中所有 HTTP API 接口的索引文档
package_path: com.example.controller
file_count: 45
generated_at: 2025-11-18
---
```

### 文件内容结构

```markdown
# {分类名称}索引

## 📋 基本信息

- **包路径**: com.example.controller
- **文件总数**: 45
- **生成时间**: 2025-11-18
- **版本**: v1.0

## 📂 目录结构

```
controller/
├── user/
│   ├── UserController.java
│   └── UserAuthController.java
├── order/
│   └── OrderController.java
...
```

## 📝 详细清单

### UserController
- **路径**: `com.example.controller.user.UserController`
- **描述**: 用户管理相关接口
- **接口列表**:
  - `GET /api/users` - 获取用户列表
  - `POST /api/users` - 创建用户
  - `GET /api/users/{id}` - 获取用户详情
  ...

## 📊 统计概览

- **Controller 类**: 45 个
- **API 端点**: 123 个
- **请求方法分布**:
  - GET: 56
  - POST: 34
  - PUT: 21
  - DELETE: 12

## 🏗️ 技术架构

- **框架**: Spring Boot 3.2
- **注解**: @RestController, @RequestMapping
- **参数验证**: @Validated
- **统一响应**: Result<T>

## 📚 相关文档

- [业务逻辑层索引](./business-logic.md)
- [DTO对象索引](./dto.md)
- [Response对象索引](./service-response-object.md)
...

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-18 | Spec-Code Team | 初始创建文档 | v1.0 |
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 前置条件已满足
- [ ] doc-knowledge-extractor agent 已配置
- [ ] 项目路径可访问
- [ ] 技术栈已确定

### 执行中验证（Phase Gates）
- [ ] Phase 1 Gate通过（Agent 已激活）
- [ ] Phase 2 Gate通过（Skill 执行成功）
- [ ] Phase 3 Gate通过（质量验证通过）
- [ ] Phase 4 Gate通过（使用指南已提供）

### 最终验证
- [ ] 知识库目录已创建（`kb/`）
- [ ] README.md 总索引已生成
- [ ] 所有分类文档已生成
- [ ] 文档结构完整
- [ ] 文档关联正确
- [ ] 统计数据准确
- [ ] 维护记录完整
- [ ] 无质量问题
- [ ] 用户可以正常使用

---

## 🎓 最佳实践

### 1. 选择合适的生成策略

✅ **好的选择**:
```
小型项目（<100个类）: full - 完整生成
大型项目（>1000个类）: staged - 分阶段生成
快速验证: p0-only - 只生成核心文档
```

❌ **不好的选择**:
```
大型项目直接 full 生成（可能超时或内容过多）
小型项目使用 staged（过度复杂）
```

### 2. Agent 和 Skill 的职责分离

✅ **好的调用方式**:
```markdown
Command → Agent (识别需求、传递上下文)
Agent → Skill (执行知识提取的6个步骤)
Skill → 输出（生成结构化文档）
```

❌ **不好的调用方式**:
```markdown
Command 直接包含知识提取逻辑（违反薄包装原则）
Agent 包含具体实现细节（应委托给 Skill）
```

### 3. 增量更新而非完全重建

✅ **好的维护**:
```
代码变更后，只更新相关的分类文档
使用维护记录跟踪变更历史
定期（如每月）重新生成一次完整知识库
```

❌ **不好的维护**:
```
每次代码变更都重新生成所有文档
没有维护记录，无法追溯变更
长期不更新，知识库过时
```

### 4. 知识库的团队使用

✅ **好的实践**:
```
- 在 README 中说明知识库的用途和使用方法
- 建立知识库更新规范（谁负责、何时更新）
- 在 PR Review 时参考知识库
- 新人 Onboarding 时优先阅读知识库
```

❌ **不好的实践**:
```
- 生成后从不使用
- 没有更新机制
- 团队成员不知道知识库的存在
```

---

## 📚 相关资源

### 核心依赖
- [doc-knowledge-extractor Agent](mdc:.codebuddy/agents/doc-knowledge-extractor.md) - 知识提取专业 agent
- [doc-extract-proj-top-down Skill](mdc:.codebuddy/skills/doc-extract-proj-top-down/SKILL.md) - 知识提取核心 skill（自顶向下方法论）

### 相关 Commands
- [初始化项目记忆](mdc:commands/tools/init-memory.md) - 建立项目记忆系统
- [生成文档索引](mdc:commands/documentation/gen-doc-index.md) - 为文档生成索引（如有）

### 参考文档
- [项目知识提取最佳实践](mdc:.codebuddy/spec/global/knowledge/best-practices/extract-knowledge-from-code-best-practice.md) - 详细方法论
- [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md) - 输出规范

### 验证脚本
- `scripts/check-md-links.sh` - Markdown 链接检查
- `scripts/validate-kb-structure.sh` - 知识库结构验证（如有）

---

## ❓ 常见问题

### Q: 如何为微服务架构项目建立知识库？

**A**: 微服务项目建议按服务分别建立知识库：
```bash
# 为每个服务单独执行
/build-knowledge ./service-user spring-boot
/build-knowledge ./service-order spring-boot
/build-knowledge ./service-payment spring-boot

# 然后手动创建一个总索引链接所有服务的知识库
```

### Q: 知识库生成后如何维护？

**A**: 三种维护策略：
1. **实时更新**: 代码变更后立即更新相关文档
2. **批量更新**: 每周或每次迭代结束后批量更新
3. **定期重建**: 每月完全重新生成一次知识库

推荐使用**批量更新 + 定期重建**的组合。

### Q: 项目很大，生成时间很长怎么办？

**A**: 使用分阶段生成策略：
```bash
# 第1天: 生成 P0 核心文档
/build-knowledge . spring-boot "p0-only"

# 第2天: 生成 P1 数据对象文档
# （手动或通过 agent 继续）

# 第3天: 生成 P2 技术组件文档
```

### Q: 如何为 Python 或 Go 项目建立知识库？

**A**: 指定正确的技术栈类型：
```bash
# Python 项目
/build-knowledge . python

# Go 项目  
/build-knowledge . generic

# Agent 会自适应不同语言的代码结构
```

### Q: 知识库文档与代码注释有什么区别？

**A**: 
- **代码注释**: 面向开发者，解释"为什么"和"怎么做"
- **知识库文档**: 面向团队，提供"是什么"和"在哪里"

知识库是高层次的索引和导航，代码注释是细节层的解释。两者互补。

---

## 📖 完整示例

### 示例 1: Spring Boot 项目完整生成

```bash
# 用户执行
/build-knowledge

# Agent 自动识别为 Spring Boot 项目
# Agent 调用 doc-extract-proj-knowledge skill
# Skill 执行 6 个步骤:
# 1. 扫描 src/ 目录，识别 14 个分类
# 2. 分批生成 14 个分类文档
# 3. 批量添加相关文档节
# 4. 自动生成 README.md
# 5. 批量添加维护记录
# 6. 质量验证

✅ 知识库构建完成！

📊 统计信息:
- 文档总数: 14
- API 数量: 123
- 业务逻辑类数量: 89
- 数据模型数量: 56

📁 知识库位置: kb/README.md
```

### 示例 2: Vue 项目分阶段生成

```bash
# 用户执行（大型 Vue 项目）
/build-knowledge ./frontend vue "staged"

# Agent 询问
"项目较大，建议分阶段生成。是否开始生成 P0 核心文档（组件、路由、Store）？"

# 用户确认后
# 第1批: 生成 components.md, router.md, store.md
# 询问: "P0 文档已生成，是否继续生成 P1 文档（API、工具）？"

# 用户确认后
# 第2批: 生成 api.md, utils.md, hooks.md
# ...依此类推

✅ 知识库构建完成！
```