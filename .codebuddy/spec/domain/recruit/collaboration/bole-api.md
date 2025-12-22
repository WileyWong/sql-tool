# 伯乐推荐 API (Bole)

## 概述

伯乐推荐模块提供内部员工推荐候选人的奖励机制，包括伯乐奖励、超级伯乐奖励、伯乐过程奖励等。

---

## 领域事件

### BoleEvent

伯乐推荐模块主要通过领域事件实现业务逻辑，没有直接的 FeignClient API。

```java
public interface BoleEvent {
    
    /**
     * 伯乐入职奖励事件
     * 当推荐的候选人成功入职时触发
     */
    BaseEventType<BoleRewardEventData> BoleReward =
        new BaseEventType<>("bole-reward", BoleRewardEventData.class);
    
    /**
     * 伯乐过程奖励事件
     * 在候选人招聘流程的特定环节触发
     */
    BaseEventType<BoleFlowRewardEventData> BoleFlowReward =
        new BaseEventType<>("bole-flow-reward", BoleFlowRewardEventData.class);
    
    /**
     * 超级伯乐奖励事件
     * 针对推荐高级别候选人或多次成功推荐的超级伯乐
     */
    BaseEventType<SuperBoleRewardEventData> SuperBoleReward =
        new BaseEventType<>("super-bole-reward", SuperBoleRewardEventData.class);
    
    /**
     * 伯乐海外岗位推荐事件
     * 推荐候选人到海外岗位时触发
     */
    BaseEventType<CloudEvent> BoleHandInOverseaPostEvent = 
        BaseEventType.ofCloudEvent("BoleHandInOverseaPostEvent");
    
    /**
     * 伯乐任务完成事件
     * 伯乐相关任务完成时触发
     */
    BaseEventType<TaskCompletionEventData> BoleTaskCompletion =
        new BaseEventType<>("BoleTaskCompletionEvent", TaskCompletionEventData.class);
}
```

---

## 事件数据结构

### BoleRewardEventData
```java
public class BoleRewardEventData {
    private Integer candidateId;        // 候选人 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer postId;             // 岗位 ID
    private Long flowMainId;            // 流程 ID
    private BigDecimal rewardAmount;    // 奖励金额
    private String rewardType;          // 奖励类型
    private Date entryDate;             // 入职日期
}
```

### BoleFlowRewardEventData
```java
public class BoleFlowRewardEventData {
    private Integer candidateId;        // 候选人 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer postId;             // 岗位 ID
    private Long flowMainId;            // 流程 ID
    private Integer stepId;             // 流程环节 ID
    private String stepName;            // 环节名称
    private BigDecimal rewardAmount;    // 奖励金额
    private Date triggerTime;           // 触发时间
}
```

### SuperBoleRewardEventData
```java
public class SuperBoleRewardEventData {
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer successCount;       // 成功推荐次数
    private String boleLevel;           // 伯乐等级
    private BigDecimal totalReward;     // 总奖励金额
    private BigDecimal bonusAmount;     // 超级伯乐额外奖金
    private List<Integer> candidateIds; // 推荐的候选人列表
}
```

### TaskCompletionEventData
```java
public class TaskCompletionEventData {
    private String taskId;              // 任务 ID
    private String taskType;            // 任务类型
    private Integer staffId;            // 员工 ID
    private String taskStatus;          // 任务状态
    private Date completionTime;        // 完成时间
    private Map<String, Object> taskData; // 任务数据
}
```

---

## 使用示例

### 发布伯乐入职奖励事件

```java
@Autowired
private DomainEventBus eventBus;

// 候选人入职成功，发布伯乐奖励事件
public void onCandidateEntry(Integer candidateId, Integer boleStaffId, 
                            Integer postId, Long flowMainId) {
    BoleRewardEventData eventData = new BoleRewardEventData();
    eventData.setCandidateId(candidateId);
    eventData.setBoleStaffId(boleStaffId);
    eventData.setPostId(postId);
    eventData.setFlowMainId(flowMainId);
    eventData.setRewardAmount(new BigDecimal("5000.00"));
    eventData.setRewardType("ENTRY_REWARD");
    eventData.setEntryDate(new Date());
    
    // 发布事件
    eventBus.publish(BoleEvent.BoleReward, eventData);
}
```

### 订阅伯乐奖励事件

