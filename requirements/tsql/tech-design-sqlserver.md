# SQL Server 支持技术方案（调整后）

## 1. 概述

本文档描述将 SQL Tool 从仅支持 MySQL 扩展到支持 SQL Server (TSQL) 的技术方案。

## 2. 设计目标

- 支持 MySQL 和 SQL Server 两种数据库
- 架构可扩展，便于后续添加其他数据库（PostgreSQL、Oracle 等）
- 最小化对现有功能的改动
- 数据库类型对上层透明（通过抽象层隔离差异）

## 3. 总体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Renderer (前端)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ SqlEditor    │  │ Connection   │  │ ResultPanel          │
│  │ (Monaco)     │  │ Tree         │  │                      │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ IPC
┌────────────────────────▼────────────────────────────────────────┐
│                         Main (后端)                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Database Abstraction Layer                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │   IDriver   │  │   Factory   │  │   Types     │     │   │
│  │  │  Interface  │  │             │  │             │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │              Driver Implementations                     │   │
│  │  ┌────────────────┐    │    ┌────────────────┐         │   │
│  │  │  MySQL Driver  │◄───┘    │ SQLServer Driver│         │   │
│  │  │  (mysql2)      │         │  (mssql)        │         │   │
│  │  └────────────────┘         └────────────────┘         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SQL Language Server (LSP)                  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │   │
│  │  │ Completion │ │ Diagnostics│ │    Formatting      │  │   │
│  │  │ Provider   │ │ Provider   │ │    Provider        │  │   │
│  │  └────────────┘ └────────────┘ └────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 4. 详细设计

### 4.1 共享类型层 (src/shared/types/)

#### 4.1.1 数据库类型定义

```typescript
// src/shared/types/database.ts

/**
 * 支持的数据库类型
 */
export type DatabaseType = 'mysql' | 'sqlserver'

/**
 * 数据库类型配置
 */
export interface DatabaseTypeConfig {
  type: DatabaseType
  name: string
  defaultPort: number
  icon?: string
}

/**
 * 数据库类型列表
 */
export const DatabaseTypes: DatabaseTypeConfig[] = [
  { type: 'mysql', name: 'MySQL', defaultPort: 3306 },
  { type: 'sqlserver', name: 'SQL Server', defaultPort: 1433 }
]

/**
 * 获取数据库类型配置
 */
export function getDatabaseTypeConfig(type: DatabaseType): DatabaseTypeConfig {
  return DatabaseTypes.find(t => t.type === type) || DatabaseTypes[0]
}

/**
 * 获取默认端口
 */
export function getDefaultPort(type: DatabaseType): number {
  return getDatabaseTypeConfig(type).defaultPort
}
```

#### 4.1.2 连接配置扩展

```typescript
// src/shared/types/connection.ts

export interface ConnectionConfig {
  id: string
  type: DatabaseType  // 新增：数据库类型
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
  // SQL Server 特有配置
  options?: {
    encrypt?: boolean      // 是否加密连接
    trustServerCertificate?: boolean  // 是否信任服务器证书
    domain?: string        // Windows 域认证
  }
  createdAt: number
  updatedAt: number
}

export interface ConnectionForm {
  type: DatabaseType     // 新增
  name: string
  host: string
  port: number
  username: string
  password: string
  database?: string
  options?: ConnectionConfig['options']
}
```

#### 4.1.3 向后兼容性设计

**问题**：用户之前保存的连接没有 `type` 字段，需要默认视为 MySQL。

**解决方案**：

```typescript
// src/shared/types/connection.ts

/**
 * 数据库类型（支持向后兼容）
 * 历史数据没有 type 字段时，默认为 'mysql'
 */
export type DatabaseType = 'mysql' | 'sqlserver'

/**
 * 获取连接的数据库类型（处理向后兼容）
 * @param config 连接配置
 * @returns 数据库类型，默认为 'mysql'
 */
export function getConnectionType(config: Partial<ConnectionConfig>): DatabaseType {
  // 如果没有 type 字段，默认为 mysql（向后兼容）
  return config.type || 'mysql'
}

/**
 * 为历史连接补充 type 字段
 * @param connections 从存储加载的连接列表
 * @returns 补充 type 字段后的连接列表
 */
export function migrateConnections(connections: Array<Partial<ConnectionConfig>>): ConnectionConfig[] {
  return connections.map(conn => ({
    ...conn,
    type: conn.type || 'mysql',  // 默认 mysql
    // 确保其他必填字段有默认值
    id: conn.id || generateId(),
    name: conn.name || 'Unnamed',
    host: conn.host || 'localhost',
    port: conn.port || 3306,
    username: conn.username || '',
    password: conn.password || '',
    createdAt: conn.createdAt || Date.now(),
    updatedAt: conn.updatedAt || Date.now()
  })) as ConnectionConfig[]
}

// 辅助函数：生成唯一 ID
function generateId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
```

**使用场景**：

1. **加载连接列表时**（主进程）：
```typescript
// src/main/ipc/connection.ts

ipcMain.handle(IpcChannels.CONNECTION_LIST, async () => {
  const storedConnections = storage.get('connections', []) as Array<Partial<ConnectionConfig>>
  // 迁移历史数据，补充 type 字段
  const connections = migrateConnections(storedConnections)
  // 保存迁移后的数据（可选，一次性升级）
  storage.set('connections', connections)
  return connections
})
```

2. **使用连接时**（渲染进程）：
```typescript
// src/renderer/stores/connection.ts

const type = getConnectionType(connection)
const driver = DriverFactory.getDriver(type)
```

3. **连接对话框编辑时**：
```typescript
// src/renderer/components/ConnectionDialog.vue

// 监听编辑连接变化
watch(() => connectionStore.editingConnection, (conn) => {
  if (conn) {
    form.value = {
      type: conn.type || 'mysql',  // 默认为 mysql
      name: conn.name,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: conn.password,
      database: conn.database || ''
    }
  }
})
```

#### 4.1.4 元数据类型扩展

```typescript
// src/shared/types/database.ts

/**
 * 列元数据（数据库无关）
 */
export interface ColumnMeta {
  name: string
  type: string           // 标准数据类型（已映射）
  nativeType: string     // 原生数据类型
  columnType: string     // 完整类型定义
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean // MySQL: auto_increment, SQL Server: identity
  defaultValue?: string
  characterSet?: string
  collation?: string
  comment?: string
  // SQL Server 特有
  isIdentity?: boolean
  seed?: number          // identity seed
  increment?: number     // identity increment
}

/**
 * SQL Server 特有的元数据
 */
export interface SqlServerTableMeta extends TableMeta {
  schema: string         // dbo, etc.
}

/**
 * 数据库类型与标准类型的映射
 */
export interface TypeMapping {
  nativeType: string
  standardType: string
  length?: number
  precision?: number
  scale?: number
}
```

