# gen-agent - AI Agent 生成技能

基于 Anthropic 官方最佳实践,设计和生成高质量的 AI Agent 系统。

## 📖 核心文档

- **[SKILL.md](./SKILL.md)** - 完整的技能说明和执行步骤
- **[examples.md](./examples.md)** - 4 个真实案例 (客服、代码审查、文档生成、代码修复)
- **[checklist.md](./checklist.md)** - 84 项验证清单

## 🎯 适用场景

- ✅ 需要设计 Autonomous Agent (如代码修复、计算机使用)
- ✅ 需要选择合适的 Agentic 模式 (6 种模式)
- ✅ 需要优化工具设计 (Agent-Computer Interface)
- ✅ 需要确保 Agent 质量和安全性

## 🔑 核心价值

1. **基于官方最佳实践** - 完全遵循 Anthropic Building Effective Agents 指南
2. **6 种 Agentic 模式** - Prompt Chaining、Routing、Parallelization、Orchestrator-Workers、Evaluator-Optimizer、Autonomous Agent
3. **ACI 设计指南** - 精心设计的 Agent-Computer Interface
4. **完整验证清单** - 84 项检查确保质量

## 🚀 快速开始

### 基本用法

```
请帮我设计一个 [描述任务] 的 Agent

要求:
- [需求 1]
- [需求 2]
- [需求 3]
```

AI 会引导你:
1. 分析需求,判断是否需要 Agent
2. 选择合适的 Agentic 模式
3. 设计工具集 (Tools)
4. 实现主循环和控制流
5. 添加防护栏和监控
6. 验证清单检查

### 示例

**示例 1: 客服 Agent**
```
我需要一个客服 Agent,能处理:
1. 订单查询
2. 退款申请 (>1000元需人工审批)
3. 技术支持 (自动创建工单)
```

**示例 2: 代码审查 Agent**
```
为 PR 构建代码审查 Agent,从 4 个维度并行审查:
- 安全性
- 性能
- 规范性
- 测试覆盖率

综合评分 < 7 则阻止合并
```

详见 [examples.md](./examples.md)

## 📚 深入学习

### 必读文档
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方最佳实践

### 6 种 Agentic 模式

| 模式 | 适用场景 |
|------|---------|
| **Prompt Chaining** | 任务可分解为固定步骤序列 |
| **Routing** | 输入有明确分类,需要专门处理 |
| **Parallelization** | 子任务可并行或需要多视角 |
| **Orchestrator-Workers** | 子任务不可预测,需动态分配 |
| **Evaluator-Optimizer** | 有明确评估标准,迭代改进 |
| **Autonomous Agent** | 完全开放式,步骤数不确定 |

### 三大核心原则

1. **简洁性 (Simplicity)** - 从最简单方案开始,逐步增加复杂度
2. **透明性 (Transparency)** - 清晰展示决策步骤和中间结果
3. **精心设计的 ACI** - 工具文档完善,参数设计防错

## ✅ 质量保证

使用 [checklist.md](./checklist.md) 验证 Agent 质量:

- 84 项检查清单
- 7 大类别 (架构设计、工具设计、实现质量、防护监控、三大原则、测试覆盖、生产就绪)
- 通过率 >= 90% 可上线生产

## 🔗 相关技能

- [design-architect](mdc:skills/design-architect/SKILL.md) - 系统架构设计
- [design-api](mdc:skills/design-api/SKILL.md) - API 设计
- [code-generation](mdc:skills/code-generation/SKILL.md) - 代码生成

## 📝 版本历史

- **v1.0** (2025-11-21): 初始版本
  - 基于 Anthropic Building Effective Agents 最佳实践
  - 6 种 Agentic 模式完整覆盖
  - 84 项验证清单
  - 4 个真实案例

## 💡 最佳实践

1. **不要过早使用 Agent** - 先尝试 Workflow 或单次 LLM 调用
2. **花时间优化工具定义** - 在 Anthropic Workbench 测试并迭代
3. **设置成本上限** - 避免 Agent 无限运行
4. **在沙箱测试** - 充分测试后再上生产
5. **监控错误累积** - 防止错误雪崩

---

**重要提示**: 生成 Agent 时**必须使用中文**!
