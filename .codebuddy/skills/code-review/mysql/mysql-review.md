# MySQL 脚本代码审查指南

对 MySQL SQL 脚本进行全面质量审查，覆盖语法规范、性能优化、安全防护和可维护性。

## 审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 语法规范 | 20% | 命名、格式、注释、关键字大小写 |
| 性能优化 | 30% | 索引使用、查询优化、执行计划 |
| 安全防护 | 25% | SQL 注入、权限控制、敏感数据 |
| 可维护性 | 15% | 可读性、模块化、文档 |
| 数据完整性 | 10% | 约束、事务、备份 |

## 1. 语法规范

### 1.1 命名规范

| 对象 | 规范 | 示例 |
|------|------|------|
| 数据库名 | 小写 + 下划线 | `order_system` |
| 表名 | 小写 + 下划线，单数形式 | `user_order` |
| 字段名 | 小写 + 下划线 | `created_at` |
| 索引名 | `idx_表名_字段名` | `idx_user_order_status` |
| 唯一索引 | `uk_表名_字段名` | `uk_user_email` |
| 主键 | `pk_表名` 或 `id` | `pk_user_order` |
| 外键 | `fk_表名_关联表` | `fk_order_user` |
| 存储过程 | `sp_功能描述` | `sp_calculate_order_total` |
| 函数 | `fn_功能描述` | `fn_get_user_name` |
| 触发器 | `tr_表名_时机_操作` | `tr_order_before_insert` |
| 视图 | `v_功能描述` | `v_user_order_summary` |

### 1.2 关键字规范

```sql
-- ✅ 正确：关键字大写
SELECT id, user_name, created_at
FROM user_order
WHERE status = 'active'
ORDER BY created_at DESC;

-- ❌ 错误：关键字小写或混合
select id, user_name, created_at
from user_order
where status = 'active'
order by created_at desc;
```

### 1.3 格式规范

```sql
-- ✅ 正确：清晰的格式
SELECT 
    u.id,
    u.user_name,
    o.order_no,
    o.total_amount
FROM user u
INNER JOIN user_order o ON u.id = o.user_id
WHERE u.status = 'active'
    AND o.created_at >= '2024-01-01'
GROUP BY u.id, u.user_name, o.order_no, o.total_amount
HAVING SUM(o.total_amount) > 1000
ORDER BY o.created_at DESC
LIMIT 100;

-- ❌ 错误：压缩在一行
SELECT u.id, u.user_name, o.order_no, o.total_amount FROM user u INNER JOIN user_order o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at >= '2024-01-01' GROUP BY u.id, u.user_name, o.order_no, o.total_amount HAVING SUM(o.total_amount) > 1000 ORDER BY o.created_at DESC LIMIT 100;
```

### 1.4 注释规范

```sql
-- 单行注释：解释复杂逻辑
SELECT * FROM user WHERE status = 'active'; -- 只查询激活用户

/*
 * 多行注释：说明脚本用途
 * 作者：xxx
 * 日期：2024-01-01
 * 功能：统计用户订单金额
 */
SELECT 
    user_id,
    SUM(total_amount) AS total_spent
FROM user_order
GROUP BY user_id;
```

## 2. 性能优化

### 2.1 索引使用

| 检查项 | 说明 |
|--------|------|
| WHERE 条件字段 | 高频查询字段应建索引 |
| JOIN 关联字段 | 关联字段必须有索引 |
| ORDER BY 字段 | 排序字段考虑建索引 |
| 覆盖索引 | 查询字段尽量被索引覆盖 |
| 索引选择性 | 避免低选择性字段单独建索引 |
| 复合索引顺序 | 遵循最左前缀原则 |

```sql
-- ✅ 正确：使用索引
SELECT id, user_name FROM user WHERE email = 'test@example.com';
-- 确保 email 字段有索引

-- ❌ 错误：索引失效
SELECT * FROM user WHERE YEAR(created_at) = 2024;  -- 函数导致索引失效
SELECT * FROM user WHERE name LIKE '%test%';       -- 前导通配符索引失效
SELECT * FROM user WHERE status != 'deleted';       -- 否定条件可能不走索引
```

