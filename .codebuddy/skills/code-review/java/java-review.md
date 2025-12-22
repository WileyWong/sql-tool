# Java/Spring Boot 代码审查指南

基于 Spring Boot 微服务架构的企业级 Java 代码审查。

> 📚 **参考**: [代码审查最佳实践](mdc:.codebuddy/spec/global/knowledge/best-practices/general-code-review-best-practice.md)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-java-{时间戳}.md`

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 编码规范 | 15% | 命名、格式、注释、常量 |
| 架构设计 | 20% | 服务拆分、依赖管理、接口设计 |
| 安全防护 | 30% | 输入验证、权限控制、数据保护、OWASP Top 10 |
| 性能优化 | 15% | 缓存、查询、异步、资源 |
| 可维护性 | 10% | 复杂度、测试、日志、异常 |
| Java 8+ 特性 | 10% | Stream、Optional、时间 API、函数式编程 |

> ⚠️ **Spring Boot 项目**: 请同时参考 [Spring Boot 专项审查](springboot-review.md)

## Java 版本适配

### 版本识别

从 `pom.xml` 或 `build.gradle` 识别项目 Java 版本，建议方案必须兼容项目版本。

### 版本特性

| 版本 | 推荐特性 |
|------|---------|
| **Java 8** | Lambda、Stream、Optional、java.time |
| **Java 11** | var、新 String 方法、HTTP Client |
| **Java 17** | Record、Sealed Classes、Pattern Matching |
| **Java 21** | Record Patterns、Virtual Threads |

## Java 8+ 典型错误审查

### Optional 使用规范

```java
// ❌ 错误 1: 不检查直接 get()
Optional<User> user = userRepository.findById(id);
String name = user.get().getName();  // NoSuchElementException!

// ✅ 正确: 使用 orElse/orElseThrow
String name = userRepository.findById(id)
    .map(User::getName)
    .orElseThrow(() -> new NotFoundException("用户不存在"));

// ❌ 错误 2: Optional 作为字段或参数
public class User {
    private Optional<String> nickname;  // 不推荐!
}
public void process(Optional<String> param) { }  // 不推荐!

// ✅ 正确: Optional 只用于返回值
public Optional<User> findByEmail(String email) {
    return Optional.ofNullable(userMap.get(email));
}

// ❌ 错误 3: 嵌套 Optional
Optional<Optional<User>> nested;  // 设计问题!

// ❌ 错误 4: isPresent() + get() 组合
if (optional.isPresent()) {
    return optional.get();  // 应该用 orElse
}
```

### Stream API 误用

```java
// ❌ 错误 1: 并行流滥用（数据量小或 IO 操作）
list.parallelStream()  // 只有 10 条数据
    .map(this::callRemoteApi)  // IO 密集型不适合
    .collect(Collectors.toList());

// ✅ 正确: 小数据量用顺序流
list.stream()
    .map(this::transform)
    .collect(Collectors.toList());

// ❌ 错误 2: Stream 中有副作用
List<String> results = new ArrayList<>();
stream.forEach(item -> results.add(item));  // 副作用!

// ✅ 正确: 使用 collect
List<String> results = stream.collect(Collectors.toList());

// ❌ 错误 3: 多次消费 Stream
Stream<User> stream = users.stream();
long count = stream.count();
List<User> list = stream.collect(Collectors.toList());  // IllegalStateException!

// ✅ 正确: 重新创建 Stream
long count = users.stream().count();
List<User> list = users.stream().collect(Collectors.toList());

// ❌ 错误 4: findFirst().get()
String first = list.stream().filter(x -> x > 0).findFirst().get();

// ✅ 正确: 使用 orElse
String first = list.stream().filter(x -> x > 0).findFirst().orElse(defaultValue);
```

### 时间 API 陷阱

```java
// ❌ 错误 1: LocalDateTime 存储时间戳（丢失时区）
LocalDateTime createdAt = LocalDateTime.now();  // 无时区信息!

// ✅ 正确: 使用 Instant 或 ZonedDateTime
Instant createdAt = Instant.now();  // UTC 时间戳
ZonedDateTime zonedTime = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"));

// ❌ 错误 2: 字符串解析不指定格式
LocalDate.parse("2025-12-18");  // 依赖默认格式

// ✅ 正确: 明确指定格式
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
LocalDate.parse("2025-12-18", formatter);

// ❌ 错误 3: 时区转换错误
LocalDateTime.now().atZone(ZoneId.systemDefault());  // 系统默认时区不可靠

// ✅ 正确: 明确指定时区
ZonedDateTime.now(ZoneId.of("UTC"))
    .withZoneSameInstant(ZoneId.of("Asia/Shanghai"));
```

### BigDecimal 精度问题

```java
// ❌ 错误 1: 使用 double 构造器
BigDecimal price = new BigDecimal(0.1);  // 0.1000000000000000055511151231...

