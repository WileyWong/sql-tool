# 招聘领域公共知识库

本目录存放招聘业务领域的公共服务和组件知识库，目前包括协同平台 API 文档和 Spring Boot SDK 框架文档。

## 📋 目录结构

```
recruit/
├── index.md                  # 本文件 - 总索引
├── collaboration/            # 协同平台 API 文档 (51个接口 + 11个事件)
│   ├── index.md             # API 总览和使用指南
│   ├── flow-api.md          # 流程管理 API
│   ├── resume-api.md        # 简历管理 API
│   ├── post-api.md          # 岗位管理 API
│   ├── interview-api.md     # 面试管理 API
│   ├── ai-api.md            # AI 服务 API
│   ├── channel-api.md       # 渠道管理 API
│   ├── efficiency-api.md    # 效能分析 API
│   ├── operation-api.md     # 运营平台 API
│   ├── assessment-api.md    # 测评平台 API
│   ├── wework-message-api.md # 企业微信与消息 API
│   ├── integration-api.md   # 其他集成服务 API
│   ├── bole-api.md          # 伯乐推荐 API
│   ├── ai-domaineventbus-guide.md # DomainEventBus 使用指南
│   └── domain-events-summary.md   # 领域事件总结
└── kb-recruit-framework2/    # Spring Boot SDK 框架知识库 (7个模块)
    ├── README.md            # 框架总览
    ├── parent/              # Maven父项目
    ├── framework-core/      # 核心框架
    ├── web-starter/         # Web启动器
    ├── exception-starter/   # 异常处理
    ├── jobtask-starter/     # 作业任务
    ├── message-starter/     # 消息服务
    └── thirdparty-starter/  # 第三方集成
```

## 🎯 快速导航

| 分类 | 说明 | 链接 |
|------|------|------|
| **协同平台 API** | FeignClient 接口与领域事件文档<br/>51个接口 + 11个事件 | [collaboration/index.md](./collaboration/index.md) |
| **框架 SDK** | Spring Boot SDK 框架完整知识库<br/>7个模块 + 50+文档 | [kb-recruit-framework2/README.md](./kb-recruit-framework2/README.md) |

## 📚 领域概述

招聘领域知识库包含两大核心部分：**协同平台 API** 和 **框架 SDK**。

### 🔌 协同平台 API

提供完整的招聘业务 API 接口调用和领域事件使用说明，支持微服务架构下的业务集成。

**核心能力**:
- **FeignClient 接口**: 51个微服务 HTTP 接口
- **领域事件**: 11个异步消息事件
- **业务领域**: 覆盖招聘全流程 20+ 业务域

**主要业务域**:
1. **流程管理** - 流程追踪中心，提供流程主数据、待办追踪
2. **简历管理** - 简历增删改查、ES搜索、附件管理、简历判重
3. **岗位管理** - 岗位数据管理和外部接口
4. **面试管理** - 面试安排、面试评价、社招面试
5. **AI 服务** - AI会话管理、文档处理、评论摘要
6. **渠道管理** - 渠道内外部接口、渠道管理中心
7. **效能分析** - 招聘效能分析、数据报表、Offer统计
8. **运营平台** - 配置管理、文案管理、灰度配置
9. **测评平台** - 在线测评、能力评估、报告下载
10. **企业微信与消息** - 企业微信、微信群组、RTX消息、电话通知
11. **其他集成服务** - 活水平台、资源管理、HR系统集成等

### 🏗️ 框架 SDK

企业级 Spring Boot SDK 框架，为招聘业务系统提供统一的技术基础设施。

**核心能力**:
- **模块化设计**: 7个独立SDK，按需引入
- **开箱即用**: Spring Boot自动配置，零配置启动
- **企业级**: 完善的异常处理、日志、监控、安全机制
- **高性能**: 分布式缓存、异步处理、连接池优化

