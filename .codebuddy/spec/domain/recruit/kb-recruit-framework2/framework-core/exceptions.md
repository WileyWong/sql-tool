# 异常类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目所有异常类的完整索引，包含所有字段类型和公共方法  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.exception`  
> **文件总数**: 6个

---

## 📑 目录

- [一、异常类概览](#一异常类概览)
- [二、基础运行时异常](#二基础运行时异常)
- [三、业务异常类](#三业务异常类)
- [四、最佳实践](#四最佳实践)

---

## 一、异常类概览

### 1.1 异常类层级关系

```
RuntimeException
├── RecruitRuntimeException (基础运行时异常)
│   ├── RecruitForbiddenException (权限异常)
│   └── RecruitRemoteException (远程调用异常)
├── RecruitCheckException (参数校验异常)
└── RecruitJobTaskRuntimeException (任务异常)
```

### 1.2 异常类分类统计

| 异常分类 | 数量 | 说明 |
|---------|------|------|
| **基础异常** | 1 | RecruitRuntimeException |
| **业务异常** | 3 | Check/Forbidden/Remote |
| **任务异常** | 1 | JobTaskRuntime |
| **接口定义** | 1 | IExceptionHandler |

---

## 二、基础运行时异常

### 2.1 RecruitRuntimeException - 运行时异常基类

**类路径**: `com.tencent.hr.recruit.center.framework.exception.RecruitRuntimeException`

**功能描述**: 招聘中台运行异常基础类，所有业务运行时异常的父类

**实现接口**:
- `ErrorCode` - 错误码接口
- `IExceptionHandler` - 异常处理接口

**字段列表**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| serialVersionUID | long | -4666624284300270667L | 序列化版本号 |
| args | Object[] | - | 消息参数数组 |
| notice | boolean | true | 是否需要通知 |
| code | String | - | 错误码 |
| httpCode | Integer | 500 | HTTP状态码 |

**构造方法** (4个):

| 构造方法签名 | 说明 |
|------------|------|
| `RecruitRuntimeException(String code, Object... args)` | 基础构造，传入错误码和参数 |
| `RecruitRuntimeException(String code, Integer httpCode, Object... args)` | 指定HTTP状态码 |
| `RecruitRuntimeException(ErrorCode code, Object... args)` | 传入ErrorCode枚举 |

**公共方法** (9个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getArgs()` | Object[] | 获取消息参数 |
| `setArgs(Object[] args)` | void | 设置消息参数 |
| `isNotice()` | boolean | 是否需要通知 |
| `getCode()` | String | 获取错误码 |
| `setCode(String code)` | void | 设置错误码 |
| `getHttpCode()` | Integer | 获取HTTP状态码 |
| `code()` | String | 实现ErrorCode接口 |
| `setNotice(Boolean notice)` | RecruitRuntimeException | 设置是否通知（链式调用） |
| `setHttpCode(Integer integer)` | RecruitRuntimeException | 设置HTTP状态码（链式调用） |
| `noticeMessage()` | String | 获取通知消息 |
| `noticeFlag()` | boolean | 获取通知标识 |

**使用示例**:
```java
// 基础使用
throw new RecruitRuntimeException("user.not.found", userId);

// 指定HTTP状态码
throw new RecruitRuntimeException("invalid.param", 400, paramName);

// 使用ErrorCode枚举
throw new RecruitRuntimeException(CommonErrorCode.System_Error, "详细错误");

// 链式调用
throw new RecruitRuntimeException("custom.error")
    .setHttpCode(403)
    .setNotice(false);
```

---

## 三、业务异常类

### 3.1 RecruitCheckException - 参数校验异常

**类路径**: `com.tencent.hr.recruit.center.framework.exception.RecruitCheckException`

**功能描述**: 参数校验异常类，用于处理参数验证失败的情况

**继承关系**: `RuntimeException` → `IExceptionHandler`

**字段列表**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| notice | boolean | true | 是否需要通知 |
| code | String | - | 错误码 |
| message | String | - | 错误消息 |
| httpCode | Integer | 500 | HTTP状态码 |

**构造方法** (3个):

| 构造方法签名 | 说明 |
|------------|------|
| `RecruitCheckException(String code, String message)` | 基础构造 |
| `RecruitCheckException(Integer httpCode, String message)` | 指定HTTP状态码 |
| `RecruitCheckException(ErrorCode code, Object... args)` | 使用ErrorCode枚举 |

**公共方法** (7个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `isNotice()` | boolean | 是否需要通知 |
| `getCode()` | String | 获取错误码 |
| `setCode(String code)` | void | 设置错误码 |
| `setMessage(String message)` | void | 设置错误消息 |
| `getHttpCode()` | Integer | 获取HTTP状态码 |
| `message()` | String | 获取错误消息 |
| `setNotice(Boolean notice)` | RecruitCheckException | 设置是否通知（链式） |
| `setHttpCode(Integer integer)` | RecruitCheckException | 设置HTTP状态码（链式） |
| `noticeMessage()` | String | 获取通知消息 |
| `noticeFlag()` | boolean | 获取通知标识 |

**使用示例**:
```java
// 参数校验失败
throw new RecruitCheckException("param.invalid", "用户ID不能为空");

// 指定HTTP状态码
throw new RecruitCheckException(400, "参数格式错误");

// 使用ErrorCode
throw new RecruitCheckException(CommonErrorCode.Param_Error, fieldName);
```

---

### 3.2 RecruitForbiddenException - 权限异常

**类路径**: `com.tencent.hr.recruit.center.framework.exception.RecruitForbiddenException`

**功能描述**: 权限异常类，用于处理权限验证失败的情况

**继承关系**: `RecruitRuntimeException` → `IExceptionHandler`

**字段列表**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| serialVersionUID | long | -2503251950635546000L | 序列化版本号 |
| notice | boolean | false | 是否需要通知（默认不通知） |

**特性**:
- 自动设置HTTP状态码为 `403 (FORBIDDEN)`
- 默认不触发告警通知

**构造方法** (2个):

| 构造方法签名 | 说明 |
|------------|------|
| `RecruitForbiddenException(String args)` | 传入详细信息 |
| `RecruitForbiddenException()` | 无参构造 |

**公共方法** (3个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `isNotice()` | boolean | 是否需要通知（返回false） |
| `setNotice(boolean notice)` | void | 设置是否通知 |
| `noticeFlag()` | boolean | 获取通知标识 |
| `resultCode()` | String | 返回"403" |

**使用示例**:
```java
// 权限不足
throw new RecruitForbiddenException("无权访问此资源");

// 无参抛出
throw new RecruitForbiddenException();

// 需要告警时
throw new RecruitForbiddenException("敏感操作")
    .setNotice(true);
```

---

### 3.3 RecruitRemoteException - 远程调用异常

**类路径**: `com.tencent.hr.recruit.center.framework.exception.RecruitRemoteException`

**功能描述**: 远程调用异常类，用于处理远程服务调用失败的情况

**继承关系**: `RecruitRuntimeException` → `IExceptionHandler`

**字段列表**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| serialVersionUID | long | -2503251950635546000L | 序列化版本号 |

**特性**:
- 自动设置错误码为 `CommonErrorCode.Remote_Api_Error`
- 默认触发告警通知

**构造方法** (2个):

| 构造方法签名 | 说明 |
|------------|------|
| `RecruitRemoteException(Object args)` | 传入参数 |
| `RecruitRemoteException()` | 无参构造 |

**公共方法** (1个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `noticeFlag()` | boolean | 返回true，表示需要通知 |

**使用示例**:
```java
// 远程服务调用失败
throw new RecruitRemoteException("用户服务调用超时");

// 带服务名称
throw new RecruitRemoteException("user-service: 503 Service Unavailable");

// 无参抛出
throw new RecruitRemoteException();
```

---

### 3.4 RecruitJobTaskRuntimeException - 任务异常

**类路径**: `com.tencent.hr.recruit.center.framework.exception.RecruitJobTaskRuntimeException`

**功能描述**: 任务执行异常类，专门用于JobTask任务执行失败的场景

**继承关系**: `RuntimeException`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| serialVersionUID | long | 序列化版本号 |
| dataKey | String | 任务数据Key |
| dataValue | String | 任务数据Value |
| jobException | String | 任务异常信息 |
| notice | boolean | 是否需要通知 |

**构造方法** (1个):

| 构造方法签名 | 说明 |
|------------|------|
| `RecruitJobTaskRuntimeException(String dataKey, String dataValue, Exception exception)` | 封装任务异常 |

**公共方法** (5个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getDataKey()` | String | 获取任务Key |
| `getDataValue()` | String | 获取任务Value |
| `getJobException()` | String | 获取异常信息 |
| `isNotice()` | boolean | 是否需要通知 |
| `setNotice(Boolean notice)` | RecruitJobTaskRuntimeException | 设置是否通知（链式） |

**特性**:
- 自动记录异常日志：`JobTask异常：【dataKey】【dataValue】: exception`
- 自动识别 `IExceptionHandler` 类型异常
- 如果原异常实现了 `IExceptionHandler`，则使用其 `noticeMessage()` 和 `noticeFlag()`
- 否则使用异常类名作为 `jobException`

**使用示例**:
```java
try {
    // 执行任务逻辑
    processData(data);
} catch (Exception e) {
    throw new RecruitJobTaskRuntimeException("userId", "12345", e);
}

// 不需要告警时
throw new RecruitJobTaskRuntimeException("orderId", "67890", exception)
    .setNotice(false);
```

---

## 四、最佳实践

### 4.1 异常使用场景

| 场景 | 推荐异常 | HTTP状态码 | 是否告警 |
|------|---------|-----------|---------|
| 参数校验失败 | RecruitCheckException | 400 | 否 |
| 权限不足 | RecruitForbiddenException | 403 | 否 |
| 远程服务调用失败 | RecruitRemoteException | 500 | 是 |
| 通用业务异常 | RecruitRuntimeException | 500 | 是 |
| 任务执行失败 | RecruitJobTaskRuntimeException | 500 | 是 |

### 4.2 异常处理示例

#### 示例1: Controller层参数校验
```java
@RestController
public class UserController {
    
    @PostMapping("/user/create")
    public Result<User> createUser(@RequestBody UserDTO dto) {
        if (dto.getUserId() == null) {
            throw new RecruitCheckException(400, "用户ID不能为空");
        }
        if (StringUtils.isBlank(dto.getUsername())) {
            throw new RecruitCheckException("param.invalid", "用户名不能为空");
        }
        // 业务逻辑
    }
}
```

#### 示例2: Service层业务校验
```java
@Service
public class ResumeService {
    
    public Resume getResumeById(Long resumeId) {
        Resume resume = resumeMapper.selectById(resumeId);
        if (resume == null) {
            throw new RecruitRuntimeException("resume.not.found", resumeId);
        }
        return resume;
    }
    
    public void deleteResume(Long resumeId, Long userId) {
        Resume resume = getResumeById(resumeId);
        if (!resume.getCreateBy().equals(userId)) {
            throw new RecruitForbiddenException("无权删除他人简历");
        }
        resumeMapper.deleteById(resumeId);
    }
}
```

#### 示例3: Feign远程调用
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/user/{userId}")
    Result<User> getUserById(@PathVariable Long userId);
}

@Service
public class UserRemoteService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public User getUserById(Long userId) {
        try {
            Result<User> result = userServiceClient.getUserById(userId);
            if (!result.isSuccess()) {
                throw new RecruitRemoteException("user-service返回失败: " + result.getMessage());
            }
            return result.getData();
        } catch (FeignException e) {
            throw new RecruitRemoteException("user-service调用失败: " + e.getMessage());
        }
    }
}
```

#### 示例4: JobTask异常处理
```java
@Component
public class DataSyncTask {
    
    public void syncUserData(String userId) {
        try {
            // 同步逻辑
            User user = fetchUserFromRemote(userId);
            saveToDatabase(user);
        } catch (Exception e) {
            throw new RecruitJobTaskRuntimeException("userId", userId, e);
        }
    }
}
```

### 4.3 异常告警控制

```java
// 默认告警
throw new RecruitRuntimeException("critical.error");

// 关闭告警
throw new RecruitRuntimeException("expected.error")
    .setNotice(false);

// 权限异常默认不告警
throw new RecruitForbiddenException();

// 远程调用异常默认告警
throw new RecruitRemoteException("服务超时");
```

### 4.4 国际化支持

```java
// 错误码会自动进行国际化
throw new RecruitRuntimeException("user.not.found", userId);

// messages_zh_CN.properties
// user.not.found=用户[{0}]不存在

// messages_en_US.properties  
// user.not.found=User[{0}] not found
```

---

## 📚 相关文档

- [核心类索引](./core.md) - ErrorCode接口和Result类
- [枚举类索引](./enums.md) - CommonErrorCode错误码枚举
- [工具类索引](./utils.md) - I18nUtil国际化工具
- [拦截器索引](./filters-interceptors.md) - 异常拦截处理

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完整列出所有字段、方法和使用示例 | v2.0 |
| 2025-11-21 | AI Assistant | 初始创建文档 | v1.0 |

---
