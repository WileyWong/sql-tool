# 技术设计文档 - 文件操作功能增强

## 1. 设计概述

### 1.1 变更范围

| 模块 | 变更类型 | 说明 |
|------|----------|------|
| Main 进程 | 新增 | 最近文件服务、窗口关闭拦截 |
| Preload | 扩展 | 新增 IPC 通道 |
| Renderer | 扩展 | MenuBar 组件、Editor Store |

### 1.2 模块划分

```
src/
├── main/
│   ├── services/
│   │   └── recentFilesService.ts    # [新增] 最近文件管理服务
│   ├── ipc/
│   │   └── file.ts                  # [修改] 扩展文件操作 IPC
│   └── index.ts                     # [修改] 窗口关闭拦截
├── shared/
│   └── constants/
│       └── index.ts                 # [修改] 新增 IPC 通道常量
├── preload/
│   └── index.ts                     # [修改] 暴露新 API
└── renderer/
    ├── stores/
    │   └── editor.ts                # [修改] 扩展编辑器状态管理
    └── components/
        └── MenuBar.vue              # [修改] 添加最近文件子菜单
```

---

## 2. 模块详细设计

### 2.1 最近文件服务 (Main 进程)

**文件**: `src/main/services/recentFilesService.ts`

**职责**: 管理最近打开文件列表的持久化存储和读取

```typescript
// 接口定义
interface RecentFilesService {
  getRecentFiles(): string[]           // 获取最近文件列表
  addRecentFile(filePath: string): void // 添加文件到列表
  removeRecentFile(filePath: string): void // 移除无效文件
}

// 存储位置: electron-store 或 app.getPath('userData')/recent-files.json
// 最大记录数: 10
// 存储格式: string[] (文件路径数组，按时间倒序)
```

**核心逻辑**:
1. 添加文件时，如已存在则移到首位
2. 超过10个时，移除最旧的
3. 读取时验证文件是否存在（可选，提高性能可跳过）

---

### 2.2 IPC 通道扩展

**新增通道** (`src/shared/constants/index.ts`):

```typescript
export const IpcChannels = {
  // ... 现有通道
  
  // 最近文件
  RECENT_FILES_GET: 'recentFiles:get',      // 获取列表
  RECENT_FILES_ADD: 'recentFiles:add',      // 添加文件
  RECENT_FILES_REMOVE: 'recentFiles:remove', // 移除文件
  
  // 窗口控制
  WINDOW_CLOSE: 'window:close',              // 请求关闭窗口
  WINDOW_CLOSE_CONFIRMED: 'window:closeConfirmed' // 确认关闭
} as const
```

---

### 2.3 文件 IPC 处理器扩展

**文件**: `src/main/ipc/file.ts`

**新增处理器**:

```typescript
// 获取最近文件列表
ipcMain.handle(IpcChannels.RECENT_FILES_GET, () => {
  return recentFilesService.getRecentFiles()
})

// 添加到最近文件
ipcMain.handle(IpcChannels.RECENT_FILES_ADD, (_, filePath: string) => {
  recentFilesService.addRecentFile(filePath)
})

// 移除最近文件
ipcMain.handle(IpcChannels.RECENT_FILES_REMOVE, (_, filePath: string) => {
  recentFilesService.removeRecentFile(filePath)
})
```

**修改现有处理器**:
- `FILE_OPEN`: 成功后自动添加到最近文件
- `FILE_SAVE`: 成功后自动添加到最近文件
- `FILE_SAVE_AS`: 成功后自动添加到最近文件

---

### 2.4 窗口关闭拦截

**文件**: `src/main/index.ts`

**设计**:

```typescript
// 1. 隐藏 Electron 默认菜单
Menu.setApplicationMenu(null)

// 2. 拦截窗口关闭
mainWindow.on('close', (e) => {
  e.preventDefault()
  // 通知渲染进程检查未保存内容
  mainWindow.webContents.send('window:beforeClose')
})

// 3. 监听确认关闭
ipcMain.on(IpcChannels.WINDOW_CLOSE_CONFIRMED, () => {
  mainWindow.destroy() // 强制关闭，不再触发 close 事件
})
```

---

### 2.5 Preload API 扩展

**文件**: `src/preload/index.ts`

```typescript
const api = {
  // ... 现有 API
  
  file: {
    // ... 现有方法
    
    // 最近文件
    getRecentFiles: (): Promise<string[]> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_GET),
    
    addRecentFile: (filePath: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_ADD, filePath),
    
    removeRecentFile: (filePath: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.RECENT_FILES_REMOVE, filePath),
    
    // 读取指定路径文件
    readFile: (filePath: string): Promise<{ success: boolean; content?: string; message?: string }> =>
      ipcRenderer.invoke(IpcChannels.FILE_READ, filePath)
  },
  
  window: {
    confirmClose: () => ipcRenderer.send(IpcChannels.WINDOW_CLOSE_CONFIRMED),
    onBeforeClose: (callback: () => void) => {
      ipcRenderer.on('window:beforeClose', callback)
    }
  }
}
```

