---
command_name: 需求阶段
description: 帮助用户完善需求
---

# Command: 帮助用户完善需求

> ⚠️ **必须遵守**: [通用规范索引](mdc:spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求
> ⚠️ **编写需求时应注意**: 需求文档应该聚焦功能描述、业务规则、验收标准，而不是写详细的代码实现

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)

---

## 🎯 用途

作为**智能调度器**，通过系统化的调研和分析流程，根据输入内容类型自动选择最优的 Skills 组合来帮助用户完善需求。

**适用场景**:
- 用户提供模糊的业务想法，需要澄清和细化
- 用户提供需求文档，需要质量审查和完善
- 用户提供代码库，需要逆向推导需求
- 用户需要将需求拆解为可执行任务

**核心价值**:
- 🔍 深入调研项目背景，避免错误假设
- 📋 系统化处理需求，确保完整性和清晰度
- ✅ 强制流程保证质量，防止跳过关键步骤
- 🎯 智能匹配场景，自动选择最优工作流

---

## 📋 前置条件

在执行此 Command 前，请确保：

- [ ] 用户已提供需求相关信息（想法/文档/代码库）
- [ ] 项目上下文已初始化（如适用）
- [ ] 必要的 Skills 可用

---

## 🔄 执行流程

### Phase 0: 项目调研 (MANDATORY)

**Objective**: 深入理解项目现状和技术背景，为需求分析提供准确的上下文

**MANDATORY STEPS**:

1. **MUST** 判断是否需要项目调研
   - **如果用户提供了代码库路径或项目引用** → 执行调研
   - **如果用户仅提供业务想法** → 跳过调研，直接进入 Phase 1
   
2. **MUST** 分析项目结构 - Use `doc-git-list` skill
   - 识别项目技术栈（Java/Vue/Python/Node.js）
   - 分析目录结构和模块划分
   - 识别关键配置文件和依赖
   - **Verification**:
     - [ ] 技术栈已明确识别
     - [ ] 核心模块已列出
     - [ ] 项目规模已评估

3. **MUST** 提取项目知识 - Use `doc-extract-knowledge` skill
   - 提取业务领域知识和术语
   - 识别核心业务流程和实体
   - 分析现有功能模块
   - **Verification**:
     - [ ] 业务领域已理解
     - [ ] 核心实体已识别
     - [ ] 现有功能已梳理

4. **OPTIONAL** 分析现有代码 - Use `doc-analyze-code` skill（如需要深入理解）
   - 分析代码架构和设计模式
   - 识别技术债务和潜在问题
   - 评估代码质量
   - **Verification**:
     - [ ] 架构风格已理解
     - [ ] 问题点已标记
     - [ ] 质量基线已评估

5. **OPTIONAL** 逆向推导需求 - Use `doc-code2req` skill（如用户需要理解现有需求）
   - 从代码推导业务需求
   - 识别隐含的业务规则
   - 补充缺失的需求文档
   - **Verification**:
     - [ ] 现有需求已梳理
     - [ ] 业务规则已提取
     - [ ] 需求文档已补充

**Output**: 
- 项目背景理解（内部记录，不生成文档）
- 技术约束清单
- 现有功能清单
- 潜在问题列表

**🚪 Phase Gate 0**:
- [ ] 项目技术栈已明确（如适用）
- [ ] 业务领域已理解（如适用）
- [ ] 技术约束已识别（如适用）
- [ ] 可以准确理解用户需求上下文

**🚫 Red Flags - STOP if**:
- 项目代码库无法访问或路径错误
- 项目过于复杂，超出分析能力范围
- 缺少必要的项目文档且无法推导

**Cannot proceed to Phase 1 without all checks passing.**

---

### Phase 1: 需求理解与场景判断 (MANDATORY)

**Objective**: 理解用户输入的需求内容，判断需求类型和完整度

**MANDATORY STEPS**:

1. **MUST** 分析输入内容
   - 识别需求类型（模糊想法/明确需求/需求文档/代码引用）
   - 评估需求完整度（完整/部分/零散）
   - 识别关键信息和缺失信息
   - **Verification**:
     - [ ] 需求类型已判断
     - [ ] 完整度已评估
     - [ ] 缺失信息已列出

