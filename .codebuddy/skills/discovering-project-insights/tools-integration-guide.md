# 工具集成指南

如何在诊断过程中高效使用 CodeBuddy 内置工具

## 1. Task (Explore Agent) - 快速项目探索

### 用途
快速理解项目结构、技术栈、代码组织

### 使用时机
- **阶段 1**: 诊断准备 - 了解项目基础情况
- **阶段 2**: 架构诊断 - 快速扫描模块划分
- **阶段 2D**: 技术栈诊断 - 分析依赖和框架版本

### 使用示例

```python
# 启动 Explore Agent 快速探索
Task(
    subagent_type="Explore",
    prompt="""
    快速分析这个项目的架构：
    1. 项目的主要分层结构是什么？(Controller/Service/Repository 等)
    2. 核心模块有哪些？如何组织的？
    3. 是否遵循单一职责和高内聚低耦合原则？
    4. 缺失的关键模块有哪些？(缓存/日志/监控等)
    5. 是否存在明显的循环依赖或过度耦合？
    
    请提供结构化的分析结果。
    """,
    description="快速扫描项目架构"
)
```

### 输出解读

```
✓ 快速了解架构全貌 (5-10 分钟)
✓ 识别主要问题区域
✓ 为后续深度分析指路

✗ 不适合: 细粒度的代码质量分析 (用 Grep)
✗ 不适合: 需求验证 (用 Read)
```

## 2. Grep - 批量模式搜索

### 用途
系统性查找代码中的风险模式、技术债

### 常见诊断模式

#### 2.1 安全风险

```bash
# SQL 拼接风险
grep -r "execute\|executeQuery\|executeUpdate" \
  --include="*.java" \
  | grep -E "\".*\+|String.*query"

# 硬编码密钥/密码
grep -r "password\|secret\|token\|key" \
  --include="*.java" \
  | grep -E "= \"[a-zA-Z0-9]+\"|= '[a-zA-Z0-9]+'"

# 日志中的敏感信息
grep -r "log\|print" --include="*.java" \
  | grep -E "password|secret|token|card"
```

#### 2.2 代码质量

```bash
# 缺少异常处理
grep -r "try\|catch" --include="*.java" \
  --count | sort -t: -k2 -rn | head -20

# 未使用的 import
grep -r "^import" --include="*.java" \
  | wc -l

# 过长的方法 (>50 行)
grep -rn "public.*{" --include="*.java" \
  | head -20

# TODO/FIXME 注释
grep -r "TODO\|FIXME\|HACK\|XXX" \
  --include="*.java"
```

#### 2.3 性能问题

```bash
# N+1 查询模式
grep -r "for.*query\|loop.*select" \
  --include="*.java" --include="*.xml"

# 同步数据库操作
grep -r "@Transactional" \
  --include="*.java" | wc -l

# 缺少缓存层
grep -r "select.*from\|queryById" \
  --include="*.java" | grep -v cache
```

### 使用示例

```
诊断: 代码质量扫描
命令: grep -r "TODO\|FIXME" --include="*.java"
输出: 
  src/Service.java:42: TODO - 优化查询性能
  src/Controller.java:88: FIXME - 异常处理不完整
  ...
解释: 找到 12 个待处理技术债
```

## 3. Glob - 文件结构分析

### 用途
检查项目文件组织、识别缺失的关键模块

### 常见诊断模式

```bash
# 检查项目分层是否完整
glob "**/controller/*.java"    # 检查 Controller 存在
glob "**/service/*.java"        # 检查 Service 存在
glob "**/repository/*.java"     # 检查 Repository 存在

# 检查配置文件
glob "**/application*.yml"      # 应用配置
glob "**/pom.xml"              # Maven 配置
glob "**/.gitignore"           # Git 配置

# 检查关键模块
glob "**/config/*.java"         # 配置模块
glob "**/utils/*.java"          # 工具模块
glob "**/exception/*.java"      # 异常处理
glob "**/constants/*.java"      # 常量定义

# 检查测试覆盖
glob "**/test/**/*.java"        # 测试代码
glob "**/resources/**"          # 测试资源
```

### 使用示例

