# MySQL 最佳实践

## 查询优化

### 分页查询

```sql
-- ❌ 深分页性能差
SELECT * FROM t_order ORDER BY id LIMIT 1000000, 10;

-- ✅ 使用游标分页
SELECT * FROM t_order WHERE id > 1000000 ORDER BY id LIMIT 10;

-- ✅ 延迟关联
SELECT o.* FROM t_order o
INNER JOIN (SELECT id FROM t_order ORDER BY id LIMIT 1000000, 10) t
ON o.id = t.id;
```

### 批量操作

```sql
-- ❌ 循环单条插入
INSERT INTO t_user (name) VALUES ('张三');
INSERT INTO t_user (name) VALUES ('李四');

-- ✅ 批量插入
INSERT INTO t_user (name) VALUES ('张三'), ('李四'), ('王五');

-- ✅ 批量更新（CASE WHEN）
UPDATE t_user SET status = CASE id
    WHEN 1 THEN 0
    WHEN 2 THEN 1
    WHEN 3 THEN 0
END WHERE id IN (1, 2, 3);
```

### 避免 SELECT *

```sql
-- ❌ 查询所有字段
SELECT * FROM t_user WHERE id = 1;

-- ✅ 只查需要的字段
SELECT id, username, email FROM t_user WHERE id = 1;
```

### COUNT 优化

```sql
-- ❌ COUNT(*)（InnoDB 全表扫描）
SELECT COUNT(*) FROM t_user;

-- ✅ 使用近似值（如有）
SELECT table_rows FROM information_schema.tables 
WHERE table_name = 't_user';

-- ✅ 使用缓存计数
-- Redis 维护计数，增删时更新
```

## 事务

```sql
-- ✅ 事务要短
START TRANSACTION;
UPDATE t_account SET balance = balance - 100 WHERE id = 1;
UPDATE t_account SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- ❌ 事务中有耗时操作
START TRANSACTION;
-- 调用外部 API（耗时）
UPDATE t_order SET status = 2 WHERE id = 1;
COMMIT;
```

## 锁

```sql
-- ✅ 悲观锁（高并发写）
SELECT * FROM t_stock WHERE product_id = 1 FOR UPDATE;
UPDATE t_stock SET quantity = quantity - 1 WHERE product_id = 1;

-- ✅ 乐观锁（低并发）
UPDATE t_stock SET quantity = quantity - 1, version = version + 1
WHERE product_id = 1 AND version = 1;
```

## 大表优化

```sql
-- ✅ 分区表
CREATE TABLE t_log (
    id BIGINT,
    create_time DATETIME,
    content TEXT
) PARTITION BY RANGE (YEAR(create_time)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- ✅ 归档历史数据
INSERT INTO t_order_history SELECT * FROM t_order WHERE create_time < '2023-01-01';
DELETE FROM t_order WHERE create_time < '2023-01-01';
```

## 检查清单

- [ ] 避免 SELECT *
- [ ] 深分页使用游标
- [ ] 批量操作代替循环
- [ ] 事务保持短小
- [ ] 大表考虑分区/归档

## 参考

- [MySQL 索引规范](index.md)
- [高性能 MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/)
