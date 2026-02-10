# TableDesignDialog 组件架构重构 —— 按数据库类型拆分独立组件

## 1. 背景与问题

当前 `TableDesignDialog.vue` 组件（新建/编辑表）完全基于 MySQL 设计，对 SQL Server 不适用：

- 引擎(Engine)、字符集(Charset)、排序规则(Collation) 下拉项为空
- 数据类型硬编码为 `MySQLDataTypes`
- SQL 生成语法为 MySQL 语法（反引号、AUTO_INCREMENT、表选项等）
- 右键菜单中的 `query100`、`handleDropTable` 也使用了 MySQL 语法

**之前的方案**是在同一个组件中通过 `v-if` 做条件分支。但 MySQL 和 SQL Server 在表设计上的差异非常大（表选项、数据类型、DDL 语法、索引类型、列属性等），在一个组件中堆砌条件分支会导致代码臃肿、难以维护。

**新方案**：将 `TableDesignDialog.vue` 改为**路由入口组件**，根据数据库类型动态加载对应的子组件：
- `MysqlTableDesign.vue` —— MySQL 专用表设计组件
- `SqlServerTableDesign.vue` —— SQL Server 专用表设计组件

## 2. 架构设计

### 2.1 组件结构

```
src/renderer/components/
├── TableDesignDialog.vue           # 入口组件（路由分发）
├── MysqlTableDesign.vue            # MySQL 表设计（从现有代码迁移）
└── SqlServerTableDesign.vue        # SQL Server 表设计（新建）
```

### 2.2 入口组件职责（TableDesignDialog.vue）

改造后的 `TableDesignDialog.vue` 仅负责：

1. 监听 `connectionStore.tableDesignDialogVisible` 控制对话框显示/隐藏
2. 根据 `connectionId` 从 `connectionStore.connections` 中获取 `conn.type`（`'mysql'` | `'sqlserver'`）
3. 通过 `<component :is="...">` 或 `v-if` 动态加载对应的子组件
4. 将公共 props 传递给子组件：`connectionId`、`database`、`table`(编辑模式)、`mode`(`'create'` | `'edit'`)
5. 接收子组件的事件：`close`（关闭对话框）、`success`（执行成功，刷新表列表）

```vue
<!-- TableDesignDialog.vue 伪代码 -->
<template>
  <MysqlTableDesign
    v-if="dbType === 'mysql'"
    :visible="visible"
    :connection-id="connectionId"
    :database="database"
    :table="table"
    :mode="mode"
    @close="handleClose"
    @success="handleSuccess"
  />
  <SqlServerTableDesign
    v-else-if="dbType === 'sqlserver'"
    :visible="visible"
    :connection-id="connectionId"
    :database="database"
    :table="table"
    :mode="mode"
    @close="handleClose"
    @success="handleSuccess"
  />
</template>
```

### 2.3 子组件统一接口（Props & Events）

两个子组件遵循相同的 Props 和 Events 接口：

**Props:**

| Prop | 类型 | 说明 |
|------|------|------|
| `visible` | `boolean` | 对话框是否可见 |
| `connectionId` | `string` | 连接 ID |
| `database` | `string` | 数据库名 |
| `table` | `string \| undefined` | 表名（编辑模式时有值） |
| `mode` | `'create' \| 'edit'` | 创建/编辑模式 |

**Events:**

| Event | 参数 | 说明 |
|-------|------|------|
| `close` | 无 | 关闭对话框 |
| `success` | 无 | 执行成功（用于刷新表列表） |
| `update:visible` | `boolean` | 更新可见性（支持 v-model） |

## 3. MysqlTableDesign.vue（MySQL 专用）

### 3.1 来源

直接从现有 `TableDesignDialog.vue` 迁移，保持现有功能不变。

### 3.2 功能清单

| 功能模块 | 说明 |
|----------|------|
| 表基本信息 | 表名、引擎(Engine)、字符集(Charset)、排序规则(Collation)、注释 |
| 列定义 | 列名、类型(MySQLDataTypes)、长度、小数位、NOT NULL、主键、AUTO_INCREMENT、UNSIGNED、默认值、注释 |
| 索引定义 | PRIMARY、UNIQUE、INDEX、FULLTEXT；索引名、索引列 |
| SQL 预览 | 实时预览 CREATE TABLE / ALTER TABLE SQL |
| SQL 生成 | 反引号包裹标识符、AUTO_INCREMENT、ENGINE/CHARSET/COLLATE 表选项 |
| ALTER 语法 | CHANGE COLUMN（支持重命名）、ADD COLUMN ... AFTER、DROP COLUMN、DROP INDEX |
| 执行 | 确认对话框 + 逐条执行 DDL |

