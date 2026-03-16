# RC-021 SQL 编辑器 Hover 快捷操作功能

## 1. 需求概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-021 |
| 需求名称 | SQL 编辑器 Hover 快捷操作功能 |
| 提出日期 | 2026-03-16 |
| 优先级 | 中 |

### 1.1 背景

当前 SQL 编辑器的 hover（悬浮提示）功能已经支持显示表信息、字段信息、函数信息等，并且支持点击表名打开表管理对话框的交互能力。但在日常 SQL 编写中，有两个高频操作需要用户手动进行，效率较低：

1. **`SELECT *` 展开为具体列名**：在开发/调试过程中，用户经常先写 `SELECT * FROM 表名` 快速查看数据，然后需要手动将 `*` 替换为具体的列名列表。这需要用户查看表结构、逐个输入或复制字段名，操作繁琐。

2. **时间戳字段转为可读时间**：数据库中广泛使用 Unix 时间戳（`int`/`bigint` 类型）存储时间，查询结果显示为数字不直观。用户需要手动将 `column_name` 修改为 `FROM_UNIXTIME(column_name) AS column_name`，每次都要重复输入列名和函数名。

### 1.2 目标

在已有的 hover 悬浮提示机制基础上，新增两个**快捷操作**入口，通过鼠标点击即可自动完成 SQL 文本替换，提升编写效率。

---

## 2. 需求详情

### 2.1 功能一：`*` 号展开为所有列

#### 2.1.1 功能描述

当用户在 `SELECT * FROM 表名` 语句中，鼠标悬浮在 `*` 号上时，hover 弹窗中显示一个快捷操作选项 **"列出所有列"**。点击后，自动将 `*` 替换为该语句 FROM 子句中涉及的所有表的全部字段列表（格式化排列）。

#### 2.1.2 触发条件

- 光标悬浮位置的字符是 `*`
- `*` 位于 `SELECT` 和 `FROM` 之间（即处于 SELECT 列位置）
- 当前语句包含有效的 `FROM` 子句，且能解析出至少一张表
- 该表存在于当前数据库的元数据中（已加载表结构信息）

#### 2.1.3 Hover 提示内容

当满足触发条件时，hover 弹窗显示如下内容：

```
📋 快捷操作

[🔄 列出所有列] — 将 * 替换为所有字段
```

其中 **"🔄 列出所有列"** 为可点击的操作链接。

#### 2.1.4 点击后的替换行为

**单表场景：**

输入：
```sql
SELECT * FROM resume_main;
```

点击后替换为：
```sql
SELECT
  id,
  name,
  age,
  email,
  create_time,
  update_time
FROM resume_main;
```

**多表场景（JOIN）：**

输入：
```sql
SELECT * FROM resume_main rm JOIN resume_detail rd ON rm.id = rd.resume_id;
```

点击后替换为（带表别名前缀）：
```sql
SELECT
  rm.id,
  rm.name,
  rm.age,
  rm.email,
  rm.create_time,
  rm.update_time,
  rd.resume_id,
  rd.detail_content,
  rd.create_time,
  rd.update_time
FROM resume_main rm JOIN resume_detail rd ON rm.id = rd.resume_id;
```

**格式化规则：**
- 每个字段独占一行，缩进 2 个空格
- 多表时使用 `别名.字段名` 格式（如果有别名用别名，无别名用表名）
- 字段之间用逗号分隔，逗号跟在字段名后
- 最后一个字段后无逗号
- `SELECT` 关键字保持在第一行（后面换行）

#### 2.1.5 边界场景

| 场景 | 处理方式 |
|------|----------|
| `SELECT *, other_col FROM t` — `*` 与其他列共存 | 仅替换 `*` 部分，保留其他列不变 |
| `SELECT * FROM t1, t2` — 逗号连接多表 | 列出所有表的所有字段，使用表名前缀 |
| `SELECT * FROM t WHERE ...` — 有 WHERE 等子句 | 仅替换 `*`，不影响其他子句 |
| 表不在元数据中（未加载表结构） | 不显示快捷操作（不显示 hover 弹窗或显示普通 hover） |
| 子查询中的 `SELECT *` | 暂不支持子查询内的 `*` 展开，后续版本考虑 |
| `SELECT DISTINCT * FROM t` | 支持，替换 `*` 部分，保留 `DISTINCT` |

