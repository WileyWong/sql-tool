# 配置类索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的所有配置类，包括Feign配置、Kafka配置、Tdmq配置等。

---

## 1. InnerFeignRequestInterceptor

**包路径**: `com.tencent.hr.recruit.center.job.configuration`

**功能**: Feign请求拦截器，用于在Feign调用时添加租户信息到请求头

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| TENANT_ID | String (static final) | 租户ID请求头key |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| apply(RequestTemplate template) | void | 应用拦截器，将租户ID添加到请求头 |

---

## 2. RecruitConfigResultDecoder

**包路径**: `com.tencent.hr.recruit.center.job.configuration`

**功能**: Feign结果解码器，用于解析RecruitConfigFeign的响应结果

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| delegate | Decoder | 委托的解码器 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| RecruitConfigResultDecoder(Decoder delegate) | - | 构造函数 |
| decode(Response response, Type type) | Object | 解码响应结果，处理Result包装类型 |

---

## 3. RecruitConfigServiceConfiguration

**包路径**: `com.tencent.hr.recruit.center.job.configuration`

**功能**: Feign服务配置类，配置RecruitConfigFeign的拦截器和解码器

### 字段列表
无实例字段

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| feignRequestInterceptor() | InnerFeignRequestInterceptor | 创建Feign请求拦截器Bean |
| feignDecoder(ObjectFactory<HttpMessageConverters> messageConverters) | RecruitConfigResultDecoder | 创建Feign解码器Bean |

---

## 4. RecruitKafkaJobConfiguration

**包路径**: `com.tencent.hr.recruit.center.job.configuration`

**功能**: Kafka消息队列配置类，配置消息监听器和消息模板

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| recruitConfigFeign | RecruitConfigFeign | 配置服务Feign客户端 |
| contextStore | ContextStore | 上下文存储器 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| RecruitKafkaJobConfiguration(RecruitConfigFeign recruitConfigFeign, ContextStore contextStore) | - | 构造函数 |
| kafkaMessageListener() | KafkaMessageListener | 创建Kafka消息监听器Bean |
| kafkaMessageTemplate() | KafkaMessageTemplate | 创建Kafka消息模板Bean |

### 注解
- `@Configuration`: 标识为配置类
- `@ConditionalOnProperty`: 条件加载，当`recruit.job.mq.type=kafka`时生效
- `@AutoConfigureAfter`: 在KafkaAutoConfiguration之后自动配置
- `@Slf4j`: Lombok日志注解

---

## 5. RecruitTdmqJobConfiguration

**包路径**: `com.tencent.hr.recruit.center.job.configuration`

**功能**: Tdmq消息队列配置类，配置消息监听器和消息模板

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| recruitConfigFeign | RecruitConfigFeign | 配置服务Feign客户端 |
| contextStore | ContextStore | 上下文存储器 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| RecruitTdmqJobConfiguration(RecruitConfigFeign recruitConfigFeign, ContextStore contextStore) | - | 构造函数 |
| tdmqMessageListener() | TdmqMessageListener | 创建Tdmq消息监听器Bean |
| tdmqMessageTemplate() | TdmqMessageTemplate | 创建Tdmq消息模板Bean |

### 注解
- `@Configuration`: 标识为配置类
- `@ConditionalOnProperty`: 条件加载，当`recruit.job.mq.type=tdmq`时生效
- `@AutoConfigureAfter`: 在TdmqAutoConfiguration之后自动配置
- `@Slf4j`: Lombok日志注解

---

## 配置类关系图

```
RecruitConfigServiceConfiguration (Feign配置)
    ├── InnerFeignRequestInterceptor (租户拦截器)
    └── RecruitConfigResultDecoder (结果解码器)

RecruitKafkaJobConfiguration (Kafka配置)
    ├── KafkaMessageListener (Kafka监听器)
    └── KafkaMessageTemplate (Kafka模板)

RecruitTdmqJobConfiguration (Tdmq配置)
    ├── TdmqMessageListener (Tdmq监听器)
    └── TdmqMessageTemplate (Tdmq模板)
```

---

## 配置加载顺序

1. **RecruitConfigServiceConfiguration**: 最先加载，提供Feign配置
2. **RecruitKafkaJobConfiguration** 或 **RecruitTdmqJobConfiguration**: 根据`recruit.job.mq.type`配置项择一加载
   - 当`recruit.job.mq.type=kafka`时，加载Kafka配置
   - 当`recruit.job.mq.type=tdmq`时，加载Tdmq配置

---

## 最佳实践

### 1. 使用Feign调用配置服务
```java
@Autowired
private RecruitConfigFeign recruitConfigFeign;

// 调用会自动添加租户信息到请求头
RecruitJobDTO jobConfig = recruitConfigFeign.getJobById(jobId);
```

### 2. 配置消息队列类型
```yaml
# application.yml
recruit:
  job:
    mq:
      type: kafka  # 或 tdmq
```

### 3. 扩展Feign拦截器
如需添加更多请求头信息，可继承`InnerFeignRequestInterceptor`并重写`apply`方法。

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
