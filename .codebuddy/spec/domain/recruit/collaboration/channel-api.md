# 渠道管理 API

> **领域**: Channel | **服务**: recruit-resource-manage-service-channel | **版本**: v1.9

---

## 📋 接口概览

渠道管理模块提供渠道内外部接口、渠道管理中心功能，包括：

- 岗位投递记录查询和同步
- 广告信息查询
- 渠道岗位信息管理
- 外招审批流程管理

---

## 🔌 FeignClient 接口

### ChannelIntApi

**服务名称**: `recruit-resource-manage-service-channel`  
**配置类**: `ResourceManageFeignConfig`

---

## 📡 接口详情

### 1. 岗位投递记录查询

#### 1.1 查询未同步的子公司岗位投递记录

```java
@GetMapping("/channel/api/int/getNoSyncApplyPost")
Map<Integer, List<ChannelApplyPost>> getNoSyncApplyPost(
    @RequestParam(value = "num", required = false, defaultValue = "500") Integer num
);
```

**参数说明**:
- `num`: 每次查询的最大数量，默认 500

**返回值**: `Map<Integer, List<ChannelApplyPost>>`
- Key: 渠道 ID
- Value: 投递记录列表

**使用场景**: 定时任务同步子公司渠道投递记录

**示例代码**:

```java
@Autowired
private ChannelIntApi channelIntApi;

// 查询未同步的投递记录
Map<Integer, List<ChannelApplyPost>> result = channelIntApi.getNoSyncApplyPost(100);

result.forEach((channelId, applyList) -> {
    log.info("渠道 {} 有 {} 条待同步记录", channelId, applyList.size());
    applyList.forEach(apply -> {
        // 处理投递记录
        syncApplyRecord(apply);
    });
});
```

---

#### 1.2 查询未同步的 OA 岗位投递记录

```java
@GetMapping("/channel/api/int/getNoSyncApplyOAPost")
Map<Integer, List<ChannelApplyPost>> getNoSyncApplyOAPost(
    @RequestParam(value = "num", required = false, defaultValue = "500") Integer num
);
```

**参数说明**:
- `num`: 每次查询的最大数量，默认 500

**返回值**: `Map<Integer, List<ChannelApplyPost>>`

**注意**: 当前只包含从有招小程序投递的记录

---

#### 1.3 完成投递状态

```java
@PostMapping("/channel/api/int/finishStateByIds")
String finishStateByIds(@RequestBody List<Long> ids);
```

**参数说明**:
- `ids`: 投递记录 ID 列表

**返回值**: 操作结果消息

**使用场景**: 同步完成后标记投递记录状态

**示例代码**:

```java
// 同步完成后标记状态
List<Long> syncedIds = Arrays.asList(1001L, 1002L, 1003L);
String result = channelIntApi.finishStateByIds(syncedIds);
log.info("标记完成结果: {}", result);
```

---

### 2. 广告信息查询

#### 2.1 根据投递记录获取广告信息

```java
@PostMapping("/channel/api/int/getAdvertiseByApplyLog")
List<ApplyAdvertise> getAdvertiseByApplyLogs(@RequestBody List<Long> logIds);
```

**参数说明**:
- `logIds`: 投递记录 ID 集合

**返回值**: `List<ApplyAdvertise>` - 广告信息列表

**使用场景**: 查询投递来源的广告信息，用于渠道效果分析

**示例代码**:

```java
// 查询广告信息
List<Long> logIds = Arrays.asList(10001L, 10002L);
List<ApplyAdvertise> advList = channelIntApi.getAdvertiseByApplyLogs(logIds);

advList.forEach(adv -> {
    log.info("广告ID: {}, 广告名称: {}", adv.getAdvertiseId(), adv.getAdvertiseName());
});
```

---

### 3. 渠道岗位管理

#### 3.1 查询渠道岗位信息

```java
@PostMapping("/channel/api/int/getPost")
List<ChannelPostInfo> getPost(@RequestBody ChannelPostQuery query);
```