2. **MUST** 选择处理场景
   根据需求类型，选择以下场景之一：
   
   **场景 A: 模糊需求** → 进入 Phase 2A
   - 用户描述：业务想法、痛点、目标
   - 特征：缺少具体功能定义
   
   **场景 B: 明确需求文档** → 进入 Phase 2B
   - 用户提供：需求文档、PRD、用户故事
   - 特征：有具体功能描述
   
   **场景 C: 需求审查** → 进入 Phase 2C
   - 用户请求：需求审查、质量检查
   - 特征：需求已成文，需要验证
   
   **场景 D: 任务拆解** → 进入 Phase 2D
   - 用户请求：拆解需求为任务
   - 特征：需求明确，需要执行计划

**Output**: 场景判断结果和处理路径

**🚪 Phase Gate 1**:
- [ ] 需求类型已明确
- [ ] 处理场景已选择
- [ ] 知道下一步做什么

**Cannot proceed without clear scenario selection.**

---

### Phase 2A: 模糊需求澄清 (场景 A)

**Objective**: 将模糊的业务想法转化为清晰的功能需求

**MANDATORY STEPS**:

1. **MUST** 澄清需求 - Use `vibe-req-clarify` skill
   - 识别需求中的模糊点和歧义
   - 结构化提问澄清疑问
   - 每个问题提供 2-4 个可选方案
   - **Verification**:
     - [ ] 所有模糊点已标记
     - [ ] 澄清问题已列出
     - [ ] 用户已回答或确认

2. **MUST** 转化为功能需求 - Use `vibe-req-explain` skill
   - 将业务目标转化为功能性需求
   - 定义验收标准和成功指标
   - 识别非功能需求（性能/安全/可用性）
   - **Verification**:
     - [ ] 功能需求已明确定义
     - [ ] 验收标准已量化
     - [ ] 非功能需求已识别

3. **OPTIONAL** 拆解需求 - Use `vibe-req-breakdown` skill（如需要）
   - 将需求拆解为可执行任务
   - 识别依赖关系和优先级
   - **Verification**:
     - [ ] 任务粒度合理（1-3天）
     - [ ] 依赖关系清晰

**Output**: 
- 清晰的功能需求文档（如用户要求）
- 验收标准清单
- 任务拆解（可选）

**🚪 Phase Gate 2A**:
- [ ] 需求已清晰，无模糊点
- [ ] 验收标准已定义
- [ ] 用户已确认理解一致

---

### Phase 2B: 明确需求完善 (场景 B)

**Objective**: 完善和优化已有的需求文档

**MANDATORY STEPS**:

1. **MUST** 理解需求 - Use `vibe-req-explain` skill
   - 分析需求文档结构和内容
   - 识别核心功能和辅助功能
   - 提取业务规则和约束
   - **Verification**:
     - [ ] 核心功能已识别
     - [ ] 业务规则已提取

2. **MUST** 质量审查 - Use `vibe-req-review` skill（如需要）
   - 检查需求的完整性、一致性、清晰性
   - 识别缺失和矛盾之处
   - 提出改进建议
   - **Verification**:
     - [ ] 质量问题已识别
     - [ ] 改进建议已提出

3. **OPTIONAL** 拆解需求 - Use `vibe-req-breakdown` skill（如需要）
   - 拆解为可执行任务
   - **Verification**:
     - [ ] 任务清单已生成

**Output**: 
- 完善后的需求文档（原地修改）
- 质量审查报告（如用户要求）
- 任务清单（可选）

**🚪 Phase Gate 2B**:
- [ ] 需求完整性已验证
- [ ] 质量问题已解决
- [ ] 用户已确认

---

### Phase 2C: 需求审查 (场景 C)

**Objective**: 系统化审查需求质量

**MANDATORY STEPS**:

1. **MUST** 执行 6 维度质量扫描 - Use `vibe-req-review` skill
   - 一致性检查
   - 完整性检查
   - 清晰性检查
   - 准确性检查
   - 无重复性检查
   - 可验证性检查
   - **Verification**:
     - [ ] 所有维度已检查
     - [ ] 问题已标记
     - [ ] 改进建议已提出

2. **MUST** 生成审查报告（如用户要求）
   - 列出所有发现的问题
   - 标注严重程度（高/中/低）
   - 提供具体改进建议
   - **Verification**:
     - [ ] 问题清单完整
     - [ ] 严重程度合理
     - [ ] 建议可执行

