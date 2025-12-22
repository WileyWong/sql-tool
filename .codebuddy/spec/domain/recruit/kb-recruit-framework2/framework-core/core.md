# 核心类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目核心类的完整索引，包含所有字段类型和公共方法  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.core`  
> **文件总数**: 7个

---

## 📑 目录

- [一、核心类概览](#一核心类概览)
- [二、Result响应类](#二result响应类)
- [三、错误处理接口](#三错误处理接口)
- [四、分页支持类](#四分页支持类)
- [五、异步上下文传递](#五异步上下文传递)
- [六、缓存Key接口](#六缓存key接口)

---

## 一、核心类概览

### 1.1 核心类分类

| 类型 | 数量 | 说明 |
|------|------|------|
| **响应封装** | 1 | Result - 统一响应结果封装 |
| **错误处理** | 2 | ErrorCode接口, IExceptionAdvice接口 |
| **分页支持** | 1 | Paging - 分页结果封装 |
| **异步支持** | 2 | RecruitCallable, RecruitRunnable |
| **缓存接口** | 1 | IRecruitRedisKey - Redis Key生成 |

---

## 二、Result响应类

### 2.1 Result<T> - 统一响应结果

**类路径**: `com.tencent.hr.recruit.center.framework.core.Result`

**功能描述**: 统一API响应结果封装，支持泛型数据类型

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| code | String | 响应状态码 |
| message | String | 响应消息 |
| requestId | String | 请求消息ID（TraceId） |
| success | Boolean | 状态标识（是否成功） |
| data | T | 返回数据（泛型） |

**公共方法** (5个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `static <T> Result<T> success()` | Result\<T\> | 创建成功响应（无数据） |
| `static <T> Result<T> success(T data)` | Result\<T\> | 创建成功响应（带数据） |
| `static <T> Result<T> error(HttpStatus httpStatus)` | Result\<T\> | 根据HTTP状态创建错误响应 |
| `static <T> Result<T> error(Integer httpStatus, String message)` | Result\<T\> | 创建错误响应 |
| `boolean isSuccess()` | boolean | 判断是否成功 |

**继承方法**:
- 使用 `@Data` 和 `@Accessors(chain = true)` 注解
- 所有字段的 getter/setter 方法
- 支持链式调用

**特性**:
- 自动设置TraceId到requestId字段
- 使用 `@JsonInclude(JsonInclude.Include.NON_NULL)` 忽略null字段
- 支持Swagger文档注解

**使用示例**:
```java
// 成功响应
Result<User> result = Result.success(user);

// 成功响应（无数据）
Result<Void> result = Result.success();

// 错误响应
Result<Void> result = Result.error(HttpStatus.BAD_REQUEST);
Result<Void> result = Result.error(400, "参数错误");

// 判断结果
if (result.isSuccess()) {
    User user = result.getData();
}
```

---

## 三、错误处理接口

### 3.1 ErrorCode - 错误码接口

**类路径**: `com.tencent.hr.recruit.center.framework.core.ErrorCode`

**功能描述**: 错误码标准接口定义

**接口方法** (2个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `Integer getCode()` | Integer | 获取错误码 |
| `String getMessage()` | String | 获取错误信息 |

**实现类示例**:
- `CommonErrorCode` - 通用错误码枚举
- 各业务模块自定义错误码枚举

---

### 3.2 IExceptionAdvice - 异常通知接口

**类路径**: `com.tencent.hr.recruit.center.framework.core.IExceptionAdvice`

**功能描述**: 异常发生时的通知处理接口

**接口方法**:

| 方法签名 | 说明 |
|---------|------|
| `void advice(Exception exception)` | 异常通知处理 |

**使用场景**:
- 异常告警
- 异常日志记录
- 异常统计上报

---

## 四、分页支持类

### 4.1 Paging<T> - 分页结果

**类路径**: `com.tencent.hr.recruit.center.framework.core.Paging`

**功能描述**: 分页查询结果封装

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| list | List\<T\> | 数据列表 |
| total | Long | 总记录数 |
| pageNum | Integer | 当前页码 |
| pageSize | Integer | 每页大小 |

**公共方法**:
- 使用 `@Data` 注解，自动生成getter/setter

**使用示例**:
```java
Paging<User> paging = new Paging<>();
paging.setList(userList);
paging.setTotal(100L);
paging.setPageNum(1);
paging.setPageSize(20);
```

---

## 五、异步上下文传递

### 5.1 RecruitCallable<V> - 可调用任务封装

**类路径**: `com.tencent.hr.recruit.center.framework.core.RecruitCallable`

**功能描述**: 封装Callable，支持上下文（如TraceId、租户信息）传递到子线程

**特性**:
- 实现 `Callable<V>` 接口
- 自动传递父线程上下文到子线程
- 保证异步执行时上下文不丢失

**使用场景**:
- 异步任务执行
- 线程池提交任务
- CompletableFuture异步处理

**使用示例**:
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
Future<String> future = executor.submit(new RecruitCallable<>(() -> {
    // 这里可以获取到父线程的TraceId等上下文信息
    return "result";
}));
```

---

### 5.2 RecruitRunnable - 可运行任务封装

**类路径**: `com.tencent.hr.recruit.center.framework.core.RecruitRunnable`

**功能描述**: 封装Runnable，支持上下文传递到子线程

**特性**:
- 实现 `Runnable` 接口
- 自动传递父线程上下文到子线程
- 适用于无返回值的异步任务

**使用示例**:
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.execute(new RecruitRunnable(() -> {
    // 这里可以获取到父线程的上下文信息
    logger.info("async task");
}));
```

---

## 六、缓存Key接口

### 6.1 IRecruitRedisKey - Redis Key生成接口

**类路径**: `com.tencent.hr.recruit.center.framework.core.IRecruitRedisKey`

**功能描述**: 规范Redis Key的生成方式，确保Key的唯一性和可读性

**接口方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `String key()` | String | 生成Redis Key |

**实现规范**:
- 建议格式：`项目名:模块名:业务标识:唯一ID`
- 示例：`recruit:user:info:123456`

**使用示例**:
```java
public enum UserRedisKey implements IRecruitRedisKey {
    USER_INFO {
        @Override
        public String key(Object... args) {
            return String.format("recruit:user:info:%s", args[0]);
        }
    }
}

// 使用
String key = UserRedisKey.USER_INFO.key(userId);
```

---

## 📚 相关文档

- [实体类索引](./entities.md) - 实体类字段列表
- [工具类索引](./utils.md) - 工具类和公共方法
- [异常类索引](./exceptions.md) - 异常处理类
- [缓存实现](./cache.md) - IRecruitCache缓存接口实现

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完善所有类的字段和方法 | v1.1 |
| 2025-11-21 | AI Assistant | 初始创建文档 | v1.0 |

---
