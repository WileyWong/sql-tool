---
name: tdd-testing
description: 统一的测试工作流技能，支持 API 测试和单元测试。自动识别输入类型（代码/文档），路由到对应策略，按流程执行：设计测试用例文档 → 生成测试代码 → 执行测试 → 清理。当用户提到测试、API测试、单元测试、测试用例、测试覆盖率时使用。
category: tdd
keywords: [测试, API测试, 单元测试, 测试用例, 测试覆盖率, TDD, 集成测试]
---

# TDD 测试工作流

统一的测试工作流技能，支持 **API 测试（集成测试）** 和 **单元测试** 两种模式。

## 核心流程

```
输入判断 → 设计测试用例文档 → ✅检查点1 → 生成测试代码 → ✅检查点2 → 执行测试 → ✅检查点3 → [询问清理]
```

---

## ⚠️ 强制检查点（必须遵守）

> **重要**: 每个检查点必须通过才能进入下一步，不可跳过！

| 检查点 | 位置 | 检查内容 | 不通过处理 |
|--------|------|----------|-----------|
| **检查点1** | 步骤1完成后 | 测试用例内容完整、符合规范 | 修正后重新检查 |
| **检查点2** | 步骤2完成后 | 代码完整、无语法错误、无编译错误 | 修正后重新检查 |
| **检查点3** | 步骤3完成后 | 输出详细测试报告文档并包含总结 | 补充报告内容 |
| **清理询问** | 流程结束时 | 如需清理，询问用户是否执行 | 等待用户确认 |

---

## 快速开始

复制此清单跟踪进度：

```
测试工作流进度:
- [ ] 步骤0: 输入类型判断与策略路由
- [ ] 步骤1: 设计/抽取/规范化测试用例文档
- [ ] ✅ 检查点1: 验证测试用例完整性和规范性
- [ ] 步骤2: 生成测试代码（含清理代码）
- [ ] ✅ 检查点2: 验证代码完整性和可编译性
- [ ] 步骤3: 执行测试
- [ ] ✅ 检查点3: 输出详细测试报告并总结
- [ ] 步骤4: 清理（询问用户后执行，仅集成测试）
```

---

## 步骤0: 输入类型判断与策略路由

### 判断规则

```
输入判断:
│
├── 输入是代码文件？
│   ├── HTTP RESTful API 代码 (Controller/@RestController/@RequestMapping)
│   │   └── 策略: api-test (黑盒) → 集成测试流程
│   │
│   └── 业务代码 (Service/Repository/Utils)
│       └── 策略: whitebox (白盒) → 单元测试流程
│
├── 输入是文档？
│   ├── 是测试用例设计文档？(见下方判断标准)
│   │   └── 策略: normalize → 规范化处理
│   │
│   └── 否（接口文档/需求文档/OpenAPI/Swagger）
│       └── 策略: api-test (黑盒) → 集成测试流程
│
└── 用户明确指定单元测试（Mock 隔离）
    └── 策略: whitebox → 单元测试流程
```

### 测试用例文档判断标准

```yaml
is_test_case_doc:
  必须包含:
    - 测试用例列表（含用例ID/名称）
    - 测试场景描述
    - 预期结果
  可选包含:
    - 前置条件
    - 测试数据
    - 清理步骤
  
  不是测试用例文档:
    - API 接口文档（OpenAPI/Swagger/手写）
    - 需求文档（PRD/用户故事）
    - 设计文档（技术方案）
```

### 测试类型选择

| 测试类型 | 适用场景 | 特点 |
|---------|---------|------|
| **api-test (集成测试)** | HTTP API、Controller、真实环境验证 | 真实调用、需要清理 |
| **whitebox (单元测试)** | Service、Repository、Utils、业务逻辑 | Mock 隔离、不需清理 |

---

## 步骤1: 设计测试用例文档

根据步骤0的判断结果，选择对应策略：

### 策略1: api-test（黑盒测试）

**适用于**: 接口文档、API 代码文件

**详细指南**: [strategies/design-test-case/api-test/](strategies/design-test-case/api-test/)

**核心步骤**:
1. 分析接口文档/代码 → 提取参数约束和业务规则
2. 按 6 维度设计用例 → 功能/参数/业务/异常/安全/性能
3. 编写测试用例说明书 → 遵循 AAA 模式

### 策略2: whitebox（白盒测试）

**适用于**: 业务代码（Service/Repository/Utils）

**详细指南**: [strategies/design-test-case/whitebox/](strategies/design-test-case/whitebox/)

**核心步骤**:
1. 分析代码调用链路 (Controller → Service → Repository)
2. 提取验证规则、业务分支、异常处理
3. 按 5 个维度设计测试用例

