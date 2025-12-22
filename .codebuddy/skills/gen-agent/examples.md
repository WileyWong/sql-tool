# gen-agent 技能使用示例

本文档提供了使用 `gen-agent` 技能的真实案例,涵盖不同的 Agentic 模式。

## 示例 1: 客服 Agent (Routing + Autonomous)

### 场景描述
为电商平台构建智能客服 Agent,能够:
- 自动分类客户查询 (一般咨询、退款申请、技术支持)
- 调用相关工具 (查询订单、处理退款、创建工单)
- 与人工客服协作

### 用户输入
```
我需要一个客服 Agent,能处理以下场景:
1. 客户查询订单状态
2. 客户申请退款
3. 技术问题需要转人工

要求:
- 退款金额 > 1000 元需要人工审批
- 技术问题自动创建工单并转接
- 一般咨询自动回答
```

### Agent 设计输出

#### 步骤 1: 需求分析
```markdown
## 需求分析

**任务**: 电商客服自动化
**适合模式**: Routing + Autonomous Agent
**理由**: 
- 有明确的查询分类 (一般/退款/技术) → Routing
- 每个分类内需要动态决策和工具调用 → Autonomous Agent

**复杂度权衡**:
- 延迟: 可接受 (客服场景通常可等待 2-3 秒)
- 成本: 合理 (比人工客服便宜很多)
- 收益: 高 (24/7 服务,快速响应)
```

#### 步骤 2: 模式选择
```markdown
## 选定模式

**第一层**: Routing (路由分类)
- 将查询分为: 订单查询、退款申请、技术支持

**第二层**: Autonomous Agent (每个分类)
- 订单查询 Agent: 查询订单 → 格式化回复
- 退款 Agent: 检查金额 → (>1000? 人工审批 : 自动处理)
- 技术支持 Agent: 创建工单 → 转接人工
```

#### 步骤 3: 工具设计
```python
# 工具 1: 路由分类器
{
  "name": "classify_query",
  "description": """
  将客户查询分类到正确的处理流程。
  
  分类规则:
  - ORDER_INQUIRY: 包含"订单"、"物流"、"发货"等关键词
  - REFUND_REQUEST: 包含"退款"、"退货"、"换货"等关键词
  - TECHNICAL_SUPPORT: 包含"无法登录"、"支付失败"、"APP崩溃"等关键词
  - GENERAL_QUESTION: 其他一般性咨询
  
  注意: 如果不确定,优先归为 GENERAL_QUESTION。
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "客户的原始查询文本"
      }
    },
    "required": ["query"]
  }
}

# 工具 2: 查询订单
{
  "name": "query_order",
  "description": """
  根据订单号查询订单详情。
  
  返回信息包含:
  - 订单状态 (待支付/已支付/配送中/已完成/已取消)
  - 物流信息 (快递公司、运单号、当前位置)
  - 预计送达时间
  
  注意: 订单号格式为 12 位数字,如果用户提供的不是 12 位,
        应该先询问用户确认订单号。
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "12位订单号,仅包含数字。示例: '202501150001'"
      }
    },
    "required": ["order_id"]
  }
}

# 工具 3: 处理退款
{
  "name": "process_refund",
  "description": """
  处理客户的退款申请。
  
  自动审批条件:
  - 退款金额 <= 1000 元
  - 订单状态为"已完成"或"配送中"
  - 申请原因不为空
  
  需要人工审批:
  - 退款金额 > 1000 元
  - 订单状态异常
  
  注意: 此工具会返回是否需要人工审批。如果需要,应该调用
        request_human_approval 工具。
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "12位订单号"
      },
      "reason": {
        "type": "string",
        "description": "退款原因,由客户提供"
      },
      "amount": {
        "type": "number",
        "description": "退款金额 (元)"
      }
    },
    "required": ["order_id", "reason", "amount"]
  }
}

# 工具 4: 创建技术工单
{
  "name": "create_support_ticket",
  "description": """
  为技术问题创建工单并分配给人工客服。
  
  工单信息包含:
  - 问题描述
  - 客户联系方式
  - 优先级 (根据问题严重程度自动判断)
  
  常见问题严重程度:
  - 高: 无法登录、支付失败、数据丢失
  - 中: 功能异常、页面报错
  - 低: UI 问题、使用咨询
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "issue_description": {
        "type": "string",
        "description": "详细的问题描述,包含复现步骤"
      },
      "customer_contact": {
        "type": "string",
        "description": "客户联系方式 (手机号或邮箱)"
      },
      "priority": {
        "type": "string",
        "enum": ["high", "medium", "low"],
        "description": "问题优先级"
      }
    },
    "required": ["issue_description", "customer_contact", "priority"]
  }
}
```

