# 技术参考

> ⚠️ **重要**：执行时必须遵守 SKILL.md 中的"强制执行规则"：
> 1. 按文件序号分批处理（每批 10 个文件），不得按类型或目录分批
> 2. **必须按模板生成文档**：生成前必须读取对应类型的模板文件（templates/core/{type}.md），禁止凭记忆生成
> 3. **每个文件完成后立即更新进度**：生成文档后立即更新进度文件，必须在处理下一个文件之前完成
> 4. **进度文件条目绝对不可变**：禁止增删改条目，仅允许更新状态、生成文档路径、方法数
> 5. **必须基于实际生成结果更新**：文档实际生成成功才能标记为✅，禁止预先批量更新状态

## 目录

- [19个核心类型](#19个核心类型)
- [11个扩展文档（可选）](#11个扩展文档可选)
- [类型识别规则](#类型识别规则)
- [依赖关系分析](#依赖关系分析)
- [循环依赖检测算法](#循环依赖检测算法)
- [代码行数统计](#代码行数统计)
- [灵活性原则](#灵活性原则)
- [生成顺序](#生成顺序)
- [类文档格式](#类文档格式)
- [架构文档格式](#架构文档格式)
- [标准索引节](#标准索引节)
- [质量验证规则](#质量验证规则)
- [常见错误](#常见错误)

---

## 19个核心类型 + 1个兜底类型

| 序号 | 类型 | 目录 | 识别依据 | 优先级 |
|------|------|------|----------|--------|
| 1 | Interface | `interface/` | `interface` 关键字（非 `@interface`） | P0 |
| 2 | Abstract | `abstract/` | `abstract class` 关键字 | P0 |
| 3 | Controller | `controller/` | `@RestController`, `@Controller` | P0 |
| 4 | Service | `service/` | `@Service`, `*ServiceImpl.java` | P0 |
| 5 | Mapper | `mapper/` | `@Mapper`, `extends BaseMapper` | P0 |
| 6 | Entity | `entity/` | `@Entity`, `@TableName` | P1 |
| 7 | DTO | `dto/` | `*DTO.java`, `*Dto.java` | P1 |
| 8 | VO/Response | `vo-response/` | `*VO.java`, `*Response.java` | P1 |
| 9 | Request | `request/` | `*Request.java`, `*RequestDTO.java` | P1 |
| 10 | Feign | `feign/` | `@FeignClient` | P2 |
| 11 | Config | `config/` | `@Configuration` | P2 |
| 12 | Handler | `handler/` | `*Handler.java`（细分见下文） | P2 |
| 13 | Job/Task | `job-task/` | `@Scheduled`, `@Async` | P2 |
| 14 | MQ Listener | `mq-listener/` | `@RabbitListener`, `@KafkaListener` | P2 |
| 15 | Utils | `utils/` | `*Util.java`, `*Utils.java` | P2 |
| 16 | Annotation | `annotation/` | `@interface` 定义 | P2 |
| 17 | Exception | `exception/` | `extends *Exception` | P1 |
| 18 | Enum | `enum/` | `enum` 定义 | P1 |
| 19 | Constants | `constants/` | `*Constants.java`, `*Constant.java` | P2 |
| - | **Other（兜底）** | `other/` | **无法匹配上述任何类型** | 兜底 |

---

## 11个扩展文档（可选）

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
| 11 | `custom-annotations.md` | `@interface` 自定义注解 | 自定义注解说明 |
| 11 | `custom-annotations.md` | `@interface` 自定义注解 | 自定义注解说明 |

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
| DTO | 类名以 `DTO` 或 `Dto` 结尾（排除 `*RequestDTO`） |
| VO/Response | 类名以 `VO` 或 `Response` 结尾 |
| Request | 类名以 `Request` 结尾，或 `*RequestDTO.java` |
| Handler | 类名以 `Handler` 结尾（细分见下文） |
| Utils | 类名以 `Util` 或 `Utils` 结尾 |
| Job/Task | `@Scheduled` > `@Async` > 类名含 `Job` 或 `Task` |
| MQ Listener | `@RabbitListener` > `@KafkaListener` > `@JmsListener` |
| **Other（兜底）** | **无法匹配上述任何类型时使用 default.md 模板** |

### Handler 细分规则

| 子类型 | 识别依据 | 归类目录 |
|--------|----------|----------|
| GlobalExceptionHandler | `@ControllerAdvice` + `@ExceptionHandler` | `handler/` |
| EventHandler | `@EventListener` 或 `implements ApplicationListener` | `event-listener/` |
| WebSocketHandler | `@ServerEndpoint` 或 `extends WebSocketHandler` | `websocket/` |
| 通用Handler | `*Handler.java`（不匹配上述） | `handler/` |

### 命名冲突优先级

当类名同时满足多个规则时：

| 类名模式 | 归类 | 原因 |
|----------|------|------|
| `*RequestDTO.java` | Request | Request 优先于 DTO |
| `*ResponseVO.java` | VO/Response | VO 后缀优先 |
| `*ServiceImpl.java` + `@Service` | Service | 注解确认 |
| `Abstract*Service.java` | Abstract | abstract 关键字优先 |

---

## 依赖关系分析

### 双向依赖记录

每个类文档必须记录：

1. **依赖组件（我依赖谁）**: 本类注入或调用的其他组件
2. **被依赖方（谁依赖我）**: 哪些组件注入或调用了本类

### 依赖识别方法

**识别依赖组件**:
- `@Autowired` 注入的字段
- `@Resource` 注入的字段
- 构造函数注入的参数
- `@RequiredArgsConstructor` 的 `final` 字段
- 方法参数中的组件类型

**识别被依赖方**（在汇总阶段生成）:
- 处理过程中逐步建立正向依赖索引
- 汇总阶段反转索引得到被依赖关系

### 泛型信息记录

对于泛型类，需记录泛型参数：

```markdown
## 📊 统计信息

| 泛型参数 | 说明 |
|----------|------|
| `T extends BaseEntity` | 实体类型 |
| `ID extends Serializable` | 主键类型 |
```

### 依赖关系图

在 `architecture.md` 中生成：

```
┌─────────────────────────────────────────────────────────────┐
│                      Interface 层                            │
│  IUserService        IOrderService        IPaymentService    │
└──────────┬─────────────────┬─────────────────┬──────────────┘
           ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────┐
│                        Controller 层                         │
│  UserController ──→ OrderController ──→ PaymentController   │
└──────────┬─────────────────┬─────────────────┬──────────────┘
           ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────┐
│                         Service 层                           │
│  UserServiceImpl ←──→ OrderServiceImpl ←──→ PaymentServiceImpl│
└──────────┬─────────────────┬─────────────────┬──────────────┘
           ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────┐
│                         Mapper 层                            │
│  UserMapper        OrderMapper        PaymentMapper          │
└──────────┬─────────────────┬─────────────────┬──────────────┘
           ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────┐
│                         Entity 层                            │
│  User              Order              Payment                │
└─────────────────────────────────────────────────────────────┘
```

---

## 循环依赖检测算法

### DFS 染色法

使用深度优先搜索（DFS）检测有向图中的环：

```
算法: DFS 染色法检测循环依赖

颜色定义:
- WHITE (0): 未访问
- GRAY  (1): 正在访问（在当前 DFS 路径上）
- BLACK (2): 已完成访问

伪代码:
function hasCycle(graph):
    color = {}  // 所有节点初始为 WHITE
    
    for each node in graph:
        if color[node] == WHITE:
            if dfs(node, graph, color):
                return true
    return false

function dfs(node, graph, color):
    color[node] = GRAY  // 标记为正在访问
    
    for each neighbor in graph[node]:
        if color[neighbor] == GRAY:
            // 发现环！记录环路径
            return true
        if color[neighbor] == WHITE:
            if dfs(neighbor, graph, color):
                return true
    
    color[node] = BLACK  // 标记为已完成
    return false
```

### 环路径记录

检测到环时，记录完整路径：

```
循环依赖检测结果:

⚠️ 发现 1 处循环依赖:

1. ServiceA → ServiceB → ServiceC → ServiceA
   
   建议解决方案:
   - 方案1: 提取公共逻辑到新 Service
   - 方案2: 使用事件机制解耦
   - 方案3: 使用 @Lazy 延迟注入
```

### 分层违规检测

除了循环依赖，还应检测分层违规：

```
分层规则:
- Controller 不应被 Service 依赖
- Mapper 不应依赖 Service
- Entity 不应依赖任何组件

违规示例:
⚠️ 分层违规: UserMapper → UserService（Mapper 不应依赖 Service）
```

---

## 代码行数统计

### LOC 定义

**LOC (Lines of Code)** = SLOC（Source Lines of Code）

| 包含 | 不包含 |
|------|--------|
| 有效代码行 | 空行 |
| 含代码的注释行 | 纯注释行（`//` 或 `/* */`） |
| | 仅含 `{` 或 `}` 的行 |
| | import 语句（可选） |

### 统计方法

```
简化统计:
LOC = 总行数 - 空行数 - 纯注释行数

精确统计（推荐）:
使用正则匹配有效代码行
```

### 在文档中展示

```markdown
> **代码行数**: 156 行（SLOC，不含空行和注释）
```

---

## 灵活性原则

### 按需生成原则

**无内容则跳过**:
- 项目无 `interface` 定义 → 不创建 `interface/` 目录
- 项目无 `@FeignClient` → 不创建 `feign/` 目录
- 项目无 `@Scheduled` → 不创建 `job-task/` 目录
- 项目无 MQ 监听器 → 不创建 `mq-listener/` 目录
- 项目无自定义异常 → 不创建 `exception/` 目录

**有内容则生成**:
- 发现 WebSocket 处理器 → 创建 `websocket/` 目录
- 发现事件监听器 → 创建 `event-listener/` 目录
- 发现 GraphQL 解析器 → 创建 `graphql/` 目录

### 扩展未列分类

如发现模板未涵盖的重要代码分类，应主动创建目录：

| 发现内容 | 建议目录 | 识别依据 |
|----------|----------|----------|
| WebSocket | `websocket/` | `@ServerEndpoint`, `WebSocketHandler` |
| 事件监听 | `event-listener/` | `@EventListener`, `ApplicationListener` |
| GraphQL | `graphql/` | `@QueryMapping`, `@MutationMapping` |
| gRPC | `grpc/` | `*Grpc.java`, `@GrpcService` |
| 缓存管理 | `cache/` | `@Cacheable`, `CacheManager` |
| 状态机 | `state-machine/` | `StateMachine`, `@WithStateMachine` |
| 规则引擎 | `rule-engine/` | `Drools`, `EasyRules` |

**核心原则**: 文档服务于项目理解，而非机械套用模板。

---

## 生成顺序

```
完整扫描 → 生成清单
    ↓
生成执行计划
    ↓
按批次生成文档（边处理边记录依赖）
    ↓
按文件序号分批处理（每批 10 个文件）
    ↓
汇总阶段（反转索引，生成被依赖关系）
    ↓
循环依赖检测
    ↓
生成 architecture.md
    ↓
生成 README.md
    ↓
质量检查
    ↓
[询问扩展文档]
```

⚠️ **注意**：生成文档时按 `.task-plan.md` 中的文件序号顺序处理，不是按类型顺序。类型识别仅用于选择正确的模板。

---

## 类文档格式

```markdown
# {{CLASS_NAME}}

> **路径**: `{{PACKAGE_NAME}}.{{CLASS_NAME}}`  
> **类型**: {{TYPE}}  
> **职责**: {{RESPONSIBILITY}}  
> **代码行数**: {{LOC}} 行（SLOC，不含空行和注释）

---

## 📊 统计信息

[根据类型展示不同的统计表格]

---

## 📋 方法/接口列表

[根据类型展示不同的内容格式]
[必须包含完整方法签名，见下方"完整方法签名规范"]

---

## 🔗 依赖组件（我依赖谁）

| 组件 | 类型 | 用途 |
|------|------|------|
| {{DEP_NAME}} | {{DEP_TYPE}} | {{DEP_PURPOSE}} |

---

## 🔙 被依赖方（谁依赖我）

| 组件 | 类型 | 调用方法 |
|------|------|----------|
| {{CALLER_NAME}} | {{CALLER_TYPE}} | {{CALLED_METHODS}} |

**影响分析**: 修改本类可能影响 {{IMPACT_COUNT}} 个组件

---

## 🏷️ 关键注解

```java
{{ANNOTATIONS}}
```
```

---

## 完整方法签名规范

⚠️ **关键要求**: 每个方法必须记录**完整的方法签名**，这是知识库的核心价值所在。

### 方法签名必须包含的元素

| 元素 | 说明 | 是否必须 |
|------|------|----------|
| 方法注解 | `@GetMapping`, `@Transactional`, `@Async` 等 | ✅ 必须 |
| 访问修饰符 | `public`, `protected`, `private` | ✅ 必须 |
| 返回类型 | 完整类型（含泛型），如 `List<UserVO>` | ✅ 必须 |
| 方法名 | 方法名称 | ✅ 必须 |
| 参数列表 | 每个参数的注解、类型、名称 | ✅ 必须 |
| 异常声明 | `throws` 声明的异常类型 | ✅ 必须（如有） |

### 参数信息必须包含

每个参数必须记录：
- **参数注解**: `@RequestParam`, `@PathVariable`, `@RequestBody`, `@Valid`, `@NotNull` 等
- **注解属性**: `value`, `required`, `defaultValue` 等
- **参数类型**: 完整类型（含泛型）
- **参数名**: 参数名称

### 各类型方法签名格式

#### Controller 方法

```markdown
### getUserById
- **完整签名**:
  ```java
  @GetMapping("/users/{id}")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<Result<UserVO>> getUserById(
      @PathVariable("id") Long id,
      @RequestParam(value = "includeOrders", required = false, defaultValue = "false") Boolean includeOrders,
      @RequestHeader("Authorization") String token
  )
  ```
- **HTTP方法**: GET
- **路径**: `/users/{id}`
- **参数说明**:
  | 参数 | 类型 | 注解 | 必填 | 默认值 | 说明 |
  |------|------|------|------|--------|------|
  | id | Long | @PathVariable | ✅ | - | 用户ID |
  | includeOrders | Boolean | @RequestParam | ❌ | false | 是否包含订单 |
  | token | String | @RequestHeader | ✅ | - | 认证令牌 |
- **返回**: `ResponseEntity<Result<UserVO>>` - 用户详情
- **权限**: `hasRole('USER')`
- **说明**: 根据ID查询用户详细信息
```

#### Service 方法

```markdown
### createUser
- **完整签名**:
  ```java
  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  @CacheEvict(value = "users", allEntries = true)
  public UserVO createUser(
      @Valid @NotNull CreateUserDTO dto,
      Long operatorId
  ) throws BusinessException, DuplicateKeyException
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | dto | CreateUserDTO | @Valid @NotNull | 用户创建请求 |
  | operatorId | Long | - | 操作人ID |
- **返回**: `UserVO` - 创建的用户信息
- **事务**: `@Transactional(rollbackFor = Exception.class)`
- **缓存**: `@CacheEvict(value = "users", allEntries = true)`
- **异常**:
  | 异常类型 | 触发条件 |
  |----------|----------|
  | BusinessException | 业务规则校验失败 |
  | DuplicateKeyException | 用户名已存在 |
- **说明**: 创建新用户，包含数据验证和缓存清理
```

#### Mapper/DAO 方法

```markdown
### selectByCondition
- **完整签名**:
  ```java
  @Select("<script>" +
          "SELECT * FROM user WHERE 1=1" +
          "<if test='name != null'> AND name LIKE CONCAT('%', #{name}, '%')</if>" +
          "<if test='status != null'> AND status = #{status}</if>" +
          "</script>")
  @Results({
      @Result(property = "createTime", column = "create_time"),
      @Result(property = "updateTime", column = "update_time")
  })
  List<User> selectByCondition(
      @Param("name") String name,
      @Param("status") Integer status,
      @Param("offset") Integer offset,
      @Param("limit") Integer limit
  )
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | name | String | @Param("name") | 用户名（模糊匹配） |
  | status | Integer | @Param("status") | 用户状态 |
  | offset | Integer | @Param("offset") | 分页偏移 |
  | limit | Integer | @Param("limit") | 每页数量 |
- **返回**: `List<User>` - 用户列表
- **SQL类型**: SELECT（动态SQL）
- **说明**: 根据条件分页查询用户
```

#### Interface 方法

```markdown
### processOrder
- **完整签名**:
  ```java
  /**
   * 处理订单
   * @param order 订单对象
   * @param async 是否异步处理
   * @return 处理结果
   * @throws OrderProcessException 订单处理异常
   */
  Result<OrderVO> processOrder(
      @NotNull Order order,
      @Nullable Boolean async
  ) throws OrderProcessException
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | order | Order | @NotNull | 订单对象 |
  | async | Boolean | @Nullable | 是否异步，可为null |
- **返回**: `Result<OrderVO>` - 处理结果
- **异常**: `OrderProcessException` - 订单处理异常
- **默认实现**: ❌ 无
- **说明**: 处理订单的核心接口方法
```

#### Feign Client 方法

```markdown
### getRemoteUser
- **完整签名**:
  ```java
  @GetMapping("/api/users/{id}")
  @Headers({"Content-Type: application/json", "Accept: application/json"})
  Result<UserDTO> getRemoteUser(
      @PathVariable("id") Long id,
      @RequestHeader("X-Request-Id") String requestId
  )
  ```
- **HTTP方法**: GET
- **远程路径**: `/api/users/{id}`
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | id | Long | @PathVariable | 用户ID |
  | requestId | String | @RequestHeader | 请求追踪ID |
- **返回**: `Result<UserDTO>` - 远程用户信息
- **降级**: 返回默认空用户对象
- **说明**: 调用用户服务获取用户信息
```

### 常见注解速查表

| 注解类型 | 常见注解 | 需要记录的属性 |
|----------|----------|----------------|
| HTTP映射 | `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@RequestMapping` | value/path, method, produces, consumes |
| 参数绑定 | `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`, `@CookieValue` | value, required, defaultValue |
| 验证 | `@Valid`, `@Validated`, `@NotNull`, `@NotBlank`, `@Size`, `@Pattern` | message, groups |
| 事务 | `@Transactional` | rollbackFor, propagation, isolation, readOnly |
| 缓存 | `@Cacheable`, `@CacheEvict`, `@CachePut` | value, key, condition |
| 安全 | `@PreAuthorize`, `@PostAuthorize`, `@Secured` | value/expression |
| 异步 | `@Async` | value (线程池名) |
| MyBatis | `@Select`, `@Insert`, `@Update`, `@Delete`, `@Param`, `@Results` | SQL语句, 参数名 |

---

## 架构文档格式

`architecture.md` 应包含：

```markdown
# 项目架构

## 分层架构图

[ASCII 架构图，包含 Interface 层]

## 模块依赖矩阵

| 模块 | 类型 | 依赖数 | 被依赖数 | 耦合度 |
|------|------|--------|----------|--------|
| {{MODULE}} | {{TYPE}} | {{DEP}} | {{REV_DEP}} | {{COUPLING}} |

## 循环依赖检测

{{CIRCULAR_RESULT}}

## 分层违规检测

{{LAYER_VIOLATION_RESULT}}

## 核心调用链

### 用户注册流程
UserController.register() 
  → UserService.createUser() 
    → UserMapper.insert()
    → EmailService.sendWelcome()

### 订单创建流程
OrderController.create()
  → OrderService.createOrder()
    → UserService.getUser()
    → ProductService.checkStock()
    → OrderMapper.insert()
    → PaymentService.initPayment()
```

---

## 标准索引节

README.md 应包含以下索引结构：

```markdown
## 📚 文档索引

### Interface (3个)
- [IUserService](./interface/IUserService.md)
- [IOrderService](./interface/IOrderService.md)
...

### Abstract (2个)
- [AbstractBaseService](./abstract/AbstractBaseService.md)
...

### Controller (5个)
- [UserController](./controller/UserController.md)
- [OrderController](./controller/OrderController.md)
...

### Service (12个)
- [UserService](./service/UserService.md)
- [OrderService](./service/OrderService.md)
...

### Exception (3个)
- [BusinessException](./exception/BusinessException.md)
- [AuthException](./exception/AuthException.md)
...

### Enum (5个)
- [UserStatus](./enum/UserStatus.md)
- [OrderStatus](./enum/OrderStatus.md)
...

### Constants (2个)
- [CommonConstants](./constants/CommonConstants.md)
- [ErrorCodeConstants](./constants/ErrorCodeConstants.md)
...

[按类型列出所有文档链接]
```

---

## 质量验证规则

生成完成后，执行以下验证确保文档质量：

### 1. 一类一文件检查

每个 Java 类必须生成独立的 `.md` 文件：
- 统计源码中的类数量
- 统计生成的 `.md` 文件数量
- 两者应完全一致

### 2. 类型识别检查

验证类型识别是否正确：
- 检查是否按注解而非目录名识别
- 抽查几个文件确认路径正确
- Interface 和 Abstract 是否正确识别

### 3. 必要字段检查

每个类文档必须包含：
- [ ] 类路径（`**路径**:`）
- [ ] 类型标识
- [ ] 职责描述
- [ ] 代码行数（SLOC）
- [ ] 统计信息表格
- [ ] 方法/接口列表
- [ ] 依赖组件
- [ ] 被依赖方

### 4. 方法签名完整性检查（⚠️ 关键）

每个方法必须包含完整签名：
- [ ] **方法注解**: 所有方法级注解（`@GetMapping`, `@Transactional` 等）
- [ ] **访问修饰符**: `public`/`protected`/`private`
- [ ] **返回类型**: 完整类型（含泛型）
- [ ] **方法名**: 准确的方法名
- [ ] **参数列表**: 每个参数的注解、类型、名称
- [ ] **异常声明**: `throws` 声明的所有异常

**参数信息检查**:
- [ ] 参数注解（`@PathVariable`, `@RequestParam`, `@RequestBody` 等）
- [ ] 注解属性（`value`, `required`, `defaultValue`）
- [ ] 参数类型（含泛型）
- [ ] 参数名称

### 5. 依赖关系检查

- [ ] 每个类都记录了依赖组件
- [ ] 每个类都记录了被依赖方
- [ ] 被依赖方通过反向索引生成
- [ ] architecture.md 包含完整的依赖图
- [ ] 循环依赖已检测并记录

### 6. 链接有效性检查

- [ ] README.md 中所有文档链接指向实际存在的文件
- [ ] 无空目录（无内容的类型不应创建目录）

### 7. 禁止归档检查

在生成的文档中搜索以下关键词，**不应存在**：
- `其他`
- `其它`
- `等类`
- `...等`

### 8. 变量格式检查

- [ ] 所有模板变量使用 `{{VARIABLE}}` 格式
- [ ] 无 `{variable}` 或 `{N}` 格式

---

## 常见错误

### ❌ 按目录名识别
```
com.xxx.controller.UserService.java → controller/UserService.md
```

### ✅ 按注解识别
```
com.xxx.controller.UserService.java (含 @Service) → service/UserService.md
```

### ❌ 多类合并
```markdown
# Service 类汇总
## UserService
## OrderService
```

### ✅ 独立文件
```
service/
├── UserService.md
└── OrderService.md
```

### ❌ 缺少被依赖方
```markdown
## 🔗 依赖组件
- UserMapper
（没有被依赖方章节）
```

### ✅ 双向依赖完整
```markdown
## 🔗 依赖组件（我依赖谁）
| 组件 | 类型 | 用途 |
|------|------|------|
| UserMapper | Mapper | 用户数据访问 |

## 🔙 被依赖方（谁依赖我）
| 组件 | 类型 | 调用方法 |
|------|------|----------|
| UserController | Controller | getUserById() |
```

### ❌ 遗漏 Interface
```
未识别 IUserService 接口
```

### ✅ 正确识别 Interface
```
interface/
├── IUserService.md
└── IOrderService.md
```

### ❌ 变量格式不一致
```markdown
# {ClassName}
> **代码行数**: {N} 行
```

### ✅ 统一变量格式
```markdown
# {{CLASS_NAME}}
> **代码行数**: {{LOC}} 行
```

### ❌ 文件读取不完整
只读取前 100 行

### ✅ 完整读取
完整读取，超长文件分段读取

### ❌ 创建空目录
项目无 Feign 但创建了 `feign/` 目录

### ✅ 按需创建
只为有内容的类型创建目录

### ❌ 方法签名不完整（严重错误）
```markdown
### getUserById
- **参数**: Long id
- **返回**: UserVO
- **说明**: 根据ID查询用户
```

### ✅ 完整方法签名
```markdown
### getUserById
- **完整签名**:
  ```java
  @GetMapping("/users/{id}")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<Result<UserVO>> getUserById(
      @PathVariable("id") Long id,
      @RequestParam(value = "includeOrders", required = false) Boolean includeOrders
  )
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 必填 | 说明 |
  |------|------|------|------|------|
  | id | Long | @PathVariable("id") | ✅ | 用户ID |
  | includeOrders | Boolean | @RequestParam | ❌ | 是否包含订单 |
- **返回**: `ResponseEntity<Result<UserVO>>` - 用户详情
- **说明**: 根据ID查询用户详细信息
```

### ❌ 缺少参数注解
```markdown
- **参数**: `Long id, String name, CreateUserDTO dto`
```

### ✅ 包含参数注解
```markdown
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | id | Long | @PathVariable("id") | 用户ID |
  | name | String | @RequestParam(required = false) | 用户名 |
  | dto | CreateUserDTO | @RequestBody @Valid | 创建请求 |
```

### ❌ 缺少异常声明
```markdown
### createUser
- **返回**: UserVO
- **说明**: 创建用户
```

### ✅ 包含异常声明
```markdown
### createUser
- **完整签名**:
  ```java
  @Transactional(rollbackFor = Exception.class)
  public UserVO createUser(@Valid CreateUserDTO dto) 
      throws BusinessException, DuplicateKeyException
  ```
- **异常**:
  | 异常类型 | 触发条件 |
  |----------|----------|
  | BusinessException | 业务规则校验失败 |
  | DuplicateKeyException | 用户名已存在 |
```

### ❌ 缺少方法注解
```markdown
### updateUser
- **签名**: `public void updateUser(Long id, UpdateUserDTO dto)`
```

### ✅ 包含方法注解
```markdown
### updateUser
- **完整签名**:
  ```java
  @PutMapping("/users/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional(rollbackFor = Exception.class)
  @CacheEvict(value = "users", key = "#id")
  public ResponseEntity<Result<Void>> updateUser(
      @PathVariable("id") Long id,
      @RequestBody @Valid UpdateUserDTO dto
  )
  ```
```
