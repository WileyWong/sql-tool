---
command_name: 执行长任务
description: 驱动长时间运行的 Agent 执行大型任务。基于 Anthropic 最佳实践，支持跨会话任务管理、进度追踪、状态恢复和多 Agent 协作。适用于需要多步骤、多会话完成的复杂任务。
---

# Command: 执行长任务

> ⚠️ **必须遵守**: [通用规范索引](mdc:spec/global/standards/common/index.md) - 包含项目记忆引用和所有规范要求

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Agent 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构

> ⚠️ **文档生成规则**: 遵循 [文档生成原则](mdc:spec/global/standards/common/document-generation-rules.md)
> - ❌ 禁止主动生成总结文档、分析报告
> - ✅ 只在用户明确要求时生成文档
> - ✅ 优先原地修改现有文档

> 📁 **输出目录规范**: 遵循 [输出目录规范](mdc:spec/global/standards/common/output-directory-standard.md)
> - 任务工作目录: `workspace/{task-id}/`
> - 功能清单: `workspace/{task-id}/feature-list.json`
> - 进度报告: `workspace/{task-id}/progress.md`
> - 需求文档: `workspace/{task-id}/requirements/`
> - 设计文档: `workspace/{task-id}/design/`
> - 源代码: 直接写入项目 `src/` 目录
> - 测试代码: 直接写入项目 `test/` 目录

---

## 🎯 用途

作为 **Master Orchestrator Agent** 的驱动指令，管理和执行需要多步骤、多会话完成的大型任务。

**核心能力**:
- 🔄 **跨会话记忆**: 通过 `feature-list.json` + Git 日志实现状态持久化
- 📊 **进度追踪**: 实时追踪每个功能的完成状态
- 🤖 **多 Agent 协作**: 调度 initializer、design-worker、coding-worker
- ✅ **质量门禁**: 每个功能完成后自动验证
- 🔒 **Git 本地提交**: 每个功能完成后自动 commit（不 push）

**适用场景**:
- 从零开始实现完整功能模块（如用户管理、订单系统）
- 跨多个会话完成的大型开发任务
- 需要设计→编码→测试完整流程的任务
- 中断后需要恢复继续的任务

**核心参考**:
- [Master Orchestrator Agent](mdc:agents/master-orchestrator.md) - 全局任务总控
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 最佳实践

---

## 📋 前置条件

在执行此 Command 前，请确保：

- [ ] 任务目标明确（知道要实现什么功能）
- [ ] 技术栈已确定（或有明确偏好）
- [ ] 项目环境已准备（如为现有项目）
- [ ] 理解任务可能需要多个会话完成

---

## 💡 参数传递

本 Command 支持以下参数：

### 操作类型 (action)

| 操作 | 说明 | 示例 |
|------|------|------|
| `start` | 开始新任务 | `/run-long-task start` |
| `continue` | 继续之前的任务 | `/run-long-task continue user-management-2025-12-05` |
| `status` | 查看任务进度 | `/run-long-task status` |
| `list` | 列出所有任务 | `/run-long-task list` |

### 位置参数
- `$1` - 操作类型 (start/continue/status/list)
- `$2` - 任务ID (可选，用于 continue/status)

### 使用示例

```bash
# 开始新任务
/run-long-task start
用户: "实现用户管理模块，包含注册、登录、权限管理"

# 继续之前的任务
/run-long-task continue user-management-2025-12-05

# 查看当前任务进度
/run-long-task status

# 列出所有任务
/run-long-task list
```

**如果参数不完整，交互式询问**：

```markdown
请选择操作类型：

1. **开始新任务** - 创建新的长任务并开始执行
2. **继续任务** - 恢复之前中断的任务
3. **查看进度** - 查看当前任务的完成情况
4. **列出任务** - 显示所有进行中和已完成的任务
```

---

## 🔄 执行流程

### Phase 0: 操作路由 (MANDATORY)

**Objective**: 根据用户操作类型路由到对应流程

**MANDATORY STEPS**:

1. **MUST** 识别操作类型
   - 如果用户说"开始/新建/创建" → `start` 流程
   - 如果用户说"继续/恢复" → `continue` 流程
   - 如果用户说"进度/状态" → `status` 流程
   - 如果用户说"列出/查看所有" → `list` 流程
   - 如果用户直接描述任务需求 → `start` 流程

2. **MUST** 路由到对应 Phase
   - `start` → Phase 1: 任务初始化
   - `continue` → Phase 2: 状态恢复
   - `status` → Phase 3: 进度展示
   - `list` → Phase 4: 任务列表

