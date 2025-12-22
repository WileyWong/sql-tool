# 枚举类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目所有枚举类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.enums`  
> **文件总数**: 6个

---

## 📑 目录

- [一、枚举概览](#一枚举概览)
- [二、详细清单](#二详细清单)

---

## 一、枚举概览

### 1.1 枚举分类

| 枚举类型 | 数量 | 说明 |
|---------|------|------|
| **配置枚举** | 1 | CommonConfig |
| **错误码枚举** | 1 | CommonErrorCode |
| **渠道枚举** | 1 | DefaultRecruitChannel |
| **脱敏枚举** | 1 | DesensitizationType |
| **缓存枚举** | 2 | RecruitCacheAction, RecruitCacheLevel |

---

## 二、详细清单

### 2.1 CommonConfig
**功能**: 通用配置枚举
**枚举值**: 系统配置项

---

### 2.2 CommonErrorCode
**功能**: 通用错误码
**枚举值**: 
- SYSTEM_ERROR(500, "系统错误")
- PARAM_INVALID(400, "参数无效")
- ...

---

### 2.3 DefaultRecruitChannel
**功能**: 默认招聘渠道
**枚举值**: 各类招聘渠道

---

### 2.4 DesensitizationType
**功能**: 脱敏类型
**枚举值**:
- PHONE: 手机号脱敏
- ID_CARD: 身份证脱敏
- EMAIL: 邮箱脱敏
- NAME: 姓名脱敏
- BANK_CARD: 银行卡脱敏

---

### 2.5 RecruitCacheAction
**功能**: 缓存操作类型
**枚举值**:
- Cache: 缓存
- Evict: 清除缓存

---

### 2.6 RecruitCacheLevel
**功能**: 缓存级别
**枚举值**:
- Local: 本地缓存
- Redis: Redis缓存
- Multi: 多级缓存

---
