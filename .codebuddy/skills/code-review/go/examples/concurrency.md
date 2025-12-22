# Go 并发模式审查示例

## 示例 1：goroutine 泄漏

### 问题代码

```go
func fetchData(urls []string) []string {
    results := make(chan string)
    
    for _, url := range urls {
        go func(url string) {
            resp, err := http.Get(url)
            if err != nil {
                return  // goroutine 退出但 channel 未关闭
            }
            defer resp.Body.Close()
            body, _ := io.ReadAll(resp.Body)
            results <- string(body)  // 可能永远阻塞
        }(url)
    }
    
    var data []string
    for i := 0; i < len(urls); i++ {
        data = append(data, <-results)  // 如果有错误会永远阻塞
    }
    return data
}

func startWorker() {
    go func() {
        for {
            doWork()  // 永远不会退出
        }
    }()
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| goroutine 无退出机制 | 🔴 P0 | 导致 goroutine 泄漏 |
| channel 操作可能永久阻塞 | 🔴 P0 | 部分失败时主 goroutine 阻塞 |
| 无超时控制 | 🟠 P1 | 网络请求可能无限等待 |

### 修复代码

```go
func fetchData(ctx context.Context, urls []string) ([]string, error) {
    results := make(chan string, len(urls))
    errors := make(chan error, len(urls))
    
    var wg sync.WaitGroup
    for _, url := range urls {
        wg.Add(1)
        go func(url string) {
            defer wg.Done()
            
            req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
            if err != nil {
                errors <- err
                return
            }
            
            resp, err := http.DefaultClient.Do(req)
            if err != nil {
                errors <- err
                return
            }
            defer resp.Body.Close()
            
            body, err := io.ReadAll(resp.Body)
            if err != nil {
                errors <- err
                return
            }
            results <- string(body)
        }(url)
    }
    
    // 等待所有 goroutine 完成后关闭 channel
    go func() {
        wg.Wait()
        close(results)
        close(errors)
    }()
    
    var data []string
    for result := range results {
        data = append(data, result)
    }
    
    // 收集错误
    var errs []error
    for err := range errors {
        errs = append(errs, err)
    }
    
    if len(errs) > 0 {
        return data, fmt.Errorf("fetch errors: %v", errs)
    }
    return data, nil
}

func startWorker(ctx context.Context) {
    go func() {
        for {
            select {
            case <-ctx.Done():
                return  // 优雅退出
            default:
                doWork()
            }
        }
    }()
}
```

---

## 示例 2：循环变量捕获问题

### 问题代码

```go
// Go 1.22 之前的问题
func processItems(items []Item) {
    for _, item := range items {
        go func() {
            process(item)  // 所有 goroutine 可能处理同一个 item
        }()
    }
}

