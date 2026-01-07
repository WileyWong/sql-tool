---
command_name: 设计阶段
description: 帮助用户完善设计，生成完整的开发指南
---

# Command: 帮助用户完善设计

> ⚠️ **必须遵守**: [通用规范索引](mdc:spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求
> ⚠️ **编写设计文档时应注意**: 深入理解项目现状和技术架构，为设计提供准确的技术上下文，少写一些繁琐泛泛的代码细节

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)

---

## 🎯 用途

作为**智能调度器**，通过系统化的调研和分析流程，根据设计需求类型自动选择最优的 Skills 组合来帮助用户完善技术设计。

**适用场景**:
- 从需求文档生成技术设计方案
- 为现有系统设计新功能模块
- 优化和重构现有设计
- 生成 API/数据库/架构设计文档
- 制定技术实施计划

**核心价值**:
- 🔍 深入调研现有架构，确保设计一致性
- 📐 系统化设计流程，覆盖架构到实现细节
- ✅ 强制验证机制，确保设计质量和可行性
- 🎯 智能匹配设计类型，自动选择最优工作流

---

## 📋 前置条件

在执行此 Command 前，请确保：

- [ ] 需求已明确（需求文档或清晰的功能描述）
- [ ] 技术栈已确定（或有明确偏好）
- [ ] 项目上下文已理解（如为现有项目设计）
- [ ] 必要的 Skills 可用

---

## 🔄 执行流程

### Phase 0: 项目调研 (MANDATORY)

**Objective**: 深入理解项目现状和技术架构，为设计提供准确的技术上下文

**MANDATORY STEPS**:

1. **MUST** 判断是否需要项目调研
   - **如果是现有项目新增功能/优化** → 执行完整调研
   - **如果是全新项目从零设计** → 轻量调研（只需技术栈调研）
   - **如果用户仅需设计建议** → 跳过调研

2. **MUST** 分析项目技术架构 - Use `项目记忆`和`项目知识库`
   - 识别项目技术栈和框架版本
   - 分析项目结构和模块划分
   - 识别核心配置和依赖
   - 识别现有的架构模式（MVC/DDD/微服务等）
   - **Verification**:
     - [ ] 技术栈版本已明确
     - [ ] 架构风格已识别
     - [ ] 核心模块已列出
     - [ ] 依赖关系已理解

3. **MUST** 分析现有设计 - Use `doc-analyze-code` skill
   - 分析现有代码架构和设计模式
   - 识别设计规范和编码风格
   - 评估代码质量和技术债务
   - 识别可复用的组件和服务
   - **Verification**:
     - [ ] 设计模式已识别
     - [ ] 编码规范已理解
     - [ ] 可复用组件已列出
     - [ ] 技术债务已标记

4. **MUST** 提取技术知识 - Use `doc-extract-knowledge` skill
   - 提取现有的技术决策和约束
   - 识别关键技术组件和中间件
   - 分析现有的 API 规范和数据模型
   - 识别性能和安全要求
   - **Verification**:
     - [ ] 技术约束已明确
     - [ ] 中间件清单已列出
     - [ ] API/数据库规范已理解
     - [ ] 非功能需求已识别

**Output**: 
- 技术架构理解（内部记录，不生成文档）
- 技术约束清单
- 可复用组件清单
- 设计规范要求

**🚪 Phase Gate 0**:
- [ ] 技术栈和架构已明确（如适用）
- [ ] 设计规范已理解（如适用）
- [ ] 技术约束已识别（如适用）
- [ ] 可复用组件已列出（如适用）
- [ ] 可以开始技术设计

**🚫 Red Flags - STOP if**:
- 项目架构过于复杂，需要专业架构师介入
- 现有设计严重违反最佳实践，需要重构而非新增
- 技术栈过时或有重大安全漏洞，需要升级
- 缺少必要的技术文档且代码无法理解

**Cannot proceed to Phase 1 without all checks passing.**

---

### Phase 1: 设计需求理解与场景判断 (MANDATORY)

**Objective**: 理解用户的设计需求，判断设计类型和范围

**MANDATORY STEPS**:

1. **MUST** 分析设计需求
   - 识别设计范围（全栈/后端/前端/数据库/架构）
   - 识别设计层次（概念设计/详细设计/实现设计）
   - 识别设计目标（新增功能/优化性能/重构/安全加固）
   - **Verification**:
     - [ ] 设计范围已明确
     - [ ] 设计层次已确定
     - [ ] 设计目标已理解

