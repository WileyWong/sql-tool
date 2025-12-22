---
command_id: spec-dev.gen-agent
command_name: 生成 Agent
category: spec-dev
description: 基于 Anthropic 最佳实践创建高质量的 AI Agent 系统。支持 6 种 Agentic 模式选择，包含完整的工具设计、流程编排和质量验证。
allowed-tools: read_file, write_to_file
argument-hint: <agent-name> [agent-type]
estimated_time: 30-45 minutes
workflow_type: sequential
dependencies: [gen-agent]
---

# Command: 生成 Agent

> ⚠️ **必须遵守**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Agent 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `agents/{agent-name}.md`
> - 文件格式: Markdown + YAML Frontmatter
> - 命名规范: 小写字母 + 连字符 + `.md`

---

## 🎯 用途

调用 `gen-agent` 技能，基于 Anthropic 官方最佳实践创建符合规范的 AI Agent 系统。该 Command 是对 `gen-agent` 技能的薄包装，确保生成的 Agent 遵循三大核心原则：**简洁性、透明性、精心设计的 ACI**。

**适用场景**:
- 创建新的 AI Agent（客服、代码审查、文档生成等）
- 设计 Agentic Workflow（Routing、Parallelization、Orchestrator-Workers等）
- 实现自主 Agent（SWE-bench、计算机使用等）

**核心参考**:
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方最佳实践
- [gen-agent Skill](mdc:skills/gen-agent/SKILL.md) - Agent 生成技能

---

## 📋 前置条件

在执行此Command前，请确保：

- [ ] 明确 Agent 的核心任务和目标
- [ ] 确定是否真的需要 Agent（而非 Workflow 或单次 LLM 调用）
- [ ] 准备好任务相关的上下文（如业务规则、API文档等）
- [ ] 了解 6 种 Agentic 模式的适用场景

---

## 💡 参数传递

本Command支持以下参数:

### 全部参数捕获
```bash
/gen-agent customer-service routing "处理客户查询并分流到专门处理流程"
# 参数: agent-name=customer-service, agent-type=routing, description="处理客户查询并分流到专门处理流程"
```

### 位置参数
- `$1` - Agent 名称（小写字母+连字符，如 `customer-service`）
- `$2` - Agent 类型（可选，如 `routing`、`autonomous`、`evaluator-optimizer`）
- `$3` - Agent 简介（可选，1句话描述功能）

**如果参数不完整，交互式询问**：

```markdown
请提供以下信息：

1. **Agent 名称**: [英文，小写字母+连字符，最长64字符]
   示例: customer-service, code-reviewer, doc-generator

2. **Agent 核心任务**: [描述 Agent 要解决的问题]
   示例: "处理客户查询并自动分流到退款、技术支持、一般咨询等专门流程"

3. **预期 Agentic 模式**: [可选，如果不确定可留空]
   - Prompt Chaining（提示链）
   - Routing（路由）
   - Parallelization（并行化）
   - Orchestrator-Workers（编排-工作者）
   - Evaluator-Optimizer（评估-优化）
   - Autonomous Agent（自主代理）
```

---

## 🔄 执行流程

### Phase 1: 需求分析与模式选择

**Objective**: 明确 Agent 需求，选择合适的 Agentic 模式

**MANDATORY STEPS**:

1. **MUST** 调用 `gen-agent` 技能的步骤 1 - 明确需求和选择架构模式
   - **Action**: 让 `gen-agent` 技能分析用户需求
   - **Input**: 用户提供的 Agent 任务描述
   - **Output**: 需求分析报告，包含：
     - 是否需要 Agent（vs Workflow vs 单次调用）
     - 推荐的 Agentic 模式
     - 复杂度评估
   - **Verification**:
     - [ ] 明确了任务是否需要 Agent
     - [ ] 给出了清晰的理由
     - [ ] 如果不需要 Agent，提供了替代方案

**让我们一步步思考** 这个任务是否真的需要 Agent，还是用 Workflow 就足够了...

**🚪 Phase Gate 1**:
- [ ] 确认任务需要 Agent（或接受了 Workflow 方案）
- [ ] 选择了合适的 Agentic 模式
- [ ] 用户理解并同意选择的模式

**Cannot proceed to Phase 2 without all checks passing.**

---

### Phase 2: 工具设计（ACI设计）

**Objective**: 设计 Agent 需要的工具和接口（Agent-Computer Interface）

**MANDATORY STEPS**:

1. **MUST** 调用 `gen-agent` 技能的步骤 3 - 设计 ACI（工具和文档）
   - **Action**: 让 `gen-agent` 技能设计工具接口
   - **Input**: Phase 1 选择的 Agentic 模式
   - **Output**: 工具清单和设计文档，包含：
     - 工具列表（每个工具的名称、描述、参数）
     - 工具文档（清晰的 docstring 风格）
     - 避免格式开销的设计（如精确行数、字符串转义）
   - **Verification**:
     - [ ] 每个工具都有清晰的文档
     - [ ] 工具设计遵循 ACI 最佳实践
     - [ ] 避免了不必要的格式复杂度

**🚪 Phase Gate 2**:
- [ ] 工具设计符合 ACI 原则（清晰、自然、无格式开销）
- [ ] 工具文档完整且易懂
- [ ] 工具边界清晰，职责单一

**Cannot proceed to Phase 3 without all checks passing.**

---

### Phase 3: 主循环和流程设计

**Objective**: 设计 Agent 的主循环和执行流程

**MANDATORY STEPS**:

1. **MUST** 调用 `gen-agent` 技能的步骤 4 - 设计主循环
   - **Action**: 让 `gen-agent` 技能设计 Agent 主循环
   - **Input**: Phase 2 的工具设计
   - **Output**: 主循环设计文档，包含：
     - 初始化步骤
     - 循环逻辑（输入 → 决策 → 工具调用 → 反馈 → 下一步）
     - 人工检查点（Human-in-the-Loop）
     - 终止条件
   - **Verification**:
     - [ ] 循环逻辑清晰
     - [ ] 包含合适的人工检查点
     - [ ] 定义了明确的终止条件
     - [ ] 包含错误处理机制

2. **MUST** 确保透明性 - 明确展示规划步骤
   - **Action**: 在主循环中添加中间输出和日志
   - **Verification**:
     - [ ] Agent 的每一步决策都有日志
     - [ ] 用户可以理解 Agent 的思考过程
     - [ ] 关键决策点有明确标记

**🚪 Phase Gate 3**:
- [ ] 主循环设计完整
- [ ] 包含人工检查点
- [ ] 透明性足够（可追踪决策过程）
- [ ] 终止条件合理

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: Agent 实现和测试

**Objective**: 生成 Agent 文件并验证质量

**MUST USE TEMPLATE**: Agent 模板由 `gen-agent` 技能内部处理

**MANDATORY STEPS**:

1. **MUST** 调用 `gen-agent` 技能的步骤 5 - 实现和测试
   - **Action**: 让 `gen-agent` 技能生成 Agent 文档
   - **Output**: `agents/{agent-name}.md` 文件，包含：
     - YAML Frontmatter（name, description, tools）
     - 使用示例（examples）
     - 主循环逻辑
     - 工具列表和文档
   - **Verification**:
     - [ ] 文件生成在正确位置
     - [ ] YAML Frontmatter 完整
     - [ ] 工具文档清晰
     - [ ] 包含使用示例

2. **MUST** 调用 `gen-agent` 技能的步骤 6 - 添加防护和监控
   - **Action**: 让 `gen-agent` 技能添加防护机制
   - **Output**: 防护和监控设计，包含：
     - 沙箱环境配置
     - 成本控制（最大迭代次数、token 限制）
     - 错误处理和降级策略
     - 监控指标
   - **Verification**:
     - [ ] 包含沙箱环境说明
     - [ ] 定义了成本控制策略
     - [ ] 包含错误处理机制
     - [ ] 定义了监控指标

**🚪 Phase Gate 4**:
- [ ] Agent 文件已生成
- [ ] 文件位置正确（`agents/{agent-name}.md`）
- [ ] 包含所有必需部分
- [ ] 防护机制完整

**Cannot proceed to Phase 5 without all checks passing.**

---

### Phase 5: 质量验证（多层次）

**Objective**: 全面验证 Agent 质量

**Quality Gates - MUST PASS ALL**:

#### Gate 1: 三大核心原则
- [ ] **简洁性**: Agent 设计简洁，未过度复杂
- [ ] **透明性**: Agent 决策过程清晰可追踪
- [ ] **精心设计的 ACI**: 工具文档清晰，无格式开销

#### Gate 2: 结构完整性
- [ ] YAML Frontmatter 包含所有必填字段（name, description）
- [ ] 包含使用示例（examples）
- [ ] 主循环逻辑完整
- [ ] 工具列表和文档完整
- [ ] 包含防护机制说明

