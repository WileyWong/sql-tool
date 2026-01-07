# Spock 测试框架安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-021 | 测试数据泄露 | 🟠 高危 |
| GRV-022 | 不安全 Mock 配置 | 🟡 中危 |
| GRV-023 | 测试环境污染 | 🟡 中危 |
| GRV-024 | 敏感断言暴露 | 🟠 高危 |
| GRV-025 | 外部依赖风险 | 🟠 高危 |

---

## GRV-021: 测试数据泄露

### 检测模式

```regex
password\s*=\s*['"][^'"]+['"]
apiKey\s*=\s*['"][^'"]+['"]
secret\s*=\s*['"][^'"]+['"]
token\s*=\s*['"][^'"]+['"]
credentials\s*=
```

### 危险代码示例

```groovy
// ❌ 危险: 硬编码真实凭据
class UserServiceSpec extends Specification {
    def "should authenticate user"() {
        given:
        def username = "admin"
        def password = "realPassword123"  // 真实密码
        def apiKey = "sk-1234567890abcdef"  // 真实 API Key
        
        when:
        def result = userService.authenticate(username, password)
        
        then:
        result.success
    }
}

// ❌ 危险: 使用生产数据库凭据
class DatabaseSpec extends Specification {
    def setupSpec() {
        def config = [
            url: "jdbc:mysql://prod-db.example.com:3306/prod",
            username: "prod_user",
            password: "prodPassword123"
        ]
    }
}

// ❌ 危险: 测试中包含真实用户数据
class UserDataSpec extends Specification {
    def "should process user data"() {
        given:
        def userData = [
            name: "张三",
            phone: "13812345678",  // 真实手机号
            idCard: "110101199001011234"  // 真实身份证
        ]
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用测试专用凭据
class UserServiceSpec extends Specification {
    def "should authenticate user"() {
        given:
        def username = "test_user"
        def password = "test_password_not_real"
        def apiKey = "test_api_key_not_real"
        
        when:
        def result = userService.authenticate(username, password)
        
        then:
        result.success
    }
}

// ✅ 安全: 使用环境变量
class DatabaseSpec extends Specification {
    def setupSpec() {
        def config = [
            url: System.getenv('TEST_DB_URL') ?: 'jdbc:h2:mem:test',
            username: System.getenv('TEST_DB_USER') ?: 'sa',
            password: System.getenv('TEST_DB_PASS') ?: ''
        ]
    }
}

// ✅ 安全: 使用脱敏测试数据
class UserDataSpec extends Specification {
    def "should process user data"() {
        given:
        def userData = [
            name: "测试用户",
            phone: "13800000000",  // 测试号码
            idCard: "000000000000000000"  // 测试身份证
        ]
    }
}

// ✅ 安全: 使用 Faker 生成测试数据
@Grab('com.github.javafaker:javafaker:1.0.2')
import com.github.javafaker.Faker

class UserDataSpec extends Specification {
    def faker = new Faker(new Locale("zh-CN"))
    
    def "should process user data"() {
        given:
        def userData = [
            name: faker.name().fullName(),
            phone: faker.phoneNumber().phoneNumber(),
            email: faker.internet().emailAddress()
        ]
    }
}
```

---

## GRV-022: 不安全 Mock 配置

### 检测模式

```regex
Mock\s*\(\s*\)\s*\{.*_\s*>>\s*true
Stub\s*\(\s*\)\s*\{.*authenticate.*>>\s*true
Spy\s*\(\s*\)\s*\{.*security.*>>\s*null
```

### 危险代码示例

