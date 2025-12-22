# 其他集成服务 API

> **领域**: Integration | **版本**: v1.9

本文档汇总招聘协同平台的其他集成服务 API，包括活水平台、资源管理、HR 系统集成等。

---

## 📋 服务目录

- [活水平台](#活水平台)
- [资源管理](#资源管理)
- [招聘成本](#招聘成本)
- [申请管理](#申请管理)
- [HR 系统集成](#hr-系统集成)
- [其他服务](#其他服务)

---

## 活水平台

### HuoShuiPostApi

**服务名称**: 活水岗位服务

#### 功能说明

提供活水平台的岗位管理功能：
- 岗位发布
- 岗位查询
- 岗位状态管理

---

### HuoShuiWeChatApi

**服务名称**: 活水微信服务

#### 功能说明

提供活水平台的微信集成功能：
- 微信消息推送
- 微信小程序集成

---

### HuoShuiPortalConfigApi

**服务名称**: 活水门户配置服务

#### 功能说明

提供活水平台的门户配置管理功能：
- 门户页面配置
- 展示内容管理

---

## 资源管理

### WechatManagerIntApi

**服务名称**: 微信管理服务  
**配置类**: `ResourceManageFeignConfig`

#### 功能说明

提供微信资源管理功能。

---

### ChannelStaffIntApi

**服务名称**: 渠道员工服务  
**配置类**: `ResourceManageFeignConfig`

#### 功能说明

提供渠道员工管理功能。

---

### LandingPageIntApi

**服务名称**: 落地页服务  
**配置类**: `ResourceManageFeignConfig`

#### 功能说明

提供落地页配置和管理功能：
- 落地页模板管理
- 落地页数据统计

---

### ResourceManageTaskIntApi

**服务名称**: 资源管理任务服务  
**配置类**: `ResourceManageFeignConfig`

#### 功能说明

提供资源管理任务调度功能：
- 定时任务管理
- 任务执行监控

---

## 招聘成本

### RecruitCostApi

**服务名称**: 招聘成本服务

#### 功能说明

提供招聘成本统计和管理功能：
- 成本录入
- 成本统计
- 成本分析报表

**相关事件**: [RecruitCostEvent](./domain-events-summary.md#招聘成本事件)

#### 使用示例

```java
@Autowired
private RecruitCostApi recruitCostApi;

/**
 * 查询招聘成本
 */
public void queryCost(Integer postId, LocalDate startDate, LocalDate endDate) {
    CostQueryDTO query = new CostQueryDTO();
    query.setPostId(postId);
    query.setStartDate(startDate);
    query.setEndDate(endDate);
    
    Result<List<RecruitCostDTO>> result = recruitCostApi.queryCost(query);
    if (result.isSuccess()) {
        result.getData().forEach(cost -> {
            log.info("成本项: {}, 金额: {}", cost.getCostType(), cost.getAmount());
        });
    }
}
```

---

## 申请管理

### ApplyPostApi

**服务名称**: 岗位申请服务

#### 功能说明

提供岗位申请管理功能：
- 申请提交
- 申请审批
- 申请状态查询

#### 使用示例

```java
@Autowired
private ApplyPostApi applyPostApi;

/**
 * 提交岗位申请
 */
public void submitApply(PostApplyDTO apply) {
    Result<Long> result = applyPostApi.submitApply(apply);
    if (result.isSuccess()) {
        Long applyId = result.getData();
        log.info("岗位申请提交成功，申请 ID: {}", applyId);
    }
}
```

---

## HR 系统集成

### HCApi

**服务名称**: HC 管理服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供人力编制（HC）管理功能：
- HC 查询
- HC 申请
- HC 使用统计

#### 使用示例

```java
@Autowired
private HCApi hcApi;

/**
 * 查询部门 HC
 */
public void queryDeptHC(Integer deptId) {
    Result<HCInfoDTO> result = hcApi.getDeptHC(deptId);
    if (result.isSuccess()) {
        HCInfoDTO hc = result.getData();
        log.info("部门 {} HC 总数: {}, 已用: {}, 可用: {}",
            deptId, hc.getTotalHC(), hc.getUsedHC(), hc.getAvailableHC());
    }
}
```

---

### HrmApi

**服务名称**: HRM 系统集成  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供与 HRM 系统的数据交互功能：
- 员工信息同步
- 组织架构同步
- 入职信息同步

---

### CoreHrIntApi

**服务名称**: 核心人事服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供核心人事数据查询功能：
- 员工基本信息
- 部门信息
- 岗位信息

#### 使用示例

```java
@Autowired
private CoreHrIntApi coreHrIntApi;

/**
 * 查询员工信息
 */
public void queryStaffInfo(Integer staffId) {
    Result<StaffInfoDTO> result = coreHrIntApi.getStaffInfo(staffId);
    if (result.isSuccess()) {
        StaffInfoDTO staff = result.getData();
        log.info("员工: {}, 部门: {}, 岗位: {}",
            staff.getStaffName(), staff.getDeptName(), staff.getPostName());
    }
}
```

---

## 其他服务

### SelectionApi

**服务名称**: 选拔服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供人才选拔流程管理功能。

---

### TraceApi

**服务名称**: 追踪服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供业务流程追踪功能：
- 流程追踪记录
- 操作日志查询

---

### PortalApi

**服务名称**: 门户服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供门户页面配置和管理功能。

---

### RIOEventApi

**服务名称**: RIO 事件服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供 RIO 系统事件集成功能。

---

### InterviewFlowApplyApi

**服务名称**: 面试流程申请服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供面试流程申请管理功能。

---

### AdvertiseCollaborationIntApi

**服务名称**: 广告协同服务  
**配置类**: `RecruitFeignHeaderInterceptor`

#### 功能说明

提供广告投放协同管理功能：
- 广告投放管理
- 广告效果统计

---

## 📊 数据模型

### CostQueryDTO

```java
public class CostQueryDTO {
    private Integer postId;           // 岗位 ID
    private LocalDate startDate;      // 开始日期
    private LocalDate endDate;        // 结束日期
    private List<String> costTypes;   // 成本类型列表
}
```

### RecruitCostDTO

```java
public class RecruitCostDTO {
    private Long costId;              // 成本 ID
    private Integer postId;           // 岗位 ID
    private String costType;          // 成本类型
    private BigDecimal amount;        // 金额
    private Date costDate;            // 成本日期
    private String remark;            // 备注
}
```

### HCInfoDTO

```java
public class HCInfoDTO {
    private Integer deptId;           // 部门 ID
    private String deptName;          // 部门名称
    private Integer totalHC;          // 总 HC
    private Integer usedHC;           // 已用 HC
    private Integer availableHC;      // 可用 HC
}
```

### StaffInfoDTO

```java
public class StaffInfoDTO {
    private Integer staffId;          // 员工 ID
    private String staffName;         // 员工姓名
    private Integer deptId;           // 部门 ID
    private String deptName;          // 部门名称
    private String postName;          // 岗位名称
    private String email;             // 邮箱
    private String mobile;            // 手机号
}
```

### PostApplyDTO

```java
public class PostApplyDTO {
    private Integer postId;           // 岗位 ID
    private String applyReason;       // 申请原因
    private Integer applicantId;      // 申请人 ID
    private Date applyTime;           // 申请时间
}
```

---

## ⚠️ 注意事项

### 1. 服务依赖

- 活水平台服务需要单独配置和授权
- HR 系统集成需要网络互通
- 部分服务可能有访问频率限制

### 2. 数据同步

- 员工信息同步通常有延迟（T+1）
- 组织架构变更建议定时同步
- HC 数据实时性要求高，需要即时查询

### 3. 错误处理

- 外部系统可能不稳定，建议实现降级逻辑
- 关键数据建议本地缓存
- 超时设置需要合理配置

---

## 💡 最佳实践

### HR 数据同步服务

```java
@Service
public class HrDataSyncService {
    
    @Autowired
    private CoreHrIntApi coreHrIntApi;
    
    @Autowired
    private HrmApi hrmApi;
    
    /**
     * 同步员工信息
     */
    @Scheduled(cron = "0 0 2 * * ?") // 每天凌晨 2 点执行
    public void syncStaffInfo() {
        try {
            log.info("开始同步员工信息");
            
            // 1. 从核心人事系统获取员工列表
            Result<List<StaffInfoDTO>> result = coreHrIntApi.getAllStaff();
            
            if (result.isSuccess()) {
                List<StaffInfoDTO> staffList = result.getData();
                log.info("获取到 {} 条员工信息", staffList.size());
                
                // 2. 批量更新本地数据库
                staffList.forEach(staff -> {
                    updateLocalStaff(staff);
                });
                
                log.info("员工信息同步完成");
            } else {
                log.error("获取员工信息失败: {}", result.getMessage());
            }
        } catch (Exception e) {
            log.error("同步员工信息异常", e);
        }
    }
    
    private void updateLocalStaff(StaffInfoDTO staff) {
        // 更新本地数据库逻辑
    }
}
```

### HC 查询缓存

```java
@Service
public class HCQueryService {
    
    @Autowired
    private HCApi hcApi;
    
    // HC 数据缓存（1 小时过期）
    private final Cache<Integer, HCInfoDTO> hcCache = 
        CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(500)
            .build();
    
    /**
     * 查询部门 HC（带缓存）
     */
    public HCInfoDTO getDeptHC(Integer deptId) {
        try {
            return hcCache.get(deptId, () -> {
                log.info("查询部门 {} 的 HC 信息", deptId);
                Result<HCInfoDTO> result = hcApi.getDeptHC(deptId);
                return result.isSuccess() ? result.getData() : null;
            });
        } catch (Exception e) {
            log.error("查询 HC 失败: {}", deptId, e);
            return null;
        }
    }
    
    /**
     * 刷新部门 HC 缓存
     */
    public void refreshDeptHC(Integer deptId) {
        hcCache.invalidate(deptId);
        log.info("部门 {} 的 HC 缓存已刷新", deptId);
    }
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [运营平台 API](./operation-api.md)
- [测评平台 API](./assessment-api.md)
- [企业微信与消息通知 API](./wework-message-api.md)
- [领域事件汇总](./domain-events-summary.md)

---

**最后更新**: 2025-11-12
