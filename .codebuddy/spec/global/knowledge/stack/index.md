# 技术栈文档索引

> 本索引文件基于技术栈目录结构生成，用于快速定位架构建设和代码生成的权威技术参考
> 
> **生成时间**: 2025-11-13
> **文档总数**: 15 个技术栈文档
> **涵盖领域**: 前端框架、后端架构、数据库、缓存、搜索引擎、消息队列、对象存储

## 📚 快速导航

- [📁 前端技术栈](#前端技术栈)
- [📁 后端技术栈](#后端技术栈)  
- [📁 数据库技术](#数据库技术)
- [📁 缓存系统](#缓存系统)
- [📁 搜索引擎](#搜索引擎)
- [📁 消息队列](#消息队列)
- [📁 对象存储](#对象存储)
- [🎯 技术选型指南](#技术选型指南)
- [⚡ 代码生成规范](#代码生成规范)

## 🎯 核心推荐

| 技术领域 | 推荐文档 | 优先级 | 用途 |
|---------|---------|--------|------|
| **Vue 3 开发** | `vue3.md` | ⭐⭐⭐⭐⭐ | 现代前端架构、Composition API |
| **Spring Boot** | `springboot3.md` | ⭐⭐⭐⭐⭐ | Java 后端架构、微服务 |
| **数据持久化** | `mybatis_plus.md` | ⭐⭐⭐⭐⭐ | 快速开发、CRUD 增强 |
| **Redis 集成** | `spring_data_redis.md` | ⭐⭐⭐⭐⭐ | 缓存、会话管理 |
| **MongoDB** | `spring_data_mongodb.md` | ⭐⭐⭐⭐⭐ | NoSQL数据库、文档存储 |
| **搜索引擎** | `sping_data_elasticsearch.md` | ⭐⭐⭐⭐⭐ | 全文搜索、数据分析 |
| **MySQL 优化** | `mysql.md` | ⭐⭐⭐⭐⭐ | 数据库设计、性能调优 |
| **消息队列** | `spring_kafka.md` | ⭐⭐⭐⭐⭐ | 事件驱动、异步处理 |
| **对象存储** | `tencent_cloud_cos_java_sdk.md` | ⭐⭐⭐⭐⭐ | 文件存储、CDN加速 |

---

## 📁 前端技术栈

> 现代前端开发框架和工具，支持组件化开发、状态管理和响应式设计

### 📄 Vue 3 开发指南

- **文件路径**: `vue3.md`
- **用途**: Vue 3 官方文档，提供 Composition API、响应式系统和组件开发的完整指南
- **主要内容**: 
  - Composition API 和 `<script setup>` 语法
  - 响应式系统和状态管理
  - 组件架构和 TypeScript 集成
  - 模板语法和指令系统
- **文档规模**: 27.62 KB，包含完整的 API 参考和示例
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Vue 开发首选]**

---

### 📄 Vue 2 完整参考

- **文件路径**: `vue2.md`
- **用途**: Vue 2 完整 API 参考文档，适用于维护现有 Vue 2 项目
- **主要内容**: 
  - Options API 完整文档
  - 组件系统和生命周期
  - 指令和过滤器
  - 插件和混入机制
- **文档规模**: 29.97 KB，1395 行完整参考
- **推荐指数**: ⭐⭐⭐⭐ **[Vue 2 项目维护]**

---

## 📁 后端技术栈

> Java 生态系统的企业级后端开发框架，包含 Spring Boot、数据访问层等

### 📄 Spring Boot 3 架构指南

- **文件路径**: `springboot3.md`
- **用途**: Spring Boot 3.x 官方代码片段集合，提供完整的企业级后端开发方案
- **主要内容**: 
  - Maven/Gradle 项目配置
  - Web 开发和 REST API
  - Actuator 监控和健康检查
  - 测试框架和最佳实践
- **文档规模**: 106.47 KB，包含大量可直接使用的代码示例
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Spring Boot 架构首选]**

---

### 📄 Spring Boot 4 新特性

- **文件路径**: `springboot4.md`
- **用途**: Spring Boot 4.0 完整框架指南，包含最新特性和未来技术预研
- **主要内容**: 
  - 虚拟线程支持
  - 增强观测性功能
  - 现代化开发模式
  - 性能优化特性
- **文档规模**: 31.89 KB，936 行新特性指南
- **推荐指数**: ⭐⭐⭐⭐ **[新特性参考]**

---

### 📄 MyBatis-Plus 增强工具

- **文件路径**: `mybatis_plus.md`
- **用途**: MyBatis-Plus 增强工具完整指南，提供零侵入的 CRUD 增强功能
- **主要内容**: 
  - CRUD 增强和 Lambda 表达式
  - 代码生成器和分页插件
  - 条件构造器和性能优化
  - 多租户和数据权限
- **文档规模**: 12.13 KB，专注于开发效率提升
- **推荐指数**: ⭐⭐⭐⭐⭐ **[ORM 首选]**

---

### 📄 MyBatis 核心框架

- **文件路径**: `mybatis.md`
- **用途**: MyBatis 3 完整指南，提供轻量级 ORM 和复杂 SQL 映射能力
- **主要内容**: 
  - 复杂 SQL 映射和动态 SQL
  - 结果映射和类型处理器
  - 插件机制和底层原理
  - 缓存策略和性能调优
- **文档规模**: 21.82 KB，深度技术参考
- **推荐指数**: ⭐⭐⭐⭐ **[复杂 SQL 场景]**

---

## 📁 数据库技术

> 关系型和非关系型数据库管理系统，提供数据存储、查询优化和性能调优

### 📄 MySQL 9.5.0 数据库服务器

- **文件路径**: `mysql.md`
- **用途**: MySQL 9.5.0 完整文档，包含 C API、SQL 优化和存储引擎详解
- **主要内容**: 
  - 客户端 C API 和连接管理
  - SQL 查询优化和索引设计
  - 存储引擎和事务处理
  - 复制、分区和性能调优
- **文档规模**: 31.19 KB，1109 行底层 API + 高级特性
- **推荐指数**: ⭐⭐⭐⭐⭐ **[MySQL 开发首选]**

---

### 📄 Spring Data MongoDB 集成

- **文件路径**: `spring_data_mongodb.md`
- **用途**: Spring Data MongoDB 完整API参考，提供MongoDB NoSQL数据库集成
- **主要内容**: 
  - MongoTemplate 和 ReactiveMongoTemplate
  - 文档映射和Repository接口
  - 查询DSL和聚合操作
  - 索引管理和事务支持
  - 响应式编程和GridFS文件存储
- **文档规模**: 400.33 KB，超大型技术参考文档
- **推荐指数**: ⭐⭐⭐⭐⭐ **[MongoDB集成首选]**

---

## 📁 缓存系统

> Redis 缓存系统集成方案，支持分布式缓存、会话管理和实时数据处理

### 📄 Spring Data Redis 集成

- **文件路径**: `spring_data_redis.md`
- **用途**: Spring Data Redis 完整指南，提供 Redis 与 Spring 的深度集成
- **主要内容**: 
  - RedisTemplate 和响应式编程
  - 缓存抽象和分布式会话
  - Pub/Sub 消息系统和 Streams
  - 集群、哨兵模式和事务支持
- **文档规模**: 35.59 KB，955 行完整 API 参考
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Redis 集成首选]**

---

### 📄 Go Redis 客户端

- **文件路径**: `go_redis.md`
- **用途**: Go 语言 Redis 客户端库，提供类型安全的 Redis 操作接口
- **主要内容**: 
  - Go Redis 客户端配置
  - 集群和哨兵模式支持
  - 管道和事务操作
  - 类型安全的数据结构操作
- **文档规模**: 21.6 KB，940 行 Go 语言实现
- **推荐指数**: ⭐⭐⭐⭐ **[Go 项目 Redis 集成]**

---

## 📁 搜索引擎

> Elasticsearch 搜索引擎集成方案，支持全文搜索、数据分析和复杂查询

### 📄 Spring Data Elasticsearch 集成

- **文件路径**: `sping_data_elasticsearch.md`
- **用途**: Spring Data Elasticsearch 完整 API 参考，提供企业级搜索解决方案
- **主要内容**: 
  - ElasticsearchOperations 核心操作
  - 复杂查询和聚合分析
  - 索引管理和映射配置
  - 响应式支持和批量操作
- **文档规模**: 543.13 KB，超大型技术参考文档
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Elasticsearch 集成首选]**

---

### 📄 Elasticsearch REST API

- **文件路径**: `elasticsearch.md`
- **用途**: Elasticsearch REST API 和多语言客户端参考，支持跨语言集成
- **主要内容**: 
  - REST API 完整接口
  - Java/Python/Go/Node.js 客户端
  - 索引操作和文档管理
  - 批量操作和性能优化
- **文档规模**: 32.86 KB，跨语言支持
- **推荐指数**: ⭐⭐⭐⭐ **[多语言客户端参考]**

---

## 📁 消息队列

> Apache Kafka 消息队列集成方案，支持事件驱动架构、异步处理和流式数据处理

### 📄 Spring Kafka 集成

- **文件路径**: `spring_kafka.md`
- **用途**: Spring Kafka 完整集成指南，提供高级抽象的Kafka消息系统
- **主要内容**: 
  - KafkaTemplate 生产者API和消息发送
  - @KafkaListener 消费者API和监听器容器
  - 事务支持和死信队列处理
  - 消息序列化和并发控制
  - 错误处理和重试机制
- **文档规模**: 25.75 KB，完整的消息队列解决方案
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Kafka集成首选]**

---

## 📁 对象存储

> 腾讯云COS对象存储服务集成方案，支持文件上传下载、CDN加速和数据处理

### 📄 腾讯云COS Java SDK

- **文件路径**: `tencent_cloud_cos_java_sdk.md`
- **用途**: 腾讯云对象存储Java SDK完整使用指南，提供企业级文件存储能力
- **主要内容**: 
  - SDK安装配置和客户端初始化
  - 文件上传下载和分块传输
  - 存储桶操作和对象管理
  - 安全认证和权限控制
  - 高级功能(加密、元数据、CDN)
- **文档规模**: 23.89 KB，完整的Java集成方案
- **SDK版本**: 5.6.227+
- **推荐指数**: ⭐⭐⭐⭐⭐ **[Java对象存储首选]**

---

### 📄 腾讯云COS JavaScript SDK

- **文件路径**: `tencent_cloud_cos_js_sdk.md`
- **用途**: 腾讯云对象存储JavaScript SDK使用指南，支持Web、小程序、Node.js
- **主要内容**: 
  - 多环境安装配置(浏览器/小程序/Node.js)
  - 智能上传和断点续传
  - 临时密钥和安全认证
  - 小程序专用SDK配置
  - 任务队列管理和进度监控
- **文档规模**: 32.1 KB，跨平台完整方案
- **SDK版本**: cos-js-sdk-v5 / cos-wx-sdk-v5
- **推荐指数**: ⭐⭐⭐⭐⭐ **[前端对象存储首选]**

---

## 🎯 技术选型指南

### 架构选型矩阵

| 项目类型 | 前端 | 后端 | 数据库 | 缓存 | 搜索 | 消息队列 | 文件存储 |
|---------|------|------|--------|------|------|---------|---------|
| **企业级 Web** | Vue 3 | Spring Boot 3 | MyBatis-Plus + MongoDB | Spring Data Redis | Spring Data Elasticsearch | Spring Kafka | COS Java SDK |
| **Vue 项目** | Vue 3 | Spring Boot 3 | MyBatis-Plus | Spring Data Redis | Spring Data Elasticsearch | Spring Kafka | COS JS SDK |
| **传统项目维护** | Vue 2 | Spring Boot 3 | MyBatis | Spring Data Redis | Elasticsearch REST API | - | COS Java SDK |
| **Go 微服务** | - | - | MySQL | go-redis | Elasticsearch REST API | - | - |
| **新技术预研** | Vue 3 | Spring Boot 4 | MyBatis-Plus + MongoDB | Spring Data Redis | Spring Data Elasticsearch | Spring Kafka | COS Java SDK |

### 代码生成优先级

**优先级 1 - 核心参考** ⭐⭐⭐⭐⭐
```
前端: vue3.md, tencent_cloud_cos_js_sdk.md
后端: springboot3.md, mybatis_plus.md, spring_data_redis.md, spring_kafka.md
NoSQL: spring_data_mongodb.md
搜索: sping_data_elasticsearch.md
数据库: mysql.md
存储: tencent_cloud_cos_java_sdk.md
```

**优先级 2 - 补充参考** ⭐⭐⭐⭐
```
前端: vue2.md
后端: springboot4.md, mybatis.md, go_redis.md
搜索: elasticsearch.md
```

### 典型架构模板

#### Vue 3 企业应用
```
前端: vue3.md + tencent_cloud_cos_js_sdk.md
后端: springboot3.md + mybatis_plus.md
NoSQL: spring_data_mongodb.md
缓存: spring_data_redis.md
搜索: sping_data_elasticsearch.md
消息: spring_kafka.md
数据库: mysql.md
存储: tencent_cloud_cos_java_sdk.md
```

#### 微服务架构
```
API 网关: springboot3.md
业务服务: springboot3.md + mybatis_plus.md
NoSQL存储: spring_data_mongodb.md
缓存层: spring_data_redis.md
搜索引擎: sping_data_elasticsearch.md
消息队列: spring_kafka.md
数据库: mysql.md
文件存储: tencent_cloud_cos_java_sdk.md
```

#### Go 语言后端
```
后端服务: Go 标准库
缓存: go_redis.md
搜索: elasticsearch.md
数据库: mysql.md
```

---

## ⚡ 代码生成规范

### 必须遵循的原则

1. **完整性**: 生成的代码必须包含所有必要的导入和配置
2. **可运行性**: 代码可直接复制使用，无需额外修改
3. **最佳实践**: 遵循框架官方推荐的代码风格和模式
4. **类型安全**: 优先使用 TypeScript（前端）和强类型（后端）

### 代码生成流程

```
1. 确定技术栈 → 选择对应的 ⭐⭐⭐⭐⭐ 文档
2. 查找相关 API → 定位具体功能章节
3. 复制代码模板 → 根据需求调整参数
4. 补充业务逻辑 → 保持代码结构一致
5. 添加错误处理 → 确保生产环境可用
```

### 质量检查清单

- ✅ 导入语句完整
- ✅ 配置项齐全
- ✅ 错误处理完善
- ✅ 注释清晰准确
- ✅ 遵循命名规范
- ✅ 性能优化考虑

---

## 📊 文档统计

### 按技术领域分类
- **前端技术**: 2 个文档 (Vue 3, Vue 2)
- **后端框架**: 4 个文档 (Spring Boot 3/4, MyBatis-Plus, MyBatis)
- **数据库**: 2 个文档 (MySQL, Spring Data MongoDB)
- **缓存系统**: 2 个文档 (Spring Data Redis, Go Redis)
- **搜索引擎**: 2 个文档 (Spring Data Elasticsearch, Elasticsearch REST API)
- **消息队列**: 1 个文档 (Spring Kafka)
- **对象存储**: 2 个文档 (COS Java SDK, COS JavaScript SDK)

### 文档规模统计
- **超大型文档** (>100KB): 3 个 (Spring Data Elasticsearch, Spring Data MongoDB, Spring Boot 3)
- **大型文档** (20-50KB): 8 个 (Vue 2/3, MyBatis, MySQL, Spring Boot 4, Spring Data Redis, Go Redis, Elasticsearch, Spring Kafka, COS SDK)
- **中型文档** (10-20KB): 1 个 (MyBatis-Plus)

### 推荐优先级分布
- **⭐⭐⭐⭐⭐ 核心推荐**: 9 个文档
- **⭐⭐⭐⭐ 重要参考**: 6 个文档

---

## 🔧 文档维护

**更新记录**
- 2025-11-13: 新增消息队列(Spring Kafka)、对象存储(COS Java/JS SDK)、NoSQL数据库(MongoDB)文档
- 2025-11-13: 更新技术选型矩阵,新增消息队列和文件存储维度
- 2025-11-07: 生成完整的技术栈文档索引，包含详细的文档分析和使用指南
- 2025-11-07: 新增 Elasticsearch 技术栈文档（Spring Data Elasticsearch + REST API）
- 2025-11-04: 精简索引，聚焦架构建设和代码生成
- 2025-11-04: 添加技术选型矩阵和架构模板

**维护原则**
- 保持文档与框架版本同步
- 优先更新 ⭐⭐⭐⭐⭐ 文档
- 及时清理过时内容
- 补充实际项目案例
- 新增技术栈及时更新索引

---

> **使用说明**: 本索引基于技术栈目录的实际文件结构和内容分析生成。所有文档都包含完整的 API 参考和可直接使用的代码示例，适用于架构建设和代码生成场景。建议根据项目需求选择对应的 ⭐⭐⭐⭐⭐ 优先级文档作为主要参考。
