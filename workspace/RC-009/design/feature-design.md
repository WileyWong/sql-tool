---
change_id: RC-009
stage: design
document_type: feature_design
created_at: 2026-01-21
updated_at: 2026-01-21
version: 1.0
---

# RC-009 功能详细设计

## 1. 功能分解

### 1.1 功能清单

| 模块 | 功能 | 子功能 | 优先级 | 预估复杂度 |
|------|------|--------|--------|------------|
| SQL 智能提示 | FR-001 ORDER BY 字段补全 | 1.1 上下文识别 | P0 | 中等 |
| | | 1.2 表引用解析 | P0 | 中等 |
| | | 1.3 字段补全生成 | P0 | 简单 |
| SQL 执行 | FR-002 LIMIT 自动添加修复 | 2.1 分号处理 | P0 | 简单 |
| | | 2.2 LIMIT 检测 | P0 | 简单 |
| 结果导出 | FR-003 Excel 导出 | 3.1 xlsx 文件生成 | P1 | 中等 |
| | | 3.2 UI 交互改造 | P1 | 简单 |
| 性能优化 | FR-004 结果切换优化 | 4.1 虚拟滚动实现 | P2 | 复杂 |
| | | 4.2 数据懒加载 | P2 | 中等 |

### 1.2 功能依赖关系

```
FR-001 (独立)
FR-002 (独立)
FR-003 (独立)
FR-004 (独立)

无功能间依赖，可并行开发
```

## 2. FR-001: ORDER BY 字段补全 - 详细设计

### 2.1 功能概述

在 SQL 编辑器中，当用户在 ORDER BY 或 GROUP BY 子句后输入时，自动提示当前查询涉及的表字段。

### 2.2 用例设计

#### 正常用例

**UC-001-01: 单表 ORDER BY 补全**
- **前置条件**: 已连接数据库，元数据已加载
- **触发条件**: 用户输入 `SELECT * FROM users ORDER BY `
- **主流程**:
  1. 系统检测光标位于 ORDER BY 后
  2. 解析 SQL，提取 FROM 子句中的表 `users`
  3. 从元数据获取 users 表的所有字段
  4. 生成补全列表并展示
- **后置条件**: 显示 users 表所有字段的补全提示

**UC-001-02: 多表 JOIN ORDER BY 补全**
- **前置条件**: 已连接数据库，元数据已加载
- **触发条件**: 用户输入 `SELECT * FROM users u JOIN orders o ON u.id = o.user_id ORDER BY `
- **主流程**:
  1. 系统检测光标位于 ORDER BY 后
  2. 解析 SQL，提取所有表引用 (users AS u, orders AS o)
  3. 从元数据获取两个表的所有字段
  4. 生成带别名前缀的补全列表 (u.id, u.name, o.order_id, ...)
- **后置条件**: 显示所有表字段（带前缀）的补全提示

**UC-001-03: GROUP BY 补全**
- **前置条件**: 同 UC-001-01
- **触发条件**: 用户输入 `SELECT * FROM users GROUP BY `
- **主流程**: 同 ORDER BY
- **后置条件**: 显示字段补全提示

#### 异常用例

**UC-001-E01: 表不存在于元数据**
- **触发条件**: FROM 子句的表未在元数据中
- **处理流程**: 仅提示 SQL 关键字，不提示字段
- **结果**: 显示关键字补全 (ASC, DESC, LIMIT 等)

**UC-001-E02: 数据库未连接**
- **触发条件**: 用户未建立数据库连接
- **处理流程**: 跳过字段补全逻辑
- **结果**: 仅显示关键字补全

**UC-001-E03: SQL 解析失败**
- **触发条件**: SQL 语法不完整或错误
- **处理流程**: 使用正则降级方案提取表名
- **结果**: 尽可能提供字段补全

#### 边界用例

**UC-001-B01: ORDER BY 后已有部分输入**
- **输入**: `SELECT * FROM users ORDER BY na`
- **处理**: 补全列表过滤为以 "na" 开头的字段
- **结果**: 显示 name 等匹配字段

**UC-001-B02: 复杂子查询**
- **输入**: `SELECT * FROM (SELECT id, name FROM users) AS sub ORDER BY `
- **处理**: 解析子查询列 (id, name)
- **结果**: 显示子查询输出列

**UC-001-B03: 空 FROM 子句**
- **输入**: `SELECT 1 ORDER BY `
- **处理**: 无表可提取
- **结果**: 仅显示关键字补全