#### Gate 3: 符合最佳实践
- [ ] 遵循 [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) 最佳实践
- [ ] Agentic 模式选择合理
- [ ] 工具设计符合 ACI 原则
- [ ] 包含人工检查点（如适用）
- [ ] 成本控制合理

#### Gate 4: 可测试性和可维护性
- [ ] 包含清晰的使用示例
- [ ] 终止条件明确
- [ ] 错误处理完善
- [ ] 监控指标定义清晰
- [ ] 文档清晰易懂

**🚪 Final Gate**:
- [ ] 所有 Quality Gates 通过
- [ ] 用户满意 Agent 设计
- [ ] 无明显缺陷或遗漏

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ **任务过于简单** - 不需要 Agent，单次 LLM 调用或 Workflow 就足够
- ❌ **目标模糊** - 无法明确 Agent 的成功标准
- ❌ **工具设计复杂** - 工具需要复杂的格式处理（如精确行数、字符串转义）
- ❌ **无法定义终止条件** - Agent 可能无限循环
- ❌ **成本不可控** - 无法预估或限制 Agent 的成本
- ❌ **安全风险** - Agent 需要在不受信任的环境中运行，但缺少防护

**Action**: 
- 如遇 Red Flags，与用户沟通并重新设计
- 考虑简化方案（Workflow 或单次调用）
- 加强防护机制或限制 Agent 范围

---

## 📝 输出格式

### 文件位置
```
agents/{agent-name}.md
```

### 文件头部 (YAML Frontmatter)

```yaml
---
name: agent-name                          # Agent 名称（小写字母+连字符）
description: Agent 简要描述                # 1-2句话，说明功能和适用场景
---
```

### 文件内容示例

参考 `agents/doc-knowledge-extractor.md` 查看完整示例：

```markdown
---
name: customer-service
description: 处理客户查询并自动分流到退款、技术支持、一般咨询等专门处理流程。基于 Routing 模式实现。
---

示例：
- <example>
场景：用户发起客服咨询。
user: "我的订单还没发货，想申请退款"
assistant: "我将使用 Routing 模式分析你的查询类型，并调用退款处理流程。"
<commentary>
这是退款请求，应路由到退款处理流程。
</commentary>
</example>

tool: *
---

你是一位客服 Agent，专注于处理客户查询并分流到专门处理流程。

## 🎯 核心使命

**当用户提出以下需求时，执行相应流程**:
- 退款请求 → 调用退款处理流程
- 技术支持 → 调用技术支持流程
- 一般咨询 → 调用一般咨询流程

## 🔄 执行流程

### 1. 分类客户查询

**触发词检测**:
- 退款、取消订单、不满意 → 退款流程
- 无法使用、报错、bug → 技术支持流程
- 其他 → 一般咨询流程

### 2. 调用专门处理流程

**路由逻辑**:
```
if 退款请求:
    调用退款处理工具
elif 技术支持:
    调用技术支持工具
else:
    调用一般咨询工具
