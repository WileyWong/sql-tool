# code-security-scan

多语言代码安全漏洞扫描技能。

## 支持的语言

| 语言 | 规则数 | 规则文件 |
|------|--------|---------|
| Java | 31 | [java/reference.md](java/reference.md) |
| Go | 19 | [go/reference.md](go/reference.md) |
| TypeScript | 16 | [typescript/reference.md](typescript/reference.md) |
| Groovy | 22 | [groovy/reference.md](groovy/reference.md) |
| Python | 16 | [python/reference.md](python/reference.md) |
| MySQL | 10 | [mysql/reference.md](mysql/reference.md) |

## 目录结构

```
code-security-scan/
├── SKILL.md                    # 主入口
├── README.md                   # 本文件
├── checklist.md                # 检查清单
├── examples.md                 # 使用示例
├── shared/                     # 共享资源
│   ├── knowledge-base.md       # 知识库集成
│   ├── context-detection.md    # 上下文检测
│   ├── severity-matrix.md      # 风险评估矩阵
│   └── vulnerability-db.md     # 依赖漏洞知识库
├── java/                       # Java 安全规则
│   ├── reference.md            # 规则索引
│   └── rules/                  # 详细规则
├── go/                         # Go 安全规则
│   └── reference.md
├── typescript/                 # TypeScript 安全规则
│   └── reference.md
├── groovy/                     # Groovy 安全规则
│   ├── reference.md
│   └── rules/                  # Gradle/Grails/Spock 专项
├── python/                     # Python 安全规则
│   └── reference.md
└── mysql/                      # SQL 安全规则
    └── reference.md
```

## 核心流程

```
步骤0: 上下文获取 → ✅检查点0 → 步骤1: 输入分析 → ✅检查点1 → 步骤2: 安全扫描 → 步骤3: 风险评估 → ✅检查点2 → 步骤4: 报告生成
```

## 使用方式

1. 调用技能时，会自动识别输入的语言类型
2. 根据语言类型加载对应的规则模块
3. 执行安全扫描并生成报告

## 版本历史

- **v2.4.0** (2025-12-22): 实现完整依赖漏洞检测，新增 50+ CVE 漏洞库
- **v2.3.0** (2025-12-22): 统一 Java 规则 ID 命名，添加 JAVA- 前缀
- **v2.2.0** (2025-12-22): 清理 Jenkins 残留引用，补充 OWASP A06/A09 规则覆盖
- **v2.1.0** (2025-12-22): 修复审查报告中的问题，更新规则数量统计
- **v2.0.0** (2025-12-22): 模块化重构，支持多语言
- **v1.0.0** (2025-12-08): 初始版本，仅支持 Java
