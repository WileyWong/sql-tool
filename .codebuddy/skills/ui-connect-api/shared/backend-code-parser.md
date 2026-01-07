# 后端代码解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - 后端代码章节

```yaml
Java/Spring Boot:
  - @RestController/@Controller 注解
  - @GetMapping/@PostMapping 等注解

Go/Gin:
  - gin.Context 类型参数
  - router.GET/router.POST 路由注册

Node.js/Express:
  - app.get/router.post 等调用
  - req.params/req.query/req.body 访问
```

## 支持的后端框架

| 框架 | 语言 | 识别特征 |
|------|------|---------|
| Spring Boot | Java | @RestController, @GetMapping |
| Gin | Go | gin.Context, c.JSON |
| Express | Node.js | app.get, router.post |
| Koa | Node.js | ctx.body, router.get |
| FastAPI | Python | @app.get, @router.post |

## Spring Boot解析

### Controller解析

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    public ApiResponse<PageResult<UserVO>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String keyword) {
        // ...
    }
    
    @GetMapping("/{id}")
    public ApiResponse<UserVO> getUserById(@PathVariable Long id) {
        // ...
    }
    
    @PostMapping
    public ApiResponse<UserVO> createUser(@RequestBody @Valid CreateUserRequest request) {
        // ...
    }
}
```

### 解析规则

```typescript
interface SpringEndpoint {
  basePath: string;           // @RequestMapping值
  method: string;             // GET/POST/PUT/DELETE
  path: string;               // @GetMapping等的值
  fullPath: string;           // basePath + path
  methodName: string;         // Java方法名
  parameters: SpringParam[];  // 参数列表
  returnType: string;         // 返回类型
  javadoc?: string;           // JavaDoc注释
}

interface SpringParam {
  name: string;
  javaType: string;
  annotation: '@RequestParam' | '@PathVariable' | '@RequestBody';
  required: boolean;
  defaultValue?: string;
}

// 注解映射
const annotationMapping = {
  '@GetMapping': 'GET',
  '@PostMapping': 'POST',
  '@PutMapping': 'PUT',
  '@DeleteMapping': 'DELETE',
  '@PatchMapping': 'PATCH',
};
```

### DTO/VO解析

```java
@Data
public class CreateUserRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String password;
    
    private String fullName;
}
```

```typescript
interface JavaField {
  name: string;
  type: string;
  required: boolean;      // 基于@NotNull/@NotBlank等
  validations: string[];  // 验证规则
  description?: string;   // 从注释或message提取
}

// 验证注解提取
const validationAnnotations = {
  '@NotNull': { required: true },
  '@NotBlank': { required: true },
  '@NotEmpty': { required: true },
  '@Size': { minLength: 'min', maxLength: 'max' },
  '@Min': { minimum: 'value' },
  '@Max': { maximum: 'value' },
  '@Email': { format: 'email' },
  '@Pattern': { pattern: 'regexp' },
};
```

### Java类型映射

```typescript
const javaTypeMapping: Record<string, string> = {
  // 基础类型
  'String': 'string',
  'Long': 'number',
  'Integer': 'number',
  'int': 'number',
  'long': 'number',
  'Double': 'number',
  'Float': 'number',
  'double': 'number',
  'float': 'number',
  'Boolean': 'boolean',
  'boolean': 'boolean',
  'BigDecimal': 'number',
  
  // 日期类型
  'Date': 'string',
  'LocalDate': 'string',
  'LocalDateTime': 'string',
  'Instant': 'string',
  
  // 集合类型
  'List': 'T[]',
  'Set': 'T[]',
  'Collection': 'T[]',
  'Map': 'Record<K, V>',
  
  // 包装类型
  'ApiResponse': 'T',
  'ResponseEntity': 'T',
  'PageResult': 'PageResponse<T>',
};
```

## Go/Gin解析

### Handler解析

```go
// GetUsers 获取用户列表
// @Summary 获取用户列表
// @Tags users
// @Param page query int false "页码"
// @Param size query int false "每页条数"
// @Success 200 {object} Response{data=PageResult{items=[]User}}
// @Router /api/users [get]
func (h *UserHandler) GetUsers(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
    // ...
}
```

### 解析规则

```typescript
// 从Swagger注释解析
interface SwaggoAnnotation {
  summary: string;
  tags: string[];
  params: SwaggoParam[];
  success: SwaggoResponse;
  router: { path: string; method: string };
}

interface SwaggoParam {
  name: string;
  in: 'query' | 'path' | 'body';
  type: string;
  required: boolean;
  description: string;
}
```

### Go类型映射

```typescript
const goTypeMapping: Record<string, string> = {
  'string': 'string',
  'int': 'number',
  'int32': 'number',
  'int64': 'number',
  'uint': 'number',
  'float32': 'number',
  'float64': 'number',
  'bool': 'boolean',
  'time.Time': 'string',
  '[]byte': 'string',
};
```

## Express/Koa解析

### 路由解析

```javascript
// Express
router.get('/users', async (req, res) => {
  const { page = 1, size = 20, keyword } = req.query;
  // ...
});

router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  // ...
});

// Koa
router.get('/users', async (ctx) => {
  const { page = 1, size = 20 } = ctx.query;
  // ...
});
```

### 解析规则

```typescript
// 从代码推断参数
function inferParamsFromCode(code: string): Parameter[] {
  const params: Parameter[] = [];
  
  // 解析 req.query
  const queryMatch = code.match(/(?:req\.query|ctx\.query)\s*[;{]([^}]+)/);
  if (queryMatch) {
    // 解析解构赋值
    const destructure = queryMatch[1];
    // { page = 1, size = 20, keyword }
    // ...
  }
  
  // 解析 req.body
  const bodyMatch = code.match(/(?:req\.body|ctx\.request\.body)\s*[;{]([^}]+)/);
  // ...
  
  return params;
}
```

## 输出格式

```yaml
interface_document:
  name: "getUsers"
  description: "获取用户列表"
  source: "UserController.java"
  
  request:
    method: "GET"
    path: "/api/users"
    query_params:
      - name: "page"
        type: "number"
        required: false
        default: 1
        description: "页码"
      - name: "size"
        type: "number"
        required: false
        default: 20
        description: "每页条数"
  
  response:
    success:
      code: 200
      body:
        type: "PageResult<User>"
```

## 完整解析流程

```typescript
async function parseBackendCode(code: string, language: string): Promise<ParsedAPI> {
  // 1. 识别框架
  const framework = detectFramework(code, language);
  
  // 2. 解析Controller/Handler
  const endpoints = parseEndpoints(code, framework);
  
  // 3. 解析DTO/Model
  const models = parseModels(code, framework);
  
  // 4. 关联类型
  const linkedEndpoints = linkTypes(endpoints, models);
  
  // 5. 转换为标准格式
  return toInterfaceDocument(linkedEndpoints);
}
```
