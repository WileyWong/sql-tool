# RC-024 编辑器连接状态图标 & 启动时自动刷新元数据

## 1. 需求概述

| 项目 | 内容 |
|------|------|
| 需求编号 | RC-024 |
| 需求名称 | 编辑器连接状态图标 & 启动时自动刷新元数据 |
| 提出日期 | 2026-06-12 |
| 优先级 | P1-高 |
| 影响范围 | 前端（渲染进程） |

---

## 2. 需求背景

### 2.1 现状问题

关闭程序再打开后，之前打开的编辑页面会自动恢复（通过会话持久化机制），每个编辑器标签页保存了 `connectionId` 和 `databaseName`。但存在以下问题：

1. **数据库元数据未刷新**：程序重启后，虽然标签页显示了之前的连接和数据库名称，但 SQL Language Server 的元数据（表、视图、字段等）并未加载，导致自动补全、hover 提示等功能不可用
2. **无直观的连接状态提示**：用户在编辑器连接信息栏中能看到服务器名称，但不知道该连接是否处于已连接状态，也不知道元数据是否已就绪
3. **刷新元数据不便**：用户必须回到左侧树形组件，逐个服务器点击刷新，操作繁琐

### 2.2 变更原因

- 用户体验差：程序重启后看似恢复了编辑环境，实则 SQL 智能提示功能已失效
- 缺乏状态可见性：没有直观的方式让用户知道"元数据尚未加载，需要点击刷新"
- 操作路径长：刷新元数据需要离开编辑器区域，去侧边栏操作

---

## 3. 变更内容

### 3.1 功能一：编辑器连接状态图标

在编辑器的「服务器」下拉框后面添加一个连接状态图标。

#### 3.1.1 图标状态

| 状态 | 图标颜色 | 外观 | Tooltip |
|------|---------|------|---------|
| 断开 | 灰色 `#909399` | `Connection` 图标 | "点击连接服务器并刷新元数据" |
| 连接中 | 橙色 `#e6a23c` | `Connection` 图标 | "正在连接..." |
| 连接失败 | 红色 `#f48771` | `Connection` 图标 | "连接失败，点击重新连接" |
| 已连接 · 元数据未刷新 | 绿色 `#4ec9b0` | **半透明 55%** | "已连接，元数据未加载，点击刷新" |
| 已连接 · 元数据已就绪 | 绿色 `#4ec9b0` | **实心** | "元数据已就绪，点击强制刷新" |
| 操作中 | 旋转动画 | `Loading` 图标 | "正在连接..." |

#### 3.1.2 点击行为

- 点击时调用 `handleConnectionStatusClick()`
- **如果未连接**：调用 `connectionStore.connect()`（与左侧树形控件共用同一套连接代码）→ 连接成功后强制刷新元数据（`checkAndUpdateMetadata(connId, dbName, true)`）
- **如果已连接**：直接强制刷新元数据（`checkAndUpdateMetadata(connId, dbName, true)`）
- 加载中显示旋转图标，防止重复点击
- 刷新成功后弹出 "元数据已刷新" 提示

#### 3.1.3 元数据状态追踪

新增 `metadataRefreshedKey` 变量（格式：`connectionId|databaseName`），用于追踪当前连接+数据库组合的元数据是否已刷新：

- **标记为就绪**：启动时刷新成功 / 点击图标刷新成功 / 切换数据库加载成功 / 左侧树形控件刷新事件触发
- **标记为过时**：切换连接时自动清空（新连接的元数据尚未加载）

通过对比 `metadataRefreshedKey` 与当前 `selectedConnectionId|selectedDatabase` 组合，判断图标显示为"实心绿色"还是"半透明绿色"。

### 3.2 功能二：修复启动时元数据刷新时序

修复 `SqlEditor.vue` 的 `onMounted` 中元数据刷新时序问题。

#### 3.2.1 原有问题

```
editorStore.init()          → restoreTabs() 恢复标签页
                                  ↓
watch(activeTab)            → 设置 selectedConnectionId（同步）
                                  ↓
watch(selectedConnectionId) → connectionStore.connect()（异步，尚未完成）
                                  ↓
onMounted 继续执行          → checkAndUpdateMetadata() ← 此时连接还未建立！
```

