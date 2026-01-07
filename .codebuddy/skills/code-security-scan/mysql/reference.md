# MySQL 安全规则索引

本文档定义 MySQL/SQL 脚本的安全检测规则。

## 规则列表

| 规则ID | 规则名称 | 风险等级 | 分类 |
|--------|---------|---------|------|
| SQL-PRIV-001 | 过度权限授予 | 🔴 严重 | 权限控制 |
| SQL-PRIV-002 | GRANT ALL PRIVILEGES | 🔴 严重 | 权限控制 |
| SQL-PRIV-003 | 无密码用户 | 🔴 严重 | 认证安全 |
| SQL-DATA-001 | 敏感数据明文存储 | 🟠 高危 | 数据保护 |
| SQL-DATA-002 | 缺少数据脱敏 | 🟡 中危 | 数据保护 |
| SQL-INJ-001 | 动态 SQL 拼接 | 🔴 严重 | SQL注入 |
| SQL-INJ-002 | 存储过程注入风险 | 🟠 高危 | SQL注入 |
| SQL-CONF-001 | 不安全配置 | 🟡 中危 | 配置安全 |
| SQL-CONF-002 | 远程 root 访问 | 🔴 严重 | 配置安全 |
| SQL-LOG-001 | 敏感信息日志 | 🟠 高危 | 日志安全 |

---

## 详细规则

### SQL-PRIV-001: 过度权限授予

**检测模式**:
```regex
GRANT.*ALL.*ON\s+\*\.\*
GRANT.*SUPER
GRANT.*FILE
GRANT.*PROCESS
GRANT.*SHUTDOWN
```

**危险代码**:
```sql
-- ❌ 危险: 授予所有数据库权限
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';

-- ❌ 危险: 授予危险权限
GRANT SUPER ON *.* TO 'app_user'@'%';
GRANT FILE ON *.* TO 'app_user'@'%';
```

**安全代码**:
```sql
-- ✅ 安全: 最小权限原则
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'app_user'@'localhost';

-- ✅ 安全: 只读用户
GRANT SELECT ON mydb.* TO 'readonly_user'@'localhost';

-- ✅ 安全: 特定表权限
GRANT SELECT, INSERT ON mydb.users TO 'app_user'@'localhost';
GRANT SELECT ON mydb.orders TO 'app_user'@'localhost';
```

---

### SQL-PRIV-002: GRANT ALL PRIVILEGES

**检测模式**:
```regex
GRANT\s+ALL\s+PRIVILEGES
GRANT\s+ALL\s+ON
```

**危险代码**:
```sql
-- ❌ 危险
GRANT ALL PRIVILEGES ON mydb.* TO 'app_user'@'%';
GRANT ALL ON *.* TO 'admin'@'%' WITH GRANT OPTION;
```

**安全代码**:
```sql
-- ✅ 安全: 明确列出需要的权限
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'app_user'@'localhost';
```

---

### SQL-PRIV-003: 无密码用户

**检测模式**:
```regex
IDENTIFIED\s+BY\s+''
IDENTIFIED\s+BY\s+""
CREATE\s+USER.*@.*(?!IDENTIFIED)
```

**危险代码**:
```sql
-- ❌ 危险: 空密码
CREATE USER 'test'@'localhost' IDENTIFIED BY '';
CREATE USER 'app'@'%';  -- 无密码
```

**安全代码**:
```sql
-- ✅ 安全: 强密码
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!2024';

-- ✅ 安全: 使用认证插件
CREATE USER 'app_user'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'StrongP@ssw0rd!';
```

---

### SQL-DATA-001: 敏感数据明文存储

**检测模式**:
```regex
password\s+VARCHAR
pwd\s+VARCHAR
credit_card\s+VARCHAR
ssn\s+VARCHAR
```

**危险代码**:
```sql
-- ❌ 危险: 明文存储密码
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100)  -- 明文存储
);

-- ❌ 危险: 明文存储信用卡
CREATE TABLE payments (
    id INT PRIMARY KEY,
    credit_card VARCHAR(20)  -- 明文存储
);
```

