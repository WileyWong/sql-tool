# Go 日志规范

> 继承自 [通用日志规范](../common/logging.md)

## 日志库选择

推荐：**zap** 或 **logrus**

```go
// zap 示例
import "go.uber.org/zap"

var logger *zap.Logger

func init() {
    logger, _ = zap.NewProduction()
}

// 使用
logger.Info("user created",
    zap.Int64("userId", user.ID),
    zap.String("username", user.Username),
)
```

## 日志级别

| 级别 | 使用场景 |
|------|---------|
| **Error** | 系统错误，需要处理 |
| **Warn** | 潜在问题 |
| **Info** | 关键业务节点 |
| **Debug** | 调试信息 |

## 结构化日志

```go
// ✅ 结构化字段
logger.Info("order created",
    zap.Int64("orderId", order.ID),
    zap.Int64("userId", order.UserID),
    zap.Float64("amount", order.Amount),
    zap.Duration("cost", time.Since(start)),
)

// ❌ 字符串拼接
logger.Info(fmt.Sprintf("order created, orderId=%d", order.ID))
```

## 必须记录的场景

```go
// 外部调用
func (c *PaymentClient) Pay(req *PaymentRequest) (*PaymentResult, error) {
    start := time.Now()
    logger.Info("calling payment api",
        zap.String("orderId", req.OrderID),
        zap.Float64("amount", req.Amount),
    )
    
    result, err := c.doPayment(req)
    
    logger.Info("payment api returned",
        zap.String("orderId", req.OrderID),
        zap.String("status", result.Status),
        zap.Duration("cost", time.Since(start)),
        zap.Error(err),
    )
    return result, err
}

// 错误处理
if err != nil {
    logger.Error("create order failed",
        zap.Int64("userId", req.UserID),
        zap.Error(err),
    )
    return nil, err
}
```

## 敏感信息

```go
// ❌ 禁止
logger.Info("user login", zap.String("password", password))

// ✅ 脱敏
logger.Info("user login", zap.String("phone", maskPhone(phone)))

func maskPhone(phone string) string {
    if len(phone) != 11 {
        return phone
    }
    return phone[:3] + "****" + phone[7:]
}
```

## 请求追踪

```go
// 中间件注入 traceId
func TraceMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        traceId := c.GetHeader("X-Trace-Id")
        if traceId == "" {
            traceId = uuid.New().String()
        }
        ctx := context.WithValue(c.Request.Context(), "traceId", traceId)
        c.Request = c.Request.WithContext(ctx)
        c.Next()
    }
}

// 日志中使用
func LoggerWithContext(ctx context.Context) *zap.Logger {
    traceId, _ := ctx.Value("traceId").(string)
    return logger.With(zap.String("traceId", traceId))
}
```

## 检查清单

- [ ] 使用结构化日志（zap/logrus）
- [ ] 使用结构化字段而非字符串拼接
- [ ] 关键业务节点有 Info 日志
- [ ] 外部调用记录入参、出参、耗时
- [ ] 错误日志包含上下文
- [ ] 敏感信息已脱敏
- [ ] 使用 traceId 追踪请求

## 参考

- [通用日志规范](../common/logging.md)
- [zap](https://github.com/uber-go/zap)
