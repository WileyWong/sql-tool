# RC-026 ER 图设计功能

## 1. 需求概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-026 |
| 需求名称 | ER 图（实体关系图）设计功能 |
| 提出日期 | 2026-06-22 |
| 优先级 | P1-高 |
| 影响范围 | 全栈（主进程+渲染进程） |

---

## 2. 需求背景

### 2.1 现状问题

当前 SQL Tool 只支持 SQL 编写和执行，用户在以下场景中存在不便：
- 需要可视化地查看数据库中表与表之间的关系
- 需要手工绘制 ER 图来设计数据库结构
- 无法在同一工具中完成"设计→编写 SQL→执行验证"的完整工作流

### 2.2 变更原因

- 竞品（如 Navicat、DBeaver）已支持反向工程生成 ER 图
- 用户在需求评审和数据库设计阶段需要 ER 图作为沟通工具
- 将 ER 图功能集成到 SQL 工具中，可以形成"设计→实现→验证"闭环

---

## 3. 变更内容

### 3.1 功能需求

| 序号 | 功能点 | 描述 | 验收标准 |
|------|--------|------|----------|
| 1 | 新建 ER 图 | 工具栏"新建 ER 图"按钮，可新建空白 ER 图画布 | 点击后新建标签页，显示空白画布 |
| 2 | 打开 ER 图文件 | 打开文件对话框支持 `.erd.json` 后缀的文件 | 打开后恢复画布上的表和连线 |
| 3 | ER 图标签页 | ER 图标签页与 SQL 编辑器标签页共存于同一 Tab 栏中 | ER 图标签页显示画布，而非代码编辑器 |
| 4 | 连接信息栏适配 | ER 图模式下禁用"Max Rows"输入框 | Max Rows 控件置灰不可编辑 |
| 5 | 添加表到画布 | 画布右键菜单"添加表"，弹出多选对话框选择数据库表 | 选中的表以圆角矩形绘制到画布上 |
| 6 | 表节点显示 | 圆角矩形显示表名和字段列表，最多显示前 5 个字段 | 字段超过 5 个时隐藏其余 |
| 7 | 表节点格式 | 选中表节点右键"格式"，可设置背景色 | 支持颜色选择，有默认背景色 |
| 8 | 画关系连线 | 鼠标悬停表节点右侧出现拖拽锚点，拖拽到目标表画线 | 连线走直角路径，自动避障 |
| 9 | 关系字段选择 | 双击连线弹出字段勾选对话框 | 勾选的关联字段显示在连线上 |
| 10 | 删除节点/连线 | 选中后右键删除或按 Del 键删除 | 节点和连线均可删除 |
| 11 | 选中高亮 | 点击表节点或连线，显示蓝色高亮边框，点击空白取消 | 节点显示蓝色边框（`#4fc3f7`），连线变蓝加粗 |
| 12 | 框选多选 | 空白区域左键拖拽绘制矩形，框内的节点/连线全部选中高亮 | 蓝色虚线框选矩形，选中后可批量删除 |
| 13 | 多选拖拽 | 多选后拖拽任一选中节点，所有选中节点同步移动 | ⚠️ 待实现（连线随节点自动更新路径） |
| 14 | 保存 ER 图 | 将画布数据序列化为 JSON 保存为 `.erd.json` 文件 | 保存后可重新打开恢复 |

### 3.2 非功能需求

| 类别 | 要求 |
|------|------|
| 用户体验 | UI 配色与现有暗色主题保持一致 |
| 代码架构 | ER 图核心代码新文件实现，与 SQL 编辑器代码分离 |
| 兼容性 | 支持 MySQL 和 SQL Server 的表结构获取 |
| 文件格式 | `.erd.json`，JSON 格式，包含画布元数据和节点/连线数据 |

---

## 4. 输入输出示例

### 示例 1：新建 ER 图

**操作：**
1. 点击工具栏"新建 ER 图"按钮

**期望结果：**
- 新建标签页，标题为"ER图1"
- 标签页内容区域显示空白画布（网格背景）
- 连接信息栏中 Max Rows 控件置灰不可编辑

### 示例 2：添加表到画布

**操作：**
1. 右键画布空白区域 → "添加表"
2. 弹出表选择器，列出当前连接数据库的所有表
3. 勾选 `users`、`orders`、`products` 三张表 → 确定

**期望结果：**
- 三张表以圆角矩形绘制到画布上，自动排列不重叠

     ┌─────────────────────┐
     │ users               │
     │─────────────────────│
     │ id          int     │
     │ name        varchar │
     │ email       varchar │
     │ created_at  datetime│
     │ status      tinyint │
     └─────────────────────┘

### 示例 3：画关系连线

**操作：**
1. 鼠标悬停 `users` 表节点，上下左右四个方向各出现一个拖拽锚点（小圆圈）
2. 从最近的端口拖出连线到 `orders` 表上释放

**期望结果：**
- 生成一条从 `users` 到 `orders` 的直角连线
- 连线自动避让其他表节点
- manhattan 路由器根据两表相对位置自动选择最优起点/终点端口

### 示例 4：设置关系字段

**操作：**
1. 双击 `users` → `orders` 的连线
2. 弹窗左侧显示 `users` 字段列表，右侧显示 `orders` 字段列表
3. 勾选 `users.id` 和 `orders.user_id`

**期望结果：**
- 连线标签显示 "id = user_id"

---

## 5. 影响分析

### 5.1 受影响的模块