2. **MUST** 选择设计场景
   根据设计需求，选择以下场景（可多选）：
   
   **场景 A: 实体与领域建模** → 进入 Phase 2A
   - 设计需求：定义业务实体、领域模型、数据结构
   - 适用于：DDD 设计、业务建模、数据库设计前置
   
   **场景 B: 数据库设计** → 进入 Phase 2B
   - 设计需求：设计数据库表结构、索引、关系
   - 适用于：新增业务模块、数据库优化、迁移
   
   **场景 C: API 接口设计** → 进入 Phase 2C
   - 设计需求：设计 RESTful API、RPC 接口、消息队列
   - 适用于：前后端分离、微服务、第三方集成
   
   **场景 D: 业务流程设计** → 进入 Phase 2D
   - 设计需求：设计业务流程、状态机、工作流
   - 适用于：复杂业务逻辑、审批流程、订单处理
   
   **场景 E: 系统架构设计** → 进入 Phase 2E
   - 设计需求：设计系统架构、技术选型、部署方案
   - 适用于：新项目、架构升级、微服务拆分
   
   **场景 F: 功能详细设计** → 进入 Phase 2F
   - 设计需求：详细设计某个功能的实现方案
   - 适用于：复杂功能实现、技术难点攻克
   
   **场景 G: 任务规划** → 进入 Phase 2G
   - 设计需求：制定技术实施计划、任务拆解、排期
   - 适用于：项目启动、迭代规划

3. **MUST** 确定设计顺序
   - 如果多个场景都需要 → 按照依赖关系排序
   - 推荐顺序：A → D/B → C → F → G
   - **Verification**:
     - [ ] 设计场景已选择
     - [ ] 设计顺序已确定

**Output**: 设计场景和执行计划

**🚪 Phase Gate 1**:
- [ ] 设计需求已明确
- [ ] 设计场景已选择
- [ ] 设计顺序已确定
- [ ] 知道如何开始设计

**Cannot proceed without clear scenario selection.**

---

### Phase 2A: 实体与领域建模 (场景 A)

**Objective**: 基于 DDD 原则进行领域建模和实体设计

**MANDATORY STEPS**:

1. **MUST** 识别领域概念 - Use `techdesign-04-entity` skill
   - 识别业务实体（Entity）、值对象（Value Object）
   - 定义聚合根（Aggregate Root）和边界
   - 识别领域服务和领域事件
   - **Verification**:
     - [ ] 核心实体已识别
     - [ ] 聚合边界已划分
     - [ ] 值对象已定义
     - [ ] 领域事件已列出

2. **MUST** 定义实体属性和关系
   - 定义实体的属性和类型
   - 定义实体之间的关系（一对一/一对多/多对多）
   - 定义业务规则和约束
   - **Verification**:
     - [ ] 所有属性已定义
     - [ ] 关系已明确
     - [ ] 业务规则已列出

**Output**: 
- 领域模型图（如用户要求）
- 实体定义文档（如用户要求）
- 业务规则清单

**🚪 Phase Gate 2A**:
- [ ] 实体模型完整且准确
- [ ] 业务规则清晰
- [ ] 可以进行数据库设计

---

### Phase 2B: 数据库设计 (场景 B)

**Objective**: 设计符合规范的数据库表结构和索引策略

**MANDATORY STEPS**:

1. **MUST** 设计表结构 - Use `techdesign-05-database` skill
   - 根据实体模型设计表结构
   - 定义字段类型、长度、约束
   - 遵循项目数据库规范（如有）
   - 添加通用字段（created_at、updated_at 等）
   - **Verification**:
     - [ ] 所有表都已定义
     - [ ] 字段类型合理
     - [ ] 约束正确（主键/外键/唯一/非空）
     - [ ] 符合规范

2. **MUST** 设计索引策略
   - 为高频查询字段添加索引
   - 设计复合索引
   - 考虑索引对写入性能的影响
   - **Verification**:
     - [ ] 关键字段已添加索引
     - [ ] 复合索引设计合理
     - [ ] 索引数量适中

3. **MUST** 设计分区分表策略（如适用）
   - 评估数据量和增长速度
   - 设计分区键和分表规则
   - **Verification**:
     - [ ] 大表已考虑分区分表
     - [ ] 分区键选择合理

**Output**: 
- 数据库设计文档（DDL 语句）（如用户要求）
- ER 图（如用户要求）
- 索引策略说明

**🚪 Phase Gate 2B**:
- [ ] 表结构完整且符合规范
- [ ] 索引策略合理
- [ ] 满足性能要求
- [ ] 可以进行 API 设计

---