### 3.3 无需改动的部分

- 元数据加载：`getCharsets`、`getCollations`、`getEngines`、`getDefaultCharset`
- 数据类型：`MySQLDataTypes`、`typeNeedsLength`、`typeNeedsDecimals`、`typeSupportsUnsigned`、`typeNeedsFsp`
- 所有 SQL 生成逻辑保持不变

## 4. SqlServerTableDesign.vue（SQL Server 专用）—— 新建

### 4.1 表基本信息

| 表单项 | 说明 |
|--------|------|
| 表名 | 必填 |
| Schema | 下拉选择，默认 `dbo`，调用 `SqlServerDriver.getSchemas()` 获取列表 |
| 注释 | 可选，通过 `sp_addextendedproperty` 实现 |

**不包含**：Engine、Charset、Collation（SQL Server 无此概念）

### 4.2 列定义

| 列属性 | 说明 |
|--------|------|
| 列名 | 文本输入 |
| 数据类型 | 使用 `SqlServerDataTypes` 分组下拉（INTEGER / FLOAT / STRING / BINARY / DATETIME / OTHER） |
| 长度 | 根据类型动态展示，支持 `MAX` 标识（如 `NVARCHAR(MAX)`） |
| 小数位 | DECIMAL / NUMERIC 类型时展示 |
| NOT NULL | 复选框 |
| 主键 | 复选框 |
| IDENTITY | 复选框（仅主键列可启用），需支持设置 seed 和 increment（默认 `1,1`） |
| 默认值 | 文本输入 |
| 注释 | 文本输入（通过 `sp_addextendedproperty` 实现） |

**不包含**：UNSIGNED（SQL Server 不支持）

#### 4.2.1 SQL Server 数据类型辅助函数

需要在 `src/shared/types/database.ts` 中新增以下函数（与 MySQL 的对应函数平行）：

```typescript
// 判断 SQL Server 数据类型是否需要长度参数
export function sqlServerTypeNeedsLength(type: string): boolean {
  const needsLength = [
    'CHAR', 'VARCHAR', 'NCHAR', 'NVARCHAR',
    'BINARY', 'VARBINARY',
    'DECIMAL', 'NUMERIC',
    'DATETIME2', 'TIME', 'DATETIMEOFFSET'
  ]
  return needsLength.includes(type.toUpperCase())
}

// 判断 SQL Server 数据类型是否需要小数位数
export function sqlServerTypeNeedsDecimals(type: string): boolean {
  return ['DECIMAL', 'NUMERIC'].includes(type.toUpperCase())
}

// 判断 SQL Server 数据类型是否支持 MAX 长度
export function sqlServerTypeSupportsMax(type: string): boolean {
  return ['VARCHAR', 'NVARCHAR', 'VARBINARY'].includes(type.toUpperCase())
}

// 判断 SQL Server 数据类型是否为时间精度类型（精度范围 0-7）
export function sqlServerTypeNeedsFsp(type: string): boolean {
  return ['DATETIME2', 'TIME', 'DATETIMEOFFSET'].includes(type.toUpperCase())
}
```

### 4.3 索引定义

| 索引类型 | 说明 |
|----------|------|
| PRIMARY KEY | 主键（CLUSTERED / NONCLUSTERED 可选） |
| UNIQUE | 唯一索引 |
| INDEX | 普通索引（CLUSTERED / NONCLUSTERED 可选） |

**不包含**：
- **FULLTEXT** —— SQL Server 的全文索引（Full-Text Index）需要先创建全文目录（Full-Text Catalog），配置断字器（Word Breaker）和语言（Language），通过 `CREATE FULLTEXT INDEX ... ON ... KEY INDEX ... WITH STOPLIST ...` 创建，与 MySQL 的 `FULLTEXT KEY` 直接内联定义完全不同。本期暂不支持。
- **SPATIAL** —— SQL Server 的空间索引需要列类型为 `GEOMETRY` 或 `GEOGRAPHY`，且必须有 PRIMARY KEY，通过 `CREATE SPATIAL INDEX ... ON ... USING GEOMETRY_AUTO_GRID` 创建，配置参数较多（网格级别、边界框等）。MySQL 的 `SPATIAL INDEX` 也类似有特殊要求。本期暂不支持。

> **对比参考**：MySQL 的 `MysqlTableDesign.vue` 支持 `FULLTEXT` 索引（直接在建表 DDL 中内联定义），并过滤了 `SPATIAL` 索引。SQL Server 的实现与 MySQL 差异很大，不应简单平移。