### 4.2 数据库抽象层 (src/main/database/core/)

#### 4.2.1 驱动接口定义

```typescript
// src/main/database/core/interface.ts

import type { 
  ConnectionConfig, 
  TestConnectionResult,
  DatabaseMeta,
  TableMeta,
  ColumnMeta,
  ViewMeta,
  FunctionMeta,
  IndexMeta,
  QueryResult,
  ExplainResult
} from '@shared/types'

/**
 * 查询选项
 */
export interface QueryOptions {
  maxRows?: number
  timeout?: number
  currentDatabase?: string
}

/**
 * 数据库驱动接口
 * 所有数据库驱动必须实现此接口
 */
export interface IDatabaseDriver {
  /**
   * 获取驱动类型
   */
  readonly type: string

  /**
   * 测试连接
   */
  testConnection(config: ConnectionConfig): Promise<TestConnectionResult>

  /**
   * 建立连接
   */
  connect(config: ConnectionConfig): Promise<{ version: string }>

  /**
   * 断开连接
   */
  disconnect(connectionId: string): Promise<void>

  /**
   * 断开所有连接
   */
  disconnectAll(): Promise<void>

  /**
   * 检查连接是否有效
   */
  isConnected(connectionId: string): Promise<boolean>

  /**
   * 获取数据库版本
   */
  getVersion(connectionId: string): Promise<string | null>

  // ==================== 元数据操作 ====================

  /**
   * 获取数据库列表
   */
  getDatabases(connectionId: string): Promise<string[]>

  /**
   * 获取表列表
   */
  getTables(connectionId: string, database: string): Promise<TableMeta[]>

  /**
   * 获取表列信息
   */
  getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]>

  /**
   * 获取视图列表
   */
  getViews(connectionId: string, database: string): Promise<ViewMeta[]>

  /**
   * 获取函数/存储过程列表
   */
  getFunctions(connectionId: string, database: string): Promise<FunctionMeta[]>

  /**
   * 获取索引信息
   */
  getIndexes(connectionId: string, database: string, table: string): Promise<IndexMeta[]>

  /**
   * 获取表的创建语句
   */
  getTableCreateSql(connectionId: string, database: string, table: string): Promise<string>

  // ==================== 查询操作 ====================

  /**
   * 执行查询
   */
  executeQuery(
    connectionId: string, 
    sql: string, 
    options?: QueryOptions
  ): Promise<QueryResult[]>

  /**
   * 取消正在执行的查询
   */
  cancelQuery(connectionId: string): Promise<boolean>

  /**
   * 获取执行计划
   */
  explainQuery(
    connectionId: string, 
    sql: string, 
    currentDatabase?: string
  ): Promise<ExplainResult | { type: 'error'; code: string; message: string }>

  /**
   * 更新单元格值
   */
  updateCell(
    connectionId: string,
    database: string,
    table: string,
    primaryKeys: { column: string; value: unknown }[],
    column: string,
    newValue: unknown
  ): Promise<{ success: boolean; message?: string }>

  /**
   * 批量执行 SQL
   */
  executeBatch(
    connectionId: string,
    sqls: string[]
  ): Promise<{ 
    success: boolean; 
    message?: string; 
    results?: Array<{ sql: string; affectedRows: number }> 
  }>

  // ==================== DDL 操作 ====================

  /**
   * 执行 DDL 语句
   */
  executeDDL(connectionId: string, sql: string): Promise<{ success: boolean; message?: string }>

  // ==================== 数据库特有功能 ====================

  /**
   * 获取字符集列表（MySQL 特有）
   */
  getCharsets?(connectionId: string): Promise<{ charset: string; defaultCollation: string; description: string }[]>

  /**
   * 获取排序规则列表（MySQL 特有）
   */
  getCollations?(connectionId: string, charset?: string): Promise<{ collation: string; charset: string; isDefault: boolean }[]>

  /**
   * 获取存储引擎列表（MySQL 特有）
   */
  getEngines?(connectionId: string): Promise<{ engine: string; support: string; comment: string; isDefault: boolean }[]>

  /**
   * 获取默认字符集（MySQL 特有）
   */
  getDefaultCharset?(connectionId: string, database: string): Promise<{ charset: string; collation: string }>

  /**
   * 获取 schema 列表（SQL Server 特有）
   */
  getSchemas?(connectionId: string): Promise<string[]>
}
```

#### 4.2.2 驱动工厂

```typescript
// src/main/database/core/factory.ts

import type { IDatabaseDriver, DatabaseType } from '@shared/types'
import { MySQLDriver } from '../mysql/driver'
import { SqlServerDriver } from '../sqlserver/driver'

/**
 * 驱动工厂
 */
export class DriverFactory {
  private static drivers = new Map<DatabaseType, IDatabaseDriver>()

  /**
   * 获取驱动实例（单例）
   */
  static getDriver(type: DatabaseType): IDatabaseDriver {
    if (!this.drivers.has(type)) {
      const driver = this.createDriver(type)
      this.drivers.set(type, driver)
    }
    return this.drivers.get(type)!
  }

  /**
   * 创建驱动实例
   */
  private static createDriver(type: DatabaseType): IDatabaseDriver {
    switch (type) {
      case 'mysql':
        return new MySQLDriver()
      case 'sqlserver':
        return new SqlServerDriver()
      default:
        throw new Error(`不支持的数据库类型: ${type}`)
    }
  }

  /**
   * 根据连接配置获取驱动
   */
  static getDriverForConfig(config: { type: DatabaseType }): IDatabaseDriver {
    return this.getDriver(config.type)
  }

  /**
   * 清除所有驱动实例
   */
  static clearDrivers(): void {
    this.drivers.clear()
  }
}

/**
 * 便捷的驱动获取函数
 */
export function getDriver(type: DatabaseType): IDatabaseDriver {
  return DriverFactory.getDriver(type)
}
```

### 4.3 MySQL 驱动实现 (src/main/database/mysql/)

将现有的 `connection-manager.ts` 和 `query-executor.ts` 重构为 MySQLDriver 类。

