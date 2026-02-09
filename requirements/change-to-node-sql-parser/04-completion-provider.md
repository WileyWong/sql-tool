# Phase 3：completionProvider.ts 改造

## 1. 当前使用 sql-parser-cst 的位置

仅在 `shouldProvideCompletion()` 方法中使用（第 494-551 行），用于判断光标是否在注释或字符串内：

```typescript
import { parse } from 'sql-parser-cst'

// shouldProvideCompletion() 内部
try {
  const cst = parse(documentText, {
    dialect: 'mysql',        // ← 硬编码
    includeRange: true,
    includeComments: true
  })
  const node = this.findNodeAtOffset(cst, offset)
  if (node?.type === 'line_comment' || node?.type === 'block_comment') return false
  if (node?.type === 'string_literal' || node?.type === 'string') return false
  return true
} catch {
  // 降级到正则方案
  if (isInStringOrComment(textBefore)) return false
  return true
}
```

## 2. 改造方案

### 2.1 方案选择

**推荐方案：直接使用正则降级方案，移除 CST 依赖**

原因：
1. `shouldProvideCompletion` 方法本身已有完善的正则降级逻辑（`isInStringOrComment`）
2. CST 解析在此处的增量价值很小（仅在 SQL 完全合法时才能解析成功）
3. 用户正在输入的 SQL 通常是不完整的，parse 大概率失败走 catch 分支
4. 移除此处的 parse 调用可以减少不必要的性能开销

### 2.2 改造后代码

```typescript
// 移除 import
// import { parse } from 'sql-parser-cst'  ← 删除

/**
 * 判断是否应该提供补全
 */
private shouldProvideCompletion(documentText: string, offset: number): boolean {
  const textBefore = documentText.substring(0, offset)

  // 如果光标前完全没有内容或只有空白，不补全
  const trimmedBefore = textBefore.trim()
  if (!trimmedBefore) {
    return false
  }

  // 检查是否在语句结束后（分号后只有空白）
  const lastSemicolonPos = findLastSemicolonPosition(textBefore)
  if (lastSemicolonPos !== -1) {
    const afterSemicolon = textBefore.substring(lastSemicolonPos + 1)
    if (!afterSemicolon.trim()) {
      return false
    }
  }

  // 如果最后一个有效字符是分号，不补全
  if (trimmedBefore.endsWith(';')) {
    return false
  }

  // 检查是否在字符串或注释内
  if (isInStringOrComment(textBefore)) {
    return false
  }

  // 其他情况允许补全
  return true
}
```

### 2.3 同步删除的代码

删除 `findNodeAtOffset` 方法（第 556-582 行），该方法仅被 `shouldProvideCompletion` 使用。

### 2.4 其他注意事项

- `CompletionProvider` 构造函数中已有 `this.metadataService`，后续 `sqlParserService.extractTablesFromSql()` 改造时可通过此传递 dbType
- 第 56 行注释 `// 使用 sql-parser-cst 检查是否应该提供补全` 需更新
