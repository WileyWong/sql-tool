---
change_id: RC-007-1
change_title: SQL编辑器字符串颜色 - Monaco Editor 主题模块化
document_type: implementation
stage: implementation
created_at: 2026-01-16T10:00:00Z
author: AI Assistant
version: 1.0
---

# RC-007-1 实现记录：Monaco Editor 主题模块化

## 1. 需求概述

将 SQL 编辑器中字符串的颜色从默认的大红色改为橙色 `#f5b801`，同时将主题配置独立到单独文件，便于后续扩展和用户自定义。

## 2. 方案设计

### 2.1 设计目标

1. **模块化**：将 Monaco Editor 主题配置独立到单独文件
2. **可扩展**：便于后续添加更多自定义主题规则
3. **可配置**：为未来用户自定义主题预留扩展空间

### 2.2 文件结构

```
src/renderer/
├── config/
│   └── monaco-theme.ts    # Monaco Editor 主题配置（新增）
├── components/
│   └── SqlEditor.vue      # 引用主题配置（修改）
```

## 3. 实现详情

### 3.1 新增文件：`src/renderer/config/monaco-theme.ts`

主题配置模块，包含以下导出：

| 导出名 | 类型 | 说明 |
|--------|------|------|
| `THEME_SQL_DARK` | 常量 | 主题名称 `'sql-dark'` |
| `themeColors` | 对象 | 颜色配置，含 `string: 'f5b801'` |
| `themeRules` | 数组 | token 规则，定义 `string.sql` 和 `string` 的颜色 |
| `themeEditorColors` | 对象 | UI 颜色配置（预留扩展） |
| `registerSqlDarkTheme()` | 函数 | 注册自定义主题，基于 `vs-dark` |
| `getDefaultTheme()` | 函数 | 返回默认主题名称 |

### 3.2 修改文件：`src/renderer/components/SqlEditor.vue`

#### 3.2.1 新增导入

```typescript
import { registerSqlDarkTheme, getDefaultTheme } from '../config/monaco-theme'
```

#### 3.2.2 修改 `initEditor` 函数

```typescript
function initEditor() {
  if (!editorContainer.value) return
  
  // 注册自定义主题
  registerSqlDarkTheme()
  
  editor = monaco.editor.create(editorContainer.value, {
    // ...
    theme: getDefaultTheme(),  // 原为 'vs-dark'
    // ...
  })
}
```

## 4. 扩展性说明

| 未来需求 | 扩展方式 |
|---------|---------|
| 添加更多主题 | 在 `monaco-theme.ts` 中定义新主题并导出 |
| 用户自定义颜色 | 将 `themeColors` 改为响应式或从配置文件读取 |
| 主题切换 | 调用 `monaco.editor.setTheme(themeName)` |
| 持久化用户配置 | 通过 electron-store 存储用户主题偏好 |

## 5. 测试验证

- [x] 编辑器正常加载
- [x] 字符串显示为橙色 `#f5b801`
- [x] 其他语法高亮颜色不受影响
- [x] 无 lint 错误

## 6. 变更文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/renderer/config/monaco-theme.ts` | 新增 | Monaco Editor 主题配置模块 |
| `src/renderer/components/SqlEditor.vue` | 修改 | 引用主题配置 |
| `.spec-code/memory/context.md` | 更新 | 添加变更记录和项目结构 |
