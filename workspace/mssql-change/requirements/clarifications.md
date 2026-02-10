---
name: TableDesignDialog 组件架构重构 —— 按数据库类型拆分独立组件
change_id: mssql-change
source: requirements/mssql-change/mssql-change-01.md
review_doc: workspace/mssql-change/requirements/requirement-review.md
created_at: 2026-02-10
updated_at: 2026-02-10
strategy: 一次性全部确认
---

# 需求澄清文档

---

## [CLARIFIED] 业务规则: Schema 获取与传递机制

**关联功能**: FR3（表设计新建）、FR4（表设计编辑）、FR5（右键菜单）

**决议**: 方案A — 扩展 TreeNode + Driver 支持多 Schema
- TreeNode 增加 `schema?: string` 字段
- `getTables()` 去掉 dbo 硬编码，返回所有 schema 的表，每个表附带 schema 信息
- `getColumns()` / `getIndexes()` 接受 schema 参数
- 右键菜单和编辑模式直接从 TreeNode 获取 schema

**理由**: 方案B 导致非 dbo schema 的表在树中不可见，用户无法编辑这些表，功能不完整。方案A 虽然改动大，但一次性解决根本问题，后续不需要再返工。

**验收标准**:
1. TreeNode 包含 schema 字段，SQL Server 表节点均携带正确 schema
2. `getTables()` 返回所有 schema 下的表
3. `getColumns()` / `getIndexes()` 根据 schema 参数过滤
4. 右键菜单和编辑模式直接从 TreeNode 获取 schema，无需运行时查询

**影响范围**: TreeNode 类型定义、SqlServerDriver（getTables/getColumns/getIndexes）、IPC 层、ConnectionTree、TableDesign 组件
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: IDENTITY 与主键的关系约束

**关联功能**: FR3（SQL Server 列定义）

**决议**: 方案A — 严格限制，仅主键列可启用 IDENTITY
- UI 上只有勾选了"主键"的列才能勾选 IDENTITY
- 取消主键勾选时自动取消 IDENTITY

**理由**: 作为表设计工具，引导最佳实践更有价值。极少数需要非主键 IDENTITY 的场景可通过 SQL 编辑器直接执行。

**验收标准**:
1. 未勾选主键的列，IDENTITY 复选框禁用
2. 取消主键勾选时，IDENTITY 自动取消

**影响范围**: FR3 列定义 UI 交互逻辑
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: 默认值约束名查询与处理（编辑模式）

**关联功能**: FR4（SQL Server 编辑模式）

**决议**: 方案A — 扩展 getColumns() 返回约束名
- `ColumnMeta` 增加 `defaultConstraintName?: string` 字段
- `getColumns()` 查询时 JOIN `sys.default_constraints` 获取约束名
- 编辑模式生成 ALTER 时直接使用已有约束名

**理由**: 方案A 是一次性的接口扩展，使数据更完整；方案B 在 SQL 预览时会遇到约束名未知的问题，用户体验差。

**验收标准**:
1. `getColumns()` 返回的 ColumnMeta 包含 `defaultConstraintName` 字段
2. 编辑模式修改/删除默认值时生成正确的 `DROP CONSTRAINT [约束名]` 语句

**影响范围**: ColumnMeta 类型定义、SqlServerDriver.getColumns()、FR4 ALTER SQL 生成逻辑
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: 非 CLUSTERED 索引的创建时机

**关联功能**: FR3（SQL Server 新建模式）

**决议**: 方案B — 仅 PRIMARY KEY 内联，UNIQUE 和 INDEX 都建表后创建
- CREATE TABLE 中仅内联 PRIMARY KEY 约束
- UNIQUE 和普通 INDEX 都在建表后通过 CREATE UNIQUE INDEX / CREATE INDEX 创建

**理由**: 实现更简单统一。UNIQUE INDEX 和 UNIQUE CONSTRAINT 在大多数场景下行为一致，用户感知无差异。

