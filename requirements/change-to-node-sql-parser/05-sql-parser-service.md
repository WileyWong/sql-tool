# Phase 4：sqlParserService.ts 改造（核心）

## 1. 当前使用 sql-parser-cst 的位置

### 1.1 import

```typescript
import { parse, cstVisitor } from 'sql-parser-cst'
```

### 1.2 extractTablesFromSql（第 450-461 行）

入口方法，CST 解析 → 提取表引用，失败时降级到正则：

```typescript
extractTablesFromSql(sql: string): TableRef[] {
  try {
    const cst = parse(sql, { dialect: 'mysql', includeRange: true })
    return this.extractTablesFromCST(cst)
  } catch {
    return this.extractTablesFromSqlRegex(sql)
  }
}
```

### 1.3 extractTablesFromCST（第 466-484 行）

使用 `cstVisitor` 遍历 CST，提取 `from_clause` 和 `join_expr`：

```typescript
private extractTablesFromCST(cst: CstNode): TableRef[] {
  const visitor = cstVisitor({
    from_clause: (node) => { ... },
    join_expr: (node) => { ... }
  })
  visitor(cst)
  return tables
}
```

### 1.4 CST 节点遍历方法（第 489-713 行）

约 224 行代码，包括：
- `extractTablesFromFromClause` — 处理 FROM 子句
- `extractTableFromExpr` — 处理各种 CST 节点类型（identifier, member_expr, alias, paren_expr, join_expr, list_expr）
- `extractTableFromAlias` — 处理别名
- `extractTableFromParenExpr` — 处理子查询
- `extractTableFromJoinExpr` — 处理 JOIN
- `addTableRef` — 添加表引用
- `getIdentifierName` — 从 CST 节点获取标识符名称
- `extractSubqueryInfo` — 从子查询中提取列信息

## 2. node-sql-parser AST 结构

### 2.1 基本 SELECT 语句

```sql
SELECT u.name, u.age FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.age > 18
```

AST 结构（简化）：

```json
{
  "type": "select",
  "from": [
    {
      "db": null,
      "table": "users",
      "as": "u"
    },
    {
      "db": null,
      "table": "orders",
      "as": "o",
      "join": "LEFT JOIN",
      "on": { ... }
    }
  ],
  "columns": [
    { "expr": { "type": "column_ref", "table": "u", "column": "name" }, "as": null },
    { "expr": { "type": "column_ref", "table": "u", "column": "age" }, "as": null }
  ],
  "where": { ... }
}
```

### 2.2 子查询

```sql
SELECT t.id FROM (SELECT id, name FROM users) AS t
```

AST 中子查询的 `from` 项：

```json
{
  "expr": {
    "type": "select",
    "from": [{ "db": null, "table": "users", "as": null }],
    "columns": [
      { "expr": { "type": "column_ref", "column": "id" }, "as": null },
      { "expr": { "type": "column_ref", "column": "name" }, "as": null }
    ]
  },
  "as": "t"
}
```

### 2.3 内置 tableList / columnList

```typescript
const { tableList, columnList } = parser.parse(sql, { database: 'MySQL' })
// tableList: ["select::null::users", "select::null::orders"]
// 格式: "{operation}::{db}::{table}"
```

## 3. 改造方案

### 3.1 方法签名变更

```typescript
// 当前
extractTablesFromSql(sql: string): TableRef[]

// 改为（增加可选 dbType 参数）
extractTablesFromSql(sql: string, dbType?: DatabaseType): TableRef[]
```

### 3.2 extractTablesFromSql 改造

```typescript
import { Parser } from 'node-sql-parser'

export class SqlParserService {
  private parser: Parser

  constructor() {
    this.parser = new Parser()
  }

  extractTablesFromSql(sql: string, dbType: DatabaseType = 'mysql'): TableRef[] {
    const dialect = mapToParserDialect(dbType)
    try {
      const ast = this.parser.astify(sql, { database: dialect })
      return this.extractTablesFromAST(ast)
    } catch {
      // AST 解析失败，降级到正则方案
      return this.extractTablesFromSqlRegex(sql)
    }
  }
}
```

### 3.3 extractTablesFromAST 新方法

替换 `extractTablesFromCST`：

```typescript
/**
 * 从 AST 中提取表引用（支持子查询）
 */
private extractTablesFromAST(ast: any): TableRef[] {
  const tables: TableRef[] = []
  const seen = new Set<string>()

  // ast 可能是数组（多条语句）或单个对象
  const stmts = Array.isArray(ast) ? ast : [ast]

  for (const stmt of stmts) {
    if (stmt?.type === 'select') {
      this.extractTablesFromSelectAST(stmt, tables, seen)
    }
  }

  return tables
}

/**
 * 从 SELECT 语句 AST 中提取表引用
 */
private extractTablesFromSelectAST(
  selectAst: any,
  tables: TableRef[],
  seen: Set<string>
): void {
  if (!selectAst?.from) return

  for (const fromItem of selectAst.from) {
    this.extractTableFromFromItem(fromItem, selectAst, tables, seen)
  }
}
```

### 3.4 extractTableFromFromItem 方法

替换 `extractTableFromExpr` / `extractTableFromAlias` / `extractTableFromParenExpr` 等多个方法：

