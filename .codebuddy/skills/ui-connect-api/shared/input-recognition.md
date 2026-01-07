# 输入类型识别规则

> 统一的输入格式识别规则，所有平台共用

## 识别流程

```
用户输入 → 特征匹配 → 确定输入类型 → 路由到对应解析器
```

## 输入类型识别

### 1. OpenAPI/Swagger

**识别特征：**
```yaml
必要条件（满足任一）:
  - 包含 "openapi": "3.x.x" 字段
  - 包含 "swagger": "2.0" 字段

辅助特征:
  - 包含 paths 节点
  - 包含 components/schemas（OpenAPI 3.x）或 definitions（Swagger 2.0）
  - 文件扩展名为 .json/.yaml/.yml
  - URL 包含 swagger/openapi 关键词
```

**兼容来源：**
- Swagger Editor 导出
- **YAPI 导出 Swagger 格式**
- 其他 OpenAPI 兼容工具

**示例匹配：**
```yaml
# OpenAPI 3.x
openapi: "3.0.0"
info:
  title: API
paths:
  /users:
    get: ...

# Swagger 2.0
swagger: "2.0"
info:
  title: API
paths:
  /users:
    get: ...
```

**解析器：** [openapi-parser.md](openapi-parser.md)

---

### 2. curl 命令

**识别特征：**
```yaml
必要条件:
  - 以 "curl" 关键词开头（忽略前导空格）

辅助特征:
  - 包含 URL（http:// 或 https://）
  - 包含 -X/--request 参数
  - 包含 -H/--header 参数
  - 包含 -d/--data 参数
  - 可能包含续行符 \
```

**示例匹配：**
```bash
curl -X POST 'https://api.example.com/users' \
  -H 'Content-Type: application/json' \
  -d '{"name": "test"}'

curl https://api.example.com/users?page=1
```

**解析器：** [curl-parser.md](curl-parser.md)

---

### 3. Postman Collection

**识别特征：**
```yaml
必要条件（满足任一）:
  - 包含 "info" 对象且有 "_postman_id" 字段
  - 包含 "info" 对象且 "schema" 字段包含 "getpostman.com"

辅助特征:
  - 包含 "item" 数组
  - item 元素包含 "request" 对象
  - 文件扩展名为 .postman_collection.json
```

**兼容来源：**
- Postman 导出
- **YAPI 导出 JSON 格式**（YAPI 使用 Postman Collection v2.1 格式）
- 其他兼容 Postman 格式的工具

**示例匹配：**
```json
{
  "info": {
    "_postman_id": "xxx",
    "name": "API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [...]
}
```

**解析器：** [postman-parser.md](postman-parser.md)

---

### 4. HAR (HTTP Archive)

**识别特征：**
```yaml
必要条件:
  - 根对象包含 "log" 字段
  - log 对象包含 "entries" 数组

辅助特征:
  - log 包含 "version" 字段
  - entries 元素包含 "request" 和 "response" 对象
  - 文件扩展名为 .har
```

**示例匹配：**
```json
{
  "log": {
    "version": "1.2",
    "entries": [
      {
        "request": { "method": "GET", "url": "..." },
        "response": { "status": 200, ... }
      }
    ]
  }
}
```

**解析器：** [har-parser.md](har-parser.md)

---

### 5. 接口设计文档

**识别特征：**
```yaml
必要条件（满足多个）:
  - 包含 HTTP 方法关键词（GET/POST/PUT/DELETE/PATCH）
  - 包含请求路径（以 / 开头的 URL 路径）

辅助特征:
  - 包含"接口"、"API"、"请求"、"响应"等关键词
  - 包含表格形式的参数说明
  - 包含"请求参数"、"响应参数"、"请求体"等章节
  - 文档格式为 Markdown
```

**兼容来源：**
- 手写接口文档
- **YAPI 导出 Markdown 格式**
- 其他接口管理平台导出的文档

**示例匹配：**
```markdown
## 获取用户列表

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/users |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
```