### 2.3 输入输出定义

#### 输入
| 字段 | 类型 | 说明 |
|------|------|------|
| documentText | string | 完整 SQL 文本 |
| position | { line: number, character: number } | 光标位置 |

#### 输出
| 字段 | 类型 | 说明 |
|------|------|------|
| items | CompletionItem[] | 补全项列表 |
| items[].label | string | 显示名称 |
| items[].kind | CompletionItemKind | 类型 (Field/Keyword) |
| items[].insertText | string | 插入文本 |
| items[].detail | string | 详细说明 |
| items[].sortText | string | 排序权重 |

### 2.4 技术实现方案

#### 2.4.1 修改 SqlParserService

**文件**: `src/main/sql-language-server/services/sqlParserService.ts`

新增上下文类型：
```typescript
// 在 CursorContext type 中新增
type ContextType = 
  | 'ORDER_BY_CLAUSE'  // 新增
  | 'GROUP_BY_CLAUSE'  // 新增
  | ... // 现有类型
```

修改 `analyzeContext` 方法，增加 ORDER BY / GROUP BY 检测：
```typescript
// 在 WHERE_CLAUSE 检测之后，添加 ORDER BY / GROUP BY 检测
if (this.isInOrderByClause(textBefore, textBeforeUpper, lastKeyword)) {
  const tables = this.extractTablesFromSql(sql)
  return { type: 'ORDER_BY_CLAUSE', tables }
}

if (this.isInGroupByClause(textBefore, textBeforeUpper, lastKeyword)) {
  const tables = this.extractTablesFromSql(sql)
  return { type: 'GROUP_BY_CLAUSE', tables }
}
```

新增检测方法：
```typescript
private isInOrderByClause(textBefore: string, textBeforeUpper: string, lastKeyword: string | null): boolean {
  if (!textBeforeUpper.includes('ORDER')) return false
  
  // ORDER BY 后直接跟空格
  if (/\bORDER\s+BY\s+$/i.test(textBefore)) return true
  
  // ORDER BY 后正在输入字段
  if (lastKeyword === 'BY') {
    const afterOrderBy = textBefore.split(/\bORDER\s+BY\b/i).pop() || ''
    // 排除已有 LIMIT 等后续子句
    if (!/\b(LIMIT|OFFSET)\b/i.test(afterOrderBy)) {
      return true
    }
  }
  
  // ORDER BY 后逗号分隔的多个字段
  if (/\bORDER\s+BY\s+[\w.,\s`]+,\s*$/i.test(textBefore)) return true
  
  return false
}

private isInGroupByClause(textBefore: string, textBeforeUpper: string, lastKeyword: string | null): boolean {
  // 类似逻辑
}
```

#### 2.4.2 修改 CompletionProvider

**文件**: `src/main/sql-language-server/providers/completionProvider.ts`

在 `provideCompletionItems` 的 switch 语句中新增处理：
```typescript
case 'ORDER_BY_CLAUSE':
case 'GROUP_BY_CLAUSE':
  if (context.tables && context.tables.length > 0) {
    this.addColumnSuggestionsForTables(suggestions, context.tables, context.tables.length > 1)
  }
  // 添加排序方向关键字
  this.addKeywordSuggestions(suggestions, ['ASC', 'DESC', 'NULLS', 'FIRST', 'LAST'])
  break
