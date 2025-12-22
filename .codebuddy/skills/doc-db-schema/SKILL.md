---
name: doc-db-schema
description: 基于 MySQL 数据库自动生成完整的表结构文档，包含字段定义、索引、约束、注释和 DDL 语句。适用于数据库文档化、代码评审、团队协作和知识沉淀。
category: documentation
keywords: [Schema文档, ER图, 数据库设计文档, 表关系, 索引说明]
---

# Skill: 生成数据库表结构文档

> 📚 **项目记忆引用**
> - 遵循 [项目宪章](mdc:.spec-code/memory/constitution.md) 的核心原则
> - 参考 [开发指南](mdc:.spec-code/memory/guidelines.md) 的 Skill 编写规范
> - 了解 [项目上下文](mdc:.spec-code/memory/context.md) 的技术栈

基于 **MySQL** 数据库自动生成完整的表结构文档，包含字段定义、索引、约束、注释和 DDL 语句。

## 🎯 目标

解决软件研发中的 **数据库文档缺失或过时** 问题，自动从现有数据库提取表结构信息，生成规范化的文档。

**适用场景**:
- 数据库文档化 - 为现有数据库生成完整文档
- 代码评审 - 提供准确的数据库结构参考
- 团队协作 - 统一数据库设计认知
- 知识沉淀 - 保留数据库设计历史
- 新人培训 - 快速了解数据库设计

**技术栈**:
- MySQL 数据库（推荐 8.0+）
- 支持多种实现方式：Python/Node.js/Java/命令行工具
- Markdown 文档格式

## 📚 技术栈参考

本技能基于以下技术栈文档（**必需章节**）：
- [MySQL 9.5.0](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) - 数据库核心文档
- [数据库字段规范指南](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md) - 标准字段定义
- [数据库索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md) - 索引设计规范

参考 [技术栈索引](mdc:.codebuddy/spec/global/knowledge/stack/index.md) 了解架构建议。

## 📋 前置条件

- [ ] MySQL 数据库已部署（版本 >= 5.7，推荐 8.0+）
- [ ] 拥有数据库读权限（需要访问 `information_schema`）
- [ ] 数据库表已创建完成
- [ ] 已了解基本的 SQL 查询语法

**技术要求**:
- MySQL 版本 >= 5.7（推荐 8.0+）
- 具备 `SHOW TABLES`、`SHOW CREATE TABLE`、`SELECT` 权限
- 可访问 `information_schema.TABLES`、`information_schema.COLUMNS`、`information_schema.STATISTICS`

**连接信息准备**:
```bash
# 需要提供的数据库连接信息
数据库主机: localhost 或远程 IP
端口: 3306（默认）
数据库名: your_database_name
用户名: your_username
密码: your_password
```

## 🔄 执行步骤

### 步骤 1: 连接数据库并验证权限

**目标**: 建立到 MySQL 数据库的连接，验证用户权限。

**操作**:
1. 使用 MySQL Client 或编程语言连接数据库
2. 验证用户是否具备必要的查询权限
3. 确认可以访问 `information_schema` 系统库

**技术要点**:
- 遵循 [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) 的连接管理最佳实践
- 使用 `charset='utf8mb4'` 确保支持完整的 Unicode 字符集
- 验证权限确保可以访问 `information_schema`

**实现示例**（Python）:
```python
import mysql.connector
from mysql.connector import Error

def connect_to_database(host, port, database, user, password):
    """连接到 MySQL 数据库并验证权限"""
    try:
        connection = mysql.connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            charset='utf8mb4',
            use_unicode=True
        )
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"Successfully connected to MySQL Server version {db_info}")
            
            # 验证权限
            cursor = connection.cursor()
            cursor.execute("SHOW GRANTS FOR CURRENT_USER")
            grants = cursor.fetchall()
            print(f"Current user grants: {grants}")
            
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None
```

**常见错误处理**:
- 连接被拒绝 → 检查连接参数，确认数据库服务正在运行
- 权限不足 → 联系 DBA 授予 SELECT 权限
- 字符集问题 → 添加 `charset='utf8mb4'` 参数

### 步骤 2: 提取数据库表列表

**目标**: 查询数据库中的所有表，获取表的基本信息（表名、注释、创建时间、数据量）。

**操作**:
1. 查询 `information_schema.TABLES` 获取表列表
2. 提取表名、表注释、存储引擎、创建时间、数据行数
3. 按表名排序

