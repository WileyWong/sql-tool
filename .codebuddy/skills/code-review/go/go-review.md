# Go 代码审查指南

基于 Go 语言最佳实践的专业代码审查。

> 📚 **参考**: [Effective Go](https://go.dev/doc/effective_go)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-go-{时间戳}.md`
> ⚠️ **版本说明**: 本指南涵盖 Go 1.18 - Go 1.23 特性，请根据项目目标版本选择适用内容

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 代码规范 | 20% | 命名、格式、注释、包组织 |
| 错误处理 | 20% | 错误检查、错误包装、panic 处理、defer 错误 |
| 并发安全 | 20% | goroutine、channel、锁使用、原子操作 |
| 性能优化 | 15% | 内存分配、切片预分配、池化、逃逸分析 |
| 安全性 | 15% | 输入验证、SQL 注入、命令注入、敏感信息 |
| 可维护性 | 10% | 接口设计、测试覆盖、文档 |

## 代码规范审查

### 命名规范

```go
// ✅ 包名：小写单词，简短有意义
package user
package httputil

// ❌ 包名问题
package userService  // 不要用驼峰
package util         // 太通用

// ✅ 导出标识符：大写开头
type User struct {}
func GetUser() {}

// ✅ 私有标识符：小写开头
type userCache struct {}
func validateInput() {}

// ✅ 接口命名：-er 后缀
type Reader interface { Read(p []byte) (n int, err error) }
type Closer interface { Close() error }

// ✅ 缩写词保持一致大小写
var userID int    // 不是 userId
var httpClient    // 不是 HTTPClient（除非导出）
type HTTPClient   // 导出时全大写
```

### 格式化

```bash
# 必须使用 gofmt/goimports
gofmt -w .
goimports -w .
```

### 注释规范

```go
// ✅ 导出符号必须有文档注释
// User represents a registered user in the system.
// It contains basic user information and authentication details.
type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// GetByID retrieves a user by their unique identifier.
// It returns ErrNotFound if the user does not exist.
func GetByID(id int64) (*User, error) {
    // ...
}

// ❌ 缺少注释
type User struct {}
func GetByID(id int64) (*User, error) {}
```

### 包组织

```go
// ✅ 导入分组：标准库、第三方、本地包
import (
    "context"
    "fmt"
    "time"

    "github.com/gin-gonic/gin"
    "go.uber.org/zap"

    "myproject/internal/user"
    "myproject/pkg/utils"
)

// ❌ 未分组或顺序混乱
import (
    "myproject/internal/user"
    "fmt"
    "github.com/gin-gonic/gin"
)
```

## 错误处理审查

### 错误检查

```go
// ✅ 始终检查错误
result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed to do something: %w", err)
}

// ❌ 忽略错误
result, _ := doSomething()  // 危险！

// ❌ 只打印不返回
result, err := doSomething()
if err != nil {
    log.Println(err)  // 调用方不知道出错了
}
```

### 错误包装

```go
// ✅ 使用 %w 包装错误（保留错误链）
if err != nil {
    return fmt.Errorf("failed to get user %d: %w", id, err)
}

// ✅ 自定义错误类型
var ErrNotFound = errors.New("not found")
var ErrPermissionDenied = errors.New("permission denied")

// ✅ 错误检查
if errors.Is(err, ErrNotFound) {
    // 处理未找到
}

var targetErr *ValidationError
if errors.As(err, &targetErr) {
    // 处理验证错误
}

// ❌ 字符串比较错误
if err.Error() == "not found" {  // 脆弱！
    // ...
}
```

### panic 处理

```go
// ✅ 仅在不可恢复的情况下使用 panic
func mustCompileRegex(pattern string) *regexp.Regexp {
    re, err := regexp.Compile(pattern)
    if err != nil {
        panic(fmt.Sprintf("invalid regex pattern: %s", pattern))
    }
    return re
}

// ✅ HTTP handler 中 recover
func recoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                log.Printf("panic recovered: %v", err)
                http.Error(w, "Internal Server Error", 500)
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// ❌ 用 panic 做流程控制
func getUser(id int) *User {
    user, err := db.GetUser(id)
    if err != nil {
        panic(err)  // 不要这样！
    }
    return user
}
```

## 并发安全审查

### goroutine 管理

```go
// ✅ 使用 context 控制生命周期
func worker(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            return
        default:
            // 执行工作
        }
    }
}

// ✅ 使用 WaitGroup 等待完成
func processItems(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            process(item)
        }(item)  // 注意：传递副本
    }
    wg.Wait()
}

// ❌ goroutine 泄漏
func startWorker() {
    go func() {
        for {
            // 永远不会退出！
            doWork()
        }
    }()
}

// ❌ 闭包捕获循环变量（Go 1.22 前）
for _, item := range items {
    go func() {
        process(item)  // 可能处理错误的 item
    }()
}

// ✅ Go 1.22+ 循环变量语义变化，自动安全
// 但为了向后兼容，建议仍使用参数传递
for _, item := range items {
    go func(item Item) {
        process(item)
    }(item)
}
```

### channel 使用

```go
// ✅ 明确 channel 方向
func producer(out chan<- int) {
    for i := 0; i < 10; i++ {
        out <- i
    }
    close(out)
}

func consumer(in <-chan int) {
    for v := range in {
        fmt.Println(v)
    }
}

// ✅ 使用 select 处理多 channel
select {
case msg := <-msgCh:
    handleMessage(msg)
case <-ctx.Done():
    return ctx.Err()
case <-time.After(5 * time.Second):
    return errors.New("timeout")
}

// ❌ 向已关闭的 channel 发送
close(ch)
ch <- 1  // panic!

// ❌ 未关闭 channel 导致 goroutine 泄漏
ch := make(chan int)
go func() {
    for v := range ch {  // 永远阻塞
        fmt.Println(v)
    }
}()
// 忘记 close(ch)
```

### 锁使用

```go
// ✅ 使用 defer 解锁
func (c *Cache) Get(key string) (interface{}, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.data[key]
    return val, ok
}

// ✅ 读写锁分离
type Cache struct {
    mu   sync.RWMutex
    data map[string]interface{}
}

func (c *Cache) Get(key string) interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.data[key]
}

func (c *Cache) Set(key string, val interface{}) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[key] = val
}

// ❌ 锁内执行耗时操作
func (c *Cache) Process(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    result := expensiveOperation()  // 阻塞其他操作
    c.data[key] = result
}

// ✅ 改进：最小化锁范围
func (c *Cache) Process(key string) {
    result := expensiveOperation()  // 锁外执行
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[key] = result
}
```

## 性能优化审查

### 切片预分配

```go
// ✅ 已知长度时预分配
users := make([]User, 0, len(ids))
for _, id := range ids {
    user, _ := getUser(id)
    users = append(users, user)
}

// ❌ 未预分配导致多次扩容
var users []User
for _, id := range ids {
    user, _ := getUser(id)
    users = append(users, user)  // 可能多次扩容
}
```

### 字符串拼接

```go
// ✅ 大量拼接用 strings.Builder
var builder strings.Builder
for _, s := range strs {
    builder.WriteString(s)
}
result := builder.String()

// ✅ 少量拼接用 fmt.Sprintf
msg := fmt.Sprintf("User %s logged in at %s", name, time.Now())

// ❌ 循环中用 + 拼接
var result string
for _, s := range strs {
    result += s  // 每次创建新字符串
}
```

### sync.Pool 池化

```go
// ✅ 复用频繁创建的对象
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func process(data []byte) {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf)
    }()
    buf.Write(data)
    // 使用 buf
}
```

### 避免不必要的内存分配

```go
// ✅ 使用指针接收者避免复制
func (u *User) UpdateName(name string) {
    u.Name = name
}

// ✅ 传递切片而非数组
func process(data []byte) {}  // 切片是引用

// ❌ 传递大数组会复制
func process(data [1024]byte) {}  // 复制 1KB
```

## 安全性审查

### 输入验证

```go
// ✅ 验证用户输入
func CreateUser(name, email string) error {
    if len(name) == 0 || len(name) > 100 {
        return errors.New("invalid name length")
    }
    if !isValidEmail(email) {
        return errors.New("invalid email format")
    }
    // ...
}

// ✅ 使用 validator 库
type CreateUserRequest struct {
    Name  string `json:"name" validate:"required,min=1,max=100"`
    Email string `json:"email" validate:"required,email"`
    Age   int    `json:"age" validate:"gte=0,lte=150"`
}
```

### SQL 注入防护

```go
// ✅ 使用参数化查询
rows, err := db.Query("SELECT * FROM users WHERE id = ?", userID)

// ✅ 使用 ORM
var user User
db.Where("id = ?", userID).First(&user)

// ❌ 字符串拼接 SQL
query := fmt.Sprintf("SELECT * FROM users WHERE id = %s", userID)
rows, err := db.Query(query)  // SQL 注入风险！
```

### 敏感信息保护

```go
// ✅ 不在日志中打印敏感信息
log.Printf("User %s logged in", user.ID)  // 不打印密码

// ✅ 敏感字段不序列化
type User struct {
    ID       int64  `json:"id"`
    Name     string `json:"name"`
    Password string `json:"-"`  // 不输出到 JSON
}

// ✅ 使用环境变量存储密钥
apiKey := os.Getenv("API_KEY")

// ❌ 硬编码密钥
const apiKey = "sk-1234567890"  // 危险！
```

### HTTP 安全

```go
// ✅ 设置安全响应头
func securityHeaders(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("X-Content-Type-Options", "nosniff")
        w.Header().Set("X-Frame-Options", "DENY")
        w.Header().Set("X-XSS-Protection", "1; mode=block")
        next.ServeHTTP(w, r)
    })
}

// ✅ 设置超时
server := &http.Server{
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  120 * time.Second,
}
```

## 可维护性审查

### 接口设计

```go
// ✅ 小接口原则
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ✅ 接口组合
type ReadWriter interface {
    Reader
    Writer
}

// ✅ 接受接口，返回具体类型
func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

// ❌ 过大的接口
type UserRepository interface {
    Create(user *User) error
    Update(user *User) error
    Delete(id int64) error
    GetByID(id int64) (*User, error)
    GetByEmail(email string) (*User, error)
    List(page, size int) ([]*User, error)
    Count() (int64, error)
    // 太多方法...
}
```

### 测试覆盖

```go
// ✅ 表驱动测试
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", 
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// ✅ 使用 testify
func TestUserService_GetByID(t *testing.T) {
    assert := assert.New(t)
    
    user, err := service.GetByID(1)
    
    assert.NoError(err)
    assert.NotNil(user)
    assert.Equal("John", user.Name)
}
```

### 依赖注入

```go
// ✅ 构造函数注入
type UserService struct {
    repo   UserRepository
    cache  Cache
    logger *zap.Logger
}

func NewUserService(repo UserRepository, cache Cache, logger *zap.Logger) *UserService {
    return &UserService{
        repo:   repo,
        cache:  cache,
        logger: logger,
    }
}

// ❌ 全局依赖
var db *sql.DB

func GetUser(id int64) (*User, error) {
    return db.Query(...)  // 难以测试
}
```

## 检查工具

```bash
# 格式化
gofmt -w .
goimports -w .

# 静态分析
go vet ./...
staticcheck ./...
golangci-lint run

# 测试覆盖率
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# 竞态检测
go test -race ./...

# 逃逸分析
go build -gcflags="-m" ./...

# 模糊测试 [Go 1.18+]
go test -fuzz=FuzzXxx -fuzztime=30s ./...

# 漏洞扫描
govulncheck ./...
```

## 评分细则

### 代码规范 (20%)

| 子项 | 占比 |
|------|------|
| 命名规范 | 30% |
| 格式化 | 30% |
| 注释完整 | 40% |

### 错误处理 (20%)

| 子项 | 占比 |
|------|------|
| 错误检查 | 40% |
| 错误包装 | 30% |
| panic 处理 | 30% |

### 并发安全 (20%)

| 子项 | 占比 |
|------|------|
| goroutine 管理 | 40% |
| channel 使用 | 30% |
| 锁使用 | 30% |

## 相关资源

- [检查清单](go-checklist.md)
- [错误处理示例](examples/error-handling.md) - 包含 defer 错误、errors.Join **[Go 1.20+]**
- [并发模式示例](examples/concurrency.md) - 包含 atomic、errgroup、sync.Once
- [性能优化示例](examples/performance.md) - 包含逃逸分析、泛型性能 **[Go 1.18+]**
- [安全性示例](examples/security.md) - 包含命令注入、模板注入、时间攻击

## Go 版本特性速查

| 版本 | 关键特性 | 审查要点 |
|------|----------|----------|
| **Go 1.18** | 泛型、模糊测试 | 类型约束设计、Fuzz 测试覆盖 |
| **Go 1.19** | `atomic.Int64` 等类型 | 使用类型化原子变量 |
| **Go 1.20** | `errors.Join`、`errgroup.SetLimit` | 多错误聚合、并发限制 |
| **Go 1.21** | `slices`/`maps` 包、`sync.OnceFunc` | 使用标准库替代手写 |
| **Go 1.22** | 循环变量语义变化 | 闭包捕获自动安全 |
| **Go 1.23** | `iter` 包 | 迭代器模式 |
