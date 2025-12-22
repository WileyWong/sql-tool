# Spring Boot 专项审查指南

针对 Spring Boot 项目的专项代码审查，覆盖 Actuator 安全、事务管理、异步处理等关键领域。

> 📚 **前置阅读**: [Java 代码审查指南](java-review.md)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-springboot-{时间戳}.md`

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Actuator 安全 | 25% | 端点暴露、权限控制、敏感信息 |
| 事务管理 | 25% | 事务失效、传播行为、超时配置 |
| 异步处理 | 15% | 线程池配置、异常处理、上下文传递 |
| 配置安全 | 15% | 敏感配置、Profile 管理、属性绑定 |
| 依赖注入 | 10% | 循环依赖、注入方式、Bean 作用域 |
| SpEL 安全 | 10% | 表达式注入、动态表达式 |

---

## Actuator 安全审查

### 端点暴露检查

```yaml
# ❌ 危险配置：暴露所有端点
management:
  endpoints:
    web:
      exposure:
        include: "*"  # 暴露 env、heapdump 等敏感端点!

# ✅ 安全配置：仅暴露必要端点
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /internal/actuator  # 修改默认路径
  endpoint:
    health:
      show-details: when_authorized
    env:
      enabled: false  # 禁用敏感端点
    heapdump:
      enabled: false
    threaddump:
      enabled: false
    configprops:
      enabled: false
