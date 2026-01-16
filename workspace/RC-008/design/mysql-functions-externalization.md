---
name: mysql-functions-externalization
description: MySQL 函数配置外部化，解耦代码与数据
category: design
keywords: [MySQL函数, 配置外部化, 自动补全, 资源文件]
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

### 1.2 解决目标

- 将 MySQL 函数数据从代码中分离，存储在外部 JSON 配置文件
- 提供完整的 MySQL 8.0 内置函数列表（约 300+ 函数）
- 支持用户编辑配置文件扩展函数列表，无需重新编译

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
│    提取所有分类的函数 → this.functions[]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 文件结构

```
项目根目录/
├── resources/
│   └── mysql-functions.json    # MySQL 内置函数配置（~300+ 函数）
├── src/
│   └── main/
│       ├── utils/
│       │   └── resourcePath.ts # 资源路径工具函数
│       └── sql-language-server/
│           └── services/
│               └── metadataService.ts  # 修改后的元数据服务
└── package.json                # 新增 extraResources 配置
```

### 2.3 JSON 配置文件格式

```json
{
  "version": "1.0.0",
  "description": "MySQL 8.0 内置函数列表",
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
    "string": { ... },
    "numeric": { ... },
    "datetime": { ... },
    "json": { ... },
    "window": { ... },
    ...
  }
}
```

### 2.4 函数分类（共 19 个分类）

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

完整的 MySQL 8.0 内置函数列表，按分类组织。

### 3.2 修改文件

#### `src/main/sql-language-server/services/metadataService.ts`

**主要变更：**
- 删除硬编码的 `MYSQL_FUNCTIONS` 数组
- 新增 `loadFunctions()` 方法从 JSON 文件加载函数
- 新增 `reloadFunctions()` 方法支持热更新
- 新增 `getFunctionsLoadStatus()` 方法获取加载状态
- 新增 `getFunctionsByCategory()` 方法按分类获取函数

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
  "returnType": "VARCHAR"
}
```

4. 保存文件，重启应用即可生效

### 4.2 热更新（未来扩展）

可通过 IPC 调用 `metadataService.reloadFunctions()` 实现不重启应用更新函数列表。

## 5. 优势

| 方面 | 改进前 | 改进后 |
|------|--------|--------|
| 函数数量 | ~50 | ~350+ |
| 更新方式 | 修改代码+重新编译 | 编辑 JSON 文件 |
| 代码耦合 | 高（硬编码） | 低（配置分离） |
| 扩展性 | 差 | 好（支持用户自定义） |
| 可维护性 | 差 | 好（数据与逻辑分离） |

## 6. 测试验证

1. 开发环境启动，验证函数补全正常
2. 打包后启动，验证函数补全正常
3. 修改 JSON 文件后重启，验证新函数生效
