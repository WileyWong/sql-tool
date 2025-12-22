# API 文档生成示例

## 示例 1: 用户管理模块 API 文档

### 扫描结果

**Controller**: `UserController.java`

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest request) {
        // 实现代码
    }
    
    @GetMapping
    public ResponseEntity<Page<User>> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String keyword
    ) {
        // 实现代码
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // 实现代码
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        // 实现代码
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // 实现代码
    }
}
```

### 生成的文档

```markdown
# API 接口文档

## 📖 概述

本文档包含用户管理系统中所有 REST API 接口的定义、参数、返回值和使用场景。

**接口统计**:
- 总接口数量: 5
- Controller 数量: 1
- 涉及模块: 用户管理

**最后更新**: 2025-11-10  
**代码版本**: v1.0.0

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
- POST /api/users - 创建用户（注册）
- GET /api/users - 获取用户列表
- GET /api/users/{id} - 获取用户详情

### 权限说明

部分接口需要特定角色或权限：
- **ADMIN** - 管理员权限（更新、删除用户）

---

## 📦 统一响应格式

### 成功响应格式

所有接口的成功响应均遵循以下格式：

```json
{
  "code": 0,             // Integer, 状态码, 0表示成功
  "message": "success",  // String, 响应消息
  "data": {}             // Object/Array, 业务数据, 具体结构见各接口说明
}
```

### 错误响应格式

所有接口的错误响应均遵循以下格式：

```json
{
  "code": "VALIDATION_ERROR",  // String, 错误码
  "message": "参数验证失败",      // String, 错误消息
  "details": {                 // Object, 可选, 详细错误信息
    "username": "用户名长度必须在 3-20 个字符之间"
  },
  "timestamp": 1704067200000   // Long, 时间戳
}
```

### 分页响应格式

