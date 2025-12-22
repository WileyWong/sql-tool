# 数据库设计 - 验证清单

本清单用于验证 `design-db` skill 的输出质量，确保数据库设计符合最佳实践和项目规范。

---

## 📋 前置条件检查

在开始数据库设计前，确认以下条件已满足：

- [ ] 业务实体已识别（来自需求文档或实体设计）
- [ ] 实体属性已明确（字段列表、数据类型）
- [ ] 实体关系已梳理（1:1、1:N、M:N）
- [ ] 查询场景已明确（WHERE、ORDER BY、JOIN 条件）
- [ ] 数据量级已评估（单表预计数据量、增长速度）

---

## 🎯 业务实体分析质量检查

### 必须项（红线）

- [ ] **实体列表完整** - 所有业务实体都已识别
- [ ] **实体属性明确** - 每个实体的属性清单已列出
- [ ] **实体关系清晰** - 1:1、1:N、M:N 关系已明确标注
- [ ] **关系基数明确** - 如"一个用户有多个订单"

### 质量标准

#### 实体列表
- [ ] 实体名称清晰（用户、订单、商品）
- [ ] 实体职责单一（避免"万能表"）
- [ ] 实体数量合理（不过多也不过少）

#### 实体属性
- [ ] 核心属性已列出（ID、名称、状态等）
- [ ] 属性类型初步确定（整数、字符串、时间等）
- [ ] 必填/可选已标注

#### 实体关系
- [ ] 一对一关系已识别（如用户 1:1 用户详情）
- [ ] 一对多关系已识别（如用户 1:N 订单）
- [ ] 多对多关系已识别（如文章 M:N 标签）
- [ ] 自关联关系已识别（如评论回复、部门树）

### 示例
```markdown
✅ 好的实体分析：
- 用户（User）: id, username, email, phone, status
- 订单（Order）: id, order_no, user_id, total_amount, status
- 关系：User 1:N Order

❌ 不好的实体分析：
- 用户订单表（UserOrder）: user_info, order_info, ...  # 职责不清
```

---

## 📊 表结构设计质量检查

### 必须项（红线）

- [ ] **表名符合规范** - 小写+下划线，复数形式（如 `users`、`orders`）
- [ ] **字段名符合规范** - 小写+下划线（如 `user_id`、`create_time`）
- [ ] **主键使用 BIGINT** - 所有表主键统一使用 `BIGINT UNSIGNED`
- [ ] **外键命名规范** - 关联表_id（如 `user_id`、`order_id`）
- [ ] **必备字段完整** - id、create_time、update_time、delete_time

### 命名规范检查

#### 表名
- [ ] 小写字母（✅ users，❌ Users）
- [ ] 下划线分隔（✅ order_items，❌ orderItems）
- [ ] 复数形式（✅ users，❌ user）
- [ ] 避免保留字（❌ order，✅ orders）

#### 字段名
- [ ] 小写字母（✅ user_id，❌ userId）
- [ ] 下划线分隔（✅ create_time，❌ createTime）
- [ ] 见名知意（✅ total_amount，❌ amount1）
- [ ] 主键统一用 `id`（✅ id，❌ user_id）
- [ ] 外键用 `关联表_id`（✅ user_id，❌ uid）

### 必备字段检查

所有表必须包含以下字段：

```sql
-- ✅ 正确的必备字段
`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
`delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间（软删除）',
PRIMARY KEY (`id`)
```

检查项：
- [ ] 主键 `id` 存在且为 `BIGINT UNSIGNED`
- [ ] `create_time` 存在且默认 CURRENT_TIMESTAMP
- [ ] `update_time` 存在且自动更新
- [ ] `delete_time` 存在（支持软删除）
- [ ] 所有字段都有 COMMENT

### 字段类型选择检查

#### 整数类型
- [ ] 主键/外键：`BIGINT UNSIGNED`（✅）
- [ ] 状态/类型：`TINYINT`（值范围 0-255）
- [ ] 计数/数量：`INT`（值范围够用）
- [ ] 避免 `SMALLINT`、`MEDIUMINT`（除非有明确理由）

#### 字符串类型
- [ ] 短文本（< 255）：`VARCHAR(N)`
- [ ] 长文本：`TEXT`
- [ ] 固定长度：`CHAR(N)`（如手机号、MD5）
- [ ] 字符集：`utf8mb4`（支持 emoji）

#### 金额类型（重要！）
- [ ] **必须使用 `DECIMAL(10,2)`**（✅）
- [ ] **禁止使用 `FLOAT` 或 `DOUBLE`**（❌）
- [ ] 精度合理（10,2 表示最大 99999999.99）

