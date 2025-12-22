---
command_id: spec-dev.gen-skill-general
command_name: 生成 Skill (通用版)
category: spec-dev
description: 生成高质量的 Claude Code Skill - 遵循 Claude Code Skills 最佳实践；编写skill、生成skill；
---

# Command: 生成 Skill

> ⚠️ **必须遵守的规范内容**: [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `skills/{skill-name}/`
> - 核心文件: `SKILL.md`
> - 支持资源: `scripts/`、`reference.md`、`templates/`、`examples.md`

> **最佳实践**: 遵循 [Claude Code Skills 最佳实践](mdc:.codebuddy/spec/global/knowledge/best-practices/ClaudeSkillBestPractices.md)
> - **简洁为王**: Claude 已很聪明，只添加 Claude 不知道的内容
> - **适当自由度**: 根据任务脆弱性和可变性设置指导详细程度
> - **跨模型测试**: 根据目标模型（Haiku/Sonnet/Opus）调整详细程度
> - **原子性**: 每个 skill 只解决一个特定问题

## 🎯 用途

为项目创建高质量的 Claude Code Skill：

**核心文件**: `SKILL.md` - 核心技能定义（元数据 + 指令）

**支持资源**（可选）:
- `scripts/` - 可执行代码（Python/Bash 等）
- `reference.md` - 参考文档（按需加载）
- `templates/` - 输出资源（模板、配置等）
- `examples.md` - 实际使用示例

## 💡 核心理念

### 渐进式披露设计

技能使用三级加载系统高效管理上下文：

1. **元数据（name + description）** - 始终在上下文中（约 100 字）
2. **SKILL.md 主体** - 技能触发时（<5k 字）
3. **捆绑资源** - 根据 Claude 需要（无限制*）

*脚本可在不读入上下文窗口的情况下执行。

### 写作风格规范

使用**命令式/不定式形式**编写整个技能：

- ✅ **正确**: "要完成 X，执行 Y"
- ✅ **正确**: "执行以下步骤"
- ❌ **错误**: "你应该执行 X"

## 📋 前置条件

- [ ] 已明确 Skill 要解决的问题
- [ ] 已准备 2-3 个具体使用示例
- [ ] 已确定触发词和适用场景

## 🔄 执行流程

### 步骤 1: 通过具体示例理解技能需求

询问用户以下问题（**分批提问，避免一次性过多**）：

1. **核心功能**:
   - "这个技能主要解决什么问题？"
   - "能否提供 2-3 个具体的使用示例？"
   - "用户通常会如何表达对这个功能的需求？"（触发词）

2. **功能边界**:
   - "这个技能应该包含哪些功能？"
   - "有哪些功能明确不在这个技能的范围内？"

3. **技术细节**:
   - "涉及哪些技术栈或工具？"
   - "需要哪些权限（read/write/execute）？"

**示例对话**:
```
AI: "这个图像编辑技能应该支持什么功能？"
用户: "主要是旋转、裁剪和调整大小。"
AI: "能否提供一些具体的使用示例？"
用户: "比如'旋转这张图片 90 度'、'裁剪图片中心 500x500 区域'。"
```

### 步骤 2: 分析聚焦度和规划可重用资源

#### 2.1 聚焦度检查

- ✅ 技能是否只解决一个特定问题？
- ✅ 技能的范围是否清晰？
- ❌ 是否过于宽泛（需要拆分）？

**示例**:
```
❌ 不好: "代码质量检查"（过于宽泛）
✅ 好: "ESLint 配置生成"（聚焦明确）
```

**如果聚焦度不足**: 建议拆分为多个 Skill，提供拆分方案，等待用户确认。

#### 2.2 规划可重用资源

根据使用示例，确定需要哪些可重用资源：

**scripts/** - 可执行脚本（代码被反复重写或需要确定性时）
**references/** - 参考文档（详细文档，仅在需要时加载）
**assets/** - 输出资源（模板、图标等，无需加载到上下文）

### 步骤 3: 设计技能结构

#### 3.1 确定技能名称

遵循最佳实践的命名规范：

✅ **推荐**: 动名词形式 (gerund form)
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`

✅ **可接受**: 名词短语
- `pdf-processing`
- `spreadsheet-analysis`

❌ **避免**: `helper`, `utils`, `tools`（过于宽泛）

#### 3.2 选择适当的指导详细程度

根据任务特性设置自由度：

**高自由度** - 需求分析、代码审查（多种方法都有效）
**中等自由度** - 报告生成、配置创建（有推荐模式但可变化）
**低自由度** - 数据库迁移、部署脚本（必须精确执行）

#### 3.3 创建目录和核心文件

```bash
mkdir -p global/skills/{category}/{skill-name}
cd global/skills/{category}/{skill-name}
touch SKILL.md

# 根据需要创建资源
mkdir -p scripts references assets
touch examples.md checklist.md
```

### 步骤 4: 编写技能内容

#### 4.1 SKILL.md 必需结构

**YAML 元数据**:
```yaml
---
name: skill-name  # 推荐使用 gerund form，小写、数字、连字符，最长 64 字符
description: 简要描述（最长1024字符）  # 包含功能、触发词、适用场景
category: implementation  # design/implementation/quality/requirements/documentation/deployment/other
---
```

**内容结构**:
```markdown
# Skill: {skill_name}

简要说明技能的目的（1-2 句话）。

## 🎯 目标

详细说明技能要解决的问题和达成的目标。

## 📋 前置条件

- [ ] 条件 1
- [ ] 条件 2

## 🔄 执行步骤

### 步骤 1: 步骤名称

详细说明和操作指南。

```bash
# 代码示例（如适用）
```

### 步骤 2: 步骤名称

...

## 💡 最佳实践

- ✅ 推荐的做法
- ❌ 不推荐的做法

## ⚠️ 常见错误

### 错误 1: 错误名称

- **症状**: 描述错误现象
- **原因**: 分析错误原因
- **解决**: 提供解决方案

## ✅ 验证清单

- [ ] 验证项 1
- [ ] 验证项 2

## 📚 可重用资源

- `scripts/script_name.py` - 脚本说明
- `references/doc_name.md` - 文档说明
```

#### 4.2 内容要求

**简洁性**: 
- Claude 已了解基础概念，只添加项目特定内容
- 保持 SKILL.md 精简（<5k 字），详细内容放入 references/

**完整性**:
- 清晰的目标说明
- 详细的执行步骤（可操作）
- 代码示例完整（如适用）
- 明确的验证清单

**写作技巧**:
- 使用命令式语言
- 提供具体示例
- 引用可重用资源时说明如何使用

### 步骤 5: 质量验证

#### 5.1 核心验证项

**元数据**:
- [ ] YAML 格式正确
- [ ] name 符合命名规范（推荐 gerund form）
- [ ] description 包含触发词

**结构**:
- [ ] 目录结构符合规范
- [ ] 包含所有必要章节

**内容**:
- [ ] 聚焦度良好（单一问题）
- [ ] 执行步骤可操作
- [ ] 代码示例完整
- [ ] 使用命令式语言

**格式**:
- [ ] Markdown 格式正确
- [ ] 无拼写和格式错误

#### 5.2 跨模型测试

根据目标模型调整详细程度:

- **Haiku**: 提供详细步骤和完整示例
- **Sonnet**: 平衡简洁性和清晰度（推荐）
- **Opus**: 高层指导，避免过度解释

**测试方法**: 用不同模型测试同一场景，确保都能正确执行。

## 💡 核心原则总结

### 1. 简洁为王

遵循最佳实践：**Claude 已很聪明，只添加 Claude 不知道的内容**

❌ 删除: 基础概念解释、过多示例
✅ 保留: 项目特定配置、关键步骤、独特模式

### 2. 渐进式披露

✅ 好: SKILL.md 精简（<5k 字）+ references/ 详细文档
❌ 差: 所有内容堆在 SKILL.md（15k 字）

### 3. 适当自由度

根据任务脆弱性选择:
- **高自由度**: 多种方法有效（代码审查）
- **中等自由度**: 有推荐模式（报告生成）
- **低自由度**: 必须精确（数据库迁移）

## 🔗 相关资源

- [Claude Code Skills 最佳实践](mdc:.codebuddy/spec/global/knowledge/best-practices/ClaudeSkillBestPractices.md)
- [Skill 模板](mdc:global/templates/spec-dev/skill-template.md)
- [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md)
- [现有 Skills](mdc:global/skills/README.md)
- [Command 生成](mdc:commands/spec-dev/gen-command.md)

## ❓ 常见问题

### Q: Skill 和 Command 有什么区别？

- **Skill**: 原子性的可复用知识单元（如何做某件事）
- **Command**: 工作流程（按顺序做多件事，组合多个 Skill）

### Q: 如何确保 Skill 的聚焦度？

问自己：是否只解决一个特定问题？能否用一句话描述？

### Q: 何时使用 scripts/ 目录？

当代码被反复重写、需要确定性结果、或超过 50 行时。

### Q: 何时使用 references/ 目录？

当文档超过 10k 字、只在特定情况需要、或包含大量技术细节时。

## 🔄 版本历史

- **v2.1** (2025-11-11): 精简优化版本
  - 遵循 Claude Code Skills 最佳实践（简洁为王）
  - 大幅精简文档（从 6000+ tokens → ~4000 tokens）
  - 新增命名规范（gerund form）
  - 新增跨模型测试指导
  - 新增自由度设置指导
  - 精简 FAQ（9→4）、验证清单（40→15）、最佳实践（5→3）

- **v2.0**: 优化版，结合最佳实践
- **v1.0**: 初始版本
