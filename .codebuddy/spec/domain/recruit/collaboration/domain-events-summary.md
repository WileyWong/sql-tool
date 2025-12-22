# 领域事件汇总

## 概述

本文档汇总招聘协同平台所有领域事件（Domain Events），基于 `BaseEventType` 定义。

---

## 事件列表

### 1. 伯乐推荐事件 (BoleEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| BoleReward | `bole-reward` | BoleRewardEventData | 伯乐入职奖励事件 |
| BoleFlowReward | `bole-flow-reward` | BoleFlowRewardEventData | 伯乐过程奖励事件 |
| SuperBoleReward | `super-bole-reward` | SuperBoleRewardEventData | 超级伯乐奖励事件 |
| BoleHandInOverseaPostEvent | `BoleHandInOverseaPostEvent` | CloudEvent | 伯乐海外岗位推荐事件 |
| BoleTaskCompletion | `BoleTaskCompletionEvent` | TaskCompletionEventData | 伯乐任务完成事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.bole.event.BoleEvent`

---

### 2. 简历事件 (RecruitResumeEvent)

| 事件名称 | 事件 ID | 数据类型 | 队列 | 说明 |
|---------|---------|---------|------|------|
| RECRUITRESUMECHANGE | `recruitresume-change` | RecruitResumeEventData | 默认 | 简历更新事件 |
| RECRUITRESUMEBUSINESSCHANGE | `recruitresume-business-change` | RecruitResumeEventData | `domain-event-queue-resume` | 简历 Business 更新事件 |
| SOCIALRESUMESTATUSCHANGE | `social-resume-status-change` | RecruitResumeEventData | 默认 | 社招简历状态变化（仅 ExtId） |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.resume.event.RecruitResumeEvent`

---

### 3. 岗位事件 (RecruitPostEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| POSTSECRET_MESSAGE | `recruitpost-secret` | PostSecretEventData | 岗位保密变更事件 |
| POSTUPDATE_MESSAGE | `recruitpost-update` | PostRecruitPost | 岗位更新事件 |
| POST_MEDIA_PUBLISH_FAILURE | `recruitpost-media-publish-failure` | PostMediaPublishFailure | 猎聘/脉脉发布失败事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.post.event.RecruitPostEvent`

---

### 4. 面试安排事件 (InterviewArrangementEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| INTERVIEW_ARRANGEMENT_EVENT | `interview-arrangement-event` | InterviewArrangementEventDTO | 面试安排事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.interview.arrangement.event.InterviewArrangementEvent`