```
诊断: 项目结构完整性
检查:
  ✓ src/main/java/controller/     - 存在
  ✓ src/main/java/service/        - 存在
  ✓ src/main/java/repository/     - 存在
  ✗ src/main/java/config/        - 缺失!
  ✗ src/main/java/exception/     - 缺失!
  ✗ src/test/java/               - 测试代码极少

结论: 关键基础设施模块缺失，测试覆盖不足
```

## 4. Read - 深度文件分析

### 用途
详细分析关键文件、需求文档、配置

### 常见诊断路径

#### 4.1 需求验证

```
路径扫描:
  - docs/requirements/
  - workspace/
  - specifications/
  
检查内容:
  1. 需求是否有验收标准?
  2. 需求与代码实现是否一致?
  3. 是否有明确的业务规则定义?
  4. 是否遗漏了边界条件?
```

#### 4.2 架构文档

```
路径扫描:
  - docs/architecture/
  - README.md
  - docs/design/
  
检查内容:
  1. 架构设计是否清晰?
  2. 分层是否明确?
  3. 关键组件关系?
  4. 部署架构?
```

#### 4.3 配置文件

```
路径扫描:
  - pom.xml (Maven)
  - build.gradle (Gradle)
  - package.json (Node)
  - application.yml/properties
  
检查内容:
  1. 框架版本是否过时?
  2. 依赖冲突?
  3. 是否有安全漏洞?
  4. 配置是否规范?
```

### 使用示例

```
诊断: 需求完整性
读取: docs/requirements/user-management.md
分析:
  ✓ 功能描述完整
  ✗ 缺少验收标准 (AC)
  ✗ 缺少性能要求
  ✗ 缺少安全要求
  ✗ 缺少错误处理规范

建议: 补充 4 个遗漏的方面
```

## 5. AskUserQuestion - 采集专家知识

### 用途
结构化采集架构师、产品经理、业务专家的见解

### 诊断场景应用

#### 5.1 架构诊断

```
问题 1: "项目的核心业务流程是什么?"
  选项: [用户认证] [支付流程] [数据同步] [报表生成]

问题 2: "未来 6 个月最重要的需求?"
  选项: [性能优化] [功能扩展] [稳定性改进] [用户体验]

问题 3: "目前最大的技术痛点?"
  选项: [代码质量] [部署困难] [性能问题] [扩展性差]
```

#### 5.2 代码质量

```
问题 1: "代码审查的主要关注点?"
  选项: [安全性] [性能] [可维护性] [可读性]

问题 2: "技术债中最紧急的方面?"
  选项: [SQL 优化] [异常处理] [日志缺陷] [依赖更新]
```

#### 5.3 需求验证

```
问题 1: "需求文档的覆盖度如何?"
  选项: [完整] [80%] [50%] [不足30%]

问题 2: "代码实现是否超出规格?"
  选项: [完全符合] [略有超出] [显著超出] [范围蔓延严重]
```

### 最佳实践

```
✅ 分批提问 (一次 2-3 个，避免认知过载)
✅ 提供 2-4 个选项
✅ 包含详细描述帮助选择
✅ 记录答案用于后续分析
✅ 追问深入理解原因

❌ 一次提问超过 5 个
❌ 选项太多或太少
❌ 模糊的问题陈述
❌ 不记录回答
```

## 6. TodoWrite - 任务组织

### 用途
组织诊断发现、方案和任务追踪

### 诊断阶段应用

#### 6.1 聚类问题

```
newTodos: [
  {
    content: "修复 SQL 注入风险",
    activeForm: "正在修复 2 处 SQL 拼接问题",
    status: "pending"
  },
  {
    content: "补全异常处理",
    activeForm: "为 8 处未处理异常添加 try-catch",
    status: "pending"
  },
  ...
]
```

#### 6.2 优先级排序

```
高优先级 P0 (立即):
  - [ ] SQL 注入修复
  - [ ] 异常处理补全

中优先级 P1 (近期):
  - [ ] 性能优化
  - [ ] 框架升级

低优先级 P2 (计划):
  - [ ] 代码重构
  - [ ] 新技术探索
```

## 7. Bash - 质量指标收集

### 用途
运行项目质量检查工具，获取量化指标

### 常见诊断命令

#### 7.1 Java/Maven 项目

