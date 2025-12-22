# MySQL 存储过程审查示例

## 示例 1：存储过程基础规范

### 问题代码

```sql
DELIMITER //
CREATE PROCEDURE getUserOrders(userId INT)
BEGIN
    SELECT * FROM orders WHERE user_id = userId;
END //
DELIMITER ;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 命名不规范 | P2 | 应使用 `sp_` 前缀和下划线命名 |
| 参数命名 | P2 | 应使用 `p_` 前缀区分参数 |
| 无注释 | P3 | 缺少功能说明 |
| SELECT * | P2 | 应明确指定字段 |
| 无输入验证 | P1 | 未验证参数有效性 |
| 无 LIMIT | P2 | 可能返回大量数据 |

### 修复后代码

```sql
DELIMITER //

/*
 * 存储过程：获取用户订单列表
 * 功能：根据用户ID查询订单信息
 * 参数：
 *   p_user_id - 用户ID
 *   p_page - 页码（从1开始）
 *   p_page_size - 每页数量
 * 返回：订单列表
 * 作者：xxx
 * 日期：2024-01-15
 */
CREATE PROCEDURE sp_get_user_orders(
    IN p_user_id BIGINT,
    IN p_page INT,
    IN p_page_size INT
)
COMMENT '获取用户订单列表'
BEGIN
    DECLARE v_offset INT;
    
    -- 参数验证
    IF p_user_id IS NULL OR p_user_id <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '无效的用户ID';
    END IF;
    
    -- 分页参数默认值
    IF p_page IS NULL OR p_page < 1 THEN
        SET p_page = 1;
    END IF;
    
    IF p_page_size IS NULL OR p_page_size < 1 THEN
        SET p_page_size = 20;
    ELSEIF p_page_size > 100 THEN
        SET p_page_size = 100;  -- 限制最大每页数量
    END IF;
    
    SET v_offset = (p_page - 1) * p_page_size;
    
    -- 查询订单
    SELECT 
        id,
        order_no,
        amount,
        status,
        created_at
    FROM user_order
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT p_page_size OFFSET v_offset;
END //

DELIMITER ;
```

---

## 示例 2：事务处理

### 问题代码

```sql
DELIMITER //
CREATE PROCEDURE sp_create_order(
    IN p_user_id INT,
    IN p_product_id INT,
    IN p_quantity INT
)
BEGIN
    -- 扣减库存
    UPDATE product SET stock = stock - p_quantity WHERE id = p_product_id;
    
    -- 创建订单
    INSERT INTO user_order (user_id, product_id, quantity) 
    VALUES (p_user_id, p_product_id, p_quantity);
END //
DELIMITER ;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无事务控制 | P0 | 两个操作应在同一事务 |
| 无库存检查 | P0 | 可能导致库存为负 |
| 无异常处理 | P0 | 失败时无法回滚 |
| 无输入验证 | P1 | 参数未验证 |

### 修复后代码

```sql
DELIMITER //

CREATE PROCEDURE sp_create_order(
    IN p_user_id BIGINT,
    IN p_product_id BIGINT,
    IN p_quantity INT,
    OUT p_order_id BIGINT,
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(200)
)
COMMENT '创建订单（含库存扣减）'
BEGIN
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(12,2);
    DECLARE v_order_no VARCHAR(32);
    
    -- 异常处理
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_result_msg = MESSAGE_TEXT;
        SET p_result_code = -1;
        ROLLBACK;
    END;
    
    -- 初始化返回值
    SET p_order_id = 0;
    SET p_result_code = 0;
    SET p_result_msg = 'SUCCESS';
    
    -- 参数验证
    IF p_user_id IS NULL OR p_user_id <= 0 THEN
        SET p_result_code = 1;
        SET p_result_msg = '无效的用户ID';
        LEAVE sp_create_order;
    END IF;
    
    IF p_product_id IS NULL OR p_product_id <= 0 THEN
        SET p_result_code = 2;
        SET p_result_msg = '无效的商品ID';
        LEAVE sp_create_order;
    END IF;
    
    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        SET p_result_code = 3;
        SET p_result_msg = '无效的数量';
        LEAVE sp_create_order;
    END IF;
    
    START TRANSACTION;
    
    -- 查询商品信息并加锁
    SELECT stock, price INTO v_stock, v_price
    FROM product
    WHERE id = p_product_id
    FOR UPDATE;
    
    IF v_stock IS NULL THEN
        SET p_result_code = 4;
        SET p_result_msg = '商品不存在';
        ROLLBACK;
        LEAVE sp_create_order;
    END IF;
    
    -- 检查库存
    IF v_stock < p_quantity THEN
        SET p_result_code = 5;
        SET p_result_msg = CONCAT('库存不足，当前库存：', v_stock);
        ROLLBACK;
        LEAVE sp_create_order;
    END IF;
    
    -- 生成订单号
    SET v_order_no = CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), 
                            LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    -- 扣减库存
    UPDATE product 
    SET stock = stock - p_quantity,
        updated_at = NOW()
    WHERE id = p_product_id;
    
    -- 创建订单
    INSERT INTO user_order (
        order_no,
        user_id, 
        product_id, 
        quantity,
        unit_price,
        total_amount,
        status,
        created_at
    ) VALUES (
        v_order_no,
        p_user_id, 
        p_product_id, 
        p_quantity,
        v_price,
        v_price * p_quantity,
        'pending',
        NOW()
    );
    
    SET p_order_id = LAST_INSERT_ID();
    
    COMMIT;
    
END //

DELIMITER ;

-- 调用示例
CALL sp_create_order(1, 100, 2, @order_id, @code, @msg);
SELECT @order_id, @code, @msg;
```

