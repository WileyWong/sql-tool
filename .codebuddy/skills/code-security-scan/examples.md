# 安全扫描使用示例

本文档提供 `code-security-scan` 技能的完整使用示例。

## 示例 1: 扫描单个文件

### 场景
开发完成 `UserService.java`，需要检查是否存在安全问题。

### 输入
```
扫描 UserService.java 的安全问题
```

### 执行过程

**步骤 1**: 读取文件
```
使用 read_file 读取: src/main/java/com/example/user/UserService.java
```

**步骤 2**: 应用检测规则
- SQL 注入检测
- 敏感信息泄露检测
- 不安全加密检测
- 权限控制检测

**步骤 3**: 识别问题

识别到 3 个安全问题：
1. **SQL-001**: 第 45 行存在 SQL 注入（字符串拼接）
2. **LEAK-001**: 第 89 行日志打印密码
3. **CRYPTO-001**: 第 123 行使用 MD5 加密

### 输出报告

```markdown
# UserService.java 安全扫描结果

**文件**: src/main/java/com/example/user/UserService.java  
**扫描时间**: 2025-12-08 14:30:25  
**问题数**: 3

## 问题列表

### 🔴 SQL-001: SQL 注入漏洞 (行 45-47)

**问题代码**:
```java
45: String sql = "SELECT * FROM users WHERE username = '" + username + "'";
46: List<User> users = jdbcTemplate.query(sql, new UserRowMapper());
47: return users.isEmpty() ? null : users.get(0);
```

**风险描述**:
使用字符串拼接构造 SQL 查询，攻击者可通过输入 `admin' OR '1'='1` 绕过认证。

**修复建议**:
```java
// ✅ 使用 PreparedStatement
String sql = "SELECT * FROM users WHERE username = ?";
List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), username);
```

---

### 🟠 LEAK-001: 日志打印敏感信息 (行 89)

**问题代码**:
```java
89: log.info("用户登录成功: {}", user);
```

**风险描述**:
User 对象的 `toString()` 方法可能包含密码字段，导致密码泄露到日志。

**修复建议**:
```java
// ✅ 方案 1: 使用 DTO
log.info("用户登录成功: {}", userConverter.toDTO(user));

// ✅ 方案 2: 重写 toString() 进行脱敏
@Override
public String toString() {
    return "User{id=" + id + ", username=" + username + ", password=***}";
}
```

---

### 🟡 CRYPTO-001: 使用不安全的加密算法 (行 123)

**问题代码**:
```java
123: String hashedPassword = DigestUtils.md5Hex(password);
```

**风险描述**:
MD5 已被证明不安全，存在碰撞攻击风险，不适合用于密码加密。

**修复建议**:
```java
// ✅ 使用 BCrypt
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode(password);
```
```

---

## 示例 2: 扫描整个模块

### 场景
开发完成用户管理模块，需要全面检查安全问题。

### 输入
```
扫描 user 模块的所有安全问题
```

### 执行过程

**步骤 1**: 列出所有文件
```
使用 list_files 扫描: src/main/java/com/example/user/
发现文件:
- UserController.java
- UserService.java
- UserRepository.java
- UserDTO.java
- UserConverter.java
```

**步骤 2**: 逐个文件应用规则

对每个文件应用所有 35 条安全检测规则。

**步骤 3**: 汇总问题

汇总发现 12 个安全问题：
- UserController.java: 5 个问题
- UserService.java: 3 个问题
- UserRepository.java: 2 个问题
- UserConverter.java: 2 个问题

### 输出报告

```markdown
# User 模块安全扫描报告

**扫描时间**: 2025-12-08 15:20:15  
**扫描范围**: src/main/java/com/example/user/  
**扫描文件数**: 5  
**问题数**: 12

## 📊 风险统计

| 风险等级 | 数量 | 占比 |
|---------|------|------|
| 🔴 严重 | 2 | 17% |
| 🟠 高危 | 6 | 50% |
| 🟡 中危 | 3 | 25% |
| 🟢 低危 | 1 | 8% |

## 问题分类

| 类别 | 数量 |
|------|------|
| SQL 注入 | 2 |
| XSS | 1 |
| 敏感信息泄露 | 3 |
| 不安全加密 | 2 |
| 权限控制缺失 | 3 |
| 配置问题 | 1 |

## 🔴 严重风险

### SQL-001: SQL 注入 (UserService.java:45)
[详细内容]

### SQL-002: SQL 注入 (UserRepository.java:78)
[详细内容]

## 🟠 高危风险

### XSS-001: 未转义输入 (UserController.java:56)
[详细内容]

### AUTH-001: 缺少权限注解 (UserController.java:89)
[详细内容]

[其他问题...]

## ✅ 修复优先级

### 第一优先级 (立即修复)
- [ ] SQL-001: UserService.java:45
- [ ] SQL-002: UserRepository.java:78

### 第二优先级 (本周内)
- [ ] AUTH-001: UserController.java:89
- [ ] XSS-001: UserController.java:56
- [ ] LEAK-001: UserService.java:112

### 第三优先级 (下个迭代)
- [ ] CRYPTO-001: UserService.java:145
- [ ] CONFIG-001: application.yml
```

