# 通用日志审查检查清单

> 适用于所有语言的日志代码审查，各语言专项检查请参考对应文档

---

## 快速检查表

| 检查项 | 严重程度 | 说明 |
|--------|----------|------|
| 敏感信息泄露 | 🔴 严重 | 密码、Token、身份证等未脱敏 |
| 日志注入风险 | 🔴 严重 | 用户输入直接写入日志 |
| 异常堆栈缺失 | 🟡 中等 | 异常日志未包含堆栈信息 |
| 日志级别错误 | 🟡 中等 | 级别使用不当（如 ERROR 记录业务异常） |
| TraceId 缺失 | 🟡 中等 | 无法追踪请求链路 |
| 日志格式不规范 | 🟢 轻微 | 格式不统一，缺少上下文 |
| 性能影响 | 🟢 轻微 | 循环内大量日志、字符串拼接 |

---

## 一、安全性检查 (权重: 30%)

### 1.1 敏感信息检查 🔴

**必须检查的敏感字段**：

| 类型 | 字段示例 | 处理方式 |
|------|---------|---------|
| 认证凭证 | password, passwd, pwd, secret | 禁止记录 |
| 令牌 | token, access_token, refresh_token, api_key | 禁止记录 |
| 个人身份 | id_card, ssn, passport | 脱敏显示 `110***1234` |
| 金融信息 | bank_card, credit_card, cvv | 脱敏显示 `6222****1234` |
| 联系方式 | phone, mobile, email | 脱敏显示 `138****1234` |

**检查要点**：

```python
# ❌ 危险：直接记录敏感信息
logger.info(f"用户登录, password={password}")
logger.debug(f"Token: {access_token}")
logger.info(f"身份证: {id_card}")

# ✅ 安全：脱敏处理
logger.info(f"用户登录, username={username}")
logger.info(f"身份证: {mask_id_card(id_card)}")  # 110***1234
```

**审查问题**：
- [ ] 是否有密码、密钥、Token 直接写入日志？
- [ ] 身份证、银行卡等是否已脱敏？
- [ ] 请求/响应体是否可能包含敏感信息？
- [ ] 异常信息是否可能暴露敏感数据？

---

### 1.2 日志注入检查 🔴

**CWE-117: 日志注入漏洞**

攻击者可通过注入换行符、控制字符伪造日志条目。

```java
// ❌ 危险：用户输入直接写入日志
String username = request.getParameter("username");
logger.info("用户登录: " + username);
// 攻击: username = "admin\n2025-01-01 INFO 转账成功 amount=1000000"

// ✅ 安全：过滤控制字符
logger.info("用户登录: {}", sanitize(username));
```

**检查要点**：
- [ ] 用户输入是否直接拼接到日志？
- [ ] 是否过滤了换行符 `\n`、`\r`？
- [ ] 是否过滤了其他控制字符？
- [ ] HTTP Header 值是否直接记录？

**过滤函数示例**：

```java
// Java
public static String sanitize(String input) {
    if (input == null) return "";
    return input.replaceAll("[\\r\\n\\t]", "_")
                .replaceAll("[^\\x20-\\x7E]", "");
}
```

```python
# Python
import re
def sanitize(input: str) -> str:
    if not input:
        return ""
    return re.sub(r'[\r\n\t]', '_', input)
```

---

## 二、日志级别检查 (权重: 20%)

### 2.1 级别使用规范

| 级别 | 正确使用 | 错误使用 |
|------|---------|---------|
| **ERROR** | 系统错误、需要告警 | ❌ 业务校验失败 |
| **WARN** | 潜在问题、可恢复错误 | ❌ 正常业务流程 |
| **INFO** | 关键业务节点 | ❌ 调试信息 |
| **DEBUG** | 调试信息、详细数据 | ❌ 生产环境大量输出 |

**检查要点**：
- [ ] 业务异常是否错误使用 ERROR 级别？
- [ ] INFO 日志是否过多（影响性能）？
- [ ] DEBUG 日志是否在生产环境关闭？
- [ ] 关键业务操作是否有 INFO 日志？

