---
name: SQL 编辑器 Hover 快捷操作功能
change_id: 2026-03-16-hover-quick-actions
source: requirements/requirements_change/requirements_change_21.md
created_at: 2026-03-16
updated_at: 2026-03-16
---

# 需求审查文档

## 1. 概述

| 项目 | 内容 |
|------|------|
| 需求来源 | `requirements/requirements_change/requirements_change_21.md` (RC-021) |
| 变更 ID | 2026-03-16-hover-quick-actions |
| 利益相关者 | SQL 编辑器用户（开发者/DBA） |
| 审查范围 | 功能性需求（FR）、业务规则（BR）、数据模型（DM）、验收标准 |

## 2. 功能需求（FR）

### FR1: `*` 号展开为所有列

- **描述**: 用户鼠标悬浮在 `SELECT * FROM 表名` 中的 `*` 上时，hover 弹窗显示"列出所有列"可点击链接，点击后将 `*` 替换为格式化的全部字段列表
- **用户故事**: 作为 SQL 开发者，我希望能快速将 `SELECT *` 中的 `*` 展开为具体字段列表，以便提高 SQL 编写效率、避免手动查表结构和逐个输入字段名
- **输入**: 鼠标悬浮在 `SELECT` 和 `FROM` 之间的 `*` 字符上
- **输出**: hover 弹窗中展示"🔄 列出所有列"可点击操作；点击后 `*` 被替换为格式化字段列表
- **业务规则**: BR1, BR2, BR3
- **验收标准**: TC01-TC07

**确认项**:
- [ ] [P0-准确性] `getWordAtPosition` 方法使用 `/[\w]/` 正则匹配单词字符，`*` 不属于 `\w` 字符集，当前逻辑会在 `start === end` 时直接返回 `null`，导致 `*` 上的 hover 永远不会触发。需求文档未提及此底层技术障碍 — 建议在需求文档的技术方案中明确说明：需要修改 `getWordAtPosition` 方法（或在 `provideHover` 入口增加 `*` 的特殊检测分支），使其能识别 `*` 字符
- [ ] [P0-完整性] 需求文档未明确 `*` 在文档中的位置信息（行号、列号）如何计算和传递。当前 `provideHover` 返回的 `HoverResult` 不包含位置信息，而新增的 `HoverAction.range` 需要精确的替换范围。需要明确：后端 `provideHover` 方法如何获取 `*` 在文档中的精确位置（行号+列号），以便构建 `HoverAction.range` — 建议明确说明后端需要使用 `position` 参数和文档文本来计算 `*` 的精确位置范围
- [ ] [P1-完整性] `SELECT *, other_col FROM t` 场景中，替换 `*` 后逗号的处理不明确。如果 `*` 后面有逗号（`*, other_col`），替换后是否变成 `col1, col2, col3, other_col`（去掉多余逗号）？还是 `col1,\n  col2,\n  col3,\n  other_col`（格式化后合并）？ — 建议补充替换后的完整格式化输出示例，明确逗号和换行的处理规则
- [ ] [P1-清晰性] 格式化规则中"SELECT 关键字保持在第一行（后面换行）"，但如果原始 SQL 是单行 `SELECT * FROM t WHERE id=1;`，替换后 FROM 是否也换行？替换范围是仅替换 `*` 一个字符，还是替换 `SELECT *` 整体？ — 建议明确：替换范围仅为 `*` 这一个字符的位置，替换文本为 `\n  col1,\n  col2,\n  col3\n`（即 `*` 被多行文本替换），SELECT 和 FROM 关键字的位置不变
- [ ] [P1-完整性] 多表 JOIN 场景中，如果两个表有同名字段（如两表都有 `id`、`create_time`），是否需要加表前缀来避免歧义？需求示例中 JOIN 场景已使用别名前缀，但逗号连接多表 `FROM t1, t2` 场景是否也需要？ — 建议统一规则：只要涉及多表（不论是 JOIN 还是逗号连接），所有字段都加表名/别名前缀
- [ ] [P2-完整性] 未说明 `SELECT *` 展开时的字段排序规则 — 建议明确：按照数据库元数据中的字段顺序（即表定义顺序）排列

### FR2: 数值列快捷转 FROM_UNIXTIME

- **描述**: 用户鼠标悬浮在 SELECT 列表中的数值类型字段上时，hover 弹窗额外显示"FROM_UNIXTIME 转成时间"可点击链接，点击后将该列替换为 `FROM_UNIXTIME(列名) AS 列名`
- **用户故事**: 作为 SQL 开发者，我希望能快速将数值类型的时间戳字段转换为可读时间格式，以便在查询结果中直接看到可读的日期时间而不是数字
- **输入**: 鼠标悬浮在 SELECT 列表中的数值类型字段名上
- **输出**: hover 弹窗在原有字段信息基础上追加"🕐 FROM_UNIXTIME 转成时间"操作；点击后字段被替换为 `FROM_UNIXTIME(列名) AS 列名`
- **业务规则**: BR4, BR5, BR6
- **验收标准**: TC11-TC19

