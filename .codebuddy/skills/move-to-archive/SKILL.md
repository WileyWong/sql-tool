---
name: move-to-archive
description: 将过时、废弃或不再使用的文件和目录移动到归档目录，支持多种类型归档，保持项目清洁并保留历史记录
category: project-management
keywords: [文件归档, 项目清理, 版本管理, 历史保存, 空间优化]
---

# Skill: 归档过时内容

> ⚠️ **必须遵守的规范内容**: [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的归档管理规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

---

## 🎯 目标

将过时、废弃或不再使用的内容移动到归档目录，实现：

- **保持清洁** - 移除过时内容，保持项目整洁
- **保留历史** - 归档而非删除，可追溯和恢复
- **结构化管理** - 按类型和时间组织，便于查找
- **数据完整性** - 确保移动过程无数据丢失

## 📚 归档规则

### 应该归档的内容 ✅

- **废弃功能**: 已下线的功能代码、不再维护的模块
- **过时文档**: 旧版本设计文档、已失效规范
- **临时文件**: 已完成的临时脚本、一次性工具
- **旧版本**: 被重构替换的代码、升级前配置

### 不应该归档的内容 ❌

- **活跃代码** - 仍在使用的功能
- **当前文档** - 有效的文档和规范
- **配置文件** - 当前环境的配置
- **测试代码** - 仍在运行的测试

详见 [reference.md](mdc:skills/move-to-archive/reference.md)

---

## 🏗️ 归档目录结构

```
spec/archive/
├── skills/                      # 按类型分类
│   └── 2024-01-15_old-skill/   # 时间戳_描述
│       ├── SKILL.md
│       ├── ARCHIVE-INFO.md     # 归档元数据
│       └── (原始文件)
├── commands/
├── docs/
├── templates/
├── standards/
└── README.md                    # 全局索引
```

**命名规范**: `{YYYY-MM-DD}_{描述性名称}/`

**示例**: `2024-01-15_old-authentication-skill/`

---

## 🔄 执行流程

### 阶段 1: 验证和准备

**验证源路径**:
```bash
if [ ! -e "<source-path>" ]; then
    echo "错误: 源路径不存在"
    exit 1
fi
```

**确认归档信息**:
- 归档分类 (skills/commands/docs/templates/standards)
- 归档原因
- 替代方案 (如果有)

**警告用户**:
```
⚠️ 即将归档以下内容:
- 源路径: <source-path>
- 目标: spec/archive/<category>/<timestamp>_<name>/
- 原因: <reason>

继续? (y/n)
```

---

### 阶段 2: 创建归档目录

**生成目录名称**:
```bash
TIMESTAMP=$(date +%Y-%m-%d)
ARCHIVE_NAME="${TIMESTAMP}_<descriptive-name>"
ARCHIVE_PATH="spec/archive/<category>/${ARCHIVE_NAME}"
```

**创建目录结构**:
```bash
mkdir -p "spec/archive/<category>"
mkdir -p "${ARCHIVE_PATH}"
```

**生成归档元数据**:

创建 `ARCHIVE-INFO.md` 包含：基本信息、归档原因、替代方案、技术信息、链接更新记录、回滚方法

详细模板见 [reference.md](mdc:skills/move-to-archive/reference.md#元数据规范)

---

### 阶段 3: 移动内容

**复制文件**:
```bash
cp -r <source-path> "${ARCHIVE_PATH}/"
```

**检查依赖链接**:
```bash
grep -r "<source-path>" . --exclude-dir=".git" \
    --exclude-dir="node_modules" \
    --exclude-dir="spec/archive"
```

**记录链接清单**:

如发现链接，记录到 `ARCHIVE-INFO.md`:
```markdown
## 需要更新的链接
- [ ] docs/api.md:42 - 引用了旧路径
- [ ] README.md:15 - 链接需要更新
```

**删除源文件** (可选):
```bash
read -p "删除源文件? (y/n) " confirm
if [ "$confirm" = "y" ]; then
    rm -rf <source-path>
fi
```

---

### 阶段 4: 更新链接

更新所有类型链接（相对/绝对/MDC）指向归档路径

**示例**:
```bash
# 原链接
[旧文档](mdc:skills/old-skill/README.md)

# 更新后
[旧文档(已归档)](mdc:.codebuddy/spec/archive/skills/2024-01-15_old-skill/README.md)
```

**验证链接**:
```bash
find . -name "*.md" -exec grep -l "mdc:skills/old-skill" {} \;
```

**生成链接更新报告**:

添加到 `ARCHIVE-INFO.md`:
```markdown
## 链接更新记录
- [x] docs/api.md:42 - 已更新
- [x] README.md:15 - 已更新
- [x] 共更新 <count> 个链接
- [x] 验证通过，无断链
```

---

### 阶段 5: 更新索引

**更新全局索引** `spec/archive/README.md`:

```markdown
# 归档索引

## 归档统计
- **总归档数**: <count>
- **最近归档**: <date>
- **归档分类**: skills(<count>), commands(<count>)...

## 最近归档

### <date>
- **路径**: `<category>/<timestamp>_<name>`
- **原因**: <reason>
- **类型**: <category>

## 按类别归档

### Skills (<count>)
1. [<date> - <name>](<category>/<timestamp>_<name>/)

## 归档检索

```bash
# 搜索归档内容
find spec/archive -name "*<keyword>*"

# 搜索归档原因
grep -r "<keyword>" spec/archive/*/ARCHIVE-INFO.md
\`\`\`
```

**更新分类索引**:

如果 `spec/archive/<category>/README.md` 存在，更新它。

---

### 阶段 6: 生成归档报告

生成归档报告包含：归档详情、链接更新、验证结果、回滚方法

详细格式见 [examples.md](mdc:skills/move-to-archive/examples.md#输出示例)

---

## ⚠️ 错误处理

### 场景 1: 目标目录已存在

**问题**: `spec/archive/<category>/<name>/` 已存在

**处理**:
1. 检查现有目录内容
2. 提示用户选择:
   - 重命名新归档 (添加后缀)
   - 覆盖现有归档 (先备份)
   - 取消操作
3. 根据用户选择执行

### 场景 2: 移动失败

**问题**: 复制操作失败 (权限、磁盘空间等)

**处理**:
1. 记录详细错误信息
2. 回滚已创建的目录
3. 提示错误原因和解决建议
4. 不删除源文件

### 场景 3: 链接更新失败

**问题**: 某些链接无法自动更新

**处理**:
1. 记录无法更新的链接
2. 生成手动修复清单
3. 在归档报告中标注
4. 提供修复指南

### 场景 4: 源路径不存在

**问题**: 源路径无效

**处理**:
1. 立即终止操作
2. 提示用户检查路径
3. 建议可能的正确路径

---

## 💡 最佳实践

### 归档时机
- ✅ 功能完全废弃后立即归档
- ✅ 新版本稳定运行后归档旧版本
- ✅ 定期检查 (每季度)
- ❌ 不要过早归档可能使用的内容

### 归档原因
- ✅ 记录为什么归档
- ✅ 说明替代方案
- ✅ 提供相关链接
- ✅ 标注注意事项

### 团队协作
- ✅ 归档前通知团队
- ✅ 在变更日志中记录
- ✅ Code Review 检查
- ✅ 定期回顾归档内容

详见 [reference.md](mdc:skills/move-to-archive/reference.md)

---

## ✅ 归档检查清单

### 归档前检查

- [ ] 确认内容确实不再使用
- [ ] 通知团队成员
- [ ] 检查依赖关系
- [ ] 准备替代方案文档
- [ ] 确认归档分类正确
- [ ] 准备详细的归档原因

### 归档执行检查

- [ ] 归档目录创建成功
- [ ] 所有文件完整复制
- [ ] ARCHIVE-INFO.md 内容完整
- [ ] 链接检查完成
- [ ] 链接更新记录清晰

### 归档后验证

- [ ] 归档索引已更新
- [ ] 源文件处理正确 (删除/保留)
- [ ] 相关文档引用已更新
- [ ] 无断链
- [ ] 团队成员已知晓
- [ ] 归档报告已生成

---

## 📊 输出

### 成功输出

```
✅ 归档完成!

归档路径: spec/archive/<category>/<timestamp>_<name>/
元数据文件: ARCHIVE-INFO.md
更新链接: <count> 个
归档索引: 已更新

查看详细报告: 归档报告.md
```

### 失败输出

```
❌ 归档失败: <error-message>

已回滚操作，源文件未被修改。
详细错误信息请查看日志。
```

---

## 🔧 使用示例

### 基本用法

```bash
# 归档废弃的技能
归档 skills/old-authentication skills "认证机制已升级到 OAuth 2.0"

# 归档过时的文档
归档 docs/old-design-v1.md docs "设计已更新到 v2 版本"

# 归档临时脚本
归档 scripts/temp-migration.sh scripts "数据迁移已完成"
```

### 高级用法

详见 [examples.md](mdc:skills/move-to-archive/examples.md)

---

## 🔗 相关资源

- **详细参考**: [reference.md](mdc:skills/move-to-archive/reference.md)
- **完整示例**: [examples.md](mdc:skills/move-to-archive/examples.md)
- **验证清单**: [checklist.md](mdc:skills/move-to-archive/checklist.md)

---

## 🔄 版本历史

### v3.0 (2025-11-10) - 融合优化版

**核心改进**:
- ✅ **融合优势** - 结合 V1 技术流程和 V2 通用性
- ✅ **链接管理** - 完整的链接检查和更新流程
- ✅ **元数据增强** - 融合业务和技术信息
- ✅ **错误处理** - 系统化的错误处理机制
- ✅ **简洁优化** - 遵循 Claude Skill 简洁性原则
- ✅ **通用归档** - 支持多种类型内容归档

**主要特性**:
- 渐进式披露设计
- 完整的链接更新流程 (来自 V1)
- 通用归档结构 (来自 V2)
- 详细的归档元数据 (融合 V1+V2)
- 系统化错误处理 (来自 V1)
- 最佳实践指导 (来自 V2)

### v2.0 (2024-XX-XX)
- 通用归档支持、最佳实践、自动化功能

### v1.0 (2024-XX-XX)
- 初始版本，变更目录归档
