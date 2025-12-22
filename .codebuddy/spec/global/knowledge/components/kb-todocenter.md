# 云待办中心 API 文档

## 1. 基础信息层

### 1.1 服务信息

| 项目 | 内容 |
|-----|------|
| **服务名称** | 云待办中心 (Todo Center) |
| **服务编码** | todocenter |
| **版本信息** | V1.0 (已发布), V2.0 (规划中) |
| **负责人** | haozonggui (桂豪纵) |
| **状态** | ✅ 稳定运行 - 生产环境已上线 |
| **推荐使用** | 是 |

### 1.2 版本说明

- **Release V1.0**: 已发布 (2021-01-29)
  - 提供待办/已办查询接口
  - 支持待办创建、关闭、撤销、转交
  - 支持PC端/移动端统一待办中心界面
  - 支持批量审批、快速审批
  - 支持多租户、国际化
  - 支持内外网一致访问

- **Release V2.0**: 规划中
  - 提供列表视图、详情视图,支持自定义表单
  - 提供待办附件及在线预览
  - 提供待办处理回调能力
  - 添加评论及@功能

---

## 2. 功能概述层

### 2.1 核心职责

提供**用户待办统一存储、查询、快速审批**等功能，为招聘、绩效、薪酬、培训等业务领域提供"**内外网统一的待办处理中心**"。

### 2.2 使用场景

**适用场景:**
- HR业务流程审批 (入职、离职、调动、休假、转正等)
- 财经、行政、IT服务等业务流程审批
- 需要统一待办管理的任何业务系统
- 需要跨系统待办聚合展示的场景
- 需要批量审批、快速审批的场景

**典型业务流程:**
1. 业务系统发起流程 → 调用待办中心创建待办
2. 审批人在待办中心查看待办 → 审批/转交/驳回
3. 待办中心回调业务系统 → 业务系统更新流程状态
4. 已办记录保存在待办中心 → 支持历史查询

### 2.3 设计目的

- **统一入口**: 提供PC端/移动端一致的待办处理入口
- **提升效率**: 支持批量审批、快速审批,提高审批效率
- **规范管理**: 统一待办数据模型,规范审批流程
- **跨系统整合**: 聚合多个业务系统的待办,避免多处查看
- **内外网统一**: 提供内外网一致的访问接口

### 2.4 业务价值

- **用户价值**: 
  - 一个入口查看所有待办,无需切换多个系统
  - 支持批量操作,大幅提升审批效率
  - PC/移动端体验一致,随时随地处理待办

- **业务价值**:
  - 降低业务系统待办管理开发成本
  - 统一审批流程规范,便于监管
  - 提供完整的审批历史记录

- **技术价值**:
  - 高性能: 创建单据 TPS >= 1000, 审批操作 TPS >= 200
  - 高可靠: 保障提交成功的待办操作不丢失
  - 可扩展: 支持多租户、国际化、自定义表单

---

## 3. 接口定义层

### 3.1 接口列表

| API | Method | 描述 | Release版本 |
|-----|--------|------|------------|
| `/workitem/create` | POST | 创建一张或多张审批单据 | V1.0 |
| `/workitem/close` | POST | 关闭审批单据 | V1.0 |
| `/workitem/closeById` | POST | 关闭单条审批单据并更新审批记录 | V1.0 |
| `/workitem/discard` | POST | 撤销审批单据 | V1.0 |
| `/workitem/discardByIds` | POST | 撤销单条审批单据 | V1.0 |
| `/workitem/transfer` | POST | 移交审批单据 | V1.0 |
| `/workitem/todo/query` | POST | 分页查询待办列表 | V1.0 |
| `/workitem/done/query` | POST | 分页查询已办列表 | V1.0 |

### 3.2 创建审批单据

**接口路径**: `POST /workitem/create`

**功能说明**: 在待办中心创建一张或多张审批单据

**唯一性标识**: 待办中心通过 `tenant + systemAppCode + category + sub_category + processname + processinstid + taskname + taskinstid + handler` 识别单据唯一性

**请求参数**:

```json
[{
  "tenant": "tencent", // 租户code,默认"tencent"
  "category": "HR", // 业务领域,必填
  "sub_category": "BEREGULAR", // 子领域,必填 (JOIN/入职,DIMISSION/离职,TRANSFER/调动,VACATION/休假,BEREGULAR/转正)
  "system_app_code": "HRPortal", // 系统编码,必填
  "process_name": "Testflow", // 流程名称,必填
  "process_display_name": {"cn": "测试流程", "en": "test process"}, // 流程显示名称
  "process_title": "测试流程审批", // 流程标题
  "process_title_display_name": {"cn": "测试流程审批", "en": "TestflowApprove"},
  "process_inst_id": "Testflow-20160629-191028", // 流程实例ID,必填
  "task_name": "Default", // 节点名称,必填
  "task_display_name": {"cn": "直接领导审批", "en": "Direct leader approve"}, // 显示标题,必填
  "handler": {"staff_id": "00123456", "global_id": ""}, // 处理人,必填(二选一)
  "task_inst_id": "Default-123456-12", // 待办实例ID,必填
  "form_url": "http://hr.oa.com/testflow/build/html/form.html", // PC端访问地址,必填
  "mobile_form_url": "http://my.oa.com/testflow/build/html/mobileform.html", // 移动端访问地址
  "callback_url": "http://hr.oa.com/testflow/api/public/callback", // 回调地址
  "enable_quick_approval": true, // 是否允许快速审批,默认true
  "enable_batch_approval": true, // 是否允许批量审批,默认true
  "enable_action_transfer": true, // 是否允许转交,默认true
  "enable_action_revise": true, // 是否允许驳回,默认true
  "enable_sync_myoa": false, // 是否同步到myoa
  "applicant": {
    "staff_id": "00123456", 
    "global_id": "", 
    "display_name": "张三(zhangsan)"
  }, // 申请人,必填
  "priority": 1, // 优先级 1-10,默认1
  "start_time": "2016-06-29T11:10:52.000Z", // 开始时间,必填 (RFC3339格式)
  "due_time": "2016-07-04T11:10:52.000Z", // 结束时间,必填 (RFC3339格式)
  "custom_actions": [{ // 自定义审批动作,必填
    "display_name": {"cn": "同意", "en": "Agree"},
    "value": "Agree",
    "display_color": "primary"
  }],
  "summary": [{ // 摘要字段,用于移动端列表展示
    "label": {"cn": "员工姓名", "en": "Staff"},
    "value": {"cn": "(zhangsan)张三", "en": "zhangsan"}
  }],
  "approval_forms": [{ // 审批表单
    "name": "comment", // 字段名,唯一
    "label": {"cn": "评语", "en": "comment"},
    "value": ""
  }],
  "custom_form": [{ // 自定义表单
    "name": "人员信息",
    "label": {"cn": "员工", "en": "Staff"},
    "value": {
      "staff_id": "675221",
      "display_name": "zhangsan(张三)",
      "unit": "某公司/某组织",
      "post": "设计师"
    },
    "type": "Person"
  }],
  "approval_stages": [{ // 审批环节,用于驳回
    "approval_stage_id": "stage_1",
    "approval_stage_name": "直接领导审批"
  }],
  "approval_records": [{ // 审批记录
    "workitem_id": "0000111",
    "approval_time": "2017-12-08T00:00:00.000Z",
    "approval_forms": [...]
  }]
}]
```

