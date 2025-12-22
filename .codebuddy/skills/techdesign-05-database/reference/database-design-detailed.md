---
name: design-db
description: 基于业务实体和需求文档，设计规范化的数据库表结构 - 遵循技术栈最佳实践（MySQL + MyBatis-Plus），包含表设计、索引优化、字段规范，输出完整的 DDL 和设计说明
category: design
tech_stack:
  - mysql
  - mybatis-plus
---

# Skill: 数据库设计（Database Design）

基于 **MySQL + MyBatis-Plus** 技术栈，将业务实体和需求文档转化为规范化的数据库表结构设计。

## 🎯 目标

**原子性任务**: 从已识别的业务实体出发，设计完整的数据库表结构，确保数据完整性、查询性能和可扩展性。

**适用场景**:
- 业务实体已明确，需要设计数据库表结构
- 实体关系已梳理，需要转化为表关系
- 查询场景已确定，需要设计索引策略
- 数据量级已评估，需要考虑分表策略

**技术栈**:
- MySQL 8.0+ (数据库)
- MyBatis-Plus 3.5+ (ORM 框架)
- Spring Boot 3.x (集成框架)

## 📚 技术栈参考

本技能基于以下技术栈文档（**必需章节**）：
- [MySQL 数据库](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 数据库设计和优化
- [MyBatis-Plus ORM](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md) - ORM 框架集成
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md) - 应用框架

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解架构建议。

## 📋 前置条件

- [ ] 已明确业务实体和属性（Entity + Fields）
- [ ] 已分析实体关系（1:1、1:N、M:N）
- [ ] 已了解查询场景和性能要求
- [ ] 已评估数据量级（当前 + 未来 1-2 年）

**技术要求**:
- MySQL 8.0+ 已安装
- 了解 SQL DDL 语法
- 了解 InnoDB 存储引擎特性
- 了解 MyBatis-Plus 的表映射机制

## 🔄 执行步骤

### 步骤 1: 识别业务实体和属性

**目标**: 从需求文档中提取业务实体，明确每个实体的属性和数据类型。

**操作**:
1. **提取实体** - 识别需求中的名词，区分实体和属性
2. **定义属性** - 明确每个实体的属性、数据类型、约束
3. **分析关系** - 确定实体间的关系类型（1:1、1:N、M:N）

**示例**（电商系统）:

```markdown
## 业务实体分析

### 实体列表

1. **用户（User）**
   - id (主键)
   - username (用户名，唯一)
   - password (密码，加密)
   - email (邮箱，唯一)
   - phone (手机号，唯一)
   - status (状态: 1-正常, 2-禁用)

2. **订单（Order）**
   - id (主键)
   - order_no (订单号，唯一)
   - user_id (用户ID，外键)
   - total_amount (总金额)
   - status (状态: 1-待支付, 2-已支付, 3-已发货, 4-已完成, 5-已取消)

3. **订单明细（OrderItem）**
   - id (主键)
   - order_id (订单ID)
   - product_id (商品ID)
   - product_name (商品名称，冗余)
   - quantity (数量)
   - price (单价，冗余)

### 实体关系
- User 1:N Order (一个用户有多个订单)
- Order 1:N OrderItem (一个订单有多个商品)
- Product M:N Order (通过 OrderItem 关联)
```

**技术要点**:
- 遵循 [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) 的表设计规范
- 使用 MyBatis-Plus 推荐的字段命名（下划线命名）
- 区分核心字段和冗余字段

---

### 步骤 2: 设计表结构

**目标**: 将业务实体转化为数据库表，遵循规范化原则，同时考虑性能优化。

**规范化原则**:
- **第一范式（1NF）**: 字段不可再分（原子性）
- **第二范式（2NF）**: 非主键字段完全依赖主键
- **第三范式（3NF）**: 非主键字段不依赖其他非主键字段

**反规范化场景**:
- ✅ 为提升查询性能，适当冗余字段（如 product_name、price）
- ✅ 为减少 JOIN，合并表（如用户基本信息 + 扩展信息）
- ✅ 为统计分析，增加汇总字段（如 order_count、total_amount）

**表设计规范**（遵循 [数据库字段规范](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md)）:

#### 2.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 表名 | 小写字母 + 下划线，复数形式 | `users`, `orders`, `order_items` |
| 字段名 | 小写字母 + 下划线 | `user_id`, `create_time`, `total_amount` |
| 主键 | 统一使用 `id` | `id BIGINT UNSIGNED AUTO_INCREMENT` |
| 外键 | `关联表_id` | `user_id`, `order_id`, `product_id` |