**参数说明**:
- `query`: 查询条件对象
  - `channelId`: 渠道 ID
  - `postId`: 岗位 ID
  - `status`: 岗位状态

**返回值**: `List<ChannelPostInfo>` - 渠道岗位信息列表

**示例代码**:

```java
// 查询渠道岗位信息
ChannelPostQuery query = new ChannelPostQuery();
query.setChannelId(1001);
query.setStatus(1); // 1-启用

List<ChannelPostInfo> posts = channelIntApi.getPost(query);
```

---

### 4. 外招审批流程管理

#### 4.1 获取指定岗位正在流程中的渠道

```java
@GetMapping("/channel/api/int/form/findChannelInProcess")
List<Integer> findChannelInProcess(@RequestParam("postId") Integer postId);
```

**参数说明**:
- `postId`: 岗位 ID

**返回值**: `List<Integer>` - 渠道 ID 列表

---

#### 4.2 批量获取岗位正在流程中的渠道

```java
@PostMapping("/channel/api/int/form/findPostsChannelInProcess")
Map<Integer, List<Integer>> findChannelInProcess(@RequestBody List<Integer> postIds);
```

**参数说明**:
- `postIds`: 岗位 ID 列表

**返回值**: `Map<Integer, List<Integer>>`
- Key: 岗位 ID
- Value: 正在审批中的渠道 ID 列表

**使用场景**: 检查岗位是否有正在进行的外招审批

**示例代码**:

```java
// 批量查询岗位的审批中渠道
List<Integer> postIds = Arrays.asList(1001, 1002, 1003);
Map<Integer, List<Integer>> result = channelIntApi.findChannelInProcess(postIds);

result.forEach((postId, channels) -> {
    if (!channels.isEmpty()) {
        log.info("岗位 {} 有 {} 个渠道在审批中", postId, channels.size());
    }
});
```

---

#### 4.3 获取所有在审批流程中的岗位 ID

```java
@GetMapping("/channel/api/int/form/findPostIdsInProcess")
List<Integer> findPostIdsInProcess();
```

**返回值**: `List<Integer>` - 岗位 ID 列表

**使用场景**: 定时任务检查所有进行中的审批流程

---

#### 4.4 获取指定岗位的外招审批流程列表

```java
@GetMapping("/channel/api/int/form/findApprovalListByPostId")
List<PostOutChannelApproval> findApprovalListByPostId(
    @RequestParam("postId") Integer postId
);
```

**参数说明**:
- `postId`: 岗位 ID

**返回值**: `List<PostOutChannelApproval>` - 审批流程列表

---

## 🎯 领域事件

### PostOutChannelEvent

岗位外发渠道事件

```java
public interface PostOutChannelEvent {
    /**
     * 岗位外发状态变更事件
     */
    BaseEventType<PostOutChannelEventData> POST_OUT_CHANNEL_STATUS_CHANGE =
        new BaseEventType<>("post-out-channel-status-change", PostOutChannelEventData.class);
}
```

**事件数据**:

```java
public class PostOutChannelEventData {
    private Integer postId;           // 岗位 ID
    private Integer channelId;        // 渠道 ID
    private Integer status;           // 状态
    private Long operatorId;          // 操作人 ID
    private Date operateTime;         // 操作时间
}
```

**使用示例**:

```java
// 发布岗位外发事件
@Autowired
private DomainEventBus eventBus;

PostOutChannelEventData eventData = new PostOutChannelEventData();
eventData.setPostId(1001);
eventData.setChannelId(2001);
eventData.setStatus(1);

eventBus.publish(PostOutChannelEvent.POST_OUT_CHANNEL_STATUS_CHANGE, eventData);

// 订阅岗位外发事件
@PostConstruct
public void init() {
    eventBus.subscribe("channel-status-listener",
        PostOutChannelEvent.POST_OUT_CHANNEL_STATUS_CHANGE,
        event -> {
            log.info("岗位 {} 外发渠道 {} 状态变更为 {}", 
                event.getPostId(), event.getChannelId(), event.getStatus());
            // 处理业务逻辑
        });
}
```