| 模块 | 文件路径 | 修改类型 | 说明 |
|------|----------|----------|------|
| EditorTab 接口 | `src/renderer/stores/editor.ts` | 修改 | 新增 `tabType`、`erdData` 字段 |
| Editor Store | `src/renderer/stores/editor.ts` | 修改 | 新增 `createErdTab()`、`openErdFile()` 等方法 |
| 工具栏 | `src/renderer/components/Toolbar.vue` | 修改 | 新增"新建 ER 图"按钮 |
| SQL 编辑器（标签页容器） | `src/renderer/components/SqlEditor.vue` | 重构 | 退化为纯标签页容器，按 `tabType` 分发 |
| SQL 编辑器面板 | `src/renderer/components/SqlEditorPanel.vue` | **新增**（抽出） | 从 SqlEditor.vue 抽出的 Monaco Editor + 连接信息栏 |
| ER 图面板 | `src/renderer/components/ErDiagram/ErDiagramPanel.vue` | **新增** | ER 图标签页内容面板 |
| App.vue | `src/renderer/App.vue` | 修改 | 菜单监听新增 ER 图相关事件 |
| 主进程菜单模块 | `src/main/menu.ts` | 修改 | 新增"新建 ER 图"菜单项及 IPC 通道 |
| 文件 IPC 处理 | `src/main/ipc/file.ts` | 修改 | 打开文件过滤支持 `.json`（通过内容区分 ER 图） |
| ER 图画布组件 | `src/renderer/components/ErDiagram/ErCanvas.vue` | **新增** | ER 图主画布 |
| ER 图工具栏 | `src/renderer/components/ErDiagram/ErToolbar.vue` | **新增** | ER 图专属工具栏 |
| ER 图表节点 | `src/renderer/components/ErDiagram/ErTableNode.vue` | **新增** | 表节点 Vue 组件（x6-vue-shape） |
| ER 图 Store | `src/renderer/stores/erd.ts` | **新增** | ER 图状态管理 |
| 表选择器弹窗 | `src/renderer/components/ErDiagram/TableSelectorDialog.vue` | **新增** | 多选表弹窗 |
| 关系字段选择器 | `src/renderer/components/ErDiagram/RelationFieldDialog.vue` | **新增** | 关联字段勾选弹窗 |
| 格式设置弹窗 | `src/renderer/components/ErDiagram/FormatDialog.vue` | **新增** | 表节点背景色设置 |
| ER 图数据类型 | `src/shared/types/erd.ts` | **新增** | ER 图相关类型定义 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/zh-CN.json` | 修改 | 新增 ER 图翻译键 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/zh-TW.json` | 修改 | 新增 ER 图翻译键 |
| 国际化（渲染进程） | `src/renderer/i18n/locales/en-US.json` | 修改 | 新增 ER 图翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/zh-CN.ts` | 修改 | 新增菜单项翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/zh-TW.ts` | 修改 | 新增菜单项翻译键 |
| 国际化（主进程） | `src/main/i18n/locales/en-US.ts` | 修改 | 新增菜单项翻译键 |
| IPC 通道常量 | `src/shared/constants/index.ts` | 修改 | 新增 `MENU_NEW_ER_DIAGRAM` 通道 |
| 依赖 | `package.json` | 修改 | 新增 `@antv/x6@2.18.2`、`@antv/x6-vue-shape@2.1.3` |

### 5.2 依赖关系

- 依赖 `@antv/x6`（锁定 2.x 最新稳定版）和 `@antv/x6-vue-shape`（需与 x6 主版本匹配）两个 npm 包
- 表结构获取使用 `connectionStore` 已有的方法：
  - `loadTablesWithColumns(connId, db)` — 批量加载指定数据库所有表的字段信息（首次连接时调用）
  - `loadColumns(connId, db, table)` — 按需加载单张表的字段
  - `getDatabaseMeta(connId, db)` — 从 `databaseCache` 获取已缓存的 `DatabaseMeta`（含 tables、views、functions 列表）
  - `getDatabaseNames(connId)` — 获取已加载的数据库名列表
- 文件保存/打开复用已有的 `window.api.file.*` IPC 通道
- 标签页管理复用已有的 `editorStore` 框架

---

## 6. 测试用例

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | 新建 ER 图 | 点击"新建 ER 图"按钮 | 新建标签页，画布空白，Max Rows 禁用 |
| TC02 | 添加表（有连接） | 右键"添加表" → 选择表 → 确定 | 表节点出现在画布上，显示字段 |
| TC03 | 添加表（无连接） | 无连接时右键"添加表" | 提示"请先选择连接"或"无可用数据库" |
| TC04 | 添加表（字段超5个） | 选择一张 20 个字段的表 | 显示前 5 个字段，底部显示"...等 20 个字段" |
| TC05 | 画连线 | 从表 A 拖拽到表 B | 生成直角连线，自动避障 |
| TC06 | 设置关系字段 | 双击连线 → 勾选字段 → 确定 | 线上显示关联字段 |
| TC07 | 设置背景色 | 右键表节点 → "格式" → 选颜色 | 表节点背景色变更 |
| TC08 | 删除表节点 | 选中表 → Del 键 | 表节点和关联连线一起删除 |
| TC09 | 删除连线 | 选中连线 → 右键删除 | 连线删除，表节点保留 |
| TC10 | 保存 ER 图 | Ctrl+S → 选择路径保存 | 生成 `.erd.json` 文件 |
| TC11 | 打开 ER 图 | "打开文件" → 选择 `.erd.json` | 画布恢复所有表和连线 |
| TC12 | SQL 标签页切换 | ER 图和 SQL 标签页之间切换 | 各自正确渲染，不相互干扰 |
| TC13 | 关闭 ER 图标签页 | 关闭未保存的 ER 图标签页 | 弹出保存确认对话框 |
| TC14 | 重连后添加表 | 断开→重连数据库后添加表 | 表选择器显示最新表列表 |
| TC15 | ER 图标签页切换连接 | 画布上有表节点时切换连接选择器 | 已有表保留，添加新表时从当前连接获取 |
| TC16 | 保存后关闭 ER 图标签页 | Ctrl+S 保存 → 关闭标签页 | 不弹出保存确认对话框 |
| TC17 | 字段数为 0 的表 | 添加没有字段的表到画布 | 绘制空表节点（仅显示表名） |
| TC18 | 自引用连线 | 从表 A 拖拽连线到表 A 自身 | 禁止自引用（不创建连线） |
| TC19 | 恢复会话含 ER 图标签页 | 关闭应用 → 重新打开 | ER 图标签页正常恢复，画布内容完整 |
| TC20 | ER 图模式下 Ctrl+S | 快捷键保存 | 正确保存为 `.erd.json` 格式文件 |

