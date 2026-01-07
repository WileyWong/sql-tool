# Go 进阶专项审查指南

基于 Go 现代特性的进阶代码审查，覆盖 Context、泛型、高级并发模式等。

> 📚 **前置**: 请先阅读 [Go 基础审查指南](go-review.md)
> ⚠️ **版本要求**: 部分特性需要 Go 1.18+

## 进阶审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Context 最佳实践 | 25% | 传递规范、超时控制、取消传播 |
| 泛型设计 | 25% | 类型约束、适用场景、性能考量 |
| 高级并发模式 | 25% | errgroup、信号量、工作池 |
| 内存与逃逸分析 | 25% | 逃逸检测、内存优化、GC 调优 |

---

## 一、Context 最佳实践

### 1.1 Context 传递规范

```go
// ✅ Context 作为第一个参数
func GetUser(ctx context.Context, id int64) (*User, error) {
    return db.QueryContext(ctx, "SELECT * FROM users WHERE id = ?", id)
}

func ProcessOrder(ctx context.Context, order *Order) error {
    // 使用 ctx
}

// ❌ Context 不是第一个参数
func GetUser(id int64, ctx context.Context) (*User, error) {
    // 违反惯例
}

// ❌ Context 放在 struct 中
type Service struct {
    ctx context.Context  // 不要这样做！
    db  *sql.DB
}

// ✅ 每次调用传递 Context
type Service struct {
    db *sql.DB
}

func (s *Service) GetUser(ctx context.Context, id int64) (*User, error) {
    return s.db.QueryContext(ctx, "...", id)
}
```

### 1.2 Context 超时设置

```go
// ✅ 为外部调用设置超时
func CallExternalAPI(ctx context.Context, url string) (*Response, error) {
    // 设置 5 秒超时
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()  // 必须调用 cancel 释放资源
    
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }
    
    return http.DefaultClient.Do(req)
}

// ✅ 为数据库操作设置超时
func QueryWithTimeout(ctx context.Context, db *sql.DB) error {
    ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
    defer cancel()
    
    rows, err := db.QueryContext(ctx, "SELECT * FROM large_table")
    if err != nil {
        return fmt.Errorf("query failed: %w", err)
    }
    defer rows.Close()
    
    // 处理结果
    return nil
}

// ❌ 未设置超时的外部调用
func CallExternalAPI(url string) (*Response, error) {
    return http.Get(url)  // 可能永远阻塞
}

// ✅ 超时分层：外层超时 > 内层超时
func ProcessWithLayeredTimeout(ctx context.Context) error {
    // 外层：总超时 10 秒
    ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
    defer cancel()
    
    // 内层：单个操作 3 秒
    if err := step1(ctx); err != nil {
        return err
    }
    
    if err := step2(ctx); err != nil {
        return err
    }
    
    return step3(ctx)
}

func step1(ctx context.Context) error {
    ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
    defer cancel()
    // 执行操作
    return nil
}
```

### 1.3 Context 取消传播

```go
// ✅ 检查 Context 取消
func ProcessItems(ctx context.Context, items []Item) error {
    for _, item := range items {
        // 每次迭代检查取消
        select {
        case <-ctx.Done():
            return ctx.Err()
        default:
        }
        
        if err := processItem(ctx, item); err != nil {
            return err
        }
    }
    return nil
}

// ✅ 在 goroutine 中传播取消
func FetchAll(ctx context.Context, urls []string) ([]Result, error) {
    results := make([]Result, len(urls))
    g, ctx := errgroup.WithContext(ctx)  // 创建带取消的 context
    
    for i, url := range urls {
        i, url := i, url
        g.Go(func() error {
            result, err := fetch(ctx, url)
            if err != nil {
                return err  // 任一失败会取消其他
            }
            results[i] = result
            return nil
        })
    }
    
    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}

// ❌ 忽略 Context 取消
func ProcessItems(ctx context.Context, items []Item) error {
    for _, item := range items {
        processItem(item)  // 未检查 ctx，无法取消
    }
    return nil
}
```

### 1.4 Context Values 使用

