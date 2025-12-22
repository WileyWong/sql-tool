# 消息中台接入指南

## 1. 基础信息层

### 1.1 组件/接口名称

- **消息中台服务**: Message Channel Service
- **HTTP 接口**: 基于 RESTful API 的消息发送服务
- **Java SDK**: message-channel-spring-boot-starter

### 1.2 所属模块

- **内网地址**:
  - ESB 调用: `http://ntsgw.woa.com/api/esb/message-channel-service`
  - PUB 调用: 无需鉴权测试环境
- **外网地址**:
  - ESB 调用: `http://gateway.prodihrtas.com/api/esb/message-channel-service`
- **公网地址**:
  - 鉴权调用: `https://newapi.ihr.tencent-cloud.com/open/mc`

### 1.3 版本信息

- **当前版本**: 3.2.7-SNAPSHOT
- **兼容性**: 支持 Java 8+，Java 17 推荐使用新版本文档

### 1.4 状态标识

- ✅ **稳定**: 生产环境可用
- ✅ **推荐使用**: 官方推荐的消息发送解决方案

## 2. 功能概述层

### 2.1 核心职责

统一的消息发送中台，支持邮件、短信、企业微信、MyOA 等多种消息渠道的统一发送和管理。

### 2.2 使用场景

- **业务通知**: 系统异常告警、业务流程通知
- **用户消息**: 邮件通知、短信验证码、企业微信消息
- **审批流程**: MyOA 单据创建、审批状态同步
- **会议管理**: 会议邮件、日程管理

### 2.3 设计目的

- 统一消息发送入口，避免各业务系统重复建设
- 提供多渠道消息发送能力
- 统一消息发送状态管理和追踪

### 2.4 业务价值

- 降低系统集成复杂度
- 提供统一的消息发送规范
- 支持消息发送状态追踪和问题排查

## 3. HTTP 接口详细说明

### 3.1 接口地址配置

#### 3.1.1 环境地址表

| 环境     | 网络类型 | 调用方式 | 接口地址                                                        |
| -------- | -------- | -------- | --------------------------------------------------------------- |
| 测试环境 | 内网     | ESB 调用 | `http://dev-ntsgw.woa.com/api/esb/message-channel-service`      |
| 测试环境 | 内网     | PUB 调用 | `http://dev-ntsgw.woa.com/api/pub/message-channel-service`      |
| UAT 环境 | 内网     | ESB 调用 | `http://uat-ntsgw.woa.com/api/esb/message-channel-service`      |
| UAT 环境 | 内网     | PUB 调用 | `http://uat-ntsgw.woa.com/api/pub/message-channel-service`      |
| 生产环境 | 内网     | ESB 调用 | `http://ntsgw.woa.com/api/esb/message-channel-service`          |
| 测试环境 | 外网     | ESB 调用 | `http://gateway.testihrtas.com/api/esb/message-channel-service` |
| 生产环境 | 外网     | ESB 调用 | `http://gateway.prodihrtas.com/api/esb/message-channel-service` |
| 测试环境 | 公网     | 鉴权调用 | `https://newapi.test-caagw.yunassess.com/open/mc`               |
| 生产环境 | 公网     | 鉴权调用 | `https://newapi.ihr.tencent-cloud.com/open/mc`                  |

### 3.2 鉴权方式详解

#### 3.2.1 ESB 鉴权方式

ESB 方式需要在 HTTP Header 中添加鉴权信息：

**鉴权算法**：

```java
String signature = DigestUtils.sha256Hex(appName + appToken + timestamp);
```

**请求头设置**：

```http
hrgw-timestamp: 1587025529
hrgw-appname: testapp
hrgw-signature: 292d4e82f4c379c4d8cf860748d094db04ffe9623cfc07530038d26fe1e72b72
```

**鉴权示例**：

```bash
# 假设 appName=testapp, appToken=testtoken, timestamp=1587025529
# 计算签名: sha256(testapp + testtoken + 1587025529)
# 结果: 292d4e82f4c379c4d8cf860748d094db04ffe9623cfc07530038d26fe1e72b72
```

#### 3.2.2 公网鉴权方式

公网调用需要同时满足：

1. 获取 accessToken 并在请求头添加`Authorization`字段
2. 按 ESB 鉴权规则添加签名信息

### 3.3 核心接口定义

#### 3.3.1 通用消息发送接口

```http
POST /sendV2
Content-Type: application/json
```

**接口说明**: 发送各种类型的消息，通过 messageType 参数区分消息类型

**基础请求格式**:

```json
{
	"app": "mc_test",
	"tenant": "tencent",
	"sync": false,
	"receivers": ["user@tencent.com"],
	"idType": "DIRECT",
	"messageType": "MAIL",
	"priority": "MIDDLE",
	"tags": ["业务标签"],
	"body": "{消息体JSON字符串}"
}
```

#### 3.3.2 模板消息发送接口

```http
POST /sendByTemplateV2
Content-Type: application/json
```

**接口说明**: 使用预配置的模板发送消息

**基础请求格式**:

```json
{
	"app": "mc_test",
	"tenant": "tencent",
	"templateId": "650681294602340352",
	"receivers": ["user@tencent.com"],
	"params": {
		"name": "张三",
		"content": "模板参数"
	},
	"messageType": "MAIL"
}
```

#### 3.3.3 短信模板发送接口

```http
POST /sendSmsTemplate
Content-Type: application/json
```

**接口说明**: 专门用于发送内网短信模板消息

#### 3.3.4 企业微信机器人接口

```http
POST /workchat/{appName}/{robotName}/send
Content-Type: application/json
```

**接口说明**: 通过企业微信机器人发送消息到群聊

### 3.4 详细消息类型示例

#### 3.4.1 邮件消息 (MAIL)

**发送普通文本邮件**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["user@tencent.com"],
    "idType": "DIRECT",
    "messageType": "MAIL",
    "priority": "MIDDLE",
    "tags": ["业务邮件"],
    "body": "{\"cc\": \"cc@tencent.com\",\"bcc\": \"bcc@tencent.com\",\"title\": \"测试邮件标题\", \"content\": \"邮件正文内容\", \"tofEmailType\": 1}"
  }'
```

**body 字段详解**:

```json
{
	"title": "邮件标题",
	"content": "邮件正文内容",
	"from": "sender@tencent.com",
	"cc": "cc1@tencent.com,cc2@tencent.com",
	"bcc": "bcc@tencent.com",
	"attachments": {
		"文件名.pdf": "base64编码的文件内容"
	},
	"tofEmailType": 1,
	"exceptionNotifyMail": false
}
```

**发送邮件模板消息**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendByTemplateV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "idType": "DIRECT",
    "receivers": ["user@tencent.com"],
    "priority": "MIDDLE",
    "templateId": "650681294602340352",
    "params": {
        "name": "张三",
        "Leader": "李四",
        "mentor": "王五",
        "HRBP": "赵六",
        "secretary": "钱七"
    },
    "attachments": {
        "附件.pdf": "base64文件内容"
    },
    "cc": ["cc@tencent.com"],
    "bcc": ["bcc@tencent.com"],
    "messageType": "MAIL",
    "tags": ["模板邮件"],
    "sender": "sender@tencent.com"
  }'
```

#### 3.4.2 会议邮件 (MAIL_MEETING)

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["attendee@tencent.com"],
    "idType": "DIRECT",
    "messageType": "MAIL_MEETING",
    "priority": "MIDDLE",
    "tags": ["会议邀请"],
    "body": "{\"from\":\"organizer@tencent.com\",\"to\":\"attendee@tencent.com\",\"cc\":\"\",\"bcc\":\"\",\"title\":\"项目评审会议\",\"content\":\"会议议程...\",\"location\":\"会议室1004\",\"organizer\":\"organizer\",\"startTime\":\"2021-10-12 14:00:00\",\"endTime\":\"2021-10-12 16:00:00\",\"emailType\":\"2\",\"bodyFormat\":\"1\",\"priority\":\"0\"}"
  }'
```

#### 3.4.3 腾讯云 SES 邮件 (MAIL_SES)

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["external@qq.com"],
    "idType": "DIRECT",
    "messageType": "MAIL_SES",
    "priority": "MIDDLE",
    "tags": ["外网邮件"],
    "body": "{\"from\": \"service@yunassess.com\",\"cc\": \"cc@tencent.com\",\"bcc\": \"bcc@tencent.com\",\"title\": \"外网通知邮件\", \"text\": \"纯文本内容\", \"html\": \"<html><div>HTML格式内容</div></html>\"}"
  }'
```

