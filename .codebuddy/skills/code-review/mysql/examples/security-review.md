# MySQL 安全审查示例

## 示例 1：SQL 注入防护

### 问题代码

```sql
-- 存储过程中的 SQL 注入风险
DELIMITER //
CREATE PROCEDURE sp_search_user(IN p_keyword VARCHAR(100))
BEGIN
    SET @sql = CONCAT('SELECT * FROM user WHERE user_name LIKE ''%', p_keyword, '%''');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- 调用示例（可被注入）
CALL sp_search_user('test'' OR ''1''=''1');
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 字符串拼接 | P0 | 直接拼接用户输入，存在 SQL 注入 |
| 无输入验证 | P0 | 未对输入参数进行验证 |
| SELECT * | P2 | 可能泄露敏感字段 |

### 修复后代码

```sql
DELIMITER //
CREATE PROCEDURE sp_search_user(IN p_keyword VARCHAR(100))
BEGIN
    -- 输入验证
    IF p_keyword IS NULL OR LENGTH(TRIM(p_keyword)) < 2 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '搜索关键字至少需要2个字符';
    END IF;
    
    -- 限制关键字长度
    IF LENGTH(p_keyword) > 50 THEN
        SET p_keyword = LEFT(p_keyword, 50);
    END IF;
    
    -- 使用参数化查询
    SET @keyword = CONCAT('%', p_keyword, '%');
    
    PREPARE stmt FROM 
        'SELECT id, user_name, email, created_at 
         FROM user 
         WHERE user_name LIKE ? 
         LIMIT 100';
    EXECUTE stmt USING @keyword;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
```

---

## 示例 1.1：二次注入防护

### 问题代码

```sql
-- 第一步：用户注册时存储恶意数据
INSERT INTO user (user_name, email) 
VALUES ('admin''--', 'test@example.com');

