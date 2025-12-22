
# HR 事件发布订阅平台 API 文档

## 1. 基础信息层

### 1.1 平台标识
- **平台名称**: HR Event Bridge
- **中文名称**: 事件发布订阅平台
- **所属模块**: HR基础平台
- **版本信息**: V1.0（当前稳定版本）
- **状态标识**: ✅ 生产可用，稳定版本
- **协议**: HTTP/HTTPS
- **数据格式**: JSON (CloudEvents规范)

### 1.2 环境地址

| 环境 | 平台地址 | ESB网关地址 |
|------|---------|-------------|
| 测试环境 | https://test-hr-event.woa.com/ | http://dev-ntsgw.woa.com |
| UAT环境 | https://uat-hr-event.woa.com/ | http://uat-ntsgw.woa.com |
| 生产环境 | https://hr-event.woa.com/ | http://ntsgw.woa.com |

### 1.3 负责人信息
- **维护团队**: HR基础平台团队
- **技术支持**: jeeliu(刘志杰)、sethxli(李想)

---

## 2. 功能概述层

### 2.1 核心职责
提供统一的事件总线服务，支持事件的发布、订阅、过滤、转换，实现系统间的异步解耦通信。

### 2.2 使用场景
- **事件驱动架构**: 微服务间的异步通信和解耦
- **数据同步**: 跨系统的数据变更同步（员工入职、离职、调岗等）
- **业务流程触发**: 基于事件的业务流程自动化
- **实时通知**: 关键业务事件的实时推送
- **数据集成**: 多系统间的数据集成和流转

### 2.3 设计目的
- **系统解耦**: 发布者和订阅者互不依赖，降低系统耦合度
- **异步通信**: 提升系统响应速度，避免同步调用阻塞
- **灵活扩展**: 支持动态添加订阅者，无需修改发布方
- **统一标准**: 基于CloudEvents标准，提供统一的事件格式

### 2.4 业务价值
- 降低系统间耦合度，提升系统可维护性
- 支持异步处理，提升系统性能和用户体验
- 提供事件过滤和转换能力，满足多样化业务需求
- 统一事件管理，提供完整的事件追踪和监控能力

---

## 3. 快速开始

### 3.1 接入准备

#### 步骤1: CMDB系统注册
在CMDB中注册业务系统：
- 测试环境: https://test-s3-hr-cmdb.woa.com/cmdb/tree
- 生产环境: https://s3-hr-cmdb.woa.com/cmdb/project
- 操作路径: 系统与服务 → 系统 → 系统注册

#### 步骤2: 服务市场注册
在服务市场注册应用，获取鉴权凭证：
- 测试环境: https://dev-servicemarket.woa.com/appMarket
- 生产环境: http://servicemarket.woa.com/appMarket
- 获取: **AppName** 和 **AppToken**（用于API签名鉴权）

#### 步骤3: 权限申请
申请事件平台操作权限：
- 访问: https://hrright.woa.com/apply/commonApplyNew/role
- 申请角色: sysCode=hr-event-bridge, roleCode=hrevent_app_admin
- 权限名称: "事件发布订阅平台-接入系统负责人"

### 3.2 完整接入示例

以下是一个完整的员工入职事件发布订阅示例：

#### 示例1: 发布员工入职事件

```java
// 1. 签名计算
String appName = "your-app-name";
String appToken = "your-app-token";
long timestamp = System.currentTimeMillis();
String signature = DigestUtils.sha256Hex(appName + appToken + timestamp);

// 2. 设置请求头
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
headers.set("hrgw-timestamp", String.valueOf(timestamp));
headers.set("hrgw-appname", appName);
headers.set("hrgw-signature", signature);

// 3. 构建事件数据
Map<String, Object> eventData = new HashMap<>();
eventData.put("staffId", "12345");
eventData.put("staffName", "张三");
eventData.put("inauguralDate", "2023-12-02 09:00:00");
eventData.put("deptId", "100");

// 4. 构建请求体
Map<String, Object> request = new HashMap<>();
request.put("type", "StaffEntryRegistEvent");  // 事件类型（需提前注册）
request.put("datacontenttype", "application/json");
request.put("data", eventData);
request.put("businessId", "12345");  // 业务ID，用于查询

// 5. 发送请求
String url = "http://dev-ntsgw.woa.com/api/esb/hr-event-bridge-service/service/event/publish";
HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

// 6. 处理响应
System.out.println("事件发布成功: " + response.getBody());
```

