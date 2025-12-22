# 从注释生成代码质量检查清单

完整的从注释生成代码质量检查清单，确保代码准确、规范、健壮。

---

## 前置条件检查

- [ ] 已有详细的注释或设计文档
- [ ] 接口签名已明确（方法名、参数、返回值）
- [ ] 业务逻辑和边界条件已说明
- [ ] 已确定技术栈和编码规范
- [ ] 已配置开发环境（Java >= 17, TypeScript >= 5.0, Python >= 3.10）
- [ ] 已配置 IDE 和 Linter（Checkstyle/ESLint/Pylint）

---

## 步骤 1: 解析注释和设计说明

### 1.1 功能需求识别

- [ ] 已明确功能的核心目标
- [ ] 已识别所有业务规则（BR-001, BR-002, ...）
- [ ] 已理解业务场景和使用流程
- [ ] 已明确功能的边界和限制

### 1.2 输入参数分析

- [ ] 已提取所有输入参数（名称、类型、范围）
- [ ] 已明确参数的验证规则（必填、格式、长度、正则）
- [ ] 已识别参数之间的依赖关系
- [ ] 已明确默认值和可选参数

### 1.3 输出结果分析

- [ ] 已明确返回值类型和数据结构
- [ ] 已识别需要脱敏的敏感字段（如密码）
- [ ] 已明确成功和失败的返回格式
- [ ] 已明确响应的数据格式（JSON/XML/其他）

### 1.4 边界条件识别

- [ ] 已识别 null/undefined 处理
- [ ] 已识别空集合/空字符串处理
- [ ] 已识别边界值（最大值/最小值/零值）
- [ ] 已识别并发冲突情况（如唯一键冲突）
- [ ] 已识别资源耗尽情况（如内存、磁盘、连接池）

### 1.5 异常情况分析

- [ ] 已识别所有可能的异常类型
- [ ] 已明确异常的触发条件
- [ ] 已明确异常的错误码和消息
- [ ] 已明确异常的处理方式（重试/回滚/通知）

### 1.6 依赖和约束分析

- [ ] 已识别数据库依赖（表、索引、存储过程）
- [ ] 已识别缓存依赖（Redis/Caffeine）
- [ ] 已识别第三方服务依赖（API/SDK）
- [ ] 已识别性能要求（响应时间、吞吐量、并发数）
- [ ] 已识别安全要求（认证、授权、加密、审计）

---

## 步骤 2: 设计代码结构

### 2.1 分层架构设计

**后端（Java/Spring Boot）**:
- [ ] 已设计 Controller 层（API 接口、参数验证）
- [ ] 已设计 Service 层（业务逻辑、事务管理）
- [ ] 已设计 Mapper 层（数据访问、SQL 查询）
- [ ] 已设计 Entity 层（数据模型、数据库映射）
- [ ] 已设计 DTO 层（请求/响应对象、数据转换）

**前端（Vue 3）**:
- [ ] 已设计 Page 层（页面组件、路由）
- [ ] 已设计 Component 层（UI 组件、业务组件）
- [ ] 已设计 Composable 层（状态管理、逻辑复用）
- [ ] 已设计 Service 层（HTTP 请求、数据转换）
- [ ] 已设计 Schema 层（验证规则、类型定义）

### 2.2 设计模式选择

- [ ] 已选择合适的设计模式（单例/工厂/策略/观察者）
- [ ] 已遵循单一职责原则（每个类/方法只做一件事）
- [ ] 已遵循开闭原则（对扩展开放，对修改关闭）
- [ ] 已避免过度设计（不使用不必要的设计模式）

### 2.3 技术方案确定

**参数验证**:
- [ ] Java: 使用 `@Valid` + Bean Validation
- [ ] TypeScript: 使用 `zod` 或 `yup`
- [ ] Python: 使用 `pydantic` 或 `marshmallow`

**错误处理**:
- [ ] 后端: 使用 `@RestControllerAdvice` 统一异常处理
- [ ] 前端: 使用 Error Boundary 捕获组件错误
- [ ] 已定义统一的错误响应格式

**性能优化**:
- [ ] 已设计缓存策略（缓存什么、过期时间、失效策略）
- [ ] 已设计分页方案（分页参数、排序、总数计算）
- [ ] 已设计懒加载方案（图片、组件、路由）

**安全措施**:
- [ ] 已设计输入验证（白名单、黑名单、转义）
- [ ] 已设计 SQL 注入防护（参数化查询、ORM）
- [ ] 已设计 XSS 防护（输入转义、CSP）
- [ ] 已设计密码加密（BCrypt/Argon2，强度参数）
- [ ] 已设计敏感数据脱敏（密码、身份证、手机号）

