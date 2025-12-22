# 通用开发标准与规范

## 📋 概述

本目录包含了完整的开发标准与规范文档，用于指导开发人员编写高质量、规范化的代码。

**涵盖领域**: 通用规范、后端开发、前端开发

**核心原则**:
- **一致性**: 所有项目遵循统一的开发标准
- **可维护性**: 标准化的代码易于维护和协作
- **高质量**: 规范化的开发流程保障代码质量
- **可扩展性**: 标准支持项目演进和技术栈升级

---

## 📁 目录结构

```
standards/
├── index.md                     # 规范文档索引(详细版)
├── README.md                    # 本文件(使用指南)
├── common/                      # 通用规范 (2个文档, ~836行)
│   ├── document-generation-rules.md  # ⭐ 文档生成原则(必须遵守)
│   └── output-directory-standard.md  # ⭐ 输出目录规范(必须遵守)
├── backend/                     # 后端规范 (6个文档, ~3,152行)
│   ├── api.md                   # API 设计规范(统一响应、校验、异常)
│   ├── structure.md             # 后端目录结构规范(Java/Node.js/Python)
│   └── common/                  # 通用后端规范 (4个文档)
│       ├── database.md          # 数据库设计规范(表设计、索引、软删除)
│       ├── database-fields.md   # 数据库字段规范(标准字段、审计字段)
│       ├── index-design-guide.md    # 索引设计指南(核心原则、常见场景)
│       └── design-decisions.md  # 设计决策指南(外键、分库分表)
└── frontend/                    # 前端规范 (3个文档, ~270行)
    ├── structure.md             # 前端目录结构规范(Vue 3)
    ├── api.md                   # 前端接口调用规范(Axios封装)
    └── i18n.md                  # 前端多语言规范(vue-i18n)
```

**文档统计**:
- **标准文档**: 11个 (~4,258行)
- **索引文档**: 2个 (index.md + README.md)
- **文档总计**: 15个文件

---

## 🚀 快速开始

### 1️⃣ 必读标准 (P0 - 最高优先级)

#### 📄 文档生成原则 ⭐⭐⭐
- **文件**: [common/document-generation-rules.md](common/document-generation-rules.md)
- **规模**: ~200行
- **核心规则**:
  - ❌ 禁止主动生成文档(不生成汇总、报告、总结)
  - ✅ 只在明确要求时生成
  - ✅ 精简直接回答,避免冗长输出
  - ✅ 原地修改优先,不创建新文件
- **快速检查**:
  - [ ] 完成任务后是否生成了总结文档? → 应该删除
  - [ ] 分析代码后是否生成了分析报告? → 应该删除
  - [ ] 是否在用户未明确要求时生成文档? → 违反规范

---

#### 📄 输出目录规范 ⭐⭐⭐
- **文件**: [common/output-directory-standard.md](common/output-directory-standard.md)
- **规模**: ~636行
- **核心规则**:
  - 变更ID生成: `YYYY-MM-DD-feature-name`
  - 输出路径: `workspace/{变更ID}/{阶段}/{文件名}`
  - YAML Frontmatter必须包含: change_id、document_type、stage等
- **快速检查**:
  - [ ] 所有输出都在 `workspace/{变更ID}` 下?
  - [ ] 按6个阶段分类(requirements/design/planning/implementation/documentation/deployment)?
  - [ ] 所有文件都有YAML头部?

---

### 2️⃣ 数据库设计标准 (P1 - 核心标准)

#### 📄 数据库设计规范
- **文件**: [backend/common/database.md](backend/common/database.md)
- **规模**: ~492行
- **核心内容**:
  - 表设计规范(命名、字段类型、必备字段)
  - 索引设计规范(类型、原则、常见场景)
  - 软删除规范(delete_time字段)
- **快速检查**:
  - [ ] 表名使用小写+下划线、复数形式?
  - [ ] 所有表都有id、create_time、update_time?
  - [ ] 高频查询字段都有索引?
  - [ ] 所有字段都有COMMENT?

---

#### 📄 数据库字段规范
- **文件**: [backend/common/database-fields.md](backend/common/database-fields.md)
- **规模**: ~600+行
- **核心内容**:
  - 标准字段定义(主键、时间、审计、状态)
  - 4种字段组合方案(简单表、审计表、日志表、工作流表)
  - 查询示例和索引设计