---

### 2.2 功能二：数值列快捷转 FROM_UNIXTIME

#### 2.2.1 功能描述

当用户鼠标悬浮在 SELECT 列表中的一个列名上时，如果该列的数据类型为**数值类型**（可能存储时间戳），则在 hover 弹窗中额外显示一个快捷操作选项 **"FROM_UNIXTIME 转成时间"**。点击后，自动将该列名替换为 `FROM_UNIXTIME(列名) AS 列名`。

#### 2.2.2 触发条件

- 光标悬浮位置的单词能匹配到数据库元数据中某张表的某个字段
- 该字段的数据类型为数值类型，包括：
  - 整数类型：`int`、`bigint`、`tinyint`、`smallint`、`mediumint`、`integer`
  - 无符号变体：`int unsigned`、`bigint unsigned` 等
  - 其他数值：`decimal`、`numeric`、`float`、`double`
- 该列处于 SELECT 列位置（`SELECT` 和 `FROM` 之间）
- 该列**未被**函数包裹（即不是已经写成 `FROM_UNIXTIME(col)` 的形式）
- 当前数据库类型为 MySQL（FROM_UNIXTIME 是 MySQL 函数，SQL Server 不适用）

#### 2.2.3 Hover 提示内容

在现有的列 hover 信息基础上，追加快捷操作区域：

```
**字段**: `create_time`

**类型**: `bigint`
**可空**: 否

**描述**: 创建时间

*来自表 `resume_main`*

---
📋 快捷操作

[🕐 FROM_UNIXTIME 转成时间] — 转换为 FROM_UNIXTIME(create_time) AS create_time
```

其中 **"🕐 FROM_UNIXTIME 转成时间"** 为可点击的操作链接。

#### 2.2.4 点击后的替换行为

**基本场景：**

输入：
```sql
SELECT id, create_time, update_time FROM resume_main;
```

悬浮在 `create_time` 上并点击后替换为：
```sql
SELECT id, FROM_UNIXTIME(create_time) AS create_time, update_time FROM resume_main;
```

**带表别名/表前缀场景：**

输入：
```sql
SELECT rm.id, rm.create_time FROM resume_main rm;
```

悬浮在 `create_time` 上并点击后替换为：
```sql
SELECT rm.id, FROM_UNIXTIME(rm.create_time) AS create_time FROM resume_main rm;
```

**替换规则：**
- 将 `列名` 替换为 `FROM_UNIXTIME(列名) AS 列名`
- 如果有表前缀（如 `rm.create_time`），替换为 `FROM_UNIXTIME(rm.create_time) AS create_time`（AS 后的别名不带表前缀）
- 替换范围仅限光标所在的列表达式，不影响其他列和子句

#### 2.2.5 边界场景

| 场景 | 处理方式 |
|------|----------|
| 列已有别名 `create_time AS ct` | 替换为 `FROM_UNIXTIME(create_time) AS ct`（保留原有别名） |
| 列已被函数包裹 `MAX(create_time)` | 不显示快捷操作（已经是表达式，不是裸列名） |
| 列已是 `FROM_UNIXTIME(create_time)` | 不显示快捷操作（避免重复包裹） |
| 列在 WHERE 子句中 `WHERE create_time > 0` | 不显示快捷操作（仅对 SELECT 列位置生效） |
| 列类型为 `varchar`、`text` 等非数值类型 | 不显示快捷操作 |
| SQL Server 数据库 | 不显示此快捷操作（FROM_UNIXTIME 是 MySQL 专属函数） |
| 列在 `SELECT *` 中（未显式列出） | 不触发（`*` 展开后才可触发） |

---

## 3. 交互设计

### 3.1 快捷操作的 Hover 展示方式

快捷操作入口嵌入在 Monaco Editor 的 hover widget 中，以 Markdown 渲染的可点击链接形式呈现：

- 使用 Markdown 分隔线 `---` 将快捷操作与原有 hover 信息分隔
- 快捷操作以 emoji + 文字描述的方式呈现
- 点击区域需要有视觉反馈（类似现有的表名点击效果：颜色高亮 + 下划线 + hover 变色）

### 3.2 点击交互流程