```groovy
// ❌ 危险: Mock 绕过安全检查
class SecureServiceSpec extends Specification {
    def securityService = Mock(SecurityService) {
        // 所有安全检查都返回 true
        _ >> true
    }
    
    def "should process request"() {
        expect:
        service.process(request)  // 安全检查被完全绕过
    }
}

// ❌ 危险: Mock 认证始终成功
class AuthControllerSpec extends Specification {
    def authService = Mock(AuthService) {
        authenticate(_, _) >> true  // 任何凭据都认证成功
    }
}

// ❌ 危险: Spy 修改安全行为
class PaymentServiceSpec extends Specification {
    def paymentService = Spy(PaymentService) {
        validateCard(_) >> true  // 跳过卡号验证
        checkFraud(_) >> false   // 跳过欺诈检测
    }
}

// ❌ 危险: 全局 Mock 安全组件
class ApplicationSpec extends Specification {
    def setupSpec() {
        // 全局禁用安全
        GroovyMock(SecurityContext, global: true) {
            isAuthenticated() >> true
            hasRole(_) >> true
        }
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 明确的 Mock 行为
class SecureServiceSpec extends Specification {
    def securityService = Mock(SecurityService)
    
    def "should allow authorized user"() {
        given:
        securityService.isAuthorized('user123', 'read') >> true
        
        when:
        def result = service.process(request)
        
        then:
        result.success
    }
    
    def "should deny unauthorized user"() {
        given:
        securityService.isAuthorized('user123', 'admin') >> false
        
        when:
        service.process(adminRequest)
        
        then:
        thrown(UnauthorizedException)
    }
}

// ✅ 安全: 测试安全失败场景
class AuthControllerSpec extends Specification {
    def authService = Mock(AuthService)
    
    def "should reject invalid credentials"() {
        given:
        authService.authenticate('user', 'wrong') >> false
        
        when:
        def result = controller.login('user', 'wrong')
        
        then:
        result.status == 401
    }
    
    def "should accept valid credentials"() {
        given:
        authService.authenticate('user', 'correct') >> true
        
        when:
        def result = controller.login('user', 'correct')
        
        then:
        result.status == 200
    }
}

// ✅ 安全: 保留真实安全逻辑
class PaymentServiceSpec extends Specification {
    def paymentService = new PaymentService(
        cardValidator: new RealCardValidator(),  // 使用真实验证器
        fraudDetector: Mock(FraudDetector)       // 只 Mock 外部服务
    )
    
    def "should validate card format"() {
        when:
        paymentService.process(invalidCard)
        
        then:
        thrown(InvalidCardException)
    }
}
```

---

## GRV-023: 测试环境污染

### 检测模式

```regex
@Shared\s+def\s+\w+\s*=
setupSpec\s*\(\s*\)\s*\{.*new\s+File
cleanup\s*\(\s*\)\s*\{.*delete
System\.setProperty
```

### 危险代码示例

```groovy
// ❌ 危险: 共享可变状态
class DataServiceSpec extends Specification {
    @Shared
    def sharedList = []  // 测试间共享，可能导致测试污染
    
    def "test 1"() {
        when:
        sharedList.add("item1")
        
        then:
        sharedList.size() == 1
    }
    
    def "test 2"() {
        expect:
        sharedList.size() == 0  // 失败！sharedList 已被污染
    }
}

// ❌ 危险: 修改系统属性未恢复
class ConfigServiceSpec extends Specification {
    def "should use custom config"() {
        given:
        System.setProperty('app.env', 'test')  // 未恢复
        
        expect:
        configService.getEnv() == 'test'
    }
}

// ❌ 危险: 文件系统污染
class FileServiceSpec extends Specification {
    def "should create file"() {
        given:
        def file = new File('/tmp/test-file.txt')
        file.text = "test content"
        
        // 未清理文件
        expect:
        fileService.read('/tmp/test-file.txt') == "test content"
    }
}

// ❌ 危险: 数据库状态污染
class UserRepositorySpec extends Specification {
    def "should create user"() {
        when:
        repository.save(new User(name: 'test'))
        
        then:
        repository.count() == 1
        // 未清理数据，影响其他测试
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 每个测试独立状态
class DataServiceSpec extends Specification {
    def list = []  // 每个测试重新创建
    
    def "test 1"() {
        when:
        list.add("item1")
        
        then:
        list.size() == 1
    }
    
    def "test 2"() {
        expect:
        list.size() == 0  // 成功！list 是新的
    }
}

// ✅ 安全: 恢复系统属性
class ConfigServiceSpec extends Specification {
    def originalEnv
    
    def setup() {
        originalEnv = System.getProperty('app.env')
    }
    
    def cleanup() {
        if (originalEnv) {
            System.setProperty('app.env', originalEnv)
        } else {
            System.clearProperty('app.env')
        }
    }
    
    def "should use custom config"() {
        given:
        System.setProperty('app.env', 'test')
        
        expect:
        configService.getEnv() == 'test'
    }
}

// ✅ 安全: 使用临时目录
class FileServiceSpec extends Specification {
    @TempDir
    Path tempDir
    
    def "should create file"() {
        given:
        def file = tempDir.resolve('test-file.txt').toFile()
        file.text = "test content"
        
        expect:
        fileService.read(file.absolutePath) == "test content"
        // tempDir 会自动清理
    }
}

// ✅ 安全: 使用事务回滚
@Rollback
class UserRepositorySpec extends Specification {
    def "should create user"() {
        when:
        repository.save(new User(name: 'test'))
        
        then:
        repository.count() == 1
        // 事务会自动回滚
    }
}

// ✅ 安全: 使用 setup/cleanup
class DatabaseSpec extends Specification {
    def setup() {
        // 每个测试前清理
        repository.deleteAll()
    }
    
    def cleanup() {
        // 每个测试后清理
        repository.deleteAll()
    }
}
```

