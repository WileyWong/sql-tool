# RC-027 视图字段自动联想

## 基本信息

| 项目 | 内容 |
|------|------|
| 变更编号 | RC-027 |
| 变更日期 | 2026-07-07 |
| 提出人 | AI 辅助分析 |
| 优先级 | P2-中 |
| 影响范围 | 全栈（驱动层 + Language Server + 渲染进程） |

---

## 1. 变更概述

在 SQL 编辑器中输入 SQL 时，视图（View）名称后面的 `.` 以及 SELECT/WHERE/ON/GROUP BY/ORDER BY 等子句中，也能提示视图的字段列表。目前只有表的字段支持联想。

---

## 2. 变更背景

### 2.1 现状问题

- 表字段联想工作正常（如 `users.` → 提示 `id, name, email...`）
- 视图字段无法联想（如 `user_view.` → 无任何提示）
- `information_schema.COLUMNS` 中已包含视图的字段信息（包括计算字段），但驱动层未查询

### 2.2 变更原因

- 用户反馈视图和表的使用体验不一致
- 视图在 SQL 中与表的语法完全一致，联想也应该一致
- 无需新增架构，仅补齐数据链路

### 2.3 计算字段兼容性

视图中的计算字段（如 `CONCAT(a, b) AS full_name`）在 `information_schema.COLUMNS` 和 `sys.columns` 中都有明确的列名和推断类型，联想系统仅消费 `name` + `type`，不受影响。

---

## 3. 变更内容

### 3.1 功能需求

| 序号 | 功能点 | 描述 | 验收标准 |
|------|--------|------|----------|
| 1 | `view.` 联想 | 输入视图名+`.` 后弹出视图字段列表 | 字段列表与表字段格式一致（列名、类型、注释） |
| 2 | SELECT 列位置联想 | `SELECT ... FROM user_view` 时输入列名提示视图字段 | 视图字段出现在联想列表中 |
| 3 | WHERE/ON/GROUP BY/ORDER BY 联想 | 各子句中视图字段也可联想 | 与表字段行为一致 |

### 3.2 非功能需求

- 不对已有表字段联想产生副作用
- 视图字段查询复用已有 `information_schema.COLUMNS` / `sys.columns` 查询逻辑

---

## 4. 输入输出示例

### 示例 1：`view.` 补全

**输入：**
```sql
SELECT user_summary.|
```
（`user_summary` 是一个视图，含 `user_id`, `total_orders`, `full_name` 等字段）

**期望输出：**
显示补全列表：`user_id (int)`, `total_orders (decimal)`, `full_name (varchar)`, ...

### 示例 2：WHERE 子句中视图字段补全

**输入：**
```sql
SELECT * FROM order_view WHERE |
```

**期望输出：**
显示 `order_view` 的所有字段及关键字 `AND`, `OR`, `NOT`, `IN`, `LIKE`...

---

## 5. 影响分析

### 5.1 根因：4 个环节缺失

| 环节 | 文件 | 问题 |
|------|------|------|
| 类型定义 | `src/main/sql-language-server/types/index.ts` | `ViewMetadata` 只有 `name`/`comment`，无 `columns` |
| MySQL 驱动 | `src/main/database/mysql/driver.ts:337-354` | `getViews()` 返回 `columns: []` 硬编码 |
| SQL Server 驱动 | `src/main/database/sqlserver/driver.ts:395-415` | `getViews()` 返回 `columns: []` 硬编码 |
| 渲染进程传递 | `src/renderer/composables/useLanguageServer.ts:188-192` | 只传 `name`，`columns` 被丢弃 |
| LS MetadataService | `src/main/sql-language-server/services/metadataService.ts:307-310` | `getColumns()` 只查 `this.tables`，不查 `this.views` |

### 5.2 受影响的模块

| 模块 | 文件路径 | 修改类型 |
|------|----------|----------|
| LS 类型 | `src/main/sql-language-server/types/index.ts` | 修改 `ViewMetadata` |
| MySQL 驱动 | `src/main/database/mysql/driver.ts` | 修改 `getViews()` |
| SQL Server 驱动 | `src/main/database/sqlserver/driver.ts` | 修改 `getViews()` |
| LS MetadataService | `src/main/sql-language-server/services/metadataService.ts` | 修改 `getColumns()` |
| 渲染进程 LS | `src/renderer/composables/useLanguageServer.ts` | 修改 `updateMetadata()` |

