# 编辑器独占连接改造方案

> 版本: v1.0  
> 日期: 2026-02-09  
> 状态: 设计中

## 一、问题分析

### 1.1 现状

| 驱动 | 连接模型 | 问题 |
|------|---------|------|
| MySQL (`mysql/driver.ts`) | 每个 `connectionId` 一个 `mysql2/promise.Connection` 单连接 | 多个 Tab 共享同一物理连接，Tab A 创建的临时表在 Tab B 中可见；SET 变量互相干扰；事务状态跨 Tab 泄露 |
| SQL Server (`sqlserver/driver.ts`) | 每个 `connectionId` 一个 `mssql.ConnectionPool` 连接池 | 每次 `pool.request()` 可能取到不同物理连接，SET 语句和临时表在下一次 request 中不可见 |

两种驱动都无法正确支持**编辑器 Tab 级别的会话隔离**。

### 1.2 业界标准

Navicat、DBeaver、DataGrip、SSMS 等主流 SQL 客户端均采用**每个查询 Tab 独占一个数据库物理连接**的模式：
- 每个 Tab 拥有独立的数据库会话
- 临时表、SET 变量、事务仅在当前 Tab 内有效
- 关闭 Tab 时自动释放连接
- 系统操作（查表、列信息等）使用独立的共享连接/连接池

---

## 二、总体方案

### 2.1 架构概述

将现有的 driver 拆分为两层：

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IPC Layer                                   │
│  connection.ts   database.ts   query.ts (需新增 tabId 参数)         │
└────────┬──────────────┬──────────────┬──────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌────────────────┐ ┌──────────┐ ┌──────────────────────────────────┐
│  IDatabaseDriver│ │Driver    │ │ ISessionManager                  │
│  (系统操作接口) │ │(系统操作) │ │ (用户查询会话接口)                │
│                │ │ 使用共享  │ │ 每个 Tab 独占物理连接             │
│                │ │ 连接/池   │ │                                  │
└────────────────┘ └──────────┘ └──────────────────────────────────┘
```

### 2.2 核心设计原则

1. **Tab 独占连接**：每个编辑器 Tab 独占一个物理数据库连接，保证会话隔离
2. **系统操作共享连接**：元数据查询（查表、列、索引等）使用共享连接/连接池，用完即放
3. **连接限额**：按 `connectionId`（服务器）维度限制最大编辑器连接数，默认 20
4. **生命周期绑定**：Tab 打开时分配连接，Tab 关闭时释放连接
5. **异常重连**：连接断开时自动重连，并通知前端会话状态已重置
6. **代码分离**：系统操作代码与用户查询代码分离到不同文件

---

## 三、详细设计

### 3.1 文件结构变更

```
src/main/database/
  core/
    index.ts               # 导出汇总（更新）
    interface.ts           # IDatabaseDriver 接口（保留，系统操作）
    session-interface.ts   # [新增] ISessionManager 接口（用户查询）
    factory.ts             # DriverFactory（更新，增加 SessionManager 注册）
    config-store.ts        # 连接配置存储（保留）
  mysql/
    index.ts               # 导出汇总（更新）
    driver.ts              # [瘦身] 仅保留系统操作（元数据查询 + 共享连接管理）
    session.ts             # [新增] MySQL 会话管理（Tab 独占连接 + 用户查询执行）
  sqlserver/
    index.ts               # 导出汇总（更新）
    driver.ts              # [瘦身] 仅保留系统操作（元数据查询 + 共享连接池管理）
    session.ts             # [新增] SQL Server 会话管理（Tab 独占连接 + 用户查询执行）
  connection-manager.ts    # [删除] 旧版遗留代码
  query-executor.ts        # [删除] 旧版遗留代码
```

### 3.2 接口设计

#### 3.2.1 ISessionManager 接口（新增）

```typescript
// core/session-interface.ts

/**
 * 会话连接状态
 */
export interface SessionInfo {
  tabId: string
  connectionId: string
  database?: string
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
}

/**
 * 数据库会话管理器接口
 * 每个编辑器 Tab 独占一个物理数据库连接
 */
export interface ISessionManager {
  readonly type: string

  /**
   * 为 Tab 创建独占会话连接
   * @param tabId 编辑器 Tab ID
   * @param connectionId 服务器连接 ID（用于获取连接配置）
   * @param database 初始数据库
   * @throws 连接数达到上限时抛出错误
   */
  createSession(tabId: string, connectionId: string, database?: string): Promise<void>

