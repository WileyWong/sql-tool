# MQ监听器索引

> **覆盖范围**: `{{BASE_PACKAGE}}.listener`  
> **文件总数**: {{LISTENER_COUNT}}个  
> **代码总行数**: {{LISTENER_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 一、架构概览

### 目录结构
```
listener/
├── OrderMessageListener - 订单消息监听
├── UserMessageListener - 用户消息监听
└── ...
```

### 按MQ类型分类
| MQ类型 | 监听器数量 | 队列数量 |
|--------|-----------|---------|
| RabbitMQ | 2 | 3 |
| Kafka | 0 | 0 |

---

## 二、详细清单

### OrderMessageListener - 订单消息监听

**路径**: `com.company.project.listener.OrderMessageListener`  
**注解**: `@RabbitListener(queues = "order.queue")`

| 方法签名 | 队列 | 消息类型 | 功能说明 |
|---------|------|---------|----------|
| `handleOrderCreated(OrderCreatedMessage msg)` | order.created.queue | OrderCreatedMessage | 处理订单创建消息 |
| `handleOrderCancelled(OrderCancelledMessage msg)` | order.cancelled.queue | OrderCancelledMessage | 处理订单取消消息 |

---

## 📚 相关文档

- [业务逻辑层索引](./business-logic.md)
- [Common公共类索引](./common.md)

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
