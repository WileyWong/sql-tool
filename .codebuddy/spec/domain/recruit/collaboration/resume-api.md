# 简历管理 API (Resume)

## 概述

简历管理模块提供简历中心的核心功能，包括简历的增删改查、ES 搜索、附件管理、简历判重等。

---

## FeignClient 接口

### 1. ResumeCenterApi

**服务名称**: `hr-resume-center-v2`  
**配置类**: `RecruitFeignHeaderInterceptor`  
**基础路径**: `/api`

#### 1.1 简历查询

##### 通过 ES 查询简历
```java
@PostMapping("/resume_query/queryes")
ResumeCenterResult<EsResult> query(
    @RequestBody String queryJson, 
    @RequestHeader("X-CORE-HR") String tenant
);
```
**说明**: 传入 ES 的 JSON 查询语句

##### 获取单个简历
```java
@PostMapping("/resume/get_resume")
ResumeCenterResult<ResumeMain> getResume(
    @RequestBody(required = false) ResumeReadDTO postParam, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 获取简历历史版本（按 ExtId）
```java
@GetMapping("/resume/get_resume_version_by_extid/{extId}")
ResumeCenterResult<List<ResumeHistoryVersion>> getResumeVersionByExtId(
    @PathVariable("extId") String extId, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 获取简历历史版本（按版本号）
```java
@GetMapping("/resume/get_resume_version/{versionId}")
ResumeCenterResult<ResumeHistoryVersion> getResumeByVersion(
    @PathVariable("versionId") Long versionId, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

#### 1.2 简历保存

##### 保存简历（带判重结果）
```java
@PostMapping("/resume/save_with_result")
ResumeCenterResult<SaveResumeResult> saveResultWithResult(
    @RequestBody ResumeMain resumeMain,
    @RequestParam(value = "recordHistory") Boolean recordHistory,
    @RequestParam(value = "cover") Boolean cover,
    @RequestParam(value = "useSimpleCheckRepeat") Boolean useSimpleCheckRepeat,
    @RequestParam(value = "onlyCheckExtId") Boolean onlyCheckExtId,
    @RequestParam(value = "includeDisabled") boolean includeDisabled,
    @RequestHeader("X-CORE-HR") String tenant
);
```

**参数说明**:
- `recordHistory`: 是否立即记录历史版本，默认 true
- `cover`: true 直接覆盖，false 返回重复简历信息
- `useSimpleCheckRepeat`: true 只使用手机号、Email、身份证号判重
- `includeDisabled`: 判重时是否包含 enable=0 的简历

#### 1.3 简历 ID 转换

##### RID 转换为 ExtId 和 ID
```java
@GetMapping("/resume/resume_rid_mapper/{rid}")
ResumeCenterResult<ResumeIdsMapper> resumeRidMapper(
    @PathVariable("rid") String rid, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### ExtId 转换为 RID 和 ID
```java
@GetMapping("/resume/resume_extid_mapper/{extId}")
ResumeCenterResult<ResumeIdsMapper> resumeExtIdMapper(
    @PathVariable("extId") String extId, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

#### 1.4 附件管理

##### 批量获取文件下载/预览地址
```java
@PostMapping("/resume/get_download_urls")
ResumeCenterResult<Map<String, String>> getFileDownloadUrls(
    @RequestBody List<String> fileUuids, 
    @RequestParam(value = "type") Integer type, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 获取文件基本属性
```java
@GetMapping("/resume/get_file_info")
ResumeCenterResult<FileInfoResult> getFileInfo(
    @RequestParam(value = "fileUuid") String fileUuid, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 获取预览 PDF 内容
```java
@GetMapping("/resume/get_file_view_content")
ResumeCenterResult<byte[]> getFileViewContent(
    @RequestParam(value = "fileUuid") String fileUuid, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 简历原始附件解析 UUID
```java
@GetMapping("/resume/orginal_attach_analysis_uuid")
ResumeCenterResult<String> attachAnalysisUuid(
    @RequestParam(value = "fileUuid") String fileUuid, 
    @RequestParam("fileName") String fileName
);
```

#### 1.5 ES 数据操作

##### 推送 Business 字段到 ES
```java
@PostMapping("/resume_query/push_business")
ResumeCenterResult<Boolean> pushBusiness(
    @RequestBody List<ElasticSearchBusiness> business, 
    @RequestHeader("X-CORE-HR") String tenant
);
```

##### 批量更新 ES 数据
```java
@PostMapping("/resume_query/update_es_bulk")
ResumeCenterResult<Boolean> updateEsBulk(
    @RequestBody List<EsUpdateBulk> bulks, 
    @RequestParam(value = "tenant") String tenant
);
```
**注意**: 一次不要传太多，注意耗时

##### 将 ResumeMain 转换为 ES 格式
```java
@PostMapping("/resume/get_es_model")
ResumeCenterResult<List<String>> getResumeEsResult(
    @RequestBody List<ResumeMain> rms, 
    @RequestParam(value = "operationEntity") Boolean operationEntity
);
```

#### 1.6 资源分区管理

##### 统计区内简历数量（按时间段）
```java
@GetMapping("/resource/area_resume_count")
ResumeCenterResult<List<AreaResumeCountDTO>> areaResumeCount(
    @RequestParam(value = "timeStart") String timeStart, 
    @RequestParam(value = "timeEnd") String timeEnd
);
```
**格式**: yyyy-MM-dd

##### 统计区内所有简历数量
```java
@GetMapping("/resource/area_resume_total_count")
ResumeCenterResult<List<AreaResumeCountDTO>> areaResumeTotalCount();
```

##### 将分区简历还原到默认分区
```java
@PostMapping("/resource/reset_to_default_area")
ResumeCenterResult<Boolean> resetToDefaultArea(@RequestBody ResetToDefaultAreaDTO param);
```

---

### 2. 其他简历相关 API

#### 2.1 ResumeCenterPlusApi
**服务名称**: `hr-resume-center-v2`

#### 2.2 ResumeCenterAdvApi
**服务名称**: `hr-resume-center-v2`

#### 2.3 ResumeExtApi
**服务名称**: 简历扩展服务

#### 2.4 TencentRecruitResumeApi
**服务名称**: 腾讯招聘简历服务

#### 2.5 CareersApi
**服务名称**: 职业发展服务

#### 2.6 ResourceManageResumeApi
**服务名称**: 资源管理简历服务

---

## 领域事件

### RecruitResumeEvent

```java
public interface RecruitResumeEvent {
    
    /**
     * 简历更新事件
     */
    BaseEventType<RecruitResumeEventData> RECRUITRESUMECHANGE =
        new BaseEventType<>("recruitresume-change", RecruitResumeEventData.class);
    
    /**
     * 简历 Business 更新事件
     */
    BaseEventType<RecruitResumeEventData> RECRUITRESUMEBUSINESSCHANGE =
        new BaseEventType<>("recruitresume-business-change", 
            RecruitResumeEventData.class, "domain-event-queue-resume");
    
    /**
     * 社招简历状态变化（只有 ExtId 有值）
     */
    BaseEventType<RecruitResumeEventData> SOCIALRESUMESTATUSCHANGE =
        new BaseEventType<>("social-resume-status-change", RecruitResumeEventData.class);
}
```

---

## 使用示例

### 保存简历并处理判重

```java
@Autowired
private ResumeCenterApi resumeCenterApi;

ResumeMain resume = new ResumeMain();
// ... 设置简历信息

ResumeCenterResult<SaveResumeResult> result = resumeCenterApi.saveResultWithResult(
    resume,
    true,   // 记录历史
    false,  // 不直接覆盖，返回重复信息
    false,  // 使用完整判重规则
    false,  // 不仅检查 ExtId
    false,  // 不包含已禁用简历
    "tencent"
);

if (result.isSuccess()) {
    SaveResumeResult saveResult = result.getData();
    if (saveResult.hasRepeat()) {
        // 处理重复简历
        List<ResumeMain> repeats = saveResult.getRepeatResumes();
    } else {
        // 保存成功
        String resumeId = saveResult.getResumeId();
    }
}
```

### 查询简历

```java
// 通过 ExtId 查询
ResumeReadDTO readDTO = new ResumeReadDTO();
readDTO.setExtId("12345");

ResumeCenterResult<ResumeMain> result = resumeCenterApi.getResume(readDTO, "tencent");
if (result.isSuccess()) {
    ResumeMain resume = result.getData();
}
```

### 发布简历更新事件

```java
@Autowired
private DomainEventBus eventBus;

RecruitResumeEventData eventData = new RecruitResumeEventData();
eventData.setExtId(resume.getExtId());
eventData.setResumeId(resume.getResumeId());

// 发布简历更新事件
eventBus.publish(RecruitResumeEvent.RECRUITRESUMECHANGE, eventData);
```

### 订阅简历事件

```java
@Autowired
private DomainEventBus eventBus;

@PostConstruct
public void init() {
    // 订阅简历更新事件
    eventBus.subscribe("my-resume-subscriber", 
        RecruitResumeEvent.RECRUITRESUMECHANGE, 
        event -> {
            // 处理简历更新
            String extId = event.getExtId();
            // ... 业务逻辑
        });
}
```

---

---

## 最佳实践

### 1. 简历查询优化

#### 避免重复查询
```java
// ❌ 不推荐：多次调用 query
for (String extId : extIds) {
    resumeCenterApi.getResume(createDTO(extId), "tencent");
}

// ✅ 推荐：使用 ES 批量查询
String esQuery = "{ \"query\": { \"terms\": { \"extId\": [\"id1\", \"id2\"] } } }";
resumeCenterApi.query(esQuery, "tencent");
```

#### 判重策略选择
```java
// 根据场景选择合适的判重策略
SaveResumeResult result = resumeCenterApi.saveResultWithResult(
    resume,
    true,   // 记录历史
    false,  // 返回重复信息
    true,   // 简单判重（仅手机、Email、身份证号）
    false,  // 不仅检查 ExtId
    false,  // 不包含已禁用简历
    tenant
);
```

### 2. 事件驱动设计

#### 高效事件订阅
```java
@PostConstruct
public void init() {
    // 批量事件处理，避免频繁重新计算
    eventBus.subscribe("resume-processor", 
        RecruitResumeEvent.RECRUITRESUMECHANGE, 
        events -> {
            // 聚合多个事件，批量处理
            processBatch(events);
        });
}
```

### 3. 并发安全

- **简历 ID 映射**: RID、ExtId、ID 之间的映射操作是幂等的
- **版本管理**: 每次保存自动递增版本号，支持乐观锁
- **事件发布**: 异步推送，不阻塞主流程

---

## 错误处理指南

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|--------|
| 1001 | 简历不存在 | 检查 resumeId/extId 是否正确 |
| 1002 | 租户不存在 | 检查 X-CORE-HR header 值 |
| 1003 | 判重失败 | 检查必填字段（手机号/Email/身份证号） |
| 1004 | 版本冲突 | 重新获取最新版本再更新 |
| 5001 | ES 查询失败 | 检查查询语句是否合法 |

### 重试策略

```java
// 建议实现重试机制（指数退避）
public <T> ResumeCenterResult<T> retryableCall(
    Supplier<ResumeCenterResult<T>> supplier, 
    int maxRetries) {
    
    int retries = 0;
    while (retries < maxRetries) {
        try {
            ResumeCenterResult<T> result = supplier.get();
            if (result.isSuccess() || !isRetryable(result.getCode())) {
                return result;
            }
        } catch (Exception e) {
            // 临时错误，重试
        }
        
        long delayMs = (long) Math.pow(2, retries) * 1000;
        Thread.sleep(delayMs);
        retries++;
    }
    
    throw new RuntimeException("Max retries exceeded");
}
```

### 异常处理

```java
// 规范化异常处理
try {
    ResumeCenterResult<ResumeMain> result = 
        resumeCenterApi.getResume(dto, tenant);
    
    if (!result.isSuccess()) {
        // 业务层异常
        handleBusinessError(result.getCode(), result.getMessage());
    }
    
    ResumeMain resume = result.getData();
    if (resume == null) {
        throw new DataNotFoundException("简历为空");
    }
} catch (RestClientException e) {
    // 网络异常，可重试
    handleNetworkError(e);
} catch (Exception e) {
    // 其他异常，需要告警
    alertOps(e);
}
```

---

## 常见问题 (FAQ)

### Q1: 简历 ID、ExtId、RID 的关系是什么？

**A**: 这三个字段都能唯一标识一份简历，但用途不同：
- **resumeId**: 系统内部 ID，长整型，一般用于关联
- **extId**: 外部系统 ID（如 OA EmployeeID），用于与第三方系统集成
- **rid**: Resume ID 短码，用于生成分享链接

查询时根据场景选择合适的字段。

### Q2: 简历判重会不会覆盖已存在的简历？

**A**: 不会。`cover` 参数控制行为：
- `cover=true`: 直接覆盖（谨慎使用）
- `cover=false`: 返回重复简历列表，由调用者决定处理方式

建议始终使用 `cover=false` 以实现自定义的合并逻辑。

### Q3: 如何处理简历附件下载地址过期？

**A**: 附件 URL 有时效性（一般 4 小时），建议：
1. 先调用 `getFileInfo` 确认文件存在
2. 立即调用 `getDownloadUrl` 获取新的 URL
3. 若需持久化存储，使用文件系统或对象存储

### Q4: 什么时候应该使用 ES 查询？

**A**: 使用场景：
- **ES 查询**: 精确搜索、模糊查询、范围查询（适合前端搜索）
- **单条查询**: 已知 resumeId/extId（适合详情页加载）
- **批量查询**: 已知 ID 列表，数量 < 1000

### Q5: 事件的消费可靠性如何保证？

**A**: 使用队列配置 `domain-event-queue-resume` 确保消息不丢失。建议：
1. 订阅时设置合理的重试次数
2. 实现幂等处理（多次处理同一事件无副作用）
3. 记录消费进度，支持快照恢复

### Q6: 支持批量操作吗？最大数量限制是多少？

**A**: 支持但需要注意限制：
- **ES 更新**: 建议一次 ≤ 500 条，否则超时
- **文件下载 URL**: 一次 ≤ 100 个
- **批量查询**: 不超过 1000 条

---

## 配置示例

### 微服务注册配置
```yaml
# application.yml
spring:
  application:
    name: recruit-collaboration
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: recruit_prod

feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 30000
      hr-resume-center-v2:
        read-timeout: 60000  # 简历中心查询可能较慢
```

### 事件订阅配置
```yaml
# domain-event-queue-resume 配置
domain-event-queue-resume:
  topics:
    - recruitresume-change
    - recruitresume-business-change
  consumer-group: resume-processor-group
  max-retries: 3
  retry-delay-ms: 1000
```

---

## 相关实体

### ResumeMain
```java
public class ResumeMain {
    private String resumeId;            // 简历ID（系统内部）
    private String extId;               // 外部ID（OA EmployeeID）
    private String rid;                 // 简历 RID（用于分享）
    private String name;                // 姓名
    private String mobile;              // 手机号
    private String email;               // 邮箱
    private String idCard;              // 身份证号
    private Integer enableFlag;         // 是否启用 (0:禁用, 1:启用)
    private Integer version;            // 版本号（乐观锁）
    private Date createTime;            // 创建时间
    private Date updateTime;            // 更新时间
    private List<String> attachments;   // 附件 UUID 列表
    // ... 其他字段
}
```

### ResumeReadDTO
```java
public class ResumeReadDTO {
    private String resumeId;            // 按系统 ID 查询
    private String extId;               // 按外部 ID 查询
    private String rid;                 // 按简历 RID 查询
    private Boolean includeDeleted;     // 是否包含已删除简历
}
```

### SaveResumeResult
```java
public class SaveResumeResult {
    private String resumeId;                // 保存后的简历 ID
    private Integer version;                // 新版本号
    private Boolean hasRepeat;              // 是否有重复简历
    private List<ResumeMain> repeatResumes; // 重复简历列表
    private String message;                 // 处理信息
}
```

### ResumeHistoryVersion
```java
public class ResumeHistoryVersion {
    private Long versionId;             // 版本 ID
    private String resumeId;            // 简历 ID
    private String extId;               // 外部 ID
    private Integer versionNumber;      // 版本号
    private ResumeMain resumeData;      // 版本数据
    private String changeReason;        // 变更原因
    private Date createTime;            // 创建时间
}
```

---

## 集成检查清单

- [ ] 已配置 hr-resume-center-v2 FeignClient
- [ ] 已订阅简历相关领域事件
- [ ] 已实现简历重复检测处理逻辑
- [ ] 已配置 ES 查询索引
- [ ] 已实现附件上传/下载流程
- [ ] 已添加重试和异常处理机制
- [ ] 已进行性能测试（单条 vs 批量查询）
- [ ] 已准备灾难恢复方案（事件消费失败时的处理）

---

[返回 API 索引](./index.md)