```

### 3. 人工检查点

**关键决策点**:
- 退款金额 > 1000 元时，暂停并请求人工审批
- 技术问题无法解决时，升级到人工客服

## 💡 核心原则

### 原则 1: 准确分类
- 使用 LLM 分析客户查询意图
- 识别查询类型（退款/技术/一般）

### 原则 2: 透明处理
- 告知用户查询被分类为哪种类型
- 说明将要采取的处理流程

### 原则 3: 人工协作
- 在关键决策点暂停并请求人工审批
- 无法处理时升级到人工客服

## 🛠️ 工具列表

### 工具 1: classify_query
**描述**: 分类客户查询类型
**参数**:
- query (string): 客户查询文本
**返回**: query_type (string): "refund" | "technical" | "general"

### 工具 2: process_refund
**描述**: 处理退款请求
**参数**:
- order_id (string): 订单ID
- reason (string): 退款原因
**返回**: refund_status (string): "approved" | "pending_approval" | "rejected"

...
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 前置条件已满足
- [ ] 明确了 Agent 的核心任务
- [ ] 准备好相关上下文信息

### 执行中验证（Phase Gates）
- [ ] Phase 1 Gate通过（需求分析与模式选择）
- [ ] Phase 2 Gate通过（工具设计）
- [ ] Phase 3 Gate通过（主循环和流程设计）
- [ ] Phase 4 Gate通过（Agent 实现和测试）
- [ ] Phase 5 Gate通过（质量验证）

### 最终验证
- [ ] Agent 文件已生成（`agents/{agent-name}.md`）
- [ ] 文件位置正确
- [ ] YAML Frontmatter 完整
- [ ] 包含使用示例
- [ ] 主循环逻辑完整
- [ ] 工具列表和文档完整
- [ ] 包含防护机制说明
- [ ] 遵循三大核心原则（简洁性、透明性、精心设计的 ACI）
- [ ] 符合 Anthropic 最佳实践
- [ ] 无明显缺陷或遗漏

---

## 🎓 最佳实践

### 1. 清晰的目标定义

✅ **好的目标**:
```
处理客户查询并自动分流到退款、技术支持、一般咨询等专门处理流程。
使用 Routing 模式，在关键决策点暂停并请求人工审批。
```

❌ **不好的目标**:
```
做一个客服 Agent
```

### 2. 选择合适的 Agentic 模式

✅ **好的选择**:
```markdown
**任务**: 处理客户查询并分流
**模式**: Routing
**理由**: 
- 查询类型有明确分类（退款/技术/一般）
- 每种类型需要专门处理流程
- 可以用 LLM 准确分类
```

❌ **不好的选择**:
```markdown
**任务**: 处理客户查询
**模式**: Autonomous Agent
**理由**: 让 Agent 自己决定怎么处理
```

### 3. 工具设计遵循 ACI 原则

✅ **好的工具文档**:
```python
def process_refund(order_id: str, reason: str) -> dict:
    """
    处理退款请求。
    
    参数:
        order_id: 订单ID（格式: ORD-XXXXXXXX）
        reason: 退款原因（自然语言描述）
    
    返回:
        {
            "status": "approved" | "pending_approval" | "rejected",
            "message": "详细说明"
        }
    
    注意:
        - 金额 > 1000 元时返回 "pending_approval"
        - 订单已发货超过7天时返回 "rejected"
    """
```

❌ **不好的工具文档**:
```python
def process_refund(data: str) -> str:
    """
    处理退款。
    
    参数:
        data: JSON字符串，格式为 {"order_id": "...", "reason": "...", "line_count": 42}
    
    返回:
        状态码（1=成功, 2=待审批, 3=拒绝），格式: "STATUS:1|MSG:..."
    """
```

### 4. 透明性 - 展示决策过程

✅ **好的透明性**:
```markdown
## 执行日志