#### 示例2: 订阅员工入职事件

**订阅配置**（在平台页面配置）:
- 事件名称: 员工入职事件
- 事件类型: StaffEntryRegistEvent
- 目标资源类型: HTTP
- 回调URL: http://your-system.woa.com/api/event/staff-entry
- 请求方式: POST
- 超时时间: 5000ms

**接收事件的HTTP接口实现**:

```java
@RestController
@RequestMapping("/api/event")
public class EventReceiverController {
    
    @PostMapping("/staff-entry")
    public ResponseEntity<String> handleStaffEntry(@RequestBody CloudEvent event) {
        try {
            // 1. 解析事件数据
            String eventId = event.getId();
            String eventType = event.getType();
            Map<String, Object> data = (Map<String, Object>) event.getData();
            
            String staffId = (String) data.get("staffId");
            String staffName = (String) data.get("staffName");
            String inauguralDate = (String) data.get("inauguralDate");
            
            // 2. 业务处理
            staffService.handleStaffEntry(staffId, staffName, inauguralDate);
            
            // 3. 返回200表示消费成功
            return ResponseEntity.ok("SUCCESS");
            
        } catch (Exception e) {
            // 4. 返回非200，平台会重试
            log.error("处理员工入职事件失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("FAILED");
        }
    }
}
```

---

## 4. 依赖关系层

### 4.1 上游依赖
- **CMDB系统**: 系统注册和组织信息
- **服务市场**: 应用注册和鉴权凭证
- **权限中台**: 权限管理
- **ESB网关**: API签名鉴权和路由

### 4.2 下游影响
- **事件发布方**: 所有需要发布事件的HR业务系统
- **事件订阅方**: 所有需要订阅事件的HR业务系统
- **影响范围**: 事件定义变更会影响所有订阅该事件的系统

### 4.3 环境依赖
- **网络**: HTTP/HTTPS访问
- **Kafka**: 可选，用于Kafka事件源/订阅方式
- **签名算法**: SHA256哈希算法支持

---

## 5. 接口定义层

### 5.1 核心接口列表

#### 事件发布接口

| 接口名称 | 接口路径 | 方法 | 格式 | 功能说明 |
|---------|---------|------|------|----------|
| CloudEvents发布 | /api/esb/hr-event-bridge-service/service/event/publish | POST | CloudEvents | 标准事件发布（推荐） |
| 可靠事件发布 | /api/esb/hr-event-bridge-service/service/event/rocketmq | POST | RocketMQ | 兼容可靠事件格式 |
| TOF事件发布 | /api/pub/hr-event-bridge-service/service/event/tof/publish | POST | TOF | 兼容TOF格式 |

#### 事件管理接口

| 接口名称 | 接口路径 | 方法 | 功能说明 |
|---------|---------|------|----------|
| 新增事件类型 | /open/eventType/add | POST | 注册新事件类型 |
| 编辑事件类型 | /open/eventType/edit | POST | 修改事件类型定义 |
| 查询事件类型 | /open/eventType/details | GET | 查询事件类型详情 |

### 5.2 通用请求头（ESB签名鉴权）

所有事件发布接口都需要以下请求头：

| 请求头名称 | 类型 | 必填 | 说明 |
|-----------|------|------|------|
| hrgw-timestamp | string | 是 | 当前时间戳（毫秒） |
| hrgw-appname | string | 是 | 服务市场注册的AppName |
| hrgw-signature | string | 是 | 签名值（SHA256） |
| Content-Type | string | 是 | application/json |

### 5.3 签名算法

```java
// 签名计算公式
String signature = SHA256(appName + appToken + timestamp)

// Java实现
String signature = DigestUtils.sha256Hex(appName + appToken + timestamp);
```

---

### 5.4 事件发布接口详细说明

#### 5.4.1 CloudEvents格式发布事件（推荐）

**接口路径**: `POST /api/esb/hr-event-bridge-service/service/event/publish`

**功能说明**: 使用CloudEvents标准格式发布事件，支持定时发送、有序投递等高级特性

