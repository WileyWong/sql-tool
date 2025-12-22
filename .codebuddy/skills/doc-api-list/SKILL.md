---
name: doc-api-list
description: 扫描后台代码并生成 API 接口清单文档，包含所有接口的路径、方法、参数、返回值和使用场景。纯文档生成，不涉及代码开发
category: documentation
keywords: [api, documentation, rest, markdown]
---

# Skill: 生成项目 API 文档

扫描 Spring Boot 项目代码，自动提取所有 REST API 接口，生成完整的 Markdown 格式接口清单文档。

> ⚠️ **必读**: [通用规范](mdc:spec/global/standards/common/index.md) - 项目记忆引用和所有规范要求

## 核心原则（15 秒速查）

1. **全自动扫描** - 使用 ripgrep 扫描注解，无需手动整理
2. **模块化分组** - 按业务模块分类接口，结构清晰
3. **完整信息** - 提取路径、方法、参数、返回值、认证要求
4. **规范检查** - 检查 RESTful 命名和路径设计规范
5. **示例驱动** - 包含完整的请求/响应示例和错误码

## 🎯 目标

解决软件研发中 **如何快速生成和维护 API 接口文档** 的问题。

**职责边界**:
- ✅ 扫描现有代码生成 API 文档（自动化提取）
- ✅ 按模块分类接口（清晰的文档结构）
- ✅ 提取接口详细信息（路径、参数、返回值、认证）
- ✅ 生成请求/响应示例（便于理解和测试）
- ✅ 接口规范检查（RESTful 规范验证）
- ✅ 接口统计分析（数量、分布、认证要求）

**不涉及**:
- ❌ API 接口设计（由 `design-interface` 负责）
- ❌ API 测试用例编写（由 `tdd-api-test` 负责）
- ❌ 代码开发和修改（纯文档生成）
- ❌ OpenAPI 注解添加（不修改代码）

**适用场景**:
- 项目文档编写阶段（生成完整的 API 清单）
- 前后端联调前对齐接口（提供接口定义参考）
- 新人入职培训（快速了解 API 结构）
- API 治理和规范检查（检查命名、路径设计）

**输出成果**:
- Markdown 格式的 API 接口清单文档
- 接口规范检查报告
- 接口统计分析

## 📚 技术栈参考

本技能基于以下技术栈文档：
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md) - 核心框架和注解
- [Java](mdc:.codebuddy/spec/global/knowledge/stack/java.md) - 编程语言

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解更多。

## 📋 前置条件

### 📂 必需文件检查

- [ ] 后台代码已完成或大部分完成
    - **路径**: 项目源代码目录（如 `src/main/java`）
    - **检查**: Controller 类已定义并包含必要注解

### 📄 技术要求

- [ ] Spring Boot 3.x 或兼容框架
- [ ] 可访问完整的源代码目录
- [ ] Controller 使用标准注解（@RestController、@RequestMapping 等）

### 📄 可选依赖文件

- [ ] API 设计文档（如存在）
    - **路径**: `workspace/{变更ID}/design/interface-design.md`
    - **作用**: 对比设计与实现的一致性

### 项目集成
- 先判断`项目记忆`是否存在，不存在则调用 `init-project-memory`
- 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md)
- 参考 [开发指南](mdc:.spec-code/memory/guidelines.md)

## 🔄 执行步骤

### 步骤 1: 扫描接口定义

**目标**: 使用 ripgrep 识别所有 REST API 接口

**原则**: 全面扫描 + 准确识别

**操作**:
```bash
# 查找 Controller 类
rg "@RestController|@Controller" --type java -l

# 查找接口方法和路径
rg "@(Get|Post|Put|Delete|Patch)Mapping" --type java -A 10

# 查找 RequestMapping
rg "@RequestMapping" --type java -A 5
```

**提取信息**:
- Controller 类名、基础路径（@RequestMapping）、所属模块
- 方法名、HTTP 方法、接口路径、JavaDoc 注释
- 包路径和模块信息

