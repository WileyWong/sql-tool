---
name: db-mysql-run
description: 通过 MCP 执行 MySQL SQL 脚本或语句。触发词：执行SQL、建表脚本、初始化数据库。必须先检查MCP连接，然后预览、安全检查、用户确认后执行。
category: database
keywords: [MySQL, SQL执行, MCP工具, 数据库脚本, 安全检查]
---

# MySQL 数据库脚本执行

通过 MCP 工具执行 MySQL SQL 脚本或单条语句，提供安全检查、预览和回滚支持。

## 🎯 目标

使用 MCP `execute_sql` 工具安全执行 SQL 操作：
- 读取脚本文件或接收用户输入的 SQL
- 预览操作内容和风险评估
- 执行 SQL 并记录完整日志
- 生成回滚脚本供失败恢复

## 📋 前置条件

- [ ] 已有 SQL 脚本文件或明确的 SQL 语句
- [ ] MCP 服务器已配置（如 `校招mysql`）
- [ ] 已确认目标数据库

## 🔄 执行步骤

### 步骤 0: 检查 MCP 连接（最高优先级）

**必须首先执行此检查**，否则停止流程。

调用工具检查 MCP 可用性：
```python
mcp_tools = mcp_get_tool_description(
    toolRequests='[["校招mysql", "execute_sql"]]'
)
```

**如果返回 None 或空列表**，显示以下指南后停止：

```markdown
❌ **MCP 未配置**

需要 MySQL MCP 服务器支持。参考配置：

**服务器名**: 校招mysql (可自定义)

**配置文件示例**:
```json
{
  "mcpServers": {
    "校招mysql": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-mysql"],
      "env": {
        "MYSQL_HOST": "your_host",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "your_user",
        "MYSQL_PASSWORD": "your_password",
        "MYSQL_DATABASE": "your_database"
      }
    }
  }
}
```

**安装步骤**:
1. 运行: `npm install -g @modelcontextprotocol/server-mysql`
2. 在 IDE MCP 配置中添加上述内容
3. 修改 env 中的连接参数
4. 重启 IDE 或重新加载配置
5. 再次尝试
```

配置完成后停止执行。

**如果检查通过**，继续下一步。

### 步骤 1: 读取或接收 SQL

根据用户请求获取 SQL：

**场景 A - 脚本文件**:
```python
read_file(filePath="workspace/CR-1001/design/db-design.sql")
```

**场景 B - 用户直接提供 SQL**:
直接使用用户消息中的 SQL 语句。

### 步骤 2: 解析并预览

提取关键信息并分类：
- 按 `;` 分割语句（忽略注释）
- 识别操作类型：CREATE/ALTER/DROP/INSERT/UPDATE/DELETE
- 提取表名和影响范围

显示预览：
```markdown
## SQL 预览

**来源**: [脚本路径 或 "用户输入"]
**目标数据库**: student
**语句数**: N

### 操作摘要
- 创建表: X 个
- 修改表: Y 个  
- 删除表: Z 个
- 其他: ...

**风险等级**: [低/中/高]
```

### 步骤 3: 安全检查

检测危险模式：

| 模式 | 风险 | 处理 |
|------|------|------|
| DROP DATABASE | ❌ 极高 | 拒绝执行 |
| DELETE...无WHERE | ❌ 高 | 要求添加条件 |
| DROP TABLE | ⚠️ 中 | 高亮警告 |
| TRUNCATE | ⚠️ 中 | 高亮警告 |
| CREATE/ALTER | ✅ 低 | 正常执行 |

如检测到高风险操作，显示警告并要求二次确认。

### 步骤 4: 用户确认

显示执行摘要并等待确认：
```markdown
**确认执行？** [yes/no]
- 数据库: student  
- 操作: [具体操作]
- 影响: [预计影响范围]
```

### 步骤 5: 执行 SQL

用户确认后，逐条执行：

```python
for idx, stmt in enumerate(statements, 1):
    result = mcp_call_tool(
        serverName="校招mysql",
        toolName="execute_sql",
        arguments=f'{{"query": "{stmt}"}}'
    )
    
    if result.get('isError'):
        # 失败处理：询问 skip/stop/rollback
        handle_error(result, executed_statements)
    else:
        # 成功：记录并继续
        executed_statements.append(stmt)
```

**实时显示进度**:
```
[N/总数] [操作类型] ... ✅/❌
```

**失败时提供选项**:
- skip: 跳过继续
- stop: 停止执行
- rollback: 回滚已执行部分

### 步骤 6: 生成报告和回滚脚本

执行完成后生成：

**执行报告**:
```markdown
## ✅ 执行完成

**时间**: [时间戳]
**数据库**: student
**结果**: 成功 X / 失败 Y / 总计 Z

[详细统计]
```

**回滚脚本** (逆序):
```sql
-- 自动生成回滚语句
DROP TABLE IF EXISTS `table_3`;
DROP TABLE IF EXISTS `table_2`;
DROP TABLE IF EXISTS `table_1`;
```

保存到: `workspace/{变更ID}/rollback-{时间戳}.sql`

### 步骤 7: 记录日志

将完整执行记录写入日志文件：
```python
write_to_file(
    filePath=f"workspace/{变更ID}/db-execute-{时间戳}.log",
    content=log_content  # 包含所有语句和结果
)
```

### 步骤 8: 验证建议

提供验证命令：
```sql
SHOW TABLES LIKE 'pattern%';
DESC table_name;
SHOW INDEX FROM table_name;
```

## 🔧 关键决策

### 风险级别与处理策略

| 操作 | 风险 | 策略 |
|------|------|------|
| CREATE TABLE/INDEX | 低 | 预览后执行 |
| ALTER TABLE | 中 | 警告后执行 |
| DROP TABLE | 高 | 高亮警告+二次确认 |
| DELETE 有WHERE | 中 | 警告后执行 |
| DELETE 无WHERE | 极高 | 拒绝+建议添加条件 |
| DROP DATABASE | 极高 | 直接拒绝 |
| TRUNCATE TABLE | 高 | 高亮警告+二次确认 |

### 错误处理指南

**常见错误自动识别**:
- `Table already exists` → 询问: skip/replace
- `Foreign key constraint` → 提示: 先创建父表
- `Access denied` → 提示: 权限不足，联系 DBA

### 大脚本优化

语句数 > 100 时:
1. 提示分批执行建议
2. 询问用户是否分批
3. 若分批，每批 50 条，显示批次进度

## 💡 使用示例

查看 [examples.md](examples.md) 获取完整示例。

## 📝 相关技能

- `design-db` - 数据库设计与 SQL 生成
- `doc-db-schema` - 数据库文档生成  
- `design-api` - 基于表结构设计 API
