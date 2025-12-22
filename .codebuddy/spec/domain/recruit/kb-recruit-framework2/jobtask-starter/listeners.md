# 消息监听器索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的消息监听器，包括Kafka和Tdmq两种消息队列的监听器实现。

---

## 1. KafkaMessageListener

**包路径**: `com.tencent.hr.recruit.center.job.listener`

**功能**: Kafka消息监听器，监听招聘作业通知消息并触发作业执行

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| recruitConfigFeign | RecruitConfigFeign | 配置服务Feign客户端 |
| contextStore | ContextStore | 上下文存储器 |
| recruitJobOperation | RecruitJobOperation | 作业操作核心类 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| KafkaMessageListener(RecruitConfigFeign recruitConfigFeign, ContextStore contextStore) | - | 构造函数 |
| listen(ConsumerRecord<String, String> record) | void | 监听Kafka消息 |
| setRecruitJobOperation(RecruitJobOperation recruitJobOperation) | void | 设置作业操作对象 |
| handleMessage(String message) | void (private) | 处理消息 |
| parseMessage(String message) | RecruitJobNoticeDTO (private) | 解析消息 |

### 注解
- `@Slf4j`: Lombok日志注解
- `@Component`: Spring组件注解

### 监听配置
- **Topic**: `${recruit.job.kafka.topic:recruit-job-notice}` - 可配置
- **Group**: `${recruit.job.kafka.group:recruit-job-consumer}` - 可配置

---

## 2. TdmqMessageListener

**包路径**: `com.tencent.hr.recruit.center.job.listener`

**功能**: Tdmq消息监听器，监听招聘作业通知消息并触发作业执行

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| recruitConfigFeign | RecruitConfigFeign | 配置服务Feign客户端 |
| contextStore | ContextStore | 上下文存储器 |
| recruitJobOperation | RecruitJobOperation | 作业操作核心类 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| TdmqMessageListener(RecruitConfigFeign recruitConfigFeign, ContextStore contextStore) | - | 构造函数 |
| listen(Message message) | void | 监听Tdmq消息 |
| setRecruitJobOperation(RecruitJobOperation recruitJobOperation) | void | 设置作业操作对象 |
| handleMessage(String messageBody) | void (private) | 处理消息 |
| parseMessage(String messageBody) | RecruitJobNoticeDTO (private) | 解析消息 |

### 注解
- `@Slf4j`: Lombok日志注解
- `@Component`: Spring组件注解

### 监听配置
- **Topic**: `${recruit.job.tdmq.topic:recruit-job-notice}` - 可配置
- **Subscription**: `${recruit.job.tdmq.subscription:recruit-job-sub}` - 可配置

---

## 监听器对比

| 特性 | KafkaMessageListener | TdmqMessageListener |
|------|---------------------|---------------------|
| 消息队列 | Apache Kafka | 腾讯云Tdmq |
| 消息类型 | ConsumerRecord<String, String> | Message |
| 配置条件 | recruit.job.mq.type=kafka | recruit.job.mq.type=tdmq |
| 自动配置 | RecruitKafkaJobConfiguration | RecruitTdmqJobConfiguration |
| 依赖组件 | KafkaTemplate | TdmqTemplate |

---

## 消息格式

### 消息结构（JSON）
```json
{
  "jobId": 123,
  "jobName": "招聘审批作业",
  "jobStatus": "PENDING",
  "eventType": "APPROVAL",
  "businessId": "RECRUIT_001",
  "businessType": "RECRUITMENT",
  "message": "新的招聘审批作业待处理",
  "noticeTime": "2025-11-21T10:00:00",
  "tenantId": "tenant-001"
}
```

### 字段说明
- `jobId`: 作业ID（必填）
- `jobName`: 作业名称
- `jobStatus`: 作业状态
- `eventType`: 事件类型
- `businessId`: 业务ID
- `businessType`: 业务类型
- `message`: 通知消息
- `noticeTime`: 通知时间
- `tenantId`: 租户ID

---

## 消息处理流程

### 1. Kafka消息处理流程
```
1. Kafka Topic收到消息
2. KafkaMessageListener.listen()被触发
3. 从ConsumerRecord提取消息体
4. 解析JSON消息为RecruitJobNoticeDTO
5. 获取jobId
6. 调用RecruitJobOperation.executeJob(jobId)
7. 更新作业状态
8. 记录日志
```

### 2. Tdmq消息处理流程
```
1. Tdmq Topic收到消息
2. TdmqMessageListener.listen()被触发
3. 从Message提取消息体
4. 解析JSON消息为RecruitJobNoticeDTO
5. 获取jobId
6. 调用RecruitJobOperation.executeJob(jobId)
7. 更新作业状态
8. 记录日志
```

---

## 监听器架构图

```
Message Queue (Kafka/Tdmq)
    ↓
Listener (Kafka/Tdmq)
    ├── parseMessage (解析消息)
    ├── handleMessage (处理消息)
    └── RecruitJobOperation.executeJob (执行作业)
            ├── 获取作业配置
            ├── 执行任务列表
            ├── 更新作业状态
            └── 发送状态通知
```

---

## 配置示例

### 1. Kafka配置
```yaml
# application.yml
recruit:
  job:
    mq:
      type: kafka  # 使用Kafka
    kafka:
      topic: recruit-job-notice  # 监听的Topic
      group: recruit-job-consumer  # 消费者组

spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: recruit-job-consumer
      auto-offset-reset: earliest
      enable-auto-commit: true
```

