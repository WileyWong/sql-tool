# MySQL 进阶专项审查指南

基于 MySQL 8.0+ 新特性的进阶代码审查，覆盖 JSON、窗口函数、CTE、分区表等。

> 📚 **前置**: 请先阅读 [MySQL 基础审查指南](mysql-review.md)
> ⚠️ **版本要求**: 本指南主要针对 MySQL 8.0+，部分特性需要特定版本

## 进阶审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| JSON 字段使用 | 25% | 索引策略、查询优化、数据建模 |
| 窗口函数 | 25% | 正确使用、性能优化、替代方案 |
| CTE 公共表表达式 | 25% | 递归 CTE、可读性、性能 |
| 分区表设计 | 25% | 分区策略、裁剪验证、维护 |

---

## 一、JSON 字段使用 [MySQL 5.7.8+]

### 1.1 JSON 字段建模

```sql
-- ✅ 适合 JSON 的场景
-- 1. 动态属性（不同记录有不同字段）
CREATE TABLE product (
    id BIGINT UNSIGNED PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    attributes JSON COMMENT '动态属性，如颜色、尺寸、材质等',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 示例数据
INSERT INTO product (id, name, category, attributes) VALUES
(1, 'T恤', '服装', '{"color": "红色", "size": "L", "material": "棉"}'),
(2, '手机', '电子', '{"brand": "Apple", "storage": "128GB", "color": "黑色"}');

-- 2. 配置信息
CREATE TABLE user_settings (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    settings JSON NOT NULL DEFAULT '{}',
    CONSTRAINT chk_settings CHECK (JSON_VALID(settings))
);

-- 3. 日志/事件数据
CREATE TABLE event_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type)
);

-- ❌ 不适合 JSON 的场景
-- 1. 需要频繁查询/索引的核心字段
-- 2. 需要外键关联的字段
-- 3. 需要聚合计算的数值字段
CREATE TABLE order_bad (
    id BIGINT PRIMARY KEY,
    data JSON  -- ❌ 把所有字段都放 JSON 里
);
```

### 1.2 JSON 索引策略

```sql
-- ✅ 使用虚拟列 + 索引 [MySQL 5.7+]
ALTER TABLE product 
ADD COLUMN attr_color VARCHAR(50) 
    GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.color'))) VIRTUAL,
ADD INDEX idx_attr_color (attr_color);

-- 简化语法
ALTER TABLE product 
ADD COLUMN attr_color VARCHAR(50) 
    GENERATED ALWAYS AS (attributes->>'$.color') VIRTUAL,
ADD INDEX idx_attr_color (attr_color);

-- 查询时使用虚拟列
SELECT * FROM product WHERE attr_color = '红色';

-- ✅ 多值索引 [MySQL 8.0.17+]
-- 适用于 JSON 数组
CREATE TABLE article (
    id BIGINT UNSIGNED PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    tags JSON COMMENT '标签数组，如 ["技术", "Go", "后端"]'
);

-- 创建多值索引
ALTER TABLE article 
ADD INDEX idx_tags ((CAST(tags AS CHAR(50) ARRAY)));

-- 查询包含特定标签的文章
SELECT * FROM article 
WHERE JSON_CONTAINS(tags, '"Go"');

-- 或使用 MEMBER OF [MySQL 8.0.17+]
SELECT * FROM article 
WHERE 'Go' MEMBER OF (tags);

-- ✅ 函数索引 [MySQL 8.0.13+]
CREATE INDEX idx_lower_name ON product ((LOWER(name)));
CREATE INDEX idx_json_color ON product ((CAST(attributes->>'$.color' AS CHAR(50))));
```

### 1.3 JSON 查询优化

