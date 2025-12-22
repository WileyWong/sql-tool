# Go 错误处理审查示例

## 示例 1：错误检查缺失

### 问题代码

```go
func GetUser(id int64) *User {
    user, _ := db.QueryUser(id)  // 忽略错误
    return user
}

func ProcessFile(path string) {
    file, err := os.Open(path)
    if err != nil {
        log.Println(err)  // 只打印不返回
    }
    // 继续使用可能为 nil 的 file
    defer file.Close()
    // ...
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 忽略错误返回值 | 🔴 P0 | 使用 `_` 忽略错误会导致静默失败 |
| 错误只打印不返回 | 🔴 P0 | 调用方无法知道出错，可能导致 nil panic |

### 修复代码

```go
func GetUser(id int64) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        return nil, fmt.Errorf("failed to get user %d: %w", id, err)
    }
    return user, nil
}

func ProcessFile(path string) error {
    file, err := os.Open(path)
    if err != nil {
        return fmt.Errorf("failed to open file %s: %w", path, err)
    }
    defer file.Close()
    // ...
    return nil
}
```

---

## 示例 2：错误包装不当

### 问题代码

```go
func CreateOrder(req *OrderRequest) error {
    user, err := userService.GetByID(req.UserID)
    if err != nil {
        return err  // 丢失上下文
    }
    
    if err := validateOrder(req); err != nil {
        return errors.New("validation failed")  // 丢失原始错误
    }
    
    if err := db.Insert(order); err != nil {
        return fmt.Errorf("insert failed: %v", err)  // 使用 %v 断开错误链
    }
    
    return nil
}

// 调用方判断错误
if err.Error() == "user not found" {  // 字符串比较
    // ...
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 直接返回错误无上下文 | 🟠 P1 | 难以定位错误发生位置 |
| 创建新错误丢失原因 | 🟠 P1 | 无法追踪根本原因 |
| 使用 `%v` 断开错误链 | 🟠 P1 | `errors.Is/As` 无法工作 |
| 字符串比较错误 | 🔴 P0 | 脆弱，错误信息变化会导致逻辑失效 |

### 修复代码

```go
// 定义错误类型
var (
    ErrUserNotFound    = errors.New("user not found")
    ErrValidationFailed = errors.New("validation failed")
)

type OrderError struct {
    OrderID int64
    Op      string
    Err     error
}

func (e *OrderError) Error() string {
    return fmt.Sprintf("order %d %s: %v", e.OrderID, e.Op, e.Err)
}

func (e *OrderError) Unwrap() error {
    return e.Err
}

func CreateOrder(req *OrderRequest) error {
    user, err := userService.GetByID(req.UserID)
    if err != nil {
        return fmt.Errorf("create order: get user %d: %w", req.UserID, err)
    }
    
    if err := validateOrder(req); err != nil {
        return fmt.Errorf("create order: validate: %w", err)
    }
    
    if err := db.Insert(order); err != nil {
        return &OrderError{
            OrderID: order.ID,
            Op:      "insert",
            Err:     err,
        }
    }
    
    return nil
}

// 调用方判断错误
if errors.Is(err, ErrUserNotFound) {
    // 处理用户不存在
}

var orderErr *OrderError
if errors.As(err, &orderErr) {
    log.Printf("Order %d failed: %v", orderErr.OrderID, orderErr.Err)
}
```

---

## 示例 3：panic 滥用

### 问题代码

```go
func GetConfig(key string) string {
    value, ok := config[key]
    if !ok {
        panic("config not found: " + key)  // 不应该 panic
    }
    return value
}

func HandleRequest(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("user_id")
    id, err := strconv.ParseInt(userID, 10, 64)
    if err != nil {
        panic(err)  // HTTP handler 中 panic
    }
    // ...
}

func main() {
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Fatal(err)  // main 中可以，但最好有清理
    }
    // 没有 recover
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 业务逻辑中使用 panic | 🔴 P0 | 应返回错误让调用方处理 |
| HTTP handler 中 panic | 🔴 P0 | 会导致整个请求崩溃 |
| 缺少 recover 机制 | 🟠 P1 | 无法优雅处理意外 panic |

### 修复代码

```go
// 返回错误而非 panic
func GetConfig(key string) (string, error) {
    value, ok := config[key]
    if !ok {
        return "", fmt.Errorf("config not found: %s", key)
    }
    return value, nil
}

// 仅在初始化时使用 Must 模式
func MustGetConfig(key string) string {
    value, err := GetConfig(key)
    if err != nil {
        panic(err)  // 启动时失败是合理的
    }
    return value
}

// HTTP handler 返回错误
func HandleRequest(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("user_id")
    id, err := strconv.ParseInt(userID, 10, 64)
    if err != nil {
        http.Error(w, "Invalid user_id", http.StatusBadRequest)
        return
    }
    // ...
}

// 添加 recovery 中间件
func RecoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                log.Printf("panic recovered: %v\n%s", err, debug.Stack())
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
        }()
        next.ServeHTTP(w, r)
    })
}