`checkAndUpdateMetadata` 在 `connectionStore.connect()` 完成前就执行了，导致元数据未加载。

#### 3.2.2 修复方案

在 `onMounted` 中显式等待连接建立后再刷新元数据：

```
if (connId 存在) {
  if (该连接未连接) {
    await connectionStore.connect(connId)    // 等待连接建立
    await checkAndUpdateContext(...)          // 更新 LS 上下文
    await checkAndUpdateMetadata(..., true)   // 强制刷新元数据
    markMetadataRefreshed(...)               // 标记元数据已就绪
  } else {
    await checkAndUpdateMetadata(..., true)   // 已连接，直接刷新
    markMetadataRefreshed(...)
  }
}
```

---

## 4. 输入输出示例

### 示例 1：程序重启后，元数据未加载

**场景**：关闭程序前打开了标签页，连接为 `测试服务器`，数据库为 `user_db`

**操作**：重新打开程序

**期望结果**：
- 标签页恢复，连接和数据库选择恢复
- 服务器下拉框旁显示**半透明绿色**图标
- Tooltip 显示："已连接，元数据未加载，点击刷新"
- 用户点击图标 → 图标变为旋转 Loading → 刷新完成 → 图标变为**实心绿色**

### 示例 2：手动切换连接

**场景**：当前标签页已连接服务器A且元数据已就绪（实心绿色）

**操作**：从下拉框切换到服务器B

**期望结果**：
- 服务器B自动连接（由现有 `watch(selectedConnectionId)` 处理）
- 图标变为**半透明绿色**（因为新服务器的元数据还未加载）
- Tooltip 显示："已连接，元数据未加载，点击刷新"
- 从下拉框切换数据库 → 自动加载元数据 → 图标变为**实心绿色**

### 示例 3：左侧树形控件刷新

**场景**：当前编辑器连接为服务器A，数据库为 `user_db`

**操作**：在左侧树形控件右键服务器A → 刷新

**期望结果**：
- 编辑器图标变为**实心绿色**（元数据已刷新）
- SQL 智能补全、hover 提示立即可用

---

## 5. 影响分析

### 5.1 受影响的模块

| 模块 | 文件路径 | 修改类型 | 说明 |
|------|----------|----------|------|
| SQL 编辑器 | `src/renderer/components/SqlEditor.vue` | 修改 | 新增连接状态图标模板、计算属性、点击处理函数；修复 onMounted 时序 |
| 国际化（简中） | `src/renderer/i18n/locales/zh-CN.json` | 修改 | 新增 7 条翻译 |
| 国际化（繁中） | `src/renderer/i18n/locales/zh-TW.json` | 修改 | 新增 7 条翻译 |
| 国际化（英语） | `src/renderer/i18n/locales/en-US.json` | 修改 | 新增 7 条翻译 |

### 5.2 依赖关系

- 复用 `connectionStore.connect()` —— 与左侧树形控件使用同一套连接代码
- 复用 `languageServer.checkAndUpdateMetadata()` —— 与现有元数据更新逻辑一致
- 依赖 `connectionStore.connections` 获取连接状态
- 无外部依赖，纯前端改动

---

## 6. 测试用例

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | 程序重启，有已保存的标签页 | 关闭程序 → 重新打开 | 标签页恢复，图标显示半透明绿色（元数据未刷新） |
| TC02 | 点击图标刷新元数据 | 点击半透明绿色图标 | 图标变 Loading → 刷新完成 → 图标变实心绿色，提示"元数据已刷新" |
| TC03 | 元数据已就绪时点击图标 | 点击实心绿色图标 | 图标变 Loading → 强制刷新 → 完成提示 |
| TC04 | 未连接时点击图标 | 选中未连接的服务器，点击图标 | 自动连接 → 刷新元数据 → 图标变实心绿色 |
| TC05 | 连接失败时点击图标 | 选中连接失败的服务器，点击图标 | 重新尝试连接，失败则保持红色+错误提示 |
| TC06 | 切换连接 | 从服务器A切换到服务器B | 图标变为半透明绿色（新连接元数据未加载） |
| TC07 | 切换数据库 | 在同一连接下切换数据库 | 自动加载元数据 → 图标变实心绿色 |
| TC08 | 左侧树刷新 | 在左侧树右键刷新当前服务器 | 编辑器图标同步变为实心绿色 |
| TC09 | 加载中防重复点击 | 快速双击图标 | 只执行一次操作，不会重复触发 |
| TC10 | 无选择连接 | 清空服务器选择 | 图标隐藏（v-if） |

