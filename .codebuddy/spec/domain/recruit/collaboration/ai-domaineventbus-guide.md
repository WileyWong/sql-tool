# DomainEventBus AI 开发指导文档

## 概述

`DomainEventBus` 是招聘协作系统中的核心事件总线组件，用于实现领域事件的发布、订阅和处理。本文档为 AI 提供开发指导，涵盖架构设计、代码实现、测试场景和常见问题。

---

## 目录
1. [架构与设计](#架构与设计)
2. [核心类结构](#核心类结构)
3. [事件生命周期](#事件生命周期)
4. [实现约束](#实现约束)
5. [代码开发指南](#代码开发指南)
6. [测试场景](#测试场景)
7. [常见错误及修复](#常见错误及修复)
8. [性能与可靠性](#性能与可靠性)

---

## 架构与设计

### 设计原则

- **异步消息驱动**：采用发布-订阅模式，发送方无需等待消费方处理完成
- **可靠投递**：所有事件和日志在发送/处理前都会落库存储
- **多队列支持**：支持 LocalSync、LocalAsync、TDMQ、Platform、CloudEvent 等多种消息队列
- **故障隔离**：事件处理失败不影响其他订阅者
- **事件重放**：支持失败事件的重新发布/订阅

### 整体流程

```
┌─────────────────┐
│  发布方应用    │
└────────┬────────┘
         │ 1. publish() / publishSync()
         ▼
┌──────────────────────────────┐
│  DomainEventBus.saveEvent()  │ 存储发送事件(Created)
└────────┬─────────────────────┘
         │ 2. 落库成功
         ▼
┌──────────────────────────────┐
│  DomainEventQueue.publish()  │ 发送到消息队列
└────────┬─────────────────────┘
         │ 3. 发送成功
         ▼
┌──────────────────────────────┐
│ updateEvent(Sent)            │ 更新事件为已发送
└──────────────────────────────┘
         │
         │ 消息中间件传输
         ▼
┌──────────────────────────────┐
│   订阅方应用接收事件        │
└────────┬─────────────────────┘
         │ 4. onEvent()
         ▼
┌──────────────────────────────┐
│  DomainEventBus.saveEvent()  │ 存储接收事件(Received)
└────────┬─────────────────────┘
         │ 5. 落库成功
         ▼
┌──────────────────────────────┐
│  subscriber.accept(event)    │ 执行业务逻辑处理
└────────┬─────────────────────┘
         │ 6. 处理完成
         ▼
┌──────────────────────────────┐
│ updateEvent(Success/Failed)  │ 更新事件处理状态
└──────────────────────────────┘
```

---

## 核心类结构

### 1. DomainEventBus（具体实现）

**功能**：封装远程 API 调用的事件总线实现

**关键方法**：

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|--------|------|
| `publishRemote()` | `eventType`, `event` | void | **异步**发布事件到远程API |
| `publishRemoteSync()` | `eventType`, `event` | void | **同步**发布事件到远程API |
| `saveEvent()` | `event` | boolean | 调用远程API保存事件 |
| `updateEvent()` | `event` | void | 调用远程API更新事件 |
| `getEventList()` | `status`, `lastCreateTime` | List | 调用远程API获取事件列表 |
| `reportLog()` | `data` | void | 调用远程API上报日志 |

**示例代码**：

```java
@Autowired
private DomainEventBus eventBus;

public void createResume(ResumeData data) {
    Resume resume = resumeService.save(data);
    
    // 发送异步事件
    ResumeCreatedEventData eventData = new ResumeCreatedEventData();
    eventData.setResumeId(resume.getId());
    eventData.setRecruiterId(resume.getRecruiterId());
    eventBus.publish(ResumeEvent.ResumeCreated, eventData);
}
```

### 2. BaseDomainEventBus（抽象基类）

**功能**：核心事件处理引擎，定义事件流程和生命周期

**关键方法**：

| 方法名 | 类型 | 说明 |
|-------|------|------|
| `publish()` | 异步 | 基础异步发布，使用事件定义的默认队列 |
| `publishSync()` | 同步 | 基础同步发布，阻塞等待队列响应 |
| `publish(eventType, event, queueType, params)` | 异步 | 指定队列类型和参数的发布 |
| `subscribe()` | 订阅 | 订阅事件，接收时自动反序列化 |
| `unSubscriber()` | 订阅 | 取消订阅 |
| `rePublish()` | 重放 | 重新发布失败事件（最近5分钟的 Created 状态） |
| `rePublish(uuid)` | 重放 | 重新发布指定事件 |
| `reSubscribe()` | 重放 | 重新处理失败事件（最近10分钟的 Received 状态） |
| `reSubscribe(uuid)` | 重放 | 重新处理指定事件 |

**受保护的抽象方法**（子类必须实现）：

```java
// 事件存储
protected abstract boolean saveEvent(DomainEventPODef event);
protected abstract void updateEvent(DomainEventPODef event);

// 事件查询
protected abstract List<DomainEventPODef> getEventList(String status, LocalDateTime lastCreateTime);
protected abstract DomainEventPODef getEvent(String id);

// 日志上报
protected abstract void reportLog(EventLog log);

// 队列配置获取
protected abstract QueueConfigDTO getQueueConfig(String queueId);
```

### 3. BaseEventType<T>（事件类型定义）

**功能**：事件的元数据和类型定义

**构造方法**：

```java
// 最简形式：使用默认队列和Topic
new BaseEventType<>(String eventId, Class<T> eventClass)

// 自定义Topic
new BaseEventType<>(String eventId, Class<T> eventClass, String topic)

// 完整定义
new BaseEventType<>(String eventId, Class<T> eventClass, String topic, 
                    DomainEventQueueType type, String queueId)

// 云事件平台专用
BaseEventType.ofCloudEvent(String eventId)
```

**默认值**：
- `topic`：`domain-event-queue`
- `queue`：`TDMQ`（DomainEventQueueType.TDMQ）
- `queueId`：`null`（使用默认队列配置）

### 4. DomainEvent（事件实例）

**功能**：表示一个具体的事件实例

**关键属性**：

```java
String id;                    // 事件唯一ID(UUID)
String type;                  // 事件类型ID
String sourceId;              // 来源事件ID(订阅事件时设置)
String topic;                 // 消息队列Topic
String handler;               // 处理者(发布方应用名/订阅者名)
String queueType;             // 队列类型(LocalSync/LocalAsync/TDMQ/Platform/CloudEvent)
String queueConfig;           // 队列参数(JSON格式)
String payload;               // 事件数据(JSON格式)
DomainEventStatus status;     // 事件状态(Created/Sent/Received/Success)
String statusText;            // 状态详情(异常信息)
LocalDateTime createTime;     // 创建时间
```

**事件状态机**：

```
发布方:  Created -> Sent -> Success
订阅方:  Received -> Success / Failed
```

### 5. EventLog（事件日志）

**功能**：记录事件处理的关键节点

**日志类型**：

| 类型 | 说明 |
|------|------|
| `EventPublishSuccess` | 事件发布成功 |
| `EventPublishFail` | 事件发布失败 |
| `EventSubscribeSuccess` | 事件订阅处理成功 |
| `EventSubscribeFail` | 事件订阅处理失败 |
| `EventRegisterSuccess` | 订阅者注册成功 |
| `EventRegisterFail` | 订阅者注册失败 |
| `EventUnRegister` | 订阅者注销 |

---

## 事件生命周期

### 1. 发布事件的生命周期

```
发布阶段：

1. publish(eventType, event) 
   ↓
2. 创建 DomainEvent 实例，初始化事件数据
   ↓
3. saveEvent() - 保存事件(status=Created)
   ↓
4. checkQueue() - 检查队列配置是否存在，若不存在则从远程拉取
   ↓
5. queue.publish() - 发送事件到消息队列
   ↓
6. 发布成功
   ├─ updateEvent(status=Sent)
   └─ reportLog(EventPublishSuccess)
   ↓
7. 发布失败
   ├─ updateEvent(status=Sent, statusText=exception)
   └─ reportLog(EventPublishFail)
```

### 2. 订阅事件的生命周期

```
订阅注册阶段：

1. subscribe(subscriberName, eventType, subscriber)
   ↓
2. 将订阅者加入到 subscribers 列表
   ↓
3. 获取对应队列并订阅 topic
   ↓
4. reportLog(EventRegisterSuccess)

事件处理阶段（接收到事件）：

1. onEvent(domainEvent)
   ↓
2. 查找匹配的订阅者(eventTypeId + subscriberName)
   ↓
3. saveEvent(status=Received) - 记录接收事件
   ↓
4. 反序列化事件数据
   ├─ 若 subscriber.getTClass() 为 String.class，直接传入 JSON
   └─ 否则，JsonUtil.fromJsonToObject() 反序列化
   ↓
5. subscriber.accept(eventData) - 执行业务逻辑
   ↓
6. 处理成功
   ├─ status = Success
   └─ reportLog(EventSubscribeSuccess)
   ↓
7. 处理失败
   ├─ status = Success(保留 statusText)
   └─ reportLog(EventSubscribeFail)
   ↓
8. updateEvent() - 更新事件状态
```

### 3. 事件重放流程

```
重新发布(针对 Created 状态的事件)：

1. rePublish() / rePublish(uuid)
   ↓
2. 获取事件对应的 DomainEvent
   ↓
3. 使用默认队列重新发送
   ├─ 更新 queueType 为 DefaultQueueType(TDMQ)
   └─ 添加 queueId 参数
   ↓
4. queue.publish(domainEvent, params)
   ↓
5. reportLog(EventPublishSuccess/EventPublishFail)
   ↓
6. updateEvent(status=Sent 或保留失败状态)

重新处理(针对 Received 状态的事件)：

1. reSubscribe() / reSubscribe(uuid)
   ↓
2. 获取事件和对应的订阅者
   ↓
3. 订阅者直接处理事件数据
   ├─ JsonUtil.fromJsonToObject(event.payload, tClass)
   └─ subscriber.accept(eventData)
   ↓
4. 处理成功 -> status=Success
   处理失败 -> reportLog(EventSubscribeFail)
   ↓
5. updateEvent(status)
```

---

## 实现约束

### 1. 事件数据类设计约束

**必须满足的条件**：

```java
// ✅ 正确示例
@Data
@NoArgsConstructor
public class ResumeCreatedEventData {
    private Long resumeId;
    private Long recruiterId;
    private String content;
    // ... fields
}

// ❌ 错误示例1：缺少默认构造函数
@Data
@AllArgsConstructor
public class ResumeCreatedEventData {  // 会导致反序列化为 null
    private Long resumeId;
}

// ❌ 错误示例2：使用 Lombok 的 @AllArgsConstructor 没配 @NoArgsConstructor
@Data
@AllArgsConstructor
public class ResumeCreatedEventData {  // 反序列化失败
    private Long resumeId;
}
```

**原因**：
- 事件总线使用 JSON 序列化/反序列化事件数据
- 反序列化需要调用无参构造函数创建对象
- 若只有 `@AllArgsConstructor`，默认构造函数会被覆盖

### 2. 队列类型的选择

| 队列类型 | 适用场景 | 特点 | 是否需要远程服务 |
|---------|---------|------|------------------|
| `LocalSync` | 本地同步处理 | 阻塞式调用，顺序执行，观察者模式 | ❌ |
| `LocalAsync` | 本地异步通知 | 基于 Spring 事件系统，非阻塞 | ❌ |
| `TDMQ` | 跨服务事件(推荐) | 分布式消息队列，可靠投递，高吞吐 | ✅ |
| `Platform` | 中台事件平台 | 基于可靠事件服务，HTTP 接口 | ✅ |
| `CloudEvent` | 云事件平台 | 中台事件平台专用 | ✅ |

**选择建议**：

```java
// 1. 同服务内事件通知(不涉及远程服务)
BaseEventType<QuestionEvent> Q_CREATED = 
    new BaseEventType<>("question-create", QuestionEvent.class,
                        "domain-event-queue", DomainEventQueueType.LocalAsync, "default");

// 2. 跨服务可靠事件投递(推荐)
BaseEventType<ResumeCreatedEventData> RESUME_CREATED = 
    new BaseEventType<>("resume-create", ResumeCreatedEventData.class);  // 默认使用 TDMQ

// 3. 中台事件平台
BaseEventType<MyEvent> MY_EVENT = BaseEventType.ofCloudEvent("my-event");
```

### 3. 订阅者命名约束

```java
// 订阅者名称应该唯一标识一个处理器
domainEventBus.subscribe(
    ResumeSubscriber.class.getName(),  // 建议使用完整类名
    ResumeEvent.ResumeCreated,
    data -> {
        // 处理逻辑
    }
);

// 取消订阅时使用相同的名称
domainEventBus.unSubscriber(ResumeSubscriber.class.getName());
```

### 4. 配置约束

**必须配置的项**（远程事件发布/订阅）：

```yml
domain-event:
  # 服务地址(必须)
  service-api: http://dev-ntsgw.woa.com/api/esb/recruit-domain-event-service
  
  # 默认队列ID(如果使用 TDMQ 队列则必须)
  default-pulsar-id: default  # 开发环境用 dev
```

**可选配置**（本地队列无需配置）：

```yml
domain-event:
  pulsar:
    config:
      - id: default
        default-topic: domain-event-queue
        namespace: xxxx
        service-url: http://xxxx:8080
        token-auth-value: xxxx
        tenant: xxxx
```

---

## 代码开发指南

### 1. 定义事件类型

**步骤**：

```java
// 1. 在协作模块中定义事件接口
// 文件：com.tencent.hr.recruit.collaboration.api.resume.event.ResumeEvent
public interface ResumeEvent {
    
    // 2. 定义事件类型常量(全局共享)
    BaseEventType<ResumeCreatedEventData> ResumeCreated =
        new BaseEventType<>("resume-create", ResumeCreatedEventData.class);
    
    BaseEventType<ResumeUpdatedEventData> ResumeUpdated =
        new BaseEventType<>("resume-update", ResumeUpdatedEventData.class);
}

// 3. 定义事件数据结构
@Data
@NoArgsConstructor
public class ResumeCreatedEventData {
    private Long resumeId;
    private Long recruiterId;
    private String resumeContent;
}

@Data
@NoArgsConstructor
public class ResumeUpdatedEventData {
    private Long resumeId;
    private LocalDateTime updatedAt;
}
```

### 2. 发布事件

**场景1：异步发布（推荐）**

```java
@Service
public class ResumeApplicationService {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    public void createResume(CreateResumeCommand cmd) {
        // 1. 保存业务数据
        Resume resume = new Resume();
        resume.setRecruiterId(cmd.getRecruiterId());
        resume.setContent(cmd.getContent());
        resumeRepository.save(resume);
        
        // 2. 发送异步事件
        ResumeCreatedEventData eventData = new ResumeCreatedEventData();
        eventData.setResumeId(resume.getId());
        eventData.setRecruiterId(cmd.getRecruiterId());
        eventData.setResumeContent(cmd.getContent());
        
        eventBus.publish(ResumeEvent.ResumeCreated, eventData);
        // 方法立即返回，事件通过异步线程发送
    }
}
```

**场景2：同步发布（需要等待结果）**

```java
public void createResumeSync(CreateResumeCommand cmd) {
    Resume resume = resumeRepository.save(new Resume(...));
    
    ResumeCreatedEventData eventData = new ResumeCreatedEventData();
    eventData.setResumeId(resume.getId());
    // ...
    
    eventBus.publishSync(ResumeEvent.ResumeCreated, eventData);
    // 阻塞等待本地订阅处理完成
}
```

**场景3：使用指定队列类型发布**

```java
public void createResumeLocal(CreateResumeCommand cmd) {
    Resume resume = resumeRepository.save(new Resume(...));
    
    ResumeCreatedEventData eventData = new ResumeCreatedEventData();
    eventData.setResumeId(resume.getId());
    
    // 使用本地异步队列，不依赖网络/消息中间件
    Map<String, String> params = new HashMap<>();
    eventBus.publish(ResumeEvent.ResumeCreated, eventData, 
                     DomainEventQueueType.LocalAsync.toString(), params);
}
```

### 3. 订阅事件

**标准订阅方式**：

```java
@Slf4j
@Service
public class ResumeSubscriber {
    
    @Autowired
    private DomainEventBus domainEventBus;
    
    @Autowired
    private ResumeNotificationService notificationService;
    
    @PostConstruct
    public void init() {
        // 订阅简历创建事件
        domainEventBus.subscribe(
            ResumeSubscriber.class.getName(),
            ResumeEvent.ResumeCreated,
            this::handleResumeCreated
        );
        
        // 订阅简历更新事件
        domainEventBus.subscribe(
            ResumeSubscriber.class.getName(),
            ResumeEvent.ResumeUpdated,
            this::handleResumeUpdated
        );
    }
    
    // 事件处理器1
    private void handleResumeCreated(ResumeCreatedEventData event) {
        log.info("处理简历创建事件: resumeId={}", event.getResumeId());
        try {
            // 业务处理逻辑
            notificationService.sendCreatedNotification(event.getRecruiterId());
        } catch (Exception e) {
            // 异常会被自动记录，事件状态更新为 Success 但保留异常信息
            log.error("处理简历创建事件失败", e);
            throw e;  // 异常会被框架捕获并记录
        }
    }
    
    private void handleResumeUpdated(ResumeUpdatedEventData event) {
        log.info("处理简历更新事件: resumeId={}", event.getResumeId());
        notificationService.sendUpdatedNotification(event.getResumeId());
    }
    
    @PreDestroy
    public void destroy() {
        domainEventBus.unSubscriber(ResumeSubscriber.class.getName());
    }
}
```

**高级订阅：自定义队列参数**

```java
@PostConstruct
public void initAdvanced() {
    // 为自定义队列配置指定订阅参数
    Map<String, String> params = new HashMap<>();
    params.put(BaseDomainEventBus.Config.QueueID, "custom-queue");
    // params.put(PulsarEventQueue.Config.SubscriptionName, "custom-sub");
    
    domainEventBus.subscribe(
        ResumeSubscriber.class.getName(),
        ResumeEvent.ResumeCreated,
        this::handleResumeCreated,
        params
    );
}
```

### 4. 事件重放

**重新发布失败的发送事件**：

```java
@Service
public class EventRecoveryService {
    
    @Autowired
    private DomainEventBus domainEventBus;
    
    /**
     * 定时任务：每小时检查一次失败事件并重新发送
     */
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void recoveryFailedPublishing() {
        try {
            // 重新发送最近5分钟内未成功的事件
            domainEventBus.rePublish();
        } catch (Exception e) {
            log.error("重新发布失败事件异常", e);
        }
    }
    
    /**
     * 手动重新发布指定事件
     */
    public void rePublishEvent(String eventId) {
        domainEventBus.rePublish(eventId);
    }
}
```

**重新处理失败的订阅事件**：

```java
@Service
public class EventRecoveryService {
    
    @Autowired
    private DomainEventBus domainEventBus;
    
    /**
     * 定时任务：每小时检查一次失败的处理事件并重新处理
     */
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void recoveryFailedSubscribing() {
        try {
            // 重新处理最近10分钟内未成功处理的事件
            domainEventBus.reSubscribe();
        } catch (Exception e) {
            log.error("重新处理失败事件异常", e);
        }
    }
    
    /**
     * 手动重新处理指定事件
     */
    public void reSubscribeEvent(String eventId) {
        domainEventBus.reSubscribe(eventId);
    }
}
```

### 5. 自定义 EventBus 实现

**场景**：只使用本地事件，无需远程存储

```java
@Slf4j
@Service
public class LocalDomainEventBus extends BaseDomainEventBus {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventLogRepository logRepository;
    
    @Autowired
    public LocalDomainEventBus(DomainEventConfig config, 
                               List<DomainEventQueue> queueProvider) {
        super(config, queueProvider);
    }
    
    @Override
    protected boolean saveEvent(DomainEventPODef event) {
        try {
            eventRepository.insert(event);
            return true;
        } catch (Exception e) {
            log.error("保存事件失败", e);
            return true;  // 返回 true 允许继续，false 停止处理
        }
    }
    
    @Override
    protected void updateEvent(DomainEventPODef event) {
        try {
            eventRepository.updateById(event);
        } catch (Exception e) {
            log.error("更新事件失败", e);
        }
    }
    
    @Override
    protected List<DomainEventPODef> getEventList(String status, LocalDateTime lastCreateTime) {
        return eventRepository.selectList(
            new QueryWrapper<DomainEventPO>()
                .eq("status", status)
                .lt("create_time", lastCreateTime)
        );
    }
    
    @Override
    protected DomainEventPODef getEvent(String id) {
        return eventRepository.selectById(id);
    }
    
    @Override
    protected void reportLog(EventLog log) {
        try {
            logRepository.insert(log);
        } catch (Exception e) {
            log.error("上报日志失败", e);
        }
    }
    
    @Override
    protected QueueConfigDTO getQueueConfig(String queueId) {
        // 本地实现不需要远程队列配置
        return null;
    }
}
```

---

## 测试场景

### 1. 事件发布测试

```java
@SpringBootTest
public class ResumeEventPublishTest {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Test
    public void testPublishEvent() throws InterruptedException {
        // Arrange
        ResumeCreatedEventData eventData = new ResumeCreatedEventData();
        eventData.setResumeId(1L);
        eventData.setRecruiterId(100L);
        eventData.setResumeContent("Test Resume");
        
        // Act
        eventBus.publish(ResumeEvent.ResumeCreated, eventData);
        
        // Assert - 给异步事件留出处理时间
        Thread.sleep(2000);
        
        List<DomainEventPO> events = eventRepository.selectList(
            new QueryWrapper<DomainEventPO>()
                .eq("type", "resume-create")
        );
        
        assertThat(events).isNotEmpty();
        assertThat(events.get(0).getStatus()).isEqualTo(DomainEventStatus.Sent.toString());
    }
    
    @Test
    public void testPublishEventSync() {
        // Arrange
        ResumeCreatedEventData eventData = new ResumeCreatedEventData();
        eventData.setResumeId(2L);
        eventData.setRecruiterId(101L);
        
        // Act & Assert
        eventBus.publishSync(ResumeEvent.ResumeCreated, eventData);
        
        // 同步方式下，事件已发送，可直接查询
        List<DomainEventPO> events = eventRepository.selectList(
            new QueryWrapper<DomainEventPO>()
                .eq("type", "resume-create")
        );
        
        assertThat(events).isNotEmpty();
    }
}
```

### 2. 事件订阅测试

```java
@SpringBootTest
public class ResumeEventSubscribeTest {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private ResumeNotificationService notificationService;
    
    @MockBean
    private ResumeNotificationService mockNotificationService;
    
    @Test
    public void testSubscribeEvent() throws InterruptedException {
        // Arrange
        ResumeCreatedEventData eventData = new ResumeCreatedEventData();
        eventData.setResumeId(1L);
        eventData.setRecruiterId(100L);
        
        eventBus.subscribe(
            "TestSubscriber",
            ResumeEvent.ResumeCreated,
            event -> mockNotificationService.sendCreatedNotification(event.getRecruiterId())
        );
        
        // Act
        eventBus.publish(ResumeEvent.ResumeCreated, eventData);
        
        // Assert - 等待异步处理
        Thread.sleep(2000);
        
        verify(mockNotificationService, times(1))
            .sendCreatedNotification(100L);
    }
    
    @Test
    public void testSubscribeEventProcessingFailure() throws InterruptedException {
        // Arrange
        ResumeCreatedEventData eventData = new ResumeCreatedEventData();
        eventData.setResumeId(1L);
        
        eventBus.subscribe(
            "FailingSubscriber",
            ResumeEvent.ResumeCreated,
            event -> {
                throw new RuntimeException("Processing failed");
            }
        );
        
        // Act
        eventBus.publish(ResumeEvent.ResumeCreated, eventData);
        
        // Assert - 异常被框架捕获，事件仍被标记为 Success
        Thread.sleep(2000);
        
        // 检查日志中是否记录了失败
        // 检查事件状态是否包含异常信息
    }
}
```

### 3. 队列类型集成测试

```java
@SpringBootTest
public class EventQueueTypeTest {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Test
    public void testLocalSyncQueue() {
        // 同步执行，方法返回后事件处理已完成
        List<ResumeCreatedEventData> receivedEvents = new ArrayList<>();
        
        eventBus.subscribe(
            "LocalSyncSubscriber",
            ResumeEvent.ResumeCreated,
            receivedEvents::add
        );
        
        ResumeCreatedEventData data = new ResumeCreatedEventData();
        data.setResumeId(1L);
        
        eventBus.publishSync(ResumeEvent.ResumeCreated, data);
        
        assertThat(receivedEvents).hasSize(1);
    }
    
    @Test
    public void testLocalAsyncQueue() throws InterruptedException {
        // 异步执行，需要等待
        AtomicInteger counter = new AtomicInteger(0);
        
        eventBus.subscribe(
            "LocalAsyncSubscriber",
            ResumeEvent.ResumeCreated,
            event -> counter.incrementAndGet()
        );
        
        ResumeCreatedEventData data = new ResumeCreatedEventData();
        eventBus.publish(ResumeEvent.ResumeCreated, data);
        
        Thread.sleep(1000);
        assertThat(counter.get()).isEqualTo(1);
    }
}
```

---

## 常见错误及修复

### 错误1：事件数据反序列化为 null

**症状**：订阅者接收到的事件数据字段为 null

**原因**：事件数据类缺少默认构造函数

**修复**：

```java
// ❌ 错误
@Data
@AllArgsConstructor
public class ResumeCreatedEventData {
    private Long resumeId;
}

// ✅ 正确
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeCreatedEventData {
    private Long resumeId;
}

// 或使用 @Data 和 @NoArgsConstructor
@Data
@NoArgsConstructor
public class ResumeCreatedEventData {
    private Long resumeId;
}
```

### 错误2：订阅方法未被调用

**症状**：已发布事件，但订阅处理器未执行

**原因1**：事件未成功发送到消息队列

```java
// 检查：
// 1. 事件是否落库（saveEvent 返回 true）
// 2. queue.publish() 是否成功
// 3. 查看日志中 [EventPublishSuccess] 或 [EventPublishFail]
```

**原因2**：订阅者未注册或注册失败

```java
// 检查：
// 1. 使用 @PostConstruct 注解确保订阅在容器初始化后执行
// 2. 订阅者名称是否与事件类型ID匹配
// 3. 查看日志中 [EventRegisterSuccess] 或 [EventRegisterFail]

@PostConstruct
public void init() {
    domainEventBus.subscribe(...);
}
```

**原因3**：事件类型ID不匹配

```java
// 检查：
// onEvent() 方法中的过滤逻辑
// Objects.equals(it.getEventTypeId(), event.getType())
// 确保发布和订阅的事件类型ID一致

BaseEventType<ResumeCreatedEventData> RESUME_CREATED =
    new BaseEventType<>("resume-create", ResumeCreatedEventData.class);
// 需要确保 eventId = "resume-create"
```

### 错误3：无法连接 TDMQ 队列

**症状**：
- 启动日志：`AssertionError: 无法获取默认队列配置`
- 或发布事件时超时

**原因**：
- 配置缺失或错误
- 网络连接问题
- 默认队列 ID 不存在

**修复**：

```yml
# application.yml
domain-event:
  service-api: http://dev-ntsgw.woa.com/api/esb/recruit-domain-event-service
  default-pulsar-id: default  # 开发环境必须配置，测试环境可选
  
  # 可选：本地配置队列
  pulsar:
    config:
      - id: default
        default-topic: domain-event-queue
        namespace: xxx
        service-url: http://xxx:8080
        token-auth-value: xxx
        tenant: xxx
```

**测试环境特殊说明**：

```
- 服务启动时需要先连接测试环境的 TDMQ
- 如提示 "Timed out" 或无法连接，联系运维将服务绑定到广州节点
- 开发环境无法连接队列，需配置 default-pulsar-id: dev 使用公网临时队列
```

### 错误4：事件处理异常导致流程中断

**症状**：某个订阅者抛出异常，其他订阅者未执行

**原因**：订阅者异常被捕获，但对其他订阅者无影响（框架已隔离）

**实际行为**：

```java
// BaseDomainEventBus.onEvent() 中的处理
try {
    subscriber.getHandler().accept(...);  // 异常在此捕获
    subscribeEvent.setStatus(DomainEventStatus.Success);
} catch (Exception e) {
    subscribeEvent.setStatusText("处理事件失败: " + e);
    reportLogSafe(EventLog.create(EventLogType.EventSubscribeFail, ...));
}
// 异常不会向上抛出，其他订阅者继续处理
```

**修复**：确保订阅者异常处理健壮

```java
private void handleResumeCreated(ResumeCreatedEventData event) {
    try {
        // 业务处理
        notificationService.sendNotification(event.getRecruiterId());
    } catch (Exception e) {
        // 日志记录异常
        log.error("处理简历创建事件失败: resumeId={}", event.getResumeId(), e);
        // 异常会被框架再次捕获，不需要重新抛出
        throw new RuntimeException("处理失败", e);
    }
}
```

### 错误5：开发/测试环境事件互不可见

**症状**：
- 开发环境发送的事件，测试环境服务无法收到
- 测试环境发送的事件，开发环境服务无法收到

**原因**：这是设计行为，不是错误

**说明**：

```
- 开发和测试环境的 TDMQ 队列数据不互通
- 但管理数据互通（可在后台查看所有环境的事件）
- 后台触发的事件重放仅测试环境的服务会收到
```

**处理方案**：

```
1. 本地开发：使用 LocalAsync / LocalSync 队列
2. 集成测试：统一使用测试环境
3. 跨环境测试：使用后台管理界面手动触发
```

---

## 性能与可靠性

### 1. 异步发送与 @Async

```java
// ✅ 使用异步发送（推荐）
@Autowired
private DomainEventBus eventBus;

public void createResume(CreateResumeCommand cmd) {
    // 业务逻辑...
    eventBus.publish(ResumeEvent.ResumeCreated, eventData);
    // 立即返回，事件通过线程池异步发送
    return;
}

// ❌ 避免同步发送（会阻塞主线程）
public void createResume(CreateResumeCommand cmd) {
    // 业务逻辑...
    eventBus.publishSync(ResumeEvent.ResumeCreated, eventData);
    // 等待队列响应，可能导致响应延迟
}
```

**@Async 机制**：

```java
@Async
public <E> void publish(BaseEventType<E> eventType, E event) {
    _publish(eventType, event, eventType.getQueue(), new HashMap<>());
}
```

- 需在启动类配置 `@EnableAsync`
- 使用 Spring 的 ThreadPoolExecutor 线程池
- 无需手动管理线程生命周期

### 2. 事件落库与故障恢复

```
可靠性保证机制：

1. 事件发送前落库(status=Created)
   - 如果发送失败，事件保留 Created 状态
   - 可通过 rePublish() 定时重新发送
   
2. 事件发送后更新状态(status=Sent)
   - 标记为已发送给消息队列
   
3. 订阅方收到事件后立即落库(status=Received)
   - 确保即使处理失败，事件也不丢失
   
4. 处理完成后更新状态(status=Success)
   - 标记为已处理

故障恢复流程：

network fail → save locally → restore when network recovers
queue fail    → save locally → rePublish when queue available
process fail  → status=Received → reSubscribe to retry
```

### 3. 本地日志与备份

```java
// 当远程存储不可用时，框架会：
// 1. 保存失败记录到内存列表(上限1000条)
// 2. 写入本地文件 ./logs/event_log_*.txt
// 3. 每5分钟定时补偿上报

// 定时补偿逻辑(BaseDomainEventBus.processLocalLog)：
@Scheduled(fixedRate = 5 * 60 * 1000)  // 每5分钟执行一次
public void processLocalLog() {
    // 重试策略：1, 2, 4, 8, 16, 32 分钟
    // 超过32分钟则停止重试
}

// 使用场景：
// 1. 远程存储超时
// 2. 网络连接中断
// 3. 服务启动前未完全初始化
```

### 4. 队列初始化与锁机制

```java
// BaseDomainEventBus 使用分布式锁确保初始化顺序
private static final ReentrantLock firstEventLock = new ReentrantLock();
private static final Condition condition = firstEventLock.newCondition();

// 启动流程：
// 1. 异步锁住事件处理
// 2. 注册所有订阅者
// 3. 定时任务检查是否初始化完成(1秒后)
// 4. 信号通知可以开始处理事件
// 5. 首次事件处理时等待锁释放(超时30秒)

// 目的：确保所有订阅者注册完成后再处理事件
```

### 5. 性能优化建议

| 优化项 | 方案 | 说明 |
|-------|------|------|
| 异步处理 | 使用 `publish()` 而非 `publishSync()` | 避免阻塞主线程 |
| 批量发送 | 收集多个事件后批量发送 | 减少网络开销 |
| 队列选择 | LocalAsync 用于本地通知 | 不依赖网络，性能最高 |
| 异常处理 | 订阅者中 catch 异常 | 防止某个异常影响其他订阅者 |
| 日志控制 | 降低 DEBUG 日志级别 | 生产环境减少日志 IO |

---

## 部署与运维

### 启动配置示例

```yaml
# application.yml
spring:
  application:
    name: recruit-collaboration-service
    
domain-event:
  # 生产环境配置
  service-api: http://ntsgw.woa.com/api/esb/recruit-domain-event-service
  default-pulsar-id: default
  
  # 可选：TDMQ 队列配置(生产环境通常在线上预配置)
  pulsar:
    config:
      - id: default
        default-topic: domain-event-queue
        namespace: recruit-ns
        service-url: http://pulsar-xxx.tdmq.ap-gz.public.tencenttdmq.com:8080
        token-auth-value: ${PULSAR_TOKEN}
        tenant: pulsar-xxx
```

### 事件管理后台

```
生产环境：http://zhaopin.woa.com/support/task/domainEventManage
测试环境：http://test.zhaopin.woa.com/support/task/domainEventManage

功能：
- 查看所有发送和接收的事件
- 搜索特定事件(按事件类型、服务、时间等)
- 手动触发事件重新发布/处理
- 查看事件处理日志
- 管理事件发送/订阅规则(停用/启用特定关系)
```

### 健康检查

```java
@RestController
@RequestMapping("/health/event")
public class EventHealthCheck {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private EventRepository eventRepository;
    
    @GetMapping("/status")
    public Map<String, Object> status() {
        Map<String, Object> result = new HashMap<>();
        
        // 检查最近事件处理情况
        List<DomainEventPO> recentEvents = eventRepository.selectList(
            new QueryWrapper<DomainEventPO>()
                .ge("create_time", LocalDateTime.now().minusMinutes(10))
                .orderByDesc("create_time")
                .last("limit 100")
        );
        
        long failedCount = recentEvents.stream()
            .filter(e -> !DomainEventStatus.Success.toString().equals(e.getStatus()))
            .count();
        
        result.put("total_events", recentEvents.size());
        result.put("failed_events", failedCount);
        result.put("health", failedCount < 5 ? "UP" : "DEGRADED");
        
        return result;
    }
}
```

---

## 扩展与定制

### 自定义事件队列实现

```java
@Component
public class CustomEventQueue extends DomainEventQueue {
    
    @Override
    public String getType() {
        return "CustomQueue";
    }
    
    @Override
    public void register(Consumer<DomainEvent> handler, Map<String, String> params) {
        // 初始化队列连接
    }
    
    @Override
    public void subscribeTopic(String topic, Consumer<DomainEvent> handler, 
                               Map<String, String> params) {
        // 订阅 topic
    }
    
    @Override
    public void publish(DomainEvent event, Map<String, String> params) {
        // 发送事件到自定义队列
    }
    
    @Override
    public boolean hasQueue(String queueId) {
        return true;
    }
}
```

### 事件拦截器

```java
// 在 BaseDomainEventBus 中重写关键方法
@Service
public class InterceptorDomainEventBus extends BaseDomainEventBus {
    
    @Override
    protected boolean saveEvent(DomainEventPODef event) {
        // 前置拦截
        log.info("Event saving: {}", event.getType());
        
        boolean result = super.saveEvent(event);
        
        // 后置拦截
        if (result) {
            log.info("Event saved successfully: {}", event.getId());
        }
        return result;
    }
}
```

---

## 总结

| 功能模块 | 核心类 | 关键方法 | 使用场景 |
|---------|-------|--------|--------|
| **事件定义** | `BaseEventType<T>` | `new BaseEventType<>()` | 定义事件元数据 |
| **事件发送** | `DomainEventBus` | `publish()` / `publishSync()` | 发送业务事件 |
| **事件接收** | `BaseDomainEventBus` | `subscribe()` | 订阅业务事件 |
| **故障恢复** | `BaseDomainEventBus` | `rePublish()` / `reSubscribe()` | 重新处理失败事件 |
| **日志管理** | `EventLog` | `reportLog()` | 记录处理过程 |
| **队列管理** | `DomainEventQueue` | `publish()` / `register()` | 支持多种消息队列 |

**推荐实践**：

✅ 使用异步发送 (`publish()`)
✅ 事件数据添加 `@NoArgsConstructor`
✅ 在 `@PostConstruct` 中订阅事件
✅ 定期检查失败事件并重新处理
✅ 监控事件管理后台，及时处理失败事件
✅ 使用本地队列进行本服务内事件通知
✅ 使用 TDMQ 进行跨服务可靠事件投递

❌ 避免同步发送导致主线程阻塞
❌ 事件数据类使用 `@AllArgsConstructor` 而不加 `@NoArgsConstructor`
❌ 在订阅处理中执行耗时操作（应异步处理）
❌ 忽视事件处理异常（应记录日志并重试）
❌ 频繁手动重新发送事件（应配置定时重试）
