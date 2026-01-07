# Spring Boot 开发规范

## 项目结构

### 标准目录结构（默认）

```
src/main/java/com/example/project/
├── Application.java                # 应用启动类
├── aspect/                         # 切面（AOP）
│   ├── DistributedLockAspect.java  # 分布式锁切面
│   └── PermissionAspect.java       # 权限校验切面
├── controller/                     # 控制器层（接口层）
│   └── UserController.java
├── entity/                         # 数据库实体类
│   └── User.java
├── enums/                          # 枚举类
│   └── StatusCode.java
├── exception/                      # 异常处理
│   ├── BusinessException.java      # 业务异常
│   └── GlobalExceptionHandler.java # 全局异常处理器
├── interceptor/                    # 拦截器
│   ├── AccessLogInterceptor.java   # 访问日志拦截器
│   └── AuthInterceptor.java        # 认证拦截器
├── mapper/                         # MyBatis Mapper 层
│   └── UserMapper.java
├── model/                          # DTO/VO 模型
│   ├── UserDto.java
│   └── UserVO.java
├── service/                        # 服务层
│   ├── UserService.java
│   └── impl/
│       └── UserServiceImpl.java
├── util/                           # 工具类
│   └── BeanCopyUtil.java
└── webconfig/                      # Web 配置
    ├── MybatisPlusConfig.java      # MyBatis-Plus 配置
    ├── RedisConfig.java            # Redis 配置
    └── WebMvcConfig.java           # Web MVC 配置
```

**分层说明**：

| 目录 | 职责 |
|------|------|
| `controller` | 接口层，处理 HTTP 请求 |
| `service` | 业务逻辑层 |
| `mapper` | 数据访问层（MyBatis-Plus） |
| `entity` | 数据库实体 |
| `model` | DTO/VO 数据传输对象 |
| `aspect` | AOP 切面（分布式锁、权限等） |
| `interceptor` | 拦截器（日志、认证等） |
| `exception` | 全局异常处理 |
| `webconfig` | 各类配置（Redis、MyBatis 等） |
| `util` | 工具类 |
| `enums` | 枚举定义 |

### 可选目录结构（细粒度）

<details>
<summary>适用于需要更细粒度分层的项目</summary>

```
src/main/java/com/example/project/
├── config/                 # 配置类
│   ├── WebConfig.java
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
├── controller/             # 控制器层
│   └── UserController.java
├── service/                # 服务层
│   ├── UserService.java
│   └── impl/
│       └── UserServiceImpl.java
├── mapper/                 # 数据访问层
│   └── UserMapper.java
├── entity/                 # 实体类
│   └── User.java
├── dto/                    # 数据传输对象
│   ├── request/
│   │   └── CreateUserRequest.java
│   └── response/
│       └── UserResponse.java
├── vo/                     # 视图对象
│   └── UserVO.java
├── converter/              # 对象转换器
│   └── UserConverter.java
├── common/                 # 公共模块
│   ├── exception/          # 异常类
│   ├── result/             # 统一响应
│   ├── constant/           # 常量
│   └── util/               # 工具类
└── Application.java        # 启动类
```

**与标准结构的差异**：
- `dto/request` + `dto/response` 替代 `model`（更细粒度）
- `converter` 独立目录（对象转换器）
- `common` 聚合公共模块
- `config` 替代 `webconfig`

</details>

## Controller 层规范

### 基本规范

```java
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {
    
    private final UserService userService;
    private final UserConverter userConverter;
    
    // ✅ 构造器注入（推荐）
    public UserController(UserService userService, UserConverter userConverter) {
        this.userService = userService;
        this.userConverter = userConverter;
    }
    
    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<UserVO> getUser(@PathVariable Long id) {
        User user = userService.getById(id);
        return Result.success(userConverter.toVO(user));
    }
    
    @Operation(summary = "创建用户")
    @PostMapping
    public Result<Long> createUser(@Valid @RequestBody CreateUserRequest request) {
        Long userId = userService.createUser(request);
        return Result.success(userId);
    }
    
    @Operation(summary = "更新用户")
    @PutMapping("/{id}")
    public Result<Void> updateUser(@PathVariable Long id, 
                                   @Valid @RequestBody UpdateUserRequest request) {
        userService.updateUser(id, request);
        return Result.success();
    }
    
    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }
    
    @Operation(summary = "分页查询用户")
    @GetMapping
    public Result<PageResult<UserVO>> listUsers(
            @Valid UserQueryRequest request,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<User> page = userService.listUsers(request, pageNum, pageSize);
        return Result.success(page.map(userConverter::toVO));
    }
}
```

