# Knowledge 通用研发知识库

本目录存放项目相关的领域知识、组件文档、技术栈说明等内容。

> **更新时间**: 2025-11-27  
> **文档总数**: 66 个文件  
> **涵盖领域**: 组件库(28)、技术栈(17)、最佳实践(10)、领域知识(1)、示例项目(4)

## 📋 目录结构

```
knowledge/
├── components/          # 组件库 (28个文档)
│   ├── Vue组件库       # Vue2/Vue3人事选择器
│   ├── 业务服务        # 流程引擎、待办中心、规则引擎
│   ├── 基础设施        # 消息服务、事件桥、Apollo配置
│   ├── SDK文档         # HRIT SDK、脚手架文档
│   └── 文件服务        # 附件服务、对象存储
├── stack/              # 技术栈文档 (17个文档)
│   ├── 前端框架        # Vue2、Vue3
│   ├── 后端框架        # Spring Boot 3/4、MyBatis、MyBatis-Plus
│   ├── 数据库          # MySQL、Spring Data MongoDB
│   ├── 缓存系统        # Spring Data Redis、Go Redis
│   ├── 搜索引擎        # Spring Data Elasticsearch、Elasticsearch
│   ├── 消息队列        # Spring Kafka
│   ├── 对象存储        # 腾讯云COS Java/JavaScript SDK
│   └── 测试框架        # JUnit5、Mockito
├── best-practices/     # 最佳实践 (10个文档)
│   ├── Claude Skill开发最佳实践
│   ├── Java单元测试最佳实践
│   ├── 代码审查分析最佳实践
│   ├── 构建有效Agent最佳实践
│   ├── 从代码提取知识最佳实践
│   └── 单元测试生成案例分析
├── demo/               # 示例项目 (4个压缩包)
│   ├── 招活伯乐前端知识库 (Web+小程序)
│   ├── 招活伯乐后端知识库 - 第一版(手动生成,最详细)
│   ├── 招活伯乐后端知识库 - 第二版(自下而上,最简略)
│   └── 招活伯乐后端知识库 - 第三版(技能生成,适中)
└── domain-specific/    # 领域特定知识 (待补充)
```

## 🎯 使用场景

### 1. 组件库 (components/) - 28个文档

存放可复用的 UI 组件和服务组件的文档和使用说明。

**核心内容**:
- **Vue 组件库** (2个): Vue2/Vue3 人事选择器组件库完整API文档
- **业务服务** (5个): 流程引擎、云流程引擎、待办中心、规则引擎、消息中台
- **基础设施** (4个): 消息服务、事件桥、Apollo配置、KMS密钥管理、云权限
- **SDK文档** (4个): HRIT SDK、Java脚手架、Spring Boot 2/3配置
- **文件服务** (5个): 附件服务完整指南(含4个分片文档)
- **应用接入** (5个): TAS服务总览及4个分片文档
- **其他服务** (3个): 短链服务、Digger用户行为采集

**快速查找**: 查看 [components/index.md](components/index.md) 获取完整的组件索引

### 2. 技术栈 (stack/) - 17个文档

存放项目使用的技术栈文档、最佳实践、常见问题等。

**核心技术栈**:
- **前端框架** (2个): Vue 3 ⭐⭐⭐⭐⭐、Vue 2 ⭐⭐⭐⭐
- **后端框架** (4个): Spring Boot 3/4、MyBatis-Plus、MyBatis
- **数据库** (2个): MySQL 9.5.0、Spring Data MongoDB
- **缓存系统** (2个): Spring Data Redis、Go Redis
- **搜索引擎** (2个): Spring Data Elasticsearch、Elasticsearch REST API
- **消息队列** (1个): Spring Kafka
- **对象存储** (2个): 腾讯云COS Java SDK、COS JavaScript SDK
- **测试框架** (2个): JUnit5、Mockito

**推荐优先级**:
- ⭐⭐⭐⭐⭐ 核心推荐: 9个文档(Vue3、Spring Boot 3、MyBatis-Plus、MongoDB、Redis、Elasticsearch、MySQL、Kafka、COS)
- ⭐⭐⭐⭐ 重要参考: 8个文档(Vue2、Spring Boot 4、MyBatis、Go Redis、Elasticsearch REST、JUnit5、Mockito)

