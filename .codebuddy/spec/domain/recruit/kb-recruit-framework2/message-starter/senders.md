# Sender发送器索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `sender` 包下所有Sender类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.sender`  
> **文件总数**: 19个 (6接口 + 13实现)

---

## 📊 Sender分类

| 分类 | 文件数量 | 说明 |
|------|---------|------|
| **接口层** | 6个 | Sender接口定义 |
| **异步实现** | 6个 | Async异步发送器 |
| **同步实现** | 7个 | Sync同步发送器 |
| **总计** | **19个** | **所有Sender文件** |

---

## 📝 Sender接口 (6个)

### 1. RecruitEmailSender
- **方法**: send(EmailBean), sendTemplate(TemplateEmailBean), sendSchedule(ScheduleEmailBean)

### 2. RecruitSmsSender
- **方法**: send(SmsBean), sendTemplate(TemplateSmsBean)

### 3. RecruitAppSender
- **方法**: sendWork(WorkBean), sendWorkCard(WorkCardBean), sendWorkRich(WorkRichBean)

### 4. RecruitMyoaSender
- **方法**: sendOaSms(OaSmsMsgBean), sendOaTemplate(OaSmsTemplateMsgBean)

### 5. RecruitGroupSender
- **方法**: send(WorkChatBean)

### 6. RecruitFunctionSender
- **方法**: send(FunctionViewBean)

---

## 📝 异步实现 (6个)

### 1. AsyncEmailSender
- **实现**: RecruitEmailSender
- **特点**: @Async异步执行

### 2. AsyncSmsSender
- **实现**: RecruitSmsSender
- **特点**: @Async异步执行

### 3. AsyncAppSender
- **实现**: RecruitAppSender
- **特点**: @Async异步执行

### 4. AsyncMyoaSender
- **实现**: RecruitMyoaSender
- **特点**: @Async异步执行

### 5. AsyncGroupSender
- **实现**: RecruitGroupSender
- **特点**: @Async异步执行

### 6. AsyncFunctionSender
- **实现**: RecruitFunctionSender
- **特点**: @Async异步执行

---

## 📝 同步实现 (7个)

### 1. SyncEmailSender
- **实现**: RecruitEmailSender
- **特点**: 同步发送，立即返回结果

### 2. SyncSmsSender
- **实现**: RecruitSmsSender
- **特点**: 同步发送

### 3. SyncAppSender
- **实现**: RecruitAppSender
- **特点**: 同步发送

### 4. SyncMyoaSender
- **实现**: RecruitMyoaSender
- **特点**: 同步发送

### 5. SyncGroupSender
- **实现**: RecruitGroupSender
- **特点**: 同步发送

### 6. SyncFunctionSender
- **实现**: RecruitFunctionSender
- **特点**: 同步发送

### 7. OldSyncEmailSender
- **实现**: RecruitEmailSender
- **特点**: 旧版同步邮件发送器

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
