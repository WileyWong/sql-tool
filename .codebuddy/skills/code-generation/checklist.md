# 代码生成质量检查清单

## 1. 理解设计文档检查

### API 设计文档
- [ ] 所有接口的路径已明确
- [ ] 所有接口的 HTTP 方法已确定（GET/POST/PUT/DELETE）
- [ ] 所有接口的请求参数已定义（类型、必需性、默认值）
- [ ] 所有接口的返回值已定义（类型、结构）
- [ ] 所有接口的错误码已定义
- [ ] 认证和权限要求已明确

### 数据库设计文档
- [ ] 所有表的表名已确定
- [ ] 所有表的字段已定义（字段名、类型、长度、约束）
- [ ] 所有表的主键和索引已定义
- [ ] 表之间的关系已明确（一对一、一对多、多对多）
- [ ] 外键约束已定义

### 业务流程设计
- [ ] 业务规则已明确
- [ ] 状态机已定义（如适用）
- [ ] 条件分支已明确
- [ ] 异常场景已列出

### 技术栈确认
- [ ] 后端框架和版本已确定（如 Spring Boot 3.0.0）
- [ ] 前端框架和版本已确定（如 Vue 3.4.0）
- [ ] 数据库类型和版本已确定（如 MySQL 8.0）
- [ ] 依赖库已列出（如 MyBatis-Plus 3.5.0）

## 2. 后端代码生成检查

### Entity 实体类
- [ ] 包名正确（如 `com.example.demo.entity`）
- [ ] 类名符合命名规范（PascalCase）
- [ ] 使用 `@Data` 注解（Lombok）
- [ ] 使用 `@TableName` 指定表名
- [ ] 使用 `@TableId` 指定主键和生成策略
- [ ] 使用 `@TableField` 映射字段（如需要）
- [ ] 所有字段有 JavaDoc 注释
- [ ] 字段类型正确（Long、String、LocalDateTime）

### Mapper 接口
- [ ] 包名正确（如 `com.example.demo.mapper`）
- [ ] 接口名符合命名规范（如 `UserMapper`）
- [ ] 使用 `@Mapper` 注解
- [ ] 继承 `BaseMapper<T>`
- [ ] 自定义查询方法有清晰的方法签名

### Service 接口
- [ ] 包名正确（如 `com.example.demo.service`）
- [ ] 接口名符合命名规范（如 `UserService`）
- [ ] 所有方法有清晰的方法签名
- [ ] 所有方法有 JavaDoc 注释
- [ ] 参数使用 DTO 对象

### Service 实现类
- [ ] 包名正确（如 `com.example.demo.service.impl`）
- [ ] 类名符合命名规范（如 `UserServiceImpl`）
- [ ] 使用 `@Service` 注解
- [ ] 使用 `@Slf4j` 注解（日志）
- [ ] 使用 `@RequiredArgsConstructor` 注解（依赖注入）
- [ ] 使用 `@Transactional` 注解（事务方法）
- [ ] 所有方法实现逻辑完整
- [ ] 参数验证完整（非空、格式、业务规则）
- [ ] 异常处理完善（抛出清晰的异常信息）
- [ ] 日志记录完整（关键操作、错误信息）
- [ ] Entity 与 DTO 转换正确

### Controller 控制器
- [ ] 包名正确（如 `com.example.demo.controller`）
- [ ] 类名符合命名规范（如 `UserController`）
- [ ] 使用 `@RestController` 注解
- [ ] 使用 `@RequestMapping` 指定基础路径
- [ ] 使用 `@Slf4j` 注解（日志）
- [ ] 使用 `@RequiredArgsConstructor` 注解（依赖注入）
- [ ] 使用 `@Validated` 注解（参数验证）
- [ ] 所有方法使用正确的 HTTP 方法注解（@GetMapping、@PostMapping 等）
- [ ] 使用 `@Valid` 验证请求体
- [ ] 使用 `@PathVariable` 获取路径参数
- [ ] 使用 `@RequestParam` 获取查询参数
- [ ] 使用 `ResponseEntity` 控制 HTTP 状态码
- [ ] 实现全局异常处理（@ExceptionHandler）
- [ ] 所有方法有 JavaDoc 注释
- [ ] 日志记录完整