**快速查找**: 查看 [stack/index.md](stack/index.md) 获取完整的技术选型指南

### 3. 最佳实践 (best-practices/) - 10个文档

存放开发最佳实践、编码规范、质量保证等指南文档。

**核心文档**:
- **Claude Skill开发最佳实践** (45.48 KB): Skill系统设计模式、开发流程、质量标准
- **Java单元测试最佳实践** (83.04 KB): JUnit测试规范、Mock使用、覆盖率提升
- **代码审查最佳实践** (45.86 KB): 代码评审标准、质量检查清单
- **通用代码审查分析** (16.8 KB): 代码审查流程和分析方法
- **从代码提取知识最佳实践** (47.24 KB): 知识提取方法论和工具使用
- **构建有效Agent** (19.28 KB): Agent系统设计原则
- **单元测试生成对比分析** (36.88 KB): 使用Skill vs 不使用Skill效果对比
- **AdminController单元测试生成案例** (30.84 KB): 大型API接口单元测试实战
- **单元测试生成综合对比** (1个压缩包): 多版本测试代码对比

**快速查找**: 本目录暂无index.md，可直接浏览文件列表

### 4. 领域特定知识 (domain-specific/) - 1个文档

存放特定业务领域的知识、规则、流程等。

**核心领域**: 大型互联网企业人力资源信息化

**规划模块**:
- **组织管理**: 组织架构、部门管理、岗位体系、编制管理
- **招聘管理**: 招聘流程、候选人管理、面试安排、Offer发放
- **员工管理**: 入职离职、人事档案、合同管理、异动调岗
- **考勤管理**: 排班规则、打卡考勤、请假审批、加班管理
- **薪酬管理**: 薪资核算、个税计算、社保公积金、奖金绩效
- **绩效管理**: 目标设定、绩效考核、评估周期、结果应用
- **培训发展**: 培训计划、课程管理、学习记录、职业发展
- **员工服务**: 自助服务、审批流程、证明开具、福利管理

**快速查找**: 查看 [domain-specific/index.md](domain-specific/index.md) 了解如何添加领域知识

### 5. 示例项目 (demo/) - 4个压缩包

存放各种实际范例的完整研发知识库，用于学习和参考不同的知识库生成方法。

**招活伯乐系统示例**:
- **kb-recruit-bole-client-web.7z** (86.85 KB): 
  - **内容**: 招活伯乐前端项目研发知识库
  - **技术栈**: Vue (含Web和小程序)
  - **用途**: 前端项目知识库组织参考
  
- **kb-recruit-bole-service.7z** (69.34 KB): 
  - **内容**: 招活领域伯乐后端服务研发知识库 **第一版**
  - **生成方式**: 自下而上方式人工手动生成
  - **特点**: 内容最详细，适合深入学习
  
- **kb1-recruit-bole-service.7z** (30.47 KB): 
  - **内容**: 招活领域伯乐后端服务研发知识库 **第二版**
  - **生成方式**: 自下而上方式生成
  - **特点**: 内容最简略，适合快速浏览
  
- **kb2-recruit-bole-service.7z** (49.36 KB): 
  - **内容**: 招活领域伯乐后端服务研发知识库 **第三版**
  - **生成方式**: 使用技能(Skill)生成
  - **特点**: 内容适中，展示AI辅助生成效果

**使用建议**:
- 💡 **学习知识库组织结构**: 推荐从第一版(kb-recruit-bole-service.7z)开始
- 💡 **对比生成方式**: 比较三个版本的差异，了解人工vs技能生成的优劣
- 💡 **快速参考**: 使用第二版(kb1)快速了解核心内容
- 💡 **AI辅助最佳实践**: 参考第三版(kb2)了解如何使用Skill提升效率

**快速查找**: 直接解压对应的7z文件查看完整项目知识库内容

## 📊 知识库统计

### 文档数量分布
| 类别 | 文档数 | 总大小 | 平均大小 | 主要用途 |
|------|--------|--------|----------|----------|
| 组件库 | 28 | ~1.2 MB | 44 KB | UI组件、业务服务、SDK文档 |
| 技术栈 | 17 | ~2.8 MB | 165 KB | 框架选型、架构设计、代码生成 |
| 最佳实践 | 10 | ~363 KB | 36 KB | 开发规范、质量保证、案例分析 |
| 领域知识 | 1 | ~2 KB | - | 业务领域知识索引 |
| 示例项目 | 4 | ~236 KB | 59 KB | 知识库范例、生成方式对比 |

