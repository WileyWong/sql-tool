# 前端日志规范

> 继承自 [通用日志规范](../common/logging.md)，本文档补充前端（Vue/React/小程序）特有规则

---

## 适用范围

| 平台 | 框架 | 说明 |
|------|------|------|
| Web | Vue 2/3, React | 浏览器环境 |
| 小程序 | 微信/支付宝/抖音 | 小程序环境 |
| Node.js | SSR/BFF | 服务端渲染 |

---

## 日志级别使用

### 前端日志级别

| 级别 | 使用场景 | 生产环境 |
|------|---------|---------|
| **error** | 运行时错误、接口异常 | ✅ 保留并上报 |
| **warn** | 潜在问题、废弃 API | ⚠️ 可选保留 |
| **info** | 关键业务节点 | ❌ 关闭 |
| **debug** | 调试信息 | ❌ 关闭 |
| **log** | 通用日志 | ❌ 关闭 |

---

## 日志工具封装

### 基础 Logger 类

```typescript
// utils/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level: LogLevel;
  enableConsole: boolean;
  enableReport: boolean;
  reportUrl?: string;
}

interface LogContext {
  userId?: string;
  traceId?: string;
  page?: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private options: LoggerOptions;
  private context: LogContext = {};

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      level: import.meta.env.PROD ? 'error' : 'debug',
      enableConsole: !import.meta.env.PROD,
      enableReport: import.meta.env.PROD,
      ...options,
    };
  }

  /**
   * 设置全局上下文
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * 创建子 Logger
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger(this.options);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = error instanceof Error
      ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
      : { error };
    this.log('error', message, { ...errorData, ...data });
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.options.level]) {
      return;
    }

    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...data,
    };

    // 控制台输出
    if (this.options.enableConsole) {
      this.consoleLog(level, message, logData);
    }

    // 上报到监控平台
    if (this.options.enableReport && level === 'error') {
      this.report(logData);
    }
  }

  private consoleLog(level: LogLevel, message: string, data: Record<string, unknown>): void {
    const styles = {
      debug: 'color: #9E9E9E',
      info: 'color: #2196F3',
      warn: 'color: #FF9800',
      error: 'color: #F44336',
    };

    console[level](`%c[${level.toUpperCase()}]`, styles[level], message, data);
  }

  private report(data: Record<string, unknown>): void {
    if (!this.options.reportUrl) return;

    // 使用 sendBeacon 确保页面关闭时也能发送
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.options.reportUrl, JSON.stringify(data));
    } else {
      fetch(this.options.reportUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  }
}

// 导出单例
export const logger = new Logger();

// 导出类供自定义
export { Logger };
export type { LogLevel, LoggerOptions, LogContext };
```

### 使用示例

```typescript
import { logger } from '@/utils/logger';

// 设置全局上下文
logger.setContext({
  userId: userStore.userId,
  traceId: generateTraceId(),
});

// 页面级 Logger
const pageLogger = logger.child({ page: 'OrderList' });

// 使用
pageLogger.info('页面加载', { source: 'menu' });
pageLogger.error('订单加载失败', error, { orderId: '123' });
```

---

## Vue 集成

### Vue 3 插件

```typescript
// plugins/logger.ts
import type { App, ComponentPublicInstance } from 'vue';
import { logger, Logger } from '@/utils/logger';

export const loggerPlugin = {
  install(app: App) {
    // 全局属性
    app.config.globalProperties.$logger = logger;

    // 全局错误处理
    app.config.errorHandler = (err, instance, info) => {
      logger.error('Vue Error', err as Error, {
        component: instance?.$options.name || 'Unknown',
        info,
      });
    };

    // 全局警告处理（仅开发环境）
    if (import.meta.env.DEV) {
      app.config.warnHandler = (msg, instance, trace) => {
        logger.warn('Vue Warning', {
          message: msg,
          component: instance?.$options.name || 'Unknown',
          trace,
        });
      };
    }
  },
};

// 类型声明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $logger: Logger;
  }
}
```

### Composition API Hook

