---
name: init-project-memory-reference
description: 初始化项目记忆 Skill 的详细参考文档
---

# 参考文档：初始化项目记忆

## 项目记忆系统概述

项目记忆系统是 Spec-Code 框架的核心特性，通过三层结构记录项目的核心原则、技术约束和当前状态。

### 三层结构

| 文件 | 层级 | 职责 | 内容 | 维护方式 |
|------|------|------|------|---------| 
| **constitution.md** | 第一层 | 项目宪章（不可变原则） | 6 大核心原则、技术约束、开发工作流、质量标准、治理规则 | 团队共识，很少修改 |
| **guidelines.md** | 第二层 | 开发指南（最佳实践） | Skill/Command/Template 编写规范、知识库组织、代码风格 | 根据团队反馈调整 |
| **context.md** | 第三层 | 项目上下文（动态信息） | 项目概述、技术栈、项目结构、开发阶段、最近变更 | 自动生成，定期更新 |

## 项目宪章（constitution.md）详解

### 必须包含的内容

#### 1. 项目基本信息

```markdown
## 项目基本信息

- **项目名称**: [项目名称]
- **项目简介**: [1-2 句话说明项目的功能和价值]
- **项目类型**: [后端/前端/全栈/库/工具]
- **项目状态**: [规划/开发/测试/上线/维护]
```

#### 2. 核心原则（4-6 条）

**必须包含的原则**:

1. **代码质量优先**
   - 所有代码必须通过 Linter 和测试
   - 测试覆盖率 ≥ 80%
   - 代码审查必须通过

2. **文档与代码同步**
   - 文档与代码同等重要
   - 所有 API 必须有文档
   - README 必须包含安装和使用说明

3. **文档生成约束** ⭐ **强制**
   - 禁止主动生成总结文档、分析报告
   - 只在用户明确要求时生成文档
   - 原地修改优先，不创建新版本文件
   - 禁止在根目录创建文档（除 README.md）

4. **测试驱动开发**
   - 先写测试，再写实现
   - 所有功能必须有对应的测试
   - 测试必须通过才能合并

5. **持续集成**
   - 所有代码必须通过 CI/CD 流程
   - 自动化测试、构建、部署
   - 快速反馈，快速修复

6. **安全第一**
   - 所有代码必须通过安全审计
   - 敏感信息必须加密
   - 定期进行安全扫描

#### 3. 技术约束

```markdown
## 技术约束

### 编程语言
- 后端: Java 17 或更高版本
- 前端: JavaScript ES2020 或更高版本
- 脚本: Python 3.9 或更高版本

### 主要框架
- 后端: Spring Boot 3.x
- 前端: Vue 3 + Vite
- 数据库: PostgreSQL 14+
- 缓存: Redis 7.x

### 禁止使用的技术
- 不使用 jQuery（已过时）
- 不使用 Python 2（已停止维护）
- 不使用 MySQL 5.6（安全风险）

### 性能要求
- API 响应时间 < 200ms
- 页面加载时间 < 3s
- 支持 1000+ 并发用户
```

#### 4. 开发工作流

```markdown
## 开发工作流

### 分支策略
- main: 生产分支，只接受 release 分支的 PR
- develop: 开发分支，接受 feature 分支的 PR
- feature/xxx: 功能分支，从 develop 创建
- hotfix/xxx: 紧急修复分支，从 main 创建

### 提交规范
- 格式: type(scope): subject
- 类型: feat, fix, docs, style, refactor, test, chore
- 示例: feat(user): add user registration

### 代码审查
- 至少 1 个 Reviewer 批准
- 所有 CI 检查必须通过
- 代码覆盖率不能下降

### 发布流程
- 创建 release 分支
- 更新版本号和 CHANGELOG
- 创建 Git Tag
- 发布到生产环境
```

#### 5. 质量标准

```markdown
## 质量标准

### 代码质量
- Linter 错误: 0
- 代码覆盖率: ≥ 80%
- 圈复杂度: ≤ 10
- 代码重复率: ≤ 5%

### 文档质量
- API 文档: 100% 覆盖
- 代码注释: 关键逻辑必须有注释
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
```

#### 6. 输出目录规范 ⭐ **强制**

