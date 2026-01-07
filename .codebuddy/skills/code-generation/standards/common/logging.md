# 通用日志规范

适用于所有语言的日志记录最佳实践。

---

## 日志级别使用

| 级别 | 使用场景 | 示例 |
|------|---------|------|
| **ERROR** | 系统错误，需要立即处理 | 数据库连接失败、外部服务不可用、未捕获异常 |
| **WARN** | 潜在问题，不影响主流程 | 配置缺失使用默认值、重试成功、性能下降 |
| **INFO** | 关键业务节点 | 用户登录、订单创建、支付完成、定时任务执行 |
| **DEBUG** | 调试信息 | 方法入参、中间变量、SQL 语句、HTTP 请求详情 |
| **TRACE** | 详细追踪 | 循环内部状态、详细调用链、性能计时 |

---

## 必须记录日志的场景

### P0 - 必须记录

- [ ] 外部系统调用（入参、出参、耗时、状态）
- [ ] 关键业务操作（创建、修改、删除、状态变更）
- [ ] 异常捕获（完整堆栈、上下文信息）
- [ ] 定时任务执行（开始、结束、处理数量、结果）
- [ ] 安全相关操作（登录、登出、权限变更、敏感操作）

### P1 - 建议记录

- [ ] 方法入口（关键参数）
- [ ] 重要分支判断（条件和结果）
- [ ] 性能敏感操作（耗时）
- [ ] 配置加载（配置项和值）

---

## 禁止记录的内容

| 禁止内容 | 原因 | 替代方案 |
|---------|------|---------|
| ❌ 密码、密钥、Token | 安全风险 | 记录 `***` 或不记录 |
| ❌ 身份证号、银行卡号 | 隐私合规 | 脱敏显示 `110***1234` |
| ❌ 大量循环内日志 | 性能影响 | 汇总后记录 |
| ❌ 用户输入直接写入 | 日志注入风险 | 转义或截断 |
| ❌ 二进制数据 | 无意义 | 记录长度或摘要 |

---

## 日志格式要求

### 标准格式

```
[时间] [级别] [TraceID] [类名/模块] - 消息内容 | 上下文信息
```

### 示例

```
2025-12-22 10:30:45.123 INFO  [abc123] [UserService] - 用户登录成功 | userId=1001, ip=192.168.1.1
2025-12-22 10:30:46.456 ERROR [abc123] [PaymentService] - 支付失败 | orderId=2001, reason=余额不足
```

### 上下文信息规范

```yaml
必须包含:
  - 业务标识: userId, orderId, traceId
  - 操作类型: action=create/update/delete
  - 操作结果: success/failed

建议包含:
  - 耗时: duration=123ms
  - 来源: source=web/app/api
  - 版本: version=v1.0.0
```

---

## 日志内容规范

### ✅ 好的日志

```
// 包含上下文、可追踪、有业务价值
log.info("用户注册成功 | userId={}, username={}, source={}", 
         user.getId(), user.getUsername(), source);

log.error("支付失败 | orderId={}, amount={}, reason={}", 
          orderId, amount, e.getMessage(), e);
```

### ❌ 坏的日志

```
// 无上下文、无法追踪、无业务价值
log.info("success");
log.error("error");
log.debug(user.toString());  // 可能包含敏感信息
```

---

## 性能考虑

### 日志级别检查

```java
// ✅ 推荐：先检查级别，避免字符串拼接开销
if (log.isDebugEnabled()) {
    log.debug("详细信息: {}", expensiveOperation());
}

// ❌ 不推荐：无条件执行字符串拼接
log.debug("详细信息: " + expensiveOperation());
```

### 异步日志

```yaml
生产环境建议:
  - 使用异步日志（AsyncAppender）
  - 设置合理的队列大小
  - 配置丢弃策略（避免 OOM）
```

---

## 各语言实现参考

| 语言 | 框架 | 详细文档 |
|------|------|---------|
| Java | SLF4J + Logback | [java/logging.md](../java/logging.md) |
| Go | zap / logrus | [go/logging.md](../go/logging.md) |
| TypeScript | winston / pino | [typescript/logging.md](../typescript/logging.md) |
| Python | logging / loguru | [python/logging.md](../python/logging.md) |
| 前端 | Vue / React / 小程序 | [frontend/logging.md](../frontend/logging.md) |

---

## 检查清单

- [ ] 使用正确的日志级别
- [ ] 包含必要的上下文信息
- [ ] 不包含敏感信息
- [ ] 异常日志包含堆栈
- [ ] 生产环境使用异步日志
- [ ] 日志格式统一
