# 数据库设计规范

**适用范围**: 所有基于 Spring Boot 3.x 的招聘相关微服务  
**文档版本**: 1.0  
**最后更新**: 2025-01-15

---

## 📋 概述

本规范定义了数据库设计的标准，包括表设计、字段规范、索引设计、软删除处理等，确保所有项目的数据库设计保持一致性和高质量。

**核心原则**：
- 业务驱动设计，性能优于范式
- 规范化与反规范化的平衡
- 演进优于完美

---

## 🏗️ 表设计规范

### 1. 命名规范

#### 表名规范
- **格式**: 小写字母 + 下划线，复数形式
- **示例**: `users`, `orders`, `order_items`, `user_addresses`
- **规则**:
  - 不使用大写字母
  - 不使用驼峰命名
  - 使用复数形式表示集合
  - 避免使用 SQL 关键字

#### 字段名规范
- **格式**: 小写字母 + 下划线
- **示例**: `user_id`, `created_at`, `is_active`, `order_status`
- **规则**:
  - 不使用大写字母
  - 不使用驼峰命名
  - 布尔字段使用 `is_` 前缀
  - 时间字段使用 `_at` 后缀

#### 主键和关联字段规范
- **主键**: 统一使用 `id`
- **关联字段**: `关联表_id`（如：`user_id`, `order_id`）
- **说明**: 不使用显式外键约束，由应用层保证数据一致性
- **示例**:
  ```sql
  CREATE TABLE orders (
    id BIGINT UNSIGNED PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID（关联 users 表）'
  );
  ```

### 2. 字段类型选择

#### 整数类型
| 类型 | 字节 | 范围 | 使用场景 |
|------|------|------|---------|
| TINYINT | 1 | -128 ~ 127 | 状态码、布尔值 |
| SMALLINT | 2 | -32768 ~ 32767 | 小范围整数 |
| INT | 4 | -2^31 ~ 2^31-1 | 普通整数 |
| BIGINT | 8 | -2^63 ~ 2^63-1 | ID、大数值 |

**推荐**:
- ID 字段：`BIGINT UNSIGNED AUTO_INCREMENT`
- 状态码：`TINYINT`（0-255）
- 数量：`INT` 或 `BIGINT`（根据数据量）

#### 字符串类型
| 类型 | 特点 | 使用场景 |
|------|------|---------|
| CHAR(N) | 定长，补空格 | 固定长度字段（如：国家代码） |
| VARCHAR(N) | 变长，节省空间 | 大多数字符串字段 |
| TEXT | 大文本 | 长文本内容（如：描述、备注） |
| LONGTEXT | 超大文本 | 非常长的文本（如：日志、富文本） |

**推荐**:
- 用户名、邮箱：`VARCHAR(255)`
- 手机号：`VARCHAR(20)`
- 描述、备注：`TEXT`
- 密码哈希：`VARCHAR(255)`

#### 日期时间类型
| 类型 | 精度 | 范围 | 使用场景 |
|------|------|------|---------|
| DATE | 天 | 1000-01-01 ~ 9999-12-31 | 日期字段 |
| TIME | 秒 | -838:59:59 ~ 838:59:59 | 时间字段 |
| DATETIME | 秒 | 1000-01-01 00:00:00 ~ 9999-12-31 23:59:59 | 日期时间 |
| TIMESTAMP | 秒 | 1970-01-01 00:00:01 ~ 2038-01-19 03:14:07 | 时间戳 |

**推荐**:
- 创建时间、更新时间、删除时间：`DATETIME`
- 使用 `DEFAULT CURRENT_TIMESTAMP` 自动设置当前时间
- 使用 `ON UPDATE CURRENT_TIMESTAMP` 自动更新时间

#### 金额类型
- **类型**: `DECIMAL(M, D)`
- **示例**: `DECIMAL(10, 2)`（10 位数字，2 位小数）
- **说明**: 不使用 FLOAT 或 DOUBLE，避免精度问题

#### 布尔类型
- **类型**: `TINYINT(1)`
- **值**: 0（false）或 1（true）
- **示例**: `is_active TINYINT(1) NOT NULL DEFAULT 1`

#### 枚举类型
- **方案 1**: 使用 `TINYINT` 存储数字
  ```sql
  -- 0: 待审核, 1: 已通过, 2: 已拒绝
  status TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-待审核, 1-已通过, 2-已拒绝'
  ```
- **方案 2**: 使用 `VARCHAR` 存储字符串
  ```sql
  -- 'pending', 'approved', 'rejected'
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态'
  ```

**推荐**: 使用 TINYINT 存储，在代码中定义枚举类

### 3. 必备字段