### Phase 2C: API 接口设计 (场景 C)

**Objective**: 设计符合 RESTful 规范的 API 接口

**MANDATORY STEPS**:

1. **MUST** 设计 API 端点 - Use `techdesign-06-api` skill
   - 根据功能需求定义 API 端点
   - 遵循 RESTful 规范（资源命名、HTTP 方法）
   - 定义请求参数和响应格式
   - 定义错误码和错误处理
   - **Verification**:
     - [ ] 所有端点已定义
     - [ ] 符合 RESTful 规范
     - [ ] 请求/响应格式明确
     - [ ] 错误处理完整

2. **MUST** 设计认证和授权
   - 定义认证方式（JWT/OAuth/API Key）
   - 定义权限控制规则
   - 设计安全策略（限流/防重放）
   - **Verification**:
     - [ ] 认证方案已确定
     - [ ] 权限规则已定义
     - [ ] 安全措施已考虑

3. **MUST** 设计 API 文档（如用户要求）
   - 生成 OpenAPI 3.0 规范
   - 提供示例请求和响应
   - **Verification**:
     - [ ] API 文档完整
     - [ ] 示例清晰

**Output**: 
- API 设计文档（OpenAPI 规范）（如用户要求）
- 接口清单
- 认证授权方案

**🚪 Phase Gate 2C**:
- [ ] API 设计完整且符合规范
- [ ] 认证授权方案可行
- [ ] 安全措施充分
- [ ] 可以进行详细设计

---

### Phase 2D: 业务流程设计 (场景 D)

**Objective**: 设计业务流程和状态机

**MANDATORY STEPS**:

1. **MUST** 梳理业务流程 - Use `techdesign-02-process` skill
   - 识别业务流程的关键节点
   - 定义状态和状态转换
   - 识别参与者和角色
   - 定义业务规则和异常处理
   - **Verification**:
     - [ ] 流程节点已定义
     - [ ] 状态转换清晰
     - [ ] 异常场景已考虑

2. **MUST** 设计流程图（如用户要求）
   - 绘制流程图或状态图
   - 标注关键决策点
   - **Verification**:
     - [ ] 流程图清晰易懂
     - [ ] 覆盖所有场景

**Output**: 
- 业务流程文档（如用户要求）
- 流程图/状态图（如用户要求）
- 业务规则清单

**🚪 Phase Gate 2D**:
- [ ] 业务流程完整
- [ ] 异常场景已覆盖
- [ ] 可以进行实现

---

### Phase 2E: 系统架构设计 (场景 E)

**Objective**: 设计系统的整体架构和技术方案

**MANDATORY STEPS**:

1. **MUST** 设计系统架构 - Use `techdesign-01-architecture` skill
   - 选择架构风格（单体/微服务/Serverless）
   - 进行技术选型（框架/中间件/数据库）
   - 设计模块划分和依赖关系
   - 设计部署架构和扩展策略
   - **Verification**:
     - [ ] 架构风格已确定
     - [ ] 技术选型已完成
     - [ ] 模块划分清晰
     - [ ] 部署方案可行

2. **MUST** 设计非功能需求实现
   - 性能优化方案（缓存/异步/分布式）
   - 安全防护方案（加密/防护/审计）
   - 可用性方案（容灾/备份/监控）
   - **Verification**:
     - [ ] 性能目标可达成
     - [ ] 安全措施充分
     - [ ] 可用性有保障

**Output**: 
- 系统架构文档（如用户要求）
- 架构图（如用户要求）
- 技术选型说明
- 部署方案

**🚪 Phase Gate 2E**:
- [ ] 架构设计合理
- [ ] 技术选型可行
- [ ] 非功能需求可满足
- [ ] 可以开始详细设计

---

### Phase 2F: 功能详细设计 (场景 F)

**Objective**: 详细设计功能的实现方案

**MANDATORY STEPS**:

1. **MUST** 设计功能实现 - Use `techdesign-03-feature` skill
   - 定义功能的输入输出
   - 设计实现流程和算法
   - 定义数据验证和边界条件
   - 设计错误处理和日志记录
   - **Verification**:
     - [ ] 输入输出已明确
     - [ ] 实现流程清晰
     - [ ] 边界条件已考虑
     - [ ] 错误处理完整

2. **MUST** 设计测试用例（如用户要求）
   - 设计单元测试用例
   - 设计集成测试用例
   - 设计边界和异常测试
   - **Verification**:
     - [ ] 测试用例覆盖主流程
     - [ ] 边界和异常已覆盖

