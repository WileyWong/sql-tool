# MySQL from-entity 检查清单

## 输入验证

- [ ] Java Entity 类结构完整
- [ ] 包含必要注解（@TableName/@TableId）
- [ ] 字段类型可识别

## Entity 解析

- [ ] 表名正确提取（@TableName 或类名转换）
- [ ] 主键字段识别（@TableId）
- [ ] 字段映射正确（@TableField）
- [ ] 逻辑删除字段识别（@TableLogic）
- [ ] 乐观锁字段识别（@Version）

## 类型转换

- [ ] Long → BIGINT
- [ ] Integer → INT
- [ ] String → VARCHAR(255)
- [ ] Boolean → TINYINT(1)
- [ ] BigDecimal → DECIMAL(10,2)
- [ ] LocalDateTime → DATETIME
- [ ] LocalDate → DATE

## DDL 生成

- [ ] 表名小写下划线
- [ ] 主键 AUTO_INCREMENT
- [ ] 字段有 COMMENT
- [ ] 公共字段完整
- [ ] utf8mb4 字符集
- [ ] InnoDB 引擎

## 索引设计

- [ ] 主键索引
- [ ] 唯一字段索引（如有）
- [ ] 外键字段索引（如有）

## 验证

- [ ] DDL 语法正确
- [ ] 可在 MySQL 执行
