# 企业微信与消息通知 API

> **领域**: WeWork & Message | **版本**: v1.9

---

## 📋 接口概览

企业微信与消息通知模块提供多种消息推送渠道，包括：

- 企业微信消息推送
- 微信群组管理
- 微信机器人消息
- RTX 即时消息
- 电话语音通知

---

## 🔌 FeignClient 接口

### 1. WeWorkApi - 企业微信集成

**服务名称**: 企业微信集成服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供企业微信相关功能集成：
- 企业微信消息发送
- 通讯录查询
- 应用管理

#### 常用接口

##### 发送企业微信消息

**使用示例**:

```java
@Autowired
private WeWorkApi weWorkApi;

/**
 * 发送企业微信文本消息
 */
public void sendTextMessage(String toUser, String content) {
    WeWorkMessageDTO message = new WeWorkMessageDTO();
    message.setMsgtype("text");
    message.setTouser(toUser);
    message.setText(new TextContent(content));
    
    Result<Boolean> result = weWorkApi.sendMessage(message);
    if (result.isSuccess()) {
        log.info("企业微信消息发送成功");
    } else {
        log.error("企业微信消息发送失败: {}", result.getMessage());
    }
}

/**
 * 发送卡片消息
 */
public void sendCardMessage(String toUser, String title, String description, String url) {
    WeWorkMessageDTO message = new WeWorkMessageDTO();
    message.setMsgtype("textcard");
    message.setTouser(toUser);
    
    TextCardContent card = new TextCardContent();
    card.setTitle(title);
    card.setDescription(description);
    card.setUrl(url);
    message.setTextcard(card);
    
    weWorkApi.sendMessage(message);
}
```

---

### 2. WxGroupApi - 微信群组管理

**服务名称**: 微信群组服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供微信群组相关功能：
- 群组创建和管理
- 群组成员管理
- 群组消息推送

#### 常用接口

##### 创建微信群

**使用示例**:

```java
@Autowired
private WxGroupApi wxGroupApi;

/**
 * 创建招聘微信群
 */
public String createRecruitGroup(String groupName, List<String> memberIds) {
    WxGroupCreateDTO createDTO = new WxGroupCreateDTO();
    createDTO.setGroupName(groupName);
    createDTO.setMemberIds(memberIds);
    
    Result<String> result = wxGroupApi.createGroup(createDTO);
    if (result.isSuccess()) {
        String groupId = result.getData();
        log.info("微信群创建成功: {}", groupId);
        return groupId;
    }
    return null;
}

/**
 * 向群组发送消息
 */
public void sendGroupMessage(String groupId, String content) {
    WxGroupMessageDTO message = new WxGroupMessageDTO();
    message.setGroupId(groupId);
    message.setContent(content);
    
    wxGroupApi.sendGroupMessage(message);
}
```

---

### 3. WxBotApi - 微信机器人

**服务名称**: 微信机器人服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供微信机器人消息推送功能：
- Webhook 消息推送
- Markdown 格式消息
- 图片消息

#### 常用接口

##### 发送机器人消息

**使用示例**:

```java
@Autowired
private WxBotApi wxBotApi;

/**
 * 发送 Markdown 消息
 */
public void sendMarkdownMessage(String webhookUrl, String content) {
    WxBotMessageDTO message = new WxBotMessageDTO();
    message.setMsgtype("markdown");
    
    MarkdownContent markdown = new MarkdownContent();
    markdown.setContent(content);
    message.setMarkdown(markdown);
    
    wxBotApi.sendMessage(webhookUrl, message);
}

/**
 * 发送面试提醒
 */
public void sendInterviewReminder(String webhookUrl, InterviewPlanDTO interview) {
    StringBuilder content = new StringBuilder();
    content.append("### 面试提醒\n");
    content.append("> **候选人**: ").append(interview.getCandidateName()).append("\n");
    content.append("> **岗位**: ").append(interview.getPostName()).append("\n");
    content.append("> **时间**: ").append(interview.getInterviewTime()).append("\n");
    content.append("> **地点**: ").append(interview.getInterviewAddress()).append("\n");
    content.append("\n请准时参加面试");
    
    sendMarkdownMessage(webhookUrl, content.toString());
}
```