1. [分类] 分析客户查询: "我的订单还没发货，想申请退款"
2. [决策] 识别为退款请求（关键词: "退款"）
3. [路由] 调用退款处理流程
4. [工具] 调用 process_refund(order_id="ORD-12345678", reason="未发货")
5. [结果] 退款状态: "approved"
6. [输出] 已批准退款，预计3-5个工作日到账
```

❌ **不好的透明性**:
```markdown
处理完成。退款已批准。
```

### 5. 薄包装原则

✅ **好的 Command（薄包装）**:
```markdown
**MUST** 调用 `gen-agent` 技能的步骤 1 - 明确需求和选择架构模式
**MUST** 调用 `gen-agent` 技能的步骤 3 - 设计 ACI
**MUST** 调用 `gen-agent` 技能的步骤 5 - 实现和测试
```

❌ **不好的 Command（包含实现细节）**:
```markdown
分析用户需求，判断是否需要 Agent：
1. 询问任务类型
2. 评估复杂度
3. 列出适用场景
4. 给出建议
...（重复技能内容）
```

---

## 📚 相关资源

### 核心参考
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方最佳实践
- [gen-agent Skill](mdc:skills/gen-agent/SKILL.md) - Agent 生成技能（本 Command 调用的技能）
- [gen-agent Examples](mdc:skills/gen-agent/examples.md) - Agent 实际案例
- [gen-agent Checklist](mdc:skills/gen-agent/checklist.md) - Agent 验证清单

### 相关 Commands
- [生成 Skill](mdc:commands/spec-dev/gen-skill.md) - 生成 Skill 文档
- [生成 Command](mdc:commands/spec-dev/gen-command.md) - 生成 Command 文档

### 参考 Agent
- [doc-knowledge-extractor](mdc:agents/doc-knowledge-extractor.md) - 文档知识提取 Agent 示例

### 验证脚本
- `scripts/validate-agent.sh` - Agent 验证脚本（如有）

---

## ❓ 常见问题

### Q: 什么时候应该用 Agent，什么时候用 Workflow？

**A**: 
- **Agent**: 开放式任务，步骤数不可预测，需要模型动态决策
  - 示例: SWE-bench 代码修复（不知道要改几个文件）
- **Workflow**: 任务可分解为固定步骤，流程可预测
  - 示例: 生成营销文案 → 翻译（固定2步）

**判断标准**:
- 能否提前列出所有步骤？能 → Workflow，不能 → Agent
- 是否需要模型根据中间结果决定下一步？需要 → Agent，不需要 → Workflow

### Q: 如何选择 6 种 Agentic 模式？

**A**: 参考 [gen-agent Skill](mdc:skills/gen-agent/SKILL.md) 步骤 2 的模式选择指南：

| 关键问题 | 模式 |
|---------|------|
| 任务可分解为固定步骤序列？ | Prompt Chaining |
| 输入有明确分类，需要专门处理？ | Routing |
| 子任务可并行或需要多视角？ | Parallelization |
| 子任务不可预测，需动态分配？ | Orchestrator-Workers |
| 有明确评估标准，需迭代改进？ | Evaluator-Optimizer |
| 完全开放式，步骤数不确定？ | Autonomous Agent |

### Q: 什么是 ACI（Agent-Computer Interface）？

**A**: ACI 是 Agent 与工具/环境交互的接口。好的 ACI 设计应该：
- **清晰**: 像优秀的 docstring 一样清晰
- **自然**: 使用模型熟悉的格式（如自然语言、标准 JSON）
- **无格式开销**: 避免复杂格式（如精确行数、字符串转义）
- **给模型空间**: 给足够的 tokens 让模型"思考"

**示例**:
```python
# ✅ 好的 ACI
def search_code(query: str, file_pattern: str = "*") -> List[dict]:
    """
    在代码库中搜索指定内容。
    
    参数:
        query: 搜索关键词（支持正则表达式）
        file_pattern: 文件模式（如 "*.py"），默认搜索所有文件
    
    返回:
        匹配结果列表，每项包含:
        - file: 文件路径
        - line: 行号
        - content: 匹配行内容
    """

# ❌ 不好的 ACI
def search_code(data: str) -> str:
    """
    搜索代码。
    
    参数:
        data: JSON字符串，格式: {"q":"关键词","fp":"文件模式","lc":true}
              lc=true表示返回精确行数
    
    返回:
        格式化字符串: "FILE:path|LINE:42|CONTENT:escaped\\ntext"
    """
```

### Q: 如何控制 Agent 的成本？

**A**: 
1. **最大迭代次数**: 限制 Agent 的循环次数（如最多10次）
2. **Token 限制**: 限制每次调用的 token 数
3. **人工检查点**: 在关键决策点暂停，请求人工审批
4. **终止条件**: 明确定义何时停止（如任务完成、遇到错误、超时）
5. **沙箱环境**: 在受限环境中测试，避免意外成本

**示例**:
```markdown
## 成本控制

- **最大迭代次数**: 10次
- **Token 限制**: 每次最多4000 tokens
- **人工检查点**: 
  - 修改代码前确认
  - 成本超过预算时暂停
- **终止条件**:
  - 任务完成（所有测试通过）
  - 达到最大迭代次数
  - 用户手动停止
```

### Q: 如何确保 Agent 的安全性？

**A**: 
1. **沙箱环境**: 在隔离环境中运行（Docker、虚拟机）
2. **权限限制**: 限制 Agent 可访问的资源
3. **输入验证**: 验证用户输入，防止注入攻击
4. **输出过滤**: 过滤敏感信息（如密码、API密钥）
5. **审计日志**: 记录所有 Agent 操作，便于审计

**示例**:
```markdown
## 安全防护

- **沙箱环境**: Docker容器，隔离文件系统
- **权限限制**: 只读访问代码，写入权限需人工审批
- **输入验证**: 拒绝包含SQL注入、命令注入的输入
- **输出过滤**: 自动过滤 API密钥、密码等敏感信息
- **审计日志**: 记录所有工具调用和决策过程
```

---

## 📖 完整示例

参考 `agents/doc-knowledge-extractor.md` 查看完整的 Agent 实现示例。

---

**版本**: 1.0.0  
**最后更新**: 2025-11-21  
**维护者**: Spec-Code Team  
**反馈**: 请通过Issue或PR提供反馈
