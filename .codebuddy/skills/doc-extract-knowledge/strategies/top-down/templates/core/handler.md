# Handler处理器索引

> **覆盖范围**: `{{BASE_PACKAGE}}.handler`  
> **文件总数**: {{HANDLER_COUNT}}个  
> **代码总行数**: {{HANDLER_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
handler/
├── GlobalExceptionHandler - 全局异常处理
├── UserEventHandler - 用户事件处理
└── ...
```

### 按类型分类
| 类型 | Handler数量 | 用途 |
|------|------------|------|
| 异常处理 | 1 | 统一异常响应 |
| 事件处理 | 1 | 业务事件处理 |

---

## 二、详细清单

### GlobalExceptionHandler - 全局异常处理

**路径**: `com.company.project.handler.GlobalExceptionHandler`  
**注解**: `@RestControllerAdvice`

| 方法签名 | 异常类型 | 返回值 | 功能说明 |
|---------|---------|--------|----------|
| `handleBusinessException(BusinessException e)` | BusinessException | `Result<Void>` | 业务异常处理 |
| `handleValidationException(MethodArgumentNotValidException e)` | MethodArgumentNotValidException | `Result<Void>` | 参数校验异常 |
| `handleException(Exception e)` | Exception | `Result<Void>` | 兜底异常处理 |

---

## 📚 相关文档

- [HTTP API索引](./service-api-http.md)
- [Common公共类索引](./common.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
