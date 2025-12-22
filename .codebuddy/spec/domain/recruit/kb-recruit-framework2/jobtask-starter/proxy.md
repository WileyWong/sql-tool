# 代理类索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的代理类，包括作业服务代理和代理处理器。

---

## 1. RecruitJobProxy

**包路径**: `com.tencent.hr.recruit.center.job.proxy`

**功能**: 招聘作业服务代理，提供作业服务的JDK动态代理创建功能

### 字段列表
无实例字段，所有方法均为静态方法

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| createProxy(Class<?> interfaceClass, RecruitJobOperation jobOperation) | static Object | 创建作业服务的动态代理对象 |
| createProxy(Class<?>[] interfaces, RecruitJobOperation jobOperation) | static Object | 创建多接口的动态代理对象 |

### 注解
- `@Slf4j`: Lombok日志注解

---

## 2. RecruitJobProxyHandler

**包路径**: `com.tencent.hr.recruit.center.job.proxy`

**功能**: 招聘作业代理处理器，实现InvocationHandler接口，拦截并处理代理对象的方法调用

### 字段列表
| 字段名 | 类型 | 说明 |
|--------|------|------|
| jobOperation | RecruitJobOperation | 作业操作核心类 |
| EXECUTE_METHOD | String (static final) | execute方法名常量 |
| ROLLBACK_METHOD | String (static final) | rollback方法名常量 |
| RETRY_METHOD | String (static final) | retry方法名常量 |

### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| RecruitJobProxyHandler(RecruitJobOperation jobOperation) | - | 构造函数 |
| invoke(Object proxy, Method method, Object[] args) | Object | 拦截方法调用 |
| handleExecute(Object[] args) | JobResult (private) | 处理execute方法调用 |
| handleRollback(Object[] args) | JobResult (private) | 处理rollback方法调用 |
| handleRetry(Object[] args) | JobResult (private) | 处理retry方法调用 |
| extractJobId(Object[] args) | Long (private) | 从参数中提取作业ID |
| extractJobDTO(Object[] args) | RecruitJobDTO (private) | 从参数中提取作业DTO |

### 继承关系
- 实现接口: `InvocationHandler`

### 注解
- `@Slf4j`: Lombok日志注解

---

## 代理机制详解

### 1. 代理创建流程
```
1. 调用 RecruitJobProxy.createProxy()
2. 创建 RecruitJobProxyHandler 实例
3. 使用 Proxy.newProxyInstance() 创建代理对象
4. 代理对象实现指定的接口（如IRecruitJobService）
5. 返回代理对象
```

### 2. 方法调用拦截流程
```
1. 用户调用代理对象的方法（如 execute(jobId)）
2. JDK动态代理拦截调用
3. 转发到 RecruitJobProxyHandler.invoke()
4. 根据方法名路由到对应处理方法
5. 调用 RecruitJobOperation 的实际方法
6. 返回 JobResult
```

### 3. 方法路由规则
| 方法名 | 路由目标 | 说明 |
|--------|----------|------|
| execute | handleExecute() | 执行作业 |
| rollback | handleRollback() | 回滚作业 |
| retry | handleRetry() | 重试作业 |
| 其他方法 | 默认处理 | 调用Object类方法或抛出异常 |

---

## 代理架构图

```
IRecruitJobService (接口)
    ↓
Proxy (JDK动态代理)
    ↓
RecruitJobProxyHandler (InvocationHandler)
    ├── invoke(proxy, method, args)
    ├── handleExecute()
    ├── handleRollback()
    └── handleRetry()
        ↓
    RecruitJobOperation (实际执行)
        ├── executeJob()
        ├── rollbackJob()
        └── retryJob()
```

---

## 使用示例

### 1. 创建代理对象
```java
// 方式1: 单接口代理
RecruitJobOperation jobOperation = new RecruitJobOperation(...);
IRecruitJobService jobService = (IRecruitJobService) RecruitJobProxy.createProxy(
    IRecruitJobService.class,
    jobOperation
);

// 方式2: 多接口代理
Class<?>[] interfaces = {IRecruitJobService.class, CustomInterface.class};
Object proxy = RecruitJobProxy.createProxy(interfaces, jobOperation);
```

### 2. 使用代理对象
```java
// 注入代理对象
@Autowired
private IRecruitJobService jobService;

// 调用方法（会被代理拦截）
JobResult result = jobService.execute(jobId);

// 或使用DTO
RecruitJobDTO jobDTO = RecruitJobDTO.builder()
    .id(jobId)
    .build();
JobResult result = jobService.execute(jobDTO);
```

### 3. 自定义代理处理器
```java
public class CustomProxyHandler implements InvocationHandler {
    
    private final RecruitJobOperation jobOperation;
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) {
        // 前置处理
        log.info("方法调用前: {}", method.getName());
        
        // 调用实际方法
        Object result = invokeMethod(method, args);
        
        // 后置处理
        log.info("方法调用后: {}", method.getName());
        
        return result;
    }
}
```

---

## 方法处理详解

### 1. handleExecute方法
**功能**: 处理execute方法调用

**处理流程**:
```java
1. 从参数中提取jobId或jobDTO
2. 判断参数类型
   - 如果是Long: 调用jobOperation.executeJob(jobId)
   - 如果是RecruitJobDTO: 调用jobOperation.executeJob(jobDTO)
3. 返回JobResult
```

