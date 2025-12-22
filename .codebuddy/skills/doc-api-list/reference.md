# API 文档生成参考手册

## 1. RESTful API 设计规范

### 1.1 资源命名规范

**核心原则**:
- 使用名词复数表示资源集合
- 使用小写字母和连字符（kebab-case）
- 路径层级清晰，不超过 3 层
- 避免使用动词

**示例**:

✅ **推荐**:
```
GET    /api/users                    # 获取用户列表
POST   /api/users                    # 创建用户
GET    /api/users/{id}               # 获取用户详情
PUT    /api/users/{id}               # 更新用户
DELETE /api/users/{id}               # 删除用户
GET    /api/users/{id}/orders        # 获取用户的订单列表
GET    /api/users/{id}/orders/{oid}  # 获取用户的特定订单
```

❌ **不推荐**:
```
GET    /api/getUsers                 # 使用动词
POST   /api/createUser               # 使用动词
GET    /api/user/{id}                # 使用单数
GET    /api/User/{id}                # 使用大写
DELETE /api/users/delete/{id}        # 路径中包含动词
```

### 1.2 HTTP 方法语义

| HTTP 方法 | 用途 | 是否幂等 | 示例 |
|-----------|------|----------|------|
| GET | 查询资源 | 是 | `GET /api/users` |
| POST | 创建资源 | 否 | `POST /api/users` |
| PUT | 更新资源（完整替换） | 是 | `PUT /api/users/{id}` |
| PATCH | 更新资源（部分更新） | 否 | `PATCH /api/users/{id}` |
| DELETE | 删除资源 | 是 | `DELETE /api/users/{id}` |

### 1.3 HTTP 状态码规范

**成功响应**:
- `200 OK` - 请求成功（GET、PUT、PATCH）
- `201 Created` - 创建成功（POST）
- `204 No Content` - 删除成功（DELETE）

**客户端错误**:
- `400 Bad Request` - 参数验证失败
- `401 Unauthorized` - 未认证（缺少或无效的认证凭据）
- `403 Forbidden` - 无权限（已认证但权限不足）
- `404 Not Found` - 资源不存在
- `409 Conflict` - 资源冲突（如用户名已存在）

**服务端错误**:
- `500 Internal Server Error` - 服务器内部错误

### 1.4 版本控制

**方法 1: URL 路径版本**（推荐）
```
/api/v1/users
/api/v2/users
```

**方法 2: 请求头版本**
```
GET /api/users
Accept: application/vnd.api+json;version=1
```

---

## 2. Spring Boot 注解参考

### 2.1 Controller 注解

**@RestController**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    // 自动将返回值序列化为 JSON
}
```

**@Controller** + **@ResponseBody**:
```java
@Controller
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    @ResponseBody
    public List<User> getUsers() {
        // 返回 JSON
    }
}
```

### 2.2 路径映射注解

**@RequestMapping**（通用映射）:
```java
@RequestMapping(value = "/users", method = RequestMethod.GET)
public ResponseEntity<List<User>> getUsers() { }
```

**@GetMapping**、**@PostMapping** 等（推荐）:
```java
@GetMapping("/users")
public ResponseEntity<List<User>> getUsers() { }

@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody UserCreateRequest request) { }

@PutMapping("/users/{id}")
public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) { }

@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) { }

@PatchMapping("/users/{id}")
public ResponseEntity<User> patchUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) { }
```

### 2.3 参数注解

**@PathVariable**（路径变量）:
```java
@GetMapping("/users/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) { }

@GetMapping("/users/{userId}/orders/{orderId}")
public ResponseEntity<Order> getOrder(
    @PathVariable Long userId,
    @PathVariable Long orderId
) { }
```

**@RequestParam**（查询参数）:
```java
@GetMapping("/users")
public ResponseEntity<Page<User>> getUsers(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(required = false) String keyword
) { }
```

**@RequestBody**（请求体）:
```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest request) { }
```

**@RequestHeader**（请求头）:
```java
@GetMapping("/users")
public ResponseEntity<List<User>> getUsers(
    @RequestHeader("X-Auth-Token") String token
) { }
```

### 2.4 认证和权限注解

**@PreAuthorize**（方法级权限控制）:
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) { }

@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@GetMapping("/users/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) { }

@PreAuthorize("hasAuthority('user:read')")
@GetMapping("/users")
public ResponseEntity<List<User>> getUsers() { }
```

