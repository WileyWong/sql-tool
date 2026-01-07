# MySQL 注入风险检测规则

## 规则概述

| 规则ID | SQL-001 |
|--------|---------|
| 名称 | SQL 注入风险 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-89 |

---

## 检测模式

### 1. 存储过程中的动态 SQL

**危险模式**:
```sql
-- ❌ 危险：使用 CONCAT 构建动态 SQL
DELIMITER //
CREATE PROCEDURE search_users(IN search_term VARCHAR(100))
BEGIN
    SET @sql = CONCAT('SELECT * FROM users WHERE name = "', search_term, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

-- ❌ 危险：直接拼接参数
CREATE PROCEDURE get_user(IN user_id VARCHAR(50))
BEGIN
    SET @query = CONCAT('SELECT * FROM users WHERE id = ', user_id);
    PREPARE stmt FROM @query;
    EXECUTE stmt;
END //
```

**检测正则**:
```regex
CONCAT\s*\(.*?SELECT.*?FROM
CONCAT\s*\(.*?WHERE.*?=.*?['"]?\s*,
SET\s+@\w+\s*=\s*CONCAT\s*\(
```

**安全写法**:
```sql
-- ✅ 安全：使用参数化查询
DELIMITER //
CREATE PROCEDURE search_users(IN search_term VARCHAR(100))
BEGIN
    SELECT * FROM users WHERE name = search_term;
END //

-- ✅ 安全：使用 USING 传递参数
CREATE PROCEDURE get_user(IN p_user_id INT)
BEGIN
    SET @sql = 'SELECT * FROM users WHERE id = ?';
    SET @id = p_user_id;
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @id;
    DEALLOCATE PREPARE stmt;
END //
```

---

### 2. 动态表名/列名

**危险模式**:
```sql
-- ❌ 危险：动态表名未验证
CREATE PROCEDURE query_table(IN table_name VARCHAR(64))
BEGIN
    SET @sql = CONCAT('SELECT * FROM ', table_name);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END //

-- ❌ 危险：动态列名
CREATE PROCEDURE sort_users(IN sort_column VARCHAR(64))
BEGIN
    SET @sql = CONCAT('SELECT * FROM users ORDER BY ', sort_column);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END //
```

**安全写法**:
```sql
-- ✅ 安全：白名单验证表名
DELIMITER //
CREATE PROCEDURE query_table(IN table_name VARCHAR(64))
BEGIN
    -- 白名单验证
    IF table_name NOT IN ('users', 'orders', 'products') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid table name';
    END IF;
    
    SET @sql = CONCAT('SELECT * FROM `', table_name, '`');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END //

-- ✅ 安全：使用 CASE 限制排序列
CREATE PROCEDURE sort_users(IN sort_column VARCHAR(64))
BEGIN
    SELECT * FROM users 
    ORDER BY 
        CASE sort_column
            WHEN 'name' THEN name
            WHEN 'email' THEN email
            WHEN 'created_at' THEN created_at
            ELSE id
        END;
END //
```

---

### 3. 触发器中的不安全操作

**危险模式**:
```sql
-- ❌ 危险：触发器中使用动态 SQL
CREATE TRIGGER audit_log AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    SET @sql = CONCAT('INSERT INTO audit_log VALUES ("', NEW.name, '")');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END //
```

**安全写法**:
```sql
-- ✅ 安全：直接使用参数
CREATE TRIGGER audit_log AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_name, action, created_at)
    VALUES (NEW.name, 'UPDATE', NOW());
END //
```

---

## 修复建议

### 1. 始终使用参数化查询

```sql
-- 使用 USING 子句
SET @sql = 'SELECT * FROM users WHERE id = ? AND status = ?';
SET @id = 1;
SET @status = 'active';
PREPARE stmt FROM @sql;
EXECUTE stmt USING @id, @status;
DEALLOCATE PREPARE stmt;
```

### 2. 输入验证

```sql
-- 验证数字类型
CREATE PROCEDURE get_user(IN p_id VARCHAR(50))
BEGIN
    -- 验证是否为数字
    IF p_id REGEXP '^[0-9]+$' = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid user ID';
    END IF;
    
    SELECT * FROM users WHERE id = CAST(p_id AS UNSIGNED);
END //
```

### 3. 使用反引号转义标识符

```sql
-- 转义表名和列名
SET @sql = CONCAT('SELECT * FROM `', table_name, '` WHERE `', column_name, '` = ?');
```

---

## 参考资源

- [MySQL Prepared Statements](https://dev.mysql.com/doc/refman/8.0/en/sql-prepared-statements.html)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