---

## 步骤 3: 编写代码实现

### 3.1 代码准确性

- [ ] 代码精准实现了注释描述的功能
- [ ] 代码执行步骤与注释一致
- [ ] 所有业务规则都已实现
- [ ] 所有边界条件都已处理
- [ ] 所有异常情况都已处理

### 3.2 代码规范性

**Java (Spring Boot)**:
- [ ] 使用 `@RestController` 而非 `@Controller`
- [ ] 使用 `@RequestMapping` 定义路径
- [ ] 使用 `@Valid` 验证参数
- [ ] 使用 `@Transactional` 管理事务
- [ ] 使用 `@Slf4j` 记录日志
- [ ] 使用 `@RequiredArgsConstructor` 依赖注入
- [ ] 使用 MyBatis-Plus `LambdaQueryWrapper`（类型安全）
- [ ] 使用 `BCryptPasswordEncoder` 加密密码

**TypeScript (Vue 3)**:
- [ ] 使用 `<script setup lang="ts">` 定义组件
- [ ] 使用 `computed` 优化计算属性
- [ ] 使用 `watch` 监听数据变化
- [ ] 使用 Composition API 管理状态
- [ ] 使用 `zod` 定义验证规则
- [ ] 使用 `axios` 处理 HTTP 请求
- [ ] 完整的 TypeScript 类型定义（无 `any`）

**Python (Flask/FastAPI)**:
- [ ] 使用 `pydantic` 验证参数
- [ ] 使用类型注解（Type Hints）
- [ ] 使用 `pytest` 编写测试
- [ ] 使用 `logging` 记录日志
- [ ] 使用 `sqlalchemy` ORM

### 3.3 代码完整性

**后端（Java）**:
- [ ] 已编写 DTO 类（请求/响应对象）
- [ ] 已编写 Entity 类（数据库映射）
- [ ] 已编写 Mapper 接口（数据访问）
- [ ] 已编写 Service 接口和实现类（业务逻辑）
- [ ] 已编写 Controller 类（API 接口）
- [ ] 已编写异常处理器（`@RestControllerAdvice`）
- [ ] 已编写配置类（`@Configuration`）

**前端（Vue 3）**:
- [ ] 已编写 Schema（验证规则）
- [ ] 已编写 Service（HTTP 请求）
- [ ] 已编写 Composable（状态管理、逻辑复用）
- [ ] 已编写 Component（UI 组件）
- [ ] 已编写 CSS/SCSS（样式文件）

### 3.4 参数验证

**后端验证**:
- [ ] 所有必填参数都有 `@NotNull` 或 `@NotBlank`
- [ ] 所有字符串参数都有 `@Size` 限制长度
- [ ] 所有格式参数都有 `@Pattern` 正则验证
- [ ] 所有邮箱参数都有 `@Email` 验证
- [ ] 所有数值参数都有 `@Min` / `@Max` 验证
- [ ] 验证错误消息清晰明确

**前端验证**:
- [ ] 所有必填字段都有 `.required()` 验证
- [ ] 所有字符串字段都有 `.min()` / `.max()` 验证
- [ ] 所有格式字段都有 `.regex()` 验证
- [ ] 所有邮箱字段都有 `.email()` 验证
- [ ] 验证错误消息用户友好

### 3.5 错误处理

**后端异常处理**:
- [ ] 已编写 `@ExceptionHandler` 处理参数验证异常（400）
- [ ] 已编写 `@ExceptionHandler` 处理业务异常（409/422）
- [ ] 已编写 `@ExceptionHandler` 处理系统异常（500）
- [ ] 异常消息清晰明确
- [ ] 异常已记录日志

**前端错误处理**:
- [ ] 已处理 API 请求失败（try-catch）
- [ ] 已显示后端返回的错误消息
- [ ] 已高亮错误字段
- [ ] 已禁用提交按钮（加载状态）

### 3.6 安全措施

**输入验证**:
- [ ] 所有用户输入都已验证（前端 + 后端）
- [ ] 已使用白名单验证（仅允许合法字符）
- [ ] 已转义特殊字符（防止 XSS）

**SQL 注入防护**:
- [ ] 使用参数化查询（MyBatis `#{parameter}`）
- [ ] 禁止字符串拼接 SQL（不使用 `${parameter}`）
- [ ] 使用 ORM 框架（MyBatis-Plus）

**密码安全**:
- [ ] 密码使用 BCrypt 加密（强度 >= 10）
- [ ] 密码不能明文存储
- [ ] 密码不能明文传输（HTTPS）
- [ ] 响应不能包含密码字段

