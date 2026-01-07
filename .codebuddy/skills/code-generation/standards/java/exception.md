# Java 异常处理规范

> 继承自 [通用错误处理规范](../common/error-handling.md)，本文档补充 Java 特有规则

## 异常体系设计

### 推荐异常层次

```
RuntimeException
└── BaseException (基础异常)
    ├── BusinessException (业务异常)
    │   ├── ValidationException (参数校验异常)
    │   ├── ResourceNotFoundException (资源不存在)
    │   └── DuplicateException (重复操作)
    └── SystemException (系统异常)
        ├── RemoteServiceException (远程服务异常)
        └── DataAccessException (数据访问异常)
```

### 基础异常类

```java
/**
 * 基础异常类
 */
@Getter
public abstract class BaseException extends RuntimeException {
    
    /** 错误码 */
    private final String code;
    
    /** 错误消息 */
    private final String message;
    
    /** 额外数据 */
    private final Map<String, Object> data;
    
    protected BaseException(String code, String message) {
        this(code, message, null, null);
    }
    
    protected BaseException(String code, String message, Throwable cause) {
        this(code, message, cause, null);
    }
    
    protected BaseException(String code, String message, Throwable cause, 
                           Map<String, Object> data) {
        super(message, cause);
        this.code = code;
        this.message = message;
        this.data = data != null ? data : Collections.emptyMap();
    }
}
```

### 业务异常类

```java
/**
 * 业务异常 - 可预期的业务错误
 */
public class BusinessException extends BaseException {
    
    public BusinessException(String message) {
        super("BUSINESS_ERROR", message);
    }
    
    public BusinessException(String code, String message) {
        super(code, message);
    }
    
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getCode(), errorCode.getMessage());
    }
    
    public BusinessException(ErrorCode errorCode, Object... args) {
        super(errorCode.getCode(), String.format(errorCode.getMessage(), args));
    }
}

/**
 * 资源不存在异常
 */
public class ResourceNotFoundException extends BusinessException {
    
    public ResourceNotFoundException(String resource, Object id) {
        super("RESOURCE_NOT_FOUND", 
              String.format("%s不存在: %s", resource, id));
    }
}

/**
 * 参数校验异常
 */
public class ValidationException extends BusinessException {
    
    private final List<FieldError> fieldErrors;
    
    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
        this.fieldErrors = Collections.emptyList();
    }
    
    public ValidationException(List<FieldError> fieldErrors) {
        super("VALIDATION_ERROR", "参数校验失败");
        this.fieldErrors = fieldErrors;
    }
}
```

### 错误码枚举

```java
/**
 * 错误码枚举
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {
    
    // 通用错误 1xxxx
    SUCCESS("00000", "成功"),
    SYSTEM_ERROR("10001", "系统繁忙，请稍后重试"),
    PARAM_ERROR("10002", "参数错误: %s"),
    
    // 用户模块 2xxxx
    USER_NOT_FOUND("20001", "用户不存在"),
    USER_PASSWORD_ERROR("20002", "用户名或密码错误"),
    USER_DISABLED("20003", "用户已被禁用"),
    
    // 订单模块 3xxxx
    ORDER_NOT_FOUND("30001", "订单不存在"),
    ORDER_STATUS_ERROR("30002", "订单状态异常，当前状态: %s"),
    ORDER_ALREADY_PAID("30003", "订单已支付，请勿重复支付"),
    
    // 库存模块 4xxxx
    STOCK_NOT_ENOUGH("40001", "库存不足，当前库存: %d");
    
    private final String code;
    private final String message;
}
```

## 异常处理原则

### 捕获原则

```java
// ✅ 正确：捕获特定异常
try {
    userMapper.insert(user);
} catch (DuplicateKeyException e) {
    throw new BusinessException("USER_EXISTS", "用户已存在");
}

// ❌ 错误：捕获 Exception
try {
    userMapper.insert(user);
} catch (Exception e) {  // 过于宽泛
    throw new BusinessException("操作失败");
}
```

### 抛出原则

```java
// ✅ 正确：业务异常使用 BusinessException
public User getUser(Long id) {
    User user = userMapper.selectById(id);
    if (user == null) {
        throw new ResourceNotFoundException("用户", id);
    }
    return user;
}

// ✅ 正确：保留原始异常信息
try {
    remoteService.call();
} catch (IOException e) {
    throw new RemoteServiceException("远程服务调用失败", e);
}

// ❌ 错误：吞掉异常
try {
    remoteService.call();
} catch (IOException e) {
    log.error("调用失败");  // 异常被吞掉
}

// ❌ 错误：丢失原始异常
try {
    remoteService.call();
} catch (IOException e) {
    throw new BusinessException("调用失败");  // 丢失原始异常
}
```

### 传播原则

