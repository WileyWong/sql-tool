---
name: guidelines
description: 开发指南 - 编写规范和最佳实践
created_at: 2025-12-19
author: AI Assistant
---

# 开发指南

## 概述

本指南定义 SQL Tool 项目的编码规范和最佳实践。由于项目目前处于需求阶段，尚无实际代码，本指南基于项目技术栈（Electron + Vue 3 + Element Plus）提供规范框架，待项目开发启动后根据实际代码进行更新。

## 技术栈规范

### Vue 3 组件规范

#### 组件文件命名

- 使用 PascalCase 命名: `ConnectionDialog.vue`, `SqlEditor.vue`
- 单文件组件结构: `<template>`, `<script>`, `<style>`

#### 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 组合式 API
import { ref, computed } from 'vue'

// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
```

### Element Plus 使用规范

- 按需引入组件，减少打包体积
- 遵循 Element Plus 的设计规范
- 弹窗、提示等使用 Element Plus 组件，不使用浏览器原生弹窗

### Electron 规范

#### 进程分离

- 主进程: 处理系统级操作、数据库连接
- 渲染进程: 处理 UI 展示
- 预加载脚本: 安全地暴露 API 给渲染进程

#### 安全要求

- 启用 contextIsolation
- 禁用 nodeIntegration
- 使用 preload 脚本进行进程通信

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `SqlEditor.vue` |
| JavaScript 模块 | camelCase | `connectionManager.js` |
| 样式文件 | kebab-case | `sql-editor.css` |
| 配置文件 | 小写 | `vite.config.js` |

### 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 | camelCase | `connectionList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RESULT_ROWS` |
| 函数 | camelCase | `executeQuery` |
| 组件 | PascalCase | `ConnectionTree` |

## 项目结构规范

```
src/
├── main/                 # Electron 主进程
│   ├── index.js         # 主进程入口
│   └── database/        # 数据库连接模块
├── preload/             # 预加载脚本
│   └── index.js
├── renderer/            # 渲染进程 (Vue 应用)
│   ├── components/      # 公共组件
│   ├── views/           # 页面组件
│   ├── stores/          # 状态管理
│   ├── utils/           # 工具函数
│   └── App.vue
└── shared/              # 共享代码
    └── constants.js     # 常量定义
```

## 安全规范

### 密码存储

- 使用本机 MAC 地址 + AES 对称加密
- 禁止明文存储敏感信息
- 加密密钥不得硬编码

### 数据库连接

- 连接信息本地加密存储
- 支持连接测试功能
- 连接超时默认 10 分钟

## UI 实现规范

### 布局要求

- 严格按照设计稿实现
- 支持区域大小调整（左侧树、下方结果区）
- 响应式适配不同窗口大小

### 交互要求

- 使用 Electron 原生菜单（非 HTML 菜单）
- 右键菜单使用 Element Plus 组件
- 二次确认弹窗使用 Element Plus 组件

## 待补充

> 注意: 以下内容待项目开发启动后，根据实际代码补充：
> - 实际代码示例
> - 错误处理模式
> - 日志记录规范
> - 测试规范
