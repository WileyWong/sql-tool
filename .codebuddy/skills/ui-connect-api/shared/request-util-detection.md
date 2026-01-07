# 请求工具类检测与适配

> 适配项目自有的 HTTP 请求封装，生成与项目风格一致的 API 调用代码

## 检测优先级

```
优先级1: 用户当前输入指定
    ↓
优先级2: 用户提供示例代码
    ↓
优先级3: 项目记忆配置 (.spec-code/memory/context.md)
    ↓
优先级4: 项目文件检测
    ↓
优先级5: 默认模板 (Axios/wx.request)
```

---

## 优先级1: 用户当前输入指定

### 识别模式

```yaml
指定格式:
  - "使用 @/utils/request"
  - "用 @/api/http 的 http.get"
  - "导入 request from '@/services/request'"
  - "项目用的是 axios 实例"

提取内容:
  - 导入路径: @/utils/request, @/api/http
  - 导出名称: request, http, axios
  - 调用方式: request.get, http.post
```

### 解析示例

```typescript
// 用户输入: "使用 @/utils/request 的 request.get/post"
const config = {
  importPath: '@/utils/request',
  exportName: 'request',
  callStyle: 'method', // request.get()
  methods: {
    get: 'request.get',
    post: 'request.post',
    put: 'request.put',
    delete: 'request.delete',
  },
};
```

---

## 优先级2: 用户提供示例代码

### 识别特征

当用户提供类似以下代码时，从中学习调用风格：

```typescript
// 示例1: 函数式调用
import { request } from '@/utils/request';
export const getUser = (id: number) => request.get(`/api/users/${id}`);

// 示例2: 类方法调用
import { http } from '@/api/http';
export function getUserList(params: QueryParams) {
  return http.get<UserListResponse>('/api/users', { params });
}

// 示例3: Axios 实例
import axios from '@/utils/axios';
export const createUser = (data: CreateUserDTO) => axios.post('/api/users', data);
```

### 提取规则

```typescript
interface LearnedConfig {
  // 从 import 语句提取
  importPath: string;      // '@/utils/request'
  exportName: string;      // 'request'
  isDefault: boolean;      // import xxx vs import { xxx }
  
  // 从调用语句提取
  callStyle: 'method' | 'function';  // request.get() vs get()
  hasGeneric: boolean;     // request.get<T>() 是否支持泛型
  
  // 从参数提取
  paramStyle: 'positional' | 'object';  // (url, data) vs ({ url, data })
  hasParamsWrapper: boolean;  // { params } 包装
}

function learnFromExample(code: string): LearnedConfig {
  // 1. 提取 import 语句
  const importMatch = code.match(/import\s+(?:{?\s*(\w+)\s*}?|(\w+))\s+from\s+['"]([^'"]+)['"]/);
  
  // 2. 提取调用语句
  const callMatch = code.match(/(\w+)\.(get|post|put|delete|patch)<?\w*>?\s*\(/);
  
  // 3. 分析参数风格
  const paramsMatch = code.match(/\(\s*['"`][^'"`]+['"`]\s*,\s*(\{|\w)/);
  
  return {
    importPath: importMatch?.[3] || '',
    exportName: importMatch?.[1] || importMatch?.[2] || '',
    isDefault: !importMatch?.[1],
    callStyle: callMatch ? 'method' : 'function',
    hasGeneric: /<\w+>/.test(code),
    paramStyle: paramsMatch?.[1] === '{' ? 'object' : 'positional',
    hasParamsWrapper: /\{\s*params\s*\}/.test(code),
  };
}
```

---

## 优先级3: 项目记忆配置

### 配置位置

`.spec-code/memory/context.md` 中的 `## API 请求配置` 节：

```markdown
## API 请求配置

### 请求工具类
- **导入路径**: `@/utils/request`
- **导出名称**: `request`
- **调用风格**: 方法式 (request.get/post/put/delete)

### 请求方法映射
| 标准方法 | 项目方法 | 说明 |
|---------|---------|------|
| GET | `request.get(url, params)` | params 直接传递 |
| POST | `request.post(url, data)` | data 为请求体 |
| PUT | `request.put(url, data)` | |
| DELETE | `request.delete(url)` | |

### 响应结构
```typescript
interface Response<T> {
  code: number;      // 0 表示成功
  msg: string;       // 提示信息
  data: T;           // 业务数据
}
```

### 泛型支持
- **支持泛型**: 是
- **泛型位置**: `request.get<T>(url)`

### 示例代码
```typescript
import { request } from '@/utils/request';

// GET 请求
export function getUserList(params: UserQueryParams) {
  return request.get<UserListResponse>('/api/users', params);
}

// POST 请求
export function createUser(data: CreateUserDTO) {
  return request.post<User>('/api/users', data);
}
```
```

### 解析配置