### DTO 类
- [ ] 包名正确（如 `com.example.demo.dto`）
- [ ] 类名符合命名规范（如 `UserCreateDTO`、`UserResponseDTO`）
- [ ] 使用 `@Data` 注解（Lombok）
- [ ] 请求 DTO 使用验证注解（@NotBlank、@Email、@Size 等）
- [ ] 响应 DTO 只包含需要暴露的字段
- [ ] 所有字段有 JavaDoc 注释

## 3. 前端代码生成检查

### TypeScript 类型定义
- [ ] 文件路径正确（如 `src/types/user.ts`）
- [ ] 所有接口有清晰的类型定义
- [ ] 接口名符合命名规范（PascalCase）
- [ ] 字段类型正确（number、string、boolean、Date）
- [ ] 复杂类型使用嵌套接口
- [ ] 所有接口有注释说明

### API 服务
- [ ] 文件路径正确（如 `src/services/userService.ts`）
- [ ] 类名符合命名规范（如 `UserService`）
- [ ] 使用 `axios` 或 `fetch` 进行 HTTP 请求
- [ ] 所有方法有类型注解
- [ ] 请求和响应类型正确
- [ ] 错误处理完善（try-catch）
- [ ] API 基础 URL 使用环境变量

### Vue 组件
- [ ] 文件路径正确（如 `src/components/UserList.vue`）
- [ ] 组件名符合命名规范（PascalCase）
- [ ] 使用 `<script setup lang="ts">` 语法（Vue 3 + TypeScript）
- [ ] 使用 `ref` 或 `reactive` 管理状态（类型注解）
- [ ] 使用 `onMounted`/`watch` 处理生命周期和副作用
- [ ] 使用 `defineProps` 和 `defineEmits` 定义组件接口
- [ ] 错误处理完善（error state、错误提示）
- [ ] 加载状态完善（loading state）
- [ ] 用户交互友好（确认对话框、提示信息）
- [ ] 组件可复用
- [ ] 所有函数有注释

## 4. 单元测试检查

### 后端单元测试（JUnit 5）
- [ ] 测试类名符合命名规范（如 `UserServiceTest`）
- [ ] 使用 `@DisplayName` 提供清晰的测试说明
- [ ] 使用 `@Mock` 和 `@InjectMocks` 注入依赖
- [ ] 使用 `@BeforeEach` 初始化测试数据
- [ ] 使用 Given-When-Then 模式组织测试
- [ ] 测试正常流程
- [ ] 测试异常流程
- [ ] 测试边界条件
- [ ] 验证方法调用次数（`verify`）
- [ ] 测试覆盖率 ≥ 80%

### 前端单元测试（Vitest）
- [ ] 测试文件名符合命名规范（如 `UserList.test.ts`）
- [ ] 使用 `vi.mock` 模拟依赖服务
- [ ] 使用 `@vue/test-utils` 进行组件测试
- [ ] 使用 `mount` 或 `shallowMount` 挂载组件
- [ ] 使用 `await wrapper.vm.$nextTick()` 等待异步操作完成
- [ ] 测试组件渲染
- [ ] 测试用户交互（点击、输入）
- [ ] 测试 API 调用
- [ ] 测试错误处理
- [ ] 测试加载状态
- [ ] 测试覆盖率 ≥ 80%

## 5. 代码质量检查

### 导入语句
- [ ] 所有导入语句完整
- [ ] 导入顺序规范（标准库 → 第三方库 → 本地模块）
- [ ] 无未使用的导入
- [ ] 使用正确的导入路径（相对路径或绝对路径）

### 命名规范
- [ ] 类名使用 PascalCase（如 `UserService`）
- [ ] 方法名使用 camelCase（如 `createUser`）
- [ ] 常量名使用 UPPER_SNAKE_CASE（如 `MAX_SIZE`）
- [ ] 变量名有意义（避免 `a`、`b`、`temp`）
- [ ] 布尔变量使用 `is`、`has`、`can` 前缀

### 注释
- [ ] 所有公共类有类注释
- [ ] 所有公共方法有 JavaDoc/JSDoc 注释
- [ ] 注释说明清晰（参数、返回值、异常）
- [ ] 复杂逻辑有行内注释
- [ ] 无过时的注释