```sql
-- ✅ 正确
`total_amount` DECIMAL(10,2) NOT NULL COMMENT '总金额',
`price` DECIMAL(10,2) NOT NULL COMMENT '单价',

-- ❌ 错误
`total_amount` FLOAT NOT NULL,  -- 精度问题
`price` DOUBLE NOT NULL,        -- 精度问题
```

#### 时间类型
- [ ] 业务时间：`DATETIME`（如创建时间、支付时间）
- [ ] 系统时间：`TIMESTAMP`（自动更新，如 update_time）
- [ ] 日期：`DATE`（如生日、入职日期）
- [ ] 避免存储时间戳整数（可读性差）

#### 布尔类型
- [ ] 使用 `TINYINT`（1-是，0-否）
- [ ] 避免使用 `BOOLEAN`（MySQL 会转为 TINYINT）

### 字段属性检查

- [ ] 所有字段都有 `COMMENT`（包括表注释）
- [ ] 必填字段使用 `NOT NULL`
- [ ] 可选字段使用 `NULL DEFAULT NULL`
- [ ] 有合理的 `DEFAULT` 值（如状态默认 1）
- [ ] `UNSIGNED` 用于非负数（如 ID、数量）

### 红灯信号（立即停止）

- [ ] ❌ 金额使用 `FLOAT` 或 `DOUBLE`
- [ ] ❌ 主键使用 `VARCHAR`
- [ ] ❌ 外键使用 `INT`（应使用 `BIGINT`）
- [ ] ❌ 缺少必备字段（id、create_time、update_time、delete_time）
- [ ] ❌ 字段没有 `COMMENT`
- [ ] ❌ 使用驼峰命名（userId、createTime）

---

## 🔍 索引设计质量检查

### 必须项（红线）

- [ ] **主键索引存在** - 所有表都有 PRIMARY KEY
- [ ] **唯一索引正确** - 业务唯一字段（用户名、订单号）有 UNIQUE KEY
- [ ] **外键索引存在** - 所有外键字段都有索引
- [ ] **高频查询有索引** - WHERE、ORDER BY 字段有对应索引
- [ ] **联合索引顺序正确** - 遵循最左前缀原则

### 主键索引检查

```sql
-- ✅ 正确
PRIMARY KEY (`id`)

-- ❌ 错误
PRIMARY KEY (`username`)  -- 主键应该是无业务意义的自增ID
```

### 唯一索引检查

业务唯一字段必须添加唯一索引：

```sql
-- ✅ 正确
UNIQUE KEY `uk_username` (`username`),
UNIQUE KEY `uk_email` (`email`),
UNIQUE KEY `uk_order_no` (`order_no`)

-- ❌ 错误
KEY `idx_username` (`username`)  -- 应该用 UNIQUE KEY
```

检查项：
- [ ] 用户名有唯一索引
- [ ] 邮箱/手机号有唯一索引
- [ ] 订单号/编号有唯一索引
- [ ] 其他业务唯一字段有唯一索引

### 外键索引检查

所有外键字段必须添加索引：

```sql
-- ✅ 正确
`user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
KEY `idx_user_id` (`user_id`)

-- ❌ 错误
`user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
-- 缺少索引
```

### 联合索引设计检查

**核心原则：最左前缀 + 等值查询优先 + 范围查询其次 + 排序字段最后**

#### 索引顺序验证

```sql
-- 查询示例
WHERE user_id = ? AND status = ? ORDER BY create_time DESC

-- ✅ 正确的索引顺序
KEY `idx_user_status_time` (`user_id`, `status`, `create_time`)
-- 顺序：等值查询（user_id、status）→ 排序字段（create_time）

-- ❌ 错误的索引顺序
KEY `idx_time_user_status` (`create_time`, `user_id`, `status`)  -- 排序字段不应在前
KEY `idx_status_user_time` (`status`, `user_id`, `create_time`)  -- 低选择性字段在前
```

#### 联合索引检查清单

- [ ] 等值查询字段在前（WHERE field = ?）
- [ ] 范围查询字段在中（WHERE field > ? 或 BETWEEN）
- [ ] 排序字段在后（ORDER BY field）
- [ ] 高选择性字段在前（如 user_id 优于 status）
- [ ] 避免索引字段过多（一般 2-4 个）

#### 最左前缀原则验证