```

### 敏感端点风险

| 端点 | 风险 | 说明 |
|------|------|------|
| `/actuator/env` | 🔴 严重 | 泄露环境变量、配置属性 |
| `/actuator/heapdump` | 🔴 严重 | 泄露内存数据、敏感信息 |
| `/actuator/threaddump` | 🟠 高危 | 泄露线程状态、代码逻辑 |
| `/actuator/configprops` | 🟠 高危 | 泄露配置属性 |
| `/actuator/mappings` | 🟡 中危 | 泄露 API 路由 |
| `/actuator/beans` | 🟡 中危 | 泄露 Bean 结构 |

### Actuator 权限控制

```java
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig {
    
    @Bean
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher(EndpointRequest.toAnyEndpoint())
            .authorizeHttpRequests(auth -> auth
                // 健康检查和信息端点公开
                .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
                // 其他端点需要管理员权限
                .anyRequest().hasRole("ACTUATOR_ADMIN")
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
```

---

## 事务管理审查

### 事务失效场景（⚠️ 高频问题）

#### 场景 1：同类方法调用

```java
// ❌ 事务失效：同类方法调用绕过代理
@Service
public class OrderService {
    
    public void createOrder(OrderDTO dto) {
        // 直接调用 this，事务不生效!
        this.saveOrder(dto);
    }
    
    @Transactional
    public void saveOrder(OrderDTO dto) {
        orderRepository.save(dto);
    }
}

// ✅ 修复方案 1：注入自身（推荐）
@Service
public class OrderService {
    
    @Lazy
    @Autowired
    private OrderService self;
    
    public void createOrder(OrderDTO dto) {
        self.saveOrder(dto);  // 通过代理调用
    }
    
    @Transactional
    public void saveOrder(OrderDTO dto) {
        orderRepository.save(dto);
    }
}

// ✅ 修复方案 2：拆分到不同 Service
@Service
public class OrderService {
    
    private final OrderTransactionService transactionService;
    
    public void createOrder(OrderDTO dto) {
        transactionService.saveOrder(dto);
    }
}

@Service
public class OrderTransactionService {
    
    @Transactional
    public void saveOrder(OrderDTO dto) {
        orderRepository.save(dto);
    }
}
```

#### 场景 2：非 public 方法

```java
// ❌ 事务失效：非 public 方法
@Service
public class UserService {
    
    @Transactional
    private void saveUser(User user) {  // private 方法事务不生效!
        userRepository.save(user);
    }
    
    @Transactional
    protected void updateUser(User user) {  // protected 也不生效!
        userRepository.update(user);
    }
}

// ✅ 正确：使用 public 方法
@Service
public class UserService {
    
    @Transactional
    public void saveUser(User user) {
        userRepository.save(user);
    }
}
```

#### 场景 3：异常被捕获

```java
// ❌ 事务不回滚：异常被捕获
@Service
public class PaymentService {
    
    @Transactional
    public void processPayment(PaymentDTO dto) {
        try {
            paymentRepository.save(dto);
            externalPaymentGateway.charge(dto);  // 可能抛异常
        } catch (Exception e) {
            log.error("支付失败", e);
            // 吞掉异常，事务不回滚!
        }
    }
}

// ✅ 正确：重新抛出或手动回滚
@Service
public class PaymentService {
    
    @Transactional(rollbackFor = Exception.class)
    public void processPayment(PaymentDTO dto) {
        try {
            paymentRepository.save(dto);
            externalPaymentGateway.charge(dto);
        } catch (PaymentException e) {
            log.error("支付失败", e);
            throw e;  // 重新抛出，触发回滚
        }
    }
    
    // 或者手动回滚
    @Transactional
    public void processPaymentWithManualRollback(PaymentDTO dto) {
        try {
            paymentRepository.save(dto);
            externalPaymentGateway.charge(dto);
        } catch (PaymentException e) {
            log.error("支付失败", e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
    }
}
```

#### 场景 4：rollbackFor 配置错误

```java
// ❌ 检查型异常不回滚
@Transactional  // 默认只回滚 RuntimeException
public void importData(File file) throws IOException {
    // IOException 是检查型异常，不会回滚!
    dataRepository.save(parseFile(file));
}

// ✅ 正确：指定 rollbackFor
@Transactional(rollbackFor = Exception.class)
public void importData(File file) throws IOException {
    dataRepository.save(parseFile(file));
}
```

### 事务传播行为

```java
// ⚠️ 注意：REQUIRES_NEW 会挂起外部事务
@Service
public class AuditService {
    
    // 审计日志独立事务，不受外部事务回滚影响
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAudit(String action, String detail) {
        auditRepository.save(new AuditLog(action, detail));
    }
}

@Service
public class OrderService {
    
    private final AuditService auditService;
    
    @Transactional
    public void createOrder(OrderDTO dto) {
        orderRepository.save(dto);
        
        // 审计日志在独立事务中，即使主事务回滚也会保存
        auditService.logAudit("CREATE_ORDER", dto.toString());
        
        // 如果这里抛异常，订单回滚，但审计日志已提交
        validateOrder(dto);
    }
}
```

---

## 异步处理审查

### @Async 线程池配置

```java
// ❌ 危险：使用默认线程池（无界队列，可能 OOM）
@Async
public void sendEmail(String to, String content) {
    // 默认使用 SimpleAsyncTaskExecutor，每次创建新线程!
}

// ✅ 安全：自定义线程池
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Bean("emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);  // 有界队列
        executor.setKeepAliveSeconds(60);
        executor.setThreadNamePrefix("email-");
        executor.setRejectedExecutionHandler(new CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }
    
    @Override
    public Executor getAsyncExecutor() {
        return emailExecutor();
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("异步方法执行异常: {}", method.getName(), ex);
        };
    }
}

// 使用指定线程池
@Async("emailExecutor")
public void sendEmail(String to, String content) {
    // ...
}
```

### @Async 与 @Transactional 组合

```java
// ❌ 错误：@Async 方法中的事务可能不生效
@Service
public class NotificationService {
    
    @Async
    @Transactional  // 事务在异步线程中，与调用方事务隔离
    public void sendNotification(Long userId, String message) {
        // 这是独立事务，不受调用方事务影响
        notificationRepository.save(new Notification(userId, message));
    }
}

// ⚠️ 注意：异步方法的事务是独立的
@Service
public class OrderService {
    
    @Transactional
    public void createOrder(OrderDTO dto) {
        orderRepository.save(dto);
        
        // 通知在异步线程的独立事务中
        // 如果主事务回滚，通知可能已发送
        notificationService.sendNotification(dto.getUserId(), "订单创建成功");
        
        // 这里抛异常，订单回滚，但通知可能已发送
        validateOrder(dto);
    }
}
```

### 上下文传递

```java
// ❌ 问题：异步线程丢失上下文
@Async
public void processInBackground(Long userId) {
    // SecurityContext、RequestAttributes 等上下文丢失!
    String currentUser = SecurityContextHolder.getContext()
        .getAuthentication().getName();  // 可能为 null
}

// ✅ 解决：配置上下文传递
@Configuration
public class AsyncContextConfig {
    
    @Bean
    public TaskDecorator contextCopyingDecorator() {
        return runnable -> {
            // 捕获当前上下文
            RequestAttributes context = RequestContextHolder.currentRequestAttributes();
            SecurityContext securityContext = SecurityContextHolder.getContext();
            
            return () -> {
                try {
                    // 在异步线程中恢复上下文
                    RequestContextHolder.setRequestAttributes(context);
                    SecurityContextHolder.setContext(securityContext);
                    runnable.run();
                } finally {
                    // 清理上下文
                    RequestContextHolder.resetRequestAttributes();
                    SecurityContextHolder.clearContext();
                }
            };
        };
    }
    
    @Bean("contextAwareExecutor")
    public Executor contextAwareExecutor(TaskDecorator decorator) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setTaskDecorator(decorator);  // 应用装饰器
        executor.initialize();
        return executor;
    }
}
```

---

## SpEL 注入审查

### SpEL 注入风险 (CWE-917)

```java
// ❌ 危险：用户输入进入 SpEL 表达式
@Value("#{${user.expression}}")  // 配置可被注入!
private String value;

// ❌ 危险：动态 SpEL 表达式
public Object evaluate(String expression) {
    ExpressionParser parser = new SpelExpressionParser();
    return parser.parseExpression(expression).getValue();  // 任意代码执行!
}

// ❌ 危险：@PreAuthorize 中使用用户输入
@PreAuthorize("hasRole(#role)")  // role 来自用户输入
public void doSomething(String role) { }

// ✅ 安全：硬编码表达式
@PreAuthorize("hasRole('ADMIN')")
public void adminOperation() { }

// ✅ 安全：白名单验证
public Object safeEvaluate(String expressionKey) {
    Map<String, String> allowedExpressions = Map.of(
        "currentUser", "authentication.name",
        "isAdmin", "hasRole('ADMIN')"
    );
    
    String expression = allowedExpressions.get(expressionKey);
    if (expression == null) {
        throw new SecurityException("不允许的表达式");
    }
    
    ExpressionParser parser = new SpelExpressionParser();
    return parser.parseExpression(expression).getValue();
}
```

---

## 配置安全审查

### 敏感配置加密

```yaml
# ❌ 危险：明文密码
spring:
  datasource:
    password: 123456
  redis:
    password: redis123

# ✅ 安全：使用 Jasypt 加密
spring:
  datasource:
    password: ENC(encrypted_password_here)
  redis:
    password: ENC(encrypted_redis_password)

jasypt:
  encryptor:
    password: ${JASYPT_PASSWORD}  # 从环境变量读取
```

### Profile 管理

```yaml
# ❌ 危险：生产环境开启 debug
spring:
  profiles:
    active: prod
debug: true  # 生产环境不应开启!

# ✅ 安全：按环境配置
# application-prod.yml
debug: false
logging:
  level:
    root: WARN
    com.example: INFO

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

### DevTools 安全

```xml
<!-- ❌ 危险：生产环境包含 DevTools -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <!-- 缺少 scope 限制 -->
</dependency>

<!-- ✅ 安全：限制为开发环境 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

---

## 依赖注入审查

### 循环依赖检测

```java
// ❌ 循环依赖（Spring Boot 2.6+ 默认禁止）
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA;  // 循环依赖!
}

// ✅ 解决方案 1：@Lazy 延迟加载
@Service
public class ServiceA {
    @Lazy
    @Autowired
    private ServiceB serviceB;
}

// ✅ 解决方案 2：重构设计，提取公共逻辑
@Service
public class CommonService {
    // 公共逻辑
}

@Service
public class ServiceA {
    @Autowired
    private CommonService commonService;
}

@Service
public class ServiceB {
    @Autowired
    private CommonService commonService;
}
```

### 注入方式选择

```java
// ❌ 不推荐：字段注入（难以测试）
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}