**Output**: 
- 需求审查报告（如用户要求）
- 问题清单和改进建议

**🚪 Phase Gate 2C**:
- [ ] 审查完成
- [ ] 问题已识别
- [ ] 用户已知晓

---

### Phase 2D: 任务拆解 (场景 D)

**Objective**: 将需求拆解为可执行的任务

**MANDATORY STEPS**:

1. **MUST** 拆解任务 - Use `vibe-req-breakdown` skill
   - 将需求拆解为原子任务
   - 识别依赖关系
   - 评估优先级和工作量
   - **Verification**:
     - [ ] 任务粒度合理（1-3天）
     - [ ] 依赖关系清晰
     - [ ] 优先级已标注

**Output**: 
- 任务清单
- 依赖关系图（可选）
- 工作量评估（可选）

**🚪 Phase Gate 2D**:
- [ ] 任务清单完整
- [ ] 可以开始执行

---

### Phase 3: 文档索引生成 (MANDATORY)

**Objective**: 在需求文件夹下生成README文档，将所有需求文档串联起来

**MANDATORY STEPS**:

1. **MUST** 生成需求文档索引 - Use `doc-index` skill
   - 扫描 `workspace/{变更ID}/requirements/` 目录
   - 提取所有需求文档的元数据（标题、描述、创建时间、状态）
   - 分析文档之间的关系和依赖
   - 生成结构化的 README 索引文档
   - **Verification**:
     - [ ] README 包含所有需求文档
     - [ ] 文档分类清晰（需求文档/澄清记录/审查报告）
     - [ ] 包含文档摘要和快速导航
     - [ ] 包含需求演进时间线

2. **MUST** README 内容完整性检查
   - 文档概览（统计信息：文档数量、类型、最后更新时间）
   - 按类型分类（需求文档、澄清记录、审查报告、任务清单）
   - 按时间线排序（了解需求演进过程）
   - 快速导航（新人上手指南）
   - **Verification**:
     - [ ] README 结构完整
     - [ ] 所有文档都已索引
     - [ ] 时间线清晰
     - [ ] 快速导航可用

**Output**: 
- `workspace/{变更ID}/requirements/README.md` - 需求文档索引

**🚪 Phase Gate 3**:
- [ ] README 已生成
- [ ] 所有需求文档已索引
- [ ] 文档关系清晰
- [ ] 可以进入最终验证

---

### Phase 4: 最终验证与交付 (MANDATORY)

**Objective**: 确保需求质量达标，交付给用户

**MANDATORY STEPS**:

1. **MUST** 执行最终验证
   - 检查所有 Phase Gates 是否通过
   - 验证输出文档格式正确
   - 确认用户需求已满足
   - 检查 README 索引完整性
   - **Verification**:
     - [ ] 所有 Phase Gates 通过
     - [ ] 输出格式正确
     - [ ] 用户需求已覆盖
     - [ ] README 索引完整

2. **MUST** 与用户确认
   - 总结完成的工作
   - 说明关键发现和建议
   - 说明需求文档结构和索引
   - 询问是否需要进一步完善
   - **Verification**:
     - [ ] 用户已理解输出
     - [ ] 用户已确认满意

**Output**: 
- 最终需求文档（如适用）
- 需求文档索引（README.md）
- 工作总结（口头说明，不生成文档）

**🚪 Phase Gate 4**:
- [ ] 所有验证通过
- [ ] 用户已确认
- [ ] Command 可以结束

---

## 📤 输出格式

### 输出目录规范

**MUST 遵循**: [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)

**核心规则**:
- **输出路径**: `workspace/{变更ID}/requirements/`
- **变更ID格式**: `YYYY-MM-DD-feature-name`
- **示例**: `workspace/2025-11-21-user-auth/requirements/`

**变更ID生成规则**:
- 日期格式: `YYYY-MM-DD`（创建日期）
- 功能名称: 小写字母 + 连字符
- 长度: 不超过 50 个字符
- 唯一性: 同一天内不能重复

**示例**:
- `workspace/2025-11-21-user-auth/requirements/requirements.md`
- `workspace/2025-11-21-user-auth/requirements/clarifications.md`
- `workspace/2025-11-21-user-auth/requirements/README.md`

### 不生成文档的情况
- 仅进行需求澄清和口头确认
- 仅提供建议，不修改文档

### 生成/修改文档的情况

