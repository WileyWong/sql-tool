# Go 性能优化审查示例

## 示例 1：切片性能问题

### 问题代码

```go
func collectUsers(ids []int64) []User {
    var users []User  // 未预分配
    for _, id := range ids {
        user, _ := getUser(id)
        users = append(users, user)  // 多次扩容
    }
    return users
}

func filterItems(items []Item) []Item {
    var result []Item
    for _, item := range items {
        if item.Active {
            result = append(result, item)
        }
    }
    return result
}

func copySlice(src []int) []int {
    dst := make([]int, 0)
    for _, v := range src {
        dst = append(dst, v)
    }
    return dst
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 未预分配切片 | 🟠 P1 | 导致多次内存分配和复制 |
| 循环 append | 🟡 P2 | 已知长度时应预分配 |
| 手动复制切片 | 🟡 P2 | 应使用 copy 或 slices.Clone |

### 修复代码

```go
func collectUsers(ids []int64) []User {
    users := make([]User, 0, len(ids))  // 预分配容量
    for _, id := range ids {
        user, _ := getUser(id)
        users = append(users, user)
    }
    return users
}

func filterItems(items []Item) []Item {
    // 估算容量（如 50%）
    result := make([]Item, 0, len(items)/2)
    for _, item := range items {
        if item.Active {
            result = append(result, item)
        }
    }
    return result
}

func copySlice(src []int) []int {
    dst := make([]int, len(src))
    copy(dst, src)
    return dst
    
    // 或使用 Go 1.21+ slices 包
    // return slices.Clone(src)
}
```

---

## 示例 2：字符串拼接问题

### 问题代码

```go
func buildSQL(conditions []string) string {
    sql := "SELECT * FROM users WHERE "
    for i, cond := range conditions {
        if i > 0 {
            sql += " AND "
        }
        sql += cond  // 每次创建新字符串
    }
    return sql
}

func formatLog(items []Item) string {
    result := ""
    for _, item := range items {
        result += fmt.Sprintf("ID: %d, Name: %s\n", item.ID, item.Name)
    }
    return result
}