```go
// ✅ 定义类型安全的 key
type contextKey string

const (
    userIDKey    contextKey = "userID"
    requestIDKey contextKey = "requestID"
)

// ✅ 封装存取方法
func WithUserID(ctx context.Context, userID int64) context.Context {
    return context.WithValue(ctx, userIDKey, userID)
}

func UserIDFromContext(ctx context.Context) (int64, bool) {
    userID, ok := ctx.Value(userIDKey).(int64)
    return userID, ok
}

// ✅ 使用示例
func Handler(ctx context.Context) {
    userID, ok := UserIDFromContext(ctx)
    if !ok {
        // 处理缺失情况
    }
    // 使用 userID
}

// ❌ 使用字符串作为 key（可能冲突）
ctx = context.WithValue(ctx, "userID", 123)

// ❌ 存储大量数据或可变数据
ctx = context.WithValue(ctx, "config", &MutableConfig{})

// ❌ 用 Context 传递函数参数
func Process(ctx context.Context) {
    data := ctx.Value("data").([]byte)  // 应该作为函数参数
}
```

### 1.5 Context 常见错误

```go
// ❌ 传递 nil context
func BadCall() {
    GetUser(nil, 123)  // 危险！
}

// ✅ 使用 context.Background() 或 context.TODO()
func GoodCall() {
    ctx := context.Background()
    GetUser(ctx, 123)
}

// ❌ 在 init 或全局变量中使用 context
var globalCtx = context.Background()  // 不要这样

// ❌ cancel 后继续使用 context
func BadUsage() {
    ctx, cancel := context.WithCancel(context.Background())
    cancel()
    
    // ctx 已取消，后续操作会立即失败
    doSomething(ctx)  // 错误
}

// ✅ 正确的 cancel 时机
func GoodUsage() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()  // 函数退出时取消
    
    doSomething(ctx)
}
```

---

## 二、泛型设计审查 [Go 1.18+]

### 2.1 类型约束设计

```go
// ✅ 使用内置约束
import "golang.org/x/exp/constraints"

func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

// ✅ 自定义约束
type Number interface {
    ~int | ~int32 | ~int64 | ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var sum T
    for _, n := range nums {
        sum += n
    }
    return sum
}

// ✅ 组合约束
type Stringer interface {
    String() string
}

type OrderedStringer interface {
    constraints.Ordered
    Stringer
}

// ✅ 使用 ~ 支持底层类型
type MyInt int

func Double[T ~int](v T) T {
    return v * 2
}

var x MyInt = 5
Double(x)  // 可以工作
```

### 2.2 泛型适用场景

```go
// ✅ 适合泛型：通用数据结构
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}

// ✅ 适合泛型：通用算法
func Filter[T any](slice []T, predicate func(T) bool) []T {
    result := make([]T, 0, len(slice))
    for _, item := range slice {
        if predicate(item) {
            result = append(result, item)
        }
    }
    return result
}

func Map[T, U any](slice []T, mapper func(T) U) []U {
    result := make([]U, len(slice))
    for i, item := range slice {
        result[i] = mapper(item)
    }
    return result
}

// ❌ 不适合泛型：只有一两种类型
// 直接写具体类型更清晰
func ProcessUsers(users []User) []User { ... }

// ❌ 过度泛型化
type Repository[T any, ID any, Filter any, Sort any] interface {
    // 太复杂了
}

// ✅ 简化设计
type Repository[T any] interface {
    Get(ctx context.Context, id int64) (T, error)
    List(ctx context.Context, opts ListOptions) ([]T, error)
    Create(ctx context.Context, entity T) error
}
```

### 2.3 泛型 vs 接口选择

```go
// 场景 1：需要类型安全的容器 → 用泛型
type Set[T comparable] struct {
    items map[T]struct{}
}

func (s *Set[T]) Add(item T) {
    s.items[item] = struct{}{}
}

func (s *Set[T]) Contains(item T) bool {
    _, ok := s.items[item]
    return ok
}

// 场景 2：需要多态行为 → 用接口
type Handler interface {
    Handle(ctx context.Context, req Request) (Response, error)
}

type UserHandler struct{}
func (h *UserHandler) Handle(ctx context.Context, req Request) (Response, error) {
    // 处理用户请求
}

type OrderHandler struct{}
func (h *OrderHandler) Handle(ctx context.Context, req Request) (Response, error) {
    // 处理订单请求
}

// 场景 3：需要类型安全 + 多态 → 泛型接口
type Comparable[T any] interface {
    Compare(other T) int
}

func Max[T Comparable[T]](a, b T) T {
    if a.Compare(b) > 0 {
        return a
    }
    return b
}
```

### 2.4 泛型性能考量