```sql
-- ✅ 提取 JSON 值
-- JSON_EXTRACT 返回 JSON 类型
SELECT JSON_EXTRACT(attributes, '$.color') FROM product;  -- 返回 "红色"（带引号）

-- ->> 返回字符串（推荐）
SELECT attributes->>'$.color' FROM product;  -- 返回 红色（无引号）

-- ✅ 条件查询
-- 使用虚拟列索引（最优）
SELECT * FROM product WHERE attr_color = '红色';

-- 直接查询 JSON（无索引时全表扫描）
SELECT * FROM product 
WHERE attributes->>'$.color' = '红色';

-- ✅ JSON 数组操作
-- 检查数组是否包含值
SELECT * FROM article 
WHERE JSON_CONTAINS(tags, '"Go"');

-- 检查值是否在数组中 [MySQL 8.0.17+]
SELECT * FROM article 
WHERE 'Go' MEMBER OF (tags);

-- 获取数组长度
SELECT title, JSON_LENGTH(tags) AS tag_count FROM article;

-- ✅ JSON 聚合 [MySQL 8.0+]
-- 将多行合并为 JSON 数组
SELECT 
    category,
    JSON_ARRAYAGG(name) AS products
FROM product
GROUP BY category;

-- 将多行合并为 JSON 对象
SELECT 
    category,
    JSON_OBJECTAGG(name, attributes->>'$.color') AS product_colors
FROM product
GROUP BY category;

-- ❌ 避免在大数据集上使用复杂 JSON 函数
SELECT * FROM large_table 
WHERE JSON_SEARCH(data, 'all', '%keyword%') IS NOT NULL;  -- 性能差
```

### 1.4 JSON 数据修改

```sql
-- ✅ 更新 JSON 字段的部分内容
-- JSON_SET：设置值（存在则更新，不存在则添加）
UPDATE product 
SET attributes = JSON_SET(attributes, '$.color', '蓝色')
WHERE id = 1;

-- JSON_INSERT：仅插入（存在则忽略）
UPDATE product 
SET attributes = JSON_INSERT(attributes, '$.weight', '200g')
WHERE id = 1;

-- JSON_REPLACE：仅替换（不存在则忽略）
UPDATE product 
SET attributes = JSON_REPLACE(attributes, '$.color', '绿色')
WHERE id = 1;

-- JSON_REMOVE：删除键
UPDATE product 
SET attributes = JSON_REMOVE(attributes, '$.material')
WHERE id = 1;

-- ✅ 数组操作
-- 追加元素
UPDATE article 
SET tags = JSON_ARRAY_APPEND(tags, '$', '新标签')
WHERE id = 1;

-- 插入元素到指定位置
UPDATE article 
SET tags = JSON_ARRAY_INSERT(tags, '$[0]', '首标签')
WHERE id = 1;

-- ❌ 避免频繁更新大 JSON 字段
-- 每次更新都会重写整个 JSON
UPDATE product SET attributes = '{"全新的大JSON"}' WHERE id = 1;
```

### 1.5 JSON vs 关系型设计

```sql
-- 场景：用户有多个地址

-- ❌ JSON 方案（不推荐用于核心业务数据）
CREATE TABLE user_with_json (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    addresses JSON  -- [{"city": "北京", "street": "..."}, {...}]
);

-- 问题：
-- 1. 无法对地址建立外键
-- 2. 无法高效查询"所有北京用户"
-- 3. 地址数量限制不明确

-- ✅ 关系型方案（推荐）
CREATE TABLE user (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE user_address (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(200),
    is_default TINYINT(1) DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_city (city),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- ✅ 混合方案：核心字段关系型 + 扩展属性 JSON
CREATE TABLE user_profile (
    user_id BIGINT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    avatar VARCHAR(200),
    extra_info JSON DEFAULT '{}' COMMENT '扩展信息',
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

---

## 二、窗口函数 [MySQL 8.0+]

### 2.1 基础窗口函数

```sql
-- ✅ ROW_NUMBER：行号
SELECT 
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept
FROM employee;

-- ✅ RANK：排名（相同值同名次，跳号）
SELECT 
    name,
    score,
    RANK() OVER (ORDER BY score DESC) AS rank
FROM student;
-- 结果：100分-第1名，100分-第1名，90分-第3名

-- ✅ DENSE_RANK：排名（相同值同名次，不跳号）
SELECT 
    name,
    score,
    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM student;
-- 结果：100分-第1名，100分-第1名，90分-第2名

-- ✅ NTILE：分组
SELECT 
    name,
    salary,
    NTILE(4) OVER (ORDER BY salary DESC) AS quartile  -- 分成4组
