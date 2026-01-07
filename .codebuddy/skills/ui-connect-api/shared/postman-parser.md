# Postman Collection 解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - Postman Collection 章节

```yaml
必要条件（满足任一）:
  - 包含 "info" 对象且有 "_postman_id" 字段
  - 包含 "info" 对象且 "schema" 字段包含 "getpostman.com"

辅助特征:
  - 包含 "item" 数组
  - item 元素包含 "request" 对象
```

## 概述

将 Postman Collection (v2.1) 格式转换为标准接口文档格式。

## Postman Collection 结构

```json
{
  "info": {
    "_postman_id": "xxx",
    "name": "API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users?page=1&size=20",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"],
          "query": [
            { "key": "page", "value": "1" },
            { "key": "size", "value": "20" }
          ]
        }
      },
      "response": []
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:8080" }
  ]
}
```

## 解析步骤

### 步骤1: 识别 Postman Collection

```yaml
识别特征:
  - 包含 "info" 对象且有 "_postman_id" 或 "schema" 字段
  - schema 包含 "getpostman.com" 或 "postman"
  - 包含 "item" 数组
  - item 中包含 "request" 对象
```

### 步骤2: 提取变量

```yaml
变量来源:
  - collection.variable: 集合级变量
  - environment: 环境变量（如提供）
  
变量替换:
  - {{variableName}} → 实际值
  - 未找到变量时保留占位符并标注
```

### 步骤3: 解析请求信息

```yaml
请求解析:
  method: request.method
  path: request.url.path 拼接为 "/{path[0]}/{path[1]}/..."
  
  headers:
    - 从 request.header 数组提取
    - 过滤 disabled: true 的项
    
  query_params:
    - 从 request.url.query 数组提取
    - 解析 key, value, description
    
  path_params:
    - 从 path 中识别 :paramName 或 {{paramName}}
    
  body:
    - mode: "raw" → 解析 raw 字段（通常是 JSON）
    - mode: "formdata" → 解析 formdata 数组
    - mode: "urlencoded" → 解析 urlencoded 数组
```

### 步骤4: 解析响应示例

```yaml
响应解析:
  - 从 response 数组提取示例响应
  - 解析 body 字段（JSON字符串）
  - 提取 status, code, header
  - 推断响应类型结构
```

## 转换示例

### 输入: Postman Collection

```json
{
  "info": {
    "name": "User API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"john\",\n  \"email\": \"john@example.com\",\n  \"password\": \"123456\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      },
      "response": [
        {
          "name": "Success",
          "status": "Created",
          "code": 201,
          "body": "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {\n    \"id\": 1,\n    \"username\": \"john\",\n    \"email\": \"john@example.com\"\n  }\n}"
        }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:8080" },
    { "key": "token", "value": "your-token-here" }
  ]
}
```

### 输出: 标准接口文档

```yaml
interface_document:
  name: "Create User"
  description: "创建用户"
  
  request:
    method: "POST"
    path: "/api/users"
    headers:
      Content-Type: "application/json"
      Authorization: "Bearer {token}"
    body:
      type: "object"
      properties:
        - name: "username"
          type: "string"
          required: true
          example: "john"
        - name: "email"
          type: "string"
          required: true
          example: "john@example.com"
        - name: "password"
          type: "string"
          required: true
          example: "123456"
  
  response:
    success:
      code: 201
      body:
        type: "object"
        properties:
          - name: "code"
            type: "number"
            example: 0
          - name: "message"
            type: "string"
            example: "success"
          - name: "data"
            type: "object"
            properties:
              - name: "id"
                type: "number"
              - name: "username"
                type: "string"
              - name: "email"
                type: "string"
```

## 特殊处理

### 文件夹结构

```yaml
处理嵌套文件夹:
  - Postman item 可以嵌套（文件夹）
  - 递归遍历所有 item
  - 文件夹名可用于分组/模块命名
```

### 变量处理

```yaml
变量优先级:
  1. 环境变量（如提供）
  2. 集合变量 (collection.variable)
  3. 全局变量
  
常见变量:
  - {{baseUrl}}: API基础路径
  - {{token}}: 认证令牌
  - {{userId}}: 动态ID
```

### Body 模式

```yaml
body_modes:
  raw:
    - 通常是 JSON 格式
    - 解析 options.raw.language 判断类型
    
  formdata:
    - 文件上传场景
    - 解析 src 字段获取文件信息
    
  urlencoded:
    - 表单提交
    - 解析 key-value 对
    
  graphql:
    - GraphQL 查询
    - 解析 query 和 variables
```

## 类型推断

```yaml
类型推断规则:
  - JSON 字符串值 → string
  - JSON 数字值 → number
  - JSON 布尔值 → boolean
  - JSON 数组 → array
  - JSON 对象 → object
  - null → nullable
  
  数组元素类型:
    - 分析数组第一个元素
    - 空数组标注为 any[]
```

## 注意事项

1. **变量替换**: 未定义的变量保留 `{{varName}}` 格式并在文档中标注
2. **示例响应**: 优先使用 response 中的示例推断类型
3. **认证信息**: Authorization header 中的 token 替换为占位符
4. **环境差异**: 不同环境的 baseUrl 可能不同，生成时使用配置化方式
