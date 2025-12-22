# Go 安全性审查示例

## 示例 1：SQL 注入

### 问题代码

```go
func GetUserByName(name string) (*User, error) {
    query := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", name)
    return db.QueryRow(query).Scan(&user)
}

func SearchUsers(keyword string) ([]User, error) {
    query := "SELECT * FROM users WHERE name LIKE '%" + keyword + "%'"
    return db.Query(query)
}

func DeleteUser(id string) error {
    query := fmt.Sprintf("DELETE FROM users WHERE id = %s", id)
    _, err := db.Exec(query)
    return err
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| SQL 字符串拼接 | 🔴 P0 | 严重 SQL 注入风险 |
| 未验证输入类型 | 🔴 P0 | id 应为数字但接受字符串 |

### 修复代码

```go
func GetUserByName(name string) (*User, error) {
    query := "SELECT id, name, email FROM users WHERE name = ?"
    var user User
    err := db.QueryRow(query, name).Scan(&user.ID, &user.Name, &user.Email)
    return &user, err
}

func SearchUsers(keyword string) ([]User, error) {
    query := "SELECT id, name, email FROM users WHERE name LIKE ?"
    return db.Query(query, "%"+keyword+"%")
}

func DeleteUser(id int64) error {  // 使用正确的类型
    query := "DELETE FROM users WHERE id = ?"
    _, err := db.Exec(query, id)
    return err
}

// 使用 ORM (GORM)
func GetUserByNameORM(name string) (*User, error) {
    var user User
    err := db.Where("name = ?", name).First(&user).Error
    return &user, err
}
```

---

## 示例 2：敏感信息泄露

### 问题代码

```go
type User struct {
    ID       int64  `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`  // 密码会被序列化
    SSN      string `json:"ssn"`       // 敏感信息
}

func Login(username, password string) (*User, error) {
    user, err := db.GetUser(username)
    if err != nil {
        log.Printf("Login failed for %s with password %s: %v", 
            username, password, err)  // 打印密码
        return nil, err
    }
    return user, nil
}

const (
    APIKey    = "sk-1234567890abcdef"  // 硬编码密钥
    DBPassword = "admin123"
)

func GetConfig() map[string]string {
    return map[string]string{
        "api_key": APIKey,
        "db_pass": DBPassword,
    }
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 敏感字段被序列化 | 🔴 P0 | 密码等敏感信息会返回给客户端 |
| 日志打印密码 | 🔴 P0 | 密码明文出现在日志中 |
| 硬编码密钥 | 🔴 P0 | 代码泄露导致密钥泄露 |

### 修复代码

```go
type User struct {
    ID       int64  `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"-"`  // 不序列化
    SSN      string `json:"-"`  // 不序列化
}

// 返回给客户端的 DTO
type UserResponse struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func (u *User) ToResponse() *UserResponse {
    return &UserResponse{
        ID:    u.ID,
        Name:  u.Name,
        Email: u.Email,
    }
}

func Login(username, password string) (*User, error) {
    user, err := db.GetUser(username)
    if err != nil {
        log.Printf("Login failed for user: %s, error: %v", username, err)
        return nil, err
    }
    return user, nil
}

// 从环境变量读取
func GetConfig() map[string]string {
    return map[string]string{
        "api_key": os.Getenv("API_KEY"),
        "db_pass": os.Getenv("DB_PASSWORD"),
    }
}

// 或使用配置管理
type Config struct {
    APIKey     string `env:"API_KEY" required:"true"`
    DBPassword string `env:"DB_PASSWORD" required:"true"`
}
```

---

## 示例 3：输入验证缺失

### 问题代码

```go
func CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    json.NewDecoder(r.Body).Decode(&req)
    
    // 直接使用未验证的输入
    user := &User{
        Name:  req.Name,
        Email: req.Email,
        Age:   req.Age,
    }
    db.Create(user)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    idInt, _ := strconv.Atoi(id)  // 忽略错误
    user, _ := db.GetUser(idInt)
    json.NewEncoder(w).Encode(user)
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
    file, header, _ := r.FormFile("file")
    defer file.Close()
    
    // 未验证文件类型和大小
    dst, _ := os.Create("/uploads/" + header.Filename)  // 路径遍历风险
    io.Copy(dst, file)
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 未验证请求体 | 🔴 P0 | 可能导致无效数据或攻击 |
| 忽略解析错误 | 🔴 P0 | 错误输入导致异常行为 |
| 路径遍历风险 | 🔴 P0 | 攻击者可覆盖任意文件 |
| 未限制文件大小 | 🟠 P1 | 可能导致 DoS |

### 修复代码

```go
type CreateUserRequest struct {
    Name  string `json:"name" validate:"required,min=1,max=100"`
    Email string `json:"email" validate:"required,email"`
    Age   int    `json:"age" validate:"gte=0,lte=150"`
}

var validate = validator.New()

func CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    if err := validate.Struct(req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    user := &User{
        Name:  req.Name,
        Email: req.Email,
        Age:   req.Age,
    }
    if err := db.Create(user); err != nil {
        http.Error(w, "Failed to create user", http.StatusInternalServerError)
        return
    }
    
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user.ToResponse())
}