```typescript
// src/main/database/mysql/driver.ts

import type { Connection, FieldPacket } from 'mysql2/promise'
import mysql from 'mysql2/promise'
import type { 
  IDatabaseDriver, 
  QueryOptions,
  ConnectionConfig,
  TestConnectionResult,
  TableMeta,
  ColumnMeta,
  // ... 其他类型
} from '@shared/types'
import { Defaults } from '@shared/constants'

interface ConnectionInfo {
  connection: Connection
  config: ConnectionConfig
}

export class MySQLDriver implements IDatabaseDriver {
  readonly type = 'mysql'
  private connections = new Map<string, ConnectionInfo>()

  async testConnection(config: ConnectionConfig): Promise<TestConnectionResult> {
    // 从现有的 testConnection 函数迁移
  }

  async connect(config: ConnectionConfig): Promise<{ version: string }> {
    // 从现有的 connect 函数迁移
  }

  async disconnect(connectionId: string): Promise<void> {
    // 从现有的 disconnect 函数迁移
  }

  async executeQuery(
    connectionId: string, 
    sql: string, 
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    // 从现有的 executeQuery 函数迁移
    // 使用 LIMIT 进行分页
  }

  async explainQuery(connectionId: string, sql: string): Promise<ExplainResult> {
    // EXPLAIN 格式
    // 返回 MySQL 特有的执行计划格式
  }

  // ... 其他方法实现

  /**
   * MySQL 特有：获取字符集列表
   */
  async getCharsets(connectionId: string): Promise<...> {
    // 实现
  }

  /**
   * MySQL 特有：获取存储引擎列表
   */
  async getEngines(connectionId: string): Promise<...> {
    // 实现
  }
}
```

### 4.4 SQL Server 驱动实现 (src/main/database/sqlserver/)

```typescript
// src/main/database/sqlserver/driver.ts

import sql from 'mssql'
import { parseStringPromise } from 'xml2js'
import type { 
  IDatabaseDriver, 
  QueryOptions,
  ConnectionConfig,
  // ... 其他类型
} from '@shared/types'

interface ConnectionInfo {
  pool: sql.ConnectionPool
  config: ConnectionConfig
}

export class SqlServerDriver implements IDatabaseDriver {
  readonly type = 'sqlserver'
  private connections = new Map<string, ConnectionInfo>()

  async testConnection(config: ConnectionConfig): Promise<TestConnectionResult> {
    try {
      const pool = await this.createConnection(config)
      const result = await pool.request().query('SELECT @@VERSION as version')
      await pool.close()
      
      return {
        success: true,
        message: '连接成功',
        serverVersion: result.recordset[0]?.version
      }
    } catch (error) {
      return {
        success: false,
        message: this.formatErrorMessage(error)
      }
    }
  }

  async connect(config: ConnectionConfig): Promise<{ version: string }> {
    const pool = await this.createConnection(config)
    
    const result = await pool.request().query('SELECT @@VERSION as version')
    const version = result.recordset[0]?.version || 'Unknown'
    
    this.connections.set(config.id, { pool, config })
    return { version }
  }

  private async createConnection(config: ConnectionConfig): Promise<sql.ConnectionPool> {
    const sqlConfig: sql.config = {
      server: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      options: {
        encrypt: config.options?.encrypt ?? true,
        trustServerCertificate: config.options?.trustServerCertificate ?? false,
      },
      connectionTimeout: Defaults.CONNECTION_TIMEOUT,
      requestTimeout: Defaults.QUERY_TIMEOUT
    }

    // Windows 域认证
    if (config.options?.domain) {
      sqlConfig.domain = config.options.domain
    }

    return await new sql.ConnectionPool(sqlConfig).connect()
  }

  async executeQuery(
    connectionId: string, 
    sql: string, 
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    const info = this.connections.get(connectionId)
    if (!info) throw new Error('连接不存在')

    // 切换数据库
    if (options?.currentDatabase) {
      await info.pool.request().query(`USE [${options.currentDatabase}]`)
    }

    // SQL Server 使用 TOP 进行分页，不是 LIMIT
    const modifiedSql = this.addTopLimit(sql, options?.maxRows)

    const result = await info.pool.request().query(modifiedSql)
    
    // 转换结果为统一格式
    return this.transformResult(result)
  }

  async explainQuery(connectionId: string, sql: string): Promise<ExplainResult> {
    const info = this.connections.get(connectionId)
    if (!info) throw new Error('连接不存在')

    // SQL Server 使用 SET SHOWPLAN_XML 或 SET STATISTICS PROFILE
    await info.pool.request().query('SET SHOWPLAN_XML ON')
    const result = await info.pool.request().query(sql)
    await info.pool.request().query('SET SHOWPLAN_XML OFF')

    // 解析 XML 格式的执行计划
    return this.parseExecutionPlan(result.recordset[0]?.[0])
  }

  /**
   * 解析 SQL Server XML 执行计划
   */
  private async parseExecutionPlan(xml: string): Promise<ExplainResult> {
    try {
      const parsed = await parseStringPromise(xml)
      const plan = parsed.ShowPlanXML?.BatchSequence?.[0]?.Batch?.[0]?.Statements?.[0]?.StmtSimple?.[0]
      
      if (!plan) {
        return { type: 'error', code: 'PARSE_ERROR', message: '无法解析执行计划' }
      }

      // 提取关键信息
      const queryPlan = plan.QueryPlan?.[0]
      const rootOp = queryPlan?.RelOp?.[0]

      return {
        type: 'plan',
        estimatedRows: parseFloat(plan.$.StatementEstRows) || 0,
        estimatedCost: parseFloat(plan.$.StatementSubTreeCost) || 0,
        // 提取操作符信息
        operations: this.extractOperators(rootOp)
      }
    } catch (error) {
      return { 
        type: 'error', 
        code: 'PARSE_ERROR', 
        message: `执行计划解析失败: ${error.message}` 
      }
    }
  }

  /**
   * 提取执行计划操作符
   */
  private extractOperators(relOp: any): any[] {
    if (!relOp) return []
    
    const operators = []
    const op = {
      type: relOp.$.PhysicalOp || relOp.$.LogicalOp,
      estimatedRows: parseFloat(relOp.$.EstimateRows) || 0,
      estimatedCost: parseFloat(relOp.$.EstimatedTotalSubtreeCost) || 0,
      // ... 其他字段
    }
    operators.push(op)

    // 递归提取子操作符
    const children = relOp.OutputList?.[0]?.ColumnReference || []
    // ... 处理子节点

    return operators
  }

  async getTables(connectionId: string, database: string): Promise<TableMeta[]> {
    const info = this.connections.get(connectionId)
    if (!info) throw new Error('连接不存在')

    // SQL Server 使用 sys.tables / INFORMATION_SCHEMA
    const result = await info.pool.request()
      .input('database', sql.NVarChar, database)
      .query(`
        SELECT 
          t.name AS table_name,
          ep.value AS table_comment
        FROM sys.tables t
        LEFT JOIN sys.extended_properties ep 
          ON ep.major_id = t.object_id 
          AND ep.minor_id = 0 
          AND ep.name = 'MS_Description'
        WHERE SCHEMA_NAME(t.schema_id) = 'dbo'
        ORDER BY t.name
      `)

    return result.recordset.map(r => ({
      name: r.table_name,
      comment: r.table_comment,
      columns: []
    }))
  }

  async getColumns(
    connectionId: string, 
    database: string, 
    table: string
  ): Promise<ColumnMeta[]> {
    // SQL Server 列信息查询
    const result = await info.pool.request()
      .input('table', sql.NVarChar, table)
      .query(`
        SELECT 
          c.name AS column_name,
          t.name AS data_type,
          ty.name + 
            CASE 
              WHEN ty.name IN ('varchar', 'nvarchar', 'char', 'nchar') 
                THEN '(' + IIF(c.max_length = -1, 'MAX', CAST(c.max_length AS VARCHAR)) + ')'
              WHEN ty.name IN ('decimal', 'numeric') 
                THEN '(' + CAST(c.precision AS VARCHAR) + ',' + CAST(c.scale AS VARCHAR) + ')'
              ELSE ''
            END AS column_type,
          c.is_nullable,
          CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS is_primary_key,
          c.is_identity,
          ic.seed_value,
          ic.increment_value,
          dc.definition AS default_value,
          ep.value AS column_comment
        FROM sys.columns c
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        LEFT JOIN (
          SELECT ic.column_id, ic.object_id
          FROM sys.index_columns ic
          INNER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
          WHERE i.is_primary_key = 1
        ) pk ON c.column_id = pk.column_id AND c.object_id = pk.object_id
        LEFT JOIN sys.identity_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
        LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
        LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
        WHERE t.name = @table AND s.name = 'dbo'
        ORDER BY c.column_id
      `)

    return result.recordset.map(r => ({
      name: r.column_name,
      type: this.mapSqlServerTypeToStandard(r.data_type),
      nativeType: r.data_type,
      columnType: r.column_type,
      nullable: r.is_nullable,
      primaryKey: r.is_primary_key === 1,
      autoIncrement: r.is_identity,
      isIdentity: r.is_identity,
      seed: r.seed_value,
      increment: r.increment_value,
      defaultValue: r.default_value,
      comment: r.column_comment
    }))
  }

  /**
   * 将 SQL Server 类型映射为标准类型
   */
  private mapSqlServerTypeToStandard(sqlServerType: string): string {
    const typeMap: Record<string, string> = {
      'int': 'INTEGER',
      'bigint': 'BIGINT',
      'smallint': 'SMALLINT',
      'tinyint': 'TINYINT',
      'varchar': 'VARCHAR',
      'nvarchar': 'VARCHAR',
      'char': 'CHAR',
      'nchar': 'CHAR',
      'text': 'TEXT',
      'ntext': 'TEXT',
      'decimal': 'DECIMAL',
      'numeric': 'DECIMAL',
      'float': 'FLOAT',
      'real': 'FLOAT',
      'datetime': 'DATETIME',
      'datetime2': 'DATETIME',
      'smalldatetime': 'DATETIME',
      'date': 'DATE',
      'time': 'TIME',
      'bit': 'BOOLEAN',
      'uniqueidentifier': 'UUID',
      'varbinary': 'BINARY',
      'image': 'BLOB',
      'xml': 'XML',
      'money': 'DECIMAL',
      'smallmoney': 'DECIMAL',
      // 空间类型
      'geography': 'GEOGRAPHY',
      'geometry': 'GEOMETRY',
      'hierarchyid': 'HIERARCHYID'
    }
    return typeMap[sqlServerType.toLowerCase()] || 'UNKNOWN'
  }

  /**
   * SQL Server 特有：获取 Schema 列表
   */
  async getSchemas(connectionId: string): Promise<string[]> {
    const info = this.connections.get(connectionId)
    if (!info) throw new Error('连接不存在')

    const result = await info.pool.request().query(`
      SELECT name FROM sys.schemas 
      WHERE principal_id = 1 
      ORDER BY name
    `)

    return result.recordset.map(r => r.name)
  }

  // ... 其他方法实现
}
```

