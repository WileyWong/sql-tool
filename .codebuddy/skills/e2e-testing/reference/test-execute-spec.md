# 测试执行规范

> ⚠️ **本文档为强制规范，非建议性指引。所有内容必须严格遵循。**

## 输入

| 类型 | 必需 | 说明 |
|------|------|------|
| 测试套件 | 是 | 审查通过的 YAML/Excel |
| 执行范围 | 可选 | 指定用例ID或标签 |
| 执行配置 | 可选 | 浏览器、超时等 |

## 工具选择

| 场景 | 推荐工具 | 说明 |
|------|----------|------|
| 已有 Playwright 环境 | Playwright MCP | 功能完整 |
| 快速调试 | Chrome DevTools MCP | 无需安装 |
| 复杂交互 | Playwright MCP | 更稳定 |

## 执行流程

### 1. 初始化

```
1. 读取测试套件
2. 确定执行范围（全部/按标签/指定用例）
3. 创建输出目录：{outputDir}/execute-{timestamp}/
4. 创建日志目录：{outputDir}/execute-{timestamp}/logs/
5. 创建日志文件：logs/execution.log（写入初始化日志）
6. 创建进度文件：progress.md（包含所有用例，状态=PENDING）
7. 初始化浏览器
```

#### 1.1 创建日志文件（必须）

使用 `execute_command` 创建并写入日志文件：

```powershell
# Windows PowerShell
$logFile = "{outputDir}/execute-{timestamp}/logs/execution.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] [INFO] ========== 测试执行开始 =========="
Add-Content -Path $logFile -Value "[$timestamp] [INFO] 测试套件: TestSuite-OA.xlsx"
Add-Content -Path $logFile -Value "[$timestamp] [INFO] 用例总数: 8"
Add-Content -Path $logFile -Value "[$timestamp] [INFO] 输出目录: {outputDir}/execute-{timestamp}/"
```

```bash
# macOS/Linux Bash
LOG_FILE="{outputDir}/execute-{timestamp}/logs/execution.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] [INFO] ========== 测试执行开始 ==========" >> "$LOG_FILE"
echo "[$TIMESTAMP] [INFO] 测试套件: TestSuite-OA.xlsx" >> "$LOG_FILE"
echo "[$TIMESTAMP] [INFO] 用例总数: 8" >> "$LOG_FILE"
echo "[$TIMESTAMP] [INFO] 输出目录: {outputDir}/execute-{timestamp}/" >> "$LOG_FILE"
```

#### 1.2 创建进度文件（必须）

使用 `write_to_file` 创建初始 `progress.md`，所有用例状态为 PENDING：

```markdown
## 执行进度

**开始时间**: 2025-12-31 10:30:00
**当前状态**: 初始化完成

| 用例 | 状态 | 耗时 | 截图 |
|------|------|------|------|
| TC-001 | ⏸️ PENDING | - | - |
| TC-002 | ⏸️ PENDING | - | - |
| TC-003 | ⏸️ PENDING | - | - |
```

> **注意**: 输出目录必须记录**完整绝对路径**，便于后续定位执行结果和截图文件。

### 2. 逐用例执行

```
for each case in suite:
  1. 更新 progress.md：当前用例状态 → RUNNING
  2. 追加日志：[CASE] {用例ID} 开始执行
  3. 执行前置条件（如有）→ 追加日志
  4. 逐步执行 steps:
     - navigate → browser_navigate → 追加日志
     - click → browser_click → 追加日志
     - click_and_navigate → 点击并导航处理 → 追加日志（见下方详细流程）
     - input → browser_type / browser_fill_form → 追加日志
     - select → browser_select_option → 追加日志
     - assert → 验证断言 → 追加日志
     - wait → 等待条件 → 追加日志
  5. 验证断言 → 追加日志
  6. 记录结果（pass/fail）→ 追加日志
  7. 截图（成功或失败）→ 追加日志
  8. 更新 progress.md：当前用例状态 → PASS/FAIL，记录耗时和截图链接
```

#### 2.0.1 日志追加方式

每个操作完成后，使用 `execute_command` 追加日志：

```powershell
# Windows PowerShell
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] [STEP] 步骤1: 打开页面 https://example.com - ✅"
```

