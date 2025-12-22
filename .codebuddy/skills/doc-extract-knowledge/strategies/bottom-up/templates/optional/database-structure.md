# 数据库结构

> **项目**: {{PROJECT_NAME}}  
> **数据库**: {{DB_TYPE}} {{DB_VERSION}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📊 表统计

| 表名 | 说明 | 字段数 | 索引数 | 关联表 |
|------|------|:------:|:------:|--------|
| `{{TABLE_NAME}}` | {{TABLE_DESC}} | {{FIELD_COUNT}} | {{INDEX_COUNT}} | {{RELATED_TABLES}} |

---

## 📋 表结构详情

### {{TABLE_NAME}} - {{TABLE_DESC}}

**对应实体**: `{{ENTITY_CLASS}}`

**字段列表**:
| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `{{COLUMN_NAME}}` | {{COLUMN_TYPE}} | {{CONSTRAINTS}} | {{DEFAULT_VALUE}} | {{COLUMN_DESC}} |

**索引列表**:
| 索引名 | 类型 | 字段 | 说明 |
|--------|------|------|------|
| `{{INDEX_NAME}}` | {{INDEX_TYPE}} | `{{INDEX_COLUMNS}}` | {{INDEX_DESC}} |

**DDL（完整建表语句）**:
```sql
-- ============================================================
-- 表名: {{TABLE_NAME}}
-- 描述: {{TABLE_DESC}}
-- 创建时间: {{CREATE_DATE}}
-- ============================================================
DROP TABLE IF EXISTS `{{TABLE_NAME}}`;
CREATE TABLE `{{TABLE_NAME}}` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `{{COLUMN_NAME}}` {{COLUMN_TYPE}} {{CONSTRAINTS}} COMMENT '{{COLUMN_DESC}}',
  `{{COLUMN_NAME_2}}` {{COLUMN_TYPE_2}} {{CONSTRAINTS_2}} COMMENT '{{COLUMN_DESC_2}}',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态: 0-禁用, 1-启用',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '逻辑删除: 0-未删除, 1-已删除',
  `create_by` varchar(64) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  {{INDEX_DEFINITIONS}}
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='{{TABLE_DESC}}';

-- 初始化数据（如有）
INSERT INTO `{{TABLE_NAME}}` (`{{COLUMN_NAME}}`, `status`) VALUES 
('{{INIT_VALUE_1}}', 1),
('{{INIT_VALUE_2}}', 1);
```

---

### {{TABLE_NAME_2}} - {{TABLE_DESC_2}}

**对应实体**: `{{ENTITY_CLASS}}`

**字段列表**:
| 字段 | 类型 | 约束 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | BIGINT | PK, AUTO_INCREMENT | - | 主键 |
| `{{FK_COLUMN}}` | BIGINT | NOT NULL, FK | - | 外键关联 {{RELATED_TABLE}} |
| `status` | TINYINT | NOT NULL | 0 | 状态 |
| `create_time` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| `update_time` | DATETIME | - | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引列表**:
| 索引名 | 类型 | 字段 | 说明 |
|--------|------|------|------|
| `PRIMARY` | PRIMARY KEY | `id` | 主键索引 |
| `idx_{{FK_COLUMN}}` | INDEX | `{{FK_COLUMN}}` | 外键索引 |
| `idx_status_create_time` | INDEX | `status, create_time` | 复合索引 |

---

## 🔗 表关系

### ER 图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ER Diagram                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐     │
│   │  {{TABLE_1}}  │         │  {{TABLE_2}}  │         │  {{TABLE_3}}  │     │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤     │
│   │ PK id         │───┐     │ PK id         │───┐     │ PK id         │     │
│   │    name       │   │     │ FK {{FK_1}}   │←──┘     │ FK {{FK_2}}   │←────┤
│   │    status     │   │     │    amount     │         │    type       │     │
│   │    create_time│   │     │    status     │         │    content    │     │
│   └───────────────┘   │     │    create_time│         │    create_time│     │
│                       │     └───────────────┘         └───────────────┘     │
│                       │              │                                       │
│                       │              │ 1:N                                   │
│                       │              ↓                                       │
│                       │     ┌───────────────┐                               │
│                       │     │  {{TABLE_4}}  │                               │
│                       │     ├───────────────┤                               │
│                       └────→│ PK id         │                               │
│                             │ FK {{FK_3}}   │                               │
│                             │    detail     │                               │
│                             └───────────────┘                               │
│                                                                              │
│   图例: PK=主键, FK=外键, ───→ 一对多关系, ←──→ 多对多关系                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 关系说明

| 主表 | 从表 | 关系类型 | 关联字段 | 说明 |
|------|------|----------|----------|------|
| {{TABLE_1}} | {{TABLE_2}} | 一对多 | `{{TABLE_1}}.id = {{TABLE_2}}.{{FK_COLUMN}}` | {{RELATION_DESC}} |
| {{TABLE_2}} | {{TABLE_4}} | 一对多 | `{{TABLE_2}}.id = {{TABLE_4}}.{{FK_COLUMN}}` | {{RELATION_DESC}} |

### 外键约束

```sql
-- {{TABLE_2}} 外键约束
ALTER TABLE `{{TABLE_2}}` 
ADD CONSTRAINT `fk_{{TABLE_2}}_{{TABLE_1}}` 
FOREIGN KEY (`{{FK_COLUMN}}`) REFERENCES `{{TABLE_1}}` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- {{TABLE_4}} 外键约束
ALTER TABLE `{{TABLE_4}}` 
ADD CONSTRAINT `fk_{{TABLE_4}}_{{TABLE_2}}` 
FOREIGN KEY (`{{FK_COLUMN}}`) REFERENCES `{{TABLE_2}}` (`id`) 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## 📝 常用查询

### {{QUERY_NAME}}
```sql
-- {{QUERY_DESC}}
SELECT {{COLUMNS}}
FROM {{TABLE_NAME}} t
{{JOIN_CLAUSE}}
WHERE {{CONDITIONS}}
ORDER BY {{ORDER_BY}}
LIMIT {{LIMIT}};
```

**对应 Mapper 方法**:
```java
List<{{ENTITY}}> {{MAPPER_METHOD}}(
    @Param("{{PARAM_1}}") {{PARAM_TYPE_1}} {{PARAM_1}},
    @Param("{{PARAM_2}}") {{PARAM_TYPE_2}} {{PARAM_2}}
);
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
