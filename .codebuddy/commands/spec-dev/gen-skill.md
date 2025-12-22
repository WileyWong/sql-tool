---
command_id: spec-dev.gen-skill
command_name: 生成软件研发 Skill
category: spec-dev
description: 为软件研发场景生成高质量技能 - 涵盖全研发生命周期，遵循 Claude Code Skills 最佳实践
---

# Command: 生成 Skill

> ⚠️ **必须遵守的规范内容**: [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求
> - 禁止引入react及相关的技术栈

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `skills/{skill-name}/`
> - 核心文件: `SKILL.md`
> - 支持资源: `scripts/`、`reference.md`、`templates/`、`examples.md`

> 🎯 **专注领域**: 软件研发全生命周期 - 需求分析、架构设计、代码实现、质量保证、文档编写、部署运维

> **最佳实践**: 遵循 [Claude Code Skills 最佳实践](mdc:.codebuddy/spec/global/knowledge/best-practices/ClaudeSkillBestPractices.md)
> - **简洁为王**: Claude 已很聪明，只添加 Claude 不知道的内容
> - **适当自由度**: 根据任务脆弱性和可变性设置指导详细程度
> - **跨模型测试**: 根据目标模型（Haiku/Sonnet/Opus）调整详细程度
> - **原子性**: 每个 skill 只解决一个特定问题

## 🎯 核心定位

为软件研发团队创建**高度专业化**的技能：

**研发场景**:
- 架构设计（微服务、分布式系统、数据库设计）
- 代码实现（Spring Boot、Vue、MyBatis-Plus）
- 质量保证（单元测试、集成测试、代码审查）
- 需求分析（用户故事、技术方案、API 设计）
- 文档编写（API 文档、架构文档、部署文档）
- 部署运维（CI/CD、容器化、监控告警）

**技术栈集成**:
- 自动引用 [技术栈索引](mdc:global/knowledge/stack/index.md)
- 优先使用项目推荐技术栈（Spring Boot 3、MyBatis-Plus、Vue 3）
- 引用技术栈文档而非复制内容

## 🔄 执行流程

### 步骤 1: 识别研发场景和技术栈

询问用户（**分批提问，避免一次性过多**）：

#### 1.1 研发阶段识别

"这个技能主要用于软件研发的哪个阶段？"

- **需求分析** (requirements) - 用户故事、API 设计、数据建模
- **架构设计** (design) - 系统架构、微服务设计、数据库设计
- **代码实现** (implementation) - 后端开发、前端开发、数据库操作
- **质量保证** (quality) - 单元测试、集成测试、代码审查
- **文档编写** (documentation) - API 文档、架构文档、部署文档
- **部署运维** (deployment) - CI/CD、容器化、监控告警

#### 1.2 技术栈识别

"这个技能涉及哪些技术栈？"（参考 [技术栈索引](mdc:global/knowledge/stack/index.md)）

**前端**: Vue 3
**后端**: Spring Boot 3、MyBatis-Plus、Redis
**数据库**: MySQL
**工具**: Maven/Gradle、JUnit、Docker

#### 1.3 使用示例收集

"能否提供 2-3 个具体的使用示例？"

示例格式:
```
场景: [业务场景]
输入: [用户输入]
输出: [期望输出]
技术栈: [框架和工具]
```

### 步骤 2: 分析聚焦度和技术依赖

#### 2.1 聚焦度检查

**检查标准**:
- ✅ 只解决一个特定的研发问题
- ✅ 技术栈明确且不过度复杂
- ✅ 可独立使用，不依赖其他技能
- ❌ 不跨越多个研发阶段（如需求+实现）
- ❌ 不混合多个框架

**拆分示例**:

❌ **过于宽泛**: "微服务架构实现"

✅ **拆分方案**:
- Skill 1: "Spring Boot 微服务项目初始化"
- Skill 2: "微服务间 Feign 调用实现"
- Skill 3: "微服务配置中心集成"

#### 2.2 技术栈文档引用

根据技术栈，在生成的 SKILL.md 中添加引用章节：

```markdown
## 📚 技术栈参考

本技能基于以下技术栈文档：
- [Spring Boot 3](mdc:global/knowledge/stack/springboot3.md) - 核心框架
- [MyBatis-Plus](mdc:global/knowledge/stack/mybatis_plus.md) - ORM 增强
- [MySQL](mdc:global/knowledge/stack/mysql.md) - 数据库

参考 [技术栈索引](mdc:global/knowledge/stack/index.md) 了解更多。
```

#### 2.3 规划支持资源

根据需要规划：

**scripts/** - 代码生成脚本（需要生成样板代码时）
**reference.md** - 技术规范和架构设计（需要详细文档时）
**templates/** - 模板和配置文件（需要标准化配置时）
**examples.md** - 实际使用示例（复杂场景时）

### 步骤 3: 设计技能结构

#### 3.1 确定技能名称

遵循 [Claude Code Skills 最佳实践](mdc:../docs/ClaudeSkillBestPractices.md) 的命名规范：

✅ **推荐**: 动名词形式 (gerund form)
- `processing-spring-boot-requests`
- `designing-database-schemas`
- `testing-rest-apis`

✅ **可接受**: 名词短语
- `spring-boot-rest-api`
- `database-schema-design`

❌ **避免**: `helper`, `utils`, `microservices`（过于宽泛）

**YAML 元数据要求**:
```yaml
name: skill-name                    # 小写字母、数字、连字符，最长 64 字符
description: 简要描述（最长1024字符）  # 包含功能、技术栈、触发词
category: implementation            # requirements/design/implementation/quality/documentation/deployment
```

#### 3.2 选择适当的指导详细程度

根据任务特性设置自由度（参考最佳实践）：

**高自由度** - 需求分析、代码审查（多种方法都有效）
**中等自由度** - 代码实现、架构设计（存在推荐模式但允许变化）
**低自由度** - 数据库迁移、部署脚本（必须精确执行）

#### 3.3 创建目录和核心文件

```bash
mkdir -p skills/{skill-name}
cd skills/{skill-name}
touch SKILL.md

# 根据需要创建资源
mkdir -p scripts templates
touch reference.md examples.md
```

### 步骤 4: 编写技能内容

#### 4.1 SKILL.md 必需结构

```markdown
# Skill: {skill_name}

基于 **{技术栈}** 实现 **{核心功能}**。

## 📚 技术栈参考

本技能基于以下技术栈文档：
- [框架文档](mdc:global/knowledge/stack/xxx.md) - 说明
- [工具文档](mdc:global/knowledge/stack/yyy.md) - 说明

参考 [技术栈索引](mdc:global/knowledge/stack/index.md) 了解架构建议。

## 🔄 执行步骤

### 步骤 1: {步骤名称}

**操作**: 简要说明

**代码示例** (完整可运行，遵循技术栈文档):
```java
// 包含必要导入和配置
// 遵循 [技术栈文档](mdc:...) 的推荐实践
```

**技术要点**: 引用技术栈文档的具体章节

## ✅ 验证清单

- [ ] 代码可编译通过
- [ ] 遵循 [技术栈文档](mdc:...) 的最佳实践
- [ ] 包含错误处理和日志
```

#### 4.2 代码示例标准

**完整性要求**:
- ✅ 包含所有必要的导入语句
- ✅ 遵循技术栈文档的推荐实践
- ✅ 包含错误处理
- ✅ 可直接运行

**后端示例**（Spring Boot）:
```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
// ... 完整导入

@RestController
@RequestMapping("/api/users")
public class UserController {
    // 完整实现
}
```

参考 [Spring Boot 3](mdc:global/knowledge/stack/springboot3.md) 具体章节。

**前端示例**（Vue 3）:
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 完整实现
</script>
```

参考 [Vue 3](mdc:global/knowledge/stack/vue3.md) 具体章节。

#### 4.3 引用技术栈文档

在关键步骤中明确引用：

```markdown
### 步骤 2: 配置 MyBatis-Plus

参考 [MyBatis-Plus](mdc:global/knowledge/stack/mybatis_plus.md) 第 5 章：

- ✅ 使用 Lambda 表达式构建查询（第 3 章）
- ✅ 启用逻辑删除（第 6 章）
```

### 步骤 5: 质量验证

#### 5.1 技术质量检查

**代码质量**:
- [ ] 符合规范（Checkstyle/ESLint）
- [ ] 包含完整导入
- [ ] 错误处理完善

**技术栈符合性**:
- [ ] 遵循技术栈文档的推荐实践
- [ ] 使用推荐的 API 和模式

**架构设计**:
- [ ] 分层结构清晰
- [ ] 职责单一
- [ ] 可测试性强

**性能和安全**:
- [ ] 数据库查询优化（索引、分页）
- [ ] 输入验证完整
- [ ] 缓存策略合理

#### 5.2 跨模型测试（新增）

根据目标模型调整详细程度:
- **Haiku**: 需要更详细的步骤和完整代码示例
- **Sonnet**: 平衡简洁性和清晰度（推荐）
- **Opus**: 高层指导，避免过度解释

测试方法: 用不同模型测试同一场景，确保技能有效。

## 💡 核心原则总结

### 1. 简洁为王

遵循最佳实践：**Claude 已很聪明，只添加 Claude 不知道的内容**

❌ 删除: 框架基础概念解释、过多代码示例
✅ 保留: 项目特定配置、技术栈文档引用、关键步骤

### 2. 引用而非复制

❌ 不要: 复制技术栈文档的内容
✅ 应该: 引用 `mdc:global/knowledge/stack/xxx.md` 的具体章节

### 3. 适当自由度

根据任务脆弱性选择:
- **高自由度**: 需求分析、代码审查
- **中等自由度**: 代码实现、架构设计
- **低自由度**: 数据库迁移、部署脚本

## 🔗 相关资源

- [技术栈索引](mdc:global/knowledge/stack/index.md)
- [Spring Boot 3](mdc:global/knowledge/stack/springboot3.md)
- [MyBatis-Plus](mdc:global/knowledge/stack/mybatis_plus.md)
- [Vue 3](mdc:global/knowledge/stack/vue3.md)
- [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md)

## 🔄 版本历史

- **v2.1** (2025-11-11): 精简优化版本
  - 遵循 Claude Code Skills 最佳实践（简洁为王）
  - 去除 React 相关内容
  - 删除冗余章节（从 8000+ tokens 压缩到 ~2500 tokens）
  - 强调引用而非复制技术栈文档
  - 新增跨模型测试指导
  - 新增命名规范（gerund form）
  - 调整自由度设置（中等自由度为主）

- **v2.0**: 软件研发专业化版本
- **v1.0**: 初始版本