// ✅ 正确: 使用字符串构造器
BigDecimal price = new BigDecimal("0.1");

// ❌ 错误 2: 除法不指定精度
BigDecimal result = a.divide(b);  // ArithmeticException!

// ✅ 正确: 指定精度和舍入模式
BigDecimal result = a.divide(b, 2, RoundingMode.HALF_UP);

// ❌ 错误 3: 使用 equals 比较（比较精度）
new BigDecimal("1.0").equals(new BigDecimal("1.00"));  // false!

// ✅ 正确: 使用 compareTo
new BigDecimal("1.0").compareTo(new BigDecimal("1.00")) == 0;  // true
```

## 编码规范审查

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | 大驼峰 | `UserService` |
| 方法名 | 小驼峰 | `getUserById` |
| 变量名 | 小驼峰 | `userName` |
| 常量 | 全大写下划线 | `MAX_RETRY_COUNT` |
| 包名 | 小写点分隔 | `com.example.user` |

### 代码格式

- 缩进：4 个空格
- 行长度：不超过 120 字符
- 大括号：K&R 风格（左括号不换行）

### 注释要求

```java
/**
 * 用户服务类
 * 
 * 负责用户相关的业务逻辑。
 * 
 * @author Spec-Code Team
 */
@Service
public class UserService {
    
    /**
     * 根据 ID 获取用户
     * 
     * @param id 用户 ID
     * @return 用户信息
     * @throws NotFoundException 如果用户不存在
     */
    public User getUserById(Long id) {
        // ...
    }
}
```

## 架构设计审查

### 分层架构

```
Controller → Service → Repository → Entity
    ↓           ↓           ↓
  DTO/VO      业务逻辑    数据访问
```

### 依赖方向

- ✅ Controller 依赖 Service
- ✅ Service 依赖 Repository
- ❌ Service 不依赖 Controller
- ❌ Repository 不依赖 Service

### 接口设计

| 规范 | 说明 |
|------|------|
| RESTful | URL 使用名词复数 `/users` |
| HTTP 方法 | GET/POST/PUT/DELETE 语义正确 |
| 响应格式 | 统一 ApiResponse 结构 |
| 错误码 | 清晰定义，便于排查 |

## 安全防护审查

### OWASP Top 10 检测

> 💡 如需专项安全扫描，请使用独立的 `code-security-scan` 技能

| 漏洞类型 | CWE | 风险 | 检测要点 |
|---------|-----|------|---------|
| SQL 注入 | CWE-89 | 🔴 | MyBatis `${}`、字符串拼接 |
| XSS | CWE-79 | 🟠 | 未转义输出、v-html |
| SSRF | CWE-918 | 🔴 | 用户控制的 URL 请求 |
| XXE | CWE-611 | 🔴 | XML 解析器配置 |
| IDOR | CWE-639 | 🟠 | 未验证资源所有权 |
| Mass Assignment | CWE-915 | 🟠 | 直接绑定实体 |
| 日志注入 | CWE-117 | 🟡 | 用户输入写入日志 |

### 输入验证

```java
@Data
public class RegisterRequest {
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度 8-32 位")
    private String password;
}
```

### SQL 注入防护

```java
// ❌ 危险：字符串拼接
@Select("SELECT * FROM users WHERE id = ${userId}")

// ✅ 安全：参数化查询
@Select("SELECT * FROM users WHERE id = #{userId}")
```

### SSRF 防护 (CWE-918)

```java
// ❌ 危险：用户控制的 URL
@GetMapping("/fetch")
public String fetchUrl(@RequestParam String url) {
    return restTemplate.getForObject(url, String.class);  // SSRF!
}

// ✅ 安全：URL 白名单 + 内网地址检测
private static final Set<String> ALLOWED_HOSTS = Set.of("api.example.com");

public String fetchUrl(String url) throws MalformedURLException {
    URL parsedUrl = new URL(url);
    if (!ALLOWED_HOSTS.contains(parsedUrl.getHost())) {
        throw new SecurityException("不允许的目标地址");
    }
    if (isInternalAddress(parsedUrl.getHost())) {
        throw new SecurityException("禁止访问内网地址");
    }
    return restTemplate.getForObject(url, String.class);
}
```

### XXE 防护 (CWE-611)

```java
// ❌ 危险：默认 XML 解析器
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
Document doc = factory.newDocumentBuilder().parse(xmlInput);

// ✅ 安全：禁用外部实体
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
factory.setXIncludeAware(false);
factory.setExpandEntityReferences(false);
```

### IDOR 防护 (CWE-639)

```java
// ❌ 危险：未验证资源所有权
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderRepository.findById(id).orElseThrow();  // 可查看他人订单!
}

