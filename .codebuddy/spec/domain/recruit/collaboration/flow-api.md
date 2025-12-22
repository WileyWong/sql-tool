# 流程管理 API

> **领域**: Flow | **版本**: v1.9

流程管理模块提供招聘流程追踪、待办管理等核心功能，是招聘协同平台的流程中枢。

---

## 📋 目录

- [服务信息](#服务信息)
- [核心概念](#核心概念)
- [接口分类](#接口分类)
  - [流程主数据管理](#流程主数据管理)
  - [待办追踪管理](#待办追踪管理)
  - [流程状态查询](#流程状态查询)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [数据模型](#数据模型)

---

## 服务信息

### FlowApi

**服务名称**: `hr-flowtrace-center-api`  
**配置类**: `RecruitFeignHeaderInterceptor`  
**服务地址**: 
- **生产环境**: `${NTS_GW_ESB}/flowtrace-center`
- **测试环境**: `${DEV_NTS_GW_ESB}/flowtrace-center`

**认证方式**: 自动添加 Header `X-CORE-HR: tencent`

---

## 核心概念

### FlowMain（流程主数据）

流程主数据记录招聘流程的基本信息和当前状态。

**关键属性**:
- `flowMainId`: 流程主键 ID（数据库自增）
- `flowInstanceId`: 流程引擎实例 ID（第三方流程引擎）
- `flowId`: 流程类型编号（如：社招流程、校招流程）
- `stateId`: 流程状态（进行中、已完成、已终止）
- `postId`: 关联的岗位 ID

### FlowActionTrace（待办追踪）

待办追踪记录流程中每个环节的待办和已办信息。

**关键属性**:
- `traceId`: 待办主键 ID
- `flowMainId`: 关联的流程主键
- `stepId`: 环节编号（如：简历筛选、初试、复试）
- `ownerId`: 待办处理人 ID
- `stateId`: 待办状态（待处理、已处理、已取消）

### 流程与待办的关系

```
FlowMain (1) ──── (N) FlowActionTrace
   流程            待办追踪
   
一个流程包含多个待办，每个待办对应一个环节
```

---

## 接口分类

## 流程主数据管理

### 1.1 查询流程主数据

#### 根据 FlowInstanceId 获取 FlowMain

```java
@GetMapping("/api/IFCFlowMain/GetIFCFlowMainByFlowInstanceId")
FlowMain getFlowMainByFlowInstanceId(@RequestParam("flowinstanceId") long flowinstanceId);
```

**使用场景**: 从流程引擎回调时，通过引擎实例 ID 查询本地流程数据

**示例**:
```java
// 流程引擎回调时传入 flowInstanceId
long flowInstanceId = 1234567890L;
FlowMain flowMain = flowApi.getFlowMainByFlowInstanceId(flowInstanceId);
System.out.println("流程 ID: " + flowMain.getFlowMainId());
```

---

#### 根据 FlowMainId 获取 FlowMain

```java
@GetMapping("/api/IFCFlowMain/GetIFCFlowMain")
FlowMain getFlowMain(@RequestParam("flowMainId") long flowMainId);
```

**使用场景**: 业务代码中通过本地流程 ID 查询流程详情

**示例**:
```java
long flowMainId = 10001L;
FlowMain flowMain = flowApi.getFlowMain(flowMainId);
if (flowMain != null) {
    log.info("流程状态: {}", flowMain.getStateId());
}
```

---

#### 批量获取 FlowMain

```java
@PostMapping("/api/IFCFlowMain/GetFlowMainList")
List<FlowMain> getFlowMainList(@RequestBody List<Long> flowMainIds);
```

**使用场景**: 批量查询多个流程，避免循环调用

**示例**:
```java
List<Long> flowMainIds = Arrays.asList(10001L, 10002L, 10003L);
List<FlowMain> flowMains = flowApi.getFlowMainList(flowMainIds);
flowMains.forEach(flow -> {
    log.info("流程 {} 状态: {}", flow.getFlowMainId(), flow.getStateId());
});
```

---

#### 根据岗位 ID 查询流程列表

```java
// 基础查询
@GetMapping("/api/IFCFlowMain/GetFlowMainByPost")
List<FlowMain> GetFlowMainByPost(
    @RequestParam("postId") Long postId,
    @RequestParam(value = "flowIds", required = false) List<Integer> flowIds
);

// 带状态过滤
@GetMapping("/api/IFCFlowMain/GetFlowMainByPost")
List<FlowMain> GetFlowMainByPost(
    @RequestParam("postId") Long postId,
    @RequestParam(value = "flowIds", required = false) List<Integer> flowIds,
    @RequestParam(value = "stateIds", required = false) List<Integer> stateIds
);
```

**使用场景**: 查询某个岗位下的所有流程，支持流程类型和状态过滤

**示例**:
```java
// 查询岗位下所有进行中的社招流程
Long postId = 1001L;
List<Integer> flowIds = Arrays.asList(1); // 1=社招流程
List<Integer> stateIds = Arrays.asList(1); // 1=进行中

List<FlowMain> flows = flowApi.GetFlowMainByPost(postId, flowIds, stateIds);
log.info("岗位 {} 有 {} 个进行中的社招流程", postId, flows.size());
```

---

### 1.2 创建、更新、删除流程

#### 创建 FlowMain

```java
@PostMapping("/api/IFCFlowMain/AddIFCFlowMain")
Long addIfcFlowMain(@RequestBody FlowMain flowMain);
```

**返回值**: 新创建的 FlowMainId

**示例**:
```java
FlowMain flowMain = new FlowMain();
flowMain.setFlowId(1);                     // 流程类型：社招
flowMain.setStateId(1);                    // 流程状态：进行中
flowMain.setPostId(1001L);                 // 关联岗位
flowMain.setFlowInstanceId(1234567890L);   // 流程引擎实例ID
flowMain.setOwnerId(100001);               // 流程所有人

Long flowMainId = flowApi.addIfcFlowMain(flowMain);
log.info("流程创建成功，ID: {}", flowMainId);
```

---

#### 更新 FlowMain

```java
@PostMapping("/api/IFCFlowMain/UpdateIFCFlowMain")
Boolean updateIfcFlowMain(@RequestBody FlowMain flowMain);
```

**示例**:
```java
FlowMain flowMain = flowApi.getFlowMain(flowMainId);
flowMain.setStateId(2); // 更新状态为已完成

Boolean success = flowApi.updateIfcFlowMain(flowMain);
if (success) {
    log.info("流程状态更新成功");
}
```

---

#### 删除 FlowMain

```java
@GetMapping("/api/IFCFlowMain/DeleteIFCFlowMain")
Boolean deleteIfcFlowMain(@RequestParam("flowMainId") long flowMainId);
```

**注意**: 删除流程前建议先检查是否有关联的待办

**示例**:
```java
// 检查待办
List<FlowActionTrace> traces = flowApi.getAllTasksByFlowMainId(flowMainId);
if (traces.isEmpty()) {
    Boolean success = flowApi.deleteIfcFlowMain(flowMainId);
    log.info("流程删除成功");
} else {
    log.warn("流程还有 {} 个待办，无法删除", traces.size());
}
```

---

## 待办追踪管理

### 2.1 查询待办追踪

#### 获取所有待办和已办

```java
@GetMapping("/api/IFCFlowActionTrace/GetAllTasksByFlowMainId")
List<FlowActionTrace> getAllTasksByFlowMainId(@RequestParam("flowMainId") long flowmainId);
```

**使用场景**: 查看流程的完整执行历史

**示例**:
```java
List<FlowActionTrace> allTasks = flowApi.getAllTasksByFlowMainId(flowMainId);
log.info("流程总共有 {} 个待办/已办", allTasks.size());

// 统计待办和已办数量
long pendingCount = allTasks.stream()
    .filter(t -> t.getStateId() == 1)
    .count();
log.info("待处理: {}, 已处理: {}", pendingCount, allTasks.size() - pendingCount);
```

---

#### 获取待办（未完成的）

```java
@GetMapping("/api/IFCFlowActionTrace/GetHandlerTasksByFlowMainId")
List<FlowActionTrace> getHandlerTasksByFlowMainId(@RequestParam("flowMainId") long flowmainId);
```

**使用场景**: 查询需要处理的待办

**示例**:
```java
List<FlowActionTrace> pendingTasks = flowApi.getHandlerTasksByFlowMainId(flowMainId);
pendingTasks.forEach(task -> {
    log.info("待办 {}: 环节 {}, 处理人 {}", 
        task.getTraceId(), task.getStepId(), task.getOwnerId());
});
```

---

#### 获取单个待办追踪

```java
@GetMapping("/api/IFCFlowActionTrace/GetIFCFlowActionTrace")
FlowActionTrace getIfcFlowActionTrace(@RequestParam("traceId") long traceId);
```

---

#### 批量获取 FlowActionTrace

```java
@PostMapping("/api/IFCFlowActionTrace/GetFlowActionTraceList")
List<FlowActionTrace> getFlowActionTraceList(@RequestBody List<Long> traceIds);
```

**最佳实践**: 批量查询，避免循环调用

---

#### 获取指定环节的待办已办

```java
@GetMapping("/api/IFCFlowActionTrace/getStepTasksByFlowMainId")
List<FlowActionTrace> getStepTasksByFlowMainId(
    @RequestParam("flowMainId") Long flowMainId,
    @RequestParam("stepId") Integer stepId
);
```

**使用场景**: 查询流程在某个环节的所有待办（含已完成）

**示例**:
```java
// 查询复试环节的所有待办
Integer reviewStepId = 3;
List<FlowActionTrace> reviewTasks = flowApi.getStepTasksByFlowMainId(flowMainId, reviewStepId);
log.info("复试环节共有 {} 个待办", reviewTasks.size());
```

---

#### 获取流程的最新环节

```java
@GetMapping("/api/IFCFlowActionTrace/GetCurTasksByFlowMainIds")
List<FlowActionTrace> getCurTasksByFlowMainIds(@RequestParam("flowMainIds") List<Long> flowMainIds);
```

**说明**: 如果同一环节有多个待办，返回最近的一个

**使用场景**: 批量查询多个流程的当前进度

**示例**:
```java
List<Long> flowMainIds = Arrays.asList(10001L, 10002L, 10003L);
List<FlowActionTrace> currentTasks = flowApi.getCurTasksByFlowMainIds(flowMainIds);

currentTasks.forEach(task -> {
    log.info("流程 {} 当前在环节 {}", task.getFlowMainId(), task.getStepId());
});
```

---

#### 获取处在某个环节的未完待办

```java
@GetMapping("/api/IFCFlowActionTrace/GetHandlerFlowActionTraceByStepId")
List<FlowActionTrace> getHandlerFlowActionTraceByStepId(
    @RequestParam("flowId") Integer flowId,
    @RequestParam("stepId") Integer stepId
);
```

**使用场景**: 查询全局范围内某个环节的所有待办

**示例**:
```java
// 查询所有社招流程中，复试环节的待办
Integer flowId = 1;      // 社招流程
Integer stepId = 3;      // 复试环节

List<FlowActionTrace> tasks = flowApi.getHandlerFlowActionTraceByStepId(flowId, stepId);
log.info("所有社招流程的复试待办数: {}", tasks.size());
```

---

### 2.2 创建、更新、删除待办

#### 创建待办 Trace

```java
@PostMapping("/api/IFCFlowActionTrace/AddIFCFlowActionTrace")
Long addIfcFlowActionTrace(@RequestBody FlowActionTrace trace);
```

**示例**:
```java
FlowActionTrace trace = new FlowActionTrace();
trace.setFlowMainId(flowMainId);
trace.setStepId(1);                 // 环节：简历筛选
trace.setOwnerId(100001);           // 处理人
trace.setStateId(1);                // 状态：待处理
trace.setActionName("简历筛选");

Long traceId = flowApi.addIfcFlowActionTrace(trace);
log.info("待办创建成功，ID: {}", traceId);
```

---

#### 创建待办并生成 MYOA

```java
@PostMapping("/api/IFCFlowActionTrace/AddIFCFlowActionTraceAndMyOA")
Long addIFCFlowActionTraceAndMyOA(@RequestBody FlowActionTrace trace);
```

**使用场景**: 需要在 MYOA 系统中同步显示待办时使用

---

#### 更新待办 Trace

```java
@PostMapping("/api/IFCFlowActionTrace/UpdateIFCFlowActionTrace")
Boolean updateFlowActionTrace(@RequestBody FlowActionTrace trace);
```

**示例**:
```java
FlowActionTrace trace = flowApi.getIfcFlowActionTrace(traceId);
trace.setStateId(2);                // 状态：已完成
trace.setFinishTime(new Date());    // 完成时间
trace.setResult("通过");            // 处理结果

Boolean success = flowApi.updateFlowActionTrace(trace);
```

---

#### 更新待办并同步 MYOA

```java
@PostMapping("/api/IFCFlowActionTrace/UpdateIFCFlowActionTraceAndMyOA")
Boolean updateIFCFlowActionTraceAndMyOA(@RequestBody FlowActionTrace trace);
```

---

#### 更新待办（支持并行 Hold）

```java
@PostMapping("/api/IFCFlowActionTrace/UpdateIFCFlowActionTraceWithHoldParallel")
Boolean updateIFCFlowActionTraceWithHoldParallel(@RequestBody FlowActionTrace trace);
```

**使用场景**: 并行流程场景，某个分支需要 Hold 时使用

---

#### 删除待办 Trace

```java
@GetMapping("/api/IFCFlowActionTrace/DeleteIFCFlowActionTrace")
Boolean deleteIfcFlowActionTrace(@RequestParam("traceId") long traceId);
```

---

### 2.3 待办检查

#### 判断待办是否已存在

```java
@GetMapping("/api/IFCFlowActionTrace/IsExitHandlerTaskByOwnerId")
Boolean isExistHandlerTaskByOwnerId(
    @RequestParam("employeeId") Integer employeeId,
    @RequestParam("recruitPostId") Integer recruitPostId,
    @RequestParam("ownerId") Integer ownerId
);
```

**使用场景**: 创建待办前，检查是否已经存在，避免重复创建

**示例**:
```java
Integer employeeId = 12345;
Integer recruitPostId = 1001;
Integer ownerId = 100001;

Boolean exists = flowApi.isExistHandlerTaskByOwnerId(employeeId, recruitPostId, ownerId);
if (!exists) {
    // 创建待办
    flowApi.addIfcFlowActionTrace(trace);
} else {
    log.info("待办已存在，无需重复创建");
}
```

---

## 使用示例

### 完整流程：创建流程并添加待办

```java
@Service
public class FlowService {
    
    @Autowired
    private FlowApi flowApi;
    
    /**
     * 创建招聘流程
     */
    public Long createRecruitFlow(Long postId, Integer ownerId) {
        // 1. 创建流程主数据
        FlowMain flowMain = new FlowMain();
        flowMain.setFlowId(1);                  // 社招流程
        flowMain.setStateId(1);                 // 进行中
        flowMain.setPostId(postId);             // 关联岗位
        flowMain.setOwnerId(ownerId);           // 流程所有人
        flowMain.setCreateTime(new Date());
        
        Long flowMainId = flowApi.addIfcFlowMain(flowMain);
        log.info("流程创建成功，ID: {}", flowMainId);
        
        // 2. 创建首个待办：简历筛选
        FlowActionTrace trace = new FlowActionTrace();
        trace.setFlowMainId(flowMainId);
        trace.setStepId(1);                     // 简历筛选环节
        trace.setOwnerId(ownerId);              // 处理人
        trace.setStateId(1);                    // 待处理
        trace.setActionName("简历筛选");
        trace.setCreateTime(new Date());
        
        Long traceId = flowApi.addIfcFlowActionTrace(trace);
        log.info("待办创建成功，ID: {}", traceId);
        
        return flowMainId;
    }
}
```

---

### 流程流转：完成当前待办，创建下一环节待办

```java
/**
 * 完成当前待办并流转到下一环节
 */
public void completeAndFlowToNext(Long traceId, Integer nextStepId, Integer nextOwnerId) {
    // 1. 完成当前待办
    FlowActionTrace currentTrace = flowApi.getIfcFlowActionTrace(traceId);
    currentTrace.setStateId(2);             // 已完成
    currentTrace.setFinishTime(new Date());
    currentTrace.setResult("通过");
    
    flowApi.updateFlowActionTrace(currentTrace);
    log.info("待办 {} 已完成", traceId);
    
    // 2. 创建下一环节待办
    FlowActionTrace nextTrace = new FlowActionTrace();
    nextTrace.setFlowMainId(currentTrace.getFlowMainId());
    nextTrace.setStepId(nextStepId);
    nextTrace.setOwnerId(nextOwnerId);
    nextTrace.setStateId(1);                // 待处理
    nextTrace.setActionName("下一环节");
    nextTrace.setCreateTime(new Date());
    
    Long nextTraceId = flowApi.addIfcFlowActionTrace(nextTrace);
    log.info("下一环节待办创建成功，ID: {}", nextTraceId);
}
```

---

### 查询流程进度

```java
/**
 * 查询流程当前进度
 */
public String getFlowProgress(Long flowMainId) {
    // 获取所有待办
    List<FlowActionTrace> allTasks = flowApi.getAllTasksByFlowMainId(flowMainId);
    
    // 获取当前环节
    List<FlowActionTrace> currentTasks = flowApi.getCurTasksByFlowMainIds(
        Arrays.asList(flowMainId)
    );
    
    if (currentTasks.isEmpty()) {
        return "流程已完成";
    }
    
    FlowActionTrace currentTask = currentTasks.get(0);
    long completedCount = allTasks.stream()
        .filter(t -> t.getStateId() == 2)
        .count();
    
    return String.format("当前环节: %s, 已完成 %d/%d", 
        currentTask.getActionName(), 
        completedCount, 
        allTasks.size());
}
```

---

### 批量查询优化

```java
/**
 * 批量查询流程状态（高性能）
 */
public Map<Long, String> batchGetFlowStatus(List<Long> flowMainIds) {
    Map<Long, String> statusMap = new HashMap<>();
    
    // 批量查询流程主数据
    List<FlowMain> flowMains = flowApi.getFlowMainList(flowMainIds);
    
    // 批量查询当前环节
    List<FlowActionTrace> currentTasks = flowApi.getCurTasksByFlowMainIds(flowMainIds);
    Map<Long, FlowActionTrace> taskMap = currentTasks.stream()
        .collect(Collectors.toMap(FlowActionTrace::getFlowMainId, t -> t));
    
    // 组装结果
    flowMains.forEach(flow -> {
        FlowActionTrace currentTask = taskMap.get(flow.getFlowMainId());
        String status = currentTask != null 
            ? "环节: " + currentTask.getActionName() 
            : "已完成";
        statusMap.put(flow.getFlowMainId(), status);
    });
    
    return statusMap;
}
```

---

## 最佳实践

### 1. 批量查询优化

**❌ 错误做法**:
```java
// 避免循环调用
for (Long flowMainId : flowMainIds) {
    FlowMain flow = flowApi.getFlowMain(flowMainId);
}
```

**✅ 推荐做法**:
```java
// 使用批量接口
List<FlowMain> flows = flowApi.getFlowMainList(flowMainIds);
```

---

### 2. 待办去重检查

```java
// 创建待办前检查是否已存在
Boolean exists = flowApi.isExistHandlerTaskByOwnerId(employeeId, postId, ownerId);
if (!exists) {
    flowApi.addIfcFlowActionTrace(trace);
}
```

---

### 3. 流程状态机管理

```java
public class FlowStateMachine {
    
    /**
     * 流程状态定义
     */
    public enum FlowState {
        DRAFT(0, "草稿"),
        IN_PROGRESS(1, "进行中"),
        COMPLETED(2, "已完成"),
        CANCELLED(3, "已取消");
        
        private final Integer code;
        private final String name;
        
        // ... 构造函数和方法
    }
    
    /**
     * 待办状态定义
     */
    public enum TaskState {
        PENDING(1, "待处理"),
        COMPLETED(2, "已完成"),
        CANCELLED(3, "已取消");
        
        private final Integer code;
        private final String name;
    }
}
```

---

### 4. 异常处理

```java
@Service
public class SafeFlowService {
    
    @Autowired
    private FlowApi flowApi;
    
    /**
     * 安全查询流程
     */
    public FlowMain getFlowSafely(Long flowMainId) {
        try {
            FlowMain flow = flowApi.getFlowMain(flowMainId);
            if (flow == null) {
                log.warn("流程不存在: {}", flowMainId);
            }
            return flow;
        } catch (FeignException e) {
            log.error("查询流程失败: {}", flowMainId, e);
            return null;
        }
    }
}
```

---

## 数据模型

### FlowMain

```java
public class FlowMain {
    private Long flowMainId;          // 流程主键 ID
    private Long flowInstanceId;      // 流程引擎实例 ID
    private Integer flowId;           // 流程类型编号
    private Integer stateId;          // 流程状态
    private Long postId;              // 关联岗位 ID
    private Integer ownerId;          // 流程所有人 ID
    private Date createTime;          // 创建时间
    private Date updateTime;          // 更新时间
    private String remark;            // 备注
}
```

### FlowActionTrace

```java
public class FlowActionTrace {
    private Long traceId;             // 待办主键 ID
    private Long flowMainId;          // 关联流程主键
    private Integer stepId;           // 环节编号
    private String actionName;        // 待办名称
    private Integer ownerId;          // 处理人 ID
    private Integer stateId;          // 待办状态
    private Date createTime;          // 创建时间
    private Date finishTime;          // 完成时间
    private String result;            // 处理结果
    private String remark;            // 备注
}
```

---

## ⚠️ 注意事项

### 1. FlowMainId vs FlowInstanceId

- **FlowMainId**: 本地数据库自增 ID，用于业务系统内部查询
- **FlowInstanceId**: 流程引擎分配的实例 ID，用于与流程引擎交互

### 2. 待办状态管理

- 创建待办时必须指定 `stepId`（环节编号）
- 更新待办状态时注意是否需要同步 MYOA
- 并行流程使用 `updateIFCFlowActionTraceWithHoldParallel`

### 3. 性能考虑

- 批量查询优先使用 `getFlowMainList` 和 `getFlowActionTraceList`
- 避免循环调用单个查询接口
- 查询当前环节使用 `getCurTasksByFlowMainIds`，自动过滤历史待办

### 4. 数据一致性

- 删除流程前检查是否有关联待办
- 待办创建前检查是否已存在
- 流程状态变更需要同步更新相关待办

---

## 🔗 相关文档

- [API 索引](./index.md)
- [简历管理 API](./resume-api.md)
- [岗位管理 API](./post-api.md)
- [面试管理 API](./interview-api.md)

---

**最后更新**: 2025-11-12
