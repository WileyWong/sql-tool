# 数据库字段规范指南

**适用范围**: 所有基于 Spring Boot 3.x 的招聘相关微服务  
**文档版本**: 1.0  
**最后更新**: 2025-10-31

---

## 📋 概述

本指南详细说明了数据库表中的标准字段定义、使用场景和最佳实践。

**核心原则**：
- 统一的字段命名规范
- 完整的审计追踪
- 灵活的状态管理
- 清晰的软删除策略

---

## 🏗️ 标准字段定义

### 1. 主键字段

#### 字段定义

```sql
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键'
```

#### 说明

- **类型**: `BIGINT UNSIGNED`（8 字节无符号整数）
- **范围**: 0 ~ 18,446,744,073,709,551,615
- **约束**: NOT NULL, AUTO_INCREMENT
- **用途**: 唯一标识每条记录

#### 使用场景

- 所有表都必须有主键
- 推荐使用自增 ID
- 如果需要分布式 ID，使用雪花算法生成

#### 示例

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键'
);
```

---

### 2. 时间字段

#### 2.1 创建时间 (create_time)

**字段定义**

```sql
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
```

**说明**

- **类型**: `DATETIME`（精确到秒）
- **约束**: NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **用途**: 记录记录创建的时间
- **自动设置**: 插入时自动设置为当前时间

**使用场景**

- 所有表都必须有此字段
- 用于追踪记录的创建时间
- 用于排序和筛选

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

-- 插入时自动设置为当前时间
INSERT INTO orders (order_no) VALUES ('ORD-001');
-- create_time 自动设置为 2025-10-31 12:34:56
```

#### 2.2 更新时间 (update_time)

**字段定义**

```sql
update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
```

**说明**

- **类型**: `DATETIME`（精确到秒）
- **约束**: NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP
- **用途**: 记录记录最后一次更新的时间
- **自动更新**: 更新时自动更新为当前时间

**使用场景**

- 所有表都必须有此字段
- 用于追踪记录的修改时间
- 用于乐观锁实现

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 插入时
INSERT INTO orders (order_no) VALUES ('ORD-001');
-- create_time = 2025-10-31 12:34:56
-- update_time = 2025-10-31 12:34:56

-- 更新时
UPDATE orders SET order_no = 'ORD-002' WHERE id = 1;
-- update_time 自动更新为 2025-10-31 12:35:00
```

#### 2.3 删除时间 (delete_time)

**字段定义**

```sql
delete_time DATETIME NULL DEFAULT NULL COMMENT '删除时间'
```

**说明**

- **类型**: `DATETIME`（精确到秒）
- **约束**: NULL, DEFAULT NULL
- **用途**: 记录记录删除的时间（软删除）
- **值**: NULL 表示未删除，非 NULL 表示已删除

**使用场景**

- 需要软删除的表
- 需要记录删除时间的表
- 需要恢复已删除数据的表

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  delete_time DATETIME NULL DEFAULT NULL COMMENT '删除时间'
);

-- 查询未删除的记录
SELECT * FROM orders WHERE delete_time IS NULL;

-- 软删除记录
UPDATE orders SET delete_time = NOW() WHERE id = 1;

-- 恢复已删除的记录
UPDATE orders SET delete_time = NULL WHERE id = 1;
```

---

### 3. 审计字段

#### 3.1 创建人 (create_by)

**字段定义**

```sql
create_by VARCHAR(50) NULL COMMENT '创建人'
```

**说明**

- **类型**: `VARCHAR(50)`
- **约束**: NULL
- **用途**: 记录谁创建了这条记录
- **值**: 用户 ID、用户名或邮箱

**使用场景**

- 需要审计追踪的表
- 需要知道谁创建了记录的表
- 企业级应用

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  create_by VARCHAR(50) NULL COMMENT '创建人'
);

-- 插入时指定创建人
INSERT INTO orders (order_no, create_by) VALUES ('ORD-001', 'user123');

-- 查询某个用户创建的订单
SELECT * FROM orders WHERE create_by = 'user123';
```

#### 3.2 更新人 (update_by)

**字段定义**

```sql
update_by VARCHAR(50) NULL COMMENT '更新人'
```

**说明**

- **类型**: `VARCHAR(50)`
- **约束**: NULL
- **用途**: 记录谁最后一次更新了这条记录
- **值**: 用户 ID、用户名或邮箱

**使用场景**

- 需要审计追踪的表
- 需要知道谁修改了记录的表
- 企业级应用

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  create_by VARCHAR(50) NULL COMMENT '创建人',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  update_by VARCHAR(50) NULL COMMENT '更新人'
);

-- 插入时
INSERT INTO orders (order_no, create_by) VALUES ('ORD-001', 'user123');
-- create_by = 'user123'
-- update_by = NULL

-- 更新时
UPDATE orders SET order_no = 'ORD-002', update_by = 'user456' WHERE id = 1;
-- update_by = 'user456'
```

