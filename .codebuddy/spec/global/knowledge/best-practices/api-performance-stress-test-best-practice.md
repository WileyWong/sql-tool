# 后端API接口性能测试与压力测试最佳实践(AI代码生成指南)

---

**文档版本**：1.1 (AI生成增强版)  
**最后更新**：2025-12-05  
**作者**：johnsonyang  
**适用范围**：API接口性能测试 + 压力测试 + AI辅助自动化测试代码生成  
**核心目标**：指导AI精准生成高质量性能测试代码（覆盖基准/负载/压力/稳定性测试）  

**适用场景**：
- ✅ 基准性能测试：遵循第1-3章核心原则与指标体系
- ✅ 负载/压力测试：遵循第3章测试用例设计方法论
- ✅ 混合场景测试：遵循第4.8节混合场景测试用例模板

**AI使用指南**：
1. **生成前**：阅读第4.1节选择合适的性能测试提示词模板
2. **生成中**：遵循第4.3节AI生成代码的质量标准
3. **生成后**：执行第4.5节测试代码质量检查清单
4. **质量验证**：使用第7章测试报告与分析规范

---

## 目录

- [一、核心原则与方法论](#一核心原则与方法论)
- [二、性能测试与压力测试指标体系](#二性能测试与压力测试指标体系)
- [三、测试用例设计方法论](#三测试用例设计方法论)
- [四、AI辅助测试代码生成](#四ai辅助测试代码生成)
- [五、完整测试用例示例](#五完整测试用例示例)
- [六、测试执行与数据采集](#六测试执行与数据采集)
- [七、测试报告与分析](#七测试报告与分析)
- [八、性能优化建议](#八性能优化建议)
- [九、附录](#九附录)

---

## 一、核心原则与方法论

### 1.1 性能测试与压力测试定义

| 测试类型 | 定义 | 目标 | 典型场景 |
|----------|------|------|----------|
| **性能测试** | 验证系统在预期负载下的响应时间、吞吐量等指标 | 确认系统满足性能需求 | 正常业务负载下的响应时间验证 |
| **负载测试** | 逐步增加负载，观察系统性能变化 | 确定系统最大处理能力 | 逐步增加用户数直到性能下降 |
| **压力测试** | 超出系统设计能力的负载测试 | 发现系统瓶颈和崩溃点 | 超过预期2-3倍负载下的系统表现 |
| **稳定性测试** | 长时间持续负载测试 | 发现内存泄漏、资源耗尽问题 | 24小时以上持续运行 |
| **峰值测试** | 突发高负载测试 | 验证系统应对流量突增能力 | 薪资发放日查询、年终奖查询、年会在线直播 |
| **容量测试** | 确定系统最大容量 | 规划硬件资源和扩容策略 | 确定单机最大并发用户数 |

### 1.2 测试金字塔与性能测试定位

```
          /\
         /  \     E2E性能测试（少量）
        /----\    - 完整业务流程性能
       /      \   
      /--------\  集成性能测试（适量）
     /          \ - 服务间调用性能
    /------------\
   /              \ API性能测试（大量）
  /----------------\ - 单接口性能基准
```

### 1.3 PACE原则

| 原则 | 说明 | 实践指导 |
|------|------|----------|
| **P - Predictable** | 测试结果可重复、可预测 | 固定测试环境、数据、配置 |
| **A - Accurate** | 测试数据准确反映真实情况 | 使用真实场景数据、合理的用户行为模型 |
| **C - Comprehensive** | 覆盖所有关键性能场景 | 覆盖正常、峰值、异常场景 |
| **E - Efficient** | 测试执行高效、资源利用合理 | 自动化执行、并行测试、资源监控 |

### 1.4 性能测试生命周期

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        性能测试生命周期                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  │
│  │ 需求分析 │ → │ 测试设计 │ → │ 环境准备 │ → │ 测试执行 │ → │ 结果分析 │  │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘  │
│       │             │             │             │             │        │
│       ▼             ▼             ▼             ▼             ▼        │
│  - 性能目标    - 场景设计    - 环境搭建    - 脚本执行    - 数据分析    │
│  - SLA定义     - 用例编写    - 数据准备    - 监控采集    - 瓶颈定位    │
│  - 基准确定    - 脚本开发    - 工具部署    - 问题记录    - 优化建议    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.5 测试场景分类

| 场景类型 | 描述 | 测试重点 | 示例 |
|----------|------|----------|------|
| **基准测试** | 单用户、单请求的基础性能 | 响应时间基线 | 单次API调用响应时间 |
| **并发测试** | 多用户同时访问 | 并发处理能力 | 100用户同时查询 |
| **混合场景** | 多接口组合调用 | 真实业务模拟 | 登录→查询员工→提交请假→审批 |
| **峰值场景** | 突发流量冲击 | 系统弹性 | 薪资查询高峰、年会直播高峰 |
| **持久场景** | 长时间持续负载 | 稳定性 | 24小时持续运行 |

---

## 二、性能测试与压力测试指标体系

### 2.1 核心性能指标（KPI）

#### 2.1.1 响应时间指标

| 指标 | 定义 | 计算方式 | 参考标准 |
|------|------|----------|----------|
| **平均响应时间（Avg RT）** | 所有请求响应时间的平均值 | Σ(响应时间) / 请求数 | < 500ms |
| **P50（中位数）** | 50%请求的响应时间 | 第50百分位值 | < 200ms |
| **P90** | 90%请求的响应时间 | 第90百分位值 | < 500ms |
| **P95** | 95%请求的响应时间 | 第95百分位值 | < 800ms |
| **P99** | 99%请求的响应时间 | 第99百分位值 | < 1000ms |
| **最大响应时间** | 最慢请求的响应时间 | max(响应时间) | < 3000ms |

```python
# 响应时间百分位计算示例
import numpy as np

def calculate_percentiles(response_times: list) -> dict:
    """计算响应时间百分位数"""
    return {
        "min": np.min(response_times),
        "avg": np.mean(response_times),
        "p50": np.percentile(response_times, 50),
        "p90": np.percentile(response_times, 90),
        "p95": np.percentile(response_times, 95),
        "p99": np.percentile(response_times, 99),
        "max": np.max(response_times)
    }
```

#### 2.1.2 吞吐量指标

| 指标 | 定义 | 单位 | 参考标准 |
|------|------|------|----------|
| **TPS（每秒事务数）** | 每秒完成的事务数 | 事务/秒 | 根据业务定义 |
| **QPS（每秒查询数）** | 每秒完成的查询请求数 | 请求/秒 | GET接口 > 1000 |
| **RPS（每秒请求数）** | 每秒处理的请求总数 | 请求/秒 | 综合指标 |
| **并发用户数** | 同时在线的用户数量 | 用户数 | 根据业务需求 |

#### 2.1.3 错误率指标

| 指标 | 定义 | 计算方式 | 参考标准 |
|------|------|----------|----------|
| **错误率** | 失败请求占总请求的比例 | 失败数/总数×100% | < 0.1% |
| **超时率** | 超时请求占总请求的比例 | 超时数/总数×100% | < 0.5% |
| **成功率** | 成功请求占总请求的比例 | 成功数/总数×100% | > 99.9% |

#### 2.1.4 资源利用率指标

| 指标 | 监控对象 | 告警阈值 | 说明 |
|------|----------|----------|------|
| **CPU使用率** | 应用服务器 | > 80% | 持续高CPU需优化 |
| **内存使用率** | 应用服务器 | > 85% | 注意内存泄漏 |
| **磁盘I/O** | 数据库服务器 | > 70% | 可能需要SSD |
| **网络带宽** | 所有服务器 | > 80% | 考虑带宽扩容 |
| **数据库连接数** | 数据库 | > 80%最大连接 | 优化连接池 |
| **线程池使用率** | 应用服务器 | > 90% | 调整线程池配置 |

### 2.2 性能基准参考值

#### 2.2.1 按接口类型分类

| 接口类型 | P95响应时间 | 吞吐量 | 说明 |
|----------|-------------|--------|------|
| **简单查询** | < 100ms | > 2000 QPS | 单表查询、缓存命中 |
| **复杂查询** | < 500ms | > 500 QPS | 多表关联、聚合统计 |
| **写入操作** | < 200ms | > 1000 TPS | 单条数据插入/更新 |
| **批量操作** | < 2000ms | > 100 TPS | 批量导入/导出 |
| **文件上传** | < 5000ms | > 50 TPS | 取决于文件大小 |
| **报表生成** | < 10000ms | > 10 TPS | 复杂计算、大数据量 |

#### 2.2.2 按业务场景分类

| 业务场景 | 并发用户 | P95响应时间 | 错误率 |
|----------|----------|-------------|--------|
| **日常运营** | 500 | < 500ms | < 0.1% |
| **促销活动** | 2000 | < 1000ms | < 0.5% |
| **薪资/年终奖查询高峰** | 10000 | < 3000ms | < 5% |
| **年会在线直播** | 20000 | < 5000ms | < 10% |
| **批量导入** | 10 | < 30000ms | < 1% |

### 2.3 SLA（服务等级协议）定义模板

```yaml
# SLA定义模板
sla_definition:
  service: user-api
  version: v1.0
  
  # 可用性要求
  availability:
    target: 99.9%
    measurement_period: monthly
    
  # 响应时间要求
  response_time:
    p50: 100ms
    p95: 500ms
    p99: 1000ms
    
  # 吞吐量要求
  throughput:
    minimum: 1000 req/s
    peak: 5000 req/s
    
  # 错误率要求
  error_rate:
    maximum: 0.1%
    
  # 资源限制
  resource_limits:
    cpu_per_instance: 4 cores
    memory_per_instance: 8GB
    max_instances: 10
```

---

## 三、测试用例设计方法论

### 3.1 负载模型设计

#### 3.1.1 阶梯负载模型

```
并发用户数
    ^
    |                    ┌─────────────
    |              ┌─────┘
    |        ┌─────┘
    |  ┌─────┘
    |──┘
    └──────────────────────────────────> 时间
      预热   阶段1  阶段2  阶段3  稳定
```

```yaml
# 阶梯负载配置
step_load:
  warmup:
    users: 10
    duration: 2m
  stages:
    - users: 100
      duration: 5m
    - users: 300
      duration: 5m
    - users: 500
      duration: 5m
    - users: 1000
      duration: 10m
  cooldown:
    users: 10
    duration: 2m
```

#### 3.1.2 峰值负载模型

```
并发用户数
    ^
    |       ╱╲
    |      ╱  ╲
    |     ╱    ╲
    |────╱      ╲────────
    └──────────────────────────────────> 时间
      基线  峰值   恢复   稳定
```

```yaml
# 峰值负载配置
spike_load:
  baseline:
    users: 100
    duration: 5m
  spike:
    users: 2000
    ramp_up: 10s
    duration: 1m
  recovery:
    ramp_down: 30s
  post_spike:
    users: 100
    duration: 5m
```

#### 3.1.3 波浪负载模型

```
并发用户数
    ^
    |    ╱╲    ╱╲    ╱╲
    |   ╱  ╲  ╱  ╲  ╱  ╲
    |  ╱    ╲╱    ╲╱    ╲
    |─╱                   ╲─
    └──────────────────────────────────> 时间
```

```yaml
# 波浪负载配置
wave_load:
  min_users: 100
  max_users: 500
  wave_period: 10m
  total_duration: 1h
```

### 3.2 用户行为模型设计

#### 3.2.1 思考时间配置

```python
import random
import numpy as np

def get_think_time(distribution: str, config: dict) -> float:
    """
    根据分布类型生成思考时间
    
    distribution: uniform | normal | exponential
    """
    if distribution == "uniform":
        return random.uniform(config["min"], config["max"])
    elif distribution == "normal":
        value = np.random.normal(config["mean"], config["std"])
        return max(config.get("min", 0), min(value, config.get("max", 30)))
    elif distribution == "exponential":
        value = np.random.exponential(1 / config["lambda"])
        return min(value, config.get("max", 30))
    return config.get("default", 1)
```

#### 3.2.2 用户行为权重配置

```yaml
# 用户行为权重配置
user_behavior:
  # 普通员工（60%）
  employee:
    weight: 60%
    actions:
      - action: view_personal_info
        weight: 30%
        think_time: [2, 5]
      - action: view_payslip
        weight: 25%
        think_time: [2, 5]
      - action: submit_leave_request
        weight: 20%
        think_time: [5, 15]
      - action: view_payslip_history
        weight: 15%
        think_time: [3, 8]
      - action: view_bonus_details
        weight: 10%
        think_time: [2, 5]
        
  # 部门经理（30%）
  manager:
    weight: 30%
    actions:
      - action: login
        weight: 10%
      - action: view_team_members
        weight: 25%
        think_time: [2, 5]
      - action: approve_leave_request
        weight: 30%
        think_time: [3, 10]
      - action: view_team_salary_summary
        weight: 20%
        think_time: [2, 5]
      - action: submit_performance_review
        weight: 15%
        think_time: [10, 30]
        
  # HR管理员（10%）
  hr_admin:
    weight: 10%
    actions:
      - action: manage_employees
        weight: 30%
      - action: process_onboarding
        weight: 25%
      - action: generate_reports
        weight: 25%
      - action: manage_salary
        weight: 20%
```

### 3.3 测试数据设计

#### 3.3.1 数据量级规划

| 数据类型 | 基准测试 | 负载测试 | 压力测试 |
|----------|----------|----------|----------|
| 用户数据 | 1,000 | 100,000 | 1,000,000 |
| 员工档案 | 1,000 | 50,000 | 500,000 |
| 薪资记录 | 10,000 | 1,000,000 | 10,000,000 |
| 审批流程 | 5,000 | 500,000 | 5,000,000 |

#### 3.3.2 数据分布设计

```python
class TestDataDistribution:
    """测试数据分布设计"""
    
    @staticmethod
    def pareto_distribution(total: int, hot_ratio: float = 0.2) -> dict:
        """
        帕累托分布（二八定律）
        20%的热点数据承载80%的访问
        """
        hot_count = int(total * hot_ratio)
        return {
            "hot_data_ids": list(range(1, hot_count + 1)),
            "cold_data_ids": list(range(hot_count + 1, total + 1)),
            "hot_access_ratio": 0.8,
            "cold_access_ratio": 0.2
        }
    
    @staticmethod
    def get_random_id(distribution: dict) -> int:
        """根据分布获取随机ID"""
        import random
        if random.random() < distribution["hot_access_ratio"]:
            return random.choice(distribution["hot_data_ids"])
        return random.choice(distribution["cold_data_ids"])
```

### 3.4 场景组合设计

#### 3.4.1 业务流程场景

```yaml
# 人力资源请假审批流程场景
leave_approval_flow_scenario:
  name: 完整请假审批流程
  steps:
    - name: 员工登录
      api: POST /api/v1/auth/login
      think_time: [1, 2]
      
    - name: 查看个人信息
      api: GET /api/v1/employees/me
      think_time: [2, 5]
      
    - name: 查询剩余假期
      api: GET /api/v1/leaves/balance
      think_time: [3, 8]
      
    - name: 提交请假申请
      api: POST /api/v1/leaves
      body:
        leaveType: ${leave_type}
        startDate: ${start_date}
        endDate: ${end_date}
        reason: ${reason}
      think_time: [5, 15]
      
    - name: 经理登录
      api: POST /api/v1/auth/login
      think_time: [1, 2]
      
    - name: 查看待审批列表
      api: GET /api/v1/approvals/pending
      think_time: [2, 5]
      
    - name: 审批请假申请
      api: PUT /api/v1/approvals/{id}
      body:
        status: APPROVED
        comment: ${comment}
      think_time: [3, 10]
```

---

## 四、AI辅助测试代码生成

本章整合了AI生成性能测试代码的所有相关规范，包括Prompt模板、生成规范、质量标准和自检清单。

### 4.1 性能测试生成提示词模板

#### 4.1.1 完整性能测试套件生成模板

```markdown
# 任务：生成完整的API性能测试代码

## 接口信息
- 基础URL：{base_url}
- 模块名称：{module_name}
- 认证方式：{auth_type}

## 接口列表
| 方法 | 路径 | 描述 |
|------|------|------|
{api_list}

## 测试类型
- [ ] 基准测试（单用户）
- [ ] 负载测试（并发用户：{concurrent_users}）
- [ ] 压力测试（最大用户：{max_users}）

## 性能目标
- P95响应时间：{p95_target}ms
- 错误率：< {error_rate_target}%
- 吞吐量：> {throughput_target} req/s

## 技术栈要求
- 编程语言：{language}
- 测试框架：{test_framework}（locust / pytest / jmeter）
- HTTP客户端：{http_client}

## 生成规范
1. 包含测试数据工厂
2. 包含用户行为模型
3. 包含指标采集
4. 包含断言验证
5. 包含运行说明
```

#### 4.1.2 单接口性能测试生成模板

```markdown
## 任务：为以下API接口生成性能测试代码

### 接口信息
- 请求方法：{method}
- 请求路径：{endpoint}
- 认证方式：{auth_type}

### 性能目标
- 基准响应时间：{baseline_rt}ms
- P95响应时间：{p95_target}ms
- 最大并发用户：{max_users}
- 错误率阈值：{error_rate}%

### 生成要求
1. 测试框架：{framework}
2. 包含基准测试、负载测试、压力测试
3. 包含性能指标采集和断言

### 必须覆盖的测试场景
- [ ] 基准测试（单用户100次迭代）
- [ ] 并发测试（10/50/100/200/500用户）
- [ ] 压力测试（寻找崩溃点）
- [ ] 峰值测试（突发流量冲击）
- [ ] 稳定性测试（持续负载30分钟）
```

#### 4.1.3 混合场景测试生成模板

```markdown
## 任务：生成混合场景性能测试代码

### 业务场景
{business_scenario_description}

### 用户角色分布
| 角色 | 占比 | 主要操作 |
|------|------|----------|
{user_role_distribution}

### 负载模型
- 模型类型：{load_model}（阶梯/峰值/波浪）
- 基准用户数：{baseline_users}
- 峰值用户数：{peak_users}
- 测试时长：{duration}

### 生成要求
1. 为每种用户角色创建独立的用户类
2. 根据权重配置用户行为
3. 包含思考时间配置
4. 包含数据参数化
```

### 4.2 生成指令结构化模板

```yaml
# AI 性能测试代码生成指令

language: python | java
test_framework: locust | pytest | jmeter | gatling
base_url: http://localhost:8080

target:
  module: hr_system
  base_path: /api/v1
  auth_type: bearer_token

# 性能目标
performance_targets:
  baseline:
    p95: 200ms
    error_rate: 0.1%
  load:
    p95: 500ms
    error_rate: 1%
    concurrent_users: 500
  stress:
    max_users: 2000
    acceptable_error_rate: 5%

# 接口列表
apis:
  - method: GET
    path: /payslips/current
    description: 查询当月薪资
    weight: 30%
  - method: GET
    path: /bonus/annual
    description: 查询年终奖
    weight: 25%
  - method: GET
    path: /live/stream
    description: 年会直播流
    weight: 45%

# 用户行为模型
user_profiles:
  - name: employee
    weight: 70%
    think_time: [2, 5]
  - name: manager
    weight: 20%
    think_time: [3, 8]
  - name: hr_admin
    weight: 10%
    think_time: [5, 15]

# 负载场景
load_scenarios:
  - name: salary_query_peak
    type: spike
    baseline_users: 500
    spike_users: 8000
    duration: 2h
  - name: annual_meeting_live
    type: step
    start_users: 2000
    end_users: 20000
    step_users: 2000
    step_duration: 5m

output:
  include_data_factory: true
  include_metrics_collection: true
  include_assertions: true
  include_cleanup: true
```

### 4.3 AI生成代码的质量标准

```python
"""
AI生成的性能测试代码必须符合以下结构
"""

# ============================================================
# 1. 文件头部
# ============================================================
"""
{模块名}API性能测试
测试目标: {base_path}
测试框架: {framework}
"""

# 2. 导入语句
from locust import HttpUser, task, between
import pytest
import requests

# ============================================================
# 3. 配置和常量
# ============================================================
class TestConfig:
    BASE_URL = "http://localhost:8080"
    API_PREFIX = "/api/v1"
    
    # 性能目标
    TARGETS = {
        "GET /payslips/current": {"p95": 300, "error_rate": 0.01},
        "GET /bonus/annual": {"p95": 500, "error_rate": 0.01}
    }

# ============================================================
# 4. 测试数据工厂
# ============================================================
class TestDataFactory:
    """测试数据工厂"""
    @classmethod
    def get_random_employee(cls):
        pass
    
    @classmethod
    def generate_test_data(cls):
        pass

# ============================================================
# 5. 用户行为类（Locust）
# ============================================================
class EmployeeUser(HttpUser):
    weight = 60
    wait_time = between(1, 5)
    
    @task(10)
    def view_payslip(self):
        pass

# ============================================================
# 6. 性能测试类（Pytest）
# ============================================================
class TestHRAPIPerformance:
    """性能测试套件"""
    
    def test_baseline(self, perf_tester):
        """基准测试"""
        pass
    
    def test_concurrent(self, perf_tester, concurrent_users):
        """并发测试"""
        pass
    
    def test_stress(self, perf_tester):
        """压力测试"""
        pass
```

### 4.4 测试场景自动推导规则

```yaml
# 性能测试场景推导规则

GET_API:
  baseline:
    - 单用户100次迭代
    - 目标: P95 < 200ms
  load:
    - 并发用户: [10, 50, 100, 200, 500]
    - 目标: P95 < 500ms, 错误率 < 1%
  stress:
    - 逐步加压至系统崩溃
    - 记录崩溃点和恢复时间

POST_API:
  baseline:
    - 单用户50次迭代
    - 目标: P95 < 300ms
  load:
    - 并发用户: [10, 50, 100, 200]
    - 目标: P95 < 800ms, 错误率 < 1%
  idempotent:
    - 验证幂等性（重复提交）

MIXED_SCENARIO:
  user_distribution:
    - 按业务角色分配权重
    - 配置思考时间
  load_model:
    - 阶梯负载: 逐步增加用户
    - 峰值负载: 突发流量冲击
    - 波浪负载: 周期性波动
```

### 4.5 测试代码质量检查清单

```markdown
## 性能测试代码检查清单

### 结构检查
- [ ] 包含所有必要的import语句
- [ ] 配置与代码分离
- [ ] 包含测试数据工厂
- [ ] 用户行为类按角色分组
- [ ] 包含性能指标采集逻辑

### 场景覆盖检查
- [ ] 基准测试（单用户）
- [ ] 负载测试（多级并发）
- [ ] 压力测试（寻找崩溃点）
- [ ] 峰值测试（突发流量）
- [ ] 稳定性测试（持续负载）

### 断言检查
- [ ] 响应时间断言（P50/P90/P95/P99）
- [ ] 错误率断言
- [ ] 吞吐量断言
- [ ] 资源使用断言（可选）

### 数据管理检查
- [ ] 测试数据参数化
- [ ] 数据分布合理（帕累托分布）
- [ ] 思考时间配置
- [ ] 测试后数据清理

### 报告输出检查
- [ ] 包含性能指标统计
- [ ] 包含响应时间分布图
- [ ] 包含吞吐量趋势图
- [ ] 包含错误分析
```

### 4.6 性能测试用例YAML模板

<details>
<summary>点击展开完整YAML模板</summary>

```yaml
# 性能测试用例模板
performance_test_case:
  # ==================== 基本信息 ====================
  id: PT_USER_API_001
  name: 用户登录接口性能测试
  description: |
    验证用户登录接口在不同负载下的性能表现
    - 基准测试：单用户响应时间
    - 负载测试：100-1000并发用户
    - 压力测试：超过设计负载的表现
  
  # ==================== 接口信息 ====================
  api:
    method: POST
    endpoint: /api/v1/auth/login
    content_type: application/json
    
  # ==================== 请求数据 ====================
  request:
    headers:
      Content-Type: application/json
    body:
      username: ${username}
      password: ${password}
    data_source:
      type: csv
      file: test_users.csv
      
  # ==================== 测试场景 ====================
  scenarios:
    # 基准测试
    - name: baseline
      type: single_user
      iterations: 100
      targets:
        avg_response_time: 50ms
        p95_response_time: 100ms
        
    # 负载测试
    - name: load_test
      type: ramp_up
      config:
        start_users: 10
        end_users: 500
        ramp_up_time: 5m
        hold_time: 10m
      targets:
        p95_response_time: 200ms
        error_rate: 0.1%
        throughput: 1000 req/s
        
    # 压力测试
    - name: stress_test
      type: stress
      config:
        users: 2000
        duration: 10m
      targets:
        p95_response_time: 1000ms
        error_rate: 5%
        
  # ==================== 验收标准 ====================
  acceptance_criteria:
    response_time:
      p50: 50ms
      p95: 200ms
      p99: 500ms
    throughput:
      minimum: 500 req/s
    error_rate:
      maximum: 0.1%
    resource_usage:
      cpu: 80%
      memory: 85%
      
  # ==================== 元数据 ====================
  metadata:
    priority: P0
    category: [performance, auth]
    author: performance_team
    created_at: "2024-12-01"
```

</details>

### 4.7 压力测试用例YAML模板

<details>
<summary>点击展开完整YAML模板</summary>

```yaml
# 压力测试用例模板
stress_test_case:
  id: ST_SALARY_API_001
  name: 薪资查询系统压力测试
  description: |
    验证薪资查询系统在极端负载下的表现
    - 确定系统崩溃点
    - 验证限流和降级机制
    - 测试故障恢复能力
    
  # ==================== 测试场景 ====================
  scenarios:
    # 场景1：逐步加压直到崩溃
    - name: find_breaking_point
      type: ramp_to_failure
      config:
        start_users: 100
        step_users: 100
        step_duration: 2m
        max_users: 5000
      stop_conditions:
        - error_rate > 50%
        - response_time_p99 > 10000ms
        - cpu_usage > 95%
      expected:
        breaking_point: "> 1000 users"
        
    # 场景2：持续高压
    - name: sustained_stress
      type: constant_high_load
      config:
        users: 1500
        duration: 30m
      monitoring:
        - memory_usage
        - gc_frequency
        - connection_pool
      expected:
        - 无内存泄漏
        - GC时间 < 100ms
        - 连接池稳定
        
    # 场景3：峰值冲击（模拟薪资查询高峰）
    - name: spike_test
      type: spike
      config:
        baseline_users: 200
        spike_users: 3000
        spike_duration: 30s
        recovery_time: 5m
      expected:
        spike_error_rate: < 20%
        recovery_time: < 2m
        post_recovery_performance: normal
        
  # ==================== 恢复测试 ====================
  recovery_test:
    steps:
      - apply_stress: 3000 users for 5m
      - release_stress: 0 users for 1m
      - verify_recovery: 100 users for 5m
    expected:
      recovery_time: < 2m
      post_recovery_p95: < 500ms
```

</details>

### 4.8 混合场景测试用例模板

<details>
<summary>点击展开完整YAML模板</summary>

```yaml
# 混合场景测试用例模板
mixed_scenario_test:
  id: MS_HR_SYSTEM_001
  name: 人力资源系统混合场景性能测试
  
  # ==================== 用户行为模型 ====================
  user_profiles:
    - name: employee
      weight: 60%
      actions:
        - api: GET /api/v1/employees/me
          weight: 25%
          think_time: [2, 5]
        - api: GET /api/v1/payslips/current
          weight: 25%
          think_time: [2, 5]
        - api: GET /api/v1/leaves/balance
          weight: 20%
          think_time: [2, 5]
        - api: POST /api/v1/leaves
          weight: 15%
          think_time: [5, 15]
        - api: GET /api/v1/bonus/annual
          weight: 15%
          think_time: [3, 8]
          
    - name: manager
      weight: 30%
      actions:
        - api: POST /api/v1/auth/login
          weight: 5%
        - api: GET /api/v1/teams/{id}/members
          weight: 25%
          think_time: [2, 5]
        - api: GET /api/v1/approvals/pending
          weight: 25%
          think_time: [2, 5]
        - api: PUT /api/v1/approvals/{id}
          weight: 25%
          think_time: [3, 10]
        - api: GET /api/v1/teams/{id}/salary-summary
          weight: 20%
          think_time: [2, 5]
          
    - name: hr_admin
      weight: 10%
      actions:
        - api: GET /api/v1/admin/employees
          weight: 30%
          think_time: [2, 5]
        - api: POST /api/v1/admin/employees
          weight: 20%
          think_time: [5, 15]
        - api: GET /api/v1/admin/reports/salary
          weight: 25%
          think_time: [5, 10]
        - api: GET /api/v1/admin/reports/bonus
          weight: 25%
          think_time: [5, 10]
          
  # ==================== 负载场景 ====================
  load_scenarios:
    - name: normal_day
      description: 普通工作日流量
      load:
        pattern: wave
        min_users: 500
        max_users: 1500
        period: 1h
      targets:
        p95: 500ms
        error_rate: 0.1%
        
    - name: salary_query_peak
      description: 薪资发放日查询高峰
      load:
        pattern: spike
        baseline_users: 500
        spike_users: 8000
        spike_duration: 2h
        spike_times: ["09:00", "12:00", "18:00"]
      targets:
        p95: 1000ms
        error_rate: 1%
        
    - name: year_end_bonus_query
      description: 年终奖查询高峰
      load:
        pattern: spike
        baseline_users: 500
        spike_users: 10000
        spike_duration: 4h
        spike_times: ["09:00", "10:00", "14:00", "15:00"]
      targets:
        p95: 2000ms
        error_rate: 3%
        
    - name: annual_meeting_live
      description: 年会在线直播高峰
      load:
        pattern: step
        start_users: 2000
        end_users: 20000
        step_users: 2000
        step_duration: 5m
      targets:
        p95: 3000ms
        error_rate: 5%
```

</details>

---

## 五、完整测试用例示例

### 5.1 CURL命令参考

以下是性能测试相关的CURL命令示例，可用于手动测试或调试。

#### 5.1.1 获取认证Token

```bash
# 登录获取Token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@123"}'

# 响应示例
# {"code":0,"message":"success","data":{"token":"eyJhbGciOiJIUzI1NiIs..."}}

# 将Token保存到环境变量（后续命令使用）
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

#### 5.1.2 薪资查询接口测试

```bash
# 正向测试：查询当月薪资（预期200）
curl -X GET http://localhost:8080/api/v1/payslips/current \
  -H "Authorization: Bearer $TOKEN"

# 查询历史薪资（预期200）
curl -X GET "http://localhost:8080/api/v1/payslips/history?year=2024" \
  -H "Authorization: Bearer $TOKEN"

# 认证测试：无Token（预期401）
curl -X GET http://localhost:8080/api/v1/payslips/current

# 性能测试：带响应时间统计
curl -X GET http://localhost:8080/api/v1/payslips/current \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n响应时间: %{time_total}s\n"
```

#### 5.1.3 年终奖查询接口测试

```bash
# 正向测试：查询年终奖（预期200）
curl -X GET http://localhost:8080/api/v1/bonus/annual \
  -H "Authorization: Bearer $TOKEN"

# 查询指定年份年终奖
curl -X GET "http://localhost:8080/api/v1/bonus/annual?year=2024" \
  -H "Authorization: Bearer $TOKEN"

# 性能测试：带响应时间统计
curl -X GET http://localhost:8080/api/v1/bonus/annual \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n响应时间: %{time_total}s\n"
```

#### 5.1.4 年会直播接口测试

```bash
# 获取直播流（预期200）
curl -X GET http://localhost:8080/api/v1/live/stream \
  -H "Authorization: Bearer $TOKEN"

# 发送互动消息（预期200/201）
curl -X POST http://localhost:8080/api/v1/live/interaction \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "COMMENT", "content": "新年快乐！"}'

# 参与抽奖（预期200/201）
curl -X POST http://localhost:8080/api/v1/live/lottery/participate \
  -H "Authorization: Bearer $TOKEN"

# 性能测试：带响应时间统计
curl -X GET http://localhost:8080/api/v1/live/stream \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n响应时间: %{time_total}s\n"
```

#### 5.1.5 性能测试辅助命令

```bash
# 响应时间详细统计
curl -X GET http://localhost:8080/api/v1/payslips/current \
  -H "Authorization: Bearer $TOKEN" \
  -w "
DNS解析时间: %{time_namelookup}s
TCP连接时间: %{time_connect}s
SSL握手时间: %{time_appconnect}s
首字节时间: %{time_starttransfer}s
总响应时间: %{time_total}s
" -o /dev/null -s

# 批量测试脚本示例（10次请求）
for i in {1..10}; do
  curl -X GET http://localhost:8080/api/v1/payslips/current \
    -H "Authorization: Bearer $TOKEN" \
    -s -o /dev/null -w "请求$i: %{http_code} - %{time_total}s\n"
done

# 使用wrk进行简单压力测试
wrk -t12 -c400 -d30s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/payslips/current

# 使用ab进行简单压力测试
ab -n 1000 -c 100 -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/payslips/current
```

### 5.2 Python + Locust 性能测试代码模板

<details>
<summary>点击展开完整代码（约200行）</summary>

```python
"""
人力资源系统API性能测试脚本
测试框架: Locust
"""
from locust import HttpUser, task, between, events
from locust.runners import MasterRunner
import random
import logging
from datetime import datetime, timedelta

# ============================================================
# 配置
# ============================================================
class TestConfig:
    BASE_URL = "http://localhost:8080"
    API_PREFIX = "/api/v1"
    
    # 测试数据
    EMPLOYEE_POOL_SIZE = 1000
    DEPARTMENT_COUNT = 50
    
    # 性能目标
    RESPONSE_TIME_P95 = 500  # ms
    ERROR_RATE_THRESHOLD = 0.01  # 1%


# ============================================================
# 测试数据工厂
# ============================================================
class TestDataFactory:
    _employee_pool = []
    _department_ids = []
    _initialized = False
    
    @classmethod
    def initialize(cls, client):
        if cls._initialized:
            return
            
        # 生成员工池
        cls._employee_pool = [
            {"username": f"emp_{i:04d}", "password": "Test@123"}
            for i in range(TestConfig.EMPLOYEE_POOL_SIZE)
        ]
        
        # 生成部门ID池
        cls._department_ids = list(range(1, TestConfig.DEPARTMENT_COUNT + 1))
            
        cls._initialized = True
    
    @classmethod
    def get_random_employee(cls):
        return random.choice(cls._employee_pool)
    
    @classmethod
    def get_random_department_id(cls):
        return random.choice(cls._department_ids)
    
    @classmethod
    def generate_leave_request(cls):
        """生成请假申请数据"""
        leave_types = ["ANNUAL", "SICK", "PERSONAL", "MATERNITY", "PATERNITY"]
        start_date = datetime.now() + timedelta(days=random.randint(1, 30))
        end_date = start_date + timedelta(days=random.randint(1, 5))
        return {
            "leaveType": random.choice(leave_types),
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": end_date.strftime("%Y-%m-%d"),
            "reason": f"测试请假申请_{random.randint(1000, 9999)}"
        }


# ============================================================
# 基础用户类
# ============================================================
class BaseAPIUser(HttpUser):
    abstract = True
    wait_time = between(1, 5)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.token = None
        self.employee_id = None
        
    def on_start(self):
        """用户启动时登录"""
        TestDataFactory.initialize(self.client)
        employee = TestDataFactory.get_random_employee()
        
        response = self.client.post(
            f"{TestConfig.API_PREFIX}/auth/login",
            json=employee,
            name="[Auth] Login"
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("data", {}).get("token")
            self.employee_id = data.get("data", {}).get("employeeId")
            
    @property
    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}


# ============================================================
# 普通员工用户（60%流量）
# ============================================================
class EmployeeUser(BaseAPIUser):
    weight = 60
    
    @task(10)
    def view_personal_info(self):
        """查看个人信息"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/employees/me",
            headers=self.auth_headers,
            name="[Employee] Personal Info"
        )
    
    @task(8)
    def view_payslip(self):
        """查看薪资单"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/payslips/current",
            headers=self.auth_headers,
            name="[Payslip] Current"
        )
    
    @task(6)
    def view_annual_bonus(self):
        """查看年终奖"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/bonus/annual",
            headers=self.auth_headers,
            name="[Bonus] Annual"
        )
    
    @task(5)
    def view_leave_balance(self):
        """查看假期余额"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/leaves/balance",
            headers=self.auth_headers,
            name="[Leave] Balance"
        )
    
    @task(4)
    def submit_leave_request(self):
        """提交请假申请"""
        leave_data = TestDataFactory.generate_leave_request()
        self.client.post(
            f"{TestConfig.API_PREFIX}/leaves",
            json=leave_data,
            headers=self.auth_headers,
            name="[Leave] Submit Request"
        )
    
    @task(3)
    def view_payslip_history(self):
        """查看历史工资单"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/payslips/history",
            params={"year": datetime.now().year},
            headers=self.auth_headers,
            name="[Payslip] History"
        )


# ============================================================
# 部门经理用户（30%流量）
# ============================================================
class ManagerUser(BaseAPIUser):
    weight = 30
    wait_time = between(2, 8)
    
    @task(8)
    def view_team_members(self):
        """查看团队成员"""
        dept_id = TestDataFactory.get_random_department_id()
        self.client.get(
            f"{TestConfig.API_PREFIX}/teams/{dept_id}/members",
            headers=self.auth_headers,
            name="[Team] Members"
        )
    
    @task(8)
    def view_pending_approvals(self):
        """查看待审批列表"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/approvals/pending",
            params={"page": 1, "pageSize": 20},
            headers=self.auth_headers,
            name="[Approval] Pending List"
        )
    
    @task(6)
    def approve_request(self):
        """审批请求"""
        approval_id = random.randint(1, 1000)
        self.client.put(
            f"{TestConfig.API_PREFIX}/approvals/{approval_id}",
            json={
                "status": random.choice(["APPROVED", "REJECTED"]),
                "comment": "性能测试审批"
            },
            headers=self.auth_headers,
            name="[Approval] Process"
        )
    
    @task(5)
    def view_team_salary_summary(self):
        """查看团队薪资汇总"""
        dept_id = TestDataFactory.get_random_department_id()
        self.client.get(
            f"{TestConfig.API_PREFIX}/teams/{dept_id}/salary-summary",
            params={"month": datetime.now().strftime("%Y-%m")},
            headers=self.auth_headers,
            name="[Team] Salary Summary"
        )
    
    @task(3)
    def submit_performance_review(self):
        """提交绩效评估"""
        employee_id = random.randint(1, 100)
        self.client.post(
            f"{TestConfig.API_PREFIX}/performance/reviews",
            json={
                "employeeId": employee_id,
                "period": datetime.now().strftime("%Y-Q%q"),
                "score": random.randint(60, 100),
                "comment": "性能测试绩效评估"
            },
            headers=self.auth_headers,
            name="[Performance] Submit Review"
        )


# ============================================================
# HR管理员用户（10%流量）
# ============================================================
class HRAdminUser(BaseAPIUser):
    weight = 10
    wait_time = between(3, 10)
    
    @task(8)
    def view_employee_list(self):
        """查看员工列表"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/admin/employees",
            params={"page": 1, "pageSize": 50},
            headers=self.auth_headers,
            name="[Admin] Employee List"
        )
    
    @task(5)
    def search_employees(self):
        """搜索员工"""
        keywords = ["张", "李", "王", "开发", "产品", "设计"]
        self.client.get(
            f"{TestConfig.API_PREFIX}/admin/employees/search",
            params={"keyword": random.choice(keywords)},
            headers=self.auth_headers,
            name="[Admin] Search Employees"
        )
    
    @task(4)
    def generate_salary_report(self):
        """生成薪资报表"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/admin/reports/salary",
            params={
                "month": datetime.now().strftime("%Y-%m"),
                "departmentId": TestDataFactory.get_random_department_id()
            },
            headers=self.auth_headers,
            name="[Admin] Salary Report"
        )
    
    @task(3)
    def generate_bonus_report(self):
        """生成年终奖报表"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/admin/reports/bonus",
            params={"year": datetime.now().year},
            headers=self.auth_headers,
            name="[Admin] Bonus Report"
        )
    
    @task(2)
    def create_employee(self):
        """创建员工"""
        self.client.post(
            f"{TestConfig.API_PREFIX}/admin/employees",
            json={
                "name": f"测试员工_{random.randint(10000, 99999)}",
                "email": f"test_{random.randint(10000, 99999)}@company.com",
                "departmentId": TestDataFactory.get_random_department_id(),
                "position": random.choice(["工程师", "设计师", "产品经理", "运营"])
            },
            headers=self.auth_headers,
            name="[Admin] Create Employee"
        )


# ============================================================
# 薪资查询高峰压力测试用户
# ============================================================
class SalaryQueryStressUser(BaseAPIUser):
    weight = 0  # 默认不参与混合测试
    wait_time = between(0.1, 0.5)
    
    @task
    def stress_query_salary(self):
        """压力测试：薪资查询"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/payslips/current",
            headers=self.auth_headers,
            name="[Stress] Salary Query"
        )
    
    @task
    def stress_query_bonus(self):
        """压力测试：年终奖查询"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/bonus/annual",
            headers=self.auth_headers,
            name="[Stress] Bonus Query"
        )


# ============================================================
# 年会直播压力测试用户
# ============================================================
class AnnualMeetingStressUser(BaseAPIUser):
    weight = 0  # 默认不参与混合测试
    wait_time = between(0.5, 2)
    
    @task(10)
    def stress_live_stream(self):
        """压力测试：年会直播流获取"""
        self.client.get(
            f"{TestConfig.API_PREFIX}/live/stream",
            headers=self.auth_headers,
            name="[Stress] Live Stream"
        )
    
    @task(5)
    def stress_live_interaction(self):
        """压力测试：年会互动（弹幕/点赞）"""
        self.client.post(
            f"{TestConfig.API_PREFIX}/live/interaction",
            json={"type": random.choice(["LIKE", "COMMENT"]), "content": "新年快乐"},
            headers=self.auth_headers,
            name="[Stress] Live Interaction"
        )
    
    @task(3)
    def stress_live_lottery(self):
        """压力测试：年会抽奖"""
        self.client.post(
            f"{TestConfig.API_PREFIX}/live/lottery/participate",
            headers=self.auth_headers,
            name="[Stress] Live Lottery"
        )


# ============================================================
# 运行配置
# ============================================================
"""
运行命令示例：

# 基准测试（单用户）
locust -f performance_test.py --headless -u 1 -r 1 -t 1m --host http://localhost:8080

# 负载测试（阶梯增加）
locust -f performance_test.py --headless -u 500 -r 50 -t 30m --host http://localhost:8080

# 薪资查询高峰压力测试
locust -f performance_test.py SalaryQueryStressUser --headless -u 5000 -r 500 -t 10m --host http://localhost:8080

# 年会直播高峰压力测试
locust -f performance_test.py AnnualMeetingStressUser --headless -u 10000 -r 1000 -t 30m --host http://localhost:8080

# 生成HTML报告
locust -f performance_test.py --headless -u 100 -r 10 -t 5m --html report.html
"""
```

</details>

### 5.3 Python + Pytest 性能测试代码模板

<details>
<summary>点击展开完整代码（约200行）</summary>

```python
"""
API性能测试脚本
测试框架: pytest + requests + concurrent.futures
"""
import pytest
import requests
import time
import statistics
import concurrent.futures
from dataclasses import dataclass
from typing import List, Dict, Callable, Optional
import numpy as np
import json

# ============================================================
# 配置
# ============================================================
class PerformanceConfig:
    BASE_URL = "http://localhost:8080"
    API_PREFIX = "/api/v1"
    
    # 测试参数
    BASELINE_ITERATIONS = 100
    CONCURRENT_USERS = [10, 50, 100, 200, 500]
    REQUESTS_PER_USER = 10
    
    # 性能目标
    TARGETS = {
        "GET /employees": {"p95": 200, "error_rate": 0.01},
        "GET /employees/{id}": {"p95": 100, "error_rate": 0.01},
        "GET /payslips/current": {"p95": 300, "error_rate": 0.01},
        "GET /bonus/annual": {"p95": 500, "error_rate": 0.01},
        "GET /approvals/pending": {"p95": 300, "error_rate": 0.01}
    }


# ============================================================
# 性能测试结果
# ============================================================
@dataclass
class PerformanceResult:
    total_requests: int
    successful_requests: int
    failed_requests: int
    response_times: List[float]
    errors: List[Dict]
    duration: float
    
    @property
    def success_rate(self) -> float:
        return self.successful_requests / self.total_requests * 100 if self.total_requests > 0 else 0
    
    @property
    def error_rate(self) -> float:
        return self.failed_requests / self.total_requests * 100 if self.total_requests > 0 else 0
    
    @property
    def throughput(self) -> float:
        return self.total_requests / self.duration if self.duration > 0 else 0
    
    @property
    def statistics(self) -> Dict:
        if not self.response_times:
            return {}
        return {
            "min": np.min(self.response_times),
            "max": np.max(self.response_times),
            "avg": np.mean(self.response_times),
            "median": np.median(self.response_times),
            "std": np.std(self.response_times),
            "p50": np.percentile(self.response_times, 50),
            "p90": np.percentile(self.response_times, 90),
            "p95": np.percentile(self.response_times, 95),
            "p99": np.percentile(self.response_times, 99)
        }
    
    def to_dict(self) -> Dict:
        return {
            "total_requests": self.total_requests,
            "successful_requests": self.successful_requests,
            "failed_requests": self.failed_requests,
            "success_rate": f"{self.success_rate:.2f}%",
            "error_rate": f"{self.error_rate:.2f}%",
            "throughput": f"{self.throughput:.2f} req/s",
            "duration": f"{self.duration:.2f}s",
            "statistics": self.statistics
        }


# ============================================================
# 性能测试工具类
# ============================================================
class PerformanceTester:
    def __init__(self, base_url: str, auth_token: str = None):
        self.base_url = base_url
        self.session = requests.Session()
        if auth_token:
            self.session.headers["Authorization"] = f"Bearer {auth_token}"
    
    def run_baseline_test(
        self,
        request_func: Callable,
        iterations: int = 100,
        warmup_iterations: int = 10
    ) -> PerformanceResult:
        """基准测试：单线程执行多次请求"""
        # 预热
        for _ in range(warmup_iterations):
            request_func()
        
        response_times = []
        errors = []
        successful = 0
        failed = 0
        
        start_time = time.time()
        
        for _ in range(iterations):
            req_start = time.perf_counter()
            try:
                response = request_func()
                elapsed = (time.perf_counter() - req_start) * 1000
                
                if response.status_code < 400:
                    response_times.append(elapsed)
                    successful += 1
                else:
                    failed += 1
                    errors.append({
                        "status_code": response.status_code,
                        "response_time": elapsed
                    })
            except Exception as e:
                failed += 1
                errors.append({"exception": str(e)})
        
        duration = time.time() - start_time
        
        return PerformanceResult(
            total_requests=iterations,
            successful_requests=successful,
            failed_requests=failed,
            response_times=response_times,
            errors=errors,
            duration=duration
        )
    
    def run_concurrent_test(
        self,
        request_func: Callable,
        concurrent_users: int,
        requests_per_user: int
    ) -> PerformanceResult:
        """并发测试：多线程同时执行请求"""
        all_response_times = []
        all_errors = []
        successful = 0
        failed = 0
        
        def worker():
            nonlocal successful, failed
            local_times = []
            local_errors = []
            
            for _ in range(requests_per_user):
                req_start = time.perf_counter()
                try:
                    response = request_func()
                    elapsed = (time.perf_counter() - req_start) * 1000
                    
                    if response.status_code < 400:
                        local_times.append(elapsed)
                    else:
                        local_errors.append({
                            "status_code": response.status_code,
                            "response_time": elapsed
                        })
                except Exception as e:
                    local_errors.append({"exception": str(e)})
            
            return local_times, local_errors
        
        start_time = time.time()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = [executor.submit(worker) for _ in range(concurrent_users)]
            
            for future in concurrent.futures.as_completed(futures):
                times, errs = future.result()
                all_response_times.extend(times)
                all_errors.extend(errs)
                successful += len(times)
                failed += len(errs)
        
        duration = time.time() - start_time
        
        return PerformanceResult(
            total_requests=concurrent_users * requests_per_user,
            successful_requests=successful,
            failed_requests=failed,
            response_times=all_response_times,
            errors=all_errors,
            duration=duration
        )


# ============================================================
# Fixtures
# ============================================================
@pytest.fixture(scope="module")
def auth_token() -> str:
    """获取认证Token"""
    response = requests.post(
        f"{PerformanceConfig.BASE_URL}{PerformanceConfig.API_PREFIX}/auth/login",
        json={"username": "admin", "password": "Admin@123"}
    )
    return response.json().get("data", {}).get("token", "")


@pytest.fixture(scope="module")
def perf_tester(auth_token) -> PerformanceTester:
    """性能测试器实例"""
    return PerformanceTester(
        PerformanceConfig.BASE_URL + PerformanceConfig.API_PREFIX,
        auth_token
    )


# ============================================================
# 基准测试
# ============================================================
class TestHRAPIBaseline:
    """人力资源API基准性能测试"""
    
    def test_get_employees_baseline(self, perf_tester):
        """GET /employees 基准测试"""
        def request_func():
            return perf_tester.session.get(
                f"{perf_tester.base_url}/admin/employees",
                params={"page": 1, "pageSize": 20}
            )
        
        result = perf_tester.run_baseline_test(
            request_func,
            iterations=PerformanceConfig.BASELINE_ITERATIONS
        )
        
        print(f"\n员工列表基准测试结果: {json.dumps(result.to_dict(), indent=2, ensure_ascii=False)}")
        
        # 断言
        assert result.success_rate >= 99
        assert result.statistics["p95"] < PerformanceConfig.TARGETS["GET /employees"]["p95"]
    
    def test_salary_query_baseline(self, perf_tester):
        """GET /payslips/current 基准测试"""
        def request_func():
            return perf_tester.session.get(
                f"{perf_tester.base_url}/payslips/current"
            )
        
        result = perf_tester.run_baseline_test(
            request_func,
            iterations=PerformanceConfig.BASELINE_ITERATIONS
        )
        
        print(f"\n薪资查询基准测试结果: {json.dumps(result.to_dict(), indent=2, ensure_ascii=False)}")
        
        assert result.success_rate >= 99
        assert result.statistics["p95"] < PerformanceConfig.TARGETS["GET /payslips/current"]["p95"]


# ============================================================
# 并发测试
# ============================================================
class TestHRAPIConcurrency:
    """人力资源API并发性能测试"""
    
    @pytest.mark.parametrize("concurrent_users", PerformanceConfig.CONCURRENT_USERS)
    def test_salary_query_concurrent(self, perf_tester, concurrent_users):
        """GET /payslips/current 并发测试（模拟薪资查询高峰）"""
        def request_func():
            return perf_tester.session.get(
                f"{perf_tester.base_url}/payslips/current"
            )
        
        result = perf_tester.run_concurrent_test(
            request_func,
            concurrent_users=concurrent_users,
            requests_per_user=PerformanceConfig.REQUESTS_PER_USER
        )
        
        print(f"\n薪资查询并发测试结果 ({concurrent_users}用户): {json.dumps(result.to_dict(), indent=2, ensure_ascii=False)}")
        
        # 基本断言
        assert result.success_rate >= 95, f"成功率过低: {result.success_rate}%"


# ============================================================
# 压力测试
# ============================================================
class TestHRAPIStress:
    """人力资源API压力测试"""
    
    def test_salary_query_find_breaking_point(self, perf_tester):
        """寻找薪资查询系统崩溃点"""
        results = []
        
        for users in [100, 200, 500, 1000, 2000]:
            def request_func():
                return perf_tester.session.get(
                    f"{perf_tester.base_url}/payslips/current"
                )
            
            result = perf_tester.run_concurrent_test(
                request_func,
                concurrent_users=users,
                requests_per_user=5
            )
            
            results.append({
                "concurrent_users": users,
                "success_rate": result.success_rate,
                "p95": result.statistics.get("p95", 0),
                "error_rate": result.error_rate
            })
            
            print(f"\n薪资查询压力测试 ({users}用户): {json.dumps(result.to_dict(), indent=2, ensure_ascii=False)}")
            
            # 如果错误率超过50%，停止测试
            if result.error_rate > 50:
                print(f"系统崩溃点: {users}用户")
                break
        
        # 输出汇总
        print(f"\n压力测试汇总: {json.dumps(results, indent=2)}")


# ============================================================
# 运行配置
# ============================================================
"""
运行命令：

# 运行所有性能测试
pytest hr_performance_test.py -v -s

# 只运行基准测试
pytest hr_performance_test.py::TestHRAPIBaseline -v -s

# 只运行并发测试
pytest hr_performance_test.py::TestHRAPIConcurrency -v -s

# 只运行压力测试
pytest hr_performance_test.py::TestHRAPIStress -v -s

# 生成HTML报告
pytest hr_performance_test.py -v -s --html=hr_performance_report.html
"""
```

### 5.4 运行命令速查

```bash
# ============================================================
# Locust 运行命令
# ============================================================

# 基准测试（单用户）
locust -f performance_test.py --headless -u 1 -r 1 -t 1m --host http://localhost:8080

# 负载测试（阶梯增加）
locust -f performance_test.py --headless -u 500 -r 50 -t 30m --host http://localhost:8080

# 薪资查询高峰压力测试
locust -f performance_test.py SalaryQueryStressUser --headless -u 5000 -r 500 -t 10m --host http://localhost:8080

# 年会直播高峰压力测试
locust -f performance_test.py AnnualMeetingStressUser --headless -u 10000 -r 1000 -t 30m --host http://localhost:8080

# 生成HTML报告
locust -f performance_test.py --headless -u 100 -r 10 -t 5m --html report.html

# 分布式测试（主节点）
locust -f performance_test.py --master --host http://localhost:8080

# 分布式测试（工作节点）
locust -f performance_test.py --worker --master-host=192.168.1.100

# ============================================================
# Pytest 运行命令
# ============================================================

# 运行所有性能测试
pytest hr_performance_test.py -v -s

# 只运行基准测试
pytest hr_performance_test.py::TestHRAPIBaseline -v -s

# 只运行并发测试
pytest hr_performance_test.py::TestHRAPIConcurrency -v -s

# 只运行压力测试
pytest hr_performance_test.py::TestHRAPIStress -v -s

# 生成HTML报告
pytest hr_performance_test.py -v -s --html=hr_performance_report.html

# 生成Allure报告
pytest hr_performance_test.py --alluredir=reports/allure-results
allure serve reports/allure-results

# ============================================================
# 其他工具命令
# ============================================================

# wrk 压力测试
wrk -t12 -c400 -d30s http://localhost:8080/api/v1/employees

# ab 压力测试
ab -n 10000 -c 100 http://localhost:8080/api/v1/employees

# curl 响应时间测试
curl -o /dev/null -s -w "time_total: %{time_total}s\n" http://localhost:8080/api/v1/employees

# JMeter 命令行
jmeter -n -t test.jmx -l result.jtl -e -o report/
```

---

## 六、测试执行与数据采集

### 6.1 测试环境准备检查清单

```yaml
environment_checklist:
  hardware:
    - item: CPU核心数
      requirement: ">= 生产环境配置"
      check_command: "cat /proc/cpuinfo | grep processor | wc -l"
    - item: 内存大小
      requirement: ">= 生产环境配置"
      check_command: "free -h"
    - item: 磁盘空间
      requirement: ">= 50GB可用"
      check_command: "df -h"
      
  software:
    - item: JVM版本
      requirement: "与生产环境一致"
    - item: 数据库版本
      requirement: "与生产环境一致"
    - item: 中间件版本
      requirement: "与生产环境一致"
      
  network:
    - item: 网络延迟
      requirement: "< 1ms（同机房）"
      check_command: "ping -c 10 target_host"
    - item: 带宽
      requirement: ">= 1Gbps"
      
  data:
    - item: 测试数据量
      requirement: "与生产环境数量级一致"
    - item: 数据分布
      requirement: "符合真实业务分布"
```

### 6.2 监控指标采集

```yaml
monitoring_metrics:
  application:
    - metric: response_time
      source: APM / 日志
      interval: 1s
    - metric: throughput
      source: APM / 负载均衡
      interval: 1s
    - metric: error_rate
      source: APM / 日志
      interval: 1s
    - metric: active_threads
      source: JMX / Actuator
      interval: 5s
      
  system:
    - metric: cpu_usage
      source: Prometheus / Node Exporter
      interval: 5s
    - metric: memory_usage
      source: Prometheus / Node Exporter
      interval: 5s
    - metric: disk_io
      source: Prometheus / Node Exporter
      interval: 5s
    - metric: network_io
      source: Prometheus / Node Exporter
      interval: 5s
      
  database:
    - metric: connections
      source: MySQL Exporter
      interval: 5s
    - metric: query_time
      source: Slow Query Log
      interval: 1s
    - metric: lock_wait
      source: MySQL Exporter
      interval: 5s
      
  jvm:
    - metric: heap_usage
      source: JMX / Actuator
      interval: 5s
    - metric: gc_count
      source: JMX / Actuator
      interval: 5s
    - metric: gc_time
      source: JMX / Actuator
      interval: 5s
```

### 6.3 数据采集脚本示例

```python
"""
性能测试监控数据采集脚本
"""
import time
import psutil
import requests
from datetime import datetime
import json

class MetricsCollector:
    def __init__(self, output_file: str):
        self.output_file = output_file
        self.metrics = []
        
    def collect_system_metrics(self) -> dict:
        """采集系统指标"""
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_io_read": psutil.disk_io_counters().read_bytes,
            "disk_io_write": psutil.disk_io_counters().write_bytes,
            "network_sent": psutil.net_io_counters().bytes_sent,
            "network_recv": psutil.net_io_counters().bytes_recv
        }
    
    def collect_jvm_metrics(self, actuator_url: str) -> dict:
        """采集JVM指标（Spring Boot Actuator）"""
        try:
            response = requests.get(f"{actuator_url}/metrics")
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return {}
    
    def start_collection(self, interval: int = 5, duration: int = 300):
        """开始采集"""
        end_time = time.time() + duration
        
        while time.time() < end_time:
            metrics = self.collect_system_metrics()
            self.metrics.append(metrics)
            time.sleep(interval)
        
        # 保存结果
        with open(self.output_file, 'w') as f:
            json.dump(self.metrics, f, indent=2)
```

---

## 七、测试报告与分析

### 7.1 性能测试报告结构

```markdown
# 性能测试报告

## 1. 报告摘要
| 项目 | 内容 |
|------|------|
| 项目名称 | XXX系统性能测试 |
| 测试版本 | v1.2.0 |
| 测试环境 | 性能测试环境 |
| 测试时间 | 2024-12-04 10:00 - 14:00 |
| 测试结论 | ✅ 通过 / ❌ 不通过 |

## 2. 测试目标与结果对比
| 指标 | 目标值 | 实测值 | 结果 |
|------|--------|--------|------|
| P95响应时间 | < 500ms | 320ms | ✅ |
| 错误率 | < 0.1% | 0.05% | ✅ |
| 吞吐量 | > 1000 req/s | 1500 req/s | ✅ |
| 最大并发 | 1000用户 | 1200用户 | ✅ |

## 3. 详细测试结果

### 3.1 基准测试结果
| 接口 | Avg | P50 | P90 | P95 | P99 | Max |
|------|-----|-----|-----|-----|-----|-----|
| GET /employees | 45ms | 40ms | 80ms | 120ms | 200ms | 350ms |
| GET /payslips/current | 120ms | 100ms | 180ms | 250ms | 400ms | 800ms |

### 3.2 并发测试结果
| 并发数 | 吞吐量 | P95 | 错误率 |
|--------|--------|-----|--------|
| 100 | 800 req/s | 150ms | 0% |
| 500 | 1200 req/s | 320ms | 0.02% |
| 1000 | 1500 req/s | 480ms | 0.1% |
| 1500 | 1400 req/s | 850ms | 2% |

### 3.3 压力测试结果
- 系统崩溃点：1800并发用户
- 崩溃表现：错误率超过50%，响应时间超过10s
- 恢复时间：压力释放后2分钟内恢复正常

## 4. 资源使用分析

### 4.1 CPU使用率
- 峰值：85%
- 平均：60%
- 瓶颈分析：无明显CPU瓶颈

### 4.2 内存使用率
- 峰值：78%
- 平均：65%
- 内存泄漏检测：未发现

### 4.3 数据库连接
- 最大连接数：200
- 峰值使用：180
- 建议：增加连接池大小至250

## 5. 性能瓶颈分析

### 5.1 已识别瓶颈
| 瓶颈点 | 影响 | 建议 |
|--------|------|------|
| 数据库连接池 | 高并发时连接等待 | 增加连接池大小 |
| 员工查询SQL | 复杂查询耗时长 | 添加索引优化 |

### 5.2 优化建议
1. **数据库优化**
   - 为employees表的department_id字段添加索引
   - 优化薪资查询SQL，减少JOIN操作
   
2. **缓存优化**
   - 热点员工数据添加Redis缓存
   - 用户会话信息使用分布式缓存
   
3. **架构优化**
   - 读写分离
   - 考虑引入消息队列处理审批流程

## 6. 结论与建议

### 6.1 测试结论
系统在1000并发用户下性能表现良好，满足SLA要求。

### 6.2 风险提示
- 促销活动期间需提前扩容
- 建议增加监控告警

### 6.3 后续计划
- 优化数据库查询
- 增加缓存层
- 进行容量规划
```

### 7.2 性能分析方法

#### 7.2.1 响应时间分布分析

```python
import matplotlib.pyplot as plt
import numpy as np

def analyze_response_time_distribution(response_times: list):
    """分析响应时间分布"""
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # 1. 直方图
    axes[0, 0].hist(response_times, bins=50, edgecolor='black')
    axes[0, 0].set_title('响应时间分布直方图')
    axes[0, 0].set_xlabel('响应时间 (ms)')
    axes[0, 0].set_ylabel('频次')
    
    # 2. 百分位数
    percentiles = [50, 75, 90, 95, 99]
    values = [np.percentile(response_times, p) for p in percentiles]
    axes[0, 1].bar([f'P{p}' for p in percentiles], values)
    axes[0, 1].set_title('响应时间百分位数')
    axes[0, 1].set_ylabel('响应时间 (ms)')
    
    # 3. 时间序列
    axes[1, 0].plot(response_times)
    axes[1, 0].set_title('响应时间趋势')
    axes[1, 0].set_xlabel('请求序号')
    axes[1, 0].set_ylabel('响应时间 (ms)')
    
    # 4. 箱线图
    axes[1, 1].boxplot(response_times)
    axes[1, 1].set_title('响应时间箱线图')
    axes[1, 1].set_ylabel('响应时间 (ms)')
    
    plt.tight_layout()
    plt.savefig('response_time_analysis.png')
    plt.show()
```

#### 7.2.2 吞吐量趋势分析

```python
def analyze_throughput_trend(timestamps: list, request_counts: list):
    """分析吞吐量趋势"""
    plt.figure(figsize=(12, 6))
    plt.plot(timestamps, request_counts, marker='o')
    plt.title('吞吐量趋势')
    plt.xlabel('时间')
    plt.ylabel('请求数/秒')
    plt.grid(True)
    plt.savefig('throughput_trend.png')
    plt.show()
```

---

## 八、性能优化建议

### 8.1 常见性能问题与解决方案

| 问题类型 | 症状 | 可能原因 | 解决方案 |
|----------|------|----------|----------|
| **响应慢** | P95 > 目标值 | 数据库查询慢、缺少索引 | 优化SQL、添加索引、使用缓存 |
| **吞吐量低** | QPS无法提升 | 线程池配置不当、连接池不足 | 调整线程池、增加连接池 |
| **错误率高** | 错误率 > 1% | 超时、资源不足 | 增加超时时间、扩容 |
| **CPU高** | CPU > 80% | 计算密集、GC频繁 | 优化算法、调整JVM参数 |
| **内存高** | 内存 > 85% | 内存泄漏、缓存过大 | 排查泄漏、调整缓存策略 |
| **连接耗尽** | 连接等待 | 连接池不足、连接泄漏 | 增加连接池、检查连接释放 |

### 8.2 优化检查清单

```yaml
optimization_checklist:
  database:
    - item: 慢查询优化
      action: 分析慢查询日志，优化TOP10慢SQL
    - item: 索引优化
      action: 检查缺失索引，删除冗余索引
    - item: 连接池配置
      action: 根据并发量调整连接池大小
      
  cache:
    - item: 热点数据缓存
      action: 识别热点数据，添加Redis缓存
    - item: 缓存命中率
      action: 监控命中率，优化缓存策略
      
  application:
    - item: 线程池配置
      action: 根据CPU核心数调整线程池
    - item: JVM参数
      action: 调整堆大小、GC策略
    - item: 连接超时
      action: 设置合理的超时时间
      
  architecture:
    - item: 读写分离
      action: 数据库读写分离
    - item: 异步处理
      action: 非核心流程异步化
    - item: 限流降级
      action: 添加限流和熔断机制
```

---

## 九、附录

### 9.1 常用性能测试工具

| 工具 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **Locust** | 负载测试 | Python编写、分布式支持 | API性能测试 |
| **JMeter** | 综合测试 | 功能强大、GUI操作 | 复杂场景测试 |
| **Gatling** | 负载测试 | Scala编写、报告美观 | 高并发测试 |
| **wrk** | 压力测试 | C编写、轻量高效 | 简单压力测试 |
| **ab** | 压力测试 | Apache自带、简单易用 | 快速压测 |
| **k6** | 负载测试 | JavaScript编写、云原生 | 现代化测试 |

### 9.2 性能指标计算公式

```
# 吞吐量
TPS = 总事务数 / 总时间（秒）
QPS = 总请求数 / 总时间（秒）

# 响应时间百分位
P95 = 排序后第95%位置的值

# 错误率
错误率 = 失败请求数 / 总请求数 × 100%

# 并发用户数估算
并发用户数 = TPS × 平均响应时间（秒）

# 系统容量
系统容量 = 单机TPS × 机器数量 × 冗余系数
```

### 9.3 性能测试命令速查

```bash
# Locust
locust -f test.py --headless -u 100 -r 10 -t 5m --host http://localhost:8080

# wrk
wrk -t12 -c400 -d30s http://localhost:8080/api/employees

# ab
ab -n 10000 -c 100 http://localhost:8080/api/employees

# curl 响应时间
curl -o /dev/null -s -w "time_total: %{time_total}s\n" http://localhost:8080/api/employees

# JMeter 命令行
jmeter -n -t test.jmx -l result.jtl -e -o report/
```
