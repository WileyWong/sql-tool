---
name: e2e-testing
description: |
  E2E 前端自动化测试。支持 POM 生成、用例设计、MCP 执行、结果分析。
  触发词：E2E 测试、UI 测试、Playwright、POM、测试用例、测试执行。
---

# E2E Testing

## 能力

| 能力 | 规范 | 触发意图 |
|------|------|----------|
| POM 生成 | [pom-spec.md](reference/pom-spec.md) | 分析页面、元素定位、生成 POM、页面对象 |
| 用例设计 | [testcase-design-spec.md](reference/testcase-design-spec.md) | 设计用例、测试场景、测试用例 |
| 套件审查 | [testsuite-review-spec.md](reference/testsuite-review-spec.md) | 检查套件、校验用例、审查、验证 |
| 测试执行 | [test-execute-spec.md](reference/test-execute-spec.md) | 运行测试、执行用例、跑测试 |
| 结果分析 | [result-analyze-spec.md](reference/result-analyze-spec.md) | 分析结果、测试报告、统计 |

## 执行规则

1. **意图识别**：根据用户描述识别需要的能力，读取对应规范执行
2. **流程串联**：多个意图时按 POM → 设计 → 审查 → 执行 → 分析 顺序串联
3. **输出格式**：默认 YAML，用户说"Excel"时输出 Excel

## 输出格式

| 格式 | 适用场景 | 规范 |
|------|----------|------|
| YAML | 版本控制、CI/CD | [yaml-rules.md](reference/yaml-rules.md) |
| Excel | 人工编辑、协作 | [excel-rules.md](reference/excel-rules.md) |

> 📌 [excel-rules.md](reference/excel-rules.md) 是操作类型、断言类型、等待策略等枚举定义的唯一权威来源。

### Excel 输出约束

生成 Excel 时必须包含 11 个 Sheet：

| Sheet | 名称 |
|-------|------|
| 0 | 用例-定义 |
| 1 | 用例-执行步骤 |
| 2 | 用例-测试数据 |
| 3 | 执行-执行计划 |
| 4 | 配置-用户 |
| 5 | 配置-全局 |
| 6 | 元数据-POM |
| 7 | 元数据-枚举定义 |
| 8 | 元数据-操作类型参考 |
| 9 | 元数据-等待策略参考 |
| 10 | 元数据-Mock场景 |

## 本地工具

### 基础工具

| 工具 | 功能 | 用法 |
|------|------|------|
| `testsuite_generator.py` | **生成 Excel**（从 YAML） | `python tools/testsuite_generator.py --data data.yaml --output TestSuite.xlsx` |
| `validate_testsuite.py` | **校验 Excel** | `python tools/validate_testsuite.py TestSuite.xlsx` |
| `sync_excel_yaml.py` | Excel ↔ YAML 同步 | `python tools/sync_excel_yaml.py --to-yaml input.xlsx` |
| `parse_snapshot.py` | 解析页面快照 | `python tools/parse_snapshot.py snapshot.txt --pom` |

### 执行优化工具（节省 Token）

| 工具 | 功能 | Token 节省 | 用法 |
|------|------|-----------|------|
| `execution_parser.py` | **解析执行计划** | ~80% | `python tools/execution_parser.py TestSuite.xlsx --output steps.json` |
| `result_analyzer.py` | **分析执行结果** | ~85% | `python tools/result_analyzer.py execute-dir/ --output report.json` |
| `execution_status_updater.py` | **更新执行状态** | ~75% | `python tools/execution_status_updater.py TestSuite.xlsx --batch "TC-001:通过"` |
| `pom_generator.py` | **生成 POM YAML** | ~85% | `python tools/pom_generator.py snapshot.txt --page-id loginPage` |
| `snapshot_diff.py` | **快照差异对比** | ~70% | `python tools/snapshot_diff.py before.txt after.txt` |
| `mcp_command_generator.py` | **生成 MCP 命令** | ~70% | `python tools/mcp_command_generator.py steps.json --mcp playwright` |

