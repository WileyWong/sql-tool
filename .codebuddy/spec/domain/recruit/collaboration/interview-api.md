# 面试管理 API (Interview)

## 概述

面试管理模块提供面试安排、面试评价、社招面试等功能。

---

## FeignClient 接口

### 1. InterviewArrangementApi

**服务名称**: `recruit-interview-arrange`  
**配置类**: `RecruitFeignHeaderInterceptor`  
**文档地址**: [接口文档](http://demo.ntsgw.oa.com/api/sso/recruit-interview-arrange/doc.html)

---

## 接口列表

### 1.1 面试安排查询

#### 查询面试安排数据（按流程 ID）
```java
@GetMapping("/external/order/get_count_by_flow_ids")
Result<Map<Long, Integer>> getArrangementCount(@RequestBody List<Long> flowMainIds);
```

#### 查询面试安排数据（按日期）
```java
@PostMapping("/external/order/get_by_date")
Result<Page<OrderMainDTO>> getArrangementOrderList(@RequestBody OrderListQueryDTO orderListQueryDTO);
```

#### 查询面试安排（按流程 ID）
```java
@PostMapping("/external/get_list_by_flow_ids")
Result<Map<Long, List<InterviewPlanDTO>>> getInterviewPlans(@RequestBody List<Long> flowMainIds);
```

#### 通过待办 ID 批量获取面试安排
```java
@PostMapping("/external/get_list_by_trace_ids")
Result<List<InterviewPlanDTO>> getInterviewByTraceIds(@RequestBody List<Long> traceIds);
```

#### 查询面试安排（按待办 ID）
```java
@GetMapping("/external/order/get_by_trace_id")
Result<List<InterviewPlanDTO>> getInterviewPlan(@RequestParam(value = "traceId") Long traceId);
```

---

### 1.2 AI 面评报告

#### 根据待办 ID 获取 AI 面评报告
```java
@GetMapping("/external/ai_report/by_trace_id")
Result<AIReportDTO> getAiReportByTraceId(@RequestParam(value = "traceId") Long traceId);
```

#### 查询面试存疑点
```java
@GetMapping("/external/report/comment/importantPoint")
Result<String> getImportantPoint(@RequestParam(value = "traceId") Long traceId);
```

---

### 1.3 会议转写

#### 查询面试转写记录
```java
@GetMapping("/external/vi/wemeet/asr_list")
Result<List<MeetingAsrDataDTO>> getMeetingAsrData(@RequestParam("traceId") Long traceId);
```

---

## 2. SocialInterviewApi

**服务名称**: `recruit-social-micro`  
**配置类**: `RecruitFeignHeaderInterceptor`

### 2.1 表单管理

#### 获取 Form 信息
```java
@GetMapping("/interview/external/getFormByFormId")
Result<FormDTO> getFormByFormId(@RequestParam("formId") Integer formId);
```

---

### 2.2 渠道管理

#### 同步渠道信息
```java
@PostMapping("/interview/external/syncChannel")
Result<Boolean> syncChannel(@RequestBody PaidChannelDTO channelDTO);
```

#### 查询渠道申诉单
```java
@PostMapping("/interview/external/getAppeal")
Result<List<PaidChannelAppealDTO>> getAppeal(@RequestBody ChannelAppealQueryDTO queryCommand);
```

---

### 2.3 文件管理

#### 获取文件下载地址
```java
@GetMapping("/interview/external/downloadUrl")
Result<String> getDownloadUrl(
    @RequestParam("fileUuid") String fileUuid, 
    @RequestParam("staffId") Long staffId
);
```

---

### 2.4 面试通知

#### 首次安排面试通知
```java
@GetMapping("/pub/external/arrangeInterview")
Result<Boolean> arrangeInterview(@RequestParam("flowMainId") Long flowMainId);
```

---

### 2.5 流程管理

#### 查询流程过期时间
```java
@PostMapping("/pub/external/flowExpire")
Result<List<FlowExpireDTO>> getFlowExpire(@RequestBody List<Long> flowMainIds);
```

#### 查询面试环节配置
```java
@GetMapping("/interview/external/staffFlowStep")
Result<FlowStepDTO> getStaffFlowStep(
    @RequestParam("flowMainId") Long flowMainId, 
    @RequestParam("staffId") Integer staffId
);
```

---

## 领域事件

### InterviewArrangementEvent

```java
public interface InterviewArrangementEvent {
    
    /**
     * 面试安排事件
     * @see https://test.zhaopin.woa.com/support/task/domainEventManage
     * @see https://iwiki.woa.com/p/4006980119?from=iWiki_search
     */
    BaseEventType<InterviewArrangementEventDTO> INTERVIEW_ARRANGEMENT_EVENT =
        new BaseEventType<>("interview-arrangement-event", InterviewArrangementEventDTO.class);
}
```

### SocialInterviewEvent

```java
public interface SocialInterviewEvent {
    
    /**
     * 薪资环节提交事件
     */
    BaseEventType<InterviewSalaryStepSubmitEventData> SalaryStepSubmit =
        new BaseEventType<>("interview-salary-step-submit", InterviewSalaryStepSubmitEventData.class);
}
```

---

## 使用示例

### 查询面试安排

```java
@Autowired
private InterviewArrangementApi interviewArrangementApi;

// 根据流程 ID 查询面试安排
List<Long> flowMainIds = Arrays.asList(1001L, 1002L);
Result<Map<Long, List<InterviewPlanDTO>>> result = 
    interviewArrangementApi.getInterviewPlans(flowMainIds);

if (result.isSuccess()) {
    Map<Long, List<InterviewPlanDTO>> plans = result.getData();
    plans.forEach((flowMainId, planList) -> {
        // 处理面试安排
    });
}

// 根据待办 ID 查询
Long traceId = 12345L;
Result<List<InterviewPlanDTO>> traceResult = 
    interviewArrangementApi.getInterviewPlan(traceId);
```

### 获取 AI 面评报告

```java
// 获取 AI 面评报告
Result<AIReportDTO> aiReport = interviewArrangementApi.getAiReportByTraceId(traceId);
if (aiReport.isSuccess()) {
    AIReportDTO report = aiReport.getData();
    // 处理报告内容
}

// 获取面试存疑点
Result<String> importantPoint = interviewArrangementApi.getImportantPoint(traceId);
```

### 查询会议转写

```java
// 获取面试转写记录
Result<List<MeetingAsrDataDTO>> asrResult = 
    interviewArrangementApi.getMeetingAsrData(traceId);

if (asrResult.isSuccess()) {
    List<MeetingAsrDataDTO> asrDataList = asrResult.getData();
    asrDataList.forEach(asr -> {
        // 处理转写数据
        String text = asr.getText();
        Long timestamp = asr.getTimestamp();
    });
}
```

### 发布面试安排事件

```java
@Autowired
private DomainEventBus eventBus;

InterviewArrangementEventDTO eventData = new InterviewArrangementEventDTO();
eventData.setFlowMainId(flowMainId);
eventData.setTraceId(traceId);
// ... 设置其他属性

eventBus.publish(InterviewArrangementEvent.INTERVIEW_ARRANGEMENT_EVENT, eventData);
```

### 订阅面试事件

```java
@PostConstruct
public void init() {
    // 订阅面试安排事件
    eventBus.subscribe("interview-arrangement-subscriber", 
        InterviewArrangementEvent.INTERVIEW_ARRANGEMENT_EVENT, 
        event -> {
            Long flowMainId = event.getFlowMainId();
            // 处理面试安排逻辑
        });
    
    // 订阅薪资环节提交事件
    eventBus.subscribe("salary-step-subscriber", 
        SocialInterviewEvent.SalaryStepSubmit, 
        event -> {
            // 处理薪资环节提交
        });
}
```

---

## 社招面试功能

### 获取表单信息

```java
@Autowired
private SocialInterviewApi socialInterviewApi;

Result<FormDTO> formResult = socialInterviewApi.getFormByFormId(formId);
if (formResult.isSuccess()) {
    FormDTO form = formResult.getData();
    // 处理表单数据
}
```

### 同步渠道信息

```java
PaidChannelDTO channelDTO = new PaidChannelDTO();
channelDTO.setChannelId(1001);
channelDTO.setChannelName("渠道名称");
// ... 设置其他属性

Result<Boolean> syncResult = socialInterviewApi.syncChannel(channelDTO);
```

### 查询申诉单

```java
ChannelAppealQueryDTO queryDTO = new ChannelAppealQueryDTO();
queryDTO.setChannelId(1001);
queryDTO.setStatus(1);

Result<List<PaidChannelAppealDTO>> appealResult = 
    socialInterviewApi.getAppeal(queryDTO);
```

---

---

## 最佳实践

### 1. 面试安排查询优化

#### 批量查询 vs 单条查询
```java
// ❌ 不推荐：多次单条查询
for (Long traceId : traceIds) {
    interviewArrangementApi.getInterviewPlan(traceId);
}

// ✅ 推荐：批量查询
Result<List<InterviewPlanDTO>> result = 
    interviewArrangementApi.getInterviewByTraceIds(traceIds);
```

#### 按流程聚合查询
```java
// ✅ 推荐：一次查询获取流程内所有面试安排
List<Long> flowMainIds = Arrays.asList(1001L, 1002L, 1003L);
Result<Map<Long, List<InterviewPlanDTO>>> result = 
    interviewArrangementApi.getInterviewPlans(flowMainIds);

// 处理结果（已按流程 ID 分组）
result.getData().forEach((flowMainId, plans) -> {
    // 每个流程对应的所有面试安排
});
```

### 2. AI 面评报告集成

#### 异步获取报告
```java
// 面试完成后可能需要一段时间生成报告
public AIReportDTO getAiReportWithRetry(Long traceId, int maxRetries) {
    for (int i = 0; i < maxRetries; i++) {
        Result<AIReportDTO> result = 
            interviewArrangementApi.getAiReportByTraceId(traceId);
        
        if (result.isSuccess() && result.getData() != null) {
            return result.getData();
        }
        
        if (i < maxRetries - 1) {
            Thread.sleep(1000 * (i + 1)); // 指数退避
        }
    }
    
    return null; // 暂时无可用报告
}
```

### 3. 会议转写处理

#### 流式处理转写数据
```java
// 处理长转写记录，避免内存溢出
public void processMeetingAsr(Long traceId, Consumer<String> onData) {
    Result<List<MeetingAsrDataDTO>> result = 
        interviewArrangementApi.getMeetingAsrData(traceId);
    
    if (result.isSuccess()) {
        // 按时间戳排序，流式处理
        result.getData()
            .stream()
            .sorted(Comparator.comparing(MeetingAsrDataDTO::getTimestamp))
            .forEach(asr -> onData.accept(asr.getText()));
    }
}
```

### 4. 事件驱动的流程管理

#### 高效的事件订阅
```java
@PostConstruct
public void init() {
    // 批量聚合事件处理
    eventBus.subscribe("interview-event-processor", 
        InterviewArrangementEvent.INTERVIEW_ARRANGEMENT_EVENT,
        this::handleInterviewEvents);
    
    // 薪资环节单独处理
    eventBus.subscribe("salary-step-processor", 
        SocialInterviewEvent.SalaryStepSubmit,
        this::handleSalarySubmit);
}

private void handleInterviewEvents(List<InterviewArrangementEventDTO> events) {
    // 聚合处理多个事件，提高效率
    Map<Long, List<InterviewArrangementEventDTO>> byFlow = 
        events.stream()
            .collect(Collectors.groupingBy(InterviewArrangementEventDTO::getFlowMainId));
    
    byFlow.forEach((flowMainId, flowEvents) -> {
        // 按流程处理
    });
}
```

---

## 错误处理指南

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|--------|
| 2001 | 流程不存在 | 检查 flowMainId 是否正确 |
| 2002 | 待办不存在 | 检查 traceId 是否正确 |
| 2003 | 面试安排不存在 | 检查是否已创建面试安排 |
| 2004 | 权限不足 | 检查是否有权访问该流程 |
| 4001 | 报告生成中 | 稍后重试获取 AI 报告 |
| 4002 | 录音/视频不可用 | 检查转写数据源 |

### 重试策略

```java
// 推荐的重试策略
public <T> Result<T> retryableCall(
    Supplier<Result<T>> supplier,
    int maxRetries,
    long initialDelayMs) {
    
    Result<T> result = null;
    long delayMs = initialDelayMs;
    
    for (int attempt = 0; attempt < maxRetries; attempt++) {
        result = supplier.get();
        
        if (result.isSuccess()) {
            return result;
        }
        
        // 只有特定错误码才重试
        if (isRetryable(result.getCode())) {
            if (attempt < maxRetries - 1) {
                Thread.sleep(delayMs);
                delayMs *= 2; // 指数退避
            }
        } else {
            // 不可重试的错误，直接返回
            return result;
        }
    }
    
    return result;
}

private boolean isRetryable(String errorCode) {
    // 暂时错误可重试
    return errorCode.matches("40\\d{2}") || // 报告/转写生成中
           errorCode.matches("50\\d{2}");   // 服务内部错误
}
```

### 异常处理

```java
try {
    Result<Map<Long, List<InterviewPlanDTO>>> result = 
        interviewArrangementApi.getInterviewPlans(flowMainIds);
    
    if (!result.isSuccess()) {
        throw new InterviewApiException(result.getCode(), result.getMessage());
    }
    
    Map<Long, List<InterviewPlanDTO>> plans = result.getData();
    if (plans == null || plans.isEmpty()) {
        logger.warn("No interview plans found for flows: {}", flowMainIds);
        return Collections.emptyMap();
    }
    
    return plans;
    
} catch (RestClientException e) {
    // 网络错误，可重试
    logger.error("Network error calling interview API", e);
    throw new ServiceUnavailableException("Interview service temporarily unavailable", e);
    
} catch (Exception e) {
    // 其他错误，需要告警
    logger.error("Unexpected error", e);
    alertOps(e);
    throw new RuntimeException("Unexpected error in interview service", e);
}
```

---

## 常见问题 (FAQ)

### Q1: 面试安排与待办（Trace）的关系？

**A**: 
- **待办 (Trace)**: 流程中的一个待处理任务，待办 ID 唯一标识某个流程中某个环节的待办
- **面试安排 (Order)**: 具体的面试信息（时间、地点、面试官等）

一个待办可能对应一个或多个面试安排（例如：重复面试）。

### Q2: 什么时候能获取到 AI 面评报告？

**A**: 报告生成需要时间（一般 5-10 分钟），建议：
1. 面试完成后等待 5 分钟再查询
2. 使用指数退避重试（初始 5 秒，最长 5 分钟）
3. 订阅事件通知而不是主动轮询

### Q3: 如何处理多个面试信息（多轮面试）？

**A**: 使用返回的 List 对象处理：
```java
Result<List<InterviewPlanDTO>> result = 
    interviewArrangementApi.getInterviewPlan(traceId);

List<InterviewPlanDTO> plans = result.getData();
plans.forEach(plan -> {
    // 每个 plan 对应一轮面试
});
```

### Q4: 会议转写何时可用？

**A**: 转写数据依赖录音/视频：
- 面试需要启用录音/录视频
- 完成后需要等待转写处理（一般 10-30 分钟）
- 文本内容已分段，可逐段显示

### Q5: 社招面试的表单和招聘岗位的关系？

**A**: 社招模块支持自定义表单，流程：
1. 通过 `getFormByFormId` 获取表单定义
2. 使用表单字段构建候选人信息收集页面
3. 表单与岗位关联，支持按岗位定制表单

### Q6: 如何保证事件处理的幂等性？

**A**: 建议：
1. 记录已处理的事件 ID
2. 处理前检查是否已处理
3. 使用数据库唯一约束确保幂等

```java
// 幂等处理示例
private void processInterviewEvent(InterviewArrangementEventDTO event) {
    // 检查是否已处理
    if (eventRecordService.isProcessed(event.getEventId())) {
        return;
    }
    
    // 处理业务逻辑
    doProcess(event);
    
    // 记录处理完成
    eventRecordService.markProcessed(event.getEventId());
}
```

---

## 配置示例

### 微服务调用配置
```yaml
# application.yml
feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 30000
      recruit-interview-arrange:
        read-timeout: 60000  # 面试查询可能较慢
      recruit-social-micro:
        read-timeout: 10000
  
  # 重试配置
  retry:
    enabled: true
    period: 100
    max-period: 1000
    max-attempts: 3
```

### 事件订阅配置
```yaml
# domain event bus 配置
domain-event:
  bus:
    interview-arrangement-event:
      topics:
        - interview-arrangement-event
      consumer-group: interview-processor-group
      max-retries: 5
      retry-delay-ms: 2000
    
    salary-step-event:
      topics:
        - interview-salary-step-submit
      consumer-group: salary-processor-group
      max-retries: 3
```

---

## 相关实体

### InterviewPlanDTO
```java
public class InterviewPlanDTO {
    private Long orderId;               // 面试安排 ID
    private Long flowMainId;            // 流程 ID
    private Long traceId;               // 待办 ID
    private Date interviewTime;         // 面试时间
    private String interviewAddress;    // 面试地址（线下地址或 URL）
    private String interviewMode;       // 面试模式：OFFLINE/ONLINE/PHONE
    private String interviewer;         // 面试官
    private List<String> interviewerIds;// 面试官 ID 列表
    private String interviewerGroup;    // 面试官组（可选）
    private Integer interviewRound;     // 面试轮次
    private Date createTime;            // 创建时间
    private Date updateTime;            // 更新时间
}
```

### AIReportDTO
```java
public class AIReportDTO {
    private Long traceId;               // 待办 ID
    private String reportContent;       // 报告内容
    private String evaluation;          // 综合评价
    private String importantPoint;      // 存疑点/亮点
    private Float recommendScore;       // 推荐分数（0-100）
    private Date generateTime;          // 生成时间
    private String status;              // 报告状态：GENERATING/COMPLETED/FAILED
}
```

### MeetingAsrDataDTO
```java
public class MeetingAsrDataDTO {
    private Long traceId;               // 待办 ID
    private Long asrId;                 // 转写 ID
    private Long timestamp;             // 时间戳（毫秒）
    private String speaker;             // 发言者
    private String text;                // 转写文本
    private Float confidence;           // 识别置信度
    private Date createTime;            // 生成时间
}
```

### OrderMainDTO
```java
public class OrderMainDTO {
    private Long orderId;               // 订单 ID
    private Long flowMainId;            // 流程 ID
    private Date orderDate;             // 订单日期
    private Integer candidateNum;       // 候选人数量
    private Integer orderCount;         // 安排数量
    // ... 其他字段
}
```

### InterviewArrangementEventDTO
```java
public class InterviewArrangementEventDTO {
    private String eventId;             // 事件 ID（唯一）
    private Long flowMainId;            // 流程 ID
    private Long traceId;               // 待办 ID
    private Long orderId;               // 面试安排 ID
    private String eventType;           // 事件类型
    private Date eventTime;             // 事件发生时间
    private Map<String, Object> data;   // 扩展数据
}
```

---

## 集成检查清单

- [ ] 已配置 recruit-interview-arrange FeignClient
- [ ] 已配置 recruit-social-micro FeignClient（社招功能）
- [ ] 已订阅面试相关领域事件
- [ ] 已实现异步获取 AI 报告的重试逻辑
- [ ] 已实现事件处理的幂等性保证
- [ ] 已配置事件消费的重试策略
- [ ] 已进行性能测试（单条 vs 批量查询）
- [ ] 已准备灾难恢复方案（事件消费失败时的处理）

---

[返回 API 索引](./index.md)
