# RC-007-2: DATETIME 类型精度(fsp)支持

## 变更概述

| 项目 | 内容 |
|------|------|
| 变更编号 | RC-007-2 |
| 实现日期 | 2026-01-16 |
| 关联需求 | RC-007 需求2 |

## 需求描述

DATETIME 可以指定精度，现在无法实现。需要支持 DATETIME(fsp)、TIME(fsp)、TIMESTAMP(fsp) 类型的精度参数输入。

## 实现方案

### 修改文件

1. `src/shared/types/database.ts`
2. `src/renderer/components/TableDesignDialog.vue`

### 具体修改

#### 1. database.ts

**修改 `typeNeedsLength` 函数**

添加日期时间类型支持：

```typescript
export function typeNeedsLength(type: string): boolean {
  const needsLength = [
    'CHAR', 'VARCHAR', 'BINARY', 'VARBINARY', 'BIT', 
    'DECIMAL', 'FLOAT', 'DOUBLE',
    // 日期时间类型支持小数秒精度 (fsp: 0-6)
    'DATETIME', 'TIME', 'TIMESTAMP'
  ]
  return needsLength.includes(type.toUpperCase())
}
```

**新增 `typeNeedsFsp` 函数**

用于识别支持小数秒精度的日期时间类型：

```typescript
export function typeNeedsFsp(type: string): boolean {
  return ['DATETIME', 'TIME', 'TIMESTAMP'].includes(type.toUpperCase())
}
```

#### 2. TableDesignDialog.vue

**导入新函数**

```typescript
import { MySQLDataTypes, typeNeedsLength, typeNeedsDecimals, typeSupportsUnsigned, typeNeedsFsp } from '@shared/types/database'
```

**修改模板 - 长度列**

对日期时间类型限制精度范围为 0-6：

```vue
<el-table-column label="长度" width="80">
  <template #default="{ row }">
    <el-input-number
      v-if="typeNeedsFsp(row.type)"
      v-model="row.length"
      size="small"
      :min="0"
      :max="6"
      :controls="false"
      style="width: 100%"
      placeholder="精度"
    />
    <el-input-number
      v-else-if="typeNeedsLength(row.type)"
      v-model="row.length"
      size="small"
      :min="1"
      :controls="false"
      style="width: 100%"
    />
    <span v-else class="disabled-cell">-</span>
  </template>
</el-table-column>
```

**修改 `handleTypeChange` 函数**

添加日期时间类型的处理：

```typescript
else if (['DATETIME', 'TIME', 'TIMESTAMP'].includes(row.type)) {
  // 日期时间类型默认不设置精度（即精度为0）
  // 用户可以手动设置 0-6 的精度
  row.length = undefined
}
```

## 验收标准

1. 新建表时，选择 DATETIME/TIME/TIMESTAMP 类型后，"长度"列变为可编辑
2. 精度输入限制为 0-6 的整数
3. 生成的 SQL 正确包含精度参数，如 `DATETIME(3)`
4. 修改表时，能正确解析已有的 DATETIME(fsp) 类型

## 测试用例

| 场景 | 操作 | 期望结果 |
|------|------|----------|
| 新建 DATETIME 字段 | 选择 DATETIME 类型，设置精度为 3 | SQL 显示 `DATETIME(3)` |
| 新建 TIME 字段 | 选择 TIME 类型，设置精度为 6 | SQL 显示 `TIME(6)` |
| 精度边界测试 | 尝试输入精度 7 | 自动限制为 6 |
| 修改现有表 | 修改已有 DATETIME(3) 字段 | 正确显示精度值 3 |
