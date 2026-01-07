# Go 安全规则索引

本文档定义 Go 项目的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| GO-SQL-001 | SQL 字符串拼接 | 🔴 严重 | SQL注入 |
| GO-SQL-002 | 未使用参数化查询 | 🔴 严重 | SQL注入 |
| GO-CMD-001 | 命令注入 | 🔴 严重 | 命令注入 |
| GO-CMD-002 | os/exec 不安全使用 | 🔴 严重 | 命令注入 |
| GO-PATH-001 | 路径遍历 | 🔴 严重 | 文件操作 |
| GO-PATH-002 | 不安全文件操作 | 🟠 高危 | 文件操作 |
| GO-UNSAFE-001 | unsafe 指针操作 | 🟠 高危 | 内存安全 |
| GO-UNSAFE-002 | CGO 不安全使用 | 🟠 高危 | 内存安全 |
| GO-CRYPTO-001 | 弱加密算法 | 🟠 高危 | 加密安全 |
| GO-CRYPTO-002 | 硬编码密钥 | 🟠 高危 | 加密安全 |
| GO-HTTP-001 | SSRF 风险 | 🟠 高危 | 网络安全 |
| GO-HTTP-002 | 不安全 TLS 配置 | 🟡 中危 | 网络安全 |
| GO-LEAK-001 | 敏感信息泄露 | 🟠 高危 | 敏感信息 |
| GO-RACE-001 | 数据竞争 | 🟡 中危 | 并发安全 |
| GO-DESER-001 | 不安全反序列化 | 🟠 高危 | 反序列化 |
| GO-DEP-001 | 已知漏洞依赖 | 🟠 高危 | 依赖安全 |
| GO-DEP-002 | 过时 Go 版本 | 🟠 高危 | 依赖安全 |
| GO-DEP-003 | 不安全模块源 | 🟠 高危 | 依赖安全 |
| GO-DEP-004 | 未验证依赖 | 🟡 中危 | 依赖安全 |

---

## 详细规则

### GO-SQL-001: SQL 字符串拼接

**检测模式**:
```regex
fmt\.Sprintf.*SELECT
fmt\.Sprintf.*INSERT
fmt\.Sprintf.*UPDATE
fmt\.Sprintf.*DELETE
".*SELECT.*" \+ 
```

**危险代码**:
```go
// ❌ 危险
query := fmt.Sprintf("SELECT * FROM users WHERE id = %s", userID)
rows, err := db.Query(query)
```

**安全代码**:
```go
// ✅ 安全: 参数化查询
rows, err := db.Query("SELECT * FROM users WHERE id = ?", userID)

// ✅ 安全: sqlx 命名参数
query := "SELECT * FROM users WHERE id = :id"
rows, err := db.NamedQuery(query, map[string]interface{}{"id": userID})
```

---

### GO-CMD-001: 命令注入

**检测模式**:
```regex
exec\.Command\(.*\+
exec\.Command\(.*fmt\.Sprintf
os\.StartProcess
syscall\.Exec
```

**危险代码**:
```go
// ❌ 危险
cmd := exec.Command("sh", "-c", "cat " + filename)
cmd := exec.Command("sh", "-c", fmt.Sprintf("ping %s", host))
```

**安全代码**:
```go
// ✅ 安全: 使用数组参数
cmd := exec.Command("cat", filename)

// ✅ 安全: 验证输入
if !regexp.MustCompile(`^[a-zA-Z0-9.-]+$`).MatchString(host) {
    return errors.New("invalid host")
}
cmd := exec.Command("ping", "-c", "4", host)
```

---

### GO-PATH-001: 路径遍历

**检测模式**:
```regex
filepath\.Join\(.*\+
os\.Open\(.*\+
ioutil\.ReadFile\(.*\+
```

**危险代码**:
```go
// ❌ 危险
path := filepath.Join("/uploads", filename)
content, _ := ioutil.ReadFile(path)
```