**解析器：** [api-doc-parser.md](api-doc-parser.md)

---

### 6. 后端代码

**识别特征：**

#### Java/Spring Boot
```yaml
必要条件（满足任一）:
  - 包含 @RestController 或 @Controller 注解
  - 包含 @GetMapping/@PostMapping/@PutMapping/@DeleteMapping 注解
  - 包含 @RequestMapping 注解

辅助特征:
  - 包含 @RequestParam/@PathVariable/@RequestBody 注解
  - 包含 ResponseEntity 或 ApiResponse 返回类型
  - 文件扩展名为 .java
```

#### Go/Gin
```yaml
必要条件（满足任一）:
  - 包含 gin.Context 类型参数
  - 包含 router.GET/router.POST 等路由注册

辅助特征:
  - 包含 c.JSON/c.Bind 调用
  - 包含 Swagger 注释（@Summary/@Router 等）
  - 文件扩展名为 .go
```

#### Node.js/Express
```yaml
必要条件（满足任一）:
  - 包含 app.get/app.post/router.get/router.post 调用
  - 包含 express() 或 Router() 调用

辅助特征:
  - 包含 req.params/req.query/req.body 访问
  - 包含 res.json/res.send 调用
  - 文件扩展名为 .js/.ts
```

**解析器：** [backend-code-parser.md](backend-code-parser.md)

---

## 识别优先级

当输入可能匹配多种类型时，按以下优先级判断：

| 优先级 | 输入类型 | 原因 |
|--------|---------|------|
| 1 | curl 命令 | 特征明确，以 curl 开头 |
| 2 | OpenAPI/Swagger | 有明确的版本标识字段 |
| 3 | Postman Collection | 有明确的 schema 标识 |
| 4 | HAR | 有明确的 log.entries 结构 |
| 5 | 后端代码 | 有明确的框架特征 |
| 6 | 接口设计文档 | 兜底类型，基于关键词匹配 |

## 识别代码示例

```typescript
type InputType = 'openapi' | 'curl' | 'postman' | 'har' | 'api-doc' | 'backend-code';

function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  
  // 1. curl 命令
  if (/^curl\s/i.test(trimmed)) {
    return 'curl';
  }
  
  // 尝试解析为 JSON
  let jsonObj: any = null;
  try {
    jsonObj = JSON.parse(trimmed);
  } catch {
    // 尝试 YAML 解析
    // ...
  }
  
  if (jsonObj) {
    // 2. OpenAPI/Swagger
    if (jsonObj.openapi || jsonObj.swagger) {
      return 'openapi';
    }
    
    // 3. Postman Collection
    if (jsonObj.info?._postman_id || jsonObj.info?.schema?.includes('getpostman.com')) {
      return 'postman';
    }
    
    // 4. HAR
    if (jsonObj.log?.entries) {
      return 'har';
    }
  }
  
  // 5. 后端代码
  if (isBackendCode(trimmed)) {
    return 'backend-code';
  }
  
  // 6. 接口设计文档（兜底）
  return 'api-doc';
}

function isBackendCode(input: string): boolean {
  // Java/Spring Boot
  if (/@(Rest)?Controller|@(Get|Post|Put|Delete)Mapping|@RequestMapping/.test(input)) {
    return true;
  }
  
  // Go/Gin
  if (/gin\.Context|router\.(GET|POST|PUT|DELETE)/.test(input)) {
    return true;
  }
  
  // Node.js/Express
  if (/app\.(get|post|put|delete)|router\.(get|post|put|delete)/.test(input)) {
    return true;
  }
  
  return false;
}
```

## 注意事项

1. **优先精确匹配**：有明确标识的类型（如 OpenAPI 版本号）优先
2. **兜底策略**：无法识别时默认为接口设计文档
3. **混合输入**：如果用户同时提供多种输入，分别识别处理
4. **用户指定**：如果用户明确指定输入类型，以用户指定为准
