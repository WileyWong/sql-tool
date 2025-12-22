# Feign接口索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `feign` 包下所有Feign接口的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.feign`  
> **文件总数**: 2个

---

## 📝 Feign接口清单

### 1. HRAssistantFeign
- **@FeignClient**: name = "hr-assistant"
- **方法列表**:
  - createGroup(@RequestBody CreateGroupDTO dto)
  - queryGroup(@RequestParam("chat_id") String chatId)
  - updateGroup(@RequestBody UpdateGroupDTO dto)
  - sendGroupMessage(@RequestParam String chatId, @RequestBody MsgChatDTO message)
  - sendFunctionView(@RequestBody FunctionViewDTO dto)
- **用途**: HR助手远程服务调用

### 2. RecruitCenterFeign
- **@FeignClient**: name = "recruit-center"
- **方法列表**:
  - getConfig(@RequestParam String configKey)
  - updateConfig(@RequestParam String configKey, @RequestBody Map<String, Object> configValue)
  - getTemplate(@RequestParam String templateKey)
- **用途**: 招聘中心远程服务调用

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
