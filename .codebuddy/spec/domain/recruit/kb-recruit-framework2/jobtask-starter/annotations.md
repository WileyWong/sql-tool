# 注解索引文档

> **文档说明**: 本文档为 `RecruitCenterJobTaskStarter` 项目 `annotations` 包下所有注解的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.job.annotations`  
> **文件总数**: 4个

---

## 📑 目录

- [一、注解概览](#一注解概览)
- [二、注解详细清单](#二注解详细清单)
- [三、使用示例](#三使用示例)

---

## 一、注解概览

### 1.1 注解分类

| 分类 | 注解名称 | 作用对象 | 核心功能 |
|------|---------|---------|---------|
| **Job标识** | `@RecruitJob` | 方法 | 标识一个Job方法 |
| **Task标识** | `@RecruitTask` | 方法 | 标识Job中的Task列表 |
| **Service标识** | `@RecruitJobService` | 类/接口 | 标识JobService接口 |
| **扫描器** | `@RecruitJobScanner` | 类 | 启用Job服务扫描 |

### 1.2 注解关系图

```mermaid
graph TB
    A[@RecruitJobScanner] -->|扫描| B[@RecruitJobService]
    B -->|包含| C[@RecruitJob]
    C -->|配置| D[@RecruitTask.List]
    D -->|包含多个| E[@RecruitTask]
```

---

## 二、注解详细清单

### 2.1 @RecruitJob

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.job.annotations.RecruitJob`
- **作用范围**: 方法级注解 (`@Target(ElementType.METHOD)`)
- **保留策略**: 运行时 (`@Retention(RetentionPolicy.RUNTIME)`)

**字段定义**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `value` | String | `""` | Job名称（可选） |

**源码**:
```java
@Documented
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RecruitJob {
    String value() default "";
}
```

**使用场景**:
- 标识一个Job方法
- 如果未指定value，则使用方法名作为Job名称

---

### 2.2 @RecruitTask

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.job.annotations.RecruitTask`
- **作用范围**: 方法级注解 (`@Target(ElementType.METHOD)`)
- **保留策略**: 运行时 (`@Retention(RetentionPolicy.RUNTIME)`)

**字段定义**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `value` | `Class<? extends IRecruitTask<?>>` | 必填 | Task实现类 |
| `type` | `RecruitTaskType` | `RecruitTaskType.Sync` | Task类型（同步/异步） |

**源码**:
```java
@Documented
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RecruitTask {

    Class<? extends IRecruitTask<?>> value();

    RecruitTaskType type() default RecruitTaskType.Sync;


    @Documented
    @Target({ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
        RecruitTask[] value();
    }
}
```

**公共方法**:
- 无（纯注解，无方法）

**内部注解 @RecruitTask.List**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `value` | `RecruitTask[]` | Task注解数组 |

**使用场景**:
- 配置Job中的Task列表
- 指定Task类型（同步/异步）
- 通过`@RecruitTask.List`支持多个Task

---

### 2.3 @RecruitJobService

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.job.annotations.RecruitJobService`
- **作用范围**: 类级注解 (`@Target(ElementType.TYPE)`)
- **保留策略**: 运行时 (`@Retention(RetentionPolicy.RUNTIME)`)

**字段定义**:
- 无字段

**源码**:
```java
@Documented
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RecruitJobService {
}
```

**使用场景**:
- 标识JobService接口
- 被扫描器识别并自动注册为Spring Bean

---

### 2.4 @RecruitJobScanner

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.job.annotations.RecruitJobScanner`
- **作用范围**: 类级注解 (`@Target(ElementType.TYPE)`)
- **保留策略**: 运行时 (`@Retention(RetentionPolicy.RUNTIME)`)
- **元注解**: `@EnableKafka`, `@Import(RecruitJobServiceRegistrar.class)`

**字段定义**:

| 字段名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `value` | `String[]` | `{}` | 扫描的包路径 |

**源码**:
```java
@Documented
@EnableKafka
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Import(RecruitJobServiceRegistrar.class)
public @interface RecruitJobScanner {
    String[] value() default {};
}
```

**核心特性**:
- ✅ 自动启用Kafka (`@EnableKafka`)
- ✅ 导入注册器 (`@Import(RecruitJobServiceRegistrar.class)`)
- ✅ 支持自定义扫描包路径

**使用场景**:
- 在主配置类上标注，启用Job服务扫描
- 如果未指定扫描路径，则扫描标注类所在包

---

## 三、使用示例

### 3.1 完整示例

```java
// 1. 启用Job扫描
@SpringBootApplication
@RecruitJobScanner({"com.example.job"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// 2. 定义JobService
@RecruitJobService
public interface DemoJobService extends IRecruitJobService {
    
    @RecruitJob("订单处理Job")
    @RecruitTask.List({
        @RecruitTask(value = ValidateTask.class, type = RecruitTaskType.Sync),
        @RecruitTask(value = SaveTask.class, type = RecruitTaskType.Sync),
        @RecruitTask(value = NotifyTask.class, type = RecruitTaskType.Async)
    })
    void processOrder(String dataKey, String operator, OrderRequest request);
}

// 3. 实现Task
@Component
public class ValidateTask implements IRecruitTask<OrderRequest> {
    @Override
    public void process(RecruitJobContext<OrderRequest> context) {
        // 校验逻辑
    }
    
    @Override
    public void rollback(RecruitJobContext<OrderRequest> context) {
        // 回滚逻辑
    }
}
```

### 3.2 注解配置说明

**同步Task**:
```java
@RecruitTask(value = SaveTask.class, type = RecruitTaskType.Sync)
```
- 顺序执行
- 失败会触发回滚
- 执行完成后才触发异步Task

**异步Task**:
```java
@RecruitTask(value = NotifyTask.class, type = RecruitTaskType.Async)
```
- 通过MQ异步触发
- 不阻塞主流程
- 失败不影响其他Task

---

## 📚 相关文档

- [项目结构](./project-structure.md) - 项目整体结构
- [核心类索引](./core.md) - RecruitJobOperation等核心类
- [任务接口索引](./tasks.md) - IRecruitTask接口详解
- [注册器索引](./registrar.md) - RecruitJobServiceRegistrar实现

---

*本文档由AI自动生成，最后更新时间: 2025-11-21*
