# 效能分析 API

> **领域**: Efficiency | **服务**: tencent-recruit-efficiency-flowtrace | **版本**: v1.9

---

## 📋 接口概览

招聘效能分析模块提供招聘流程数据分析、统计报表、效能指标查询等功能，包括：

- 流程数据查询
- Offer 统计分析
- 面试待办查询
- 退库流程分析
- 面试评价统计
- 入职数据统计

---

## 🔌 FeignClient 接口

### EfficiencyApi

**服务名称**: `tencent-recruit-efficiency-flowtrace`  
**配置类**: `RecruitFeignHeaderInterceptor`  
**服务地址**:
- 生产环境: `${NTS_GW_WOA_ESB}/tencent-recruit-efficiency-flowtrace`
- 测试环境: `${DEMO_NTS_GW_ESB}/tencent-recruit-efficiency-flowtrace`

---

## 📡 接口详情

### 1. 流程数据查询

#### 1.1 查询流程信息（分页）

```java
@PostMapping(value = "/flowActionTrace/queryFlow", consumes = MediaType.APPLICATION_JSON_VALUE)
Result<Page<FlowInfoDTO>> queryFlow(@RequestBody FlowInfoQueryDTO params);
```

**参数说明**: `FlowInfoQueryDTO`
- `current`: 当前页码
- `size`: 每页大小
- `flowId`: 流程 ID（可选）
- `stateId`: 流程状态（可选）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**返回值**: `Result<Page<FlowInfoDTO>>` - 分页流程数据

**使用示例**:

```java
@Autowired
private EfficiencyApi efficiencyApi;

// 查询流程信息
FlowInfoQueryDTO query = new FlowInfoQueryDTO();
query.setCurrent(1);
query.setSize(20);
query.setFlowId(1);
query.setStartTime(LocalDateTime.of(2025, 1, 1, 0, 0));
query.setEndTime(LocalDateTime.now());

Result<Page<FlowInfoDTO>> result = efficiencyApi.queryFlow(query);
if (result.isSuccess()) {
    Page<FlowInfoDTO> page = result.getData();
    log.info("共查询到 {} 条流程记录", page.getTotal());
    
    page.getRecords().forEach(flow -> {
        log.info("流程 {}: 状态 {}", flow.getFlowMainId(), flow.getStateId());
    });
}
```

---

### 2. Offer 统计分析

#### 2.1 查询 Offer 统计数据

```java
@PostMapping(value = "/flowActionTrace/offerStatistics", consumes = MediaType.APPLICATION_JSON_VALUE)
Result<OfferStatisticsDTO> getOfferStatistics(@RequestBody OfferStatisticsRequestDTO params);
```

**参数说明**: `OfferStatisticsRequestDTO`
- `startTime`: 开始时间
- `endTime`: 结束时间
- `deptIds`: 部门 ID 列表（可选）
- `postIds`: 岗位 ID 列表（可选）

**返回值**: `Result<OfferStatisticsDTO>`

**统计指标**:
- Offer 总数
- Offer 接受数
- Offer 拒绝数
- Offer 接受率

---

#### 2.2 查询 Offer 统计数据（V1）

```java
@PostMapping(value = "/flowActionTrace/v1/offerStatistics", consumes = MediaType.APPLICATION_JSON_VALUE)
Result<OfferStatisticsDTO> getOfferStatisticsV1(@RequestBody OfferStatisticsRequestDTO params);
```

**说明**: V1 版本提供更详细的统计维度

**使用示例**:

```java
// 查询本月 Offer 统计
OfferStatisticsRequestDTO request = new OfferStatisticsRequestDTO();
request.setStartTime(LocalDateTime.of(2025, 11, 1, 0, 0));
request.setEndTime(LocalDateTime.now());

Result<OfferStatisticsDTO> result = efficiencyApi.getOfferStatisticsV1(request);
if (result.isSuccess()) {
    OfferStatisticsDTO stats = result.getData();
    log.info("Offer 总数: {}, 接受数: {}, 接受率: {}%", 
        stats.getTotalCount(), 
        stats.getAcceptCount(),
        stats.getAcceptRate() * 100);
}
```

---

### 3. 面试数据查询

#### 3.1 查询面试流程待办

