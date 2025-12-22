# API 测试用例设计策略（黑盒）

基于接口文档或 HTTP RESTful API 代码设计测试用例，进行真实接口测试（非Mock）。

---

## 适用场景

- 接口文档（OpenAPI/Swagger/手写文档）
- HTTP RESTful API 代码文件（Controller/@RestController/@RequestMapping）
- 需求文档中的接口描述

---

## 核心原则

### 真实接口测试

| 项目 | 说明 |
|------|------|
| **测试目标** | 真实 API 端点，验证实际服务行为 |
| **测试环境** | 开发环境/测试环境/预发环境 |
| **数据管理** | 使用 fixture 创建真实数据，测试后清理 |
| **依赖服务** | 连接真实依赖服务，不做 Mock |
| **数据库验证** | 直接查询数据库验证数据状态 |

### 6 维度设计

| 维度 | 关键测试点 | 优先级 |
|------|-----------|--------|
| **功能** | 正常流程、必填/全字段 | P0 |
| **参数** | 必填缺失、边界值(min-1/min/max/max+1)、格式验证 | P0/P1 |
| **业务** | 唯一性、状态流转、数据库验证 | P0 |
| **异常** | 401/403/404/409、依赖服务异常 | P0 |
| **安全** | SQL注入、XSS、超长输入 | P1 |
| **性能** | 响应时间<500ms、并发测试 | P1 |

---

## 执行步骤

### 步骤 1: 分析接口信息

**从接口文档提取**:
- 请求方法（GET/POST/PUT/DELETE）
- 请求路径
- 请求参数（路径参数、查询参数、请求体）
- 参数约束（必填、类型、长度、格式）
- 响应结构
- 错误码定义

**从 API 代码提取**:
- `@RequestMapping`/`@GetMapping`/`@PostMapping` 注解
- `@RequestBody`/`@RequestParam`/`@PathVariable` 参数
- `@Valid`/`@NotBlank`/`@Size` 验证注解
- 业务逻辑和异常处理

### 步骤 2: 设计功能测试用例

```markdown
### TC001 - 创建用户成功（必填字段）

**优先级**: P0

**前置条件**:
- 用户已认证
- 用户名不存在

**测试数据**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123456"
}
```

**预期结果**:
- HTTP 状态码: 201
- 响应体: { "code": 0, "data": { "id": "不为空", "username": "testuser" } }
- 数据库: users 表新增一条记录

**清理操作**:
- DELETE /api/users/{id}
```

### 步骤 3: 设计参数验证用例

```markdown
### TC010 - 用户名为空

**优先级**: P0

**测试数据**:
```json
{
  "username": "",
  "email": "test@example.com"
}
```

**预期结果**:
- HTTP 状态码: 400
- 响应体: { "code": 400, "message": "用户名不能为空" }
```

### 步骤 4: 设计边界值用例

```markdown
### TC011 - 用户名最小长度

**测试数据**:
- username_below_min: "ab" (2字符, <min)
- username_at_min: "abc" (3字符, =min)

**预期结果**:
- below_min → 400
- at_min → 201

### TC012 - 用户名最大长度

**测试数据**:
- username_at_max: "a" * 20 (20字符, =max)
- username_above_max: "a" * 21 (21字符, >max)

**预期结果**:
- at_max → 201
- above_max → 400
```

### 步骤 5: 设计异常场景用例

```markdown
### TC030 - 未认证访问

**前置条件**: 不携带 Token

**预期结果**:
- HTTP 状态码: 401
- 响应体: { "code": 401, "message": "未认证" }

### TC031 - 无权限访问

**前置条件**: 使用普通用户 Token 访问管理员接口

**预期结果**:
- HTTP 状态码: 403
- 响应体: { "code": 403, "message": "权限不足" }

### TC032 - 资源不存在

**测试数据**: GET /api/users/99999

**预期结果**:
- HTTP 状态码: 404
- 响应体: { "code": 404, "message": "用户不存在" }

### TC033 - 资源冲突

**前置条件**: 用户名已存在

**预期结果**:
- HTTP 状态码: 409
- 响应体: { "code": 409, "message": "用户名已存在" }
```

### 步骤 6: 设计安全测试用例

```markdown
### TC040 - SQL 注入防护

**测试数据**:
```json
{
  "username": "' OR '1'='1",
  "email": "test@example.com"
}
```

**预期结果**:
- HTTP 状态码: 400 或 200（数据被转义存储）
- 不应返回其他用户数据
- 数据库不应执行恶意 SQL

### TC041 - XSS 防护

**测试数据**:
```json
{
  "username": "<script>alert('xss')</script>",
  "email": "test@example.com"
}
```

**预期结果**:
- 输入被转义或拒绝
- 响应中不包含可执行脚本
```

### 步骤 7: 设计性能测试用例

```markdown
### TC050 - 响应时间验证

**测试步骤**:
1. 发送 GET /api/users 请求
2. 记录响应时间

**预期结果**:
- 响应时间 < 500ms
- P95 响应时间 < 800ms
```

---

## 输出产物

### 测试用例文档

文件路径: `workspace/{变更ID}/test/cases/{接口名}-test-spec.md`

文档结构:
```markdown
---
change_id: "{变更ID}"
domain: "{业务领域}"
test_type: "api-test"
source: "api_doc"
---

# {接口名称} API 测试用例

## 1. 测试范围
## 2. 测试用例
### 2.1 功能测试
### 2.2 参数验证测试
### 2.3 业务逻辑测试
### 2.4 异常场景测试
### 2.5 安全测试
### 2.6 性能测试
## 3. 测试数据
## 4. 清理策略
```

---

## 验证清单

- [ ] 所有接口已分析（路径、方法、参数）
- [ ] 所有参数约束已提取（必填、类型、长度）
- [ ] 功能测试覆盖正常流程
- [ ] 参数验证覆盖必填/边界值/格式
- [ ] 异常场景覆盖 401/403/404/409
- [ ] 安全测试覆盖 SQL注入/XSS
- [ ] 性能测试包含响应时间断言
- [ ] 清理策略已定义

---

## 相关资源

- [测试用例规范](../../test-case-spec-standard.md)
- [完整示例](../../examples/example-01-api-test.md)
- [验证清单](../../checklist.md)
