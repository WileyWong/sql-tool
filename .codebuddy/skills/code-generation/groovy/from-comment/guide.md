# Groovy 从注释生成代码指南

## 适用场景

从带详细注释的 Groovy 接口签名生成完整实现，主要用于：
- Gradle 构建脚本
- Spock 测试用例
- Groovy DSL 实现

## 输入要求

### 注释格式

```groovy
/**
 * 自定义 Gradle 任务：生成 API 文档
 * 
 * 功能：
 * 1. 扫描 src/main/java 下的所有 Java 文件
 * 2. 提取 JavaDoc 注释
 * 3. 生成 Markdown 格式文档到 build/docs 目录
 * 
 * @param sourceDir 源码目录，默认 src/main/java
 * @param outputDir 输出目录，默认 build/docs
 */
abstract class GenerateApiDocsTask extends DefaultTask {
    // TODO: 实现
}
```

## 生成流程

### 1. 解析注释

提取关键信息：
- 任务/类的职责描述
- 功能点列表
- 参数说明
- 依赖关系

### 2. 确定实现模式

| 类型 | 实现模式 |
|------|---------|
| Gradle Task | 继承 DefaultTask，使用 @TaskAction |
| Spock Test | 继承 Specification，使用 given-when-then |
| DSL | 使用闭包和 Groovy 元编程 |

### 3. 生成代码

遵循规范：
- [Groovy 命名规范](../../standards/groovy/naming.md)
- [Spock 测试规范](../../standards/groovy/spock.md)

## 示例

### 输入

```groovy
/**
 * 测试用户服务
 * 
 * 场景：
 * 1. 创建用户成功
 * 2. 用户名重复时抛出异常
 * 3. 邮箱格式错误时校验失败
 */
class UserServiceSpec extends Specification {
    // TODO: 实现测试用例
}
```

### 输出

```groovy
class UserServiceSpec extends Specification {
    
    def userService = new UserService()
    def userRepository = Mock(UserRepository)
    
    def setup() {
        userService.userRepository = userRepository
    }
    
    def "创建用户成功"() {
        given: "准备用户数据"
        def user = new User(username: "test", email: "test@example.com")
        userRepository.findByUsername("test") >> null
        userRepository.save(_) >> { User u -> u.id = 1L; u }
        
        when: "调用创建方法"
        def result = userService.createUser(user)
        
        then: "返回创建的用户"
        result.id == 1L
        result.username == "test"
    }
    
    def "用户名重复时抛出异常"() {
        given: "用户名已存在"
        def user = new User(username: "existing", email: "new@example.com")
        userRepository.findByUsername("existing") >> new User(id: 1L)
        
        when: "调用创建方法"
        userService.createUser(user)
        
        then: "抛出业务异常"
        def ex = thrown(BusinessException)
        ex.message.contains("用户名已存在")
    }
    
    def "邮箱格式错误时校验失败"() {
        given: "无效的邮箱格式"
        def user = new User(username: "test", email: "invalid-email")
        
        when: "调用创建方法"
        userService.createUser(user)
        
        then: "抛出校验异常"
        thrown(ValidationException)
    }
}
```

## 检查清单

- [ ] 注释中的所有功能点都已实现
- [ ] 遵循 Groovy 命名规范
- [ ] Spock 测试使用 given-when-then 结构
- [ ] Mock 对象正确配置
- [ ] 异常场景覆盖完整
