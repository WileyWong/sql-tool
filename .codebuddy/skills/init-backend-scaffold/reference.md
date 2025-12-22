---
name: init-backend-scaffold
type: reference
description: 初始化后端脚手架 - 详细参考文档
---

# 初始化后端脚手架 - 详细参考文档

## 深入理解后端脚手架

### 什么是后端脚手架？

后端脚手架是一个预配置的 Spring Boot 项目模板，包含：
- 项目结构和目录组织
- Maven 配置和依赖管理
- Spring Boot 配置和自动配置
- 数据库配置和 ORM 框架
- 日志配置和监控
- 示例代码和最佳实践

使用后端脚手架的好处：
- ✅ 快速启动项目，无需从零开始
- ✅ 统一团队的项目结构和规范
- ✅ 包含最佳实践和优化配置
- ✅ 减少初始化时间和错误

### 后端脚手架初始化流程

```
克隆脚手架 → 选择 Spring Boot 版本 → 初始化 Git → 改造配置 → 验证完整性
```

---

## 详细操作指南

### 1. 创建项目的两种方式

#### 方式对比

| 特性 | Maven Archetype | Git 克隆 |
|------|----------------|----------|
| **前置条件** | 需要 Maven 3.6+ | 需要 Git |
| **速度** | 快速（几秒钟） | 较慢（需要克隆整个仓库） |
| **配置** | 自动配置包名和项目名 | 需要手动修改配置 |
| **网络要求** | 需要访问 Maven 仓库 | 需要访问 Git 仓库 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

#### 方式 A: Maven Archetype（推荐）

**检查 Maven 是否已安装**:
```bash
mvn -version
# 应该显示 Maven 版本信息，如：
# Apache Maven 3.8.6
# Maven home: /usr/local/maven
# Java version: 17.0.5
```

##### 信息收集流程

使用 Maven Archetype 方式需要先收集以下信息：

**1. Spring Boot 版本选择**

| 选项 | 版本 | Java 要求 | 推荐度 | 说明 |
|------|------|----------|--------|------|
| 选项 1 | Spring Boot 3.x | Java 17+ | ⭐⭐⭐⭐⭐ | 最新稳定版，推荐使用 |
| 选项 2 | Spring Boot 2.x | Java 11+ | ⭐⭐⭐ | 兼容旧版 Java |

**2. 项目包名（groupId）选择**

| 选项 | 包名 | 适用场景 | 示例 |
|------|------|---------|------|
| 选项 1 | `com.tencent.hr` | 腾讯 HR 团队项目 | `com.tencent.hr.user` |
| 选项 2 | `com.example` | 示例/学习项目 | `com.example.demo` |
| 选项 3 | 自定义 | 公司正式项目 | `com.company.project` |

**包名规范**:
- 全小写字母
- 使用点号（.）分隔
- 通常采用反向域名格式
- 避免使用 Java 关键字
- 示例：`com.company.department.project`

**3. 项目名称（artifactId）输入**

**命名规范**:
- 使用小写字母
- 多个单词用连字符（-）分隔
- 简洁且具有描述性
- 长度建议 2-4 个单词

**命名示例**:
- ✅ `user-service`（用户服务）
- ✅ `order-management`（订单管理）
- ✅ `payment-gateway`（支付网关）
- ✅ `product-catalog`（产品目录）
- ❌ `UserService`（避免大写）
- ❌ `user_service`（避免下划线）
- ❌ `us`（太简短，不够描述性）

##### 执行 Maven 命令

根据收集的信息，执行相应的命令：

**创建 Spring Boot 3.x 项目**:
```bash
mvn archetype:generate -U \
  -DarchetypeGroupId=com.tencent.hr.archetype \
  -DarchetypeArtifactId=hrit-project-spring-boot3-demo-archetype \
  -DarchetypeVersion=0.0.2-SNAPSHOT \
  -DgroupId={步骤2中选择的包名} \
  -DartifactId={步骤3中输入的项目名}
```

