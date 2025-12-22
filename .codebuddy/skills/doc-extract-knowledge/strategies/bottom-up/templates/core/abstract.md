<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 方法分类：区分抽象方法、模板方法（protected 可覆盖）、具体方法（final 或 public）
2. 泛型提取：记录泛型参数及其约束（extends/super）
3. 继承关系：记录父类和所有子类
4. 子类实现：列出所有继承此抽象类的子类
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 抽象类：public abstract class + 抽象方法 + 模板方法
2. 抽象方法：protected abstract 修饰符
3. 模板方法：protected 修饰符，提供默认实现
4. 具体方法：public final 或 public 修饰符
5. 子类实现：必须实现所有抽象方法

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Abstract Class <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 抽象方法数 | 模板方法数 | 具体方法数 | 受保护方法数 | 字段数 | 泛型参数 |
|:----------:|:----------:|:----------:|:------------:|:------:|:--------:|
| {{ABSTRACT_METHOD_COUNT}} | {{TEMPLATE_METHOD_COUNT}} | {{CONCRETE_METHOD_COUNT}} | {{PROTECTED_METHOD_COUNT}} | {{FIELD_COUNT}} | {{GENERIC_PARAMS}} |

---

## 📋 泛型参数

<!-- [可选] 如无泛型参数，可省略此章节 -->

| 参数 | 约束 | 说明 |
|------|------|------|
| `{{PARAM}}` | `{{BOUND}}` | {{DESCRIPTION}} |

*如无章节内容，此章节可省略*

---

## 📋 继承关系

```
{{PARENT_CLASS}}
  └── {{CLASS_NAME}} (abstract)
        ├── {{CHILD_CLASS_1}}
        └── {{CHILD_CLASS_2}}
```

---

## 📋 方法完整列表

> **重要**: 必须列出抽象类中定义的**全部方法**，不可遗漏任何方法签名。

### 方法清单

| # | 方法名 | 类型 | 返回类型 | 说明 |
|:-:|--------|:----:|----------|------|
| 1 | `{{METHOD_NAME_1}}` | 抽象 | `{{RETURN_TYPE_1}}` | {{DESC_1}} |
| 2 | `{{METHOD_NAME_2}}` | 模板 | `{{RETURN_TYPE_2}}` | {{DESC_2}} |
| 3 | `{{METHOD_NAME_3}}` | 具体 | `{{RETURN_TYPE_3}}` | {{DESC_3}} |
| ... | ... | ... | ... | ... |

---

## 📋 抽象方法（子类必须实现）

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `protected abstract {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| 说明 | {{DESCRIPTION}} |
| 实现要求 | {{REQUIREMENTS}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

**异常**: <!-- [可选] -->

| 异常类型 | 触发条件 |
|----------|----------|
| `{{EXCEPTION_TYPE}}` | {{EXCEPTION_CONDITION}} |

<!-- 重复以上结构，直到列出全部抽象方法 -->

---

## 📋 模板方法（可被子类覆盖）

<!-- [可选] 如无模板方法，可省略此章节 -->

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `protected {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| 默认行为 | {{DEFAULT_BEHAVIOR}} |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

*如无章节内容，此章节可省略*

---

## 📋 具体方法（子类继承）

<!-- [可选] 如无具体方法，可省略此章节 -->

### {{METHOD_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `public {{RETURN_TYPE}} {{METHOD_NAME}}({{PARAMS_BRIEF}})` |
| 事务 | {{TRANSACTION}} |
| 说明 | {{DESCRIPTION}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}

*如无章节内容，此章节可省略*

---

## 🔗 子类列表

| 子类 | 类型 | 说明 |
|------|------|------|
| {{CHILD_CLASS}} | {{CHILD_TYPE}} | {{CHILD_DESC}} |

---

## 🔗 依赖组件（我依赖谁）

<!-- [可选] 如无依赖，可省略此章节 -->

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

*如无章节内容，此章节可省略*

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 使用方式 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{USAGE}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个子类

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 📎 关联文档

<!-- [可选] 引用相关文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| 子类 | [{{CHILD_NAME}}](./{{CHILD_FILE}}.md) | {{CHILD_DESC}} |

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
