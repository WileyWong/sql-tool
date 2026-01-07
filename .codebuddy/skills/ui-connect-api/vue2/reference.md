# Vue2 策略模块参考

## 模块概述

Vue2 策略模块用于从各种输入生成 Vue 2 + Axios 的API调用代码。

### 默认语言规则

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| **语言** | JavaScript | 兼容老项目，无需配置 |
| **HTTP客户端** | Axios | 功能完善，生态丰富 |
| **状态管理** | Mixin/Vuex | Vue2 传统方式 |

> **⚠️ 语言选择**: Vue2 默认使用 JavaScript（兼容老项目），用户可明确指定 TypeScript 覆盖。

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
src/
├── api/
│   └── {resource}.js       # API服务 (默认JS)
├── types/                   # TypeScript项目时使用
│   └── {resource}.d.ts     # 类型定义
└── mixins/
    └── {resource}Mixin.js  # 可选：列表Mixin
```

### API服务模板（JavaScript - 默认）

> **⚠️ 分页响应类型**: 列表接口返回格式需根据项目后端实际返回格式定义，
> 详见 [类型规范](../standards/common/typing.md#分页响应结构)

```javascript
// src/api/{resource}.js
import { get, post, put, del } from '@/utils/http';

export default {
  /**
   * 获取{resource}列表
   * @param {object} params - 查询参数
   * @returns {Promise} 返回格式取决于后端（如 { list, total, page, pageSize }）
   */
  getList(params) {
    return get('/{resources}', params);
  },

  /**
   * 获取{resource}详情
   * @param {number} id - ID
   * @returns {Promise}
   */
  getById(id) {
    return get(`/{resources}/${id}`);
  },

  /**
   * 创建{resource}
   * @param {object} data - 数据
   * @returns {Promise}
   */
  create(data) {
    return post('/{resources}', data);
  },

  /**
   * 更新{resource}
   * @param {number} id - ID
   * @param {object} data - 数据
   * @returns {Promise}
   */
  update(id, data) {
    return put(`/{resources}/${id}`, data);
  },

  /**
   * 删除{resource}
   * @param {number} id - ID
   * @returns {Promise}
   */
  delete(id) {
    return del(`/{resources}/${id}`);
  },
};
```

### 类型定义模板（TypeScript - 用户指定时使用）

```typescript
// src/types/{resource}.d.ts

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

export interface Update{Resource}Request {
  // ... 可选字段
}
```

## 与Vue3的差异

| 特性 | Vue3 | Vue2 |
|------|------|------|
| 状态管理 | Composable/Pinia | Mixin/Vuex |
| 类型系统 | TypeScript优先 | JavaScript/TypeScript |
| 响应式 | ref/reactive | data函数 |
| 生命周期 | onMounted | mounted |
| 组件定义 | setup函数 | Options API |

## Mock数据生成

> 参考 [shared/mock-generator.md](../shared/mock-generator.md) - JavaScript 版本

## 规范引用

- [命名规范](../standards/common/naming.md)
- [类型规范](../standards/common/typing.md)
- [错误处理](../standards/common/error-handling.md)
- [Axios配置](../standards/vue2/axios-config.md)
- [最佳实践](../standards/vue2/best-practices.md)
- [Mixin模式](../standards/vue2/mixin-patterns.md)

## 检查清单

```yaml
vue2_checklist:
  API服务:
    - [ ] 所有接口方法已实现
    - [ ] JSDoc注释完整
    - [ ] 路径参数正确
  
  类型定义（TypeScript）:
    - [ ] 实体类型完整
    - [ ] 请求/响应类型完整
  
  Mixin（可选）:
    - [ ] 列表Mixin正确
    - [ ] 分页逻辑正确
  
  编译验证:
    - [ ] npm run build 成功
    - [ ] 无语法错误
```