```java
@Component
public class BoleRewardSubscriber {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private RewardService rewardService;
    
    @PostConstruct
    public void init() {
        // 订阅伯乐入职奖励事件
        eventBus.subscribe("bole-reward-processor", 
            BoleEvent.BoleReward, 
            this::processBoleReward);
        
        // 订阅伯乐过程奖励事件
        eventBus.subscribe("bole-flow-reward-processor", 
            BoleEvent.BoleFlowReward, 
            this::processBoleFlowReward);
        
        // 订阅超级伯乐奖励事件
        eventBus.subscribe("super-bole-reward-processor", 
            BoleEvent.SuperBoleReward, 
            this::processSuperBoleReward);
    }
    
    // 处理伯乐入职奖励
    private void processBoleReward(BoleRewardEventData eventData) {
        // 计算奖励
        rewardService.calculateReward(eventData.getBoleStaffId(), 
            eventData.getRewardAmount());
        
        // 发送通知
        notifyBole(eventData.getBoleStaffId(), "候选人已成功入职，奖励已发放");
    }
    
    // 处理伯乐过程奖励
    private void processBoleFlowReward(BoleFlowRewardEventData eventData) {
        // 记录过程奖励
        rewardService.recordFlowReward(eventData);
        
        // 发送进度通知
        notifyBole(eventData.getBoleStaffId(), 
            String.format("候选人已通过%s环节，获得过程奖励", eventData.getStepName()));
    }
    
    // 处理超级伯乐奖励
    private void processSuperBoleReward(SuperBoleRewardEventData eventData) {
        // 授予超级伯乐称号
        rewardService.grantSuperBoleTitle(eventData.getBoleStaffId(), 
            eventData.getBoleLevel());
        
        // 发放额外奖金
        rewardService.grantBonus(eventData.getBoleStaffId(), 
            eventData.getBonusAmount());
    }
}
```

### 发布伯乐过程奖励事件

```java
// 候选人通过面试环节，发布过程奖励事件
public void onInterviewPassed(Integer candidateId, Integer boleStaffId, 
                             Integer stepId, String stepName) {
    BoleFlowRewardEventData eventData = new BoleFlowRewardEventData();
    eventData.setCandidateId(candidateId);
    eventData.setBoleStaffId(boleStaffId);
    eventData.setStepId(stepId);
    eventData.setStepName(stepName);
    eventData.setRewardAmount(new BigDecimal("500.00")); // 过程奖励
    eventData.setTriggerTime(new Date());
    
    eventBus.publish(BoleEvent.BoleFlowReward, eventData);
}
```

### 发布超级伯乐奖励事件

```java
// 员工达成超级伯乐条件
public void onSuperBoleAchievement(Integer boleStaffId, 
                                  List<Integer> candidateIds) {
    SuperBoleRewardEventData eventData = new SuperBoleRewardEventData();
    eventData.setBoleStaffId(boleStaffId);
    eventData.setSuccessCount(candidateIds.size());
    eventData.setBoleLevel("SUPER");
    eventData.setCandidateIds(candidateIds);
    eventData.setTotalReward(new BigDecimal("50000.00"));
    eventData.setBonusAmount(new BigDecimal("10000.00")); // 额外奖金
    
    eventBus.publish(BoleEvent.SuperBoleReward, eventData);
}
```

### 发布伯乐任务完成事件

```java
// 伯乐任务完成
public void onBoleTaskComplete(String taskId, Integer staffId) {
    TaskCompletionEventData eventData = new TaskCompletionEventData();
    eventData.setTaskId(taskId);
    eventData.setTaskType("BOLE_REFERRAL");
    eventData.setStaffId(staffId);
    eventData.setTaskStatus("COMPLETED");
    eventData.setCompletionTime(new Date());
    
    Map<String, Object> taskData = new HashMap<>();
    taskData.put("referralCount", 5);
    taskData.put("successRate", 0.8);
    eventData.setTaskData(taskData);
    
    eventBus.publish(BoleEvent.BoleTaskCompletion, eventData);
}
```

---

## 伯乐奖励流程

### 1. 推荐阶段
- 员工推荐候选人
- 记录推荐关系（伯乐与候选人）

### 2. 流程奖励
- 候选人通过初筛 → 发放初筛奖励
- 候选人通过一面 → 发放面试奖励
- 候选人通过终面 → 发放终面奖励
- 候选人获得 Offer → 发放 Offer 奖励

**触发**: `BoleFlowReward` 事件

### 3. 入职奖励
- 候选人成功入职 → 发放入职奖励
- 候选人试用期满 → 发放转正奖励