```java
// ✅ 正确：Controller 层不处理异常，交给全局处理器
@RestController
public class UserController {
    
    @GetMapping("/users/{id}")
    public Result<UserVO> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);  // 可能抛出 ResourceNotFoundException
        return Result.success(userConverter.toVO(user));
    }
}

// ✅ 正确：Service 层处理业务异常
@Service
public class UserServiceImpl implements UserService {
    
    @Override
    public User getUser(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new ResourceNotFoundException("用户", id);
        }
        return user;
    }
}
```

## 全局异常处理

### RestControllerAdvice

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 业务异常处理
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: code={}, message={}", e.getCode(), e.getMessage());
        return Result.fail(e.getCode(), e.getMessage());
    }
    
    /**
     * 参数校验异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("参数校验失败: {}", message);
        return Result.fail("VALIDATION_ERROR", message);
    }
    
    /**
     * 参数绑定异常处理
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("参数绑定失败: {}", message);
        return Result.fail("BIND_ERROR", message);
    }
    
    /**
     * 请求方法不支持
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<Void> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        log.warn("请求方法不支持: {}", e.getMethod());
        return Result.fail("METHOD_NOT_ALLOWED", "请求方法不支持: " + e.getMethod());
    }
    
    /**
     * 系统异常处理
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: {}", e.getMessage(), e);
        return Result.fail("SYSTEM_ERROR", "系统繁忙，请稍后重试");
    }
}
```

### 统一响应格式

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    private String code;
    private String message;
    private T data;
    private long timestamp;
    
    public static <T> Result<T> success(T data) {
        return new Result<>("00000", "成功", data, System.currentTimeMillis());
    }
    
    public static <T> Result<T> fail(String code, String message) {
        return new Result<>(code, message, null, System.currentTimeMillis());
    }
    
    public static <T> Result<T> fail(ErrorCode errorCode) {
        return new Result<>(errorCode.getCode(), errorCode.getMessage(), 
                           null, System.currentTimeMillis());
    }
}
```

## Optional 使用

### 正确用法

```java
// ✅ 正确：返回 Optional
public Optional<User> findByEmail(String email) {
    return Optional.ofNullable(userMapper.selectByEmail(email));
}

// ✅ 正确：链式处理
String cityName = userService.findById(id)
        .map(User::getAddress)
        .map(Address::getCity)
        .map(City::getName)
        .orElse("未知城市");

// ✅ 正确：orElseThrow
User user = userService.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("用户", id));
```

### 错误用法

```java
// ❌ 错误：不检查直接 get()
Optional<User> userOpt = userService.findById(id);
User user = userOpt.get();  // NoSuchElementException!

// ❌ 错误：Optional 作为字段
public class User {
    private Optional<String> nickname;  // 不推荐
}

// ❌ 错误：Optional 作为参数
public void updateUser(Optional<String> name) {  // 不推荐
}

// ❌ 错误：Optional.of(null)
Optional<User> userOpt = Optional.of(null);  // NullPointerException!
```

## 事务中的异常

### 回滚规则

```java
// ✅ 默认只回滚 RuntimeException
@Transactional
public void createOrder(Order order) {
    // RuntimeException 会回滚
}

// ✅ 指定回滚异常
@Transactional(rollbackFor = Exception.class)
public void createOrder(Order order) throws IOException {
    // 所有异常都会回滚
}

// ✅ 指定不回滚异常
@Transactional(noRollbackFor = BusinessException.class)
public void createOrder(Order order) {
    // BusinessException 不会回滚
}
```

### 事务失效场景

```java
// ❌ 错误：内部调用事务失效
@Service
public class OrderServiceImpl {
    
    public void createOrder(Order order) {
        this.saveOrder(order);  // 内部调用，@Transactional 失效!
    }
    
    @Transactional
    public void saveOrder(Order order) {
        orderMapper.insert(order);
    }
}

// ✅ 正确：通过代理调用
@Service
public class OrderServiceImpl {
    
    @Autowired
    private OrderService self;  // 注入自身代理
    
    public void createOrder(Order order) {
        self.saveOrder(order);  // 通过代理调用
    }
    
    @Transactional
    public void saveOrder(Order order) {
        orderMapper.insert(order);
    }
}
```

## 检查清单

- [ ] 定义了统一的异常体系
- [ ] 业务异常继承 RuntimeException
- [ ] 异常包含错误码和错误消息
- [ ] 配置了全局异常处理器
- [ ] 异常日志包含完整堆栈
- [ ] 不吞掉异常，保留原始异常信息
- [ ] Optional 使用正确，不直接调用 get()
- [ ] 事务方法指定了 rollbackFor

## 参考

- [通用错误处理规范](../common/error-handling.md)
- [Effective Java - 异常处理](https://www.oreilly.com/library/view/effective-java/9780134686097/)
