# Groovy/Spock 单元测试代码生成策略

根据测试用例文档生成 Groovy Spock 测试代码，使用 given-when-then 结构，支持数据驱动测试和强大的 Mock 能力。

---

## 适用场景

- 已通过标准化检查的单元测试用例文档
- Java/Groovy 项目的 Service/Repository 层测试
- 需要 Mock 隔离依赖
- 需要数据驱动测试（Data Driven Testing）

---

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Groovy | 4.0+ | 运行环境 |
| Spock | 2.4+ | 测试框架 |
| Spring Boot Test | 3.0+ | Spring 集成（可选） |
| Java | 17+ | JVM 环境 |

---

## 核心原则

### 强制执行规则

> ⛔ **必须严格执行，违反立即停止生成**

1. **强制源码验证**
   - ✅ 必须 `read_file` 读取被测类完整源码
   - ✅ 必须 `read_file` 读取所有依赖类源码
   - ❌ 禁止跳过源码读取直接生成代码

2. **禁止方法假设**
   - ❌ 禁止基于类名推测方法存在性
   - ❌ 禁止基于字段名推测方法名
   - ✅ 强制从源码精确提取实际方法

3. **使用 Spock 风格**
   - ✅ 必须使用 given-when-then 结构
   - ✅ 必须使用 Spock 原生 Mock
   - ✅ 方法名使用中文描述

---

## 代码结构

### 测试类模板

```groovy
package com.example.service

import spock.lang.Specification
import spock.lang.Subject
import spock.lang.Unroll

/**
 * UserService 单元测试
 * 覆盖: 正常/边界/异常/Mock验证
 */
class UserServiceSpec extends Specification {

    // Mock 依赖
    def userRepository = Mock(UserRepository)
    def cacheService = Mock(CacheService)

    // 被测对象
    @Subject
    def userService = new UserService(userRepository, cacheService)

    // 测试数据常量
    static final Long TEST_USER_ID = 1L
    static final String TEST_USERNAME = "testuser"
    static final String TEST_EMAIL = "test@example.com"
}
```

### 正常场景测试

```groovy
def "TC001 - 创建用户成功"() {
    given: "准备用户数据"
    def request = new CreateUserRequest(
        username: TEST_USERNAME,
        email: TEST_EMAIL
    )

    and: "Mock Repository 行为"
    userRepository.existsByUsername(TEST_USERNAME) >> false
    userRepository.save(_ as User) >> { User user ->
        user.id = TEST_USER_ID
        return user
    }

    when: "调用创建方法"
    def result = userService.createUser(request)

    then: "返回创建的用户"
    result != null
    result.id == TEST_USER_ID
    result.username == TEST_USERNAME

    and: "验证调用次数"
    1 * userRepository.existsByUsername(TEST_USERNAME)
    1 * userRepository.save(_ as User)
}

def "TC002 - 查询用户成功"() {
    given: "用户存在"
    def expectedUser = new User(
        id: TEST_USER_ID,
        username: TEST_USERNAME,
        email: TEST_EMAIL
    )
    userRepository.findById(TEST_USER_ID) >> Optional.of(expectedUser)

    when: "查询用户"
    def result = userService.getUser(TEST_USER_ID)

    then: "返回用户信息"
    result != null
    result.id == TEST_USER_ID
    result.username == TEST_USERNAME
}
```

### 边界条件测试

```groovy
def "TC010 - 空值处理"() {
    when: "传入 null"
    userService.createUser(null)

    then: "抛出参数异常"
    def ex = thrown(IllegalArgumentException)
    ex.message.contains("request")

    and: "不应调用 Repository"
    0 * userRepository._
}

def "TC011 - 空列表处理"() {
    given: "数据库无数据"
    userRepository.findAll() >> []

    when: "查询所有用户"
    def result = userService.getAllUsers()

    then: "返回空列表"
    result != null
    result.isEmpty()
}
```

### 异常场景测试

```groovy
def "TC020 - 用户名已存在"() {
    given: "用户名已被使用"
    def request = new CreateUserRequest(
        username: TEST_USERNAME,
        email: TEST_EMAIL
    )
    userRepository.existsByUsername(TEST_USERNAME) >> true

    when: "创建用户"
    userService.createUser(request)

    then: "抛出业务异常"
    def ex = thrown(BusinessException)
    ex.code == "USER_EXISTS"
    ex.message.contains("用户名已存在")

    and: "不应调用 save"
    0 * userRepository.save(_)
}

def "TC021 - 依赖服务异常"() {
    given: "数据库连接失败"
    userRepository.findById(TEST_USER_ID) >> { throw new RuntimeException("Database connection failed") }

    when: "查询用户"
    userService.getUser(TEST_USER_ID)

    then: "抛出服务异常"
    def ex = thrown(ServiceException)
    ex.message.contains("Database")
}
```