**Output**: 
- 功能详细设计文档（如用户要求）
- 流程图/伪代码（如用户要求）
- 测试用例（如用户要求）

**🚪 Phase Gate 2F**:
- [ ] 功能设计完整
- [ ] 实现方案可行
- [ ] 测试策略明确
- [ ] 可以开始编码

---

### Phase 2G: 任务规划 (场景 G)

**Objective**: 制定技术实施计划和任务拆解

**MANDATORY STEPS**:

1. **MUST** 拆解实施任务 - Use `techdesign-07-delivery-planning` skill
   - 根据设计拆解开发任务
   - 识别任务依赖关系
   - 评估工作量和优先级
   - 制定实施时间表
   - **Verification**:
     - [ ] 任务粒度合理（1-3天）
     - [ ] 依赖关系清晰
     - [ ] 工作量评估合理
     - [ ] 时间表可行

2. **MUST** 识别风险和应对措施
   - 识别技术风险
   - 识别资源风险
   - 制定应对措施
   - **Verification**:
     - [ ] 主要风险已识别
     - [ ] 应对措施可行

**Output**: 
- 任务清单
- 实施计划（如用户要求）
- 风险清单和应对措施

**🚪 Phase Gate 2G**:
- [ ] 任务拆解完整
- [ ] 实施计划可行
- [ ] 风险已识别
- [ ] 可以开始执行

---

### Phase 3: 完整开发指南生成 (MANDATORY)

**Objective**: 在 `workspace/{变更ID}/` 下生成完整的开发指南文档，将所有设计文档和开发路径串联起来，让开发人员一目了然

**MANDATORY STEPS**:

1. **MUST** 扫描所有设计文档
   - 扫描 `workspace/{变更ID}/design/` 目录下所有文档
   - 提取每个文档的元数据（标题、描述、创建时间、技术栈、优先级）
   - 分析文档之间的依赖关系和顺序
   - **Verification**:
     - [ ] 所有设计文档已扫描
     - [ ] 文档元数据已提取
     - [ ] 依赖关系已分析

2. **MUST** 生成开发路径映射
   - 根据设计文档类型推导开发顺序
   - 推荐顺序：实体设计 → 数据库设计 → API 设计 → 业务流程 → 功能实现 → 任务规划
   - 识别关键开发路径和里程碑
   - 标注每个阶段的输入和输出
   - 标注代码结构映射（设计文档 → 代码文件）
   - **Verification**:
     - [ ] 开发顺序清晰合理
     - [ ] 关键路径已标注
     - [ ] 输入输出已明确
     - [ ] 代码映射关系清晰