---

## 7. 方案设计

### 7.1 文件格式定义（`.erd.json`）

```typescript
interface ErDiagramFile {
  version: 1
  name: string                     // ER 图名称
  savedAt: string                  // ISO 时间
  tables: ErTableData[]
  relations: ErRelationData[]
}

interface ErTableData {
  id: string                       // UUID
  name: string                     // 表名
  schema?: string                  // schema（SQL Server）
  databaseName: string             // 所属数据库
  connectionId: string             // 所属连接 ID
  x: number                        // 画布坐标 X
  y: number                        // 画布坐标 Y
  backgroundColor?: string         // 背景色，默认 '#2d2d2d'
  fields: ErFieldData[]            // 所有字段
}

interface ErFieldData {
  name: string                     // 字段名
  type: string                     // 字段类型（如 varchar(255)）
  isPrimaryKey?: boolean
}

interface ErRelationData {
  id: string                       // UUID
  sourceTableId: string            // 源表节点 ID
  targetTableId: string            // 目标表节点 ID
  sourceFields: string[]           // 源表关联字段名列表
  targetFields: string[]           // 目标表关联字段名列表
  vertices?: { x: number; y: number }[]  // 连线拐点
}
```

### 7.2 EditorTab 类型扩展

```typescript
// 扩展原有接口，增加 tabType 和 erdData
export interface EditorTab {
  // ... 原有字段保持不变
  tabType: 'sql' | 'erd'           // 标签页类型，默认 'sql'
  erdData?: ErDiagramFile          // ER 图数据（tabType === 'erd' 时有效）
}
```

**序列化与恢复（Hot Exit / Session Restore）：**

`serializeTabs()` 需要新增 `tabType` 和 `erdData` 字段的序列化：

```typescript
function serializeTabs() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    activeTabId: activeTabId.value,
    tabCounter,
    tabs: tabs.value.map(tab => ({
      id: tab.id,
      title: tab.title,
      baseTitle: tab.baseTitle,
      content: tab.content,
      filePath: tab.filePath,
      isDirty: tab.isDirty,
      connectionId: tab.connectionId,
      databaseName: tab.databaseName,
      maxRows: tab.maxRows,
      tabType: tab.tabType,              // 新增
      erdData: tab.erdData               // 新增（tabType === 'erd' 时有效）
    }))
  }
}
```

`restoreTabs()` 接收的类型和恢复逻辑也需要同步更新：

```typescript
function restoreTabs(state: {
  activeTabId: string | null
  tabCounter: number
  tabs: {
    id: string; title: string; baseTitle?: string; content: string;
    filePath?: string; isDirty: boolean; connectionId?: string;
    databaseName?: string; maxRows: number;
    tabType?: 'sql' | 'erd';        // 新增（老数据缺失时默认 'sql'）
    erdData?: ErDiagramFile          // 新增
  }[]
}): boolean {
  // 恢复 tabs
  tabs.value = state.tabs.map(t => ({
    id: t.id,
    title: t.title,
    baseTitle: t.baseTitle,
    content: t.content,
    filePath: t.filePath,
    isDirty: t.isDirty,
    connectionId: t.connectionId,
    databaseName: t.databaseName,
    maxRows: t.maxRows ?? 5000,
    tabType: t.tabType || 'sql',     // 老数据兼容
    erdData: t.erdData               // tabType === 'erd' 时存在
  }))
  // ...
}
```

**连接失效保护：** 恢复 ERD 标签页时，如果 `erdData` 中的 `connectionId` 对应的连接已被删除或不可用，保留画布数据不变，但将 `tab.connectionId` 置空，用户添加新表时可重新选择连接。

**`isTabEmpty()` 修正：** 原逻辑判断 `content === '' && !filePath`，ER 图标签页 `content` 永远为空字符串，需要增加 `tabType` 判断避免被误当作可复用的空标签页：

```typescript
function isTabEmpty(tab: EditorTab): boolean {
  if (tab.tabType === 'erd') return false  // ER 图标签页不可复用
  return tab.content === '' && !tab.filePath
}
```

### 7.3 组件架构

当前 `SqlEditor.vue`（1179 行）包含了标签页管理、连接信息栏、Monaco 编辑器三部分。加入 ER 图后职责过重，需要**先重构再扩展**。

