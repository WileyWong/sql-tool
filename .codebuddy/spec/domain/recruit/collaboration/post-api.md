# 岗位管理 API (Post)

## 概述

岗位管理模块提供岗位中台的核心功能，包括岗位的增删改查、敏感词检测、岗位数管理等。

---

## FeignClient 接口

### PostApi

**服务名称**: `hr-post-center`  
**配置类**: `PostFeignConfig`

---

## 接口列表

### 1. 岗位查询

#### 1.1 批量读取岗位数据
```java
@PostMapping("/api/externalapi/GetPostsByIds")
List<PostRecruitPost> getPostByIds(
    @RequestBody List<Integer> postIds,
    @RequestParam(value = "filterAllNames", required = false, defaultValue = "true") Boolean filterAllNames,
    @RequestParam(value = "withChannelTimeLong", required = false, defaultValue = "false") Boolean withChannelTimeLong
);
```

**参数说明**:
- `filterAllNames`: 是否过滤所有名称字段
- `withChannelTimeLong`: 是否包含渠道时长信息

#### 1.2 社招岗位管理列表（无权限）
```java
@PostMapping("/api/externalapi/getRecruitPostListNoRight")
CommonList<RecruitPostListDTO> getRecruitPostListNoRight(@RequestBody ReqRecruitPostList req);
```
**说明**: 本接口不加权限，调用方需自己做权限控制

#### 1.3 社招岗位管理列表（加权限）
```java
@PostMapping("/api/externalapi/getRecruitPostList")
CommonList<RecruitPostListDTO> getRecruitPostList(@RequestBody ReqRecruitPostList req);
```

#### 1.4 批量查询岗位基本信息
```java
@PostMapping("/api/externalapi/getRecruitPostBaseList")
CommonList<PostRecruitPost> getRecruitPostBaseList(@RequestBody ReqRecruitPostList req);
```
**说明**: 仅查询 PostRecruitPost、PostData 的数据，不做任何处理，速度更快

#### 1.5 读取部门岗位（旧结构）
```java
@PostMapping("/api/externalapi/getMyDepartmentPostsOldStruct")
List<OaRctRecruitPost> getMyDepartmentPostsOldStruct(
    @RequestParam("staffId") Integer staffId,
    @RequestParam("top") Integer top,
    @RequestParam("isDisabled") Integer isDisabled
);
```

#### 1.6 按岗位名称搜索岗位（旧结构）
```java
@PostMapping("/api/externalapi/QueryPostsByNameOldStruct")
List<OaRctRecruitPost> getPostByName(
    @RequestParam("postName") String postName,
    @RequestParam("top") Integer top,
    @RequestParam("isDisabled") Integer isDisabled
);
```

---

### 2. 岗位数管理

#### 2.1 岗位数减 1（旧接口）
```java
@GetMapping("/api/external/personCountChange")
String personCountChange(@RequestParam("postId") Integer postId);
```

#### 2.2 岗位数减 1（新接口）
```java
@GetMapping("/api/externalapi/personCountChange")
Integer personCountChangeApi(@RequestParam("postId") Integer postId);
```

#### 2.3 减少岗位数（带机器人通知）
```java
@PostMapping("/api/externalapi/personCountChangeAndBot")
Object personCountChangeAndBot(@RequestBody ReductionPostCountDTO reductionPostCountDTO);

@PostMapping("/api/externalapi/personCountChangeAndBot")
void personCountChangeAndBot(@RequestBody ChangeAndBotRequest request);
```

---

### 3. 渠道与统计

#### 3.1 获取每个 BG 在指定渠道的岗位数量
```java
@GetMapping("/api/externalapi/get_every_bg_post_count")
List<PostCountDTO> getEveryBgPostCount(@RequestParam("channel") String channel);
```

#### 3.2 外招渠道事件 API 调用
```java
@PostMapping("/api/externalapi/post_channel_event_manual")
Boolean postChannelEvent(@RequestBody PostOutChannelUpdateEventData data);
```

---

### 4. 敏感词检测

#### 4.1 获取敏感词
```java
@PostMapping("/api/web/base_data/getSensitiveWord")
List<String> getSensitiveWord(@RequestBody ReqSensitiveWord reqSensitiveWord);
```
**注意**: 返回结果有可能以逗号结尾

---

## 领域事件

### RecruitPostEvent