FROM employee;
```

### 2.2 聚合窗口函数

```sql
-- ✅ 累计求和
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- ✅ 移动平均
SELECT 
    order_date,
    amount,
    AVG(amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7days
FROM orders;

-- ✅ 部门内占比
SELECT 
    name,
    department,
    salary,
    salary / SUM(salary) OVER (PARTITION BY department) AS salary_ratio
FROM employee;

-- ✅ 同比/环比
SELECT 
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,
    revenue - LAG(revenue, 1) OVER (ORDER BY month) AS mom_change,
    LAG(revenue, 12) OVER (ORDER BY month) AS prev_year,
    revenue - LAG(revenue, 12) OVER (ORDER BY month) AS yoy_change
FROM monthly_revenue;
```

### 2.3 窗口函数性能优化

```sql
-- ✅ 使用命名窗口减少重复计算
SELECT 
    name,
    department,
    salary,
    ROW_NUMBER() OVER w AS row_num,
    RANK() OVER w AS rank,
    SUM(salary) OVER w AS dept_total
FROM employee
WINDOW w AS (PARTITION BY department ORDER BY salary DESC);

-- ✅ 添加索引支持窗口函数
-- PARTITION BY 和 ORDER BY 的字段应有索引
CREATE INDEX idx_dept_salary ON employee(department, salary DESC);

-- ❌ 避免在大数据集上使用无限制的窗口
SELECT 
    *,
    SUM(amount) OVER () AS total  -- 全表聚合，每行都计算
FROM huge_table;

-- ✅ 改进：先聚合再 JOIN
WITH total AS (
    SELECT SUM(amount) AS total_amount FROM huge_table
)
SELECT t.*, total.total_amount
FROM huge_table t, total;

-- ❌ 避免复杂的窗口框架
SELECT 
    *,
    AVG(amount) OVER (
        ORDER BY created_at 
        RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW
    )  -- RANGE 框架性能较差
FROM orders;

-- ✅ 改进：使用 ROWS 框架（如果业务允许）
SELECT 
    *,
    AVG(amount) OVER (
        ORDER BY created_at 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )
FROM orders;
```

### 2.4 窗口函数常见场景

```sql
-- 场景1：去重保留最新记录
WITH ranked AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM user_log
)
SELECT * FROM ranked WHERE rn = 1;

-- 场景2：连续登录天数
WITH daily_login AS (
    SELECT DISTINCT user_id, DATE(login_time) AS login_date
    FROM login_log
),
grouped AS (
    SELECT 
        user_id,
        login_date,
        DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (
            PARTITION BY user_id ORDER BY login_date
        ) DAY) AS grp
    FROM daily_login
)
SELECT 
    user_id,
    MIN(login_date) AS start_date,
    MAX(login_date) AS end_date,
    COUNT(*) AS consecutive_days
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) >= 7;  -- 连续登录7天以上

-- 场景3：Top N per Group
WITH ranked AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS rn
    FROM products
)
SELECT * FROM ranked WHERE rn <= 3;  -- 每个类别销量前3

