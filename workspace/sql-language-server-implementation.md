# SQL Language Server 实现方案

## 1. 方案概述

### 1.1 选型决策

| 方案 | 描述 | 优劣 |
|------|------|------|
| ~~C1: sql-parser-cst 纯前端~~ | 在 Renderer 进程直接解析 | 简单但功能分散 |
| **C2: monaco-languageclient + LSP** | 标准 Language Server 架构 | ✅ 采用：架构规范，功能集中 |

### 1.2 核心价值

- **统一架构**：所有智能功能（补全、诊断、格式化、悬浮）在一个 Language Server 中实现
- **状态共享**：SQL 解析结果在 Server 内部自然共享，避免重复解析
- **可扩展**：未来可轻松添加跳转定义、重构等功能
- **标准协议**：遵循 LSP 标准，架构清晰

---

## 2. 技术架构

```
┌──────────────────────────────────────────────────────────────┐
│                     Renderer 进程                             │
│  ┌────────────────┐         ┌─────────────────────────────┐  │
│  │ Monaco Editor  │ ◄─────► │ monaco-languageclient       │  │
│  │                │         │ (Language Client)           │  │
│  └────────────────┘         └─────────────────────────────┘  │
│                                        │                      │
│                                        │ IPC (JSON-RPC)       │
└────────────────────────────────────────│──────────────────────┘
                                         │
┌────────────────────────────────────────│──────────────────────┐
│                      Main 进程          │                      │
│                                        ▼                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              SQL Language Server                         │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │ Providers                                           ││ │
│  │  │ - CompletionProvider (自动补全)                     ││ │
│  │  │ - DiagnosticProvider (语法诊断)                     ││ │
│  │  │ - HoverProvider (悬浮提示)                          ││ │
│  │  │ - FormattingProvider (代码格式化)                   ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │ Services                                            ││ │
│  │  │ - SqlParserService (SQL 解析)                       ││ │
│  │  │ - MetadataService (元数据管理)                      ││ │
│  │  │ - ContextAnalyzer (上下文分析)                      ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                                │
│                              ▼                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ connectionStore (数据库元数据)                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. 依赖包

```bash
npm install monaco-languageclient vscode-languageclient vscode-languageserver vscode-languageserver-textdocument vscode-jsonrpc sql-parser-cst sql-formatter
```

| 包名 | 版本 | 用途 |
|------|------|------|
| monaco-languageclient | ^8.1.1 | Monaco 与 LSP 的桥接 |
| vscode-languageclient | ^9.0.1 | LSP 客户端实现 |
| vscode-languageserver | ^9.0.1 | LSP 服务端框架 |
| vscode-languageserver-textdocument | ^1.0.11 | 文档管理 |
| vscode-jsonrpc | ^8.2.0 | JSON-RPC 通信 |
| sql-parser-cst | ^0.27.0 | SQL 解析器 |
| sql-formatter | ^15.3.0 | SQL 格式化 |

---

## 4. 目录结构

```
src/
├── main/
│   ├── index.ts                          # Main 进程入口
│   └── sql-language-server/
│       ├── index.ts                      # Language Server 入口
│       ├── server.ts                     # LSP Server 核心实现
│       ├── providers/
│       │   ├── completionProvider.ts     # 自动补全
│       │   ├── diagnosticProvider.ts     # 语法诊断
│       │   ├── hoverProvider.ts          # 悬浮提示
│       │   └── formattingProvider.ts     # 代码格式化
│       ├── services/
│       │   ├── sqlParserService.ts       # SQL 解析服务
│       │   ├── metadataService.ts        # 元数据服务
│       │   └── contextAnalyzer.ts        # 上下文分析器
│       └── types/
│           └── index.ts                  # 类型定义
│
├── renderer/
│   ├── components/
│   │   └── SqlEditor.vue                 # SQL 编辑器组件
│   └── services/
│       └── languageClient.ts             # Language Client 初始化
```

---

## 5. 实现计划

### Phase 1: 基础架构 (Day 1-2)

**目标**：建立 Language Server 与 Monaco Editor 的通信

**任务**：
1. 安装依赖包
2. 创建 `src/main/sql-language-server/` 目录结构
3. 实现 `server.ts` - LSP Server 基础框架
4. 实现 `languageClient.ts` - Renderer 端初始化
5. 修改 `SqlEditor.vue` - 集成 Language Client
6. 建立 IPC 通信通道
7. 验证基础通信

**验收标准**：
- [ ] Language Server 成功启动
- [ ] Monaco Editor 连接到 Language Server
- [ ] 控制台无报错

### Phase 2: 自动补全 (Day 3-4)

**目标**：实现智能自动补全功能

**任务**：
1. 实现 `SqlParserService` - SQL 解析与上下文分析
2. 实现 `MetadataService` - 从 connectionStore 获取元数据
3. 实现 `CompletionProvider` - 补全建议生成
4. 处理所有联想场景（见需求文档 3.1）
5. 集成测试

**验收标准**：
- [ ] FROM/JOIN 后提示表名
- [ ] 表名.后提示字段
- [ ] WHERE/ON 后提示字段和函数
- [ ] 注释内不提示
- [ ] 子查询字段正确识别

### Phase 3: 语法诊断 (Day 5)

**目标**：实现实时语法错误检测

**任务**：
1. 实现 `DiagnosticProvider` - 语法检查
2. 实现错误位置定位
3. 实现红色波浪线显示
4. 实现悬浮错误提示

**验收标准**：
- [ ] 语法错误显示红色波浪线
- [ ] 悬浮显示错误详情
- [ ] 错误位置准确

### Phase 4: 辅助功能 (Day 6-7)

**目标**：实现格式化和悬浮提示

**任务**：
1. 实现 `FormattingProvider` - 代码格式化
2. 实现 `HoverProvider` - 悬浮提示
3. 完善边界情况处理
4. 性能优化

**验收标准**：
- [ ] Shift+Alt+F 格式化代码
- [ ] 悬浮显示表/字段信息
- [ ] 性能流畅，无卡顿

---

## 6. 关键代码示例

### 6.1 Language Server 入口

```typescript
// src/main/sql-language-server/server.ts
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
} from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { CompletionProvider } from './providers/completionProvider'
import { DiagnosticProvider } from './providers/diagnosticProvider'
import { MetadataService } from './services/metadataService'

