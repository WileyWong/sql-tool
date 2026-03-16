# RC-021 Hover 快捷操作功能 — 技术方案设计

## 1. 设计概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-021 |
| 变更 ID | 2026-03-16-hover-quick-actions |
| 设计日期 | 2026-03-16 |
| 修订日期 | 2026-03-16（v2：拆分 HoverActionBuilder，降低 hoverProvider 复杂度） |
| 需求文档 | `requirements/requirements_change/requirements_change_21.md` |
| 审查文档 | `workspace/2026-03-16-hover-quick-actions/requirements/requirement-review.md` |

### 1.1 设计目标

在现有 hover 机制基础上，实现两个快捷操作：
1. **`*` 展开为所有列**：hover 在 `SELECT *` 的 `*` 上时，提供一键展开为全部字段
2. **FROM_UNIXTIME 转换**：hover 在数值类型列上时，提供一键包裹 `FROM_UNIXTIME()` 函数

### 1.2 审查 P0 问题的解决方案

| P0 问题 | 解决方案 |
|---------|---------|
| `getWordAtPosition` 使用 `\w` 无法识别 `*` | 在 `provideHover` 入口增加 `*` 特殊检测分支（委托 `HoverActionBuilder`），不修改 `getWordAtPosition` |
| 后端如何计算 `*` 的精确位置 | 利用 `provideHover` 已有的 `position` 参数直接定位 `*` 的行列号 |
| `HoverAction.range` 的编号系统 | 统一使用 **1-based**（与 Monaco Editor `IRange` 一致），后端在构建时 +1 转换 |

### 1.3 v2 重构要点

v1 方案将所有快捷操作逻辑（10 个新方法、~350 行）全部堆入 `hoverProvider.ts`，存在以下问题：

| 问题 | 影响 |
|------|------|
| 职责混杂 | `isStarInSelectClause`、`isColumnWrappedByFunction`、`parseColumnExpression` 等 SQL 结构分析方法本应属于 `SqlParserService` |
| 逻辑重复 | `isStarInSelectClause` 与 `isPositionInSelectClause` 实现几乎相同 |
| 文件膨胀 | `hoverProvider.ts` 从 297 行膨胀到 ~650 行，入口方法变得复杂 |

v2 方案调整：

1. **新建 `HoverActionBuilder`**：将快捷操作的构建逻辑独立为 `providers/hoverActionBuilder.ts`
2. **SQL 分析方法下沉**：`isPositionInSelectClause`、`isColumnWrappedByFunction`、`parseColumnExpression` 下沉到 `SqlParserService`
3. **合并重复方法**：`isStarInSelectClause` 与 `isPositionInSelectClause` 合并为一个通用的 `isPositionInSelectClause`
4. **`hoverProvider.ts` 最小改动**：仅增加 ~10 行胶水代码

---

## 2. 整体架构

### 2.1 现有架构（调用链路）

```
Monaco Editor 鼠标悬浮
  → registerHoverProvider (useLanguageServer.ts)
    → window.api.sqlLanguageServer.hover(text, line, character)   [前端, 1-based → 0-based]
      → ipcRenderer.invoke('sql-ls:hover', ...)                   [preload]
        → ipcMain.handle('sql-ls:hover', ...)                     [主进程]
          → hoverProvider.provideHover(text, {line, character})    [后端, 0-based]
          ← 返回 { hover, tableInfo? }
        ← { success, hover, tableInfo }
    → 设置 editorStore / currentHoverTableInfo
  ← 返回 Monaco Hover { contents: [{value: markdown}] }
```

### 2.2 扩展后架构

```
Monaco Editor 鼠标悬浮
  → registerHoverProvider (useLanguageServer.ts)
    → window.api.sqlLanguageServer.hover(text, line, character)
      → ipcRenderer.invoke('sql-ls:hover', ...)
        → ipcMain.handle('sql-ls:hover', ...)
          → hoverProvider.provideHover(text, {line, character})
            → actionBuilder.tryProvideStarHover(...)          ← 【新增：委托】
            → actionBuilder.buildColumnActions(...)           ← 【新增：委托】
          ← 返回 { hover, tableInfo?, actions? }
        ← { success, hover, tableInfo, actions }
    → 设置 editorStore / currentHoverTableInfo
    → 保存 currentHoverActions                                ← 【新增】
    → 将 actions 渲染为 Markdown 追加到 hover.contents        ← 【新增】
  ← 返回 Monaco Hover

用户点击快捷操作链接
  → handleHoverClick (SqlEditor.vue)
    → 识别操作类型（通过 title 匹配）                        ← 【新增分支】
    → 获取对应 HoverAction 的 range + replaceText
    → editor.executeEdits('hover-action', [...])              ← 【执行替换】
```

### 2.3 文件结构变化

```
providers/
  hoverProvider.ts              ← 现有，最小改动（+~10 行）
  hoverActionBuilder.ts         ← 【新增】快捷操作构建逻辑
services/
  sqlParserService.ts           ← 现有，新增 3 个 SQL 分析方法
  metadataService.ts            ← 不变
types/
  index.ts                      ← 新增 HoverAction 类型
```

### 2.4 设计原则

1. **职责分离**：HoverProvider 负责分发，HoverActionBuilder 负责构建操作，SqlParserService 负责 SQL 结构分析
2. **后端计算，前端执行**：替换文本和范围由后端计算，前端只负责执行 `editor.executeEdits`
3. **复用现有机制**：复用 `handleHoverClick` 的点击拦截机制，扩展识别逻辑
4. **编号统一**：`HoverAction.range` 统一使用 1-based，与 Monaco 一致，后端负责转换
5. **最小侵入**：`hoverProvider.ts` 仅增加胶水代码，不影响现有表/列/视图/函数的 hover 逻辑