**创建 Spring Boot 2.x 项目**:
```bash
mvn archetype:generate -U \
  -DarchetypeGroupId=com.tencent.hr.archetype \
  -DarchetypeArtifactId=hrit-project-spring-boot2-demo-archetype \
  -DarchetypeVersion=0.0.2-SNAPSHOT \
  -DgroupId={步骤2中选择的包名} \
  -DartifactId={步骤3中输入的项目名}
```

**完整示例**（选项 1 + 选项 1 + user-service）:
```bash
# Spring Boot 3.x + com.tencent.hr + user-service
mvn archetype:generate -U \
  -DarchetypeGroupId=com.tencent.hr.archetype \
  -DarchetypeArtifactId=hrit-project-spring-boot3-demo-archetype \
  -DarchetypeVersion=0.0.2-SNAPSHOT \
  -DgroupId=com.tencent.hr \
  -DartifactId=user-service
```

**参数说明**:
- `-U`: 强制更新快照版本
- `-DarchetypeGroupId`: Archetype 的 groupId
- `-DarchetypeArtifactId`: Archetype 的 artifactId（区分 Spring Boot 版本）
- `-DarchetypeVersion`: Archetype 的版本号
- `-DgroupId`: 新项目的包名（从信息收集步骤 2 获取）
- `-DartifactId`: 新项目的名称（从信息收集步骤 3 获取）

**优势**:
- ✅ 自动配置项目结构和包名
- ✅ 无需手动修改 pom.xml
- ✅ 更快速、更标准化
- ✅ 避免手动配置错误
- ✅ 通过选项减少用户输入错误

#### 方式 B: Git 克隆（备选）

**基本命令**:
```bash
# 克隆脚手架仓库
git clone https://git.woa.com/hr-team/sdc-std-devkit-team/sdc-std-scaffold-java.git temp-scaffold
cd temp-scaffold

# 根据 Spring Boot 版本选择对应的项目目录
# Spring Boot 3.x（默认）
cp -r hrit-project-spring-boot3-demo ../{project-name}

# 或者 Spring Boot 2.x
# cp -r hrit-project-spring-boot2-demo ../{project-name}

# 进入项目目录
cd ../{project-name}

# 删除临时目录
rm -rf ../temp-scaffold
```

#### 脚手架结构说明

脚手架包含以下主要目录：
- `hrit-project-spring-boot2-demo/` - Spring Boot 2.x 演示项目
- `hrit-project-spring-boot2-framework/` - Spring Boot 2.x 框架项目
- `hrit-project-spring-boot3-demo/` - Spring Boot 3.x 演示项目（推荐）
- `hrit-project-spring-boot3-framework/` - Spring Boot 3.x 框架项目
- `hrit-project-core/` - 核心库

#### 常见问题排查

**Maven Archetype 方式**:

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `mvn: command not found` | Maven 未安装 | 安装 Maven 或使用 Git 克隆方式 |
| `Unable to find archetype` | Archetype 版本不存在 | 检查版本号是否正确 |
| `Connection refused` | 无法访问 Maven 仓库 | 检查网络连接和 Maven 配置 |

**Git 克隆方式**:

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `fatal: unable to access` | 网络问题或权限问题 | 检查网络连接，确认有访问权限 |
| `Repository not found` | 仓库地址错误 | 验证仓库地址是否正确 |
| `Permission denied` | SSH 密钥问题 | 配置 SSH 密钥或使用 HTTPS |

---

### 2. Maven Archetype 详细说明

#### 什么是 Maven Archetype？

Maven Archetype 是一个项目模板工具，可以快速生成符合特定结构的项目。它的优势在于：
- 自动配置项目结构
- 自动替换包名和项目名
- 确保项目配置的一致性
- 避免手动修改配置文件

#### 交互式创建

如果不想在命令行中指定所有参数，可以使用交互式模式：

```bash
mvn archetype:generate -U \
  -DarchetypeGroupId=com.tencent.hr.archetype \
  -DarchetypeArtifactId=hrit-project-spring-boot3-demo-archetype \
  -DarchetypeVersion=0.0.2-SNAPSHOT
```

