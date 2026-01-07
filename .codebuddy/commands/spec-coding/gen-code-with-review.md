---
command_name: 生成代码并审查
description: 基于设计文档生成代码,并通过监督 Agent 进行质量审查和持续优化,直到代码达到企业级标准。调用 code-generator Agent 生成代码,然后调用 code-reviewer-supervisor Agent 进行多维度评估和迭代优化。
---

# Command: 生成代码并审查

> ⚠️ **必须遵守**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求
> ⚠️ **必须遵守**: 必须结合当前项目代码规范，优先使用项目中已有的标准实现或已有类库

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 代码输出路径: 直接修改项目代码
> - 审查报告路径: `workspace/{变更ID}/cr/`

---

## 🎯 用途

编排 `code-generator` 和 `code-reviewer-supervisor` 两个 Agent 的协作流程,实现**高质量代码生成的完整闭环**:

1. **code-generator Agent** - 根据设计文档生成代码
2. **code-reviewer-supervisor Agent** - 评估代码质量并驱动优化
3. **迭代优化** - 自动修复问题直到达到质量标准(≥ 85/100)

**核心价值**:
- ✅ **质量保证**: 通过监督 Agent 确保代码达到企业级标准
- ✅ **自动优化**: 发现问题自动调用 code-generator 修复,无需人工干预
- ✅ **设计审查**: 及时发现设计文档矛盾,避免后期返工
- ✅ **透明过程**: 完整记录生成和优化过程,便于审计

**适用场景**:
- 基于设计文档的标准功能开发
- 需要高质量保证的核心业务代码
- 大型项目的代码生成和验收
- 团队协作中的代码质量管控

---

## 📋 前置条件

在执行此Command前,请确保:

- [ ] 设计文档已完成(至少包含功能设计或API设计)
- [ ] 项目技术栈已明确(Spring Boot/Vue等)
- [ ] 项目代码库已初始化
- [ ] 理解两个 Agent 的职责和协作方式

**必需的设计文档**(至少一项):
- `design/feature-design.md` - 功能设计文档
- `design/api-design.md` - API接口设计文档
- `design/database-design.md` - 数据库设计文档
- `design/business-logic.md` - 业务逻辑设计文档

**可选的设计文档**:
- `design/architecture-design.md` - 架构设计文档
- `design/ui-design.md` - UI设计文档

---

## 💡 参数传递

本Command支持以下参数:

### 全部参数捕获
```bash
/gen-code-with-review workspace/2025-11-21-user-management spring-boot
# 实际提示: 为 workspace/2025-11-21-user-management 生成代码并审查,技术栈: spring-boot
```

### 位置参数
- `$1` - 设计文档路径(通常是 `workspace/{变更ID}` 或 `design/`)
- `$2` - 技术栈(可选,如 `spring-boot`、`vue`、`auto`,默认自动识别)

**如果参数不完整,交互式询问**:

```markdown
请提供以下信息:

1. **设计文档路径**: [相对或绝对路径]
   示例: workspace/2025-11-21-user-management
         design/

2. **技术栈**: [可选,留空自动识别]
   选项: 
   - spring-boot - Spring Boot 3 项目
   - vue - Vue 3 项目
   - auto - 自动识别(默认)

3. **质量标准**: [可选,默认 85]
   - 综合得分要求(0-100,建议 ≥ 85)
```

---

## 🔄 执行流程

### Phase 1: 准备和验证

**Objective**: 验证前置条件,准备 Agent 协作环境

**MANDATORY STEPS**:

1. **MUST** 验证设计文档存在性
   - **Action**: 扫描设计文档目录
   - **Input**: 设计文档路径
   - **Output**: 设计文档清单
   - **Verification**: 
     - [ ] 至少存在一个设计文档(功能设计/API设计/数据库设计)
     - [ ] 设计文档格式正确(包含 YAML Frontmatter)
     - [ ] 设计文档内容完整(无空文件)

2. **MUST** 识别技术栈
   - **Action**: 扫描项目文件(pom.xml, package.json等)或使用用户指定
   - **Input**: 项目根目录 + 用户指定技术栈(如有)
   - **Output**: 确定的技术栈(spring-boot/vue)
   - **Verification**: 
     - [ ] 技术栈已明确识别
     - [ ] 技术栈与项目文件一致
     - [ ] 技术栈被两个 Agent 支持

