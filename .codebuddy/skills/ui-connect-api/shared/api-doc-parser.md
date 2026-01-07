# 接口设计文档解析指南

## 识别特征

> 详见 [input-recognition.md](input-recognition.md) - 接口设计文档章节

```yaml
必要条件（满足多个）:
  - 包含 HTTP 方法关键词（GET/POST/PUT/DELETE/PATCH）
  - 包含请求路径（以 / 开头的 URL 路径）

辅助特征:
  - 包含"接口"、"API"、"请求"、"响应"等关键词
  - 包含表格形式的参数说明
```

## 文档格式识别

### 表格格式

```markdown
| 项目 | 说明 |
|------|------|
| 请求方法 | POST |
| 请求路径 | /api/users |

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
```

### 列表格式

```markdown
- 请求方法：POST
- 请求路径：/api/users
- 请求参数：
  - username: string, 必填, 用户名
  - email: string, 必填, 邮箱
```

### 标题格式

```markdown
## 创建用户

### 请求信息
- 方法：POST
- 路径：/api/users

### 请求参数
- username (string, required): 用户名
```

### YAPI Markdown 格式

YAPI 导出的 Markdown 有特殊格式，需要额外处理：

**识别特征：**
```yaml
必要条件:
  - 包含 "> BASIC"、"> REQUEST"、"> RESPONSE" 分隔标记
  - 使用 "**Path:**"、"**Method:**" 格式

辅助特征:
  - 嵌套字段使用 "&ensp;&ensp;&#124;─" 前缀表示层级
  - 包含 "**Request Demo:**" 和 "**Response Demo:**" 代码块
  - 枚举值使用 "<br>" 分隔
```

**示例：**
```markdown
> BASIC

**Path:** /v1/interview/start

**Method:** POST

> REQUEST

**Request Body:**

| name | type | desc |
| ------------ | ------------ | ------------ |
| resumeIds | array | 候选人简历列表 |
| &ensp;&ensp;&#124;─ | integer |  |
| recruitType | integer | 招聘类型<br>1- 应届生<br>2- 实习生 |
```

**YAPI 嵌套字段解析：**
```typescript
// 解析 YAPI 的嵌套表示法
function parseYapiNestedField(name: string): { name: string; depth: number } {
  // 统计 "&ensp;&ensp;" 出现次数确定嵌套深度
  const depthMatch = name.match(/(&ensp;&ensp;)+/);
  const depth = depthMatch ? depthMatch[0].length / 12 : 0; // "&ensp;&ensp;" 长度为12
  
  // 移除嵌套前缀，提取真实字段名
  const cleanName = name
    .replace(/(&ensp;&ensp;)+/g, '')
    .replace(/&#124;─/g, '')
    .trim();
  
  return { name: cleanName || '[item]', depth };
}

// 解析 YAPI 枚举描述
function parseYapiEnumDesc(desc: string): { description: string; enumValues?: string[] } {
  if (!desc.includes('<br>')) {
    return { description: desc };
  }
  
  const parts = desc.split('<br>');
  const description = parts[0];
  const enumValues = parts.slice(1).map(p => p.trim()).filter(Boolean);
  
  return { description, enumValues };
}
```

## 解析规则

### 1. 提取接口基本信息

```typescript
interface ApiInfo {
  name: string;        // 接口名称
  description: string; // 接口描述
  method: string;      // HTTP方法
  path: string;        // 请求路径
}

// 识别模式
const methodPatterns = [
  /请求方法[：:]\s*(GET|POST|PUT|DELETE|PATCH)/i,
  /方法[：:]\s*(GET|POST|PUT|DELETE|PATCH)/i,
  /Method[：:]\s*(GET|POST|PUT|DELETE|PATCH)/i,
];

const pathPatterns = [
  /请求路径[：:]\s*([\/\w\{\}\-]+)/,
  /路径[：:]\s*([\/\w\{\}\-]+)/,
  /Path[：:]\s*([\/\w\{\}\-]+)/,
  /URL[：:]\s*([\/\w\{\}\-]+)/,
];
```

### 2. 解析参数表格

