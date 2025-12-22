# 数据库表结构文档生成 - 使用示例

本文档提供 `doc-db-schema` skill 的实际使用示例，涵盖不同场景的数据库表结构文档生成。

---

## 示例 1: 电商系统数据库（完整流程）

### 用户输入
```
请为我的电商系统数据库生成完整的表结构文档。

数据库信息：
- 主机：localhost
- 端口：3306
- 数据库名：ecommerce_db
- 用户名：root
- 密码：******
```

### AI 执行流程

#### 步骤 1: 连接数据库并验证权限

**AI 操作**：
```python
import mysql.connector
from mysql.connector import Error

# 连接到数据库
connection = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='ecommerce_db',
    user='root',
    password='******',
    charset='utf8mb4',
    use_unicode=True
)

print("✓ Successfully connected to MySQL Server version 8.0.35")

# 验证权限
cursor = connection.cursor()
cursor.execute("SHOW GRANTS FOR CURRENT_USER")
grants = cursor.fetchall()
print("✓ Current user has SELECT privilege on information_schema")
```

**输出**：
```
✓ Successfully connected to MySQL Server version 8.0.35
✓ Current user has SELECT privilege on information_schema
✓ Database: ecommerce_db
✓ Charset: utf8mb4
```

---

#### 步骤 2: 提取数据库表列表

**AI 执行 SQL**：
```sql
SELECT 
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_comment,
    ENGINE as engine,
    CREATE_TIME as create_time,
    TABLE_ROWS as table_rows,
    DATA_LENGTH as data_length,
    INDEX_LENGTH as index_length
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'ecommerce_db'
    AND TABLE_TYPE = 'BASE TABLE'
ORDER BY 
    TABLE_NAME ASC
```

**提取结果**：
```
✓ Found 8 tables:
  1. users (用户表) - 12,456 rows
  2. products (商品表) - 5,678 rows
  3. categories (分类表) - 50 rows
  4. orders (订单表) - 23,456 rows
  5. order_items (订单明细表) - 67,890 rows
  6. carts (购物车表) - 3,456 rows
  7. addresses (收货地址表) - 8,901 rows
  8. payments (支付记录表) - 20,123 rows
```

---

#### 步骤 3: 提取表字段信息

**AI 执行 SQL**（以 `users` 表为例）：
```sql
SELECT 
    COLUMN_NAME as column_name,
    DATA_TYPE as data_type,
    COLUMN_TYPE as column_type,
    IS_NULLABLE as is_nullable,
    COLUMN_DEFAULT as column_default,
    COLUMN_COMMENT as column_comment,
    COLUMN_KEY as column_key,
    EXTRA as extra,
    CHARACTER_SET_NAME as character_set,
    COLLATION_NAME as collation,
    ORDINAL_POSITION as position
FROM 
    information_schema.COLUMNS
WHERE 
    TABLE_SCHEMA = 'ecommerce_db'
    AND TABLE_NAME = 'users'
ORDER BY 
    ORDINAL_POSITION ASC
```

**提取结果**（users 表）：
```
✓ users 表包含 15 个字段:
  1. id (BIGINT UNSIGNED) - 用户ID [PRI, auto_increment]
  2. username (VARCHAR(50)) - 用户名 [UNI]
  3. password (VARCHAR(255)) - 密码（BCrypt加密）
  4. email (VARCHAR(100)) - 邮箱 [UNI]
  5. phone (VARCHAR(20)) - 手机号 [UNI]
  6. real_name (VARCHAR(50)) - 真实姓名
  7. avatar_url (VARCHAR(255)) - 头像URL
  8. gender (TINYINT) - 性别：1-男，2-女，3-未知
  9. birthday (DATE) - 生日
  10. status (TINYINT) - 状态：1-正常，2-禁用
  11. last_login_time (DATETIME) - 最后登录时间
  12. create_time (DATETIME) - 创建时间 [DEFAULT CURRENT_TIMESTAMP]
  13. update_time (DATETIME) - 更新时间 [DEFAULT CURRENT_TIMESTAMP ON UPDATE]
  14. create_by (VARCHAR(64)) - 创建人
  15. update_by (VARCHAR(64)) - 更新人
```

