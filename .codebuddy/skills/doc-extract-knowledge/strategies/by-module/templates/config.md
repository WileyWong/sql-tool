<!--
================== AI 处理指引 ==================

【文档提取规则】
1. Bean 统计：统计所有 @Bean 方法，记录 Bean 名称和类型
2. 条件装配：识别 @Conditional* 注解，记录装配条件
3. 配置属性：从 @ConfigurationProperties 提取配置前缀和属性
4. 依赖分析：@Autowired/@Resource 注入的组件为依赖
5. 可选章节：内容为空时整章省略（含标题），不保留空表格

【代码生成规则】
1. 配置类：@Configuration + @EnableConfigurationProperties
2. Bean 方法：@Bean + 可选的 @Primary/@Qualifier
3. 条件装配：@ConditionalOnProperty/@ConditionalOnClass 等
4. 配置属性类：@ConfigurationProperties(prefix = "xxx")
5. 属性绑定：@Value("${xxx}") 或 @ConfigurationProperties

**注意**: 以上为通用规则，若实际项目代码风格与规则不一致，以实际项目为准。

================================================
-->

# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}` <!-- [必填] -->  
> **类型**: Configuration <!-- [必填] -->  
> **职责**: {{RESPONSIBILITY}} <!-- [必填] -->  
> **代码行数**: {{LOC}} 行（SLOC） <!-- [必填] -->

---

## 📊 统计信息

| Bean总数 | 配置属性数 | 依赖组件数 | 条件装配数 |
|:--------:|:----------:|:----------:|:----------:|
| {{BEAN_COUNT}} | {{PROPERTY_COUNT}} | {{DEP_COUNT}} | {{CONDITIONAL_COUNT}} |

---

## 🏷️ 自定义注解

<!-- [可选] 仅列出项目自定义注解，@Configuration/@Bean 等标准注解无需列出 -->

| 注解 | 作用范围 | 说明 |
|------|----------|------|
| `{{ANNOTATION}}` | {{SCOPE}} | {{ANNOTATION_DESC}} |

*如无章节内容，此章节可省略*

---

## 📋 Bean 定义方法

> **重要**: 必须列出配置类中定义的**全部 @Bean 方法**，不可遗漏。

### Bean 清单

| # | Bean名称 | 类型 | 作用域 | 条件装配 | 说明 |
|:-:|----------|------|:------:|----------|------|
| 1 | `{{BEAN_NAME_1}}` | `{{BEAN_TYPE_1}}` | {{SCOPE_1}} | {{CONDITION_1}} | {{DESC_1}} |
| 2 | `{{BEAN_NAME_2}}` | `{{BEAN_TYPE_2}}` | {{SCOPE_2}} | {{CONDITION_2}} | {{DESC_2}} |
| ... | ... | ... | ... | ... | ... |

---

### {{BEAN_NAME}}

| 属性 | 值 |
|------|-----|
| 签名 | `@Bean public {{BEAN_TYPE}} {{BEAN_NAME}}({{PARAMS_BRIEF}})` |
| 作用域 | {{SCOPE}} |
| 条件装配 | {{CONDITIONAL_DESC}} |
| 说明 | {{BEAN_DESC}} |

**参数**:

| 参数 | 类型 | 注解 | 说明 |
|------|------|------|------|
| {{PARAM_NAME}} | `{{PARAM_TYPE}}` | `{{PARAM_ANNOTATION}}` | {{PARAM_DESC}} |

**返回**: `{{BEAN_TYPE}}`

<!-- 重复以上结构，直到列出全部 Bean -->

---

## ⚙️ 配置属性

<!-- [可选] 如无配置属性，可省略此章节 -->

**配置类**: `@ConfigurationProperties(prefix = "{{PREFIX}}")`

### 属性清单

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `{{PROPERTY_KEY}}` | `{{PROPERTY_TYPE}}` | `{{DEFAULT_VALUE}}` | {{PROPERTY_DESC}} |

### 配置示例

```yaml
{{PREFIX}}:
  {{PROPERTY_KEY}}: {{EXAMPLE_VALUE}}
```

*如无章节内容，此章节可省略*

---

## 🔗 依赖组件（我依赖谁）

<!-- [可选] 如无依赖，可省略此章节 -->

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

*如无章节内容，此章节可省略*

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 使用Bean |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{USED_BEAN}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 💻 核心配置逻辑

<!-- [可选] 选择标准：复杂的 Bean 创建逻辑、条件装配逻辑 -->

```java
@Bean
public {{BEAN_TYPE}} {{BEAN_NAME}}() {
    // 1. {{STEP_1}}
    // 2. {{STEP_2}}
    return {{RETURN_STATEMENT}};
}
```

*如无章节内容，此章节可省略*

---

## 📎 关联文档

<!-- [可选] 引用相关文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Service | [{{SERVICE_NAME}}](./service/{{SERVICE_FILE}}.md) | {{SERVICE_DESC}} |

*如无章节内容，此章节可省略*

---

## 💡 使用示例

<!-- [可选] 提供典型使用场景的代码示例 -->

```java
// 注入配置的Bean使用
@Service
@RequiredArgsConstructor
public class {{SERVICE_NAME}} {
    
    private final {{BEAN_TYPE}} {{BEAN_FIELD}};
    
    public void example() {
        {{BEAN_FIELD}}.{{METHOD_NAME}}();
    }
}
```

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