**响应参数**:

```json
{
  "success": true,
  "message": "",
  "code": 0,
  "data": [{
    "workitem_id": "xx",
    "tenant": "tencent",
    "category": "HR",
    "sub_category": "BEREGULAR",
    "system_app_code": "",
    "process_name": "",
    "process_inst_id": "",
    "task_name": "",
    "task_inst_id": "",
    "handler": {"staff_id": "", "global_id": ""},
    "history_workitem_ids": ["xxx1"]
  }]
}
```

### 3.3 关闭审批单据

**接口路径**: `POST /workitem/close`

**功能说明**: 关闭一张或多张审批单据

**关闭逻辑**:
- `task_name`、`task_inst_id`、`handler` 全为空: 关闭该流程下所有单据
- `handler` 为空: 关闭该审批活动下所有单据
- `handler` 不为空: 仅关闭指定处理人名下的单据
- 所有字段都不为空: 关闭唯一单据

**请求参数**:

```json
{
  "tenant": "tencent",
  "category": "HR",
  "sub_category": "BEREGULAR",
  "system_app_code": "HRPortal",
  "process_name": "流程名称",
  "process_inst_id": "流程实例ID",
  "task_name": "审批活动", // 可为空
  "task_inst_id": ["Default-123456-12"], // 可为空
  "handler": ["00123456"], // 可为空
  "callback_data": { // 必填
    "submit_source": "PC", // 审批终端
    "submit_action": "Agree", // 审批动作
    "submit_action_name": {"cn": "同意", "en": "Agree"},
    "submit_action_data": {}, // 审批动作数据
    "submit_action_handler": {
      "display_name": "zhangsan(张三)",
      "staff_id": "00123456",
      "global_id": ""
    },
    "submit_opinion": "同意申请", // 审批意见
    "submit_form_data": {} // 表单数据
  }
}
```

**响应参数**:

```json
{
  "success": true,
  "message": "",
  "code": 0,
  "data": null
}
```

### 3.4 关闭单条审批单据并更新审批记录

**接口路径**: `POST /workitem/closeById`

**功能说明**: 关闭待办中心的一张单据并更新审批记录。如果单据已关闭,只更新审批记录

**请求参数**:

```json
{
  "workitem_id": "xxxxxxx", // 必填
  "approval_time": "2017-12-08T00:00:00.000Z", // 审批时间
  "approval_records": [{
    "workitem_id": "0000111",
    "approval_forms": [{
      "name": "人员信息",
      "label": {"cn": "员工", "en": "Staff"},
      "value": {
        "staff_id": "675221",
        "display_name": "张三(zhangsan)",
        "unit": "某公司/某组织",
        "post": "设计师"
      },
      "type": "Person"
    }, {
      "name": "approval_stage",
      "label": {"cn": "审批环节", "en": "approval_stage"},
      "value": "直接领导评价",
      "type": "Text"
    }]
  }]
}
```

### 3.5 撤销审批单据

**接口路径**: `POST /workitem/discard`

**功能说明**: 撤销一张或多张审批单据

**撤销逻辑**: 同关闭接口

**请求参数**:

```json
{
  "tenant": "tencent",
  "category": "HR",
  "sub_category": "BEREGULAR",
  "system_app_code": "HRPortal",
  "process_name": "流程名称",
  "process_inst_id": "流程实例ID",
  "task_name": "审批活动", // 可为空
  "task_inst_id": ["Default-123456-12"], // 可为空
  "handler": ["00123456"] // 可为空
}
```

**close 与 discard 的区别**:
- `close`: 单据已在业务系统提交审批,需在待办中心同步关闭,会纳入"已办列表"
- `discard`: 单据在业务系统已作废,不再需要,后台记录历史但不作为"已办"呈现

### 3.6 撤销单条审批单据

**接口路径**: `POST /workitem/discardByIds`

**功能说明**: 根据workitem_id撤销单条审批单据

**请求参数**:

```json
["workitem_id_1", "workitem_id_2"]
```

### 3.7 移交审批单据

**接口路径**: `POST /workitem/transfer`

