# Spring 配置详解

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 配置类列表

| 配置类 | 用途 | 条件装配 |
|--------|------|----------|
| `{{CONFIG_CLASS}}` | {{PURPOSE}} | {{CONDITIONAL}} |

---

## ⚙️ 配置类详情

### {{CONFIG_CLASS}}

**类定义**:
```java
@Configuration
{{OTHER_ANNOTATIONS}}
public class {{CONFIG_CLASS}} {
    // ...
}
```

**Bean 定义方法**:

#### {{BEAN_NAME}}
```java
@Bean
{{BEAN_ANNOTATIONS}}
public {{BEAN_TYPE}} {{BEAN_NAME}}(
    {{PARAMS_WITH_ANNOTATIONS}}
)
```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | {{PARAM_NAME}} | {{PARAM_TYPE}} | {{PARAM_ANNOTATION}} | {{PARAM_DESC}} |
- **返回类型**: `{{BEAN_TYPE}}`
- **作用域**: {{SCOPE}}
- **条件装配**: {{CONDITIONAL_DESC}}
- **说明**: {{BEAN_DESC}}

---

### {{CONFIG_CLASS_2}}

**类定义**:
```java
@Configuration
@EnableWebMvc
public class {{CONFIG_CLASS_2}} implements WebMvcConfigurer {
    // ...
}
```

**配置方法**:

#### addInterceptors
```java
@Override
public void addInterceptors(InterceptorRegistry registry)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | registry | InterceptorRegistry | 拦截器注册表 |
- **说明**: 注册拦截器

#### addCorsMappings
```java
@Override
public void addCorsMappings(CorsRegistry registry)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | registry | CorsRegistry | CORS 注册表 |
- **说明**: 配置跨域

#### addResourceHandlers
```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry)
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | registry | ResourceHandlerRegistry | 资源处理器注册表 |
- **说明**: 配置静态资源映射

---

## ⚙️ 配置属性

### application.yml

```yaml
server:
  port: {{PORT}}
  servlet:
    context-path: {{CONTEXT_PATH}}

spring:
  datasource:
    url: {{DATASOURCE_URL}}
    username: {{USERNAME}}
    password: {{PASSWORD}}
    driver-class-name: {{DRIVER_CLASS}}
```

### 自定义配置

**配置属性类**:
```java
@Configuration
@ConfigurationProperties(prefix = "{{PREFIX}}")
public class {{PROPERTIES_CLASS}} {

    private String {{PROPERTY_1}};
    private Integer {{PROPERTY_2}};
    private Boolean {{PROPERTY_3}};

    // Getter/Setter
}
```

**配置示例**:
```yaml
{{PREFIX}}:
  {{PROPERTY_1}}: {{VALUE_1}}
  {{PROPERTY_2}}: {{VALUE_2}}
  {{PROPERTY_3}}: {{VALUE_3}}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