3. **MUST** 展示执行计划(透明性)
   - **Action**: 向用户展示完整的执行计划
   - **Output**: 
     ```
     📋 执行计划:
     
     Phase 1: 准备和验证 ✅
     Phase 2: 调用 code-generator 生成代码
       - 预计生成文件: 约 50-150 个
       - 预计耗时: 10-15 分钟
     
     Phase 3: 调用 code-reviewer-supervisor 审查代码
       - 评估维度: 代码-设计一致性(40%) + 代码质量(40%) + 设计合理性(20%)
       - 质量标准: 综合得分 ≥ 85/100
       - 最大迭代: 5 次
       - 预计耗时: 15-30 分钟
     
     总预计耗时: 25-45 分钟
     ```
   - **Verification**: 
     - [ ] 执行计划已展示
     - [ ] 预估耗时合理

**让我们一步步思考** 如何确保设计文档完整且可用于代码生成...

**🚪 Phase Gate 1**:
- [ ] 至少存在一个有效的设计文档
- [ ] 技术栈已明确识别
- [ ] 执行计划已向用户确认

**Cannot proceed to Phase 2 without all checks passing.**

---

### Phase 2: 调用 code-generator Agent 生成代码

**Objective**: 基于设计文档生成初版代码

**MANDATORY STEPS**:

1. **MUST** 调用 code-generator Agent
   - **Agent**: `code-generator` (Routing 模式)
   - **Input**: 
     - 设计文档路径
     - 技术栈
     - 生成策略(全量/核心优先/自定义)
   - **Action**: 
     ```
     [调用 Agent] code-generator
     [传递参数] 
       - design_docs_path: {设计文档路径}
       - tech_stack: {技术栈}
       - strategy: full (全量生成)
     
     [Agent 内部流程]
     1. 识别设计文档类型(功能/API/数据库/综合)
     2. 路由到专门的代码生成策略
     3. 调用 code-generation 技能生成代码
     4. 分层生成(Entity → Mapper → Service → Controller → DTO)
     5. 质量验证(编译通过、单元测试、规范检查)
     ```
   - **Output**: 
     - 生成的代码文件清单
     - 代码生成报告
   - **Verification**: 
     - [ ] code-generator Agent 执行成功
     - [ ] 代码文件已生成
     - [ ] 代码可编译通过
     - [ ] 无严重错误

2. **MUST** 验证代码生成完整性
   - **Action**: 检查生成的代码是否覆盖设计要求
   - **Checks**:
     - [ ] Controller 层已生成(如有 API 设计)
     - [ ] Service 层已生成(如有业务逻辑设计)
     - [ ] Mapper/DAO 层已生成(如有数据库设计)
     - [ ] Entity/DTO 已生成(如有数据模型设计)
     - [ ] 单元测试已生成(如启用)
   - **Verification**: 
     - [ ] 代码覆盖所有设计要求
     - [ ] 无明显遗漏

3. **MUST** 记录生成结果(透明性)
   - **Action**: 展示代码生成统计
   - **Output**:
     ```
     ✅ 代码生成完成!
     
     生成文件统计:
     - Controller: 12 个
     - Service: 18 个
     - Mapper: 15 个
     - Entity: 20 个
     - DTO: 25 个
     - 测试: 30 个
     
     总计: 120 个文件
     
     代码生成报告: workspace/{变更ID}/code-generation-report.md
     ```
   - **Verification**: 
     - [ ] 生成统计已展示
     - [ ] 代码生成报告已保存

**🚪 Phase Gate 2**:
- [ ] code-generator Agent 执行成功
- [ ] 代码已生成且可编译
- [ ] 代码覆盖所有设计要求
- [ ] 生成统计和报告已记录

**Cannot proceed to Phase 3 without all checks passing.**

---

### Phase 3: 调用 code-reviewer-supervisor Agent 审查代码

**Objective**: 评估代码质量并驱动迭代优化直到达标

**MANDATORY STEPS**:

1. **MUST** 调用 code-reviewer-supervisor Agent(首次评估)
   - **Agent**: `code-reviewer-supervisor` (Evaluator-Optimizer 模式)
   - **Input**: 
     - 设计文档路径
     - 生成的代码路径
     - 技术栈
     - 质量标准(默认 85/100)
   - **Action**: 
     ```
     [调用 Agent] code-reviewer-supervisor
     [传递参数] 
       - design_docs_path: {设计文档路径}
       - generated_code_path: {代码路径}
       - tech_stack: {技术栈}
       - quality_threshold: 85
     
     [Agent 内部流程 - 评估阶段]
     1. 读取设计文档(完整读取)
     2. 扫描生成的代码
     3. 评估代码-设计一致性(40%)
     4. 调用 cr-java-code/cr-vue-code 评估代码质量(40%)
     5. 评估设计合理性(20%)
     6. 计算综合得分
     7. 生成问题清单(P0/P1/P2)
     ```
   - **Output**: 
     - 综合得分(0-100)
     - 三维度评分(一致性/质量/设计合理性)
     - 问题清单(具体到文件+行号+修复建议)
     - 审查报告路径
   - **Verification**: 
     - [ ] code-reviewer-supervisor Agent 执行成功
     - [ ] 评估报告已生成
     - [ ] 问题清单完整(包含位置、期望值、实际值、修复建议)

