# 第三方组件

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 组件列表

| 组件 | 版本 | 用途 | 配置类 |
|------|------|------|--------|
| {{COMPONENT_NAME}} | {{VERSION}} | {{PURPOSE}} | `{{CONFIG_CLASS}}` |

---

## 📝 组件详情

### {{COMPONENT_NAME}}

**用途**:
- {{USE_CASE_1}}
- {{USE_CASE_2}}
- {{USE_CASE_3}}

**配置类**:
```java
@Configuration
@EnableCaching
public class {{CONFIG_CLASS}} {

    @Bean
    public {{BEAN_TYPE}} {{BEAN_NAME}}({{PARAMS}}) {
        // Bean 配置
    }
}
```

**核心方法**:

#### {{METHOD_NAME}}
```java
public void {{METHOD_NAME}}(
    String key,
    Object value,
    long timeout,
    TimeUnit unit
)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | key | String | 缓存键 |
  | value | Object | 缓存值 |
  | timeout | long | 过期时间 |
  | unit | TimeUnit | 时间单位 |
- **说明**: 设置缓存值

#### {{METHOD_NAME_2}}
```java
public <T> T {{METHOD_NAME_2}}(
    String key,
    Class<T> type
)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | key | String | 缓存键 |
  | type | Class<T> | 返回类型 |
- **返回**: `T` - 缓存值
- **说明**: 获取缓存值

**配置**:
```yaml
spring:
  {{CONFIG_PREFIX}}:
    {{CONFIG_KEY_1}}: {{CONFIG_VALUE_1}}
    {{CONFIG_KEY_2}}: {{CONFIG_VALUE_2}}
    {{NESTED_CONFIG}}:
      {{NESTED_KEY}}: {{NESTED_VALUE}}
```

**使用示例**:
```java
@Autowired
private {{COMPONENT_TYPE}} {{COMPONENT_VAR}};

// 示例1: {{USE_CASE_1}}
{{COMPONENT_VAR}}.{{METHOD_1}}({{PARAMS}});

// 示例2: {{USE_CASE_2}}
{{COMPONENT_VAR}}.{{METHOD_2}}({{PARAMS}});
```

---

### {{COMPONENT_NAME_2}}

**用途**:
- {{USE_CASE_1}}
- {{USE_CASE_2}}

**队列/Topic 定义**:

| 名称 | 类型 | Exchange | Routing Key | 用途 |
|------|------|----------|-------------|------|
| {{QUEUE_NAME}} | Queue | {{EXCHANGE}} | {{ROUTING_KEY}} | {{PURPOSE}} |

**生产者方法**:
```java
public void send{{MESSAGE_TYPE}}({{MESSAGE_TYPE}} message) {
    rabbitTemplate.convertAndSend(
        "{{EXCHANGE}}",
        "{{ROUTING_KEY}}",
        message
    );
}
```

**消费者方法**:
```java
@RabbitListener(queues = "{{QUEUE_NAME}}")
public void handle{{MESSAGE_TYPE}}(
    @Payload {{MESSAGE_TYPE}} message,
    @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag,
    Channel channel
) throws IOException
```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | message | {{MESSAGE_TYPE}} | @Payload | 消息体 |
  | deliveryTag | long | @Header | 消息标签 |
  | channel | Channel | - | MQ 通道 |
- **说明**: 处理消息

**配置**:
```yaml
spring:
  rabbitmq:
    host: {{HOST}}
    port: {{PORT}}
    username: {{USERNAME}}
    password: {{PASSWORD}}
    virtual-host: {{VHOST}}
```

---

## 🔗 依赖版本

```xml
<dependency>
    <groupId>{{GROUP_ID}}</groupId>
    <artifactId>{{ARTIFACT_ID}}</artifactId>
    <version>{{VERSION}}</version>
</dependency>
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