  /**
   * 销毁 Tab 的会话连接
   * 释放物理连接，清理所有相关资源
   */
  destroySession(tabId: string): Promise<void>

  /**
   * 销毁某个服务器下的所有会话
   * 用于断开服务器连接时的批量清理
   */
  destroySessionsByConnection(connectionId: string): Promise<void>

  /**
   * 销毁所有会话
   */
  destroyAllSessions(): Promise<void>

  /**
   * 获取会话信息
   */
  getSessionInfo(tabId: string): SessionInfo | undefined

  /**
   * 获取某个服务器的活跃会话数
   */
  getSessionCount(connectionId: string): number

  /**
   * 检查会话是否有效
   */
  isSessionActive(tabId: string): Promise<boolean>

  /**
   * 在 Tab 的独占连接上执行查询
   */
  executeQuery(
    tabId: string,
    sql: string,
    options?: QueryOptions
  ): Promise<QueryResult[]>

  /**
   * 取消 Tab 正在执行的查询
   */
  cancelQuery(tabId: string): Promise<boolean>

  /**
   * 获取执行计划
   */
  explainQuery(
    tabId: string,
    sql: string,
    currentDatabase?: string
  ): Promise<ExplainResult | QueryError>

  /**
   * 批量执行 SQL（在 Tab 的独占连接上，使用事务）
   */
  executeBatch(
    tabId: string,
    sqls: string[]
  ): Promise<{
    success: boolean
    message?: string
    results?: Array<{ sql: string; affectedRows: number }>
  }>

  /**
   * 执行 DDL（在 Tab 的独占连接上）
   */
  executeDDL(tabId: string, sql: string): Promise<{ success: boolean; message?: string }>
}
```

#### 3.2.2 IDatabaseDriver 接口（瘦身）

保留现有 `IDatabaseDriver` 接口，但移除用户查询相关方法。移除的方法：
- `executeQuery` → 移至 `ISessionManager`
- `cancelQuery` → 移至 `ISessionManager`
- `explainQuery` → 移至 `ISessionManager`
- `executeBatch` → 移至 `ISessionManager`
- `executeDDL` → 移至 `ISessionManager`

保留的方法（系统操作）：
- `testConnection` / `connect` / `disconnect` / `disconnectAll` / `isConnected` / `getVersion`
- `getDatabases` / `getTables` / `getTablesWithColumns` / `getColumns`
- `getViews` / `getFunctions` / `getIndexes` / `getTableCreateSql`
- `getCharsets` / `getCollations` / `getEngines` / `getDefaultCharset` / `getSchemas`

### 3.3 MySQL 会话管理实现

```typescript
// mysql/session.ts

interface MySQLSession {
  tabId: string
  connectionId: string
  connection: mysql.Connection   // 独占物理连接
  database?: string
  config: ConnectionConfig
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
  runningQueryThreadId?: number  // 用于取消查询
}

export class MySQLSessionManager implements ISessionManager {
  readonly type = 'mysql'

  // tabId → 会话
  private sessions = new Map<string, MySQLSession>()

  // connectionId → Set<tabId>（反向索引，用于批量清理）
  private connectionSessions = new Map<string, Set<string>>()

  // 每个服务器的最大会话数
  private maxSessionsPerConnection = 20

  async createSession(tabId: string, connectionId: string, database?: string): Promise<void> {
    // 1. 检查连接限额
    const currentCount = this.getSessionCount(connectionId)
    if (currentCount >= this.maxSessionsPerConnection) {
      throw new Error(`已达到最大连接数限制(${this.maxSessionsPerConnection})，请关闭部分编辑器后重试`)
    }

    // 2. 如果该 Tab 已有会话，先销毁
    if (this.sessions.has(tabId)) {
      await this.destroySession(tabId)
    }

    // 3. 获取连接配置
    const config = getConnectionConfig(connectionId)
    if (!config) throw new Error('连接配置不存在')

    // 4. 创建独占物理连接
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: database || config.database || undefined,
      connectTimeout: Defaults.CONNECTION_TIMEOUT
    })

    // 5. 注册会话
    const session: MySQLSession = {
      tabId,
      connectionId,
      connection,
      database,
      config,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      status: 'active'
    }
    this.sessions.set(tabId, session)

    // 6. 更新反向索引
    if (!this.connectionSessions.has(connectionId)) {
      this.connectionSessions.set(connectionId, new Set())
    }
    this.connectionSessions.get(connectionId)!.add(tabId)
  }

  async destroySession(tabId: string): Promise<void> {
    const session = this.sessions.get(tabId)
    if (!session) return

    // 1. 关闭物理连接
    try {
      await session.connection.end()
    } catch {
      // 忽略关闭错误
    }

    // 2. 清理反向索引
    this.connectionSessions.get(session.connectionId)?.delete(tabId)
    if (this.connectionSessions.get(session.connectionId)?.size === 0) {
      this.connectionSessions.delete(session.connectionId)
    }

    // 3. 移除会话
    this.sessions.delete(tabId)
  }

  // executeQuery 逻辑从 driver.ts 中迁移，使用 session.connection 执行
  // ...
}
```

### 3.4 SQL Server 会话管理实现

```typescript
// sqlserver/session.ts