```typescript
// composables/useLogger.ts
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { logger } from '@/utils/logger';

export function useLogger(moduleName?: string) {
  const instance = getCurrentInstance();
  const componentName = instance?.type.name || moduleName || 'Unknown';
  
  const componentLogger = logger.child({ component: componentName });

  onMounted(() => {
    componentLogger.debug('组件挂载');
  });

  onUnmounted(() => {
    componentLogger.debug('组件卸载');
  });

  return componentLogger;
}

// 使用
const logger = useLogger('OrderList');
logger.info('订单列表加载', { count: orders.length });
```

### Vue 2 Mixin

```javascript
// mixins/logger.js
import { logger } from '@/utils/logger';

export const loggerMixin = {
  computed: {
    $logger() {
      return logger.child({ component: this.$options.name || 'Unknown' });
    },
  },
  
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.$logger.debug('组件挂载');
    }
  },
  
  errorCaptured(err, vm, info) {
    this.$logger.error('组件错误', err, { info });
    return false; // 阻止错误继续传播
  },
};
```

---

## 小程序集成

### 微信小程序 Logger

```typescript
// utils/mp-logger.ts

interface MPLoggerOptions {
  enableConsole: boolean;
  enableReport: boolean;
  reportUrl?: string;
}

class MPLogger {
  private options: MPLoggerOptions;
  private context: Record<string, unknown> = {};
  private realtimeLogger: WechatMiniprogram.RealtimeLogManager | null = null;

  constructor(options: Partial<MPLoggerOptions> = {}) {
    const isProduction = !__wxConfig?.envVersion || __wxConfig.envVersion === 'release';
    
    this.options = {
      enableConsole: !isProduction,
      enableReport: isProduction,
      ...options,
    };

    // 初始化实时日志
    if (wx.getRealtimeLogManager) {
      this.realtimeLogger = wx.getRealtimeLogManager();
    }
  }

  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
    
    // 设置实时日志过滤关键字
    if (this.realtimeLogger && context.userId) {
      this.realtimeLogger.setFilterMsg(String(context.userId));
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = error instanceof Error
      ? { errorName: error.name, errorMessage: error.message }
      : { error };
    this.log('error', message, { ...errorData, ...data });
  }

  private log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...data,
    };

    // 控制台输出（开发环境）
    if (this.options.enableConsole) {
      console[level](`[${level.toUpperCase()}]`, message, logData);
    }

    // 实时日志上报
    if (this.realtimeLogger) {
      switch (level) {
        case 'debug':
          this.realtimeLogger.info(message, logData);
          break;
        case 'info':
          this.realtimeLogger.info(message, logData);
          break;
        case 'warn':
          this.realtimeLogger.warn(message, logData);
          break;
        case 'error':
          this.realtimeLogger.error(message, logData);
          break;
      }
    }

    // 错误上报到自定义平台
    if (this.options.enableReport && level === 'error') {
      this.report(logData);
    }
  }

  private report(data: Record<string, unknown>): void {
    if (!this.options.reportUrl) return;

    wx.request({
      url: this.options.reportUrl,
      method: 'POST',
      data,
      fail: () => {},
    });
  }

  /**
   * 页面级日志（自动添加页面信息）
   */
  page(pagePath: string): MPLogger {
    const pageLogger = new MPLogger(this.options);
    pageLogger.context = { ...this.context, page: pagePath };
    return pageLogger;
  }
}

export const mpLogger = new MPLogger();
```

### 小程序页面集成

```typescript
// pages/order/list.ts
import { mpLogger } from '@/utils/mp-logger';

const pageLogger = mpLogger.page('pages/order/list');

Page({
  onLoad(options) {
    pageLogger.info('页面加载', { options });
  },

  onShow() {
    pageLogger.debug('页面显示');
  },

  async loadOrders() {
    try {
      pageLogger.info('开始加载订单');
      const orders = await orderApi.getList();
      pageLogger.info('订单加载成功', { count: orders.length });
    } catch (error) {
      pageLogger.error('订单加载失败', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },
});
```

---

## 错误上报

### 全局错误捕获

