---
command_id: spec-dev.gen-command
command_name: 生成 Command
category: spec-dev
description: 生成高质量的 Spec-Code Command - 从需求分析到完整的 Command 定义，遵循项目规范和最佳实践
allowed-tools: read_file, write_to_file, replace_in_file
argument-hint: <command-name> [category] [description]
model: claude-3-5-sonnet-20241022
disable-model-invocation: false
estimated_time: 15-20 minutes
workflow_type: sequential
---

# Command: 生成 Command

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
> - 输出路径: `commands/{category}/{command-name}.md`
> - 文件格式: Markdown + YAML Frontmatter
> - 命名规范: 小写字母 + 连字符 + `.md`

---

## 🎯 用途

快速生成符合Claude Command规范和项目标准的Command文档，包括：

- **Command 定义** - 标准化的元数据和结构
- **参数传递** - 支持`$ARGUMENTS`和位置参数
- **强制流程** - Phase Gates和验证机制
- **Template-Driven** - 强制使用模板输出
- **思考引导** - 触发AI扩展思考模式

**适用场景**:
- 创建新的Command工作流
- 标准化现有Command
- 快速原型验证

---

## 📋 前置条件

在执行此Command前，请确保：

- [ ] 明确Command的核心目标（解决什么问题）
- [ ] 确定Command的分类（design/implementation/requirements/documentation/deployment/spec-dev/other）
- [ ] 准备好相关参考资料（如有）
- [ ] 了解Command将调用的Skills（如有）

---

## 🔄 执行流程

### 步骤 1: 收集核心信息

**AI 需要获取以下信息**（如果用户未提供）:

使用参数传递机制:
- `$1` - Command 名称（小写字母+连字符，如`gen-api-spec`）
- `$2` - Command 分类（design/implementation/requirements等）
- `$3` - Command 简介（1句话描述功能）

**如果参数不完整，交互式询问**:

```markdown
请提供以下信息：

1. **Command 名称**: [英文，小写字母+连字符，最长64字符]
   示例: gen-api-spec, review-pr, deploy-service

2. **Command 分类**: [选择一项]
   - design - 设计类
   - implementation - 实现类
   - requirements - 需求类
   - documentation - 文档类
   - deployment - 部署类
   - spec-dev - 规范开发类
   - other - 其他

3. **Command 简介**: [1-2句话，说明功能和触发词]
   示例: "生成API规格文档 - 从需求分析到完整的OpenAPI定义"
```

**让我们一步步思考** 如何设计这个Command的核心流程...

**验收标准**:
- [ ] Command名称符合命名规范
- [ ] 分类明确且合理
- [ ] 简介清晰且包含触发词

---

### 步骤 2: 分析Command完整性（强制检查）

**MANDATORY CHECKS**（必须通过，否则停止）:

**完整性检查清单**:
- [ ] Command 的目标是否清晰且单一？
- [ ] 是否可以拆分成更小的Command？（如果 >10个步骤）
- [ ] 是否与现有Command重复？
- [ ] 需要调用的Skills是否明确？
- [ ] 输入输出是否清晰定义？

**🚫 Red Flags - 遇到以下情况必须停止**:

- ❌ Command目标模糊或包含多个不相关的任务
- ❌ 步骤超过10个且无法合理分组
- ❌ 与现有Command功能重复 >80%
- ❌ 缺少必要的Skills支持

**Action**: 如遇Red Flags，建议用户重新设计或拆分Command

**验收标准**:
- [ ] 所有完整性检查通过
- [ ] 无Red Flags
- [ ] 得到用户确认继续

---

### 步骤 3: 生成Command文件（Template-Driven）

**MUST USE TEMPLATE**: `spec/global/templates/spec-dev/command-template.md`

**强制要求**:
1. **MUST** 使用指定模板
2. **MUST** 填写所有`[REQUIRED]`字段
3. **MUST** 标记无法填写的字段为`[NEEDS CLARIFICATION]`
4. **MUST** 包含项目记忆引用块

**执行**:

读取模板:
```bash
!`cat spec/global/templates/spec-dev/command-template.md`
```

填充以下关键部分:

#### 3.1 YAML Frontmatter（完整版）

```yaml
---
command_id: {category}.{command-name}           # 必填
command_name: {中文名称}                         # 必填
category: {category}                            # 必填
description: {简要描述,最长1024字符}            # 必填
allowed-tools: {允许的工具列表}                 # 可选，如: read_file, execute_command
argument-hint: {参数提示}                       # 可选，如: <file-path> [options]
model: claude-3-5-sonnet-20241022               # 可选，指定模型
disable-model-invocation: false                 # 可选，是否禁止自动调用
estimated_time: {预估时间}                      # 可选，如: 15-20 minutes
workflow_type: sequential|parallel|conditional  # 可选
dependencies: [{依赖的Skills}]                  # 可选
---
```

