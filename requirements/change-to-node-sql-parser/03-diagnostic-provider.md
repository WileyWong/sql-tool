# Phase 2：diagnosticProvider.ts 改造

## 1. 当前实现

```typescript
// providers/diagnosticProvider.ts
import { parse } from 'sql-parser-cst'

export class DiagnosticProvider {
  validate(documentText: string): Diagnostic[] {
    // ...
    for (const stmt of statements) {
      try {
        parse(stmt.text, { dialect: 'mysql' })  // ← 硬编码 mysql
      } catch (error: any) {
        const diagnostic = this.createDiagnostic(error, stmt, documentText)
        // ...
      }
    }
  }
}
```

### 问题
1. dialect 硬编码为 `'mysql'`
2. T-SQL 语法（如 `TOP`、`WITH (NOLOCK)`）被误报为语法错误

## 2. 改造方案

### 2.1 构造函数注入 MetadataService

```typescript
import { Parser } from 'node-sql-parser'
import { MetadataService } from '../services/metadataService'
import { mapToParserDialect } from '../services/sqlParserService'

export class DiagnosticProvider {
  private metadataService: MetadataService
  private parser: Parser

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
    this.parser = new Parser()
  }
}
```

### 2.2 validate 方法改造

```typescript
validate(documentText: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const dbType = this.metadataService.getDatabaseType()
  const dialect = mapToParserDialect(dbType)
  
  const statements = splitStatements(documentText)

  for (const stmt of statements) {
    if (!stmt.text.trim()) continue

    try {
      this.parser.astify(stmt.text, { database: dialect })
    } catch (error: any) {
      const diagnostic = this.createDiagnostic(error, stmt, documentText)
      if (diagnostic) {
        diagnostics.push(diagnostic)
      }
    }
  }

  return diagnostics
}
```

### 2.3 createDiagnostic 方法适配

**node-sql-parser 的错误格式**不同于 sql-parser-cst：

- sql-parser-cst: `error.location = { start: { offset, line, column }, end: { ... } }`
- node-sql-parser: 错误信息在 `error.message` 中，包含 `line X column Y`，同时 `error.location` 可能包含位置信息

需要适配错误位置提取逻辑：

```typescript
private createDiagnostic(
  error: any,
  stmt: { text: string; start: number; end: number },
  fullText: string
): Diagnostic | null {
  let errorOffset = stmt.start
  let errorLength = 1

  // node-sql-parser 错误位置提取
  if (error.location) {
    // 如果有 location 属性
    const loc = error.location
    if (loc.start) {
      errorOffset = stmt.start + (loc.start.offset || 0)
    }
    if (loc.end && loc.start) {
      errorLength = (loc.end.offset || 0) - (loc.start.offset || 0)
    }
  } else if (error.message) {
    // 从错误消息中提取位置: "... at line X column Y"
    const posMatch = error.message.match(/line\s+(\d+)\s+column\s+(\d+)/i)
    if (posMatch) {
      const errorLine = parseInt(posMatch[1], 10) - 1
      const errorCol = parseInt(posMatch[2], 10) - 1
      // 将行列转换为偏移量
      errorOffset = stmt.start + this.lineColToOffset(stmt.text, errorLine, errorCol)
    }
  }

  errorLength = Math.max(1, errorLength)
  const range = this.offsetToRange(fullText, errorOffset, errorLength)

  let message = error.message || '语法错误'
  message = this.cleanErrorMessage(message)

  return {
    severity: DiagnosticSeverity.Error,
    range,
    message,
    source: 'sql'
  }
}
```

### 2.4 新增辅助方法

```typescript
/**
 * 行列号转偏移量
 */
private lineColToOffset(text: string, line: number, col: number): number {
  const lines = text.split('\n')
  let offset = 0
  for (let i = 0; i < line && i < lines.length; i++) {
    offset += lines[i].length + 1
  }
  offset += col
  return Math.min(offset, text.length)
}
```

### 2.5 cleanErrorMessage 适配

node-sql-parser 的错误消息格式不同，需要更新清理规则：

```typescript
private cleanErrorMessage(message: string): string {
  let cleaned = message

  // 移除位置信息前缀
  cleaned = cleaned.replace(/^Syntax error at line \d+ column \d+\s*/i, '')
  
  // 替换常见的技术术语
  cleaned = cleaned.replace(/Unexpected token/gi, '意外的符号')
  cleaned = cleaned.replace(/Expected/gi, '期望')
  cleaned = cleaned.replace(/but found/gi, '但发现')
  cleaned = cleaned.replace(/end of input/gi, '输入结束')
  cleaned = cleaned.replace(/identifier/gi, '标识符')
  cleaned = cleaned.replace(/keyword/gi, '关键字')
  cleaned = cleaned.replace(/string/gi, '字符串')
  cleaned = cleaned.replace(/number/gi, '数字')

  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 200) + '...'
  }

  return cleaned
}
```

## 3. index.ts 联动修改

```typescript
// 当前
diagnosticProvider = new DiagnosticProvider()

// 改为
diagnosticProvider = new DiagnosticProvider(metadataService)
```