---

### Phase 1: 任务初始化 (start)

**Objective**: 分析任务需求，创建功能清单，初始化项目结构

**MANDATORY STEPS**:

1. **MUST** 分析任务范围 - Use `master-orchestrator` Agent
   - 理解用户需求，评估任务复杂度
   - 识别功能点和依赖关系
   - 评估是否适合长任务模式
   - **Verification**:
     - [ ] 任务目标明确
     - [ ] 功能点已识别
     - [ ] 复杂度已评估

2. **MUST** 生成功能清单 - Use `initializer` Worker
   - 创建 `workspace/{task-id}/` 目录
   - 生成 `feature-list.json` 功能清单
   - 生成 `progress.md` 进度文件
   - **Output**: 结构化的功能清单 JSON 文件

3. **MUST** 展示任务计划并请求确认
   - 展示功能清单和预估时间
   - 说明每个阶段的工作内容
   - 请求用户确认开始执行
   - **Verification**:
     - [ ] 用户理解任务范围
     - [ ] 用户确认开始执行

**Output 格式**:
```
[初始化] 分析任务: {任务描述}
[分析] 识别功能点: {N} 个
  - 设计阶段: {设计功能列表}
  - 编码阶段: {编码功能列表}
  - 测试阶段: {测试功能列表}

[创建] 任务ID: {task-id}
[创建] 功能清单: workspace/{task-id}/feature-list.json
[创建] 进度文件: workspace/{task-id}/progress.md

[预估] 需要 {N} 个会话完成
[预估] 总耗时: {时间范围}

是否开始执行？ [y/n]
```

**🚪 Phase Gate 1**:
- [ ] 功能清单已创建
- [ ] 进度文件已创建
- [ ] 用户已确认开始

**Cannot proceed to Phase 5 without all checks passing.**

---

### Phase 2: 状态恢复 (continue)

**Objective**: 恢复之前中断的任务，继续执行

**MANDATORY STEPS**:

1. **MUST** 读取任务状态 - Use `master-orchestrator` Agent
   - 读取 `feature-list.json` 获取功能清单
   - 读取 Git 日志获取最近变更
   - 读取 `progress.md` 获取人类可读进度
   - **Verification**:
     - [ ] 功能清单已读取
     - [ ] 当前状态已识别

2. **MUST** 验证环境状态
   - 检查代码是否可编译（如适用）
   - 检查测试是否通过（如适用）
   - 识别是否有未完成的功能
   - **从 Git 日志恢复状态**（核心机制）
   - **Verification**:
     - [ ] 环境状态正常
     - [ ] 无冲突或损坏
     - [ ] Git 日志与 feature-list.json 状态一致

3. **MUST** 展示恢复状态并请求确认
   - 展示已完成的功能
   - 展示当前进行中的功能
   - 展示待完成的功能
   - 请求用户确认继续
   - **Verification**:
     - [ ] 用户理解当前状态
     - [ ] 用户确认继续执行

**Output 格式**:
```
[恢复] 任务ID: {task-id}
[读取] feature-list.json
[读取] Git 日志

[状态恢复]
- 任务名称: {任务名称}
- 当前阶段: {阶段名称}
- 进度: {完成数}/{总数} ({百分比}%)

[已完成]
✅ {功能1}
✅ {功能2}

[进行中]
🔄 {功能3} - 当前步骤: {步骤名称}

[待完成]
⏳ {功能4}
⏳ {功能5}

[下一步] 继续完成 {功能3}

是否继续？ [y/n]
```

**🚪 Phase Gate 2**:
- [ ] 状态已成功恢复
- [ ] 环境验证通过
- [ ] 用户已确认继续

**Cannot proceed to Phase 5 without all checks passing.**

---

### Phase 3: 进度展示 (status)

**Objective**: 展示当前任务的详细进度

**MANDATORY STEPS**:

1. **MUST** 读取任务状态
   - 读取 `feature-list.json`
   - 计算各阶段完成率
   - 识别当前进行中的功能

2. **MUST** 生成进度报告
   - 展示总体进度
   - 展示各阶段进度
   - 展示功能详情
   - 展示下一步建议

