# TypeScript 日志规范

> 继承自 [通用日志规范](../common/logging.md)

## 日志框架选择

| 框架 | 适用场景 | 特点 |
|------|---------|------|
| **winston** | Node.js 服务端 | 功能全面，支持多种传输 |
| **pino** | 高性能服务 | JSON 日志，性能优异 |
| **console** | 前端/简单场景 | 内置，无需依赖 |

---

## Winston 配置

### 基础配置

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
```

### 使用示例

```typescript
// ✅ 带上下文的日志
logger.info('用户登录成功', { userId: 1001, ip: '192.168.1.1' });
logger.error('支付失败', { orderId: 2001, error: err.message, stack: err.stack });

// ✅ 子 logger（添加固定上下文）
const orderLogger = logger.child({ module: 'order' });
orderLogger.info('订单创建', { orderId: 1001 });
```

---

## Pino 配置

### 基础配置

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

export default logger;
```

### 使用示例

```typescript
// ✅ 结构化日志
logger.info({ userId: 1001, action: 'login' }, '用户登录成功');
logger.error({ orderId: 2001, err }, '支付失败');

// ✅ 子 logger
const childLogger = logger.child({ module: 'payment' });
childLogger.info({ amount: 100 }, '支付请求');
```

---

## 前端日志

### 封装 Console

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private context: LogContext;

  constructor(level: LogLevel = 'info', context: LogContext = {}) {
    this.level = level;
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(level: LogLevel, message: string, ctx?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const mergedContext = { ...this.context, ...ctx };
    const contextStr = Object.keys(mergedContext).length
      ? ` | ${JSON.stringify(mergedContext)}`
      : '';

    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`);
  }

  debug(message: string, ctx?: LogContext): void {
    this.formatMessage('debug', message, ctx);
  }

  info(message: string, ctx?: LogContext): void {
    this.formatMessage('info', message, ctx);
  }

  warn(message: string, ctx?: LogContext): void {
    this.formatMessage('warn', message, ctx);
  }

  error(message: string, ctx?: LogContext): void {
    this.formatMessage('error', message, ctx);
  }

  child(ctx: LogContext): Logger {
    return new Logger(this.level, { ...this.context, ...ctx });
  }
}

export const logger = new Logger(
  (process.env.NODE_ENV === 'development' ? 'debug' : 'info') as LogLevel
);
```

### 使用示例

```typescript
// ✅ 基本使用
logger.info('页面加载完成', { page: '/home' });
logger.error('API 请求失败', { url: '/api/users', status: 500 });

// ✅ 子 logger
const apiLogger = logger.child({ module: 'api' });
apiLogger.info('请求发送', { method: 'GET', url: '/users' });
```

---

## 日志最佳实践

### ✅ 推荐

```typescript
// 1. 结构化日志
logger.info('订单创建成功', { orderId, userId, amount });

// 2. 错误日志包含堆栈
logger.error('处理失败', { error: err.message, stack: err.stack });

// 3. 使用子 logger 添加模块上下文
const moduleLogger = logger.child({ module: 'payment' });

// 4. 敏感信息脱敏
logger.info('用户登录', { userId, phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') });
```

### ❌ 避免

```typescript
// 1. 无上下文日志
logger.info('success');

// 2. 直接打印对象（可能包含敏感信息）
logger.info(user);

// 3. 字符串拼接
logger.info('用户 ' + userId + ' 登录成功');

// 4. 循环内大量日志
for (const item of items) {
  logger.debug('处理项目', { item }); // ❌ 性能问题
}
// ✅ 改为汇总
logger.info('批量处理完成', { count: items.length });
```

---

## 检查清单

- [ ] 使用结构化日志（JSON 格式）
- [ ] 包含必要上下文（userId、traceId 等）
- [ ] 错误日志包含堆栈信息
- [ ] 敏感信息已脱敏
- [ ] 生产环境关闭 debug 日志
- [ ] 避免循环内大量日志

## 参考

- [通用日志规范](../common/logging.md)
- [Winston 文档](https://github.com/winstonjs/winston)
- [Pino 文档](https://github.com/pinojs/pino)