---

#### 步骤 4: 提取表索引信息

**AI 执行 SQL**（以 `users` 表为例）：
```sql
SELECT 
    INDEX_NAME as index_name,
    COLUMN_NAME as column_name,
    SEQ_IN_INDEX as seq_in_index,
    NON_UNIQUE as non_unique,
    INDEX_TYPE as index_type,
    INDEX_COMMENT as index_comment
FROM 
    information_schema.STATISTICS
WHERE 
    TABLE_SCHEMA = 'ecommerce_db'
    AND TABLE_NAME = 'users'
ORDER BY 
    INDEX_NAME, SEQ_IN_INDEX
```

**提取结果**（users 表）：
```
✓ users 表包含 5 个索引:
  1. PRIMARY (BTREE, UNIQUE) - id
  2. uk_username (BTREE, UNIQUE) - username
  3. uk_email (BTREE, UNIQUE) - email
  4. uk_phone (BTREE, UNIQUE) - phone
  5. idx_status_delete (BTREE) - status, delete_time
```

---

#### 步骤 5: 提取表约束信息（可选）

**AI 执行 SQL**（以 `orders` 表为例）：
```sql
SELECT 
    tc.CONSTRAINT_NAME as constraint_name,
    tc.CONSTRAINT_TYPE as constraint_type,
    kcu.COLUMN_NAME as column_name,
    kcu.REFERENCED_TABLE_NAME as referenced_table,
    kcu.REFERENCED_COLUMN_NAME as referenced_column
FROM 
    information_schema.TABLE_CONSTRAINTS tc
LEFT JOIN 
    information_schema.KEY_COLUMN_USAGE kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
    AND tc.TABLE_NAME = kcu.TABLE_NAME
WHERE 
    tc.TABLE_SCHEMA = 'ecommerce_db'
    AND tc.TABLE_NAME = 'orders'
    AND tc.CONSTRAINT_TYPE IN ('FOREIGN KEY', 'CHECK', 'UNIQUE')
ORDER BY 
    tc.CONSTRAINT_NAME
```

**提取结果**（orders 表）：
```
✓ orders 表包含 1 个约束:
  1. uk_order_no (UNIQUE) - order_no
  
⚠️ 注意：生产环境不使用显式外键约束，在应用层保证数据一致性
```

---

#### 步骤 6: 生成表的 DDL 语句

**AI 执行 SQL**（以 `users` 表为例）：
```sql
SHOW CREATE TABLE `users`
```

**提取结果**：
```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码（BCrypt加密）',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint DEFAULT 3 COMMENT '性别：1-男，2-女，3-未知',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` varchar(64) DEFAULT NULL COMMENT '创建人',
  `update_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=12457 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

#### 步骤 7: 生成 Markdown 文档

**AI 生成的完整文档**：

```markdown
# ecommerce_db 数据库表结构文档

**生成时间**: 2025-11-10 15:30:00  
**数据库名称**: ecommerce_db  
**MySQL 版本**: 8.0.35  
**表数量**: 8  
**总数据行数**: 134,010  
**总数据大小**: 45.67 MB  
**总索引大小**: 12.34 MB  

---

## 📋 表列表