- **快速检查**:
  - [ ] 使用标准字段名(create_time而非createTime)?
  - [ ] 审计字段都有(create_by、update_by)?
  - [ ] 状态字段使用TINYINT?

---

#### 📄 索引设计指南
- **文件**: [backend/common/index-design-guide.md](backend/common/index-design-guide.md)
- **规模**: ~500+行
- **核心原则**:
  - 原则1: 最左前缀原则(复合索引)
  - 原则2: 高选择性优先(>10%)
  - 原则3: 避免冗余索引
- **8种常见场景**: 单字段、多字段、等值+范围、排序、分页、模糊、IN、复杂查询
- **快速检查**:
  - [ ] 复合索引字段顺序正确(等值→范围→排序)?
  - [ ] 没有重复或包含关系的索引?
  - [ ] 使用EXPLAIN分析查询计划?

---

#### 📄 设计决策指南
- **文件**: [backend/common/design-decisions.md](backend/common/design-decisions.md)
- **规模**: ~450+行
- **核心决策**:
  - 决策1: 不使用显式外键约束(性能考虑)
  - 决策2: 只在必要时分库分表(优化优先级)
- **替代方案**: 索引优化 → 查询优化 → 缓存 → 读写分离 → 分库分表
- **快速检查**:
  - [ ] 是否过早考虑分库分表?
  - [ ] 是否先尝试了索引和缓存优化?

---

### 3️⃣ API设计标准 (P1 - 核心标准)

#### 📄 API设计规范
- **文件**: [backend/api.md](backend/api.md)
- **规模**: ~660行
- **核心内容**:
  - 统一响应格式(Result<T>)
  - 参数校验(@NotNull、@NotBlank等)
  - 异常处理(业务异常、系统异常)
  - 数据脱敏(手机号、身份证等)
  - 并发控制(分布式锁)
- **快速检查**:
  - [ ] 所有响应都用Result<T>?
  - [ ] 所有请求参数都有校验注解?
  - [ ] 有全局异常处理器?
  - [ ] 敏感信息有脱敏?

---

### 4️⃣ 目录结构标准 (P2 - 重要标准)

#### 📄 后端目录结构
- **文件**: [backend/structure.md](backend/structure.md)
- **规模**: ~450+行
- **支持技术栈**: Java/Spring Boot、Node.js/Nest.js、Python/FastAPI
- **核心分层**: Controller/API → Service → Repository → Database

---

#### 📄 前端目录结构
- **文件**: [frontend/structure.md](frontend/structure.md)
- **规模**: ~80行
- **支持技术栈**: Vue 3
- **核心目录**: components/、views/、router/、stores/、api/、utils/

---

### 5️⃣ 前端开发标准 (P2 - 重要标准)

#### 📄 前端接口调用规范
- **文件**: [frontend/api.md](frontend/api.md)
- **规模**: ~120行
- **核心内容**: Axios封装、请求拦截、响应处理、API模块化

---

#### 📄 前端多语言规范
- **文件**: [frontend/i18n.md](frontend/i18n.md)
- **规模**: ~70行
- **核心内容**: vue-i18n配置、语言文件组织、组件中使用

---

---

## 📚 标准与规范文档清单

### 📊 文档统计

| 分类 | 文档数 | 总行数 | 平均行数 | 主要内容 |
|------|--------|--------|----------|----------|
| 通用规范 | 2 | ~836 | 418 | 文档生成原则、输出目录规范 |
| 后端规范 | 6 | ~3,152 | 525 | 数据库设计、API设计、目录结构 |
| 前端规范 | 3 | ~270 | 90 | 目录结构、接口调用、多语言 |
| 索引文件 | 2 | - | - | index.md、README.md |
| **总计** | **13** | **~4,258** | **327** | **完整的开发标准与规范体系** |

---

### ✅ 已完成文档 (11个标准文档 + 2个索引)

#### 通用规范 (2个)
| 文档 | 规模 | 优先级 | 核心内容 |
|------|------|--------|----------|
| `common/document-generation-rules.md` | ~200行 | ⭐ P0 | 禁止主动生成文档、精简回答 |
| `common/output-directory-standard.md` | ~636行 | ⭐ P0 | 变更ID、输出路径、YAML规范 |