**请求参数**:
```typescript
interface PublishEventRequest {
  id?: string;              // 事件唯一标识，不传自动生成UUID
  type: string;             // 事件类型，必填，需提前在平台注册
  specversion?: string;     // CloudEvents版本，可选，默认"1.0"
  datacontenttype: string;  // 数据类型，必填，如"application/json"
  time?: number;            // 事件时间，可选，毫秒时间戳，不传使用当前时间
  data: object;             // 事件数据，必填，大小限制2MB
  businessId?: string;      // 业务ID，可选，用于事件查询和追踪
  deliverAt?: number;       // 定时发送时间，可选，毫秒时间戳，最大支持10天后
  isorder?: boolean;        // 是否强有序，可选，默认false
}
```

**请求示例**:
```json
{
  "type": "StaffEntryRegistEvent",
  "datacontenttype": "application/json",
  "time": 1700728830214,
  "data": {
    "staffId": "12345",
    "staffName": "张三",
    "inauguralDate": "2023-12-02 09:00:00",
    "deptId": "100",
    "positionId": "200"
  },
  "businessId": "STAFF_ENTRY_12345_20231202",
  "deliverAt": 1700729830214,
  "isorder": false
}
```

**返回值说明**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "publishTime": 1700728830214
  }
}
```

**响应码说明**:

| code | 含义 | 说明 |
|------|------|------|
| 0 | 成功 | 事件发布成功 |
| 401 | 鉴权失败 | 签名验证失败 |
| 400 | 参数错误 | 事件类型未注册或字段校验失败 |
| 413 | 内容过大 | 事件data字段超过2MB |
| 500 | 服务器错误 | 内部错误 |

---

#### 5.4.2 可靠事件格式发布

**接口路径**: `POST /api/esb/hr-event-bridge-service/service/event/rocketmq`

**功能说明**: 兼容原可靠事件格式，用于老系统迁移

**请求参数**:
```typescript
interface RocketMQEventRequest {
  eventName: string;        // 事件名称，格式: systemKey|eventType
  systemKey: string;        // 系统标识
  eventData: string;        // 事件数据（JSON字符串）
  eventTags?: string;       // 事件标签，可选
  businessId?: string;      // 业务ID，可选
}
```

**请求示例**:
```json
{
  "eventName": "hr-system|STAFF_ENTRY",
  "systemKey": "hr-system",
  "eventData": "{\"staffId\":\"12345\",\"staffName\":\"张三\"}",
  "eventTags": "ENTRY",
  "businessId": "STAFF_12345"
}
```

**返回值**: 同CloudEvents格式

---

#### 5.4.3 TOF格式发布事件

**接口路径**: `POST /api/pub/hr-event-bridge-service/service/event/tof/publish`

**功能说明**: 兼容TOF事件格式

**请求参数**:
```typescript
interface TOFEventRequest {
  eventId?: string;         // 事件ID，可选
  eventName: string;        // 事件名称，必填
  eventDataJson: string;    // 事件数据（JSON字符串），必填
  businessId?: string;      // 业务ID，可选
}
```

**请求示例**:
```json
{
  "eventName": "RepeatResumeCombine",
  "eventDataJson": "{\"resumeId\":\"226134\",\"candidateId\":\"21697643\"}",
  "businessId": "RESUME_226134"
}
```

**返回值**: 同CloudEvents格式

---

### 5.5 事件管理接口详细说明

#### 5.5.1 新增事件类型

**接口路径**: `POST /open/eventType/add`

**功能说明**: 注册新的事件类型及其字段定义

**请求参数**:
```typescript
interface AddEventTypeRequest {
  eventType: string;        // 事件类型标识，必填，全局唯一
  eventName: string;        // 事件名称，必填，全局唯一
  description?: string;     // 事件描述，可选
  systemId: string;         // 所属系统ID（CMDB中的系统ID），必填
  fields: EventField[];     // 字段定义，必填
}