func createHandlers(names []string) []func() {
    var handlers []func()
    for _, name := range names {
        handlers = append(handlers, func() {
            fmt.Println(name)  // 所有 handler 打印最后一个 name
        })
    }
    return handlers
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 闭包捕获循环变量 | 🔴 P0 | Go 1.22 前会导致数据竞争或错误结果 |
| 未等待 goroutine 完成 | 🟠 P1 | 可能在处理完成前函数返回 |

### 修复代码

```go
// 方法 1：传递参数
func processItems(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {  // 传递副本
            defer wg.Done()
            process(item)
        }(item)
    }
    wg.Wait()
}

// 方法 2：创建局部变量
func processItems(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        item := item  // 创建局部副本
        wg.Add(1)
        go func() {
            defer wg.Done()
            process(item)
        }()
    }
    wg.Wait()
}

// 方法 3：Go 1.22+ 自动修复
// 从 Go 1.22 开始，循环变量每次迭代都是新变量
func processItems(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func() {
            defer wg.Done()
            process(item)  // Go 1.22+ 安全
        }()
    }
    wg.Wait()
}

func createHandlers(names []string) []func() {
    var handlers []func()
    for _, name := range names {
        name := name  // 创建局部副本
        handlers = append(handlers, func() {
            fmt.Println(name)
        })
    }
    return handlers
}
```

---

## 示例 3：锁使用问题

### 问题代码

```go
type Cache struct {
    mu   sync.Mutex
    data map[string]interface{}
}

func (c *Cache) Get(key string) interface{} {
    c.mu.Lock()
    // 忘记解锁！
    return c.data[key]
}

func (c *Cache) Process(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    // 锁内执行耗时操作
    result := expensiveHTTPCall()
    c.data[key] = result
}

func (c *Cache) Update(key string, value interface{}) {
    c.mu.Lock()
    c.data[key] = value
    c.mu.Unlock()
    
    // 解锁后又访问
    log.Printf("Updated %s: %v", key, c.data[key])  // 数据竞争
}

// 读操作也用互斥锁
func (c *Cache) GetAll() map[string]interface{} {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.data  // 返回内部引用
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 忘记解锁 | 🔴 P0 | 导致死锁 |
| 锁内执行耗时操作 | 🟠 P1 | 严重影响并发性能 |
| 解锁后访问共享数据 | 🔴 P0 | 数据竞争 |
| 读操作使用互斥锁 | 🟡 P2 | 应使用读写锁 |
| 返回内部引用 | 🔴 P0 | 外部可修改内部数据 |

### 修复代码

```go
type Cache struct {
    mu   sync.RWMutex  // 使用读写锁
    data map[string]interface{}
}

func (c *Cache) Get(key string) interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()  // 使用 defer 确保解锁
    return c.data[key]
}

func (c *Cache) Process(key string) {
    // 锁外执行耗时操作
    result := expensiveHTTPCall()
    
    // 最小化锁范围
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[key] = result
}

func (c *Cache) Update(key string, value interface{}) {
    c.mu.Lock()
    c.data[key] = value
    // 在锁内完成所有操作
    log.Printf("Updated %s: %v", key, value)
    c.mu.Unlock()
}

// 返回副本而非引用
func (c *Cache) GetAll() map[string]interface{} {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    // 创建副本
    result := make(map[string]interface{}, len(c.data))
    for k, v := range c.data {
        result[k] = v
    }
    return result
}
```

---

## 示例 4：channel 使用问题

### 问题代码

```go
func producer() chan int {
    ch := make(chan int)
    go func() {
        for i := 0; i < 10; i++ {
            ch <- i
        }
        // 忘记 close(ch)
    }()
    return ch
}

func consumer(ch chan int) {
    for v := range ch {  // 永远阻塞
        fmt.Println(v)
    }
}

func sendAfterClose() {
    ch := make(chan int)
    close(ch)
    ch <- 1  // panic: send on closed channel
}

