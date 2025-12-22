# 扩展文档生成报告

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{REPORT_DATE}}  
> **总耗时**: {{TOTAL_TIME}}  
> **前置条件**: 核心文档 {{CORE_DOCS}} 个

---

## 📊 执行摘要

```
┌─────────────────────────────────────────────────────────────────┐
│                      扩展文档生成完成                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   📄 可选文档数    10 个                                         │
│   ✅ 已生成数      {{GENERATED}} 个                              │
│   ⏭️  跳过数       {{SKIPPED}} 个                                │
│   ⏱️  总耗时       {{TOTAL_TIME}}                                │
│   ✅ 成功率       {{SUCCESS_RATE}}%                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 生成统计

### 文档生成详情

| 序号 | 文档 | 状态 | 章节数 | 内容量 | 耗时 |
|------|------|------|--------|--------|------|
| 1 | directory-structure.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 2 | spring-configuration.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 3 | business-flows.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 4 | api-contracts.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 5 | interceptors-aspects.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 6 | security-auth.md | ⏭️ 跳过 | - | - | - |
| 7 | database-structure.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 8 | environment-config.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 9 | third-party-interfaces.md | ✅ 已生成 | {{N}} | {{SIZE}} | {{TIME}} |
| 10 | third-party-components.md | ⏭️ 跳过 | - | - | - |

### 内容统计

| 文档 | 主要内容 | 引用核心文档 |
|------|----------|--------------|
| directory-structure.md | {{N}} 个目录说明 | - |
| spring-configuration.md | {{N}} 个 Bean，{{N}} 个配置项 | Config 类 {{N}} 个 |
| business-flows.md | {{N}} 个业务流程 | Controller {{N}} 个，Service {{N}} 个 |
| api-contracts.md | {{N}} 个 API 接口 | Controller {{N}} 个 |
| interceptors-aspects.md | {{N}} 个拦截器，{{N}} 个切面 | Handler {{N}} 个 |
| security-auth.md | - | - |
| database-structure.md | {{N}} 张表，{{N}} 个关系 | Entity {{N}} 个，Mapper {{N}} 个 |
| environment-config.md | {{N}} 个环境，{{N}} 个配置项 | - |
| third-party-interfaces.md | {{N}} 个外部接口 | Feign {{N}} 个 |
| third-party-components.md | - | - |

---

## 📁 输出结构

```
kb/
├── README.md                  # ✅ 已更新（添加扩展文档链接）
├── ...                        # 核心文档
│
└── extra/                     # 扩展文档目录
    ├── README.md              # ✅ 扩展文档索引
    │
    ├── directory-structure.md # ✅ 目录结构
    ├── spring-configuration.md# ✅ Spring 配置
    ├── business-flows.md      # ✅ 业务流程
    ├── api-contracts.md       # ✅ API 契约
    ├── interceptors-aspects.md# ✅ 拦截器切面
    ├── security-auth.md       # ⏭️ 跳过
    ├── database-structure.md  # ✅ 数据库结构
    ├── environment-config.md  # ✅ 环境配置
    ├── third-party-interfaces.md # ✅ 第三方接口
    └── third-party-components.md # ⏭️ 跳过