索引属性：
- 索引名
- 索引类型（PRIMARY / UNIQUE / INDEX）
- 是否 CLUSTERED
- 索引列（多选 + 排序方向 ASC/DESC）

### 4.4 SQL 生成

#### 4.4.1 CREATE TABLE

> **注意**：以下示例中的 `{schema}` 表示表实际所在的 Schema（如 `dbo`、`sales`、`hr` 等），由用户在表单中选择，**不得硬编码为 `dbo`**。

```sql
CREATE TABLE [database].[{schema}].[table_name] (
  [id] INT NOT NULL IDENTITY(1,1),
  [name] NVARCHAR(255) NOT NULL DEFAULT N'',
  [amount] DECIMAL(10,2) NULL DEFAULT 0,
  [created_at] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
  CONSTRAINT [PK_table_name] PRIMARY KEY CLUSTERED ([id])
);

-- 列注释（每列一条）
EXEC sp_addextendedproperty
  @name = N'MS_Description',
  @value = N'主键ID',
  @level0type = N'SCHEMA', @level0name = N'{schema}',
  @level1type = N'TABLE',  @level1name = N'table_name',
  @level2type = N'COLUMN', @level2name = N'id';

-- 表注释
EXEC sp_addextendedproperty
  @name = N'MS_Description',
  @value = N'表注释内容',
  @level0type = N'SCHEMA', @level0name = N'{schema}',
  @level1type = N'TABLE',  @level1name = N'table_name';
```

#### 4.4.2 ALTER TABLE

> **注意**：以下 `{schema}` 均为表实际所在的 Schema，编辑模式下应从已有表信息中获取，**不得硬编码为 `dbo`**。

| 操作 | SQL 语法 |
|------|----------|
| 修改列类型/约束 | `ALTER TABLE [db].[{schema}].[table] ALTER COLUMN [col] NVARCHAR(500) NOT NULL;` |
| 重命名列 | `EXEC sp_rename '[db].[{schema}].[table].[old_col]', 'new_col', 'COLUMN';` |
| 新增列 | `ALTER TABLE [db].[{schema}].[table] ADD [new_col] INT NOT NULL DEFAULT 0;` |
| 删除列 | `ALTER TABLE [db].[{schema}].[table] DROP COLUMN [col];` |
| 新增索引 | `CREATE [UNIQUE] [CLUSTERED\|NONCLUSTERED] INDEX [idx_name] ON [db].[{schema}].[table] ([col1] ASC, [col2] DESC);` |
| 删除索引 | `DROP INDEX [idx_name] ON [db].[{schema}].[table];` |
| 添加主键 | `ALTER TABLE [db].[{schema}].[table] ADD CONSTRAINT [PK_name] PRIMARY KEY CLUSTERED ([col]);` |
| 删除主键 | `ALTER TABLE [db].[{schema}].[table] DROP CONSTRAINT [PK_name];` |
| 新增/修改注释 | `EXEC sp_addextendedproperty / sp_updateextendedproperty ...`（`@level0name` 使用实际 schema） |

#### 4.4.3 SQL Server DDL 语法要点

| 要点 | 说明 |
|------|------|
| 标识符引用 | 方括号 `[]` |
| 三段式名称 | `[database].[schema].[object]`，其中 schema 取自用户选择（创建模式）或表的实际 schema（编辑模式），不得硬编码 `dbo` |
| 自增 | `IDENTITY(seed, increment)` —— 只能在建表时指定，ALTER 不能添加/移除 |
| 默认值约束 | 有独立约束名，删除时需先删约束 |
| 注释 | 通过 `sp_addextendedproperty` 系统存储过程实现 |
| 主键约束名 | 建议命名规范：`PK_表名` |
| 索引排序 | 支持列级 ASC/DESC |

### 4.5 SQL 预览

与 MySQL 组件一致，实时预览生成的 T-SQL，支持手动刷新。

### 4.6 执行

与 MySQL 组件一致：
1. 弹出确认对话框展示将要执行的 SQL
2. 用户确认后逐条执行（按 `GO` 或分号分隔）
3. 成功后关闭对话框并刷新表列表

## 5. ConnectionTree.vue 右键菜单改造

### 5.1 query100（查询前100行）

根据连接类型生成不同 SQL：

| 数据库类型 | SQL |
|------------|-----|
| MySQL | `` SELECT * FROM `database`.`table` LIMIT 100 `` |
| SQL Server | `SELECT TOP 100 * FROM [database].[{schema}].[table]` |

