# Skill: gen-agent

基于 Anthropic 官方最佳实践,设计和生成高质量的 AI Agent 系统。

## 📚 核心参考文档

本技能完全基于以下最佳实践文档:
- **[Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md)** - Anthropic 官方 Agent 构建指南
  - 包含 Workflows vs Agents 的架构区分
  - 6 种常见的 Agentic 模式 (Prompt Chaining、Routing、Parallelization、Orchestrator-Workers、Evaluator-Optimizer、Autonomous Agents)
  - 工具设计的最佳实践 (Agent-Computer Interface)
  - 真实应用场景 (客服、编程)

**重要提示**: 生成 Agent 时**必须使用中文**!

## 🎯 核心原则

根据 Anthropic 最佳实践,遵循以下三大原则:

### 1. 简洁性 (Simplicity)
- 从最简单的解决方案开始
- 只在需要时增加复杂度
- 优先使用单次 LLM 调用 + 检索 + 示例
- 只有当简单方案不足时才引入 Agentic 系统

### 2. 透明性 (Transparency)  
- 明确展示 Agent 的规划步骤
- 让用户理解 Agent 的决策过程
- 提供清晰的中间输出和日志

### 3. 精心设计的 ACI (Agent-Computer Interface)
- 工具定义要像编写优秀的 docstring 一样清晰
- 避免格式开销 (如精确的行数计数、字符串转义)
- 给模型足够的 tokens "思考"
- 使用模型熟悉的自然格式

## 🔄 执行步骤

### 步骤 1: 明确需求和选择架构模式

**操作**: 询问用户 Agent 的核心需求,判断是否真的需要 Agent

**关键问题**:
1. **任务类型**: 
   - 固定流程任务 → 考虑 Workflow
   - 动态决策任务 → 考虑 Agent
   - 简单任务 → 可能只需要单次 LLM 调用

2. **复杂度权衡**:
   - Agent 会增加延迟和成本
   - 是否值得用更高成本换取更好性能?
   - 能否用 Workflow 实现?

3. **适用场景判断** (参考最佳实践文档):
   - ✅ 开放式问题,难以预测步骤数
   - ✅ 不能硬编码固定路径
   - ✅ 需要模型动态决策
   - ✅ 在可信环境中扩展任务
   - ❌ 可以分解为固定子任务
   - ❌ 需要完全可预测的行为

**输出示例**:
```markdown
## 需求分析

**任务**: [描述任务]
**适合模式**: [Agent/Workflow/Single LLM Call]
**理由**: [为什么选择这个模式]

如果选择 Agent:
- 开放式程度: [高/中/低]
- 预期步骤数: [范围]
- 决策复杂度: [描述]
```

### 步骤 2: 选择具体的 Agentic 模式

**操作**: 根据任务特点,从 6 种模式中选择最合适的

**模式选择指南** (详见 [BuildingEffectiveAgents.md](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md)):

| 模式 | 适用场景 | 示例 |
|------|---------|------|
| **Prompt Chaining** | 任务可分解为固定步骤序列 | 生成营销文案 → 翻译 |
| **Routing** | 输入有明确分类,需要专门处理 | 客服查询分流 (一般/退款/技术) |
| **Parallelization** | 子任务可并行或需要多视角 | 代码安全审查 (多个角度并行) |
| **Orchestrator-Workers** | 子任务不可预测,需动态分配 | 代码修改 (不知道改几个文件) |
| **Evaluator-Optimizer** | 有明确评估标准,迭代改进 | 文学翻译 (评估 → 改进循环) |
| **Autonomous Agent** | 完全开放式,步骤数不确定 | SWE-bench 代码修复、计算机使用 |

**决策流程图**:
```
开始
  ↓
任务可分解为固定步骤? 
  ↓ 是             ↓ 否
Prompt Chaining    有明确分类?
                     ↓ 是         ↓ 否
                   Routing      需要并行处理?
                                  ↓ 是          ↓ 否
                               Parallelization  子任务可预测?
                                                  ↓ 是              ↓ 否
                                               Evaluator-Optimizer  Autonomous Agent
                                                (如有迭代需求)
                                                                     ↓
                                                                  需要动态分配?
                                                                     ↓ 是
                                                                  Orchestrator-Workers
```

