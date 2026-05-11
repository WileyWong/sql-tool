# RC-022 会话自动保存与恢复 - 技术设计方案

## 1. 概述

实现应用关闭时自动保存所有 Tab 状态（含未保存内容），启动时自动恢复的 Hot Exit 功能。

## 2. 架构设计

### 2.1 数据流

```
关闭时：
  App.vue handleBeforeClose()
    → editorStore.serializeTabs()  (序列化 tabs 数据)
    → IPC: SESSION_STATE_SAVE      (发送到主进程)
    → SessionStateStore.save()     (写入 JSON 文件)
    → window.api.window.confirmClose()  (确认关闭)

启动时：
  App.vue onMounted()
    → IPC: SESSION_STATE_LOAD      (从主进程加载)
    → SessionStateStore.load()     (读取 JSON 文件)
    → editorStore.restoreTabs()    (恢复 tabs 数据)
    → SqlEditor 初始化时读取已恢复的 tab 状态
```

### 2.2 存储结构

```typescript
interface SessionState {
  version: number           // 数据版本号，用于后续迁移
  savedAt: string           // ISO 时间戳
  activeTabId: string | null
  tabCounter: number
  tabs: SerializedTab[]
}

interface SerializedTab {
  id: string
  title: string
  baseTitle?: string
  content: string
  filePath?: string
  isDirty: boolean
  connectionId?: string
  databaseName?: string
  maxRows: number
}
```

存储路径：`{app.getPath('userData')}/config/session-state.json`

## 3. 实现计划

### 3.1 新增文件

| 文件 | 说明 |
|------|------|
| `src/main/storage/session-state-store.ts` | 会话状态持久化服务 |

### 3.2 修改文件

| 文件 | 修改内容 |
|------|----------|
| `src/shared/constants/index.ts` | 新增 IPC 通道常量 |
| `src/main/index.ts` | 注册新 IPC handler |
| `src/preload/index.ts` | 暴露 session state API |
| `src/renderer/stores/editor.ts` | 新增 restoreTabs()、serializeTabs() 方法 |
| `src/renderer/App.vue` | handleBeforeClose 改为自动保存；onMounted 增加恢复 |

### 3.3 不需要修改的文件

| 文件 | 原因 |
|------|------|
| `SqlEditor.vue` | 已有 `isRestoringTabSettings` 机制保护 watch 链 |
| `SaveConfirmDialog.vue` | 保留组件，手动关闭单个 Tab 时仍使用 |

## 4. 详细设计

### 4.1 session-state-store.ts

参考 `settings-store.ts` 模式：
- `loadSessionState(): SessionState | null` — 启动时读取
- `saveSessionState(state: SessionState): void` — 关闭时写入
- 文件不存在/解析失败时返回 null，不抛异常

### 4.2 editor.ts 新增方法

```typescript
// 序列化当前所有 tabs 为可持久化的数据
function serializeTabs(): SessionState { ... }

// 从持久化数据恢复 tabs
function restoreTabs(state: SessionState): void { ... }
```

### 4.3 App.vue 关闭逻辑变更

变更前：逐个弹出保存对话框
变更后：直接序列化 tabs → IPC 写入 → 确认关闭

### 4.4 App.vue 启动逻辑变更

在 `onMounted` 中、`editorStore.init()` 调用前，先尝试从主进程加载会话状态并恢复。

## 5. 注意事项

- 恢复时 `tabCounter` 必须恢复为保存时的值，避免新建 Tab 标题编号冲突
- 恢复的 connectionId 如果对应的连接已删除，UI 显示空，不报错
- 物理数据库连接不自动建立，执行 SQL 时按需建立（复用 ensureSession 机制）
- 单个 Tab 手动关闭仍走现有保存确认对话框流程
