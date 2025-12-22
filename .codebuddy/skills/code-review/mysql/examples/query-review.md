# MySQL 查询语句审查示例

## 示例 1：SELECT 查询优化

### 问题代码

```sql
-- 问题查询
SELECT * FROM user_order 
WHERE YEAR(created_at) = 2024 
    AND MONTH(created_at) = 1
    AND status IN ('paid', 'shipped', 'completed')
ORDER BY created_at DESC;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| SELECT * | P2 | 返回不必要字段 |
| 函数导致索引失效 | P1 | YEAR(), MONTH() 无法使用索引 |
| 无 LIMIT | P1 | 可能返回大量数据 |
| IN 列表可优化 | P3 | 可考虑使用范围条件 |

### 修复后代码

```sql
-- 优化后的查询
SELECT 
    id,
    order_no,
    user_id,
    amount,
    status,
    created_at
FROM user_order 
WHERE created_at >= '2024-01-01 00:00:00'
    AND created_at < '2024-02-01 00:00:00'
    AND status IN ('paid', 'shipped', 'completed')
ORDER BY created_at DESC
LIMIT 100;

-- 确保有复合索引
-- CREATE INDEX idx_created_status ON user_order(created_at, status);
```

### EXPLAIN 对比

```sql
-- 优化前：type=ALL, rows=100000 (全表扫描)
EXPLAIN SELECT * FROM user_order WHERE YEAR(created_at) = 2024;

-- 优化后：type=range, rows=5000 (范围扫描)
EXPLAIN SELECT id, order_no FROM user_order 
WHERE created_at >= '2024-01-01' AND created_at < '2024-02-01';
```

---

## 示例 2：JOIN 查询优化

### 问题代码

```sql
-- 问题查询：子查询效率低
SELECT 
    u.id,
    u.user_name,
    (SELECT COUNT(*) FROM user_order WHERE user_id = u.id) AS order_count,
    (SELECT SUM(amount) FROM user_order WHERE user_id = u.id) AS total_amount
FROM user u
WHERE u.status = 'active';
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 相关子查询 | P1 | 每行执行两次子查询，N+1 问题 |
| 无 LIMIT | P2 | 活跃用户可能很多 |
| 可能返回 NULL | P3 | 无订单用户的统计为 NULL |

### 修复后代码

```sql
-- 优化方案 1：使用 LEFT JOIN + GROUP BY
SELECT 
    u.id,
    u.user_name,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM user u
LEFT JOIN user_order o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.user_name
LIMIT 1000;

-- 优化方案 2：使用子查询（如果只需要部分用户）
SELECT 
    u.id,
    u.user_name,
    stats.order_count,
    stats.total_amount
FROM user u
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) AS order_count,
        SUM(amount) AS total_amount
    FROM user_order
    GROUP BY user_id
) stats ON u.id = stats.user_id
WHERE u.status = 'active'
LIMIT 1000;
```

---

## 示例 3：分页查询优化

### 问题代码