```

---

## ✅ 质量检查结果

| 检查项 | 结果 | 问题数 | 说明 |
|--------|------|--------|------|
| 文档完整性 | ✅ 通过 | 0 | 所有选中文档已生成 |
| 内容准确性 | ✅ 通过 | 0 | 与核心文档一致 |
| 链接有效性 | ✅ 通过 | 0 | 内部链接正确 |
| 格式规范 | ✅ 通过 | 0 | 符合模板要求 |

---

## 📊 各文档详情

### directory-structure.md

| 指标 | 数值 |
|------|------|
| 目录层级 | {{N}} 层 |
| 目录数量 | {{N}} 个 |
| 文件数量 | {{N}} 个 |
| 主要模块 | {{MODULES}} |

### spring-configuration.md

| 指标 | 数值 |
|------|------|
| @Configuration 类 | {{N}} 个 |
| @Bean 定义 | {{N}} 个 |
| @ConfigurationProperties | {{N}} 个 |
| 配置属性 | {{N}} 个 |

### business-flows.md

| 指标 | 数值 |
|------|------|
| 业务流程数 | {{N}} 个 |
| 涉及 Controller | {{N}} 个 |
| 涉及 Service | {{N}} 个 |
| 流程图数量 | {{N}} 个 |

### api-contracts.md

| 指标 | 数值 |
|------|------|
| API 总数 | {{N}} 个 |
| GET 接口 | {{N}} 个 |
| POST 接口 | {{N}} 个 |
| PUT 接口 | {{N}} 个 |
| DELETE 接口 | {{N}} 个 |
| 错误码数量 | {{N}} 个 |

### database-structure.md

| 指标 | 数值 |
|------|------|
| 数据表数量 | {{N}} 张 |
| 字段总数 | {{N}} 个 |
| 外键关系 | {{N}} 个 |
| 索引数量 | {{N}} 个 |

### environment-config.md

| 指标 | 数值 |
|------|------|
| 环境数量 | {{N}} 个 |
| 配置文件数 | {{N}} 个 |
| 配置项总数 | {{N}} 个 |
| 敏感配置 | {{N}} 个 |

### third-party-interfaces.md

| 指标 | 数值 |
|------|------|
| Feign 客户端 | {{N}} 个 |
| 外部接口数 | {{N}} 个 |
| 涉及服务 | {{SERVICES}} |

---

## ⚠️ 问题与警告

### 生成过程中的问题

| 文档 | 问题 | 处理方式 |
|------|------|----------|
| {{DOC}} | {{ISSUE}} | {{SOLUTION}} |

*如无问题，此章节为空*

### 内容警告

| 文档 | 警告 | 建议 |
|------|------|------|
| business-flows.md | 流程 X 缺少异常处理分支 | 补充异常流程 |
| api-contracts.md | 接口 Y 缺少错误码定义 | 补充错误码 |
| database-structure.md | 表 Z 缺少索引 | 建议添加索引 |

---

## 🎯 后续建议

### 文档维护

1. **定期同步**: 核心文档更新后，同步更新扩展文档
2. **业务流程**: 新增业务流程时，更新 business-flows.md
3. **API 变更**: 接口变更时，更新 api-contracts.md
4. **数据库变更**: 表结构变更时，更新 database-structure.md

### 补充建议

| 优先级 | 建议 | 涉及文档 |
|--------|------|----------|
| P1 | {{SUGGESTION}} | {{DOC}} |
| P2 | {{SUGGESTION}} | {{DOC}} |
| P3 | {{SUGGESTION}} | {{DOC}} |

---

## 📝 执行时间线

| 时间 | 阶段 | 耗时 |
|------|------|------|
| {{TIME}} | 开始数据准备 | - |
| {{TIME}} | 数据准备完成 | {{DURATION}} |
| {{TIME}} | directory-structure.md 完成 | {{DURATION}} |
| {{TIME}} | spring-configuration.md 完成 | {{DURATION}} |
| {{TIME}} | business-flows.md 完成 | {{DURATION}} |
| {{TIME}} | api-contracts.md 完成 | {{DURATION}} |
| {{TIME}} | 其他文档完成 | {{DURATION}} |
| {{TIME}} | 质量检查完成 | {{DURATION}} |
| {{TIME}} | 索引更新完成 | {{DURATION}} |
| **总计** | - | **{{TOTAL_TIME}}** |

---

## 🏁 结论

扩展文档生成**{{RESULT}}**完成。

- ✅ 选择文档: **{{SELECTED}}** 个
- ✅ 已生成: **{{GENERATED}}** 个
- ⏭️ 跳过: **{{SKIPPED}}** 个
- ✅ 索引已更新

**扩展文档入口**: `kb/extra/README.md`

---

## 📚 完整知识库结构

```
kb/
├── README.md                  # 总索引（入口）
├── architecture.md            # 架构依赖图
│
├── [核心文档目录]             # {{CORE_DOCS}} 个文档
│   ├── controller/
│   ├── service/
│   ├── ...
│
└── extra/                     # 扩展文档
    ├── README.md              # 扩展文档索引
    └── [{{GENERATED}} 个扩展文档]
```

**知识库总入口**: `kb/README.md`

---

*报告生成时间: {{REPORT_DATE}}*

