# Service服务类索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `service` 包下所有Service类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.service`  
> **文件总数**: 9个 (4接口 + 5实现)

---

## 📊 Service分类

| 分类 | 文件数量 | 说明 |
|------|---------|------|
| **接口层** | 4个 | Service接口定义 |
| **实现层** | 5个 | Service接口实现 |
| **总计** | **9个** | **所有Service文件** |

---

## 📝 Service接口 (4个)

### 1. HrMessageService
- **方法**: sendMessage(MessageBean bean)
- **用途**: HR消息服务接口

### 2. HrAssistantService
- **方法**: 
  - createGroup(WorkChatGroupDTO dto)
  - queryGroup(String chatId)
  - updateGroup(UpdateGroupDTO dto)
  - sendGroupMessage(String chatId, String message)
- **用途**: HR助手服务接口

### 3. FunctionViewService
- **方法**: send(FunctionViewDTO dto)
- **用途**: 功能视图服务接口

### 4. MessageTemplateService
- **方法**: 
  - getTemplate(String templateKey)
  - renderTemplate(String template, Map<String, Object> params)
- **用途**: 消息模板服务接口

---

## 📝 Service实现 (5个)

### 1. HrMessageServiceImpl
- **实现**: HrMessageService
- **依赖**: RecruitEmailSender, RecruitSmsSender等
- **核心逻辑**: 统一消息发送处理

### 2. HrAssistantServiceImpl
- **实现**: HrAssistantService
- **依赖**: HRAssistantFeign
- **核心逻辑**: 企业微信群管理，消息发送

### 3. FunctionViewServiceImpl
- **实现**: FunctionViewService
- **依赖**: HRAssistantFeign
- **核心逻辑**: 功能视图消息发送

### 4. MessageTemplateServiceImpl
- **实现**: MessageTemplateService
- **核心逻辑**: 消息模板管理和渲染

### 5. DebugAssistantServiceImpl
- **实现**: HrAssistantService (调试版本)
- **核心逻辑**: 调试模式的HR助手服务

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
