# Service服务类索引文档

> **生成时间**: 2025-11-21  
> **项目**: RecruitCenterThirdPartyStarter  
> **说明**: 本文档列出项目中所有Service服务类及其公共方法

---

## 📋 目录

- [1. 效率服务模块 (efficiency)](#1-效率服务模块-efficiency)
- [2. 文件服务模块 (file)](#2-文件服务模块-file)
- [3. 假期服务模块 (holiday)](#3-假期服务模块-holiday)
- [4. 数据市场服务模块 (market)](#4-数据市场服务模块-market)

---

## 1. 效率服务模块 (efficiency)

### 1.1 MicroService
**路径**: `efficiency/constants/MicroService.java`  
**类型**: 接口 (常量定义)

#### 常量定义
| 常量名 | 值 | 说明 |
|--------|-----|------|
| TENCENT_EFF | "tencent-recruit-efficiency-flowtrace" | 腾讯招聘效率流程追踪服务 |
| RECRUIT_EFF | "hr-flowtrace-center" | HR流程追踪中心服务 |
| RECRUIT_DATA_MARKET | "recruit-standard-resource-service" | 招聘标准资源服务 |
| BIDS_PLUS | "bidsplus-frontrepo" | Bids Plus前端仓库服务 |

---

### 1.2 RecruitConfigService
**路径**: `efficiency/service/RecruitConfigService.java`  
**类型**: 服务类  
**依赖**: RecruitEfficiencyFlowtraceFeign, RedisRecruitCache

#### 公共方法

##### 1.2.1 流程环节查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findStep(DefaultRecruitChannel channel)` | `List<FlowTraceConfigDTO>` | 根据渠道查询流程环节 |
| `findStatus(DefaultRecruitChannel channel)` | `List<FlowTraceConfigDTO>` | 根据渠道查询流程状态 |
| `findAction(DefaultRecruitChannel channel)` | `List<FlowTraceConfigDTO>` | 根据渠道查询流程动作 |
| `findActionByStatus(DefaultRecruitChannel, String)` | `List<FlowTraceConfigDTO>` | 根据渠道和状态码查询流程动作 |
| `treeActionByStatus(DefaultRecruitChannel, String)` | `List<FlowTraceTreeConfigDTO>` | 根据渠道和状态码查询流程动作树形结构 |
| `findTree(DefaultRecruitChannel channel)` | `List<FlowTraceConfigNodeDTO>` | 根据渠道查询流程树 |
| `listFlowTraceConfig(DefaultRecruitChannel)` | `List<FlowTraceConfigStepDTO>` | 查询环节配置 |

##### 1.2.2 数据配置查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findConfigByCode(String code)` | `DataConfigDTO` | 根据配置代码查询配置（支持Redis缓存） |
| `findConfigItemByCode(String code, String itemCode)` | `List<DataConfigItemDTO>` | 根据配置代码和子项代码查询配置项 |
| `findDeveloper()` | `List<String>` | 查询开发者列表（从FakeUserConfig获取） |

---

## 2. 文件服务模块 (file)

### 2.1 FileService
**路径**: `file/service/FileService.java`  
**类型**: 接口

#### 公共方法

##### 2.1.1 文件服务URL管理
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `getFileServiceUrl(String tenantKey)` | `String` | 获取文件服务URL |
| `signature(String, String, FileOperateAuthEnum, String...)` | `String` | 生成文件操作签名（带操作权限） |
| `signature(String tenantKey, String staffId)` | `String` | 生成文件操作签名（默认权限） |

##### 2.1.2 文件查看与上传
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `showViewUrl(Set<String> fileUuid)` | `Map<String, String>` | 批量获取文件预览URL |
| `showViewUrl(Set<String>, String)` | `Map<String, String>` | 批量获取文件预览URL（带参数） |
| `uploadImage(File file)` | `String` | 上传图片文件 |
| `uploadWorld(File file)` | `String` | 上传Word文件 |
| `checkConvertable(String uuid)` | `Boolean` | 检查文件是否可转换 |

---

## 3. 假期服务模块 (holiday)

### 3.1 HolidayService
**路径**: `holiday/service/HolidayService.java`  
**类型**: 接口

#### 公共方法

##### 3.1.1 假期日期查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `betweenByCache(LocalDate, LocalDate)` | `List<LocalDate>` | 查询日期范围内的假期（带缓存） |
| `betweenByCache(String, String)` | `List<String>` | 查询日期范围内的假期（带缓存，字符串） |
| `between(String, String)` | `List<String>` | 查询日期范围内的假期（字符串） |
| `between(LocalDate, LocalDate)` | `List<LocalDate>` | 查询日期范围内的假期 |

---

## 4. 数据市场服务模块 (market)

### 4.1 DataMarketRemoteService (接口)
**路径**: `market/service/DataMarketRemoteService.java`  
**类型**: 接口

#### 公共方法

##### 4.1.1 字典与基础数据
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findCommonDict(IDictType type)` | `CommonDictDTO` | 查询通用字典 |
| `findCommonDictByCode(Collection<String>)` | `Map<String, List<CommonDictItemDTO>>` | 批量查询通用字典项 |
| `findCommonLevel()` | `List<CommonPositionLevelDTO>` | 查询通用职级 |
| `findCommonPositionType()` | `List<CommonPositionTypeDTO>` | 查询通用职位类型 |
| `findCommonIndustrySector()` | `List<CommonIndustrySectorDTO>` | 查询通用行业板块 |
| `findNationPhone()` | `List<NationPhoneDTO>` | 查询国家电话区号 |

##### 4.1.2 人员信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findCommonStaff(Long staffId)` | `CommonStaffDTO` | 查询通用员工信息 |

##### 4.1.3 组织信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findParentCommonUnit(Long unitId)` | `List<CommonUnitDTO>` | 查询父级组织 |
| `findSonCommonUnit(Long unitId)` | `List<CommonUnitDTO>` | 查询子级组织 |
| `findCommonUnit(Collection<Long>)` | `List<CommonUnitDTO>` | 批量查询组织 |
| `findCommonUnit(Long unitId)` | `CommonUnitDTO` | 查询单个组织 |
| `findCommonUnitAll()` | `List<CommonUnitDTO>` | 查询所有组织 |

##### 4.1.4 标准岗位
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findCommonStandardPost()` | `List<CommonStandardPostDTO>` | 查询所有标准岗位 |
| `findCommonStandardPost(List<Long>)` | `List<CommonStandardPostDTO>` | 批量查询标准岗位 |

---

### 4.2 HRCDataRemoteService (接口)
**路径**: `market/service/HRCDataRemoteService.java`  
**类型**: 接口

#### 公共方法

##### 4.2.1 组织查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findUintAll(HRCUnitQueryDTO query)` | `List<HRCUnitDTO>` | 查询所有组织 |
| `findUnitListById(Collection<Long>)` | `List<HRCUnitDTO>` | 批量查询组织 |
| `findEnableUnitListById(Collection<Long>)` | `List<HRCUnitDTO>` | 批量查询启用的组织 |
| `findUnitById(Long unit)` | `HRCUnitDTO` | 查询单个组织 |
| `findEnableUnitById(Collection<Long>)` | `HRCUnitDTO` | 查询启用的组织 |

##### 4.2.2 HRBP查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findHrbpAll(HRHrbpQueryDTO query)` | `List<HRCHrbpDTO>` | 查询所有HRBP |

---

### 4.3 AbstractDataMarketRemoteService (抽象类)
**路径**: `market/service/impl/AbstractDataMarketRemoteService.java`  
**类型**: 抽象类  
**实现**: DataMarketRemoteService

#### 公共方法
> 实现了DataMarketRemoteService接口的所有方法，并提供了tenantKey()抽象方法供子类实现

##### 关键实现
- 所有查询方法都通过`commonFeign`调用远程服务
- 支持租户隔离（通过tenantKey()）
- 提供了默认的空值处理

---

### 4.4 TenantDataMarketRemoteService
**路径**: `market/service/impl/TenantDataMarketRemoteService.java`  
**类型**: 服务类  
**继承**: AbstractDataMarketRemoteService  
**依赖**: TenantDataMarketFeign, ITenantInfoHandler

#### 扩展方法

##### 4.4.1 租户管理
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `install(String, String, String)` | `void` | 安装应用到租户 |

##### 4.4.2 字典管理
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `createOrUpdateDictInfo(DictType, List<CommonDictItemDTO>)` | `void` | 创建或更新字典信息 |

##### 4.4.3 人员查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findByGlobalId(String globalId)` | `CommonStaffDTO` | 根据GlobalId查询员工 |
| `findByGlobalId(List<String>)` | `List<CommonStaffDTO>` | 批量根据GlobalId查询员工 |

##### 4.4.4 招聘配置
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findInterview()` | `List<RecruitInterviewConfigDTO>` | 查询面试配置 |
| `findFlowByRecruitTypeId(Integer)` | `List<RecruitFlowConfigDTO>` | 根据招聘类型ID查询流程 |
| `findStepByStatusId(Integer)` | `List<RecruitStepDictDTO>` | 根据状态ID查询招聘步骤 |
| `findManageLevel()` | `List<CommonManageLevelDTO>` | 查询管理职级 |

##### 4.4.5 操作日志
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findOplog(String, Object)` | `List<OpLogDTO>` | 查询操作日志 |
| `findOplog(String, Object, Boolean)` | `List<OpLogDTO>` | 查询操作日志（支持排序） |

##### 4.4.6 步骤动作
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findStepAction(Long, Long)` | `List<RecruitStepActionDTO>` | 查询步骤动作 |
| `findStepAction(Long stepId)` | `List<RecruitStepActionDTO>` | 查询步骤动作（默认流程） |

##### 4.4.7 公司与组织
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findTenantCompany(String)` | `BaseTenantCompanyDTO` | 查询租户公司信息 |
| `findTenantCompany(Collection<String>)` | `List<BaseTenantCompanyDTO>` | 批量查询租户公司信息 |
| `findSonCommonUnit(Collection<Long>)` | `List<CommonUnitDTO>` | 批量查询子组织 |

---

### 4.5 TencentDataMarketRemoteService
**路径**: `market/service/impl/TencentDataMarketRemoteService.java`  
**类型**: 服务类  
**继承**: AbstractDataMarketRemoteService  
**依赖**: TencentDataMarketFeign

#### 扩展方法（腾讯专用）

##### 4.5.1 字典信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findDictInfo(IDictType code)` | `DictDTO` | 获取招聘配置信息 |

##### 4.5.2 员工信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findStaffById(Long staffId)` | `StaffDTO` | 根据用户ID获取用户信息 |
| `findStaffByName(String name)` | `StaffDTO` | 根据用户名获取用户信息 |
| `findStaffBasicListById(Collection<Long>)` | `List<StaffBasicDTO>` | 批量获取用户基础信息（按ID） |
| `findStaffById(Collection<Long>)` | `List<StaffDTO>` | 批量获取用户详细信息（按ID） |
| `findStaffByName(Collection<String>)` | `List<StaffDTO>` | 批量获取用户详细信息（按名称） |
| `findStaffBasicByName(Collection<String>)` | `List<StaffBasicDTO>` | 批量获取用户基础信息（按名称） |
| `findStaff(StaffQueryDTO query)` | `PageDTO<StaffDTO>` | 分页查询员工 |
| `findStaffId(Set<Long> unit)` | `List<Long>` | 根据组织ID获取员工ID |
| `findListByDeptId(Collection<Long>)` | `List<StaffDTO>` | 根据部门ID批量获取用户详细信息 |
| `findBasicListByDeptId(Collection<Long>)` | `List<StaffBasicDTO>` | 根据部门ID批量获取用户基础信息 |
| `findStaffAll(int page, int row)` | `PageDTO<StaffDTO>` | 分页获取所有员工 |

##### 4.5.3 组织信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findAllDepartmentId(Collection<Long>)` | `List<Long>` | 查询组织下所有部门ID |
| `findUnitByUnitId(Collection<Long>)` | `List<UnitDTO>` | 根据组织ID查询组织信息（过滤虚拟和失效） |
| `findUnitSliceByUnitId(Collection<Long>)` | `List<UnitDTO>` | 根据ID获取组织信息（不过滤） |
| `findUnitSliceByUnitId(Long id)` | `UnitDTO` | 根据ID获取组织信息（不过滤） |
| `findUnitByUnitId(Long unitId)` | `UnitDTO` | 根据组织ID获取组织信息 |
| `findAllDepartment(Long unitId)` | `List<UnitDTO>` | 查询组织下所有部门 |
| `findAllBG()` | `List<CommonUnitDTO>` | 获取所有BG |

##### 4.5.4 招聘系统配置
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findAllSystem()` | `List<RecruitSystemDTO>` | 获取招聘系统配置 |
| `findClanBySystemId(Long systemId)` | `List<PositionClanDTO>` | 根据系统ID获取职位族 |
| `findLevelByClanId(Long clanId)` | `List<PositionLevelDTO>` | 根据职位族ID获取职级 |
| `findGenusByClanId(Long clanId)` | `List<PositionGenusDTO>` | 根据职位族ID获取职位类 |
| `findPositionByGenus(Long genusId)` | `List<PositionDTO>` | 根据职位类ID获取职位 |
| `findTencentPosition()` | `List<PositionDTO>` | 获取腾讯职位 |

##### 4.5.5 委托与面试官
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findDeputeByStaffId(Long staffId)` | `List<DeputeDTO>` | 获取用户的委托配置 |
| `findAllInterviewMan()` | `List<InterviewManDTO>` | 获取所有面试官 |
| `findInterviewManByLevel(InterviewManLevel...)` | `List<InterviewManDTO>` | 根据级别获取面试官 |
| `findInterviewManByUnitId(Collection<Long>)` | `List<InterviewManDTO>` | 根据部门ID获取面试官 |

##### 4.5.6 招聘角色
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findRecruitRole(Long staffId)` | `RecruitRole` | 获取员工的招聘角色 |

##### 4.5.7 招聘经理
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findHrManagerByStaffIdAndUnitId(Long, Long)` | `RecruitmentManagerDTO` | 根据用户ID和部门ID查询招聘经理 |
| `findHrManagerByUnitId(Long unitId)` | `List<RecruitmentManagerDTO>` | 根据组织ID获取招聘经理 |
| `findFlowHrManagerByUnitId(Long)` | `List<RecruitmentManagerDTO>` | 根据部门ID获取流程配置的招聘经理 |
| `findHrdFlowByUnitId(Long unitId)` | `List<RecruitmentManagerDTO>` | 根据组织ID获取HRD流程 |
| `findBGHrdFlowByUnitId(Long)` | `List<RecruitmentManagerDTO>` | 根据组织ID获取BG HRD流程 |

##### 4.5.8 公司与地点
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findCompanyGrade()` | `List<CompanyGradeDTO>` | 获取公司等级信息 |
| `findWorkLocation()` | `List<WorkLocationDTO>` | 获取工作地点 |
| `findDictLocation()` | `List<DictLocationDTO>` | 获取字典地点 |

##### 4.5.9 组织领导
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findRecruitmentDepartmentLeader(Long)` | `List<StaffDTO>` | 获取招聘部门领导 |
| `findRecruitmentLeader(Long staffId)` | `DataScopeBean` | 获取招聘领导数据范围 |

##### 4.5.10 职级信息
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findTencentManageLevel()` | `List<PositionLevelDTO>` | 获取所有管理职级 |
| `findTencentProfessionalLevel()` | `List<PositionLevelDTO>` | 获取所有专业职级 |

##### 4.5.11 OA岗位
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findOaPostById(Long postId)` | `OaPostDTO` | 根据ID获取OA岗位 |
| `findOaPostById(Collection<Long>)` | `List<OaPostDTO>` | 批量获取OA岗位 |
| `findOaPostByStaffId(Collection<Long>)` | `List<StaffRelationDTO>` | 获取员工的汇报关系 |
| `findOaPostByUnitId(Long unitId)` | `List<OaPostDTO>` | 根据组织ID获取OA岗位 |
| `findOaPostByUnitId(Collection<Long>)` | `List<OaPostDTO>` | 批量根据组织ID获取OA岗位 |
| `findChiefSecretaryByUnitId(Long)` | `List<UnitChiefSecretaryDTO>` | 根据组织ID获取首席秘书 |

##### 4.5.12 权限角色查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findBpGroup(Long deptId, Boolean upFlag)` | `RecruitRoleDTO` | 获取BP_GROUP标准角色 |
| `findInterviewMan(Long, Boolean)` | `RecruitRoleDTO` | 获取部门面试官 |
| `findBpLeader(Long deptId, Boolean upFlag)` | `RecruitRoleDTO` | 获取BP负责人 |
| `findHrbp(Long, Integer, Boolean)` | `RecruitRoleDTO` | 获取HRBP（支持角色代码） |
| `findInterviewManager(Long, Boolean)` | `RecruitRoleDTO` | 获取招聘经理 |
| `findPayAdmin(Long deptId, Boolean upFlag)` | `RecruitRoleDTO` | 获取薪酬负责人 |
| `findSensitiveAdmin(Long, Boolean)` | `RecruitRoleDTO` | 获取招聘保密管理员 |
| `findRecruitmentHead(Long, Boolean)` | `RecruitRoleDTO` | 获取招聘负责人 |

##### 4.5.13 权限范围查询
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findBpGroup(Long staffId)` | `DataScopeBean` | 获取BP_GROUP权限范围 |
| `findPayAdmin(Long staffId)` | `DataScopeBean` | 获取薪酬负责人权限范围 |
| `findInterviewManager(Long)` | `DataScopeBean` | 获取招聘经理权限范围 |
| `findInterviewMan(Long staffId)` | `DataScopeBean` | 获取面试官权限范围 |
| `findBpLeader(Long staffId)` | `DataScopeBean` | 获取BP负责人权限范围 |
| `findSensitiveAdmin(Long)` | `DataScopeBean` | 获取招聘保密管理员权限范围 |
| `findRecruitmentHead(Long)` | `DataScopeBean` | 获取招聘负责人权限范围 |

##### 4.5.14 招聘标签
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `findRecruitTagByCode(String code)` | `List<RecruitTagDTO>` | 根据代码获取招聘标签 |

---

## 📊 统计信息

- **服务类总数**: 9
- **接口数**: 3
- **抽象类数**: 1
- **实现类数**: 2
- **常量类数**: 1
- **核心服务类数**: 2

## 🔗 服务依赖关系

```
AbstractDataMarketRemoteService (抽象类)
    ├── TenantDataMarketRemoteService (租户数据市场服务)
    └── TencentDataMarketRemoteService (腾讯数据市场服务)
```

---

## 📝 使用说明

1. **效率服务**: 主要用于招聘流程追踪、配置管理
2. **文件服务**: 提供文件上传、预览、签名等功能
3. **假期服务**: 查询节假日信息，支持缓存
4. **数据市场服务**: 
   - 提供员工、组织、职位等基础数据查询
   - 支持租户隔离
   - 分腾讯版和租户版两种实现

## 🎯 关键特性

- **租户隔离**: 通过tenantKey区分不同租户
- **缓存支持**: 部分查询方法支持Redis缓存
- **批量操作**: 大部分方法都支持批量查询
- **权限管理**: 提供完善的权限范围查询功能
- **灵活扩展**: 通过抽象类和接口支持不同实现

---

*文档生成完成*
