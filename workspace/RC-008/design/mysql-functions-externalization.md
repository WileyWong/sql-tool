---
name: mysql-functions-externalization
description: MySQL 函数配置外部化，解耦代码与数据，支持版本过滤
category: design
keywords: [MySQL函数, 配置外部化, 自动补全, 资源文件, 版本过滤]
change_id: RC-008
change_title: MySQL 函数配置外部化
change_status: implemented
stage: design
created_at: 2026-01-16
updated_at: 2026-01-16
author: AI Assistant
---

# RC-008: MySQL 函数配置外部化

## 1. 背景与问题

### 1.1 原有问题

1. **函数不全**：原 `metadataService.ts` 中硬编码约 50 个 MySQL 函数，而 MySQL 8.0 实际有 400+ 内置函数
2. **代码耦合**：函数数据硬编码在 TypeScript 文件中，更新需要修改代码并重新编译
3. **版本差异**：不同 MySQL 版本支持的函数不同（如窗口函数仅 8.0+ 支持），无法根据连接的数据库版本过滤

### 1.2 解决目标

- 将 MySQL 函数数据从代码中分离，存储在外部 JSON 配置文件
- 提供完整的 MySQL 8.0 内置函数列表（约 300+ 函数）
- 支持用户编辑配置文件扩展函数列表，无需重新编译
- **支持根据连接的数据库版本自动过滤函数列表**

## 2. 解决方案

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    资源文件架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  开发环境:                                                   │
│    项目根目录/resources/mysql-functions.json                 │
│                                                             │
│  生产环境 (打包后):                                          │
│    process.resourcesPath/resources/mysql-functions.json     │
│                                                             │
│  加载流程:                                                   │
│    MetadataService.constructor()                            │
│         ↓                                                   │
│    getResourcePath('mysql-functions.json')                  │
│         ↓                                                   │
│    fs.readFileSync() → JSON.parse()                         │
│         ↓                                                   │
│    提取所有分类的函数 → this.allFunctions[]                  │
│         ↓                                                   │
│    版本过滤 → this.functions[] (供自动补全使用)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    版本过滤流程                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  用户连接数据库                                              │
│         ↓                                                   │
│  connection-manager.connect() 获取 VERSION()                │
│         ↓                                                   │
│  返回 serverVersion (如 "8.0.32")                           │
│         ↓                                                   │
│  connection store 调用 setDatabaseVersion()                 │
│         ↓                                                   │
│  MetadataService 根据版本过滤函数                            │
│    - 检查 minVersion (如窗口函数需要 8.0+)                  │
│    - 检查 maxVersion (如废弃函数)                           │
│         ↓                                                   │
│  自动补全只显示当前版本支持的函数                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 文件结构

```
项目根目录/
├── resources/
│   └── mysql-functions.json    # MySQL 内置函数配置（~350+ 函数）
├── src/
│   ├── main/
│   │   ├── utils/
│   │   │   └── resourcePath.ts # 资源路径工具函数
│   │   ├── database/
│   │   │   └── connection-manager.ts  # 连接管理（返回版本）
│   │   ├── ipc/
│   │   │   └── connection.ts   # IPC 处理（传递版本）
│   │   └── sql-language-server/
│   │       ├── index.ts        # Language Server（版本设置 IPC）
│   │       ├── types/
│   │       │   └── index.ts    # FunctionMetadata 类型
│   │       └── services/
│   │           └── metadataService.ts  # 元数据服务（版本过滤）
│   ├── preload/
│   │   └── index.ts            # setDatabaseVersion API
│   ├── renderer/
│   │   └── stores/
│   │       └── connection.ts   # 连接 store（调用版本设置）
│   └── shared/
│       └── types/
│           └── connection.ts   # ConnectionInfo 类型
└── package.json                # extraResources 配置
```

### 2.3 JSON 配置文件格式

```json
{
  "version": "1.1.0",
  "description": "MySQL 8.0 内置函数列表，支持版本过滤",
  "lastUpdated": "2026-01-16",
  "source": "MySQL 8.0 Reference Manual",
  "categories": {
    "aggregate": {
      "label": "聚合函数",
      "functions": [
        {
          "name": "COUNT",
          "signature": "COUNT([DISTINCT] expr)",
          "description": "返回行数",
          "returnType": "BIGINT"
        }
      ]
    },
    "window": {
      "label": "窗口函数",
      "functions": [
        {
          "name": "ROW_NUMBER",
          "signature": "ROW_NUMBER() OVER ([partition_clause] order_clause)",
          "description": "返回当前行在其分区中的行号",
          "returnType": "BIGINT",
          "minVersion": "8.0.0"
        }
      ]
    },
    "json": {
      "label": "JSON函数",
      "functions": [
        {
          "name": "JSON_ARRAY",
          "signature": "JSON_ARRAY([val[, val] ...])",
          "description": "创建 JSON 数组",
          "returnType": "JSON",
          "minVersion": "5.7.0"
        },
        {
          "name": "JSON_MERGE",
          "signature": "JSON_MERGE(json_doc, json_doc[, json_doc] ...)",
          "description": "合并 JSON 文档（已废弃，请使用 JSON_MERGE_PRESERVE）",
          "returnType": "JSON",
          "minVersion": "5.7.0",
          "maxVersion": "8.0.3"
        }
      ]
    }
  }
}
```

