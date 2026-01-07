# MySQL 从需求生成 DDL 指南

## 适用场景

- 输入：业务需求文档或实体设计
- 输出：MySQL DDL 建表语句

## 输入示例

```
用户管理模块：
- 用户表：存储用户基本信息
  - 用户名（唯一）
  - 密码（加密存储）
  - 邮箱（唯一）
  - 手机号
  - 状态（启用/禁用）
  - 注册时间
```

## 生成 DDL

```sql
-- 用户表
CREATE TABLE t_user (
    -- 主键
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    
    -- 业务字段
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码（加密）',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    
    -- 公共字段
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by BIGINT DEFAULT NULL COMMENT '创建人',
    update_by BIGINT DEFAULT NULL COMMENT '更新人',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    
    -- 索引
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_username (username),
    UNIQUE KEY uk_user_email (email),
    KEY idx_user_status (status),
    KEY idx_user_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

## 字段类型选择

| 业务类型 | MySQL 类型 |
|---------|-----------|
| ID | BIGINT |
| 用户名/名称 | VARCHAR(50) |
| 密码 | VARCHAR(100) |
| 邮箱 | VARCHAR(100) |
| 手机号 | VARCHAR(20) |
| 状态/类型 | TINYINT |
| 金额 | DECIMAL(10,2) |
| 描述/备注 | VARCHAR(500) |
| 长文本 | TEXT |
| 时间 | DATETIME |

## 检查清单

- [ ] 表名 t_ 前缀
- [ ] 主键 BIGINT
- [ ] 字段有 COMMENT
- [ ] 有公共字段
- [ ] 有必要索引
- [ ] utf8mb4 字符集

## 参考

- [MySQL 命名规范](../standards/mysql/naming.md)
- [MySQL DDL 规范](../standards/mysql/ddl.md)
