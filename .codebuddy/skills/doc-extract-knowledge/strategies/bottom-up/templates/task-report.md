# 生成报告

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{REPORT_DATE}}  
> **总耗时**: {{TOTAL_TIME}}  
> **执行模式**: {{MODE}}

---

## 📊 执行摘要

```
┌─────────────────────────────────────────────────────────────────┐
│                        知识库生成完成                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   📁 处理文件数    {{TOTAL_FILES}} 个                            │
│   📄 生成文档数    {{TOTAL_DOCS}} 个                             │
│   📂 类型目录数    {{TYPE_DIRS}} 个                              │
│   ⏱️  总耗时       {{TOTAL_TIME}}                                │
│   ✅ 成功率       {{SUCCESS_RATE}}%                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 生成统计

### 按类型统计

| 类型 | 文件数 | 文档数 | 成功率 | 输出目录 |
|------|--------|--------|--------|----------|
| Interface | {{N}} | {{N}} | 100% | kb/interface/ |
| Abstract | {{N}} | {{N}} | 100% | kb/abstract/ |
| Controller | {{N}} | {{N}} | 100% | kb/controller/ |
| Service | {{N}} | {{N}} | 100% | kb/service/ |
| Mapper | {{N}} | {{N}} | 100% | kb/mapper/ |
| Entity | {{N}} | {{N}} | 100% | kb/entity/ |
| DTO | {{N}} | {{N}} | 100% | kb/dto/ |
| VO/Response | {{N}} | {{N}} | 100% | kb/vo-response/ |
| Request | {{N}} | {{N}} | 100% | kb/request/ |
| Feign | {{N}} | {{N}} | 100% | kb/feign/ |
| Config | {{N}} | {{N}} | 100% | kb/config/ |
| Handler | {{N}} | {{N}} | 100% | kb/handler/ |
| Job/Task | {{N}} | {{N}} | 100% | kb/job-task/ |
| MQ Listener | {{N}} | {{N}} | 100% | kb/mq-listener/ |
| Utils | {{N}} | {{N}} | 100% | kb/utils/ |
| Annotation | {{N}} | {{N}} | 100% | kb/annotation/ |
| Exception | {{N}} | {{N}} | 100% | kb/exception/ |
| Enum | {{N}} | {{N}} | 100% | kb/enum/ |
| Constants | {{N}} | {{N}} | 100% | kb/constants/ |
| **总计** | **{{TOTAL}}** | **{{TOTAL}}** | **{{RATE}}%** | - |

### 按批次统计

| 批次 | 文件序号范围 | 文件数 | 耗时 | 状态 |
|------|--------------|--------|------|------|
| 1 | 1-10 | 10 | 2m | ✅ |
| 2 | 11-20 | 10 | 3m | ✅ |
| 3 | 21-30 | 10 | 2m | ✅ |
| 4 | 31-40 | 10 | 3m | ✅ |
| 5 | 41-50 | 10 | 2m | ✅ |
| ... | ... | ... | ... | ... |

---

## 📁 输出结构

```
kb/
├── README.md                  # 总索引 ✅
├── architecture.md            # 架构依赖图 ✅
│
├── interface/                 # {{N}} 个文档
├── abstract/                  # {{N}} 个文档
├── controller/                # {{N}} 个文档
├── service/                   # {{N}} 个文档
├── mapper/                    # {{N}} 个文档
├── entity/                    # {{N}} 个文档
├── dto/                       # {{N}} 个文档
├── vo-response/               # {{N}} 个文档
├── request/                   # {{N}} 个文档
├── feign/                     # {{N}} 个文档
├── config/                    # {{N}} 个文档
├── handler/                   # {{N}} 个文档
├── job-task/                  # {{N}} 个文档
├── mq-listener/               # {{N}} 个文档
├── utils/                     # {{N}} 个文档
├── annotation/                # {{N}} 个文档
├── exception/                 # {{N}} 个文档
├── enum/                      # {{N}} 个文档
├── constants/                 # {{N}} 个文档
│
└── extra/                     # 扩展文档（如已生成）
    ├── directory-structure.md
    ├── business-flows.md
    └── ...
