---
name: TableDesignDialog 组件架构重构 —— 按数据库类型拆分独立组件
change_id: mssql-change
source: requirements/mssql-change/mssql-change-01.md
created_at: 2026-02-10
updated_at: 2026-02-10
---

# 需求审查文档

## 1. 概述

**需求来源**: `requirements/mssql-change/mssql-change-01.md`
**变更ID**: mssql-change
**利益相关者**: 开发者（自用工具）

**需求摘要**: 将现有 `TableDesignDialog.vue`（仅支持 MySQL）重构为路由入口组件，按数据库类型动态加载 `MysqlTableDesign.vue` 和 `SqlServerTableDesign.vue`；同时改造 `ConnectionTree.vue` 右键菜单的 `query100` 和 `handleDropTable` 以支持 SQL Server 语法。

---

## 2. 功能需求（FR）

### FR1: TableDesignDialog 重构为路由入口组件

- **描述**: 将 `TableDesignDialog.vue` 从完整的表设计组件改造为路由分发组件，根据 `conn.type` 动态加载对应的子组件
- **用户故事**: 作为开发者，我希望打开表设计对话框时自动加载与当前连接类型匹配的表设计组件，以便获得正确的表设计体验
- **输入**: `connectionStore.tableDesignDialogVisible`、`connectionId`、`database`、`table`、`mode`
- **输出**: 渲染对应的 `MysqlTableDesign` 或 `SqlServerTableDesign` 组件
- **业务规则**:
  - 通过 `connectionId` 从 `connectionStore.connections` 中获取 `conn.type`
  - `type === 'mysql'` → 加载 `MysqlTableDesign`
  - `type === 'sqlserver'` → 加载 `SqlServerTableDesign`
- **验收标准**:
  - AC1: MySQL 连接下打开表设计，渲染 MysqlTableDesign 组件，功能与重构前完全一致
  - AC2: SQL Server 连接下打开表设计，渲染 SqlServerTableDesign 组件
  - AC3: 子组件关闭时正确关闭对话框
  - AC4: 子组件执行成功时正确刷新表列表

**确认项**:
- [ ] [P2-完整性] 需求未说明如果 `conn.type` 既不是 `mysql` 也不是 `sqlserver` 时的降级处理 - 建议增加兜底逻辑（如显示"不支持的数据库类型"提示）；当前项目仅支持这两种类型，风险可控

---

### FR2: MysqlTableDesign.vue — MySQL 专用表设计

- **描述**: 将现有 `TableDesignDialog.vue` 的全部代码迁移为独立组件 `MysqlTableDesign.vue`
- **用户故事**: 作为 MySQL 用户，我希望表设计功能在重构后功能完全不变，无任何回归
- **输入**: Props（visible, connectionId, database, table, mode）
- **输出**: MySQL CREATE TABLE / ALTER TABLE DDL
- **业务规则**: 与现有 `TableDesignDialog.vue` 完全一致
- **验收标准**:
  - AC1: 新建表功能与重构前完全一致
  - AC2: 编辑表功能与重构前完全一致
  - AC3: SQL 预览功能与重构前完全一致
  - AC4: 所有元数据加载（charsets, collations, engines）与重构前完全一致

**确认项**:
- [无问题] 明确为"零改动迁移"，功能规格清晰

---

### FR3: SqlServerTableDesign.vue — SQL Server 专用表设计（新建模式）

- **描述**: 新建 SQL Server 表设计组件，支持 CREATE TABLE
- **用户故事**: 作为 SQL Server 用户，我希望通过可视化界面设计表结构并生成正确的 T-SQL DDL
- **输入**: Props（visible, connectionId, database, mode='create'）+ 用户表单输入
- **输出**: T-SQL CREATE TABLE 语句 + sp_addextendedproperty 注释语句

#### FR3.1: 表基本信息

| 字段 | 说明 |
|------|------|
| 表名 | 必填 |
| Schema | 下拉选择，默认 dbo，数据来自 `SqlServerDriver.getSchemas()` |
| 注释 | 可选，通过 sp_addextendedproperty 实现 |