---

## 3. 数据模型设计

### 3.1 新增类型定义

**文件**: `src/main/sql-language-server/types/index.ts`

```typescript
/**
 * Hover 快捷操作定义
 */
export interface HoverAction {
  /** 操作类型标识 */
  type: 'expand_star' | 'from_unixtime'
  /** 操作显示标题（已国际化） */
  title: string
  /** 操作描述（已国际化） */
  description: string
  /** 替换文本 */
  replaceText: string
  /** 替换范围（1-based，与 Monaco IRange 一致） */
  range: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
}
```

> **设计决策**：`range` 属性名使用 `startLineNumber/startColumn/endLineNumber/endColumn` 而非 `startLine/startColumn/endLine/endColumn`，直接与 Monaco `IRange` 接口对齐，前端可零成本传递给 `editor.executeEdits`。

### 3.2 扩展 HoverResult

**文件**: `src/main/sql-language-server/providers/hoverProvider.ts`

```typescript
export interface HoverResult {
  hover: Hover
  tableInfo?: {
    name: string
  }
  /** 新增：快捷操作列表 */
  actions?: HoverAction[]
}
```

### 3.3 IPC 返回值变更

**变更前**：
```typescript
{ success: true, hover: { contents: { kind, value } }, tableInfo?: { name } }
```

**变更后**：
```typescript
{ success: true, hover: { contents: { kind, value } }, tableInfo?: { name }, actions?: HoverAction[] }
```

> `actions` 为可选字段，无快捷操作时不返回（`undefined`），保持向后兼容。

---

## 4. SqlParserService 扩展

> **设计理由**：以下 3 个方法是通用的 SQL 结构分析能力，不应耦合在 HoverProvider 或 HoverActionBuilder 中。下沉到 `SqlParserService` 后，其他 Provider（如 DiagnosticProvider）也可复用。

### 4.1 `isPositionInSelectClause` 方法

```typescript
/**
 * 检查文档中某个位置是否在 SELECT 列区域内
 * 即在 SELECT (DISTINCT/TOP N)? 之后、FROM 之前
 * 
 * @param documentText 完整文档文本
 * @param position 0-based 行列位置
 * @returns 是否在 SELECT 列区域
 */
isPositionInSelectClause(documentText: string, position: Position): boolean {
  // 1. 计算 position 在文档中的绝对偏移
  const lines = documentText.split('\n')
  if (position.line >= lines.length) return false

  let docOffset = 0
  for (let i = 0; i < position.line; i++) {
    docOffset += lines[i].length + 1
  }
  docOffset += position.character

  // 2. 找到包含光标的语句
  const statements = splitStatements(documentText)
  let stmtStart = 0
  for (const stmt of statements) {
    if (docOffset >= stmt.start && docOffset <= stmt.end) {
      stmtStart = stmt.start
      break
    }
  }

  // 3. 在当前语句中计算偏移
  const stmtText = documentText.substring(stmtStart)
  const offsetInStmt = docOffset - stmtStart
  const textBefore = stmtText.substring(0, offsetInStmt).toUpperCase()

  // 4. 检查最近的 SELECT 关键字
  const lastSelectIndex = textBefore.lastIndexOf('SELECT')
  if (lastSelectIndex === -1) return false

  // 5. 检查 SELECT 和当前位置之间是否有独立的 FROM 关键字
  const textBetween = textBefore.substring(lastSelectIndex)
  if (/\bFROM\b/.test(textBetween)) return false

  return true
}
```

> **复用说明**：`*` 展开和 FROM_UNIXTIME 两个功能都需要判断"当前位置是否在 SELECT 列区域"，统一使用这个方法，消除 v1 中 `isStarInSelectClause` 和 `isPositionInSelectClause` 的重复。

### 4.2 `isColumnWrappedByFunction` 方法

```typescript
/**
 * 检查光标位置的列是否被函数包裹
 * 策略：检查单词（含表前缀）左侧是否紧跟 ( 且 ( 左侧是函数名
 *
 * @param documentText 完整文档文本
 * @param position 0-based 行列位置
 * @returns 是否被函数包裹
 */
isColumnWrappedByFunction(documentText: string, position: Position): boolean {
  const lines = documentText.split('\n')
  if (position.line >= lines.length) return false

  const line = lines[position.line]

  // 获取单词的起始位置
  let start = position.character
  while (start > 0 && /[\w]/.test(line[start - 1])) {
    start--
  }

  // 跳过可能的表前缀 prefix.
  let checkPos = start
  if (checkPos > 0 && line[checkPos - 1] === '.') {
    checkPos -= 1
    while (checkPos > 0 && /[\w]/.test(line[checkPos - 1])) {
      checkPos--
    }
  }

  // 跳过空格
  let leftPos = checkPos - 1
  while (leftPos >= 0 && line[leftPos] === ' ') {
    leftPos--
  }

  // 检查是否有左括号
  if (leftPos >= 0 && line[leftPos] === '(') {
    // 检查括号左侧是否有函数名（连续的字母字符）
    let funcEnd = leftPos - 1
    while (funcEnd >= 0 && line[funcEnd] === ' ') {
      funcEnd--
    }
    if (funcEnd >= 0 && /[\w]/.test(line[funcEnd])) {
      return true
    }
  }

  return false
}
```

### 4.3 `parseColumnExpression` 方法

```typescript
/**
 * 列表达式信息
 */
export interface ColumnExpressionInfo {
  /** 表达式起始行（0-based） */
  startLine: number
  /** 表达式起始列（0-based） */
  startColumn: number
  /** 表达式结束行（0-based） */
  endLine: number
  /** 表达式结束列（0-based） */
  endColumn: number
  /** 别名（如有） */
  alias?: string
}
```