#### 后端规范 (6个)
| 文档 | 规模 | 优先级 | 核心内容 |
|------|------|--------|----------|
| `backend/common/database.md` | ~492行 | ⭐ P1 | 表设计、索引设计、软删除 |
| `backend/common/database-fields.md` | ~600+行 | ⭐ P1 | 标准字段、审计字段、组合方案 |
| `backend/common/index-design-guide.md` | ~500+行 | ⭐ P1 | 索引原则、8种场景、优化技巧 |
| `backend/common/design-decisions.md` | ~450+行 | ⭐ P1 | 外键决策、分库分表决策 |
| `backend/api.md` | ~660行 | ⭐ P1 | 统一响应、校验、异常、脱敏 |
| `backend/structure.md` | ~450+行 | P2 | Java/Node.js/Python目录结构 |

#### 前端规范 (3个)
| 文档 | 规模 | 优先级 | 核心内容 |
|------|------|--------|----------|
| `frontend/structure.md` | ~80行 | P2 | Vue 3 目录结构 |
| `frontend/api.md` | ~120行 | P2 | Axios封装、API模块化 |
| `frontend/i18n.md` | ~70行 | P2 | vue-i18n 国际化配置 |

---

### ⏳ 待创建文档

| 文档 | 优先级 | 预计规模 | 说明 |
|------|--------|----------|------|
| `testing/common/unit-test.md` | P1 | 300-400行 | 单元测试规范(JUnit、Jest) |
| `backend/java/codestyle.md` | P2 | 300-400行 | Java编码规范(阿里巴巴规范) |
| `backend/java/spring-boot.md` | P2 | 300-400行 | Spring Boot最佳实践 |
| `backend/common/security.md` | P3 | 200-300行 | 安全规范(认证、授权、加密) |
| `backend/common/performance.md` | P3 | 200-300行 | 性能优化规范 |
| `frontend/vue/codestyle.md` | P3 | 200-300行 | Vue编码规范 |

---

## 🎯 使用指南

### 对于开发人员

1. **开始新项目**
   - 阅读 `backend/common/database.md` 进行数据库设计
   - 阅读 `backend/common/api-design.md` 进行 API 设计
   - 阅读相关开发标准文档

2. **代码审查**
   - 使用相应标准文档中的检查清单
   - 确保代码符合开发标准

3. **问题排查**
   - 查看标准文档中的"常见问题"章节
   - 参考"最佳实践"章节

### 对于架构师

1. **架构设计**
   - 参考 `backend/common/database.md` 的数据库设计原则
   - 参考 `backend/common/api-design.md` 的 API 设计原则
   - 参考技术栈和项目结构规范

2. **标准制定**
   - 基于现有标准进行扩展
   - 确保新标准与现有标准一致

3. **团队培训**
   - 使用标准文档进行团队培训
   - 定期更新开发标准

### 对于项目经理

1. **质量管理**
   - 使用标准文档中的检查清单进行质量检查
   - 监控标准遵循情况

2. **进度管理**
   - 标准化的开发流程可以加快开发速度
   - 标准化的代码可以减少 bug

---

## 🔗 相关资源

### 内部资源

- [Spec-Code 项目](../../../README.md) - 项目主文档
- [Skills 系统](../skills/) - 技能库
- [Commands 系统](../commands/) - 命令库
- [Templates 系统](../templates/) - 模板库
- [Knowledge 知识库](../knowledge/) - 技术栈和组件文档

### 外部标准与规范