**验收标准**:
1. CREATE TABLE 语句中仅包含 PRIMARY KEY 约束
2. UNIQUE 索引通过 CREATE UNIQUE INDEX 在建表后创建
3. 普通 INDEX 通过 CREATE INDEX 在建表后创建
4. 执行顺序：先 CREATE TABLE → 再 CREATE INDEX → 最后 sp_addextendedproperty

**影响范围**: FR3 SQL 生成逻辑
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: 默认值输入格式处理

**关联功能**: FR3（SQL Server 新建模式）、FR4（SQL Server 编辑模式）

**决议**: 方案C — 原样透传，与 MySQL 组件保持一致
- 用户输入什么就用什么，不做自动格式化
- 用户需自行输入 `N'hello'`、`0`、`GETDATE()` 等完整 SQL 表达式

**理由**: 保持两个组件的行为一致性最重要。高级用户使用表设计工具时理应了解基本 SQL 语法。

**验收标准**:
1. 默认值输入框内容直接拼接到 `DEFAULT` 关键字后
2. 不对用户输入做任何自动包装或格式转换

**影响范围**: FR3/FR4 SQL 生成逻辑中默认值部分
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: 编辑模式下注释的新增 vs 更新判断

**关联功能**: FR4（SQL Server 编辑模式）

**决议**: 方案A — 通过原始数据判断
- 加载表结构时保存原始列注释
- 原始注释为空 → 使用 `sp_addextendedproperty`
- 原始注释非空 → 使用 `sp_updateextendedproperty`

**理由**: 最简单直接。当前 `getColumns()` 已通过 `sys.extended_properties` 返回注释值，为空即视为未设置。

**验收标准**:
1. 编辑模式正确保存原始注释状态
2. 原注释为空的列修改注释时生成 `sp_addextendedproperty`
3. 原注释非空的列修改注释时生成 `sp_updateextendedproperty`

**影响范围**: FR4 编辑模式注释变更 SQL 生成逻辑
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## [CLARIFIED] 业务规则: 编辑模式下 Schema 字段的可编辑性

**关联功能**: FR4（SQL Server 编辑模式）

**决议**: 方案A — 编辑模式 Schema 只读
- Schema 字段在编辑模式下显示但禁用（只读）

**理由**: Schema 迁移是低频操作且有风险，本期暂不支持。需要时可通过 SQL 编辑器手动执行。

**验收标准**:
1. 编辑模式下 Schema 下拉框显示当前表的 schema 但不可编辑
2. 不生成 ALTER SCHEMA 相关 SQL

**影响范围**: FR4 编辑模式 UI 交互
**决议时间**: 2026-02-10
**决议人**: 用户确认

---

## 澄清摘要

| # | 类别 | 标题 | 关联FR | 状态 | 决议 |
|---|------|------|--------|------|------|
| 1 | 业务规则 | Schema 获取与传递机制 | FR3,FR4,FR5 | CLARIFIED | 方案A: 扩展 TreeNode + Driver |
| 2 | 业务规则 | IDENTITY 与主键的关系约束 | FR3 | CLARIFIED | 方案A: 仅主键列可用 |
| 3 | 业务规则 | 默认值约束名查询与处理 | FR4 | CLARIFIED | 方案A: 扩展 getColumns() |
| 4 | 业务规则 | 非 CLUSTERED 索引创建时机 | FR3 | CLARIFIED | 方案B: 仅 PK 内联 |
| 5 | 业务规则 | 默认值输入格式处理 | FR3,FR4 | CLARIFIED | 方案C: 原样透传 |
| 6 | 业务规则 | 注释新增 vs 更新判断 | FR4 | CLARIFIED | 方案A: 原始数据判断 |
| 7 | 业务规则 | 编辑模式 Schema 可编辑性 | FR4 | CLARIFIED | 方案A: 只读 |

**统计**: 已澄清 7/7 项，全部闭环。

**后续行动**: 所有澄清项已确认，决议已回填到 `requirement-review.md`，可进入设计和开发阶段。