---

## 示例 3: 专项扫描（SQL 注入）

### 场景
怀疑项目中存在 SQL 注入漏洞，需要全面检查。

### 输入
```
检查项目中是否存在 SQL 注入风险
```

### 执行过程

**步骤 1**: 搜索 SQL 注入特征

使用 `search_content` 搜索：
- 正则模式: `".*SELECT.*\\+.*"`
- 正则模式: `".*WHERE.*\\+.*"`
- MyBatis 模式: `\\$\\{`

**步骤 2**: 对匹配文件深度分析

发现 8 个可疑文件，逐个应用 SQL 注入检测规则。

**步骤 3**: 生成专项报告

### 输出报告

```markdown
# SQL 注入风险专项扫描报告

**扫描时间**: 2025-12-08 16:10:30  
**扫描类型**: SQL 注入专项  
**可疑文件数**: 8  
**确认漏洞数**: 5

## 📊 漏洞分布

| 服务 | 漏洞数 | 最高风险 |
|------|--------|---------|
| user-service | 2 | 🔴 严重 |
| order-service | 2 | 🔴 严重 |
| product-service | 1 | 🔴 严重 |

## 🔴 SQL 注入漏洞详情

### SQL-001: 用户查询 SQL 注入
**文件**: user-service/UserService.java:45  
**类型**: 字符串拼接  
[详细内容]

### SQL-002: 订单查询 SQL 注入
**文件**: order-service/OrderService.java:123  
**类型**: 字符串拼接  
[详细内容]

### SQL-003: MyBatis 动态 SQL
**文件**: order-service/OrderMapper.java:67  
**类型**: ${} 语法  
[详细内容]

### SQL-004: JDBC Statement
**文件**: product-service/ProductRepository.java:89  
**类型**: Statement 拼接  
[详细内容]

### SQL-005: 复杂查询拼接
**文件**: user-service/UserQueryService.java:234  
**类型**: StringBuilder 拼接  
[详细内容]

## 🛠️ 统一修复方案

### 方案 1: Spring JdbcTemplate
```java
// ❌ 错误
String sql = "SELECT * FROM users WHERE id = " + userId;
List<User> users = jdbcTemplate.query(sql, mapper);

// ✅ 正确
String sql = "SELECT * FROM users WHERE id = ?";
List<User> users = jdbcTemplate.query(sql, mapper, userId);
```

### 方案 2: MyBatis 参数化
```java
// ❌ 错误
@Select("SELECT * FROM users WHERE id = ${userId}")

// ✅ 正确
@Select("SELECT * FROM users WHERE id = #{userId}")
```

### 方案 3: JPA/Hibernate
```java
// ❌ 错误
String jpql = "SELECT u FROM User u WHERE u.id = " + userId;

// ✅ 正确
@Query("SELECT u FROM User u WHERE u.id = :userId")
User findById(@Param("userId") Long userId);
```

## 📋 修复检查清单

- [ ] 所有 SQL 拼接改为参数化查询
- [ ] MyBatis 所有 ${} 改为 #{}
- [ ] JDBC Statement 改为 PreparedStatement
- [ ] 代码评审确认修复正确性
- [ ] 重新运行安全扫描验证
```

---

## 示例 4: 集成到 CI/CD

### 场景
在 Git 提交前自动运行安全扫描。

### 配置 Git Hook

**pre-commit 钩子**:
```bash
#!/bin/bash

echo "运行安全扫描..."

# 获取修改的 Java 文件
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.java$')

if [ -z "$CHANGED_FILES" ]; then
    echo "没有 Java 文件修改，跳过安全扫描"
    exit 0
fi

# 调用 AI 扫描（示例命令）
for file in $CHANGED_FILES; do
    echo "扫描文件: $file"
    # 实际集成时调用 CodeBuddy API 或 CLI
    # codebuddy scan-security "$file"
done

echo "安全扫描完成"
```

### 输出示例

```
运行安全扫描...
扫描文件: src/main/java/com/example/user/UserService.java
  ⚠️ 发现 1 个严重漏洞: SQL 注入 (第 45 行)
  ⚠️ 发现 1 个高危漏洞: 日志打印密码 (第 89 行)

❌ 安全扫描失败！请修复严重漏洞后再提交。

详细报告: workspace/scan/scan-20251208-161030.md
```

---

## 最佳实践建议

### 1. 定期全量扫描
- 每周运行一次全项目扫描
- 跟踪历史趋势，评估安全改善

### 2. 增量扫描
- Git 提交前扫描修改的文件
- Pull Request 时自动运行扫描

### 3. 优先级管理
- 严重和高危问题必须立即修复
- 中危问题在迭代内修复
- 低危问题按优先级排期

### 4. 团队培训
- 定期分享扫描报告
- 培训常见安全问题和修复方法
- 建立安全编码规范

---

**版本**: 1.0.0  
**更新时间**: 2025-12-08