**Output 格式**:
```
[任务进度报告]

任务: {任务名称}
状态: {状态}
进度: ████████░░░░ {百分比}% ({完成数}/{总数})

| 阶段 | 完成/总数 | 状态 |
|------|----------|------|
| 设计 | {n}/{m} | {状态} |
| 编码 | {n}/{m} | {状态} |
| 测试 | {n}/{m} | {状态} |

[当前任务]
{功能名称}
步骤: {当前步骤} ({n}/{m})

[预估]
- 剩余功能: {n} 个
- 预计时间: {时间}
- 预计会话: {n} 次

是否继续执行？ [y/n]
```

---

### Phase 4: 任务列表 (list)

**Objective**: 列出所有任务

**MANDATORY STEPS**:

1. **MUST** 扫描 workspace 目录
   - 查找所有 `feature-list.json` 文件
   - 读取每个任务的基本信息
   - 计算每个任务的完成率

2. **MUST** 展示任务列表

**Output 格式**:
```
[任务列表]

| 任务ID | 名称 | 状态 | 进度 | 最后更新 |
|--------|------|------|------|----------|
| {id1} | {name1} | {status1} | {progress1}% | {date1} |
| {id2} | {name2} | {status2} | {progress2}% | {date2} |

共 {n} 个任务

选择要操作的任务:
1. 继续 {id1}
2. 继续 {id2}
3. 开始新任务
```

---

### Phase 5: 任务执行循环 (CORE)

**Objective**: 执行任务的核心循环，逐个完成功能

**MANDATORY STEPS**:

1. **MUST** 选择下一个功能 - Use `master-orchestrator` Agent
   - 优先选择进行中的功能（继续完成）
   - 按依赖关系选择可执行的功能
   - 按阶段顺序选择（设计→编码→测试）
   - **Output**:
     ```
     [选择] 下一个功能: {功能ID} - {功能名称}
     [理由] {选择理由}
     [步骤] 需要完成: {步骤列表}
     ```

2. **MUST** 调度 Worker Agent
   - 根据功能类型选择 Worker:
     - 设计类功能 → `design-worker`
     - 编码类功能 → `coding-worker`
     - 测试类功能 → `coding-worker`
   - 传递上下文（设计文档、相关代码等）
   - **Output**:
     ```
     [调度] Worker: {worker-name}
     [技能] 调用: {skill-list}
     [上下文] 传递: {context-list}
     ```

3. **MUST** 监控执行进度
   - 展示每个步骤的完成状态
   - 处理执行过程中的问题
   - **Output**:
     ```
     [进度] 步骤 1/{n}: {步骤名称} ✅
     [进度] 步骤 2/{n}: {步骤名称} ⏳
     ```

4. **MUST** 验证功能完成
   - 检查输出文件是否存在
   - 运行编译检查（如适用）
   - 运行测试（如适用）
   - **Output**:
     ```
     [验证] {功能名称}
     [检查] 文件存在: ✅
     [检查] 编译通过: ✅
     [检查] 单元测试: ✅ ({n}/{m} 通过)
     ```

5. **MUST** 更新状态并持久化
   - 更新 `feature-list.json`
   - 更新 `progress.md`
   - **Git commit 变更（仅本地，不 push）**
   - **Output**:
     ```
     [更新] 功能状态: passes = true
     [Git] git add workspace/{task-id}/ src/ test/
     [Git] git commit -m "{type}({scope}): [{feature_id}] {description}"
     [Git] commit hash: abc1234 (仅本地提交，未 push)
     ```

**Git 提交规范**:
- Commit message 格式: `{type}({scope}): [{feature_id}] {description}`
- **必须包含功能ID**（如 `[F003]`），用于跨会话状态恢复
- **禁止自动 push** - 由用户决定何时推送到远程

6. **MUST** 决定下一步
   - 如果还有未完成功能 → 循环回步骤 1
   - 如果达到单次会话限制 → 暂停并提示
   - 如果所有功能完成 → 进入 Phase 6
   - **Output**:
     ```
     [进度] 当前完成: {n}/{m} ({百分比}%)
     [下一步] {下一个功能名称}
     
     是否继续？ [y/n]
     ```

**🚪 Phase Gate 5** (每个功能完成后):
- [ ] 功能验证通过
- [ ] 状态已更新
- [ ] Git 已提交（仅本地）
- [ ] 用户确认继续

**人工检查点**:
- 每完成一个功能后暂停确认
- 单次会话完成 3 个功能后建议休息
- 遇到问题时暂停请求帮助

---

### Phase 6: 任务完成

**Objective**: 任务完成后的收尾工作

**MANDATORY STEPS**:

1. **MUST** 验证所有功能完成
   - 检查所有功能的 `passes` 状态
   - 运行完整测试套件
   - 生成最终报告

2. **MUST** 生成完成报告
   - 展示所有完成的功能
   - 展示关键输出文件
   - 展示质量指标

3. **MUST** 更新任务状态
   - 更新 `feature-list.json` 状态为 `completed`
   - 更新 `progress.md` 最终状态
   - Git commit 最终状态

**Output 格式**:
```
[任务完成] 🎉

任务: {任务名称}
完成时间: {完成时间}
总耗时: {总耗时}
会话数: {会话数}

[完成的功能]
✅ {功能1} - {完成时间}
✅ {功能2} - {完成时间}
...

[关键输出]
- 设计文档: {文件列表}
- 源代码: {文件列表}
- 测试代码: {文件列表}

[质量指标]
- 代码审查分数: {分数}
- 测试覆盖率: {覆盖率}%
- 测试通过率: {通过率}%

[最终提交]
Git commit: {commit-hash}
```

**🚪 Final Gate**:
- [ ] 所有功能已完成
- [ ] 所有测试通过
- [ ] 最终报告已生成
- [ ] 状态已持久化

---

## 🚫 Red Flags

**STOP if you encounter**:

- ❌ **任务过于简单** - 不需要长任务模式，使用普通 Command 即可
- ❌ **任务目标模糊** - 无法明确功能清单
- ❌ **连续失败** - 同一功能失败超过 3 次
- ❌ **环境损坏** - 代码无法编译或测试全部失败
- ❌ **依赖阻塞** - 存在无法解决的依赖问题

**Action**: 
- 遇到 Red Flags 时，暂停执行并向用户报告
- 提供可能的解决方案或替代方案
- 等待用户决定（重试/跳过/停止）

---

## 📝 输出格式

### 文件位置

任务元数据与源代码分离存放：

```
workspace/{task-id}/                 # 任务工作目录（统一工作空间）
├── feature-list.json                # 功能清单（核心状态文件）
├── progress.md                      # 人类可读的进度报告
├── requirements/                    # 需求文档
│   ├── requirements.md              # 需求文档
│   └── clarifications.md            # 澄清文档
├── design/                          # 设计文档
│   ├── architecture.md              # 架构设计
│   ├── database-design.md           # 数据库设计
│   ├── api-design.md                # API 设计
│   └── feature-design.md            # 功能设计
├── cr/                              # 代码审查报告
└── test/                            # 测试用例文档
    └── cases/                       # 测试用例

{project-root}/                      # 项目根目录（源代码直接写入）
├── src/                             # 源代码（按项目现有结构）
└── test/                            # 测试代码（按项目现有结构）
```

**设计理念**：
- ✅ 任务元数据存放在 `workspace/{task-id}/` 下，与现有 Skills 统一
- ✅ 源代码和测试代码直接写入项目对应目录
- ✅ 遵循项目现有的目录结构和代码规范
- ✅ 与 `techdesign-03-feature`、`cr-java-code`、`tdd-build-test-case` 等 Skills 的输出路径一致

---

## 🔄 Git 本地提交机制

长时间运行任务通过 **Git 本地提交**实现跨会话状态恢复，这是实现 Agent 长任务的核心机制。

### 工作原理

```
┌─────────────────────────────────────────────────────────────────┐
│                      长任务执行流程                               │
├─────────────────────────────────────────────────────────────────┤
│  会话 1                                                          │
│  ├── F001 完成 → git commit "[F001] 需求分析"                    │
│  ├── F002 完成 → git commit "[F002] 数据库设计"                  │
│  └── F003 完成 → git commit "[F003] API 设计"                    │
│       ↓ (会话结束，状态保存在 Git)                                │
├─────────────────────────────────────────────────────────────────┤
│  会话 2                                                          │
│  ├── 读取 Git 日志 → 识别已完成 [F001, F002, F003]               │
│  ├── 恢复状态 → 下一个功能 F004                                   │
│  ├── F004 完成 → git commit "[F004] 架构设计"                    │
│  └── F005 完成 → git commit "[F005] 用户注册接口"                │
│       ↓ (会话结束)                                               │
├─────────────────────────────────────────────────────────────────┤
│  会话 N                                                          │
│  ├── 读取 Git 日志 → 识别已完成功能                               │
│  ├── 继续执行剩余功能                                             │
│  └── 所有功能完成 → 任务结束                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Git 提交规范

**Commit Message 格式**:
```
{type}({scope}): [{feature_id}] {description}
```

**字段说明**:
| 字段 | 说明 | 示例 |
|------|------|------|
| `type` | 提交类型 | feat, docs, test, fix, refactor |
| `scope` | 模块名称 | user, order, auth |
| `feature_id` | **必须** 功能ID | [F001], [F002], [F003] |
| `description` | 简短描述 | 完成用户注册接口实现 |

**示例**:
```bash
git commit -m "feat(user): [F003] 完成用户注册接口实现"
git commit -m "docs(design): [F001] 完成需求分析文档"
git commit -m "test(user): [F008] 完成用户模块单元测试"
```

### 状态恢复

新会话启动时，通过 Git 日志恢复任务状态：

```bash
# 搜索包含功能ID的提交
git log --oneline -20 --grep="\[F0"

