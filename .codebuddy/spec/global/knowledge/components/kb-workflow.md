# 流程引擎服务接口文档

## 1. 基础信息层

- **服务名称**: 流程引擎服务 (Workflow Engine Service)
- **所属模块**: HR流程引擎平台
- **版本信息**: SDK v7.5-SNAPSHOT (新SDK)，v6.6.2-SNAPSHOT (老SDK)
- **负责人/维护者**: HR流程引擎团队
- **状态标识**: 生产环境稳定运行，推荐使用新SDK

## 2. 功能概述层

- **核心职责**: 提供完整的工作流程管理能力，包括流程定义、流程实例管理、待办处理、委托授权等功能
- **使用场景**: 
  - 需要审批流程的业务场景（如请假、报销、Offer审批等）
  - 需要多人协作处理的工作流场景
  - 需要流程可视化配置和管理的场景
- **设计目的**: 提供统一的流程引擎服务，简化业务系统的流程开发，支持灵活的流程配置和管理
- **业务价值**: 降低业务系统流程开发成本，提供标准化的流程管理能力，支持流程可视化配置

## 3. 接口定义层

### 3.1 流程定义管理

#### 3.1.1 创建流程模型

**接口名称**: `WorkflowClient.createProcessModel(CreateProcessModelRequest request)`

**参数说明**:
```java
public class CreateProcessModelRequest {
    private String tenantId;        // 租户id，内网统一传"tencent"，必传
    private String name;            // 流程名称，必传，长度最大64
    private String bytes;           // bpmn2.0文件内容，必传
    private List<FormReference> referencedForms;  // 流程关联的表单模型
    private ProcessDefinitionStatus status;       // 流程状态（上架/下架）
}
```

**返回值说明**:
```java
public class ProcessDefinitionModel {
    private String tenantId;        // 租户id
    private String definitionId;    // 流程定义id（含版本信息）
    private String processKey;      // 流程id（不含版本）
    private String name;            // 流程名称
    private int version;            // 流程版本号
    private String bytes;           // 流程内容
    private Integer instantCount;   // 流程实例数
    private ProcessDefinitionStatus status; // 流程状态
}
```

#### 3.1.2 更新流程模型

**接口名称**: `WorkflowClient.updateProcessModel(UpdateProcessModelRequest request)`

**参数说明**:
```java
public class UpdateProcessModelRequest {
    private String tenantId;        // 租户id，必传
    private String processKey;      // 流程id，必传
    private String name;            // 流程名称，必传
    private String bytes;           // bpmn2.0文件内容，必传
    private List<FormReference> referencedForms;  // 流程关联的表单模型
}
```

**返回值**: 同 `ProcessDefinitionModel`

#### 3.1.3 查询流程模型

**接口名称**: `WorkflowClient.getProcessModel(GetProcessModelRequest request)`

**参数说明**:
```java
public class GetProcessModelRequest {
    private String tenantId;    // 租户id，必传
    private String processKey;  // 流程id，必传
    private Integer version;    // 版本号，可选（不传则返回最新版本）
}
```

#### 3.1.4 上下架流程

**接口名称**: `WorkflowClient.onlineOrOfflineProcessDefinition(OnlineOrOfflineProcessDefinitionRequest request)`

**参数说明**:
```java
public class OnlineOrOfflineProcessDefinitionRequest {
    private String tenantId;                    // 租户id，必传
    private String processKey;                  // 流程id，必传
    private ProcessDefinitionStatus status;     // 流程状态（0-下架，1-上架），必传
    private String offlineReason;               // 下架原因
}
```

#### 3.1.5 删除流程

**接口名称**: `WorkflowClient.deleteProcessDefinition(DeleteProcessDefinitionRequest request)`

**参数说明**:
```java
public class DeleteProcessDefinitionRequest {
    private String tenantId;        // 租户id，必传
    private String processKey;      // 流程id，必传
    private String deleteReason;    // 删除原因
}
```

### 3.2 发起流程

#### 3.2.1 按流程定义ID发起（指定版本）

**接口名称**: `WorkflowClient.startProcess(StartProcessRequest request)`

**参数说明**:
```java
public class StartProcessRequest {
    private String tenantId;                    // 租户id，必传
    private String starterId;                   // 发起人id，必传
    private String starterName;                 // 发起人名称
    private String businessKey;                 // 流程实例名称，必传
    private String definitionId;                // 流程定义id，必传
    private boolean withVariablesInReturn;      // 是否返回变量，默认false
    private Map<String, Object> variables;      // 流程变量
    private String businessId;                  // 业务方唯一id，可空
}
```

**返回值说明**:
```java
public class ProcessInstance {
    private String id;                          // 流程实例id
    private String businessKey;                 // 流程实例名称
    private String processKey;                  // 流程id
    private String definitionId;                // 流程定义id
    private String definitionName;              // 流程名称
    private Integer definitionVersion;          // 流程版本号
    private Date startTime;                     // 流程实例开始时间
    private Date endTime;                       // 流程实例结束时间
    private String startActivityId;             // 开始节点id
    private ProcessStatus status;               // 流程状态
    private String starterId;                   // 流程发起人id
    private String starterName;                 // 流程发起人名称
    private String tenantId;                    // 租户id
    private List<String> endActivityId;         // 异常结束的节点id
    private Map<String, Object> variables;      // 流程实例变量
    private List<Task> tasks;                   // 所有任务列表
    private List<Task> changedTasks;            // 本次变化的任务列表
    private String businessId;                  // 业务方唯一id
}
```

#### 3.2.2 按流程ID发起（最新版本）

**接口名称**: `WorkflowClient.startProcess(StartProcessRequest request)`

**参数说明**:
```java
public class StartProcessRequest {
    private String tenantId;                    // 租户id，必传
    private String starterId;                   // 发起人id，必传
    private String starterName;                 // 发起人名称
    private String businessKey;                 // 流程实例名称，必传
    private String processKey;                  // 流程id，必传
    private boolean withVariablesInReturn;      // 是否返回变量，默认false
    private Map<String, Object> variables;      // 流程变量
    private String businessId;                  // 业务方唯一id，可空
}
```

**说明**: 使用 `processKey` 而不是 `definitionId`，系统会自动使用该流程的最新版本