**触发**: `BoleReward` 事件

### 4. 超级伯乐
- 累计成功推荐 N 人 → 升级为超级伯乐
- 获得超级伯乐额外奖金

**触发**: `SuperBoleReward` 事件

---

## 奖励规则示例

### 过程奖励
| 环节 | 奖励金额 | 事件 |
|------|---------|------|
| 简历筛选通过 | ¥200 | BoleFlowReward |
| 一面通过 | ¥500 | BoleFlowReward |
| 二面通过 | ¥800 | BoleFlowReward |
| 终面通过 | ¥1000 | BoleFlowReward |
| 获得 Offer | ¥1500 | BoleFlowReward |

### 入职奖励
| 条件 | 奖励金额 | 事件 |
|------|---------|------|
| 成功入职 | ¥5000 | BoleReward |
| 试用期满 | ¥3000 | BoleReward |
| 转正 | ¥2000 | BoleReward |

### 超级伯乐
| 等级 | 成功推荐数 | 额外奖金 | 事件 |
|------|----------|---------|------|
| 银牌伯乐 | 3 人 | ¥5000 | SuperBoleReward |
| 金牌伯乐 | 5 人 | ¥10000 | SuperBoleReward |
| 钻石伯乐 | 10 人 | ¥30000 | SuperBoleReward |

---

---

## 最佳实践

### 1. 事件驱动设计

#### 高效的事件订阅与批量处理
```java
@Component
public class BoleEventProcessor {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @Autowired
    private RewardService rewardService;
    
    @PostConstruct
    public void init() {
        // 批量聚合事件处理，提高效率
        eventBus.subscribe("bole-event-batch-processor", 
            BoleEvent.BoleReward, 
            events -> processBoleRewardBatch(events));
    }
    
    // 批量处理奖励事件
    private void processBoleRewardBatch(List<BoleRewardEventData> events) {
        // 按伯乐员工 ID 分组
        Map<Integer, List<BoleRewardEventData>> byStaff = 
            events.stream()
                .collect(Collectors.groupingBy(BoleRewardEventData::getBoleStaffId));
        
        // 按员工统一计算和发放奖励
        byStaff.forEach((staffId, staffEvents) -> {
            BigDecimal totalReward = staffEvents.stream()
                .map(BoleRewardEventData::getRewardAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            rewardService.grantReward(staffId, totalReward, staffEvents);
        });
    }
}
```

### 2. 防刷和数据一致性

#### 防止虚假推荐
```java
@Service
public class BoleReferralValidator {
    
    @Autowired
    private BoleReferralRepository referralRepository;
    
    // 验证推荐关系的真实性
    public boolean validateReferral(Integer boleStaffId, Integer candidateId) {
        // 检查是否存在有效的推荐关系
        BoleReferral referral = referralRepository.findByStaffAndCandidate(
            boleStaffId, candidateId);
        
        if (referral == null || !referral.isValid()) {
            return false;
        }
        
        // 检查是否已经领取过奖励
        if (referral.getRewardStatus() == RewardStatus.ALREADY_REWARDED) {
            logger.warn("Duplicate reward attempt for staff {} and candidate {}", 
                boleStaffId, candidateId);
            return false;
        }
        
        return true;
    }
    
    // 记录推荐关系
    public void recordReferral(Integer boleStaffId, Integer candidateId, 
                              Integer postId) {
        BoleReferral referral = new BoleReferral();
        referral.setBoleStaffId(boleStaffId);
        referral.setCandidateId(candidateId);
        referral.setPostId(postId);
        referral.setReferralTime(new Date());
        referral.setStatus("ACTIVE");
        referral.setRewardStatus(RewardStatus.PENDING);
        
        referralRepository.save(referral);
    }
}
```

### 3. 幂等性保证

