# 代码分析参考

## 分析模式速查

| 模式 | 适用场景 | 重点 | 时间 |
|------|---------|------|------|
| **单文件深度分析** | 分析单个文件的实现细节 | 功能、逻辑、问题 | 20-30分钟 |
| **项目架构分析** | 分析整个项目的架构设计 | 架构、模块、依赖 | 1-2小时 |
| **代码质量审查** | 系统化的质量检查 | 规范、复杂度、测试 | 30-60分钟 |
| **性能瓶颈识别** | 识别性能问题 | DB查询、循环、内存 | 30-60分钟 |
| **安全漏洞检测** | 识别安全隐患 | 注入、权限、加密 | 30-60分钟 |

---

## 问题分级标准

### 【严重】立即修复
- 影响功能: 阻塞性缺陷、核心功能故障
- 影响安全: SQL注入、XSS攻击、权限漏洞
- 影响性能: N+1查询、全表扫描、内存泄漏

### 【重要】计划修复
- 影响质量: 代码重复、复杂度过高、缺少测试
- 影响维护: 缺少文档、命名不规范、架构不合理

### 【一般】逐步改进
- 影响体验: 代码可读性、注释完整性
- 影响扩展: 硬编码、耦合度高

---

## 技术债务评估矩阵

| 影响程度 | 修复难度 | 优先级 | 建议 |
|---------|---------|--------|------|
| 高 | 低 | P0 | 立即修复 |
| 高 | 中 | P1 | 计划修复 |
| 高 | 高 | P1 | 分阶段重构 |
| 中 | 低 | P2 | 逐步改进 |
| 中 | 中 | P2 | 计划改进 |
| 低 | 低 | P3 | 有空再做 |

---

## 常见性能问题模式

### 1. N+1 查询问题

**症状**: 循环中执行数据库查询

**识别**:
```java
// ❌ N+1 查询
for (User user : users) {
    List<Order> orders = orderMapper.selectByUserId(user.getId());
}
```

**修复**:
```java
// ✅ 批量查询
List<Long> userIds = users.stream().map(User::getId).collect(Collectors.toList());
List<Order> orders = orderMapper.selectByUserIds(userIds);
Map<Long, List<Order>> orderMap = orders.stream()
    .collect(Collectors.groupingBy(Order::getUserId));
```

### 2. 缺少分页

**症状**: 查询所有数据不分页

**识别**:
```java
// ❌ 不分页
@GetMapping
public List<User> getAllUsers() {
    return userService.list();
}
```

**修复**:
```java
// ✅ 分页
@GetMapping
public IPage<User> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size) {
    Page<User> pageParam = new Page<>(page, size);
    return userService.page(pageParam);
}
```

### 3. 缺少索引

**症状**: 全表扫描、查询缓慢

**识别**: 分析慢查询日志

**修复**: 添加索引
```sql
-- 添加单列索引
CREATE INDEX idx_user_email ON user(email);

-- 添加联合索引
CREATE INDEX idx_order_user_status ON `order`(user_id, status);
```

---

## 常见安全问题模式

### 1. SQL 注入

**症状**: 直接拼接 SQL

**识别**:
```java
// ❌ SQL 注入
String sql = "SELECT * FROM user WHERE name = '" + name + "'";
```

**修复**:
```java
// ✅ 参数化查询
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.eq(User::getName, name);
```

### 2. XSS 攻击

**症状**: 未对用户输入进行转义

**修复**:
- 使用模板引擎自动转义（Thymeleaf、Vue）
- 后端返回前进行 HTML 转义
- 使用 Content Security Policy (CSP)

### 3. 权限控制缺失

**症状**: 未检查用户权限

**修复**:
```java
// ✅ 添加权限检查
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public void deleteUser(@PathVariable Long id) {
    userService.removeById(id);
}
```

---

## 代码质量评分标准

| 维度 | 优秀 (5分) | 良好 (4分) | 一般 (3分) | 较差 (2分) | 很差 (1分) |
|------|-----------|-----------|-----------|-----------|-----------|
| **命名规范** | >99% | 95-99% | 90-95% | 80-90% | <80% |
| **复杂度** | 所有方法<10 | >90%<10 | >80%<10 | >70%<10 | <70%<10 |
| **重复代码** | <1% | 1-3% | 3-5% | 5-10% | >10% |
| **测试覆盖率** | >90% | 80-90% | 70-80% | 60-70% | <60% |
| **安全性** | 无漏洞 | 轻微风险 | 中等风险 | 高风险 | 严重漏洞 |

---

## 分析报告模板速查

### 单文件分析报告
```markdown
# 代码分析报告 - [文件名]

## 基本信息
- 文件路径、编程语言、主要功能

## 功能实现分析
- 核心功能、处理流程、关键方法

## 代码质量评估
| 维度 | 评分 | 说明 |

## 潜在问题识别
### 【严重】
### 【重要】
### 【一般】

## 优化建议
```

### 项目架构分析报告
```markdown
# 项目架构分析报告 - [项目名]

## 项目概述
- 项目名称、类型、功能、技术栈、规模

## 架构设计分析
- 整体架构、模块划分、设计模式

## 依赖关系分析
- 依赖关系图、循环依赖

## 技术债务评估
| 债务类型 | 严重程度 | 修复难度 | 优先级 |

## 改进建议
```

---

## 相关文档

- [Spring Boot 3](mdc:global/knowledge/stack/springboot3.md)
- [MyBatis-Plus](mdc:global/knowledge/stack/mybatis_plus.md)
- [Vue 3](mdc:global/knowledge/stack/vue3.md)
- [技术栈索引](mdc:global/knowledge/stack/index.md)
