---
name: init-project-memory-examples
description: 初始化项目记忆 Skill 的实际使用示例
---

# 使用示例：初始化项目记忆

## 示例 1: 新建 Node.js 全栈项目

### 场景描述

新建一个 Node.js + Vue 3 的全栈电商项目，需要建立项目记忆系统。

### 输入

```
项目名称: 电商管理系统
项目简介: 为中小企业提供完整的电商管理解决方案，包括商品管理、订单管理、用户管理等功能
项目类型: 全栈应用
技术栈: Node.js 18 + Express + Vue 3 + PostgreSQL 14
```

### 执行步骤

1. **检测项目记忆状态**
   - 检查 `.spec-code/memory/` 目录 → 不存在
   - 进入初始化流程

2. **检测用户语言**
   - 用户输入为中文 → 所有输出使用中文

3. **收集项目信息**
   - 项目名称: 电商管理系统
   - 项目简介: 为中小企业提供完整的电商管理解决方案
   - 项目类型: 全栈应用
   - 技术栈: Node.js 18、Express、Vue 3、PostgreSQL 14

4. **创建目录**
   ```bash
   mkdir -p .spec-code/memory
   ```

5. **生成 constitution.md**

```markdown
---
name: constitution
description: 项目宪章 - 核心原则和技术约束
author: AI Assistant
---

# 项目宪章

## 项目基本信息
- **项目名称**: 电商管理系统
- **项目简介**: 为中小企业提供完整的电商管理解决方案，包括商品管理、订单管理、用户管理等功能
- **项目类型**: 全栈应用
- **项目状态**: 开发中

## 核心原则

### I. 代码质量优先
所有代码必须通过 ESLint 和单元测试才能合并。
- 测试覆盖率 ≥ 80%
- ESLint 错误: 0
- 代码审查必须通过

### II. 文档与代码同步
文档与代码同等重要，必须同步更新。
- 所有 API 必须有 OpenAPI 文档
- 所有公共函数必须有 JSDoc 注释
- README 必须包含安装、使用、贡献指南

### III. 文档生成约束 ⭐
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 原地修改优先，不创建新版本文件
- 禁止在根目录创建文档（除 README.md）

### IV. 测试驱动开发
所有功能必须先写测试，再写实现。
- 单元测试覆盖率 ≥ 80%
- 集成测试覆盖主要流程
- 所有测试必须通过才能合并

### V. 持续集成
所有代码必须通过 CI/CD 流程。
- GitHub Actions 自动化测试、构建、部署
- 快速反馈，快速修复
- 每个 PR 都必须通过 CI 检查

### VI. 安全第一
所有代码必须通过安全审计。
- 敏感信息必须加密（密码、API Key）
- 定期进行依赖安全扫描
- 代码审查必须检查安全问题

## 技术约束

### 编程语言
- 后端: Node.js 18 或更高版本
- 前端: JavaScript ES2020 或更高版本

### 主要框架
- 后端: Express 4.x
- 前端: Vue 3 + Vite 4
- 数据库: PostgreSQL 14+
- 缓存: Redis 7.x（可选）

### 禁止使用的技术
- 不使用 jQuery（已过时）
- 不使用 Webpack（使用 Vite）
- 不使用 MySQL 5.6（安全风险）

### 性能要求
- API 响应时间 < 200ms（P95）
- 页面加载时间 < 3s（首屏）
- 支持 1000+ 并发用户
- 数据库查询 < 100ms（P95）

## 开发工作流

### 分支策略
- main: 生产分支，只接受 release 分支的 PR
- develop: 开发分支，接受 feature 分支的 PR
- feature/xxx: 功能分支，从 develop 创建
- hotfix/xxx: 紧急修复分支，从 main 创建

### 提交规范
- 格式: type(scope): subject
- 类型: feat, fix, docs, style, refactor, test, chore
- 示例: feat(product): add product search

### 代码审查
- 至少 1 个 Reviewer 批准
- 所有 CI 检查必须通过
- 代码覆盖率不能下降

### 发布流程
- 创建 release 分支
- 更新版本号和 CHANGELOG
- 创建 Git Tag
- 发布到生产环境

## 质量标准

### 代码质量
- ESLint 错误: 0
- 代码覆盖率: ≥ 80%
- 圈复杂度: ≤ 10
- 代码重复率: ≤ 5%

### 文档质量
- API 文档: 100% 覆盖（OpenAPI）
- 代码注释: 关键逻辑必须有 JSDoc 注释
- README: 必须包含安装、使用、贡献指南
- 变更日志: 每个版本都有 CHANGELOG

### 性能指标
- API 响应时间: < 200ms（P95）
- 页面加载时间: < 3s（首屏）
- 数据库查询: < 100ms（P95）
- 缓存命中率: > 80%

### 安全指标
- 安全漏洞: 0（P0/P1）
- 依赖漏洞: 0（P0/P1）
- 代码审计: 100% 覆盖
- 渗透测试: 每季度一次

## 输出目录规范

### 变更 ID 格式
YYYY-MM-DD-feature-name

示例:
- 2025-11-05-add-product-search
- 2025-11-05-fix-order-bug
- 2025-11-05-update-docs

### 输出路径规则
workspace/{变更ID}/{阶段}/{文件名}

示例:
- workspace/2025-11-05-add-product-search/requirements/requirements.md
- workspace/2025-11-05-add-product-search/design/database-design.md
- workspace/2025-11-05-add-product-search/implementation/ProductService.js

### 阶段分类
- requirements: 需求文档
- design: 设计文档
- planning: 计划文档
- implementation: 实现代码
- documentation: 文档
- deployment: 部署配置

### YAML Frontmatter 必填字段
所有输出文件必须包含以下字段:

```yaml
---
change_id: 2025-11-05-add-product-search
document_type: requirements/design/implementation/documentation
stage: requirements/design/planning/implementation/documentation/deployment
author: [作者名称]
---
```
```