> **注意**：SQL Server 的 `query100` 和 `dropTable` 需要获取表所在的 schema。如果当前树节点信息中不包含 schema，需要通过查询 `sys.tables` + `sys.schemas` 获取，或在树节点数据结构中增加 schema 字段。默认可回退为 `dbo`。

### 5.2 handleDropTable（删除表）

根据连接类型生成不同 SQL：

| 数据库类型 | SQL |
|------------|-----|
| MySQL | `` DROP TABLE `database`.`table`; `` |
| SQL Server | `DROP TABLE [database].[{schema}].[table];` |

### 5.3 实现方式

在 `handleMenuClick` 和 `handleDropTable` 中，通过 `connectionStore.connections.find(c => c.id === node.connectionId)?.type` 获取数据库类型，分支生成 SQL。

## 6. 后端改造

### 6.1 新增 IPC 接口：获取 Schema 列表

SQL Server 表设计需要选择 Schema，需新增一个 IPC 接口：

```typescript
// src/main/ipc/database.ts 新增
'db:schemas': async (connectionId: string, database: string) => {
  const driver = getDriver(connectionId)
  if (driver.type === 'sqlserver') {
    return { success: true, schemas: await (driver as SqlServerDriver).getSchemas(connectionId, database) }
  }
  return { success: true, schemas: [] }
}
```

对应前端 store 和 preload 也需补充。

### 6.2 已有接口无需改动

- `SqlServerDriver.getColumns()` —— 已返回 `isIdentity`、`seed`、`increment`
- `SqlServerDriver.getIndexes()` —— 已返回索引信息
- `SqlServerDriver.executeDDL()` —— 已支持执行 DDL
- `SqlServerDriver.getTableCreateSql()` —— 已可生成建表语句

## 7. 共享类型补充

在 `src/shared/types/database.ts` 中补充：

```typescript
// SQL Server 列定义表单项（扩展 ColumnDefinition）
export interface SqlServerColumnFormItem {
  _key: string
  name: string
  type: string
  length?: number | 'MAX'   // 支持 MAX
  decimals?: number
  notNull: boolean
  primaryKey: boolean
  identity: boolean          // 代替 autoIncrement
  identitySeed: number       // 默认 1
  identityIncrement: number  // 默认 1
  defaultValue: string
  comment: string
}

// SQL Server 索引定义表单项
export interface SqlServerIndexFormItem {
  _key: string
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX'
  clustered: boolean         // CLUSTERED / NONCLUSTERED
  columns: {
    name: string
    order: 'ASC' | 'DESC'
  }[]
}
```

## 8. 样式

`SqlServerTableDesign.vue` 的样式与 `MysqlTableDesign.vue` 保持一致（深色主题），可通过共享 CSS 类或 SCSS mixin 复用。

## 9. i18n（国际化）

**原则**：所有界面可见文案必须走 i18n，不得硬编码中英文字符串。需同时维护三个语言文件：

- `src/renderer/i18n/locales/en-US.json`
- `src/renderer/i18n/locales/zh-CN.json`
- `src/renderer/i18n/locales/zh-TW.json`

### 9.1 新增 key 清单

以下 key 统一放在 `table` 命名空间下：

| i18n key | en-US | zh-CN | zh-TW | 说明 |
|----------|-------|-------|-------|------|
| `table.schema` | Schema | Schema | Schema | Schema 下拉标签 |
| `table.schemaPlaceholder` | Select Schema | 选择 Schema | 選擇 Schema | Schema 下拉占位 |
| `table.identity` | IDENTITY | 自增标识 | 自增標識 | IDENTITY 复选框标签 |
| `table.identitySeed` | Seed | 种子值 | 種子值 | IDENTITY seed 输入标签 |
| `table.identityIncrement` | Increment | 增量 | 增量 | IDENTITY increment 输入标签 |
| `table.clustered` | Clustered | 聚集 | 聚集 | 聚集索引选项 |
| `table.nonclustered` | Nonclustered | 非聚集 | 非聚集 | 非聚集索引选项 |
| `table.sortOrder` | Sort | 排序 | 排序 | 索引列排序方向标签 |
| `table.maxLength` | MAX | MAX | MAX | NVARCHAR(MAX) 等标识 |
| `table.identityNotAlterable` | IDENTITY cannot be modified after creation | IDENTITY 建表后不可修改 | IDENTITY 建表後不可修改 | 编辑模式 tooltip 提示 |

### 9.2 现有 key 复用

以下 key 已存在，`SqlServerTableDesign.vue` 应直接复用，不需新增：

