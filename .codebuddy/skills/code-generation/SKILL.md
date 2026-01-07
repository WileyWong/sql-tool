---
name: code-generation
description: 根据输入内容（需求/接口设计/代码注释/DDL/示例/自然语言）生成高质量代码，支持 Java/Go/TypeScript/MySQL/Groovy 多语言输出。当用户需要从设计文档生成代码、从注释生成实现、从 DDL 生成实体类、从需求生成数据库脚本、或通过自然语言描述生成代码时使用。**必须严格按流程执行，绝对不能跳过或省略**
---

# Skill: 代码生成

基于输入内容和技术上下文，生成高质量、可运行的完整代码实现。

## 核心流程

```
步骤0: 输入分析 → ✅检查点0 → 步骤1: 获取架构信息 → 步骤2: 输出方案(等待确认) → ✅检查点1 → 步骤3: 生成代码 → ✅检查点2 → 完成
```

---

## ⚠️ 强制检查点（必须遵守）

> **重要**: 每个检查点必须通过才能进入下一步，不可跳过！

| 检查点 | 位置 | 检查内容 | 不通过处理 |
|--------|------|----------|-----------|
| **检查点0** | 步骤0完成后 | 输入类型正确识别、技术上下文获取完整 | 重新分析输入 |
| **检查点1** | 步骤2完成后 | 方案已获得用户确认 | 等待用户确认 |
| **检查点2** | 步骤3完成后 | 代码完整、无语法错误、可编译/运行 | 修正后重新验证 |

---

## ✅ 检查点0: 输入分析验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤1！

### 检查清单

```yaml
checkpoint_0_validation:
  输入类型识别:
    - [ ] 输入类型已正确识别（api-design/code-comment/database-ddl/requirement/example-code/natural-language）
    - [ ] 若为混合输入，主类型已确定
    - [ ] 若为混合输入，辅助上下文已提取
    - [ ] 输入内容完整可解析
  
  技术上下文:
    - [ ] 技术上下文来源已确定（用户指定/知识库/示例/配置/默认）
    - [ ] 输出目标语言已确定（java/go/typescript/mysql/groovy）
  
  策略路由:
    - [ ] 已匹配到对应策略模块
    - [ ] 策略模块文档已加载
```

### 检查点0通过标准

```
✅ 通过条件:
  - 输入类型识别检查项全部通过
  - 技术上下文检查项全部通过
  - 策略路由检查项全部通过

❌ 不通过处理:
  1. 列出未通过的检查项
  2. 向用户确认模糊信息
  3. 重新执行输入分析
  4. 直到全部通过才能继续
```

---

## 步骤0: 输入分析与三维度判断

### 维度1: 输入内容形式 (INPUT_TYPE)

| 输入类型 | 识别特征 | 说明 |
|---------|---------|------|
| **api-design** | OpenAPI/Swagger/接口文档/paths/endpoints/接口描述/接口调用命令 | 已有接口设计，或可推断出接口设计 |
| **code-comment** | @param/@return/JavaDoc/TODO:实现 | 带详细注释的接口签名 |
| **database-ddl** | CREATE TABLE/ALTER TABLE/DDL | 数据库表结构 |
| **requirement** | 用户故事/PRD/需求文档/功能说明 | 原始需求 |
| **example-code** | 参考代码/模板代码/示例实现 | 参考实现 |
| **natural-language** | 口语化描述/简短指令/对话式输入 | 用户自然语言输入 |

### 混合输入处理

当输入包含多种类型时（如"帮我实现这个接口" + OpenAPI片段）：

**处理流程**:
1. **识别所有类型**: 列出输入中包含的所有类型
2. **确定主类型**: 按优先级判定主类型
3. **提取辅助上下文**: 其他类型作为生成时的参考信息
4. **路由到主类型策略**: 使用主类型对应的策略模块

**主类型判定优先级**（从高到低）:

| 优先级 | 类型 | 判定条件 |
|--------|------|---------|
| **1** | api-design | 包含完整的 OpenAPI/Swagger 结构 |
| **2** | database-ddl | 包含 CREATE TABLE/ALTER TABLE |
| **3** | code-comment | 包含带注释的接口/方法签名 |
| **4** | requirement | 包含结构化的需求文档/用户故事 |
| **5** | example-code | 包含完整的参考代码 |
| **6** | natural-language | 仅有口语化描述 |

**辅助上下文的作用**:

| 辅助类型 | 提供的上下文 |
|---------|-------------|
| natural-language | 用户意图、特殊要求、业务背景 |
| example-code | 代码风格、命名规范、实现模式 |
| requirement | 业务规则、边界条件、验收标准 |
| database-ddl | 数据模型、字段约束、表关系 |

