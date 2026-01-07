# TypeScript 原型污染检测规则

## 规则概述

| 规则ID | TS-002 |
|--------|--------|
| 名称 | 原型污染 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-1321 |

---

## 检测模式

### 1. 不安全的对象合并

**危险模式**:
```typescript
// ❌ 危险：递归合并用户输入
function merge(target: any, source: any) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ❌ 危险：Object.assign 合并用户输入
Object.assign(target, userInput);

// ❌ 危险：展开运算符合并不可信数据
const merged = { ...defaults, ...userInput };
```

**攻击示例**:
```typescript
// 攻击者输入
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, malicious);

// 现在所有对象都有 isAdmin = true
const user = {};
console.log(user.isAdmin); // true
```

**检测正则**:
```regex
for\s*\(\s*(const|let|var)\s+\w+\s+in\s+
Object\.assign\s*\(\s*[^,]+,\s*[^)]+\)
\{\s*\.\.\.[^}]+,\s*\.\.\.[^}]+\}
```

---

### 2. 动态属性访问

**危险模式**:
```typescript
// ❌ 危险：用户输入作为属性名
obj[userInput] = value;
target[key] = source[key];

// ❌ 危险：路径解析
function setByPath(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys.slice(0, -1)) {
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}
```

**检测正则**:
```regex
\[\s*\w+\s*\]\s*=
\.split\s*\(\s*["']\.\s*["']\s*\)
```

---

### 3. JSON.parse 后直接使用

**危险模式**:
```typescript
// ❌ 危险：解析后直接合并
const data = JSON.parse(userInput);
Object.assign(config, data);

// ❌ 危险：解析后直接访问
const parsed = JSON.parse(body);
obj[parsed.key] = parsed.value;
```

---

## 修复建议

### 1. 过滤危险属性

```typescript
// 安全的对象合并
function safeMerge(target: any, source: any): any {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (const key in source) {
    if (dangerousKeys.includes(key)) {
      continue; // 跳过危险属性
    }
    
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue; // 只处理自有属性
    }
    
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = safeMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
```

### 2. 使用 Object.create(null)

```typescript
// 创建无原型的对象
const safeObj = Object.create(null);
safeObj.key = value; // 安全，无法污染原型
```

### 3. 使用 Map 替代对象

```typescript
// 使用 Map 存储动态键值
const config = new Map<string, any>();
config.set(userKey, userValue);
```

### 4. 冻结原型

```typescript
// 冻结 Object 原型
Object.freeze(Object.prototype);
```

### 5. 属性名白名单

```typescript
function safeSet(obj: any, key: string, value: any) {
  const allowedKeys = ['name', 'email', 'age'];
  if (allowedKeys.includes(key)) {
    obj[key] = value;
  }
}
```

### 6. 使用安全的库

```typescript
// 使用 lodash 的安全版本
import { merge } from 'lodash';
// lodash 4.17.21+ 已修复原型污染

// 或使用专门的安全合并库
import deepmerge from 'deepmerge';
```

---

## 参考资源

- [OWASP Prototype Pollution](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)
- [Snyk Prototype Pollution](https://learn.snyk.io/lessons/prototype-pollution/javascript/)