---

### 4. WxApi - 微信通用服务

**服务名称**: 微信服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供微信相关的通用功能。

---

### 5. RTXApi - RTX 即时消息

**服务名称**: RTX 消息服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供 RTX 即时消息发送功能，支持：
- 文本消息
- 富文本消息
- 紧急消息

#### 常用接口

##### 发送 RTX 消息

```java
@Autowired
private RTXApi rtxApi;

/**
 * 发送 RTX 文本消息
 */
public void sendRTXMessage(String receiver, String content) {
    RTXMessageDTO message = new RTXMessageDTO();
    message.setReceiver(receiver);
    message.setContent(content);
    message.setTitle("招聘系统通知");
    
    Result<Boolean> result = rtxApi.sendMessage(message);
    if (result.isSuccess()) {
        log.info("RTX 消息发送成功");
    }
}

/**
 * 发送面试通知
 */
public void sendInterviewNotification(String receiver, InterviewPlanDTO interview) {
    String content = String.format(
        "您有一个新的面试安排：\n" +
        "候选人：%s\n" +
        "岗位：%s\n" +
        "时间：%s\n" +
        "地点：%s\n",
        interview.getCandidateName(),
        interview.getPostName(),
        interview.getInterviewTime(),
        interview.getInterviewAddress()
    );
    
    sendRTXMessage(receiver, content);
}

/**
 * 发送紧急消息（带弹窗）
 */
public void sendUrgentMessage(String receiver, String content) {
    RTXMessageDTO message = new RTXMessageDTO();
    message.setReceiver(receiver);
    message.setContent(content);
    message.setTitle("【紧急】招聘系统通知");
    message.setUrgent(true);  // 紧急消息，会弹窗提醒
    
    rtxApi.sendMessage(message);
}
```

---

### 6. PhoneApi - 电话通知

**服务名称**: 电话通知服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供电话语音通知功能。

#### 常用接口

##### 发送语音通知

```java
@Autowired
private PhoneApi phoneApi;

/**
 * 发送语音通知
 */
public void sendVoiceNotification(String phone, String content) {
    PhoneCallDTO callDTO = new PhoneCallDTO();
    callDTO.setPhone(phone);
    callDTO.setContent(content);
    callDTO.setVoiceType(1);  // 语音类型：1-文字转语音
    
    Result<Boolean> result = phoneApi.makeCall(callDTO);
    if (result.isSuccess()) {
        log.info("语音通知发送成功: {}", phone);
    }
}

/**
 * 发送面试提醒电话
 */
public void sendInterviewReminder(String phone, InterviewPlanDTO interview) {
    String content = String.format(
        "您好，这是招聘系统的面试提醒。您有一个面试安排，时间为%s，地点为%s，请准时参加。",
        interview.getInterviewTime(),
        interview.getInterviewAddress()
    );
    
    sendVoiceNotification(phone, content);
}
```

---

## 📊 数据模型

### WeWorkMessageDTO

```java
public class WeWorkMessageDTO {
    private String touser;            // 接收人，多个用 | 分隔
    private String msgtype;           // 消息类型：text/textcard/markdown
    private TextContent text;         // 文本消息
    private TextCardContent textcard; // 卡片消息
    private MarkdownContent markdown; // Markdown 消息
}

public class TextContent {
    private String content;           // 文本内容
}

public class TextCardContent {
    private String title;             // 标题
    private String description;       // 描述
    private String url;               // 跳转链接
    private String btntxt;            // 按钮文字
}
```

### WxGroupMessageDTO

```java
public class WxGroupMessageDTO {
    private String groupId;           // 群组 ID
    private String content;           // 消息内容
    private Integer msgType;          // 消息类型
}
```

### RTXMessageDTO

```java
public class RTXMessageDTO {
    private String receiver;          // 接收人（RTX 账号）
    private String title;             // 消息标题
    private String content;           // 消息内容
    private Boolean urgent;           // 是否紧急消息
    private Integer delay;            // 延迟发送（秒）
}
```

### PhoneCallDTO

