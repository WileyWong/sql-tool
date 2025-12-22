---
name: doc-extract-proj-top-down
description: 为 Spring Boot 项目生成结构化知识文档。触发词：知识库、项目文档、代码索引、提取知识、生成文档。自顶向下：先生成总索引 README，再逐章生成 19 个标准化模块文档，每章生成后询问用户。
---

# 自顶向下提取项目知识

为 Spring Boot 项目生成结构化的知识索引文档。

## 快速开始

```
用户: 为这个项目生成知识库
AI: [扫描代码] → [生成 README.md] → [询问用户] → [逐章生成19个分类文档]
```

## 执行流程

### 1. 扫描代码规划分类
扫描项目结构，统计 19 个标准分类的类数量。

### 2. 生成总索引 README（首先生成）
使用 [templates/core/directory-index.md](./templates/core/directory-index.md) 生成 `kb/README.md`。

**询问用户**: "总索引 README.md 已生成。请选择: 1) 继续生成分类文档 2) 使用TODO技能来批量生成分类文档  3)优化当前索引"

### 3. 分批生成分类文档

| 批次 | 文档 | 模板 | 优先级 |
|------|------|------|--------|
| 1 | `interface.md` | [interface.md](./templates/core/interface.md) | P0 |
| 2 | `abstract.md` | [abstract.md](./templates/core/abstract.md) | P0 |
| 3 | `service-api-http.md` | [service-api-http.md](./templates/core/service-api-http.md) | P0 |
| 4 | `business-logic.md` | [business-logic.md](./templates/core/business-logic.md) | P0 |
| 5 | `orm-mapper.md` | [orm-mapper.md](./templates/core/orm-mapper.md) | P0 |
| 6 | `entity.md` + `dto.md` | [entity.md](./templates/core/entity.md), [dto.md](./templates/core/dto.md) | P1 |
| 7 | `service-response-object.md` + `front-end-request.md` | [service-response-object.md](./templates/core/service-response-object.md), [front-end-request.md](./templates/core/front-end-request.md) | P1 |
| 8 | `exception.md` + `enum.md` | [exception.md](./templates/core/exception.md), [enum.md](./templates/core/enum.md) | P1 |
| 9 | `feign.md` + `handler.md` | [feign.md](./templates/core/feign.md), [handler.md](./templates/core/handler.md) | P2 |
| 10 | `job-task.md` + `mq-listener.md` | [job-task.md](./templates/core/job-task.md), [mq-listener.md](./templates/core/mq-listener.md) | P2 |
| 11 | `utils.md` + `common.md` | [utils.md](./templates/core/utils.md), [common.md](./templates/core/common.md) | P2 |
| 12 | `annotation.md` + `constants.md` | [annotation.md](./templates/core/annotation.md), [constants.md](./templates/core/constants.md) | P2 |

**每批后询问**: "第 X 章节已生成。请选择: 1) 继续下一章 2) 优化当前章 3) 使用TODO技能来分批生成剩余分类文档"

### 4. 批量添加关联和维护记录
- 为每个文档添加 `📚 相关文档` 节
- 为每个文档添加 `📝 维护记录` 节

### 5. 更新总索引
填充 README.md 实际统计数据。

### 6. 询问是否生成扩展文档

**核心文档完成后询问**:
```
✅ 19 个核心文档已全部生成完成。

是否需要生成扩展文档？扩展文档包括：
- directory-structure.md (目录结构)
- spring-configuration.md (Spring配置)
- business-flows.md (业务流程)
- api-contracts.md (API契约)
- interceptors-aspects.md (拦截器切面)
- security-auth.md (安全认证)
- database-structure.md (数据库结构)
- environment-config.md (环境配置)
- third-party-interfaces.md (第三方接口)
- third-party-components.md (第三方组件)

请选择:
1) 使用TODO技能来分批生成全部扩展文档
2) 选择性生成（请指定文档名）
3) 跳过，完成知识库生成
```

如用户选择生成扩展文档，使用 [templates/optional/](./templates/optional/) 目录下的模板。

## 输出结构

```
kb/
├── README.md                  # 总索引 (首先生成)
│
│   # === 核心文档 (19个，必须生成) ===
├── interface.md               # 1. 接口定义
├── abstract.md                # 2. 抽象类
├── service-api-http.md        # 3. HTTP API
├── business-logic.md          # 4. 业务逻辑
├── orm-mapper.md              # 5. ORM映射
├── entity.md                  # 6. 实体
├── dto.md                     # 7. DTO
├── service-response-object.md # 8. 响应对象
├── front-end-request.md       # 9. 请求对象
├── exception.md               # 10. 异常类
├── enum.md                    # 11. 枚举类
├── feign.md                   # 12. Feign
├── handler.md                 # 13. Handler
├── job-task.md                # 14. 定时任务
├── mq-listener.md             # 15. MQ监听
├── utils.md                   # 16. 工具类
├── common.md                  # 17. 公共类
├── annotation.md              # 18. 自定义注解
├── constants.md               # 19. 常量类
├── other.md                   # 兜底. 其他类（无法归类的）
│
│   # === 扩展文档 (可选，用户确认后生成) ===
└── extra/
    ├── README.md              # 扩展文档索引
    ├── directory-structure.md # 目录结构
    ├── spring-configuration.md # Spring配置
    ├── business-flows.md      # 业务流程
    ├── api-contracts.md       # API契约
    ├── interceptors-aspects.md # 拦截器切面
    ├── security-auth.md       # 安全认证
    ├── database-structure.md  # 数据库结构
    ├── environment-config.md  # 环境配置
    ├── third-party-interfaces.md # 第三方接口
    └── third-party-components.md # 第三方组件
```