```

## 3. FR-002: LIMIT 自动添加修复 - 详细设计

### 3.1 功能概述

修复当 SQL 语句末尾带分号时，自动添加 LIMIT 导致语法错误的问题。

### 3.2 用例设计

#### 正常用例

**UC-002-01: 带分号 SQL 执行**
- **输入**: `SELECT * FROM users;`
- **处理**:
  1. 检测 SQL 末尾分号
  2. 移除分号
  3. 添加 LIMIT
- **输出**: 执行 `SELECT * FROM users LIMIT 5000`

**UC-002-02: 不带分号 SQL 执行**
- **输入**: `SELECT * FROM users`
- **处理**: 直接添加 LIMIT
- **输出**: 执行 `SELECT * FROM users LIMIT 5000`

#### 异常用例

**UC-002-E01: 已有 LIMIT 子句**
- **输入**: `SELECT * FROM users LIMIT 100;`
- **处理**: 检测到已有 LIMIT，不再添加
- **输出**: 执行 `SELECT * FROM users LIMIT 100`

**UC-002-E02: 非 SELECT 语句**
- **输入**: `UPDATE users SET name = 'test' WHERE id = 1;`
- **处理**: 非 SELECT 语句，不添加 LIMIT
- **输出**: 执行原语句

#### 边界用例

**UC-002-B01: 末尾多个空格和分号**
- **输入**: `SELECT * FROM users  ;  `
- **处理**: 去除末尾空白和分号
- **输出**: 执行 `SELECT * FROM users LIMIT 5000`

**UC-002-B02: LIMIT 在子查询中**
- **输入**: `SELECT * FROM (SELECT * FROM users LIMIT 10) AS sub;`
- **处理**: 主查询无 LIMIT，添加 LIMIT
- **输出**: 执行 `SELECT * FROM (SELECT * FROM users LIMIT 10) AS sub LIMIT 5000`

**UC-002-B03: 多条语句**
- **输入**: `SELECT * FROM users; SELECT * FROM orders;`
- **处理**: 每条 SELECT 语句独立处理
- **输出**: 
  - 执行 `SELECT * FROM users LIMIT 5000`
  - 执行 `SELECT * FROM orders LIMIT 5000`

### 3.3 技术实现方案

**文件**: `src/main/database/query-executor.ts`

修改执行逻辑：
```typescript
// 判断是否是 SELECT 语句，添加 LIMIT
const isSelect = /^\s*SELECT\s/i.test(statement)
let execSql = statement

if (isSelect && !hasLimit(statement)) {
  // 新增：移除末尾分号
  execSql = statement.replace(/;\s*$/, '').trim()
  execSql = `${execSql} LIMIT ${maxRows}`
}
```

修改 `hasLimit` 函数（增强判断）：
```typescript
function hasLimit(sql: string): boolean {
  // 移除字符串和注释后检查
  const cleanSql = removeStringsAndComments(sql)
  // 检查主查询是否有 LIMIT（排除子查询中的 LIMIT）
  // 使用更精确的正则
  return /\bLIMIT\s+\d+(?:\s*,\s*\d+)?(?:\s*(?:OFFSET\s+\d+)?)\s*;?\s*$/i.test(cleanSql)
}
```

## 4. FR-003: Excel 导出 - 详细设计

### 4.1 功能概述

新增 Excel (xlsx) 格式导出功能，并优化导出按钮的交互方式。

### 4.2 用例设计

#### 正常用例

**UC-003-01: 导出 Excel 文件**
- **前置条件**: 有查询结果集
- **触发条件**: 用户点击导出下拉菜单中的 xlsx
- **主流程**:
  1. 弹出文件保存对话框
  2. 用户选择路径和文件名
  3. 生成 xlsx 文件
  4. 提示导出成功
- **后置条件**: 文件已保存

**UC-003-02: 导出 CSV/JSON 文件**
- **处理**: 与现有逻辑一致
- **结果**: 保持兼容

#### 异常用例

**UC-003-E01: 无查询结果**
- **触发条件**: 当前无结果集
- **处理**: 导出按钮禁用
- **结果**: 无法点击

**UC-003-E02: 导出失败**
- **触发条件**: 磁盘空间不足/权限问题
- **处理**: 显示错误信息
- **结果**: 提示用户

#### 边界用例

**UC-003-B01: 大数据量导出**
- **输入**: 10000 行 × 50 列数据
- **处理**: 异步生成，显示进度
- **结果**: 正常导出

**UC-003-B02: 特殊字符处理**
- **输入**: 包含换行、制表符、Unicode 的数据
- **处理**: 正确转义
- **结果**: Excel 正常显示

### 4.3 技术实现方案

#### 4.3.1 安装依赖

```bash
npm install exceljs
npm install --save-dev @types/exceljs
```

#### 4.3.2 修改 IPC 处理器

**文件**: `src/main/ipc/file.ts`

扩展 FILE_EXPORT 处理：
```typescript
import * as ExcelJS from 'exceljs'