func main() {
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Fatalf("failed to connect database: %v", err)
    }
    defer db.Close()
    
    // 使用 recovery 中间件
    handler := RecoveryMiddleware(router)
    http.ListenAndServe(":8080", handler)
}
```

---

## 审查要点总结

### 错误检查
- 所有返回 error 的函数调用都必须检查
- 不使用 `_` 忽略错误
- 错误必须返回给调用方或正确处理

### 错误包装
- 使用 `fmt.Errorf("context: %w", err)` 添加上下文
- 定义有意义的错误类型
- 使用 `errors.Is/As` 判断错误类型

### panic 使用
- 仅在不可恢复的情况下使用
- 初始化阶段的 Must 函数可以 panic
- HTTP 服务必须有 recovery 中间件

---

## 示例 4：defer 中的错误处理

### 问题代码

```go
func processFile(path string) error {
    file, err := os.Open(path)
    if err != nil {
        return err
    }
    defer file.Close()  // Close 的错误被忽略
    
    // 处理文件...
    return nil
}

func writeData(path string, data []byte) error {
    file, err := os.Create(path)
    if err != nil {
        return err
    }
    defer file.Close()  // 写入文件时 Close 错误更重要
    
    _, err = file.Write(data)
    return err
}

func copyFile(src, dst string) error {
    srcFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer srcFile.Close()
    
    dstFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer dstFile.Close()  // 两个 defer，错误处理复杂
    
    _, err = io.Copy(dstFile, srcFile)
    return err
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| defer Close 错误被忽略 | 🟠 P1 | 写入场景可能丢失数据 |
| 多个 defer 错误处理 | 🟠 P1 | 需要聚合多个错误 |

### 修复代码

```go
// 方案 1：命名返回值 + defer 闭包
func processFile(path string) (err error) {
    file, err := os.Open(path)
    if err != nil {
        return err
    }
    defer func() {
        if cerr := file.Close(); cerr != nil && err == nil {
            err = cerr
        }
    }()
    
    // 处理文件...
    return nil
}

// 方案 2：写入场景优先保留 Close 错误
func writeData(path string, data []byte) (err error) {
    file, err := os.Create(path)
    if err != nil {
        return err
    }
    defer func() {
        cerr := file.Close()
        if err == nil {
            err = cerr  // 只有写入成功时才返回 Close 错误
        }
    }()
    
    _, err = file.Write(data)
    if err != nil {
        return err
    }
    
    // 确保数据刷新到磁盘
    return file.Sync()
}

// 方案 3：使用 errors.Join 聚合错误 [Go 1.20+]
func copyFile(src, dst string) (err error) {
    srcFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer func() {
        err = errors.Join(err, srcFile.Close())
    }()
    
    dstFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer func() {
        // 写入文件需要先 Sync
        syncErr := dstFile.Sync()
        closeErr := dstFile.Close()
        err = errors.Join(err, syncErr, closeErr)
    }()
    
    _, err = io.Copy(dstFile, srcFile)
    return err
}

// 方案 4：辅助函数简化
func closeWithError(c io.Closer, err *error) {
    if cerr := c.Close(); cerr != nil && *err == nil {
        *err = cerr
    }
}

func processFileSimple(path string) (err error) {
    file, err := os.Open(path)
    if err != nil {
        return err
    }
    defer closeWithError(file, &err)
    
    // 处理文件...
    return nil
}

// 方案 5：Go 1.20+ errors.Join 辅助函数
func closeJoin(c io.Closer, err *error) {
    *err = errors.Join(*err, c.Close())
}

func copyFileSimple(src, dst string) (err error) {
    srcFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer closeJoin(srcFile, &err)
    
    dstFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer closeJoin(dstFile, &err)
    
    _, err = io.Copy(dstFile, srcFile)
    return err
}
```

---

## 示例 5：多错误聚合 **[Go 1.20+]**

### 问题代码

```go
func validateUser(user *User) error {
    var errs []string
    
    if user.Name == "" {
        errs = append(errs, "name is required")
    }
    if user.Email == "" {
        errs = append(errs, "email is required")
    }
    if user.Age < 0 {
        errs = append(errs, "age must be non-negative")
    }
    
    if len(errs) > 0 {
        return errors.New(strings.Join(errs, "; "))  // 丢失结构化信息
    }
    return nil
}

func processItems(items []Item) error {
    var firstErr error
    for _, item := range items {
        if err := process(item); err != nil {
            if firstErr == nil {
                firstErr = err  // 只保留第一个错误
            }
        }
    }
    return firstErr
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 字符串拼接错误 | 🟠 P1 | 无法使用 errors.Is/As |
| 只返回第一个错误 | 🟠 P1 | 丢失其他错误信息 |

### 修复代码

```go
// 方案 1：使用 errors.Join [Go 1.20+]
func validateUser(user *User) error {
    var errs []error
    
    if user.Name == "" {
        errs = append(errs, errors.New("name is required"))
    }
    if user.Email == "" {
        errs = append(errs, errors.New("email is required"))
    }
    if user.Age < 0 {
        errs = append(errs, errors.New("age must be non-negative"))
    }
    
    return errors.Join(errs...)  // nil if errs is empty
}

// 使用示例
func handleValidation() {
    user := &User{Name: "", Email: "", Age: -1}
    err := validateUser(user)
    if err != nil {
        // 可以遍历所有错误
        for _, e := range err.(interface{ Unwrap() []error }).Unwrap() {
            fmt.Println(e)
        }
    }
}

// 方案 2：自定义验证错误类型
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

type ValidationErrors []*ValidationError

func (e ValidationErrors) Error() string {
    var msgs []string
    for _, err := range e {
        msgs = append(msgs, err.Error())
    }
    return strings.Join(msgs, "; ")
}

func (e ValidationErrors) Unwrap() []error {
    errs := make([]error, len(e))
    for i, err := range e {
        errs[i] = err
    }
    return errs
}

func validateUserV2(user *User) error {
    var errs ValidationErrors
    
    if user.Name == "" {
        errs = append(errs, &ValidationError{Field: "name", Message: "is required"})
    }
    if user.Email == "" {
        errs = append(errs, &ValidationError{Field: "email", Message: "is required"})
    }
    if user.Age < 0 {
        errs = append(errs, &ValidationError{Field: "age", Message: "must be non-negative"})
    }
    
    if len(errs) > 0 {
        return errs
    }
    return nil
}

// 方案 3：聚合处理错误
func processItems(items []Item) error {
    var errs []error
    for i, item := range items {
        if err := process(item); err != nil {
            errs = append(errs, fmt.Errorf("item %d: %w", i, err))
        }
    }
    return errors.Join(errs...)
}

// 检查聚合错误中是否包含特定错误
func handleProcessError(err error) {
    if err == nil {
        return
    }
    
    // errors.Is 可以检查聚合错误中的任意一个
    if errors.Is(err, ErrNotFound) {
        fmt.Println("some items not found")
    }
    
    // 获取所有错误
    if unwrapper, ok := err.(interface{ Unwrap() []error }); ok {
        for _, e := range unwrapper.Unwrap() {
            fmt.Printf("- %v\n", e)
        }
    }
}
```

---

## 示例 6：错误哨兵值处理

### 问题代码

```go
func getUser(id int64) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        return nil, err  // 直接返回 sql.ErrNoRows
    }
    return user, nil
}