interface SqlServerSession {
  tabId: string
  connectionId: string
  pool: sql.ConnectionPool      // 独占连接池 (min:1, max:1)
  database?: string
  config: ConnectionConfig
  createdAt: number
  lastActiveAt: number
  status: 'active' | 'reconnecting' | 'disconnected'
  runningRequest?: sql.Request  // 用于取消查询
}

export class SqlServerSessionManager implements ISessionManager {
  readonly type = 'sqlserver'

  private sessions = new Map<string, SqlServerSession>()
  private connectionSessions = new Map<string, Set<string>>()
  private maxSessionsPerConnection = 20

  async createSession(tabId: string, connectionId: string, database?: string): Promise<void> {
    // 类似 MySQL，但创建 min:1, max:1 的 ConnectionPool
    const pool = new sql.ConnectionPool({
      server: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: database || config.database || undefined,
      options: {
        encrypt: config.options?.encrypt ?? false,
        trustServerCertificate: config.options?.trustServerCertificate ?? true,
        enableArithAbort: true
      },
      pool: {
        min: 1,
        max: 1    // 关键：限制为单连接，保证会话隔离
      },
      connectionTimeout: Defaults.CONNECTION_TIMEOUT,
      requestTimeout: Defaults.QUERY_TIMEOUT
    })
    await pool.connect()
    // ... 注册会话（同 MySQL）
  }

  // executeQuery 逻辑从 driver.ts 中迁移，使用 session.pool.request() 执行
  // ...
}
```

### 3.5 Driver 瘦身后的连接管理

#### MySQL Driver（瘦身后）

```typescript
// mysql/driver.ts — 仅负责系统操作

export class MySQLDriver implements IDatabaseDriver {
  // 系统共享连接：每个 connectionId 一个，用于元数据查询
  private systemConnections = new Map<string, { connection: Connection; config: ConnectionConfig }>()

  // connect/disconnect：管理系统共享连接
  // getDatabases/getTables/getColumns/...：使用 systemConnections 执行
  // 不再包含 executeQuery/cancelQuery/explainQuery/executeBatch/executeDDL
}
```

#### SQL Server Driver（瘦身后）

```typescript
// sqlserver/driver.ts — 仅负责系统操作

export class SqlServerDriver implements IDatabaseDriver {
  // 系统共享连接池：每个 connectionId 一个，用于元数据查询
  private systemPools = new Map<string, { pool: ConnectionPool; config: ConnectionConfig }>()

  // connect/disconnect：管理系统共享连接池（保持原有 ConnectionPool 模式）
  // getDatabases/getTables/getColumns/...：使用 systemPools 执行
  // 不再包含 executeQuery/cancelQuery/explainQuery/executeBatch/executeDDL
}
```

### 3.6 IPC 层变更

#### query.ts（核心变更）

```typescript
// 所有查询操作新增 tabId 参数

ipcMain.handle(IpcChannels.QUERY_EXECUTE, async (_, data: {
  connectionId: string
  tabId: string          // [新增]
  sql: string
  maxRows?: number
  database?: string
}) => {
  const dbType = getConnectionDbType(data.connectionId)
  const sessionManager = DriverFactory.getSessionManager(dbType)
  
  // 如果该 Tab 还没有会话，自动创建（懒初始化）
  if (!sessionManager.getSessionInfo(data.tabId)) {
    await sessionManager.createSession(data.tabId, data.connectionId, data.database)
  }
  
  const results = await sessionManager.executeQuery(data.tabId, data.sql, {
    maxRows: data.maxRows || Defaults.MAX_ROWS,
    currentDatabase: data.database
  })
  return deepSerialize({ success: true, results })
})