func joinWithSeparator(strs []string, sep string) string {
    result := ""
    for i, s := range strs {
        if i > 0 {
            result += sep
        }
        result += s
    }
    return result
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 循环中 `+` 拼接 | 🟠 P1 | O(n²) 时间复杂度，大量内存分配 |
| 未使用 strings.Builder | 🟠 P1 | 性能差 10-100 倍 |
| 重复造轮子 | 🟡 P2 | strings.Join 已有实现 |

### 修复代码

```go
func buildSQL(conditions []string) string {
    if len(conditions) == 0 {
        return "SELECT * FROM users"
    }
    
    var builder strings.Builder
    builder.WriteString("SELECT * FROM users WHERE ")
    builder.WriteString(conditions[0])
    
    for _, cond := range conditions[1:] {
        builder.WriteString(" AND ")
        builder.WriteString(cond)
    }
    return builder.String()
}

func formatLog(items []Item) string {
    var builder strings.Builder
    builder.Grow(len(items) * 50)  // 预估大小
    
    for _, item := range items {
        fmt.Fprintf(&builder, "ID: %d, Name: %s\n", item.ID, item.Name)
    }
    return builder.String()
}

func joinWithSeparator(strs []string, sep string) string {
    return strings.Join(strs, sep)  // 使用标准库
}
```

---

## 示例 3：内存分配问题

### 问题代码

```go
func processRequests(requests []*Request) {
    for _, req := range requests {
        buf := make([]byte, 1024)  // 每次分配
        process(req, buf)
    }
}

type Handler struct{}

func (h Handler) Handle(data []byte) {  // 值接收者，复制 Handler
    // ...
}

func getConfig() map[string]string {
    return map[string]string{
        "key1": "value1",
        "key2": "value2",
    }
}

// 每次调用都创建新 map
func process() {
    config := getConfig()
    // ...
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 循环内重复分配 | 🟠 P1 | 应使用 sync.Pool 复用 |
| 大结构体值接收者 | 🟡 P2 | 每次调用复制结构体 |
| 重复创建相同数据 | 🟡 P2 | 应缓存或使用常量 |

### 修复代码

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 1024)
    },
}

func processRequests(requests []*Request) {
    for _, req := range requests {
        buf := bufferPool.Get().([]byte)
        process(req, buf)
        bufferPool.Put(buf)  // 归还
    }
}

type Handler struct {
    // 假设有多个字段
    config Config
    logger *Logger
}

func (h *Handler) Handle(data []byte) {  // 指针接收者
    // ...
}

var defaultConfig = map[string]string{
    "key1": "value1",
    "key2": "value2",
}

func getConfig() map[string]string {
    return defaultConfig  // 返回共享实例（只读）
}

// 或使用 sync.Once 延迟初始化
var (
    config     map[string]string
    configOnce sync.Once
)

func getConfigLazy() map[string]string {
    configOnce.Do(func() {
        config = loadConfig()
    })
    return config
}
```

---

## 示例 4：数据库查询问题

### 问题代码

```go
func getOrdersWithUsers(orderIDs []int64) ([]OrderWithUser, error) {
    var results []OrderWithUser
    
    for _, id := range orderIDs {
        order, _ := db.GetOrder(id)
        user, _ := db.GetUser(order.UserID)  // N+1 查询
        results = append(results, OrderWithUser{
            Order: order,
            User:  user,
        })
    }
    return results, nil
}

func searchUsers(name string) ([]User, error) {
    query := fmt.Sprintf("SELECT * FROM users WHERE name LIKE '%%%s%%'", name)
    return db.Query(query)  // SQL 注入 + 全表扫描
}

func getActiveUsers() ([]User, error) {
    var users []User
    rows, _ := db.Query("SELECT * FROM users WHERE active = 1")
    for rows.Next() {
        var user User
        rows.Scan(&user.ID, &user.Name, &user.Email, /* 所有字段 */)
        users = append(users, user)
    }
    return users, nil
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| N+1 查询 | 🔴 P0 | 严重性能问题 |
| SQL 字符串拼接 | 🔴 P0 | SQL 注入风险 |
| SELECT * | 🟠 P1 | 查询不需要的字段 |
| 未预分配结果切片 | 🟡 P2 | 多次扩容 |

### 修复代码

```go
func getOrdersWithUsers(orderIDs []int64) ([]OrderWithUser, error) {
    if len(orderIDs) == 0 {
        return nil, nil
    }
    
    // 批量查询订单
    orders, err := db.GetOrdersByIDs(orderIDs)
    if err != nil {
        return nil, err
    }
    
    // 收集用户 ID
    userIDs := make([]int64, 0, len(orders))
    for _, order := range orders {
        userIDs = append(userIDs, order.UserID)
    }
    
    // 批量查询用户
    users, err := db.GetUsersByIDs(userIDs)
    if err != nil {
        return nil, err
    }
    
    // 构建用户 map
    userMap := make(map[int64]User, len(users))
    for _, user := range users {
        userMap[user.ID] = user
    }
    
    // 组装结果
    results := make([]OrderWithUser, 0, len(orders))
    for _, order := range orders {
        results = append(results, OrderWithUser{
            Order: order,
            User:  userMap[order.UserID],
        })
    }
    return results, nil
}

func searchUsers(name string) ([]User, error) {
    // 参数化查询
    query := "SELECT id, name, email FROM users WHERE name LIKE ?"
    return db.Query(query, "%"+name+"%")
}

func getActiveUsers() ([]User, error) {
    // 只查询需要的字段
    query := "SELECT id, name, email FROM users WHERE active = 1"
    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    // 预分配（如果能估算数量）
    users := make([]User, 0, 100)
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }
    return users, rows.Err()
}
```

---

## 性能检测工具

```bash
# Benchmark 测试
go test -bench=. -benchmem ./...

# CPU 分析
go test -cpuprofile=cpu.prof -bench=.
go tool pprof cpu.prof

# 内存分析
go test -memprofile=mem.prof -bench=.
go tool pprof mem.prof

# 逃逸分析
go build -gcflags="-m" ./...

# 竞态检测
go test -race ./...
```

---

## 审查要点总结

### 切片
- 已知长度时预分配容量
- 使用 copy 或 slices.Clone 复制 **[Go 1.21+]**
- 注意切片共享底层数组

### 字符串
- 大量拼接用 strings.Builder
- 简单拼接用 fmt.Sprintf
- 分隔符连接用 strings.Join

### 内存
- 频繁创建的对象用 sync.Pool
- 大结构体用指针传递
- 避免重复创建相同数据

### 数据库
- 避免 N+1 查询
- 使用参数化查询
- 只查询需要的字段

---

## 示例 5：逃逸分析优化

### 问题代码

```go
func createUser(name string) *User {
    // 返回局部变量指针，逃逸到堆
    return &User{Name: name}
}

func processData(data []byte) *Result {
    result := new(Result)  // 逃逸到堆
    result.Data = data
    return result
}

func formatMessage(args ...interface{}) string {
    // 可变参数导致逃逸
    return fmt.Sprintf("%v", args)
}

type Handler struct {
    process func(data []byte) error
}

func (h *Handler) Handle(data []byte) error {
    // 闭包捕获导致逃逸
    return h.process(data)
}