**技术栈**:
- Spring Boot 2.x
- MyBatis-Plus 3.x
- Redis 5.x
- Kafka/Pulsar
- MySQL 8.x
- Swagger 2.x
- TSF 3.x

## 🔧 如何使用

### 查找 API 接口

访问 [协同平台 API 总览](./collaboration/index.md) 查看完整的 API 导航和使用指南。

**按业务域查找**:
- 流程管理: [flow-api.md](./collaboration/flow-api.md)
- 简历管理: [resume-api.md](./collaboration/resume-api.md)
- 岗位管理: [post-api.md](./collaboration/post-api.md)
- 面试管理: [interview-api.md](./collaboration/interview-api.md)
- AI 服务: [ai-api.md](./collaboration/ai-api.md)
- 更多请参考 [collaboration/index.md](./collaboration/index.md)

**领域事件**:
- DomainEventBus 使用指南: [ai-domaineventbus-guide.md](./collaboration/ai-domaineventbus-guide.md)
- 领域事件总结: [domain-events-summary.md](./collaboration/domain-events-summary.md)

### 查找框架 SDK

访问 [框架 SDK 总览](./kb-recruit-framework2/README.md) 查看完整的框架文档和使用指南。

**按模块查找**:
- Maven父项目: [parent/README.md](./kb-recruit-framework2/parent/README.md)
- 核心框架: [framework-core/README.md](./kb-recruit-framework2/framework-core/README.md) ⭐
- Web启动器: [web-starter/README.md](./kb-recruit-framework2/web-starter/README.md)
- 异常处理: [exception-starter/README.md](./kb-recruit-framework2/exception-starter/README.md)
- 作业任务: [jobtask-starter/README.md](./kb-recruit-framework2/jobtask-starter/README.md)
- 消息服务: [message-starter/README.md](./kb-recruit-framework2/message-starter/README.md)
- 第三方集成: [thirdparty-starter/README.md](./kb-recruit-framework2/thirdparty-starter/README.md)

## 📝 如何贡献

### 添加新 API 文档

1. 在 `collaboration/` 目录下创建对应的 API 文档（如 `xxx-api.md`）
2. 更新 [collaboration/index.md](./collaboration/index.md) 中的导航索引
3. 如果涉及新的领域事件，同时更新 [domain-events-summary.md](./collaboration/domain-events-summary.md)

### 添加新框架模块

1. 在 `kb-recruit-framework2/` 目录下创建对应模块文件夹
2. 在模块文件夹中创建 `README.md` 和详细文档
3. 更新 [kb-recruit-framework2/README.md](./kb-recruit-framework2/README.md) 中的模块导航

## 🔗 详细资源索引

### 📦 协同平台 API (collaboration/)

完整的招聘协同平台 API 集成指南，包含 FeignClient 接口调用和领域事件使用说明。

**📊 统计信息**:
- **FeignClient API**: 51个接口
- **领域事件**: 11个事件接口
- **文档数量**: 15个
- **业务领域**: 20+个

**📚 详细文档列表**:

| 文档 | 说明 | 核心内容 |
|------|------|----------|
| [index.md](./collaboration/index.md) | API 总览和快速开始指南 | 完整导航、配置说明、FAQ |
| [flow-api.md](./collaboration/flow-api.md) | 流程管理 API | FlowApi - 流程追踪中心 |
| [resume-api.md](./collaboration/resume-api.md) | 简历管理 API | 7个API - 简历CRUD、ES搜索、附件管理 |
| [post-api.md](./collaboration/post-api.md) | 岗位管理 API | PostApi、PostExternalApi |
| [interview-api.md](./collaboration/interview-api.md) | 面试管理 API | 3个API - 面试安排、评价、社招 |
| [ai-api.md](./collaboration/ai-api.md) | AI 服务 API | 6个API - AI会话、文档、摘要 |
| [channel-api.md](./collaboration/channel-api.md) | 渠道管理 API | 3个API - 渠道内外部接口 |
| [efficiency-api.md](./collaboration/efficiency-api.md) | 效能分析 API | 效能分析、数据报表 |
| [operation-api.md](./collaboration/operation-api.md) | 运营平台 API | 配置、文案、灰度管理 |
| [assessment-api.md](./collaboration/assessment-api.md) | 测评平台 API | 在线测评、能力评估 |
| [wework-message-api.md](./collaboration/wework-message-api.md) | 企业微信与消息 API | 6个API - 企业微信、RTX、电话 |
| [integration-api.md](./collaboration/integration-api.md) | 其他集成服务 API | 15+服务 - 活水、资源管理、HR |
| [bole-api.md](./collaboration/bole-api.md) | 伯乐推荐 API | 伯乐奖励、超级伯乐事件 |
| [ai-domaineventbus-guide.md](./collaboration/ai-domaineventbus-guide.md) | DomainEventBus 使用指南 | 详细的领域事件使用说明 |
| [domain-events-summary.md](./collaboration/domain-events-summary.md) | 领域事件总结 | 所有领域事件完整列表 |

