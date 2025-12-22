# 自定义注解

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 注解列表

| 注解 | 作用 | Target | Retention | 处理器 |
|------|------|--------|-----------|--------|
| `@{{ANNOTATION_NAME}}` | {{PURPOSE}} | {{TARGET}} | {{RETENTION}} | {{PROCESSOR}} |

---

## 📝 注解详情

### @{{ANNOTATION_NAME}}

**完整定义**:
```java
@Target({{TARGET}})
@Retention({{RETENTION}})
@Documented
public @interface {{ANNOTATION_NAME}} {

    /**
     * {{ATTR_DESC}}
     */
    {{ATTR_TYPE}} {{ATTR_NAME}}() default {{DEFAULT_VALUE}};

    /**
     * {{ATTR_DESC_2}}
     */
    {{ATTR_TYPE_2}} {{ATTR_NAME_2}}() default {{DEFAULT_VALUE_2}};
}
```

**属性说明**:
| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|:----:|------|
| {{ATTR_NAME}} | `{{ATTR_TYPE}}` | `{{DEFAULT_VALUE}}` | {{REQUIRED}} | {{ATTR_DESC}} |
| {{ATTR_NAME_2}} | `{{ATTR_TYPE_2}}` | `{{DEFAULT_VALUE_2}}` | {{REQUIRED}} | {{ATTR_DESC_2}} |

**处理器**:
```java
@Aspect
@Component
public class {{ASPECT_CLASS}} {

    @Around("@annotation({{ANNOTATION_VAR}})")
    public Object around(
        ProceedingJoinPoint joinPoint,
        {{ANNOTATION_NAME}} {{ANNOTATION_VAR}}
    ) throws Throwable {
        // 处理逻辑
    }
}
```

**使用示例**:
```java
@{{ANNOTATION_NAME}}({{ATTR_NAME}} = {{EXAMPLE_VALUE}})
public void exampleMethod() {
    // 业务逻辑
}
```

---

### @{{ANNOTATION_NAME_2}}

**完整定义**:
```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface {{ANNOTATION_NAME_2}} {

    String[] roles() default {};

    String[] permissions() default {};
}
```

**属性说明**:
| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|:----:|------|
| roles | `String[]` | `{}` | 否 | 允许的角色列表 |
| permissions | `String[]` | `{}` | 否 | 允许的权限列表 |

**处理器**: `{{INTERCEPTOR_CLASS}}` (拦截器)

**使用示例**:
```java
@{{ANNOTATION_NAME_2}}(roles = {"ADMIN", "MANAGER"})
public void adminMethod() {
    // 需要 ADMIN 或 MANAGER 角色
}

@{{ANNOTATION_NAME_2}}(permissions = {"user:create", "user:update"})
public void userManageMethod() {
    // 需要 user:create 或 user:update 权限
}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