| 已有 key | 用途 |
|----------|------|
| `table.tableName` / `table.tableNamePlaceholder` | 表名输入 |
| `table.comment` / `table.tableCommentPlaceholder` | 表/列注释 |
| `table.columnName` / `table.columnNamePlaceholder` | 列名 |
| `table.type` / `table.dataTypeGroups.*` | 数据类型分组下拉 |
| `table.length` / `table.precision` / `table.decimalPlaces` | 长度/精度 |
| `table.notNull` / `table.primaryKey` / `table.defaultValue` | 列属性 |
| `table.addColumn` / `table.addIndex` / `table.deleteColumn` / `table.deleteIndex` | 工具栏按钮 |
| `table.indexName` / `table.indexType` / `table.indexColumns` | 索引定义 |
| `table.columnsDefinition` / `table.indexesDefinition` / `table.sqlPreview` | Tab 标签 |
| `table.createTable` / `table.alterTable` | 执行按钮 |
| `table.createTitle` / `table.editTitle` | 对话框标题 |
| `table.pleaseInputTableName` / `table.pleaseAddColumn` / `table.noChangesDetected` | SQL 预览占位 |
| `table.createSuccess` / `table.alterSuccess` | 成功提示 |
| `table.columnNameRequired` / `table.columnNameDuplicate` / `table.tableNameRequired` / `table.atLeastOneColumn` | 校验提示 |
| `common.cancel` / `common.loading` / `common.refresh` / `common.deleteSelected` | 通用按钮 |

### 9.3 注意事项

1. **不要在组件中硬编码 label**：如 `<el-option label="Clustered">`，应改为 `<el-option :label="$t('table.clustered')">`
2. **placeholder 也要国际化**：所有 `el-input`、`el-select` 的 placeholder 均使用 `$t()`
3. **tooltip / 提示信息也要国际化**：如 IDENTITY 不可修改的禁用提示
4. **索引类型选项**：`PRIMARY`、`UNIQUE`、`INDEX` 这些技术关键词可直接作为 value 显示，无需翻译（与 MySQL 组件保持一致）
5. **SQL Server 专有名词**：`Schema`、`IDENTITY`、`CLUSTERED`、`NONCLUSTERED` 等技术术语在中文环境下保留英文原文

## 10. 影响范围

| 文件 | 改动类型 |
|------|---------|
| `src/renderer/components/TableDesignDialog.vue` | **重构**为入口路由组件 |
| `src/renderer/components/MysqlTableDesign.vue` | **新建**，从现有 TableDesignDialog 迁移 |
| `src/renderer/components/SqlServerTableDesign.vue` | **新建**，SQL Server 专用表设计 |
| `src/renderer/components/ConnectionTree.vue` | **修改** query100 和 handleDropTable |
| `src/shared/types/database.ts` | **新增** SQL Server 辅助函数和类型 |
| `src/main/ipc/database.ts` | **新增** getSchemas IPC 接口 |
| `src/renderer/stores/connection.ts` | **新增** getSchemas 方法 |
| `src/renderer/i18n/locales/en-US.json` | **新增** SQL Server 相关文案（见 9.1） |
| `src/renderer/i18n/locales/zh-CN.json` | **新增** SQL Server 相关文案（见 9.1） |
| `src/renderer/i18n/locales/zh-TW.json` | **新增** SQL Server 相关文案（见 9.1） |

## 11. 注意事项

1. **IDENTITY 不可 ALTER**：SQL Server 的 IDENTITY 属性只能在建表时指定，不能通过 ALTER COLUMN 添加或移除。编辑模式下需禁用 IDENTITY 复选框（如果原始列已有/没有 IDENTITY）
2. **默认值约束有名字**：SQL Server 的 DEFAULT 约束有独立名称，删除默认值时需先 `ALTER TABLE ... DROP CONSTRAINT [约束名]`，编辑模式下需查询约束名
3. **列重命名用 sp_rename**：SQL Server 不支持通过 ALTER COLUMN 重命名列
4. **Schema 支持**：默认使用 `dbo`，但提供 Schema 选择能力
5. **三段式名称**：SQL Server 对象引用格式为 `[database].[schema].[object]`
6. **字符串前缀**：SQL Server 的 Unicode 字符串常量需要 `N'...'` 前缀
7. **GO 分隔符**：如果需要批次执行，SQL Server 使用 `GO` 分隔批次（而非分号）
8. **现有 MySQL 功能不受影响**：`MysqlTableDesign.vue` 直接迁移现有代码，确保零回归