**数据脱敏**:
- [ ] 响应不包含密码字段
- [ ] 响应不包含完整手机号（显示 138****1234）
- [ ] 响应不包含完整身份证号（显示 110101******1234）

### 3.7 日志记录

- [ ] 关键操作已记录日志（注册、登录、支付）
- [ ] 日志包含必要信息（用户ID、操作时间、操作结果）
- [ ] 日志不包含敏感信息（密码、身份证）
- [ ] 日志级别正确（INFO/WARN/ERROR）
- [ ] 使用结构化日志（JSON 格式）

### 3.8 性能优化

**缓存**:
- [ ] 已使用缓存（`@Cacheable`、Redis）
- [ ] 已设置合理的过期时间
- [ ] 已设计缓存失效策略

**分页**:
- [ ] 已实现分页查询（MyBatis-Plus `Page`）
- [ ] 已限制分页大小（最大 100 条）
- [ ] 已优化 COUNT 查询

**懒加载**:
- [ ] 已使用 defineAsyncComponent 懒加载组件
- [ ] 已使用图片懒加载
- [ ] 已使用路由懒加载

**数据库优化**:
- [ ] 已添加必要的索引（UNIQUE/INDEX）
- [ ] 已避免 N+1 查询问题
- [ ] 已使用连接池（HikariCP）

---

## 步骤 4: 验证代码质量

### 4.1 编译检查

- [ ] 后端代码可编译通过（`mvn clean compile`）
- [ ] 前端代码可编译通过（`npm run build`）
- [ ] 无编译警告（或已解决所有警告）
- [ ] 无类型错误（TypeScript）

### 4.2 Linter 检查

**Java (Checkstyle)**:
- [ ] 已运行 Checkstyle（`mvn checkstyle:check`）
- [ ] 无 Checkstyle 违规（或已修复）
- [ ] 代码格式正确（缩进、空格、换行）
- [ ] 命名规范正确（类名、方法名、变量名）

**TypeScript (ESLint)**:
- [ ] 已运行 ESLint（`npm run lint`）
- [ ] 无 ESLint 错误
- [ ] 无未使用的变量和导入
- [ ] 代码格式正确（Prettier）

**Python (Pylint)**:
- [ ] 已运行 Pylint（`pylint src/`）
- [ ] Pylint 评分 >= 8.0
- [ ] 无严重错误

### 4.3 单元测试

**测试覆盖率**:
- [ ] 单元测试覆盖率 >= 80%
- [ ] 关键业务逻辑覆盖率 >= 90%
- [ ] 边界条件已测试
- [ ] 异常情况已测试

**测试质量**:
- [ ] 所有测试用例通过
- [ ] 测试用例清晰命名（`testRegisterSuccess`）
- [ ] 测试用例独立运行（不依赖其他测试）
- [ ] 使用 Mock 隔离外部依赖

**Java 单元测试**:
- [ ] 使用 JUnit 5 编写测试
- [ ] 使用 Mockito 模拟依赖
- [ ] 使用 `@ExtendWith(MockitoExtension.class)`
- [ ] 测试方法命名规范（`test + 功能 + 场景`）

**TypeScript 单元测试**:
- [ ] 使用 Vitest 编写测试
- [ ] 使用 Vue Test Utils 测试组件
- [ ] 测试用户交互（点击、输入）
- [ ] 测试异步操作（API 请求）

### 4.4 集成测试

- [ ] API 接口正常响应（200 OK）
- [ ] 数据持久化成功（数据库记录存在）
- [ ] 前端表单验证正常（错误提示显示）
- [ ] 前后端集成正常（请求响应匹配）

### 4.5 安全检查

- [ ] 已运行安全扫描工具（SpotBugs/SonarQube）
- [ ] 无高危漏洞
- [ ] 无 SQL 注入漏洞
- [ ] 无 XSS 漏洞
- [ ] 密码已加密存储

### 4.6 性能检查

- [ ] API 响应时间 < 200ms (P95)
- [ ] 数据库查询时间 < 100ms
- [ ] 前端首屏加载时间 < 2s
- [ ] 无内存泄漏
- [ ] 无 N+1 查询问题

---

## 技术栈验证

### Java (Spring Boot 3 + MyBatis-Plus)

**Spring Boot 3 最佳实践**:
- [ ] 使用 Java 17+ 特性（`record`、`sealed`、`var`）
- [ ] 使用 Jakarta EE 注解（`jakarta.validation.*`）
- [ ] 使用 `@RestController` 而非 `@Controller`
- [ ] 使用 `@RequiredArgsConstructor` 依赖注入