interface EventField {
  fieldName: string;        // 字段名称，必填
  fieldType: string;        // 字段类型，必填（见6.2.1）
  required: boolean;        // 是否必填，必填
  description?: string;     // 字段描述，可选
  defaultValue?: any;       // 默认值，可选
}
```

**请求示例**:
```json
{
  "eventType": "StaffEntryRegistEvent",
  "eventName": "员工入职事件",
  "description": "员工入职时触发",
  "systemId": "100",
  "fields": [
    {
      "fieldName": "staffId",
      "fieldType": "STRING",
      "required": true,
      "description": "员工ID"
    },
    {
      "fieldName": "staffName",
      "fieldType": "STRING",
      "required": true,
      "description": "员工姓名"
    },
    {
      "fieldName": "inauguralDate",
      "fieldType": "STRING",
      "required": true,
      "description": "入职日期"
    },
    {
      "fieldName": "deptId",
      "fieldType": "STRING",
      "required": false,
      "description": "部门ID"
    }
  ]
}
```

**返回值说明**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "eventTypeId": "123",
    "eventType": "StaffEntryRegistEvent",
    "createTime": 1700728830214
  }
}
```

---

#### 5.5.2 编辑事件类型

**接口路径**: `POST /open/eventType/edit`

**功能说明**: 修改已有事件类型的定义

**请求参数**: 同新增事件类型，需额外传入 `eventTypeId`

```typescript
interface EditEventTypeRequest extends AddEventTypeRequest {
  eventTypeId: string;      // 事件类型ID，必填
}
```

**请求示例**:
```json
{
  "eventTypeId": "123",
  "eventType": "StaffEntryRegistEvent",
  "eventName": "员工入职事件",
  "description": "员工入职时触发（更新）",
  "systemId": "100",
  "fields": [
    {
      "fieldName": "staffId",
      "fieldType": "STRING",
      "required": true,
      "description": "员工ID"
    },
    {
      "fieldName": "email",
      "fieldType": "STRING",
      "required": false,
      "description": "员工邮箱（新增字段）"
    }
  ]
}
```

**返回值**: 同新增事件类型

**注意事项**:
- ⚠️ 修改字段定义可能影响已有订阅方
- ⚠️ 不建议删除已有必填字段
- ⚠️ 新增必填字段会导致历史事件校验失败

---

#### 5.5.3 查询事件类型详情

**接口路径**: `GET /open/eventType/details`

**功能说明**: 查询事件类型的完整定义信息

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| eventType | string | 是 | 事件类型标识 |

**请求示例**:
```
GET /open/eventType/details?eventType=StaffEntryRegistEvent
```