**🎯 使用场景**:
- **第三方系统集成**: 调用招聘协同平台 API
- **内部服务开发**: 开发招聘协同平台微服务
- **领域事件**: 实现服务间异步解耦

---

### 🏗️ 框架 SDK (kb-recruit-framework2/)

企业级招聘系统 Spring Boot SDK，为招聘业务系统提供统一的技术基础设施。

**📊 统计信息**:
- **子项目总数**: 7个
- **文档总数**: 50+个
- **Java文件**: 400+个
- **包结构**: 50+个

**📚 核心模块详解**:

#### 1. [Parent - Maven父项目](./kb-recruit-framework2/parent/README.md)

**功能**: 依赖版本统一管理

**核心内容**:
- 33个依赖管理
- 24个版本属性
- 7个子模块定义
- 安全加固规则

**Maven坐标**: `recruit-center-parent:2.0.0-SNAPSHOT`

**适用场景**: 新建子项目、依赖版本升级

---

#### 2. [FrameworkCore - 核心框架](./kb-recruit-framework2/framework-core/README.md) ⭐

**功能**: 提供基础技术能力

**核心内容**:
- **注解**: 8个核心注解（缓存、防重、脱敏、分布式锁）
- **工具类**: 10+个工具类（字符串、日期、JSON、加密）
- **异常**: 5个异常类（业务、系统、校验、权限、远程）
- **过滤器**: 8个过滤器和拦截器（XSS、认证、性能监控）

**包路径**: `com.tencent.hr.recruit.center.framework.core`

**适用场景**: 所有业务开发的基础依赖

---

#### 3. [WebStarter - Web启动器](./kb-recruit-framework2/web-starter/README.md)

**功能**: Web应用快速启动

**核心内容**:
- MyBatis-Plus分页配置
- Swagger API文档配置
- 8个自动配置类
- 事务管理、异步支持

**包路径**: `com.tencent.hr.recruit.center.framework.web`

**适用场景**: 构建Web应用、RESTful API服务

---

#### 4. [ExceptionStarter - 异常处理](./kb-recruit-framework2/exception-starter/README.md)

**功能**: 统一异常处理和通知

**核心内容**:
- 全局异常拦截器
- 邮件通知（OA/云环境）
- 企业微信机器人通知
- 13个异常处理方法

**包路径**: `com.tencent.hr.recruit.center.framework.error`

**适用场景**: 异常监控告警、邮件通知配置

---

#### 5. [JobTaskStarter - 作业任务](./kb-recruit-framework2/jobtask-starter/README.md)

**功能**: 企业级分布式作业任务调度

**核心内容**:
- 作业编排和执行
- 任务状态管理
- 回滚机制、重试机制
- Kafka/Tdmq消息通知

**包路径**: `com.tencent.hr.recruit.center.job`

**适用场景**: 批处理任务、定时任务、异步任务编排

---

#### 6. [MessageStarter - 消息服务](./kb-recruit-framework2/message-starter/README.md)

