# 数据库索引设计指南

**适用范围**: 所有基于 Spring Boot 3.x 的招聘相关微服务  
**文档版本**: 1.0  
**最后更新**: 2025-10-31

---

## 📋 概述

本指南详细说明了数据库索引的设计原则、常见场景和最佳实践。

**核心原则**：
- 索引是数据库性能的关键
- 精心设计索引，避免过度索引
- 定期检查和优化索引

---

## 🎯 索引设计的三个核心原则

### 原则 1: 最左前缀原则（必须遵守）

**定义**：复合索引遵循最左前缀原则，查询条件应该从左到右匹配索引列。

**示例**：

```sql
-- 创建复合索引
KEY `idx_user_status_create_time` (`user_id`, `status`, `create_time`)

-- ✅ 以下查询都能使用该索引
WHERE user_id = 1
WHERE user_id = 1 AND status = 1
WHERE user_id = 1 AND status = 1 AND create_time > '2025-01-01'

-- ❌ 以下查询不能使用该索引
WHERE status = 1  -- 跳过了 user_id
WHERE create_time > '2025-01-01'  -- 跳过了 user_id 和 status
WHERE user_id = 1 AND create_time > '2025-01-01'  -- 跳过了 status
```

**验证方法**：

```sql
-- 使用 EXPLAIN 查看查询计划
EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 1;

-- 期望结果：
-- type: ref
-- key: idx_user_status_create_time
-- key_len: 9 (user_id 8字节 + status 1字节)
```

### 原则 2: 高选择性优先（必须遵守）

**定义**：选择性 = 不重复值数 / 总行数，选择性越高，索引效率越好。

**示例**：

```sql
-- ✅ 好的索引（选择性高）
KEY `idx_email` (`email`)  -- 邮箱通常是唯一的，选择性 = 100%

-- ❌ 不好的索引（选择性低）
KEY `idx_gender` (`gender`)  -- 性别只有两个值，选择性 = 0.5%
KEY `idx_enable_flag` (`enable_flag`)  -- 启用标记只有两个值，选择性 = 50%
```

**计算选择性**：

```sql
-- 查询字段的不重复值数
SELECT COUNT(DISTINCT email) / COUNT(*) AS selectivity FROM users;

-- 结果 > 0.1（10%）：适合建索引
-- 结果 < 0.1（10%）：不适合建索引
```

### 原则 3: 避免冗余索引（必须遵守）

**定义**：不创建重复的索引，不创建包含关系的索引。

**示例**：

```sql
-- ❌ 冗余索引（不要同时创建）
KEY `idx_user_id` (`user_id`)
KEY `idx_user_id_status` (`user_id`, `status`)  -- 冗余，第一个索引已包含

-- ✅ 正确做法（只创建一个）
KEY `idx_user_id_status` (`user_id`, `status`)

-- ❌ 冗余索引（不要同时创建）
KEY `idx_user_id_status` (`user_id`, `status`)
KEY `idx_user_id_status_create_time` (`user_id`, `status`, `create_time`)  -- 冗余

-- ✅ 正确做法（只创建一个）
KEY `idx_user_id_status_create_time` (`user_id`, `status`, `create_time`)
```

**检查冗余索引**：

```sql
-- 查询冗余索引
SELECT * FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
GROUP BY TABLE_NAME, SEQ_IN_INDEX
HAVING COUNT(*) > 1;
```

---

## 📊 常见查询场景的索引设计

### 场景 1: 单字段等值查询

**查询 SQL**：
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

**索引设计**：
```sql
UNIQUE KEY `uk_email` (`email`)  -- 唯一索引
```

**验证**：
```sql
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
-- type: const
-- key: uk_email
```

---

### 场景 2: 多字段等值查询

**查询 SQL**：
```sql
SELECT * FROM orders WHERE user_id = 1 AND status = 1;
```

**索引设计**：
```sql
KEY `idx_user_status` (`user_id`, `status`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 1;
-- type: ref
-- key: idx_user_status
-- key_len: 9 (user_id 8字节 + status 1字节)
```

---

### 场景 3: 等值 + 范围查询

**查询 SQL**：
```sql
SELECT * FROM orders WHERE user_id = 1 AND create_time > '2025-01-01';
```

**索引设计**：
```sql
-- ✅ 正确：等值字段在前，范围字段在后
KEY `idx_user_create_time` (`user_id`, `create_time`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND create_time > '2025-01-01';
-- type: range
-- key: idx_user_create_time
-- key_len: 8 (只使用了 user_id，因为 create_time 是范围查询)
```

**错误示例**：
```sql
-- ❌ 错误：范围字段在前，会导致后续字段无法使用索引
KEY `idx_create_time_user` (`create_time`, `user_id`)

-- 查询计划会变成：
-- type: range
-- key: idx_create_time_user
-- 但 user_id 无法使用索引
```

