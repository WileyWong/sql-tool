# 面试官年度H5 - API测试用例说明书

---
document_type: "API测试用例说明书"
version: "1.0"
author: "AI Assistant"
created_at: "2025-12-16"
status: "draft"
upstream_doc: "acceptance-criteria.md (v1.0)"
---

## 1. 文档概述

### 1.1 目的

本文档定义了面试官年度H5模块所有API接口的测试用例，用于：
- 指导测试执行
- 作为接口验收标准
- 支持回归测试自动化

### 1.2 范围

| 项目 | 说明 |
|------|------|
| 测试模块 | 面试官年度H5 |
| 接口数量 | 5（新开发） |
| 用例总数 | 36 |
| 覆盖率目标 | 90%+ |

> ⚠️ **说明**: 接口1-3（用户身份识别、面试官权限判断、非面试官访问提示）为已有接口，无需重新开发，本文档仅覆盖新开发接口的测试用例。

### 1.3 参考文档

| 文档 | 链接 |
|------|------|
| 验收标准文档 | acceptance-criteria.md |

---

## 2. 测试环境

### 2.1 环境配置

| 环境 | 地址 | 用途 |
|------|------|------|
| 开发环境 | http://dev.example.com | 开发自测 |
| 测试环境 | http://test.example.com | 集成测试 |
| 预发环境 | http://staging.example.com | 回归测试 |

### 2.2 测试账号

| 角色 | 用户ID | 说明 |
|------|--------|------|
| 面试官有数据 | user_001 | 有2025年面试数据 |
| 面试官无数据 | user_002 | 无截止2025.12.15的面试数据 |
| 非面试官 | user_003 | 不在面试官维度表中 |
| Token过期用户 | user_expired | 用于测试Token过期场景 |

### 2.3 依赖服务

| 服务 | 说明 | 测试策略 |
|------|------|----------|
| SSO/Token服务 | 身份认证 | 使用真实Token验证 |
| 面试官维度表 | 权限判断 | 连接真实测试数据库 |
| 好评词条表 | 词条查询 | 连接真实测试数据库 |
| 集团维度表 | 集团数据 | 连接真实测试数据库 |

> ⚠️ **重要**: 本测试框架进行**真实接口测试**，不使用 Mock。

---

## 3. 接口清单

| 序号 | 方法 | 路径 | 描述 | 用例数 | 状态 |
|------|------|------|------|--------|------|
| 1 | GET | /api/v1/h5/identity | 用户身份识别 | - | 已有接口 |
| 2 | GET | /api/v1/h5/permission | 面试官权限判断 | - | 已有接口 |
| 3 | GET | /api/v1/h5/no-permission-page | 非面试官访问提示 | - | 已有接口 |
| 4 | GET | /api/v1/h5/interviewer/basic-info | 面试官基本信息查询 | 10 | **新开发** |
| 5 | GET | /api/v1/h5/interviewer/stats/2025 | 2025年面试统计数据查询 | 10 | **新开发** |
| 6 | GET | /api/v1/h5/interviewer/stats/history | 历史累计统计数据查询 | 12 | **新开发** |
| 7 | GET | /api/v1/h5/interviewer/praise-top1 | 好评词条TOP1查询 | 8 | **新开发** |
| 8 | GET | /api/v1/h5/company/summary | 集团面试官人数查询 | 6 | **新开发** |

---

## 4. 测试用例详情

> ⚠️ **说明**: US001-US003 对应的接口为已有接口，无需重新开发测试用例。以下仅包含新开发接口的测试用例。

---

### 4.1 US004: 面试官基本信息查询

#### 4.1.1 接口信息

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/v1/h5/interviewer/basic-info |
| 认证方式 | Bearer Token |
| 前置条件 | 权限判断为INTERVIEWER_WITH_DATA |

#### 4.1.2 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID（员工工号） |