### 4.5 IPC 层适配 (src/main/ipc/)

IPC 处理器需要修改为通过驱动工厂调用对应的数据库驱动。

```typescript
// src/main/ipc/connection.ts

import { DriverFactory } from '../database/core/factory'

export function setupConnectionHandlers(ipcMain: IpcMain): void {
  // 测试连接 - 根据配置类型使用对应驱动
  ipcMain.handle(IpcChannels.CONNECTION_TEST, async (_, config: ConnectionConfig) => {
    const driver = DriverFactory.getDriverForConfig(config)
    return driver.testConnection(config)
  })

  // 连接数据库
  ipcMain.handle(IpcChannels.CONNECTION_CONNECT, async (_, connectionId: string) => {
    const connections = loadConnections()
    const config = connections.find(c => c.id === connectionId)
    
    if (!config) {
      return { success: false, message: '连接配置不存在' }
    }
    
    const driver = DriverFactory.getDriverForConfig(config)
    
    try {
      const result = await driver.connect(config)
      return { success: true, message: '连接成功', serverVersion: result.version }
    } catch (error) {
      return { success: false, message: error.message || '连接失败' }
    }
  })
  
  // ... 其他处理器
}
```

```typescript
// src/main/ipc/database.ts

import { getConnectionStore } from '../database/core/connection-store'
import { DriverFactory } from '../database/core/factory'

export function setupDatabaseHandlers(ipcMain: IpcMain): void {
  // 获取数据库列表
  ipcMain.handle(IpcChannels.DATABASE_LIST, async (_, connectionId: string) => {
    try {
      const config = getConnectionStore().getConfig(connectionId)
      const driver = DriverFactory.getDriverForConfig(config)
      const databases = await driver.getDatabases(connectionId)
      return { success: true, databases }
    } catch (error) {
      return { success: false, message: error.message }
    }
  })

  // 获取表列表
  ipcMain.handle(IpcChannels.DATABASE_TABLES, async (_, data: { connectionId: string; database: string }) => {
    try {
      const config = getConnectionStore().getConfig(data.connectionId)
      const driver = DriverFactory.getDriverForConfig(config)
      const tables = await driver.getTables(data.connectionId, data.database)
      return { success: true, tables }
    } catch (error) {
      return { success: false, message: error.message }
    }
  })

  // ... 其他处理器
}
```

### 4.6 SQL 语言服务器适配 (src/main/sql-language-server/)