**@Secured**（角色控制）:
```java
@Secured("ROLE_ADMIN")
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) { }
```

**@RolesAllowed**（JSR-250 标准）:
```java
@RolesAllowed("ADMIN")
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) { }
```

### 2.5 验证注解

**Bean Validation 注解**:
```java
public class UserCreateRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在 3-20 之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    private String username;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 32, message = "密码长度必须在 8-32 之间")
    private String password;
    
    @Min(value = 1, message = "年龄必须大于 0")
    @Max(value = 150, message = "年龄必须小于 150")
    private Integer age;
}
```

---

## 3. DTO 属性文档化规范

### 3.1 内联 JSON 示例格式

**用途**: 在接口详情中展示 DTO 属性

**格式**:
```json
{
  "fieldName": "value",          // Type, 必需/可选, 说明, 验证规则
  "nestedObject": {              // Object, 必需/可选, 嵌套对象说明
    "subField": "value"          // Type, 必需/可选, 字段说明
  },
  "enumField": "VALUE",          // String, 必需/可选, 枚举说明, 可选值: VALUE1/VALUE2/VALUE3
  "listField": [...]             // List<Type>, 必需/可选, 列表说明
}
```

**示例**:
```json
{
  "username": "john_doe",        // String, 必需, 用户名, 3-20个字符, 只能包含字母数字下划线
  "email": "john@example.com",   // String, 必需, 邮箱地址, 必须是有效的邮箱格式
  "age": 25,                     // Integer, 可选, 年龄, 范围1-150
  "roles": ["USER"],             // List<String>, 可选, 角色列表, 可选值: USER/ADMIN/GUEST
  "address": {                   // Object, 可选, 地址信息
    "city": "New York",          // String, 必需, 城市
    "zipCode": "10001"           // String, 必需, 邮政编码, 格式: 5位数字
  }
}
```

### 3.2 表格形式格式

**用途**: 在数据模型章节提供完整的字段定义

**格式**:
| 字段 | 类型 | 必需 | 说明 | 验证规则 | 示例值 |
|------|------|------|------|----------|--------|
| fieldName | Type | ✅/❌ | 字段说明 | 验证注解 | 示例值 |

**示例**:
| 字段 | 类型 | 必需 | 说明 | 验证规则 | 示例值 |
|------|------|------|------|----------|--------|
| username | String | ✅ | 用户名 | @NotBlank, @Size(min=3, max=20), @Pattern(regexp="^[a-zA-Z0-9_]+$") | "john_doe" |
| email | String | ✅ | 邮箱地址 | @NotBlank, @Email | "john@example.com" |
| age | Integer | ❌ | 年龄 | @Min(1), @Max(150) | 25 |
| roles | List<String> | ❌ | 角色列表 | 枚举值: USER, ADMIN, GUEST | ["USER"] |

### 3.3 嵌套对象展示规范

**在 JSON 示例中**:
- 使用缩进展示层级关系
- 每层嵌套使用 2 个空格缩进
- 最多展示 3 层嵌套

**在表格中**:
- 嵌套对象单独列出字段定义
- 使用标题标识嵌套对象名称
- 在父对象表格中标注 @Valid

**示例**:
```markdown
### UserCreateRequest

| 字段 | 类型 | 必需 | 说明 | 验证规则 |
|------|------|------|------|----------|
| username | String | ✅ | 用户名 | @NotBlank |
| address | Address | ❌ | 地址信息 | @Valid |

#### Address（嵌套对象）

| 字段 | 类型 | 必需 | 说明 | 验证规则 |
|------|------|------|------|----------|
| city | String | ✅ | 城市 | @NotBlank |
| zipCode | String | ✅ | 邮政编码 | @Pattern(regexp="^\\d{5}$") |
```

### 3.4 枚举类型展示规范

**在 JSON 注释中**:
```json
{
  "status": "PENDING"            // String, 必需, 订单状态, 可选值: PENDING/PAID/SHIPPED/COMPLETED/CANCELLED
}
```