2. **MUST** 判断是否需要优化
   - **Decision Logic**:
     ```
     if 综合得分 >= 85 and P0问题 == 0 and P1问题 < 3:
         # 质量达标,进入 Phase 4
         goto Phase 4
     else:
         # 质量不达标,进入优化阶段
         continue to step 3
     ```
   - **Verification**: 
     - [ ] 决策逻辑已执行
     - [ ] 决策结果已明确(达标 or 不达标)

3. **MUST** 进入优化迭代循环(如果不达标)
   - **Agent 内部流程 - 优化阶段**:
     ```
     [code-reviewer-supervisor 决策路由]
     
     if 代码-设计一致性得分 < 80:
         # 代码问题,调用 code-generator 修复
         [调用 Agent] code-generator
         [模式] fix (修复模式)
         [传递] 问题清单(具体到文件+行号)
         [输出] 修复后的代码
     
     elif 设计合理性得分 < 70:
         # 设计问题,向用户提出建议
         [暂停] 等待用户修改设计文档
         [输出] 设计改进建议
     
     else:
         # 代码质量问题,调用 code-generator 优化
         [调用 Agent] code-generator
         [模式] optimize (优化模式)
         [传递] 质量问题清单
         [输出] 优化后的代码
     ```
   - **Verification**: 
     - [ ] 优化策略已选择
     - [ ] 相应 Agent 已调用
     - [ ] 优化结果已获取

4. **MUST** 再次评估(优化后)
   - **Action**: code-reviewer-supervisor 重新执行评估流程
   - **Output**: 
     - 新的综合得分
     - 优化前后对比
     - 剩余问题清单
   - **Verification**: 
     - [ ] 再次评估已完成
     - [ ] 优化前后对比已生成

5. **MUST** 迭代控制
   - **Iteration Limit**: 最多 5 次迭代
   - **Termination Conditions**:
     - ✅ **成功终止**: 综合得分 ≥ 85 且 P0 == 0 且 P1 < 3
     - ⏸️ **暂停等待**: 设计问题需人工修改设计文档
     - ❌ **强制终止**: 达到最大迭代次数(5次) 或 用户手动停止
   - **Action**:
     ```
     if 达标:
         goto Phase 4 (成功)
     elif 设计问题:
         暂停并向用户提出建议,等待修改设计文档
     elif 迭代次数 < 5:
         回到 step 3 (继续优化)
     else:
         强制终止,生成诊断报告
     ```
   - **Verification**: 
     - [ ] 终止条件已判断
     - [ ] 终止决策已执行

**让我们一步步思考** code-reviewer-supervisor Agent 如何更好地监督 code-generator Agent...

**监督机制设计**:

1. **明确的评估标准**:
   - code-reviewer-supervisor 使用三维度加权评分(一致性40% + 质量40% + 设计合理性20%)
   - 具体的质量阈值(≥ 85/100)
   - 问题分级(P0阻塞/P1重要/P2优化)

2. **精准的问题定位**:
   - 问题描述具体到文件+行号
   - 提供期望值 vs 实际值对比
   - 给出明确的修复建议和修复代码

3. **智能的优化策略**:
   - 代码问题 → 调用 code-generator 自动修复
   - 设计问题 → 向用户建议,等待人工干预
   - 分级优化: 先修复 P0,再修复 P1,最后优化 P2

4. **透明的迭代过程**:
   - 展示每次评估的详细得分和问题
   - 对比优化前后的变化
   - 记录完整的迭代历史

5. **防止无限循环**:
   - 最大迭代 5 次
   - 设计问题暂停等待人工
   - 连续失败强制终止

**如何让 code-generator Agent 更好地写代码**:

1. **完整读取设计文档**:
   - ⚠️ 避免只读前100行导致信息遗漏
   - 完整理解设计意图

2. **分层生成代码**:
   - 按依赖关系顺序生成(Entity → Mapper → Service → Controller)
   - 确保代码完整可运行

3. **接收精准的修复指令**:
   - code-reviewer-supervisor 提供具体到文件+行号的问题
   - 提供期望值和修复建议
   - code-generator 只修复有问题的部分,不重写整个文件