#### 步骤 4: 主循环设计
```python
def customer_service_agent(query, max_turns=5):
    """
    客服 Agent 主循环
    """
    # 第一步: 分类
    category = classify_query(query)
    
    # 根据分类路由到不同的子 Agent
    if category == "ORDER_INQUIRY":
        return order_inquiry_agent(query, max_turns)
    elif category == "REFUND_REQUEST":
        return refund_agent(query, max_turns)
    elif category == "TECHNICAL_SUPPORT":
        return technical_support_agent(query, max_turns)
    else:
        return general_agent(query, max_turns)

def refund_agent(query, max_turns):
    """
    退款处理 Agent
    """
    turn = 0
    context = {"query": query}
    
    while turn < max_turns:
        # 1. LLM 决策下一步
        action = llm.decide_next_action(context)
        
        # 2. 执行工具
        if action.tool == "process_refund":
            result = process_refund(**action.params)
            
            # 3. 检查点: 需要人工审批?
            if result["needs_approval"]:
                human_decision = request_human_approval({
                    "order_id": action.params["order_id"],
                    "amount": action.params["amount"],
                    "reason": action.params["reason"]
                })
                
                if human_decision["approved"]:
                    return complete_refund(action.params["order_id"])
                else:
                    return notify_customer_rejection(
                        human_decision["rejection_reason"]
                    )
            else:
                # 自动审批通过
                return complete_refund(action.params["order_id"])
        
        # 4. 其他工具调用...
        
        turn += 1
    
    # 达到最大轮次,转人工
    return escalate_to_human(context)
```

#### 步骤 5: 测试用例
```markdown
## 测试场景

### 场景 1: 订单查询 (正常流程)
**输入**: "我的订单 202501150001 什么时候能送到?"
**预期流程**:
1. classify_query → ORDER_INQUIRY
2. query_order(order_id="202501150001") → 获取物流信息
3. 格式化回复 → 返回预计送达时间

### 场景 2: 小额退款 (自动审批)
**输入**: "订单 202501150002 我不想要了,退款 500 元"
**预期流程**:
1. classify_query → REFUND_REQUEST
2. process_refund(order_id="202501150002", amount=500, reason="不想要了")
3. 自动审批通过 (金额 <= 1000)
4. complete_refund → 成功

### 场景 3: 大额退款 (人工审批)
**输入**: "订单 202501150003 质量问题,要求退款 2000 元"
**预期流程**:
1. classify_query → REFUND_REQUEST
2. process_refund(order_id="202501150003", amount=2000, reason="质量问题")
3. needs_approval=true
4. request_human_approval → 暂停,等待人工
5. 人工审批通过/拒绝 → 继续执行

### 场景 4: 技术问题 (转人工)
**输入**: "APP登录一直失败,提示网络错误"
**预期流程**:
1. classify_query → TECHNICAL_SUPPORT
2. create_support_ticket(priority="high") → 创建工单
3. 返回工单号 + 预计响应时间
```

#### 步骤 6: 监控和防护
```python
# 成本监控
COST_LIMITS = {
    "max_tokens_per_session": 10000,  # 单次会话最大 token
    "max_api_calls": 20,               # 单次会话最大 API 调用
    "daily_budget": 100.0              # 每日成本上限 ($)
}

# 安全防护
SAFETY_RULES = {
    "refund": {
        "max_amount_auto": 1000,      # 自动审批最大金额
        "require_human_above": 1000    # 超过此金额需人工
    },
    "sensitive_operations": [
        "delete_account",
        "change_password",
        "update_payment_method"
    ],  # 敏感操作禁止 Agent 执行
}

# 日志记录
def log_agent_action(action, result):
    logger.info({
        "timestamp": datetime.now(),
        "action": action,
        "result": result,
        "customer_id": current_customer.id,
        "cost": calculate_cost(action)
    })
```