ipcMain.handle(IpcChannels.QUERY_CANCEL, async (_, data: {
  connectionId: string
  tabId: string          // [新增]
}) => {
  const dbType = getConnectionDbType(data.connectionId)
  const sessionManager = DriverFactory.getSessionManager(dbType)
  const cancelled = await sessionManager.cancelQuery(data.tabId)
  return { success: cancelled }
})

// QUERY_EXPLAIN、QUERY_EXECUTE_BATCH 同理新增 tabId
```

#### 新增 IPC 通道

```typescript
// shared/constants/index.ts 新增

// 会话管理
SESSION_CREATE: 'session:create',       // Tab 获取连接时调用
SESSION_DESTROY: 'session:destroy',     // Tab 关闭时调用
SESSION_STATUS: 'session:status',       // 查询会话状态
SESSION_COUNT: 'session:count',         // 查询某服务器的会话数
```

#### database.ts（不变）

系统元数据操作 IPC 不变，继续使用 `connectionId` + `IDatabaseDriver`。

#### connection.ts（小改）

断开连接时，增加调用 `sessionManager.destroySessionsByConnection(connectionId)` 清理所有编辑器会话。

### 3.7 前端变更

#### EditorTab 类型

无需变更。现有的 `EditorTab.id` 即作为 `tabId` 使用，`EditorTab.connectionId` 已存在。

#### 查询调用处

```typescript
// 前端执行查询时，传递 tabId
window.api.query.execute(connectionId, tabId, sql, maxRows, database)

// 取消查询时，传递 tabId
window.api.query.cancel(connectionId, tabId)
```

#### Tab 关闭时

```typescript
// stores/editor.ts - closeTab 中增加
async function closeTab(tabId: string) {
  // 通知后端销毁会话
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab?.connectionId) {
    await window.api.session.destroy(tabId)
  }
  // ... 现有关闭逻辑
}
```

#### 断开服务器时

已有逻辑调用 `CONNECTION_DISCONNECT`，后端会自动清理该服务器下所有 Tab 会话。

### 3.8 连接异常重连

```typescript
// 通用重连逻辑（以 MySQL 为例）

async getSessionConnectionWithReconnect(tabId: string): Promise<Connection> {
  const session = this.sessions.get(tabId)
  if (!session) throw new Error('会话不存在')

  try {
    await session.connection.ping()
    session.lastActiveAt = Date.now()
    return session.connection
  } catch {
    // 连接已断开，尝试重连
    session.status = 'reconnecting'
    try {
      // 关闭旧连接
      try { await session.connection.end() } catch {}

      // 创建新连接
      const newConnection = await mysql.createConnection({ ... })
      session.connection = newConnection
      session.status = 'active'
      session.lastActiveAt = Date.now()

      // 注意：重连后会话状态（临时表、变量、事务）已丢失
      // 通过返回标记让上层通知前端
      return newConnection
    } catch (error) {
      session.status = 'disconnected'
      throw new Error('连接已断开且重连失败，请重新打开编辑器')
    }
  }
}
```

重连后，前端应收到提示："连接已重建，会话状态（临时表、变量、事务）已重置"。

### 3.9 DriverFactory 扩展

```typescript
// core/factory.ts

export class DriverFactory {
  private static drivers = new Map<string, IDatabaseDriver>()
  private static sessionManagers = new Map<string, ISessionManager>()  // [新增]

  static registerDriver(type: string, driver: IDatabaseDriver): void { ... }
  static registerSessionManager(type: string, manager: ISessionManager): void { ... }  // [新增]
  static getDriver(type: string): IDatabaseDriver { ... }
  static getSessionManager(type: string): ISessionManager { ... }  // [新增]
}
```

---

## 四、连接生命周期

### 4.1 连接建立流程

```
用户点击"连接"按钮
  → CONNECTION_CONNECT IPC
    → Driver.connect(config)
      → 创建系统共享连接（MySQL: 单连接 / SQL Server: ConnectionPool）
      → 返回版本信息
  → 前端标记服务器为已连接状态

用户在 Tab 中首次执行 SQL
  → QUERY_EXECUTE IPC (含 tabId)
    → SessionManager.getSessionInfo(tabId) 为空
      → SessionManager.createSession(tabId, connectionId, database)
        → 检查连接限额
        → 创建独占物理连接
        → 注册会话
    → SessionManager.executeQuery(tabId, sql, options)
      → 在独占连接上执行
