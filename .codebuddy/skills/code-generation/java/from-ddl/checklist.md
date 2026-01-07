# Java 从 DDL 生成代码 - 检查清单

## DDL 解析检查

- [ ] 解析表名
- [ ] 解析所有字段（名称、类型、长度、约束）
- [ ] 解析主键定义
- [ ] 解析索引定义
- [ ] 解析外键关系
- [ ] 解析字段注释

## Entity 生成检查

### 基础结构
- [ ] 包名正确（`com.xxx.entity`）
- [ ] 类名使用 PascalCase（表名转换）
- [ ] 使用 `@Data` 注解
- [ ] 使用 `@TableName` 指定表名

### 主键
- [ ] 使用 `@TableId` 注解
- [ ] 主键策略正确（ASSIGN_ID/AUTO/INPUT）

### 字段映射
- [ ] 字段名使用 camelCase
- [ ] 字段类型映射正确
- [ ] **所有字段使用 `@TableField("column_name")` 标注数据库字段名**
- [ ] 逻辑删除字段使用 `@TableField("xxx") @TableLogic`
- [ ] 自动填充字段使用 `@TableField(value = "xxx", fill = ...)`

### 注释
- [ ] 类注释完整
- [ ] 每个字段有 JavaDoc 注释

## 类型映射表

| MySQL 类型 | Java 类型 |
|-----------|----------|
| BIGINT | Long |
| INT | Integer |
| TINYINT | Integer |
| VARCHAR | String |
| TEXT | String |
| DECIMAL | BigDecimal |
| DATETIME | LocalDateTime |
| DATE | LocalDate |
| TIME | LocalTime |
| TIMESTAMP | LocalDateTime |
| BOOLEAN | Boolean |

## Mapper 生成检查

- [ ] 包名正确
- [ ] 继承 `BaseMapper<Entity>`
- [ ] 使用 `@Mapper` 注解

## 编译验证

```bash
mvn compile -DskipTests
```

- [ ] 编译成功
- [ ] 无类型错误
