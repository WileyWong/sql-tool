# Spring配置详解

> **覆盖范围**: `{{BASE_PACKAGE}}.config`  
> **生成时间**: {{SCAN_DATE}}

---

## 配置类列表

### WebConfig - Web配置

**路径**: `com.company.project.config.WebConfig`

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS配置
    // 拦截器配置
    // 消息转换器配置
}
```

### RedisConfig - Redis配置

**路径**: `com.company.project.config.RedisConfig`

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate() { ... }
}
```

---

## application.yml 配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `server.port` | 服务端口 | 8080 |
| `spring.datasource.url` | 数据库连接 | - |
| `spring.redis.host` | Redis地址 | localhost |
