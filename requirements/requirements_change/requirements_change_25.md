# RC-025 视图创建语句查看 & 编辑器选中区域格式化

## 1. 需求概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-025 |
| 需求名称 | 视图创建语句查看 & 编辑器选中区域格式化 |
| 提出日期 | 2026-06-16 |
| 优先级 | P1-高 |
| 影响范围 | 全栈（主进程+渲染进程） |

---

## 2. 需求背景

### 2.1 现状问题

1. **视图无法查看创建语句**：左侧树形组件中，表节点右键可以"管理"查看建表语句，但视图节点右键只有"新建查询"，无法查看 `CREATE VIEW` 语句
2. **编辑器 hover 视图名无交互**：鼠标悬停在 SQL 中的视图名称上时，hover 提示只显示视图名，不显示列信息，也无法点击打开创建语句查看
3. **编辑器格式化不支持选中区域**：右键菜单没有"格式化"选项，且 `Shift+Alt+F` 快捷键只能格式化整个文档，无法仅格式化选中的 SQL 片段

### 2.2 变更原因

- 用户需要查看视图定义来理解视图的构成逻辑
- 在复杂 SQL 中，只格式化选中部分更加灵活实用
- 提升视图与表功能的一致性（表有管理/建表语句查看，视图也应有）

---

## 3. 变更内容

### 3.1 功能一：左侧树视图右键"查看创建语句"

在左侧树形组件的视图节点右键菜单中新增"查看创建语句"菜单项，点击后弹出弹层显示该视图的 `CREATE VIEW` 语句。

#### 3.1.1 弹层展示

弹层内容：
- 标题栏显示"视图: {viewName}"
- 代码编辑器区域（只读），显示 `CREATE VIEW` 语句，支持语法高亮
- 标题栏右侧有"复制"按钮，点击后将语句复制到剪贴板
- 支持 `Ctrl+A` 全选代码，方便用户复制整段语句

#### 3.1.2 后端实现

- MySQL 驱动：使用 `SHOW CREATE VIEW \`database\`.\`view\`` 获取视图创建语句
- SQL Server 驱动：使用 `SELECT OBJECT_DEFINITION(OBJECT_ID('{schema}.{view}'))` 获取视图定义；若无 schema，默认使用 `dbo`

### 3.2 功能二：编辑器 hover 视图名点击显示创建语句

在编辑器中，鼠标悬停在视图名称上时：
- hover 提示显示视图名称和说明（与现有行为一致）
- 新增：点击 hover 浮层中的视图名称时，弹出弹层显示该视图的 `CREATE VIEW` 语句

#### 3.2.1 与功能一的弹层一致

功能和功能一使用同一个弹层组件展示创建语句，确保视觉风格统一。

#### 3.2.2 后端改动

- `HoverProvider.createViewHover()` 返回 `viewInfo`（类似现有的 `tableInfo`）
- `HoverResult` 接口新增 `viewInfo` 字段

### 3.3 功能三：编辑器右键格式化支持选中区域

在编辑器右键菜单中新增"格式化 SQL"菜单项。

#### 3.3.1 行为逻辑

- **如果编辑器中有选中的 SQL 文本**：仅格式化选中的 SQL 片段，替换选中区域的文本
- **如果没有选中文本**：格式化整个文档

#### 3.3.2 保留快捷键

现有的 `Shift+Alt+F` 快捷键保持原有行为（格式化整个文档），不受此功能影响。

---

## 4. 输入输出示例

### 示例 1：树形组件右键查看视图创建语句

**场景**：左侧树形组件中，某数据库下有视图 `v_user_stats`

**操作**：
1. 右键点击视图 `v_user_stats`
2. 在弹出的菜单中选择"查看创建语句"

**期望结果**：
- 弹出弹层，标题为"视图: v_user_stats"
- 代码区域显示：
```sql
CREATE VIEW `v_user_stats` AS
SELECT `u`.`id`, `u`.`name`, COUNT(`o`.`id`) AS `order_count`
FROM `users` `u`
LEFT JOIN `orders` `o` ON `u`.`id` = `o`.`user_id`
GROUP BY `u`.`id`, `u`.`name`
```

