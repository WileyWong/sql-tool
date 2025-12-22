# Controller全局异常处理器索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `controller` 包下所有Controller类的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.controller`  
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
controller/
└── GlobalAdviceController.java (1个) - 全局异常拦截处理器
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 全局异常拦截 | 1 | 统一处理所有异常并返回标准化响应 |

---

## 二、详细清单

### 2.1 GlobalAdviceController - 全局异常拦截处理器

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.controller.GlobalAdviceController`
- **文件大小**: 8.49 KB
- **注解**: `@Slf4j`, `@RestControllerAdvice`, `@Order(Ordered.HIGHEST_PRECEDENCE >> 4)`

**字段列表** (1个字段):

| 字段名 | 类型 | 修饰符 | 说明 |
|-------|------|-------|------|
| exceptionAdvice | IExceptionAdvice | @Autowired | 异常通知处理器 |

**公共方法** (13个):

| 方法签名 | 返回类型 | HTTP状态 | 说明 |
|---------|---------|---------|------|
| `methodArgumentNotValidException(MethodArgumentNotValidException ex)` | Result&lt;String&gt; | 200 | 参数校验异常处理（@Valid） |
| `clientAbortException(ClientAbortException ex)` | Result&lt;String&gt; | 200 | 客户端中断异常处理 |
| `constraintViolationException(ConstraintViolationException ex)` | Result&lt;String&gt; | 200 | 约束违反异常处理 |
| `bindException(BindException ex)` | Result&lt;String&gt; | 200 | 绑定异常处理 |
| `handleDecodeException(DecodeException ex)` | Result&lt;?&gt; | 200 | Feign解码异常处理 |
| `recruitException(RecruitException ex)` | Result&lt;String&gt; | 200 | Recruit自定义异常 |
| `recruitCheckException(RecruitCheckException ex)` | Result&lt;String&gt; | 200 | Recruit校验异常 |
| `recruitRuntimeException(RecruitRuntimeException ex)` | Result&lt;String&gt; | 200 | Recruit运行时异常 |
| `recruitRemoteException(RecruitRemoteException ex)` | Result&lt;String&gt; | 200 | Recruit远程调用异常 |
| `recruitForbiddenException(RecruitForbiddenException ex)` | Result&lt;String&gt; | 200 | Recruit无权限异常 |
| `exception(Exception ex)` | Result&lt;String&gt; | 200 | 兜底异常处理 |
| `errorMessage(BindingResult bindingResult)` | String | - | 提取绑定错误消息（private） |
| `errorMessage(Set<ConstraintViolation<?>> violations)` | String | - | 提取约束违反错误消息（private） |
| `constraintViolation(ObjectError result)` | ConstraintViolationImpl | - | 解包约束违反对象（private） |

**异常处理矩阵**:

| 异常类型 | 是否触发Advice | 错误码 | 消息来源 |
|---------|--------------|-------|---------|
| MethodArgumentNotValidException | ❌ | 500 | 参数校验消息 |
| ClientAbortException | ❌ | 200 | "client中断" |
| ConstraintViolationException | ❌ | 500 | 约束校验消息 |
| BindException | ❌ | 500 | 绑定错误消息 |
| DecodeException → RecruitCheckException | ✅ | 自定义 | 异常自带消息 |
| DecodeException（其他） | ✅ | 500 | I18n消息 |
| RecruitException | ✅ | 异常指定 | I18n消息 |
| RecruitCheckException | ✅ | 异常指定 | 异常自带消息 |
| RecruitRuntimeException | ✅ | 异常指定 | I18n消息 |
| RecruitRemoteException | ✅ | 异常指定 | I18n消息 |
| RecruitForbiddenException | ✅ | 异常指定 | I18n消息 |
| Exception（兜底） | ✅ | 500 | I18n消息 |

**核心逻辑示例**:

#### 参数校验异常处理
```java
@ResponseStatus(HttpStatus.OK)
@ExceptionHandler(MethodArgumentNotValidException.class)
public Result<String> methodArgumentNotValidException(MethodArgumentNotValidException ex) {
    log.error("错误拦截:", ex);
    Result<String> result = Result.error(HttpStatus.INTERNAL_SERVER_ERROR);
    return result.setMessage(errorMessage(ex.getBindingResult()));
}
```

#### 自定义异常处理
```java
@ResponseStatus(HttpStatus.OK)
@ExceptionHandler(RecruitCheckException.class)
public Result<String> recruitCheckException(RecruitCheckException ex) {
    exceptionAdvice.advice(ex);  // 触发异常通知
    Result<String> result = new Result<>();
    result.setCode(ex.getCode()).setSuccess(Boolean.FALSE);
    return result.setMessage(ex.message());
}
```

#### Feign解码异常处理
```java
@ResponseStatus(HttpStatus.OK)
@ExceptionHandler(DecodeException.class)
public Result<?> handleDecodeException(DecodeException ex) {
    Throwable cause = ex.getCause();
    Result<?> result = Result.error(HttpStatus.INTERNAL_SERVER_ERROR);
    if (cause instanceof RecruitCheckException) {
        RecruitCheckException check = (RecruitCheckException) cause;
        exceptionAdvice.advice(check);
        return result.setCode(check.getCode()).setMessage(check.message());
    }
    exceptionAdvice.advice(ex);
    return result.setMessage(I18nUtil.getMessage(CommonErrorCode.Internal_Server_Error));
}
```

**错误消息提取逻辑**:

```java
private String errorMessage(BindingResult bindingResult) {
    if (CollectionUtils.isEmpty(bindingResult.getAllErrors())) 
        return CharacterConstants.EMPTY;
    
    ObjectError result = bindingResult.getAllErrors().get(0);
    if (!(result instanceof FieldError)) 
        return result.getDefaultMessage();
    
    ConstraintViolationImpl violation = constraintViolation(result);
    
    // 优先使用I18n消息模板
    if (Objects.nonNull(violation)
            && !StringUtils.isEmpty(violation.getMessageTemplate())
            && !violation.getMessageTemplate().contains("validation")) {
        String template = violation.getMessageTemplate();
        return I18nUtil.getMessage(template);
    }
    
    // 否则使用字段名 + 默认消息
    FieldError fieldError = (FieldError) result;
    String fieldName = bindingResult.getTarget().getClass().getName();
    fieldName += CharacterConstants.POINT + fieldError.getField();
    return I18nUtil.getMessage(fieldName) + result.getDefaultMessage();
}
```

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Spring MVC**: @RestControllerAdvice全局异常处理
- **Bean Validation**: 处理@Valid参数校验异常
- **I18n国际化**: 使用I18nUtil支持多语言错误消息
- **Spring Cloud Feign**: 处理Feign解码异常

### 3.2 设计模式
- **责任链模式**: 通过@ExceptionHandler顺序处理异常
- **策略模式**: 不同异常类型使用不同处理策略
- **模板方法模式**: errorMessage方法提取公共逻辑

### 3.3 关键特性
1. **统一响应**: 所有异常都返回Result&lt;T&gt;格式
2. **HTTP 200**: 所有异常都返回200状态码，错误信息在Result.code中
3. **I18n支持**: 支持多语言错误消息
4. **Advice集成**: 关键异常会触发exceptionAdvice通知
5. **优先级控制**: @Order(Ordered.HIGHEST_PRECEDENCE >> 4)确保优先处理

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：所有异常返回200状态码，错误信息在Result中
@ResponseStatus(HttpStatus.OK)
@ExceptionHandler(CustomException.class)
public Result<String> customException(CustomException ex) {
    exceptionAdvice.advice(ex);
    return Result.error(ex.getCode()).setMessage(ex.getMessage());
}

// ❌ 不推荐做法：返回非200状态码
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)  // 不推荐
@ExceptionHandler(CustomException.class)
public Result<String> customException(CustomException ex) {
    return Result.error(500).setMessage(ex.getMessage());
}
```

