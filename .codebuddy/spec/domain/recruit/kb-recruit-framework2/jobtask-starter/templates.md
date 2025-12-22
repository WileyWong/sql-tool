# 模板类索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的消息模板类，提供统一的消息发送接口和实现。

---

## 1. IMessageTemplate

**包路径**: `com.tencent.hr.recruit.center.job.template`

**功能**: 消息模板接口，定义消息发送的统一方法规范

### 接口方法列表

| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| send(String topic, Object message) | void | 发送消息到指定Topic |
| send(String topic, String key, Object message) | void | 发送带key的消息 |

---

## 2. KafkaMessageTemplate

**包路径**: `com.tencent.hr.recruit.center.job.template.impl`

**功能**: Kafka消息模板实现，基于KafkaTemplate实现消息发送

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| kafkaTemplate | KafkaTemplate<String, String> | Kafka发送模板 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| KafkaMessageTemplate(KafkaTemplate<String, String> kafkaTemplate) | - | 构造函数 |
| send(String topic, Object message) | void | 发送消息到Kafka Topic |
| send(String topic, String key, Object message) | void | 发送带key的消息到Kafka |
| convertToJson(Object message) | String (private) | 将对象转换为JSON字符串 |

### 注解
- `@Slf4j`: Lombok日志注解
- `@Component`: Spring组件注解
- `@ConditionalOnProperty`: 条件加载，当`recruit.job.mq.type=kafka`时生效

---

## 3. TdmqMessageTemplate

**包路径**: `com.tencent.hr.recruit.center.job.template.impl`

**功能**: Tdmq消息模板实现，基于PulsarTemplate实现消息发送

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| pulsarTemplate | PulsarTemplate<String> | Pulsar发送模板 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| TdmqMessageTemplate(PulsarTemplate<String> pulsarTemplate) | - | 构造函数 |
| send(String topic, Object message) | void | 发送消息到Tdmq Topic |
| send(String topic, String key, Object message) | void | 发送带key的消息到Tdmq |
| convertToJson(Object message) | String (private) | 将对象转换为JSON字符串 |

### 注解
- `@Slf4j`: Lombok日志注解
- `@Component`: Spring组件注解
- `@ConditionalOnProperty`: 条件加载，当`recruit.job.mq.type=tdmq`时生效

---

## 模板对比

| 特性 | KafkaMessageTemplate | TdmqMessageTemplate |
|------|---------------------|---------------------|
| 消息队列 | Apache Kafka | 腾讯云Tdmq (Pulsar) |
| 底层模板 | KafkaTemplate | PulsarTemplate |
| 消息格式 | JSON字符串 | JSON字符串 |
| 配置条件 | recruit.job.mq.type=kafka | recruit.job.mq.type=tdmq |
| 自动配置类 | RecruitKafkaJobConfiguration | RecruitTdmqJobConfiguration |

---

## 使用示例

### 1. 注入消息模板
```java
@Service
public class NotificationService {
    
    @Autowired
    private IMessageTemplate messageTemplate;
    
    public void sendJobNotice(RecruitJobNoticeDTO noticeDTO) {
        messageTemplate.send("recruit-job-notice", noticeDTO);
    }
}
```

### 2. 发送简单消息
```java
// 发送到指定Topic
messageTemplate.send("recruit-job-notice", noticeDTO);
```

### 3. 发送带key的消息
```java
// 使用jobId作为key（用于分区）
String key = String.valueOf(noticeDTO.getJobId());
messageTemplate.send("recruit-job-notice", key, noticeDTO);
```

### 4. 发送不同类型的消息
```java
// 发送DTO对象
RecruitJobNoticeDTO noticeDTO = RecruitJobNoticeDTO.builder()
    .jobId(123L)
    .jobName("招聘审批作业")
    .jobStatus(RecruitJobStatus.PENDING)
    .build();
messageTemplate.send("recruit-job-notice", noticeDTO);

// 发送Map对象
Map<String, Object> message = new HashMap<>();
message.put("jobId", 123L);
message.put("status", "PENDING");
messageTemplate.send("recruit-job-notice", message);

// 发送String消息
String jsonMessage = "{\"jobId\":123,\"status\":\"PENDING\"}";
messageTemplate.send("recruit-job-notice", jsonMessage);
```

---

## 配置示例

### 1. Kafka配置
```yaml
# application.yml
recruit:
  job:
    mq:
      type: kafka

spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all
      retries: 3
```

### 2. Tdmq配置
```yaml
# application.yml
recruit:
  job:
    mq:
      type: tdmq

tdmq:
  pulsar:
    service-url: pulsar://localhost:6650
    admin-url: http://localhost:8080
    producer:
      send-timeout-ms: 30000
      max-pending-messages: 1000
```

---

## 消息发送流程

### 1. Kafka发送流程
```
1. messageTemplate.send(topic, message)
2. convertToJson(message) - 转换为JSON
3. kafkaTemplate.send(topic, jsonMessage)
4. Kafka Producer发送消息
5. 等待确认（根据acks配置）
6. 记录日志
```

### 2. Tdmq发送流程
```
1. messageTemplate.send(topic, message)
2. convertToJson(message) - 转换为JSON
3. pulsarTemplate.send(topic, jsonMessage)
4. Pulsar Producer发送消息
5. 等待确认
6. 记录日志
```

---

## 高级用法

### 1. 异步发送
```java
@Async
public CompletableFuture<Void> sendAsync(String topic, Object message) {
    return CompletableFuture.runAsync(() -> {
        messageTemplate.send(topic, message);
    });
}
```

