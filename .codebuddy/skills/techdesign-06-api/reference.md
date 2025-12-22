# API接口设计参考

## RESTful核心概念

### HTTP方法语义
- **GET**：查询资源（幂等、安全）
- **POST**：创建资源（非幂等）
- **PUT**：全量更新资源（幂等）
- **PATCH**：部分更新资源（非幂等）
- **DELETE**：删除资源（幂等）

### HTTP状态码
```
2xx 成功
200 OK - 成功
201 Created - 创建成功
204 No Content - 删除成功

4xx 客户端错误
400 Bad Request - 参数错误
401 Unauthorized - 未认证
403 Forbidden - 无权限
404 Not Found - 资源不存在
409 Conflict - 资源冲突
422 Unprocessable Entity - 业务逻辑错误
429 Too Many Requests - 请求过多

5xx 服务器错误
500 Internal Server Error - 服务器错误
503 Service Unavailable - 服务不可用
```

---

## 常用模式

### 统一响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "timestamp": 1704067200000,
  "requestId": "abc123"
}
```

### 分页响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 错误响应
```json
{
  "code": 100001,
  "message": "参数验证失败",
  "details": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": 1704067200000,
  "requestId": "abc123"
}
```

---

## Spring Boot 注解

### 请求映射
```java
@RestController
@RequestMapping("/users")
public class UserController {
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) { }
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest request) { }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequest request) { }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) { }
}
```

### 参数验证
```java
public class CreateUserRequest {
    @NotNull(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度3-20")
    private String username;
    
    @NotNull(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotNull(message = "密码不能为空")
    @Size(min = 8, max = 20, message = "密码长度8-20")
    private String password;
}
```

### 全局异常处理
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        // 参数验证失败
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        // 业务异常
    }
}
```

---

## 相关文档
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md)
- [RESTful API设计指南](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