func handler(w http.ResponseWriter, r *http.Request) {
    user, err := getUser(123)
    if err != nil {
        // 无法区分"未找到"和其他错误
        http.Error(w, "Error", http.StatusInternalServerError)
        return
    }
    // ...
}

// 错误的 io.EOF 处理
func readAll(r io.Reader) ([]byte, error) {
    var buf bytes.Buffer
    for {
        b := make([]byte, 1024)
        n, err := r.Read(b)
        if err != nil {
            return nil, err  // EOF 也被当作错误返回
        }
        buf.Write(b[:n])
    }
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 未区分错误类型 | 🟠 P1 | 调用方无法正确处理 |
| EOF 处理错误 | 🔴 P0 | io.EOF 是正常结束信号 |

### 修复代码

```go
// 定义业务错误
var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidID    = errors.New("invalid user id")
)

func getUser(id int64) (*User, error) {
    if id <= 0 {
        return nil, ErrInvalidID
    }
    
    user, err := db.QueryUser(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrUserNotFound  // 转换为业务错误
        }
        return nil, fmt.Errorf("query user %d: %w", id, err)
    }
    return user, nil
}

func handler(w http.ResponseWriter, r *http.Request) {
    user, err := getUser(123)
    if err != nil {
        switch {
        case errors.Is(err, ErrUserNotFound):
            http.Error(w, "User not found", http.StatusNotFound)
        case errors.Is(err, ErrInvalidID):
            http.Error(w, "Invalid user ID", http.StatusBadRequest)
        default:
            log.Printf("get user error: %v", err)
            http.Error(w, "Internal error", http.StatusInternalServerError)
        }
        return
    }
    // ...
}

// 正确处理 io.EOF
func readAll(r io.Reader) ([]byte, error) {
    var buf bytes.Buffer
    for {
        b := make([]byte, 1024)
        n, err := r.Read(b)
        buf.Write(b[:n])  // 先写入读到的数据
        
        if err != nil {
            if errors.Is(err, io.EOF) {
                return buf.Bytes(), nil  // EOF 是正常结束
            }
            return nil, err
        }
    }
}

// 或使用标准库
func readAllSimple(r io.Reader) ([]byte, error) {
    return io.ReadAll(r)  // 内部正确处理 EOF
}

// 常见哨兵错误处理模式
func processWithSentinels(r io.Reader) error {
    scanner := bufio.NewScanner(r)
    for scanner.Scan() {
        // 处理每行
    }
    
    // scanner.Err() 不包含 io.EOF
    if err := scanner.Err(); err != nil {
        return fmt.Errorf("scan: %w", err)
    }
    return nil
}
```

---

## 错误处理审查要点总结（补充）

### defer 错误
- 写入场景必须处理 Close 错误
- 使用命名返回值 + defer 闭包
- Go 1.20+ 使用 `errors.Join` 聚合

### 多错误聚合 **[Go 1.20+]**
- 使用 `errors.Join` 替代字符串拼接
- 实现 `Unwrap() []error` 支持错误检查
- `errors.Is/As` 可检查聚合错误中的任意一个

### 哨兵错误
- 定义业务错误常量
- 使用 `errors.Is` 检查特定错误
- 正确处理 `io.EOF`、`sql.ErrNoRows` 等
