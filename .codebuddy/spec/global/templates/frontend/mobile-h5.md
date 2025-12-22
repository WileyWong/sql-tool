# 移动端 H5 项目模板

## 项目信息

**项目名称**: [项目名称]

**项目描述**: [项目描述]

**项目类型**: 移动端 H5

**开发周期**: [开始日期] - [结束日期]

**负责人**: [负责人姓名]

## 技术栈

### 核心框架
- **前端框架**: Vue 3.x
- **构建工具**: Vite 4.x / Webpack 5.x
- **UI 组件库**: Vant 4.x / Ant Design Mobile
- **状态管理**: Pinia / Redux Toolkit
- **路由**: Vue Router 4.x

### 开发工具
- **包管理器**: pnpm / yarn
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **TypeScript**: 5.x

### 移动端适配
- **视口适配**: postcss-px-to-viewport / flexible
- **样式预处理**: Sass / Less
- **移动端调试**: vConsole / eruda

## 项目结构

```
mobile-h5-project/
├── public/                 # 静态资源
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/            # 资源文件
│   │   ├── images/        # 图片
│   │   ├── styles/        # 全局样式
│   │   └── fonts/         # 字体
│   ├── components/        # 公共组件
│   │   ├── common/        # 通用组件
│   │   └── business/      # 业务组件
│   ├── views/             # 页面组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── api/               # API 接口
│   ├── utils/             # 工具函数
│   ├── hooks/             # 自定义 Hooks
│   ├── types/             # TypeScript 类型定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .eslintrc.js           # ESLint 配置
├── .prettierrc.js         # Prettier 配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── package.json           # 项目依赖
```

## 功能模块

### 1. [模块名称]

**功能描述**: [功能描述]

**页面路由**: `/path`

**主要功能**:
- 功能点 1
- 功能点 2
- 功能点 3

**技术要点**:
- 技术点 1
- 技术点 2

## 移动端适配方案

### 视口适配

使用 `postcss-px-to-viewport` 进行 px 到 vw 的自动转换:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,      // 设计稿宽度
      viewportHeight: 667,     // 设计稿高度
      unitPrecision: 5,        // 转换精度
      viewportUnit: 'vw',      // 转换单位
      selectorBlackList: [],   // 不转换的类名
      minPixelValue: 1,        // 最小转换值
      mediaQuery: false        // 是否转换媒体查询
    }
  }
}
```

### 1px 边框问题

使用 `postcss-write-svg` 或 `border-image` 解决 1px 边框问题。

### 点击延迟

使用 `fastclick` 或 CSS `touch-action` 解决点击延迟。

## 性能优化

### 1. 图片优化
- 使用 WebP 格式
- 图片懒加载
- 雪碧图合并

### 2. 代码优化
- 路由懒加载
- 组件按需加载
- Tree Shaking

### 3. 网络优化
- HTTP/2
- CDN 加速
- Gzip 压缩

### 4. 缓存策略
- Service Worker
- LocalStorage
- IndexedDB

## 兼容性

### 浏览器支持
- iOS Safari 12+
- Android Chrome 80+
- 微信浏览器 7.0+

### 降级方案
- Polyfill 处理
- 功能检测
- 优雅降级

## 开发规范

### 命名规范
- 组件名: PascalCase (如: `UserProfile.vue`)
- 文件名: kebab-case (如: `user-profile.vue`)
- 变量名: camelCase (如: `userName`)
- 常量名: UPPER_SNAKE_CASE (如: `API_BASE_URL`)

### 代码规范
- 遵循 [前端编码规范](../../standards/frontend/codestyle.md)
- 使用 ESLint + Prettier 自动格式化
- 提交前进行 Lint 检查

### Git 规范
- 分支命名: `feature/xxx`, `bugfix/xxx`, `hotfix/xxx`
- 提交信息: `type(scope): subject`
  - type: feat, fix, docs, style, refactor, test, chore
  - scope: 影响范围
  - subject: 简短描述

## 部署方案

### 开发环境
- 环境地址: https://dev.example.com
- 部署方式: 自动部署 (Git Push)

### 测试环境
- 环境地址: https://test.example.com
- 部署方式: 自动部署 (Git Tag)

### 生产环境
- 环境地址: https://www.example.com
- 部署方式: 手动部署 (审批后)

## 测试方案

### 单元测试
- 测试框架: Vitest / Jest
- 覆盖率要求: 80%+

### E2E 测试
- 测试框架: Cypress / Playwright
- 测试场景: 核心业务流程

### 真机测试
- iOS 设备: iPhone 12, iPhone 13
- Android 设备: 小米、华为、OPPO

## 监控与日志

### 性能监控
- 工具: Google Analytics / 百度统计
- 指标: FCP, LCP, FID, CLS

### 错误监控
- 工具: Sentry / Fundebug
- 上报: 自动上报 + 手动上报

### 用户行为
- 工具: 神策 / GrowingIO
- 埋点: 页面浏览、按钮点击、表单提交

## 常见问题

### Q1: 如何解决 iOS 滚动不流畅?
A: 使用 `-webkit-overflow-scrolling: touch;`

### Q2: 如何解决软键盘遮挡输入框?
A: 监听 `resize` 事件,动态调整页面高度

### Q3: 如何解决微信浏览器缓存问题?
A: 在 URL 后添加时间戳或版本号

## 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Vant 组件库](https://vant-ui.github.io/vant/)
- [移动端适配方案](https://github.com/evrone/postcss-px-to-viewport)