6. **生成 guidelines.md**

```markdown
---
name: guidelines
description: 开发指南 - 编写规范和最佳实践
author: AI Assistant
---

# 开发指南

## 命名规范

### 文件命名
- Vue 组件: PascalCase (ProductList.vue)
- 工具函数: camelCase (formatPrice.js)
- 常量: UPPER_SNAKE_CASE (API_BASE_URL.js)
- 配置文件: kebab-case (app-config.json)

### 变量命名
- 布尔值: is/has/should 前缀 (isLoading, hasError)
- 数组: 复数形式 (products, orders)
- 对象: 单数形式 (product, order)
- 私有变量: _ 前缀 (_internalState)

### 函数命名
- 获取数据: get/fetch 前缀 (getProduct, fetchProductList)
- 设置数据: set 前缀 (setProduct)
- 检查条件: is/has/should 前缀 (isValid, hasPermission)
- 处理事件: handle 前缀 (handleClick, handleSubmit)

## 代码格式

### 缩进
- 使用 2 个空格
- 不使用 Tab

### 行宽
- 最大 120 个字符
- 超过时换行

### 空行
- 函数之间: 2 个空行
- 逻辑块之间: 1 个空行
- 类成员之间: 1 个空行

## 最佳实践

### 错误处理
```javascript
// ✅ 好的做法
try {
  const result = await fetchProduct(id);
  return result;
} catch (error) {
  logger.error('Failed to fetch product', { error: error.message, productId: id });
  throw new ProductFetchError('Unable to fetch product');
}

// ❌ 不好的做法
try {
  const result = await fetchProduct(id);
} catch (error) {
  console.log(error);
}
```

### 日志记录
```javascript
// ✅ 好的做法
logger.info('Product created', { productId: product.id, userId: user.id });
logger.error('Database connection failed', { error: err.message });

// ❌ 不好的做法
console.log('Product created');
console.error(error);
```

### 性能优化
```javascript
// ✅ 好的做法 - 使用缓存
const cachedProduct = cache.get(productId);
if (cachedProduct) return cachedProduct;

// ❌ 不好的做法 - 每次都查询
const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
```

## 常见问题和解决方案

### 问题 1: N+1 查询
```javascript
// ❌ 不好的做法
const products = await Product.find();
for (const product of products) {
  product.category = await Category.findById(product.categoryId);
}

