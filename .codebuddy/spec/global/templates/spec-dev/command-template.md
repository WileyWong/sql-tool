---
command_id: category.command-name               # [REQUIRED] 分类.命令名
command_name: 命令显示名称                       # [REQUIRED] 中文名称
category: category                              # [REQUIRED] 命令分类
description: 简要描述（最长1024字符）            # [REQUIRED] 包含功能和触发词
allowed-tools: read_file, write_to_file         # [OPTIONAL] 允许的工具列表
argument-hint: <param1> [param2]                # [OPTIONAL] 参数提示，如: <file-path> [options]
model: claude-3-5-sonnet-20241022               # [OPTIONAL] 指定模型
disable-model-invocation: false                 # [OPTIONAL] 是否禁止自动调用模型
estimated_time: 15-20 minutes                   # [OPTIONAL] 预估执行时间
workflow_type: sequential                       # [OPTIONAL] sequential|parallel|conditional
dependencies: []                                # [OPTIONAL] 依赖的Skills列表
---

# Command: {command_name}

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

简要说明 Command 的用途和主要输出物。

**适用场景**:
- 场景1
- 场景2
- 场景3

---

## 📋 前置条件

在执行此Command前，请确保：

- [ ] 前置条件 1
- [ ] 前置条件 2
- [ ] 前置条件 3

---

## 💡 参数传递（如适用）

本Command支持以下参数:

### 全部参数捕获
```bash
/command-name param1 param2 param3
# 实际提示: {参数说明}
```

### 位置参数
- `$1` - 参数1说明
- `$2` - 参数2说明  
- `$3` - 参数3说明

**如果参数不完整，交互式询问**：
[提供参数收集的具体问题列表]

---

## 🔄 执行流程

### Phase 1: {阶段名称}

**Objective**: {阶段目标}

**MANDATORY STEPS**:

1. **MUST** {步骤1} - Use `{skill-name}` skill
   - {具体说明}
   - **Input**: {输入说明}
   - **Output**: {输出说明}
   - **Verification**: 
     - [ ] {验证项1}
     - [ ] {验证项2}

2. **MUST** {步骤2} - Use `{skill-name}` skill
   - {具体说明}

**让我们一步步思考** 如何完成这个阶段...

**🚪 Phase Gate 1**:
- [ ] {必须通过的检查项1}
- [ ] {必须通过的检查项2}
- [ ] {必须通过的检查项3}

**Cannot proceed to Phase 2 without all checks passing.**

---

### Phase 2: {阶段名称}

**Objective**: {阶段目标}

**MANDATORY STEPS**:

1. **MUST** {步骤1}
   - {具体说明}

**🚪 Phase Gate 2**:
- [ ] {必须通过的检查项1}
- [ ] {必须通过的检查项2}

**Cannot proceed to Phase 3 without all checks passing.**

---

### Phase 3: {阶段名称}

**Objective**: {阶段目标}

**MUST USE TEMPLATE**: `{模板路径}`

**MANDATORY STEPS**:

1. **MUST** 读取并使用指定模板
   - Template path: `{模板路径}`
   - **Required sections**:
     - [ ] 必需部分1
     - [ ] 必需部分2
     - [ ] 必需部分3

2. **MUST** 填充所有必填字段
   - {字段说明}

**🚪 Phase Gate 3**:
- [ ] 使用了指定模板
- [ ] 所有必填字段已填写
- [ ] 无遗漏部分

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: {质量验证阶段}

**Objective**: 多层次质量验证

**Quality Gates - MUST PASS ALL**:

#### Gate 1: 结构完整性
- [ ] {结构检查项1}
- [ ] {结构检查项2}
- [ ] {结构检查项3}

#### Gate 2: 规范符合性
- [ ] {规范检查项1}
- [ ] {规范检查项2}
- [ ] {规范检查项3}

#### Gate 3: 内容质量
- [ ] {质量检查项1}
- [ ] {质量检查项2}
- [ ] {质量检查项3}

#### Gate 4: 最佳实践
- [ ] {最佳实践检查项1}
- [ ] {最佳实践检查项2}
- [ ] {最佳实践检查项3}

**自动化验证**（如有）:

```bash
# 运行验证脚本
!`./scripts/validate-{type}.sh {输出路径}`
```