---

### 4. 状态字段

#### 4.1 启用标记 (enable_flag)

**字段定义**

```sql
enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
```

**说明**

- **类型**: `TINYINT(1)`
- **约束**: NOT NULL, DEFAULT 1
- **值**: 0（禁用）或 1（启用）
- **用途**: 标记记录是否启用

**使用场景**

- 需要启用/禁用功能的表
- 用户、角色、权限等表
- 字典、配置等表

**示例**

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
);

-- 查询启用的用户
SELECT * FROM users WHERE enable_flag = 1;

-- 禁用用户
UPDATE users SET enable_flag = 0 WHERE id = 1;

-- 启用用户
UPDATE users SET enable_flag = 1 WHERE id = 1;
```

#### 4.2 删除标记 (delete_flag)

**字段定义**

```sql
delete_flag TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记: 0-未删除, 1-已删除'
```

**说明**

- **类型**: `TINYINT(1)`
- **约束**: NOT NULL, DEFAULT 0
- **值**: 0（未删除）或 1（已删除）
- **用途**: 标记记录是否已删除（逻辑删除）

**使用场景**

- 需要逻辑删除的表
- 不需要记录删除时间的表
- 简单的软删除场景

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  delete_flag TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记: 0-未删除, 1-已删除'
);

-- 查询未删除的订单
SELECT * FROM orders WHERE delete_flag = 0;

-- 删除订单
UPDATE orders SET delete_flag = 1 WHERE id = 1;

-- 恢复订单
UPDATE orders SET delete_flag = 0 WHERE id = 1;
```

#### 4.3 状态字段 (status)

**字段定义**

```sql
status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-草稿, 2-发布, 3-归档, 4-删除'
```

**说明**

- **类型**: `TINYINT`
- **约束**: NOT NULL, DEFAULT 1
- **值**: 1-9 之间的数字，表示不同的状态
- **用途**: 表示记录的业务状态

**使用场景**

- 需要复杂状态管理的表
- 订单、任务、工作流等表
- 需要多个状态的表

**示例**

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32),
  status TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态: 1-待支付, 2-已支付, 3-已发货, 4-已完成, 5-已取消'
);

-- 查询待支付的订单
SELECT * FROM orders WHERE status = 1;

