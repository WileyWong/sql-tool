# Tools Commands

项目工具命令集，包含项目初始化、项目记忆管理和项目知识库生成等核心工具。

## 命令列表

### 1. init-project ⭐ 推荐

**用途**: 初始化项目 - 支持前端、后端或前后端一体

**使用场景**:
- 创建新项目时
- 需要快速初始化项目结构
- 支持灵活选择项目类型

**支持的项目类型**:
- **仅前端**: Vue 3 + Vite
- **仅后端**: Spring Boot + Maven
- **前后端一体**: 前端 + 后端

**交互流程**:
1. 询问项目类型（前端/后端/前后端）
2. 收集项目信息（名称、描述、包名等）
3. 验证信息
4. 调用对应的 Skill 初始化
5. 显示初始化结果

**示例**:
```
🚀 项目初始化向导

请选择需要初始化的项目类型：
1️⃣  仅前端项目
2️⃣  仅后端项目
3️⃣  前后端一体项目

请输入选项 (1/2/3): 3
```

**详细文档**: [init-project.md](init-project.md)

---

### 2. init-memory

**用途**: 初始化项目记忆 - 建立项目宪章、开发指南和项目上下文

**使用场景**:
- 新项目启动时
- 建立项目规范和约束
- 定义核心原则和质量标准

**生成的文件**:
- `.spec-code/memory/constitution.md` - 项目宪章（6 大核心原则）
- `.spec-code/memory/guidelines.md` - 开发指南（Skills/Commands/Templates 编写规范）
- `.spec-code/memory/context.md` - 项目上下文（技术栈、项目结构）

**注意**：项目知识库（`workspace/knowledge/`）是独立的，由 `gen-knowledge` Command 生成

**交互流程**:
1. 收集项目基本信息（名称、类型、技术栈）
2. 选择核心原则（可使用默认或自定义）
3. 生成三个核心记忆文件
4. 显示初始化结果

**详细文档**: [init-memory.md](init-memory.md)

---

### 3. gen-knowledge ⭐ 新增

**用途**: 生成项目知识库 - 自动提取项目代码和文档，生成结构化的知识库索引

**使用场景**:
- 遗留系统文档化（无文档或文档过时）
- 新项目知识沉淀（快速建立知识体系）
- 团队协作知识管理（新人快速上手）
- 代码审查和重构（理解现有架构）

**核心优势**:
- ✅ **自动化** - 通过 agent 自动扫描和提取
- ✅ **结构化** - 按技术栈分类组织
- ✅ **可维护** - 批量操作确保一致性
- ✅ **多技术栈** - 支持 Spring Boot、Vue、Python 等

**工作流程**:
1. 激活 doc-knowledge-extractor Agent
2. Agent 调用 doc-extract-proj-knowledge Skill
3. 扫描代码结构并规划分类
4. 分批生成分类文档（API、Service、Mapper、Entity 等）
5. 批量添加文档关联链接
6. 使用 doc-index 生成总索引 README
7. 批量添加维护记录
8. 质量验证

**输出**:
- `kb/README.md` - 总索引（自动生成）
- `kb/service-api-http.md` - HTTP API 索引
- `kb/business-logic.md` - 业务逻辑层索引
- `kb/orm-mapper.md` - ORM 映射器索引
- `kb/entity.md` - 实体对象索引
- `kb/dto.md` - DTO 对象索引
- 其他分类文档...

**详细文档**: [gen-knowledge.md](gen-knowledge.md)

---

## 使用流程

### 1. 初始化新项目

```
运行 init-project 命令
   ↓
选择项目类型（前端/后端/前后端）
   ↓
提供项目信息（名称、描述、包名等）
   ↓
系统验证信息
   ↓
调用对应的 Skill 初始化
   ↓
显示初始化结果
   ↓
运行 init-memory 初始化项目记忆
   ↓
进入项目目录，启动开发
```

### 2. 生成项目知识库

