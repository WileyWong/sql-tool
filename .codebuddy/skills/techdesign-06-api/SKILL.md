---
name: techdesign-06-api
description: 设计RESTful API接口 - 掌握 RESTful API 设计原则，构建直观、可扩展、易维护的 API。包括路径设计、参数定义、响应格式、错误处理和API文档
category: techdesign
keywords: [API设计, RESTful, 接口规范, HTTP方法, 响应格式, 错误处理]
---

# Skill: API接口设计

## 工作流位置

```
techdesign-01 架构设计
    ↓ 输出：架构方案、技术选型
techdesign-02 流程设计（可选）
    ↓ 输出：流程图、状态机
techdesign-03 功能设计
    ↓ 输出：功能规格、用例设计
techdesign-04 实体设计
    ↓ 输出：实体模型、领域模型
techdesign-05 数据库设计 ─┬─ 可并行
techdesign-06 API设计 ← 当前技能 ─┘
    ↓ 输出：DDL、API文档、错误码定义
techdesign-07 交付规划（可选）
```

**上游输入**: 03-feature 功能规格、04-entity 实体模型
**下游使用**: 07-delivery-planning 将使用本技能输出的 API 清单进行工作量评估
**路径选择**: 参见 [techdesign-01-architecture 路径选择指南](mdc:skills/techdesign-01-architecture/SKILL.md)