#### 4.6.1 SQL 解析服务（调整后）

**调整说明**：使用 `node-sql-parser` 替代 `sql-parser-cst`，以支持 SQL Server。

```typescript
// src/main/sql-language-server/services/sqlParserService.ts

import { Parser } from 'node-sql-parser'
import type { DatabaseType } from '@shared/types'

const parser = new Parser()

/**
 * 获取解析器数据库类型
 */
function getParserDatabaseType(dbType: DatabaseType): string {
  switch (dbType) {
    case 'mysql':
      return 'MySQL'
    case 'sqlserver':
      return 'TransactSQL'
    default:
      return 'MySQL'
  }
}

/**
 * 解析 SQL
 */
export function parseSQL(sql: string, dbType: DatabaseType = 'mysql') {
  try {
    const database = getParserDatabaseType(dbType)
    const ast = parser.astify(sql, { database })
    return {
      success: true,
      ast,
      error: null
    }
  } catch (error) {
    return {
      success: false,
      ast: null,
      error: {
        message: error.message,
        location: error.location
      }
    }
  }
}

/**
 * 验证 SQL 语法
 */
export function validateSQL(sql: string, dbType: DatabaseType = 'mysql'): {
  valid: boolean
  errors: Array<{ message: string; line?: number; column?: number }>
} {
  const result = parseSQL(sql, dbType)
  
  if (result.success) {
    return { valid: true, errors: [] }
  }
  
  return {
    valid: false,
    errors: [{
      message: result.error?.message || '语法错误',
      line: result.error?.location?.start?.line,
      column: result.error?.location?.start?.column
    }]
  }
}
```

#### 4.6.2 格式化 Provider

```typescript
// src/main/sql-language-server/providers/formattingProvider.ts

import { format } from 'sql-formatter'
import type { DatabaseType } from '@shared/types'

/**
 * 获取格式化 language
 */
function getFormatterLanguage(dbType: DatabaseType): string {
  switch (dbType) {
    case 'mysql':
      return 'mysql'
    case 'sqlserver':
      return 'tsql'  // sql-formatter 支持 transactsql
    default:
      return 'mysql'
  }
}

export function formatSQL(sql: string, dbType: DatabaseType = 'mysql'): string {
  return format(sql, {
    language: getFormatterLanguage(dbType),
    tabWidth: 2,
    useTabs: false,
    keywordCase: 'upper'
  })
}
```

#### 4.6.3 自动补全 Provider

```typescript
// src/main/sql-language-server/providers/completionProvider.ts

import type { DatabaseType } from '@shared/types'
import * as mysqlFunctions from '../../../../resources/mysql-functions.json'
import * as sqlserverFunctions from '../../../../resources/sqlserver-functions.json'

/**
 * 获取函数列表
 */
function getFunctionList(dbType: DatabaseType) {
  switch (dbType) {
    case 'mysql':
      return mysqlFunctions
    case 'sqlserver':
      return sqlserverFunctions
    default:
      return mysqlFunctions
  }
}

/**
 * 提供自动补全项
 */
export function provideCompletions(
  sql: string, 
  position: Position, 
  dbType: DatabaseType = 'mysql'
): CompletionItem[] {
  const functions = getFunctionList(dbType)
  const items: CompletionItem[] = []
  
  // 添加函数补全
  Object.values(functions.categories).forEach((category: any) => {
    category.functions.forEach((fn: any) => {
      items.push({
        label: fn.name,
        kind: CompletionItemKind.Function,
        detail: `${fn.signature} -> ${fn.returnType}`,
        documentation: fn.description,
        insertText: fn.name
      })
    })
  })
  
  return items
}
```

### 4.7 前端适配 (src/renderer/)

#### 4.7.1 连接对话框增强

```vue
<!-- src/renderer/components/ConnectionDialog.vue -->

<template>
  <el-dialog ...>
    <el-form ...>
      <!-- 新增：数据库类型选择 -->
      <el-form-item :label="$t('connection.dbType')" prop="type">
        <el-select v-model="form.type" @change="handleTypeChange">
          <el-option 
            v-for="dbType in DatabaseTypes" 
            :key="dbType.type" 
            :label="dbType.name" 
            :value="dbType.type" 
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('connection.host')" prop="host">
        <el-input v-model="form.host">
          <template #append>
            <el-input-number v-model="form.port" :min="1" :max="65535" />
          </template>
        </el-input>
      </el-form-item>

      <!-- SQL Server 特有选项 -->
      <template v-if="form.type === 'sqlserver'">
        <el-form-item :label="$t('connection.encrypt')">
          <el-switch v-model="form.options.encrypt" />
        </el-form-item>
        <el-form-item :label="$t('connection.trustServerCertificate')">
          <el-switch v-model="form.options.trustServerCertificate" />
        </el-form-item>
      </template>

      <!-- ... 其他字段 -->
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { DatabaseTypes, getDefaultPort, getConnectionType } from '@shared/types'

const form = ref({
  type: 'mysql' as DatabaseType,
  name: '',
  host: '',
  port: 3306,
  username: '',
  password: '',
  database: '',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
})

// 监听编辑连接变化（处理向后兼容）
watch(() => connectionStore.editingConnection, (conn) => {
  if (conn) {
    form.value = {
      // 关键：历史连接可能没有 type 字段，默认使用 'mysql'
      type: getConnectionType(conn),
      name: conn.name,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: conn.password,
      database: conn.database || '',
      options: {
        encrypt: conn.options?.encrypt ?? true,
        trustServerCertificate: conn.options?.trustServerCertificate ?? false
      }
    }
  } else {
    // 新建连接，默认 MySQL
    form.value = {
      type: 'mysql',
      name: '',
      host: '',
      port: 3306,
      username: '',
      password: '',
      database: '',
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    }
  }
}, { immediate: true })

function handleTypeChange(type: DatabaseType) {
  form.value.port = getDefaultPort(type)
  // SQL Server 默认数据库改为 master
  if (type === 'sqlserver' && !form.value.database) {
    form.value.database = 'master'
  }
}
</script>
```

## 5. 文件改动清单

### 5.1 新增文件

| 文件路径 | 说明 |
|----------|------|
| `src/main/database/core/interface.ts` | 驱动接口定义 |
| `src/main/database/core/factory.ts` | 驱动工厂 |
| `src/main/database/core/connection-store.ts` | 连接配置存储（从 storage 迁移） |
| `src/main/database/mysql/driver.ts` | MySQL 驱动实现 |
| `src/main/database/mysql/utils.ts` | MySQL 工具函数 |
| `src/main/database/sqlserver/driver.ts` | SQL Server 驱动实现 |
| `src/main/database/sqlserver/utils.ts` | SQL Server 工具函数 |
| `src/main/database/sqlserver/types.ts` | SQL Server 特有类型 |
| `src/shared/constants/database.ts` | 数据库类型常量 |