// ✅ 推荐：构造器注入
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}

// 或显式构造器
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

---

## 检查清单

### Actuator 安全
- [ ] 未暴露 `/actuator/env` 端点
- [ ] 未暴露 `/actuator/heapdump` 端点
- [ ] 敏感端点有权限控制
- [ ] 修改了默认 Actuator 路径

### 事务管理
- [ ] 没有同类方法调用事务失效
- [ ] 事务方法都是 public
- [ ] 异常没有被吞掉
- [ ] 配置了 `rollbackFor = Exception.class`
- [ ] 事务传播行为正确

### 异步处理
- [ ] 自定义了 @Async 线程池
- [ ] 线程池有界队列
- [ ] 配置了拒绝策略
- [ ] 处理了异步异常
- [ ] 正确传递了上下文

### 配置安全
- [ ] 敏感配置已加密
- [ ] 生产环境关闭 debug
- [ ] DevTools 限制为开发环境
- [ ] Profile 配置正确

### SpEL 安全
- [ ] 没有用户输入进入 SpEL
- [ ] @PreAuthorize 表达式硬编码

### 依赖注入
- [ ] 没有循环依赖
- [ ] 使用构造器注入

---

## 相关资源

- [Java 代码审查指南](java-review.md)
- [检查清单](java-checklist.md)
- [审查示例](examples.md)

> 💡 如需专项安全扫描，请使用独立的 `code-security-scan` 技能
