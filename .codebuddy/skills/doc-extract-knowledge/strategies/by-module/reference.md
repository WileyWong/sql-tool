# 技术参考

> ⚠️ **重要**：执行时必须遵守 SKILL.md 中的"强制执行规则"：
> 1. **必须按模板生成文档**：生成前必须读取对应类型的模板文件（templates/{type}.md），禁止凭记忆生成
> 2. **每批3个文件完成后立即更新索引**：生成文档后立即更新索引文件，必须在处理下一批文件之前完成
> 3. **索引条目绝对不可变**：禁止增删改条目，仅允许更新状态、生成文档路径、方法数
> 4. **必须基于实际生成结果更新**：文档实际生成成功才能标记为✅，禁止预先批量更新状态

## 目录

- [模板分类](#模板分类)
- [20个核心类型](#20个核心类型)
- [类型识别规则](#类型识别规则)
- [模板选择逻辑](#模板选择逻辑)
- [依赖关系分析](#依赖关系分析)
- [代码行数统计](#代码行数统计)
- [类文档格式](#类文档格式)
- [索引文件格式](#索引文件格式)
- [技术栈版本识别](#技术栈版本识别)
- [边界情况处理](#边界情况处理)
- [方法详情展开规则](#方法详情展开规则)
- [质量验证规则](#质量验证规则)
- [常见错误](#常见错误)

---

## 模板分类

本技能共包含 **23 个模板**，分为以下 4 类：

| 分类 | 模板 | 数量 | 生成时机 | 映射粒度 |
|------|------|:----:|----------|----------|
| **类级模板** | controller, service, mapper, entity, dto, vo-response, request, enum, exception, feign, handler, job-task, mq-listener, constants, utils, config, interface, abstract, annotation, default | 20 | 阶段2：按文件类型选择 | 1个类 → 1个文档 |
| **进度追踪** | file-list.md | 1 | 阶段1：自动创建 | 内部工作文件 |
| **目录索引** | directory-index.md | 1 | 阶段3：可选生成 | 模块 → 1个文档 |
| **架构概览** | architecture.md | 1 | 阶段3：可选生成 | 模块 → 1个文档 |

### 汇总文档生成规则

`architecture.md` 和 `directory-index.md` 是**汇总型文档**，生成时需要：

1. **数据来源**：从已生成的类级文档中提取信息
2. **生成时机**：所有类级文档生成完成后（阶段3）
3. **信息汇总**：
   - 统计各类型数量
   - 提取依赖关系
   - 识别核心调用链
   - 汇总技术栈信息

---

## 20个核心类型

| 序号 | 类型 | 模板文件 | 识别依据 | 优先级 |
|------|------|----------|----------|--------|
| 1 | Interface | `interface.md` | `interface` 关键字（非 `@interface`） | P0 |
| 2 | Abstract | `abstract.md` | `abstract class` 关键字 | P0 |
| 3 | Annotation | `annotation.md` | `@interface` 定义 | P0 |
| 4 | Controller | `controller.md` | `@RestController`, `@Controller` | P0 |
| 5 | Service | `service.md` | `@Service`, `*ServiceImpl.java` | P0 |
| 6 | Mapper | `mapper.md` | `@Mapper`, `extends BaseMapper` | P0 |
| 7 | Entity | `entity.md` | `@Entity`, `@TableName` | P1 |
| 8 | DTO | `dto.md` | `*DTO.java`, `*Dto.java` | P1 |
| 9 | VO/Response | `vo-response.md` | `*VO.java`, `*Response.java` | P1 |
| 10 | Request | `request.md` | `*Request.java`, `*RequestDTO.java` | P1 |
| 11 | Enum | `enum.md` | `enum` 定义 | P1 |
| 12 | Exception | `exception.md` | `extends *Exception` | P1 |
| 13 | Feign | `feign.md` | `@FeignClient` | P2 |
| 14 | Handler | `handler.md` | `*Handler.java` | P2 |
| 15 | Job/Task | `job-task.md` | `@Scheduled`, `@Async`, `@XxlJob` | P2 |
| 16 | MQ Listener | `mq-listener.md` | `@RabbitListener`, `@KafkaListener` | P2 |
| 17 | Constants | `constants.md` | `*Constants.java`, `*Constant.java` | P2 |
| 18 | Utils | `utils.md` | `*Util.java`, `*Utils.java` | P2 |
| 19 | Config | `config.md` | `@Configuration` | P2 |
| 20 | 其他 | `default.md` | 无法识别的类型 | P3 |

---

## 类型识别规则

### ⚠️ 核心原则：完全忽略目录名

目录名不可信，必须根据类定义识别类型：
- `controller` 目录可能含 Service
- `service` 目录可能含 Mapper
- `dao` 目录可能含 Controller

### 识别优先级（按优先级排序）

```
1. 类类型（interface、abstract、enum）
2. 类注解（@RestController、@Service、@Mapper 等）
3. 继承关系（extends Exception）
4. 类名后缀（*Service、*DTO、*VO 等）
5. 方法注解（@Scheduled、@RabbitListener 等）
6. 文件路径（最低优先级）
7. 默认使用 default.md
```

### 详细识别规则

| 类型 | 识别依据（按优先级） |
|------|---------------------|
| Interface | `public interface Xxx`（非 `@interface`） |
| Abstract | `public abstract class Xxx` |
| Enum | `public enum Xxx` |
| Annotation | `public @interface Xxx` |
| Controller | `@RestController` > `@Controller` |
| Service | `@Service` > 类名含 `ServiceImpl` |
| Mapper | `@Mapper` > `extends BaseMapper` > 类名含 `Mapper` |
| Feign | `@FeignClient` |
| Entity | `@Entity` > `@TableName` > `@Table` > 纯POJO |
| Config | `@Configuration` > `@ConfigurationProperties` |
| Exception | `extends Exception` > `extends RuntimeException` > `*Exception.java` |
| Constants | `*Constants.java` > `*Constant.java` > 全 `static final` 字段类 |
| DTO | 类名以 `DTO` 或 `Dto` 结尾（排除 `*RequestDTO`） |
| VO/Response | 类名以 `VO` 或 `Response` 结尾 |
| Request | 类名以 `Request` 结尾，或 `*RequestDTO.java` |
| Handler | 类名以 `Handler` 结尾 |
| Utils | 类名以 `Util` 或 `Utils` 结尾 |
| Job/Task | `@Scheduled` > `@Async` > `@XxlJob` > 类名含 `Job` 或 `Task` |
| MQ Listener | `@RabbitListener` > `@KafkaListener` > `@JmsListener` > 类名含 `Listener` |

### 命名冲突优先级

当类名同时满足多个规则时：

| 类名模式 | 归类 | 原因 |
|----------|------|------|
| `*RequestDTO.java` | Request | Request 优先于 DTO |
| `*ResponseVO.java` | VO/Response | VO 后缀优先 |
| `*ServiceImpl.java` + `@Service` | Service | 注解确认 |
| `Abstract*Service.java` | Abstract | abstract 关键字优先 |

---

## 模板选择逻辑

```
1. 识别类型（按识别优先级）
2. 确定模板文件: templates/{type}.md
3. 读取模板文件（⚠️ 必须实际读取，禁止凭记忆）
4. 确认模板中的所有章节
5. 严格按照模板结构生成文档
```

**模板文件映射**：

| 类型 | 模板文件 |
|------|----------|
| Interface | `templates/interface.md` |
| Abstract | `templates/abstract.md` |
| Annotation | `templates/annotation.md` |
| Controller | `templates/controller.md` |
| Service | `templates/service.md` |
| Mapper | `templates/mapper.md` |
| Entity | `templates/entity.md` |
| DTO | `templates/dto.md` |
| VO/Response | `templates/vo-response.md` |
| Request | `templates/request.md` |
| Enum | `templates/enum.md` |
| Exception | `templates/exception.md` |
| Feign | `templates/feign.md` |
| Handler | `templates/handler.md` |
| Job/Task | `templates/job-task.md` |
| MQ Listener | `templates/mq-listener.md` |
| Constants | `templates/constants.md` |
| Utils | `templates/utils.md` |
| Config | `templates/config.md` |
| 其他 | `templates/default.md` |

---

## 依赖关系分析

### 双向依赖记录

每个类文档必须记录：

1. **依赖组件（我依赖谁）**: 本类注入或调用的其他组件
2. **被依赖方（谁依赖我）**: 通过分析代码引用关系确定

### 依赖识别方法

**识别依赖组件**:
- `@Autowired` 注入的字段
- `@Resource` 注入的字段
- 构造函数注入的参数
- `@RequiredArgsConstructor` 的 `final` 字段
- 方法参数中的组件类型

**识别被依赖方**:
- 在模块内搜索对本类的引用
- 分析其他类的注入字段
- 记录调用本类的具体方法

---

## 代码行数统计

### LOC 定义

**LOC (Lines of Code)** = SLOC（Source Lines of Code）

| 包含 | 不包含 |
|------|--------|
| 有效代码行 | 空行 |
| 含代码的注释行 | 纯注释行（`//` 或 `/* */`） |
| | 仅含 `{` 或 `}` 的行 |

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

### Controller 方法示例

```markdown
### getUserById
- **完整签名**:
  ```java
  @GetMapping("/users/{id}")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<Result<UserVO>> getUserById(
      @PathVariable("id") Long id,
      @RequestParam(value = "includeOrders", required = false, defaultValue = "false") Boolean includeOrders
  )
  ```
- **HTTP方法**: GET
- **路径**: `/users/{id}`
- **参数说明**:
  | 参数 | 类型 | 注解 | 必填 | 默认值 | 说明 |
  |------|------|------|------|--------|------|
  | id | Long | @PathVariable | ✅ | - | 用户ID |
  | includeOrders | Boolean | @RequestParam | ❌ | false | 是否包含订单 |
- **返回**: `ResponseEntity<Result<UserVO>>` - 用户详情
- **权限**: `hasRole('USER')`
- **说明**: 根据ID查询用户详细信息
```

### Service 方法示例

```markdown
### createUser
- **完整签名**:
  ```java
  @Transactional(rollbackFor = Exception.class)
  @CacheEvict(value = "users", allEntries = true)
  public UserVO createUser(
      @Valid @NotNull CreateUserDTO dto
  ) throws BusinessException, DuplicateKeyException
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 说明 |
  |------|------|------|------|
  | dto | CreateUserDTO | @Valid @NotNull | 用户创建请求 |
- **返回**: `UserVO` - 创建的用户信息
- **事务**: `@Transactional(rollbackFor = Exception.class)`
- **缓存**: `@CacheEvict(value = "users", allEntries = true)`
- **异常**:
  | 异常类型 | 触发条件 |
  |----------|----------|
  | BusinessException | 业务规则校验失败 |
  | DuplicateKeyException | 用户名已存在 |
- **说明**: 创建新用户
```

---

## 索引文件格式

`DOC_DIR/.file-list.md` 格式：

```markdown
# 文件清单

> **模块路径**: {{SOURCE_DIR}}  
> **文档目录**: {{DOC_DIR}}  
> **扫描时间**: {{SCAN_TIME}}

---

## 📊 统计概览

| 指标 | 数量 |
|------|------|
| Java 文件总数 | {{TOTAL_FILES}} |
| 已生成文档 | {{COMPLETED_FILES}} |
| 待处理 | {{PENDING_FILES}} |
| 失败/跳过 | {{FAILED_FILES}} |

### 按类型分组

| 类型 | 数量 | 已完成 |
|------|------|--------|
| Controller | {{CONTROLLER_COUNT}} | {{CONTROLLER_DONE}} |
| Service | {{SERVICE_COUNT}} | {{SERVICE_DONE}} |
| Mapper | {{MAPPER_COUNT}} | {{MAPPER_DONE}} |
| Entity | {{ENTITY_COUNT}} | {{ENTITY_DONE}} |
| ... | ... | ... |

---

## 📋 文件清单

| 序号 | 文件路径 | 类型 | 状态 | 生成文档 | 方法数 |
|------|----------|------|------|----------|--------|
| 1 | com/xxx/user/controller/UserController.java | Controller | ✅ | controller/UserController.md | 8 |
| 2 | com/xxx/user/service/UserService.java | Service | ✅ | service/UserService.md | 12 |
| 3 | com/xxx/user/mapper/UserMapper.java | Mapper | ⏳ | - | - |
| ... | ... | ... | ... | ... | ... |

**状态说明**: ⏳ 待处理 | ✅ 已完成 | ❌ 失败/跳过
```

---

## 技术栈版本识别

提取文档时，AI 应识别项目技术栈版本，以便正确记录代码特性和注解。

### 版本检测方法

| 检查项 | 检测文件 | 关键配置 |
|--------|----------|----------|
| Java 版本 | `pom.xml` / `build.gradle` | `<java.version>` / `sourceCompatibility` |
| Spring Boot 版本 | `pom.xml` / `build.gradle` | `<parent><version>` / `springBootVersion` |
| MyBatis-Plus 版本 | `pom.xml` | `mybatis-plus-boot-starter` 版本号 |

### 版本差异对文档提取的影响

| 技术栈 | 版本 | 文档记录要点 |
|--------|------|--------------|
| **Java** | 8 | 无 `var`、无 `record`，需完整记录类型声明 |
| **Java** | 11+ | 可能出现 `var`，需在文档中标注实际类型 |
| **Java** | 17+ | 可能出现 `record`、`sealed class`，需在文档中说明 |
| **Spring Boot** | 2.x | 注解包名为 `javax.*`（如 `javax.validation.constraints.NotNull`） |
| **Spring Boot** | 3.x | 注解包名为 `jakarta.*`（如 `jakarta.validation.constraints.NotNull`） |
| **MyBatis-Plus** | 3.4.x | 注意 `@TableName` 属性差异 |
| **MyBatis-Plus** | 3.5.x | 可能使用 `LambdaQueryWrapper`，需记录查询方式 |

### 代码特性识别

提取文档时，需识别并记录以下代码特性：

| 特性 | 识别方法 | 文档记录方式 |
|------|----------|--------------|
| Lombok 使用 | 类上有 `@Data`/`@Builder` 等 | 在类注解中记录，方法清单标注"Lombok 生成" |
| 日志框架 | `@Slf4j` 或 `Logger` 字段 | 在类描述中说明日志框架 |
| 依赖注入方式 | `@Autowired` / 构造器注入 | 在依赖组件章节说明注入方式 |
| 验证框架 | `@Valid`/`@NotNull` 等 | 在字段/参数表格中记录验证注解 |

---

## 边界情况处理

### 空类/简单类处理

| 情况 | 处理方式 |
|------|----------|
| 只有字段无方法 | 方法清单表格显示"无业务方法，仅包含字段定义" |
| 只有常量 | 使用 `constants.md` 模板，列出所有常量 |
| 空接口（标记接口） | 说明"标记接口，无方法定义"，记录其用途 |
| 只有构造函数 | 记录构造函数，说明"无业务方法" |
| 纯静态工具类 | 使用 `utils.md` 模板，标注"无实例方法" |

### 复杂类处理

| 情况 | 处理方式 |
|------|----------|
| 方法数 > 30 | 按功能分组展示，添加分组标题 |
| 方法数 > 50 | 强制按功能分组，每组不超过15个方法 |
| 嵌套类/内部类 | 单独章节"内部类定义"记录，复杂内部类可生成独立文档 |
| 匿名类 | 在使用处简要说明，不单独记录 |
| 超长方法（>100行） | 在方法描述中标注"复杂方法"，建议重构 |

### 泛型复杂度处理

| 泛型层级 | 处理方式 | 示例 |
|----------|----------|------|
| 1-2层 | 完整展示 | `List<UserDTO>` |
| 3层 | 完整展示 | `Map<String, List<UserDTO>>` |
| 4层+ | 简化表示 + 完整定义注释 | `Result<Page<...>>` <!-- 完整: Result<Page<List<UserDetailVO>>> --> |

**示例**：
```markdown
| 返回类型 | 说明 |
|----------|------|
| `Result<Page<...>>` | 分页结果包装 <!-- 完整类型: Result<Page<List<UserDetailVO>>> --> |
```

### 继承层级处理

| 情况 | 处理方式 |
|------|----------|
| 单层继承 | 记录父类和重写方法 |
| 多层继承（2-3层） | 记录完整继承链，标注每层新增/重写的方法 |
| 深层继承（4层+） | 记录直接父类和顶层基类，中间层简要说明 |
| 多接口实现 | 分别记录每个接口的实现方法，按接口分组 |

### 特殊场景处理

| 场景 | 处理方式 |
|------|----------|
| Lombok 生成的方法 | 在类注解中记录 @Data/@Builder 等，方法清单标注"Lombok 生成" |
| 编译时生成的代码 | 记录生成器注解（如 @MapStruct），说明生成规则 |
| 动态代理类 | 记录代理接口和增强逻辑 |
| 反射调用 | 在依赖分析中标注"反射调用"，说明调用场景 |

---

## 方法详情展开规则

### 必须展开详情的方法

| 方法类型 | 展开条件 | 说明 |
|----------|----------|------|
| public 方法 | 全部展开 | 所有公开方法都需要详细记录 |
| @Transactional 方法 | 全部展开 | 事务方法需要详细记录事务配置 |
| 核心业务方法 | 全部展开 | 复杂业务逻辑需要详细说明 |
| 带异常声明的方法 | 全部展开 | 需要记录异常触发条件 |
| 接口定义的方法 | 全部展开 | 接口契约必须完整记录 |
| 重写的方法 | 全部展开 | 需要说明重写原因和差异 |

### 可以简化的方法

| 方法类型 | 简化方式 | 说明 |
|----------|----------|------|
| getter/setter | 表格列出 | 使用 Lombok 时可完全省略 |
| toString/hashCode/equals | 表格列出 | 标准方法简要说明即可 |
| 简单委托方法 | 表格列出 | 仅调用其他服务的简单方法 |
| private 辅助方法 | 表格列出 | 内部实现细节，非公开 API |
| Lombok 生成的方法 | 省略 | 在类注解中说明即可 |

### 方法分组规则

当方法数量 > 10 时，按以下规则分组展示：

**Controller 分组**：
```markdown
#### 查询接口
| # | 方法名 | HTTP | 路径 | 说明 |
|:-:|--------|------|------|------|
| 1 | `findById` | GET | `/users/{id}` | 根据ID查询 |

#### 写入接口
| # | 方法名 | HTTP | 路径 | 说明 |
|:-:|--------|------|------|------|
| 2 | `create` | POST | `/users` | 创建用户 |
```

**Service 分组**：
```markdown
#### 查询方法
| # | 方法名 | 返回类型 | 事务 | 说明 |
|:-:|--------|----------|:----:|------|
| 1 | `findById` | `UserVO` | - | 根据ID查询 |

#### 写入方法
| # | 方法名 | 返回类型 | 事务 | 说明 |
|:-:|--------|----------|:----:|------|
| 2 | `create` | `Long` | ✅ | 创建用户 |
```

**Mapper 分组**：
```markdown
#### 继承自 BaseMapper 的方法
*标准 CRUD 方法，参见 MyBatis-Plus 文档*

#### 自定义查询方法
| # | 方法名 | 返回类型 | SQL方式 | 说明 |
|:-:|--------|----------|---------|------|
| 1 | `selectByCondition` | `List<User>` | XML | 条件查询 |
```

### 方法详情模板

**标准方法详情**：
```markdown
### {{METHOD_NAME}}
- **完整签名**:
  ```java
  {{FULL_SIGNATURE}}
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 必填 | 说明 |
  |------|------|------|:----:|------|
  | {{PARAM}} | {{TYPE}} | {{ANNOTATION}} | {{REQUIRED}} | {{DESC}} |
- **返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}
- **说明**: {{METHOD_DESC}}
```

**事务方法详情**（额外字段）：
```markdown
- **事务**: `@Transactional(rollbackFor = Exception.class, propagation = REQUIRED)`
- **隔离级别**: READ_COMMITTED
```

**缓存方法详情**（额外字段）：
```markdown
- **缓存**: `@Cacheable(value = "users", key = "#id")`
- **过期时间**: 30分钟
```

**异常方法详情**（额外字段）：
```markdown
- **异常**:
  | 异常类型 | 触发条件 |
  |----------|----------|
  | BusinessException | 业务规则校验失败 |
  | NotFoundException | 资源不存在 |
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
- [ ] **方法注解**: 所有方法级注解
- [ ] **访问修饰符**: public/protected/private
- [ ] **返回类型**: 完整类型（含泛型）
- [ ] **方法名**: 准确的方法名
- [ ] **参数列表**: 每个参数的注解、类型、名称
- [ ] **异常声明**: throws 声明的所有异常

### 5. 模板使用检查

- [ ] 生成前实际读取了模板文件
- [ ] 生成的文档包含模板中的所有章节
- [ ] 章节顺序与模板一致
- [ ] 无省略或简化模板内容

### 6. 索引文件检查

- [ ] 索引文件路径正确
- [ ] 包含完整文件清单
- [ ] 统计信息准确
- [ ] 每批文件状态正确更新

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

### ❌ 方法签名不完整（严重错误）
```markdown
### getUserById
- **参数**: Long id
- **返回**: UserVO
```

### ✅ 完整方法签名
```markdown
### getUserById
- **完整签名**:
  ```java
  @GetMapping("/users/{id}")
  public ResponseEntity<Result<UserVO>> getUserById(
      @PathVariable("id") Long id,
      @RequestParam(value = "detail", required = false) Boolean detail
  )
  ```
- **参数说明**:
  | 参数 | 类型 | 注解 | 必填 | 说明 |
  |------|------|------|------|------|
  | id | Long | @PathVariable("id") | ✅ | 用户ID |
  | detail | Boolean | @RequestParam | ❌ | 是否详情 |
```

### ❌ 凭记忆生成
```
（未读取模板文件，直接生成文档）
```

### ✅ 读取模板后生成
```
1. 读取 templates/controller.md
2. 确认所有章节
3. 按模板结构生成文档
```

### ❌ 批量更新超过3个
```
（生成5个以上文档后，一次性更新所有状态）
```

### ✅ 每批3个更新
```
1. 生成文档1-3 → 立即更新文件1-3的状态
2. 生成文档4-6 → 立即更新文件4-6的状态
3. ...（每批3个，处理后立即更新）
```