### 5.2 修改文件

| 文件路径 | 改动内容 |
|----------|----------|
| `package.json` | 添加 `mssql`、`node-sql-parser`、`xml2js` 依赖 |
| `src/shared/types/connection.ts` | 添加 `type` 和 `options` 字段，添加向后兼容工具函数 |
| `src/shared/types/database.ts` | 添加 SQL Server 类型定义、类型映射 |
| `src/shared/types/query.ts` | 添加 `ExplainNode` 的 SQL Server 变体 |
| `src/shared/constants/index.ts` | 添加端口常量 |
| `src/main/database/connection-manager.ts` | **删除**，合并到 MySQLDriver |
| `src/main/database/query-executor.ts` | **删除**，合并到 MySQLDriver |
| `src/main/ipc/connection.ts` | 使用 DriverFactory，添加历史数据迁移逻辑 |
| `src/main/ipc/database.ts` | 使用 DriverFactory |
| `src/main/ipc/query.ts` | 使用 DriverFactory |
| `src/main/sql-language-server/services/sqlParserService.ts` | 使用 `node-sql-parser` 替代 `sql-parser-cst` |
| `src/main/sql-language-server/providers/formattingProvider.ts` | 支持 language 切换 |
| `src/main/sql-language-server/providers/diagnosticProvider.ts` | 使用 `node-sql-parser` |
| `src/main/sql-language-server/providers/completionProvider.ts` | 支持方言切换 |
| `src/main/sql-language-server/index.ts` | 传递数据库类型参数 |
| `src/renderer/components/ConnectionDialog.vue` | 添加类型选择、SQL Server 选项、向后兼容处理 |
| `src/renderer/stores/connection.ts` | 处理类型相关逻辑 |

### 5.3 删除文件

| 文件路径 | 说明 |
|----------|------|
| `src/main/database/connection-manager.ts` | 合并到 MySQLDriver |
| `src/main/database/query-executor.ts` | 合并到 MySQLDriver |

## 6. 依赖变更

### 6.1 新增依赖

```json
{
  "dependencies": {
    "mssql": "^11.0.1",
    "node-sql-parser": "^5.0.0",
    "xml2js": "^0.6.2"
  }
}
```

### 6.2 依赖说明

| 依赖 | 用途 | 说明 |
|------|------|------|
| `mssql` | SQL Server 驱动 | 基于 Tedious 构建，支持连接池、Windows 域认证 |
| `node-sql-parser` | SQL 解析 | 支持 MySQL、SQL Server (TransactSQL) 等多种方言 |
| `xml2js` | XML 解析 | 解析 SQL Server XML 格式的执行计划 |

### 6.3 移除/替换依赖

| 原依赖 | 替换为 | 说明 |
|--------|--------|------|
| `sql-parser-cst` | `node-sql-parser` | `sql-parser-cst` 不支持 SQL Server |

## 7. 实施计划（调整后）

### Phase 0: 预验证（可选）(0.5 天)

**目的**：在正式开发前验证关键技术组件，降低实施风险。

**验证内容**：

1. **验证 `node-sql-parser` 对 TSQL 特有语法的支持**

```typescript
import { Parser } from 'node-sql-parser'

const parser = new Parser()
const testCases = [
  // TOP 语法
  'SELECT TOP 10 * FROM users',
  // OFFSET FETCH 语法
  'SELECT * FROM users ORDER BY id OFFSET 10 ROWS FETCH NEXT 20 ROWS ONLY',
  // IDENTITY 列
  'CREATE TABLE test (id INT IDENTITY(1,1) PRIMARY KEY)',
  // GO 批处理分隔符（可能不支持）
  'SELECT 1; GO; SELECT 2',
  // 方括号标识符
  'SELECT [user name] FROM [my table]',
  // 日期函数
  'SELECT GETDATE(), DATEADD(day, 1, GETDATE())'
]

testCases.forEach(sql => {
  try {
    const ast = parser.astify(sql, { database: 'TransactSQL' })
    console.log(`✅ 支持: ${sql.substring(0, 50)}...`)
  } catch (e) {
    console.log(`❌ 不支持: ${sql.substring(0, 50)}... - ${e.message}`)
  }
})
```

2. **验证 `mssql` 驱动连接**

```typescript
import sql from 'mssql'

const config = {
  server: 'localhost',
  port: 1433,
  user: 'sa',
  password: 'your_password',
  options: { trustServerCertificate: true }
}

async function testConnection() {
  const pool = await new sql.ConnectionPool(config).connect()
  const result = await pool.request().query('SELECT @@VERSION')
  console.log('版本:', result.recordset[0])
  await pool.close()
}
```

**验证标准**：
- `node-sql-parser` 至少支持 80% 的测试用例
- 连接和基本查询正常工作

### Phase 1: 基础架构搭建 (2-3 天)

1. 创建目录结构
2. 定义驱动接口 (`interface.ts`)
3. 实现驱动工厂 (`factory.ts`)
4. 修改类型定义

### Phase 2: MySQL 重构 (1-2 天)

1. 将现有代码重构为 `MySQLDriver` 类
2. 确保所有现有功能正常
3. 更新 IPC 处理器使用工厂

### Phase 3: SQL Server 实现 (5-7 天)

1. 实现 `SqlServerDriver` 类
2. 实现连接管理
3. 实现查询执行
4. 实现元数据获取
5. **实现 XML 执行计划解析**（新增）

### Phase 4: SQL 语言服务器适配（调整后）(3-4 天)

1. **集成 `node-sql-parser` 替换 `sql-parser-cst`**（重点）
2. 修改格式化 Provider 支持 TSQL
3. 修改解析服务支持方言切换
4. 修改诊断 Provider
5. 修改自动补全 Provider

### Phase 5: 前端适配 (1 天)

1. 修改连接对话框
2. 更新 store
3. 更新国际化

### Phase 6: 测试验证 (2-3 天)

1. MySQL 回归测试
2. SQL Server 功能测试
3. 边界情况处理

**总计：14-20 人天**（原预估 12-16 人天）

## 8. 风险与应对（更新后）