```sql
-- 索引：idx_user_status_time (user_id, status, create_time)

-- ✅ 能用到索引的查询
WHERE user_id = ?                                    -- 使用索引第一列
WHERE user_id = ? AND status = ?                     -- 使用索引前两列
WHERE user_id = ? AND status = ? ORDER BY create_time  -- 使用全部索引

-- ❌ 不能用到索引的查询
WHERE status = ?                                     -- 没有最左列
WHERE create_time > ?                                -- 没有最左列
WHERE status = ? AND create_time > ?                 -- 没有最左列
```

### 索引命名规范

- [ ] 主键：`PRIMARY KEY` 或不命名
- [ ] 唯一索引：`uk_字段名`（如 `uk_username`）
- [ ] 普通索引：`idx_字段名`（如 `idx_user_id`）
- [ ] 联合索引：`idx_字段1_字段2`（如 `idx_user_status_time`）

### 索引覆盖检查

常见查询场景是否有对应索引：

#### 单表查询
- [ ] WHERE 条件字段有索引
- [ ] ORDER BY 字段有索引（或在联合索引最右侧）
- [ ] 频繁查询的字段组合有联合索引

#### 关联查询
- [ ] JOIN 字段有索引
- [ ] WHERE 条件字段有索引
- [ ] 驱动表选择合理（小表驱动大表）

### 索引验证（必须执行）

使用 `EXPLAIN` 验证查询计划：

```sql
-- ✅ 期望结果
EXPLAIN SELECT * FROM orders WHERE user_id = 123 AND status = 2;
-- type: ref（索引查找）
-- key: idx_user_status_time（使用了索引）
-- rows: 适当的行数（非全表）
-- Extra: 无 Using filesort（排序用了索引）

-- ❌ 不理想的结果
-- type: ALL（全表扫描）
-- key: NULL（未使用索引）
-- rows: 很大的数字（全表扫描）
-- Extra: Using filesort（排序未用索引，需要额外排序）
```

检查项：
- [ ] type 为 `const`、`eq_ref`、`ref`（不是 ALL）
- [ ] key 显示使用了预期的索引（不是 NULL）
- [ ] rows 数量合理（不是全表行数）
- [ ] Extra 无 `Using filesort`（排序场景）
- [ ] Extra 无 `Using temporary`（避免临时表）

### 索引优化建议

- [ ] 避免过多索引（单表 < 5 个，影响写入性能）
- [ ] 删除冗余索引（idx_user 和 idx_user_status 重复）
- [ ] 删除未使用索引（通过慢查询日志分析）
- [ ] 前缀索引（VARCHAR 字段过长时，如 `KEY idx_name (name(50))`）

### 红灯信号（立即停止）

- [ ] ❌ 联合索引顺序错误（排序字段在最前）
- [ ] ❌ 外键字段没有索引
- [ ] ❌ 唯一字段使用普通索引
- [ ] ❌ EXPLAIN 显示 type=ALL（全表扫描）
- [ ] ❌ EXPLAIN 显示 Using filesort（排序未用索引）

---

## 🔗 实体关系设计质量检查

### 一对一关系（1:1）

**设计方案**：
- 方案一：合并到一张表（推荐，性能好）
- 方案二：拆分为两张表，外键 + 唯一索引

```sql
-- ✅ 方案二示例（用户和用户详情）
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `user_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `avatar` VARCHAR(255),
  `bio` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)  -- 唯一索引保证 1:1
);
```

检查项：
- [ ] 外键字段有唯一索引（UNIQUE KEY）
- [ ] 确认真的需要拆分（性能 vs 规范化）

### 一对多关系（1:N）

**设计方案**：在"多"方添加外键

```sql
-- ✅ 正确示例（用户 1:N 订单）
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID（外键）',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)  -- 外键索引
);
```

检查项：
- [ ] 外键在"多"方（✅ orders.user_id，❌ users.order_ids）
- [ ] 外键字段有索引
- [ ] 外键字段类型与主键一致（都是 BIGINT UNSIGNED）

### 多对多关系（M:N）

**设计方案**：使用关联表（中间表）

```sql
-- ✅ 正确示例（文章 M:N 标签）
CREATE TABLE `articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);

-- 关联表
CREATE TABLE `article_tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` BIGINT UNSIGNED NOT NULL,
  `tag_id` BIGINT UNSIGNED NOT NULL,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),  -- 防止重复关联
  KEY `idx_tag_id` (`tag_id`)
);
```

检查项：
- [ ] 关联表命名：`表1_表2`（如 `article_tags`）
- [ ] 包含两个外键字段
- [ ] 联合唯一索引（防止重复关联）
- [ ] 两个外键字段都有索引
- [ ] 关联表有 create_time（可选 update_time）

### 自关联关系

**常见场景**：部门树、评论回复、菜单层级

