# RC-015 技术方案设计

## 1. 概述

### 1.1 需求目标
- 优化列宽动态计算：同时考虑表头名称和数据内容长度
- 实现列宽状态持久化：按编辑器标签页保存/恢复列宽

### 1.2 设计原则
- 最小改动原则：复用现有代码结构
- 性能优先：仅采样可见行，不扫描全部数据

### 1.3 实现状态
- ✅ 已完成编码
- ✅ 构建通过

---

## 2. 详细设计

### 2.1 列宽计算算法

```typescript
/**
 * 计算列宽
 * @param columnName 列名
 * @param columnType 列类型
 * @param sampleRows 采样数据行
 * @returns 计算后的列宽（px）
 */
function calculateColumnWidth(
  columnName: string,
  columnType: string,
  sampleRows: Record<string, unknown>[]
): number {
  const CHAR_WIDTH = 8          // 单字符宽度（英文）
  const CHINESE_CHAR_WIDTH = 16 // 中文字符宽度
  const TYPE_LABEL_WIDTH = 30   // 类型标签额外宽度
  const PADDING = 24            // 单元格 padding
  const MIN_WIDTH = 50
  const MAX_WIDTH = 300

  // 1. 计算表头宽度
  const headerWidth = getTextWidth(columnName) + TYPE_LABEL_WIDTH + PADDING

  // 2. 计算数据内容最大宽度
  let maxDataWidth = 0
  for (const row of sampleRows) {
    const value = row[columnName]
    const displayValue = value === null ? 'NULL' : String(value)
    const textWidth = getTextWidth(displayValue) + PADDING
    maxDataWidth = Math.max(maxDataWidth, textWidth)
  }

  // 3. 取较大值并应用限制
  const calculatedWidth = Math.max(headerWidth, maxDataWidth)
  return Math.min(Math.max(calculatedWidth, MIN_WIDTH), MAX_WIDTH)
}

/**
 * 计算文本宽度（考虑中英文）
 */
function getTextWidth(text: string): number {
  let width = 0
  for (const char of text) {
    // 中文字符（Unicode 范围）
    if (/[\u4e00-\u9fa5]/.test(char)) {
      width += 16
    } else {
      width += 8
    }
  }
  return width
}
```

### 2.2 采样逻辑

```typescript
/**
 * 获取采样行数
 * @param containerHeight 可视区域高度
 * @param rowHeight 行高
 * @returns 采样行数
 */
function getSampleRowCount(containerHeight: number, rowHeight: number): number {
  const visibleRows = Math.ceil(containerHeight / rowHeight)
  return Math.min(visibleRows, 20) // 最多采样 20 行
}
```

### 2.3 状态存储结构

**修改 `result.ts` 中的 `TabResultState` 接口**：

```typescript
interface TabResultState {
  tabs: ResultTab[]
  messages: { type: 'info' | 'success' | 'warning' | 'error'; text: string; time: Date }[]
  activeTabId: string
  executionStatus: ExecutionStatus
  columnWidths: Record<string, number>  // 新增：列宽状态
}
```

### 2.4 数据流设计

```
┌─────────────────────────────────────────────────────────────┐
│                     ResultTable.vue                         │
├─────────────────────────────────────────────────────────────┤
│  initColumnWidths()                                         │
│    ├─ 检查 store 是否有已保存的列宽                          │
│    │    ├─ 有 → 使用保存的列宽                               │
│    │    └─ 无 → 执行动态计算                                 │
│    │         ├─ getSampleRows() 获取采样行                   │
│    │         ├─ calculateColumnWidth() 计算每列宽度          │
│    │         └─ 应用 MIN/MAX 限制                            │
│    └─ 更新 columnWidths ref                                  │
│                                                             │
│  handleResizeEnd()                                          │
│    └─ 保存列宽到 store                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      result.ts (store)                      │
├─────────────────────────────────────────────────────────────┤
│  TabResultState.columnWidths                                │
│    ├─ saveColumnWidths(editorTabId, widths)                 │
│    ├─ getColumnWidths(editorTabId)                          │
│    └─ clearColumnWidths(editorTabId) // 执行 SQL 时调用      │
└─────────────────────────────────────────────────────────────┘
```

### 2.5 关键场景处理

| 场景 | 处理逻辑 |
|------|----------|
| 首次查询 | 动态计算列宽 |
| 切换标签页 | 从 store 恢复列宽 |
| 手动拖动列宽 | 保存到 store |
| 重新执行 SQL | 清除 store 中的列宽，重新计算 |

---

## 3. 接口变更

### 3.1 result.ts 新增方法

```typescript
// 保存列宽
function saveColumnWidths(editorTabId: string, widths: Record<string, number>): void

// 获取列宽
function getColumnWidths(editorTabId: string): Record<string, number> | null

// 清除列宽（重新执行 SQL 时调用）
function clearColumnWidths(editorTabId: string): void
```

---

## 4. 测试要点

| 测试场景 | 预期结果 |
|----------|----------|
| 短列名短数据 | 列宽 = 50px（最小值） |
| 短列名长数据 | 列宽基于数据计算，≤ 300px |
| 长列名短数据 | 列宽基于列名计算 |
| 中文数据 | 中文按 2 倍宽度计算 |
| 切换标签页 | 列宽保持 |
| 重新执行 SQL | 列宽重置 |
| 手动拖动 | 列宽按用户设置 |

---

## 5. 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 字符宽度计算不精确 | 使用 canvas.measureText 或近似值（选择近似值，性能更好） |
| 大数据量性能 | 仅采样前 20 行 |
