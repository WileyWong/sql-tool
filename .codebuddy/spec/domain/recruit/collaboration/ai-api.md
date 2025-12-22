# AI 服务 API

## 概述

AI 服务模块提供 AI 会话管理、AI 文档处理、AI 评论摘要等智能化功能。

---

## FeignClient 接口

### 1. AISessionApi

**服务名称**: `recruit-ai-center-service`  
**配置类**: `RecruitCommonFeignConfig`

---

## 接口列表

### 1.1 会话管理

#### 创建会话
```java
@PostMapping("/api/ext/session/{type}/create")
String createSession(
    @Valid @RequestBody CreateSessionCommand command, 
    @PathVariable("type") String type
);
```
**返回**: 会话 ID

#### 更新会话基础信息
```java
@PostMapping("/api/ext/session/{type}/update")
String updateSession(
    @Valid @RequestBody UpdateSessionCommand command, 
    @PathVariable("type") String type
);
```

#### 获取单个聊天会话详情
```java
@GetMapping("/api/ext/session/{type}/get")
ChatSessionDTO getSession(
    @RequestParam("sessionId") String sessionId, 
    @PathVariable("type") String type
);
```

#### 删除单个聊天会话
```java
@PostMapping("/api/ext/session/{type}/delete")
String deleteSession(
    @RequestParam("sessionId") String sessionId, 
    @PathVariable("type") String type
);
```

#### 创建新会话上下文
```java
@PostMapping("/api/ext/session/{type}/newContext")
String newSessionContext(
    @RequestParam("sessionId") String sessionId,
    @RequestBody String context,
    @PathVariable("type") String type
);
```
**返回**: 新的上下文 ID

---

### 1.2 消息管理

#### 保存消息
```java
@PostMapping("/api/ext/message/{type}/save")
Long saveMessage(
    @RequestBody @Valid SaveSessionMessageCommand command, 
    @PathVariable("type") String type
);
```

#### 获取消息
```java
@PostMapping("/api/ext/message/{type}/get")
SessionMessageDTO getMessage(
    @RequestParam("sessionId") String sessionId, 
    @RequestParam("messageId") Long messageId, 
    @PathVariable("type") String type
);
```
**说明**: messageId 为 -1 表示获取最后一条消息

#### 删除消息
```java
@PostMapping("/api/ext/message/{type}/delete")
String deleteMessage(
    @RequestBody @Valid DeleteSessionMessageCommand command, 
    @PathVariable("type") String type
);
```

---

## 2. AICommonApi

**服务名称**: `recruit-ai-center-service`

提供 AI 通用功能接口。

---

## 3. AIServiceExtApi

**服务名称**: `recruit-ai-center-service`

提供 AI 服务扩展功能。

---

## 4. AiDocApi

**服务名称**: `recruit-ai-center-service`

提供 AI 文档处理功能。

---

## 5. AICommentSummaryApi

**服务名称**: `recruit-ai-center-service`

提供 AI 评论摘要功能。

---

## 使用示例

### 创建 AI 会话

```java
@Autowired
private AISessionApi aiSessionApi;

// 创建会话
CreateSessionCommand createCmd = new CreateSessionCommand();
createCmd.setUserId("user123");
createCmd.setTitle("AI 面试助手");
createCmd.setDescription("辅助面试官进行候选人评估");

String sessionId = aiSessionApi.createSession(createCmd, "interview");
System.out.println("会话 ID: " + sessionId);
```

### 会话消息管理

```java
// 保存消息
SaveSessionMessageCommand saveCmd = new SaveSessionMessageCommand();
saveCmd.setSessionId(sessionId);
saveCmd.setContent("请帮我分析这位候选人的技术能力");
saveCmd.setRole("user");

Long messageId = aiSessionApi.saveMessage(saveCmd, "interview");

// 获取最后一条消息
SessionMessageDTO lastMessage = aiSessionApi.getMessage(sessionId, -1L, "interview");
System.out.println("AI 回复: " + lastMessage.getContent());

// 获取指定消息
SessionMessageDTO message = aiSessionApi.getMessage(sessionId, messageId, "interview");
```

### 会话上下文管理

```java
// 创建新的上下文
String contextData = "{\"candidateId\": 12345, \"postId\": 1001}";
String contextId = aiSessionApi.newSessionContext(sessionId, contextData, "interview");

// 获取会话详情
ChatSessionDTO session = aiSessionApi.getSession(sessionId, "interview");
System.out.println("会话标题: " + session.getTitle());
System.out.println("消息数量: " + session.getMessageCount());
```

### 更新和删除会话

```java
// 更新会话
UpdateSessionCommand updateCmd = new UpdateSessionCommand();
updateCmd.setSessionId(sessionId);
updateCmd.setTitle("AI 面试助手 - 已完成");
aiSessionApi.updateSession(updateCmd, "interview");

// 删除消息
DeleteSessionMessageCommand deleteCmd = new DeleteSessionMessageCommand();
deleteCmd.setSessionId(sessionId);
deleteCmd.setMessageId(messageId);
aiSessionApi.deleteMessage(deleteCmd, "interview");

// 删除会话
aiSessionApi.deleteSession(sessionId, "interview");
```

---

## 会话类型说明

### 常用会话类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `interview` | 面试会话 | AI 面试助手、候选人评估 |
| `resume` | 简历会话 | 简历分析、简历优化建议 |
| `chat` | 通用聊天 | 通用 AI 对话 |
| `analysis` | 分析会话 | 数据分析、报告生成 |

---

## 最佳实践

### 1. 会话管理优化

