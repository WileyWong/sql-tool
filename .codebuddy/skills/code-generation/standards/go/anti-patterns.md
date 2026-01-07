# Go 错误示例集

## 错误处理

```go
// ❌ 忽略错误
result, _ := doSomething()

// ✅ 正确
result, err := doSomething()
if err != nil {
    return fmt.Errorf("do something: %w", err)
}

// ❌ 只记录不处理
if err != nil {
    log.Printf("error: %v", err)
}
// 继续执行...

// ✅ 正确
if err != nil {
    log.Printf("error: %v", err)
    return err
}
```

## 并发问题

```go
// ❌ 循环变量捕获
for _, item := range items {
    go func() {
        process(item)  // 所有 goroutine 使用同一个 item！
    }()
}

// ✅ 正确
for _, item := range items {
    item := item  // 创建副本
    go func() {
        process(item)
    }()
}

// ❌ goroutine 泄漏
go func() {
    for {
        // 无退出条件
    }
}()

// ✅ 正确
go func() {
    for {
        select {
        case <-ctx.Done():
            return
        default:
            // 处理
        }
    }
}()
```

## defer 陷阱

```go
// ❌ 循环中 defer
for _, file := range files {
    f, _ := os.Open(file)
    defer f.Close()  // 函数结束才关闭！
}

// ✅ 正确
for _, file := range files {
    func() {
        f, _ := os.Open(file)
        defer f.Close()
    }()
}

// ❌ defer 中使用循环变量
for i := 0; i < 3; i++ {
    defer fmt.Println(i)  // 输出 2,2,2
}

// ✅ 正确
for i := 0; i < 3; i++ {
    i := i
    defer fmt.Println(i)  // 输出 2,1,0
}
```

## nil 问题

```go
// ❌ nil slice 判断
var s []int
if s == nil {
    // 可能不进入
}

// ✅ 正确
if len(s) == 0 {
    // 处理空 slice
}

// ❌ nil interface 判断
var err error
var myErr *MyError = nil
err = myErr
if err != nil {  // true! interface 不为 nil
    // 会进入这里
}
```

## 字符串处理

```go
// ❌ 循环拼接
var result string
for _, s := range strs {
    result += s  // 每次创建新字符串
}

// ✅ 正确
var builder strings.Builder
for _, s := range strs {
    builder.WriteString(s)
}
result := builder.String()
```

## 参考

- [Go 错误处理规范](error-handling.md)
- [50 Shades of Go](http://devs.cloudimmunity.com/gotchas-and-common-mistakes-in-go-golang/)
