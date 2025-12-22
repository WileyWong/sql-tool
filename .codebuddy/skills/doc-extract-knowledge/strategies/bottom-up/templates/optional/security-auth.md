# 安全认证

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 🔐 认证方式

| 方式 | 说明 | 配置类 |
|------|------|--------|
| {{AUTH_TYPE}} | {{AUTH_DESC}} | `{{CONFIG_CLASS}}` |

---

## 📋 安全配置

### {{SECURITY_CONFIG_CLASS}}

**类定义**:
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class {{SECURITY_CONFIG_CLASS}} {
    // ...
}
```

**核心方法**:

#### securityFilterChain
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | http | HttpSecurity | 安全配置构建器 |
- **返回**: `SecurityFilterChain` - 安全过滤器链
- **说明**: 配置 HTTP 安全策略

**公开接口**:
- `{{PUBLIC_PATH_1}}` - {{PATH_DESC}}
- `{{PUBLIC_PATH_2}}` - {{PATH_DESC}}

**需认证接口**:
- `{{PROTECTED_PATH}}` - {{PATH_DESC}}

---

## 🔑 JWT 配置

### {{JWT_CONFIG_CLASS}}

**类定义**:
```java
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class {{JWT_CONFIG_CLASS}} {
    // ...
}
```

**配置属性**:
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| secret | String | - | 签名密钥 |
| expire | Long | 7200 | 过期时间（秒） |
| header | String | "Authorization" | Token 请求头 |
| prefix | String | "Bearer " | Token 前缀 |

**核心方法**:

#### generateToken
```java
public String generateToken({{USER_DETAILS_TYPE}} userDetails)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | userDetails | {{USER_DETAILS_TYPE}} | 用户信息 |
- **返回**: `String` - JWT Token
- **说明**: 生成 JWT Token

#### validateToken
```java
public boolean validateToken(String token, {{USER_DETAILS_TYPE}} userDetails)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | token | String | JWT Token |
  | userDetails | {{USER_DETAILS_TYPE}} | 用户信息 |
- **返回**: `boolean` - Token 是否有效
- **说明**: 验证 JWT Token

#### parseToken
```java
public Claims parseToken(String token) throws JwtException
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | token | String | JWT Token |
- **返回**: `Claims` - Token 载荷信息
- **异常**: `JwtException` - Token 解析失败
- **说明**: 解析 JWT Token

---

## 👥 权限控制

### 角色定义

| 角色 | 说明 | 权限范围 |
|------|------|----------|
| {{ROLE_NAME}} | {{ROLE_DESC}} | {{PERMISSIONS}} |

### 权限注解使用

**方法级别**:
```java
@PreAuthorize("hasRole('{{ROLE}}')")
public void adminMethod() {
    // 需要指定角色
}

@PreAuthorize("hasPermission('{{PERMISSION}}')")
public void permissionMethod() {
    // 需要指定权限
}

@PreAuthorize("hasAnyRole('{{ROLE_1}}', '{{ROLE_2}}')")
public void multiRoleMethod() {
    // 需要任一角色
}

@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
public void ownerOrAdminMethod(Long userId) {
    // 本人或管理员
}
```

---

## 🛡️ 安全措施

| 措施 | 实现方式 | 配置位置 |
|------|----------|----------|
| 密码加密 | BCrypt | `PasswordEncoderConfig` |
| XSS 防护 | 输入过滤 | `XssFilter` |
| CSRF 防护 | Token 验证 | `SecurityConfig` |
| SQL 注入 | 参数化查询 | MyBatis |

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