### 2.1.1 隐式类型转换（常见陷阱）

```sql
-- ❌ 错误：隐式类型转换导致索引失效
-- phone 字段是 VARCHAR 类型
SELECT * FROM user WHERE phone = 13800138000;  -- 数字与字符串比较

-- ✅ 正确：保持类型一致
SELECT * FROM user WHERE phone = '13800138000';

-- ❌ 错误：字符集不一致导致索引失效
SELECT * FROM user u 
JOIN user_order o ON u.id = o.user_id  -- 如果两表字符集不同
WHERE u.name = 'test';

-- ✅ 正确：确保关联字段字符集一致
-- 建表时统一使用 utf8mb4
```

### 2.1.2 高级索引技术

```sql
-- 前缀索引（适用于长字符串字段）
CREATE INDEX idx_email_prefix ON user(email(20));

-- 函数索引（MySQL 8.0.13+）
-- 适用于经常按函数结果查询的场景
CREATE INDEX idx_lower_email ON user((LOWER(email)));
SELECT * FROM user WHERE LOWER(email) = 'test@example.com';

-- 不可见索引（MySQL 8.0+）
-- 用于测试删除索引的影响，而不实际删除
ALTER TABLE user ALTER INDEX idx_email INVISIBLE;
-- 测试查询性能后决定是否删除
ALTER TABLE user ALTER INDEX idx_email VISIBLE;  -- 恢复可见

-- 降序索引（MySQL 8.0+）
-- 适用于 ORDER BY col1 ASC, col2 DESC 场景
CREATE INDEX idx_created_amount ON user_order(created_at ASC, amount DESC);
```

### 2.2 查询优化

| 问题 | 风险 | 优化方案 |
|------|------|---------|
| `SELECT *` | 返回不必要字段 | 明确指定字段 |
| 无 LIMIT | 返回大量数据 | 添加分页限制 |
| 子查询 | 性能低下 | 改用 JOIN |
| OR 条件 | 索引失效 | 改用 UNION |
| IN 大列表 | 性能问题 | 改用临时表 JOIN |

```sql
-- ✅ 正确：优化后的查询
SELECT id, user_name, email
FROM user
WHERE id IN (SELECT user_id FROM user_order WHERE status = 'paid')
LIMIT 100;

-- ✅ 更优：使用 JOIN
SELECT DISTINCT u.id, u.user_name, u.email
FROM user u
INNER JOIN user_order o ON u.id = o.user_id
WHERE o.status = 'paid'
LIMIT 100;
```

### 2.3 执行计划检查

```sql
-- 使用 EXPLAIN 分析查询
EXPLAIN SELECT * FROM user WHERE email = 'test@example.com';

-- 关注指标
-- type: ALL(全表扫描) < index < range < ref < eq_ref < const
-- rows: 扫描行数，越小越好
-- Extra: Using filesort, Using temporary 需要优化

-- MySQL 8.0.18+ 使用 EXPLAIN ANALYZE 查看实际执行情况
EXPLAIN ANALYZE SELECT * FROM user WHERE email = 'test@example.com';
-- 输出包含实际执行时间和行数，比 EXPLAIN 更准确

-- MySQL 8.0.16+ 使用树形格式
EXPLAIN FORMAT=TREE SELECT * FROM user WHERE email = 'test@example.com';
```

### 2.4 大表操作

```sql
-- ✅ 正确：分批处理
SET @batch_size = 1000;
SET @offset = 0;

REPEAT
    UPDATE user_order 
    SET status = 'archived'
    WHERE status = 'completed' 
        AND created_at < '2023-01-01'
    LIMIT @batch_size;
    
    SET @offset = @offset + @batch_size;
    -- 添加延迟避免锁表
    DO SLEEP(0.1);
UNTIL ROW_COUNT() = 0 END REPEAT;

-- ❌ 错误：一次性更新大量数据
UPDATE user_order 
SET status = 'archived'
WHERE status = 'completed' AND created_at < '2023-01-01';
```

