# MySQL 权限提升检测规则

## 规则概述

| 规则ID | SQL-002 |
|--------|---------|
| 名称 | 权限提升风险 |
| 风险等级 | 🔴 严重 |
| CWE | CWE-269 |

---

## 检测模式

### 1. 过度授权

**危险模式**:
```sql
-- ❌ 危险：授予所有权限
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';
GRANT ALL ON database.* TO 'user'@'localhost';

-- ❌ 危险：授予 SUPER 权限
GRANT SUPER ON *.* TO 'user'@'%';

-- ❌ 危险：授予 FILE 权限
GRANT FILE ON *.* TO 'user'@'%';

-- ❌ 危险：授予 GRANT OPTION
GRANT SELECT ON db.* TO 'user'@'%' WITH GRANT OPTION;
```

**检测正则**:
```regex
GRANT\s+ALL\s+(PRIVILEGES\s+)?ON\s+\*\.\*
GRANT\s+SUPER\s+ON
GRANT\s+FILE\s+ON
WITH\s+GRANT\s+OPTION
```

**安全写法**:
```sql
-- ✅ 安全：最小权限原则
GRANT SELECT, INSERT, UPDATE ON app_db.users TO 'app_user'@'localhost';
GRANT SELECT ON app_db.products TO 'readonly_user'@'%';

-- ✅ 安全：限制主机
GRANT SELECT, INSERT ON app_db.* TO 'app_user'@'192.168.1.%';
```

---

### 2. 危险的存储过程权限

**危险模式**:
```sql
-- ❌ 危险：DEFINER 为 root
CREATE DEFINER='root'@'localhost' PROCEDURE admin_proc()
BEGIN
    -- 以 root 权限执行
    DROP TABLE users;
END //

-- ❌ 危险：SQL SECURITY DEFINER
CREATE DEFINER='admin'@'%' PROCEDURE sensitive_op()
SQL SECURITY DEFINER
BEGIN
    -- 以定义者权限执行，可能被滥用
    DELETE FROM audit_log;
END //
```

**检测正则**:
```regex
DEFINER\s*=\s*['"]?root['"]?@
SQL\s+SECURITY\s+DEFINER
```

**安全写法**:
```sql
-- ✅ 安全：使用调用者权限
CREATE PROCEDURE user_proc()
SQL SECURITY INVOKER
BEGIN
    -- 以调用者权限执行
    SELECT * FROM users WHERE id = @user_id;
END //

-- ✅ 安全：使用专用账户
CREATE DEFINER='app_definer'@'localhost' PROCEDURE safe_proc()
SQL SECURITY DEFINER
BEGIN
    -- app_definer 只有必要的权限
    SELECT * FROM users;
END //
```

---

### 3. 不安全的用户创建

**危险模式**:
```sql
-- ❌ 危险：空密码
CREATE USER 'user'@'%' IDENTIFIED BY '';
CREATE USER 'user'@'%';

-- ❌ 危险：弱密码
CREATE USER 'admin'@'%' IDENTIFIED BY 'admin';
CREATE USER 'root'@'%' IDENTIFIED BY '123456';
CREATE USER 'user'@'%' IDENTIFIED BY 'password';

-- ❌ 危险：允许任意主机
CREATE USER 'admin'@'%' IDENTIFIED BY 'StrongP@ss';
```

**检测正则**:
```regex
CREATE\s+USER.*?IDENTIFIED\s+BY\s+['"]?['"]?\s*;
CREATE\s+USER.*?IDENTIFIED\s+BY\s+['"](admin|root|password|123456|qwerty)['"]
CREATE\s+USER.*?@\s*['"]%['"]
```

**安全写法**:
```sql
-- ✅ 安全：强密码 + 限制主机
CREATE USER 'app_user'@'192.168.1.%' 
    IDENTIFIED BY 'C0mpl3x_P@ssw0rd_2024!'
    PASSWORD EXPIRE INTERVAL 90 DAY
    FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 1;

-- ✅ 安全：使用 SSL
CREATE USER 'secure_user'@'%' 
    IDENTIFIED BY 'StrongP@ss!'
    REQUIRE SSL;
```

---

### 4. 危险的系统表操作

**危险模式**:
```sql
-- ❌ 危险：直接修改 mysql 系统表
INSERT INTO mysql.user VALUES (...);
UPDATE mysql.user SET authentication_string = '' WHERE user = 'root';
DELETE FROM mysql.db WHERE user = 'app_user';

-- ❌ 危险：修改权限表
UPDATE mysql.tables_priv SET Table_priv = 'Select,Insert,Update,Delete,Create,Drop' WHERE User = 'user';
```

**检测正则**:
```regex
(INSERT|UPDATE|DELETE)\s+.*?mysql\.(user|db|tables_priv|columns_priv|procs_priv)
```

**安全写法**:
```sql
-- ✅ 安全：使用 GRANT/REVOKE 语句
GRANT SELECT, INSERT ON app_db.* TO 'app_user'@'localhost';
REVOKE DELETE ON app_db.* FROM 'app_user'@'localhost';

-- ✅ 安全：使用 ALTER USER
ALTER USER 'app_user'@'localhost' IDENTIFIED BY 'NewP@ssword';
```

---

## 修复建议

### 1. 实施最小权限原则

```sql
-- 只读用户
CREATE USER 'readonly'@'localhost' IDENTIFIED BY 'StrongP@ss!';
GRANT SELECT ON app_db.* TO 'readonly'@'localhost';

-- 应用用户
CREATE USER 'app'@'localhost' IDENTIFIED BY 'StrongP@ss!';
GRANT SELECT, INSERT, UPDATE ON app_db.users TO 'app'@'localhost';
GRANT SELECT, INSERT ON app_db.orders TO 'app'@'localhost';

-- 管理员用户（限制主机）
CREATE USER 'admin'@'192.168.1.100' IDENTIFIED BY 'StrongP@ss!';
GRANT ALL ON app_db.* TO 'admin'@'192.168.1.100';
```

### 2. 定期审计权限

```sql
-- 查看用户权限
SHOW GRANTS FOR 'app_user'@'localhost';

-- 查看所有用户
SELECT user, host, authentication_string FROM mysql.user;

-- 查看危险权限
SELECT user, host, Super_priv, File_priv, Grant_priv 
FROM mysql.user 
WHERE Super_priv = 'Y' OR File_priv = 'Y' OR Grant_priv = 'Y';
```

### 3. 撤销不必要的权限

```sql
-- 撤销危险权限
REVOKE SUPER ON *.* FROM 'user'@'%';
REVOKE FILE ON *.* FROM 'user'@'%';
REVOKE GRANT OPTION ON *.* FROM 'user'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
```

---

## 参考资源

- [MySQL Access Control](https://dev.mysql.com/doc/refman/8.0/en/access-control.html)
- [MySQL Security Guidelines](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html)