#### 2.2 字段类型选择

| 数据类型 | MySQL 类型 | 适用场景 | 示例 |
|---------|-----------|---------|------|
| 整数 | `TINYINT` (1字节) | 小范围整数（-128 ~ 127） | status, type |
| 整数 | `INT` (4字节) | 一般整数（-21亿 ~ 21亿） | quantity |
| 整数 | `BIGINT` (8字节) | 大范围整数、ID | id, user_id |
| 字符串 | `VARCHAR(N)` | 变长字符串 | username, email |
| 字符串 | `CHAR(N)` | 定长字符串 | country_code (2) |
| 长文本 | `TEXT` | 长文本（>5000字） | description, content |
| 日期时间 | `DATETIME` | 精确到秒 | create_time, update_time |
| 日期时间 | `TIMESTAMP` | 时间戳（自动更新） | update_time |
| 金额 | `DECIMAL(M,D)` | 精确小数 | price DECIMAL(10,2) |
| 布尔 | `TINYINT(1)` | 0/1 | is_active, enable_flag |

#### 2.3 必备字段（所有表都必须包含）

```sql
-- 标准字段（遵循 database-fields.md 规范）
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
create_by VARCHAR(50) NULL COMMENT '创建人',
update_by VARCHAR(50) NULL COMMENT '更新人',
enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
delete_time DATETIME NULL DEFAULT NULL COMMENT '删除时间（软删除）'
```

**字段说明**:
- `id`: 主键，BIGINT UNSIGNED（支持 21 亿亿条记录）
- `create_time`: 创建时间，自动填充
- `update_time`: 更新时间，自动更新
- `create_by`: 创建人（可选，用于审计）
- `update_by`: 更新人（可选，用于审计）
- `enable_flag`: 启用标记（可选，用于禁用而非删除）
- `delete_time`: 删除时间（软删除，NULL 表示未删除）

#### 2.4 字段约束

| 约束 | 说明 | 示例 |
|------|------|------|
| `NOT NULL` | 非空约束 | `username VARCHAR(50) NOT NULL` |
| `DEFAULT` | 默认值 | `status TINYINT DEFAULT 1` |
| `UNIQUE` | 唯一约束 | `UNIQUE KEY uk_username (username)` |
| `COMMENT` | 字段注释（**必须**） | `COMMENT '用户名'` |

**完整示例**（用户表）:

```sql
-- 用户表
CREATE TABLE `users` (
  -- 主键
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  
  -- 业务字段
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt 加密）',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `nickname` VARCHAR(50) NULL COMMENT '昵称',
  `avatar` VARCHAR(255) NULL COMMENT '头像URL',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  
  -- 标准字段
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  
  -- 主键和索引
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

**技术要点**:
- 遵循 [MyBatis-Plus](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md) 的字段命名规范
- 使用 `InnoDB` 存储引擎（支持事务和外键）
- 使用 `utf8mb4` 字符集（支持 Emoji）
- 所有字段都有 `COMMENT` 注释

---

### 步骤 3: 索引设计

**目标**: 根据查询场景设计索引，提升查询性能。

**索引类型**:

| 类型 | MySQL 语法 | 适用场景 | 示例 |
|------|-----------|---------|------|
| 主键索引 | `PRIMARY KEY` | 唯一且非空 | `PRIMARY KEY (id)` |
| 唯一索引 | `UNIQUE KEY` | 保证唯一性 | `UNIQUE KEY uk_username (username)` |
| 普通索引 | `KEY` | 加速查询 | `KEY idx_status (status)` |
| 联合索引 | `KEY` | 多字段查询 | `KEY idx_user_status (user_id, status)` |
| 全文索引 | `FULLTEXT KEY` | 全文检索 | `FULLTEXT KEY ft_content (content)` |

**索引设计原则**（参考 [索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md)）:

#### 3.1 最左前缀原则（必须遵守）

复合索引遵循最左前缀原则，查询条件应从左到右匹配索引列。

**示例**:
```sql
-- 索引定义
KEY idx_user_status_time (user_id, status, create_time)

-- ✅ 可以利用索引
WHERE user_id = ? AND status = ?
WHERE user_id = ? AND status = ? AND create_time > ?
WHERE user_id = ?

