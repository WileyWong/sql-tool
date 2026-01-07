# Java 从 DDL 生成代码 - 示例

## 示例1: 用户表

### 输入: DDL

```sql
CREATE TABLE `t_user` (
  `id` bigint NOT NULL COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码（加密）',
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
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 输出: Entity

> **注意**: 所有字段必须使用 `@TableField` 注解标注实际的数据库字段名。

```java
package com.example.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体
 * 
 * @author code-generation
 * @since 1.0.0
 */
@Data
@TableName("t_user")
public class User {
    
    /**
     * 用户ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 用户名
     */
    @TableField("username")
    private String username;
    
    /**
     * 密码（加密）
     */
    @TableField("password")
    private String password;
    
    /**
     * 邮箱
     */
    @TableField("email")
    private String email;
    
    /**
     * 手机号
     */
    @TableField("phone")
    private String phone;
    
    /**
     * 昵称
     */
    @TableField("nickname")
    private String nickname;
    
    /**
     * 头像URL
     */
    @TableField("avatar")
    private String avatar;
    
    /**
     * 状态：0-禁用，1-启用
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    /**
     * 是否删除：0-否，1-是
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
```

### 输出: Mapper

```java
package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

---

## 示例2: 订单表（含外键）

### 输入: DDL

```sql
CREATE TABLE `t_order` (
  `id` bigint NOT NULL COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `product_id` bigint NOT NULL COMMENT '商品ID',
  `quantity` int NOT NULL COMMENT '数量',
  `total_amount` decimal(10,2) NOT NULL COMMENT '总金额',
  `status` varchar(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING/PAID/SHIPPED/COMPLETED/CANCELLED',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `ship_time` datetime DEFAULT NULL COMMENT '发货时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

### 输出: Entity

```java
package com.example.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 */
@Data
@TableName("t_order")
public class Order {
    
    /**
     * 订单ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 订单编号
     */
    @TableField("order_no")
    private String orderNo;
    
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 商品ID
     */
    @TableField("product_id")
    private Long productId;
    
    /**
     * 数量
     */
    @TableField("quantity")
    private Integer quantity;
    
    /**
     * 总金额
     */
    @TableField("total_amount")
    private BigDecimal totalAmount;
    
    /**
     * 状态：PENDING/PAID/SHIPPED/COMPLETED/CANCELLED
     */
    @TableField("status")
    private String status;
    
    /**
     * 支付时间
     */
    @TableField("pay_time")
    private LocalDateTime payTime;
    
    /**
     * 发货时间
     */
    @TableField("ship_time")
    private LocalDateTime shipTime;
    
    /**
     * 完成时间
     */
    @TableField("complete_time")
    private LocalDateTime completeTime;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
```

---

## 字段类型映射详解

### 数值类型

| MySQL | Java | 说明 |
|-------|------|------|
| `BIGINT` | `Long` | 大整数 |
| `INT` | `Integer` | 整数 |
| `TINYINT` | `Integer` | 小整数（状态值等） |
| `DECIMAL(p,s)` | `BigDecimal` | 精确小数（金额等） |
| `DOUBLE` | `Double` | 浮点数 |

### 字符串类型

| MySQL | Java | 说明 |
|-------|------|------|
| `VARCHAR(n)` | `String` | 变长字符串 |
| `CHAR(n)` | `String` | 定长字符串 |
| `TEXT` | `String` | 长文本 |
| `JSON` | `String` | JSON 字符串 |

### 日期时间类型

| MySQL | Java | 说明 |
|-------|------|------|
| `DATETIME` | `LocalDateTime` | 日期时间 |
| `DATE` | `LocalDate` | 日期 |
| `TIME` | `LocalTime` | 时间 |
| `TIMESTAMP` | `LocalDateTime` | 时间戳 |

### 特殊处理

| 场景 | 处理方式 |
|------|---------|
| 主键 BIGINT | `@TableId(value = "id", type = IdType.ASSIGN_ID)` |
| 主键 AUTO_INCREMENT | `@TableId(value = "id", type = IdType.AUTO)` |
| 普通字段 | `@TableField("column_name")` |
| 逻辑删除字段 | `@TableField("deleted") @TableLogic` |
| 创建时间 | `@TableField(value = "create_time", fill = FieldFill.INSERT)` |
| 更新时间 | `@TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)` |
