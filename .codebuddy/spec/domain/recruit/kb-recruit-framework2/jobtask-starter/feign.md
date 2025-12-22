# Feign接口索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的Feign接口，用于远程调用招聘配置服务。

---

## 1. RecruitConfigFeign

**包路径**: `com.tencent.hr.recruit.center.job.feign`

**功能**: 招聘配置服务Feign客户端，提供作业和任务配置信息的远程调用接口

### 接口信息
- **服务名**: `recruit-center-config`
- **配置类**: `RecruitConfigServiceConfiguration`

### 接口方法列表

| 方法签名 | HTTP方法 | 路径 | 返回类型 | 说明 |
|----------|----------|------|----------|------|
| getJobById(@PathVariable("jobId") Long jobId) | GET | /job/{jobId} | RecruitJobDTO | 根据ID获取作业信息 |
| getJobByBusinessId(@PathVariable("businessId") String businessId) | GET | /job/business/{businessId} | RecruitJobDTO | 根据业务ID获取作业信息 |
| getTaskById(@PathVariable("taskId") Long taskId) | GET | /task/{taskId} | RecruitTaskDTO | 根据ID获取任务信息 |
| getTasksByJobId(@PathVariable("jobId") Long jobId) | GET | /task/job/{jobId} | List<RecruitTaskDTO> | 根据作业ID获取任务列表 |
| updateJobStatus(@PathVariable("jobId") Long jobId, @RequestParam("status") RecruitJobStatus status) | PUT | /job/{jobId}/status | void | 更新作业状态 |
| updateTaskStatus(@PathVariable("taskId") Long taskId, @RequestParam("status") RecruitTaskStatus status) | PUT | /task/{taskId}/status | void | 更新任务状态 |
| updateTaskStatusWithError(@PathVariable("taskId") Long taskId, @RequestParam("status") RecruitTaskStatus status, @RequestParam("errorMessage") String errorMessage) | PUT | /task/{taskId}/status/error | void | 更新任务状态（带错误信息） |

### 注解
- `@FeignClient`: 指定Feign客户端
  - `name`: `"recruit-center-config"` - 服务名
  - `configuration`: `RecruitConfigServiceConfiguration.class` - 配置类
- `@RequestMapping`: API路径前缀 `/api/recruit/config`

---

## 方法详细说明

### 1. getJobById
**功能**: 根据作业ID获取作业配置信息

**请求示例**:
```
GET /api/recruit/config/job/123
```

**响应示例**:
```json
{
  "id": 123,
  "jobName": "招聘审批作业",
  "jobDesc": "处理招聘审批流程",
  "jobStatus": "PENDING",
  "eventType": "APPROVAL",
  "businessId": "RECRUIT_001",
  "tasks": [...]
}
```

---

### 2. getJobByBusinessId
**功能**: 根据业务ID获取作业配置信息

**请求示例**:
```
GET /api/recruit/config/job/business/RECRUIT_001
```

**响应示例**:
同`getJobById`

---

### 3. getTaskById
**功能**: 根据任务ID获取任务配置信息

**请求示例**:
```
GET /api/recruit/config/task/456
```

**响应示例**:
```json
{
  "id": 456,
  "jobId": 123,
  "taskName": "发送通知任务",
  "taskDesc": "发送审批通知邮件",
  "taskType": "NORMAL",
  "taskStatus": "PENDING",
  "taskOrder": 1
}
```

---

### 4. getTasksByJobId
**功能**: 根据作业ID获取该作业下的所有任务列表

**请求示例**:
```
GET /api/recruit/config/task/job/123
```

**响应示例**:
```json
[
  {
    "id": 456,
    "taskName": "发送通知任务",
    "taskOrder": 1,
    ...
  },
  {
    "id": 457,
    "taskName": "更新状态任务",
    "taskOrder": 2,
    ...
  }
]
```

---

### 5. updateJobStatus
**功能**: 更新作业状态

**请求示例**:
```
PUT /api/recruit/config/job/123/status?status=RUNNING
```

**参数说明**:
- `jobId`: 作业ID（路径参数）
- `status`: 目标状态（查询参数）

**状态值**:
- `PENDING`: 待执行
- `RUNNING`: 执行中
- `SUCCESS`: 执行成功
- `FAILED`: 执行失败
- `ROLLBACK`: 已回滚

---

### 6. updateTaskStatus
**功能**: 更新任务状态

**请求示例**:
```
PUT /api/recruit/config/task/456/status?status=RUNNING
```

**参数说明**:
- `taskId`: 任务ID（路径参数）
- `status`: 目标状态（查询参数）

---

### 7. updateTaskStatusWithError
**功能**: 更新任务状态并记录错误信息

**请求示例**:
```
PUT /api/recruit/config/task/456/status/error?status=FAILED&errorMessage=网络超时
```

