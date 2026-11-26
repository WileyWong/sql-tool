# RC-028 同库表备份

## 基本信息

| 项目 | 内容 |
|------|------|
| 变更编号 | RC-028 |
| 变更日期 | 2026-11-25 |
| 提出人 | 王伟亮 |
| 优先级 | P1-高 |
| 影响范围 | 全栈（渲染进程、Preload、IPC、数据库驱动） |

---

## 1. 变更概述

在左侧连接树的表节点右键菜单中增加“复制表结构和数据”与“复制表结构”，在当前数据库中创建一张用户指定名称的备份表。

---

## 2. 变更背景

当前用户需要备份表定义或表数据时，必须手动执行建表与数据复制 SQL。该操作重复，且容易在目标表名、schema 或 IDENTITY 列处理上出错。

---

## 3. 变更内容

### 3.1 功能需求

| 序号 | 功能点 | 描述 | 验收标准 |
|------|--------|------|----------|
| 1 | 右键菜单 | 对左侧树的 `table` 节点展示“复制表结构和数据”“复制表结构”菜单项。 | 非表节点不展示这两个菜单。 |
| 2 | 目标表名输入 | 点击菜单后弹出输入框；默认表名为 `原表名_bakYYMMDD`，用户可修改。 | 空名称、非法字符或超过数据库名称长度时不可提交。 |
| 3 | 复制表结构 | 在当前数据库、新表名下创建与原表等价的表结构。 | 成功后提示并刷新左侧表树。 |
| 4 | 复制表结构和数据 | 创建结构后，以数据库端 SQL 将原表全部数据写入新表。 | MySQL 使用 `CREATE TABLE ... LIKE ...` 与 `INSERT ... SELECT ...`；成功后新表含全部原表数据。 |
| 5 | 方言兼容 | 支持 MySQL 和 SQL Server，始终在原表所在数据库中执行，且 SQL Server 保留 schema。 | 不提供跨库或跨连接复制。 |

### 3.2 非功能需求

- 数据库访问与 DDL/DML 执行仅在主进程的数据库驱动中进行，渲染进程仅通过 `window.api` 调用。
- 复制失败时提示服务器错误，不得显示成功提示；创建表成功但数据复制失败时，保留新建表供用户处理。
- 操作成功后刷新当前数据库下的表节点。

---

## 4. 输入输出示例

### 示例 1：复制表结构

**输入：** 右键 MySQL 表 `bresume_appconfig`，选择“复制表结构”，在输入框中确认默认名称 `bresume_appconfig_bak261125`。

**期望结果：**
```sql
CREATE TABLE `bresume_appconfig_bak261125` LIKE `bresume_appconfig`;
```

### 示例 2：复制表结构和数据

**输入：** 右键 MySQL 表 `bresume_appconfig`，选择“复制表结构和数据”，输入 `bresume_appconfig_bak261125` 并确认。

**期望结果：**
```sql
CREATE TABLE `bresume_appconfig_bak261125` LIKE `bresume_appconfig`;
INSERT INTO `bresume_appconfig_bak261125` SELECT * FROM `bresume_appconfig`;
```

---

## 5. 影响分析

| 模块 | 文件路径 | 修改类型 |
|------|----------|----------|
| 共享 IPC 常量 | `src/shared/constants/index.ts` | 修改 |
| 数据库驱动接口 | `src/main/database/core/interface.ts` | 修改 |
| MySQL 驱动 | `src/main/database/mysql/driver.ts` | 修改 |
| SQL Server 驱动 | `src/main/database/sqlserver/driver.ts` | 修改 |
| 元数据服务与 IPC | `src/main/services/metadataService.ts`、`src/main/ipc/database.ts` | 修改 |
| Preload API | `src/preload/index.ts` | 修改 |
| 连接树 | `src/renderer/components/ConnectionTree.vue` | 修改 |
| 国际化 | `src/renderer/i18n/locales/*.json` | 修改 |

无新增第三方依赖。

---

## 6. 测试用例

| 用例ID | 场景 | 操作 | 期望结果 |
|--------|------|------|----------|
| TC01 | MySQL 结构复制 | 右键表并确认默认备份表名 | 执行 `CREATE TABLE 新表 LIKE 原表`，表树刷新。 |
| TC02 | MySQL 结构和数据复制 | 右键表，修改目标表名并确认 | 执行 `CREATE TABLE ... LIKE`、`INSERT ... SELECT`，新表数据完整。 |
| TC03 | SQL Server 非 dbo schema | 复制 `sales.orders` 的结构和数据 | 在 `sales` schema 中创建目标表并复制数据。 |
| TC04 | 表名冲突 | 输入已存在的目标表名 | 展示数据库错误，原表不受影响。 |
| TC05 | 用户取消 | 在名称输入框点击取消 | 不执行数据库操作。 |
| TC06 | 失败处理 | 数据库连接断开或复制 SQL 失败 | 显示错误信息，且不提示复制成功。 |

---

## 7. 备注

- “数据”指用户确认操作时原表中的全部行。
- 目标表仅允许位于原表所在数据库；不支持跨库、跨连接复制。
- 当前 SQL Server 结构生成能力沿用已有 `getTableCreateSql` 实现；本需求不扩大为完整数据库级对象（外键、触发器、扩展属性）复制。
