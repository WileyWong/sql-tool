# 实体设计文档

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则和质量标准
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Template 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈和项目结构


**项目名称**: {{projectName}}  
**版本**: {{version}}  
**最后更新**: {{date}}  
**作者**: {{author}}

---

## 📋 目录

1. [实体关系图](#实体关系图)
2. [实体定义](#实体定义)
3. [枚举类型](#枚举类型)
4. [关联关系](#关联关系)
5. [验证规则](#验证规则)
6. [索引设计](#索引设计)

---

## 实体关系图

### ER 图

```
┌─────────────────┐         ┌──────────────────┐
│     {{entity1}}      │         │    {{entity2}}       │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ name            │◄────────│ {{entity1}}Id (FK)  │
│ createdAt       │ 1    N  │ name             │
│ updatedAt       │         │ createdAt        │
└─────────────────┘         │ updatedAt        │
                            └──────────────────┘

┌─────────────────┐         ┌──────────────────┐
│     {{entity3}}      │         │    {{entity4}}       │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ {{entity3}}Id (FK)  │◄────────│ {{entity4}}Id (FK)  │
│ {{entity4}}Id (FK)  │ M    N  │ {{entity3}}Id (FK)  │
│ createdAt       │         │ createdAt        │
└─────────────────┘         └──────────────────┘
```

---

## 实体定义

### {{entity1}} 实体

**表名**: `{{entity1Table}}`  
**描述**: {{entity1Description}}  
**备注**: {{entity1Remark}}

#### 字段定义

| 字段名 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| id | BIGINT | - | ✅ | - | 主键，自增 |
| {{field1Name}} | {{field1Type}} | {{field1Length}} | {{field1Required}} | {{field1Default}} | {{field1Description}} |
| {{field2Name}} | {{field2Type}} | {{field2Length}} | {{field2Required}} | {{field2Default}} | {{field2Description}} |
| {{field3Name}} | {{field3Type}} | {{field3Length}} | {{field3Required}} | {{field3Default}} | {{field3Description}} |
| createdAt | DATETIME | - | ✅ | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | - | ✅ | CURRENT_TIMESTAMP | 更新时间 |
| deletedAt | DATETIME | - | ❌ | NULL | 删除时间（软删除） |

#### 约束条件

**主键**:
- `id` - 自增主键

**唯一约束**:
- `uk_{{entity1}}_{{uniqueField1}}` - {{uniqueField1Description}}
- `uk_{{entity1}}_{{uniqueField2}}` - {{uniqueField2Description}}

**外键约束**:
- `fk_{{entity1}}_{{fkField1}}` - 关联 {{fkEntity1}} 表

**检查约束**:
- `ck_{{entity1}}_{{checkField1}}` - {{checkField1Description}}

#### 索引

| 索引名 | 字段 | 类型 | 说明 |
|--------|------|------|------|
| `pk_{{entity1}}_id` | id | PRIMARY | 主键索引 |
| `idx_{{entity1}}_{{indexField1}}` | {{indexField1}} | NORMAL | {{indexField1Description}} |
| `idx_{{entity1}}_{{indexField2}}` | {{indexField2}} | NORMAL | {{indexField2Description}} |

#### 建表语句

```sql
CREATE TABLE {{entity1Table}} (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  {{field1Name}} {{field1Type}}({{field1Length}}) {{field1Nullable}} COMMENT '{{field1Description}}',
  {{field2Name}} {{field2Type}}({{field2Length}}) {{field2Nullable}} COMMENT '{{field2Description}}',
  {{field3Name}} {{field3Type}} {{field3Nullable}} COMMENT '{{field3Description}}',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deletedAt DATETIME NULL COMMENT '删除时间',
  
  UNIQUE KEY uk_{{entity1}}_{{uniqueField1}} ({{uniqueField1}}),
  KEY idx_{{entity1}}_{{indexField1}} ({{indexField1}}),
  KEY idx_{{entity1}}_{{indexField2}} ({{indexField2}})
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='{{entity1Description}}';
```

---

### {{entity2}} 实体

**表名**: `{{entity2Table}}`  
**描述**: {{entity2Description}}  
**备注**: {{entity2Remark}}

#### 字段定义

| 字段名 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| id | BIGINT | - | ✅ | - | 主键，自增 |
| {{entity1}}Id | BIGINT | - | ✅ | - | 关联 {{entity1}} 的 ID |
| {{field1Name}} | {{field1Type}} | {{field1Length}} | {{field1Required}} | {{field1Default}} | {{field1Description}} |
| {{field2Name}} | {{field2Type}} | {{field2Length}} | {{field2Required}} | {{field2Default}} | {{field2Description}} |
| createdAt | DATETIME | - | ✅ | CURRENT_TIMESTAMP | 创建时间 |
| updatedAt | DATETIME | - | ✅ | CURRENT_TIMESTAMP | 更新时间 |

#### 约束条件

**主键**:
- `id` - 自增主键

**外键约束**:
- `fk_{{entity2}}_{{entity1}}` - 关联 {{entity1}} 表

---

## 枚举类型

### {{enum1Name}}

**描述**: {{enum1Description}}

| 值 | 名称 | 说明 |
|----|------|------|
| {{enum1Value1}} | {{enum1Label1}} | {{enum1Desc1}} |
| {{enum1Value2}} | {{enum1Label2}} | {{enum1Desc2}} |
| {{enum1Value3}} | {{enum1Label3}} | {{enum1Desc3}} |

**数据库实现**:
```sql
ALTER TABLE {{entity1Table}} 
MODIFY COLUMN {{enum1Field}} ENUM('{{enum1Value1}}', '{{enum1Value2}}', '{{enum1Value3}}') 
COMMENT '{{enum1Description}}';
```

### {{enum2Name}}

**描述**: {{enum2Description}}

| 值 | 名称 | 说明 |
|----|------|------|
| {{enum2Value1}} | {{enum2Label1}} | {{enum2Desc1}} |
| {{enum2Value2}} | {{enum2Label2}} | {{enum2Desc2}} |

---

## 关联关系

### 一对多关系

**{{entity1}} ← {{entity2}}**

- {{entity1}} 可以有多个 {{entity2}}
- {{entity2}} 只能属于一个 {{entity1}}
- 外键字段: `{{entity2Table}}.{{entity1}}Id`
- 级联删除: {{cascadeDelete}}
- 级联更新: {{cascadeUpdate}}

**关联查询示例**:
```sql
SELECT e1.*, e2.* 
FROM {{entity1Table}} e1
LEFT JOIN {{entity2Table}} e2 ON e1.id = e2.{{entity1}}Id
WHERE e1.id = ?;
```

### 多对多关系

**{{entity3}} ↔ {{entity4}}**

- {{entity3}} 可以关联多个 {{entity4}}
- {{entity4}} 可以关联多个 {{entity3}}
- 中间表: `{{entity3}}{{entity4}}`
- 外键字段: `{{entity3}}Id`, `{{entity4}}Id`

**中间表定义**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | BIGINT | ✅ | 主键 |
| {{entity3}}Id | BIGINT | ✅ | {{entity3}} ID |
| {{entity4}}Id | BIGINT | ✅ | {{entity4}} ID |
| createdAt | DATETIME | ✅ | 创建时间 |

**关联查询示例**:
```sql
SELECT e3.*, e4.* 
FROM {{entity3Table}} e3
INNER JOIN {{entity3}}{{entity4}} rel ON e3.id = rel.{{entity3}}Id
INNER JOIN {{entity4Table}} e4 ON rel.{{entity4}}Id = e4.id
WHERE e3.id = ?;
```

---

## 验证规则

### {{entity1}} 验证规则

| 字段 | 规则 | 错误信息 |
|------|------|---------|
| {{field1Name}} | {{field1Validation}} | {{field1ErrorMsg}} |
| {{field2Name}} | {{field2Validation}} | {{field2ErrorMsg}} |
| {{field3Name}} | {{field3Validation}} | {{field3ErrorMsg}} |

**业务规则**:
- {{businessRule1}}
- {{businessRule2}}
- {{businessRule3}}

### {{entity2}} 验证规则

| 字段 | 规则 | 错误信息 |
|------|------|---------|
| {{field1Name}} | {{field1Validation}} | {{field1ErrorMsg}} |
| {{field2Name}} | {{field2Validation}} | {{field2ErrorMsg}} |

**业务规则**:
- {{businessRule1}}
- {{businessRule2}}

---

## 索引设计

### 查询性能优化

**常见查询**:

1. **按 ID 查询**
   ```sql
   SELECT * FROM {{entity1Table}} WHERE id = ?;
   ```
   - 索引: `pk_{{entity1}}_id` (PRIMARY)
   - 预期: 1 行

2. **按 {{indexField1}} 查询**
   ```sql
   SELECT * FROM {{entity1Table}} WHERE {{indexField1}} = ? ORDER BY createdAt DESC;
   ```
   - 索引: `idx_{{entity1}}_{{indexField1}}`
   - 预期: 多行

3. **分页查询**
   ```sql
   SELECT * FROM {{entity1Table}} 
   WHERE {{indexField1}} = ? 
   ORDER BY createdAt DESC 
   LIMIT ?, ?;
   ```
   - 索引: `idx_{{entity1}}_{{indexField1}}_createdAt`
   - 预期: 高效

### 索引统计

| 表名 | 索引数 | 主键 | 唯一索引 | 普通索引 |
|------|--------|------|---------|---------|
| {{entity1Table}} | {{entity1IndexCount}} | 1 | {{entity1UniqueCount}} | {{entity1NormalCount}} |
| {{entity2Table}} | {{entity2IndexCount}} | 1 | {{entity2UniqueCount}} | {{entity2NormalCount}} |

---

## 附录

### A. 数据字典

| 表名 | 字段数 | 行数估计 | 存储大小 |
|------|--------|---------|---------|
| {{entity1Table}} | {{entity1FieldCount}} | {{entity1RowCount}} | {{entity1Size}} |
| {{entity2Table}} | {{entity2FieldCount}} | {{entity2RowCount}} | {{entity2Size}} |

### B. 变更历史

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|---------|
| {{version1}} | {{version1Date}} | {{version1Author}} | {{version1Changes}} |
| {{version2}} | {{version2Date}} | {{version2Author}} | {{version2Changes}} |

---

**审批状态**: ⏳ 待审批  
**最后审批人**: -  
**审批日期**: -
