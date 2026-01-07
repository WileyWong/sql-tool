# 知识库集成指南

## 概述

代码生成技能通过集成项目知识库，确保生成的代码符合项目规范和技术约束。

## 知识库来源

### 1. 项目记忆系统

```yaml
路径: .spec-code/memory/

文件:
  constitution.md:
    内容: 核心原则、技术约束、不可违反的规则
    用途: 验证生成代码是否符合项目约束
    
  guidelines.md:
    内容: 编码规范、命名约定、最佳实践
    用途: 指导代码风格和结构
    
  context.md:
    内容: 技术栈、版本信息、架构模式
    用途: 确定技术选型和框架版本
```

### 2. 项目技术文档

```yaml
常见路径:
  - docs/tech-spec.md
  - docs/architecture.md
  - docs/coding-standards.md
  - ARCHITECTURE.md
  - CONTRIBUTING.md
```

### 3. 配置文件

```yaml
代码风格:
  - .editorconfig
  - .eslintrc.js / .eslintrc.json
  - .prettierrc
  - checkstyle.xml
  - .golangci.yml
```

## 集成流程

### 步骤1: 检测知识库

```
1. 检查 .spec-code/memory/ 目录是否存在
2. 读取 constitution.md、guidelines.md、context.md
3. 扫描 docs/ 目录下的技术文档
4. 识别代码风格配置文件
```

### 步骤2: 提取关键信息

```yaml
从 context.md 提取:
  - 技术栈: Spring Boot / Vue / Go
  - 版本: Java 17, Spring Boot 3.2
  - 架构: MVC / DDD / Clean Architecture
  - 数据库: MySQL 8.0

从 guidelines.md 提取:
  - 命名规范: 类名、方法名、变量名
  - 注释规范: 格式、语言
  - 日志规范: 框架、级别
  - 异常处理: 异常类、错误码

从 constitution.md 提取:
  - 必须遵守的原则
  - 禁止的做法
  - 技术约束
```

### 步骤3: 应用到代码生成

```yaml
生成前:
  - 确定技术栈和版本
  - 加载对应的规范文档
  - 准备代码模板

生成中:
  - 应用命名规范
  - 添加规范的注释
  - 使用正确的日志方式
  - 实现规范的异常处理

生成后:
  - 验证是否符合约束
  - 检查是否有违规项
```

## 知识库内容示例

### context.md 示例

```markdown
# 项目技术上下文

## 技术栈

- **后端**: Java 17 + Spring Boot 3.2.5
- **ORM**: MyBatis-Plus 3.5.5
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.0
- **消息队列**: RocketMQ 5.0

## 架构模式

- 分层架构: Controller → Service → Mapper
- 异常处理: 全局异常处理器
- 日志框架: SLF4J + Logback

## 版本要求

| 组件 | 版本 | 说明 |
|------|------|------|
| JDK | 17+ | LTS 版本 |
| Spring Boot | 3.2.x | 最新稳定版 |
| MyBatis-Plus | 3.5.x | 最新稳定版 |
```

### guidelines.md 示例

```markdown
# 开发指南

## 命名规范

- 类名: 大驼峰，如 `UserService`
- 方法名: 小驼峰，动词开头，如 `createUser`
- 变量名: 小驼峰，如 `userName`
- 常量: 全大写下划线，如 `MAX_RETRY_COUNT`

## 注释规范

- 类注释: JavaDoc 格式，包含功能描述
- 方法注释: JavaDoc 格式，包含参数和返回值说明
- 行内注释: 解释复杂逻辑，使用中文

## 日志规范

- 使用 SLF4J 门面
- INFO: 关键业务节点
- ERROR: 异常情况，包含堆栈
- DEBUG: 调试信息，生产环境关闭
```

## 无知识库时的处理

```yaml
策略:
  1. 使用技能内置的默认规范
  2. 从项目配置文件推断技术栈
  3. 分析已有代码的风格
  4. 在方案确认阶段向用户确认

建议:
  - 提示用户初始化项目记忆系统
  - 使用 init-project-memory 技能创建
```

## 检查清单

- [ ] 检查 .spec-code/memory/ 目录
- [ ] 读取 context.md 获取技术栈
- [ ] 读取 guidelines.md 获取编码规范
- [ ] 读取 constitution.md 获取约束
- [ ] 应用规范到代码生成
- [ ] 验证生成代码符合约束