**代码示例**:
```java
private JobResult handleExecute(Object[] args) {
    if (args == null || args.length == 0) {
        return JobResult.failure("参数不能为空");
    }
    
    Object arg = args[0];
    if (arg instanceof Long) {
        return jobOperation.executeJob((Long) arg);
    } else if (arg instanceof RecruitJobDTO) {
        return jobOperation.executeJob((RecruitJobDTO) arg);
    } else {
        return JobResult.failure("不支持的参数类型");
    }
}
```

---

### 2. handleRollback方法
**功能**: 处理rollback方法调用

**处理流程**:
```java
1. 从参数中提取jobId或jobDTO
2. 判断参数类型
   - 如果是Long: 调用jobOperation.rollbackJob(jobId)
   - 如果是RecruitJobDTO: 调用jobOperation.rollbackJob(jobDTO)
3. 返回JobResult
```

---

### 3. handleRetry方法
**功能**: 处理retry方法调用

**处理流程**:
```java
1. 从参数中提取jobId或jobDTO
2. 判断参数类型
   - 如果是Long: 调用jobOperation.retryJob(jobId)
   - 如果是RecruitJobDTO: 调用jobOperation.retryJob(jobDTO)
3. 返回JobResult
```

---

## 代理特性

### 1. 透明性
- 用户无需关心代理的存在
- 像使用普通对象一样使用代理对象
- 方法调用自动被拦截和转发

### 2. 灵活性
- 支持单接口和多接口代理
- 可扩展自定义处理逻辑
- 易于添加新的方法拦截规则

### 3. 解耦性
- 接口定义与实现分离
- 业务逻辑与代理逻辑分离
- 便于单元测试和维护

---

## 高级用法

### 1. 添加方法拦截
```java
@Override
public Object invoke(Object proxy, Method method, Object[] args) {
    String methodName = method.getName();
    
    // 添加新的方法拦截
    if ("customMethod".equals(methodName)) {
        return handleCustomMethod(args);
    }
    
    // 原有的方法处理
    if (EXECUTE_METHOD.equals(methodName)) {
        return handleExecute(args);
    }
    
    // 默认处理
    return method.invoke(jobOperation, args);
}
```

### 2. 添加切面逻辑
```java
@Override
public Object invoke(Object proxy, Method method, Object[] args) {
    // 前置切面
    long startTime = System.currentTimeMillis();
    log.info("开始执行方法: {}", method.getName());
    
    try {
        // 执行方法
        Object result = invokeMethod(method, args);
        
        // 后置切面
        long endTime = System.currentTimeMillis();
        log.info("方法执行完成: {}, 耗时: {}ms", method.getName(), endTime - startTime);
        
        return result;
    } catch (Exception e) {
        // 异常切面
        log.error("方法执行失败: {}", method.getName(), e);
        return JobResult.failure(e);
    }
}
```

### 3. 参数校验
```java
private JobResult handleExecute(Object[] args) {
    // 参数校验
    if (args == null || args.length == 0) {
        return JobResult.failure("参数不能为空");
    }
    
    Object arg = args[0];
    if (arg instanceof Long) {
        Long jobId = (Long) arg;
        if (jobId == null || jobId <= 0) {
            return JobResult.failure("作业ID无效");
        }
    }
    
    // 执行方法
    return jobOperation.executeJob((Long) arg);
}
```

---

## 最佳实践

### 1. 异常处理
始终捕获并处理异常：
```java
try {
    return jobOperation.executeJob(jobId);
} catch (Exception e) {
    log.error("作业执行异常", e);
    return JobResult.failure("作业执行异常", e);
}
```

### 2. 日志记录
记录关键操作日志：
```java
log.info("代理拦截方法调用: method={}, args={}", method.getName(), args);
```

### 3. 性能监控
添加性能监控：
```java
long startTime = System.currentTimeMillis();
Object result = invokeMethod(method, args);
long duration = System.currentTimeMillis() - startTime;

if (duration > 1000) {
    log.warn("方法执行耗时过长: method={}, duration={}ms", method.getName(), duration);
}
```

### 4. 参数验证
在代理层进行参数验证：
```java
if (!isValidParameter(args)) {
    return JobResult.failure("参数验证失败");
}
```

---

## 注意事项

### 1. 代理限制
- JDK动态代理只能代理接口，不能代理类
- 被代理的方法必须是public的
- final方法无法被代理

### 2. 性能考虑
- 代理会增加少量性能开销
- 避免在代理层进行复杂计算
- 缓存代理对象，避免重复创建

### 3. 类型转换
注意参数类型转换的安全性：
```java
if (arg instanceof Long) {
    Long jobId = (Long) arg;
} else {
    throw new IllegalArgumentException("不支持的参数类型");
}
```

### 4. 方法签名
确保代理方法签名与接口定义一致。

---

## 代理模式优势

### 1. 职责分离
- 接口定义业务契约
- 代理处理横切关注点
- 实现类专注业务逻辑

### 2. 扩展性强
- 易于添加新功能
- 不影响现有代码
- 支持多种代理策略

### 3. 易于测试
- 可独立测试代理逻辑
- 可模拟被代理对象
- 便于单元测试

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
