# 数据库结构

> **数据库**: {{DATABASE_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 表清单

| 表名 | 说明 | 记录数 |
|------|------|--------|
| t_user | 用户表 | - |
| t_order | 订单表 | - |
| t_order_item | 订单明细表 | - |

---

## 表结构

### t_user - 用户表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 用户名 |
| password | VARCHAR(100) | NOT NULL | 密码 |
| email | VARCHAR(100) | | 邮箱 |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- `idx_username` (username) - 用户名索引
- `idx_status` (status) - 状态索引

### t_order - 订单表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 主键 |
| order_no | VARCHAR(32) | NOT NULL, UNIQUE | 订单号 |
| user_id | BIGINT | NOT NULL | 用户ID |
| total_amount | DECIMAL(10,2) | NOT NULL | 总金额 |
| status | VARCHAR(20) | NOT NULL | 状态 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**索引**:
- `idx_order_no` (order_no) - 订单号索引
- `idx_user_id` (user_id) - 用户ID索引
