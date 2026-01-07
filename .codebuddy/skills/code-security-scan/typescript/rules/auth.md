# TypeScript 认证授权检测规则

## 规则概述

| 规则ID | TS-005 |
|--------|--------|
| 名称 | 认证授权缺陷 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-287, CWE-863 |

---

## 检测模式

### 1. 缺少认证中间件

**危险模式**:
```typescript
// ❌ 危险：敏感路由无认证
app.get('/api/users', async (req, res) => {
  const users = await userService.findAll();
  res.json(users);
});

app.delete('/api/users/:id', async (req, res) => {
  await userService.delete(req.params.id);
  res.json({ success: true });
});
```

**安全写法**:
```typescript
// ✅ 安全：添加认证中间件
app.get('/api/users', authMiddleware, async (req, res) => {
  const users = await userService.findAll();
  res.json(users);
});

// ✅ 安全：使用装饰器（NestJS）
@UseGuards(AuthGuard)
@Get('users')
async findAll() {
  return this.userService.findAll();
}
```

---

### 2. JWT 不安全配置

**危险模式**:
```typescript
// ❌ 危险：不验证签名
jwt.decode(token); // 只解码，不验证

// ❌ 危险：弱密钥
jwt.sign(payload, 'secret');
jwt.sign(payload, '123456');

// ❌ 危险：不安全的算法
jwt.verify(token, key, { algorithms: ['none'] });
jwt.sign(payload, '', { algorithm: 'none' });
```

**检测正则**:
```regex
jwt\.decode\s*\(
jwt\.sign\s*\(\s*\w+\s*,\s*["'][^"']{1,10}["']
algorithms\s*:\s*\[.*?["']none["']
algorithm\s*:\s*["']none["']
```

**安全写法**:
```typescript
// ✅ 安全：使用强密钥和安全算法
const secret = process.env.JWT_SECRET; // 至少 256 位
const token = jwt.sign(payload, secret, {
  algorithm: 'HS256',
  expiresIn: '1h',
});

// ✅ 安全：验证时指定算法
const decoded = jwt.verify(token, secret, {
  algorithms: ['HS256'],
});
```

---

### 3. 不安全的密码处理

**危险模式**:
```typescript
// ❌ 危险：明文存储密码
user.password = req.body.password;
await user.save();

// ❌ 危险：使用 MD5/SHA1
const hash = crypto.createHash('md5').update(password).digest('hex');
const hash = crypto.createHash('sha1').update(password).digest('hex');

// ❌ 危险：简单比较（时序攻击）
if (user.password === inputPassword) { ... }
```

**检测正则**:
```regex
createHash\s*\(\s*["'](md5|sha1)["']\s*\)
\.password\s*=\s*req\.body\.password
\.password\s*===?\s*\w+
```

**安全写法**:
```typescript
// ✅ 安全：使用 bcrypt
import bcrypt from 'bcrypt';

// 哈希密码
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);

// 验证密码
const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
```

---

### 4. 会话管理缺陷

**危险模式**:
```typescript
// ❌ 危险：不安全的 session 配置
app.use(session({
  secret: 'secret',
  cookie: { secure: false },
}));

// ❌ 危险：登录后不重新生成 session
app.post('/login', (req, res) => {
  // 验证用户...
  req.session.user = user;
  res.json({ success: true });
});
```

**安全写法**:
```typescript
// ✅ 安全：正确的 session 配置
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // 仅 HTTPS
    httpOnly: true,    // 防止 XSS
    sameSite: 'strict', // 防止 CSRF
    maxAge: 3600000,   // 1 小时
  },
}));

// ✅ 安全：登录后重新生成 session
app.post('/login', (req, res) => {
  // 验证用户...
  req.session.regenerate((err) => {
    req.session.user = user;
    res.json({ success: true });
  });
});
```

---

### 5. IDOR（不安全的直接对象引用）

**危险模式**:
```typescript
// ❌ 危险：直接使用 URL 参数访问资源
app.get('/api/orders/:id', async (req, res) => {
  const order = await orderService.findById(req.params.id);
  res.json(order);
});

// ❌ 危险：用户可访问任意用户数据
app.get('/api/users/:userId/profile', async (req, res) => {
  const profile = await profileService.findByUserId(req.params.userId);
  res.json(profile);
});
```

**安全写法**:
```typescript
// ✅ 安全：验证资源所有权
app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  const order = await orderService.findById(req.params.id);
  
  // 验证当前用户是否有权访问
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(order);
});

// ✅ 安全：使用当前用户 ID
app.get('/api/profile', authMiddleware, async (req, res) => {
  const profile = await profileService.findByUserId(req.user.id);
  res.json(profile);
});
```

---

## 修复建议

### 1. 使用成熟的认证库

```typescript
// Passport.js
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';

passport.use(new JwtStrategy(opts, (payload, done) => {
  User.findById(payload.sub)
    .then(user => done(null, user || false))
    .catch(err => done(err, false));
}));
```

### 2. 实现 RBAC

```typescript
// 角色检查中间件
function requireRole(...roles: string[]) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.delete('/api/users/:id', authMiddleware, requireRole('admin'), deleteUser);
```

### 3. 速率限制

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 最多 5 次尝试
  message: 'Too many login attempts',
});

app.post('/login', loginLimiter, loginHandler);
```

---

## 参考资源

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