func allocateInLoop(n int) []*Item {
    items := make([]*Item, n)
    for i := 0; i < n; i++ {
        items[i] = &Item{ID: i}  // 每次循环都分配到堆
    }
    return items
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 返回局部指针 | 🟡 P2 | 导致堆分配 |
| 接口参数 | 🟡 P2 | interface{} 通常导致逃逸 |
| 循环内分配 | 🟠 P1 | 大量小对象 GC 压力 |

### 分析和修复

```bash
# 查看逃逸分析结果
go build -gcflags="-m -m" ./...

# 输出示例：
# ./main.go:10:9: &User{...} escapes to heap
# ./main.go:10:9:   from ~r0 (return) at ./main.go:10:2
```

```go
// 方案 1：返回值而非指针（如果结构体不大）
func createUser(name string) User {
    return User{Name: name}  // 栈分配，由调用方决定是否逃逸
}

// 方案 2：调用方分配，函数填充
func fillUser(u *User, name string) {
    u.Name = name
}

func main() {
    var user User  // 栈分配
    fillUser(&user, "Alice")
}

// 方案 3：使用 sync.Pool 复用对象
var userPool = sync.Pool{
    New: func() interface{} {
        return new(User)
    },
}

func createUserPooled(name string) *User {
    user := userPool.Get().(*User)
    user.Name = name
    return user
}

func releaseUser(u *User) {
    u.Name = ""  // 清理
    userPool.Put(u)
}

// 方案 4：避免 interface{} 参数
func formatMessageTyped(format string, a, b string) string {
    return fmt.Sprintf(format, a, b)  // 具体类型，可能不逃逸
}

// 方案 5：预分配切片元素
func allocateInLoopOptimized(n int) []Item {
    items := make([]Item, n)  // 一次分配所有元素
    for i := 0; i < n; i++ {
        items[i] = Item{ID: i}  // 直接赋值，不分配新内存
    }
    return items
}

// 如果必须返回指针切片
func allocatePointersOptimized(n int) []*Item {
    // 预分配底层数组
    backing := make([]Item, n)
    items := make([]*Item, n)
    for i := 0; i < n; i++ {
        backing[i] = Item{ID: i}
        items[i] = &backing[i]  // 指向预分配的元素
    }
    return items
}
```

### 逃逸分析常见场景

| 场景 | 是否逃逸 | 说明 |
|------|----------|------|
| 返回局部变量指针 | ✅ 逃逸 | 生命周期超出函数 |
| 发送到 channel | ✅ 逃逸 | 跨 goroutine |
| 存储到接口 | ✅ 逃逸 | 运行时类型信息 |
| 存储到全局变量 | ✅ 逃逸 | 生命周期不确定 |
| 闭包捕获 | ✅ 逃逸 | 闭包可能逃逸 |
| 切片扩容 | ✅ 逃逸 | 新底层数组 |
| 大对象 (>64KB) | ✅ 逃逸 | 直接分配到堆 |
| 局部变量不取地址 | ❌ 不逃逸 | 栈分配 |
| 内联函数的局部变量 | ❌ 不逃逸 | 内联后栈分配 |

---

## 示例 6：泛型性能 **[Go 1.18+]**

### 问题代码

```go
// 泛型函数可能导致代码膨胀或性能下降
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 泛型切片操作
func Contains[T comparable](slice []T, item T) bool {
    for _, v := range slice {
        if v == item {
            return true
        }
    }
    return false
}

// 泛型 map 操作
func Keys[K comparable, V any](m map[K]V) []K {
    keys := make([]K, 0, len(m))
    for k := range m {
        keys = append(keys, k)
    }
    return keys
}
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 泛型实例化开销 | 🟡 P2 | 每个类型生成独立代码 |
| 接口约束性能 | 🟡 P2 | 某些情况下不如具体类型 |

### 分析和优化

```go
// Go 泛型实现采用 GCShape stenciling
// 相同底层类型共享代码，但指针类型各自生成

// 性能对比测试
func BenchmarkMaxInt(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = Max(1, 2)
    }
}

func BenchmarkMaxIntConcrete(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = maxInt(1, 2)
    }
}