1. [users](#users) - 用户表 (12,456 rows)
2. [products](#products) - 商品表 (5,678 rows)
3. [categories](#categories) - 分类表 (50 rows)
4. [orders](#orders) - 订单表 (23,456 rows)
5. [order_items](#order_items) - 订单明细表 (67,890 rows)
6. [carts](#carts) - 购物车表 (3,456 rows)
7. [addresses](#addresses) - 收货地址表 (8,901 rows)
8. [payments](#payments) - 支付记录表 (20,123 rows)

---

## users

**说明**: 用户表  
**存储引擎**: InnoDB  
**创建时间**: 2025-09-01 10:00:00  
**数据行数**: 12,456  
**数据大小**: 8.9 MB  
**索引大小**: 2.3 MB  

### 字段定义

| 字段名 | 类型 | 可空 | 默认值 | 键 | 额外 | 说明 |
|--------|------|------|--------|-----|------|------|
| `id` | bigint unsigned | 否 | - | PRI | auto_increment | 用户ID |
| `username` | varchar(50) | 否 | - | UNI | - | 用户名 |
| `password` | varchar(255) | 否 | - | - | - | 密码（BCrypt加密） |
| `email` | varchar(100) | 否 | - | UNI | - | 邮箱 |
| `phone` | varchar(20) | 否 | - | UNI | - | 手机号 |
| `real_name` | varchar(50) | 是 | NULL | - | - | 真实姓名 |
| `avatar_url` | varchar(255) | 是 | NULL | - | - | 头像URL |
| `gender` | tinyint | 是 | 3 | - | - | 性别：1-男，2-女，3-未知 |
| `birthday` | date | 是 | NULL | - | - | 生日 |
| `status` | tinyint | 否 | 1 | MUL | - | 状态：1-正常，2-禁用 |
| `last_login_time` | datetime | 是 | NULL | - | - | 最后登录时间 |
| `create_time` | datetime | 否 | CURRENT_TIMESTAMP | - | - | 创建时间 |
| `update_time` | datetime | 否 | CURRENT_TIMESTAMP | - | on update CURRENT_TIMESTAMP | 更新时间 |
| `create_by` | varchar(64) | 是 | NULL | - | - | 创建人 |
| `update_by` | varchar(64) | 是 | NULL | - | - | 更新人 |

### 索引定义

| 索引名 | 类型 | 字段 | 唯一性 | 说明 |
|--------|------|------|--------|------|
| PRIMARY | BTREE | `id` | 是 | 主键索引 |
| uk_username | BTREE | `username` | 是 | 用户名唯一索引 |
| uk_email | BTREE | `email` | 是 | 邮箱唯一索引 |
| uk_phone | BTREE | `phone` | 是 | 手机号唯一索引 |
| idx_status | BTREE | `status` | 否 | 状态索引 |

### DDL 语句

```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码（BCrypt加密）',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint DEFAULT 3 COMMENT '性别：1-男，2-女，3-未知',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` varchar(64) DEFAULT NULL COMMENT '创建人',
  `update_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=12457 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

## orders

**说明**: 订单表  
**存储引擎**: InnoDB  
**创建时间**: 2025-09-01 10:00:00  
**数据行数**: 23,456  
**数据大小**: 15.2 MB  
**索引大小**: 3.8 MB  

### 字段定义

| 字段名 | 类型 | 可空 | 默认值 | 键 | 额外 | 说明 |
|--------|------|------|--------|-----|------|------|
| `id` | bigint unsigned | 否 | - | PRI | auto_increment | 订单ID |
| `order_no` | varchar(32) | 否 | - | UNI | - | 订单号 |
| `user_id` | bigint unsigned | 否 | - | MUL | - | 用户ID |
| `total_amount` | decimal(10,2) | 否 | - | - | - | 订单总金额 |
| `payment_amount` | decimal(10,2) | 否 | 0.00 | - | - | 实际支付金额 |
| `discount_amount` | decimal(10,2) | 否 | 0.00 | - | - | 优惠金额 |
| `status` | tinyint | 否 | 1 | MUL | - | 状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消 |
| `payment_method` | varchar(20) | 是 | NULL | - | - | 支付方式：alipay-支付宝，wechat-微信，bank-银行卡 |
| `payment_time` | datetime | 是 | NULL | - | - | 支付时间 |
| `delivery_time` | datetime | 是 | NULL | - | - | 发货时间 |
| `completion_time` | datetime | 是 | NULL | - | - | 完成时间 |
| `cancel_time` | datetime | 是 | NULL | - | - | 取消时间 |
| `remark` | varchar(500) | 是 | NULL | - | - | 备注 |
| `create_time` | datetime | 否 | CURRENT_TIMESTAMP | - | - | 创建时间 |
| `update_time` | datetime | 否 | CURRENT_TIMESTAMP | - | on update CURRENT_TIMESTAMP | 更新时间 |

### 索引定义

| 索引名 | 类型 | 字段 | 唯一性 | 说明 |
|--------|------|------|--------|------|
| PRIMARY | BTREE | `id` | 是 | 主键索引 |
| uk_order_no | BTREE | `order_no` | 是 | 订单号唯一索引 |
| idx_user_status_time | BTREE | `user_id`, `status`, `create_time` | 否 | 用户订单列表查询联合索引 |
| idx_create_time | BTREE | `create_time` | 否 | 创建时间索引（统计查询） |
| idx_payment_time | BTREE | `payment_time` | 否 | 支付时间索引 |

### DDL 语句

```sql
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单号',
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `payment_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '实际支付金额',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '优惠金额',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消',
  `payment_method` varchar(20) DEFAULT NULL COMMENT '支付方式：alipay-支付宝，wechat-微信，bank-银行卡',
  `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
  `delivery_time` datetime DEFAULT NULL COMMENT '发货时间',
  `completion_time` datetime DEFAULT NULL COMMENT '完成时间',
  `cancel_time` datetime DEFAULT NULL COMMENT '取消时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_status_time` (`user_id`, `status`, `create_time`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_payment_time` (`payment_time`)
) ENGINE=InnoDB AUTO_INCREMENT=23457 DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

---

## 📊 数据库统计

### 表统计
- **总表数**: 8
- **总数据行数**: 134,010
- **总数据大小**: 45.67 MB
- **总索引大小**: 12.34 MB

### 字段统计
- **总字段数**: 95
- **包含注释的字段**: 95 (100%)
- **标准字段覆盖率**: 100%
  - create_time: 8/8
  - update_time: 8/8
  - create_by: 6/8
  - update_by: 6/8

### 索引统计
- **主键索引**: 8
- **唯一索引**: 15
- **普通索引**: 22
- **总索引数**: 45

### 字符集统计
- **数据库字符集**: utf8mb4
- **数据库排序规则**: utf8mb4_unicode_ci
- **所有表字符集一致**: ✓

---

**生成工具**: doc-db-schema v3.0.0  
**文档版本**: 1.0  
**文档有效期**: 建议每月更新  
```

---

#### 步骤 8: 验证文档完整性

**AI 验证清单**：
```
✓ 功能验证
  ✓ 成功连接到数据库
  ✓ 成功提取所有表的列表 (8 个表)
  ✓ 成功提取所有表的字段定义 (95 个字段)
  ✓ 成功提取所有表的索引信息 (45 个索引)
  ✓ 成功提取所有表的 DDL 语句 (8 个表)
  ✓ 成功生成 Markdown 文档

✓ 质量验证
  ✓ 文档包含所有表（无遗漏）
  ✓ 字段定义完整（字段名、类型、注释、默认值、约束）
  ✓ 索引定义正确（索引名、类型、字段、唯一性）
  ✓ DDL 语句可执行（已在测试环境验证）
  ✓ 中文注释无乱码（使用 utf8mb4 字符集）
  ✓ Markdown 格式正确（表格、代码块、标题）

✓ 技术栈验证
  ✓ 遵循 MySQL 连接管理最佳实践
  ✓ 遵循数据库字段规范指南（标准字段覆盖率 100%）
  ✓ 遵循数据库索引设计指南（索引命名规范）
  ✓ 遵循设计决策框架（生产环境无显式外键约束）

✓ 性能验证
  ✓ 文档生成时间: 3.2 秒
  ✓ 数据库连接已正确关闭
  ✓ 内存使用: 28 MB
```

---

## 示例 2: 按模块分组生成文档

### 用户输入
```
我的数据库包含多个业务模块（用户模块、商品模块、订单模块），请按模块分组生成表结构文档。
```

### AI 生成的文档（部分）

```markdown
# ecommerce_db 数据库表结构文档

## 📋 按模块分组的表列表

### 用户模块 (User Module)
- [sys_user](#sys_user) - 系统用户表
- [sys_role](#sys_role) - 系统角色表
- [sys_user_role](#sys_user_role) - 用户角色关联表

### 商品模块 (Product Module)
- [product_category](#product_category) - 商品分类表
- [product_info](#product_info) - 商品信息表
- [product_sku](#product_sku) - 商品SKU表

### 订单模块 (Order Module)
- [order_info](#order_info) - 订单信息表
- [order_item](#order_item) - 订单明细表
- [order_payment](#order_payment) - 订单支付表

---

## 用户模块

### sys_user

**说明**: 系统用户表  
**模块**: 用户模块  
**业务职责**: 存储系统用户的基本信息、登录凭证和状态  

[字段定义、索引定义、DDL语句...]

---

## 商品模块

### product_info

**说明**: 商品信息表  
**模块**: 商品模块  
**业务职责**: 存储商品的基本信息、价格和库存  

[字段定义、索引定义、DDL语句...]

---
```

---

## 示例 3: 只生成特定表的文档

### 用户输入
```
我只需要生成 users、orders、order_items 这三个表的结构文档。
```

### AI 操作

**步骤 2 修改**：只查询指定的表
```sql
SELECT 
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_comment,
    ENGINE as engine,
    CREATE_TIME as create_time,
    TABLE_ROWS as table_rows
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'ecommerce_db'
    AND TABLE_NAME IN ('users', 'orders', 'order_items')
ORDER BY 
    TABLE_NAME ASC
```

**生成的文档**：只包含指定的 3 个表的完整结构信息。

---

## 示例 4: 生成数据库变更对比文档

### 用户输入
```
我想对比当前数据库和上周的备份，看看表结构有哪些变化。
```

### AI 操作流程

1. **连接当前数据库**，提取表结构
2. **恢复历史备份到临时数据库**，提取表结构
3. **对比两个版本的表结构**，识别差异：
   - 新增的表
   - 删除的表
   - 修改的表（字段变更、索引变更）
4. **生成变更对比文档**

**生成的文档（部分）**：
```markdown
# 数据库表结构变更对比文档

**对比版本**: 
- **当前版本**: 2025-11-10 (ecommerce_db)
- **历史版本**: 2025-11-03 (ecommerce_db_backup_20251103)

---

## 📊 变更统计

- **新增表**: 2
- **删除表**: 0
- **修改表**: 3
- **无变更表**: 6

---

## 🆕 新增表

### 1. user_login_logs

**说明**: 用户登录日志表  
**创建时间**: 2025-11-05  

[完整表结构...]

### 2. product_reviews

**说明**: 商品评价表  
**创建时间**: 2025-11-07  

[完整表结构...]

---

## 🔄 修改表

### 1. users 表变更

**字段变更**:
- ✅ 新增字段: `last_login_ip` (VARCHAR(50)) - 最后登录IP
- ✅ 新增字段: `login_failed_count` (INT) - 登录失败次数
- ⚠️ 修改字段: `phone` (VARCHAR(20) → VARCHAR(30)) - 手机号

**索引变更**:
- ✅ 新增索引: `idx_last_login_time` (last_login_time) - 最后登录时间索引

**对比 DDL**:
```sql
-- 历史版本
CREATE TABLE `users` (
  ...
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  ...
);

-- 当前版本
CREATE TABLE `users` (
  ...
  `phone` varchar(30) NOT NULL COMMENT '手机号',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `login_failed_count` int NOT NULL DEFAULT 0 COMMENT '登录失败次数',
  ...
  KEY `idx_last_login_time` (`last_login_time`)
);
```

---
```

---

## 总结

通过以上示例，展示了 `doc-db-schema` 技能在不同场景下的使用：

1. **示例 1**: 完整的 8 步骤流程，生成电商系统数据库的完整表结构文档
2. **示例 2**: 按业务模块分组生成文档，便于理解业务结构
3. **示例 3**: 只生成特定表的文档，满足针对性需求
4. **示例 4**: 生成数据库变更对比文档，追踪表结构演化

核心要点：
- ✅ 连接数据库并验证权限
- ✅ 提取完整的表结构信息（字段、索引、约束、DDL）
- ✅ 生成规范化的 Markdown 文档
- ✅ 支持按模块分组、特定表过滤、变更对比等高级功能
- ✅ 遵循 MySQL 最佳实践和数据库设计规范