// ✅ 好的做法
const products = await Product.find().populate('category');
```

### 问题 2: 内存泄漏
```javascript
// ❌ 不好的做法
setInterval(() => {
  // 定时器永远不会清除
}, 1000);

// ✅ 好的做法
const timer = setInterval(() => {
  // ...
}, 1000);
// 在组件卸载时清除
clearInterval(timer);
```
```

7. **生成 context.md**

```markdown
---
name: context
description: 项目上下文 - 当前技术栈和项目状态
author: AI Assistant
---

# 项目上下文

## 项目概述

### 项目定位
为中小企业提供完整的电商管理解决方案，包括商品管理、订单管理、用户管理等功能。

### 核心概念
- **商品**: 企业销售的产品
- **订单**: 用户购买商品的记录
- **用户**: 系统的使用者
- **分类**: 商品的分类

### 项目目标
- 提供完整的电商管理功能
- 支持 1000+ 并发用户
- 确保数据安全和隐私

## 活跃技术栈

### 后端
- Node.js 18
- Express 4.18
- TypeScript 5.0
- PostgreSQL 14
- Redis 7.0

### 前端
- Vue 3
- Vite 4
- TypeScript 5.0
- Tailwind CSS 3

### 工具
- Git
- Docker
- GitHub Actions
- ESLint + Prettier

## 项目结构

### 核心目录
- src/server: 后端源代码
- src/client: 前端源代码
- src/shared: 共享代码
- tests: 测试代码
- docs: 文档

### 关键文件
- package.json: Node.js 配置
- tsconfig.json: TypeScript 配置
- .eslintrc.json: ESLint 配置
- README.md: 项目说明
- CHANGELOG.md: 变更日志

## 当前开发阶段

### Phase 1: 核心功能 (100% ✅)
- 用户认证和授权
- 商品管理（CRUD）
- 订单管理（CRUD）
- 基础报表

### Phase 2: 扩展功能 (50% ⏳)
- 高级搜索和过滤
- 数据导出
- 批量操作
- 权限细分

### Phase 3: 优化和部署 (0% ⏳)
- 性能优化
- 安全加固
- 生产部署
- 监控告警

## 最近变更

### 2025-11-05
- feat: 添加用户认证功能
- feat: 实现商品管理模块
- test: 添加单元测试
- docs: 更新 API 文档

### 2025-11-04
- feat: 创建项目基础结构
- feat: 配置数据库连接
- docs: 编写 README
```

8. **更新 AI 助手配置**
   - 检查是否存在 CLAUDE.md 或 CODEBUDDY.md
   - 在文件开头添加项目记忆引用

9. **验证和报告**

```markdown
## 项目记忆初始化完成 ✅

### 创建的文件
- ✅ .spec-code/memory/constitution.md - 项目宪章
- ✅ .spec-code/memory/guidelines.md - 开发指南
- ✅ .spec-code/memory/context.md - 项目上下文

### 核心原则
1. 代码质量优先
2. 文档与代码同步
3. 文档生成约束
4. 测试驱动开发
5. 持续集成
6. 安全第一

### 技术栈 (基于项目的实际配置)
- 后端: Node.js 18 + Express 4.x
- 前端: Vue 3 + Vite 4
- 数据库: PostgreSQL 14+
- 缓存: Redis 7.x

### 输出目录规范
- **变更 ID 格式**: YYYY-MM-DD-feature-name
- **输出路径**: workspace/{变更ID}/{阶段}/{文件名}
- **阶段分类**: requirements/design/planning/implementation/documentation/deployment
- **YAML Frontmatter**: 所有输出文件必须包含 change_id、document_type、stage、created_at、author 等字段

### 下一步
1. 审查 .spec-code/memory/constitution.md，确认核心原则和输出目录规范
2. 根据需要调整 .spec-code/memory/guidelines.md
3. 在 Commands 和 Skills 中引用项目记忆
4. 按照输出目录规范组织所有生成的文档
```

### 预期输出

