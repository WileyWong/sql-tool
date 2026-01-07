# E2E 测试本地工具集

供 AI 在本地调用的 Python 工具，用于辅助 E2E 测试流程。

**格式版本**: v3.0（扁平格式 YAML，与 Excel 直接映射）

## ⚡ 工具优先策略

**核心原则**：优先使用 Python 工具，降级到 AI 处理。Python 工具是**优化手段**，不是**必要依赖**。

| 场景 | 优先方案 | 降级方案 | Token 节省 |
|------|----------|----------|-----------|
| 生成 Excel | `testsuite_generator.py` | xlsx 技能 | ~80% |
| 校验 Excel | `validate_testsuite.py` | AI 手动检查 | ~90% |
| 格式转换 | `sync_excel_yaml.py` | AI 手动转换 | ~70% |
| 解析快照 | `parse_snapshot.py` | AI 手动解析 | ~60% |
| 执行解析 | `execution_parser.py` | AI 读取 Excel → 解析步骤 | ~80% |
| 结果分析 | `result_analyzer.py` | AI 读取 progress.md → 分析 | ~85% |
| 状态更新 | `execution_status_updater.py` | xlsx 技能逐个更新 | ~75% |
| POM 生成 | `pom_generator.py` | AI 分析快照 → 生成 YAML | ~85% |
| 快照对比 | `snapshot_diff.py` | AI 对比两次快照文本 | ~70% |
| MCP 命令 | `mcp_command_generator.py` | AI 手动构造参数 | ~70% |

## 工具列表

### 基础工具

| 工具 | 功能 | 对应子命令 |
|------|------|-----------|
| `testsuite_generator.py` | **生成 Excel**（从 YAML 数据） | `e2e generate` |
| `validate_testsuite.py` | **校验 Excel** | `e2e review` |
| `sync_excel_yaml.py` | Excel ↔ YAML 双向同步 | `e2e sync` |
| `update_excel_validation.py` | Excel 数据验证设置 | `e2e sync` (辅助) |
| `parse_snapshot.py` | 解析页面快照 | `e2e pom` (辅助) |

### 执行优化工具（节省 Token）

| 工具 | 功能 | 对应子命令 |
|------|------|-----------|
| `execution_parser.py` | **解析执行计划** → 可执行步骤 JSON | `e2e execute` |
| `result_analyzer.py` | **分析执行结果** → 结构化报告 | `e2e report` |
| `execution_status_updater.py` | **批量更新执行状态** | `e2e execute` (辅助) |
| `pom_generator.py` | **生成 POM YAML**（含降级定位器） | `e2e pom` |
| `snapshot_diff.py` | **快照差异对比** | `e2e execute` (辅助) |
| `mcp_command_generator.py` | **生成 MCP 命令参数** | `e2e execute` (辅助) |

## 依赖安装

```bash
pip install openpyxl pyyaml
```

## 工具详情

### 0. testsuite_generator.py - Excel 生成（推荐）

从 YAML 数据文件生成完整的 TestSuite Excel，包含 11 个 Sheet、17 项数据验证、15 个命名范围。

**优势**：
- **节省 ~80% Token**：AI 只需输出 YAML 数据，无需输出 Python 代码
- **格式固化**：样式、枚举、参考文档等固定内容无需重复输出
- **自动生成**：执行计划可根据用例自动生成

```bash
# 基本用法
python testsuite_generator.py --data data.yaml --output TestSuite.xlsx

# 指定基础 URL
python testsuite_generator.py --data data.yaml --output TestSuite.xlsx --base-url http://localhost:3000
```

**YAML 数据结构**：
```yaml
# 必填字段
cases:       # 用例定义（8列）
steps:       # 执行步骤（11列）
pom:         # POM 元素（9列）

# 可选字段（有默认值或自动生成）
test_data:       # 测试数据（默认空）
execution_plan:  # 执行计划（自动生成）
users:           # 用户配置（有默认值）
global_config:   # 全局配置（有默认值）
mock_scenes:     # Mock 场景（有默认值）
base_url:        # 基础 URL
```

**数据模板**：参见 `data_template.yaml`

### 1. validate_testsuite.py - 数据校验（推荐）

校验 TestSuite Excel 文件的完整性、一致性和格式规范性。

**Vue SPA 校验**（v2.1）:
- 检测不稳定定位器（`data-v-xxx`、CSS Modules 哈希）
- 检测 Element UI 动态 ID（`el-id-xxx`）
- 警告不推荐的 ARIA 定位方式（Tab、表头）

```bash
python3 validate_testsuite.py TestSuite.xlsx
```

### 2. sync_excel_yaml.py - 格式同步（推荐）

Excel 和 YAML 格式之间的双向转换和同步。支持 v3.0 扁平格式。

**v3.0 扁平格式特点**:
- 所有数据使用二维列表，直接映射 Excel 行列
- 与 `testsuite_generator.py` 完全兼容
- 作为工具间的中间格式，不需要人工编辑