### Controller 规范要点

| 规范 | 说明 |
|------|------|
| 类注解 | `@RestController` + `@RequestMapping` |
| 路径命名 | RESTful 风格，复数名词 `/api/v1/users` |
| 方法命名 | `getXxx`, `createXxx`, `updateXxx`, `deleteXxx`, `listXxx` |
| 参数校验 | 使用 `@Valid` 触发校验 |
| 返回值 | 统一使用 `Result<T>` 包装 |
| 不处理业务 | Controller 只做参数接收和结果转换 |

## Service 层规范

### 接口定义

```java
/**
 * 用户服务接口
 * 继承 IService 获取 MyBatis-Plus 内置方法
 */
public interface UserService extends IService<User> {
    
    /**
     * 创建用户
     * @param request 创建请求
     * @return 用户ID
     */
    Long createUser(CreateUserRequest request);
    
    /**
     * 更新用户
     * @param id 用户ID
     * @param request 更新请求
     */
    void updateUser(Long id, UpdateUserRequest request);
    
    /**
     * 删除用户
     * @param id 用户ID
     */
    void deleteUser(Long id);
    
    /**
     * 分页查询用户
     * @param request 查询条件
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    PageResult<User> listUsers(UserQueryRequest request, Integer pageNum, Integer pageSize);
}
```

### 实现类

```java
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    
    public UserServiceImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(CreateUserRequest request) {
        // 1. 参数校验
        checkUsernameUnique(request.getUsername());
        
        // 2. 构建实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setStatus(UserStatus.ACTIVE);
        
        // 3. 保存数据（使用继承的 save 方法）
        save(user);
        
        log.info("用户创建成功, userId={}, username={}", user.getId(), user.getUsername());
        
        return user.getId();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long id, UpdateUserRequest request) {
        // 1. 检查存在性（使用继承的 getById 方法）
        User user = getById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        
        // 2. 更新字段
        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
        if (StringUtils.hasText(request.getNickname())) {
            user.setNickname(request.getNickname());
        }
        
        // 3. 保存更新（使用继承的 updateById 方法）
        updateById(user);
        
        log.info("用户更新成功, userId={}", id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(Long id) {
        // 1. 检查存在性
        User user = getById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        
        // 2. 逻辑删除（使用继承的 removeById 方法）
        removeById(id);
        
        log.info("用户删除成功, userId={}", id);
    }
    
    @Override
    public PageResult<User> listUsers(UserQueryRequest request, Integer pageNum, Integer pageSize) {
        // 1. 构建分页对象
        Page<User> page = Page.of(pageNum, pageSize);
        
        // 2. 构建查询条件
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(request.getUsername()), 
                    User::getUsername, request.getUsername())
               .eq(request.getStatus() != null, User::getStatus, request.getStatus())
               .orderByDesc(User::getCreateTime);
        
        // 3. 执行分页查询（使用继承的 page 方法）
        Page<User> result = page(page, wrapper);
        
        return PageResult.of(result.getRecords(), result.getTotal(), pageNum, pageSize);
    }
    
    private void checkUsernameUnique(String username) {
        // 使用继承的 lambdaQuery 方法
        User existing = lambdaQuery()
                .eq(User::getUsername, username)
                .one();
        if (existing != null) {
            throw new BusinessException("USER_EXISTS", "用户名已存在");
        }
    }
}
```

> **说明**：Service 实现类继承 `ServiceImpl<UserMapper, User>` 可获得 MyBatis-Plus 内置的 CRUD 方法，如 `save()`、`getById()`、`updateById()`、`removeById()`、`page()` 等，减少样板代码。详见 [MyBatis-Plus 规范](mybatis-plus.md)。