### 2.5 并发安全

#### 2.5.1 死锁预防

```sql
-- ❌ 错误：无序加锁可能导致死锁
-- 事务 A: UPDATE account SET balance = balance - 100 WHERE id = 1;
--         UPDATE account SET balance = balance + 100 WHERE id = 2;
-- 事务 B: UPDATE account SET balance = balance - 50 WHERE id = 2;
--         UPDATE account SET balance = balance + 50 WHERE id = 1;

-- ✅ 正确：按固定顺序加锁（如按 ID 升序）
-- 所有事务都先操作 id=1，再操作 id=2
START TRANSACTION;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

#### 2.5.2 乐观锁模式

```sql
-- ✅ 使用版本号实现乐观锁
-- 表结构需要 version 字段
ALTER TABLE user ADD COLUMN version INT NOT NULL DEFAULT 0;

-- 更新时检查版本号
UPDATE user 
SET balance = balance - 100, 
    version = version + 1
WHERE id = 1 AND version = @expected_version;

-- 检查是否更新成功
IF ROW_COUNT() = 0 THEN
    -- 版本冲突，需要重试或报错
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '数据已被修改，请重试';
END IF;
```

#### 2.5.3 避免锁范围过大

```sql
-- ❌ 错误：锁定范围过大
SELECT * FROM user_order WHERE status = 'pending' FOR UPDATE;

-- ✅ 正确：限制锁定范围
SELECT * FROM user_order 
WHERE status = 'pending' AND id = 12345 
FOR UPDATE;

-- ✅ MySQL 8.0+ 使用 SKIP LOCKED 跳过已锁定行
SELECT * FROM user_order 
WHERE status = 'pending' 
LIMIT 10 
FOR UPDATE SKIP LOCKED;

