# 拦截器和切面索引

> **覆盖范围**: `{{BASE_PACKAGE}}.interceptor`, `{{BASE_PACKAGE}}.aspect`  
> **生成时间**: {{SCAN_DATE}}

---

## 拦截器

### AuthInterceptor - 认证拦截器

**路径**: `com.company.project.interceptor.AuthInterceptor`  
**实现**: `HandlerInterceptor`

| 方法 | 功能说明 |
|------|----------|
| `preHandle` | 请求前校验Token |
| `postHandle` | 请求后处理 |
| `afterCompletion` | 请求完成后清理 |

**拦截路径**: `/api/**`  
**排除路径**: `/api/auth/login`, `/api/auth/register`

---

## 切面

### LogAspect - 日志切面

**路径**: `com.company.project.aspect.LogAspect`  
**注解**: `@Aspect`, `@Component`

| 切点 | 通知类型 | 功能说明 |
|------|---------|----------|
| `@annotation(Log)` | @Around | 记录操作日志 |
| `execution(* *.controller.*.*(..))` | @Around | 记录接口耗时 |