### 2.4 版本约束字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `minVersion` | `string \| null` | 最低支持的 MySQL 版本，如 `"8.0.0"`。不设置表示所有版本支持 |
| `maxVersion` | `string \| null` | 最高支持的 MySQL 版本，如 `"8.0.3"`。不设置表示无上限 |

### 2.5 版本映射参考

| 函数/功能 | minVersion | maxVersion | 说明 |
|-----------|------------|------------|------|
| 窗口函数 (ROW_NUMBER, RANK, LAG, LEAD 等) | 8.0.0 | - | MySQL 8.0 新增 |
| JSON 函数 (JSON_ARRAY, JSON_OBJECT 等) | 5.7.0 | - | MySQL 5.7 新增 |
| JSON_TABLE, REGEXP_REPLACE | 8.0.4 | - | MySQL 8.0.4 新增 |
| JSON_OVERLAPS, JSON_SCHEMA_VALID | 8.0.17 | - | MySQL 8.0.17 新增 |
| JSON_MERGE | 5.7.0 | 8.0.3 | 已废弃 |
| 性能模式函数 | 8.0.16 | - | MySQL 8.0.16 新增 |

### 2.6 函数分类（共 19 个分类）

| 分类 | 标签 | 函数数量 |
|------|------|---------|
| aggregate | 聚合函数 | 19 |
| window | 窗口函数 | 11 |
| string | 字符串函数 | 52 |
| numeric | 数值函数 | 32 |
| datetime | 日期时间函数 | 57 |
| control | 流程控制函数 | 5 |
| cast | 类型转换函数 | 4 |
| json | JSON函数 | 32 |
| encryption | 加密和压缩函数 | 13 |
| information | 信息函数 | 18 |
| spatial | 空间函数 | 38 |
| bitwise | 位函数 | 7 |
| comparison | 比较函数 | 13 |
| misc | 杂项函数 | 19 |
| fulltext | 全文搜索函数 | 1 |
| xml | XML函数 | 2 |
| locking | 锁函数 | 5 |
| gtid | GTID函数 | 4 |
| performance | 性能模式函数 | 4 |
| replication | 复制函数 | 12 |

**总计：约 350+ 函数**

## 3. 实现细节

### 3.1 新增文件

#### `src/main/utils/resourcePath.ts`

```typescript
import { app } from 'electron'
import path from 'path'

export function getResourcePath(filename: string): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'resources', filename)
  }
  return path.join(app.getAppPath(), 'resources', filename)
}
```

#### `resources/mysql-functions.json`

完整的 MySQL 8.0 内置函数列表，按分类组织，包含版本约束信息。

### 3.2 修改文件

#### `src/main/sql-language-server/types/index.ts`

**新增版本字段：**

```typescript
export interface FunctionMetadata {
  name: string
  signature: string
  description?: string
  returnType?: string
  /** 最低支持的 MySQL 版本（如 "5.7.0", "8.0.0"） */
  minVersion?: string | null
  /** 最高支持的 MySQL 版本（如 "5.7.99"） */
  maxVersion?: string | null
}
```

#### `src/main/sql-language-server/services/metadataService.ts`

**主要变更：**
- 删除硬编码的 `MYSQL_FUNCTIONS` 数组
- 新增 `loadFunctions()` 方法从 JSON 文件加载函数
- 新增 `allFunctions` 数组存储原始函数列表
- 新增 `databaseVersion` 存储当前数据库版本
- 新增 `parseVersion()` 方法解析版本字符串
- 新增 `compareVersions()` 方法比较版本大小
- 新增 `isFunctionSupported()` 方法检查函数是否支持当前版本
- 新增 `setDatabaseVersion()` 方法设置版本并过滤函数
- 新增 `getDatabaseVersion()` 方法获取当前版本
- 新增 `getAllFunctions()` 方法获取未过滤的函数列表
- 新增 `reloadFunctions()` 方法支持热更新
- 新增 `getFunctionsLoadStatus()` 方法获取加载状态
- 新增 `getFunctionsByCategory()` 方法按分类获取函数

#### `src/main/sql-language-server/index.ts`

**新增 IPC 处理器：**

