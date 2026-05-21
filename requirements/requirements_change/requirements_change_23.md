# RC-023 导出为 SQL 语句 & 连接树右键新建查询

## 1. 需求概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-023 |
| 需求名称 | 导出为 SQL 语句 & 连接树右键新建查询 |
| 提出日期 | 2026-05-21 |
| 优先级 | P2-中 |
| 影响范围 | 前端（渲染进程） |

---

## 2. 功能一：查询结果导出为 INSERT / UPDATE 语句

### 2.1 功能描述

在查询结果表格中勾选行后，在现有"添加新行"按钮左侧新增一个下拉按钮，提供"导出为 INSERT 语句"和"导出为 UPDATE 语句"两个选项。点击后将勾选的行数据生成对应的 SQL 语句，并在新的编辑器标签页中打开显示。

### 2.2 触发条件

- 查询结果中有勾选的行（`selectedRowKeys.size > 0`）
- 按钮在无勾选行时禁用（disabled）

### 2.3 按钮位置

在 `DataOperationsToolbar` 组件中，"添加新行"按钮的**左侧**，新增一个下拉按钮（或按钮组）：

```
[导出SQL ▼] [➕添加新行] [↩还原] [🗑删除] [✔提交]
```

### 2.4 INSERT 语句生成规则

**输入**：勾选的行数据 + 列定义 + 表名

**输出格式（每行数据生成一条 INSERT）**：

```sql
INSERT INTO `表名` (`列1`, `列2`, `列3`) VALUES ('值1', 2, '值3');
INSERT INTO `表名` (`列1`, `列2`, `列3`) VALUES ('值4', 5, '值6');
```

**值格式化规则**：

| 数据类型 | 格式 | 示例 |
|----------|------|------|
| 字符串（varchar/text/char等） | 单引号包裹，内部单引号转义 | `'hello'`、`'it''s'` |
| 数值（int/bigint/decimal等） | 不加引号 | `123`、`3.14` |
| NULL | `NULL` 关键字 | `NULL` |
| 日期时间 | 单引号包裹 | `'2026-05-21 10:00:00'` |
| 布尔值 | 0/1 | `1` |
| 二进制/Buffer | 十六进制字面量 | `X'48656C6C6F'` |

### 2.5 UPDATE 语句生成规则

**前提**：需要有主键信息（`primaryKeys`），用于生成 WHERE 条件

**输出格式（每行数据生成一条 UPDATE）**：

```sql
UPDATE `表名` SET `列1` = '值1', `列2` = 2, `列3` = '值3' WHERE `主键列` = '主键值';
UPDATE `表名` SET `列1` = '值4', `列2` = 5, `列3` = '值6' WHERE `主键列` = '主键值2';
```

**规则**：
- SET 子句包含**所有非主键列**
- WHERE 条件使用主键列（支持复合主键，用 AND 连接）
- 主键列不出现在 SET 中

### 2.6 输出方式

生成的 SQL 语句通过 `editorStore.createTab(sqlContent)` 在**新标签页**中打开，不自动关联数据库连接。

### 2.7 边界场景

| 场景 | 处理方式 |
|------|----------|
| 未勾选任何行 | 按钮禁用（disabled），不可点击 |
| 无表名信息（`tableName` 为空） | 按钮禁用或使用占位符 `<table_name>` |
| 无主键信息 | "导出为 UPDATE"选项禁用（无法生成 WHERE） |
| 勾选行数较多（如 1000+ 行） | 正常生成，无数量限制 |
| 列值包含特殊字符（换行、引号） | 正确转义 |
| BigInt 类型值 | 转为字符串数字，不加引号 |

---

## 3. 功能二：连接树右键"新建查询"

### 3.1 功能描述

在左侧数据库连接树中，对数据库节点、表节点、视图节点右键时，菜单中新增"新建查询"选项。点击后创建新的编辑器标签页，并根据点击的节点类型自动设置连接和内容。

### 3.2 菜单添加位置

| 节点类型 | 现有菜单 | 新增菜单项 |
|----------|---------|-----------|
| `database` | createDatabase, dropDatabase, refresh | **+ newQuery** |
| `table` | query100, manage, editTable, dropTable | **+ newQuery** |
| `view` | （当前无右键菜单） | **+ newQuery** |

### 3.3 点击"新建查询"后的行为

#### 3.3.1 数据库节点

