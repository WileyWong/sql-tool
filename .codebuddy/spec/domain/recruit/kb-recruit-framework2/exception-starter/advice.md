# 异常通知处理类索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `advice` 包下所有异常通知处理类的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.advice`  
> **文件总数**: 2个

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
advice/
├── CloudMessageExceptionAdvice.java (1个) - 云环境异常通知处理
└── OAMessageExceptionAdvice.java (1个) - OA环境异常通知处理
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 云环境异常处理 | 1 | 云环境下的异常邮件通知 |
| OA环境异常处理 | 1 | OA环境下的异常邮件和企业微信通知 |

---

## 二、详细清单

### 2.1 CloudMessageExceptionAdvice - 云环境异常通知处理

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.advice.CloudMessageExceptionAdvice`
- **文件大小**: 8.53 KB
- **继承关系**: `extends BasicExceptionAdvice`
- **注解**: `@Slf4j`, `@RequiredArgsConstructor`

**字段列表** (6个字段):

| 字段名 | 类型 | 修饰符 | 说明 |
|-------|------|-------|------|
| redisRecruitCache | RedisRecruitCache&lt;ExceptionNoticeDTO&gt; | @Lazy @Autowired | Redis缓存 |
| sender | SyncEmailSender | @Lazy @Autowired | 同步邮件发送器 |
| serviceName | String | @Value | 服务名称 |
| currentHeaderName | String | final | 当前用户Header名称 |
| systemFeign | RecruitTenantSystemFeign | @Autowired | 系统配置Feign接口 |

**公共方法** (9个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `advice(Exception exception)` | void | 重写父类方法，处理异常通知逻辑 |
| `advice(RequestErrorBean bean)` | void | 异步处理异常通知Bean（@Async注解） |
| `getHandlerMethod(ServletRequestAttributes attributes)` | HandlerMethod | 获取请求处理器方法（private） |
| `sendMessage(RequestErrorBean bean)` | void | 发送邮件消息（private） |
| `create(Exception exception, HttpServletRequest request, HandlerMethod method)` | RequestErrorBean | 创建请求错误Bean（带请求信息，private） |
| `create(Exception exception)` | RequestErrorBean | 创建请求错误Bean（简单版本，private） |
| `getExceptionNoticeConfig()` | ExceptionNoticeDTO | 获取异常通知配置（private） |
| `errorEmail(RequestErrorBean bean)` | EmailBean | 构建异常通知邮件内容（public） |
| `buildHeader(StringBuffer buffer, Map<String, String> headers)` | void | 构建Header信息（private） |
| `buildParams(StringBuffer buffer, Map<String, String[]> params)` | void | 构建参数信息（private） |

**核心逻辑**:
```java
@Override
public void advice(Exception exception) {
    super.advice(exception);
    if (!checkNotice(exception)) return;
    // 异步处理异常通知
    CloudMessageExceptionAdvice advice = (CloudMessageExceptionAdvice) 
        SpringUtil.getBean("messageExceptionAdvice");
    ServletRequestAttributes attributes = (ServletRequestAttributes) 
        RequestContextHolder.getRequestAttributes();
    if (Objects.nonNull(attributes) && Objects.nonNull(attributes.getRequest())) {
        advice.advice(create(exception, attributes.getRequest(), getHandlerMethod(attributes)));
    } else {
        advice.advice(create(exception));
    }
}
```

**应用场景**:
- 云环境（etest、euat、eprod）异常统一处理
- 异常信息通过邮件通知相关人员
- 支持异常配置的Redis缓存

---

### 2.2 OAMessageExceptionAdvice - OA环境异常通知处理

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.advice.OAMessageExceptionAdvice`
- **文件大小**: 12.18 KB
- **继承关系**: `extends BasicExceptionAdvice`
- **注解**: `@Slf4j`, `@RequiredArgsConstructor`

**字段列表** (7个字段):

| 字段名 | 类型 | 修饰符 | 说明 |
|-------|------|-------|------|
| redisRecruitCache | RedisRecruitCache&lt;ExceptionNoticeDTO&gt; | @Lazy @Autowired | Redis缓存 |
| feign | RecruitCenterFeign | @Lazy @Autowired | 异常通知配置Feign接口 |
| sender | SyncEmailSender | @Lazy @Autowired | 同步邮件发送器 |
| appSender | SyncAppSender | @Lazy @Autowired | 企业微信机器人发送器 |
| serviceName | String | @Value | 服务名称 |
| profile | String | @Value | 运行环境 |
| currentHeaderName | String | final | 当前用户Header名称 |