### 示例 2：编辑器 hover 点击视图名

**场景**：编辑器中写有 SQL：`SELECT * FROM v_user_stats`

**操作**：
1. 鼠标悬停在 `v_user_stats` 上
2. hover 提示显示视图信息
3. 点击 hover 浮层中的视图名称 `v_user_stats`

**期望结果**：弹出与示例 1 相同的弹层，显示视图创建语句

### 示例 3：选中区域格式化

**场景**：编辑器中写有多条 SQL
```sql
SELECT * FROM users;
select a,b,c from orders where status=1;
```

**操作**：
1. 选中第二行 `select a,b,c from orders where status=1;`
2. 右键菜单选择"格式化 SQL"

**期望结果**：仅选中的部分被格式化，第一行不变
```sql
SELECT * FROM users;
SELECT
  a,
  b,
  c
FROM orders
WHERE
  status = 1;
```

---

## 5. 影响分析

### 5.1 受影响的模块

| 模块 | 文件路径 | 修改类型 | 说明 |
|------|----------|----------|------|
| 驱动接口 | `src/main/database/core/interface.ts` | 修改 | 新增 `getViewCreateSql()` 方法 |
| MySQL 驱动 | `src/main/database/mysql/driver.ts` | 修改 | 实现 `getViewCreateSql()` |
| SQL Server 驱动 | `src/main/database/sqlserver/driver.ts` | 修改 | 实现 `getViewCreateSql()` |
| IPC 通道常量 | `src/shared/constants/index.ts` | 修改 | 新增 `DATABASE_VIEW_CREATE_SQL` |
| IPC 数据库处理 | `src/main/ipc/database.ts` | 修改 | 新增视图创建语句查询 handler |
| Preload API | `src/preload/index.ts` | 修改 | 新增 `database.viewCreateSql` |
| 连接 Store | `src/renderer/stores/connection.ts` | 修改 | 新增 `getViewCreateSql()` |
| 视图创建语句弹窗 | `src/renderer/components/ViewCreateSqlDialog.vue` | **新增** | 弹层展示视图创建语句 |
| 树形组件 | `src/renderer/components/ConnectionTree.vue` | 修改 | 视图右键菜单新增"查看创建语句" |
| Hover Provider | `src/main/sql-language-server/providers/hoverProvider.ts` | 修改 | `createViewHover` 返回 `viewInfo` |
| Language Server | `src/renderer/composables/useLanguageServer.ts` | 修改 | 新增 `openViewCreateFromHover()`，hover 状态管理 |
| SQL 编辑器 | `src/renderer/components/SqlEditor.vue` | 修改 | 视图名点击处理、右键格式化菜单 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/zh-CN.json` | 修改 | 新增翻译键 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/zh-TW.json` | 修改 | 新增翻译键 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/en-US.json` | 修改 | 新增翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/zh-CN.ts` | 修改 | 新增 hover 翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/zh-TW.ts` | 修改 | 新增 hover 翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/en-US.ts` | 修改 | 新增 hover 翻译键 |

### 5.2 依赖关系

- `getViewCreateSql()` 依赖 `getConnectionWithReconnect()` —— MySQL 驱动已有
- `getViewCreateSql()` 依赖 `getPoolWithReconnect()` —— SQL Server 驱动已有
- 弹层组件复用 Element Plus 的 `el-dialog` 和 Monaco Editor 组件
- 无外部依赖，纯项目内改动

---

