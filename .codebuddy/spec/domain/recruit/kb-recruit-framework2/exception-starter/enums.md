# Enums枚举类索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `enums` 包下所有枚举类的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.enums`  
> **文件总数**: 1个

---

## 📑 目录

- [一、架构概览](#一架构概览)
- [二、详细清单](#二详细清单)
- [三、技术架构说明](#三技术架构说明)
- [四、最佳实践建议](#四最佳实践建议)

---

## 一、架构概览

### 1.1 目录结构

```
enums/
└── ErrorLevel.java (1个) - 错误级别枚举
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 错误级别分类 | 1 | 定义异常的严重程度级别 |

---

## 二、详细清单

### 2.1 ErrorLevel - 错误级别枚举

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.enums.ErrorLevel`
- **文件大小**: 293 B
- **注解**: `@RequiredArgsConstructor`

**字段列表** (1个字段):

| 字段名 | 类型 | 修饰符 | 说明 |
|-------|------|-------|------|
| description | String | @Getter final | 错误级别描述 |

**枚举值列表** (3个):

| 枚举值 | 描述 | 说明 |
|-------|------|------|
| IMPORTANT | "重要" | 重要级别异常，需要立即关注 |
| PRESSING | "紧急" | 紧急级别异常，高频异常 |
| ORDINARY | "一般" | 普通级别异常，常规异常 |

**公共方法**:
- `getDescription()`: String - 获取错误级别描述（@Getter生成）

**使用示例**:
```java
// 获取错误级别
ErrorLevel level = ErrorLevel.IMPORTANT;
String desc = level.getDescription();  // "重要"

// 在MessageRuleSupport中使用
ErrorLevel level = MessageRuleSupport.level(requestErrorBean);
switch (level) {
    case IMPORTANT:
        // 重要异常处理逻辑
        break;
    case PRESSING:
        // 紧急异常处理逻辑
        break;
    case ORDINARY:
        // 普通异常处理逻辑
        break;
}
```

**级别判定规则** (在MessageRuleSupport中):

```java
public static ErrorLevel level(RequestErrorBean bean) {
    ExceptionNoticeDTO config = bean.getConfig();
    
    // 1. 重要用户的异常 -> IMPORTANT
    if (contains(config.getImportantUser(), StaffUtil.engName(bean.getCurrentName()))) {
        return ErrorLevel.IMPORTANT;
    }
    
    // 2. 重要异常类型 -> IMPORTANT
    if (contains(config.getImportantException(), bean.getExceptionName())) {
        return ErrorLevel.IMPORTANT;
    }
    
    // 3. 重要接口的异常 -> IMPORTANT
    String interfaceName = bean.getInterfaceName() + "." + bean.getMethodName();
    if (contains(config.getImportantInterface(), interfaceName)) {
        return ErrorLevel.IMPORTANT;
    }
    
    // 4. 高频异常（1分钟内超过阈值） -> PRESSING
    String redisKey = String.format(REDIS_KEY, bean.getServiceName(), System.currentTimeMillis() / 60000);
    INSTANCE.redisTemplate.opsForList().leftPush(redisKey, 1L);
    INSTANCE.redisTemplate.expire(redisKey, 1L, TimeUnit.MINUTES);
    long limit = Objects.nonNull(config.getLimit()) ? config.getLimit() : 10L;
    if (INSTANCE.redisTemplate.opsForList().size(redisKey) >= limit) {
        return ErrorLevel.PRESSING;
    }
    
    // 5. 其他情况 -> ORDINARY
    return ErrorLevel.ORDINARY;
}
```

**应用场景**:
1. **异常邮件标题**: 在邮件标题中标注错误级别 `【重要】【服务名】服务异常通知`
2. **通知优先级**: 根据错误级别决定通知方式（邮件、短信、电话等）
3. **异常统计**: 按错误级别统计异常数量和趋势
4. **告警策略**: 重要和紧急异常触发更高级别的告警

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Java枚举**: 使用enum定义固定的错误级别
- **Lombok**: 使用@RequiredArgsConstructor和@Getter简化代码

### 3.2 设计模式
- **枚举单例**: 枚举天然是单例的，线程安全
- **策略模式**: 不同级别对应不同的处理策略

### 3.3 关键特性
1. **类型安全**: 编译期保证错误级别的正确性
2. **不可变**: 枚举值和描述都是final的
3. **易扩展**: 可以方便地添加新的错误级别

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：使用枚举而非字符串
ErrorLevel level = ErrorLevel.IMPORTANT;
if (level == ErrorLevel.IMPORTANT) {
    // 处理逻辑
}

// ❌ 不推荐做法：使用字符串魔法值
String level = "重要";  // 容易拼写错误，不安全
if ("重要".equals(level)) {
    // 处理逻辑
}
```

### 4.2 扩展建议

```java
// ✅ 推荐：如需扩展，添加新的枚举值
public enum ErrorLevel {
    CRITICAL("致命"),    // 新增致命级别
    IMPORTANT("重要"),
    PRESSING("紧急"),
    ORDINARY("一般");
    
    @Getter
    private final String description;
}

// ✅ 推荐：添加更多属性
public enum ErrorLevel {
    IMPORTANT("重要", 1),
    PRESSING("紧急", 2),
    ORDINARY("一般", 3);
    
    @Getter
    private final String description;
    
    @Getter
    private final int priority;  // 优先级
}
```

### 4.3 配置建议

```java
// ExceptionNoticeDTO配置示例
{
    "importantUser": ["admin", "zhangsan"],  // 重要用户列表
    "importantException": [                   // 重要异常类型
        "NullPointerException",
        "OutOfMemoryError"
    ],
    "importantInterface": [                   // 重要接口
        "UserController.register",
        "PaymentController.pay"
    ],
    "limit": 10                              // 紧急阈值（1分钟内次数）
}
```

### 4.4 常见问题

**问题1**: 如何判断异常级别？
- **方法**: 使用MessageRuleSupport.level(requestErrorBean)
- **规则**: 重要用户/异常/接口 > 高频异常 > 普通异常

**问题2**: 如何配置重要异常？
- **配置**: 在ExceptionNoticeDTO中配置importantUser、importantException、importantInterface
- **存储**: 通过系统配置接口存储，Redis缓存加速

**问题3**: PRESSING级别如何触发？
- **触发条件**: 1分钟内异常次数超过limit（默认10次）
- **计数方式**: 使用Redis List记录，过期时间1分钟

**问题4**: 如何自定义级别判定逻辑？
- **方法**: 扩展MessageRuleSupport类，重写level方法
- **注意**: 需要在Configuration中注册自定义的MessageRuleSupport Bean

---

## 📚 相关文档

- [Support工具索引](./support.md) - MessageRuleSupport使用ErrorLevel的详细逻辑
- [Advice索引](./advice.md) - 异常通知中使用ErrorLevel
- [Bean对象索引](./bean.md) - RequestErrorBean配合使用

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有枚举值和使用规则 | v1.0 |

---