### 2. Tdmq配置
```yaml
# application.yml
recruit:
  job:
    mq:
      type: tdmq  # 使用Tdmq
    tdmq:
      topic: recruit-job-notice  # 监听的Topic
      subscription: recruit-job-sub  # 订阅名称

tdmq:
  pulsar:
    service-url: pulsar://localhost:6650
    admin-url: http://localhost:8080
```

---

## 使用示例

### 1. 发送作业通知（Kafka）
```java
@Service
public class JobNoticeService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void sendJobNotice(RecruitJobNoticeDTO noticeDTO) {
        String message = JobJsonUtil.toJson(noticeDTO);
        kafkaTemplate.send("recruit-job-notice", message);
        log.info("发送作业通知: jobId={}", noticeDTO.getJobId());
    }
}
```

### 2. 发送作业通知（Tdmq）
```java
@Service
public class JobNoticeService {
    
    @Autowired
    private TdmqTemplate tdmqTemplate;
    
    public void sendJobNotice(RecruitJobNoticeDTO noticeDTO) {
        String message = JobJsonUtil.toJson(noticeDTO);
        tdmqTemplate.send("recruit-job-notice", message);
        log.info("发送作业通知: jobId={}", noticeDTO.getJobId());
    }
}
```

### 3. 监听器初始化
```java
@Configuration
public class JobListenerConfiguration {
    
    @Bean
    @ConditionalOnProperty(name = "recruit.job.mq.type", havingValue = "kafka")
    public KafkaMessageListener kafkaMessageListener(
            RecruitConfigFeign recruitConfigFeign,
            ContextStore contextStore) {
        return new KafkaMessageListener(recruitConfigFeign, contextStore);
    }
    
    @Bean
    @ConditionalOnProperty(name = "recruit.job.mq.type", havingValue = "tdmq")
    public TdmqMessageListener tdmqMessageListener(
            RecruitConfigFeign recruitConfigFeign,
            ContextStore contextStore) {
        return new TdmqMessageListener(recruitConfigFeign, contextStore);
    }
}
```

---

## 异常处理

### 1. 消息解析异常
```java
try {
    RecruitJobNoticeDTO noticeDTO = parseMessage(message);
} catch (JsonProcessingException e) {
    log.error("消息解析失败: message={}", message, e);
    // 记录到死信队列
    sendToDeadLetterQueue(message);
}
```

### 2. 作业执行异常
```java
try {
    JobResult result = recruitJobOperation.executeJob(jobId);
    if (!result.isSuccess()) {
        log.error("作业执行失败: jobId={}, error={}", jobId, result.getMessage());
    }
} catch (Exception e) {
    log.error("作业执行异常: jobId={}", jobId, e);
    // 更新作业状态为失败
    updateJobStatus(jobId, RecruitJobStatus.FAILED);
}
```

### 3. 消息重试
监听器支持自动重试机制（由消息队列提供）：
- Kafka: 通过消费者组管理offset，失败后可重新消费
- Tdmq: 支持消息重试和死信队列

---

## 最佳实践

### 1. 幂等性保证
确保消息处理是幂等的，避免重复执行：
```java
// 检查作业是否已执行
if (isJobAlreadyExecuted(jobId)) {
    log.warn("作业已执行，跳过: jobId={}", jobId);
    return;
}
```

### 2. 事务处理
使用事务确保数据一致性：
```java
@Transactional
public void handleMessage(String message) {
    // 处理消息
    // 更新数据库
    // 发送通知
}
```

### 3. 监控告警
添加监控指标：
```java
@Autowired
private MeterRegistry meterRegistry;

public void listen(ConsumerRecord<String, String> record) {
    meterRegistry.counter("job.message.received").increment();
    try {
        handleMessage(record.value());
        meterRegistry.counter("job.message.success").increment();
    } catch (Exception e) {
        meterRegistry.counter("job.message.failed").increment();
        throw e;
    }
}
```

### 4. 日志记录
详细记录消息处理过程：
```java
log.info("收到作业通知: topic={}, partition={}, offset={}, jobId={}", 
    record.topic(), record.partition(), record.offset(), jobId);
```

### 5. 上下文传递
使用ContextStore传递租户等上下文信息：
```java
// 设置租户上下文
contextStore.setTenantId(noticeDTO.getTenantId());

// 执行作业
recruitJobOperation.executeJob(jobId);

// 清理上下文
contextStore.clearTenantId();
```

---

## 性能优化

### 1. 批量消费
配置批量消费提升性能：
```yaml
spring:
  kafka:
    consumer:
      max-poll-records: 100
```

### 2. 并发消费
配置监听器并发数：
```java
@KafkaListener(
    topics = "recruit-job-notice",
    concurrency = "3"
)
public void listen(ConsumerRecord<String, String> record) {
    // 处理消息
}
```

### 3. 异步处理
使用异步方式处理消息：
```java
@Async
public void handleMessageAsync(String message) {
    // 异步处理消息
}
```

---

## 故障处理

### 1. 死信队列
配置死信队列处理失败消息：
```yaml
spring:
  kafka:
    consumer:
      properties:
        max.poll.interval.ms: 300000
```

### 2. 重试策略
配置消息重试次数：
```java
@RetryableTopic(
    attempts = "3",
    backoff = @Backoff(delay = 1000, multiplier = 2.0)
)
```

### 3. 降级处理
消息处理失败时的降级策略：
```java
if (retryCount > maxRetryCount) {
    log.error("消息处理失败次数超限，放弃处理: jobId={}", jobId);
    sendToDeadLetterQueue(message);
}
```

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
