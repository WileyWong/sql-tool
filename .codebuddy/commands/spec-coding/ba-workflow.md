---
command_name: BA 业务分析工作流
description: 端到端的业务分析工作流，从原始需求到可交付的用户故事和UI原型。编排 ba-01 到 ba-06 六个技能，支持全流程执行或单独任务执行。触发词：业务分析、需求分析、BA工作流、用户故事、Epic分析、验收标准、UI原型。
---

# Command: BA 业务分析工作流

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
> - BA 文档输出路径: `workspace/{变更ID}/ba/`
> - HTML 原型输出路径: `workspace/{变更ID}/ba/prototypes/`

---

## 🎯 用途

端到端的业务分析工作流，将原始需求材料转化为可交付的用户故事和UI原型，包括：

- **业务需求提取** - 从会议记录、访谈等提取 SMART 业务目标
- **Epic 分析** - 分析大型需求并制定拆解策略
- **用户故事生成** - 生成符合敏捷标准的用户故事
- **INVEST 评估** - 评估故事质量并排序优先级
- **验收标准编写** - 为高优先级故事编写 AC
- **UI 原型设计** - 生成可运行的 HTML 原型

**适用场景**:
- 新项目启动时的需求分析
- 大型功能模块的需求拆解
- 敏捷迭代规划准备
- 产品需求文档（PRD）细化

---

## 📋 前置条件

在执行此 Command 前，请确保：

- [ ] 拥有原始需求材料（会议记录、访谈内容、需求文档等）
- [ ] 明确项目的业务背景和目标
- [ ] 了解主要用户角色和利益相关者
- [ ] 确定本次分析的范围边界

---

## 💡 参数传递

本 Command 支持以下参数：

### 任务选择参数
```bash
/ba-workflow <task>
# task 可选值：
#   full      - 执行完整工作流（ba-01 到 ba-06）
#   extract   - 仅执行 ba-01 业务需求提取
#   epic      - 仅执行 ba-02 Epic 分析
#   story     - 仅执行 ba-03 用户故事生成
#   invest    - 仅执行 ba-04 INVEST 评估
#   ac        - 仅执行 ba-05 验收标准编写
#   prototype - 仅执行 ba-06 UI 原型设计
```

### 位置参数
- `$1` - 任务类型（full/extract/epic/story/invest/ac/prototype）
- `$2` - 输入文件路径（可选，如已有上游输出）

**如果参数不完整，交互式询问**：

```markdown
请选择要执行的任务：

1. **full** - 完整工作流（从原始需求到UI原型）
2. **extract** - 业务需求提取（ba-01）
3. **epic** - Epic 分析（ba-02）
4. **story** - 用户故事生成（ba-03）
5. **invest** - INVEST 评估（ba-04）
6. **ac** - 验收标准编写（ba-05）
7. **prototype** - UI 原型设计（ba-06）

请输入任务编号或名称：
```

---

## 🔄 工作流总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    BA 业务分析工作流                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📥 原始需求材料                                                 │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────┐                                            │
│  │ Phase 1: ba-01  │ 业务需求提取                                │
│  │ 输出: 业务目标、顶层用例、NFR                                  │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Phase 2: ba-02  │ Epic 分析                                  │
│  │ 输出: 拆解策略、用户角色、MVP 定义                             │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Phase 3: ba-03  │ 用户故事生成                                │
│  │ 输出: 用户故事列表（15-25个）                                  │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Phase 4: ba-04  │ INVEST 评估                                │
│  │ 输出: 评估报告、MoSCoW 排序                                   │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Phase 5: ba-05  │ 验收标准编写                                │
│  │ 输出: Must Have 故事的 AC                                    │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Phase 6: ba-06  │ UI 原型设计                                │
│  │ 输出: 可运行的 HTML 原型                                      │
│  └─────────────────┘                                            │
│                                                                 │
│  📤 最终交付物                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 执行流程

### Phase 1: 业务需求提取

**Objective**: 从原始需求材料中提取结构化的业务需求

**MANDATORY STEPS**:

1. **MUST** 收集原始需求材料 - Use `ba-01-extracting-business-requirements` skill
   - 会议记录、访谈内容、需求文档、邮件往来等
   - **Input**: 原始需求材料 + 业务背景（可选）
   - **Output**: 
     - SMART 业务目标
     - 顶层业务用例
     - 非功能需求（NFR）
     - 约束条件与假设依赖
     - 需求遗漏风险清单