| 风险 | 影响 | 应对措施 | 状态 |
|------|------|----------|------|
| ~~sql-parser-cst 不支持 SQL Server~~ | ~~高~~ | ~~使用 mysql dialect 作为替代~~ | ✅ **已解决**：使用 `node-sql-parser` |
| SQL Server 执行计划格式差异大 | 中 | 使用 `xml2js` 解析 XML 格式 | ✅ **已解决**：已实现解析逻辑 |
| 数据类型映射复杂 | 低 | 建立完善的类型映射表 | ✅ **已解决**：包含空间类型 |
| Windows 认证测试困难 | 中 | 优先实现 SQL 认证 | ⚠️ 待处理 |
| `node-sql-parser` 解析准确性 | 中 | 充分测试 TSQL 特有语法 | ⚠️ 需验证 |
| 历史连接数据迁移 | 低 | 使用 `getConnectionType()` 函数默认 mysql | ✅ **已解决** |

## 9. 实施注意事项

本节记录在方案审查过程中发现的关键注意事项，实施时必须遵循。

### 9.1 NVARCHAR 长度计算差异

**问题描述**：SQL Server 的 `NVARCHAR` 使用 UTF-16 编码，`sys.columns.max_length` 返回的是**字节数**而非字符数。

| 定义 | `max_length` 值 | 实际字符数 |
|------|-----------------|-----------|
| `NVARCHAR(100)` | 200 | 100 |
| `NVARCHAR(255)` | 510 | 255 |
| `NVARCHAR(MAX)` | -1 | 不限 |

**解决方案**：在 `getColumns` 方法中处理 Unicode 类型的长度计算：

```typescript
// src/main/database/sqlserver/driver.ts

async getColumns(connectionId: string, database: string, table: string): Promise<ColumnMeta[]> {
  // ... 查询代码 ...

  return result.recordset.map(r => {
    const typeName = r.data_type.toLowerCase()
    
    // Unicode 类型（nchar, nvarchar, ntext）长度需要除以 2
    const isUnicodeType = typeName.startsWith('n') && 
      ['nchar', 'nvarchar', 'ntext'].includes(typeName)
    
    const displayLength = r.max_length === -1 
      ? 'MAX'  // NVARCHAR(MAX)
      : isUnicodeType 
        ? Math.floor(r.max_length / 2)  // Unicode 类型除以 2
        : r.max_length
    
    // 构建完整的列类型显示
    const columnType = this.buildColumnType(typeName, displayLength, r.precision, r.scale)
    
    return {
      name: r.column_name,
      type: this.mapSqlServerTypeToStandard(typeName),
      nativeType: typeName,
      columnType: columnType,  // 如: NVARCHAR(255)，而非 NVARCHAR(510)
      // ... 其他字段
    }
  })
}

/**
 * 构建完整的列类型显示字符串
 */
private buildColumnType(
  typeName: string, 
  length: number | string, 
  precision: number, 
  scale: number
): string {
  const upperType = typeName.toUpperCase()
  
  // 需要长度的类型
  if (['VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR', 'VARBINARY', 'BINARY'].includes(upperType)) {
    return `${upperType}(${length})`
  }
  
  // 需要精度和小数位的类型
  if (['DECIMAL', 'NUMERIC'].includes(upperType)) {
    return `${upperType}(${precision},${scale})`
  }
  
  // 其他类型直接返回
  return upperType
}
```

### 9.2 Windows 域认证延后实现

**建议**：Windows 域认证功能复杂且测试困难，建议分阶段实施：

| 阶段 | 认证方式 | 优先级 |
|------|---------|--------|
| Phase 1 (v1.0) | SQL Server 认证 (用户名/密码) | ✅ 必须 |
| Phase 2 (v1.1) | Windows 域认证 | ⚠️ 延后 |

**Phase 1 实现**：
```typescript
const sqlConfig: sql.config = {
  server: config.host,
  port: config.port,
  user: config.username,
  password: config.password,
  // ...
}
```

**Phase 2 实现（延后）**：
```typescript
// Windows 域认证需要额外配置
if (config.options?.domain) {
  sqlConfig.domain = config.options.domain
  // 可能需要使用 Windows 凭据
  sqlConfig.authentication = {
    type: 'ntlm',
    options: {
      domain: config.options.domain,
      userName: config.username,
      password: config.password
    }
  }
}
```

### 9.3 配置文件部署

**重要**：`sqlserver-functions.json` 需要在构建时复制到 `resources/` 目录。

**当前位置**：
```
requirements/tsql/sqlserver-functions.json  (设计时参考)
```

**部署位置**：
```
resources/sqlserver-functions.json          (运行时使用)
```

**实现步骤**：

1. 在 Phase 5（前端适配）时，将文件复制到正确位置
2. 更新 `vite.config.ts` 或构建脚本，确保打包时包含该文件

```typescript
// vite.config.ts - 确保 resources 目录被正确复制
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      // 确保 resources 目录被正确复制到输出
    }
  },
  // 或使用 vite-plugin-static-copy 插件
})
```

**目录结构**：
```
resources/
├── mysql-functions.json       (已存在)
└── sqlserver-functions.json   (需复制)
```

### 9.4 测试优先级

根据风险和使用频率，建议按以下优先级进行测试：

| 优先级 | 功能 | 测试要点 |
|--------|------|----------|
| **高** | 连接管理 | 连接、断开、重连、超时处理 |
| **高** | 查询执行 | SELECT、INSERT、UPDATE、DELETE、事务 |
| **高** | 元数据获取 | 数据库列表、表列表、列信息（特别注意 NVARCHAR 长度） |
| **中** | DDL 操作 | CREATE TABLE、ALTER TABLE、DROP TABLE |
| **中** | 批量执行 | 多语句执行、GO 分隔符处理 |
| **低** | 执行计划解析 | XML 解析、计划展示 |
| **低** | 高级功能 | 存储过程、函数、触发器 |

### 9.5 GO 批处理分隔符处理

**问题**：SQL Server 客户端工具（如 SSMS）使用 `GO` 作为批处理分隔符，但 `GO` 不是 T-SQL 关键字。

**影响**：
- `node-sql-parser` 可能无法解析包含 `GO` 的脚本
- `mssql` 驱动会将 `GO` 作为普通 SQL 执行，导致语法错误

**解决方案**：在执行前预处理 SQL 脚本，按 `GO` 分割后分别执行：

```typescript
/**
 * 预处理 SQL Server 脚本，按 GO 分隔符拆分
 */
function splitBySeparator(sql: string): string[] {
  // GO 必须单独成行（忽略大小写）
  const regex = /^\s*GO\s*$/gim
  return sql.split(regex).filter(s => s.trim().length > 0)
}

// 使用示例
async executeBatch(connectionId: string, sql: string): Promise<...> {
  const batches = splitBySeparator(sql)
  const results = []
  
  for (const batch of batches) {
    const result = await info.pool.request().query(batch)
    results.push(result)
  }
  
  return { success: true, results }
}
```

