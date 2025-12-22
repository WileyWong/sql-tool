# 任务接口索引文档

## 概述
本文档索引RecruitCenterJobTaskStarter项目中的任务接口，定义任务的核心方法规范。

---

## 1. IRecruitTask

**包路径**: `com.tencent.hr.recruit.center.job.task`

**功能**: 招聘任务接口，定义任务的执行和回滚方法规范，所有业务任务必须实现此接口

### 接口方法列表

| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| execute(RecruitTaskDTO taskDTO) | JobResult | 执行任务 |
| rollback(RecruitTaskDTO taskDTO) | JobResult | 回滚任务 |

---

## 方法详细说明

### 1. execute方法

**功能**: 执行任务的核心业务逻辑

**参数**:
- `taskDTO`: 任务数据传输对象，包含任务执行所需的所有信息

**返回**: `JobResult` - 任务执行结果
- `success`: true表示执行成功，false表示执行失败
- `message`: 执行结果消息
- `data`: 执行结果数据（可选）
- `taskId`: 任务ID

**方法签名**:
```java
JobResult execute(RecruitTaskDTO taskDTO);
```

**实现要求**:
1. 必须是幂等操作（多次执行结果一致）
2. 必须返回JobResult对象
3. 成功时返回`JobResult.success()`
4. 失败时返回`JobResult.failure()`
5. 不应抛出未捕获的异常

---

### 2. rollback方法

**功能**: 回滚任务，撤销execute方法的操作

**参数**:
- `taskDTO`: 任务数据传输对象

**返回**: `JobResult` - 回滚结果

**方法签名**:
```java
JobResult rollback(RecruitTaskDTO taskDTO);
```

**实现要求**:
1. 必须能够撤销execute的所有操作
2. 必须是幂等操作
3. 成功时返回`JobResult.success()`
4. 失败时返回`JobResult.failure()`
5. 如果无需回滚，返回成功结果即可

---

## 任务实现规范

### 1. 任务类定义
```java
@Component
@RecruitTask(name = "sendNotificationTask", desc = "发送通知任务")
public class SendNotificationTask implements IRecruitTask {
    
    @Override
    public JobResult execute(RecruitTaskDTO taskDTO) {
        // 执行任务
        return JobResult.success("通知发送成功");
    }
    
    @Override
    public JobResult rollback(RecruitTaskDTO taskDTO) {
        // 回滚任务
        return JobResult.success("通知回滚成功");
    }
}
```

### 2. 任务命名规范
- 使用@Component注册为Spring Bean
- 使用@RecruitTask注解标识任务
- Bean名称应与任务名称一致（建议）
- 任务名称使用驼峰命名法

---

## 任务执行上下文

### 1. 获取任务信息
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 获取任务ID
    Long taskId = taskDTO.getId();
    
    // 获取任务名称
    String taskName = taskDTO.getTaskName();
    
    // 获取作业ID
    Long jobId = taskDTO.getJobId();
    
    // 获取任务参数
    Map<String, Object> params = taskDTO.getParams();
    
    // 执行任务
    return JobResult.success();
}
```

### 2. 使用上下文信息
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 从上下文获取作业信息
    RecruitJobDTO jobDTO = RecruitJobContext.getJobContext();
    String businessId = jobDTO.getBusinessId();
    
    // 从上下文获取任务信息
    RecruitTaskDTO contextTaskDTO = RecruitJobContext.getTaskContext();
    
    // 执行任务
    return JobResult.success();
}
```

---

## 任务参数传递

### 1. 通过taskDTO传递参数
```java
// 设置任务参数
Map<String, Object> params = new HashMap<>();
params.put("recipientEmail", "user@example.com");
params.put("emailTemplate", "approval-notification");
taskDTO.setParams(params);

// 在任务中获取参数
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    Map<String, Object> params = taskDTO.getParams();
    String recipientEmail = (String) params.get("recipientEmail");
    String emailTemplate = (String) params.get("emailTemplate");
    
    // 使用参数执行任务
    sendEmail(recipientEmail, emailTemplate);
    
    return JobResult.success();
}
```

### 2. 通过作业参数传递
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 从作业上下文获取参数
    RecruitJobDTO jobDTO = RecruitJobContext.getJobContext();
    Map<String, Object> jobParams = jobDTO.getParams();
    
    String businessType = (String) jobParams.get("businessType");
    
    // 使用参数执行任务
    processBusinessType(businessType);
    
    return JobResult.success();
}
```

---

## 任务实现示例

### 1. 发送通知任务
```java
@Component
@RecruitTask(name = "sendNotificationTask", desc = "发送审批通知")
@Slf4j
public class SendNotificationTask implements IRecruitTask {
    
