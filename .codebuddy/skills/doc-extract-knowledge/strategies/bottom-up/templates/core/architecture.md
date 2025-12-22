<!--
================== AI 处理指引 ==================

【文档提取规则】
1. 技术栈提取：从 pom.xml/build.gradle 解析依赖版本，识别核心框架
2. 模块结构：从多模块项目结构或单模块包结构提取模块划分
3. 分层统计：扫描各层类数量（Controller/Service/Mapper/Entity 等）
4. 循环依赖：分析类级别依赖关系，检测循环引用
5. 认证鉴权：从 Security 配置、Filter、Interceptor 中提取认证机制
6. 可选章节：内容为空时整章省略（含标题），不保留空表格

【文档使用规则】
1. 本文档为项目架构概览，用于理解项目整体结构
2. 生成新代码时，参考"包结构概览"确定类的存放位置
3. 参考"技术栈"确定使用的框架和版本
4. 参考"认证鉴权机制"实现安全相关功能
5. 参考"核心调用链"理解业务流转模式
6. 参考"关联文档"获取各模块详细信息

**注意**: 以上为通用规则，若实际项目与规则不一致，以实际项目为准。

================================================
-->

# 项目架构

> **项目**: {{PROJECT_NAME}} <!-- [必填] -->  
> **项目类型**: {{PROJECT_TYPE}} <!-- 单体应用 / 微服务 / 后台服务 / 定时任务服务 -->  
> **基础框架**: {{BASE_FRAMEWORK}} <!-- Spring Boot / Spring Cloud / 其他 -->  
> **生成时间**: {{SCAN_DATE}} <!-- [必填] -->  
> **类总数**: {{TOTAL_COUNT}} 个 <!-- [必填] -->  
> **依赖关系数**: {{DEPENDENCY_COUNT}} 条 <!-- [必填] -->

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 基础框架 | Spring Boot | {{VERSION}} | 应用框架 |
| JDK | Java | {{VERSION}} | 运行环境 |
| 构建工具 | Maven/Gradle | {{VERSION}} | 项目构建 |
| ORM | MyBatis-Plus | {{VERSION}} | 数据访问 |
| 数据库 | MySQL | {{VERSION}} | 主数据库 |
| 缓存 | Redis | {{VERSION}} | 分布式缓存 |
| 消息队列 | RabbitMQ/Kafka/RocketMQ | {{VERSION}} | 异步消息 |
| 注册中心 | Nacos/Eureka | {{VERSION}} | 服务发现 |
| 配置中心 | Nacos/Apollo | {{VERSION}} | 配置管理 |

*根据实际项目技术栈填写，未使用的技术可删除对应行*

---

## 📦 模块结构

| 模块 | 类型 | 职责 | 依赖模块 |
|------|------|------|----------|
| {{MODULE_NAME}} | parent | 父POM，依赖管理 | - |
| {{MODULE_NAME}}-common | common | 公共组件、工具类 | - |
| {{MODULE_NAME}}-api | api | 对外接口定义、DTO | common |
| {{MODULE_NAME}}-service | service | 业务逻辑实现 | common, api |
| {{MODULE_NAME}}-web | web | Web层、Controller | service |

*如为单模块项目，此章节可省略*

---

## 📁 包结构概览

```
{{BASE_PACKAGE}}
├── controller/         # 控制器层，处理HTTP请求
├── service/            # 业务逻辑层
│   └── impl/           # 服务实现类
├── mapper/             # 数据访问层（DAO）
├── entity/             # 数据库实体
├── dto/                # 数据传输对象（入参）
├── vo/                 # 视图对象（出参）
├── request/            # 请求参数对象
├── config/             # 配置类
├── common/             # 公共组件
│   ├── exception/      # 异常定义
│   ├── constants/      # 常量定义
│   ├── enums/          # 枚举定义
│   └── utils/          # 工具类
├── handler/            # 处理器（事件、异常等）
├── job/                # 定时任务
└── integration/        # 外部集成
    ├── feign/          # Feign客户端
    └── mq/             # 消息队列监听器
```

*根据实际项目包结构调整*

---

## 📐 分层架构图