```java
public interface RecruitPostEvent {
    
    /**
     * 岗位保密变更事件
     */
    BaseEventType<PostSecretEventData> POSTSECRET_MESSAGE =
        new BaseEventType<>("recruitpost-secret", PostSecretEventData.class);
    
    /**
     * 岗位更新事件
     */
    BaseEventType<PostRecruitPost> POSTUPDATE_MESSAGE =
        new BaseEventType<>("recruitpost-update", PostRecruitPost.class);
    
    /**
     * 猎聘、脉脉发布接口调用返回失败
     */
    BaseEventType<PostMediaPublishFailure> POST_MEDIA_PUBLISH_FAILURE =
        new BaseEventType<>("recruitpost-media-publish-failure", PostMediaPublishFailure.class);
}
```

---

## 使用示例

### 查询岗位信息

```java
@Autowired
private PostApi postApi;

// 批量查询岗位
List<Integer> postIds = Arrays.asList(1001, 1002, 1003);
List<PostRecruitPost> posts = postApi.getPostByIds(postIds, true, false);

// 搜索岗位
List<OaRctRecruitPost> searchResults = postApi.getPostByName("Java开发", 10, 0);
```

### 岗位数管理

```java
// 岗位数减 1
Integer postId = 1001;
Integer newCount = postApi.personCountChangeApi(postId);

// 岗位数减 1 并通知机器人
ChangeAndBotRequest request = new ChangeAndBotRequest();
request.setPostId(postId);
request.setChangeCount(-1);
postApi.personCountChangeAndBot(request);
```

### 敏感词检测

```java
ReqSensitiveWord req = new ReqSensitiveWord();
req.setText("待检测的岗位描述文本");

List<String> sensitiveWords = postApi.getSensitiveWord(req);
if (!sensitiveWords.isEmpty()) {
    // 发现敏感词，需要处理
    System.out.println("敏感词: " + String.join(", ", sensitiveWords));
}
```

### 发布岗位更新事件

```java
@Autowired
private DomainEventBus eventBus;

// 岗位更新事件
PostRecruitPost post = new PostRecruitPost();
post.setRecruitPostId(1001);
// ... 设置其他属性

eventBus.publish(RecruitPostEvent.POSTUPDATE_MESSAGE, post);
```

### 订阅岗位事件

```java
@PostConstruct
public void init() {
    // 订阅岗位更新事件
    eventBus.subscribe("post-update-subscriber", 
        RecruitPostEvent.POSTUPDATE_MESSAGE, 
        post -> {
            Integer postId = post.getRecruitPostId();
            // 处理岗位更新逻辑
        });
    
    // 订阅岗位保密变更事件
    eventBus.subscribe("post-secret-subscriber", 
        RecruitPostEvent.POSTSECRET_MESSAGE, 
        eventData -> {
            // 处理保密变更
        });
}
```

---

---

## 最佳实践

### 1. 岗位查询优化

#### 选择合适的查询接口
```java
// 根据场景选择不同接口
// 场景1: 需要完整岗位信息（包含部分数据）
List<PostRecruitPost> posts = postApi.getPostByIds(
    postIds, 
    true,   // 过滤所有名称字段
    false   // 不需要渠道时长
);

// 场景2: 仅需基本信息，性能优先
ReqRecruitPostList req = new ReqRecruitPostList();
req.setPostIds(postIds);
CommonList<PostRecruitPost> baseList = postApi.getRecruitPostBaseList(req);

// 场景3: 需要分页和权限检查
ReqRecruitPostList pageReq = new ReqRecruitPostList();
pageReq.setPageIndex(1);
pageReq.setPageSize(20);
pageReq.setBgId(1001);
CommonList<RecruitPostListDTO> pageList = postApi.getRecruitPostList(pageReq);
```

#### 批量查询最佳实践
```java
// ✅ 推荐：批量查询
int pageSize = 100;  // 一次查询最多 100 条
List<Integer> allPostIds = // ... 获取所有 postId

for (int i = 0; i < allPostIds.size(); i += pageSize) {
    List<Integer> batch = allPostIds.subList(i, 
        Math.min(i + pageSize, allPostIds.size()));
    
    List<PostRecruitPost> posts = postApi.getPostByIds(batch, true, false);
    // 处理批次数据
    processBatch(posts);
}
```

### 2. 岗位数管理

#### 安全的岗位数减少
```java
// 使用带通知的接口确保可追踪
ChangeAndBotRequest request = new ChangeAndBotRequest();
request.setPostId(postId);
request.setChangeCount(-1);
request.setReason("候选人入职");
request.setNotifyTarget("robot_group_001"); // 通知群

try {
    postApi.personCountChangeAndBot(request);
} catch (Exception e) {
    // 岗位数减少失败，需要人工介入
    logger.error("Failed to reduce post count", e);
    alertOps("岗位数减少失败: " + postId);
}
```

