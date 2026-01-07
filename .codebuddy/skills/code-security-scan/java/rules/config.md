# 配置安全检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| CONFIG-001 | Debug 模式开启 | 🟡 中危 |
| CONFIG-002 | 敏感配置明文 | 🟡 中危 |
| CONFIG-003 | CORS 配置宽松 | 🟡 中危 |

---

## CONFIG-001: Debug 模式开启

### 检测模式

```regex
debug:\s*true
debug=true
logging\.level\..*=DEBUG
spring\.jpa\.show-sql:\s*true
```

### 危险代码示例

```yaml
# ❌ 危险: application.yml
debug: true

logging:
  level:
    root: DEBUG
    org.springframework: DEBUG
    org.hibernate.SQL: DEBUG

spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

```properties
# ❌ 危险: application.properties
debug=true
logging.level.root=DEBUG
spring.jpa.show-sql=true
```

### 安全代码示例

```yaml
# ✅ 安全: application.yml (生产环境)
debug: false

logging:
  level:
    root: WARN
    com.example: INFO

spring:
  jpa:
    show-sql: false
```

```yaml
# ✅ 安全: 使用 profile 区分环境
# application-dev.yml
debug: true
logging:
  level:
    root: DEBUG

# application-prod.yml
debug: false
logging:
  level:
    root: WARN
```

---

## CONFIG-002: 敏感配置明文

### 检测模式

```regex
password:\s*[^$\{]
password=(?!\$\{)
secret:\s*[^$\{]
api[_-]?key:\s*[^$\{]
```

### 危险代码示例

```yaml
# ❌ 危险: 明文密码
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: root123456

  redis:
    host: localhost
    password: redis123

jwt:
  secret: mySecretKey123456789

third-party:
  api-key: sk_live_abc123xyz
```

### 安全代码示例

```yaml
# ✅ 安全: 使用环境变量
spring:
  datasource:
    password: ${DB_PASSWORD}
  redis:
    password: ${REDIS_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
```

```yaml
# ✅ 安全: 使用 Jasypt 加密
spring:
  datasource:
    password: ENC(encrypted_password_here)

jasypt:
  encryptor:
    password: ${JASYPT_ENCRYPTOR_PASSWORD}
```

```yaml
# ✅ 安全: 使用 Spring Cloud Config
spring:
  cloud:
    config:
      uri: http://config-server:8888
      profile: ${SPRING_PROFILES_ACTIVE}
```

```yaml
# ✅ 安全: 使用 Vault
spring:
  cloud:
    vault:
      uri: http://vault:8200
      token: ${VAULT_TOKEN}
```

### Jasypt 配置示例

```java
// 加密密码
StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
encryptor.setPassword("masterPassword");
String encryptedPassword = encryptor.encrypt("root123456");
// 结果: ENC(encrypted_value)

// pom.xml
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>
```

---

## CONFIG-003: CORS 配置宽松

### 检测模式

```regex
@CrossOrigin\(origins\s*=\s*"\*"
allowedOrigins\("\*"\)
.allowedOrigins\("\*"\)
Access-Control-Allow-Origin:\s*\*
```

### 危险代码示例

```java
// ❌ 危险: 允许所有来源
@CrossOrigin(origins = "*")
@RestController
public class UserController {
    // ...
}

// ❌ 危险: 全局 CORS 配置
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true); // 与 * 冲突
    }
}

// ❌ 危险: Filter 配置
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Methods", "*");
```

### 安全代码示例

```java
// ✅ 安全: 限制允许的来源
@CrossOrigin(origins = {"https://example.com", "https://app.example.com"})
@RestController
public class UserController {
    // ...
}

// ✅ 安全: 全局 CORS 配置
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://example.com", "https://app.example.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("Authorization", "Content-Type")
            .allowCredentials(true)
            .maxAge(3600);
    }
}

// ✅ 安全: 从配置读取允许的来源
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

```yaml
# application.yml
cors:
  allowed-origins:
    - https://example.com
    - https://app.example.com
```

---

## 其他配置安全检查

### CSRF 保护

```java
// ❌ 危险: 禁用 CSRF
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable(); // 不推荐
    }
}

// ✅ 安全: 启用 CSRF (对于非 API 应用)
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }
}
```

### Session 配置

```yaml
# ✅ 安全: Session 配置
server:
  servlet:
    session:
      cookie:
        http-only: true
        secure: true
        same-site: strict
      timeout: 30m
```

### HTTPS 强制

```java
// ✅ 安全: 强制 HTTPS
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.requiresChannel()
            .anyRequest()
            .requiresSecure();
    }
}
```

---

## 配置安全检查清单

```yaml
config_security_checklist:
  环境区分:
    - [ ] 生产环境禁用 debug 模式
    - [ ] 生产环境日志级别为 WARN 或 INFO
    - [ ] 使用 profile 区分环境配置
  
  敏感信息:
    - [ ] 密码使用环境变量或加密
    - [ ] API 密钥不在代码中硬编码
    - [ ] 使用配置中心或密钥管理服务
  
  CORS:
    - [ ] 限制允许的来源
    - [ ] 限制允许的方法
    - [ ] 限制允许的头部
  
  安全头部:
    - [ ] 启用 CSRF 保护（非 API 应用）
    - [ ] 配置安全的 Session Cookie
    - [ ] 强制 HTTPS
```

---

## 参考资料

- [OWASP Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [CWE-16: Configuration](https://cwe.mitre.org/data/definitions/16.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
