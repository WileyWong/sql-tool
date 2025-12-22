<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 字段分类：区分必填字段（有 @NotNull/@NotBlank）和可选字段
2. 验证规则：提取所有 JSR-303 验证注解
3. 嵌套对象：识别复杂类型字段（非基本类型/String/Date）
4. 使用场景：从被依赖方分析 DTO 的使用场景
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. DTO 类：@Data + @Builder + @NoArgsConstructor + @AllArgsConstructor
2. 必填验证：@NotNull/@NotBlank/@NotEmpty
3. 格式验证：@Pattern/@Email/@Size
4. 分组验证：@Validated(Create.class)
5. 嵌套验证：@Valid

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: DTO <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 字段总数 | 必填字段数 | 可选字段数 | 验证规则数 |
|:--------:|:----------:|:----------:|:----------:|
| {{FIELD_COUNT}} | {{REQUIRED_COUNT}} | {{OPTIONAL_COUNT}} | {{VALIDATION_COUNT}} |

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解，@Data 等标准注解无需列出 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 📋 字段列表

> **重要**: 必须列出 DTO 中定义的**全部字段**，不可遗漏。

| # | 字段名 | 类型 | 必填 | 验证注解 | 说明 |
|:-:|--------|------|:----:|----------|------|
| 1 | `{{FIELD_NAME_1}}` | `{{JAVA_TYPE_1}}` | {{REQ_1}} | `{{VALID_1}}` | {{DESC_1}} |
| 2 | `{{FIELD_NAME_2}}` | `{{JAVA_TYPE_2}}` | {{REQ_2}} | `{{VALID_2}}` | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

---

## ✅ 验证规则汇总

| 字段 | 验证注解 | 验证规则 | 错误消息 |
|------|----------|----------|----------|
| `{{FIELD_NAME}}` | `{{VALIDATION_ANNOTATION}}` | {{VALIDATION_RULE}} | {{ERROR_MESSAGE}} |

---

## 📋 Getter/Setter 方法

<!-- [可选] 如使用 Lombok @Data，可简化此章节 -->

*使用 Lombok @Data 注解自动生成，此章节省略*

---

## 🔗 依赖组件（我依赖谁）

<!-- DTO 通常无依赖 -->

| 组件 | 类型 | 用途 |
|------|------|------|
| - | - | DTO 通常无依赖 |

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 使用场景 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{USAGE}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 💡 使用场景

- **Controller 层**: 作为 `@RequestBody` 接收前端请求
- **Service 层**: 业务逻辑处理的数据载体
- **Feign 调用**: 作为远程服务的请求参数

---

## 📎 关联文档

<!-- [可选] 引用相关文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Entity | [{{ENTITY_NAME}}](./entity/{{ENTITY_FILE}}.md) | {{ENTITY_DESC}} |
| VO | [{{VO_NAME}}](./vo/{{VO_FILE}}.md) | {{VO_DESC}} |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

<!-- [可选] 提供典型使用场景的代码示例 -->

```java
// 在Controller中接收请求
@PostMapping("/{{PATH}}")
public Result<{{VO_TYPE}}> create(@RequestBody @Valid {{CLASS_NAME}} dto) {
    return Result.success(service.create(dto));
}
```

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