-- ❌ 无法利用索引
WHERE status = ? AND create_time > ?
WHERE create_time > ?
```

#### 3.2 联合索引字段顺序（重点）

**顺序原则**: 等值查询 → 范围查询 → 排序字段

**查询场景**: `WHERE user_id = ? AND status = ? AND create_time > ? ORDER BY create_time DESC`

**正确的索引**:
```sql
KEY idx_user_status_time (user_id, status, create_time)
-- 解释:
-- 1. user_id: 等值查询，放最前面
-- 2. status: 等值查询，放中间
-- 3. create_time: 范围查询 + 排序，放最后
```

**错误的索引**:
```sql
❌ KEY idx_time_user_status (create_time, user_id, status)
-- 问题: create_time 是范围查询，不应放最前面
-- 结果: 索引无法生效
```

#### 3.3 高选择性优先（必须遵守）

区分度高的字段优先建索引，区分度低的字段避免建索引。

**示例**:
```sql
-- ✅ 高区分度字段，适合建索引
UNIQUE KEY uk_username (username)    -- 区分度: 100%
UNIQUE KEY uk_email (email)          -- 区分度: 100%
KEY idx_user_id (user_id)            -- 区分度: 高

-- ❌ 低区分度字段，不建议建索引
KEY idx_gender (gender)              -- 区分度: 50% (男/女)
KEY idx_status (status)              -- 区分度: 低 (1-5 个状态)
```

#### 3.4 查询场景分析

**步骤**:
1. **列出所有查询 SQL** - 包括 WHERE、ORDER BY、JOIN 字段
2. **评估查询频率** - 高频查询优先优化
3. **设计索引** - 遵循最左前缀、高选择性原则
4. **验证索引** - 使用 EXPLAIN 分析查询计划

**示例**（订单查询场景）:

```markdown
## 查询场景分析

### 场景 1: 查询用户的所有订单，按时间倒序
```sql
SELECT * FROM orders WHERE user_id = ? ORDER BY create_time DESC;
```
**索引设计**: `KEY idx_user_time (user_id, create_time)`

### 场景 2: 查询某状态的订单，按时间倒序
```sql
SELECT * FROM orders WHERE status = ? ORDER BY create_time DESC;
```
**索引设计**: `KEY idx_status_time (status, create_time)`

### 场景 3: 查询用户某状态的订单
```sql
SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY create_time DESC;
```
**索引设计**: `KEY idx_user_status_time (user_id, status, create_time)`
```

#### 3.5 验证索引（使用 EXPLAIN）

**步骤**:
1. **执行 EXPLAIN** - 分析查询计划
2. **检查 type** - 应为 `ref`/`const`，避免 `ALL`（全表扫描）
3. **检查 Extra** - 避免 `Using filesort`、`Using temporary`
4. **优化索引** - 根据 EXPLAIN 结果调整索引

**示例**:
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY create_time DESC;

-- 期望结果:
-- type: ref (使用索引)
-- key: idx_user_status_time (使用的索引)
-- Extra: (无 Using filesort)
```

