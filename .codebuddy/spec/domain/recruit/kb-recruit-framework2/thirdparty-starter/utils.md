# 工具类索引文档

> **文档说明**: 本文档为 `RecruitCenterThirdPartyStarter` 项目工具类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.third.utils`, `hrright.utils`, `kms`  
> **文件总数**: 7个

---

## 📑 目录

- [一、工具类概览](#一工具类概览)
- [二、详细清单](#二详细清单)
  - [2.1 通用工具类](#21-通用工具类)
  - [2.2 权限工具类](#22-权限工具类)
  - [2.3 加密工具类](#23-加密工具类)
- [三、最佳实践建议](#三最佳实践建议)

---

## 一、工具类概览

### 1.1 目录结构

```
third/
├── utils/                    # 通用工具类 (4个)
│   ├── FakeUserUtils.java   # 模拟用户工具
│   ├── FlowUtils.java       # 流程工具
│   ├── HolidayDateUtils.java # 假期日期工具
│   └── HttpUtil.java        # HTTP工具
├── hrright/utils/           # 权限工具类 (2个)
│   ├── DataScopeUtils.java # 数据权限工具
│   └── StaffRightUtils.java # 员工权限工具
└── kms/                     # 加密工具类 (1个)
    └── AESUtil.java         # AES加密工具
```

### 1.2 按功能分类

| 功能类别 | 文件数量 | 主要用途 |
|---------|---------|---------|
| HTTP/用户 | 2个 | 用户信息获取、IP地址解析 |
| 日期/假期 | 1个 | 工作日计算、假期判断 |
| 流程 | 1个 | 流程配置查找 |
| 权限 | 2个 | 数据权限、操作权限 |
| 加密 | 1个 | AES加密解密 |

---

## 二、详细清单

### 2.1 通用工具类

#### 2.1.1 FakeUserUtils

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.utils.FakeUserUtils`
- **类型**: final class
- **用途**: 获取模拟用户信息，用于开发和调试