### 维度2: 技术上下文 (TECH_CONTEXT)

**获取优先级（从高到低）**:

| 优先级 | 来源 | 获取方式 | 详情 |
|--------|------|---------|------|
| **1** | 用户明确指定 | 解析用户输入中的技术栈描述 | - |
| **2** | 知识库 | 读取 `.spec-code/memory/`，若没有，则搜索 kb、knowledge、knowledge base 等文件夹 | [知识库集成](shared/knowledge-base-integration.md) |
| **3** | 示例代码 | 分析参考文件或同模块代码 | [示例分析](shared/example-analysis.md) |
| **4** | 项目配置 | 解析 `pom.xml`/`go.mod`/`package.json` | [上下文检测](shared/context-detection.md) |
| **5** | 默认值 | 若以上都找不到，则明确询问用户，让用户补充输入 | - |

### 维度3: 输出目标 (OUTPUT_TARGET)

| 输出语言 | 典型产物 | 规范参考 |
|---------|---------|---------|
| **java** | Controller, Service, Mapper, Entity, DTO | [Java 规范](standards/java/) |
| **go** | Handler, Service, Model, Repository | [Go 规范](standards/go/) |
| **typescript** | Vue组件, Service, Types, Composables | [TypeScript 规范](standards/typescript/) |
| **mysql** | DDL, DML, 存储过程, 索引 | [MySQL 规范](standards/mysql/) |
| **groovy** | Gradle脚本, Spock测试 | [Groovy 规范](standards/groovy/) |

---

## 步骤1: 获取架构信息

### 1.1 从输入获取

解析需求/设计文档/上下文中的架构描述、知识库文件/文件夹

### 1.2 从知识库获取

```yaml
读取顺序:
  1. .spec-code/memory/context.md      # 技术栈、版本、架构
  2. .spec-code/memory/guidelines.md   # 编码规范、命名约定
  3. .spec-code/memory/constitution.md # 核心原则、约束
```

### 1.3 从代码获取

分析现有代码的目录结构、配置文件、依赖声明

### 1.4 从示例获取

分析参考代码的风格、命名、注释、异常处理模式

---

## 步骤2: 输出方案（等待确认）

> ⚠️ **必须等待用户确认后才能进入步骤3**

### 方案输出模板

```markdown
## 代码生成方案

### 技术栈
- **语言**: [语言版本]
- **框架**: [框架版本]
- **架构**: [架构模式]

### 架构信息来源
- [ ] 用户指定
- [ ] 知识库
- [ ] 示例代码
- [ ] 项目配置

### 将生成的文件
| 文件 | 职责 | 路径 |
|------|------|------|
| ... | ... | ... |

### 关键设计决策
- **命名规范**: ...
- **异常处理**: ...
- **日志策略**: ...

---
**确认以上方案后，我将开始生成代码。是否继续？**
```

---

## ✅ 检查点1: 方案确认验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤3！

### 检查清单

```yaml
checkpoint_1_validation:
  方案完整性:
    - [ ] 技术栈信息完整（语言/框架/版本）
    - [ ] 架构信息来源已标注
    - [ ] 文件清单完整（文件名/职责/路径）
    - [ ] 关键设计决策已说明
  
  用户确认:
    - [ ] 方案已展示给用户
    - [ ] 用户已明确确认（回复"是"/"继续"/"确认"等）
```

### 检查点1通过标准

```
✅ 通过条件:
  - 所有方案完整性检查项通过
  - 用户已明确确认

❌ 不通过处理:
  1. 如果方案不完整，补充缺失信息
  2. 如果用户未确认，等待用户响应
  3. 如果用户提出修改，调整方案后重新确认
  4. 直到用户确认才能继续
```

---

## 步骤3: 生成代码

### 3.1 按分层顺序生成

- Java: `Entity → DTO → Mapper → Service → Controller`
- Go: `Model → Repository → Service → Handler`
- TypeScript: `Types → API → Composables → Components`

### 3.2 应用编码规范

**通用规范（必须遵循）**:

| 规范 | 文档 |
|------|------|
| 日志规范 | [standards/common/logging.md](standards/common/logging.md) |
| 注释规范 | [standards/common/comments.md](standards/common/comments.md) |
| 安全规范 | [standards/common/security.md](standards/common/security.md) |
| 错误处理 | [standards/common/error-handling.md](standards/common/error-handling.md) |
| 命名规范 | [standards/common/naming.md](standards/common/naming.md) |
| 性能规范 | [standards/common/performance.md](standards/common/performance.md) |
| 可读性规范 | [standards/common/readability.md](standards/common/readability.md) |

**语言特有规范**: 根据 OUTPUT_TARGET 加载对应语言规范

### 3.3 质量验证

