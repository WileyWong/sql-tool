# DTO对象索引文档

> **文档说明**: 本文档为 `RecruitCenterThirdPartyStarter` 项目DTO对象的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `efficiency.dto`, `market.dto`  
> **文件总数**: 62个+

---

## 📑 目录

- [一、DTO对象概览](#一dto对象概览)
- [二、效能平台DTO](#二效能平台dto)
- [三、数据市场DTO](#三数据市场dto)
- [四、最佳实践建议](#四最佳实践建议)

---

## 一、DTO对象概览

### 1.1 按模块分类

| 模块 | DTO数量 | 主要用途 |
|------|---------|---------|
| **efficiency.dto** | 12个 | 效能平台数据传输 |
| **market.dto** | 50+个 | 数据市场数据传输 |

### 1.2 按功能分类

| 功能分类 | DTO数量 | 说明 |
|---------|---------|------|
| 流程配置 | 8个 | FlowTrace相关配置 |
| 数据配置 | 2个 | DataConfig字典配置 |
| 权限部门 | 2个 | Permission相关 |
| 员工信息 | 3个 | Staff相关 |
| 组织信息 | 4个 | Unit相关 |
| 岗位职位 | 5个 | Position/Post相关 |
| 招聘配置 | 8个 | Recruit配置 |
| 字典数据 | 8个 | Dict相关 |
| 其他 | 22个+ | 各类业务DTO |

---

## 二、效能平台DTO

### 2.1 DataConfigDTO - 数据字典项

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.dto.DataConfigDTO`
- **注解**: `@Data`, `@Accessors(chain = true)`, `@ApiModel`
- **用途**: 效能平台数据字典配置

**字段列表** (5个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `id` | `Long` | `@ApiModelProperty` | ID主键 |
| `code` | `String` | `@ApiModelProperty` | 识别码 |
| `name` | `String` | `@ApiModelProperty` | 名称 |
| `description` | `String` | `@ApiModelProperty` | 描述 |
| `items` | `List<DataConfigItemDTO>` | `@ApiModelProperty` | 字典子项 |

**公共方法**:
- Lombok生成的getter/setter方法
- 链式调用方法（chain = true）

---

### 2.2 DataConfigItemDTO - 数据字典子项

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.dto.DataConfigItemDTO`
- **注解**: `@Data`, `@Accessors(chain = true)`

**字段列表** (8个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `id` | `Long` | `@ApiModelProperty` | ID主键 |
| `code` | `String` | `@ApiModelProperty` | 识别码 |
| `name` | `String` | `@ApiModelProperty` | 名称 |
| `description` | `String` | `@ApiModelProperty` | 描述 |
| `parentId` | `Long` | `@ApiModelProperty` | 父级ID |
| `sort` | `Integer` | `@ApiModelProperty` | 排序 |
| `enableFlag` | `Boolean` | `@ApiModelProperty` | 是否启用 |
| `extend` | `String` | `@ApiModelProperty` | 扩展字段 |

---

### 2.3 FlowTraceConfigDTO - 流程跟踪配置

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.dto.FlowTraceConfigDTO`
- **注解**: `@Data`, `@Accessors(chain = true)`

**字段列表** (5个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `name` | `String` | `@XssIgnore`, `@ApiModelProperty` | 名称 |
| `code` | `String` | `@XssIgnore`, `@ApiModelProperty` | 编码 |
| `items` | `List<FlowTraceConfigItemDTO>` | `@ApiModelProperty` | 对应的流程配置 |
| `monitor` | `Integer` | `@ApiModelProperty` | 抵达预警夏线的天数（工作日） |
| `nature` | `Boolean` | `@ApiModelProperty` | 天数单位 0自然日 1工作日 |

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `check(Integer flowId, Integer stateId, Integer stepId)` | `boolean` | 检查流程配置是否匹配 |
| `check(Integer flowId, Integer stepId)` | `boolean` | 检查流程配置是否匹配（简化版） |

---

### 2.4 FlowTraceConfigItemDTO - 流程跟踪配置项

**字段列表** (11个):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `flowId` | `Integer` | 流程ID |
| `stateId` | `Integer` | 状态ID |
| `stepId` | `Integer` | 步骤ID |
| `name` | `String` | 名称 |
| `code` | `String` | 编码 |
| `nodes` | `List<FlowTraceConfigNodeDTO>` | 节点配置 |
| `steps` | `List<FlowTraceConfigStepDTO>` | 步骤配置 |
| `monitor` | `Integer` | 预警天数 |
| `nature` | `Boolean` | 天数单位 |
| `sort` | `Integer` | 排序 |
| `enableFlag` | `Boolean` | 是否启用 |

**公共方法**: `check()`方法用于配置匹配

---

### 2.5 其他效能平台DTO

| DTO类名 | 用途 | 主要字段 |
|---------|------|---------|
| `FlowTraceConfigNodeDTO` | 流程节点配置 | flowId, stateId, name, code |
| `FlowTraceConfigStepDTO` | 流程步骤配置 | flowId, stepId, name, code, monitor, nature |
| `FlowTraceTreeConfigDTO` | 流程树配置 | 树形结构数据 |
| `DeptQueryDTO` | 部门查询 | deptId, deptName |
| `PermissionDeptDTO` | 权限部门 | deptId, deptName, enableFlag |
| `PermissionDeptPostDTO` | 部门岗位权限 | deptId, postId |
| `PermissionPostDTO` | 岗位权限 | postId, postName, enableFlag |
| `RecruitPostRequestDTO` | 招聘岗位请求 | postId, postName, status |

---

## 三、数据市场DTO

### 3.1 StaffDTO - 员工信息

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.market.dto.StaffDTO`
- **继承**: `extends StaffBasicDTO`
- **注解**: `@Data`

**字段列表** (60+个):

#### 基础信息字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `guid` | `String` | 用户GUID |
| `careerLevelId` | `Integer` | 职级ID |
| `careerLevelName` | `String` | 职级名称 |
| `genderId` | `Integer` | 性别ID |
| `genderName` | `String` | 性别名称 |
| `positionId` | `Integer` | 职位ID |
| `positionName` | `String` | 职位名称 |
| `postId` | `Integer` | 岗位ID |
| `postName` | `String` | 岗位名称 |

#### 组织信息字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `unitId` | `Integer` | 组织ID |
| `unitName` | `String` | 组织名称 |
| `unitFullName` | `String` | 组织全称 |
| `deptId` | `Integer` | 部门ID |
| `deptName` | `String` | 部门名称 |
| `workLocationId` | `Long` | 工作地ID |
| `workLocationName` | `String` | 工作地名称 |

#### 人员状态字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `staffTypeId` | `Integer` | 用户类别 |
| `staffTypeName` | `String` | 用户类别名称 |
| `status` | `Integer` | 用户状态 |
| `statusName` | `String` | 用户状态名称 |
| `enableFlag` | `Boolean` | 是否有效 |

#### 管理信息字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `leaderId` | `Long` | 上级ID |
| `leaderName` | `String` | 上级全称 |
| `managerAttributeId` | `Integer` | 管理属性ID |
| `managerAttributeName` | `String` | 管理属性名称 |
| `manageClassId` | `Integer` | 管理类型ID |
| `manageClassName` | `String` | 管理类型名称 |
| `manageLevelName` | `String` | 管理级别名称 |
| `managerUnitId` | `String` | 管理主体Id |
| `managerUnitName` | `String` | 管理主体名称 |
| `managerLevelId` | `Integer` | 管理职级ID |
| `managerLevelName` | `String` | 管理职级名称 |

#### 时间字段

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `formalTime` | `LocalDateTime` | `@JsonFormat` | 转正时间 |
| `hireTime` | `LocalDateTime` | `@JsonFormat` | 入职时间 |
| `dimissionTime` | `LocalDateTime` | `@JsonFormat` | 离职时间 |
| `birthDate` | `LocalDate` | `@JsonFormat` | 生日 |

#### 其他字段

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `contractCompanyId` | `Integer` | 合同公司ID |
| `contractCompanyName` | `String` | 合同公司名称 |
| `contractTypeId` | `Integer` | 合同类型ID |
| `contractTypeName` | `String` | 合同类型名称 |
| `workPhone` | `String` | 工作分机号 |
| `channelText` | `String` | 渠道 |
| `recruitCaseId` | `String` | 招聘caseId |
| `highestEducationSchool` | `String` | 最高学历学校 |
| `highestEducationMajor` | `String` | 最高学历专业 |
| `highestEducationLevelId` | `String` | 最高学历ID |
| `highestEducationLevelName` | `String` | 最高学历 |
| `tutorIds` | `String` | 导师ID |

**公共方法**:
- Lombok生成的getter/setter方法
- 继承自`StaffBasicDTO`的方法

---

### 3.2 UnitDTO - 组织信息

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.market.dto.UnitDTO`
- **注解**: `@Data`, `@ApiModel(description = "组织信息")`

**字段列表** (33个):

#### 基础信息

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `unitId` | `Long` | 组织ID |
| `unitName` | `String` | 组织名称 |
| `unitFullName` | `String` | 组织全称 |
| `fullPath` | `String` | 组织路径 |
| `sequenceNum` | `Integer` | 组织序列号：1：部门 |
| `level` | `Integer` | 组织层级深度 |
| `parentId` | `Long` | 上一级的组织ID |

#### 位置信息

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `locationId` | `Integer` | 组织所在地的ID |
| `locationName` | `String` | 组织所在地的名称 |

#### 状态信息

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `enableFlag` | `Boolean` | 组织是否有效 |
| `beginTime` | `LocalDateTime` | 组织生效时间 |
| `virtual` | `Boolean` | 组织是否是虚拟组织 |
| `emailGroup` | `String` | 组织所在的邮件组 |

#### BG/Line/Dept/Center信息

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `bgUnitId` | `Long` | 所在BG组织ID |
| `bgLeaderId` | `Long` | 所在BG组织负责人ID |
| `bgLeader` | `String` | 所在BG组织负责人全称 |
| `lineUnitId` | `Long` | 所在line组织ID |
| `lineLeaderId` | `Long` | 所在line组织负责人ID |
| `lineLeader` | `String` | 所在line组织负责人全称 |
| `deptUnitId` | `Long` | 所在部门组织ID |
| `deptLeaderId` | `Long` | 所在部门组织负责人ID |
| `deptLeader` | `String` | 所在部门组织负责人全称 |
| `centerUnitId` | `Long` | 所在中心组织ID |
| `centerLeaderId` | `Long` | 所在中心组织负责人ID |
| `centerLeader` | `String` | 所在中心组织负责人全称 |

#### 负责人信息

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `leaderId` | `Long` | 组织负责人ID |
| `leader` | `String` | 组织负责人全称 |

---

### 3.3 数据市场DTO清单

#### 员工相关 (3个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `StaffDTO` | 60+个字段（见上） | 员工完整信息 |
| `StaffBasicDTO` | staffId, staffName, email | 员工基础信息 |
| `CommonStaffDTO` | staffId, staffName | 通用员工信息 |

#### 组织相关 (4个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `UnitDTO` | 33个字段（见上） | 组织完整信息 |
| `CommonUnitDTO` | unitId, unitName | 通用组织信息 |
| `UnitRequestDTO` | unitId | 组织请求参数 |
| `HRCUnitDTO` | unitId, unitName, unitType | HRC组织信息 |

#### 岗位职位相关 (5个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `PositionDTO` | positionId, positionName, positionLevel | 职位信息 |
| `PositionLevelDTO` | levelId, levelName | 职位级别 |
| `PositionClanDTO` | clanId, clanName | 职位族 |
| `PositionGenusDTO` | genusId, genusName | 职位属 |
| `OaPostDTO` | postId, postName, postType | OA岗位 |

#### 招聘配置相关 (8个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `RecruitFlowConfigDTO` | flowId, flowName, flowType | 招聘流程配置 |
| `RecruitStepConfigDTO` | stepId, stepName, stepType | 招聘步骤配置 |
| `RecruitStepActionDTO` | actionId, actionName | 步骤操作配置 |
| `RecruitActionConfigDTO` | actionId, actionName | 操作配置 |
| `RecruitFinishConfigDTO` | finishId, finishName | 结束配置 |
| `RecruitInterviewConfigDTO` | interviewId, interviewName | 面试配置 |
| `RecruitStepDictDTO` | dictId, dictName | 步骤字典 |
| `RecruitSystemDTO` | systemId, systemName | 招聘系统 |

#### 字典相关 (8个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `DictDTO` | dictId, dictName, dictType | 字典 |
| `DictItemDTO` | itemId, itemName, dictId | 字典项 |
| `CommonDictDTO` | dictId, dictName | 通用字典 |
| `CommonDictItemDTO` | itemId, itemName | 通用字典项 |
| `DictLocationDTO` | locationId, locationName | 地点字典 |
| `NationPhoneDTO` | nationId, phoneCode | 国家区号 |
| `CompanyGradeDTO` | gradeId, gradeName | 公司等级 |
| `WorkLocationDTO` | locationId, locationName | 工作地点 |

#### 人员管理相关 (6个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `InterviewManDTO` | staffId, staffName, level | 面试官 |
| `RecruitManagerDTO` | managerId, managerName | 招聘经理 |
| `RecruitmentManagerDTO` | managerId, managerName | 招聘管理者 |
| `HRCHrbpDTO` | hrbpId, hrbpName | HRBP |
| `DeputeDTO` | deputeId, deputeName | 委派信息 |
| `UnitChiefSecretaryDTO` | chiefId, secretaryId | 组织负责人秘书 |

#### 其他 (16个)

| DTO类名 | 主要字段 | 用途 |
|---------|---------|------|
| `PageDTO` | pageNum, pageSize, total | 分页数据 |
| `PageRequestDTO` | pageNum, pageSize | 分页请求 |
| `OpLogDTO` | logId, operateType, operateContent | 操作日志 |
| `AppInstallDTO` | appId, tenantId | 应用安装 |
| `BaseTenantCompanyDTO` | tenantId, companyId | 租户公司 |
| `CommonIndustrySectorDTO` | sectorId, sectorName | 行业部门 |
| `CommonManageLevelDTO` | levelId, levelName | 管理级别 |
| `CommonPositionLevelDTO` | levelId, levelName | 职位级别 |
| `CommonPositionTypeDTO` | typeId, typeName | 职位类型 |
| `CommonStandardPostDTO` | postId, postName | 标准岗位 |
| `HRCUnitQueryDTO` | unitId, unitName | 组织查询 |
| `HRHrbpQueryDTO` | hrbpId, unitId | HRBP查询 |
| `RecruitTagDTO` | tagId, tagName | 招聘标签 |
| `RecruitRoleDTO` | roleId, roleName | 招聘角色 |
| `StaffRelationDTO` | staffId, relationType | 员工关系 |

---

## 四、最佳实践建议

### 4.1 DTO使用规范

#### ✅ 推荐做法

```java
// 1. 使用Lombok简化代码
@Data
@Accessors(chain = true)
public class MyDTO {
    private Long id;
    private String name;
}

// 2. 链式调用
MyDTO dto = new MyDTO()
    .setId(1L)
    .setName("test");

// 3. 日期格式化
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
private LocalDateTime createTime;

// 4. API文档注解
@ApiModelProperty("用户ID")
private Long userId;

// 5. 继承复用
public class ExtendedDTO extends BaseDTO {
    // 扩展字段
}
```

#### ❌ 不推荐做法

```java
// 1. 不要在DTO中包含业务逻辑
public class UserDTO {
    public void saveToDatabase() { } // ❌
}

// 2. 不要使用可变集合作为返回值
public List<String> getTags() {
    return tags; // ❌ 应该返回不可变集合
}

// 3. 不要忽略序列化版本号
public class MyDTO implements Serializable {
    // ❌ 缺少 serialVersionUID
}
```

### 4.2 常见问题

**Q1: 日期字段如何序列化？**
```java
// 使用@JsonFormat注解
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
private LocalDateTime createTime;

@JsonFormat(pattern = "yyyy-MM-dd")
private LocalDate birthDate;
```

**Q2: 如何实现链式调用？**
```java
// 使用@Accessors(chain = true)
@Data
@Accessors(chain = true)
public class MyDTO {
    private String name;
}

// 使用
MyDTO dto = new MyDTO().setName("test").setId(1L);
```

**Q3: DTO之间如何转换？**
```java
// 推荐使用MapStruct或BeanUtils
// Spring BeanUtils
BeanUtils.copyProperties(source, target);

// MapStruct (编译时生成)
@Mapper
public interface DtoMapper {
    UserDTO toDTO(User user);
}
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 初始创建DTO对象索引文档 | v1.0 |

---
