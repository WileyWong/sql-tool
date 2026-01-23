# RC-010 变更记录

## 基本信息

| 项目 | 内容 |
|------|------|
| 变更编号 | RC-010 |
| 变更日期 | 2026-01-23 |
| 实现状态 | 已完成 |

## 变更内容

### 1. 编辑后保存状态管理修复 (FR-001)

**问题**: 编辑单元格回车保存后，执行新查询时会提示"还没有保存"

**解决方案**: 
- 移除 `confirmEdit()` 成功后的 `markAsModified()` 调用
- 数据成功写入数据库后不再标记为有修改

**涉及文件**: `src/renderer/components/ResultTable.vue`

### 2. 编辑单元格状态栏提示 (FR-002)

**需求**: 双击单元格进入编辑模式时，在状态栏显示"编辑后回车保存"提示

**实现**:
- 在状态栏增加条件渲染的编辑提示
- 使用淡蓝色 (#4fc3f7) 突出显示

**涉及文件**: `src/renderer/components/ResultTable.vue`

### 3. 日期类型编辑格式修复 (FR-003)

**问题**: 双击日期类型单元格时，编辑框显示 ISO 格式如 "2026-01-20T16:00:00.000Z"

**解决方案**:
- 在 `handleCellDblClick()` 中获取列类型信息
- 使用 `formatDateTime()` 格式化编辑框中的日期值
- DATE 显示为 "YYYY-MM-DD"
- DATETIME/TIMESTAMP 显示为 "YYYY-MM-DD HH:mm:ss"

**涉及文件**: `src/renderer/components/ResultTable.vue`

### 4. BIT 类型显示优化 (FR-004)

**需求**: BIT(1) 类型字段显示为 "true" 或 "false"

**实现**:
- 新增 `formatBitValue()` 函数
- 支持 Buffer 对象、数字、字符串、布尔值等多种输入格式
- 仅对 BIT(1) 生效，BIT(n>1) 保持原有逻辑

**涉及文件**: `src/renderer/components/ResultTable.vue`

### 5. 导出数据格式优化 (FR-005)

**需求**: 导出数据按表格显示格式进行导出

**实现**:
- 在 `ResultPanel.vue` 中新增格式化函数
- 导出前遍历数据应用格式化
- 日期类型导出格式化字符串
- BIT(1) 类型导出 "true"/"false"

**涉及文件**: `src/renderer/components/ResultPanel.vue`

## 修改文件清单

| 文件 | 变更类型 | 变更行数 |
|------|---------|---------|
| `src/renderer/components/ResultTable.vue` | 修改 | +60/-15 |
| `src/renderer/components/ResultPanel.vue` | 修改 | +120/-10 |

## 验收检查

- [x] FR-001: 编辑回车保存后执行新查询无警告
- [x] FR-002: 编辑模式状态栏显示提示
- [x] FR-003: 日期类型编辑框显示格式化值
- [x] FR-004: BIT(1) 显示为 true/false
- [x] FR-005: 导出数据格式与表格一致
- [x] 代码无 lint 错误