# 输出示例
abc1234 feat(user): [F005] 完成用户注册接口实现
def5678 feat(user): [F004] 完成架构设计
ghi9012 docs(design): [F003] 完成 API 设计
jkl3456 docs(design): [F002] 完成数据库设计
mno7890 docs(design): [F001] 完成需求分析
```

从 Git 日志中提取已完成的功能ID `[F001, F002, F003, F004, F005]`，与 `feature-list.json` 同步，确定下一个要执行的功能。

### ⚠️ 重要规则

| 规则 | 说明 |
|------|------|
| ✅ 每个功能完成后提交 | 确保进度不丢失 |
| ✅ Commit message 包含功能ID | 用于状态恢复 |
| ✅ 仅本地提交 | `git add` + `git commit` |
| ❌ **禁止自动 push** | 由用户决定何时推送到远程 |

### 回滚机制

如果某个功能执行失败，可以通过 Git 回滚到上一个稳定状态：

```bash
# 查看最近的提交
git log --oneline -5

# 回滚到上一个功能完成的状态
git reset --hard HEAD~1

# 或回滚到指定的 commit
git reset --hard abc1234
```

### feature-list.json 格式

```json
{
  "task_id": "user-management-2025-12-05",
  "title": "用户管理模块",
  "description": "实现用户注册、登录、权限管理功能",
  "created_at": "2025-12-05T10:00:00Z",
  "updated_at": "2025-12-05T14:30:00Z",
  "status": "in_progress",
  "current_phase": "coding",
  "features": [
    {
      "id": "F001",
      "category": "design",
      "name": "需求分析",
      "description": "分析用户管理模块的功能需求",
      "steps": ["收集需求", "澄清歧义", "生成需求文档"],
      "passes": true,
      "completed_at": "2025-12-05T10:30:00Z",
      "output_files": ["design/requirement.md"]
    }
  ],
  "statistics": {
    "total": 8,
    "completed": 5,
    "in_progress": 1,
    "pending": 2,
    "completion_rate": 0.62
  }
}
```

---

## ✅ 验证清单

### 执行前验证
- [ ] 任务目标已明确
- [ ] 技术栈已确定
- [ ] 理解长任务模式的工作方式

### 执行中验证（Phase Gates）
- [ ] Phase 0 Gate通过（操作路由）
- [ ] Phase 1/2/3/4 Gate通过（对应操作）
- [ ] Phase 5 Gate通过（每个功能）
- [ ] Phase 6 Gate通过（任务完成）

### 最终验证
- [ ] 所有功能已完成
- [ ] feature-list.json 状态正确
- [ ] progress.md 已更新
- [ ] Git 已提交所有变更
- [ ] 质量门禁通过

---

## 🎓 最佳实践

### 1. 合理拆分功能

✅ **好的功能拆分**:
```
F001: 需求分析 (设计)
F002: 数据库设计 (设计)
F003: API 设计 (设计)
F004: 用户注册接口 (编码)
F005: 用户登录接口 (编码)
F006: 单元测试 (测试)
```

❌ **不好的功能拆分**:
```
F001: 实现整个用户管理模块 (太大)
F002: 写一行代码 (太小)
```

### 2. 及时保存进度

✅ **好的做法**:
```
每完成一个功能:
1. 更新 feature-list.json
2. 更新 progress.md
3. Git commit
```

❌ **不好的做法**:
```
完成所有功能后一次性保存
```

### 3. 善用人工检查点

✅ **好的检查点**:
```
[检查点] 需求分析完成
- 已识别 5 个核心功能
- 已明确 3 个非功能需求
- 是否继续设计阶段？ [y/n]
```

❌ **不好的检查点**:
```
(无检查点，一直执行到出错)
```

### 4. 跨会话恢复

✅ **好的恢复**:
```
用户: 继续之前的任务
AI: 
[恢复] 任务ID: user-management-2025-12-05
[状态] 已完成 5/8 (62%)
[下一步] F006 - 用户登录接口
是否继续？
```

❌ **不好的恢复**:
```
用户: 继续之前的任务
AI: 好的，让我们从头开始... (丢失进度)
```

---

## 📚 相关资源

### 核心 Agents
- [master-orchestrator](mdc:agents/master-orchestrator.md) - 全局任务总控 Agent
- [initializer](mdc:agents/initializer.md) - 初始化 Worker
- [design-worker](mdc:agents/design-worker.md) - 设计 Worker
- [coding-worker](mdc:agents/coding-worker.md) - 编码和测试 Worker

### 相关 Commands
- [设计阶段](mdc:commands/spec-coding/design.md) - 单独执行设计
- [编码实现](mdc:commands/spec-coding/gen-code-with-review.md) - 单独执行编码

### 最佳实践
- [Building Effective Agents](mdc:spec/global/knowledge/best-practices/BuildingEffectiveAgents.md) - Anthropic 官方最佳实践
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) - 长时间运行 Agent 最佳实践

### Agent 架构文档
- [Agent README](mdc:agents/README.md) - Agent 架构总览

---

## ❓ 常见问题

### Q: 什么任务适合使用长任务模式？

**A**: 
- ✅ 需要多个阶段（设计→编码→测试）的任务
- ✅ 预计需要 1 小时以上的任务
- ✅ 可能需要中断后继续的任务
- ❌ 简单的代码修改或 bug 修复
- ❌ 单一步骤可完成的任务

### Q: 如何从中断的任务恢复？

**A**: 
1. 使用 `/run-long-task continue {task-id}` 或直接说"继续之前的任务"
2. 系统会自动读取 `feature-list.json` 恢复状态
3. 从上次中断的功能继续执行

### Q: 单次会话可以完成多少功能？

**A**: 
- 建议单次会话完成 3-5 个功能
- 超过 3 个功能后会提示是否休息
- 可以根据功能复杂度调整

### Q: 如何处理执行失败的功能？

**A**: 
- 系统会自动重试最多 3 次
- 如果仍然失败，会暂停并请求人工干预
- 用户可以选择：重试、跳过、停止

### Q: 如何查看历史任务？

**A**: 
- 使用 `/run-long-task list` 查看所有任务
- 任务数据存储在 `workspace/` 目录
- 每个任务有独立的 `feature-list.json` 和 `progress.md`

---

## 📖 完整示例

### 示例 1: 开始新任务

```
用户: /run-long-task start
用户: 实现用户管理模块，包含注册、登录、权限管理