#### 4.1.3 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "张三 zhangsan",
    "firstInterviewerDate": "2020-03-15",
    "durationDays": 1735,
    "durationFormatted": "4年9个月",
    "bg": "BG名称",
    "department": "部门名称",
    "workLocation": "工作地"
  }
}
```

#### 4.1.4 测试用例

##### 功能测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US004_001 | test_get_basic_info_returns_200 | 正常查询基本信息 | 200, 返回完整信息 | P0 |
| TC_US004_002 | test_get_basic_info_returns_name | 返回中英文名 | name字段非空 | P0 |
| TC_US004_003 | test_get_basic_info_returns_duration | 返回担任时长 | durationDays和durationFormatted非空 | P0 |

##### 时长格式化测试（BR5规则）

| 用例ID | 命名 | 担任天数 | 预期格式化结果 | 优先级 |
|--------|------|---------|---------------|--------|
| TC_US004_004 | test_basic_info_duration_format_years_only | 1095 | "3年" | P0 |
| TC_US004_005 | test_basic_info_duration_format_years_months | 400 | "1年1个月" | P0 |
| TC_US004_006 | test_basic_info_duration_format_days_only | 25 | "25天" | P0 |
| TC_US004_007 | test_basic_info_duration_format_months_only | 60 | "2个月" | P0 |
| TC_US004_008 | test_basic_info_duration_format_exact_year | 365 | "1年" | P1 |

##### 边界条件测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US004_009 | test_basic_info_duration_zero_days | 担任时长=0天 | 展示"0天"或"今天" | P1 |
| TC_US004_010 | test_basic_info_partial_fields_empty | 部分字段为空 | 空字段返回空字符串或null，不影响展示 | P1 |

##### 性能测试

| 用例ID | 命名 | 场景 | 指标 | 预期 | 优先级 |
|--------|------|------|------|------|--------|
| TC_US004_P01 | test_get_basic_info_response_time_under_1s | 响应时间 | < 1秒 | PASS | P1 |
| TC_US004_P02 | test_get_basic_info_cached_response_time_under_200ms | 缓存命中响应时间 | < 200ms | PASS | P2 |

---

### 4.2 US005: 2025年面试统计数据查询

#### 4.2.1 接口信息

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/v1/h5/interviewer/stats/2025 |
| 认证方式 | Bearer Token |
| 前置条件 | 权限判断为INTERVIEWER_WITH_DATA |
| 数据截止日期 | 2025年12月15日 |

#### 4.2.2 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalInterviews": 50,
    "socialInterviews": 30,
    "campusInterviews": 20,
    "totalDurationMinutes": 1500,
    "totalReviewWords": 25000,
    "praiseCount": 15,
    "goodReviewCount": 12
  }
}
```

> ⚠️ **说明**: 低数据版本判断由前端根据返回数据进行处理，接口不返回 `isLowDataVersion` 字段。

#### 4.2.3 测试用例

##### 功能测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US005_001 | test_get_2025_stats_returns_200 | 正常查询2025年统计 | 200, 返回完整统计数据 | P0 |
| TC_US005_002 | test_get_2025_stats_returns_total_interviews | 返回面试总场次 | totalInterviews非空 | P0 |
| TC_US005_003 | test_get_2025_stats_returns_duration_and_words | 返回时长和字数 | totalDurationMinutes和totalReviewWords非空 | P0 |

##### 数据汇总验证

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US005_004 | test_2025_stats_total_equals_social_plus_campus | 汇总计算验证 | totalInterviews = socialInterviews + campusInterviews | P0 |
| TC_US005_005 | test_2025_stats_data_type_integer | 数据类型验证 | 所有数值为整数 | P1 |

##### 边界条件测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US005_006 | test_2025_stats_social_only | 仅有社招数据 | 正常展示，汇总=社招 | P1 |
| TC_US005_007 | test_2025_stats_campus_only | 仅有校招数据 | 正常展示，汇总=校招 | P1 |
| TC_US005_008 | test_2025_stats_large_value | 面试场次>1000 | 正常展示，不截断 | P1 |

