# SQL 注入检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| SQL-001 | 字符串拼接SQL | 🔴 严重 |
| SQL-002 | MyBatis ${} 动态SQL | 🔴 严重 |
| SQL-003 | JDBC Statement 拼接 | 🔴 严重 |

---

## SQL-001: 字符串拼接SQL

### 检测模式

```regex
".*SELECT.*" \+ .+
".*WHERE.*" \+ .+
".*INSERT.*" \+ .+
".*UPDATE.*" \+ .+
".*DELETE.*" \+ .+
```

### 危险代码示例

```java
// ❌ 危险模式 1: 直接拼接
String sql = "SELECT * FROM users WHERE id = " + userId;
String sql = "SELECT * FROM users WHERE name = '" + userName + "'";

// ❌ 危险模式 2: StringBuilder 拼接
StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE ");
sql.append("id = ").append(userId);

// ❌ 危险模式 3: String.format
String sql = String.format("SELECT * FROM users WHERE id = %s", userId);
```

### 安全代码示例

```java
// ✅ 安全模式 1: PreparedStatement
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setLong(1, userId);

// ✅ 安全模式 2: JdbcTemplate
String sql = "SELECT * FROM users WHERE id = ?";
List<User> users = jdbcTemplate.query(sql, new UserRowMapper(), userId);

// ✅ 安全模式 3: JPA/Hibernate
@Query("SELECT u FROM User u WHERE u.id = :userId")
User findById(@Param("userId") Long userId);
```

### 攻击示例

```
输入: userId = "1 OR 1=1"
生成SQL: SELECT * FROM users WHERE id = 1 OR 1=1
结果: 返回所有用户

输入: userName = "admin' OR '1'='1"
生成SQL: SELECT * FROM users WHERE name = 'admin' OR '1'='1'
结果: 绕过身份验证
```

---

## SQL-002: MyBatis ${} 动态SQL

### 检测模式

```regex
@Select.*\$\{.*\}
@Update.*\$\{.*\}
@Delete.*\$\{.*\}
@Insert.*\$\{.*\}
<select.*\$\{.*\}.*</select>
<update.*\$\{.*\}.*</update>
```

### 危险代码示例

```java
// ❌ 危险: 注解中使用 ${}
@Select("SELECT * FROM users WHERE id = ${userId}")
User findById(@Param("userId") Long userId);

@Select("SELECT * FROM ${tableName} WHERE id = #{id}")
Object findByTableAndId(@Param("tableName") String tableName, @Param("id") Long id);
```

```xml
<!-- ❌ 危险: XML 中使用 ${} -->
<select id="findByName" resultType="User">
    SELECT * FROM users WHERE name = '${name}'
</select>

<select id="findByColumn" resultType="User">
    SELECT * FROM users ORDER BY ${orderColumn}
</select>
```

### 安全代码示例

```java
// ✅ 安全: 使用 #{}
@Select("SELECT * FROM users WHERE id = #{userId}")
User findById(@Param("userId") Long userId);
```

```xml
<!-- ✅ 安全: 使用 #{} -->
<select id="findByName" resultType="User">
    SELECT * FROM users WHERE name = #{name}
</select>

<!-- ✅ 安全: 动态列名使用白名单 -->
<select id="findByColumn" resultType="User">
    SELECT * FROM users
    <choose>
        <when test="orderColumn == 'name'">ORDER BY name</when>
        <when test="orderColumn == 'age'">ORDER BY age</when>
        <otherwise>ORDER BY id</otherwise>
    </choose>
</select>
```

### ${} vs #{} 区别

| 语法 | 处理方式 | 安全性 |
|------|---------|--------|
| `${}` | 字符串替换（无转义） | ❌ 不安全 |
| `#{}` | 参数化查询（PreparedStatement） | ✅ 安全 |

---

## SQL-003: JDBC Statement 拼接

### 检测模式

```regex
Statement\s+\w+\s*=.*createStatement
stmt\.execute.*\+
stmt\.executeQuery.*\+
stmt\.executeUpdate.*\+
```

### 危险代码示例

```java
// ❌ 危险: Statement 拼接
Statement stmt = conn.createStatement();
String sql = "SELECT * FROM users WHERE id = " + userId;
ResultSet rs = stmt.executeQuery(sql);

// ❌ 危险: 动态表名
Statement stmt = conn.createStatement();
stmt.execute("DROP TABLE " + tableName);
```

### 安全代码示例

```java
// ✅ 安全: PreparedStatement
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setLong(1, userId);
ResultSet rs = pstmt.executeQuery();

// ✅ 安全: 动态表名使用白名单
Set<String> allowedTables = Set.of("users", "orders", "products");
if (!allowedTables.contains(tableName)) {
    throw new IllegalArgumentException("Invalid table name");
}
PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM " + tableName + " WHERE id = ?");
```

---

## 修复建议汇总

| 场景 | 推荐方案 |
|------|---------|
| JDBC 查询 | PreparedStatement |
| Spring JdbcTemplate | 参数化查询 `?` |
| MyBatis 注解 | `#{}` 语法 |
| MyBatis XML | `#{}` 语法 |
| JPA/Hibernate | `@Param` + `:paramName` |
| 动态列名/表名 | 白名单验证 |

---

## 参考资料

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html)
- [MyBatis 安全最佳实践](https://mybatis.org/mybatis-3/sqlmap-xml.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