**返回值说明**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "eventTypeId": "123",
    "eventType": "StaffEntryRegistEvent",
    "eventName": "员工入职事件",
    "description": "员工入职时触发",
    "systemId": "100",
    "systemName": "HR系统",
    "status": "ENABLED",
    "fields": [
      {
        "fieldId": "1",
        "fieldName": "staffId",
        "fieldType": "STRING",
        "required": true,
        "description": "员工ID"
      },
      {
        "fieldId": "2",
        "fieldName": "staffName",
        "fieldType": "STRING",
        "required": true,
        "description": "员工姓名"
      }
    ],
    "createTime": 1700728830214,
    "updateTime": 1700828830214,
    "creator": "admin"
  }
}
```

---

## 6. 数据契约层

### 6.1 核心数据模型

#### 6.1.1 CloudEvents事件模型（推荐）

```typescript
interface CloudEvent {
  id?: string;              // 事件唯一标识（可选，不传自动生成）
  type: string;             // 事件类型（必填，需提前注册）
  specversion?: string;     // CloudEvents规范版本（自动填充）
  datacontenttype: string;  // 数据格式类型（必填，如application/json）
  time?: number;            // 事件发生时间（可选，毫秒时间戳）
  data: object;             // 事件内容（必填，最大2MB）
  businessId?: string;      // 业务ID（可选，用于查询过滤）
  deliverAt?: number;       // 定时发送时间（可选，毫秒时间戳，最大10天）
  isorder?: boolean;        // 是否强有序（可选，默认false）
}
```

**完整示例**:
```json
{
  "id": "123",
  "type": "StaffEntryRegistEvent",
  "specversion": "1.0",
  "datacontenttype": "application/json",
  "time": 1700728830214,
  "businessId": "12345",
  "data": {
    "staffId": "12345",
    "staffName": "张三",
    "inauguralDate": "2023-12-02 09:00:00",
    "deptId": "100"
  }
}
```

#### 6.1.2 事件字段定义模型

```typescript
interface EventField {
  fieldName: string;        // 字段名称（必填）
  fieldInfo?: string;       // 字段含义（可选）
  isNull: boolean;          // 是否可为空（必填）
  fieldType: number;        // 字段类型（必填，见枚举表）
  isBusinessId?: boolean;   // 是否为业务ID（可选）
}
```

### 6.2 数据字典

#### 6.2.1 字段类型枚举 (EventFieldType)

| Value | 类型名称 | 说明 |
|-------|---------|------|
| 1 | String | 字符串类型 |
| 2 | Double | 双精度浮点数 |
| 3 | Long | 长整型 |
| 4 | Date | 日期时间 |
| 5 | Object | JSON对象 |
| 6 | Array | 数组 |
| 7 | Boolean | 布尔值 |

#### 6.2.2 响应状态码

**CloudEvents格式响应**:

| Code | 说明 | 处理建议 |
|------|------|----------|
| 000 | 成功 | 事件发布成功 |
| 其他 | 失败 | 检查msg字段获取详细错误信息 |

**可靠事件格式响应**:

| Code | 说明 | 处理建议 |
|------|------|----------|
| SUCCESS | 成功 | 事件发布成功 |
| FAIL | 失败 | 检查msg字段获取详细错误信息 |

**TOF格式响应**:

| Code | 说明 | 处理建议 |
|------|------|----------|
| 0 | 成功 | 事件发布成功 |
| 非0 | 失败 | 检查error字段获取详细错误信息 |

### 6.3 数据校验规则

#### 事件发布校验规则

1. **事件类型**: 必须提前在平台注册
2. **事件内容**: 
   - 必须符合事件定义的字段要求
   - 必填字段不能为空
   - 字段类型必须匹配
   - 整体大小不超过2MB
3. **定时发送**: deliverAt最大支持10天后
4. **业务ID**: 建议填写，用于后续查询和追踪

---

## 7. 运行时行为层

### 7.1 事件发布流程

```
发布方发送事件 → ESB签名鉴权 → 事件平台校验
→ 事件持久化 → 匹配订阅 → 应用过滤规则
→ 应用转换规则 → 推送订阅方 → 订阅方消费
```

### 7.2 事件订阅流程

```
订阅方配置订阅 → 平台启用订阅 → 监听事件
→ 匹配事件类型 → 应用过滤条件 → 应用转换规则
→ HTTP回调/Kafka推送 → 订阅方返回200/消费成功
```

### 7.3 幂等性

- **事件发布**: 
  - 不支持自动幂等，多次调用会创建多个事件
  - 建议: 业务方自行控制，可通过传入id参数实现幂等
  
- **事件订阅**: 
  - 平台保证至少一次投递（At Least Once）
  - 建议: 订阅方需实现幂等处理逻辑

### 7.4 事件顺序性

- **默认行为**: 不保证顺序（提升性能）
- **强有序**: 
  - 发布时设置`isorder=true`
  - 或在事件源配置中开启"是否强有序"
  - 注意: 保证顺序会显著影响性能

### 7.5 重试机制

**HTTP订阅重试策略**:
- 订阅方返回非200状态码视为失败
- 平台会自动重试（指数退避）
- 最大重试次数: 根据配置决定

**Kafka订阅**:
- 由订阅方自行控制消费进度
- 消费失败需订阅方自行实现重试

### 7.6 性能特性

| 特性 | 限制 | 说明 |
|------|------|------|
| 事件大小 | 2MB | data字段最大2MB |
| 定时发送 | 10天 | deliverAt最大支持10天后 |
| 并发性能 | 高 | 支持高并发事件发布 |
| 延迟 | 毫秒级 | 正常情况下毫秒级投递 |

---

## 8. 错误处理层

### 8.1 常见错误及解决方案

#### 错误1: 签名验证失败

**错误现象**: 接口返回鉴权失败

**错误原因**:
- AppName或AppToken错误
- 时间戳差异过大（超过5分钟）
- 签名算法实现错误

**解决方案**:
```java
// 正确的签名计算
String appName = "your-app-name";
String appToken = "your-app-token-from-service-market";
long timestamp = System.currentTimeMillis();
String signature = DigestUtils.sha256Hex(appName + appToken + timestamp);