### 5.3 依赖关系

- 无外部依赖
- `CompletionProvider` **不需要修改**——所有联想方法统一通过 `metadataService.getColumns(name)` 获取字段

### 5.4 对已有功能的影响

| 场景 | 影响 |
|------|------|
| 表字段联想 | 无——`getColumns()` 优先查表 |
| FROM 联想列表 | 无——`addViewSuggestions()` 只读 `view.name` |
| Hover 悬浮提示 | 潜在受益——修复后视图字段也能展示悬浮信息 |
| 函数联想 | 无——独立链路 |

---

## 6. 测试用例

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | `view.` 联想 | 输入 `user_view.` | 弹出视图字段列表 |
| TC02 | 表字段联想不受影响 | 输入 `users.` | 弹出表字段列表（与之前一致） |
| TC03 | SELECT 中视图字段 | `SELECT ... FROM order_view WHERE` 补全 | 列出视图字段 |
| TC04 | WHERE 中视图字段 | `SELECT * FROM v WHERE ` 补全 | 列出视图字段 + 关键字 |
| TC05 | ON 中视图字段 | `SELECT * FROM a JOIN v ON ` 补全 | 列出视图字段 |
| TC06 | GROUP BY 视图字段 | `SELECT ... FROM v GROUP BY ` 补全 | 列出视图字段 |
| TC07 | ORDER BY 视图字段 | `SELECT ... FROM v ORDER BY ` 补全 | 列出视图字段 |
| TC08 | 视图含计算字段 | `calc_view.` 补全 | 计算字段列名正常显示 |
| TC09 | Hover 视图字段 | 悬停视图字段名 | 显示字段类型和来源视图信息 |

---

## 7. 方案设计

### 7.1 数据流修复

```text
修复前：
  driver.getViews() → { name, columns: [] } → ipc → connectionStore
    → useLanguageServer.updateMetadata() → { name, comment: undefined } → LS
    → MetadataService.getColumns(viewName) → 查 tables → 无结果 → 返回 []

修复后：
  driver.getViews() → { name, columns: [{name, type, ...}] } → ipc → connectionStore
    → useLanguageServer.updateMetadata() → { name, comment, columns } → LS
    → MetadataService.getColumns(viewName) → 查 tables → 无 → 查 views → 返回 columns
    → CompletionProvider.addColumnSuggestions... → 联想列表正常显示
```

### 7.2 关键修改点

#### ① `ViewMetadata` 类型
```diff
export interface ViewMetadata {
  name: string
  comment?: string
+ columns: ColumnMetadata[]
}
```

#### ② MySQL 驱动 `getViews()`
追加查询 `information_schema.COLUMNS`（复用已有 `getColumns()` 的 SQL 模式），将结果按 `TABLE_NAME` 分组组装为 `ViewMeta[]`。

#### ③ SQL Server 驱动 `getViews()`
追加查询 `sys.columns` 联表 `sys.views`（复用已有 `getColumns()` 的系统表联查模式）。

#### ④ `MetadataService.getColumns()`
```diff
getColumns(tableName: string): ColumnMetadata[] {
  const table = this.tables.get(tableName.toLowerCase())
- return table?.columns || []
+ if (table) return table.columns
+ const view = this.views.get(tableName.toLowerCase())
+ return view?.columns || []
}
```

#### ⑤ `useLanguageServer.updateMetadata()`
```diff
const views = dbMeta.views.map(v => ({
  name: v.name,
- comment: undefined as string | undefined
+ comment: v.comment,
+ columns: v.columns.map(c => ({
+   name: c.name, type: c.type, nullable: c.nullable !== false,
+   defaultValue: c.defaultValue, comment: c.comment, isPrimaryKey: c.primaryKey
+ }))
}))
```

---

## 8. 备注

- 视图字段也存储在 `information_schema.COLUMNS`（MySQL）和 `sys.columns`（SQL Server）中，包括计算字段
- 计算字段在系统表中具有明确的列名和推断类型，不影响联想功能
- `CompletionProvider` 无需改动——`addColumnSuggestionsForTables`、`addColumnSuggestionsForTable`、`addColumnSuggestionsForTableDot` 统一通过 `metadataService.getColumns()` 获取字段

---

## 9. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-07-07 | 初始创建 | 实现中 |
