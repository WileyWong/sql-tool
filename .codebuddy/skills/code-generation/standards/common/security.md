# 通用安全规范

适用于所有语言的安全编码最佳实践。

---

## 输入验证

### 验证原则

| 原则 | 说明 |
|------|------|
| 白名单优先 | 只允许已知的合法输入 |
| 服务端验证 | 不信任客户端验证 |
| 验证所有输入 | 包括 URL、Header、Cookie |
| 失败安全 | 验证失败时拒绝请求 |

### 验证检查项

| 检查项 | 说明 | 优先级 |
|--------|------|--------|
| 参数非空 | 必填参数不能为空 | P0 |
| 长度限制 | 字符串长度上下限 | P0 |
| 格式校验 | 邮箱、手机号、URL 格式 | P0 |
| 范围校验 | 数值范围、枚举值 | P1 |
| 类型校验 | 数据类型正确 | P1 |
| 业务校验 | 业务规则约束 | P1 |

### 验证示例

```yaml
用户名:
  - 必填
  - 长度: 3-20
  - 格式: ^[a-zA-Z0-9_]+$
  - 不能是保留词: admin, root, system

邮箱:
  - 必填
  - 格式: RFC 5322
  - 长度: <= 255

密码:
  - 必填
  - 长度: 8-128
  - 复杂度: 大小写 + 数字 + 特殊字符
```

---

## 常见安全漏洞防护

### SQL 注入

```yaml
风险等级: 严重

防护措施:
  - ✅ 使用参数化查询/预编译语句
  - ✅ 使用 ORM 框架
  - ✅ 输入验证（白名单）
  - ❌ 禁止字符串拼接 SQL
  - ❌ 禁止动态表名/列名

检测方法:
  - 代码审查
  - 静态分析工具
  - 渗透测试
```

### XSS 攻击

```yaml
风险等级: 高

防护措施:
  - ✅ 输出编码（HTML/JS/URL/CSS）
  - ✅ 使用安全的模板引擎（自动转义）
  - ✅ 设置 Content-Security-Policy
  - ✅ 设置 HttpOnly Cookie
  - ❌ 禁止直接输出用户输入

编码规则:
  HTML: < → &lt;  > → &gt;  & → &amp;
  JS: 使用 JSON.stringify
  URL: 使用 encodeURIComponent
```

### CSRF 攻击

```yaml
风险等级: 高

防护措施:
  - ✅ 使用 CSRF Token
  - ✅ 验证 Referer/Origin
  - ✅ 使用 SameSite Cookie
  - ✅ 敏感操作二次确认

Token 要求:
  - 随机生成
  - 绑定会话
  - 每次请求验证
  - 定期刷新
```

### 敏感数据保护

```yaml
密码存储:
  - ✅ 使用 BCrypt/Argon2/PBKDF2
  - ✅ 强度参数 >= 10
  - ❌ 禁止 MD5/SHA1
  - ❌ 禁止明文存储

数据传输:
  - ✅ 使用 HTTPS
  - ✅ TLS 1.2+
  - ❌ 禁止 HTTP 传输敏感数据

数据脱敏:
  手机号: 138****1234
  身份证: 110101****1234
  银行卡: ****1234
  邮箱: a***@example.com
```

### 权限控制

```yaml
原则:
  - 最小权限原则
  - 默认拒绝
  - 职责分离

检查点:
  - ✅ 接口级权限校验
  - ✅ 数据级权限校验（资源所有权）
  - ✅ 功能级权限校验
  - ✅ 水平越权检查
  - ✅ 垂直越权检查
```

---

## 安全编码检查清单

### P0 - 必须检查

- [ ] 所有用户输入都经过验证
- [ ] SQL 使用参数化查询
- [ ] 密码使用安全算法加密
- [ ] 敏感数据不记录日志
- [ ] HTTPS 传输敏感数据
- [ ] 实现权限控制

### P1 - 建议检查

- [ ] 实现 CSRF 防护
- [ ] 设置安全 HTTP 头
- [ ] 实现速率限制
- [ ] 敏感操作审计日志
- [ ] 错误信息不泄露内部细节

---

## 安全 HTTP 头

```yaml
必须设置:
  Content-Security-Policy: default-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains

建议设置:
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=()
```

---

## 各语言实现参考

| 语言 | 详细文档 |
|------|---------|
| Java | [java/security.md](../java/security.md) |
| Go | [go/security.md](../go/security.md) |
| TypeScript | [typescript/security.md](../typescript/security.md) |

---

## 安全工具推荐

| 类型 | 工具 |
|------|------|
| 静态分析 | SonarQube, SpotBugs, ESLint |
| 依赖扫描 | OWASP Dependency Check, npm audit |
| 渗透测试 | OWASP ZAP, Burp Suite |
| 密码检测 | git-secrets, truffleHog |
