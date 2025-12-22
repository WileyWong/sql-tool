# 异常类索引

> **覆盖范围**: `{{BASE_PACKAGE}}` 下所有 `extends Exception/RuntimeException` 类  
> **文件总数**: {{EXCEPTION_COUNT}}个  
> **代码总行数**: {{EXCEPTION_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
exception/
├── BusinessException - 业务异常
├── AuthException - 认证异常
├── ValidationException - 参数校验异常
└── ...
```

### 异常继承关系
```
RuntimeException
  └── BaseException
        ├── BusinessException
        ├── AuthException
        └── ValidationException
```

### 按类型分类
| 异常类型 | 数量 | 用途 |
|---------|------|------|
| 业务异常 | 1 | 业务逻辑错误 |
| 认证异常 | 1 | 登录/权限错误 |
| 校验异常 | 1 | 参数校验失败 |

---

## 二、详细清单

### BusinessException - 业务异常

**类路径**: `com.company.project.exception.BusinessException`  
**代码行数**: 45 行（SLOC）  
**继承**: `RuntimeException`

#### 自定义字段
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 业务错误码 |
| data | Object | 附加数据 |

#### 构造方法
| 构造方法 | 说明 |
|----------|------|
| BusinessException(String message) | 仅消息 |
| BusinessException(Integer code, String message) | 错误码+消息 |
| BusinessException(Integer code, String message, Object data) | 完整构造 |

**使用场景**: 用户名重复、库存不足、订单状态错误等

---

### AuthException - 认证异常

**类路径**: `com.company.project.exception.AuthException`  
**代码行数**: 32 行（SLOC）  
**继承**: `RuntimeException`

#### 自定义字段
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 认证错误码 |

#### 构造方法
| 构造方法 | 说明 |
|----------|------|
| AuthException(String message) | 仅消息 |
| AuthException(Integer code, String message) | 错误码+消息 |

**使用场景**: Token过期、权限不足、用户未登录等

---

## 📚 相关文档

- [Handler处理器索引](./handler.md)
- [Common公共类索引](./common.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
