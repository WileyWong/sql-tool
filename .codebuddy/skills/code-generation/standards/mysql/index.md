# MySQL 索引规范

## 索引类型

| 类型 | 命名 | 场景 |
|------|------|------|
| 主键 | PRIMARY KEY | 唯一标识 |
| 唯一索引 | uk_表_字段 | 业务唯一约束 |
| 普通索引 | idx_表_字段 | 查询优化 |
| 组合索引 | idx_表_字段1_字段2 | 多条件查询 |

## 创建原则

### 应该创建索引

```sql
-- ✅ 主键
PRIMARY KEY (id)

-- ✅ 唯一约束字段
UNIQUE KEY uk_user_email (email)

-- ✅ 频繁查询条件
KEY idx_user_status (status)

-- ✅ 外键关联字段
KEY idx_order_user_id (user_id)

-- ✅ 排序字段
KEY idx_order_create_time (create_time)
```

### 不应创建索引

```sql
-- ❌ 低选择性字段（如性别）
KEY idx_user_gender (gender)  -- 只有 2 个值

-- ❌ 频繁更新的字段
KEY idx_user_login_count (login_count)

-- ❌ 很少查询的字段
KEY idx_user_remark (remark)

-- ❌ 过长的字符串
KEY idx_user_description (description)  -- TEXT 类型
```

## 组合索引

### 最左前缀原则

```sql
-- 创建组合索引
KEY idx_order_user_status_time (user_id, status, create_time)

-- ✅ 能使用索引
WHERE user_id = 1
WHERE user_id = 1 AND status = 1
WHERE user_id = 1 AND status = 1 AND create_time > '2024-01-01'

-- ❌ 不能使用索引
WHERE status = 1  -- 跳过 user_id
WHERE status = 1 AND create_time > '2024-01-01'  -- 跳过 user_id
```

### 字段顺序

```sql
-- ✅ 高选择性字段在前
KEY idx_order_user_status (user_id, status)  -- user_id 选择性高

-- ✅ 等值查询在前，范围查询在后
KEY idx_order_status_time (status, create_time)
-- WHERE status = 1 AND create_time > '2024-01-01'
```

## 覆盖索引

```sql
-- 创建覆盖索引
KEY idx_user_status_name (status, username)

-- ✅ 查询只用索引，不回表
SELECT username FROM t_user WHERE status = 1;
-- Extra: Using index

-- ❌ 需要回表
SELECT * FROM t_user WHERE status = 1;
```

## 索引失效场景

```sql
-- ❌ 函数操作
WHERE DATE(create_time) = '2024-01-01'
-- ✅ 改为
WHERE create_time >= '2024-01-01' AND create_time < '2024-01-02'

-- ❌ 隐式类型转换
WHERE phone = 13800138000  -- phone 是 VARCHAR
-- ✅ 改为
WHERE phone = '13800138000'

-- ❌ 左模糊查询
WHERE username LIKE '%张'
-- ✅ 改为右模糊
WHERE username LIKE '张%'

-- ❌ OR 条件（部分字段无索引）
WHERE username = '张三' OR age = 18  -- age 无索引
-- ✅ 改为 UNION
SELECT * FROM t_user WHERE username = '张三'
UNION
SELECT * FROM t_user WHERE age = 18

-- ❌ NOT IN / NOT EXISTS
WHERE status NOT IN (0, 2)
-- ✅ 改为
WHERE status = 1
```

## 检查清单

- [ ] 主键使用自增或雪花 ID
- [ ] 唯一约束字段有唯一索引
- [ ] 频繁查询条件有索引
- [ ] 组合索引遵循最左前缀
- [ ] 避免索引失效场景
- [ ] 单表索引不超过 5 个

## 参考

- [MySQL 命名规范](naming.md)
- [MySQL DDL 规范](ddl.md)