```bash
# 运行测试并获取覆盖率
mvn clean test jacoco:report

# 代码风格检查
mvn checkstyle:check

# 静态分析
mvn sonar:sonar

# 依赖检查
mvn dependency:tree | grep -E "conflicts|CONFLICT"
```

#### 7.2 Node 项目

```bash
# 代码风格
npm run lint

# 测试覆盖
npm run test:coverage

# 依赖审计
npm audit

# 性能分析
npm run build -- --analyze
```

#### 7.3 通用命令

```bash
# 代码行数统计
find . -name "*.java" -o -name "*.js" | xargs wc -l

# 测试文件比例
find . -path "*/test/*" -name "*.java" | wc -l
find . -path "*/src/main/*" -name "*.java" | wc -l

# 注释覆盖
grep -r "^[[:space:]]*//" . --include="*.java" | wc -l
```

### 输出解读

```
诊断: 代码质量指标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总代码行数: 45,000 LOC
主代码行数: 32,000 LOC
测试代码行数: 8,000 LOC
注释行数: 5,000 行

代码覆盖率: 68%
  - 高风险代码 <50%: 3 个模块
  - 中等风险 50-80%: 5 个模块
  - 低风险 >80%: 15 个模块

代码风格问题: 245 个
  - 严重: 12 个
  - 普通: 180 个
  - 提示: 53 个

Lint 警告: 89 个
  - 安全性: 8 个 ⚠️
  - 性能: 12 个 ⚠️
  - 风格: 69 个
```

## 📋 诊断工具组合矩阵

| 诊断维度 | Task | Grep | Glob | Read | AskUserQuestion | Bash | TodoWrite |
|---------|------|------|------|------|-----------------|------|-----------|
| 架构 | ✅✅ | ✅ | ✅✅ | ✅ | ✅ | - | ✅ |
| 代码质量 | ✅ | ✅✅ | ✅ | - | - | ✅✅ | ✅ |
| 需求完整 | - | ✅ | - | ✅✅ | ✅✅ | - | ✅ |
| 技术规划 | ✅ | - | ✅ | ✅ | ✅✅ | ✅ | ✅ |

注：✅✅ 高度推荐，✅ 有用，- 不适用

## 🎯 工具使用示例

### 例子 1: 架构诊断 (15 分钟)

```
第 1 步 (5 分钟):
  工具: Task (Explore)
  任务: 快速扫描项目架构
  输出: 架构概览、主要问题

第 2 步 (5 分钟):
  工具: Glob
  任务: 检查文件组织完整性
  输出: 缺失的关键目录

第 3 步 (5 分钟):
  工具: TodoWrite
  任务: 组织发现
  输出: 按优先级排序的问题清单
```

### 例子 2: 代码质量扫描 (30 分钟)

```
第 1 步 (10 分钟):
  工具: Bash
  任务: 运行 lint, test, coverage
  输出: 质量指标

第 2 步 (10 分钟):
  工具: Grep
  任务: 搜索安全风险、性能问题
  输出: 具体的代码位置

第 3 步 (10 分钟):
  工具: TodoWrite
  任务: 生成改进方案
  输出: 优先级排序的修复任务
```

### 例子 3: 需求验证 (1 小时)

```
第 1 步 (15 分钟):
  工具: Read
  任务: 阅读需求文档
  输出: 需求梗概、遗漏项

第 2 步 (15 分钟):
  工具: Grep
  任务: 搜索代码中的业务规则
  输出: 隐藏的需求

第 3 步 (15 分钟):
  工具: AskUserQuestion
  任务: 采集产品/业务见解
  输出: 缺失的验收标准

第 4 步 (15 分钟):
  工具: TodoWrite
  任务: 补全需求清单
  输出: 优先级排序的补全任务
```

## 💡 高效诊断 Tips

1. **顺序很重要**: Task → Grep/Glob → Read → AskUserQuestion → TodoWrite
2. **快速迭代**: 每一步只做 5-15 分钟，快速循环
3. **问题驱动**: 根据问题深度，决定是否需要深度分析
4. **文档记录**: 始终用 TodoWrite 记录发现，便于追踪
5. **专家补充**: 关键决策用 AskUserQuestion 采集专家意见

