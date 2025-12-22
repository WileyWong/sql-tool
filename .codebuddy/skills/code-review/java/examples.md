# Java 代码审查示例

完整的 Java 代码审查示例集，涵盖从审查准备到生成报告的全过程。

## 示例目录

| 示例 | 场景 | 文件 |
|------|------|------|
| 示例 1 | Spring Boot 微服务完整审查流程 | [examples/full-review.md](examples/full-review.md) |
| 示例 2 | 异常处理审查 | [examples/exception.md](examples/exception.md) |
| 示例 3 | 并发安全审查 | [examples/concurrency.md](examples/concurrency.md) |
| 示例 4 | Java 8+ 典型错误 | [examples/java8-pitfalls.md](examples/java8-pitfalls.md) |
| 示例 5 | Spring Boot 事务失效 | [examples/transaction.md](examples/transaction.md) |
| 示例 6 | 安全漏洞审查 | [examples/security.md](examples/security.md) |

## 示例概览

### 示例 1: Spring Boot 微服务完整审查流程

完整的审查流程示例，包含：
- 编码规范审查（Controller、Service 层）
- 架构设计审查（服务拆分、依赖关系）
- 安全防护审查（输入验证、SQL 注入、敏感数据）
- 性能优化审查（N+1 查询、缓存）
- 生成审查报告

### 示例 2: 异常处理审查

正确的异常处理模式：
- 不吞掉异常
- 异常分类处理
- 日志记录
- 事务控制

### 示例 3: 并发安全审查

使用乐观锁保证并发安全：
- `@Version` 注解
- 重试机制
- 事务控制

### 示例 4: Java 8+ 典型错误

常见陷阱识别：
- Optional 误用（直接 get、作为字段）
- Stream 误用（并行流滥用、副作用）
- BigDecimal 陷阱（精度丢失、equals 比较）
- 时间 API 陷阱（时区问题）

### 示例 5: Spring Boot 事务失效

事务失效场景：
- 同类方法调用（绕过 AOP 代理）
- 异常被捕获（事务不回滚）
- private/final 方法

### 示例 6: 安全漏洞审查

OWASP 漏洞防护：
- SSRF（URL 白名单、内网 IP 黑名单）
- Mass Assignment（DTO + 白名单字段）

## 相关资源

- [Java 代码审查指南](java-review.md)
- [检查清单](java-checklist.md)
- [Spring Boot 专项审查](springboot-review.md)