#### 事件消费的幂等处理
```java
@Service
public class IdempotentRewardService {
    
    @Autowired
    private RewardRecordRepository rewardRecordRepository;
    
    // 幂等的奖励发放
    public void grantRewardIdempotent(BoleRewardEventData eventData) {
        // 1. 检查是否已处理
        String eventId = generateEventId(eventData);
        
        RewardRecord existing = rewardRecordRepository.findByEventId(eventId);
        if (existing != null) {
            logger.info("Reward already processed for event {}", eventId);
            return;
        }
        
        try {
            // 2. 发放奖励（使用数据库事务保证原子性）
            BigDecimal amount = calculateReward(eventData);
            grantRewardToWallet(eventData.getBoleStaffId(), amount);
            
            // 3. 记录处理结果
            RewardRecord record = new RewardRecord();
            record.setEventId(eventId);
            record.setBoleStaffId(eventData.getBoleStaffId());
            record.setAmount(amount);
            record.setStatus("SUCCESS");
            record.setProcessTime(new Date());
            
            rewardRecordRepository.save(record);
            
        } catch (Exception e) {
            logger.error("Failed to grant reward", e);
            
            // 记录失败状态
            RewardRecord failRecord = new RewardRecord();
            failRecord.setEventId(eventId);
            failRecord.setStatus("FAILED");
            failRecord.setErrorMessage(e.getMessage());
            rewardRecordRepository.save(failRecord);
            
            throw e;
        }
    }
    
    private String generateEventId(BoleRewardEventData eventData) {
        return String.format("%d_%d_%d_%d", 
            eventData.getBoleStaffId(),
            eventData.getCandidateId(),
            eventData.getPostId(),
            eventData.getFlowMainId());
    }
}
```

---

## 错误处理指南

### 常见错误场景

| 场景 | 处理建议 |
|------|--------|
| 推荐关系不存在 | 检查 boleStaffId 和 candidateId 是否正确，是否已过期 |
| 重复奖励 | 检查奖励历史记录，防止重复发放 |
| 候选人信息不完整 | 确保候选人已入职且试用期满 |
| 流程未完成 | 等待流程完成至指定环节再发放过程奖励 |

### 重试策略

```java
public void publishBoleEventWithRetry(BoleRewardEventData eventData, 
                                     int maxRetries) throws Exception {
    int retries = 0;
    Exception lastException = null;
    
    while (retries < maxRetries) {
        try {
            eventBus.publish(BoleEvent.BoleReward, eventData);
            logger.info("Event published successfully");
            return;
        } catch (ServiceUnavailableException e) {
            lastException = e;
            
            if (retries < maxRetries - 1) {
                long delayMs = (long) Math.pow(2, retries) * 1000;
                logger.warn("Retry publishing event after {} ms", delayMs);
                Thread.sleep(delayMs);
            }
            retries++;
        } catch (Exception e) {
            // 不可重试的异常
            throw e;
        }
    }
    
    throw lastException;
}
```

---

## 常见问题 (FAQ)

### Q1: 伯乐和推荐人是同一个概念吗？

**A**: 是的。伯乐指公司内部推荐候选人的员工。通过推荐优秀候选人入职，伯乐可以获得相应的奖励。

### Q2: 什么时候应该发放奖励？

**A**: 
- **过程奖励**: 候选人通过特定环节（面试、Offer 等）时发放
- **入职奖励**: 候选人成功入职并度过试用期后发放
- **转正奖励**: 候选人转正时发放（可选）

### Q3: 如何防止虚假推荐？

**A**: 建议：
1. 记录所有推荐关系的时间戳
2. 验证候选人信息的真实性
3. 使用幂等处理防止重复奖励
4. 定期审计奖励发放记录
5. 对异常模式进行告警（如单人短时间内多次推荐）

### Q4: 超级伯乐的条件是什么？

**A**: 通常基于：
- 成功推荐人数（如累计 5 人以上）
- 推荐候选人的质量评分
- 所推荐候选人在公司的表现

具体条件由运营平台配置。

### Q5: 如何处理奖励发放失败？

**A**:
1. 记录失败原因和事件 ID
2. 告警运维团队
3. 实现重试机制
4. 支持手工补发奖励

### Q6: 伯乐事件消费需要在分布式锁下进行吗？

**A**: 建议使用分布式锁防止并发问题：
```java
@Transactional
public void processRewardWithLock(BoleRewardEventData eventData) {
    String lockKey = "bole_reward_" + eventData.getBoleStaffId() + 
                     "_" + eventData.getCandidateId();
    
    if (lockService.tryLock(lockKey, 30)) {
        try {
            // 处理奖励
            grantReward(eventData);
        } finally {
            lockService.unlock(lockKey);
        }
    }
}
```

---

## 配置示例

### 事件订阅配置
```yaml
# domain event configuration
domain-event:
  bus:
    bole-reward-event:
      topics:
        - bole-reward
      consumer-group: bole-reward-processor
      max-retries: 5
      retry-delay-ms: 2000
    
    bole-flow-reward-event:
      topics:
        - bole-flow-reward
      consumer-group: bole-flow-reward-processor
      max-retries: 3
      retry-delay-ms: 1000
    
    super-bole-reward-event:
      topics:
        - super-bole-reward
      consumer-group: super-bole-processor
      max-retries: 3
```