```bash
# Excel → YAML
python3 sync_excel_yaml.py --to-yaml TestSuite.xlsx -o test-suite.yaml

# YAML → Excel
python3 sync_excel_yaml.py --to-excel test-suite.yaml -o TestSuite.xlsx

# 双向同步（基于时间戳）
python3 sync_excel_yaml.py --sync TestSuite.xlsx test-suite.yaml
```

### 3. update_excel_validation.py - 数据验证设置（辅助）

为 Excel 文件设置完整的数据验证（下拉选项），包括枚举引用和跨 Sheet 引用。

**设置的数据验证（共 17 项）**:
- **枚举类型引用（12项）**：优先级、用例状态、操作类型、等待策略、断言类型、Mock场景、状态隔离、启用、执行状态、用户状态、定位方式、POM等待策略
- **跨 Sheet 数据引用（5项）**：用例ID、目标元素、执行用户、数据集

```bash
# 更新 Excel 文件的数据验证
python3 update_excel_validation.py TestSuite.xlsx
```

**创建的命名范围**:
- 枚举命名范围（11项）：`枚举_操作类型`、`枚举_等待策略`、`枚举_断言类型` 等
- 跨Sheet命名范围（4项）：`列表_用例ID`、`列表_用户ID`、`列表_元素ID`、`列表_数据集`

> **注意**：生成新的 Excel 文件后，应运行此工具设置数据验证，以提供下拉选项辅助用户输入。

### 4. parse_snapshot.py - 快照解析（辅助）

解析 Playwright/Chrome DevTools 生成的页面快照，提取元素信息。

**Vue SPA 支持**（v2.1）:
- 自动识别 Element UI/TDesign 组件类名
- 过滤不稳定的 Vue scoped CSS（`data-v-xxx`）
- 过滤 CSS Modules 哈希类名
- Tab/表头使用 UI 框架类名而非 `getByRole`

```bash
# 解析快照文件
python3 parse_snapshot.py snapshot.txt

# 输出为 YAML 格式
python3 parse_snapshot.py snapshot.txt -o elements.yaml

# 仅提取可交互元素
python3 parse_snapshot.py snapshot.txt --interactive

# 输出为 POM 格式
python3 parse_snapshot.py snapshot.txt --pom --page-id login --page-name 登录页
```

---

## 执行优化工具详情

### 5. execution_parser.py - 执行计划解析（推荐）

解析 Excel/YAML 中的执行计划，输出结构化的可执行步骤 JSON。与 `sync_excel_yaml.py` 的区别：
- `sync_excel_yaml.py`：格式转换，数据保持原样
- `execution_parser.py`：**编译**执行计划，替换变量、合并 POM 选择器

**功能**：
- 替换变量占位符 `${xxx}`
- 从 POM 解析 `pageId.elementId` → 获取选择器
- 只解析启用的用例
- 合并用户信息到输出

```bash
# 解析所有启用的用例
python execution_parser.py TestSuite.xlsx --output steps.json

# 解析指定用例
python execution_parser.py TestSuite.xlsx --case TC-001 --output steps.json

# 从 YAML 解析
python execution_parser.py TestSuite.yaml --case TC-001

# 包含禁用的用例
python execution_parser.py TestSuite.xlsx --all
```

**输出示例**：
```json
{
  "count": 2,
  "cases": [{
    "caseId": "TC-001",
    "name": "登录测试",
    "user": {"username": "admin", "password": "123456"},
    "steps": [{
      "seq": 1,
      "action": "输入",
      "target": "loginPage.username",
      "selector": "#username",
      "value": "admin"
    }]
  }]
}
```

### 6. result_analyzer.py - 执行结果分析

分析执行目录中的 progress.md 和日志，生成结构化报告。

```bash
# 分析执行结果
python result_analyzer.py execute-20251231-103000/ --output report.json

# 输出 Markdown 报告
python result_analyzer.py execute-20251231-103000/ --format markdown
```

**输出内容**：
- 总体统计（通过/失败/跳过/通过率）
- 用例详情（耗时、截图路径、错误信息）
- 失败分析（错误类型分布）

### 7. execution_status_updater.py - 执行状态更新

批量更新 Excel 中的执行状态，避免逐个单元格操作。

```bash
# 批量更新状态
python execution_status_updater.py TestSuite.xlsx --batch "TC-001:通过,TC-002:失败"

# 从 JSON 更新
python execution_status_updater.py TestSuite.xlsx --from-json results.json

# 重置所有状态
python execution_status_updater.py TestSuite.xlsx --reset
```

### 8. pom_generator.py - POM 生成器（增强版）

从页面快照生成完整的 POM YAML，包含降级定位器策略。

```bash
# 基本用法
python pom_generator.py snapshot.txt --page-id loginPage --output pom.yaml

# 指定页面信息
python pom_generator.py snapshot.txt --page-id loginPage --page-name 登录页 --page-url /login

# 合并到现有 POM
python pom_generator.py snapshot.txt --page-id loginPage --merge existing-pom.yaml
```

**特性**：
- 自动生成降级定位器（主定位器 + 备选定位器）
- 识别 Vue SPA 组件（Element UI、TDesign）
- 过滤不稳定选择器

