---
template_id: project.constitution
template_name: 项目宪章模板
category: project
description: 项目宪章模板 - 定义项目的核心原则、技术约束和治理规则
version: 0.1.0
---

# {{PROJECT_NAME}} - 项目宪章

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Template 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构


**最后更新**: {{LAST_UPDATE_DATE}}

## 项目概述

**项目名称**: {{PROJECT_NAME}}

**项目简介**: {{PROJECT_DESCRIPTION}}

**项目类型**: {{PROJECT_TYPE}} <!-- 后端/前端/全栈/库/工具 -->

**项目状态**: {{PROJECT_STATUS}} <!-- 规划中/开发中/维护中/已归档 -->

---

## 核心原则

本项目遵循以下核心原则，所有开发活动必须符合这些原则：

### I. {{PRINCIPLE_1_NAME}}

{{PRINCIPLE_1_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_1_REQUIREMENT_1}}
- {{PRINCIPLE_1_REQUIREMENT_2}}
- {{PRINCIPLE_1_REQUIREMENT_3}}

### II. {{PRINCIPLE_2_NAME}}

{{PRINCIPLE_2_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_2_REQUIREMENT_1}}
- {{PRINCIPLE_2_REQUIREMENT_2}}
- {{PRINCIPLE_2_REQUIREMENT_3}}

### III. {{PRINCIPLE_3_NAME}}

{{PRINCIPLE_3_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_3_REQUIREMENT_1}}
- {{PRINCIPLE_3_REQUIREMENT_2}}
- {{PRINCIPLE_3_REQUIREMENT_3}}

### IV. {{PRINCIPLE_4_NAME}}

{{PRINCIPLE_4_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_4_REQUIREMENT_1}}
- {{PRINCIPLE_4_REQUIREMENT_2}}
- {{PRINCIPLE_4_REQUIREMENT_3}}

### V. {{PRINCIPLE_5_NAME}}

{{PRINCIPLE_5_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_5_REQUIREMENT_1}}
- {{PRINCIPLE_5_REQUIREMENT_2}}
- {{PRINCIPLE_5_REQUIREMENT_3}}

### VI. {{PRINCIPLE_6_NAME}}

{{PRINCIPLE_6_DESCRIPTION}}

**具体要求**:
- {{PRINCIPLE_6_REQUIREMENT_1}}
- {{PRINCIPLE_6_REQUIREMENT_2}}
- {{PRINCIPLE_6_REQUIREMENT_3}}

---

## 技术约束

### 编程语言

**主要语言**: {{PRIMARY_LANGUAGE}} {{PRIMARY_LANGUAGE_VERSION}}

**其他语言**: {{SECONDARY_LANGUAGES}}

**约束**:
- {{LANGUAGE_CONSTRAINT_1}}
- {{LANGUAGE_CONSTRAINT_2}}

### 框架和库

**后端框架**: {{BACKEND_FRAMEWORK}} {{BACKEND_FRAMEWORK_VERSION}}

**前端框架**: {{FRONTEND_FRAMEWORK}} {{FRONTEND_FRAMEWORK_VERSION}}

**约束**:
- {{FRAMEWORK_CONSTRAINT_1}}
- {{FRAMEWORK_CONSTRAINT_2}}

### 数据库

**主数据库**: {{PRIMARY_DATABASE}} {{PRIMARY_DATABASE_VERSION}}

**缓存**: {{CACHE_SYSTEM}}

**约束**:
- {{DATABASE_CONSTRAINT_1}}
- {{DATABASE_CONSTRAINT_2}}

### 禁止使用的技术

以下技术在本项目中**禁止使用**:
- {{FORBIDDEN_TECH_1}} - {{FORBIDDEN_REASON_1}}
- {{FORBIDDEN_TECH_2}} - {{FORBIDDEN_REASON_2}}

---

## 开发工作流

### 分支策略

**主分支**: {{MAIN_BRANCH}} <!-- main/master -->

**开发分支**: {{DEV_BRANCH}} <!-- develop/dev -->

**功能分支**: {{FEATURE_BRANCH_PATTERN}} <!-- feature/xxx -->

**发布分支**: {{RELEASE_BRANCH_PATTERN}} <!-- release/xxx -->

### 提交规范