```go
// ✅ 泛型函数会被实例化，性能接近非泛型
func GenericSum[T Number](nums []T) T {
    var sum T
    for _, n := range nums {
        sum += n
    }
    return sum
}

// 编译后类似于：
// func GenericSum_int(nums []int) int { ... }
// func GenericSum_float64(nums []float64) float64 { ... }

// ⚠️ 注意：any 约束可能导致装箱
func Process[T any](items []T) {
    for _, item := range items {
        // 如果 T 是 any，可能有额外开销
        fmt.Println(item)
    }
}

// ✅ 使用具体约束减少开销
func Process[T fmt.Stringer](items []T) {
    for _, item := range items {
        fmt.Println(item.String())
    }
}

// ⚠️ 泛型类型的零值
func NewSlice[T any](size int) []T {
    return make([]T, size)  // 元素为 T 的零值
}

func GetOrDefault[T any](m map[string]T, key string, defaultVal T) T {
    if v, ok := m[key]; ok {
        return v
    }
    return defaultVal
}
```

### 2.5 泛型常见模式

```go
// 模式 1：类型安全的结果类型
type Result[T any] struct {
    Value T
    Err   error
}

func (r Result[T]) Unwrap() (T, error) {
    return r.Value, r.Err
}

func (r Result[T]) Must() T {
    if r.Err != nil {
        panic(r.Err)
    }
    return r.Value
}

// 模式 2：Option 类型
type Option[T any] struct {
    value *T
}

func Some[T any](v T) Option[T] {
    return Option[T]{value: &v}
}

func None[T any]() Option[T] {
    return Option[T]{}
}

func (o Option[T]) IsSome() bool {
    return o.value != nil
}

func (o Option[T]) Unwrap() T {
    if o.value == nil {
        panic("unwrap on None")
    }
    return *o.value
}

// 模式 3：泛型单例
type Singleton[T any] struct {
    once     sync.Once
    instance T
    init     func() T
}

func (s *Singleton[T]) Get() T {
    s.once.Do(func() {
        s.instance = s.init()
    })
    return s.instance
}
```

---

## 三、高级并发模式

### 3.1 errgroup 使用

```go
import "golang.org/x/sync/errgroup"

// ✅ 基本用法：并发执行，任一失败则取消
func FetchAll(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]string, len(urls))
    
    for i, url := range urls {
        i, url := i, url  // 捕获变量
        g.Go(func() error {
            body, err := fetch(ctx, url)
            if err != nil {
                return err
            }
            results[i] = body
            return nil
        })
    }
    
    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}

// ✅ 限制并发数 [Go 1.20+]
func FetchAllWithLimit(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(10)  // 最多 10 个并发
    
    results := make([]string, len(urls))
    
    for i, url := range urls {
        i, url := i, url
        g.Go(func() error {
            body, err := fetch(ctx, url)
            if err != nil {
                return err
            }
            results[i] = body
            return nil
        })
    }
    
    return results, g.Wait()
}

// ✅ TryGo：非阻塞提交 [Go 1.20+]
func ProcessWithBackpressure(ctx context.Context, items []Item) error {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(5)
    
    for _, item := range items {
        item := item
        // TryGo 在达到限制时返回 false
        if !g.TryGo(func() error {
            return process(ctx, item)
        }) {
            // 队列满，可以选择等待或跳过
            log.Println("Worker pool full, waiting...")
            g.Go(func() error {
                return process(ctx, item)
            })
        }
    }
    
    return g.Wait()
}
```

### 3.2 信号量模式

```go
import "golang.org/x/sync/semaphore"

// ✅ 使用信号量限制并发
type RateLimitedClient struct {
    sem    *semaphore.Weighted
    client *http.Client
}

func NewRateLimitedClient(maxConcurrent int64) *RateLimitedClient {
    return &RateLimitedClient{
        sem:    semaphore.NewWeighted(maxConcurrent),
        client: &http.Client{},
    }
}

func (c *RateLimitedClient) Do(ctx context.Context, req *http.Request) (*http.Response, error) {
    // 获取信号量
    if err := c.sem.Acquire(ctx, 1); err != nil {
        return nil, err
    }
    defer c.sem.Release(1)
    
    return c.client.Do(req)
}

// ✅ 带权重的信号量
type ResourcePool struct {
    sem *semaphore.Weighted
}

func (p *ResourcePool) AcquireSmall(ctx context.Context) error {
    return p.sem.Acquire(ctx, 1)  // 小任务占用 1
}

func (p *ResourcePool) AcquireLarge(ctx context.Context) error {
    return p.sem.Acquire(ctx, 10)  // 大任务占用 10
}
```