```typescript
/**
 * 解析光标位置的列表达式范围（含表前缀和别名）
 * 返回表达式在文档中的起止位置和别名信息
 *
 * @param documentText 完整文档文本
 * @param position 0-based 行列位置
 * @returns 列表达式信息，解析失败返回 null
 */
parseColumnExpression(
  documentText: string,
  position: Position
): ColumnExpressionInfo | null {
  const lines = documentText.split('\n')
  if (position.line >= lines.length) return null

  const line = lines[position.line]

  // 1. 找到单词边界
  let wordStart = position.character
  while (wordStart > 0 && /[\w]/.test(line[wordStart - 1])) {
    wordStart--
  }
  let wordEnd = position.character
  while (wordEnd < line.length && /[\w]/.test(line[wordEnd])) {
    wordEnd++
  }

  // 2. 向前检查表前缀
  let exprStart = wordStart
  if (exprStart > 0 && line[exprStart - 1] === '.') {
    exprStart -= 1  // 跳过 .
    while (exprStart > 0 && /[\w]/.test(line[exprStart - 1])) {
      exprStart--
    }
  }

  // 3. 向后检查别名（AS alias 或 空格 alias）
  let exprEnd = wordEnd
  let alias: string | undefined

  // 跳过空格
  let afterEnd = wordEnd
  while (afterEnd < line.length && line[afterEnd] === ' ') {
    afterEnd++
  }

  // 检查是否有 AS 关键字
  const afterText = line.substring(afterEnd)
  const asMatch = afterText.match(/^(AS\s+)(\w+)/i)
  if (asMatch) {
    alias = asMatch[2]
    exprEnd = afterEnd + asMatch[0].length
  } else {
    // 检查无 AS 的别名写法：col alias（alias 不能是 SQL 关键字）
    const aliasMatch = afterText.match(/^(\w+)/)
    if (aliasMatch) {
      const candidate = aliasMatch[1].toUpperCase()
      const sqlKeywords = [
        'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
        'OUTER', 'CROSS', 'ON', 'AND', 'OR', 'ORDER', 'GROUP', 'HAVING',
        'LIMIT', 'UNION', 'INTO', 'SET', 'VALUES', 'AS', 'CASE', 'WHEN',
        'THEN', 'ELSE', 'END', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
        'IS', 'NULL', 'ASC', 'DESC', 'DISTINCT', 'ALL'
      ]
      if (!sqlKeywords.includes(candidate) && afterEnd > wordEnd) {
        const afterAlias = afterText.substring(aliasMatch[0].length).trimStart()
        if (!afterAlias || /^[,)]/.test(afterAlias) ||
            /^(FROM|WHERE|ORDER|GROUP|HAVING|LIMIT)\b/i.test(afterAlias)) {
          alias = aliasMatch[1]
          exprEnd = afterEnd + aliasMatch[0].length
        }
      }
    }
  }

  return {
    startLine: position.line,
    startColumn: exprStart,
    endLine: position.line,
    endColumn: exprEnd,
    alias
  }
}
```

> **导出说明**：`ColumnExpressionInfo` 接口和 3 个方法都作为 `SqlParserService` 的 public 方法导出。`Position` 类型来自 `vscode-languageserver`，`SqlParserService` 需要新增此 import。

---

## 5. HoverActionBuilder（新建文件）

**文件**: `src/main/sql-language-server/providers/hoverActionBuilder.ts`

> 该类负责所有快捷操作的判断与构建逻辑。`hoverProvider.ts` 通过组合持有它的实例，仅在入口处做简单委托。

### 5.1 类结构总览

```typescript
import { Position, MarkupKind } from 'vscode-languageserver'
import { MetadataService } from '../services/metadataService'
import { SqlParserService, splitStatements } from '../services/sqlParserService'
import type { HoverAction, TableRef, ColumnMetadata } from '../types'
import { t } from '../../i18n'
import type { HoverResult } from './hoverProvider'

export class HoverActionBuilder {
  private metadataService: MetadataService
  private sqlParser: SqlParserService

  constructor(metadataService: MetadataService, sqlParser: SqlParserService) {
    this.metadataService = metadataService
    this.sqlParser = sqlParser
  }

  // ── * 展开相关 ──
  tryProvideStarHover(documentText: string, position: Position): HoverResult | null
  private buildExpandedColumns(tables: TableRef[]): string
  private buildStarHoverMarkdown(): string

  // ── FROM_UNIXTIME 相关 ──
  buildColumnActions(column: ColumnMetadata, tableName: string, prefix: string | undefined,
                     documentText: string, position: Position, currentStatement: string): HoverAction[]
  private isIntegerType(columnType: string): boolean
  private tryBuildFromUnixtimeAction(column: ColumnMetadata, tableName: string, prefix: string | undefined,
                                      documentText: string, position: Position): HoverAction | null
}
```

**方法数量**：6 个（对比 v1 的 10 个，减少 4 个——因为 3 个 SQL 分析方法下沉到 SqlParserService，1 个重复方法被合并）

### 5.2 `tryProvideStarHover` 方法