| 操作 | 描述 |
|------|------|
| 新开标签页 | 创建空白编辑器 Tab |
| 自动连接 | Tab 的 `connectionId` 设置为该数据库所属连接 |
| 自动选库 | Tab 的 `databaseName` 设置为该数据库名 |
| 编辑器内容 | 空白 |

#### 3.3.2 表节点

| 操作 | 描述 |
|------|------|
| 新开标签页 | 创建编辑器 Tab |
| 自动连接 | Tab 的 `connectionId` 设置为该表所属连接 |
| 自动选库 | Tab 的 `databaseName` 设置为该表所属数据库 |
| 编辑器内容 | `SELECT * FROM 表名;`（带反引号/方括号） |

**SQL 格式**：
- MySQL：`` SELECT * FROM `表名`; ``
- SQL Server（有 schema 且非 dbo）：`SELECT * FROM [schema].[表名];`
- SQL Server（dbo）：`SELECT * FROM [表名];`

#### 3.3.3 视图节点

行为与表节点完全一致：

| 操作 | 描述 |
|------|------|
| 新开标签页 | 创建编辑器 Tab |
| 自动连接 | Tab 的 `connectionId` 设置为该视图所属连接 |
| 自动选库 | Tab 的 `databaseName` 设置为该视图所属数据库 |
| 编辑器内容 | `SELECT * FROM 视图名;` |

### 3.4 关联行为

新建查询后，Tab 的连接和数据库选择自动生效，用户可以直接按 `Ctrl+Enter`（或点执行按钮）执行查询，无需手动选择连接和数据库。

### 3.5 边界场景

| 场景 | 处理方式 |
|------|----------|
| 连接已断开 | 正常创建 Tab 并设置 connectionId/databaseName，执行时按需自动重连 |
| 表名含特殊字符 | 使用反引号（MySQL）或方括号（SQL Server）包裹 |
| SQL Server 带 schema | 格式为 `[schema].[表名]` |

---

## 4. 输入输出示例

### 示例 1：导出为 INSERT 语句

**勾选的行数据**：

| id | name | age | email |
|----|------|-----|-------|
| 1 | Alice | 25 | alice@test.com |
| 2 | Bob | NULL | bob@test.com |

**表名**：`users`

**生成的 SQL**：
```sql
INSERT INTO `users` (`id`, `name`, `age`, `email`) VALUES (1, 'Alice', 25, 'alice@test.com');
INSERT INTO `users` (`id`, `name`, `age`, `email`) VALUES (2, 'Bob', NULL, 'bob@test.com');
```

### 示例 2：导出为 UPDATE 语句

**勾选的行数据**（主键为 `id`）：

| id | name | age | email |
|----|------|-----|-------|
| 1 | Alice | 30 | alice@new.com |

**生成的 SQL**：
```sql
UPDATE `users` SET `name` = 'Alice', `age` = 30, `email` = 'alice@new.com' WHERE `id` = 1;
```

### 示例 3：右键数据库新建查询

**操作**：右键点击数据库节点 `user_db` → 新建查询

**结果**：新开 Tab，连接自动选中该 connection，数据库选中 `user_db`，编辑器内容为空

### 示例 4：右键表新建查询

**操作**：右键点击表节点 `resume_main`（在数据库 `recruit_db` 下）→ 新建查询

**结果**：新开 Tab，连接自动选中，数据库选中 `recruit_db`，编辑器内容为：
```sql
SELECT * FROM `resume_main`;
```

### 示例 5：右键 SQL Server 表新建查询（含 schema）

**操作**：右键点击表节点 `hr.employees` → 新建查询

**结果**：编辑器内容为：
```sql
SELECT * FROM [hr].[employees];
```

---

## 5. 影响分析

### 5.1 功能一：导出为 SQL 语句

| 模块 | 文件路径 | 修改类型 | 说明 |
|------|----------|----------|------|
| 数据操作工具栏 | `src/renderer/components/DataOperationsToolbar.vue` | 修改 | 新增"导出SQL"下拉按钮 |
| 数据操作 Composable | `src/renderer/composables/useDataOperations.ts` | 修改 | 新增 `generateInsertSql()` / `generateUpdateSql()` 方法 |
| 编辑器 Store | `src/renderer/stores/editor.ts` | 无需修改 | 复用现有 `createTab(content)` |

### 5.2 功能二：连接树右键新建查询

