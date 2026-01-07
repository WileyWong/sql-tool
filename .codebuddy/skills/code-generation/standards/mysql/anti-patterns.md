# MySQL 错误示例集

## 索引问题

```sql
-- ❌ 索引列使用函数
SELECT * FROM t_user WHERE DATE(create_time) = '2024-01-01';
-- ✅ 正确
SELECT * FROM t_user WHERE create_time >= '2024-01-01' AND create_time < '2024-01-02';

-- ❌ 隐式类型转换
SELECT * FROM t_user WHERE phone = 13800138000;  -- phone 是 VARCHAR
-- ✅ 正确
SELECT * FROM t_user WHERE phone = '13800138000';

-- ❌ 左模糊查询
SELECT * FROM t_user WHERE username LIKE '%张';
-- ✅ 使用全文索引或搜索引擎

-- ❌ 组合索引跳过最左列
-- 索引：idx_order_user_status (user_id, status)
SELECT * FROM t_order WHERE status = 1;  -- 无法使用索引
-- ✅ 正确
SELECT * FROM t_order WHERE user_id = 1 AND status = 1;
```

## 查询问题

```sql
-- ❌ SELECT *
SELECT * FROM t_user WHERE id = 1;
-- ✅ 只查需要的字段
SELECT id, username, email FROM t_user WHERE id = 1;

-- ❌ 深分页
SELECT * FROM t_order ORDER BY id LIMIT 1000000, 10;
-- ✅ 游标分页
SELECT * FROM t_order WHERE id > 1000000 ORDER BY id LIMIT 10;

-- ❌ 子查询效率低
SELECT * FROM t_user WHERE id IN (SELECT user_id FROM t_order WHERE status = 1);
-- ✅ 改为 JOIN
SELECT u.* FROM t_user u INNER JOIN t_order o ON u.id = o.user_id WHERE o.status = 1;
```

## 设计问题

```sql
-- ❌ 字段允许 NULL 且无默认值
username VARCHAR(50),
-- ✅ 正确
username VARCHAR(50) NOT NULL DEFAULT '',

-- ❌ 使用 FLOAT/DOUBLE 存储金额
amount FLOAT,
-- ✅ 正确
amount DECIMAL(10,2),

-- ❌ 使用 TEXT 存储短文本
nickname TEXT,
-- ✅ 正确
nickname VARCHAR(50),

-- ❌ 无注释
CREATE TABLE t_user (id BIGINT, name VARCHAR(50));
-- ✅ 正确
CREATE TABLE t_user (
    id BIGINT COMMENT '主键',
    name VARCHAR(50) COMMENT '用户名'
) COMMENT='用户表';
```

## 事务问题

```sql
-- ❌ 长事务
START TRANSACTION;
SELECT * FROM t_order WHERE id = 1;
-- 业务处理（耗时）
-- 调用外部 API（耗时）
UPDATE t_order SET status = 2 WHERE id = 1;
COMMIT;

-- ✅ 正确：事务只包含数据库操作
-- 业务处理
-- 调用外部 API
START TRANSACTION;
UPDATE t_order SET status = 2 WHERE id = 1;
COMMIT;
```

## 参考

- [MySQL 索引规范](index.md)
- [MySQL 最佳实践](best-practices.md)