**🚪 Final Gate**:
- [ ] 所有Quality Gates通过
- [ ] 自动化验证通过（如有）
- [ ] 无拼写错误
- [ ] 格式规范

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ {停止条件1}
- ❌ {停止条件2}
- ❌ {停止条件3}
- ❌ {停止条件4}

**Action**: {遇到Red Flags时的处理方式}

---

## 📝 输出格式

### 文件位置
```
{输出路径规范}
```

### 文件头部 (YAML Frontmatter)

```yaml
---
{字段名}: {字段值说明}
{字段名}: {字段值说明}
---
```

### 文件内容示例

```markdown
# 输出文件标题

**变更 ID**: ...  
**关联需求**: ...  
**关联项目记忆**: ...  

## 合规性检查

- [x] 符合项目规范
- [x] 遵循最佳实践

## 主要内容

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
- [ ] 输出文件已生成
- [ ] 文件位置正确
- [ ] YAML Frontmatter完整
- [ ] 项目记忆引用完整
- [ ] 执行流程使用强制性语言
- [ ] 包含Phase Gates
- [ ] 包含Red Flags
- [ ] 薄包装原则遵守（只包含编排指令）
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
{具体的、可衡量的目标示例}
```

❌ **不好的目标**:
```
{模糊的、不可衡量的目标示例}
```

### 2. 强制性语言使用

✅ **好的流程**:
```markdown
**MUST** {具体动作} before {下一步动作}
**MUST** use {具体模板/工具}
**Cannot proceed without** {具体条件}
```

❌ **不好的流程**:
```markdown
You should {动作}
Consider {建议}
Try to {动作}
```

### 3. Template-Driven强制

✅ **好的做法**:
```markdown
**MUST USE TEMPLATE**: `{具体模板路径}`

**Required sections**:
- [ ] {必需部分1}
- [ ] {必需部分2}
- [ ] {必需部分3}
```

❌ **不好的做法**:
```markdown
Generate a document with {内容描述}
```

### 4. 完整的验证机制

✅ **好的验证**:
```markdown
**🚪 Phase Gate 1**:
- [ ] {具体验证项1}
- [ ] {具体验证项2}
- [ ] {具体验证项3}

**Cannot proceed to Phase 2 without all checks passing.**
```

❌ **不好的验证**:
```markdown
Check if everything looks good
```

### 5. 薄包装原则（Thin Wrapper）

✅ **好的编排**:
```markdown
**MUST** analyze requirements - Use `requirements-analysis` skill
**MUST** generate design - Use `api-design` skill
**MUST** validate output - Use `validation` skill
```

❌ **不好的编排**:
```markdown
Analyze the requirements by reading the document and extracting:
1. Business entities
2. Relationships
3. Constraints
4. Validation rules
...（包含过多实现细节）
```

---

## 📚 相关资源

### 核心模板
- [Command Template](mdc:.codebuddy/spec/global/templates/spec-dev/command-template.md) - Command标准模板
- [Skill Template](mdc:.codebuddy/spec/global/templates/spec-dev/skill-template.md) - Skill标准模板

### 相关 Commands
- [生成 Command](mdc:commands/spec-dev/gen-command.md) - 生成Command文档
- [生成 Skill](mdc:commands/spec-dev/gen-skill.md) - 生成Skill文档
- [生成 Template](mdc:commands/spec-dev/gen-template.md) - 生成Template文件

### 参考文档
- [Command 设计指南](mdc:.codebuddy/spec/docs/best-practices/09-command-design-guide.md) - 详细设计指南
- [Claude Command 规范](https://code.claude.com/docs/zh-CN/slash-commands) - 官方规范
- [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 项目规范索引

### 验证脚本
- `scripts/validate-command.sh` - Command验证脚本
- `scripts/validate-compliance.sh` - 规范合规验证

---

## ❓ 常见问题

### Q: {常见问题1}?

**A**: {详细解答}

### Q: {常见问题2}?

**A**: {详细解答}

### Q: {常见问题3}?

**A**: {详细解答}

### Q: {常见问题4}?

**A**: {详细解答}

---

## 📖 完整示例

参考 `{示例文件路径}` 查看完整的实际使用示例。

---

**版本**: {version}  
**最后更新**: {updated_at}  
**维护者**: {author}  
**反馈**: 请通过Issue或PR提供反馈

