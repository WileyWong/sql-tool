# 工具类索引

> **覆盖范围**: `{{BASE_PACKAGE}}.utils`, `{{BASE_PACKAGE}}.util`  
> **文件总数**: {{UTIL_COUNT}}个  
> **代码总行数**: {{UTIL_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
utils/
├── DateUtils - 日期工具
├── StringUtils - 字符串工具
├── JsonUtils - JSON工具
└── ...
```

### 按功能分类
| 功能 | 工具类数量 |
|------|-----------|
| 日期处理 | 1 |
| 字符串处理 | 1 |
| JSON处理 | 1 |

---

## 二、详细清单

### DateUtils - 日期工具

**路径**: `com.company.project.utils.DateUtils`

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|----------|
| `formatDate(LocalDateTime date, String pattern)` | date - 日期<br>pattern - 格式 | `String` | 格式化日期 |
| `parseDate(String dateStr, String pattern)` | dateStr - 日期字符串<br>pattern - 格式 | `LocalDateTime` | 解析日期 |
| `getDaysBetween(LocalDateTime start, LocalDateTime end)` | start, end | `long` | 计算天数差 |

### JsonUtils - JSON工具

**路径**: `com.company.project.utils.JsonUtils`

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|----------|
| `toJson(Object obj)` | obj - 对象 | `String` | 对象转JSON |
| `fromJson(String json, Class<T> clazz)` | json, clazz | `T` | JSON转对象 |

---

## 📚 相关文档

- [Common公共类索引](./common.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