**功能说明**: 移交一张或多张审批单据

**移交逻辑**:
1. 将上任处理人的处理结果放到 `approval_history` 中
2. 更新 `handler` 为最新处理人
3. 单据状态保持为 `unhandler`
4. 进行callback,通知业务系统

**请求参数**:

```json
{
  "tenant": "tencent",
  "category": "HR",
  "sub_category": "BEREGULAR",
  "system_app_code": "HRPortal",
  "process_name": "流程名称",
  "process_inst_id": "流程实例ID",
  "task_name": "审批活动", // 必填
  "task_inst_id": ["Default-123456-12"], // 必填
  "handler": {"staff_id": "00234567", "global_id": ""} // 新处理人,必填
}
```

**响应参数**:

```json
{
  "success": true,
  "message": "",
  "code": 0,
  "data": [{
    "task_inst_id": "xx",
    "success": true
  }]
}
```

### 3.8 查询待办/已办列表

**接口路径**: `POST /workitem/{state}/query`

**路径参数**: 
- `state`: `todo` (待办) 或 `done` (已办)

**请求参数**:

```json
{
  "tenant": "tencent",
  "category": "HR",
  "sub_category": "BEREGULAR",
  "system_app_code": ["HRPortal", "HRRight"], // 可多个
  "process_name": "流程名称", // 可为空
  "handler": ["username1", "username2"], // 必填
  "page_info": {
    "page_size": 10,
    "page_number": 1
  }
}
```

**响应参数**:

```json
{
  "success": true,
  "message": "",
  "code": 0,
  "data": {
    "workitems": [{
      "workitem_id": "xx",
      "tenant": "tencent",
      "category": "HR",
      "process_name": "Testflow",
      "task_display_name": {"cn": "直接领导审批", "en": "Direct leader approve"},
      "applicant": {...},
      "handler": {...},
      "priority": 1,
      "start_time": "2016-06-29T11:10:52.000Z",
      "due_time": "2016-07-04T11:10:52.000Z",
      "callback_data": {...} // 已办时包含
    }],
    "page_info": {
      "page_size": 10,
      "page_number": 1,
      "page_count": 5,
      "items_count": 50
    }
  }
}
```

---

## 4. 依赖关系层

### 4.1 上游依赖

**环境地址**:

| 环境 | 内网地址 | 外网地址 |
|-----|---------|----------|
| 测试环境 | 待定 | http://gateway.testihrtas.com |
| 生产环境 | 待定 | http://gateway.prodihrtas.com |
| 测试-开放服务 | - | https://newapi.test-caagw.yunassess.com/open/todocenter |
| 生产-开放服务 | - | https://newapi.ihr.tencent-cloud.com/open/todocenter |

**前端地址**:

| 环境 | 地址 |
|-----|------|
| 测试环境-外网 | http://todocenter-{corpkey}.test-caagw.yunassess.com |
| 生产环境-外网 | https://todocenter-{corpkey}.ihr.tencent-cloud.com |

**页面路径**:
- 单据审批页: `/approval?workitem_id={workitem_id}`

### 4.2 下游影响

**业务系统依赖待办中心**:
- HR Portal (人事系统)
- HR Right (权限系统)
- 财经系统
- 行政系统
- IT服务系统

**变更影响范围**:
- 接口字段变更: 影响所有业务系统
- 回调协议变更: 需要业务系统同步修改
- 前端界面变更: 影响所有用户

### 4.3 环境依赖

**基础设施**:
- MongoDB: 存储业务数据
- Elasticsearch: 存储操作日志
- Kafka: 异步回调队列
- API网关: ESB鉴权

**鉴权依赖**:
- TAS鉴权: 内外网API网关认证
- 开放服务鉴权: 对接TAS开放服务

---

## 5. 使用指南层

### 5.1 快速开始

#### 步骤1: 获取appKey和token

联系待办中心负责人获取:
- `appKey`: 应用编码
- `tasToken`: TAS鉴权token

#### 步骤2: 创建待办单据

```java
// Java示例
String url = "http://gateway.testihrtas.com/workitem/create";

// 构建请求头
long ts = System.currentTimeMillis();
String apiSignature = SHA256.encode(appKey + tasToken + ts);

HttpHeaders headers = new HttpHeaders();
headers.add("caagw-appkey", appKey);
headers.add("caagw-timestamp", String.valueOf(ts));
headers.add("caagw-signature", apiSignature);
headers.add("Content-Type", "application/json");

// 构建请求体
List<Map<String, Object>> workitems = new ArrayList<>();
Map<String, Object> workitem = new HashMap<>();
workitem.put("tenant", "tencent");
workitem.put("category", "HR");
workitem.put("sub_category", "BEREGULAR");
workitem.put("system_app_code", "HRPortal");
workitem.put("process_name", "Testflow");
workitem.put("process_inst_id", "Testflow-20160629-191028");
workitem.put("task_name", "Default");
workitem.put("task_display_name", Map.of("cn", "直接领导审批", "en", "Direct leader approve"));
workitem.put("handler", Map.of("staff_id", "00123456"));
workitem.put("task_inst_id", "Default-123456-12");
workitem.put("form_url", "http://hr.oa.com/testflow/build/html/form.html");
workitem.put("applicant", Map.of("staff_id", "00123456", "display_name", "张三(zhangsan)"));
workitem.put("start_time", "2016-06-29T11:10:52.000Z");
workitem.put("due_time", "2016-07-04T11:10:52.000Z");
workitem.put("custom_actions", List.of(
    Map.of("display_name", Map.of("cn", "同意", "en", "Agree"), "value", "Agree", "display_color", "primary")
));

workitems.add(workitem);

// 发送请求
HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(workitems, headers);
RestTemplate restTemplate = new RestTemplate();
ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

System.out.println("创建结果: " + response.getBody());
```