#### 3.4.4 短信消息 (SMS_TEXT)

**发送文本短信**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "idType": "DIRECT",
    "messageType": "SMS_TEXT",
    "priority": "MIDDLE",
    "receivers": ["13812345678", "+8613812345678"],
    "tags": ["验证码"],
    "body": "\"您的验证码是123456，5分钟内有效。\""
  }'
```

**发送模板短信(内网)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendSmsTemplate" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "idType": "DIRECT",
    "messageType": "SMS_TEXT",
    "priority": "MIDDLE",
    "receivers": ["13812345678"],
    "tags": ["模板短信"],
    "templateId": "6684f399894cdc000199db23",
    "params": {
        "line1": 1,
        "line2": 2
    }
  }'
```

**发送模板短信(外网)**:

```bash
curl -X POST "http://gateway.prodihrtas.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "customer_tenant",
    "sync": false,
    "idType": "DIRECT",
    "messageType": "SMS_TEMPLATE",
    "priority": "MIDDLE",
    "receivers": ["13812345678"],
    "tags": ["外网短信"],
    "body": "{\"tplId\": \"模板ID\",\"params\": [\"参数1\", \"参数2\"],\"sign\": \"腾讯HR助手\",\"nationCode\": \"86\"}"
  }'
```

#### 3.4.5 企业微信消息

**企微文本消息 (WORKCHAT_TEXT)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "DIRECT",
    "messageType": "WORKCHAT_TEXT",
    "priority": "MIDDLE",
    "tags": ["企微通知"],
    "body": "{\"category\":\"业务分类\",\"content\":\"这是一条企业微信文本消息\"}"
  }'
```

**企微 Tips 消息 (WORKCHAT_TIPS)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "DIRECT",
    "messageType": "WORKCHAT_TIPS",
    "priority": "MIDDLE",
    "tags": ["提醒消息"],
    "body": "{\"Title\":\"重要通知\",\"MsgInfo\":\"请及时处理待办事项\"}"
  }'
```

**企微 Markdown 消息 (WORKCHAT_MARKDOWN)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "DIRECT",
    "messageType": "WORKCHAT_MARKDOWN",
    "priority": "MIDDLE",
    "tags": ["富文本消息"],
    "body": "您的会议室已经预定，稍后会同步到`邮箱`\\n>**事项详情**\\n>事　项：<font color=\"info\">开会</font>\\n>组织者：@zhangsan\\n>时　间：<font color=\"warning\">2018年5月18日</font>\\n>请准时参加会议。"
  }'
```

**企微模板卡片消息 (WORKCHAT_TEMPLATE_CARD_MESSAGE)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "DIRECT",
    "messageType": "WORKCHAT_TEMPLATE_CARD_MESSAGE",
    "priority": "MIDDLE",
    "tags": ["卡片消息"],
    "body": "{\"category\":\"审批通知\",\"templateCard\":{\"card_type\":\"text_notice\",\"source\":{\"icon_url\":\"图片URL\",\"desc\":\"企业微信\",\"desc_color\":1},\"main_title\":{\"title\":\"审批通知\",\"desc\":\"您有新的审批待办\"},\"sub_title_text\":\"请及时处理\",\"horizontal_content_list\":[{\"keyname\":\"申请人\",\"value\":\"张三\"},{\"keyname\":\"申请时间\",\"value\":\"2023-11-13\"}]}}"
  }'
```

**企微图文消息 (WORKCHAT_RICH_TEXT)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "DIRECT",
    "messageType": "WORKCHAT_RICH_TEXT",
    "priority": "MIDDLE",
    "tags": ["图文消息"],
    "body": "{\"category\":\"新闻资讯\",\"items\":[{\"description\":\"图文消息描述内容\",\"title\":\"图文消息标题\",\"url\":\"http://example.com\",\"picurl\":\"http://example.com/pic.jpg\"}]}"
  }'
```

#### 3.4.6 微信模板消息 (WECHAT_TPL)

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["57094"],
    "idType": "ID",
    "messageType": "WECHAT_TPL",
    "priority": "MIDDLE",
    "tags": ["微信通知"],
    "body": "{\"corpkey\":\"tencent\",\"userName\":\"zhangsan\",\"userId\":\"57094\",\"templateId\":\"55gLS1OrrANw39gzJjuKfuxuIX92z_6QVeipH5M--OU\",\"url\":\"http://www.example.com\",\"params\":[{\"name\":\"first\",\"value\":\"您的申请已通过\",\"color\":\"#173177\"}],\"category\":\"审批通知\"}"
  }'
```

#### 3.4.7 MyOA 消息

**创建 MyOA 单据 (MYOA_CREATE)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["myoa_handler"],
    "idType": "DIRECT",
    "messageType": "MYOA_CREATE",
    "priority": "MIDDLE",
    "tags": ["审批单据"],
    "body": "{\"work_items\":[{\"category\":\"4EA94BBA64024F2BA647177007A321A5\",\"process_name\":\"业务系统/审批流程\",\"process_inst_id\":\"业务系统/审批流程/单号123\",\"activity\":\"申请人提交\",\"title\":\"费用报销申请\",\"form_url\":\"http://example.com/form?id=123\",\"handler\":\"zhangsan\",\"applicant\":\"lisi\"}]}"
  }'
```

**关闭 MyOA 单据 (MYOA_CLOSE)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["myoa_handler"],
    "idType": "DIRECT",
    "messageType": "MYOA_CLOSE",
    "priority": "MIDDLE",
    "tags": ["关闭单据"],
    "body": "{\"category\":\"4EA94BBA64024F2BA647177007A321A5\",\"process_name\":\"业务系统/审批流程\",\"process_inst_id\":\"业务系统/审批流程/单号123\",\"activity\":\"流程结束\",\"handler\":\"zhangsan\"}"
  }'
```

#### 3.4.8 语音轮询消息 (CTI_POLL)

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan,lisi|wangwu,zhaoliu"],
    "idType": "DIRECT",
    "messageType": "CTI_POLL",
    "priority": "MIDDLE",
    "tags": ["语音通知"],
    "body": "{\"TaskName\":\"紧急事件处理\",\"Content\":\"系统出现异常，请立即处理\",\"TransferReceiver\":\"zhangsan\",\"Interval\":0,\"RecallTimes\":2,\"PollMaxInterval\":120,\"TextNotify\":{\"EnableWorkwxNotify\":true,\"NotifyTitle\":\"紧急通知\",\"NotifyContent\":\"请查看语音通知\"}}"
  }'
```

#### 3.4.9 日程消息

**创建日程 (CALENDAR_CREATE)**:

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "app": "mc_test",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["zhangsan"],
    "idType": "ID",
    "messageType": "CALENDAR_CREATE",
    "priority": "MIDDLE",
    "tags": ["日程安排"],
    "body": "{\"From\": \"organizer@tencent.com\",\"CC\": \"\",\"Bcc\": \"\",\"BodyFormat\":1,\"Title\": \"项目评审会议\",\"CalendarLocation\": \"会议室1101\",\"CalendarOrganizer\": \"organizer@tencent.com\",\"CalendarStartTime\": \"2023-12-01 14:00:00\",\"CalendarEndTime\": \"2023-12-01 16:00:00\",\"CalendarDescription\": \"项目评审会议\",\"Content\": \"会议议程...\",\"Attachments\": [{\"FileName\":\"议程.pdf\", \"Data\":\"base64内容\"}]}"
  }'
```

#### 3.4.10 企业微信机器人消息

```bash
curl -X POST "http://ntsgw.woa.com/api/esb/message-channel-service/workchat/mc_test/robot_name/send" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: 1587025529" \
  -H "hrgw-appname: mc_test" \
  -H "hrgw-signature: 签名值" \
  -d '{
    "chatid": "群聊ID",
    "msgtype": "text",
    "text": {
        "content": "这是机器人发送的消息"
    }
  }'
```

### 3.5 接口响应详解

#### 3.5.1 成功响应格式

