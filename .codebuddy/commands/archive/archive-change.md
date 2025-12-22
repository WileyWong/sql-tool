---
command_id: archive.archive-change
command_name: 归档变更
category: archive
description: 归档单个变更 - 将活跃变更从 workspace/{变更ID}/ 移动到 workspace/archived/{变更ID}/，包括验证、准备、移动、更新等完整流程，并在归档完成后调用 init-project-memory Skill 更新项目记忆
---

# Command: 归档变更

> ⚠️ **必须遵守**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的变更管理规范

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
> - 输出路径: `workspace/archived/{变更ID}/`
> - 文件格式: Markdown + YAML Frontmatter
> - 文件名: `COMPLETION_REPORT.md`（完成报告）
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Command 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **必须遵守**: [通用规范索引](mdc:.codebuddy/spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

## 🧠 项目记忆约束

**关键约束**:
1. **变更 ID 格式**: 遵循 `.spec-code/memory/context.md` 中定义的格式
2. **归档原因**: 必须从预定义列表中选择（completed、deprecated、on-hold 等）
3. **依赖检查**: 遵循 `.spec-code/memory/constitution.md` 中的依赖管理规则
4. **记忆更新**: 归档完成后必须调用 [init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md) 更新项目记忆

## 📋 执行流程

### 步骤 1: 获取变更 ID

**方式 1: 直接指定**
```bash
archive-change CHG-2024-001
```

**方式 2: 交互式选择**
如果 `workspace/` 下有多个变更目录，系统会列出所有活跃变更，让用户选择：

```
请选择要归档的变更:

1. CHG-2024-001 - 需求管理系统完善 [状态: 已完成]
2. CHG-2024-002 - 用户认证功能 [状态: 进行中]
3. CHG-2024-003 - 数据库优化 [状态: 已完成]

请输入序号 (1-3): _
```

**验证变更存在性**:
- 检查 `workspace/{变更ID}/` 目录是否存在
- 检查是否已在归档目录中
- 验证变更 ID 格式是否符合规范

### 步骤 2: 验证变更状态

**前置检查**:
1. ✅ 检查变更目录结构完整性
2. ✅ 验证必需文件是否存在（CHANGE.md、README.md 等）
3. ✅ 检查是否有未提交的工作
4. ✅ 验证依赖关系（如果启用依赖检查）

**依赖检查**（可选）:
```
检查变更依赖关系...
- CHG-2024-001 依赖于: 无
- 被以下变更依赖: CHG-2024-005

⚠️ 警告: 变更 CHG-2024-005 依赖于此变更
是否继续归档? (y/n): _
```

### 步骤 3: 确认归档原因

提示用户选择归档原因：

```
请选择归档原因:

1. completed    - 变更已完成（所有任务已完成并验证）
2. deprecated   - 变更已废弃（不再需要或被替代）
3. on-hold      - 变更暂停（暂时搁置，可能恢复）
4. merged       - 变更已合并（合并到其他变更）
5. cancelled    - 变更已取消（明确不再执行）
6. other        - 其他原因（需要额外说明）

请输入序号 (1-6): _
```

**如果选择 "other"，需要输入详细说明**:
```
请输入归档原因说明: _
```

### 步骤 4: 调用 Skills 执行归档

**调用 Skill**: [move-to-archive](mdc:skills/move-to-archive/SKILL.md)

**执行内容**:
1. **验证阶段**
   - 验证变更状态和完整性
   - 检查目标归档目录是否已存在
   - 验证磁盘空间是否充足

2. **准备阶段**
   - 生成归档报告（archive-move-report.md）
   - 备份变更元数据（CHANGE.md）
   - 记录归档时间戳和操作者
   - 创建归档快照（可选）

3. **移动阶段**
   - 创建归档目标目录 `workspace/archived/{变更ID}/`
   - 移动所有文件和子目录
   - 保持文件权限和时间戳

4. **更新阶段**
   - 更新归档索引文件 `workspace/archived/index.md`
   - 更新活跃变更索引 `workspace/index.md`
   - 记录归档操作日志

### 步骤 5: 验证归档完整性

**验证检查**:
1. ✅ 确认源目录已删除 `workspace/{变更ID}/`
2. ✅ 确认目标目录存在 `workspace/archived/{变更ID}/`
3. ✅ 验证文件数量和大小一致
4. ✅ 检查归档报告已生成
5. ✅ 验证索引文件已更新

**如果验证失败**:
```
❌ 归档验证失败！

错误: 文件数量不匹配
- 预期: 15 个文件
- 实际: 14 个文件

正在回滚...
✅ 已回滚到归档前状态

请检查错误日志: workspace/logs/archive-error.log
```

### 步骤 6: 调用 init-project-memory Skill 更新项目记忆

**调用 Skill**: [init-project-memory Skill](mdc:skills/init-project-memory/SKILL.md)

**执行目的**:
- 更新项目上下文（context.md）中的变更历史
- 记录已完成的变更信息
- 更新项目统计数据（已完成变更数、总变更数等）
- 保持项目记忆与实际状态同步

**执行内容**:
1. 检测项目记忆状态
2. 收集最新的变更信息
3. 更新 context.md 中的变更历史部分
4. 更新项目统计数据
5. 生成更新报告

**验证方式**:
```bash
# 检查 context.md 是否已更新
cat .spec-code/memory/context.md | grep -A 10 "变更历史"

# 检查是否包含最新的归档变更信息
grep "CHG-2024-001" .spec-code/memory/context.md
```

### 步骤 7: 清理和后续处理

**清理工作**:
1. 清理临时文件和缓存
2. 更新相关文档中的变更引用
3. 通知相关依赖变更（如果有）
4. 生成归档通知（可选）

**后续建议**:
```
💡 后续建议:
- 如需恢复变更: restore-change CHG-2024-001
- 查看归档详情: cat workspace/archived/CHG-2024-001/archive-move-report.md
- 查看所有归档: list-archived-changes
- 清理旧归档: clean-old-archives --older-than 90d
```

### 步骤 8: 显示归档结果

显示完整的归档结果：

```
✅ 变更归档成功！

变更 ID: CHG-2024-001
变更标题: 需求管理系统完善
归档时间: 2024-02-15T14:35:00Z
归档原因: completed

原始位置: workspace/CHG-2024-001/
归档位置: workspace/archived/CHG-2024-001/

文件统计:
- 文件总数: 15
- 目录总数: 5
- 总大小: 2.5MB

✅ 项目记忆已更新！

更新内容:
- 变更历史: 已记录 CHG-2024-001 的完成信息
- 项目统计: 已完成变更数 +1
- 上下文信息: 已同步最新状态

下一步:
- 查看归档详情: cat workspace/archived/CHG-2024-001/archive-move-report.md
- 查看项目记忆: cat .spec-code/memory/context.md
- 查看归档索引: cat workspace/archived/index.md
- 恢复变更: restore-change CHG-2024-001
- 查看归档历史: list-archived-changes --recent 10
```

## 📝 使用示例

### 示例 1: 直接指定变更 ID

```bash
$ archive-change CHG-2024-001

请选择归档原因:
1. completed    - 变更已完成
2. deprecated   - 变更已废弃
3. on-hold      - 变更暂停
4. merged       - 变更已合并
5. other        - 其他原因

请输入序号 (1-5): 1

验证变更状态... ✅
准备归档... ✅
移动到归档目录... ✅

✅ 变更归档成功！

更新项目记忆... ✅
- 检测项目记忆状态
- 收集最新的变更信息
- 更新 context.md 中的变更历史
- 更新项目统计数据

✅ 项目记忆已更新！
```

### 示例 2: 交互式选择变更

```bash
$ archive-change

请选择要归档的变更:

1. CHG-2024-001 - 需求管理系统完善
2. CHG-2024-002 - 用户认证功能
3. CHG-2024-003 - 数据库优化

请输入序号 (1-3): 1

请选择归档原因:
1. completed    - 变更已完成
2. deprecated   - 变更已废弃
3. on-hold      - 变更暂停
4. merged       - 变更已合并
5. other        - 其他原因

请输入序号 (1-5): 1

验证变更状态... ✅
准备归档... ✅
移动到归档目录... ✅

✅ 变更归档成功！

更新项目记忆... ✅
✅ 项目记忆已更新！
```

### 示例 3: 指定归档原因

```bash
$ archive-change CHG-2024-001 --reason completed

验证变更状态... ✅
准备归档... ✅
移动到归档目录... ✅

✅ 变更归档成功！

更新项目记忆... ✅
✅ 项目记忆已更新！
```

## 🔧 命令选项

| 选项 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| `{变更ID}` | 要归档的变更 ID | - | `archive-change CHG-2024-001` |
| `--reason` | 归档原因 | - | `--reason completed` |
| `--force` | 跳过确认，直接执行 | false | `--force` |
| `--dry-run` | 模拟执行，不实际归档 | false | `--dry-run` |
| `--verbose` | 显示详细日志 | false | `--verbose` |

## ⚠️ 前置条件

### 必须满足
- ✅ 变更目录存在于 `workspace/` 下
- ✅ 变更目录结构完整（包含必需文件）
- ✅ 变更 ID 格式符合规范
- ✅ 有足够的磁盘空间

### 建议满足
- ✅ 所有工作已完成并验证
- ✅ 相关文档已更新
- ✅ 代码已提交到版本控制系统
- ✅ 已通知相关团队成员

## 🚫 限制条件

### 硬性限制
- ❌ 不能归档不存在的变更
- ❌ 不能归档已归档的变更（重复归档）
- ❌ 不能归档验证失败的变更
- ❌ 不能归档正在被其他进程使用的变更

### 可配置限制
- ⚠️ 不建议归档有未满足依赖的变更（可用 `--skip-dependency-check` 跳过）
- ⚠️ 不建议归档未完成的变更（可用 `--force` 强制执行）
- ⚠️ 不建议归档有未提交更改的变更（可用 `--force` 强制执行）

## 🛠️ 相关 Skills

### 核心 Skills
- **[move-to-archive](mdc:skills/move-to-archive/SKILL.md)** - 移动到归档目录（主要执行 Skill）
- **[init-project-memory](mdc:skills/init-project-memory/SKILL.md)** - 初始化项目记忆（用于更新项目上下文）

### Skill 执行顺序
1. 首先执行 `move-to-archive` - 完成变更的物理归档
2. 然后执行 `init-project-memory` - 更新项目记忆中的变更历史和统计数据

## ❓ 常见问题

### Q: 如果归档失败怎么办？

A: 系统会自动回滚，变更仍在 `workspace/{变更ID}/` 中。具体步骤：
1. 检查错误日志: `workspace/logs/archive-error.log`
2. 查看回滚报告: `workspace/logs/rollback-report.md`
3. 修复问题后重试
4. 如果多次失败，可以使用 `--dry-run` 模拟执行查看问题

### Q: 归档需要多长时间？

A: 取决于变更大小和复杂度：
- 小型变更（< 10MB）: 1-2 分钟
- 中型变更（10-100MB）: 2-5 分钟
- 大型变更（> 100MB）: 5-10 分钟
- 加上项目记忆更新，总耗时通常增加 30 秒 - 1 分钟

### Q: 可以批量归档多个变更吗？

A: 当前版本不支持批量归档。建议：
1. 使用脚本循环调用 `archive-change` 命令指定变更ID逐个归档
2. 注意批量归档时的依赖关系处理

### Q: 项目记忆更新会做什么？

A: 项目记忆更新会：
1. 更新 `.spec-code/memory/context.md` 中的变更历史
2. 记录已完成变更的信息（ID、标题、完成时间等）
3. 更新项目统计数据（已完成变更数、总变更数等）
4. 保持项目记忆与实际状态同步

### Q: 如果项目记忆更新失败怎么办？

A: 变更已经成功归档，只是项目记忆未更新。您可以：
1. 手动编辑 `.spec-code/memory/context.md` 添加变更信息
2. 或者重新运行 `init-project-memory` Skill 来更新项目记忆

### Q: 项目记忆更新是必须的吗？

A: 是的。项目记忆是项目的核心治理文档，保持其与实际状态同步非常重要。这样可以：
- 帮助团队成员了解项目的最新状态
- 记录已完成的工作
- 为后续的决策提供参考

## 📚 相关文档
- 
- [变更管理流程](mdc:docs/best-practices/17-change-management.md)
- [并行变更冲突处理](mdc:docs/best-practices/18-conflict-resolution.md)
- [输出目录规范](mdc:.codebuddy/spec/global/standards/common/output-directory-standard.md)
- [项目记忆系统](mdc:skills/init-project-memory/SKILL.md)

## 🔄 版本历史

### v2.0.0 (2025-11-05)
- ✨ 新增项目记忆自动更新功能
- ✨ 新增依赖检查功能
- ✨ 新增归档验证步骤
- 🐛 修复归档失败时的回滚问题
- 📝 完善文档和示例

### v1.0.0 (2025-11-03)
- 🎉 初始版本发布
- ✨ 基础归档功能
- ✨ 交互式选择变更
- ✨ 归档原因记录