### Mock 验证测试

```groovy
def "TC030 - 验证 Repository 调用顺序"() {
    given: "准备数据"
    def request = new CreateUserRequest(
        username: TEST_USERNAME,
        email: TEST_EMAIL
    )

    when: "创建用户"
    userService.createUser(request)

    then: "先检查用户名"
    1 * userRepository.existsByUsername(TEST_USERNAME) >> false

    then: "再保存用户"
    1 * userRepository.save({ User user ->
        user.username == TEST_USERNAME &&
        user.email == TEST_EMAIL
    }) >> { User user -> user.id = TEST_USER_ID; user }
}

def "TC031 - 验证参数匹配"() {
    given: "准备数据"
    def request = new CreateUserRequest(
        username: TEST_USERNAME,
        email: TEST_EMAIL
    )

    when: "创建用户"
    userService.createUser(request)

    then: "验证传入参数"
    1 * userRepository.save({ User user ->
        assert user.username == TEST_USERNAME
        assert user.email == TEST_EMAIL
        assert user.status == UserStatus.ACTIVE
        true
    }) >> { User user -> user.id = TEST_USER_ID; user }
}
```

---

## 数据驱动测试

### 使用 where 块

```groovy
@Unroll
def "TC040 - 用户名校验: #scenario"() {
    given: "准备请求"
    def request = new CreateUserRequest(
        username: username,
        email: TEST_EMAIL
    )

    when: "创建用户"
    userService.createUser(request)

    then: "抛出校验异常"
    def ex = thrown(ValidationException)
    ex.message.contains(expectedError)

    where:
    scenario       | username           | expectedError
    "用户名为空"    | ""                 | "用户名不能为空"
    "用户名太短"    | "ab"               | "用户名长度"
    "用户名太长"    | "a" * 51           | "用户名长度"
    "包含特殊字符"  | "test@user"        | "用户名格式"
    "包含空格"      | "test user"        | "用户名格式"
}

@Unroll
def "TC041 - 邮箱格式校验: #email -> #valid"() {
    expect: "校验结果符合预期"
    userService.isValidEmail(email) == valid

    where:
    email                    | valid
    "test@example.com"       | true
    "user.name@domain.org"   | true
    "invalid"                | false
    "missing@domain"         | false
    "@nodomain.com"          | false
    "spaces in@email.com"    | false
}
```

### 使用数据表格

```groovy
@Unroll
def "TC042 - 计算用户等级: 积分=#points -> 等级=#expectedLevel"() {
    given: "用户积分"
    def user = new User(points: points)

    expect: "等级计算正确"
    userService.calculateLevel(user) == expectedLevel

    where:
    points | expectedLevel
    0      | "BRONZE"
    99     | "BRONZE"
    100    | "SILVER"
    499    | "SILVER"
    500    | "GOLD"
    999    | "GOLD"
    1000   | "PLATINUM"
}
```

---

## Spock Mock 语法

### 基本 Mock

```groovy
// 创建 Mock
def mockRepo = Mock(UserRepository)

// 设置返回值
mockRepo.findById(1L) >> Optional.of(user)

// 设置多次调用不同返回值
mockRepo.findById(_) >>> [Optional.of(user1), Optional.of(user2), Optional.empty()]

// 设置抛出异常
mockRepo.findById(_) >> { throw new RuntimeException("error") }

// 动态返回值
mockRepo.save(_ as User) >> { User u -> u.id = 1L; u }
```

### 验证调用

```groovy
// 验证调用次数
1 * mockRepo.save(_)           // 恰好调用1次
0 * mockRepo.delete(_)         // 不应调用
(1..3) * mockRepo.findById(_)  // 调用1-3次
_ * mockRepo.findAll()         // 任意次数

// 验证调用顺序（多个 then 块）
then: "先检查"
1 * mockRepo.existsByUsername(_)

then: "再保存"
1 * mockRepo.save(_)

// 验证参数
1 * mockRepo.save({ User u -> u.username == "test" })

// 验证无任何调用
0 * mockRepo._
```

### Stub vs Mock

