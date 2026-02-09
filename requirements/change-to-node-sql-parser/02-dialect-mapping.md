# Phase 1：Dialect 映射与基础设施

## 1. 安装依赖

```bash
npm install node-sql-parser
npm uninstall sql-parser-cst  # Phase 6 再执行
```

## 2. Dialect 映射

### 2.1 当前 DatabaseType 定义

```typescript
// src/shared/types/connection.ts
export type DatabaseType = 'mysql' | 'sqlserver'
```

### 2.2 node-sql-parser 支持的 dialect

node-sql-parser 支持以下数据库 dialect：
- `MySQL`
- `MariaDB`
- `PostgreSQL`
- `TransactSQL` (SQL Server)
- `FlinkSQL`
- `BigQuery`
- `Sqlite`
- 等

### 2.3 映射函数

在 `sqlParserService.ts` 中新增 dialect 映射工具函数：

```typescript
import { DatabaseType } from '@shared/types'

/**
 * 将项目的 DatabaseType 映射为 node-sql-parser 的 dialect 名称
 */
export function mapToParserDialect(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlserver':
      return 'TransactSQL'
    case 'mysql':
    default:
      return 'MySQL'
  }
}
```

### 2.4 sql-formatter 的 dialect 映射

`formattingProvider.ts` 使用 `sql-formatter` 库（与 `sql-parser-cst` 无关），也需要 dialect 映射：

```typescript
/**
 * 将项目的 DatabaseType 映射为 sql-formatter 的 language 名称
 */
export function mapToFormatterLanguage(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlserver':
      return 'tsql'
    case 'mysql':
    default:
      return 'mysql'
  }
}
```

## 3. node-sql-parser 基本用法

### 3.1 初始化

```typescript
import { Parser } from 'node-sql-parser'

const parser = new Parser()
```

### 3.2 解析 SQL

```typescript
// 解析为 AST
const ast = parser.astify('SELECT TOP 10 * FROM users', { database: 'TransactSQL' })

// 解析并获取 tableList / columnList
const { ast, tableList, columnList } = parser.parse('SELECT * FROM users', { database: 'TransactSQL' })
// tableList: ["select::null::users"]
// columnList: ["select::null::(.*)"]
```

### 3.3 错误处理

```typescript
try {
  parser.astify(sql, { database: dialect })
} catch (error) {
  // error.message 包含错误位置信息
  // 格式示例: "Syntax error at line 1 column 10"
  // 需要解析 message 提取行列号
}
```

## 4. 传递 dbType 到各 Provider

### 4.1 当前调用链

```
MetadataService.setDatabaseType(dbType)
  ↓ 存储在 metadataService.currentDbType
  
DiagnosticProvider.validate(sql)
  ↓ 硬编码 dialect: 'mysql'

CompletionProvider.shouldProvideCompletion(sql, offset)
  ↓ 硬编码 dialect: 'mysql'

SqlParserService.extractTablesFromSql(sql)
  ↓ 硬编码 dialect: 'mysql'
```

### 4.2 改造后的调用链

```
MetadataService.setDatabaseType(dbType)
  ↓ 存储在 metadataService.currentDbType
  
DiagnosticProvider.validate(sql)
  ↓ 通过注入的 metadataService 获取 dbType → mapToParserDialect()

CompletionProvider.shouldProvideCompletion(sql, offset)
  ↓ 已持有 metadataService → 获取 dbType → mapToParserDialect()

SqlParserService.extractTablesFromSql(sql, dbType?)
  ↓ 参数传入 dbType 或通过注入获取 → mapToParserDialect()
```

### 4.3 index.ts 改动

```typescript
// 当前
diagnosticProvider = new DiagnosticProvider()

// 改为
diagnosticProvider = new DiagnosticProvider(metadataService)
```

SqlParserService 有两种方案：
- **方案 A**（推荐）：在 `extractTablesFromSql` 方法中增加 `dbType` 参数
- **方案 B**：将 MetadataService 注入 SqlParserService 构造函数

推荐方案 A，因为 SqlParserService 在 CompletionProvider 和 HoverProvider 中各自实例化，注入会增加复杂度。