### 3.3 待办操作

#### 3.3.1 待办状态说明

```java
public enum TaskStatus {
    REMOVE_SIGN(3, "减签删除"),
    COMPLETED(100, "同意"),
    DISAGREE(4, "不同意"),
    DELETE(-100, "删除"),
    SUSPEND(2, "挂起"),
    DOING(0, "未处理"),
    JUMP(300, "驳回"),
    REJECT(1, "否决")  // 会导致整个流程实例强制终止
}
```

#### 3.3.2 提交待办（同意/不同意/否决）

**接口名称**: `WorkflowClient.completeTask(CompleteTaskRequest request)`

**参数说明**:
```java
public class CompleteTaskRequest {
    private String tenantId;                    // 租户id，必传
    private String taskId;                      // 待办id，必传
    private TaskOperation operation;            // 待办操作，必传
    private Map<String, Object> variables;      // 待办变量
    private boolean withVariablesInReturn;      // 是否返回变量
}

public enum TaskOperation {
    COMPLETED("同意"),
    DISAGREE("不同意"),
    REJECT("否决")  // 此状态会引起整个流程实例强制终止，慎用
}
```

**返回值**: `ProcessInstance`

#### 3.3.3 转交操作

**接口名称**: `WorkflowClient.transferTask(TransferTaskRequest request)`

**参数说明**:
```java
public class TransferTaskRequest {
    private String tenantId;                    // 租户id，必传
    private String taskId;                      // 待办任务id，必传
    private String assignee;                    // 新的审批人id，必传
    private Map<String, Object> variables;      // 待办变量
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**返回值**: `ProcessInstance`

#### 3.3.4 驳回操作

**接口名称**: `WorkflowClient.jumpActivity(JumpActivityRequest request)`

**参数说明**:
```java
public class JumpActivityRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，必传
    private String sourceActivityId;            // 源节点id（当前待办所在节点），必传
    private String targetActivityId;            // 目标节点id（要驳回到的节点），必传
    private Map<String, Object> variables;      // 流程变量
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**返回值**: `ProcessInstance`

#### 3.3.5 加签操作

**接口名称**: `WorkflowClient.addTask(AddTaskRequest request)`

**参数说明**:
```java
public class AddTaskRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，必传
    private String activityId;                  // 要加签的节点id，必传
    private String assignee;                    // 加签的审批人id，必传
    private Map<String, Object> variables;      // 待办变量
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**返回值**: `ProcessInstance`

#### 3.3.6 减签操作

**接口名称**: `WorkflowClient.removeTask(RemoveTaskRequest request)`

**参数说明**:
```java
public class RemoveTaskRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，必传
    private String taskId;                      // 待办id（与activityId+assignee二选一）
    private String activityId;                  // 要减签的节点id
    private String assignee;                    // 减签的审批人id
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**返回值**: `ProcessInstance`

#### 3.3.7 查询待办列表

**接口名称**: `WorkflowClient.queryTasks(QueryTaskRequest request, Integer firstResult, Integer maxResults)`

**参数说明**:
```java
public class QueryTaskRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id
    private String assignee;                    // 审批人id
    private String taskId;                      // 待办id
    private String nameLike;                    // 待办名称模糊搜索
    private TaskStatus status;                  // 根据待办状态过滤
    private Boolean finished;                   // 过滤已完成的待办
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**URL参数**:
- `firstResult`: 分页偏移值
- `maxResults`: 返回数量

**返回值**: `List<Task>`

#### 3.3.8 同步待办到MyOA

**接口名称**: `WorkflowClient.syncMyOATask(SyncMyOATaskRequest request)`

**参数说明**:
```java
public class SyncMyOATaskRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，可选
    private String taskId;                      // 待办id，必传
}
```

### 3.4 流程实例管理

#### 3.4.1 流程状态说明

```java
public enum ProcessStatus {
    TERMINATE(-100, "终止"),
    COMPLETED(100, "已完成"),
    DOING(1, "处理中")
}
```

#### 3.4.2 获取流程实例详情

**接口名称**: `WorkflowClient.getProcessInstance(String processInstanceId)`

**参数**: 
- `processInstanceId`: 流程实例id

**返回值**: `ProcessInstance`

#### 3.4.3 按业务ID获取流程实例

**接口名称**: `WorkflowClient.getProcessInstanceV2(GetProcessInstanceRequest request)`

**参数说明**:
```java
public class GetProcessInstanceRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id（与businessId二选一）
    private Boolean returnTasks;                // 是否返回任务列表
    private boolean withVariablesInReturn;      // 是否返回变量，默认false
    private boolean withDefinitionInReturn;     // 是否返回定义信息，默认false
    private String businessId;                  // 业务方唯一id（与processInstanceId二选一）
}
```

**返回值**: `ProcessInstance`

#### 3.4.4 终止流程实例

**接口名称**: `WorkflowClient.terminateProcessInstance(TerminateProcessInstanceRequest request)`

**参数说明**:
```java
public class TerminateProcessInstanceRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，必传
    private Map<String, Object> variables;      // 变量
    private boolean withVariablesInReturn;      // 是否返回变量
}
```

**返回值**: `ProcessInstance`

### 3.5 变量管理

#### 3.5.1 保存变量（新增或修改）

**接口名称**: `WorkflowClient.saveVariables(SaveVariablesRequest request)`

**参数说明**:
```java
public class SaveVariablesRequest {
    private String tenantId;                        // 租户id，必传
    private String processInstanceId;               // 流程实例id（与taskId二选一）
    private String taskId;                          // 待办id
    private Map<String, Object> variables;          // 流程变量
    private Map<String, Object> localVariables;     // 待办变量
}
```

**返回值**: `Void`

#### 3.5.2 内置变量说明

**流程引擎预置的变量，业务方不应使用以下变量名**:

| 变量名 | 变量类型 | 说明 |
|--------|---------|------|
| processStatus | 流程变量 | 流程状态 |
| starterId | 流程变量 | 流程发起人ID |
| starterOrgId | 流程变量 | 流程发起组织ID |
| starterName | 流程变量 | 流程发起人名称 |
| _ProxyStarterId | 流程变量 | 代理发起人 |
| _BusinessId | 流程变量 | 流程实例业务id |
| delegateVariable | 流程变量 | 自动委托配置变量 |
| initialTaskVariable | 流程变量 | 自动初始化待办变量 |
| taskStatus | 待办变量 | 待办状态 |
| submit_opinion | 待办变量 | 审批动作 |

### 3.6 委托授权

#### 3.6.1 获取被委托人

**接口名称**: `WorkflowClient.getDelegated(GetDelegatedRequest request)`

**参数说明**:
```java
public class GetDelegatedRequest {
    private String delegateStaffId;             // 委托人id，必传
    private Integer workplaceId;                // 委托工作地id
    private Integer mgmtSubjectId;              // 管理主体id
    private Integer staffTypeId;                // 员工类型id
    private Integer mgmtLevelId;                // 管理职级id
    private Integer professionalLevelId;        // 专业职级id
    private String activityId;                  // 步骤id
    private String processKey;                  // 流程key
    private String orgLocationCode;             // 组织编码路径
    private DelegateCustomVariableMap customVariableMap;  // 自定义属性
}
```

**返回值**:
```java
public class Staff {
    private String staffId;     // 员工id
    private String staffName;   // 员工名称
}
```

返回类型: `List<Staff>`

### 3.7 复合操作（事务操作）

**接口名称**: `WorkflowClient.complexOperation(ComplexOperationRequest request)`

**说明**: 支持在同一事务中执行多个操作

**参数说明**:
```java
public class ComplexOperationRequest {
    private String tenantId;                    // 租户id，必传
    private String processInstanceId;           // 流程实例id，必传
    private String staffId;                     // 操作人id
    // 可添加的操作类型：
    // - CompleteTaskRequest（提交待办）
    // - AddTaskRequest（加签）
    // - RemoveTaskRequest（减签）
    // - BatchAddTaskRequest（批量加签）
    // - TransferTaskRequest（转交）
}
```

**使用示例**:
```java
ComplexOperationRequest request = new ComplexOperationRequest()
    .setProcessInstanceId("291221015814471680")
    .transferTaskRequest(new TransferTaskRequest()
        .setTaskId("291221015864803339")
        .setAssignee("272940"))
    .addTaskRequest(new AddTaskRequest()
        .setActivityId("r2")
        .setAssignee("272940"))
    .removeTaskRequest(new RemoveTaskRequest()
        .setTaskId("291221015864803339"))
    .setTenantId("tencent")
    .setStaffId("37225");