3. **MUST** 生成完整开发指南 - `workspace/{变更ID}/README.md`
   
   **必须包含以下章节**:
   
   **3.1 变更概览**
   - 变更ID、标题、状态
   - 功能简介（1-2段）
   - 技术栈清单
   - 优先级和预估工作量
   
   **3.2 设计文档索引**（按类型分类）
   - 🏗️ 架构设计
   - 📊 数据库设计
   - 🔌 API 接口设计
   - 🔄 业务流程设计
   - 📐 实体与领域设计
   - ⚙️ 功能详细设计
   - 📋 任务规划与交付计划
   
   **3.3 开发路径地图** ⭐ **核心章节**
   
   格式示例：
   ```markdown
   ## 开发路径地图
   
   ### 开发顺序概览
   
   按照以下顺序进行开发，确保依赖关系正确：
   
   ```
   第一步：实体设计
   ├─ 文件: design/entity-design.md
   ├─ 说明: 定义核心业务实体和领域模型
   ├─ 输出: 实体类、VO、DTO 定义
   └─ 完成标准: 所有实体关系明确、属性完整
   
   第二步：数据库设计
   ├─ 文件: design/database-design.md
   ├─ 依赖: 第一步（实体设计）
   ├─ 说明: 根据实体设计创建数据库表结构
   ├─ 输出: DDL 建表语句、索引策略
   └─ 完成标准: 所有表创建完成、索引优化、符合规范
   
   第三步：API 接口设计
   ├─ 文件: design/api-design.yaml
   ├─ 依赖: 第一步（实体设计）、第二步（数据库设计）
   ├─ 说明: 设计 RESTful API 接口
   ├─ 输出: OpenAPI 规范、接口文档
   └─ 完成标准: 所有端点定义完整、请求响应格式明确
   
   第四步：业务流程实现
   ├─ 文件: design/process-design.md
   ├─ 依赖: 第二步（数据库设计）、第三步（API 设计）
   ├─ 说明: 实现核心业务流程和状态机
   ├─ 输出: Service 层代码、业务逻辑
   └─ 完成标准: 所有流程节点实现、异常处理完整
   
   第五步：功能详细实现
   ├─ 文件: design/feature-design.md
   ├─ 依赖: 第四步（业务流程）
   ├─ 说明: 实现具体功能细节和边界条件
   ├─ 输出: Controller、Util、Helper 代码
   └─ 完成标准: 所有功能实现、单元测试通过
   ```
   
   ### 关键开发里程碑
   
   - [ ] **里程碑 1**: 数据库表创建完成 → 可以开始数据层开发
   - [ ] **里程碑 2**: 实体和 Mapper 完成 → 可以开始 Service 层开发
   - [ ] **里程碑 3**: Service 层完成 → 可以开始 Controller 层开发
   - [ ] **里程碑 4**: API 接口完成 → 可以开始前端对接
   - [ ] **里程碑 5**: 单元测试完成 → 可以开始集成测试
   - [ ] **里程碑 6**: 集成测试完成 → 可以提交代码审查
   ```
   
   **3.4 代码结构映射**（从设计到代码的映射）
   
   格式示例：
   ```markdown
   ## 代码结构映射
   
   ### 后端代码结构（Spring Boot）
   
   ```
   src/main/java/
   ├── entity/                    # 对应: design/entity-design.md
   │   ├── User.java
   │   ├── Role.java
   │   └── Permission.java
   │
   ├── dto/                       # 对应: design/entity-design.md (DTO部分)
   │   ├── request/
   │   │   └── UserLoginRequest.java
   │   └── response/
   │       └── UserInfoResponse.java
   │
   ├── mapper/                    # 对应: design/database-design.md
   │   ├── UserMapper.java
   │   ├── RoleMapper.java
   │   └── PermissionMapper.java
   │
   ├── service/                   # 对应: design/process-design.md + feature-design.md
   │   ├── UserService.java
   │   ├── AuthService.java
   │   └── PermissionService.java
   │
   └── controller/                # 对应: design/api-design.yaml
       ├── UserController.java
       └── AuthController.java
   ```
   
   ### 数据库表结构
   
   ```
   database/
   ├── t_user                     # 对应: design/database-design.md (用户表)
   ├── t_role                     # 对应: design/database-design.md (角色表)
   ├── t_permission               # 对应: design/database-design.md (权限表)
   ├── t_user_role                # 对应: design/database-design.md (用户-角色关联表)
   └── t_role_permission          # 对应: design/database-design.md (角色-权限关联表)
   ```
   ```
   
   **3.5 开发检查清单**
   
   格式示例：
   ```markdown
   ## 开发检查清单
   
   ### 数据库开发
   - [ ] 所有表已创建（DDL 执行完成）
   - [ ] 所有索引已添加
   - [ ] 测试数据已插入
   - [ ] 数据库连接配置正确
   
   ### 实体层开发
   - [ ] 所有实体类已创建
   - [ ] 所有 DTO/VO 已创建
   - [ ] 实体关系映射正确（@OneToMany、@ManyToMany）
   - [ ] 字段验证注解已添加（@NotNull、@Size 等）
   
   ### Mapper 层开发
   - [ ] 所有 Mapper 接口已创建
   - [ ] 基础 CRUD 方法已定义
   - [ ] 自定义查询方法已实现
   - [ ] Mapper XML 配置正确（如使用 MyBatis）
   
   ### Service 层开发
   - [ ] 所有 Service 接口已创建
   - [ ] 所有 Service 实现已完成
   - [ ] 业务逻辑正确实现
   - [ ] 事务管理已配置
   - [ ] 异常处理已完善
   
   ### Controller 层开发
   - [ ] 所有 Controller 已创建
   - [ ] 所有 API 端点已实现
   - [ ] 请求参数验证已添加
   - [ ] 响应格式统一
   - [ ] 错误处理已完善
   
   ### 测试开发
   - [ ] 单元测试已编写
   - [ ] 集成测试已编写
   - [ ] 测试覆盖率 ≥ 80%
   - [ ] 所有测试通过
   ```
   
   **3.6 技术决策记录**（如适用）
   - 记录重要的技术选型和决策理由
   - 记录架构权衡和取舍
   
   **3.7 风险和注意事项**
   - 开发过程中的关键风险
   - 需要特别注意的技术难点
   - 性能优化建议
   
   **验证标准**:
   - [ ] README.md 已生成在 `workspace/{变更ID}/` 目录
   - [ ] 所有必须章节都已包含
   - [ ] 开发路径地图清晰完整
   - [ ] 代码结构映射准确
   - [ ] 开发检查清单完整可执行

