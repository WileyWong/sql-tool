# 数据库设计 - 使用示例

本文档提供 `design-db` skill 的实际使用示例，涵盖不同业务场景的数据库表结构设计。

---

## 示例 1: 电商订单系统

### 用户输入
```
为电商系统设计数据库：
- 用户、商品、订单、订单明细
- 用户可以下单购买多个商品
- 订单需要记录历史价格（商品价格可能变动）
- 需要查询：用户订单列表、订单详情、某时间段内的订单统计
```

### AI 执行流程

**步骤 1: 实体分析**
```markdown
## 业务实体分析

### 实体列表
1. **用户（User）**: 用户ID、用户名、邮箱、手机号、状态
2. **商品（Product）**: 商品ID、商品名称、价格、库存、分类
3. **订单（Order）**: 订单ID、订单号、用户ID、总金额、状态
4. **订单明细（OrderItem）**: 明细ID、订单ID、商品ID、商品名称、单价、数量、小计

### 实体关系
- User 1:N Order（一个用户多个订单）
- Order 1:N OrderItem（一个订单多个明细）
- Product M:N Order（通过 OrderItem 多对多）

### 关键设计决策
- 订单明细冗余商品名称和价格：保留下单时的快照，避免价格变动影响历史订单
- 订单号使用唯一索引：支持快速查询
```

**步骤 2: 表结构设计**