---

## 示例 2: 代码审查 Agent (Parallelization)

### 场景描述
为 Pull Request 构建自动化代码审查 Agent,从多个角度并行审查:
- 安全漏洞检测
- 性能问题分析
- 代码规范检查
- 测试覆盖率评估

### 用户输入
```
我需要一个代码审查 Agent,对每个 PR 进行多维度审查:
1. 安全性 (SQL注入、XSS、敏感信息泄露)
2. 性能 (N+1查询、大循环、内存泄漏)
3. 规范性 (命名、注释、格式)
4. 测试 (覆盖率、边界条件)

要求:
- 4 个审查并行执行 (节省时间)
- 每个审查都打分 (0-10)
- 综合评分 < 7 则阻止合并
```

### Agent 设计输出

#### 模式选择
```markdown
**选定模式**: Parallelization (Sectioning)
**理由**: 
- 4 个审查维度相互独立
- 可以并行执行提高速度
- 每个维度由专门的 LLM call 处理,更专注

**不适合用 Autonomous Agent**:
- 审查步骤固定,不需要动态决策
- 每个维度职责清晰,无需灵活调整
```

#### 工具和流程设计
```python
async def code_review_agent(pr_id):
    """
    并行代码审查 Agent
    """
    # 获取 PR 的所有改动文件
    changed_files = get_pr_changes(pr_id)
    
    # 并行执行 4 个审查维度
    reviews = await asyncio.gather(
        review_security(changed_files),
        review_performance(changed_files),
        review_code_style(changed_files),
        review_test_coverage(changed_files)
    )
    
    # 汇总结果
    security_score, security_issues = reviews[0]
    performance_score, performance_issues = reviews[1]
    style_score, style_issues = reviews[2]
    test_score, test_issues = reviews[3]
    
    # 计算综合评分
    overall_score = (
        security_score * 0.4 +      # 安全性权重 40%
        performance_score * 0.3 +   # 性能权重 30%
        style_score * 0.2 +         # 规范性权重 20%
        test_score * 0.1            # 测试权重 10%
    )
    
    # 生成报告
    report = generate_review_report({
        "overall_score": overall_score,
        "security": (security_score, security_issues),
        "performance": (performance_score, performance_issues),
        "style": (style_score, style_issues),
        "test": (test_score, test_issues),
        "can_merge": overall_score >= 7.0
    })
    
    # 发布审查结果到 PR
    post_review_comment(pr_id, report)
    
    return overall_score >= 7.0  # 返回是否可合并

async def review_security(files):
    """
    安全审查子 Agent
    专注于: SQL注入、XSS、敏感信息等
    """
    prompt = f"""
    你是一个安全专家,审查以下代码的安全问题。
    
    重点关注:
    1. SQL 注入风险 (拼接 SQL、未使用参数化查询)
    2. XSS 漏洞 (未转义的用户输入)
    3. 敏感信息泄露 (硬编码密码、API Key、日志打印敏感数据)
    4. 权限控制缺失 (未验证用户权限)
    5. CSRF 攻击 (POST 请求未验证 Token)
    
    评分标准:
    - 10分: 无任何安全问题
    - 7-9分: 有低风险问题,可接受
    - 4-6分: 有中等风险问题,需要修复
    - 0-3分: 有高风险问题,必须修复
    
    代码:
    {format_files(files)}
    
    请返回:
    1. 评分 (0-10)
    2. 发现的问题列表 (每个问题包含: 严重程度、位置、描述、修复建议)
    """
    
    response = await llm.generate(prompt)
    score, issues = parse_review_response(response)
    return score, issues
```

