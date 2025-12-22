# 常量类索引

> **覆盖范围**: `{{BASE_PACKAGE}}` 下所有 `*Constants.java` 或全静态final字段类  
> **文件总数**: {{CONSTANTS_COUNT}}个  
> **代码总行数**: {{CONSTANTS_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
constants/
├── CommonConstants - 通用常量
├── ErrorCodeConstants - 错误码常量
├── CacheConstants - 缓存常量
└── ...
```

### 按功能分类
| 功能 | 常量类数量 | 用途 |
|------|-----------|------|
| 通用配置 | 1 | 分页、超时等 |
| 错误码 | 1 | 业务错误码 |
| 缓存键 | 1 | Redis缓存键前缀 |

---

## 二、详细清单

### CommonConstants - 通用常量

**类路径**: `com.company.project.constants.CommonConstants`  
**代码行数**: 42 行（SLOC）

#### 系统配置常量
| 常量名 | 类型 | 值 | 说明 |
|--------|------|-----|------|
| `DEFAULT_PAGE_SIZE` | int | `10` | 默认分页大小 |
| `MAX_PAGE_SIZE` | int | `100` | 最大分页大小 |
| `TOKEN_EXPIRE_SECONDS` | long | `7200` | Token 过期时间（秒） |

#### 缓存键前缀常量
| 常量名 | 类型 | 值 | 说明 |
|--------|------|-----|------|
| `CACHE_USER_PREFIX` | String | `"user:"` | 用户缓存键前缀 |
| `CACHE_ORDER_PREFIX` | String | `"order:"` | 订单缓存键前缀 |

#### 状态常量
| 常量名 | 类型 | 值 | 说明 |
|--------|------|-----|------|
| `STATUS_ENABLED` | int | `1` | 启用状态 |
| `STATUS_DISABLED` | int | `0` | 禁用状态 |

---

### ErrorCodeConstants - 错误码常量

**类路径**: `com.company.project.constants.ErrorCodeConstants`  
**代码行数**: 58 行（SLOC）

#### 系统错误码（1xxxx）
| 常量名 | 错误码 | 错误消息 | 使用场景 |
|--------|--------|----------|----------|
| `SYSTEM_ERROR` | 10001 | 系统错误 | 未知异常 |
| `PARAM_ERROR` | 10002 | 参数错误 | 参数校验失败 |

#### 用户错误码（2xxxx）
| 常量名 | 错误码 | 错误消息 | 使用场景 |
|--------|--------|----------|----------|
| `USER_NOT_FOUND` | 20001 | 用户不存在 | 查询用户失败 |
| `USER_DISABLED` | 20002 | 用户已禁用 | 登录被禁用账号 |
| `PASSWORD_ERROR` | 20003 | 密码错误 | 登录密码错误 |

#### 订单错误码（3xxxx）
| 常量名 | 错误码 | 错误消息 | 使用场景 |
|--------|--------|----------|----------|
| `ORDER_NOT_FOUND` | 30001 | 订单不存在 | 查询订单失败 |
| `STOCK_NOT_ENOUGH` | 30002 | 库存不足 | 下单库存不足 |

---

## 📚 相关文档

- [异常类索引](./exception.md)
- [Common公共类索引](./common.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