```java
@PostMapping(value = "/flowActionTrace/interviewTrace", consumes = MediaType.APPLICATION_JSON_VALUE)
Result<List<InterviewTraceDTO>> getInterviewTrace(@RequestBody InterviewTraceQueryDTO params);
```

**参数说明**: `InterviewTraceQueryDTO`
- `flowMainIds`: 流程主 ID 列表
- `ownerId`: 处理人 ID（可选）
- `status`: 待办状态（可选）

**返回值**: `Result<List<InterviewTraceDTO>>`

---

#### 3.2 查询待办完成数量

```java
@PostMapping(value = "/flow/traceFinishCount")
Result<List<TraceFinishCountDTO>> getTraceFinishCount(@RequestBody List<Long> flowMainIds);
```

**参数说明**:
- `flowMainIds`: 流程主 ID 列表

**返回值**: `Result<List<TraceFinishCountDTO>>`

**使用示例**:

```java
// 查询待办完成情况
List<Long> flowMainIds = Arrays.asList(10001L, 10002L, 10003L);
Result<List<TraceFinishCountDTO>> result = efficiencyApi.getTraceFinishCount(flowMainIds);

if (result.isSuccess()) {
    result.getData().forEach(count -> {
        log.info("流程 {}: 已完成 {}/{}", 
            count.getFlowMainId(), 
            count.getFinishCount(), 
            count.getTotalCount());
    });
}
```

---

#### 3.3 查询面试安排

```java
@PostMapping(value = "/flow/interviewArrangement")
Result<List<InterviewArrangementDTO>> getInterviewArrangement(@RequestBody List<Long> flowMainIds);
```

**参数说明**:
- `flowMainIds`: 流程主 ID 列表

**返回值**: `Result<List<InterviewArrangementDTO>>`

---

### 4. 退库流程分析

#### 4.1 查询一个工作日内退库流程

```java
@PostMapping(value = "/flow/oneWorkDayBackLibFlow")
Result<List<InterviewBackLibFlowDTO>> getOneWorkDayBackLibFlow(
    @RequestBody InterviewBackLibDTO params
);
```

**参数说明**: `InterviewBackLibDTO`
- `startTime`: 开始时间
- `endTime`: 结束时间

**返回值**: `Result<List<InterviewBackLibFlowDTO>>`

---

#### 4.2 查询超时未提交的待办

```java
@PostMapping(value = "/flow/traceUnCommitBackLibFlow")
Result<List<InterviewBackLibFlowDTO>> getTraceUnCommitBackLibFlow(
    @RequestBody InterviewBackLibDTO params
);
```

**使用场景**: 定时任务检查超时待办，进行提醒或自动退库

---

#### 4.3 查询 Hold 退库流程

```java
@PostMapping(value = "/flow/holdBackLibFlow")
Result<List<InterviewBackLibFlowDTO>> getHoldBackLibFlow(
    @RequestBody InterviewBackLibDTO params
);
```

**说明**: 查询因 Hold 原因退库的流程

---

#### 4.4 查询 Step 退库流程

```java
@PostMapping(value = "/flow/stepBackLibFlow")
Result<List<InterviewBackLibFlowDTO>> getStepBackLibFlow(
    @RequestBody InterviewBackLibDTO params
);
```

**说明**: 查询因环节完成退库的流程

**使用示例**:

```java
// 查询本周 Hold 退库流程
InterviewBackLibDTO request = new InterviewBackLibDTO();
request.setStartTime(getThisWeekStart());
request.setEndTime(LocalDateTime.now());

Result<List<InterviewBackLibFlowDTO>> result = 
    efficiencyApi.getHoldBackLibFlow(request);

if (result.isSuccess()) {
    log.info("本周 Hold 退库流程: {} 个", result.getData().size());
}
```

---

### 5. 入职数据统计

#### 5.1 查询入职单据 ID

```java
@PostMapping(value = "/flow/entryCaseIds")
Result<List<Integer>> getEntryCaseIds(@RequestBody EntryRequestDTO params);
```

**参数说明**: `EntryRequestDTO`
- `startTime`: 入职开始时间
- `endTime`: 入职结束时间
- `deptIds`: 部门 ID 列表（可选）

**返回值**: `Result<List<Integer>>` - 入职单据 ID 列表

---

