---
change_id: 2025-12-19-sql-tool
document_type: architecture-design
stage: design
created_at: 2025-12-19
author: AI Assistant
---

# SQL Tool 系统架构设计文档

## 1. 架构概述

### 1.1 项目背景

SQL Tool 是一个 MySQL 数据库客户端工具，提供数据库连接管理、SQL 编辑（语法高亮、自动联想、语法检查）、查询执行和结果展示等功能。

### 1.2 架构风格决策

**选择**: 单体桌面应用架构（Electron）

**理由**:
- **系统规模**: 5 个核心模块（连接管理、SQL 编辑器、查询执行、结果展示、文件管理）
- **团队规模**: 小型团队
- **部署方式**: 桌面客户端，无需服务端
- **用户场景**: 单用户本地使用，无并发需求

**权衡**:
| 优点 | 缺点 |
|------|------|
| 开发简单，迭代快 | 跨平台需要分别打包 |
| 本地运行，响应快 | 升级需要用户手动更新 |
| 无服务端运维成本 | 无法云端同步配置 |

### 1.3 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        SQL Tool 应用                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    渲染进程 (Vue 3)                       │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │ 连接管理 │ │SQL编辑器│ │ 结果展示 │ │ 文件管理 │        │    │
│  │  │ 组件    │ │  组件   │ │  组件   │ │  组件   │        │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │    │
│  │       │           │           │           │              │    │
│  │  ┌────┴───────────┴───────────┴───────────┴────┐        │    │
│  │  │              Pinia 状态管理                   │        │    │
│  │  └────────────────────┬────────────────────────┘        │    │
│  └───────────────────────┼─────────────────────────────────┘    │
│                          │ IPC 通信                              │
│  ┌───────────────────────┼─────────────────────────────────┐    │
│  │                 预加载脚本 (Preload)                      │    │
│  │              contextBridge API 暴露                       │    │
│  └───────────────────────┼─────────────────────────────────┘    │
│                          │                                       │
│  ┌───────────────────────┼─────────────────────────────────┐    │
│  │                    主进程 (Main)                          │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │数据库连接│ │ 文件系统 │ │ 加密存储 │ │ 原生菜单 │        │    │
│  │  │ 模块    │ │  模块   │ │  模块   │ │  模块   │        │    │
│  │  └────┬────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  └───────┼─────────────────────────────────────────────────┘    │
│          │                                                       │
└──────────┼───────────────────────────────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   MySQL     │
    │   数据库    │
    └─────────────┘
