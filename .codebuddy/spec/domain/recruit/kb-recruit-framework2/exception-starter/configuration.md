# Configuration配置类索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `configuration` 包下所有配置类的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.configuration`  
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
configuration/
└── RequestErrorConfiguration.java (1个) - 请求错误处理配置类
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 异常处理配置 | 1 | 配置异常通知Advice和线程池 |

---

## 二、详细清单

### 2.1 RequestErrorConfiguration - 请求错误处理配置类

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.configuration.RequestErrorConfiguration`
- **文件大小**: 3.29 KB
- **注解**: `@Configuration`, `@Import(GlobalAdviceController.class)`, `@ConditionalOnBean(name = "recruitRedisTemplate")`, `@EnableFeignClients`

**字段列表**: 无字段

**公共方法** (4个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `oaMessageExceptionAdvice()` | IExceptionAdvice | 创建OA环境异常通知Advice（Profile: test/dev/uat/prod） |
| `cloudMessageExceptionAdvice()` | IExceptionAdvice | 创建云环境异常通知Advice（Profile: etest/euat/eprod） |
| `requestErrorExecutor()` | TaskExecutor | 创建异常处理专用线程池 |
| `messageRuleSupport(@Autowired @Qualifier("recruitRedisTemplate") RedisTemplate<String, Long> redis)` | MessageRuleSupport | 创建消息规则支持工具 |

**Bean定义详情**:

#### 3.1 oaMessageExceptionAdvice Bean

```java
@Primary
@Bean("messageExceptionAdvice")
@Profile({"test","dev","uat","prod"})
@ConditionalOnMissingBean(name = "messageExceptionAdvice")
public IExceptionAdvice oaMessageExceptionAdvice() {
    return new OAMessageExceptionAdvice(OAHttpHeader.STAFF_NAME);
}
```

**配置说明**:
- **Profile**: test、dev、uat、prod环境生效
- **Bean名称**: messageExceptionAdvice
- **注解**: @Primary（优先使用），@ConditionalOnMissingBean（不存在时创建）
- **参数**: OAHttpHeader.STAFF_NAME作为当前用户Header名称

---

#### 3.2 cloudMessageExceptionAdvice Bean

```java
@Primary
@Profile({"etest","euat","eprod"})
@Bean("messageExceptionAdvice")
@ConditionalOnMissingBean(name = "messageExceptionAdvice")
public IExceptionAdvice cloudMessageExceptionAdvice() {
    return new CloudMessageExceptionAdvice(TasHttpHeader.CAAGW_USERNAME);
}
```

**配置说明**:
- **Profile**: etest、euat、eprod环境生效
- **Bean名称**: messageExceptionAdvice
- **注解**: @Primary（优先使用），@ConditionalOnMissingBean（不存在时创建）
- **参数**: TasHttpHeader.CAAGW_USERNAME作为当前用户Header名称

---

#### 3.3 requestErrorExecutor Bean

```java
@Bean("requestErrorExecutor")
@ConditionalOnBean(name = "messageExceptionAdvice")
public TaskExecutor requestErrorExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(4);
    executor.setQueueCapacity(1000);
    executor.setKeepAliveSeconds(60);
    executor.setThreadNamePrefix("request-error-Executor-");
    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(60);
    executor.initialize();
    return executor;
}
```

**线程池配置说明**:

| 配置项 | 值 | 说明 |
|-------|-----|------|
| corePoolSize | 2 | 核心线程数 |
| maxPoolSize | 4 | 最大线程数 |
| queueCapacity | 1000 | 队列容量（较大，避免任务丢失） |
| keepAliveSeconds | 60 | 空闲线程存活时间（秒） |
| threadNamePrefix | request-error-Executor- | 线程名称前缀 |
| rejectedExecutionHandler | CallerRunsPolicy | 拒绝策略：调用者线程执行 |
| waitForTasksToCompleteOnShutdown | true | 关闭时等待任务完成 |
| awaitTerminationSeconds | 60 | 等待终止时间（秒） |

**拒绝策略说明**:
- **CallerRunsPolicy**: 队列满时，不丢弃任务，而是由调用者所在线程执行
- **优点**: 保证任务不丢失，提供背压机制
- **缺点**: 可能阻塞调用线程

---

#### 3.4 messageRuleSupport Bean

```java
@Bean
@ConditionalOnBean(name = {"messageExceptionAdvice"})
public MessageRuleSupport messageRuleSupport(
    @Autowired @Qualifier("recruitRedisTemplate") RedisTemplate<String, Long> redis) {
    return MessageRuleSupport.build(redis);
}
```

**配置说明**:
- **依赖**: 依赖messageExceptionAdvice Bean
- **参数**: 注入recruitRedisTemplate用于频率统计
- **用途**: 提供异常级别判断和忽略规则

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Spring Boot自动配置**: 使用@Configuration和条件注解
- **Profile环境隔离**: 通过@Profile区分OA和云环境
- **线程池管理**: 使用ThreadPoolTaskExecutor异步处理
- **Feign集成**: @EnableFeignClients启用Feign客户端

### 3.2 设计模式
- **工厂模式**: 通过@Bean工厂方法创建对象
- **策略模式**: 根据Profile选择不同的ExceptionAdvice实现
- **条件装配**: 使用@ConditionalOnBean和@ConditionalOnMissingBean

### 3.3 关键特性
1. **环境隔离**: 
   - OA环境（test/dev/uat/prod）使用OAMessageExceptionAdvice
   - 云环境（etest/euat/eprod）使用CloudMessageExceptionAdvice
2. **条件装配**: 
   - 依赖recruitRedisTemplate Bean
   - 允许自定义覆盖messageExceptionAdvice
3. **异步处理**: 专用线程池处理异常通知，避免阻塞主流程
4. **导入Controller**: 自动导入GlobalAdviceController全局异常处理器

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：使用Profile区分环境
@Profile({"test","dev","uat","prod"})
@Bean("messageExceptionAdvice")
public IExceptionAdvice oaMessageExceptionAdvice() {
    return new OAMessageExceptionAdvice(OAHttpHeader.STAFF_NAME);
}

// ❌ 不推荐做法：硬编码环境判断
@Bean("messageExceptionAdvice")
public IExceptionAdvice exceptionAdvice() {
    if (isOAEnvironment()) {
        return new OAMessageExceptionAdvice(OAHttpHeader.STAFF_NAME);
    } else {
        return new CloudMessageExceptionAdvice(TasHttpHeader.CAAGW_USERNAME);
    }
}
```

