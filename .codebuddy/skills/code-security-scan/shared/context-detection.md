# 上下文检测

本文档定义 `code-security-scan` 技能的输入分析和语言路由机制。

## 输入类型识别

| 输入类型 | 识别特征 | 处理方式 |
|---------|---------|---------|
| **code-file** | 单个文件路径 `.java/.go/.ts/.groovy/.py/.sql` | 直接扫描 |
| **code-directory** | 目录路径 | 递归扫描 |
| **code-snippet** | 无路径的代码块 | 语言检测后扫描 |
| **git-diff** | `git diff` 输出或 `@@ -x,y +a,b @@` 格式 | 增量扫描 |
| **natural-language** | 口语化描述 | 解析意图后扫描 |

---

## 语言路由表

| 语言 | 文件后缀 | 规则模块 | 规则数 |
|------|---------|---------|--------|
| **Java** | `.java` | [java/](../java/) | 31 |
| **Go** | `.go` | [go/](../go/) | 19 |
| **TypeScript** | `.ts/.tsx/.js/.jsx` | [typescript/](../typescript/) | 16 |
| **Groovy** | `.groovy/.gradle` | [groovy/](../groovy/) | 22 |
| **Python** | `.py` | [python/](../python/) | 16 |
| **SQL** | `.sql` | [mysql/](../mysql/) | 10 |

---

## 语言检测规则

### 文件后缀检测

```yaml
extension_mapping:
  java: [".java"]
  go: [".go"]
  typescript: [".ts", ".tsx", ".js", ".jsx"]
  groovy: [".groovy", ".gradle"]
  python: [".py"]
  sql: [".sql"]
  
special_files:
  groovy:
    - "build.gradle"
    - "settings.gradle"
```

### 代码片段语言检测

```yaml
snippet_detection:
  java:
    patterns:
      - "public class"
      - "import java."
      - "@Controller"
      - "@Service"
      - "@Repository"
  
  go:
    patterns:
      - "package main"
      - "func main()"
      - "import ("
      - "type .* struct"
  
  typescript:
    patterns:
      - "interface "
      - "type .* ="
      - "export default"
      - "import .* from"
  
  groovy:
    patterns:
      - "def "
      - "task "
      - "plugins {"
      - "dependencies {"
      - "class .* extends"
  
  python:
    patterns:
      - "def "
      - "import "
      - "class .*:"
      - "if __name__"
  
  sql:
    patterns:
      - "SELECT "
      - "CREATE TABLE"
      - "INSERT INTO"
      - "UPDATE .* SET"
```

---

## 自然语言意图解析

### 语言关键词映射

```yaml
language_keywords:
  java:
    - "Java"
    - "Spring"
    - "SpringBoot"
    - "MyBatis"
    - "JPA"
    - "Hibernate"
  
  groovy:
    - "Groovy"
    - "Gradle"
    - "Grails"
    - "Spock"
  
  go:
    - "Go"
    - "Golang"
    - "Gin"
    - "Echo"
    - "GORM"
  
  typescript:
    - "TypeScript"
    - "JavaScript"
    - "React"
    - "Vue"
    - "Angular"
    - "Node"
  
  python:
    - "Python"
    - "Django"
    - "Flask"
    - "FastAPI"
  
  sql:
    - "SQL"
    - "MySQL"
    - "PostgreSQL"
    - "数据库"
```

### 扫描类型关键词

```yaml
scan_type_keywords:
  sql_injection:
    - "SQL注入"
    - "SQL injection"
    - "注入漏洞"
  
  xss:
    - "XSS"
    - "跨站脚本"
    - "cross-site scripting"
  
  sensitive_data:
    - "敏感信息"
    - "密码泄露"
    - "Token泄露"
  
  auth:
    - "权限"
    - "认证"
    - "授权"
    - "越权"
  
  crypto:
    - "加密"
    - "密码学"
    - "MD5"
    - "SHA1"
  
  file:
    - "文件"
    - "上传"
    - "路径遍历"
  
  gradle:
    - "Gradle"
    - "构建"
    - "build"
```

---

## 扫描范围确定

### 目录扫描优先级

| 优先级 | 目录模式 | 说明 |
|--------|---------|------|
| **P0** | `**/controller/**`, `**/api/**` | 入口层 |
| **P1** | `**/service/**`, `**/manager/**` | 业务层 |
| **P2** | `**/repository/**`, `**/dao/**`, `**/mapper/**` | 数据层 |
| **P3** | `**/utils/**`, `**/helper/**`, `**/common/**` | 工具层 |
| **P4** | `**/dto/**`, `**/vo/**`, `**/entity/**` | 数据对象 |

### 文件排除规则

```yaml
excluded_patterns:
  directories:
    - "**/test/**"
    - "**/tests/**"
    - "**/__tests__/**"
    - "**/node_modules/**"
    - "**/vendor/**"
    - "**/target/**"
    - "**/build/**"
    - "**/dist/**"
    - "**/.git/**"
  
  files:
    - "**/*Test.java"
    - "**/*Spec.groovy"
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/*_test.go"
    - "**/test_*.py"
```

---

## 混合语言项目处理

### 多语言检测

```yaml
multi_language_detection:
  strategy: scan_all_detected
  
  project_patterns:
    spring_boot_vue:
      backend: ["src/main/java/**"]
      frontend: ["src/main/resources/static/**", "frontend/**"]
    
    go_react:
      backend: ["**/*.go"]
      frontend: ["web/**/*.ts", "web/**/*.tsx"]
    
    python_angular:
      backend: ["**/*.py"]
      frontend: ["frontend/**/*.ts"]
```

### 路由决策流程

```
输入分析
    │
    ├─ 文件路径? ─────────────────────────────────────┐
    │      │                                          │
    │      ├─ 单文件 → 检测后缀 → 路由到对应语言模块    │
    │      │                                          │
    │      └─ 目录 → 扫描所有文件 → 按语言分组路由      │
    │                                                 │
    ├─ 代码片段? → 语言检测 → 路由到对应语言模块        │
    │                                                 │
    ├─ Git Diff? → 解析变更文件 → 按语言分组路由        │
    │                                                 │
    └─ 自然语言? → 意图解析 → 确定语言和扫描类型        │
                                                      │
                                                      ▼
                                              加载对应规则模块
```

---

## 检查点 1 验证清单

```yaml
checkpoint_1_validation:
  输入识别:
    - [ ] 输入类型已正确识别
    - [ ] 目标语言已确定
    - [ ] 扫描范围已明确（文件列表）
  
  规则加载:
    - [ ] 对应语言规则模块已加载
    - [ ] 规则数量 > 0
    - [ ] 特殊文件已识别（如 build.gradle）
  
  排除确认:
    - [ ] 测试文件已排除
    - [ ] 生成文件已排除
    - [ ] 依赖目录已排除
```

---

**版本**: 1.3.0  
**更新时间**: 2025-12-22