```sql
-- ✅ 正确示例（评论回复）
CREATE TABLE `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` BIGINT UNSIGNED NULL DEFAULT NULL COMMENT '父评论ID（NULL表示顶级评论）',
  `content` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)  -- 自关联索引
);
```

检查项：
- [ ] `parent_id` 允许 NULL（顶级节点）
- [ ] `parent_id` 有索引
- [ ] 考虑深度限制（避免无限递归）

---

## 📈 性能优化设计检查

### 冗余设计

**何时冗余**：
- 避免频繁 JOIN 查询
- 保留历史快照（如订单商品价格）
- 提升查询性能

```sql
-- ✅ 适当冗余
CREATE TABLE `order_items` (
  `product_id` BIGINT UNSIGNED NOT NULL,
  `product_name` VARCHAR(200) NOT NULL COMMENT '商品名称（冗余，保留下单时快照）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价（冗余，记录下单时价格）'
);

-- ✅ 计数冗余
CREATE TABLE `articles` (
  `comment_count` INT NOT NULL DEFAULT 0 COMMENT '评论数（冗余，提升性能）'
);
```

检查项：
- [ ] 冗余字段有明确理由（注释说明）
- [ ] 有数据同步机制（触发器/应用层）
- [ ] 权衡了一致性和性能

### 分表设计

**何时分表**（满足任一条件）：
- 单表 > 1000 万行且索引优化无效
- 单库 QPS > 1000 且读写分离无效
- 存储空间是瓶颈

**分表策略**：
- 按时间分表（如打卡记录按月：`attendances_202501`）
- 按 ID 取模分表（如订单按用户 ID 取模 16）
- 按地域分表（如用户按省份）

```sql
-- ✅ 按月分表示例
CREATE TABLE `attendances_202501` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` BIGINT UNSIGNED NOT NULL,
  `check_time` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_employee_time` (`employee_id`, `check_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='打卡记录表-2025年01月';
```

检查项：
- [ ] 分表规则明确（按月、按 ID 取模）
- [ ] 分表命名规范（表名_分片标识）
- [ ] 跨表查询策略（应用层合并、中间件）
- [ ] 优先级：索引优化 → 缓存 → 读写分离 → 分表

### 汇总表设计

**何时使用汇总表**：
- 复杂统计查询（跨多表 JOIN、聚合计算）
- 实时性要求不高（可接受延迟）
- 数据量大（百万级以上）

```sql
-- ✅ 月度汇总表示例
CREATE TABLE `attendance_monthly_summary` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` BIGINT UNSIGNED NOT NULL,
  `year_month` INT NOT NULL COMMENT '年月（格式：202501）',
  `work_days` INT NOT NULL DEFAULT 0,
  `late_count` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_month` (`employee_id`, `year_month`)
);
```

检查项：
- [ ] 汇总维度明确（年月、用户、类型）
- [ ] 有定时任务更新（每天/每周/每月）
- [ ] 有唯一索引防止重复汇总

---

## 🛡️ 数据安全和完整性检查

### 软删除设计

**禁止物理删除数据**，使用软删除：

```sql
-- ✅ 正确：软删除
`delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
KEY `idx_delete_time` (`delete_time`)

-- 查询有效数据
WHERE delete_time IS NULL

-- 删除操作
UPDATE users SET delete_time = NOW() WHERE id = ?
```

检查项：
- [ ] 所有表都有 `delete_time` 字段
- [ ] `delete_time` 有索引
- [ ] 查询语句包含 `WHERE delete_time IS NULL`

### 状态字段设计

```sql
-- ✅ 正确：使用 TINYINT + 注释
`status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',

-- ❌ 错误：使用字符串
`status` VARCHAR(20) NOT NULL DEFAULT 'active',  -- 浪费空间，查询慢
```

检查项：
- [ ] 状态使用 `TINYINT`（不是 VARCHAR）
- [ ] 状态有默认值
- [ ] 状态含义在注释中明确说明
- [ ] 状态有索引（高频查询时）

### 金额字段设计（重要！）

```sql
-- ✅ 正确
`total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '总金额',
`price` DECIMAL(10,2) NOT NULL COMMENT '单价',

-- ❌ 错误
`total_amount` FLOAT NOT NULL,       -- 精度丢失
`total_amount` DOUBLE NOT NULL,      -- 精度丢失
`total_amount` INT NOT NULL,         -- 无法表示小数
`total_amount` VARCHAR(20) NOT NULL, -- 无法计算
```

检查项：
- [ ] 所有金额字段使用 `DECIMAL(M,D)`
- [ ] 精度合理（通常 10,2 或 12,2）
- [ ] 禁止使用 `FLOAT`、`DOUBLE`、`INT`、`VARCHAR`

