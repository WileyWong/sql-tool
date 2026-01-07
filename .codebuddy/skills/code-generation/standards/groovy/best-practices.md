# Groovy 最佳实践

> 继承自 Java 最佳实践，Groovy 特有的最佳实践补充

## 代码风格

### 使用 Groovy 特性简化代码

```groovy
// ✅ 使用 Groovy 字符串插值
def message = "Hello, ${user.name}!"

// ❌ Java 风格拼接
def message = "Hello, " + user.getName() + "!"

// ✅ 使用 GString 多行字符串
def sql = """
    SELECT * FROM users
    WHERE status = ${status}
    AND name LIKE '%${name}%'
"""

// ✅ 使用安全导航操作符
def city = user?.address?.city ?: 'Unknown'

// ❌ 繁琐的空检查
def city = user != null && user.address != null ? user.address.city : 'Unknown'
```

### 集合操作

```groovy
// ✅ 使用 Groovy 集合字面量
def list = [1, 2, 3, 4, 5]
def map = [name: 'John', age: 30]
def set = [1, 2, 3] as Set

// ✅ 使用闭包进行集合操作
def adults = users.findAll { it.age >= 18 }
def names = users.collect { it.name }
def totalAge = users.sum { it.age }

// ✅ 使用 spread 操作符
def allNames = users*.name

// ✅ 使用 groupBy
def usersByStatus = users.groupBy { it.status }
```

### 闭包使用

```groovy
// ✅ 简洁的闭包语法
list.each { println it }
list.findAll { it > 5 }

// ✅ 闭包作为最后一个参数可以放在括号外
users.each { user ->
    println user.name
}

// ✅ 使用 with 简化对象操作
def user = new User().with {
    name = 'John'
    email = 'john@example.com'
    age = 30
    it  // 返回对象本身
}
```

## 类型处理

### 类型声明

```groovy
// ✅ 公共 API 使用明确类型
String getUserName(Long userId) {
    // ...
}

// ✅ 局部变量可使用 def
def result = service.getData()

// ✅ 使用 @TypeChecked 启用静态类型检查
@TypeChecked
class UserService {
    String getUserName(Long userId) {
        // 编译时类型检查
    }
}

// ✅ 使用 @CompileStatic 提升性能
@CompileStatic
class PerformanceCriticalService {
    // 编译为静态字节码，性能接近 Java
}
```

### 类型转换

```groovy
// ✅ 使用 as 进行类型转换
def list = [1, 2, 3] as ArrayList
def map = [name: 'John'] as HashMap

// ✅ 使用 asType 方法
def date = '2025-12-22'.toDate()
def number = '123'.toInteger()

// ✅ 安全的类型转换
def value = input?.toString()?.trim()
```

## 异常处理

```groovy
// ✅ Groovy 不强制处理受检异常，但建议处理
def readFile(String path) {
    try {
        new File(path).text
    } catch (FileNotFoundException e) {
        log.error("文件不存在: ${path}", e)
        null
    }
}

// ✅ 使用 try-with-resources（Groovy 风格）
new File('data.txt').withReader { reader ->
    reader.eachLine { line ->
        println line
    }
}

// ✅ 自动资源管理
new File('output.txt').withWriter { writer ->
    writer.writeLine('Hello, World!')
}
```

## Gradle 脚本最佳实践

### 任务定义

```groovy
// ✅ 使用 doLast 而非 << (已废弃)
task buildApp {
    doLast {
        println 'Building application...'
    }
}

// ✅ 任务依赖
task deploy(dependsOn: ['build', 'test']) {
    doLast {
        println 'Deploying...'
    }
}

// ✅ 任务配置
task copyFiles(type: Copy) {
    from 'src/main/resources'
    into 'build/resources'
    include '**/*.xml'
}
```

### 依赖管理

```groovy
// ✅ 使用版本变量
ext {
    springBootVersion = '3.2.0'
    lombokVersion = '1.18.30'
}

dependencies {
    implementation "org.springframework.boot:spring-boot-starter:${springBootVersion}"
    compileOnly "org.projectlombok:lombok:${lombokVersion}"
    annotationProcessor "org.projectlombok:lombok:${lombokVersion}"
}

// ✅ 使用 BOM 管理版本
dependencyManagement {
    imports {
        mavenBom "org.springframework.boot:spring-boot-dependencies:${springBootVersion}"
    }
}
```

## 测试最佳实践

### Spock 测试

```groovy
// ✅ 使用描述性方法名
def "should return user when user exists"() {
    // ...
}

// ✅ 使用 given-when-then 结构
def "should create order successfully"() {
    given: "准备测试数据"
    def request = new CreateOrderRequest(userId: 1L)
    
    when: "执行操作"
    def result = orderService.create(request)
    
    then: "验证结果"
    result.id != null
    result.status == OrderStatus.PENDING
}

// ✅ 数据驱动测试
def "should validate input"() {
    expect:
    validator.isValid(input) == expected
    
    where:
    input   | expected
    "valid" | true
    ""      | false
    null    | false
}
```

## 性能优化

```groovy
// ✅ 大量计算使用 @CompileStatic
@CompileStatic
List<Integer> processLargeList(List<Integer> items) {
    items.findAll { it > 0 }.collect { it * 2 }
}

// ✅ 避免在循环中创建闭包
def processor = { item -> item * 2 }
items.collect(processor)

// ✅ 使用 StringBuilder 进行大量字符串操作
def result = new StringBuilder()
items.each { result.append(it).append('\n') }
result.toString()
```

## 检查清单

- [ ] 使用 Groovy 特性简化代码（安全导航、字符串插值）
- [ ] 公共 API 使用明确类型声明
- [ ] 性能关键代码使用 `@CompileStatic`
- [ ] 类型敏感代码使用 `@TypeChecked`
- [ ] Gradle 任务使用 `doLast` 而非 `<<`
- [ ] 测试使用 Spock 的 given-when-then 结构
- [ ] 集合操作使用 Groovy 闭包方法

## 参考

- [Groovy 官方文档](https://groovy-lang.org/documentation.html)
- [Groovy 风格指南](https://groovy-lang.org/style-guide.html)
- [Spock 测试规范](spock.md)
- [Groovy 命名规范](naming.md)