**确认项**:
- [ ] [P0-准确性] 需求文档中数值类型列表包含 `decimal`、`numeric`、`float`、`double`，但这些浮点/定点类型实际上极少用于存储 Unix 时间戳（时间戳通常为整数）。将这些类型也列为触发条件可能导致**误触发**（如金额字段 `price DECIMAL(10,2)` 会显示不相关的时间转换操作） — 建议将触发类型限制为整数类型：`int`、`bigint`、`tinyint`、`smallint`、`mediumint`、`integer` 及其 `unsigned` 变体，移除 `decimal`、`numeric`、`float`、`double`
- [ ] [P1-完整性] 需求文档要求"该列未被函数包裹"才触发，但未明确如何判断列是否被函数包裹。当前 `getWordAtPosition` 只返回单词和前缀，不包含上下文信息（如该单词左侧是否紧跟 `(` 且更左侧是函数名）。需要新增解析逻辑来判断列名是否处于函数调用参数位置 — 建议在需求文档中明确判断规则：检查光标位置单词的左侧字符序列，如果匹配 `FUNC_NAME(` 模式则判定为已被函数包裹
- [ ] [P1-完整性] 需求文档要求"该列处于 SELECT 列位置"才触发，但未明确如何判断列的位置。当前 hover 逻辑不区分列是在 SELECT、WHERE、ORDER BY 还是其他子句中。需要新增 SQL 解析逻辑来判断 hover 位置是否在 SELECT 列区域内 — 建议明确：需要利用 `SqlParserService` 或正则解析确定当前 position 是否在 SELECT 和 FROM 关键字之间
- [ ] [P1-准确性] 替换规则中"如果有表前缀（如 `rm.create_time`），替换为 `FROM_UNIXTIME(rm.create_time) AS create_time`"，但示例 3 中 `rm.create_time ct`（无 AS 关键字的别名写法）替换为 `FROM_UNIXTIME(rm.create_time) AS ct`。需要澄清：是否需要处理无 AS 关键字的别名写法（如 `col alias` vs `col AS alias`）？ — 建议明确：两种别名写法都需支持，替换时统一使用 `AS` 关键字格式
- [ ] [P1-一致性] 需求文档说"SQL Server 不显示此快捷操作"，数据库类型判断来源是 `metadataService.getDatabaseType()`（返回 `'mysql' | 'sqlserver'`），但未在 FR 描述或业务规则中明确获取数据库类型的方式 — 建议在业务规则 BR6 中补充：通过 `MetadataService.getDatabaseType()` 获取当前数据库类型，仅当类型为 `'mysql'` 时启用本功能
- [ ] [P2-清晰性] 需求文档 2.2.2 中说"该字段的数据类型为数值类型"作为触发条件，但 `ColumnMetadata.type` 字段的值格式未明确（是 `"bigint"` 还是 `"bigint unsigned"` 还是 `"BIGINT(20)"`？） — 建议明确：类型匹配应采用前缀匹配或正则匹配（如 `/^(int|bigint|tinyint|smallint|mediumint|integer)/i`），以兼容 `int(11)`、`bigint unsigned` 等变体格式

## 3. 业务规则（BR）

### BR1: `*` 展开格式化规则
- 每个字段独占一行，缩进 2 个空格
- 字段之间用逗号分隔，逗号跟在字段名后
- 最后一个字段后无逗号
- `SELECT` 关键字保持在第一行

### BR2: 多表场景字段前缀规则
- 多表（JOIN 或逗号连接）时使用 `别名.字段名` 格式
- 有别名优先用别名，无别名用原表名

### BR3: `*` 展开前置条件
- `*` 必须位于 SELECT 和 FROM 之间
- FROM 子句能解析出至少一张表
- 表必须存在于已加载的元数据中

### BR4: FROM_UNIXTIME 触发条件
- 字段数据类型为数值类型（整数类型）
- 字段位于 SELECT 列位置
- 字段未被函数包裹
- 当前数据库类型为 MySQL

### BR5: FROM_UNIXTIME 替换规则
- `列名` → `FROM_UNIXTIME(列名) AS 列名`
- 带表前缀：`表.列名` → `FROM_UNIXTIME(表.列名) AS 列名`（AS 后不带表前缀）
- 已有别名：保留原有别名