<!-- 根据实际项目分层调整，以下为模板示例 -->

```
┌─────────────────────────────────────────────────────────────┐
│                    {{LAYER_1_NAME}} ({{LAYER_1_COUNT}})      │
│  {{LAYER_1_LIST}}                                            │
└──────────┬─────────────────────────────────────┬────────────┘
           ↓                                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    {{LAYER_2_NAME}} ({{LAYER_2_COUNT}})      │
│  {{LAYER_2_LIST}}                                            │
└──────────┬─────────────────────────────────────┬────────────┘
           ↓                                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    {{LAYER_3_NAME}} ({{LAYER_3_COUNT}})      │
│  {{LAYER_3_LIST}}                                            │
└──────────┬─────────────────────────────────────┬────────────┘
           ↓                                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    {{LAYER_4_NAME}} ({{LAYER_4_COUNT}})      │
│  {{LAYER_4_LIST}}                                            │
└──────────┬─────────────────────────────────────┬────────────┘
           ↓                                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    {{LAYER_5_NAME}} ({{LAYER_5_COUNT}})      │
│  {{LAYER_5_LIST}}                                            │
└─────────────────────────────────────────────────────────────┘
```

*常见分层：Interface → Controller → Service → Mapper → Entity*  
*微服务可能包含：Feign Client / Gateway / 消息监听器 等额外层*  
*根据实际项目调整层数和名称*

---

## 📊 模块依赖矩阵

| 模块 | 类型 | 依赖数 | 被依赖数 | 耦合度 |
|------|------|--------|----------|--------|
| {{MODULE_NAME}} | {{TYPE}} | {{DEP_COUNT}} | {{REV_DEP_COUNT}} | {{COUPLING}} |

**耦合度说明**:
- **高**: 被依赖数 > 5，修改影响范围大
- **中**: 被依赖数 3-5，需谨慎修改
- **低**: 被依赖数 < 3，修改影响较小

---

## ⚠️ 循环依赖检测

<!-- [可选] 如无循环依赖问题，可省略此章节 -->

### 检测结果

{{CIRCULAR_DEPENDENCY_RESULT}}

### 循环依赖详情（如有）

```
ServiceA → ServiceB → ServiceC → ServiceA
```

**建议**: 通过接口抽象或事件机制解耦

---

## 🔄 核心调用链

<!-- 列出项目中最重要的业务调用链，数量根据实际情况调整 -->

### {{FLOW_NAME}}

```
{{CALL_CHAIN}}
```

**涉及组件**: {{COMPONENT_COUNT}} 个  
**事务边界**: {{TRANSACTION_INFO}}

<!-- 重复以上结构，直到列出所有核心调用链 -->

*如无章节内容，此章节可省略*

---

## 📈 依赖统计

### 按类型统计

| 类型 | 数量 | 平均依赖数 | 平均被依赖数 |
|------|------|------------|--------------|
| Interface | {{N}} | {{N}} | {{N}} |
| Abstract | {{N}} | {{N}} | {{N}} |
| Controller | {{N}} | {{N}} | {{N}} |
| Service | {{N}} | {{N}} | {{N}} |
| Mapper | {{N}} | {{N}} | {{N}} |
| Entity | {{N}} | {{N}} | {{N}} |
| Exception | {{N}} | {{N}} | {{N}} |
| Enum | {{N}} | {{N}} | {{N}} |
| Constants | {{N}} | {{N}} | {{N}} |

### 高耦合组件（被依赖数 Top 5）

| 排名 | 组件 | 类型 | 被依赖数 |
|------|------|------|----------|
| 1 | {{NAME}} | {{TYPE}} | {{COUNT}} |
| 2 | {{NAME}} | {{TYPE}} | {{COUNT}} |
| 3 | {{NAME}} | {{TYPE}} | {{COUNT}} |
| 4 | {{NAME}} | {{TYPE}} | {{COUNT}} |
| 5 | {{NAME}} | {{TYPE}} | {{COUNT}} |

---

## 🔗 外部依赖

<!-- [可选] 如无外部依赖，可省略此章节 -->

### 第三方组件

