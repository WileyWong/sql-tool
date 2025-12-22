# API 设计规范

**适用范围**: 所有基于 Spring Boot 3.x 的招聘相关微服务  
**文档版本**: 1.0  
**最后更新**: 2025-01-15

---

## 📋 概述

本规范定义了 RESTful API 的设计标准，包括统一响应格式、参数校验、异常处理、数据脱敏等，确保所有 API 的一致性和高质量。

**核心原则**：
- 统一的响应格式
- 清晰的错误处理
- 完整的参数校验
- 敏感信息保护

---

## 🏗️ 统一响应格式

### 1. 响应结构

所有 API 响应都应遵循统一的格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 业务数据
  },
  "timestamp": 1642000000000
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 状态码，0 表示成功，非 0 表示失败 |
| message | String | 状态消息，成功时为 "success"，失败时为错误描述 |
| data | Object | 业务数据，成功时返回数据，失败时为 null |
| timestamp | Long | 响应时间戳（毫秒） |

### 2. 成功响应

#### 查询单个对象
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "createdAt": "2025-01-15 10:00:00"
  },
  "timestamp": 1642000000000
}
```

#### 查询列表
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "username": "john",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "username": "jane",
      "email": "jane@example.com"
    }
  ],
  "timestamp": 1642000000000
}
```

#### 分页查询
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageNo": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10,
    "records": [
      {
        "id": 1,
        "username": "john",
        "email": "john@example.com"
      }
    ]
  },
  "timestamp": 1642000000000
}
```

#### 创建/更新/删除
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1
  },
  "timestamp": 1642000000000
}
```

### 3. 失败响应

#### 业务异常
```json
{
  "code": 1001,
  "message": "用户不存在",
  "data": null,
  "timestamp": 1642000000000
}
```

#### 参数校验失败
```json
{
  "code": 400,
  "message": "参数校验失败: 用户名不能为空, 邮箱格式不正确",
  "data": null,
  "timestamp": 1642000000000
}
```

#### 系统异常
```json
{
  "code": 500,
  "message": "系统异常，请稍后重试",
  "data": null,
  "timestamp": 1642000000000
}
```

### 4. 状态码定义

| 状态码 | 说明 | 使用场景 |
|--------|------|---------|
| 0 | 成功 | 所有成功的请求 |
| 400 | 参数错误 | 参数校验失败 |
| 401 | 未认证 | 未登录或 token 过期 |
| 403 | 无权限 | 没有访问权限 |
| 404 | 不存在 | 资源不存在 |
| 500 | 系统异常 | 服务器内部错误 |
| 1000-1999 | 业务异常 | 业务相关的错误 |

### 5. Java 实现

#### Result 类
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    // 成功响应
    public static <T> Result<T> success(T data) {
        return new Result<>(0, "success", data, System.currentTimeMillis());
    }
    
    public static <T> Result<T> success() {
        return success(null);
    }
    
    // 失败响应
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null, System.currentTimeMillis());
    }
    
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }
}
```

#### Controller 使用
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 查询用户信息
     */
    @GetMapping("/{id}")
    public Result<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return Result.success(user);
    }
    
    /**
     * 创建用户
     */
    @PostMapping
    public Result<Long> createUser(@Valid @RequestBody UserCreateRequest request) {
        Long userId = userService.createUser(request);
        return Result.success(userId);
    }
    
    /**
     * 分页查询用户
     */
    @GetMapping
    public Result<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        
        PageResponse<UserResponse> pageData = userService.getUsers(pageNo, pageSize);
        return Result.success(pageData);
    }
}
```

---

## ✅ 参数校验规范

### 1. 校验注解

使用 JSR-303 注解进行参数校验：

| 注解 | 说明 | 示例 |
|------|------|------|
| @NotNull | 不能为 null | `@NotNull(message = "ID 不能为空")` |
| @NotBlank | 不能为空字符串 | `@NotBlank(message = "用户名不能为空")` |
| @NotEmpty | 不能为空集合 | `@NotEmpty(message = "列表不能为空")` |
| @Size | 字符串或集合大小 | `@Size(min = 2, max = 10)` |
| @Min | 最小值 | `@Min(value = 0)` |
| @Max | 最大值 | `@Max(value = 100)` |
| @Email | 邮箱格式 | `@Email(message = "邮箱格式不正确")` |
| @Pattern | 正则表达式 | `@Pattern(regexp = "^[0-9]{11}$")` |
| @Range | 范围 | `@Range(min = 0, max = 100)` |