### 3.3 工作池模式

```go
// ✅ 泛型工作池
type WorkerPool[T any, R any] struct {
    workers int
    jobs    chan T
    results chan R
    handler func(T) R
}

func NewWorkerPool[T any, R any](workers int, handler func(T) R) *WorkerPool[T, R] {
    return &WorkerPool[T, R]{
        workers: workers,
        jobs:    make(chan T, workers*2),
        results: make(chan R, workers*2),
        handler: handler,
    }
}

func (p *WorkerPool[T, R]) Start(ctx context.Context) {
    var wg sync.WaitGroup
    
    for i := 0; i < p.workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-p.jobs:
                    if !ok {
                        return
                    }
                    p.results <- p.handler(job)
                }
            }
        }()
    }
    
    go func() {
        wg.Wait()
        close(p.results)
    }()
}

func (p *WorkerPool[T, R]) Submit(job T) {
    p.jobs <- job
}

func (p *WorkerPool[T, R]) Results() <-chan R {
    return p.results
}

func (p *WorkerPool[T, R]) Close() {
    close(p.jobs)
}

// 使用示例
func ProcessURLs(ctx context.Context, urls []string) []string {
    pool := NewWorkerPool(10, func(url string) string {
        body, _ := fetch(ctx, url)
        return body
    })
    
    pool.Start(ctx)
    
    go func() {
        for _, url := range urls {
            pool.Submit(url)
        }
        pool.Close()
    }()
    
    var results []string
    for result := range pool.Results() {
        results = append(results, result)
    }
    
    return results
}
```

### 3.4 sync.Once 变体 [Go 1.21+]

```go
// ✅ OnceFunc：只执行一次的函数
var initOnce = sync.OnceFunc(func() {
    // 初始化逻辑
    log.Println("Initializing...")
})

func DoSomething() {
    initOnce()  // 只会执行一次
    // 其他逻辑
}

// ✅ OnceValue：只计算一次的值
var getConfig = sync.OnceValue(func() *Config {
    return loadConfig()
})

func UseConfig() {
    config := getConfig()  // 只加载一次
    // 使用 config
}

// ✅ OnceValues：返回值和错误
var initDB = sync.OnceValues(func() (*sql.DB, error) {
    return sql.Open("mysql", dsn)
})

func GetDB() (*sql.DB, error) {
    return initDB()  // 只连接一次
}
```

### 3.5 singleflight 防缓存击穿

```go
import "golang.org/x/sync/singleflight"

type CacheService struct {
    cache map[string]interface{}
    mu    sync.RWMutex
    sf    singleflight.Group
}

func (s *CacheService) Get(ctx context.Context, key string) (interface{}, error) {
    // 先查缓存
    s.mu.RLock()
    if v, ok := s.cache[key]; ok {
        s.mu.RUnlock()
        return v, nil
    }
    s.mu.RUnlock()
    
    // 使用 singleflight 防止缓存击穿
    v, err, _ := s.sf.Do(key, func() (interface{}, error) {
        // 只有一个请求会真正执行
        return s.loadFromDB(ctx, key)
    })
    
    if err != nil {
        return nil, err
    }
    
    // 存入缓存
    s.mu.Lock()
    s.cache[key] = v
    s.mu.Unlock()
    
    return v, nil
}
```

---

## 四、内存与逃逸分析

### 4.1 逃逸分析基础

```bash
# 查看逃逸分析结果
go build -gcflags="-m" ./...

# 更详细的输出
go build -gcflags="-m -m" ./...
```

```go
// ✅ 不逃逸：栈上分配
func NoEscape() int {
    x := 42
    return x  // 值复制，x 不逃逸
}

// ❌ 逃逸：返回指针
func Escape() *int {
    x := 42
    return &x  // x 逃逸到堆
}

// ❌ 逃逸：赋值给接口
func EscapeToInterface() {
    x := 42
    var i interface{} = x  // x 逃逸（装箱）
    fmt.Println(i)
}

// ❌ 逃逸：闭包捕获
func EscapeByClosure() func() int {
    x := 42
    return func() int {
        return x  // x 被闭包捕获，逃逸
    }
}

// ❌ 逃逸：切片扩容
func EscapeByGrow() {
    s := make([]int, 0)
    for i := 0; i < 100; i++ {
        s = append(s, i)  // 可能逃逸
    }
}

// ✅ 避免逃逸：预分配
func NoEscapePrealloc() {
    s := make([]int, 0, 100)  // 已知大小，可能栈分配
    for i := 0; i < 100; i++ {
        s = append(s, i)
    }
}
```