依赖：`python -m pip install openpyxl pyyaml`

---

## ⚡ 双路径执行策略

**核心原则**：Python 工具是**优化手段**，不是**必要依赖**。所有功能必须有纯 AI 的实现路径。

### 路径选择

| 环节 | 优先路径（Python 工具） | 降级路径（纯 AI） |
|------|----------------------|-----------------|
| **POM 生成** | `pom_generator.py` | 读取快照 → AI 分析 → 生成 YAML |
| **用例设计** | `testsuite_generator.py` | AI 生成 YAML → xlsx 技能写入 |
| **套件审查** | `validate_testsuite.py` | AI 读取 Excel → 逐条检查 |
| **执行解析** | `execution_parser.py` | AI 读取 Excel → 解析步骤 |
| **状态更新** | `execution_status_updater.py` | xlsx 技能逐个更新 |
| **结果分析** | `result_analyzer.py` | AI 读取 progress.md → 分析 |
| **快照对比** | `snapshot_diff.py` | AI 对比两次快照文本 |

### 执行流程

```
1. 尝试执行 Python 工具
   ↓ 成功 → 使用工具输出继续
   ↓ 失败 → 进入降级路径

2. 降级路径：
   - 读取原始文件（Excel/YAML/快照）
   - 使用 AI 能力解析和处理
   - 继续执行任务
```

### 工具失败处理

工具执行失败时会输出降级提示：
```json
{
  "error": "错误信息",
  "fallback_hint": "请使用 read_file 读取文件后手动解析"
}
```

### 各环节降级说明

#### POM 生成
- **优先**：`python tools/pom_generator.py snapshot.txt --output pom.yaml`
- **降级**：使用 `read_file` 读取快照 → AI 识别元素 → 生成 POM YAML

#### 测试执行
- **优先**：`python tools/execution_parser.py TestSuite.xlsx` → 获取结构化步骤
- **降级**：使用 xlsx 技能读取 Sheet3 → AI 解析执行计划 → 逐步执行

#### 结果分析
- **优先**：`python tools/result_analyzer.py execute-dir/` → 获取结构化报告
- **降级**：使用 `read_file` 读取 progress.md → AI 统计分析 → 生成报告

#### 状态更新
- **优先**：`python tools/execution_status_updater.py TestSuite.xlsx --batch "TC-001:通过"`
- **降级**：使用 xlsx 技能定位单元格 → 逐个更新状态

## YAML 数据规范

### 特殊字符处理规则

生成 YAML 数据时必须遵守以下规则，确保 PyYAML 能正确解析。

#### 1. 中文引号处理

| 场景 | ❌ 错误写法 | ✅ 正确写法 | 说明 |
|------|-----------|-----------|------|
| **中文引号文本** | `'点击'同意'按钮'` | `"点击"同意"按钮"` 或 `点击"同意"按钮` | 直接使用中文引号，不用外层引号 |
| **纯中文文本** | `'去处理'` | `"去处理"` 或 `去处理` | 普通文本不需要引号 |
| **混合引号** | `'输入"测试"文本'` | `"输入"测试"文本"` | 双引号包裹单引号文本 |

**规则**：
- ❌ 不要使用英文单引号 `'` 包裹包含中文引号的文本
- ✅ 直接使用中文引号 `""` 或 `''`，不添加外层引号
- ✅ 或者使用双引号 `"` 包裹单引号文本

#### 2. 特殊字符转义

| 字符 | 处理方式 | 示例 |
|------|---------|------|
| **冒号** | 用引号包裹 | `"name:value"` |
| **井号** | 用引号包裹 | `"# 这是注释"` |
| **破折号** | 用引号包裹 | `"-"` |
| **空格开头** | 用引号包裹 | `" 开头有空格"` |

