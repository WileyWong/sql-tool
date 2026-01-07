# MySQL 从 Java Entity 生成 DDL 指南

## 适用场景

- 输入：Java Entity 类（带 JPA/MyBatis-Plus 注解）
- 输出：MySQL DDL 建表语句

## 输入示例

```java
@Data
@TableName("t_user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("username")
    private String username;
    
    @TableField("email")
    private String email;
    
    @TableField("status")
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer isDeleted;
}
```

## 生成 DDL

```sql
-- 用户表（从 Entity 反向生成）
CREATE TABLE t_user (
    -- 主键
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    
    -- 业务字段
    username VARCHAR(255) NOT NULL COMMENT '用户名',
    email VARCHAR(255) DEFAULT NULL COMMENT '邮箱',
    status INT DEFAULT NULL COMMENT '状态',
    
    -- 公共字段
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    
    -- 索引
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

## 类型映射规则

| Java 类型 | MySQL 类型 | 说明 |
|-----------|-----------|------|
| Long | BIGINT | 主键/外键 |
| Integer | INT | 普通整数 |
| String | VARCHAR(255) | 默认长度，可通过注解调整 |
| Boolean | TINYINT(1) | 布尔值 |
| BigDecimal | DECIMAL(10,2) | 金额 |
| LocalDateTime | DATETIME | 时间 |
| LocalDate | DATE | 日期 |
| byte[] | BLOB | 二进制 |

## 注解解析规则

| 注解 | 解析结果 |
|------|---------|
| `@TableName("t_xxx")` | 表名 |
| `@TableId(type = IdType.AUTO)` | 主键 AUTO_INCREMENT |
| `@TableField("xxx")` | 字段名映射 |
| `@TableLogic` | 逻辑删除字段 |
| `@Version` | 乐观锁字段 |

## 检查清单

- [ ] 表名与 @TableName 一致
- [ ] 主键类型正确
- [ ] 字段类型映射正确
- [ ] 逻辑删除字段处理
- [ ] 公共字段完整
- [ ] utf8mb4 字符集

## 参考

- [MySQL 命名规范](../../standards/mysql/naming.md)
- [MySQL DDL 规范](../../standards/mysql/ddl.md)
