# 招聘协同平台 API 文档

> **版本**: v1.9 | **最后更新**: 2025-11-12

本文档为招聘协同平台的完整 API 集成指南，包含 FeignClient 接口调用和领域事件使用说明。

---

## 📚 文档说明

### 文档结构

本文档集包含两大类 API：

1. **FeignClient API**（51 个接口）
   - 通过 Spring Cloud Feign 调用的微服务接口
   - 提供 RESTful 风格的 HTTP 调用
   - 支持负载均衡和服务发现

2. **领域事件（Domain Events）**（11 个事件接口）
   - 基于 `BaseEventType` 的领域事件定义
   - 支持异步消息发布/订阅
   - 实现服务间解耦

### 目标用户

- **第三方系统集成开发者**：需要调用招聘协同平台 API 的外部系统开发人员
- **内部服务开发者**：开发招聘协同平台内部微服务的工程师
- **测试工程师**：编写 API 测试用例和集成测试

---

## 🚀 快速开始

### 前置条件

1. **环境要求**
   - JDK 1.8+
   - Spring Boot 2.3+
   - Spring Cloud Hoxton+

2. **依赖引入**

```xml
<dependency>
    <groupId>com.tencent.hr.recruit</groupId>
    <artifactId>recruit-collaboration-api</artifactId>
    <version>1.9.0</version>
</dependency>
```

3. **配置 Feign 客户端**

```yaml
# application.yml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_SERVER:127.0.0.1:8848}

feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
  httpclient:
    enabled: true
```

### 基础使用示例

#### 1. 调用 FeignClient 接口

```java
import com.tencent.hr.recruit.collaboration.api.flow.FlowApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlowService {
    
    @Autowired
    private FlowApi flowApi;
    
    public void queryFlow(Long flowMainId) {
        // 调用流程查询接口
        FlowMain flowMain = flowApi.getFlowMain(flowMainId);
        System.out.println("Flow: " + flowMain);
    }
}
```

#### 2. 发布领域事件

```java
import com.tencent.hr.recruit.collaboration.common.event.DomainEventBus;
import com.tencent.hr.recruit.collaboration.api.resume.event.RecruitResumeEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {
    
    @Autowired
    private DomainEventBus eventBus;
    
    public void updateResume(String extId) {
        // 更新简历后发布事件
        RecruitResumeEventData eventData = new RecruitResumeEventData();
        eventData.setExtId(extId);
        
        eventBus.publish(RecruitResumeEvent.RECRUITRESUMECHANGE, eventData);
    }
}
```

#### 3. 订阅领域事件

```java
import com.tencent.hr.recruit.collaboration.common.event.DomainEventBus;
import com.tencent.hr.recruit.collaboration.api.bole.event.BoleEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;

@Component
public class BoleEventListener {
    
    @Autowired
    private DomainEventBus eventBus;
    
    @PostConstruct
    public void init() {
        // 订阅伯乐奖励事件
        eventBus.subscribe(BoleEventListener.class.toString(), 
            BoleEvent.BoleReward, 
            event -> {
                System.out.println("收到伯乐奖励事件: " + event);
                // 处理业务逻辑
            });
    }
}
```

---

## 🔍 API 导航

### 核心业务领域

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[流程管理](./flow-api.md)** | FlowApi | - | 流程追踪中心，提供流程主数据、待办追踪等功能 |
| **[简历管理](./resume-api.md)** | ResumeCenterApi<br/>ResumeCenterPlusApi<br/>ResumeCenterAdvApi<br/>ResumeExtApi<br/>TencentRecruitResumeApi<br/>CareersApi<br/>ResourceManageResumeApi | RecruitResumeEvent | 简历中心核心功能，包括简历增删改查、ES 搜索、附件管理、简历判重等 |
| **[岗位管理](./post-api.md)** | PostApi<br/>PostExternalApi | RecruitPostEvent | 岗位中台，提供岗位数据管理和外部接口 |
| **[面试管理](./interview-api.md)** | InterviewArrangementApi<br/>SocialInterviewApi<br/>InterviewPubApi | InterviewArrangementEvent<br/>SocialInterviewEvent | 面试安排、面试评价、社招面试等功能 |

### AI 与智能化

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[AI 服务](./ai-api.md)** | AISessionApi<br/>AICommonApi<br/>AIServiceExtApi<br/>AiDocApi<br/>AICommentSummaryApi | - | AI 会话管理、文档处理、评论摘要等智能化功能 |