```typescript
/**
 * 尝试为 * 字符提供 hover（含快捷操作）
 * 在 getWordAtPosition 之前调用，解决 * 不属于 \w 字符集的问题
 */
tryProvideStarHover(
  documentText: string,
  position: Position
): HoverResult | null {
  const lines = documentText.split('\n')
  if (position.line >= lines.length) return null

  const line = lines[position.line]
  if (position.character >= line.length) return null

  // 1. 检查光标位置的字符是否为 *
  if (line[position.character] !== '*') return null

  // 2. 检查 * 是否在 SELECT 列区域（复用 SqlParserService 的通用方法）
  if (!this.sqlParser.isPositionInSelectClause(documentText, position)) return null

  // 3. 从当前语句提取表引用
  const currentStatement = this.extractCurrentStatementText(documentText, position)
  const dbType = this.metadataService.getDatabaseType()
  const tables = this.sqlParser.extractTablesFromSql(currentStatement, dbType)
  if (tables.length === 0) return null

  // 4. 检查所有表是否在元数据中
  const validTables = tables.filter(t => this.metadataService.hasTable(t.name))
  if (validTables.length === 0) return null

  // 5. 构建替换文本
  const replaceText = this.buildExpandedColumns(validTables)

  // 6. 构建 HoverAction（range 使用 1-based）
  const action: HoverAction = {
    type: 'expand_star',
    title: t('hover.actionExpandStar'),
    description: t('hover.actionExpandStarDesc'),
    replaceText,
    range: {
      startLineNumber: position.line + 1,       // 0-based → 1-based
      startColumn: position.character + 1,       // 0-based → 1-based
      endLineNumber: position.line + 1,
      endColumn: position.character + 2          // * 是单字符，结束列 = 起始列 + 1
    }
  }

  // 7. 构建 hover Markdown 内容
  const hoverMarkdown = this.buildStarHoverMarkdown()

  return {
    hover: {
      contents: {
        kind: MarkupKind.Markdown,
        value: hoverMarkdown
      }
    },
    actions: [action]
  }
}
```

### 5.3 `extractCurrentStatementText` 方法

```typescript
/**
 * 从文档文本中提取光标所在的当前语句文本
 * 复用 splitStatements，与 HoverProvider.extractCurrentStatementText 逻辑一致
 */
private extractCurrentStatementText(documentText: string, position: Position): string {
  const lines = documentText.split('\n')
  let offset = 0
  for (let i = 0; i < position.line && i < lines.length; i++) {
    offset += lines[i].length + 1
  }
  offset += position.character

  const statements = splitStatements(documentText)
  for (const stmt of statements) {
    if (offset >= stmt.start && offset <= stmt.end) {
      return stmt.text
    }
  }
  return documentText
}
```

> **关于复用**：`HoverProvider` 和 `HoverActionBuilder` 都有 `extractCurrentStatementText`。虽然逻辑一致，但此方法非常短（~10 行），且两个类使用场景独立，不值得为此增加耦合。保持各自私有方法，代码更清晰。

### 5.4 `buildExpandedColumns` 方法

```typescript
/**
 * 构建展开后的列文本
 */
private buildExpandedColumns(tables: TableRef[]): string {
  const isMultiTable = tables.length > 1
  const columnLines: string[] = []

  for (const tableRef of tables) {
    const columns = this.metadataService.getColumns(tableRef.name)
    for (const col of columns) {
      if (isMultiTable) {
        // 多表时加表前缀（优先用别名）
        const prefix = tableRef.alias || tableRef.name
        columnLines.push(`  ${prefix}.${col.name}`)
      } else {
        // 单表不加前缀
        columnLines.push(`  ${col.name}`)
      }
    }
  }

  // 格式化：每行一个字段，逗号跟在字段后，最后一个无逗号
  const formatted = columnLines
    .map((line, index) => {
      return index < columnLines.length - 1 ? `${line},` : line
    })
    .join('\n')

  return `\n${formatted}\n`
}
```

> **替换效果**：
> ```
> SELECT * FROM t;
>        ↓ 替换 * 为多行文本
> SELECT
>   col1,
>   col2,
>   col3
> FROM t;
> ```

### 5.5 `buildStarHoverMarkdown` 方法

```typescript
/**
 * 构建 * hover 的 Markdown 内容（不含快捷操作部分，操作由前端追加）
 */
private buildStarHoverMarkdown(): string {
  return `**${t('hover.selectAll')}**: \`*\``
}
```

### 5.6 `buildColumnActions` 方法

```typescript
/**
 * 为列构建可用的快捷操作列表
 * 由 HoverProvider 在列查找成功后调用
 */
buildColumnActions(
  column: ColumnMetadata,
  tableName: string,
  prefix: string | undefined,
  documentText: string,
  position: Position,
  currentStatement: string
): HoverAction[] {
  const actions: HoverAction[] = []
  const dbType = this.metadataService.getDatabaseType()

  // FROM_UNIXTIME 操作（仅 MySQL）
  if (dbType === 'mysql' && this.isIntegerType(column.type)) {
    const fromUnixAction = this.tryBuildFromUnixtimeAction(
      column, tableName, prefix, documentText, position
    )
    if (fromUnixAction) {
      actions.push(fromUnixAction)
    }
  }

  return actions
}
```

### 5.7 `isIntegerType` 方法

```typescript
/**
 * 检查列类型是否为整数类型（可能存储时间戳）
 * 仅限整数类型，排除 decimal/float/double 避免金额字段误触发
 */
