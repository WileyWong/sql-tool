# db-mysql-run 使用示例

## 示例 0: MCP 连接检查

### 场景 A - 未配置 MCP

**用户**: 
```
帮我执行 workspace/design.sql
```

**AI**:
```markdown
❌ **MCP 未配置**

需要 MySQL MCP 服务器支持。参考配置：

**服务器名**: 校招mysql (可自定义)

**配置文件示例**:
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

**安装步骤**:
1. 运行: npm install -g @modelcontextprotocol/server-mysql
2. 在 IDE MCP 配置中添加上述内容
3. 修改 env 中的连接参数
4. 重启 IDE
5. 再次尝试
```

**停止执行，等待用户配置。**

---

### 场景 B - 已配置 MCP

**用户**: 
```
帮我执行 workspace/design.sql
```

**AI**: 继续正常执行流程（见下面示例）

---

## 示例 1: 执行建表脚本

**用户**:
```
执行 workspace/CR-1001/design/db-schema.sql
```

**AI**:

### 步骤 1: 读取并预览
```markdown
## SQL 预览

**来源**: workspace/CR-1001/design/db-schema.sql
**目标数据库**: student
**语句数**: 8

### 操作摘要
- 创建表: 3 个 (c_user_info, c_order_main, c_order_item)
- 创建索引: 5 个
- 其他: 0

**风险等级**: ✅ 低

**确认执行？** [yes/no]
```

### 步骤 2: 执行
**用户**: yes

```
正在执行...

[1/8] CREATE TABLE c_user_info ... ✅
[2/8] CREATE TABLE c_order_main ... ✅
[3/8] CREATE TABLE c_order_item ... ✅
[4/8] CREATE INDEX idx_user_mobile ... ✅
[5/8] CREATE INDEX idx_user_status ... ✅
[6/8] CREATE INDEX idx_order_user ... ✅
[7/8] CREATE INDEX idx_order_time ... ✅
[8/8] CREATE INDEX idx_item_order ... ✅

✅ 全部完成！
```

### 步骤 3: 报告
```markdown
## ✅ 执行完成

**时间**: 2025-01-11 14:30:25
**结果**: 成功 8 / 失败 0 / 总计 8
**耗时**: 约 0.8s

### 创建的表
1. c_user_info - 用户信息表 (10 字段, 4 索引)
2. c_order_main - 订单主表 (12 字段, 5 索引)
3. c_order_item - 订单明细表 (8 字段, 3 索引)

### 回滚脚本
已保存到: workspace/CR-1001/rollback-20250111_143025.sql

```sql
DROP TABLE IF EXISTS c_order_item;
DROP TABLE IF EXISTS c_order_main;
DROP TABLE IF EXISTS c_user_info;
```

### 验证建议
SHOW TABLES LIKE 'c_%';
DESC c_user_info;
SHOW INDEX FROM c_user_info;
```

---

## 示例 2: 执行单条 SQL

**用户**:
```
CREATE TABLE test_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  mobile VARCHAR(15)
)
```

**AI**:
```markdown
## SQL 预览

**来源**: 用户输入
**操作**: CREATE TABLE
**表名**: test_users
**风险**: ✅ 低

**确认执行？** [yes/no]
```

**用户**: yes

```
✅ 执行成功！

表 test_users 已创建。

回滚: DROP TABLE IF EXISTS test_users;
```

---

## 示例 3: 执行失败处理

**用户**:
```
执行 workspace/migration.sql
```

**AI**:
```
正在执行...

[1/3] CREATE TABLE products ... ✅
[2/3] ALTER TABLE products ADD CONSTRAINT fk_category ... ❌

错误: Foreign key constraint incorrectly formed
原因: 表 categories 不存在

处理选项:
1. skip - 跳过此语句，继续执行
2. stop - 停止执行
3. rollback - 回滚已执行部分

你的选择: [skip/stop/rollback]
```

**用户**: rollback

