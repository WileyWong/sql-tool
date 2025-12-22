<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 方法统计：统计所有 public 方法，区分事务方法和非事务方法
2. 事务识别：@Transactional 注解标记的方法为事务方法
3. 缓存识别：@Cacheable/@CacheEvict/@CachePut 注解标记的方法有缓存
4. 依赖分析：@Autowired/@Resource 注入的组件为依赖
5. 接口实现：implements 关键字后的接口需记录
6. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. Service 类：@Service + @RequiredArgsConstructor + private final 依赖注入
2. 事务方法：@Transactional(rollbackFor = Exception.class)
3. 只读事务：@Transactional(readOnly = true)
4. 缓存方法：@Cacheable(value = "xxx", key = "#id")
5. 异常处理：业务异常抛出自定义 BusinessException
6. 日志：@Slf4j 注解，关键操作记录日志

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Service <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 业务方法总数 | 事务方法数 | 只读事务数 | 缓存方法数 | 依赖Mapper数 | 依赖Service数 |
|:------------:|:----------:|:----------:|:----------:|:------------:|:-------------:|
| {{TOTAL_METHOD}} | {{TX_METHOD}} | {{READONLY_TX}} | {{CACHE_METHOD}} | {{MAPPER_COUNT}} | {{SERVICE_COUNT}} |

---

## 📋 实现接口

<!-- [可选] 如未实现接口，可省略此章节 -->

| 接口 | 说明 |
|------|------|
| {{INTERFACE_NAME}} | {{INTERFACE_DESC}} |

*如无章节内容，此章节可省略*

---

## 📋 业务方法完整列表

> **重要**: 必须列出 Service 中定义的**全部公开方法**，不可遗漏任何方法签名。

### 方法清单

| # | 方法名 | 返回类型 | 事务 | 缓存 | 说明 |
|:-:|--------|----------|:----:|:----:|------|
| 1 | `{{METHOD_NAME_1}}` | `{{RETURN_TYPE_1}}` | {{TX_1}} | {{CACHE_1}} | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | `{{RETURN_TYPE_2}}` | {{TX_2}} | {{CACHE_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

---

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `{{MODIFIER}} {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| 事务 | {{TRANSACTION}} |
| 缓存 | {{CACHE_ANNOTATION}} |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

**异常**: <!-- [可选] 如无异常可省略 -->

| 异常类型 | 触发条件 |
|----------|----------|
| `{{EXCEPTION_TYPE}}` | {{EXCEPTION_CONDITION}} |

<!-- 重复以上结构，直到列出全部公开方法 -->

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 注入方式 | 用途 |
|------|------|----------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{INJECT_TYPE}} | {{DEP_PURPOSE}} |

*注入方式：@Autowired / @Resource / 构造器注入*

---

## 🔙 被依赖方（谁依赖我）

<!-- [可选] 如无法确定被依赖方，可省略此章节 -->

| 组件 | 类型 | 调用方法 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLED_METHODS}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

*如无章节内容，此章节可省略*

---

## 🔄 事务配置

<!-- [可选] 如无事务配置，可省略此章节 -->

```java
{{TRANSACTION_CONFIG}}
```

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 传播行为 | {{PROPAGATION}} | REQUIRED / REQUIRES_NEW 等 |
| 隔离级别 | {{ISOLATION}} | DEFAULT / READ_COMMITTED 等 |
| 回滚规则 | {{ROLLBACK_FOR}} | Exception.class 等 |

*如无章节内容，此章节可省略*

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解，@Service/@Transactional 等标准注解无需列出 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💻 核心业务逻辑

<!-- [可选] 选择标准：复杂业务流程、关键算法、状态流转逻辑 -->

```java
{{METHOD_ANNOTATION}}
public {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS}}) {
    // 1. {{STEP_1}}
    // 2. {{STEP_2}}
    // 3. {{STEP_3}}
    return {{RETURN_STATEMENT}};
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
- *状态流转：待处理(0) → 处理中(1) → 已完成(2) → 已拒绝(3)*
- *同一候选人对同一职位只能推荐一次*
- *推荐成功后24小时内可撤回*

*如无章节内容，此章节可省略*

---

## 📎 关联文档

<!-- [可选] 引用相关的数据结构和服务文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Entity | [{{ENTITY_NAME}}](./entity/{{ENTITY_FILE}}.md) | {{ENTITY_DESC}} |
| Mapper | [{{MAPPER_NAME}}](./mapper/{{MAPPER_FILE}}.md) | {{MAPPER_DESC}} |
| DTO | [{{DTO_NAME}}](./dto/{{DTO_FILE}}.md) | {{DTO_DESC}} |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

<!-- [可选] 提供典型使用场景的代码示例 -->

```java
// 在Controller中注入使用
@RestController
@RequiredArgsConstructor
public class {{CONTROLLER_NAME}} {
    
    private final {{CLASS_NAME}} {{SERVICE_FIELD}};
    
    @GetMapping("/{{PATH}}")
    public Result<{{VO_TYPE}}> get(@PathVariable Long id) {
        return Result.success({{SERVICE_FIELD}}.{{METHOD_NAME}}(id));
    }
}
```

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