生成代码后，按检查清单验证

---

## ✅ 检查点2: 代码质量验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能标记任务完成！

### 检查清单

```yaml
checkpoint_2_validation:
  代码完整性:
    - [ ] 所有计划文件已生成
    - [ ] 所有 import 语句完整
    - [ ] 所有依赖类已引用
    - [ ] 代码结构完整（无截断）
  
  语法检查:
    - [ ] 无语法错误
    - [ ] 括号/引号匹配正确
    - [ ] 注解/装饰器使用正确
  
  编译/运行验证:
    Java:
      - [ ] mvn compile -DskipTests 成功
    Go:
      - [ ] go build ./... 成功
    TypeScript:
      - [ ] npm run build 或 tsc --noEmit 成功
    MySQL:
      - [ ] DDL 语法正确（可在数据库执行）
  
  规范检查:
    - [ ] 命名符合规范
    - [ ] 注释完整
    - [ ] 异常处理完善
    - [ ] 日志记录完整
```

### 检查点2通过标准

```
✅ 通过条件:
  - 所有代码完整性检查项通过
  - 所有语法检查项通过
  - 编译/运行验证通过
  - 规范检查项至少 80% 通过

❌ 不通过处理:
  1. 列出编译错误和语法错误
  2. 修正代码
  3. 重新执行验证
  4. 直到全部通过才能标记完成

验证命令:
  # Java
  mvn compile -DskipTests
  
  # Go
  go build ./...
  
  # TypeScript
  npm run build
  # 或
  npx tsc --noEmit
  
  # MySQL
  # 使用数据库客户端验证 DDL 语法
```

---

## 策略路由表

| INPUT_TYPE | OUTPUT_TARGET | 策略模块 |
|------------|---------------|---------|
| api-design | java | [java/from-api-design/](java/from-api-design/) |
| api-design | typescript | [typescript/from-api-design/](typescript/from-api-design/) |
| code-comment | java | [java/from-comment/](java/from-comment/) |
| code-comment | go | [go/from-comment/](go/from-comment/) |
| code-comment | groovy | [groovy/from-comment/](groovy/from-comment/) |
| database-ddl | java | [java/from-ddl/](java/from-ddl/) |
| requirement | mysql | [mysql/from-requirement/](mysql/from-requirement/) |
| java-entity | mysql | [mysql/from-entity/](mysql/from-entity/) |
| natural-language | java | [java/from-api-design/](java/from-api-design/) |
| natural-language | go | [go/from-comment/](go/from-comment/) |
| natural-language | typescript | [typescript/from-api-design/](typescript/from-api-design/) |
| natural-language | mysql | [mysql/from-requirement/](mysql/from-requirement/) |
| natural-language | groovy | [groovy/from-comment/](groovy/from-comment/) |

---

## ⚡ MySQL 简化流程

> **说明**: MySQL DDL 生成采用简化流程，跳过分层生成步骤。如已配置 `mysql-mcp-server`，可直接使用 MCP 执行 DDL。

### MySQL 专用流程

```
输入分析 → 应用命名规范 → 生成 DDL → 语法验证 → 完成
```

### 与标准流程的差异

| 项目 | 标准流程 | MySQL 简化流程 |
|------|---------|---------------|
| 分层生成 | Entity→DTO→Mapper→Service→Controller | 单一 DDL 文件 |
| 编译验证 | mvn/go/tsc | 数据库语法检查 |
| 检查点1 | 方案确认 | 可选（简单场景可跳过） |
| 检查点2 | 编译通过 | DDL 语法正确 |

### MySQL 输入类型

| INPUT_TYPE | 说明 | 输出 |
|------------|------|------|
| **requirement** | 业务需求/实体描述 | CREATE TABLE DDL |
| **java-entity** | Java Entity 类 | 反向生成 DDL |

### MySQL 检查清单

```yaml
mysql_validation:
  命名规范:
    - [ ] 表名小写下划线，t_ 前缀
    - [ ] 字段名小写下划线
    - [ ] 索引命名：pk_/uk_/idx_ 前缀
  
  DDL 结构:
    - [ ] 主键 BIGINT AUTO_INCREMENT
    - [ ] 包含公共字段（create_time/update_time/is_deleted）
    - [ ] 字段有 COMMENT
    - [ ] utf8mb4 字符集
  
  索引设计:
    - [ ] 主键索引
    - [ ] 唯一约束索引
    - [ ] 查询条件索引
```

### 规范参考

- [MySQL 命名规范](standards/mysql/naming.md)
- [MySQL DDL 规范](standards/mysql/ddl.md)
- [MySQL 索引规范](standards/mysql/index.md)
- [MySQL 最佳实践](standards/mysql/best-practices.md)