1. hover 弹窗渲染时，快捷操作显示为可点击样式
2. 用户点击快捷操作链接
3. 前端捕获点击事件，识别操作类型
4. 前端获取当前编辑器实例，执行文本替换操作（`editor.executeEdits`）
5. 替换完成后，hover widget 自动关闭
6. 替换操作支持 **Ctrl+Z 撤销**

### 3.3 后端返回数据扩展

当前 `HoverResult` 接口需要扩展，以携带快捷操作信息：

```typescript
export interface HoverResult {
  hover: Hover
  tableInfo?: { name: string }
  // 新增：快捷操作列表
  actions?: HoverAction[]
}

interface HoverAction {
  /** 操作类型标识 */
  type: 'expand_star' | 'from_unixtime'
  /** 操作显示标题 */
  title: string
  /** 替换文本 */
  replaceText: string
  /** 替换范围（相对于文档的行列位置） */
  range: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
}
```

前端接收到 `actions` 后：
- 将操作渲染到 hover Markdown 内容中
- 监听点击事件，根据 `type` 执行对应的替换操作
- 替换使用 `range` 和 `replaceText` 直接操作编辑器

---

## 4. 输入输出示例

### 示例 1：`*` 展开（单表）

**输入：**
```sql
-- 鼠标悬浮在 * 上
SELECT * FROM resume_main WHERE id = 1;
```

**Hover 弹窗内容：**
```
📋 快捷操作

🔄 列出所有列 — 将 * 替换为所有字段
```

**点击后输出：**
```sql
SELECT
  id,
  name,
  resumeType,
  idCardType,
  create_time,
  update_time
FROM resume_main WHERE id = 1;
```

### 示例 2：FROM_UNIXTIME 转换

**输入：**
```sql
-- 鼠标悬浮在 create_time 上（类型为 bigint）
SELECT id, create_time FROM resume_main;
```

**Hover 弹窗内容：**
```
**字段**: `create_time`

**类型**: `bigint`
**可空**: 否

*来自表 `resume_main`*

---
📋 快捷操作

🕐 FROM_UNIXTIME 转成时间 — 转换为 FROM_UNIXTIME(create_time) AS create_time
```

**点击后输出：**
```sql
SELECT id, FROM_UNIXTIME(create_time) AS create_time FROM resume_main;
```

### 示例 3：带别名的列转换

**输入：**
```sql
SELECT rm.id, rm.create_time ct FROM resume_main rm;
```

**Hover 弹窗内容（悬浮在 create_time 上）：**
```
**字段**: `create_time`

**类型**: `bigint`
...

---
📋 快捷操作

🕐 FROM_UNIXTIME 转成时间 — 转换为 FROM_UNIXTIME(rm.create_time) AS ct
```

**点击后输出：**
```sql
SELECT rm.id, FROM_UNIXTIME(rm.create_time) AS ct FROM resume_main rm;
```

---

## 5. 影响分析

### 5.1 受影响的模块

| 模块 | 文件路径 | 修改类型 |
|------|----------|----------|
| Hover 提供者 | `src/main/sql-language-server/providers/hoverProvider.ts` | 修改 — 新增 `*` 识别逻辑、数值列检测、快捷操作数据生成 |
| Hover 结果类型 | `src/main/sql-language-server/types/index.ts` | 修改 — 新增 `HoverAction` 类型定义 |
| SQL Language Server 入口 | `src/main/sql-language-server/index.ts` | 修改 — hover IPC 返回值扩展 actions 字段 |
| Preload 桥接层 | `src/preload/index.ts` | 可能修改 — 若 IPC 返回结构变化需同步 |
| Language Server Composable | `src/renderer/composables/useLanguageServer.ts` | 修改 — hover 回调处理快捷操作、编辑器文本替换逻辑 |
| SQL 编辑器组件 | `src/renderer/components/SqlEditor.vue` | 修改 — hover widget 点击事件处理扩展 |
| Hover Widget 样式 | `src/renderer/components/SqlEditor.vue` | 修改 — 快捷操作链接的 CSS 样式 |
| i18n 国际化 | `src/main/i18n/` | 修改 — 新增快捷操作相关的文案翻译 |

### 5.2 依赖关系

