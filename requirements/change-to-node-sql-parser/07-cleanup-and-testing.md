# Phase 6：清理与测试

## 1. 卸载 sql-parser-cst

确认所有文件中不再有 `sql-parser-cst` 的 import 后：

```bash
npm uninstall sql-parser-cst
```

## 2. 验证检查清单

### 2.1 MySQL 场景

| 测试用例 | 期望结果 |
|---------|---------|
| `SELECT * FROM users;` | ✅ 无语法错误 |
| `SELECT * FROM users WHERE id = 1;` | ✅ 无语法错误 |
| `SELECT u.name FROM users u LEFT JOIN orders o ON u.id = o.user_id;` | ✅ 无语法错误，表引用正确提取 |
| `SELECT * FROM (SELECT id FROM users) AS t;` | ✅ 子查询正确识别 |
| `SELEC * FROM users;` | ✅ 报语法错误，红色波浪线在 `SELEC` 位置 |
| 输入 `SELECT ` 后触发补全 | ✅ 提示关键字 |
| 输入 `SELECT * FROM ` 后触发补全 | ✅ 提示表名 |
| 输入 `-- 注释` 后触发补全 | ✅ 不弹出补全 |
| 输入 `'字符串内` 后触发补全 | ✅ 不弹出补全 |
| 鼠标悬浮在表名上 | ✅ 显示表 hover 信息 |
| 代码格式化 | ✅ 正常格式化（MySQL 风格） |

### 2.2 SQL Server (T-SQL) 场景

| 测试用例 | 期望结果 |
|---------|---------|
| `SELECT TOP 10 * FROM users;` | ✅ 无语法错误 |
| `SELECT * FROM users WITH (NOLOCK);` | ✅ 无语法错误 |
| `SELECT * FROM users WHERE id = 1;` | ✅ 无语法错误 |
| `SELECT u.name FROM users u LEFT JOIN orders o ON u.id = o.user_id;` | ✅ 表引用正确提取 |
| `SELECT * FROM (SELECT id FROM users) AS t;` | ✅ 子查询正确识别 |
| `SELEC * FROM users;` | ✅ 报语法错误 |
| 输入 `SELECT TOP 10 * FROM ` 后触发补全 | ✅ 提示表名 |
| 鼠标悬浮在表名上 | ✅ 显示表 hover 信息 |
| 代码格式化 | ✅ 正常格式化（T-SQL 风格） |
| `SELECT @@VERSION;` | ✅ 无语法错误 |
| `DECLARE @var INT = 1;` | ✅ 无语法错误 |

### 2.3 边界场景

| 测试用例 | 期望结果 |
|---------|---------|
| 空文档 | ✅ 无错误，无补全 |
| 多条语句（分号分隔） | ✅ 各语句独立诊断 |
| 不完整的 SQL（正在输入中） | ✅ 补全正常工作，诊断合理 |
| 复杂嵌套子查询 | ✅ 表引用正确提取（降级到正则也可接受） |
| 连接切换 MySQL → SQL Server | ✅ dialect 动态切换 |

## 3. 回归验证重点

1. **表名补全**：各种 FROM/JOIN 场景是否正确提示表名
2. **字段补全**：`表名.` 后是否正确提示字段
3. **子查询补全**：子查询别名 + `.` 后是否提示子查询列
4. **Hover 提示**：表名/字段名 hover 是否正常
5. **语法诊断**：合法 SQL 不误报，非法 SQL 正确定位错误

## 4. 改造完成后的依赖关系

```
sql-parser-cst  ← 已移除
node-sql-parser ← 新增，用于语法验证和表引用提取
sql-formatter   ← 保持不变，用于代码格式化
```

## 5. 文件改动总览

| 文件 | 操作 | 核心变更 |
|------|------|---------|
| `package.json` | 修改 | +node-sql-parser, -sql-parser-cst |
| `index.ts` | 修改 | DiagnosticProvider/FormattingProvider 注入 MetadataService |
| `diagnosticProvider.ts` | 重写 | 替换解析器，适配错误格式，动态 dialect |
| `completionProvider.ts` | 修改 | 移除 CST parse，使用正则方案；extractTablesFromSql 传入 dbType |
| `sqlParserService.ts` | 重写部分 | 删除 CST 遍历代码，新增 AST 提取代码 |
| `formattingProvider.ts` | 修改 | 注入 MetadataService，动态 language |
| `hoverProvider.ts` | 修改 | extractTablesFromSql 调用传入 dbType |