**核心 SQL**:
```sql
SELECT 
    TABLE_NAME as table_name,
    TABLE_COMMENT as table_comment,
    ENGINE as engine,
    CREATE_TIME as create_time,
    TABLE_ROWS as table_rows,
    DATA_LENGTH as data_length,
    INDEX_LENGTH as index_length
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'your_database'
    AND TABLE_TYPE = 'BASE TABLE'
ORDER BY 
    TABLE_NAME ASC
```

**技术要点**:
- 过滤 `TABLE_TYPE = 'BASE TABLE'` 排除视图和系统表
- 按表名排序，确保文档有序
- 获取数据行数和存储大小，便于了解表规模

### 步骤 3: 提取表字段信息

**目标**: 查询每个表的字段定义，包括字段名、类型、长度、是否可空、默认值、注释。

**操作**:
1. 查询 `information_schema.COLUMNS` 获取字段信息
2. 提取字段名、数据类型、长度、精度、是否可空、默认值、注释、字符集
3. 按字段顺序排序

**核心 SQL**:
```sql
SELECT 
    COLUMN_NAME as column_name,
    DATA_TYPE as data_type,
    COLUMN_TYPE as column_type,
    IS_NULLABLE as is_nullable,
    COLUMN_DEFAULT as column_default,
    COLUMN_COMMENT as column_comment,
    COLUMN_KEY as column_key,
    EXTRA as extra,
    CHARACTER_SET_NAME as character_set,
    COLLATION_NAME as collation,
    ORDINAL_POSITION as position
FROM 
    information_schema.COLUMNS
WHERE 
    TABLE_SCHEMA = 'your_database'
    AND TABLE_NAME = 'your_table'
ORDER BY 
    ORDINAL_POSITION ASC
```

**技术要点**:
- 遵循 [数据库字段规范指南](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md) 的标准字段命名
- `COLUMN_TYPE` 包含完整类型定义（如 `VARCHAR(255)`）
- `COLUMN_KEY` 标识主键（PRI）、唯一键（UNI）、索引（MUL）
- `EXTRA` 包含 `auto_increment`、`on update CURRENT_TIMESTAMP` 等额外信息

### 步骤 4: 提取表索引信息

**目标**: 查询每个表的索引定义，包括索引名、类型、字段、唯一性。

**操作**:
1. 查询 `information_schema.STATISTICS` 获取索引信息
2. 提取索引名、索引类型、索引字段、是否唯一、排序方式
3. 按索引名和字段位置排序
4. 合并同一索引的多个字段

**核心 SQL**:
```sql
SELECT 
    INDEX_NAME as index_name,
    COLUMN_NAME as column_name,
    SEQ_IN_INDEX as seq_in_index,
    NON_UNIQUE as non_unique,
    INDEX_TYPE as index_type,
    INDEX_COMMENT as index_comment
FROM 
    information_schema.STATISTICS
WHERE 
    TABLE_SCHEMA = 'your_database'
    AND TABLE_NAME = 'your_table'
ORDER BY 
    INDEX_NAME, SEQ_IN_INDEX
```

**技术要点**:
- 遵循 [数据库索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md) 的索引设计规范
- 使用数据结构合并同一索引的多个字段
- `NON_UNIQUE = 0` 表示唯一索引
- `INDEX_TYPE` 常见值：`BTREE`、`HASH`、`FULLTEXT`

### 步骤 5: 提取表约束信息（可选）

**目标**: 查询每个表的约束定义，包括外键约束、唯一约束、检查约束。

**操作**:
1. 查询 `information_schema.TABLE_CONSTRAINTS` 获取约束信息
2. 查询 `information_schema.KEY_COLUMN_USAGE` 获取外键关联信息
3. 提取约束名、约束类型、关联表、关联字段

**核心 SQL**:
```sql
SELECT 
    tc.CONSTRAINT_NAME as constraint_name,
    tc.CONSTRAINT_TYPE as constraint_type,
    kcu.COLUMN_NAME as column_name,
    kcu.REFERENCED_TABLE_NAME as referenced_table,
    kcu.REFERENCED_COLUMN_NAME as referenced_column
FROM 
    information_schema.TABLE_CONSTRAINTS tc
LEFT JOIN 
    information_schema.KEY_COLUMN_USAGE kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
    AND tc.TABLE_NAME = kcu.TABLE_NAME
WHERE 
    tc.TABLE_SCHEMA = 'your_database'
    AND tc.TABLE_NAME = 'your_table'
    AND tc.CONSTRAINT_TYPE IN ('FOREIGN KEY', 'CHECK', 'UNIQUE')
ORDER BY 
    tc.CONSTRAINT_NAME
```