- 依赖已有的 hover 机制（Markdown 渲染 + 点击事件拦截），可复用现有的 `handleHoverClick` 模式
- 依赖 `MetadataService` 的表/列元数据（`getColumns`、`getTable`）
- 依赖 `SqlParserService` 的语句解析和表提取能力（`extractTablesFromSql`、`extractCurrentStatement`）
- 功能一（`*` 展开）依赖功能二的 hover 框架扩展，建议先实现功能一

---

## 6. 测试用例

### 功能一：`*` 展开为所有列

| 用例ID | 场景 | 输入 | 期望结果 |
|--------|------|------|----------|
| TC01 | 单表基本展开 | `SELECT * FROM resume_main;` 悬浮在 `*` 上 | hover 显示"列出所有列"操作，点击后 `*` 被替换为所有列名（每行一个） |
| TC02 | 多表 JOIN 展开 | `SELECT * FROM t1 JOIN t2 ON t1.id=t2.id;` | 展开为所有表的列，带表名/别名前缀 |
| TC03 | `*` 与其他列共存 | `SELECT *, col1 FROM t;` | 仅替换 `*`，保留 `col1` |
| TC04 | 表不在元数据中 | `SELECT * FROM unknown_table;` | 不显示快捷操作 |
| TC05 | 替换后可撤销 | 执行展开操作后按 Ctrl+Z | 恢复为 `SELECT *` |
| TC06 | DISTINCT 与 `*` | `SELECT DISTINCT * FROM t;` | 替换为 `SELECT DISTINCT\n  col1,\n  col2\nFROM t;` |
| TC07 | 逗号连接多表 | `SELECT * FROM t1, t2;` | 列出所有表的所有字段，使用表名前缀 |

### 功能二：FROM_UNIXTIME 转换

| 用例ID | 场景 | 输入 | 期望结果 |
|--------|------|------|----------|
| TC11 | 基本转换 | `SELECT id, create_time FROM t;` 悬浮在 `create_time`（bigint 类型） | hover 显示"FROM_UNIXTIME 转成时间"，点击后替换为 `FROM_UNIXTIME(create_time) AS create_time` |
| TC12 | 带表前缀 | `SELECT rm.create_time FROM t rm;` | 替换为 `FROM_UNIXTIME(rm.create_time) AS create_time` |
| TC13 | 已有别名 | `SELECT create_time AS ct FROM t;` | 替换为 `FROM_UNIXTIME(create_time) AS ct` |
| TC14 | 非数值类型列 | `SELECT name FROM t;`（name 为 varchar） | 不显示快捷操作 |
| TC15 | 已被函数包裹 | `FROM_UNIXTIME(create_time)` | 不显示快捷操作 |
| TC16 | WHERE 子句中的列 | `WHERE create_time > 0` 中悬浮 | 不显示快捷操作 |
| TC17 | SQL Server 数据库 | 连接 SQL Server 时悬浮数值列 | 不显示此快捷操作 |
| TC18 | 替换后可撤销 | 执行转换后按 Ctrl+Z | 恢复原始列名 |
| TC19 | int unsigned 类型 | 列类型为 `int unsigned` | 正常显示快捷操作 |

---

## 7. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | hover 响应时间不因新增快捷操作逻辑而明显增加（< 50ms） |
| 兼容性 | 功能二（FROM_UNIXTIME）仅在 MySQL 数据库类型下生效，SQL Server 不显示 |
| 可扩展性 | 快捷操作框架应具备通用性，后续可方便地新增其他快捷操作（如 UNIX_TIMESTAMP 反向转换等） |
| 用户体验 | 替换操作支持 Ctrl+Z 撤销；操作链接有明确的视觉反馈（可点击样式） |

---

## 8. 备注

- 本次需求复用现有的 hover widget 点击交互机制（已在 RC-015 中实现表名点击打开表管理），需扩展点击事件的识别逻辑以区分不同操作类型
- 快捷操作的 Markdown 渲染依赖 Monaco Editor hover widget 的 Markdown 支持能力，需确认 code 标签或特定 CSS class 的点击可识别性
- 后续可考虑在快捷操作框架中增加更多操作，例如：
  - `DATE_FORMAT` 格式化
  - `IFNULL` 空值处理
  - `CONCAT` 字段拼接
  - 列注释快速查看

---

## 9. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-03-16 | 初始创建 | 待确认 |
