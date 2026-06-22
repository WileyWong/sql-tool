# RC-026 ER 图设计功能 — 重新审查报告

> 重新审查日期：2026-06-22  
> 需求文档：`requirements/requirements_change/requirements_change_26.md`  
> 前次审查报告：`workspace/RC-026/review-report.md`

---

## 一、前次 P0 问题修正情况

| # | 问题 | 状态 |
|---|------|:---:|
| P0-1 | `serializeTabs/restoreTabs` 缺少 `tabType`/`erdData` 序列化 | ✅ 已修正 |
| P0-2 | `saveFile/saveFileAs/saveTabById` 未按 `tabType` 分支 | ✅ 已修正 |
| P0-3 | 依赖声明 `getTableInfo()` 不存在 | ✅ 已修正 |

## 二、前次 P1 问题修正情况

| # | 问题 | 状态 |
|---|------|:---:|
| P1-1 | `.erd.json` 扩展名兼容性问题 | ✅ 已修正 |
| P1-2 | `openFile/openRecentFile` 缺少 ER 文件分支 | ✅ 已修正 |
| P1-3 | `isTabEmpty()` 误判 | ✅ 已修正 |
| P1-4 | 菜单栏适配 | ✅ 已修正 |
| P1-5 | ERD 模式下工具栏按钮禁用 | ✅ 已修正 |

## 三、前次 P2 问题修正情况

| # | 问题 | 状态 |
|---|------|:---:|
| P2-1 | 测试用例补充 TC15-TC20 | ✅ 已补充 |
| P2-2 | `isDirty` 标记规则明确 | ✅ 已明确 |
| P2-3 | 版本锁定 | ✅ 已锁定 |

---

## 四、新增发现的问题

### 🔴 P1: 文件路径错误 — `src/main/ipc/menu.ts`

需求文档 5.1 中（第 126 行）：

> | 主进程菜单模块 | `src/main/ipc/menu.ts` | 修改 | 新增"新建 ER 图"菜单项及 IPC 通道 |

实际代码中菜单模块位于 **`src/main/menu.ts`**（不在 `ipc/` 子目录下）。

**修正为：** `src/main/menu.ts`

---

### 🔴 P1: 类型文件路径 — `src/renderer/types/erd.ts`

需求文档 5.1 / 9 中（第 135、650 行）：

> | ER 图数据类型 | `src/renderer/types/erd.ts` | **新增** |

```650:650:requirements/requirements_change/requirements_change_26.md
├── types/
│   └── erd.ts                         [新增] ER 图类型定义
```

实际项目中不存在 `src/renderer/types/` 目录。现有类型定义全部在 **`src/shared/types/`**：

```
src/shared/types/
├── connection.ts
├── database.ts
├── index.ts
└── query.ts
```

**建议方案（二选一）：**
- **推荐**：放到 `src/shared/types/erd.ts`，遵循已有惯例，并在 `src/shared/types/index.ts` 中 `export * from './erd'`
- 备选：新建 `src/renderer/types/` 目录，但会与其他类型文件不在同一位置

---

### 🔴 P1: 缺失 `MENU_NEW_ER_DIAGRAM` IPC 通道

需求文档 7.6（第 516 行）：

```516:517:requirements/requirements_change/requirements_change_26.md
window.api.menu.onNewErDiagram(() => editorStore.createErdTab())
```

但 `src/shared/constants/index.ts` 的 `IpcChannels` 中**未定义**对应的通道常量。需要新增：

```typescript
// 在 IpcChannels 的菜单相关 section 中新增
MENU_NEW_ER_DIAGRAM: 'menu:new-er-diagram',
```

同时需要：
1. **`src/main/menu.ts`** 中新增菜单项和 `webContents.send(IpcChannels.MENU_NEW_ER_DIAGRAM)` 调用
2. **主进程 i18n** (`src/main/i18n/locales/`) 中新增 `menu.newErDiagram` 翻译键
3. **preload 脚本**暴露 `window.api.menu.onNewErDiagram()` 方法

---

### 🔴 P1: `FILE_SAVE_AS` 需要支持 ER 文件类型

需求文档 7.7.4 提到 ER 图另存，但当前主进程 `FILE_SAVE_AS` 处理器（`file.ts:64-86`）的过滤器只支持 SQL 文件：

```64:86:src/main/ipc/file.ts
ipcMain.handle(IpcChannels.FILE_SAVE_AS, async (_, content: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'SQL Files', extensions: ['sql'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      defaultPath: 'query.sql'
    })
```

**需修改**（方案三选一）：

| 方案 | 描述 |
|------|------|
| A | `FILE_SAVE_AS` 增加可选参数 `fileType`，根据类型切换过滤器 |
| B | 始终展示 SQL + JSON 两种过滤器 |
| C | 新增独立的 `FILE_SAVE_AS_ERD` IPC 通道 |

**推荐方案 A**：改动最小，向后兼容。

---

### 🟡 P2: 菜单快捷键冲突

需求文档 7.6 建议新建 ER 图快捷键 `Ctrl+Shift+N`。当前菜单已有：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+N` | 新建连接 |
| `Ctrl+T` | 新建查询 |

`Ctrl+Shift+N` 与 Chrome 隐身窗口习惯冲突（Electron 自身也可能保留此快捷键）。**建议改为 `Ctrl+E`**（ER Diagram 首字母）或 `Ctrl+Shift+E`。需在文档中明确或留到实现时决定。

---

## 五、需求文档质量评估（更新后）

| 维度 | 前次评分 | 本次评分 | 变化 |
|------|:---:|:---:|:---:|
| 需求完整性 | 8/10 | 9/10 | +1 |
| 方案架构 | 8/10 | 9/10 | +1 |
| 技术可行性 | 7/10 | 8/10 | +1 |
| 测试覆盖 | 7/10 | 9/10 | +2 |
| 文档质量 | 8/10 | 9/10 | +1 |
| **综合** | **7.5/10** | **8.8/10** | **+1.3** |

## 六、优先级修正清单（更新后）

| 优先级 | 事项 | 涉及文件 |
|--------|------|----------|
| **P1** | 修正菜单模块路径：`src/main/ipc/menu.ts` → `src/main/menu.ts` | `requirements_change_26.md` §5.1 |
| **P1** | 修正类型文件路径：`src/renderer/types/erd.ts` → `src/shared/types/erd.ts` | `requirements_change_26.md` §5.1, §9 |
| **P1** | 补充 `MENU_NEW_ER_DIAGRAM` IPC 通道常量 | `shared/constants/index.ts` |
| **P1** | 修改 `FILE_SAVE_AS` 支持 ER 文件过滤器 | `main/ipc/file.ts` |
| P2 | 确认新建 ER 图快捷键（建议改为 `Ctrl+E`） | `requirements_change_26.md` §7.6 |