##### 性能测试

| 用例ID | 命名 | 场景 | 指标 | 预期 | 优先级 |
|--------|------|------|------|------|--------|
| TC_US005_P01 | test_get_2025_stats_response_time_under_1s | 响应时间 | < 1秒 | PASS | P1 |

---

### 4.3 US006: 历史累计统计数据查询

#### 4.3.1 接口信息

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/v1/h5/interviewer/stats/history |
| 认证方式 | Bearer Token |
| 前置条件 | 权限判断为INTERVIEWER_WITH_DATA |

#### 4.3.2 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalInterviews": 200,
    "totalDurationMinutes": 6000,
    "maxDailyInterviews": 8,
    "maxDailyDate": "2024-03-15",
    "totalHiredCount": 25,
    "longestTenureYears": 3.5,
    "longestTenureFormatted": "3年6个月"
  }
}
```

> ⚠️ **说明**: 低数据版本判断（E1/E2/E3）由前端根据返回数据进行处理，接口不返回相关标识字段。

#### 4.3.3 测试用例

##### 功能测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US006_001 | test_get_history_stats_returns_200 | 正常查询历史累计数据 | 200, 返回完整数据 | P0 |
| TC_US006_002 | test_get_history_stats_returns_total_interviews | 返回累计面试场次 | totalInterviews非空 | P0 |
| TC_US006_003 | test_get_history_stats_returns_max_daily | 返回单日最多面试 | maxDailyInterviews和maxDailyDate非空 | P0 |
| TC_US006_004 | test_get_history_stats_returns_hired_info | 返回入职信息 | totalHiredCount和longestTenureFormatted非空 | P0 |

##### 入职年限格式化测试（BR6规则）

| 用例ID | 命名 | 年限值 | 预期格式化结果 | 优先级 |
|--------|------|-------|---------------|--------|
| TC_US006_005 | test_history_tenure_format_years_months | 3.5 | "3年6个月" | P0 |
| TC_US006_006 | test_history_tenure_format_years_only | 2.0 | "2年" | P0 |
| TC_US006_007 | test_history_tenure_format_months_only | 0.5 | "6个月" | P0 |
| TC_US006_008 | test_history_tenure_format_one_month | 0.08 | "1个月" | P1 |

##### 边界条件测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US006_009 | test_history_max_daily_one | 单日最大面试=1 | 正常展示"1人" | P1 |
| TC_US006_010 | test_history_tenure_less_than_month | 年限<1个月 | 展示"1个月"或最小单位 | P1 |

##### 性能测试

| 用例ID | 命名 | 场景 | 指标 | 预期 | 优先级 |
|--------|------|------|------|------|--------|
| TC_US006_P01 | test_get_history_stats_response_time_under_1_5s | 响应时间 | < 1.5秒 | PASS | P1 |

---

### 4.4 US009: 好评词条TOP1查询

#### 4.4.1 接口信息

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/v1/h5/interviewer/praise-top1 |
| 认证方式 | Bearer Token |
| 前置条件 | 权限判断为INTERVIEWER_WITH_DATA |

#### 4.4.2 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "praiseContent": "面试官对我的阐述和提问积极反馈，友好交流，让我感受到了平等尊重",
    "praiseCount": 15
  }
}
```

> ⚠️ **说明**: 低数据版本判断（E5）由前端根据返回数据进行处理，接口不返回 `isE5LowData` 字段。

#### 4.4.3 好评词条类型

| 词条ID | 词条内容 |
|--------|----------|
| 1 | 面试官对我的阐述和提问积极反馈，友好交流，让我感受到了平等尊重 |
| 2 | 面试官给予了我充分阐述过往经历或自身优势的机会 |
| 3 | 面试官详细介绍了岗位和业务，让我更期待加入腾讯 |
| 4 | 面试官有很强的个人专业魅力，让我更期待与之共事 |

#### 4.4.4 测试用例