-- ✅ MySQL 8.0+ 使用 NOWAIT 立即返回而非等待
SELECT * FROM user_order 
WHERE id = 12345 
FOR UPDATE NOWAIT;
```

## 3. 安全防护

### 3.1 SQL 注入防护

| 风险模式 | 说明 | 修复方案 |
|---------|------|---------|
| 字符串拼接 | 直接拼接用户输入 | 使用参数化查询 |
| 动态 SQL | EXECUTE 执行拼接字符串 | 使用预处理语句 |
| 存储过程 | 未验证输入参数 | 参数验证 + 预处理 |
| 二次注入 | 存储后再查询时注入 | 输出时也参数化 |
| 时间盲注 | 通过响应时间推断 | 限制危险函数 |

```sql
-- ❌ 危险：字符串拼接
SET @sql = CONCAT('SELECT * FROM user WHERE name = ''', @user_input, '''');
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- ✅ 安全：参数化查询
PREPARE stmt FROM 'SELECT * FROM user WHERE name = ?';
EXECUTE stmt USING @user_input;
DEALLOCATE PREPARE stmt;
```

#### 3.1.1 二次注入防护

```sql
-- ❌ 危险：二次注入
-- 第一步：用户输入被存储（看似无害）
INSERT INTO user (name) VALUES ('test');  
-- 实际输入可能是: test'); DELETE FROM user; --

-- 第二步：存储的数据被拼接到新查询（触发注入）
SET @stored_name = (SELECT name FROM user WHERE id = 1);
SET @sql = CONCAT('SELECT * FROM log WHERE user_name = ''', @stored_name, '''');
PREPARE stmt FROM @sql;
EXECUTE stmt;  -- 危险！

-- ✅ 安全：输出时也使用参数化
SET @stored_name = (SELECT name FROM user WHERE id = 1);
PREPARE stmt FROM 'SELECT * FROM log WHERE user_name = ?';
EXECUTE stmt USING @stored_name;
DEALLOCATE PREPARE stmt;
```

#### 3.1.2 时间盲注防护

```sql
-- ❌ 危险：允许 SLEEP/BENCHMARK 函数
-- 攻击者可通过响应时间推断数据
-- 例如：' OR IF(SUBSTRING(password,1,1)='a', SLEEP(5), 0) --

-- ✅ 防护措施：
-- 1. 使用参数化查询（根本解决）
-- 2. 设置查询超时
SET SESSION max_execution_time = 5000;  -- MySQL 5.7.8+，单位毫秒

-- 3. 在应用层限制危险函数（如果必须使用动态 SQL）
-- 检查输入中是否包含: SLEEP, BENCHMARK, WAITFOR
```

#### 3.1.3 整数溢出防护

```sql
-- ❌ 危险：未检查边界值
-- BIGINT UNSIGNED 最大值: 18446744073709551615
UPDATE account SET balance = balance + @amount WHERE id = 1;

-- ✅ 安全：检查边界值
IF @amount < 0 OR @amount > 9999999999 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '金额超出有效范围';
END IF;

-- 检查溢出
IF (SELECT balance FROM account WHERE id = 1) + @amount > 9999999999.99 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '余额将超出上限';
END IF;

UPDATE account SET balance = balance + @amount WHERE id = 1;
```

### 3.2 权限控制

```sql
-- ✅ 正确：最小权限原则
-- 只读用户
CREATE USER 'readonly_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT ON database_name.* TO 'readonly_user'@'%';

-- 应用用户（不给 DROP, ALTER 权限）
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON database_name.* TO 'app_user'@'%';

-- ❌ 危险：过度授权
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';
```

### 3.3 敏感数据保护

```sql
-- ✅ 正确：敏感数据脱敏
SELECT 
    id,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone_masked,
    CONCAT(LEFT(email, 3), '***', SUBSTRING(email, LOCATE('@', email))) AS email_masked
FROM user;

-- ❌ 错误：直接暴露敏感数据
SELECT id, phone, email, id_card, password FROM user;
```

### 3.4 DDL 安全

```sql
-- ✅ 正确：DDL 前检查
-- 删除表前确认
SELECT COUNT(*) FROM table_to_drop;  -- 先确认数据量
-- 备份数据
CREATE TABLE table_to_drop_backup AS SELECT * FROM table_to_drop;
-- 再删除
DROP TABLE IF EXISTS table_to_drop;

-- ❌ 危险：直接删除
DROP TABLE table_name;
TRUNCATE TABLE table_name;
```

## 4. 数据完整性

### 4.1 约束使用

```sql
-- ✅ 正确：完整的约束定义
CREATE TABLE user_order (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '订单金额',
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_order_no (order_no),
    KEY idx_user_id (user_id),
    KEY idx_status_created (status, created_at),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户订单表';

-- ❌ 错误：缺少约束
CREATE TABLE user_order (
    id INT,
    order_no VARCHAR(32),
    user_id INT,
    total_amount FLOAT,
    status VARCHAR(20),
    created_at TIMESTAMP
);
```

### 4.2 事务使用

```sql
-- ✅ 正确：使用事务保证一致性
START TRANSACTION;

-- 扣减库存
UPDATE product SET stock = stock - 1 WHERE id = 1 AND stock > 0;

-- 检查是否成功
IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '库存不足';
END IF;

-- 创建订单
INSERT INTO user_order (user_id, product_id, quantity) VALUES (1, 1, 1);

COMMIT;

-- ❌ 错误：无事务的关联操作
UPDATE product SET stock = stock - 1 WHERE id = 1;
INSERT INTO user_order (user_id, product_id, quantity) VALUES (1, 1, 1);
```

### 4.3 字段类型选择

| 场景 | 推荐类型 | 避免类型 |
|------|---------|---------|
| 主键 | `BIGINT UNSIGNED` | `INT` |
| 金额 | `DECIMAL(10,2)` | `FLOAT`, `DOUBLE` |
| 状态 | `TINYINT` 或 `ENUM` | `VARCHAR` |
| 时间 | `DATETIME` | `TIMESTAMP`（2038问题） |
| 长文本 | `TEXT` | `VARCHAR(65535)` |
| 布尔值 | `TINYINT(1)` | `CHAR(1)` |
| UUID | `BINARY(16)` | `VARCHAR(36)` |

## 5. 可维护性

### 5.1 存储过程规范

```sql
-- ✅ 正确：规范的存储过程
DELIMITER //

CREATE PROCEDURE sp_get_user_orders(
    IN p_user_id BIGINT,
    IN p_status VARCHAR(20),
    IN p_page INT,
    IN p_page_size INT
)
COMMENT '获取用户订单列表'
BEGIN
    -- 参数验证
    IF p_user_id IS NULL OR p_user_id <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '无效的用户ID';
    END IF;
    
    IF p_page IS NULL OR p_page < 1 THEN
        SET p_page = 1;
    END IF;
    
    IF p_page_size IS NULL OR p_page_size < 1 OR p_page_size > 100 THEN
        SET p_page_size = 20;
    END IF;
    
    -- 计算偏移量
    SET @offset = (p_page - 1) * p_page_size;
    
    -- 查询数据
    SELECT 
        id,
        order_no,
        total_amount,
        status,
        created_at
    FROM user_order
    WHERE user_id = p_user_id
        AND (p_status IS NULL OR status = p_status)
    ORDER BY created_at DESC
    LIMIT p_page_size OFFSET @offset;
END //

DELIMITER ;
```

### 5.2 变更脚本规范

```sql
-- ============================================
-- 变更脚本：添加用户手机号字段
-- 版本：V1.0.1
-- 作者：xxx
-- 日期：2024-01-01
-- JIRA：PROJ-123
-- ============================================

-- 前置检查
SELECT COUNT(*) FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'database_name' 
    AND TABLE_NAME = 'user' 
    AND COLUMN_NAME = 'phone';
-- 如果返回 0，则执行下面的变更

-- 变更内容
ALTER TABLE user ADD COLUMN phone VARCHAR(20) DEFAULT NULL COMMENT '手机号' AFTER email;
CREATE INDEX idx_user_phone ON user(phone);

-- 回滚脚本
-- ALTER TABLE user DROP INDEX idx_user_phone;
-- ALTER TABLE user DROP COLUMN phone;

-- 验证
DESCRIBE user;
SHOW INDEX FROM user WHERE Key_name = 'idx_user_phone';
```

## 6. 审查检查清单

### 6.1 语法规范检查

- [ ] 表名、字段名使用小写 + 下划线
- [ ] 索引命名符合规范（idx_, uk_, pk_, fk_）
- [ ] SQL 关键字使用大写
- [ ] 复杂查询有适当的格式和缩进
- [ ] 重要逻辑有注释说明

### 6.2 性能检查

- [ ] WHERE 条件字段有索引
- [ ] JOIN 关联字段有索引
- [ ] 避免 SELECT *
- [ ] 大表查询有 LIMIT
- [ ] 避免在索引字段使用函数
- [ ] 子查询考虑改用 JOIN
- [ ] 大批量操作分批执行
- [ ] 避免隐式类型转换
- [ ] 复合索引遵循最左前缀
- [ ] 考虑使用前缀索引（长字符串）

### 6.2.1 并发安全检查

- [ ] 多表更新按固定顺序加锁
- [ ] 高并发场景考虑乐观锁
- [ ] 避免 SELECT ... FOR UPDATE 范围过大
- [ ] 事务中无长时间操作

### 6.3 安全检查

- [ ] 无 SQL 字符串拼接
- [ ] 使用参数化查询
- [ ] 敏感数据已脱敏
- [ ] 权限遵循最小原则
- [ ] DDL 操作有备份
- [ ] 防范二次注入
- [ ] 整数参数有边界检查

### 6.4 数据完整性检查

- [ ] 表有主键
- [ ] 必要字段有 NOT NULL 约束
- [ ] 金额使用 DECIMAL 类型
- [ ] 关联操作使用事务
- [ ] 字段有默认值和注释

---

**相关资源**：
- [mysql-checklist.md](mysql-checklist.md) - MySQL 审查检查清单
- [examples/](examples/) - MySQL 审查示例