```sql
-- 深分页问题
SELECT * FROM user_order 
ORDER BY created_at DESC 
LIMIT 100000, 20;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 深分页性能差 | P0 | 需要扫描 100000+20 行 |
| SELECT * | P2 | 返回不必要字段 |

### 修复后代码

```sql
-- 方案 1：使用游标分页（推荐）
-- 第一页
SELECT id, order_no, amount, created_at
FROM user_order 
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 后续页（使用上一页最后一条的 created_at 和 id）
SELECT id, order_no, amount, created_at
FROM user_order 
WHERE (created_at, id) < ('2024-01-15 10:30:00', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 方案 2：延迟关联
SELECT o.id, o.order_no, o.amount, o.created_at
FROM user_order o
INNER JOIN (
    SELECT id FROM user_order 
    ORDER BY created_at DESC 
    LIMIT 100000, 20
) t ON o.id = t.id
ORDER BY o.created_at DESC;

-- 方案 3：使用覆盖索引 + 子查询
SELECT id, order_no, amount, created_at
FROM user_order
WHERE id >= (
    SELECT id FROM user_order 
    ORDER BY created_at DESC 
    LIMIT 100000, 1
)
ORDER BY created_at DESC
LIMIT 20;
```

---

## 示例 4：聚合查询优化

### 问题代码

```sql
-- 统计每日订单数和金额
SELECT 
    DATE(created_at) AS order_date,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM user_order
WHERE created_at >= '2024-01-01'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| GROUP BY 使用函数 | P1 | 无法利用索引 |
| 无时间范围上限 | P2 | 数据量不可控 |
| 大数据量聚合 | P2 | 可能需要优化 |

### 修复后代码

```sql
-- 方案 1：添加日期字段（推荐）
-- 先添加字段
ALTER TABLE user_order 
ADD COLUMN order_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED;
CREATE INDEX idx_order_date ON user_order(order_date);

-- 优化后的查询
SELECT 
    order_date,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM user_order
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY order_date
ORDER BY order_date DESC;

-- 方案 2：使用汇总表（大数据量场景）
-- 创建日统计表
CREATE TABLE order_daily_stats (
    stat_date DATE NOT NULL PRIMARY KEY,
    order_count INT UNSIGNED NOT NULL DEFAULT 0,
    total_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '订单日统计表';

-- 定时任务更新
INSERT INTO order_daily_stats (stat_date, order_count, total_amount)
SELECT 
    DATE(created_at),
    COUNT(*),
    SUM(amount)
FROM user_order
WHERE created_at >= CURDATE() - INTERVAL 1 DAY
    AND created_at < CURDATE()
GROUP BY DATE(created_at)
ON DUPLICATE KEY UPDATE
    order_count = VALUES(order_count),
    total_amount = VALUES(total_amount);
```

---

## 示例 5：EXISTS vs IN 优化

### 问题代码

```sql
-- 使用 IN 子查询
SELECT * FROM user
WHERE id IN (
    SELECT DISTINCT user_id 
    FROM user_order 
    WHERE amount > 1000
);
```

### 修复后代码

```sql
-- 方案 1：使用 EXISTS（外表小时更优）
SELECT u.*
FROM user u
WHERE EXISTS (
    SELECT 1 
    FROM user_order o 
    WHERE o.user_id = u.id AND o.amount > 1000
);

-- 方案 2：使用 JOIN（需要去重）
SELECT DISTINCT u.*
FROM user u
INNER JOIN user_order o ON u.id = o.user_id
WHERE o.amount > 1000;

-- 方案 3：使用 JOIN + GROUP BY
SELECT u.id, u.user_name, u.email
FROM user u
INNER JOIN user_order o ON u.id = o.user_id
WHERE o.amount > 1000
GROUP BY u.id, u.user_name, u.email;
```

### 选择建议

| 场景 | 推荐方案 |
|------|---------|
| 外表小，内表大 | EXISTS |
| 外表大，内表小 | IN |
| 需要内表字段 | JOIN |
| 去重需求 | JOIN + GROUP BY |

---

## 示例 6：OR 条件优化

### 问题代码

```sql
-- OR 条件可能导致全表扫描
SELECT * FROM user_order
WHERE user_id = 100 OR order_no = 'ORD202401001';
```

### 修复后代码

```sql
-- 方案 1：使用 UNION（推荐）
SELECT id, order_no, user_id, amount, created_at
FROM user_order WHERE user_id = 100
UNION
SELECT id, order_no, user_id, amount, created_at
FROM user_order WHERE order_no = 'ORD202401001';

-- 方案 2：使用 UNION ALL（如果确定无重复）
SELECT id, order_no, user_id, amount, created_at
FROM user_order WHERE user_id = 100
UNION ALL
SELECT id, order_no, user_id, amount, created_at
FROM user_order WHERE order_no = 'ORD202401001' AND user_id != 100;
```

---

## 示例 7：MySQL 8.0+ 窗口函数优化

### 问题代码

```sql
-- 使用子查询计算排名
SELECT 
    u.id,
    u.user_name,
    u.total_amount,
    (SELECT COUNT(*) + 1 FROM user u2 
     WHERE u2.total_amount > u.total_amount) AS rank
FROM user u
ORDER BY total_amount DESC;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 相关子查询 | P1 | 每行执行一次子查询，O(n²) 复杂度 |
| 性能差 | P1 | 大数据量时极慢 |

### 修复后代码（MySQL 8.0+）

```sql
-- ✅ 使用窗口函数（MySQL 8.0+）
SELECT 
    id,
    user_name,
    total_amount,
    RANK() OVER (ORDER BY total_amount DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY total_amount DESC) AS dense_rank,
    ROW_NUMBER() OVER (ORDER BY total_amount DESC) AS row_num
FROM user
ORDER BY total_amount DESC;

-- 分组排名
SELECT 
    id,
    user_name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employee;
```

### 版本兼容性

| 版本 | 方案 |
|------|------|
| MySQL 8.0+ | 使用窗口函数 |
| MySQL 5.7 | 使用变量模拟或子查询 |

---

## 示例 8：MySQL 8.0+ CTE 优化

### 问题代码

```sql
-- 多次使用相同子查询
SELECT 
    u.id,
    u.user_name,
    (SELECT SUM(amount) FROM user_order WHERE user_id = u.id) AS total_amount,
    (SELECT COUNT(*) FROM user_order WHERE user_id = u.id) AS order_count,
    (SELECT AVG(amount) FROM user_order WHERE user_id = u.id) AS avg_amount
FROM user u
WHERE u.status = 'active';
```

### 修复后代码（MySQL 8.0+）

```sql
-- ✅ 使用 CTE（公共表表达式）
WITH user_stats AS (
    SELECT 
        user_id,
        SUM(amount) AS total_amount,
        COUNT(*) AS order_count,
        AVG(amount) AS avg_amount
    FROM user_order
    GROUP BY user_id
)
SELECT 
    u.id,
    u.user_name,
    COALESCE(s.total_amount, 0) AS total_amount,
    COALESCE(s.order_count, 0) AS order_count,
    COALESCE(s.avg_amount, 0) AS avg_amount
FROM user u
LEFT JOIN user_stats s ON u.id = s.user_id
WHERE u.status = 'active';

-- 递归 CTE 示例：查询组织架构
WITH RECURSIVE org_tree AS (
    -- 基础查询：顶级部门
    SELECT id, name, parent_id, 1 AS level
    FROM department
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- 递归查询：子部门
    SELECT d.id, d.name, d.parent_id, t.level + 1
    FROM department d
    INNER JOIN org_tree t ON d.parent_id = t.id
    WHERE t.level < 10  -- 防止无限递归
)
SELECT * FROM org_tree ORDER BY level, name;
```

### 版本兼容性

| 版本 | 方案 |
|------|------|
| MySQL 8.0+ | 使用 CTE，支持递归 |
| MySQL 5.7 | 使用临时表或多次 JOIN |

---

## 示例 9：MySQL 8.0+ JSON 处理

### 问题代码

```sql
-- 在应用层处理 JSON
SELECT id, config FROM system_config;
-- 然后在应用代码中解析 JSON
```

### 修复后代码（MySQL 8.0+）

```sql
-- ✅ 使用 JSON 函数直接查询
SELECT 
    id,
    JSON_EXTRACT(config, '$.database.host') AS db_host,
    JSON_EXTRACT(config, '$.database.port') AS db_port,
    config->>'$.app.name' AS app_name  -- 简写语法，返回无引号字符串
FROM system_config;

-- 使用 JSON_TABLE 将 JSON 数组转为行（MySQL 8.0.4+）
SELECT 
    o.id AS order_id,
    items.item_id,
    items.quantity,
    items.price
FROM user_order o,
JSON_TABLE(
    o.order_items,
    '$[*]' COLUMNS (
        item_id INT PATH '$.item_id',
        quantity INT PATH '$.quantity',
        price DECIMAL(10,2) PATH '$.price'
    )
) AS items;

-- JSON 索引（MySQL 8.0.17+）
-- 创建函数索引加速 JSON 查询
ALTER TABLE system_config 
ADD INDEX idx_app_name ((CAST(config->>'$.app.name' AS CHAR(100))));
```

### 版本兼容性

| 功能 | 版本要求 |
|------|---------|
| JSON 数据类型 | MySQL 5.7.8+ |
| JSON_EXTRACT | MySQL 5.7+ |
| ->> 操作符 | MySQL 5.7.13+ |
| JSON_TABLE | MySQL 8.0.4+ |
| JSON 函数索引 | MySQL 8.0.17+ |

---

## 示例 10：隐式类型转换

### 问题代码

```sql
-- ❌ 隐式类型转换导致索引失效
-- phone 字段是 VARCHAR(20)
SELECT * FROM user WHERE phone = 13800138000;

-- order_no 字段是 VARCHAR(32)
SELECT * FROM user_order WHERE order_no = 202401001;
```

### 问题分析

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 隐式转换 | P1 | 数字与字符串比较，MySQL 将字符串转为数字 |
| 索引失效 | P1 | 全表扫描 |

### 修复后代码

```sql
-- ✅ 保持类型一致
SELECT * FROM user WHERE phone = '13800138000';
SELECT * FROM user_order WHERE order_no = '202401001';

-- 检查隐式转换的方法
EXPLAIN SELECT * FROM user WHERE phone = 13800138000;
-- 如果 type=ALL，可能存在隐式转换

-- 使用 SHOW WARNINGS 查看优化器信息
EXPLAIN SELECT * FROM user WHERE phone = 13800138000;
SHOW WARNINGS;
-- 会显示类似：Cannot use range access on index 'idx_phone' due to type or collation conversion
```

### 常见隐式转换场景

| 场景 | 问题 | 修复 |
|------|------|------|
| VARCHAR 字段用数字查询 | 索引失效 | 使用字符串 |
| 不同字符集 JOIN | 索引失效 | 统一字符集 |
| 不同排序规则比较 | 索引失效 | 统一排序规则 |
| DATE 与 DATETIME 比较 | 可能不走索引 | 显式转换 |

---

## 查询优化检查清单

- [ ] 避免 SELECT *，明确指定字段
- [ ] WHERE 条件字段有索引
- [ ] 避免在索引字段使用函数
- [ ] 大表查询有 LIMIT
- [ ] 深分页使用游标分页
- [ ] 子查询考虑改用 JOIN
- [ ] OR 条件考虑改用 UNION
- [ ] 使用 EXPLAIN 验证执行计划
- [ ] 避免隐式类型转换
- [ ] MySQL 8.0+ 考虑使用窗口函数
- [ ] MySQL 8.0+ 考虑使用 CTE 提升可读性
- [ ] 使用 EXPLAIN ANALYZE 分析实际执行（MySQL 8.0.18+）