**要点**:
- 扫描所有 Java 源代码目录，不要遗漏子模块
- 提取完整的路径信息（基础路径 + 方法路径）
- 记录 JavaDoc 注释作为接口说明

**验收标准**: 参考 `checklist.md` 中的"步骤 1: 扫描接口定义 - 验收标准"

### 步骤 2: 提取接口详细信息

**目标**: 分析参数、返回值和认证要求

**提取内容**:

**参数提取**:
- @RequestBody 参数（请求体）
- @RequestParam 参数（查询参数，含默认值和必需性）
- @PathVariable 参数（路径变量）
- @RequestHeader 参数（请求头）
- DTO 类的字段验证规则（@NotNull、@Size 等）

**返回值分析**:
- 返回值类型（User、Page<User>、List<User>、ResponseEntity<T>）
- 响应状态码（从 @ResponseStatus 或方法逻辑推断）
- 响应数据结构
- **统一响应格式**（如 RespEntity、Result、ApiResponse 等包装类）

**认证和权限**:
- @PreAuthorize 注解（方法级权限控制）
- @Secured 注解（角色控制）
- @RolesAllowed 注解（JSR-250 标准）
- 自定义权限注解（如 @RightPermission）

**统一响应格式识别**:
- 识别项目中的统一响应包装类（如 RespEntity、Result、ApiResponse）
- 提取响应格式的字段定义（status、message、data 等）
- 分析成功和错误响应的结构差异

**要点**:
- 读取 DTO 类定义，提取字段信息和验证规则
- 分析方法签名，提取所有参数注解
- 识别自定义注解和权限要求

**验收标准**: 参考 `checklist.md` 中的"步骤 2: 提取接口详细信息 - 验收标准"

### 步骤 2.5: 提取 DTO 类属性定义

**目标**: 深度分析 DTO 类，提取完整的字段属性信息

**原则**: 完整性 + 可读性 + 层级清晰

**操作**:
```bash
# 查找所有 DTO 类
rg "class.*DTO|class.*Request|class.*Response|class.*VO" --type java -l

# 读取 DTO 类文件，提取字段定义
# 对于每个 DTO 类，提取:
# - 字段名、类型、注释
# - 验证注解(@NotNull、@NotBlank、@Size、@Min、@Max、@Email、@Pattern 等)
# - 默认值
# - 嵌套对象结构
```

**提取信息**:

**基础字段信息**:
- 字段名（fieldName）
- 字段类型（String、Integer、Long、Boolean、List<T>、嵌套对象）
- 字段注释（JavaDoc 或行内注释）
- 是否必需（根据 @NotNull、@NotBlank 等注解判断）

**验证规则**:
- @NotNull - 不能为 null
- @NotBlank - 不能为空字符串
- @NotEmpty - 不能为空集合
- @Size(min=x, max=y) - 长度范围
- @Min(value) - 最小值
- @Max(value) - 最大值
- @Email - 邮箱格式
- @Pattern(regexp) - 正则表达式
- @Valid - 嵌套对象验证

**嵌套对象处理**:
- 识别嵌套对象类型（如 Address、OrderItem）
- 递归提取嵌套对象的字段定义
- 在文档中使用缩进或层级结构展示

**枚举类型处理**:
- 识别枚举类型字段
- 提取枚举值列表
- 在文档中列出所有可选值

**要点**:
- 优先读取 @RequestBody 和返回值中使用的 DTO 类
- 对于嵌套对象，递归提取字段定义（最多 3 层）
- 提取验证注解的 message 属性作为字段说明
- 识别常用的业务 DTO 模式（如 Add、Update、Query、VO）

**验收标准**: 参考 `checklist.md` 中的"步骤 2.5: 提取 DTO 类属性定义 - 验收标准"

### 步骤 3: 模块化分组

**目标**: 按业务模块分类接口