#### 3.2 项目记忆引用块（必须）

```markdown
> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档
```

#### 3.3 执行流程部分（强制性语言）

使用强制性语言 **MUST**, **REQUIRED**, **MANDATORY**:

```markdown
## 🔄 执行流程

### Phase 1: {阶段名称}

**Objective**: {阶段目标}

**MANDATORY STEPS**:

1. **MUST** {步骤1} - Use `{skill-name}` skill
   - {具体说明}
   - **Verification**: 
     - [ ] {验证项}

2. **MUST** {步骤2} - Use `{skill-name}` skill
   - {具体说明}

**Output**: {阶段输出}

**🚪 Phase Gate 1**:
- [ ] {必须通过的检查项1}
- [ ] {必须通过的检查项2}

**Cannot proceed to Phase 2 without all checks passing.**
```

#### 3.4 参数传递示例（如适用）

```markdown
## 💡 参数传递

本Command支持以下参数:

### 全部参数捕获
```bash
/gen-command api-gateway design "生成API网关设计"
# 实际提示: 生成 api-gateway (design类) 的Command: "生成API网关设计"
```

### 位置参数
- `$1` - Command名称
- `$2` - Command分类  
- `$3` - Command简介
```

#### 3.5 Red Flags部分（必须）

```markdown
## 🚫 Red Flags

**STOP if you encounter**:

- {停止条件1}
- {停止条件2}
- {停止条件3}

**Action**: {遇到Red Flags时的处理方式}
```

**验收标准**:
- [ ] 使用了指定模板
- [ ] 所有必填字段已填写
- [ ] 包含项目记忆引用
- [ ] 使用强制性语言
- [ ] 包含Phase Gates
- [ ] 包含Red Flags
- [ ] 文件格式正确

---

### 步骤 4: 验证Command质量（多层次验证）

**Quality Gates - MUST PASS ALL**:

#### Gate 1: 结构完整性
- [ ] YAML Frontmatter包含所有必填字段
- [ ] 项目记忆引用块完整
- [ ] 执行流程分阶段清晰
- [ ] 包含Phase Gates
- [ ] 包含Red Flags

#### Gate 2: 薄包装原则
- [ ] Command只包含编排指令
- [ ] 使用"Use `skill-name` skill"引用Skills
- [ ] 没有包含具体实现细节
- [ ] 所有逻辑都委托给Skills

#### Gate 3: 强制流程机制
- [ ] 使用MUST/REQUIRED/MANDATORY语言
- [ ] 明确禁止的行为（DO NOT/NEVER）
- [ ] 使用Checklist强制验证
- [ ] 明确后果（"Cannot proceed without..."）

#### Gate 4: Template-Driven
- [ ] 明确指定Template路径
- [ ] 列出必需部分
- [ ] 验证Template使用

**自动化验证**（可选）:

```bash
# 运行验证脚本
!`./scripts/validate-command.sh commands/{category}/{command-name}.md`
```

**验收标准**:
- [ ] 所有Quality Gates通过
- [ ] 自动化验证通过（如有）
- [ ] 无拼写错误
- [ ] 格式规范

---

### 步骤 5: 更新相关文档（可选）

**如果是新分类，MUST创建**:

```bash
commands/{category}/README.md
```

**如果需要，更新**:
- [ ] 分类README - 添加新Command到目录
- [ ] 项目README - 更新Command统计
- [ ] CHANGELOG - 记录变更

**验收标准**:
- [ ] 相关文档已更新（如需要）
- [ ] 无遗漏

---

## 📝 输出格式

### 文件位置
```
commands/{category}/{command-name}.md
```

### 文件结构（完整示例）

