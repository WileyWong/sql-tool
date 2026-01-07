# TypeScript 注入攻击检测规则

## 规则概述

| 规则ID | TS-004 |
|--------|--------|
| 名称 | 注入攻击 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-89, CWE-78, CWE-94 |

---

## 检测模式

### 1. SQL 注入（Node.js）

**危险模式**:
```typescript
// ❌ 危险：字符串拼接 SQL
const query = `SELECT * FROM users WHERE name = '${name}'`;
const query = "SELECT * FROM users WHERE id = " + id;

// ❌ 危险：模板字符串拼接
db.query(`SELECT * FROM users WHERE email = '${email}'`);
connection.execute("DELETE FROM users WHERE id = " + userId);
```

**检测正则**:
```regex
(SELECT|INSERT|UPDATE|DELETE|WHERE).*?\$\{
(SELECT|INSERT|UPDATE|DELETE|WHERE).*?\s*\+\s*
db\.(query|execute)\s*\(\s*`.*?\$\{
```

**安全写法**:
```typescript
// ✅ 安全：参数化查询
db.query('SELECT * FROM users WHERE name = ?', [name]);
db.query('SELECT * FROM users WHERE id = $1', [id]);

// ✅ 安全：使用 ORM
const user = await userRepository.findOne({ where: { name } });
```

---

### 2. NoSQL 注入（MongoDB）

**危险模式**:
```typescript
// ❌ 危险：直接使用用户输入作为查询条件
const user = await User.findOne({ username: req.body.username });

// ❌ 危险：$where 操作符
db.collection.find({ $where: `this.name == '${name}'` });

// ❌ 危险：用户输入作为操作符
const query = { [req.body.field]: req.body.value };
```

**攻击示例**:
```typescript
// 攻击者输入 { "$gt": "" }
// 查询变成 { password: { "$gt": "" } } 匹配所有用户
```

**安全写法**:
```typescript
// ✅ 安全：类型验证
if (typeof username !== 'string') {
  throw new Error('Invalid input');
}
const user = await User.findOne({ username });

// ✅ 安全：使用 mongoose-sanitize
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

---

### 3. 命令注入

**危险模式**:
```typescript
// ❌ 危险：exec 执行用户输入
import { exec } from 'child_process';
exec(`ls ${userInput}`);
exec('cat ' + filename);

// ❌ 危险：spawn 使用 shell
spawn('sh', ['-c', `echo ${userInput}`]);
```

**检测正则**:
```regex
exec\s*\(\s*`.*?\$\{
exec\s*\(\s*["'].*?\s*\+
spawn\s*\(\s*["'](sh|bash|cmd)["']
```

**安全写法**:
```typescript
// ✅ 安全：使用参数数组
import { execFile, spawn } from 'child_process';
execFile('ls', ['-la', sanitizedPath]);
spawn('cat', [filename]); // 不使用 shell
```

---

### 4. 模板注入（SSTI）

**危险模式**:
```typescript
// ❌ 危险：用户输入作为模板
import ejs from 'ejs';
ejs.render(userInput, data);

import pug from 'pug';
pug.render(userInput);

import Handlebars from 'handlebars';
Handlebars.compile(userInput)(data);
```

**检测正则**:
```regex
ejs\.render\s*\(\s*[^"'`]
pug\.render\s*\(\s*[^"'`]
Handlebars\.compile\s*\(\s*[^"'`]
```

**安全写法**:
```typescript
// ✅ 安全：使用预定义模板
ejs.renderFile('template.ejs', { data: userInput });
```

---

### 5. 正则表达式注入（ReDoS）

**危险模式**:
```typescript
// ❌ 危险：用户输入作为正则
const regex = new RegExp(userInput);
const match = text.match(new RegExp(pattern));

// ❌ 危险：易受 ReDoS 攻击的正则
const regex = /^(a+)+$/;
const regex = /([a-zA-Z]+)*$/;
```

**检测正则**:
```regex
new\s+RegExp\s*\(\s*[^"'/]
\(\[.*?\]\+\)\+
\(\[.*?\]\*\)\*
```

**安全写法**:
```typescript
// ✅ 安全：转义用户输入
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const regex = new RegExp(escapeRegExp(userInput));

// ✅ 安全：使用 safe-regex 检查
import safeRegex from 'safe-regex';
if (!safeRegex(pattern)) {
  throw new Error('Unsafe regex pattern');
}
```

---

## 修复建议

### 1. 输入验证

```typescript
import Joi from 'joi';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

const { error, value } = schema.validate(req.body);
if (error) {
  throw new BadRequestException(error.message);
}
```

### 2. 使用 ORM/ODM

```typescript
// TypeORM
const user = await userRepository.findOne({
  where: { email: email }
});

// Prisma
const user = await prisma.user.findUnique({
  where: { email }
});

// Mongoose
const user = await User.findOne({ email }).exec();
```

### 3. 参数化查询

```typescript
// mysql2
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// pg
const result = await client.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

---

## 参考资源

- [OWASP Injection](https://owasp.org/www-community/Injection_Flaws)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