#### 批量岗位数更新
```java
// 候选人批量入职
List<Integer> postsToReduce = // ... 岗位 ID 列表

for (Integer postId : postsToReduce) {
    try {
        Integer newCount = postApi.personCountChangeApi(postId);
        if (newCount <= 0) {
            logger.warn("Post {} is full after reduction", postId);
        }
    } catch (Exception e) {
        logger.error("Failed to reduce post {}", postId, e);
        // 记录失败，后续重试
    }
}
```

### 3. 敏感词检测

#### 岗位发布流程
```java
public PostPublishResult validateAndPublish(PostRecruitPost post) {
    // 1. 敏感词检测
    ReqSensitiveWord req = new ReqSensitiveWord();
    req.setText(post.getPostDescription() + post.getPostRequirement());
    
    List<String> sensitiveWords = postApi.getSensitiveWord(req);
    
    if (!sensitiveWords.isEmpty()) {
        // 2. 处理敏感词
        String cleaned = removeSensitiveWords(post.getPostDescription(), sensitiveWords);
        post.setPostDescription(cleaned);
        
        // 3. 记录敏感词事件
        logSensitiveWordDetection(post, sensitiveWords);
        
        // 4. 可选：提示用户
        return new PostPublishResult(false, 
            "检测到敏感词: " + String.join(", ", sensitiveWords));
    }
    
    // 3. 发布岗位
    return publishPost(post);
}

private String removeSensitiveWords(String text, List<String> words) {
    String result = text;
    for (String word : words) {
        result = result.replaceAll(word, "***");
    }
    return result;
}
```

### 4. 事件驱动集成

#### 处理岗位更新事件
```java
@PostConstruct
public void init() {
    eventBus.subscribe("post-update-subscriber", 
        RecruitPostEvent.POSTUPDATE_MESSAGE, 
        this::handlePostUpdate);
}

private void handlePostUpdate(PostRecruitPost post) {
    // 1. 更新缓存
    postCache.invalidate(post.getRecruitPostId());
    
    // 2. 同步到搜索引擎
    updateSearchIndex(post);
    
    // 3. 通知相关系统
    notifyDownstream(post);
}
```

---

## 错误处理指南

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|--------|
| 3001 | 岗位不存在 | 检查 postId 是否正确 |
| 3002 | 无权限操作 | 检查用户权限，确认是否是岗位所有者 |
| 3003 | 岗位数不足 | 无法再减少，需要增加岗位数 |
| 3004 | 岗位已禁用 | 启用岗位后再操作 |
| 3005 | 敏感词检测失败 | 检查敏感词词库配置 |
| 3006 | 渠道配置错误 | 检查渠道参数 |

### 重试策略

```java
public <T> T retryablePostOperation(
    Supplier<T> operation,
    int maxRetries) throws Exception {
    
    int retries = 0;
    Exception lastException = null;
    
    while (retries < maxRetries) {
        try {
            return operation.get();
        } catch (ServiceUnavailableException e) {
            lastException = e;
            if (retries < maxRetries - 1) {
                long delayMs = (long) Math.pow(2, retries) * 1000;
                logger.info("Retrying after {} ms", delayMs);
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

### 异常处理示例

```java
try {
    // 查询岗位
    List<PostRecruitPost> posts = postApi.getPostByIds(
        Arrays.asList(1001, 1002), true, false);
    
    if (posts == null || posts.isEmpty()) {
        logger.warn("No posts found for IDs");
        return Collections.emptyList();
    }
    
    return posts;
    
} catch (RestClientException e) {
    // 网络错误
    logger.error("Network error calling post service", e);
    throw new ServiceUnavailableException("Post service unavailable", e);
    
} catch (HttpClientErrorException e) {
    // 4xx 错误
    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
        logger.warn("Post not found", e);
        return Collections.emptyList();
    } else if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
        logger.error("Authentication failed", e);
        throw new AuthenticationException("Invalid credentials", e);
    }
    throw e;
    
} catch (Exception e) {
    // 其他错误
    logger.error("Unexpected error", e);
    alertOps(e);
    throw new RuntimeException("Unexpected error in post service", e);
}
```

---

## 常见问题 (FAQ)

### Q1: `filterAllNames` 和 `withChannelTimeLong` 参数的作用？

**A**: 
- **filterAllNames**: 是否过滤所有名称相关字段（部分敏感字段可能被过滤）
  - `true`: 已处理过的岗位名称（推荐用于展示）
  - `false`: 原始岗位名称（用于编辑）

- **withChannelTimeLong**: 是否包含渠道投放的时长统计
  - `true`: 包含详细的渠道投放数据（性能较差）
  - `false`: 仅基本岗位信息（推荐用于列表查询）

### Q2: 新旧接口有什么区别？

**A**: 
| 新接口 | 旧接口 | 区别 |
|--------|--------|------|
| `getRecruitPostList` | `getMyDepartmentPostsOldStruct` | 新增权限检查，返回对象结构更清晰 |
| `personCountChangeApi` | `personCountChange` | 新接口返回 Integer，旧接口返回 String |
| `getRecruitPostBaseList` | `GetPostsByIds` | 新接口性能更好，仅返回基本字段 |

建议使用新接口。

### Q3: 什么时候使用 `getRecruitPostBaseList` vs `getPostByIds`？

**A**: 
- **`getPostByIds`**: 需要完整岗位信息（包括部分派生数据）
- **`getRecruitPostBaseList`**: 仅需基本字段（ID、名称、人数），性能优先

### Q4: 敏感词检测返回的结果是什么格式？

**A**: 返回字符串列表，可能的格式：
```
["敏感词1", "敏感词2"]
// 或
["敏感词1,敏感词2,"]  // 注意：可能以逗号结尾
```

需要处理可能的尾部逗号。

### Q5: 如何处理岗位数减少失败？

**A**: 
1. 检查岗位是否存在且启用
2. 检查岗位数是否已为 0
3. 检查权限
4. 记录失败原因，告警运维处理

### Q6: 岗位事件的消费如何保证不漏单？

**A**: 建议：
1. 使用可持久化的事件队列
2. 实现消息消费进度记录
3. 支持消息重放（从指定时间点重新消费）
4. 实现幂等处理（多次消费同一事件无副作用）

---

## 配置示例

### FeignClient 配置
```yaml
# application.yml
feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 30000
      hr-post-center:
        read-timeout: 30000
        connect-timeout: 5000
  
  # 重试配置
  retry:
    enabled: true
    period: 100
    max-period: 1000
    max-attempts: 2