#### 测试结果示例
```markdown
## 代码审查报告

**PR**: #1234 - 添加用户登录功能
**综合评分**: 6.8 / 10.0
**是否可合并**: ❌ 否 (需要修复后重新审查)

### 详细评分

| 维度 | 评分 | 权重 | 加权分 |
|------|------|------|--------|
| 🔒 安全性 | 5.0 | 40% | 2.0 |
| ⚡ 性能 | 8.0 | 30% | 2.4 |
| 📐 规范性 | 9.0 | 20% | 1.8 |
| ✅ 测试 | 6.0 | 10% | 0.6 |
| **总分** | - | - | **6.8** |

### 🔒 安全审查 (5.0/10)

❌ **高风险问题** (必须修复):
1. **SQL 注入风险** - `src/auth/login.py:45`
   ```python
   # 问题代码
   query = f"SELECT * FROM users WHERE username='{username}'"
   
   # 修复建议: 使用参数化查询
   query = "SELECT * FROM users WHERE username=%s"
   cursor.execute(query, (username,))
   ```

⚠️ **中风险问题** (建议修复):
2. **敏感信息泄露** - `src/config/database.py:12`
   ```python
   # 问题代码
   DB_PASSWORD = "admin123"  # 硬编码密码
   
   # 修复建议: 使用环境变量
   DB_PASSWORD = os.getenv("DB_PASSWORD")
   ```

### ⚡ 性能审查 (8.0/10)

✅ **通过**: 无重大性能问题

💡 **优化建议**:
1. **可优化** - `src/auth/login.py:67`
   - 建议添加用户查询缓存 (Redis)
   - 预期提升: 减少 50% 数据库查询

### 📐 规范性审查 (9.0/10)

✅ **通过**: 代码规范良好

⚠️ **小问题**:
1. 部分函数缺少文档注释
2. 变量命名可以更语义化 (`usr` → `user`)

### ✅ 测试审查 (6.0/10)

⚠️ **覆盖率不足**:
- 当前覆盖率: 65%
- 目标覆盖率: 80%
- 缺少测试: 登录失败场景、Token 过期场景

---

**下一步行动**:
1. ❌ **阻止合并** (综合评分 < 7.0)
2. 修复所有高风险安全问题
3. 补充测试用例至 80% 覆盖率
4. 修复后重新提交审查
```

---

## 示例 3: 文档生成 Agent (Evaluator-Optimizer)

### 场景描述
生成高质量的 API 文档,通过迭代优化:
- 第一轮生成初稿
- 评估文档质量 (完整性、准确性、可读性)
- 根据评估反馈优化
- 重复直到达到质量标准

### 用户输入
```
为 REST API 生成 OpenAPI 文档,要求:
1. 根据代码自动提取 API 定义
2. 生成清晰的描述和示例
3. 迭代优化直到质量评分 >= 8.0

质量标准:
- 完整性: 所有字段都有描述
- 准确性: 类型和格式正确
- 可读性: 描述清晰,示例完整
```

### Agent 设计输出

#### 模式选择
```markdown
**选定模式**: Evaluator-Optimizer
**理由**:
- 有明确的质量标准 (评分 >= 8.0)
- 迭代改进可以显著提升质量
- LLM 可以提供有效的评估反馈

**不适合用 Prompt Chaining**:
- 单次生成难以达到高质量
- 需要根据评估结果动态调整,而非固定步骤
```