```
运行 gen-knowledge 命令
   ↓
激活 doc-knowledge-extractor Agent
   ↓
扫描代码结构并规划分类
   ↓
分批生成分类文档
   ↓
生成总索引 README
   ↓
质量验证
   ↓
知识库生成完成
```

### 选择合适的命令

| 场景 | 推荐命令 | 说明 |
|------|---------|------|
| 创建新项目 | `init-project` | 交互式选择项目类型 |
| 初始化项目记忆 | `init-memory` | 建立项目宪章和规范 |
| 生成项目知识库 | `gen-knowledge` | 自动提取代码和文档 |

## 最佳实践

### 1. 项目初始化顺序

推荐顺序：
1. **init-project** - 创建项目结构
2. **init-memory** - 建立项目记忆和规范
3. **gen-knowledge** - 生成项目知识库（可选）

### 2. 提供清晰的项目信息

**项目名称**:
- ✅ 使用小写字母、数字、连字符
- ✅ 简洁易记
- ❌ 避免特殊字符和空格

**项目描述**:
- ✅ 1-2 句话，说明项目功能
- ✅ 清晰明确
- ❌ 避免过长或模糊

**包名**（后端）:
- ✅ 遵循 Java 包名规范（com.company.project）
- ✅ 全小写
- ❌ 避免特殊字符

### 3. 知识库维护建议

**生成后**:
- 定期更新知识库文档
- 保持文档与代码同步
- 及时补充新增功能的说明

**团队协作**:
- 新人入职时先阅读 `kb/README.md`
- 代码审查时参考知识库文档
- 重构时更新相关文档

## 常见问题

### Q: 如何修改项目信息？

**A**: 初始化完成后，可以手动修改配置文件：
- 前端: `package.json`、`README.md`
- 后端: `pom.xml`、`application.yml`、`README.md`

### Q: 如何更新项目记忆？

**A**: 直接编辑 `.spec-code/memory/` 目录下的文件：
- `constitution.md` - 修改核心原则
- `guidelines.md` - 更新开发指南
- `context.md` - 更新项目上下文

### Q: 知识库文档如何维护？

**A**: 
- 手动更新：直接编辑 `kb/` 目录下的文档
- 重新生成：再次运行 `gen-knowledge` 命令（会覆盖现有文档）

### Q: 如何处理初始化失败？

**A**: 
1. 检查前置条件是否满足
2. 查看错误信息
3. 根据错误信息进行修复
4. 重新运行初始化命令

### Q: 前后端项目名称可以相同吗？

**A**: 不建议相同，因为它们会在同一目录下创建。建议使用不同的名称，如 `my-frontend` 和 `my-backend`。

## 相关资源

### Skills
- [init-frontend-scaffold](mdc:skills/init-frontend-scaffold/SKILL.md) - 前端脚手架 Skill
- [init-backend-scaffold](mdc:skills/init-backend-scaffold/SKILL.md) - 后端脚手架 Skill
- [init-project-memory](mdc:skills/init-project-memory/SKILL.md) - 项目记忆初始化 Skill
- [doc-extract-proj-knowledge](mdc:skills/doc-extract-proj-knowledge/SKILL.md) - 项目知识提取 Skill
- [doc-index](mdc:skills/doc-index/SKILL.md) - 文档索引生成 Skill

### Agents
- [doc-knowledge-extractor](mdc:agents/doc-knowledge-extractor.md) - 文档知识提取 Agent

## 更新日志

### v2.0.0 (2025-11-21)

- ✨ 新增 `gen-knowledge` - 自动生成项目知识库
- 🔧 优化目录结构，更新为 3 个核心命令
- 📝 完善文档和使用指南

### v1.0.0 (2025-11-04)

- ✨ 创建 `init-project` - 支持交互式选择项目类型
- ✨ 创建 `init-memory` - 初始化项目记忆
- 🔧 改进交互流程，增强用户体验
