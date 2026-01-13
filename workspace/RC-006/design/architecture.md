---
change_id: RC-006
change_title: SQL工具用户体验优化架构设计
document_type: architecture-design
stage: design
created_at: 2026-01-13T11:00:00Z
author: AI Assistant
version: 1.0
---

# 系统架构设计文档

## 1. 架构概述

### 1.1 架构风格决策

**选择**: 模块化单体架构（基于现有Electron架构）

**理由**:
- 系统规模: 6个核心功能模块，属于中小型应用
- 团队规模: 小型开发团队（< 10人）
- 性能要求: 桌面应用，用户体验优先
- 部署复杂度: 桌面应用需要简单的部署和分发

**权衡**:
- 优点: 开发简单、部署容易、事务一致性、调试方便
- 缺点: 扩展性相对有限、技术栈相对固定
- 应对措施: 通过模块化设计保持代码清晰，为未来重构预留空间

### 1.2 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
├─────────────────────────────────────────────────────────────┤
│  Connection Manager  │  Query Executor  │  Language Server  │
│  - 连接池管理        │  - SQL执行       │  - 智能提示       │
│  - 连接保活          │  - 结果处理       │  - 语法检查       │
│  - 元数据缓存        │  - 错误处理       │  - 元数据同步     │
└─────────────────────────────────────────────────────────────┘
                              │ IPC
┌─────────────────────────────────────────────────────────────┐
│                   Electron Renderer Process                 │
├─────────────────────────────────────────────────────────────┤
│  SQL Editor Module   │  Result Panel    │  Connection Tree  │
│  - 多标签页管理      │  - 单一结果页签   │  - 树状结构       │
│  - 过滤选择器        │  - JSON编辑优化   │  - 节点过滤       │
│  - Monaco编辑器      │  - 数据修改确认   │  - 右键菜单       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                        │
│  - 用户数据库连接                                           │
│  - 表结构元数据                                             │
│  - 查询结果数据                                             │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术选型

### 2.1 现有技术栈（保持不变）

**桌面应用框架**:
- Electron 28.x - 跨平台桌面应用框架
- 理由: 已有成熟架构，团队熟悉，跨平台支持

**前端技术栈**:
- Vue 3.4+ - 前端框架
- TypeScript 5.x - 类型安全
- Pinia - 状态管理
- Element Plus - UI组件库
- Monaco Editor - 代码编辑器
- 理由: 现有技术栈成熟稳定，团队熟悉度高

**后端技术栈**:
- Node.js 20.x - 运行时环境
- mysql2 - MySQL数据库驱动
- 理由: 与Electron主进程集成良好，性能优秀

### 2.2 新增技术组件

**过滤组件**:
- 自定义Vue组件 - 实现下拉选择器过滤功能
- 理由: 满足特定的过滤需求，与现有UI风格一致

**状态管理增强**:
- 扩展现有Pinia stores - 支持独立的过滤状态管理
- 理由: 复用现有架构，保持一致性

## 3. 模块/服务划分

### 3.1 前端模块重构

#### 3.1.1 结果管理模块（Result Management）
**职责**:
- 管理每个编辑器的单一"结果"页签
- 处理查询结果覆盖逻辑
- 管理数据修改确认对话框

**核心组件**:
- `ResultStore` (已存在，需修改)
- `ResultPanel.vue` (需修改)
- `SaveConfirmDialog.vue` (新增)

**修改点**:
```typescript
// 修改 handleQueryResults 方法
// 从: 创建多个 "结果1", "结果2" 页签
// 到: 只保留一个 "结果" 页签，覆盖内容
```

#### 3.1.2 连接选择器模块（Connection Selector）
**职责**:
- 提供服务器/数据库下拉选择
- 实现输入过滤功能
- 保持选择状态同步

**核心组件**:
- `FilterableSelect.vue` (新增)
- `ConnectionSelector.vue` (修改现有)

**技术实现**:
```vue
<!-- 过滤选择器组件 -->
<template>
  <el-select
    v-model="selectedValue"
    filterable
    :filter-method="filterMethod"
    placeholder="请选择或输入过滤"
  >
    <el-option
      v-for="item in filteredOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
```

#### 3.1.3 树组件过滤模块（Tree Filter）
**职责**:
- 管理数据库树节点的独立过滤状态
- 提供悬停过滤按钮交互
- 实现过滤逻辑和状态持久化

**核心组件**:
- `TreeNodeFilter.vue` (新增)
- `ConnectionTree.vue` (修改现有)

**状态管理**:
```typescript
interface TreeFilterState {
  [databaseNodeId: string]: {
    filterText: string
    isFiltering: boolean
    filteredNodes: string[]
  }
}
```

#### 3.1.4 JSON编辑模块（JSON Editor）
**职责**:
- 优化JSON字段的显示格式
- 提供与字符串字段一致的编辑体验
- 处理JSON序列化/反序列化