-- 场景4：首次/末次记录
SELECT 
    user_id,
    FIRST_VALUE(product_id) OVER (
        PARTITION BY user_id ORDER BY order_time
    ) AS first_product,
    LAST_VALUE(product_id) OVER (
        PARTITION BY user_id 
        ORDER BY order_time
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS last_product
FROM orders;
```

---

## 三、CTE 公共表表达式 [MySQL 8.0+]

### 3.1 基础 CTE

```sql
-- ✅ 基本语法
WITH active_users AS (
    SELECT * FROM users WHERE status = 'active'
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';

-- ✅ 多个 CTE
WITH 
active_users AS (
    SELECT * FROM users WHERE status = 'active'
),
recent_orders AS (
    SELECT * FROM orders WHERE created_at > '2024-01-01'
)
SELECT 
    u.name,
    COUNT(o.id) AS order_count
FROM active_users u
LEFT JOIN recent_orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- ✅ CTE 引用其他 CTE
WITH 
base AS (
    SELECT * FROM orders WHERE status = 'completed'
),
aggregated AS (
    SELECT user_id, SUM(amount) AS total FROM base GROUP BY user_id
)
SELECT * FROM aggregated WHERE total > 1000;
```

### 3.2 递归 CTE

```sql
-- ✅ 递归 CTE：组织架构树
WITH RECURSIVE org_tree AS (
    -- 锚点：根节点
    SELECT id, name, parent_id, 1 AS level, CAST(name AS CHAR(1000)) AS path
    FROM department
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- 递归：子节点
    SELECT d.id, d.name, d.parent_id, t.level + 1, CONCAT(t.path, ' > ', d.name)
    FROM department d
    INNER JOIN org_tree t ON d.parent_id = t.id
)
SELECT * FROM org_tree ORDER BY path;

-- ✅ 递归 CTE：生成序列
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;

-- ✅ 递归 CTE：日期序列
WITH RECURSIVE date_range AS (
    SELECT DATE('2024-01-01') AS date
    UNION ALL
    SELECT DATE_ADD(date, INTERVAL 1 DAY)
    FROM date_range
    WHERE date < '2024-12-31'
)
SELECT * FROM date_range;

-- ✅ 递归 CTE：物料清单（BOM）展开
WITH RECURSIVE bom_tree AS (
    -- 锚点：顶层产品
    SELECT 
        product_id,
        component_id,
        quantity,
        1 AS level
    FROM bom
    WHERE product_id = 1001
    
    UNION ALL
    
    -- 递归：子组件
    SELECT 
        b.product_id,
        b.component_id,
        b.quantity * t.quantity,
        t.level + 1
    FROM bom b
    INNER JOIN bom_tree t ON b.product_id = t.component_id
    WHERE t.level < 10  -- 防止无限递归
)
SELECT * FROM bom_tree;
```

### 3.3 CTE 性能考量

```sql
-- ⚠️ CTE 默认不物化（每次引用都重新计算）
-- MySQL 8.0 优化器会自动决定是否物化

-- ❌ 多次引用同一 CTE 可能导致重复计算
WITH expensive_cte AS (
    SELECT * FROM huge_table WHERE complex_condition
)
SELECT * FROM expensive_cte WHERE type = 'A'
UNION ALL
SELECT * FROM expensive_cte WHERE type = 'B';

-- ✅ 改进：使用临时表显式物化
CREATE TEMPORARY TABLE temp_result AS
SELECT * FROM huge_table WHERE complex_condition;

SELECT * FROM temp_result WHERE type = 'A'
UNION ALL
SELECT * FROM temp_result WHERE type = 'B';

DROP TEMPORARY TABLE temp_result;

-- ✅ 或使用子查询 + 条件合并
SELECT * FROM huge_table 
WHERE complex_condition AND type IN ('A', 'B');

-- ⚠️ 递归 CTE 深度限制
-- 默认 cte_max_recursion_depth = 1000
SET SESSION cte_max_recursion_depth = 10000;  -- 临时增加

-- ✅ 在 CTE 内部限制递归深度
WITH RECURSIVE tree AS (
    SELECT *, 1 AS depth FROM nodes WHERE parent_id IS NULL
    UNION ALL
    SELECT n.*, t.depth + 1 
    FROM nodes n 
    JOIN tree t ON n.parent_id = t.id
    WHERE t.depth < 20  -- 限制深度
)
SELECT * FROM tree;
```

### 3.4 CTE vs 子查询 vs 临时表

```sql
-- 场景1：一次性使用 → 子查询
SELECT * FROM (
    SELECT user_id, SUM(amount) AS total
    FROM orders
    GROUP BY user_id
) AS user_totals
WHERE total > 1000;

-- 场景2：多次引用 + 可读性 → CTE
WITH user_totals AS (
    SELECT user_id, SUM(amount) AS total
    FROM orders
    GROUP BY user_id
),
high_value_users AS (
    SELECT * FROM user_totals WHERE total > 1000
)
SELECT u.name, t.total
FROM users u
JOIN high_value_users t ON u.id = t.user_id;

-- 场景3：大数据 + 多次引用 → 临时表
CREATE TEMPORARY TABLE temp_user_totals AS
SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id;

CREATE INDEX idx_total ON temp_user_totals(total);

-- 多次查询
SELECT * FROM temp_user_totals WHERE total > 1000;
SELECT AVG(total) FROM temp_user_totals;

DROP TEMPORARY TABLE temp_user_totals;

-- 场景4：递归查询 → 必须用 CTE
-- 子查询和临时表都不支持递归
```

---

## 四、分区表设计

### 4.1 分区类型选择

```sql
-- ✅ RANGE 分区：按范围（最常用）
-- 适用于：时间序列数据、按日期归档
CREATE TABLE order_history (
    id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2),
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id, created_at)  -- 分区键必须包含在主键中
)
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ✅ RANGE COLUMNS：多列范围
CREATE TABLE sales (
    id BIGINT PRIMARY KEY,
    region VARCHAR(20),
    sale_date DATE,
    amount DECIMAL(10,2)
)
PARTITION BY RANGE COLUMNS (region, sale_date) (
    PARTITION p_east_2023 VALUES LESS THAN ('East', '2024-01-01'),
    PARTITION p_east_2024 VALUES LESS THAN ('East', '2025-01-01'),
    PARTITION p_west_2023 VALUES LESS THAN ('West', '2024-01-01'),
    PARTITION p_west_2024 VALUES LESS THAN ('West', '2025-01-01'),
    PARTITION p_other VALUES LESS THAN (MAXVALUE, MAXVALUE)
);