---

## 示例 3：游标使用

### 问题代码

```sql
DELIMITER //
CREATE PROCEDURE sp_batch_update_status()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_id INT;
    DECLARE cur CURSOR FOR SELECT id FROM user_order WHERE status = 'pending';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- 逐条更新（性能差）
        UPDATE user_order SET status = 'expired' WHERE id = v_id;
    END LOOP;
    CLOSE cur;
END //
DELIMITER ;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 逐条更新 | P1 | 性能差，应批量更新 |
| 无条件限制 | P1 | 可能处理大量数据 |
| 无事务控制 | P2 | 部分成功部分失败 |
| 无进度反馈 | P3 | 无法知道处理进度 |

### 修复后代码

```sql
DELIMITER //

CREATE PROCEDURE sp_batch_update_expired_orders(
    IN p_batch_size INT,
    IN p_expire_days INT,
    OUT p_total_updated INT
)
COMMENT '批量更新过期订单状态'
BEGIN
    DECLARE v_affected_rows INT DEFAULT 1;
    DECLARE v_batch_count INT DEFAULT 0;
    
    -- 异常处理
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- 参数默认值
    IF p_batch_size IS NULL OR p_batch_size <= 0 THEN
        SET p_batch_size = 1000;
    END IF;
    
    IF p_expire_days IS NULL OR p_expire_days <= 0 THEN
        SET p_expire_days = 7;
    END IF;
    
    SET p_total_updated = 0;
    
    -- 批量更新循环
    WHILE v_affected_rows > 0 DO
        START TRANSACTION;
        
        UPDATE user_order 
        SET status = 'expired',
            updated_at = NOW()
        WHERE status = 'pending'
            AND created_at < DATE_SUB(NOW(), INTERVAL p_expire_days DAY)
        LIMIT p_batch_size;
        
        SET v_affected_rows = ROW_COUNT();
        SET p_total_updated = p_total_updated + v_affected_rows;
        SET v_batch_count = v_batch_count + 1;
        
        COMMIT;
        
        -- 避免锁表，添加短暂延迟
        IF v_affected_rows > 0 THEN
            DO SLEEP(0.1);
        END IF;
    END WHILE;
    
    -- 返回统计信息
    SELECT 
        p_total_updated AS total_updated,
        v_batch_count AS batch_count,
        'SUCCESS' AS result;
END //

DELIMITER ;

-- 调用示例
CALL sp_batch_update_expired_orders(1000, 7, @total);
SELECT @total;
```

---

## 示例 4：错误处理

### 问题代码

```sql
DELIMITER //
CREATE PROCEDURE sp_transfer_money(
    IN p_from_user INT,
    IN p_to_user INT,
    IN p_amount DECIMAL(10,2)
)
BEGIN
    UPDATE user_account SET balance = balance - p_amount WHERE user_id = p_from_user;
    UPDATE user_account SET balance = balance + p_amount WHERE user_id = p_to_user;
END //
DELIMITER ;
```

### 修复后代码

```sql
DELIMITER //

