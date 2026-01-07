# Java 日志规范

> 继承自 [通用日志规范](../common/logging.md)，本文档补充 Java/SLF4J 特有规则

## 日志框架选择

### 推荐组合

```
SLF4J (门面) + Logback (实现)
```

### Maven 依赖

```xml
<!-- Spring Boot 默认包含，无需额外引入 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>

<!-- 或单独引入 -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
</dependency>
```

## Logger 声明

### 推荐方式

```java
// ✅ 方式1: Lombok @Slf4j（推荐）
@Slf4j
@Service
public class UserServiceImpl implements UserService {
    public void createUser(User user) {
        log.info("创建用户: {}", user.getUsername());
    }
}

// ✅ 方式2: 手动声明
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
}

// ❌ 错误示例
public class UserServiceImpl {
    private Logger log = LoggerFactory.getLogger(UserServiceImpl.class);  // 应为 static final
    private static final Logger LOG = LoggerFactory.getLogger(OtherClass.class);  // 类名错误
}
```

## 日志级别使用

### 级别对照

| 级别 | 使用场景 | 示例 |
|------|---------|------|
| **ERROR** | 系统错误，需要立即处理 | 数据库连接失败、外部服务不可用 |
| **WARN** | 潜在问题，不影响主流程 | 配置缺失使用默认值、重试成功 |
| **INFO** | 关键业务节点 | 用户登录、订单创建、支付完成 |
| **DEBUG** | 调试信息 | 方法入参、中间变量、SQL 语句 |
| **TRACE** | 详细追踪 | 循环内部状态、详细调用链 |

### 代码示例

```java
@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Override
    public Order createOrder(CreateOrderRequest request) {
        // INFO: 关键业务节点
        log.info("开始创建订单, userId={}, productId={}", 
                request.getUserId(), request.getProductId());
        
        try {
            // DEBUG: 调试信息
            log.debug("订单详情: {}", request);
            
            Order order = buildOrder(request);
            orderMapper.insert(order);
            
            // INFO: 操作成功
            log.info("订单创建成功, orderId={}, amount={}", 
                    order.getId(), order.getTotalAmount());
            
            return order;
        } catch (DuplicateKeyException e) {
            // WARN: 可恢复的问题
            log.warn("订单重复创建, userId={}, 幂等返回", request.getUserId());
            return orderMapper.selectByUserIdAndProductId(
                    request.getUserId(), request.getProductId());
        } catch (Exception e) {
            // ERROR: 系统错误
            log.error("订单创建失败, userId={}, error={}", 
                    request.getUserId(), e.getMessage(), e);
            throw new BusinessException("订单创建失败", e);
        }
    }
}
```

## 占位符使用

### 正确用法

```java
// ✅ 使用 {} 占位符（SLF4J 风格）
log.info("用户登录成功, userId={}, ip={}", userId, ip);
log.debug("查询结果: count={}, list={}", count, list);

// ✅ 异常作为最后一个参数
log.error("处理失败, orderId={}", orderId, exception);

// ❌ 错误示例
log.info("用户登录成功, userId=" + userId);  // 字符串拼接
log.info(String.format("用户登录成功, userId=%s", userId));  // format
log.info("用户登录成功, userId={}", userId, ip);  // 参数数量不匹配
```

### 性能考虑

```java
// ✅ 复杂对象使用 lambda（SLF4J 2.0+）
log.debug("详细信息: {}", () -> expensiveToString(object));

// ✅ 或使用 isDebugEnabled 检查
if (log.isDebugEnabled()) {
    log.debug("详细信息: {}", expensiveToString(object));
}

// ❌ 不推荐：每次都计算
log.debug("详细信息: {}", expensiveToString(object));
```

## 必须记录日志的场景

### 外部调用

```java
@Slf4j
@Component
public class PaymentClient {
    
    public PaymentResult pay(PaymentRequest request) {
        long startTime = System.currentTimeMillis();
        
        // 入参日志
        log.info("调用支付接口, orderId={}, amount={}", 
                request.getOrderId(), request.getAmount());
        
        try {
            PaymentResult result = doPayment(request);
            
            // 出参日志（含耗时）
            log.info("支付接口返回, orderId={}, status={}, cost={}ms", 
                    request.getOrderId(), result.getStatus(),
                    System.currentTimeMillis() - startTime);
            
            return result;
        } catch (Exception e) {
            log.error("支付接口异常, orderId={}, cost={}ms", 
                    request.getOrderId(), 
                    System.currentTimeMillis() - startTime, e);
            throw e;
        }
    }
}
```

### 定时任务

```java
@Slf4j
@Component
public class OrderTimeoutTask {
    
    @Scheduled(cron = "0 0/5 * * * ?")
    public void cancelTimeoutOrders() {
        log.info("开始执行订单超时取消任务");
        long startTime = System.currentTimeMillis();
        
        try {
            int count = orderService.cancelTimeoutOrders();
            log.info("订单超时取消任务完成, 处理数量={}, 耗时={}ms", 
                    count, System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            log.error("订单超时取消任务异常, 耗时={}ms", 
                    System.currentTimeMillis() - startTime, e);
        }
    }
}
```

