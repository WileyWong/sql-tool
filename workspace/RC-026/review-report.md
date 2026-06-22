# RC-026 ER 图设计功能 — 需求方案审查报告

> 审查日期：2026-06-22  
> 审查范围：`requirements/requirements_change/requirements_change_26.md`  
> 审查方式：对比现有代码实现，逐项核验方案可行性

---

## 一、总体评价

文档质量较高，功能定义清晰，方案设计覆盖了主要技术环节（数据模型、组件架构、数据流、文件格式、国际化）。整体方案**可行**，但有以下需要关注的问题。

---

## 二、方案层面的问题（需修正/确认）

### 🔴 P0: `EditorTab` 接口扩展与序列化不一致

方案 7.2 提出在 `EditorTab` 新增 `tabType` 和 `erdData`，但现有 `serializeTabs()` 和 `restoreTabs()` (`editor.ts:348-412`) **没有序列化这两个字段**。如果不更新序列化逻辑，Hot Exit 恢复时会丢失 ER 图标签页数据。

**相关代码：**

```348:366:src/renderer/stores/editor.ts
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
        maxRows: tab.maxRows
      }))
    }
  }
```

```369:383:src/renderer/stores/editor.ts
function restoreTabs(state: {
    activeTabId: string | null
    tabCounter: number
    tabs: {
      id: string; title: string; baseTitle?: string; content: string;
      filePath?: string; isDirty: boolean; connectionId?: string;
      databaseName?: string; maxRows: number
    }[]
  }): boolean {
```

**需补充：** `tabType` 和 `erdData` 字段的序列化与恢复。

另外，`content` 字段在 ER 图模式下为空字符串，需确认这对现有逻辑无副作用（如 `isTabEmpty()` (editor.ts:47) 判断空 tab 复用逻辑会误将 ER 图标签页当作"可复用的空标签页"）。

---

### 🔴 P0: 文件保存机制需要按 `tabType` 分支

当前 `saveFile()` (editor.ts:278) 和 `saveFileAs()` (editor.ts:294) 直接传 `activeTab.value.content` (字符串) 给 `window.api.file.save()`。ER 图保存的是 JSON 结构体，需要分支处理：

```278:303:src/renderer/stores/editor.ts
async function saveFile() {
    if (!activeTab.value) return { success: false }
    if (activeTab.value.filePath) {
      const result = await window.api.file.save(activeTab.value.filePath, activeTab.value.content)
      ...
    }
  }

async function saveFileAs() {
    ...
    const result = await window.api.file.saveAs(activeTab.value.content)
    ...
  }
```

**需补充：**
- `saveFile()` — 检测 `tabType === 'erd'` 时传 `JSON.stringify(erdData)` 而非 `content`
- `saveFileAs()` — 同上
- `saveTabById()` (editor.ts:254) — 同理（关闭标签页时的保存确认也会调用此方法）

---

### 🔴 P0: 依赖声明中的 `connectionStore.getTableInfo()` 方法不存在

需求文档 5.2 依赖关系中提到：

> 表结构获取依赖已有的 `connectionStore.getTableInfo()` 或类似 API

但实际代码中**不存在此方法**。实际可用的方法：

| 方法 | 说明 |
|------|------|
| `loadTablesWithColumns(connId, db)` | 一次性加载所有表的字段信息 |
| `loadColumns(connId, db, table)` | 加载单张表的字段 |
| `getDatabaseMeta(connId, db)` | 从缓存获取 `DatabaseMeta`（含 tables、views、functions） |
| `getDatabaseNames(connId)` | 获取已加载的数据库名列表 |

**建议方案：** 在表选择器中，先确保 `databaseCache` 中有已选数据库的元数据（需含 columns），若未加载则调用 `loadTablesWithColumns()` 批量加载。

---

### 🔴 P1: `.erd.json` 文件扩展名在 Electron 对话框中的兼容性问题

需求文档 7.7 中：

```typescript
dialog.showOpenDialog({
  filters: [
    { name: 'SQL & ER 图', extensions: ['sql', 'erd.json'] },
    { name: 'SQL 文件', extensions: ['sql'] },
    { name: 'ER 图', extensions: ['erd.json'] }
  ]
})
```

Electron 的 `extensions` 匹配逻辑在 Windows/macOS/Linux 上行为不一致——它只匹配最后一个 `.` 之后的字符串（即 `json`），无法区分 `.erd.json` 和普通 `.json` 文件。

**建议方案（三选一）：**
1. 使用 `extensions: ['erdjson']`，文件名改为 `.erdjson`
2. 使用 `extensions: ['json']`，渲染进程通过解析 JSON 的 `version` 字段区分
3. 保持 `.erd.json`，在 `openFileInTab()` 中通过文件扩展名检测和内容校验双重判断

**推荐方案2**，因为 JSON 格式自带 `version: 1` 标识，天然可以区分。

---

## 三、设计细节问题

### 🟡 P1: `openFile` / `openRecentFile` 缺少 ER 文件处理分支

当前 `openFileInTab()` (editor.ts:199) 只处理 SQL 文本内容：

```199:225:src/renderer/stores/editor.ts
function openFileInTab(content: string, filePath?: string) {
    const currentTab = activeTab.value
    if (currentTab && isTabEmpty(currentTab)) {
      currentTab.content = content  // 直接赋值字符串
      ...
    } else {
      createTab(content, filePath)  // 创建 SQL 标签页
    }
  }
```

打开 `.erd.json` 文件时，`content` 是 JSON 字符串，需要先 `JSON.parse()`，然后调用新方法创建 ERD 标签页。

**需补充：**
- `openFile()` (editor.ts:190) — 检测文件扩展名，走不同分支
- `openRecentFile()` (editor.ts:231) — 同理

