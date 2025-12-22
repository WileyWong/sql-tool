# 安全认证索引

> **覆盖范围**: `{{BASE_PACKAGE}}.security`  
> **生成时间**: {{SCAN_DATE}}

---

## 认证配置

### SecurityConfig - 安全配置

**路径**: `com.company.project.security.SecurityConfig`  
**注解**: `@EnableWebSecurity`, `@EnableGlobalMethodSecurity`

| 配置项 | 说明 |
|--------|------|
| 白名单路径 | `/api/auth/**`, `/api/public/**` |
| 认证方式 | JWT Token |
| 密码加密 | BCryptPasswordEncoder |

---

## 认证组件

### JwtTokenProvider - Token提供者

**路径**: `com.company.project.security.JwtTokenProvider`

| 方法 | 功能说明 |
|------|----------|
| `generateToken(UserDetails user)` | 生成Token |
| `validateToken(String token)` | 验证Token |
| `getUserIdFromToken(String token)` | 从Token获取用户ID |

### JwtAuthenticationFilter - JWT过滤器

**路径**: `com.company.project.security.JwtAuthenticationFilter`  
**继承**: `OncePerRequestFilter`

| 方法 | 功能说明 |
|------|----------|
| `doFilterInternal` | 从请求头提取Token并验证 |