### 异常处理

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        // WARN: 业务异常
        log.warn("业务异常: code={}, message={}", e.getCode(), e.getMessage());
        return Result.fail(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        // ERROR: 系统异常（含堆栈）
        log.error("系统异常: {}", e.getMessage(), e);
        return Result.fail("SYSTEM_ERROR", "系统繁忙，请稍后重试");
    }
}
```

## 日志注入防护

### CWE-117: 日志注入风险

攻击者可通过注入换行符、控制字符伪造日志条目，导致日志污染或安全审计失效。

```java
// ❌ 危险：用户输入直接写入日志
String username = request.getParameter("username");
log.info("用户登录: " + username);
// 攻击: username = "admin\n2025-01-01 INFO 转账成功 amount=1000000"
// 日志输出:
// 2025-01-01 10:00:00 INFO 用户登录: admin
// 2025-01-01 INFO 转账成功 amount=1000000  <- 伪造的日志

// ❌ 危险：HTTP Header 直接记录
String userAgent = request.getHeader("User-Agent");
log.info("User-Agent: {}", userAgent);  // Header 可被篡改
```

### 防护方案

```java
/**
 * 日志安全工具类
 */
public class LogSanitizer {
    
    /**
     * 过滤日志注入字符
     * 移除换行符、回车符、制表符等控制字符
     */
    public static String sanitize(String input) {
        if (input == null) {
            return "";
        }
        // 替换换行符和控制字符
        return input.replaceAll("[\\r\\n\\t]", "_")
                    .replaceAll("[^\\x20-\\x7E\\u4e00-\\u9fa5]", "");
    }
    
    /**
     * 截断过长输入
     */
    public static String truncate(String input, int maxLength) {
        if (input == null) {
            return "";
        }
        if (input.length() <= maxLength) {
            return sanitize(input);
        }
        return sanitize(input.substring(0, maxLength)) + "...(truncated)";
    }
}

// ✅ 安全：过滤用户输入
String username = request.getParameter("username");
log.info("用户登录: {}", LogSanitizer.sanitize(username));

// ✅ 安全：截断过长输入
String comment = request.getParameter("comment");
log.info("用户评论: {}", LogSanitizer.truncate(comment, 200));
```

### 安全日志记录模式

```java
@Slf4j
@Component
public class AuditLogger {
    
    /**
     * 安全的审计日志记录
     */
    public void logUserAction(String userId, String action, Map<String, String> params) {
        // 所有参数都经过过滤
        String safeUserId = LogSanitizer.sanitize(userId);
        String safeAction = LogSanitizer.sanitize(action);
        
        StringBuilder safeParams = new StringBuilder();
        params.forEach((k, v) -> {
            safeParams.append(LogSanitizer.sanitize(k))
                      .append("=")
                      .append(LogSanitizer.truncate(v, 100))
                      .append(", ");
        });
        
        log.info("审计日志 | userId={}, action={}, params=[{}]", 
                safeUserId, safeAction, safeParams);
    }
}
```

### 检查要点

- [ ] 用户输入是否直接拼接到日志？
- [ ] HTTP Header 值是否直接记录？
- [ ] 是否过滤了换行符 `\n`、`\r`？
- [ ] 过长输入是否截断？
- [ ] 是否使用 `{}` 占位符而非字符串拼接？

---

## 敏感信息处理

### 脱敏工具

```java
public class LogMaskUtils {
    
    /**
     * 手机号脱敏: 138****1234
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() != 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
    
    /**
     * 身份证脱敏: 110***********1234
     */
    public static String maskIdCard(String idCard) {
        if (idCard == null || idCard.length() < 8) {
            return idCard;
        }
        return idCard.substring(0, 3) + "***********" + idCard.substring(idCard.length() - 4);
    }
    
    /**
     * 银行卡脱敏: 6222************1234
     */
    public static String maskBankCard(String bankCard) {
        if (bankCard == null || bankCard.length() < 8) {
            return bankCard;
        }
        return bankCard.substring(0, 4) + "************" + bankCard.substring(bankCard.length() - 4);
    }
}

// 使用示例
log.info("用户注册, phone={}", LogMaskUtils.maskPhone(user.getPhone()));
```

### 禁止记录

```java
// ❌ 禁止记录
log.info("用户登录, password={}", password);
log.debug("Token: {}", accessToken);
log.info("身份证: {}", idCard);  // 未脱敏
```

## MDC 使用

### TraceId 传递

```java
@Component
public class TraceIdFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        try {
            String traceId = UUID.randomUUID().toString().replace("-", "");
            MDC.put("traceId", traceId);
            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
```

### Logback 配置

```xml
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{traceId}] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

## 检查清单

- [ ] 使用 SLF4J + Logback
- [ ] Logger 声明为 `private static final`
- [ ] 使用 `{}` 占位符，不使用字符串拼接
- [ ] 异常作为最后一个参数传入
- [ ] 关键业务节点有 INFO 日志
- [ ] 外部调用记录入参、出参、耗时
- [ ] 异常日志包含完整堆栈
- [ ] 敏感信息已脱敏
- [ ] 使用 MDC 传递 TraceId

## 参考

- [通用日志规范](../common/logging.md)
- [SLF4J 官方文档](http://www.slf4j.org/)
- [Logback 官方文档](http://logback.qos.ch/)