#### 步骤3: 实现回调接口

```java
@RestController
@RequestMapping("/api/public")
public class CallbackController {
    
    @PostMapping("/callback")
    public Map<String, Object> callback(@RequestBody Map<String, Object> callbackData) {
        // 解析回调数据
        List<Map<String, Object>> itemInfo = (List) callbackData.get("item_info");
        Map<String, Object> callback = (Map) callbackData.get("callback_data");
        
        String submitAction = (String) callback.get("submit_action");
        String processInstId = (String) itemInfo.get(0).get("process_inst_id");
        
        // 根据审批动作更新流程状态
        if ("Agree".equals(submitAction)) {
            // 同意逻辑
            updateProcessStatus(processInstId, "APPROVED");
        } else if ("Reject".equals(submitAction)) {
            // 拒绝逻辑
            updateProcessStatus(processInstId, "REJECTED");
        }
        
        // 返回成功响应
        return Map.of("success", true, "message", "处理成功", "code", 0, "data", Map.of());
    }
}
```

### 5.2 完整示例

#### 完整流程示例

```java
public class TodoCenterService {
    private String appKey = "HRPortal";
    private String tasToken = "xxxxx";
    private String baseUrl = "http://gateway.testihrtas.com";
    
    /**
     * 创建待办单据
     */
    public String createWorkitem(String processInstId, String handler, String taskDisplayName) {
        String url = baseUrl + "/workitem/create";
        
        // 构建请求
        Map<String, Object> workitem = buildWorkitem(processInstId, handler, taskDisplayName);
        HttpEntity request = buildRequest(List.of(workitem));
        
        // 发送请求
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        // 解析响应
        Map<String, Object> result = response.getBody();
        if ((Boolean) result.get("success")) {
            List<Map<String, Object>> data = (List) result.get("data");
            return (String) data.get(0).get("workitem_id");
        }
        
        throw new RuntimeException("创建待办失败: " + result.get("message"));
    }
    
    /**
     * 关闭待办单据
     */
    public void closeWorkitem(String processInstId, String handler, String action) {
        String url = baseUrl + "/workitem/close";
        
        Map<String, Object> closeData = new HashMap<>();
        closeData.put("tenant", "tencent");
        closeData.put("category", "HR");
        closeData.put("sub_category", "BEREGULAR");
        closeData.put("system_app_code", "HRPortal");
        closeData.put("process_name", "Testflow");
        closeData.put("process_inst_id", processInstId);
        closeData.put("handler", List.of(handler));
        
        // 构建callback_data
        Map<String, Object> callbackData = new HashMap<>();
        callbackData.put("submit_source", "PC");
        callbackData.put("submit_action", action);
        callbackData.put("submit_action_name", Map.of("cn", "同意", "en", "Agree"));
        callbackData.put("submit_action_handler", Map.of(
            "staff_id", handler,
            "display_name", "zhangsan(张三)"
        ));
        callbackData.put("submit_opinion", "同意申请");
        
        closeData.put("callback_data", callbackData);
        
        HttpEntity request = buildRequest(closeData);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForEntity(url, request, Map.class);
    }
    
    /**
     * 查询待办列表
     */
    public List<Map<String, Object>> queryTodoList(String handler, int pageNumber, int pageSize) {
        String url = baseUrl + "/workitem/todo/query";
        
        Map<String, Object> queryData = new HashMap<>();
        queryData.put("tenant", "tencent");
        queryData.put("category", "HR");
        queryData.put("system_app_code", List.of("HRPortal"));
        queryData.put("handler", List.of(handler));
        queryData.put("page_info", Map.of(
            "page_number", pageNumber,
            "page_size", pageSize
        ));
        
        HttpEntity request = buildRequest(queryData);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        Map<String, Object> result = response.getBody();
        Map<String, Object> data = (Map) result.get("data");
        return (List) data.get("workitems");
    }
    
    /**
     * 构建待办单据
     */
    private Map<String, Object> buildWorkitem(String processInstId, String handler, String taskDisplayName) {
        Map<String, Object> workitem = new HashMap<>();
        workitem.put("tenant", "tencent");
        workitem.put("category", "HR");
        workitem.put("sub_category", "BEREGULAR");
        workitem.put("system_app_code", "HRPortal");
        workitem.put("process_name", "Testflow");
        workitem.put("process_inst_id", processInstId);
        workitem.put("task_name", "Default");
        workitem.put("task_display_name", Map.of("cn", taskDisplayName, "en", taskDisplayName));
        workitem.put("handler", Map.of("staff_id", handler));
        workitem.put("task_inst_id", "Default-" + processInstId);
        workitem.put("form_url", "http://hr.oa.com/testflow/build/html/form.html");
        workitem.put("mobile_form_url", "http://my.oa.com/testflow/build/html/mobileform.html");
        workitem.put("callback_url", "http://hr.oa.com/testflow/api/public/callback");
        workitem.put("enable_quick_approval", true);
        workitem.put("enable_batch_approval", true);
        workitem.put("applicant", Map.of("staff_id", "00123456", "display_name", "张三(zhangsan)"));
        workitem.put("priority", 1);
        workitem.put("start_time", Instant.now().toString());
        workitem.put("due_time", Instant.now().plus(7, ChronoUnit.DAYS).toString());
        workitem.put("custom_actions", List.of(
            Map.of("display_name", Map.of("cn", "同意", "en", "Agree"), "value", "Agree", "display_color", "primary"),
            Map.of("display_name", Map.of("cn", "拒绝", "en", "Reject"), "value", "Reject", "display_color", "danger")
        ));
        
        return workitem;
    }
    
    /**
     * 构建请求
     */
    private HttpEntity buildRequest(Object body) {
        long ts = System.currentTimeMillis();
        String apiSignature = SHA256.encode(appKey + tasToken + ts);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("caagw-appkey", appKey);
        headers.add("caagw-timestamp", String.valueOf(ts));
        headers.add("caagw-signature", apiSignature);
        headers.add("Content-Type", "application/json");
        
        return new HttpEntity<>(body, headers);
    }
}
```

