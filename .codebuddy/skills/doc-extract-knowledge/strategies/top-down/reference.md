# 技术参考

## 目录

- [19个标准分类（核心文档）](#19个标准分类核心文档)
- [10个扩展文档（可选）](#10个扩展文档可选)
- [类型识别规则](#类型识别规则)
- [代码行数统计](#代码行数统计)
- [灵活性原则](#灵活性原则)
- [生成顺序](#生成顺序)
- [类记录格式](#类记录格式)
- [标准相关文档节](#标准相关文档节)
- [标准维护记录节](#标准维护记录节)
- [质量验证规则](#质量验证规则)
- [常见错误](#常见错误)

---

## 19个标准分类（核心文档）+ 1个兜底分类

| 序号 | 文档 | 扫描模式 | 优先级 |
|------|------|----------|--------|
| 1 | `interface.md` | `interface` 关键字（非 `@interface`） | P0 |
| 2 | `abstract.md` | `abstract class` 关键字 | P0 |
| 3 | `service-api-http.md` | `@RestController`, `@Controller` | P0 |
| 4 | `business-logic.md` | `@Service`, `*ServiceImpl.java` | P0 |
| 5 | `orm-mapper.md` | `@Mapper`, `*Mapper.java` | P0 |
| 6 | `entity.md` | `@Entity`, `@TableName` | P1 |
| 7 | `dto.md` | `*DTO.java`, `*Dto.java` | P1 |
| 8 | `service-response-object.md` | `*Response.java`, `*VO.java` | P1 |
| 9 | `front-end-request.md` | `*Request.java` | P1 |
| 10 | `exception.md` | `extends Exception`, `extends RuntimeException` | P1 |
| 11 | `enum.md` | `enum` 关键字定义 | P1 |
| 12 | `feign.md` | `@FeignClient` | P2 |
| 13 | `handler.md` | `*Handler.java` | P2 |
| 14 | `job-task.md` | `@Scheduled`, `@Async` | P2 |
| 15 | `mq-listener.md` | `@RabbitListener`, `@KafkaListener` | P2 |
| 16 | `utils.md` | `*Util.java`, `*Utils.java` | P2 |
| 17 | `common.md` | `@Configuration`, 常量类 | P2 |
| 18 | `annotation.md` | `@interface` 定义 | P2 |
| 19 | `constants.md` | `*Constants.java`, `*Constant.java` | P2 |
| - | **`other.md`（兜底）** | **无法匹配上述任何类型** | 兜底 |

---

## 10个扩展文档（可选）

| 序号 | 文档 | 扫描模式 | 用途 |
|------|------|----------|------|
| 1 | `directory-structure.md` | 项目目录树 | 目录结构说明 |
| 2 | `spring-configuration.md` | `@Configuration`, `application*.yml` | Spring配置详解 |
| 3 | `business-flows.md` | 跨类调用链分析 | 核心业务流程 |
| 4 | `api-contracts.md` | Controller + Swagger注解 | API契约文档 |
| 5 | `interceptors-aspects.md` | `@Aspect`, `HandlerInterceptor` | 拦截器和切面 |
| 6 | `security-auth.md` | `@PreAuthorize`, `SecurityConfig` | 安全认证 |
| 7 | `database-structure.md` | DDL, 表结构 | 数据库结构 |
| 8 | `environment-config.md` | `application-*.yml`, 环境变量 | 环境配置 |
| 9 | `third-party-interfaces.md` | 外部API调用 | 第三方接口 |
| 10 | `third-party-components.md` | Redis, MQ, OSS等 | 第三方组件 |

---

## 类型识别规则

### ⚠️ 核心原则：完全忽略目录名

目录名不可信，必须根据类定义识别类型：
- `controller` 目录可能含 Service
- `service` 目录可能含 Mapper
- `dao` 目录可能含 Controller

### 识别优先级

```
注解 > 继承/关键字 > 命名约定 > 作用
```

### 详细识别规则

| 类型 | 识别依据（按优先级） |
|------|---------------------|
| Interface | `public interface Xxx`（非 `@interface`） |
| Abstract | `public abstract class Xxx` |
| Controller | `@RestController` > `@Controller` |
| Service | `@Service` > 类名含 `ServiceImpl` |
| Mapper | `@Mapper` > `extends BaseMapper` > 类名含 `Mapper` |
| Feign | `@FeignClient` |
| Entity | `@Entity` > `@TableName` > `@Table` > 纯POJO |
| Config | `@Configuration` > `@ConfigurationProperties` |
| Annotation | `public @interface Xxx` |
| Exception | `extends Exception` > `extends RuntimeException` > `*Exception.java` |
| Enum | `public enum Xxx` |
| Constants | `*Constants.java` > `*Constant.java` > 全 `static final` 字段类 |
| **Other（兜底）** | **无法匹配上述任何类型时使用 default.md 模板** |

---

## 代码行数统计

### LOC 定义

**LOC (Lines of Code)** = SLOC（Source Lines of Code）

| 包含 | 不包含 |
|------|--------|
| 有效代码行 | 空行 |
| 含代码的注释行 | 纯注释行（`//` 或 `/* */`） |
| | 仅含 `{` 或 `}` 的行 |

### 在文档中展示

```markdown
**代码行数**: 156 行（SLOC）
```

---

## 灵活性原则

### 文档命名仅供参考

上述文档名称是**推荐命名**，可根据项目实际情况调整：

| 模板名称 | 可选替代名称 |
|----------|-------------|
| `service-api-http.md` | `controllers.md`, `api-endpoints.md`, `rest-api.md` |
| `business-logic.md` | `services.md`, `domain-services.md`, `core-services.md` |
| `orm-mapper.md` | `mappers.md`, `dao.md`, `repositories.md` |
| `entity.md` | `domain-models.md`, `po.md`, `persistent-objects.md` |
| `dto.md` | `transfer-objects.md`, `view-models.md` |

### 按需生成原则

**无内容则跳过**:
- 项目无 `@FeignClient` → 不生成 `feign.md`
- 项目无 `@Scheduled` → 不生成 `job-task.md`
- 项目无 MQ 监听器 → 不生成 `mq-listener.md`

**有内容则生成**:
- 发现 WebSocket 处理器 → 生成 `websocket.md`
- 发现事件监听器 → 生成 `event-listeners.md`
- 发现 GraphQL 解析器 → 生成 `graphql-resolvers.md`

### 扩展未列分类

如发现模板未涵盖的重要代码分类，应主动创建文档：

| 发现内容 | 建议文档名 | 扫描模式 |
|----------|-----------|----------|
| WebSocket | `websocket.md` | `@ServerEndpoint`, `WebSocketHandler` |
| 事件监听 | `event-listeners.md` | `@EventListener`, `ApplicationListener` |
| GraphQL | `graphql-resolvers.md` | `@QueryMapping`, `@MutationMapping` |
| gRPC | `grpc-services.md` | `*Grpc.java`, `@GrpcService` |
| 缓存管理 | `cache-managers.md` | `@Cacheable`, `CacheManager` |
| 状态机 | `state-machines.md` | `StateMachine`, `@WithStateMachine` |
| 规则引擎 | `rule-engines.md` | `Drools`, `EasyRules` |

**核心原则**: 文档服务于项目理解，而非机械套用模板。

---

## 生成顺序

```
扫描代码 → README.md → [询问] → 第1批(Interface) → [询问] → 第2批(Abstract) → ... → 第12批 → 批量收尾 → [询问扩展文档] → [可选]生成扩展文档
```

---

## 类记录格式

每个类记录必须包含以下字段：

### 必填字段

```markdown
## ClassName - 类描述

**类路径**: `com.example.package.ClassName`  
**代码行数**: 156 行（SLOC）  
**继承**: `extends BaseClass`（无则填"无"）  
**实现**: `implements Interface1, Interface2`（无则填"无"）  
**类注解**: `@Service`, `@Slf4j`, `@RequiredArgsConstructor`

#### 依赖注入（如有）
| 依赖 | 类型 | 用途 |
|------|------|------|
| userMapper | UserMapper | 数据访问 |

#### 方法列表
| 方法签名 | 参数 | 返回值 | 功能 | 调用链 |
|---------|------|--------|------|--------|
| getUserById(Long id) | id-用户ID | UserVO | 查询用户 | → userMapper.selectById() |

#### 被引用
| 引用者 | 引用方式 | 用途 |
|--------|----------|------|
| UserController | 依赖注入 | 业务调用 |
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| 类路径 | ✅ | 完整包名 + 类名 |
| 代码行数 | ✅ | SLOC（不含空行和注释） |
| 继承 | ✅ | extends 的父类，无则填"无" |
| 实现 | ✅ | implements 的接口，无则填"无" |
| 类注解 | ✅ | 类级别的所有注解 |
| 依赖注入 | 可选 | @Autowired/@Resource 注入的依赖 |
| 方法列表 | ✅ | 包含调用链列 |
| 被引用 | ✅ | 哪些类引用了本类 |

---

## 标准相关文档节

```markdown
## 📚 相关文档

- [接口定义索引](./interface.md)
- [抽象类索引](./abstract.md)
- [HTTP API索引](./service-api-http.md)
- [业务逻辑层索引](./business-logic.md)
- [ORM映射器索引](./orm-mapper.md)
- [DTO对象索引](./dto.md)
- [Entity对象索引](./entity.md)
- [Response对象索引](./service-response-object.md)
- [Request对象索引](./front-end-request.md)
- [异常类索引](./exception.md)
- [枚举类索引](./enum.md)
- [Feign接口索引](./feign.md)
- [Handler处理器索引](./handler.md)
- [Job-Task索引](./job-task.md)
- [MQ监听器索引](./mq-listener.md)
- [工具类索引](./utils.md)
- [Common公共类索引](./common.md)
- [自定义注解索引](./annotation.md)
- [常量类索引](./constants.md)
- [其他类索引](./other.md)
```

---

## 标准维护记录节

```markdown
## 📝 维护记录

| 时间 | 维护人 | 内容 | 版本 |
|------|--------|------|------|
| YYYY-MM-DD | AI | 初始创建 | v1.0 |
```

---

## 质量验证规则

生成完成后，执行以下验证确保文档质量：

### 1. 禁止综合归档检查

在生成的文档中搜索以下关键词，**不应存在**：
- `其他`
- `其它`
- `等类`
- `...等`

```bash
# 验证命令（应无输出）
grep -r "其他\|其它\|等类" kb/*.md
```

### 2. 独立记录检查

每个类必须有独立的二级标题（`##`），验证方式：
- 统计源码中的类数量
- 统计文档中 `##` 标题数量
- 两者应基本一致（允许±5%误差）

### 3. 必要字段检查

每个类记录必须包含：
- [ ] 类路径（`**类路径**:`）
- [ ] 代码行数（`**代码行数**:`）
- [ ] 方法表格（至少包含：方法签名、参数、返回值、功能）

### 4. 类型识别检查

验证类型识别是否正确：
- [ ] 检查是否按注解而非目录名识别
- [ ] 抽查几个文件确认路径正确
- [ ] Interface 和 Abstract 是否正确识别

### 5. 链接有效性检查

- [ ] README.md 中所有文档链接指向实际存在的文件
- [ ] 相关文档节中的链接与实际生成的文档一致

### 6. 完整性检查

- [ ] 每个有内容的分类都生成了对应文档
- [ ] 无内容的分类未生成空文档
- [ ] 扩展文档放置在 `extra/` 目录

---

## 常见错误

### ❌ 综合归档
```markdown
## 其他 Service
- OrderService
- ProductService
```

### ✅ 独立记录
```markdown
## OrderService
**类路径**: `com.example.service.OrderService`
[方法表格]

## ProductService
**类路径**: `com.example.service.ProductService`
[方法表格]
```

### ❌ 文件读取不完整
只读取前 100 行

### ✅ 完整读取
完整读取，超长文件分段读取

### ❌ 忘记询问
生成多章后才询问

### ✅ 逐章询问
每章生成后立即询问