```typescript
/**
 * 从 FROM 项中提取表引用
 */
private extractTableFromFromItem(
  fromItem: any,
  parentAst: any,
  tables: TableRef[],
  seen: Set<string>
): void {
  if (!fromItem) return

  // 子查询
  if (fromItem.expr?.type === 'select') {
    const alias = fromItem.as || null
    const key = (alias || '__subquery__').toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      const subqueryInfo = this.extractSubqueryInfoFromAST(fromItem.expr)
      tables.push({
        name: alias || '__subquery__',
        alias: alias || undefined,
        isSubquery: true,
        subqueryColumns: subqueryInfo.columns,
        subquerySelectsStar: subqueryInfo.selectsStar,
        subqueryInnerTables: subqueryInfo.innerTables
      })
    }
    return
  }

  // 普通表
  if (fromItem.table) {
    const name = fromItem.table
    const alias = fromItem.as || undefined
    const key = (alias || name).toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      tables.push({ name, alias })
    }
  }
}
```

### 3.5 extractSubqueryInfoFromAST 方法

替换 `extractSubqueryInfo`：

```typescript
/**
 * 从子查询 AST 提取列信息
 */
private extractSubqueryInfoFromAST(selectAst: any): {
  columns: string[]
  selectsStar: boolean
  innerTables: string[]
} {
  const columns: string[] = []
  let selectsStar = false
  const innerTables: string[] = []

  // 提取列
  if (selectAst.columns === '*') {
    selectsStar = true
  } else if (Array.isArray(selectAst.columns)) {
    for (const col of selectAst.columns) {
      if (col.as) {
        // SELECT expr AS alias
        columns.push(col.as)
      } else if (col.expr?.type === 'column_ref') {
        // SELECT column_name
        columns.push(col.expr.column)
      } else if (col.expr?.type === 'aggr_func' || col.expr?.type === 'function') {
        // SELECT COUNT(*) → 没有别名则跳过
      }
    }
  }

  // 提取内部表
  if (selectAst.from) {
    for (const fromItem of selectAst.from) {
      if (fromItem.table && !fromItem.expr) {
        innerTables.push(fromItem.table)
      }
    }
  }

  return { columns, selectsStar, innerTables }
}
```

### 3.6 删除的代码

以下方法可以**全部删除**（约 224 行）：

- `extractTablesFromCST()`
- `extractTablesFromFromClause()`
- `extractTableFromExpr()`
- `extractTableFromAlias()`
- `extractTableFromParenExpr()`
- `extractTableFromJoinExpr()`
- `addTableRef()`
- `getIdentifierName()`
- `extractSubqueryInfo()`

以及 `CstNode` 接口定义。

### 3.7 保留不变的代码

以下代码不使用 `sql-parser-cst`，保持不变：

- `analyzeCursorContext()` — 使用正则分析上下文
- `isInComment()` — 自行实现
- `isInString()` — 自行实现
- `extractCurrentStatement()` — 自行实现
- `analyzeContext()` — 使用正则
- 所有 `isIn*Clause()` 方法 — 使用正则
- `findLastKeyword()` — 使用正则
- `resolveTableAlias()` — 调用 `extractTablesFromSql`（自动适配）
- `extractTablesFromSqlRegex()` — 正则降级方案
- `parseTableClause()` — 正则降级方案
- 所有导出的工具函数（`splitStatements`, `isInStringOrComment` 等）

## 4. 调用方适配

### 4.1 CompletionProvider

```typescript
// 当前（第 334 行）
const tables = this.sqlParser.extractTablesFromSql(documentText)

// 改为
const dbType = this.metadataService.getDatabaseType()
const tables = this.sqlParser.extractTablesFromSql(documentText, dbType)
```

涉及以下方法：
- `addColumnSuggestionsForTableDot()`
- `provideCompletionItems()` 中多处 `this.sqlParser.extractTablesFromSql()`

### 4.2 HoverProvider

```typescript
// 当前（第 71 行、126 行）
const tables = this.sqlParser.extractTablesFromSql(sql)

// 改为
const dbType = this.metadataService.getDatabaseType()
const tables = this.sqlParser.extractTablesFromSql(sql, dbType)
```

### 4.3 SqlParserService 内部

```typescript
// resolveTableAlias 内部（第 435 行）
const tables = this.extractTablesFromSql(sql)

// 改为（需要传入 dbType，方法签名也要调整）
private resolveTableAlias(sql: string, alias: string, dbType: DatabaseType = 'mysql'): string | null {
  const tables = this.extractTablesFromSql(sql, dbType)
  // ...
}
```

但 `resolveTableAlias` 是 `analyzeContext` 调用链的一部分，而 `analyzeContext` 已全部使用正则（不依赖 CST），这里调用 `extractTablesFromSql` 是为了解析别名。可以先保持 `'mysql'` 默认值，后续需要时再传入。

## 5. 代码量对比

| 指标 | 改造前 | 改造后 |
|------|--------|--------|
| CST 遍历代码 | ~224 行 | 0 行（删除） |
| AST 提取代码 | 0 行 | ~80 行（新增） |
| 净减少 | — | **~144 行** |
