# 需求变更单

## 基本信息

| 项目 | 内容 |
|------|------|
| 变更编号 | RC-009 |
| 变更日期 | 2026-01-19 |
| 提出人 | |
| 优先级 | P2-中 |
| 影响范围 | 全栈 |
| 实现状态 | 规划中 |

---

## 1. 变更内容

### 1.1 功能需求

> 详细描述需要实现的功能

| 序号 | 功能点 | 描述 | 验收标准 |
|------|--------|------|----------|
| 1 | order by 后面没有联想出字段 | 输入select * from post_data order by  后面应该联想出post_data的字段 | 在order by 后面应该联想出post_data, post_recruit_post 的字段|
| 2 | 自动加limit功能问题 | 输入 select * from post_recruit_post; （注意要带上分号） 由于系统会自动加上limit限制，所以会报错：[ER_PARSE_ERROR] You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'LIMIT 5000' at line 1 | 正常执行sql语句 |
| 3 | 结果导出功能升级 | 增加导出为Excel的功能(xlsx) | 和原来的CSV/JSON共用一个按钮，第一个是xlsx，鼠标移上去下拉显示CSV、JSON，用户点击后，按点击的项导出 |
---

## 4. 输入输出示例

> 提供具体的输入输出示例，帮助理解需求

### order by 后面没有联想出字段 示例 1

**输入：**
```sql
select * from post_recruit_post p inner join post_data d on p.post_data_id = d.post_data_id order by  
```

**期望输出：**
在order by 后面应该联想出post_data, post_recruit_post 的字段

### order by 后面没有联想出字段 示例 2

**输入：**
```sql
select * from post_recruit_post order by 
```

**期望输出：**
在order by 后面应该联想出post_recruit_post 的字段

### 自动加limit功能问题

**输入：（注意要带上分号）**
```sql
select * from post_recruit_post; 
```

**期望输出：**
执行sql语句，正常执行，并自动加上limit限制

---