**在数据模型章节**:
```markdown
### 枚举类型

#### OrderStatus（订单状态）

| 枚举值 | 说明 |
|--------|------|
| PENDING | 待支付 |
| PAID | 已支付 |
| SHIPPED | 已发货 |
| COMPLETED | 已完成 |
| CANCELLED | 已取消 |
```

## 4. API 文档模板

### 4.1 完整文档模板

```markdown
---
title: {项目名称} API 接口文档
description: {项目名称} 中所有 REST API 接口的完整文档
created_at: {日期}
updated_at: {日期}
version: 1.0
code_version: {代码版本/Git Commit}
---

# {项目名称} API 接口文档

## 📖 概述

本文档包含 {项目名称} 中所有 REST API 接口的定义、参数、返回值和使用场景。

**文档用途**:
- 快速查找 API 接口定义
- 前后端对齐接口规范
- 新人快速了解系统的 API 结构
- API 治理和接口规范检查

**接口统计**:
- 总接口数量: {数量}
- Controller 数量: {数量}
- 涉及模块: {模块列表}

**最后更新**: {日期}  
**代码版本**: {Git Commit/版本号}

---

## 🔐 认证说明

### 全局认证策略

除特别说明外，所有接口均需要 JWT 认证。

**认证方式**: Bearer Token

**请求头格式**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 公开接口（无需认证）

以下接口无需认证即可访问：
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册
- GET /api/health - 健康检查

### 权限说明

部分接口需要特定角色或权限：
- **ADMIN** - 管理员权限
- **USER** - 普通用户权限
- **GUEST** - 访客权限

具体接口的认证和权限要求请参考接口详情中的说明。

---

## 📑 接口目录

{按模块分类的目录索引}

---

## 📋 接口详细清单

### {模块名称}

#### {ControllerName}

**基础路径**: `/api/{resource}`

| 方法 | 路径 | 功能说明 | 请求参数 | 返回类型 |
|------|------|---------|---------|---------|
| {HTTP方法} | {完整路径} | {功能说明} | {参数} | {返回类型} |

---

#### {接口序号}. {接口名称}

**认证**: {认证要求说明，如：@PreAuthorize("hasRole('ADMIN')") 或 无需认证（公开接口）}

**请求**:
\`\`\`http
{HTTP方法} {路径}
Content-Type: application/json
Authorization: Bearer {token}

{请求体 JSON}
\`\`\`

**参数说明**:
- `{参数名}` ({类型}, {必需/可选}, 默认: {默认值}) - {描述}

**成功响应**:
\`\`\`http
HTTP/1.1 {状态码} {状态描述}
Content-Type: application/json

{响应体 JSON}
\`\`\`

**错误响应**:
\`\`\`http
HTTP/1.1 {状态码} {状态描述}
Content-Type: application/json

{错误响应 JSON}
\`\`\`

---

## 📊 接口统计分析

### 按模块统计
- {模块名}: {数量} 个接口

### 按 HTTP 方法统计
- GET: {数量} 个接口
- POST: {数量} 个接口
- PUT: {数量} 个接口
- DELETE: {数量} 个接口

### 按认证要求统计
- 需要认证: {数量} 个接口
- 无需认证: {数量} 个接口

---

## 🔍 接口规范检查

### ✅ 符合规范的接口
- {检查项}

### ⚠️ 待改进项
- {改进建议}

---

## 📋 错误码定义

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| {错误码} | {状态码} | {说明} |

---

## 🔧 使用建议

### 快速查找接口
{建议内容}

### 前后端对齐
{建议内容}

### API 测试
{建议内容}

---

**文档版本**: 1.0  
**生成时间**: {日期}  
**代码版本**: {Git Commit/版本号}  
**维护人**: {团队名称}
```

### 3.2 接口表格模板

```markdown
| 方法 | 路径 | 功能说明 | 请求参数 | 返回类型 |
|------|------|---------|---------|---------|
| POST | `/api/users` | 创建用户 | UserDTO | User |
| GET | `/api/users` | 获取用户列表 | page, size | Page<User> |
| GET | `/api/users/{id}` | 获取用户详情 | id | User |
| PUT | `/api/users/{id}` | 更新用户信息 | id, UserDTO | User |
| DELETE | `/api/users/{id}` | 删除用户 | id | Void |
```

**说明**: 接口表格不包含【认证】列，认证信息在接口详情中说明。

### 3.3 接口详情模板