```

---

## 2. 技术选型

### 2.1 技术栈清单

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **桌面框架** | Electron | 28.x+ | 跨平台桌面应用标准方案，生态成熟 |
| **前端框架** | Vue 3 | 3.4+ | 项目指定，组合式 API 开发效率高 |
| **UI 组件库** | Element Plus | 2.4+ | 项目指定，企业级组件库 |
| **状态管理** | Pinia | 2.x | Vue 3 官方推荐，轻量易用 |
| **构建工具** | Vite | 5.x | 快速冷启动，HMR 体验好 |
| **SQL 编辑器** | Monaco Editor | 0.45+ | VS Code 同款编辑器，SQL 支持完善 |
| **MySQL 客户端** | mysql2 | 3.x | Promise API，性能优于 mysql 包 |
| **加密库** | crypto-js | 4.x | AES 加密，浏览器/Node 通用 |
| **打包工具** | electron-builder | 24.x | 支持 Windows/macOS 多平台打包 |

### 2.2 关键技术决策

#### ADR-001: SQL 编辑器选型

**状态**: 已接受  
**日期**: 2025-12-19

**背景**: 需要实现 SQL 编辑器，支持语法高亮、自动联想、语法错误检测。

**决策**: 使用 Monaco Editor

**理由**:
- VS Code 同款编辑器，用户体验一致
- 内置 SQL 语言支持
- 支持自定义语言服务（联想、错误检测）
- 社区活跃，文档完善

**替代方案**:
| 方案 | 优点 | 缺点 | 否决原因 |
|------|------|------|----------|
| CodeMirror 6 | 轻量、模块化 | SQL 支持需自行实现 | 开发成本高 |
| Ace Editor | 成熟稳定 | 体积大、更新慢 | 生态不如 Monaco |

#### ADR-002: 数据库连接库选型

**状态**: 已接受  
**日期**: 2025-12-19

**背景**: 需要在 Electron 主进程中连接 MySQL 数据库。

**决策**: 使用 mysql2

**理由**:
- 原生 Promise 支持
- 性能优于 mysql 包
- 支持连接池
- 支持 prepared statements

---

## 3. 模块划分

### 3.1 模块总览

```
sql-tool-v2/
├── src/
│   ├── main/                    # Electron 主进程
│   │   ├── index.ts            # 主进程入口（窗口创建、IPC 注册）
│   │   ├── database/           # 数据库模块
│   │   │   ├── connection-manager.ts  # 连接池管理
│   │   │   └── query-executor.ts      # 查询执行、执行计划
│   │   ├── storage/            # 存储模块
│   │   │   ├── connection-store.ts    # 连接配置存储
│   │   │   └── encryption.ts          # AES 加密工具
│   │   └── ipc/                # IPC 处理器（按功能拆分）
│   │       ├── connection.ts   # 连接相关 IPC
│   │       ├── database.ts     # 数据库元数据 IPC
│   │       ├── query.ts        # 查询执行 IPC
│   │       └── file.ts         # 文件操作 IPC
│   │
│   ├── preload/                 # 预加载脚本
│   │   └── index.ts            # contextBridge API 暴露
│   │
│   ├── renderer/                # 渲染进程 (Vue 应用)
│   │   ├── App.vue             # 根组件（三栏布局）
│   │   ├── main.ts             # 渲染进程入口
│   │   ├── env.d.ts            # 类型声明（Window.electronAPI）
│   │   ├── components/         # Vue 组件
│   │   │   ├── Toolbar.vue           # 工具栏（新建连接、运行等）
│   │   │   ├── ConnectionTree.vue    # 连接树（数据库/表/字段）
│   │   │   ├── ConnectionDialog.vue  # 连接弹窗（新建/编辑）
│   │   │   ├── SqlEditor.vue         # SQL 编辑器（Monaco）
│   │   │   ├── ResultPanel.vue       # 结果面板（标签页容器）
│   │   │   ├── ResultTable.vue       # 结果表格（虚拟滚动）
│   │   │   └── ExplainView.vue       # 执行计划视图
│   │   ├── stores/             # Pinia 状态管理
│   │   │   ├── connection.ts   # 连接状态
│   │   │   ├── editor.ts       # 编辑器状态（标签页）
│   │   │   └── result.ts       # 结果状态（多结果集）
│   │   └── styles/             # 样式文件
│   │       └── index.css       # 全局样式
│   │
│   └── shared/                  # 主进程/渲染进程共享代码
│       ├── types/              # TypeScript 类型定义
│       │   ├── connection.ts   # 连接配置类型
│       │   ├── database.ts     # 数据库元数据类型
│       │   ├── query.ts        # 查询结果类型
│       │   └── index.ts        # 类型导出
│       └── constants/          # 常量定义
│           ├── errors.ts       # 错误码定义
│           └── index.ts        # IPC 通道、默认值
│
├── index.html                   # 入口 HTML
├── package.json                 # 项目配置和依赖
├── vite.config.ts              # Vite + Electron 配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node 环境 TS 配置
└── .gitignore
```

### 3.2 模块职责定义

#### 3.2.1 主进程模块

| 模块 | 职责 | 对外接口 |
|------|------|----------|
| **database/connection-manager** | 管理 MySQL 连接池，建立/断开连接 | `connect()`, `disconnect()`, `testConnection()`, `getConnection()` |
| **database/query-executor** | 执行 SQL 查询，获取执行计划 | `execute()`, `explain()`, `kill()`, `getMetadata()` |
| **storage/connection-store** | 连接配置的持久化存储 | `saveConnection()`, `loadConnections()`, `deleteConnection()` |
| **storage/encryption** | 密码 AES 加密解密 | `encrypt()`, `decrypt()` |
| **ipc/connection** | 连接相关 IPC 处理 | 新建、编辑、删除、测试连接 |
| **ipc/database** | 数据库元数据 IPC 处理 | 获取数据库、表、字段信息 |
| **ipc/query** | 查询执行 IPC 处理 | 执行 SQL、获取执行计划 |
| **ipc/file** | 文件操作 IPC 处理 | 打开、保存 SQL 文件 |

#### 3.2.2 渲染进程模块

| 模块 | 职责 | 依赖 |
|------|------|------|
| **Toolbar** | 工具栏，新建连接/运行/停止等操作 | connection store, editor store |
| **ConnectionTree** | 展示数据库连接树，支持展开/折叠/右键菜单 | connection store |
| **ConnectionDialog** | 新建/编辑连接弹窗 | connection store |
| **SqlEditor** | SQL 编辑器，语法高亮/联想/错误检测 | editor store, Monaco Editor |
| **ResultPanel** | 查询结果标签页容器 | result store |
| **ResultTable** | 结果表格展示，支持虚拟滚动 | result store |
| **ExplainView** | 执行计划视图展示 | result store |

#### 3.2.3 状态管理

| Store | 职责 | 状态 |
|-------|------|------|
| **connection** | 连接列表、当前连接、数据库结构 | `connections[]`, `currentConnection`, `dbTree`, `expandedKeys[]` |
| **editor** | 编辑器标签页、当前 SQL | `tabs[]`, `activeTabId`, `currentSql` |
| **result** | 查询结果、消息、执行计划 | `results[]`, `messages[]`, `executionPlan`, `isExecuting` |

### 3.3 模块依赖关系

```
渲染进程组件依赖:
Toolbar ──► connection store, editor store
ConnectionTree ──► connection store
ConnectionDialog ──► connection store
SqlEditor ──► editor store, connection store
ResultPanel ──► result store
ResultTable ──► result store
ExplainView ──► result store