```java
public class PhoneCallDTO {
    private String phone;             // 电话号码
    private String content;           // 语音内容
    private Integer voiceType;        // 语音类型：1-文字转语音，2-语音文件
    private String voiceUrl;          // 语音文件 URL（voiceType=2 时使用）
}
```

---

## ⚠️ 注意事项

### 1. 消息发送频率限制

| 渠道 | 频率限制 | 建议 |
|------|---------|------|
| **企业微信** | 100 次/分钟 | 批量发送时使用队列 |
| **RTX** | 50 次/分钟 | 避免短时间大量发送 |
| **电话通知** | 10 次/分钟 | 仅用于紧急通知 |
| **微信机器人** | 20 次/分钟 | 合并消息，减少调用 |

### 2. 消息内容规范

- 文本消息长度不超过 2048 字符
- 标题长度不超过 128 字符
- 链接必须是 HTTPS 协议
- 避免发送敏感信息（密码、手机号等）

### 3. 错误处理

- 接收人不存在时会返回失败
- 消息发送失败建议记录日志，不要重复发送
- 电话通知失败建议降级为短信或企业微信

### 4. 权限控制

- 企业微信需要配置应用权限
- RTX 需要开通消息推送权限
- 电话通知需要审批开通

---

## 💡 最佳实践

### 统一消息发送服务

```java
@Service
public class NotificationService {
    
    @Autowired
    private WeWorkApi weWorkApi;
    
    @Autowired
    private RTXApi rtxApi;
    
    @Autowired
    private PhoneApi phoneApi;
    
    /**
     * 发送通知（多渠道）
     */
    public void sendNotification(String userId, String title, String content, NotificationChannel channel) {
        switch (channel) {
            case WEWORK:
                sendWeWorkMessage(userId, title, content);
                break;
            case RTX:
                sendRTXMessage(userId, title, content);
                break;
            case PHONE:
                sendPhoneNotification(userId, content);
                break;
            default:
                log.warn("未知的通知渠道: {}", channel);
        }
    }
    
    /**
     * 发送多渠道通知（降级策略）
     */
    public void sendMultiChannelNotification(String userId, String title, String content) {
        // 优先使用企业微信
        if (sendWeWorkMessage(userId, title, content)) {
            return;
        }
        
        // 降级到 RTX
        if (sendRTXMessage(userId, title, content)) {
            return;
        }
        
        // 最后降级到电话（仅紧急情况）
        log.warn("企业微信和 RTX 都发送失败，降级到电话通知");
        sendPhoneNotification(userId, content);
    }
    
    private boolean sendWeWorkMessage(String userId, String title, String content) {
        try {
            WeWorkMessageDTO message = new WeWorkMessageDTO();
            message.setTouser(userId);
            message.setMsgtype("textcard");
            
            TextCardContent card = new TextCardContent();
            card.setTitle(title);
            card.setDescription(content);
            message.setTextcard(card);
            
            Result<Boolean> result = weWorkApi.sendMessage(message);
            return result.isSuccess();
        } catch (Exception e) {
            log.error("企业微信消息发送失败", e);
            return false;
        }
    }
    
    private boolean sendRTXMessage(String userId, String title, String content) {
        try {
            RTXMessageDTO message = new RTXMessageDTO();
            message.setReceiver(userId);
            message.setTitle(title);
            message.setContent(content);
            
            Result<Boolean> result = rtxApi.sendMessage(message);
            return result.isSuccess();
        } catch (Exception e) {
            log.error("RTX 消息发送失败", e);
            return false;
        }
    }
    
    private boolean sendPhoneNotification(String userId, String content) {
        try {
            // 从用户信息获取电话号码
            String phone = getUserPhone(userId);
            if (phone == null) {
                log.warn("用户 {} 没有电话号码", userId);
                return false;
            }
            
            PhoneCallDTO callDTO = new PhoneCallDTO();
            callDTO.setPhone(phone);
            callDTO.setContent(content);
            callDTO.setVoiceType(1);
            
            Result<Boolean> result = phoneApi.makeCall(callDTO);
            return result.isSuccess();
        } catch (Exception e) {
            log.error("电话通知发送失败", e);
            return false;
        }
    }
    
    private String getUserPhone(String userId) {
        // 从用户服务获取电话号码
        return null;
    }
}

public enum NotificationChannel {
    WEWORK,   // 企业微信
    RTX,      // RTX
    PHONE     // 电话
}
```

