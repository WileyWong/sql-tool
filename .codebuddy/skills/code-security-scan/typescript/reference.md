# TypeScript 安全规则索引

本文档定义 TypeScript/JavaScript 项目的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| TS-XSS-001 | innerHTML 注入 | 🟠 高危 | XSS |
| TS-XSS-002 | dangerouslySetInnerHTML | 🟠 高危 | XSS |
| TS-XSS-003 | document.write | 🟠 高危 | XSS |
| TS-PROTO-001 | 原型污染 | 🔴 严重 | 原型污染 |
| TS-PROTO-002 | 不安全对象合并 | 🟠 高危 | 原型污染 |
| TS-EVAL-001 | eval 使用 | 🔴 严重 | 代码注入 |
| TS-EVAL-002 | Function 构造器 | 🔴 严重 | 代码注入 |
| TS-SQL-001 | SQL 字符串拼接 | 🔴 严重 | SQL注入 |
| TS-PATH-001 | 路径遍历 | 🔴 严重 | 文件操作 |
| TS-CMD-001 | 命令注入 | 🔴 严重 | 命令注入 |
| TS-LEAK-001 | 敏感信息暴露 | 🟠 高危 | 敏感信息 |
| TS-LEAK-002 | 控制台打印敏感信息 | 🟡 中危 | 敏感信息 |
| TS-CORS-001 | CORS 配置不当 | 🟡 中危 | 配置安全 |
| TS-DEP-001 | 不安全依赖 | 🟠 高危 | 依赖安全 |
| TS-SSRF-001 | 服务端请求伪造 | 🟠 高危 | SSRF |
| TS-LOG-001 | 安全日志缺失 | 🟡 中危 | 日志安全 |

---

## 详细规则

### TS-XSS-001: innerHTML 注入

**检测模式**:
```regex
\.innerHTML\s*=
\.outerHTML\s*=
insertAdjacentHTML
```

**危险代码**:
```typescript
// ❌ 危险
element.innerHTML = userInput;
element.insertAdjacentHTML('beforeend', userInput);
```

**安全代码**:
```typescript
// ✅ 安全: 使用 textContent
element.textContent = userInput;

// ✅ 安全: 使用 DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

### TS-XSS-002: dangerouslySetInnerHTML (React)

**检测模式**:
```regex
dangerouslySetInnerHTML
__html
```

**危险代码**:
```tsx
// ❌ 危险
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

**安全代码**:
```tsx
// ✅ 安全: React 默认转义
<div>{userInput}</div>

// ✅ 安全: 使用 DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />
```

---

### TS-PROTO-001: 原型污染

**检测模式**:
```regex
\[.*\]\s*=
Object\.assign\(.*,.*\)
_\.merge\(
_\.extend\(
_\.defaultsDeep\(
```

**危险代码**:
```typescript
// ❌ 危险: 动态属性赋值
const key = userInput; // 可能是 "__proto__"
obj[key] = value;

// ❌ 危险: 不安全的对象合并
Object.assign(target, userInput);
_.merge(target, userInput);
```

**安全代码**:
```typescript
// ✅ 安全: 验证属性名
const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
if (dangerousKeys.includes(key)) {
    throw new Error('Invalid key');
}
obj[key] = value;

// ✅ 安全: 使用 Object.create(null)
const safeObj = Object.create(null);
safeObj[key] = value;

// ✅ 安全: 使用 Map
const map = new Map();
map.set(key, value);
```

---

### TS-EVAL-001: eval 使用

**检测模式**:
```regex
eval\(
new\s+Function\(
setTimeout\(.*,.*\)  // 字符串参数
setInterval\(.*,.*\)  // 字符串参数
```

**危险代码**:
```typescript
// ❌ 危险
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);  // 字符串参数
```

**安全代码**:
```typescript
// ✅ 安全: 使用 JSON.parse
const data = JSON.parse(userInput);

// ✅ 安全: 使用函数引用
setTimeout(() => { doSomething(); }, 1000);
```

---

### TS-SQL-001: SQL 字符串拼接 (Node.js)

