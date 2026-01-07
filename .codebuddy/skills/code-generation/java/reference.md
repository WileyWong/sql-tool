# Java 技术参考

## 技术栈

| 组件 | 推荐版本 | 说明 |
|------|---------|------|
| JDK | 17+ | LTS 版本 |
| Spring Boot | 3.2.x | 最新稳定版 |
| MyBatis-Plus | 3.5.x | ORM 框架 |
| MySQL | 8.0+ | 数据库 |

## 依赖配置

### Maven

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
        <version>3.5.5</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

## 分层架构

```
Controller → Service → Mapper → Database
     ↓           ↓
   DTO/VO     Entity
```

## 规范文档

- [命名规范](../standards/java/naming.md)
- [日志规范](../standards/java/logging.md)
- [异常处理](../standards/java/exception.md)
- [Spring Boot](../standards/java/springboot.md)
- [MyBatis-Plus](../standards/java/mybatis-plus.md)
- [最佳实践](../standards/java/best-practices.md)
- [错误示例](../standards/java/anti-patterns.md)