private isIntegerType(columnType: string): boolean {
  const normalizedType = columnType.toLowerCase().trim()
  return /^(int|bigint|tinyint|smallint|mediumint|integer)(\s|$|\()/.test(normalizedType)
}
```

> **设计决策**：使用正则前缀匹配，兼容 `int(11)`、`bigint unsigned`、`int(10) unsigned` 等变体格式。

### 5.8 `tryBuildFromUnixtimeAction` 方法

```typescript
/**
 * 尝试构建 FROM_UNIXTIME 快捷操作
 * 需要满足：列在 SELECT 区域 + 未被函数包裹
 */
private tryBuildFromUnixtimeAction(
  column: ColumnMetadata,
  tableName: string,
  prefix: string | undefined,
  documentText: string,
  position: Position
): HoverAction | null {
  // 1. 检查列是否在 SELECT 列区域（调用 SqlParserService）
  if (!this.sqlParser.isPositionInSelectClause(documentText, position)) {
    return null
  }

  // 2. 检查列是否被函数包裹（调用 SqlParserService）
  if (this.sqlParser.isColumnWrappedByFunction(documentText, position)) {
    return null
  }

  // 3. 解析列表达式的完整范围（含别名、表前缀）（调用 SqlParserService）
  const exprInfo = this.sqlParser.parseColumnExpression(documentText, position)
  if (!exprInfo) return null

  // 4. 构建替换文本
  const columnRef = prefix ? `${prefix}.${column.name}` : column.name
  const alias = exprInfo.alias || column.name
  const replaceText = `FROM_UNIXTIME(${columnRef}) AS ${alias}`

  // 5. 构建 range（0-based → 1-based）
  return {
    type: 'from_unixtime',
    title: t('hover.actionFromUnixtime'),
    description: t('hover.actionFromUnixtimeDesc', { column: columnRef, alias }),
    replaceText,
    range: {
      startLineNumber: exprInfo.startLine + 1,
      startColumn: exprInfo.startColumn + 1,
      endLineNumber: exprInfo.endLine + 1,
      endColumn: exprInfo.endColumn + 1
    }
  }
}
```

### 5.9 边界场景处理

#### `*` 展开

| 场景 | 处理方式 |
|------|---------|
| `SELECT *, other_col FROM t` | `*` 的 range 仅覆盖 `*` 一个字符，替换文本为 `\n  col1,\n  col2,\n  col3`（无尾部换行），保留 `, other_col` |
| `SELECT DISTINCT * FROM t` | `*` 仍然是单字符，DISTINCT 不受影响 |
| `FROM t1, t2`（逗号连接多表） | `extractTablesFromSql` 能解析逗号连接的多表，统一加表名前缀 |
| 表不在元数据中 | `hasTable` 返回 false，不返回 actions |
| 子查询中的 `SELECT *` | 暂不支持（基于分号分割语句，不深入子查询） |

**`*, other_col` 详细分析**：

原始 SQL：`SELECT *, other_col FROM t;`

`*` 位于（假设行 0，列 7），range 为 `{startLineNumber:1, startColumn:8, endLineNumber:1, endColumn:9}`。

替换文本：`\n  col1,\n  col2,\n  col3`（不以 `\n` 结尾）

替换后：
```sql
SELECT
  col1,
  col2,
  col3, other_col FROM t;
```

> `col3` 后紧跟原 `*` 后面的 `, other_col`，语法正确。

#### FROM_UNIXTIME

| 场景 | 处理方式 |
|------|---------|
| `create_time AS ct` | 识别 AS 别名，替换为 `FROM_UNIXTIME(create_time) AS ct` |
| `rm.create_time ct` | 识别空格别名，替换为 `FROM_UNIXTIME(rm.create_time) AS ct` |
| `MAX(create_time)` | `isColumnWrappedByFunction` 返回 true，不显示操作 |
| `FROM_UNIXTIME(create_time)` | 同上，已被函数包裹 |
| `WHERE create_time > 0` | `isPositionInSelectClause` 返回 false，不显示操作 |
| `name`（varchar 类型） | `isIntegerType` 返回 false，不触发 |
| SQL Server 环境 | `dbType !== 'mysql'`，不触发 |
| `price DECIMAL(10,2)` | `isIntegerType` 排除 decimal，不触发 |

---

## 6. HoverProvider 改造（最小改动）

### 6.1 改动全貌

对 `hoverProvider.ts` 的改动控制在 **~15 行**：

```typescript
import { HoverActionBuilder } from './hoverActionBuilder'
import type { HoverAction } from '../types'

export interface HoverResult {
  hover: Hover
  tableInfo?: { name: string }
  actions?: HoverAction[]                       // 【新增字段】
}

export class HoverProvider {
  private metadataService: MetadataService
  private sqlParser: SqlParserService
  private actionBuilder: HoverActionBuilder     // 【新增属性】

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
    this.sqlParser = new SqlParserService()
    this.actionBuilder = new HoverActionBuilder( // 【新增初始化】
      this.metadataService, this.sqlParser
    )
  }

  provideHover(documentText: string, position: Position): HoverResult | null {
    // 【新增：* 特殊检测，委托 actionBuilder】
    const starResult = this.actionBuilder.tryProvideStarHover(documentText, position)
    if (starResult) return starResult

    // ===== 以下现有逻辑保持不变 =====
    const wordInfo = this.getWordAtPosition(documentText, position)
    if (!wordInfo) return null

    const { word, prefix } = wordInfo
    const currentStatement = this.extractCurrentStatementText(documentText, position)

    // 带前缀的列查找
    if (prefix) {
      const tableName = this.resolveTableAlias(currentStatement, prefix)
      const column = this.metadataService.getColumns(tableName).find(
        c => c.name.toLowerCase() === word.toLowerCase()
      )
      if (column) {
        // 【修改：追加 actions】
        const actions = this.actionBuilder.buildColumnActions(
          column, tableName, prefix, documentText, position, currentStatement
        )
        return {
          hover: this.createColumnHover(column, tableName),
          actions: actions.length > 0 ? actions : undefined
        }
      }
    }

    // 表查找（不变）
    const table = this.metadataService.getTable(word)
    if (table) {
      return { hover: this.createTableHover(table), tableInfo: { name: table.name } }
    }

    // 视图查找（不变）
    const view = this.metadataService.getView(word)
    if (view) {
      return { hover: this.createViewHover(view) }
    }

    // 函数查找（不变）
    const func = this.metadataService.getFunction(word)
    if (func) {
      return { hover: this.createFunctionHover(func) }
    }

    // 无前缀的列推断
    const dbType = this.metadataService.getDatabaseType()
    const tables = this.sqlParser.extractTablesFromSql(currentStatement, dbType)
    for (const tableRef of tables) {
      const columns = this.metadataService.getColumns(tableRef.name)
      const column = columns.find(c => c.name.toLowerCase() === word.toLowerCase())
      if (column) {
        // 【修改：追加 actions】
        const actions = this.actionBuilder.buildColumnActions(
          column, tableRef.name, undefined, documentText, position, currentStatement
        )
        return {
          hover: this.createColumnHover(column, tableRef.name),
          actions: actions.length > 0 ? actions : undefined
        }
      }
    }

    return null
  }

  // ===== 以下所有私有方法完全不变 =====
  // extractCurrentStatementText、getWordAtPosition、resolveTableAlias
  // createTableHover、createViewHover、createColumnHover、createFunctionHover
}
```

### 6.2 改动对比

| 改动点 | 行数 | 说明 |
|--------|------|------|
| import 语句 | +2 | 引入 `HoverActionBuilder` 和 `HoverAction` |
| `HoverResult` 接口 | +1 | 新增 `actions?` 字段 |
| `actionBuilder` 属性 | +1 | 新增属性声明 |
| 构造函数 | +3 | 初始化 `actionBuilder` |
| `provideHover` 入口 | +2 | `*` 检测委托 |
| 带前缀列查找分支 | +4 | 追加 `buildColumnActions` 调用 |
| 无前缀列推断分支 | +4 | 追加 `buildColumnActions` 调用 |
| **合计** | **+17** | 从 297 行 → ~314 行 |

> 对比 v1 方案的 297 → ~650 行（+353 行、+10 方法），v2 仅 +17 行、0 个新方法，复杂度几乎不变。

---

## 7. 前端方案设计

### 7.1 `useLanguageServer.ts` 改造

#### 7.1.1 新增状态

```typescript
// 当前 hover 的快捷操作列表
const currentHoverActions = ref<HoverAction[] | null>(null)
```

#### 7.1.2 修改 `provideHover` 回调

```typescript
hoverDisposable = monaco.languages.registerHoverProvider('sql', {
  provideHover: async (model, position) => {
    const documentText = model.getValue()
    const line = position.lineNumber - 1    // 1-based → 0-based
    const character = position.column - 1

    try {
      const result = await window.api.sqlLanguageServer.hover(documentText, line, character)
      
      if (!result.success || !result.hover) {
        editorStore.setHoverHint(null)
        currentHoverTableInfo.value = null
        currentHoverActions.value = null    // 【新增】清除操作
        return null
      }

      // 表 hover 状态
      if (result.tableInfo) {
        editorStore.setHoverHint('💡 点击表名打开表管理')
        currentHoverTableInfo.value = result.tableInfo
      } else {
        editorStore.setHoverHint(null)
        currentHoverTableInfo.value = null
      }

      // 【新增】保存快捷操作并追加到 Markdown
      currentHoverActions.value = result.actions || null
      let markdownValue = result.hover.contents.value

      if (result.actions && result.actions.length > 0) {
        markdownValue += '\n\n---\n'
        markdownValue += `📋 **${t('hover.quickActions')}**\n\n`
        result.actions.forEach((action, index) => {
          const icon = action.type === 'expand_star' ? '🔄' : '🕐'
          markdownValue += `${icon} \`${action.title}\` — ${action.description}\n\n`
        })
        editorStore.setHoverHint('💡 点击操作执行快捷替换')
      }

      return {
        contents: [{ value: markdownValue }]
      }
    } catch (error) {
      console.error('悬浮提示请求失败:', error)
      editorStore.setHoverHint(null)
      currentHoverTableInfo.value = null
      currentHoverActions.value = null
      return null
    }
  }
})
```

#### 7.1.3 新增 `executeHoverAction` 方法

```typescript
/**
 * 执行 hover 快捷操作（编辑器文本替换）
 */
