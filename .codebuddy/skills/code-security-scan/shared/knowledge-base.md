# 知识库集成

本文档定义 `code-security-scan` 技能的知识库集成机制。

## 知识库读取优先级

| 优先级 | 来源 | 获取方式 | 作用 |
|--------|------|---------|------|
| **1** | 用户指定 | 解析用户输入中的安全要求 | 特定扫描规则 |
| **2** | 项目宪章 | `.spec-code/memory/constitution.md` | 安全红线 |
| **3** | 安全策略 | `security-policy.md` / `security-whitelist.md` | 项目特定规则 |
| **4** | 技术上下文 | `.spec-code/memory/context.md` | 技术栈版本 |
| **5** | 默认配置 | 使用内置规则 | 通用安全规则 |

---

## 上下文获取流程

### 步骤 1: 检查用户指定

```yaml
user_specified:
  check: 用户输入中是否包含特定安全要求
  examples:
    - "只检查 SQL 注入"
    - "忽略 MD5 警告"
    - "扫描 Gradle 构建脚本安全"
  action: 提取并应用用户指定的规则
```

### 步骤 2: 读取项目宪章

```yaml
constitution:
  path: .spec-code/memory/constitution.md
  extract:
    - 安全红线（不可违反的安全要求）
    - 禁止的模式（如禁止使用 MD5）
    - 必须的安全措施（如必须使用参数化查询）
```

### 步骤 3: 读取安全策略

```yaml
security_policy:
  paths:
    - security-policy.md
    - .security/policy.md
    - docs/security-policy.md
  extract:
    - 项目特定的安全要求
    - 自定义检测规则
    - 风险等级调整
```

### 步骤 4: 读取白名单

```yaml
whitelist:
  paths:
    - security-whitelist.md
    - .security/whitelist.md
  extract:
    - 允许的例外模式
    - 已知的误报排除
    - 特定文件/行的忽略规则
```

### 步骤 5: 读取技术上下文

```yaml
context:
  path: .spec-code/memory/context.md
  extract:
    - 技术栈版本（Java 8/11/17, Spring Boot 2.x/3.x）
    - 框架信息（MyBatis/JPA/JDBC）
    - 项目架构（单体/微服务）
```

---

## 上下文应用规则

### 技术栈适配

| 技术栈 | 适配规则 |
|--------|---------|
| **Java 8** | 检查 `Optional` 使用、Lambda 安全 |
| **Java 11+** | 检查 `var` 类型推断安全 |
| **Java 17+** | 检查 Record 类型、密封类安全 |
| **Spring Boot 2.x** | 检查 `@PreAuthorize` 配置 |
| **Spring Boot 3.x** | 检查 Jakarta EE 迁移安全 |
| **MyBatis** | 检查 `${}` vs `#{}` 使用 |
| **JPA/Hibernate** | 检查 JPQL 注入风险 |

### 框架特定规则

```yaml
spring_security:
  enabled: true
  rules:
    - 检查 @PreAuthorize 注解
    - 检查 CORS 配置
    - 检查 CSRF 保护

mybatis:
  enabled: true
  rules:
    - 检查 ${} 动态 SQL
    - 检查 XML Mapper 安全

gradle:
  enabled: true
  rules:
    - 检查依赖版本
    - 检查插件安全
```

---

## 白名单配置格式

```yaml
# security-whitelist.md 示例

## 文件级忽略
ignored_files:
  - "**/test/**"
  - "**/generated/**"
  - "**/legacy/**"

## 规则级忽略
ignored_rules:
  - rule: CRYPTO-001
    reason: "项目使用 MD5 作为非密码用途的哈希"
    files:
      - "HashUtils.java"

## 行级忽略
ignored_lines:
  - file: "UserService.java"
    line: 45
    rule: SQL-001
    reason: "已通过其他方式验证输入"
```

---

## 历史扫描结果

### 增量扫描支持

```yaml
incremental_scan:
  enabled: true
  baseline_path: .security/scan-baseline.json
  compare_mode: git_diff | file_hash | timestamp
```

### 避免重复报告

```yaml
duplicate_detection:
  enabled: true
  match_by:
    - file_path
    - line_number
    - rule_id
  action: skip_if_unchanged | update_timestamp
```

---

## 检查点 0 验证清单

```yaml
checkpoint_0_validation:
  知识库读取:
    - [ ] 已尝试读取项目安全配置
    - [ ] 白名单规则已加载（如有）
    - [ ] 技术栈版本已确定
  
  配置确认:
    - [ ] 扫描规则集已确定
    - [ ] 忽略模式已配置
    - [ ] 框架特定规则已启用
```

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
