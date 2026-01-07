# Go 错误处理规范

> 继承自 [通用错误处理规范](../common/error-handling.md)

## 错误定义

### 哨兵错误

```go
// ✅ 包级别定义
var (
    ErrNotFound     = errors.New("not found")
    ErrInvalidInput = errors.New("invalid input")
    ErrUnauthorized = errors.New("unauthorized")
)

// 使用
if errors.Is(err, ErrNotFound) {
    // 处理未找到
}
```

### 自定义错误类型

```go
// ✅ 业务错误
type BusinessError struct {
    Code    string
    Message string
    Cause   error
}

func (e *BusinessError) Error() string {
    if e.Cause != nil {
        return fmt.Sprintf("%s: %s (%v)", e.Code, e.Message, e.Cause)
    }
    return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *BusinessError) Unwrap() error {
    return e.Cause
}

// 使用
func NewBusinessError(code, message string) *BusinessError {
    return &BusinessError{Code: code, Message: message}
}

func WrapError(err error, code, message string) *BusinessError {
    return &BusinessError{Code: code, Message: message, Cause: err}
}
```

## 错误处理模式

### 基本模式

```go
// ✅ 立即处理
result, err := doSomething()
if err != nil {
    return nil, fmt.Errorf("do something failed: %w", err)
}

// ❌ 错误：忽略错误
result, _ := doSomething()  // 不要忽略错误
```

### 错误包装

```go
// ✅ 使用 %w 包装（Go 1.13+）
if err != nil {
    return fmt.Errorf("create user failed: %w", err)
}

// ✅ 添加上下文
if err != nil {
    return fmt.Errorf("create user [id=%d]: %w", userID, err)
}
```

### 错误检查

```go
// ✅ errors.Is - 检查错误链
if errors.Is(err, ErrNotFound) {
    return nil, nil  // 返回空
}

// ✅ errors.As - 类型断言
var bizErr *BusinessError
if errors.As(err, &bizErr) {
    log.Printf("业务错误: %s", bizErr.Code)
}
```

## 分层错误处理

### Repository 层

```go
func (r *userRepo) FindByID(ctx context.Context, id int64) (*User, error) {
    var user User
    err := r.db.WithContext(ctx).First(&user, id).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, ErrNotFound
        }
        return nil, fmt.Errorf("query user [id=%d]: %w", id, err)
    }
    return &user, nil
}
```

### Service 层

```go
func (s *userService) GetUser(ctx context.Context, id int64) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, NewBusinessError("USER_NOT_FOUND", "用户不存在")
        }
        return nil, fmt.Errorf("get user: %w", err)
    }
    return user, nil
}
```

### Handler 层

```go
func (h *userHandler) GetUser(c *gin.Context) {
    id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
    
    user, err := h.service.GetUser(c.Request.Context(), id)
    if err != nil {
        var bizErr *BusinessError
        if errors.As(err, &bizErr) {
            c.JSON(http.StatusBadRequest, gin.H{
                "code":    bizErr.Code,
                "message": bizErr.Message,
            })
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{
            "code":    "SYSTEM_ERROR",
            "message": "系统繁忙",
        })
        return
    }
    
    c.JSON(http.StatusOK, user)
}
```

## panic 使用

```go
// ✅ 只在不可恢复的错误使用 panic
func MustLoadConfig(path string) *Config {
    cfg, err := LoadConfig(path)
    if err != nil {
        panic(fmt.Sprintf("load config failed: %v", err))
    }
    return cfg
}

// ✅ 使用 recover 捕获 panic
func SafeExecute(fn func()) (err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("panic: %v", r)
        }
    }()
    fn()
    return nil
}
```

## 检查清单

- [ ] 不忽略错误返回值
- [ ] 使用 `%w` 包装错误
- [ ] 使用 `errors.Is/As` 检查错误
- [ ] 错误信息包含上下文
- [ ] 只在不可恢复时使用 panic
- [ ] HTTP 层统一错误响应格式

## 参考

- [通用错误处理规范](../common/error-handling.md)
- [Go Error Handling](https://go.dev/blog/error-handling-and-go)