### 策略3: normalize（规范化处理）

**适用于**: 已有测试用例文档

**详细指南**: [strategies/design-test-case/normalize/](strategies/design-test-case/normalize/)

**核心步骤**:
1. 解析现有测试用例文档
2. 检查结构完整性
3. 补充缺失内容
4. 统一格式规范

---

## ✅ 检查点1: 测试用例完整性验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤2，不可跳过！

详细规范见: [test-case-spec-standard.md](test-case-spec-standard.md)

### 检查清单

```yaml
checkpoint_1_validation:
  结构完整性:
    - [ ] 包含文档元信息（change_id/domain/test_type）
    - [ ] 包含测试范围说明
    - [ ] 包含用例分类（功能/参数/业务/异常/安全/性能）
  
  用例规范性:
    - [ ] 每个用例有唯一ID
    - [ ] 用例命名遵循 Method-Scenario-Expected 模式
    - [ ] 包含前置条件
    - [ ] 包含测试步骤
    - [ ] 包含预期结果（状态码/响应体/数据库状态）
  
  覆盖完整性:
    - [ ] 正常流程覆盖
    - [ ] 参数验证覆盖（必填/边界值/格式）
    - [ ] 异常场景覆盖（401/403/404/409）
    - [ ] 业务规则覆盖
  
  可执行性:
    - [ ] 测试数据明确
    - [ ] 清理策略明确（集成测试）
```

### 检查点1通过标准

```
✅ 通过条件:
  - 所有结构完整性检查项通过
  - 所有用例规范性检查项通过
  - 覆盖完整性检查项至少 80% 通过
  - 所有可执行性检查项通过

❌ 不通过处理:
  1. 列出未通过的检查项
  2. 修正测试用例文档
  3. 重新执行检查点1验证
  4. 直到全部通过才能继续
```

---

## 步骤2: 生成测试代码

根据测试类型和语言选择对应策略：

### 策略1: api-test（集成测试代码）

支持 **Java**、**Python**、**Go** 和 **Groovy/Spock** 四种语言：

| 语言 | 技术栈 | 详细指南 |
|------|--------|---------|
| **Java** | JUnit 5, OkHttp3, Jackson | [strategies/generate-test-code/api-test-java/](strategies/generate-test-code/api-test-java/) |
| **Python** | pytest, requests, filelock | [strategies/generate-test-code/api-test-python/](strategies/generate-test-code/api-test-python/) |
| **Go** | testing, testify, net/http | [strategies/generate-test-code/api-test-go/](strategies/generate-test-code/api-test-go/) |
| **Groovy/Spock** | Spock, REST-assured | [strategies/generate-test-code/api-test-spock/](strategies/generate-test-code/api-test-spock/) |

**Java 输出**:
- 测试类文件 (`*ApiTest.java`)
- 清理代码 (`CleanupRegistry.java`)

**Python 输出**:
- 测试文件 (`test_*_api.py`)
- pytest 配置 (`pytest.ini`)
- 清理注册表 (`.cleanup_registry.json`)

**Go 输出**:
- 测试文件 (`*_api_test.go`)
- 清理注册表 (`cleanup-registry.json`)

**Groovy/Spock 输出**:
- 测试类文件 (`*ApiSpec.groovy`)
- 清理类 (`CleanupRegistry.groovy`)

### 策略2: unit-test（单元测试代码）

支持 **Java**、**Go** 和 **Groovy/Spock** 三种语言：

| 语言 | 技术栈 | 详细指南 |
|------|--------|---------|
| **Java** | JUnit 5, Mockito, AssertJ | [strategies/generate-test-code/unit-test-java/](strategies/generate-test-code/unit-test-java/) |
| **Go** | testing, testify, mockery | [strategies/generate-test-code/unit-test-go/](strategies/generate-test-code/unit-test-go/) |
| **Groovy/Spock** | Spock, given-when-then | [strategies/generate-test-code/unit-test-spock/](strategies/generate-test-code/unit-test-spock/) |

**Java 输出**:
- 测试类文件 (`*Test.java`)
- Mock 配置

**Go 输出**:
- 测试文件 (`*_test.go`)
- Mock 文件 (`mocks/mock_*.go`)

**Groovy/Spock 输出**:
- 测试类文件 (`*Spec.groovy`)

---

## ✅ 检查点2: 代码完整性验证（必须通过）

> **⚠️ 强制要求**: 此检查点必须通过才能进入步骤3，不可跳过！

### 检查清单