-- ✅ LIST 分区：按离散值
-- 适用于：按地区、状态等分类
CREATE TABLE user_by_region (
    id BIGINT NOT NULL,
    name VARCHAR(100),
    region VARCHAR(20),
    PRIMARY KEY (id, region)
)
PARTITION BY LIST COLUMNS (region) (
    PARTITION p_north VALUES IN ('Beijing', 'Tianjin', 'Hebei'),
    PARTITION p_east VALUES IN ('Shanghai', 'Jiangsu', 'Zhejiang'),
    PARTITION p_south VALUES IN ('Guangdong', 'Fujian', 'Hainan'),
    PARTITION p_west VALUES IN ('Sichuan', 'Chongqing', 'Yunnan')
);

-- ✅ HASH 分区：均匀分布
-- 适用于：无明显分区键，需要均匀分布
CREATE TABLE session (
    id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    data TEXT,
    PRIMARY KEY (id, user_id)
)
PARTITION BY HASH (user_id)
PARTITIONS 16;

-- ✅ KEY 分区：类似 HASH，但使用 MySQL 内部函数
CREATE TABLE cache (
    cache_key VARCHAR(200) NOT NULL,
    cache_value TEXT,
    PRIMARY KEY (cache_key)
)
PARTITION BY KEY (cache_key)
PARTITIONS 8;
```

### 4.2 分区裁剪验证

```sql
-- ✅ 使用 EXPLAIN 验证分区裁剪
EXPLAIN SELECT * FROM order_history 
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- 查看 partitions 列，应该只显示 p2024
-- 如果显示所有分区，说明裁剪失败

-- ❌ 分区裁剪失败的情况
-- 1. 对分区键使用函数
EXPLAIN SELECT * FROM order_history 
WHERE YEAR(created_at) = 2024;  -- 可能无法裁剪

-- ✅ 改用范围条件
EXPLAIN SELECT * FROM order_history 
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 2. 类型不匹配
EXPLAIN SELECT * FROM order_history 
WHERE created_at = '2024-01-01';  -- 字符串 vs DATETIME

-- ✅ 使用正确类型
EXPLAIN SELECT * FROM order_history 
WHERE created_at = CAST('2024-01-01' AS DATETIME);

-- ✅ 查看分区信息
SELECT 
    PARTITION_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM information_schema.PARTITIONS