---

### 场景 4: 排序查询

**查询 SQL**：
```sql
SELECT * FROM orders WHERE user_id = 1 ORDER BY create_time DESC;
```

**索引设计**：
```sql
-- ✅ 正确：等值字段在前，排序字段在后
KEY `idx_user_create_time` (`user_id`, `create_time`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 ORDER BY create_time DESC;
-- type: ref
-- key: idx_user_create_time
-- Extra: 不包含 "Using filesort"（表示排序已通过索引完成）
```

**错误示例**：
```sql
-- ❌ 错误：排序字段在前，会导致排序需要额外的文件排序
KEY `idx_create_time_user` (`create_time`, `user_id`)

-- 查询计划会变成：
-- type: ref
-- key: idx_create_time_user
-- Extra: "Using filesort"（表示需要额外的排序操作）
```

---

### 场景 5: 分页查询

**查询 SQL**：
```sql
SELECT * FROM users WHERE enable_flag = 1 ORDER BY create_time DESC LIMIT 10 OFFSET 20;
```

**索引设计**：
```sql
-- ✅ 正确：状态字段在前，排序字段在后
KEY `idx_enable_create_time` (`enable_flag`, `create_time`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM users WHERE enable_flag = 1 ORDER BY create_time DESC LIMIT 10 OFFSET 20;
-- type: ref
-- key: idx_enable_create_time
-- Extra: 不包含 "Using filesort"
```

---

### 场景 6: 模糊查询

**查询 SQL**：
```sql
SELECT * FROM users WHERE username LIKE 'admin%';
```

**索引设计**：
```sql
KEY `idx_username` (`username`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM users WHERE username LIKE 'admin%';
-- type: range
-- key: idx_username
```

**注意**：
```sql
-- ❌ 以下查询不能使用索引
WHERE username LIKE '%admin'  -- 前缀模糊
WHERE username LIKE '%admin%'  -- 前后都模糊

-- 解决方案：
-- 1. 使用 Elasticsearch 做全文搜索
-- 2. 使用全文索引（FULLTEXT）
-- 3. 在应用层做模糊匹配
```

---

### 场景 7: IN 查询

**查询 SQL**：
```sql
SELECT * FROM orders WHERE status IN (1, 2, 3);
```

**索引设计**：
```sql
KEY `idx_status` (`status`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM orders WHERE status IN (1, 2, 3);
-- type: range
-- key: idx_status
```

---

### 场景 8: 复杂查询（多条件 + 排序）

**查询 SQL**：
```sql
SELECT * FROM orders 
WHERE user_id = 1 AND status = 1 AND create_time > '2025-01-01' 
ORDER BY create_time DESC;
```

**索引设计**：
```sql
-- ✅ 正确：等值字段在前，范围字段在中间，排序字段在后
KEY `idx_user_status_create_time` (`user_id`, `status`, `create_time`)
```

**验证**：
```sql
EXPLAIN SELECT * FROM orders 
WHERE user_id = 1 AND status = 1 AND create_time > '2025-01-01' 
ORDER BY create_time DESC;
-- type: range
-- key: idx_user_status_create_time
-- Extra: 不包含 "Using filesort"
```

---

## 🔍 索引优化技巧

### 技巧 1: 使用 EXPLAIN 分析查询计划

**基本语法**：
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
```

**关键字段说明**：

| 字段 | 说明 | 期望值 |
|------|------|--------|
| type | 查询类型 | const, ref, range（避免 ALL） |
| key | 使用的索引 | 索引名（不是 NULL） |
| key_len | 使用的索引长度 | 越短越好 |
| rows | 扫描的行数 | 越少越好 |
| Extra | 额外信息 | 避免 Using filesort、Using temporary |

**示例**：

```sql
-- ✅ 好的查询计划
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
-- type: ref
-- key: idx_user_id
-- key_len: 8
-- rows: 100
-- Extra: (empty)

-- ❌ 不好的查询计划
EXPLAIN SELECT * FROM orders WHERE user_id = 1;
-- type: ALL
-- key: NULL
-- rows: 1000000
-- Extra: Using where
```

### 技巧 2: 避免索引失效

**常见导致索引失效的情况**：

```sql
-- ❌ 1. 在索引字段上使用函数
SELECT * FROM orders WHERE YEAR(create_time) = 2025;
-- 解决方案：
SELECT * FROM orders WHERE create_time >= '2025-01-01' AND create_time < '2026-01-01';

-- ❌ 2. 在索引字段上进行类型转换
SELECT * FROM orders WHERE user_id = '1';  -- user_id 是 BIGINT，但查询用字符串
-- 解决方案：
SELECT * FROM orders WHERE user_id = 1;

