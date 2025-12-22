# 环境配置

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 🌍 环境列表

| 环境 | Profile | 配置文件 | 用途 |
|------|---------|----------|------|
| {{ENV_NAME}} | {{PROFILE}} | `application-{{PROFILE}}.yml` | {{PURPOSE}} |

---

## ⚙️ 配置差异

### 数据库配置

| 环境 | Host | Database | 连接池大小 |
|------|------|----------|:----------:|
| dev | localhost | {{DB_NAME}}_dev | 5 |
| test | {{TEST_HOST}} | {{DB_NAME}}_test | 10 |
| prod | {{PROD_HOST}} | {{DB_NAME}} | 50 |

### Redis 配置

| 环境 | Host | Database | 连接池大小 |
|------|------|:--------:|:----------:|
| dev | localhost:6379 | 0 | 8 |
| test | {{TEST_HOST}}:6379 | 1 | 16 |
| prod | {{PROD_HOST}}:6379 | 0 | 32 |

### 日志配置

| 环境 | 日志级别 | 输出位置 |
|------|----------|----------|
| dev | DEBUG | 控制台 |
| test | INFO | 文件 + 控制台 |
| prod | WARN | 文件 + ELK |

---

## 📋 环境变量

| 变量名 | 说明 | 示例值 | 必填 |
|--------|------|--------|:----:|
| `SPRING_PROFILES_ACTIVE` | 激活环境 | `prod` | 是 |
| `DB_HOST` | 数据库地址 | `localhost` | 是 |
| `DB_PORT` | 数据库端口 | `3306` | 否 |
| `DB_USERNAME` | 数据库用户名 | `root` | 是 |
| `DB_PASSWORD` | 数据库密码 | `****` | 是 |
| `REDIS_HOST` | Redis 地址 | `localhost` | 是 |
| `REDIS_PASSWORD` | Redis 密码 | `****` | 否 |
| `JWT_SECRET` | JWT 密钥 | `****` | 是 |

---

## 🚀 启动命令

### 开发环境
```bash
java -jar {{PROJECT_NAME}}.jar \
  --spring.profiles.active=dev
```

### 测试环境
```bash
java -jar {{PROJECT_NAME}}.jar \
  --spring.profiles.active=test \
  -Xms256m -Xmx512m
```

### 生产环境
```bash
java -jar {{PROJECT_NAME}}.jar \
  --spring.profiles.active=prod \
  -Xms512m -Xmx1024m \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -Dfile.encoding=UTF-8
```

---

## 📝 配置优先级

1. 命令行参数 (`--key=value`)
2. 环境变量 (`SPRING_XXX`)
3. `application-{profile}.yml`
4. `application.yml`

---

## 📋 配置属性清单

### 应用配置
```yaml
server:
  port: {{PORT}}
  servlet:
    context-path: {{CONTEXT_PATH}}

spring:
  application:
    name: {{PROJECT_NAME}}
```

### 数据源配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: ${DB_POOL_SIZE:10}
      minimum-idle: ${DB_MIN_IDLE:5}
```

### Redis 配置
```yaml
spring:
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    database: ${REDIS_DATABASE:0}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