```json
{
	"code": 200,
	"success": true,
	"data": {
		"id": null,
		"batch": "964597937462196224",
		"msgId": "964597937462196224",
		"app": null,
		"robot": null,
		"tenant": null,
		"idType": null,
		"type": null,
		"priority": null,
		"finished": false,
		"allSuccess": false,
		"retryTime": 0,
		"result": []
	},
	"message": null
}
```

#### 3.5.2 响应字段详解

| 字段名          | 类型    | 说明                                      |
| --------------- | ------- | ----------------------------------------- |
| code            | Integer | HTTP 状态码，200 表示成功                 |
| success         | Boolean | 业务处理是否成功                          |
| message         | String  | 错误信息，成功时为 null                   |
| data.msgId      | String  | **消息 ID，用于追踪和问题排查，务必保存** |
| data.batch      | String  | 批次 ID，批量发送时的批次标识             |
| data.finished   | Boolean | 消息是否处理完成                          |
| data.allSuccess | Boolean | 批量发送时是否全部成功                    |
| data.retryTime  | Integer | 重试次数                                  |
| data.result     | Array   | 详细结果信息                              |

#### 3.5.3 错误响应格式

```json
{
	"code": 400,
	"success": false,
	"data": null,
	"message": "参数校验失败：receivers不能为空"
}
```

#### 3.5.4 常见错误码

| 错误码 | 说明           | 解决方案                      |
| ------ | -------------- | ----------------------------- |
| 400    | 参数校验失败   | 检查必填参数和参数格式        |
| 401    | 鉴权失败       | 检查 appName、appToken 和签名 |
| 403    | 权限不足       | 确认应用权限和白名单配置      |
| 404    | 接口不存在     | 检查接口路径和 HTTP 方法      |
| 429    | 请求频率限制   | 降低请求频率，实现重试机制    |
| 500    | 服务器内部错误 | 联系技术支持，提供 msgId      |

### 3.6 HTTP 接口通用参数详解

#### 3.6.1 请求头参数

| 参数名         | 类型   | 必填     | 说明                     |
| -------------- | ------ | -------- | ------------------------ |
| Content-Type   | String | 是       | 固定为"application/json" |
| hrgw-timestamp | String | ESB 必填 | Unix 时间戳              |
| hrgw-appname   | String | ESB 必填 | 应用名称                 |
| hrgw-signature | String | ESB 必填 | 签名字符串               |
| Authorization  | String | 公网必填 | Bearer token 格式        |

#### 3.6.2 请求体通用参数

| 参数名      | 类型         | 必填     | 默认值   | 说明                        |
| ----------- | ------------ | -------- | -------- | --------------------------- |
| app         | String       | 是       | -        | 服务市场注册的应用名称      |
| tenant      | String       | 是       | -        | 租户标识，内网固定"tencent" |
| sync        | Boolean      | 否       | false    | 是否同步调用                |
| receivers   | List<String> | 是       | -        | 接收人列表                  |
| idType      | String       | 否       | "DIRECT" | 接收人 ID 类型              |
| messageType | String       | 是       | -        | 消息类型                    |
| priority    | String       | 否       | "MIDDLE" | 消息优先级                  |
| tags        | List<String> | 否       | []       | 消息标签数组                |
| body        | String       | 部分必填 | -        | 消息体 JSON 字符串          |

#### 3.6.3 idType 参数详解

| 值     | 说明     | 内网含义        | 外网含义        |
| ------ | -------- | --------------- | --------------- |
| DIRECT | 直接传递 | 邮箱地址/用户名 | 邮箱地址/用户名 |
| ID     | 用户 ID  | engname/staffId | globalId        |

#### 3.6.4 messageType 支持的消息类型

| 消息类型                       | 说明               | 支持环境       |
| ------------------------------ | ------------------ | -------------- |
| MAIL                           | 普通邮件           | 内网/外网/公网 |
| MAIL_MEETING                   | 会议邮件           | 仅内网         |
| MAIL_SES                       | 腾讯云 SES 邮件    | 仅内网         |
| SMS_TEXT                       | 文本短信           | 仅内网         |
| SMS_TEMPLATE                   | 模板短信           | 外网           |
| WECHAT_TPL                     | 微信模板消息       | 内网/外网      |
| WORKCHAT_TEXT                  | 企微文本消息       | 内网/外网      |
| WORKCHAT_TIPS                  | 企微 Tips 消息     | 仅内网         |
| WORKCHAT_MARKDOWN              | 企微 Markdown 消息 | 仅外网         |
| WORKCHAT_TEMPLATE_CARD_MESSAGE | 企微模板卡片消息   | 仅内网         |
| WORKCHAT_RICH_TEXT             | 企微图文消息       | 仅内网         |
| WORKCHAT_HR_ASSISTANT          | HR 助手企微消息    | 仅内网         |
| WORK_CHAT                      | 内部应用企微消息   | 仅外网         |
| MYOA_CREATE                    | 创建 MyOA 单据     | 仅内网         |
| MYOA_CLOSE                     | 关闭 MyOA 单据     | 仅内网         |
| MYOA_APPROVAL                  | 同步 MyOA 审批状态 | 仅内网         |
| MYOA_DISCARD                   | 撤销 MyOA 单据     | 仅内网         |
| MYOA_RESET                     | 重置 MyOA 表单     | 仅内网         |
| CTI_POLL                       | 语音轮询消息       | 仅内网         |
| CALENDAR_CREATE                | 创建日程           | 仅内网         |
| CALENDAR_UPDATE                | 更新日程           | 仅内网         |
| CALENDAR_CANCEL                | 取消日程           | 仅内网         |

### 3.7 Java SDK 接口说明

#### 3.7.1 邮件消息发送接口

```java
// 发送普通文本邮件
MessageSendResultDTO sendTextMailMessage(MailMessageParam mailMessageParam)

// 发送邮件模板消息
MessageSendResultDTO sendMailTemplateMessage(MailTemplateMessageParam mailTemplateMessageParam)

// 发送会议邮件
MessageSendResultDTO sendMeetingMailMessage(MailMeetingParam mailMeetingParam)

// 发送腾讯云SES邮件
MessageSendResultDTO sendMailSESMessage(MailSESParam mailSESParam)

// 发送腾讯云SES邮件模板消息
MessageSendResultDTO sendMailSESTemplateMessage(MailSESTemplateMessageParam mailSESTemplateMessageParam)
```

#### 3.7.2 短信消息发送接口

```java
// 发送文本短信
MessageSendResultDTO sendSmsMessage(SmsMessageParam smsMessageParam)

// 发送内网短信模板消息
MessageSendResultDTO sendInternalSmsTemplateMessage(InternalSmsTemplateMessageParam param)

// 发送外网短信模板消息
MessageSendResultDTO sendSmsTemplateMessage(SmsTemplateMessageParam smsTemplateMessageParam)
```

#### 3.7.3 企业微信消息发送接口

```java
// 发送企微文本消息
MessageSendResultDTO sendWorkChatTextMessage(WorkChatTextMessageParam workChatTextMessageParam)

// 发送企微Tips消息
MessageSendResultDTO sendWorkChatTipsMessage(WorkChatTipsMessageParam workChatTipsMessageParam)

// 发送企微Markdown消息
MessageSendResultDTO sendWorkChatMarkdownMessage(WorkChatMarkdownMessageParam workChatMarkdownMessageParam)

// 发送企微模板卡片消息
MessageSendResultDTO sendWorkChatTemplateCardMessage(WorkChatTemplateCardMessageParam workChatTemplateCardMessageParam)

// 发送企微图文消息
MessageSendResultDTO sendWorkChatRichMessage(WorkChatRichTextMessageParam workChatRichTextMessageParam)

// 通过HR助手发送企微消息
MessageSendResultDTO sendInternalWorkChatMessage(InternalHrAssiatantWorkChatMessageParam param)

// 通过内部应用发送企微消息
MessageSendResultDTO sendTasWorkChatMessage(TasWorkChatMessageParam param)
```

#### 3.7.4 其他消息发送接口