### 2. 请求对象定义

```java
@Data
@AutoTrim  // 自动去除前后空格
public class UserCreateRequest {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 50, message = "用户名长度应在 2-50 之间")
    private String username;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度应在 6-20 之间")
    @AutoTrim.Ignore  // 密码不去空格
    private String password;
    
    @Min(value = 18, message = "年龄不能小于 18")
    @Max(value = 65, message = "年龄不能大于 65")
    private Integer age;
}
```

### 3. 全局异常处理

```java
@ControllerAdvice
@ResponseBody
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining(", "));
        return Result.error(400, "参数校验失败: " + message);
    }
    
    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException ex) {
        log.warn("业务异常: {}", ex.getMessage());
        return Result.error(ex.getCode(), ex.getMessage());
    }
    
    /**
     * 处理系统异常
     */
    @ExceptionHandler(Exception.class)
    public Result<?> handleSystemException(Exception ex) {
        log.error("系统异常", ex);
        return Result.error(500, "系统异常，请稍后重试");
    }
}
```

---

## 🚨 异常处理规范

### 1. 异常分类

#### 业务异常
```java
public class BusinessException extends RuntimeException {
    private Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = 1000;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public Integer getCode() {
        return code;
    }
}
```

#### 使用示例
```java
@Service
public class UserService {
    
    public UserDTO getUserById(Long userId) {
        UserPO user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException(1001, "用户不存在");
        }
        return convertToDTO(user);
    }
    
    public void createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(1002, "用户名已存在");
        }
        // 创建用户逻辑
    }
}
```

### 2. 异常码定义

| 异常码 | 说明 | 使用场景 |
|--------|------|---------|
| 1001 | 用户不存在 | 查询用户时 |
| 1002 | 用户名已存在 | 创建用户时 |
| 1003 | 密码错误 | 登录时 |
| 1004 | 权限不足 | 访问受限资源时 |
| 1005 | 资源不存在 | 查询资源时 |
| 1006 | 操作失败 | 通用业务失败 |

### 3. 异常处理最佳实践

- ✅ **分层异常处理**：区分系统异常、业务异常、参数异常
- ✅ **异常通知**：重要异常及时发送邮件或消息通知
- ✅ **日志记录**：详细记录异常信息，便于问题排查
- ✅ **用户友好**：向用户返回友好的错误提示
- ✅ **异常恢复**：在可能的情况下提供恢复建议

---

## 🔐 数据脱敏规范

### 1. 脱敏类型

| 类型 | 示例 | 规则 |
|------|------|------|
| 手机号 | 138****8000 | 保留前 3 位和后 4 位 |
| 邮箱 | u****@example.com | 保留前 1 位和域名 |
| 身份证 | 1101****3071234 | 保留前 4 位和后 4 位 |
| 银行卡 | ****8000 | 只保留后 4 位 |
| 密码 | *** | 完全隐藏 |

### 2. 响应对象定义

```java
@Data
public class UserResponse {
    
    private Long id;
    
    private String username;
    
    @Desensitization(type = DesensitizationType.PHONE)
    private String phone;     // 138****8000
    
    @Desensitization(type = DesensitizationType.EMAIL)
    private String email;     // u****@example.com
    
    @Desensitization(type = DesensitizationType.ID_CARD)
    private String idCard;    // 1101****3071234
    
    private LocalDateTime createdAt;
}
```

### 3. 脱敏注解实现

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Desensitization {
    DesensitizationType type();
}

public enum DesensitizationType {
    PHONE,
    EMAIL,
    ID_CARD,
    BANK_CARD,
    PASSWORD
}

@Component
public class DesensitizationSerializer extends StdSerializer<String> {
    