**重构策略：** 将 SQL 编辑器的核心能力抽成独立组件 `SqlEditorPanel.vue`，ER 图画布抽成独立组件 `ErDiagramPanel.vue`。原有的 `SqlEditor.vue` 退化为**纯标签页容器**，只负责 `el-tabs` 的渲染和标签切换逻辑。

```text
App.vue
├── Toolbar.vue                          [修改] 新增"新建 ER 图"按钮，ER 模式下禁用执行/停止/执行计划
│
├── SqlEditor.vue（纯标签页容器）          [重构：大幅精简]
│   ├── el-tabs
│   │   ├── <SQL 标签页>
│   │   │   └── SqlEditorPanel.vue       [新增：从 SqlEditor.vue 抽出]
│   │   │       ├── ConnectionInfoBar     连接选择、数据库、用户、Max Rows
│   │   │       └── Monaco Editor         SQL 编辑区
│   │   │
│   │   └── <ER 图标签页>
│   │       └── ErDiagramPanel.vue        [新增：ER 图画布面板]
│   │           ├── ConnectionInfoBar     连接选择、数据库，Max Rows 禁用
│   │           └── ErCanvas.vue          ER 图画布（@antv/x6）
│   │               ├── ErTableNode       x6-vue-shape 表节点
│   │               ├── Edge               x6 内置边（manhattan 路由）
│   │               └── ContextMenu        右键菜单
│   │
├── ErDiagram/TableSelectorDialog.vue     [新增] 表选择弹窗（多选）
├── ErDiagram/RelationFieldDialog.vue     [新增] 关联字段选择弹窗（勾选）
└── ErDiagram/FormatDialog.vue            [新增] 格式设置弹窗（背景色）
```

**重构后各文件职责：**

| 文件 | 来源 | 行数估算 | 职责 |
|------|:---:|:---:|------|
| `SqlEditor.vue` | 重构 | ~120 行 | 仅渲染 `el-tabs`，按 `tabType` 分发到对应面板，处理标签页关闭确认 |
| `SqlEditorPanel.vue` | 从 `SqlEditor.vue` 抽出 | ~900 行 | 连接信息栏（SQL 模式）、Monaco Editor 初始化与管理、Language Server 集成 |
| `ErDiagramPanel.vue` | **新增** | ~150 行 | 连接信息栏（ER 模式）、`ErCanvas.vue` 引用与 erdStore 初始化 |
| `ErCanvas.vue` | **新增** | ~300 行 | @antv/x6 Graph 初始化、节点/边 CRUD、右键菜单 |

**`inject/provide` 调整：** 原来 `App.vue` 中 `provide('sqlEditor')` 提供给 `SqlEditor.vue`。重构后 `SqlEditorPanel.vue` 通过自己的 `defineExpose` 暴露 `getSelectedText()`，由父组件 `SqlEditor.vue` 向上桥接。

### 7.4 数据流

```
用户操作: 新建 ER 图
  │
  ▼
Toolbar → editorStore.createErdTab()
  │
  ▼
editorStore.tabs.push({ tabType: 'erd', erdData: { tables: [], relations: [], ... } })
  │
  ▼
SqlEditor.vue 检测 activeTab.tabType === 'erd'
  │
  ├── 隐藏 Monaco Editor 容器
  ├── 渲染 ErCanvas.vue 替代
  │     └── 从 activeTab.erdData 初始化 @antv/x6 Graph
  └── 禁用 Max Rows 输入框

═══════════════════════════════════════════

用户操作: 添加表
  │
  ▼
画布右键 → ErCanvas:handleAddTable()
  │
  ▼
检查连接状态 → 若无连接则提示"请先选择连接和数据库"
  │
  ▼
connectionStore.loadTablesWithColumns(connId, db) 确保字段信息已加载
  │
  ▼
connectionStore.getDatabaseMeta(connId, db) 获取表列表
  │
  ▼
打开 TableSelectorDialog（多选）
  │
  ▼
获取选中表的字段信息 → getDatabaseMeta 缓存中已有 columns
  │
  ▼
创建 ErTableData[] → erdStore.addTables() → 标记 isDirty = true
  │
  ▼
x6 Graph.addNode() → 渲染 ErTableNode

═══════════════════════════════════════════

用户操作: 画连线
  │
  ▼
鼠标悬停 ErTableNode → 显示右侧拖拽锚点
  │
  ▼
mousedown 锚点 → x6 Graph 开始创建 Edge
  │
  ▼
mousemove → 实时绘制临时连线（直角路由）
  │
  ▼
mouseup 目标节点 → 创建 ErRelationData → erdStore.addRelation()
  │
  ▼
x6 Graph.addEdge() → 渲染连线

═══════════════════════════════════════════

用户操作: 保存
  │
  ▼
Ctrl+S / 工具栏保存
  │
  ▼
editorStore.saveFile()
  │
  ▼  检测 tabType === 'erd'
erdStore.serializeToErdData()  → 写入 editorStore.activeTab.erdData
  │
  ▼
JSON.stringify(erdData, null, 2)
  │
  ▼
window.api.file.save(filePath, jsonString)
  │
  ▼
editorStore.markSaved() → erdStore.isDirty = false

═══════════════════════════════════════════

会话持久化（debouncedSaveSession）:
  │
  ▼
watch(tabs, 区分 ERD/SQL 使用不同间隔)
  │
  ▼
serializeTabs() → tabs 中含 tabType + erdData
  │
  ▼
window.api.sessionState.save(state)
```

### 7.5 @antv/x6 集成方案