```typescript
ipcMain.handle('sql-ls:setDatabaseVersion', async (
  _event: IpcMainInvokeEvent,
  version: string | null
) => {
  try {
    metadataService.setDatabaseVersion(version)
    return { success: true, functionsCount: metadataService.getFunctions().length }
  } catch (error: any) {
    console.error('设置数据库版本失败:', error)
    return { success: false, error: error.message }
  }
})
```

#### `src/main/database/connection-manager.ts`

**修改 connect() 返回版本信息：**

```typescript
export async function connect(config: ConnectionConfig): Promise<{ version: string }> {
  // ... 连接逻辑 ...
  const [rows] = await connection.query('SELECT VERSION() as version')
  const version = (rows as { version: string }[])[0]?.version || 'Unknown'
  return { version }
}
```

#### `src/main/ipc/connection.ts`

**修改返回 serverVersion：**

```typescript
const result = await connect(config)
return { success: true, message: '连接成功', serverVersion: result.version }
```

#### `src/preload/index.ts`

**新增 setDatabaseVersion API：**

```typescript
sqlLanguageServer: {
  // ...
  setDatabaseVersion: (version: string | null): Promise<{ success: boolean; functionsCount?: number; error?: string }> =>
    ipcRenderer.invoke('sql-ls:setDatabaseVersion', version),
}
```

**修改 connect 返回类型：**

```typescript
connect: (connectionId: string): Promise<{ success: boolean; message?: string; serverVersion?: string }> =>
  ipcRenderer.invoke(IpcChannels.CONNECTION_CONNECT, connectionId),
```

#### `src/shared/types/connection.ts`

**ConnectionInfo 新增版本字段：**

```typescript
export interface ConnectionInfo extends ConnectionConfig {
  status: ConnectionStatus
  error?: string
  /** 数据库服务器版本（连接成功后获取） */
  serverVersion?: string
}
```

#### `src/renderer/stores/connection.ts`

**修改 connect() 方法：**

```typescript
async function connect(connectionId: string) {
  // ...
  if (result.success) {
    conn.status = 'connected'
    conn.serverVersion = result.serverVersion
    
    // 通知 Language Server 数据库版本
    if (result.serverVersion) {
      await window.api.sqlLanguageServer.setDatabaseVersion(result.serverVersion)
    }
    // ...
  }
}
```

**修改 disconnect() 方法：**

```typescript
async function disconnect(connectionId: string) {
  // ...
  if (result.success) {
    conn.serverVersion = undefined
    // 清除 Language Server 数据库版本
    await window.api.sqlLanguageServer.setDatabaseVersion(null)
  }
}
```

#### `package.json`

新增 `extraResources` 配置：

```json
{
  "build": {
    "extraResources": [
      {
        "from": "resources",
        "to": "resources"
      }
    ]
  }
}
```

## 4. 使用说明

### 4.1 添加/修改函数

1. 打开 `resources/mysql-functions.json`
2. 找到对应的分类（如 `string` 字符串函数）
3. 在 `functions` 数组中添加或修改函数定义：

```json
{
  "name": "NEW_FUNCTION",
  "signature": "NEW_FUNCTION(arg1, arg2)",
  "description": "函数描述",
  "returnType": "VARCHAR",
  "minVersion": "8.0.0"
}
```

4. 保存文件，重启应用即可生效

### 4.2 版本过滤行为

- **连接 MySQL 8.0.32**：显示所有 `minVersion <= 8.0.32` 且 `maxVersion >= 8.0.32`（或无上限）的函数
- **连接 MySQL 5.7.44**：隐藏窗口函数（需要 8.0+）、JSON_TABLE（需要 8.0.4+）等
- **未连接数据库**：显示所有函数（不过滤）

### 4.3 热更新（未来扩展）

可通过 IPC 调用 `metadataService.reloadFunctions()` 实现不重启应用更新函数列表。

## 5. 优势

| 方面 | 改进前 | 改进后 |
|------|--------|--------|
| 函数数量 | ~50 | ~350+ |
| 更新方式 | 修改代码+重新编译 | 编辑 JSON 文件 |
| 代码耦合 | 高（硬编码） | 低（配置分离） |
| 扩展性 | 差 | 好（支持用户自定义） |
| 可维护性 | 差 | 好（数据与逻辑分离） |
| 版本适配 | 无 | 自动根据数据库版本过滤 |

## 6. 测试验证

1. 开发环境启动，验证函数补全正常
2. 打包后启动，验证函数补全正常
3. 修改 JSON 文件后重启，验证新函数生效
4. 连接 MySQL 5.7，验证窗口函数不显示
5. 连接 MySQL 8.0，验证所有函数正常显示
6. 断开连接，验证函数列表恢复完整
