---
name: code-generation
description: 根据设计文档生成高质量的代码实现，遵循技术栈规范和编码最佳实践，支持 Spring Boot、Vue 等主流框架
category: implementation
keywords: [代码生成, 自动化开发, 模板引擎, 脚手架, 快速开发]
---

# Skill: 代码生成

基于设计文档和技术栈规范，生成高质量、可运行的完整代码实现。

## 核心原则（15 秒速查）

1. **完整理解** - 必须完整读取设计文档，避免信息遗漏导致代码不完整  
2. **规范优先** - 遵循技术栈文档和编码规范，确保代码质量
3. **完整可运行** - 包含所有必要的导入、注解、异常处理
4. **分层架构** - Controller-Service-Mapper 清晰分层，职责明确
5. **类型安全** - 使用 TypeScript、DTO 转换，避免类型错误
6. **测试驱动** - 同步生成单元测试，验证代码正确性

## 🎯 目标

解决软件研发中的 **代码实现** 问题，提供 **符合规范的完整代码**。

**适用场景**:
- 后端 API 实现（Spring Boot + MyBatis-Plus）
- 前端组件开发（Vue 2.x、Vue3.x）
- 数据访问层实现（Mapper、Service）
- 工具类和辅助函数

**输出成果**:
- 完整的后端代码（Controller、Service、Mapper、Entity、DTO）
- 完整的前端代码（Components、Services、Types、Composables）
- 单元测试代码（JUnit、Vitest）

## 📚 技术栈参考

本技能基于以下技术栈文档：
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md) - 后端核心框架
- [MyBatis-Plus](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md) - ORM 增强工具
- [Vue 3](mdc:.codebuddy/spec/global/knowledge/stack/vue3.md) - 前端组件开发

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解更多。

## 📋 前置条件

- [ ] 已有完整的设计文档（API 设计、数据库设计、业务流程设计）
- [ ] 技术栈已明确（语言、框架、版本）
- [ ] 开发环境已准备（IDE、编译器、数据库）
- [ ] 项目脚手架已初始化

## ⚠️ 关键提醒

**文档读取要求**:
- 必须使用 `read_file` 工具完整读取所有设计文档
- 避免只读取前100行，这会导致重要信息遗漏
- 如果文档很长，使用分段读取确保覆盖全部内容
- 代码生成质量完全依赖于对设计文档的完整理解

## 🔄 执行步骤

### 步骤 1: 理解设计文档

**目标**: 深入理解设计意图、技术约束和实现要求

**⚠️ 重要**: 必须完整读取所有设计文档，避免只读取前100行导致信息不完整

**操作**:
1. **完整阅读** API 设计文档（接口定义、参数、返回值、错误码）
   - 使用 `read_file` 工具读取完整文档，不限制行数
   - 如果文档很长，分段读取确保覆盖所有内容
2. **完整阅读** 数据库设计文档（表结构、字段、索引、关系）
   - 读取所有表的DDL语句和字段说明
   - 理解实体关系和外键约束
3. **完整阅读** 业务流程设计（状态机、条件分支、异常处理）
   - 获取完整的业务规则和验证逻辑
   - 理解所有异常场景和错误处理要求
4. 确认技术栈版本和依赖关系

**读取策略**:
```markdown
// 推荐的文档读取方式
1. 先用 read_file 不限制行数读取整个文档
2. 如果文档超长，使用 offset 和 limit 分段读取
3. 确保读取到文档末尾，获取完整信息
```

**验收标准**:
- [ ] API 接口定义清晰（路径、方法、参数、返回值）
- [ ] 数据库表结构完整（表名、字段、类型、约束）
- [ ] 业务规则明确（验证规则、边界条件、异常场景）
- [ ] 技术依赖已确认（框架版本、库版本）
- [ ] **已读取设计文档的完整内容，不遗漏任何重要信息**

### 步骤 2: 选择技术实现方案

**目标**: 根据设计文档选择合适的技术实现方案和代码模式

