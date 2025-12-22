# 枚举类索引文档

> **文档说明**: 本文档为 RecruitCenterMessageStarter 项目 `enums` 包下所有枚举类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.message.enums`  
> **文件总数**: 3个

---

## 📊 枚举类清单

### 1. MessageErrorCode
- **类型**: 枚举类
- **用途**: 消息错误码定义
- **枚举值**: SUCCESS(0, "成功"), PARAM_ERROR(1, "参数错误"), SEND_FAIL(2, "发送失败") 等
- **字段**: code(Integer), message(String)

### 2. ExceptionAdviceLevel
- **类型**: 枚举类
- **用途**: 异常建议级别
- **枚举值**: INFO, WARN, ERROR
- **用途**: 标识异常通知的严重程度

### 3. FrameworkRedisKey
- **类型**: 枚举类
- **用途**: 框架Redis键定义
- **枚举值**: MESSAGE_TEMPLATE("recruit:message:template:%s")
- **字段**: key(String)
- **方法**: getKey(Object... args) - 格式化Redis键

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
