# MySQL DDL 审查示例

## 示例 1：建表语句审查

### 问题代码

```sql
CREATE TABLE orders (
    id INT,
    orderNo VARCHAR(50),
    userId INT,
    amount FLOAT,
    Status VARCHAR(20),
    create_time TIMESTAMP
);
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无主键 | P0 | 表必须有主键 |
| 字段命名不规范 | P2 | `orderNo`, `userId`, `Status` 应使用下划线 |
| 金额使用 FLOAT | P1 | 精度丢失风险，应使用 DECIMAL |
| 无 NOT NULL 约束 | P2 | 必要字段应有约束 |
| 无字段注释 | P3 | 缺少 COMMENT |
| 无索引 | P1 | 常用查询字段应建索引 |
| 无字符集指定 | P2 | 应明确指定 utf8mb4 |

### 修复后代码

```sql
CREATE TABLE user_order (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_no VARCHAR(50) NOT NULL COMMENT '订单号',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '订单金额',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '订单状态：0-待支付，1-已支付，2-已发货，3-已完成，4-已取消',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_order_no (order_no),
    KEY idx_user_id (user_id),
    KEY idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户订单表';
```

---

## 示例 2：ALTER TABLE 审查

### 问题代码

```sql
-- 直接在生产环境执行
ALTER TABLE user ADD COLUMN phone VARCHAR(20);
ALTER TABLE user ADD INDEX idx_phone (phone);
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无前置检查 | P1 | 应先检查字段/索引是否存在 |
| 无版本信息 | P2 | 变更脚本应有版本号 |
| 无回滚脚本 | P1 | 应提供回滚方案 |
| 无字段注释 | P3 | 新字段应有 COMMENT |
| 大表风险 | P0 | 大表 DDL 可能锁表 |

### 修复后代码

```sql
-- ============================================
-- 变更脚本：V1.2.0_add_user_phone.sql
-- 功能：为 user 表添加手机号字段
-- 作者：xxx
-- 日期：2024-01-15
-- JIRA：PROJ-456
-- ============================================

-- 前置检查：确认字段不存在
SELECT COUNT(*) AS field_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'user' 
    AND COLUMN_NAME = 'phone';
-- 期望结果：0

-- 前置检查：确认表大小（大表需要使用 pt-online-schema-change）
SELECT 
    table_rows,
    ROUND(data_length/1024/1024, 2) AS data_mb
FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'user';
-- 如果超过 100 万行，建议使用 pt-online-schema-change

-- 执行变更
ALTER TABLE user 
    ADD COLUMN phone VARCHAR(20) DEFAULT NULL COMMENT '手机号' AFTER email;

ALTER TABLE user 
    ADD INDEX idx_user_phone (phone);

-- 验证变更
DESCRIBE user;
SHOW INDEX FROM user WHERE Key_name = 'idx_user_phone';

-- ============================================
-- 回滚脚本（如需回滚执行以下语句）
-- ============================================
-- ALTER TABLE user DROP INDEX idx_user_phone;
-- ALTER TABLE user DROP COLUMN phone;
```

---

## 示例 3：索引设计审查

### 问题代码

```sql
-- 创建过多单列索引
CREATE INDEX idx_status ON user_order(status);
CREATE INDEX idx_user_id ON user_order(user_id);
CREATE INDEX idx_created_at ON user_order(created_at);
CREATE INDEX idx_amount ON user_order(amount);

-- 常见查询
SELECT * FROM user_order 
WHERE user_id = 1 AND status = 1 
ORDER BY created_at DESC;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 索引过多 | P2 | 影响写入性能 |
| 缺少复合索引 | P1 | 常用组合查询应建复合索引 |
| 低选择性字段索引 | P2 | status 选择性低，单独建索引效果差 |
| SELECT * | P2 | 应明确指定字段 |

### 修复后代码

```sql
-- 根据查询模式设计复合索引
-- 常见查询 1：按用户查订单
-- SELECT ... WHERE user_id = ? ORDER BY created_at DESC
CREATE INDEX idx_user_created ON user_order(user_id, created_at DESC);

-- 常见查询 2：按用户和状态查订单
-- SELECT ... WHERE user_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_user_status_created ON user_order(user_id, status, created_at DESC);

-- 删除冗余索引
DROP INDEX idx_status ON user_order;
DROP INDEX idx_user_id ON user_order;  -- 被复合索引覆盖
DROP INDEX idx_created_at ON user_order;
DROP INDEX idx_amount ON user_order;  -- 很少用于查询条件

-- 优化后的查询
SELECT id, order_no, amount, status, created_at
FROM user_order 
WHERE user_id = 1 AND status = 1 
ORDER BY created_at DESC
LIMIT 20;
```

### 索引设计原则

1. **最左前缀原则**：复合索引按查询条件顺序设计
2. **选择性原则**：高选择性字段放前面
3. **覆盖索引**：尽量让查询字段被索引覆盖
4. **避免冗余**：`(a, b)` 索引可覆盖 `(a)` 的查询

---

## 示例 4：外键设计审查

### 问题代码

```sql
CREATE TABLE order_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2)
);

-- 无外键约束，数据完整性无法保证
```

### 修复后代码

```sql
CREATE TABLE order_item (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    order_id BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
    product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '数量',
    unit_price DECIMAL(12,2) NOT NULL COMMENT '单价',
    total_price DECIMAL(12,2) NOT NULL COMMENT '小计金额',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    KEY idx_order_id (order_id),
    KEY idx_product_id (product_id),
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) 
        REFERENCES user_order(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) 
        REFERENCES product(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';
```

### 外键策略说明

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| CASCADE | 级联删除/更新 | 强依赖关系，如订单-订单项 |
| RESTRICT | 禁止删除/更新 | 被引用时不允许操作 |
| SET NULL | 设为 NULL | 弱依赖关系 |
| NO ACTION | 同 RESTRICT | 默认行为 |

---

## 审查总结

### DDL 审查检查清单

- [ ] 表名、字段名符合命名规范
- [ ] 有主键定义
- [ ] 必要字段有 NOT NULL 约束
- [ ] 金额使用 DECIMAL 类型
- [ ] 有适当的索引设计
- [ ] 字段有 COMMENT 注释
- [ ] 指定字符集 utf8mb4
- [ ] 变更脚本有版本信息
- [ ] 有回滚方案
- [ ] 大表变更有风险评估