---

## 7. 非功能需求

| 类别 | 要求 |
|------|------|
| 用户体验 | 图标颜色（实心/半透明）直观区分元数据状态，与左侧树形控件的连接颜色风格一致 |
| 可靠性 | 连接操作复用 `connectionStore.connect()`，确保与现有连接逻辑完全一致 |
| 可访问性 | 每种状态都有明确的 Tooltip 说明当前状态和可操作内容 |

---

## 8. 方案设计

### 8.1 架构思路

```
┌─────────────────────────────────────────────────────┐
│  SqlEditor.vue                                       │
│                                                      │
│  [服务器: ▼] [🔗]  ← 新增加的状态图标                  │
│                                              │
│  connectionStatusIcon (computed)             │
│    ├── Loading (操作中)                       │
│    └── Connection (正常)                      │
│                                              │
│  connectionStatusIconClass (computed)         │
│    ├── status-disconnected    (灰色)          │
│    ├── status-connecting      (橙色)          │
│    ├── status-error           (红色)          │
│    ├── status-connected-nometa (绿色半透明)    │ ← 新增
│    └── status-connected-metadata (绿色实心)    │ ← 新增
│                                              │
│  metadataRefreshedKey (ref)                  │ ← 新增
│    格式: "connectionId|databaseName"          │
│    记录最近一次元数据刷新的连接+数据库组合       │
│                                              │
│  markMetadataRefreshed()                     │ ← 新增
│    统一更新 metadataRefreshedKey 的方法        │
└─────────────────────────────────────────────────────┘
```

### 8.2 数据流

```
用户点击图标
    │
    ▼
handleConnectionStatusClick()
    │
    ├── 检查连接状态
    │   ├── 未连接 → connectionStore.connect() ← 复用树形控件代码
    │   └── 已连接 → 跳过
    │
    ▼
languageServer.checkAndUpdateMetadata(connId, dbName, true)  ← 强制刷新
    │
    ▼
markMetadataRefreshed(connId, dbName)  ← 记录刷新标记
    │
    ▼
图标样式更新: 半透明绿色 → 实心绿色
```

### 8.3 启动时序修复

```
修复前:
  editorStore.init() → restoreTabs()
  watch(selectedConnectionId) → connect() [async, 未等待]
  checkAndUpdateMetadata() → 执行时连接未建立 ❌

修复后:
  editorStore.init() → restoreTabs()
  watch(selectedConnectionId) → connect() [async]
  await connect() → await checkAndUpdateMetadata(..., true) ✅
  markMetadataRefreshed() ← 标记就绪
```

---

## 9. 备注

- 连接状态图标与左侧树形控件的连接图标颜色一致：绿色=已连接，橙色=连接中，红色=错误，灰色=断开
- 元数据状态通过**透明度**区分（而非颜色），避免引入新的颜色语言，保持视觉一致性
- `metadataRefreshedKey` 在以下时机更新：
  - `onMounted` 刷新成功
  - 点击图标刷新成功
  - `watch(selectedDatabase)` 切换数据库加载成功
  - `handleConnectionTreeRefresh` 左侧树刷新事件
- `metadataRefreshedKey` 在以下时机清空：
  - `watch(selectedConnectionId)` 切换到新连接时
- 所有状态变化都有对应的 Tooltip 提示，用户不会困惑

---

## 10. 变更历史

| 日期 | 变更内容 | 状态 |
|------|----------|------|
| 2026-06-12 | 初始创建 | 已实现 |