4. **质量自检**:
   - 生成后自动编译验证
   - 运行单元测试
   - 执行代码规范检查

5. **学习优化**:
   - 记录常见问题和修复模式
   - 在后续生成中避免重复错误

**🚪 Phase Gate 3**:
- [ ] code-reviewer-supervisor Agent 至少执行一次评估
- [ ] 如果不达标,已进入优化迭代
- [ ] 优化策略合理(代码问题/设计问题/质量问题)
- [ ] 迭代历史已记录
- [ ] 最终状态明确(达标/设计问题待修改/强制终止)

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: 生成最终报告和验收

**Objective**: 整理完整的代码生成和审查报告,完成验收

**MANDATORY STEPS**:

1. **MUST** 生成综合报告
   - **Action**: 整合 code-generator 和 code-reviewer-supervisor 的输出
   - **Report Structure**:
     ```markdown
     # 代码生成与审查综合报告
     
     **变更 ID**: {变更ID}
     **技术栈**: {技术栈}
     **执行时间**: {开始时间} - {结束时间}
     **总耗时**: {总耗时}
     
     ## 1. 代码生成阶段
     
     - 生成文件统计: {统计数据}
     - 代码生成策略: {策略说明}
     - 代码生成报告: [链接]
     
     ## 2. 代码审查阶段
     
     ### 最终评估结果
     
     | 维度 | 得分 | 权重 | 加权得分 | 状态 |
     |------|------|------|----------|------|
     | 代码-设计一致性 | XX/100 | 40% | XX | ✅/⚠️/🔴 |
     | 代码质量 | XX/100 | 40% | XX | ✅/⚠️/🔴 |
     | 设计合理性 | XX/100 | 20% | XX | ✅/⚠️/🔴 |
     
     **综合得分**: XX/100 (✅ 达标 / ⚠️ 不达标)
     
     ### 迭代历史
     
     - Iteration 1: 得分 XX → 发现问题 → 优化
     - Iteration 2: 得分 XX → 达标 ✅
     
     ### 修复问题清单
     
     - [✅] 问题1 - 已修复
     - [✅] 问题2 - 已修复
     - [⚠️] 问题3 - 设计问题,需人工修改
     
     ### 审查报告
     
     - 详细报告: workspace/{变更ID}/cr/code-review-final.md
     
     ## 3. 验收结论
     
     - [ ] 代码已生成且可编译
     - [ ] 综合得分 ≥ 85/100
     - [ ] 无 P0 阻塞性问题
     - [ ] P1 问题 < 3个
     - [ ] 代码符合设计文档要求
     
     **验收状态**: ✅ 通过 / ⚠️ 待改进 / 🔴 不通过
     
     ## 4. 后续建议
     
     - {建议1}
     - {建议2}
     ```
   - **Output**: `workspace/{变更ID}/code-generation-review-report.md`
   - **Verification**: 
     - [ ] 综合报告已生成
     - [ ] 报告包含所有关键信息
     - [ ] 验收结论明确

2. **MUST** 验收检查
   - **Quality Gates - MUST PASS ALL**:
     
     **Gate 1: 代码完整性**
     - [ ] 代码已生成且可编译
     - [ ] 代码覆盖所有设计要求
     - [ ] 无严重错误或遗漏
     
     **Gate 2: 质量达标**
     - [ ] 综合得分 ≥ 85/100
     - [ ] 代码-设计一致性 ≥ 80/100
     - [ ] 代码质量 ≥ 80/100
     - [ ] 设计合理性 ≥ 70/100
     
     **Gate 3: 问题清零**
     - [ ] P0 阻塞性问题 = 0
     - [ ] P1 重要问题 < 3
     - [ ] P2 优化建议已记录
     
     **Gate 4: 文档完整**
     - [ ] 代码生成报告已保存
     - [ ] 代码审查报告已保存
     - [ ] 综合报告已生成
     - [ ] 迭代历史已记录
   
   - **Verification**: 
     - [ ] 所有 Quality Gates 通过或标记为待改进

