# Java 安全规则索引

本文档定义 Java/Spring Boot 项目的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| JAVA-SQL-001 | 字符串拼接SQL | 🔴 严重 | SQL注入 |
| JAVA-SQL-002 | MyBatis ${} 动态SQL | 🔴 严重 | SQL注入 |
| JAVA-SQL-003 | JDBC Statement 拼接 | 🔴 严重 | SQL注入 |
| JAVA-XSS-001 | 未转义的用户输入 | 🟠 高危 | XSS |
| JAVA-XSS-002 | innerHTML 直接设置 | 🟠 高危 | XSS |
| JAVA-XSS-003 | 富文本未过滤 | 🟡 中危 | XSS |
| JAVA-LEAK-001 | 日志打印密码 | 🟠 高危 | 敏感信息 |
| JAVA-LEAK-002 | 响应返回敏感字段 | 🟡 中危 | 敏感信息 |
| JAVA-LEAK-003 | 异常堆栈暴露 | 🟡 中危 | 敏感信息 |
| JAVA-LEAK-004 | 注释包含敏感信息 | 🟠 高危 | 敏感信息 |
| JAVA-CRYPTO-001 | MD5/SHA1 加密密码 | 🟠 高危 | 不安全加密 |
| JAVA-CRYPTO-002 | DES/3DES 加密 | 🟠 高危 | 不安全加密 |
| JAVA-CRYPTO-003 | ECB 模式 | 🟡 中危 | 不安全加密 |
| JAVA-CRYPTO-004 | 硬编码密钥 | 🟠 高危 | 不安全加密 |
| JAVA-AUTH-001 | 缺少权限注解 | 🟠 高危 | 权限控制 |
| JAVA-AUTH-002 | 垂直越权风险 | 🟠 高危 | 权限控制 |
| JAVA-AUTH-003 | 水平越权风险 | 🟠 高危 | 权限控制 |
| JAVA-FILE-001 | 路径遍历漏洞 | 🔴 严重 | 文件操作 |
| JAVA-FILE-002 | 文件上传未校验 | 🟠 高危 | 文件操作 |
| JAVA-FILE-003 | 任意文件读取 | 🔴 严重 | 文件操作 |
| JAVA-DESER-001 | 不可信数据反序列化 | 🟠 高危 | 反序列化 |
| JAVA-DESER-002 | ObjectInputStream | 🟡 中危 | 反序列化 |
| JAVA-DESER-003 | Fastjson 不安全配置 | 🟠 高危 | 反序列化 |
| JAVA-CONFIG-001 | Debug 模式开启 | 🟡 中危 | 配置安全 |
| JAVA-CONFIG-002 | 敏感配置明文 | 🟡 中危 | 配置安全 |
| JAVA-CONFIG-003 | CORS 配置宽松 | 🟡 中危 | 配置安全 |
| JAVA-SSRF-001 | 服务端请求伪造 | 🟠 高危 | SSRF |
| JAVA-DEP-001 | 已知漏洞依赖 | 🟠 高危 | 依赖安全 |
| JAVA-DEP-002 | 过时依赖版本 | 🟡 中危 | 依赖安全 |
| JAVA-LOG-001 | 安全日志缺失 | 🟡 中危 | 日志安全 |
| JAVA-LOG-002 | 日志注入风险 | 🟠 高危 | 日志安全 |

---

## 详细规则

### SQL 注入规则

详见: [rules/sql-injection.md](rules/sql-injection.md)

### XSS 规则

详见: [rules/xss.md](rules/xss.md)

### 敏感信息泄露规则

详见: [rules/sensitive-data.md](rules/sensitive-data.md)

### 加密安全规则

详见: [rules/crypto.md](rules/crypto.md)

### 权限控制规则

详见: [rules/auth.md](rules/auth.md)

### 文件操作规则

详见: [rules/file-operation.md](rules/file-operation.md)

### 反序列化规则

详见: [rules/deserialization.md](rules/deserialization.md)

### 配置安全规则

详见: [rules/config.md](rules/config.md)

### SSRF 规则

详见: [rules/ssrf.md](rules/ssrf.md)

### 依赖安全规则

详见: [rules/dependency.md](rules/dependency.md)

### 日志安全规则

详见: [rules/logging.md](rules/logging.md)

---

## 检测优先级

### 第一优先级（严重）

1. JAVA-SQL-001, JAVA-SQL-002, JAVA-SQL-003
2. JAVA-FILE-001, JAVA-FILE-003
3. JAVA-DESER-001

### 第二优先级（高危）

1. JAVA-XSS-001, JAVA-XSS-002
2. JAVA-LEAK-001, JAVA-LEAK-004
3. JAVA-CRYPTO-001, JAVA-CRYPTO-002, JAVA-CRYPTO-004
4. JAVA-AUTH-001, JAVA-AUTH-002, JAVA-AUTH-003
5. JAVA-FILE-002, JAVA-DESER-003
6. JAVA-SSRF-001, JAVA-DEP-001, JAVA-LOG-002

### 第三优先级（中危）

1. JAVA-CONFIG-001, JAVA-CONFIG-002, JAVA-CONFIG-003
2. JAVA-LEAK-002, JAVA-LEAK-003
3. JAVA-CRYPTO-003, JAVA-XSS-003, JAVA-DESER-002
4. JAVA-DEP-002, JAVA-LOG-001

---

**版本**: 1.2.0  
**更新时间**: 2025-12-22