#### 会话生命周期管理
```java
public class AISessionManager {
    
    @Autowired
    private AISessionApi aiSessionApi;
    
    // 创建会话（带自动清理）
    public String createManagedSession(String userId, String sessionType) {
        CreateSessionCommand cmd = new CreateSessionCommand();
        cmd.setUserId(userId);
        cmd.setTitle("AI 助手会话 - " + System.currentTimeMillis());
        
        String sessionId = aiSessionApi.createSession(cmd, sessionType);
        
        // 注册清理任务（24 小时后自动删除）
        scheduleSessionCleanup(sessionId, sessionType, 24 * 60 * 60 * 1000);
        
        return sessionId;
    }
    
    private void scheduleSessionCleanup(String sessionId, String type, long delayMs) {
        executorService.schedule(() -> {
            try {
                aiSessionApi.deleteSession(sessionId, type);
                logger.info("Session {} cleaned up", sessionId);
            } catch (Exception e) {
                logger.warn("Failed to cleanup session {}", sessionId, e);
            }
        }, delayMs, TimeUnit.MILLISECONDS);
    }
}
```

### 2. 消息处理

#### 流式消息处理
```java
public void streamSessionMessages(String sessionId, String type, 
                                 Consumer<SessionMessageDTO> onMessage) {
    for (long messageId = 1; ; messageId++) {
        try {
            SessionMessageDTO message = aiSessionApi.getMessage(
                sessionId, messageId, type);
            if (message == null) break;
            onMessage.accept(message);
        } catch (Exception e) {
            logger.warn("Failed to fetch message {}", messageId, e);
            break;
        }
    }
}
```

---

## 错误处理指南

### 常见错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|--------|
| 5001 | 会话不存在 | 检查 sessionId 或重新创建会话 |
| 5002 | 会话类型不支持 | 检查 type 参数是否合法 |
| 5003 | 消息不存在 | 检查 messageId 是否正确 |
| 5004 | 上下文数据非法 | 检查上下文 JSON 格式 |
| 5005 | AI 服务不可用 | 稍后重试或使用降级方案 |

---

## 常见问题 (FAQ)

### Q1: 支持哪些会话类型？

**A**: interview（面试）、resume（简历）、chat（通用）、analysis（分析）

### Q2: 消息 ID = -1 是什么意思？

**A**: 表示获取最后一条消息。正整数表示获取指定 ID 的消息。

### Q3: 如何实现多轮对话？

**A**: 创建会话 → 用户提问 → 获取 AI 回复 → 重复

---

## 配置示例

```yaml
feign:
  client:
    config:
      recruit-ai-center-service:
        read-timeout: 60000
        connect-timeout: 5000

ai:
  session:
    cleanup-interval: 60
    inactive-retention-days: 7
    max-retention-days: 30
    max-messages-per-session: 1000
```

---

## 集成检查清单

- [ ] 已配置 recruit-ai-center-service FeignClient
- [ ] 已实现会话生命周期管理
- [ ] 已实现消息保存和查询功能
- [ ] 已实现上下文管理机制
- [ ] 已配置会话自动清理任务
- [ ] 已实现异常重试和降级策略
- [ ] 已进行性能测试
- [ ] 已准备灾难恢复方案

---

## 相关实体

### CreateSessionCommand
```java
public class CreateSessionCommand {
    @NotBlank
    private String userId;          // 用户 ID
    private String title;           // 会话标题
    private String description;     // 会话描述
    private Map<String, Object> metadata; // 元数据
}
```

### ChatSessionDTO
```java
public class ChatSessionDTO {
    private String sessionId;       // 会话 ID
    private String userId;          // 用户 ID
    private String title;           // 会话标题
    private String description;     // 会话描述
    private Integer messageCount;   // 消息数量
    private Date createTime;        // 创建时间
    private Date updateTime;        // 更新时间
}
```

### SaveSessionMessageCommand
```java
public class SaveSessionMessageCommand {
    @NotBlank
    private String sessionId;       // 会话 ID
    @NotBlank
    private String content;         // 消息内容
    @NotBlank
    private String role;            // 消息角色: user/assistant/system
    private Map<String, Object> metadata; // 元数据
}
```

### SessionMessageDTO
```java
public class SessionMessageDTO {
    private Long messageId;         // 消息 ID
    private String sessionId;       // 会话 ID
    private String content;         // 消息内容
    private String role;            // 消息角色
    private Date createTime;        // 创建时间
    private Map<String, Object> metadata; // 元数据
}
```

---

## AI 服务集成示例

### 面试评估助手

```java
public class InterviewAIAssistant {
    
    @Autowired
    private AISessionApi aiSessionApi;
    
    // 创建面试评估会话
    public String createInterviewSession(Integer candidateId, Long flowMainId) {
        CreateSessionCommand command = new CreateSessionCommand();
        command.setUserId("interviewer_" + SecurityUtils.getCurrentUserId());
        command.setTitle("候选人 " + candidateId + " 面试评估");
        
        String sessionId = aiSessionApi.createSession(command, "interview");
        
        // 设置上下文
        String context = String.format("{\"candidateId\": %d, \"flowMainId\": %d}", 
            candidateId, flowMainId);
        aiSessionApi.newSessionContext(sessionId, context, "interview");
        
        return sessionId;
    }
    
    // 获取 AI 评估建议
    public String getAssessmentAdvice(String sessionId, String interviewNotes) {
        SaveSessionMessageCommand command = new SaveSessionMessageCommand();
        command.setSessionId(sessionId);
        command.setContent("根据以下面试记录,请给出评估建议:\n" + interviewNotes);
        command.setRole("user");
        
        aiSessionApi.saveMessage(command, "interview");
        
        // 获取 AI 回复
        SessionMessageDTO response = aiSessionApi.getMessage(sessionId, -1L, "interview");
        return response.getContent();
    }
}
```

---

[返回 API 索引](./index.md)