**公共方法** (1个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|
| `getFakeUser()` | `StaffDTO` | 从请求头获取模拟用户信息，仅对开发人员有效 |

**技术特点**:
```java
public final class FakeUserUtils {
    // 从请求头获取模拟用户
    public static StaffDTO getFakeUser()
}
```

**应用场景**:
- 开发环境模拟用户登录
- 测试不同用户权限
- 调试用户相关功能

---

#### 2.1.2 FlowUtils

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.utils.FlowUtils`
- **类型**: interface (工具接口)
- **用途**: 流程配置查找和匹配

**公共方法** (2个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `get(List<FlowTraceConfigDTO>, int flowId, int stateId, int stepId)` | steps, flowId, stateId, stepId | `FlowTraceConfigDTO` | 根据流程ID、状态ID和步骤ID查找流程配置 |
| `get(List<FlowTraceConfigDTO>, int flowId, int stepId)` | steps, flowId, stepId | `FlowTraceConfigDTO` | 根据流程ID和步骤ID查找流程配置 |

**技术特点**:
```java
public interface FlowUtils {
    // 三参数查找
    static FlowTraceConfigDTO get(List<FlowTraceConfigDTO> steps, 
                                   int flowId, int stateId, int stepId);
    
    // 二参数查找
    static FlowTraceConfigDTO get(List<FlowTraceConfigDTO> steps, 
                                   int flowId, int stepId);
}
```

**应用场景**:
- 流程配置匹配
- 流程步骤查找
- 流程状态判断

---

#### 2.1.3 HolidayDateUtils

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.utils.HolidayDateUtils`
- **类型**: final class
- **用途**: 假期和工作日计算工具

**公共方法** (13个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `betweenCache(LocalDateTime start, LocalDateTime end, boolean nature)` | 开始时间, 结束时间, 是否自然日 | `long` | 计算两个日期之间的天数差（缓存版） |
| `between(LocalDateTime start, LocalDateTime end, boolean nature)` | 开始时间, 结束时间, 是否自然日 | `long` | 计算两个日期之间的天数差 |
| `between(LocalDateTime start, LocalDateTime end)` | 开始时间, 结束时间 | `long` | 计算两个日期之间的自然日天数 |
| `plusWorkDays(LocalDate start, int days)` | 开始日期, 工作日天数 | `LocalDate` | 计算指定工作日后的日期 |
| `plusWorkDays(LocalDateTime startTime, int days)` | 开始时间, 工作日天数 | `LocalDateTime` | 计算指定工作日后的时间 |
| `minusWorkDays(LocalDate end, int days)` | 结束日期, 工作日天数 | `LocalDate` | 计算向前推指定工作日的日期 |
| `minusWorkDays(LocalDateTime endTime, int days)` | 结束时间, 工作日天数 | `LocalDateTime` | 计算向前推指定工作日的时间 |
| `nearWorkDay(LocalDateTime time, int days)` | 时间, 天数 | `LocalDateTime` | 计算天数后最近的工作日（时间） |
| `nearWorkDay(LocalDate start, int days)` | 日期, 天数 | `LocalDate` | 计算天数后最近的工作日（日期） |
| `isHoliday(LocalDate localDate)` | 日期 | `boolean` | 判断指定日期是否为假期 |
| `isHoliday(LocalDateTime localDate)` | 时间 | `boolean` | 判断指定时间是否为假期 |

**静态字段**:
```java
public static HolidayService holidayService; // 假期服务依赖
```

**技术特点**:
```java
@Slf4j
public final class HolidayDateUtils {
    // 工作日计算示例
    public static LocalDate plusWorkDays(LocalDate start, int days)
    
    // 假期判断
    public static boolean isHoliday(LocalDate localDate)
}
```

**应用场景**:
- 计算工作日期限
- SLA时间计算
- 假期判断和处理
- 排期和里程碑计算

---

#### 2.1.4 HttpUtil

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.utils.HttpUtil`
- **类型**: interface (工具接口)
- **用途**: HTTP相关工具方法

**公共方法** (1个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `getIpAddress(HttpServletRequest request)` | request | `String` | 获取用户真实IP地址，支持代理穿透 |

**技术特点**:
```java
public interface HttpUtil {
    /**
     * 获取用户真实IP地址
     * 支持多级代理场景，按优先级依次尝试：
     * 1. x-forwarded-for
     * 2. Proxy-Client-IP
     * 3. WL-Proxy-Client-IP
     * 4. HTTP_CLIENT_IP
     * 5. HTTP_X_FORWARDED_FOR
     * 6. request.getRemoteAddr()
     */
    static String getIpAddress(HttpServletRequest request)
}
```

**应用场景**:
- 用户IP地址获取
- 审计日志记录
- 安全控制
- 地域识别

---

### 2.2 权限工具类

#### 2.2.1 DataScopeUtils

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.utils.DataScopeUtils`
- **类型**: interface (工具接口)
- **用途**: 数据权限范围计算

**公共方法** (3个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `scope(DataScopeCode scopeCode, List<DataScope> scopes)` | 权限码, 权限列表 | `DataScopeBean` | 计算数据权限范围（使用枚举） |
| `scope(String code, String allSign, List<DataScope> scopes)` | 权限码, 全部标识, 权限列表 | `DataScopeBean` | 计算数据权限范围（多个权限） |
| `scope(String code, String allSign, DataScope scopes)` | 权限码, 全部标识, 权限 | `DataScopeBean` | 计算数据权限范围（单个权限） |

**技术特点**:
```java
public interface DataScopeUtils {
    /**
     * 数据权限范围计算
     * 1. 计算允许权限和禁止权限的并集
     * 2. 处理"所有权限"的特殊情况
     * 3. 返回最终的权限范围
     */
    static DataScopeBean scope(DataScopeCode scopeCode, 
                               List<DataScope> scopes)
}
```

**应用场景**:
- 数据权限过滤
- 权限范围计算
- 多权限合并
- 权限继承处理

---

#### 2.2.2 StaffRightUtils

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.utils.StaffRightUtils`
- **类型**: final class (单例模式)
- **用途**: 员工操作权限管理

**公共方法** (10个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `getInstance()` | 无 | `StaffRightUtils` | 获取单例实例 |
| `get(Long staffId)` | 员工ID | `StaffRightBean` | 获取员工权限（腾讯租户） |
| `get(String staffId)` | 员工ID | `StaffRightBean` | 获取员工权限（腾讯租户） |
| `get(Long staffId, ICurrentUserActuator actuator)` | 员工ID, 用户执行器 | `StaffRightBean` | 获取员工权限（带上下文） |
| `get(String staffId, ICurrentUserActuator actuator)` | 员工ID, 用户执行器 | `StaffRightBean` | 获取员工权限（带上下文） |
| `get(String tenantKey, String staffId)` | 租户key, 员工ID | `StaffRightBean` | 获取员工权限（指定租户） |
| `get(String tenantKey, String staffId, ICurrentUserActuator actuator)` | 租户key, 员工ID, 用户执行器 | `StaffRightBean` | 获取员工权限（完整参数） |
| `check(String staffId, String... operateCode)` | 员工ID, 操作码 | `boolean` | 检查操作权限（腾讯租户） |
| `check(String staffId, OperateRule rule, String... operateCode)` | 员工ID, 规则, 操作码 | `boolean` | 检查操作权限（指定规则） |
| `check(String tenantKey, String staffId, String... operateCode)` | 租户key, 员工ID, 操作码 | `boolean` | 检查操作权限（指定租户） |
| `check(String tenantKey, String staffId, OperateRule rule, String... operateCode)` | 租户key, 员工ID, 规则, 操作码 | `boolean` | 检查操作权限（完整参数） |
| `check(String tenantKey, String staffId, OperateRule rule, ICurrentUserActuator actuator, String... operateCode)` | 租户key, 员工ID, 规则, 执行器, 操作码 | `boolean` | 检查操作权限（带上下文） |

**依赖字段**:
```java
@Autowired
private AuthService authService;

@Autowired
private RedisRecruitCache<StaffRightBean> redisRecruitCache;
```

**技术特点**:
```java
public final class StaffRightUtils {
    // 单例模式
    private static StaffRightUtils instance;
    
    // 权限获取（支持缓存）
    public static StaffRightBean get(String tenantKey, String staffId)
    
    // 权限校验（支持多种规则）
    public static boolean check(String staffId, String... operateCode)
}
```

**应用场景**:
- 员工权限获取
- 操作权限校验
- 权限缓存管理
- 多租户权限处理

---

### 2.3 加密工具类

#### 2.3.1 AESUtil

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.kms.AESUtil`
- **类型**: final class
- **用途**: AES加密解密工具

**公共方法** (6个):

| 方法签名 | 参数 | 返回类型 | 功能说明 |
|---------|------|---------|---------|
| `createKeyContent(String key, AESType type)` | 密钥名称, AES类型 | `String` | 创建随机密钥并存储到KMS |
| `getKeyContent(String key)` | 密钥名称 | `String` | 获取密钥内容（16位） |
| `getKeyContent(String key, AESType aesType)` | 密钥名称, AES类型 | `String` | 获取密钥内容（指定长度） |
| `encrypt(String content, String key)` | 明文, 密钥名称 | `String` | 加密（16位AES） |
| `encrypt(String content, String key, AESType type)` | 明文, 密钥名称, AES类型 | `String` | 加密（指定长度） |
| `decrypt(String content, String key)` | 密文, 密钥名称 | `String` | 解密 |

**静态字段**:
```java
public static final String bm = "utf-8"; // 编码
public static KmsSdkService kmsSdkService; // KMS服务
private static Cache<String, String[]> cache; // 密钥缓存
```

**内部枚举 - AESType**:
```java
public enum AESType {
    _16(16),  // 16位AES
    _24(24),  // 24位AES
    _32(32);  // 32位AES
    
    private final int length;
}
```

**技术特点**:
```java
@Slf4j
public final class AESUtil {
    /**
     * AES/CBC加密
     * 特点：
     * 1. 支持16/24/32位密钥
     * 2. 集成KMS密钥管理
     * 3. 自动缓存密钥（60分钟过期）
     * 4. 十六进制编码
     */
    public static String encrypt(String content, String key, AESType type)
    
    /**
     * AES/CBC解密
     * 兼容原ATS加密方式
     */
    public static String decrypt(String content, String key)
}
```

**应用场景**:
- 敏感数据加密
- 密码加密存储
- 数据传输加密
- KMS密钥管理

---

## 三、最佳实践建议

### 3.1 工具类使用规范

#### ✅ 推荐做法

```java
// 1. 假期工具 - 使用静态注入
@Configuration
public class HolidayConfig {
    @PostConstruct
    public void init() {
        HolidayDateUtils.holidayService = holidayService;
    }
}

// 2. 加密工具 - 使用KMS管理密钥
String encrypted = AESUtil.encrypt(password, "recruit-pwd-key");

// 3. 权限工具 - 使用缓存减少查询
StaffRightBean right = StaffRightUtils.get(staffId);
boolean hasRight = right.check("CANDIDATE_VIEW");

// 4. IP获取 - 支持代理穿透
String ip = HttpUtil.getIpAddress(request);
```

#### ❌ 不推荐做法

```java
// 1. 不要硬编码密钥
String encrypted = encrypt(content, "hardcode-key"); // ❌

// 2. 不要频繁查询权限
for (Candidate candidate : list) {
    StaffRightUtils.get(staffId); // ❌ 应该在循环外获取一次
}

// 3. 不要忽略假期配置
long days = ChronoUnit.DAYS.between(start, end); // ❌ 应该使用HolidayDateUtils
```

### 3.2 性能优化建议

1. **权限缓存**
   - `StaffRightUtils`内置Redis缓存
   - 缓存时间由`FrameworkRedisKey.HR_RIGHT_OPERATE.expire()`控制

2. **密钥缓存**
   - `AESUtil`使用Guava Cache
   - 60分钟自动过期
   - 最大1024条记录

3. **假期缓存**
   - 优先使用`betweenCache`方法
   - 减少远程调用

### 3.3 常见问题

**Q1: HolidayDateUtils工作日计算不准确？**
- **原因**: `holidayService`未注入
- **解决**: 在配置类中注入`HolidayService`

**Q2: AESUtil加解密失败？**
- **原因**: KMS密钥不存在或已过期
- **解决**: 使用`createKeyContent`创建密钥

**Q3: StaffRightUtils权限获取为空？**
- **原因**: 用户未配置权限或缓存失效
- **解决**: 检查权限配置，清除Redis缓存重试

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 初始创建工具类索引文档 | v1.0 |

---