2. **MUST** 验证输出质量
   - 每个业务目标符合 SMART 五要素
   - 每条需求标注来源（可追溯性）
   - 顶层用例包含所有必要要素

**让我们一步步思考** 如何从原始材料中提取有价值的业务需求...

**🚪 Phase Gate 1**:
- [ ] 至少提取 1 个 SMART 业务目标
- [ ] 至少识别 3 个顶层业务用例
- [ ] NFR 覆盖性能、可用性、安全性
- [ ] 所有需求都有来源标注
- [ ] 需求冲突已识别并标注

**Cannot proceed to Phase 2 without all checks passing.**

---

### Phase 2: Epic 分析

**Objective**: 分析顶层用例，制定拆解策略

**MANDATORY STEPS**:

1. **MUST** 分析 Epic 背景和目标 - Use `ba-02-analyzing-epics` skill
   - **Input**: Phase 1 输出的顶层业务用例
   - **Output**:
     - Epic 概述分析（类型、业务价值、复杂度）
     - 用户角色分析（核心/重要/次要角色）
     - Feature 定义（SAFe 实践）
     - 拆解策略（维度选择和理由）
     - MVP 定义和验证指标
     - 依赖与风险识别

2. **MUST** 选择合适的拆解维度
   - 按用户角色 / 按功能模块 / 按工作流 / 按业务规则 / 混合拆解
   - 明确选择理由

**让我们一步步思考** 如何科学地拆解这个 Epic...

**🚪 Phase Gate 2**:
- [ ] Epic 业务价值和核心目标表述清晰
- [ ] 识别至少 3 个主要用户角色
- [ ] 拆解策略有明确的维度选择和理由
- [ ] 预估用户故事数量在合理范围内（小型 5-10、中型 10-20、大型 20-40）
- [ ] MVP 范围和验证指标已定义
- [ ] 关键依赖和风险点已识别

**Cannot proceed to Phase 3 without all checks passing.**

---

### Phase 3: 用户故事生成

**Objective**: 生成高质量的用户故事列表

**MANDATORY STEPS**:

1. **MUST** 基于拆解策略生成用户故事 - Use `ba-03-generating-user-stories` skill
   - **Input**: Phase 2 输出的拆解策略和用户角色
   - **Output**:
     - 故事列表总览（ID、标题、Feature、角色、粒度）
     - 详细故事列表（按 Feature 分组）
     - 每个故事包含：用户故事、功能要点、业务规则、粒度评估

2. **MUST** 确保故事格式规范
   - 使用"作为...我希望...以便..."格式
   - 用户角色具体明确
   - 业务价值清晰

**让我们一步步思考** 如何编写高质量的用户故事...

**🚪 Phase Gate 3**:
- [ ] 生成 15-25 个用户故事（视 Epic 规模调整）
- [ ] 每个故事遵循标准格式
- [ ] 每个故事有明确的用户价值
- [ ] 故事粒度适中（S/M/L，无 XL）
- [ ] 覆盖所有核心用户角色和主要功能

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: INVEST 评估

**Objective**: 评估故事质量并进行优先级排序

**MANDATORY STEPS**:

1. **MUST** 对每个故事进行 INVEST 评估 - Use `ba-04-evaluating-invest` skill
   - **Input**: Phase 3 输出的用户故事列表
   - **Output**:
     - INVEST 评估总览（六维度评分）
     - 问题故事详细分析和改进建议
     - MoSCoW 优先级分类
     - DoR 检查与迭代规划建议

2. **MUST** 完成 MoSCoW 优先级排序
   - Must Have（必须有）- 不超过 60%
   - Should Have（应该有）
   - Could Have（可以有）
   - Won't Have（暂不实现）

**让我们一步步思考** 如何客观评估每个故事的质量...

**🚪 Phase Gate 4**:
- [ ] 每个故事都有完整的 INVEST 六维度评估
- [ ] 评估结果客观准确，有评分依据
- [ ] 问题故事有具体可行的改进建议
- [ ] 优先级分类合理，理由充分
- [ ] Must Have 故事占比不超过 60%

**Cannot proceed to Phase 5 without all checks passing.**

---

### Phase 5: 验收标准编写

**Objective**: 为高优先级故事编写详细的验收标准

**MANDATORY STEPS**:

