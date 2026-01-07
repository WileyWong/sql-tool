# MySQL 技术参考

## 技术栈

| 组件 | 推荐版本 | 说明 |
|------|---------|------|
| MySQL | 8.0+ | 数据库 |
| 字符集 | utf8mb4 | 支持 emoji |
| 引擎 | InnoDB | 事务支持 |

## DDL 模板

```sql
CREATE TABLE t_xxx (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    -- 业务字段
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表注释';
```

## 规范文档

- [命名规范](../standards/mysql/naming.md)
- [DDL 规范](../standards/mysql/ddl.md)
- [索引规范](../standards/mysql/index.md)
- [最佳实践](../standards/mysql/best-practices.md)
- [错误示例](../standards/mysql/anti-patterns.md)
