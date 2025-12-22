---
name: ui-connect-api
description: 实现前端与后端API数据交互，支持Vue + TypeScript + Axios。包含统一请求配置、类型定义、错误处理、Token管理。适用于前后端分离项目、RESTful API对接、接口封装等场景。
category: implementation
keywords: [API交互, 前后端分离, 请求封装, 类型安全]
---

# 前端与后端API数据交互

实现前端应用与后端API的完整数据交互解决方案。

## 快速开始

### 基础配置

创建Axios实例：

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API服务封装

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  }
  
  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post<User>('/users', user);
    return response.data;
  }
}
```

## 详细指南

**类型定义**: 参考 [types.md](types.md) 了解完整的TypeScript类型系统
**Axios配置**: 参考 [axios-config.md](axios-config.md) 了解拦截器和错误处理
**Vue集成**: 参考 [vue-integration.md](vue-integration.md) 了解Composables和组件集成
**错误处理**: 参考 [error-handling.md](error-handling.md) 了解统一错误处理策略
**最佳实践**: 参考 [best-practices.md](best-practices.md) 了解性能优化和安全考虑

## 实用工具

生成API服务代码：
```bash
python scripts/generate-api-service.py --input openapi.json --output src/services/
```

生成TypeScript类型：
```bash
python scripts/generate-types.py --schema schema.json --output src/types/
```