| 模块 | 文件路径 | 修改类型 | 说明 |
|------|----------|----------|------|
| 连接树组件 | `src/renderer/components/ConnectionTree.vue` | 修改 | 菜单项新增 `newQuery`；`handleMenuClick` 新增处理分支 |
| 编辑器 Store | `src/renderer/stores/editor.ts` | 可能修改 | 新增 `createTabWithConnection()` 方法（或复用 createTab + updateTabConnection） |

### 5.3 依赖关系

- 功能一依赖 `QueryResultSet` 中的 `tableName`、`primaryKeys`、`columns`、`rows` 信息
- 功能一依赖 `useDataOperations` 中的 `selectedRowKeys` 获取勾选行
- 功能二依赖 `TreeNode` 中的 `connectionId`、`databaseName`、`schema`、`label` 信息
- 功能二需要知道当前连接的数据库类型（MySQL / SQL Server），以决定标识符引用符号

---

## 6. 测试用例

### 功能一：导出为 SQL 语句

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | 导出 INSERT（基本） | 勾选 2 行 → 导出为 INSERT | 新 Tab 显示 2 条 INSERT 语句，值格式正确 |
| TC02 | 导出 UPDATE（基本） | 勾选 1 行 → 导出为 UPDATE | 新 Tab 显示 1 条 UPDATE，SET 不含主键，WHERE 使用主键 |
| TC03 | NULL 值处理 | 勾选含 NULL 值的行 → 导出 INSERT | NULL 不加引号 |
| TC04 | 特殊字符转义 | 列值含单引号 `it's` | 转义为 `'it''s'` |
| TC05 | 无主键时 UPDATE 禁用 | 查询无主键表 → 勾选行 | "导出为 UPDATE"选项禁用 |
| TC06 | 无勾选行时按钮禁用 | 不勾选任何行 | 导出 SQL 按钮禁用 |
| TC07 | 复合主键 UPDATE | 复合主键表勾选行 → 导出 UPDATE | WHERE 用 AND 连接多个主键条件 |
| TC08 | BigInt 类型 | 列为 bigint，值为大数字 | 数字不加引号，不丢失精度 |
| TC09 | 大批量行导出 | 勾选 500 行 → 导出 INSERT | 正常生成 500 条 INSERT，新 Tab 显示 |

### 功能二：连接树右键新建查询

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC11 | 数据库节点新建查询 | 右键数据库 → 新建查询 | 新 Tab，自动连接+选库，内容为空 |
| TC12 | 表节点新建查询（MySQL） | 右键 MySQL 表 → 新建查询 | 新 Tab，内容为 `` SELECT * FROM `表名`; `` |
| TC13 | 表节点新建查询（SQL Server） | 右键 SQL Server 表 → 新建查询 | 新 Tab，内容为 `SELECT * FROM [表名];` |
| TC14 | 视图节点新建查询 | 右键视图 → 新建查询 | 新 Tab，内容为 `SELECT * FROM 视图名;` |
| TC15 | SQL Server 带 schema | 右键 schema 非 dbo 的表 | 内容为 `SELECT * FROM [schema].[表名];` |
| TC16 | 连接已断开 | 右键数据库 → 新建查询 → 执行 | Tab 正常创建，执行时自动重连 |
| TC17 | 表名含特殊字符 | 表名含空格或保留字 | 正确使用引用符号包裹 |

---

## 7. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | SQL 生成应在 500ms 内完成（1000 行以内） |
| 兼容性 | INSERT/UPDATE 语句兼容 MySQL 和 SQL Server 语法差异（标识符引用符号不同） |
| 用户体验 | 导出按钮有 tooltip 提示；新建查询后 Tab 自动激活并获得焦点 |

---

## 8. 备注

- 功能一中 SQL 生成逻辑可参考 `useDataOperations.ts` 中已有的 `generateDeleteSql()` 和 `generateUpdateSql()` 方法（用于提交修改时生成 SQL），但需要区分：现有方法是针对**修改后的值**生成 SQL，而本需求是针对**原始查询结果数据**生成 SQL
- 功能二中"新建查询"与现有的 `query100` 功能类似但不同：`query100` 会直接执行并显示结果，而"新建查询"只是打开编辑器并填入 SQL，不自动执行
- MySQL 使用反引号 `` ` `` 包裹标识符，SQL Server 使用方括号 `[]` 包裹标识符

---

## 9. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-05-21 | 初始创建 | 待确认 |
