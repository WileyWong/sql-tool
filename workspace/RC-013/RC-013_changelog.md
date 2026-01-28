---
change_id: RC-013
stage: implementation
document_type: changelog
status: completed
---

# RC-013 变更日志 - 表名 Hover 功能增强

## 变更概述

在 SQL 编辑器的表名 hover 提示中，改进字段显示方式并添加表管理入口。

## 修改文件清单

### 1. 后端 (Main Process)

#### `src/main/sql-language-server/providers/hoverProvider.ts`
- **新增** `HoverResult` 接口，包含 `hover` 和可选的 `tableInfo`
- **修改** `provideHover` 方法返回 `HoverResult | null`
- **修改** `createTableHover` 方法：
  - 显示所有字段（移除前 5 个限制）
  - 添加主键标识 🔑
  - 显示字段注释（格式：`// 注释内容`）
  - 添加点击提示文字 *(点击打开表管理)*

#### `src/main/sql-language-server/index.ts`
- **修改** `sql-ls:hover` IPC 处理器，返回 `tableInfo` 字段

### 2. 前端 (Renderer Process)

#### `src/renderer/stores/editor.ts`
- **新增** `hoverHint` 状态（状态栏 hover 提示）
- **新增** `setHoverHint` 方法

#### `src/renderer/composables/useLanguageServer.ts`
- **新增** 引入 `useEditorStore`
- **新增** `currentHoverTableInfo` ref（当前 hover 的表信息）
- **新增** `commandDisposable` 用于清理
- **修改** `provideHover` 处理器：
  - 根据 `tableInfo` 设置状态栏提示
  - 保存当前 hover 的表信息
- **新增** `openTableManageFromHover` 方法（处理表名点击）
- **新增** `clearHoverState` 方法（清除 hover 状态）
- **修改** `dispose` 方法，清理新增资源

#### `src/renderer/components/StatusBar.vue`
- **新增** hover 提示显示区域
- **新增** `.hover-hint` 样式（浅蓝色、斜体）

#### `src/renderer/components/SqlEditor.vue`
- **新增** `handleHoverClick` 函数（处理 hover widget 点击）
- **修改** `initEditor` 添加 hover 状态监听（可选）
- **修改** `onMounted` 添加 hover 点击事件监听
- **修改** `onUnmounted` 移除 hover 点击事件监听
- **新增** Monaco hover widget 全局样式：
  - 最大高度 300px 滚动条支持
  - 点击区域视觉反馈
  - 滚动条深色主题样式

## 功能实现说明

### 1. 显示所有字段
- 移除了原来只显示前 5 个字段的限制
- 字段格式：`- \`字段名\` 🔑: 类型 NOT NULL // 注释`

### 2. 滚动条支持
- 通过 CSS 限制 hover 内容区域最大高度为 300px
- 超出时显示自定义深色主题滚动条

### 3. 表名点击
- hover 表名时，使用 Markdown 链接语法 `[表名](command:openTableManage)` 渲染表名
- **只有表名链接可点击**，点击其他区域不触发操作
- 点击表名链接触发 `openTableManageFromHover`
- 调用 `connectionStore.openTableManageDialog` 打开表管理对话框
- 表名链接样式：浅蓝色、下划线、hover 高亮效果

### 4. 状态栏提示
- hover 表名时，状态栏显示 "💡 点击表名打开表管理"
- 离开 hover 状态后清除提示

## 测试要点

1. hover 不同字段数量的表，验证所有字段显示
2. hover 有主键字段的表，验证 🔑 标识显示
3. hover 有注释字段的表，验证注释显示
4. 字段多的表（>10），验证滚动条出现
5. **点击 hover 中的表名链接**，验证表管理对话框打开
6. **点击 hover 其他区域**，验证不触发任何操作
7. 验证状态栏提示显示和清除
8. 验证表名链接的样式（浅蓝色、hover 高亮）
