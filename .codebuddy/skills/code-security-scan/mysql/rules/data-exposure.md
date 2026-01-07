# MySQL 数据暴露检测规则

## 规则概述

| 规则ID | SQL-003 |
|--------|---------|
| 名称 | 数据暴露风险 |
| 风险等级 | 🟠 高危 |
| CWE | CWE-200 |

---

## 检测模式

### 1. 敏感数据明文存储

**危险模式**:
```sql
-- ❌ 危险：密码明文存储
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50),  -- 明文密码
    credit_card VARCHAR(20)  -- 明文信用卡号
);

-- ❌ 危险：插入明文敏感数据
INSERT INTO users (username, password) VALUES ('admin', 'admin123');
```

**检测正则**:
```regex
CREATE\s+TABLE.*?password\s+VARCHAR
INSERT\s+INTO.*?password.*?VALUES.*?['"][^'"]+['"]
```

**安全写法**:
```sql
-- ✅ 安全：存储哈希值
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),  -- 存储 bcrypt 哈希
    password_salt VARCHAR(64)    -- 可选：额外的盐值
);

-- ✅ 安全：使用 MySQL 加密函数（仅作示例，生产环境应在应用层加密）
INSERT INTO users (username, password_hash) 
VALUES ('admin', SHA2('password_with_salt', 256));
```

---

### 2. 敏感数据未脱敏

**危险模式**:
```sql
-- ❌ 危险：查询返回完整敏感数据
SELECT * FROM users;
SELECT id, name, email, phone, id_card, bank_account FROM customers;

-- ❌ 危险：日志中记录敏感数据
SELECT * FROM users INTO OUTFILE '/tmp/users.csv';
```

**安全写法**:
```sql
-- ✅ 安全：只查询必要字段
SELECT id, name, email FROM users;

-- ✅ 安全：脱敏处理
SELECT 
    id,
    name,
    CONCAT(LEFT(email, 3), '***', SUBSTRING_INDEX(email, '@', -1)) AS email,
    CONCAT('***', RIGHT(phone, 4)) AS phone,
    CONCAT(LEFT(id_card, 4), '**********', RIGHT(id_card, 4)) AS id_card
FROM customers;

-- ✅ 安全：创建脱敏视图
CREATE VIEW customers_masked AS
SELECT 
    id,
    name,
    CONCAT(LEFT(email, 3), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
    CONCAT('***', RIGHT(phone, 4)) AS phone
FROM customers;
```

---

### 3. 不安全的数据导出

**危险模式**:
```sql
-- ❌ 危险：导出到公共目录
SELECT * FROM users INTO OUTFILE '/var/www/html/users.csv';
SELECT * FROM orders INTO OUTFILE '/tmp/orders.txt';

-- ❌ 危险：使用 LOAD DATA LOCAL
LOAD DATA LOCAL INFILE '/etc/passwd' INTO TABLE temp;
```

**检测正则**:
```regex
INTO\s+OUTFILE\s+['"]
LOAD\s+DATA\s+LOCAL\s+INFILE
```

**安全写法**:
```sql
-- ✅ 安全：导出到安全目录，并限制权限
SELECT id, name FROM users INTO OUTFILE '/var/mysql-exports/users.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- 然后在操作系统层面设置权限
-- chmod 600 /var/mysql-exports/users.csv
```

---

### 4. 错误信息泄露

**危险模式**:
```sql
-- ❌ 危险：存储过程返回详细错误
CREATE PROCEDURE get_user(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- 返回详细错误信息
        GET DIAGNOSTICS CONDITION 1 @err_msg = MESSAGE_TEXT;
        SELECT @err_msg AS error;
    END;
    
    SELECT * FROM users WHERE id = p_id;
END //
```

**安全写法**:
```sql
-- ✅ 安全：返回通用错误，记录详细日志
CREATE PROCEDURE get_user(IN p_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- 记录详细错误到日志表
        GET DIAGNOSTICS CONDITION 1 
            @err_no = MYSQL_ERRNO,
            @err_msg = MESSAGE_TEXT;
        INSERT INTO error_log (error_code, error_message, created_at)
        VALUES (@err_no, @err_msg, NOW());
        
        -- 返回通用错误
        SELECT 'An error occurred' AS error;
    END;
    
    SELECT id, name, email FROM users WHERE id = p_id;
END //
```

---

### 5. 审计日志缺失

**危险模式**:
```sql
-- ❌ 危险：敏感操作无审计
DELETE FROM users WHERE id = 1;
UPDATE users SET role = 'admin' WHERE id = 2;
TRUNCATE TABLE audit_log;
```

**安全写法**:
```sql
-- ✅ 安全：使用触发器记录审计日志
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(64),
    action VARCHAR(10),
    record_id INT,
    old_values JSON,
    new_values JSON,
    user VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, old_values, new_values, user)
    VALUES (
        'users',
        'UPDATE',
        NEW.id,
        JSON_OBJECT('name', OLD.name, 'email', OLD.email, 'role', OLD.role),
        JSON_OBJECT('name', NEW.name, 'email', NEW.email, 'role', NEW.role),
        CURRENT_USER()
    );
END //

CREATE TRIGGER users_audit_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, action, record_id, old_values, user)
    VALUES (
        'users',
        'DELETE',
        OLD.id,
        JSON_OBJECT('name', OLD.name, 'email', OLD.email),
        CURRENT_USER()
    );
END //
DELIMITER ;
```

---

## 修复建议

### 1. 数据加密

```sql
-- 使用 MySQL 内置加密（AES）
-- 注意：密钥管理应在应用层处理

-- 加密存储
INSERT INTO sensitive_data (data_encrypted)
VALUES (AES_ENCRYPT('sensitive_value', @encryption_key));

-- 解密读取
SELECT AES_DECRYPT(data_encrypted, @encryption_key) AS data
FROM sensitive_data;
```

### 2. 创建数据脱敏函数

```sql
DELIMITER //

CREATE FUNCTION mask_email(email VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE at_pos INT;
    SET at_pos = LOCATE('@', email);
    IF at_pos > 3 THEN
        RETURN CONCAT(LEFT(email, 3), '***', SUBSTRING(email, at_pos));
    ELSE
        RETURN CONCAT('***', SUBSTRING(email, at_pos));
    END IF;
END //

CREATE FUNCTION mask_phone(phone VARCHAR(20))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF LENGTH(phone) >= 7 THEN
        RETURN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4));
    ELSE
        RETURN '***';
    END IF;
END //

DELIMITER ;
```

### 3. 实施行级安全

```sql
-- 创建安全视图，根据当前用户过滤数据
CREATE VIEW my_orders AS
SELECT * FROM orders 
WHERE user_id = (SELECT id FROM users WHERE username = SUBSTRING_INDEX(CURRENT_USER(), '@', 1));
```

---

## 参考资源

- [MySQL Data Masking](https://dev.mysql.com/doc/refman/8.0/en/data-masking.html)
- [MySQL Encryption Functions](https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html)
- [GDPR Data Protection](https://gdpr.eu/data-protection/)