Store 依赖 IPC:
connection store ──► preload API ──► main/ipc/connection, main/ipc/database
editor store ──► preload API ──► main/ipc/file
result store ──► preload API ──► main/ipc/query

主进程模块依赖:
ipc/connection ──► storage/connection-store, database/connection-manager
ipc/database ──► database/query-executor
ipc/query ──► database/query-executor
ipc/file ──► electron dialog
database/query-executor ──► database/connection-manager
storage/connection-store ──► storage/encryption
```

**依赖原则**: 单向依赖，无循环依赖

---

## 4. 非功能需求实现

### 4.1 性能要求

| 指标 | 目标值 | 实现方案 |
|------|--------|----------|
| SQL 执行超时 | 默认 10 分钟，可配置 | mysql2 连接配置 `connectTimeout` |
| 结果集最大行数 | 默认 5000 行，可配置 | SQL 查询添加 `LIMIT` |
| 编辑器响应 | 输入延迟 < 50ms | Monaco Editor 默认性能 |
| 联想列表 | 最多 20 条 | 自定义 CompletionProvider |

### 4.2 安全要求

| 需求 | 实现方案 |
|------|----------|
| 密码加密存储 | MAC 地址 + AES-256 对称加密 |
| 进程隔离 | Electron contextIsolation: true |
| Node 集成 | nodeIntegration: false |
| API 暴露 | 仅通过 preload contextBridge 暴露必要 API |

**加密流程**:
```
1. 获取本机 MAC 地址作为密钥种子
2. 使用 PBKDF2 派生 256 位密钥
3. 使用 AES-256-CBC 加密密码
4. 存储 IV + 密文到本地配置文件
```

### 4.3 可用性要求

| 需求 | 实现方案 |
|------|----------|
| 连接断开恢复 | 自动重连机制，最多重试 3 次 |
| 查询中断 | KILL QUERY 命令，仅中断不回滚 |
| 错误提示 | 友好的错误信息，红色波浪线 + 悬浮提示 |

### 4.4 可维护性要求

| 需求 | 实现方案 |
|------|----------|
| 代码规范 | ESLint + Prettier |
| 组件化 | Vue 3 组合式 API，单文件组件 |
| 状态管理 | Pinia，状态集中管理 |

---

## 5. 部署架构

### 5.1 打包配置

**Windows 打包**:
- 格式: 免安装包 (portable)
- 输出: `sql-tool-{version}-win.zip`

**macOS 打包**:
- 格式: DMG 安装包
- 输出: `sql-tool-{version}-mac.dmg`

### 5.2 electron-builder 配置

```yaml
# electron-builder.yml
appId: com.sqltool.app
productName: SQL Tool
directories:
  output: dist

win:
  target:
    - target: portable
      arch: [x64]
  icon: build/icon.ico

mac:
  target:
    - target: dmg
      arch: [x64, arm64]
  icon: build/icon.icns
  category: public.app-category.developer-tools

dmg:
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications
```

### 5.3 开发环境

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 打包 Windows
npm run pack:win

# 打包 macOS
npm run pack:mac
```

---

## 6. 需求变更架构影响分析 (2025-12-22)

### 6.1 变更概述

| 变更项 | 影响范围 | 复杂度 | 架构冲击 |
|--------|----------|--------|----------|
| 双击切换数据库 | 渲染进程 | 低 | 无 |
| CSS 高亮显示 | 渲染进程 | 低 | 无 |
| 单元格可编辑 | 主进程 + 渲染进程 | **高** | **中** |
| 导出功能 | 主进程 + 渲染进程 | 中 | 低 |
| 保存快捷键 | 渲染进程 | 低 | 无 |

### 6.2 单元格可编辑功能架构设计

#### 6.2.1 功能概述