// 确保时间戳与服务器时间差不超过5分钟
```

#### 错误2: 事件类型未注册

**错误现象**: 返回"事件类型不存在"

**错误原因**: 发布的事件类型未在平台注册

**解决方案**:
1. 在平台页面注册事件类型
2. 或使用开放API注册: `/open/eventType/add`
3. 确认事件类型全局唯一

#### 错误3: 事件字段校验失败

**错误现象**: 返回"字段校验失败"

**错误原因**:
- 必填字段缺失
- 字段类型不匹配
- 字段值格式错误

**解决方案**:
```java
// 确保data中包含所有必填字段
Map<String, Object> data = new HashMap<>();
data.put("staffId", "12345");  // 必填字段不能为null
data.put("type", 1);           // 类型必须匹配（Integer vs String）

// 使用开放API查询事件定义
GET /open/eventType/details?eventType=StaffEntryRegistEvent
```

#### 错误4: 事件大小超限

**错误现象**: 返回"事件内容过大"

**错误原因**: data字段超过2MB

**解决方案**:
- 精简事件数据，只包含必要字段
- 大文件通过URL引用，不要直接放在事件中
- 拆分为多个事件发送

#### 错误5: HTTP订阅回调失败

**错误现象**: 订阅方未收到事件

**错误原因**:
- 回调URL不可访问
- 订阅方返回非200状态码
- 订阅未启用

**解决方案**:
```java
// 订阅方接口必须返回200
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    try {
        // 处理事件
        processEvent(event);
        // 必须返回200
        return ResponseEntity.ok("SUCCESS");
    } catch (Exception e) {
        // 返回非200，平台会重试
        return ResponseEntity.status(500).body("FAILED");
    }
}
```

---

## 9. 配置说明层

### 9.1 事件源配置

#### HTTP事件源配置

```
事件发布 → 事件源管理 → 新增事件源
- 事件源类型: HTTP
- 系统名称: 选择已注册的系统
- 状态: 启用
```

**注意**: 同一系统仅支持注册一个HTTP事件源

#### Kafka事件源配置

```
事件发布 → 事件源管理 → 新增事件源
- 事件源类型: KAFKA
- 资源实例: 选择Kafka实例
- Topic: 主题名称（不要与订阅方相同，避免循环投递）
- Group ID: 消费组ID
- 是否强有序: 根据需求选择（影响性能）
- 状态: 启用
```

### 9.2 订阅配置

#### HTTP订阅配置示例

```
事件订阅 → 订阅管理 → 新增订阅
- 订阅名称: 员工入职事件订阅
- 事件名称: 员工入职事件 (StaffEntryRegistEvent)
- 订阅系统: 选择订阅的系统
- 目标资源类型: HTTP
- 回调URL: http://your-system.woa.com/api/event/staff-entry
- 请求方式: POST
- 超时时间: 5000ms
- 独占任务队列: 是（事件量大时建议启用）
- 状态: 启用
```

#### Kafka订阅配置示例

```
事件订阅 → 订阅管理 → 新增订阅
- 订阅名称: 员工入职事件Kafka订阅
- 事件名称: 员工入职事件 (StaffEntryRegistEvent)
- 订阅系统: 选择订阅的系统
- 目标资源类型: KAFKA
- bootstrapServers: kafka-broker:9092
- Topic: staff-entry-events
- 独占任务队列: 是
- 状态: 启用
```

### 9.3 事件过滤配置

#### 常规过滤配置

```
配置三要素:
1. 属性名称: data.staffType (支持JSONPath)
2. 匹配规则: 等值匹配
3. 属性值: 1
```

**匹配规则类型**:
- 前缀匹配
- 后缀匹配
- 除外匹配
- 包含匹配
- 等值匹配

#### 高级过滤配置（AviatorScript）

```javascript
// 示例1: email以@tencent.com结尾
string.endsWith(email, "@tencent.com")

// 示例2: staffType等于1/2/3
include(seq.set(1,2,3), staffType)

// 示例3: 复杂组合条件
(managerSubjectId == 1 && staffType == 1) || staffType == 2

