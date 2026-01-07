# 小程序策略模块参考

## 模块概述

小程序策略模块用于从各种输入生成微信小程序的API调用代码。

### 默认语言规则

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| **语言** | JavaScript | 原生开发标配，无需编译 |
| **HTTP客户端** | wx.request | 小程序原生API |
| **状态管理** | Behavior/全局Store | 小程序原生方式 |

> **⚠️ 语言选择**: 小程序默认使用 JavaScript（原生开发标配），用户可明确指定 TypeScript 覆盖（需配置 tsconfig.json）。

## 输入解析

所有输入类型的解析规则统一定义在 `shared/` 目录：

| 输入类型 | 解析规则 |
|---------|---------|
| OpenAPI/Swagger | [shared/openapi-parser.md](../shared/openapi-parser.md) |
| curl命令 | [shared/curl-parser.md](../shared/curl-parser.md) |
| 接口设计文档 | [shared/api-doc-parser.md](../shared/api-doc-parser.md) |
| 后端代码 | [shared/backend-code-parser.md](../shared/backend-code-parser.md) |
| Postman Collection | [shared/postman-parser.md](../shared/postman-parser.md) |
| HAR | [shared/har-parser.md](../shared/har-parser.md) |

> **输入识别**: 参考 [shared/input-recognition.md](../shared/input-recognition.md)

## 输出产物

### 标准输出结构

```
miniprogram/
├── api/
│   ├── request.js          # 请求封装 (默认JS)
│   └── {resource}Service.js   # API服务 (默认JS)
├── types/                   # TypeScript项目时使用
│   └── {resource}.d.ts     # 类型定义
└── behaviors/
    └── listBehavior.js     # 可选：列表Behavior
```

### API服务模板（JavaScript - 默认）

> **⚠️ 分页响应类型**: 列表接口返回格式需根据项目后端实际返回格式定义，
> 详见 [类型规范](../standards/common/typing.md#分页响应结构)

```javascript
// api/{resource}Service.js
import { http } from './request';

export const {resource}Service = {
  /**
   * 获取{resource}列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 返回格式取决于后端（如 { list, total, page, pageSize }）
   */
  getList(params) {
    return http.get('/{resources}', params);
  },

  /**
   * 获取{resource}详情
   * @param {number} id - ID
   * @returns {Promise}
   */
  getById(id) {
    return http.get(`/{resources}/${id}`);
  },

  /**
   * 创建{resource}
   * @param {Object} data - 数据
   * @returns {Promise}
   */
  create(data) {
    return http.post('/{resources}', data);
  },

  /**
   * 更新{resource}
   * @param {number} id - ID
   * @param {Object} data - 数据
   * @returns {Promise}
   */
  update(id, data) {
    return http.put(`/{resources}/${id}`, data);
  },

  /**
   * 删除{resource}
   * @param {number} id - ID
   * @returns {Promise}
   */
  delete(id) {
    return http.delete(`/{resources}/${id}`);
  },
};
```

### API服务模板（TypeScript - 用户指定时使用）

> **⚠️ 分页响应类型**: `PageResponse<T>` 需根据项目后端实际返回格式定义

```typescript
// api/{resource}Service.ts
import { http } from './request';
import type { 
  {Resource}, 
  {Resource}QueryParams, 
  Create{Resource}Request,
  PageResponse  // 根据后端实际格式定义
} from '../types/{resource}';

export const {resource}Service = {
  /**
   * 获取{resource}列表
   * 返回类型需匹配后端实际分页格式
   */
  getList(params?: {Resource}QueryParams): Promise<PageResponse<{Resource}>> {
    return http.get('/{resources}', params);
  },

  /**
   * 获取{resource}详情
   */
  getById(id: number): Promise<{Resource}> {
    return http.get(`/{resources}/${id}`);
  },

  /**
   * 创建{resource}
   */
  create(data: Create{Resource}Request): Promise<{Resource}> {
    return http.post('/{resources}', data);
  },

  /**
   * 更新{resource}
   */
  update(id: number, data: Partial<Create{Resource}Request>): Promise<{Resource}> {
    return http.put(`/{resources}/${id}`, data);
  },

  /**
   * 删除{resource}
   */
  delete(id: number): Promise<void> {
    return http.delete(`/{resources}/${id}`);
  },
};
```

### 类型定义模板（TypeScript项目时使用）

> **⚠️ 重要**: `PageResponse<T>` 需根据后端实际返回格式定义，以下仅为示例

```typescript
// types/{resource}.d.ts

export interface {Resource} {
  id: number;
  // ... 字段
  createdAt: string;
  updatedAt: string;
}

export interface {Resource}QueryParams {
  page?: number;
  size?: number;
  // ... 查询字段
}

export interface Create{Resource}Request {
  // ... 必填字段
}

// ⚠️ 分页响应格式需根据后端实际返回定义
// 以下为示例格式，实际使用时请根据后端返回调整
export interface PageResponse<T> {
  list: T[];       // 或 items/content/results 等
  total: number;
  page: number;
  pageSize: number;
}
```

## 与Vue的差异

| 特性 | Vue3/Vue2 | 小程序 |
|------|----------|--------|
| HTTP客户端 | Axios | wx.request |
| 状态管理 | Composable/Vuex | Behavior/全局Store |
| 组件复用 | Mixin/Composable | Behavior |
| 生命周期 | mounted/onMounted | onLoad/onShow |
| 模板语法 | v-for/v-if | wx:for/wx:if |
| 事件绑定 | @click | bindtap |

## 小程序特有考虑

### 请求并发限制

```typescript
// 小程序同时最多10个请求
// 需要实现请求队列管理
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent = 10;

  add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.run();
    });
  }

  private async run() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.running++;
        task().finally(() => {
          this.running--;
          this.run();
        });
      }
    }
  }
}
```

### 登录态管理

```typescript
// 小程序登录流程
async function login() {
  // 1. 获取code
  const { code } = await wx.login();
  
  // 2. 发送到后端换取token
  const { token, userId } = await http.post('/auth/login', { code });
  
  // 3. 存储token
  wx.setStorageSync('token', token);
  wx.setStorageSync('userId', userId);
}
```

### 分包加载

```typescript
// 分包中的API引用
// 使用相对路径或别名
import { userApi } from '../../api/user.api';
```

## Mock数据生成

> 参考 [shared/mock-generator.md](../shared/mock-generator.md) - JavaScript 版本

## 规范引用

- [命名规范](../standards/common/naming.md)
- [类型规范](../standards/common/typing.md)
- [错误处理](../standards/common/error-handling.md)
- [请求配置](../standards/miniprogram/request-config.md)
- [最佳实践](../standards/miniprogram/best-practices.md)
- [TypeScript最佳实践](../standards/miniprogram/typescript-best-practices.md)

## 检查清单

```yaml
miniprogram_checklist:
  API服务:
    - [ ] 所有接口方法已实现
    - [ ] 使用 wx.request 封装
    - [ ] Token自动注入
    - [ ] 错误处理完善
  
  类型定义:
    - [ ] 实体类型完整
    - [ ] 请求/响应类型完整
  
  页面集成:
    - [ ] 下拉刷新支持
    - [ ] 上拉加载更多
    - [ ] 加载状态显示
    - [ ] 空状态处理
  
  编译验证:
    - [ ] 小程序开发者工具编译成功
    - [ ] 无类型错误
```
