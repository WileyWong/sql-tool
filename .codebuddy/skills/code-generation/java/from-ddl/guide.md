# Java 从 DDL 生成代码指南

## 适用场景

- 输入：MySQL DDL 建表语句
- 输出：Entity、Mapper、Service 代码

## 输入格式

```sql
CREATE TABLE t_user (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

## 生成流程

### 步骤1: 解析 DDL

```yaml
提取内容:
  表名: t_user → User
  字段:
    - id: BIGINT → Long
    - username: VARCHAR → String
    - status: TINYINT → Integer
    - create_time: DATETIME → LocalDateTime
  索引:
    - PRIMARY KEY (id)
    - UNIQUE KEY uk_user_username (username)
```

### 步骤2: 类型映射

| MySQL 类型 | Java 类型 |
|-----------|----------|
| BIGINT | Long |
| INT | Integer |
| TINYINT | Integer |
| VARCHAR | String |
| TEXT | String |
| DATETIME | LocalDateTime |
| DATE | LocalDate |
| DECIMAL | BigDecimal |
| DOUBLE | Double |

### 步骤3: 生成 Entity

> **强制要求**: 所有字段必须使用 `@TableField` 注解标注实际的数据库字段名。

```java
@Data
@TableName("t_user")
public class User {
    
    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;
    
    /**
     * 用户名
     */
    @TableField("username")
    private String username;
    
    /**
     * 密码
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
     * 是否删除
     */
    @TableField("is_deleted")
    @TableLogic
    private Integer isDeleted;
}
```

### 步骤4: 生成 Mapper

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 根据用户名查询
     */
    default User selectByUsername(String username) {
        return selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }
    
    /**
     * 检查用户名是否存在
     */
    default boolean existsByUsername(String username) {
        return selectCount(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)) > 0;
    }
}
```

## 命名转换规则

| DDL | Java |
|-----|------|
| t_user | User |
| user_name | userName |
| is_deleted | isDeleted |
| create_time | createTime |

## 检查清单

- [ ] 解析表名和字段
- [ ] 类型正确映射
- [ ] 字段注释保留
- [ ] 主键注解正确
- [ ] 逻辑删除注解
- [ ] 自动填充注解
- [ ] 生成 Mapper 接口

## 参考

- [MyBatis-Plus 规范](../../standards/java/mybatis-plus.md)
- [MySQL DDL 规范](../../standards/mysql/ddl.md)