### 5.3 最佳实践

**1. 创建待办时**:
- ✅ 确保 `task_inst_id` 不为空,保证幂等性
- ✅ 设置合理的 `start_time` 和 `due_time`
- ✅ 提供 `callback_url` 以接收审批结果
- ✅ 设置 `enable_quick_approval` 和 `enable_batch_approval` 提升效率
- ✅ 提供 `mobile_form_url` 支持移动端访问

**2. 关闭待办时**:
- ✅ 使用 `close` 关闭正常审批的单据
- ✅ 使用 `discard` 撤销作废的单据
- ✅ 填充完整的 `callback_data` 便于已办查看
- ✅ 在业务系统审批后立即调用关单接口

**3. 回调接口实现**:
- ✅ 回调接口必须返回 `{"success": true, ...}` 表示成功
- ✅ 及时处理回调,避免超时
- ✅ 实现幂等性,避免重复处理
- ✅ 记录回调日志,便于排查问题

**4. 表单设计**:
- ✅ 使用 `approval_forms` 定义审批时需要填写的字段
- ✅ 使用 `custom_form` 定义单据详情展示的内容
- ✅ 合理使用表单组件类型 (Person/Text/Select/Date等)

### 5.4 反模式

**❌ 不推荐的做法**:

1. **不设置 task_inst_id**:
   - 问题: 无法保证幂等性,可能重复创建待办
   - 正确做法: 使用业务单据号作为 `task_inst_id`

2. **不提供 callback_url**:
   - 问题: 无法接收审批结果,流程无法继续
   - 正确做法: 实现回调接口并配置 `callback_url`

3. **回调接口返回 success: false**:
   - 问题: 待办中心认为回调失败,会重复回调
   - 正确做法: 即使业务处理失败,也返回 `success: true`,通过其他方式通知用户

4. **创建待办后不关单**:
   - 问题: 待办一直存在,用户体验差
   - 正确做法: 业务系统审批后立即调用 `close` 或 `discard`

5. **批量操作时自定义 SelectedAgree/SelectedReject 动作**:
   - 问题: 与待办中心内置批量操作冲突
   - 正确做法: 禁止上传 `submit_action` 为 `SelectedAgree`、`SelectedReject` 的 action

### 5.5 性能建议

**性能指标**:
- 创建单据: TPS >= 1000
- 审批操作 (关闭/撤销/重置): TPS >= 200

**优化建议**:
1. **批量创建**: 一次请求创建多张单据,减少网络开销
2. **异步处理**: 回调接口使用异步处理,快速返回响应
3. **缓存优化**: 业务系统缓存待办数量,避免频繁查询
4. **分页查询**: 使用合理的分页大小 (建议50条/页)

---

## 6. 数据契约层

### 6.1 核心概念

**待办单据 (Workitem)**:
- 一张审批单据,包含流程信息、处理人、审批动作等
- 通过 `tenant + systemAppCode + category + sub_category + processname + processinstid + taskname + taskinstid + handler` 唯一标识

**审批动作 (Action)**:
- 自定义动作: 由业务系统定义,如"同意"、"拒绝"
- 系统内置动作: 待办中心提供,如"转交"、"驳回"

**审批表单 (Form)**:
- `approval_forms`: 审批时需要填写的字段
- `custom_form`: 单据详情展示的内容

**审批历史 (Approval History)**:
- 记录单据的全部审批过程
- 包含审批人、审批动作、审批时间、审批意见等

### 6.2 业务领域分类

| 业务领域 | 枚举 | 子领域 |
|---------|------|--------|
| 财经 | - | - |
| 人事 (默认) | HR | JOIN/入职, DIMISSION/离职, TRANSFER/调动, VACATION/休假, BEREGULAR/转正 |
| 行政 | - | - |
| IT服务 | - | - |
| 安全中心 | - | - |
| 运营业务 | - | - |
| 基建 | - | - |

### 6.3 待办状态枚举

| 状态值 | 说明 |
|-------|------|
| 0 | 新建未处理 |
| 1 | 正常关闭 |
| 2 | 异常关闭 |
| 3 | 重置关闭 |

### 6.4 回调状态枚举

| 状态值 | 说明 |
|-------|------|
| 0 | 未开始回调 |
| 1 | 已发送给回调kafka |
| 2 | 已成功完成回调 |
| 3 | 回调失败 |

### 6.5 表单组件类型

| 组件类型 | 说明 | 示例 |
|---------|------|------|
| Select | 选择框 | 下拉选择离职去向 |
| Date | 日期选择 | 选择入职日期 |
| Hint | 只读文本 | 填表说明 |
| Attachment | 附件展示 | 展示证明文件 |
| Number | 数字输入 | 输入申请数量 |
| Input | 单行输入框 | 输入HR评语 |
| Upload | 上传组件 | 上传附件 |
| Text | 多行输入框 | 输入重新录用建议 |
| Person | 人员信息 | 显示员工信息 |
| Table | 表格组件 | 展示表格数据 |

---

## 7. 运行时行为层

### 7.1 事务特性

**创建待办**:
- 支持批量创建,保证原子性
- 单据唯一性校验,重复创建返回已存在的单据ID

**关闭待办**:
- 支持批量关闭
- 关闭失败不影响其他单据

**回调机制**:
- 异步回调,通过Kafka队列
- 回调失败会重试 (最多3次)

