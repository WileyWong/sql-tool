# Groovy 从注释生成代码 - 示例

## 示例1: Spock 单元测试

### 输入: 带注释的接口

```java
/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 根据ID获取用户
     * 
     * 测试场景：
     * 1. 用户存在时返回用户信息
     * 2. 用户不存在时抛出 ResourceNotFoundException
     * 
     * @param id 用户ID
     * @return 用户实体
     */
    User getById(Long id);
    
    /**
     * 创建用户
     * 
     * 测试场景：
     * 1. 正常创建用户
     * 2. 用户名重复时抛出 BusinessException
     * 
     * @param request 创建请求
     * @return 用户ID
     */
    Long createUser(CreateUserRequest request);
}
```

### 输出: Spock 测试

```groovy
package com.example.service

import com.example.dto.CreateUserRequest
import com.example.entity.User
import com.example.exception.BusinessException
import com.example.exception.ResourceNotFoundException
import com.example.mapper.UserMapper
import spock.lang.Specification
import spock.lang.Subject
import spock.lang.Title

@Title("用户服务单元测试")
class UserServiceSpec extends Specification {

    // Mock 依赖
    UserMapper userMapper = Mock()
    
    // 被测对象
    @Subject
    UserServiceImpl userService = new UserServiceImpl(userMapper)

    // ==================== getById 测试 ====================
    
    def "getById - 用户存在时返回用户信息"() {
        given: "准备测试数据"
        def userId = 1L
        def user = new User(id: userId, username: "testuser", email: "test@example.com")
        
        and: "配置 Mock 行为"
        userMapper.selectById(userId) >> user
        
        when: "调用被测方法"
        def result = userService.getById(userId)
        
        then: "验证结果"
        result != null
        result.id == userId
        result.username == "testuser"
    }
    
    def "getById - 用户不存在时抛出 ResourceNotFoundException"() {
        given: "准备测试数据"
        def userId = 999L
        
        and: "配置 Mock 行为 - 返回 null"
        userMapper.selectById(userId) >> null
        
        when: "调用被测方法"
        userService.getById(userId)
        
        then: "验证抛出异常"
        thrown(ResourceNotFoundException)
    }

    // ==================== createUser 测试 ====================
    
    def "createUser - 正常创建用户"() {
        given: "准备测试数据"
        def request = new CreateUserRequest(
            username: "newuser",
            password: "password123",
            email: "new@example.com"
        )
        
        and: "配置 Mock 行为"
        userMapper.existsByUsername("newuser") >> false
        userMapper.insert(_ as User) >> { User user ->
            user.id = 1L
            return 1
        }
        
        when: "调用被测方法"
        def result = userService.createUser(request)
        
        then: "验证结果"
        result == 1L
        
        and: "验证 Mock 调用"
        1 * userMapper.existsByUsername("newuser")
        1 * userMapper.insert(_ as User)
    }
    
    def "createUser - 用户名重复时抛出 BusinessException"() {
        given: "准备测试数据"
        def request = new CreateUserRequest(
            username: "existinguser",
            password: "password123",
            email: "existing@example.com"
        )
        
        and: "配置 Mock 行为 - 用户名已存在"
        userMapper.existsByUsername("existinguser") >> true
        
        when: "调用被测方法"
        userService.createUser(request)
        
        then: "验证抛出异常"
        def e = thrown(BusinessException)
        e.code == "USER_EXISTS"
    }
}
```

---

## 示例2: 数据驱动测试

### 输入

```java
/**
 * 计算器服务
 * 
 * 测试场景：
 * 1. 加法：多组数据测试
 * 2. 除法：除数为0时抛出异常
 */
public interface CalculatorService {
    int add(int a, int b);
    int divide(int a, int b);
}
```

### 输出

```groovy
class CalculatorServiceSpec extends Specification {

    @Subject
    CalculatorServiceImpl calculator = new CalculatorServiceImpl()

    def "add - 数据驱动测试"() {
        expect: "验证加法结果"
        calculator.add(a, b) == result
        
        where: "测试数据"
        a  | b  || result
        1  | 1  || 2
        0  | 0  || 0
        -1 | 1  || 0
        10 | 20 || 30
    }
    
    def "divide - 正常除法"() {
        expect:
        calculator.divide(a, b) == result
        
        where:
        a  | b || result
        10 | 2 || 5
        9  | 3 || 3
        0  | 5 || 0
    }
    
    def "divide - 除数为0时抛出异常"() {
        when:
        calculator.divide(10, 0)
        
        then:
        thrown(ArithmeticException)
    }
}
```

---

## 示例3: Gradle 构建脚本

### 输入: 需求描述

```
需要一个 Spring Boot 项目的 Gradle 构建脚本：
1. 使用 Java 17
2. 使用 Spring Boot 3.2.0
3. 包含 Web、JPA、MySQL 依赖
4. 包含 Lombok
5. 包含 Spock 测试框架
```

### 输出: build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'groovy'
}

group = 'com.example'
version = '1.0.0-SNAPSHOT'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    
    // Database
    runtimeOnly 'com.mysql:mysql-connector-j'
    
    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    
    // Spock
    testImplementation 'org.spockframework:spock-core:2.4-M1-groovy-4.0'
    testImplementation 'org.spockframework:spock-spring:2.4-M1-groovy-4.0'
}

test {
    useJUnitPlatform()
}
```

---

## Spock 常用语法

| 语法 | 说明 |
|------|------|
| `given:` | 准备测试数据 |
| `when:` | 执行被测方法 |
| `then:` | 验证结果 |
| `expect:` | when + then 简写 |
| `where:` | 数据驱动 |
| `and:` | 补充说明 |
| `Mock()` | 创建 Mock 对象 |
| `>>` | 定义返回值 |
| `thrown()` | 断言异常 |
| `1 * xxx` | 验证调用次数 |
