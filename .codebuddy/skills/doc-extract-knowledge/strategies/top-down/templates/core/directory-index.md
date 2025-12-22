# {{PROJECT_NAME}} 项目知识库索引

> **项目**: {{PROJECT_NAME}}  
> **基础包路径**: `{{BASE_PACKAGE}}`  
> **文档总数**: 20个 (1 README + 19 分类文档)  
> **代码总行数**: {{TOTAL_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 项目信息

| 项目 | 值 |
|------|-----|
| **技术栈** | {{TECH_STACK}} |
| **JDK 版本** | {{JDK_VERSION}} |
| **构建工具** | {{BUILD_TOOL}} |
| **启动类** | `{{MAIN_CLASS}}` |
| **配置文件** | {{CONFIG_FILES}} |

### 🚀 启动入口

**主类**: `{{MAIN_CLASS}}`  
**路径**: `{{MAIN_CLASS_PATH}}`

**启动命令**:
```bash
{{START_COMMAND}}
```

### 📁 配置文件索引

| 配置文件 | 用途 | 关键配置项 |
|----------|------|-----------|
| {{CONFIG_FILE_LIST}} |

---

## 🧭 快速导航

### P0 核心文档
- [接口定义索引](./interface.md) - Interface 接口
- [抽象类索引](./abstract.md) - Abstract 抽象类
- [HTTP API索引](./service-api-http.md) - Controller 层接口
- [业务逻辑层索引](./business-logic.md) - Service 层
- [ORM映射器索引](./orm-mapper.md) - Mapper 层

### P1 数据对象
- [Entity对象索引](./entity.md) - 数据库实体
- [DTO对象索引](./dto.md) - 数据传输对象
- [Response对象索引](./service-response-object.md) - 响应对象
- [Request对象索引](./front-end-request.md) - 请求对象
- [异常类索引](./exception.md) - 自定义异常
- [枚举类索引](./enum.md) - 枚举定义

### P2 技术组件
- [Feign接口索引](./feign.md) - 远程调用
- [Handler处理器索引](./handler.md) - 事件处理器
- [Job-Task索引](./job-task.md) - 定时任务
- [MQ监听器索引](./mq-listener.md) - 消息监听
- [工具类索引](./utils.md) - 工具类
- [Common公共类索引](./common.md) - 公共配置
- [自定义注解索引](./annotation.md) - 注解定义
- [常量类索引](./constants.md) - 常量定义

---

## 📊 统计概览

| 分类 | 文件数 | 类数量 | 代码行数 |
|------|--------|--------|----------|
| Interface | {{INTERFACE_COUNT}} | {{INTERFACE_CLASS_COUNT}} | {{INTERFACE_LOC}} |
| Abstract | {{ABSTRACT_COUNT}} | {{ABSTRACT_CLASS_COUNT}} | {{ABSTRACT_LOC}} |
| Controller | {{CONTROLLER_COUNT}} | {{CONTROLLER_CLASS_COUNT}} | {{CONTROLLER_LOC}} |
| Service | {{SERVICE_COUNT}} | {{SERVICE_CLASS_COUNT}} | {{SERVICE_LOC}} |
| Mapper | {{MAPPER_COUNT}} | {{MAPPER_CLASS_COUNT}} | {{MAPPER_LOC}} |
| Entity | {{ENTITY_COUNT}} | {{ENTITY_CLASS_COUNT}} | {{ENTITY_LOC}} |
| DTO | {{DTO_COUNT}} | {{DTO_CLASS_COUNT}} | {{DTO_LOC}} |
| VO/Response | {{RESPONSE_COUNT}} | {{RESPONSE_CLASS_COUNT}} | {{RESPONSE_LOC}} |
| Request | {{REQUEST_COUNT}} | {{REQUEST_CLASS_COUNT}} | {{REQUEST_LOC}} |
| Exception | {{EXCEPTION_COUNT}} | {{EXCEPTION_CLASS_COUNT}} | {{EXCEPTION_LOC}} |
| Enum | {{ENUM_COUNT}} | {{ENUM_CLASS_COUNT}} | {{ENUM_LOC}} |
| Feign | {{FEIGN_COUNT}} | {{FEIGN_CLASS_COUNT}} | {{FEIGN_LOC}} |
| Handler | {{HANDLER_COUNT}} | {{HANDLER_CLASS_COUNT}} | {{HANDLER_LOC}} |
| Job/Task | {{JOB_COUNT}} | {{JOB_CLASS_COUNT}} | {{JOB_LOC}} |
| MQ Listener | {{LISTENER_COUNT}} | {{LISTENER_CLASS_COUNT}} | {{LISTENER_LOC}} |
| Utils | {{UTIL_COUNT}} | {{UTIL_CLASS_COUNT}} | {{UTIL_LOC}} |
| Common | {{COMMON_COUNT}} | {{COMMON_CLASS_COUNT}} | {{COMMON_LOC}} |
| Annotation | {{ANNOTATION_COUNT}} | {{ANNOTATION_CLASS_COUNT}} | {{ANNOTATION_LOC}} |
| Constants | {{CONSTANTS_COUNT}} | {{CONSTANTS_CLASS_COUNT}} | {{CONSTANTS_LOC}} |
| **总计** | **{{TOTAL_COUNT}}** | **{{TOTAL_CLASS_COUNT}}** | **{{TOTAL_LOC}}** |

---

## 📐 架构关系图

```
┌─────────────────────────────────────────────────────────────┐
│                      Interface 层                            │
│  {{INTERFACE_SAMPLE_LIST}}                                   │
└──────────┬─────────────────────────────────────┬────────────┘
           ↓                                     ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Controller │ ←── │   Feign     │ ←── │  Abstract   │
│ (HTTP API)  │     │  (远程调用)  │     │  (抽象基类)  │
└──────┬──────┘     └─────────────┘     └─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Service   │ ←── │  Exception  │ ←── │  Constants  │
│  (业务逻辑)  │     │  (异常处理)  │     │   (常量)    │
└──────┬──────┘     └─────────────┘     └─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐
│   Mapper    │ ←── │    Enum     │
│  (数据访问)  │     │   (枚举)    │
└──────┬──────┘     └─────────────┘
       ↓
┌─────────────┐
│   Entity    │
│  (数据实体)  │
└─────────────┘
```

**数据流向**:
- Request → Controller → Service → Mapper → Entity
- Entity → Mapper → Service → Controller → Response/VO

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
