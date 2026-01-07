# MySQL 从需求生成 DDL - 示例

## 示例1: 用户管理需求

### 输入: 需求描述

```
用户管理功能需求：
1. 用户有用户名、密码、邮箱、手机号、昵称、头像等基本信息
2. 用户名唯一，不可重复
3. 用户有启用/禁用状态
4. 需要记录用户的创建时间和更新时间
5. 支持软删除
6. 常用查询：按用户名查询、按邮箱查询、按手机号查询
```

### 输出: DDL

```sql
-- 用户表
CREATE TABLE `t_user` (
  `id` bigint NOT NULL COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码（加密存储）',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-否，1-是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

---

## 示例2: 订单管理需求

### 输入: 需求描述

```
订单管理功能需求：
1. 订单关联用户和商品
2. 订单有订单编号（唯一）、数量、总金额
3. 订单状态：待支付、已支付、已发货、已完成、已取消
4. 记录支付时间、发货时间、完成时间
5. 常用查询：按用户查询订单、按状态查询订单、按订单编号查询
```

### 输出: DDL

```sql
-- 订单表
CREATE TABLE `t_order` (
  `id` bigint NOT NULL COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `product_id` bigint NOT NULL COMMENT '商品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `total_amount` decimal(10,2) NOT NULL COMMENT '总金额',
  `status` varchar(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING-待支付，PAID-已支付，SHIPPED-已发货，COMPLETED-已完成，CANCELLED-已取消',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `ship_time` datetime DEFAULT NULL COMMENT '发货时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';
```

---

## 示例3: 多对多关系（用户角色）

### 输入: 需求描述

```
用户角色管理：
1. 用户可以有多个角色
2. 角色可以分配给多个用户
3. 角色有角色名、角色编码、描述
4. 角色编码唯一
```

### 输出: DDL

```sql
-- 角色表
CREATE TABLE `t_role` (
  `id` bigint NOT NULL COMMENT '角色ID',
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `code` varchar(50) NOT NULL COMMENT '角色编码',
  `description` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 用户角色关联表
CREATE TABLE `t_user_role` (
  `id` bigint NOT NULL COMMENT 'ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';
```

---

## 示例4: 树形结构（部门）

### 输入: 需求描述

```
部门管理：
1. 部门有名称、编码、排序号
2. 部门有层级关系，支持无限层级
3. 部门编码唯一
4. 常用查询：按父部门查询子部门
```

### 输出: DDL

```sql
-- 部门表
CREATE TABLE `t_department` (
  `id` bigint NOT NULL COMMENT '部门ID',
  `name` varchar(50) NOT NULL COMMENT '部门名称',
  `code` varchar(50) NOT NULL COMMENT '部门编码',
  `parent_id` bigint DEFAULT '0' COMMENT '父部门ID，0表示顶级部门',
  `path` varchar(500) DEFAULT NULL COMMENT '部门路径，如：/1/2/3/',
  `level` int NOT NULL DEFAULT '1' COMMENT '层级',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-否，1-是',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';
```

---

## 需求关键词映射

| 需求关键词 | DDL 设计 |
|-----------|---------|
| 唯一/不可重复 | `UNIQUE KEY` |
| 启用/禁用状态 | `status TINYINT DEFAULT 1` |
| 软删除 | `deleted TINYINT DEFAULT 0` |
| 按xxx查询 | 对应字段加索引 |
| 关联/关系 | 外键字段 + 索引 |
| 多对多 | 中间关联表 |
| 层级/树形 | `parent_id` + `path` |
| 金额 | `DECIMAL(10,2)` |
| 时间记录 | `create_time` + `update_time` |