**安全代码**:
```sql
-- ✅ 安全: 存储哈希值
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),  -- BCrypt 哈希
    password_salt VARCHAR(32)    -- 盐值（如果不用 BCrypt）
);

-- ✅ 安全: 加密存储
CREATE TABLE payments (
    id INT PRIMARY KEY,
    credit_card_encrypted VARBINARY(256),  -- AES 加密
    credit_card_last4 CHAR(4)              -- 只存储后4位
);

-- ✅ 安全: 使用注释标记敏感字段
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255) COMMENT 'BCrypt hashed password'
);
```

---

### SQL-INJ-001: 动态 SQL 拼接

**检测模式**:
```regex
CONCAT\(.*SELECT
CONCAT\(.*INSERT
CONCAT\(.*UPDATE
CONCAT\(.*DELETE
PREPARE.*CONCAT
```

**危险代码**:
```sql
-- ❌ 危险: 存储过程中的动态 SQL
CREATE PROCEDURE get_user(IN user_input VARCHAR(100))
BEGIN
    SET @sql = CONCAT('SELECT * FROM users WHERE name = "', user_input, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END;
```

**安全代码**:
```sql
-- ✅ 安全: 使用参数化查询
CREATE PROCEDURE get_user(IN user_name VARCHAR(100))
BEGIN
    SELECT * FROM users WHERE name = user_name;
END;

-- ✅ 安全: 使用 PREPARE 参数
CREATE PROCEDURE get_user(IN user_name VARCHAR(100))
BEGIN
    SET @sql = 'SELECT * FROM users WHERE name = ?';
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING user_name;
    DEALLOCATE PREPARE stmt;
END;
```

---

### SQL-CONF-002: 远程 root 访问

**检测模式**:
```regex
'root'@'%'
'root'@'[0-9]
GRANT.*TO\s+'root'@'%'
```

**危险代码**:
```sql
-- ❌ 危险: 允许远程 root 访问
CREATE USER 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
```

**安全代码**:
```sql
-- ✅ 安全: root 只允许本地访问
-- 默认: 'root'@'localhost'

-- ✅ 安全: 创建专用管理员账户
CREATE USER 'admin'@'192.168.1.%' IDENTIFIED BY 'StrongPassword!';
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'admin'@'192.168.1.%';
```

---

## 安全配置检查

### my.cnf 安全配置

```ini
[mysqld]
# 禁用远程 root
skip-grant-tables = OFF

# 禁用 LOAD DATA LOCAL
local-infile = 0

# 禁用符号链接
symbolic-links = 0

# 设置安全文件权限
secure-file-priv = /var/lib/mysql-files

# 启用 SSL
require_secure_transport = ON

# 密码策略
validate_password.policy = STRONG
validate_password.length = 12
```

---

## 检测优先级

### 第一优先级（严重）
1. SQL-PRIV-001, SQL-PRIV-002
2. SQL-PRIV-003
3. SQL-INJ-001
4. SQL-CONF-002

### 第二优先级（高危）
1. SQL-DATA-001
2. SQL-INJ-002
3. SQL-LOG-001

### 第三优先级（中危）
1. SQL-DATA-002
2. SQL-CONF-001

---

## 详细规则文件

| 规则类别 | 文件 | 说明 |
|---------|------|------|
| 注入风险 | [rules/injection-risk.md](rules/injection-risk.md) | 动态 SQL、存储过程注入 |
| 权限提升 | [rules/privilege-escalation.md](rules/privilege-escalation.md) | 过度授权、危险权限 |
| 数据暴露 | [rules/data-exposure.md](rules/data-exposure.md) | 明文存储、数据脱敏、审计日志 |
| 配置安全 | [rules/config-security.md](rules/config-security.md) | 服务器配置、SSL/TLS、SQL 模式 |

---

## SQL 安全检查清单

```yaml
sql_security_checklist:
  权限控制:
    - [ ] 遵循最小权限原则
    - [ ] 不使用 GRANT ALL
    - [ ] 限制危险权限 (SUPER, FILE, PROCESS)
    - [ ] 禁止远程 root 访问
  
  认证安全:
    - [ ] 所有用户设置强密码
    - [ ] 使用安全认证插件
    - [ ] 定期轮换密码
  
  数据保护:
    - [ ] 密码使用哈希存储
    - [ ] 敏感数据加密存储
    - [ ] 实施数据脱敏
  
  注入防护:
    - [ ] 存储过程使用参数化查询
    - [ ] 不使用动态 SQL 拼接
```

---

**版本**: 1.1.0  
**更新时间**: 2025-12-22
