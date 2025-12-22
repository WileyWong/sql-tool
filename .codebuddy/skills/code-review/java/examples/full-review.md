# 示例 1: Spring Boot 微服务代码审查（完整流程）

## 场景描述

**业务背景**: 为企业管理系统的用户服务模块进行代码审查，该模块提供用户注册、登录、信息管理等核心功能。

**技术栈**:
- Spring Boot 3.2.x
- MyBatis-Plus 3.5.x
- MySQL 8.0.x
- Redis 7.0.x
- Spring Security + JWT

**审查目标**:
1. 确保代码符合企业级开发规范
2. 发现潜在的安全隐患
3. 识别性能优化机会
4. 评估代码可维护性

---

## 步骤 1: 编码规范审查

### 1.1 Controller 层审查

**代码示例**:

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);
        return ApiResponse.success(user);
    }
    
    @GetMapping
    @PreAuthorize("hasAuthority('user:read')")
    public ApiResponse<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword
    ) {
        Page<UserResponse> users = userService.getUsers(page, size, keyword);
        return ApiResponse.success(users);
    }
}
```

**审查结果**:

✅ **做得好的地方**:
- 类名使用大驼峰命名（UserController）
- 使用 `@RequiredArgsConstructor` 实现依赖注入
- 使用 `@Valid` 进行参数验证
- 使用 `@PreAuthorize` 进行权限控制
- 分页参数提供默认值

⚠️ **需要改进**:
1. **缺少 JavaDoc 注释**: 公共方法需要添加 JavaDoc
2. **分页参数未限制最大值**: `size` 应限制最大值（如 100）

**改进建议**:

```java
/**
 * 用户管理 Controller
 * 
 * 提供用户注册、登录、信息查询等 REST API 接口。
 * 
 * @author Spec-Code Team
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 注册成功的用户信息
     */
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);
        return ApiResponse.success(user);
    }
    
    /**
     * 获取用户列表（分页）
     * 
     * @param page 页码（从 1 开始）
     * @param size 每页数量（最大 100）
     * @param keyword 搜索关键词（可选）
     * @return 用户分页数据
     */
    @GetMapping
    @PreAuthorize("hasAuthority('user:read')")
    public ApiResponse<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @RequestParam(required = false) String keyword
    ) {
        Page<UserResponse> users = userService.getUsers(page, size, keyword);
        return ApiResponse.success(users);
    }
}
```

### 1.2 Service 层审查

**代码示例**:

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException("手机号已注册");
        }
        
        User user = new User();
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setCreatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        return convertToResponse(user);
    }
}
```

**审查结果**:

✅ **做得好的地方**:
- 使用 BCrypt 加密密码
- 检查手机号唯一性
- 方法职责单一

🔴 **严重问题**:
1. **缺少事务控制**: 注册操作应该使用 `@Transactional`
2. **缺少 JavaDoc**: 公共方法需要注释
3. **魔法值**: `"手机号已注册"` 应该使用常量或国际化

⚠️ **可优化**:
1. **异常处理不完整**: 应该捕获数据库异常并转换为业务异常
2. **缺少日志**: 关键操作应该记录日志

**改进建议**:

```java
/**
 * 用户服务类
 * 
 * 负责用户相关的业务逻辑，包括注册、登录、信息管理等。
 * 
 * @author Spec-Code Team
 */
@Service
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * 用户注册
     * 
     * 创建新用户账号，手机号必须唯一，密码使用 BCrypt 加密。
     * 
     * @param request 注册请求
     * @return 注册成功的用户信息
     * @throws BusinessException 如果手机号已注册
     */
    @Transactional(rollbackFor = Exception.class)
    public UserResponse register(RegisterRequest request) {
        log.info("用户注册开始，手机号: {}", request.getPhone());
        
        // 检查手机号唯一性
        if (userRepository.existsByPhone(request.getPhone())) {
            log.warn("手机号已注册: {}", request.getPhone());
            throw new BusinessException(ErrorCode.PHONE_ALREADY_EXISTS);
        }
        
        try {
            User user = new User();
            user.setPhone(request.getPhone());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setUsername(request.getUsername());
            user.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(user);
            
            log.info("用户注册成功，用户ID: {}", user.getId());
            return convertToResponse(user);
        } catch (DataAccessException e) {
            log.error("用户注册失败，手机号: {}", request.getPhone(), e);
            throw new BusinessException(ErrorCode.DATABASE_ERROR, "注册失败，请稍后重试");
        }
    }
}
```

---

## 步骤 2: 架构设计审查

### 2.1 服务拆分审查

**场景**: 订单服务包含订单管理、库存管理、支付管理

**审查结果**:

🔴 **严重问题**: 服务职责过重，违反单一职责原则

**改进建议**: 拆分为独立微服务

```
订单服务 (OrderService)
├── 订单管理
└── 订单状态流转

库存服务 (InventoryService)
├── 库存扣减
└── 库存恢复

支付服务 (PaymentService)
├── 支付处理
└── 退款处理
```

### 2.2 依赖关系审查

**代码示例**:

```java
// ❌ 错误：Service 层依赖 Controller 层
@Service
public class UserService {
    @Autowired
    private UserController userController; // 依赖方向错误
}

// ❌ 错误：Service 层直接操作 HttpServletRequest
@Service
public class UserService {
    public void updateUser(HttpServletRequest request) {
        String userId = request.getParameter("userId");
        // ...
    }
}
```

**改进建议**:

```java
// ✅ 正确：Controller 依赖 Service
@RestController
public class UserController {
    private final UserService userService;
}

// ✅ 正确：Service 层接收业务对象
@Service
public class UserService {
    public void updateUser(UpdateUserRequest request) {
        // ...
    }
}
```

---

## 步骤 3: 安全防护审查

