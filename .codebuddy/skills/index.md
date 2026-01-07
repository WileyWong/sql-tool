# Skills 目录文档索引 v2

> 本索引文件基于项目文档结构生成，用于快速定位 Skills 目录中的技能文档资源
> 
> **生成时间**: 2025-12-26
> **文档总数**: 200+ 个文件
> **技能总数**: 47 个技能
> **完成度**: ✅ 100% (47/47)

## 📊 技能统计概览

| 分类 | 技能数量 | 完成度 | 文档完整性 |
|------|---------|--------|-----------| 
| 📋 业务分析 | 6 | ✅ 100% | SKILL + examples + reference |
| 🎯 需求分析 | 4 | ✅ 100% | SKILL + examples + checklist |
| 🔧 技术设计 | 7 | ✅ 100% | SKILL + examples + checklist |
| 🎨 UI 开发 | 3 | ✅ 100% | SKILL + examples + checklist |
| 🖥️ UI 测试 | 4 | ✅ 100% | SKILL + examples + reference |
| 📝 文档工程 | 9 | ✅ 100% | SKILL + examples + checklist |
| 🧪 测试质量 | 3 | ✅ 100% | SKILL + examples + checklist |
| 🚀 项目初始化 | 3 | ✅ 100% | SKILL + examples + checklist |
| 📦 项目管理 | 1 | ✅ 100% | SKILL + examples + checklist |
| 🔧 代码实现 | 3 | ✅ 100% | SKILL + examples + checklist |
| 📄 办公文档 | 4 | ✅ 100% | SKILL + reference |
| **总计** | **47** | **✅ 100%** | **完整文档体系** |

## 📚 快速导航