1. **MUST** 为 Must Have 故事编写 AC - Use `ba-05-writing-acceptance-criteria` skill
   - **Input**: Phase 4 输出的 Must Have 用户故事
   - **Output**:
     - Given-When-Then 格式的验收标准
     - 边界条件识别
     - 性能要求（如适用）
     - 界面要求（如适用）
     - 测试建议

2. **MUST** 确保 AC 覆盖完整
   - 正常流程（Happy Path）
   - 异常情况（至少 2 种）
   - 边界条件

**让我们一步步思考** 如何编写可测试的验收标准...

**🚪 Phase Gate 5**:
- [ ] 每个 Must Have 故事有 3-5 条核心验收标准
- [ ] 每条标准使用 Given-When-Then 格式
- [ ] 覆盖正常流程和至少 2 种异常情况
- [ ] 包含必要的性能和界面要求
- [ ] 验收标准可直接转化为测试用例

**Cannot proceed to Phase 6 without all checks passing.**

---

### Phase 6: UI 原型设计

**Objective**: 生成可运行的 HTML 原型

**MANDATORY STEPS**:

1. **MUST** 执行设计元素分析 - Use `ba-06-ui-html-prototype` skill (Task 1)
   - **Input**: 用户旅程 + 用户故事
   - **Output**: 页面结构、组件清单、字段定义、组件匹配、Layout 结构图

2. **MUST** 执行交互设计 - Use `ba-06-ui-html-prototype` skill (Task 2)
   - **Input**: Task 1 输出
   - **Output**: PlantUML 图、交互点、状态流转

3. **MUST** 生成 HTML 原型 - Use `ba-06-ui-html-prototype` skill (Task 3)
   - **Input**: Task 1 + Task 2 输出
   - **Output**: 可在浏览器直接运行的 HTML 文件

**让我们一步步思考** 如何将需求转化为可视化的原型...

**🚪 Phase Gate 6 (Final)**:
- [ ] 页面结构覆盖用户旅程 100% 阶段
- [ ] 组件清单覆盖用户故事 100% 功能点
- [ ] 设计元素 100% 匹配到组件库组件
- [ ] 每个页面有对应的 Layout 结构图
- [ ] 交互流程覆盖正常 + 异常场景
- [ ] HTML 原型可在浏览器直接打开运行
- [ ] 使用 TDesign 设计系统（或用户指定的组件库）

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ 原始需求材料严重不足（少于 500 字）
- ❌ 业务目标完全模糊，无法提取 SMART 目标
- ❌ 用户角色无法识别（缺少利益相关者信息）
- ❌ 需求冲突严重且无法调和
- ❌ Epic 规模过大（预估 > 50 个用户故事）
- ❌ 技术约束与业务需求严重冲突

**Action**: 
1. 暂停当前阶段
2. 明确列出阻塞问题
3. 请求用户补充信息或澄清
4. 获得澄清后继续执行

---

## 📝 输出格式

### 文件位置规范
```
workspace/{变更ID}/ba/
├── business-requirements.md    # Phase 1 输出
├── epic-analysis.md            # Phase 2 输出
├── user-stories.md             # Phase 3 输出
├── invest-evaluation.md        # Phase 4 输出
├── acceptance-criteria.md      # Phase 5 输出
└── prototypes/                 # Phase 6 输出
    ├── {page-name}.html
    └── ...
```

**说明**:
- `{变更ID}` 格式: `YYYY-MM-DD-{feature-name}`, 例如: `2025-12-30-user-management`
- 所有 BA 文档集中在 `workspace/{变更ID}/ba/` 目录下
- HTML 原型放在 `prototypes/` 子目录中
- 与 `requirement` 和 `design` 指令保持一致的目录结构

### 输出文件头部 (YAML Frontmatter)