| 组件 | 用途 | 依赖方数量 |
|------|------|------------|
| RedisTemplate | 缓存 | {{N}} |
| RabbitTemplate | 消息队列 | {{N}} |
| RestTemplate | HTTP调用 | {{N}} |

### 外部服务

| 服务 | 调用方式 | 依赖方数量 |
|------|----------|------------|
| {{SERVICE_NAME}} | Feign | {{N}} |
| {{SERVICE_NAME}} | HTTP | {{N}} |

---

## 💡 架构建议

<!-- [可选] 如无架构问题或建议，可省略此章节 -->

### 优化建议

1. **高耦合组件**: {{COMPONENT}} 被依赖数过高，建议拆分
2. **循环依赖**: {{SUGGESTION}}
3. **分层违规**: {{SUGGESTION}}

### 架构健康度

| 指标 | 当前值 | 建议值 | 状态 |
|------|--------|--------|------|
| 循环依赖数 | {{N}} | 0 | {{STATUS}} |
| 平均依赖数 | {{N}} | < 5 | {{STATUS}} |
| 最大被依赖数 | {{N}} | < 10 | {{STATUS}} |

---

## 🔐 身份认证机制

<!-- [可选] 如无身份认证机制，可省略此章节 -->

### 认证方式

| 认证类型 | 实现方式 | 说明 |
|---------|---------|------|
| {{AUTH_TYPE}} | {{IMPLEMENTATION}} | {{DESC}} |

**常见认证类型**:
- JWT Token（无状态）
- Session + Cookie（有状态）
- OAuth2.0（第三方授权）
- SSO 单点登录
- Basic Auth（基础认证）

### 认证流程

```
[客户端] 
    ↓ 1. 登录请求（用户名/密码）
[认证服务/Controller]
    ↓ 2. 验证凭证
[用户服务/数据库]
    ↓ 3. 返回用户信息
[认证服务]
    ↓ 4. 生成Token/Session
[客户端]
    ↓ 5. 携带Token访问资源
[过滤器/拦截器]
    ↓ 6. 验证Token有效性
[业务接口]
```

### Token 配置

| 配置项 | 值 | 说明 |
|-------|-----|------|
| Token类型 | {{TOKEN_TYPE}} | JWT/Session/OAuth |
| 有效期 | {{EXPIRE_TIME}} | 如：2小时 |
| 刷新机制 | {{REFRESH_MECHANISM}} | 如：RefreshToken |
| 存储位置 | {{STORAGE}} | Header/Cookie/LocalStorage |

### 核心组件

| 组件 | 类型 | 职责 |
|------|------|------|
| {{AUTH_FILTER}} | Filter/Interceptor | 请求认证拦截 |
| {{AUTH_SERVICE}} | Service | 认证逻辑处理 |
| {{TOKEN_UTIL}} | Utils | Token生成/解析 |
| {{USER_DETAILS}} | Entity/DTO | 用户信息载体 |

*如无身份认证机制，此章节可省略*

---

## 🛡️ 权限与鉴权机制

<!-- [可选] 如无权限与鉴权机制，可省略此章节 -->

### 权限模型

| 模型类型 | 说明 |
|---------|------|
| {{PERMISSION_MODEL}} | {{DESC}} |

**常见权限模型**:
- RBAC（基于角色的访问控制）
- ABAC（基于属性的访问控制）
- ACL（访问控制列表）
- 数据权限（行级/列级）

### 角色定义

| 角色 | 编码 | 权限范围 | 说明 |
|------|------|---------|------|
| {{ROLE_NAME}} | {{ROLE_CODE}} | {{PERMISSIONS}} | {{DESC}} |

### 权限定义

| 权限 | 编码 | 资源 | 操作 | 说明 |
|------|------|------|------|------|
| {{PERMISSION_NAME}} | {{PERMISSION_CODE}} | {{RESOURCE}} | {{ACTION}} | {{DESC}} |

### 鉴权流程

```
[请求进入]
    ↓
[认证过滤器] → 验证Token有效性
    ↓
[权限过滤器/注解] → 获取用户角色/权限
    ↓
[权限校验] → 比对接口所需权限
    ↓ 通过
[业务处理]
    ↓ 拒绝
[返回403 Forbidden]
```