Maven 会提示你输入：
- `groupId`: 输入包名（如 `com.example`）
- `artifactId`: 输入项目名（如 `user-service`）
- `version`: 输入版本号（默认 `1.0-SNAPSHOT`）
- `package`: 输入包名（默认与 groupId 相同）

#### 批处理模式

如果想跳过确认提示，可以添加 `-B` 参数：

```bash
mvn archetype:generate -B -U \
  -DarchetypeGroupId=com.tencent.hr.archetype \
  -DarchetypeArtifactId=hrit-project-spring-boot3-demo-archetype \
  -DarchetypeVersion=0.0.2-SNAPSHOT \
  -DgroupId=com.example \
  -DartifactId=user-service \
  -Dversion=0.1.0
```

#### 验证 Archetype 创建的项目

```bash
# 进入项目目录
cd user-service

# 查看项目结构
tree -L 3

# 查看 pom.xml
cat pom.xml | grep -E "<groupId>|<artifactId>|<version>"

# 编译项目
mvn clean compile
```

---

### 3. 初始化 Git 仓库

#### 完整步骤

```bash
# 进入项目目录
cd {project-name}

# 初始化新的 Git 仓库
git init

# 配置 Git 用户信息
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 添加所有文件到暂存区
git add .

# 创建初始提交
git commit -m "chore: initial commit from scaffold"

# 验证
git log
```

---

### 4. 改造项目配置（仅 Git 克隆方式需要）

> **注意**: 如果使用 Maven Archetype 方式创建项目，此步骤可以跳过，因为项目配置已自动完成。

#### pom.xml 配置

**需要修改的字段**:

```xml
<groupId>com.example</groupId>              <!-- 包名前缀 -->
<artifactId>user-service</artifactId>       <!-- 项目名称 -->
<version>0.1.0</version>                    <!-- 项目版本 -->
<name>User Service</name>                   <!-- 项目显示名称 -->
<description>用户管理服务</description>      <!-- 项目描述 -->

<!-- Java 版本配置 -->
<properties>
  <java.version>17</java.version>
  <maven.compiler.source>17</maven.compiler.source>
  <maven.compiler.target>17</maven.compiler.target>
</properties>
```

**修改方法**:

方法 1：使用编辑器直接修改
```bash
# 使用 VS Code 打开
code pom.xml

# 使用 Vim 编辑
vim pom.xml
```

方法 2：使用 Maven 命令修改
```bash
# 修改项目信息
mvn org.codehaus.mojo:versions-maven-plugin:2.8.1:set -DnewVersion=0.1.0
```

#### application.yml 配置

**基本配置**:

```yaml
spring:
  application:
    name: user-service
  
  # 数据库配置
  datasource:
    url: jdbc:mysql://localhost:3306/user_service?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  # JPA 配置
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  
  # 日志配置
  logging:
    level:
      root: INFO
      com.example: DEBUG

# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# 应用配置
app:
  name: User Service
  version: 0.1.0
```

**环境特定配置**:

创建 `application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/user_service_dev
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

server:
  port: 8080
```

创建 `application-prod.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/user_service
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

server:
  port: 8080
```

#### README.md 改造

**需要修改的内容**:

```markdown
# User Service

用户管理服务，提供用户注册、登录、信息管理等功能。

## 功能特性

- 用户注册和登录
- 用户信息管理
- 密码修改和重置
- 用户列表查看（管理员）
- 用户权限管理（管理员）

## 快速开始

### 前置要求

- Java 17+
- Maven 3.6+
- MySQL 5.7+

### 安装依赖

\`\`\`bash
mvn clean install
\`\`\`

### 启动应用

\`\`\`bash
mvn spring-boot:run
\`\`\`

或者构建 JAR 包：

\`\`\`bash
mvn clean package
java -jar target/user-service-0.1.0.jar
\`\`\`

### 访问应用

- API 文档: http://localhost:8080/api/swagger-ui.html
- 健康检查: http://localhost:8080/api/actuator/health

## 项目结构

\`\`\`
src/
├── main/
│   ├── java/
│   │   └── com/example/userservice/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── entity/
│   │       ├── dto/
│   │       ├── config/
│   │       └── UserServiceApplication.java
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── db/
│           └── schema.sql
└── test/
    └── java/
        └── com/example/userservice/
```