**分类依据**:
- 包路径（com.example.user、com.example.order）
- Controller 类名（UserController、OrderController）
- 业务领域（用户管理、订单管理、商品管理）
- OpenAPI 标签（@Tag 注解）

**分组策略**:
```
用户管理模块
├── UserController - 用户基本操作
└── UserRoleController - 用户角色管理

订单管理模块
├── OrderController - 订单操作
└── OrderItemController - 订单项管理
```

**要点**:
- 优先使用 @Tag 注解的分组信息
- 按包路径自动分组
- 确保每个接口只属于一个模块

**验收标准**: 参考 `checklist.md` 中的"步骤 3: 模块化分组 - 验收标准"

### 步骤 4: 生成请求/响应示例（含 DTO 属性说明）

**目标**: 为每个接口生成完整的请求和响应示例，并展示 DTO 类的详细属性

**原则**: 示例真实 + 属性完整 + 层级清晰

**示例格式**:

**方案 A: 内联 JSON 示例（带注释）**
- 推荐用于接口详情
- 在 JSON 注释中包含字段类型、必需性、验证规则、说明
- 使用缩进展示嵌套对象层级关系
- 列出枚举类型的所有可选值

**方案 B: 表格形式**
- 推荐用于数据模型章节
- 提供完整的字段定义表格
- 包含字段名、类型、必需性、说明、验证规则、示例值
- 嵌套对象单独列出字段定义

**推荐策略**:
- **接口详情中**: 使用方案 A（内联 JSON 示例带注释），便于快速理解
- **数据模型章节**: 使用方案 B（表格形式），提供完整的字段定义
- **核心 DTO**: 两种方式都提供
- **简单 DTO**: 只在接口详情中使用方案 A

**要点**:
- 基于步骤 2.5 提取的 DTO 类定义生成真实的示例数据
- 在 JSON 注释中包含字段类型、必需性、验证规则、说明
- 对于嵌套对象，使用缩进展示层级关系
- 对于枚举类型，列出所有可选值
- 包含必需的请求头（如 Authorization）
- 提供成功和错误两种响应示例
- 使用正确的 HTTP 状态码
- **响应示例必须使用统一响应格式**（包含 code/status、message、data）

**详细示例参考**: `examples.md` 中的示例 1、示例 2、示例 4

**验收标准**: 参考 `checklist.md` 中的"步骤 4: 生成请求/响应示例 - 验收标准"

### 步骤 5: 接口规范检查

**目标**: 检查接口是否符合 RESTful 规范

**检查项**:

**命名规范**:
- ✅ 使用名词复数表示资源（/users 而非 /user）
- ✅ 不使用动词作为路径（无 /getUser、/createUser）
- ✅ 使用小写字母和连字符（kebab-case）
- ✅ 路径层级不超过 3 层

**HTTP 方法使用**:
- ✅ GET 用于查询操作
- ✅ POST 用于创建操作
- ✅ PUT 用于更新操作
- ✅ DELETE 用于删除操作
- ✅ PATCH 用于部分更新操作

**HTTP 状态码使用**:
- ✅ 200 OK - 请求成功
- ✅ 201 Created - 创建成功
- ✅ 204 No Content - 删除成功
- ✅ 400 Bad Request - 参数错误
- ✅ 401 Unauthorized - 未认证
- ✅ 403 Forbidden - 无权限
- ✅ 404 Not Found - 资源不存在

**验收标准**: 参考 `checklist.md` 中的"步骤 5: 接口规范检查 - 验收标准"

### 步骤 6: 生成统计分析

**目标**: 生成接口统计分析报告

**统计内容**:

**按模块统计**:
- 用户管理模块: 5 个接口
- 订单管理模块: 8 个接口
- 商品管理模块: 6 个接口

**按 HTTP 方法统计**:
- GET: 10 个接口
- POST: 5 个接口
- PUT: 3 个接口
- DELETE: 1 个接口

**按认证要求统计**:
- 需要认证: 12 个接口
- 无需认证: 7 个接口