单表 SELECT 查询结果支持直接编辑，双击单元格进入编辑模式，回车提交 UPDATE 语句，ESC 取消编辑。

#### 6.2.2 技术方案

**核心流程**:
```
1. 执行 SELECT 查询
2. 解析 SQL 判断是否为单表查询
3. 查询表的主键信息
4. 标记结果集为可编辑/不可编辑
5. 用户双击单元格进入编辑模式
6. 回车时生成 UPDATE 语句并执行
7. 更新成功后刷新单元格显示
```

**SQL 解析策略**:
- 使用正则表达式检测单表 SELECT 模式
- 匹配模式: `SELECT ... FROM table_name [WHERE ...] [ORDER BY ...] [LIMIT ...]`
- 排除 JOIN、子查询、UNION 等复杂查询

**主键检测**:
```sql
SELECT COLUMN_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = 'PRIMARY'
```

#### 6.2.3 数据结构扩展

**QueryResultSet 类型扩展**:
```typescript
interface QueryResultSet {
  // 原有字段...
  columns: ColumnDef[]
  rows: any[][]
  
  // 新增字段
  editable: boolean           // 是否可编辑
  tableName?: string          // 表名（可编辑时必填）
  databaseName?: string       // 数据库名
  primaryKeys?: string[]      // 主键列名列表
}

interface ColumnDef {
  name: string
  type: string
  isPrimaryKey?: boolean      // 新增：是否为主键
}
```

#### 6.2.4 模块职责扩展

| 模块 | 新增职责 |
|------|----------|
| **query-executor.ts** | 解析单表查询、获取主键信息、执行 UPDATE |
| **ResultTable.vue** | 可编辑单元格、编辑状态管理、UPDATE 触发 |
| **ipc/query.ts** | 新增 updateCell IPC 处理器 |
| **preload/index.ts** | 暴露 updateCell API |

#### 6.2.5 IPC 通道扩展

| 通道名称 | 方向 | 参数 | 返回值 |
|----------|------|------|--------|
| `QUERY_UPDATE_CELL` | 渲染 → 主进程 | `{connectionId, database, table, primaryKeyValues, column, newValue}` | `{success, message}` |

#### 6.2.6 UPDATE 语句生成

```typescript
function generateUpdateSql(
  table: string,
  column: string,
  newValue: any,
  primaryKeys: {column: string, value: any}[]
): string {
  const setClause = `\`${column}\` = ?`
  const whereClause = primaryKeys
    .map(pk => `\`${pk.column}\` = ?`)
    .join(' AND ')
  return `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`
}
```

#### 6.2.7 安全考虑

1. **SQL 注入防护**: 使用参数化查询
2. **主键验证**: 确保 WHERE 条件包含所有主键
3. **并发控制**: 单次只允许编辑一个单元格
4. **错误回滚**: UPDATE 失败时恢复原值显示

### 6.3 导出功能架构设计

#### 6.3.1 技术方案

| 格式 | 实现方式 |
|------|----------|
| CSV | 主进程使用 Node.js fs 模块写入 |
| JSON | 主进程使用 JSON.stringify |

#### 6.3.2 IPC 通道

| 通道名称 | 参数 | 返回值 |
|----------|------|--------|
| `FILE_EXPORT` | `{format: 'csv'|'json', data: QueryResultSet}` | `{success, filePath}` |

### 6.4 架构图更新

```
渲染进程 ResultTable.vue
    │
    │ 双击单元格
    ▼
编辑模式 ──► 回车 ──► preload.query.updateCell()
    │                        │
    │ ESC                    │ IPC
    ▼                        ▼
恢复原值              main/ipc/query.ts
                            │
                            ▼
                     query-executor.ts
                            │
                            │ 执行 UPDATE
                            ▼
                        MySQL
```

---

## 7. 架构演进计划

### 7.1 当前局限

1. **单数据库支持**: 目前仅支持 MySQL
2. **本地存储**: 连接配置仅存储在本地
3. **单窗口**: 不支持多窗口

### 7.2 演进方向

| 阶段 | 计划 | 优先级 |
|------|------|--------|
| Phase 2 | 支持 PostgreSQL、SQLite | 中 |
| Phase 2 | 云端同步连接配置 | 低 |
| Phase 3 | 多窗口支持 | 低 |
| Phase 3 | 插件系统 | 低 |

---

## 7. 质量检查清单

- [x] 架构风格已选择并有量化理由
- [x] 技术栈完整且版本明确
- [x] 模块职责清晰无循环依赖
- [x] 非功能需求有具体实现方案和指标
- [x] 部署架构可执行
- [x] 文档结构完整，内容量化
- [x] 重要架构决策已记录 ADR
