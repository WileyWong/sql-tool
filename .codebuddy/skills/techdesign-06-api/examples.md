# API接口设计示例

## 示例1：用户管理API

### 场景
设计用户CRUD接口，包括注册、登录、查询、更新、删除。

### 接口设计

```http
# 用户注册
POST /users
Content-Type: application/json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}

# 用户登录
POST /users/login
{
  "username": "john",
  "password": "secret123"
}

# 获取用户列表
GET /users?page=1&size=20&status=ACTIVE&sort=createdAt,desc

# 获取单个用户
GET /users/{id}

# 更新用户
PUT /users/{id}
{
  "email": "newemail@example.com",
  "phone": "13800138000"
}

# 删除用户
DELETE /users/{id}
```

### 响应示例

```json
// 成功响应（201 Created）
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

// 列表响应（200 OK）
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {"id": 1, "username": "john", ...},
      {"id": 2, "username": "jane", ...}
    ],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}

// 错误响应（400 Bad Request）
{
  "code": 100001,
  "message": "参数验证失败",
  "details": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

### 关键点
- 路径使用名词复数（`/users`）
- HTTP方法语义正确（GET查询、POST创建、PUT更新、DELETE删除）
- 统一响应格式（code/message/data）
- 分页、过滤、排序支持

---

## 示例2：订单管理API

### 场景
设计订单接口，包括创建订单、查询订单、取消订单。

### 接口设计

```http
# 创建订单
POST /orders
{
  "userId": 123,
  "items": [
    {"productId": 456, "quantity": 2, "price": 99.99}
  ],
  "shippingAddress": {
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "street": "科技园"
  }
}

# 查询订单列表
GET /orders?userId=123&status=PAID&page=1&size=20

# 查询单个订单
GET /orders/{id}

# 取消订单
POST /orders/{id}/cancel
{
  "reason": "不想要了"
}
```

### DTO设计

```java
// 请求DTO
public class CreateOrderRequest {
    @NotNull(message = "用户ID不能为空")
    private Long userId;
    
    @NotEmpty(message = "订单项不能为空")
    @Valid
    private List<OrderItemRequest> items;
    
    @NotNull(message = "收货地址不能为空")
    @Valid
    private ShippingAddressRequest shippingAddress;
}

// 响应DTO
public class OrderResponse {
    private Long id;
    private Long userId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private ShippingAddressResponse shippingAddress;
    private LocalDateTime createdAt;
}
```

### 错误码设计

```
200001 - 订单ID不能为空
200101 - 库存不足
200102 - 订单不能取消
200103 - 订单不存在
```

### 关键点
- 嵌套资源（`/orders/{id}/cancel`）
- DTO验证规则完整
- 业务错误码清晰（200xxx为订单模块）
- 金额使用BigDecimal
