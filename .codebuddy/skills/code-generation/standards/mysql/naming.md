# MySQL 命名规范

> 继承自 [通用命名规范](../common/naming.md)

## 表命名

```sql
-- ✅ 小写下划线，业务前缀
CREATE TABLE t_user (...);
CREATE TABLE t_order (...);
CREATE TABLE t_order_item (...);

-- ✅ 关联表：两表名组合
CREATE TABLE t_user_role (...);
CREATE TABLE t_order_product (...);

-- ❌ 错误
CREATE TABLE User (...);       -- 不要大写
CREATE TABLE tbl_user (...);   -- 不要 tbl 前缀
CREATE TABLE userInfo (...);   -- 不要驼峰
```

## 字段命名

```sql
-- ✅ 小写下划线
id BIGINT,
user_name VARCHAR(50),
create_time DATETIME,
is_deleted TINYINT,

-- ✅ 主键：id
id BIGINT PRIMARY KEY,

-- ✅ 外键：关联表_id
user_id BIGINT,
order_id BIGINT,

-- ✅ 布尔：is_ 前缀
is_active TINYINT(1),
is_deleted TINYINT(1),

-- ✅ 时间：_time/_at 后缀
create_time DATETIME,
update_time DATETIME,
deleted_at DATETIME,

-- ❌ 错误
userName VARCHAR(50),    -- 不要驼峰
user_name_info VARCHAR,  -- 不要太长
```

## 索引命名

```sql
-- ✅ 索引命名规则
-- 主键：pk_表名
-- 唯一索引：uk_表名_字段
-- 普通索引：idx_表名_字段

ALTER TABLE t_user ADD PRIMARY KEY (id);
ALTER TABLE t_user ADD UNIQUE INDEX uk_user_email (email);
ALTER TABLE t_user ADD INDEX idx_user_status (status);
ALTER TABLE t_user ADD INDEX idx_user_create_time (create_time);

-- 组合索引
ALTER TABLE t_order ADD INDEX idx_order_user_status (user_id, status);
```

## 常用字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BIGINT | 主键 |
| `create_time` | DATETIME | 创建时间 |
| `update_time` | DATETIME | 更新时间 |
| `create_by` | BIGINT | 创建人 |
| `update_by` | BIGINT | 更新人 |
| `is_deleted` | TINYINT(1) | 逻辑删除 |
| `version` | INT | 乐观锁版本 |
| `remark` | VARCHAR(500) | 备注 |

## 检查清单

- [ ] 表名小写下划线，t_ 前缀
- [ ] 字段名小写下划线
- [ ] 主键统一用 id
- [ ] 外键用 关联表_id
- [ ] 布尔用 is_ 前缀
- [ ] 索引按规则命名

## 参考

- [通用命名规范](../common/naming.md)
- [阿里巴巴 MySQL 规范](https://github.com/alibaba/p3c)
