# 组件索引文档

> **文档说明**: 本文档为 `RecruitCenterThirdPartyStarter` 项目组件类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `handler`, `interceptor`, `actuator`, `interfaces`  
> **文件总数**: 5个

---

## 📑 目录

- [一、组件概览](#一组件概览)
- [二、详细清单](#二详细清单)
  - [2.1 Handler处理器](#21-handler处理器)
  - [2.2 Interceptor拦截器](#22-interceptor拦截器)
  - [2.3 Actuator执行器](#23-actuator执行器)
  - [2.4 Interfaces接口](#24-interfaces接口)
- [三、最佳实践建议](#三最佳实践建议)

---

## 一、组件概览

### 1.1 目录结构

```
hrright/
├── handler/
│   └── RecruitRightHandler.java        # 权限处理器
├── interceptor/
│   └── RecruitAuthInterceptor.java     # 权限拦截器
├── actuator/
│   ├── StaffActuator.java              # 员工执行器
│   └── TenantStaffActuator.java        # 租户员工执行器
└── interfaces/
    └── ICurrentUserActuator.java       # 当前用户执行器接口

efficiency/
└── interceptor/
    └── InnerFeignRequestInterceptor.java  # 内部Feign请求拦截器
```

### 1.2 功能分类

| 组件类型 | 组件名称 | 用途 |
|---------|---------|------|
| Handler | RecruitRightHandler | 权限处理、数据范围控制 |
| Interceptor | RecruitAuthInterceptor | 权限认证拦截 |
| Interceptor | InnerFeignRequestInterceptor | Feign请求签名 |
| Actuator | StaffActuator | 单租户用户信息获取 |
| Actuator | TenantStaffActuator | 多租户用户信息获取 |
| Interface | ICurrentUserActuator | 用户执行器接口 |

---

## 二、详细清单

### 2.1 Handler处理器

#### RecruitRightHandler

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.handler.RecruitRightHandler`
- **注解**: `@Slf4j`
- **用途**: 招聘权限处理器，负责权限校验和数据范围控制

**字段列表** (5个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `staffRightService` | `StaffRightService` | `@Autowired` | 员工权限服务 |
| `staffService` | `StaffService` | `@Autowired` | 员工服务 |
| `roleService` | `RoleService` | `@Autowired` | 角色服务 |
| `dataScopeService` | `DataScopeService` | `@Autowired` | 数据范围服务 |
| `actuator` | `ICurrentUserActuator` | `@Autowired` | 当前用户执行器 |

**公共方法** (7个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `get(String staffId)` | `StaffRightBean` | 获取员工权限信息 |
| `getForCurrentUser()` | `StaffRightBean` | 获取当前用户权限信息 |
| `getForCurrentUser(Object context)` | `StaffRightBean` | 获取当前用户权限（带上下文） |
| `candidateDataScope(String opCode)` | `DataScopeBean` | 获取候选人数据范围 |
| `candidateDataScopeMap(String... opCodes)` | `Map<String, DataScopeBean>` | 批量获取候选人数据范围 |
| `requirementDataScope(String opCode)` | `DataScopeBean` | 获取需求数据范围 |
| `requirementDataScopeMap(String... opCodes)` | `Map<String, DataScopeBean>` | 批量获取需求数据范围 |

**使用示例**:
```java
@Autowired
private RecruitRightHandler rightHandler;

// 获取当前用户权限
StaffRightBean right = rightHandler.getForCurrentUser();

// 检查操作权限
boolean hasView = right.getOperateCode().contains("CANDIDATE_VIEW");

// 获取数据范围
DataScopeBean scope = rightHandler.candidateDataScope("CANDIDATE_VIEW");
if (scope.hasAll()) {
    // 查询全部候选人
} else {
    // 根据scopes过滤
}
```

---

### 2.2 Interceptor拦截器

#### RecruitAuthInterceptor

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.interceptor.RecruitAuthInterceptor`
- **实现**: `HandlerInterceptor`
- **用途**: 权限认证拦截器，在请求进入Controller前进行权限校验

**字段列表** (2个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `actuator` | `ICurrentUserActuator` | `@Autowired` | 当前用户执行器 |
| `rightHandler` | `RecruitRightHandler` | `@Autowired` | 权限处理器 |

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `preHandle(HttpServletRequest, HttpServletResponse, Object)` | `boolean` | 请求前置处理，校验权限 |

---

#### InnerFeignRequestInterceptor

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.efficiency.interceptor.InnerFeignRequestInterceptor`
- **注解**: `@RequiredArgsConstructor`
- **实现**: `RequestInterceptor`
- **用途**: 内部Feign请求拦截器，添加签名头

**字段列表** (2个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `propertyName` | `String` | `final` | 配置属性名称 |
| `context` | `InnerAuthContext` | `@Autowired` | 内部认证上下文 |

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `apply(RequestTemplate requestTemplate)` | `void` | 为Feign请求添加认证头（AppName、Timestamp、Signature） |

**完整源码**:
```java
@RequiredArgsConstructor
public class InnerFeignRequestInterceptor implements RequestInterceptor {
    private final String propertyName;
    
    @Autowired
    private InnerAuthContext context;

    @Override
    public void apply(RequestTemplate requestTemplate) {
        if (StringUtils.isBlank(propertyName)) return;
        Map<String, Collection<String>> headers = requestTemplate.headers();
        if (Objects.nonNull(headers) && headers.containsKey(OAHttpHeader.HR_GATEWAY_APP)) return;
        
        String timestamp = String.valueOf((System.currentTimeMillis()));
        requestTemplate.header(OAHttpHeader.HR_GATEWAY_APP, context.getAppName());
        requestTemplate.header(OAHttpHeader.HR_GATEWAY_TIMESTAMP, timestamp);
        
        String signature = context.getAppName() + context.getAppToken() + timestamp;
        requestTemplate.header(OAHttpHeader.HR_GATEWAY_SIGNATURE, SHA1Util.sha256(signature));
    }
}
```

**使用示例**:
```java
@Configuration
public class FeignConfig {
    @Bean
    public InnerFeignRequestInterceptor innerFeignInterceptor() {
        return new InnerFeignRequestInterceptor("app.name");
    }
}
```

---

### 2.3 Actuator执行器

#### StaffActuator

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.actuator.StaffActuator`
- **实现**: `ICurrentUserActuator`
- **Profile**: `dev`, `uat`, `test`, `local`, `prod`
- **用途**: 单租户模式下获取当前用户信息

**字段列表**: 无

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `currentId()` | `String` | 从请求头获取员工ID（OAHttpHeader.STAFF_ID） |
| `tenantKey()` | `String` | 返回固定租户标识 "tencent" |

**完整源码**:
```java
public class StaffActuator implements ICurrentUserActuator {
    @Override
    public String currentId() {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) attributes).getRequest();
        return request.getHeader(OAHttpHeader.STAFF_ID);
    }

    @Override
    public String tenantKey() {
        return "tencent";
    }
}
```

---

#### TenantStaffActuator

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.actuator.TenantStaffActuator`
- **实现**: `ICurrentUserActuator`
- **Profile**: `edev`, `euat`, `etest`, `elocal`, `eprod`
- **用途**: 多租户模式下获取当前用户信息

**字段列表** (1个):

| 字段名 | 类型 | 注解 | 说明 |
|-------|------|------|------|
| `tenantInfoHandler` | `ITenantInfoHandler` | `@Autowired` | 租户信息处理器 |

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `currentId()` | `String` | 从请求头获取用户ID（TasHttpHeader.CAAGW_GLOBALID） |
| `tenantKey()` | `String` | 从租户处理器获取租户标识 |

**完整源码**:
```java
public class TenantStaffActuator implements ICurrentUserActuator {
    @Autowired
    private ITenantInfoHandler tenantInfoHandler;

    @Override
    public String currentId() {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) attributes).getRequest();
        return request.getHeader(TasHttpHeader.CAAGW_GLOBALID);
    }

    @Override
    public String tenantKey() {
        return tenantInfoHandler.tenantKey();
    }
}
```

---

### 2.4 Interfaces接口

#### ICurrentUserActuator

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.interfaces.ICurrentUserActuator`
- **类型**: 接口
- **用途**: 定义当前用户信息获取接口

**接口方法** (3个):

| 方法签名 | 返回类型 | 默认实现 | 功能说明 |
|---------|---------|---------|---------|
| `currentId()` | `String` | 无 | 获取当前用户ID |
| `tenantKey()` | `String` | 无 | 获取租户标识 |
| `contextData()` | `Object` | `return null` | 获取上下文数据（可选） |

**完整源码**:
```java
public interface ICurrentUserActuator {
    String currentId();
    String tenantKey();
    
    default Object contextData() {
        return null;
    }
}
```

**实现类**:
- `StaffActuator` - 单租户模式
- `TenantStaffActuator` - 多租户模式

---

## 三、最佳实践建议

### 3.1 组件使用规范

#### ✅ 推荐做法

```java
// 1. 使用RecruitRightHandler获取权限
@Autowired
private RecruitRightHandler rightHandler;

StaffRightBean right = rightHandler.getForCurrentUser();

// 2. 数据权限控制
DataScopeBean scope = rightHandler.candidateDataScope("CANDIDATE_VIEW");
if (scope.hasAll()) {
    // 查询全部
} else if (scope.hasEmpty()) {
    // 无权限
} else {
    // 按范围过滤
    query.in("deptId", scope.getScopes());
}

// 3. 配置执行器
@Bean
public ICurrentUserActuator currentUserActuator() {
    return new StaffActuator(); // 单租户
    // return new TenantStaffActuator(); // 多租户
}

// 4. 使用Feign拦截器
@Bean
public InnerFeignRequestInterceptor feignInterceptor() {
    return new InnerFeignRequestInterceptor("app.name");
}
```

#### ❌ 不推荐做法

```java
// 1. 不要直接实例化Handler
RecruitRightHandler handler = new RecruitRightHandler(); // ❌

// 2. 不要跳过权限校验
@Override
public boolean preHandle(...) {
    return true; // ❌ 直接放行
}

// 3. 不要混用执行器
@Bean
public ICurrentUserActuator actuator1() { return new StaffActuator(); }
@Bean
public ICurrentUserActuator actuator2() { return new TenantStaffActuator(); } // ❌
```

### 3.2 常见问题

**Q1: 如何选择StaffActuator还是TenantStaffActuator？**
- **单租户**（企业内部系统）：使用 `StaffActuator`
- **多租户**（SaaS系统）：使用 `TenantStaffActuator`

**Q2: RecruitAuthInterceptor如何配置？**
```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private RecruitAuthInterceptor authInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/public/**");
    }
}
```

**Q3: InnerFeignRequestInterceptor的签名算法？**
```java
// 签名计算
String timestamp = String.valueOf(System.currentTimeMillis());
String signature = appName + appToken + timestamp;
String sha256 = SHA1Util.sha256(signature);

// 请求头
HR-GATEWAY-APP: appName
HR-GATEWAY-TIMESTAMP: timestamp
HR-GATEWAY-SIGNATURE: sha256
```

---

## 📚 相关文档

- [Bean对象索引](./beans.md) - DataScopeBean、StaffRightBean
- [Service服务索引](./services.md) - StaffRightService、DataScopeService
- [枚举类索引](./enums.md) - RecruitRole、DataScopeCode
- [工具类索引](./utils.md) - SHA1Util
- [配置类索引](./configurations.md) - RecruitRightConfiguration

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完善组件类字段和方法说明 | v1.1 |
| 2025-11-21 | AI Assistant | 初始创建组件索引文档 | v1.0 |

---
