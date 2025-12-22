# {{PROJECT_NAME}} 项目知识库索引

> **项目**: {{PROJECT_NAME}}  
> **基础目录路径**: `{{BASE_PACKAGE}}`  
> **文档总数**: {{TOTAL_COUNT}} 个  
> **代码总行数**: {{TOTAL_LOC}} 行  
> **生成时间**: {{SCAN_DATE}}

---

## 🧭 快速导航

### P0 核心类
- [Interface](./interface/) - {{INTERFACE_COUNT}} 个
- [Abstract](./abstract/) - {{ABSTRACT_COUNT}} 个
- [Controller](./controller/) - {{CONTROLLER_COUNT}} 个
- [Service](./service/) - {{SERVICE_COUNT}} 个
- [Mapper](./mapper/) - {{MAPPER_COUNT}} 个

### P1 数据对象
- [Entity](./entity/) - {{ENTITY_COUNT}} 个
- [DTO](./dto/) - {{DTO_COUNT}} 个
- [VO/Response](./vo-response/) - {{VO_RESPONSE_COUNT}} 个
- [Request](./request/) - {{REQUEST_COUNT}} 个
- [Exception](./exception/) - {{EXCEPTION_COUNT}} 个
- [Enum](./enum/) - {{ENUM_COUNT}} 个

### P2 技术组件
- [Constants](./constants/) - {{CONSTANTS_COUNT}} 个
- [Feign](./feign/) - {{FEIGN_COUNT}} 个
- [Config](./config/) - {{CONFIG_COUNT}} 个
- [Handler](./handler/) - {{HANDLER_COUNT}} 个
- [Job/Task](./job-task/) - {{JOB_TASK_COUNT}} 个
- [MQ Listener](./mq-listener/) - {{MQ_LISTENER_COUNT}} 个
- [Utils](./utils/) - {{UTILS_COUNT}} 个
- [Annotation](./annotation/) - {{ANNOTATION_COUNT}} 个

### 📐 架构文档
- [Architecture](./architecture.md) - 架构关系图与依赖分析

---

## 📊 统计概览

| 类型 | 文件数 | 代码行数 |
|------|--------|----------|
| Interface | {{INTERFACE_COUNT}} | {{INTERFACE_LOC}} |
| Abstract | {{ABSTRACT_COUNT}} | {{ABSTRACT_LOC}} |
| Controller | {{CONTROLLER_COUNT}} | {{CONTROLLER_LOC}} |
| Service | {{SERVICE_COUNT}} | {{SERVICE_LOC}} |
| Mapper | {{MAPPER_COUNT}} | {{MAPPER_LOC}} |
| Entity | {{ENTITY_COUNT}} | {{ENTITY_LOC}} |
| DTO | {{DTO_COUNT}} | {{DTO_LOC}} |
| VO/Response | {{VO_RESPONSE_COUNT}} | {{VO_RESPONSE_LOC}} |
| Request | {{REQUEST_COUNT}} | {{REQUEST_LOC}} |
| Exception | {{EXCEPTION_COUNT}} | {{EXCEPTION_LOC}} |
| Enum | {{ENUM_COUNT}} | {{ENUM_LOC}} |
| Constants | {{CONSTANTS_COUNT}} | {{CONSTANTS_LOC}} |
| Feign | {{FEIGN_COUNT}} | {{FEIGN_LOC}} |
| Config | {{CONFIG_COUNT}} | {{CONFIG_LOC}} |
| Handler | {{HANDLER_COUNT}} | {{HANDLER_LOC}} |
| Job/Task | {{JOB_TASK_COUNT}} | {{JOB_TASK_LOC}} |
| MQ Listener | {{MQ_LISTENER_COUNT}} | {{MQ_LISTENER_LOC}} |
| Utils | {{UTILS_COUNT}} | {{UTILS_LOC}} |
| Annotation | {{ANNOTATION_COUNT}} | {{ANNOTATION_LOC}} |
| **总计** | **{{TOTAL_COUNT}}** | **{{TOTAL_LOC}}** |

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
└──────┬──────┘     └─────────────┘     └─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Service   │ ←── │  Exception  │ ←── │  Constants  │
└──────┬──────┘     └─────────────┘     └─────────────┘
       ↓
┌─────────────┐     ┌─────────────┐
│   Mapper    │ ←── │    Enum     │
└──────┬──────┘     └─────────────┘
       ↓
┌─────────────┐
│   Entity    │
└─────────────┘
```

**数据流向**:
- Request → Controller → Service → Mapper → Entity
- Entity → Mapper → Service → Controller → Response/VO

---

## 📚 文档索引

### Interface
{{INTERFACE_LIST}}

### Abstract
{{ABSTRACT_LIST}}

### Controller
{{CONTROLLER_LIST}}

### Service
{{SERVICE_LIST}}

### Mapper
{{MAPPER_LIST}}

### Entity
{{ENTITY_LIST}}

### DTO
{{DTO_LIST}}

### VO/Response
{{VO_RESPONSE_LIST}}

### Request
{{REQUEST_LIST}}

### Exception
{{EXCEPTION_LIST}}

### Enum
{{ENUM_LIST}}

### Constants
{{CONSTANTS_LIST}}

### Feign
{{FEIGN_LIST}}

### Config
{{CONFIG_LIST}}

### Handler
{{HANDLER_LIST}}

### Job/Task
{{JOB_TASK_LIST}}

### MQ Listener
{{MQ_LISTENER_LIST}}

### Utils
{{UTILS_LIST}}

### Annotation
{{ANNOTATION_LIST}}

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