```typescript
// utils/error-handler.ts
import { logger } from './logger';

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', event.reason, {
    type: 'unhandledrejection',
  });
});

// 全局错误
window.addEventListener('error', (event) => {
  // 区分资源加载错误和 JS 错误
  if (event.target && (event.target as HTMLElement).tagName) {
    logger.error('Resource Load Error', undefined, {
      type: 'resource',
      tagName: (event.target as HTMLElement).tagName,
      src: (event.target as HTMLImageElement).src || (event.target as HTMLScriptElement).src,
    });
  } else {
    logger.error('Global Error', event.error, {
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }
});
```

### 接口错误日志

```typescript
// utils/request.ts
import { logger } from './logger';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const traceId = generateTraceId();
  config.headers['X-Trace-Id'] = traceId;
  
  logger.debug('API Request', {
    traceId,
    method: config.method,
    url: config.url,
    params: config.params,
  });
  
  return config;
});

request.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      traceId: response.config.headers['X-Trace-Id'],
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    logger.error('API Error', error, {
      traceId: error.config?.headers?.['X-Trace-Id'],
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
```

---

## 敏感信息处理

### 前端脱敏工具

```typescript
// utils/mask.ts

export const mask = {
  /**
   * 手机号脱敏: 138****1234
   */
  phone(phone: string | null | undefined): string {
    if (!phone || phone.length !== 11) return phone || '';
    return `${phone.slice(0, 3)}****${phone.slice(7)}`;
  },

  /**
   * 身份证脱敏: 110***********1234
   */
  idCard(idCard: string | null | undefined): string {
    if (!idCard || idCard.length < 8) return idCard || '';
    return `${idCard.slice(0, 3)}${'*'.repeat(idCard.length - 7)}${idCard.slice(-4)}`;
  },

  /**
   * 邮箱脱敏: u***@example.com
   */
  email(email: string | null | undefined): string {
    if (!email || !email.includes('@')) return email || '';
    const [local, domain] = email.split('@');
    return `${local[0]}***@${domain}`;
  },

  /**
   * 银行卡脱敏: 6222****1234
   */
  bankCard(card: string | null | undefined): string {
    if (!card || card.length < 8) return card || '';
    return `${card.slice(0, 4)}****${card.slice(-4)}`;
  },
};

// 使用
logger.info('用户信息', {
  phone: mask.phone(user.phone),
  idCard: mask.idCard(user.idCard),
});
```

### 禁止记录的内容

```typescript
// ❌ 禁止
logger.info('登录', { password: user.password });
logger.debug('Token', { token: localStorage.getItem('token') });
console.log('用户信息', user);  // 可能包含敏感信息

// ✅ 正确
logger.info('登录', { username: user.username });
logger.info('用户信息', {
  id: user.id,
  name: user.name,
  phone: mask.phone(user.phone),
});
```

---

## 生产环境配置

### 移除 console

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
```

```javascript
// vue.config.js (Vue CLI)
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: true,
            },
          },
        }),
      ],
    },
  },
};
```

### 条件编译

```typescript
// 开发环境日志
if (import.meta.env.DEV) {
  console.log('调试信息', data);
}

// 或使用 Logger 自动处理
logger.debug('调试信息', data);  // 生产环境自动跳过
```

---

## 检查清单

### 通用检查

- [ ] 使用封装的 Logger 而非直接 console
- [ ] 生产环境关闭 debug/info 级别日志
- [ ] 敏感信息已脱敏
- [ ] 配置全局错误捕获
- [ ] 错误日志上报到监控平台

### Vue 检查

- [ ] 配置 `app.config.errorHandler`
- [ ] 使用 Composition API Hook 或 Mixin
- [ ] 组件错误边界处理

### 小程序检查

- [ ] 使用 `wx.getRealtimeLogManager()` 实时日志
- [ ] 配置 `setFilterMsg` 便于筛选
- [ ] 生产环境禁用 console 输出
- [ ] 错误上报到后台

### 性能检查

- [ ] 避免循环内大量日志
- [ ] 使用 `sendBeacon` 上报（不阻塞页面）
- [ ] 日志数据不过大

---

## 参考

- [通用日志规范](../common/logging.md)
- [Vue 3 错误处理](https://vuejs.org/api/application.html#app-config-errorhandler)
- [微信小程序实时日志](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getRealtimeLogManager.html)
- [Sentry JavaScript SDK](https://docs.sentry.io/platforms/javascript/)
