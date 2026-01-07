# Groovy 错误处理规范

> 继承自 [通用错误处理规范](../common/error-handling.md)

## 异常处理特点

Groovy 与 Java 的主要区别：
- Groovy 不强制处理受检异常（Checked Exception）
- 所有异常都可以像运行时异常一样处理
- 但建议仍然遵循良好的异常处理实践

## 基本异常处理

### try-catch

```groovy
// ✅ 基本异常处理
def readFile(String path) {
    try {
        return new File(path).text
    } catch (FileNotFoundException e) {
        log.error("文件不存在: ${path}", e)
        return null
    } catch (IOException e) {
        log.error("读取文件失败: ${path}", e)
        throw new BusinessException("FILE_READ_ERROR", "文件读取失败", e)
    }
}

// ✅ 多异常捕获
try {
    // 操作
} catch (FileNotFoundException | IOException e) {
    log.error("IO 错误", e)
}
```

### try-with-resources

```groovy
// ✅ Groovy 风格的资源管理
new File('data.txt').withReader { reader ->
    reader.eachLine { line ->
        processLine(line)
    }
}

// ✅ 多资源管理
new File('input.txt').withReader { reader ->
    new File('output.txt').withWriter { writer ->
        reader.eachLine { line ->
            writer.writeLine(processLine(line))
        }
    }
}

// ✅ 数据库连接
sql.withTransaction {
    sql.execute("INSERT INTO users (name) VALUES (?)", ['John'])
    sql.execute("INSERT INTO logs (action) VALUES (?)", ['create_user'])
}
```

## 自定义异常

```groovy
// ✅ 业务异常
class BusinessException extends RuntimeException {
    String code
    String message
    
    BusinessException(String code, String message) {
        super(message)
        this.code = code
        this.message = message
    }
    
    BusinessException(String code, String message, Throwable cause) {
        super(message, cause)
        this.code = code
        this.message = message
    }
}

// ✅ 使用 @Canonical 简化
@Canonical
class ValidationException extends RuntimeException {
    String field
    String message
}

// 使用
throw new BusinessException("USER_NOT_FOUND", "用户不存在")
throw new ValidationException(field: 'email', message: '邮箱格式不正确')
```

## 安全导航与默认值

```groovy
// ✅ 使用安全导航操作符避免 NPE
def city = user?.address?.city

// ✅ 使用 Elvis 操作符提供默认值
def name = user?.name ?: 'Unknown'
def port = config.port ?: 8080

// ✅ 组合使用
def email = user?.contact?.email ?: 'no-email@example.com'

// ✅ 安全方法调用
def length = str?.length() ?: 0
def upperName = user?.name?.toUpperCase()
```

## 断言

```groovy
// ✅ 使用 assert 进行前置条件检查
def createUser(String name, String email) {
    assert name != null && !name.isEmpty() : "用户名不能为空"
    assert email =~ /^[\w-]+@[\w-]+\.\w+$/ : "邮箱格式不正确"
    
    // 业务逻辑
}

// ✅ 使用 Groovy Truth 简化断言
def processOrder(Order order) {
    assert order : "订单不能为空"
    assert order.items : "订单项不能为空"
    
    // 处理订单
}
```

## Spock 测试中的异常验证

```groovy
class UserServiceSpec extends Specification {
    
    def "should throw exception when user not found"() {
        given:
        userRepository.findById(999L) >> null
        
        when:
        userService.getById(999L)
        
        then:
        def e = thrown(BusinessException)
        e.code == "USER_NOT_FOUND"
        e.message.contains("用户不存在")
    }
    
    def "should not throw exception when user exists"() {
        given:
        userRepository.findById(1L) >> new User(id: 1L, name: "张三")
        
        when:
        def result = userService.getById(1L)
        
        then:
        notThrown(BusinessException)
        result.name == "张三"
    }
    
    def "should throw specific exception type"() {
        when:
        validator.validate(null)
        
        then:
        thrown(IllegalArgumentException)
    }
}
```

## 全局异常处理（Spring Boot）

```groovy
@RestControllerAdvice
class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler)
    
    @ExceptionHandler(BusinessException)
    ResponseEntity<Map> handleBusinessException(BusinessException e) {
        log.warn("业务异常: code={}, message={}", e.code, e.message)
        ResponseEntity.badRequest().body([
            code: e.code,
            message: e.message
        ])
    }
    
    @ExceptionHandler(ValidationException)
    ResponseEntity<Map> handleValidationException(ValidationException e) {
        log.warn("参数校验失败: field={}, message={}", e.field, e.message)
        ResponseEntity.badRequest().body([
            code: 'VALIDATION_ERROR',
            message: e.message,
            field: e.field
        ])
    }
    
    @ExceptionHandler(Exception)
    ResponseEntity<Map> handleException(Exception e) {
        log.error("系统异常", e)
        ResponseEntity.status(500).body([
            code: 'SYSTEM_ERROR',
            message: '系统繁忙，请稍后重试'
        ])
    }
}
```

## 检查清单

- [ ] 不忽略异常（至少记录日志）
- [ ] 使用安全导航操作符避免 NPE
- [ ] 使用 Elvis 操作符提供默认值
- [ ] 使用 withReader/withWriter 自动管理资源
- [ ] 自定义业务异常包含错误码和消息
- [ ] Spock 测试验证异常场景
- [ ] 全局异常处理返回统一格式

## 参考

- [通用错误处理规范](../common/error-handling.md)
- [Groovy 异常处理](https://groovy-lang.org/semantics.html#_try_catch_finally)
- [Spock 测试规范](spock.md)
