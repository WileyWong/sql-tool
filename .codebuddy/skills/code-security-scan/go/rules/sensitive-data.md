# Go 敏感信息泄露检测规则

## 规则概述

| 规则ID | GO-004 |
|--------|--------|
| 名称 | 敏感信息泄露 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-200, CWE-532 |

---

## 检测模式

### 1. 硬编码敏感信息

**危险模式**:
```go
// ❌ 危险：硬编码密码/密钥
password := "admin123"
apiKey := "sk-xxxxxxxxxxxx"
secretKey := "my-secret-key"
dbPassword := "root123"

const (
    DBPassword = "password123"
    APISecret  = "secret-key-here"
)
```

**检测正则**:
```regex
(password|passwd|pwd|secret|apikey|api_key|token|credential)\s*[:=]\s*["'][^"']+["']
const\s+.*?(Password|Secret|Key|Token)\s*=\s*["'][^"']+["']
```

---

### 2. 日志中打印敏感信息

**危险模式**:
```go
// ❌ 危险：日志打印敏感数据
log.Printf("User password: %s", password)
log.Println("API Key:", apiKey)
fmt.Printf("Token: %s\n", token)
logger.Info("credentials", "password", password)
```

**检测正则**:
```regex
log\.(Print|Printf|Println|Info|Debug|Warn|Error).*?(password|token|secret|key|credential)
fmt\.(Print|Printf|Println).*?(password|token|secret|key|credential)
logger\.\w+\(.*?(password|token|secret|key|credential)
```

**安全写法**:
```go
// ✅ 安全：脱敏处理
log.Printf("User password: %s", maskPassword(password))
log.Printf("API Key: %s", maskKey(apiKey))

func maskPassword(p string) string {
    return "****"
}

func maskKey(key string) string {
    if len(key) <= 8 {
        return "****"
    }
    return key[:4] + "****" + key[len(key)-4:]
}
```

---

### 3. HTTP 响应泄露敏感信息

**危险模式**:
```go
// ❌ 危险：响应中包含敏感信息
json.NewEncoder(w).Encode(map[string]interface{}{
    "user":     user,
    "password": user.Password,
    "token":    user.Token,
})

// ❌ 危险：错误信息泄露
http.Error(w, err.Error(), 500)
fmt.Fprintf(w, "Database error: %v", err)
```

**安全写法**:
```go
// ✅ 安全：使用 DTO 过滤敏感字段
type UserResponse struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
    // 不包含 Password, Token 等敏感字段
}

// ✅ 安全：通用错误响应
http.Error(w, "Internal Server Error", 500)
log.Printf("Database error: %v", err) // 仅记录到日志
```

---

### 4. 错误堆栈泄露

**危险模式**:
```go
// ❌ 危险：暴露堆栈信息
if err != nil {
    debug.PrintStack()
    w.Write(debug.Stack())
}
```

**检测正则**:
```regex
debug\.(PrintStack|Stack)\s*\(\)
runtime\.Stack\s*\(
```

---

## 修复建议

### 1. 使用环境变量

```go
// 修复前
dbPassword := "root123"

// 修复后
dbPassword := os.Getenv("DB_PASSWORD")
if dbPassword == "" {
    log.Fatal("DB_PASSWORD environment variable not set")
}
```

### 2. 使用配置管理

```go
// 使用 viper 等配置库
import "github.com/spf13/viper"

func loadConfig() {
    viper.SetConfigFile(".env")
    viper.AutomaticEnv()
    viper.ReadInConfig()
    
    password := viper.GetString("DB_PASSWORD")
}
```

### 3. 结构体标签控制序列化

```go
type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Password string `json:"-"` // 不序列化
    Token    string `json:"-"` // 不序列化
}
```

---

## 参考资源

- [OWASP Sensitive Data Exposure](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities)
- [Go 安全编码指南](https://go.dev/doc/security)
