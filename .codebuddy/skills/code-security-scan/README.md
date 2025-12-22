# 🔒 代码安全漏洞扫描技能

> 自动化代码安全漏洞检测工具，帮助团队在开发阶段及早发现和修复安全问题。

## 🎯 核心价值

### 为什么需要安全扫描？

- **防患于未然**: 在代码提交前发现安全漏洞，避免线上事故
- **降低成本**: 开发阶段修复成本远低于生产环境
- **提升质量**: 建立安全编码规范，提高团队安全意识
- **合规要求**: 满足企业安全审计和合规要求

### 能检测什么？

本技能提供 **8 大维度 35+ 条检测规则**：

| 维度 | 检测内容 | 风险示例 |
|------|---------|---------|
| 🔴 SQL 注入 | 字符串拼接、MyBatis ${}、JDBC Statement | `"SELECT * FROM users WHERE id = " + userId` |
| 🟠 XSS 攻击 | 未转义输入、innerHTML | `return "<div>" + userInput + "</div>"` |
| 🟠 敏感信息泄露 | 日志打印密码、响应暴露敏感字段 | `log.info("密码: {}", password)` |
| 🟠 不安全加密 | MD5/SHA1、DES、硬编码密钥 | `DigestUtils.md5Hex(password)` |
| 🟠 权限控制 | 缺少权限注解、越权风险 | 管理接口缺少 `@PreAuthorize` |
| 🔴 文件操作 | 路径遍历、任意文件读取 | `new File("/uploads/" + filename)` |
| 🟡 反序列化 | 不可信数据、Fastjson 配置 | `ObjectInputStream` 反序列化用户输入 |
| 🟡 配置安全 | Debug 模式、CORS 宽松 | `debug: true` 生产环境开启 |

## 🚀 快速开始

### 1. 扫描单个文件

```
扫描 UserService.java 的安全问题
```

**输出**: 该文件的安全问题清单 + 修复建议

### 2. 扫描整个模块

```
扫描 user 模块的所有安全问题
```

**输出**: 模块级别的安全扫描报告 + 风险统计

### 3. 专项检查

```
检查项目中是否存在 SQL 注入风险
```

**输出**: SQL 注入专项报告 + 统一修复方案

## 📊 扫描报告示例

```markdown
# 安全扫描报告

**扫描范围**: src/main/java/com/example/user/
**问题数**: 12 个
**风险分布**: 🔴 2 | 🟠 6 | 🟡 3 | 🟢 1

## 🔴 严重风险 (立即修复)

### SQL-001: SQL 注入漏洞
**文件**: UserService.java:45
**代码**: 
```java
String sql = "SELECT * FROM users WHERE id = " + userId;
```
**风险**: 攻击者可通过构造特殊输入窃取数据或绕过认证
**修复**:
```java
String sql = "SELECT * FROM users WHERE id = ?";
List<User> users = jdbcTemplate.query(sql, mapper, userId);
```

## 修复优先级
- [ ] 🔴 SQL-001: UserService.java:45 (立即)
- [ ] 🔴 FILE-001: FileController.java:32 (立即)
- [ ] 🟠 AUTH-001: AdminController.java:23 (本周)
```

## 📚 完整文档

- **[SKILL.md](SKILL.md)** - 完整的技能说明和使用指南
- **[security-rules.md](security-rules.md)** - 35+ 条安全检测规则详解
- **[examples.md](examples.md)** - 4 个完整的使用示例

## 🎓 学习路径

### 新手入门
1. 阅读 [SKILL.md](SKILL.md) 的"扫描能力"部分，了解可以检测哪些问题
2. 参考 [examples.md](examples.md) 的"示例 1"，尝试扫描单个文件
3. 学习报告中的"修复建议"，理解如何修复安全问题

### 进阶使用
1. 阅读 [security-rules.md](security-rules.md)，深入理解检测规则
2. 参考"示例 3"，进行专项安全检查
3. 将扫描集成到 CI/CD 流程（参考"示例 4"）

### 团队推广
1. 定期运行全项目扫描，跟踪安全趋势
2. 在团队内分享扫描报告，提升安全意识
3. 建立安全编码规范，预防常见问题

## 💡 最佳实践

### ✅ 推荐做法

- **定期扫描**: 每周运行一次全项目扫描
- **增量扫描**: Git 提交前扫描修改的文件
- **优先级管理**: 严重问题必须立即修复
- **团队培训**: 定期分享安全问题和修复方法

### ❌ 避免的做法

- 忽略扫描结果，不修复问题
- 只在上线前扫描，发现问题再修复
- 不理解修复建议，盲目修改代码
- 扫描报告不分享，团队缺乏安全意识

## 🔗 相关资源

### 安全标准
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web 应用十大安全风险
- [CWE Top 25](https://cwe.mitre.org/top25/) - 最危险的软件漏洞

### 安全工具
- [SpotBugs](https://spotbugs.github.io/) - Java 静态分析工具
- [SonarQube](https://www.sonarqube.org/) - 代码质量和安全平台

### 学习资源
- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/) - 安全编码速查表
- [Secure Coding Guidelines](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java) - Java 安全编码标准

## 🆘 常见问题

### Q: 扫描会不会有误报？
A: 本技能使用精确的模式匹配和代码分析，误报率很低。但建议人工确认严重问题。

### Q: 如何集成到 CI/CD？
A: 参考 [examples.md](examples.md) 的"示例 4"，配置 Git Hook 或 Jenkins 集成。

### Q: 扫描时间会很长吗？
A: 单文件扫描通常在秒级完成，全项目扫描取决于项目大小，通常在分钟级。

### Q: 修复建议可以直接使用吗？
A: 是的，所有修复建议都经过验证，可以直接应用。但建议理解原理后再修改。

---

**版本**: v1.0.0  
**创建时间**: 2025-12-08  
**维护团队**: Spec-Code Team

如有问题或建议，欢迎反馈！