ipcMain.handle(IpcChannels.FILE_EXPORT, async (_, data: { 
  columns: { name: string; type: string }[]
  rows: Record<string, unknown>[]
  format: 'csv' | 'json' | 'xlsx'  // 新增 xlsx
}) => {
  const { columns, rows, format } = data
  
  const filters = format === 'xlsx'
    ? [{ name: 'Excel Files', extensions: ['xlsx'] }]
    : format === 'csv'
    ? [{ name: 'CSV Files', extensions: ['csv'] }]
    : [{ name: 'JSON Files', extensions: ['json'] }]
  
  const result = await dialog.showSaveDialog({
    filters,
    defaultPath: `export.${format}`
  })
  
  if (result.canceled || !result.filePath) {
    return { success: false, canceled: true }
  }
  
  try {
    if (format === 'xlsx') {
      await exportToExcel(result.filePath, columns, rows)
    } else if (format === 'csv') {
      // 现有 CSV 逻辑
    } else {
      // 现有 JSON 逻辑
    }
    
    return { success: true, filePath: result.filePath }
  } catch (error) {
    return { success: false, message: error.message }
  }
})

async function exportToExcel(
  filePath: string,
  columns: { name: string; type: string }[],
  rows: Record<string, unknown>[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Query Result')
  
  // 设置列头
  worksheet.columns = columns.map(col => ({
    header: col.name,
    key: col.name,
    width: Math.max(col.name.length + 2, 15)
  }))
  
  // 添加数据
  rows.forEach(row => {
    worksheet.addRow(row)
  })
  
  // 设置列头样式
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }
  
  await workbook.xlsx.writeFile(filePath)
}
```

#### 4.3.3 修改 ResultPanel UI

**文件**: `src/renderer/components/ResultPanel.vue`

替换导出按钮为下拉菜单：
```vue
<template>
  <!-- 导出按钮改为下拉菜单 -->
  <el-dropdown trigger="hover" v-if="canExport" @command="handleExport">
    <button class="export-btn">
      📥 导出
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="xlsx">Excel (.xlsx)</el-dropdown-item>
        <el-dropdown-item command="csv">CSV (.csv)</el-dropdown-item>
        <el-dropdown-item command="json">JSON (.json)</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 修改 handleExport 支持 xlsx
async function handleExport(format: 'csv' | 'json' | 'xlsx') {
  const data = currentResultSet.value
  if (!data) {
    ElMessage.warning('没有可导出的数据')
    return
  }
  
  const result = await window.api.file.export(data.columns, data.rows, format)
  if (result.success) {
    ElMessage.success(`导出成功: ${result.filePath}`)
  } else if (!result.canceled) {
    ElMessage.error(result.message || '导出失败')
  }
}
</script>
```

#### 4.3.4 更新 Preload API

**文件**: `src/preload/index.ts`

更新类型定义：
```typescript
export: (
  columns: { name: string; type: string }[],
  rows: Record<string, unknown>[],
  format: 'csv' | 'json' | 'xlsx'  // 新增 xlsx
) => ipcRenderer.invoke(IpcChannels.FILE_EXPORT, { columns, rows, format })
```

## 5. FR-004: 性能优化 - 详细设计

### 5.1 功能概述

优化大数据量结果切换性能，减少卡顿感。

### 5.2 性能分析

#### 当前问题

1. **DOM 渲染瓶颈**: el-table 渲染 5000 行数据时 DOM 节点过多
2. **数据传递开销**: 切换标签页时完整数据重新渲染
3. **内存占用**: 多个结果集同时在内存中

#### 优化策略

| 策略 | 效果 | 复杂度 | 建议 |
|------|------|--------|------|
| 虚拟滚动 | 高 | 中 | 推荐 |
| 数据分页 | 中 | 低 | 备选 |
| 懒加载 | 中 | 中 | 配合使用 |

### 5.3 技术实现方案

#### 5.3.1 使用虚拟滚动表格

**方案 A: 使用 vxe-table**

安装：
```bash
npm install vxe-table xe-utils
```

替换 ResultTable 组件核心：
```vue
<template>
  <vxe-table
    :data="data.rows"
    :columns="tableColumns"
    height="100%"
    :row-config="{ height: 32 }"
    :scroll-y="{ enabled: true, gt: 100 }"
  />
</template>

<script setup lang="ts">
import { VxeTable } from 'vxe-table'
</script>
```

**方案 B: 使用 el-table-virtual（Element Plus 增强）**

```vue
<el-table-v2
  :data="data.rows"
  :columns="tableColumns"
  :height="tableHeight"
  :row-height="32"
/>
```

#### 5.3.2 实现数据分页加载

在 result store 中增加分页：
```typescript
// 每页显示条数
const PAGE_SIZE = 100