### 异常处理
- [ ] 所有可能抛出异常的方法有异常处理
- [ ] 使用自定义异常（如 `IllegalArgumentException`）
- [ ] 异常信息清晰（便于调试）
- [ ] 实现全局异常处理（Controller Advice）
- [ ] 异常日志记录完整

### 日志记录
- [ ] 使用 `@Slf4j` 注解（Lombok）
- [ ] 关键操作有日志记录（创建、更新、删除）
- [ ] 错误有日志记录（`log.error`）
- [ ] 日志级别正确（DEBUG、INFO、WARN、ERROR）
- [ ] 日志信息清晰（包含关键参数）

### 性能优化
- [ ] 使用分页查询（避免一次性加载所有数据）
- [ ] 使用索引优化查询（高频查询字段）
- [ ] 使用缓存（Redis）减少数据库压力
- [ ] 避免 N+1 查询（使用关联查询或批量查询）
- [ ] 使用异步处理（如发送邮件、消息推送）

### 安全考虑
- [ ] 密码加密存储（使用 `PasswordEncoder`）
- [ ] SQL 注入防护（使用参数化查询）
- [ ] XSS 防护（输出转义）
- [ ] CSRF 防护（使用 CSRF Token）
- [ ] 输入验证（使用 Bean Validation）
- [ ] 权限控制（使用 Spring Security）

## 6. 编译和运行检查

### 后端编译
- [ ] 代码可编译通过（`mvn clean compile`）
- [ ] 无编译错误
- [ ] 无编译警告

### 前端编译
- [ ] 代码可编译通过（`npm run build`）
- [ ] 无 TypeScript 类型错误
- [ ] 无 ESLint 错误

### 单元测试
- [ ] 所有单元测试通过（`mvn test` 或 `npm test`）
- [ ] 测试覆盖率 ≥ 80%
- [ ] 无失败的测试用例

### 代码检查工具
- [ ] Checkstyle 检查通过（Java）
- [ ] ESLint 检查通过（JavaScript/TypeScript）
- [ ] Prettier 格式化检查通过
- [ ] 无代码异味（SonarQube）

### 集成测试（如适用）
- [ ] API 接口正常响应
- [ ] 数据库操作成功
- [ ] 事务回滚正常
- [ ] 权限控制生效

## 7. 文档检查

### 代码注释
- [ ] 所有公共类有注释
- [ ] 所有公共方法有注释
- [ ] 注释符合 JavaDoc/JSDoc 规范
- [ ] 复杂逻辑有解释

### API 文档
- [ ] OpenAPI 文档生成成功
- [ ] 所有接口有描述
- [ ] 所有参数有说明
- [ ] 所有响应有示例

### README
- [ ] 项目简介清晰
- [ ] 安装步骤完整
- [ ] 使用说明清晰
- [ ] 技术栈列表完整

## 8. 部署准备检查

### 配置文件
- [ ] 数据库连接配置正确
- [ ] 端口配置正确
- [ ] 日志配置完整
- [ ] 环境变量配置正确

### 依赖管理
- [ ] `pom.xml` 或 `package.json` 完整
- [ ] 依赖版本明确
- [ ] 无未使用的依赖
- [ ] 依赖版本兼容

### 打包
- [ ] 后端可打包成 JAR（`mvn clean package`）
- [ ] 前端可打包成静态文件（`npm run build`）
- [ ] 打包后的文件可运行

## 9. 验收标准检查

### 功能完整性
- [ ] 所有设计文档中的功能已实现
- [ ] 所有接口正常响应
- [ ] 数据持久化成功
- [ ] 业务逻辑正确

### 性能指标
- [ ] API 响应时间 < 200ms（P95）
- [ ] 数据库查询时间 < 100ms
- [ ] 页面加载时间 < 2s
- [ ] 内存占用合理

### 安全性
- [ ] 无 SQL 注入漏洞
- [ ] 无 XSS 漏洞
- [ ] 无 CSRF 漏洞
- [ ] 权限控制正确

### 可维护性
- [ ] 代码结构清晰
- [ ] 命名规范
- [ ] 注释完整
- [ ] 测试覆盖率 ≥ 80%

## 10. 提交前最终检查

- [ ] 所有检查项已通过
- [ ] 代码已格式化
- [ ] 无调试代码（`console.log`、`System.out.println`）
- [ ] 无注释的代码（删除或解释原因）
- [ ] Git 提交信息清晰
- [ ] 分支命名规范