func GetUser(w http.ResponseWriter, r *http.Request) {
    idStr := r.URL.Query().Get("id")
    id, err := strconv.ParseInt(idStr, 10, 64)
    if err != nil || id <= 0 {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    user, err := db.GetUser(id)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(user.ToResponse())
}

const (
    maxUploadSize = 10 << 20  // 10 MB
    uploadDir     = "/var/uploads"
)

var allowedTypes = map[string]bool{
    "image/jpeg": true,
    "image/png":  true,
    "image/gif":  true,
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
    // 限制请求体大小
    r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
    
    file, header, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Failed to read file", http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    // 验证文件类型
    buffer := make([]byte, 512)
    file.Read(buffer)
    contentType := http.DetectContentType(buffer)
    if !allowedTypes[contentType] {
        http.Error(w, "Invalid file type", http.StatusBadRequest)
        return
    }
    file.Seek(0, 0)
    
    // 生成安全的文件名
    ext := filepath.Ext(header.Filename)
    safeFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
    dstPath := filepath.Join(uploadDir, safeFilename)
    
    dst, err := os.Create(dstPath)
    if err != nil {
        http.Error(w, "Failed to save file", http.StatusInternalServerError)
        return
    }
    defer dst.Close()
    
    io.Copy(dst, file)
    w.WriteHeader(http.StatusOK)
}
```

---

## 示例 4：HTTP 安全配置

### 问题代码

```go
func main() {
    http.HandleFunc("/api/users", handleUsers)
    http.ListenAndServe(":8080", nil)  // 无超时配置
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
    // 无安全响应头
    // 无 CORS 配置
    data, _ := json.Marshal(users)
    w.Write(data)
}

func proxyRequest(targetURL string) (*http.Response, error) {
    return http.Get(targetURL)  // SSRF 风险
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无超时配置 | 🟠 P1 | 可能导致资源耗尽 |
| 缺少安全响应头 | 🟠 P1 | XSS、点击劫持等风险 |
| SSRF 风险 | 🔴 P0 | 可访问内部服务 |

### 修复代码

```go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/users", handleUsers)
    
    // 添加中间件
    handler := securityHeaders(mux)
    handler = recoveryMiddleware(handler)
    
    server := &http.Server{
        Addr:         ":8080",
        Handler:      handler,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }
    
    log.Fatal(server.ListenAndServe())
}

func securityHeaders(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("X-Content-Type-Options", "nosniff")
        w.Header().Set("X-Frame-Options", "DENY")
        w.Header().Set("X-XSS-Protection", "1; mode=block")
        w.Header().Set("Content-Security-Policy", "default-src 'self'")
        w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        next.ServeHTTP(w, r)
    })
}

func recoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                log.Printf("panic: %v", err)
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// SSRF 防护
var allowedHosts = map[string]bool{
    "api.example.com": true,
    "cdn.example.com": true,
}

func proxyRequest(targetURL string) (*http.Response, error) {
    u, err := url.Parse(targetURL)
    if err != nil {
        return nil, err
    }
    
    // 验证目标主机
    if !allowedHosts[u.Host] {
        return nil, errors.New("host not allowed")
    }
    
    // 禁止访问内部地址
    ip := net.ParseIP(u.Hostname())
    if ip != nil && (ip.IsLoopback() || ip.IsPrivate()) {
        return nil, errors.New("internal addresses not allowed")
    }
    
    client := &http.Client{
        Timeout: 10 * time.Second,
    }
    return client.Get(targetURL)
}
```

---

## 审查要点总结

### SQL 注入
- 始终使用参数化查询
- 使用 ORM 的安全方法
- 验证输入类型

### 敏感信息
- 使用 `json:"-"` 排除敏感字段
- 不在日志中打印密码/密钥
- 使用环境变量存储密钥

### 输入验证
- 验证所有用户输入
- 限制请求体大小
- 验证文件类型
- 防止路径遍历

### HTTP 安全
- 设置超时
- 添加安全响应头
- 防止 SSRF
- 添加 recovery 中间件

---

## 示例 5：命令注入防护

### 问题代码

```go
func runCommand(userInput string) error {
    // 危险：直接拼接用户输入到 shell 命令
    cmd := exec.Command("sh", "-c", "grep "+userInput+" /var/log/app.log")
    return cmd.Run()
}

func executeScript(scriptName string) error {
    // 危险：未验证脚本名称
    cmd := exec.Command("bash", scriptName)
    return cmd.Run()
}

func processFile(filename string) error {
    // 危险：路径遍历 + 命令注入
    cmd := exec.Command("cat", "/data/"+filename)
    output, _ := cmd.Output()
    fmt.Println(string(output))
    return nil
}
```

### 审查意见

| 问题 | 优先级 | CWE | 说明 |
|------|--------|-----|------|
| Shell 命令拼接 | 🔴 P0 | CWE-78 | 用户可注入任意命令 |
| 未验证脚本路径 | 🔴 P0 | CWE-78 | 可执行任意脚本 |
| 路径遍历 | 🔴 P0 | CWE-22 | 可读取任意文件 |

### 修复代码

```go
import (
    "os/exec"
    "path/filepath"
    "regexp"
)

// 安全的输入验证正则
var safeInputPattern = regexp.MustCompile(`^[a-zA-Z0-9_\-\.]+$`)

func runCommand(userInput string) error {
    // 验证输入格式
    if !safeInputPattern.MatchString(userInput) {
        return errors.New("invalid input: contains unsafe characters")
    }
    
    // 使用参数分离，避免 shell 解释
    cmd := exec.Command("grep", userInput, "/var/log/app.log")
    return cmd.Run()
}

// 允许执行的脚本白名单
var allowedScripts = map[string]bool{
    "backup.sh":  true,
    "cleanup.sh": true,
    "report.sh":  true,
}

func executeScript(scriptName string) error {
    // 白名单验证
    if !allowedScripts[scriptName] {
        return errors.New("script not allowed")
    }
    
    // 使用绝对路径
    scriptPath := filepath.Join("/opt/scripts", scriptName)
    cmd := exec.Command("bash", scriptPath)
    return cmd.Run()
}

func processFile(filename string) error {
    // 验证文件名格式
    if !safeInputPattern.MatchString(filename) {
        return errors.New("invalid filename")
    }
    
    // 构建安全路径并验证
    basePath := "/data"
    fullPath := filepath.Join(basePath, filename)
    
    // 防止路径遍历：确保最终路径在 basePath 下
    cleanPath := filepath.Clean(fullPath)
    if !strings.HasPrefix(cleanPath, basePath) {
        return errors.New("path traversal detected")
    }
    
    // 使用 Go 原生文件操作而非 shell
    data, err := os.ReadFile(cleanPath)
    if err != nil {
        return err
    }
    fmt.Println(string(data))
    return nil
}
```

---

## 示例 6：模板注入防护

### 问题代码

```go
import "text/template"

func renderUserContent(w http.ResponseWriter, userContent string) {
    // 危险：使用 text/template 渲染用户内容
    tmpl, _ := template.New("page").Parse(`
        <html>
        <body>
            <h1>Welcome</h1>
            <div>` + userContent + `</div>
        </body>
        </html>
    `)
    tmpl.Execute(w, nil)
}

func renderWithTemplate(w http.ResponseWriter, templateStr string, data interface{}) {
    // 危险：用户可控制模板内容
    tmpl, _ := template.New("dynamic").Parse(templateStr)
    tmpl.Execute(w, data)
}
```

### 审查意见

| 问题 | 优先级 | CWE | 说明 |
|------|--------|-----|------|
| 使用 text/template 输出 HTML | 🔴 P0 | CWE-79 | XSS 漏洞 |
| 用户控制模板内容 | 🔴 P0 | CWE-94 | 服务端模板注入 |

### 修复代码

```go
import "html/template"  // 使用 html/template 而非 text/template

// 预定义安全模板
var pageTemplate = template.Must(template.New("page").Parse(`
    <html>
    <body>
        <h1>Welcome</h1>
        <div>{{.Content}}</div>
    </body>
    </html>
`))

func renderUserContent(w http.ResponseWriter, userContent string) {
    // html/template 自动转义 HTML 特殊字符
    data := struct {
        Content string
    }{
        Content: userContent,
    }
    pageTemplate.Execute(w, data)
}

// 不允许用户控制模板，只允许控制数据
func renderWithData(w http.ResponseWriter, data interface{}) {
    pageTemplate.Execute(w, data)
}

// 如果必须支持动态模板，使用严格的白名单
var allowedTemplates = map[string]*template.Template{
    "welcome": template.Must(template.New("welcome").Parse(`<h1>Welcome {{.Name}}</h1>`)),
    "profile": template.Must(template.New("profile").Parse(`<div>{{.Bio}}</div>`)),
}

func renderDynamic(w http.ResponseWriter, templateName string, data interface{}) error {
    tmpl, ok := allowedTemplates[templateName]
    if !ok {
        return errors.New("template not found")
    }
    return tmpl.Execute(w, data)
}
```

---

## 示例 7：时间攻击防护

### 问题代码

```go
func verifyToken(providedToken, storedToken string) bool {
    // 危险：字符串比较会短路，可被时间攻击利用
    return providedToken == storedToken
}

func verifyPassword(providedHash, storedHash []byte) bool {
    // 危险：bytes.Equal 也会短路
    return bytes.Equal(providedHash, storedHash)
}

func verifyAPIKey(provided, expected string) bool {
    if len(provided) != len(expected) {
        return false  // 长度泄露
    }
    for i := 0; i < len(provided); i++ {
        if provided[i] != expected[i] {
            return false  // 位置泄露
        }
    }
    return true
}
```

### 审查意见

| 问题 | 优先级 | CWE | 说明 |
|------|--------|-----|------|
| 字符串直接比较 | 🟠 P1 | CWE-208 | 时间侧信道攻击 |
| 长度检查泄露信息 | 🟠 P1 | CWE-208 | 可推断 token 长度 |
| 逐字符比较短路 | 🟠 P1 | CWE-208 | 可逐位爆破 |

### 修复代码

```go
import "crypto/subtle"

func verifyToken(providedToken, storedToken string) bool {
    // 使用常量时间比较
    return subtle.ConstantTimeCompare([]byte(providedToken), []byte(storedToken)) == 1
}

func verifyPassword(providedHash, storedHash []byte) bool {
    // 使用常量时间比较
    return subtle.ConstantTimeCompare(providedHash, storedHash) == 1
}

func verifyAPIKey(provided, expected string) bool {
    // subtle.ConstantTimeCompare 会处理长度不等的情况
    // 但仍建议先做长度常量时间比较
    if subtle.ConstantTimeEq(int32(len(provided)), int32(len(expected))) != 1 {
        // 即使长度不等，也执行完整比较以保持时间恒定
        subtle.ConstantTimeCompare([]byte(provided), []byte(expected))
        return false
    }
    return subtle.ConstantTimeCompare([]byte(provided), []byte(expected)) == 1
}

// HMAC 比较也应使用常量时间
func verifyHMAC(message, providedMAC, key []byte) bool {
    mac := hmac.New(sha256.New, key)
    mac.Write(message)
    expectedMAC := mac.Sum(nil)
    return hmac.Equal(providedMAC, expectedMAC)  // hmac.Equal 内部使用常量时间比较
}
```

---

## 示例 8：整数溢出防护

### 问题代码

```go
func allocateBuffer(size int) []byte {
    // 危险：size 可能为负数或溢出
    return make([]byte, size)
}

func calculateTotal(price int32, quantity int32) int32 {
    // 危险：乘法可能溢出
    return price * quantity
}

func convertToInt(val int64) int {
    // 危险：64 位转 32 位可能截断
    return int(val)
}

func parseAndAllocate(sizeStr string) ([]byte, error) {
    size, _ := strconv.Atoi(sizeStr)
    // 危险：未验证 size 范围
    return make([]byte, size), nil
}
```

### 审查意见

| 问题 | 优先级 | CWE | 说明 |
|------|--------|-----|------|
| 未验证整数范围 | 🔴 P0 | CWE-190 | 整数溢出导致意外行为 |
| 类型转换截断 | 🟠 P1 | CWE-681 | 数据丢失或符号变化 |
| 乘法溢出 | 🟠 P1 | CWE-190 | 计算结果错误 |

### 修复代码

```go
import "math"

const (
    maxBufferSize = 100 * 1024 * 1024  // 100 MB
    maxQuantity   = 10000
    maxPrice      = 1000000  // 100 万分（1 万元）
)

func allocateBuffer(size int) ([]byte, error) {
    if size <= 0 || size > maxBufferSize {
        return nil, fmt.Errorf("invalid buffer size: %d (must be 1-%d)", size, maxBufferSize)
    }
    return make([]byte, size), nil
}

func calculateTotal(price int32, quantity int32) (int64, error) {
    // 验证输入范围
    if price < 0 || price > maxPrice {
        return 0, errors.New("invalid price")
    }
    if quantity < 0 || quantity > maxQuantity {
        return 0, errors.New("invalid quantity")
    }
    
    // 使用更大的类型避免溢出
    return int64(price) * int64(quantity), nil
}

func convertToInt(val int64) (int, error) {
    // 检查是否在 int 范围内（考虑 32 位系统）
    if val > math.MaxInt || val < math.MinInt {
        return 0, fmt.Errorf("value %d out of int range", val)
    }
    return int(val), nil
}

func parseAndAllocate(sizeStr string) ([]byte, error) {
    size, err := strconv.Atoi(sizeStr)
    if err != nil {
        return nil, fmt.Errorf("invalid size: %w", err)
    }
    return allocateBuffer(size)
}

// Go 1.22+ 可使用 math/overflow 检查（如果可用）
// 或使用第三方库如 github.com/JohnCGriff/overflow
func safeMultiply(a, b int64) (int64, error) {
    if a == 0 || b == 0 {
        return 0, nil
    }
    result := a * b
    if result/a != b {
        return 0, errors.New("integer overflow")
    }
    return result, nil
}
```

---

## 示例 9：安全随机数

### 问题代码

```go
import "math/rand"

func generateToken() string {
    // 危险：math/rand 不是密码学安全的
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    token := make([]byte, 32)
    for i := range token {
        token[i] = chars[rand.Intn(len(chars))]
    }
    return string(token)
}

func generateSessionID() string {
    // 危险：使用时间戳作为种子可预测
    rand.Seed(time.Now().UnixNano())
    return fmt.Sprintf("%d", rand.Int63())
}
```

### 审查意见

| 问题 | 优先级 | CWE | 说明 |
|------|--------|-----|------|
| 使用 math/rand | 🔴 P0 | CWE-338 | 可预测的伪随机数 |
| 时间戳种子 | 🔴 P0 | CWE-330 | 种子可被猜测 |

### 修复代码

```go
import (
    "crypto/rand"
    "encoding/base64"
    "encoding/hex"
)

func generateToken() (string, error) {
    // 使用 crypto/rand 生成密码学安全的随机数
    bytes := make([]byte, 32)
    if _, err := rand.Read(bytes); err != nil {
        return "", fmt.Errorf("failed to generate random bytes: %w", err)
    }
    return base64.URLEncoding.EncodeToString(bytes), nil
}

func generateSessionID() (string, error) {
    bytes := make([]byte, 16)
    if _, err := rand.Read(bytes); err != nil {
        return "", err
    }
    return hex.EncodeToString(bytes), nil
}

// 生成指定范围内的安全随机数
func secureRandomInt(max int) (int, error) {
    if max <= 0 {
        return 0, errors.New("max must be positive")
    }
    
    // 使用 crypto/rand 生成
    var n uint64
    if err := binary.Read(rand.Reader, binary.BigEndian, &n); err != nil {
        return 0, err
    }
    return int(n % uint64(max)), nil
}
```

---

## 安全检查工具

```bash
# 静态安全扫描
gosec ./...

# 依赖漏洞检查 [推荐]
govulncheck ./...

# golangci-lint 安全规则
golangci-lint run --enable gosec,gocritic

# 密钥泄露检测
gitleaks detect --source .
trufflehog filesystem .
```

---

## 安全审查要点总结

### 命令注入 (CWE-78)
- 使用 `exec.Command` 参数分离
- 不使用 `sh -c` 拼接用户输入
- 白名单验证允许的命令/脚本

### 模板注入 (CWE-94)
- HTML 输出使用 `html/template`
- 不允许用户控制模板内容
- 预编译模板，只传递数据

### 时间攻击 (CWE-208)
- 密码/token 比较使用 `subtle.ConstantTimeCompare`
- HMAC 比较使用 `hmac.Equal`

### 整数溢出 (CWE-190)
- 验证输入范围
- 使用更大类型进行计算
- 检查类型转换边界

### 随机数 (CWE-338)
- 安全场景使用 `crypto/rand`
- `math/rand` 仅用于非安全场景
