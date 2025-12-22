# 安全检测规则库

本文档定义了 `code-security-scan` 使用的完整安全检测规则。

## 规则索引

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| SQL-001 | 字符串拼接SQL | 🔴 严重 | SQL注入 |
| SQL-002 | MyBatis ${} 动态SQL | 🔴 严重 | SQL注入 |
| SQL-003 | JDBC Statement 拼接 | 🔴 严重 | SQL注入 |
| XSS-001 | 未转义的用户输入 | 🟠 高危 | XSS |
| XSS-002 | innerHTML 直接设置 | 🟠 高危 | XSS |
| XSS-003 | 富文本未过滤 | 🟡 中危 | XSS |
| LEAK-001 | 日志打印密码 | 🟠 高危 | 敏感信息 |
| LEAK-002 | 响应返回敏感字段 | 🟡 中危 | 敏感信息 |
| LEAK-003 | 异常堆栈暴露 | 🟡 中危 | 敏感信息 |
| LEAK-004 | 注释包含敏感信息 | 🟠 高危 | 敏感信息 |
| CRYPTO-001 | MD5/SHA1 加密密码 | 🟠 高危 | 不安全加密 |
| CRYPTO-002 | DES/3DES 加密 | 🟠 高危 | 不安全加密 |
| CRYPTO-003 | ECB 模式 | 🟡 中危 | 不安全加密 |
| CRYPTO-004 | 硬编码密钥 | 🟠 高危 | 不安全加密 |
| AUTH-001 | 缺少权限注解 | 🟠 高危 | 权限控制 |
| AUTH-002 | 垂直越权风险 | 🟠 高危 | 权限控制 |
| AUTH-003 | 水平越权风险 | 🟠 高危 | 权限控制 |
| FILE-001 | 路径遍历漏洞 | 🔴 严重 | 文件操作 |
| FILE-002 | 文件上传未校验 | 🟠 高危 | 文件操作 |
| FILE-003 | 任意文件读取 | 🔴 严重 | 文件操作 |
| DESER-001 | 不可信数据反序列化 | 🟠 高危 | 反序列化 |
| DESER-002 | ObjectInputStream | 🟡 中危 | 反序列化 |
| DESER-003 | Fastjson 不安全配置 | 🟠 高危 | 反序列化 |
| CONFIG-001 | Debug 模式开启 | 🟡 中危 | 配置安全 |
| CONFIG-002 | 敏感配置明文 | 🟡 中危 | 配置安全 |
| CONFIG-003 | CORS 配置宽松 | 🟡 中危 | 配置安全 |

---

## 详细规则定义

### SQL-001: 字符串拼接SQL

**风险等级**: 🔴 严重

**检测模式**:
```regex
".*SELECT.*" \\+ .+
".*WHERE.*" \\+ .+
".*INSERT.*" \\+ .+
".*UPDATE.*" \\+ .+
".*DELETE.*" \\+ .+
```

**代码模式**:
```java
String sql = "SELECT * FROM users WHERE id = " + userId;
String query = "DELETE FROM orders WHERE id = " + orderId;
```

**安全建议**: 使用参数化查询（PreparedStatement、MyBatis #{} 语法、JPA）

---

### SQL-002: MyBatis ${} 动态SQL

**风险等级**: 🔴 严重

**检测模式**:
```regex
@Select.*\\$\\{.*\\}
@Update.*\\$\\{.*\\}
@Delete.*\\$\\{.*\\}
<select.*\\$\\{.*\\}.*</select>
```

**代码模式**:
```java
@Select("SELECT * FROM users WHERE id = ${userId}")
User findById(@Param("userId") Long userId);
```

**安全建议**: 改用 #{} 语法进行参数化查询

---

### XSS-001: 未转义的用户输入

**风险等级**: 🟠 高危

**检测模式**:
```java
// 检测直接拼接 HTML
return ".*<.*>" + userInput + ".*";

// 检测 Model 直接传递用户输入
model.addAttribute(".*", request.getParameter(".*"));
```

**安全建议**: 使用 `HtmlUtils.htmlEscape()` 或模板引擎自动转义

---

### LEAK-001: 日志打印密码

**风险等级**: 🟠 高危

**检测模式**:
```regex
log\\.(info|debug|warn|error).*password
log\\.(info|debug|warn|error).*pwd
log\\.(info|debug|warn|error).*token
log\\.(info|debug|warn|error).*secret
log\\.(info|debug|warn|error).*key
```

**代码模式**:
```java
log.info("用户登录: {}", user); // User 包含 password 字段
log.debug("密码: {}", password);
```

**安全建议**: 实现 DTO 的 `toString()` 方法进行脱敏

---

### CRYPTO-001: MD5/SHA1 加密密码

**风险等级**: 🟠 高危

**检测模式**:
```java
MessageDigest.getInstance("MD5")
MessageDigest.getInstance("SHA-1")
DigestUtils.md5Hex(password)
DigestUtils.sha1Hex(password)
```

**安全建议**: 使用 BCrypt、Argon2、PBKDF2 等现代密码哈希算法

---

### AUTH-001: 缺少权限注解

**风险等级**: 🟠 高危

**检测模式**:
```java
// 检测管理接口缺少权限注解
@PostMapping("/api/admin/.*")
public .* method(.*)  // 缺少 @PreAuthorize 或 @Secured
```

**代码模式**:
```java
@PostMapping("/api/admin/users")
public Result deleteUser(@PathVariable Long id) {
    // 缺少 @PreAuthorize("hasRole('ADMIN')")
}
```

**安全建议**: 添加 `@PreAuthorize("hasRole('ADMIN')")` 注解

---

### FILE-001: 路径遍历漏洞

**风险等级**: 🔴 严重

**检测模式**:
```java
// 检测文件路径拼接
new File(".*" + .+ + ".*")
Paths.get(".*", .+)

// 检测未规范化的路径
file.transferTo(new File(.+))
```

**代码模式**:
```java
String path = "/uploads/" + filename; // filename 可能包含 ../
File file = new File(path);
```

**安全建议**: 使用 `Paths.get().normalize()` 并验证路径前缀

---

## 检测优先级

### 第一优先级（严重）
按照以下顺序检测严重漏洞：
1. SQL-001, SQL-002, SQL-003
2. FILE-001, FILE-003
3. 其他严重漏洞

### 第二优先级（高危）
检测高危漏洞：
1. XSS-001, XSS-002
2. LEAK-001, LEAK-004
3. CRYPTO-001, CRYPTO-002, CRYPTO-004
4. AUTH-001, AUTH-002, AUTH-003

### 第三优先级（中危）
检测中危漏洞：
1. CONFIG-001, CONFIG-002, CONFIG-003
2. 其他中危漏洞

---

**版本**: 1.0.0  
**更新时间**: 2025-12-08