function executeHoverAction(editor: monaco.editor.IStandaloneCodeEditor, actionIndex: number) {
  if (!currentHoverActions.value || actionIndex >= currentHoverActions.value.length) return

  const action = currentHoverActions.value[actionIndex]

  // 使用 editor.executeEdits 执行替换（支持 Ctrl+Z 撤销）
  editor.executeEdits('hover-quick-action', [
    {
      range: new monaco.Range(
        action.range.startLineNumber,
        action.range.startColumn,
        action.range.endLineNumber,
        action.range.endColumn
      ),
      text: action.replaceText,
      forceMoveMarkers: true
    }
  ])

  // 替换后清除 hover 状态
  currentHoverActions.value = null
  editorStore.setHoverHint(null)
}
```

#### 7.1.4 暴露新增属性

```typescript
return {
  // ... 已有属性 ...
  currentHoverActions,         // 新增
  executeHoverAction,          // 新增
}
```

### 7.2 `SqlEditor.vue` 改造

#### 7.2.1 扩展 `handleHoverClick`

```typescript
function handleHoverClick(e: MouseEvent) {
  const target = e.target as HTMLElement

  const hoverWidget = target.closest('.monaco-hover')
  if (!hoverWidget) {
    languageServer.clearHoverState()
    return
  }

  // ===== 新增：检查是否点击了快捷操作 =====
  const codeElement = target.tagName === 'CODE' ? target : target.closest('code')
  if (codeElement && languageServer.currentHoverActions.value) {
    const hoverContent = hoverWidget.querySelector('.monaco-hover-content')
    if (hoverContent) {
      const hr = hoverContent.querySelector('hr')
      if (hr) {
        // 检查 code 元素是否在 hr 之后
        const isAfterHr = !!(hr.compareDocumentPosition(codeElement) & Node.DOCUMENT_POSITION_FOLLOWING)
        if (isAfterHr) {
          // 通过 title 文本匹配操作索引
          const clickedTitle = codeElement.textContent
          const actionIndex = languageServer.currentHoverActions.value.findIndex(
            a => a.title === clickedTitle
          )
          if (actionIndex !== -1 && editorInstance.value) {
            e.preventDefault()
            e.stopPropagation()
            languageServer.executeHoverAction(editorInstance.value, actionIndex)
            return
          }
        }
      }
    }
  }

  // ===== 现有逻辑：检查是否点击了表名（不变） =====
  if (!languageServer.currentHoverTableInfo.value) return
  if (!codeElement) return
  // ... 后续不变 ...
}
```

#### 7.2.2 新增 CSS 样式

```css
/* 快捷操作链接样式 - 分割线之后的 code 标签 */
:deep(.monaco-hover-content hr ~ p > code) {
  color: #4fc3f7 !important;
  cursor: pointer !important;
  border-bottom: 1px dashed #4fc3f7;
  transition: all 0.15s ease;
}