---

### 🟡 P1: 连接信息栏在 ER 图模式下的行为边界

文档 7.6 说连接选择器和数据库选择器在 ER 图标签页中仍可用。这个设计方向正确，但有一个边界情况：

> **如果 ER 图画布上已有表节点，用户切换了连接或数据库** — 画布上的表节点来自旧连接，字段信息可能已过时。建议：切换连接/数据库时不清除已有画布内容，但添加新表时使用当前连接信息。

另外：
- **Max Rows** 输入框禁用 ✓
- **"用户"字段** — ER 图模式下如果没选连接，显示 `-`。保持与 SQL 模式一致即可
- **执行/停止/执行计划按钮** — ER 图模式下应禁用（SQL 专属功能）

---

### 🟡 P2: 缺失"已修改"标记的明确规则

ER 图标签页的 `isDirty` 标记触发条件需明确：

| 操作 | 是否标记 dirty | 理由 |
|------|:---:|------|
| 添加表节点 | ✅ | 改变核心数据 |
| 删除表节点/连线 | ✅ | 改变核心数据 |
| 添加/删除/修改连线字段 | ✅ | 改变核心数据 |
| 修改表节点背景色 | ✅ | 改变核心数据 |
| 移动表节点位置 | ❌ | 布局调整，非核心数据变更 |

---

### 🟡 P2: 菜单栏适配

需求文档只提到工具栏新增按钮，但未提及 Electron 原生菜单栏的适配。当前 `App.vue` 中 `setupMenuListeners()` 需要新增：

```153:159:src/renderer/App.vue
window.api.menu.onNewQuery(() => editorStore.createTab())
window.api.menu.onOpenFile(async () => { ... })
window.api.menu.onOpenRecent(async (_event, filePath) => { ... })
window.api.menu.onSave(async () => { ... })
```

**建议新增：** `window.api.menu.onNewErDiagram(() => editorStore.createErdTab())`

---

### 🟡 P2: 会话恢复中的连接失效风险

方案 7.8 提到恢复 ERD 标签页，但 ERD 数据中的 `connectionId` 可能已过期（连接被删除或重命名）。建议恢复时：
- 画布节点数据全部保留
- 若 `connectionId` 对应的连接已不存在，将 `connectionId` 置空
- 表选择器在连接无效时显示提示

---

## 四、测试用例补充建议

现有 14 条测试用例覆盖较好，建议补充以下边界场景：

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC15 | ER 图标签页切换连接 | 切换连接选择器 | 已有表保留，添加新表时从当前连接获取 |
| TC16 | 保存后关闭 ER 图标签页 | Ctrl+S → 关闭标签页 | 不弹出保存确认对话框 |
| TC17 | 字段数为 0 的表 | 添加没有字段的表 | 绘制空表节点（仅表名） |
| TC18 | 自引用连线 | 同一张表拖拽到自身 | 禁止或绘制自环连线（取决于设计意图） |
| TC19 | 恢复会话含 ER 图标签页 | 关闭应用 → 重新打开 | ER 图标签页正常恢复，画布内容完整 |
| TC20 | ER 图模式下 Ctrl+S | 快捷键保存 | 正确保存为 `.erd.json` 格式 |

---

## 五、遗漏项汇总

| # | 遗漏项 | 风险等级 |
|---|--------|:---:|
| 1 | `package.json` 中 `@antv/x6` 版本未锁定具体版本号 | P2 |
| 2 | ER 图模式下工具栏的执行/停止/执行计划按钮未禁用的处理 | P2 |
| 3 | 连线 `vertices` 恢复时 manhattan 路由器可能生成不同路径 | P3 |
| 4 | `isTabEmpty()` 判断可能误将 ER 图标签页当作可复用空标签页 | P1 |

---

## 六、总体评分

| 维度 | 评分 | 说明 |
|------|:---:|------|
| 需求完整性 | 8/10 | 功能点全面，缺少少量边界场景 |
| 方案架构 | 8/10 | 组件拆分清晰，数据流定义完整 |
| 技术可行性 | 7/10 | 主要技术方案可行，但存在 3 处 P0 级需要修正 |
| 测试覆盖 | 7/10 | 14 条测试用例，建议补充 6 条 |
| 文档质量 | 8/10 | 结构清晰，7.4 数据流图尤为出色 |
| **综合** | **7.5/10** | P0 项修正后可进入实现阶段 |

---

## 七、优先级修正清单

| 优先级 | 事项 | 涉及文件 |
|--------|------|----------|
| **P0** | 修正 `serializeTabs/restoreTabs` 序列化逻辑 | `editor.ts` |
| **P0** | 修正 `saveFile/saveFileAs/saveTabById` 按 `tabType` 分支 | `editor.ts` |
| **P0** | 修正依赖声明 — 使用实际存在的 API | `requirements_change_26.md` |
| **P1** | 确认 `.erd.json` 扩展名在 Electron 对话框中的行为 | `file.ts`, `editor.ts` |
| **P1** | `openFile/openRecentFile` 增加 ER 文件处理分支 | `editor.ts` |
| **P1** | `isTabEmpty()` 增加 `tabType` 判断 | `editor.ts` |
| **P1** | 补充菜单栏 ER 图入口 | `App.vue`, 主进程菜单模块 |
| **P1** | ER 图模式下禁用工具栏执行/停止/执行计划按钮 | `Toolbar.vue` |
| **P2** | 补充边界测试用例 TC15-TC20 | `requirements_change_26.md` |
| **P2** | 明确 `isDirty` 标记规则 | `requirements_change_26.md` |
| **P3** | 锁定 `@antv/x6` 具体版本 | `package.json` |