#### FR3.2: 列定义

| 属性 | 说明 |
|------|------|
| 列名 | 文本输入 |
| 数据类型 | `SqlServerDataTypes` 分组下拉 |
| 长度 | 根据类型动态显示，支持 MAX |
| 小数位 | DECIMAL/NUMERIC 时显示 |
| NOT NULL | 复选框 |
| 主键 | 复选框 |
| IDENTITY | 复选框，仅主键列可启用，设置 seed 和 increment（默认 1,1） |
| 默认值 | 文本输入（原样透传，与 MySQL 保持一致） |
| 注释 | 文本输入 |

#### FR3.3: 索引定义

| 属性 | 说明 |
|------|------|
| 索引名 | 文本输入 |
| 类型 | PRIMARY / UNIQUE / INDEX |
| CLUSTERED | 是/否 |
| 索引列 | 多选 + 排序方向 ASC/DESC |

#### FR3.4: SQL 生成（CREATE TABLE）

生成完整 T-SQL：
1. `CREATE TABLE [db].[schema].[table](...)` — 包含列定义、PRIMARY KEY 约束、IDENTITY、默认值
2. `CREATE [UNIQUE] INDEX ...` — UNIQUE 和普通索引在建表后创建
3. `sp_addextendedproperty` — 列注释和表注释

**执行顺序**: CREATE TABLE → CREATE INDEX → sp_addextendedproperty

#### FR3.5: SQL 预览

与 MySQL 组件一致，实时预览生成的 T-SQL。

#### FR3.6: 执行

弹出确认对话框 → 用户确认 → 按顺序逐条执行 DDL → 成功后关闭并刷新。

**验收标准**:
- AC1: Schema 下拉可正确加载所有可用 schema
- AC2: 数据类型下拉展示 SqlServerDataTypes 所有分组
- AC3: 长度输入根据类型动态显示/隐藏，VARCHAR/NVARCHAR/VARBINARY 支持 MAX
- AC4: IDENTITY 复选框仅主键列可启用，可设置 seed 和 increment
- AC5: 生成的 CREATE TABLE 语法正确，标识符使用方括号，三段式名称
- AC6: 列注释和表注释通过 sp_addextendedproperty 正确生成
- AC7: UNIQUE 和普通索引通过 CREATE INDEX 在建表后创建
- AC8: 执行后表成功创建，刷新表列表可见新表

**确认项**:
- [x] [CLARIFIED] [P1-完整性] IDENTITY 复选框与主键的关系 → **决议: 仅主键列可启用 IDENTITY**，取消主键时自动取消 IDENTITY
- [x] [CLARIFIED] [P1-完整性] 非 CLUSTERED 普通索引的创建时机 → **决议: 仅 PRIMARY KEY 内联到 CREATE TABLE，UNIQUE 和 INDEX 都在建表后通过 CREATE INDEX 创建**
- [x] [CLARIFIED] [P1-完整性] 默认值格式处理 → **决议: 原样透传用户输入，与 MySQL 组件保持一致**
- [ ] [P2-清晰性] "逐条执行（按 GO 或分号分隔）" 中的分隔策略不明确 — CREATE TABLE 和 sp_addextendedproperty 需在不同批次执行，但 sp_addextendedproperty 必须在表创建后执行。建议明确执行顺序
- [ ] [P2-完整性] 新建模式下主键约束的命名规范仅建议 `PK_表名`，未说明用户是否可自定义主键约束名

---

### FR4: SqlServerTableDesign.vue — SQL Server 专用表设计（编辑模式）

- **描述**: 支持编辑已有 SQL Server 表，生成 ALTER TABLE 语句
- **用户故事**: 作为 SQL Server 用户，我希望通过可视化界面修改已有表结构并生成正确的 ALTER TABLE T-SQL
- **输入**: Props（visible, connectionId, database, table, mode='edit'）
- **输出**: T-SQL ALTER TABLE / sp_rename / sp_addextendedproperty / sp_updateextendedproperty 语句