// 示例4: 正则匹配
fileName =~ /(?i)^(.*)\.txt$/
```

### 9.4 事件转换配置

#### 常规转换配置

**模板变量替换**:
```json
{
  "eventName": "${type}",
  "staffId": "${data.staffId}",
  "staffName": "${data.staffName}.string"
}
```

**说明**:
- `${jsonPath}`: 变量替换
- `${jsonPath}.string`: 转为字符串

#### 高级转换配置（AviatorScript）

```javascript
// 示例: 筛选指定字段
return json.toJson(
  seq.map(
    "staffId", data.staffId,
    "staffName", data.staffName,
    "deptId", data.deptId
  )
);
```

---

## 10. 最佳实践

### 10.1 事件设计最佳实践

#### ✅ 推荐做法

1. **事件命名规范**
```
格式: {业务域}{业务对象}{行为}Event
示例: StaffEntryRegistEvent (员工入职注册事件)
     StaffTransferEvent (员工调岗事件)
     DeptCreateEvent (部门创建事件)
```

2. **事件内容设计**
```json
{
  // ✅ 推荐: 包含业务关键信息
  "data": {
    "staffId": "12345",
    "staffName": "张三",
    "beforeDeptId": "100",
    "afterDeptId": "200",
    "transferDate": "2023-12-01",
    "operator": "admin"
  }
}

// ❌ 不推荐: 包含过多冗余信息
{
  "data": {
    "staff": { /* 完整员工对象，包含100+字段 */ }
  }
}
```

3. **使用businessId追踪**
```java
// ✅ 推荐: 设置业务ID便于追踪
request.put("businessId", staffId);

// 后续可通过businessId查询事件
```

### 10.2 订阅方开发最佳实践

#### ✅ 推荐做法

1. **实现幂等处理**
```java
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    String eventId = event.getId();
    
    // ✅ 推荐: 根据eventId判断是否已处理
    if (eventProcessedCache.contains(eventId)) {
        return ResponseEntity.ok("ALREADY_PROCESSED");
    }
    
    // 处理事件
    processEvent(event);
    
    // 记录已处理
    eventProcessedCache.add(eventId);
    
    return ResponseEntity.ok("SUCCESS");
}
```

2. **异步处理降低超时**
```java
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    // ✅ 推荐: 异步处理
    eventQueue.offer(event);
    return ResponseEntity.ok("ACCEPTED");
}

// 异步消费
@Async
public void processEventAsync() {
    CloudEvent event = eventQueue.poll();
    // 处理事件
}
```

3. **完善的日志记录**
```java
log.info("收到事件, eventId={}, type={}, businessId={}", 
         event.getId(), event.getType(), event.getBusinessId());

try {
    processEvent(event);
    log.info("事件处理成功, eventId={}", event.getId());
} catch (Exception e) {
    log.error("事件处理失败, eventId={}, error={}", 
             event.getId(), e.getMessage(), e);
}
```

### 10.3 性能优化最佳实践

#### ✅ 推荐做法

1. **事件量大时启用独占队列**
```
订阅配置 → 独占任务队列: 启用
```

2. **合理使用事件过滤**
```javascript
// ✅ 推荐: 在平台侧过滤，减少订阅方压力
// 过滤条件: data.deptId == 100

// ❌ 不推荐: 订阅所有事件，在订阅方过滤
```

3. **批量事件发布**
```java
// ✅ 推荐: 批量发布（如果平台支持）
List<CloudEvent> events = buildBatchEvents();
publishBatch(events);

// ❌ 不推荐: 循环单个发布
for (Event e : events) {
    publish(e);  // 会产生大量网络请求
}
```

---

## 11. 反模式

### ❌ 不推荐的做法

#### 反模式1: 在事件中传递大对象

```java
// ❌ 错误示例: 传递完整对象
Map<String, Object> data = new HashMap<>();
data.put("staff", fullStaffObject);  // 包含100+字段
data.put("dept", fullDeptObject);

// ✅ 正确示例: 只传递必要信息
Map<String, Object> data = new HashMap<>();
data.put("staffId", "12345");
data.put("staffName", "张三");
data.put("deptId", "100");
```

**为什么**: 事件大小限制2MB，且会增加网络传输和序列化开销

---

#### 反模式2: 订阅方同步调用外部服务

```java
// ❌ 错误示例: 同步调用耗时操作
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    externalService.syncCall();  // 耗时5秒
    return ResponseEntity.ok("SUCCESS");
}

