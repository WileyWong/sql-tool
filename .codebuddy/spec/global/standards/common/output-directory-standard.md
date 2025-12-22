---
name: output-directory-standard
description: 建立统一的输出目录规范，确保所有生成的文档都有明确的来源和追踪，支持增量式变更和可回滚性
category: common
keywords: [输出目录, 变更管理, 工作空间, 文件组织, 版本管理]
---

# 输出目录规范

---

## 📋 目录

1. [概述](#概述)
2. [核心规则](#核心规则)
3. [目录结构](#目录结构)
4. [变更 ID 规范](#变更-id-规范)
5. [文件头部规范](#文件头部规范)
6. [输出路径规范](#输出路径规范)
7. [验证规则](#验证规则)
8. [最佳实践](#最佳实践)

---

## 概述

### 目的

建立统一的输出目录规范，确保：
- ✅ 所有生成的文档都有明确的来源和追踪
- ✅ 所有输出都关联到具体的变更
- ✅ 支持增量式变更和可回滚性
- ✅ 便于查询和复用

### 核心原则

1. **变更驱动** - 所有输出都关联到变更 ID
2. **阶段分类** - 按开发阶段组织输出
3. **增量式** - 支持版本管理和增量更新
4. **可追踪** - 完整的变更历史和审计日志

---

## 核心规则

### 变更 ID 生成规则

**格式**: `YYYY-MM-DD-feature-name`

**示例**:
- `2025-11-03-user-auth` - 用户认证功能
- `2025-11-03-avatar-upload` - 头像上传功能
- `2025-11-04-search-optimization` - 搜索优化

**规则**:
- 日期格式: `YYYY-MM-DD`（创建日期）
- 功能名称: 小写字母 + 连字符
- 长度: 不超过 50 个字符
- 唯一性: 同一天内不能重复

### 输出路径生成规则

**核心规则**: `workspace/{变更ID}`

所有输出都必须放在 `workspace/{变更ID}` 目录下，按阶段分类。

**完整路径格式**:
```
workspace/{变更ID}/{阶段}/{文件名}
```

**示例**:
```
workspace/2025-11-03-user-auth/requirements/requirements.md
workspace/2025-11-03-user-auth/design/database-design.md
workspace/2025-11-03-user-auth/planning/tasks.md
workspace/2025-11-03-user-auth/implementation/code/src/...
```

---

## 目录结构

### 顶级目录

```
workspace/
└── {变更ID}/
    ├── requirements/          # 需求阶段输出
    ├── design/               # 设计阶段输出
    ├── planning/             # 规划阶段输出
    ├── implementation/       # 实现阶段输出
    ├── documentation/        # 文档阶段输出
    └── deployment/           # 部署阶段输出
```

### 完整目录结构

```
workspace/
│
└── {变更ID}/
    │
    ├── requirements/
    │   ├── requirements.md              # 需求文档
    │   ├── clarifications.md            # 澄清记录
    │   └── validation-report.md         # 验证报告
    │
    ├── design/
    │   ├── delivery-plan.md             # 交付方案
    │   ├── architecture.md              # 架构设计
    │   ├── database-design.md           # 数据库设计
    │   ├── api-design.yaml              # API 设计
    │   ├── process-design.md            # 流程设计
    │   ├── entity-design.md             # 实体设计
    │   └── deployment-design.md         # 部署设计
    │
    ├── planning/
    │   ├── tech-plan.md                 # 技术方案
    │   └── tasks.md                     # 任务清单
    │
    ├── implementation/
    │   ├── code/                        # 源代码
    │   ├── tests/                       # 测试代码
    │   └── review-report.md             # 审查报告
    │
    ├── documentation/
    │   ├── api-docs.md                  # API 文档
    │   ├── user-guide.md                # 用户指南
    │   └── developer-guide.md           # 开发指南
    │
    └── deployment/
        ├── deployment-plan.md           # 部署计划
        ├── deployment-report.md         # 部署报告
        └── rollback-plan.md             # 回滚计划
```

---

## 变更 ID 规范

### 生成方式

#### 方式 1: 手动指定

```bash
# 创建变更时指定
spec-create-change --id 2025-11-03-user-auth
```

#### 方式 2: 自动生成

```bash
# 使用当前日期和功能名称自动生成
spec-create-change --name "user-auth"
# 生成: 2025-11-03-user-auth
```

#### 方式 3: 从 Git 分支名提取

```bash
# 从 Git 分支名提取
# 分支名: feature/2025-11-03-user-auth
# 提取: 2025-11-03-user-auth
```

### 变更 ID 的生命周期

```
创建 (Proposed)
   ↓
审查 (Under Review)
   ↓
批准 (Approved)
   ↓
实施 (Implemented)
   ↓
归档 (Archived)
```

**关键时间点**:
- `created_at` - 变更创建时间
- `approved_at` - 变更批准时间
- `implemented_at` - 变更实施完成时间
- `archived_at` - 变更归档时间

---

## 文件头部规范

### YAML Frontmatter 格式

**标准格式**：所有工作空间输出文档必须包含以下 YAML Frontmatter：

```yaml
---
# 基本信息
name: database-design                    # 文档标识名称（kebab-case）
description: 用户认证功能的数据库设计文档  # 文档描述
category: design                         # 文档分类
keywords: [数据库设计, 用户认证, 表结构]  # 关键词

# 优先级和版本

# 时间信息

# 变更追踪（工作空间文档特有）
change_id: 2025-11-03-user-auth         # 变更ID
change_title: 用户认证功能               # 变更标题
change_status: proposed                  # proposed | approved | implemented | archived
stage: design                            # requirements | design | planning | implementation | documentation | deployment

# 关联信息（可选）
related_requirements: workspace/2025-11-03-user-auth/requirements/requirements.md
related_memory: .spec-code/memory/constitution.md
related_changes: []

# 版本历史（可选）
version_history:
  - version: 1.0.0
    date: 2025-11-03
    changes: 初始设计

# 合规性验证（可选）
compliance_checked: true                 # 是否已检查合规性
compliance_status: passed                # passed | failed | pending

# 许可证
---
```

### 字段说明

#### 必填字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `name` | 文档标识名称（kebab-case） | `database-design` |
| `description` | 文档简要描述 | `用户认证功能的数据库设计` |
| `category` | 文档分类 | `design`, `requirements`, `implementation` |
| `tech_stack` | 相关技术栈（数组） | `[mysql, mybatis-plus]` |
| `keywords` | 关键词（数组，便于搜索） | `[数据库设计, 用户认证]` |
| `priority` | 优先级 | `critical`, `high`, `medium`, `low` |
| `version` | 语义化版本号 | `1.0.0` |
| `author` | 作者/团队 | `Spec-Code Team` |
| `created_at` | 创建日期 (YYYY-MM-DD) | `2025-11-03` |
| `updated_at` | 更新日期 (YYYY-MM-DD) | `2025-11-03` |
| `change_id` | 变更ID（关联到工作空间目录） | `2025-11-03-user-auth` |
| `change_title` | 变更标题 | `用户认证功能` |
| `change_status` | 变更状态 | `proposed`, `approved`, `implemented`, `archived` |
| `stage` | 开发阶段 | `requirements`, `design`, `planning`, `implementation`, `documentation`, `deployment` |
| `license` | 许可证 | `遵循项目许可证` |

#### 可选字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `related_requirements` | 关联需求文档（相对路径） | `workspace/2025-11-03-user-auth/requirements/requirements.md` |
| `related_memory` | 关联记忆文档（相对路径） | `.spec-code/memory/constitution.md` |
| `related_changes` | 关联变更列表（数组） | `[2025-11-01-xxx, 2025-11-02-yyy]` |
| `version_history` | 版本历史（数组对象） | 见示例 |
| `compliance_checked` | 是否已检查合规性 | `true`, `false` |
| `compliance_status` | 合规性状态 | `passed`, `failed`, `pending` |
| `approved_at` | 变更批准时间 | `2025-11-04` |
| `implemented_at` | 变更实施完成时间 | `2025-11-05` |
| `archived_at` | 变更归档时间 | `2025-11-10` |

### 文件头部示例

#### 数据库设计文档

```yaml
---
name: database-design
description: 用户认证功能的数据库设计文档
category: design
keywords: [数据库设计, 用户认证, 表结构, 索引优化]
change_id: 2025-11-03-user-auth
change_title: 用户认证功能
change_status: proposed
stage: design
related_requirements: workspace/2025-11-03-user-auth/requirements/requirements.md
related_memory: .spec-code/memory/constitution.md
version_history:
  - version: 1.0.0
    date: 2025-11-03
    changes: 初始设计
compliance_checked: true
compliance_status: passed
---

# 数据库设计

## 概述

本文档描述用户认证功能的数据库设计...
```

#### API 设计文档

```yaml
---
name: api-design
description: 用户认证功能的RESTful API设计
category: design
keywords: [API设计, 用户认证, RESTful, OpenAPI]
change_id: 2025-11-03-user-auth
change_title: 用户认证功能
change_status: proposed
stage: design
related_requirements: workspace/2025-11-03-user-auth/requirements/requirements.md
related_memory: .spec-code/memory/constitution.md
version_history:
  - version: 1.0.0
    date: 2025-11-03
    changes: 初始设计
compliance_checked: true
compliance_status: passed
---

openapi: 3.0.0
info:
  title: User Authentication API
  version: 1.0.0
...
```

#### 需求文档

```yaml
---
name: requirements
description: 用户认证功能需求文档
category: requirements
keywords: [需求文档, 用户认证, 功能需求, 非功能需求]
change_id: 2025-11-03-user-auth
change_title: 用户认证功能
change_status: proposed
stage: requirements
related_memory: .spec-code/memory/constitution.md
---

# 用户认证功能需求

## 功能需求

...
```

---

## 输出路径规范

### 路径格式

```
workspace/{变更ID}/{阶段}/{文件名}
```

### 路径示例

#### 需求阶段

```
workspace/2025-11-03-user-auth/requirements/requirements.md
workspace/2025-11-03-user-auth/requirements/clarifications.md
workspace/2025-11-03-user-auth/requirements/validation-report.md
```

#### 设计阶段

```
workspace/2025-11-03-user-auth/design/delivery-plan.md
workspace/2025-11-03-user-auth/design/architecture.md
workspace/2025-11-03-user-auth/design/database-design.md
workspace/2025-11-03-user-auth/design/api-design.yaml
workspace/2025-11-03-user-auth/design/process-design.md
workspace/2025-11-03-user-auth/design/entity-design.md
workspace/2025-11-03-user-auth/design/deployment-design.md
```

#### 规划阶段

```
workspace/2025-11-03-user-auth/planning/tech-plan.md
workspace/2025-11-03-user-auth/planning/tasks.md
```

#### 实现阶段

```
workspace/2025-11-03-user-auth/implementation/code/src/...
workspace/2025-11-03-user-auth/implementation/tests/...
workspace/2025-11-03-user-auth/implementation/review-report.md
```

#### 文档阶段

```
workspace/2025-11-03-user-auth/documentation/api-docs.md
workspace/2025-11-03-user-auth/documentation/user-guide.md
workspace/2025-11-03-user-auth/documentation/developer-guide.md
```

#### 部署阶段

```
workspace/2025-11-03-user-auth/deployment/deployment-plan.md
workspace/2025-11-03-user-auth/deployment/deployment-report.md
workspace/2025-11-03-user-auth/deployment/rollback-plan.md
```

### 文件命名规范

**规则**:
- 使用 kebab-case（小写字母 + 连字符）
- 避免特殊字符和空格
- 文件名应该清晰表达内容
- 长度不超过 50 个字符

**示例**:
- ✅ `database-design.md`
- ✅ `api-design.yaml`
- ✅ `deployment-plan.md`
- ❌ `Database Design.md`
- ❌ `api_design.md`
- ❌ `API设计.md`

---

## 验证规则

### 输出验证清单

#### 1. 目录结构验证

- [ ] 输出目录存在
- [ ] 目录名称符合规范
- [ ] 目录结构完整

#### 2. 文件验证

- [ ] 文件存在
- [ ] 文件名符合规范
- [ ] 文件格式正确（Markdown/YAML）

#### 3. 文件头部验证

- [ ] 包含 YAML Frontmatter
- [ ] 包含 `change_id` 字段
- [ ] 包含 `document_type` 字段
- [ ] 包含 `stage` 字段
- [ ] 包含 `created_at` 字段
- [ ] 包含 `author` 字段

#### 4. 内容验证

- [ ] 文件内容不为空
- [ ] 包含必要的章节
- [ ] 引用了项目记忆
- [ ] 引用了相关文档

#### 5. 关联验证

- [ ] 变更 ID 有效
- [ ] 相关文档存在
- [ ] 相关文档可访问

### 验证脚本

```bash
#!/bin/bash
# scripts/validate-output.sh

OUTPUT_FILE=$1

echo "验证输出文件: $OUTPUT_FILE"

# 1. 检查文件是否存在
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "❌ 错误: 文件不存在"
  exit 1
fi

# 2. 检查 YAML Frontmatter
if ! head -1 "$OUTPUT_FILE" | grep -q "^---"; then
  echo "❌ 错误: 缺少 YAML Frontmatter"
  exit 1
fi

# 3. 检查必要字段
for field in change_id document_type stage created_at author; do
  if ! grep -q "^$field:" "$OUTPUT_FILE"; then
    echo "❌ 错误: 缺少 $field 字段"
    exit 1
  fi
done

# 4. 检查变更 ID 格式
CHANGE_ID=$(grep -oP '^change_id: \K.*' "$OUTPUT_FILE" | head -1)
if ! echo "$CHANGE_ID" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9-]+$'; then
  echo "❌ 错误: 变更 ID 格式不正确: $CHANGE_ID"
  exit 1
fi

# 5. 检查相关文档
RELATED_REQUIREMENTS=$(grep -oP '^related_requirements: \K.*' "$OUTPUT_FILE" | head -1)
if [ -n "$RELATED_REQUIREMENTS" ] && [ ! -f "$RELATED_REQUIREMENTS" ]; then
  echo "⚠️  警告: 相关需求文档不存在: $RELATED_REQUIREMENTS"
fi

echo "✅ 验证通过"
exit 0
```

---

## 最佳实践

### 1. 及时创建变更

**✅ 最佳实践**:
```bash
# 在开始工作前创建变更
spec-create-change --name "user-auth"

# 获得变更 ID
# 2025-11-03-user-auth
```

**❌ 反模式**:
```bash
# 工作完成后才创建变更
# 无法追踪工作过程
```

### 2. 一致的输出路径

**✅ 最佳实践**:
```
workspace/2025-11-03-user-auth/design/database-design.md
workspace/2025-11-03-user-auth/design/api-design.yaml
workspace/2025-11-03-user-auth/design/process-design.md
```

**❌ 反模式**:
```
workspace/output/database-design.md
workspace/db-design.md
output/design/db.md
```

### 3. 完整的文件头部

**✅ 最佳实践**:
```yaml
---
change_id: 2025-11-03-user-auth
document_type: database-design
stage: design
author: AI Assistant
related_requirements: workspace/2025-11-03-user-auth/requirements/requirements.md
compliance_checked: true
---
```

**❌ 反模式**:
```yaml
---
title: Database Design
---
```

### 4. 清晰的文件名

**✅ 最佳实践**:
- `database-design.md` - 清晰表达内容
- `api-design.yaml` - 包含文件格式
- `deployment-plan.md` - 描述性名称

**❌ 反模式**:
- `design.md` - 太模糊
- `db.md` - 缩写不清晰
- `file1.md` - 无意义

### 5. 定期验证

**✅ 最佳实践**:
```bash
# 每次生成输出后验证
./scripts/validate-output.sh workspace/2025-11-03-user-auth/design/database-design.md

# 定期批量验证
find workspace -name "*.md" -o -name "*.yaml" | xargs -I {} ./scripts/validate-output.sh {}
```

**❌ 反模式**:
```bash
# 不验证输出
# 输出质量无法保证
```

---

## 常见问题

### Q1: 如何处理多个相关的输出？

**A**: 使用相同的变更 ID，在不同的文件中组织：

```
workspace/2025-11-03-user-auth/design/
├── database-design.md
├── api-design.yaml
├── process-design.md
└── entity-design.md
```

### Q2: 如何处理跨阶段的输出？

**A**: 在每个阶段创建对应的输出目录，使用相同的变更 ID：

```
workspace/2025-11-03-user-auth/requirements/requirements.md
workspace/2025-11-03-user-auth/design/database-design.md
workspace/2025-11-03-user-auth/implementation/code/...
```

### Q3: 如何处理输出的版本管理？

**A**: 使用 `version` 字段和 `version_history` 字段：

```yaml
version_history:
  - version: 1.0
    date: 2025-11-03
    changes: 初始设计
  - version: 1.1
    date: 2025-11-04
    changes: 添加图片压缩功能
  - version: 1.2
    date: 2025-11-05
    changes: 优化性能
```

### Q4: 如何处理输出的归档？

**A**: 当变更完成后，将输出移到归档目录：

```bash
# 创建归档目录
mkdir -p archive/2025-11/

# 移动输出
mv workspace/2025-11-03-user-auth archive/2025-11/

# 更新变更状态
# change_status: archived
```

### Q5: 如何处理输出的删除？

**A**: 不建议删除输出，而是标记为 `deprecated`：

```yaml
---
change_id: 2025-11-03-user-auth
change_status: deprecated
deprecation_reason: 功能已取消
deprecation_date: 2025-11-10
replacement: 2025-11-10-new-auth
---
```

---

## 总结

### 核心要点

1. **变更驱动** - 所有输出都关联到变更 ID
2. **统一路径** - 所有输出都在 `workspace/{变更ID}` 下
3. **阶段分类** - 按开发阶段组织输出
4. **规范命名** - 统一的目录和文件命名规范
5. **完整头部** - 所有文件都包含 YAML Frontmatter
6. **自动验证** - 使用脚本自动验证输出合规性

### 关键文件

- `workspace/` - 所有输出的根目录
- `scripts/validate-output.sh` - 输出验证脚本
- `.spec-code/memory/` - 项目记忆系统
- `changes/` - 变更管理系统

### 下一步

1. 在所有 Commands 中应用此规范
2. 在所有 Skills 中应用此规范
3. 创建自动化验证脚本
4. 定期审查和优化规范

---

**文档版本**: 1.1  
**最后更新**: 2025-11-03  
**维护者**: AI Assistant  
**参考**: OpenSpec, spec-kit  
**迁移日期**: 2025-11-03