CREATE PROCEDURE sp_transfer_money(
    IN p_from_user BIGINT,
    IN p_to_user BIGINT,
    IN p_amount DECIMAL(12,2),
    IN p_operator_id BIGINT,
    OUT p_transfer_id BIGINT,
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(200)
)
COMMENT '用户转账'
BEGIN
    DECLARE v_from_balance DECIMAL(12,2);
    DECLARE v_to_exists INT;
    DECLARE v_transfer_no VARCHAR(32);
    
    -- 异常处理
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_result_msg = MESSAGE_TEXT;
        SET p_result_code = -1;
        
        -- 记录失败日志
        INSERT INTO transfer_log (
            transfer_no, from_user, to_user, amount, 
            status, error_msg, created_at
        ) VALUES (
            v_transfer_no, p_from_user, p_to_user, p_amount,
            'failed', p_result_msg, NOW()
        );
        
        ROLLBACK;
    END;
    
    -- 初始化
    SET p_transfer_id = 0;
    SET p_result_code = 0;
    SET p_result_msg = 'SUCCESS';
    SET v_transfer_no = CONCAT('TRF', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),
                               LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    -- 参数验证
    IF p_from_user IS NULL OR p_from_user <= 0 THEN
        SET p_result_code = 1;
        SET p_result_msg = '无效的转出用户';
        LEAVE sp_transfer_money;
    END IF;
    
    IF p_to_user IS NULL OR p_to_user <= 0 THEN
        SET p_result_code = 2;
        SET p_result_msg = '无效的转入用户';
        LEAVE sp_transfer_money;
    END IF;
    
    IF p_from_user = p_to_user THEN
        SET p_result_code = 3;
        SET p_result_msg = '不能转账给自己';
        LEAVE sp_transfer_money;
    END IF;
    
    IF p_amount IS NULL OR p_amount <= 0 THEN
        SET p_result_code = 4;
        SET p_result_msg = '无效的转账金额';
        LEAVE sp_transfer_money;
    END IF;
    
    IF p_amount > 50000 THEN
        SET p_result_code = 5;
        SET p_result_msg = '单笔转账不能超过50000';
        LEAVE sp_transfer_money;
    END IF;
    
    START TRANSACTION;
    
    -- 按固定顺序加锁（避免死锁）
    IF p_from_user < p_to_user THEN
        SELECT balance INTO v_from_balance
        FROM user_account WHERE user_id = p_from_user FOR UPDATE;
        
        SELECT 1 INTO v_to_exists
        FROM user_account WHERE user_id = p_to_user FOR UPDATE;
    ELSE
        SELECT 1 INTO v_to_exists
        FROM user_account WHERE user_id = p_to_user FOR UPDATE;
        
        SELECT balance INTO v_from_balance
        FROM user_account WHERE user_id = p_from_user FOR UPDATE;
    END IF;
    
    -- 检查账户
    IF v_from_balance IS NULL THEN
        SET p_result_code = 6;
        SET p_result_msg = '转出账户不存在';
        ROLLBACK;
        LEAVE sp_transfer_money;
    END IF;
    
    IF v_to_exists IS NULL THEN
        SET p_result_code = 7;
        SET p_result_msg = '转入账户不存在';
        ROLLBACK;
        LEAVE sp_transfer_money;
    END IF;
    
    -- 检查余额
    IF v_from_balance < p_amount THEN
        SET p_result_code = 8;
        SET p_result_msg = CONCAT('余额不足，当前余额：', v_from_balance);
        ROLLBACK;
        LEAVE sp_transfer_money;
    END IF;
    
    -- 执行转账
    UPDATE user_account 
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE user_id = p_from_user;
    
    UPDATE user_account 
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE user_id = p_to_user;
    
    -- 记录转账流水
    INSERT INTO transfer_record (
        transfer_no,
        from_user,
        to_user,
        amount,
        status,
        operator_id,
        created_at
    ) VALUES (
        v_transfer_no,
        p_from_user,
        p_to_user,
        p_amount,
        'success',
        p_operator_id,
        NOW()
    );
    
    SET p_transfer_id = LAST_INSERT_ID();
    
    COMMIT;
    
END //

DELIMITER ;
```

---

## 存储过程审查检查清单

### 命名规范
- [ ] 使用 `sp_` 前缀
- [ ] 使用下划线命名法
- [ ] 参数使用 `p_` 前缀
- [ ] 局部变量使用 `v_` 前缀

### 代码规范
- [ ] 有功能注释说明
- [ ] 参数有验证逻辑
- [ ] 避免 SELECT *
- [ ] 有 LIMIT 限制

### 事务控制
- [ ] 关联操作使用事务
- [ ] 有异常处理器
- [ ] 异常时回滚
- [ ] 避免长事务

### 错误处理
- [ ] 使用 SIGNAL 抛出业务异常
- [ ] 有 OUT 参数返回结果
- [ ] 错误信息清晰
- [ ] 有错误日志记录

### 性能优化
- [ ] 避免游标逐条处理
- [ ] 大批量操作分批执行
- [ ] 合理使用索引
- [ ] 避免重复查询