```

### 4.2 连接释放流程

```
场景 1: 用户关闭 Tab
  → 前端 closeTab(tabId)
    → SESSION_DESTROY IPC
      → SessionManager.destroySession(tabId)
        → 关闭物理连接
        → 清理反向索引
        → 移除会话

场景 2: 用户断开服务器
  → CONNECTION_DISCONNECT IPC
    → SessionManager.destroySessionsByConnection(connectionId)  // 清理所有编辑器会话
    → Driver.disconnect(connectionId)                           // 关闭系统共享连接

场景 3: 应用退出
  → app.on('before-quit')
    → SessionManager.destroyAllSessions()  // 所有数据库类型
    → Driver.disconnectAll()               // 所有数据库类型
```

---

## 五、连接限额管理

### 5.1 配置

```typescript
// shared/constants/index.ts
export const Defaults = {
  // ...现有配置
  /** 每个服务器最大编辑器会话数 */
  MAX_SESSIONS_PER_CONNECTION: 20,
}
```

### 5.2 限额检查时机

| 时机 | 行为 |
|------|------|
| Tab 首次执行 SQL（懒初始化） | 检查限额，超出则返回错误提示 |
| 前端创建新 Tab | 无需检查（Tab 本身不消耗连接） |
| 断开/关闭 Tab | 释放连接，腾出配额 |

### 5.3 前端提示

当连接数达到上限时，前端展示错误信息：
> "已达到最大连接数限制(20)，请关闭部分编辑器后重试"

---

## 六、连接模型对比（改造前后）

### MySQL

| 维度 | 改造前 | 改造后 |
|------|--------|--------|
| 系统操作连接 | 单连接，所有操作共享 | 单连接，仅系统操作使用 |
| 用户查询连接 | 同上（共享） | 每个 Tab 独占一个物理连接 |
| 会话隔离 | 无（跨 Tab 共享状态） | 有（每个 Tab 独立会话） |
| 临时表 | 跨 Tab 可见 | 仅 Tab 内可见 |
| SET 变量 | 跨 Tab 影响 | 仅 Tab 内有效 |
| 事务 | 跨 Tab 互相干扰 | 仅 Tab 内有效 |

### SQL Server

| 维度 | 改造前 | 改造后 |
|------|--------|--------|
| 系统操作连接 | ConnectionPool（多连接） | ConnectionPool（多连接），仅系统操作使用 |
| 用户查询连接 | 同上（从池中取） | 每个 Tab 独占 ConnectionPool(min:1,max:1) |
| 会话隔离 | 无（每次 request 可能不同连接） | 有（每个 Tab 固定同一个物理连接） |
| 临时表 | 不可预期（可能立即丢失） | 仅 Tab 内可见 |
| SET 变量 | 不可预期 | 仅 Tab 内有效 |
| 事务 | 不可预期 | 仅 Tab 内有效 |

---

## 七、实施步骤

### 阶段 1: 基础架构（优先级高）
1. 新增 `core/session-interface.ts` — 定义 `ISessionManager` 接口
2. 扩展 `core/factory.ts` — 增加 SessionManager 注册和获取
3. 新增 `shared/constants` — 添加新的 IPC 通道和默认配置

### 阶段 2: 会话管理器实现
4. 新增 `mysql/session.ts` — MySQL 会话管理器实现
5. 新增 `sqlserver/session.ts` — SQL Server 会话管理器实现
6. 更新 `database/init.ts` — 注册 SessionManager

### 阶段 3: Driver 瘦身
7. 瘦身 `mysql/driver.ts` — 移除 executeQuery/cancelQuery/explainQuery/executeBatch/executeDDL
8. 瘦身 `sqlserver/driver.ts` — 同上
9. 更新 `core/interface.ts` — 从 IDatabaseDriver 移除查询方法

### 阶段 4: IPC 层改造
10. 改造 `ipc/query.ts` — 所有查询操作走 SessionManager，新增 tabId 参数
11. 新增 `ipc/session.ts` — 会话管理 IPC handlers
12. 改造 `ipc/connection.ts` — 断开连接时清理 sessions
13. 更新 `preload/index.ts` — 暴露新 IPC 接口

### 阶段 5: 前端适配
14. 更新 `renderer/stores/editor.ts` — Tab 关闭时销毁会话
15. 更新前端查询调用处 — 传递 tabId
16. 新增连接数提示 UI

### 阶段 6: 清理
17. 删除 `connection-manager.ts`（旧版遗留）
18. 删除 `query-executor.ts`（旧版遗留）

---

## 八、连接泄漏防护机制

### 场景分析

| 崩溃场景 | 是否会泄漏 | 原因 |
|----------|-----------|------|
| 整个应用被杀（任务管理器/系统崩溃） | **不会** | OS 强制关闭所有 TCP socket，数据库服务器检测到断开后自动清理会话 |
| Electron 主进程未捕获异常导致退出 | **不会** | 同上，进程退出 = TCP 断开 |
| 渲染进程崩溃/白屏（主进程仍运行） | **可能** | Tab 已不存在但主进程不知道，连接对象残留在 Map 中成为"僵尸连接" |
| IPC handler 抛异常导致清理逻辑中断 | **可能** | `destroySession` 未被调用，连接对象残留 |
| 前端 Tab 关闭事件发送了但主进程处理失败 | **可能** | 同上 |

### 防护措施

#### 1. 进程退出兜底清理

```typescript
// 应用正常退出
app.on('before-quit', async () => {
  await sessionManager.destroyAllSessions();
});

