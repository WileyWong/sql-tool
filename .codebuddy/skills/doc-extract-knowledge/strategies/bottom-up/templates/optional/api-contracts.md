# API 契约文档

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}  
> **API 总数**: {{API_COUNT}} 个

---

## 📋 API 概览

| 模块 | 基础路径 | API 数量 | 认证要求 |
|------|----------|----------|----------|
| {{MODULE_NAME}} | `{{BASE_PATH}}` | {{API_COUNT}} | {{AUTH_REQUIRED}} |

---

## 📚 {{MODULE_NAME}} API

### {{API_NAME}}

#### 基本信息

| 属性 | 值 |
|------|-----|
| **HTTP方法** | `{{HTTP_METHOD}}` |
| **路径** | `{{BASE_PATH}}{{PATH}}` |
| **Controller** | `{{CONTROLLER_CLASS}}.{{METHOD_NAME}}()` |
| **认证** | {{AUTH_REQUIRED}} |
| **权限** | {{PERMISSION}} |

#### 完整定义

```java
@{{HTTP_METHOD}}Mapping("{{PATH}}")
{{OTHER_ANNOTATIONS}}
public {{RETURN_TYPE}} {{METHOD_NAME}}(
    {{PARAMS_WITH_ANNOTATIONS}}
){{THROWS_CLAUSE}}
```

#### 请求参数

| 参数 | 类型 | 位置 | 必填 | 默认值 | 说明 |
|------|------|------|:----:|--------|------|
| {{PARAM_NAME}} | {{PARAM_TYPE}} | {{PARAM_LOCATION}} | {{REQUIRED}} | {{DEFAULT}} | {{PARAM_DESC}} |

#### 请求示例

```bash
curl -X {{HTTP_METHOD}} '{{BASE_URL}}{{BASE_PATH}}{{PATH}}' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{{REQUEST_BODY}}'
```

```json
{{REQUEST_EXAMPLE}}
```

#### 响应结果

**成功响应** (HTTP 200):
```json
{{RESPONSE_EXAMPLE}}
```

**错误响应**:
```json
{
  "code": {{ERROR_CODE}},
  "message": "{{ERROR_MESSAGE}}",
  "data": null
}
```

#### 错误码

| 错误码 | HTTP状态 | 说明 | 处理建议 |
|--------|----------|------|----------|
| {{ERROR_CODE}} | {{HTTP_STATUS}} | {{ERROR_DESC}} | {{ERROR_HANDLING}} |

#### 业务逻辑

```
1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}
```

---

### {{API_NAME_2}}

#### 基本信息

| 属性 | 值 |
|------|-----|
| **HTTP方法** | `GET` |
| **路径** | `{{BASE_PATH}}/list` |
| **Controller** | `{{CONTROLLER_CLASS}}.{{METHOD_NAME}}()` |
| **认证** | {{AUTH_REQUIRED}} |

#### 完整定义

```java
@GetMapping("/list")
public Result<PageInfo<{{VO_TYPE}}>> {{METHOD_NAME}}(
    @RequestParam(value = "keyword", required = false) String keyword,
    @RequestParam(value = "status", required = false) Integer status,
    @RequestParam(value = "pageNum", defaultValue = "1") @Min(1) Integer pageNum,
    @RequestParam(value = "pageSize", defaultValue = "10") @Max(100) Integer pageSize
)
```

#### 请求参数

| 参数 | 类型 | 位置 | 必填 | 默认值 | 说明 |
|------|------|------|:----:|--------|------|
| keyword | String | Query | 否 | - | 搜索关键词 |
| status | Integer | Query | 否 | - | 状态筛选 |
| pageNum | Integer | Query | 否 | 1 | 页码（最小1） |
| pageSize | Integer | Query | 否 | 10 | 每页大小（最大100） |

#### 请求示例

```bash
curl -X GET '{{BASE_URL}}{{BASE_PATH}}/list?keyword=test&status=1&pageNum=1&pageSize=10' \
  -H 'Authorization: Bearer {token}'
```

#### 响应结果

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pages": 10,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "id": 1,
        "name": "示例数据",
        "status": 1,
        "createTime": "2024-01-01 12:00:00"
      }
    ]
  }
}
```

#### 业务逻辑

```
1. 参数校验
2. 构建查询条件
3. 执行分页查询
4. 转换为VO返回
```

---

## 📊 通用响应格式

### 成功响应

```java
public class Result<T> {
    private Integer code;      // 状态码
    private String message;    // 消息
    private T data;            // 数据
}
```

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 错误响应

```json
{
  "code": 1001,
  "message": "用户名已存在",
  "data": null
}
```

### 分页响应

```java
public class PageInfo<T> {
    private Long total;        // 总记录数
    private Integer pages;     // 总页数
    private Integer pageNum;   // 当前页码
    private Integer pageSize;  // 每页大小
    private List<T> list;      // 数据列表
}
```

---

## 🔐 认证说明

### Token 传递方式

```
Authorization: Bearer {token}
```

### Token 过期处理

| HTTP 状态码 | 说明 | 处理方式 |
|-------------|------|----------|
| 401 | Token 无效或过期 | 重新登录 |
| 403 | 权限不足 | 提示无权限 |

---

## 📝 错误码汇总

| 范围 | 模块 | 说明 |
|------|------|------|
| 1000-1999 | 用户模块 | 用户相关错误 |
| 2000-2999 | 订单模块 | 订单相关错误 |
| 3000-3999 | 商品模块 | 商品相关错误 |
| 9000-9999 | 系统错误 | 系统级错误 |

---

## 📝 业务规则

### {{MODULE_NAME}} 模块规则

- {{BUSINESS_RULE_1}}
- {{BUSINESS_RULE_2}}
- {{BUSINESS_RULE_3}}

*示例：*
- *状态流转：待处理(0) → 处理中(1) → 已完成(2) → 已拒绝(3)*
- *同一候选人对同一职位只能推荐一次*
- *推荐成功后24小时内可撤回*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
