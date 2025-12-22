# Support辅助类索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `support` 包下所有辅助类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.support`  
> **文件总数**: 3个

---

## 📝 Support辅助类清单

### 1. TofMessageSupport
- **用途**: TOF消息支持类
- **方法**:
  - sendEmail(EmailBean bean)
  - sendSms(SmsBean bean)
  - sendTemplate(TemplateEmailBean bean)
- **说明**: 提供TOF消息平台集成支持

### 2. HrcTemplateSupport
- **用途**: HRC模板支持类
- **方法**:
  - renderTemplate(String template, Map<String, Object> params)
  - getTemplate(String templateKey)
- **说明**: 提供消息模板渲染和管理

### 3. HrAssistantFeignResultDecoder
- **实现**: Decoder接口
- **用途**: HR助手Feign结果解码器
- **说明**: 自定义Feign响应解码逻辑

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