3. **MUST** 向用户展示最终结果(透明性)
   - **Action**: 清晰展示验收状态和后续建议
   - **Output**:
     ```
     🎉 代码生成与审查完成!
     
     📊 最终评估:
     - 综合得分: 89/100 ✅
     - 代码-设计一致性: 92/100 ✅
     - 代码质量: 88/100 ✅
     - 设计合理性: 85/100 ✅
     
     📝 生成统计:
     - 总文件数: 120 个
     - 代码行数: 约 8,500 行
     - 测试覆盖率: 82%
     
     🔄 优化历史:
     - 迭代次数: 2 次
     - 修复问题: 5 个
     - 总耗时: 35 分钟
     
     ✅ 验收状态: 通过
     
     📂 相关文档:
     - 代码位置: src/main/java, src/test/java
     - 生成报告: workspace/{变更ID}/code-generation-report.md
     - 审查报告: workspace/{变更ID}/cr/code-review-final.md
     - 综合报告: workspace/{变更ID}/code-generation-review-report.md
     
     🚀 后续建议:
     - 运行完整测试套件: mvn test
     - 进行集成测试
     - 提交代码审查(PR)
     ```
   - **Verification**: 
     - [ ] 最终结果已清晰展示
     - [ ] 后续建议明确

**🚪 Final Gate**:
- [ ] 综合报告已生成
- [ ] 所有 Quality Gates 已检查
- [ ] 验收状态明确(通过/待改进/不通过)
- [ ] 最终结果已向用户展示
- [ ] 相关文档已保存

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ **设计文档缺失或不完整** - 无法生成代码,请先完成设计
- ❌ **技术栈无法识别** - 请手动指定技术栈
- ❌ **code-generator Agent 连续失败 3 次** - 可能是设计问题或环境问题,需人工介入
- ❌ **code-reviewer-supervisor 迭代 5 次仍不达标** - 可能是设计文档矛盾,需审查设计
- ❌ **设计文档内部矛盾无法解决** - 暂停执行,向用户提出修改建议
- ❌ **代码生成后无法编译** - 检查项目环境配置(JDK版本、依赖等)

**Action**: 
- 如遇 Red Flags,立即停止执行
- 向用户说明具体问题和建议的解决方案
- 等待用户修复问题后再重新执行

---

## 📝 输出格式

### 文件位置

**代码文件**:
```
src/main/java/...           # Java 代码(Spring Boot)
src/main/resources/...      # 配置文件
src/test/java/...           # 测试代码

或

src/components/...          # Vue 组件
src/services/...            # API 服务
src/types/...               # TypeScript 类型
```

**报告文件**:
```
workspace/{变更ID}/code-generation-report.md           # code-generator 生成报告
workspace/{变更ID}/cr/code-review-iteration-*.md       # code-reviewer-supervisor 迭代报告
workspace/{变更ID}/cr/code-review-final.md             # code-reviewer-supervisor 最终报告
workspace/{变更ID}/code-generation-review-report.md    # 综合报告(本 Command 输出)
```

### 综合报告结构