### 文档规模分级
- **超大型文档** (>100KB): 5个 (Spring Data Elasticsearch 543KB, JUnit5 562KB, Spring Data MongoDB 400KB, Spring Boot 3 106KB, Mockito 83KB)
- **大型文档** (20-100KB): 40个 (大部分组件文档和技术栈文档)
- **中型文档** (10-20KB): 15个 (部分技术栈和组件文档)
- **小型文档** (<10KB): 6个 (索引和总结文档)

---

## 📝 如何添加知识

### 1. 确定分类

根据知识类型选择合适的目录:
- UI组件/服务组件 → `components/`
- 框架/工具/SDK → `stack/`
- 开发规范/编码标准 → `best-practices/`
- 业务领域知识 → `domain-specific/`

### 2. 创建文档

在对应目录下创建 Markdown 文档,使用规范的文档结构:

```markdown
# [知识名称]

> 简短的一句话描述

## 📖 概述
详细说明这个知识点的作用和适用场景。

## 🔧 核心功能
- 功能点1: 说明
- 功能点2: 说明

## 🚀 快速开始
```code
示例代码
```

## 📚 详细说明
详细的API、配置、最佳实践等。

## ❓ 常见问题
Q1: 问题描述
A1: 解决方案

## 🔗 参考资料
- [官方文档](链接)
- [相关文章](链接)
```

### 3. 更新索引

**必须**在对应目录的 `index.md` 中添加索引信息:

```markdown
### 📄 [知识名称]

- **文件路径**: `filename.md`
- **文件大小**: XX KB
- **用途**: 一句话描述
- **主要内容**: 
  - 核心功能1
  - 核心功能2
- **推荐指数**: ⭐⭐⭐⭐⭐
```

### 4. 命名规范

- **组件文档**: 使用 `kb-` 前缀,如 `kb-workflow.md`
- **技术栈文档**: 使用技术名称,如 `spring_kafka.md`、`vue3.md`
- **最佳实践**: 使用描述性名称,如 `java-unit-test-best-practice.md`
- **索引文件**: 统一命名为 `index.md`

## 🔍 快速查找

### 按文档类型查找

- **完整索引**: 
  - [组件库索引](components/index.md) - 27个组件和服务文档
  - [技术栈索引](stack/index.md) - 15个技术栈和框架文档
  - [领域知识索引](domain-specific/index.md) - 业务领域知识

### 按使用场景查找

#### 前端开发
```
Vue3开发: stack/vue3.md + components/kb-vue3-hr-selectors.md
Vue2维护: stack/vue2.md + components/kb-vue2-hr-selectors.md
文件上传: components/kb-file-services.md + stack/tencent_cloud_cos_js_sdk.md
```

#### 后端开发
```
Spring Boot架构: stack/springboot3.md + stack/mybatis_plus.md
数据访问: stack/spring_data_redis.md + stack/spring_data_mongodb.md
消息队列: stack/spring_kafka.md
文件存储: stack/tencent_cloud_cos_java_sdk.md
全文搜索: stack/sping_data_elasticsearch.md
```

#### 业务集成
```
流程审批: components/kb-workflow.md + components/kb-todocenter.md
配置管理: components/kb-apollo.md
消息推送: components/kb-message.md
短链服务: components/kb-short-url.md
权限管理: components/kb-cloud-right.md
人事服务: components/kb-hrit-sdk-api-doc.md + components/kb-vue3-hr-selectors.md
```

### 按技术栈查找

| 技术领域 | 核心文档 | 补充文档 |
|---------|---------|---------|
| **Vue开发** | vue3.md ⭐⭐⭐⭐⭐ | vue2.md, kb-vue3-hr-selectors.md |
| **Spring开发** | springboot3.md ⭐⭐⭐⭐⭐ | springboot4.md, spring_kafka.md |
| **数据持久化** | mybatis_plus.md ⭐⭐⭐⭐⭐ | mybatis.md, spring_data_mongodb.md |
| **缓存方案** | spring_data_redis.md ⭐⭐⭐⭐⭐ | go_redis.md |
| **搜索引擎** | sping_data_elasticsearch.md ⭐⭐⭐⭐⭐ | elasticsearch.md |
| **文件存储** | tencent_cloud_cos_java_sdk.md ⭐⭐⭐⭐⭐ | tencent_cloud_cos_js_sdk.md, kb-file-services.md |
| **单元测试** | junit5.md ⭐⭐⭐⭐⭐ | mockito.md, java-unit-test-best-practice.md |