**后端架构**（Spring Boot 项目）:
```
Controller 层: RESTful API 控制器
Service 层: 业务逻辑实现
Mapper 层: MyBatis-Plus BaseMapper
Entity 层: 实体类（对应数据库表）
DTO 层: 数据传输对象（API 输入输出）
```

**前端架构**（Vue 项目）:
```
Pages: 页面组件（路由级别）
Components: 可复用组件
Composables: 组合式函数（状态管理、副作用）
Services: API 调用服务
Types: TypeScript 类型定义
```

**验收标准**:
- [ ] 分层架构清晰合理
- [ ] 设计模式选择恰当
- [ ] 代码结构符合技术栈规范

### 步骤 3: 生成后端代码

**目标**: 生成完整的后端代码

**生成内容**:
1. **Entity 实体类** - 使用 `@TableName`、`@TableId`、`@TableField` 映射数据库表
2. **Mapper 接口** - 继承 `BaseMapper<T>` 获得 CRUD 方法
3. **Service 接口和实现** - 业务逻辑、事务管理、异常处理
4. **Controller 控制器** - RESTful API、参数验证、全局异常处理
5. **DTO 类** - 请求和响应数据传输对象

详细代码示例参考 `examples.md` 文件。

**验收标准**:
- [ ] 所有类包含完整的导入语句
- [ ] 所有方法有 JavaDoc 注释
- [ ] 使用 `@Transactional` 确保事务一致性
- [ ] 使用 `@Valid` 进行参数验证
- [ ] 实现全局异常处理

### 步骤 4: 生成前端代码

**目标**: 生成完整的前端代码

**生成内容**:
1. **TypeScript 类型定义** - 请求/响应接口定义
2. **API 服务** - 封装 axios 调用，类型安全
3. **Vue 组件** - 页面和可复用组件
4. **Composables 组合式函数** - 状态管理、数据获取

详细代码示例参考 `examples.md` 文件。

**验收标准**:
- [ ] 使用 TypeScript 实现类型安全
- [ ] 使用 Composables 管理状态和副作用
- [ ] 使用 `ref`/`reactive` 管理响应式数据
- [ ] 错误处理完善（try-catch、错误提示）
- [ ] 用户交互友好（加载状态、确认对话框）

### 步骤 5: 编写单元测试

**目标**: 为生成的代码编写单元测试

**后端测试**（JUnit 5）:
- 使用 `@Mock` 和 `@InjectMocks` 注入依赖
- 使用 Given-When-Then 模式组织测试
- 测试正常流程和异常流程

**前端测试**（Vitest + Vue Test Utils）:
- 使用 `vi.mock` 模拟依赖服务
- 使用 `@vue/test-utils` 进行组件测试
- 测试用户交互和 DOM 渲染

详细测试示例参考 `examples.md` 文件。

**验收标准**:
- [ ] 所有单元测试通过
- [ ] 测试覆盖率 ≥ 80%
- [ ] 测试用例覆盖正常和异常流程

### 步骤 6: 验证代码质量

**目标**: 确保生成的代码符合质量标准

**操作**:
1. 运行单元测试（`mvn test` 或 `npm test`）
2. 运行代码检查工具（Checkstyle、ESLint）
3. 检查测试覆盖率（≥ 80%）
4. 代码审查（检查逻辑、命名、注释）

**验收标准**:
- [ ] 所有单元测试通过
- [ ] 代码符合编码规范（Linter 零错误）
- [ ] 性能指标达标（响应时间 < 200ms）
- [ ] 日志记录完整

---

## 💡 最佳实践

### 1. 代码质量标准

✅ **推荐**:
```java
/**
 * 用户服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    
    /**
     * 创建用户
     * @param dto 用户创建 DTO
     * @return 用户响应 DTO
     * @throws IllegalArgumentException 如果用户名已存在
     */
    @Override
    @Transactional
    public UserResponseDTO createUser(UserCreateDTO dto) {
        // 完整的逻辑实现
    }
}
```

❌ **不推荐**:
```java
// 缺少注释、缺少异常处理、缺少导入
public class UserService {
    public User create(String name) {
        return null;
    }
}
```

