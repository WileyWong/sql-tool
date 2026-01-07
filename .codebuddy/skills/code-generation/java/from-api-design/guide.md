# Java 从 API 设计生成代码指南

## 适用场景

- 输入：OpenAPI/Swagger 文档或接口设计文档
- 输出：Controller、Service、Mapper、Entity、DTO 完整代码

## 输入格式

### OpenAPI 示例

```yaml
paths:
  /api/v1/users:
    post:
      summary: 创建用户
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Result'
                
  /api/v1/users/{id}:
    get:
      summary: 获取用户详情
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserVO'
```

## 生成流程

### 步骤1: 解析 API 定义

```yaml
提取内容:
  - 路径: /api/v1/users
  - 方法: GET, POST, PUT, DELETE
  - 参数: path, query, body
  - 响应: 状态码, 数据结构
```

### 步骤2: 生成分层代码

```
Entity → DTO → Mapper → Service → Controller
```

### 步骤3: 生成文件

#### Controller

```java
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "用户管理")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final UserConverter userConverter;
    
    @Operation(summary = "创建用户")
    @PostMapping
    public Result<Long> createUser(@Valid @RequestBody CreateUserRequest request) {
        Long userId = userService.createUser(request);
        return Result.success(userId);
    }
    
    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<UserVO> getUser(@PathVariable Long id) {
        User user = userService.getById(id);
        return Result.success(userConverter.toVO(user));
    }
}
```

#### Service

```java
public interface UserService {
    Long createUser(CreateUserRequest request);
    User getById(Long id);
}

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(CreateUserRequest request) {
        User user = new User();
        BeanUtils.copyProperties(request, user);
        userMapper.insert(user);
        return user.getId();
    }
    
    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        return user;
    }
}
```

#### DTO

```java
@Data
public class CreateUserRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}

@Data
public class UserVO {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createTime;
}
```

## HTTP 方法映射

| HTTP 方法 | 操作 | Controller 方法 | Service 方法 |
|-----------|------|----------------|--------------|
| GET /{id} | 查询单个 | getXxx | getById |
| GET / | 查询列表 | listXxx | list |
| POST / | 创建 | createXxx | create |
| PUT /{id} | 更新 | updateXxx | update |
| DELETE /{id} | 删除 | deleteXxx | delete |

## 检查清单

- [ ] 解析所有 API 端点
- [ ] 生成 Controller
- [ ] 生成 Service 接口和实现
- [ ] 生成 DTO（Request/Response）
- [ ] 生成 Entity
- [ ] 生成 Mapper
- [ ] 添加参数校验
- [ ] 添加 Swagger 注解

## 参考

- [Spring Boot 规范](../../standards/java/springboot.md)
- [MyBatis-Plus 规范](../../standards/java/mybatis-plus.md)