### 4.2 参数校验建议

```java
// ✅ 推荐：使用I18n消息模板
public class UserDTO {
    @NotBlank(message = "user.name.not.blank")  // I18n key
    private String name;
}

// ❌ 不推荐：硬编码中文消息
public class UserDTO {
    @NotBlank(message = "用户名不能为空")  // 不支持多语言
    private String name;
}
```

### 4.3 Feign异常处理

```java
// ✅ 推荐：在Decoder中抛出RecruitCheckException
public class CustomDecoder implements Decoder {
    @Override
    public Object decode(Response response, Type type) {
        if (response.status() != 200) {
            throw new RecruitCheckException("remote.call.failed");
        }
        // decode logic
    }
}

// GlobalAdviceController会正确处理此异常
```

### 4.4 常见问题

**问题1**: 参数校验异常消息为英文
- **原因**: 未配置I18n消息文件
- **解决**: 在messages.properties中添加对应字段的I18n消息

**问题2**: 异常未触发邮件通知
- **原因**: 未调用exceptionAdvice.advice(ex)
- **解决**: 在@ExceptionHandler方法中添加exceptionAdvice.advice(ex)调用

**问题3**: DecodeException未正确处理
- **原因**: Decoder中抛出的异常未继承RecruitCheckException
- **解决**: 在Decoder中抛出RecruitCheckException或其子类

**问题4**: ClientAbortException导致大量日志
- **原因**: 客户端断开连接是正常情况
- **解决**: ClientAbortException不调用exceptionAdvice，直接返回成功

---

## 📚 相关文档

- [Advice索引](./advice.md) - OAMessageExceptionAdvice和CloudMessageExceptionAdvice
- [Configuration索引](./configuration.md) - RequestErrorConfiguration配置类
- [Bean对象索引](./bean.md) - RequestErrorBean详细信息

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有异常处理方法 | v1.0 |

---