```markdown
## 输出目录规范

### 变更 ID 格式
YYYY-MM-DD-feature-name

示例:
- 2025-11-05-add-user-auth
- 2025-11-05-fix-login-bug
- 2025-11-05-update-docs

### 输出路径规则
workspace/{变更ID}/{阶段}/{文件名}

示例:
- workspace/2025-11-05-add-user-auth/requirements/requirements.md
- workspace/2025-11-05-add-user-auth/design/database-design.md
- workspace/2025-11-05-add-user-auth/implementation/UserService.java

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
change_id: 2025-11-05-add-user-auth
document_type: requirements/design/implementation/documentation
stage: requirements/design/planning/implementation/documentation/deployment
author: [作者名称]
---
```

### 文件头部示例

```markdown
---
change_id: 2025-11-05-add-user-auth
document_type: design
stage: design
author: AI Assistant
---

# 用户认证系统设计

## 概述
...
```
```

## 开发指南（guidelines.md）详解

### 必须包含的内容

#### 1. 命名规范

**文件命名**:
```
Vue 组件: PascalCase (UserProfile.vue)
工具函数: camelCase (formatDate.ts)
常量: UPPER_SNAKE_CASE (API_BASE_URL.ts)
配置文件: kebab-case (app-config.json)
```

**变量命名**:
```
布尔值: is/has/should 前缀 (isLoading, hasError)
数组: 复数形式 (users, items)
对象: 单数形式 (user, item)
私有变量: _ 前缀 (_internalState)
```

**函数命名**:
```
获取数据: get/fetch 前缀 (getUser, fetchUserList)
设置数据: set 前缀 (setUser)
检查条件: is/has/should 前缀 (isValid, hasPermission)
处理事件: handle 前缀 (handleClick, handleSubmit)
```

**类命名**:
```
普通类: PascalCase (UserService)
异常类: Error 后缀 (ValidationError)
接口: I 前缀或 Interface 后缀 (IUserService 或 UserServiceInterface)
```

#### 2. 代码格式

**缩进**:
- 使用 2 个空格（JavaScript/Vue）
- 使用 4 个空格（Java/Python）
- 不使用 Tab

**行宽**:
- 最大 120 个字符
- 超过时换行

**空行**:
- 函数之间: 2 个空行
- 逻辑块之间: 1 个空行
- 类成员之间: 1 个空行

#### 3. 最佳实践

**错误处理**:
```javascript
// ✅ 好的做法
try {
  const result = await fetchData();
  return result;
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new DataFetchError('Unable to fetch data');
}

// ❌ 不好的做法
try {
  const result = await fetchData();
} catch (error) {
  console.log(error);
}
```

**日志记录**:
```javascript
// ✅ 好的做法
logger.info('User login', { userId: user.id, timestamp: Date.now() });
logger.error('Database connection failed', { error: err.message });

// ❌ 不好的做法
console.log('User login');
console.error(error);
```

**性能优化**:
```javascript
// ✅ 好的做法 - 使用缓存
const cachedUser = cache.get(userId);
if (cachedUser) return cachedUser;

// ❌ 不好的做法 - 每次都查询
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

#### 4. 常见问题和解决方案

**问题 1: N+1 查询**
```javascript
// ❌ 不好的做法
const users = await User.find();
for (const user of users) {
  user.posts = await Post.find({ userId: user.id });
}

// ✅ 好的做法
const users = await User.find().populate('posts');
```

**问题 2: 内存泄漏**
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

## 项目上下文（context.md）详解

### 必须包含的内容

#### 1. 项目概述

```markdown
## 项目概述

### 项目定位
[项目的核心定位和价值主张]

### 核心概念
- [概念 1]: [说明]
- [概念 2]: [说明]

### 项目目标
- [目标 1]
- [目标 2]
```

#### 2. 活跃技术栈

```markdown
## 活跃技术栈

### 后端
- Java 17
- Spring Boot 3.1
- Spring Data JPA
- PostgreSQL 14

### 前端
- Vue 3
- Vite 4
- TypeScript 5
- Tailwind CSS

### 工具
- Git
- Docker
- Kubernetes
- GitHub Actions
```

#### 3. 项目结构