```markdown
---
change_id: {变更ID}
start_time: {开始时间}
end_time: {结束时间}
total_duration: {总耗时}
final_score: {综合得分}
status: pass|needs_improvement|failed
---

# 代码生成与审查综合报告

**变更 ID**: {变更ID}  
**技术栈**: {技术栈}  
**执行时间**: {开始时间} - {结束时间}  
**总耗时**: {总耗时}

## 1. 代码生成阶段

### 生成统计

| 类型 | 数量 | 代码行数 |
|------|------|----------|
| Controller | 12 | 800 |
| Service | 18 | 2,500 |
| Mapper | 15 | 600 |
| Entity | 20 | 1,200 |
| DTO | 25 | 1,500 |
| 测试 | 30 | 1,900 |

**总计**: 120 个文件, 约 8,500 行代码

### 生成策略

- 策略: 全量生成(spring-boot-full)
- 分层: Entity → Mapper → Service → Controller → DTO
- 测试: 已生成单元测试(覆盖率 82%)

### 详细报告

[代码生成报告](workspace/{变更ID}/code-generation-report.md)

## 2. 代码审查阶段

### 最终评估结果

| 维度 | 得分 | 权重 | 加权得分 | 状态 |
|------|------|------|----------|------|
| 代码-设计一致性 | 92/100 | 40% | 36.8 | ✅ 优秀 |
| 代码质量 | 88/100 | 40% | 35.2 | ✅ 良好 |
| 设计合理性 | 85/100 | 20% | 17.0 | ✅ 良好 |

**综合得分**: **89/100** ✅ (达标, 需要 ≥ 85)

### 迭代历史

#### Iteration 1
- **得分**: 81/100 (未达标)
- **问题**: 3个P0, 2个P1
- **问题分类**: 代码-设计不一致
- **操作**: 调用 code-generator 修复
- **耗时**: 8 分钟

#### Iteration 2
- **得分**: 89/100 (达标 ✅)
- **问题**: 0个P0, 1个P1
- **操作**: 通过验收
- **耗时**: 5 分钟

**总迭代**: 2 次  
**总优化耗时**: 13 分钟

### 修复问题清单

- [✅] UserController.java:45 - API路径不符合设计 → 已修正为 `/api/users/{id}/activate`
- [✅] UserService.java:89 - 缺少手机号格式校验 → 已添加正则校验
- [✅] UserService.java:120 - 未处理并发重复注册 → 已添加分布式锁
- [✅] UserMapper.java:34 - SQL语句缺少索引提示 → 已优化
- [⚠️] UserDTO.java:12 - 建议使用 Record 类型(Java 17+) → 记录为优化建议

### 审查报告

- [Iteration 1 报告](workspace/{变更ID}/cr/code-review-iteration-1.md)
- [Iteration 2 报告](workspace/{变更ID}/cr/code-review-iteration-2.md)
- [最终报告](workspace/{变更ID}/cr/code-review-final.md)

## 3. 验收结论

### 验收清单

- [x] 代码已生成且可编译
- [x] 综合得分 ≥ 85/100 (实际: 89/100)
- [x] 代码-设计一致性 ≥ 80/100 (实际: 92/100)
- [x] 代码质量 ≥ 80/100 (实际: 88/100)
- [x] 设计合理性 ≥ 70/100 (实际: 85/100)
- [x] 无 P0 阻塞性问题 (实际: 0个)
- [x] P1 问题 < 3个 (实际: 1个)
- [x] 代码符合设计文档要求
- [x] 相关文档已生成

**验收状态**: ✅ **通过**

### 质量总结

**优点**:
- 代码与设计高度一致(92/100)
- 代码质量良好,符合规范(88/100)
- 分层清晰,职责明确
- 测试覆盖率较高(82%)

**待改进**:
- 1个P1问题: 部分异常处理可以更精细
- 建议使用 Java 17 新特性(Record)优化数据类

## 4. 后续建议

### 立即执行
1. 运行完整测试套件: `mvn clean test`
2. 运行集成测试(如有)
3. 启动应用验证功能: `mvn spring-boot:run`

### 代码审查
1. 提交 Pull Request 进行人工代码审查
2. 重点关注业务逻辑正确性
3. 验证异常处理的完整性

### 优化建议
1. 考虑使用 Java 17 Record 类型优化 DTO (P2建议)
2. 补充集成测试用例
3. 完善 API 文档(Swagger/OpenAPI)

### 部署准备
1. 配置生产环境参数
2. 准备数据库迁移脚本
3. 准备部署文档

---

**执行摘要**:
- ✅ 代码生成成功(120个文件, 8,500行代码)
- ✅ 质量审查通过(89/100)
- ✅ 2次迭代优化达标
- ✅ 总耗时: 35 分钟(生成22分钟 + 审查13分钟)

**结论**: 代码质量达到企业级标准,可进入测试和部署阶段。
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 设计文档已完成(至少一项)
- [ ] 项目技术栈已明确
- [ ] 项目代码库已初始化
- [ ] 理解两个 Agent 的协作方式

### 执行中验证(Phase Gates)
- [ ] Phase 1 Gate 通过(准备和验证)
- [ ] Phase 2 Gate 通过(代码生成)
- [ ] Phase 3 Gate 通过(代码审查和优化)
- [ ] Phase 4 Final Gate 通过(报告和验收)

### 最终验证
- [ ] 代码已生成且可编译
- [ ] 综合得分 ≥ 85/100
- [ ] 无 P0 阻塞性问题
- [ ] P1 问题 < 3个
- [ ] 代码符合设计文档要求
- [ ] 代码生成报告已保存
- [ ] 代码审查报告已保存
- [ ] 综合报告已生成
- [ ] 迭代历史已记录
- [ ] 验收状态明确
- [ ] 后续建议清晰

---

## 🎓 最佳实践

### 1. 清晰的协作边界

✅ **好的协作**:
```
code-generator: 
  - 职责: 根据设计生成代码
  - 输入: 设计文档
  - 输出: 代码文件

code-reviewer-supervisor:
  - 职责: 评估质量并驱动优化
  - 输入: 设计文档 + 代码文件
  - 输出: 评估报告 + 优化指令
  - 行动: 调用 code-generator 修复问题
```

❌ **不好的协作**:
```
code-generator 自己评估自己的代码质量
code-reviewer-supervisor 自己修改代码
职责混乱,无法形成有效监督
```

### 2. 精准的问题定位

✅ **好的问题描述**:
```markdown
[P0-代码-设计不一致] UserController.java:45
- 问题: API路径不符合设计
- 设计: POST /api/users/{id}/activate
- 实际: POST /users/activate/{id}
- 修复: 修改 @PostMapping 路径
- 修复代码: @PostMapping("/api/users/{id}/activate")
```

❌ **不好的问题描述**:
```markdown
UserController 的 API 路径有问题,需要修改
```

### 3. 透明的迭代过程

✅ **好的迭代展示**:
```
📈 优化历史:

