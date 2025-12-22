# db-mysql-run

通过 MCP 执行 MySQL SQL 脚本或语句。

## 特性

- ✅ 零配置（MCP 已配置连接）
- ✅ 安全检查（自动检测危险操作）
- ✅ 自动回滚脚本生成
- ✅ 完整执行日志
- ✅ 支持脚本文件和单条 SQL

## 前置要求

需要配置 MySQL MCP 服务器（如 `校招mysql`）。

AI 会自动检查 MCP 可用性，未配置时显示安装指南。

## 快速开始

**执行脚本文件**:
```
帮我执行 workspace/design/db-schema.sql
```

**执行单条 SQL**:
```
CREATE TABLE test_users (id INT, name VARCHAR(50))
```

**查询数据库**:
```
student 数据库有哪些表？
```

AI 会自动：预览 → 安全检查 → 确认 → 执行 → 生成日志和回滚脚本

## 核心流程

1. **MCP 检查**（最优先）- 未配置则显示安装指南
2. **读取 SQL** - 从文件或用户输入
3. **预览分析** - 显示操作摘要和风险等级
4. **安全检查** - 检测危险操作（DROP DATABASE/DELETE 无 WHERE 等）
5. **用户确认** - 等待明确确认
6. **逐条执行** - 实时显示进度，失败时提供选项
7. **生成报告** - 执行日志 + 回滚脚本
8. **验证建议** - 提供验证命令

## 风险控制

| 操作 | 风险 | 处理 |
|------|------|------|
| DROP DATABASE | 极高 | 拒绝 |
| DELETE 无 WHERE | 极高 | 拒绝 |
| DROP TABLE | 高 | 警告+确认 |
| TRUNCATE | 高 | 警告+确认 |
| ALTER TABLE | 中 | 警告 |
| CREATE TABLE | 低 | 预览 |

## 错误处理

- `Table exists` → 询问: skip/replace
- `Foreign key error` → 提示: 先创建父表
- `Access denied` → 提示: 联系 DBA

失败时提供选项: skip（跳过）/ stop（停止）/ rollback（回滚）

## 最佳实践

```sql
-- ✅ 使用 IF NOT EXISTS
CREATE TABLE IF NOT EXISTS `users` (...);

-- ✅ 添加详细注释
COMMENT '用户表'

-- ✅ 指定字符集
DEFAULT CHARSET=utf8mb4
```

## 相关文档

- [SKILL.md](SKILL.md) - 完整执行流程
- [checklist.md](checklist.md) - 执行检查清单
- [examples.md](examples.md) - 详细示例