**技术要点**:
- 根据 [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md)，生产环境通常不使用显式外键约束
- 主键和唯一约束已在索引中体现，此处可选择性跳过

### 步骤 6: 生成表的 DDL 语句

**目标**: 获取每个表的完整 `CREATE TABLE` 语句。

**操作**:
1. 执行 `SHOW CREATE TABLE` 命令
2. 提取完整的 DDL 语句
3. 格式化 DDL 语句（可选）

**核心 SQL**:
```sql
SHOW CREATE TABLE `your_table`
```

**技术要点**:
- 使用反引号包裹表名，防止保留字冲突
- DDL 语句包含完整的表定义、字段、索引、约束、存储引擎、字符集
- DDL 语句可以直接用于重建表结构

### 步骤 7: 生成 Markdown 文档

**目标**: 将提取的表结构信息格式化为 Markdown 文档。

**操作**:
1. 创建文档结构（标题、目录、表列表）
2. 为每个表生成详细的字段表格
3. 为每个表生成索引列表
4. 为每个表生成约束列表（如适用）
5. 为每个表附加 DDL 语句
6. 生成文档元数据（生成时间、数据库信息）

**文档结构**:
```markdown
# 数据库名称 数据库表结构文档
生成时间、数据库信息

## 📋 表列表
1. [表名1](#表名1) - 表说明
2. [表名2](#表名2) - 表说明

---

## 表名1
说明、存储引擎、创建时间、数据行数

### 字段定义
| 字段名 | 类型 | 可空 | 默认值 | 键 | 额外 | 说明 |

### 索引定义
| 索引名 | 类型 | 字段 | 唯一性 | 说明 |

### 约束定义（可选）
| 约束名 | 类型 | 字段 | 关联表 | 关联字段 |

### DDL 语句
```sql
CREATE TABLE ...
```

---

## 📊 数据库统计
```

**技术要点**:
- 使用 Markdown 表格格式，便于阅读和版本控制
- 使用反引号包裹字段名和 SQL 关键字
- 生成目录链接，便于快速导航
- 添加统计信息，便于了解数据库规模

### 步骤 8: 验证文档完整性

**目标**: 验证生成的文档是否完整、准确、符合规范。

**验证项**:
1. 检查所有表是否都已包含
2. 检查字段定义是否完整
3. 检查索引定义是否正确
4. 检查 DDL 语句是否可执行
5. 检查文档格式是否规范

## 💡 最佳实践

### 1. 数据库连接管理

✅ **推荐**:
```python
# 使用上下文管理器自动关闭连接
from contextlib import closing

def generate_documentation_safe(host, port, database, user, password):
    """使用上下文管理器确保连接正确关闭"""
    with closing(connect_to_database(host, port, database, user, password)) as conn:
        if conn:
            generate_markdown_documentation(conn, database)
        else:
            print("❌ 无法连接到数据库")
```

❌ **不推荐**:
```python
# 不关闭连接，可能导致连接泄漏
conn = connect_to_database('localhost', 3306, 'your_database', 'user', 'password')
generate_markdown_documentation(conn, 'your_database')
# 忘记调用 conn.close()
```

### 2. 字符集处理

✅ **推荐**: 使用 `utf8mb4` 字符集，支持完整的 Unicode
❌ **不推荐**: 使用默认字符集，可能导致中文乱码或 Emoji 无法存储

### 3. 字段命名规范

遵循 [数据库字段规范指南](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md):
- 使用下划线命名法（snake_case）
- 包含标准字段：`id`、`create_time`、`update_time`、`create_by`、`update_by`、`enable_flag`、`delete_flag`
- 字段必须有注释说明

### 4. 索引设计规范

遵循 [数据库索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md):
- 主键使用 `PRIMARY KEY`
- 唯一索引使用 `UNIQUE KEY uk_字段名`
- 普通索引使用 `KEY idx_字段名`
- 复合索引按查询频率和选择性排序字段