```yaml
checkpoint_2_validation:
  代码完整性:
    - [ ] 所有测试方法已生成
    - [ ] 所有 import 语句完整
    - [ ] 所有依赖类已引用
    - [ ] 清理代码已生成（集成测试）
  
  语法检查（Java）:
    - [ ] 无 Java 语法错误
    - [ ] 括号匹配正确
    - [ ] 字符串闭合正确
    - [ ] 注解使用正确
  
  语法检查（Python）:
    - [ ] 无 Python 语法错误
    - [ ] 缩进正确
    - [ ] 字符串闭合正确
    - [ ] 装饰器使用正确
  
  语法检查（Go）:
    - [ ] 无 Go 语法错误
    - [ ] import 语句正确
    - [ ] 类型匹配正确
    - [ ] 错误处理完整
  
  语法检查（Groovy/Spock）:
    - [ ] 无 Groovy 语法错误
    - [ ] given-when-then 结构正确
    - [ ] Mock 配置正确
    - [ ] 闭包语法正确
  
  编译/语法验证:
    - [ ] Java: mvn test-compile 成功
    - [ ] Python: python -m py_compile test_*.py 成功
    - [ ] Go: go test -c ./... 成功
    - [ ] Groovy: mvn test-compile 或 gradle compileTestGroovy 成功
    - [ ] 无编译/语法错误
  
  规范检查:
    - [ ] 测试方法命名规范（test_Method_Scenario_Expected）
    - [ ] 遵循 AAA 模式（Arrange-Act-Assert）
    - [ ] Mock 配置正确（单元测试）
    - [ ] HTTP 请求配置正确（集成测试）
```

### 检查点2通过标准

```
✅ 通过条件:
  - 所有代码完整性检查项通过
  - 所有语法检查项通过
  - 所有编译检查项通过
  - 规范检查项至少 80% 通过

❌ 不通过处理:
  1. 列出编译错误和语法错误
  2. 修正测试代码
  3. 重新执行编译检查
  4. 直到全部通过才能继续

验证命令:
  # Java
  mvn compile -DskipTests    # 编译主代码
  mvn test-compile           # 编译测试代码
  
  # Python
  python -m py_compile test_*.py    # 语法检查
  pytest --collect-only             # 收集测试用例（不执行）
  
  # Go
  go test -c ./...                  # 编译测试代码
  go vet ./...                      # 静态检查
  
  # Groovy/Spock
  mvn test-compile                  # Maven 编译
  ./gradlew compileTestGroovy       # Gradle 编译
```

---

## 步骤3: 执行测试

**详细指南**: [strategies/run-test/](strategies/run-test/)

### 执行命令

**Java (Maven)**:
```bash
# 执行所有测试
mvn test

# 执行指定测试类
mvn test -Dtest=UserApiTest

# 执行指定测试方法
mvn test -Dtest=UserApiTest#testCreateUser
```

**Python (pytest)**:
```bash
# 执行所有测试
pytest test_user_api.py -v

# 仅运行P0用例
pytest test_user_api.py -m p0 -v

# 运行P0+P1用例
pytest test_user_api.py -m "p0 or p1" -v

# 生成HTML报告
pytest test_user_api.py --html=report.html
```

**Go (testing)**:
```bash
# 执行所有测试
go test -v ./...

# 执行指定测试
go test -v -run TestUserAPI

# 执行子测试
go test -v -run TestUserAPI/正常场景/TC001

# 生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**Groovy/Spock (Maven/Gradle)**:
```bash
# Maven 执行所有 Spock 测试
mvn test -Dtest=*Spec

# Gradle 执行所有 Spock 测试
./gradlew test --tests "*Spec"

# 执行指定测试类
./gradlew test --tests "UserApiSpec"

# 执行指定测试方法
./gradlew test --tests "UserApiSpec.TC001*"
```

---

## ✅ 检查点3: 测试报告输出（必须完成）

> **⚠️ 强制要求**: 测试执行完成后，必须输出详细测试报告文档并包含总结！

### 测试报告必须包含

```yaml
checkpoint_3_report:
  报告头部:
    - 测试执行时间
    - 测试环境信息
    - 测试范围说明
  
  测试统计:
    - 总用例数
    - 通过数量及百分比
    - 失败数量及百分比
    - 跳过数量及百分比
    - 执行总耗时
  
  详细结果:
    - 每个测试类的执行结果
    - 每个测试方法的执行状态
    - 失败用例的详细信息:
        - 失败原因
        - 期望值 vs 实际值
        - 堆栈跟踪（关键部分）
        - 修复建议
  
  性能数据（可选）:
    - 平均响应时间
    - P95 响应时间
    - P99 响应时间
    - 最慢的 5 个测试
  
  总结:
    - 测试结论（通过/失败）
    - 主要问题汇总
    - 风险评估
    - 后续建议
