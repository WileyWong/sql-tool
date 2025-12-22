# 执行测试策略

## 概述

本策略负责执行测试代码并生成测试报告，支持 JUnit/TestNG 测试框架。

## 前置条件

- 已生成符合规范的测试代码
- 测试环境已配置（数据库连接、服务地址等）
- Maven/Gradle 构建工具可用

## 执行流程

### 1. 环境检查

```yaml
environment_check:
  - 检查测试配置文件存在性
  - 验证数据库连接可用
  - 确认目标服务可访问（集成测试）
  - 检查测试数据准备情况
```

### 2. 执行命令

#### Maven 项目

```bash
# 执行所有测试
mvn test

# 执行指定测试类
mvn test -Dtest=XxxApiTest

# 执行指定测试方法
mvn test -Dtest=XxxApiTest#testMethodName

# 跳过编译直接执行
mvn test -DskipCompile=true
```

#### Gradle 项目

```bash
# 执行所有测试
./gradlew test

# 执行指定测试类
./gradlew test --tests "XxxApiTest"

# 执行指定测试方法
./gradlew test --tests "XxxApiTest.testMethodName"
```

### 3. 测试报告解析

#### 报告位置

```yaml
report_locations:
  maven:
    surefire: target/surefire-reports/
    html: target/site/surefire-report.html
  gradle:
    html: build/reports/tests/test/index.html
    xml: build/test-results/test/
```

#### 报告内容解析

```yaml
report_parsing:
  统计信息:
    - 总用例数
    - 通过数
    - 失败数
    - 跳过数
    - 执行时间
  
  失败分析:
    - 失败用例列表
    - 失败原因（断言失败/异常）
    - 堆栈信息
    - 失败截图（如有）
  
  性能数据:
    - 单个用例耗时
    - 平均响应时间
    - 最慢用例 TOP5
```

## 输出格式

### 测试报告模板

```markdown
# API 测试执行报告

## 执行概要

| 指标 | 数值 |
|------|------|
| 执行时间 | 2024-01-15 10:30:00 |
| 总用例数 | 25 |
| 通过 | 23 |
| 失败 | 2 |
| 跳过 | 0 |
| 通过率 | 92% |
| 总耗时 | 45.2s |

## 失败用例分析

### 1. testCreateUser_DuplicateEmail_Returns409

**失败类型**: 断言失败

**期望值**: 409 Conflict

**实际值**: 500 Internal Server Error

**可能原因**:
- 数据库唯一约束未正确配置
- 异常处理未捕获 DuplicateKeyException

**建议修复**:
1. 检查 User 表 email 字段唯一索引
2. 在 Service 层添加重复检查逻辑

### 2. testGetUser_NotFound_Returns404

**失败类型**: 连接超时

**错误信息**: Connection timed out after 5000ms

**可能原因**:
- 目标服务未启动
- 网络配置问题

**建议修复**:
1. 确认服务已启动并监听正确端口
2. 检查防火墙配置

## 性能分析

### 响应时间分布

| 范围 | 用例数 | 占比 |
|------|--------|------|
| < 100ms | 15 | 60% |
| 100-500ms | 8 | 32% |
| 500ms-1s | 2 | 8% |
| > 1s | 0 | 0% |

### 最慢用例 TOP5

1. testBatchImport_LargeFile - 2.3s
2. testExportReport_AllData - 1.8s
3. testComplexQuery_MultiCondition - 0.9s
4. testCreateOrder_WithItems - 0.7s
5. testUpdateUser_AllFields - 0.5s

## 覆盖率报告

| 模块 | 行覆盖率 | 分支覆盖率 |
|------|----------|------------|
| UserController | 85% | 78% |
| UserService | 92% | 85% |
| UserRepository | 100% | 100% |

## 后续建议

1. **修复失败用例**: 优先处理 2 个失败用例
2. **性能优化**: 关注 testBatchImport 的执行时间
3. **覆盖率提升**: UserController 分支覆盖率需提升
```

## 失败处理策略

```yaml
failure_handling:
  断言失败:
    - 分析期望值与实际值差异
    - 检查测试数据是否正确
    - 验证业务逻辑实现
  
  连接超时:
    - 检查服务可用性
    - 验证网络配置
    - 增加超时时间重试
  
  数据问题:
    - 检查测试数据准备
    - 验证数据库状态
    - 执行数据清理后重试
  
  环境问题:
    - 检查配置文件
    - 验证环境变量
    - 重启相关服务
```

## 重试机制

```yaml
retry_strategy:
  max_retries: 3
  retry_delay: 1000ms
  retry_on:
    - ConnectionTimeoutException
    - ServiceUnavailableException
  no_retry_on:
    - AssertionError
    - ValidationException
```

## 与其他步骤的衔接

### 输入

- 来自 `generate-test-code` 步骤生成的测试代码
- 测试配置文件

### 输出

- 测试执行报告
- 失败用例分析
- 性能数据

### 后续步骤

- 如果是集成/接口测试，进入 `cleanup` 步骤
- 如果是单元测试，流程结束