    @Autowired
    private NotificationService notificationService;
    
    @Override
    public JobResult execute(RecruitTaskDTO taskDTO) {
        try {
            // 获取参数
            Map<String, Object> params = taskDTO.getParams();
            String recipientId = (String) params.get("recipientId");
            String message = (String) params.get("message");
            
            // 发送通知
            notificationService.send(recipientId, message);
            
            log.info("通知发送成功: taskId={}, recipientId={}", 
                taskDTO.getId(), recipientId);
            
            return JobResult.success("通知发送成功");
            
        } catch (Exception e) {
            log.error("通知发送失败: taskId={}", taskDTO.getId(), e);
            return JobResult.failure("通知发送失败", e);
        }
    }
    
    @Override
    public JobResult rollback(RecruitTaskDTO taskDTO) {
        // 通知发送通常不需要回滚
        log.info("通知任务无需回滚: taskId={}", taskDTO.getId());
        return JobResult.success("通知任务无需回滚");
    }
}
```

### 2. 数据更新任务
```java
@Component
@RecruitTask(name = "updateDataTask", desc = "更新数据任务")
@Slf4j
public class UpdateDataTask implements IRecruitTask {
    
    @Autowired
    private DataService dataService;
    
    private Map<String, Object> originalData = new ConcurrentHashMap<>();
    
    @Override
    @Transactional
    public JobResult execute(RecruitTaskDTO taskDTO) {
        try {
            // 获取参数
            Long dataId = (Long) taskDTO.getParams().get("dataId");
            String newStatus = (String) taskDTO.getParams().get("newStatus");
            
            // 备份原始数据
            Object original = dataService.getData(dataId);
            originalData.put(taskDTO.getId().toString(), original);
            
            // 更新数据
            dataService.updateStatus(dataId, newStatus);
            
            log.info("数据更新成功: taskId={}, dataId={}", taskDTO.getId(), dataId);
            
            return JobResult.success("数据更新成功");
            
        } catch (Exception e) {
            log.error("数据更新失败: taskId={}", taskDTO.getId(), e);
            return JobResult.failure("数据更新失败", e);
        }
    }
    
