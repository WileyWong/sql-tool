# TypeScript 敏感信息泄露检测规则

## 规则概述

| 规则ID | TS-003 |
|--------|--------|
| 名称 | 敏感信息泄露 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-200, CWE-532 |

---

## 检测模式

### 1. 硬编码敏感信息

**危险模式**:
```typescript
// ❌ 危险：硬编码密钥
const API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxx';
const SECRET = 'my-secret-key';
const password = 'admin123';

// ❌ 危险：配置文件中硬编码
export const config = {
  database: {
    password: 'root123',
  },
  jwt: {
    secret: 'jwt-secret-key',
  },
};
```

**检测正则**:
```regex
(api[_-]?key|apikey|secret|password|passwd|pwd|token|credential)\s*[:=]\s*["'][^"']+["']
(API[_-]?KEY|SECRET|PASSWORD|TOKEN)\s*=\s*["'][^"']+["']
```

**安全写法**:
```typescript
// ✅ 安全：使用环境变量
const API_KEY = process.env.API_KEY;
const SECRET = process.env.JWT_SECRET;

// ✅ 安全：使用配置服务
import { ConfigService } from '@nestjs/config';
const password = configService.get('DATABASE_PASSWORD');
```

---

### 2. console.log 打印敏感信息

**危险模式**:
```typescript
// ❌ 危险：日志打印敏感数据
console.log('Password:', password);
console.log('User:', user); // user 对象可能包含密码
console.debug('Token:', token);
console.info('API Key:', apiKey);
```

**检测正则**:
```regex
console\.(log|debug|info|warn|error)\s*\(.*?(password|token|secret|key|credential)
```

**安全写法**:
```typescript
// ✅ 安全：脱敏处理
console.log('User:', { ...user, password: '***' });

// ✅ 安全：使用专门的日志库
import { Logger } from '@nestjs/common';
logger.log('User login', { userId: user.id }); // 不记录敏感字段
```

---

### 3. 前端存储敏感信息

**危险模式**:
```typescript
// ❌ 危险：localStorage 存储敏感信息
localStorage.setItem('password', password);
localStorage.setItem('creditCard', cardNumber);

// ❌ 危险：sessionStorage 存储敏感信息
sessionStorage.setItem('token', accessToken);

// ❌ 危险：Cookie 不安全设置
document.cookie = `token=${token}`;
```

**检测正则**:
```regex
localStorage\.setItem\s*\(\s*["'](password|token|secret|key|card)
sessionStorage\.setItem\s*\(\s*["'](password|token|secret)
document\.cookie\s*=.*?(password|token|secret)
```

**安全写法**:
```typescript
// ✅ 安全：使用 httpOnly Cookie（后端设置）
// Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// ✅ 安全：内存存储（刷新后丢失）
let token: string | null = null;
export const setToken = (t: string) => { token = t; };
export const getToken = () => token;
```

---

### 4. 响应中暴露敏感字段

**危险模式**:
```typescript
// ❌ 危险：返回完整用户对象
app.get('/user/:id', (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user); // 可能包含 password, token 等
});

// ❌ 危险：错误信息泄露
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});
```

**安全写法**:
```typescript
// ✅ 安全：使用 DTO 过滤
class UserResponseDto {
  id: number;
  name: string;
  email: string;
  // 不包含 password, token
}

app.get('/user/:id', (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(new UserResponseDto(user));
});

// ✅ 安全：通用错误响应
app.use((err, req, res, next) => {
  console.error(err); // 仅记录到日志
  res.status(500).json({ error: 'Internal Server Error' });
});
```

---

### 5. 源码中的敏感注释

**危险模式**:
```typescript
// ❌ 危险：注释中包含敏感信息
// TODO: 临时密码 admin123，上线前删除
// 测试账号: test@example.com / password123
// API Key: sk-xxxxxxxx
```

**检测正则**:
```regex
//.*?(password|密码|账号|key|secret)\s*[:=]?\s*\S+
/\*.*?(password|密码|账号|key|secret).*?\*/
```

---

## 修复建议

### 1. 环境变量管理

```typescript
// .env 文件（不提交到 Git）
DATABASE_PASSWORD=xxx
JWT_SECRET=xxx

// 使用 dotenv
import * as dotenv from 'dotenv';
dotenv.config();

const password = process.env.DATABASE_PASSWORD;
```

### 2. 敏感字段过滤

```typescript
// 使用 class-transformer 排除字段
import { Exclude } from 'class-transformer';

class User {
  id: number;
  name: string;
  
  @Exclude()
  password: string;
  
  @Exclude()
  token: string;
}
```

### 3. 日志脱敏

```typescript
function maskSensitive(obj: any): any {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'card'];
  const masked = { ...obj };
  
  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      masked[key] = '***';
    }
  }
  
  return masked;
}
```

---

## 参考资源

- [OWASP Sensitive Data Exposure](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