---

## 🔗 相关资源

- [Skills 系统](../../skills/README.md) - 可复用的技能库
- [Templates 系统](../../templates/README.md) - 文档模板
- [Standards 系统](../../standards/README.md) - 编码规范
- [Commands 系统](../../commands/README.md) - 命令清单

## 📚 知识库使用最佳实践

### 开发前准备
1. **查阅技术栈索引**: 先查看 [stack/index.md](stack/index.md) 了解推荐的技术选型
2. **阅读核心文档**: 优先阅读 ⭐⭐⭐⭐⭐ 推荐的核心文档
3. **检查组件可用性**: 查看 [components/index.md](components/index.md) 确认可复用的组件

### 开发中参考
1. **API查询**: 在对应的技术栈文档中查找API用法和示例代码
2. **集成指南**: 参考组件文档中的集成步骤和配置说明
3. **问题排查**: 查看文档中的"常见问题"章节

### 开发后维护
1. **更新知识**: 发现新的最佳实践或问题解决方案时,及时补充到相关文档
2. **完善示例**: 添加实际项目中的使用示例
3. **维护索引**: 新增文档后必须更新对应的 index.md

### 文档质量标准
1. **保持更新**: 知识库应该随着项目演进持续更新,及时反映技术栈版本变化
2. **结构清晰**: 使用统一的文档结构和命名规范,便于快速查找
3. **示例丰富**: 提供可运行的代码示例,覆盖常见使用场景
4. **链接完整**: 添加相关资源链接,包括官方文档、内部文档、相关组件
5. **版本标注**: 对于技术栈文档,明确标注框架版本和兼容性信息
6. **索引及时**: 新增文档后立即更新 index.md,保持索引的完整性和准确性

---

## 📝 更新记录

- **2025-11-27**: 更新知识库README，新增10个最佳实践文档、2个测试框架文档(JUnit5、Mockito)、4个示例项目
- **2025-11-27**: 完善文档统计信息，新增示例项目分类，更新文档总数至66个
- **2025-11-13**: 全面更新知识库README,新增文档统计、快速查找、使用最佳实践章节
- **2025-11-13**: 新增消息队列(Spring Kafka)、对象存储(COS)、NoSQL(MongoDB)技术栈文档
- **2025-11-13**: 完善组件库索引,统一使用 `kb-` 前缀命名规范
- **2025-11-07**: 新增搜索引擎技术栈文档(Spring Data Elasticsearch)
- **2025-11-04**: 建立技术栈文档索引体系,添加技术选型矩阵

---

## 🎯 后续规划

### 短期计划 (1-2个月)
- [ ] **为best-practices创建索引文档**: 建立完整的最佳实践索引体系
- [ ] **补充测试最佳实践**: 集成测试、E2E测试、性能测试
- [ ] **完善人力资源领域知识**: 组织管理、招聘流程、薪酬考勤核心业务规则
- [ ] **建立HR信息化架构模板**: 基于现有组件库的标准化解决方案
- [ ] **整理示例项目文档**: 为demo项目添加使用说明和架构文档
- [ ] 新增中间件文档(RabbitMQ、RocketMQ)
- [ ] 补充前端工具链文档(Vite、Webpack、TypeScript)

### 长期计划 (3-6个月)
- [ ] **构建HR信息化完整知识体系**: 覆盖8大模块的业务规则、数据模型、API设计
- [ ] **沉淀HR领域最佳实践**: 大型互联网企业人力资源系统建设经验
- [ ] **完善测试知识体系**: 建立从单元测试到系统测试的完整测试文档
- [ ] **扩充示例项目**: 增加更多业务场景的完整示例代码
- [ ] 建立知识库自动化更新机制
- [ ] 添加可视化技术选型决策树
- [ ] 建立文档质量评分系统
- [ ] 集成AI辅助的知识库检索功能