### 6. 应聘数据查询

#### 6.1 查询应聘简历 ID

```java
@PostMapping(value = "/model/getApplyResumeIds")
Result<List<Integer>> getApplyResumeIds(@RequestBody ApplyResumeQueryDTO params);
```

**参数说明**: `ApplyResumeQueryDTO`
- `postIds`: 岗位 ID 列表
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**返回值**: `Result<List<Integer>>` - 简历 ID 列表

---

### 7. 面试评价统计

#### 7.1 查询面试评价

```java
@PostMapping(value = "/flowActionTrace/interviewSuggestion")
Result<List<InterviewSuggestionDTO>> getInterviewSuggestion(
    @RequestBody InterviewSuggestionRequestDTO params
);
```

**参数说明**: `InterviewSuggestionRequestDTO`
- `flowMainIds`: 流程主 ID 列表（可选）
- `employeeIds`: 候选人 ID 列表（可选）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**返回值**: `Result<List<InterviewSuggestionDTO>>`

---

#### 7.2 根据 RID 查询面试评价

```java
@PostMapping(value = "/flowActionTrace/interviewSuggestionByRID")
Result<List<InterviewSuggestionDTO>> getInterviewSuggestionByRID(
    @RequestBody InterviewSuggestionRequestDTO params
);
```

**使用示例**:

```java
// 查询候选人的所有面试评价
InterviewSuggestionRequestDTO request = new InterviewSuggestionRequestDTO();
request.setEmployeeIds(Arrays.asList(100001, 100002));

Result<List<InterviewSuggestionDTO>> result = 
    efficiencyApi.getInterviewSuggestion(request);

if (result.isSuccess()) {
    result.getData().forEach(suggestion -> {
        log.info("候选人 {}: 面试评价 {}", 
            suggestion.getEmployeeId(), 
            suggestion.getSuggestion());
    });
}
```

---

#### 7.3 查询面试结果

```java
@PostMapping(value = "/model/getInterviewResult")
Result<List<ModelInterviewResultDTO>> getInterviewResult(
    @RequestBody InterviewResultQueryDTO query
);
```

**参数说明**: `InterviewResultQueryDTO`
- `flowMainIds`: 流程主 ID 列表
- `stepIds`: 环节 ID 列表（可选）

**返回值**: `Result<List<ModelInterviewResultDTO>>`

---

### 8. 岗位申请记录

#### 8.1 查询岗位申请记录

```java
@PostMapping(value = "/model/getPostApply")
Result<List<ModelPostApplyDTO>> getPostApply(@RequestBody PostApplyQueryDTO query);
```

**参数说明**: `PostApplyQueryDTO`
- `postIds`: 岗位 ID 列表
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**返回值**: `Result<List<ModelPostApplyDTO>>`

---

### 9. 流程待办查询（重库）

#### 9.1 查询流程待办（V_ProcessFlowTrace 视图）

```java
@PostMapping(value = "/flowActionTrace/getFlowTraces")
Result<List<FlowActionTrace>> getFlowTraces(@RequestBody FlowTraceRequestDTO query);
```

**说明**: 查询的是重库 `V_ProcessFlowTrace` 视图数据

**参数说明**: `FlowTraceRequestDTO`
- `flowMainIds`: 流程主 ID 列表
- `traceIds`: 待办 ID 列表（可选）
- `status`: 待办状态（可选）

---

#### 9.2 查询环节统计数据

```java
@PostMapping(value = "/flowActionTrace/getSubmitStepCount")
Result<List<StepCountDTO>> getSubmitStepCount(@RequestBody FlowTraceRequestDTO params);
```

**返回值**: `Result<List<StepCountDTO>>` - 各环节统计数据

---

### 10. 候选人面试数据

#### 10.1 查询候选人面试评价（T+1 数据）

```java
@PostMapping(value = "/flowActionTrace/getCandidateInterviews")
Result<List<CandidateInterviewsDTO>> getCandidateInterviews(
    @RequestBody InterviewSuggestionRequestDTO params
);
```

**说明**: 重库 T+1 数据，延迟一天

---

#### 10.2 查询候选人面试评价（近实时）

```java
@GetMapping(value = "/flowActionTrace/getInterviews")
Result<List<CandidateInterviewDTO>> getInterviews(
    @RequestParam(value = "employeeId") Integer employeeId
);
```

