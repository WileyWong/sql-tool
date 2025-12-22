# DTO对象索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `dto` 包下所有DTO对象的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.dto`  
> **文件总数**: 13个

---

## 📊 DTO分类统计

| 分类 | 文件数量 | 说明 |
|------|---------|------|
| **功能视图** | 2个 | FunctionViewDTO, FunctionViewRetDTO |
| **企业微信群** | 6个 | WorkChatGroupDTO, CreateGroupDTO, QueryGroupDTO, UpdateGroupDTO, InitWorkChatGroupDTO, WorkChatResultDTO |
| **消息聊天** | 4个 | MsgChatDTO, TextChatDTO, MarkDownDTO, MediaChatDTO, CardChatDTO |
| **异常通知** | 1个 | ExceptionNoticeDTO |
| **总计** | **13个** | **所有DTO对象** |

---

## 📝 DTO对象清单

### 1. FunctionViewDTO
- **字段**: appName(String), businessId(String), actionId(String), chatId(String), visibleUser(String), params(Map)
- **用途**: 功能视图消息数据传输

### 2. FunctionViewRetDTO
- **字段**: messageId(String), errcode(Integer), errmsg(String)
- **用途**: 功能视图消息返回结果

### 3. WorkChatGroupDTO
- **字段**: chatId(String), name(String), owner(String), userList(List<String>)
- **用途**: 企业微信群信息

### 4. CreateGroupDTO
- **字段**: name(String), owner(String), userList(List<String>), chatId(String)
- **用途**: 创建企业微信群参数

### 5. QueryGroupDTO
- **字段**: chatId(String)
- **用途**: 查询企业微信群参数

### 6. UpdateGroupDTO
- **字段**: chatId(String), name(String), owner(String), addUserList(List<String>), delUserList(List<String>)
- **用途**: 更新企业微信群参数

### 7. InitWorkChatGroupDTO
- **字段**: name(String), owner(String), chatId(String), userList(List<String>)
- **用途**: 初始化企业微信群参数

### 8. WorkChatResultDTO
- **字段**: chatId(String), errcode(Integer), errmsg(String), invalidUser(String), notFoundUser(String)
- **用途**: 企业微信群操作结果

### 9. MsgChatDTO
- **字段**: msgType(String), text(TextChatDTO), mark(MarkDownDTO), card(CardChatDTO), media(MediaChatDTO)
- **用途**: 消息聊天数据传输对象

### 10. TextChatDTO
- **字段**: content(String)
- **用途**: 文本消息

### 11. MarkDownDTO
- **字段**: content(String)
- **用途**: Markdown消息

### 12. MediaChatDTO
- **字段**: mediaId(String)
- **用途**: 媒体消息

### 13. CardChatDTO
- **字段**: title(String), description(String), url(String), btnText(String)
- **用途**: 卡片消息

### 14. ExceptionNoticeDTO
- **字段**: level(String), title(String), content(String), receivers(List<String>)
- **用途**: 异常通知数据传输

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