func maxInt(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// 结果：泛型版本通常与具体类型版本性能相当
// 但在某些边界情况下可能有差异
```

```go
// 优化 1：热点代码使用具体类型
// 如果 95% 的调用是 int 类型，提供具体实现
func MaxInt(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// 泛型版本作为通用后备
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// 优化 2：避免不必要的泛型
// 如果只用于一种类型，不需要泛型
func containsString(slice []string, item string) bool {
    for _, v := range slice {
        if v == item {
            return true
        }
    }
    return false
}

// 优化 3：使用 Go 1.21+ 标准库泛型函数
import "slices"

func example() {
    nums := []int{1, 2, 3, 4, 5}
    
    // 使用标准库（已优化）
    _ = slices.Contains(nums, 3)
    _ = slices.Max(nums)
    _ = slices.Clone(nums)
    
    // 排序
    slices.Sort(nums)
    slices.SortFunc(nums, func(a, b int) int {
        return a - b
    })
}

// 优化 4：泛型约束设计
// 更具体的约束可能带来更好的优化
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

// 优化 5：避免泛型中的接口转换
// 不好：泛型内部使用接口
func ProcessBad[T any](items []T, fn func(any) any) []T {
    result := make([]T, len(items))
    for i, item := range items {
        result[i] = fn(item).(T)  // 类型断言开销
    }
    return result
}

// 好：保持类型一致
func ProcessGood[T any](items []T, fn func(T) T) []T {
    result := make([]T, len(items))
    for i, item := range items {
        result[i] = fn(item)
    }
    return result
}
```

### 泛型性能指南

| 场景 | 建议 |
|------|------|
| 热点代码 | 考虑提供具体类型版本 |
| 标准库已有 | 使用 `slices`/`maps` 包 **[Go 1.21+]** |
| 简单操作 | 泛型开销可忽略 |
| 复杂约束 | Benchmark 验证性能 |
| 接口转换 | 避免泛型内部 any 转换 |

---

## 示例 7：零拷贝优化

### 问题代码

```go
func processString(s string) []byte {
    return []byte(s)  // 复制字符串到新的字节切片
}

func bytesToString(b []byte) string {
    return string(b)  // 复制字节切片到新的字符串
}

func subSlice(data []byte, start, end int) []byte {
    result := make([]byte, end-start)
    copy(result, data[start:end])  // 不必要的复制
    return result
}
```

### 修复代码

```go
import "unsafe"

// 方案 1：使用 unsafe 实现零拷贝（谨慎使用）
// 注意：修改返回的 []byte 会导致未定义行为
func stringToBytes(s string) []byte {
    return unsafe.Slice(unsafe.StringData(s), len(s))
}

func bytesToStringUnsafe(b []byte) string {
    return unsafe.String(unsafe.SliceData(b), len(b))
}

// 方案 2：Go 1.22+ strings.Clone 用于需要独立副本时
func cloneString(s string) string {
    return strings.Clone(s)  // 明确表示需要复制
}

// 方案 3：切片共享底层数组（注意生命周期）
func subSliceShared(data []byte, start, end int) []byte {
    return data[start:end]  // 共享底层数组，零拷贝
    // 注意：修改会影响原切片
}

// 方案 4：如果需要独立副本，使用 slices.Clone [Go 1.21+]
func subSliceCopy(data []byte, start, end int) []byte {
    return slices.Clone(data[start:end])
}

// 方案 5：bytes.Buffer 复用
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func processWithBuffer(data []byte) []byte {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufPool.Put(buf)
    }()
    
    buf.Write(data)
    // 处理...
    return buf.Bytes()
}
```

---

## 性能检测工具（补充）

```bash
# Benchmark 测试
go test -bench=. -benchmem ./...

# CPU 分析
go test -cpuprofile=cpu.prof -bench=.
go tool pprof cpu.prof

# 内存分析
go test -memprofile=mem.prof -bench=.
go tool pprof mem.prof

# 逃逸分析
go build -gcflags="-m" ./...
go build -gcflags="-m -m" ./...  # 更详细

# 内联分析
go build -gcflags="-m -m" ./... 2>&1 | grep "inlining"

# 竞态检测
go test -race ./...

# 编译优化报告
go build -gcflags="-d=ssa/check_bce/debug=1" ./...  # 边界检查

# 生成汇编
go build -gcflags="-S" ./...
go tool compile -S main.go

# trace 分析
go test -trace=trace.out ./...
go tool trace trace.out

# 模糊测试 [Go 1.18+]
go test -fuzz=FuzzXxx -fuzztime=30s ./...
```

---

## 性能审查要点总结（补充）

### 逃逸分析
- 使用 `-gcflags="-m"` 检查逃逸
- 返回值而非指针（小结构体）
- 使用 sync.Pool 复用对象
- 避免不必要的接口转换

### 泛型性能 **[Go 1.18+]**
- 热点代码考虑具体类型版本
- 使用标准库 `slices`/`maps` **[Go 1.21+]**
- Benchmark 验证性能

### 零拷贝
- 谨慎使用 unsafe 转换
- 注意切片共享底层数组
- 使用 `strings.Clone` 明确复制意图 **[Go 1.22+]**