4. **MUST** 验证开发指南完整性
   - 检查所有设计文档都已索引
   - 检查开发路径逻辑正确
   - 检查代码结构映射准确
   - 检查检查清单完整
   - **Verification**:
     - [ ] 所有设计文档已索引
     - [ ] 开发路径合理
     - [ ] 映射关系正确
     - [ ] 检查清单可执行

**Output**: 
- `workspace/{变更ID}/README.md` - 完整开发指南（一目了然的开发地图）

**🚪 Phase Gate 3**:
- [ ] README.md 已生成在正确位置
- [ ] 所有设计文档已索引
- [ ] 开发路径地图清晰
- [ ] 代码结构映射完整
- [ ] 开发检查清单可用
- [ ] 开发人员可以按照指南直接开始编码
- [ ] 可以进入最终验证

---

### Phase 3.5: 设计质量审查 (MANDATORY) ⭐ **新增**

**Objective**: 使用 design-reviewer Agent 自动审查设计质量，发现问题并优化，确保设计达标

**MANDATORY STEPS**:

1. **MUST** 调用 design-reviewer Agent 进行设计审查
   - **Agent**: [design-reviewer](mdc:agents/design-reviewer.md) - 基于 Evaluator-Optimizer 模式的设计审查 Agent
   - **触发时机**: Phase 3（完整开发指南生成）完成后
   - **审查范围**: `workspace/{变更ID}/design/` 目录下的所有设计文档
   - **审查维度**:
     - 完整性（所有必需元素都已定义）
     - 一致性（设计与项目规范、技术栈、现有架构一致）
     - 合理性（设计方案技术上合理）
     - 可实现性（设计可以直接指导开发）
   
2. **MUST** Agent 自动评估设计质量
   - **评估标准**: 
     - A 级（优秀）: 总分 ≥ 90，所有维度 ≥ 85
     - B 级（良好）: 总分 ≥ 80，所有维度 ≥ 70
     - C 级（合格）: 总分 ≥ 70，所有维度 ≥ 60
     - D 级（需改进）: 总分 < 70 或任一维度 < 60
   - **透明性**: Agent 会展示每个评估维度的检查结果和评分
   - **Verification**:
     - [ ] 所有设计文档都已评估
     - [ ] 评估报告清晰完整
     - [ ] 发现的问题都有具体描述

3. **MUST** Agent 自动优化设计（如发现问题）
   - **优化策略**: 
     - P0（必须修复）: 自动优化或交互式确认
     - P1（建议修复）: 自动优化或交互式确认
     - P2（可选优化）: 询问用户是否需要
   - **优化方式**:
     - 自动优化: 明显的规范性问题、简单的一致性问题
     - 交互式优化: 高风险变更、需要业务决策的问题
   - **Verification**:
     - [ ] 所有 P0 优化项已修复
     - [ ] 优化后的设计文档已更新
     - [ ] 优化操作有日志记录

4. **MUST** Agent 再评估验证优化效果
   - **再评估**: 优化后重新评估设计质量
   - **循环终止条件**:
     - 总分 ≥ 90 且所有维度 ≥ 85 → 通过，进入 Phase 4
     - 总分 ≥ 80 且所有维度 ≥ 70 → 询问用户是否接受
     - 总分 < 80 或任一维度 < 70 → 继续优化（最多 5 轮）
   - **Verification**:
     - [ ] 设计质量达标（A 级或用户接受 B 级）
     - [ ] 所有维度都通过最低标准
     - [ ] README.md 已更新（如适用）

5. **MUST** 生成设计审查报告
   - **报告内容**:
     - 初始评分 vs 优化后评分
     - 发现的问题和优化项
     - 修改的文件清单
     - 质量等级和结论
   - **报告位置**: 追加到 `workspace/{变更ID}/README.md` 的"设计审查记录"章节
   - **Verification**:
     - [ ] 审查报告已生成
     - [ ] 报告内容完整
     - [ ] README.md 已更新

**Output**: 
- 优化后的设计文档（原地修改）
- 设计审查报告（追加到 README.md）
- 质量评估结果

**🚪 Phase Gate 3.5**:
- [ ] 所有设计文档都已评估
- [ ] 设计质量达标（A 级或用户接受 B 级）
- [ ] 所有 P0 优化项已修复
- [ ] 审查报告已生成
- [ ] README.md 已更新
- [ ] 可以进入最终验证与交付阶段