```
正在回滚...

DROP TABLE IF EXISTS products;

✅ 回滚完成

建议:
1. 先创建 categories 表
2. 或添加 category_id 字段到 products 表
3. 修改后重新执行
```

---

## 示例 4: 查询数据库

**用户**:
```
student 数据库有哪些表？
```

**AI**:
```
[执行] SHOW TABLES;

结果: 374 个表

主要分类:
- 招聘相关 (post_*)
- 简历相关 (s_resume_*, c_resume_*)
- 面试相关 (s_interview_*)
- Offer 相关 (s_offer_*, c_offer_*)
```

---

## 示例 5: 危险操作警告

**用户**:
```
DROP TABLE c_old_test
```

**AI**:
```markdown
⚠️ **危险操作警告**

**操作**: DROP TABLE
**表名**: c_old_test
**风险**: ⚠️ 高

**影响**:
- 将永久删除表 c_old_test
- 所有数据将丢失
- 不可撤销

**建议**:
1. 确认表可以安全删除
2. 备份重要数据
3. 在测试环境验证

**仍要继续？** [yes/no]
```

**用户**: yes

```
✅ 执行成功

表 c_old_test 已删除。

注意: 无法自动生成回滚脚本（表结构未保存）
如需恢复，请联系 DBA 从备份恢复。
```

---

## 示例 6: DELETE 无 WHERE

**用户**:
```
DELETE FROM c_temp_data
```

**AI**:
```markdown
❌ **拒绝执行**

检测到无条件 DELETE 语句，这将删除表中所有数据。

**建议**:
1. 添加 WHERE 条件限定范围
2. 或使用 TRUNCATE TABLE（需再次确认）

**修改示例**:
DELETE FROM c_temp_data WHERE create_time < '2024-01-01';
```

---

## 示例 7: 大脚本分批执行

**用户**:
```
执行 workspace/init/insert-1000-records.sql
```

**AI**:
```markdown
## 大脚本检测

**语句数**: 1000
**建议**: 分批执行（每批 50 条）

**原因**:
- 避免执行超时
- 更好的进度显示
- 失败时易定位

**是否分批？** [yes/no]
```

**用户**: yes

```
=== 批次 1/20 (1-50) ===
[1/50] INSERT ... ✅
...
[50/50] INSERT ... ✅
批次 1 完成 (2.1s)

=== 批次 2/20 (51-100) ===
...

✅ 全部完成！
总计: 1000 成功 / 0 失败
总耗时: 42.5s
```

---

## MCP 工具调用示例

### 检查连接
```python
mcp_tools = mcp_get_tool_description(
    toolRequests='[["校招mysql", "execute_sql"]]'
)

if mcp_tools is None:
    # 显示安装指南
    return
```

### 执行 SQL
```python
result = mcp_call_tool(
    serverName="校招mysql",
    toolName="execute_sql",
    arguments='{"query": "CREATE TABLE test (id INT)"}'
)

if result.get('isError'):
    # 处理错误
    handle_error(result)
else:
    # 执行成功
    print("✅ 成功")
```

### 批量执行
```python
for idx, stmt in enumerate(statements, 1):
    result = mcp_call_tool(
        serverName="校招mysql",
        toolName="execute_sql",
        arguments=f'{{"query": "{stmt}"}}'
    )
    
    if result.get('isError'):
        choice = ask_user("skip/stop/rollback?")
        if choice == "rollback":
            rollback(executed_statements)
            break
    else:
        executed_statements.append(stmt)
```

---

## 最佳实践示例

### ✅ 推荐写法

```sql
-- 使用 IF NOT EXISTS
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  mobile VARCHAR(15) DEFAULT NULL COMMENT '手机号',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_mobile ON users(mobile) COMMENT '手机号索引';
```

### ❌ 不推荐写法

```sql
-- 缺少 IF NOT EXISTS（重复执行会失败）
CREATE TABLE users (
  id INT,
  name VARCHAR(50)
);

-- 缺少注释
-- 缺少字符集声明
-- 字段定义不规范
```
