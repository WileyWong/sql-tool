# 枚举类索引文档

> **文档说明**: 本文档为 `RecruitCenterThirdPartyStarter` 项目枚举类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `third.enums`, `efficiency.enums`, `hrright.enums`, `market.enums`  
> **文件总数**: 13个

---

## 📑 目录

- [一、枚举类概览](#一枚举类概览)
- [二、详细清单](#二详细清单)
  - [2.1 通用枚举](#21-通用枚举)
  - [2.2 效能平台枚举](#22-效能平台枚举)
  - [2.3 权限管理枚举](#23-权限管理枚举)
  - [2.4 数据市场枚举](#24-数据市场枚举)
- [三、最佳实践建议](#三最佳实践建议)

---

## 一、枚举类概览

### 1.1 目录结构

```
third/
├── enums/                    # 通用枚举 (5个)
│   ├── FrameworkRedisKey    # Redis键枚举
│   ├── InterviewManLevel    # 面试官级别
│   ├── TencentChiefType     # 腾讯负责人类型
│   ├── TencentManagerType   # 腾讯管理者类型
│   └── TencentUnitType      # 腾讯组织类型
├── efficiency/enums/        # 效能平台枚举 (3个)
│   ├── FlowActionType       # 流程环节类型
│   ├── FlowStatusType       # 流程状态类型
│   └── FlowStepType         # 流程步骤类型
├── hrright/enums/           # 权限管理枚举 (4个)
│   ├── DataScopeCode        # 数据权限范围码
│   ├── OperateCode          # 操作权限码
│   ├── OperateRule          # 操作规则
│   └── RecruitRole          # 招聘角色
└── market/enums/            # 数据市场枚举 (1个)
    └── DictType             # 字典类型
```

### 1.2 按功能分类

| 功能分类 | 文件数量 | 主要用途 |
|---------|---------|---------|
| 缓存管理 | 1个 | Redis键管理 |
| 组织架构 | 3个 | 腾讯组织结构定义 |
| 流程配置 | 3个 | 效能平台流程管理 |
| 权限管理 | 4个 | 操作权限和数据权限 |
| 面试管理 | 1个 | 面试官级别定义 |
| 字典管理 | 1个 | 数据字典类型 |

---

## 二、详细清单

### 2.1 通用枚举

#### 2.1.1 FrameworkRedisKey

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.enums.FrameworkRedisKey`
- **用途**: Redis缓存键管理
- **注解**: `@RequiredArgsConstructor`

**枚举值** (2个):

| 枚举名 | key格式 | 过期时间 | 说明 |
|-------|---------|---------|------|
| `DATA_CONFIG` | `data-config:code:%s` | 2小时 | 数据配置缓存 |
| `HR_RIGHT_OPERATE` | `hr-right:operate:%s:%s` | 2分钟 | HR权限操作缓存 |

**字段**:
```java
private final static String PREFIX = "recruit-framework:";  // 统一前缀
private final String key;      // 键模板
private final long expire;     // 过期时间（秒）
```

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `key(Object... param)` | `String` | 生成Redis键，自动添加前缀 |
| `expire()` | `long` | 获取过期时间 |

**使用示例**:
```java
// 生成Redis键
String key = FrameworkRedisKey.HR_RIGHT_OPERATE.key("tencent", "staffId");
// 结果: "recruit-framework:hr-right:operate:tencent:staffId"

// 获取过期时间
long expire = FrameworkRedisKey.HR_RIGHT_OPERATE.expire();
// 结果: 120秒
```

---

#### 2.1.2 InterviewManLevel

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.enums.InterviewManLevel`
- **用途**: 面试官级别定义
- **注解**: `@Getter`, `@RequiredArgsConstructor`

**枚举值** (3个):

| 枚举名 | level | name | 说明 |
|-------|-------|------|------|
| `HRInterviewMan` | 1 | "简历筛选员" | HR初筛 |
| `InterviewMan` | 2 | "初试官" | 一面面试官 |
| `ReInterviewMan` | 3 | "复试官" | 二面/终面面试官 |

**字段**:
```java
private final Integer level;  // 级别ID
private final String name;    // 级别名称
```

**公共方法** (3个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `getLevel()` | `Integer` | 获取级别ID |
| `getName()` | `String` | 获取级别名称 |
| `valueOf(int levelId)` | `InterviewManLevel` | 根据级别ID获取枚举（静态方法） |

**使用示例**:
```java
// 根据级别ID获取枚举
InterviewManLevel level = InterviewManLevel.valueOf(2);
// 结果: InterviewManLevel.InterviewMan

// 获取名称
String name = level.getName();
// 结果: "初试官"
```

---

#### 2.1.3 TencentChiefType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.enums.TencentChiefType`
- **用途**: 腾讯组织负责人类型定义
- **注解**: `@RequiredArgsConstructor`

**枚举值** (10个):

| 枚举名 | id | 说明 |
|-------|----|----|
| `Company` | 10 | 公司负责人 |
| `System` | 20 | 系统负责人 |
| `VP` | 30 | VP负责人 |
| `Dept` | 40 | 部门负责人 |
| `Secretary` | 60 | 秘书 |
| `Group` | 70 | 中心Or小组负责人 |
| `Header` | 80 | 组织负责人 |
| `CompanyCc` | 100 | 公司抄送人 |
| `SystemCc` | 110 | 系统抄送人 |
| `Product` | 120 | 产品线负责人 |

**字段**:
```java
public final Integer id;  // 负责人类型ID
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `valueOf(Integer val)` | `TencentChiefType` | 根据ID获取枚举（静态方法） |

**使用示例**:
```java
// 根据ID获取枚举
TencentChiefType type = TencentChiefType.valueOf(40);
// 结果: TencentChiefType.Dept (部门负责人)
```

---

#### 2.1.4 TencentManagerType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.enums.TencentManagerType`
- **用途**: 腾讯管理者级别类型
- **注解**: `@RequiredArgsConstructor`

**枚举值** (7个):

| 枚举名 | id | 说明 |
|-------|----|----|
| `General` | 1 | 总裁 |
| `Middle` | 3 | 中干 |
| `Basic` | 4 | 基干 |
| `Account` | 5 | 员工 |
| `SEVP` | 7 | SEVP |
| `SVP` | 8 | SVP |
| `CVP` | 9 | CVP |

**字段**:
```java
public final Integer id;  // 管理者类型ID
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `valueOf(Integer val)` | `TencentManagerType` | 根据ID获取枚举（静态方法） |

---

#### 2.1.5 TencentUnitType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.enums.TencentUnitType`
- **用途**: 腾讯组织单元类型
- **注解**: `@RequiredArgsConstructor`

**枚举值** (5个):

| 枚举名 | id | 说明 |
|-------|----|----|
| `Bg` | 6 | 事业群BG |
| `Line` | 8 | 产品线 |
| `Dept` | 1 | 部门 |
| `Center` | 7 | 中心 |
| `Group` | 2 | 小组/组 |

**字段**:
```java
public final Integer id;  // 组织类型ID
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `valueOf(Integer val)` | `TencentUnitType` | 根据ID获取枚举（静态方法） |

---

### 2.2 效能平台枚举

#### 2.2.1 FlowActionType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.enums.FlowActionType`
- **用途**: 流程环节类别配置
- **说明**: 对应配置表data_Config当中Code为FlowActionType

**枚举值** (1个):

| 枚举名 | 说明 |
|-------|------|
| `InterviewAction` | 面试流程环节配置 |

---

#### 2.2.2 FlowStatusType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.enums.FlowStatusType`
- **用途**: 流程状态类别配置
- **说明**: 对应配置表data_Config当中Code为FlowStatusType

**枚举值** (2个):

| 枚举名 | 说明 |
|-------|------|
| `SocialFlowStatus` | 社招面试状态 |
| `InsideFlowStatus` | 活水流程状态 |

---

#### 2.2.3 FlowStepType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.enums.FlowStepType`
- **用途**: 流程步骤类别配置
- **说明**: 对应配置表data_Config当中Code为FlowStepType

**枚举值** (2个):

| 枚举名 | 说明 |
|-------|------|
| `SocialFlowStep` | 社招流程步骤 |
| `InsideFlowStep` | 活水流程步骤 |

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `get(String name)` | `FlowStepType` | 根据名称获取枚举（静态方法） |

**使用示例**:
```java
FlowStepType type = FlowStepType.get("SocialFlowStep");
// 结果: FlowStepType.SocialFlowStep
```

---

### 2.3 权限管理枚举

#### 2.3.1 DataScopeCode

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.enums.DataScopeCode`
- **用途**: 数据权限范围码定义
- **接口实现**: `IDataScopeCode`
- **注解**: `@AllArgsConstructor`
- **说明**: hr-right返回DataScope对应的key值

**枚举值** (3个):

| 枚举名 | code | sign | 说明 |
|-------|------|------|------|
| `Department` | "Org" | "Org-All" | 部门数据权限 |
| `WorkPlace` | "WorkPlace" | "WorkPlace-All" | 工作地数据权限 |
| `ManagementSubject` | "ManagementSubject" | "global" | 管理主体数据权限 |

**字段**:
```java
private final String code;  // 数据Code
private final String sign;  // 表示所有的标识符
```

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `code()` | `String` | 获取数据Code |
| `sign()` | `String` | 获取所有权限标识符 |

---

#### 2.3.2 OperateCode

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.enums.OperateCode`
- **用途**: 操作权限码定义
- **接口实现**: `IOperateCode`
- **注解**: `@AllArgsConstructor`
- **说明**: hr-right中定义的操作名称

**枚举值** (2个):

| 枚举名 | code | 说明 |
|-------|------|------|
| `InterviewFlowTrace` | "Recruit_InterviewFlowTrace" | 面试流程权限code |
| `RecruitmentGroup_Identity` | "RecruitmentGroup_Identity" | 招聘大团队权限code |

**字段**:
```java
private final String code;  // 操作权限码
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `code()` | `String` | 获取操作权限码 |

---

#### 2.3.3 OperateRule

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.enums.OperateRule`
- **用途**: 操作规则类型定义
- **注解**: `@RequiredArgsConstructor`

**枚举值** (3个):

| 枚举名 | rule类型 | 说明 |
|-------|---------|------|
| `And` | `AndRule.class` | AND规则（所有条件都满足） |
| `Or` | `OrRule.class` | OR规则（满足任一条件） |
| `Spel` | `SpelRule.class` | SpEL表达式规则 |

**字段**:
```java
@Getter
private final Class<? extends IOperateRule> rule;  // 规则实现类
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `getRule()` | `Class<? extends IOperateRule>` | 获取规则实现类 |

---

#### 2.3.4 RecruitRole

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.enums.RecruitRole`
- **用途**: 招聘角色定义
- **注解**: `@RequiredArgsConstructor`

**枚举值** (4个):

| 枚举名 | roleCode | roleName | 说明 |
|-------|---------|---------|------|
| `Recruit_HRInterviewMan` | ["Recruit_HRInterviewMan", "RecruitmentManager", "#Recruit_HRInterviewMan", "#RecruitmentManager"] | "招聘经理" | 招聘经理角色 |
| `Recruit_ReInterviewer` | ["Recruit_InterviewMan", "Recruit_ReInterviewer", "Recruit_InterviewerNew", "#Recruit_InterviewerNew"] | "面试官" | 面试官角色 |
| `BP_Recruitment` | ["BP_Recruitment"] | "BP招聘管理" | BP招聘管理角色 |
| `Other` | [] | "普通用户" | 普通用户（默认） |

**字段**:
```java
@Getter
private final List<String> roleCode;  // 角色码列表
@Getter
private final String roleName;        // 角色名称
```

**公共方法** (3个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `getRoleCode()` | `List<String>` | 获取角色码列表 |
| `getRoleName()` | `String` | 获取角色名称 |
| `get(Collection<String> roles)` | `RecruitRole` | 根据角色码集合获取枚举（静态方法） |

**使用示例**:
```java
List<String> roles = Arrays.asList("Recruit_HRInterviewMan", "Other");
RecruitRole role = RecruitRole.get(roles);
// 结果: RecruitRole.Recruit_HRInterviewMan (匹配第一个符合的角色)
```

---

### 2.4 数据市场枚举

#### 2.4.1 DictType

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.market.enums.DictType`
- **用途**: 数据字典类型定义
- **接口实现**: `IDictType`
- **注解**: `@RequiredArgsConstructor`

**枚举值** (21个):

| 枚举名 | memo | 说明 |
|-------|------|------|
| `WorkYear` | "工作年限" | 工作年限字典 |
| `Education` | "学历" | 学历字典 |
| `Company` | "所属公司" | 所属公司字典 |
| `LanguageType` | "外语类别" | 外语类别字典 |
| `WorkNature` | "工作性质" | 工作性质字典 |
| `PostDemandType` | "岗位需求类型" | 岗位需求类型字典 |
| `ManageSubject` | "管理主体" | 管理主体字典 |
| `StaffType` | "员工类别" | 员工类别字典（招聘类型） |
| `WorkLocation` | "员工工作地" | 员工工作地字典 |
| `Country` | "国家" | 国家字典 |
| `Gender` | "性别" | 性别字典 |
| `Province` | "省份" | 省份字典 |
| `CountryCode` | "国家区号" | 国家区号字典 |
| `Learning` | "学习方式" | 学习方式字典 |
| `Kinship` | "亲属关系" | 亲属关系字典 |
| `ContractType` | "合同类型" | 合同类型字典 |
| `ManageType` | "管理类型" | 管理类型字典 |
| `ManageLevel` | "管理级别" | 管理级别字典 |
| `NoSalaryCertificate` | "没有薪资证明原因" | 没有薪资证明原因字典 |
| `Currency` | "币种" | 币种字典 |

**字段**:
```java
@Getter
private final String memo;  // 字典说明
```

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `getMemo()` | `String` | 获取字典说明 |

---

## 三、最佳实践建议

### 3.1 枚举使用规范

#### ✅ 推荐做法

```java
// 1. 使用静态方法获取枚举
InterviewManLevel level = InterviewManLevel.valueOf(levelId);
if (level != null) {
    // 处理逻辑
}

// 2. 使用枚举的方法
String redisKey = FrameworkRedisKey.HR_RIGHT_OPERATE.key(tenantKey, staffId);
long expire = FrameworkRedisKey.HR_RIGHT_OPERATE.expire();

// 3. 角色判断
RecruitRole role = RecruitRole.get(staffRoles);
switch (role) {
    case Recruit_HRInterviewMan:
        // 招聘经理逻辑
        break;
    case Recruit_ReInterviewer:
        // 面试官逻辑
        break;
    default:
        // 普通用户逻辑
}

// 4. 数据权限判断
DataScopeBean scope = DataScopeUtils.scope(DataScopeCode.Department, scopes);
```

#### ❌ 不推荐做法

```java
// 1. 不要硬编码枚举值
if (type == 1) { // ❌ 应该使用 InterviewManLevel.HRInterviewMan.getLevel()
    // ...
}

// 2. 不要忽略null检查
InterviewManLevel level = InterviewManLevel.valueOf(levelId);
String name = level.getName(); // ❌ 可能NPE

// 3. 不要直接使用字符串
String key = "recruit-framework:hr-right:operate:" + tenantKey + ":" + staffId;
// ❌ 应该使用 FrameworkRedisKey.HR_RIGHT_OPERATE.key(tenantKey, staffId)
```

### 3.2 常见问题

**Q1: valueOf方法返回null如何处理？**
```java
// 推荐：使用Optional
Optional.ofNullable(TencentChiefType.valueOf(id))
    .ifPresent(type -> {
        // 处理逻辑
    });

// 或者使用默认值
TencentChiefType type = Optional.ofNullable(TencentChiefType.valueOf(id))
    .orElse(TencentChiefType.Dept);
```

**Q2: 如何扩展枚举？**
- 枚举不支持继承，建议使用接口实现
- 例如：`DataScopeCode` implements `IDataScopeCode`

**Q3: 流程枚举如何使用？**
```java
// 配合效能平台配置使用
FlowStepType stepType = FlowStepType.SocialFlowStep;
// 从配置表中查询对应的流程配置
List<DataConfigDTO> configs = configService.findByCode(stepType.name());
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 初始创建枚举类索引文档 | v1.0 |

---