AI:
[初始化] 分析任务: 用户管理模块
[分析] 识别功能点: 8 个
  设计阶段 (4):
  - F001: 需求分析
  - F002: 数据库设计
  - F003: API 设计
  - F004: 架构设计
  
  编码阶段 (3):
  - F005: 用户注册接口
  - F006: 用户登录接口
  - F007: 权限管理
  
  测试阶段 (1):
  - F008: 单元测试

[创建] 任务ID: user-management-2025-12-05
[创建] 功能清单: workspace/user-management-2025-12-05/feature-list.json
[创建] 进度文件: workspace/user-management-2025-12-05/progress.md

[预估] 需要 3-5 个会话完成
[预估] 总耗时: 2-4 小时

是否开始执行？ [y/n]
```

### 示例 2: 继续任务

```
用户: /run-long-task continue

AI:
[恢复] 任务ID: user-management-2025-12-05
[读取] feature-list.json
[读取] Git 日志

[状态恢复]
- 任务名称: 用户管理模块
- 当前阶段: 编码阶段
- 进度: 5/8 (62%)

[已完成]
✅ F001: 需求分析
✅ F002: 数据库设计
✅ F003: API 设计
✅ F004: 架构设计
✅ F005: 用户注册接口

[进行中]
🔄 F006: 用户登录接口 - 当前步骤: JWT 集成

[待完成]
⏳ F007: 权限管理
⏳ F008: 单元测试

[下一步] 继续完成 F006 - 用户登录接口

是否继续？ [y/n]
```

---

**版本**: 1.0.0  
**最后更新**: 2025-12-05  
**维护者**: Spec-Code Team  
**反馈**: 请通过 Issue 或 PR 提供反馈
