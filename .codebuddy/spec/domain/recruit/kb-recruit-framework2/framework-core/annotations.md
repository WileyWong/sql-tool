# 注解类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目 annotations 包下所有注解的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.annotations`  
> **文件总数**: 8个

---

## 📑 目录

- [一、注解概览](#一注解概览)
- [二、详细清单](#二详细清单)
- [三、使用场景](#三使用场景)

---

## 一、注解概览

### 1.1 按功能分类

| 功能类别 | 注解数量 | 注解列表 |
|---------|---------|---------|
| **数据处理** | 3 | AutoTrim, Desensitization, DoubleFormat |
| **缓存控制** | 1 | RecruitCache |
| **安全防护** | 2 | XssIgnore, RecruitRepeat |
| **分布式锁** | 1 | LockDistributed |
| **日志控制** | 1 | LogParamIgnore |

---

## 二、详细清单

### 2.1 @AutoTrim

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.AutoTrim`
- **作用范围**: TYPE, PARAMETER
- **生命周期**: RUNTIME

**功能说明**: 自动裁剪字符串前后空格

**属性列表**: 无

**内部注解**:
- `@AutoTrim.Ignore`: 忽略自动裁剪

**使用示例**:
```java
@AutoTrim
public class UserDTO {
    private String name;  // 会自动裁剪
    
    @AutoTrim.Ignore
    private String password;  // 不裁剪
}
```

---

### 2.2 @Desensitization

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.Desensitization`
- **作用范围**: FIELD
- **生命周期**: RUNTIME
- **Jackson集成**: @JsonSerialize(using = DesensitizationSerializer.class)

**功能说明**: 数据脱敏注解，支持多种脱敏类型

**属性列表**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| value | DesensitizationType | 必填 | 脱敏类型 |

**内部注解**:
- `@Desensitization.custom`: 自定义脱敏规则
  - `int left()`: 左侧保留字符数
  - `int right()`: 右侧保留字符数

**使用示例**:
```java
public class UserInfo {
    @Desensitization(DesensitizationType.PHONE)
    private String phone;  // 138****5678
    
    @Desensitization.custom(left = 2, right = 2)
    private String idCard;  // 12**************34
}
```

---

### 2.3 @DoubleFormat

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.DoubleFormat`
- **作用范围**: FIELD
- **生命周期**: RUNTIME
- **Jackson集成**: @JsonSerialize(using = DoubleFormatSerializer.class)

**功能说明**: Double类型格式化注解

**属性列表**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| value | String | "0.00" | 格式化模式 |

**使用示例**:
```java
public class Salary {
    @DoubleFormat("0.00")
    private Double amount;  // 格式化为: 12345.67
    
    @DoubleFormat("0.000")
    private Double rate;  // 格式化为: 0.123
}
```

---

### 2.4 @LockDistributed

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.LockDistributed`
- **作用范围**: METHOD
- **生命周期**: RUNTIME

**功能说明**: 分布式锁注解，基于Redis实现

**属性列表**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| value | String | "defaultRedisLockRegistry" | 锁的名称 |
| timeout | int | 30 | 超时时间(秒) |
| key | String | "LockDistributed:#{className}:#{methodName}" | 锁的关键字前缀 |

**常量定义**:
- `DEFAULT_NAME = "defaultRedisLockRegistry"`

**使用示例**:
```java
@Service
public class OrderService {
    
    @LockDistributed(
        value = "orderLock",
        timeout = 60,
        key = "order:#{#orderId}"
    )
    public void createOrder(Long orderId) {
        // 分布式锁保护的业务逻辑
    }
}
```

---

### 2.5 @LogParamIgnore

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.LogParamIgnore`
- **作用范围**: METHOD, FIELD, CONSTRUCTOR, PARAMETER, TYPE_USE
- **生命周期**: RUNTIME

**功能说明**: 标记需要在日志中忽略的参数或字段

**属性列表**: 无

**使用示例**:
```java
public class User {
    private String username;
    
    @LogParamIgnore
    private String password;  // 日志中不记录
}

@RestController
public class UserController {
    
    public Result login(
        @RequestParam String username,
        @LogParamIgnore @RequestParam String password) {
        // password不会记录到日志
    }
}
```

---

### 2.6 @RecruitCache

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.RecruitCache`
- **作用范围**: METHOD
- **生命周期**: RUNTIME

**功能说明**: 招聘系统缓存注解，支持多级缓存和灵活的缓存策略

**属性列表**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| condition | String | "true" | 操作限制，EL表达式 |
| action | RecruitCacheAction | Cache | 缓存操作类型 |
| level | RecruitCacheLevel | Redis | 缓存级别(Local/Redis) |
| refresh | boolean | true | 是否刷新缓存 |
| expire | long | 3600L | 过期时间(秒) |
| value | String | "#{serviceName}:RecruitCache:#{className}:#{methodName}" | 缓存Key前缀 |

**使用示例**:
```java
@Service
public class UserService {
    
    @RecruitCache(
        condition = "#userId > 0",
        action = RecruitCacheAction.Cache,
        level = RecruitCacheLevel.Redis,
        expire = 1800L
    )
    public User getUserById(Long userId) {
        // 从数据库查询
    }
    
    @RecruitCache(
        action = RecruitCacheAction.Evict
    )
    public void updateUser(User user) {
        // 更新时清除缓存
    }
}
```

---

### 2.7 @RecruitRepeat

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.RecruitRepeat`
- **作用范围**: METHOD
- **生命周期**: RUNTIME

**功能说明**: 防重复提交注解，基于Redis实现

**属性列表**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| refresh | boolean | false | 是否刷新 |
| expire | long | 10L | 过期时间(秒) |
| value | String | "#{serviceName}:LockDistributed:checkRepeat:#{className}:#{methodName}" | 缓存Key前缀 |

**使用示例**:
```java
@RestController
public class OrderController {
    
    @PostMapping("/order/create")
    @RecruitRepeat(expire = 5L)
    public Result createOrder(@RequestBody OrderDTO order) {
        // 5秒内不允许重复提交
    }
}
```

---

### 2.8 @XssIgnore

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.annotations.XssIgnore`
- **作用范围**: FIELD
- **生命周期**: RUNTIME
- **Jackson集成**: @JsonSerialize(using = XssIgnoreFilterSerializer.class)

**功能说明**: 标志忽略XSS注入攻击过滤的注解

**属性列表**: 无

**使用示例**:
```java
public class ArticleDTO {
    private String title;  // 会进行XSS过滤
    
    @XssIgnore
    private String content;  // HTML内容，不进行XSS过滤
}
```

---

## 三、使用场景

### 3.1 数据安全场景

```java
public class UserProfileDTO {
    @Desensitization(DesensitizationType.PHONE)
    private String phone;
    
    @Desensitization(DesensitizationType.ID_CARD)
    private String idCard;
    
    @LogParamIgnore
    private String password;
}
```

### 3.2 缓存控制场景

```java
@Service
public class ResumeService {
    
    @RecruitCache(
        level = RecruitCacheLevel.Redis,
        expire = 7200L
    )
    public Resume getResumeById(Long id) {
        // 查询简历
    }
    
    @RecruitCache(action = RecruitCacheAction.Evict)
    public void updateResume(Resume resume) {
        // 更新简历并清除缓存
    }
}
```

### 3.3 防重复提交场景

```java
@RestController
public class ResumeController {
    
    @PostMapping("/resume/submit")
    @RecruitRepeat(expire = 60L)
    public Result submitResume(@RequestBody ResumeDTO dto) {
        // 60秒内防止重复提交
    }
}
```

### 3.4 分布式锁场景

```java
@Service
public class PositionService {
    
    @LockDistributed(
        value = "positionLock",
        timeout = 30,
        key = "position:#{#positionId}"
    )
    public void publishPosition(Long positionId) {
        // 发布职位时加锁
    }
}
```

---

## 📊 统计概览

| 分类 | 数量 | 注解列表 |
|------|------|---------|
| 数据处理 | 3 | AutoTrim, Desensitization, DoubleFormat |
| 缓存控制 | 1 | RecruitCache |
| 安全防护 | 2 | XssIgnore, RecruitRepeat |
| 分布式锁 | 1 | LockDistributed |
| 日志控制 | 1 | LogParamIgnore |
| **总计** | **8个** | - |

---
