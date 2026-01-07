# Groovy 命名规范

> 继承自 [通用命名规范](../common/naming.md)，Groovy 遵循 Java 命名约定

## 类命名

```groovy
// ✅ 大驼峰
class UserService {}
class OrderController {}

// ✅ Spock 测试类
class UserServiceSpec extends Specification {}
class OrderControllerTest extends Specification {}
```

## 变量命名

```groovy
// ✅ 小驼峰
def userName = 'John'
def orderList = []

// ✅ 常量全大写
static final String API_URL = '/api/v1'
static final int MAX_RETRY = 3
```

## Gradle 脚本

```groovy
// ✅ 任务名：小驼峰
task buildApp { }
task runTests { }
task deployToServer { }

// ✅ 配置块：小驼峰
dependencies { }
repositories { }

// ✅ 属性名：小驼峰
ext {
    springBootVersion = '3.2.0'
    lombokVersion = '1.18.30'
}
```

## Spock 测试

```groovy
class UserServiceSpec extends Specification {
    
    // ✅ 方法名可使用字符串（描述性）
    def "should create user successfully"() {
        // ...
    }
    
    def "should throw exception when user not found"() {
        // ...
    }
    
    // ✅ 或使用驼峰
    def shouldCreateUserSuccessfully() {
        // ...
    }
}
```

## 检查清单

- [ ] 类名大驼峰
- [ ] 变量小驼峰
- [ ] 常量全大写
- [ ] Gradle 任务小驼峰
- [ ] Spock 测试方法描述性命名

## 参考

- [通用命名规范](../common/naming.md)
- [Java 命名规范](../java/naming.md)
