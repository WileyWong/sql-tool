# 第三方组件索引

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 组件清单

| 组件 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 2.7.x | 基础框架 |
| MyBatis-Plus | 3.5.x | ORM框架 |
| Redis | 6.x | 缓存 |
| RabbitMQ | 3.x | 消息队列 |
| Elasticsearch | 7.x | 搜索引擎 |

---

## 组件配置

### MyBatis-Plus

**配置类**: `com.company.project.config.MybatisPlusConfig`

```yaml
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
```

### Redis

**配置类**: `com.company.project.config.RedisConfig`

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    database: 0
```

### RabbitMQ

**配置类**: `com.company.project.config.RabbitConfig`

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
```
