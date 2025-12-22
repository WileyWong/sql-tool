# 服务接口和工厂类索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的服务接口和工厂类，包括作业服务接口和服务工厂Bean。

---

## 1. IRecruitJobService

**包路径**: `com.tencent.hr.recruit.center.job`

**功能**: 招聘作业服务接口，定义作业的核心操作方法

### 接口方法列表

| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| execute(Long jobId) | JobResult | 执行指定ID的作业 |
| execute(RecruitJobDTO jobDTO) | JobResult | 执行作业（使用DTO） |
| rollback(Long jobId) | JobResult | 回滚指定ID的作业 |
| rollback(RecruitJobDTO jobDTO) | JobResult | 回滚作业（使用DTO） |
| retry(Long jobId) | JobResult | 重试指定ID的作业 |
| retry(RecruitJobDTO jobDTO) | JobResult | 重试作业（使用DTO） |

### 接口说明

#### execute方法
- **功能**: 执行作业，按顺序执行作业中的所有任务
- **参数**: 
  - `jobId`: 作业ID
  - `jobDTO`: 作业数据传输对象
- **返回**: `JobResult`执行结果
- **异常**: 执行失败时返回失败的JobResult，不抛出异常

#### rollback方法
- **功能**: 回滚作业，逆序回滚已执行的任务
- **参数**: 
  - `jobId`: 作业ID
  - `jobDTO`: 作业数据传输对象
- **返回**: `JobResult`回滚结果
- **异常**: 回滚失败时返回失败的JobResult

#### retry方法
- **功能**: 重试失败的作业
- **参数**: 
  - `jobId`: 作业ID
  - `jobDTO`: 作业数据传输对象
- **返回**: `JobResult`重试结果
- **说明**: 会检查重试次数，超过最大重试次数则返回失败

---

## 2. RecruitJobServiceFactoryBean

**包路径**: `com.tencent.hr.recruit.center.job.factory`

**功能**: 招聘作业服务工厂Bean，用于创建和管理作业服务的动态代理实例

### 字段列表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| jobServiceInterface | Class<?> | 作业服务接口类型 |
| jobOperation | RecruitJobOperation | 作业操作核心类 |
| applicationContext | ApplicationContext | Spring应用上下文 |

### 公共方法

| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| RecruitJobServiceFactoryBean(Class<?> jobServiceInterface, RecruitJobOperation jobOperation, ApplicationContext applicationContext) | - | 构造函数 |
| getObject() | Object | 获取代理对象实例 |
| getObjectType() | Class<?> | 获取对象类型 |
| isSingleton() | boolean | 是否单例（返回true） |
| createProxy() | Object (private) | 创建JDK动态代理 |

### 继承关系
- 实现接口: `FactoryBean<Object>`
- 用于Spring Bean工厂模式

### 注解
- `@Slf4j`: Lombok日志注解

---

## 服务架构图

```
IRecruitJobService (接口)
    ├── execute(Long jobId)
    ├── execute(RecruitJobDTO jobDTO)
    ├── rollback(Long jobId)
    ├── rollback(RecruitJobDTO jobDTO)
    ├── retry(Long jobId)
    └── retry(RecruitJobDTO jobDTO)

RecruitJobServiceFactoryBean (工厂)
    ├── 创建动态代理
    ├── 绑定RecruitJobOperation
    └── 注册到Spring容器

RecruitJobProxy (动态代理)
    └── InvocationHandler: RecruitJobProxyHandler
```

---

## 动态代理机制

### 1. 代理创建流程
```
1. RecruitJobServiceFactoryBean.createProxy()
2. 创建RecruitJobProxyHandler (InvocationHandler)
3. Proxy.newProxyInstance() 创建代理对象
4. 代理对象实现IRecruitJobService接口
5. 方法调用被拦截到RecruitJobProxyHandler
```

### 2. 方法调用流程
```
1. 用户调用 jobService.execute(jobId)
2. 代理拦截器 RecruitJobProxyHandler.invoke()
3. 根据方法名路由到对应操作
4. 调用 RecruitJobOperation.executeJob(jobId)
5. 返回 JobResult
```

---

## 使用示例