### 消息发送队列

```java
@Service
public class MessageQueueService {
    
    private final BlockingQueue<MessageTask> messageQueue = new LinkedBlockingQueue<>(1000);
    
    @Autowired
    private NotificationService notificationService;
    
    @PostConstruct
    public void init() {
        // 启动消息发送线程
        for (int i = 0; i < 3; i++) {
            new Thread(this::processMessages, "message-sender-" + i).start();
        }
    }
    
    /**
     * 添加消息到队列
     */
    public void enqueue(String userId, String title, String content, NotificationChannel channel) {
        MessageTask task = new MessageTask(userId, title, content, channel);
        
        boolean offered = messageQueue.offer(task);
        if (!offered) {
            log.warn("消息队列已满，消息被丢弃: {}", title);
        }
    }
    
    /**
     * 处理消息队列
     */
    private void processMessages() {
        while (true) {
            try {
                MessageTask task = messageQueue.take();
                
                // 发送消息
                notificationService.sendNotification(
                    task.getUserId(),
                    task.getTitle(),
                    task.getContent(),
                    task.getChannel()
                );
                
                // 控制发送频率（避免触发限流）
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.error("处理消息失败", e);
            }
        }
    }
    
    @Data
    @AllArgsConstructor
    private static class MessageTask {
        private String userId;
        private String title;
        private String content;
        private NotificationChannel channel;
    }
}
```

### 面试通知模板

```java
@Service
public class InterviewNotificationService {
    
    @Autowired
    private MessageQueueService messageQueueService;
    
    /**
     * 发送面试安排通知
     */
    public void sendInterviewArrangement(InterviewPlanDTO interview) {
        String title = "面试通知";
        String content = buildInterviewContent(interview);
        
        // 通知面试官
        interview.getInterviewers().forEach(interviewer -> {
            messageQueueService.enqueue(
                interviewer.getStaffId(),
                title,
                content,
                NotificationChannel.WEWORK
            );
        });
        
        // 通知候选人（发送到手机）
        if (interview.getCandidatePhone() != null) {
            messageQueueService.enqueue(
                null,
                title,
                content,
                NotificationChannel.PHONE
            );
        }
    }
    
    /**
     * 发送面试提醒（提前 1 小时）
     */
    @Scheduled(cron = "0 0 * * * ?") // 每小时执行
    public void sendInterviewReminders() {
        LocalDateTime oneHourLater = LocalDateTime.now().plusHours(1);
        
        // 查询 1 小时后的面试
        List<InterviewPlanDTO> interviews = getUpcomingInterviews(oneHourLater);
        
        interviews.forEach(interview -> {
            String title = "【提醒】面试即将开始";
            String content = String.format(
                "您在 %s 有一个面试安排，候选人：%s，地点：%s，请准时参加。",
                interview.getInterviewTime(),
                interview.getCandidateName(),
                interview.getInterviewAddress()
            );
            
            interview.getInterviewers().forEach(interviewer -> {
                messageQueueService.enqueue(
                    interviewer.getStaffId(),
                    title,
                    content,
                    NotificationChannel.WEWORK
                );
            });
        });
    }
    
    private String buildInterviewContent(InterviewPlanDTO interview) {
        return String.format(
            "您有一个新的面试安排：\n" +
            "候选人：%s\n" +
            "岗位：%s\n" +
            "时间：%s\n" +
            "地点：%s\n" +
            "请准时参加面试。",
            interview.getCandidateName(),
            interview.getPostName(),
            interview.getInterviewTime(),
            interview.getInterviewAddress()
        );
    }
    
    private List<InterviewPlanDTO> getUpcomingInterviews(LocalDateTime time) {
        // 查询即将开始的面试
        return Collections.emptyList();
    }
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [面试管理 API](./interview-api.md)

---

**最后更新**: 2025-11-12