### 5. 外键约束策略

遵循 [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md):
- 生产环境：不使用显式外键约束，在应用层保证数据一致性
- 开发环境：可选择性使用外键约束辅助开发

### 6. 文档生成频率

✅ **推荐**: 定期自动生成文档（如每周一次或每次数据库变更后）
❌ **不推荐**: 只在需要时手动生成，可能导致文档过时

### 7. 按模块组织表结构

- 将相关的表按业务模块分组
- 在文档中添加模块说明
- 使用表前缀标识模块（如 `sys_`、`biz_`、`log_`）

## ⚠️ 常见错误

### 错误 1: 字符集不匹配导致中文乱码

**症状**: 生成的文档中中文字段注释显示为乱码或问号。

**原因**: 连接时未指定 `utf8mb4` 字符集，或数据库/表的字符集不一致。

**解决**:
```sql
-- 检查数据库字符集
SHOW CREATE DATABASE your_database;

-- 检查表字符集
SHOW CREATE TABLE your_table;

-- 统一字符集（如需要）
ALTER DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE your_table CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 错误 2: 权限不足无法访问 information_schema

**症状**: 执行查询时报错 `SELECT command denied to user`。

**原因**: 当前用户没有访问 `information_schema` 的权限。

**解决**:
```sql
-- 授予对 information_schema 的 SELECT 权限（推荐）
GRANT SELECT ON information_schema.* TO 'your_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 验证权限
SHOW GRANTS FOR CURRENT_USER;
```

### 错误 3: 索引信息不完整

**症状**: 生成的文档中索引列表缺少复合索引的部分字段。

**原因**: 未正确合并同一索引的多个字段，导致只显示第一个字段。

**解决**: 按 `INDEX_NAME` 和 `SEQ_IN_INDEX` 排序，使用数据结构（如字典或Map）合并同一索引的多个字段。

### 错误 4: 遗漏字段说明

**症状**: 生成的文档中部分字段没有注释说明。

**原因**: 数据库表设计时未添加字段注释。

**解决**:
```sql
-- 为字段添加注释
ALTER TABLE your_table MODIFY COLUMN your_column VARCHAR(255) COMMENT '字段说明';
```

### 错误 5: 连接未关闭导致资源泄漏

**症状**: 长时间运行后出现 `Too many connections` 错误。

**原因**: 每次查询后未关闭数据库连接，导致连接池耗尽。

**解决**: 使用上下文管理器或 try-finally 确保连接正确关闭。

## ✅ 验证清单

完成后验证以下项目：

**功能验证**:
- [ ] 成功连接到数据库
- [ ] 成功提取所有表的列表
- [ ] 成功提取所有表的字段定义
- [ ] 成功提取所有表的索引信息
- [ ] 成功提取所有表的约束信息（如适用）
- [ ] 成功提取所有表的 DDL 语句
- [ ] 成功生成 Markdown 文档

**质量验证**:
- [ ] 文档包含所有表（无遗漏）
- [ ] 字段定义完整（字段名、类型、注释、默认值、约束）
- [ ] 索引定义正确（索引名、类型、字段、唯一性）
- [ ] DDL 语句可执行（复制到 MySQL 可直接运行）
- [ ] 中文注释无乱码（使用 utf8mb4 字符集）
- [ ] Markdown 格式正确（表格、代码块、标题）

**技术栈验证**:
- [ ] 遵循 [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) 的连接管理最佳实践
- [ ] 遵循 [数据库字段规范指南](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md) 的字段命名规范
- [ ] 遵循 [数据库索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md) 的索引设计规范
- [ ] 遵循 [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md) 的外键约束策略

**性能验证**:
- [ ] 文档生成时间合理（< 1 分钟，视表数量而定）
- [ ] 数据库连接正确关闭（无连接泄漏）
- [ ] 内存使用合理（< 100MB，视数据库规模而定）

## 📚 可重用资源

### 脚本
- `scripts/generate_db_schema.py` - Python 实现的自动生成脚本
- `scripts/generate_db_schema.js` - Node.js 实现的自动生成脚本
- `scripts/generate_db_schema.sh` - Shell 脚本实现

### 参考文档
- `reference.md` - MySQL 查询语句参考和文档模板说明

### 模板
- `templates/database-schema-template.md` - 数据库表结构文档模板

## 🔗 相关技能

- [gen-db-design](mdc:skills/gen-db-design/SKILL.md) - 生成数据库设计文档（从需求出发设计）
- [doc-api-list](mdc:skills/doc-api-list/SKILL.md) - 生成 API 接口列表文档
- [doc-services-list](mdc:skills/doc-services-list/SKILL.md) - 生成后台服务列表文档
- [doc-git-list](mdc:skills/doc-git-list/SKILL.md) - 生成代码库索引文档

## 📖 输出示例

### 完整的数据库表结构文档示例

```markdown
# your_database 数据库表结构文档

