# 枚举类索引

> **覆盖范围**: `{{BASE_PACKAGE}}` 下所有 `enum` 定义  
> **文件总数**: {{ENUM_COUNT}}个  
> **代码总行数**: {{ENUM_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
enums/
├── OrderStatus - 订单状态
├── UserStatus - 用户状态
├── PaymentType - 支付类型
└── ...
```

### 按功能分类
| 功能模块 | 枚举数量 | 用途 |
|---------|---------|------|
| 订单管理 | 2 | 状态、类型 |
| 用户管理 | 1 | 状态 |
| 支付管理 | 1 | 类型 |

---

## 二、详细清单

### OrderStatus - 订单状态

**类路径**: `com.company.project.enums.OrderStatus`  
**代码行数**: 32 行（SLOC）

#### 枚举值列表
| 枚举值 | code | description | 说明 |
|--------|------|-------------|------|
| PENDING | 0 | 待支付 | 订单创建后的初始状态 |
| PAID | 1 | 已支付 | 支付成功 |
| SHIPPED | 2 | 已发货 | 商家已发货 |
| COMPLETED | 3 | 已完成 | 用户确认收货 |
| CANCELLED | 4 | 已取消 | 订单取消 |

#### 自定义字段
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 状态码 |
| description | String | 状态描述 |

#### 自定义方法
| 方法签名 | 参数 | 返回值 | 功能 |
|---------|------|--------|------|
| getByCode(Integer code) | code | OrderStatus | 根据状态码获取枚举值 |

---

### UserStatus - 用户状态

**类路径**: `com.company.project.enums.UserStatus`  
**代码行数**: 24 行（SLOC）

#### 枚举值列表
| 枚举值 | code | description | 说明 |
|--------|------|-------------|------|
| ACTIVE | 1 | 正常 | 正常状态 |
| DISABLED | 0 | 禁用 | 账号被禁用 |
| PENDING | 2 | 待激活 | 等待邮箱验证 |

---

## 📚 相关文档

- [Entity对象索引](./entity.md)
- [业务逻辑层索引](./business-logic.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