#### 实现代码
```python
def api_doc_generator_agent(api_code, max_iterations=3):
    """
    API 文档生成 Agent (Evaluator-Optimizer 模式)
    """
    # 提取 API 定义
    api_definitions = extract_api_from_code(api_code)
    
    # 初始生成
    doc = generate_initial_doc(api_definitions)
    
    iteration = 0
    while iteration < max_iterations:
        # 评估当前文档
        evaluation = evaluate_doc_quality(doc, api_definitions)
        
        # 达到质量标准?
        if evaluation["overall_score"] >= 8.0:
            return doc
        
        # 生成改进建议
        feedback = generate_improvement_feedback(evaluation)
        
        # 根据反馈优化
        doc = optimize_doc(doc, feedback, api_definitions)
        
        iteration += 1
    
    # 达到最大迭代次数,返回当前最佳版本
    return doc

def evaluate_doc_quality(doc, api_definitions):
    """
    评估文档质量
    """
    prompt = f"""
    你是一个技术文档评审专家,评估以下 API 文档的质量。
    
    评估维度:
    1. **完整性** (0-10): 
       - 所有 API 都有文档
       - 所有参数都有类型和描述
       - 所有响应字段都有说明
       - 有错误码说明
    
    2. **准确性** (0-10):
       - 类型定义正确
       - 必填/可选标记正确
       - 示例数据符合格式
       - 与代码定义一致
    
    3. **可读性** (0-10):
       - 描述清晰易懂
       - 示例完整可运行
       - 有使用场景说明
       - 格式规范统一
    
    API 代码定义:
    {format_api_definitions(api_definitions)}
    
    当前文档:
    {doc}
    
    请返回:
    1. 各维度评分
    2. 综合评分 (3 个维度的平均分)
    3. 具体问题列表 (每个问题指出位置和改进方向)
    """
    
    response = llm.generate(prompt)
    return parse_evaluation(response)

def optimize_doc(doc, feedback, api_definitions):
    """
    根据评估反馈优化文档
    """
    prompt = f"""
    请根据以下反馈优化 API 文档。
    
    当前文档:
    {doc}
    
    评估反馈:
    {format_feedback(feedback)}
    
    API 代码定义 (作为参考):
    {format_api_definitions(api_definitions)}
    
    优化要求:
    1. 修复所有指出的问题
    2. 保持文档结构不变
    3. 确保描述准确完整
    4. 提供可运行的示例
    
    请返回优化后的完整文档。
    """
    
    response = llm.generate(prompt)
    return parse_optimized_doc(response)
```

#### 迭代过程示例
```markdown
## 文档生成迭代记录

### 迭代 1: 初始生成
**评分**: 5.5 / 10.0

**问题**:
- ❌ 缺少请求示例 (完整性)
- ❌ 部分字段类型错误 (准确性)
- ❌ 描述过于简略 (可读性)

### 迭代 2: 第一次优化
**评分**: 7.2 / 10.0

**改进**:
- ✅ 添加了请求示例
- ✅ 修复了类型错误
- ⚠️ 描述仍需改进

**剩余问题**:
- 错误码说明不完整
- 部分示例缺少必填字段

### 迭代 3: 第二次优化
**评分**: 8.5 / 10.0 ✅

**改进**:
- ✅ 补充完整错误码说明
- ✅ 完善所有示例
- ✅ 增加使用场景说明

**结果**: 达到质量标准,生成完成!
```

---

## 示例 4: SWE-bench 代码修复 Agent (Autonomous)

### 场景描述
根据 GitHub Issue 描述,自动修复代码 Bug:
- 分析 Issue 理解问题
- 定位相关代码文件
- 生成修复方案
- 运行测试验证
- 提交 Pull Request

(此为完全自主的 Autonomous Agent,步骤数不确定)

### Agent 设计要点

#### 主循环设计
```python
def swe_bench_agent(issue_description, max_iterations=15):
    """
    代码修复 Autonomous Agent
    
    特点:
    - 完全自主决策
    - 不可预测的步骤数
    - 依赖环境反馈 (测试结果)
    """
    iteration = 0
    context = {
        "issue": issue_description,
        "files_read": set(),
        "files_modified": set(),
        "test_results": []
    }
    
    while iteration < max_iterations:
        # 1. LLM 决策下一步行动
        action = llm.decide_next_action(context)
        
        # 2. 执行工具并获取真实反馈
        if action.tool == "read_file":
            content = read_file(action.file_path)
            context["files_read"].add(action.file_path)
            context["current_file"] = content
            
        elif action.tool == "edit_file":
            success = edit_file(action.file_path, action.changes)
            context["files_modified"].add(action.file_path)
            
        elif action.tool == "run_tests":
            # 关键: 从环境获取真实测试结果
            test_result = run_tests(action.test_files)
            context["test_results"].append(test_result)
            
            # 测试通过? 任务完成
            if test_result["all_passed"]:
                return create_pull_request(context)
            
        elif action.tool == "search_codebase":
            results = search_codebase(action.query)
            context["search_results"] = results
            
        # 3. 检查是否遇到阻塞
        if is_blocked(context):
            # 示例: 测试持续失败超过 3 次
            if len([r for r in context["test_results"] if not r["all_passed"]]) >= 3:
                return request_human_help({
                    "reason": "测试持续失败,需要人工介入",
                    "failed_tests": context["test_results"][-3:],
                    "files_modified": list(context["files_modified"])
                })
        
        iteration += 1
    
    # 达到最大迭代次数
    return {
        "status": "max_iterations_reached",
        "files_read": len(context["files_read"]),
        "files_modified": len(context["files_modified"]),
        "suggestion": "任务复杂度超出预期,建议人工处理"
    }
```