**生成时间**: 2025-11-10 14:30:00
**数据库名称**: your_database
**表数量**: 5

---

## 📋 表列表

1. [sys_user](#sys_user) - 系统用户表
2. [sys_role](#sys_role) - 系统角色表
3. [sys_permission](#sys_permission) - 系统权限表
4. [sys_user_role](#sys_user_role) - 用户角色关联表
5. [sys_role_permission](#sys_role_permission) - 角色权限关联表

---

## sys_user

**说明**: 系统用户表

**存储引擎**: InnoDB
**创建时间**: 2025-10-01 10:00:00
**数据行数**: 1,234

### 字段定义

| 字段名 | 类型 | 可空 | 默认值 | 键 | 额外 | 说明 |
|--------|------|------|--------|-----|------|------|
| `id` | bigint | 否 | - | PRI | auto_increment | 用户ID |
| `username` | varchar(64) | 否 | - | UNI | - | 用户名 |
| `password` | varchar(128) | 否 | - | - | - | 密码（加密） |
| `email` | varchar(128) | 是 | NULL | MUL | - | 邮箱 |
| `phone` | varchar(32) | 是 | NULL | MUL | - | 手机号 |
| `enable_flag` | tinyint | 否 | 1 | - | - | 启用标识（1-启用 0-停用） |
| `delete_flag` | tinyint | 否 | 0 | - | - | 删除标识（0-未删除 1-已删除） |
| `create_time` | datetime | 否 | CURRENT_TIMESTAMP | - | - | 创建时间 |
| `update_time` | datetime | 否 | CURRENT_TIMESTAMP | - | on update CURRENT_TIMESTAMP | 更新时间 |
| `create_by` | varchar(64) | 是 | NULL | - | - | 创建人 |
| `update_by` | varchar(64) | 是 | NULL | - | - | 更新人 |

### 索引定义

| 索引名 | 类型 | 字段 | 唯一性 | 说明 |
|--------|------|------|--------|------|
| PRIMARY | BTREE | `id` | 是 | - |
| uk_username | BTREE | `username` | 是 | - |
| idx_email | BTREE | `email` | 否 | - |
| idx_phone | BTREE | `phone` | 否 | - |

### DDL 语句

```sql
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(128) NOT NULL COMMENT '密码（加密）',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(32) DEFAULT NULL COMMENT '手机号',
  `enable_flag` tinyint NOT NULL DEFAULT '1' COMMENT '启用标识（1-启用 0-停用）',
  `delete_flag` tinyint NOT NULL DEFAULT '0' COMMENT '删除标识（0-未删除 1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_by` varchar(64) DEFAULT NULL COMMENT '创建人',
  `update_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=1235 DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';
```

---

## 📊 数据库统计

- **总表数**: 5
- **总数据行数**: 10,567
- **总数据大小**: 2.34 MB
- **总索引大小**: 0.78 MB
```

## 🎓 学习建议

### 新手路径
1. 阅读 [MySQL 文档](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md) 了解基本查询
2. 学习 `information_schema` 系统库的结构
3. 实践提取单个表的字段信息
4. 实践提取单个表的索引信息
5. 实践生成完整的表结构文档

### 进阶路径
1. 学习 [数据库字段规范指南](mdc:.codebuddy/spec/global/standards/backend/common/database-fields.md)
2. 学习 [数据库索引设计指南](mdc:.codebuddy/spec/global/standards/backend/common/index-design-guide.md)
3. 学习 [设计决策框架](mdc:.codebuddy/spec/global/standards/backend/common/design-decisions.md)
4. 实践自动化脚本和定期生成
5. 集成到 CI/CD 流程

---

**版本**: 3.0.0  
**最后更新**: 2025-11-10  
**作者**: Spec-Code Team  
**许可证**: 遵循项目许可证
