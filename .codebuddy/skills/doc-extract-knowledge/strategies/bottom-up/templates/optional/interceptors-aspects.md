# 拦截器和切面

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 拦截器列表

| 拦截器 | 用途 | 拦截路径 | 排除路径 | 执行顺序 |
|--------|------|----------|----------|:--------:|
| `{{INTERCEPTOR_NAME}}` | {{PURPOSE}} | `{{INCLUDE_PATH}}` | `{{EXCLUDE_PATH}}` | {{ORDER}} |

---

## 📝 拦截器详情

### {{INTERCEPTOR_NAME}}

**类定义**:
```java
@Component
public class {{INTERCEPTOR_NAME}} implements HandlerInterceptor {
    // ...
}
```

**方法签名**:

#### preHandle
```java
@Override
public boolean preHandle(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler
) throws Exception
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | request | HttpServletRequest | HTTP 请求对象 |
  | response | HttpServletResponse | HTTP 响应对象 |
  | handler | Object | 处理器对象 |
- **返回**: `boolean` - true 继续执行，false 中断请求
- **说明**: 请求处理前执行

#### postHandle
```java
@Override
public void postHandle(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler,
    ModelAndView modelAndView
) throws Exception
```
- **说明**: 请求处理后、视图渲染前执行

#### afterCompletion
```java
@Override
public void afterCompletion(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler,
    Exception ex
) throws Exception
```
- **说明**: 请求完成后执行（包括异常情况）

**配置注册**:
```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor({{INTERCEPTOR_VAR}})
                .addPathPatterns("{{INCLUDE_PATH}}")
                .excludePathPatterns("{{EXCLUDE_PATH}}")
                .order({{ORDER}});
    }
}
```

---

## 📋 切面列表

| 切面 | 用途 | 切点表达式 | 通知类型 |
|------|------|------------|----------|
| `{{ASPECT_NAME}}` | {{PURPOSE}} | `{{POINTCUT}}` | {{ADVICE_TYPE}} |

---

## 📝 切面详情

### {{ASPECT_NAME}}

**类定义**:
```java
@Aspect
@Component
@Order({{ORDER}})
public class {{ASPECT_NAME}} {
    // ...
}
```

**切点定义**:
```java
@Pointcut("{{POINTCUT_EXPRESSION}}")
public void {{POINTCUT_NAME}}() {}
```

**通知方法**:

#### {{ADVICE_METHOD_NAME}}
```java
@Around("{{POINTCUT_NAME}}()")
public Object {{ADVICE_METHOD_NAME}}(ProceedingJoinPoint joinPoint) throws Throwable {
    // 前置处理
    Object result = joinPoint.proceed();
    // 后置处理
    return result;
}
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | joinPoint | ProceedingJoinPoint | 连接点对象 |
- **返回**: `Object` - 方法执行结果
- **异常**: `Throwable` - 方法执行异常
- **说明**: {{ADVICE_DESC}}

#### {{ADVICE_METHOD_NAME_2}}
```java
@Around("@annotation({{ANNOTATION_VAR}})")
public Object {{ADVICE_METHOD_NAME_2}}(
    ProceedingJoinPoint joinPoint,
    {{ANNOTATION_TYPE}} {{ANNOTATION_VAR}}
) throws Throwable
```
- **参数说明**:
  | 参数 | 类型 | 说明 |
  |------|------|------|
  | joinPoint | ProceedingJoinPoint | 连接点对象 |
  | {{ANNOTATION_VAR}} | {{ANNOTATION_TYPE}} | 注解实例 |
- **说明**: 基于注解的切面处理

---

## 🔄 执行顺序

```
Request
  │
  ↓
┌─────────────────────────────────────┐
│ Interceptor.preHandle() [order: 0]  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Interceptor.preHandle() [order: 1]  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Aspect @Around (before proceed)     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Controller Method                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Aspect @Around (after proceed)      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Interceptor.postHandle() [order: 1] │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Interceptor.postHandle() [order: 0] │
└──────────────┬──────────────────────┘
               ↓
Response
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