```bash
# macOS/Linux Bash
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [STEP] 步骤1: 打开页面 https://example.com - ✅" >> "$LOG_FILE"
```

#### 2.0.2 进度更新方式

每个用例执行完成后，使用 `replace_in_file` 更新 `progress.md` 中对应行：

```
# 将
| TC-001 | ⏸️ PENDING | - | - |
# 替换为
| TC-001 | ✅ PASS | 5.2s | [截图](./TC-001_success_103005.png) |
```

### 2.1 点击并导航处理流程

当操作类型为 `点击并导航` 或点击可能触发新标签页的元素时，必须按以下流程处理：

```
1. 记录点击前状态
   - browser_tabs(action=list) 获取当前标签页数量
   - 记录当前页面 URL

2. 执行点击
   - browser_click(ref=目标元素)

3. 等待响应（1-2秒）

4. 检测导航类型
   - browser_tabs(action=list) 获取最新标签页列表
   - 比较标签页数量变化

5. 分支处理
   ├─ 新标签页打开（标签页数量增加）
   │  └─ browser_tabs(action=select, index=新标签页索引)
   │  └─ browser_snapshot() 获取新页面快照
   │  └─ 记录: [NAV] 新标签页打开: {url}
   │
   ├─ 当前页跳转（URL变化）
   │  └─ 等待页面加载完成
   │  └─ browser_snapshot() 获取新页面快照
   │  └─ 记录: [NAV] 页面跳转: {old_url} → {new_url}
   │
   └─ 无导航变化
      └─ 检查是否有弹窗/DOM变化
      └─ 记录: [NAV] 无导航变化
```

**日志示例**：
```
[2025-12-31 10:30:10] [STEP] 步骤3: 点击并导航 [去处理按钮]
[2025-12-31 10:30:10] [NAV] 点击前标签页数量: 1
[2025-12-31 10:30:11] [NAV] 点击后标签页数量: 2
[2025-12-31 10:30:11] [NAV] 检测到新标签页，切换到索引 1
[2025-12-31 10:30:12] [NAV] 新标签页 URL: https://example.com/detail?id=123
[2025-12-31 10:30:12] [STEP] 步骤3: ✅ 完成
```

**用例执行日志示例**：
```
[2025-12-31 10:30:05] [CASE] TC-001 开始执行: 查看待办列表
[2025-12-31 10:30:05] [STEP] 步骤1: 打开页面 https://test.example.com/task
[2025-12-31 10:30:06] [STEP] 步骤1: ✅ 完成
[2025-12-31 10:30:06] [STEP] 步骤2: 点击 [待办中心]
[2025-12-31 10:30:07] [STEP] 步骤2: ✅ 完成
[2025-12-31 10:30:07] [ASSERT] 断言: 页面标题包含 "待办中心" - ✅ 通过
[2025-12-31 10:30:08] [SCREENSHOT] /Users/xxx/project/workspace/e2e-output/execute-20251231-103000/TC-001_success_103008.png
[2025-12-31 10:30:08] [CASE] TC-001 执行完成: ✅ PASS (3.0s)
```

> **注意**: `[SCREENSHOT]` 日志必须记录截图的**完整绝对路径**，便于后续复制和定位文件。

### 3. 错误处理

| 错误类型 | 处理策略 |
|---------|---------|
| 元素未找到 | 重试 3 次，间隔 1s |
| 断言失败 | 截图 + 记录 + 继续 |
| 超时 | 标记失败 + 继续 |
| 网络错误 | 重试 2 次 |

### 4. 进度跟踪

实时更新 `progress.md`：

```markdown
## 执行进度

**开始时间**: 2025-12-31 10:30:00
**当前状态**: 执行中

| 用例 | 状态 | 耗时 | 截图 |
|------|------|------|------|
| TC-Zhaopin-待办中心-查看待办列表-001 | ✅ PASS | 5.2s | [截图](./TC-Zhaopin-待办中心-查看待办列表-001_success_103005.png) |
| TC-Zhaopin-待办中心-切换标签页-002 | ❌ FAIL | 3.1s | [截图](./TC-Zhaopin-待办中心-切换标签页-002_error_103010.png) |
| TC-Zhaopin-待办中心-切换功能分类-003 | ⏳ RUNNING | - | - |
| TC-Zhaopin-待办中心-关键词搜索-004 | ⏸️ PENDING | - | - |
```