> ⚠️ **必须遵守的规范内容**: [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

将功能设计转化为可调用的RESTful API接口，包括路径设计、参数定义、响应格式、错误处理和API文档。

## 核心原则（15 秒速查）

1. **资源路径规范** - 名词复数、层级清晰、无动词（如 `/users/{id}/orders`）
2. **HTTP方法正确** - GET查询、POST创建、PUT更新、DELETE删除
3. **统一响应格式** - code/message/data 三段式结构
4. **错误处理完善** - HTTP状态码 + 业务错误码 + 详细信息
5. **分页和过滤** - 列表接口默认分页、支持查询参数过滤
6. **版本管理** - 使用 URL 版本（/api/v1/）或 Header 版本
7. **限流保护** - 防止滥用，保护系统稳定性

## 技能信息

### 文档输出
- 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
- 输出路径: `workspace/{变更ID}/design/api-design.md`
- 只在用户明确要求时生成文档

## 概述

将功能设计转化为可调用的API接口。确保接口易用、规范、安全。生成的接口代码必须参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 遵循当前项目的开发规范和代码风格

**核心原则**: 简单易用，符合规范，向后兼容。

## 何时使用

**触发信号**:
- 功能设计已完成，但不知道如何定义接口
- 数据模型已设计，但不知道用什么HTTP方法
- 团队问"这个接口路径怎么写？"
- 团队问"接口文档怎么写？"
- 团队问"如何设计安全的API？"

**前置条件**:
- ✅ 功能设计已完成
- ✅ 数据模型已设计
- ✅ 业务流程已明确

**何时不用**:
- 只是修改现有接口 → 不需要完整设计流程
- 功能设计不明确 → 先触发技能 `techdesign-03-feature`，完善功能设计，再进行接口设计
- 使用第三方API → 遵循第三方规范

---

## 执行步骤

### 步骤 1: 资源识别和路径设计

**原则**：名词复数 + 层级清晰

```http
# ✅ 推荐
GET    /users              # 用户列表
GET    /users/{id}         # 单个用户
POST   /users              # 创建用户
PUT    /users/{id}         # 更新用户
DELETE /users/{id}         # 删除用户
GET    /users/{id}/orders  # 用户的订单

# ❌ 避免
GET /getUser?id=123        # 动词 + 查询参数
POST /createUser           # 路径包含动词
GET /user                  # 单数形式
```

**资源分组**：
- 按业务模块：用户、订单、商品
- 按访问权限：公开、认证、授权

**验收标准**:
- [ ] 所有资源已识别（≥ 3 个主要资源）
- [ ] 路径使用名词复数（如 `/users` 而非 `/user`）
- [ ] 路径无动词（如 `/users` 而非 `/getUsers`）
- [ ] 层级关系清晰（如 `/users/{id}/orders`）

### 步骤 2: HTTP方法选择

| 方法 | 语义 | 幂等性 | 示例 |
|------|------|--------|------|
| GET | 查询 | 是 | `GET /users/{id}` |
| POST | 创建 | 否 | `POST /users` |
| PUT | 全量更新 | 是 | `PUT /users/{id}` |
| PATCH | 部分更新 | 否 | `PATCH /users/{id}` |
| DELETE | 删除 | 是 | `DELETE /users/{id}` |

**要点**：
- GET 不修改数据，支持缓存
- POST 用于创建
- PUT 需要完整数据，PATCH 只需变更字段

**验收标准**:
- [ ] 每个接口的HTTP方法已明确
- [ ] 查询操作使用GET
- [ ] 创建操作使用POST
- [ ] 更新操作使用PUT或PATCH
- [ ] 删除操作使用DELETE

### 步骤 3: 参数设计

**路径参数**：资源标识
```http
GET /users/{id}/orders/{orderId}
```

**查询参数**：过滤、排序、分页
```http
GET /orders?status=PAID&page=1&size=20&sort=createdAt,desc
```

**请求体**：创建/更新数据
```java
// DTO + 验证
public class CreateOrderRequest {
    @NotNull(message = "用户ID不能为空")
    private Long userId;
    
    @NotEmpty(message = "订单项不能为空")
    @Valid
    private List<OrderItemRequest> items;
}
```

**验收标准**:
- [ ] 路径参数已定义（用于资源标识）
- [ ] 查询参数已定义（用于过滤、排序、分页）
- [ ] 请求体已定义（包含字段、类型、验证规则）
- [ ] 所有参数都有示例

### 步骤 4: 响应设计

**统一格式**：
```json
// 成功
{
  "code": 0,
  "message": "success",
  "data": { ... }
}

// 列表
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

// 错误
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

**数据类型**：
- ID：Long 或 String（UUID）
- 金额：String（避免精度问题）
- 日期时间：ISO 8601（`2024-01-01T00:00:00Z`）
- 枚举：String（大写+下划线，如 `PENDING`）

**验收标准**:
- [ ] 统一响应格式已定义（code/message/data）
- [ ] 成功响应格式已定义
- [ ] 列表响应包含分页信息
- [ ] 错误响应格式已定义
- [ ] 数据类型已统一

### 步骤 5: 错误处理

**HTTP状态码**：
- 200: 成功
- 400: 参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 422: 业务逻辑错误
- 500: 服务器错误

**业务错误码**：
```
格式: 模块码(2位) + 错误类型(2位) + 序号(2位)

示例:
100001 - 用户参数错误
100101 - 用户名已存在
100201 - 登录失败
200101 - 库存不足
```

**全局异常处理**：
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {
        
        List<ErrorDetail> details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new ErrorDetail(
                error.getField(),
                error.getDefaultMessage()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.of(100001, "参数验证失败", details));
    }
}
```

**验收标准**:
- [ ] HTTP状态码已定义（200/400/401/403/404/422/500）
- [ ] 业务错误码已定义（≥ 10 个）
- [ ] 错误信息用户友好、清晰明确
- [ ] 全局异常处理已设计

### 步骤 6: API文档

**每个接口需包含**：
- 路径和方法（如 `POST /users`）
- 请求参数和验证规则
- 请求/响应示例
- 错误码说明

**文档示例**：
```markdown
# 用户管理API

## 接口概述

用户管理API提供用户注册、登录、信息管理等功能。

## 认证方式

根据项目需要选择合适的认证方式（如 Session、Token、OAuth 等），请求头需要包含认证信息。

## 接口列表

### 获取用户列表

**请求**
GET /api/v1/users?page=1&limit=20&sort=desc

**响应**
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "status": "active",
        "created_at": "2025-11-03T10:30:00Z",
        "updated_at": "2025-11-03T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "timestamp": "2025-11-03T10:30:00Z"
}

### 创建用户

**请求**
POST /api/v1/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}

**响应**
{
  "code": 201,
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "status": "active",
    "created_at": "2025-11-03T10:30:00Z",
    "updated_at": "2025-11-03T10:30:00Z"
  },
  "timestamp": "2025-11-03T10:30:00Z"
}
```

**验收标准**:
- [ ] 每个接口都有文档（路径、方法、参数、响应）
- [ ] 提供请求和响应示例
- [ ] 错误码表完整
- [ ] 使用 OpenAPI 规范

---

## ✅ 最佳实践

1. **路径设计要规范** - 名词复数、无动词、层级清晰
2. **响应格式要统一** - 所有接口使用相同的响应结构
3. **错误处理要完善** - HTTP状态码 + 业务错误码 + 详细信息

## ❌ 常见错误

1. **路径使用动词** - `/getUser` 应改为 `GET /users/{id}`
2. **所有操作都用POST** - 应根据操作类型选择正确的HTTP方法
3. **所有错误都返回200** - 应使用正确的HTTP状态码
4. **响应格式不统一** - 成功和失败应使用统一的响应结构

## 🔍 验证清单

### 资源设计检查
- [ ] 资源路径验证（≥ 3 个资源，名词复数，无动词）
- [ ] HTTP方法验证（GET/POST/PUT/DELETE正确使用）
- [ ] 参数设计验证（路径参数、查询参数、请求体完整）

### 响应设计检查
- [ ] 响应格式验证（统一格式、分页支持）
- [ ] 错误处理验证（≥ 10 个错误码，HTTP状态码正确）
- [ ] 数据类型统一（日期ISO8601、金额String）

### 版本管理检查
- [ ] 版本策略已确定（URL/Header）
- [ ] 版本升级原则已定义
- [ ] 废弃接口有通知机制

### 限流设计检查
- [ ] 限流策略已确定
- [ ] 限流维度已定义（全局/用户/IP/接口）
- [ ] 限流响应格式正确（429 + Header）
- [ ] 敏感接口有额外限流（登录、验证码）

### HATEOAS 检查（可选）
- [ ] 响应包含 _links 字段
- [ ] 链接包含可用操作
- [ ] 链接根据状态动态变化

### API文档检查
- [ ] 每个接口都有文档（路径、方法、参数、响应）
- [ ] 提供请求和响应示例
- [ ] 错误码表完整
- [ ] 使用 OpenAPI 规范

### 🚨 红灯信号

遇到以下情况，立即停止并重新设计：

- ❌ **路径使用动词** - `/getUser`、`/createOrder` 应改为 `GET /users/{id}`、`POST /orders`
- ❌ **所有操作都用 POST** - 应根据操作类型选择正确的 HTTP 方法
- ❌ **所有错误都返回 200** - 应使用正确的 HTTP 状态码（400/401/403/404/500）
- ❌ **响应格式不统一** - 成功和失败应使用统一的响应结构（code/message/data）
- ❌ **路径使用单数** - `/user` 应改为 `/users`
- ❌ **缺少版本管理** - API 无版本号，无法平滑升级
- ❌ **错误信息暴露敏感信息** - 如数据库错误、堆栈信息
- ❌ **无限流保护** - 关键接口（登录、验证码）无限流措施
- ❌ **ID 使用自增暴露** - 对外 API 暴露自增 ID，存在安全风险

## 📋 输出要求

### 必须包含

1. **完整的API规范**
   - 基础信息定义
   - 服务器配置
   - 认证方式定义

2. **接口定义**
   - 路径定义
   - HTTP方法
   - 请求参数
   - 响应格式

3. **数据模型**
   - 请求模型
   - 响应模型
   - 错误模型

4. **安全设计**
   - 认证机制
   - 授权机制
   - 安全措施

5. **错误处理**
   - 错误码定义
   - 错误响应格式
   - 错误处理建议

## 🔗 相关技能

- [techdesign-03-feature](mdc:skills/techdesign-03-feature/SKILL.md) - 功能详细设计
- [techdesign-05-database](mdc:skills/techdesign-05-database/SKILL.md) - 数据库设计
- [techdesign-04-entity](mdc:skills/techdesign-04-entity/SKILL.md) - 实体设计（DTO 和 Entity 设计）
- [techdesign-01-architecture](mdc:skills/techdesign-01-architecture/SKILL.md) - 系统架构设计
- [techdesign-02-process](mdc:skills/techdesign-02-process/SKILL.md) - 业务流程设计

## 📖 参考资源

- [Spring Boot 3 官方文档](mdc:global/knowledge/stack/springboot3.md)
- [OpenAPI 3.0 规范](https://spec.openapis.org/oas/v3.0.0)
- [RESTful API 设计指南](https://restfulapi.net/)
- [HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

## API 版本管理

### 版本策略选择

| 策略 | 示例 | 优点 | 缺点 |
|------|------|------|------|
| **URL 版本** | `/api/v1/users` | 直观、易缓存 | URL 变化 |
| **Header 版本** | `Accept: application/vnd.api.v1+json` | URL 不变 | 不直观 |
| **Query 版本** | `/api/users?version=1` | 简单 | 不规范 |

**推荐: URL 版本**

```http
# v1 版本
GET /api/v1/users
GET /api/v1/users/{id}

# v2 版本（新功能或破坏性变更）
GET /api/v2/users
GET /api/v2/users/{id}
```

### 版本升级原则

```markdown
### 何时升级版本

**不需要升级版本（向后兼容）**:
- 新增可选字段
- 新增新接口
- 修复 Bug
- 性能优化

**需要升级版本（破坏性变更）**:
- 删除字段或接口
- 修改字段类型
- 修改字段含义
- 修改响应结构

### 版本生命周期
| 阶段 | 状态 | 说明 |
|------|------|------|
| Current | 活跃 | 当前推荐版本 |
| Deprecated | 废弃 | 仍可用，但不推荐 |
| Sunset | 下线 | 不再可用 |

### 废弃通知
- 废弃前至少 6 个月通知
- 通过响应头告知: `Deprecation: true`
- 通过响应头告知下线时间: `Sunset: Sat, 31 Dec 2025 23:59:59 GMT`
```

### 多版本共存实现

```java
// Controller 版本控制
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    @GetMapping("/{id}")
    public ResponseEntity<UserV1Response> getUser(@PathVariable Long id) {
        // v1 实现
    }
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    @GetMapping("/{id}")
    public ResponseEntity<UserV2Response> getUser(@PathVariable Long id) {
        // v2 实现，包含新字段
    }
}
```

---

## HATEOAS（超媒体驱动）

### 什么是 HATEOAS

HATEOAS (Hypermedia as the Engine of Application State) 是 REST 成熟度模型的最高级别（Level 3），通过在响应中包含链接来指导客户端下一步操作。

### Richardson 成熟度模型

```markdown
Level 0: 单一 URI，单一方法（RPC 风格）
Level 1: 多个 URI，单一方法（资源）
Level 2: 多个 URI，多个方法（HTTP 动词）✅ 大多数 API
Level 3: HATEOAS（超媒体控制）
```

### HATEOAS 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "orderNo": "ORD202501150001",
    "status": "PAID",
    "totalAmount": "100.00",
    "_links": {
      "self": {
        "href": "/api/v1/orders/123"
      },
      "cancel": {
        "href": "/api/v1/orders/123/cancel",
        "method": "POST",
        "title": "取消订单"
      },
      "ship": {
        "href": "/api/v1/orders/123/ship",
        "method": "POST",
        "title": "发货"
      },
      "items": {
        "href": "/api/v1/orders/123/items",
        "method": "GET",
        "title": "订单项列表"
      },
      "user": {
        "href": "/api/v1/users/456",
        "method": "GET",
        "title": "下单用户"
      }
    }
  }
}
```

### 何时使用 HATEOAS

| 场景 | 是否使用 | 说明 |
|------|---------|------|
| 公开 API | ✅ 推荐 | 提升 API 可发现性 |
| 内部 API | ⚠️ 可选 | 增加复杂度 |
| 简单 CRUD | ❌ 不需要 | 过度设计 |
| 复杂工作流 | ✅ 推荐 | 指导状态转换 |

### Spring HATEOAS 实现

```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    
    @GetMapping("/{id}")
    public EntityModel<OrderResponse> getOrder(@PathVariable Long id) {
        Order order = orderService.findById(id);
        OrderResponse response = OrderResponse.from(order);
        
        EntityModel<OrderResponse> model = EntityModel.of(response);
        
        // 添加自身链接
        model.add(linkTo(methodOn(OrderController.class).getOrder(id)).withSelfRel());
        
        // 根据状态添加可用操作
        if (order.canCancel()) {
            model.add(linkTo(methodOn(OrderController.class).cancelOrder(id, null))
                .withRel("cancel"));
        }
        if (order.canShip()) {
            model.add(linkTo(methodOn(OrderController.class).shipOrder(id, null))
                .withRel("ship"));
        }
        
        return model;
    }
}
```

---

## 限流设计 (Rate Limiting)

### 限流策略

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **固定窗口** | 固定时间窗口内限制请求数 | 简单场景 |
| **滑动窗口** | 滑动时间窗口，更平滑 | 一般场景 |
| **令牌桶** | 固定速率生成令牌 | 允许突发流量 |
| **漏桶** | 固定速率处理请求 | 严格限速 |

### 限流维度

```markdown
| 维度 | 示例 | 说明 |
|------|------|------|
| 全局 | 整个 API 10000 QPS | 系统保护 |
| 用户 | 每用户 100 次/分钟 | 防止单用户滥用 |
| IP | 每 IP 1000 次/分钟 | 防止爬虫 |
| 接口 | 登录接口 10 次/分钟 | 防止暴力破解 |
| 租户 | 每租户 5000 次/小时 | SaaS 场景 |
```

### 限流响应

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705312800

{
  "code": 429001,
  "message": "请求过于频繁，请稍后重试",
  "data": {
    "retryAfter": 60,
    "limit": 100,
    "remaining": 0,
    "resetAt": "2025-01-15T12:00:00Z"
  }
}
```

### 限流 Header 规范

| Header | 说明 |
|--------|------|
| `X-RateLimit-Limit` | 时间窗口内的请求限制 |
| `X-RateLimit-Remaining` | 剩余请求次数 |
| `X-RateLimit-Reset` | 限制重置时间（Unix 时间戳） |
| `Retry-After` | 建议重试等待时间（秒） |

### Spring Boot 限流实现

```java
// 使用 Bucket4j + Redis 实现分布式限流
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    private final RedissonClient redissonClient;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        
        String key = "rate_limit:" + getUserId(request);
        RRateLimiter limiter = redissonClient.getRateLimiter(key);
        
        // 每分钟 100 次
        limiter.trySetRate(RateType.OVERALL, 100, 1, RateIntervalUnit.MINUTES);
        
        if (!limiter.tryAcquire()) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setHeader("X-RateLimit-Limit", "100");
            response.setHeader("X-RateLimit-Remaining", "0");
            response.getWriter().write("{\"code\":429001,\"message\":\"请求过于频繁\"}");
            return false;
        }
        
        return true;
    }
}

// 注解方式
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    int limit() default 100;      // 限制次数
    int window() default 60;      // 时间窗口（秒）
    String key() default "";      // 限流 key
}

@RestController
public class AuthController {
    
    @PostMapping("/login")
    @RateLimit(limit = 10, window = 60, key = "login")  // 每分钟最多 10 次
    public Response login(@RequestBody LoginRequest request) {
        // ...
    }
}
```

### 限流最佳实践

```markdown
### 限流配置建议

| 接口类型 | 限流策略 | 限制 |
|---------|---------|------|
| 登录/注册 | IP + 用户 | 10次/分钟 |
| 验证码发送 | 手机号 | 1次/分钟，10次/天 |
| 普通查询 | 用户 | 100次/分钟 |
| 批量操作 | 用户 | 10次/分钟 |
| 文件上传 | 用户 | 20次/小时 |
| 开放 API | API Key | 按套餐配置 |

### 限流降级策略
1. **排队**: 请求放入队列，延迟处理
2. **拒绝**: 直接返回 429
3. **降级**: 返回缓存数据或简化结果
```
