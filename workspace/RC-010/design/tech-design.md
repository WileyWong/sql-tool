# RC-010 技术设计文档

## 1. 概述

本文档描述 RC-010 需求变更的技术实现方案，涉及 SQL 结果表格编辑、显示和导出功能的优化。

## 2. 变更范围

### 2.1 涉及文件

| 文件路径 | 变更类型 | 说明 |
|---------|---------|------|
| `src/renderer/components/ResultTable.vue` | 修改 | 编辑状态管理、日期格式化、BIT 类型显示、状态栏提示 |
| `src/renderer/components/ResultPanel.vue` | 修改 | 导出数据格式化 |

### 2.2 模块关系

```
ResultPanel.vue
└── ResultTable.vue
    ├── formatValue() - 显示格式化
    ├── formatDateTime() - 日期时间格式化
    ├── formatBitValue() - BIT 类型格式化
    └── handleCellDblClick() - 编辑模式入口
```

## 3. 详细设计

### 3.1 FR-001: 编辑后保存状态管理修复

**问题分析**：
- 原逻辑在 `confirmEdit()` 成功后调用 `resultStore.markAsModified()`
- 这导致即使数据已成功写入数据库，仍被标记为"有修改"
- 执行新查询时会误报"还没有保存"

**解决方案**：
- 移除 `confirmEdit()` 成功后的 `markAsModified()` 调用
- 数据库更新成功即表示持久化完成，无需额外标记

**代码变更**：
```typescript
// ResultTable.vue - confirmEdit()
if (result.success) {
  row[column] = newValue
  // 移除: resultStore.markAsModified(rowKey, { ...row })
  ElMessage.success('更新成功')
}
```

### 3.2 FR-002: 编辑单元格状态栏提示

**设计方案**：
- 在状态栏增加编辑提示，基于 `editingCell` 状态切换显示
- 编辑模式时显示 "编辑后回车保存"
- 非编辑模式且可编辑时显示 "可编辑"

**模板变更**：
```html
<div class="status-bar">
  <span>{{ data.rowCount }} 行</span>
  <span>耗时 {{ data.executionTime }}ms</span>
  <span v-if="editingCell" class="editing-hint">编辑后回车保存</span>
  <span v-else-if="data.editable" class="editable-hint">可编辑</span>
</div>
```

**样式**：
```css
.editing-hint {
  color: #4fc3f7;
  margin-left: auto;
  font-weight: 500;
}
```

### 3.3 FR-003: 日期类型编辑格式修复

**问题分析**：
- 原逻辑在 `handleCellDblClick()` 中直接使用 `String(value)` 转换
- 日期类型值可能是 Date 对象或 ISO 字符串，转换结果不友好

**解决方案**：
- 复用 `formatDateTime()` 函数格式化编辑框中的日期值
- 获取列类型信息，根据类型调用相应格式化函数

**代码变更**：
```typescript
// handleCellDblClick()
const columnInfo = props.data.columns.find(c => c.name === column.property)
const columnType = columnInfo?.type || ''

// 根据类型格式化编辑值
const cellValue = row[column.property]
if (cellValue === null) {
  editValue.value = ''
} else {
  const formattedDate = formatDateTime(cellValue, columnType)
  if (formattedDate !== null) {
    editValue.value = formattedDate
  } else if (typeof cellValue === 'object') {
    editValue.value = JSON.stringify(cellValue)
  } else {
    editValue.value = String(cellValue)
  }
}
```

### 3.4 FR-004: BIT 类型显示优化

**设计方案**：
- 新增 `formatBitValue()` 函数处理 BIT 类型
- 仅处理 BIT(1) 类型，显示为 "true"/"false"
- 支持多种值格式：Buffer 对象、数字、字符串、布尔值