---

## 目录结构

```
code-generation/
├── SKILL.md                    # 本文件（主入口）
├── standards/                  # 编码规范体系
│   ├── common/                 # 通用规范
│   │   ├── logging.md
│   │   ├── comments.md
│   │   ├── security.md
│   │   ├── error-handling.md
│   │   ├── naming.md
│   │   ├── performance.md
│   │   └── readability.md
│   ├── java/                   # Java 规范
│   ├── go/                     # Go 规范
│   ├── typescript/             # TypeScript 规范
│   ├── mysql/                  # MySQL 规范
│   └── groovy/                 # Groovy 规范
├── java/                       # Java 策略模块
│   ├── from-api-design/
│   ├── from-comment/
│   ├── from-ddl/
│   └── reference.md
├── go/                         # Go 策略模块
│   ├── from-comment/
│   └── reference.md
├── typescript/                 # TypeScript 策略模块
│   ├── from-api-design/
│   └── reference.md
├── mysql/                      # MySQL 策略模块（简化流程）
│   ├── from-requirement/       # 从需求生成 DDL
│   ├── from-entity/            # 从 Java Entity 反向生成 DDL
│   └── reference.md
└── shared/                     # 共享资源
    ├── context-detection.md
    ├── knowledge-base-integration.md
    └── example-analysis.md
```

---

## 快速开始

复制此清单跟踪进度：

```
代码生成进度:
- [ ] 步骤0: 输入分析
  - [ ] 识别输入类型: ___________
  - [ ] 确定输出目标: ___________
  - [ ] 匹配策略模块: ___________
- [ ] ✅ 检查点0: 输入分析验证
  - [ ] 输入类型正确识别
  - [ ] 技术上下文获取完整
  - [ ] 策略路由匹配成功
- [ ] 步骤1: 获取架构信息
  - [ ] 知识库检测
  - [ ] 示例代码分析
  - [ ] 项目配置解析
- [ ] 步骤2: 输出方案
  - [ ] 技术栈确认
  - [ ] 文件清单确认
  - [ ] ⏳ 等待用户确认
- [ ] ✅ 检查点1: 方案确认验证
  - [ ] 方案完整
  - [ ] 用户已确认
- [ ] 步骤3: 生成代码
  - [ ] 按分层顺序生成
  - [ ] 应用编码规范
- [ ] ✅ 检查点2: 代码质量验证
  - [ ] 代码完整性检查通过
  - [ ] 语法检查通过
  - [ ] 编译/运行验证通过
  - [ ] 规范检查通过
```

---

## 常见场景

### 场景1: 从 API 设计生成 Java 后端

```
输入: OpenAPI 文档
输出: Controller/Service/Mapper/Entity/DTO
路由: java/from-api-design/
```

### 场景2: 从注释生成 Go 实现

```
输入: 带注释的 Go 接口
输出: Service 实现
路由: go/from-comment/
```

### 场景3: 从需求生成 MySQL DDL

```
输入: 业务需求描述
输出: CREATE TABLE 语句
路由: mysql/from-requirement/
```

### 场景4: 从 API 生成 Vue 前端

```
输入: 后端 API 文档
输出: Types/API/Composables/Components
路由: typescript/from-api-design/
```

### 场景5: 从自然语言生成代码

```
输入: "帮我写一个用户登录的接口，包含用户名密码验证"
输出: 根据输出目标生成对应代码
路由: 根据 OUTPUT_TARGET 动态路由
  - java → java/from-api-design/
  - go → go/from-comment/
  - typescript → typescript/from-api-design/
  - mysql → mysql/from-requirement/
```

---

## 常见错误

| 错误 | 正确做法 |
|------|----------|
| ❌ 跳过检查点直接进入下一步 | 每个检查点必须通过才能继续 |
| ❌ 未确认方案就开始生成代码 | 必须等待用户确认后才能生成 |
| ❌ 代码未验证就标记完成 | 必须通过检查点2（编译验证）后才能完成 |
| ❌ 忽略知识库上下文 | 优先从知识库获取技术栈信息 |
| ❌ 不遵循分层顺序生成 | 按 Entity→DTO→Mapper→Service→Controller 顺序 |
| ❌ 缺少异常处理 | 所有方法必须有完善的异常处理 |
| ❌ 缺少日志记录 | 关键操作必须有日志记录 |
| ❌ 命名不规范 | 严格遵循语言特有命名规范 |

---

## 版本历史

- **v2.1.0** (2025-12-22): 强化检查点机制，新增检查点0/1/2，更新检查清单
- **v2.0.0** (2025-12-22): 架构升级，整合 code-from-comment，新增知识库上下文、编码规范体系
- **v1.0.0**: 初始版本