**功能**: 多渠道消息发送

**核心内容**:
- 邮件发送（同步/异步）
- 短信、企业微信、微信公众号消息
- OA消息、应用内消息
- 25个消息Bean、19个发送器

**包路径**: `com.tencent.hr.recruit.center.message`

**适用场景**: 消息通知、邮件发送、短信发送

---

#### 7. [ThirdPartyStarter - 第三方集成](./kb-recruit-framework2/thirdparty-starter/README.md)

**功能**: 第三方服务集成

**核心内容**:
- 效率平台集成（流程追踪）
- 数据市场集成（员工、组织、职位）
- 文件服务（上传、预览、签名）
- 115+个Feign接口方法

**包路径**: `com.tencent.hr.recruit.center.third`

**适用场景**: 第三方服务调用、数据查询、权限控制

---

**🎯 使用场景**:
- **Web应用开发**: FrameworkCore + WebStarter + ExceptionStarter
- **异步任务开发**: FrameworkCore + JobTaskStarter + MessageStarter
- **第三方集成**: FrameworkCore + ThirdPartyStarter

## 📈 统计概览

### 整体规模

| 维度 | 数量 | 说明 |
|------|------|------|
| **API 接口** | 51个 | FeignClient HTTP接口 |
| **领域事件** | 11个 | 异步消息事件 |
| **业务领域** | 20+个 | 覆盖招聘全流程 |
| **框架模块** | 7个 | 独立SDK模块 |
| **文档总数** | 65+个 | API文档 + 框架文档 |
| **Java文件** | 400+个 | 框架核心代码 |

### 技术栈分布

**协同平台 API**:
- Spring Cloud Feign
- Spring Boot 2.3+
- Nacos服务发现
- BaseEventType领域事件

**框架 SDK**:
- Spring Boot 2.x
- MyBatis-Plus 3.x
- Redis 5.x
- Kafka/Pulsar
- MySQL 8.x
- Swagger 2.x
- TSF 3.x

## 🚀 快速开始

### 使用协同平台 API

1. **引入依赖**
```xml
<dependency>
    <groupId>com.tencent.hr.recruit</groupId>
    <artifactId>recruit-collaboration-api</artifactId>
    <version>1.9.0</version>
</dependency>
```

2. **配置 Feign**
```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_SERVER}
```

3. **调用 API**
```java
@Autowired
private FlowApi flowApi;

public void queryFlow(Long flowMainId) {
    FlowMain flowMain = flowApi.getFlowMain(flowMainId);
}
```

详细使用请参考: [collaboration/index.md](./collaboration/index.md)

---

### 使用框架 SDK

1. **添加父POM依赖**
```xml
<parent>
    <groupId>com.tencent.hr</groupId>
    <artifactId>recruit-center-parent</artifactId>
    <version>2.0.0-SNAPSHOT</version>
</parent>
```

2. **引入所需的Starter**
```xml
<dependencies>
    <!-- 核心框架 -->
    <dependency>
        <groupId>com.tencent.hr</groupId>
        <artifactId>recruit-center-framework-core</artifactId>
    </dependency>
    
    <!-- Web启动器 -->
    <dependency>
        <groupId>com.tencent.hr</groupId>
        <artifactId>recruit-center-web-starter</artifactId>
    </dependency>
</dependencies>
```

3. **使用框架功能**
```java
@Service
public class UserService {
    
    @RecruitCache(key = "user:#{#userId}", expireTime = 3600)
    public User getUser(Long userId) {
        return userMapper.selectById(userId);
    }
}
```

详细使用请参考: [kb-recruit-framework2/README.md](./kb-recruit-framework2/README.md)

## 📞 技术支持

- **文档维护**: AI 文档生成工具
- **问题反馈**: 联系招聘中心技术团队
- **技术交流**: 企业微信群

---

**最后更新**: 2025-11-24  
**文档版本**: v2.0  
**维护状态**: ✅ 活跃维护中