```

### 测试报告模板

```markdown
# 测试执行报告

## 基本信息
- **执行时间**: YYYY-MM-DD HH:mm:ss
- **测试环境**: [开发/测试/预发布]
- **测试范围**: [被测模块/接口名称]

## 测试统计

| 指标 | 数值 | 百分比 |
|------|------|--------|
| 总用例数 | N | 100% |
| 通过 | X | X% |
| 失败 | Y | Y% |
| 跳过 | Z | Z% |
| 执行耗时 | Xs | - |

## 详细结果

### 通过的测试
- ✅ test_Method1_Scenario1_Expected1
- ✅ test_Method2_Scenario2_Expected2
...

### 失败的测试

#### ❌ test_Method3_Scenario3_Expected3
- **失败原因**: [具体原因]
- **期望值**: [期望结果]
- **实际值**: [实际结果]
- **堆栈跟踪**: 
  ```
  [关键堆栈信息]
  ```
- **修复建议**: [具体建议]

## 总结

### 测试结论
[通过/失败] - [简要说明]

### 主要问题
1. [问题1描述]
2. [问题2描述]

### 风险评估
[低/中/高] - [风险说明]

### 后续建议
1. [建议1]
2. [建议2]
```

---

## 步骤4: 清理（仅集成测试）

**详细指南**: [strategies/cleanup/](strategies/cleanup/)

> ⚠️ **重要**: 单元测试使用 Mock，不产生真实数据，无需清理

### 清理询问（必须执行）

> **⚠️ 强制要求**: 如果是集成测试，流程结束时必须询问用户是否执行清理！

```
测试执行完成后，如果是集成测试：

1. 检查是否有待清理的测试数据
2. 向用户展示待清理数据摘要
3. 询问用户: "是否需要执行清理代码清理测试数据？[是/否]"
4. 等待用户确认后再执行或跳过清理
```

### 清理机制

集成测试采用**手动执行**模式：

```python
# Python 清理示例
from test_user_api import execute_cleanup, get_cleanup_report

# 查看待清理数据
report = get_cleanup_report()
print(f"待清理用户数: {report['pending_count']}")

# 手动执行清理
result = execute_cleanup()
print(f"清理完成: 成功={result['success']}, 失败={result['failed']}")
```

```java
// Java 清理示例
UserApiTest test = new UserApiTest();

// 查看待清理数据
Map<String, Object> report = test.getCleanupReport();
System.out.println("待清理用户数: " + report.get("pendingCount"));