**提交消息格式**: {{COMMIT_MESSAGE_FORMAT}} <!-- Conventional Commits/自定义 -->

**示例**:
```
{{COMMIT_MESSAGE_EXAMPLE_1}}
{{COMMIT_MESSAGE_EXAMPLE_2}}
{{COMMIT_MESSAGE_EXAMPLE_3}}
```

### 代码审查

**审查要求**: {{CODE_REVIEW_REQUIREMENT}} <!-- 必须/推荐/可选 -->

**审查人数**: {{CODE_REVIEW_APPROVERS}} <!-- 至少 1 人/至少 2 人 -->

**审查清单**:
- [ ] {{CODE_REVIEW_CHECKLIST_1}}
- [ ] {{CODE_REVIEW_CHECKLIST_2}}
- [ ] {{CODE_REVIEW_CHECKLIST_3}}

---

## 质量标准

### 代码质量

**Linter**: {{LINTER_TOOL}} <!-- ESLint/Checkstyle/Pylint -->

**格式化**: {{FORMATTER_TOOL}} <!-- Prettier/Black/Google Java Format -->

**要求**:
- {{CODE_QUALITY_REQUIREMENT_1}}
- {{CODE_QUALITY_REQUIREMENT_2}}

### 测试要求

**测试框架**: {{TEST_FRAMEWORK}}

**覆盖率要求**: {{TEST_COVERAGE_REQUIREMENT}} <!-- 至少 80%/至少 70% -->

**测试类型**:
- [ ] 单元测试 - {{UNIT_TEST_REQUIREMENT}}
- [ ] 集成测试 - {{INTEGRATION_TEST_REQUIREMENT}}
- [ ] E2E 测试 - {{E2E_TEST_REQUIREMENT}}

### 文档要求

**API 文档**: {{API_DOC_REQUIREMENT}} <!-- 必须/推荐 -->

**代码注释**: {{CODE_COMMENT_REQUIREMENT}} <!-- 关键逻辑必须注释/推荐注释 -->

**README**: {{README_REQUIREMENT}} <!-- 必须包含安装、使用、贡献指南 -->

**文档生成约束**: 
- **禁止主动生成文档** - 不生成汇总文档、分析报告、总结文档
- **只在明确要求时生成** - 用户明确说"生成文档"、"总结"、"分析报告"才生成
- **原地修改优先** - 更新现有文档，不创建新版本文件
- **禁止在根目录创建文档** - 除 README.md 外，所有文档归类到对应目录
- 详见 [文档生成原则](mdc:spec/global/standards/common/document-generation-rules.md)

### 输出目录规范

**变更 ID 格式**: `YYYY-MM-DD-feature-name`

**输出路径规则**: `workspace/{变更ID}/{阶段}/{文件名}`

**阶段分类**:
- `requirements/` - 需求阶段输出
- `design/` - 设计阶段输出
- `planning/` - 规划阶段输出
- `implementation/` - 实现阶段输出
- `documentation/` - 文档阶段输出
- `deployment/` - 部署阶段输出

**文件头部规范**:
所有输出文件必须包含 YAML Frontmatter，包含以下字段：
- `change_id` - 变更 ID（格式：YYYY-MM-DD-feature-name）
- `change_title` - 变更标题
- `change_status` - 变更状态（proposed/approved/implemented/archived）
- `document_type` - 文档类型（requirements/database-design/api-design 等）
- `stage` - 开发阶段（requirements/design/planning/implementation/documentation/deployment）
- `created_at` - 创建时间（ISO 8601 格式）
- `author` - 作者
- `related_requirements` - 相关需求文档路径
- `related_memory` - 相关项目记忆文件路径
- `version` - 版本号
- `compliance_checked` - 是否已检查合规性
- `compliance_status` - 合规性状态

**示例**:
```yaml
---
change_id: 2025-11-03-user-auth
change_title: 用户认证功能
change_status: proposed
document_type: database-design
stage: design
created_at: 2025-11-03T10:30:00Z
author: AI Assistant
related_requirements: workspace/2025-11-03-user-auth/requirements/requirements.md
related_memory: .spec-code/memory/constitution.md
version: 1.0
compliance_checked: true
compliance_status: passed
---
```

详见 [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)

---

## 安全要求

### 认证和授权