```yaml
---
command_id: design.gen-api-spec
command_name: 生成 API 规格
category: design
description: 从需求分析到完整的 OpenAPI 3.0 规格定义，包括端点设计、数据模型、认证方案
allowed-tools: read_file, write_to_file
argument-hint: <api-name> [format]
estimated_time: 20-30 minutes
workflow_type: sequential
dependencies: [requirements-analysis, api-design, openapi-generation]
---

# Command: 生成 API 规格

> 📚 **项目记忆引用**
> ...

## 🎯 用途
...

## 📋 前置条件
...

## 🔄 执行流程

### Phase 1: 需求分析

**Objective**: 分析API需求并识别端点

**MANDATORY STEPS**:

1. **MUST** 分析需求文档 - Use `requirements-analysis` skill
   - 识别业务实体
   - 定义资源模型
   
**Output**: 资源清单和业务规则

**🚪 Phase Gate 1**:
- [ ] 所有资源已识别
- [ ] 业务规则已明确

...

## 🚫 Red Flags

**STOP if you encounter**:
- 需求文档缺失或不完整
- 业务规则冲突
- 无法确定API版本策略

**Action**: 请求澄清后再继续

...
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 前置条件已满足
- [ ] 收集了所有必要信息

### 执行中验证（Phase Gates）
- [ ] Phase 1 Gate通过
- [ ] Phase 2 Gate通过  
- [ ] Phase 3 Gate通过
- [ ] Phase 4 Gate通过

### 最终验证
- [ ] Command文件已生成
- [ ] 文件位置正确
- [ ] YAML Frontmatter完整
- [ ] 项目记忆引用完整
- [ ] 执行流程使用强制性语言
- [ ] 包含Phase Gates
- [ ] 包含Red Flags
- [ ] 薄包装原则遵守
- [ ] Template-Driven机制完整
- [ ] 所有Quality Gates通过
- [ ] 相关文档已更新（如需要）
- [ ] 无拼写错误
- [ ] 格式规范

---

## 🎓 最佳实践

### 1. 清晰的目标定义

✅ **好的目标**:
```
生成符合OpenAPI 3.0规范的API设计文档，
包括端点定义、数据模型、认证方案和错误处理
```

❌ **不好的目标**:
```
设计API
```

### 2. 强制性语言使用

✅ **好的流程**:
```markdown
**MUST** analyze requirements before designing endpoints
**MUST** use OpenAPI template
**Cannot proceed without** all validations passing
```

❌ **不好的流程**:
```markdown
You should analyze requirements
Consider using a template
Try to validate the output
```

### 3. Template-Driven强制

✅ **好的做法**:
```markdown
**MUST USE TEMPLATE**: `templates/design/api-spec-template.yaml`

**Required sections**:
- [ ] API Info
- [ ] Endpoints
- [ ] Data Models
- [ ] Security Schemes
```

❌ **不好的做法**:
```markdown
Generate an API spec document with endpoints and models
```

### 4. 完整的验证机制

✅ **好的验证**:
```markdown
**🚪 Phase Gate 1**:
- [ ] All endpoints identified
- [ ] All data models defined
- [ ] All relationships mapped

**Cannot proceed to Phase 2 without all checks passing.**
```

❌ **不好的验证**:
```markdown
Check if everything looks good
```

---

## 📚 相关资源

### 核心模板
- [Command Template](mdc:.codebuddy/spec/global/templates/spec-dev/command-template.md) - Command标准模板

### 相关 Commands
- [生成 Skill](mdc:commands/spec-dev/gen-skill.md) - 生成Skill文档
- [生成 Template](mdc:commands/spec-dev/gen-template.md) - 生成Template文件

### 参考文档
- [Command 设计指南](mdc:.codebuddy/spec/docs/best-practices/09-command-design-guide.md) - 详细设计指南
- [Claude Command 规范](https://code.claude.com/docs/zh-CN/slash-commands) - 官方规范

### 验证脚本
- `scripts/validate-command.sh` - Command验证脚本
- `scripts/validate-compliance.sh` - 规范合规验证

---

## ❓ 常见问题

### Q: Command 应该有多少个步骤？

**A**: 通常5-10个步骤，分为3-5个Phase。如果超过10个步骤，考虑：
- 分组为多个Phase
- 拆分为多个Command
- 将细节移到Skill中

### Q: 如何处理Command之间的依赖？

**A**: 
1. 在`dependencies`字段列出依赖的Skills
2. 在前置条件中说明依赖的Command
3. 在执行流程中使用"Use `skill-name` skill"引用

### Q: 什么时候使用参数传递？

**A**: 
- 简单、固定的输入（如名称、分类）使用位置参数`$1`, `$2`
- 复杂、可变的输入使用`$ARGUMENTS`捕获所有参数
- 需要用户交互的使用询问式收集

### Q: 如何验证Command是否成功？

**A**: 使用多层次验证：
1. **输入验证** - 检查前置条件
2. **Phase Gates** - 每个阶段的验证
3. **最终验证** - 完整的验证清单
4. **自动化验证** - 运行验证脚本（如有）

### Q: Red Flags应该包含什么？

**A**: 包含以下停止条件：
- 缺少必要输入
- 检测到冲突或矛盾
- 复杂度超出Command范围
- 质量门禁未通过

---

## 📖 完整示例

参考 `commands/design/gen-api-spec.md` 查看完整的Command示例。

---

**版本**: 2.0.0  
**最后更新**: 2025-11-06  
**维护者**: Spec-Code Team  
**反馈**: 请通过Issue或PR提供反馈