```markdown
#### {接口序号}. {接口名称}

**认证**: {认证要求说明，如：@PreAuthorize("hasRole('ADMIN')") 或 无需认证（公开接口）}

**请求**:
\`\`\`http
{HTTP方法} {路径}
Content-Type: application/json
Authorization: Bearer {token}

{请求体 JSON}
\`\`\`

**参数说明**:
- `{参数名}` ({类型}, {必需/可选}, 默认: {默认值}) - {描述}

**成功响应**:
\`\`\`http
HTTP/1.1 {状态码} {状态描述}
Content-Type: application/json

{响应体 JSON}
\`\`\`

**错误响应**:
\`\`\`http
HTTP/1.1 {状态码} {状态描述}
Content-Type: application/json

{错误响应 JSON}
\`\`\`
```

---

## 4. 参数文档规范

### 4.1 基础参数文档

```markdown
**参数说明**:
- `username` (string, 必需) - 用户名，3-20 个字符，只能包含字母、数字和下划线
- `email` (string, 必需) - 邮箱地址，必须是有效的邮箱格式
- `age` (integer, 可选, 默认: 18) - 年龄，范围 1-150
- `roles` (array[string], 可选) - 角色列表，可选值: USER, ADMIN, GUEST
```

### 4.2 分页参数文档

```markdown
**分页参数**:
- `page` (integer, 可选, 默认: 1) - 页码，从 1 开始
- `size` (integer, 可选, 默认: 20) - 每页数量，范围 1-100
- `sort` (string, 可选) - 排序字段，格式: `field,direction`，例如 `createdAt,desc`
```

### 4.3 过滤参数文档

```markdown
**过滤参数**:
- `status` (string, 可选) - 订单状态，可选值: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
- `startDate` (string, 可选) - 开始日期，格式: yyyy-MM-dd
- `endDate` (string, 可选) - 结束日期，格式: yyyy-MM-dd
- `keyword` (string, 可选) - 搜索关键词，匹配用户名或邮箱
```

---

## 5. 响应格式规范

