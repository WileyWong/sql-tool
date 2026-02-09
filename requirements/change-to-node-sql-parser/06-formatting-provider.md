# Phase 5：formattingProvider.ts 改造

## 1. 说明

`formattingProvider.ts` 使用的是 `sql-formatter` 库（不是 `sql-parser-cst`），本身不受解析器替换影响。但它也存在 dialect 硬编码问题（硬编码为 `'mysql'`），需要一并处理。

## 2. 当前代码

```typescript
import { format } from 'sql-formatter'

export class FormattingProvider {
  formatDocument(documentText: string): TextEdit[] {
    const formatted = format(documentText, {
      language: 'mysql',  // ← 硬编码
      // ...
    })
  }
  
  formatRange(documentText: string, range: Range): TextEdit[] {
    const formatted = format(selectedText, {
      language: 'mysql',  // ← 硬编码
      // ...
    })
  }
}
```

## 3. 改造方案

### 3.1 注入 MetadataService

```typescript
import { MetadataService } from '../services/metadataService'
import type { DatabaseType } from '@shared/types'

export class FormattingProvider {
  private metadataService: MetadataService

  constructor(metadataService: MetadataService) {
    this.metadataService = metadataService
  }
}
```

### 3.2 Dialect 映射

`sql-formatter` 支持的 language 值：
- `mysql`
- `mariadb`
- `postgresql`
- `tsql` (SQL Server)
- `sqlite`
- 等

```typescript
private getFormatterLanguage(): string {
  const dbType = this.metadataService.getDatabaseType()
  switch (dbType) {
    case 'sqlserver':
      return 'tsql'
    case 'mysql':
    default:
      return 'mysql'
  }
}
```

### 3.3 使用动态 language

```typescript
formatDocument(documentText: string): TextEdit[] {
  const language = this.getFormatterLanguage()
  const formatted = format(documentText, {
    language,
    tabWidth: 2,
    // ... 其他不变
  })
}

formatRange(documentText: string, range: Range): TextEdit[] {
  const language = this.getFormatterLanguage()
  const formatted = format(selectedText, {
    language,
    // ... 其他不变
  })
}
```

### 3.4 index.ts 联动修改

```typescript
// 当前
formattingProvider = new FormattingProvider()

// 改为
formattingProvider = new FormattingProvider(metadataService)
```

## 4. 改动量评估

- 改动行数：约 15 行
- 风险：低（sql-formatter 对 tsql 支持成熟）