// 创建连接
const connection = createConnection(ProposedFeatures.all)
const documents = new TextDocuments(TextDocument)

// 服务实例
let metadataService: MetadataService
let completionProvider: CompletionProvider
let diagnosticProvider: DiagnosticProvider

connection.onInitialize((params: InitializeParams): InitializeResult => {
  metadataService = new MetadataService()
  completionProvider = new CompletionProvider(metadataService)
  diagnosticProvider = new DiagnosticProvider()

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['.', ' ', '\n']
      },
      hoverProvider: true,
      documentFormattingProvider: true
    }
  }
})

// 自动补全
connection.onCompletion(async (params) => {
  const document = documents.get(params.textDocument.uri)
  if (!document) return []
  return completionProvider.provideCompletionItems(params, document.getText())
})

// 文档变化时进行诊断
documents.onDidChangeContent(async (change) => {
  const diagnostics = await diagnosticProvider.validate(change.document)
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics })
})

documents.listen(connection)
connection.listen()
```

### 6.2 Language Client 初始化

```typescript
// src/renderer/services/languageClient.ts
import { MonacoLanguageClient } from 'monaco-languageclient'
import { CloseAction, ErrorAction } from 'vscode-languageclient'

export async function initLanguageClient(): Promise<MonacoLanguageClient> {
  const client = new MonacoLanguageClient({
    name: 'SQL Language Client',
    clientOptions: {
      documentSelector: [{ language: 'sql' }],
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.Restart })
      }
    },
    connectionProvider: {
      get: async () => {
        // 通过 IPC 连接到 Main 进程的 Language Server
        return createIpcConnection()
      }
    }
  })

  await client.start()
  return client
}
```

---

## 7. 测试用例

| ID | 场景 | 输入 | 期望结果 |
|----|------|------|----------|
| TC01 | 空语句 | `s` | 显示 SELECT, SET, SHOW 等 |
| TC02 | FROM 后 | `SELECT * FROM ` | 显示所有表、视图 |
| TC03 | 表名.后 | `SELECT * FROM users u WHERE u.` | 显示 users 表的字段 |
| TC04 | JOIN ON | `SELECT * FROM t1 JOIN t2 ON ` | 显示 t1, t2 的字段 |
| TC05 | 注释内 | `-- SELECT ` | 无建议 |
| TC06 | 块注释 | `/* SELECT */` | 无建议 |
| TC07 | 子查询显式列 | `SELECT * FROM (SELECT id, name FROM users) sub WHERE sub.` | 显示 id, name |
| TC08 | 子查询 SELECT * | `SELECT * FROM (SELECT * FROM users) a WHERE ` | 显示 users 表的所有字段 |
| TC09 | 子查询别名. | `SELECT * FROM (SELECT * FROM users) a WHERE a.` | 显示 users 表的所有字段 |
| TC10 | 外层 SELECT 列 | `SELECT  FROM (SELECT * FROM users) a` | 显示 users 表的字段（光标在 SELECT 后） |
| TC11 | 语法错误 | `SELEC * FROM users` | SELEC 下显示红色波浪线 |
| TC12 | 格式化 | 按 Shift+Alt+F | SQL 代码格式化 |
| TC13 | 悬浮 | 鼠标悬停在表名上 | 显示表信息 |

---

## 8. 子查询支持实现

### 8.1 技术方案

使用 `sql-parser-cst` 解析 SQL 的 CST（Concrete Syntax Tree），精确识别子查询结构：

```
select * from (select * from bresume_group) a where
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ select_stmt                                         │
│ ├── select_clause: [all_columns (*)]               │
│ ├── from_clause:                                   │
│ │   └── alias                                      │
│ │       ├── expr: paren_expr                       │
│ │       │   └── select_stmt (子查询)               │
│ │       │       ├── select_clause: [all_columns]   │
│ │       │       └── from_clause: bresume_group     │
│ │       └── alias: identifier("a")                 │
│ └── where_clause: ...                              │
└─────────────────────────────────────────────────────┘
```

### 8.2 TableRef 类型扩展

```typescript
interface TableRef {
  name: string
  alias?: string
  database?: string
  /** 是否是子查询 */
  isSubquery?: boolean
  /** 子查询的列（显式列名或 * 展开后的列） */
  subqueryColumns?: string[]
  /** 子查询是否使用 SELECT * */
  subquerySelectsStar?: boolean
  /** 子查询内部的表名（用于 SELECT * 时获取字段） */
  subqueryInnerTables?: string[]
}
```

### 8.3 处理流程

1. **CST 解析**：使用 `sql-parser-cst` 解析 SQL
2. **子查询识别**：在 FROM 子句中识别 `(SELECT ...) alias` 模式
3. **字段提取**：
   - 显式列：直接提取 SELECT 子句中的列名
   - SELECT *：记录内部表名，运行时从 MetadataService 获取字段
4. **降级方案**：CST 解析失败时，降级到正则匹配

### 8.4 关键代码

```typescript
// SqlParserService.extractTablesFromSql
extractTablesFromSql(sql: string): TableRef[] {
  try {
    const cst = parse(sql, { dialect: 'mysql', includeRange: true })
    return this.extractTablesFromCST(cst)
  } catch {
    // CST 解析失败，降级到正则方案
    return this.extractTablesFromSqlRegex(sql)
  }
}

// CompletionProvider.addColumnSuggestionsForTables
if (tableRef.isSubquery) {
  // 处理子查询
  if (tableRef.subqueryColumns?.length > 0) {
    // 使用显式列名
  }
  if (tableRef.subquerySelectsStar && tableRef.subqueryInnerTables) {
    // 从内部表获取字段
    for (const innerTable of tableRef.subqueryInnerTables) {
      const columns = metadataService.getColumns(innerTable)
      // 添加字段建议
    }
  }
}
```

---

## 9. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| sql-parser-cst 解析失败 | 补全不准确 | 实现降级正则匹配 |
| IPC 通信延迟 | 补全响应慢 | 添加防抖、缓存 |
| 大型 SQL 解析慢 | 性能问题 | 只解析当前语句 |
| 元数据未加载 | 无法补全 | 按需加载 + 提示用户 |

---

## 10. 参考资料

- [Language Server Protocol 规范](https://microsoft.github.io/language-server-protocol/)
- [monaco-languageclient 文档](https://github.com/TypeFox/monaco-languageclient)
- [sql-parser-cst 文档](https://github.com/nene/sql-parser-cst)
- [vscode-languageserver 文档](https://github.com/microsoft/vscode-languageserver-node)
