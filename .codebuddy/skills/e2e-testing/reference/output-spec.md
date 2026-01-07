# E2E Testing 输出规范

## 默认目录配置

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `{outputDir}` | `workspace/e2e-test/` | 输出根目录（测试套件、日志、报告、执行结果） |

可通过配置文件或命令参数覆盖默认值。

---

## 输出目录策略

| 环节 | 目录策略 | 输出位置 |
|------|---------|---------|
| 用例设计 | 固定目录 | `{outputDir}/` |
| 套件审查 | 固定目录 | `{outputDir}/review/` |
| 格式转换 | 固定目录 | 与源文件同目录 |
| 测试执行 | **时间戳目录** | `{outputDir}/execute-{timestamp}/` |

**时间戳格式**：`YYYYMMDD-HHMMSS`（如 `execute-20251231-104500`）

---

## 总目录结构

```
workspace/
└── e2e-test/                              # {outputDir} 输出根目录
    │
    ├── TestSuite-{模块}.yaml              # [用例设计] 测试套件
    ├── TestSuite-{模块}.xlsx              # [用例设计] Excel 格式
    ├── pom/
    │   └── {页面ID}-pom.yaml              # [用例设计] POM 文件
    │
    ├── review/                            # [套件审查] 固定目录
    │   ├── review-report.md
    │   ├── fixes/
    │   │   └── suggested-fixes.yaml
    │   └── logs/
    │       └── review.log
    │
    ├── execute-20251231-104500/           # [测试执行] 时间戳目录
    │   ├── progress.md                    # 实时进度
    │   ├── report.md                      # 测试报告
    │   ├── TC-*_success_*.png             # 成功截图
    │   ├── TC-*_error_*.png               # 失败截图
    │   ├── TC-*_step*_*.png               # 步骤截图
    │   └── logs/
    │       └── execution.log
    │
    └── logs/                              # [其他环节] 日志目录
        ├── design.log
        └── conversion.log
```

---

## 各环节输出清单

| 环节 | 输出位置 | 必需输出 | 可选输出 |
|------|---------|---------|---------|
| **用例设计** | `{outputDir}/` | TestSuite-*.yaml, pom/*.yaml | TestSuite-*.xlsx |
| **套件审查** | `{outputDir}/review/` | review-report.md | fixes/*.yaml |
| **格式转换** | 源文件目录 | 目标格式文件 | - |
| **测试执行** | `{outputDir}/execute-{ts}/` | progress.md, report.md | {用例ID}_*.png |

---

## 日志规范

### 通用格式

```
[YYYY-MM-DD HH:MM:SS] [级别] 消息内容
```

### 日志级别

| 级别 | 用途 |
|------|------|
| `[INFO]` | 一般信息 |
| `[WARN]` | 警告信息 |
| `[ERROR]` | 错误信息 |

### 环节专属级别

| 环节 | 专属级别 | 示例 |
|------|---------|------|
| 用例设计 | `[POM]` `[CASE]` | `[POM] login - 元素数: 8` |
| 套件审查 | `[CHECK]` `[ISSUE]` | `[ISSUE] TC-001: 缺少 element [ERROR]` |
| 格式转换 | `[PARSE]` `[CONVERT]` | `[CONVERT] Sheet1 → cases[] 完成` |
| 测试执行 | `[CASE]` `[STEP]` `[SCREENSHOT]` | `[STEP] 步骤1: 打开页面 - ✅` |

---

## progress.md 规范（仅测试执行）

**用途**：实时跟踪执行状态，支持断点续执行

```markdown
# 测试执行进度

**套件**: TestSuite-XXX.xlsx
**开始**: 2025-12-31 10:30:00
**状态**: ⏳ 执行中 | ✅ 完成 | ❌ 中断

## 执行状态

| # | 用例ID | 名称 | 状态 | 耗时 | 截图 |
|---|--------|------|------|------|------|
| 1 | TC-Zhaopin-待办中心-查看待办列表-001 | 查看待办列表 | ✅ PASS | 5.2s | - |
| 2 | TC-Zhaopin-待办中心-关键词搜索-004 | 关键词搜索 | ❌ FAIL | 3.1s | [查看](./TC-Zhaopin-待办中心-关键词搜索-004_error_103010.png) |
| 3 | TC-Zhaopin-待办中心-切换标签页-002 | 切换标签页 | ⏳ RUN | - | - |
| 4 | TC-Zhaopin-待办中心-查看详情-005 | 查看详情 | ⏸️ WAIT | - | - |

## 统计

| 总数 | 通过 | 失败 | 执行中 | 待执行 |
|------|------|------|--------|--------|
| 4 | 1 | 1 | 1 | 1 |
```

### 更新规则

**只允许修改**：
- `**状态**` 字段
- 表格 `状态`、`耗时`、`截图` 列
- `## 统计` 表格

**禁止修改**：
- `**套件**`、`**开始**`
- 表格 `#`、`用例ID`、`名称` 列
- 添加任何新内容（日志放 execution.log）

---

## 历史执行管理

```bash
e2e clean                    # 清理 7 天前的执行记录
e2e clean --days 30          # 清理 30 天前的记录
e2e clean --keep 5           # 只保留最近 5 次执行
```