    @Override
    @Transactional
    public JobResult rollback(RecruitTaskDTO taskDTO) {
        try {
            // 获取原始数据
            String taskIdKey = taskDTO.getId().toString();
            Object original = originalData.get(taskIdKey);
            
            if (original != null) {
                // 恢复数据
                Long dataId = (Long) taskDTO.getParams().get("dataId");
                dataService.restoreData(dataId, original);
                
                // 清除备份
                originalData.remove(taskIdKey);
                
                log.info("数据回滚成功: taskId={}", taskDTO.getId());
                return JobResult.success("数据回滚成功");
            } else {
                log.warn("未找到备份数据: taskId={}", taskDTO.getId());
                return JobResult.success("无需回滚");
            }
            
        } catch (Exception e) {
            log.error("数据回滚失败: taskId={}", taskDTO.getId(), e);
            return JobResult.failure("数据回滚失败", e);
        }
    }
}
```

### 3. 调用第三方API任务
```java
@Component
@RecruitTask(name = "callExternalApiTask", desc = "调用第三方API")
@Slf4j
public class CallExternalApiTask implements IRecruitTask {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Override
    public JobResult execute(RecruitTaskDTO taskDTO) {
        try {
            // 获取参数
            String apiUrl = (String) taskDTO.getParams().get("apiUrl");
            Map<String, Object> requestBody = 
                (Map<String, Object>) taskDTO.getParams().get("requestBody");
            
            // 调用API
            ResponseEntity<String> response = restTemplate.postForEntity(
                apiUrl, 
                requestBody, 
                String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("API调用成功: taskId={}, url={}", taskDTO.getId(), apiUrl);
                return JobResult.success("API调用成功", response.getBody());
            } else {
                log.error("API调用失败: taskId={}, status={}", 
                    taskDTO.getId(), response.getStatusCode());
                return JobResult.failure("API调用失败: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("API调用异常: taskId={}", taskDTO.getId(), e);
            return JobResult.failure("API调用异常", e);
        }
    }
    
    @Override
    public JobResult rollback(RecruitTaskDTO taskDTO) {
        // 调用回滚API（如果支持）
        try {
            String rollbackUrl = (String) taskDTO.getParams().get("rollbackUrl");
            if (rollbackUrl != null) {
                restTemplate.postForEntity(rollbackUrl, null, String.class);
                log.info("API回滚成功: taskId={}", taskDTO.getId());
                return JobResult.success("API回滚成功");
            } else {
                log.info("无回滚API: taskId={}", taskDTO.getId());
                return JobResult.success("无需回滚");
            }
        } catch (Exception e) {
            log.error("API回滚失败: taskId={}", taskDTO.getId(), e);
            return JobResult.failure("API回滚失败", e);
        }
    }
}
```

---

## 任务执行流程

### 1. 正常执行流程
```
1. RecruitTaskOperation.executeTask(taskDTO)
2. 查找任务Bean (IRecruitTask)
3. 设置任务上下文
4. 调用 task.execute(taskDTO)
5. 更新任务状态为SUCCESS
6. 返回JobResult
```

### 2. 执行失败流程
```
1. task.execute(taskDTO) 返回失败结果
2. 更新任务状态为FAILED
3. 记录错误消息
4. 返回JobResult（失败）
```

### 3. 回滚流程
```
1. 作业执行失败
2. 逆序遍历已执行的任务
3. 调用 task.rollback(taskDTO)
4. 更新任务状态
5. 返回JobResult
```

---

## 最佳实践

### 1. 幂等性设计
确保任务可以安全地多次执行：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 检查是否已执行
    if (isAlreadyExecuted(taskDTO.getId())) {
        return JobResult.success("任务已执行");
    }
    
    // 执行任务
    performTask();
    
    // 标记已执行
    markAsExecuted(taskDTO.getId());
    
    return JobResult.success();
}
```

### 2. 事务管理
使用@Transactional确保数据一致性：
```java
@Override
@Transactional(rollbackFor = Exception.class)
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 数据库操作
    return JobResult.success();
}
```

### 3. 异常处理
捕获并处理所有异常：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    try {
        // 执行任务
        return JobResult.success();
    } catch (BusinessException e) {
        log.error("业务异常", e);
        return JobResult.failure(e.getMessage());
    } catch (Exception e) {
        log.error("系统异常", e);
        return JobResult.failure("系统异常", e);
    }
}
```

### 4. 日志记录
记录关键操作日志：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    log.info("开始执行任务: taskId={}, taskName={}", 
        taskDTO.getId(), taskDTO.getTaskName());
    
    try {
        // 执行任务
        log.info("任务执行成功: taskId={}", taskDTO.getId());
        return JobResult.success();
    } catch (Exception e) {
        log.error("任务执行失败: taskId={}", taskDTO.getId(), e);
        return JobResult.failure(e.getMessage());
    }
}
```

### 5. 参数验证
验证必需的参数：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    // 参数验证
    if (taskDTO.getParams() == null) {
        return JobResult.failure("任务参数不能为空");
    }
    
    String requiredParam = (String) taskDTO.getParams().get("requiredParam");
    if (requiredParam == null) {
        return JobResult.failure("缺少必需参数: requiredParam");
    }
    
    // 执行任务
    return JobResult.success();
}
```

---

## 注意事项

### 1. 线程安全
- 任务实例是单例的，确保线程安全
- 避免使用实例变量存储任务状态
- 使用ThreadLocal或方法局部变量

### 2. 超时控制
设置合理的超时时间：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    Future<?> future = executor.submit(() -> {
        // 执行任务
    });
    
    try {
        future.get(30, TimeUnit.SECONDS);
        return JobResult.success();
    } catch (TimeoutException e) {
        future.cancel(true);
        return JobResult.failure("任务执行超时");
    }
}
```

### 3. 资源释放
确保资源被正确释放：
```java
@Override
public JobResult execute(RecruitTaskDTO taskDTO) {
    InputStream is = null;
    try {
        is = openResource();
        // 执行任务
        return JobResult.success();
    } finally {
        if (is != null) {
            is.close();
        }
    }
}
```

### 4. 回滚支持
设计可回滚的任务：
```java
// 不可回滚的任务（如发送邮件）
@Override
public JobResult rollback(RecruitTaskDTO taskDTO) {
    return JobResult.success("无需回滚");
}

// 可回滚的任务（如数据库操作）
@Override
public JobResult rollback(RecruitTaskDTO taskDTO) {
    // 撤销操作
    return JobResult.success("回滚成功");
}
```

---

*文档生成时间: 2025-11-21*
*源码版本: RecruitCenterJobTaskStarter v1.0*