**检测模式**:
```regex
`SELECT.*\$\{
`INSERT.*\$\{
`UPDATE.*\$\{
`DELETE.*\$\{
\.query\(.*\+
```

**危险代码**:
```typescript
// ❌ 危险
const query = `SELECT * FROM users WHERE id = ${userId}`;
await db.query(query);
```

**安全代码**:
```typescript
// ✅ 安全: 参数化查询
const query = 'SELECT * FROM users WHERE id = ?';
await db.query(query, [userId]);

// ✅ 安全: 使用 ORM
const user = await User.findOne({ where: { id: userId } });
```

---

### TS-CMD-001: 命令注入 (Node.js)

**检测模式**:
```regex
child_process\.exec\(
child_process\.execSync\(
spawn\(.*shell.*true
```

**危险代码**:
```typescript
// ❌ 危险
import { exec } from 'child_process';
exec(`cat ${filename}`);
```

**安全代码**:
```typescript
// ✅ 安全: 使用 execFile
import { execFile } from 'child_process';
execFile('cat', [filename]);

// ✅ 安全: 使用 spawn 数组参数
import { spawn } from 'child_process';
spawn('cat', [filename]);
```

---

### TS-PATH-001: 路径遍历 (Node.js)

**检测模式**:
```regex
path\.join\(.*\+
fs\.readFile\(.*\+
fs\.writeFile\(.*\+
```

**危险代码**:
```typescript
// ❌ 危险
import * as fs from 'fs';
const content = fs.readFileSync(`/uploads/${filename}`);
```

**安全代码**:
```typescript
// ✅ 安全: 路径验证
import * as path from 'path';
import * as fs from 'fs';

const basePath = '/uploads';
const fullPath = path.join(basePath, path.normalize(filename));

if (!fullPath.startsWith(basePath)) {
    throw new Error('Path traversal detected');
}

const content = fs.readFileSync(fullPath);
```

---

## 前端框架特定规则

### React

| 规则 | 检测模式 | 风险 |
|------|---------|------|
| dangerouslySetInnerHTML | `dangerouslySetInnerHTML` | 🟠 高危 |
| href javascript: | `href.*javascript:` | 🟠 高危 |
| 不安全的 ref | `ref.*innerHTML` | 🟠 高危 |

### Vue

| 规则 | 检测模式 | 风险 |
|------|---------|------|
| v-html | `v-html` | 🟠 高危 |
| 动态组件 | `:is.*userInput` | 🟠 高危 |
| 不安全模板 | `v-bind.*userInput` | 🟡 中危 |

### Angular

| 规则 | 检测模式 | 风险 |
|------|---------|------|
| bypassSecurityTrust | `bypassSecurityTrust` | 🟠 高危 |
| innerHTML 绑定 | `[innerHTML]` | 🟠 高危 |

---

## 检测优先级

### 第一优先级（严重）
1. TS-PROTO-001
2. TS-EVAL-001, TS-EVAL-002
3. TS-SQL-001
4. TS-PATH-001
5. TS-CMD-001

### 第二优先级（高危）
1. TS-XSS-001, TS-XSS-002, TS-XSS-003
2. TS-PROTO-002
3. TS-LEAK-001
4. TS-DEP-001
5. TS-SSRF-001

### 第三优先级（中危）
1. TS-LEAK-002
2. TS-CORS-001
3. TS-LOG-001

---

## 详细规则文件

| 规则类别 | 文件 | 说明 |
|---------|------|------|
| XSS | [rules/xss.md](rules/xss.md) | innerHTML, dangerouslySetInnerHTML, v-html |
| 原型污染 | [rules/prototype-pollution.md](rules/prototype-pollution.md) | 对象合并、动态属性访问 |
| 敏感信息 | [rules/sensitive-data.md](rules/sensitive-data.md) | 硬编码、localStorage、console.log |
| 注入攻击 | [rules/injection.md](rules/injection.md) | SQL、NoSQL、命令、模板注入 |
| 认证授权 | [rules/auth.md](rules/auth.md) | JWT、Session、IDOR |
| SSRF | [rules/ssrf.md](rules/ssrf.md) | fetch、axios 请求伪造 |
| 日志安全 | [rules/logging.md](rules/logging.md) | 安全事件日志 |

---

## 安全工具推荐

| 工具 | 用途 |
|------|------|
| `eslint-plugin-security` | ESLint 安全规则 |
| `npm audit` | 依赖漏洞检测 |
| `snyk` | 安全扫描 |
| `DOMPurify` | XSS 防护库 |

---

**版本**: 1.2.0  
**更新时间**: 2025-12-22
