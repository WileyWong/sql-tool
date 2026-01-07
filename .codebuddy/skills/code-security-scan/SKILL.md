---
name: code-security-scan
description: 代码安全漏洞扫描工具，支持 Java/Go/TypeScript/Groovy/Python/MySQL 多语言安全检测。自动识别 SQL 注入、XSS、敏感信息泄露、命令注入等安全风险，提供详细的风险评级和修复建议。适用于代码审查、安全评估、上线前检查等场景。
---

# 代码安全漏洞扫描

多语言代码安全扫描，自动检测常见安全漏洞并提供修复建议。

## 核心流程

```
步骤0: 上下文获取 → ✅检查点0 → 步骤1: 输入分析 → ✅检查点1 → 步骤2: 安全扫描 → 步骤3: 风险评估 → ✅检查点2 → 步骤4: 报告生成
```

---

## ⚠️ 强制检查点

| 检查点 | 位置 | 检查内容 | 不通过处理 |
|--------|------|----------|-----------|
| **检查点0** | 步骤0后 | 项目上下文获取完整、安全策略已加载 | 使用默认配置继续 |
| **检查点1** | 步骤1后 | 语言识别正确、规则模块已加载、扫描范围已确定 | 重新分析输入 |
| **检查点2** | 步骤3后 | 扫描完整、风险评级准确、修复建议可行 | 补充遗漏项 |

---

## 步骤0: 上下文获取

### 知识库读取优先级

| 优先级 | 来源 | 获取方式 | 作用 |
|--------|------|---------|------|
| **1** | 用户指定 | 解析用户输入中的安全要求 | 特定扫描规则 |
| **2** | 项目宪章 | `.spec-code/memory/constitution.md` | 安全红线 |
| **3** | 安全策略 | `security-policy.md` / `security-whitelist.md` | 项目特定规则 |
| **4** | 技术上下文 | `.spec-code/memory/context.md` | 技术栈版本 |
| **5** | 默认配置 | 使用内置规则 | 通用安全规则 |

详见: [shared/knowledge-base.md](shared/knowledge-base.md)

---

## ✅ 检查点0: 上下文验证

```yaml
checkpoint_0:
  - [ ] 已尝试读取项目安全配置
  - [ ] 白名单规则已加载（如有）
  - [ ] 技术栈版本已确定
  - [ ] 扫描规则集已确定
```

---

## 步骤1: 输入分析与路由

### 输入类型识别

| 输入类型 | 识别特征 | 处理方式 |
|---------|---------|---------|
| **code-file** | 单个文件路径 | 直接扫描 |
| **code-directory** | 目录路径 | 递归扫描 |
| **code-snippet** | 无路径的代码块 | 语言检测后扫描 |
| **git-diff** | `git diff` 输出 | 增量扫描 |
| **natural-language** | "检查 SQL 注入风险" | 解析意图后扫描 |

### 语言路由表

| 语言 | 文件后缀 | 规则模块 | 规则数 |
|------|---------|---------|--------|
| **Java** | `.java` | [java/](java/) | 31 |
| **Go** | `.go` | [go/](go/) | 19 |
| **TypeScript** | `.ts/.tsx` | [typescript/](typescript/) | 16 |
| **Groovy** | `.groovy/.gradle` | [groovy/](groovy/) | 22 |
| **Python** | `.py` | [python/](python/) | 16 |
| **SQL** | `.sql` | [mysql/](mysql/) | 10 |

详见: [shared/context-detection.md](shared/context-detection.md)

---

## ✅ 检查点1: 路由验证

```yaml
checkpoint_1:
  - [ ] 输入类型已正确识别
  - [ ] 目标语言已确定
  - [ ] 扫描范围已明确（文件列表）
  - [ ] 对应语言规则模块已加载
```

---

## 步骤2: 安全扫描

### 扫描优先级

| 优先级 | 代码层 | 说明 |
|--------|--------|------|
| **P0** | 入口层 | Controller/Handler/Pipeline/API |
| **P1** | 业务层 | Service/Manager/UseCase |
| **P2** | 数据层 | Repository/DAO/Mapper |
| **P3** | 工具层 | Utils/Helper/Common |

### 语言特定规则