```java
// 发送微信模板消息
MessageSendResultDTO sendWeChatTemplateMessage(WeChatTemplateMessageParam weChatTemplateMessageParam)

// 发送MyOA创建单据消息
MessageSendResultDTO sendMyOACreateMessage(MyOACreateMessageParam myOACreateMessageParam)

// 发送MyOA关闭单据消息
MessageSendResultDTO sendMyOACloseMessage(MyoaCloseMessageParam myoaCloseMessageParam)

// 发送MyOA审批状态消息
MessageSendResultDTO sendMyOAApprovalMessage(MyoaApprovalMessageParam myoaApprovalMessageParam)

// 发送MyOA撤销单据消息
MessageSendResultDTO sendMyOADiscardMessage(MyoaDiscardParam myoaDiscardParam)

// 发送MyOA重置表单消息
MessageSendResultDTO sendMyOAResetMessage(MyoaResetMessageParam myoaResetMessageParam)

// 发送语音轮询消息
MessageSendResultDTO sendCtiPollMessage(CtiPollMessageParam ctiPollMessageParam)

// 发送创建日程消息
MessageSendResultDTO sendCalendarCreateMessage(CalendarCreateMessageParam param)

// 发送更新日程消息
MessageSendResultDTO sendCalendarUpdateMessage(CalendarUpdateMessageParam param)

// 发送取消日程消息
MessageSendResultDTO sendCalendarCancelMessage(String calendarUID)

// 发送企业微信机器人消息
String sendWorkChatBotMessage(WorkChatBotParam workChatBotParam)
```

### 3.8 HTTP 接口调用最佳实践

#### 3.8.1 请求构建规范

1. **Content-Type**: 必须设置为`application/json`
2. **字符编码**: 使用 UTF-8 编码
3. **JSON 格式**: body 字段需要转义为 JSON 字符串
4. **时间戳**: 使用当前 Unix 时间戳，注意时区
5. **签名计算**: 严格按照算法计算，避免编码问题

#### 3.8.2 错误处理建议

1. **HTTP 状态码检查**: 先检查 HTTP 状态码
2. **业务状态检查**: 再检查响应中的 success 字段
3. **错误信息记录**: 记录完整的错误响应用于排查
4. **重试机制**: 对网络错误和 5xx 错误实现重试
5. **msgId 保存**: 成功响应必须保存 msgId 到日志

#### 3.8.3 性能优化建议

1. **连接复用**: 使用 HTTP 连接池
2. **异步调用**: 优先使用 sync=false 异步模式
3. **批量发送**: 在 receivers 中传入多个接收人
4. **请求压缩**: 对大请求体启用 gzip 压缩
5. **超时设置**: 设置合理的连接和读取超时时间

## 4. 依赖关系层

### 4.1 上游依赖

#### 4.1.1 Java SDK 依赖

```xml
<repositories>
    <repository>
        <id>hrsdc-snapshot</id>
        <url>https://mirrors.tencent.com/repository/maven/hrsdc-snapshot/</url>
    </repository>
    <repository>
        <id>hrsdc</id>
        <url>https://mirrors.tencent.com/repository/maven/hrsdc/</url>
    </repository>
</repositories>

<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>message-channel-spring-boot-starter</artifactId>
    <version>3.2.7-SNAPSHOT</version>
</dependency>
```

#### 4.1.2 配置依赖

```yaml
hr:
  security:
    app-name: ${appName}
    app-token: ${appToken}
```

### 4.2 环境依赖

- **服务市场**: 需要先到服务市场注册获取 appName 和 appToken
- **网络环境**: 内网/外网/公网需要使用不同的接入地址
- **鉴权服务**: ESB 方式需要网关鉴权，公网需要 accessToken

## 5. 使用指南层

### 5.1 HTTP 接口快速开始

#### 5.1.1 环境准备

1. **获取应用凭证**: 到[服务市场](https://servicemarket.woa.com/appMarket)注册获取 appName 和 appToken
2. **选择接入地址**: 根据网络环境选择对应的接口地址
3. **实现签名算法**: 按照 ESB 鉴权规则实现签名计算

#### 5.1.2 签名计算示例

**Java 实现**:

```java
import org.apache.commons.codec.digest.DigestUtils;

public class MessageChannelAuth {
    public static String calculateSignature(String appName, String appToken, long timestamp) {
        return DigestUtils.sha256Hex(appName + appToken + timestamp);
    }

    public static void main(String[] args) {
        String appName = "testapp";
        String appToken = "testtoken";
        long timestamp = System.currentTimeMillis() / 1000;
        String signature = calculateSignature(appName, appToken, timestamp);

        System.out.println("timestamp: " + timestamp);
        System.out.println("signature: " + signature);
    }
}
```

**Python 实现**:

```python
import hashlib
import time

def calculate_signature(app_name, app_token, timestamp):
    content = app_name + app_token + str(timestamp)
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

app_name = "testapp"
app_token = "testtoken"
timestamp = int(time.time())
signature = calculate_signature(app_name, app_token, timestamp)

print(f"timestamp: {timestamp}")
print(f"signature: {signature}")
```

**Node.js 实现**:

```javascript
const crypto = require("crypto");

function calculateSignature(appName, appToken, timestamp) {
	const content = appName + appToken + timestamp;
	return crypto.createHash("sha256").update(content).digest("hex");
}

const appName = "testapp";
const appToken = "testtoken";
const timestamp = Math.floor(Date.now() / 1000);
const signature = calculateSignature(appName, appToken, timestamp);

console.log(`timestamp: ${timestamp}`);
console.log(`signature: ${signature}`);
```

#### 5.1.3 HTTP 客户端封装示例

**Java HttpClient 封装**:

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MessageChannelClient {
    private static final String BASE_URL = "http://ntsgw.woa.com/api/esb/message-channel-service";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String appName;
    private final String appToken;

    public MessageChannelClient(String appName, String appToken) {
        this.appName = appName;
        this.appToken = appToken;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    public String sendMessage(Object requestBody) throws Exception {
        long timestamp = System.currentTimeMillis() / 1000;
        String signature = DigestUtils.sha256Hex(appName + appToken + timestamp);

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/sendV2"))
            .header("Content-Type", "application/json")
            .header("hrgw-timestamp", String.valueOf(timestamp))
            .header("hrgw-appname", appName)
            .header("hrgw-signature", signature)
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .timeout(Duration.ofSeconds(30))
            .build();

        HttpResponse<String> response = httpClient.send(request,
            HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP Error: " + response.statusCode() +
                ", Body: " + response.body());
        }

        return response.body();
    }
}
```

**Python requests 封装**:

```python
import requests
import json
import time
import hashlib
from typing import Dict, Any

class MessageChannelClient:
    def __init__(self, app_name: str, app_token: str, base_url: str = None):
        self.app_name = app_name
        self.app_token = app_token
        self.base_url = base_url or "http://ntsgw.woa.com/api/esb/message-channel-service"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def _calculate_signature(self, timestamp: int) -> str:
        content = self.app_name + self.app_token + str(timestamp)
        return hashlib.sha256(content.encode('utf-8')).hexdigest()

    def send_message(self, request_body: Dict[str, Any]) -> Dict[str, Any]:
        timestamp = int(time.time())
        signature = self._calculate_signature(timestamp)

        headers = {
            'hrgw-timestamp': str(timestamp),
            'hrgw-appname': self.app_name,
            'hrgw-signature': signature
        }

        response = self.session.post(
            f"{self.base_url}/sendV2",
            headers=headers,
            json=request_body,
            timeout=30
        )

        response.raise_for_status()
        return response.json()

# 使用示例
client = MessageChannelClient("your_app_name", "your_app_token")

mail_request = {
    "app": "your_app_name",
    "tenant": "tencent",
    "receivers": ["user@tencent.com"],
    "messageType": "MAIL",
    "body": json.dumps({
        "title": "测试邮件",
        "content": "邮件内容"
    })
}

result = client.send_message(mail_request)
print(f"发送结果: {result}")
```

#### 5.1.4 基础邮件发送示例

**发送简单文本邮件**:

```bash
#!/bin/bash

# 配置信息
APP_NAME="your_app_name"
APP_TOKEN="your_app_token"
BASE_URL="http://ntsgw.woa.com/api/esb/message-channel-service"

# 计算签名
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "${APP_NAME}${APP_TOKEN}${TIMESTAMP}" | sha256sum | cut -d' ' -f1)