:deep(.monaco-hover-content hr ~ p > code:hover) {
  color: #81d4fa !important;
  border-bottom-color: #81d4fa;
  background-color: rgba(79, 195, 247, 0.1);
}
```

#### 7.2.3 `handleMouseMove` 改造

```typescript
function handleMouseMove(e: MouseEvent) {
  // 增加 currentHoverActions 的检测
  if (!languageServer.currentHoverTableInfo.value && !languageServer.currentHoverActions.value) return
  
  // ... 后续逻辑不变 ...
}
```

---

## 8. IPC 层改造

### 8.1 主进程 `index.ts`

```typescript
ipcMain.handle('sql-ls:hover', async (
  _event: IpcMainInvokeEvent,
  documentText: string,
  line: number,
  character: number
) => {
  try {
    const result = hoverProvider.provideHover(documentText, { line, character })
    if (result) {
      return {
        success: true,
        hover: result.hover,
        tableInfo: result.tableInfo,
        actions: result.actions          // 【新增】透传 actions
      }
    }
    return { success: true, hover: null }
  } catch (error: any) {
    console.error('悬浮提示请求失败:', error)
    return { success: false, error: error.message, hover: null }
  }
})
```

### 8.2 Preload `index.ts`

无需修改。Preload 层只负责 `ipcRenderer.invoke('sql-ls:hover', documentText, line, character)`，返回值结构的扩展不影响 IPC 透传。

---

## 9. 国际化

### 9.1 新增翻译键

**文件**: `src/main/i18n/locales/zh-CN.ts`

```typescript
hover: {
  // ... 已有键 ...
  selectAll: '通配符',
  quickActions: '快捷操作',
  actionExpandStar: '列出所有列',
  actionExpandStarDesc: '将 * 替换为所有字段',
  actionFromUnixtime: 'FROM_UNIXTIME 转成时间',
  actionFromUnixtimeDesc: '转换为 FROM_UNIXTIME({column}) AS {alias}',
}
```

**文件**: `src/main/i18n/locales/en-US.ts`

```typescript
hover: {
  // ... 已有键 ...
  selectAll: 'Wildcard',
  quickActions: 'Quick Actions',
  actionExpandStar: 'Expand all columns',
  actionExpandStarDesc: 'Replace * with all column names',
  actionFromUnixtime: 'FROM_UNIXTIME conversion',
  actionFromUnixtimeDesc: 'Convert to FROM_UNIXTIME({column}) AS {alias}',
}
```

**文件**: `src/main/i18n/locales/zh-TW.ts`

```typescript
hover: {
  // ... 已有键 ...
  selectAll: '通配符',
  quickActions: '快捷操作',
  actionExpandStar: '列出所有欄位',
  actionExpandStarDesc: '將 * 替換為所有欄位',
  actionFromUnixtime: 'FROM_UNIXTIME 轉成時間',
  actionFromUnixtimeDesc: '轉換為 FROM_UNIXTIME({column}) AS {alias}',
}
```

---

## 10. 文件修改清单

| # | 文件路径 | 修改类型 | 修改内容 | 代码量 |
|---|---------|---------|---------|--------|
| 1 | `src/main/sql-language-server/types/index.ts` | **新增类型** | 新增 `HoverAction` 接口、`ColumnExpressionInfo` 接口 | +25行 |
| 2 | `src/main/sql-language-server/services/sqlParserService.ts` | **扩展** | 新增 `isPositionInSelectClause`、`isColumnWrappedByFunction`、`parseColumnExpression` 共 3 个 public 方法 | +120行 |
| 3 | **`src/main/sql-language-server/providers/hoverActionBuilder.ts`** | **新建** | 新建 `HoverActionBuilder` 类，含 6 个方法 | ~200行 |
| 4 | `src/main/sql-language-server/providers/hoverProvider.ts` | **微调** | `HoverResult` 加 `actions?`、新增 `actionBuilder` 属性、入口增加 `*` 委托、列查找追加 actions | +17行 |
| 5 | `src/main/sql-language-server/index.ts` | **微调** | IPC 返回值新增 `actions` 字段透传 | +1行 |
| 6 | `src/renderer/composables/useLanguageServer.ts` | **修改** | 新增 `currentHoverActions` 状态、修改 `provideHover` 回调、新增 `executeHoverAction` 方法 | +40行 |
| 7 | `src/renderer/components/SqlEditor.vue` | **修改** | 扩展 `handleHoverClick` 识别快捷操作点击、扩展 `handleMouseMove`、新增 CSS 样式 | +35行 |
| 8 | `src/main/i18n/locales/zh-CN.ts` | **新增翻译** | 新增 6 个 hover 相关翻译键 | +6行 |
| 9 | `src/main/i18n/locales/en-US.ts` | **新增翻译** | 同上 | +6行 |
| 10 | `src/main/i18n/locales/zh-TW.ts` | **新增翻译** | 同上 | +6行 |
| 11 | `src/preload/index.ts` | **无需修改** | IPC 透传不受影响 | 0 |

### 10.1 v1 → v2 改动对比

| 指标 | v1 方案 | v2 方案 | 改进 |
|------|---------|---------|------|
| `hoverProvider.ts` 新增行数 | +353行 | **+17行** | ↓ 95% |
| `hoverProvider.ts` 新增方法 | 10 个 | **0 个** | ↓ 100% |
| `hoverProvider.ts` 最终行数 | ~650行 | **~314行** | ↓ 52% |
| SQL 分析方法复用 | 不可复用 | **可复用**（在 SqlParserService） | ✅ |
| 重复逻辑 | `isStarInSelectClause` ≈ `isPositionInSelectClause` | **合并为 1 个** | ✅ |
| 涉及文件数 | 9 | **10**（+1 新建文件） | 微增 |
| 总新增代码量 | ~456行 | ~456行 | 相当 |

> 总代码量不变，但**分布更合理**：复杂度从 hoverProvider 分散到了 3 个文件中，每个文件保持单一职责。

---

## 11. 实现顺序建议

### 阶段一：基础框架（预计 1h）
1. 定义 `HoverAction`、`ColumnExpressionInfo` 类型（types/index.ts）
2. `SqlParserService` 新增 3 个 public 方法
3. 新建 `HoverActionBuilder` 类骨架
4. `HoverProvider` 新增 `actionBuilder` 属性和 `HoverResult.actions` 字段
5. IPC 层透传 `actions`（index.ts）
6. 前端 `currentHoverActions` 状态管理（useLanguageServer.ts）
7. 国际化翻译键（3 个语言文件）

### 阶段二：功能一 - `*` 展开（预计 1.5h）
1. 实现 `SqlParserService.isPositionInSelectClause`
2. 实现 `HoverActionBuilder.tryProvideStarHover`
3. 实现 `HoverActionBuilder.buildExpandedColumns`
4. 实现 `HoverActionBuilder.buildStarHoverMarkdown`
5. `HoverProvider.provideHover` 入口增加 `*` 委托（2 行）
6. 前端快捷操作 Markdown 渲染 + `executeHoverAction`
7. 前端 `handleHoverClick` 扩展 + CSS 样式

### 阶段三：功能二 - FROM_UNIXTIME（预计 1.5h）
1. 实现 `SqlParserService.isColumnWrappedByFunction`
2. 实现 `SqlParserService.parseColumnExpression`
3. 实现 `HoverActionBuilder.isIntegerType`
4. 实现 `HoverActionBuilder.tryBuildFromUnixtimeAction`
5. 实现 `HoverActionBuilder.buildColumnActions`
6. `HoverProvider.provideHover` 列查找分支追加 actions（2 处，各 +4 行）

### 阶段四：测试和调优（预计 1h）
1. 单表 `*` 展开测试
2. 多表 JOIN `*` 展开测试
3. `*` 与其他列共存测试
4. FROM_UNIXTIME 基本转换测试
5. 带前缀 / 别名场景测试
6. 边界场景回归测试
7. 现有表名点击功能回归测试

---

## 12. 技术风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Monaco hover Markdown 中 `<hr>` 渲染不一致 | 快捷操作区域定位失效 | 开发阶段验证 `---` 是否正确渲染为 `<hr>`；备选方案：使用特定文本标识替代 |
| `code` 标签点击事件与表名点击冲突 | 误触发操作 | 通过 `hr.compareDocumentPosition` 精确区分分割线前后的 `<code>` |
| `extractTablesFromSql` 对复杂 SQL 解析失败 | `*` 展开无法获取表列表 | `extractTablesFromSql` 已有 AST → 正则降级机制，风险低 |
| 多行 SQL 中 `*` 的位置计算 | range 不正确导致替换错误 | `*` 是单字符，range 计算简单（当前行+当前列），已直接使用 position 参数 |
| `parseColumnExpression` 对复杂别名场景解析不准 | 替换范围错误 | 优先处理常见场景（AS alias、空格 alias），极端场景允许降级不显示操作 |

---

## 13. 后续扩展

本方案中 `HoverAction` 的设计具备通用性，后续可方便扩展：

1. **新增操作类型**：只需在 `HoverAction.type` 联合类型中添加新值，并在 `HoverActionBuilder.buildColumnActions` 中添加对应逻辑
2. **其他函数包裹**：如 `DATE_FORMAT`、`IFNULL`、`CONCAT` 等，复用 `tryBuildFromUnixtimeAction` 的模式
3. **SQL Server 支持**：为 SQL Server 添加对应的时间转换函数（如 `DATEADD`/`DATEDIFF`）
4. **反向操作**：检测已有 `FROM_UNIXTIME()` 包裹的列，提供"移除 FROM_UNIXTIME"操作
5. **SqlParserService 新方法**可被其他 Provider 复用（如 DiagnosticProvider 的 SELECT * 警告）