#### 7.5.1 画布初始化

```typescript
import { Graph, Markup } from '@antv/x6'
import { buildTableHtml } from './erdUtils'

// 注册表节点（body rect + foreignObject 双层 markup，4 方向端口）
Graph.registerNode('er-table-node', {
  inherit: 'rect',
  markup: [
    { tagName: 'rect', selector: 'body' },
    Markup.getForeignObjectMarkup()        // foreignObject
  ],
  attrs: {
    body: { fill: '#ffffff', fillOpacity: 0, strokeWidth: 0, rx: 8, ry: 8 },
    fo: { refWidth: '100%', refHeight: '100%', width: 220, style: { pointerEvents: 'none' } }
  },
  ports: {
    groups: {
      top: { position: 'top' }, right: { position: 'right' },
      bottom: { position: 'bottom' }, left: { position: 'left' }
    },
    items: [
      { id: 'port-top', group: 'top' },     { id: 'port-right', group: 'right' },
      { id: 'port-bottom', group: 'bottom' }, { id: 'port-left', group: 'left' }
    ]
  },
  propHooks(metadata) { /* 从 table 属性生成 fo.html */ }
}, true)

const graph = new Graph({
  container: canvasElement,
  background: { color: '#1e1e1e' },
  grid: { size: 10, visible: true },
  connecting: {
    router: { name: 'manhattan', args: { padding: 20 } },  // 4 方向自适应
    connector: { name: 'rounded' },
    allowBlank: false, allowLoop: false,
    allowNode: true, allowPort: true, allowMulti: false,   // 端口拖出 → 节点落点
    validateConnection({ sourceCell, targetCell }) { ... } // 去重 + 禁自引用
  },
  mousewheel: { enabled: true, modifiers: 'ctrl', zoomAtMousePosition: true },  // Ctrl+滚轮缩放
  panning: { enabled: true, modifiers: 'ctrl' },  // Ctrl+左键拖拽平移，避免与框选冲突
  interacting: { edgeMovable: false }
})

// 端口 hover 显隐（程序化控制，不依赖 CSS）
const ports = ['port-top','port-right','port-bottom','port-left']
graph.on('node:mouseenter', ({ node }) => ports.forEach(p => node.setPortProp(p, 'attrs/portBody/style/visibility', 'visible')))
graph.on('node:mouseleave', ({ node }) => ports.forEach(p => node.setPortProp(p, 'attrs/portBody/style/visibility', 'hidden')))

// 选中高亮（x6 v3 无内置 selecting，手动管理）
let lastSelectedCell: Cell | null = null
graph.on('cell:click', ({ cell }) => {
  clearSelectionHighlight()
  if (cell.isNode()) cell.setAttrs({ body: { stroke: '#4fc3f7', strokeWidth: 2 } })
  else if (cell.isEdge()) cell.setAttrs({ line: { stroke: '#4fc3f7', strokeWidth: 3 } })
  lastSelectedCell = cell
})
graph.on('blank:mousedown', () => { clearSelectionHighlight(); lastSelectedCell = null })
```

#### 7.5.2 表节点设计

- 使用 x6 原生 `foreignObject` + `Markup.getForeignObjectMarkup()` 渲染 HTML 内容（**弃用 `@antv/x6-vue-shape`**，避免 HMR 和 i18n 上下文问题）
- 双层 markup：`rect`（body，捕捉鼠标事件） + `foreignObject`（fo，渲染 HTML，`pointer-events: none` 穿透）
- 表节点为圆角矩形，内容用 `buildTableHtml()` 纯函数生成 innerHTML：表名区（粗体）+ 字段列表区
- HTML 字段行交替背景色（内联样式）
- 宽度固定 220px，高度 = `max(40, min(fieldsCount, 5) * 24 + 45)`
- 默认背景色：`#2d2d2d`（`--bg-surface`）
- **端口**：上下左右 4 方向各一个端口圆圈（`portMarkup`，r=6，`magnet: true`），默认隐藏，hover 节点时程序化显示

#### 7.5.3 连线设计

- 使用 `manhattan` 路由器实现直角连线 + 自动避障，**不指定 `startDirections/endDirections`**，由 manhattan 根据两表相对位置自动选择最优起点/终点端口
- 交互模式：`allowNode: true` + `allowPort: true` — 从端口拖出，落到目标节点任意位置即完成连线
- 去重：`validateConnection` + `edge:connected` 双重守卫确保 A→B 同方向只有一条线
- 连线颜色：`#888`，无箭头（`targetMarker: null`）
- 关联字段标签：双击连线弹出 `RelationFieldDialog` 勾选后，显示在连线中间位置（半透明背景）

#### 7.5.4 右键菜单

使用 x6 内置插件或自定义实现：

| 菜单项 | 触发位置 | 功能 |
|--------|----------|------|
| 添加表 | 画布空白区域 | 打开表选择器 |
| 格式 | 选中表节点 | 打开背景色设置 |
| 删除 | 选中表节点/连线 | 删除选中元素 |

### 7.6 连接信息栏与工具栏适配逻辑

**SqlEditor.vue 中根据 tabType 控制：**

```typescript
// SqlEditor.vue 中根据 tabType 控制
const isErdTab = computed(() => 
  editorStore.activeTab?.tabType === 'erd'
)

// 模板中：Max Rows 输入框加 disabled
<input 
  type="text" 
  v-model="maxRowsInput"
  :disabled="isErdTab"
  class="max-rows-input"
/>
```