---

## 📝 DDL 输出质量检查

### DDL 完整性

- [ ] 所有表都有完整的 CREATE TABLE 语句
- [ ] 字段定义完整（类型、长度、NULL/NOT NULL、DEFAULT、COMMENT）
- [ ] 索引定义完整（PRIMARY KEY、UNIQUE KEY、KEY）
- [ ] 表属性完整（ENGINE、CHARSET、COMMENT）

### DDL 格式规范

```sql
-- ✅ 正确格式
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，2-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

检查项：
- [ ] 反引号包裹表名和字段名
- [ ] 字段对齐（可读性）
- [ ] 逗号位置正确
- [ ] PRIMARY KEY 在所有索引之前
- [ ] ENGINE=InnoDB
- [ ] CHARSET=utf8mb4（支持 emoji）
- [ ] 表有 COMMENT

---

## ✅ 最终验收清单

在交付数据库设计前，确认以下所有项：

### 核心质量（必须全部通过）

- [ ] 所有业务实体都有对应表
- [ ] 表名/字段名符合命名规范（小写+下划线）
- [ ] 金额字段使用 DECIMAL（非 FLOAT/DOUBLE）
- [ ] 主键使用 BIGINT UNSIGNED（非 VARCHAR/INT）
- [ ] 所有表包含必备字段（id、create_time、update_time、delete_time）
- [ ] 所有字段都有 COMMENT
- [ ] 高频查询有对应索引
- [ ] 联合索引遵循最左前缀原则
- [ ] 外键字段有索引
- [ ] 唯一字段有 UNIQUE KEY

### 索引验证（必须执行）

- [ ] 用 EXPLAIN 验证查询计划
- [ ] type 为 const/eq_ref/ref（不是 ALL）
- [ ] key 显示使用了预期索引（不是 NULL）
- [ ] 无 Using filesort（排序场景）

### 关系设计（必须检查）

- [ ] 一对多关系正确（外键在"多"方）
- [ ] 多对多关系有关联表
- [ ] 关联表有联合唯一索引
- [ ] 自关联有 parent_id 索引

### 性能优化（推荐检查）

- [ ] 适当冗余提升性能
- [ ] 大表考虑分表策略
- [ ] 复杂统计有汇总表

---

## 🚨 红灯信号（立即停止）

以下任一出现，立即停止并修正：

### 致命错误

- [ ] ❌ 金额使用 `FLOAT` 或 `DOUBLE`
- [ ] ❌ 主键使用 `VARCHAR` 或 `INT`
- [ ] ❌ 外键使用 `INT`（应使用 `BIGINT`）
- [ ] ❌ 物理删除数据（无 `delete_time` 字段）
- [ ] ❌ 缺少必备字段（id、create_time、update_time、delete_time）

### 严重问题

- [ ] ❌ 联合索引顺序错误（排序字段在前）
- [ ] ❌ 外键字段没有索引
- [ ] ❌ 唯一字段使用普通索引
- [ ] ❌ 字段没有 COMMENT
- [ ] ❌ 使用驼峰命名（userId、createTime）

### 性能问题

- [ ] ❌ EXPLAIN 显示 type=ALL（全表扫描）
- [ ] ❌ EXPLAIN 显示 Using filesort（排序未用索引）
- [ ] ❌ 高频查询无对应索引
- [ ] ❌ 单表超过 1000 万行且无分表计划

---

## 📊 评分标准

使用以下标准评估数据库设计质量：

### 优秀（90-100 分）
- ✅ 所有必须项通过
- ✅ 索引设计合理且经过 EXPLAIN 验证
- ✅ 性能优化充分（冗余、分表、汇总表）
- ✅ DDL 完整规范
- ✅ 无红灯信号

### 良好（80-89 分）
- ✅ 所有必须项通过
- ✅ 索引设计基本合理
- ⚠️ 部分性能优化待完善
- ✅ DDL 基本规范

### 合格（70-79 分）
- ✅ 必须项通过
- ⚠️ 索引设计需优化
- ⚠️ 性能优化不足
- ⚠️ DDL 需要完善

### 不合格（< 70 分）
- ❌ 存在红灯信号
- ❌ 必须项未全部通过
- ❌ 需要重新设计

---

## 🔄 持续改进

数据库设计是一个持续优化的过程：

- [ ] 根据慢查询日志优化索引
- [ ] 根据数据增长调整分表策略
- [ ] 定期检查索引使用情况（删除未使用索引）
- [ ] 定期评审表结构（字段是否冗余）
- [ ] 记录设计决策和演进历史