**要点**:
- 统计数据准确无误
- 提供可视化的统计表格
- 分析接口分布和特点

**验收标准**: 参考 `checklist.md` 中的"步骤 6: 生成统计分析 - 验收标准"

### 步骤 7: 输出 API 文档

**目标**: 将 API 文档内容输出到 Markdown 文件

**输出路径**: `workspace/{变更ID}/docs/api/api-index.md`

**文档结构**:
- YAML Frontmatter（title、description、created_at、updated_at、version、code_version）
- 概述（文档用途、接口统计、更新时间）
- 认证说明（全局认证策略、公开接口列表、认证方式）
- **统一响应格式**（成功响应、错误响应、分页响应格式说明）
- 接口目录（按模块分类的目录索引）
- 接口详细清单（按模块分类，包含接口表格和详细说明）
  - 每个接口包含带 DTO 属性说明的请求/响应示例
  - 响应示例使用统一响应格式（包含 status、message、data）
  - 接口表格不包含【认证】列
  - 在接口详情中说明认证和权限要求
- 数据模型定义（所有 DTO 类的完整字段定义表格）
  - 核心 DTO 类的详细字段表格
  - 嵌套对象的字段定义
  - 枚举类型的可选值列表
- 接口统计分析（按模块、HTTP 方法、认证要求统计）
- 接口规范检查（符合规范的接口和待改进项）
- 错误码定义（所有错误码列表，包含 status 字段取值规则）
- 使用建议（快速查找、前后端对齐、API 测试）

详细的文档模板参考 `reference.md` 中的"文档模板"章节。

**验收标准**: 参考 `checklist.md` 中的"步骤 7: 输出 API 文档 - 验收标准"

---

## ✅ 最佳实践

### 1. RESTful 命名规范

✅ **推荐**:
```java
@RequestMapping("/api/users")  // 使用复数名词

GET    /api/users        // 获取列表
POST   /api/users        // 创建
GET    /api/users/{id}   // 获取详情
PUT    /api/users/{id}   // 更新
DELETE /api/users/{id}   // 删除
```

❌ **不推荐**:
```java
@RequestMapping("/api/getUsers")  // 使用动词
POST /api/createUser              // 使用动词
```

### 2. 文档完整性要求

每个接口必须包含：
- HTTP 方法和完整路径
- 功能说明
- 请求参数（类型、必需性、默认值、验证规则）
- 返回值类型和结构
- 认证和权限要求（在接口详情中说明，不在表格中展示）
- 完整的请求/响应示例（含错误响应）
- HTTP 状态码说明
- **DTO 类属性详细说明**（字段类型、必需性、验证规则、示例值）

### 2.2 认证信息展示规范

**全局认证说明**（在文档开头）:
- 在"认证说明"章节统一说明全局认证策略
- 列出所有公开接口（无需认证）
- 说明认证方式（如 JWT、OAuth2）
- 提供认证示例（如 Authorization 请求头格式）

**接口级认证说明**（在接口详情中）:
- 在接口详情中说明该接口的认证要求
- 标注所需的角色或权限（如 @PreAuthorize("hasRole('ADMIN')")）
- 在请求示例中包含 Authorization 请求头（如需要认证）
- 不在接口列表表格中添加【认证】列

**详细示例参考**: `examples.md` 中的"认证说明章节示例"

### 2.3 统一响应格式规范

**识别统一响应包装类**:
- 扫描项目中的统一响应包装类（常见命名：RespEntity、Result、ApiResponse、R、CommonResult）
- 提取响应格式的字段定义（status/code、message/msg、data 等）
- 分析成功和错误响应的结构差异

**文档化统一响应格式**（在认证说明之后）:
- 在"统一响应格式"章节说明项目的响应格式规范
- 提供成功响应、错误响应、分页响应的完整示例
- 说明 status/code 字段的取值规则（如 0 表示成功，非 0 表示失败）
- 说明 data 字段的数据类型（Object、Array、null）

