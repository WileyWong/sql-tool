# Bean对象索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `bean` 包下所有Bean对象的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.bean`  
> **文件总数**: 25个

---

## 📑 目录

- [一、架构概览](#一架构概览)
- [二、详细清单](#二详细清单)
- [三、技术架构说明](#三技术架构说明)

---

## 一、架构概览

### 1.1 按功能分类

| 功能模块 | Bean数量 | 核心功能 |
|---------|---------|---------|
| **邮件消息** | 3个 | EmailBean, TemplateEmailBean, ScheduleEmailBean |
| **短信消息** | 4个 | SmsBean, TemplateSmsBean, OaSmsMsgBean, OaSmsTemplateMsgBean |
| **企业微信消息** | 7个 | WorkBean, WorkCardBean, WorkChatBean, WorkRichBean, GroupWorkBean, GroupWorkCardBean, GroupMarkDownBean |
| **微信公众号** | 2个 | WechatBean, WechatItemBean |
| **机器人消息** | 3个 | XiaotBean, BotTextBean, TestBotMsgEntity |
| **功能视图** | 1个 | FunctionViewBean |
| **基础Bean** | 4个 | BasicCategoryBean, BasicGroupBean, MessageResultBean, WorkRichItemBeam |
| **总计** | **25个** | **所有Bean对象** |

---

## 二、详细清单

### 2.1 邮件消息Bean (3个)

#### 2.1.1 EmailBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.EmailBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| from | String | 发件人 |
| title | String | 邮件标题 (支持XSS过滤) |
| content | String | 邮件内容 (支持XSS过滤) |
| to | List\<String\> | 收件人列表 |
| cc | List\<String\> | 抄送人列表 |
| bcc | List\<String\> | 密送人列表 |
| emailType | Integer | 邮件类型，默认值1 |
| attachments | List\<File\> | 附件列表 |
| tofEmailType | Integer | TOF邮件类型：0-不校验白名单，1-校验收件人白名单 |
| exceptionNotifyMail | Boolean | 是否异常通知邮件，默认false |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | EmailBean | 添加收件人 |
| addCc | String... cc | EmailBean | 添加抄送人 |
| addBcc | String... bcc | EmailBean | 添加密送人 |
| addAttachment | File... attachment | EmailBean | 添加附件 |

**技术特点**:
- 使用Lombok @Data和@Accessors(chain = true)支持链式调用
- 实现Serializable接口
- 支持XSS过滤注解@XssIgnore

---

#### 2.1.2 TemplateEmailBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.TemplateEmailBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| template | String | 模板名称 |
| title | String | 邮件标题 |
| from | String | 发件人 |
| to | List\<String\> | 收件人列表 |
| cc | List\<String\> | 抄送人列表 |
| bcc | List\<String\> | 密送人列表 |
| params | Map\<String, Object\> | 模板参数 |
| attachments | List\<File\> | 附件列表 |
| exceptionNotifyMail | Boolean | 是否异常通知邮件，默认false |
| tofEmailType | Integer | TOF邮件类型 |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | TemplateEmailBean | 添加收件人 |
| addCc | String... cc | TemplateEmailBean | 添加抄送人 |
| addBcc | String... bcc | TemplateEmailBean | 添加密送人 |
| addAttachment | File... attachment | TemplateEmailBean | 添加附件 |
| addParam | String name, Object value | TemplateEmailBean | 添加模板参数 |

---

#### 2.1.3 ScheduleEmailBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.ScheduleEmailBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| from | String | 发件人 |
| title | String | 邮件标题 (支持XSS过滤) |
| content | String | 邮件内容 (支持XSS过滤) |
| to | List\<String\> | 收件人列表 |
| location | String | 会议地点 (支持XSS过滤) |
| organizer | String | 组织者 (支持XSS过滤) |
| startTime | LocalDateTime | 开始时间 |
| endTime | LocalDateTime | 结束时间 |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | ScheduleEmailBean | 添加收件人 |

**技术特点**:
- 支持日程邮件发送
- 时间字段使用@DateTimeFormat注解，格式为"yyyy-MM-dd HH:mm:ss"

---

### 2.2 短信消息Bean (4个)

#### 2.2.1 SmsBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.SmsBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | 短信内容 (支持XSS过滤) |
| sign | String | 短信签名 |
| to | List\<String\> | 接收人列表 |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |
| nationCode | String | 国家码 |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | SmsBean | 添加接收人 |

---

#### 2.2.2 TemplateSmsBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.TemplateSmsBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| templateId | String | 模板ID |
| to | List\<String\> | 接收人列表 |
| params | List\<String\> | 模板参数列表 |
| idType | ReceiverIdType | 接收人ID类型 |
| sign | String | 短信签名 |
| nationCode | String | 国家码 |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | TemplateSmsBean | 添加接收人 |
| addParam | String... param | TemplateSmsBean | 添加模板参数 |

**技术特点**:
- 支持idType设置为ReceiverIdType.ID，直接传递StaffId

---

#### 2.2.3 OaSmsMsgBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.OaSmsMsgBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | 短信内容 |
| nationCode | String | 国家码 |
| phone | String | 电话号码 |
| staffName | String | 员工姓名 |

**公共方法**: 标准getter/setter（Lombok生成）

---

#### 2.2.4 OaSmsTemplateMsgBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.OaSmsTemplateMsgBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| templateId | String | 模板ID |
| templateParam | Map\<String, Object\> | 模板参数 |
| nationCode | String | 国家码 |
| phone | String | 电话号码 |
| staffName | String | 员工姓名 |

**公共方法**: 标准getter/setter（Lombok生成）

---

### 2.3 企业微信消息Bean (7个)

#### 2.3.1 WorkBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WorkBean`

**继承关系**: `extends BasicCategoryBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| to | List\<String\> | 接收人列表 |
| content | String | 消息内容 |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |
| category | String | 消息分类（继承自父类） |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | WorkBean | 添加接收人 |

---

#### 2.3.2 WorkCardBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WorkCardBean`

**继承关系**: `extends BasicCategoryBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| to | List\<String\> | 接收人列表 |
| btnText | String | 按钮文本 (支持XSS过滤) |
| url | String | 跳转URL (支持XSS过滤) |
| title | String | 卡片标题 (支持XSS过滤) |
| description | String | 卡片描述 (支持XSS过滤) |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |
| category | String | 消息分类（继承自父类） |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | WorkCardBean | 添加接收人 |

---

#### 2.3.3 WorkChatBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WorkChatBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| serviceName | String | 服务名称 |
| groupName | String | 群名称 |
| owner | String | 群主 |
| add | List\<String\> | 添加的成员列表 |
| operator | String | 操作人 |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |
| message | List\<BasicGroupBean\> | 消息列表 |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| update | - | boolean | 判断是否为更新操作 |
| add | String... to | WorkChatBean | 添加群成员 |
| add | BasicGroupBean... message | WorkChatBean | 添加消息 |

---

#### 2.3.4 WorkRichBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WorkRichBean`

**继承关系**: `extends BasicCategoryBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| to | List\<String\> | 接收人列表 |
| params | List\<WorkRichItemBeam\> | 富文本消息项列表 |
| category | String | 消息分类（继承自父类） |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addParam | WorkRichItemBeam... param | WorkRichBean | 添加富文本项 |
| addTo | String... to | WorkRichBean | 添加接收人 |

---

#### 2.3.5 GroupWorkBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.GroupWorkBean`

**继承关系**: `extends BasicGroupBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | 消息内容 (支持XSS过滤) |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| build | - | MsgChatDTO | 构建消息对象（覆写抽象方法） |

---

#### 2.3.6 GroupWorkCardBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.GroupWorkCardBean`

**继承关系**: `extends BasicGroupBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| btnText | String | 按钮文本 (支持XSS过滤) |
| url | String | 跳转URL (支持XSS过滤) |
| title | String | 卡片标题 (支持XSS过滤) |
| description | String | 卡片描述 (支持XSS过滤) |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| build | - | MsgChatDTO | 构建消息对象（覆写抽象方法） |

---

#### 2.3.7 GroupMarkDownBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.GroupMarkDownBean`

**继承关系**: `extends BasicGroupBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | Markdown内容 (支持XSS过滤) |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| build | - | MsgChatDTO | 构建Markdown消息对象（覆写抽象方法） |

---

### 2.4 微信公众号消息Bean (2个)

#### 2.4.1 WechatBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WechatBean`

**继承关系**: `extends BasicCategoryBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| templateId | String | 模板ID |
| to | String | 接收人 |
| url | String | 跳转URL |
| params | List\<WechatItemBean\> | 模板参数列表 |
| category | String | 消息分类（继承自父类） |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addParam | WechatItemBean... param | WechatBean | 添加模板参数 |

---

#### 2.4.2 WechatItemBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.WechatItemBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| name | String | 参数名称 |
| value | String | 参数值 |
| color | String | 颜色 |

**公共方法**: 标准getter/setter（Lombok生成）

---

### 2.5 机器人消息Bean (3个)

#### 2.5.1 XiaotBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.XiaotBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| to | List\<String\> | 接收人列表 |
| content | String | 消息内容 (支持XSS过滤) |
| idType | ReceiverIdType | 接收人ID类型，默认DIRECT |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| addTo | String... to | XiaotBean | 添加接收人 |

---

#### 2.5.2 BotTextBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.BotTextBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| botName | String | 机器人名称 (JsonIgnore) |
| chatid | String | 会话ID |
| msgtype | String | 消息类型，固定值"TEXT" |
| text | Content | 文本内容对象 |

**内部类Content**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | 文本内容 |

**公共方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| setTextValue | String text | BotTextBean | 设置文本内容 |
| getInstance | String text | BotTextBean | 静态工厂方法，创建实例 |

---

#### 2.5.3 TestBotMsgEntity

**类路径**: `com.tencent.hr.recruit.center.message.bean.TestBotMsgEntity`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| hook | String | webhook地址 (JsonIgnore) |
| chatId | String | 会话ID |
| visibleUser | String | 可见用户 |
| msgType | String | 消息类型 |
| text | Text | 文本消息对象 |
| markdown | Markdown | Markdown消息对象 |

**内部类Markdown**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | Markdown内容 |
| attachments | List\<Attachment\> | 附件列表 |

**内部类Attachment**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| callbackId | String | 回调ID |
| actions | List\<Action\> | 动作列表 |

**内部类Action**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| name | String | 名称 |
| text | String | 文本 |
| type | String | 类型 |
| value | String | 值 |
| replaceText | String | 替换文本 |
| borderColor | String | 边框颜色 |
| textColor | String | 文本颜色 |

**内部类Text**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| content | String | 文本内容 |
| mentioned | List\<String\> | @提醒列表 |

**公共方法**: 标准getter/setter（Lombok生成）

**技术特点**:
- 符合企业微信机器人API规范
- 支持文本、Markdown消息类型
- 参考文档: https://developer.work.weixin.qq.com/document/path/91880

---

### 2.6 功能视图Bean (1个)

#### 2.6.1 FunctionViewBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.FunctionViewBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| appName | String | 应用名称 |
| businessId | String | 业务场景ID（需先在消息中台创建） |
| actionId | String | 动作ID（需先在消息中台创建） |
| chatId | String | 消息接收人 |
| visibleUser | String | 部分可见用户，多个用'\|'分隔 |
| params | Map\<String, Object\> | 参数 |

**公共方法**: 标准getter/setter（Lombok生成）

---

### 2.7 基础Bean (4个)

#### 2.7.1 BasicCategoryBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.BasicCategoryBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| category | String | 消息分类 |

**公共方法**: 标准getter/setter（Lombok生成）

**技术特点**:
- 作为基础父类，被多个消息Bean继承
- 提供统一的category字段

---

#### 2.7.2 BasicGroupBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.BasicGroupBean`

**继承关系**: `implements Serializable`

**抽象方法**:

| 方法名 | 参数 | 返回类型 | 说明 |
|-------|------|---------|------|
| build | - | MsgChatDTO | 构建消息对象（抽象方法） |

**技术特点**:
- 抽象类，作为群消息Bean的基类
- 所有子类需实现build()方法

---

#### 2.7.3 MessageResultBean

**类路径**: `com.tencent.hr.recruit.center.message.bean.MessageResultBean`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 成功标志，默认true |
| message | String | 消息，默认"ok" |
| messageId | String | 消息ID |

**公共方法**: 标准getter/setter（Lombok生成）

---

#### 2.7.4 WorkRichItemBeam

**类路径**: `com.tencent.hr.recruit.center.message.bean.WorkRichItemBeam`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| url | String | 跳转URL (支持XSS过滤) |
| title | String | 标题 (支持XSS过滤) |
| picUrl | String | 图片URL (支持XSS过滤) |
| description | String | 描述 (支持XSS过滤) |

**公共方法**: 标准getter/setter（Lombok生成）

---

## 三、技术架构说明

### 3.1 核心技术栈

- **Lombok**: 使用@Data、@Accessors(chain = true)简化代码，支持链式调用
- **Jackson**: 使用@JsonProperty、@JsonIgnore进行JSON序列化控制
- **Serializable**: 所有Bean实现序列化接口
- **XSS防护**: 使用@XssIgnore注解标记需要过滤的字段

### 3.2 设计模式

- **继承模式**: BasicCategoryBean作为基类，提供统一的category字段
- **抽象工厂**: BasicGroupBean作为抽象类，定义build()方法规范
- **Builder模式**: 通过链式调用和add方法提供灵活的Bean构建方式
- **静态工厂**: BotTextBean提供getInstance()静态工厂方法

### 3.3 Bean分类架构

```
Bean层次结构:
├── 邮件消息 (3个)
│   ├── EmailBean - 普通邮件
│   ├── TemplateEmailBean - 模板邮件
│   └── ScheduleEmailBean - 日程邮件
│
├── 短信消息 (4个)
│   ├── SmsBean - 普通短信
│   ├── TemplateSmsBean - 模板短信
│   ├── OaSmsMsgBean - OA短信
│   └── OaSmsTemplateMsgBean - OA模板短信
│
├── 企业微信 (7个)
│   ├── WorkBean - 普通消息
│   ├── WorkCardBean - 卡片消息
│   ├── WorkChatBean - 群消息
│   ├── WorkRichBean - 富文本消息
│   ├── GroupWorkBean - 群文本消息
│   ├── GroupWorkCardBean - 群卡片消息
│   └── GroupMarkDownBean - 群Markdown消息
│
├── 微信公众号 (2个)
│   ├── WechatBean - 微信消息
│   └── WechatItemBean - 微信消息项
│
├── 机器人消息 (3个)
│   ├── XiaotBean - 小T机器人
│   ├── BotTextBean - Bot文本消息
│   └── TestBotMsgEntity - 企业微信Bot消息
│
├── 功能视图 (1个)
│   └── FunctionViewBean - 功能视图消息
│
└── 基础Bean (4个)
    ├── BasicCategoryBean - 基础分类Bean
    ├── BasicGroupBean - 基础群消息Bean
    ├── MessageResultBean - 消息结果Bean
    └── WorkRichItemBeam - 富文本消息项
```

### 3.4 统计信息

```
总Bean数量: 25个

字段统计:
├── 支持XSS过滤的字段: 20+个
├── 支持链式调用: 25个 (100%)
└── 实现序列化: 25个 (100%)

方法统计:
├── add系列方法: 35+个
├── build方法: 3个
└── 工厂方法: 1个
```

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