连接选择器和数据库选择器在 ER 图标签页中仍可用（添加表需要知道从哪个数据库读取）。

**边界行为：** 如果 ER 图画布上已有表节点（来自旧连接），用户切换了连接或数据库 → **不清除已有画布内容**，但添加新表时使用当前选中的连接信息。

**Toolbar.vue 中禁用 SQL 专属按钮：**

ER 图模式下，"执行"、"停止"、"执行计划"按钮应禁用（这些是 SQL 编辑器专属功能）。但"保存"按钮仍可用。Toolbar 需要注入或检测当前标签页类型：

```typescript
const isErdTab = computed(() =>
  editorStore.activeTab?.tabType === 'erd'
)
```

模板中：
- `执行` 按钮：`:disabled="!canExecute || isRunning || isErdTab"`
- `停止` 按钮：`:disabled="!isRunning || isErdTab"`
- `执行计划` 按钮：`:disabled="!canExecute || isRunning || isErdTab"`

**菜单栏适配（`App.vue` + 主进程菜单模块）：**

在 `setupMenuListeners()` 中新增 ER 图菜单事件监听：

```typescript
window.api.menu.onNewErDiagram(() => editorStore.createErdTab())
```

主进程菜单模块需增加对应的菜单项和 IPC 通道，放在"文件"菜单中"新建查询"的旁边。快捷键：新建查询 `Ctrl+T` 保持不变，新建 ER 图使用 `Ctrl+E`（ER Diagram 首字母）。**打开文件**菜单（`Ctrl+O`）和**最近文件**菜单无需修改——它们通过 `openFile()` 和 `openRecentFile()` 内的文件类型检测自动适配。

**涉及的修改点：**

1. **`src/shared/constants/index.ts`** — `IpcChannels` 中新增通道常量：
```typescript
MENU_NEW_ER_DIAGRAM: 'menu:new-er-diagram',
```

2. **`src/main/menu.ts`** — 新增菜单项，`click` 时调用：
```typescript
mainWindow.webContents.send(IpcChannels.MENU_NEW_ER_DIAGRAM)
```

3. **`src/main/i18n/locales/`** — 三个语言文件新增 `menu.newErDiagram` 翻译键

4. **`src/preload/index.ts`** — preload 脚本暴露 `window.api.menu.onNewErDiagram()` 方法

### 7.7 文件打开/保存适配

#### 7.7.1 文件扩展名方案

Electron 的 `dialog.showOpenDialog({ filters: [{ extensions: ['erd.json'] }] })` 在跨平台时无法精确区分 `.erd.json` 和普通 `.json`——系统只匹配最后一个 `.` 之后的 `"json"`。因此采用以下方案：

**方案：使用 `extensions: ['json']`，通过文件内容区分：**
- `dialog.showOpenDialog` 过滤器允许 `.json` 文件
- 在渲染进程打开文件后，尝试 `JSON.parse(content)`，检查 `version` 字段是否为 `1` 且包含 `tables` / `relations` 字段，满足则作为 ER 图文件处理
- 文件后缀保持 `.erd.json`，方便用户在文件管理器中肉眼识别

#### 7.7.2 文件打开过滤器（`src/main/ipc/file.ts`）

```typescript
dialog.showOpenDialog({
  filters: [
    { name: 'SQL 文件 & ER 图', extensions: ['sql', 'json'] },
    { name: 'SQL 文件', extensions: ['sql'] },
    { name: 'ER 图', extensions: ['json'] }
  ]
})
```

保存时使用 `.erd.json` 后缀，打开时通过 `JSON` 过滤器 + 内容解析双重判断。

#### 7.7.3 打开文件（`editorStore.openFile`）

```typescript
async function openFile() {
  const result = await window.api.file.open()
  if (result.success && result.content !== undefined) {
    // 检测文件类型
    if (isErdFile(result.content, result.filePath)) {
      openErdFileInTab(result.content, result.filePath)
    } else {
      openFileInTab(result.content, result.filePath)  // 原有 SQL 逻辑
    }
  }
  return result
}

// ER 文件检测：尝试解析 JSON + 检查结构
function isErdFile(content: string, filePath?: string): boolean {
  try {
    const data = JSON.parse(content)
    return data.version === 1 && Array.isArray(data.tables) && Array.isArray(data.relations)
  } catch {
    return false
  }
}
```

`openRecentFile()` 同理，读取文件后通过 `isErdFile()` 判断走哪条分支。

#### 7.7.4 保存文件（`editorStore.saveFile` / `saveFileAs` / `saveTabById`）

三个保存方法都需要按 `tabType` 分支：

```typescript
async function saveFile() {
  if (!activeTab.value) return { success: false }
  
  const isErd = activeTab.value.tabType === 'erd'
  const content = isErd
    ? JSON.stringify(activeTab.value.erdData, null, 2)
    : activeTab.value.content

  if (activeTab.value.filePath) {
    const result = await window.api.file.save(activeTab.value.filePath, content)
    if (result.success) markSaved()
    return result
  } else {
    return isErd ? saveErdFileAs() : saveFileAs()  // ER 图另存时默认后缀不同
  }
}
```

ER 图另存时调用 `window.api.file.saveAs(content)` 传入 JSON 字符串，主进程保存对话框需显示 ER 图专用过滤器。

**`src/main/ipc/file.ts` — `FILE_SAVE_AS` 改造：**

当前 `FILE_SAVE_AS` 只显示 SQL 过滤器，需要增加 ER 图过滤器：

