# 新建后端项目模板

## 项目信息

**项目名称**: [项目名称]

**项目描述**: [项目描述]

**项目类型**: 新建项目

**开发周期**: [开始日期] - [结束日期]

**负责人**: [负责人姓名]

**团队成员**: [成员列表]

## 技术栈

### 核心框架
- **开发语言**: Java 17 / Node.js 18 / Python 3.11
- **Web 框架**: Spring Boot 3.0 / NestJS / FastAPI
- **ORM 框架**: MyBatis Plus / TypeORM / SQLAlchemy
- **数据库**: MySQL 8.0 / PostgreSQL 14
- **缓存**: Redis 7.0
- **消息队列**: RabbitMQ / Kafka

### 开发工具
- **构建工具**: Maven / Gradle / npm / pip
- **代码规范**: Checkstyle / ESLint / Pylint
- **单元测试**: JUnit 5 / Jest / Pytest
- **API 文档**: OpenAPI 规范

### 中间件
- **配置中心**: Apollo / Nacos
- **服务注册**: Eureka / Consul
- **API 网关**: Spring Cloud Gateway / Kong
- **链路追踪**: SkyWalking / Jaeger

## 项目结构

### Java Spring Boot 项目

```
project-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/project/
│   │   │       ├── ProjectApplication.java    # 启动类
│   │   │       ├── config/                    # 配置类
│   │   │       ├── controller/                # 控制器
│   │   │       ├── service/                   # 服务层
│   │   │       │   └── impl/                  # 服务实现
│   │   │       ├── dao/                       # 数据访问层
│   │   │       ├── entity/                    # 实体类
│   │   │       ├── dto/                       # 数据传输对象
│   │   │       ├── vo/                        # 视图对象
│   │   │       ├── enums/                     # 枚举类
│   │   │       ├── exception/                 # 异常类
│   │   │       ├── util/                      # 工具类
│   │   │       └── constant/                  # 常量类
│   │   └── resources/
│   │       ├── application.yml                # 配置文件
│   │       ├── application-dev.yml            # 开发环境配置
│   │       ├── application-test.yml           # 测试环境配置
│   │       ├── application-prod.yml           # 生产环境配置
│   │       ├── mapper/                        # MyBatis Mapper XML
│   │       └── db/
│   │           └── migration/                 # 数据库迁移脚本
│   └── test/
│       └── java/
│           └── com/company/project/
│               ├── controller/                # 控制器测试
│               ├── service/                   # 服务测试
│               └── dao/                       # DAO 测试
├── docs/                                      # 文档
│   ├── api/                                   # API 文档
│   ├── design/                                # 设计文档
│   └── deploy/                                # 部署文档
├── scripts/                                   # 脚本
│   ├── build.sh                               # 构建脚本
│   └── deploy.sh                              # 部署脚本
├── pom.xml                                    # Maven 配置
└── README.md                                  # 项目说明
```

## 核心功能模块

### 1. 用户管理模块

**功能描述**: 用户注册、登录、权限管理

**数据库表**:
- `users` - 用户表
- `roles` - 角色表
- `permissions` - 权限表
- `user_roles` - 用户角色关联表
- `role_permissions` - 角色权限关联表

**API 接口**:
- `POST /api/v1/users/register` - 用户注册
- `POST /api/v1/users/login` - 用户登录
- `GET /api/v1/users/{id}` - 获取用户信息
- `PUT /api/v1/users/{id}` - 更新用户信息
- `DELETE /api/v1/users/{id}` - 删除用户

**技术要点**:
- JWT Token 认证
- 密码加密 (BCrypt)
- RBAC 权限控制

### 2. [其他模块]

*根据实际项目补充*

## 数据库设计

### 核心表结构

#### users 表

```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-正常, 2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

*更多表结构参考 [数据库设计文档](../../design/database-design-template.md)*

## API 设计

### RESTful API 规范

- 使用 HTTP 动词: GET, POST, PUT, DELETE
- 使用复数名词: `/api/v1/users`
- 使用版本号: `/api/v1/`
- 使用 HTTP 状态码: 200, 201, 400, 401, 403, 404, 500

### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin"
  }
}
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 数据不存在 |
| 1003 | 数据已存在 |
| 2001 | 未登录 |
| 2002 | 无权限 |
| 5000 | 系统错误 |

*更多 API 设计参考 [API 设计规范](../../standards/backend/api.md)*

## 开发规范

### 命名规范
- 类名: PascalCase (如: `UserService`)
- 方法名: camelCase (如: `getUserById`)
- 常量名: UPPER_SNAKE_CASE (如: `MAX_RETRY_COUNT`)
- 包名: 小写字母 (如: `com.company.project`)

### 代码规范
- 遵循 [后端编码规范](../../standards/backend/codestyle.md)
- 使用 Checkstyle / ESLint 自动检查
- 提交前进行代码审查

### Git 规范
- 分支命名: `feature/xxx`, `bugfix/xxx`, `hotfix/xxx`
- 提交信息: `type(scope): subject`
  - type: feat, fix, docs, style, refactor, test, chore
  - scope: 影响范围
  - subject: 简短描述

## 部署方案

### 开发环境
- 环境地址: http://dev-api.example.com
- 部署方式: 自动部署 (Git Push)
- 数据库: dev-db.example.com

### 测试环境
- 环境地址: http://test-api.example.com
- 部署方式: 自动部署 (Git Tag)
- 数据库: test-db.example.com

### 生产环境
- 环境地址: https://api.example.com
- 部署方式: 手动部署 (审批后)
- 数据库: prod-db.example.com

### Docker 部署

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 测试方案

### 单元测试
- 测试框架: JUnit 5 / Jest / Pytest
- 覆盖率要求: 80%+
- Mock 工具: Mockito / Jest Mock

### 集成测试
- 测试框架: Spring Boot Test / Supertest
- 测试场景: API 接口测试

### 性能测试
- 测试工具: JMeter / Gatling
- 测试指标: QPS, 响应时间, 错误率

## 监控与日志

### 日志规范
- 日志级别: DEBUG, INFO, WARN, ERROR
- 日志格式: `[时间] [级别] [类名] - 日志内容`
- 日志存储: 文件 + ELK

### 性能监控
- 工具: Prometheus + Grafana
- 指标: CPU, 内存, QPS, 响应时间

### 错误监控
- 工具: Sentry / Fundebug
- 上报: 自动上报 + 手动上报

## 安全方案

### 认证授权
- JWT Token 认证
- RBAC 权限控制
- OAuth 2.0 (可选)

### 数据安全
- 密码加密 (BCrypt)
- 敏感数据加密 (AES)
- SQL 注入防护
- XSS 防护

### 接口安全
- 接口签名验证
- 接口限流
- IP 白名单

## 常见问题

### Q1: 如何处理并发问题?
A: 使用分布式锁 (Redis / Redisson)

### Q2: 如何优化数据库查询?
A: 添加索引 + 查询优化 + 缓存

### Q3: 如何处理大文件上传?
A: 分片上传 + 断点续传

## 参考资料

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MyBatis Plus 官方文档](https://baomidou.com/)
- [Redis 官方文档](https://redis.io/)