##### 功能测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US009_001 | test_get_praise_top1_returns_200 | 正常查询好评词条TOP1 | 200, 返回词条内容和次数 | P0 |
| TC_US009_002 | test_get_praise_top1_content_is_valid | 词条内容有效 | praiseContent为4种标准词条之一 | P0 |
| TC_US009_003 | test_get_praise_top1_count_positive | 词条次数正确 | praiseCount > 0 | P0 |

##### 排序逻辑测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US009_004 | test_praise_top1_returns_highest_count | 返回次数最多的词条 | 返回的词条次数最高 | P0 |
| TC_US009_005 | test_praise_top1_same_count_stable_result | 多词条次数相同 | 结果稳定，多次查询返回相同结果 | P1 |

##### 边界条件测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US009_006 | test_praise_single_record | 仅1条好评记录 | 返回该词条作为TOP1 | P1 |

##### 性能测试

| 用例ID | 命名 | 场景 | 指标 | 预期 | 优先级 |
|--------|------|------|------|------|--------|
| TC_US009_P01 | test_get_praise_top1_response_time_under_500ms | 响应时间 | < 500ms | PASS | P1 |

---

### 4.5 US011: 集团面试官人数查询

#### 4.5.1 接口信息

| 项目 | 说明 |
|------|------|
| 请求方法 | GET |
| 请求路径 | /api/v1/h5/company/summary |
| 认证方式 | Bearer Token |
| 前置条件 | 权限判断为INTERVIEWER_WITH_DATA |

#### 4.5.2 响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalInterviewers": 15000,
    "totalDurationHours": 25000,
    "totalReviewWordsWan": 5000
  }
}
```

#### 4.5.3 测试用例

##### 功能测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US011_001 | test_get_company_summary_returns_200 | 正常查询集团汇总数据 | 200, 返回完整数据 | P0 |
| TC_US011_002 | test_get_company_summary_returns_total_interviewers | 返回面试官总人数 | totalInterviewers为整数 | P0 |

##### 单位转换验证（BR7/BR8规则）

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US011_003 | test_company_duration_minutes_to_hours | 时长单位转换 | 分钟→小时，四舍五入 | P0 |
| TC_US011_004 | test_company_words_to_wan | 字数单位转换 | 字→万字 | P0 |

##### 数据一致性测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US011_005 | test_company_summary_consistent_across_users | 不同用户查询结果一致 | 所有用户获取相同数据 | P0 |

##### 边界条件测试

| 用例ID | 命名 | 场景 | 预期 | 优先级 |
|--------|------|------|------|--------|
| TC_US011_006 | test_company_duration_29_minutes_to_0_hours | 29分钟转换 | 转换为0小时 | P1 |
| TC_US011_007 | test_company_duration_30_minutes_to_1_hour | 30分钟转换 | 转换为1小时 | P1 |

##### 性能测试

| 用例ID | 命名 | 场景 | 指标 | 预期 | 优先级 |
|--------|------|------|------|------|--------|
| TC_US011_P01 | test_get_company_summary_response_time_under_300ms | 响应时间 | < 300ms | PASS | P1 |
| TC_US011_P02 | test_get_company_summary_cached_response_time_under_50ms | 缓存命中响应时间 | < 50ms | PASS | P2 |

---

## 5. 测试数据

### 5.1 测试数据常量

```python
class TestData:
    """测试数据常量"""
    
    class Users:
        INTERVIEWER_WITH_DATA = "user_001"
        INTERVIEWER_NO_DATA = "user_002"
        NOT_INTERVIEWER = "user_003"
        INVALID_USER = "invalid_user_id"
    
    class Duration:
        DAYS_3_YEARS = 1095
        DAYS_1_YEAR_1_MONTH = 400
        DAYS_25 = 25
        DAYS_2_MONTHS = 60
        DAYS_ZERO = 0
    
    class Tenure:
        YEARS_3_5 = 3.5
        YEARS_2_0 = 2.0
        YEARS_0_5 = 0.5
        YEARS_0_08 = 0.08
    
    class PraiseContent:
        TYPE_1 = "面试官对我的阐述和提问积极反馈，友好交流，让我感受到了平等尊重"
        TYPE_2 = "面试官给予了我充分阐述过往经历或自身优势的机会"
        TYPE_3 = "面试官详细介绍了岗位和业务，让我更期待加入腾讯"
        TYPE_4 = "面试官有很强的个人专业魅力，让我更期待与之共事"
    
    class TipMessages:
        NO_DATA = "Hi，同学：本数据回顾统计范围截止至2025.12.15，抱歉目前暂时无法对你开放查看。期待未来再见！"
        NOT_INTERVIEWER = "Hi，同学：本数据回顾仅向面试官群体开放，抱歉目前无法对你开放查看。期待未来有机会以鹅厂面试官的身份再与你重逢。"