### BR6: 数据库类型限制
- FROM_UNIXTIME 功能仅在 MySQL 数据库下启用
- SQL Server 不显示此快捷操作

**确认项**:
- [ ] [P1-完整性] BR2 未覆盖单表无别名场景的字段前缀处理。单表时是否不加前缀？ — 建议明确：单表且无别名时不加前缀，单表有别名时也不加前缀（因为没有歧义）
- [ ] [P2-完整性] BR1 未明确缩进方式是使用空格还是 Tab，以及空格数是否可配置 — 建议固定为 2 个空格，与项目既有格式化风格一致

## 4. 数据模型（DM）

### DM1: HoverAction 接口

```typescript
interface HoverAction {
  type: 'expand_star' | 'from_unixtime'
  title: string
  replaceText: string
  range: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
}
```

### DM2: HoverResult 扩展

```typescript
export interface HoverResult {
  hover: Hover
  tableInfo?: { name: string }
  actions?: HoverAction[]    // 新增
}
```

**确认项**:
- [ ] [P0-准确性] `HoverAction.range` 的行列编号起始值未明确。后端 `vscode-languageserver` 使用 0-based 行列号（`Position { line: 0, character: 0 }`），而前端 Monaco Editor 的 `IRange` 使用 1-based（`{ startLineNumber: 1, startColumn: 1 }`）。需求文档未明确 `range` 使用哪种编号系统 — 建议明确：`HoverAction.range` 使用 1-based 编号（与 Monaco Editor 一致），后端在构建 range 时需要将 0-based 转换为 1-based
- [ ] [P1-可扩展性] `HoverAction.type` 使用字面量联合类型 `'expand_star' | 'from_unixtime'`，后续新增快捷操作（如 DATE_FORMAT、IFNULL）时需修改类型定义。考虑使用 `string` 类型或独立的枚举 — 建议保持字面量联合类型以获得类型安全，但在备注中说明扩展时需同步更新类型定义
- [ ] [P1-完整性] IPC 通道 `sql-ls:hover` 的返回值结构需要同步扩展。当前返回 `{ success, hover, tableInfo }`，需新增 `actions` 字段。需求文档虽在影响分析中提到了 index.ts 需修改，但未给出具体的 IPC 返回值变更示例 — 建议补充 IPC 返回值变更前后的对比示例

## 5. 异常处理

| 异常场景 | 处理策略 | 来源 |
|---------|---------|------|
| 表不在元数据中 | 不显示快捷操作 | FR1 边界场景 |
| 子查询中的 `SELECT *` | 暂不支持，后续考虑 | FR1 边界场景 |
| 列已被函数包裹 | 不显示快捷操作 | FR2 边界场景 |
| 列已是 FROM_UNIXTIME 包裹 | 不显示快捷操作 | FR2 边界场景 |
| 非数值类型列 | 不显示快捷操作 | FR2 边界场景 |
| SQL Server 环境 | 不显示 FROM_UNIXTIME 操作 | BR6 |

**确认项**:
- [ ] [P1-完整性] 未覆盖网络延迟/IPC 超时场景。如果 hover IPC 调用耗时较长（如元数据量大），用户已经移走鼠标后响应才到达，是否需要取消操作？ — 建议：可忽略，Monaco hover provider 内置异步取消机制，用户移开鼠标后 hover 会自动消失
- [ ] [P1-完整性] 未覆盖替换操作后光标位置的处理。执行 `editor.executeEdits` 后光标应放在哪里？ — 建议：替换后光标保持在替换文本的末尾，Monaco Editor 的 `executeEdits` 默认行为即可满足
- [ ] [P2-完整性] 未覆盖 `*` 展开后字段数量极多（如 100+ 列的宽表）的显示体验 — 建议：可不限制，但考虑在操作确认前提示字段数量（如"即将展开 150 个字段，确定？"），或作为后续优化项

## 6. 测试策略

### 6.1 功能一测试（TC01-TC07）

| 用例ID | 维度覆盖 | 审查结论 |
|--------|---------|---------|
| TC01 | 基本功能 | ✅ 覆盖充分 |
| TC02 | 多表 JOIN | ✅ 覆盖充分 |
| TC03 | `*` 与其他列共存 | ⚠️ 缺少替换后格式化细节验证 |
| TC04 | 表不在元数据中 | ✅ 覆盖充分 |
| TC05 | 撤销操作 | ✅ 覆盖充分 |
| TC06 | DISTINCT 场景 | ✅ 覆盖充分 |
| TC07 | 逗号连接多表 | ✅ 覆盖充分 |

### 6.2 功能二测试（TC11-TC19）