```groovy
// Stub - 只关心返回值，不验证调用
def stubRepo = Stub(UserRepository)
stubRepo.findById(_) >> Optional.of(user)

// Mock - 可以验证调用
def mockRepo = Mock(UserRepository)
1 * mockRepo.findById(1L) >> Optional.of(user)

// Spy - 部分 Mock（真实对象）
def spyService = Spy(UserService)
spyService.validateUser(_) >> true  // 覆盖特定方法
```

---

## Spring 集成

### Spring Boot 测试

```groovy
@SpringBootTest
class UserServiceIntegrationSpec extends Specification {

    @Autowired
    UserService userService

    @SpringBean
    UserRepository userRepository = Mock()

    def "集成测试 - 创建用户"() {
        given:
        userRepository.existsByUsername(_) >> false
        userRepository.save(_) >> { User u -> u.id = 1L; u }

        when:
        def result = userService.createUser(new CreateUserRequest(
            username: "test",
            email: "test@example.com"
        ))

        then:
        result.id == 1L
    }
}
```

### 使用 @TestConfiguration

```groovy
@SpringBootTest
@Import(TestConfig)
class UserServiceSpec extends Specification {

    @Autowired
    UserService userService

    @TestConfiguration
    static class TestConfig {
        @Bean
        UserRepository userRepository() {
            return Mock(UserRepository)
        }
    }
}
```

---

## 输出产物

| 文件 | 路径 | 说明 |
|------|------|------|
| 测试类 | `src/test/groovy/com/example/{module}/{ClassName}Spec.groovy` | Spock 测试代码 |

---

## 验证清单

### 源码验证

- [ ] 已读取被测类完整源码
- [ ] 已读取所有依赖类源码
- [ ] 所有方法调用已验证存在性
- [ ] 所有字段类型已验证

### 代码质量

- [ ] 继承 `Specification`
- [ ] 使用 `given-when-then` 结构
- [ ] 使用 Spock 原生 Mock
- [ ] 方法名使用中文描述
- [ ] 使用 `@Subject` 标注被测对象
- [ ] 数据驱动测试使用 `@Unroll`

### 覆盖率

- [ ] 正常场景覆盖
- [ ] 边界条件覆盖（null/空集合）
- [ ] 异常场景覆盖
- [ ] Mock 验证覆盖
- [ ] 目标覆盖率 ≥ 85%

### 编译验证

```bash
# Maven
mvn test -Dtest=*Spec

# Gradle
./gradlew test --tests "*Spec"

# 运行单个测试类
./gradlew test --tests "UserServiceSpec"

# 运行单个测试方法
./gradlew test --tests "UserServiceSpec.TC001*"
```

---

## Maven 依赖配置

```xml
<dependencies>
    <!-- Spock Framework -->
    <dependency>
        <groupId>org.spockframework</groupId>
        <artifactId>spock-core</artifactId>
        <version>2.4-M1-groovy-4.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Spock Spring 集成 -->
    <dependency>
        <groupId>org.spockframework</groupId>
        <artifactId>spock-spring</artifactId>
        <version>2.4-M1-groovy-4.0</version>
        <scope>test</scope>
    </dependency>
    
    <!-- Groovy -->
    <dependency>
        <groupId>org.apache.groovy</groupId>
        <artifactId>groovy</artifactId>
        <version>4.0.15</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- GMavenPlus 插件编译 Groovy -->
        <plugin>
            <groupId>org.codehaus.gmavenplus</groupId>
            <artifactId>gmavenplus-plugin</artifactId>
            <version>3.0.2</version>
            <executions>
                <execution>
                    <goals>
                        <goal>compileTests</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

---

## Gradle 依赖配置

```groovy
plugins {
    id 'groovy'
}

dependencies {
    // Spock Framework
    testImplementation 'org.spockframework:spock-core:2.4-M1-groovy-4.0'
    testImplementation 'org.spockframework:spock-spring:2.4-M1-groovy-4.0'
    
    // Groovy
    testImplementation 'org.apache.groovy:groovy:4.0.15'
}

test {
    useJUnitPlatform()
}
```

---

## 相关资源

- [Groovy 命名规范](../../../../code-generation/standards/groovy/naming.md)
- [Spock 测试规范](../../../../code-generation/standards/groovy/spock.md)
- [测试用例规范](../../../test-case-spec-standard.md)
- [Spock 官方文档](https://spockframework.org/spock/docs/2.3/index.html)