## 10. 配置文件说明

本方案包含两个 JSON 配置文件，用于支持 SQL Server 的类型映射和函数列表。

### 10.1 `type-mapping.json` - 数据类型映射表

**文件位置**: `requirements/tsql/type-mapping.json`

**作用**: 定义 MySQL、SQL Server 和标准类型之间的映射关系，用于程序内部类型转换。

**注意**: 用户界面始终显示**原生类型**（如 `NVARCHAR(255)`），映射表仅用于程序内部逻辑处理。

**结构说明**:

```json
{
  "sqlserver_to_standard": {
    "nvarchar": { 
      "standardType": "VARCHAR",   // 映射为标准类型
      "isUnicode": true            // Unicode 标记
    }
  },
  "standard_to_sqlserver": {
    "VARCHAR": { 
      "sqlServerType": "VARCHAR",  // 反向映射
      "defaultLength": 255 
    }
  },
  "mysql_to_sqlserver": {
    "JSON": { 
      "sqlServerType": "NVARCHAR(MAX)",
      "notes": "SQL Server 2016+ 支持 JSON 函数"
    }
  }
}
```

**使用场景**:

| 场景 | 使用方式 |
|------|----------|
| 结果格式化 | 根据 `standardType` 选择格式化器 |
| 表设计生成 DDL | 根据数据库类型选择对应的类型名称 |
| 类型兼容性检查 | 查询映射关系判断类型兼容性 |

---

### 10.2 `sqlserver-functions.json` - SQL Server 函数列表

**文件位置**: `requirements/tsql/sqlserver-functions.json`

**作用**: 定义 SQL Server T-SQL 内置函数列表，用于 SQL 编辑器的**自动补全**功能。

**结构说明**:

```json
{
  "categories": {
    "aggregate": {
      "label": "聚合函数",
      "functions": [
        {
          "name": "COUNT",                              // 函数名
          "signature": "COUNT([ALL \| DISTINCT] expression)",  // 函数签名
          "returnType": "INT",                          // 返回类型
          "description": "返回组中的项数"               // 描述
        }
      ]
    },
    "string": { "label": "字符串函数", "functions": [...] },
    "datetime": { "label": "日期时间函数", "functions": [...] }
  }
}
```

**与 MySQL 函数列表的关系**:

| 数据库 | 配置文件 | 位置 |
|--------|----------|------|
| MySQL | `mysql-functions.json` | `resources/mysql-functions.json` |
| SQL Server | `sqlserver-functions.json` | `resources/sqlserver-functions.json` |

**实现建议**:

```typescript
// 根据数据库类型加载对应的函数列表
function loadFunctions(dbType: DatabaseType): FunctionMetadata[] {
  const filePath = dbType === 'mysql' 
    ? 'resources/mysql-functions.json'
    : 'resources/sqlserver-functions.json'  // 复制到 resources 目录
  
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}
```

---

## 11. 附录

### 11.1 SQL Server 与 MySQL 差异对照表

| 特性 | MySQL | SQL Server |
|------|-------|------------|
| 默认端口 | 3306 | 1433 |
| 系统数据库 | mysql, information_schema | master, tempdb, model, msdb |
| 标识符引用 | `` ` `` | `[]` 或 `"` |
| 字符串连接 | `CONCAT()` | `+` |
| 当前时间 | `NOW()` | `GETDATE()` |
| 分页 | `LIMIT offset, count` | `OFFSET ... FETCH NEXT` |
| 自增列 | `AUTO_INCREMENT` | `IDENTITY(seed, increment)` |
| 执行计划 | `EXPLAIN` | `SET SHOWPLAN_XML` |
| 元数据视图 | `information_schema` | `sys` 架构 + `INFORMATION_SCHEMA` |
| 注释语法 | `#`, `--`, `/* */` | `--`, `/* */` |

### 11.2 SQL Server 数据类型映射

| SQL Server Type | Standard Type | 说明 |
|-----------------|---------------|------|
| `INT` | `INTEGER` | |
| `BIGINT` | `BIGINT` | |
| `SMALLINT` | `SMALLINT` | |
| `TINYINT` | `TINYINT` | |
| `VARCHAR(n)` | `VARCHAR` | |
| `NVARCHAR(n)` | `VARCHAR` | Unicode |
| `TEXT` | `TEXT` | |
| `NTEXT` | `TEXT` | Unicode |
| `DECIMAL(p,s)` | `DECIMAL` | |
| `NUMERIC(p,s)` | `DECIMAL` | |
| `FLOAT` | `FLOAT` | |
| `REAL` | `FLOAT` | |
| `DATETIME` | `DATETIME` | |
| `DATETIME2` | `DATETIME` | 更高精度 |
| `SMALLDATETIME` | `DATETIME` | 低精度 |
| `DATE` | `DATE` | |
| `TIME` | `TIME` | |
| `BIT` | `BOOLEAN` | |
| `UNIQUEIDENTIFIER` | `UUID` | |
| `VARBINARY` | `BINARY` | |
| `IMAGE` | `BLOB` | |
| `XML` | `XML` | |
| `MONEY` | `DECIMAL` | |
| `SMALLMONEY` | `DECIMAL` | |
| `GEOGRAPHY` | `GEOGRAPHY` | 空间类型 |
| `GEOMETRY` | `GEOMETRY` | 空间类型 |
| `HIERARCHYID` | `HIERARCHYID` | 层次结构类型 |

### 11.3 关键变更总结

| 变更项 | 原方案 | 调整后方案 | 原因 |
|--------|--------|------------|------|
| SQL 解析器 | `sql-parser-cst` | `node-sql-parser` | 支持 SQL Server 语法 |
| 执行计划解析 | 未实现 | 使用 `xml2js` 解析 XML | SQL Server 返回 XML 格式 |
| 类型映射 | 基础类型 | 增加空间类型 | 完整性考虑 |
| 实施时间 | 12-16 人天 | 14-20 人天 | 解析器替换工作量 |

---

**文档版本**: 2.2（补充向后兼容设计）  
**更新日期**: 2026-02-05  
**变更记录**: 
- v2.2: 补充向后兼容设计（历史连接默认 mysql、数据迁移函数、连接对话框处理）
- v2.1: 补充实施注意事项（NVARCHAR 长度、Windows 认证、GO 分隔符等）、新增 Phase 0 预验证步骤
- v2.0: 使用 `node-sql-parser` 替代 `sql-parser-cst`，补充 XML 执行计划解析
- v1.0: 初始版本