### 5. 截图保存规范

#### 文件命名

为避免文件覆盖，截图命名必须包含**完整用例ID**和**时间戳**：

```
{完整用例ID}_{类型}_{HHMMSS}.png
```

| 类型 | 说明 | 示例 |
|------|------|------|
| `success` | 用例通过时截图 | TC-Zhaopin-待办中心-查看待办列表-001_success_103008.png |
| `error` | 用例失败时截图 | TC-Zhaopin-待办中心-查看待办列表-001_error_103015.png |
| `step{N}` | 关键步骤截图 | TC-Zhaopin-待办中心-查看待办列表-001_step1_103005.png |

> **重要**:
> - 必须使用**完整用例ID**（如 `TC-Zhaopin-待办中心-查看待办列表-001`），严禁使用简写（如 `TC-001`）
> - 时间戳格式: `HHMMSS`（时分秒），确保同一用例多次截图不会覆盖

#### 截图调用方式

使用 Playwright MCP 截图时，指定**完整用例ID**+时间戳的文件名：

```json
{
  "filename": "TC-Zhaopin-待办中心-查看待办列表-001_step1_103005.png"
}
```

#### 路径记录

在 progress.md 和 report.md 中记录截图的**相对路径**：

```markdown
| 截图 |
|------|
| [查看](./TC-Zhaopin-待办中心-查看待办列表-001_success_103008.png) |
```

### 6. 清理阶段（必须执行）

测试执行完成后，**必须执行**以下清理步骤：

#### 6.1 移动截图到执行目录

根据 [output-spec.md](output-spec.md) 规范，截图文件应**直接存放在执行目录下**：

```
{outputDir}/execute-{timestamp}/
├── TC-Zhaopin-待办中心-查看待办列表-001_success_103008.png    # 成功截图
├── TC-Zhaopin-待办中心-查看待办列表-001_error_103015.png      # 失败截图
├── TC-Zhaopin-待办中心-查看待办列表-001_step1_103005.png    # 步骤截图
├── progress.md
├── report.md
└── logs/
    └── execution.log
```

Playwright MCP 截图默认保存到临时目录，需要**移动**（非复制）到执行目录：

```bash
# 执行目录（在初始化阶段已创建）
EXECUTE_DIR="{outputDir}/execute-{timestamp}"

# 1. 查找 Playwright 截图临时目录（最近30分钟内）
PLAYWRIGHT_DIR=$(find /var/folders -path "*/playwright-mcp-output/*" -type d -mmin -30 2>/dev/null | head -1)

# 2. 移动截图到执行目录根目录（使用 mv 而非 cp）
if [ -n "$PLAYWRIGHT_DIR" ]; then
  mv "$PLAYWRIGHT_DIR"/*.png "$EXECUTE_DIR"/ 2>/dev/null
fi
```

> **注意**: 
> - 截图直接放在 `execute-{timestamp}/` 目录下，不放在子目录
> - 使用 `mv` 移动文件而非 `cp` 复制，节省磁盘空间

#### 6.2 写入执行结束日志

```
[2025-12-31 10:35:00] [INFO] ========== 测试执行结束 ==========
[2025-12-31 10:35:00] [INFO] 总用例: 8, 通过: 6, 失败: 0, 跳过: 2
[2025-12-31 10:35:00] [INFO] 通过率: 75%
[2025-12-31 10:35:00] [INFO] 总耗时: 5分00秒
[2025-12-31 10:35:00] [INFO] 截图已移动: 4 个文件
```

#### 6.3 更新报告中的截图路径

确保 progress.md 和 report.md 中的截图链接指向正确的相对路径（如 `./TC-001_success.png`）。

#### 6.4 批次录屏处理（可选）

录屏在 MCP Server 层面配置，对整个执行批次（一次对话）生效。**默认不启用**。

**启用条件**：
- 用户在执行指令中明确要求录屏（如"执行用例，启用录屏"）

**前提条件**：
- MCP Server 需配置 `--save-video` 参数（在 MCP 配置文件中设置）