**文档参考**:
- [领域事件管理](https://test.zhaopin.woa.com/support/task/domainEventManage)
- [iWiki 文档](https://iwiki.woa.com/p/4006980119)

---

### 5. 社招面试事件 (SocialInterviewEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| SalaryStepSubmit | `interview-salary-step-submit` | InterviewSalaryStepSubmitEventData | 薪资环节提交事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.social.event.SocialInterviewEvent`

---

### 6. 渠道事件

#### 6.1 PostOutChannelEvent

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| UPDATE | `rm-postoutchannel-update` | PostOutChannelUpdateEventData | 岗位外招渠道更新事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.channel.event.PostOutChannelEvent`

#### 6.2 MediaChannelPubEvent

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| MEDIA_CHANNEL_POST_STATUS | `rm-media-channel-status` | MediaChannelStatusData | 媒体岗位状态刷新事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.mediaChannel.event.MediaChannelPubEvent`

---

### 7. 招聘成本事件 (RecruitCostEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| SETTLEMENT_MESSAGE | `recruitcost-fee-settlement` | RecruitCostSettlementEventData | 招聘成本结算事件 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.recruitcost.event.RecruitCostEvent`

---

### 8. 猎头事件 (HeadhunterEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| PostDeputeApproved | `headhunter-post-depute-approve` | HeadhunterPostDeputeApprovedEventData | 猎头岗位委托审批通过 |
| PostSalaryStep | `headhunter-post-salary-step` | HeadhunterPostDeputeApprovedEventData | 猎头岗位薪资环节 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.headhunter.event.HeadhunterEvent`

---

### 9. RMO 事件 (RmoEvent)

| 事件名称 | 事件 ID | 数据类型 | 队列 | 说明 |
|---------|---------|---------|------|------|
| RmoSendCallback | `rmo-send-callback` | RmoSendEventData | `domain-event-queue-rmo` | 消息发送回调 |
| RmoClickCallback | `rmo-click-callback` | RmoClickEventData | `domain-event-queue-rmo` | 消息点击回调 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.rmo.event.RmoEvent`

---

### 10. 活动事件 (ActivityLinkEvent)

| 事件名称 | 事件 ID | 数据类型 | 说明 |
|---------|---------|---------|------|
| ActivityTrace | `activity-trace` | ActivityTraceEventData | 活动链路追踪记录 |

**定义位置**: `com.tencent.hr.recruit.collaboration.api.activity.event.ActivityLinkEvent`

---

## 事件队列说明

### 默认队列
- 队列主题: `BaseEventType.DefaultQueueTopic`
- 队列类型: `BaseEventType.DefaultQueueType`
- 大部分事件使用默认队列

### 自定义队列

| 队列名称 | 使用事件 |
|---------|---------|
| `domain-event-queue-resume` | 简历 Business 更新事件 |
| `domain-event-queue-rmo` | RMO 消息发送/点击回调 |

---

## 事件发布示例

### 同步发布
```java
@Autowired
private DomainEventBus eventBus;

// 同步发布事件
eventBus.publishSync(BoleEvent.BoleReward, eventData);
```

### 异步发布
```java
// 异步发布事件
eventBus.publish(RecruitResumeEvent.RECRUITRESUMECHANGE, eventData);
```

### 远程发布
```java
@Autowired
private DomainEventBus domainEventBus;

// 远程异步发布
domainEventBus.publishRemote(RecruitPostEvent.POSTUPDATE_MESSAGE, eventData);

// 远程同步发布
domainEventBus.publishRemoteSync(BoleEvent.BoleReward, eventData);
```

---

## 事件订阅示例

### 基本订阅
```java
@Component
public class EventSubscriber {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @PostConstruct
    public void init() {
        // 订阅伯乐奖励事件
        eventBus.subscribe("bole-reward-handler", 
            BoleEvent.BoleReward, 
            this::handleBoleReward);
        
        // 订阅简历更新事件
        eventBus.subscribe("resume-update-handler", 
            RecruitResumeEvent.RECRUITRESUMECHANGE, 
            this::handleResumeUpdate);
    }
    
    private void handleBoleReward(BoleRewardEventData event) {
        // 处理伯乐奖励
    }
    
    private void handleResumeUpdate(RecruitResumeEventData event) {
        // 处理简历更新
    }
}
```

### 带参数订阅
```java
Map<String, String> params = new HashMap<>();
params.put("filter", "important");

eventBus.subscribe("filtered-subscriber", 
    BoleEvent.BoleReward, 
    this::handleEvent, 
    params);
```

---

## 事件数据类型说明

### BoleRewardEventData
```java
public class BoleRewardEventData {
    private Integer candidateId;        // 候选人 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private BigDecimal rewardAmount;    // 奖励金额
    // ... 其他字段
}
```

### RecruitResumeEventData
```java
public class RecruitResumeEventData {
    private String extId;               // 简历外部 ID
    private String resumeId;            // 简历 ID
    private Integer eventType;          // 事件类型
    // ... 其他字段
}
```

### PostOutChannelUpdateEventData
```java
public class PostOutChannelUpdateEventData {
    private Integer postId;             // 岗位 ID
    private List<Integer> channelIds;   // 渠道 ID 列表
    private String operationType;       // 操作类型: ADD/CANCEL
    // ... 其他字段
}
```

---

## 使用注意事项

1. **启用领域事件**:
   ```java
   @EnableDomainEvent
   @SpringBootApplication
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

2. **事件幂等性**:
   - 事件可能重复投递
   - 订阅者需要保证幂等性处理

3. **事件顺序**:
   - 同一队列的事件按顺序处理
   - 不同队列的事件无顺序保证

4. **错误处理**:
   - 订阅者异常不会影响发布者
   - 建议在订阅者中加 try-catch

5. **性能考虑**:
   - 异步发布不阻塞主流程
   - 同步发布会等待所有订阅者处理完成
   - 远程发布通过消息队列传递

---

## 相关文档

- [领域事件使用指南](../domain-event-guide.md)
- [DomainEventBus 使用指南](../ai-domaineventbus-guide.md)
- [API 索引](./index.md)

---

**统计信息**:
- 事件接口总数: 11 个
- 事件定义总数: 25+ 个
- 自定义队列数: 2 个

---

[返回 API 索引](./index.md)