# 发送邮件
curl -X POST "${BASE_URL}/sendV2" \
  -H "Content-Type: application/json" \
  -H "hrgw-timestamp: ${TIMESTAMP}" \
  -H "hrgw-appname: ${APP_NAME}" \
  -H "hrgw-signature: ${SIGNATURE}" \
  -d '{
    "app": "'${APP_NAME}'",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["recipient@tencent.com"],
    "idType": "DIRECT",
    "messageType": "MAIL",
    "priority": "MIDDLE",
    "tags": ["测试邮件"],
    "body": "{\"title\":\"Hello World\",\"content\":\"这是一封测试邮件\"}"
  }'
```

#### 5.1.5 Java SDK 快速开始

**Maven 依赖配置**:

```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>message-channel-spring-boot-starter</artifactId>
    <version>3.2.7-SNAPSHOT</version>
</dependency>
```

**配置文件**:

```yaml
hr:
  security:
    app-name: ${APP_NAME}
    app-token: ${APP_TOKEN}
```

**Java 代码示例**:

````java
@Autowired
private MessageChannelService messageChannelService;

@Test
public void testSendTextMailMessage() {
    MailMessageParam mailMessageParam = new MailMessageParam();
    mailMessageParam.setTitle("测试邮件标题");
    mailMessageParam.setContent("邮件正文内容");
    mailMessageParam.setReceivers(Arrays.asList("user@tencent.com"));
    mailMessageParam.addTags("测试邮件");

    MessageSendResultDTO result = messageChannelService.sendTextMailMessage(mailMessageParam);
    log.info("发送结果：{}", result);

    // 重要：保存msgId用于问题排查
    if (result.isSuccess()) {
        String msgId = result.getData().getMsgId();
        log.info("消息ID：{}", msgId);
        // 保存msgId到业务日志或数据库
    }
}

### 5.2 HTTP接口完整示例

#### 5.2.1 邮件发送完整流程

**场景**: 系统异常告警邮件发送

```python
import json
import requests
import hashlib
import time
from datetime import datetime

class AlertEmailSender:
    def __init__(self, app_name, app_token):
        self.app_name = app_name
        self.app_token = app_token
        self.base_url = "http://ntsgw.woa.com/api/esb/message-channel-service"

    def send_alert_email(self, recipients, alert_info):
        # 构建邮件内容
        email_body = {
            "title": f"[紧急告警] {alert_info['system']} 系统异常",
            "content": f"""
系统异常详情：
- 告警时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- 异常系统: {alert_info['system']}
- 异常类型: {alert_info['error_type']}
- 异常描述: {alert_info['description']}
- 影响范围: {alert_info['impact']}

请立即处理！
            """,
            "from": "alert@tencent.com",
            "cc": "manager@tencent.com",
            "tofEmailType": 1,
            "exceptionNotifyMail": True
        }

        # 构建请求体
        request_body = {
            "app": self.app_name,
            "tenant": "tencent",
            "sync": False,
            "receivers": recipients,
            "idType": "DIRECT",
            "messageType": "MAIL",
            "priority": "HIGH",
            "tags": ["系统告警", alert_info['system']],
            "body": json.dumps(email_body)
        }

        # 发送请求
        response_data = self._send_request("/sendV2", request_body)

        # 处理响应
        if response_data.get('success'):
            msg_id = response_data['data']['msgId']
            print(f"告警邮件发送成功，消息ID: {msg_id}")
            # 记录到告警日志
            self._log_alert(alert_info['system'], msg_id, "EMAIL_SENT")
            return msg_id
        else:
            error_msg = response_data.get('message', '未知错误')
            print(f"告警邮件发送失败: {error_msg}")
            self._log_alert(alert_info['system'], None, f"EMAIL_FAILED: {error_msg}")
            return None

    def _send_request(self, endpoint, request_body):
        timestamp = int(time.time())
        signature = self._calculate_signature(timestamp)

        headers = {
            'Content-Type': 'application/json',
            'hrgw-timestamp': str(timestamp),
            'hrgw-appname': self.app_name,
            'hrgw-signature': signature
        }

        response = requests.post(
            f"{self.base_url}{endpoint}",
            headers=headers,
            json=request_body,
            timeout=30
        )

        response.raise_for_status()
        return response.json()

    def _calculate_signature(self, timestamp):
        content = self.app_name + self.app_token + str(timestamp)
        return hashlib.sha256(content.encode('utf-8')).hexdigest()

    def _log_alert(self, system, msg_id, status):
        # 记录告警处理日志
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "system": system,
            "msg_id": msg_id,
            "status": status
        }
        print(f"Alert Log: {json.dumps(log_entry)}")

# 使用示例
sender = AlertEmailSender("your_app_name", "your_app_token")

alert_info = {
    "system": "订单系统",
    "error_type": "数据库连接超时",
    "description": "数据库连接池耗尽，无法处理新请求",
    "impact": "影响用户下单功能"
}

recipients = ["dba@tencent.com", "dev-team@tencent.com"]
msg_id = sender.send_alert_email(recipients, alert_info)
````

#### 5.2.2 模板邮件发送示例

**场景**: 审批通知邮件

```bash
#!/bin/bash

# 发送审批通知模板邮件
send_approval_notification() {
    local app_name="$1"
    local app_token="$2"
    local template_id="$3"
    local recipient="$4"
    local applicant_name="$5"
    local approval_type="$6"

    local timestamp=$(date +%s)
    local signature=$(echo -n "${app_name}${app_token}${timestamp}" | sha256sum | cut -d' ' -f1)
    local base_url="http://ntsgw.woa.com/api/esb/message-channel-service"

    # 构建模板参数
    local template_params=$(cat <<EOF
{
    "applicant": "${applicant_name}",
    "approval_type": "${approval_type}",
    "submit_time": "$(date '+%Y-%m-%d %H:%M:%S')",
    "approval_url": "http://approval.example.com/task/123"
}
EOF
)

    # 构建请求体
    local request_body=$(cat <<EOF
{
    "app": "${app_name}",
    "tenant": "tencent",
    "sync": false,
    "receivers": ["${recipient}"],
    "idType": "DIRECT",
    "messageType": "MAIL",
    "priority": "MIDDLE",
    "templateId": "${template_id}",
    "params": ${template_params},
    "tags": ["审批通知", "${approval_type}"],
    "cc": ["hr@tencent.com"],
    "sender": "approval-system@tencent.com"
}
EOF
)

    # 发送请求
    local response=$(curl -s -X POST "${base_url}/sendByTemplateV2" \
        -H "Content-Type: application/json" \
        -H "hrgw-timestamp: ${timestamp}" \
        -H "hrgw-appname: ${app_name}" \
        -H "hrgw-signature: ${signature}" \
        -d "${request_body}")

    # 解析响应
    local success=$(echo "$response" | jq -r '.success')
    if [ "$success" = "true" ]; then
        local msg_id=$(echo "$response" | jq -r '.data.msgId')
        echo "审批通知发送成功，消息ID: ${msg_id}"
        # 记录到审批日志
        echo "$(date '+%Y-%m-%d %H:%M:%S') - 审批通知已发送给 ${recipient}，消息ID: ${msg_id}" >> approval.log
        return 0
    else
        local error_msg=$(echo "$response" | jq -r '.message')
        echo "审批通知发送失败: ${error_msg}"
        return 1
    fi
}

# 使用示例
send_approval_notification \
    "your_app_name" \
    "your_app_token" \
    "650681294602340352" \
    "approver@tencent.com" \
    "张三" \
    "费用报销"
```

#### 5.2.3 企业微信消息批量发送

**场景**: 系统维护通知

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

public class SystemMaintenanceNotifier {
    private final MessageChannelHttpClient httpClient;
    private final ExecutorService executorService;

    public SystemMaintenanceNotifier(String appName, String appToken) {
        this.httpClient = new MessageChannelHttpClient(appName, appToken);
        this.executorService = Executors.newFixedThreadPool(10);
    }