```typescript
// 方案 A：preload 传入可选参数 fileType，按类型切换过滤器
ipcMain.handle(IpcChannels.FILE_SAVE_AS, async (_, content: string, fileType?: 'sql' | 'erd') => {
  const isErd = fileType === 'erd'
  const result = await dialog.showSaveDialog({
    filters: isErd
      ? [
          { name: 'ER 图', extensions: ['erd.json'] },
          { name: 'JSON 文件', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      : [
          { name: 'SQL Files', extensions: ['sql'] },
          { name: 'All Files', extensions: ['*'] }
        ],
    defaultPath: isErd ? 'diagram.erd.json' : 'query.sql'
  })
  // ... 后续逻辑不变
})
```

对应 `src/preload/index.ts` 中 `saveAs` 方法增加可选参数 `fileType`，渲染进程调用：
```typescript
// ER 图保存时
window.api.file.saveAs(erdJsonContent, 'erd')
// SQL 保存时（向后兼容）
window.api.file.saveAs(sqlContent)
```

#### 7.7.5 ER 图的 `isDirty` 标记规则

| 操作 | 标记 dirty | 理由 |
|------|:---:|------|
| 添加表节点 | ✅ | 改变画布核心数据 |
| 删除表节点 / 连线 | ✅ | 改变画布核心数据 |
| 添加 / 删除 / 修改连线字段 | ✅ | 改变画布核心数据 |
| 修改表节点背景色 | ✅ | 改变画布核心数据 |
| 移动表节点位置 | ❌ | 布局调整，非核心数据变更（位置在保存时仍会写入文件） |

---

### 7.8 状态管理架构：erdStore ↔ editorStore

两个 Store 之间存在数据同步关系，需明确**单一责任原则**：

#### 7.8.1 职责划分

| Store | 持有数据 | 说明 |
|-------|----------|------|
| **`erdStore`**（运行时） | @antv/x6 `Graph` 实例、当前选中节点/边、连线拖拽临时状态、右键菜单状态 | 持有"活的"画布状态，是 ER 操作的**唯一写入入口** |
| **`editorStore.activeTab.erdData`**（持久化快照） | `ErDiagramFile` 结构体（tables + relations） | 不直接参与画布渲染，仅作为阶段性快照用于：保存文件、会话恢复、切换标签页前暂存 |

#### 7.8.2 同步时机与方向

```text
用户操作（画布上拖拽/添加/删除/修改）
  │
  ▼
erdStore 更新运行时状态
  │  (1) 如果操作触发 isDirty → erdStore 设置自身 isDirty
  │  (2) erdStore.isDirty → 同步写入 editorStore.activeTab.isDirty
  │
  ▼
以下三个时机，erdStore 将运行时状态序列化 → 写入 editorStore.activeTab.erdData：
  ├── ① 保存时（saveFile / saveTabById）
  ├── ② 切换标签页前（tab-change / tab-remove）
  └── ③ debounceSaveSession 触发时（会话持久化）
```

**关键原则：**
- **erdStore 是唯一写入入口** —— 添加表、删除节点、修改连线等操作统一走 `erdStore` 的方法，不由外部直接修改 `editorStore.erdData`
- **editorStore.erdData 是只读快照** —— `ErCanvas.vue` 初始化时从 `editorStore.activeTab.erdData` 读取初始数据灌入 `erdStore`，之后不再直接读取
- **isDirty 单向同步** —— `erdStore` 设置 isDirty → 同步到 `editorStore.activeTab.isDirty`。保存后 `editorStore.markSaved()` 重置 isDirty，同时通知 `erdStore` 重置

#### 7.8.3 会话持久化的大对象优化

**风险：** 原始方案 `debouncedSaveSession` 每 3 秒 + `deep watch tabs` 会将整个 `erdData`（含完整 `fields` 数组）序列化。假设 20 表 × 30 字段 ≈ 50-100 KB，频繁序列化性能风险较大。

**优化方案：**

```typescript
// editor.ts：watch 改为区分 tabType，ERD 使用更长间隔
watch(tabs, () => {
  // ERD 标签页：仅在 isDirty 变化时触发 debounce（10 秒）
  // SQL 标签页：保持原有 3 秒间隔
  const hasErdDirty = tabs.value.some(t => t.tabType === 'erd' && t.isDirty)
  if (hasErdDirty) {
    debouncedSaveSession(10000)  // ERD 10 秒
  } else {
    debouncedSaveSession(3000)   // SQL 3 秒
  }
}, { deep: true })
```

**备选方案（实现更简单，推荐）：** 不变更 debounce 逻辑，但在 `serializeTabs()` 中增加节流判断——如果上次序列化和本次之间 tabs 无实质性变化（仅 `isDirty` 或 `erdData` 未变），则跳过序列化。

#### 7.8.4 erdStore 接口设计