    public DesensitizationSerializer() {
        super(String.class);
    }
    
    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider) 
            throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }
        
        // 根据字段的 @Desensitization 注解进行脱敏
        gen.writeString(desensitize(value));
    }
    
    private String desensitize(String value) {
        // 脱敏逻辑
        return value;
    }
}
```

---

## 🔄 并发控制规范

### 1. 分布式锁

使用 @LockDistributed 注解防止并发问题：

```java
@Service
public class OrderService {
    
    /**
     * 防止重复下单
     */
    @LockDistributed(key = "order:create:#{args[0]}", timeout = 10)
    public OrderDTO createOrder(Long userId, OrderRequest request) {
        // 检查用户是否已有未完成订单
        // 创建订单逻辑
        return orderDTO;
    }
    
    /**
     * 库存扣减 - 防止超卖
     */
    @LockDistributed(key = "inventory:#{args[0]}:#{args[1]}", timeout = 15)
    public void reduceInventory(Long productId, Integer quantity) {
        // 检查库存
        // 扣减库存
    }
}
```

### 2. 缓存策略

使用 @RecruitCache 注解实现缓存：

```java
@Service
public class UserService {
    
    /**
     * 基础缓存 - 默认 Redis 缓存，3600 秒过期
     */
    @RecruitCache(value = "#{serviceName}:user:#{args[0]}")
    public UserDTO getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    
    /**
     * 条件缓存 - 只缓存非空结果
     */
    @RecruitCache(
        value = "#{serviceName}:user:#{args[0]}", 
        condition = "#{result != null}",
        expire = 1800
    )
    public UserDTO getUserByName(String userName) {
        return userRepository.findByName(userName);
    }
    
    /**
     * 缓存清除
     */
    @RecruitCache(
        value = "#{serviceName}:user:#{args[0]}", 
        action = RecruitCacheAction.Clear
    )
    public void clearUserCache(Long userId) {
        log.info("清除用户缓存: {}", userId);
    }
}
```

---

## 📝 API 设计检查清单

在完成 API 设计后，请检查以下项目：

- [ ] **响应格式**
  - [ ] 所有响应都使用统一的 Result 格式
  - [ ] 成功响应的 code 为 0
  - [ ] 失败响应有明确的错误码和错误信息
  - [ ] 所有响应都包含 timestamp

- [ ] **参数校验**
  - [ ] 所有请求参数都有校验注解
  - [ ] 校验错误信息清晰明确
  - [ ] 有全局异常处理器处理校验异常

- [ ] **异常处理**
  - [ ] 业务异常有明确的异常码
  - [ ] 异常处理器覆盖所有异常类型
  - [ ] 异常信息对用户友好

- [ ] **数据脱敏**
  - [ ] 敏感信息都有脱敏处理
  - [ ] 脱敏规则符合业务要求

- [ ] **并发控制**
  - [ ] 高并发操作使用分布式锁
  - [ ] 热点数据使用缓存
  - [ ] 缓存过期时间合理

- [ ] **文档**
  - [ ] 所有 API 都有清晰的文档
  - [ ] 文档包含请求示例和响应示例
  - [ ] 文档包含错误码说明

---

## 🔧 常见问题

### Q1: 如何处理分页查询？
**A**: 使用统一的分页响应格式：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageNo": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10,
    "records": [...]
  }
}
```

### Q2: 如何处理文件上传？
**A**: 返回文件 URL 或文件 ID：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "fileId": "abc123",
    "fileUrl": "https://example.com/files/abc123"
  }
}
```

### Q3: 如何处理批量操作？
**A**: 返回成功和失败的统计：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 10,
    "success": 8,
    "failed": 2,
    "errors": [
      {"id": 1, "message": "用户不存在"},
      {"id": 2, "message": "权限不足"}
    ]
  }
}
```

### Q4: 如何处理异步操作？
**A**: 返回任务 ID，客户端可以查询任务状态：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "taskId": "task123",
    "status": "processing"
  }
}
```

---

## 📚 参考资源

- [RESTful API 设计指南](https://restfulapi.net/)

- [数据库设计规范](./database.md)

---

**文档版本**: v1.0  
**最后更新**: 2025-01-15  
**维护者**: 架构团队