func selectWithoutDefault() {
    ch1 := make(chan int)
    ch2 := make(chan int)
    
    select {
    case v := <-ch1:
        fmt.Println(v)
    case v := <-ch2:
        fmt.Println(v)
    }
    // 永远阻塞
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 未关闭 channel | 🔴 P0 | 导致消费者永久阻塞 |
| 向已关闭 channel 发送 | 🔴 P0 | 导致 panic |
| select 无 default/超时 | 🟠 P1 | 可能永久阻塞 |

### 修复代码

```go
func producer(ctx context.Context) <-chan int {
    ch := make(chan int)
    go func() {
        defer close(ch)  // 确保关闭
        for i := 0; i < 10; i++ {
            select {
            case ch <- i:
            case <-ctx.Done():
                return
            }
        }
    }()
    return ch
}

func consumer(ch <-chan int) {
    for v := range ch {
        fmt.Println(v)
    }
    // channel 关闭后自动退出
}

// 安全发送
func safeSend(ch chan int, value int) (sent bool) {
    defer func() {
        if recover() != nil {
            sent = false
        }
    }()
    ch <- value
    return true
}

// 带超时的 select
func selectWithTimeout(ch1, ch2 <-chan int) (int, error) {
    select {
    case v := <-ch1:
        return v, nil
    case v := <-ch2:
        return v, nil
    case <-time.After(5 * time.Second):
        return 0, errors.New("timeout")
    }
}

// 非阻塞 select
func tryReceive(ch <-chan int) (int, bool) {
    select {
    case v := <-ch:
        return v, true
    default:
        return 0, false
    }
}
```

---

## 审查要点总结

### goroutine 管理
- 每个 goroutine 必须有退出机制
- 使用 context 传递取消信号
- 使用 WaitGroup 等待完成

### 循环变量
- Go 1.22 前：传递参数或创建局部副本
- Go 1.22+：自动安全

### 锁使用
- 使用 defer 解锁
- 读多写少用 RWMutex
- 最小化锁范围
- 不返回内部引用

### channel 使用
- 发送方负责关闭
- 使用 select 处理多 channel
- 添加超时或 default

---

## 示例 5：原子操作

### 问题代码

```go
type Counter struct {
    count int64
}

func (c *Counter) Increment() {
    c.count++  // 非原子操作，存在数据竞争
}

func (c *Counter) Get() int64 {
    return c.count  // 非原子读取
}

type Stats struct {
    requests uint64
    errors   uint64
}

func (s *Stats) RecordRequest(hasError bool) {
    s.requests++  // 数据竞争
    if hasError {
        s.errors++  // 数据竞争
    }
}

// 32 位系统上的问题
type Metrics struct {
    value uint64  // 在 32 位系统上可能未对齐
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 非原子递增 | 🔴 P0 | 并发访问导致数据竞争 |
| 非原子读取 | 🔴 P0 | 可能读到中间状态 |
| 64 位原子操作对齐 | 🟠 P1 | 32 位系统上需要确保 8 字节对齐 |

### 修复代码

```go
import "sync/atomic"

type Counter struct {
    count atomic.Int64  // Go 1.19+ 推荐使用类型化原子变量
}

func (c *Counter) Increment() {
    c.count.Add(1)
}

func (c *Counter) Get() int64 {
    return c.count.Load()
}

// Go 1.18 及更早版本的写法
type CounterLegacy struct {
    count int64
}

func (c *CounterLegacy) Increment() {
    atomic.AddInt64(&c.count, 1)
}

func (c *CounterLegacy) Get() int64 {
    return atomic.LoadInt64(&c.count)
}

type Stats struct {
    requests atomic.Uint64
    errors   atomic.Uint64
}

func (s *Stats) RecordRequest(hasError bool) {
    s.requests.Add(1)
    if hasError {
        s.errors.Add(1)
    }
}

func (s *Stats) GetStats() (requests, errors uint64) {
    return s.requests.Load(), s.errors.Load()
}

// 32 位系统对齐问题的解决方案
type Metrics struct {
    // 确保 64 位字段在结构体开头（自动 8 字节对齐）
    value uint64
    // 或使用 atomic 类型（Go 1.19+）
    // value atomic.Uint64
}

// 更安全的做法：使用 atomic 类型包装
type SafeMetrics struct {
    value atomic.Uint64  // 自动处理对齐
}

// CAS 操作示例
type State struct {
    status atomic.Int32
}

const (
    StateIdle    int32 = 0
    StateRunning int32 = 1
    StateStopped int32 = 2
)

func (s *State) TryStart() bool {
    return s.status.CompareAndSwap(StateIdle, StateRunning)
}

func (s *State) Stop() {
    s.status.Store(StateStopped)
}
```

---

## 示例 6：errgroup 并发错误处理

### 问题代码

```go
func fetchAll(ctx context.Context, urls []string) ([]string, error) {
    results := make([]string, len(urls))
    var firstErr error
    var mu sync.Mutex
    var wg sync.WaitGroup
    
    for i, url := range urls {
        wg.Add(1)
        go func(i int, url string) {
            defer wg.Done()
            
            data, err := fetch(ctx, url)
            if err != nil {
                mu.Lock()
                if firstErr == nil {
                    firstErr = err
                }
                mu.Unlock()
                return
            }
            results[i] = data
        }(i, url)
    }
    
    wg.Wait()
    return results, firstErr
}

// 问题：
// 1. 错误处理复杂
// 2. 无法在第一个错误时取消其他 goroutine
// 3. 无法限制并发数
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 手动错误聚合 | 🟠 P1 | 代码复杂，易出错 |
| 无法取消其他任务 | 🟠 P1 | 浪费资源 |
| 无并发限制 | 🟠 P1 | 可能导致资源耗尽 |

### 修复代码

```go
import "golang.org/x/sync/errgroup"

// 基础用法：第一个错误时取消所有任务
func fetchAll(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]string, len(urls))
    
    for i, url := range urls {
        i, url := i, url  // Go 1.22 前需要
        g.Go(func() error {
            data, err := fetch(ctx, url)
            if err != nil {
                return fmt.Errorf("fetch %s: %w", url, err)
            }
            results[i] = data
            return nil
        })
    }
    
    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}

// 限制并发数 [Go 1.20+ errgroup.SetLimit]
func fetchAllWithLimit(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(10)  // 最多 10 个并发
    
    results := make([]string, len(urls))
    
    for i, url := range urls {
        i, url := i, url
        g.Go(func() error {
            data, err := fetch(ctx, url)
            if err != nil {
                return err
            }
            results[i] = data
            return nil
        })
    }
    
    return results, g.Wait()
}

// TryGo：非阻塞提交任务 [Go 1.20+]
func fetchAllNonBlocking(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(5)
    
    results := make([]string, len(urls))
    submitted := 0
    
    for i, url := range urls {
        i, url := i, url
        // TryGo 在达到限制时返回 false 而不是阻塞
        if g.TryGo(func() error {
            data, err := fetch(ctx, url)
            if err != nil {
                return err
            }
            results[i] = data
            return nil
        }) {
            submitted++
        }
    }
    
    return results[:submitted], g.Wait()
}

// 收集所有错误（而非只返回第一个）
func fetchAllCollectErrors(ctx context.Context, urls []string) ([]string, []error) {
    var (
        results = make([]string, len(urls))
        errs    = make([]error, len(urls))
        wg      sync.WaitGroup
    )
    
    for i, url := range urls {
        i, url := i, url
        wg.Add(1)
        go func() {
            defer wg.Done()
            data, err := fetch(ctx, url)
            if err != nil {
                errs[i] = err
                return
            }
            results[i] = data
        }()
    }
    
    wg.Wait()
    
    // 过滤非 nil 错误
    var actualErrs []error
    for _, err := range errs {
        if err != nil {
            actualErrs = append(actualErrs, err)
        }
    }
    
    return results, actualErrs
}

// 使用 errors.Join 聚合错误 [Go 1.20+]
func fetchAllJoinErrors(ctx context.Context, urls []string) ([]string, error) {
    var (
        results = make([]string, len(urls))
        errs    []error
        mu      sync.Mutex
        wg      sync.WaitGroup
    )
    
    for i, url := range urls {
        i, url := i, url
        wg.Add(1)
        go func() {
            defer wg.Done()
            data, err := fetch(ctx, url)
            if err != nil {
                mu.Lock()
                errs = append(errs, fmt.Errorf("fetch %s: %w", url, err))
                mu.Unlock()
                return
            }
            results[i] = data
        }()
    }
    
    wg.Wait()
    
    if len(errs) > 0 {
        return results, errors.Join(errs...)  // Go 1.20+
    }
    return results, nil
}
```

---

## 示例 7：sync.Once 正确使用

### 问题代码

```go
var (
    instance *Database
    once     sync.Once
)

func GetDatabase() *Database {
    once.Do(func() {
        db, err := connect()
        if err != nil {
            // 问题：错误时 once 已经执行，后续调用不会重试
            log.Printf("connect failed: %v", err)
            return
        }
        instance = db
    })
    return instance  // 可能返回 nil
}

// 双重检查锁的错误实现
func GetDatabaseBad() *Database {
    if instance == nil {
        once.Do(func() {
            instance, _ = connect()  // 忽略错误
        })
    }
    return instance
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| Once 内错误处理 | 🔴 P0 | 初始化失败后无法重试 |
| 返回可能为 nil | 🔴 P0 | 调用方可能 panic |
| 双重检查无意义 | 🟡 P2 | sync.Once 已保证只执行一次 |

### 修复代码

```go
var (
    instance *Database
    initErr  error
    once     sync.Once
)

// 方案 1：返回错误
func GetDatabase() (*Database, error) {
    once.Do(func() {
        instance, initErr = connect()
    })
    return instance, initErr
}

// 方案 2：panic（适用于必须成功的初始化）
func MustGetDatabase() *Database {
    once.Do(func() {
        var err error
        instance, err = connect()
        if err != nil {
            panic(fmt.Sprintf("database init failed: %v", err))
        }
    })
    return instance
}

// 方案 3：支持重试的单例
type LazyDatabase struct {
    db   *Database
    err  error
    mu   sync.Mutex
    done bool
}

func (l *LazyDatabase) Get() (*Database, error) {
    l.mu.Lock()
    defer l.mu.Unlock()
    
    if l.done {
        return l.db, l.err
    }
    
    l.db, l.err = connect()
    if l.err == nil {
        l.done = true  // 只有成功才标记完成
    }
    return l.db, l.err
}

// 方案 4：使用 sync.OnceValues [Go 1.21+]
var getDB = sync.OnceValues(func() (*Database, error) {
    return connect()
})

func GetDatabaseV2() (*Database, error) {
    return getDB()
}

// sync.OnceFunc [Go 1.21+] 用于无返回值的初始化
var initLogging = sync.OnceFunc(func() {
    log.SetFlags(log.LstdFlags | log.Lshortfile)
})
```

---

## 示例 8：Context 值传递

### 问题代码

```go
type contextKey string

func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // 问题：使用字符串作为 key 可能冲突
        ctx := context.WithValue(r.Context(), "userID", getUserID(r))
        ctx = context.WithValue(ctx, "requestID", generateRequestID())
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

func handler(w http.ResponseWriter, r *http.Request) {
    // 问题：类型断言可能 panic
    userID := r.Context().Value("userID").(int64)
    fmt.Fprintf(w, "User: %d", userID)
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 字符串 key | 🟠 P1 | 不同包可能使用相同字符串导致冲突 |
| 无类型安全 | 🟠 P1 | 类型断言可能失败 |

### 修复代码

```go
// 定义私有类型作为 key，避免冲突
type contextKey int

const (
    userIDKey contextKey = iota
    requestIDKey
    traceIDKey
)

// 类型安全的 getter/setter
func WithUserID(ctx context.Context, userID int64) context.Context {
    return context.WithValue(ctx, userIDKey, userID)
}

func GetUserID(ctx context.Context) (int64, bool) {
    userID, ok := ctx.Value(userIDKey).(int64)
    return userID, ok
}

func WithRequestID(ctx context.Context, requestID string) context.Context {
    return context.WithValue(ctx, requestIDKey, requestID)
}

func GetRequestID(ctx context.Context) string {
    if id, ok := ctx.Value(requestIDKey).(string); ok {
        return id
    }
    return ""
}

// 使用
func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := r.Context()
        ctx = WithUserID(ctx, getUserID(r))
        ctx = WithRequestID(ctx, generateRequestID())
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

func handler(w http.ResponseWriter, r *http.Request) {
    userID, ok := GetUserID(r.Context())
    if !ok {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }
    fmt.Fprintf(w, "User: %d", userID)
}
```

---

## 并发审查要点总结（补充）

### 原子操作
- 共享计数器使用 `sync/atomic`
- Go 1.19+ 优先使用 `atomic.Int64` 等类型
- 32 位系统注意 64 位原子操作对齐

### errgroup **[golang.org/x/sync]**
- 替代手动 WaitGroup + 错误处理
- `SetLimit` 限制并发数 **[Go 1.20+]**
- 自动取消其他 goroutine

### sync.Once
- 处理初始化错误
- Go 1.21+ 使用 `sync.OnceValues`/`sync.OnceFunc`

### Context 值
- 使用私有类型作为 key
- 提供类型安全的 getter/setter