### 9. snapshot_diff.py - 快照差异对比

对比两次页面快照，识别元素变化。

```bash
# 对比两个快照
python snapshot_diff.py before.txt after.txt --output diff.json

# 只显示变化的元素
python snapshot_diff.py before.txt after.txt --changes-only

# 输出 Markdown 格式
python snapshot_diff.py before.txt after.txt --format markdown
```

**输出内容**：
- 新增元素
- 删除元素
- 修改元素（属性变化）
- 变化摘要

### 10. mcp_command_generator.py - MCP 命令生成器

将执行步骤转换为 MCP 工具调用参数。

```bash
# 从 execution_parser 输出生成
python mcp_command_generator.py steps.json --mcp playwright --output commands.json

# 指定 Chrome DevTools MCP
python mcp_command_generator.py steps.json --mcp devtools
```

**支持的 MCP**：
- `playwright`：Playwright MCP 工具参数
- `devtools`：Chrome DevTools MCP 工具参数

---

## AI 调用示例

AI 可以通过 `execute_command` 工具调用这些脚本：

### 推荐流程：生成 + 校验

```python
# 1. AI 生成 YAML 数据文件（只输出数据，不输出代码）
write_to_file("workspace/data.yaml", yaml_content)

# 2. 调用工具生成 Excel
execute_command("python tools/testsuite_generator.py --data workspace/data.yaml --output workspace/TestSuite.xlsx")

# 3. 调用工具校验
execute_command("python tools/validate_testsuite.py workspace/TestSuite.xlsx")

# 4. 如有错误，修复 YAML 后重新生成
```

### 单独调用

```python
# 生成 Excel（从 YAML）
execute_command("python tools/testsuite_generator.py --data data.yaml --output TestSuite.xlsx")

# 校验 TestSuite
execute_command("python tools/validate_testsuite.py TestSuite.xlsx")

# 同步格式
execute_command("python tools/sync_excel_yaml.py --to-yaml TestSuite.xlsx -o test-suite.yaml")

# 解析快照
execute_command("python tools/parse_snapshot.py snapshot.txt --pom")
```

### 降级处理

当工具失败时，AI 应：
1. **生成失败**：检查 YAML 格式，或降级使用 xlsx 技能
2. **校验失败**：根据错误信息修复数据，或手动检查
3. **同步失败**：检查文件格式，或手动转换
4. **执行解析失败**：使用 xlsx 技能读取 Sheet3 → AI 解析执行计划
5. **结果分析失败**：使用 read_file 读取 progress.md → AI 统计分析
6. **状态更新失败**：使用 xlsx 技能定位单元格 → 逐个更新

工具执行失败时会输出降级提示：
```json
{
  "error": "错误信息",
  "fallback_hint": "请使用 read_file 读取文件后手动解析"
}
```

## 工具设计原则

1. **确定性操作** - 输入输出明确，无需 AI 理解
2. **无外部依赖** - 仅依赖 Python 标准库 + openpyxl/pyyaml
3. **命令行友好** - 支持 argparse，有完整的帮助信息
4. **错误处理** - 清晰的错误提示，合理的退出码
5. **日志输出** - 使用 logging 模块，支持不同级别

## v3.0 格式说明

### YAML 扁平格式

所有数据使用二维列表（数组的数组），直接映射 Excel 行列：

```yaml
base_url: "https://example.com"

cases:           # [用例ID, 系统, 用例名称, 模块, 优先级, 前置条件, 标签, 用例状态, 描述]
steps:           # [用例ID, 步骤序号, 步骤描述, 操作类型, 目标元素, 输入值, ...]
pom:             # [页面ID, 页面名称, 页面URL, 元素ID, 元素名称, ...]
test_data:       # [数据集, 字段名, 字段说明, 值]
users:           # [用户ID, 用户名, 密码, 角色, 权限, 状态, 备注]
execution_plan:  # [序号, 用例ID, 执行用户, ...]
mock_scenes:     # [场景ID, 场景名称, API模式, ...]
global_config:   # [配置分类, 配置项, 配置值, 说明]
```

### Excel Sheet 编号

| Sheet | 名称 | 说明 |
|-------|------|------|
| Sheet0 | 用例-定义 | 测试用例定义 |
| Sheet1 | 用例-执行步骤 | 步骤明细 |
| Sheet2 | 用例-测试数据 | KV 格式测试数据 |
| Sheet3 | 执行-执行计划 | 执行范围配置 |
| Sheet4 | 配置-用户 | 用户账号 |
| Sheet5 | 配置-全局 | 环境配置 |
| Sheet6 | 元数据-POM | 页面对象 |
| Sheet7 | 元数据-枚举定义 | 下拉选项 |
| Sheet10 | 元数据-Mock场景 | API Mock |

## 参考文档

- [YAML 规则](../reference/yaml-rules.md)
- [Excel 规则](../reference/excel-rules.md)
- [校验规则](../reference/validation-rules.md)
- [Vue SPA 定位器规范](../reference/vue-spa-locator-spec.md)