**安全代码**:
```go
// ✅ 安全: 路径验证
basePath := "/uploads"
fullPath := filepath.Join(basePath, filepath.Clean(filename))
if !strings.HasPrefix(fullPath, basePath) {
    return errors.New("path traversal detected")
}
content, _ := ioutil.ReadFile(fullPath)
```

---

### GO-UNSAFE-001: unsafe 指针操作

**检测模式**:
```regex
import\s+"unsafe"
unsafe\.Pointer
uintptr\(
```

**危险代码**:
```go
// ❌ 危险: 不安全的指针转换
import "unsafe"
ptr := unsafe.Pointer(&data)
```

**安全建议**:
- 避免使用 `unsafe` 包
- 如必须使用，进行充分的边界检查
- 使用 `-race` 标志检测数据竞争

---

### GO-CRYPTO-001: 弱加密算法

**检测模式**:
```regex
crypto/md5
crypto/sha1
crypto/des
crypto/rc4
```

**危险代码**:
```go
// ❌ 危险
import "crypto/md5"
hash := md5.Sum([]byte(password))
```

**安全代码**:
```go
// ✅ 安全: 使用 bcrypt
import "golang.org/x/crypto/bcrypt"
hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

// ✅ 安全: 使用 SHA-256
import "crypto/sha256"
hash := sha256.Sum256([]byte(data))
```

---

### GO-HTTP-001: SSRF 风险

**检测模式**:
```regex
http\.Get\(.*\+
http\.Post\(.*\+
http\.NewRequest\(.*\+
```

**危险代码**:
```go
// ❌ 危险
url := "http://" + userInput + "/api"
resp, _ := http.Get(url)
```

**安全代码**:
```go
// ✅ 安全: URL 白名单
allowedHosts := []string{"api.example.com", "cdn.example.com"}
parsedURL, _ := url.Parse(userInput)
if !contains(allowedHosts, parsedURL.Host) {
    return errors.New("host not allowed")
}
resp, _ := http.Get(userInput)
```

---

## 检测优先级

### 第一优先级（严重）
1. GO-SQL-001, GO-SQL-002
2. GO-CMD-001, GO-CMD-002
3. GO-PATH-001

### 第二优先级（高危）
1. GO-UNSAFE-001, GO-UNSAFE-002
2. GO-CRYPTO-001, GO-CRYPTO-002
3. GO-HTTP-001
4. GO-LEAK-001, GO-DESER-001
5. GO-DEP-001, GO-DEP-002, GO-DEP-003

### 第三优先级（中危）
1. GO-HTTP-002
2. GO-RACE-001
3. GO-PATH-002
4. GO-DEP-004

---

## 详细规则文件

| 规则类别 | 文件 | 说明 |
|---------|------|------|
| SQL 注入 | [rules/sql-injection.md](rules/sql-injection.md) | database/sql, GORM, sqlx 安全使用 |
| 命令注入 | [rules/command-injection.md](rules/command-injection.md) | os/exec, syscall 安全使用 |
| 路径遍历 | [rules/path-traversal.md](rules/path-traversal.md) | 文件操作安全 |
| 敏感信息 | [rules/sensitive-data.md](rules/sensitive-data.md) | 硬编码、日志泄露检测 |
| 加密安全 | [rules/crypto.md](rules/crypto.md) | 弱哈希、不安全随机数、TLS 配置 |
| 依赖安全 | [rules/dependency.md](rules/dependency.md) | go.mod 漏洞检测、版本管理 |

---

## Go 安全工具推荐

| 工具 | 用途 |
|------|------|
| `gosec` | 静态安全分析 |
| `go vet` | 代码检查 |
| `go test -race` | 数据竞争检测 |
| `staticcheck` | 静态分析 |
| `govulncheck` | 依赖漏洞检测 |
| `nancy` | 依赖安全扫描 |

---

**版本**: 1.2.0  
**更新时间**: 2025-12-22