```markdown
## 项目结构

### 核心目录
- src/main/java: 后端源代码
- src/main/resources: 后端资源文件
- src/test: 测试代码
- web/src: 前端源代码
- docs: 文档

### 关键文件
- pom.xml: Maven 配置
- package.json: Node.js 配置
- README.md: 项目说明
- CHANGELOG.md: 变更日志
```

#### 4. 当前开发阶段

```markdown
## 当前开发阶段

### Phase 1: 核心功能 (100% ✅)
- 用户认证
- 权限管理
- 基础 CRUD

### Phase 2: 扩展功能 (50% ⏳)
- 数据导出
- 批量操作
- 高级搜索

### Phase 3: 优化和部署 (0% ⏳)
- 性能优化
- 安全加固
- 生产部署
```

#### 5. 最近变更

```markdown
## 最近变更

### 2025-11-05
- feat: 添加用户认证功能
- fix: 修复登录页面样式问题
- docs: 更新 API 文档

### 2025-11-04
- feat: 实现权限管理系统
- test: 添加单元测试
- refactor: 重构用户服务
```

## 文件模板

### constitution.md 模板

```markdown
---
name: constitution
description: 项目宪章 - 核心原则和技术约束
author: AI Assistant
---

# 项目宪章

## 项目基本信息
- **项目名称**: [项目名称]
- **项目简介**: [项目简介]
- **项目类型**: [项目类型]

## 核心原则

### I. 代码质量优先
[说明]

### II. 文档与代码同步
[说明]

### III. 文档生成约束 ⭐
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 原地修改优先，不创建新版本文件

### IV. 测试驱动开发
[说明]

### V. 持续集成
[说明]

### VI. 安全第一
[说明]

## 技术约束
[技术约束详情]

## 开发工作流
[工作流详情]

## 质量标准
[质量标准详情]

## 输出目录规范
[输出目录规范详情]
```

### guidelines.md 模板

```markdown
---
name: guidelines
description: 开发指南 - 编写规范和最佳实践
author: AI Assistant
---

# 开发指南

## 命名规范
[命名规范详情]

## 代码格式
[代码格式详情]

## 最佳实践
[最佳实践详情]

## 常见问题和解决方案
[常见问题详情]
```

### context.md 模板

```markdown
---
name: context
description: 项目上下文 - 当前技术栈和项目状态
author: AI Assistant
---

# 项目上下文

## 项目概述
[项目概述]

## 活跃技术栈
[技术栈详情]

## 项目结构
[项目结构详情]

## 当前开发阶段
[开发阶段详情]

## 最近变更
[最近变更详情]
```

## 常见错误和解决方案

### 错误 1: 文档生成约束缺失

**问题**: constitution.md 中没有包含文档生成约束

**后果**: AI 助手可能会主动生成不必要的总结文档

**解决方案**: 在 constitution.md 中添加以下内容：

```markdown
### III. 文档生成约束 ⭐
- 禁止主动生成总结文档、分析报告
- 只在用户明确要求时生成文档
- 原地修改优先，不创建新版本文件
- 禁止在根目录创建文档（除 README.md）
```

### 错误 2: 技术约束不具体

**问题**: constitution.md 中的技术约束过于模糊

**示例**:
- ❌ "使用 Java"
- ✅ "使用 Java 17 或更高版本"

**解决方案**: 明确指定版本号和具体要求

### 错误 3: 代码示例虚构

**问题**: guidelines.md 中的代码示例不来自项目实际代码

**后果**: 开发者可能会按照虚构的示例编写代码

**解决方案**: 从项目中复制真实的代码片段

### 错误 4: 语言混合

**问题**: 文件中混合使用中文和英文

**后果**: 阅读困难，不专业

**解决方案**: 选择一种语言，全文使用

## 最佳实践总结

1. **核心原则要清晰** - 每条原则都要有具体的实施要求
2. **技术约束要具体** - 明确指定版本号和具体要求
3. **代码示例要真实** - 从项目中复制，不虚构
4. **文档要简洁** - constitution.md 1-2 页，guidelines.md 3-5 页
5. **定期更新** - 每月更新 context.md，技术栈变更时更新 constitution.md
6. **文档生成约束必须包含** - 所有项目都必须包含此原则
7. **输出目录规范必须包含** - 确保所有输出文件遵循规范