#### FR4.1: 加载已有表结构

- 调用 `getColumns()` 加载列信息（含 isIdentity、seed、increment、defaultConstraintName）
- 调用 `getIndexes()` 加载索引信息
- 从 TreeNode 获取表的 schema 信息

#### FR4.2: ALTER 操作

| 操作 | SQL 语法 |
|------|----------|
| 修改列类型/约束 | `ALTER TABLE ... ALTER COLUMN ...` |
| 重命名列 | `EXEC sp_rename ...` |
| 新增列 | `ALTER TABLE ... ADD ...` |
| 删除列 | `ALTER TABLE ... DROP COLUMN ...` |
| 修改默认值 | 先 `DROP CONSTRAINT [约束名]` 再 `ADD DEFAULT ... FOR [col]` |
| 删除默认值 | `ALTER TABLE ... DROP CONSTRAINT [约束名]` |
| 新增索引 | `CREATE INDEX ...` |
| 删除索引 | `DROP INDEX ...` |
| 添加/删除主键 | `ALTER TABLE ... ADD/DROP CONSTRAINT ...` |
| 新增注释（原注释为空） | `sp_addextendedproperty` |
| 修改注释（原注释非空） | `sp_updateextendedproperty` |

#### FR4.3: IDENTITY 限制

编辑模式下 IDENTITY 复选框禁用（不可添加/移除），显示 tooltip 提示。

#### FR4.4: Schema 限制

编辑模式下 Schema 字段显示但只读（不可更改）。

**验收标准**:
- AC1: 打开编辑模式正确加载已有表的列和索引信息
- AC2: IDENTITY 列在编辑模式下禁用 IDENTITY 复选框并显示 tooltip 提示
- AC3: 列重命名正确使用 sp_rename
- AC4: 生成的 ALTER TABLE 语法正确
- AC5: 注释变更正确区分 sp_addextendedproperty（原注释为空）和 sp_updateextendedproperty（原注释非空）
- AC6: 修改/删除默认值时正确使用约束名生成 DROP CONSTRAINT 语句
- AC7: 编辑模式下 Schema 字段只读

**确认项**:
- [x] [CLARIFIED] [P0-完整性] 编辑模式获取表 schema → **决议: 扩展 TreeNode + Driver，从 TreeNode 直接获取 schema**
- [x] [CLARIFIED] [P0-完整性] 默认值约束名查询 → **决议: 扩展 ColumnMeta 增加 `defaultConstraintName` 字段，getColumns() 返回约束名**
- [x] [CLARIFIED] [P1-完整性] 注释新增 vs 更新判断 → **决议: 通过原始数据判断，原注释为空用 sp_add，非空用 sp_update**
- [x] [CLARIFIED] [P1-准确性] ALTER COLUMN 不支持修改默认值 → **决议: 修改默认值需先 DROP CONSTRAINT 再 ADD DEFAULT，已在 FR4.2 操作表中补充**
- [x] [CLARIFIED] [P1-完整性] 编辑模式 Schema 字段处理 → **决议: 编辑模式下 Schema 只读，不支持 ALTER SCHEMA TRANSFER**

---

### FR5: ConnectionTree.vue 右键菜单改造

- **描述**: 根据连接类型生成不同的 SQL 语法
- **用户故事**: 作为 SQL Server 用户，我希望右键 query100 和 dropTable 生成正确的 T-SQL 语法

#### FR5.1: query100

| 数据库类型 | SQL |
|------------|-----|
| MySQL | `` SELECT * FROM `database`.`table` LIMIT 100 `` |
| SQL Server | `SELECT TOP 100 * FROM [database].[schema].[table]` |

#### FR5.2: handleDropTable

| 数据库类型 | SQL |
|------------|-----|
| MySQL | `` DROP TABLE `database`.`table`; `` |
| SQL Server | `DROP TABLE [database].[schema].[table];` |

**验收标准**:
- AC1: MySQL 连接下 query100 和 dropTable 行为不变
- AC2: SQL Server 连接下 query100 生成 `SELECT TOP 100` 语法
- AC3: SQL Server 连接下 dropTable 生成方括号语法
- AC4: SQL Server 语法包含正确的 schema 段（从 TreeNode 获取）