**参数说明**:
- `taskId`: 任务ID（路径参数）
- `status`: 目标状态（查询参数）
- `errorMessage`: 错误消息（查询参数）

---

## 配置说明

### Feign客户端配置
Feign客户端使用`RecruitConfigServiceConfiguration`配置类，包含：
1. **请求拦截器**: `InnerFeignRequestInterceptor`
   - 自动添加租户信息到请求头
2. **结果解码器**: `RecruitConfigResultDecoder`
   - 自动解析`Result`包装的响应结果

### 配置示例
```java
@Configuration
public class RecruitConfigServiceConfiguration {
    
    @Bean
    public InnerFeignRequestInterceptor feignRequestInterceptor() {
        return new InnerFeignRequestInterceptor();
    }
    
    @Bean
    public RecruitConfigResultDecoder feignDecoder(
            ObjectFactory<HttpMessageConverters> messageConverters) {
        return new RecruitConfigResultDecoder(
            new SpringDecoder(messageConverters)
        );
    }
}
```

---

## 使用示例

### 1. 注入Feign客户端
```java
@Service
public class JobExecutionService {
    
    @Autowired
    private RecruitConfigFeign recruitConfigFeign;
    
    public void executeJob(Long jobId) {
        // 获取作业配置
        RecruitJobDTO jobDTO = recruitConfigFeign.getJobById(jobId);
        
        // 获取任务列表
        List<RecruitTaskDTO> tasks = recruitConfigFeign.getTasksByJobId(jobId);
        
        // 执行作业...
        
        // 更新作业状态
        recruitConfigFeign.updateJobStatus(jobId, RecruitJobStatus.RUNNING);
    }
}
```

### 2. 处理异常
```java
try {
    RecruitJobDTO jobDTO = recruitConfigFeign.getJobById(jobId);
} catch (FeignException e) {
    log.error("调用配置服务失败: {}", e.getMessage());
    // 处理异常
}
```

### 3. 更新任务状态
```java
// 成功
recruitConfigFeign.updateTaskStatus(taskId, RecruitTaskStatus.SUCCESS);

// 失败（带错误信息）
recruitConfigFeign.updateTaskStatusWithError(
    taskId, 
    RecruitTaskStatus.FAILED, 
    "数据库连接超时"
);
```

---

## 调用链路

```
JobTask Starter (本地)
    ↓
RecruitConfigFeign (Feign客户端)
    ↓
InnerFeignRequestInterceptor (添加租户信息)
    ↓
HTTP请求
    ↓
Recruit Config Service (远程服务)
    ↓
Result<T> 响应
    ↓
RecruitConfigResultDecoder (解包Result)
    ↓
返回T对象
```

---

## 服务依赖

```
RecruitCenterJobTaskStarter
    └── RecruitConfigFeign
            └── recruit-center-config (微服务)
                    ├── 作业配置管理
                    ├── 任务配置管理
                    └── 状态更新服务
```

---

## 最佳实践

### 1. 异常处理
始终捕获`FeignException`并进行适当处理：
```java
try {
    RecruitJobDTO jobDTO = recruitConfigFeign.getJobById(jobId);
} catch (FeignException.NotFound e) {
    log.error("作业不存在: jobId={}", jobId);
    throw new BusinessException("作业不存在");
} catch (FeignException e) {
    log.error("调用配置服务失败", e);
    throw new SystemException("配置服务不可用");
}
```

### 2. 超时配置
在`application.yml`中配置Feign超时：
```yaml
feign:
  client:
    config:
      recruit-center-config:
        connectTimeout: 5000
        readTimeout: 10000
```

### 3. 重试策略
配置Feign重试器：
```java
@Bean
public Retryer feignRetryer() {
    return new Retryer.Default(100, 1000, 3);
}
```

### 4. 租户隔离
所有请求会自动添加租户信息到请求头，无需手动处理。

### 5. 日志配置
配置Feign日志级别：
```yaml
logging:
  level:
    com.tencent.hr.recruit.center.job.feign: DEBUG

feign:
  client:
    config:
      recruit-center-config:
        loggerLevel: FULL
```

---

## 注意事项

### 1. 服务发现
确保`recruit-center-config`服务已注册到服务注册中心（如Nacos、Eureka）。

### 2. 负载均衡
Feign会自动进行客户端负载均衡（需配置Ribbon或Spring Cloud LoadBalancer）。

### 3. 熔断降级
建议配置Hystrix或Resilience4j进行熔断降级：
```java
@FeignClient(
    name = "recruit-center-config",
    configuration = RecruitConfigServiceConfiguration.class,
    fallback = RecruitConfigFeignFallback.class
)
```

### 4. 版本兼容
确保Feign接口定义与远程服务API保持一致。

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
