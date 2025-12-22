# 枚举类索引文档

> **文档说明**: 本文档为 `RecruitCenterJobTaskStarter` 项目 `enums` 包下所有枚举类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.job.enums`  
> **文件总数**: 6个

---

## 📑 目录

- [一、枚举概览](#一枚举概览)
- [二、枚举详细清单](#二枚举详细清单)
- [三、枚举使用说明](#三枚举使用说明)

---

## 一、枚举概览

### 1.1 枚举分类

| 分类 | 枚举类 | 枚举数量 | 核心用途 |
|------|-------|---------|---------|
| **Job状态** | `RecruitJobStatus` | 4个 | Job执行状态 |
| **Task状态** | `RecruitTaskStatus` | 3个 | Task执行状态 |
| **回滚状态** | `RecruitBackStatus` | 4个 | Task回滚状态 |
| **回滚结果** | `RecruitRollbackStatus` | 3个 | 回滚执行结果 |
| **Task类型** | `RecruitTaskType` | 2个 | 同步/异步 |
| **事件类型** | `RecruitJobEventType` | 5个 | 消息事件类型 |

---

## 二、枚举详细清单

### 2.1 RecruitJobStatus - Job状态

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitJobStatus`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `SUCCESS` | 0 | Job执行成功 |
| `START` | 1 | Job开始执行 |
| `FAIL` | 2 | Job执行失败 |
| `STOP` | 3 | Job停止执行 |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 状态值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取状态值 |
| `valueOf(Integer status)` | RecruitJobStatus | 根据状态值获取枚举（静态方法） |

**源码**:
```java
@AllArgsConstructor
public enum RecruitJobStatus {
    SUCCESS(0),
    START(1),
    FAIL(2),
    STOP(3);

    @Getter
    private final int value;

    public static RecruitJobStatus valueOf(Integer status) {
        Stream<RecruitJobStatus> stream = Stream.of(RecruitJobStatus.values());
        Optional<RecruitJobStatus> result = stream.filter(v -> v.value == status).findFirst();
        if (result.isPresent()) return result.get();
        return null;
    }
}
```

---

### 2.2 RecruitTaskStatus - Task状态

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitTaskStatus`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `SUCCESS` | 0 | Task执行成功 |
| `START` | 1 | Task开始执行 |
| `FAIL` | 2 | Task执行失败 |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 状态值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取状态值 |
| `valueOf(Integer status)` | RecruitTaskStatus | 根据状态值获取枚举 |

**源码**:
```java
@AllArgsConstructor
public enum RecruitTaskStatus {
    SUCCESS(0),
    START(1),
    FAIL(2);

    @Getter
    private final int value;

    public static RecruitTaskStatus valueOf(Integer status) {
        Stream<RecruitTaskStatus> stream = Stream.of(RecruitTaskStatus.values());
        Optional<RecruitTaskStatus> result = stream.filter(v -> v.value == status).findFirst();
        if (result.isPresent()) return result.get();
        return null;
    }
}
```

---

### 2.3 RecruitBackStatus - 回滚状态

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitBackStatus`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `Undo` | -1 | 无需回滚 |
| `SUCCESS` | 0 | 回滚成功 |
| `START` | 1 | 开始回滚 |
| `FAIL` | 2 | 回滚失败 |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 状态值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取状态值 |

**源码**:
```java
@RequiredArgsConstructor
public enum RecruitBackStatus {
    Undo(-1),
    SUCCESS(0),
    START(1),
    FAIL(2);

    @Getter
    private final int value;
}
```

---

### 2.4 RecruitRollbackStatus - 回滚结果状态

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitRollbackStatus`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `UNDO` | 0 | 未回滚 |
| `SUCCESS` | 1 | 回滚成功 |
| `FAIL` | 2 | 回滚失败 |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 状态值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取状态值 |
| `valueOf(Integer status)` | RecruitRollbackStatus | 根据状态值获取枚举 |

**源码**:
```java
@AllArgsConstructor
public enum RecruitRollbackStatus {
    UNDO(0),
    SUCCESS(1),
    FAIL(2);