```
.spec-code/memory/
├── constitution.md      # 项目宪章（包含 6 大原则、技术约束、工作流、质量标准、输出规范）
├── guidelines.md        # 开发指南（包含命名规范、代码格式、最佳实践、常见问题）
└── context.md          # 项目上下文（包含项目概述、技术栈、项目结构、开发阶段、最近变更）
```

---

## 示例 2: 现有 Java 后端项目

### 场景描述

现有的 Java Spring Boot 项目缺少项目记忆系统，需要补充。

### 输入

```
项目名称: 用户管理系统
项目简介: 企业级用户管理和权限控制系统
项目类型: 后端应用
技术栈: Java 17 + Spring Boot 3.x + PostgreSQL 14
```

### 执行步骤

1. **检测项目记忆状态**
   - 检查 `.spec-code/memory/` 目录 → 不存在
   - 进入初始化流程

2. **检测用户语言**
   - 用户输入为中文 → 所有输出使用中文

3. **收集项目信息**
   - 从 `pom.xml` 提取技术栈
   - 从 `README.md` 提取项目概述
   - 从 `src/` 目录结构了解项目组织

4. **生成 constitution.md**
   - 包含 Java 17 + Spring Boot 3.x 的技术约束
   - 包含数据库设计规范
   - 包含 API 设计规范

5. **生成 guidelines.md**
   - 包含 Java 命名规范
   - 包含 Spring Boot 最佳实践
   - 从项目中提取实际的代码示例

6. **生成 context.md**
   - 从 `pom.xml` 提取依赖版本
   - 从 `src/main/java` 提取包结构
   - 从 Git 历史提取最近变更

### 预期输出

```
.spec-code/memory/
├── constitution.md      # 项目宪章（Java 17 + Spring Boot 3.x）
├── guidelines.md        # 开发指南（Java 编码规范 + Spring Boot 最佳实践）
└── context.md          # 项目上下文（当前技术栈和项目状态）
```

---

## 示例 3: 更新现有项目记忆

### 场景描述

项目已有项目记忆系统，但技术栈发生了变更（升级了 Spring Boot 版本），需要更新。

### 输入

```
操作: 更新项目记忆
原因: Spring Boot 升级从 2.7 到 3.1
```

### 执行步骤

1. **检测项目记忆状态**
   - 检查 `.spec-code/memory/` 目录 → 存在
   - 提示用户已初始化，询问是否要更新

2. **用户选择更新**
   - 选择更新 constitution.md
   - 更新技术约束部分

3. **更新 constitution.md**
   - 修改 Spring Boot 版本号
   - 更新相关的技术约束

4. **验证和报告**

```markdown
## 项目记忆更新完成 ✅

### 更新的文件
- ✅ .spec-code/memory/constitution.md - 更新技术约束

### 变更内容
- Spring Boot: 2.7 → 3.1
- Java: 11 → 17
- 其他依赖版本更新

### 下一步
1. 审查更新内容
2. 通知团队成员
3. 更新相关文档
```

---

## 常见场景总结

| 场景 | 操作 | 输出 |
|------|------|------|
| 新项目启动 | 初始化项目记忆 | 3 个文件 |
| 现有项目补充 | 初始化项目记忆 | 3 个文件 |
| 技术栈变更 | 更新 constitution.md | 1 个文件 |
| 编码规范调整 | 更新 guidelines.md | 1 个文件 |
| 定期维护 | 更新 context.md | 1 个文件 |

---

## 验证清单

完成后，验证以下项目：

- [ ] `.spec-code/memory/` 目录已创建
- [ ] `constitution.md` 包含 4-6 条核心原则
- [ ] `constitution.md` 包含文档生成约束
- [ ] `constitution.md` 包含输出目录规范
- [ ] `guidelines.md` 包含编码规范和最佳实践
- [ ] `guidelines.md` 包含代码示例（来自项目实际代码）
- [ ] `context.md` 包含当前技术栈和项目结构
- [ ] 所有文件包含 YAML Frontmatter
- [ ] 所有内容使用了统一的语言（中文或英文）
- [ ] 技术约束基于项目的实际配置文件
- [ ] 代码示例来自项目的实际代码