---

### 2.6 Editor Store 扩展

**文件**: `src/renderer/stores/editor.ts`

**新增方法**:

```typescript
// 判断标签页是否为空（可复用）
function isTabEmpty(tab: EditorTab): boolean {
  return tab.content === '' && !tab.filePath
}

// 智能打开文件（复用空标签页或新建）
async function openFileInTab(filePath: string, content: string) {
  const currentTab = activeTab.value
  
  if (currentTab && isTabEmpty(currentTab)) {
    // 复用当前空标签页
    currentTab.content = content
    currentTab.filePath = filePath
    currentTab.title = filePath.split(/[/\\]/).pop()!
    currentTab.isDirty = false
  } else {
    // 新建标签页
    createTab(content, filePath)
  }
}

// 打开最近文件
async function openRecentFile(filePath: string) {
  const result = await window.api.file.readFile(filePath)
  if (result.success && result.content !== undefined) {
    await openFileInTab(filePath, result.content)
    return { success: true }
  } else {
    // 文件不存在，从列表移除
    await window.api.file.removeRecentFile(filePath)
    return { success: false, message: result.message || '文件不存在' }
  }
}

// 检查是否有未保存内容
function hasUnsavedChanges(): boolean {
  return tabs.value.some(tab => tab.isDirty)
}

// 获取所有未保存的标签页
function getUnsavedTabs(): EditorTab[] {
  return tabs.value.filter(tab => tab.isDirty)
}

// 关闭标签页（带保存提示）
async function closeTabWithConfirm(tabId: string): Promise<boolean> {
  const tab = tabs.value.find(t => t.id === tabId)
  if (!tab) return true
  
  if (tab.isDirty) {
    // 返回 false 表示用户取消，true 表示可以关闭
    // 具体对话框逻辑在组件中实现
    return false // 需要确认
  }
  
  closeTab(tabId)
  return true
}
```

---

### 2.7 MenuBar 组件扩展

**文件**: `src/renderer/components/MenuBar.vue`

**设计变更**:

1. 菜单数据从静态改为响应式（支持动态子菜单）
2. 添加"最近打开的文件"子菜单
3. 组件挂载时加载最近文件列表

```typescript
// 菜单项类型扩展
interface MenuItem {
  label?: string
  shortcut?: string
  action?: string
  divider?: boolean
  submenu?: MenuItem[]  // 新增：子菜单
  filePath?: string     // 新增：用于最近文件
}

// 响应式菜单
const recentFiles = ref<string[]>([])

onMounted(async () => {
  recentFiles.value = await window.api.file.getRecentFiles()
})

// 动态生成文件菜单
const fileMenuItems = computed(() => [
  { label: '新建连接', shortcut: 'Ctrl+N', action: 'newConnection' },
  { label: '新建查询', shortcut: 'Ctrl+T', action: 'newQuery' },
  { divider: true },
  { 
    label: '最近打开的文件', 
    submenu: recentFiles.value.length > 0 
      ? recentFiles.value.map(path => ({ label: path, action: 'openRecent', filePath: path }))
      : [{ label: '(无)', disabled: true }]
  },
  { divider: true },
  { label: '打开文件', shortcut: 'Ctrl+O', action: 'openFile' },
  // ...
])
```

---

## 3. 数据流图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Renderer 进程                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   MenuBar    │────>│ EditorStore  │────>│   TabBar     │     │
│  │  (最近文件)   │     │ (状态管理)    │     │  (关闭确认)   │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│         │                    │                    │              │
└─────────┼────────────────────┼────────────────────┼──────────────┘
          │ IPC                │ IPC                │ IPC
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Main 进程                                │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │RecentFiles   │     │   File IPC   │     │   Window     │     │
│  │  Service     │<────│   Handler    │     │   Manager    │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │ recent-files │  (JSON 文件持久化)                              │
│  │    .json     │                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 实现顺序

| 步骤 | 模块 | 说明 |
|------|------|------|
| 1 | `recentFilesService.ts` | 创建最近文件服务 |
| 2 | `constants/index.ts` | 添加 IPC 通道常量 |
| 3 | `ipc/file.ts` | 扩展文件 IPC 处理器 |
| 4 | `preload/index.ts` | 暴露新 API |
| 5 | `stores/editor.ts` | 扩展 Editor Store |
| 6 | `MenuBar.vue` | 添加最近文件菜单 |
| 7 | `index.ts` (main) | 隐藏默认菜单 + 关闭拦截 |
| 8 | 关闭确认对话框 | 实现未保存提醒 UI |

---

## 5. 已确认的业务规则

| 规则 | 决策 |
|------|------|
| 最近文件记录时机 | 打开和保存都记录 |
| 文件不存在处理 | 提示并自动移除 |
| "空编辑器"定义 | `content === '' && !filePath` |
| 多文件未保存提醒 | 逐个提示 |
| 无路径文件保存 | 弹出另存为对话框 |