分页接口的 `data` 字段结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "content": [...],      // Array, 当前页数据
    "page": 1,             // Integer, 当前页码
    "size": 20,            // Integer, 每页数量
    "totalElements": 100,  // Integer, 总记录数
    "totalPages": 5        // Integer, 总页数
  }
}
```

---

## 📑 接口目录

1. [用户管理模块](#用户管理模块)
   - [创建用户](#创建用户)
   - [获取用户列表](#获取用户列表)
   - [获取用户详情](#获取用户详情)
   - [更新用户信息](#更新用户信息)
   - [删除用户](#删除用户)

---

## 📋 接口详细清单

### 用户管理模块

#### UserController

**基础路径**: `/api/users`

| 方法 | 路径 | 功能说明 | 请求参数 | 返回类型 |
|------|------|---------|---------|---------|
| POST | `/api/users` | 创建用户 | UserCreateRequest | User |
| GET | `/api/users` | 获取用户列表 | page, size, keyword | Page<User> |
| GET | `/api/users/{id}` | 获取用户详情 | id | User |
| PUT | `/api/users/{id}` | 更新用户信息 | id, UserUpdateRequest | User |
| DELETE | `/api/users/{id}` | 删除用户 | id | Void |

---

#### 1. 创建用户

**认证**: 无需认证（公开接口）

**请求**:
\`\`\`http
POST /api/users
Content-Type: application/json
\`\`\`

**请求参数**:
- **Body** (RequestBody, 必需): `UserCreateRequest`
  ```json
  {
    "username": "john_doe",        // String, 必需, 用户名, 3-20个字符, 只能包含字母数字下划线
    "email": "john@example.com",   // String, 必需, 邮箱地址, 必须是有效的邮箱格式
    "password": "securePassword123", // String, 必需, 密码, 至少8个字符
    "roles": ["USER"]              // List<String>, 可选, 角色列表, 默认: ["USER"], 可选值: USER/ADMIN/GUEST
  }
  ```

**返回值**: `ResponseEntity<User>` - 返回创建的用户信息

**成功响应**:
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json
\`\`\`

```json
{
  "code": 0,                     // Integer, 状态码, 0表示成功
  "message": "success",          // String, 响应消息
  "data": {                      // Object, 业务数据
    "id": 1,                     // Long, 用户ID
    "username": "john_doe",      // String, 用户名
    "email": "john@example.com", // String, 邮箱地址
    "roles": ["USER"],           // List<String>, 角色列表
    "createdAt": "2025-11-10T10:00:00Z"  // String, 创建时间, ISO 8601格式
  }
}
```

**错误响应**:
\`\`\`http
HTTP/1.1 400 Bad Request
Content-Type: application/json
\`\`\`

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

#### 2. 获取用户列表

**认证**: 无需认证（公开接口）

**请求**:
\`\`\`http
GET /api/users?page=1&size=20&keyword=john
\`\`\`

**参数说明**:
- `page` (integer, 可选, 默认: 1) - 页码，从 1 开始
- `size` (integer, 可选, 默认: 20) - 每页数量，范围 1-100
- `keyword` (string, 可选) - 搜索关键词，匹配用户名或邮箱

**成功响应**:
\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
\`\`\`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "roles": ["USER"],
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ],
    "page": 1,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

---

## 📊 接口统计分析

### 按模块统计
- 用户管理模块: 5 个接口

### 按 HTTP 方法统计
- GET: 2 个接口
- POST: 1 个接口
- PUT: 1 个接口
- DELETE: 1 个接口

### 按认证要求统计
- 需要认证: 2 个接口（ADMIN）
- 无需认证: 3 个接口

---

## 🔍 接口规范检查

### ✅ 符合规范的接口
- 使用名词复数表示资源（/users）
- HTTP 方法使用正确
- 路径层级清晰（不超过 2 层）
- 认证和权限要求明确

### ⚠️ 待改进项
- 无

---

## 📋 错误码定义

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| VALIDATION_ERROR | 400 | 参数验证失败 |
| DUPLICATE_USERNAME | 409 | 用户名已存在 |
| DUPLICATE_EMAIL | 409 | 邮箱已被使用 |
| USER_NOT_FOUND | 404 | 用户不存在 |
| UNAUTHORIZED | 401 | 未认证 |
| FORBIDDEN | 403 | 无权限 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## 🔧 使用建议

### 快速查找接口
1. 使用目录索引快速定位模块
2. 使用 Ctrl+F 搜索关键词
3. 查看接口表格了解概况

### 前后端对齐
1. 确认接口路径和方法
2. 确认请求参数和返回值结构
3. 确认错误码和错误处理
4. 使用 Postman/Apifox 导入测试

### API 测试
1. 使用 Postman/Apifox 导入接口
2. 参考示例构造请求
3. 验证成功和错误响应
4. 编写自动化测试用例

---

**文档版本**: 1.0  
**生成时间**: 2025-11-10T10:00:00Z  
**代码版本**: v1.0.0  
**维护人**: 开发团队
```

---

## 示例 2: 订单管理模块 API 文档

### 扫描结果

**Controller**: `OrderController.java`

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        // 实现代码
    }
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<Order>> getOrders(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String sort
    ) {
        // 实现代码
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        // 实现代码
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
        @PathVariable Long id,
        @RequestParam String status
    ) {
        // 实现代码
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        // 实现代码
    }
}
```

### 生成的文档片段

```markdown
### 订单管理模块

#### OrderController

**基础路径**: `/api/orders`

| 方法 | 路径 | 功能说明 | 请求参数 | 返回类型 |
|------|------|---------|---------|---------|
| POST | `/api/orders` | 创建订单 | OrderCreateRequest | Order |
| GET | `/api/orders` | 获取订单列表 | page, size, status, sort | Page<Order> |
| GET | `/api/orders/{id}` | 获取订单详情 | id | Order |
| PUT | `/api/orders/{id}/status` | 更新订单状态 | id, status | Order |
| DELETE | `/api/orders/{id}` | 取消订单 | id | Void |

---

#### 1. 创建订单

**认证**: @PreAuthorize("hasRole('USER')")