```yaml
---
project: {项目名称}
phase: {阶段名称}
created_at: {创建日期}
updated_at: {更新日期}
author: {作者}
status: draft|review|approved
---
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 原始需求材料已准备
- [ ] 业务背景已了解
- [ ] 执行范围已确定

### 执行中验证（Phase Gates）
- [ ] Phase 1 Gate 通过（业务需求提取）
- [ ] Phase 2 Gate 通过（Epic 分析）
- [ ] Phase 3 Gate 通过（用户故事生成）
- [ ] Phase 4 Gate 通过（INVEST 评估）
- [ ] Phase 5 Gate 通过（验收标准编写）
- [ ] Phase 6 Gate 通过（UI 原型设计）

### 最终验证
- [ ] 所有阶段输出文件已生成
- [ ] 文件位置符合规范
- [ ] 输出内容可追溯到原始需求
- [ ] 用户故事覆盖所有核心功能
- [ ] 验收标准可直接用于测试
- [ ] HTML 原型可正常运行

---

## 🎓 最佳实践

### 1. 渐进式细化

✅ **好的做法**:
```
原始需求 → SMART目标 → Epic → Feature → User Story → AC
每一步都基于上一步的输出，逐步细化
```

❌ **不好的做法**:
```
直接从原始需求跳到用户故事，跳过中间分析步骤
```

### 2. 可追溯性

✅ **好的做法**:
```markdown
US-001 来源于 Epic-001 的"用户注册"Feature
Epic-001 来源于业务目标 BG-001"提升用户转化率"
```

❌ **不好的做法**:
```markdown
US-001: 用户注册功能（无来源标注）
```

### 3. 迭代反馈

✅ **好的做法**:
```
完成每个阶段后，与利益相关者确认
发现问题及时回溯修正
```

❌ **不好的做法**:
```
一口气完成所有阶段，最后才发现方向错误
```

---

## 📚 相关资源

### 核心 Skills
- [ba-01 业务需求提取](mdc:skills/ba-01-business-requirement-extraction/SKILL.md)
- [ba-02 Epic 分析](mdc:skills/ba-02-epic-analysis/SKILL.md)
- [ba-03 用户故事生成](mdc:skills/ba-03-user-story-generation/SKILL.md)
- [ba-04 INVEST 评估](mdc:skills/ba-04-invest-evaluation/SKILL.md)
- [ba-05 验收标准编写](mdc:skills/ba-05-acceptance-criteria/SKILL.md)
- [ba-06 UI 原型设计](mdc:skills/ba-06-ui-html-prototype/SKILL.md)

### 相关 Commands
- [需求分析](mdc:commands/spec-coding/requirement.md) - 需求分析工作流
- [设计](mdc:commands/spec-coding/design.md) - 技术设计工作流

### 参考文档
- [敏捷开发最佳实践](https://www.agilealliance.org/agile101/)
- [SAFe Framework](https://www.scaledagileframework.com/)
- [TDesign 设计系统](https://tdesign.tencent.com/)

---

## ❓ 常见问题

### Q: 如何选择执行完整流程还是单独任务？

**A**: 
- **完整流程 (full)**: 适用于新项目启动、从零开始的需求分析
- **单独任务**: 适用于已有部分输出、只需补充某个阶段的场景

### Q: 如果原始需求材料不完整怎么办？

**A**: 
1. 使用 ba-01 的"信息不足处理"机制
2. 基于行业最佳实践合理推断，标注`（推断，需确认）`
3. 列入待确认清单，后续与业务方确认

### Q: 用户故事数量应该控制在多少？

**A**: 
- 小型 Epic: 5-10 个故事
- 中型 Epic: 10-20 个故事
- 大型 Epic: 20-40 个故事
- 超过 40 个需要拆分 Epic

### Q: 是否每个故事都需要编写验收标准？

**A**: 
- **Must Have** 故事：必须编写详细 AC
- **Should Have** 故事：建议编写核心 AC
- **Could Have** 故事：可简化或延后编写

### Q: UI 原型是否必须执行？

**A**: 
- 如果项目有专业 UX 设计师，可跳过 Phase 6
- 如果需要快速验证想法或与利益相关者沟通，建议执行

---

## 📖 完整示例

参考以下文件查看完整的实际使用示例：

- `skills/ba-01-business-requirement-extraction/examples.md` - 业务需求提取示例
- `skills/ba-02-epic-analysis/examples.md` - Epic 分析示例
- `skills/ba-03-user-story-generation/examples.md` - 用户故事生成示例
- `skills/ba-04-invest-evaluation/examples.md` - INVEST 评估示例
- `skills/ba-05-acceptance-criteria/examples.md` - 验收标准示例
- `skills/ba-06-ui-html-prototype/examples.md` - UI 原型示例

---

**版本**: 1.0.0  
**最后更新**: 2025-12-30  
**维护者**: Spec-Code Team  
**反馈**: 请通过 Issue 或 PR 提供反馈
