# Support工具类索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `support` 包下所有工具类的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.support`  
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
support/
└── MessageRuleSupport.java (1个) - 消息规则支持工具
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 异常级别判定 | 1 | 判断异常级别和忽略规则 |

---

## 二、详细清单

### 2.1 MessageRuleSupport - 消息规则支持工具

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.support.MessageRuleSupport`
- **文件大小**: 2.98 KB
- **注解**: `@Data`, `@Accessors`
- **实现接口**: `Serializable`

**字段列表** (3个字段):

| 字段名 | 类型 | 修饰符 | 说明 |
|-------|------|-------|------|
| INSTANCE | MessageRuleSupport | private static | 单例实例 |
| redisTemplate | RedisTemplate&lt;String, Long&gt; | final | Redis模板（用于频率统计） |
| REDIS_KEY | String | private static final | Redis键模板："%s:message-error:%s:times" |

**公共方法** (4个):

| 方法签名 | 返回类型 | 修饰符 | 说明 |
|---------|---------|-------|------|
| `build(RedisTemplate<String, Long> redisTemplate)` | MessageRuleSupport | public static | 构建单例实例 |
| `level(RequestErrorBean bean)` | ErrorLevel | public static | 判断异常错误级别 |
| `ignoreException(RequestErrorBean bean)` | boolean | public static | 判断是否忽略异常 |
| `contains(List<String> list, String value)` | boolean | private static | 判断列表是否包含值 |

**核心方法详解**:

### 2.1.1 build - 构建单例实例

```java
public static MessageRuleSupport build(RedisTemplate<String, Long> redisTemplate) {
    if (Objects.isNull(INSTANCE)) {
        INSTANCE = new MessageRuleSupport(redisTemplate);
    }
    return INSTANCE;
}
```

**说明**:
- 单例模式，确保全局只有一个实例
- 需要传入RedisTemplate用于频率统计
- 通常在RequestErrorConfiguration中调用

---

### 2.1.2 level - 判断异常错误级别

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
    String interfaceName = bean.getInterfaceName() + CharacterConstants.POINT + bean.getMethodName();
    if (contains(config.getImportantInterface(), interfaceName)) {
        return ErrorLevel.IMPORTANT;
    }
    
    // 4. 高频异常（1分钟内超过阈值） -> PRESSING
    String redisKey = String.format(REDIS_KEY, bean.getServiceName(), System.currentTimeMillis() / 1000 * 60 * 1);
    INSTANCE.redisTemplate.opsForList().leftPush(redisKey, BigDecimal.ONE.longValue());
    INSTANCE.redisTemplate.expire(redisKey, BigDecimal.ONE.longValue(), TimeUnit.MINUTES);
    
    long limit = Objects.nonNull(config.getLimit()) ? config.getLimit() : BigDecimal.TEN.longValue();
    if (INSTANCE.redisTemplate.opsForList().size(redisKey) >= limit) {
        return ErrorLevel.PRESSING;
    }
    
    // 5. 其他情况 -> ORDINARY
    return ErrorLevel.ORDINARY;
}
```

**判定逻辑**:

| 优先级 | 判定条件 | 返回级别 | 说明 |
|-------|---------|---------|------|
| 1 | 当前用户在importantUser列表 | IMPORTANT | 重要用户的异常 |
| 2 | 异常类名在importantException列表 | IMPORTANT | 重要异常类型 |
| 3 | 接口名在importantInterface列表 | IMPORTANT | 重要接口的异常 |
| 4 | 1分钟内异常次数>=limit | PRESSING | 高频异常 |
| 5 | 以上都不满足 | ORDINARY | 普通异常 |

**Redis键格式**:
```
{serviceName}:message-error:{timestamp_minute}:times
```
- `serviceName`: 服务名称
- `timestamp_minute`: 时间戳（精确到分钟）
- 示例: `recruit-user-service:message-error:1700827200:times`

**使用示例**:
```java
RequestErrorBean bean = new RequestErrorBean()
    .setServiceName("recruit-user-service")
    .setCurrentName("zhangsan")
    .setExceptionName("NullPointerException")
    .setInterfaceName("UserController.register")
    .setMethodName("POST")
    .setConfig(exceptionNoticeDTO);

ErrorLevel level = MessageRuleSupport.level(bean);

// 在邮件标题中使用
String title = "【" + level.getDescription() + "】【" + bean.getServiceName() + "】服务异常通知";
// 结果: 【重要】【recruit-user-service】服务异常通知
```

---

### 2.1.3 ignoreException - 判断是否忽略异常

```java
public static boolean ignoreException(RequestErrorBean bean) {
    ExceptionNoticeDTO config = bean.getConfig();
    return contains(config.getIgnoreException(), bean.getExceptionName());
}
```