**🔄 Agent 工作流程**（透明性）:
```
Step 1: 扫描设计文档目录
   ↓
Step 2: 评估设计质量（4 个维度）
   ↓
Step 3: 发现问题并生成优化项清单
   ↓
Step 4: 优化设计文档（自动 or 交互式）
   ↓
Step 5: 再评估验证优化效果
   ↓ [如果未达标，返回 Step 4]
Step 6: 更新 README.md，生成审查报告
   ↓
完成
```

**人工检查点**:
- **审查范围确认**: Agent 展示扫描到的设计文档，用户确认审查范围
- **高风险优化确认**: 架构性变更、性能权衡决策需要用户确认
- **质量等级确认**: 设计达到 B 级（≥ 80）时，询问用户是否接受

**Cannot proceed to Phase 4 without all checks passing.**

---

### Phase 4: 最终验证与交付 (MANDATORY)

**Objective**: 确保设计质量达标，交付给用户

**MANDATORY STEPS**:

1. **MUST** 执行最终验证
   - 检查所有 Phase Gates 是否通过
   - 验证设计的完整性和一致性
   - 检查是否符合技术规范
   - 确认用户需求已满足
   - 检查开发指南（README.md）完整性
   - **Verification**:
     - [ ] 所有 Phase Gates 通过
     - [ ] 设计完整且一致
     - [ ] 符合技术规范
     - [ ] 用户需求已覆盖
     - [ ] README.md 已生成且内容完整

2. **MUST** 与用户确认
   - 总结设计方案和关键决策
   - 说明技术选型理由
   - 说明潜在风险和应对措施
   - **重点说明开发指南（README.md）的位置和使用方法**
   - 询问是否需要调整或补充
   - **Verification**:
     - [ ] 用户已理解设计方案
     - [ ] 用户已确认满意

**Output**: 
- 完整的设计文档（如适用）
- **开发指南（workspace/{变更ID}/README.md）** - 核心输出
- 设计总结（口头说明，不生成文档）

**🚪 Phase Gate 4**:
- [ ] 所有验证通过
- [ ] 用户已确认
- [ ] Command 可以结束

---

## 📤 输出格式

### 输出目录规范

**MUST 遵循**: [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)

**核心规则**:
- **输出路径**: `workspace/{变更ID}/design/`
- **变更ID格式**: `YYYY-MM-DD-feature-name`
- **示例**: `workspace/2025-11-21-user-auth/design/`

**变更ID生成规则**:
- 日期格式: `YYYY-MM-DD`（创建日期）
- 功能名称: 小写字母 + 连字符
- 长度: 不超过 50 个字符
- 唯一性: 同一天内不能重复

**示例**:
- `workspace/2025-11-21-user-auth/design/database-design.md`
- `workspace/2025-11-21-user-auth/design/api-design.yaml`
- `workspace/2025-11-21-user-auth/design/architecture.md`
- `workspace/2025-11-21-user-auth/design/README.md`

### 不生成文档的情况
- 仅进行设计讨论和口头建议
- 仅提供设计建议，不形成文档

### 生成/修改文档的情况

**优先原地修改现有文档**:
- 如果项目已有设计文档 → 直接修改
- 如果用户明确要求生成文档 → 创建新文档到 `workspace/{变更ID}/design/`

**文档位置**（统一在变更ID目录下）:
- **开发指南** → `workspace/{变更ID}/README.md` ⭐ **核心输出**
- 架构设计 → `workspace/{变更ID}/design/architecture.md`
- 数据库设计 → `workspace/{变更ID}/design/database-design.md`
- API 设计 → `workspace/{变更ID}/design/api-design.yaml`
- 流程设计 → `workspace/{变更ID}/design/process-design.md`
- 实体设计 → `workspace/{变更ID}/design/entity-design.md`
- 功能详细设计 → `workspace/{变更ID}/design/feature-design.md`
- 任务规划 → `workspace/{变更ID}/design/task-planning.md`

---

## ✅ 验证清单

### 执行前验证
- [ ] 前置条件已满足
- [ ] 设计需求已明确

### Phase 0 验证（如适用）
- [ ] 技术架构已理解
- [ ] 设计规范已掌握
- [ ] 技术约束已识别
- [ ] 可复用组件已列出

### Phase 1 验证
- [ ] 设计范围已明确
- [ ] 设计场景已选择
- [ ] 设计顺序已确定

### Phase 2 验证（根据场景）
- [ ] 场景 A: 实体模型完整准确
- [ ] 场景 B: 数据库设计符合规范
- [ ] 场景 C: API 设计完整可行
- [ ] 场景 D: 业务流程清晰完整
- [ ] 场景 E: 系统架构合理可行
- [ ] 场景 F: 功能设计详细可实现
- [ ] 场景 G: 任务规划合理可执行

