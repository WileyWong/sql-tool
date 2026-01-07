# Spock 测试规范

## 基本结构

```groovy
class UserServiceSpec extends Specification {
    
    // 被测对象
    UserService userService
    
    // Mock 对象
    UserRepository userRepository = Mock()
    
    def setup() {
        userService = new UserService(userRepository)
    }
    
    def "should return user when user exists"() {
        given: "准备测试数据"
        def userId = 1L
        def user = new User(id: userId, name: "张三")
        
        when: "调用被测方法"
        def result = userService.getById(userId)
        
        then: "验证结果"
        1 * userRepository.findById(userId) >> user
        result.name == "张三"
    }
}
```

## Given-When-Then

```groovy
def "should create order successfully"() {
    given: "准备订单数据"
    def request = new CreateOrderRequest(
        userId: 1L,
        productId: 100L,
        quantity: 2
    )
    
    and: "Mock 库存检查"
    stockService.checkStock(100L, 2) >> true
    
    when: "创建订单"
    def order = orderService.create(request)
    
    then: "订单创建成功"
    order.id != null
    order.status == OrderStatus.PENDING
    
    and: "库存已扣减"
    1 * stockService.deduct(100L, 2)
}
```

## Mock 和 Stub

```groovy
// Stub：返回固定值
userRepository.findById(1L) >> new User(id: 1L, name: "张三")

// Mock：验证调用
1 * userRepository.save(_)  // 验证调用 1 次
0 * userRepository.delete(_)  // 验证未调用

// 参数匹配
1 * userRepository.save({ it.name == "张三" })

// 顺序返回
userRepository.findById(_) >>> [user1, user2, null]

// 抛出异常
userRepository.findById(_) >> { throw new RuntimeException("DB Error") }
```

## 数据驱动测试

```groovy
def "should validate email format"() {
    expect:
    EmailValidator.isValid(email) == expected
    
    where:
    email                | expected
    "test@example.com"   | true
    "invalid"            | false
    "test@"              | false
    ""                   | false
    null                 | false
}
```

## 异常测试

```groovy
def "should throw exception when user not found"() {
    given:
    userRepository.findById(999L) >> null
    
    when:
    userService.getById(999L)
    
    then:
    def e = thrown(ResourceNotFoundException)
    e.message.contains("用户不存在")
}
```

## 检查清单

- [ ] 使用 given-when-then 结构
- [ ] 方法名描述测试场景
- [ ] Mock 外部依赖
- [ ] 数据驱动测试多场景
- [ ] 验证异常情况

## 参考

- [Spock 官方文档](https://spockframework.org/)
- [Groovy 命名规范](naming.md)