```java
// ❌ 错误：业务校验用 ERROR
try {
    validateUser(user);
} catch (ValidationException e) {
    logger.error("用户校验失败", e);  // 应该用 WARN
}

// ✅ 正确：区分业务异常和系统异常
try {
    validateUser(user);
} catch (ValidationException e) {
    logger.warn("用户校验失败: {}", e.getMessage());  // 业务异常
} catch (Exception e) {
    logger.error("系统异常", e);  // 系统异常
}
```

---

## 三、日志内容检查 (权重: 20%)

### 3.1 必须记录的场景

| 场景 | 必须包含的信息 |
|------|---------------|
| 外部调用 | 入参、出参、耗时、状态码 |
| 关键业务操作 | 操作类型、业务ID、操作结果 |
| 异常处理 | 异常类型、错误信息、堆栈 |
| 定时任务 | 开始时间、结束时间、处理数量 |
| 安全操作 | 用户ID、操作类型、IP地址 |

**检查要点**：
- [ ] 外部 API 调用是否记录了入参、出参、耗时？
- [ ] 关键业务操作是否有日志？
- [ ] 异常日志是否包含完整堆栈？
- [ ] 定时任务是否记录了执行情况？

### 3.2 上下文信息检查

```java
// ❌ 缺少上下文，难以排查
logger.info("操作成功");
logger.error("处理失败");

// ✅ 包含必要上下文
logger.info("订单创建成功, orderId={}, userId={}, amount={}", 
    orderId, userId, amount);
logger.error("支付失败, orderId={}, reason={}", orderId, reason, e);
```

**必须包含的上下文**：
- [ ] 业务标识（orderId, userId, traceId）
- [ ] 操作类型（create, update, delete）
- [ ] 操作结果（success, failed）
- [ ] 关键参数值

---

## 四、TraceId 追踪检查 (权重: 15%)

### 4.1 TraceId 规范

**检查要点**：
- [ ] 是否配置了 TraceId 生成机制？
- [ ] TraceId 是否在请求入口生成？
- [ ] TraceId 是否传递到所有日志？
- [ ] 跨服务调用是否传递 TraceId？

```java
// ✅ Java MDC 配置
public class TraceIdFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        try {
            String traceId = UUID.randomUUID().toString().replace("-", "");
            MDC.put("traceId", traceId);
            chain.doFilter(req, res);
        } finally {
            MDC.clear();
        }
    }
}
```

```python
# ✅ Python contextvars
import contextvars
trace_id_var: contextvars.ContextVar[str] = contextvars.ContextVar('trace_id')
```

### 4.2 日志格式检查

**标准格式**：
```
[时间] [级别] [TraceID] [类名/模块] - 消息内容 | 上下文信息
```

**示例**：
```
2025-01-01 10:30:45.123 INFO  [abc123def456] [OrderService] - 订单创建成功 | orderId=1001, userId=2001
```

---

## 五、性能影响检查 (权重: 15%)

### 5.1 字符串拼接检查

```java
// ❌ 性能问题：字符串拼接
logger.debug("用户信息: " + user.toString());  // 即使 DEBUG 关闭也会执行拼接

// ✅ 正确：使用占位符
logger.debug("用户信息: {}", user);  // DEBUG 关闭时不执行 toString()
```

### 5.2 循环内日志检查

```java
// ❌ 性能问题：循环内大量日志
for (Order order : orders) {
    logger.info("处理订单: {}", order.getId());  // 10000 条订单 = 10000 条日志
}

// ✅ 正确：汇总记录
logger.info("开始处理订单, 总数={}", orders.size());
int successCount = 0;
for (Order order : orders) {
    // 处理逻辑
    successCount++;
}
logger.info("订单处理完成, 成功={}, 失败={}", successCount, orders.size() - successCount);
```

### 5.3 复杂计算检查

```java
// ❌ 性能问题：复杂计算
logger.debug("详细信息: {}", expensiveOperation());  // 即使 DEBUG 关闭也会执行

// ✅ 正确：先检查级别
if (logger.isDebugEnabled()) {
    logger.debug("详细信息: {}", expensiveOperation());
}

// ✅ 或使用 Supplier（SLF4J 2.0+）
logger.debug("详细信息: {}", () -> expensiveOperation());
```