---

### MediaChannelPubEvent

媒体渠道发布事件

```java
public interface MediaChannelPubEvent {
    /**
     * 媒体渠道发布事件
     */
    BaseEventType<MediaChannelPubEventData> MEDIA_CHANNEL_PUB =
        new BaseEventType<>("media-channel-pub", MediaChannelPubEventData.class);
}
```

---

## 📊 数据模型

### ChannelApplyPost

```java
public class ChannelApplyPost {
    private Long id;                  // 投递记录 ID
    private Integer channelId;        // 渠道 ID
    private Integer postId;           // 岗位 ID
    private String resumeId;          // 简历 ID
    private Integer status;           // 状态
    private Date applyTime;           // 投递时间
    private Integer syncStatus;       // 同步状态：0-未同步，1-已同步
}
```

### ChannelPostInfo

```java
public class ChannelPostInfo {
    private Integer channelId;        // 渠道 ID
    private String channelName;       // 渠道名称
    private Integer postId;           // 岗位 ID
    private String postName;          // 岗位名称
    private Integer status;           // 状态：1-启用，0-禁用
    private Date publishTime;         // 发布时间
}
```

### PostOutChannelApproval

```java
public class PostOutChannelApproval {
    private Long approvalId;          // 审批流程 ID
    private Integer postId;           // 岗位 ID
    private Integer channelId;        // 渠道 ID
    private Integer approvalStatus;   // 审批状态
    private Long applicantId;         // 申请人 ID
    private Date applyTime;           // 申请时间
}
```

---

## ⚠️ 注意事项

### 1. 批量查询限制

- 单次查询记录数建议不超过 500 条
- 超大批量建议分批次查询

### 2. 投递记录同步

- 同步完成后务必调用 `finishStateByIds` 标记状态
- 避免重复同步导致数据不一致

### 3. 审批流程检查

- 岗位下架前需检查是否有进行中的审批流程
- 使用 `findChannelInProcess` 接口检查

### 4. 性能优化

- 批量查询时使用批量接口
- 避免循环调用单个查询接口

---

## 💡 最佳实践

### 定时同步投递记录

```java
@Scheduled(cron = "0 */5 * * * ?") // 每 5 分钟执行一次
public void syncApplyRecords() {
    try {
        // 1. 查询未同步记录
        Map<Integer, List<ChannelApplyPost>> records = 
            channelIntApi.getNoSyncApplyPost(100);
        
        List<Long> syncedIds = new ArrayList<>();
        
        // 2. 处理每个渠道的记录
        records.forEach((channelId, applyList) -> {
            applyList.forEach(apply -> {
                try {
                    // 同步到目标系统
                    syncToTargetSystem(apply);
                    syncedIds.add(apply.getId());
                } catch (Exception e) {
                    log.error("同步失败: {}", apply.getId(), e);
                }
            });
        });
        
        // 3. 标记已同步
        if (!syncedIds.isEmpty()) {
            channelIntApi.finishStateByIds(syncedIds);
            log.info("同步完成，共 {} 条记录", syncedIds.size());
        }
    } catch (Exception e) {
        log.error("同步投递记录失败", e);
    }
}
```

### 检查岗位审批状态

```java
public boolean canOfflinePost(Integer postId) {
    // 查询正在审批中的渠道
    List<Integer> channels = channelIntApi.findChannelInProcess(postId);
    
    if (!channels.isEmpty()) {
        log.warn("岗位 {} 有 {} 个渠道在审批中，不能下架", postId, channels.size());
        return false;
    }
    
    return true;
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [渠道管理中心 API](./other-services-api.md#渠道管理中心)
- [领域事件汇总](./domain-events-summary.md)

---

**最后更新**: 2025-11-12