### 7.2 幂等性

**创建待办**:
- 通过唯一性标识保证幂等
- 重复创建返回已存在的单据

**关闭/撤销待办**:
- 已关闭的单据再次关闭不报错
- 返回成功响应

**回调处理**:
- 业务系统需实现回调接口的幂等性
- 待办中心可能重复回调

### 7.3 并发安全

**创建待办**:
- 使用唯一性标识防止并发重复创建
- MongoDB自动生成唯一ID

**关闭待办**:
- 乐观锁机制,防止并发关闭
- 状态变更记录操作日志

### 7.4 异步特性

**回调机制**:
- 待办中心审批后异步回调业务系统
- 通过Kafka保证消息不丢失
- 回调失败自动重试

**消息通知**:
- 创建待办后通知处理人 (待办提醒)
- 关闭待办后通知申请人 (已办提醒)
- 通知方式: 微信、MOA、RTX、手Q

### 7.5 缓存策略

**待办数量缓存**:
- 业务系统可缓存待办数量
- 建议缓存时间: 5分钟

**待办列表缓存**:
- 不建议缓存,数据实时性要求高
- 使用分页查询优化性能

---

## 8. 错误处理层

### 8.1 常见错误场景

**1. 创建待办失败**:

| 错误码 | 错误信息 | 原因 | 解决方案 |
|-------|---------|------|---------|
| 40001 | 参数校验失败 | 必填字段缺失 | 检查必填字段 |
| 40002 | 单据已存在 | 唯一性标识重复 | 检查唯一性标识或查询已存在单据 |
| 50001 | 系统内部错误 | 服务异常 | 联系待办中心负责人 |

**2. 关闭待办失败**:

| 错误码 | 错误信息 | 原因 | 解决方案 |
|-------|---------|------|---------|
| 40003 | 单据不存在 | 待办ID错误 | 检查待办ID |
| 40004 | 单据已关闭 | 重复关闭 | 忽略错误或查询单据状态 |
| 40005 | callback_data缺失 | 缺少回调数据 | 填充完整的callback_data |

**3. 回调失败**:

| 错误码 | 错误信息 | 原因 | 解决方案 |
|-------|---------|------|---------|
| 50002 | 回调超时 | 业务系统响应慢 | 优化回调接口性能 |
| 50003 | 回调返回失败 | success=false | 回调接口返回 success=true |
| 50004 | 回调地址不可达 | 网络异常 | 检查callback_url可访问性 |

### 8.2 降级策略

**待办中心不可用**:
- 业务系统可降级为不创建待办
- 流程正常审批,审批记录保存在业务系统

**回调失败**:
- 待办中心自动重试 (最多3次)
- 超过重试次数后记录失败日志
- 业务系统可通过查询已办接口补偿

### 8.3 重试机制

**回调重试**:
- 首次失败: 立即重试
- 第二次失败: 1分钟后重试
- 第三次失败: 5分钟后重试
- 超过3次不再重试,记录失败日志

**回调重试触发条件**:
- 回调超时 (30秒)
- 回调返回 `success: false`
- 网络异常

---

## 9. 配置说明层

### 9.1 鉴权配置

**TAS鉴权 (内外网网关)**:

```java
// 请求头配置
long ts = System.currentTimeMillis();
String apiSignature = SHA256.encode(appKey + tasToken + ts);

headers.add("caagw-appkey", appKey);
headers.add("caagw-timestamp", String.valueOf(ts));
headers.add("caagw-signature", apiSignature);
headers.add("Content-Type", "application/json");
```

**开放服务鉴权**:

```java
// 请求头配置
long ts = System.currentTimeMillis();
String apiSignature = SHA256.encode(appKey + ts + token);

headers.add("EHR-DATA-APPKEY", appKey);
headers.add("EHR-DATA-TIMESTAMP", String.valueOf(ts));
headers.add("EHR-DATA-SIGNATURE", apiSignature);
headers.add("Content-Type", "application/json");
```

### 9.2 环境配置示例

**测试环境配置**:

```properties
# 待办中心配置
todocenter.baseUrl=http://gateway.testihrtas.com
todocenter.appKey=HRPortal
todocenter.tasToken=test_token_xxxxx

# 前端地址
todocenter.frontUrl=http://todocenter-{corpkey}.test-caagw.yunassess.com

# 回调配置
todocenter.callbackUrl=http://hr.oa.com/testflow/api/public/callback
todocenter.callbackTimeout=30000
```

**生产环境配置**:

```properties
# 待办中心配置
todocenter.baseUrl=http://gateway.prodihrtas.com
todocenter.appKey=HRPortal
todocenter.tasToken=prod_token_xxxxx

# 前端地址
todocenter.frontUrl=https://todocenter-{corpkey}.ihr.tencent-cloud.com

# 回调配置
todocenter.callbackUrl=https://hr.prod.com/api/public/callback
todocenter.callbackTimeout=30000
```

---

## 10. 表单组件说明

### 10.1 选择框组件 (Select)

```json
{
  "name": "selValue",
  "label": {"cn": "离职去向", "en": "Departure"},
  "required": true,
  "need_submit": true,
  "type": "Select",
  "placeholder": "请选择离职去向",
  "max": 1, // max <= 1 单选, max > 1 多选
  "options": [
    {"label": "去向一", "value": "去向一"},
    {"label": "去向二", "value": "去向二"}
  ]
}
```

### 10.2 日期组件 (Date)

```json
{
  "name": "dateValue",
  "label": {"cn": "日期", "en": "Date"},
  "required": true,
  "need_submit": true,
  "type": "Date",
  "placeholder": "请选择日期",
  "format": "year" // year: 2022, month: 2022-03, date: 2022-03-20, datetime: 2022-03-20 11:00:00
}
```