**MyBatis-Plus 最佳实践**:
- [ ] 使用 `LambdaQueryWrapper`（类型安全）
- [ ] 使用 `BaseMapper`（自动 CRUD）
- [ ] 使用 `@TableName` 映射表名
- [ ] 使用 `@TableId(type = IdType.AUTO)` 主键自增

**参数验证**:
- [ ] 使用 `@Valid` 验证请求参数
- [ ] 使用 Bean Validation 注解（`@NotBlank`, `@Size`, `@Pattern`）
- [ ] 使用 `@RestControllerAdvice` 统一异常处理

**事务管理**:
- [ ] 使用 `@Transactional(rollbackFor = Exception.class)`
- [ ] 事务范围正确（Service 层，非 Controller 层）
- [ ] 避免大事务（事务时间 < 3s）

**日志记录**:
- [ ] 使用 `@Slf4j` 记录日志
- [ ] 日志级别正确（INFO/WARN/ERROR）
- [ ] 关键操作已记录

### TypeScript (Vue 3 + Composition API + zod)

**Vue 3 最佳实践**:
- [ ] 使用 `<script setup lang="ts">` 定义组件
- [ ] 使用 `computed` 优化计算属性
- [ ] 使用 `watch` 监听数据变化
- [ ] 使用 `ref` / `reactive` 管理状态
- [ ] 使用 `defineProps` / `defineEmits` 定义接口

**Composition API 最佳实践**:
- [ ] 使用 `ref` 管理基本类型响应式数据
- [ ] 使用 `reactive` 管理对象类型响应式数据
- [ ] 使用 `computed` 计算派生状态
- [ ] 使用 `watch` / `watchEffect` 处理副作用
- [ ] 使用 `onMounted` / `onUnmounted` 处理生命周期

**zod 最佳实践**:
- [ ] 使用 `z.object()` 定义 Schema
- [ ] 使用 `z.string()` / `z.number()` 定义类型
- [ ] 使用 `.min()` / `.max()` 限制长度
- [ ] 使用 `.regex()` 验证格式
- [ ] 使用 `z.infer<typeof schema>` 推导类型

**TypeScript 类型安全**:
- [ ] 无 `any` 类型（除非必要）
- [ ] 完整的接口定义（Props、State、API）
- [ ] 使用类型守卫（Type Guards）
- [ ] 使用泛型（Generics）

---

## 常见错误检查

### 错误 1: 缺少参数验证

❌ **错误**: 未验证参数
```java
@PostMapping
public User createUser(@RequestBody User user) {
    return userService.save(user);  // 没有验证
}
```

✅ **正确**: 使用 @Valid 验证
```java
@PostMapping
public User createUser(@Valid @RequestBody UserCreateDTO userDTO) {
    return userService.createUser(userDTO);
}
```

- [ ] 所有 API 接口都有参数验证
- [ ] 使用 `@Valid` + Bean Validation
- [ ] 验证规则覆盖所有必要字段

### 错误 2: 密码明文存储

❌ **错误**: 明文存储密码
```java
user.setPassword(userDTO.getPassword());  // 明文存储
```

✅ **正确**: 使用 BCrypt 加密
```java
String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
user.setPassword(encodedPassword);
```

- [ ] 密码已使用 BCrypt 加密
- [ ] 密码强度 >= 10
- [ ] 响应不包含密码字段

### 错误 3: 未处理唯一键冲突

❌ **错误**: 未检查唯一性
```java
userMapper.insert(user);  // 如果重复会抛出异常
```

✅ **正确**: 预先检查或全局异常处理
```java
// 方式 1: 预先检查
LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
query.eq(User::getUsername, username);
if (userMapper.selectCount(query) > 0) {
    throw new DuplicateKeyException("用户名已存在");
}

// 方式 2: 全局异常处理
@ExceptionHandler(DuplicateKeyException.class)
public ResponseEntity<ErrorResponse> handleDuplicateKeyException(
        DuplicateKeyException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ErrorResponse(409, ex.getMessage()));
}
```

- [ ] 已检查唯一性或已处理唯一键冲突异常
- [ ] 错误消息清晰（"用户名已存在"）
- [ ] 返回正确的 HTTP 状态码（409 Conflict）

### 错误 4: 未使用事务管理

❌ **错误**: 未使用事务
```java
public void register(RegisterRequest request) {
    userMapper.insert(user);
    roleMapper.insert(userRole);  // 如果失败，user 已插入
}
```

