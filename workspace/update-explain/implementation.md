# 执行计划展示组件改造 - 实现记录

## 变更概要

基于 `requirements/update-explain/requirement.md` 需求文档，完成执行计划展示组件的改造，支持 MySQL 和 SQL Server 两种数据库的执行计划展示。

## 变更文件清单

### 新增文件
| 文件 | 说明 |
|------|------|
| `src/renderer/components/explain/ExplainViewMysql.vue` | MySQL 执行计划展示组件（从原 ExplainView.vue 迁移） |
| `src/renderer/components/explain/ExplainViewSqlServer.vue` | SQL Server 执行计划展示组件（虚拟滚动树形结构） |
| `src/renderer/components/explain/PlanNode.vue` | SQL Server 执行计划节点子组件 |

### 修改文件
| 文件 | 说明 |
|------|------|
| `src/shared/types/query.ts` | 新增 `SqlServerExplainNode` 类型，`ExplainResult` 增加 `databaseType`/`truncated`/`totalCount` 字段 |
| `src/main/database/mysql/session.ts` | `explainQuery` 返回增加 `databaseType: 'mysql'` |
| `src/main/database/sqlserver/session.ts` | `explainQuery` 从 `SHOWPLAN_TEXT` 改为 `SHOWPLAN_XML`，后端解析为结构化树 |
| `src/renderer/components/ExplainView.vue` | 改为入口分发组件，根据 `databaseType` 路由到对应子组件 |
| `package.json` | 新增 `fast-xml-parser` 依赖 |

### 删除文件
| 文件 | 说明 |
|------|------|
| `src/main/database/query-executor.ts` | 遗留文件，无任何源码引用，已被 session 模式完全替代 |

## 实现要点

### 1. 类型定义改造 (`query.ts`)
- 新增 `SqlServerExplainNode` 接口，包含 `physicalOp`、`logicalOp`、`estimateRows`、`estimatedTotalSubtreeCost` 等字段
- `ExplainResult.nodes` 类型改为联合类型 `ExplainNode[] | SqlServerExplainNode[]`
- `ExplainResult.raw` 支持 `Record<string, unknown>[]`（MySQL）和 `string`（SQL Server XML）
- 新增 `databaseType`、`truncated`、`totalCount` 字段

### 2. SQL Server 后端改造 (`sqlserver/session.ts`)
- 使用 `SET SHOWPLAN_XML ON/OFF` 替代 `SET SHOWPLAN_TEXT ON/OFF`
- 引入 `fast-xml-parser` 在主进程解析 XML，避免大体积 XML 通过 IPC 传输
- `parseShowPlanXML` 方法递归提取 `RelOp` 节点，采用**通用遍历策略**（非硬编码操作符列表）
- 节点数限制 2000，超出截断并返回警告
- 原始 XML > 1MB 时不传输到前端
- `RunTimeCountersPerThread` 支持数组（并行查询多线程求和）

### 3. 前端组件拆分
- `ExplainView.vue` → 入口分发组件，根据 `databaseType` 渲染对应子组件
- `explain/ExplainViewMysql.vue` → 从原组件迁移，增加 `rawData` 类型守卫
- `explain/ExplainViewSqlServer.vue` → 使用 `@tanstack/vue-virtual` 虚拟滚动，树形平铺展示
- `explain/PlanNode.vue` → 节点子组件，带 Tooltip 详细信息

### 4. 相对于需求文档的改进
- **RelOp 递归解析**：采用通用遍历（遍历所有子属性寻找 RelOp），而非硬编码操作符列表，扩展性更好
- **RunTimeCountersPerThread**：支持并行查询场景（数组求和）
- **类型安全**：SQL Server 组件内使用 `as SqlServerExplainNode[]` 类型断言
- **响应式虚拟滚动**：展开/折叠时通过创建新 Set 触发响应式更新