    /**
     * 批量发送系统维护通知
     */
    public void sendMaintenanceNotification(List<String> userList, MaintenanceInfo maintenanceInfo) {
        // 按部门分组发送
        Map<String, List<String>> departmentGroups = groupUsersByDepartment(userList);

        List<CompletableFuture<SendResult>> futures = departmentGroups.entrySet().stream()
            .map(entry -> sendToDepartment(entry.getKey(), entry.getValue(), maintenanceInfo))
            .collect(Collectors.toList());

        // 等待所有发送完成
        CompletableFuture<Void> allFutures = CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0])
        );

        try {
            allFutures.get(60, TimeUnit.SECONDS);

            // 统计发送结果
            List<SendResult> results = futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());

            logSendResults(results);

        } catch (Exception e) {
            log.error("批量发送维护通知异常", e);
        }
    }

    private CompletableFuture<SendResult> sendToDepartment(String department,
                                                          List<String> users,
                                                          MaintenanceInfo maintenanceInfo) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 构建企微模板卡片消息
                String templateCard = buildMaintenanceCard(department, maintenanceInfo);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("app", httpClient.getAppName());
                requestBody.put("tenant", "tencent");
                requestBody.put("sync", false);
                requestBody.put("receivers", users);
                requestBody.put("idType", "DIRECT");
                requestBody.put("messageType", "WORKCHAT_TEMPLATE_CARD_MESSAGE");
                requestBody.put("priority", "HIGH");
                requestBody.put("tags", Arrays.asList("系统维护", department));

                Map<String, Object> body = new HashMap<>();
                body.put("category", "系统维护");
                body.put("templateCard", templateCard);
                requestBody.put("body", objectMapper.writeValueAsString(body));

                String response = httpClient.sendMessage(requestBody);
                Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

                boolean success = (Boolean) responseMap.get("success");
                String msgId = success ?
                    (String) ((Map<String, Object>) responseMap.get("data")).get("msgId") : null;

                return new SendResult(department, users.size(), success, msgId, null);

            } catch (Exception e) {
                log.error("发送维护通知到部门 {} 失败", department, e);
                return new SendResult(department, users.size(), false, null, e.getMessage());
            }
        }, executorService);
    }

    private String buildMaintenanceCard(String department, MaintenanceInfo maintenanceInfo) {
        // 构建企微模板卡片JSON
        Map<String, Object> card = new HashMap<>();
        card.put("card_type", "text_notice");

        // 卡片来源
        Map<String, Object> source = new HashMap<>();
        source.put("desc", "系统维护通知");
        source.put("desc_color", 1);
        card.put("source", source);

        // 主标题
        Map<String, Object> mainTitle = new HashMap<>();
        mainTitle.put("title", "系统维护通知");
        mainTitle.put("desc", String.format("【%s】系统将进行维护", maintenanceInfo.getSystemName()));
        card.put("main_title", mainTitle);

        // 详细信息
        List<Map<String, Object>> horizontalContent = new ArrayList<>();
        addContentItem(horizontalContent, "维护时间", maintenanceInfo.getMaintenanceTime());
        addContentItem(horizontalContent, "预计时长", maintenanceInfo.getDuration());
        addContentItem(horizontalContent, "影响范围", maintenanceInfo.getImpactScope());
        addContentItem(horizontalContent, "负责人", maintenanceInfo.getOwner());
        card.put("horizontal_content_list", horizontalContent);

        // 副标题
        card.put("sub_title_text", "维护期间系统将暂停服务，请提前做好准备");

        try {
            return objectMapper.writeValueAsString(card);
        } catch (Exception e) {
            throw new RuntimeException("构建维护通知卡片失败", e);
        }
    }

    private void addContentItem(List<Map<String, Object>> list, String key, String value) {
        Map<String, Object> item = new HashMap<>();
        item.put("keyname", key);
        item.put("value", value);
        list.add(item);
    }

    private Map<String, List<String>> groupUsersByDepartment(List<String> userList) {
        // 模拟按部门分组逻辑
        return userList.stream()
            .collect(Collectors.groupingBy(user -> getDepartment(user)));
    }

    private String getDepartment(String user) {
        // 模拟获取用户部门逻辑
        return "技术部";
    }

    private void logSendResults(List<SendResult> results) {
        int totalUsers = results.stream().mapToInt(SendResult::getUserCount).sum();
        long successDepartments = results.stream().filter(SendResult::isSuccess).count();

        log.info("系统维护通知发送完成:");
        log.info("- 总用户数: {}", totalUsers);
        log.info("- 成功部门数: {}/{}", successDepartments, results.size());

        // 记录失败的部门
        results.stream()
            .filter(result -> !result.isSuccess())
            .forEach(result -> log.error("部门 {} 发送失败: {}",
                result.getDepartment(), result.getErrorMessage()));

        // 记录成功的消息ID
        results.stream()
            .filter(SendResult::isSuccess)
            .forEach(result -> log.info("部门 {} 发送成功，消息ID: {}",
                result.getDepartment(), result.getMsgId()));
    }

    // 内部类
    public static class MaintenanceInfo {
        private String systemName;
        private String maintenanceTime;
        private String duration;
        private String impactScope;
        private String owner;

        // getters and setters...
    }

    public static class SendResult {
        private String department;
        private int userCount;
        private boolean success;
        private String msgId;
        private String errorMessage;

        // constructor, getters and setters...
    }
}
```

#### 5.2.4 多渠道消息发送示例

**场景**: 重要通知多渠道推送

```python
import asyncio
import aiohttp
import json
from typing import List, Dict, Any
from dataclasses import dataclass
from enum import Enum

class MessageChannel(Enum):
    EMAIL = "email"
    WECHAT_WORK = "wechat_work"
    SMS = "sms"

@dataclass
class NotificationConfig:
    title: str
    content: str
    recipients: List[str]
    channels: List[MessageChannel]
    priority: str = "MIDDLE"
    tags: List[str] = None

