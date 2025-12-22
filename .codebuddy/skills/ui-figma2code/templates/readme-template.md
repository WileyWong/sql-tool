# {{PROJECT_NAME}}

基于 Vue 3 + TDesign + Vite 构建的现代化前端项目。

## 📋 项目信息

- **技术栈**: Vue 3 + TypeScript + TDesign + Vite
- **开发工具**: ESLint + Prettier
- **样式方案**: Less
- **构建工具**: Vite
- **包管理器**: npm

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
{{PROJECT_NAME}}/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   └── styles/        # 样式文件
│   ├── components/        # 组件
│   │   ├── common/        # 通用组件
│   │   └── business/      # 业务组件
│   ├── views/             # 页面组件
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── package.json
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── README.md
```

## 🛠️ 开发指南

### 组件开发

组件应该遵循以下结构：

```vue
<template>
  <!-- 模板 -->
</template>

<script setup lang="ts">
// TypeScript 逻辑
</script>

<style lang="less" scoped>
/* Less 样式 */
</style>
```

### 样式规范

- 使用 Less 预处理器
- 遵循 BEM 命名规范
- 使用设计令牌（变量系统）
- 优先使用 scoped 样式

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查：

```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format

# TypeScript 类型检查
npm run type-check
```

## 📦 依赖说明

### 生产依赖

- `vue`: Vue 3 框架
- `vue-router`: Vue 路由
- `tdesign-vue-next`: TDesign Vue 组件库
- `tdesign-icons-vue-next`: TDesign 图标库

### 开发依赖

- `vite`: 构建工具
- `typescript`: TypeScript 支持
- `vue-tsc`: Vue TypeScript 编译器
- `eslint`: 代码检查
- `prettier`: 代码格式化
- `less`: Less 预处理器

## 🎨 设计系统

项目使用 TDesign 设计系统，包含：

- 完整的组件库
- 统一的设计令牌
- 响应式栅格系统
- 主题定制能力

## 📱 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [TDesign 文档](https://tdesign.tencent.com/vue-next/overview)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)