**公共方法** (11个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `advice(Exception exception)` | void | 重写父类方法，处理异常通知逻辑 |
| `advice(RequestErrorBean bean)` | void | 异步处理异常通知Bean（@Async注解） |
| `getHandlerMethod(ServletRequestAttributes attributes)` | HandlerMethod | 获取请求处理器方法（private） |
| `sendMessage(RequestErrorBean bean)` | void | 发送邮件和企业微信消息（private） |
| `create(Exception exception, HttpServletRequest request, HandlerMethod method)` | RequestErrorBean | 创建请求错误Bean（带请求信息，private） |
| `create(Exception exception)` | RequestErrorBean | 创建请求错误Bean（简单版本，private） |
| `getExceptionNoticeConfig()` | ExceptionNoticeDTO | 获取异常通知配置（private） |
| `errorEmail(RequestErrorBean bean)` | EmailBean | 构建异常通知邮件内容（public） |
| `wxBotError(RequestErrorBean bean)` | String | 构建企业微信机器人消息内容（public） |
| `buildHeader(StringBuffer buffer, Map<String, String> headers)` | void | 构建Header信息（private） |
| `buildParams(StringBuffer buffer, Map<String, String[]> params)` | void | 构建参数信息（private） |

**核心逻辑**:
```java
@Async("requestErrorExecutor")
public void advice(RequestErrorBean bean) {
    try {
        ExceptionNoticeDTO config = getExceptionNoticeConfig();
        // dev和edev环境不发送通知
        if (Objects.isNull(config)
                || CollectionUtils.isEmpty(config.getMembers())
                || StringUtils.equalsIgnoreCase(profile, "dev")
                || StringUtils.equalsIgnoreCase(profile, "edev")) return;
        sendMessage(bean.setConfig(config));
    } catch (Exception error) {
        log.info("发送错误日志失败:{}", ExceptionUtils.getFullStackTrace(error));
    }
}
```

**特殊功能**:
1. **支持IExceptionHandler接口**: 特殊异常可自定义通知消息
2. **支持JobTask异常**: 特殊处理RecruitJobTaskRuntimeException
3. **双通道通知**: 同时支持邮件和企业微信机器人通知
4. **环境过滤**: dev和edev环境不发送通知

**应用场景**:
- OA环境（test、dev、uat、prod）异常统一处理
- 异常信息通过邮件和企业微信双通道通知
- 支持忽略特定异常类型
- 支持JobTask特殊异常处理

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Spring框架**: 使用@Autowired依赖注入、@Async异步处理
- **Redis缓存**: 使用RedisRecruitCache缓存异常配置
- **Feign远程调用**: 获取系统配置信息
- **Lombok**: 使用@Slf4j、@RequiredArgsConstructor简化代码

### 3.2 设计模式
- **模板方法模式**: 继承BasicExceptionAdvice，重写advice方法
- **策略模式**: 通过Profile区分云环境和OA环境的不同策略
- **异步处理**: 使用@Async避免异常通知阻塞主流程

### 3.3 关键特性
1. **异步通知**: 异常通知采用异步线程池处理，不影响业务响应
2. **配置缓存**: 通过Redis缓存异常通知配置，减少远程调用
3. **智能过滤**: 
   - 检查异常是否需要通知（checkNotice方法）
   - 忽略特定异常类型（ignoreException方法）
   - 开发环境不发送通知
4. **丰富信息**: 收集请求URL、参数、Header、链路追踪ID等完整信息

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：继承BasicExceptionAdvice实现自定义异常处理
@Slf4j
@RequiredArgsConstructor
public class CustomExceptionAdvice extends BasicExceptionAdvice {
    @Override
    public void advice(Exception exception) {
        super.advice(exception);
        // 自定义逻辑
    }
}

// ❌ 不推荐做法：直接实现IExceptionAdvice
public class CustomExceptionAdvice implements IExceptionAdvice {
    // 缺少基础功能
}
```

### 4.2 配置建议

```java
// ✅ 推荐：通过Profile区分不同环境
@Profile({"test","dev","uat","prod"})
@Bean("messageExceptionAdvice")
public IExceptionAdvice oaMessageExceptionAdvice() {
    return new OAMessageExceptionAdvice(OAHttpHeader.STAFF_NAME);
}

// ✅ 推荐：使用异步线程池处理通知
@Async("requestErrorExecutor")
public void advice(RequestErrorBean bean) {
    // 异步处理，不阻塞主流程
}
```

### 4.3 常见问题

**问题1**: 异常通知发送失败
- **原因**: Redis配置缺失或Feign调用失败
- **解决**: 检查Redis连接和Feign服务可用性

**问题2**: 收到大量重复通知
- **原因**: 没有配置忽略异常列表
- **解决**: 在ExceptionNoticeDTO中配置ignoreException列表

**问题3**: 开发环境收到通知
- **原因**: Profile配置错误
- **解决**: 确保dev和edev环境Profile配置正确

---

## 📚 相关文档

- [Bean对象索引](./bean.md) - RequestErrorBean详细信息
- [Configuration索引](./configuration.md) - RequestErrorConfiguration配置类
- [Feign接口索引](./feign.md) - RecruitTenantSystemFeign接口
- [Support工具索引](./support.md) - MessageRuleSupport工具类
- [Enums枚举索引](./enums.md) - ErrorLevel错误级别枚举

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有字段和方法 | v1.0 |

---