**输出示例**:
```markdown
## 选定模式

**模式**: [模式名称]
**理由**: [为什么选择这个模式]
**关键特征**: 
- [特征 1]
- [特征 2]
```

### 步骤 3: 设计工具集 (Tools)

**操作**: 根据 ACI 最佳实践设计清晰、易用的工具

**工具设计原则** (详见最佳实践文档 Appendix 2):

1. **降低格式开销**:
   - ❌ 避免: 需要精确计数 (如 diff 的行数)
   - ❌ 避免: 需要字符串转义 (JSON 中写代码)
   - ✅ 推荐: 简单、自然的格式

2. **给模型思考空间**:
   - 工具参数设计要让模型有"思考"的 tokens
   - 避免让模型"写入死角"

3. **清晰的文档**:
   - 工具名称和参数描述要像给初级开发者写 docstring
   - 包含使用示例、边界条件、输入格式要求
   - 明确与其他工具的边界

4. **防错设计 (Poka-yoke)**:
   - 改变参数设计让错误更难发生
   - 示例: 要求绝对路径而非相对路径

**工具设计模板**:
```python
{
  "name": "tool_name",
  "description": """
  [清晰的一句话描述]
  
  使用场景:
  - [场景 1]
  - [场景 2]
  
  注意事项:
  - [注意事项 1]
  - [注意事项 2]
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "[详细描述，包含示例和格式要求]"
      }
    },
    "required": ["param1"]
  }
}
```

**测试工具设计**:
- 在 Anthropic Console Workbench 运行多个示例
- 观察模型的错误使用方式
- 迭代优化工具定义

### 步骤 4: 设计主循环和控制流

**操作**: 设计 Agent 的核心循环,包含中止条件和检查点

**Agent 循环设计** (详见最佳实践文档):

```python
# 伪代码示例
def agent_loop(task, max_iterations=10):
    """
    Agent 主循环
    
    关键要素:
    1. 从环境获取"真实依据" (ground truth)
    2. 在检查点暂停获取人工反馈
    3. 包含中止条件 (最大迭代次数、目标达成、遇到阻塞)
    """
    
    iteration = 0
    while iteration < max_iterations:
        # 1. LLM 决策和工具调用
        action = llm.decide_next_action(task, context)
        
        # 2. 执行工具并获取真实反馈
        result = execute_tool(action)
        
        # 3. 评估进度
        if is_task_complete(result):
            return result
        
        # 4. 检查点: 需要人工判断?
        if needs_human_input(result):
            human_feedback = request_human_input()
            context.update(human_feedback)
        
        # 5. 遇到阻塞?
        if is_blocked(result):
            return handle_blocker(result)
        
        iteration += 1
    
    # 6. 达到最大迭代次数
    return handle_max_iterations()
```

**关键设计点**:
1. **环境反馈**: 每步都从环境获取真实结果 (工具调用结果、代码执行)
2. **检查点**: 在关键节点暂停,让人工介入
3. **中止条件**: 
   - 任务完成
   - 达到最大迭代次数
   - 遇到无法解决的阻塞
4. **沙箱测试**: 在受控环境中充分测试

### 步骤 5: 实现和测试

**操作**: 实现 Agent,并进行充分测试

**实现建议**:

1. **框架选择** (详见最佳实践文档):
   - 建议先直接使用 LLM API
   - 理解底层逻辑后再考虑框架 (LangGraph、Amazon Bedrock、Rivet、Vellum)
   - 框架的抽象层可能隐藏细节,难以调试

2. **分阶段实现**:
   - 阶段 1: 核心循环 (无工具)
   - 阶段 2: 添加 1-2 个核心工具
   - 阶段 3: 完整工具集
   - 阶段 4: 优化和防护栏

3. **测试策略**:
   - 沙箱环境测试 (避免影响生产)
   - 边界条件测试 (最大迭代、工具失败)
   - 错误累积测试 (Agent 的自主性可能导致错误累积)
   - 成本监控 (Agent 成本较高)