✅ **正确**: 使用 @Transactional
```java
@Transactional(rollbackFor = Exception.class)
public void register(RegisterRequest request) {
    userMapper.insert(user);
    roleMapper.insert(userRole);  // 失败时自动回滚
}
```

- [ ] 多个数据库操作已使用事务
- [ ] 事务范围在 Service 层
- [ ] `rollbackFor = Exception.class`

### 错误 5: 响应包含敏感信息

❌ **错误**: 响应包含密码
```java
return user;  // 包含 password 字段
```

✅ **正确**: 使用 DTO 脱敏
```java
return convertToResponse(user);  // 不包含 password
```

- [ ] 响应不包含密码字段
- [ ] 响应不包含完整手机号
- [ ] 响应不包含完整身份证号

### 错误 6: 使用字符串查询（不安全）

❌ **错误**: 使用字符串查询
```java
userMapper.selectList(new QueryWrapper<User>()
    .eq("username", username));  // 字符串易出错
```

✅ **正确**: 使用 Lambda 查询
```java
LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
query.eq(User::getUsername, username);  // 类型安全
userMapper.selectList(query);
```

- [ ] 使用 `LambdaQueryWrapper` 而非 `QueryWrapper`
- [ ] 避免字符串字段名

### 错误 7: 未记录日志

❌ **错误**: 未记录日志
```java
public User register(RegisterRequest request) {
    // 无日志
    return userService.save(user);
}
```

✅ **正确**: 记录关键操作
```java
@Slf4j
public User register(RegisterRequest request) {
    log.info("用户注册开始，用户名: {}", request.getUsername());
    User user = userService.save(user);
    log.info("用户注册成功，用户ID: {}", user.getId());
    return user;
}
```

- [ ] 关键操作已记录日志
- [ ] 日志包含必要信息（用户ID、操作时间）
- [ ] 日志不包含敏感信息（密码）

### 错误 8: 使用 any 类型（TypeScript）

❌ **错误**: 使用 any 类型
```typescript
const UserForm = ({ onSubmit }: any) => {  // 失去类型安全
  // ...
};
```

✅ **正确**: 完整的类型定义
```typescript
interface UserFormProps {
  onSubmit: (data: User) => Promise<void>;
}

<script setup lang="ts">
const props = defineProps<UserFormProps>();
// TypeScript 类型检查
</script>
```

- [ ] 无 `any` 类型（除非必要）
- [ ] 完整的接口定义
- [ ] 使用类型推导

---

## 最终验证

### 功能验证

- [ ] 代码可编译通过
- [ ] 所有单元测试通过
- [ ] 所有集成测试通过
- [ ] API 接口正常响应
- [ ] 数据持久化成功
- [ ] 前端表单验证正常

### 质量验证

- [ ] 代码符合规范（Checkstyle/ESLint）
- [ ] 无安全漏洞（SpotBugs/SonarQube）
- [ ] 性能指标达标（响应时间 < 200ms）
- [ ] 日志记录完整
- [ ] 测试覆盖率 >= 80%

### 技术栈验证

- [ ] 遵循 Spring Boot 3 最佳实践
- [ ] 遵循 MyBatis-Plus CRUD 增强模式
- [ ] 遵循 Vue 3 Composition API 最佳实践
- [ ] 遵循 Vue 3 + zod 验证模式
- [ ] 使用推荐的 API 和模式

### 规范遵守

- [ ] 遵循 [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md)
- [ ] 遵循 [后端代码规范](mdc:.codebuddy/spec/global/standards/backend/codestyle.md)
- [ ] 遵循 [前端代码规范](mdc:.codebuddy/spec/global/standards/frontend/codestyle.md)

---

## 使用建议

### 审查流程

1. **准备阶段**: 检查前置条件，明确注释和设计说明
2. **解析阶段**: 提取关键信息（输入、输出、边界、异常、依赖）
3. **设计阶段**: 确定分层架构和技术方案
4. **编码阶段**: 编写完整的代码实现（DTO、Entity、Service、Controller、组件）
5. **测试阶段**: 编写单元测试和集成测试
6. **验证阶段**: 运行 Linter、测试、安全扫描

### 审查重点

- **准确性优先**: 代码精准实现注释描述的功能
- **规范性优先**: 遵循技术栈最佳实践和编码规范
- **安全性优先**: 输入验证、密码加密、SQL 注入防护
- **健壮性优先**: 边界条件、异常处理、事务管理

### 团队协作

- **统一标准**: 使用统一的检查清单
- **定期审查**: 定期验证代码质量
- **持续改进**: 根据反馈优化代码实现
- **知识分享**: 分享最佳实践和常见错误
