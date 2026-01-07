# curl命令解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - curl 命令章节

```yaml
必要条件:
  - 以 "curl" 关键词开头（忽略前导空格）

辅助特征:
  - 包含 URL（http:// 或 https://）
  - 包含 -X/--request、-H/--header、-d/--data 参数
```

## curl命令格式

```bash
curl [options] <url>
```

## 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| -X, --request | HTTP方法 | `-X POST` |
| -H, --header | 请求头 | `-H 'Content-Type: application/json'` |
| -d, --data | 请求体 | `-d '{"name":"test"}'` |
| --data-raw | 原始数据 | `--data-raw '{"name":"test"}'` |
| -F, --form | 表单数据 | `-F 'file=@/path/to/file'` |
| -u, --user | 认证 | `-u username:password` |
| -b, --cookie | Cookie | `-b 'session=abc123'` |
| -A, --user-agent | User-Agent | `-A 'Mozilla/5.0'` |
| -k, --insecure | 跳过SSL验证 | `-k` |
| -L, --location | 跟随重定向 | `-L` |
| -o, --output | 输出文件 | `-o output.json` |
| -v, --verbose | 详细输出 | `-v` |

## 解析规则

### 1. 提取URL

```bash
# 带引号
curl 'https://api.example.com/users?page=1'

# 不带引号
curl https://api.example.com/users

# 解析结果
{
  url: 'https://api.example.com/users',
  path: '/users',
  queryParams: { page: '1' }
}
```

### 2. 提取HTTP方法

```bash
# 显式指定
curl -X POST 'https://api.example.com/users'
curl --request PUT 'https://api.example.com/users/1'

# 隐式推断
curl 'https://api.example.com/users'           # GET（无数据）
curl -d '{}' 'https://api.example.com/users'   # POST（有数据）

# 解析结果
{
  method: 'POST'
}
```

### 3. 提取请求头

```bash
curl -H 'Authorization: Bearer token123' \
     -H 'Content-Type: application/json' \
     -H 'X-Custom-Header: value' \
     'https://api.example.com/users'

# 解析结果
{
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
}
```

### 4. 提取请求体

```bash
# JSON数据
curl -d '{"username":"john","email":"john@example.com"}' \
     'https://api.example.com/users'

# 多行JSON
curl -d '{
  "username": "john",
  "email": "john@example.com"
}' 'https://api.example.com/users'

# 解析结果
{
  body: {
    username: 'john',
    email: 'john@example.com'
  }
}
```

### 5. 提取表单数据

```bash
curl -F 'file=@/path/to/file.pdf' \
     -F 'name=document' \
     'https://api.example.com/upload'

# 解析结果
{
  contentType: 'multipart/form-data',
  formData: {
    file: { type: 'file', path: '/path/to/file.pdf' },
    name: 'document'
  }
}
```

## 解析代码

```typescript
interface ParsedCurl {
  method: string;
  url: string;
  path: string;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  body?: any;
  contentType?: string;
}

function parseCurl(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    method: 'GET',
    url: '',
    path: '',
    queryParams: {},
    headers: {},
  };

  // 移除换行符和多余空格
  const normalized = curlCommand
    .replace(/\\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 提取URL
  const urlMatch = normalized.match(/curl\s+(?:-[^\s]+\s+)*['"]?([^'">\s]+)['"]?/);
  if (urlMatch) {
    const fullUrl = urlMatch[1];
    const urlObj = new URL(fullUrl);
    result.url = fullUrl;
    result.path = urlObj.pathname;
    urlObj.searchParams.forEach((value, key) => {
      result.queryParams[key] = value;
    });
  }

  // 提取方法
  const methodMatch = normalized.match(/-X\s+(\w+)|--request\s+(\w+)/);
  if (methodMatch) {
    result.method = (methodMatch[1] || methodMatch[2]).toUpperCase();
  }

  // 提取请求头
  const headerRegex = /-H\s+['"]([^'"]+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(normalized)) !== null) {
    const [key, value] = headerMatch[1].split(':').map(s => s.trim());
    result.headers[key] = value;
  }

  // 提取请求体
  const dataMatch = normalized.match(/-d\s+['"](.+?)['"](?=\s+-|\s*$)|--data(?:-raw)?\s+['"](.+?)['"](?=\s+-|\s*$)/s);
  if (dataMatch) {
    const dataStr = dataMatch[1] || dataMatch[2];
    try {
      result.body = JSON.parse(dataStr);
      result.contentType = 'application/json';
    } catch {
      result.body = dataStr;
    }
    // 如果没有显式指定方法，有数据则为POST
    if (!methodMatch) {
      result.method = 'POST';
    }
  }

  return result;
}
```

## 类型推断

### 从请求体推断

```typescript
function inferTypeFromBody(body: any): TypeDefinition {
  if (body === null) return { type: 'null' };
  if (typeof body === 'string') return { type: 'string' };
  if (typeof body === 'number') return { type: 'number' };
  if (typeof body === 'boolean') return { type: 'boolean' };
  if (Array.isArray(body)) {
    if (body.length === 0) return { type: 'any[]' };
    return { type: 'array', items: inferTypeFromBody(body[0]) };
  }
  if (typeof body === 'object') {
    return {
      type: 'object',
      properties: Object.entries(body).map(([key, value]) => ({
        name: key,
        ...inferTypeFromBody(value),
      })),
    };
  }
  return { type: 'any' };
}
```

### 从字段名推断

```typescript
function enhanceTypeByFieldName(name: string, baseType: string): string {
  const patterns: Record<string, string> = {
    'id$|Id$|_id$': 'number',
    'email': 'string',
    'phone|mobile': 'string',
    'url|Url|URL': 'string',
    'is[A-Z]|has[A-Z]|can[A-Z]': 'boolean',
    'At$|Time$|Date$': 'string', // ISO日期
    'count|total|num': 'number',
  };

  for (const [pattern, type] of Object.entries(patterns)) {
    if (new RegExp(pattern).test(name)) {
      return type;
    }
  }

  return baseType;
}
```

## 输出格式

```yaml
interface_document:
  name: "createUser"
  description: "从curl命令解析"
  source: "curl -X POST /users -d '{...}'"
  
  request:
    method: "POST"
    path: "/users"
    headers:
      Content-Type: "application/json"
      Authorization: "Bearer {token}"
    body:
      type: "object"
      properties:
        - name: "username"
          type: "string"
          required: true
        - name: "email"
          type: "string"
          required: true
  
  response:
    # 响应需要用户补充或从示例推断
    success:
      code: 200
      body:
        type: "unknown"
```