WHERE TABLE_SCHEMA = 'your_db' AND TABLE_NAME = 'order_history';
```

### 4.3 分区维护

```sql
-- ✅ 添加新分区
ALTER TABLE order_history 
REORGANIZE PARTITION p_future INTO (
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ✅ 删除旧分区（快速删除数据）
ALTER TABLE order_history DROP PARTITION p2022;

-- ✅ 合并分区
ALTER TABLE order_history 
REORGANIZE PARTITION p2022, p2023 INTO (
    PARTITION p_old VALUES LESS THAN (2024)
);

-- ✅ 交换分区（快速归档）
-- 1. 创建结构相同的归档表
CREATE TABLE order_archive_2023 LIKE order_history;
ALTER TABLE order_archive_2023 REMOVE PARTITIONING;

-- 2. 交换分区
ALTER TABLE order_history 
EXCHANGE PARTITION p2023 WITH TABLE order_archive_2023;

-- ✅ 分析分区
ALTER TABLE order_history ANALYZE PARTITION p2024;

-- ✅ 重建分区（优化碎片）
ALTER TABLE order_history REBUILD PARTITION p2024;

-- ✅ 自动分区管理（使用事件）
DELIMITER //
CREATE EVENT add_monthly_partition
ON SCHEDULE EVERY 1 MONTH
STARTS '2024-12-01 00:00:00'
DO
BEGIN
    SET @next_year = YEAR(CURDATE()) + 1;
    SET @sql = CONCAT(
        'ALTER TABLE order_history REORGANIZE PARTITION p_future INTO (',
        'PARTITION p', @next_year, ' VALUES LESS THAN (', @next_year + 1, '),',
        'PARTITION p_future VALUES LESS THAN MAXVALUE)'
    );
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
```

### 4.4 分区表最佳实践

```sql
-- ✅ 分区键选择原则
-- 1. 查询条件中最常用的字段
-- 2. 数据分布相对均匀
-- 3. 有明确的范围或分类

-- ✅ 分区数量建议
-- RANGE/LIST: 根据业务需求，通常 12-100 个
-- HASH/KEY: 通常 4-64 个，建议为 2 的幂

-- ❌ 避免过多分区
CREATE TABLE bad_partition (...)
PARTITION BY HASH(id) PARTITIONS 1000;  -- 太多

-- ✅ 合理的分区数量
CREATE TABLE good_partition (...)
PARTITION BY HASH(id) PARTITIONS 16;

-- ❌ 避免跨分区查询
SELECT * FROM order_history;  -- 全表扫描所有分区

-- ✅ 始终包含分区键条件
SELECT * FROM order_history 
WHERE created_at >= '2024-01-01';

-- ✅ 分区表索引策略
-- 本地索引（每个分区独立）
CREATE INDEX idx_user_id ON order_history(user_id);

-- 唯一索引必须包含分区键
CREATE UNIQUE INDEX uk_order_no ON order_history(order_no, created_at);

-- ❌ 唯一索引不包含分区键会报错
CREATE UNIQUE INDEX uk_order_no ON order_history(order_no);  -- 错误
```

### 4.5 分区表限制

```sql
-- ⚠️ 分区表限制
-- 1. 分区键必须是主键/唯一键的一部分
-- 2. 最多 8192 个分区
-- 3. 外键不支持分区表
-- 4. 全文索引不支持分区表 [MySQL 5.7.1 前]
-- 5. 空间索引不支持分区表

-- ❌ 外键与分区不兼容
CREATE TABLE parent (id INT PRIMARY KEY);

CREATE TABLE child (
    id INT,
    parent_id INT,
    created_at DATE,
    FOREIGN KEY (parent_id) REFERENCES parent(id)  -- 错误
)
PARTITION BY RANGE (YEAR(created_at)) (...);

-- ✅ 替代方案：应用层维护引用完整性
CREATE TABLE child (
    id INT,
    parent_id INT,
    created_at DATE,
    PRIMARY KEY (id, created_at),
    INDEX idx_parent (parent_id)
)
PARTITION BY RANGE (YEAR(created_at)) (...);
```

---

## 审查检查清单

### JSON 检查

- [ ] JSON 字段用于动态属性，非核心业务字段
- [ ] 频繁查询的 JSON 属性有虚拟列索引
- [ ] JSON 数组查询使用多值索引 [8.0.17+]
- [ ] 避免在大数据集上使用复杂 JSON 函数
- [ ] JSON 更新使用 JSON_SET 等函数而非整体替换

### 窗口函数检查

- [ ] PARTITION BY 和 ORDER BY 字段有索引
- [ ] 使用命名窗口减少重复定义
- [ ] 避免无限制的窗口框架
- [ ] 优先使用 ROWS 而非 RANGE 框架

### CTE 检查

- [ ] CTE 提高了查询可读性
- [ ] 递归 CTE 有深度限制
- [ ] 多次引用的大数据 CTE 考虑临时表
- [ ] 递归 CTE 有正确的终止条件

### 分区表检查

- [ ] 分区策略与查询模式匹配
- [ ] 分区键包含在主键/唯一键中
- [ ] 查询条件包含分区键（验证裁剪）
- [ ] 有分区维护计划（添加/删除/归档）
- [ ] 分区数量合理（不超过 100 个）

---

## 相关资源

- [MySQL 基础审查指南](mysql-review.md)
- [MySQL 检查清单](mysql-checklist.md)
- [MySQL 8.0 JSON 文档](https://dev.mysql.com/doc/refman/8.0/en/json.html)
- [MySQL 8.0 窗口函数](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html)
- [MySQL 8.0 CTE](https://dev.mysql.com/doc/refman/8.0/en/with.html)
- [MySQL 8.0 分区](https://dev.mysql.com/doc/refman/8.0/en/partitioning.html)