class MultiChannelNotifier:
    def __init__(self, app_name: str, app_token: str):
        self.app_name = app_name
        self.app_token = app_token
        self.base_url = "http://ntsgw.woa.com/api/esb/message-channel-service"

    async def send_notification(self, config: NotificationConfig) -> Dict[str, Any]:
        """发送多渠道通知"""
        tasks = []

        if MessageChannel.EMAIL in config.channels:
            tasks.append(self._send_email(config))

        if MessageChannel.WECHAT_WORK in config.channels:
            tasks.append(self._send_wechat_work(config))

        if MessageChannel.SMS in config.channels:
            tasks.append(self._send_sms(config))

        # 并行发送所有渠道
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # 汇总结果
        summary = {
            "total_channels": len(tasks),
            "success_count": 0,
            "failed_count": 0,
            "results": {},
            "msg_ids": []
        }

        for i, result in enumerate(results):
            channel = config.channels[i].value
            if isinstance(result, Exception):
                summary["results"][channel] = {"success": False, "error": str(result)}
                summary["failed_count"] += 1
            else:
                summary["results"][channel] = result
                if result.get("success"):
                    summary["success_count"] += 1
                    if result.get("msg_id"):
                        summary["msg_ids"].append(result["msg_id"])
                else:
                    summary["failed_count"] += 1

        return summary

    async def _send_email(self, config: NotificationConfig) -> Dict[str, Any]:
        """发送邮件"""
        body = {
            "title": config.title,
            "content": config.content,
            "tofEmailType": 1
        }

        request_data = {
            "app": self.app_name,
            "tenant": "tencent",
            "sync": False,
            "receivers": config.recipients,
            "messageType": "MAIL",
            "priority": config.priority,
            "tags": config.tags or ["多渠道通知"],
            "body": json.dumps(body)
        }

        return await self._send_request(request_data, "EMAIL")

    async def _send_wechat_work(self, config: NotificationConfig) -> Dict[str, Any]:
        """发送企业微信消息"""
        body = {
            "category": "重要通知",
            "content": f"{config.title}\n\n{config.content}"
        }

        request_data = {
            "app": self.app_name,
            "tenant": "tencent",
            "sync": False,
            "receivers": config.recipients,
            "messageType": "WORKCHAT_TEXT",
            "priority": config.priority,
            "tags": config.tags or ["多渠道通知"],
            "body": json.dumps(body)
        }

        return await self._send_request(request_data, "WECHAT_WORK")

    async def _send_sms(self, config: NotificationConfig) -> Dict[str, Any]:
        """发送短信"""
        # 短信内容需要简化
        sms_content = f"{config.title}: {config.content[:50]}..."

        request_data = {
            "app": self.app_name,
            "tenant": "tencent",
            "sync": False,
            "receivers": config.recipients,
            "messageType": "SMS_TEXT",
            "priority": config.priority,
            "tags": config.tags or ["多渠道通知"],
            "body": json.dumps(sms_content)
        }

        return await self._send_request(request_data, "SMS")

    async def _send_request(self, request_data: Dict[str, Any], channel: str) -> Dict[str, Any]:
        """发送HTTP请求"""
        timestamp = int(time.time())
        signature = self._calculate_signature(timestamp)

        headers = {
            'Content-Type': 'application/json',
            'hrgw-timestamp': str(timestamp),
            'hrgw-appname': self.app_name,
            'hrgw-signature': signature
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/sendV2",
                headers=headers,
                json=request_data,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                response.raise_for_status()
                result = await response.json()

                return {
                    "channel": channel,
                    "success": result.get("success", False),
                    "msg_id": result.get("data", {}).get("msgId") if result.get("success") else None,
                    "message": result.get("message")
                }

# 使用示例
async def main():
    notifier = MultiChannelNotifier("your_app_name", "your_app_token")

    config = NotificationConfig(
        title="系统升级通知",
        content="系统将于今晚22:00-24:00进行升级维护，期间服务将暂时中断，请提前做好准备。",
        recipients=["user1@tencent.com", "user2@tencent.com"],
        channels=[MessageChannel.EMAIL, MessageChannel.WECHAT_WORK],
        priority="HIGH",
        tags=["系统升级", "重要通知"]
    )

    result = await notifier.send_notification(config)
    print(f"发送结果: {json.dumps(result, indent=2, ensure_ascii=False)}")

# 运行示例
# asyncio.run(main())
```

### 5.3 HTTP 接口最佳实践

#### 5.3.1 请求构建规范

1. **Content-Type 设置**: 必须设置为`application/json`
2. **字符编码**: 统一使用 UTF-8 编码
3. **JSON 转义**: body 字段内容需要转义为 JSON 字符串
4. **时间戳精度**: 使用秒级 Unix 时间戳
5. **签名计算**: 严格按照`sha256(appName + appToken + timestamp)`计算

#### 5.3.2 性能优化建议

1. **连接复用**: 使用 HTTP 连接池减少连接开销
2. **异步调用优先**: 设置`sync=false`提高响应速度
3. **批量发送**: 在`receivers`中传入多个接收人，减少请求次数
4. **请求压缩**: 对超过 1KB 的请求体启用 gzip 压缩
5. **超时设置**: 连接超时 10 秒，读取超时 30 秒

#### 5.3.3 错误处理策略

1. **分层错误处理**: 先检查 HTTP 状态码，再检查业务状态
2. **重试机制**: 对 5xx 错误和网络超时实现指数退避重试
3. **错误日志**: 记录完整的请求和响应信息
4. **降级处理**: 关键业务消息支持多渠道降级发送
5. **监控告警**: 对发送失败率设置监控告警

#### 5.3.4 消息 ID 管理

```python
class MessageTracker:
    def __init__(self):
        self.message_log = {}

    def track_message(self, business_id, msg_id, message_type, recipients):
        """记录消息发送信息"""
        self.message_log[business_id] = {
            "msg_id": msg_id,
            "message_type": message_type,
            "recipients": recipients,
            "send_time": datetime.now().isoformat(),
            "status": "SENT"
        }

        # 保存到数据库或日志文件
        self.save_to_database(business_id, self.message_log[business_id])

    def query_message_status(self, msg_id):
        """根据msgId查询消息状态"""
        # 调用消息中台查询接口
        pass
```

#### 5.3.5 安全最佳实践

1. **凭证保护**: appToken 不得硬编码，使用环境变量或配置中心
2. **签名校验**: 服务端验证请求签名的有效性
3. **HTTPS 使用**: 生产环境强制使用 HTTPS 协议
4. **访问控制**: 基于 IP 白名单限制访问来源
5. **审计日志**: 记录所有 API 调用的审计日志

### 5.4 HTTP 接口故障排除

#### 5.4.1 常见错误及解决方案

**鉴权失败(401)**:

```bash
# 错误响应示例
{
    "code": 401,
    "success": false,
    "message": "签名验证失败"
}

# 排查步骤:
1. 检查appName和appToken是否正确
2. 验证时间戳是否为当前时间(误差不超过5分钟)
3. 确认签名算法: sha256(appName + appToken + timestamp)
4. 检查请求头字段名是否正确: hrgw-timestamp, hrgw-appname, hrgw-signature
```

**参数校验失败(400)**:

```bash
# 错误响应示例
{
    "code": 400,
    "success": false,
    "message": "参数校验失败: messageType不能为空"
}

# 排查步骤:
1. 检查必填参数是否都已提供
2. 验证参数类型和格式是否正确
3. 确认body字段是否为有效的JSON字符串
4. 检查receivers数组是否为空
```

**网络超时(Timeout)**:

```python
# 重试机制实现
import time
import random
from functools import wraps

def retry_on_timeout(max_retries=3, backoff_factor=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except (requests.Timeout, requests.ConnectionError) as e:
                    if attempt == max_retries - 1:
                        raise e

                    wait_time = backoff_factor ** attempt + random.uniform(0, 1)
                    print(f"请求超时，{wait_time:.2f}秒后重试...")
                    time.sleep(wait_time)

            return None
        return wrapper
    return decorator

@retry_on_timeout(max_retries=3)
def send_message_with_retry(request_data):
    return requests.post(url, json=request_data, timeout=30)
```

#### 5.4.2 调试工具和技巧

**请求调试脚本**:

```bash
#!/bin/bash
# debug_request.sh - 调试消息中台HTTP请求

set -e

APP_NAME="${1:-your_app_name}"
APP_TOKEN="${2:-your_app_token}"
ENDPOINT="${3:-/sendV2}"
REQUEST_FILE="${4:-request.json}"

if [ ! -f "$REQUEST_FILE" ]; then
    echo "请求文件 $REQUEST_FILE 不存在"
    exit 1
fi

# 计算签名
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "${APP_NAME}${APP_TOKEN}${TIMESTAMP}" | sha256sum | cut -d' ' -f1)

echo "调试信息:"
echo "- APP_NAME: $APP_NAME"
echo "- TIMESTAMP: $TIMESTAMP"
echo "- SIGNATURE: $SIGNATURE"
echo "- REQUEST_FILE: $REQUEST_FILE"
echo ""

# 发送请求并显示详细信息
curl -v -X POST "http://ntsgw.woa.com/api/esb/message-channel-service${ENDPOINT}" \
    -H "Content-Type: application/json" \
    -H "hrgw-timestamp: ${TIMESTAMP}" \
    -H "hrgw-appname: ${APP_NAME}" \
    -H "hrgw-signature: ${SIGNATURE}" \
    -d @"${REQUEST_FILE}" \
    | jq '.'
```

**响应验证脚本**:

```python
import json
import sys

def validate_response(response_text):
    """验证消息中台响应格式"""
    try:
        response = json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"❌ 响应不是有效的JSON格式: {e}")
        return False

    # 检查必需字段
    required_fields = ['code', 'success']
    missing_fields = [field for field in required_fields if field not in response]
    if missing_fields:
        print(f"❌ 缺少必需字段: {missing_fields}")
        return False

    # 检查成功响应
    if response.get('success'):
        if 'data' not in response or 'msgId' not in response['data']:
            print("❌ 成功响应缺少msgId字段")
            return False
        print(f"✅ 消息发送成功，msgId: {response['data']['msgId']}")
    else:
        error_msg = response.get('message', '未知错误')
        print(f"❌ 消息发送失败: {error_msg}")

    return True

# 使用示例
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("用法: python validate_response.py <response.json>")
        sys.exit(1)

    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        response_text = f.read()

    validate_response(response_text)
```

#### 5.4.3 监控和告警

**发送成功率监控**:

```python
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta

class MessageMetrics:
    def __init__(self, window_minutes=5):
        self.window_minutes = window_minutes
        self.success_count = deque()
        self.failure_count = deque()
        self.response_times = deque()

    def record_success(self, response_time_ms):
        now = datetime.now()
        self.success_count.append(now)
        self.response_times.append((now, response_time_ms))
        self._cleanup_old_records()

    def record_failure(self, error_type):
        now = datetime.now()
        self.failure_count.append((now, error_type))
        self._cleanup_old_records()

    def get_success_rate(self):
        total = len(self.success_count) + len(self.failure_count)
        if total == 0:
            return 1.0
        return len(self.success_count) / total

    def get_avg_response_time(self):
        if not self.response_times:
            return 0
        total_time = sum(rt[1] for rt in self.response_times)
        return total_time / len(self.response_times)

    def _cleanup_old_records(self):
        cutoff = datetime.now() - timedelta(minutes=self.window_minutes)

        while self.success_count and self.success_count[0] < cutoff:
            self.success_count.popleft()

        while self.failure_count and self.failure_count[0][0] < cutoff:
            self.failure_count.popleft()

        while self.response_times and self.response_times[0][0] < cutoff:
            self.response_times.popleft()

    def should_alert(self):
        success_rate = self.get_success_rate()
        avg_response = self.get_avg_response_time()

        # 告警条件
        return (
            success_rate < 0.95 or  # 成功率低于95%
            avg_response > 5000     # 平均响应时间超过5秒
        )

# 使用示例
metrics = MessageMetrics()

# 在发送消息后记录指标
def send_message_with_metrics(request_data):
    start_time = time.time()
    try:
        response = send_message(request_data)
        response_time = (time.time() - start_time) * 1000
        metrics.record_success(response_time)
        return response
    except Exception as e:
        metrics.record_failure(type(e).__name__)
        raise

# 定期检查告警
def check_alerts():
    if metrics.should_alert():
        success_rate = metrics.get_success_rate()
        avg_response = metrics.get_avg_response_time()
        alert_message = f"消息发送异常: 成功率={success_rate:.2%}, 平均响应时间={avg_response:.0f}ms"
        send_alert(alert_message)
```

### 5.5 反模式和注意事项

#### 5.5.1 ❌ 不推荐的用法

1. **硬编码凭证**:

```python
# ❌ 错误做法
app_token = "hardcoded_token_123"

# ✅ 正确做法
app_token = os.environ.get('MESSAGE_CHANNEL_APP_TOKEN')
```

2. **忽略 msgId**:

```python
# ❌ 错误做法
response = send_message(request_data)
# 不保存msgId，无法追踪消息

# ✅ 正确做法
response = send_message(request_data)
if response.get('success'):
    msg_id = response['data']['msgId']
    logger.info(f"消息发送成功, msgId: {msg_id}")
    save_message_record(business_id, msg_id)
```

3. **同步调用大批量**:

```python
# ❌ 错误做法 - 同步发送大量消息
for user in large_user_list:  # 1000个用户
    send_message({
        "sync": True,  # 同步调用
        "receivers": [user]
    })

# ✅ 正确做法 - 异步批量发送
send_message({
    "sync": False,  # 异步调用
    "receivers": large_user_list  # 批量发送
})
```

4. **不处理错误**:

```python
# ❌ 错误做法
response = requests.post(url, json=request_data)
result = response.json()  # 可能抛异常

# ✅ 正确做法
try:
    response = requests.post(url, json=request_data, timeout=30)
    response.raise_for_status()
    result = response.json()

    if not result.get('success'):
        logger.error(f"消息发送失败: {result.get('message')}")
        handle_send_failure(request_data, result)

except requests.exceptions.RequestException as e:
    logger.error(f"网络请求异常: {e}")
    handle_network_error(request_data, e)
```

#### 5.5.2 ⚠️ 注意事项

1. **时间戳同步**: 确保服务器时间与标准时间同步，时间偏差超过 5 分钟会导致鉴权失败
2. **字符编码**: 统一使用 UTF-8 编码，避免中文乱码问题
3. **JSON 转义**: body 字段必须是转义后的 JSON 字符串，不是 JSON 对象
4. **接收人格式**: 根据 idType 参数确定 receivers 的格式要求
5. **环境区分**: 测试和生产环境使用不同的接口地址和凭证
6. **频率限制**: 避免短时间内大量请求，可能触发限流保护
7. **附件大小**: 邮件附件总大小不超过 30MB，单个附件需 base64 编码
8. **模板参数**: 使用模板消息时确保参数名称与模板定义一致

## 6. 数据契约层

### 6.1 消息类型枚举

- **MAIL**: 普通邮件
- **MAIL_MEETING**: 会议邮件
- **MAIL_SES**: 腾讯云 SES 邮件
- **SMS_TEXT**: 文本短信
- **SMS_TEMPLATE**: 模板短信
- **WECHAT_TPL**: 微信模板消息
- **WORKCHAT_TEXT**: 企微文本消息
- **WORKCHAT_TIPS**: 企微 Tips 消息
- **WORKCHAT_MARKDOWN**: 企微 Markdown 消息
- **MYOA_CREATE**: 创建 MyOA 单据
- **MYOA_CLOSE**: 关闭 MyOA 单据
- **CTI_POLL**: 语音轮询消息

### 6.2 优先级枚举

- **HIGH**: 高优先级
- **MIDDLE**: 中优先级(默认)
- **LOW**: 低优先级

### 6.3 接收人 ID 类型

- **DIRECT**: 直接传递，邮件为邮箱地址，企微为用户名
- **ID**: 内网为 engname/staffId，外网为 globalId

## 7. 运行时行为层

### 7.1 异步特性

- 默认异步执行，提高响应速度
- 支持同步调用，适用于需要立即获取结果的场景

### 7.2 幂等性

- 相同参数的重复调用会产生新的 msgId
- 建议业务层实现幂等控制

### 7.3 并发安全

- 服务端支持高并发调用
- 建议客户端控制并发量避免触发限流

## 8. 错误处理层

### 8.1 常见错误场景

#### 8.1.1 鉴权失败

- **错误原因**: appName、appToken 或签名错误
- **解决方案**: 检查服务市场注册信息和签名算法

#### 8.1.2 参数校验失败

- **错误原因**: 必填参数缺失或格式错误
- **解决方案**: 检查参数完整性和格式规范

#### 8.1.3 接收人不存在

- **错误原因**: 邮箱地址或用户 ID 不存在
- **解决方案**: 确认接收人信息的有效性

### 8.2 网络异常处理

- 设置合理的超时时间
- 实现重试机制，建议指数退避
- 记录详细的错误日志

## 9. 配置说明层

### 9.1 环境配置

#### 9.1.1 测试环境

```yaml
message-channel:
  base-url: http://dev-ntsgw.woa.com/api/esb/message-channel-service
  timeout: 30000
```

#### 9.1.2 生产环境

```yaml
message-channel:
  base-url: http://ntsgw.woa.com/api/esb/message-channel-service
  timeout: 30000
```

### 9.2 Java SDK 配置

```yaml
hr:
  security:
    app-name: ${APP_NAME}
    app-token: ${APP_TOKEN}
  message-channel:
    enabled: true
    async: true
    retry-times: 3
```

## 10. 接入前置准备

### 10.1 系统注册

1. 到[服务市场](https://servicemarket.woa.com/appMarket)注册应用
2. 获取 appName 和 appToken
3. 配置回调地址(如需要)

### 10.2 网络配置

- 确认网络环境(内网/外网/公网)
- 配置对应的接入地址
- 测试网络连通性

### 10.3 权限申请

- 邮件白名单申请(如需要)
- 企业微信应用权限申请
- 短信发送权限申请

## 11. 常用消息类型示例

### 11.1 系统告警邮件

```java
MailMessageParam param = new MailMessageParam();
param.setTitle("[告警] 系统异常通知");
param.setContent("检测到系统异常，请及时处理");
param.setReceivers(Arrays.asList("admin@tencent.com"));
param.setExceptionNotifyMail(true); // 标记为异常通知邮件
```

### 11.2 审批通知

```java
WorkChatTemplateCardMessageParam param = new WorkChatTemplateCardMessageParam();
param.setCategory("审批通知");
param.setTemplateCard(buildApprovalCard()); // 构建审批卡片
param.setReceivers(Arrays.asList("approver"));
```

### 11.3 会议邀请

```java
MailMeetingParam param = new MailMeetingParam();
param.setTitle("项目评审会议");
param.setLocation("会议室A");
param.setOrganizer("organizer@tencent.com");
param.setStartTime("2023-12-01 14:00:00");
param.setEndTime("2023-12-01 16:00:00");
```

---

## 联系我们

如有问题请联系：

- 技术支持: 消息中台团队
- 文档更新: 2024 年 11 月

> **重要提醒**: 所有接口调用都会返回 msgId，强烈建议保存到系统日志中，便于后续问题排查和消息状态追踪。
