# Response对象索引

> **覆盖范围**: `{{BASE_PACKAGE}}.response`, `{{BASE_PACKAGE}}.vo`  
> **文件总数**: {{RESPONSE_COUNT}}个  
> **代码总行数**: {{RESPONSE_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
response/
├── UserVO - 用户视图对象
├── OrderVO - 订单视图对象
└── ...
```

### 按功能分类
| 功能模块 | VO数量 | 用途 |
|---------|--------|------|
| 用户管理 | 1 | API响应 |

---

## 二、详细清单

### UserVO - 用户视图对象

**路径**: `com.company.project.vo.UserVO`  
**用途**: Controller 层返回给前端

| 属性 | 类型 | 说明 |
|------|------|------|
| id | Long | 用户ID |
| username | String | 用户名 |
| email | String | 邮箱 |
| status | Integer | 状态 |
| createdAt | LocalDateTime | 创建时间 |

---

## 📚 相关文档

- [HTTP API索引](./service-api-http.md)
- [DTO对象索引](./dto.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