**参数说明**:
- `employeeId`: 候选人 ID

**返回值**: `Result<List<CandidateInterviewDTO>>`

**使用示例**:

```java
// 查询候选人的近实时面试评价
Result<List<CandidateInterviewDTO>> result = 
    efficiencyApi.getInterviews(100001);

if (result.isSuccess()) {
    result.getData().forEach(interview -> {
        log.info("面试时间: {}, 评价: {}", 
            interview.getInterviewTime(), 
            interview.getEvaluation());
    });
}
```

---

## 📊 数据模型

### FlowInfoDTO

```java
public class FlowInfoDTO {
    private Long flowMainId;          // 流程主 ID
    private Integer flowId;           // 流程 ID
    private Integer stateId;          // 流程状态
    private Integer postId;           // 岗位 ID
    private String postName;          // 岗位名称
    private Date createTime;          // 创建时间
}
```

### OfferStatisticsDTO

```java
public class OfferStatisticsDTO {
    private Integer totalCount;       // Offer 总数
    private Integer acceptCount;      // 接受数
    private Integer rejectCount;      // 拒绝数
    private Double acceptRate;        // 接受率
}
```

### InterviewTraceDTO

```java
public class InterviewTraceDTO {
    private Long traceId;             // 待办 ID
    private Long flowMainId;          // 流程主 ID
    private Integer stepId;           // 环节 ID
    private Integer ownerId;          // 处理人 ID
    private Integer status;           // 待办状态
    private Date createTime;          // 创建时间
}
```

---

## ⚠️ 注意事项

### 1. 数据源区分

- **实时数据**: 直接查询业务库，数据及时但性能开销大
- **T+1 数据**: 查询重库，延迟一天但性能好

### 2. 批量查询限制

- 流程 ID 列表建议不超过 100 个
- 大批量查询建议分批次

### 3. 时间范围

- 查询时间范围建议不超过 3 个月
- 超大时间范围可能导致查询超时

### 4. 性能优化

- 优先使用批量接口
- 合理设置分页大小
- 避免频繁查询

---

## 💡 最佳实践

### 定时统计 Offer 数据

```java
@Scheduled(cron = "0 0 2 * * ?") // 每天凌晨 2 点执行
public void dailyOfferStatistics() {
    try {
        // 统计昨天的 Offer 数据
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime todayStart = yesterday.toLocalDate().atStartOfDay();
        LocalDateTime todayEnd = todayStart.plusDays(1).minusSeconds(1);
        
        OfferStatisticsRequestDTO request = new OfferStatisticsRequestDTO();
        request.setStartTime(todayStart);
        request.setEndTime(todayEnd);
        
        Result<OfferStatisticsDTO> result = efficiencyApi.getOfferStatisticsV1(request);
        
        if (result.isSuccess()) {
            OfferStatisticsDTO stats = result.getData();
            // 保存统计结果到数据库
            saveStatistics(stats);
            
            log.info("昨日 Offer 统计完成: 总数 {}, 接受率 {}%",
                stats.getTotalCount(),
                stats.getAcceptRate() * 100);
        }
    } catch (Exception e) {
        log.error("Offer 统计失败", e);
    }
}
```

### 检查超时待办

```java
@Scheduled(cron = "0 0 */6 * * ?") // 每 6 小时执行一次
public void checkTimeoutTraces() {
    try {
        InterviewBackLibDTO request = new InterviewBackLibDTO();
        request.setStartTime(LocalDateTime.now().minusDays(7));
        request.setEndTime(LocalDateTime.now());
        
        // 查询超时未提交的待办
        Result<List<InterviewBackLibFlowDTO>> result = 
            efficiencyApi.getTraceUnCommitBackLibFlow(request);
        
        if (result.isSuccess() && !result.getData().isEmpty()) {
            // 发送提醒通知
            result.getData().forEach(flow -> {
                sendTimeoutNotification(flow);
            });
            
            log.info("发现 {} 个超时待办", result.getData().size());
        }
    } catch (Exception e) {
        log.error("检查超时待办失败", e);
    }
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [流程管理 API](./flow-api.md)
- [面试管理 API](./interview-api.md)

---

**最后更新**: 2025-11-12
