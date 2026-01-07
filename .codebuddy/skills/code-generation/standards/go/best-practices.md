# Go 最佳实践

## 项目结构

```
project/
├── cmd/                    # 入口
│   └── server/
│       └── main.go
├── internal/               # 内部包
│   ├── handler/           # HTTP 处理器
│   ├── service/           # 业务逻辑
│   ├── repository/        # 数据访问
│   ├── model/             # 数据模型
│   └── pkg/               # 内部公共包
├── pkg/                    # 外部可用包
├── config/                 # 配置
└── go.mod
```

## 依赖注入

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

// ✅ 使用 wire 自动生成
// +build wireinject
func InitializeApp() (*App, error) {
    wire.Build(
        NewUserRepository,
        NewUserService,
        NewUserHandler,
        NewApp,
    )
    return nil, nil
}
```

## Context 使用

```go
// ✅ 作为第一个参数传递
func (s *UserService) GetUser(ctx context.Context, id int64) (*User, error) {
    return s.repo.FindByID(ctx, id)
}

// ✅ 超时控制
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()

result, err := client.Call(ctx, req)

// ✅ 传递请求相关值
ctx = context.WithValue(ctx, "userId", userId)
```

## 并发模式

### Goroutine 安全启动

```go
// ✅ 使用 errgroup
g, ctx := errgroup.WithContext(ctx)

g.Go(func() error {
    return fetchUserInfo(ctx)
})

g.Go(func() error {
    return fetchOrderInfo(ctx)
})

if err := g.Wait(); err != nil {
    return err
}
```

### Channel 使用

```go
// ✅ 生产者关闭 channel
func producer(ch chan<- int) {
    defer close(ch)
    for i := 0; i < 10; i++ {
        ch <- i
    }
}

// ✅ 使用 select 超时
select {
case result := <-ch:
    return result, nil
case <-time.After(5 * time.Second):
    return nil, ErrTimeout
case <-ctx.Done():
    return nil, ctx.Err()
}
```

## defer 使用

```go
// ✅ 资源清理
func ReadFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()
    
    return io.ReadAll(f)
}

// ✅ 解锁
func (c *Cache) Get(key string) interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.data[key]
}

// ⚠️ 注意：defer 在循环中
for _, file := range files {
    f, _ := os.Open(file)
    defer f.Close()  // 所有文件在函数结束才关闭！
}

// ✅ 正确：使用闭包
for _, file := range files {
    func() {
        f, _ := os.Open(file)
        defer f.Close()
        // 处理文件
    }()
}
```

## 接口设计

```go
// ✅ 小接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

// ✅ 接口由使用方定义
// 在 service 包中定义需要的接口
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    Save(ctx context.Context, user *User) error
}

// ❌ 避免：大而全的接口
type UserRepository interface {
    FindByID(...)
    FindByEmail(...)
    FindByPhone(...)
    FindAll(...)
    Save(...)
    Update(...)
    Delete(...)
    // ... 太多方法
}
```

## 检查清单

- [ ] 使用标准项目结构
- [ ] 构造函数注入依赖
- [ ] Context 作为第一个参数
- [ ] 使用 errgroup 管理 goroutine
- [ ] defer 用于资源清理
- [ ] 接口小而精

## 参考

- [Effective Go](https://golang.org/doc/effective_go)
- [Go 标准项目布局](https://github.com/golang-standards/project-layout)