### 4.2 减少内存分配

```go
// ✅ 使用 sync.Pool 复用对象
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func ProcessData(data []byte) string {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf)
    }()
    
    buf.Write(data)
    return buf.String()
}

// ✅ 避免字符串转换
func CompareBytes(a, b []byte) bool {
    return bytes.Equal(a, b)  // 不转换为 string
}

// ❌ 不必要的字符串转换
func CompareBytesBAD(a, b []byte) bool {
    return string(a) == string(b)  // 两次分配
}

// ✅ 使用 strings.Builder
func BuildString(parts []string) string {
    var builder strings.Builder
    builder.Grow(estimatedSize)  // 预分配
    
    for _, part := range parts {
        builder.WriteString(part)
    }
    
    return builder.String()
}

// ✅ 复用切片
func ProcessItems(items []Item, buf []Result) []Result {
    buf = buf[:0]  // 复用底层数组
    
    for _, item := range items {
        buf = append(buf, process(item))
    }
    
    return buf
}
```

### 4.3 内存对齐优化

```go
// ❌ 内存浪费：字段顺序不当
type BadStruct struct {
    a bool    // 1 byte + 7 padding
    b int64   // 8 bytes
    c bool    // 1 byte + 7 padding
    d int64   // 8 bytes
}  // 总共 32 bytes

// ✅ 内存优化：按大小排列
type GoodStruct struct {
    b int64   // 8 bytes
    d int64   // 8 bytes
    a bool    // 1 byte
    c bool    // 1 byte + 6 padding
}  // 总共 24 bytes

// 检查结构体大小
fmt.Println(unsafe.Sizeof(BadStruct{}))   // 32
fmt.Println(unsafe.Sizeof(GoodStruct{}))  // 24
```

### 4.4 GC 调优

```go
// ✅ 减少指针数量（减少 GC 扫描）
// ❌ 多指针
type BadCache struct {
    items map[string]*Item  // 每个 value 都是指针
}

// ✅ 值类型
type GoodCache struct {
    items map[string]Item  // 值类型，减少指针
}

// ✅ 使用数组而非切片（已知大小时）
type FixedBuffer struct {
    data [1024]byte  // 栈分配
}

// ✅ 批量处理减少分配
func ProcessBatch(items []Item) {
    // 一次分配
    results := make([]Result, len(items))
    
    for i, item := range items {
        results[i] = process(item)
    }
}

// ❌ 逐个分配
func ProcessOne(items []Item) {
    for _, item := range items {
        result := new(Result)  // 每次循环都分配
        *result = process(item)
    }
}
```

### 4.5 性能分析工具

```bash
# CPU 分析
go test -cpuprofile=cpu.prof -bench=.
go tool pprof cpu.prof

# 内存分析
go test -memprofile=mem.prof -bench=.
go tool pprof mem.prof

# 分配分析
go test -memprofile=mem.prof -memprofilerate=1 -bench=.

# 逃逸分析
go build -gcflags="-m" ./...

# trace 分析
go test -trace=trace.out -bench=.
go tool trace trace.out
```

---

## 审查检查清单

### Context 检查

- [ ] Context 作为第一个参数
- [ ] 外部调用设置超时
- [ ] 循环中检查 Context 取消
- [ ] defer cancel() 释放资源
- [ ] 不在 struct 中存储 Context
- [ ] Context Values 使用类型安全的 key

### 泛型检查

- [ ] 类型约束设计合理
- [ ] 适用场景判断正确（泛型 vs 接口）
- [ ] 避免过度泛型化
- [ ] 零值处理正确

### 并发检查

- [ ] errgroup 正确使用
- [ ] 并发数限制合理
- [ ] 资源正确释放
- [ ] 取消信号正确传播

### 内存检查

- [ ] 避免不必要的逃逸
- [ ] sync.Pool 复用频繁创建的对象
- [ ] 结构体字段按大小排列
- [ ] 预分配切片容量

---

## 相关资源

- [Go 基础审查指南](go-review.md)
- [Go 检查清单](go-checklist.md)
- [Context 官方文档](https://pkg.go.dev/context)
- [泛型教程](https://go.dev/doc/tutorial/generics)
- [errgroup 文档](https://pkg.go.dev/golang.org/x/sync/errgroup)