**核心组件**:
- `ResultTable.vue` (修改现有)
- JSON渲染逻辑优化

### 3.2 后端模块重构

#### 3.2.1 连接管理模块（Connection Manager）
**职责**:
- 实现连接保活机制
- 管理连接池状态
- 处理连接异常和重连

**修改点**:
```typescript
// 新增连接状态检测
async function ensureConnection(connectionId: string): Promise<void> {
  const connection = getConnection(connectionId)
  if (!connection || connection.destroyed) {
    // 自动重连逻辑
    await reconnect(connectionId)
  }
}

// 在每次SQL执行前调用
export async function executeWithConnectionCheck(
  connectionId: string, 
  sql: string
): Promise<QueryResult[]> {
  await ensureConnection(connectionId)
  return executeQuery(connectionId, sql)
}
```

#### 3.2.2 元数据同步模块（Metadata Sync）
**职责**:
- 监听树组件刷新事件
- 同步元数据到所有相关编辑器
- 处理同步失败情况

**核心功能**:
```typescript
// 元数据同步服务
export class MetadataSyncService {
  // 刷新触发的全局同步
  async syncMetadataForDatabase(connectionId: string, database: string) {
    try {
      // 1. 重新获取表结构
      const tables = await getTables(connectionId, database)
      const columns = await getAllColumns(connectionId, database)
      
      // 2. 更新语言服务器缓存
      await updateLanguageServerMetadata(connectionId, database, { tables, columns })
      
      // 3. 通知所有相关编辑器
      broadcastMetadataUpdate(connectionId, database)
    } catch (error) {
      // 4. 失败时使用alert提示
      showAlert(`元数据同步失败: ${error.message}`)
    }
  }
}
```

## 4. 非功能需求实现

### 4.1 性能优化

**响应时间要求**:
- 过滤操作响应时间 < 200ms
- 自动重连操作 < 3秒  
- 智能提示更新 < 1秒

**实现方案**:
```typescript
// 过滤防抖优化
const debouncedFilter = debounce((filterText: string) => {
  // 过滤逻辑
}, 150) // 150ms防抖，确保200ms内响应

// 连接检测优化
async function quickConnectionCheck(connection: Connection): Promise<boolean> {
  try {
    await connection.ping() // 轻量级检测
    return true
  } catch {
    return false
  }
}

// 元数据缓存优化
const metadataCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存
```

### 4.2 可用性方案

**连接稳定性**:
- 长时间空闲连接恢复成功率 > 95%
- 自动重连机制，透明处理连接断开

**实现方案**:
```typescript
// 连接保活策略
export class ConnectionKeepAlive {
  private reconnectAttempts = new Map<string, number>()
  
  async ensureConnection(connectionId: string): Promise<void> {
    const connection = getConnection(connectionId)
    
    // 检测连接状态
    if (!connection || !(await this.isConnectionAlive(connection))) {
      await this.reconnectWithRetry(connectionId)
    }
  }
  
  private async reconnectWithRetry(connectionId: string): Promise<void> {
    const config = getConnectionConfig(connectionId)
    const attempts = this.reconnectAttempts.get(connectionId) || 0
    
    try {
      await connect(config)
      this.reconnectAttempts.set(connectionId, 0) // 重置重试次数
    } catch (error) {
      if (attempts < 3) {
        this.reconnectAttempts.set(connectionId, attempts + 1)
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒后重试
        return this.reconnectWithRetry(connectionId)
      } else {
        throw new Error(`连接失败，已重试${attempts}次: ${error.message}`)
      }
    }
  }
}
```

### 4.3 易用性要求

**界面简洁性**:
- 每个编辑器固定显示1个"结果"页签
- 过滤功能易于发现和使用
- 错误信息清晰明确

**实现方案**:
```typescript
// 结果页签管理
function handleQueryResults(results: QueryResult[]) {
  const state = getOrCreateTabState(currentEditorTabId.value)
  
  // 检查是否有未保存修改
  if (hasUnsavedChanges(state)) {
    const action = await showSaveConfirmDialog()
    if (action === 'cancel') return
    if (action === 'save') await saveChanges(state)
  }
  
  // 清空现有结果，只保留一个"结果"页签
  state.tabs = []
  
  // 处理新结果...
  if (results.length > 0) {
    state.tabs.push({
      id: 'result',
      title: '结果', // 固定名称
      type: 'resultset',
      data: results[0]
    })
  }
}
```

### 4.4 兼容性要求

**向后兼容**:
- 不影响现有的数据编辑和提交功能
- 保持现有的连接管理机制
- JSON编辑与字符串字段体验一致

**数据完整性**:
- 确保JSON编辑不破坏数据结构
- 依赖数据库层面的数据验证

## 5. 部署架构

### 5.1 开发环境

