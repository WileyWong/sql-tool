<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 任务类型：识别 @Scheduled / @XxlJob / Quartz 等调度方式
2. 执行频率：解析 Cron 表达式或 fixedRate/fixedDelay
3. 异步执行：识别 @Async 注解
4. 分布式锁：识别 @DistributedLock 或 Redisson 锁
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 定时任务：@Component + @Scheduled
2. XXL-Job：@XxlJob("handler") + ReturnT<String>
3. 分布式锁：@DistributedLock 或 Redisson 锁
4. 异步执行：@Async("taskExecutor")
5. 日志：记录任务开始、结束、耗时

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Job / Task <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 定时任务总数 | 异步任务数 | 分布式锁任务数 | 依赖服务数 |
|:------------:|:----------:|:--------------:|:----------:|
| {{TOTAL_TASK}} | {{ASYNC_COUNT}} | {{LOCK_COUNT}} | {{SERVICE_COUNT}} |

---

## 📋 任务方法完整列表

> **重要**: 必须列出 Job/Task 中定义的**全部任务方法**，不可遗漏。

### 任务清单

| # | 任务名 | 调度方式 | Cron/频率 | 异步 | 分布式锁 | 说明 |
|:-:|--------|----------|-----------|:----:|:--------:|------|
| 1 | `{{TASK_NAME_1}}` | {{TRIGGER_1}} | `{{CRON_1}}` | {{ASYNC_1}} | {{LOCK_1}} | {{DESC_1}} |
| 2 | `{{TASK_NAME_2}}` | {{TRIGGER_2}} | `{{CRON_2}}` | {{ASYNC_2}} | {{LOCK_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... | ... |

---

### {{TASK_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `@Scheduled({{SCHEDULE_EXPRESSION}}) public void {{TASK_NAME}}()` |
| 调度方式 | {{TRIGGER_ANNOTATION}} |
| 执行频率 | {{FREQUENCY}} |
| Cron 表达式 | `{{CRON_EXPRESSION}}` |
| 异步执行 | {{IS_ASYNC}} |
| 分布式锁 | {{HAS_LOCK}} |
| 超时时间 | {{TIMEOUT}} |
| 失败策略 | {{FAILURE_STRATEGY}} |
| 说明 | {{DESCRIPTION}} |

<!-- 重复以上结构，直到列出全部任务方法 -->

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

---

## 🔙 被依赖方（谁依赖我）

<!-- [可选] Job/Task 通过调度器触发，通常无直接依赖方 -->

| 组件 | 类型 | 说明 |
|------|------|------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLER_DESC}} |

*Job/Task 通过调度器触发，通常无直接依赖方*

**影响分析**: 修改本类主要影响定时任务执行

---

## ⚙️ 配置信息

<!-- [可选] 如无特殊配置，可省略此章节 -->

### 线程池配置

```yaml
{{THREAD_POOL_CONFIG}}
```

### 分布式锁配置

```java
@DistributedLock(key = "{{LOCK_KEY}}", expire = {{LOCK_EXPIRE}})
```

**分布式锁说明**: {{DISTRIBUTED_LOCK_DESC}}

*如无章节内容，此章节可省略*

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💻 核心任务逻辑

<!-- [可选] 选择标准：复杂的任务处理流程 -->

```java
{{TASK_ANNOTATION}}
public void {{TASK_NAME}}() {
    // 1. {{STEP_1}}
    // 2. {{STEP_2}}
    // 3. {{STEP_3}}
}
```

*如无章节内容，此章节可省略*

---

## 📝 业务规则

<!-- [可选] 记录关键业务规则和约束 -->

- {{BUSINESS_RULE_1}}
- {{BUSINESS_RULE_2}}
- {{BUSINESS_RULE_3}}

*示例：*
- *每日凌晨2点执行数据清理*
- *单次执行最多处理10000条记录*
- *执行失败自动告警通知*

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