-- 第二步：后续查询时触发注入
DELIMITER //
CREATE PROCEDURE sp_get_user_logs(IN p_user_id INT)
BEGIN
    DECLARE v_user_name VARCHAR(100);
    
    -- 获取用户名
    SELECT user_name INTO v_user_name FROM user WHERE id = p_user_id;
    
    -- ❌ 危险：使用存储的数据拼接 SQL
    SET @sql = CONCAT('SELECT * FROM user_log WHERE user_name = ''', v_user_name, '''');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 二次注入 | P0 | 存储的恶意数据在后续查询中被执行 |
| 信任内部数据 | P0 | 错误地认为数据库中的数据是安全的 |

### 修复后代码

```sql
DELIMITER //
CREATE PROCEDURE sp_get_user_logs(IN p_user_id INT)
BEGIN
    DECLARE v_user_name VARCHAR(100);
    
    -- 获取用户名
    SELECT user_name INTO v_user_name FROM user WHERE id = p_user_id;
    
    -- ✅ 安全：即使是内部数据也使用参数化查询
    PREPARE stmt FROM 'SELECT * FROM user_log WHERE user_name = ? LIMIT 100';
    EXECUTE stmt USING v_user_name;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
```

### 二次注入防护原则

| 原则 | 说明 |
|------|------|
| 不信任任何数据 | 包括数据库中已存储的数据 |
| 始终参数化 | 无论数据来源，都使用参数化查询 |
| 输入输出都验证 | 存储时验证，使用时也验证 |

---

## 示例 1.2：时间盲注防护

### 问题代码

```sql
-- 攻击者可以通过响应时间推断数据
-- 输入: admin' AND IF(SUBSTRING(password,1,1)='a', SLEEP(5), 0) --

DELIMITER //
CREATE PROCEDURE sp_login(IN p_username VARCHAR(100), IN p_password VARCHAR(100))
BEGIN
    SET @sql = CONCAT(
        'SELECT * FROM user WHERE user_name = ''', p_username, 
        ''' AND password = ''', p_password, ''''
    );
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| SQL 注入 | P0 | 允许注入 SLEEP/BENCHMARK 等函数 |
| 时间盲注 | P0 | 攻击者可通过响应时间逐字符推断密码 |

### 修复后代码

```sql
DELIMITER //
CREATE PROCEDURE sp_login(IN p_username VARCHAR(100), IN p_password VARCHAR(100))
BEGIN
    -- 输入验证
    IF p_username IS NULL OR LENGTH(p_username) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '无效的用户名';
    END IF;
    
    IF p_password IS NULL OR LENGTH(p_password) > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '无效的密码';
    END IF;
    
    -- ✅ 使用参数化查询（根本解决）
    PREPARE stmt FROM 
        'SELECT id, user_name, email FROM user 
         WHERE user_name = ? AND password = ?';
    EXECUTE stmt USING p_username, p_password;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- 额外防护：设置查询超时（MySQL 5.7.8+）
SET SESSION max_execution_time = 5000;  -- 5秒超时
```

### 时间盲注防护措施

| 措施 | 说明 | 版本要求 |
|------|------|---------|
| 参数化查询 | 根本解决方案 | 所有版本 |
| 查询超时 | `max_execution_time` | MySQL 5.7.8+ |
| 函数限制 | 禁用 SLEEP/BENCHMARK（需应用层） | - |
| 监控异常 | 检测异常慢查询 | - |

---

## 示例 2：权限控制

### 问题代码

```sql
-- 危险：授予过多权限
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%' WITH GRANT OPTION;

-- 危险：使用 root 账号连接应用
-- application.properties: spring.datasource.username=root
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| ALL PRIVILEGES | P0 | 权限过大，违反最小权限原则 |
| *.* | P0 | 可访问所有数据库 |
| WITH GRANT OPTION | P0 | 可以授权给其他用户 |
| % 主机 | P1 | 允许任意主机连接 |

### 修复后代码

```sql
-- 创建只读用户（用于报表查询）
CREATE USER 'readonly_user'@'10.0.0.%' IDENTIFIED BY 'StrongPassword123!';
GRANT SELECT ON order_system.* TO 'readonly_user'@'10.0.0.%';

-- 创建应用用户（日常 CRUD）
CREATE USER 'app_user'@'10.0.0.%' IDENTIFIED BY 'StrongPassword456!';
GRANT SELECT, INSERT, UPDATE, DELETE ON order_system.* TO 'app_user'@'10.0.0.%';

-- 创建管理用户（DDL 操作，仅限 DBA）
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'StrongPassword789!';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP 
    ON order_system.* TO 'admin_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证权限
SHOW GRANTS FOR 'app_user'@'10.0.0.%';
```

### 权限最佳实践

| 用户类型 | 权限范围 | 主机限制 |
|---------|---------|---------|
| 只读用户 | SELECT | 内网 IP 段 |
| 应用用户 | SELECT, INSERT, UPDATE, DELETE | 应用服务器 IP |
| 管理用户 | 含 DDL 权限 | localhost 或堡垒机 |
| 备份用户 | SELECT, LOCK TABLES, SHOW VIEW | 备份服务器 |

---

## 示例 3：敏感数据保护

### 问题代码

```sql
-- 危险：直接查询敏感数据
SELECT 
    id, 
    user_name, 
    password,      -- 密码明文
    phone,         -- 手机号
    id_card,       -- 身份证号
    bank_card      -- 银行卡号
FROM user;

-- 危险：日志记录敏感信息
INSERT INTO operation_log (user_id, operation, detail)
VALUES (1, 'login', CONCAT('用户登录，密码：', @password));
```

### 修复后代码

```sql
-- 创建脱敏视图
CREATE VIEW v_user_safe AS
SELECT 
    id,
    user_name,
    -- 密码不返回
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone_masked,
    CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4)) AS id_card_masked,
    CONCAT('****', RIGHT(bank_card, 4)) AS bank_card_masked,
    created_at
FROM user;

-- 使用脱敏视图
SELECT * FROM v_user_safe WHERE id = 1;

-- 创建脱敏函数
DELIMITER //
CREATE FUNCTION fn_mask_phone(phone VARCHAR(20))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF phone IS NULL OR LENGTH(phone) < 7 THEN
        RETURN phone;
    END IF;
    RETURN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4));
END //

CREATE FUNCTION fn_mask_id_card(id_card VARCHAR(20))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF id_card IS NULL OR LENGTH(id_card) < 10 THEN
        RETURN id_card;
    END IF;
    RETURN CONCAT(LEFT(id_card, 6), '********', RIGHT(id_card, 4));
END //

CREATE FUNCTION fn_mask_bank_card(bank_card VARCHAR(30))
RETURNS VARCHAR(30)
DETERMINISTIC
BEGIN
    IF bank_card IS NULL OR LENGTH(bank_card) < 4 THEN
        RETURN bank_card;
    END IF;
    RETURN CONCAT('****', RIGHT(bank_card, 4));
END //
DELIMITER ;

-- 安全的日志记录
INSERT INTO operation_log (user_id, operation, detail)
VALUES (1, 'login', '用户登录成功');
```

### 敏感数据处理规范

| 数据类型 | 存储方式 | 展示方式 |
|---------|---------|---------|
| 密码 | 加密存储（bcrypt） | 不展示 |
| 手机号 | 原文存储 | 138****1234 |
| 身份证 | 加密存储 | 110101****1234 |
| 银行卡 | 加密存储 | ****1234 |
| 邮箱 | 原文存储 | t***@example.com |

---

## 示例 4：DDL 安全操作

### 问题代码

```sql
-- 危险：直接删除表
DROP TABLE user_order;

-- 危险：直接清空表
TRUNCATE TABLE user_order;

-- 危险：无条件删除
DELETE FROM user_order;
```

### 修复后代码

```sql
-- ============================================
-- 安全删除流程
-- ============================================

-- 步骤 1：确认数据量
SELECT COUNT(*) AS record_count FROM user_order;
-- 记录数量：xxxxx

-- 步骤 2：创建备份
CREATE TABLE user_order_backup_20240115 AS 
SELECT * FROM user_order;

-- 验证备份
SELECT COUNT(*) FROM user_order_backup_20240115;

-- 步骤 3：执行删除（使用 IF EXISTS）
DROP TABLE IF EXISTS user_order;

-- 如需恢复
-- RENAME TABLE user_order_backup_20240115 TO user_order;

-- ============================================
-- 安全清空流程（保留表结构）
-- ============================================

-- 步骤 1：备份数据
CREATE TABLE user_order_backup_20240115 AS 
SELECT * FROM user_order;

-- 步骤 2：清空表
TRUNCATE TABLE user_order;

-- 如需恢复
-- INSERT INTO user_order SELECT * FROM user_order_backup_20240115;

-- ============================================
-- 安全删除数据（条件删除）
-- ============================================

-- 步骤 1：确认删除范围
SELECT COUNT(*) FROM user_order 
WHERE status = 'cancelled' AND created_at < '2023-01-01';

-- 步骤 2：备份待删除数据
CREATE TABLE user_order_deleted_20240115 AS
SELECT * FROM user_order 
WHERE status = 'cancelled' AND created_at < '2023-01-01';

-- 步骤 3：分批删除
DELETE FROM user_order 
WHERE status = 'cancelled' AND created_at < '2023-01-01'
LIMIT 10000;
-- 重复执行直到删除完毕
```

---

## 示例 5：存储过程安全

### 问题代码

```sql
DELIMITER //
CREATE PROCEDURE sp_update_user_status(
    IN p_user_id INT,
    IN p_status VARCHAR(20)
)
BEGIN
    -- 无权限检查
    -- 无输入验证
    -- 无审计日志
    UPDATE user SET status = p_status WHERE id = p_user_id;
END //
DELIMITER ;
```

### 修复后代码

```sql
DELIMITER //
CREATE PROCEDURE sp_update_user_status(
    IN p_user_id BIGINT,
    IN p_status VARCHAR(20),
    IN p_operator_id BIGINT
)
BEGIN
    DECLARE v_old_status VARCHAR(20);
    DECLARE v_error_message VARCHAR(200);
    
    -- 声明异常处理
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- 输入验证
    IF p_user_id IS NULL OR p_user_id <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '无效的用户ID';
    END IF;
    
    IF p_status NOT IN ('active', 'inactive', 'suspended', 'deleted') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '无效的状态值';
    END IF;
    
    IF p_operator_id IS NULL OR p_operator_id <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '无效的操作人ID';
    END IF;
    
    START TRANSACTION;
    
    -- 获取原状态（加锁）
    SELECT status INTO v_old_status 
    FROM user 
    WHERE id = p_user_id 
    FOR UPDATE;
    
    IF v_old_status IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '用户不存在';
    END IF;
    
    -- 状态变更规则检查
    IF v_old_status = 'deleted' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '已删除用户不能修改状态';
    END IF;
    
    -- 执行更新
    UPDATE user 
    SET status = p_status, 
        updated_at = NOW() 
    WHERE id = p_user_id;
    
    -- 记录审计日志
    INSERT INTO audit_log (
        table_name, 
        record_id, 
        operation, 
        old_value, 
        new_value, 
        operator_id, 
        created_at
    ) VALUES (
        'user',
        p_user_id,
        'UPDATE_STATUS',
        v_old_status,
        p_status,
        p_operator_id,
        NOW()
    );
    
    COMMIT;
    
    SELECT 'SUCCESS' AS result, '状态更新成功' AS message;
END //
DELIMITER ;
```

---

## 安全审查检查清单

### SQL 注入防护
- [ ] 无字符串拼接 SQL
- [ ] 使用参数化查询
- [ ] 输入参数已验证
- [ ] 特殊字符已转义
- [ ] 防范二次注入（存储后再查询）
- [ ] 防范时间盲注（限制 SLEEP/BENCHMARK）
- [ ] 整数参数有边界检查

### 权限控制
- [ ] 遵循最小权限原则
- [ ] 无 ALL PRIVILEGES
- [ ] 主机限制合理
- [ ] 定期审计权限

### 敏感数据
- [ ] 密码加密存储
- [ ] 敏感数据脱敏展示
- [ ] 日志不记录敏感信息
- [ ] 有数据脱敏视图/函数

### DDL 安全
- [ ] 删除前有备份
- [ ] 使用 IF EXISTS
- [ ] 有回滚方案
- [ ] 大表操作分批执行

### 存储过程安全
- [ ] 有输入验证
- [ ] 有异常处理
- [ ] 有审计日志
- [ ] 有事务控制