```

---

## 🔗 依赖分析结果

### 依赖统计

| 指标 | 数值 |
|------|------|
| 总依赖关系数 | {{N}} |
| 平均依赖数/类 | {{N}} |
| 最大依赖数 | {{N}} ({{CLASS_NAME}}) |
| 被依赖最多 | {{CLASS_NAME}} (被 {{N}} 个类依赖) |

### 循环依赖检测

| 状态 | 结果 |
|------|------|
| 检测结果 | {{RESULT}} （无循环依赖 / 发现 N 处循环依赖） |

**循环依赖详情**（如有）:
```
{{CLASS_A}} → {{CLASS_B}} → {{CLASS_C}} → {{CLASS_A}}
```

### 分层违规检测

| 违规类型 | 数量 | 详情 |
|----------|------|------|
| Controller → Mapper | {{N}} | {{DETAILS}} |
| Service → Controller | {{N}} | {{DETAILS}} |
| Mapper → Controller | {{N}} | {{DETAILS}} |
| Entity → Service | {{N}} | {{DETAILS}} |

---

## ✅ 质量检查结果

| 检查项 | 结果 | 问题数 | 说明 |
|--------|------|--------|------|
| 文档完整性 | ✅ 通过 | 0 | 所有类都有对应文档 |
| 方法签名完整 | ✅ 通过 | 0 | 所有方法含完整签名 |
| 依赖关系完整 | ✅ 通过 | 0 | 双向依赖已记录 |
| 索引链接有效 | ✅ 通过 | 0 | README.md 链接正确 |
| 类型识别正确 | ✅ 通过 | 0 | 基于注解识别 |

---

## ⚠️ 问题与警告

### 处理失败的文件

| 文件 | 原因 | 建议 |
|------|------|------|
| {{FILE}} | {{REASON}} | {{SUGGESTION}} |

*如无失败文件，此章节为空*

### 警告信息

| 类型 | 数量 | 说明 |
|------|------|------|
| 大文件（>500行） | {{N}} | 建议拆分 |
| 高耦合类（>10依赖） | {{N}} | 建议重构 |
| 无注释类 | {{N}} | 建议补充 |

---

## 📈 扩展文档生成

| 文档 | 状态 | 说明 |
|------|------|------|
| directory-structure.md | ✅ 已生成 / ⏭️ 跳过 | 目录结构 |
| business-flows.md | ✅ 已生成 / ⏭️ 跳过 | 业务流程 |
| api-contracts.md | ✅ 已生成 / ⏭️ 跳过 | API 契约 |
| database-structure.md | ✅ 已生成 / ⏭️ 跳过 | 数据库结构 |
| spring-configuration.md | ✅ 已生成 / ⏭️ 跳过 | Spring 配置 |
| interceptors-aspects.md | ✅ 已生成 / ⏭️ 跳过 | 拦截器切面 |
| security-auth.md | ✅ 已生成 / ⏭️ 跳过 | 安全认证 |
| environment-config.md | ✅ 已生成 / ⏭️ 跳过 | 环境配置 |
| third-party-interfaces.md | ✅ 已生成 / ⏭️ 跳过 | 第三方接口 |
| third-party-components.md | ✅ 已生成 / ⏭️ 跳过 | 第三方组件 |

---

## 🎯 后续建议

### 文档维护

1. **定期更新**: 代码变更后重新生成相关文档
2. **增量更新**: 仅更新变更的类文档
3. **版本管理**: 将 `kb/` 目录纳入版本控制

### 架构优化建议

基于依赖分析，建议关注以下问题：

| 优先级 | 问题 | 涉及类 | 建议 |
|--------|------|--------|------|
| P1 | {{ISSUE}} | {{CLASSES}} | {{SUGGESTION}} |
| P2 | {{ISSUE}} | {{CLASSES}} | {{SUGGESTION}} |
| P3 | {{ISSUE}} | {{CLASSES}} | {{SUGGESTION}} |

---

## 📝 执行时间线

| 时间 | 阶段 | 耗时 |
|------|------|------|
| {{TIME}} | 开始扫描 | - |
| {{TIME}} | 扫描完成，开始生成 | {{DURATION}} |
| {{TIME}} | 目录 1-5 完成 | {{DURATION}} |
| {{TIME}} | 目录 6-10 完成 | {{DURATION}} |
| {{TIME}} | 所有目录完成 | {{DURATION}} |
| {{TIME}} | 汇总阶段完成 | {{DURATION}} |
| {{TIME}} | 质量检查完成 | {{DURATION}} |
| {{TIME}} | 生成报告 | {{DURATION}} |
| **总计** | - | **{{TOTAL_TIME}}** |

---

## 🏁 结论

知识库生成**{{RESULT}}**完成。

- ✅ 共处理 **{{TOTAL_FILES}}** 个 Java 文件
- ✅ 生成 **{{TOTAL_DOCS}}** 个类文档
- ✅ 生成 **1** 个架构文档
- ✅ 生成 **1** 个总索引
- {{EXTRA_DOCS}} 扩展文档

**知识库入口**: `kb/README.md`

---

*报告生成时间: {{REPORT_DATE}}*

