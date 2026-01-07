# MySQL from-entity 示例

## 示例1: 简单 Entity

### 输入

```java
@Data
@TableName("t_category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Integer sort;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
```

### 输出

```sql
CREATE TABLE t_category (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(255) DEFAULT NULL COMMENT '名称',
    sort INT DEFAULT NULL COMMENT '排序',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';
```

---

## 示例2: 带逻辑删除和乐观锁

### 输入

```java
@Data
@TableName("t_order")
public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String orderNo;
    
    private BigDecimal totalAmount;
    
    private Integer status;
    
    @Version
    private Integer version;
    
    @TableLogic
    private Integer isDeleted;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
```

### 输出

```sql
CREATE TABLE t_order (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT DEFAULT NULL COMMENT '用户ID',
    order_no VARCHAR(255) DEFAULT NULL COMMENT '订单号',
    total_amount DECIMAL(10,2) DEFAULT NULL COMMENT '总金额',
    status INT DEFAULT NULL COMMENT '状态',
    version INT NOT NULL DEFAULT 0 COMMENT '乐观锁版本',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    KEY idx_order_user_id (user_id),
    UNIQUE KEY uk_order_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';
```

---

## 示例3: JPA Entity

### 输入

```java
@Entity
@Table(name = "t_product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_name", length = 100, nullable = false)
    private String productName;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}
```

### 输出

```sql
CREATE TABLE t_product (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    product_name VARCHAR(100) NOT NULL COMMENT '产品名称',
    price DECIMAL(10,2) DEFAULT NULL COMMENT '价格',
    description VARCHAR(500) DEFAULT NULL COMMENT '描述',
    create_time DATETIME DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品表';
```