**请求**:
\`\`\`http
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": 1,
  "items": [
    {
      "productId": 101,
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
\`\`\`

**参数说明**:
- `userId` (integer, 必需) - 用户 ID
- `items` (array[object], 必需) - 订单项列表，至少包含 1 个项
  - `productId` (integer, 必需) - 商品 ID
  - `quantity` (integer, 必需) - 数量，范围 1-999
  - `price` (number, 必需) - 单价
- `shippingAddress` (object, 必需) - 收货地址
  - `street` (string, 必需) - 街道地址
  - `city` (string, 必需) - 城市
  - `zipCode` (string, 必需) - 邮政编码

**成功响应**:
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json
\`\`\`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1001,
    "userId": 1,
    "items": [
      {
        "productId": 101,
        "productName": "Product A",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "totalAmount": 199.98,
    "status": "PENDING",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "createdAt": "2025-11-10T10:00:00Z"
  }
}
```

**错误响应**:
\`\`\`http
HTTP/1.1 400 Bad Request
Content-Type: application/json
\`\`\`

```json
{
  "code": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": {
    "items": "订单项列表不能为空"
  },
  "timestamp": 1704067200000
}
```

---

#### 2. 获取订单列表

**认证**: @PreAuthorize("hasRole('USER')")

**请求**:
\`\`\`http
GET /api/orders?page=1&size=20&status=PENDING&sort=createdAt,desc
Authorization: Bearer {token}
\`\`\`

**参数说明**:
- `page` (integer, 可选, 默认: 1) - 页码，从 1 开始
- `size` (integer, 可选, 默认: 20) - 每页数量，范围 1-100
- `status` (string, 可选) - 订单状态，可选值: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
- `sort` (string, 可选) - 排序字段，格式: `field,direction`，例如 `createdAt,desc`

**成功响应**:
\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
\`\`\`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1001,
        "userId": 1,
        "totalAmount": 199.98,
        "status": "PENDING",
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ],
    "page": 1,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  }
}
```
```

---

## 示例 3: 自动化脚本使用示例

### 脚本 1: 扫描接口列表

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

# 统计接口数量
echo "3. 统计接口数量..."
echo "Controller 数量: $(rg "@RestController|@Controller" --type java -c | wc -l)"
echo "接口方法数量: $(rg "@(Get|Post|Put|Delete|Patch)Mapping" --type java -c | wc -l)"

echo "接口列表已导出到当前目录"
```

**输出结果**:
```
正在扫描 API 接口...
1. 扫描 Controller 类...
2. 扫描 HTTP 方法...
3. 统计接口数量...
Controller 数量: 2
接口方法数量: 10
接口列表已导出到当前目录
```

### 脚本 2: 检查命名规范

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

**输出结果**:
```
检查 API 命名规范...
❌ 不推荐的命名（使用动词）:
（无结果，说明符合规范）

✅ 推荐的命名（使用复数名词）:
src/main/java/com/example/controller/UserController.java:@RequestMapping("/api/users")
src/main/java/com/example/controller/OrderController.java:@RequestMapping("/api/orders")

检查完成
```

### 脚本 3: 分析接口参数

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