- **Java**: [java/reference.md](java/reference.md) - SQL注入、XSS、反序列化、SSRF、依赖安全、日志安全
- **Go**: [go/reference.md](go/reference.md) - SQL注入、命令注入、SSRF、unsafe指针、依赖安全
- **TypeScript**: [typescript/reference.md](typescript/reference.md) - XSS、原型污染、SSRF、敏感数据暴露、依赖安全
- **Groovy**: [groovy/reference.md](groovy/reference.md) - 动态执行、Gradle/Grails/Spock专项
- **Python**: [python/reference.md](python/reference.md) - SQL注入、命令注入、SSRF、pickle反序列化、依赖安全
- **MySQL**: [mysql/reference.md](mysql/reference.md) - 权限提升、数据暴露

### 规则 ID 命名约定

| 语言 | 前缀格式 | 示例 |
|------|---------|------|
| Java | `JAVA-{类型}-{序号}` | JAVA-SQL-001, JAVA-XSS-001 |
| Go | `GO-{类型}-{序号}` | GO-SQL-001, GO-CMD-001 |
| TypeScript | `TS-{类型}-{序号}` | TS-XSS-001, TS-PROTO-001 |
| Groovy | `GRV-{序号}` | GRV-001, GRV-015 |
| Python | `PY-{类型}-{序号}` | PY-SQL-001, PY-CMD-001 |
| MySQL | `MYSQL-{类型}-{序号}` | MYSQL-PRIV-001 |

---

## 步骤3: 风险评估

风险等级定义和评估矩阵详见: [shared/severity-matrix.md](shared/severity-matrix.md)

---

## ✅ 检查点2: 报告验证

```yaml
checkpoint_2:
  - [ ] 所有目标文件已扫描
  - [ ] 所有规则已应用
  - [ ] 风险统计准确
  - [ ] 每个问题包含：文件、行号、代码、修复建议
  - [ ] 修复建议可直接应用
```

---

## 步骤4: 报告生成

### 报告结构

```markdown
# 代码安全扫描报告

## 📊 扫描摘要
- 扫描范围、语言、文件数
- 风险统计表

## 🔴 严重风险 (立即修复)
## 🟠 高危风险
## 🟡 中危风险
## 🟢 低危风险

## ✅ 修复优先级建议
## 📚 安全加固建议
```

---

## 快速开始

复制此清单跟踪进度（完整版见 [checklist.md](checklist.md)）：

```
安全扫描进度:
- [ ] 步骤0: 上下文获取
- [ ] ✅ 检查点0
- [ ] 步骤1: 输入分析 (语言: ___, 范围: ___)
- [ ] ✅ 检查点1
- [ ] 步骤2: 执行安全扫描
- [ ] 步骤3: 风险评估
- [ ] ✅ 检查点2
- [ ] 步骤4: 生成报告
```

---

## 常见场景

### 场景1: 扫描 Java 项目

```
输入: src/main/java/
路由: java/
输出: 安全扫描报告
```

### 场景2: 扫描 Gradle 构建脚本

```
输入: build.gradle
路由: groovy/ (gradle-script.md)
输出: Gradle 安全报告
```

### 场景3: 扫描 Git 变更

```
输入: git diff HEAD~1
路由: 根据变更文件类型动态路由
输出: 增量安全扫描报告
```

### 场景4: 专项扫描

```
输入: "检查项目中的 SQL 注入风险"
路由: 所有语言的 SQL 注入规则
输出: SQL 注入专项报告
```

---

## 示例: 扫描 Java 文件

**输入**: `扫描 UserService.java 的安全问题`

**输出**:
```
## 🔴 JAVA-SQL-001: SQL 注入 (行 45)
String sql = "SELECT * FROM users WHERE id = " + userId;

**修复**: 使用 PreparedStatement
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, userId);
```

---

## 扩展资源

- **检查清单**: [checklist.md](checklist.md)
- **使用示例**: [examples.md](examples.md)
- **知识库集成**: [shared/knowledge-base.md](shared/knowledge-base.md)
- **上下文检测**: [shared/context-detection.md](shared/context-detection.md)
- **风险矩阵**: [shared/severity-matrix.md](shared/severity-matrix.md)
- **漏洞知识库**: [shared/vulnerability-db.md](shared/vulnerability-db.md)

---

**版本**: 2.4.0  
**更新时间**: 2025-12-22
