# TypeScript/Vue 技术参考

## 技术栈

| 组件 | 推荐版本 | 说明 |
|------|---------|------|
| Vue | 3.4+ | 前端框架 |
| TypeScript | 5.0+ | 类型系统 |
| Vite | 5.x | 构建工具 |
| Pinia | 2.x | 状态管理 |
| Vue Router | 4.x | 路由 |
| TDesign | 1.x | UI 组件库 |

## 项目结构

```
src/
├── api/                # API 封装
├── assets/             # 静态资源
├── components/         # 公共组件
├── composables/        # Composables
├── layouts/            # 布局组件
├── pages/              # 页面组件
├── router/             # 路由配置
├── stores/             # Pinia stores
├── types/              # 类型定义
├── utils/              # 工具函数
├── App.vue
└── main.ts
```

## 规范文档

- [命名规范](../standards/typescript/naming.md)
- [类型定义](../standards/typescript/typing.md)
- [Vue 3 规范](../standards/typescript/vue3.md)
- [最佳实践](../standards/typescript/best-practices.md)
- [错误示例](../standards/typescript/anti-patterns.md)
