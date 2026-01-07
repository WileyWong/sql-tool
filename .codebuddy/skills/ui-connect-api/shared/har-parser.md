# HAR (HTTP Archive) 解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - HAR 章节

```yaml
必要条件:
  - 根对象包含 "log" 字段
  - log 对象包含 "entries" 数组

辅助特征:
  - entries 元素包含 "request" 和 "response" 对象
```

## 概述

将 HAR (HTTP Archive) 格式转换为标准接口文档格式。HAR 是浏览器开发者工具导出的网络请求记录格式。

## HAR 结构

```json
{
  "log": {
    "version": "1.2",
    "creator": {
      "name": "WebInspector",
      "version": "537.36"
    },
    "entries": [
      {
        "startedDateTime": "2024-01-01T00:00:00.000Z",
        "time": 100,
        "request": {
          "method": "GET",
          "url": "https://api.example.com/users?page=1",
          "httpVersion": "HTTP/1.1",
          "headers": [],
          "queryString": [],
          "postData": {}
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [],
          "content": {
            "size": 1024,
            "mimeType": "application/json",
            "text": "{...}"
          }
        }
      }
    ]
  }
}
```

## 解析步骤

### 步骤1: 识别 HAR 格式

```yaml
识别特征:
  - 根对象包含 "log" 字段
  - log 包含 "version" 和 "entries" 字段
  - entries 是数组，每个元素包含 "request" 和 "response"
```

### 步骤2: 筛选有效请求

```yaml
筛选规则:
  过滤条件:
    - 排除静态资源 (js, css, png, jpg, gif, svg, woff, ttf)
    - 排除非 API 请求 (根据 URL 模式或 Content-Type)
    - 保留 application/json 响应
    
  识别 API 请求:
    - URL 包含 /api/ 或 /v1/ 或 /v2/
    - Content-Type 为 application/json
    - 响应内容为 JSON 格式
```

### 步骤3: 解析请求信息

```yaml
请求解析:
  method: request.method
  
  url解析:
    - 完整URL: request.url
    - 提取 path: URL 中 host 之后的部分
    - 提取 baseUrl: protocol + host
    
  headers:
    - 从 request.headers 数组提取
    - 过滤敏感信息 (Cookie, Authorization 值)
    - 保留 Content-Type, Accept 等关键头
    
  query_params:
    - 从 request.queryString 数组提取
    - 或从 URL 中解析 query string
    
  body:
    - 从 request.postData 提取
    - 解析 postData.text (JSON 字符串)
    - 处理 postData.mimeType
```

### 步骤4: 解析响应信息

```yaml
响应解析:
  status: response.status
  statusText: response.statusText
  
  headers:
    - 从 response.headers 数组提取
    
  body:
    - 从 response.content.text 提取
    - 解析 JSON 字符串
    - 处理 base64 编码 (encoding: "base64")
```

## 转换示例

### 输入: HAR 文件

```json
{
  "log": {
    "version": "1.2",
    "entries": [
      {
        "request": {
          "method": "POST",
          "url": "https://api.example.com/api/users",
          "headers": [
            { "name": "Content-Type", "value": "application/json" },
            { "name": "Authorization", "value": "Bearer xxx" }
          ],
          "postData": {
            "mimeType": "application/json",
            "text": "{\"username\":\"john\",\"email\":\"john@example.com\"}"
          }
        },
        "response": {
          "status": 200,
          "statusText": "OK",
          "headers": [
            { "name": "Content-Type", "value": "application/json" }
          ],
          "content": {
            "mimeType": "application/json",
            "text": "{\"code\":0,\"message\":\"success\",\"data\":{\"id\":1,\"username\":\"john\",\"email\":\"john@example.com\"}}"
          }
        }
      }
    ]
  }
}
```

### 输出: 标准接口文档

```yaml
interface_document:
  name: "Create User"
  description: "POST /api/users"
  
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
  
  response:
    success:
      code: 200
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

### URL 解析

```yaml
URL分解:
  完整URL: "https://api.example.com:8080/api/users/123?page=1&size=20"
  
  解析结果:
    protocol: "https"
    host: "api.example.com"
    port: "8080"
    path: "/api/users/123"
    query: "page=1&size=20"
    
  路径参数识别:
    - /users/123 → /users/{id}
    - 数字ID通常是路径参数
    - UUID格式也是路径参数
```

### 敏感信息处理

```yaml
敏感信息:
  需脱敏字段:
    - Authorization header 值
    - Cookie header 值
    - Set-Cookie response header
    - 请求/响应中的 token、password 字段
    
  处理方式:
    - 替换为占位符: "{token}", "{password}"
    - 或完全移除
```

### 批量请求处理

```yaml
多请求处理:
  - HAR 可能包含多个请求
  - 按 URL path 分组
  - 识别同一接口的不同调用
  - 合并参数类型（取并集）
```

### Base64 解码

```yaml
base64处理:
  识别:
    - response.content.encoding === "base64"
    
  解码:
    - 使用 atob() 或 Buffer.from() 解码
    - 解码后再解析 JSON
```

## 类型推断

```yaml
类型推断规则:
  基础类型:
    - 字符串 → string
    - 数字 → number (区分 integer/float)
    - 布尔 → boolean
    - null → nullable
    
  复杂类型:
    - 数组 → T[] (分析元素类型)
    - 对象 → interface
    
  特殊识别:
    - ISO日期字符串 → Date (string)
    - 邮箱格式 → email (string)
    - URL格式 → url (string)
```

## 常见问题

### 1. 响应内容被截断

```yaml
问题: response.content.text 可能被截断
解决:
  - 检查 content.size 与实际长度
  - 提示用户提供完整 HAR
  - 基于已有内容推断类型
```

### 2. 请求参数不完整

```yaml
问题: 实际请求可能缺少某些可选参数
解决:
  - 分析多个相同接口的请求
  - 合并所有出现的参数
  - 标注参数为可选
```

### 3. 动态路径参数

```yaml
问题: /users/123 vs /users/456
解决:
  - 识别数字ID模式
  - 转换为 /users/{id}
  - 添加路径参数定义
```

## 注意事项

1. **隐私保护**: HAR 可能包含敏感信息，生成代码时需脱敏
2. **请求筛选**: 过滤非 API 请求，避免生成无用代码
3. **类型合并**: 同一接口多次调用时，合并参数类型
4. **环境差异**: HAR 中的 host 可能是开发/测试环境，需配置化
5. **响应示例**: HAR 中的响应是真实数据，可直接用于 Mock