**本地开发**:
```bash
# 开发模式启动
npm run dev

# 构建应用
npm run build

# 打包应用
npm run pack:win  # Windows
npm run pack:mac  # macOS
npm run pack:linux # Linux
```

**开发工具链**:
- Vite - 快速构建和热重载
- electron-builder - 应用打包
- TypeScript - 类型检查
- ESLint - 代码质量检查

### 5.2 测试环境

**自动化测试**:
```typescript
// 单元测试 - 结果页签管理
describe('ResultStore', () => {
  test('should keep only one result tab', () => {
    const store = useResultStore()
    store.handleQueryResults([mockResult1])
    expect(store.tabs.length).toBe(1)
    expect(store.tabs[0].title).toBe('结果')
    
    store.handleQueryResults([mockResult2])
    expect(store.tabs.length).toBe(1) // 仍然只有一个
  })
})

// 集成测试 - 连接保活
describe('Connection Keep-Alive', () => {
  test('should reconnect after connection lost', async () => {
    const connectionId = 'test-conn'
    await connect(mockConfig)
    
    // 模拟连接断开
    await simulateConnectionLoss(connectionId)
    
    // 执行SQL应该自动重连
    const result = await executeWithConnectionCheck(connectionId, 'SELECT 1')
    expect(result).toBeDefined()
  })
})
```

### 5.3 生产环境

**应用分发**:
- Windows: .exe安装包 + 便携版
- macOS: .dmg安装包 + App Store
- Linux: .AppImage + .deb包

**更新机制**:
```typescript
// 自动更新检查
import { autoUpdater } from 'electron-updater'

autoUpdater.checkForUpdatesAndNotify()
autoUpdater.on('update-available', () => {
  // 通知用户有新版本
})
```

## 6. 架构演进计划

### 6.1 当前局限

- 单一进程架构，大量数据处理时可能影响UI响应
- 连接管理相对简单，缺少连接池优化
- 元数据缓存策略需要进一步优化

### 6.2 演进方向

**短期优化（3个月内）**:
- 实现Worker线程处理大数据量查询
- 优化连接池管理，支持连接复用
- 增强元数据缓存策略

**中期规划（6-12个月）**:
- 支持多数据库类型（PostgreSQL、SQLite等）
- 增加查询性能分析功能
- 实现查询历史和收藏功能

**长期规划（1年以上）**:
- 考虑Web版本支持
- 团队协作功能（查询分享、团队连接管理）
- 插件系统支持

### 6.3 具体计划

**Phase 1 - 当前需求实现（RC-006）**:
- Week 1: 结果页签优化 + 连接保活机制
- Week 2: 过滤功能实现（选择器 + 树组件）
- Week 3: JSON编辑优化 + 元数据同步

**Phase 2 - 性能优化**:
- 大数据量处理优化
- 连接池性能提升
- 内存使用优化

**Phase 3 - 功能扩展**:
- 多数据库支持
- 高级查询功能
- 用户体验增强

## 7. 架构决策记录 (ADR)

### ADR-001: 保持单体架构而非微服务化

**状态**: 已接受
**日期**: 2026-01-13
**决策者**: 开发团队

**背景**:
需要优化用户体验，考虑是否重构为微服务架构。

**决策**:
保持现有的Electron单体架构，通过模块化改进代码结构。

**理由**:
- 桌面应用场景，单体架构更适合
- 团队规模小，微服务会增加复杂度
- 现有架构稳定，重构风险大
- 用户体验优化不需要架构级别的变更

**后果**:
- 优点: 开发效率高、部署简单、调试容易
- 缺点: 扩展性相对有限
- 风险: 代码耦合度可能增加

**替代方案**:
| 方案 | 优点 | 缺点 | 否决原因 |
|------|------|------|----------|
| 微服务架构 | 扩展性好、技术异构 | 复杂度高、运维成本大 | 不适合桌面应用场景 |
| 插件架构 | 扩展性好、模块独立 | 开发复杂、接口设计难 | 当前需求不需要插件化 |

### ADR-002: 选择懒加载重连策略

**状态**: 已接受  
**日期**: 2026-01-13
**决策者**: 开发团队

**背景**:
需要解决长时间空闲后连接断开的问题，考虑连接保活策略。

**决策**:
采用懒加载重连策略，在SQL执行时检测并重连。

**理由**:
- 避免不必要的网络开销
- 实现简单，维护成本低
- 用户无感知，体验好
- 符合桌面应用的使用模式

**后果**:
- 优点: 资源消耗低、实现简单、用户体验好
- 缺点: 首次执行可能有轻微延迟
- 风险: 重连失败需要合适的错误处理

**替代方案**:
| 方案 | 优点 | 缺点 | 否决原因 |
|------|------|------|----------|
| 定时心跳 | 连接始终可用 | 资源消耗大、网络开销 | 桌面应用不需要始终保持连接 |
| 混合策略 | 平衡性能和可用性 | 实现复杂 | 过度设计，当前需求不需要 |