### 10.3 只读文本 (Hint)

```json
{
  "name": "hint",
  "label": {"cn": "填表说明", "en": "Hint"},
  "type": "Hint",
  "value": {"cn": "展示填表说明", "en": "Hint text"}
}
```

### 10.4 附件组件 (Attachment)

```json
{
  "name": "attachment",
  "label": {"cn": "填表附件", "en": "Attachment"},
  "type": "Attachment",
  "value": [
    {"name": "附件1", "type": "word", "url": "http://xxx.com/file.doc"},
    {"name": "附件2", "type": "png", "url": "http://xxx.com/image.png"}
  ]
}
```

**说明**: 附件组件只展示/下载附件,上传附件请用Upload组件

### 10.5 数字组件 (Number)

```json
{
  "name": "numberValue",
  "label": {"cn": "数量", "en": "Number"},
  "required": false,
  "need_submit": true,
  "type": "Number",
  "placeholder": "请输入数量",
  "min": 1,
  "max": 10
}
```

### 10.6 单行输入框 (Input)

```json
{
  "name": "inputValue",
  "label": {"cn": "hr评语", "en": "Comment"},
  "required": false,
  "need_submit": true,
  "type": "Input",
  "placeholder": "hr评语"
}
```

### 10.7 上传组件 (Upload)

```json
{
  "name": "uploadValue",
  "label": {"cn": "上传文件", "en": "Upload"},
  "required": false,
  "need_submit": true,
  "type": "Upload",
  "placeholder": "点击上传",
  "max": 1, // 最大上传数量
  "display_color": "primary" // 按钮主题色: primary, success, info, warning, danger
}
```

### 10.8 多行输入框 (Text)

```json
{
  "name": "comment",
  "label": {"cn": "重新录用建议", "en": "Comment"},
  "required": false,
  "need_submit": true,
  "type": "Text",
  "placeholder": "请输入重新录用建议"
}
```

### 10.9 人员信息组件 (Person)

```json
{
  "name": "人员信息",
  "label": {"cn": "员工", "en": "Staff"},
  "value": {
    "staff_id": "675221",
    "global_id": "",
    "display_name": "zhangsan(张三)",
    "unit": "某公司/某组织",
    "post": "设计师"
  },
  "type": "Person"
}
```

### 10.10 表格组件 (Table)

```json
{
  "name": "table1",
  "label": {"cn": "表格1", "en": "Table"},
  "type": "Table",
  "headers": [
    {"label": {"cn": "表头1", "en": "Header1"}, "prop": "h1"},
    {"label": {"cn": "表头2", "en": "Header2"}, "prop": "h2"}
  ],
  "data": [
    {"h1": "h1xxx", "h2": "h2xxxx"},
    {"h1": "h1yyy", "h2": "h2yyy"}
  ]
}
```

---

## 11. 批量操作方案

### 11.1 背景

待办中心支持批量操作,产品设计允许用户选择多条待办进行批量审批 (同意/拒绝)。

### 11.2 批量操作按钮配置

**同意所选**:

```json
{
  "display_name": {"cn": "同意所选", "en": "SelectedAgree"},
  "value": "SelectedAgree",
  "display_color": "primary"
}
```

**拒绝所选**:

```json
{
  "display_name": {"cn": "拒绝所选", "en": "SelectedReject"},
  "value": "SelectedReject",
  "display_color": "primary"
}
```

### 11.3 批量操作回调参数

```json
{
  "item_info": [{
    "workitem_id": "",
    "tenant": "tencent",
    "system_app_code": "",
    "category": "",
    "sub_category": "",
    "process_name": "vacation",
    "process_inst_id": "",
    "task_name": "",
    "task_inst_id": "",
    "create_time": "",
    "submit_time": ""
  }],
  "callback_data": {
    "submit_source": "PC",
    "submit_action": "SelectedReject", // 或 SelectedAgree
    "submit_action_data": {},
    "submit_action_time": "2016-06-29T11:10:52.000Z",
    "submit_action_name": {
      "cn": "拒绝", // 或 "同意"
      "en": "SelectedReject" // 或 "SelectedAgree"
    },
    "submit_action_handler": {
      "global_id": "00123456",
      "staff_id": "0123456",
      "display_name": "zhangsan(张三)"
    }
  }
}
```

### 11.4 业务系统改动

1. **上传单据时**: 指定 `enableBatchApproval=true`
2. **识别批量操作**: 识别 `callback_data` 中的 `submit_action` 为 `SelectedAgree` 或 `SelectedReject`
3. **禁止冲突**: 禁止上传 `submit_action` 为 `SelectedAgree`、`SelectedReject` 的自定义 action

---

## 12. 常见问题

### 12.1 如何保证创建待办的幂等性?

**问题**: 网络异常时可能重复创建待办

**解决方案**:
1. 设置唯一的 `task_inst_id` (建议使用业务单据号)
2. 待办中心会根据唯一性标识去重
3. 重复创建时返回已存在的单据ID

### 12.2 close 和 discard 的区别?

**close** (关闭):
- 单据已在业务系统审批,需同步关闭
- 会纳入"已办列表",便于查阅
- 需要填充 `callback_data`

**discard** (撤销):
- 单据在业务系统已作废,不再需要
- 后台记录历史,但不作为"已办"呈现
- 不需要填充 `callback_data`

### 12.3 回调接口应该返回什么?

**正确返回**:

```json
{
  "success": true,
  "message": "处理成功",
  "code": 0,
  "data": {}
}
```

**注意事项**:
- 必须返回 `success: true` 表示回调成功
- 即使业务处理失败,也应返回 `success: true`,通过其他方式通知用户
- 返回 `success: false` 会导致待办中心重复回调