```

### 5.2 数据清理脚本

```sql
-- 测试数据清理（如需要）
-- 注意：本测试主要为查询接口，不创建数据，一般无需清理
```

---

## 6. 执行策略

### 6.1 执行优先级

| 阶段 | 优先级 | 执行时机 | 用例数 |
|------|--------|----------|--------|
| 冒烟测试 | P0 | 每次提交 | 14 |
| 核心测试 | P0+P1 | 每日构建 | 30 |
| 完整测试 | 全部 | 发版前 | 36 |

### 6.2 执行命令

```bash
# 冒烟测试
pytest -m "p0" tests/api/

# 核心测试
pytest -m "p0 or p1" tests/api/

# 完整测试
pytest tests/api/ --html=report.html

# 指定接口测试
pytest tests/api/test_h5_api.py -v
```

---

## 7. 验收标准

| 指标 | 标准 | 当前 |
|------|------|------|
| P0用例通过率 | 100% | - |
| P1用例通过率 | ≥95% | - |
| 整体通过率 | ≥90% | - |
| 接口覆盖率 | 100% | - |
| 场景覆盖率 | ≥80% | - |

---

## 8. 测试用例总览

> ⚠️ **说明**: 以下仅列出新开发接口（US004-US011）的测试用例，已有接口（US001-US003）不在本次测试范围内。低数据版本判断由前端处理，接口不返回相关字段。

| 用例ID | 命名 | 优先级 | 分类 |
|--------|------|--------|------|
| TC_US004_001 | test_get_basic_info_returns_200 | P0 | 功能 |
| TC_US004_002 | test_get_basic_info_returns_name | P0 | 功能 |
| TC_US004_003 | test_get_basic_info_returns_duration | P0 | 功能 |
| TC_US004_004 | test_basic_info_duration_format_years_only | P0 | 格式化 |
| TC_US004_005 | test_basic_info_duration_format_years_months | P0 | 格式化 |
| TC_US004_006 | test_basic_info_duration_format_days_only | P0 | 格式化 |
| TC_US004_007 | test_basic_info_duration_format_months_only | P0 | 格式化 |
| TC_US004_008 | test_basic_info_duration_format_exact_year | P1 | 格式化 |
| TC_US004_009 | test_basic_info_duration_zero_days | P1 | 边界 |
| TC_US004_010 | test_basic_info_partial_fields_empty | P1 | 边界 |
| TC_US005_001 | test_get_2025_stats_returns_200 | P0 | 功能 |
| TC_US005_002 | test_get_2025_stats_returns_total_interviews | P0 | 功能 |
| TC_US005_003 | test_get_2025_stats_returns_duration_and_words | P0 | 功能 |
| TC_US005_004 | test_2025_stats_total_equals_social_plus_campus | P0 | 业务逻辑 |
| TC_US005_005 | test_2025_stats_data_type_integer | P1 | 数据验证 |
| TC_US005_006 | test_2025_stats_social_only | P1 | 边界 |
| TC_US005_007 | test_2025_stats_campus_only | P1 | 边界 |
| TC_US005_008 | test_2025_stats_large_value | P1 | 边界 |
| TC_US006_001 | test_get_history_stats_returns_200 | P0 | 功能 |
| TC_US006_002 | test_get_history_stats_returns_total_interviews | P0 | 功能 |
| TC_US006_003 | test_get_history_stats_returns_max_daily | P0 | 功能 |
| TC_US006_004 | test_get_history_stats_returns_hired_info | P0 | 功能 |
| TC_US006_005 | test_history_tenure_format_years_months | P0 | 格式化 |
| TC_US006_006 | test_history_tenure_format_years_only | P0 | 格式化 |
| TC_US006_007 | test_history_tenure_format_months_only | P0 | 格式化 |
| TC_US006_008 | test_history_tenure_format_one_month | P1 | 格式化 |
| TC_US006_009 | test_history_max_daily_one | P1 | 边界 |
| TC_US006_010 | test_history_tenure_less_than_month | P1 | 边界 |
| TC_US009_001 | test_get_praise_top1_returns_200 | P0 | 功能 |
| TC_US009_002 | test_get_praise_top1_content_is_valid | P0 | 功能 |
| TC_US009_003 | test_get_praise_top1_count_positive | P0 | 功能 |
| TC_US009_004 | test_praise_top1_returns_highest_count | P0 | 业务逻辑 |
| TC_US009_005 | test_praise_top1_same_count_stable_result | P1 | 业务逻辑 |
| TC_US009_006 | test_praise_single_record | P1 | 边界 |
| TC_US011_001 | test_get_company_summary_returns_200 | P0 | 功能 |
| TC_US011_002 | test_get_company_summary_returns_total_interviewers | P0 | 功能 |
| TC_US011_003 | test_company_duration_minutes_to_hours | P0 | 单位转换 |
| TC_US011_004 | test_company_words_to_wan | P0 | 单位转换 |
| TC_US011_005 | test_company_summary_consistent_across_users | P0 | 数据一致性 |
| TC_US011_006 | test_company_duration_29_minutes_to_0_hours | P1 | 边界 |
| TC_US011_007 | test_company_duration_30_minutes_to_1_hour | P1 | 边界 |

---

## 9. 附录

### 9.1 状态码说明

| 状态码 | 说明 | 场景 |
|--------|------|------|
| 200 | 成功 | GET 成功 |
| 400 | 参数错误 | 参数验证失败 |
| 401 | 未认证 | Token缺失/无效/过期 |
| 403 | 无权限 | 非集团员工/非面试官 |
| 404 | 资源不存在 | 资源未找到 |
| 500 | 服务器错误 | 系统异常 |

### 9.2 权限状态说明

| 状态 | 说明 | 展示页面 |
|------|------|----------|
| INTERVIEWER_WITH_DATA | 面试官有数据 | 完整数据页 |
| INTERVIEWER_NO_DATA | 面试官无数据 | 无数据提示页 |
| NOT_INTERVIEWER | 非面试官 | 无权限提示页 |

### 9.3 低数据版本条件（前端处理）

> ⚠️ **说明**: 以下低数据版本判断由前端根据接口返回的数据进行处理，后端接口不返回相关标识字段。

| 条件 | 触发规则 | 影响页面 |
|------|----------|----------|
| E1 | 面试人数=0 或 总面试时长=0 | 第三页 |
| E2 | 单日最多面试人次=0 | 第三页 |
| E3 | 总入职人数=0 | 第四页 |
| E4 | 2025年面试总人数=0 | 第五页 |
| E5 | 无好评词条记录 或 问卷点赞数=0 | 第六页 |

### 9.4 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0 | 2025-12-16 | AI Assistant | 初始版本，基于acceptance-criteria.md生成 |
| 1.1 | 2025-12-16 | AI Assistant | 移除已有接口（US001-US003）测试用例，仅保留新开发接口 |
| 1.2 | 2025-12-16 | AI Assistant | 移除低数据版本判断相关测试用例（由前端处理），用例数从46调整为36 |
