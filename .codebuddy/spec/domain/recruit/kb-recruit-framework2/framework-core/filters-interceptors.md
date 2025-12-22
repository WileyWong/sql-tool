# 过滤器和拦截器索引文档

## 概述

本文档列出 Core 项目中所有的过滤器（Filter）和拦截器（Interceptor）类，包含其功能描述和公共方法。

## 过滤器类（Filter）

### 1. XSS过滤器

#### XssFilter
**文件路径**: `com.tencent.hr.recruit.center.framework.filter.XssFilter`

**功能描述**: XSS攻击防护过滤器，对请求参数进行XSS过滤

**公共方法**:
- `doFilter(ServletRequest request, ServletResponse response, FilterChain chain)`: void - 执行过滤
- `init(FilterConfig config)`: void - 初始化过滤器
- `destroy()`: void - 销毁过滤器
- `isIgnoreUrl(String url)`: boolean - 判断是否忽略URL

### 2. 请求日志过滤器

#### RequestLoggingFilter
**文件路径**: `com.tencent.hr.recruit.center.framework.filter.RequestLoggingFilter`

**功能描述**: 请求日志记录过滤器，记录HTTP请求的详细信息

**公共方法**:
- `doFilter(ServletRequest request, ServletResponse response, FilterChain chain)`: void - 执行过滤
- `logRequest(HttpServletRequest request)`: void - 记录请求信息
- `logResponse(HttpServletResponse response, long duration)`: void - 记录响应信息

### 3. CORS跨域过滤器

#### CorsFilter
**文件路径**: `com.tencent.hr.recruit.center.framework.filter.CorsFilter`

**功能描述**: 跨域资源共享（CORS）过滤器，处理跨域请求

**公共方法**:
- `doFilter(ServletRequest request, ServletResponse response, FilterChain chain)`: void - 执行过滤
- `addCorsHeaders(HttpServletResponse response)`: void - 添加CORS响应头

## 拦截器类（Interceptor）

### 1. 认证拦截器

#### AuthInterceptor
**文件路径**: `com.tencent.hr.recruit.center.framework.interceptor.AuthInterceptor`

**功能描述**: 用户认证拦截器，验证用户身份和权限

**公共方法**:
- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`: boolean - 前置处理
- `postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)`: void - 后置处理
- `afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)`: void - 完成后处理
- `checkAuth(HttpServletRequest request)`: boolean - 检查认证

### 2. 日志拦截器

#### LogInterceptor
**文件路径**: `com.tencent.hr.recruit.center.framework.interceptor.LogInterceptor`

**功能描述**: 日志记录拦截器，记录接口调用信息

**公共方法**:
- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`: boolean - 前置处理
- `afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)`: void - 完成后处理
- `logMethodCall(HttpServletRequest request, Object handler)`: void - 记录方法调用

### 3. 性能监控拦截器

#### PerformanceInterceptor
**文件路径**: `com.tencent.hr.recruit.center.framework.interceptor.PerformanceInterceptor`

**功能描述**: 性能监控拦截器，监控接口执行时间

**公共方法**:
- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`: boolean - 前置处理
- `afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)`: void - 完成后处理
- `recordPerformance(String method, long duration)`: void - 记录性能数据

### 4. 参数校验拦截器

#### ValidationInterceptor
**文件路径**: `com.tencent.hr.recruit.center.framework.interceptor.ValidationInterceptor`

**功能描述**: 参数校验拦截器，自动校验请求参数

**公共方法**:
- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`: boolean - 前置处理
- `validateParameters(HttpServletRequest request, Object handler)`: void - 校验参数

### 5. 重复提交拦截器

#### RepeatSubmitInterceptor
**文件路径**: `com.tencent.hr.recruit.center.framework.interceptor.RepeatSubmitInterceptor`

**功能描述**: 防重复提交拦截器，防止接口被重复调用

**公共方法**:
- `preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)`: boolean - 前置处理
- `isRepeatSubmit(HttpServletRequest request)`: boolean - 判断是否重复提交
- `generateSubmitKey(HttpServletRequest request)`: String - 生成提交唯一标识

## 配置说明

### 过滤器配置顺序
1. CorsFilter - CORS跨域处理
2. XssFilter - XSS攻击防护
3. RequestLoggingFilter - 请求日志记录

### 拦截器配置顺序
1. LogInterceptor - 日志记录
2. PerformanceInterceptor - 性能监控
3. AuthInterceptor - 用户认证
4. ValidationInterceptor - 参数校验
5. RepeatSubmitInterceptor - 防重复提交

## 使用示例

### 过滤器使用示例

```java
@Configuration
public class FilterConfig {
    
    @Bean
    public FilterRegistrationBean<XssFilter> xssFilter() {
        FilterRegistrationBean<XssFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new XssFilter());
        registration.addUrlPatterns("/*");
        registration.setOrder(1);
        return registration;
    }
}
```

### 拦截器使用示例

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthInterceptor authInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login", "/register");
    }
}
```

## 相关文档

- [配置类索引](./configurations.md)
- [异常类索引](./exceptions.md)
- [注解索引](./annotations.md)
- [项目结构分析](./project-structure.md)
