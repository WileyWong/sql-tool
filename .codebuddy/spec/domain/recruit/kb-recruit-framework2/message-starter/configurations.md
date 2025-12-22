# 配置类索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目配置类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.config/configuration`  
> **文件总数**: 4个

---

## 📝 配置类清单

### 1. AutoMessageConfiguration
- **类型**: @Configuration自动配置类
- **Bean定义**: 
  - syncEmailSender, asyncEmailSender
  - syncSmsSender, asyncSmsSender
  - syncAppSender, asyncAppSender
  - 其他消息发送器Bean
- **用途**: 自动配置所有消息发送器

### 2. OldMessageConfiguration
- **类型**: @Configuration配置类
- **用途**: 旧版消息配置，兼容性支持

### 3. HrAssistantFeignConfig
- **类型**: Feign配置类
- **配置**: HRAssistant Feign客户端配置
- **Decoder**: HrAssistantFeignResultDecoder

### 4. RecruitEfficiencyFeignConfig
- **类型**: Feign配置类
- **配置**: RecruitEfficiency Feign客户端配置

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