// ✅ 正确示例: 异步处理
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    eventQueue.offer(event);
    return ResponseEntity.ok("ACCEPTED");  // 立即返回
}
```

**为什么**: 同步调用会导致超时，平台会重试，造成重复消费

---

#### 反模式3: 不实现幂等处理

```java
// ❌ 错误示例: 不做幂等控制
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    database.insert(event.getData());  // 重复投递会重复插入
    return ResponseEntity.ok("SUCCESS");
}

// ✅ 正确示例: 实现幂等
@PostMapping("/event/callback")
public ResponseEntity<String> handleEvent(@RequestBody CloudEvent event) {
    if (database.exists(event.getId())) {
        return ResponseEntity.ok("ALREADY_PROCESSED");
    }
    database.insert(event.getData());
    return ResponseEntity.ok("SUCCESS");
}
```

**为什么**: 平台保证至少一次投递，可能重复，必须实现幂等

---

#### 反模式4: 循环投递

```
系统A发布事件 → Kafka Topic: A-events
系统B订阅A-events → 推送到 Kafka Topic: A-events
```

**为什么**: 会造成死循环，Topic名称必须不同

---

#### 反模式5: 硬编码AppToken

```java
// ❌ 错误示例: 硬编码
String appToken = "abc123xyz456";

// ✅ 正确示例: 从配置中心读取
String appToken = configService.getAppToken();
```

**为什么**: 存在安全风险，Token泄露后难以快速更换

---

## 12. 常见问题 (FAQ)

### Q1: 事件数据最大支持多大？
**A**: 事件data字段限制2MB。建议精简事件内容，大文件通过URL引用。

### Q2: 如何保证事件顺序？
**A**: 
- 发布时设置`isorder=true`
- 或在事件源配置中开启"是否强有序"
- 注意：保证顺序会显著影响性能

### Q3: HTTP订阅如何判断消费成功？
**A**: 订阅方HTTP接口返回200状态码视为消费成功，其他状态码平台会重试。

### Q4: 同一事件可以多个系统订阅吗？
**A**: 可以。同一事件支持多个系统独立订阅，互不影响。

### Q5: 如何追踪事件处理状态？
**A**: 
1. 发布时设置businessId
2. 在平台页面通过businessId查询事件
3. 查看投递记录和订阅方消费状态

### Q6: 事件发布失败如何处理？
**A**: 
1. 检查签名是否正确
2. 确认事件类型已注册
3. 检查事件内容是否符合字段定义
4. 查看返回的错误信息

### Q7: 订阅方未收到事件怎么办？
**A**: 
1. 确认订阅已启用
2. 检查过滤条件是否正确
3. 确认回调URL可访问
4. 查看平台投递日志

### Q8: 如何实现定时事件发送？
**A**: 设置deliverAt参数（毫秒时间戳），最大支持10天后发送。

### Q9: Kafka订阅和HTTP订阅如何选择？
**A**: 
- HTTP订阅：简单直接，适合低并发场景
- Kafka订阅：高性能，适合高并发、大数据量场景

### Q10: 跨网络区域如何接入？
**A**: 
- 非S2系统跨网络区域需通过太湖网关代理
- 参考: https://iwiki.woa.com/p/4009192154

---

## 13. 附录

### 13.1 完整接口参数文档

详细的接口参数说明请参考原文档的第6章"HTTP发布事件API"和第7章"开放接口API"。

### 13.2 参考资料

- CloudEvents规范: https://cloudevents.io/zh-cn/
- AviatorScript语法: https://www.yuque.com/boyan-avfmj/aviatorscript
- 可靠事件接口: https://iwiki.woa.com/p/4007102971
- TOF事件接口: https://iwiki.woa.com/p/940392464
- 太湖网关接入: https://iwiki.woa.com/p/4009192154

### 13.3 变更历史

- **V1.0**: 当前版本
  - 支持CloudEvents标准格式
  - 兼容可靠事件和TOF格式
  - 提供事件过滤和转换能力

---

**文档结束**
