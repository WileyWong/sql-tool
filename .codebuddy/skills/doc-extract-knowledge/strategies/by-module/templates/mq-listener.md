<!--
================== AI 处理指引 ==================

【文档提取规则】
1. MQ 类型：识别 RabbitMQ / Kafka / RocketMQ
2. 监听配置：提取 Queue/Topic、消费组、确认模式
3. 消息类型：识别消息体类型
4. 重试策略：提取重试配置和死信队列
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. RabbitMQ：@RabbitListener + @Payload + Channel
2. Kafka：@KafkaListener + Acknowledgment
3. RocketMQ：@RocketMQMessageListener + RocketMQListener<T>
4. 幂等处理：消息ID去重
5. 异常处理：重试 + 死信队列

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: MQ Listener <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 监听方法总数 | RabbitMQ | Kafka | RocketMQ | 依赖服务数 |
|:------------:|:--------:|:-----:|:--------:|:----------:|
| {{TOTAL_METHOD}} | {{RABBITMQ_COUNT}} | {{KAFKA_COUNT}} | {{ROCKETMQ_COUNT}} | {{SERVICE_COUNT}} |

---

## 📋 监听方法完整列表

> **重要**: 必须列出 MQ Listener 中定义的**全部监听方法**，不可遗漏。

### 监听方法清单

| # | 方法名 | MQ类型 | Queue/Topic | 消费组 | 确认模式 | 说明 |
|:-:|--------|:------:|-------------|--------|:--------:|------|
| 1 | `{{METHOD_NAME_1}}` | {{MQ_TYPE_1}} | `{{QUEUE_1}}` | `{{GROUP_1}}` | {{ACK_1}} | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | {{MQ_TYPE_2}} | `{{QUEUE_2}}` | `{{GROUP_2}}` | {{ACK_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... | ... |

---

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `@RabbitListener(queues = "{{QUEUE_NAME}}") public void {{METHOD_NAME}}(...)` |
| MQ类型 | {{MQ_TYPE}} |
| Queue/Topic | `{{QUEUE_NAME}}` |
| 消费组 | `{{GROUP_ID}}` |
| 确认模式 | {{ACK_MODE}} |
| 重试策略 | {{RETRY_STRATEGY}} |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| message | `{{MESSAGE_TYPE}}` | `@Payload` | 消息体 |
| deliveryTag | `long` | `@Header(AmqpHeaders.DELIVERY_TAG)` | 消息标签 |
| channel | `Channel` | - | RabbitMQ 通道 |

**异常**: `IOException` - 消息确认异常

<!-- 重复以上结构，直到列出全部监听方法 -->

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

---

## 🔙 被依赖方（谁依赖我）

<!-- [可选] MQ Listener 通过消息触发，通常无直接依赖方 -->

| 组件 | 类型 | 说明 |
|------|------|------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLER_DESC}} |

*MQ Listener 通过消息触发，通常无直接依赖方*

**影响分析**: 修改本类主要影响消息处理逻辑

---

## ⚙️ 配置信息

<!-- [可选] 如无特殊配置，可省略此章节 -->

```yaml
{{MQ_CONFIG}}
```

*如无章节内容，此章节可省略*

---

## 🛡️ 异常处理

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 重试策略 | {{RETRY_STRATEGY}} | 重试次数和间隔 |
| 死信队列 | {{DLQ_CONFIG}} | 死信队列配置 |
| 告警配置 | {{ALERT_CONFIG}} | 失败告警 |

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💻 核心处理逻辑

<!-- [可选] 选择标准：复杂的消息处理流程 -->

```java
{{LISTENER_ANNOTATION}}
public void {{METHOD_NAME}}({{MESSAGE_TYPE}} message) {
    // 1. {{STEP_1}}
    // 2. {{STEP_2}}
    // 3. {{STEP_3}}
}
```

*如无章节内容，此章节可省略*

---

## 📝 业务规则

<!-- [可选] 记录关键业务规则和约束 -->

- {{BUSINESS_RULE_1}}
- {{BUSINESS_RULE_2}}
- {{BUSINESS_RULE_3}}

*示例：*
- *消息消费需保证幂等性*
- *消费失败最多重试5次后进入死信队列*
- *消息处理超时时间60秒*

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