// 当前显示的数据
const displayedRows = computed(() => {
  const start = currentPage.value * PAGE_SIZE
  const end = start + PAGE_SIZE
  return currentResultSet.value?.rows.slice(start, end) || []
})

// 滚动加载更多
function loadMore() {
  if (currentPage.value * PAGE_SIZE < totalRows.value) {
    currentPage.value++
  }
}
```

### 5.4 验收标准

| 场景 | 当前耗时 | 目标耗时 |
|------|----------|----------|
| 5000行切换 | ~500ms | < 100ms |
| 10000行滚动 | 卡顿 | 流畅 |
| 内存占用 | ~200MB | < 100MB |

## 6. 错误处理设计

### 6.1 错误码定义

| 错误码 | 类型 | 说明 |
|--------|------|------|
| E5001 | 导出错误 | Excel 文件写入失败 |
| E5002 | 导出错误 | 磁盘空间不足 |
| E5003 | 导出错误 | 文件权限错误 |

### 6.2 错误处理策略

| 场景 | 处理方式 | 用户提示 |
|------|----------|----------|
| 补全服务异常 | 静默失败 | 无（不影响编辑） |
| SQL 执行错误 | 显示错误 | 错误面板显示详情 |
| 导出失败 | 弹窗提示 | "导出失败: {原因}" |

## 7. 测试契约

### 7.1 FR-001 测试契约

#### TC-001-01: 单表 ORDER BY 补全
**类型**: 正常用例 | **优先级**: P0

**Given**:
- 已连接 MySQL 数据库
- 元数据已加载表 `users` (id, name, email)

**When**:
- 输入 `SELECT * FROM users ORDER BY `
- 触发补全

**Then**:
- 补全列表包含 id, name, email
- 字段类型显示正确

#### TC-001-02: 多表 JOIN ORDER BY 补全
**类型**: 正常用例 | **优先级**: P0

**Given**:
- 已连接 MySQL 数据库
- 元数据已加载表 `users` (id, name), `orders` (order_id, user_id)

**When**:
- 输入 `SELECT * FROM users u JOIN orders o ON u.id = o.user_id ORDER BY `
- 触发补全

**Then**:
- 补全列表包含 u.id, u.name, o.order_id, o.user_id
- 字段带表别名前缀

### 7.2 FR-002 测试契约

#### TC-002-01: 带分号 SQL 执行
**类型**: 正常用例 | **优先级**: P0

**Given**:
- 已连接 MySQL 数据库
- 当前数据库有 `users` 表

**When**:
- 执行 `SELECT * FROM users;`

**Then**:
- 执行成功，返回结果
- 实际执行语句为 `SELECT * FROM users LIMIT 5000`

### 7.3 FR-003 测试契约

#### TC-003-01: Excel 导出
**类型**: 正常用例 | **优先级**: P1

**Given**:
- 有查询结果集 (10 行 × 5 列)

**When**:
- 点击导出 → xlsx

**Then**:
- 弹出保存对话框
- 保存成功提示
- 文件可用 Excel 打开
- 列头正确
- 数据正确

## 8. 实现计划

### 8.1 开发顺序

1. **Phase 1** (P0): FR-002 LIMIT 修复 - 0.5 天
2. **Phase 2** (P0): FR-001 ORDER BY 补全 - 1 天
3. **Phase 3** (P1): FR-003 Excel 导出 - 1 天
4. **Phase 4** (P2): FR-004 性能优化 - 2 天

### 8.2 修改文件清单

| 功能 | 文件 | 修改类型 |
|------|------|----------|
| FR-001 | `sqlParserService.ts` | 修改 |
| FR-001 | `completionProvider.ts` | 修改 |
| FR-001 | `types/index.ts` | 修改 |
| FR-002 | `query-executor.ts` | 修改 |
| FR-003 | `ipc/file.ts` | 修改 |
| FR-003 | `preload/index.ts` | 修改 |
| FR-003 | `ResultPanel.vue` | 修改 |
| FR-004 | `ResultTable.vue` | 修改 |
| FR-003 | `package.json` | 修改 (新增依赖) |

---

## 附录

### A. 变更历史

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0 | 2026-01-21 | AI | 初始版本 |

### B. 参考文档

- 需求规格: `workspace/RC-009/requirements/requirements.md`
- Language Server 设计: `requirements/tech-design/sql-language-server.md`
- ExcelJS 文档: https://github.com/exceljs/exceljs