**检查要点**：
- [ ] 是否使用字符串拼接而非占位符？
- [ ] 循环内是否有大量日志输出？
- [ ] 复杂计算是否有级别检查？
- [ ] 生产环境是否使用异步日志？

---

## 六、框架规范检查 (权重: 10%)

### 6.1 Java 检查项

- [ ] 使用 SLF4J + Logback
- [ ] Logger 声明为 `private static final`
- [ ] 使用 `@Slf4j` 注解或正确的 Logger 获取方式
- [ ] 使用 MDC 传递 TraceId

### 6.2 Python 检查项

- [ ] 使用 `logging` 标准库或 `loguru`
- [ ] Logger 使用 `__name__` 获取
- [ ] 使用 `%` 格式化（延迟求值）
- [ ] 异常使用 `logger.exception()`

### 6.3 Go 检查项

- [ ] 使用 `zap` 或 `logrus`
- [ ] 使用结构化字段而非字符串拼接
- [ ] 通过 context 传递 traceId
- [ ] Logger 依赖注入

### 6.4 前端/Vue/小程序检查项

- [ ] 生产环境禁用 `console.log`
- [ ] 不在控制台打印敏感信息
- [ ] 错误日志可上报到监控平台
- [ ] 开发环境调试信息需脱敏

---

## 七、审查评分标准

| 维度 | 权重 | 评分标准 |
|------|------|---------|
| 安全性 | 30% | 无敏感信息泄露、无日志注入风险 |
| 日志级别 | 20% | 级别使用正确、生产环境配置合理 |
| 日志内容 | 20% | 包含必要上下文、格式规范 |
| TraceId | 15% | 配置完整、可追踪 |
| 性能 | 15% | 无性能问题、使用异步日志 |

### 评分等级

| 等级 | 分数 | 说明 |
|------|------|------|
| A | 90-100 | 优秀，符合所有规范 |
| B | 80-89 | 良好，有轻微问题 |
| C | 70-79 | 合格，需要改进 |
| D | 60-69 | 不合格，存在中等问题 |
| F | <60 | 严重不合格，存在安全风险 |

---

## 八、常见问题速查

### 问题 1: 敏感信息泄露

```
🔴 严重 | 安全风险
位置: UserService.java:45
问题: 密码直接写入日志
修复: 移除密码字段或使用 "***" 替代
```

### 问题 2: 日志注入风险

```
🔴 严重 | CWE-117
位置: LoginController.java:32
问题: 用户输入直接拼接到日志
修复: 使用 sanitize() 过滤控制字符
```

### 问题 3: 异常堆栈缺失

```
🟡 中等 | 可维护性
位置: OrderService.java:78
问题: 异常日志未包含堆栈信息
修复: 将异常对象作为最后一个参数传入
```

### 问题 4: 日志级别错误

```
🟡 中等 | 规范性
位置: PaymentService.java:56
问题: 业务校验失败使用 ERROR 级别
修复: 改为 WARN 级别
```

---

## 九、语言专项指南

| 语言 | 审查指南 | 检查清单 |
|------|---------|---------|
| Java | [java-review.md](java/java-review.md) | [java-checklist.md](java/java-checklist.md) |
| Python | [python-review.md](python/python-review.md) | [python-checklist.md](python/python-checklist.md) |
| Go | [go-review.md](go/go-review.md) | - |
| Vue 3 | [vue3-review.md](vue3/vue3-review.md) | - |
| Vue 2 | [vue2-review.md](vue2/vue2-review.md) | - |
| 小程序 | [miniprogram-review.md](miniprogram/miniprogram-review.md) | - |
| MySQL | [mysql-review.md](mysql/mysql-review.md) | [mysql-checklist.md](mysql/mysql-checklist.md) |

---

**版本**: 1.0.0  
**更新时间**: 2025-12-31  
**作者**: spec-code Team