---

## GRV-024: 敏感断言暴露

### 检测模式

```regex
println.*password
println.*secret
println.*token
log\..*password
assert.*password\s*==\s*['"]
```

### 危险代码示例

```groovy
// ❌ 危险: 打印敏感信息
class AuthServiceSpec extends Specification {
    def "should hash password"() {
        given:
        def password = "secretPassword123"
        
        when:
        def hash = authService.hashPassword(password)
        
        then:
        println "Original: ${password}"  // 密码出现在日志中
        println "Hash: ${hash}"
        hash != password
    }
}

// ❌ 危险: 断言暴露敏感值
class TokenServiceSpec extends Specification {
    def "should generate token"() {
        when:
        def token = tokenService.generate(user)
        
        then:
        // 失败时会显示实际 token 值
        token == "expected_token_value"
    }
}

// ❌ 危险: 错误消息包含敏感信息
class ConfigSpec extends Specification {
    def "should load config"() {
        expect:
        config.apiKey == System.getenv('API_KEY')
        // 断言失败会显示: Expected: sk-xxx, Actual: sk-yyy
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 不打印敏感信息
class AuthServiceSpec extends Specification {
    def "should hash password"() {
        given:
        def password = "testPassword"
        
        when:
        def hash = authService.hashPassword(password)
        
        then:
        hash != password
        hash.length() == 60  // bcrypt 长度
        hash.startsWith('$2a$')  // bcrypt 格式
    }
}

// ✅ 安全: 验证属性而非值
class TokenServiceSpec extends Specification {
    def "should generate valid token"() {
        when:
        def token = tokenService.generate(user)
        
        then:
        token != null
        token.length() > 0
        tokenService.validate(token)  // 验证有效性而非具体值
    }
}

// ✅ 安全: 使用自定义断言消息
class ConfigSpec extends Specification {
    def "should load config"() {
        expect:
        config.apiKey != null : "API key should be configured"
        config.apiKey.startsWith('sk-') : "API key should have correct prefix"
    }
}

// ✅ 安全: 验证格式而非内容
class CredentialServiceSpec extends Specification {
    def "should encrypt credentials"() {
        given:
        def plaintext = "sensitive_data"
        
        when:
        def encrypted = credentialService.encrypt(plaintext)
        
        then:
        encrypted != plaintext
        encrypted.matches(/^[A-Za-z0-9+/=]+$/)  // Base64 格式
        credentialService.decrypt(encrypted) == plaintext
    }
}
```

---

## GRV-025: 外部依赖风险

### 检测模式

```regex
new\s+URL\s*\(\s*['"]http
HttpURLConnection
RestTemplate.*http://
WebClient.*http://
```

### 危险代码示例

```groovy
// ❌ 危险: 测试依赖外部服务
class ApiClientSpec extends Specification {
    def "should call external API"() {
        when:
        // 依赖真实外部服务
        def result = apiClient.get("https://api.example.com/data")
        
        then:
        result.status == 200
    }
}

// ❌ 危险: 使用 HTTP 而非 HTTPS
class WebServiceSpec extends Specification {
    def "should fetch data"() {
        when:
        def conn = new URL("http://api.example.com/data").openConnection()
        
        then:
        conn.responseCode == 200
    }
}

// ❌ 危险: 测试中下载外部资源
class ResourceSpec extends Specification {
    def "should process external resource"() {
        given:
        def resource = new URL("https://untrusted-site.com/script.js").text
        
        expect:
        processor.process(resource)
    }
}
```