ResponseInfo<ProcessInstance> responseInfo = workflowClient.complexOperation(request);
```

### 3.8 远程审批人接口

**说明**: 业务系统可提供接口供流程引擎调用，返回审批人列表

**接口规范**:
- **Method**: POST
- **Content-Type**: application/json

**请求体**:
```json
{
    "starterId": "37225",
    "processInstanceId": "181892416180064256",
    "definitionId": "Process_1652793525398:2:181885070863241216",
    "processKey": "Process_1652793525398",
    "businessKey": "xxx-审批流程",
    "roleCode": "dd4822cd-4ba1-4f5f-af24-a3fff8e53aa1",
    "activityId": "Activity_1ijkwtc"
}
```

**返回格式**:
```json
{
    "code": 0,
    "success": true,
    "msg": "success",
    "data": {
        "members": [
            {
                "approver": {
                    "staffId": "37225",
                    "staffName": "stoneldeng"
                },
                "delegator": {
                    "staffId": "48785",
                    "staffName": "haitaozhu"
                }
            }
        ]
    }
}
```

## 3.9 HTTP接口（非Java语言）

### 3.9.1 HTTP接入说明

**适用场景**: 非Java语言（如Python、Node.js、Go等）接入流程引擎

**请求头配置**:

| 请求头名称 | 是否必填 | 说明 |
|-----------|---------|------|
| X-WORKFLOW-APP | 是 | 应用编码，一般和服务市场分配的appname保持一致 |
| X-WORKFLOW-TENANT | 是 | 租户，内网请传"tencent" |
| staffid | 否 | 员工id |
| staffname | 否 | 员工名称 |
| Content-Type | 是 | application/json |

**说明**: 除了上述Header外，还需传入ntsgw网关header，参考[微服务网关签名算法](https://iwiki.woa.com/p/4009335092)

**统一返回结构**:
```json
{
    "code": 0,
    "success": true,
    "msg": "",
    "data": Object
}
```

### 3.9.2 创建流程定义模型 (HTTP)

**Path**: `POST /sdk/process-definition/createProcessModel`

**请求参数**:
```json
{
    "name": "流程名称",
    "bytes": "bpmn2.0文件内容",
    "referencedForms": [
        {
            "formCode": "表单资源编码",
            "activityId": "引用表单的节点ID",
            "activityName": "引用表单的节点名称",
            "activityType": "节点类型"
        }
    ],
    "tenantId": "tencent"
}
```

**返回数据**:
```json
{
    "success": true,
    "code": 0,
    "msg": "成功",
    "data": {
        "tenantId": "tencent",
        "definitionId": "Process_xxx:1:123456",
        "processKey": "Process_xxx",
        "name": "流程名称",
        "version": 1,
        "bytes": "bpmn2.0文件内容",
        "instantCount": 0
    }
}
```

### 3.9.3 更新流程模型 (HTTP)

**Path**: `POST /sdk/process-definition/updateProcessModel`

**请求参数**:
```json
{
    "processKey": "Process_xxx",
    "name": "流程名称",
    "bytes": "bpmn2.0文件内容",
    "referencedForms": [],
    "tenantId": "tencent"
}
```

### 3.9.4 查询流程模型 (HTTP)

**Path**: `POST /sdk/process-definition/getProcessModel`

**请求参数**:
```json
{
    "processKey": "Process_xxx",
    "version": 1,
    "tenantId": "tencent"
}
```

**说明**: `version`参数非必填，不传则返回最新版本

### 3.9.5 发起流程 (HTTP)

**Path**: `POST /sdk/process/startProcess`

**请求参数**:
```json
{
    "tenantId": "tencent",
    "starterId": "37225",
    "starterName": "张三",
    "businessKey": "报销申请-20230101",
    "processKey": "Process_xxx",
    "objectVariables": {
        "申请金额": {
            "type": "integer",
            "value": 10000
        },
        "申请人": {
            "type": "string",
            "value": "张三"
        }
    },
    "withVariablesInReturn": false
}
```

**变量类型说明**:

`objectVariables`中的变量结构：
```json
{
    "变量名": {
        "type": "数据类型",
        "value": "数据值",
        "valueInfo": {
            "objectTypeName": "对象类型名称",
            "serializationDataFormat": "application/json",
            "transient": false
        }
    }
}
```

支持的数据类型: `integer`, `long`, `float`, `double`, `string`, `object`, `json`

### 3.9.6 提交待办 (HTTP)

**Path**: `POST /sdk/task/completeTask`

**请求参数**:
```json
{
    "taskId": "待办任务id",
    "operation": "COMPLETED",
    "objectVariables": {},
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

**operation取值**:
- `COMPLETED`: 同意
- `DISAGREE`: 不同意
- `REJECT`: 否决（会强制终止整个流程）

### 3.9.7 加签操作 (HTTP)

**Path**: `POST /sdk/task/addTask`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "activityId": "节点id",
    "assignee": "加签的审批人id",
    "objectVariables": {},
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

### 3.9.8 减签操作 (HTTP)

**Path**: `POST /sdk/task/removeTask`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "taskId": "待办id",
    "activityId": "节点id",
    "assignee": "减签的审批人id",
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

**说明**: `taskId`和`[activityId, assignee]`必传其一

### 3.9.9 转交操作 (HTTP)

**Path**: `POST /sdk/task/transferTask`

**请求参数**:
```json
{
    "taskId": "待办任务id",
    "assignee": "新的审批人id",
    "objectVariables": {},
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

### 3.9.10 驳回操作 (HTTP)

**Path**: `POST /sdk/task/jumpActivity`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "sourceActivityId": "源节点id",
    "targetActivityId": "目标节点id",
    "objectVariables": {},
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

### 3.9.11 查询待办列表 (HTTP)

**Path**: `POST /sdk/task/queryTasks?firstResult=0&maxResults=20`

**Query参数**:
- `firstResult`: 分页偏移值
- `maxResults`: 返回数量

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "assignee": "审批人id",
    "taskId": "待办id",
    "nameLike": "待办名称（模糊搜索）",
    "status": "待办状态",
    "finished": false,
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

**返回数据**:
```json
{
    "success": true,
    "code": 0,
    "msg": "成功",
    "data": [
        {
            "id": "待办任务id",
            "name": "任务名称",
            "assignee": "审批人id",
            "startTime": "2023-01-01 10:00:00",
            "endTime": null,
            "owner": "待办拥有者id",
            "definitionId": "流程定义id",
            "processInstanceId": "流程实例id",
            "activityId": "节点id",
            "status": "DOING",
            "tenantId": "tencent",
            "variables": {}
        }
    ]
}
```

### 3.9.12 查询可驳回节点 (HTTP)

**Path**: `POST /sdk/task/queryJumpActivity`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "activityId": "当前节点id",
    "tenantId": "tencent"
}
```

**返回数据**:
```json
{
    "success": true,
    "code": 0,
    "msg": "成功",
    "data": [
        {
            "activityId": "节点id",
            "activityName": "节点名称"
        }
    ]
}
```

### 3.9.13 获取流程实例详情 (HTTP)

**Path**: `POST /sdk/process-instance/getProcessInstance`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

### 3.9.14 获取节点实例列表 (HTTP)

**Path**: `POST /sdk/activity-instance`

**请求参数**:
```json
{
    "processInstanceId": "流程实例id",
    "activityId": "节点id",
    "finished": false,
    "withVariablesInReturn": false,
    "tenantId": "tencent"
}
```

**返回数据**:
```json
{
    "success": true,
    "code": 0,
    "msg": "成功",
    "data": [
        {
            "activity": {
                "id": "节点id",
                "name": "节点名称",
                "activityType": "节点类型",
                "approvalType": "审批类型"
            },
            "result": "节点实例结果",
            "status": "节点实例状态",
            "updateTime": "最新更新时间",
            "tasks": [],
            "variables": {}
        }
    ]
}
```

### 3.9.15 HTTP接口完整调用示例 (Python)

```python
import requests
import json
import hashlib
import time

class WorkflowHttpClient:
    def __init__(self, base_url, app_code, gw_app_id, gw_app_token):
        self.base_url = base_url
        self.app_code = app_code
        self.gw_app_id = gw_app_id
        self.gw_app_token = gw_app_token
    
    def _get_headers(self, staff_id=None, staff_name=None):
        """构建请求头"""
        headers = {
            'Content-Type': 'application/json',
            'X-WORKFLOW-APP': self.app_code,
            'X-WORKFLOW-TENANT': 'tencent'
        }
        
        if staff_id:
            headers['staffid'] = staff_id
        if staff_name:
            headers['staffname'] = staff_name
            
        # 添加网关签名相关header
        # 具体签名算法参考: https://iwiki.woa.com/p/4009335092
        
        return headers
    
    def start_process(self, process_key, starter_id, starter_name, 
                     business_key, variables=None):
        """发起流程"""
        url = f"{self.base_url}/sdk/process/startProcess"
        
        data = {
            'tenantId': 'tencent',
            'starterId': starter_id,
            'starterName': starter_name,
            'businessKey': business_key,
            'processKey': process_key,
            'withVariablesInReturn': False
        }
        
        # 转换变量格式
        if variables:
            object_variables = {}
            for key, value in variables.items():
                var_type = self._get_variable_type(value)
                object_variables[key] = {
                    'type': var_type,
                    'value': value
                }
            data['objectVariables'] = object_variables
        
        headers = self._get_headers(starter_id, starter_name)
        response = requests.post(url, json=data, headers=headers)
        
        return response.json()
    
    def complete_task(self, task_id, operation='COMPLETED', 
                     variables=None):
        """提交待办"""
        url = f"{self.base_url}/sdk/task/completeTask"
        
        data = {
            'tenantId': 'tencent',
            'taskId': task_id,
            'operation': operation,
            'withVariablesInReturn': False
        }
        
        if variables:
            object_variables = {}
            for key, value in variables.items():
                var_type = self._get_variable_type(value)
                object_variables[key] = {
                    'type': var_type,
                    'value': value
                }
            data['objectVariables'] = object_variables
        
        headers = self._get_headers()
        response = requests.post(url, json=data, headers=headers)
        
        return response.json()
    
    def query_tasks(self, assignee, process_instance_id=None, 
                   finished=False, first_result=0, max_results=20):
        """查询待办列表"""
        url = f"{self.base_url}/sdk/task/queryTasks"
        
        params = {
            'firstResult': first_result,
            'maxResults': max_results
        }
        
        data = {
            'tenantId': 'tencent',
            'assignee': assignee,
            'finished': finished,
            'withVariablesInReturn': False
        }
        
        if process_instance_id:
            data['processInstanceId'] = process_instance_id
        
        headers = self._get_headers()
        response = requests.post(url, json=data, params=params, 
                                headers=headers)
        
        return response.json()
    
    def _get_variable_type(self, value):
        """推断变量类型"""
        if isinstance(value, bool):
            return 'boolean'
        elif isinstance(value, int):
            return 'integer'
        elif isinstance(value, float):
            return 'double'
        elif isinstance(value, str):
            return 'string'
        elif isinstance(value, dict) or isinstance(value, list):
            return 'json'
        else:
            return 'string'


# 使用示例
if __name__ == '__main__':
    client = WorkflowHttpClient(
        base_url='http://dev-ntsgw.woa.com/api/esb/workflow-service/api',
        app_code='testApp',
        gw_app_id='testApp',
        gw_app_token='testToken'
    )
    
    # 发起流程
    result = client.start_process(
        process_key='Process_1652793525398',
        starter_id='37225',
        starter_name='张三',
        business_key='报销申请-20230101',
        variables={
            '申请金额': 10000,
            '申请人': '张三'
        }
    )
    
    print('发起流程结果:', json.dumps(result, indent=2, ensure_ascii=False))
    
    # 查询待办
    tasks = client.query_tasks(assignee='37225')
    print('待办列表:', json.dumps(tasks, indent=2, ensure_ascii=False))
    
    # 提交待办
    if tasks['success'] and tasks['data']:
        task_id = tasks['data'][0]['id']
        complete_result = client.complete_task(
            task_id=task_id,
            operation='COMPLETED',
            variables={'审批意见': '同意'}
        )
        print('提交待办结果:', json.dumps(complete_result, indent=2, 
                                     ensure_ascii=False))
```

### 3.9.16 HTTP接口完整调用示例 (Node.js)

```javascript
const axios = require('axios');

class WorkflowHttpClient {
    constructor(baseUrl, appCode, gwAppId, gwAppToken) {
        this.baseUrl = baseUrl;
        this.appCode = appCode;
        this.gwAppId = gwAppId;
        this.gwAppToken = gwAppToken;
    }
    
    getHeaders(staffId, staffName) {
        const headers = {
            'Content-Type': 'application/json',
            'X-WORKFLOW-APP': this.appCode,
            'X-WORKFLOW-TENANT': 'tencent'
        };
        
        if (staffId) headers['staffid'] = staffId;
        if (staffName) headers['staffname'] = staffName;
        
        // 添加网关签名相关header
        // 具体签名算法参考: https://iwiki.woa.com/p/4009335092
        
        return headers;
    }
    
    async startProcess(processKey, starterId, starterName, businessKey, variables) {
        const url = `${this.baseUrl}/sdk/process/startProcess`;
        
        const data = {
            tenantId: 'tencent',
            starterId,
            starterName,
            businessKey,
            processKey,
            withVariablesInReturn: false
        };
        
        // 转换变量格式
        if (variables) {
            const objectVariables = {};
            for (const [key, value] of Object.entries(variables)) {
                const varType = this.getVariableType(value);
                objectVariables[key] = {
                    type: varType,
                    value: value
                };
            }
            data.objectVariables = objectVariables;
        }
        
        const headers = this.getHeaders(starterId, starterName);
        const response = await axios.post(url, data, { headers });
        
        return response.data;
    }
    
    async completeTask(taskId, operation = 'COMPLETED', variables) {
        const url = `${this.baseUrl}/sdk/task/completeTask`;
        
        const data = {
            tenantId: 'tencent',
            taskId,
            operation,
            withVariablesInReturn: false
        };
        
        if (variables) {
            const objectVariables = {};
            for (const [key, value] of Object.entries(variables)) {
                const varType = this.getVariableType(value);
                objectVariables[key] = {
                    type: varType,
                    value: value
                };
            }
            data.objectVariables = objectVariables;
        }
        
        const headers = this.getHeaders();
        const response = await axios.post(url, data, { headers });
        
        return response.data;
    }
    
    async queryTasks(assignee, processInstanceId, finished = false, 
                    firstResult = 0, maxResults = 20) {
        const url = `${this.baseUrl}/sdk/task/queryTasks`;
        
        const params = { firstResult, maxResults };
        
        const data = {
            tenantId: 'tencent',
            assignee,
            finished,
            withVariablesInReturn: false
        };
        
        if (processInstanceId) {
            data.processInstanceId = processInstanceId;
        }
        
        const headers = this.getHeaders();
        const response = await axios.post(url, data, { headers, params });
        
        return response.data;
    }
    
    getVariableType(value) {
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') {
            return Number.isInteger(value) ? 'integer' : 'double';
        }
        if (typeof value === 'string') return 'string';
        if (typeof value === 'object') return 'json';
        return 'string';
    }
}

// 使用示例
(async () => {
    const client = new WorkflowHttpClient(
        'http://dev-ntsgw.woa.com/api/esb/workflow-service/api',
        'testApp',
        'testApp',
        'testToken'
    );
    
    try {
        // 发起流程
        const result = await client.startProcess(
            'Process_1652793525398',
            '37225',
            '张三',
            '报销申请-20230101',
            {
                '申请金额': 10000,
                '申请人': '张三'
            }
        );
        console.log('发起流程结果:', JSON.stringify(result, null, 2));
        
        // 查询待办
        const tasks = await client.queryTasks('37225');
        console.log('待办列表:', JSON.stringify(tasks, null, 2));
        
        // 提交待办
        if (tasks.success && tasks.data.length > 0) {
            const taskId = tasks.data[0].id;
            const completeResult = await client.completeTask(
                taskId,
                'COMPLETED',
                { '审批意见': '同意' }
            );
            console.log('提交待办结果:', JSON.stringify(completeResult, null, 2));
        }
    } catch (error) {
        console.error('错误:', error.message);
    }
})();
```

## 4. 依赖关系层

### 4.1 上游依赖

**Maven依赖**:

针对非Spring的Java项目：
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>workflow-client-java</artifactId>
    <version>7.5-SNAPSHOT</version>
</dependency>
```

针对Spring Boot 2.0项目：
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>workflow-client-spring-boot-starter</artifactId>
    <version>7.5-SNAPSHOT</version>
</dependency>
```

针对Spring Boot 3.0项目：
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>workflow-client-spring-boot3-starter</artifactId>
    <version>7.5-SNAPSHOT</version>
</dependency>
```

### 4.2 配置依赖

**配置文件**:
```yaml
workflow:
  appCode: testApp           # 由流程引擎分配
  gwAppId: testApp          # 由服务市场分配
  gwAppToken: testApp       # 由服务市场分配
  
  # 可选配置，用于本地环境对接测试环境
  baseUrl: http://dev-ntsgw.woa.com/api/esb/workflow-service/api/
  mgmtUrl: http://dev-ntsgw.woa.com/api/esb/workflow-mgmt-service/api/
```

**依赖注入**:
```java
@Import({WorkflowCoreConfiguration.class, WorkflowHttpConfiguration.class})

@Autowired
private WorkflowClient workflowClient;
```

### 4.3 环境依赖

**测试环境**:
- 流程管理服务: `http://dev-ntsgw.woa.com/api/esb/workflow-mgmt-service/api/`
- 流程引擎服务: `http://dev-ntsgw.woa.com/api/esb/workflow-service/api/`
- 微服务地址: `http://workflow-mgmt-service/api/` 和 `http://workflow-service/api/`

**UAT环境**:
- 流程管理服务: `http://uat-ntsgw.woa.com/api/esb/workflow-mgmt-service/api/`
- 流程引擎服务: `http://uat-ntsgw.woa.com/api/esb/workflow-service/api/`

**正式环境**:
- 流程管理服务: `http://ntsgw.woa.com/api/esb/workflow-mgmt-service/api/`
- 流程引擎服务: `http://ntsgw.woa.com/api/esb/workflow-service/api/`

## 5. 使用指南层

### 5.1 快速开始

1. **申请接入权限**: 参考权限申请流程文档
2. **配置应用信息**: 在流程引擎平台注册应用，获取appCode
3. **引入SDK依赖**: 根据项目类型选择合适的Maven依赖
4. **配置应用参数**: 在application.yml中配置workflow相关参数
5. **注入WorkflowClient**: 通过依赖注入使用WorkflowClient
6. **调用接口**: 调用相应的API完成流程操作

### 5.2 完整示例

#### 发起流程示例

```java
@Service
public class WorkflowService {
    
    @Autowired
    private WorkflowClient workflowClient;
    
    /**
     * 发起流程示例
     */
    public String startWorkflow() {
        // 构建流程变量
        Map<String, Object> variables = new HashMap<>();
        variables.put("申请人", "张三");
        variables.put("申请金额", 10000);
        
        // 构建启动请求
        StartProcessRequest request = new StartProcessRequest();
        request.setStarterId("37225");
        request.setStarterName("stoneldeng");
        request.setVariables(variables);
        request.setProcessKey("Process_1652793525398");
        request.setTenantId("tencent");
        request.setBusinessKey("报销申请-20230101");
        request.setWithVariablesInReturn(true);
        request.setBusinessId("REIMB_20230101_001");
        
        // 发起流程
        ResponseInfo<ProcessInstance> response = workflowClient.startProcess(request);
        
        if (response.isSuccess()) {
            ProcessInstance instance = response.getData();
            return instance.getId();
        }
        
        return null;
    }
}
```

#### 审批待办示例

```java
/**
 * 审批待办示例
 */
public void approveTask(String taskId, boolean agree) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("审批意见", agree ? "同意" : "不同意");
    variables.put("审批时间", new Date());
    
    CompleteTaskRequest request = new CompleteTaskRequest();
    request.setTenantId("tencent");
    request.setTaskId(taskId);
    request.setOperation(agree ? TaskOperation.COMPLETED : TaskOperation.DISAGREE);
    request.setVariables(variables);
    request.setWithVariablesInReturn(true);
    
    ResponseInfo<ProcessInstance> response = workflowClient.completeTask(request);
    
    if (response.isSuccess()) {
        ProcessInstance instance = response.getData();
        System.out.println("流程状态: " + instance.getStatus());
    }
}
```

#### 查询待办列表示例

```java
/**
 * 查询待办列表示例
 */
public List<Task> queryMyTasks(String staffId) {
    QueryTaskRequest request = new QueryTaskRequest();
    request.setTenantId("tencent");
    request.setAssignee(staffId);
    request.setFinished(false);  // 只查询未完成的待办
    request.setWithVariablesInReturn(true);
    
    ResponseInfo<List<Task>> response = workflowClient.queryTasks(request, 0, 20);
    
    if (response.isSuccess()) {
        return response.getData();
    }
    
    return Collections.emptyList();
}
```

### 5.3 最佳实践

1. **流程命名规范**: 
   - 使用"动词+名词+流程"格式，如"请假申请流程"、"报销审批流程"
   - 名称要简洁直观，采用业界标准名称

2. **变量使用**:
   - 避免使用流程引擎内置变量名
   - 变量值使用Java基本类型（Integer、Long、String等）
   - 复杂对象转为JSON字符串传递

3. **错误处理**:
   - 检查ResponseInfo的success字段判断是否成功
   - 根据code字段进行错误处理
   - 记录详细的错误日志

4. **性能优化**:
   - 合理使用withVariablesInReturn参数，避免不必要的变量返回
   - 使用分页查询避免一次性加载大量数据
   - 对于批量操作，使用complexOperation合并为一个事务

5. **事务管理**:
   - 单个操作都是独立事务
   - 需要多个操作在同一事务中时，使用complexOperation

### 5.4 反模式

1. **不推荐**: 频繁查询流程实例状态
   - **原因**: 增加系统负载
   - **替代方案**: 使用事件监听回调机制

2. **不推荐**: 在循环中调用API
   - **原因**: 性能差，容易超时
   - **替代方案**: 使用批量操作或复合操作

3. **不推荐**: 滥用REJECT操作
   - **原因**: 会强制终止整个流程
   - **替代方案**: 使用DISAGREE或驳回操作

4. **不推荐**: 直接修改流程引擎数据库
   - **原因**: 破坏数据一致性
   - **替代方案**: 通过API进行操作

## 6. 数据契约层

### 6.1 统一响应格式

```java
public class ResponseInfo<T> {
    private boolean success;    // 是否成功
    private int code;          // 状态码
    private String message;    // 提示信息
    private T data;            // 数据
}
```

### 6.2 状态码说明

| Code | 说明 |
|------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 无权限访问 |
| 404 | 数据不存在 |
| 405 | 请求方法错误 |
| 500 | 内部异常 |
| 501 | 业务异常 |
| 600 | 待办已完成 |
| 601 | 待办不存在 |
| 602 | 流程实例已结束 |
| 603 | 流程实例不存在 |

### 6.3 审批类型说明

| 审批类型 | 说明 | 逻辑 |
|---------|------|------|
| 会签 | 所有审批人都要审批并同意 | 全部同意才通过，任一不同意则结束流程 |
| 或签 | 至少需要一个人同意 | 任一人同意即通过，全部不同意则结束流程 |
| 异会签 | 所有人都要审批且至少一人同意 | 等待全部人审批，任一人同意即通过 |
| 任一签 | 任意一个人审批即可 | 第一个人审批即决定结果 |
| 顺序签 | 按顺序审批 | 按人员顺序依次审批，前者同意后者才能审批 |

### 6.4 Task数据结构

```java
public class Task {
    private String id;                      // 待办任务id
    private String name;                    // 任务名称
    private String assignee;                // 任务审批人id
    private Date startTime;                 // 任务创建时间
    private Date endTime;                   // 任务结束时间
    private String owner;                   // 待办拥有者id
    private String definitionId;            // 流程定义id
    private String processInstanceId;       // 流程实例id
    private String activityId;              // 待办所在的节点id
    private TaskStatus status;              // 待办状态
    private String tenantId;                // 租户id
    private Map<String, Object> variables;  // 待办变量
}
```

## 7. 运行时行为层

### 7.1 事务特性

- **单接口事务**: 每个API调用都是独立的事务
- **复合操作事务**: complexOperation中的所有操作在同一事务中执行
- **事务传播**: 不支持外部事务传播

### 7.2 幂等性

- **流程发起**: 使用businessId可保证幂等性（相同businessId不会重复创建流程实例）
- **待办操作**: 不保证幂等性，重复调用会产生多次操作

### 7.3 并发安全

- **线程安全**: WorkflowClient是线程安全的
- **并发限制**: 无明确的并发限制，建议控制在合理范围
- **乐观锁**: 使用版本号机制处理并发修改

### 7.4 异步特性

- **同步调用**: 所有API都是同步调用
- **异步通知**: 通过事件监听回调实现异步通知
- **消息推送**: 支持异步推送到MyOA、企业微信卡片等

## 8. 错误处理层

### 8.1 常见错误场景

| 错误场景 | 原因 | 解决方案 |
|---------|------|---------|
| 401无权限访问 | appCode配置错误 | 检查appCode是否正确，是否已注册 |
| 601待办不存在 | 待办已被处理或删除 | 查询待办状态，避免重复处理 |
| 602流程实例已结束 | 流程已完成或终止 | 检查流程状态，避免对已结束流程操作 |
| 500内部异常 | 服务器错误 | 查看日志，联系技术支持 |

### 8.2 降级策略

- **服务降级**: 建议实现降级逻辑，服务不可用时提供替代方案
- **重试机制**: 对于网络超时等临时性错误，建议实现重试机制
- **熔断保护**: 建议使用熔断器模式保护应用

## 9. 配置说明层

### 9.1 配置项清单

| 配置项 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
| workflow.appCode | String | 是 | 应用编码 | - |
| workflow.gwAppId | String | 是 | 服务市场应用ID | - |
| workflow.gwAppToken | String | 是 | 服务市场应用Token | - |
| workflow.baseUrl | String | 否 | 流程引擎服务地址 | http://workflow-service/api/ |
| workflow.mgmtUrl | String | 否 | 流程管理服务地址 | http://workflow-mgmt-service/api/ |

### 9.2 各环境配置示例

**测试环境**:
```yaml
workflow:
  appCode: testApp
  gwAppId: testApp
  gwAppToken: testApp
  baseUrl: http://dev-ntsgw.woa.com/api/esb/workflow-service/api/
  mgmtUrl: http://dev-ntsgw.woa.com/api/esb/workflow-mgmt-service/api/
```

**正式环境**:
```yaml
workflow:
  appCode: prodApp
  gwAppId: prodApp
  gwAppToken: ******
  baseUrl: http://ntsgw.woa.com/api/esb/workflow-service/api/
  mgmtUrl: http://ntsgw.woa.com/api/esb/workflow-mgmt-service/api/
```

## 10. 事件监听与回调

### 10.1 事件类型

| 事件类型 | 说明 | 触发时机 |
|---------|------|---------|
| 待办开始事件 | 待办创建时触发 | 生成新待办时 |
| 待办结束事件 | 待办完成时触发 | 待办被处理时 |
| 环节开始事件 | 进入环节时触发 | 流程流转到环节时 |
| 环节结束事件 | 离开环节时触发 | 环节处理完成时 |
| 流程结束事件 | 流程完成时触发 | 流程正常结束或终止时 |

### 10.2 消息结构

**消息属性**:

| 属性名 | 说明 |
|--------|------|
| appCode | 应用编码 |
| tenantId | 租户id（内网为tencent） |
| area | 领域 |
| msgType | 消息类型 |
| processKey | 流程id |
| processInstanceId | 流程实例id |
| processStatus | 流程状态 |
| activityId | 环节id |
| activityName | 环节名称 |
| activityEvent | 环节事件（ENTER/LEAVE） |
| taskId | 待办id |
| taskStatus | 待办状态 |

**消息内容字段**:

| 字段名 | 说明 |
|--------|------|
| assignee | 审批人id |
| starterId | 流程发起人id |
| originAssignee | 原审批人id（转交时有值） |
| processName | 流程名称 |
| title | 待办标题 |
| formUrl | 待办跳转PC端url |
| mobileFormUrl | 待办跳转移动端url |
| startTime | 待办开始时间 |
| dueTime | 待办到期时间 |

### 10.3 配置回调接口

**步骤1**: 实现回调接口

```java
@RestController
@RequestMapping("/callback")
public class CallbackController {
    
    @RequestMapping(method = {RequestMethod.POST}, produces = "application/json")
    public ResponseInfo<String> callback(@RequestBody SendMsgRequest request) {
        MsgBody msgPackage = MsgBody.from(request);
        
        Map<String, Object> properties = msgPackage.getEventProperties();
        String processInstanceId = (String) properties.get("processInstanceId");
        String processStatus = (String) properties.get("processStatus");
        
        List<MsgItem> items = msgPackage.getEventData();
        for (MsgItem item : items) {
            MsgData data = item.getEventData();
            // 处理业务逻辑
        }
        
        return ResponseInfo.success();
    }
}
```

**步骤2**: 在事件中台配置消费者
- 测试环境: https://test-hr-event.woa.com/
- 正式环境: https://hr-event.woa.com/

**步骤3**: 配置事件过滤和转换
- 事件过滤：`$.eventProperties.appCode = "yourAppCode"`
- 转换模板：标准JSON格式

## 11. 流程创建方式

### 11.1 JSON方式创建流程

**简单顺序流程示例**:

```java
BpmnProcessRequest request = new BpmnProcessRequest();
request.setName("代码生成简单顺序流程");
request.setId("ProcessId_11111");

List<BpmnActivity> bpmnActivityList = new ArrayList<>();

// 添加审批环节
BpmnActivity activity = new BpmnActivity();
activity.setName("环节-1");
activity.setActivityApprovalType(ApprovalType.JOIN);  // 会签
activity.setActivityCandidateType(BpmnActivityCandidateTypeEnum.PERSONNEL);

StaffInfo staffInfo = new StaffInfo();
staffInfo.setStaffID(37225);
staffInfo.setStaffName("stoneldeng");
activity.setActivityPersonnel(Arrays.asList(staffInfo));

bpmnActivityList.add(activity);
request.setActivitys(bpmnActivityList);

request.setTenantId("tencent");
ResponseInfo<ProcessDefinitionModel> response = 
    workflowClient.createSimpleSequenceBpmnProcessModel(request);
```

### 11.2 BPMN方式创建流程

**复杂流程示例**:

```java
BpmnProcessRequest request = new BpmnProcessRequest();
List<BpmnActivity> activitys = new ArrayList<>();

// 创建并行网关
BpmnActivity pg1 = new BpmnActivity();
pg1.setId("pg1");
pg1.setName("并行网关1");
pg1.setType(BpmnActivityTypeEnum.PARALLEL_GATEWAY);
pg1.setActivityOutgoing(Arrays.asList("task1", "task2"));
activitys.add(pg1);

// 创建审批任务
BpmnActivity task1 = new BpmnActivity();
task1.setId("task1");
task1.setName("任务-1");
task1.setType(BpmnActivityTypeEnum.USER_TASK);
task1.setActivityCandidateType(BpmnActivityCandidateTypeEnum.PERSONNEL);
task1.setActivityPersonnel(Arrays.asList(staffInfo));
task1.setActivityIncoming(Arrays.asList("pg1"));
activitys.add(task1);

// 创建流转线
BpmnActivity seqFlow = new BpmnActivity();
seqFlow.setType(BpmnActivityTypeEnum.SEQUENCE_FLOW);
seqFlow.setSequenceFlowSourceRef("pg1");
seqFlow.setSequenceFlowTargetRef("task1");
activitys.add(seqFlow);

request.setActivitys(activitys);
request.setTenantId("tencent");

ResponseInfo<ProcessDefinitionModel> response = 
    workflowClient.createBpmnProcessModel(request);
```

## 12. 附录

### 12.1 领域类型枚举

```java
public enum Area {
    HR("人事"),
    CJ("财经"),
    XING_ZHENG("行政"),
    CAI_GOU("采购"),
    IT("IT服务"),
    AN_QUAN("安全中心"),
    YUN_YING("运营业务"),
    JI_JIAN("基建"),
    CJ_HT("财经-合同"),
    CJ_CL("财经-差旅"),
    CJ_COST("财经-COST付款报销"),
    CJ_POST("财经-通用付款"),
    CJ_PP("财经-付款平台"),
    OTHER("其他")
}
```

### 12.2 消息类型枚举

```java
public enum MsgType {
    APPROVAL(1),    // 审批消息（同意、不同意、驳回、加签、减签）
    DELEGATE(2),    // 委托消息（审批人将待办委托给其他人）
    TRANSFER(3),    // 转交消息（审批人将待办转交给其他人）
    EVENT(4),       // 事件类型消息（环节开始、环节结束）
    SYNC_TASK(5)    // 同步任务消息
}
```

### 12.3 环节类型枚举

```java
public enum BpmnActivityTypeEnum {
    USER_TASK,              // 审批任务环节
    PARALLEL_GATEWAY,       // 并行网关
    EXCLUSIVE_GATEWAY,      // 排他网关
    INCLUSIVE_GATEWAY,      // 包容网关
    SEQUENCE_FLOW          // 流转线
}
```

### 12.4 相关文档链接

- 流程引擎平台: http://hrflow.woa.com/
- 事件中台（测试）: https://test-hr-event.woa.com/
- 事件中台（正式）: https://hr-event.woa.com/
- 可靠消息服务: http://rocketmq.ntsgw.oa.com/

---

**注意事项**:
1. 租户ID在内网统一使用"tencent"
2. 老SDK（6.6.2版本）将不再迭代维护，建议使用新SDK（7.5版本）
3. 所有API调用都需要先在流程引擎平台注册应用获取appCode
4. 变量值应使用Java基本类型，复杂对象需转为JSON字符串
5. REJECT操作会强制终止整个流程，使用时需谨慎
6. 业务方应避免使用流程引擎的内置变量名