### 3.1 输入验证审查

**代码示例**:

```java
@Data
public class RegisterRequest {
    private String phone;
    private String password;
    private String username;
}
```

**审查结果**:

🔴 **严重问题**: 缺少输入验证，存在安全风险

**改进建议**:

```java
@Data
public class RegisterRequest {
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度必须在 8-32 之间")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "密码必须包含大小写字母、数字和特殊字符"
    )
    private String password;
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在 2-20 之间")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "用户名只能包含字母、数字、下划线和连字符")
    private String username;
}
```

### 3.2 SQL 注入防护审查

**代码示例**:

```java
// ❌ 错误：SQL 拼接，存在 SQL 注入风险
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE username = '${username}'")
    User findByUsername(String username);
}
```

**改进建议**:

```java
// ✅ 正确：使用参数化查询
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);
}
```

### 3.3 敏感数据脱敏审查

**代码示例**:

```java
// ❌ 错误：返回密码字段
@Data
public class UserResponse {
    private Long id;
    private String phone;
    private String password; // 不应该返回密码
    private String username;
}
```

**改进建议**:

```java
// ✅ 正确：不返回敏感字段
@Data
public class UserResponse {
    private Long id;
    
    @JsonProperty("phone")
    @JsonSerialize(using = PhoneDesensitizeSerializer.class)
    private String phone; // 脱敏显示（如 138****8888）
    
    private String username;
    private LocalDateTime createdAt;
}
```

---

## 步骤 4: 性能优化审查

### 4.1 N+1 查询问题

**代码示例**:

```java
// ❌ 错误：N+1 查询问题
public List<OrderResponse> getOrders() {
    List<Order> orders = orderRepository.findAll();
    return orders.stream()
        .map(order -> {
            // 每次循环都查询一次数据库
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return convertToResponse(order, items);
        })
        .collect(Collectors.toList());
}
```

**改进建议**:

```java
// ✅ 正确：使用联表查询或批量查询
public List<OrderResponse> getOrders() {
    // 方案 1: 使用联表查询（MyBatis-Plus）
    List<Order> orders = orderRepository.selectList(
        new LambdaQueryWrapper<Order>()
            .eq(Order::getDeleted, 0)
    );
    
    // 批量查询订单项（只查询一次）
    List<Long> orderIds = orders.stream()
        .map(Order::getId)
        .collect(Collectors.toList());
    
    List<OrderItem> allItems = orderItemRepository.selectList(
        new LambdaQueryWrapper<OrderItem>()
            .in(OrderItem::getOrderId, orderIds)
    );
    
    // 按订单 ID 分组
    Map<Long, List<OrderItem>> itemsMap = allItems.stream()
        .collect(Collectors.groupingBy(OrderItem::getOrderId));
    
    return orders.stream()
        .map(order -> convertToResponse(order, itemsMap.get(order.getId())))
        .collect(Collectors.toList());
}
```

### 4.2 缓存优化审查

**代码示例**:

```java
// ❌ 未使用缓存
public User getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("用户不存在"));
}
```

**改进建议**:

```java
// ✅ 使用 Redis 缓存热点数据
@Cacheable(value = "user", key = "#id", unless = "#result == null")
public User getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("用户不存在"));
}

@CacheEvict(value = "user", key = "#id")
public void updateUser(Long id, UpdateUserRequest request) {
    // 更新用户，自动清除缓存
}
```

---

## 步骤 5: 生成审查报告

### 5.1 综合评分

| 维度 | 权重 | 得分 | 状态 | 主要问题 |
|------|------|------|------|----------|
| 编码规范 | 20% | 75/100 | ⚠️ | 缺少 JavaDoc 注释，部分魔法值未使用常量 |
| 架构设计 | 25% | 80/100 | ✅ | 服务拆分合理，依赖方向正确 |
| 安全防护 | 25% | 65/100 | 🔴 | 输入验证不完整，敏感数据未脱敏 |
| 性能优化 | 15% | 70/100 | ⚠️ | 存在 N+1 查询，未使用缓存 |
| 可维护性 | 15% | 75/100 | ⚠️ | 缺少单元测试，异常处理不完善 |

**综合得分**: **73/100** (C级)

### 5.2 关键问题清单

🔴 **关键问题（必须修复）**:
1. **缺少事务控制** - `UserService.register:45` - 🔴 - 添加 `@Transactional`
2. **SQL 注入风险** - `UserMapper.findByUsername:12` - 🔴 - 使用 `#{}` 替代 `${}`
3. **敏感数据泄露** - `UserResponse.java:15` - 🔴 - 移除 password 字段
4. **缺少输入验证** - `RegisterRequest.java` - 🔴 - 添加验证注解

⚠️ **优化建议（建议修复）**:
1. **N+1 查询** - `OrderService.getOrders:23` - ⚠️ - 使用批量查询
2. **缺少缓存** - `UserService.getUserById:56` - ⚠️ - 添加 `@Cacheable`
3. **缺少日志** - `UserService.register:45` - ⚠️ - 添加关键操作日志
4. **魔法值** - `UserService.register:50` - ⚠️ - 使用常量或国际化

🟢 **优化建议（可选）**:
1. **分页参数未限制** - `UserController.getUsers:28` - 🟢 - 添加 `@Max(100)`
2. **缺少 JavaDoc** - `UserController.java` - 🟢 - 添加类和方法注释

### 5.3 改进优先级

**P0（立即修复）**:
- 添加事务控制
- 修复 SQL 注入风险
- 移除敏感数据字段
- 添加输入验证

**P1（本周内修复）**:
- 优化 N+1 查询
- 添加缓存机制
- 完善异常处理
- 添加关键日志

**P2（下个迭代）**:
- 补充 JavaDoc
- 增加单元测试
- 优化代码结构