### 2. 批量发送
```java
public void sendBatch(String topic, List<Object> messages) {
    for (Object message : messages) {
        messageTemplate.send(topic, message);
    }
}
```

### 3. 事务发送（Kafka）
```java
@Transactional
public void sendWithTransaction(String topic, Object message) {
    // 数据库操作
    dataService.save(data);
    
    // 发送消息（在同一事务中）
    messageTemplate.send(topic, message);
}
```

### 4. 延迟发送（Tdmq）
```java
// 使用Tdmq的延迟消息功能
public void sendDelayed(String topic, Object message, long delaySeconds) {
    // 需要直接使用PulsarTemplate的高级API
    TypedMessageBuilder<String> messageBuilder = pulsarTemplate
        .newMessage(convertToJson(message))
        .topic(topic)
        .deliverAfter(delaySeconds, TimeUnit.SECONDS);
    
    messageBuilder.send();
}
```

---

## 异常处理

### 1. 发送失败处理
```java
public void sendWithRetry(String topic, Object message) {
    int maxRetries = 3;
    int retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            messageTemplate.send(topic, message);
            log.info("消息发送成功: topic={}", topic);
            return;
        } catch (Exception e) {
            retryCount++;
            log.error("消息发送失败，重试次数: {}/{}", retryCount, maxRetries, e);
            
            if (retryCount >= maxRetries) {
                log.error("消息发送失败，已达最大重试次数");
                throw new RuntimeException("消息发送失败", e);
            }
            
            // 等待后重试
            try {
                Thread.sleep(1000 * retryCount);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

### 2. JSON转换异常
```java
private String convertToJson(Object message) {
    try {
        if (message instanceof String) {
            return (String) message;
        }
        return JobJsonUtil.toJson(message);
    } catch (Exception e) {
        log.error("消息JSON转换失败", e);
        throw new RuntimeException("消息JSON转换失败", e);
    }
}
```

---

## 最佳实践

### 1. Topic命名规范
使用清晰的Topic命名：
```java
public class Topics {
    public static final String JOB_NOTICE = "recruit-job-notice";
    public static final String TASK_NOTICE = "recruit-task-notice";
    public static final String STATUS_CHANGE = "recruit-status-change";
}

// 使用
messageTemplate.send(Topics.JOB_NOTICE, noticeDTO);
```

### 2. 消息封装
封装消息发送逻辑：
```java
@Service
public class MessagePublisher {
    
    @Autowired
    private IMessageTemplate messageTemplate;
    
    public void publishJobNotice(RecruitJobNoticeDTO noticeDTO) {
        String topic = "recruit-job-notice";
        String key = String.valueOf(noticeDTO.getJobId());
        messageTemplate.send(topic, key, noticeDTO);
        log.info("发布作业通知: jobId={}", noticeDTO.getJobId());
    }
    
    public void publishTaskNotice(RecruitTaskDTO taskDTO) {
        String topic = "recruit-task-notice";
        messageTemplate.send(topic, taskDTO);
        log.info("发布任务通知: taskId={}", taskDTO.getId());
    }
}
```

### 3. 日志记录
详细记录消息发送日志：
```java
@Override
public void send(String topic, Object message) {
    log.info("准备发送消息: topic={}, messageType={}", 
        topic, message.getClass().getSimpleName());
    
    try {
        String jsonMessage = convertToJson(message);
        kafkaTemplate.send(topic, jsonMessage);
        
        log.info("消息发送成功: topic={}, size={}", 
            topic, jsonMessage.length());
    } catch (Exception e) {
        log.error("消息发送失败: topic={}", topic, e);
        throw e;
    }
}
```

### 4. 监控指标
添加监控指标：
```java
@Autowired
private MeterRegistry meterRegistry;

@Override
public void send(String topic, Object message) {
    Timer.Sample sample = Timer.start(meterRegistry);
    
    try {
        kafkaTemplate.send(topic, convertToJson(message));
        meterRegistry.counter("message.send.success", "topic", topic).increment();
    } catch (Exception e) {
        meterRegistry.counter("message.send.failed", "topic", topic).increment();
        throw e;
    } finally {
        sample.stop(meterRegistry.timer("message.send.duration", "topic", topic));
    }
}
```

### 5. 消息压缩
配置消息压缩（Kafka）：
```yaml
spring:
  kafka:
    producer:
      compression-type: gzip
```

---

## 性能优化

### 1. 批量发送
配置批量发送参数：
```yaml
spring:
  kafka:
    producer:
      batch-size: 16384
      linger-ms: 10
```

### 2. 异步发送
使用异步发送提升性能：
```java
ListenableFuture<SendResult<String, String>> future = 
    kafkaTemplate.send(topic, message);

future.addCallback(
    result -> log.info("消息发送成功"),
    ex -> log.error("消息发送失败", ex)
);
```

### 3. 连接池配置
配置合理的连接池：
```yaml
spring:
  kafka:
    producer:
      properties:
        max.in.flight.requests.per.connection: 5
```

---

## 注意事项

### 1. 消息大小
- 注意消息大小限制
- Kafka默认最大1MB
- 超大消息考虑分片或压缩

### 2. 消息顺序
- 使用相同key保证顺序
- 单分区保证严格顺序
- 多分区仅保证key内顺序

### 3. 消息可靠性
- 配置acks=all确保可靠性
- 启用重试机制
- 使用事务保证一致性

### 4. 序列化
- 统一使用JSON序列化
- 注意日期格式
- 处理null值

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