#### 3. 数组格式

| ❌ 错误格式（流式序列） | ✅ 正确格式（块序列） |
|----------------------|---------------------|
| `cases: [item1, item2]` | ```yaml\ncases:\n  - item1\n  - item2\n``` |

**规则**：优先使用块序列格式（每项一行，用 `-` 开头）

#### 4. 缩进规则

- ✅ 使用 **2 空格** 缩进（不要使用 Tab）
- ✅ 保持层级一致性
- ❌ 不要混用空格和 Tab

#### 5. 实际示例

```yaml
# ❌ 错误示例
cases:
  - 点击'去处理'按钮  # 中文引号被外层单引号包裹
  - [item1, item2]     # 流式序列格式

# ✅ 正确示例
cases:
  - 点击"去处理"按钮    # 直接使用中文引号
  - item1              # 块序列格式
  - item2
```

#### 6. 验证方法

生成 YAML 后，使用以下命令验证：

```bash
# 方法1: 使用 Python PyYAML 验证
python -c "import yaml; yaml.safe_load(open('data.yaml'))"

# 方法2: 使用测试套件生成器验证（会自动检查格式）
python skills/e2e-testing/tools/testsuite_generator.py --data data.yaml --output test.xlsx
```

如果遇到解析错误，请检查：
1. 是否有中文引号被英文引号包裹
2. 是否使用了流式序列格式 `[item1, item2]`
3. 是否使用了 Tab 缩进（应使用 2 空格）
4. 是否有未转义的特殊字符（冒号、井号等）

### ⚡ 工具优先策略（节省 Token）

**生成 Excel 时**：
1. **优先**：生成 YAML 数据文件 → 调用 `testsuite_generator.py`（节省 ~80% Token）
2. **降级**：如工具失败或需要特殊格式 → 使用 xlsx 技能

**验证 Excel 时**：
1. **优先**：调用 `validate_testsuite.py`（输出结构化报告）
2. **降级**：如工具失败 → AI 手动检查

**工作流示例**：
```bash
# 1. 分析页面生成 YAML 数据（AI 只输出数据，不输出代码）
# 2. 调用工具生成 Excel
python tools/testsuite_generator.py --data workspace/data.yaml --output workspace/TestSuite.xlsx

# 3. 调用工具校验
python tools/validate_testsuite.py workspace/TestSuite.xlsx

# 4. 如有错误，修复 YAML 后重新生成
```

## MCP 工具

### Playwright MCP（推荐）
- `browser_navigate` - 页面导航
- `browser_snapshot` - 获取快照
- `browser_click` - 点击操作
- `browser_tabs` - 标签页管理（list/select/close）
- `browser_fill_form` - 表单填写

### Chrome DevTools MCP（备选）
- `take_snapshot` - 获取快照
- `click` - 点击操作
- `fill` - 输入操作

## 点击导航处理

点击可能触发新标签页（`window.open`）的元素时，参考：[click-navigation-spec.md](reference/click-navigation-spec.md)

## 示例文件

| 格式 | 文件 |
|------|------|
| Excel | [TestSuite-SPA.xlsx](examples/TestSuite-SPA.xlsx) |
| YAML | [TestSuite-SPA.yaml](examples/TestSuite-SPA.yaml) |

## Vue SPA 定位

Vue/Element UI/TDesign 等 SPA 框架定位策略：[vue-spa-locator-spec.md](reference/vue-spa-locator-spec.md)

## 执行配置

MCP 执行时自动应用：[config/ai-execution-override.json](config/ai-execution-override.json)

---

