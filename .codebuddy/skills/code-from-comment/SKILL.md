---
name: code-from-comment
description: 基于详细注释和设计说明生成符合规范的代码实现 - 支持 Java、TypeScript、Python 等主流语言
category: implementation
keywords: [注释生成代码, 代码生成, AI辅助开发, 模板引擎, 自动编程]
---

# Skill: 从注释生成代码（Comment to Code）

基于详细的注释和设计说明,生成符合编码规范、完整可运行的代码实现。

## 核心原则（15 秒速查）

1. **准确实现** - 代码精准匹配注释描述的功能和业务规则
2. **严格规范** - 遵循编码规范和技术栈最佳实践
3. **完整健壮** - 充分考虑边缘情况、异常处理、性能优化
4. **分层清晰** - 后端 Controller-Service-Mapper，前端 Component-Composable-Service
5. **安全优先** - 输入验证、密码加密、SQL 注入防护、XSS 防护

## 🎯 目标

解决软件研发中 **如何将详细注释转换为高质量代码实现** 的问题。

**适用场景**:
- 设计文档已完成,需要将注释转为实现代码
- TDD 开发: 先写测试和接口注释,再实现功能
- 接口已定义(带详细注释),需要补充逻辑
- 重构代码: 保留接口签名和注释,重新实现逻辑

**输出成果**:
- 完整可运行的代码(包含导入、注解、异常处理)
- 符合编码规范的代码结构(分层架构、职责单一)
- 完善的单元测试

## 📚 技术栈参考

本技能基于以下技术栈文档:

**后端技术栈**:
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md) - 后端框架
- [MyBatis-Plus](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md) - ORM 增强
- [MySQL](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 数据库

**前端技术栈**:
- [Vue 3](mdc:.codebuddy/spec/global/knowledge/stack/vue3.md) - Vue 框架

**编码规范**:
- [后端代码规范](mdc:.codebuddy/spec/global/standards/backend/codestyle.md)
- [前端代码规范](mdc:.codebuddy/spec/global/standards/frontend/codestyle.md)

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解更多。

## 📋 前置条件

- [ ] 已有详细的注释或设计文档
- [ ] 接口签名已明确(方法名、参数、返回值)
- [ ] 业务逻辑和边界条件已说明
- [ ] 已确定技术栈和编码规范

**技术要求**:
- Java >= 17 (Spring Boot 3 要求)
- TypeScript >= 5.0
- Python >= 3.10
- 已配置 IDE 和 Linter (Checkstyle/ESLint/Pylint)

## 🔄 执行步骤

### 步骤 1: 解析注释和设计说明

**目标**: 理解功能需求、输入输出、边界条件和约束

**提取关键信息**:
- 输入参数: 类型、范围、验证规则
- 输出结果: 类型、格式、数据结构
- 边界条件: null 处理、空集合、边界值
- 异常情况: 错误码、异常类型、处理方式
- 依赖和约束: 数据库、缓存、第三方服务、性能要求

**验收标准**:
- [ ] 功能需求已明确
- [ ] 输入输出已定义
- [ ] 边界条件已识别
- [ ] 依赖和约束已列出

### 步骤 2: 设计代码结构

**目标**: 确定实现方案,考虑性能、安全性、可维护性

**选择设计模式**:
- 单一职责: 每个类/方法只做一件事
- 分层架构: Controller → Service → Mapper (后端)
- 组件化: UI 组件 + 业务逻辑分离(前端)

**确定技术方案**:
- 参数验证: `@Valid` + Bean Validation (Java) 或 `zod` (TypeScript)
- 错误处理: 统一异常处理器(后端)、错误边界(前端)
- 性能优化: 缓存、分页、懒加载
- 安全措施: 输入验证、SQL 注入防护、XSS 防护

**验收标准**:
- [ ] 分层架构已确定
- [ ] 技术方案已选择
- [ ] 符合技术栈最佳实践

### 步骤 3: 编写代码实现

**目标**: 实现核心逻辑、处理边缘情况和异常

**实现要点**:
1. 按照注释描述的步骤编写代码
2. 遵循技术栈文档的最佳实践
3. 处理边缘情况(null/undefined、空集合、边界值)
4. 添加错误处理(参数验证、业务逻辑、数据库、网络异常)
5. 添加日志和监控

**关键技术**:

**Java (Spring Boot + MyBatis-Plus)**:
- 使用 `@Valid` + Bean Validation 验证参数
- 使用 MyBatis-Plus `BaseMapper` 简化 CRUD
- 使用 `BCryptPasswordEncoder` 加密密码
- 使用 `@Transactional` 管理事务
- 使用 `@RestControllerAdvice` 统一异常处理

**TypeScript (Vue 3 + Composition API + zod)**:
- 使用 Composition API (`ref`, `reactive`) 管理状态
- 使用 `zod` 定义验证规则
- 使用 `computed` 和 `watch` 优化性能
- 使用 TypeScript 类型安全
- 使用 axios 处理 HTTP 请求

**验收标准**:
- [ ] 核心逻辑已实现
- [ ] 边缘情况已处理
- [ ] 错误处理已添加
- [ ] 日志记录已添加

### 步骤 4: 验证代码质量

**目标**: 确保代码符合规范、逻辑正确、可维护性强

**检查项**:
- 编译检查: 确保代码可编译通过
- Linter 检查: 运行 Checkstyle/ESLint/Pylint
- 单元测试: 编写测试用例验证功能
- 代码审查: 遵循团队代码审查清单

**验收标准**:
- [ ] 代码可编译通过
- [ ] Linter 验证通过
- [ ] 单元测试通过(覆盖率 >= 80%)
- [ ] 代码审查通过

---

## 💡 最佳实践

### 1. 使用 Lambda 表达式和 Stream API (Java)

✅ **推荐**: 简洁的 Lambda 查询
```java
// MyBatis-Plus Lambda 查询
LambdaQueryWrapper<User> query = new LambdaQueryWrapper<>();
query.eq(User::getUsername, username)
     .or()
     .eq(User::getEmail, email);
Long count = userMapper.selectCount(query);
```

❌ **不推荐**: 字符串查询
```java
// 字符串易出错,不安全
userMapper.selectList(new QueryWrapper<User>()
    .eq("username", username)
    .or()
    .eq("email", email));
```

### 2. 使用类型安全 (TypeScript)

✅ **推荐**: 完整的类型定义
```vue
<script setup lang="ts">
interface UserFormProps {
  initialData?: User;
  onSubmit: (data: User) => Promise<void>;
  isLoading: boolean;
}

const props = defineProps<UserFormProps>();
// TypeScript 类型检查
</script>
```

❌ **不推荐**: 使用 any 类型
```typescript
const UserForm = ({ onSubmit }: any) => {  // 失去类型安全
  // ...
};
```

### 3. 使用分层架构

✅ **推荐**: 清晰的分层
```
后端: Controller → Service → Mapper
前端: View → Component → Composable → Service
```

❌ **不推荐**: Controller 直接操作数据库
```java
@RestController
public class UserController {
    @Autowired
    private UserMapper userMapper;  // ❌ 应该依赖 Service
}
```

---

## ⚠️ 常见错误

### 1. 缺少参数验证

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

### 2. 密码明文存储

❌ **错误**: 明文存储密码
```java
user.setPassword(userDTO.getPassword());  // 明文存储
```

✅ **正确**: 使用 BCrypt 加密
```java
String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
user.setPassword(encodedPassword);
```

### 3. 未处理唯一键冲突

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

---

## ✅ 验证清单

**功能验证**:
- [ ] 代码可编译通过
- [ ] 所有单元测试通过
- [ ] 接口正常响应
- [ ] 数据持久化成功
- [ ] 前端表单验证正常

**质量验证**:
- [ ] 代码符合规范(Checkstyle/ESLint)
- [ ] 无安全漏洞(SpotBugs/SonarQube)
- [ ] 性能指标达标(响应时间 < 200ms)
- [ ] 日志记录完整
- [ ] 测试覆盖率 >= 80%

**技术栈验证**:
- [ ] 遵循 Spring Boot 3 最佳实践
- [ ] 遵循 MyBatis-Plus CRUD 增强模式
- [ ] 遵循 Vue 3 Composition API 开发模式
- [ ] 使用推荐的 API 和模式

**规范遵守**:
- [ ] 遵循 [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md)
- [ ] 遵循 [后端代码规范](mdc:.codebuddy/spec/global/standards/backend/codestyle.md)
- [ ] 遵循 [前端代码规范](mdc:.codebuddy/spec/global/standards/frontend/codestyle.md)

---

## 📚 可重用资源

详细的代码示例和技术参考请查看:
- `checklist.md` - 完整的质量检查清单
- `examples.md` - 完整的代码实现示例(Java、TypeScript、Python)
- `reference.md` - 技术参考和架构模式

## 🔗 相关技能

- `doc-code-generation` - 根据设计文档生成代码(更高层次的抽象)
- `doc-code2comment` - 为已有代码编写注释（反向操作）
- `cr-java-code` - Java 代码审查和质量检查

## 📖 参考资料

- [Spring Boot 3 官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