### 安全代码示例

```groovy
// ✅ 安全: 使用 WireMock 模拟外部服务
@AutoConfigureWireMock(port = 0)
class ApiClientSpec extends Specification {
    @Value('${wiremock.server.port}')
    int wireMockPort
    
    def "should call external API"() {
        given:
        stubFor(get(urlEqualTo("/data"))
            .willReturn(aResponse()
                .withStatus(200)
                .withBody('{"result": "success"}')))
        
        when:
        def result = apiClient.get("http://localhost:${wireMockPort}/data")
        
        then:
        result.status == 200
    }
}

// ✅ 安全: 使用 Mock HTTP Client
class WebServiceSpec extends Specification {
    def httpClient = Mock(HttpClient)
    def webService = new WebService(httpClient)
    
    def "should fetch data"() {
        given:
        httpClient.get(_) >> new Response(status: 200, body: '{}')
        
        when:
        def result = webService.fetchData()
        
        then:
        result.status == 200
    }
}

// ✅ 安全: 使用本地测试资源
class ResourceSpec extends Specification {
    def "should process resource"() {
        given:
        def resource = getClass().getResource('/test-data/script.js').text
        
        expect:
        processor.process(resource)
    }
}

// ✅ 安全: 使用 Testcontainers
@Testcontainers
class DatabaseIntegrationSpec extends Specification {
    @Container
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:15")
    
    def "should connect to database"() {
        expect:
        dataSource.connection.isValid(1)
    }
}
```

---

## Spock 安全检查清单

```yaml
spock_security_checklist:
  测试数据:
    - [ ] 不使用真实凭据
    - [ ] 不使用真实用户数据
    - [ ] 使用环境变量或 Faker
    - [ ] 测试数据与生产隔离
  
  Mock 配置:
    - [ ] 不全局绕过安全检查
    - [ ] 测试安全失败场景
    - [ ] 保留关键安全逻辑
    - [ ] 明确 Mock 行为
  
  环境隔离:
    - [ ] 避免共享可变状态
    - [ ] 恢复系统属性
    - [ ] 使用临时目录
    - [ ] 使用事务回滚
  
  敏感信息:
    - [ ] 不打印敏感数据
    - [ ] 验证格式而非值
    - [ ] 使用自定义断言消息
  
  外部依赖:
    - [ ] 使用 WireMock 模拟
    - [ ] 使用 Testcontainers
    - [ ] 不依赖真实外部服务
    - [ ] 使用本地测试资源
```

---

## Spock 安全测试模板

```groovy
// 安全的 Spock 测试基类
abstract class SecureSpecification extends Specification {
    // 测试专用凭据
    static final TEST_USERNAME = "test_user"
    static final TEST_PASSWORD = "test_password_not_real"
    
    // 保存原始系统属性
    private Map<String, String> originalProperties = [:]
    
    def setup() {
        // 记录将要修改的系统属性
    }
    
    def cleanup() {
        // 恢复系统属性
        originalProperties.each { key, value ->
            if (value == null) {
                System.clearProperty(key)
            } else {
                System.setProperty(key, value)
            }
        }
        originalProperties.clear()
    }
    
    protected void setSystemProperty(String key, String value) {
        if (!originalProperties.containsKey(key)) {
            originalProperties[key] = System.getProperty(key)
        }
        System.setProperty(key, value)
    }
    
    // 生成测试数据
    protected Map generateTestUser() {
        [
            name: "Test User ${UUID.randomUUID().toString().take(8)}",
            email: "test_${System.currentTimeMillis()}@example.com",
            phone: "13800000000"
        ]
    }
}

// 使用示例
class UserServiceSpec extends SecureSpecification {
    def "should create user"() {
        given:
        def userData = generateTestUser()
        
        when:
        def user = userService.create(userData)
        
        then:
        user.id != null
        user.name == userData.name
    }
}
```

---

## 参考资料

- [Spock Framework](https://spockframework.org/)
- [WireMock](https://wiremock.org/)
- [Testcontainers](https://www.testcontainers.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