## 端到端流程图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           E2E Testing 完整流程                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  【输入】                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │ 录制脚本      │  │ 页面 URL     │  │ 需求文档      │                      │
│  │ (Playwright) │  │ (MCP 访问)   │  │ (PRD/AC)     │                      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                      │
│         │                 │                 │                              │
│         └────────────┬────┴─────────────────┘                              │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. POM 生成 (pom-spec.md)                                           │   │
│  │    - 解析录制代码 / MCP 获取页面快照                                   │   │
│  │    - 识别页面元素和定位策略                                            │   │
│  │    - 输出: POM.yaml                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                      │                                                      │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 2. 用例设计 (testcase-design-spec.md)                               │   │
│  │    - 分析测试范围和场景                                               │   │
│  │    - 设计用例结构和步骤                                               │   │
│  │    - 准备测试数据                                                     │   │
│  │    - 输出: TestSuite.yaml 或 TestSuite.xlsx                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                      │                                                      │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 3. 套件审查 (testsuite-review-spec.md)                              │   │
│  │    - 校验格式完整性                                                   │   │
│  │    - 检查引用一致性                                                   │   │
│  │    - 验证枚举值合法性                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                      │                                                      │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 4. 测试执行 (test-execute-spec.md)                                  │   │
│  │    - 读取 Sheet3 执行计划（启用=是）                                   │   │
│  │    - 逐用例执行：导航 → 操作 → 断言 → 截图                             │   │
│  │    - 实时更新 Sheet3 执行状态（待执行→执行中→通过/失败/跳过）            │   │
│  │    - 输出: progress.md + 截图 + execution.log                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                      │                                                      │
│                      ▼                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 5. 结果分析 (result-analyze-spec.md)                                │   │
│  │    - 统计通过率和失败分布                                             │   │
│  │    - 分析失败原因                                                     │   │
│  │    - 生成修复建议                                                     │   │
│  │    - 输出: report.md                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  【输出目录结构】(output-spec.md)                                           │
│  workspace/e2e-test/                                                       │
│  ├── TestSuite-{项目}.xlsx          # 测试套件（含执行状态）                 │
│  ├── TestSuite-{项目}.yaml          # YAML 格式套件                        │
│  └── execute-{timestamp}/           # 执行结果目录                          │
│      ├── progress.md                # 执行进度                              │
│      ├── report.md                  # 分析报告                              │
│      ├── TC-*_success_*.png         # 成功截图                              │
│      ├── TC-*_error_*.png           # 失败截图                              │
│      └── logs/execution.log         # 执行日志                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Excel 执行状态更新示例

执行过程中，Sheet3（执行-执行计划）的执行状态列会实时更新：

**执行前**：
| 序号 | 用例ID | 执行用户 | 启用 | 执行状态 |
|------|--------|----------|------|----------|
| 1 | TC-OA-登录-正常登录-001 | U001 | 是 | 待执行 |
| 2 | TC-OA-登录-密码错误-002 | U001 | 是 | 待执行 |
| 3 | TC-OA-登录-用户名为空-003 | U001 | 否 | 待执行 |

**执行中**（用例1正在执行）：
| 序号 | 用例ID | 执行用户 | 启用 | 执行状态 |
|------|--------|----------|------|----------|
| 1 | TC-OA-登录-正常登录-001 | U001 | 是 | **执行中** |
| 2 | TC-OA-登录-密码错误-002 | U001 | 是 | 待执行 |
| 3 | TC-OA-登录-用户名为空-003 | U001 | 否 | 待执行 |

**执行后**：
| 序号 | 用例ID | 执行用户 | 启用 | 执行状态 |
|------|--------|----------|------|----------|
| 1 | TC-OA-登录-正常登录-001 | U001 | 是 | **通过** |
| 2 | TC-OA-登录-密码错误-002 | U001 | 是 | **失败** |
| 3 | TC-OA-登录-用户名为空-003 | U001 | 否 | **跳过** |

**执行状态枚举**（6项）：
- `待执行` - 尚未开始
- `执行中` - 正在执行
- `通过` - 执行成功
- `失败` - 执行失败
- `跳过` - 启用=否，跳过执行
- `阻塞` - 依赖用例失败，无法执行