**说明**:
- 判断异常类名是否在ignoreException列表中
- 返回true表示应该忽略该异常，不发送通知
- 用于过滤不需要通知的异常类型

**使用示例**:
```java
// 在OAMessageExceptionAdvice中
private void sendMessage(RequestErrorBean bean) {
    // 如果异常是需要忽略的，则不发送邮件信息
    if (MessageRuleSupport.ignoreException(bean)) {
        return;
    }
    
    // 发送邮件和企业微信通知
    EmailBean emailBean = this.errorEmail(bean);
    sender.send(emailBean.setTo(bean.getConfig().getMembers()));
    // ...
}
```

**配置示例** (ExceptionNoticeDTO):
```json
{
    "ignoreException": [
        "ClientAbortException",
        "BrokenPipeException",
        "SocketTimeoutException"
    ]
}
```

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Redis**: 使用Redis List存储异常计数，支持高频异常判定
- **单例模式**: 确保全局只有一个实例，节省资源
- **Lombok**: 使用@Data和@Accessors简化代码

### 3.2 设计模式
- **单例模式**: 通过静态方法build()创建唯一实例
- **策略模式**: 根据不同条件返回不同的ErrorLevel
- **工具类模式**: 提供静态方法供外部调用

### 3.3 关键特性
1. **多维度判定**: 
   - 用户维度（importantUser）
   - 异常类型维度（importantException）
   - 接口维度（importantInterface）
   - 频率维度（limit）
2. **Redis计数**: 使用Redis List + 过期时间实现滑动窗口计数
3. **灵活配置**: 所有规则都可通过ExceptionNoticeDTO配置
4. **忽略机制**: 支持配置忽略特定异常类型

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：使用静态方法
ErrorLevel level = MessageRuleSupport.level(requestErrorBean);
boolean ignore = MessageRuleSupport.ignoreException(requestErrorBean);

// ❌ 不推荐做法：直接创建实例
MessageRuleSupport support = new MessageRuleSupport(redisTemplate);  // 破坏单例
```

### 4.2 配置建议

```json
// ✅ 推荐：完整配置
{
    "importantUser": ["admin", "zhangsan", "lisi"],
    "importantException": [
        "NullPointerException",
        "OutOfMemoryError",
        "StackOverflowError"
    ],
    "importantInterface": [
        "UserController.register.POST",
        "PaymentController.pay.POST",
        "OrderController.create.POST"
    ],
    "ignoreException": [
        "ClientAbortException",
        "BrokenPipeException"
    ],
    "limit": 10
}

// ❌ 不推荐：配置缺失
{
    "importantUser": []  // 其他字段都缺失
}
```

### 4.3 Redis优化

```java
// ✅ 推荐：使用时间戳精确到分钟
String redisKey = String.format(REDIS_KEY, serviceName, System.currentTimeMillis() / 60000);

// ❌ 不推荐：使用秒级时间戳
String redisKey = String.format(REDIS_KEY, serviceName, System.currentTimeMillis() / 1000);
// 问题：会创建60倍的Redis键，浪费内存
```

### 4.4 频率阈值设置

```json
// ✅ 推荐：根据服务规模设置合理阈值
{
    "limit": 10  // 小服务
}
{
    "limit": 50  // 中等服务
}
{
    "limit": 100  // 大型服务
}

// ❌ 不推荐：阈值过低
{
    "limit": 1  // 太敏感，会有大量紧急通知
}

// ❌ 不推荐：阈值过高
{
    "limit": 1000  // 太宽松，紧急异常难以被发现
}
```

### 4.5 常见问题

**问题1**: PRESSING级别判定不准
- **原因**: Redis键过期时间不一致
- **解决**: 确保每次都设置1分钟过期时间

**问题2**: 重要用户判定失效
- **原因**: 用户名格式不一致（中文名 vs 英文名）
- **解决**: 统一使用StaffUtil.engName转换为英文名

**问题3**: 忽略规则不生效
- **原因**: 异常类名不匹配（简单名 vs 全限定名）
- **解决**: 配置中使用简单类名（如NullPointerException而非java.lang.NullPointerException）

**问题4**: Redis内存占用过高
- **原因**: 高频服务创建大量Redis键
- **解决**: 
  - 确保设置了过期时间
  - 调整时间戳精度（分钟级而非秒级）
  - 定期清理过期键

---

## 📚 相关文档

- [Enums枚举索引](./enums.md) - ErrorLevel错误级别枚举
- [Bean对象索引](./bean.md) - RequestErrorBean详细信息
- [Advice索引](./advice.md) - 在异常通知中使用MessageRuleSupport
- [Configuration索引](./configuration.md) - MessageRuleSupport Bean配置

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有方法和规则 | v1.0 |

---