### 5.1 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": { },
  "timestamp": 1704067200000
}
```

### 5.2 分页响应格式

```json
{
  "content": [...],
  "page": 1,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

### 5.3 错误响应格式

```json
{
  "code": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": {
    "username": "用户名长度必须在 3-20 个字符之间"
  },
  "timestamp": 1704067200000
}
```

---

## 6. 错误码设计规范

### 6.1 错误码命名规范

**格式**: `UPPER_SNAKE_CASE`

**示例**:
- `VALIDATION_ERROR` - 参数验证失败
- `DUPLICATE_USERNAME` - 用户名已存在
- `USER_NOT_FOUND` - 用户不存在
- `UNAUTHORIZED` - 未认证
- `FORBIDDEN` - 无权限
- `INTERNAL_ERROR` - 服务器内部错误

### 6.2 错误码分类

**验证错误** (400):
- `VALIDATION_ERROR` - 参数验证失败
- `INVALID_FORMAT` - 格式不正确
- `MISSING_PARAMETER` - 缺少必需参数

**权限错误** (401, 403):
- `UNAUTHORIZED` - 未认证
- `FORBIDDEN` - 无权限
- `TOKEN_EXPIRED` - Token 已过期
- `INVALID_TOKEN` - Token 无效

**资源错误** (404, 409):
- `USER_NOT_FOUND` - 用户不存在
- `ORDER_NOT_FOUND` - 订单不存在
- `DUPLICATE_USERNAME` - 用户名已存在
- `DUPLICATE_EMAIL` - 邮箱已被使用

**业务错误** (400):
- `INSUFFICIENT_BALANCE` - 余额不足
- `INVALID_ORDER_STATUS` - 订单状态无效
- `PRODUCT_OUT_OF_STOCK` - 商品缺货

**服务器错误** (500):
- `INTERNAL_ERROR` - 服务器内部错误
- `SERVICE_UNAVAILABLE` - 服务不可用
- `DATABASE_ERROR` - 数据库错误

---

## 7. 自动化脚本

### 7.1 扫描接口列表脚本

```bash
#!/bin/bash
# extract-api-list.sh

echo "正在扫描 API 接口..."

# 扫描所有 Controller 类
echo "1. 扫描 Controller 类..."
rg "@RestController|@Controller" --type java -A 20 > api-controllers.txt

# 扫描所有 HTTP 方法注解
echo "2. 扫描 HTTP 方法..."
rg "@(Get|Post|Put|Delete|Patch)Mapping" --type java -A 10 > api-methods.txt

# 扫描 RequestMapping
echo "3. 扫描 RequestMapping..."
rg "@RequestMapping" --type java -A 5 > api-request-mappings.txt

# 统计接口数量
echo "4. 统计接口数量..."
echo "Controller 数量: $(rg "@RestController|@Controller" --type java -c | wc -l)"
echo "接口方法数量: $(rg "@(Get|Post|Put|Delete|Patch)Mapping" --type java -c | wc -l)"

echo "接口列表已导出到当前目录"
```

### 7.2 检查命名规范脚本

```bash
#!/bin/bash
# check-api-naming.sh

echo "检查 API 命名规范..."

# 查找使用动词的接口（不推荐）
echo "❌ 不推荐的命名（使用动词）:"
rg "@RequestMapping\(\"/api/(get|create|update|delete)" --type java

# 查找推荐的命名
echo "✅ 推荐的命名（使用复数名词）:"
rg "@RequestMapping\(\"/api/(users|orders|products)" --type java

echo "检查完成"
```

### 7.3 分析接口参数脚本

```bash
#!/bin/bash
# analyze-api-params.sh

echo "正在分析接口参数..."

# 查找 @RequestBody 参数
echo "1. RequestBody 参数:"
rg "@RequestBody" --type java -A 2

# 查找 @RequestParam 参数
echo "2. RequestParam 参数:"
rg "@RequestParam" --type java -A 2

# 查找 @PathVariable 参数
echo "3. PathVariable 参数:"
rg "@PathVariable" --type java -A 2

# 查找返回值类型
echo "4. 返回值类型:"
rg "ResponseEntity<" --type java

echo "分析完成"
```

---

## 8. 常见问题和解决方案

### Q1: 如何处理复杂的嵌套参数？

**A**: 使用 DTO 类定义嵌套结构，并在文档中清晰展示层级关系。

```markdown
**参数说明**:
- `shippingAddress` (object, 必需) - 收货地址
  - `street` (string, 必需) - 街道地址
  - `city` (string, 必需) - 城市
  - `zipCode` (string, 必需) - 邮政编码
```

### Q2: 如何文档化可选的查询参数？

**A**: 明确标注"可选"和默认值。

```markdown
**参数说明**:
- `keyword` (string, 可选) - 搜索关键词，匹配用户名或邮箱
- `page` (integer, 可选, 默认: 1) - 页码，从 1 开始
```

### Q3: 如何处理多种响应格式？

**A**: 分别列出成功响应和错误响应，并注明 HTTP 状态码。

```markdown
**成功响应** (200 OK):
\`\`\`json
{ "id": 1, "username": "john_doe" }
\`\`\`

**错误响应** (400 Bad Request):
\`\`\`json
{ "code": "VALIDATION_ERROR", "message": "参数验证失败" }
\`\`\`
```

### Q4: 如何文档化需要认证的接口？

**A**: 在文档开头的"认证说明"章节统一说明全局认证策略，在接口详情中说明具体的认证和权限要求。

```markdown
## 🔐 认证说明

除特别说明外，所有接口均需要 JWT 认证。

### 公开接口（无需认证）
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册

---

#### 1. 删除用户

**认证**: @PreAuthorize("hasRole('ADMIN')")

**请求**:
\`\`\`http
DELETE /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`
```

### Q5: 如何保持文档与代码同步？

**A**: 
1. 在文档中添加生成时间和代码版本
2. 定期重新生成文档（如每次发布前）
3. 在 CI/CD 流程中添加文档生成步骤
4. 使用代码注释自动生成文档（如 OpenAPI 规范）

---

## 9. 相关资源

### 官方文档
- [Spring Boot 3 Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Web MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [Bean Validation](https://beanvalidation.org/)

### 设计指南
- [RESTful API Design Guide](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

### 工具
- [Postman](https://www.postman.com/) - API 测试工具
- [Apifox](https://www.apifox.cn/) - API 设计、测试、文档一体化工具
- [OpenAPI Tools](https://openapi.tools/) - API 文档生成工具
