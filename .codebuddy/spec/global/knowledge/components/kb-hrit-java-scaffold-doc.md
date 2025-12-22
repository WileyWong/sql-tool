# sdc-std-scaffold-java 项目知识索引

> **生成时间**: 2025-11-12  
> **项目名称**: sdc-std-scaffold-java (人平标准 Java 脚手架)  
> **技术栈**: Spring Boot 2.x/3.x + MyBatis-Plus + Redis + MySQL  
> **Java 版本**: Kona JDK 17+

---

## 目录

1. [项目概览](#项目概览)
2. [核心组件](#核心组件)
3. [自定义组件](#自定义组件)
4. [数据层](#数据层)
5. [外部依赖](#外部依赖)
6. [配置管理](#配置管理)
7. [使用示例](#使用示例)

---

## 项目概览

### 项目结构

sdc-std-scaffold-java 是一个多模块的 Spring Boot 标准脚手架项目，包含以下模块:

| 模块名称 | 类型 | 说明 | 运行环境 |
|---------|------|------|---------|
| **hrit-project-core** | 🔧 核心工具包 | 项目框架逻辑工具包，提供通用工具类和基础功能 | Kona jdk(17+) + Maven |
| **hrit-project-spring-boot2-starter** | 📦 自动装配 | 基于 Spring Boot 2.x 框架的自动装配配置工具包 | Spring Boot 2.x + Kona jdk(17+) + Maven |
| **hrit-project-spring-boot3-starter** | 📦 自动装配 | 基于 Spring Boot 3.x 框架的自动装配配置工具包 | Spring Boot 3.x + Kona jdk(17+) + Maven |
| **hrit-project-spring-boot2-demo** | 📘 **示例项目** | **包含示例代码**的 Spring Boot 2.x Demo 项目，展示框架各功能的完整使用示例 | Spring Boot 2.x + Kona jdk(17+) + Maven |
| **hrit-project-spring-boot3-demo** | 📘 **示例项目** | **包含示例代码**的 Spring Boot 3.x Demo 项目，展示框架各功能的完整使用示例 | Spring Boot 3.x + Kona jdk(17+) + Maven |
| **hrit-project-spring-boot2-framework** | 🏗️ **纯净框架** | **不含示例代码**的 Spring Boot 2.x 纯净脚手架，用于快速创建新项目 | Spring Boot 2.x + Kona jdk(17+) + Maven |
| **hrit-project-spring-boot3-framework** | 🏗️ **纯净框架** | **不含示例代码**的 Spring Boot 3.x 纯净脚手架，用于快速创建新项目 | Spring Boot 3.x + Kona jdk(17+) + Maven |

### 模块定位说明

#### 📘 示例项目 (Demo)
- **hrit-project-spring-boot2-demo** 和 **hrit-project-spring-boot3-demo**
- **用途**: 学习参考、功能演示、最佳实践展示
- **包含内容**: 
  - ✅ 完整的 Service/Mapper/Controller 示例代码
  - ✅ Redis 缓存、Redisson 分布式锁使用示例
  - ✅ 附件中台、消息中台、工作流等 SDK 集成示例
  - ✅ 权限控制、事务管理、异常处理示例
  - ✅ 数据库操作（含大批量插入优化）示例
  - ✅ 完整的配置文件和环境配置示例

#### 🏗️ 纯净框架 (Framework)
- **hrit-project-spring-boot2-framework** 和 **hrit-project-spring-boot3-framework**
- **用途**: 作为新项目的起点，开箱即用的干净脚手架
- **包含内容**:
  - ✅ 基础项目结构（空的 controller/service/mapper 包）
  - ✅ 核心配置（数据库、Redis、日志、监控）
  - ✅ 全局异常处理、拦截器、切面等基础设施
  - ✅ 工具类和自定义注解
  - ❌ **不含**业务示例代码
  - ❌ **不含**具体的 Service/Controller/Mapper 实现

**使用建议**:
- **学习参考**: 查看 `-demo` 模块的示例代码
- **创建新项目**: 从 `-framework` 模块开始，复制到新项目中开发

### 核心特性

- **多环境配置**: 支持 dev/test/uat/prod 环境独立配置
- **异步日志**: Logback 异步写日志，按时间滚动存储
- **全局异常处理**: GlobalExceptionHandler 统一异常处理
- **身份认证**: SmartProxyAuth 集成企业 IT 太湖用户认证
- **访问日志**: AccessLogInterceptor 全局访问日志采集
- **权限控制**: @Permission 注解 + RightPermissionAspect 切面实现权限校验
- **数据库操作**: MyBatis-Plus + Mapper 自动生成
- **Redis 缓存**: Redisson + Lettuce 双重支持
- **分布式锁**: Redisson 分布式锁 + @DistributedTryLock 注解
- **中台集成**: 附件中台、消息中台、工作流 SDK
- **监控运维**: Spring Boot Actuator 健康检查

---

## 核心组件

> **📌 重要说明**: 本节列出的组件基于 **hrit-project-spring-boot3-demo（示例项目）** 模块。
> 
> - **📘 示例项目** (`-demo` 模块): 包含以下所有组件的完整实现代码，供学习和参考
> - **🏗️ 纯净框架** (`-framework` 模块): 仅包含基础设施（配置类、拦截器、切面、工具类），**不含**业务 Service/Controller/Mapper 示例
>
> **使用方式**:
> - 学习框架功能 → 参考 `-demo` 模块的示例代码
> - 创建新项目 → 使用 `-framework` 模块作为起点，按需添加业务代码

### Service 层（示例代码）

> 📘 以下为 demo 模块的核心示例服务，展示框架的典型用法

#### 1. MdStdStaffInfoService - 员工信息服务

**类路径**: `com.tencent.hr.demo.service.MdStdStaffInfoService`  
**功能**: 演示基础 CRUD、分页查询、批量操作、事务管理  
**核心特性**: `@Transactional` 注解，隔离级别 `REPEATABLE_READ`

**核心方法**:
- `batchInsert(List)` - 批量插入（事务示例）
- `selectByCondition(...)` - 分页/不分页查询
- `updateBatch(List)` - 批量更新

---

#### 2. MdStdOrgBaseService - 组织信息服务

**类路径**: `com.tencent.hr.demo.service.MdStdOrgBaseService`  
**功能**: 演示大数据量批处理、不同事务传播机制  
**核心特性**: SqlSessionFactory BATCH 模式

**核心方法**:
- `insertLargeAmountsOrg(List)` - 大批量插入（万级数据优化示例）
- `updateBatchRequiresNew(List)` - 新事务传播（REQUIRES_NEW）

---

#### 3. RedissonService - 缓存服务

**类路径**: `com.tencent.hr.demo.service.RedissonService`  
**功能**: 演示 Redisson 常用数据结构和分布式锁  
**核心特性**: String/Map/List/ZSet 操作，分布式锁

**核心方法**:
- `setString/getString` - 字符串缓存
- `mapPut/mapGetAll` - Map 操作
- `getTryLock/unlock` - 分布式锁

---

#### 4. FileService - 附件中台 SDK

**类路径**: `com.tencent.hr.demo.service.FileService`  
**功能**: 演示附件中台 SDK 集成  
**核心特性**: 文件上传/下载、批量操作、预览签名

**核心方法**: `uploadFile`、`download`、`batchDownloadFiles`、`getSignature`

---

#### 5. WorkflowService - 工作流 SDK

**类路径**: `com.tencent.hr.demo.service.WorkflowService`  
**功能**: 演示工作流 SDK 集成（流程定义、启动、审批）  
**核心特性**: 流程管理、待办审批、加签转交

**核心方法**: `createProcessModel`、`startProcess`、`agreeTask`、`transferTask`

---

#### 6. MessageService - 消息中台 SDK

**类路径**: `com.tencent.hr.demo.service.MessageService`  
**功能**: 演示消息中台 SDK 集成（邮件/短信/企微/MyOA）  
**核心特性**: 支持 23 种消息类型

**核心方法**: `sendTextMailMessage`、`sendSmsMessage`、`sendMyOACreateMessage`

---

### Mapper 层（示例代码）

> 📘 MyBatis Mapper 示例，展示数据访问层最佳实践

#### 1. MdStdStaffInfoMapper - 员工信息 Mapper

**类路径**: `com.tencent.hr.demo.mapper.MdStdStaffInfoMapper`  
**功能**: 演示基础 CRUD、批量操作、条件查询  
**核心特性**: MyBatisCodeHelper-Pro 自动生成 + 自定义 SQL

**核心方法**: `batchInsert`、`selectByCondition`、`updateBatch`

---

#### 2. MdStdOrgBaseMapper - 组织信息 Mapper

**类路径**: `com.tencent.hr.demo.mapper.MdStdOrgBaseMapper`  
**功能**: 演示 XML SQL 和注解 SQL 两种方式  
**核心特性**: Upsert 操作、注解 SQL 示例

**核心方法**: `upsertOne`、`insertAnnotationSql`、`batchInsert`

---

### Controller 层（示例代码）

> 📘 RESTful API 示例，展示接口设计和请求处理

#### 1. StaffController - 员工管理接口

**类路径**: `com.tencent.hr.demo.controller.StaffController`  
**功能**: 演示员工信息 CRUD 接口  
**核心特性**: 分页查询、参数校验、统一响应

**核心接口**:
- `POST /staff/list` - 分页查询员工
- `POST /staff/add` - 新增员工
- `POST /staff/update` - 更新员工

---

#### 2. OrgController - 组织管理接口

**类路径**: `com.tencent.hr.demo.controller.OrgController`  
**功能**: 演示组织信息管理接口

---

#### 3. FileController - 文件管理接口

**类路径**: `com.tencent.hr.demo.controller.FileController`  
**功能**: 演示文件上传下载接口（附件中台 SDK）

---

#### 4. RedissonController - 缓存测试接口

**类路径**: `com.tencent.hr.demo.controller.RedissonController`  
**功能**: 演示 Redisson 各种数据结构操作

---

### 工具类（基础设施）

> 🔧 通用工具类（framework 和 demo 都包含）

#### BeanCopyUtil - Bean 拷贝工具

**类路径**: `com.tencent.hr.demo.util.BeanCopyUtil`  
**功能**: 扩展 Spring BeanUtils，支持集合拷贝和回调函数

**核心方法**: `copyListProperties`

---

#### ErrorMailUtils - 错误邮件工具

**类路径**: `com.tencent.hr.demo.util.ErrorMailUtils`  
**功能**: 发送错误通知邮件

---

### Spring 配置类（基础设施）

> ⚙️ Spring Boot 配置（framework 和 demo 都包含）

**核心配置类**:
- `RedisConfig` - Redis 序列化配置
- `RedissonConfig` - Redisson 配置  
- `LettuceConfig` - Lettuce RESP2 协议配置
- `MybatisPlusConfig` - MyBatis-Plus 分页插件配置
- `MyWebMvcConfigurer` - Web MVC 拦截器配置

---

## 自定义组件（基础设施）

> 🎯 框架级基础组件（framework 和 demo 都包含）

### 注解

#### @Permission - 权限控制注解

**类路径**: `com.tencent.hr.server.annotation.Permission`  
**功能**: 方法级权限校验，配合 RightPermissionAspect 使用  
**使用示例**: `@Permission("UpdateStaff")`

---

#### @DistributedTryLock - 分布式锁注解

**类路径**: `com.tencent.hr.server.annotation.DistributedTryLock`  
**功能**: 基于 Redisson 的分布式锁注解，自动加锁/释放锁  
**使用示例**: `@DistributedTryLock(key = "lockKey", waitTime = 3, leaseTime = 10)`

---

### 拦截器

#### AccessLogInterceptor - 访问日志拦截器

**类路径**: `com.tencent.hr.server.interceptor.AccessLogInterceptor`  
**功能**: 全局访问日志采集（请求路径、参数、响应时间、用户信息）

---

#### SmartProxyAuth - 太湖认证拦截器

**类路径**: `com.tencent.hr.server.interceptor.SmartProxyAuth`  
**功能**: 企业 IT 太湖用户认证集成

---

### 切面

#### RightPermissionAspect - 权限校验切面

**类路径**: `com.tencent.hr.server.aspect.RightPermissionAspect`  
**功能**: 拦截 @Permission 注解，实现权限校验逻辑

---

#### DistributedTryLockAspect - 分布式锁切面

**类路径**: `com.tencent.hr.server.aspect.DistributedTryLockAspect`  
**功能**: 拦截 @DistributedTryLock 注解，自动管理分布式锁

---

### 全局异常处理

#### GlobalExceptionHandler - 全局异常处理器

**类路径**: `com.tencent.hr.server.exception.GlobalExceptionHandler`  
**功能**: 统一异常处理和响应格式化

**处理异常类型**:
- `BusinessException` - 业务异常
- `HttpRequestMethodNotSupportedException` - 请求方法不支持
- `Exception` - 通用异常

---

## 数据层

### 数据库配置

**MySQL 数据库**:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
```

**Redis 配置**:
```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      lettuce:
        pool:
          max-active: 200
          max-idle: 20
          min-idle: 5
```

### Entity 实体类（示例代码）

- `MdStdStaffInfo` - 员工信息实体
- `MdStdOrgBase` - 组织信息实体
- `App` - 应用信息实体
- `Appinfo` - 应用详情实体

### DTO/VO 模型类（示例代码）

- `MdStdStaffInfoDto` - 员工信息 DTO
- `MdStdOrgBaseDto` - 组织信息 DTO
- `StaffInfo` - 员工信息 VO
- `RedissonDemoDto` - Redisson 演示 DTO

### 枚举类（示例代码）

- `StaffStatusEnum` - 员工状态枚举
- `OrgTypeEnum` - 组织类型枚举

---

## 外部依赖

### 第三方 SDK

| SDK 名称 | 功能说明 | Maven Artifact |
|---------|---------|----------------|
| 附件中台 SDK | 文件上传、下载、预览 | `file-services-client` |
| 消息中台 SDK | 邮件、短信、企微消息发送 | `message-channel-service` |
| 工作流 SDK | 流程定义、审批管理 | `workflow-client` |
| 权限中台 SDK | 权限校验 | `right-platform-sdk` |
| 规则引擎 SDK | 业务规则执行 | `rule-engine-sdk` |

### 中间件服务

- **MySQL**: 关系型数据库（HikariCP 连接池）
- **Redis**: 缓存服务（Lettuce 客户端 + Redisson）
- **Apollo**: 配置中心（动态配置管理）
- **TSF**: 服务治理（微服务框架）

---

## 配置管理

### 依赖管理（Maven POM）

#### 父 POM 配置 (`pom.xml`)

**模块结构**:
```xml
<modules>
    <module>hrit-project-core</module>
    <module>hrit-project-spring-boot2-starter</module>
    <module>hrit-project-spring-boot2-demo</module>
    <module>hrit-project-spring-boot2-framework</module>
    <module>hrit-project-spring-boot3-starter</module>
    <module>hrit-project-spring-boot3-demo</module>
    <module>hrit-project-spring-boot3-framework</module>
</modules>
```

**核心版本配置**:
```xml
<properties>
    <java.version>17</java.version>
    <spring-boot3.version>3.1.12</spring-boot3.version>
    <spring-boot2.version>2.7.18</spring-boot2.version>
    <spring-cloud3.version>2022.0.5</spring-cloud3.version>
    <spring-cloud2.version>2021.0.9</spring-cloud2.version>
    <tsf.version>2.0.0.0-2021.0.9</tsf.version>
    <lombok.version>1.18.36</lombok.version>
    <hrit-sdk.version>0.1.6</hrit-sdk.version>
</properties>
```

**Maven 仓库配置**:
```xml
<repositories>
    <!-- 部门私有仓库（优先级最高） -->
    <repository>
        <id>hrsdc</id>
        <url>https://mirrors.tencent.com/repository/maven/hrsdc/</url>
    </repository>
    
    <!-- 快照仓库 -->
    <repository>
        <id>hrsdc-snapshot</id>
        <url>https://mirrors.tencent.com/repository/maven/hrsdc-snapshot/</url>
    </repository>
    
    <!-- Maven 中央仓库 -->
    <repository>
        <id>maven-public</id>
        <url>https://mirrors.tencent.com/nexus/repository/maven-public/</url>
    </repository>
    
    <!-- 第三方库 -->
    <repository>
        <id>thirdparty</id>
        <url>https://mirrors.tencent.com/repository/maven/thirdparty/</url>
    </repository>
    
    <!-- TSF 仓库 -->
    <repository>
        <id>tsf</id>
        <url>https://mirrors.tencent.com/repository/maven/tsf/</url>
    </repository>
</repositories>
```

---

### 应用配置文件

#### 1. 主配置文件 (`application.yml`)

**应用基础配置**:
```yaml
spring:
  application:
    name: hrit-project-spring-boot3-demo
  
  # 优雅关闭配置
  lifecycle:
    timeout-per-shutdown-phase: 30
  
  # 环境配置
  profiles:
    active: dev  # 可选: dev/test/uat/prod
  
  # 时间序列化格式
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
  
  # TSF 框架配置
  config:
    import: optional:polaris
  
  # 文件上传配置
  servlet:
    multipart:
      enabled: true
      file-size-threshold: 0
      location: "D:/files"  # 临时文件存储路径
      max-file-size: 100MB
      max-request-size: 256MB
      resolve-lazily: false
  
  # Spring Cloud 配置
  cloud:
    polaris:
      stat:
        enabled: false  # 关闭监控数据上报
    loadbalancer:
      cache:
        enabled: true
        ttl: 35s
        capacity: 1000
```

**服务器配置**:
```yaml
server:
  port: 8080
  shutdown: graceful  # 优雅关闭
  
  # Tomcat 配置
  tomcat:
    max-connections: 10000  # 最大连接数
    accept-count: 100       # 队列长度
    threads:
      max: 200              # 最大工作线程数
      min-spare: 10         # 最小工作线程数
  
  # 应用上下文路径
  servlet:
    context-path: /api
```

**MyBatis 配置**:
```yaml
mybatis:
  type-aliases-package: com.tencent.hr.demo.mapper
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
```

**健康检查配置**:
```yaml
management:
  server:
    port: 8081  # 独立端口
  endpoint:
    health:
      show-details: "NEVER"  # 生产环境建议 NEVER，调试时用 ALWAYS
```

---

#### 2. 开发环境配置 (`application-dev.yml`)

**数据库配置**:
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=UTF-8&serverTimezone=GMT%2B8&useSSL=false&autoReconnect=true&allowMultiQueries=true
    username: root
    password: your_password
    
    # HikariCP 连接池配置
    hikari:
      pool-name: MysqlConnectionPool
      connection-timeout: 30000      # 等待连接超时（毫秒）
      maximum-pool-size: 30          # 最大连接数
      max-lifetime: 1860000          # 连接最大生命周期（31分钟）
      minimum-idle: 5                # 最小空闲连接数
      idle-timeout: 600000           # 空闲超时（10分钟）
      auto-commit: true
      connection-test-query: SELECT 1
```

**Redis 配置**:
```yaml
spring:
  data:
    redis:
      host: localhost
      database: 1
      password: "your_password"
      port: 6379
      connect-timeout: 5000  # 连接超时（毫秒）
      timeout: 5000          # 读超时（毫秒）
      
      # Lettuce 连接池配置
      lettuce:
        pool:
          min-idle: 3        # 最小空闲连接
          max-idle: 8        # 最大空闲连接
          max-active: 50     # 最大活跃连接
          max-wait: 3000     # 获取连接最大等待时间（毫秒）
```

**框架自定义配置**:
```yaml
hr:
  server:
    # 太湖认证配置
    tof:
      enabled: true
      safe-mode: compatible  # 安全模式: compatible/safe
      rio-paas-id: your-app-id
      rio-token: your-app-token
      url-patterns:
        - /tof/*
    
    # 访客模式配置
    visitor:
      enabled: true
    
    # 访问日志配置
    visit-log:
      enabled: true
      include-request-body: true
      include-response-body: true
    
    # 告警配置
    alarm:
      enabled: true
      modes:
        EMAIL:
          title: ${spring.application.name}告警提示
          administrators: admin@example.com
    
    # 异常处理配置
    exception:
      enabled: true
      alarm-enabled: true
      logging-enabled: true
  
  # SDK 配置
  sdk:
    # 应用配置
    app:
      appName: sdc-std-scaffold-java
      appToken: your-app-token
    
    # 消息中台配置
    message:
      enabled: true
    
    # 工作流配置
    workflow:
      enabled: true
      appCode: testApp
      mgmtUrl: http://dev-ntsgw.woa.com/api/esb/workflow-mgmt-service/api
      baseUrl: http://dev-ntsgw.woa.com/api/esb/workflow-service/api
    
    # 附件中台配置
    hrfile:
      enabled: true
    
    # 本地缓存配置
    local-cache:
      initial-capacity: 32
      maximum-size: 2000
      overflow-ratio: 0.5
      expire-after-write-seconds: 7200   # 写入后过期时间（2小时）
      expire-after-access-seconds: 1800  # 访问后过期时间（30分钟）

# 错误邮件配置
email-warning:
  errorMailTo: "admin@example.com"
  flag: "false"  # 本地开发设为 false

# 太湖 Token
taihu:
  token: your-taihu-token
```

---

#### 3. 其他环境配置

- **`application-test.yml`** - 测试环境配置
- **`application-uat.yml`** - UAT 环境配置
- **`application-prod.yml`** - 生产环境配置

> **说明**: 各环境配置文件结构与 `application-dev.yml` 相同，仅修改具体的连接地址、账号密码等参数。

---

### 日志配置

#### Logback 配置 (`logback-spring.xml`)

**日志级别**: TRACE < DEBUG < INFO < WARN < ERROR < FATAL

**核心配置**:
```xml
<configuration scan="true" scanPeriod="60 seconds">
    <!-- 应用名称 -->
    <springProperty scope="context" name="applicationName" 
                    source="spring.application.name"/>
    
    <!-- 日志文件路径 -->
    <property name="LOG_HOME" value="${LOG_PATH:-./logs}"/>
    
    <!-- 单个日志文件最大大小 -->
    <property name="maxFileSize" value="100MB"/>
    
    <!-- 日志输出格式 -->
    <property name="LOG_PATTERN"
              value="%green(%d{yyyy-MM-dd HH:mm:ss.SSS}) %highlight(%-5level) 
                     [%yellow(${applicationName})] [%magenta(%thread)] 
                     [%tid,%X{traceId},%X{spanId}] %cyan(%logger{36}) --- %msg%n"/>
</configuration>
```

**日志输出策略**:
- **控制台输出**: 彩色日志，便于本地开发调试
- **文件输出**: 
  - 所有日志 → `logs/all.log`
  - INFO 级别 → `logs/info.log`
  - WARN 级别 → `logs/warn.log`
  - ERROR 级别 → `logs/error.log`

**滚动策略**:
- 按时间滚动: 每天生成新文件
- 按大小滚动: 单文件超过 100MB 自动分割
- 保留天数: 默认 30 天

**MDC 参数**（用于链路追踪）:
- `applicationName` - 应用名称
- `tId` - 事务 ID（TSF）
- `traceId` - 跟踪 ID（跨服务）
- `spanId` - 跨度 ID（服务内部）

---

### 配置文件目录结构

```
src/main/resources/
├── application.yml              # 主配置文件
├── application-dev.yml          # 开发环境配置
├── application-test.yml         # 测试环境配置
├── application-uat.yml          # UAT 环境配置
├── application-prod.yml         # 生产环境配置
├── bootstrap-local.yml          # 本地启动配置（Apollo）
├── logback-spring.xml           # 标准日志配置
├── logback-async.xml            # 异步日志配置（高性能）
└── mapper/                      # MyBatis Mapper XML 文件
    ├── AppMapper.xml
    ├── AppinfoMapper.xml
    ├── MdStdStaffInfoMapper.xml
    └── MdStdOrgBaseMapper.xml
```

---

### 配置优先级

1. **命令行参数** (最高优先级)
   ```bash
   java -jar app.jar --spring.profiles.active=prod --server.port=9090
   ```

2. **系统环境变量**
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   ```

3. **配置文件**
   - `application-{profile}.yml` (环境特定配置)
   - `application.yml` (通用配置)

4. **Apollo 配置中心** (动态配置)
   ```yaml
   apollo:
     config-service: http://config.example.com
     env: dev
   ```

---

### 配置最佳实践

#### 1. 敏感信息保护

❌ **不推荐**: 明文存储密码
```yaml
spring:
  datasource:
    password: mypassword123
```

✅ **推荐**: 使用环境变量或配置中心
```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}  # 从环境变量读取
```

#### 2. 多环境配置

✅ **推荐**: 使用 profile 分离配置
```bash
# 开发环境
mvn spring-boot:run -Dspring.profiles.active=dev

# 生产环境
java -jar app.jar --spring.profiles.active=prod
```

#### 3. 配置外部化

✅ **推荐**: 将配置文件放在 jar 包外部
```bash
java -jar app.jar --spring.config.location=/path/to/config/
```

#### 4. 动态配置

✅ **推荐**: 使用 Apollo 配置中心进行动态配置管理
```yaml
apollo:
  config-service: http://apollo.example.com
  env: ${ENV:dev}
  cluster: ${CLUSTER:default}
```

---

### 配置参数速查表

| 配置项 | 默认值 | 说明 | 调优建议 |
|--------|--------|------|---------|
| `server.port` | 8080 | 服务端口 | 生产环境建议 80/443 |
| `server.tomcat.max-connections` | 10000 | 最大连接数 | 根据并发量调整 |
| `server.tomcat.threads.max` | 200 | 最大线程数 | CPU 核数 * 2 ~ 4 |
| `spring.datasource.hikari.maximum-pool-size` | 30 | 数据库连接池最大连接数 | 根据数据库性能调整 |
| `spring.datasource.hikari.minimum-idle` | 5 | 最小空闲连接 | 保持一定预热连接 |
| `spring.data.redis.lettuce.pool.max-active` | 50 | Redis 最大活跃连接 | 根据 Redis 性能调整 |
| `spring.data.redis.timeout` | 5000 | Redis 读超时（毫秒） | 建议 3000-10000 |
| `logging.level.root` | INFO | 根日志级别 | 生产环境建议 WARN |

---

## 使用示例

### 1. 员工信息查询示例

```java
@Autowired
private MdStdStaffInfoService staffInfoService;

// 分页查询员工
MdStdStaffInfo condition = new MdStdStaffInfo();
condition.setOrgId(1001);
PageInfo<MdStdStaffInfoDto> page = staffInfoService.selectByCondition(condition, 1, 10);
```

### 2. Redisson 缓存示例

```java
@Autowired
private RedissonService redissonService;

// 字符串缓存
redissonService.setString("key1", "value1", 3600);
String value = redissonService.getString("key1");

// Map 缓存
RedissonDemoDto.PutMapReq req = new RedissonDemoDto.PutMapReq();
req.setKey("map1");
req.setData(Map.of("field1", "value1"));
redissonService.mapPut(req);
```

### 3. 分布式锁示例

```java
@Autowired
private RedissonService redissonService;

// 获取锁
boolean locked = redissonService.getTryLock("order_123", TimeUnit.SECONDS, 3, 10);
if (locked) {
    try {
        // 业务逻辑
    } finally {
        redissonService.unlock("order_123");
    }
}
```

### 4. 文件上传下载示例

```java
@Autowired
private FileService fileService;

// 文件上传
String uuid = fileService.uploadFile(multipartFile);

// 文件下载
fileService.download(uuid, response);
```

### 5. 权限控制示例

```java
@RestController
@RequestMapping("/staff")
public class StaffController {
    
    @PostMapping("/update")
    @Permission("UpdateStaff")  // 需要 UpdateStaff 权限
    public ResponseInfo<?> updateStaff(@RequestBody StaffInfo staffInfo) {
        // 业务逻辑
    }
}
```

---

## 注意事项

1. **环境切换**: 通过 `spring.profiles.active` 参数切换环境（dev/test/uat/prod）
2. **数据库连接**: 确保 MySQL 版本 5.7+ 或 8.0+
3. **Redis 协议**: 使用 RESP2 协议，避免连接授权异常
4. **大批量数据**: 推荐使用 BATCH 模式，单次插入建议不超过 1 万条
5. **事务传播**: 注意 REQUIRED 和 REQUIRES_NEW 的区别
6. **权限校验**: @Permission 注解需要配置权限中台 SDK
7. **分布式锁**: 注意锁的等待时间和自动释放时间设置
8. **日志配置**: 日志文件默认保存 30 天，按天滚动

---

## 快速开始

### 1. 创建新项目

```bash
# 复制 framework 模块到新项目
cp -r hrit-project-spring-boot3-framework my-new-project

# 修改 pom.xml 中的 artifactId 和 groupId
# 修改 application.yml 中的应用名称
```

### 2. 配置数据库

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_db
    username: your_username
    password: your_password
```

### 3. 启动应用

```bash
# 开发环境启动
mvn spring-boot:run -Dspring.profiles.active=dev

# 或使用脚本
./build/build.sh
```

### 4. 验证服务

访问健康检查接口:
```
http://localhost:8080/actuator/health
```

---

## 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    Controller 层                         │
│  (RESTful API, 参数校验, 权限控制, 统一响应)               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Service 层                           │
│  (业务逻辑, 事务管理, 缓存处理, SDK 调用)                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Mapper 层                            │
│  (MyBatis-Plus, 数据访问, SQL 映射)                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌──────────────┬──────────────┬───────────────┬───────────┐
│    MySQL     │    Redis     │  附件中台      │  消息中台  │
│  (数据存储)   │   (缓存)     │  (文件服务)    │ (消息服务) │
└──────────────┴──────────────┴───────────────┴───────────┘
```

---

**文档生成日期**: 2025-11-12  
**文档版本**: v1.0  
**维护人**: AI Assistant
