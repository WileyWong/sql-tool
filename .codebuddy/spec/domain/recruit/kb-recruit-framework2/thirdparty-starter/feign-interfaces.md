# Feign接口索引文档

> **生成时间**: 2025-11-21  
> **项目**: RecruitCenterThirdPartyStarter  
> **说明**: 本文档列出项目中所有Feign接口及其方法

---

## 📋 Feign接口清单

### 1. RecruitEfficiencyFlowtraceFeign
**服务名**: hr-flowtrace-center  
**URL配置**: recruit-framework.recruit-efficiency-api  
**配置类**: RecruitEfficiencyFeignConfig

#### 接口方法（9个）
| 方法 | 路径 | 说明 |
|------|------|------|
| getDataConfig | /api/data-config/GetByCode | 根据Code获取配置信息 |
| getDataConfigItem | /api/data-config-item/GetByCode | 根据Code获取配置项 |
| listStatue | /api/flow-trace-status/list | 获取流程状态配置 |
| listStep | /api/flow-trace-step/list | 获取流程步骤配置 |
| listAction | /api/flow-trace-action/list | 获取流程动作配置 |
| listActionByStatus | /api/flow-trace-action/listByStatus | 根据状态获取流程动作 |
| listTree | /api/flow-trace-action/tree | 获取流程树配置 |
| treeActionByStatus | /api/flow-trace-action/treeByStatus | 获取流程树形配置 |
| listFlowTraceConfig | /api/flow-trace-config/list | 查询环节配置 |

---

### 2. TencentEfficiencyFlowtraceFeign
**服务名**: tencent-recruit-efficiency-flowtrace  
**URL配置**: recruit-framework.tencent-efficiency-api  
**配置类**: TencentEfficiencyFeignConfig  
**Profile**: dev, test, uat, prod

#### 接口方法（5个）
| 方法 | 路径 | 请求方式 | 说明 |
|------|------|----------|------|
| listInterviewManageDept | /permission/manage-department/list | POST | 获取招聘经理权限部门 |
| listDepartmentChild | /permission/manage-department-child/list | POST | 获取部门子部门 |
| listInterviewManagePost | /permission/interview-manage-post/list | GET | 获取招聘经理权限岗位 |
| listInterviewManageDeptPost | /permission/interview-manage-dept-post/list | GET | 获取招聘经理权限部门岗位 |
| pageRecruitPost | /permission/recruit-post/page | POST | 分页获取招聘岗位 |

---

### 3. CommonDataMarketFeign
**服务名**: recruit-standard-resource-service  
**URL配置**: recruit-framework.recruit-standard-resource-api  
**配置类**: RecruitDataMarketFeignConfig

#### 接口方法（16个）
| 方法 | 路径 | 说明 |
|------|------|------|
| getDictInfo | /api/remote/common-dict-info/{code}/get | 获取通用字典信息 |
| listPositionLevel | /api/remote/common-position-level/list | 获取职级列表 |
| listPositionType | /api/remote/common-position-type/list | 获取职位类型列表 |
| getCommonStaff | /api/remote/common-staff/get | 获取通用员工信息 |
| listParentCommonUnitId | /api/remote/common-unit/listParent | 获取父级组织 |
| listSonCommonUnit | /api/remote/common-unit/listSon | 获取子级组织 |
| listSonCommonUnitBatch | /api/remote/common-unit/listSon | 批量获取子级组织 |
| listCommonUnit | /api/remote/common-unit/list | 批量获取组织 |
| listCommonUnitAll | /api/remote/common-unit/listAll | 获取所有组织 |
| getCommonUnit | /api/remote/common-unit/get | 获取单个组织 |
| getIndustrySector | /api/remote/industry-sector/list | 获取行业领域 |
| listDictByCode | /api/remote/dict-info/listByCode | 批量获取字典 |
| listStandardPost | /api/remote/standard-post/list | 获取标准岗位 |
| listNationPhone | /api/remote/dict-info/listNationPhone | 获取国家电话区号 |

---

### 4. TenantDataMarketFeign
**服务名**: recruit-standard-resource-service  
**URL配置**: recruit-framework.recruit-standard-resource-api  
**Profile**: edev, etest, euat, eprod