**确认项**:
- [x] [CLARIFIED] [P0-一致性] schema 获取方式 → **决议: 扩展 TreeNode 增加 schema 字段，从节点数据直接获取**
- [ ] [P2-完整性] SQL Server 的 dropTable 是否需要处理依赖关系（如外键约束）— MySQL 版也未处理，保持一致即可

---

### FR6: 后端改造 — 新增 getSchemas IPC 接口

- **描述**: 新增 IPC 接口供前端获取 SQL Server Schema 列表
- **用户故事**: 作为前端组件，我需要获取 Schema 列表以供用户选择
- **输入**: connectionId, database
- **输出**: schema 名称列表

**验收标准**:
- AC1: 前端调用 `window.api.database.schemas(connectionId, database)` 返回 schema 列表
- AC2: MySQL 连接调用此接口返回空数组

**确认项**:
- [无问题] 需求描述清晰，`SqlServerDriver.getSchemas()` 方法已存在（代码行 597-614），仅需打通 IPC 链路

---

### FR7: 共享类型补充

- **描述**: 在 `database.ts` 中新增 SQL Server 列定义/索引定义接口和辅助函数
- **输入**: 无
- **输出**: `SqlServerColumnFormItem`、`SqlServerIndexFormItem` 接口 + 4 个辅助函数

**验收标准**:
- AC1: `SqlServerColumnFormItem` 包含 identity、identitySeed、identityIncrement 字段
- AC2: `SqlServerIndexFormItem` 包含 clustered 和 columns（含 order）字段
- AC3: 4 个辅助函数逻辑正确

**确认项**:
- [无问题] 接口和函数定义已在需求中完整给出

---

### FR8: i18n 国际化

- **描述**: 新增 SQL Server 相关的 i18n key，同时维护 en-US、zh-CN、zh-TW 三个语言文件
- **输入**: 无
- **输出**: 三个 locale 文件新增 10 个 key

**验收标准**:
- AC1: 所有新增 key 在三个语言文件中同步添加
- AC2: 组件中所有可见文案使用 $t() 包裹
- AC3: placeholder 和 tooltip 也使用 i18n

**确认项**:
- [无问题] key 清单、各语言翻译均已在需求中完整列出

---

## 3. 业务规则（BR）

| 编号 | 规则 | 相关 FR |
|------|------|---------|
| BR1 | SQL Server 标识符用方括号 `[]` 包裹，MySQL 用反引号 | FR3, FR4, FR5 |
| BR2 | SQL Server 对象引用为三段式 `[db].[schema].[object]`，schema 从 TreeNode 获取 | FR3, FR4, FR5 |
| BR3 | IDENTITY 仅可在建表时指定，不可通过 ALTER 添加/移除 | FR3, FR4 |
| BR4 | IDENTITY 仅主键列可启用 | FR3 |
| BR5 | SQL Server 默认值约束有独立名称，删除时需先删约束（使用 getColumns 返回的约束名） | FR4 |
| BR6 | SQL Server 列重命名使用 sp_rename，不可通过 ALTER COLUMN | FR4 |
| BR7 | SQL Server 注释通过 sp_addextendedproperty（新增）/ sp_updateextendedproperty（修改）实现，通过原始数据判断 | FR3, FR4 |
| BR8 | Unicode 字符串常量需 N'...' 前缀 | FR3, FR4 |
| BR9 | Schema 默认为 dbo，用户可选择其他 schema；编辑模式 Schema 只读 | FR3, FR4, FR5 |
| BR10 | 默认值原样透传用户输入，与 MySQL 保持一致 | FR3, FR4 |
| BR11 | 仅 PRIMARY KEY 内联到 CREATE TABLE，UNIQUE 和 INDEX 建表后通过 CREATE INDEX 创建 | FR3 |

---

## 4. 数据模型（DM）