| 用例ID | 维度覆盖 | 审查结论 |
|--------|---------|---------|
| TC11 | 基本转换 | ✅ 覆盖充分 |
| TC12 | 带表前缀 | ✅ 覆盖充分 |
| TC13 | 已有别名 | ⚠️ 未覆盖无 AS 关键字的别名写法 |
| TC14 | 非数值类型 | ✅ 覆盖充分 |
| TC15 | 已被函数包裹 | ✅ 覆盖充分 |
| TC16 | WHERE 子句中 | ✅ 覆盖充分 |
| TC17 | SQL Server | ✅ 覆盖充分 |
| TC18 | 撤销操作 | ✅ 覆盖充分 |
| TC19 | unsigned 类型 | ✅ 覆盖充分 |

**确认项**:
- [ ] [P1-完整性] 缺少测试用例：多行 SQL 场景。如 `SELECT\n  *\nFROM t;` 中 `*` 在第二行第 3 列，替换范围是否正确？ — 建议新增 TC08
- [ ] [P1-完整性] 缺少测试用例：`rm.create_time alias`（无 AS 关键字的别名写法）。TC13 只覆盖了 `AS ct` 写法 — 建议补充 TC13 或新增 TC20
- [ ] [P2-完整性] 缺少测试用例：连续快捷操作。先展开 `*`，然后对展开后的某个数值列执行 FROM_UNIXTIME 转换 — 建议新增 TC21 验证两个功能的联动

## 7. 风险评估

### 整体评估

| 指标 | 值 |
|------|-----|
| **P0 问题** | 3 |
| **P1 问题** | 10 |
| **P2 问题** | 4 |
| **整体风险** | 🟡 中 |
| **建议** | 需解决 3 个 P0 问题后方可进入设计阶段 |

### P0 问题汇总

| # | 维度 | 问题 | 所在 FR |
|---|------|------|---------|
| 1 | 准确性 | `getWordAtPosition` 无法识别 `*` 字符（非 `\w` 字符），需明确底层技术方案的修改 | FR1 |
| 2 | 完整性 | 后端如何计算 `*` 在文档中的精确位置（行列号）以构建 `HoverAction.range` 未明确 | FR1 |
| 3 | 准确性 | `HoverAction.range` 的行列编号起始值（0-based vs 1-based）未明确，后端与前端编号系统不同 | DM1 |

### 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| `*` 字符无法被现有 `getWordAtPosition` 识别 | **高** — 功能一完全无法工作 | 在 `provideHover` 入口增加 `*` 的特殊处理分支 |
| 判断列是否在 SELECT 区域需要新增解析逻辑 | **中** — 功能二可能在 WHERE 等子句中误触发 | 利用 SqlParserService 解析 SELECT/FROM 位置边界 |
| Monaco hover widget 的 Markdown 点击事件识别 | **中** — 需确认自定义链接的可点击性 | 复用现有 code 标签点击机制，或使用 data 属性标识操作类型 |

### 业务风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| `decimal`/`float` 类型误触发 FROM_UNIXTIME | **低** — 体验问题，不影响功能 | 限制触发类型为整数类型 |
| 宽表展开 100+ 字段影响体验 | **低** — 极端情况 | 可后续优化，增加数量提示 |

### 项目风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| hover 交互扩展影响已有表名点击功能 | **中** — 可能引入回归 | 需充分回归测试表名点击功能 |
| IPC 返回值结构变化需同步多处代码 | **低** — 涉及文件多但改动小 | 按影响分析中的文件列表逐一更新 |

## 8. 审查结论

### 通过条件

需满足以下条件方可进入设计阶段：

1. ✅ 解决 3 个 P0 问题（技术方案明确 `*` 的识别机制、位置计算、编号系统）
2. ✅ 确认 P0-准确性中 `decimal`/`float` 类型的触发策略
3. ✅ 补充 `*` 与其他列共存时的替换格式示例
4. ✅ 明确 `HoverAction.range` 的编号约定

### 质量评价

| 维度 | 评分 | 说明 |
|------|------|------|
| 一致性 | ⭐⭐⭐⭐ | 术语使用一致，接口设计与现有架构风格一致 |
| 完整性 | ⭐⭐⭐ | 主要功能覆盖完整，但部分边界场景和技术细节需补充 |
| 清晰性 | ⭐⭐⭐⭐ | 描述清晰，示例丰富，输入输出示例直观 |
| 准确性 | ⭐⭐⭐ | 存在与代码实际实现不符的地方（`*` 识别、类型触发范围） |
| 无重复性 | ⭐⭐⭐⭐⭐ | 无冗余定义 |
| 可验证性 | ⭐⭐⭐⭐ | 测试用例覆盖较全，少量场景需补充 |
