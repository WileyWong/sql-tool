<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 继承关系：记录父类异常（RuntimeException/Exception 等）
2. 构造方法：提取所有构造方法及其参数
3. 自定义字段：提取 errorCode、data 等自定义字段
4. 错误码：如有错误码常量，需列出
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 业务异常：extends RuntimeException + errorCode + message
2. 构造方法：提供多种重载（message、code+message、cause）
3. Getter 方法：getErrorCode()、getData()
4. 全局处理：配合 @ExceptionHandler 使用

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Exception <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| 构造方法数 | 自定义字段数 | 错误码数量 |
|:----------:|:------------:|:----------:|
| {{CONSTRUCTOR_COUNT}} | {{FIELD_COUNT}} | {{ERROR_CODE_COUNT}} |

---

## 📋 继承关系

```
{{PARENT_EXCEPTION}}
  └── {{CLASS_NAME}}
        └── {{CHILD_EXCEPTION}}
```

---

## 📋 自定义字段

<!-- [可选] 如无自定义字段，可省略此章节 -->

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `{{FIELD_NAME}}` | `{{FIELD_TYPE}}` | {{FIELD_DESC}} |

*如无章节内容，此章节可省略*

---

## 📋 构造方法

> **重要**: 必须列出异常类中定义的**全部构造方法**，不可遗漏。

### 构造方法清单

| # | 签名 | 说明 |
|:-:|------|------|
| 1 | `{{CLASS_NAME}}(String message)` | 基础构造，仅消息 |
| 2 | `{{CLASS_NAME}}(String message, Throwable cause)` | 包装异常 |
| 3 | `{{CLASS_NAME}}({{ERROR_CODE_TYPE}} errorCode, String message)` | 带错误码 |
| ... | ... | ... |

---

### {{CLASS_NAME}}(String message)

| 属性 | 值 |
|------|-----|
| 签名 | `public {{CLASS_NAME}}(String message)` |
| 说明 | 基础构造方法，仅包含异常消息 |

**参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| message | `String` | 异常消息 |

---

### {{CLASS_NAME}}({{ERROR_CODE_TYPE}} errorCode, String message)

| 属性 | 值 |
|------|-----|
| 签名 | `public {{CLASS_NAME}}({{ERROR_CODE_TYPE}} errorCode, String message)` |
| 说明 | 带错误码的构造方法 |

**参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| errorCode | `{{ERROR_CODE_TYPE}}` | 错误码 |
| message | `String` | 异常消息 |

<!-- 重复以上结构，直到列出全部构造方法 -->

---

## 📋 Getter 方法

| 方法名 | 返回类型 | 说明 |
|--------|----------|------|
| `getErrorCode()` | `{{ERROR_CODE_TYPE}}` | 获取错误码 |
| `getData()` | `Object` | 获取附加数据 |

---

## 📋 错误码定义

<!-- [可选] 如无错误码常量，可省略此章节 -->

| 错误码 | 常量名 | 说明 |
|--------|--------|------|
| `{{ERROR_CODE}}` | `{{ERROR_NAME}}` | {{ERROR_DESC}} |

*如无章节内容，此章节可省略*

---

## 🔗 依赖组件（我依赖谁）

<!-- 异常类通常无依赖 -->

无（异常类通常无依赖）

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 使用场景 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{USAGE}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

```java
// 抛出基础异常
throw new {{CLASS_NAME}}("操作失败");

// 抛出带错误码的异常
throw new {{CLASS_NAME}}(ErrorCode.USER_NOT_FOUND, "用户不存在");

// 包装原始异常
try {
    // 业务逻辑
} catch (SQLException e) {
    throw new {{CLASS_NAME}}("数据库操作失败", e);
}

// 捕获处理
try {
    // 业务逻辑
} catch ({{CLASS_NAME}} e) {
    log.error("业务异常: code={}, message={}", e.getErrorCode(), e.getMessage());
}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