**认证方式**: {{AUTH_METHOD}} <!-- JWT/OAuth2/Session -->

**授权策略**: {{AUTHZ_POLICY}} <!-- RBAC/ABAC -->

### 数据安全

**敏感数据加密**: {{SENSITIVE_DATA_ENCRYPTION}} <!-- 必须/推荐 -->

**传输加密**: {{TRANSPORT_ENCRYPTION}} <!-- HTTPS/TLS -->

**存储加密**: {{STORAGE_ENCRYPTION}} <!-- 数据库加密/文件加密 -->

### 安全扫描

**依赖扫描**: {{DEPENDENCY_SCAN_TOOL}} <!-- Snyk/Dependabot -->

**代码扫描**: {{CODE_SCAN_TOOL}} <!-- SonarQube/CodeQL -->

**频率**: {{SECURITY_SCAN_FREQUENCY}} <!-- 每次提交/每日/每周 -->

---

## 性能要求

### 响应时间

**API 响应时间**: {{API_RESPONSE_TIME}} <!-- P95 < 200ms -->

**页面加载时间**: {{PAGE_LOAD_TIME}} <!-- FCP < 1.5s -->

### 吞吐量

**并发用户数**: {{CONCURRENT_USERS}} <!-- 支持 1000 并发 -->

**QPS**: {{QPS_REQUIREMENT}} <!-- 支持 10000 QPS -->

### 资源使用

**内存使用**: {{MEMORY_USAGE}} <!-- < 2GB -->

**CPU 使用**: {{CPU_USAGE}} <!-- < 80% -->

---

## 部署要求

### 部署环境

**开发环境**: {{DEV_ENVIRONMENT}}

**测试环境**: {{TEST_ENVIRONMENT}}

**生产环境**: {{PROD_ENVIRONMENT}}

### 部署方式

**容器化**: {{CONTAINERIZATION}} <!-- Docker/Podman -->

**编排**: {{ORCHESTRATION}} <!-- Kubernetes/Docker Compose -->

**CI/CD**: {{CICD_TOOL}} <!-- GitHub Actions/GitLab CI/Jenkins -->

### 监控和日志

**监控工具**: {{MONITORING_TOOL}} <!-- Prometheus/Grafana -->

**日志工具**: {{LOGGING_TOOL}} <!-- ELK/Loki -->

**告警**: {{ALERTING_TOOL}} <!-- PagerDuty/Slack -->

---

## 治理规则

### 决策机制

**技术决策**: {{TECH_DECISION_PROCESS}} <!-- 团队讨论/架构师决定 -->

**架构变更**: {{ARCH_CHANGE_PROCESS}} <!-- RFC/ADR -->

### 变更管理

**宪章变更**: {{CONSTITUTION_CHANGE_PROCESS}} <!-- 需要团队 2/3 同意 -->

**技术栈变更**: {{TECH_STACK_CHANGE_PROCESS}} <!-- 需要架构师批准 -->

### 审查周期

**宪章审查**: {{CONSTITUTION_REVIEW_FREQUENCY}} <!-- 每季度/每半年 -->

**技术栈审查**: {{TECH_STACK_REVIEW_FREQUENCY}} <!-- 每半年/每年 -->

---

## 持续改进

### 反馈机制

**收集反馈**: {{FEEDBACK_COLLECTION}} <!-- 每周回顾/每月回顾 -->

**改进提案**: {{IMPROVEMENT_PROPOSAL}} <!-- GitHub Issues/内部文档 -->

### 度量指标

**代码质量**: {{CODE_QUALITY_METRICS}} <!-- 技术债务/代码复杂度 -->

**团队效率**: {{TEAM_EFFICIENCY_METRICS}} <!-- 交付速度/缺陷率 -->

**用户满意度**: {{USER_SATISFACTION_METRICS}} <!-- NPS/CSAT -->

---

## 附录

### 参考资料

- {{REFERENCE_1}}
- {{REFERENCE_2}}
- {{REFERENCE_3}}

### 术语表

- **{{TERM_1}}**: {{TERM_1_DEFINITION}}
- **{{TERM_2}}**: {{TERM_2_DEFINITION}}
- **{{TERM_3}}**: {{TERM_3_DEFINITION}}

---

**版本历史**:
- v0.1.0 ({{CREATION_DATE}}) - 初始版本
