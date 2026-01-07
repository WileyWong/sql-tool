# 敏感信息泄露检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| LEAK-001 | 日志打印密码 | 🟠 高危 |
| LEAK-002 | 响应返回敏感字段 | 🟡 中危 |
| LEAK-003 | 异常堆栈暴露 | 🟡 中危 |
| LEAK-004 | 注释包含敏感信息 | 🟠 高危 |

---

## LEAK-001: 日志打印密码

### 检测模式

```regex
log\.(info|debug|warn|error).*password
log\.(info|debug|warn|error).*pwd
log\.(info|debug|warn|error).*token
log\.(info|debug|warn|error).*secret
log\.(info|debug|warn|error).*apiKey
log\.(info|debug|warn|error).*credential
```

### 危险代码示例

```java
// ❌ 危险模式 1: 直接打印密码
log.info("用户登录: 密码={}", password);
log.debug("密码: {}", user.getPassword());

// ❌ 危险模式 2: 打印包含密码的对象
log.info("用户登录: {}", user); // User.toString() 包含 password

// ❌ 危险模式 3: 打印 Token
log.info("Token: {}", accessToken);
log.debug("API Key: {}", apiKey);

// ❌ 危险模式 4: 打印请求体
log.info("请求参数: {}", requestBody); // 可能包含密码
```

### 安全代码示例

```java
// ✅ 安全模式 1: 不打印敏感信息
log.info("用户登录: userId={}", user.getId());

// ✅ 安全模式 2: 使用脱敏方法
log.info("用户登录: {}", user.toSafeString());

// ✅ 安全模式 3: 重写 toString() 进行脱敏
@Override
public String toString() {
    return "User{id=" + id + ", username=" + username + ", password=***}";
}

// ✅ 安全模式 4: 使用 @ToString.Exclude (Lombok)
@Data
public class User {
    private Long id;
    private String username;
    @ToString.Exclude
    private String password;
}

// ✅ 安全模式 5: 使用脱敏工具类
public static String maskPassword(String password) {
    if (password == null) return null;
    return "***";
}

public static String maskToken(String token) {
    if (token == null || token.length() < 8) return "***";
    return token.substring(0, 4) + "****" + token.substring(token.length() - 4);
}
```

---

## LEAK-002: 响应返回敏感字段

### 检测模式

```regex
return\s+.*Repository\.find
return\s+.*\.getPassword\(\)
ResponseEntity\.ok\(.*Entity
```

### 危险代码示例

```java
// ❌ 危险: 直接返回 Entity
@GetMapping("/user/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow(); // 包含 password
}

// ❌ 危险: 返回包含敏感字段的列表
@GetMapping("/users")
public List<User> getAllUsers() {
    return userRepository.findAll(); // 所有用户的密码都暴露
}
```

### 安全代码示例

```java
// ✅ 安全: 使用 DTO
@GetMapping("/user/{id}")
public UserDTO getUser(@PathVariable Long id) {
    User user = userRepository.findById(id).orElseThrow();
    return userConverter.toDTO(user); // DTO 不包含 password
}

// ✅ 安全: 使用 @JsonIgnore
@Data
public class User {
    private Long id;
    private String username;
    @JsonIgnore
    private String password;
}

// ✅ 安全: 使用投影 (Projection)
public interface UserProjection {
    Long getId();
    String getUsername();
    // 不包含 getPassword()
}

@Query("SELECT u FROM User u WHERE u.id = :id")
UserProjection findUserById(@Param("id") Long id);
```

---

## LEAK-003: 异常堆栈暴露

### 检测模式

```regex
catch.*Exception.*e\.getMessage\(\)
catch.*Exception.*e\.printStackTrace\(\)
ResponseEntity\.status\(500\)\.body\(e
return.*e\.getStackTrace
```

### 危险代码示例

```java
// ❌ 危险模式 1: 返回异常消息
@GetMapping("/data")
public ResponseEntity<?> getData() {
    try {
        return ResponseEntity.ok(service.getData());
    } catch (Exception e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}

// ❌ 危险模式 2: 返回堆栈信息
catch (Exception e) {
    return ResponseEntity.status(500).body(Arrays.toString(e.getStackTrace()));
}

// ❌ 危险模式 3: 打印堆栈到响应
catch (Exception e) {
    e.printStackTrace(response.getWriter());
}
```

### 安全代码示例

```java
// ✅ 安全: 返回通用错误消息
@GetMapping("/data")
public ResponseEntity<?> getData() {
    try {
        return ResponseEntity.ok(service.getData());
    } catch (Exception e) {
        log.error("获取数据失败", e); // 日志记录详细信息
        return ResponseEntity.status(500).body("服务器内部错误");
    }
}

// ✅ 安全: 使用全局异常处理器
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("未处理异常", e);
        return ResponseEntity.status(500)
            .body(new ErrorResponse("INTERNAL_ERROR", "服务器内部错误"));
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(400)
            .body(new ErrorResponse(e.getCode(), e.getMessage()));
    }
}
```

---

## LEAK-004: 注释包含敏感信息

### 检测模式

```regex
//.*password.*=
//.*pwd.*=
//.*token.*=
//.*secret.*=
//.*apiKey.*=
/\*.*password.*\*/
```

### 危险代码示例

```java
// ❌ 危险: 注释中的密码
// 测试账号: admin / admin123
// 数据库密码: root123456
// API密钥: sk_test_abc123xyz

/*
 * 临时密码: temp123
 * TODO: 记得删除这个密码
 */
```

### 安全代码示例

```java
// ✅ 安全: 使用环境变量
// 数据库密码从环境变量 DB_PASSWORD 获取

// ✅ 安全: 使用配置中心
// API密钥从配置中心获取，参考 docs/config.md

// ✅ 安全: 使用密钥管理服务
// 敏感信息存储在 Vault，参考 docs/security.md
```

---

## 敏感信息关键词列表

```yaml
sensitive_keywords:
  - password
  - pwd
  - passwd
  - token
  - accessToken
  - refreshToken
  - secret
  - secretKey
  - apiKey
  - api_key
  - privateKey
  - private_key
  - credential
  - auth
  - authorization
  - bearer
  - jwt
  - session
  - cookie
  - ssn
  - creditCard
  - cardNumber
```

---

## 参考资料

- [OWASP Sensitive Data Exposure](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities)
- [CWE-200: Information Exposure](https://cwe.mitre.org/data/definitions/200.html)
- [CWE-532: Information Exposure Through Log Files](https://cwe.mitre.org/data/definitions/532.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