```typescript
// src/renderer/stores/erd.ts
export const useErdStore = defineStore('erd', () => {
  const graph = ref<Graph | null>(null)       // @antv/x6 Graph 实例
  const selectedCell = ref<Cell | null>(null) // 当前选中的节点/边
  const isDirty = ref(false)                  // 画布是否有未保存变更

  // 从持久化数据初始化画布
  function initFromErdData(data: ErDiagramFile): void { ... }

  // 核心操作
  function addTable(tableData: ErTableData): void {
    graph.value?.addNode(/* ... */)
    isDirty.value = true
    syncDirtyToEditor()  // → editorStore.activeTab!.isDirty = true
  }

  function removeSelected(): void { ... }
  function addRelation(relation: ErRelationData): void { ... }
  function updateRelationFields(relationId: string, sourceFields: string[], targetFields: string[]): void { ... }
  function updateTableBackground(tableId: string, color: string): void { ... }

  // 序列化当前画布状态为 ErDiagramFile
  function serializeToErdData(): ErDiagramFile {
    return {
      version: 1,
      name: '', savedAt: new Date().toISOString(),
      tables: graph.value?.getNodes().map(extractTableData) ?? [],
      relations: graph.value?.getEdges().map(extractRelationData) ?? []
    }
  }

  function syncDirtyToEditor(): void {
    const tab = editorStore().activeTab
    if (tab) tab.isDirty = isDirty.value
  }

  return { graph, selectedCell, isDirty, initFromErdData, addTable, removeSelected, addRelation,
           updateRelationFields, updateTableBackground, serializeToErdData }
})
```

---

## 8. 国际化键名规划

| Key | 中文 | English |
|-----|------|---------|
| `toolbar.newErDiagram` | 新建 ER 图 | New ER Diagram |
| `erd.addTable` | 添加表 | Add Table |
| `erd.format` | 格式 | Format |
| `erd.backgroundColor` | 背景颜色 | Background Color |
| `erd.defaultColor` | 默认颜色 | Default Color |
| `erd.selectTables` | 选择表 | Select Tables |
| `erd.selectRelationFields` | 选择关联字段 | Select Relation Fields |
| `erd.sourceFields` | 源表字段 | Source Fields |
| `erd.targetFields` | 目标表字段 | Target Fields |
| `erd.deleteElement` | 删除 | Delete |
| `erd.deleteConfirm` | 确认删除该元素？关联的连线也将一并删除。 | Confirm delete? Related connections will also be removed. |
| `erd.noDatabase` | 请先选择连接和数据库 | Please select a connection and database first |
| `erd.moreFields` | ...等 {n} 个字段 | ...and {n} more fields |
| `erd.diagramTab` | ER图 | ER Diagram |

---

## 9. 文件结构规划

```text
src/
├── shared/
│   ├── types/
│   │   └── erd.ts                      [新增] ER 图类型定义（与 connection.ts/query.ts 同级）
│   └── constants/
│       └── index.ts                    [修改] 新增 MENU_NEW_ER_DIAGRAM 通道

src/renderer/
├── components/
│   ├── ErDiagram/                      [新增目录]
│   │   ├── ErDiagramPanel.vue          ER 图标签页内容面板（连接信息栏 + 画布）
│   │   ├── ErCanvas.vue               ER 图画布主组件（@antv/x6）
│   │   ├── ErTableNode.vue            x6-vue-shape 表节点
│   │   ├── TableSelectorDialog.vue    表选择弹窗
│   │   ├── RelationFieldDialog.vue    关联字段选择弹窗
│   │   └── FormatDialog.vue           格式设置弹窗
│   ├── SqlEditor.vue                  [重构] 精简为纯标签页容器（~120 行）
│   ├── SqlEditorPanel.vue             [新增] 从 SqlEditor.vue 抽出的 SQL 编辑面板
│   └── Toolbar.vue                    [修改]
├── stores/
│   ├── editor.ts                      [修改]
│   └── erd.ts                         [新增] ER 图 Store
└── i18n/locales/
    ├── zh-CN.json                     [修改]
    ├── zh-TW.json                     [修改]
    └── en-US.json                     [修改]

src/main/
├── menu.ts                            [修改] 新增"新建 ER 图"菜单项
└── ipc/
    └── file.ts                        [修改] 打开/保存支持 ER 图

src/preload/
└── index.ts                           [修改] 暴露 onNewErDiagram, saveAs 支持 fileType 参数

---

## 10. 备注

- 实际安装 `@antv/x6@3.x`（`@antv/x6-vue-shape` 虽安装但最终未使用，改为 x6 原生 `foreignObject` 渲染表节点）
- 第一版只做手动绘制，不包含"反向工程自动生成 ER 图"功能（可规划为 RC-027）
- 连线标签显示支持多个字段对（如 `id = user_id, name = user_name`），用换行分隔
- 画布支持缩放（Ctrl+滚轮）和拖拽平移（Ctrl+左键拖拽空白区域），与框选（无修饰键左键拖拽）互不冲突
- 框选：空白区域左键拖拽绘制矩形，松开后矩形内节点/连线全部选中（蓝色高亮），支持批量删除（Del 键或右键菜单"删除选中 N"）
- 撤销/重做暂不支持（x6 的 History 插件可后续集成）
- 自引用连线（同一张表连接自身）**禁止**，拖拽到自身时不创建连线
- 连线去重：A→B 同方向只允许一条线（`validateConnection` 中检查 `getEdges()`）
- 连线恢复：`vertices` 由 manhattan 路由器重新计算，恢复时路径可能与保存前不完全一致（不影响视觉效果）
- 表节点渲染：用纯函数 `buildTableHtml()` 生成 innerHTML（`foreignObject`），避免 Vue 组件在 x6 上下文中的 i18n/HMR 问题
- 端口显隐：通过 x6 事件 `node:mouseenter/mouseleave` + `setPortProp()` 程序化控制（不用 CSS，避免 DOM 选择器不匹配）
- 表选择器的数据来源：确保 `loadTablesWithColumns(connId, db)` 已被调用，`databaseCache` 中有字段信息后再打开表选择器

---

## 11. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-06-22 | 初始创建（需求分析+方案设计） | 待实现 |