### 2. 分层架构清晰

✅ **推荐的分层**:
- Controller 层 - HTTP 请求处理、参数验证
- Service 层 - 业务逻辑、事务管理
- Mapper 层 - 数据访问、SQL 操作
- Entity 层 - 实体类、数据库表映射
- DTO 层 - API 输入输出对象

❌ **不推荐**:
- Controller 直接操作数据库
- Entity 直接暴露到 API
- 缺少 DTO 转换

### 3. 类型安全

✅ **使用 TypeScript**:
```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

<script setup lang="ts">
import { ref } from 'vue';

const users = ref<User[]>([]);
// 类型安全的代码
</script>
```

❌ **不使用类型**:
```javascript
<script setup>
import { ref } from 'vue';

const users = ref([]);
// 运行时类型错误风险高
</script>
```

更多最佳实践参考 `reference.md` 文件。

## ⚠️ 常见错误

### 错误 1: 缺少完整的导入语句

**症状**: 代码无法编译，提示类未找到

**解决**: 包含所有必要的导入语句，参考 `examples.md`

### 错误 2: 缺少异常处理

**症状**: 应用在异常情况下崩溃

**解决**: 实现全局异常处理或方法级 try-catch

### 错误 3: 未使用分页

**症状**: 接口响应慢、数据库压力大

**解决**: 使用 MyBatis-Plus 的 `Page<T>` 实现分页查询

更多常见错误参考 `reference.md` 文件。

## ✅ 验证清单

**功能验证**:
- [ ] 代码可编译通过
- [ ] 所有单元测试通过
- [ ] API 接口正常响应
- [ ] 数据持久化成功

**质量验证**:
- [ ] 代码符合规范（运行 Linter）
- [ ] 无安全漏洞（运行安全扫描）
- [ ] 性能指标达标（响应时间 < 200ms）
- [ ] 日志记录完整

**技术栈验证**:
- [ ] 遵循技术栈文档的最佳实践
- [ ] 使用推荐的 API 和模式
- [ ] 配置符合生产环境要求

**文档验证**:
- [ ] 所有公共方法有 JavaDoc/JSDoc 注释
- [ ] API 文档符合 OpenAPI 3.0 规范

---

## 📚 可重用资源

详细的代码示例、模板和参考文档请查看：
- `checklist.md` - 完整的质量检查清单
- `examples.md` - 完整的后端和前端代码示例
- `reference.md` - 架构设计和技术详细指南

## 🔗 相关技能

- [design-interface](mdc:skills/design-interface/SKILL.md) - API 接口设计
- [design-database](mdc:skills/design-database/SKILL.md) - 数据库设计
- [doc-code-review](mdc:skills/doc-code-review/SKILL.md) - 代码审查

## ❓ 常见问题

### Q: 如何选择合适的技术栈？

**A**: 参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md)。

**推荐组合**:
- **SPA 应用**: Spring Boot 3 + MyBatis-Plus + Vue 3

### Q: 代码生成后如何验证质量？

**A**: 使用完整验证清单（步骤 6），特别关注：
1. 代码可编译通过
2. 单元测试通过
3. 遵循技术栈文档的最佳实践

### Q: 如何确保生成的代码可运行？

**A**: 验证以下方面：
1. **导入完整**: 所有类都有必要的 import 语句
2. **注解正确**: 使用正确的 Spring、MyBatis-Plus 注解
3. **异常处理**: 实现全局异常处理
4. **测试通过**: 所有单元测试通过

## 🔄 版本历史

- **v3.0** (2025-11-10): Claude Skill 最佳实践优化版
  - 大幅精简内容（减少 85%）
  - 添加核心原则速查卡
  - 调整自由度（从低到中）
  - 创建完善的辅助文件（checklist、examples、reference）
  - 删除冗余代码示例，移至 examples.md

- **v2.0** (2025-11-07): 软件研发专业化版本
  - 深度集成技术栈文档
  - 提供完整可运行的代码示例
  - 新增架构模式和设计建议

- **v1.0**: 初始版本
