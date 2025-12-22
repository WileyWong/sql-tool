<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 接口统计：统计所有 @GetMapping/@PostMapping/@PutMapping/@PatchMapping/@DeleteMapping 注解的 public 方法
2. 分页标记(✓)：返回类型含 Page/PageRes/IPage 或参数含 Pageable/PageReq/InfinitePageReq
3. 事务标记(✓)：方法或类上存在 @Transactional 注解
4. 权限提取：@PreAuthorize/@Secured 注解值，或方法内 ActorUtil.check*/SecurityUtil.check* 调用
5. 可选章节：内容为空时整章省略（含标题），不保留空表格
6. 引用文档：DTO/VO/Entity 等数据结构引用对应的 dto.md/vo.md/entity.md；Service 引用对应的 service.md

【代码生成规则】
1. 类声明：@RestController + @RequestMapping(基础路径) + @Slf4j + @RequiredArgsConstructor(如使用构造器注入)
2. 依赖注入：优先构造器注入（final 字段 + @RequiredArgsConstructor），或 @Autowired 字段注入
3. 方法体模式：参数校验 → 权限检查 → 调用Service → 结果包装
4. 返回包装：统一使用 Result<T>/Response<T> 包装，或直接返回 ResponseEntity<T>
5. 异常处理：业务异常抛出自定义 Exception，由 @ControllerAdvice 全局处理器捕获
6. 数据结构：根据"关联文档"章节引用的 DTO/VO 文档生成对应类

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Controller <!-- [必填] -->  
> **API 风格**: RESTful <!-- REST / RPC -->  
> **基础路径**: `{{BASE_REQUEST_MAPPING}}` <!-- [必填] -->  
> **实现接口**: {{IMPLEMENTS_INTERFACE}} <!-- [可选] 如无实现接口可省略此行 -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 接口总数 | GET | POST | PUT/PATCH | DELETE | 依赖服务数 |
|:--------:|:---:|:----:|:---------:|:------:|:----------:|
| {{TOTAL_API}} | {{GET_COUNT}} | {{POST_COUNT}} | {{PUT_PATCH_COUNT}} | {{DELETE_COUNT}} | {{SERVICE_COUNT}} |

---

## 📋 完整接口列表

> **重要**: 必须列出 Controller 中定义的**全部接口方法**，不可遗漏任何接口。

### 接口清单

| # | 方法名 | HTTP | 路径 | 分页 | 事务 | 说明 |
|:-:|--------|------|------|:----:|:----:|------|
| 1 | `{{METHOD_NAME_1}}` | {{HTTP_METHOD_1}} | `{{PATH_1}}` | {{PAGED_1}} | {{TX_1}} | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | {{HTTP_METHOD_2}} | `{{PATH_2}}` | {{PAGED_2}} | {{TX_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... | ... |

---

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| HTTP | `{{HTTP_METHOD}}` `{{API_PATH}}` |
| 签名 | `{{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| 权限 | {{PERMISSION}} <!-- [可选] --> |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 必填 | 说明 |
|------|------|------|:----:|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{REQUIRED}} | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

<!-- [可选] 复杂接口可添加请求/响应示例 -->

<!-- 重复以上结构，直到列出全部接口方法 -->

---

## 🔒 认证鉴权

<!-- [可选] 仅当使用认证/鉴权机制时填写，如无可删除此章节 -->

| 模式 | 实现方式 | 说明 |
|------|----------|------|
| {{AUTH_MODE}} | `{{AUTH_METHOD}}` | {{AUTH_DESC}} |

*示例：*
- *用户认证: `ActorUtil.checkUser()` - 检查用户登录状态*
- *账户认证: `ActorUtil.checkAccount()` - 检查账户有效性*
- *租户隔离: `ActorUtil.getTenantKey()` - 获取当前租户*

*如无章节内容，此章节可省略*

---

## ⚠️ 异常处理

<!-- [可选] 仅当有特殊异常处理逻辑时填写，如无可删除此章节 -->

| 异常类型 | 触发条件 | HTTP状态码 | 说明 |
|----------|----------|:----------:|------|
| `{{EXCEPTION_TYPE}}` | {{TRIGGER_CONDITION}} | {{HTTP_CODE}} | {{EXCEPTION_DESC}} |

*示例：*
- *`RecruitException`: 业务校验失败 → 400*
- *`UnauthorizedException`: 未登录 → 401*
- *`NotFoundException`: 资源不存在 → 404*

*如无章节内容，此章节可省略*

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

*如无章节内容，此章节可省略*

---

## 🔄 Service 调用映射

<!-- [可选] 记录 Controller 方法与 Service 方法的调用关系，便于理解业务流转 -->

| 接口方法 | 调用 Service | 调用方法 | 说明 |
|----------|--------------|----------|------|
| `{{CONTROLLER_METHOD}}` | `{{SERVICE_NAME}}` | `{{SERVICE_METHOD}}` | {{CALL_DESC}} |

*如无章节内容，此章节可省略*

---

## 📎 关联文档

<!-- 引用相关的数据结构和服务文档，便于 AI 理解完整上下文 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Service | [{{SERVICE_NAME}}](./service/{{SERVICE_FILE}}.md) | {{SERVICE_DESC}} |
| DTO | [{{DTO_NAME}}](./dto/{{DTO_FILE}}.md) | {{DTO_DESC}} |
| VO | [{{VO_NAME}}](./vo/{{VO_FILE}}.md) | {{VO_DESC}} |
| Entity | [{{ENTITY_NAME}}](./entity/{{ENTITY_FILE}}.md) | {{ENTITY_DESC}} |

*如无章节内容，此章节可省略*

---

## 🔙 被依赖方（谁依赖我）

<!-- [可选] Controller 通常不被其他组件依赖，如无特殊情况可省略此章节 -->

| 调用方 | 类型 | 说明 |
|--------|------|------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLER_DESC}} |

**影响分析**: 修改本类主要影响前端调用

*如无章节内容，此章节可省略*

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解或特殊框架注解，Spring 标准注解（@RestController、@RequestMapping、@Autowired、@Slf4j 等）无需列出 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*示例：*
- *`@Transactional`: 方法级事务控制*
- *`@RateLimiter`: 接口限流*
- *`@AuditLog`: 审计日志*
- *`@TenantScope`: 租户隔离*

*如无章节内容，此章节可省略*

---

## 💻 核心业务逻辑

<!-- [可选] 选择标准：复杂校验、状态流转、多服务协调、事务处理。如无复杂逻辑可省略此章节 -->

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

- {{BUSINESS_RULE_1}}
- {{BUSINESS_RULE_2}}
- {{BUSINESS_RULE_3}}

*示例：*
- *状态流转：待处理(0) → 处理中(1) → 已完成(2) → 已拒绝(3)*
- *同一候选人对同一职位只能推荐一次*
- *推荐成功后24小时内可撤回*

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