    @Getter
    private final int value;

    public static RecruitRollbackStatus valueOf(Integer status) {
        Stream<RecruitRollbackStatus> stream = Stream.of(RecruitRollbackStatus.values());
        Optional<RecruitRollbackStatus> result = stream.filter(v -> v.value == status).findFirst();
        if (result.isPresent()) return result.get();
        return null;
    }
}
```

---

### 2.5 RecruitTaskType - Task类型

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitTaskType`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `Sync` | 0 | 同步Task |
| `Async` | 1 | 异步Task |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 类型值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取类型值 |
| `valueOf(int type)` | RecruitTaskType | 根据类型值获取枚举 |

**源码**:
```java
@AllArgsConstructor
public enum RecruitTaskType {
    Sync(0), Async(1);

    @Getter
    private final int value;

    public static RecruitTaskType valueOf(int type) {
        Stream<RecruitTaskType> stream = Stream.of(RecruitTaskType.values());
        Optional<RecruitTaskType> result = stream.filter(v -> v.value == type).findFirst();
        if (result.isPresent()) return result.get();
        return null;
    }
}
```

---

### 2.6 RecruitJobEventType - 事件类型

**类路径**: `com.tencent.hr.recruit.center.job.enums.RecruitJobEventType`

**枚举值**:

| 枚举常量 | value值 | 说明 |
|---------|---------|------|
| `Creating` | 0 | 创建Job事件 |
| `Updating` | 1 | 更新Job事件 |
| `Running` | 2 | 执行异步Task事件 |
| `DoRollback` | 3 | 执行回滚事件 |
| `Rollback` | 4 | 回滚结果通知事件 |

**字段**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | int | 事件类型值 |

**公共方法**:

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `getValue()` | int | 获取事件类型值 |
| `valueOf(Integer status)` | RecruitJobEventType | 根据事件类型值获取枚举 |

**源码**:
```java
@RequiredArgsConstructor
public enum RecruitJobEventType {
    Creating(0),
    Updating(1),
    Running(2),
    DoRollback(3),
    Rollback(4),
    ;

    @Getter
    private final int value;

    public static RecruitJobEventType valueOf(Integer status) {
        Stream<RecruitJobEventType> stream = Stream.of(RecruitJobEventType.values());
        Optional<RecruitJobEventType> result = stream.filter(v -> v.value == status).findFirst();
        if (result.isPresent()) return result.get();
        return null;
    }
}
```

---

## 三、枚举使用说明

### 3.1 状态流转图

**Job状态流转**:
```
START(1) → SUCCESS(0)
         → FAIL(2)
         → STOP(3)
```

**Task状态流转**:
```
START(1) → SUCCESS(0)
         → FAIL(2)
```

**回滚状态流转**:
```
Undo(-1)        # 无需回滚
START(1) → SUCCESS(0)
         → FAIL(2)
```

### 3.2 使用示例

```java
// 1. 判断Job状态
if (RecruitJobStatus.valueOf(job.getStatus()) == RecruitJobStatus.SUCCESS) {
    // Job执行成功
}

// 2. 设置Task类型
@RecruitTask(value = DemoTask.class, type = RecruitTaskType.Sync)

// 3. 判断事件类型
if (RecruitJobEventType.valueOf(notice.getEventType()) == RecruitJobEventType.Running) {
    // 执行异步Task
}

// 4. 设置回滚状态
task.setBackStatus(RecruitBackStatus.SUCCESS.getValue());
```

---

## 📚 相关文档

- [项目结构](./project-structure.md) - 项目整体结构
- [DTO索引](./dto.md) - 使用这些枚举的DTO对象
- [核心类索引](./core.md) - Job和Task执行逻辑
- [监听器索引](./listeners.md) - 消息事件处理

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