echo "分析完成"
```

**输出结果**:
```
正在分析接口参数...
1. RequestBody 参数:
src/main/java/com/example/controller/UserController.java:    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest request) {

2. RequestParam 参数:
src/main/java/com/example/controller/UserController.java:        @RequestParam(defaultValue = "1") int page,
src/main/java/com/example/controller/UserController.java:        @RequestParam(defaultValue = "20") int size,

3. PathVariable 参数:
src/main/java/com/example/controller/UserController.java:    public ResponseEntity<User> getUserById(@PathVariable Long id) {

分析完成
```

---

## 示例 4: DTO 属性完整展示示例（内联 JSON + 表格形式）

### 场景：订单创建接口的完整文档

#### 接口详情（内联 JSON 示例）

```markdown
##### 1. POST /api/orders

**功能**: 创建订单

**认证**: @PreAuthorize("hasRole('USER')")

**请求参数**:
- **Body** (RequestBody, 必需): `OrderCreateRequest`
  ```json
  {
    "userId": 1,                   // Long, 必需, 用户ID
    "items": [                     // List<OrderItem>, 必需, 订单项列表, 至少包含1个项
      {
        "productId": 101,          // Long, 必需, 商品ID
        "quantity": 2,             // Integer, 必需, 数量, 范围1-999
        "price": 99.99             // BigDecimal, 必需, 单价
      }
    ],
    "shippingAddress": {           // Address, 必需, 收货地址
      "street": "123 Main St",     // String, 必需, 街道地址
      "city": "New York",          // String, 必需, 城市
      "state": "NY",               // String, 必需, 州/省
      "zipCode": "10001",          // String, 必需, 邮政编码, 格式: 5位数字
      "country": "USA"             // String, 可选, 国家, 默认: "USA"
    },
    "paymentMethod": "CREDIT_CARD", // String, 必需, 支付方式, 枚举值: CREDIT_CARD/DEBIT_CARD/PAYPAL/ALIPAY
    "couponCode": "SAVE10",        // String, 可选, 优惠券代码
    "remark": "请尽快发货"          // String, 可选, 备注, 最大长度200字符
  }
  ```

**返回值**: `ResponseEntity<Order>` - 返回创建的订单信息

**成功响应**:
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json
\`\`\`

```json
{
  "code": 0,                       // Integer, 状态码, 0表示成功
  "message": "success",            // String, 响应消息
  "data": {                        // Object, 业务数据
    "id": 1001,                    // Long, 订单ID
    "userId": 1,                   // Long, 用户ID
    "orderNumber": "ORD20251111001", // String, 订单编号
    "items": [                     // List<OrderItemVO>, 订单项列表
      {
        "productId": 101,          // Long, 商品ID
        "productName": "Product A", // String, 商品名称
        "quantity": 2,             // Integer, 数量
        "price": 99.99,            // BigDecimal, 单价
        "subtotal": 199.98         // BigDecimal, 小计
      }
    ],
    "totalAmount": 199.98,         // BigDecimal, 订单总金额
    "discountAmount": 19.99,       // BigDecimal, 折扣金额
    "finalAmount": 179.99,         // BigDecimal, 实付金额
    "status": "PENDING",           // String, 订单状态, 枚举值: PENDING/PAID/SHIPPED/COMPLETED/CANCELLED
    "paymentMethod": "CREDIT_CARD", // String, 支付方式
    "shippingAddress": {           // Address, 收货地址
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2025-11-11T10:00:00Z",  // String, 创建时间, ISO 8601格式
    "updatedAt": "2025-11-11T10:00:00Z"   // String, 更新时间, ISO 8601格式
  }
}
```

**错误响应**:
\`\`\`http
HTTP/1.1 400 Bad Request
Content-Type: application/json
\`\`\`

```json
{
  "code": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": {
    "items": "订单项列表不能为空",
    "shippingAddress.zipCode": "邮政编码格式不正确，必须是5位数字"
  },
  "timestamp": 1704067200000
}
```
```

---

#### 数据模型定义（表格形式）

```markdown
## 📦 数据模型定义

### OrderCreateRequest

**用途**: 创建订单请求参数

| 字段 | 类型 | 必需 | 说明 | 验证规则 | 示例值 |
|------|------|------|------|----------|--------|
| userId | Long | ✅ | 用户ID | @NotNull | 1 |
| items | List<OrderItem> | ✅ | 订单项列表 | @NotEmpty, @Valid | - |
| shippingAddress | Address | ✅ | 收货地址 | @NotNull, @Valid | - |
| paymentMethod | String | ✅ | 支付方式 | @NotBlank, 枚举值 | "CREDIT_CARD" |
| couponCode | String | ❌ | 优惠券代码 | @Size(max=20) | "SAVE10" |
| remark | String | ❌ | 备注 | @Size(max=200) | "请尽快发货" |

#### OrderItem（嵌套对象）

**用途**: 订单项信息

| 字段 | 类型 | 必需 | 说明 | 验证规则 | 示例值 |
|------|------|------|------|----------|--------|
| productId | Long | ✅ | 商品ID | @NotNull | 101 |
| quantity | Integer | ✅ | 数量 | @NotNull, @Min(1), @Max(999) | 2 |
| price | BigDecimal | ✅ | 单价 | @NotNull, @DecimalMin("0.01") | 99.99 |

#### Address（嵌套对象）

**用途**: 地址信息

| 字段 | 类型 | 必需 | 说明 | 验证规则 | 示例值 |
|------|------|------|------|----------|--------|
| street | String | ✅ | 街道地址 | @NotBlank | "123 Main St" |
| city | String | ✅ | 城市 | @NotBlank | "New York" |
| state | String | ✅ | 州/省 | @NotBlank | "NY" |
| zipCode | String | ✅ | 邮政编码 | @NotBlank, @Pattern(regexp="^\\d{5}$") | "10001" |
| country | String | ❌ | 国家 | @Size(max=50) | "USA" |

### Order（返回值）

**用途**: 订单信息

| 字段 | 类型 | 必需 | 说明 | 示例值 |
|------|------|------|------|--------|
| id | Long | ✅ | 订单ID | 1001 |
| userId | Long | ✅ | 用户ID | 1 |
| orderNumber | String | ✅ | 订单编号 | "ORD20251111001" |
| items | List<OrderItemVO> | ✅ | 订单项列表 | - |
| totalAmount | BigDecimal | ✅ | 订单总金额 | 199.98 |
| discountAmount | BigDecimal | ✅ | 折扣金额 | 19.99 |
| finalAmount | BigDecimal | ✅ | 实付金额 | 179.99 |
| status | String | ✅ | 订单状态 | "PENDING" |
| paymentMethod | String | ✅ | 支付方式 | "CREDIT_CARD" |
| shippingAddress | Address | ✅ | 收货地址 | - |
| createdAt | String | ✅ | 创建时间 | "2025-11-11T10:00:00Z" |
| updatedAt | String | ✅ | 更新时间 | "2025-11-11T10:00:00Z" |

### 枚举类型

#### PaymentMethod（支付方式）

| 枚举值 | 说明 |
|--------|------|
| CREDIT_CARD | 信用卡 |
| DEBIT_CARD | 借记卡 |
| PAYPAL | PayPal |
| ALIPAY | 支付宝 |

#### OrderStatus（订单状态）

| 枚举值 | 说明 |
|--------|------|
| PENDING | 待支付 |
| PAID | 已支付 |
| SHIPPED | 已发货 |
| COMPLETED | 已完成 |
| CANCELLED | 已取消 |
```

---

### 关键要点

1. **内联 JSON 示例**：在接口详情中使用，便于快速理解
   - 使用 JSON 注释说明字段类型、必需性、验证规则
   - 使用缩进展示嵌套对象层级关系
   - 列出枚举类型的所有可选值

2. **表格形式**：在数据模型章节使用，提供完整的字段定义
   - 包含字段名、类型、必需性、说明、验证规则、示例值
   - 嵌套对象单独列出字段定义
   - 枚举类型单独列出所有可选值

3. **两种方式结合**：
   - 核心 DTO：两种方式都提供
   - 简单 DTO：只使用内联 JSON 示例
   - 复杂嵌套：在数据模型章节提供完整的表格定义

---

## 示例 5: 统一响应格式文档化

### 场景：项目使用统一响应包装类

假设项目中有以下统一响应包装类：

```java
public class RespEntity<T> {
    private Integer code;
    private String message;
    private T data;
    // getters and setters
}
```

### 文档化示例

```markdown
## 📦 统一响应格式

### 成功响应格式

所有接口的成功响应均遵循以下格式：

\```json
{
  "code": 0,             // Integer, 状态码, 0表示成功
  "message": "success",  // String, 响应消息
  "data": {}             // Object/Array, 业务数据, 具体结构见各接口说明
}
\```

### 错误响应格式

所有接口的错误响应均遵循以下格式：

\```json
{
  "code": "VALIDATION_ERROR",  // String, 错误码
  "message": "参数验证失败",      // String, 错误消息
  "details": {                 // Object, 可选, 详细错误信息
    "username": "用户名长度必须在 3-20 个字符之间"
  },
  "timestamp": 1704067200000   // Long, 时间戳
}
\```

### 分页响应格式

分页接口的 `data` 字段结构：

\```json
{
  "code": 0,
  "message": "success",
  "data": {
    "content": [...],      // Array, 当前页数据
    "page": 1,             // Integer, 当前页码
    "size": 20,            // Integer, 每页数量
    "totalElements": 100,  // Integer, 总记录数
    "totalPages": 5        // Integer, 总页数
  }
}
\```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1xxx | 客户端错误（参数错误、验证失败等） |
| 2xxx | 业务错误（用户名已存在、余额不足等） |
| 5xxx | 服务器错误 |

详细的错误码定义请参考"错误码定义"章节。
```

### 在接口示例中使用统一格式

```markdown
#### 1. 创建用户

**成功响应**:
\```http
HTTP/1.1 201 Created
Content-Type: application/json
\```

\```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
\```

**错误响应**:
\```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
\```

\```json
{
  "code": "VALIDATION_ERROR",
  "message": "参数验证失败",
  "details": {
    "username": "用户名长度必须在 3-20 个字符之间"
  },
  "timestamp": 1704067200000
}
\```
```

### 关键要点

1. **识别统一响应包装类**: 扫描项目中的 RespEntity、Result、ApiResponse 等类
2. **提取字段定义**: 分析 code/status、message、data 等字段
3. **区分成功和错误**: 成功响应和错误响应的结构可能不同
4. **说明状态码规则**: 明确 code 字段的取值规则
5. **在所有示例中使用**: 确保所有接口的响应示例都使用统一格式

---

## 示例 6: 认证说明章节示例

### 场景：项目使用 JWT 认证

```markdown
## 🔐 认证说明

### 全局认证策略

除特别说明外，所有接口均需要 JWT 认证。

**认证方式**: Bearer Token

**请求头格式**:
\```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\```

**获取 Token**:
1. 调用登录接口 `POST /api/auth/login` 获取 Token
2. 在后续请求的 Authorization 请求头中携带 Token

### 公开接口（无需认证）

以下接口无需认证即可访问：
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册
- GET /api/health - 健康检查
- GET /api/docs - API 文档

### 权限说明

部分接口需要特定角色或权限：

| 角色 | 说明 | 权限范围 |
|------|------|----------|
| ADMIN | 管理员 | 所有接口 |
| USER | 普通用户 | 用户相关接口、订单相关接口 |
| GUEST | 访客 | 只读接口 |

具体接口的认证和权限要求请参考接口详情中的说明。

### 认证失败处理

**401 Unauthorized** - 未认证或 Token 无效:
\```json
{
  "code": "UNAUTHORIZED",
  "message": "未认证或 Token 无效",
  "timestamp": 1704067200000
}
\```

**403 Forbidden** - 权限不足:
\```json
{
  "code": "FORBIDDEN",
  "message": "权限不足",
  "timestamp": 1704067200000
}
\```
```

### 在接口详情中说明认证要求

```markdown
#### 1. 删除用户

**认证**: @PreAuthorize("hasRole('ADMIN')")

**请求**:
\```http
DELETE /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\```
```

### 关键要点

1. **全局策略优先**: 在文档开头统一说明默认认证要求
2. **列出例外**: 明确列出所有公开接口
3. **说明认证方式**: 提供认证方式和请求头格式
4. **权限分级**: 说明不同角色的权限范围
5. **错误处理**: 说明认证失败的错误响应