-- 更新订单状态
UPDATE orders SET status = 2 WHERE id = 1;
```

---

## 📊 字段组合方案

### 方案 1: 简单业务表（如：字典表、配置表）

**适用场景**: 简单的数据表，不需要复杂的审计和状态管理

**字段组合**:

```sql
CREATE TABLE sys_dict (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  dict_code VARCHAR(64) NOT NULL UNIQUE COMMENT '字典编码',
  dict_name VARCHAR(64) NOT NULL COMMENT '字典名称',
  dict_value VARCHAR(255) NOT NULL COMMENT '字典值',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典表';
```

**包含字段**:
- ✅ id（主键）
- ✅ create_time（创建时间）
- ✅ update_time（更新时间）
- ✅ enable_flag（启用标记）
- ❌ create_by, update_by（不需要）
- ❌ delete_flag, delete_time（不需要）

---

### 方案 2: 需要审计的业务表（如：用户表、订单表）

**适用场景**: 需要完整审计追踪的表

**字段组合**:

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态: 1-待支付, 2-已支付, 3-已发货, 4-已完成, 5-已取消',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) NULL COMMENT '创建人',
  update_by VARCHAR(50) NULL COMMENT '更新人',
  enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  delete_flag TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记: 0-未删除, 1-已删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

**包含字段**:
- ✅ id（主键）
- ✅ create_time（创建时间）
- ✅ update_time（更新时间）
- ✅ create_by（创建人）
- ✅ update_by（更新人）
- ✅ enable_flag（启用标记）
- ✅ delete_flag（删除标记）
- ❌ delete_time（不需要，使用 delete_flag）

---

### 方案 3: 需要记录删除时间的表（如：日志表、审计表）

**适用场景**: 需要记录删除时间的表

**字段组合**:

```sql
CREATE TABLE audit_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  operation VARCHAR(50) NOT NULL COMMENT '操作类型',
  content TEXT NULL COMMENT '操作内容',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  delete_time DATETIME NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志表';
```

**包含字段**:
- ✅ id（主键）
- ✅ create_time（创建时间）
- ✅ update_time（更新时间）
- ✅ delete_time（删除时间）
- ❌ create_by, update_by（不需要）
- ❌ enable_flag, delete_flag（不需要）

---

### 方案 4: 复杂状态管理表（如：工作流表）

**适用场景**: 需要复杂状态管理的表

**字段组合**:

```sql
CREATE TABLE workflow_task (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  task_name VARCHAR(100) NOT NULL COMMENT '任务名称',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '任务状态: 1-待处理, 2-处理中, 3-已完成, 4-已取消',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) NULL COMMENT '创建人',
  update_by VARCHAR(50) NULL COMMENT '更新人',
  enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工作流任务表';
```

**包含字段**:
- ✅ id（主键）
- ✅ create_time（创建时间）
- ✅ update_time（更新时间）
- ✅ create_by（创建人）
- ✅ update_by（更新人）
- ✅ status（状态）
- ✅ enable_flag（启用标记）
- ❌ delete_flag, delete_time（不需要）

---

## 🔍 查询示例

### 查询未删除的记录

```sql
-- 使用 delete_flag
SELECT * FROM orders WHERE delete_flag = 0;

-- 使用 delete_time
SELECT * FROM audit_log WHERE delete_time IS NULL;
```

### 查询启用的记录

```sql
SELECT * FROM users WHERE enable_flag = 1;
```

### 查询某个用户创建的记录

```sql
SELECT * FROM orders WHERE create_by = 'user123';
```

### 查询最近修改的记录

```sql
SELECT * FROM orders ORDER BY update_time DESC LIMIT 10;
```

### 查询某个时间段内创建的记录

```sql
SELECT * FROM orders 
WHERE create_time >= '2025-01-01' AND create_time < '2025-02-01';
```

---

## 📈 索引设计

### 必须建索引的字段

```sql
-- 时间字段
KEY `idx_create_time` (`create_time`)
KEY `idx_update_time` (`update_time`)
KEY `idx_delete_time` (`delete_time`)

-- 状态字段
KEY `idx_enable_flag` (`enable_flag`)
KEY `idx_delete_flag` (`delete_flag`)
KEY `idx_status` (`status`)

-- 审计字段
KEY `idx_create_by` (`create_by`)
KEY `idx_update_by` (`update_by`)
```

### 联合索引示例

```sql
-- 查询启用的记录，按创建时间排序
KEY `idx_enable_create` (`enable_flag`, `create_time`)

-- 查询未删除的记录，按更新时间排序
KEY `idx_delete_update` (`delete_flag`, `update_time`)

-- 查询某个用户创建的记录，按创建时间排序
KEY `idx_create_by_time` (`create_by`, `create_time`)
```

---

## ⚠️ 常见错误

### ❌ 错误 1: 混用不同的时间字段命名

**错误示例**:
```sql
-- 不要混用
CREATE TABLE orders (
  created_at DATETIME,  -- 错误：应该用 create_time
  updated_at DATETIME,  -- 错误：应该用 update_time
  deleted_at DATETIME   -- 错误：应该用 delete_time
);
```

**正确做法**:
```sql
CREATE TABLE orders (
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  delete_time DATETIME NULL DEFAULT NULL
);
```

### ❌ 错误 2: 同时使用 delete_flag 和 delete_time

**错误示例**:
```sql
-- 不要同时使用
CREATE TABLE orders (
  delete_flag TINYINT(1),
  delete_time DATETIME
);
```

**正确做法**:
- 简单场景：只使用 `delete_flag`
- 复杂场景：只使用 `delete_time`

### ❌ 错误 3: 忘记添加索引

**错误示例**:
```sql
-- 没有索引，查询会很慢
CREATE TABLE orders (
  enable_flag TINYINT(1),
  delete_flag TINYINT(1),
  create_time DATETIME
);
```

**正确做法**:
```sql
CREATE TABLE orders (
  enable_flag TINYINT(1),
  delete_flag TINYINT(1),
  create_time DATETIME,
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_flag` (`delete_flag`),
  KEY `idx_create_time` (`create_time`)
);
```

### ❌ 错误 4: 使用 NULL 作为默认值

**错误示例**:
```sql
-- 不要使用 NULL 作为默认值
CREATE TABLE users (
  enable_flag TINYINT(1) DEFAULT NULL  -- 错误
);
```

**正确做法**:
```sql
CREATE TABLE users (
  enable_flag TINYINT(1) NOT NULL DEFAULT 1  -- 正确
);
```

---

## ✅ 检查清单

在设计表结构时，使用此清单确保字段规范：

- [ ] 所有表都有 `id` 主键
- [ ] 所有表都有 `create_time` 和 `update_time`
- [ ] 需要审计的表都有 `create_by` 和 `update_by`
- [ ] 需要启用/禁用的表都有 `enable_flag`
- [ ] 需要删除的表都有 `delete_flag` 或 `delete_time`（二选一）
- [ ] 所有时间字段都有正确的默认值和自动更新
- [ ] 所有状态字段都有正确的默认值
- [ ] 所有字段都有注释
- [ ] 所有必要的字段都有索引

---

## 📚 参考资源

- [数据库设计规范](./database.md)
- [数据库设计 Skill](../../skills/design/design-database/SKILL.md)
- [数据库设计 Command](../../commands/design/gen-db-design.md)
- [数据库设计模板](../../templates/design/database-design-template.md)

---

**文档版本**: v1.0  
**最后更新**: 2025-10-31  
**维护者**: 架构团队