**输出示例**:
```python
# 生成完整的 Agent 实现代码
# 包含:
# - 主循环
# - 工具定义
# - 检查点设计
# - 日志和可观测性
# - 错误处理
```

### 步骤 6: 添加防护栏和监控

**操作**: 确保 Agent 安全可控

**防护措施**:

1. **成本控制**:
   - 设置最大 token 使用量
   - 设置最大 API 调用次数
   - 监控单次运行成本

2. **安全防护**:
   - 沙箱执行环境
   - 工具权限限制
   - 敏感操作需人工确认

3. **可观测性**:
   - 详细的步骤日志
   - 工具调用追踪
   - 决策过程记录

4. **错误处理**:
   - 工具调用失败的重试机制
   - 错误累积的检测和中止
   - 清晰的错误信息返回

**监控仪表板示例**:
```markdown
## Agent 运行监控

### 当前状态
- 迭代次数: 3/10
- 工具调用: 5 次
- Token 使用: 1,234 / 10,000
- 成本: $0.05

### 步骤历史
1. [决策] 分析问题 → [工具] read_file → [结果] 成功
2. [决策] 修改代码 → [工具] write_file → [结果] 成功
3. [决策] 运行测试 → [工具] run_tests → [结果] 1 个失败
4. [检查点] 需要人工判断测试失败原因
```

## ✅ 验证清单

### 架构设计
- [ ] 明确了任务类型 (Agent vs Workflow vs Single LLM)
- [ ] 选择了合适的 Agentic 模式
- [ ] 有清晰的成功标准和失败处理
- [ ] 设计了合理的检查点和中止条件

### 工具设计 (ACI)
- [ ] 工具名称和描述清晰易懂
- [ ] 避免了格式开销 (精确计数、字符串转义)
- [ ] 包含了使用示例和边界条件说明
- [ ] 在 Workbench 中测试了工具使用
- [ ] 应用了防错设计 (Poka-yoke)

### 实现质量
- [ ] 主循环包含环境反馈和检查点
- [ ] 有明确的中止条件 (最大迭代、任务完成、阻塞)
- [ ] 实现了详细的日志和可观测性
- [ ] 在沙箱环境中充分测试

### 防护和监控
- [ ] 设置了成本上限和资源限制
- [ ] 实现了安全防护 (沙箱、权限限制)
- [ ] 有错误处理和重试机制
- [ ] 监控了成本、性能和错误率

### 三大核心原则
- [ ] **简洁性**: 从最简单方案开始,逐步增加复杂度
- [ ] **透明性**: 清晰展示决策步骤和中间结果
- [ ] **ACI 质量**: 工具设计精心打磨,像优秀的 docstring

## 📖 深入学习

1. **完整阅读**: [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md)
2. **Anthropic Cookbook**: [Agent Patterns](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents)
3. **案例研究**: 
   - SWE-bench Agent (代码修复)
   - Computer Use Agent (计算机操作)
   - Customer Support Agent (客服)

## 💡 常见陷阱

1. **过度复杂化**:
   - ❌ 一开始就用 Autonomous Agent
   - ✅ 先尝试 Prompt Chaining 或 Routing

2. **工具设计不当**:
   - ❌ 工具文档简陋,模型不会正确使用
   - ✅ 花时间优化工具定义,测试边界情况

3. **缺乏防护**:
   - ❌ 没有成本上限,Agent 可能无限运行
   - ✅ 设置最大迭代次数和成本限制

4. **不测试错误累积**:
   - ❌ 只测试理想场景
   - ✅ 测试工具失败、错误决策的累积效应

## 🔗 相关技能

- [design-architect](mdc:skills/design-architect/SKILL.md) - 系统架构设计
- [design-api](mdc:skills/design-api/SKILL.md) - API 设计
- [code-generation](mdc:skills/code-generation/SKILL.md) - 代码生成

## 📝 版本历史

- **v1.0** (2025-11-21): 初始版本
  - 基于 Anthropic Building Effective Agents 最佳实践
  - 涵盖 6 种 Agentic 模式
  - 包含完整的 ACI 设计指南
  - 提供防护和监控建议