### 12.4 如何处理回调超时?

**原因**:
- 回调接口处理时间过长 (超过30秒)
- 网络异常

**解决方案**:
1. 回调接口使用异步处理,快速返回响应
2. 将耗时操作放到消息队列处理
3. 优化数据库查询性能
4. 检查网络连通性

### 12.5 如何自定义审批表单?

**使用 approval_forms** (审批时填写):

```json
{
  "approval_forms": [{
    "name": "comment", // 唯一标识
    "label": {"cn": "评语", "en": "Comment"},
    "value": "", // 初始值
    "placeholder": "请输入评语"
  }]
}
```

**使用 custom_form** (单据详情展示):

```json
{
  "custom_form": [{
    "name": "人员信息",
    "label": {"cn": "员工", "en": "Staff"},
    "value": {
      "staff_id": "675221",
      "display_name": "张三(zhangsan)"
    },
    "type": "Person"
  }]
}
```

---

## 附录

### 附录A: 单据在MongoDB中的存储结构

```json
{
  "workitem_id": 123456789, // 主键,SnowFlake生成
  "tenant": "tencent",
  "category": "HR",
  "sub_category": "BEREGULAR",
  "system_app_code": "HRPortal",
  "process_name": "Testflow",
  "process_display_name": {"cn": "测试流程", "en": "test process"},
  "process_title": "测试流程审批",
  "process_title_display_name": {"cn": "测试流程审批", "en": "TestflowApprove"},
  "process_inst_id": "Testflow-20160629-191028",
  "task_name": "Default",
  "task_display_name": {"cn": "直接领导审批", "en": "Direct leader approve"},
  "handler": {"staff_id": "00123456", "global_id": null},
  "task_inst_id": "Default-123456-12",
  "workitem_key": "tencent&HR&HRPortal&Testflow&Default&Default-123456-12&00123456&null",
  "form_url": "http://hr.oa.com/testflow/build/html/form.html",
  "mobile_form_url": "http://my.oa.com/testflow/build/html/mobileform.html",
  "callback_url": "http://hr.oa.com/testflow/api/public/callback",
  "enable_quick_approval": true,
  "enable_batch_approval": true,
  "enable_action_revise": true,
  "enable_action_transfer": true,
  "enable_notify": false,
  "applicant": {
    "staff_id": "00123456",
    "global_id": "00123456",
    "display_name": "张三(zhangsan)"
  },
  "priority": 1,
  "workitem_status": 0, // 0:新建 1:正常关闭 2:异常关闭 3:重置关闭
  "callback_status": 0, // 0:未回调 1:已发送 2:已成功 3:失败
  "start_time": "2016-06-29T11:10:52.000Z",
  "due_time": "2016-07-04T11:10:52.000Z",
  "receive_time": "2016-06-29T11:10:52.000Z",
  "create_time": "2016-06-29T11:10:52.000Z",
  "custom_actions": [{
    "display_name": {"cn": "转交", "en": "Transfer"},
    "display_color": "primary",
    "value": "Transfer",
    "type": "system",
    "form": null
  }, {
    "display_name": {"cn": "驳回", "en": "Reject"},
    "display_color": "primary",
    "value": "Reject",
    "type": "system",
    "form": [{"name": "reason", "label": {"cn": "驳回理由"}, "value": null}]
  }, {
    "display_name": {"cn": "同意", "en": "Agree"},
    "value": "Agree",
    "type": "custom",
    "form": [{"name": "reason", "label": {"cn": "理由"}, "value": null}]
  }],
  "approval_forms": [{
    "name": "comment",
    "label": {"cn": "评语", "en": "comment"},
    "value": ""
  }],
  "approval_stages": [{
    "approval_stage_id": "stage_1",
    "approval_stage_name": "直接领导审批"
  }],
  "approval_records": [{
    "workitem_id": "0000111",
    "approval_time": "2017-12-08T00:00:00.000Z",
    "approval_forms": [...]
  }],
  "custom_form": [{
    "name": "人员信息",
    "label": {"cn": "员工", "en": "Staff"},
    "value": {"staff_id": "675221", "display_name": "张三(zhangsan)"},
    "type": "Person"
  }],
  "summary": [{
    "label": {"cn": "员工姓名", "en": "Staff"},
    "value": {"cn": "(zhangsan)张三", "en": "zhangsan"}
  }],
  "custom_properties": {"def1": ["123", "123#abc"]},
  "callback_data": {
    "submit_source": "PC",
    "submit_action": "Agree",
    "submit_action_data": {...},
    "submit_action_time": "2016-06-29T11:10:52.000Z",
    "submit_action_name": {"cn": "同意", "en": "Agree"},
    "submit_opinion": "同意申请",
    "submit_action_handler": {
      "global_id": "00123456",
      "staff_id": "0123456",
      "display_name": "zhangsan(张三)"
    }
  }
}
```

### 附录B: 界面展示说明

**PC端待办列表**:
- 显示: `process_title_display_name`、`task_display_name`、`applicant`、`start_time`、`due_time`
- 快速审批按钮: 根据 `enable_quick_approval` 显示

**PC端待办详情**:
- 显示: `custom_form`、`approval_records`
- 审批按钮: `custom_actions`

**移动端待办列表**:
- 显示: `summary` 字段定义的摘要信息
- 快速审批: 同PC端

### 附录C: 相关文档链接

- [TAS开放服务接入说明](https://iwiki.woa.com/p/xxx)
- [微服务网关签名算法](https://iwiki.woa.com/p/4009335092)
- [待办中心前端组件库](https://iwiki.woa.com/p/xxx)

---

**文档版本**: V1.0  
**最后更新**: 2025-11-11  
**维护人**: haozonggui (桂豪纵)
