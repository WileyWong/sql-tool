# OpenAPI解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - OpenAPI/Swagger 章节

```yaml
必要条件（满足任一）:
  - 包含 "openapi": "3.x.x" 字段
  - 包含 "swagger": "2.0" 字段

辅助特征:
  - 包含 paths 节点
  - 包含 components/schemas（OpenAPI 3.x）或 definitions（Swagger 2.0）
```

## 支持版本

- OpenAPI 3.0.x
- OpenAPI 3.1.x
- Swagger 2.0

## 解析流程

```
1. 识别版本 → 2. 解析info → 3. 解析paths → 4. 解析components/definitions → 5. 解析引用 → 6. 生成接口文档
```

## 版本识别

```yaml
OpenAPI 3.x:
  openapi: "3.0.0" 或 "3.1.0"
  
Swagger 2.0:
  swagger: "2.0"
```

## 路径解析

### OpenAPI 3.x

```yaml
paths:
  /users:
    get:
      operationId: getUsers
      summary: 获取用户列表
      tags: [users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
    post:
      operationId: createUser
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

### Swagger 2.0

```yaml
paths:
  /users:
    get:
      operationId: getUsers
      parameters:
        - name: page
          in: query
          type: integer
      responses:
        200:
          schema:
            $ref: '#/definitions/UserListResponse'
    post:
      operationId: createUser
      parameters:
        - name: body
          in: body
          schema:
            $ref: '#/definitions/CreateUserRequest'
      responses:
        201:
          schema:
            $ref: '#/definitions/User'
```

## Schema解析

### 基础类型

```yaml
# OpenAPI 3.x
type: string
type: integer
type: number
type: boolean
type: array
  items:
    type: string
type: object
  properties:
    name:
      type: string

# 格式
type: string
format: date-time  # ISO日期
format: email      # 邮箱
format: uuid       # UUID
format: binary     # 二进制

# 枚举
type: string
enum: [active, inactive, suspended]
```

### 引用解析

```yaml
# OpenAPI 3.x
$ref: '#/components/schemas/User'

# Swagger 2.0
$ref: '#/definitions/User'
```

### 组合类型

```yaml
# allOf - 合并所有
allOf:
  - $ref: '#/components/schemas/BaseEntity'
  - type: object
    properties:
      name:
        type: string

# oneOf - 其中之一
oneOf:
  - $ref: '#/components/schemas/Cat'
  - $ref: '#/components/schemas/Dog'

# anyOf - 任意组合
anyOf:
  - type: string
  - type: integer
```

## 类型映射

| OpenAPI类型 | TypeScript类型 |
|------------|---------------|
| string | string |
| integer | number |
| number | number |
| boolean | boolean |
| array | T[] |
| object | interface |
| string + enum | 联合类型 |
| string + format: date-time | string |
| $ref | 引用类型 |
| allOf | 交叉类型 & |
| oneOf/anyOf | 联合类型 \| |

## 输出格式

解析后转换为标准接口文档格式：

```yaml
interface_document:
  name: "getUsers"
  description: "获取用户列表"
  tags: ["users"]
  
  request:
    method: "GET"
    path: "/users"
    query_params:
      - name: "page"
        type: "number"
        required: false
    
  response:
    success:
      code: 200
      body:
        type: "UserListResponse"
        properties:
          - name: "items"
            type: "User[]"
          - name: "pagination"
            type: "Pagination"
```

## 代码示例

```typescript
interface OpenAPIParser {
  parse(spec: string | object): ParsedAPI;
}

interface ParsedAPI {
  info: {
    title: string;
    version: string;
  };
  endpoints: Endpoint[];
  schemas: Schema[];
}

interface Endpoint {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  tags?: string[];
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
}

interface Schema {
  name: string;
  type: string;
  properties?: Property[];
  enum?: string[];
  required?: string[];
}
```

## 注意事项

1. **循环引用**: 处理 `$ref` 时注意循环引用
2. **nullable**: OpenAPI 3.x 支持 `nullable: true`
3. **additionalProperties**: 处理动态属性
4. **discriminator**: 处理多态类型
