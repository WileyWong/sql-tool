# Bean对象索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `bean` 包下所有Bean对象的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.bean`  
> **文件总数**: 1个

---

## 📑 目录

- [一、架构概览](#一架构概览)
- [二、详细清单](#二详细清单)
- [三、技术架构说明](#三技术架构说明)
- [四、最佳实践建议](#四最佳实践建议)

---

## 一、架构概览

### 1.1 目录结构

```
bean/
└── RequestErrorBean.java (1个) - 请求错误信息Bean
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 异常信息传输 | 1 | 封装异常请求的完整信息 |

---

## 二、详细清单

### 2.1 RequestErrorBean - 请求错误信息Bean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.bean.RequestErrorBean`
- **文件大小**: 764 B
- **注解**: `@Data`, `@Accessors(chain = true)`

**字段列表** (13个字段):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| traceId | String | 链路追踪ID |
| message | String | 异常堆栈信息 |
| serviceName | String | 服务名称 |
| exceptionName | String | 异常类名 |
| noticeException | String | 自定义通知异常信息 |
| interfaceName | String | 接口名称（类名.方法名） |
| currentName | String | 当前用户名 |
| headers | Map&lt;String, String&gt; | 请求Header信息 |
| requestParams | Map&lt;String, String[]&gt; | 请求参数信息 |
| url | String | 请求URL |
| methodName | String | HTTP方法名（GET/POST等） |
| jobDataKey | String | JobTask数据键（JobTask异常专用） |
| jobDataValue | String | JobTask数据值（JobTask异常专用） |
| config | ExceptionNoticeDTO | 异常通知配置 |

**公共方法**:
- 使用 `@Data` 注解，自动生成所有字段的 getter/setter 方法
- 使用 `@Accessors(chain = true)` 支持链式调用

**使用示例**:
```java
// 创建请求错误Bean
RequestErrorBean bean = new RequestErrorBean()
    .setTraceId("trace-123-456")
    .setServiceName("recruit-service")
    .setExceptionName("NullPointerException")
    .setUrl("/api/user/query")
    .setMethodName("GET")
    .setCurrentName("zhangsan")
    .setHeaders(headerMap)
    .setRequestParams(paramMap)
    .setMessage(exceptionStackTrace);

// JobTask异常专用字段
bean.setJobDataKey("syncUser")
    .setJobDataValue("userId=123")
    .setNoticeException("用户数据同步失败");

// 设置通知配置
bean.setConfig(exceptionNoticeDTO);
```

**应用场景**:
1. **异常信息收集**: 收集HTTP请求相关的所有异常信息
2. **异常通知**: 作为异常通知的数据载体传递给通知服务
3. **JobTask异常**: 特殊处理定时任务和异步任务的异常信息
4. **链路追踪**: 通过traceId关联分布式系统中的异常

**字段说明**:

**基础字段**:
- `traceId`: 分布式链路追踪ID，用于关联整个请求链路
- `serviceName`: 当前服务名称，标识异常发生的微服务
- `exceptionName`: 异常类的简单名称（如NullPointerException）
- `message`: 完整的异常堆栈信息

**请求信息字段**:
- `url`: 请求的URI路径
- `methodName`: HTTP方法（GET、POST、PUT、DELETE等）
- `interfaceName`: 接口完整名称（Controller类名.方法名）
- `currentName`: 当前登录用户名称
- `headers`: 请求的所有Header信息
- `requestParams`: 请求的所有参数信息

**特殊场景字段**:
- `noticeException`: IExceptionHandler接口自定义的通知消息
- `jobDataKey`: RecruitJobTaskRuntimeException的数据键
- `jobDataValue`: RecruitJobTaskRuntimeException的数据值

**配置字段**:
- `config`: ExceptionNoticeDTO异常通知配置（包含通知人员、企业微信Hook等）

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Lombok**: 使用@Data和@Accessors简化代码
- **链式调用**: 支持流式API风格的对象构建

### 3.2 设计模式
- **数据传输对象（DTO）**: 专门用于异常信息的传输
- **Builder模式**: 通过链式调用构建复杂对象

### 3.3 关键特性
1. **完整信息**: 包含请求的所有上下文信息
2. **链式调用**: 支持流畅的对象构建
3. **扩展性强**: 支持JobTask和自定义异常的特殊字段
4. **配置分离**: 通过config字段引用异常通知配置

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：使用链式调用构建对象
RequestErrorBean bean = new RequestErrorBean()
    .setTraceId(TraceUtil.traceIdString())
    .setServiceName(serviceName)
    .setExceptionName(exception.getClass().getSimpleName())
    .setUrl(request.getRequestURI())
    .setMethodName(request.getMethod());

// ❌ 不推荐做法：逐行设置，代码冗长
RequestErrorBean bean = new RequestErrorBean();
bean.setTraceId(TraceUtil.traceIdString());
bean.setServiceName(serviceName);
bean.setExceptionName(exception.getClass().getSimpleName());
// ...
```

### 4.2 字段设置建议

```java
// ✅ 推荐：完整收集请求信息
Collections.list(request.getHeaderNames())
    .forEach(v -> bean.getHeaders().put(v, request.getHeader(v)));
request.getParameterMap()
    .forEach((k, v) -> bean.getRequestParams().put(k, v));

// ✅ 推荐：JobTask异常设置特殊字段
if (exception instanceof RecruitJobTaskRuntimeException) {
    RecruitJobTaskRuntimeException temp = (RecruitJobTaskRuntimeException) exception;
    bean.setJobDataKey(temp.getDataKey())
        .setJobDataValue(temp.getDataValue())
        .setNoticeException(temp.getJobException());
}
```

### 4.3 常见问题

**问题1**: Headers或RequestParams为null导致NullPointerException
- **原因**: 未初始化Map集合
- **解决**: 在构造时初始化：`setHeaders(Maps.newHashMap())`

**问题2**: JobTask字段在普通异常中有值
- **原因**: Bean复用导致
- **解决**: 每次创建新的Bean实例，不要复用

**问题3**: Message字段过长导致邮件发送失败
- **原因**: 异常堆栈信息过长
- **解决**: 可以截取前N行或使用ExceptionUtils.getRootCauseMessage()

---

## 📚 相关文档

- [Advice索引](./advice.md) - CloudMessageExceptionAdvice和OAMessageExceptionAdvice
- [Configuration索引](./configuration.md) - RequestErrorConfiguration配置类
- [Support工具索引](./support.md) - MessageRuleSupport工具类

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有字段和方法 | v1.0 |

---