- [阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c) - Java 编码标准
- [Google Style Guides](https://google.github.io/styleguide/) - 各语言风格指南
- [RESTful API 设计指南](https://restfulapi.net/) - API 设计最佳实践

### 参考项目

- [spec-kit](https://github.com/github/spec-kit) - GitHub 的 Spec-Driven Development 工具
- [superpowers](https://github.com/coleam00/superpowers) - AI 编程技能库
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - 变更驱动的规格管理

---

## 📞 联系方式

- **维护团队**: Spec-Code Team
- **问题反馈**: GitHub Issues
- **技术交流**: 内部技术论坛

---

## 📊 标准覆盖范围

### 当前覆盖情况

| 领域 | 覆盖率 | 文档数 | 说明 |
|------|--------|--------|------|
| 通用规范 | ✅ 100% | 2/2 | 文档生成、输出目录 |
| 数据库设计 | ✅ 100% | 4/4 | 表设计、字段、索引、决策 |
| API设计 | ✅ 100% | 1/1 | 统一响应、校验、异常 |
| 后端目录结构 | ✅ 100% | 1/1 | Java/Node.js/Python |
| 前端目录结构 | ✅ 100% | 1/1 | Vue 3 |
| 前端接口调用 | ✅ 100% | 1/1 | Axios封装 |
| 前端国际化 | ✅ 100% | 1/1 | vue-i18n |
| Java编码规范 | ⏳ 0% | 0/2 | 待创建 |
| 测试规范 | ⏳ 0% | 0/1 | 待创建 |
| 安全规范 | ⏳ 0% | 0/1 | 待创建 |
| 性能优化 | ⏳ 0% | 0/1 | 待创建 |

### 整体覆盖率

- **已完成领域**: 7个 (通用、数据库、API、目录结构、前端)
- **待完成领域**: 4个 (Java编码、测试、安全、性能)
- **总体覆盖率**: **~65%** (7/11)

### 阶段目标

- ✅ **Phase 1 (已完成)**: 65% - 核心标准(通用、数据库、API、目录结构)
- 🔄 **Phase 2 (进行中)**: 80% - 补充测试标准、Java编码标准
- 📋 **Phase 3 (规划中)**: 95% - 补充安全标准、性能标准

---

## 🔄 标准更新流程

### 1. 提出建议

如果发现标准中的问题或有改进建议，请：
1. 创建 Issue 或 Pull Request
2. 说明问题或建议
3. 提供参考资料

### 2. 审核

标准维护者会：
1. 审核建议
2. 讨论可行性
3. 决定是否采纳

### 3. 更新

如果建议被采纳：
1. 更新标准文档
2. 更新相关 Skills 和 Commands
3. 发布新版本

---

## 📞 联系方式

- **标准维护者**: Spec-Code Team
- **问题反馈**: [GitHub Issues]
- **讨论交流**: [内部论坛]

---

## 🔍 如何查找标准

### 按开发场景查找

| 场景 | 推荐阅读顺序 | 耗时 |
|------|------------|------|
| **开始新项目** | 1. 文档生成原则 → 2. 输出目录规范 → 3. 目录结构规范 | 30分钟 |
| **数据库设计** | 1. 数据库设计规范 → 2. 字段规范 → 3. 索引设计 → 4. 设计决策 | 60分钟 |
| **API开发** | 1. API设计规范 → 2. 前端接口调用规范 | 30分钟 |
| **前端开发** | 1. 目录结构 → 2. 接口调用 → 3. 国际化 | 20分钟 |

### 按优先级查找

- **⭐ P0 (必读)**: document-generation-rules.md、output-directory-standard.md
- **⭐ P1 (核心)**: database.md、database-fields.md、index-design-guide.md、design-decisions.md、api.md
- **P2 (重要)**: structure.md (后端/前端)、frontend/api.md、frontend/i18n.md

### 按技术栈查找

- **后端开发者**: 通用规范 + 后端规范全部(8个文档)
- **前端开发者**: 通用规范 + 前端规范全部(5个文档)
- **全栈开发者**: 阅读所有文档(13个文档)

---

## 📝 版本历史

| 版本 | 日期 | 更新人 | 变更内容 |
|------|------|--------|----------|
| v2.0 | 2025-11-13 | johnsonyang | 全面更新README,新增文档统计、场景导航、覆盖率分析 |
| v1.2 | 2025-11-11 | Spec-Code Team | 新增数据库字段、索引设计、设计决策指南 |
| v1.1 | 2025-11-03 | Spec-Code Team | 更新输出目录规范,完善前端规范 |
| v1.0 | 2025-01-15 | Spec-Code Team | 初始版本，包含数据库和API规范 |

---

## 🎯 后续规划

### 短期计划 (1-2个月)
- [ ] **补充测试标准**: 单元测试、集成测试、E2E测试
- [ ] **补充Java编码标准**: 基于阿里巴巴开发手册
- [ ] **优化现有文档**: 补充更多实战案例

### 长期计划 (3-6个月)
- [ ] **安全标准**: 认证授权、数据加密、SQL注入防护
- [ ] **性能标准**: 数据库优化、缓存策略、异步处理
- [ ] **Vue编码标准**: 组件设计、状态管理、性能优化
- [ ] **建立自动化检查**: 开发标准自动检查工具

---

> **文档版本**: v2.0  
> **最后更新**: 2025-11-13  
> **维护团队**: Spec-Code Team  
> **最后更新人**: johnsonyang  
> **文档总数**: 15个文件  
> **文档规模**: ~4,258行
