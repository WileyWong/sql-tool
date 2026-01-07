# Go SQL 注入检测规则

## 规则概述

| 规则ID | GO-001 |
|--------|--------|
| 名称 | SQL 注入 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-89 |

---

## 检测模式

### 1. 字符串拼接 SQL

**危险模式**:
```go
// ❌ 危险：字符串拼接
query := "SELECT * FROM users WHERE id = " + userID
query := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", name)
query := "SELECT * FROM users WHERE id = " + strconv.Itoa(id)
```

**检测正则**:
```regex
(fmt\.Sprintf|fmt\.Sprint)\s*\(\s*["'].*?(SELECT|INSERT|UPDATE|DELETE|WHERE).*?%[sdv]
["'].*?(SELECT|INSERT|UPDATE|DELETE|WHERE).*?\s*\+\s*
```

**安全写法**:
```go
// ✅ 安全：参数化查询
query := "SELECT * FROM users WHERE id = ?"
db.Query(query, userID)

// ✅ 安全：使用 sqlx
db.Get(&user, "SELECT * FROM users WHERE id = $1", userID)
```

---

### 2. database/sql 不安全使用

**危险模式**:
```go
// ❌ 危险：直接执行拼接 SQL
db.Query("SELECT * FROM users WHERE name = '" + name + "'")
db.Exec("DELETE FROM users WHERE id = " + id)
db.QueryRow("SELECT * FROM users WHERE email = '" + email + "'")
```

**检测正则**:
```regex
db\.(Query|Exec|QueryRow)\s*\(\s*["'].*?\s*\+
db\.(Query|Exec|QueryRow)\s*\(\s*fmt\.Sprintf
```

**安全写法**:
```go
// ✅ 安全：使用占位符
db.Query("SELECT * FROM users WHERE name = ?", name)
db.Exec("DELETE FROM users WHERE id = ?", id)
db.QueryRow("SELECT * FROM users WHERE email = ?", email)
```

---

### 3. GORM 不安全使用

**危险模式**:
```go
// ❌ 危险：Raw SQL 拼接
db.Raw("SELECT * FROM users WHERE name = '" + name + "'").Scan(&users)
db.Exec("UPDATE users SET status = 1 WHERE id = " + id)
db.Where("name = '" + name + "'").Find(&users)
```

**检测正则**:
```regex
\.Raw\s*\(\s*["'].*?\s*\+
\.Raw\s*\(\s*fmt\.Sprintf
\.Where\s*\(\s*["'].*?\s*\+
\.Where\s*\(\s*fmt\.Sprintf.*?%[sdv]
```

**安全写法**:
```go
// ✅ 安全：GORM 参数化
db.Raw("SELECT * FROM users WHERE name = ?", name).Scan(&users)
db.Where("name = ?", name).Find(&users)
db.Where(User{Name: name}).Find(&users)
```

---

### 4. sqlx 不安全使用

**危险模式**:
```go
// ❌ 危险：拼接查询
db.Select(&users, "SELECT * FROM users WHERE name = '"+name+"'")
db.NamedExec("INSERT INTO users (name) VALUES ('"+name+"')", map[string]interface{}{})
```

**安全写法**:
```go
// ✅ 安全：使用命名参数
db.Select(&users, "SELECT * FROM users WHERE name = ?", name)
db.NamedExec("INSERT INTO users (name) VALUES (:name)", map[string]interface{}{"name": name})
```

---

## 修复建议

### 通用原则

1. **始终使用参数化查询**
2. **使用 ORM 的安全 API**
3. **输入验证和白名单**
4. **最小权限原则**

### 修复示例

```go
// 修复前
func GetUser(name string) (*User, error) {
    query := fmt.Sprintf("SELECT * FROM users WHERE name = '%s'", name)
    return db.Query(query)
}

// 修复后
func GetUser(name string) (*User, error) {
    query := "SELECT * FROM users WHERE name = ?"
    return db.Query(query, name)
}
```

---

## 参考资源

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [Go database/sql 文档](https://pkg.go.dev/database/sql)
- [GORM 安全指南](https://gorm.io/docs/security.html)
