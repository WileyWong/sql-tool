# GString 注入检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| GRV-003 | GString 注入 | 🟠 高危 |

---

## GRV-003: GString 注入

### 检测模式

```regex
"\$\{.*params.*\}"
"\$\{.*request.*\}"
"\$\{.*input.*\}"
"\$\{.*user.*\}"
```

### 危险代码示例

```groovy
// ❌ 危险: SQL 查询中的 GString
def username = params.username
def sql = "SELECT * FROM users WHERE name = '${username}'"
// username 可能是: admin' OR '1'='1

// ❌ 危险: 日志中的 GString
def userInput = params.input
log.info("User input: ${userInput}")
// 可能导致日志注入

// ❌ 危险: 文件路径中的 GString
def filename = params.filename
def content = new File("/data/${filename}").text
// filename 可能是: ../../../etc/passwd

// ❌ 危险: URL 中的 GString
def endpoint = params.endpoint
def response = "http://api.example.com/${endpoint}".toURL().text
// 可能导致 SSRF

// ❌ 危险: 模板中的 GString
def template = params.template
def result = "${template}"  // template 可能包含 ${System.exit(0)}
```

### GString 表达式执行

```groovy
// GString 中的表达式会被执行
def malicious = '${Runtime.getRuntime().exec("id")}'
def gstring = "$malicious"  // 这里 malicious 只是字符串

// 但如果使用 Eval 或模板引擎
def dangerous = params.expr  // 用户输入: ${Runtime.getRuntime().exec("id")}
Eval.me("\"${dangerous}\"")  // 危险！表达式会被执行
```

### 安全代码示例

```groovy
// ✅ 安全: SQL 使用参数化查询
def username = params.username
def sql = "SELECT * FROM users WHERE name = ?"
def users = db.rows(sql, [username])

// ✅ 安全: 使用 Sql 类的参数化方法
import groovy.sql.Sql
def sql = Sql.newInstance(dataSource)
sql.eachRow("SELECT * FROM users WHERE name = :name", [name: username]) { row ->
    println row
}

// ✅ 安全: 日志使用占位符
def userInput = params.input
log.info("User input: {}", userInput)  // SLF4J 风格

// ✅ 安全: 文件路径验证
def filename = params.filename
// 白名单验证
if (!filename.matches(/^[a-zA-Z0-9._-]+$/)) {
    throw new SecurityException("非法文件名")
}
// 路径规范化
def basePath = new File("/data").canonicalPath
def filePath = new File("/data/${filename}").canonicalPath
if (!filePath.startsWith(basePath)) {
    throw new SecurityException("路径遍历攻击")
}

// ✅ 安全: URL 白名单
def allowedEndpoints = ["users", "products", "orders"]
def endpoint = params.endpoint
if (!(endpoint in allowedEndpoints)) {
    throw new SecurityException("不允许的端点")
}
def response = "http://api.example.com/${endpoint}".toURL().text

// ✅ 安全: 使用单引号字符串 (不插值)
def literal = '${this.is.not.interpolated}'
println literal  // 输出: ${this.is.not.interpolated}
```

### GString vs String

| 类型 | 语法 | 插值 | 安全性 |
|------|------|------|--------|
| GString | `"${expr}"` | ✅ 是 | ⚠️ 需注意 |
| String | `'text'` | ❌ 否 | ✅ 安全 |
| 多行 GString | `"""${expr}"""` | ✅ 是 | ⚠️ 需注意 |
| 多行 String | `'''text'''` | ❌ 否 | ✅ 安全 |

### 安全使用 GString 的规则

```yaml
gstring_security_rules:
  禁止:
    - 用户输入直接用于 SQL GString
    - 用户输入直接用于命令 GString
    - 用户输入直接用于文件路径 GString
    - 用户输入直接用于 URL GString
  
  允许:
    - 内部变量的 GString 插值
    - 已验证/转义的数据插值
    - 配置常量的 GString 插值
  
  最佳实践:
    - SQL 使用参数化查询
    - 命令使用数组参数
    - 路径使用白名单验证
    - URL 使用 URIBuilder
```

---

## 参考资料

- [Groovy GString](https://groovy-lang.org/syntax.html#_string_interpolation)
- [CWE-94: Code Injection](https://cwe.mitre.org/data/definitions/94.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