// 手动执行清理
Map<String, Object> result = test.executeCleanup();
System.out.println("清理完成: 成功=" + result.get("success") + ", 失败=" + result.get("failed"));
```

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            输入类型判断                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  输入是代码？                                                                │
│  ├── 是 → 判断代码类型                                                       │
│  │        ├── HTTP RESTful API 代码 (Controller) → api-test 策略            │
│  │        └── 业务代码 (Service/Repository) → whitebox 策略                 │
│  │                                                                          │
│  └── 否（输入是文档）→ 判断文档类型                                          │
│       ├── 是测试用例设计文档？                                               │
│       │   ├── 是 → normalize 策略（规范化处理）                              │
│       │   └── 否 → api-test 策略（基于文档生成）                             │
│       └── 接口文档/需求文档 → api-test 策略                                  │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ 步骤1: 设计测试用例文档 ↓                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ ✅ 检查点1: 验证完整性和规范性 ↓                        │
│                    （必须通过才能继续）                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ 步骤2: 生成测试代码 ↓                                   │
│  ├── 集成/接口测试 → api-test 代码 + 清理代码                                │
│  └── 单元测试 → unit-test 代码 (Mock)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ ✅ 检查点2: 验证代码可编译 ↓                            │
│                    （必须通过才能继续）                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ 步骤3: 执行测试 ↓                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ ✅ 检查点3: 输出详细测试报告 ↓                          │
│                    （包含总结，必须完成）                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ↓ 步骤4: 清理询问 ↓                                       │
│  如果是集成测试:                                                             │
│  └── 询问用户: "是否需要执行清理代码？[是/否]"                               │
│      ├── 是 → 执行清理代码                                                   │
│      └── 否 → 跳过清理                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 详细资源

### 策略文档

| 阶段 | 策略 | 文档路径 |
|------|------|---------|
| 设计测试用例 | api-test (黑盒) | [strategies/design-test-case/api-test/](strategies/design-test-case/api-test/) |
| 设计测试用例 | whitebox (白盒) | [strategies/design-test-case/whitebox/](strategies/design-test-case/whitebox/) |
| 设计测试用例 | normalize (规范化) | [strategies/design-test-case/normalize/](strategies/design-test-case/normalize/) |
| 生成测试代码 | api-test (Java) | [strategies/generate-test-code/api-test-java/](strategies/generate-test-code/api-test-java/) |
| 生成测试代码 | api-test (Python) | [strategies/generate-test-code/api-test-python/](strategies/generate-test-code/api-test-python/) |
| 生成测试代码 | api-test (Go) | [strategies/generate-test-code/api-test-go/](strategies/generate-test-code/api-test-go/) |
| 生成测试代码 | api-test (Spock) | [strategies/generate-test-code/api-test-spock/](strategies/generate-test-code/api-test-spock/) |
| 生成测试代码 | unit-test (Java) | [strategies/generate-test-code/unit-test-java/](strategies/generate-test-code/unit-test-java/) |
| 生成测试代码 | unit-test (Go) | [strategies/generate-test-code/unit-test-go/](strategies/generate-test-code/unit-test-go/) |
| 生成测试代码 | unit-test (Spock) | [strategies/generate-test-code/unit-test-spock/](strategies/generate-test-code/unit-test-spock/) |
| 执行测试 | run-test | [strategies/run-test/](strategies/run-test/) |
| 清理 | cleanup | [strategies/cleanup/](strategies/cleanup/) |

### 规范文档

- **测试用例规范**: [test-case-spec-standard.md](test-case-spec-standard.md)
- **验证清单**: [checklist.md](checklist.md)
- **完整示例**: [examples/](examples/) - 按策略分类的独立示例文件

---

## 常见错误

| 错误 | 正确做法 |
|------|----------|
| ❌ 跳过检查点直接进入下一步 | 每个检查点必须通过才能继续 |
| ❌ 跳过测试用例设计直接写代码 | 先设计测试用例文档，通过检查点1后再写代码 |
| ❌ 代码未编译就执行测试 | 必须通过检查点2（编译检查）后才能执行 |
| ❌ 测试完成后不输出报告 | 必须输出详细测试报告并包含总结（检查点3） |
| ❌ 集成测试后直接结束 | 必须询问用户是否执行清理 |
| ❌ 集成测试使用 Mock | 集成测试调用真实 API，单元测试才用 Mock |
| ❌ 单元测试后执行清理 | 单元测试用 Mock，无需清理 |
| ❌ 测试用例文档不规范 | 必须通过检查点1（标准化检查） |
| ❌ 忽略边界值测试 | 测试 min-1/min/max/max+1 边界值 |
| ❌ 缺少异常场景 | 覆盖 401/403/404/409/500 |

---

## 版本历史

- **v1.3.0** (2025-12-22): 新增 Go 和 Groovy/Spock 支持
  - 新增 Go API 测试代码生成策略 (testing + testify + net/http)
  - 新增 Go 单元测试代码生成策略 (testing + testify + mockery)
  - 新增 Groovy/Spock API 测试代码生成策略 (Spock + REST-assured)
  - 新增 Groovy/Spock 单元测试代码生成策略 (Spock + given-when-then)
  - 支持 Java/Python/Go/Groovy 四种语言测试代码生成
  - 更新检查点2支持 Go 和 Groovy 语法检查
  - 更新执行命令支持 go test 和 Spock

- **v1.2.0** (2025-12-18): 新增 Python 支持
  - 新增 Python API 测试代码生成策略 (pytest + requests)
  - 支持 Java 和 Python 双语言测试代码生成
  - 更新检查点2支持 Python 语法检查
  - 更新执行命令支持 pytest

- **v1.1.0** (2025-12-18): 强化检查点
  - 新增强制检查点机制（检查点1/2/3）
  - 检查点1: 测试用例完整性和规范性验证（必须通过才能生成代码）
  - 检查点2: 代码完整性和编译检查（必须通过才能执行测试）
  - 检查点3: 测试报告输出（必须包含详细报告和总结）
  - 新增清理询问机制（集成测试结束后询问用户是否执行清理）
  - 更新检查清单和示例文档

- **v1.0.0** (2025-12-18): 初始版本
  - 整合 tdd-build-test-case、tdd-extract-case-from-code、tdd-write-test-code、tdd-build-unit-test、tdd-run-test-cases
  - 统一测试工作流：设计 → 生成 → 执行 → 清理
  - 支持 api-test (集成测试) 和 unit-test (单元测试) 两种模式
  - 强化输入判断规则和标准化检查

---

**作者**: johnsonyang
