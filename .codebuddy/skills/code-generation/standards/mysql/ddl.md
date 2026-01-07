# MySQL DDL 规范

## 建表模板

```sql
CREATE TABLE t_user (
    -- 主键
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    
    -- 业务字段
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码（加密）',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    
    -- 公共字段
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by BIGINT DEFAULT NULL COMMENT '创建人',
    update_by BIGINT DEFAULT NULL COMMENT '更新人',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    
    -- 主键和索引
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_username (username),
    UNIQUE KEY uk_user_email (email),
    KEY idx_user_status (status),
    KEY idx_user_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

## 数据类型选择

| 场景 | 推荐类型 | 说明 |
|------|---------|------|
| 主键 | BIGINT | 支持分布式 ID |
| 状态/类型 | TINYINT | 0-127 足够 |
| 金额 | DECIMAL(10,2) | 精确计算 |
| 短文本 | VARCHAR(n) | 指定长度 |
| 长文本 | TEXT | 超过 5000 字符 |
| 时间 | DATETIME | 精确到秒 |
| 布尔 | TINYINT(1) | 0/1 |
| JSON | JSON | MySQL 5.7+ |

## 字段约束

```sql
-- ✅ NOT NULL + DEFAULT
status TINYINT NOT NULL DEFAULT 1,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- ✅ 字符串默认空字符串或 NULL
nickname VARCHAR(50) DEFAULT '',
phone VARCHAR(20) DEFAULT NULL,

-- ✅ 必须有 COMMENT
username VARCHAR(50) NOT NULL COMMENT '用户名',
```

## 索引规范

```sql
-- ✅ 主键索引
PRIMARY KEY (id)

-- ✅ 唯一索引（业务唯一）
UNIQUE KEY uk_user_email (email)

-- ✅ 普通索引（查询条件）
KEY idx_user_status (status)

-- ✅ 组合索引（遵循最左前缀）
KEY idx_order_user_status (user_id, status)

-- ❌ 避免
KEY idx_user_name (name)  -- 模糊查询左匹配无效
```

## 外键

```sql
-- ✅ 推荐：应用层维护关联，不使用外键约束
-- 原因：性能、分库分表、灵活性

-- 如必须使用外键
CONSTRAINT fk_order_user FOREIGN KEY (user_id) 
    REFERENCES t_user (id) ON DELETE RESTRICT ON UPDATE CASCADE
```

## 修改表

```sql
-- ✅ 添加字段
ALTER TABLE t_user ADD COLUMN nickname VARCHAR(50) DEFAULT '' COMMENT '昵称' AFTER email;

-- ✅ 修改字段
ALTER TABLE t_user MODIFY COLUMN nickname VARCHAR(100) DEFAULT '' COMMENT '昵称';

-- ✅ 添加索引
ALTER TABLE t_user ADD INDEX idx_user_nickname (nickname);

-- ✅ 删除索引
ALTER TABLE t_user DROP INDEX idx_user_nickname;
```

## 检查清单

- [ ] 表名有 t_ 前缀
- [ ] 主键用 BIGINT
- [ ] 字段有 NOT NULL 或 DEFAULT
- [ ] 字段有 COMMENT
- [ ] 使用 utf8mb4 字符集
- [ ] 有创建时间/更新时间
- [ ] 索引按规范命名

## 参考

- [MySQL 命名规范](naming.md)
- [MySQL 索引规范](index.md)