```sql
-- 用户表
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt）',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status_delete` (`status`, `delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 商品表
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `price` DECIMAL(10,2) NOT NULL COMMENT '当前价格',
  `stock` INT NOT NULL DEFAULT 0 COMMENT '库存数量',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-上架，2-下架',
  `description` TEXT COMMENT '商品描述',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_status` (`category_id`, `status`),
  KEY `idx_name` (`product_name`(50)),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 订单表
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消',
  `payment_time` DATETIME NULL COMMENT '支付时间',
  `delivery_time` DATETIME NULL COMMENT '发货时间',
  `completion_time` DATETIME NULL COMMENT '完成时间',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_status_time` (`user_id`, `status`, `create_time`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单明细表
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称（冗余，保留下单时快照）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价（冗余，记录下单时价格）',
  `quantity` INT NOT NULL COMMENT '数量',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计（price * quantity）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';
```

**步骤 3: 索引设计说明**

```markdown
## 索引策略

### users 表
- `uk_username`: 唯一索引，登录查询（WHERE username = ?）
- `uk_email`: 唯一索引，邮箱登录/注册检查
- `uk_phone`: 唯一索引，手机号登录/注册检查
- `idx_status_delete`: 联合索引，查询有效用户列表

### products 表
- `idx_category_status`: 联合索引，商品列表查询（WHERE category_id = ? AND status = 1）
- `idx_name`: 前缀索引（50字符），商品名称搜索
- `idx_delete_time`: 软删除查询

### orders 表
- `uk_order_no`: 唯一索引，订单号查询（WHERE order_no = ?）
- `idx_user_status_time`: 联合索引，用户订单列表（WHERE user_id = ? AND status = ? ORDER BY create_time DESC）
  - user_id: 等值查询（最左）
  - status: 等值查询（中间）
  - create_time: 排序字段（最右）
- `idx_create_time`: 单列索引，时间段统计（WHERE create_time BETWEEN ? AND ?）

### order_items 表
- `idx_order_id`: 外键索引，订单详情查询（WHERE order_id = ?）
- `idx_product_id`: 外键索引，商品销售统计
```

**步骤 4: 索引验证**

```sql
-- 验证用户订单列表查询
EXPLAIN SELECT * FROM orders 
WHERE user_id = 12345 AND status = 2 
ORDER BY create_time DESC 
LIMIT 10;
-- 期望结果: type=ref, key=idx_user_status_time, 无 Using filesort

-- 验证订单详情查询
EXPLAIN SELECT * FROM order_items WHERE order_id = 67890;
-- 期望结果: type=ref, key=idx_order_id

-- 验证时间段统计
EXPLAIN SELECT COUNT(*), SUM(total_amount) 
FROM orders 
WHERE create_time BETWEEN '2025-01-01' AND '2025-01-31';
-- 期望结果: type=range, key=idx_create_time
```

---

## 示例 2: 博客系统

### 用户输入
```
为博客系统设计数据库：
- 用户、文章、分类、标签、评论
- 文章支持多标签
- 评论支持多级回复
- 需要查询：文章列表、文章详情、评论树、标签文章
```

### AI 执行流程

**步骤 1: 实体分析**
```markdown
## 业务实体分析

### 实体列表
1. **用户（User）**: 用户ID、用户名、邮箱、头像
2. **文章（Article）**: 文章ID、标题、内容、作者ID、分类ID、状态
3. **分类（Category）**: 分类ID、分类名称
4. **标签（Tag）**: 标签ID、标签名称
5. **文章标签关联（ArticleTag）**: 文章ID、标签ID
6. **评论（Comment）**: 评论ID、文章ID、用户ID、内容、父评论ID

### 实体关系
- User 1:N Article
- Category 1:N Article
- Article M:N Tag（通过 ArticleTag）
- Article 1:N Comment
- Comment 1:N Comment（自关联，多级回复）

### 关键设计决策
- 文章和标签多对多：使用关联表 article_tags
- 评论树形结构：parent_id 自关联，支持无限层级
```

**步骤 2: 表结构设计**

```sql
-- 用户表
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) NULL COMMENT '头像URL',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 分类表
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `category_name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(255) NULL COMMENT '分类描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 文章表
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `summary` VARCHAR(500) NULL COMMENT '摘要',
  `author_id` BIGINT UNSIGNED NOT NULL COMMENT '作者ID',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `comment_count` INT NOT NULL DEFAULT 0 COMMENT '评论数',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-草稿，2-已发布，3-已下架',
  `publish_time` DATETIME NULL COMMENT '发布时间',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `idx_author_status_time` (`author_id`, `status`, `publish_time`),
  KEY `idx_category_status_time` (`category_id`, `status`, `publish_time`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 标签表
CREATE TABLE `tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `tag_name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '文章数（冗余，提升性能）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`tag_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 文章标签关联表
CREATE TABLE `article_tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `tag_id` BIGINT UNSIGNED NOT NULL COMMENT '标签ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表';

-- 评论表
CREATE TABLE `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `parent_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '父评论ID（NULL表示顶级评论）',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-已删除',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_status_time` (`article_id`, `status`, `create_time`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
```

**步骤 3: 索引设计说明**

```markdown
## 索引策略

### articles 表
- `idx_author_status_time`: 作者文章列表（WHERE author_id = ? AND status = 2 ORDER BY publish_time DESC）
- `idx_category_status_time`: 分类文章列表（WHERE category_id = ? AND status = 2 ORDER BY publish_time DESC）
- `idx_publish_time`: 最新文章列表（WHERE status = 2 ORDER BY publish_time DESC）

### article_tags 表
- `uk_article_tag`: 唯一索引，防止重复关联
- `idx_tag_id`: 标签文章查询（WHERE tag_id = ?）

### comments 表
- `idx_article_status_time`: 文章评论列表（WHERE article_id = ? AND status = 1 ORDER BY create_time）
- `idx_parent_id`: 子评论查询（WHERE parent_id = ?）
```

**步骤 4: 多对多关系处理**

```markdown
## 文章标签多对多关系

### 添加标签
```sql
-- 文章添加标签
INSERT INTO article_tags (article_id, tag_id) VALUES (123, 5);
-- 更新标签文章数
UPDATE tags SET article_count = article_count + 1 WHERE id = 5;
```

### 查询文章的所有标签
```sql
SELECT t.* FROM tags t
INNER JOIN article_tags at ON t.id = at.tag_id
WHERE at.article_id = 123;
```

### 查询标签下的所有文章
```sql
SELECT a.* FROM articles a
INNER JOIN article_tags at ON a.id = at.article_id
WHERE at.tag_id = 5 AND a.status = 2
ORDER BY a.publish_time DESC;
```

---

## 示例 3: 考勤系统

### 用户输入
```
为企业考勤系统设计数据库：
- 员工、部门、打卡记录、请假记录
- 打卡记录按日期分表（数据量大）
- 需要统计：月度考勤、迟到次数、请假天数
```

### AI 执行流程

**步骤 1: 实体分析**
```markdown
## 业务实体分析

### 实体列表
1. **部门（Department）**: 部门ID、部门名称、上级部门ID
2. **员工（Employee）**: 员工ID、姓名、工号、部门ID、入职日期
3. **打卡记录（Attendance）**: 记录ID、员工ID、打卡时间、打卡类型
4. **请假记录（Leave）**: 请假ID、员工ID、请假类型、开始时间、结束时间、天数

### 关键设计决策
- 部门树形结构：parent_id 自关联
- 打卡记录分表：按月分表（attendance_202501、attendance_202502）
- 冗余员工姓名：打卡记录中冗余姓名，避免JOIN查询
```

**步骤 2: 表结构设计**

```sql
-- 部门表
CREATE TABLE `departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `dept_name` VARCHAR(100) NOT NULL COMMENT '部门名称',
  `parent_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '上级部门ID（NULL表示顶级部门）',
  `manager_id` BIGINT UNSIGNED NULL COMMENT '部门经理ID',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 员工表
CREATE TABLE `employees` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `employee_no` VARCHAR(20) NOT NULL COMMENT '工号',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `dept_id` BIGINT UNSIGNED NOT NULL COMMENT '部门ID',
  `position` VARCHAR(50) NULL COMMENT '职位',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `email` VARCHAR(100) NULL COMMENT '邮箱',
  `hire_date` DATE NOT NULL COMMENT '入职日期',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-在职，2-离职',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_no` (`employee_no`),
  KEY `idx_dept_status` (`dept_id`, `status`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工表';

-- 打卡记录表（按月分表）
CREATE TABLE `attendances_202501` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `employee_name` VARCHAR(50) NOT NULL COMMENT '员工姓名（冗余）',
  `dept_id` BIGINT UNSIGNED NOT NULL COMMENT '部门ID（冗余）',
  `check_time` DATETIME NOT NULL COMMENT '打卡时间',
  `check_type` TINYINT NOT NULL COMMENT '类型：1-上班，2-下班',
  `location` VARCHAR(100) NULL COMMENT '打卡地点',
  `device_id` VARCHAR(50) NULL COMMENT '设备ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_time` (`employee_id`, `check_time`),
  KEY `idx_dept_time` (`dept_id`, `check_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='打卡记录表-2025年01月';

-- 请假记录表
CREATE TABLE `leaves` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '请假ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `leave_type` TINYINT NOT NULL COMMENT '类型：1-病假，2-事假，3-年假',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `days` DECIMAL(4,1) NOT NULL COMMENT '请假天数',
  `reason` TEXT NULL COMMENT '请假原因',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-待审批，2-已批准，3-已拒绝',
  `approver_id` BIGINT UNSIGNED NULL COMMENT '审批人ID',
  `approve_time` DATETIME NULL COMMENT '审批时间',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_date` (`employee_id`, `start_date`, `end_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='请假记录表';

-- 月度考勤汇总表（冗余表，提升查询性能）
CREATE TABLE `attendance_monthly_summary` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '汇总ID',
  `employee_id` BIGINT UNSIGNED NOT NULL COMMENT '员工ID',
  `year_month` INT NOT NULL COMMENT '年月（格式：202501）',
  `work_days` INT NOT NULL DEFAULT 0 COMMENT '应出勤天数',
  `actual_days` INT NOT NULL DEFAULT 0 COMMENT '实际出勤天数',
  `late_count` INT NOT NULL DEFAULT 0 COMMENT '迟到次数',
  `early_leave_count` INT NOT NULL DEFAULT 0 COMMENT '早退次数',
  `absence_days` DECIMAL(4,1) NOT NULL DEFAULT 0 COMMENT '缺勤天数',
  `leave_days` DECIMAL(4,1) NOT NULL DEFAULT 0 COMMENT '请假天数',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_month` (`employee_id`, `year_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='月度考勤汇总表';
```

**步骤 3: 分表策略**

```markdown
## 分表设计

### 为什么分表？
- 打卡记录数据量大：500 员工 × 2 次/天 × 365 天 = 36.5 万条/年
- 3 年数据超过 100 万条，查询性能下降
- 按月分表，单表数据量控制在 3-5 万条

### 分表规则
```sql
-- 表名格式：attendances_YYYYMM
attendances_202501  -- 2025年1月
attendances_202502  -- 2025年2月
...
```

### 查询策略
```sql
-- 单月查询
SELECT * FROM attendances_202501 
WHERE employee_id = 123;

-- 跨月查询（应用层合并）
SELECT * FROM attendances_202501 WHERE employee_id = 123
UNION ALL
SELECT * FROM attendances_202502 WHERE employee_id = 123;
```

### 定时任务
- 每月1号自动创建下月分表
- 每月2号自动汇总上月考勤数据到 attendance_monthly_summary
```

---

## 示例 4: 权限管理系统（RBAC）

### 用户输入
```
为后台管理系统设计权限管理：
- 用户、角色、权限、菜单
- 基于 RBAC 模型
- 用户可以有多个角色，角色可以有多个权限
```

### AI 执行流程

**步骤 1: 实体分析**
```markdown
## 业务实体分析（RBAC 模型）

### 实体列表
1. **用户（User）**: 用户ID、用户名、邮箱
2. **角色（Role）**: 角色ID、角色名称、角色描述
3. **权限（Permission）**: 权限ID、权限名称、权限标识、资源类型
4. **菜单（Menu）**: 菜单ID、菜单名称、父菜单ID、路由
5. **用户角色关联（UserRole）**: 用户ID、角色ID
6. **角色权限关联（RolePermission）**: 角色ID、权限ID
7. **角色菜单关联（RoleMenu）**: 角色ID、菜单ID

### 实体关系
- User M:N Role（通过 UserRole）
- Role M:N Permission（通过 RolePermission）
- Role M:N Menu（通过 RoleMenu）
```

**步骤 2: 表结构设计**

```sql
-- 用户表
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色标识（如：ADMIN、USER）',
  `description` VARCHAR(255) NULL COMMENT '角色描述',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-启用，2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 权限表
CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `permission_name` VARCHAR(100) NOT NULL COMMENT '权限名称',
  `permission_code` VARCHAR(100) NOT NULL COMMENT '权限标识（如：user:create）',
  `resource_type` VARCHAR(20) NOT NULL COMMENT '资源类型：menu、button、api',
  `description` VARCHAR(255) NULL COMMENT '权限描述',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`permission_code`),
  KEY `idx_resource_type` (`resource_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 菜单表
CREATE TABLE `menus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `parent_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '父菜单ID',
  `route` VARCHAR(100) NULL COMMENT '路由地址',
  `icon` VARCHAR(50) NULL COMMENT '图标',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-显示，2-隐藏',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 用户角色关联表
CREATE TABLE `user_roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色权限关联表
CREATE TABLE `role_permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 角色菜单关联表
CREATE TABLE `role_menus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `menu_id` BIGINT UNSIGNED NOT NULL COMMENT '菜单ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
  KEY `idx_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';
```

**步骤 3: 权限查询示例**

```markdown
## 权限查询 SQL

### 查询用户的所有角色
```sql
SELECT r.* FROM roles r
INNER JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = 123;
```

### 查询用户的所有权限
```sql
SELECT DISTINCT p.* FROM permissions p
INNER JOIN role_permissions rp ON p.id = rp.permission_id
INNER JOIN user_roles ur ON rp.role_id = ur.role_id
WHERE ur.user_id = 123;
```

### 查询用户的可见菜单
```sql
SELECT DISTINCT m.* FROM menus m
INNER JOIN role_menus rm ON m.id = rm.menu_id
INNER JOIN user_roles ur ON rm.role_id = ur.role_id
WHERE ur.user_id = 123 AND m.status = 1
ORDER BY m.sort_order;
```

---

## 总结

以上示例涵盖了常见的数据库设计场景：

1. **电商订单系统** - 多表关联、冗余设计、索引优化
2. **博客系统** - 多对多关系、自关联、关联表设计
3. **考勤系统** - 分表策略、汇总表、树形结构
4. **权限管理系统** - RBAC 模型、多对多关系、权限查询

每个示例都遵循了 `design-db` skill 的核心原则：
- 业务驱动设计
- 适当冗余提升性能
- 索引设计遵循最左前缀原则
- 使用 DECIMAL 存储金额
- 软删除而非物理删除
- 所有表包含必备字段（id、create_time、update_time、delete_time）