#### 工具设计亮点
```python
# 使用绝对路径避免错误
{
  "name": "edit_file",
  "description": """
  编辑文件内容。
  
  重要: 必须使用绝对路径!
  
  错误示例: edit_file("../models/user.py")  # 相对路径可能出错
  正确示例: edit_file("/workspace/src/models/user.py")  # 绝对路径
  
  注意: Agent 可能已经切换工作目录,使用相对路径会定位错误文件。
  通过要求绝对路径,我们在 SWE-bench 中将此类错误降为零。
  """,
  "input_schema": {
    "type": "object",
    "properties": {
      "file_path": {
        "type": "string",
        "description": "文件的绝对路径,必须以 / 开头。示例: /workspace/src/models/user.py"
      },
      "changes": {
        "type": "string",
        "description": "要应用的代码更改,使用 unified diff 格式"
      }
    },
    "required": ["file_path", "changes"]
  }
}
```

#### 真实案例流程
```markdown
## Issue: "User login fails when username contains special characters"

### Agent 执行流程 (共 9 步)

**Iteration 1**: 分析 Issue
- Action: search_codebase("login authentication username")
- Result: 找到 3 个相关文件

**Iteration 2**: 读取主登录文件
- Action: read_file("/workspace/src/auth/login.py")
- Result: 发现用户名验证逻辑

**Iteration 3**: 读取测试文件
- Action: read_file("/workspace/tests/test_auth.py")
- Result: 发现缺少特殊字符测试用例

**Iteration 4**: 分析根本原因
- Action: 思考 (LLM 内部推理)
- Result: 用户名正则表达式太严格,不允许特殊字符

**Iteration 5**: 修改验证逻辑
- Action: edit_file("/workspace/src/auth/login.py", diff)
- Result: 修改正则表达式,允许特殊字符

**Iteration 6**: 补充测试用例
- Action: edit_file("/workspace/tests/test_auth.py", diff)
- Result: 添加特殊字符用户名测试

**Iteration 7**: 运行测试
- Action: run_tests(["tests/test_auth.py"])
- Result: ❌ 1 个测试失败 (边界条件)

**Iteration 8**: 修复边界条件
- Action: edit_file("/workspace/src/auth/login.py", diff)
- Result: 处理空格和特殊符号边界

**Iteration 9**: 再次运行测试
- Action: run_tests(["tests/test_auth.py"])
- Result: ✅ 所有测试通过!

**最终**: 创建 Pull Request
- 修改文件: login.py, test_auth.py
- 测试覆盖: 新增 3 个测试用例
- 状态: 成功解决 Issue
```

---

## 最佳实践总结

### 1. 选择合适的模式
- 固定流程 → Prompt Chaining
- 有明确分类 → Routing
- 需要并行/多视角 → Parallelization
- 子任务不可预测 → Orchestrator-Workers
- 可迭代改进 → Evaluator-Optimizer
- 完全开放式 → Autonomous Agent

### 2. 工具设计原则
- ✅ 文档清晰完整,包含示例
- ✅ 避免格式开销 (计数、转义)
- ✅ 使用模型熟悉的格式
- ✅ 应用防错设计 (绝对路径 vs 相对路径)

### 3. 测试策略
- 沙箱环境测试
- 边界条件测试
- 错误累积测试
- 成本监控

### 4. 防护和监控
- 设置成本上限
- 最大迭代次数
- 检查点和人工介入
- 详细日志记录