### Phase 3 验证
- [ ] README.md 已生成在 `workspace/{变更ID}/` 目录
- [ ] 所有设计文档已索引
- [ ] 开发路径地图清晰
- [ ] 代码结构映射完整
- [ ] 开发检查清单可用

### Phase 3.5 验证 ⭐ **新增**
- [ ] design-reviewer Agent 已执行
- [ ] 所有设计文档都已评估
- [ ] 设计质量达标（A 级或用户接受 B 级）
- [ ] 所有 P0 优化项已修复
- [ ] 设计审查报告已生成
- [ ] README.md 已更新（包含审查记录）

### Phase 4 验证
- [ ] 所有 Phase Gates 通过
- [ ] 设计完整且一致
- [ ] 符合技术规范
- [ ] 用户已确认满意

### 最终验证
- [ ] 设计方案完整
- [ ] 技术选型合理
- [ ] 文档格式正确（如适用）
- [ ] **开发指南（README.md）已生成且内容完整**
- [ ] 开发人员可以按照 README.md 直接开始编码
- [ ] 可以开始实施

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ 需求不明确，无法进行设计
- ❌ 技术选型与项目现状严重冲突
- ❌ 设计复杂度超出当前技术能力
- ❌ 性能/安全要求无法满足
- ❌ 现有架构需要重构而非新增
- ❌ 缺少关键技术信息（如数据库/框架版本）

**Action**: 
- 明确告知用户问题所在
- 提供具体的解决建议
- 建议用户补充信息或调整需求
- 如需要，建议寻求专业架构师支持

---

## 🔗 相关资源

### 核心 Agent
- [design-reviewer](mdc:agents/design-reviewer.md) - 设计审查 Agent（Evaluator-Optimizer 模式） ⭐ **Phase 3.5 使用**

### 核心 Skills
- [techdesign-04-entity](mdc:skills/techdesign-04-entity/SKILL.md) - 实体建模
- [techdesign-05-database](mdc:skills/techdesign-05-database/SKILL.md) - 数据库设计
- [techdesign-06-api](mdc:skills/techdesign-06-api/SKILL.md) - API 设计
- [techdesign-02-process](mdc:skills/techdesign-02-process/SKILL.md) - 流程设计
- [techdesign-01-architecture](mdc:skills/techdesign-01-architecture/SKILL.md) - 架构设计
- [techdesign-03-feature](mdc:skills/techdesign-03-feature/SKILL.md) - 功能设计
- [techdesign-07-delivery-planning](mdc:skills/techdesign-07-delivery-planning/SKILL.md) - 任务规划
- [doc-git-list](mdc:skills/doc-git-list/SKILL.md) - 项目结构分析
- [doc-extract-knowledge](mdc:skills/doc-extract-knowledge/SKILL.md) - 项目知识提取
- [doc-analyze-code](mdc:skills/doc-analyze-code/SKILL.md) - 代码分析
- [doc-index](mdc:skills/doc-index/SKILL.md) - 文档索引生成

### 相关 Commands
- [requirement.md](mdc:commands/spec-coding/requirement.md) - 需求阶段 Command

---

## 🎓 最佳实践

### 1. 充分调研现有架构

✅ **好的做法**:
```
用户: 为用户管理系统设计数据库
AI: 
1. 先分析现有项目架构 (doc-analyze-code)
2. 提取现有数据库规范 (doc-extract-proj-knowledge)
3. 确保新设计与现有架构一致
4. 复用现有组件和模式
```

❌ **不好的做法**:
```
AI: 直接设计数据库，忽略现有架构和规范
```

### 2. 按照依赖顺序设计

✅ **好的做法**:
```
设计顺序: 
实体建模 → 数据库设计 → API 设计 → 详细设计 → 任务规划
```

❌ **不好的做法**:
```
跳过实体建模，直接设计数据库
先设计 API，再倒推数据模型
```

### 3. 强制验证不妥协

✅ **好的做法**:
```
发现数据库设计不符合规范 → 停止，要求修正
发现架构选型有风险 → 停止，评估风险
```

❌ **不好的做法**:
```
发现问题也继续，留到后面解决
```

### 4. 设计文档优先原地修改

✅ **好的做法**:
```
项目已有 database-design.md → 直接修改此文件
用户要求生成新文档 → 创建新文档
```

❌ **不好的做法**:
```
总是创建新文档，导致文档冗余
```