### 权限注解

| 注解 | 用途 | 示例 |
|------|------|------|
| `@PreAuthorize` | 方法级权限控制 | `@PreAuthorize("hasRole('ADMIN')")` |
| `@RequiresPermissions` | Shiro权限注解 | `@RequiresPermissions("user:add")` |
| `@Secured` | Spring Security | `@Secured("ROLE_ADMIN")` |
| `{{CUSTOM_ANNOTATION}}` | 自定义权限注解 | {{EXAMPLE}} |

### 核心组件

| 组件 | 类型 | 职责 |
|------|------|------|
| {{SECURITY_CONFIG}} | Config | 安全配置类 |
| {{PERMISSION_FILTER}} | Filter/Interceptor | 权限拦截器 |
| {{PERMISSION_SERVICE}} | Service | 权限校验服务 |
| {{PERMISSION_HANDLER}} | Handler | 权限处理器 |

### 数据权限（如有）

| 维度 | 实现方式 | 说明 |
|------|---------|------|
| 部门数据隔离 | {{IMPLEMENTATION}} | 只能查看本部门数据 |
| 个人数据隔离 | {{IMPLEMENTATION}} | 只能查看自己的数据 |
| 字段级权限 | {{IMPLEMENTATION}} | 敏感字段脱敏/隐藏 |

*如无权限与鉴权机制，此章节可省略*

---

## 📨 消息队列架构

<!-- [可选] 如无消息队列，可省略此章节 -->

### Topic/Queue 清单

| 名称 | 类型 | MQ类型 | 生产者 | 消费者 | 说明 |
|------|------|--------|--------|--------|------|
| {{QUEUE_NAME}} | Queue | RabbitMQ | {{PRODUCER_CLASS}} | {{CONSUMER_CLASS}} | {{DESC}} |
| {{TOPIC_NAME}} | Topic | Kafka | {{PRODUCER_CLASS}} | {{CONSUMER_CLASS}} | {{DESC}} |

### 消息流向图

```
[生产者] {{PRODUCER}} 
    ↓ 发送消息
[队列/Topic] {{QUEUE_NAME}}
    ↓ 消费消息
[消费者] {{CONSUMER}}
    ↓ 处理业务
[下游服务/数据库]
```

*如无消息队列，此章节可省略*

---

## ⏰ 定时任务清单

<!-- [可选] 如无定时任务，可省略此章节 -->

| 任务名 | Cron表达式 | 执行频率 | 所在类 | 说明 |
|--------|-----------|----------|--------|------|
| {{TASK_NAME}} | `{{CRON}}` | {{FREQUENCY}} | {{CLASS_NAME}} | {{DESC}} |
| {{TASK_NAME}} | `fixedRate={{MS}}` | 每{{N}}秒 | {{CLASS_NAME}} | {{DESC}} |

*如无章节内容，此章节可省略*

---

## ⚙️ 配置管理

<!-- [可选] 记录项目关键配置项 -->

### 配置文件

| 文件 | 环境 | 说明 |
|------|------|------|
| `application.yml` | 通用 | 基础配置 |
| `application-dev.yml` | 开发 | 开发环境配置 |
| `application-test.yml` | 测试 | 测试环境配置 |
| `application-prod.yml` | 生产 | 生产环境配置 |

### 关键配置项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `{{CONFIG_KEY}}` | `{{DEFAULT_VALUE}}` | {{CONFIG_DESC}} |

*如无章节内容，此章节可省略*

---

## 📎 关联文档

<!-- 引用项目中各模块的详细文档 -->

| 文档类型 | 文档名称 | 说明 |
|----------|----------|------|
| Controller | [{{NAME}}](./controller/{{FILE}}.md) | {{DESC}} |
| Service | [{{NAME}}](./service/{{FILE}}.md) | {{DESC}} |
| Mapper | [{{NAME}}](./mapper/{{FILE}}.md) | {{DESC}} |
| Entity | [{{NAME}}](./entity/{{FILE}}.md) | {{DESC}} |
| Utils | [{{NAME}}](./utils/{{FILE}}.md) | {{DESC}} |

*如无章节内容，此章节可省略*

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