**执行流程**：
```
1. 批次开始：MCP Server 已配置 --save-video，自动开始录屏
2. 执行用例：正常使用 MCP 工具（browser_navigate, browser_click 等）
3. 批次结束：调用 browser_close 保存视频
4. 归集视频：移动到执行目录
```

**归集命令**：

Windows (PowerShell):
```powershell
$tempDir = "$env:TEMP\playwright-mcp-output"
$latestSession = Get-ChildItem $tempDir -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Move-Item "$($latestSession.FullName)\*.webm" "{outputDir}\execute-{timestamp}\" -Force
```

macOS/Linux (Bash):
```bash
PLAYWRIGHT_DIR=$(find /var/folders -path "*/playwright-mcp-output/*" -type d -mmin -30 2>/dev/null | head -1)
if [ -n "$PLAYWRIGHT_DIR" ]; then
  mv "$PLAYWRIGHT_DIR"/*.webm "$EXECUTE_DIR"/ 2>/dev/null
fi
```

**视频命名**：
```
batch_{YYYYMMDD}_{HHMMSS}.webm  # 整个批次的录屏
```

**意外情况处理**：

当执行过程中出现意外（用例失败、网络错误、用户取消等），必须调用 `browser_close` 关闭浏览器以保存录屏：

```
意外发生
    ↓
browser_close  ← 必须调用，触发视频保存
    ↓
归集视频到执行目录
    ↓
记录日志：[VIDEO] 录屏已保存（执行中断）
```

| 场景 | 处理方式 | 录屏是否保存 |
|------|----------|--------------|
| 正常结束 | `browser_close` | ✅ 完整保存 |
| 用例失败终止 | `browser_close` | ✅ 保存到失败点 |
| 用户取消 | `browser_close` | ✅ 保存到取消点 |
| AI 对话超时 | MCP 进程结束 | ⚠️ 可能不完整 |

**日志示例**：
```
[2025-12-31 10:35:00] [VIDEO] 录屏已保存: batch_20251231_103000.webm
[2025-12-31 10:35:00] [VIDEO] 视频已移动到执行目录
```

> **注意**：
> - 录屏只能在批次级别控制，无法按单个用例启用/禁用
> - 录屏不消耗 Token（后台静默录制，仅占用磁盘空间）
> - 视频格式为 WebM

## 执行参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--plan` | 执行计划 | `--plan smoke` |
| `--tag` | 按标签筛选 | `--tag @P0` |
| `--module` | 按模块筛选 | `--module login` |
| `--case` | 指定用例 | `--case TC-001,TC-002` |
| `--retry` | 重试失败用例 | `--retry` |
| `--parallel` | 并行数 | `--parallel 4` |
| `--headed` | 有头模式 | `--headed` |
| `--debug` | 调试模式 | `--debug` |

## 输出物

| 文件 | 内容 | 位置 | 必需 |
|------|------|------|------|
| progress.md | 执行进度 | {outputDir}/execute-{ts}/ | ✅ |
| report.md | 测试报告 | {outputDir}/execute-{ts}/ | ✅ |
| execution.log | 详细日志 | {outputDir}/execute-{ts}/logs/ | ✅ |
| {用例ID}_*.png | 截图 | {outputDir}/execute-{ts}/ | ✅ |

> 详见 [output-spec.md](output-spec.md)

## 断点续执行

如果执行中断，读取 `progress.md` 从上次位置继续：

```bash
e2e execute --resume
```

检测逻辑：
1. 读取 progress.md
2. 找到最后一个 PASS/FAIL 的用例
3. 从下一个 PENDING 用例继续

## MCP 工具映射

| 动作 | Playwright MCP | Chrome DevTools MCP |
|------|---------------|-------------------|
| navigate | browser_navigate | navigate_page |
| click | browser_click | click |
| input | browser_type | fill |
| snapshot | browser_snapshot | take_snapshot |
| screenshot | browser_take_screenshot | take_screenshot |
| wait | browser_wait_for | wait_for |

## 执行示例

```
用户: e2e execute --tag @smoke

执行流程:
1. 读取 test-suite.yaml
2. 筛选 tags 包含 @smoke 的用例
3. 创建 {outputDir}/execute-20251231-103000/
4. 逐个执行用例
5. 生成 results.json
6. 输出执行摘要
```
