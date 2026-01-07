# Vue3 策略模块参考

## 模块概述

Vue3 策略模块用于从各种输入生成 Vue 3 + Axios 的API调用代码。

### 默认语言规则

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| **语言** | TypeScript | 现代项目标配，类型安全 |
| **HTTP客户端** | Axios | 功能完善，生态丰富 |
| **状态管理** | Composable | Vue3 推荐方式 |

> **⚠️ 语言选择**: Vue3 默认使用 TypeScript，用户可明确指定 JavaScript 覆盖。

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
├── types/
│   └── {resource}.ts       # 类型定义
├── services/
│   └── {resource}Service.ts # API服务
└── composables/
    └── use{Resource}.ts    # Composable函数
```

### 类型定义模板

```typescript
// src/types/{resource}.ts

// 实体类型
export interface {Resource} {
  id: number;
  // ... 字段
  createdAt: string;
  updatedAt: string;
}

// 查询参数
export interface {Resource}QueryParams {
  page?: number;
  size?: number;
  // ... 查询字段
}

// 创建请求
export interface Create{Resource}Request {
  // ... 必填字段
}

// 更新请求
export interface Update{Resource}Request {
  // ... 可选字段
}
```

### API服务模板

> **⚠️ 分页响应类型**: `PageResponse<T>` 需根据项目后端实际返回格式定义，
> 详见 [类型规范](../standards/common/typing.md#分页响应结构)

```typescript
// src/services/{resource}Service.ts
import { get, post, put, del } from '@/utils/http';
import type { 
  {Resource}, 
  {Resource}QueryParams, 
  Create{Resource}Request, 
  Update{Resource}Request,
  PageResponse  // 根据后端实际格式定义
} from '@/types/{resource}';

export const {resource}Service = {
  // 返回类型需匹配后端实际分页格式
  getList(params: {Resource}QueryParams): Promise<PageResponse<{Resource}>> {
    return get('/{resources}', params);
  },

  getById(id: number): Promise<{Resource}> {
    return get(`/{resources}/${id}`);
  },

  create(data: Create{Resource}Request): Promise<{Resource}> {
    return post('/{resources}', data);
  },

  update(id: number, data: Update{Resource}Request): Promise<{Resource}> {
    return put(`/{resources}/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return del(`/{resources}/${id}`);
  },
};
```

### Composable模板

```typescript
// src/composables/use{Resource}.ts
import { {resource}Service } from '@/services/{resource}Service';
import { useList } from './useList';
import { useCrud } from './useCrud';
import type { 
  {Resource}, 
  {Resource}QueryParams, 
  Create{Resource}Request, 
  Update{Resource}Request 
} from '@/types/{resource}';

export function use{Resource}List(defaultParams?: Partial<{Resource}QueryParams>) {
  return useList<{Resource}, {Resource}QueryParams>(
    (params) => {resource}Service.getList(params),
    { defaultParams }
  );
}

export function use{Resource}Crud() {
  return useCrud<{Resource}, Create{Resource}Request, Update{Resource}Request>(
    {resource}Service
  );
}
```

## Mock数据生成

> 参考 [shared/mock-generator.md](../shared/mock-generator.md) - TypeScript 版本

## 规范引用

- [命名规范](../standards/common/naming.md)
- [类型规范](../standards/common/typing.md)
- [错误处理](../standards/common/error-handling.md)
- [Axios配置](../standards/vue3/axios-config.md)
- [Composables](../standards/vue3/composables.md)
- [最佳实践](../standards/vue3/best-practices.md)

## 检查清单

生成代码后，验证以下项目：

```yaml
vue3_checklist:
  类型定义:
    - [ ] 实体类型完整
    - [ ] 请求/响应类型完整
    - [ ] 泛型使用正确
  
  API服务:
    - [ ] 所有接口方法已实现
    - [ ] 类型注解完整
    - [ ] 路径参数正确
  
  Composable:
    - [ ] 状态管理正确
    - [ ] 错误处理完善
    - [ ] 返回值类型正确
  
  编译验证:
    - [ ] tsc --noEmit 成功
    - [ ] 无类型错误
```
