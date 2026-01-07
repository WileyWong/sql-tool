# Groovy 安全规则索引

本文档定义 Groovy/Gradle/Grails/Spock 项目的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 适用场景 |
|--------|---------|---------|---------|
| GRV-001 | 动态代码执行 | 🔴 严重 | 通用 |
| GRV-002 | 命令注入 | 🔴 严重 | 通用 |
| GRV-003 | GString 注入 | 🟠 高危 | 通用 |
| GRV-004 | 不安全反序列化 | 🔴 严重 | 通用 |
| GRV-005 | 元编程滥用 | 🟠 高危 | 通用 |
| GRV-008 | Gradle 任务注入 | 🔴 严重 | Gradle |
| GRV-010 | 不安全 HTTP | 🟠 高危 | 通用 |
| GRV-011 | 插件安全风险 | 🟠 高危 | Gradle |
| GRV-012 | 构建脚本注入 | 🔴 严重 | Gradle |
| GRV-013 | 敏感信息泄露 | 🔴 严重 | Gradle |
| GRV-014 | 不安全依赖配置 | 🟠 高危 | Gradle |
| GRV-015 | Grails 命令注入 | 🔴 严重 | Grails |
| GRV-016 | GORM 注入 | 🔴 严重 | Grails |
| GRV-017 | GSP XSS | 🟠 高危 | Grails |
| GRV-018 | 不安全数据绑定 | 🟠 高危 | Grails |
| GRV-019 | 会话安全问题 | 🟠 高危 | Grails |
| GRV-020 | URL 重定向漏洞 | 🟠 高危 | Grails |
| GRV-021 | 测试数据泄露 | 🟠 高危 | Spock |
| GRV-022 | 不安全 Mock 配置 | 🟡 中危 | Spock |
| GRV-023 | 测试环境污染 | 🟡 中危 | Spock |
| GRV-024 | 敏感断言暴露 | 🟠 高危 | Spock |
| GRV-025 | 外部依赖风险 | 🟠 高危 | Spock |

---

## 详细规则

### 通用 Groovy 规则

- **动态执行检测**: [rules/dynamic-execution.md](rules/dynamic-execution.md)
- **命令注入检测**: [rules/command-injection.md](rules/command-injection.md)
- **GString 注入检测**: [rules/gstring-injection.md](rules/gstring-injection.md)

### Gradle 脚本专项

- **Gradle 安全规则**: [rules/gradle-script.md](rules/gradle-script.md)
  - 任务注入检测 (GRV-008)
  - 不安全 HTTP (GRV-010)
  - 插件安全风险 (GRV-011)
  - 构建脚本注入 (GRV-012)
  - 敏感信息泄露 (GRV-013)
  - 不安全依赖配置 (GRV-014)

### Grails 框架专项

- **Grails 安全规则**: [rules/grails-security.md](rules/grails-security.md)
  - 命令注入检测 (GRV-015)
  - GORM 注入检测 (GRV-016)
  - GSP XSS 检测 (GRV-017)
  - 不安全数据绑定 (GRV-018)
  - 会话安全问题 (GRV-019)
  - URL 重定向漏洞 (GRV-020)

### Spock 测试专项

- **Spock 测试安全规则**: [rules/spock-testing.md](rules/spock-testing.md)
  - 测试数据泄露 (GRV-021)
  - 不安全 Mock 配置 (GRV-022)
  - 测试环境污染 (GRV-023)
  - 敏感断言暴露 (GRV-024)
  - 外部依赖风险 (GRV-025)

---

## 检测优先级

### 第一优先级（严重）

1. GRV-001 动态代码执行
2. GRV-002 命令注入
3. GRV-004 不安全反序列化
4. GRV-008 Gradle 任务注入
5. GRV-012 构建脚本注入
6. GRV-013 敏感信息泄露
7. GRV-015 Grails 命令注入
8. GRV-016 GORM 注入

### 第二优先级（高危）

1. GRV-003 GString 注入
2. GRV-005 元编程滥用
3. GRV-010 不安全 HTTP
4. GRV-011 插件安全风险
5. GRV-014 不安全依赖配置
6. GRV-017 GSP XSS
7. GRV-018 不安全数据绑定
8. GRV-019 会话安全问题
9. GRV-020 URL 重定向漏洞
10. GRV-021 测试数据泄露
11. GRV-024 敏感断言暴露
12. GRV-025 外部依赖风险

### 第三优先级（中危）

1. GRV-022 不安全 Mock 配置
2. GRV-023 测试环境污染

---

## 文件识别

| 文件类型 | 识别模式 | 适用规则 |
|---------|---------|---------|
| Groovy 脚本 | `*.groovy` | 全部通用规则 |
| Gradle 脚本 | `*.gradle`, `build.gradle`, `settings.gradle` | Gradle 专项 |
| Gradle Kotlin DSL | `*.gradle.kts` | Gradle 专项 |
| Grails 控制器 | `*Controller.groovy` | Grails 专项 |
| Grails 服务 | `*Service.groovy` | Grails 专项 |
| GSP 视图 | `*.gsp` | Grails GSP 规则 |
| Spock 测试 | `*Spec.groovy`, `*Test.groovy` | Spock 专项 |

---

## Groovy 特有风险说明

### 为什么 Groovy 需要特别关注安全

1. **动态语言特性**: `Eval.me()`, `GroovyShell.evaluate()` 可执行任意代码
2. **便捷的命令执行**: `"cmd".execute()` 语法使命令注入更容易
3. **元编程能力**: `invokeMethod`, `methodMissing` 可被恶意利用
4. **GString 插值**: `"${expr}"` 中的表达式可能被注入
5. **构建工具环境**: Gradle 构建脚本中安全风险更高
6. **Web 框架环境**: Grails 应用面临 Web 安全威胁

### 与 Java 的主要区别

| 特性 | Java | Groovy | 安全影响 |
|------|------|--------|---------|
| 命令执行 | `Runtime.exec()` | `"cmd".execute()` | Groovy 更易被利用 |
| 动态执行 | 需要反射 | `Eval.me()` | Groovy 风险更高 |
| 字符串插值 | 无 | `"${expr}"` | Groovy 有注入风险 |
| 元编程 | 有限 | 强大 | Groovy 攻击面更大 |

---

## 场景适用指南

| 项目类型 | 适用规则文件 |
|---------|-------------|
| 纯 Groovy 脚本 | dynamic-execution, command-injection, gstring-injection |
| Gradle 构建项目 | gradle-script |
| Grails Web 应用 | grails-security + 通用规则 |
| Spock 测试项目 | spock-testing |
| 混合项目 | 根据文件类型选择对应规则 |

---

**版本**: 2.0.0  
**更新时间**: 2025-12-22