### 渠道与资源管理

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[渠道管理](./channel-api.md)** | ChannelIntApi<br/>ChannelApi<br/>ChannelManageIntApi | PostOutChannelEvent<br/>MediaChannelPubEvent | 渠道内外部接口、渠道管理中心 |
| **[资源管理](./integration-api.md#资源管理)** | WechatManagerIntApi<br/>ChannelStaffIntApi<br/>LandingPageIntApi<br/>ResourceManageTaskIntApi | - | 微信管理、渠道员工、落地页、资源管理任务 |

### 效能与运营

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[效能分析](./efficiency-api.md)** | EfficiencyApi | - | 招聘效能分析、数据报表、Offer 统计 |
| **[运营平台](./operation-api.md)** | OperationApi | - | 配置管理、文案管理、灰度配置 |

### 外部系统集成

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[测评平台](./assessment-api.md)** | AssessmentApi | - | 在线测评、能力评估、报告下载 |
| **[企业微信与消息](./wework-message-api.md)** | WeWorkApi<br/>WxGroupApi<br/>WxBotApi<br/>WxApi<br/>RTXApi<br/>PhoneApi | - | 企业微信、微信群组、微信机器人、RTX 消息、电话通知 |
| **[其他集成服务](./integration-api.md)** | 15+ 个服务 | - | 活水平台、资源管理、HR 系统集成等 |

### 特殊业务

| 领域 | API 接口 | 领域事件 | 说明 |
|------|---------|---------|------|
| **[伯乐推荐](./bole-api.md)** | - | BoleEvent | 伯乐奖励、超级伯乐等事件 |
| **[猎头服务](./domain-events-summary.md#猎头服务事件)** | - | HeadhunterEvent | 猎头服务相关事件 |
| **[活动链接](./domain-events-summary.md#活动链接事件)** | - | ActivityLinkEvent | 活动链接事件 |
| **[RMO 消息](./domain-events-summary.md#rmo-消息事件)** | - | RmoEvent | 消息发送、点击回调事件 |

---

## 📑 辅助服务详细导航

### 核心辅助服务

| 服务类别 | 文档链接 | 主要功能 |
|---------|---------|---------|
| **运营平台** | [operation-api.md](./operation-api.md) | 配置管理、文案管理、灰度配置 |
| **测评平台** | [assessment-api.md](./assessment-api.md) | 在线测评、能力评估、报告下载 |
| **企业微信与消息** | [wework-message-api.md](./wework-message-api.md) | 企业微信、RTX、电话通知 |
| **其他集成服务** | [integration-api.md](./integration-api.md) | 活水平台、资源管理、HR 系统集成 |

### 1. [运营平台 API](./operation-api.md)

**服务**: OperationApi

**核心功能**:
- 列表配置查询（下拉框、单选框等）
- 树形配置查询（部门树、岗位分类树）
- 文案管理（提示信息、帮助文本）
- 灰度配置（功能开关、A/B 测试）
- 配置项动态管理

**常用接口**:
- `getListConfig()` - 查询列表配置
- `getMultiConfigList()` - 批量查询多个配置
- `getTreeConfig()` - 查询树形配置
- `getTextCopy()` - 查询文案
- `getGrayConfig()` - 查询灰度配置

**使用场景**: 
- 前端下拉框数据源
- 功能灰度发布
- 多语言文案管理

---

### 2. [测评平台 API](./assessment-api.md)

**服务**: AssessmentApi

**核心功能**:
- 测评订单管理
- 测评报告查询和下载
- 测评结果分析
- 批量订单处理

**常用接口**:
- `getOrders()` - 批量查询测评订单
- `downloadReport()` - 下载测评报告

**使用场景**:
- 候选人能力评估
- 面试辅助决策
- 人才画像分析

**接口文档**: http://test-assessment.woa.com/api/pub/assessment-platform-tenant/doc.html

---

### 3. [企业微信与消息通知 API](./wework-message-api.md)

**服务**: WeWorkApi, WxGroupApi, WxBotApi, RTXApi, PhoneApi

**核心功能**:
- 企业微信消息推送
- 微信群组管理
- 微信机器人消息
- RTX 即时消息
- 电话语音通知

**使用场景**:
- 面试通知
- 流程提醒
- 紧急通知

**频率限制**:
- 企业微信: 100 次/分钟
- RTX: 50 次/分钟
- 电话通知: 10 次/分钟

---

### 4. [其他集成服务 API](./integration-api.md)

**包含服务**:

#### 活水平台
- HuoShuiPostApi - 岗位管理
- HuoShuiWeChatApi - 微信集成
- HuoShuiPortalConfigApi - 门户配置

#### 资源管理
- WechatManagerIntApi - 微信管理
- ChannelStaffIntApi - 渠道员工
- LandingPageIntApi - 落地页
- ResourceManageTaskIntApi - 任务调度

#### HR 系统集成
- HCApi - HC 管理
- HrmApi - HRM 系统
- CoreHrIntApi - 核心人事

#### 其他
- RecruitCostApi - 招聘成本
- ApplyPostApi - 申请管理
- SelectionApi - 选拔服务
- TraceApi - 追踪服务
- PortalApi - 门户服务
- RIOEventApi - RIO 事件
- InterviewFlowApplyApi - 面试流程申请
- AdvertiseCollaborationIntApi - 广告协同

---

## 🔍 按场景查找辅助服务

### 配置管理场景

**需求**: 查询下拉框选项、树形结构数据  
**使用**: [运营平台 API](./operation-api.md)  
**示例**: 学历、学位、部门树

### 候选人评估场景

**需求**: 在线测评、能力评估  
**使用**: [测评平台 API](./assessment-api.md)  
**示例**: 发起测评、查询结果、下载报告

### 消息通知场景

**需求**: 发送面试通知、流程提醒  
**使用**: [企业微信与消息通知 API](./wework-message-api.md)  
**示例**: 企业微信消息、RTX 消息、电话通知

### HR 数据同步场景

**需求**: 同步员工信息、组织架构  
**使用**: [其他集成服务 API - HR 系统集成](./integration-api.md#hr-系统集成)  
**示例**: 员工信息查询、部门信息、HC 查询

---

## ⚙️ 配置说明

### 环境配置

```yaml
# application.yml
spring:
  application:
    name: your-service-name
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_SERVER:127.0.0.1:8848}
        namespace: ${NACOS_NAMESPACE:public}

# Feign 配置
feign:
  client:
    config:
      default:
        connectTimeout: 5000      # 连接超时 5 秒
        readTimeout: 10000        # 读取超时 10 秒
  httpclient:
    enabled: true                 # 启用 HttpClient
  compression:
    request:
      enabled: true               # 启用请求压缩
    response:
      enabled: true               # 启用响应压缩

# 领域事件配置
domain:
  event:
    enabled: true                 # 启用领域事件
    async: true                   # 异步发布
    retry:
      max-attempts: 3             # 最大重试次数
      backoff-delay: 1000         # 重试延迟(毫秒)
```

### 服务地址配置

| 环境 | 网关地址 | 说明 |
|------|---------|------|
| **开发环境** | `${DEV_NTS_GW_ESB}` | 开发测试网关 |
| **测试环境** | `${TEST_NTS_GW_ESB}` | 测试环境网关 |
| **生产环境** | `${NTS_GW_ESB}` | 生产环境网关 |

### 认证配置

所有 FeignClient 接口调用都通过 `RecruitFeignHeaderInterceptor` 拦截器自动添加认证头：

```java
// 自动添加的 Header
X-CORE-HR: tencent          // 租户标识
Authorization: Bearer xxx    // 认证令牌（如需要）
```

---

## 🛡️ 错误处理

### 统一错误码

所有接口遵循统一的错误码规范：

| 错误码 | 说明 | 处理建议 |
|--------|------|---------|
| `200` | 成功 | - |
| `400` | 参数错误 | 检查请求参数格式和必填项 |
| `401` | 未授权 | 检查认证令牌是否有效 |
| `403` | 无权限 | 检查用户权限配置 |
| `404` | 资源不存在 | 检查资源 ID 是否正确 |
| `500` | 服务器内部错误 | 联系服务提供方排查 |
| `503` | 服务不可用 | 服务可能正在维护，稍后重试 |

### 错误响应格式

```json
{
  "success": false,
  "code": "400",
  "message": "参数错误: resumeId 不能为空",
  "data": null,
  "timestamp": 1699776000000
}
```

### 重试策略

**推荐重试策略**:

1. **网络超时错误**: 最多重试 3 次，间隔 1s、2s、4s（指数退避）
2. **5xx 服务器错误**: 最多重试 2 次，间隔 2s、5s
3. **4xx 客户端错误**: 不建议重试，应修正请求参数

**代码示例**:

```java
@Retryable(
    value = {FeignException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 1000, multiplier = 2)
)
public FlowMain getFlowWithRetry(Long flowMainId) {
    return flowApi.getFlowMain(flowMainId);
}
```

---

## 📊 性能与最佳实践

### 批量查询优化

**❌ 错误做法**:
```java
// 避免循环调用单个查询接口
for (Long flowMainId : flowMainIds) {
    FlowMain flow = flowApi.getFlowMain(flowMainId);
}
```

**✅ 推荐做法**:
```java
// 使用批量查询接口
List<FlowMain> flows = flowApi.getFlowMainList(flowMainIds);
```

### 超时配置建议

| 操作类型 | 连接超时 | 读取超时 | 说明 |
|---------|---------|---------|------|
| **查询接口** | 3s | 5s | 快速返回 |
| **保存接口** | 5s | 10s | 可能涉及数据库写入 |
| **批量接口** | 5s | 30s | 数据量大时需要更长时间 |
| **文件下载** | 5s | 60s | 文件传输耗时较长 |

### 并发控制

使用 Hystrix/Resilience4j 进行熔断和限流：

```java
@HystrixCommand(
    fallbackMethod = "getFlowFallback",
    commandProperties = {
        @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "5000"),
        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10")
    }
)
public FlowMain getFlow(Long flowMainId) {
    return flowApi.getFlowMain(flowMainId);
}

public FlowMain getFlowFallback(Long flowMainId) {
    // 降级逻辑
    return null;
}
```

---

## 📈 统计信息

| 类别 | 数量 | 说明 |
|------|------|------|
| **FeignClient API** | 51 | 微服务 HTTP 接口 |
| **领域事件** | 11 | 异步消息事件 |
| **业务领域** | 20+ | 涵盖招聘全流程 |

### 接口分布详情

| 业务领域 | FeignClient 接口数量 | 主要 API 类 |
|---------|-------------------|------------|
| **简历管理** | 7 | ResumeCenterApi, ResumeCenterPlusApi, ResumeCenterAdvApi, ResumeExtApi, TencentRecruitResumeApi, CareersApi, ResourceManageResumeApi |
| **AI 服务** | 6 | AISessionApi, AICommonApi, AIServiceExtApi, AiDocApi, AICommentSummaryApi, AIStreamApi |
| **流程与面试** | 3 | FlowApi, InterviewArrangementApi, SocialInterviewApi |
| **岗位管理** | 2 | PostApi, PostExternalApi |
| **渠道管理** | 3 | ChannelIntApi, ChannelApi, ChannelManageIntApi |
| **活水平台** | 3 | HuoShuiPortalConfigApi, HuoShuiPostApi, HuoShuiWeChatApi |
| **效能与运营** | 2 | EfficiencyApi, OperationApi |
| **测评平台** | 1 | AssessmentApi |
| **企业微信与消息** | 5 | WeWorkApi, WxGroupApi, WxBotApi, WxApi, RTXApi, PhoneApi |
| **其他集成服务** | 19 | HCApi, HrmApi, CoreHrIntApi, ApplyPostApi, SelectionApi, TraceApi, PortalApi, RIOEventApi, InterviewFlowApplyApi, AdvertiseCollaborationIntApi, RecruitCostApi, WechatManagerIntApi, ChannelStaffIntApi, LandingPageIntApi, ResourceManageTaskIntApi, WechatManagerIntApi, CampusApi, SecretInterviewFlowApplyApi, SocialInterviewPubApi |

### 领域事件分布

| 事件类型 | 事件数量 | 主要事件 |
|---------|---------|---------|
| **简历事件** | 3 | RecruitResumeEvent |
| **岗位事件** | 3 | RecruitPostEvent |
| **面试事件** | 3 | InterviewArrangementEvent, SocialInterviewEvent |
| **其他事件** | 2 | BoleEvent, HeadhunterEvent, ActivityLinkEvent, RmoEvent, MediaChannelPubEvent |

---

## 📝 常见问题（FAQ）

### Q1: 如何启用领域事件？

在启动类添加注解：

```java
@SpringBootApplication
@EnableDomainEvent
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Q2: FeignClient 调用失败怎么办？

1. 检查服务是否已注册到 Nacos
2. 检查网络连接和防火墙配置
3. 查看 Feign 日志（设置 `logging.level.com.tencent.hr.recruit=DEBUG`）
4. 确认目标服务是否正常运行

### Q3: 如何调试领域事件？

开启领域事件日志：

```yaml
logging:
  level:
    com.tencent.hr.recruit.collaboration.common.event: DEBUG
```

### Q4: 租户标识是什么？

租户标识（`X-CORE-HR`）用于多租户隔离，默认值为 `tencent`。不同租户的数据完全隔离。

### Q5: 如何处理大文件下载？

使用流式下载，避免一次性加载到内存：

```java
@GetMapping("/download")
public void download(HttpServletResponse response) {
    String fileUuid = "xxx";
    byte[] content = resumeCenterApi.getFileViewContent(fileUuid, "tencent").getData();
    
    response.setContentType("application/octet-stream");
    response.getOutputStream().write(content);
    response.getOutputStream().flush();
}
```

---

## 🔗 相关文档

- [DomainEventBus 使用指南](./ai-domaineventbus-guide.md) - 详细的领域事件使用说明
- [领域事件总结](./domain-events-summary.md) - 所有领域事件的完整列表和说明

---

## 📞 技术支持

- **文档维护**: AI 文档生成工具
- **问题反馈**: [GitHub Issues](https://github.com/your-org/recruit-collaboration/issues)
- **技术交流**: 企业微信群

---

**重要提示**:

1. ⚠️ 所有 API 调用需要配置正确的服务地址和认证信息
2. ⚠️ 领域事件需要启用 `@EnableDomainEvent` 注解
3. ⚠️ 批量接口一次查询数量建议不超过 100 条
4. ⚠️ 生产环境调用前请先在测试环境充分验证