**实现**：
```typescript
function formatBitValue(value: unknown, columnType: string): string | null {
  const upperType = columnType.toUpperCase()
  if (!upperType.startsWith('BIT')) return null
  
  const bitMatch = upperType.match(/^BIT(?:\((\d+)\))?$/)
  if (!bitMatch) return null
  
  const bitLength = bitMatch[1] ? parseInt(bitMatch[1], 10) : 1
  if (bitLength !== 1) return null
  
  // 处理各种值类型
  if (typeof value === 'object' && value !== null) {
    const bufferObj = value as { type?: string; data?: number[] }
    if (bufferObj.type === 'Buffer' && Array.isArray(bufferObj.data)) {
      return bufferObj.data[0] === 1 ? 'true' : 'false'
    }
  }
  
  if (typeof value === 'number') {
    return value === 1 ? 'true' : 'false'
  }
  // ... 其他类型处理
}
```

**调用顺序**：
```typescript
function formatValue(value: unknown, columnType?: string): string {
  if (value === null) return 'NULL'
  if (value === undefined) return ''
  
  if (columnType) {
    // 优先尝试 BIT 类型格式化
    const formattedBit = formatBitValue(value, columnType)
    if (formattedBit !== null) return formattedBit
    
    // 再尝试日期时间格式化
    const formatted = formatDateTime(value, columnType)
    if (formatted !== null) return formatted
  }
  // ... 默认处理
}
```

### 3.5 FR-005: 导出数据格式优化

**设计方案**：
- 在 `ResultPanel.vue` 中复制格式化函数
- 导出前遍历所有行数据，应用格式化
- 格式化后的数据再传给 IPC 进行文件写入

**实现**：
```typescript
// ResultPanel.vue
function formatValueForExport(value: unknown, columnType: string): unknown {
  if (value === null || value === undefined) return null
  
  const formattedBit = formatBitValue(value, columnType)
  if (formattedBit !== null) return formattedBit
  
  const formattedDate = formatDateTime(value, columnType)
  if (formattedDate !== null) return formattedDate
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return value
}

async function handleExport(format: 'csv' | 'json' | 'xlsx') {
  // 格式化导出数据
  const formattedRows = data.rows.map(row => {
    const formattedRow: Record<string, unknown> = {}
    data.columns.forEach(col => {
      formattedRow[col.name] = formatValueForExport(row[col.name], col.type)
    })
    return formattedRow
  })
  
  const result = await window.api.file.export(columns, formattedRows, format)
}
```

## 4. 测试要点

### 4.1 编辑功能测试

| 测试场景 | 预期结果 |
|---------|---------|
| 双击可编辑单元格 | 状态栏显示"编辑后回车保存" |
| 回车保存成功后执行新查询 | 无未保存警告 |
| 双击 DATE 类型单元格 | 编辑框显示 "2026-01-21" 格式 |
| 双击 DATETIME 类型单元格 | 编辑框显示 "2026-01-21 12:30:45" 格式 |

### 4.2 显示功能测试

| 测试场景 | 预期结果 |
|---------|---------|
| BIT(1) 值为 1 | 显示 "true" |
| BIT(1) 值为 0 | 显示 "false" |
| BIT(1) 值为 NULL | 显示 "NULL" |
| BIT(8) 字段 | 保持原有显示逻辑 |

### 4.3 导出功能测试

| 测试场景 | 预期结果 |
|---------|---------|
| 导出含 DATE 列的 CSV | 日期格式为 "2026-01-21" |
| 导出含 BIT(1) 列的 CSV | 值为 "true" 或 "false" |
| 导出含 NULL 值的 CSV | 导出为空字符串 |
| 导出含 NULL 值的 JSON | 导出为 null |

## 5. 风险与注意事项

1. **格式化函数复制**：`formatDateTime` 和 `formatBitValue` 在两个组件中有重复实现，后续可考虑提取到公共工具模块
2. **BIT 类型判断**：依赖列类型字符串匹配，需确保数据库驱动返回的类型名称一致
3. **时区处理**：日期时间格式化使用本地时区，与数据库时区可能存在差异