// 未捕获异常 — 同步清理后退出
process.on('uncaughtException', (err) => {
  log.error('Uncaught exception, cleaning up connections...', err);
  sessionManager.destroyAllSessionsSync(); // 同步版本，确保在进程退出前完成
  process.exit(1);
});

// 未处理的 Promise rejection
process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason);
  // 不退出，但记录日志供排查
});
```

#### 2. 僵尸会话检测（定时巡检）

SessionManager 启动一个定时任务（如每 60 秒），检测并清理僵尸会话：

```typescript
private startZombieDetection(intervalMs: number = 60000): void {
  setInterval(async () => {
    for (const [tabId, session] of this.sessions) {
      // 检查 1：物理连接是否已断开
      if (!await session.isAlive()) {
        log.warn(`Zombie session detected (connection dead): tabId=${tabId}`);
        await this.destroySession(tabId);
        continue;
      }
      // 检查 2：通过 IPC 询问渲染进程该 Tab 是否还存在
      try {
        const exists = await this.checkTabExistsInRenderer(tabId);
        if (!exists) {
          log.warn(`Zombie session detected (tab gone): tabId=${tabId}`);
          await this.destroySession(tabId);
        }
      } catch {
        // 渲染进程无响应，标记为可疑，连续 N 次无响应后清理
        session.suspiciousCount = (session.suspiciousCount || 0) + 1;
        if (session.suspiciousCount >= 3) {
          log.warn(`Zombie session detected (renderer unresponsive): tabId=${tabId}`);
          await this.destroySession(tabId);
        }
      }
    }
  }, intervalMs);
}
```

#### 3. 空闲超时自动释放

如果某个编辑器会话连接超过指定时间（如 30 分钟）没有执行过任何查询，自动释放物理连接。下次用户执行 SQL 时通过懒初始化机制重新创建。

```typescript
private readonly IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 分钟

// 每次执行查询时更新最后活跃时间
session.lastActiveTime = Date.now();

// 巡检时检查空闲超时
if (Date.now() - session.lastActiveTime > this.IDLE_TIMEOUT_MS) {
  log.info(`Session idle timeout: tabId=${tabId}`);
  await this.destroySession(tabId);
  // 前端下次执行 SQL 时会触发懒初始化，自动创建新连接
}
```

#### 4. 渲染进程崩溃事件监听

Electron 提供了渲染进程崩溃的事件监听，可以在主进程中捕获并清理：

```typescript
mainWindow.webContents.on('render-process-gone', async (event, details) => {
  log.error('Renderer process gone:', details.reason);
  // 清理所有编辑器会话连接（渲染进程已死，所有 Tab 都不存在了）
  await sessionManager.destroyAllSessions();
});
```

---

## 十、风险与注意事项

| 风险 | 说明 | 缓解措施 |
|------|------|---------|
| 连接泄露 | Tab 异常关闭未正确释放连接 | 僵尸检测 + 空闲超时 + 进程退出兜底 + 渲染进程崩溃监听 |
| 重连状态丢失 | 自动重连后临时表/变量丢失 | 通知前端"会话已重置" |
| 连接数过多 | 用户打开大量 Tab | 限额控制 + 友好提示 |
| 性能影响 | 每个 Tab 一个连接增加服务器负载 | 懒初始化（仅执行 SQL 时才创建连接）+ 空闲超时释放 |
