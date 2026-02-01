# SQL Tool

[English](./README.md) | 中文

Mac 和 Windows版本的应用可以在 release目录下直接下载使用

一个基于 Electron + Vue 3 的 MySQL 数据库客户端工具。

完全AI开发，主要是现有的一些管理工具，总有一些不满意的地方，就自己使用AI写了一个。后续会随着使用发现的问题不断优化。

AI开发的需求文档也一并提交上来了， 写的不太好，请见谅。

## 截图

![SQL Tool 截图](./screenshots/17696720892673.png)

## 功能特性

### 数据库连接管理
- 支持创建、编辑、删除 MySQL 数据库连接
- 连接信息本地加密存储（AES 对称加密）
- 树形结构展示数据库、表、视图、字段等
- 支持双击切换当前数据库
- 右键菜单支持刷新节点

### SQL 编辑器
- 基于 Monaco Editor 的专业 SQL 编辑器
- **智能联想**：实时自动触发，支持关键字、表名、字段名、函数等联想
- **语法检查**：MySQL 语法错误识别，红色波浪线 + 悬浮提示
- **代码格式化**：快捷键 `Shift+Alt+F`，支持关键字大写、自动缩进
- **悬浮提示**：鼠标悬停显示表、字段、函数的详细信息
- 多标签页管理，支持同时编辑多个 SQL 文件
- 快捷键 `Ctrl+S` 保存当前查询

### SQL 执行
- 支持执行选中 SQL 或全部 SQL
- 批量执行多语句，遇错停止
- 支持停止正在执行的查询（发送 KILL QUERY）
- 默认超时时间 10 分钟
- 可配置结果集最大行数（默认 5000 行）

### 查询结果
- 多结果集标签页展示
- 支持单元格编辑（单表查询且表有主键时）
- 导出功能：支持 CSV、JSON、Excel 格式
- 消息区显示非查询语句的影响行数

### 执行计划
- 支持 MySQL EXPLAIN 格式
- 流程图形式可视化展示查询计划
- 表格形式展示详细执行计划数据

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **桌面框架**：Electron 28
- **UI 组件库**：Element Plus
- **代码编辑器**：Monaco Editor + monaco-languageclient
- **SQL 解析**：sql-parser-cst
- **SQL 格式化**：sql-formatter
- **数据库驱动**：mysql2
- **构建工具**：Vite + electron-builder

## 开发

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
```

## 打包发布

### Windows
```bash
# 打包 Windows 版本（x64 + arm64）
npm run pack:win

# 仅打包 x64 版本
npm run pack:win:x64

# 仅打包 arm64 版本
npm run pack:win:arm64
```

输出格式：
- `release/SQL Tool Setup x.x.x.exe` - NSIS 安装包
- `release/SQL Tool x.x.x.exe` - 便携版

### macOS
```bash
# 打包 macOS 版本（x64 + arm64）
npm run pack:mac

# 仅打包 x64 版本（Intel Mac）
npm run pack:mac:x64

# 仅打包 arm64 版本（Apple Silicon）
npm run pack:mac:arm64
```

输出格式：
- `release/SQL Tool-x.x.x.dmg` - DMG 安装包

### Linux
```bash
# 打包 Linux 版本（x64 + arm64）
npm run pack:linux

# 仅打包 x64 版本
npm run pack:linux:x64

# 仅打包 arm64 版本
npm run pack:linux:arm64
```

输出格式：
- `release/SQL Tool-x.x.x.AppImage` - AppImage 格式
- `release/sql-tool_x.x.x_amd64.deb` - Debian 安装包

## 项目结构

```
sql-tool/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 主进程入口
│   │   ├── database/      # 数据库连接管理
│   │   └── language-server/ # SQL Language Server
│   └── renderer/          # 渲染进程（Vue 应用）
│       ├── components/    # Vue 组件
│       ├── composables/   # 组合式函数
│       ├── stores/        # Pinia 状态管理
│       └── types/         # TypeScript 类型定义
├── resources/             # 应用资源文件
├── requirements/          # 需求文档
└── release/               # 打包输出目录
```

## License

MIT
