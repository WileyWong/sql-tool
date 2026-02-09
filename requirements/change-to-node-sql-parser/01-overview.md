# 迁移方案：sql-parser-cst → node-sql-parser

## 1. 背景

当前项目使用 `sql-parser-cst` 库进行 SQL 语法解析，该库仅支持以下 5 种方言：
- `sqlite`
- `mysql`
- `mariadb`
- `bigquery`
- `postgresql`

**不支持 SQL Server (T-SQL)**，导致编辑 MSSQL 语句（如 `SELECT TOP 10 * FROM table`）时出现误报的语法错误红色波浪线。

## 2. 目标

将 SQL 解析器从 `sql-parser-cst` 替换为 `node-sql-parser`，使项目同时支持 MySQL 和 T-SQL 的语法解析、诊断和补全。

## 3. 库对比

| 维度 | sql-parser-cst (当前) | node-sql-parser (目标) |
|------|----------------------|----------------------|
| T-SQL 支持 | ❌ 不支持 | ✅ 支持 (`TransactSQL` dialect) |
| MySQL 支持 | ✅ | ✅ |
| PostgreSQL 支持 | ✅ | ✅ |
| 输出格式 | CST (具体语法树) | AST (抽象语法树) |
| 包体积 (min+gzip) | ~40-50 KB | ~77 KB |
| 可按 dialect 单独导入 | ❌ | ✅ `require('node-sql-parser/build/transactsql')` |
| 内置表/列提取 | ❌ 需手动 cstVisitor 遍历 | ✅ `parser.tableList()` / `parser.columnList()` |
| 错误位置信息 | ✅ `error.location` | ✅ 错误信息中包含行列位置 |
| cstVisitor 遍历 | ✅ 有内置 visitor | ❌ 需手动遍历 AST JSON |

## 4. 影响范围

### 4.1 需修改的文件（使用 sql-parser-cst）

| 文件 | 使用方式 | 改动量 |
|------|---------|--------|
| `providers/diagnosticProvider.ts` | `parse()` 做语法验证 | 小 |
| `providers/completionProvider.ts` | `parse()` 判断注释/字符串位置 | 小 |
| `services/sqlParserService.ts` | `parse()` + `cstVisitor()` 提取表引用 | 中等 |

### 4.2 需适配的文件

| 文件 | 改动说明 | 改动量 |
|------|---------|--------|
| `index.ts` | DiagnosticProvider 构造注入 MetadataService | 小 |
| `providers/formattingProvider.ts` | 使用 `sql-formatter`，非 `sql-parser-cst`，需单独处理 dialect | 小 |

### 4.3 不受影响的文件

| 文件 | 说明 |
|------|------|
| `services/metadataService.ts` | 已正确处理 dbType，无需修改 |
| `providers/hoverProvider.ts` | 间接调用 `sqlParserService.extractTablesFromSql()`，无需修改 |
| `types/index.ts` | 类型定义不变 |

## 5. 迁移策略

采用**渐进式替换**策略：

1. **Phase 1**：安装 `node-sql-parser`，新增 dialect 映射工具函数
2. **Phase 2**：替换 `diagnosticProvider.ts`（语法验证）
3. **Phase 3**：替换 `completionProvider.ts`（注释/字符串检测）
4. **Phase 4**：替换 `sqlParserService.ts`（表引用提取，最核心）
5. **Phase 5**：适配 `formattingProvider.ts` 的 dialect
6. **Phase 6**：卸载 `sql-parser-cst`

## 6. 风险评估

| 风险 | 说明 | 等级 | 缓解措施 |
|------|------|------|---------|
| AST 结构差异 | CST 保留语法细节，AST 抽象，边界场景可能丢失信息 | 🟡 中 | 充分测试子查询、别名场景 |
| 子查询列提取 | 当前 cstVisitor 精确遍历，换 AST 后需重新实现 | 🟡 中 | 利用 AST 结构化特性简化逻辑 |
| 错误消息格式 | 新库错误信息格式不同 | 🟢 低 | 适配 `cleanErrorMessage` |
| 包体积增大 | 约增加 30KB gzip | 🟢 低 | Electron 应用影响微小 |
| MySQL 回归 | MySQL 语法验证行为可能微妙变化 | 🟡 中 | 对比测试常见 SQL 模式 |

## 7. 估计工时

| 阶段 | 工时 |
|------|------|
| Phase 1: 基础设施 | 0.5h |
| Phase 2: diagnosticProvider | 1h |
| Phase 3: completionProvider | 1h |
| Phase 4: sqlParserService | 2-3h |
| Phase 5: formattingProvider | 0.5h |
| Phase 6: 清理 & 测试 | 1h |
| **总计** | **6-7h** |