#### 接口方法（15个）
| 方法 | 路径 | 请求方式 | 说明 |
|------|------|----------|------|
| createOrUpdateDictInfo | /api/remote/dict-info/{code}/createOrUpdate | POST | 创建或更新字典 |
| getStaffByGlobalId | /api/remote/staff-info/getByGlobalId | GET | 根据GlobalId获取员工 |
| listByGlobalId | /api/remote/staff-info/listByGlobalId | POST | 批量根据GlobalId获取员工 |
| install | /api/tool/app-install | POST | 安装应用 |
| syncTenant | /api/tool/syncTenant | GET | 同步租户 |
| listInterview | /api/remote/recruit-config/listInterview | GET | 获取面试配置 |
| listFlow | /api/remote/recruit-config/listFlow | GET | 获取流程配置 |
| listStep | /api/remote/recruit-config/listStep | GET | 获取步骤配置 |
| listManageLevel | /api/remote/manage-level/list | GET | 获取管理职级 |
| listByDataKeyValue | /api/remote/op-log/listByDataKeyValue | GET | 根据Key查询操作日志 |
| listByResumeId | /api/remote/op-log/listByResumeId | GET | 根据简历ID查询日志 |
| listStepAction | /api/remote/recruit-config/listStepAction | GET | 获取步骤动作 |
| getBaseTenantCompany | /api/remote/tenant-company/get | GET | 获取租户公司信息 |
| listBaseTenantCompany | /api/remote/tenant-company/list | POST | 批量获取租户公司 |

---

### 5. TencentDataMarketFeign
**服务名**: recruit-standard-resource-service  
**URL配置**: recruit-framework.recruit-standard-resource-api  
**Profile**: dev, test, uat, prod

#### 接口分类统计
- **字典接口**: 1个
- **员工接口**: 12个
- **组织接口**: 9个
- **招聘系统**: 6个
- **委托/面试官**: 4个
- **招聘经理**: 5个
- **角色/权限**: 18个
- **OA岗位**: 7个
- **其他**: 8个

**总计**: 70个接口方法

#### 主要接口方法

##### 员工相关（12个）
| 方法 | 说明 |
|------|------|
| getStaffById | 根据ID获取员工 |
| getStaffByName | 根据名称获取员工 |
| listStaffBasicById | 批量获取员工基础信息 |
| listStaffById | 批量获取员工详细信息 |
| listStaffByName | 根据名称批量获取员工 |
| listStaffBasicByName | 根据名称批量获取基础信息 |
| listPageByQuery | 分页查询员工 |
| listStaffIdByUnitId | 根据组织ID获取员工ID |
| listStaffByDeptId | 根据部门ID获取员工 |
| listStaffBasicByDeptId | 根据部门ID获取基础信息 |
| listPage | 分页获取所有员工 |

##### 组织相关（9个）
| 方法 | 说明 |
|------|------|
| getByUnitId | 根据ID获取组织 |
| listBasicByUnitId | 批量获取组织基础信息 |
| listAllDepartmentId | 获取所有部门ID |
| listDeptByUnitId | 获取部门列表 |
| getUnitSliceById | 获取组织切片（不过滤） |
| listUnitSliceById | 批量获取组织切片 |
| listAllBG | 获取所有BG |

##### 招聘系统（6个）
| 方法 | 说明 |
|------|------|
| listSystem | 获取招聘系统列表 |
| listClan | 获取职位族 |
| listLevel | 获取职级 |
| listGenus | 获取职位类 |
| listPosition | 获取职位 |
| listTencentPosition | 获取腾讯职位 |

##### 权限角色（18个）
包含BP Group、面试官、招聘经理、薪酬管理员、BP负责人、HRBP、招聘保密管理员、招聘负责人等角色的查询和权限范围获取

---

## 📊 统计信息

- **Feign接口总数**: 5个
- **接口方法总数**: 115个
- **环境Profile**: 
  - 腾讯环境（dev, test, uat, prod）: 2个接口
  - 租户环境（edev, etest, euat, eprod）: 1个接口
  - 通用环境: 2个接口

---

*文档生成完成*