## 6. 测试用例

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | 树形组件查看视图创建语句（MySQL） | 右键视图 → "查看创建语句" | 弹层显示 SHOW CREATE VIEW 结果 |
| TC02 | 树形组件查看视图创建语句（SQL Server） | 右键视图 → "查看创建语句" | 弹层显示 OBJECT_DEFINITION 结果 |
| TC03 | 弹层复制功能 | 在弹层中点击"复制"按钮 | 创建语句被复制到剪贴板，提示"已复制" |
| TC04 | 编辑器 hover 视图名 | 鼠标悬停在视图名上 | hover 显示视图信息 + 状态栏提示"点击视图名查看创建语句" |
| TC05 | 编辑器点击 hover 中的视图名 | 点击 hover 浮层中的视图名 | 弹出视图创建语句弹层 |
| TC06 | 编辑器右键格式化（有选中区域） | 选中部分 SQL → 右键"格式化 SQL" | 仅格式化选中的 SQL |
| TC07 | 编辑器右键格式化（无选中区域） | 直接右键"格式化 SQL" | 格式化整个文档 |
| TC08 | 快捷键格式化 | `Shift+Alt+F` | 格式化整个文档（保持原行为） |
| TC09 | 视图创建语句获取失败（连接断开） | 断开连接后右键视图 | 错误提示"获取视图创建语句失败" |
| TC10 | 视图不存在 | 输入不存在的视图名 | 错误提示 |

---

## 7. 非功能需求

| 类别 | 要求 |
|------|------|
| 用户体验 | 弹层代码区域使用 Monaco Editor，保持与主编辑器一致的视觉体验 |
| 用户体验 | 视图创建语句弹层与表管理弹层的风格保持一致 |
| 可靠性 | 视图创建语句获取失败时有明确的错误提示 |
| 性能 | 弹层打开时异步加载视图创建语句，不阻塞 UI |

---

## 8. 方案设计

### 8.1 数据流

```
树形组件右键"查看创建语句"
    │
    ▼
connectionStore.getViewCreateSql(connectionId, database, view)
    │
    ▼  (IPC invoke)
主进程 DATABASE_VIEW_CREATE_SQL handler
    │
    ▼
DriverFactory → MySQLDriver/SqlServerDriver.getViewCreateSql()
    │  MySQL: SHOW CREATE VIEW `db`.`view`
    │  SQL Server: SELECT OBJECT_DEFINITION(...)
    ▼
返回 { success: true, sql: "CREATE VIEW ..." }
    │
    ▼
显示 ViewCreateSqlDialog 弹层

═══════════════════════════════════════════

编辑器 hover 视图名点击
    │
    ▼
provideHover() → createViewHover() 返回 viewInfo: { name }
    │
    ▼  (IPC 返回)
useLanguageServer 保存 currentHoverViewInfo
    │
    ▼
用户点击 hover widget 中的视图名
    │
    ▼
handleHoverClick() 检测点击的是视图名
    │
    ▼
languageServer.openViewCreateFromHover()
    │
    ▼
connectionStore.getViewCreateSql(...) → 显示弹层

═══════════════════════════════════════════

编辑器右键"格式化 SQL"
    │
    ▼
检测是否有选中文本 (editor.getSelection())
    │
    ├── 有选中 → 获取选中文本 → 格式化 → 替换选中区域
    └── 无选中 → 格式化整个文档 (现有行为)
```

### 8.2 组件结构

```
┌─────────────────────────────────────────────────────┐
│  ViewCreateSqlDialog.vue (新增)                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  视图: {viewName}                    [复制] │   │
│  ├──────────────────────────────────────────────┤   │
│  │                                              │   │
│  │  Monaco Editor (只读, SQL 语法高亮)           │   │
│  │                                              │   │
│  │  CREATE VIEW ... AS                          │   │
│  │  SELECT ...                                  │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 9. 备注

- 视图创建语句弹层参考表管理弹层（`TableManageDialog.vue`）的设计风格
- SQL Server 的 `OBJECT_DEFINITION` 返回的是视图的 SELECT 语句，不是完整的 `CREATE VIEW`，可在前端前缀添加 `CREATE VIEW [schema].[view] AS`
- 格式化选中区域时，使用 `editor.executeEdits()` 支持撤销操作

---

## 10. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-06-16 | 初始创建 | 待实现 |