### 4.2 线程池配置建议

```java
// ✅ 推荐：较大的队列容量 + CallerRunsPolicy
executor.setQueueCapacity(1000);  // 避免任务丢失
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

// ❌ 不推荐：小队列 + AbortPolicy
executor.setQueueCapacity(10);  // 容易队列满
executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());  // 抛异常
```

### 4.3 Bean覆盖建议

```java
// ✅ 推荐：自定义实现时使用相同Bean名称
@Primary
@Bean("messageExceptionAdvice")
public IExceptionAdvice customExceptionAdvice() {
    return new CustomExceptionAdvice();
}

// ✅ @ConditionalOnMissingBean确保不会重复创建
@ConditionalOnMissingBean(name = "messageExceptionAdvice")
public IExceptionAdvice defaultAdvice() {
    // ...
}
```

### 4.4 常见问题

**问题1**: Bean未创建
- **原因**: recruitRedisTemplate Bean不存在
- **解决**: 检查Redis配置，确保recruitRedisTemplate Bean已创建

**问题2**: 两个ExceptionAdvice都创建了
- **原因**: Profile配置错误或缺失
- **解决**: 确保spring.profiles.active配置正确

**问题3**: 线程池任务丢失
- **原因**: 队列满且拒绝策略不当
- **解决**: 使用CallerRunsPolicy或增加queueCapacity

**问题4**: 自定义Advice未生效
- **原因**: 未使用@Primary或Bean名称不正确
- **解决**: 确保Bean名称为"messageExceptionAdvice"且使用@Primary

---

## 📚 相关文档

- [Advice索引](./advice.md) - OAMessageExceptionAdvice和CloudMessageExceptionAdvice详情
- [Controller索引](./controller.md) - GlobalAdviceController全局异常处理器
- [Support工具索引](./support.md) - MessageRuleSupport工具类
- [Config配置索引](./config.md) - RecruitSystemFeignConfig配置类

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有Bean和配置 | v1.0 |

---
