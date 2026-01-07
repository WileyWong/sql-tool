# Go 技术参考

## 技术栈

| 组件 | 推荐版本 | 说明 |
|------|---------|------|
| Go | 1.21+ | 最新稳定版 |
| Gin | 1.9.x | Web 框架 |
| GORM | 2.x | ORM 框架 |
| zap | 1.x | 日志库 |

## 项目结构

```
project/
├── cmd/server/main.go
├── internal/
│   ├── handler/
│   ├── service/
│   ├── repository/
│   └── model/
├── pkg/
├── config/
└── go.mod
```

## 依赖

```go
// go.mod
require (
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.5
    gorm.io/driver/mysql v1.5.2
    go.uber.org/zap v1.26.0
)
```

## 规范文档

- [命名规范](../standards/go/naming.md)
- [错误处理](../standards/go/error-handling.md)
- [日志规范](../standards/go/logging.md)
- [最佳实践](../standards/go/best-practices.md)
- [错误示例](../standards/go/anti-patterns.md)