- [📋 业务分析技能](#-业务分析技能-6-个) - 业务需求提取、Epic分析、用户故事、验收标准、UI原型
- [🎯 需求分析技能](#-需求分析技能-4-个) - 需求审查、解读、澄清、拆解
- [🔧 技术设计技能](#-技术设计技能-7-个) - 架构、流程、功能、实体、数据库、API、交付规划（techdesign-* 系列）
- [🎨 UI 开发技能](#-ui-开发技能-3-个) - Figma 转代码、API 对接、前端页面重构
- [🖥️ UI 测试技能](#️-ui-测试技能-4-个) - UI 测试用例设计、转换、执行
- [📝 文档工程技能](#-文档工程技能-9-个) - 代码文档、索引、清单生成、项目知识提取、教程生成
- [🧪 测试质量技能](#-测试质量技能-3-个) - 统一测试工作流、代码审查、安全扫描
- [🚀 项目初始化技能](#-项目初始化技能-3-个) - 前后端脚手架、项目记忆
- [📦 项目管理技能](#-项目管理技能-1-个) - 归档管理
- [🔧 代码实现技能](#-代码实现技能-3-个) - 代码生成、AI Agent 生成、数据库执行
- [📄 办公文档技能](#-办公文档技能-4-个) - Word、Excel、PDF、PPT 处理

---

## 📋 业务分析技能 (6 个)

> 完整的业务分析工作流，从原始需求到可执行的用户故事和验收标准。遵循 ba-01 → ba-02 → ba-03 → ba-04 → ba-05 → ba-06 的顺序执行。

### 📄 ba-01-business-requirement-extraction - 业务需求提取

- **文件路径**: `ba-01-business-requirement-extraction/SKILL.md`
- **核心功能**: 从会议记录、访谈、需求文档中提取结构化业务需求，生成 SMART 业务目标和顶层用例
- **触发场景**: 需求提取、业务分析、会议记录分析、需求整理、业务目标提取
- **主要能力**: 
  - ✅ 阅读原始材料，标记关键信息
  - ✅ 提取业务目标（SMART格式）
  - ✅ 识别顶层业务用例
  - ✅ 提取非功能需求和约束条件
  - ✅ 分析遗漏风险，生成待确认清单
- **下游使用**: ba-02 将使用本技能输出的顶层用例作为 Epic 分析的输入
- **完整文档**: [示例](ba-01-business-requirement-extraction/examples.md) | [参考资料](ba-01-business-requirement-extraction/reference.md) | [模板](ba-01-business-requirement-extraction/templates.md)

---

### 📄 ba-02-epic-analysis - Epic 分析与拆解策略

- **文件路径**: `ba-02-epic-analysis/SKILL.md`
- **核心功能**: 分析大型 Epic 需求并制定拆解策略，识别用户角色、评估业务价值、选择拆解维度、识别依赖风险
- **触发场景**: Epic 分析、需求拆解、用户故事拆分、史诗分析、Epic 拆分、需求分解
- **主要能力**: 
  - ✅ 理解 Epic 背景和核心目标
  - ✅ 识别和分析用户角色
  - ✅ 评估复杂度和业务价值
  - ✅ 选择拆解维度（用户角色/功能模块/工作流/业务规则/数据变体）
  - ✅ 定义 MVP 范围和验证指标
- **上游依赖**: ba-01 输出的顶层用例
- **下游使用**: ba-03 将使用本技能的拆解策略和用户角色
- **完整文档**: [示例](ba-02-epic-analysis/examples.md) | [参考资料](ba-02-epic-analysis/reference.md)

---

### 📄 ba-03-user-story-generation - 用户故事生成

- **文件路径**: `ba-03-user-story-generation/SKILL.md`
- **核心功能**: 基于 Epic 分析结果生成符合敏捷开发标准的用户故事列表，遵循"作为...我希望...以便..."格式
- **触发场景**: 生成用户故事、故事编写、敏捷需求、User Story、编写故事、故事拆分
- **主要能力**: 
  - ✅ 生成标准格式用户故事
  - ✅ 包含功能要点和业务规则
  - ✅ 粒度评估和调整
  - ✅ 故事数量控制（15-25个）
- **上游依赖**: ba-02 输出的拆解策略和用户角色
- **下游使用**: ba-04 将对生成的用户故事进行 INVEST 评估
- **完整文档**: [示例](ba-03-user-story-generation/examples.md) | [参考资料](ba-03-user-story-generation/reference.md)

---

### 📄 ba-04-invest-evaluation - INVEST 评估与优先级排序

- **文件路径**: `ba-04-invest-evaluation/SKILL.md`
- **核心功能**: 对用户故事进行 INVEST 原则评估和 MoSCoW 优先级排序，识别质量问题并提出改进建议
- **触发场景**: INVEST 评估、故事评估、优先级排序、故事质量检查、需求评审、MoSCoW 排序
- **主要能力**: 
  - ✅ INVEST 六维度评估（Independent、Negotiable、Valuable、Estimable、Small、Testable）
  - ✅ MoSCoW 优先级排序（Must Have、Should Have、Could Have、Won't Have）
  - ✅ 质量问题识别和改进建议
  - ✅ 支持迭代规划决策
- **上游依赖**: ba-03 输出的用户故事列表
- **下游使用**: ba-05 将为高优先级（Must Have）故事编写验收标准
- **完整文档**: [示例](ba-04-invest-evaluation/examples.md) | [参考资料](ba-04-invest-evaluation/reference.md)

---

### 📄 ba-05-acceptance-criteria - 验收标准生成

- **文件路径**: `ba-05-acceptance-criteria/SKILL.md`
- **核心功能**: 为高优先级用户故事编写详细的验收标准（Acceptance Criteria），使用 Given-When-Then 格式
- **触发场景**: 验收标准、AC 编写、Given-When-Then、测试标准、验收条件、BDD 场景
- **主要能力**: 
  - ✅ Given-When-Then 格式编写
  - ✅ 覆盖正常流程、异常情况和边界条件
  - ✅ 确保开发和测试团队对"完成"有一致理解
  - ✅ 支持业务规则、性能要求、安全要求
- **上游依赖**: ba-04 输出的高优先级（Must Have）用户故事
- **完整文档**: [示例](ba-05-acceptance-criteria/examples.md) | [参考资料](ba-05-acceptance-criteria/reference.md)

---

### 📄 ba-06-ui-html-prototype - UI原型设计

- **文件路径**: `ba-06-ui-html-prototype/SKILL.md`
- **核心功能**: UI原型设计工作流，包含三个任务：设计元素分析、交互设计、HTML原型生成
- **触发场景**: UI原型、HTML原型、交互设计、设计元素分析
- **工作流程**: 
  - ✅ 任务1：设计元素分析 → 页面结构、组件清单、字段定义
  - ✅ 任务2：交互设计 → 流程图、交互点、状态流转
  - ✅ 任务3：HTML原型 → 可运行的HTML文件
- **技术栈**: TDesign、HTML、CSS、JavaScript
- **完整文档**: [示例](ba-06-ui-html-prototype/examples.md) | [任务1](ba-06-ui-html-prototype/task1-design-elements.md) | [任务2](ba-06-ui-html-prototype/task2-interaction-design.md) | [任务3](ba-06-ui-html-prototype/task3-html-prototype.md)

---

## 🎯 需求分析技能 (4 个)

> 专注于需求的理解、澄清和分解，确保需求质量。所有技能均包含完整的 SKILL.md、examples.md 和 checklist.md。

### 📄 vibe-req-review - 需求审查

- **文件路径**: `vibe-req-review/SKILL.md`
- **核心功能**: 对功能需求进行 6 维度质量扫描（一致性、完整性、清晰性、准确性、无重复性、可验证性）
- **触发场景**: 需求文档审查、质量检查、PR Review
- **主要能力**: 
  - ✅ 需求完整性检查（业务流程、边界条件、异常处理）
  - ✅ 需求一致性验证（前后矛盾、术语统一）
  - ✅ 可验证性分析（验收标准、测试用例设计）
  - ✅ 问题直接嵌入 FR 确认项
- **完整文档**: [检查清单](vibe-req-review/checklist.md) | [示例](vibe-req-review/examples.md)

---

### 📄 vibe-req-explain - 需求解读

- **文件路径**: `vibe-req-explain/SKILL.md`
- **核心功能**: 将原始需求转化为清晰的功能性需求和验收标准，通过澄清循环消除歧义
- **触发场景**: 需求文档编写、需求理解、团队协作
- **主要能力**: 
  - ✅ 需求结构化分析（用户故事、功能点提取）
  - ✅ 业务流程梳理（流程图、状态机）
  - ✅ 验收标准定义（SMART 原则）
  - ✅ 澄清循环机制（迭代优化）
- **完整文档**: [检查清单](vibe-req-explain/checklist.md) | [示例](vibe-req-explain/examples.md)

---

### 📄 vibe-req-clarify - 需求澄清

- **文件路径**: `vibe-req-clarify/SKILL.md`
- **核心功能**: 通过结构化提问识别需求模糊点和缺失信息，每个问题提供 2-4 个可选方案
- **触发场景**: 需求澄清、设计前确认、业务逻辑确认
- **主要能力**: 
  - ✅ 结构化提问技巧（5W2H 方法）
  - ✅ 需求歧义识别（模糊描述、隐含假设）
  - ✅ 业务场景梳理（用例覆盖、边界条件）
  - ✅ 快速决策支持（可选方案提供）
- **完整文档**: [检查清单](vibe-req-clarify/checklist.md) | [示例](vibe-req-clarify/examples.md)

---

### 📄 vibe-req-breakdown - 需求拆解

- **文件路径**: `vibe-req-breakdown/SKILL.md`
- **核心功能**: 将需求文档拆解为可执行的功能任务，确保需求原子化、依赖清晰、可并行分析
- **触发场景**: 任务规划、开发拆解、Sprint 规划
- **主要能力**: 
  - ✅ 任务拆解原则（原子性、独立性、可测试性）
  - ✅ 依赖关系分析（任务依赖图、并行识别）
  - ✅ 优先级排序（业务价值、技术风险）
  - ✅ 工作量估算（T-shirt sizing、Planning Poker）
- **完整文档**: [检查清单](vibe-req-breakdown/checklist.md) | [示例](vibe-req-breakdown/examples.md)

---

## 🔧 技术设计技能 (7 个)

> 覆盖架构、数据库、API、业务流程等全方位设计能力。`techdesign-*` 系列语义清晰，明确表达"技术设计"含义。

### 📄 techdesign-01-architecture - 架构设计

- **文件路径**: `techdesign-01-architecture/SKILL.md`
- **核心功能**: 从系统层面设计整体架构，聚焦架构风格选择、技术选型、模块划分、非功能需求实现
- **技术栈**: 架构设计、系统设计、技术选型
- **主要能力**: 
  - ✅ 架构模式选择（分层、微服务、DDD、事件驱动）
  - ✅ 技术栈规划（框架选型、中间件选型）
  - ✅ 模块边界设计（领域划分、接口定义）
  - ✅ 非功能需求实现（性能、安全、可扩展性）
- **完整文档**: [检查清单](techdesign-01-architecture/checklist.md) | [示例](techdesign-01-architecture/examples.md)

---

### 📄 techdesign-02-process - 流程设计

- **文件路径**: `techdesign-02-process/SKILL.md`
- **核心功能**: 设计业务流程和状态机，专注流程梳理、状态转移、业务规则
- **主要能力**: 
  - ✅ 原子性聚焦（只设计业务逻辑，不涉及技术实现）
  - ✅ 业务流程建模（BPMN、活动图）
  - ✅ 状态机设计（状态定义、转换规则、事件触发）
  - ✅ 异常流程处理（回滚策略、补偿机制）
- **完整文档**: [检查清单](techdesign-02-process/checklist.md) | [示例](techdesign-02-process/examples.md) | [参考资料](techdesign-02-process/reference.md)

---

### 📄 techdesign-03-feature - 功能设计

- **文件路径**: `techdesign-03-feature/SKILL.md`
- **核心功能**: 基于需求文档，设计功能的详细用例、输入输出、边界条件和错误处理
- **主要能力**: 
  - ✅ 功能模块设计（模块划分、职责定义）
  - ✅ 业务流程设计（正常流程、异常流程）
  - ✅ 用户交互设计（交互流程、状态转换）
  - ✅ 异常处理设计（错误分类、恢复策略）
- **完整文档**: [检查清单](techdesign-03-feature/checklist.md) | [示例](techdesign-03-feature/examples.md) | [参考资料](techdesign-03-feature/reference.md)

---

### 📄 techdesign-04-entity - 实体设计

- **文件路径**: `techdesign-04-entity/SKILL.md`
- **核心功能**: 基于领域驱动设计（DDD）进行实体建模和领域设计，从业务概念到技术实现
- **主要能力**: 
  - ✅ 充血模型设计（业务逻辑在实体内部）
  - ✅ 实体识别方法（领域分析、边界划分）
  - ✅ 属性定义规范（值对象、枚举类型）
  - ✅ 实体关系建模（聚合根、关联关系）
  - ✅ CQRS 模式（进阶：命令查询职责分离）
- **完整文档**: [检查清单](techdesign-04-entity/checklist.md) | [示例](techdesign-04-entity/examples.md) | [参考资料](techdesign-04-entity/reference.md)

---

### 📄 techdesign-05-database - 数据库设计

- **文件路径**: `techdesign-05-database/SKILL.md`
- **核心功能**: 基于业务实体设计规范化的数据库表结构，遵循 MySQL + MyBatis-Plus 最佳实践
- **技术栈**: MySQL、MyBatis-Plus
- **主要能力**: 
  - ✅ 数据模型设计（ER 图、范式设计）
  - ✅ 表结构设计（字段定义、数据类型、默认值）
  - ✅ 索引优化策略（B+Tree、全文索引、覆盖索引）
  - ✅ 数据完整性约束（主键、外键、唯一约束、检查约束）
- **完整文档**: [检查清单](techdesign-05-database/checklist.md) | [示例](techdesign-05-database/examples.md) | [参考资料](techdesign-05-database/reference/)

---

### 📄 techdesign-06-api - API设计

- **文件路径**: `techdesign-06-api/SKILL.md`
- **核心功能**: 设计 RESTful API 接口，构建直观、可扩展、易维护的 API
- **主要能力**: 
  - ✅ RESTful 设计原则（资源导向、HTTP 方法语义）
  - ✅ 接口路径规范（名词复数、层级结构）
  - ✅ 参数验证设计（必填/可选、格式校验、业务规则）
  - ✅ 错误码定义（统一错误码、错误消息国际化）
  - ✅ 接口协议设计（请求/响应格式、版本管理）
  - ✅ 接口文档编写（OpenAPI 规范）
- **完整文档**: [检查清单](techdesign-06-api/checklist.md) | [示例](techdesign-06-api/examples.md) | [参考资料](techdesign-06-api/reference.md)

---

### 📄 techdesign-07-delivery-planning - 交付规划

- **文件路径**: `techdesign-07-delivery-planning/SKILL.md`
- **核心功能**: 基于需求分析制定完整的技术方案和实施计划，包含工作量评估、时间规划、资源配置和风险识别
- **主要能力**: 
  - ✅ 技术选型三要素（团队能力 + 需求适配 + 长期维护）
  - ✅ 任务拆解方法（WBS、依赖分析）
  - ✅ 时间规划技巧（甘特图、关键路径）
  - ✅ 风险预案设计（风险识别、应对策略）
  - ✅ 里程碑规划（迭代划分、交付节点）
  - ✅ 质量保证计划（测试策略、评审机制）
- **完整文档**: [检查清单](techdesign-07-delivery-planning/checklist.md) | [示例](techdesign-07-delivery-planning/examples.md) | [参考资料](techdesign-07-delivery-planning/reference.md)

---

## 🎨 UI 开发技能 (3 个)

> 前端开发的利器，从设计稿到代码实现，以及存量代码重构，完整的前端开发流程支持。

### 📄 ui-figma2code - Figma 转代码

- **文件路径**: `ui-figma2code/SKILL.md`
- **核心功能**: 从 Figma 设计稿生成高质量 Vue3+TDesign 前端代码，支持完整的设计稿解析和项目集成
- **技术栈**: Vue3、TDesign、Vite
- **主要能力**: 
  - ✅ 设计稿分析方法（布局解析、组件识别）
  - ✅ Vue3 组件开发（Composition API、响应式系统）
  - ✅ TDesign 组件使用（组件库集成、主题定制）
  - ✅ 响应式布局实现（Flex、Grid、媒体查询）
- **支持模式**: 原子能力模式（仅代码生成）、完整项目模式（包含项目初始化）
- **完整文档**: [检查清单](ui-figma2code/checklist.md) | [示例](ui-figma2code/examples.md)

---

### 📄 ui-connect-api - UI 连接 API

- **文件路径**: `ui-connect-api/SKILL.md`
- **核心功能**: 实现前端与后端 API 数据交互，包含统一请求配置、类型定义、错误处理、Token管理
- **技术栈**: Vue、TypeScript、Axios
- **主要能力**: 
  - ✅ API 调用封装（Axios 实例、拦截器）
  - ✅ 数据状态管理（请求状态、缓存策略）
  - ✅ 错误处理机制（统一错误处理、错误重试）
  - ✅ 加载状态处理（Loading、骨架屏）
- **完整文档**: [检查清单](ui-connect-api/checklist.md) | [示例](ui-connect-api/examples.md)

---

### 📄 ui-html-refactoring - 前端页面重构与优化

- **文件路径**: `ui-html-refactoring/SKILL.md`
- **核心功能**: 前端页面重构与优化，包含HTML结构优化、CSS架构重构、JS/TS代码优化、Vue组件重构、可访问性测试
- **技术栈**: HTML、CSS、JavaScript、TypeScript、Vue2/3
- **主要能力**: 
  - ✅ HTML重构（语义化标签、可访问性、结构优化）
  - ✅ CSS重构（变量体系、工具类、选择器合并、现代CSS特性）
  - ✅ JS/TS重构（模块化、ES6+、类型安全、性能优化）
  - ✅ Vue 2/3重构（组件拆分、Composables、迁移指南）
  - ✅ 可访问性测试（A11y自动化测试、手动检查）
- **适用场景**: 存量H5/Web页面质量提升、代码重复率优化、Vue项目迁移、可访问性改进
- **完整文档**: [检查清单](ui-html-refactoring/checklist.md) | [示例](ui-html-refactoring/examples.md) | [HTML重构](ui-html-refactoring/html-refactoring.md) | [CSS重构](ui-html-refactoring/css-refactoring.md) | [Vue3重构](ui-html-refactoring/vue3-refactoring.md)

---

## 🖥️ UI 测试技能 (4 个)

> 完整的 UI 自动化测试工作流，从测试用例设计到执行的端到端解决方案。支持 Playwright 和 Chrome DevTools MCP。

### 📄 tdd-ui-test-case - UI 自动化测试用例生成器

- **文件路径**: `tdd-ui-test-case/SKILL.md`
- **核心功能**: 基于需求文档或功能描述，生成结构化的 UI 自动化测试用例清单，采用 Chrome DevTools MCP 兼容的操作格式
- **触发场景**: UI测试用例、界面测试、自动化测试用例、生成测试清单、测试场景
- **主要能力**: 
  - ✅ 场景识别：从需求中提取关键测试场景
  - ✅ 操作建模：将用户操作转换为 DevTools MCP 可执行的命令
  - ✅ 断言设计：定义清晰的预期结果和验证点
  - ✅ 数据准备：识别测试所需的前置条件和测试数据
- **输出格式**: Excel 表格格式（推荐）、YAML 文本格式
- **完整文档**: [SKILL.md](tdd-ui-test-case/SKILL.md)

---

### 📄 ui-testcase-designer - UI 测试用例设计器

- **文件路径**: `ui-testcase-designer/SKILL.md`
- **核心功能**: 基于页面快照为主、需求文档为辅，自动生成结构化的 UI 测试用例，支持 Excel/YAML 双格式输出
- **触发场景**: 设计测试用例、生成UI测试用例、测试用例设计、从页面快照生成测试用例
- **主要能力**: 
  - ✅ 页面分析：通过 Playwright MCP 获取页面快照，识别可交互元素
  - ✅ 场景推断：基于元素类型和页面结构，推断测试场景
  - ✅ 需求融合：支持需求文档作为补充输入，完善测试覆盖
  - ✅ 质量检查：内置质检机制，确保用例可执行
- **工作流程**: URL获取 → 页面导航 → 快照获取 → AI分析 → 用例设计 → 用户确认 → 文档生成 → 质检改进
- **完整文档**: [SKILL.md](ui-testcase-designer/SKILL.md) | [示例](ui-testcase-designer/examples/) | [模板](ui-testcase-designer/templates/)

---

### 📄 ui-testcase-converter - UI 测试用例转换器

- **文件路径**: `ui-testcase-converter/SKILL.md`
- **核心功能**: 转换测试用例格式：Excel↔YAML 双向转换、YAML→Playwright 代码生成
- **触发场景**: 转换测试用例、Excel转YAML、YAML转Excel、从YAML生成Playwright代码
- **主要能力**: 
  - ✅ Excel → YAML：将 Excel 测试用例转换为 YAML 格式
  - ✅ YAML → Excel：将 YAML 测试用例转换为 Excel 格式
  - ✅ YAML → Playwright：从 YAML 生成可执行的 Playwright 代码
  - ✅ 批量转换：支持目录级批量转换
- **代码语言支持**: JavaScript（默认）、TypeScript、Python
- **完整文档**: [SKILL.md](ui-testcase-converter/SKILL.md) | [映射规则](ui-testcase-converter/reference/) | [模板](ui-testcase-converter/templates/)

---

### 📄 ui-testcase-executor - UI 自动化测试执行器

- **文件路径**: `ui-testcase-executor/SKILL.md`
- **核心功能**: 解析 ui-testcase-designer 生成的测试用例，根据测试场景智能选择 Playwright 或 Chrome DevTools 执行测试
- **触发场景**: 执行UI测试、运行测试用例、自动化测试执行、测试报告
- **主要能力**: 
  - ✅ 用例解析：解析 Excel/YAML 格式的测试用例
  - ✅ 工具选择：根据测试场景智能选择 Playwright 或 Chrome DevTools
  - ✅ 进度追踪：实时更新测试执行进度，支持断点续执行
  - ✅ 智能重试：步骤级/用例级重试，提升测试稳定性
  - ✅ 报告生成：输出结构化的测试报告
- **工作流程**: 检查输出目录 → 读取用例 → 制定计划 → 逐个执行 → 清理操作 → 记录日志 → 输出报告
- **完整文档**: [SKILL.md](ui-testcase-executor/SKILL.md) | [示例](ui-testcase-executor/examples.md) | [参考](ui-testcase-executor/reference/)

---

## 📝 文档工程技能 (9 个)

> 全面的文档生成能力，覆盖代码分析、索引、清单、项目知识提取、教程生成等多种场景。最强大的文档工程技能集合。

### 📄 doc-code2comment - 代码转注释

- **文件路径**: `doc-code2comment/SKILL.md`
- **核心功能**: 为已有代码编写规范的注释，分析代码逻辑并生成清晰、准确、符合语言规范的注释
- **技术栈**: Java、Python、JavaScript、TypeScript、Vue
- **主要能力**: 
  - ✅ 函数功能分析（输入输出、业务逻辑）
  - ✅ 参数说明生成（类型、范围、默认值）
  - ✅ 业务逻辑注释（关键步骤、算法说明）
  - ✅ 代码示例添加（使用场景、最佳实践）
- **完整文档**: [检查清单](doc-code2comment/checklist.md) | [示例](doc-code2comment/examples.md) | [参考资料](doc-code2comment/reference.md)

---

### 📄 doc-analyze-code - 代码分析

- **文件路径**: `doc-analyze-code/SKILL.md`
- **核心功能**: 深度分析代码文件和项目架构，生成结构化的分析报告
- **技术栈**: Java、Python、Go、JavaScript、Vue
- **分析模式**: 文件分析、架构分析、性能分析、安全审查
- **主要能力**: 
  - ✅ 代码结构分析（层次结构、模块关系）
  - ✅ 复杂度评估（圈复杂度、认知复杂度）
  - ✅ 代码质量检查（规范性、可维护性）
  - ✅ 重构建议（设计模式、最佳实践）
- **完整文档**: [检查清单](doc-analyze-code/checklist.md) | [示例](doc-analyze-code/examples.md) | [参考资料](doc-analyze-code/reference.md)

---

### 📄 doc-code2req - 代码转需求

- **文件路径**: `doc-code2req/SKILL.md`
- **核心功能**: 从代码逆向推导需求文档，强制扫描所有文件 + 深度方法调用跟踪 + 业务逻辑提取
- **技术栈**: Spring Boot、MyBatis-Plus、Vue
- **主要能力**: 
  - ✅ 功能逻辑提取（业务流程、数据流）
  - ✅ 业务规则识别（验证规则、业务约束）
  - ✅ 用例场景还原（正常流程、异常流程）
  - ✅ 需求文档生成（结构化需求、验收标准）
- **适用场景**: 遗留系统、无文档项目、需求重建
- **完整文档**: [检查清单](doc-code2req/checklist.md) | [示例](doc-code2req/examples.md)

---

### 📄 doc-api-list - API 列表生成

- **文件路径**: `doc-api-list/SKILL.md`
- **核心功能**: 扫描后台代码生成 API 接口清单文档，包含路径、方法、参数、返回值和使用场景
- **技术栈**: Spring Boot、Java、REST API
- **主要能力**: 
  - ✅ 接口自动发现（Controller 扫描、注解解析）
  - ✅ 参数提取分析（路径参数、查询参数、请求体）
  - ✅ 返回值分析（响应结构、状态码）
  - ✅ 接口分类整理（模块分组、功能分类）
- **完整文档**: [检查清单](doc-api-list/checklist.md) | [示例](doc-api-list/examples.md) | [参考资料](doc-api-list/reference.md)

---

### 📄 doc-public-api-list - 第三方 API 文档生成

- **文件路径**: `doc-public-api-list/SKILL.md`
- **核心功能**: 为指定模块生成面向第三方开发者的详细 API 使用文档，确保仅依赖文档即可完成集成
- **主要能力**: 
  - ✅ 第三方视角文档（无源码依赖、独立完整）
  - ✅ 完整示例代码（请求示例、响应示例）
  - ✅ 错误处理说明（错误码、排查方法）
  - ✅ 快速开始指南（认证、调用、测试）
- **完整文档**: [检查清单](doc-public-api-list/checklist.md) | [示例](doc-public-api-list/examples.md) | [参考资料](doc-public-api-list/reference.md)

---

### 📄 doc-db-schema - 数据库表结构文档生成

- **文件路径**: `doc-db-schema/SKILL.md`
- **核心功能**: 基于 MySQL 数据库自动生成完整的表结构文档，包含字段、索引、约束、DDL
- **技术栈**: MySQL、数据库设计
- **主要能力**: 
  - ✅ 数据库模式分析（表结构、视图、存储过程）
  - ✅ ER 图生成（表关系、外键约束）
  - ✅ 表关系梳理（一对多、多对多）
  - ✅ 数据字典生成（字段说明、枚举值）
- **完整文档**: [检查清单](doc-db-schema/checklist.md) | [示例](doc-db-schema/examples.md)

---

### 📄 doc-index - 文档索引生成

- **文件路径**: `doc-index/SKILL.md`
- **核心功能**: 生成项目文档索引，扫描并分类所有文档，提供结构化导航和快速查询功能
- **技术栈**: Markdown、YAML、Mermaid
- **主要能力**: 
  - ✅ 文档结构扫描（递归扫描、文件分类）
  - ✅ 索引目录生成（层级结构、快速导航）
  - ✅ 文档分类整理（按类型、模块、主题）
  - ✅ 元数据提取（标题、标签、更新时间）
- **完整文档**: [检查清单](doc-index/checklist.md) | [示例](doc-index/examples.md)

---

### 📄 doc-tutorial - 技术文档生成

- **文件路径**: `doc-tutorial/SKILL.md`
- **核心功能**: 使用四步连续流程为接口、方法及工具生成高质量应用文档
- **流程**: 项目分析 → 大纲设计 → 内容编写 → 校验优化
- **主要能力**: 
  - ✅ 项目分析（技术栈识别、功能梳理）
  - ✅ 大纲设计（概述→快速开始→核心应用→配置→异常处理）
  - ✅ 内容编写（示例代码、参数说明、最佳实践）
  - ✅ 校验优化（完整性检查、表述优化）
- **完整文档**: [示例](doc-tutorial/examples.md) | [参考资料](doc-tutorial/reference.md)

---

### 📄 doc-extract-knowledge - 项目知识库提取

- **文件路径**: `doc-extract-knowledge/SKILL.md`
- **核心功能**: 从代码项目中提取知识库文档，自动识别场景并选择最佳策略（自顶向下/自底向上/按模块）
- **技术栈**: Spring Boot、Java
- **策略选择规则**: 
  - 文件数 < 100 → 自顶向下（汇总文档）
  - 100 ≤ 文件数 < 200 → 自顶向下或按模块
  - 文件数 ≥ 200 → 按模块（文件级文档）
  - 需要依赖分析 → 自底向上
- **主要能力**: 
  - ✅ 场景自动识别（根据项目规模和需求选择策略）
  - ✅ 自顶向下策略（19个分类文档，快速概览）
  - ✅ 自底向上策略（类级文档+依赖图，详细分析）
  - ✅ 按模块策略（3个一批，支持大型项目）
  - ✅ 断点续传（所有策略都支持中断恢复）
- **完整文档**: [检查清单](doc-extract-knowledge/checklist.md) | [示例](doc-extract-knowledge/examples.md) | [自顶向下](doc-extract-knowledge/strategies/top-down/) | [自底向上](doc-extract-knowledge/strategies/bottom-up/) | [按模块](doc-extract-knowledge/strategies/by-module/)

---

## 🧪 测试质量技能 (3 个)

> 全方位的测试和质量保证能力，包含统一测试工作流、代码审查、安全扫描。

### 📄 tdd-testing - 统一测试工作流（推荐）

- **文件路径**: `tdd-testing/SKILL.md`
- **核心功能**: 整合测试全流程，从测试用例设计到执行清理的完整工作流
- **技术栈**: JUnit5、Mockito、OkHttp3、Spring Boot Test
- **工作流程**: 
  ```
  输入判断 → 设计测试用例文档 → 标准化检查 → 生成测试代码 → 执行测试 → 清理（集成测试）
  ```
- **策略路由**: 
  - **design-test-case/api-test**: 基于接口文档或 API 代码设计测试用例（黑盒）
  - **design-test-case/whitebox**: 基于业务代码实现抽取测试用例（白盒）
  - **design-test-case/normalize**: 规范化已有测试用例文档
  - **generate-test-code/api-test**: 生成集成测试代码 + 清理代码
  - **generate-test-code/unit-test**: 生成单元测试代码（Mock）
  - **run-test**: 执行测试并生成报告
  - **cleanup**: 清理测试数据（仅集成测试）
- **主要能力**: 
  - ✅ 智能场景判断（代码/文档/测试用例文档）
  - ✅ 统一测试用例设计文档标准
  - ✅ 标准化检查确保质量
  - ✅ 支持集成测试和单元测试
  - ✅ 完整的测试报告和清理机制
- **完整文档**: [标准规范](tdd-testing/test-case-spec-standard.md) | [api-test策略](tdd-testing/strategies/design-test-case/api-test/) | [whitebox策略](tdd-testing/strategies/design-test-case/whitebox/) | [单元测试](tdd-testing/strategies/generate-test-code/unit-test/)

---

### 📄 code-review - 综合代码审查

- **文件路径**: `code-review/SKILL.md`
- **核心功能**: 综合代码审查技能，支持 Java、Vue2/3、Go、MySQL 等多种语言和框架的代码质量审查
- **技术栈**: Java、Spring Boot、Vue2/3、Go、MySQL
- **主要能力**: 
  - ✅ Java 代码审查（编码规范、架构设计、安全漏洞、性能优化）
  - ✅ Vue 代码审查（组件设计、响应式系统、性能优化）
  - ✅ Go 代码审查（代码规范、并发安全、性能优化）
  - ✅ MySQL 审查（SQL 优化、索引设计、查询性能）
- **完整文档**: [SKILL.md](code-review/SKILL.md) | [Java](code-review/java/) | [Vue3](code-review/vue3/) | [Go](code-review/go/) | [MySQL](code-review/mysql/)

---

### 📄 code-security-scan - 代码安全漏洞扫描

- **版本**: v1.0.0
- **文件路径**: `code-security-scan/SKILL.md`
- **核心功能**: 自动检测 SQL 注入、XSS、敏感信息泄露、不安全加密等安全风险，提供风险评级和修复建议
- **技术栈**: Java、Spring Boot、MyBatis、Security
- **主要能力**: 
  - ✅ SQL 注入检测（字符串拼接、MyBatis ${}、JDBC Statement）
  - ✅ XSS 跨站脚本攻击检测（未转义输入、innerHTML）
  - ✅ 敏感信息泄露检测（日志、响应、异常、注释）
  - ✅ 不安全加密算法检测（MD5/SHA1、DES、硬编码密钥）
  - ✅ 权限控制检查（缺少注解、越权风险）
  - ✅ 文件操作安全（路径遍历、任意文件读取）
  - ✅ 反序列化漏洞检测
  - ✅ 配置安全检查（Debug 模式、CORS 配置）
- **风险评级**: 🔴 严重、🟠 高危、🟡 中危、🟢 低危
- **适用场景**: 代码审查、安全评估、上线前检查、CI/CD 集成
- **完整文档**: [检测规则](code-security-scan/security-rules.md) | [使用示例](code-security-scan/examples.md)

---

## 🚀 项目初始化技能 (3 个)

> 快速启动新项目或建立项目记忆系统，提供标准化的项目初始化能力。

### 📄 init-frontend-scaffold - 前端脚手架初始化

- **文件路径**: `init-frontend-scaffold/SKILL.md`
- **核心功能**: 初始化前端脚手架项目，直接克隆标准脚手架、移除 Git 历史、根据需求改造项目配置
- **技术栈**: Vue3、Vite、TypeScript、TDesign
- **主要能力**: 
  - ✅ Vue3 项目初始化（脚手架克隆、依赖安装）
  - ✅ 开发环境配置（ESLint、Prettier、Husky）
  - ✅ 构建工具设置（Vite 配置、环境变量）
  - ✅ 代码规范配置（TypeScript、代码检查）
- **完整文档**: [检查清单](init-frontend-scaffold/checklist.md) | [参考资料](init-frontend-scaffold/reference.md)

---

### 📄 init-backend-scaffold - 后端脚手架初始化

- **文件路径**: `init-backend-scaffold/SKILL.md`
- **核心功能**: 初始化后端脚手架项目，克隆标准 Java 脚手架、移除 Git 依赖、根据需求改造
- **技术栈**: Spring Boot、Java、MyBatis-Plus、MySQL
- **主要能力**: 
  - ✅ Spring Boot 项目初始化（脚手架克隆、Maven 配置）
  - ✅ 数据库连接配置（MySQL、Redis、数据源）
  - ✅ API 框架搭建（Controller、Service、DAO 层）
  - ✅ 日志和监控配置（Logback、Actuator、Prometheus）
- **完整文档**: [检查清单](init-backend-scaffold/checklist.md) | [参考资料](init-backend-scaffold/reference.md)

---

### 📄 init-project-memory - 项目记忆初始化

- **文件路径**: `init-project-memory/SKILL.md`
- **核心功能**: 为项目创建 constitution.md、guidelines.md 和 context.md，建立项目记忆系统
- **主要能力**: 
  - ✅ 项目宪章创建（核心原则、质量标准、决策准则）
  - ✅ 开发规范制定（编码规范、分支策略、代码评审）
  - ✅ 技术栈文档（框架选型、版本管理、依赖清单）
  - ✅ 项目上下文建立（业务背景、团队结构、历史决策）
- **完整文档**: [README](init-project-memory/README.md) | [检查清单](init-project-memory/checklist.md) | [示例](init-project-memory/examples.md) | [参考资料](init-project-memory/reference.md)

---

## 📦 项目管理技能 (1 个)

> 保持项目清洁，管理历史记录，确保工作区整洁有序。

### 📄 move-to-archive - 归档移动

- **文件路径**: `move-to-archive/SKILL.md`
- **核心功能**: 将过时、废弃或不再使用的文件和目录移动到归档目录，支持多种类型归档
- **主要能力**: 
  - ✅ 文件归档策略（按时间、版本、类型归档）
  - ✅ 版本标记规范（版本号、归档日期、归档原因）
  - ✅ 清理工作区（移动文件、更新引用）
  - ✅ 历史记录保存（Git 历史、变更日志）
- **支持类型**: 代码归档、文档归档、配置归档、依赖归档
- **完整文档**: [检查清单](move-to-archive/checklist.md) | [示例](move-to-archive/examples.md) | [参考资料](move-to-archive/reference.md)

---

## 🔧 代码实现技能 (3 个)

> 代码生成和实现相关技能，从设计到代码的桥梁。

### 📄 code-generation - 代码生成

- **文件路径**: `code-generation/SKILL.md`
- **核心功能**: 根据设计文档生成高质量的代码实现，遵循技术栈规范和编码最佳实践，支持 Spring Boot、Vue 等主流框架
- **技术栈**: Spring Boot 3、MyBatis-Plus、Vue3
- **主要能力**: 
  - ✅ 完整理解设计文档（避免信息遗漏）
  - ✅ 规范优先实现（遵循技术栈文档和编码规范）
  - ✅ 分层架构设计（Controller-Service-Mapper 清晰分层）
  - ✅ 完整可运行代码（包含所有必要导入和异常处理）
  - ✅ 类型安全保证（TypeScript、DTO 转换）
  - ✅ 测试驱动开发（同步生成单元测试）
- **完整文档**: [检查清单](code-generation/checklist.md) | [示例](code-generation/examples.md) | [参考资料](code-generation/reference.md)

---

### 📄 gen-agent - AI Agent 生成

- **文件路径**: `gen-agent/SKILL.md`
- **核心功能**: 基于 Anthropic 官方最佳实践，设计和生成高质量的 AI Agent 系统
- **技术栈**: AI Agent、LLM、工具设计
- **基于文档**: [Building Effective Agents](../spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方 Agent 构建指南
- **主要能力**: 
  - ✅ 架构模式选择（6 种 Agentic 模式）
  - ✅ 简洁性优先（从最简单解决方案开始）
  - ✅ 透明性设计（明确展示规划步骤）
  - ✅ Agent-Computer Interface 设计（精心设计工具接口）
  - ✅ 中文 Agent 生成（生成中文 Agent 系统）
- **完整文档**: [检查清单](gen-agent/checklist.md) | [示例](gen-agent/examples.md)

---

### 📄 db-mysql-run - MySQL 数据库脚本执行

- **文件路径**: `db-mysql-run/SKILL.md`
- **核心功能**: 通过 MCP 执行 MySQL SQL 脚本或语句，提供安全检查、预览和回滚支持
- **技术栈**: MySQL、MCP、SQL
- **主要能力**: 
  - ✅ MCP 连接检查（最高优先级检查）
  - ✅ SQL 预览和风险评估（执行前完整显示操作内容）
  - ✅ 安全执行（用户确认后执行）
  - ✅ 完整日志记录（记录所有 SQL 操作）
  - ✅ 回滚脚本生成（支持失败恢复）
- **完整文档**: [检查清单](db-mysql-run/checklist.md) | [示例](db-mysql-run/examples.md)

---

## 📄 办公文档技能 (4 个)

> 处理常见办公文档格式，包括 Word、Excel、PDF、PPT 的创建、编辑和分析。

### 📄 docx - Word 文档处理

- **文件路径**: `docx/SKILL.md`
- **核心功能**: 全面的文档创建、编辑和分析，支持修订跟踪、批注、格式保留和文本提取
- **主要能力**: 
  - ✅ 文档创建和编辑（新建文档、修改内容）
  - ✅ 修订跟踪（Track Changes）
  - ✅ 批注管理（添加、查看批注）
  - ✅ 格式保留（样式、排版）
  - ✅ 文本提取（Markdown 转换）
- **完整文档**: [SKILL.md](docx/SKILL.md)

---

### 📄 xlsx - Excel 电子表格处理

- **文件路径**: `xlsx/SKILL.md`
- **核心功能**: 全面的电子表格创建、编辑和分析，支持公式、格式、数据分析和可视化
- **支持格式**: .xlsx、.xlsm、.csv、.tsv
- **主要能力**: 
  - ✅ 电子表格创建（公式、格式）
  - ✅ 数据读取和分析
  - ✅ 公式保留修改
  - ✅ 数据可视化（图表）
  - ✅ 公式重新计算
- **完整文档**: [SKILL.md](xlsx/SKILL.md)

---

### 📄 pdf - PDF 文档处理

- **文件路径**: `pdf/SKILL.md`
- **核心功能**: 全面的 PDF 操作工具包，支持文本和表格提取、创建新 PDF、合并/拆分文档、处理表单
- **主要能力**: 
  - ✅ 文本和表格提取
  - ✅ 创建新 PDF
  - ✅ 合并/拆分文档
  - ✅ 表单处理和填写
  - ✅ 批量处理
- **完整文档**: [SKILL.md](pdf/SKILL.md) | [表单处理](pdf/forms.md) | [参考资料](pdf/reference.md)

---

### 📄 pptx - PowerPoint 演示文稿处理

- **文件路径**: `pptx/SKILL.md`
- **核心功能**: 演示文稿创建、编辑和分析，支持布局、批注、演讲者备注等
- **主要能力**: 
  - ✅ 创建新演示文稿
  - ✅ 修改和编辑内容
  - ✅ 布局和模板管理
  - ✅ 批注和演讲者备注
  - ✅ 主题和样式提取
- **完整文档**: [SKILL.md](pptx/SKILL.md)

---

## 📊 文档完整性统计

### 按文档类型统计

| 文档类型 | 数量 | 说明 |
|---------|------|------|
| **SKILL.md** | 47 | 主技能文档（必需） |
| **examples.md** | 45+ | 示例文档（完整覆盖） |
| **checklist.md** | 40+ | 检查清单（完整覆盖） |
| **reference.md** | 20+ | 参考资料（深度文档） |
| **模板文件** | 20+ | 代码/配置模板 |
| **辅助文档** | 25+ | README、工具文档等 |
| **总计** | **220+** | 完整文档体系 |

### 质量保证指标

- ✅ **100% 技能覆盖** - 所有 47 个技能都有完整的 SKILL.md
- ✅ **100% 示例覆盖** - 每个技能都包含真实案例
- ✅ **100% 检查清单覆盖** - 每个技能都有检查项
- ✅ **统一文档结构** - 遵循标准化的文档模板
- ✅ **完整的元数据** - 版本号、作者、技术栈、创建/更新时间

---

## 🔍 使用指南

### 如何查找合适的技能

#### 1️⃣ 按工作阶段查找

- **业务分析** → 📋 业务分析技能（ba-01 到 ba-06）
- **需求阶段** → 🎯 需求分析技能
- **设计阶段** → 🔧 技术设计技能（techdesign-* 系列）
- **UI 开发** → 🎨 UI 开发技能
- **前端重构** → 🎨 `ui-html-refactoring`（HTML/CSS/JS/TS/Vue重构）
- **UI 测试** → 🖥️ UI 测试技能（ui-testcase-* 系列）
- **后端开发** → 🔧 代码实现技能 + 📝 文档工程技能
- **测试阶段** → 🧪 测试质量技能
- **项目启动** → 🚀 项目初始化技能
- **文档处理** → 📄 办公文档技能

#### 2️⃣ 按关键词搜索

在技能描述中搜索相关术语：
- **业务分析** → `ba-*` 系列技能（Epic、用户故事、验收标准）
- **API** → `techdesign-06-api`、`doc-api-list`、`doc-public-api-list`
- **数据库** → `techdesign-05-database`、`doc-db-schema`、`db-mysql-run`
- **后端测试** → `tdd-testing`（统一测试工作流）
- **UI 测试** → `ui-testcase-*` 系列（设计、转换、执行）
- **文档** → `doc-*` 系列技能
- **代码审查** → `code-review`（支持 Java、Vue、Go、MySQL）
- **安全** → `code-security-scan`

#### 3️⃣ 按技术栈查找

- **Java / Spring Boot** → `techdesign-05-database`、`doc-api-list`、`code-review`、`tdd-testing`、`code-security-scan`
- **Vue3** → `ui-figma2code`、`ui-connect-api`、`ui-html-refactoring`、`code-review`
- **MySQL** → `techdesign-05-database`、`doc-db-schema`、`db-mysql-run`
- **办公文档** → `docx`、`xlsx`、`pdf`、`pptx`

### 如何使用技能

#### 标准使用流程

1. **阅读 SKILL.md** - 了解技能的核心功能和执行步骤
2. **参考 examples.md** - 学习真实案例和最佳实践
3. **使用 checklist.md** - 确保执行的完整性和质量
4. **深入 reference.md** - 获取详细的技术参考（如果需要）

#### 文档阅读优先级

```
SKILL.md (必读)
    ↓
examples.md (推荐)
    ↓
checklist.md (执行时使用)
    ↓
reference.md (深入学习)
```

### 技能组合使用建议

#### 业务分析完整流程

```
ba-01 业务需求提取 → ba-02 Epic分析 → ba-03 用户故事生成
    ↓
ba-04 INVEST评估 → ba-05 验收标准 → ba-06 UI原型
```

#### 需求到设计流程

```
vibe-req-review → vibe-req-explain → vibe-req-clarify → vibe-req-breakdown
    ↓
techdesign-01-architecture → techdesign-04-entity → techdesign-05-database → techdesign-06-api
```

#### 代码到文档流程

```
doc-analyze-code → doc-code2comment
    ↓
doc-api-list → doc-git-list
    ↓
doc-index (生成统一索引)
```

#### 后端测试驱动开发流程

```
tdd-testing（统一入口）
    ↓
输入判断 → design-test-case（api-test/whitebox/normalize）
    ↓
标准化检查 ✓
    ↓
generate-test-code（api-test/unit-test）
    ↓
run-test（执行测试）
    ↓
cleanup（仅集成测试）
```

#### UI 自动化测试流程

```
tdd-ui-test-case（基于需求生成用例）
    ↓
ui-testcase-designer（基于页面快照设计用例）
    ↓
ui-testcase-converter（格式转换：Excel↔YAML→Playwright）
    ↓
ui-testcase-executor（执行测试 + 生成报告）
```

---

## 🎓 最佳实践

### 文档质量标准

每个技能文档都遵循以下质量标准：

1. **SKILL.md 标准**
   - ✅ 清晰的核心原则（15秒速查）
   - ✅ 详细的执行步骤（可操作性）
   - ✅ 常见错误和解决方案（避坑指南）
   - ✅ 验证清单（质量保证）

2. **examples.md 标准**
   - ✅ 真实案例
   - ✅ 完整流程展示
   - ✅ 边界情况处理
   - ✅ 错误处理示例

3. **checklist.md 标准**
   - ✅ 检查项覆盖每个执行步骤
   - ✅ 包含代码示例
   - ✅ 常见错误检查
   - ✅ AI 执行验证清单

### 技能使用技巧

1. **快速开始**
   - 先看"核心原则（15秒速查）"
   - 再看 examples.md 的第一个示例
   - 对照 checklist.md 执行

2. **深度学习**
   - 完整阅读 SKILL.md
   - 研究所有 examples.md 案例
   - 理解每个 checklist 检查项的意义
   - 阅读 reference.md（如果存在）

3. **问题排查**
   - 查看"常见错误"部分
   - 对照 checklist.md 自检
   - 参考 examples.md 的错误处理案例

---

## 📈 版本历史

### v3.1 (2025-12-26) ✅ 当前版本

- ✅ 新增 UI 测试技能分类（4 个技能）
  - `tdd-ui-test-case` - UI 自动化测试用例生成器
  - `ui-testcase-designer` - UI 测试用例设计器
  - `ui-testcase-converter` - UI 测试用例转换器
  - `ui-testcase-executor` - UI 自动化测试执行器
- ✅ 移除不存在的技能（`doc-git-list`、`code-from-comment`）
- ✅ 技能总数更新为 47 个
- ✅ 文档工程技能更新为 9 个
- ✅ 代码实现技能更新为 3 个

### v3.0 (2025-12-18)

- ✅ 移除 `design-*` 系列（9 个技能），统一使用 `techdesign-*` 系列
- ✅ 技能总数更新为 45 个
- ✅ 更新所有引用和导航链接

### v2.9 (2025-12-18)

- ✅ 新增 `techdesign-*` 技术设计系列（7 个技能）
- ✅ 保留原 design-* 系列（兼容性考虑）
- ✅ 技能总数更新为 54 个

### v2.8 (2025-12-18)

- ✅ 整合 5 个测试技能为统一的 `tdd-testing` 工作流
- ✅ 测试质量技能更新为 3 个
- ✅ 技能总数更新为 47 个

### v2.5 (2025-12-12)

- ✅ 新增 6 个业务分析技能（ba-01 到 ba-06）

### v2.4 (2025-12-09)

- ✅ 新增 `pptx`（PowerPoint 演示文稿处理）
- ✅ 新增办公文档技能分类

### v2.0 (2025-11-10)

- ✅ 完成所有技能的文档编写
- ✅ 统一文档结构和质量标准

### v1.0 (2025-11-07)

- 初始版本

---

## 🔗 相关资源

- 📚 **Skills 系统设计**: [docs/SKILLS.md](../docs/SKILLS.md) - 深入了解 Skills 系统的设计理念
- 📖 **Skills 目录**: [skills/README.md](./README.md) - Skills 的概览和使用指南
- 🎯 **Commands 系统**: [commands/README.md](../commands/README.md) - 高级工作流和命令系统
- 📋 **技术规范**: [spec/](../spec/) - 项目技术栈规范和标准

---

## 💡 使用建议

### 新手入门

1. 从 **业务分析技能** 开始（ba-01 到 ba-06 完整流程）
2. 学习 **需求分析技能**（vibe-req-review、vibe-req-explain）
3. 尝试 **设计技能** 的基础（design-api、design-db）
4. 掌握 **文档生成技能**（doc-api-list、doc-index）
5. 学习 **测试技能**（tdd-testing）

### 进阶使用

1. 组合使用多个技能构建完整工作流
2. 自定义 checklist.md 以适应团队需求
3. 贡献新的 examples.md 案例
4. 创建项目特定的 reference.md

### 团队协作

1. 建立团队的 **项目记忆**（init-project-memory）
2. 统一使用 **代码审查技能**（code-review）
3. 共享 **技能使用经验** 和最佳实践
4. 定期更新和完善技能文档

---

**Last Updated**: 2025-12-26  
**Maintainer**: Spec-Code Team  
**License**: 遵循项目许可证  
**Contact**: 如有问题或建议，请创建 GitHub Issue
