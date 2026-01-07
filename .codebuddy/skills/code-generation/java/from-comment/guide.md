# Java 从注释生成代码指南

## 适用场景

- 输入：带详细注释的 Java 接口签名
- 输出：完整的 Java 实现代码

## 输入格式

### 接口签名示例

```java
/**
 * 用户服务接口
 * 
 * @author developer
 * @since 1.0.0
 */
public interface UserService {
    
    /**
     * 根据ID获取用户
     * 
     * 业务规则：
     * 1. 用户不存在时抛出 ResourceNotFoundException
     * 2. 返回的用户信息需要脱敏处理
     * 
     * @param id 用户ID，不能为空
     * @return 用户实体
     * @throws ResourceNotFoundException 用户不存在时抛出
     */
    User getById(Long id);
    
    /**
     * 创建用户
     * 
     * 业务规则：
     * 1. 用户名不能重复
     * 2. 密码需要加密存储
     * 3. 创建成功后发送欢迎邮件
     * 
     * @param request 创建用户请求
     * @return 用户ID
     * @throws BusinessException 用户名已存在时抛出
     */
    Long createUser(CreateUserRequest request);
}
```

## 生成流程

### 步骤1: 解析注释

```yaml
提取内容:
  - 方法功能描述
  - 业务规则列表
  - 参数说明
  - 返回值说明
  - 异常说明
```

### 步骤2: 分析依赖

```yaml
识别依赖:
  - Mapper/Repository
  - 其他 Service
  - 工具类
  - 外部服务
```

### 步骤3: 生成实现

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Override
    public User getById(Long id) {
        // 1. 参数校验
        Assert.notNull(id, "用户ID不能为空");
        
        // 2. 查询用户
        User user = userMapper.selectById(id);
        
        // 3. 检查存在性
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        
        // 4. 脱敏处理
        user.setPhone(maskPhone(user.getPhone()));
        
        return user;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createUser(CreateUserRequest request) {
        log.info("创建用户, username={}", request.getUsername());
        
        // 1. 检查用户名唯一性
        if (userMapper.existsByUsername(request.getUsername())) {
            throw new BusinessException("USER_EXISTS", "用户名已存在");
        }
        
        // 2. 构建用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setStatus(UserStatus.ACTIVE);
        
        // 3. 保存用户
        userMapper.insert(user);
        
        // 4. 发送欢迎邮件
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
        
        log.info("用户创建成功, userId={}", user.getId());
        return user.getId();
    }
    
    private String maskPhone(String phone) {
        if (phone == null || phone.length() != 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
}
```

## 注释解析规则

### 业务规则提取

```yaml
关键词:
  - "业务规则："
  - "规则："
  - "注意："
  - "要求："

格式:
  - 数字列表: 1. xxx 2. xxx
  - 符号列表: - xxx - xxx
```

### 异常处理

```yaml
识别模式:
  - @throws XxxException 描述
  - "抛出 XxxException"
  - "当 xxx 时抛出异常"

生成:
  - 对应的 if 判断
  - throw new XxxException(...)
```

### 参数校验

```yaml
识别模式:
  - "不能为空"
  - "不能为 null"
  - "必须大于 0"
  - "长度不超过 xxx"

生成:
  - Assert.notNull(...)
  - Assert.isTrue(...)
  - 或 @Valid 注解
```

## 检查清单

- [ ] 解析所有注释内容
- [ ] 识别业务规则
- [ ] 生成参数校验
- [ ] 实现业务逻辑
- [ ] 添加异常处理
- [ ] 添加日志记录
- [ ] 添加事务注解

## 参考

- [Java 命名规范](../../standards/java/naming.md)
- [Java 异常处理](../../standards/java/exception.md)
- [Java 日志规范](../../standards/java/logging.md)