## 开发规范

- 遵循 Google Java 编码规范
- 使用 Lombok 简化代码
- 编写单元测试和集成测试
- 使用 Swagger 文档化 API

## 许可证

MIT
```

---

### 5. 改造项目内容（可选）

#### 项目结构调整

**重命名包名**:

```bash
# 原始包名: com.example.scaffold
# 新包名: com.example.userservice

# 使用 IDE 的重构功能（推荐）
# 或者手动重命名目录
mv src/main/java/com/example/scaffold src/main/java/com/example/userservice
mv src/test/java/com/example/scaffold src/test/java/com/example/userservice
```

**创建项目结构**:

```bash
# 创建必要的目录
mkdir -p src/main/java/com/example/userservice/{controller,service,repository,entity,dto,config}
mkdir -p src/main/resources/db
mkdir -p src/test/java/com/example/userservice/{controller,service}
```

#### 源代码修改

**修改启动类**:

```java
// 原始
package com.example.scaffold;

@SpringBootApplication
public class ScaffoldApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScaffoldApplication.class, args);
    }
}

// 修改后
package com.example.userservice;

@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

**修改配置类**:

```java
// 更新包名和类名
package com.example.userservice.config;

@Configuration
public class UserServiceConfig {
    // 配置内容
}
```

#### 数据库脚本修改

```sql
-- 原始
CREATE TABLE scaffold_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- 修改后
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 6. 依赖管理

#### 查看依赖

```bash
# 查看依赖树
mvn dependency:tree

# 查看过期的依赖
mvn versions:display-dependency-updates
```

#### 添加新依赖

```bash
# 添加依赖到 pom.xml
mvn dependency:get -Dartifact=org.springframework.boot:spring-boot-starter-web:3.0.0
```

或者直接编辑 `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

#### 常见依赖

```xml
<!-- Web 框架 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- 数据库 ORM -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL 驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Swagger -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.0</version>
</dependency>

<!-- 测试 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

### 7. 编译和运行

#### 编译项目

```bash
# 清理并编译
mvn clean compile

# 只编译
mvn compile

# 编译并跳过测试
mvn clean compile -DskipTests
```

#### 运行测试

```bash
# 运行所有测试
mvn test

# 运行特定测试类
mvn test -Dtest=UserServiceTest

# 运行特定测试方法
mvn test -Dtest=UserServiceTest#testCreateUser
```

#### 启动应用

```bash
# 使用 Maven 插件启动
mvn spring-boot:run

# 指定环境
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# 构建 JAR 包
mvn clean package

# 运行 JAR 包
java -jar target/user-service-0.1.0.jar

# 指定环境运行
java -jar target/user-service-0.1.0.jar --spring.profiles.active=prod
```

#### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 编译失败 | Java 版本不兼容 | 检查 Java 版本，更新 pom.xml |
| 依赖冲突 | 依赖版本冲突 | 运行 `mvn dependency:tree` 查看冲突 |
| 启动失败 | 配置错误 | 检查 application.yml 配置 |
| 数据库连接失败 | 数据库未启动 | 启动数据库，检查连接信息 |

---

## 高级技巧

### 1. 使用自动化脚本初始化

参考 [scripts/](./scripts/) 目录中的脚本。

### 2. 多环境配置

```yaml
# application.yml
spring:
  profiles:
    active: dev

---
# application-dev.yml
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/user_service_dev

---
# application-prod.yml
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-db:3306/user_service
```

### 3. Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/user-service-0.1.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建和运行：

```bash
# 构建 Docker 镜像
docker build -t user-service:0.1.0 .

# 运行容器
docker run -p 8080:8080 user-service:0.1.0
```

### 4. 性能优化

**JVM 参数优化**:

```bash
java -Xms512m -Xmx1024m -XX:+UseG1GC -jar target/user-service-0.1.0.jar
```

**数据库连接池优化**:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

---

## 总结

初始化后端脚手架是一个系统化的过程，包括克隆、配置、改造和验证。通过遵循本指南，你可以快速创建符合团队规范的后端项目。