所有表都应包含以下字段（根据业务需要选择）：

#### 基础字段（必须）

```sql
-- 主键
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键'

-- 时间字段（必须）
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'

-- 创建人/更新人（可选，根据业务需要）
create_by VARCHAR(50) NULL COMMENT '创建人'
update_by VARCHAR(50) NULL COMMENT '更新人'
```

#### 状态字段（根据业务需要选择）

**情况 1: 只有启用/禁用**
```sql
enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
```

**情况 2: 有启用/禁用和删除**
```sql
enable_flag TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用'
delete_flag TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记: 0-未删除, 1-已删除'
```

**情况 3: 使用软删除（推荐）**
```sql
delete_time DATETIME NULL DEFAULT NULL COMMENT '删除时间'
```

**情况 4: 复杂状态管理**
```sql
status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-草稿, 2-发布, 3-归档, 4-删除'
```

#### 完整示例

```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  
  -- 业务字段
  `username` VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名',
  `email` VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱',
  
  -- 时间字段
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 审计字段（可选）
  `create_by` VARCHAR(50) NULL COMMENT '创建人',
  `update_by` VARCHAR(50) NULL COMMENT '更新人',
  
  -- 状态字段（可选）
  `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标记: 0-禁用, 1-启用',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_enable_flag` (`enable_flag`),
  KEY `idx_delete_time` (`delete_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

#### 字段说明

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | 主键，自增 |
| create_time | DATETIME | NOT NULL | 创建时间，自动设置为当前时间 |
| update_time | DATETIME | NOT NULL | 更新时间，自动更新为当前时间 |
| create_by | VARCHAR(50) | NULL | 创建人，用于审计追踪 |
| update_by | VARCHAR(50) | NULL | 更新人，用于审计追踪 |
| enable_flag | TINYINT(1) | NOT NULL | 启用标记，0-禁用，1-启用 |
| delete_time | DATETIME | NULL | 删除时间，用于软删除，NULL 表示未删除 |
| delete_flag | TINYINT(1) | NOT NULL | 删除标记，0-未删除，1-已删除（与 delete_time 二选一） |

### 4. 字段约束

#### NOT NULL 约束
- **原则**: 尽量使用 NOT NULL，避免 NULL 值
- **原因**: NULL 值会增加查询复杂度，影响索引效率
- **例外**: 可选字段（如：备注、描述）可以为 NULL

#### DEFAULT 约束
- **原则**: 为大多数字段设置默认值
- **示例**:
  ```sql
  is_active TINYINT(1) NOT NULL DEFAULT 1
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  status TINYINT NOT NULL DEFAULT 0
  ```

#### UNIQUE 约束
- **原则**: 为唯一字段添加唯一约束
- **示例**:
  ```sql
  username VARCHAR(255) NOT NULL UNIQUE
  email VARCHAR(255) NOT NULL UNIQUE
  ```

#### CHECK 约束
- **原则**: 为有范围限制的字段添加检查约束
- **示例**:
  ```sql
  age INT CHECK (age >= 0 AND age <= 150)
  salary DECIMAL(10, 2) CHECK (salary >= 0)
  ```

### 5. 字段注释

**原则**: 每个字段都必须有注释

**格式**:
```sql
`field_name` TYPE [CONSTRAINT] COMMENT '字段说明'
```

**示例**:
```sql
`user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID，关联 users 表'
`status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-待审核, 1-已通过, 2-已拒绝'
`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
```

---

## 🔑 索引设计规范

### 1. 索引类型

| 类型 | 说明 | 使用场景 |
|------|------|---------|
| PRIMARY KEY | 主键索引 | 唯一标识 |
| UNIQUE | 唯一索引 | 唯一字段（如：邮箱、用户名） |
| INDEX | 普通索引 | 频繁查询的字段 |
| FULLTEXT | 全文索引 | 全文搜索 |

### 2. 索引设计原则（重点）

**核心原则**：索引是数据库性能的关键，必须精心设计

#### 原则 1: 最左前缀原则（必须遵守）
- 复合索引遵循最左前缀原则
- 查询条件应该从左到右匹配索引列
- **示例**:
  ```sql\n  -- 创建复合索引\n  KEY `idx_user_status_create_time` (`user_id`, `status`, `create_time`)\n  \n  -- 以下查询都能使用该索引\n  WHERE user_id = 1\n  WHERE user_id = 1 AND status = 1\n  WHERE user_id = 1 AND status = 1 AND create_time > '2025-01-01'\n  \n  -- 以下查询不能使用该索引\n  WHERE status = 1  -- 跳过了 user_id\n  WHERE create_time > '2025-01-01'  -- 跳过了 user_id 和 status\n  ```

#### 原则 2: 高选择性优先（必须遵守）
- 选择性 = 不重复值数 / 总行数\n- 选择性越高，索引效率越好\n- **示例**:
  ```sql\n  -- 好的索引（选择性高）\n  KEY `idx_email` (`email`)  -- 邮箱通常是唯一的\n  \n  -- 不好的索引（选择性低）\n  KEY `idx_gender` (`gender`)  -- 性别只有两个值，不建议建索引\n  ```

#### 原则 3: 避免冗余索引（必须遵守）
- 不创建重复的索引\n- 不创建包含关系的索引\n- **示例**:
  ```sql\n  -- 不要同时创建这两个索引\n  KEY `idx_user_id` (`user_id`)\n  KEY `idx_user_id_status` (`user_id`, `status`)  -- 冗余，第一个索引已包含\n  ```

#### 原则 4: 避免过多索引（必须遵守）
- 索引过多会影响写入性能\n- 每个表的索引数量不超过 5-8 个\n- 定期清理无用索引\n- **建议**：先建立必要的索引，后续根据查询性能再优化

#### 原则 5: 索引字段选择（重点）
- **WHERE 条件字段**：经常出现在 WHERE 子句的字段\n- **ORDER BY 字段**：经常排序的字段\n- **JOIN 字段**：关联字段（如：user_id）\n- **GROUP BY 字段**：分组字段\n- **避免**：低选择性字段（如：性别、状态值少的字段）

#### 原则 6: 联合索引顺序（重点）
- **等值查询字段在前**：WHERE user_id = ? AND status = ?\n- **范围查询字段在后**：WHERE user_id = ? AND create_time > ?\n- **排序字段在最后**：WHERE user_id = ? ORDER BY create_time DESC\n- **示例**:
  ```sql\n  -- 查询：WHERE user_id = ? AND status = ? ORDER BY create_time DESC\n  -- 正确的索引顺序\n  KEY `idx_user_status_time` (`user_id`, `status`, `create_time`)\n  ```

### 3. 常见查询场景的索引设计

#### 场景 1: 单字段等值查询
```sql\n-- 查询：SELECT * FROM users WHERE email = ?\n-- 索引设计\nUNIQUE KEY `uk_email` (`email`)  -- 唯一索引\n\n-- 或\nKEY `idx_email` (`email`)  -- 普通索引\n```

#### 场景 2: 多字段等值查询
```sql\n-- 查询：SELECT * FROM orders WHERE user_id = ? AND status = ?\n-- 索引设计（联合索引）\nKEY `idx_user_status` (`user_id`, `status`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 1;\n-- 期望：type = ref, key = idx_user_status\n```

#### 场景 3: 等值 + 范围查询
```sql\n-- 查询：SELECT * FROM orders WHERE user_id = ? AND create_time > ?\n-- 索引设计（联合索引，等值在前，范围在后）\nKEY `idx_user_create_time` (`user_id`, `create_time`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM orders WHERE user_id = 1 AND create_time > '2025-01-01';\n-- 期望：type = range, key = idx_user_create_time\n```

#### 场景 4: 排序查询
```sql\n-- 查询：SELECT * FROM orders WHERE user_id = ? ORDER BY create_time DESC\n-- 索引设计（等值字段在前，排序字段在后）\nKEY `idx_user_create_time` (`user_id`, `create_time`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM orders WHERE user_id = 1 ORDER BY create_time DESC;\n-- 期望：type = ref, key = idx_user_create_time, Extra 不包含 Using filesort\n```

#### 场景 5: 分页查询
```sql\n-- 查询：SELECT * FROM users WHERE enable_flag = 1 ORDER BY create_time DESC LIMIT 10 OFFSET 20\n-- 索引设计（状态字段在前，排序字段在后）\nKEY `idx_enable_create_time` (`enable_flag`, `create_time`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM users WHERE enable_flag = 1 ORDER BY create_time DESC LIMIT 10 OFFSET 20;\n-- 期望：type = ref, key = idx_enable_create_time\n```

#### 场景 6: 模糊查询
```sql\n-- 查询：SELECT * FROM users WHERE username LIKE 'admin%'\n-- 索引设计\nKEY `idx_username` (`username`)\n\n-- 注意：LIKE '%admin' 或 LIKE '%admin%' 不能使用索引\n-- 解决方案：使用 Elasticsearch 或全文索引\n```

#### 场景 7: IN 查询
```sql\n-- 查询：SELECT * FROM orders WHERE status IN (1, 2, 3)\n-- 索引设计\nKEY `idx_status` (`status`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM orders WHERE status IN (1, 2, 3);\n-- 期望：type = range, key = idx_status\n```

#### 场景 8: 联合查询（多条件）
```sql\n-- 查询：SELECT * FROM orders WHERE user_id = ? AND status = ? AND create_time > ? ORDER BY create_time DESC\n-- 索引设计（等值字段在前，范围字段在中间，排序字段在后）\nKEY `idx_user_status_create_time` (`user_id`, `status`, `create_time`)\n\n-- 查询计划\nEXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 1 AND create_time > '2025-01-01' ORDER BY create_time DESC;\n-- 期望：type = range, key = idx_user_status_create_time\n```

### 4. 索引命名规范

- **格式**: `idx_[字段名1]_[字段名2]_...`
- **示例**:
  ```sql
  KEY `idx_user_id` (`user_id`)
  KEY `idx_user_status` (`user_id`, `status`)
  KEY `idx_created_at` (`created_at`)
  ```

---

## 🗑️ 软删除规范

### 1. 软删除原理

软删除是指不真正删除数据，而是标记为已删除。

**优点**:
- 数据可恢复
- 便于审计和追踪
- 避免级联删除的复杂性

**缺点**:
- 查询需要过滤已删除数据
- 存储空间占用

### 2. 实现方式

#### 方式 1: 使用 deleted_at 字段（推荐）
```sql
ALTER TABLE users ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL COMMENT '删除时间';
```

**查询时**:
```sql
-- 查询未删除的数据
SELECT * FROM users WHERE deleted_at IS NULL;

-- 查询已删除的数据
SELECT * FROM users WHERE deleted_at IS NOT NULL;
```

#### 方式 2: 使用 is_deleted 字段
```sql
ALTER TABLE users ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除';
```

**查询时**:
```sql
-- 查询未删除的数据
SELECT * FROM users WHERE is_deleted = 0;

-- 查询已删除的数据
SELECT * FROM users WHERE is_deleted = 1;
```

**推荐**: 使用 `deleted_at` 字段，因为可以记录删除时间

### 3. 软删除的索引

```sql
-- 为 deleted_at 字段创建索引
KEY `idx_deleted_at` (`deleted_at`)

-- 或者创建复合索引
KEY `idx_status_deleted` (`status`, `deleted_at`)
```

### 4. ORM 框架集成

#### MyBatis 集成
```java
// 在 BaseEntity 中定义
@Data
public class BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime deletedAt;
}

// 在 Mapper 中使用
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 自动过滤已删除数据
    @Select("SELECT * FROM users WHERE deleted_at IS NULL")
    List<User> selectAll();
}
```

#### JPA 集成
```java
// 使用 @SQLDelete 注解
@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
```

---

## 📊 数据库设计检查清单

在完成数据库设计后，请检查以下项目：

- [ ] **表设计**
  - [ ] 所有表都有 id、created_at、updated_at、deleted_at 字段
  - [ ] 表名和字段名符合命名规范
  - [ ] 所有字段都有 COMMENT
  - [ ] 所有字段都有合适的类型和约束

- [ ] **索引设计**
  - [ ] 所有外键都有索引
  - [ ] 高频查询字段都有索引
  - [ ] 没有冗余索引
  - [ ] 索引命名规范

- [ ] **软删除**
  - [ ] 所有表都有 deleted_at 字段
  - [ ] deleted_at 字段有索引
  - [ ] 查询时都过滤了已删除数据

- [ ] **性能**
  - [ ] 没有过多的 NULL 值
  - [ ] 没有过长的 VARCHAR 字段
  - [ ] 没有过多的索引

- [ ] **文档**
  - [ ] 所有表都有注释
  - [ ] 所有字段都有注释
  - [ ] 有 ER 图或关系说明

---

## 🔧 常见问题

### Q1: 什么时候应该使用软删除？
**A**: 大多数情况下应该使用软删除，除非：
- 数据量非常大，存储空间是瓶颈
- 数据不需要审计和追踪
- 业务明确要求物理删除

### Q2: 如何处理软删除后的唯一约束？
**A**: 创建复合唯一索引，包含 deleted_at 字段：
```sql
UNIQUE KEY `uk_email_deleted` (`email`, `deleted_at`)
```

### Q3: 分库分表时如何选择分片键？
**A**: 选择以下条件的字段：
- 数据分布均匀
- 查询频繁
- 不经常变化
- 通常是用户 ID 或时间

### Q4: 如何处理多对多关系？
**A**: 创建中间表，包含两个外键：
```sql
CREATE TABLE user_roles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

---

## 📚 参考资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [高性能 MySQL](https://book.douban.com/subject/23008813/)


---

**文档版本**: v1.0  
**最后更新**: 2025-01-15  
**维护者**: 架构团队