Iteration 1:
  - 得分: 81/100 (未达标)
  - 问题: 3个P0(代码-设计不一致)
  - 操作: 调用 code-generator 修复
  - 耗时: 8 分钟

Iteration 2:
  - 得分: 89/100 (达标 ✅)
  - 问题: 0个P0, 1个P1
  - 操作: 通过验收
  - 耗时: 5 分钟

总耗时: 13 分钟
```

❌ **不好的迭代展示**:
```
经过几次优化,代码质量已达标
```

### 4. 完整的验收机制

✅ **好的验收**:
```markdown
**验收清单**:
- [x] 代码已生成且可编译
- [x] 综合得分 ≥ 85/100 (实际: 89/100)
- [x] 无 P0 问题 (实际: 0个)
- [x] P1 问题 < 3个 (实际: 1个)

**验收状态**: ✅ 通过

**后续建议**:
1. 运行完整测试: mvn test
2. 提交 PR 进行人工审查
3. 补充集成测试
```

❌ **不好的验收**:
```
代码质量不错,可以使用了
```

---

## 📚 相关资源

### 核心 Agents
- [code-generator Agent](mdc:agents/code-generator.md) - 代码生成 Agent(Routing 模式)
- [code-reviewer-supervisor Agent](mdc:agents/code-reviewer-supervisor.md) - 代码审查监督 Agent(Evaluator-Optimizer 模式)

### 相关技能
- [code-generation 技能](mdc:skills/code-generation/SKILL.md) - 代码生成核心技能
- [cr-java-code 技能](mdc:skills/cr-java-code/SKILL.md) - Java 代码审查技能
- [cr-vue-code 技能](mdc:skills/cr-vue-code/SKILL.md) - Vue 代码审查技能
- [techdesign-03-feature 技能](mdc:skills/techdesign-03-feature/SKILL.md) - 功能设计技能
- [techdesign-06-api 技能](mdc:skills/techdesign-06-api/SKILL.md) - API 设计技能

### 相关 Commands
- [生成代码](mdc:commands/implementation/gen-code.md) - 单独的代码生成 Command(不含审查)
- [生成 Agent](mdc:commands/spec-dev/gen-agent.md) - Agent 生成 Command

### 参考文档
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方最佳实践
- [项目宪章](mdc:.spec-code/memory/constitution.md) - 核心原则
- [开发指南](mdc:.spec-code/memory/guidelines.md) - 开发规范

---

## ❓ 常见问题

### Q: 为什么需要 code-reviewer-supervisor 监督?直接生成代码不行吗?

**A**: 
- **质量保证**: 自动生成的代码可能存在与设计不一致、代码质量问题
- **及时发现问题**: 在开发阶段而非测试阶段发现问题,成本更低
- **设计审查**: 及时发现设计文档矛盾,避免后期返工
- **自动优化**: 通过监督 Agent 驱动自动修复,无需人工逐个检查

### Q: code-reviewer-supervisor 如何监督 code-generator?

**A**: 通过以下机制:

1. **明确的评估标准**: 三维度加权评分(一致性40% + 质量40% + 设计合理性20%)
2. **精准的问题定位**: 问题具体到文件+行号+期望值+实际值+修复建议
3. **智能的优化策略**: 代码问题自动修复,设计问题人工干预
4. **透明的迭代过程**: 记录每次评估和优化,便于审计
5. **防止无限循环**: 最大迭代5次,设计问题暂停等待

### Q: 如何让 code-generator 更好地写代码?

**A**: 

**从 code-generator 自身改进**:
1. 完整读取设计文档(避免只读前100行)
2. 按依赖关系分层生成(Entity → Mapper → Service → Controller)
3. 生成后自动编译和测试验证
4. 记录常见问题,避免重复错误

**从 code-reviewer-supervisor 监督改进**:
1. 提供精准的修复指令(文件+行号+修复代码)
2. 分级修复(先P0后P1最后P2)
3. 给出明确的期望值和实际值对比
4. 提供可执行的修复建议

**从协作流程改进**:
1. 迭代优化而非一次性生成
2. 及时反馈问题,快速修复
3. 记录优化历史,积累经验

### Q: 如果迭代5次仍不达标怎么办?

**A**: 
1. **检查设计文档**: 很可能是设计文档内部矛盾,code-reviewer-supervisor 会提出建议
2. **人工介入**: 查看迭代历史,分析问题根源
3. **调整质量标准**: 如果标准过高(如 >90),可适当降低阈值
4. **分批处理**: 先解决核心问题,非核心问题记录为P2后续优化

### Q: 如何处理设计文档矛盾?

**A**: code-reviewer-supervisor 会:

1. **检测矛盾**: 评估设计合理性维度时自动检测内部矛盾
2. **具体定位**: 指出矛盾的具体位置(如 API设计:L45 vs 数据库设计:L23)
3. **提供建议**: 给出2-3个修改方案(推荐方案+备选方案)
4. **暂停等待**: 暂停执行,等待用户修改设计文档
5. **重新执行**: 用户修改后,重新调用 code-generator 生成代码

### Q: 这个 Command 的执行成本如何?

**A**: 

**时间成本**:
- 小型项目(50-100个文件): 25-35 分钟
- 中型项目(100-200个文件): 35-50 分钟
- 大型项目(200+个文件): 50-90 分钟

**迭代成本**:
- 平均迭代次数: 1-2 次
- 每次迭代耗时: 5-10 分钟

**总体评估**:
- 相比人工编写,节省 80-90% 时间
- 相比单纯生成(不审查),多 20-30% 时间,但质量提升 40-60%

---

## 📖 完整示例

### 示例 1: Spring Boot 项目标准流程

```bash
# 用户执行
/gen-code-with-review workspace/2025-11-21-user-management spring-boot

