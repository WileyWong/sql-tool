# 实体类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目所有实体类的完整索引，包含所有字段类型和公共方法  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.entity`  
> **文件总数**: 37个

---

## 📑 目录

- [一、实体概览](#一实体概览)
- [二、简历相关实体](#二简历相关实体)
- [三、沟通相关实体](#三沟通相关实体)
- [四、流程相关实体](#四流程相关实体)
- [五、统计相关实体](#五统计相关实体)
- [六、租户相关实体](#六租户相关实体)
- [七、其他实体](#七其他实体)

---

## 一、实体概览

### 1.1 实体分类统计

| 实体类型 | 数量 | 说明 |
|---------|------|------|
| **简历相关** | 10 | ResumeMain/Ext/Edu/WorkExp/Project等 |
| **沟通相关** | 10 | CommunicateMessage/Notify/Template等 |
| **流程相关** | 2 | FlowMain, FlowActionTrace |
| **统计相关** | 3 | StatisticCount/Comment/Todo |
| **租户相关** | 3 | TenantRedis/ES/MongoDB |
| **消息相关** | 2 | MessageTemplateDTO, ReplySMSBody |
| **其他** | 7 | CurrentStaff/StaffInfo/DialogueInfo等 |

---

## 二、简历相关实体

### 2.1 ResumeMain - 简历主表

**类路径**: `com.tencent.hr.recruit.center.framework.entity.ResumeMain`

**字段列表** (40个基础字段):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| groupId | Integer | 租户KEY |
| resumeId | Integer | 简历ID |
| rid | String | GUID的简历ID |
| extId | String | 对接系统的ID |
| status | Integer | 简历状态 |
| statusTxt | String | 简历状态文本 |
| statusText | String | 简历状态文本（新） |
| isLock | Integer | 是否锁定 |
| enableFlag | Integer | 是否可用 |
| name | String | 姓名 |
| mobile | String | 手机号 |
| email | String | 邮箱 |
| idcard | String | 身份证 |
| channelSource | Integer | 渠道来源 |
| education | String | 学历 |
| school | String | 毕业学校 |
| speciality | String | 专业 |
| lastCompany | String | 最近工作企业 |
| birthday | String | 生日 |
| graduateDate | Long | 毕业时间 |
| workYears | Integer | 工作年限 |
| currentJobTitle | String | 当前工作职位 |
| gender | String | 性别 |
| workCity | String | 当前工作城市id |
| recruitCity | String | 面试城市ID |
| photoPath | String | 头像 |
| photoStream | String | 头像文件流 |
| createBy | Integer | 创建者 |
| createTime | Integer | 创建时间 |
| updateTime | Integer | 修改时间 |
| updateFlag | Integer | 最后更新标识 |
| locked | Integer | 锁定状态 |

**关联字段** (5个):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeExt | ResumeExt | 简历副表 |
| resumeEdu | List\<ResumeEdu\> | 简历教育经历列表 |
| resumeProject | List\<ResumeProject\> | 简历项目经历列表 |
| resumeWorkExp | List\<ResumeWorkExp\> | 简历工作经历列表 |
| resumeAttachments | List\<ResumeAttachment\> | 作品附件列表 |

**公共方法**:
- 使用 `@Data` 注解，自动生成所有字段的 getter/setter 方法
- 含参构造函数（所有字段）
- 无参构造函数

---

### 2.2 ResumeExt - 简历扩展表

**类路径**: `com.tencent.hr.recruit.center.framework.entity.ResumeExt`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeId | Integer | 简历ID |
| advantage | String | 优势 |
| disadvantage | String | 劣势 |
| evaluateLevel | String | 评估等级 |
| remark | String | 备注 |
| selfEvaluation | String | 自我评价 |
| expectedSalary | String | 期望薪资 |
| currentSalary | String | 当前薪资 |

---

### 2.3 ResumeEdu - 简历教育经历

**类路径**: `com.tencent.hr.recruit.center.framework.entity.ResumeEdu`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeId | Integer | 简历ID |
| schoolName | String | 学校名称 |
| major | String | 专业 |
| degree | String | 学位 |
| startDate | Long | 开始时间 |
| endDate | Long | 结束时间 |
| education | String | 学历 |

---

### 2.4 ResumeWorkExp - 工作经历

**类路径**: `com.tencent.hr.recruit.center.framework.entity.ResumeWorkExp`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeId | Integer | 简历ID |
| companyName | String | 公司名称 |
| position | String | 职位 |
| startDate | Long | 开始时间 |
| endDate | Long | 结束时间 |
| description | String | 工作描述 |
| industry | String | 行业 |
| salary | String | 薪资 |

---

### 2.5 ResumeProject - 项目经历

**类路径**: `com.tencent.hr.recruit.center.framework.entity.ResumeProject`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeId | Integer | 简历ID |
| projectName | String | 项目名称 |
| role | String | 角色 |
| startDate | Long | 开始时间 |
| endDate | Long | 结束时间 |
| description | String | 项目描述 |

---

### 2.6 其他简历相关实体

#### ResumeList - 简历列表

| 字段名 | 类型 | 说明 |
|-------|------|------|
| listId | Integer | 列表ID |
| resumeId | Integer | 简历ID |
| positionId | Integer | 职位ID |
| status | Integer | 状态 |
| applyTime | Long | 申请时间 |

#### ResumeRecord - 简历记录

| 字段名 | 类型 | 说明 |
|-------|------|------|
| recordId | Integer | 记录ID |
| resumeId | Integer | 简历ID |
| actionType | String | 操作类型 |
| actionTime | Long | 操作时间 |
| operator | String | 操作人 |

#### ResumeAttachment - 简历附件

| 字段名 | 类型 | 说明 |
|-------|------|------|
| attachmentId | Integer | 附件ID |
| resumeId | Integer | 简历ID |
| fileName | String | 文件名 |
| fileUrl | String | 文件URL |
| fileType | String | 文件类型 |

#### ResumeToAI - AI分析简历

| 字段名 | 类型 | 说明 |
|-------|------|------|
| resumeId | Integer | 简历ID |
| aiScore | Double | AI评分 |
| aiAnalysis | String | AI分析结果 |
| aiTags | String | AI标签 |

---

## 三、沟通相关实体

### 3.1 CommunicateMessage - 沟通消息

**类路径**: `com.tencent.hr.recruit.center.framework.entity.CommunicateMessage`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| messageId | Long | 消息ID |
| resumeId | Integer | 简历ID |
| content | String | 消息内容 |
| sendTime | Long | 发送时间 |
| sender | String | 发送者 |
| receiver | String | 接收者 |
| type | Integer | 消息类型 |
| status | Integer | 状态 |
| createTime | Long | 创建时间 |

### 3.2 其他沟通相关实体

详细字段请查看源码，包括：
- CommunicateMessageNotify - 消息通知
- CommunicateMessageNotifyDetail - 通知详情
- CommunicateMessageSetting - 消息设置
- CommunicateMessageStatistic - 消息统计
- CommunicateMessageTemplate - 消息模板
- CommunicateNoticeInfo - 通知信息
- CommunicateResumeCollect - 简历收藏
- CommunicateInterviewArrange - 面试安排
- CommunicateEfficiencyTool - 效率工具

---

## 四、流程相关实体

### 4.1 FlowMain - 流程主表

**类路径**: `com.tencent.hr.recruit.center.framework.entity.FlowMain`

**字段列表** (30个字段):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| flowMainId | long | 流程主表ID |
| flowInstanceId | long | 流程实例ID |
| flowId | int | 流程ID |
| flowName | String | 流程名称 |
| candidateId | int | 候选人ID |
| candidateName | String | 候选人姓名 |
| email | String | 邮箱 |
| mobilePhone | String | 手机号 |
| degreeId | int | 学历ID |
| degreeName | String | 学历名称 |
| postId | int | 职位ID |
| postName | String | 职位名称 |
| deptId | int | 部门ID |
| deptName | String | 部门名称 |
| deptFullName | String | 部门全称 |
| bgId | int | BG ID |
| bgName | String | BG名称 |
| workLocationId | Integer | 工作地点ID |
| workLocationName | String | 工作地点名称 |
| staffTypeId | int | 员工类型ID |
| staffTypeName | String | 员工类型名称 |
| stateId | int | 状态ID |
| stateName | String | 状态名称 |
| curHandleStatus | String | 当前处理状态 |
| curHandleMan | String | 当前处理人 |
| creater | String | 创建人 |
| createTime | Timestamp | 创建时间 |
| lastUpdateTime | Timestamp | 最后更新时间 |
| isAsyc | Boolean | 是否异步 |

**公共方法**:
- 使用 `@Data` 注解，自动生成所有字段的 getter/setter 方法

---

### 4.2 FlowActionTrace - 流程操作轨迹

**类路径**: `com.tencent.hr.recruit.center.framework.entity.FlowActionTrace`

**字段列表**:

| 字段名 | 类型 | 说明 |
|-------|------|------|
| traceId | Long | 轨迹ID |
| flowId | Long | 流程ID |
| actionType | String | 操作类型 |
| actionTime | Long | 操作时间 |
| operator | String | 操作人 |
| remark | String | 备注 |

---

## 五、统计相关实体

### 5.1 StatisticCount - 统计计数

| 字段名 | 类型 | 说明 |
|-------|------|------|
| countId | Long | 计数ID |
| statisticType | String | 统计类型 |
| count | Integer | 数量 |
| date | String | 日期 |

### 5.2 StatisticComment - 统计评论

| 字段名 | 类型 | 说明 |
|-------|------|------|
| commentId | Long | 评论ID |
| content | String | 内容 |
| createTime | Long | 创建时间 |
| creator | String | 创建人 |

### 5.3 StatisticTodo - 待办统计

| 字段名 | 类型 | 说明 |
|-------|------|------|
| todoId | Long | 待办ID |
| title | String | 标题 |
| content | String | 内容 |
| status | Integer | 状态 |
| deadline | Long | 截止时间 |

---

## 六、租户相关实体

### 6.1 TenantRedis - Redis租户配置

| 字段名 | 类型 | 说明 |
|-------|------|------|
| tenantId | String | 租户ID |
| redisHost | String | Redis主机 |
| redisPort | Integer | Redis端口 |
| redisPassword | String | Redis密码 |
| database | Integer | 数据库索引 |

### 6.2 TenantES - ElasticSearch租户配置

| 字段名 | 类型 | 说明 |
|-------|------|------|
| tenantId | String | 租户ID |
| esHost | String | ES主机 |
| esPort | Integer | ES端口 |
| esIndex | String | ES索引 |

### 6.3 TenantMongoDB - MongoDB租户配置

| 字段名 | 类型 | 说明 |
|-------|------|------|
| tenantId | String | 租户ID |
| mongoHost | String | MongoDB主机 |
| mongoPort | Integer | MongoDB端口 |
| mongoDatabase | String | MongoDB数据库 |

---

## 七、其他实体

### 7.1 CurrentStaff - 当前员工信息

**字段**: staffId, staffName, email, mobile等

### 7.2 StaffInfo - 员工详细信息

**字段**: staffId, name, gender, birthday, email, mobile等

### 7.3 PopularLocation - 热门地点

**字段**: locationId, locationName, count等

### 7.4 RecentLocation - 最近地点

**字段**: locationId, locationName, lastAccessTime等

### 7.5 PredictedPost - 预测职位

**字段**: postId, postName, score等

### 7.6 EducationExperience - 教育经历

**字段**: schoolName, major, degree, startDate, endDate等

### 7.7 WorkExperience - 工作经历

**字段**: companyName, position, startDate, endDate等

---

## 📚 相关文档

- [核心类索引](./core.md) - Core包核心类
- [工具类索引](./utils.md) - 工具类和支持类
- [异常类索引](./exceptions.md) - 异常处理类
- [项目结构](./project-structure.md) - 项目整体结构

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完善所有字段类型和说明 | v1.1 |
| 2025-11-21 | AI Assistant | 初始创建文档 | v1.0 |

---