## 核心约束

- **自顶向下**: 先生成 README，再生成分类文档
- **逐章询问**: 每章完成后必须询问用户
- **独立记录**: 每个类单独记录，禁止"其他 XXX"归类
- **完整读取**: 必须完整读取源码文件
- **代码行数**: 每个类记录代码行数（SLOC，不含空行和注释）
- **类型识别**: 根据注解/继承/关键字识别，**完全忽略目录名**
- **依赖追踪**: 记录每个类的依赖注入和被引用关系
- **调用链**: 方法表格包含调用链信息

## 类型识别规则

⚠️ **目录名不可信**: `controller` 目录可能含 Service，`service` 目录可能含 Mapper

**识别优先级**: 注解 > 继承/关键字 > 命名约定 > 作用

| 类型 | 识别依据（按优先级） |
|------|---------------------|
| Interface | `interface` 关键字（非 `@interface`） |
| Abstract | `abstract class` 关键字 |
| Controller | `@RestController` > `@Controller` |
| Service | `@Service` > `*ServiceImpl` |
| Mapper | `@Mapper` > `extends BaseMapper` > `*Mapper` |
| Entity | `@Entity` > `@TableName` > `@Table` |
| Feign | `@FeignClient` |
| Exception | `extends Exception` > `extends RuntimeException` |
| Enum | `enum` 关键字定义 |
| Annotation | `@interface` 定义 |
| Constants | `*Constants.java` > `*Constant.java` > 全静态final字段类 |
| **Other（兜底）** | **无法匹配上述任何类型时使用 default.md 模板** |

## 类记录必含字段

每个类记录必须包含：

```markdown
## {{CLASS_NAME}} - 类描述

**类路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}`  
**代码行数**: {{LOC}} 行（SLOC）  
**继承**: `extends {{PARENT_CLASS}}`（无则填"无"）  
**实现**: `implements {{INTERFACES}}`（无则填"无"）  
**类注解**: `@Service`, `@Slf4j`, `@RequiredArgsConstructor`

#### 依赖注入（如有）
| 依赖 | 类型 | 用途 |
|------|------|------|
| {{FIELD_NAME}} | {{FIELD_TYPE}} | {{PURPOSE}} |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| {{METHOD}} | {{PARAMS}} | {{RETURN}} | {{DESC}} | → {{CALL_CHAIN}} |

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| {{CALLER}} | {{REF_TYPE}} | {{PURPOSE}} |
```

## 灵活性原则

### 文档命名
模板中的文档名称**仅供参考**，可根据项目实际情况调整：
- `service-api-http.md` → `api-endpoints.md` 或 `controllers.md`
- `business-logic.md` → `services.md` 或 `domain-services.md`
- 命名应反映项目实际术语和团队习惯

### 按需生成
**不是所有项目都需要生成全部文档**：
- **无内容则跳过**: 如项目无 Feign 客户端，则不生成 `feign.md`
- **有内容则生成**: 如项目有 WebSocket 处理器，应生成 `websocket-handler.md`
- **扫描时统计**: 步骤1扫描后，仅为有内容的分类生成文档

### 扩展未列分类
如发现模板未涵盖的重要代码分类，**应主动生成**：
- 事件监听器 → `event-listeners.md`
- WebSocket → `websocket.md`
- GraphQL → `graphql-resolvers.md`
- gRPC → `grpc-services.md`
- 缓存管理 → `cache-managers.md`
- 其他项目特有的重要组件

**原则**: 文档服务于项目理解，而非机械套用模板。

## 模板组织

```
templates/
├── core/           # 19个核心模板 + 1个兜底模板 + 1个索引模板（必须）
│   ├── README.md
│   ├── directory-index.md
│   ├── default.md          # 兜底：无法识别类型时使用
│   ├── interface.md
│   ├── abstract.md
│   ├── service-api-http.md
│   ├── exception.md
│   ├── enum.md
│   ├── annotation.md
│   ├── constants.md
│   └── ...
└── optional/       # 扩展模板（可选）
    ├── README.md
    ├── directory-structure.md
    ├── business-flows.md
    ├── api-contracts.md
    ├── database-structure.md
    └── ...
```

## 参考资源

- [reference.md](./reference.md) - 19个标准分类和扫描策略
- [examples.md](./examples.md) - 使用示例
- [checklist.md](./checklist.md) - 验证清单
- [templates/core/](./templates/core/) - 核心模板
- [templates/optional/](./templates/optional/) - 扩展模板