**优先原地修改现有文档**:
- 如果用户已有需求文档 → 直接修改
- 如果用户明确要求生成文档 → 创建新文档到 `workspace/{变更ID}/requirements/`

**文档位置**（统一在变更ID目录下）:
- 需求文档 → `workspace/{变更ID}/requirements/requirements.md`
- 澄清记录 → `workspace/{变更ID}/requirements/clarifications.md`
- 审查报告 → `workspace/{变更ID}/requirements/validation-report.md`
- 任务清单 → `workspace/{变更ID}/requirements/tasks.md`
- 文档索引 → `workspace/{变更ID}/requirements/README.md` (MANDATORY)

---

## ✅ 验证清单

### 执行前验证
- [ ] 前置条件已满足
- [ ] 用户需求已收集

### Phase 0 验证（如适用）
- [ ] 项目技术栈已明确
- [ ] 业务领域已理解
- [ ] 技术约束已识别

### Phase 1 验证
- [ ] 需求类型已判断
- [ ] 处理场景已选择

### Phase 2 验证（根据场景）
- [ ] 场景 A: 需求已澄清，功能需求已定义
- [ ] 场景 B: 需求已完善，质量已提升
- [ ] 场景 C: 审查已完成，问题已识别
- [ ] 场景 D: 任务已拆解，可执行

### Phase 3 验证
- [ ] README 已生成
- [ ] 所有需求文档已索引
- [ ] 文档关系清晰

### Phase 4 验证
- [ ] 所有 Phase Gates 通过
- [ ] 输出文档符合规范（如适用）
- [ ] 用户已确认满意

### 最终验证
- [ ] 需求清晰无歧义
- [ ] 验收标准已定义
- [ ] 文档格式正确（如适用）
- [ ] 无遗漏的关键信息
- [ ] README 索引完整且准确

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ 用户需求过于模糊，多次澄清仍无法理解
- ❌ 需求包含明显的技术不可行性
- ❌ 需求自相矛盾，用户无法解释
- ❌ 项目背景无法获取，导致无法准确理解需求
- ❌ 用户请求超出需求阶段范围（如要求直接实现代码）

**Action**: 
- 明确告知用户问题所在
- 提供具体的澄清建议
- 建议用户调整需求或补充信息
- 如需要，建议切换到其他 Command

---

## 🔗 相关资源

### 核心 Skills
- [vibe-req-clarify](mdc:skills/vibe-req-clarify/SKILL.md) - 需求澄清
- [vibe-req-explain](mdc:skills/vibe-req-explain/SKILL.md) - 需求转化
- [vibe-req-review](mdc:skills/vibe-req-review/SKILL.md) - 需求审查
- [vibe-req-breakdown](mdc:skills/vibe-req-breakdown/SKILL.md) - 需求拆解
- [doc-git-list](mdc:skills/doc-git-list/SKILL.md) - 项目结构分析
- [doc-extract-knowledge](mdc:skills/doc-extract-knowledge/SKILL.md) - 项目知识提取
- [doc-analyze-code](mdc:skills/doc-analyze-code/SKILL.md) - 代码分析
- [doc-code2req](mdc:skills/doc-code2req/SKILL.md) - 代码逆向需求
- [doc-index](mdc:skills/doc-index/SKILL.md) - 文档索引生成

### 相关 Commands
- [design.md](mdc:commands/spec-coding/design.md) - 设计阶段 Command

---

## 🎓 最佳实践

### 1. 充分调研再处理

✅ **好的做法**:
```
用户: 帮我完善用户管理系统的需求
AI: 
1. 先分析项目代码库 (doc-git-list)
2. 提取现有功能 (doc-extract-knowledge)
3. 理解业务背景后再澄清需求
```

❌ **不好的做法**:
```
AI: 直接询问需求细节，忽略项目背景
```

### 2. 场景匹配准确

✅ **好的做法**:
```
用户提供完整 PRD → 选择场景 B（需求完善）
用户说"我想做个系统" → 选择场景 A（模糊需求澄清）
```

❌ **不好的做法**:
```
不管什么情况都执行相同流程
```

### 3. 强制验证不跳过

✅ **好的做法**:
```
每个 Phase Gate 都认真检查
发现问题立即停止，不继续下一阶段
```

❌ **不好的做法**:
```
走形式，发现问题也继续
```