-- ❌ 3. 在索引字段上进行计算
SELECT * FROM orders WHERE user_id + 1 = 2;
-- 解决方案：
SELECT * FROM orders WHERE user_id = 1;

-- ❌ 4. 在索引字段上使用 OR（如果不是所有字段都有索引）
SELECT * FROM orders WHERE user_id = 1 OR status = 1;
-- 解决方案：
-- 为 status 也建立索引，或使用 UNION
SELECT * FROM orders WHERE user_id = 1
UNION
SELECT * FROM orders WHERE status = 1;

-- ❌ 5. 在索引字段上使用 NOT IN
SELECT * FROM orders WHERE user_id NOT IN (1, 2, 3);
-- 解决方案：
SELECT * FROM orders WHERE user_id > 3 OR user_id < 1;
```

### 技巧 3: 联合索引的字段顺序

**原则**：
1. 等值查询字段在前
2. 范围查询字段在中间
3. 排序字段在最后

**示例**：

```sql
-- 查询：WHERE user_id = ? AND status = ? AND create_time > ? ORDER BY create_time DESC
-- 正确的索引顺序
KEY `idx_user_status_create_time` (`user_id`, `status`, `create_time`)

-- 错误的索引顺序
KEY `idx_create_time_user_status` (`create_time`, `user_id`, `status`)  -- 会导致 user_id 无法使用索引
```

### 技巧 4: 覆盖索引（Covering Index）

**定义**：查询所需的所有字段都在索引中，不需要回表查询。

**示例**：

```sql
-- 查询：SELECT user_id, status FROM orders WHERE user_id = 1;
-- 覆盖索引
KEY `idx_user_status` (`user_id`, `status`)

-- 查询计划
EXPLAIN SELECT user_id, status FROM orders WHERE user_id = 1;
-- Extra: "Using index"（表示使用了覆盖索引，不需要回表）

-- 非覆盖索引
KEY `idx_user_id` (`user_id`)

-- 查询计划
EXPLAIN SELECT user_id, status FROM orders WHERE user_id = 1;
-- Extra: (empty)（表示需要回表查询）
```

---

## ⚠️ 常见错误

### 错误 1: 过度索引

**症状**：
- 每个表有 10+ 个索引
- 写入性能很差
- 索引维护成本高

**解决方案**：
- 每个表不超过 5-8 个索引
- 定期检查索引使用情况
- 删除无用索引

### 错误 2: 索引顺序错误

**症状**：
- 查询计划显示 type = ALL
- 查询很慢

**解决方案**：
- 遵循最左前缀原则
- 等值字段在前，范围字段在后
- 使用 EXPLAIN 验证

### 错误 3: 在低选择性字段建索引

**症状**：
- 索引没有效果
- 查询计划显示 type = ALL

**解决方案**：
- 计算字段的选择性
- 只为选择性 > 10% 的字段建索引

### 错误 4: 忘记为关联字段建索引

**症状**：
- JOIN 查询很慢
- 查询计划显示 type = ALL

**解决方案**：
- 为所有关联字段建索引
- 使用 EXPLAIN 验证

---

## ✅ 索引设计检查清单

在设计索引时，使用此清单确保质量：

- [ ] 所有表都有主键索引
- [ ] 所有唯一字段都有唯一索引
- [ ] 所有关联字段都有索引
- [ ] 所有 WHERE 条件字段都有索引
- [ ] 所有 ORDER BY 字段都有索引
- [ ] 联合索引遵循最左前缀原则
- [ ] 联合索引的字段顺序正确（等值 > 范围 > 排序）
- [ ] 没有冗余索引
- [ ] 每个表的索引数量不超过 5-8 个
- [ ] 使用 EXPLAIN 验证所有关键查询
- [ ] 没有索引失效的情况

---

## 📈 索引性能监控

### 查询未使用的索引

```sql
SELECT * FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA != 'mysql'
AND COUNT_STAR = 0
AND INDEX_NAME != 'PRIMARY'
ORDER BY OBJECT_SCHEMA, OBJECT_NAME;
```

### 查询冗余索引

```sql
SELECT * FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
GROUP BY TABLE_NAME, SEQ_IN_INDEX
HAVING COUNT(*) > 1;
```

### 查询慢查询

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- 查看慢查询日志
SHOW VARIABLES LIKE 'slow_query_log_file';
```

---

## 📚 参考资源

- [数据库设计规范](./database.md)
- [数据库字段规范](./database-fields.md)
- [数据库设计 Skill](../../skills/design/design-database/SKILL.md)
- [MySQL 官方文档 - EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html)
- 《高性能 MySQL》- Baron Schwartz

---

**文档版本**: v1.0  
**最后更新**: 2025-10-31  
**维护者**: 架构团队