# Agent 执行流程
[Phase 1] 准备和验证
  ✅ 检测到设计文档: feature-design.md, api-design.md, database-design.md
  ✅ 识别技术栈: Spring Boot 3
  ✅ 执行计划已确认

[Phase 2] 调用 code-generator 生成代码
  [code-generator] 识别设计类型: 综合设计
  [code-generator] 选择策略: spring-boot-full
  [code-generator] 分层生成:
    - Entity ✅ (20个)
    - Mapper ✅ (15个)
    - Service ✅ (18个)
    - Controller ✅ (12个)
    - DTO ✅ (25个)
    - 测试 ✅ (30个)
  [code-generator] 验证: 编译通过 ✅
  
  ✅ 代码生成完成! 总计 120 个文件

[Phase 3] 调用 code-reviewer-supervisor 审查代码
  [Iteration 1]
    [评估] 综合得分: 81/100 (未达标)
    [问题] 3个P0 - 代码-设计不一致
    [决策] 调用 code-generator 修复
    [修复] 正在修复 3 个问题...
    [完成] 修复完成
  
  [Iteration 2]
    [评估] 综合得分: 89/100 (达标 ✅)
    [问题] 0个P0, 1个P1
    [结果] 验收通过!

[Phase 4] 生成最终报告
  ✅ 综合报告: workspace/2025-11-21-user-management/code-generation-review-report.md
  
🎉 完成!
- 综合得分: 89/100 ✅
- 总耗时: 35 分钟
- 验收状态: 通过
```

### 示例 2: Vue 项目优化流程

```bash
/gen-code-with-review workspace/2025-11-21-product-catalog vue

# 执行流程(简化版)
[Phase 1] ✅ 设计文档完整, Vue 3 项目
[Phase 2] ✅ 生成 85 个 Vue 组件和服务
[Phase 3] 
  [Iteration 1] 得分 78 → 发现 P0 问题 → 修复
  [Iteration 2] 得分 86 ✅ → 通过
[Phase 4] ✅ 报告已生成

总耗时: 28 分钟
```

### 示例 3: 设计问题场景

```bash
/gen-code-with-review workspace/2025-11-21-order-system spring-boot

[Phase 1-2] ✅ 设计文档完整, 代码已生成

[Phase 3] 
  [Iteration 1] 得分 75 → P0问题: 代码-设计不一致 → 修复
  [Iteration 2] 得分 76 → 仍不达标
  [诊断] 发现设计文档矛盾:
    - API设计: 订单ID为String
    - 数据库设计: 订单ID为Long
  
  [建议] 统一订单ID类型:
    1. 推荐: 统一使用Long (性能好)
    2. 备选: 统一使用String UUID (分布式友好)
  
  ⏸️ 暂停执行, 等待用户修改设计文档

[用户修改设计后重新执行]
  [Iteration 3] 得分 88 ✅ → 通过!

总耗时: 42 分钟(含等待用户修改 15 分钟)
```

---

**版本**: 1.0.0  
**最后更新**: 2025-11-21  
**维护者**: Spec-Code Team  
**反馈**: 请通过Issue或PR提供反馈
