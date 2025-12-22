# Bean对象索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目 bean 包下所有Bean对象的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.bean`  
> **文件总数**: 3个

---

## 📑目录

- [一、Bean概览](#一bean概览)
- [二、详细清单](#二详细清单)

---

## 一、Bean概览

### 1.1 Bean分类

| Bean类型 | 数量 | 说明 |
|---------|------|------|
| **简历相关** | 2 | ResumeApplyRecordBean, ResumeFlowTraceBean |
| **TAS相关** | 1 | TasOpenBean |

---

## 二、详细清单

### 2.1 ResumeApplyRecordBean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.bean.ResumeApplyRecordBean`
- **功能说明**: 简历申请记录Bean

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| positionId | Long | 职位ID |
| candidateId | Long | 候选人ID |
| applyTime | Date | 申请时间 |
| status | Integer | 申请状态 |

---

### 2.2 ResumeFlowTraceBean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.bean.ResumeFlowTraceBean`
- **功能说明**: 简历流程追踪Bean

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| flowId | Long | 流程ID |
| resumeId | Long | 简历ID |
| actionType | String | 操作类型 |
| actionTime | Date | 操作时间 |
| operator | String | 操作人 |

---

### 2.3 TasOpenBean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.bean.TasOpenBean`
- **功能说明**: TAS开放平台Bean

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| appId | String | 应用ID |
| timestamp | Long | 时间戳 |

---