**在接口示例中使用统一格式**:
- 所有接口的响应示例必须使用统一响应格式
- 在 data 字段中展示业务数据
- 提供成功和错误两种响应示例

**详细示例参考**: `examples.md` 中的"示例 5: 统一响应格式文档化"

### 2.1 DTO 属性文档化最佳实践

**内联 JSON 示例**（推荐用于接口详情）:
- 在 JSON 注释中包含字段类型、必需性、验证规则、说明
- 使用缩进展示嵌套对象层级关系
- 列出枚举类型的所有可选值

**表格形式**（推荐用于数据模型章节）:
- 提供完整的字段定义表格
- 包含字段名、类型、必需性、说明、验证规则、示例值
- 嵌套对象单独列出字段定义

**嵌套对象展示**:
- 在 JSON 示例中使用缩进展示层级关系
- 在表格中单独列出嵌套对象的字段定义
- 最多展示 3 层嵌套

**枚举类型展示**:
- 在注释中列出所有可选值
- 在数据模型章节提供完整的枚举值列表

**详细示例参考**: `examples.md` 中的示例 4

### 3. 模块化文档组织

```
docs/api/
├── api-index.md          # 主文档（所有接口清单）
├── user-api.md           # 用户模块接口详情（可选）
├── order-api.md          # 订单模块接口详情（可选）
└── common-api.md         # 通用接口详情（可选）
```

更多最佳实践参考 `reference.md` 文件。

## ❌ 常见错误

### 错误 1: 扫描范围不完整

**症状**: 生成的文档缺少部分接口

**原因**: 只扫描了特定目录，遗漏了其他模块的 Controller

**解决**:
```bash
# ❌ 错误：只扫描 controller 目录
rg "@RestController" src/main/java/**/controller/ --type java

# ✅ 正确：扫描所有目录
rg "@RestController" src/main/java/ --type java
```

### 错误 2: 参数提取不完整

**症状**: 文档中只有路径，缺少参数说明

**原因**: 未分析方法签名和 DTO 类定义

**解决**: 
- 分析方法签名，提取所有参数注解（@RequestBody、@RequestParam、@PathVariable）
- 读取 DTO 类定义，提取字段信息和验证规则（@NotNull、@Size 等）

### 错误 3: 缺少示例

**症状**: 文档只有接口定义，缺少实际示例

**原因**: 未生成请求/响应示例

**解决**: 为每个接口添加完整的请求/响应示例，参考 `examples.md` 文件

### 错误 4: 模块分类混乱

**症状**: 接口分类不清晰，难以查找

**原因**: 未按业务模块合理分组

**解决**: 
- 优先使用 @Tag 注解的分组信息
- 按包路径自动分组
- 确保每个接口只属于一个模块

### 错误 5: DTO 属性信息缺失

**症状**: 文档中只有 DTO 类名，缺少字段详细信息

**原因**: 未提取 DTO 类的字段定义

**解决**: 
- 读取 DTO 类文件，提取所有字段定义
- 分析验证注解（@NotNull、@Size 等），提取验证规则
- 在 JSON 示例中使用注释说明字段类型、必需性、验证规则
- 在数据模型章节提供完整的字段表格

**示例**:
```markdown
❌ 错误：只有类名
**请求参数**: UserCreateRequest

✅ 正确：包含字段详细信息
**请求参数**: `UserCreateRequest`
  ```json
  {
    "username": "john_doe",        // String, 必需, 用户名, 3-20个字符
    "email": "john@example.com",   // String, 必需, 邮箱地址
    "age": 25                      // Integer, 可选, 年龄, 范围1-150
  }
  ```
```

### 错误 6: 嵌套对象展示不清晰

**症状**: 嵌套对象的字段信息混乱，难以理解层级关系

**原因**: 未使用缩进或层级结构展示嵌套对象