### DM1: SqlServerColumnFormItem（新增）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _key | string | 是 | 追踪标识 |
| name | string | 是 | 列名 |
| type | string | 是 | 数据类型 |
| length | number \| 'MAX' | 否 | 长度 |
| decimals | number | 否 | 小数位 |
| notNull | boolean | 是 | 非空约束 |
| primaryKey | boolean | 是 | 主键标识 |
| identity | boolean | 是 | IDENTITY 标识 |
| identitySeed | number | 是 | IDENTITY 种子值，默认 1 |
| identityIncrement | number | 是 | IDENTITY 增量，默认 1 |
| defaultValue | string | 是 | 默认值 |
| comment | string | 是 | 列注释 |

### DM2: SqlServerIndexFormItem（新增）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _key | string | 是 | 追踪标识 |
| name | string | 是 | 索引名 |
| type | 'PRIMARY' \| 'UNIQUE' \| 'INDEX' | 是 | 索引类型 |
| clustered | boolean | 是 | 是否聚集 |
| columns | Array<{name, order}> | 是 | 索引列及排序 |

### DM3: ColumnMeta 扩展（澄清决议）

| 字段 | 类型 | 说明 |
|------|------|------|
| defaultConstraintName | string \| undefined | 默认值约束名（SQL Server 专用） |

### DM4: TreeNode 扩展（澄清决议）

| 字段 | 类型 | 说明 |
|------|------|------|
| schema | string \| undefined | 表所属 schema（SQL Server 专用） |

### DM5: TableMeta 扩展（澄清决议）

| 字段 | 类型 | 说明 |
|------|------|------|
| schema | string \| undefined | 表所属 schema（SQL Server 专用） |

---

## 5. 异常处理

| 场景 | 处理方式 | 相关 FR |
|------|---------|---------|
| Schema 列表加载失败 | 默认使用 dbo，显示错误提示 | FR3, FR6 |
| DDL 执行失败 | 显示错误信息，不关闭对话框 | FR3, FR4 |
| 不支持的数据库类型 | 入口组件显示提示或不渲染 | FR1 |
| 编辑模式加载表结构失败 | 显示错误提示，可重试或关闭 | FR4 |

---

## 6. 测试策略

| 测试场景 | 覆盖 FR |
|----------|---------|
| MySQL 新建表功能回归 | FR1, FR2 |
| MySQL 编辑表功能回归 | FR1, FR2 |
| SQL Server 新建表（含所有数据类型） | FR3 |
| SQL Server 编辑表（列增删改、索引增删） | FR4 |
| SQL Server IDENTITY 列新建/编辑限制 | FR3, FR4 |
| SQL Server Schema 选择 | FR3, FR6 |
| SQL Server 默认值约束名（编辑模式修改/删除默认值） | FR4 |
| SQL Server 注释新增 vs 更新 | FR4 |
| SQL Server query100 语法 | FR5 |
| SQL Server dropTable 语法 | FR5 |
| i18n 三语言切换 | FR8 |

---

## 7. 风险评估

### 整体评估

- **P0 问题**: 0（已全部澄清）
- **P1 问题**: 0（已全部澄清）
- **P2 问题**: 3（可接受，不阻塞开发）
- **整体风险**: 🟢低
- **建议**: 所有 P0/P1 问题已通过澄清闭环，可进入开发阶段

### 剩余 P2 问题

| # | FR | 问题 | 状态 |
|---|-----|------|------|
| 1 | FR1 | 不支持的数据库类型降级处理 | 当前仅支持 MySQL/SQL Server，风险可控 |
| 2 | FR3 | 执行分隔策略不明确 | 已在 FR3.4 中明确执行顺序 |
| 3 | FR3 | 主键约束名是否可自定义 | 建议自动生成 PK_表名，暂不支持自定义 |

---

## 变更日志

| 时间 | 操作 | 说明 |
|------|------|------|
| 2026-02-10 | 初始创建 | 完成结构化建模和6维度质量扫描 |
| 2026-02-10 | 澄清回填 | 7项澄清全部确认，P0/P1问题清零，整体风险降至🟢低 |