```typescript
interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  children?: Parameter[];
}

// 表格解析
function parseMarkdownTable(tableContent: string): Parameter[] {
  const lines = tableContent.trim().split('\n');
  const headers = lines[0].split('|').map(h => h.trim().toLowerCase());
  
  // 跳过分隔行
  const dataLines = lines.slice(2);
  
  return dataLines.map(line => {
    const cells = line.split('|').map(c => c.trim());
    return {
      name: cells[headers.indexOf('参数名')] || cells[headers.indexOf('name')],
      type: cells[headers.indexOf('类型')] || cells[headers.indexOf('type')],
      required: ['是', 'true', 'required', '必填'].includes(
        (cells[headers.indexOf('必填')] || cells[headers.indexOf('required')] || '').toLowerCase()
      ),
      description: cells[headers.indexOf('说明')] || cells[headers.indexOf('description')],
    };
  });
}
```

### 3. 解析嵌套字段

```markdown
| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | object | 响应数据 |
| data.items | array | 数据列表 |
| data.items[].id | number | ID |
| data.items[].name | string | 名称 |
| data.pagination | object | 分页信息 |
| data.pagination.page | number | 当前页 |
```

```typescript
function parseNestedFields(params: Parameter[]): TypeDefinition {
  const root: any = {};
  
  for (const param of params) {
    const path = param.name.split('.');
    let current = root;
    
    for (let i = 0; i < path.length; i++) {
      const key = path[i].replace(/\[\]$/, '');
      const isArray = path[i].endsWith('[]');
      const isLast = i === path.length - 1;
      
      if (isLast) {
        current[key] = {
          type: isArray ? `${param.type}[]` : param.type,
          description: param.description,
          required: param.required,
        };
      } else {
        current[key] = current[key] || { type: 'object', properties: {} };
        current = current[key].properties;
      }
    }
  }
  
  return root;
}
```

### 4. 类型映射

```typescript
const typeMapping: Record<string, string> = {
  // 中文类型
  '字符串': 'string',
  '整数': 'number',
  '数字': 'number',
  '布尔': 'boolean',
  '数组': 'any[]',
  '对象': 'object',
  '日期': 'string',
  
  // 英文类型
  'string': 'string',
  'int': 'number',
  'integer': 'number',
  'long': 'number',
  'float': 'number',
  'double': 'number',
  'number': 'number',
  'boolean': 'boolean',
  'bool': 'boolean',
  'array': 'any[]',
  'list': 'any[]',
  'object': 'object',
  'date': 'string',
  'datetime': 'string',
  
  // 特殊类型
  'file': 'File',
  'binary': 'Blob',
};

function mapType(docType: string): string {
  const normalized = docType.toLowerCase().trim();
  
  // 检查数组类型 array<User> 或 User[]
  const arrayMatch = normalized.match(/array<(\w+)>|(\w+)\[\]/);
  if (arrayMatch) {
    const itemType = arrayMatch[1] || arrayMatch[2];
    return `${mapType(itemType)}[]`;
  }
  
  return typeMapping[normalized] || 'any';
}
```

## 输出格式

```yaml
interface_document:
  name: "创建用户"
  description: "创建新用户"
  
  request:
    method: "POST"
    path: "/api/users"
    headers:
      Content-Type: "application/json"
    body:
      type: "object"
      properties:
        - name: "username"
          type: "string"
          required: true
          description: "用户名"
        - name: "email"
          type: "string"
          required: true
          description: "邮箱"
        - name: "password"
          type: "string"
          required: true
          description: "密码"
  
  response:
    success:
      code: 200
      body:
        type: "object"
        properties:
          - name: "code"
            type: "number"
          - name: "message"
            type: "string"
          - name: "data"
            type: "User"
```

## 完整解析示例

### 输入

```markdown
## 1. 获取用户列表

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/users |
| 描述 | 分页获取用户列表 |

**请求参数（Query）：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页条数，默认20 |
| keyword | string | 否 | 搜索关键词 |

**响应参数：**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码 |
| message | string | 提示信息 |
| data.items | array | 用户列表 |
| data.items[].id | int | 用户ID |
| data.items[].username | string | 用户名 |
| data.items[].email | string | 邮箱 |
| data.pagination.page | int | 当前页 |
| data.pagination.total | int | 总条数 |
```

### 输出

```typescript
// 类型定义
interface User {
  id: number;
  username: string;
  email: string;
}

interface Pagination {
  page: number;
  total: number;
}

interface UserListResponse {
  items: User[];
  pagination: Pagination;
}

interface UserQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
}

// API服务
const userService = {
  getList(params?: UserQueryParams): Promise<UserListResponse> {
    return get('/api/users', params);
  },
};
```
