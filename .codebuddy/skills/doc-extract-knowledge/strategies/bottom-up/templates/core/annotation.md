<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 元注解提取：@Target、@Retention、@Documented、@Inherited
2. 属性分类：区分必填属性（无默认值）和可选属性（有默认值）
3. 处理器识别：查找关联的 Aspect 切面类或 Interceptor 拦截器
4. 使用场景：从被依赖方分析注解的使用场景
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 注解定义：@interface + 元注解
2. 属性定义：类型 属性名() default 默认值;
3. 切面处理：@Aspect + @Around("@annotation(xxx)")
4. 拦截器处理：HandlerInterceptor + 注解检查

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{ANNOTATION_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{ANNOTATION_NAME}}` <!-- [必填] -->  
> **类型**: Annotation <!-- [必填] -->  
> **作用**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 属性总数 | 必填属性数 | 可选属性数 |
|:--------:|:----------:|:----------:|
| {{TOTAL_ATTR}} | {{REQUIRED_COUNT}} | {{OPTIONAL_COUNT}} |

---

## 🎯 元注解信息

| 元注解 | 值 | 说明 |
|--------|-----|------|
| @Target | `{{TARGET}}` | 注解作用目标 |
| @Retention | `{{RETENTION}}` | 注解保留策略 |
| @Documented | {{DOCUMENTED}} | 是否包含在 Javadoc |
| @Inherited | {{INHERITED}} | 是否可被继承 |

---

## 📋 属性列表

> **重要**: 必须列出注解中定义的**全部属性**，不可遗漏。

### 属性清单

| # | 属性名 | 类型 | 默认值 | 必填 | 说明 |
|:-:|--------|------|--------|:----:|------|
| 1 | `{{ATTR_NAME_1}}` | `{{ATTR_TYPE_1}}` | `{{DEFAULT_1}}` | {{REQ_1}} | {{DESC_1}} |
| 2 | `{{ATTR_NAME_2}}` | `{{ATTR_TYPE_2}}` | `{{DEFAULT_2}}` | {{REQ_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

---

### {{ATTR_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `{{ATTR_TYPE}} {{ATTR_NAME}}() default {{DEFAULT_VALUE}};` |
| 类型 | `{{ATTR_TYPE}}` |
| 默认值 | `{{DEFAULT_VALUE}}` |
| 必填 | {{REQUIRED}} |
| 说明 | {{ATTR_DESC}} |

<!-- 重复以上结构，直到列出全部属性 -->

---

## 🔗 依赖组件（我依赖谁）

<!-- [可选] 注解通常无依赖 -->

| 组件 | 类型 | 用途 |
|------|------|------|
| - | - | 注解通常无依赖 |

*如无章节内容，此章节可省略*

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 使用场景 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{USAGE_SCENARIO}} |

**影响分析**: 修改本注解可能影响 {{IMPACT_COUNT}} 个组件

---

## 🔗 关联处理器

<!-- [可选] 如无处理器，可省略此章节 -->

### 切面类

| 属性 | 值 |
|------|-----|
| 类名 | `{{ASPECT_CLASS}}` |
| 切点 | `@Around("@annotation({{ANNOTATION_NAME}})")` |

**处理逻辑**:
```java
@Around("@annotation({{ANNOTATION_NAME}})")
public Object around(ProceedingJoinPoint joinPoint, {{ANNOTATION_NAME}} annotation) throws Throwable {
    // 处理逻辑
}
```

### 拦截器

| 属性 | 值 |
|------|-----|
| 类名 | `{{INTERCEPTOR_CLASS}}` |
| 方法 | `preHandle` |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

```java
// 方法级别使用
@{{ANNOTATION_NAME}}({{ATTR_NAME}} = {{EXAMPLE_VALUE}})
public void exampleMethod() {
    // 业务逻辑
}

// 类级别使用（如 @Target 包含 TYPE）
@{{ANNOTATION_NAME}}({{ATTR_NAME}} = {{EXAMPLE_VALUE}})
public class ExampleClass {
    // 类定义
}
```

---

## 🏷️ 元注解说明

| 注解 | 说明 |
|------|------|
| `@Target({{TARGET}})` | 限定注解可应用的位置 |
| `@Retention({{RETENTION}})` | 指定注解的保留策略 |

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
