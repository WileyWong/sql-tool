# TypeScript 从 API 设计生成代码 - 检查清单

## API 解析检查

- [ ] 解析所有 API 端点
- [ ] 提取 HTTP 方法
- [ ] 提取请求参数（path/query/body）
- [ ] 提取响应结构
- [ ] 提取错误码定义

## Types 生成检查

### 请求类型
- [ ] 类型名使用 PascalCase
- [ ] 使用 `interface` 定义
- [ ] 可选字段使用 `?`
- [ ] 字段类型正确
- [ ] 注释完整

### 响应类型
- [ ] 类型名使用 PascalCase
- [ ] 包含所有响应字段
- [ ] 嵌套类型正确定义

### 枚举类型
- [ ] 使用 `const enum` 或 `as const`
- [ ] 值定义正确

## API Service 生成检查

### 基础结构
- [ ] 文件路径正确（`src/api/xxx.ts`）
- [ ] 导入 axios 实例
- [ ] 导入相关类型

### 方法定义
- [ ] 方法名使用 camelCase
- [ ] 参数类型正确
- [ ] 返回类型使用 `Promise<T>`
- [ ] HTTP 方法正确
- [ ] URL 路径正确
- [ ] 请求参数正确传递

## Vue 组件生成检查

### 基础结构
- [ ] 使用 `<script setup lang="ts">`
- [ ] 导入必要的 Vue API
- [ ] 导入 API 服务
- [ ] 导入类型定义

### 状态管理
- [ ] 使用 `ref` 或 `reactive`
- [ ] 类型注解正确
- [ ] loading 状态
- [ ] error 状态

### 生命周期
- [ ] 使用 `onMounted` 初始化数据
- [ ] 正确处理异步操作

### 错误处理
- [ ] try-catch 包裹异步操作
- [ ] 错误提示用户友好
- [ ] 错误日志记录

## Composables 生成检查

- [ ] 文件路径正确（`src/composables/useXxx.ts`）
- [ ] 函数名使用 `useXxx` 格式
- [ ] 返回响应式数据
- [ ] 返回操作方法
- [ ] 类型导出正确

## 编译验证

```bash
npm run build
# 或
npx tsc --noEmit
```

- [ ] 编译成功
- [ ] 无类型错误
- [ ] 无 ESLint 错误