// ✅ 安全：验证资源所有权
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id, @AuthenticationPrincipal User user) {
    Order order = orderRepository.findById(id).orElseThrow();
    if (!order.getUserId().equals(user.getId())) {
        throw new AccessDeniedException("无权访问此订单");
    }
    return order;
}
```

### Mass Assignment 防护 (CWE-915)

```java
// ❌ 危险：直接绑定实体
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userRepository.save(user);  // 可能设置 isAdmin=true!
}

// ✅ 安全：使用 DTO + 白名单字段
@PostMapping("/users")
public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
    User user = new User();
    user.setUsername(request.getUsername());  // 只复制允许的字段
    user.setEmail(request.getEmail());
    // isAdmin 等敏感字段不从请求中获取
    return userConverter.toResponse(userRepository.save(user));
}
```

### 权限控制

```java
// ✅ 敏感接口添加权限注解
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ApiResponse<Void> deleteUser(@PathVariable Long id) {
    // ...
}
```

### 敏感数据保护

- 密码使用 BCrypt 加密
- 响应 DTO 不包含密码字段
- 日志脱敏，不打印敏感信息
- 配置使用 Jasypt 加密

## 性能优化审查

### 缓存策略

```java
@Cacheable(value = "user", key = "#id", unless = "#result == null")
public User getUserById(Long id) {
    return userRepository.findById(id).orElse(null);
}

@CacheEvict(value = "user", key = "#id")
public void updateUser(Long id, UpdateUserRequest request) {
    // ...
}
```

### N+1 查询优化

```java
// ❌ N+1 问题
orders.forEach(order -> {
    List<OrderItem> items = itemRepository.findByOrderId(order.getId());
});

// ✅ 批量查询
List<Long> orderIds = orders.stream().map(Order::getId).toList();
List<OrderItem> allItems = itemRepository.findByOrderIdIn(orderIds);
Map<Long, List<OrderItem>> itemsMap = allItems.stream()
    .collect(Collectors.groupingBy(OrderItem::getOrderId));
```

### 异步处理

```java
@Async
@Transactional
public CompletableFuture<Void> sendNotification(Long userId, String message) {
    // 耗时操作异步执行
}
```

## 可维护性审查

### 代码复杂度

| 指标 | 阈值 |
|------|------|
| 方法行数 | ≤ 50 行 |
| 圈复杂度 | ≤ 10 |
| 嵌套层级 | ≤ 3 层 |
| 参数数量 | ≤ 5 个 |

### 异常处理

```java
// ❌ 吞掉异常
try {
    // ...
} catch (Exception e) {
    // 空处理
}

// ✅ 正确处理
try {
    // ...
} catch (DataAccessException e) {
    log.error("数据库操作失败", e);
    throw new BusinessException("操作失败，请稍后重试", e);
}
```

### 事务控制

```java
@Transactional(rollbackFor = Exception.class)
public void createOrder(CreateOrderRequest request) {
    // 多个数据库操作在同一事务中
}
```

### ThreadLocal 内存泄漏

```java
// ❌ 危险：ThreadLocal 未清理（线程池场景）
public class UserContext {
    private static final ThreadLocal<User> currentUser = new ThreadLocal<>();
    
    public static void setUser(User user) {
        currentUser.set(user);
    }
    // 缺少 remove 方法!
}

// ✅ 正确：必须清理
public class UserContext {
    private static final ThreadLocal<User> currentUser = new ThreadLocal<>();
    
    public static void setUser(User user) {
        currentUser.set(user);
    }
    
    public static void clear() {
        currentUser.remove();  // 必须清理!
    }
}

// Filter 中清理
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    try {
        UserContext.setUser(extractUser(request));
        chain.doFilter(request, response);
    } finally {
        UserContext.clear();  // finally 中清理
    }
}
```

## 评分细则

### 编码规范 (15%)

| 子项 | 占比 |
|------|------|
| 命名规范 | 30% |
| 代码格式 | 25% |
| 注释完整性 | 25% |
| 常量使用 | 20% |

### 架构设计 (20%)

| 子项 | 占比 |
|------|------|
| 服务拆分 | 40% |
| 依赖管理 | 30% |
| 接口设计 | 30% |

### 安全防护 (30%)

| 子项 | 占比 |
|------|------|
| 输入验证 | 25% |
| 权限控制 | 20% |
| 数据保护 | 20% |
| OWASP 漏洞 | 20% |
| 日志安全 | 15% |

### Java 8+ 特性 (10%)

| 子项 | 占比 |
|------|------|
| Optional 使用 | 30% |
| Stream API | 30% |
| 时间 API | 20% |
| 函数式编程 | 20% |

## 参考标准

- 阿里巴巴 Java 开发手册
- Google Java Style Guide
- Spring Boot 官方最佳实践
- OWASP 安全标准
- Clean Code 编程规范

## 相关资源

- [检查清单](java-checklist.md)
- [审查示例](examples.md)
- [Spring Boot 专项审查](springboot-review.md)

> 💡 如需专项安全扫描，请使用独立的 `code-security-scan` 技能