```typescript
interface ProjectRequestConfig {
  importPath: string;
  exportName: string;
  callStyle: 'method' | 'function';
  methods: {
    get: string;
    post: string;
    put: string;
    delete: string;
  };
  responseType?: string;
  hasGeneric: boolean;
}

function parseProjectConfig(contextMd: string): ProjectRequestConfig | null {
  const apiSection = extractSection(contextMd, '## API 请求配置');
  if (!apiSection) return null;
  
  return {
    importPath: extractField(apiSection, '导入路径'),
    exportName: extractField(apiSection, '导出名称'),
    callStyle: extractField(apiSection, '调用风格')?.includes('方法') ? 'method' : 'function',
    methods: extractMethodMapping(apiSection),
    hasGeneric: extractField(apiSection, '支持泛型') === '是',
  };
}
```

---

## 优先级4: 项目文件检测

### 检测路径（按优先级）

```yaml
常见请求封装路径:
  - src/utils/request.ts
  - src/utils/request.js
  - src/api/http.ts
  - src/api/request.ts
  - src/services/request.ts
  - src/utils/http.ts
  - src/lib/request.ts
```

### 检测逻辑

```typescript
async function detectRequestUtil(projectPath: string): Promise<RequestUtilConfig | null> {
  const searchPaths = [
    'src/utils/request.ts',
    'src/utils/request.js',
    'src/api/http.ts',
    'src/api/request.ts',
    'src/services/request.ts',
  ];
  
  for (const relativePath of searchPaths) {
    const fullPath = path.join(projectPath, relativePath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath);
      return analyzeRequestFile(content, relativePath);
    }
  }
  
  return null;
}

function analyzeRequestFile(content: string, filePath: string): RequestUtilConfig {
  // 分析导出
  const defaultExport = /export\s+default\s+(\w+)/.exec(content);
  const namedExport = /export\s+(?:const|function|class)\s+(\w+)/.exec(content);
  
  // 分析是否基于 axios
  const isAxiosBased = /import\s+.*axios/.test(content);
  
  // 分析方法
  const hasMethods = /\.(get|post|put|delete)\s*[=<(]/.test(content);
  
  return {
    importPath: '@/' + filePath.replace(/\.(ts|js)$/, '').replace(/^src\//, ''),
    exportName: defaultExport?.[1] || namedExport?.[1] || 'request',
    isDefault: !!defaultExport,
    callStyle: hasMethods ? 'method' : 'function',
    basedOn: isAxiosBased ? 'axios' : 'fetch',
  };
}
```

---

## 优先级5: 默认模板

### Vue 项目默认 (Axios)

```typescript
import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export { request };
```

### 小程序默认 (wx.request)

```typescript
export function request<T>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (res) => resolve(res.data as T),
      fail: reject,
    });
  });
}
```

---

## 代码生成适配

### 适配模板

根据检测到的配置，使用对应的代码模板：

#### 模板1: 方法式调用 (request.get)

```typescript
import { {{exportName}} } from '{{importPath}}';

{{#each apis}}
export function {{functionName}}({{params}}): Promise<{{responseType}}> {
  return {{exportName}}.{{method}}{{#if hasGeneric}}<{{responseType}}>{{/if}}('{{path}}'{{#if hasData}}, {{data}}{{/if}});
}
{{/each}}
```

#### 模板2: 函数式调用 (get, post)

```typescript
import { get, post, put, del } from '{{importPath}}';

{{#each apis}}
export function {{functionName}}({{params}}): Promise<{{responseType}}> {
  return {{method}}{{#if hasGeneric}}<{{responseType}}>{{/if}}('{{path}}'{{#if hasData}}, {{data}}{{/if}});
}
{{/each}}
```

#### 模板3: Axios 实例

```typescript
import axios from '{{importPath}}';

{{#each apis}}
export function {{functionName}}({{params}}): Promise<{{responseType}}> {
  return axios.{{method}}{{#if hasGeneric}}<{{responseType}}>{{/if}}('{{path}}'{{#if hasData}}, {{data}}{{/if}});
}
{{/each}}
```

---

## 配置输出格式

```yaml
request_util_config:
  source: "项目记忆"  # 用户指定/示例学习/项目记忆/文件检测/默认
  
  import:
    path: "@/utils/request"
    name: "request"
    isDefault: false
  
  call:
    style: "method"  # method | function
    hasGeneric: true
    methods:
      get: "request.get"
      post: "request.post"
      put: "request.put"
      delete: "request.delete"
  
  response:
    type: "Promise<Response<T>>"
    needsUnwrap: false  # 是否需要 .data 解构
```

---

## 注意事项

1. **优先用户意图**: 用户明确指定的配置优先级最高
2. **示例学习**: 从用户提供的示例代码中学习，保持风格一致
3. **项目一致性**: 生成的代码应与项目现有代码风格保持一致
4. **向后兼容**: 无配置时使用默认模板，确保功能可用
5. **类型安全**: 保持泛型支持，确保类型推断正确
