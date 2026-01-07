# curl命令生成指南

## 概述

从接口定义生成可执行的curl命令，用于接口测试和调试。

## 生成规则

### 基础格式

```bash
curl -X {METHOD} '{URL}' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{body}'
```

### GET请求

```typescript
interface GetRequest {
  path: string;
  queryParams?: Record<string, any>;
}

function generateGetCurl(request: GetRequest): string {
  const url = buildUrl(request.path, request.queryParams);
  return `curl '${url}' \\
  -H 'Authorization: Bearer {token}'`;
}
```

**示例：**

```bash
# 无参数
curl 'https://api.example.com/users' \
  -H 'Authorization: Bearer {token}'

# 带查询参数
curl 'https://api.example.com/users?page=1&size=20&keyword=test' \
  -H 'Authorization: Bearer {token}'

# 路径参数
curl 'https://api.example.com/users/123' \
  -H 'Authorization: Bearer {token}'
```

### POST请求

```typescript
interface PostRequest {
  path: string;
  body: any;
  contentType?: string;
}

function generatePostCurl(request: PostRequest): string {
  const bodyStr = JSON.stringify(request.body, null, 2);
  return `curl -X POST '${request.path}' \\
  -H 'Content-Type: ${request.contentType || 'application/json'}' \\
  -H 'Authorization: Bearer {token}' \\
  -d '${bodyStr}'`;
}
```

**示例：**

```bash
curl -X POST 'https://api.example.com/users' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}'
```

### PUT请求

```bash
curl -X PUT 'https://api.example.com/users/123' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{
  "username": "john_updated",
  "email": "john_new@example.com"
}'
```

### DELETE请求

```bash
curl -X DELETE 'https://api.example.com/users/123' \
  -H 'Authorization: Bearer {token}'
```

### 文件上传

```bash
curl -X POST 'https://api.example.com/upload' \
  -H 'Authorization: Bearer {token}' \
  -F 'file=@/path/to/file.pdf' \
  -F 'name=document'
```

## 生成代码

```typescript
interface CurlOptions {
  baseUrl: string;
  method: string;
  path: string;
  pathParams?: Record<string, any>;
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
  formData?: Record<string, any>;
}

function generateCurl(options: CurlOptions): string {
  const {
    baseUrl,
    method,
    path,
    pathParams,
    queryParams,
    headers = {},
    body,
    formData,
  } = options;

  // 构建URL
  let url = `${baseUrl}${path}`;
  
  // 替换路径参数
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, String(value));
    }
  }
  
  // 添加查询参数
  if (queryParams && Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    url += `?${params.toString()}`;
  }

  // 构建curl命令
  const parts: string[] = ['curl'];
  
  // 方法
  if (method !== 'GET') {
    parts.push(`-X ${method}`);
  }
  
  // URL
  parts.push(`'${url}'`);
  
  // 默认请求头
  const allHeaders = {
    'Authorization': 'Bearer {token}',
    ...headers,
  };
  
  // 请求头
  for (const [key, value] of Object.entries(allHeaders)) {
    parts.push(`-H '${key}: ${value}'`);
  }
  
  // 请求体
  if (body) {
    if (!allHeaders['Content-Type']) {
      parts.push(`-H 'Content-Type: application/json'`);
    }
    const bodyStr = JSON.stringify(body, null, 2);
    parts.push(`-d '${bodyStr}'`);
  }
  
  // 表单数据
  if (formData) {
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'object' && value.type === 'file') {
        parts.push(`-F '${key}=@${value.path}'`);
      } else {
        parts.push(`-F '${key}=${value}'`);
      }
    }
  }
  
  // 格式化输出
  return parts.join(' \\\n  ');
}
```

## 从接口文档生成

### 输入

```yaml
interface_document:
  name: "createUser"
  request:
    method: "POST"
    path: "/api/users"
    body:
      type: "object"
      properties:
        - name: "username"
          type: "string"
          required: true
        - name: "email"
          type: "string"
          required: true
        - name: "password"
          type: "string"
          required: true
```

### 输出

```bash
curl -X POST 'https://api.example.com/api/users' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{
  "username": "{username}",
  "email": "{email}",
  "password": "{password}"
}'
```

## 批量生成

```typescript
function generateCurlCollection(endpoints: Endpoint[]): string {
  const curls: string[] = [];
  
  for (const endpoint of endpoints) {
    curls.push(`# ${endpoint.name || endpoint.path}`);
    curls.push(generateCurl({
      baseUrl: 'https://api.example.com',
      method: endpoint.method,
      path: endpoint.path,
      queryParams: endpoint.queryParams,
      body: endpoint.body,
    }));
    curls.push('');
  }
  
  return curls.join('\n');
}
```

### 输出示例

```bash
# 获取用户列表
curl 'https://api.example.com/api/users?page=1&size=20' \
  -H 'Authorization: Bearer {token}'

# 获取用户详情
curl 'https://api.example.com/api/users/123' \
  -H 'Authorization: Bearer {token}'

# 创建用户
curl -X POST 'https://api.example.com/api/users' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{
  "username": "{username}",
  "email": "{email}",
  "password": "{password}"
}'

# 更新用户
curl -X PUT 'https://api.example.com/api/users/123' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{
  "username": "{username}",
  "email": "{email}"
}'

# 删除用户
curl -X DELETE 'https://api.example.com/api/users/123' \
  -H 'Authorization: Bearer {token}'
```

## 注意事项

1. **占位符**: 使用 `{token}`, `{id}` 等占位符表示需要替换的值
2. **转义**: JSON中的特殊字符需要正确转义
3. **换行**: 使用 `\` 进行换行，提高可读性
4. **环境变量**: 可以使用环境变量替代硬编码值

```bash
# 使用环境变量
curl -X POST "${API_URL}/users" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"username": "test"}'
```