**参考**:
- [索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md) - 8 个常见查询场景
- [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 索引优化

---

### 步骤 4: 分表策略（可选）

**目标**: 当数据量达到一定规模时，设计分表方案，提升性能和可扩展性。

**何时分表**（必须满足以下条件之一）:
- 单表数据量 > 1000 万 **且** 查询性能无法通过索引优化
- 单库 QPS > 1000 **且** 无法通过读写分离解决
- 单表文件大小 > 10GB **且** 存储空间是瓶颈

**重要提示**: 分表会大幅增加系统复杂度，应该是最后的优化手段。优先考虑：
1. ✅ 索引优化
2. ✅ 查询优化
3. ✅ 缓存策略（Redis）
4. ✅ 读写分离
5. ⚠️ 最后才考虑分表

**分表策略**:

| 策略 | 说明 | 适用场景 | 示例 |
|------|------|---------|------|
| 垂直分库 | 按业务模块拆分 | 微服务架构 | 用户库、订单库、商品库 |
| 垂直分表 | 按字段拆分 | 字段过多、冷热分离 | 常用字段表 + 扩展字段表 |
| 水平分库 | 按数据拆分到多个库 | 数据量大、高并发 | 按 user_id 取模分 4 个库 |
| 水平分表 | 按数据拆分到多个表 | 数据量大、时序数据 | 按月分表（orders_202501, orders_202502） |

**分片键选择**:
- **用户维度**: 按 `user_id` 分片（适合用户相关数据）
- **时间维度**: 按 `create_time` 分片（适合日志、订单等时序数据）
- **地域维度**: 按 `region` 分片（适合地域相关数据）

**示例**（订单表水平分表）:

```markdown
## 分表策略

### 场景
订单表预计 1 年后达到 5000 万条记录，单表查询性能下降。

### 方案
水平分表，按 `user_id` 取模分 16 张表。

### 表命名
```sql
orders_0, orders_1, ..., orders_15
```

### 路由规则
```python
table_index = user_id % 16
table_name = f"orders_{table_index}"
```

### 查询路由
- **按 user_id 查询**: 直接路由到对应表
- **按 order_no 查询**: 建立映射表 `order_no_mapping`
- **按时间范围查询**: 查询所有表，应用层聚合

### 扩容方案
- 当前 16 张表，支持 5000 万订单
- 扩容到 32 张表：数据迁移 + 路由规则调整
```

**参考**:
- [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md) - 分表决策流程

---

### 步骤 5: 生成完整的 DDL 语句

**目标**: 输出可直接执行的 DDL 语句，包含所有表、索引、注释。

**输出内容**:
1. **数据库创建语句**（可选）
2. **表创建语句**（完整的 DDL）
3. **索引创建语句**（已包含在 CREATE TABLE 中）
4. **设计说明**（表关系、冗余字段说明、索引策略）

**示例**:

```sql
-- ============================================
-- 数据库设计 DDL
-- 项目: 电商系统
-- 版本: 1.0
-- 创建时间: 2025-11-07
-- ============================================

-- 1. 创建数据库（可选）
CREATE DATABASE IF NOT EXISTS `ecommerce` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `ecommerce`;

-- ============================================
-- 2. 用户表
-- ============================================
CREATE TABLE `users` (
  -- 主键
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  
  -- 业务字段
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt 加密）',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `nickname` VARCHAR(50) NULL COMMENT '昵称',
  `avatar` VARCHAR(255) NULL COMMENT '头像URL',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  
  -- 标准字段
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  
  -- 主键和索引
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 3. 订单表
-- ============================================
CREATE TABLE `orders` (
  -- 主键
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  
  -- 业务字段
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消',
  
  -- 标准字段
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  
  -- 主键和索引
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status_time` (`status`, `create_time`),
  KEY `idx_user_status_time` (`user_id`, `status`, `create_time`),
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ============================================
-- 4. 订单明细表
-- ============================================
CREATE TABLE `order_items` (
  -- 主键
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  
  -- 业务字段
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称（冗余，防止商品信息变更）',
  `quantity` INT NOT NULL COMMENT '购买数量',
  `price` DECIMAL(10,2) NOT NULL COMMENT '商品单价（冗余，记录下单时的价格）',
  
  -- 标准字段
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 主键和索引
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';
```

**设计说明**:

```markdown
## 数据库设计说明

### 1. 表关系
- `users` 1:N `orders` (一个用户有多个订单)
- `orders` 1:N `order_items` (一个订单有多个商品)
- `products` M:N `orders` (通过 `order_items` 关联)

### 2. 冗余字段说明
- `order_items.product_name`: 冗余商品名称，防止商品信息变更导致历史订单显示错误
- `order_items.price`: 冗余商品单价，记录下单时的价格，而非当前商品价格

### 3. 索引策略
- `users.uk_username`: 唯一索引，用于用户名登录查询
- `orders.idx_user_status_time`: 联合索引，用于查询用户某状态的订单并按时间排序
- `order_items.idx_order_id`: 普通索引，用于查询订单明细

### 4. 软删除
所有表都使用 `delete_time` 字段实现软删除，NULL 表示未删除。

### 5. 字符集
使用 `utf8mb4` 字符集，支持 Emoji 和多语言。
```

**技术要点**:
- 遵循 [数据库字段规范](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md)
- 所有表都有标准字段（create_time、update_time、delete_time 等）
- 所有字段都有 COMMENT 注释
- 使用 InnoDB 存储引擎
- 使用 utf8mb4 字符集

---

## 💡 最佳实践

### 1. 规范化 vs 性能优化

✅ **推荐**: 适当冗余，提升查询性能

```sql
-- 订单明细表
CREATE TABLE `order_items` (
  `id` BIGINT,
  `order_id` BIGINT,
  `product_id` BIGINT,
  `product_name` VARCHAR(200),  -- 冗余商品名称
  `price` DECIMAL(10,2)  -- 冗余单价
  -- 冗余理由: 防止商品信息变更，保留历史快照
);
```

❌ **不推荐**: 过度规范化，导致大量 JOIN

```sql
-- 查询订单明细需要 JOIN 商品表
SELECT oi.*, p.product_name 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
WHERE oi.order_id = ?;
```

### 2. 索引设计原则

✅ **推荐**: 遵循最左前缀原则，合理设计联合索引

```sql
-- 查询: WHERE user_id = ? AND status = ? ORDER BY create_time DESC
KEY idx_user_status_time (user_id, status, create_time)
-- 等值查询在前，排序字段在后
```

❌ **不推荐**: 索引顺序错误，无法生效

```sql
-- 查询: WHERE user_id = ? AND status = ? ORDER BY create_time DESC
KEY idx_time_user_status (create_time, user_id, status)
-- 问题: create_time 是排序字段，不应放最前面
```

### 3. 字段类型选择

✅ **推荐**: 选择合适的字段类型

```sql
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT,  -- 主键用 BIGINT
  `order_no` VARCHAR(32) NOT NULL,      -- 订单号用 VARCHAR
  `total_amount` DECIMAL(10,2) NOT NULL, -- 金额用 DECIMAL
  `status` TINYINT NOT NULL DEFAULT 1   -- 状态用 TINYINT
);
```

❌ **不推荐**: 字段类型选择不当

```sql
CREATE TABLE `orders` (
  `id` INT,                    -- 应该用 BIGINT
  `total_amount` FLOAT,        -- 应该用 DECIMAL（精度问题）
  `status` VARCHAR(20)         -- 应该用 TINYINT
);
```

### 4. 软删除实现

✅ **推荐**: 使用 `delete_time` 字段实现软删除

```sql
CREATE TABLE `users` (
  `id` BIGINT,
  `username` VARCHAR(50),
  `delete_time` DATETIME NULL DEFAULT NULL,
  KEY `idx_delete_time` (`delete_time`)
);

-- 软删除
UPDATE users SET delete_time = NOW() WHERE id = ?;

-- 查询时过滤已删除数据
SELECT * FROM users WHERE delete_time IS NULL;

-- 可以恢复数据
UPDATE users SET delete_time = NULL WHERE id = ?;
```

❌ **不推荐**: 物理删除

```sql
DELETE FROM users WHERE id = ?;
-- 数据永久丢失，无法恢复
```

---

## ⚠️ 常见错误

### 错误 1: 金额字段使用 FLOAT/DOUBLE

**症状**: 金额计算出现精度问题

**原因**: FLOAT/DOUBLE 是浮点数，存在精度误差

**解决**:
```sql
❌ 错误:
CREATE TABLE `orders` (
  `total_amount` FLOAT
);

✅ 正确:
CREATE TABLE `orders` (
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额'
);
```

**参考**: [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 数据类型选择

---

### 错误 2: 主键使用 VARCHAR

**症状**: 查询性能差、索引占用空间大

**原因**: VARCHAR 主键性能差于 BIGINT

**解决**:
```sql
❌ 错误:
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY  -- UUID
);