```

### 敏感词检测配置
```yaml
# 敏感词库配置
sensitive-word:
  # 敏感词更新频率（小时）
  update-interval: 6
  
  # 缓存大小
  cache-size: 10000
  
  # 敏感词匹配模式
  match-mode: LONGEST  # LONGEST, FIRST
```

### 岗位缓存配置
```yaml
# 缓存配置
cache:
  post:
    ttl: 3600  # 1 小时
    size: 10000
```

---

## 相关实体

### PostRecruitPost
```java
public class PostRecruitPost {
    private Integer recruitPostId;          // 岗位 ID（主键）
    private String postName;                // 岗位名称
    private Integer bgId;                   // BG ID
    private Integer deptId;                 // 部门 ID
    private Integer personCount;            // 招聘人数（当前值）
    private Integer planCount;              // 计划招聘人数
    private Integer isDisabled;             // 是否禁用 (0:禁用, 1:启用)
    private String channels;                // 投放渠道列表（逗号分隔）
    private Date createTime;                // 创建时间
    private Date updateTime;                // 更新时间
    private String postDescription;         // 岗位描述
    private String postRequirement;         // 岗位需求
    // ... 其他字段
}
```

### ReqRecruitPostList
```java
public class ReqRecruitPostList {
    private List<Integer> postIds;          // 岗位 ID 列表
    private Integer bgId;                   // BG ID 过滤
    private Integer deptId;                 // 部门 ID 过滤
    private Integer isDisabled;             // 是否禁用过滤
    private Integer pageIndex;              // 页码（从 1 开始）
    private Integer pageSize;               // 每页数量
    private String sortBy;                  // 排序字段
    private String sortOrder;               // 排序顺序 (ASC/DESC)
}
```

### RecruitPostListDTO
```java
public class RecruitPostListDTO {
    private Integer recruitPostId;          // 岗位 ID
    private String postName;                // 岗位名称
    private Integer bgName;                 // BG 名称
    private Integer deptName;               // 部门名称
    private Integer personCount;            // 招聘人数
    private Integer publishCount;           // 已发布数
    private String channels;                // 渠道列表
    private Date updateTime;                // 更新时间
}
```

### ChangeAndBotRequest
```java
public class ChangeAndBotRequest {
    private Integer postId;                 // 岗位 ID
    private Integer changeCount;            // 变更数量（负数表示减少）
    private String reason;                  // 变更原因
    private String notifyTarget;            // 通知目标（群/个人 ID）
    private String notifyMessage;           // 自定义通知消息
}
```

---

## 集成检查清单

- [ ] 已配置 hr-post-center FeignClient
- [ ] 已配置敏感词检测词库
- [ ] 已订阅岗位相关领域事件
- [ ] 已实现岗位数变更的异常处理和告警
- [ ] 已实现敏感词检测的自动过滤逻辑
- [ ] 已配置岗位信息缓存
- [ ] 已进行性能测试（单条 vs 批量查询）
- [ ] 已准备灾难恢复方案（事件消费失败时的处理）

---

[返回 API 索引](./index.md)