### 奖励规则配置
```yaml
# Reward configuration
bole:
  reward:
    # 过程奖励（环节名称: 金额）
    flow-rewards:
      resume-pass: 200
      first-interview: 500
      second-interview: 800
      final-interview: 1000
      offer: 1500
    
    # 入职奖励
    entry-reward: 5000
    trial-completion-reward: 3000
    probation-confirmation-reward: 2000
    
    # 超级伯乐等级
    super-bole-levels:
      silver: { min-count: 3, bonus: 5000 }
      gold: { min-count: 5, bonus: 10000 }
      diamond: { min-count: 10, bonus: 30000 }
```

---

## 相关实体

### BoleReferral
```java
public class BoleReferral {
    private Long referralId;            // 推荐关系 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer candidateId;        // 候选人 ID
    private Integer postId;             // 岗位 ID
    private Date referralTime;          // 推荐时间
    private String status;              // 状态：ACTIVE/INACTIVE/EXPIRED
    private RewardStatus rewardStatus;  // 奖励状态
    private Date createTime;            // 创建时间
}
```

### RewardRecord
```java
public class RewardRecord {
    private Long recordId;              // 记录 ID
    private String eventId;             // 事件 ID（唯一）
    private Integer boleStaffId;        // 伯乐员工 ID
    private BigDecimal amount;          // 奖励金额
    private String rewardType;          // 奖励类型
    private String status;              // 处理状态：PENDING/SUCCESS/FAILED
    private String errorMessage;        // 错误信息（如果失败）
    private Date processTime;           // 处理时间
}
```

### BoleRewardEventData
```java
public class BoleRewardEventData {
    private Integer candidateId;        // 候选人 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer postId;             // 岗位 ID
    private Long flowMainId;            // 流程 ID
    private BigDecimal rewardAmount;    // 奖励金额
    private String rewardType;          // 奖励类型：ENTRY/FLOW/PROCESS
    private Date entryDate;             // 入职日期
}
```

### BoleFlowRewardEventData
```java
public class BoleFlowRewardEventData {
    private Integer candidateId;        // 候选人 ID
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer postId;             // 岗位 ID
    private Long flowMainId;            // 流程 ID
    private Integer stepId;             // 流程环节 ID
    private String stepName;            // 环节名称
    private BigDecimal rewardAmount;    // 奖励金额
    private Date triggerTime;           // 触发时间
}
```

### SuperBoleRewardEventData
```java
public class SuperBoleRewardEventData {
    private Integer boleStaffId;        // 伯乐员工 ID
    private Integer successCount;       // 成功推荐次数
    private String boleLevel;           // 伯乐等级：SILVER/GOLD/DIAMOND
    private BigDecimal totalReward;     // 总奖励金额
    private BigDecimal bonusAmount;     // 超级伯乐额外奖金
    private List<Integer> candidateIds; // 推荐的候选人列表
}
```

---

## 集成检查清单

- [ ] 已配置伯乐推荐关系的存储和查询
- [ ] 已订阅所有伯乐相关领域事件
- [ ] 已实现事件消费的幂等处理
- [ ] 已实现防刷机制（防止虚假推荐）
- [ ] 已配置奖励规则和金额
- [ ] 已实现奖励发放的重试和补偿机制
- [ ] 已配置分布式锁防止并发问题
- [ ] 已进行性能测试（并发事件消费）
- [ ] 已准备奖励审计和追溯方案
- [ ] 已准备灾难恢复方案（事件消费失败时的处理）

---

## 伯乐激励体系最佳实践

### 1. 完整的推荐流程

```
推荐关系记录 → 候选人入选 → 过程奖励 → 入职奖励 → 试用期奖励 → 转正奖励
```

每个环节都应该有对应的事件触发和奖励发放。

### 2. 透明的奖励展示

为伯乐提供：
- 实时奖励金额查询
- 推荐候选人的进度跟踪
- 奖励发放历史记录
- 预期奖励金额估算

### 3. 防止作弊

- 多维度验证（时间、人、岗位组合）
- 审计日志记录所有推荐和奖励
- 定期风险检查（单人异常推荐、集中推荐等）
- 黑名单机制（对虚假推荐的人员进行限制）

---

[返回 API 索引](./index.md)