### Service 规范要点

| 规范 | 说明 |
|------|------|
| 类注解 | `@Service` |
| 事务注解 | 写操作添加 `@Transactional(rollbackFor = Exception.class)` |
| 依赖注入 | 构造器注入 |
| 参数校验 | 业务规则校验在 Service 层 |
| 日志记录 | 关键操作记录 INFO 日志 |
| 异常处理 | 抛出业务异常，不吞掉异常 |

## 参数校验

### Request DTO

```java
@Data
public class CreateUserRequest {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 20, message = "用户名长度4-20个字符")
    @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_]*$", message = "用户名只能包含字母、数字、下划线，且以字母开头")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度6-20个字符")
    private String password;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Size(max = 50, message = "昵称最多50个字符")
    private String nickname;
    
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
}
```

### 常用校验注解

| 注解 | 说明 |
|------|------|
| `@NotNull` | 不能为 null |
| `@NotBlank` | 不能为 null 且去空格后长度 > 0 |
| `@NotEmpty` | 不能为 null 且长度 > 0 |
| `@Size(min, max)` | 字符串/集合长度范围 |
| `@Min` / `@Max` | 数值最小/最大值 |
| `@Pattern` | 正则匹配 |
| `@Email` | 邮箱格式 |
| `@Past` / `@Future` | 过去/未来时间 |

### 分组校验

```java
// 定义分组
public interface CreateGroup {}
public interface UpdateGroup {}

// DTO 中使用分组
@Data
public class UserRequest {
    
    @Null(groups = CreateGroup.class, message = "创建时不能指定ID")
    @NotNull(groups = UpdateGroup.class, message = "更新时必须指定ID")
    private Long id;
    
    @NotBlank(groups = CreateGroup.class, message = "用户名不能为空")
    private String username;
}

// Controller 中使用分组
@PostMapping
public Result<Long> create(@Validated(CreateGroup.class) @RequestBody UserRequest request) {
    // ...
}

@PutMapping("/{id}")
public Result<Void> update(@Validated(UpdateGroup.class) @RequestBody UserRequest request) {
    // ...
}
```

## 配置管理

### 配置类

```java
@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    /** 应用名称 */
    private String name;
    
    /** JWT 配置 */
    private Jwt jwt = new Jwt();
    
    /** 文件上传配置 */
    private Upload upload = new Upload();
    
    @Data
    public static class Jwt {
        /** 密钥 */
        private String secret;
        /** 过期时间（秒） */
        private Long expireTime = 7200L;
    }
    
    @Data
    public static class Upload {
        /** 上传路径 */
        private String path = "/data/upload";
        /** 最大文件大小（MB） */
        private Integer maxSize = 10;
        /** 允许的文件类型 */
        private List<String> allowedTypes = Arrays.asList("jpg", "png", "pdf");
    }
}
```

### application.yml

```yaml
app:
  name: my-application
  jwt:
    secret: ${JWT_SECRET:your-secret-key}
    expire-time: 7200
  upload:
    path: /data/upload
    max-size: 10
    allowed-types:
      - jpg
      - png
      - pdf

spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:mydb}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:}
```

## 依赖注入

### 推荐方式

```java
// ✅ 推荐：构造器注入
@Service
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    // Lombok @RequiredArgsConstructor 可自动生成
    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }
}

// 或使用 Lombok
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
}
```

### 不推荐方式

```java
// ❌ 不推荐：字段注入
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;  // 难以测试
}

// ❌ 不推荐：Setter 注入
@Service
public class UserServiceImpl implements UserService {
    
    private UserMapper userMapper;
    
    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
}
```

## 检查清单

- [ ] 项目结构清晰，分层明确
- [ ] Controller 只做参数接收和结果转换
- [ ] Service 包含业务逻辑，添加事务注解
- [ ] 使用构造器注入依赖
- [ ] 参数校验使用 JSR-380 注解
- [ ] 配置使用 `@ConfigurationProperties`
- [ ] 敏感配置使用环境变量
- [ ] 统一响应格式 `Result<T>`

## 参考

- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot 最佳实践](https://github.com/spring-projects/spring-boot/wiki)
