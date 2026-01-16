# RC-007-3 结果表格日期格式化

## 需求
结果表格(ResultTable.vue)中根据列类型格式化日期时间值：
- DATE: `yyyy-MM-dd`
- DATETIME: `yyyy-MM-dd HH:mm:ss`
- DATETIME(fsp): 在 DATETIME 基础上显示毫秒
- TIME: `HH:mm:ss`
- TIMESTAMP/TIMESTAMP(fsp): 同 DATETIME
- YEAR: `yyyy`

## 修改文件

### src/renderer/components/ResultTable.vue

1. **新增 `formatDateTime` 函数**：
   - 根据列类型判断格式化方式
   - 支持 DATE、DATETIME、DATETIME(fsp)、TIME、TIME(fsp)、TIMESTAMP、TIMESTAMP(fsp)、YEAR 类型
   - 解析 fsp 参数控制毫秒显示位数

2. **修改 `formatValue` 函数**：
   - 添加 `columnType` 参数
   - 优先尝试日期时间格式化

3. **修改模板**：
   - 传递列类型给 `formatValue` 函数

## 格式化逻辑

```typescript
// DATE: yyyy-MM-dd
// DATETIME: yyyy-MM-dd HH:mm:ss
// DATETIME(3): yyyy-MM-dd HH:mm:ss.fff
// TIME: HH:mm:ss
// TIME(3): HH:mm:ss.fff
// TIMESTAMP: yyyy-MM-dd HH:mm:ss
// YEAR: yyyy
```

## 测试用例
| 类型 | 原始值 | 显示值 |
|------|--------|--------|
| DATE | 2026-01-16 | 2026-01-16 |
| DATETIME | 2026-01-16T10:30:00 | 2026-01-16 10:30:00 |
| DATETIME(3) | 2026-01-16T10:30:00.123 | 2026-01-16 10:30:00.123 |
| TIME | 10:30:00 | 10:30:00 |
| YEAR | 2026 | 2026 |