### 1. 定义作业服务接口
```java
@RecruitJobService
public interface MyRecruitJobService extends IRecruitJobService {
    // 继承IRecruitJobService的所有方法
    // 可添加自定义方法
}
```

### 2. 注入并使用作业服务
```java
@Service
public class RecruitmentService {
    
    @Autowired
    private IRecruitJobService jobService;
    
    public void processRecruitment(Long jobId) {
        // 执行作业
        JobResult result = jobService.execute(jobId);
        
        if (result.isSuccess()) {
            log.info("作业执行成功: {}", result.getMessage());
        } else {
            log.error("作业执行失败: {}", result.getMessage());
            // 尝试回滚
            JobResult rollbackResult = jobService.rollback(jobId);
            if (rollbackResult.isSuccess()) {
                log.info("作业回滚成功");
            }
        }
    }
}
```

### 3. 使用DTO方式调用
```java
RecruitJobDTO jobDTO = RecruitJobDTO.builder()
    .id(jobId)
    .jobName("招聘审批作业")
    .build();

// 执行作业
JobResult result = jobService.execute(jobDTO);

// 回滚作业
JobResult rollbackResult = jobService.rollback(jobDTO);

// 重试作业
JobResult retryResult = jobService.retry(jobDTO);
```

### 4. 工厂Bean注册（内部实现）
```java
@Configuration
public class RecruitJobConfiguration {
    
    @Bean
    public RecruitJobServiceFactoryBean jobServiceFactoryBean(
            RecruitJobOperation jobOperation,
            ApplicationContext applicationContext) {
        return new RecruitJobServiceFactoryBean(
            IRecruitJobService.class,
            jobOperation,
            applicationContext
        );
    }
}
```

---

## 核心特性

### 1. 动态代理
- 使用JDK动态代理创建服务实例
- 无需手动实现IRecruitJobService接口
- 通过RecruitJobProxyHandler拦截方法调用

### 2. 单例模式
- RecruitJobServiceFactoryBean返回的代理对象是单例
- Spring容器中只有一个实例

### 3. 方法路由
- execute方法路由到RecruitJobOperation.executeJob()
- rollback方法路由到RecruitJobOperation.rollbackJob()
- retry方法路由到RecruitJobOperation.retryJob()

### 4. 统一异常处理
- 所有方法调用异常都会被捕获
- 统一返回JobResult失败结果
- 不会向上层抛出异常

---

## 最佳实践

### 1. 接口扩展
如需自定义作业服务方法，可继承`IRecruitJobService`接口：
```java
@RecruitJobService
public interface CustomRecruitJobService extends IRecruitJobService {
    
    /**
     * 批量执行作业
     */
    List<JobResult> batchExecute(List<Long> jobIds);
    
    /**
     * 异步执行作业
     */
    CompletableFuture<JobResult> asyncExecute(Long jobId);
}
```

### 2. 异常处理
建议在业务层捕获并处理JobResult：
```java
JobResult result = jobService.execute(jobId);
if (!result.isSuccess()) {
    // 记录日志
    log.error("作业执行失败: jobId={}, error={}", jobId, result.getMessage());
    
    // 发送告警
    alertService.sendAlert("作业执行失败", result.getMessage());
    
    // 尝试重试
    if (result.getJobId() != null) {
        jobService.retry(result.getJobId());
    }
}
```

### 3. 参数传递
优先使用DTO方式传递参数，更灵活：
```java
// 不推荐
jobService.execute(jobId);

// 推荐
RecruitJobDTO jobDTO = buildJobDTO(jobId);
jobService.execute(jobDTO);
```

### 4. 回滚策略
执行失败时，根据业务需求决定是否回滚：
```java
JobResult executeResult = jobService.execute(jobId);
if (!executeResult.isSuccess()) {
    // 根据业务规则判断是否需要回滚
    if (needRollback(executeResult)) {
        jobService.rollback(jobId);
    }
}
```

---

## 工厂Bean生命周期

```
1. Spring容器初始化
2. RecruitJobServiceFactoryBean实例化
3. 调用getObject()方法
4. 创建动态代理对象
5. 将代理对象注册到Spring容器
6. 应用可注入并使用IRecruitJobService
```

---

## 代理Handler详细说明

详细的代理处理器实现请参考 [proxy.md](./proxy.md) 文档。

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