**解决**: 
- 在 JSON 示例中使用缩进展示层级关系
- 在数据模型章节单独列出嵌套对象的字段定义
- 使用箭头或缩进标识嵌套层级

**示例**:
```markdown
✅ 正确：清晰的嵌套结构
{
  "address": {                   // Object, 可选, 地址信息
    "street": "123 Main St",     // String, 必需, 街道地址
    "city": "New York",          // String, 必需, 城市
    "zipCode": "10001"           // String, 必需, 邮政编码
  }
}
```

更多常见错误和解决方案参考 `reference.md` 文件。

## 🔍 验证清单

**完整的验收标准请查看 `checklist.md`**，该文件按执行步骤组织了所有验收项，便于逐步检查。

核心验证项（快速检查）:

**完整性验证**:
- [ ] 所有 Controller 类已扫描（≥ 1 个）
- [ ] 所有接口方法已识别（≥ 3 个）
- [ ] 接口参数和返回值完整
- [ ] 文档已保存到正确路径

**质量验证**:
- [ ] 接口按模块清晰分类（≥ 2 个模块）
- [ ] 文档格式规范，易于阅读
- [ ] 认证和权限要求已标注
- [ ] 包含完整的请求和响应示例
- [ ] DTO 属性信息完整（字段类型、必需性、验证规则）

**规范验证**:
- [ ] 接口命名符合 RESTful 规范
- [ ] HTTP 方法使用正确
- [ ] HTTP 状态码使用正确
- [ ] 响应格式统一

**文档验证**:
- [ ] 包含接口统计分析
- [ ] 包含接口规范检查
- [ ] 包含错误码定义
- [ ] 包含数据模型定义章节
- [ ] YAML Frontmatter 完整

---

## 📚 可重用资源

详细的脚本、模板和参考文档请查看：
- `checklist.md` - 完整的质量检查清单（10 大类验证项）
- `examples.md` - 完整的文档生成示例（3 个典型场景 + 脚本示例）
- `reference.md` - RESTful 设计规范和技术参考（9 个章节）

## 🔗 相关技能

- [design-interface](mdc:skills/design-interface/SKILL.md) - API 设计（设计阶段）
- [doc-services-list](mdc:skills/doc-services-list/SKILL.md) - 生成后台服务清单
- [doc-enums-list](mdc:skills/doc-enums-list/SKILL.md) - 生成枚举值清单
- [tdd-api-test](mdc:skills/tdd-api-test/SKILL.md) - API 测试（测试阶段）

## 🔗 技能定位与区别

| 技能 | 阶段 | 目标 | 输出 | 使用场景 |
|------|------|------|---------|------------|
| **design-interface** | 设计阶段 | 设计 API 接口 | API 设计文档、接口规范 | 项目初期，定义接口契约 |
| **doc-api-list** | 文档阶段 | 生成 API 文档 | Markdown 格式的接口清单 | 代码完成后，生成文档 |
| **tdd-api-test** | 测试阶段 | 编写 API 测试 | 测试用例、测试报告 | 验证接口功能正确性 |

**本技能的独特价值**:
- 自动化扫描现有代码，无需手动编写
- 生成完整的接口文档，便于快速查找
- 按模块分类，结构清晰
- 提供接口规范检查和改进建议
- 纯文档生成，不涉及代码开发

**与 OpenAPI 规范的区别**:
- OpenAPI 规范: 需要在代码中添加注解，生成可交互的 API 文档
- doc-api-list: 直接扫描代码，生成 Markdown 文档，无需修改代码

---

## 📚 参考资源

### 官方文档
- [Spring Boot 3 Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Web MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [Bean Validation](https://beanvalidation.org/)

### 设计指南
- [RESTful API Design Guide](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

### 工具
- [Postman](https://www.postman.com/) - API 测试工具
- [Apifox](https://www.apifox.cn/) - API 设计、测试、文档一体化工具
- [OpenAPI Tools](https://openapi.tools/) - API 文档生成工具