✅ 正确:
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
);
```

---

### 错误 3: 联合索引顺序错误

**症状**: 索引无法生效，查询慢

**原因**: 联合索引不遵循最左前缀原则

**解决**:
```sql
-- 查询: WHERE user_id = ? AND status = ? ORDER BY create_time DESC

❌ 错误:
KEY idx_status_time_user (status, create_time, user_id)

✅ 正确:
KEY idx_user_status_time (user_id, status, create_time)
-- 等值查询在前，排序字段在后
```

**参考**: [索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md)

---

### 错误 4: 缺少必备字段

**症状**: 无法审计、无法软删除

**原因**: 未添加标准字段

**解决**:
```sql
❌ 错误:
CREATE TABLE `users` (
  `id` BIGINT,
  `username` VARCHAR(50)
  -- 缺少 create_time、update_time、delete_time
);

✅ 正确:
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_by` VARCHAR(50) NULL,
  `update_by` VARCHAR(50) NULL,
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1,
  `delete_time` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

**参考**: [数据库字段规范](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md)

---

## ✅ 验证清单

完成数据库设计后，必须通过以下检查:

**业务完整性** (不通过 = 重新设计):
- [ ] 列出所有业务实体，逐一确认已建表
- [ ] 画出 ER 图，确认所有实体关系都已体现
- [ ] 列出所有业务规则，确认已用约束实现（唯一/非空）
- [ ] 模拟核心业务流程，确认表结构支持

**规范性** (不通过 = 修改表结构):
- [ ] 表名小写 + 下划线，复数形式（如: users, orders）
- [ ] 字段名小写 + 下划线（如: user_id, create_time）
- [ ] 主键统一用 id，外键用 "关联表_id"
- [ ] 必备字段: id, create_time, update_time, delete_time
- [ ] 所有字段都有 COMMENT 注释
- [ ] 字段类型选择合理（金额用 DECIMAL，ID 用 BIGINT）

**索引设计** (不通过 = 重新设计索引):
- [ ] 列出所有高频查询 SQL，逐一确认有索引
- [ ] 联合索引遵循最左前缀原则
- [ ] 联合索引顺序: 等值查询在前，范围查询在中，排序在后
- [ ] 用 EXPLAIN 分析查询计划，确认 type=ref/const（不是 ALL）
- [ ] 检查 Extra 字段，避免 Using filesort 和 Using temporary
- [ ] 每个表索引数量不超过 5-8 个
- [ ] 删除区分度低的索引（如: 性别、状态值少的字段）

**性能评估** (不通过 = 优化设计):
- [ ] 评估单表数据量，>1000 万考虑分表
- [ ] 评估查询 QPS，>1000 考虑读写分离
- [ ] 评估存储空间，>10GB 考虑分库
- [ ] 冗余字段有明确理由和注释
- [ ] 避免过度规范化导致大量 JOIN

**可扩展性** (不通过 = 调整设计):
- [ ] 表结构支持未来 1 年业务增长
- [ ] 分表方案支持扩容（如: 16 表→32 表）
- [ ] 预留扩展字段或使用 JSON 字段存储动态属性
- [ ] 软删除设计，数据可恢复

**文档完整性** (不通过 = 补充文档):
- [ ] DDL 语句完整，可直接执行
- [ ] 索引设计有说明（为什么这样建）
- [ ] 冗余字段有说明（为什么冗余）
- [ ] 分表方案有说明（路由规则、扩容方案）
- [ ] ER 图清晰，包含所有实体和关系

**红灯信号 - 立即停止**:
- ❌ 金额字段用 FLOAT/DOUBLE（精度问题）
- ❌ 主键用 VARCHAR（性能差）
- ❌ 没有索引（全表扫描）
- ❌ 联合索引顺序错误（索引无法生效）
- ❌ 物理删除数据（无法恢复）
- ❌ 过度规范化（大量 JOIN）
- ❌ 索引滥用（每个字段都建索引）

**所有这些都意味着: 数据库设计有严重问题，必须重新设计。**

---

## 📚 可重用资源

### 参考文档
- `reference.md` - 数据库设计详细指南和技术文档（如需要）

### 模板
- `templates/table-template.sql` - 表创建 SQL 模板（如需要）
- `templates/design-template.md` - 设计文档模板（如需要）

### 示例
- `examples.md` - 实际使用示例和最佳实践（如需要）

---

## 🔗 相关技能

- **前置技能**: `design-entity` - 实体设计（业务实体识别）
- **后续技能**: `design-api` - 接口设计（API 定义）
- **辅助技能**: `doc-db-schema` - 数据库文档生成

---

## 📖 参考资料

### 技术栈文档
- [MySQL 数据库](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 数据库设计和优化
- [MyBatis-Plus ORM](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md) - ORM 框架集成
- [Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md) - 应用框架

### 规范文档
- [数据库字段规范](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md) - 标准字段定义
- [索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md) - 索引设计原则
- [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md) - 分表决策流程

### 书籍和参考
- 《高性能 MySQL》- Baron Schwartz
- 《MySQL 技术内幕：InnoDB 存储引擎》- 姜承尧
- 《数据库系统概念》- Abraham Silberschatz
- 阿里巴巴 Java 开发手册 - 数据库规约

---

## 🔄 版本历史

- **v2.0** (2025-11-07): 完全重写，聚焦数据库设计原子任务
  - 深度集成 MySQL + MyBatis-Plus 技术栈
  - 提供完整的 DDL 生成流程
  - 新增索引设计详细指南（最左前缀、联合索引顺序）
  - 新增分表策略决策流程
  - 新增完整的验证清单
  - 提供大量真实示例和最佳实践

- **v1.0**: 初始版本
