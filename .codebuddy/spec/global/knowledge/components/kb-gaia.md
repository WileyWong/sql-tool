# Gaia 规则引擎服务 API 文档

> **文档版本**: v1.0  
> **最后更新**: 2025-11-11  
> **负责人**: haozonggui(桂豪纵)、cxyxhhuang  
> **适用范围**: 内网OA环境、公有云环境  
> **状态**: ✅ 稳定运行中

---

## 1. 基础信息层

### 1.1 服务信息

| 属性 | 说明 |
|------|------|
| **服务名称** | Gaia 业务规则管理系统 |
| **服务标识** | hr-gaia-service |
| **当前版本** | v1.0 |
| **SDK版本** | 1.2.11-SNAPSHOT |
| **负责人** | haozonggui(桂豪纵)、cxyxhhuang |
| **维护团队** | 基础组件组 |
| **服务状态** | ✅ 稳定、推荐使用 |

### 1.2 版本历史

| 版本 | 发布时间 | 主要更新 |
|------|---------|---------|
| v1.0 | 2021-10 | 支持决策集、表达式组件能力；集成数据中台主数据：员工、组织等，支持规则库规则管理场景 |

---

## 2. 功能概述层

### 2.1 核心职责

Gaia是一个业务规则管理系统，提供**规则定义、规则管理、规则执行**的完整能力，支持通过可视化界面配置业务规则，无需编写代码即可实现复杂的业务逻辑判断和处理。

### 2.2 使用场景

1. **业务规则配置化**: 将硬编码的业务规则抽象为可配置的规则集，实现业务与代码分离
2. **动态规则更新**: 支持规则热更新，无需重启应用即可生效
3. **复杂条件判断**: 支持多条件组合、循环规则、互斥组等复杂业务场景
4. **规则版本管理**: 提供规则版本控制、线上版本切换、历史版本回溯能力
5. **适用业务系统**: 招聘、薪酬、绩效、审批流程等所有业务系统

### 2.3 设计目的

- **业务可配置化**: 让业务人员能够直接配置规则，减少开发工作量
- **规则复用性**: 统一的基础库资源，跨应用共享规则组件
- **高性能执行**: 分布式模式支持本地缓存，毫秒级响应
- **版本可控制**: 完善的版本管理机制，支持灰度发布和快速回滚

### 2.4 业务价值

- **降低开发成本**: 规则配置化减少80%的规则变更开发工作
- **提升响应速度**: 业务规则变更从天级降低到分钟级
- **提高系统稳定性**: 规则热更新避免频繁发版和重启
- **增强可维护性**: 可视化规则配置，降低维护门槛

---

## 3. 接口定义层

### 3.1 Java SDK 接口

#### 3.1.1 规则执行接口

**分布式模式执行(本地执行)**

```java
/**
 * 分布式计算模式,规则在本地执行
 * @param knowledgePackageCode 知识包编码
 * @param inputs 多个输入参数(Map<参数名, 参数值>)
 * @return 执行结果 Map<参数名, 参数值>
 * @throws Exception 执行异常
 */
public Map<String, Object> Execute(String knowledgePackageCode, Map<String, Object> inputs) throws Exception
```

**参数说明**:
- `knowledgePackageCode` (String, 必填): 知识包编码，在知识包调用配置中获取
- `inputs` (Map<String, Object>, 必填): 输入参数映射
  - Key: 变量名/参数名(需与规则定义一致)
  - Value: 变量对象/参数值

**返回值**: `Map<String, Object>` - 执行后的参数结果
- Key: 参数名
- Value: 参数值(规则执行后的结果)

**远程模式执行(独立服务模式)**

```java
/**
 * 独立服务模式,远程调用
 * @param knowledgePackageCode 知识包编码
 * @param inputs 输入参数
 * @return 执行结果
 */
public Res<List<OutputDTO>> ExecuteRemote(String knowledgePackageCode, Map<String, Object> inputs)
```

**返回值结构**:
```json
{
    "code": 1,        // 1-成功, 0-失败
    "success": true,
    "msg": "",        // 失败提示
    "data": [{
        "name": "变量/参数名",
        "fields": "变量/参数值JSON字符串"
    }]
}
```

#### 3.1.2 知识包管理接口

**获取知识包管理服务**

```java
/**
 * @return Gaia 知识包管理服务
 */
public GaiaKnowledgePackageService GetKnowledgePackageService()
```

**GaiaKnowledgePackageService 方法列表**:

```java
/**
 * 获取知识包详情
 * @param packageCode 知识包编码
 * @return 知识包详情信息
 */
public KnowledgePackageDTO getKnowledgePackageDetail(String packageCode);
public KnowledgePackageDTO getKnowledgePackageDetail(String packageCode, GaiaConfig config);

/**
 * 获取知识包版本列表
 * @param packageCode 知识包编码
 * @return 知识包所有版本信息
 */
public List<RuleVersionDTO> getKnowledgePackageVersions(String packageCode);
public List<RuleVersionDTO> getKnowledgePackageVersions(String packageCode, GaiaConfig config);

/**
 * 设置知识包版本
 * @param packageCode 知识包编码
 * @param versionId 版本ID
 * @return 是否设置成功
 */
public boolean setKnowledgePackageVersion(String packageCode, Integer versionId);
public boolean setKnowledgePackageVersion(String packageCode, Integer versionId, GaiaConfig config);
```

#### 3.1.3 资源管理接口

```java
/**
 * @return Gaia 资源管理服务
 */
public GaiaResourceService GetResourceService()

/**
 * 获取资源详情
 * @param resourceId 资源ID
 * @return 资源信息
 */
public RuleResource getResource(Integer resourceId);
public RuleResource getResource(Integer resourceId, GaiaConfig config);

/**
 * 获取资源列表
 * @param typeId 资源类型ID(可选)
 * @param key 关键字筛选(可选)
 * @return 资源列表
 */
public List<RuleResource> getResourceList(Integer typeId, String key);
public List<RuleResource> getResourceList(Integer typeId, String key, GaiaConfig config);

/**
 * 创建资源
 * @param data 资源数据(typeId, title, expression, dataTypeId, servicePath)
 * @return 是否创建成功
 */
public boolean createResource(CreateResourceDTO data);
public boolean createResource(CreateResourceDTO data, GaiaConfig config);

/**
 * 创建子资源
 * @param parentResourceId 父资源ID
 * @param data 资源数据
 * @return 是否创建成功
 */
public boolean createChildResource(Integer parentResourceId, CreateResourceDTO data);
public boolean createChildResource(Integer parentResourceId, CreateResourceDTO data, GaiaConfig config);

/**
 * 更新资源
 * @param resourceId 资源ID
 * @param data 资源数据
 * @return 是否更新成功
 */
public boolean updateResource(Integer resourceId, CreateResourceDTO data);
public boolean updateResource(Integer resourceId, CreateResourceDTO data, GaiaConfig config);

/**
 * 删除资源
 * @param resourceId 资源ID
 * @return 是否删除成功
 */
public boolean deleteResource(Integer resourceId);
public boolean deleteResource(Integer resourceId, GaiaConfig config);
```

#### 3.1.4 应用管理接口

```java
/**
 * @return Gaia App管理服务
 */
public GaiaAppService GetAppService()

/**
 * 获取App信息
 * @param appCode App编码(AppId)
 * @return App信息
 */
public BusinessAppDTO getApp(String appCode);
public BusinessAppDTO getApp(String appCode, GaiaConfig config);

/**
 * 创建App
 * @param data appName-应用名称/appCode-应用编码(ID)/ownerId-所有人员工ID/busAreaId-所属领域
 * @return App信息
 */
public BusinessAppDTO createApp(BusinessAppDTO data);
public BusinessAppDTO createApp(BusinessAppDTO data, GaiaConfig config);

/**
 * 更新App
 * @param data 应用数据
 * @return 是否更新成功
 */
public boolean updateApp(BusinessAppDTO data);
public boolean updateApp(BusinessAppDTO data, GaiaConfig config);

/**
 * 删除App
 * @param appCode 应用编码(ID)
 * @return 是否删除成功
 */
public boolean deleteApp(String appCode);
public boolean deleteApp(String appCode, GaiaConfig config);
```

#### 3.1.5 多应用支持

```java
/**
 * 多应用配置设置
 * @param configs 应用配置列表,只需appId和appKey
 */
public void SetMultiConfig(List<GaiaConfig> configs)
```

**使用示例**:
```java
gaia.SetMultiConfig(Arrays.asList(
    new GaiaConfig().setAppId("irecruit").setAppKey("cdcf7db7-xxxxx"),
    new GaiaConfig().setAppId("RS").setAppKey("c1d2d594-xxxxxx"),
    new GaiaConfig().setAppId("holiday").setAppKey("f8988dfc-xxxxxx")
));
```

#### 3.1.6 输入解析接口

```java
/**
 * 将输入值转换成规则的目标类型,适用于来自前端的动态输入
 * @param kpCode 知识包编码
 * @param inputs 输入值
 * @return 解析结果
 */
public Res<Void> ParseInputs(String kpCode, Map<String, Object> inputs)
```

#### 3.1.7 签名生成

```java
/**
 * 生成签名(用于前端组件鉴权)
 * @return 签名字符串(有效期2小时)
 */
public String GetSignature()
```

### 3.2 HTTP API 接口

#### 3.2.1 鉴权说明

HTTP接口使用签名方式进行鉴权，需在Header中传入以下参数:

| Header | 描述 |
|--------|------|
| X-GAIA-APP-ID | 应用ID |
| X-GAIA-SIGN | 签名: sha256(应用ID + 时间戳 + 应用Key) |
| X-GAIA-TIME-STAMP | 时间戳(毫秒) |

**Java签名示例**:
```java
Map<String, String> headers = new HashMap();
String appId = this.gaiaConfig.getAppId();
String appKey = this.gaiaConfig.getAppKey();
String timestamp = Long.toString(System.currentTimeMillis());
String signature = UtilTool.sha256(appId + timestamp + appKey);
headers.put("X-GAIA-APP-ID", appId);
headers.put("X-GAIA-SIGN", signature);
headers.put("X-GAIA-TIME-STAMP", timestamp);
```

#### 3.2.2 执行规则

**接口**: `POST /api/ext/package/exec?packageCode={知识包编码}`

**请求参数** (Body):
```json
{
    "变量名/参数名": "变量/参数的JSON字符串"
}
```

**返回值**:
```json
{
    "code": 1,
    "success": true,
    "msg": "",
    "data": [{
        "name": "变量/参数名",
        "fields": "变量/参数值JSON字符串"
    }]
}
```

### 3.3 前端组件接口

Gaia提供了Vue组件，支持在前端直接嵌入规则编辑器。

#### 3.3.1 决策集组件 (RulesComponent)

**Props参数**:

```javascript
{
    signature: String,      // 必填: 应用签名
    packageCode: String,    // 必填: 知识包编码
    isdDescribe: Boolean,   // 是否展示规则集名称、描述在头部
    doDisable: Boolean,     // 是否展示禁用样式
    rulesData: Object,      // 自定义决策集数据
    filterIds: Array        // 下拉级联面板过滤项
}
```

**使用示例**:
```html
<rules-component
    class="rule-data"
    @changeData="resolveHandler"
    ref="ruleComp"
    :signature="signature"
    :packageCode="packageCode"
></rules-component>
```

**组件方法**:
- `this.$refs.ruleComp.getData()` - 初始化数据
- `this.$refs.ruleComp.getRuleData()` - 获取当前规则值
- `this.$refs.ruleComp.updateRulefun()` - 保存规则

#### 3.3.2 表达式组件 (ExpressionComponent)

**Props参数**:
```javascript
{
    signature: String,      // 必填: 应用签名
    externalData: Object,   // 外部参数
    doDisable: Boolean,     // 是否禁用
    rulesData: Object,      // 自定义表达式数据
    filterIds: Array        // 过滤项
}
```

**externalData结构**:
```javascript
{
    invokeMode: 0,          // 调用模式: 1-独立服务, 2-分布式
    packageCode: "",        // 知识包编码
    packageName: "",        // 知识包名称
    updateVersion: true     // 是否更新线上版本
}
```

#### 3.3.3 决策表组件 (RuleTableComponent)

**Props参数**:
```javascript
{
    signature: String,      // 必填: 应用签名
    packageCode: String,    // 必填: 知识包编码
    doDisable: Boolean,     // 是否禁用
    rulesData: Object,      // 自定义决策表数据
    filterIds: Array        // 过滤项
}
```

#### 3.3.4 组件CDN地址

**决策集组件**:
- OA测试: `https://cdn.m.tencent.com/gaia_test_oa/rule/ruleNode.umd.min.js`
- OA生产: `https://cdn.m.tencent.com/gaia_oa/rule/ruleNode.umd.min.js`
- WOA测试: `https://cdn.m.tencent.com/gaia_test/rule/ruleNode.umd.min.js`
- WOA生产: `https://cdn.m.tencent.com/gaia/rule/ruleNode.umd.min.js`

**表达式组件**:
- OA测试: `https://cdn.m.tencent.com/gaia_test_oa/expression/ruleNode.umd.min.js`
- OA生产: `https://cdn.m.tencent.com/gaia_oa/expression/ruleNode.umd.min.js`
- WOA测试: `https://cdn.m.tencent.com/gaia_test/expression/ruleNode.umd.min.js`
- WOA生产: `https://cdn.m.tencent.com/gaia/expression/ruleNode.umd.min.js`

---

## 4. 依赖关系层

### 4.1 Maven依赖

```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>gaia</artifactId>
    <version>1.2.11-SNAPSHOT</version>
</dependency>
```

### 4.2 环境地址

#### 4.2.1 OA环境

| 环境 | 服务地址 | 前端地址 | 说明 |
|------|---------|---------|------|
| 测试 | http://dev-ntsgw.woa.com/api/esb/hr-gaia-service | http://test.gaia.hr.woa.com | 需要网关appName和appToken |
| 生产 | http://ntsgw.woa.com/api/esb/hr-gaia-service | http://gaia.hr.woa.com | 需要网关appName和appToken |

#### 4.2.2 公有云环境

| 环境 | 服务地址 | 前端地址 | 说明 |
|------|---------|---------|------|
| 测试1 | http://hrgw-ehrdev.test-caagw.yunassess.com/api/esb/hr-gaia-service | http://gaia-gaiya.test-caagw.yunassess.com | 账号:18823066231, 验证码:1234 |
| 测试2 | http://gateway.testihrtas.com/api/esb/hr-gaia-service | - | 需要网关appName和appToken |
| 生产1 | https://hrgw-sdc.ihr.tencent-cloud.com/api/esb/hr-gaia-service | https://gaia-sdc.ihr.tencent-cloud.com | 需要网关appName和appToken |
| 生产2 | http://gateway.prodihrtas.com/api/esb/hr-gaia-service | - | 需要网关appName和appToken |

### 4.3 网关依赖

测试环境、正式环境调用需要通过网关，不同的环境和区域有不同的ID和Token:

**配置项**:
- `hrgwAppName`: 网关应用ID (可选)
- `hrgwAppToken`: 网关应用Token (可选)

**注意**: 开发环境不需要网关配置

---

## 5. 使用指南层

### 5.1 快速开始

#### 5.1.1 Maven配置

**pom.xml**:
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>gaia</artifactId>
    <version>1.2.11-SNAPSHOT</version>
</dependency>
```

#### 5.1.2 配置文件

**application.yml**:
```yaml
gaia:
  appId: irecruit                  # 应用ID(在知识包调用配置中获取)
  appKey: bd08b089-cfb7-4844-82f5-be4d2307b7d0  # 应用Key
  baseUrl: http://dev-ntsgw.woa.com/api/esb/hr-gaia-service  # 服务地址
  kpPath: ./kp                      # 知识包缓存路径
  hrgwAppName: test                 # 网关应用ID(可选)
  hrgwAppToken: test                # 网关Token(可选)
```

**application.properties**:
```properties
gaia.appId=irecruit
gaia.appKey=bd08b089-cfb7-4844-82f5-be4d2307b7d0
gaia.baseUrl=http://dev-ntsgw.woa.com/api/esb/hr-gaia-service
gaia.kpPath=./kp
gaia.hrgwAppName=test
gaia.hrgwAppToken=test
```

#### 5.1.3 代码示例

**分布式模式(推荐)**:
```java
@Autowired
private Gaia gaia;

@GetMapping("/local")
public Map<String, Object> execRuleLocal() {
    // 构造参数
    Staff staff = new Staff();
    staff.role = "管理员";
    staff.org = 2;
    
    Map<String, Object> inputs = new HashMap<>();
    inputs.put("user", staff);
    inputs.put("strA", "");
    
    try {
        // 执行规则(本地执行,毫秒级响应)
        Map<String, Object> res = gaia.Execute("demo_test", inputs);
        System.out.println("执行结果: " + res);
        return res;
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
```

**独立服务模式**:
```java
@GetMapping("/remote")
public Res<List<OutputDTO>> execRuleRemote() {
    // 构造参数
    Staff staff = new Staff();
    staff.role = "管理员";
    staff.org = 2;
    
    Map<String, Object> inputs = new HashMap<>();
    inputs.put("user", staff);
    inputs.put("strA", "");
    
    try {
        // 远程执行规则
        Res<List<OutputDTO>> res = gaia.ExecuteRemote("demo_test", inputs);
        System.out.println("执行结果: " + new Gson().toJson(res));
        return res;
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}
```

### 5.2 完整示例

#### 5.2.1 知识包管理示例

```java
@Autowired
private Gaia gaia;

public void knowledgePackageManagement() {
    // 获取知识包详情
    KnowledgePackageDTO kp = gaia.GetKnowledgePackageService()
        .getKnowledgePackageDetail("yc_5");
    System.out.println(new Gson().toJson(kp));
    
    // 获取知识包版本列表
    List<RuleVersionDTO> versions = gaia.GetKnowledgePackageService()
        .getKnowledgePackageVersions("yc_5");
    System.out.println(new Gson().toJson(versions));
    
    // 设置知识包线上版本
    boolean success = gaia.GetKnowledgePackageService()
        .setKnowledgePackageVersion("yc_5", 32);
    System.out.println("设置版本结果: " + success);
}
```

#### 5.2.2 资源管理示例

```java
public void resourceManagement() {
    GaiaResourceService resourceService = gaia.GetResourceService();
    
    // 创建资源
    CreateResourceDTO data = new CreateResourceDTO();
    data.setTypeId(1);              // 资源类型ID
    data.setTitle("用户信息");       // 资源名称
    data.setExpression("user");     // 资源表达式
    data.setDataTypeId(1);          // 数据类型ID
    
    boolean created = resourceService.createResource(data);
    System.out.println("创建资源结果: " + created);
    
    // 获取资源列表
    List<RuleResource> resources = resourceService.getResourceList(1, "用户");
    System.out.println("资源列表: " + new Gson().toJson(resources));
}
```

#### 5.2.3 多应用配置示例

```java
public void multiAppConfig() {
    gaia.SetMultiConfig(Arrays.asList(
        new GaiaConfig().setAppId("irecruit").setAppKey("cdcf7db7-xxxxx"),
        new GaiaConfig().setAppId("RS").setAppKey("c1d2d594-xxxxxx"),
        new GaiaConfig().setAppId("holiday").setAppKey("f8988dfc-xxxxxx")
    ));
    
    // 配置后可以执行不同应用的规则
    Map<String, Object> result1 = gaia.Execute("irecruit_package", inputs);
    Map<String, Object> result2 = gaia.Execute("RS_package", inputs);
}
```

### 5.3 最佳实践

#### 5.3.1 选择合适的执行模式

✅ **推荐使用分布式模式**:
- **优势**: 规则本地缓存,毫秒级响应,无网络开销
- **适用**: 高频调用、性能敏感的场景
- **原理**: SDK启动后拉取规则到本地,通过长连接实时更新

❌ **独立服务模式慎用**:
- **劣势**: 每次调用都需要网络请求,响应慢
- **适用**: 低频调用、无法集成SDK的场景
- **原理**: 规则托管在服务端,通过HTTP接口调用

#### 5.3.2 变量 vs 参数

**变量(Variable)**:
- 传递引用,规则执行结果直接作用于变量对象
- 适用于复杂对象,如: 员工信息、订单数据
- 示例: `Staff staff = new Staff(); inputs.put("user", staff);`

**参数(Parameter)**:
- 传递值,规则执行结果通过返回值获取
- 适用于简单类型,如: String、Integer
- 示例: `inputs.put("amount", 10000);`

#### 5.3.3 规则设计原则

1. **单一职责**: 每个规则集只负责一个业务场景
2. **优先级合理**: 数字越小优先级越高,高优先级会覆盖低优先级
3. **善用互斥组**: 避免多个规则同时生效,类似if-else
4. **循环规则**: 批量处理集合数据,避免多次调用

#### 5.3.4 性能优化建议

1. **缓存路径配置**: `kpPath`配置本地缓存目录,避免每次拉取
2. **多应用预加载**: 使用`SetMultiConfig`提前加载多个应用规则
3. **输入参数最小化**: 只传递规则需要的字段,减少序列化开销
4. **版本稳定后固化**: 测试通过后设置线上版本,避免频繁更新

### 5.4 反模式(不推荐的用法)

❌ **频繁调用独立服务模式**
```java
// 错误示例
for (int i = 0; i < 1000; i++) {
    gaia.ExecuteRemote("package_code", inputs);  // 每次都网络请求,性能差
}

// 正确做法: 使用分布式模式
for (int i = 0; i < 1000; i++) {
    gaia.Execute("package_code", inputs);  // 本地执行,高性能
}
```

❌ **不处理异常**
```java
// 错误示例
Map<String, Object> res = gaia.Execute("package_code", inputs);  // 可能抛出异常

// 正确做法
try {
    Map<String, Object> res = gaia.Execute("package_code", inputs);
    // 处理结果
} catch (Exception e) {
    // 异常处理: 降级逻辑、告警、日志
    log.error("规则执行失败", e);
}
```

❌ **硬编码应用配置**
```java
// 错误示例
String appId = "irecruit";
String appKey = "bd08b089-cfb7-4844-82f5-be4d2307b7d0";

// 正确做法: 使用配置文件或配置中心
@Value("${gaia.appId}")
private String appId;
```

### 5.5 性能指标

| 场景 | QPS | 响应时间 | 说明 |
|------|-----|---------|------|
| 分布式模式(简单规则) | 10000+ | <5ms | 本地执行,无网络开销 |
| 分布式模式(复杂规则) | 5000+ | 10-20ms | 包含循环、嵌套条件 |
| 独立服务模式 | 500 | 50-100ms | 网络请求+服务端执行 |
| 规则热更新 | - | 实时生效 | 长连接推送,秒级更新 |

---

## 6. 数据契约层

### 6.1 核心概念

#### 6.1.1 基础库资源

**变量(Variable)**:
- **定义**: POJO、BOM对象,作为数据载体
- **使用**: 规则执行时传入变量实体
- **传递方式**: 引用传递(分布式模式下)
- **数据结构**:
```java
{
    "resourceId": 13931,
    "name": "用户",            // 显示名
    "expression": "user",      // 变量名
    "typeId": 1,              // 类型ID: 1-变量
    "dataTypeId": 10,         // 数据类型: 10-Object
    "children": [{            // 子字段
        "resourceId": 13932,
        "name": "角色",
        "expression": "role",
        "dataTypeId": 1       // 数据类型: 1-String
    }]
}
```

**常量(Constant)**:
- **定义**: 预定义的枚举值、字典数据
- **数据来源**: API接口拉取
- **内置常量**: HR主数据(员工、组织、汇报关系)
- **数据格式**:
```json
[{
    "name": "北京",          // 显示值
    "value": "1",           // 实际值
    "type": "Integer"       // 数据类型
}, {
    "name": "上海",
    "value": "2",
    "type": "Integer"
}]
```

**参数(Parameter)**:
- **定义**: 规则中的临时变量
- **传递方式**: 值传递
- **返回方式**: 通过返回值获取
- **支持类型**: String, Integer, Character, Double, Long, Float, BigDecimal, Boolean

**函数(Function)**:
- **定义**: 可调用的方法、科学计算、对象操作
- **参数格式**: `$String#目标字符串$String,Character#指定字符`
- **示例**:
  - `$String#目标字符串` - 一个String参数
  - `$String#字符串$Integer#数值` - 两个参数

**方法(Method)**:
- **定义**: 业务服务本地代码方法
- **限制**: 仅支持分布式模式
- **配置**: 需要在FunctionGroup子类中定义

#### 6.1.2 规则类型

**规则类型枚举**:
```java
public enum RuleType {
    Normal(1, "一般规则"),
    LoopResourceList(2, "指定的集合对象"),
    LoopVariable(3, "指定类型的所有变量对象")
}
```

**一般规则**: 普通的if-then-else逻辑

**循环规则(指定集合对象)**:
- 对集合中的每个对象执行规则
- 循环对象: List类型字段、常量数组、函数返回数组

**循环规则(指定变量对象)**:
- 对指定类型的所有变量对象循环
- 参数名固定: `loop_list_变量类名`

### 6.2 数据结构

#### 6.2.1 知识包结构

```java
{
    "packageId": 23,
    "name": "报销规则",
    "code": "reimbursement_rule",        // 知识包编码
    "ruleSetId": 85,
    "ruleSetName": "报销规则集",
    "busAppId": 2,
    "busAppName": "招聘小助手",
    "busAreaId": 1,
    "busAreaName": "招聘",
    "statusId": 2,                       // 状态: 1-未发布, 2-正在运行
    "statusName": "正在运行",
    "releaseVersionId": 32,              // 当前线上版本ID
    "releaseVersionName": "2",
    "invokeModeId": 2,                   // 调用模式: 1-独立服务, 2-分布式
    "invokeModeName": "分布式计算模式"
}
```

#### 6.2.2 规则结构

```json
{
    "ruleId": 651,
    "name": "规则A",
    "priority": 100,              // 优先级: 数字越小越高
    "typeId": 1,                  // 规则类型: 1-一般, 2-循环集合, 3-循环变量
    "mutexGroup": "group1",       // 互斥组
    "loopTarget": {               // 循环对象
        "id": 13931
    },
    "rules": [{                   // 规则条目
        "left": {                 // 条件(LHS)
            "link": "&&",         // 连接符: && 或 ||
            "children": [{
                "module": {       // 条件模块
                    "calculatorId": 5,  // 计算符ID: 5-等于
                    "left": [{
                        "id": 13932,
                        "typeId": 1    // 变量
                    }],
                    "right": [{
                        "id": 0,
                        "typeId": 6,   // 输入值
                        "value": "管理员"
                    }]
                }
            }]
        },
        "right": {                // 动作(RHS)
            "action": [{          // 满足条件时执行
                "calculatorId": -1,  // -1表示赋值
                "left": [{
                    "id": 10184
                }],
                "right": [{
                    "id": 42,
                    "param": [[{
                        "id": 0,
                        "typeId": 6,
                        "value": "gaia"
                    }]]
                }]
            }],
            "elseAction": [{      // 不满足条件时执行
                "calculatorId": -1,
                "left": [{"id": 10184}],
                "right": [{
                    "id": 0,
                    "typeId": 6,
                    "value": "Fail"
                }]
            }]
        }
    }]
}
```

#### 6.2.3 资源类型

```java
public enum ResourceType {
    Variable(1, "变量"),
    Constant(2, "常量"),
    Parameter(3, "参数"),
    Function(7, "函数"),
    LoopObject(10, "循环对象"),
    InputValue(6, "输入值"),
    MathSymbol(8, "数学符号"),
    BracketSymbol(9, "优先符号")
}
```

#### 6.2.4 计算符类型

**比较计算符**:
```java
public enum CompareCalculatorType {
    GreaterThan(1, ">"),
    LessThan(2, "<"),
    GreaterOrEqual(3, ">="),
    LessOrEqual(4, "<="),
    Equal(5, "=="),
    NotEqual(6, "!="),
    Contains(7, "包含"),
    NotContains(8, "不包含"),
    In(9, "属于"),
    NotIn(10, "不属于")
}
```

**动作计算符**:
```java
public enum ActionCalculatorType {
    Assign(-1, "赋值"),
    // 其他动作
}
```

**数学符号**:
```java
public enum MathSymbolType {
    Plus(1, "+"),
    Minus(2, "-"),
    Times(3, "*"),
    Divided(4, "/"),
    Mod(5, "%")
}
```

### 6.3 数据类型

支持的数据类型:
- `String` - 字符串
- `Integer` - 整数
- `Long` - 长整数
- `Float` - 浮点数
- `Double` - 双精度浮点数
- `BigDecimal` - 高精度小数
- `Boolean` - 布尔值
- `Character` - 字符
- `Object` - 对象
- `List` - 列表

---

## 7. 运行时行为层

### 7.1 事务特性

- **不支持事务**: Gaia规则引擎本身不支持事务
- **建议**: 在业务层控制事务,规则执行结果作为业务判断依据

### 7.2 幂等性

- **规则执行**: 相同输入多次执行,结果一致(幂等)
- **规则更新**: 不幂等,每次更新都会生成新版本
- **版本设置**: 幂等,设置相同版本多次调用无影响

### 7.3 并发安全

**分布式模式**:
- ✅ **线程安全**: SDK内部使用线程安全的缓存机制
- ⚠️ **变量传递**: 传递引用,多线程需要注意变量对象的并发安全

**独立服务模式**:
- ✅ **线程安全**: 每次请求独立执行,无并发问题

**并发建议**:
```java
// 多线程场景下,每个线程使用独立的变量对象
for (int i = 0; i < threadCount; i++) {
    executor.submit(() -> {
        // 每个线程创建新的变量对象
        Staff staff = new Staff();
        staff.setRole("管理员");
        
        Map<String, Object> inputs = new HashMap<>();
        inputs.put("user", staff);
        
        gaia.Execute("package_code", inputs);
    });
}
```

### 7.4 异步特性

- **规则执行**: 同步执行,立即返回结果
- **规则更新**: 异步推送(分布式模式),通过长连接实时通知
- **更新延迟**: 秒级生效(通常<3秒)

### 7.5 缓存策略

**分布式模式缓存**:
- **缓存位置**: `kpPath`配置的本地目录
- **缓存内容**: 知识包规则、基础库资源
- **缓存更新**: 长连接推送,实时更新
- **缓存失效**: 应用重启时重新拉取

**独立服务模式缓存**:
- **无本地缓存**: 每次请求服务端执行
- **服务端缓存**: 服务端缓存规则,热更新后立即生效

---

## 8. 错误处理层

### 8.1 常见错误

#### 8.1.1 规则执行错误

**错误**: `Cannot invoke method xxx() on null object`

**原因**:
- 方法库中的方法是业务服务本地代码
- 独立服务模式无法调用本地方法

**解决方案**:
- 使用分布式模式执行规则
- 或将方法迁移到Gaia SDK中

#### 8.1.2 签名错误

**错误**: `签名验证失败` / `X-GAIA-SIGN无效`

**原因**:
- 签名计算错误
- 时间戳过期(超过2小时)
- appId或appKey不匹配

**解决方案**:
```java
// 确认签名算法正确
String signature = UtilTool.sha256(appId + timestamp + appKey);

// 确认时间戳为当前时间(毫秒)
String timestamp = Long.toString(System.currentTimeMillis());

// 确认appId和appKey与服务端配置一致
```

#### 8.1.3 资源引用错误

**错误**: `资源被占用,无法删除`

**原因**: 资源被规则引用,存在依赖关系

**解决方案**:
1. 点击"查看引用"查看哪些规则引用了该资源
2. 修改规则,移除对该资源的引用
3. 重新尝试删除

#### 8.1.4 知识包版本错误

**错误**: `知识包未发布` / `线上版本未设置`

**原因**: 知识包没有发布版本或没有设置线上版本

**解决方案**:
1. 进入知识包管理页面
2. 点击"发布"按钮,发布新版本
3. 点击"更改线上版本",设置当前版本为线上版本

### 8.2 错误码表

| 错误码 | 说明 | 处理方式 |
|--------|------|---------|
| 0 | 执行失败 | 查看msg字段获取详细错误信息 |
| 1 | 执行成功 | 正常处理返回结果 |
| 401 | 签名错误 | 检查签名算法和时间戳 |
| 404 | 知识包不存在 | 确认知识包编码是否正确 |
| 500 | 服务器错误 | 查看日志,联系管理员 |

### 8.3 降级策略

**规则执行失败降级**:
```java
try {
    Map<String, Object> res = gaia.Execute("package_code", inputs);
    // 正常逻辑
} catch (Exception e) {
    log.error("规则执行失败,使用默认逻辑", e);
    // 降级逻辑: 使用默认规则或人工审批
    return defaultProcess(inputs);
}
```

**网络异常降级**:
```java
// 分布式模式: 使用本地缓存,无网络依赖
// 独立服务模式: 设置超时,超时后降级
RestTemplate restTemplate = new RestTemplate();
SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
factory.setConnectTimeout(3000);  // 连接超时3秒
factory.setReadTimeout(5000);     // 读取超时5秒
restTemplate.setRequestFactory(factory);
```

### 8.4 重试机制

**SDK自动重试**:
- 分布式模式: 本地执行,无需重试
- 独立服务模式: 网络异常时自动重试1次

**业务层重试**:
```java
public Map<String, Object> executeWithRetry(String packageCode, Map<String, Object> inputs) {
    int maxRetry = 3;
    for (int i = 0; i < maxRetry; i++) {
        try {
            return gaia.Execute(packageCode, inputs);
        } catch (Exception e) {
            if (i == maxRetry - 1) {
                throw e;  // 最后一次重试失败,抛出异常
            }
            log.warn("规则执行失败,第{}次重试", i + 1);
            Thread.sleep(1000 * (i + 1));  // 指数退避
        }
    }
    return null;
}
```

---

## 9. 配置说明层

### 9.1 配置项清单

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| gaia.appId | String | 是 | - | 应用ID,在知识包调用配置中获取 |
| gaia.appKey | String | 是 | - | 应用Key,用于签名验证 |
| gaia.baseUrl | String | 是 | - | Gaia服务地址 |
| gaia.execUrl | String | 否 | baseUrl | 远程执行地址(独立服务模式) |
| gaia.kpPath | String | 否 | ./kp | 知识包缓存路径(分布式模式) |
| gaia.hrgwAppName | String | 否 | - | 网关应用ID(测试/生产环境需要) |
| gaia.hrgwAppToken | String | 否 | - | 网关应用Token(测试/生产环境需要) |

### 9.2 各环境配置示例

#### 9.2.1 OA测试环境

```yaml
gaia:
  appId: test-app
  appKey: test-key-xxxxx
  baseUrl: http://dev-ntsgw.woa.com/api/esb/hr-gaia-service
  kpPath: ./kp
  hrgwAppName: test-app
  hrgwAppToken: test-token-xxxxx
```

#### 9.2.2 OA生产环境

```yaml
gaia:
  appId: prod-app
  appKey: prod-key-xxxxx
  baseUrl: http://ntsgw.woa.com/api/esb/hr-gaia-service
  kpPath: /data/gaia/kp
  hrgwAppName: prod-app
  hrgwAppToken: prod-token-xxxxx
```

#### 9.2.3 公有云测试环境

```yaml
gaia:
  appId: cloud-test-app
  appKey: cloud-test-key-xxxxx
  baseUrl: http://hrgw-ehrdev.test-caagw.yunassess.com/api/esb/hr-gaia-service
  kpPath: ./kp
  hrgwAppName: cloud-test-app
  hrgwAppToken: cloud-test-token-xxxxx
```

#### 9.2.4 公有云生产环境

```yaml
gaia:
  appId: cloud-prod-app
  appKey: cloud-prod-key-xxxxx
  baseUrl: https://hrgw-sdc.ihr.tencent-cloud.com/api/esb/hr-gaia-service
  kpPath: /data/gaia/kp
  hrgwAppName: cloud-prod-app
  hrgwAppToken: cloud-prod-token-xxxxx
```

### 9.3 动态配置

**不支持热更新的配置**:
- `appId`, `appKey` - 需要重启应用
- `baseUrl`, `execUrl` - 需要重启应用
- `kpPath` - 需要重启应用

**支持热更新的配置**:
- 规则内容 - 分布式模式下,规则更新后秒级生效
- 知识包版本 - 通过API设置,立即生效

### 9.4 默认配置

```java
// SDK默认配置
public class GaiaConfig {
    private String appId = "";
    private String appKey = "";
    private String baseUrl = "";
    private String execUrl = "";          // 默认与baseUrl一致
    private String kpPath = "./kp";       // 默认当前目录下的kp文件夹
    private String hrgwAppName = "";
    private String hrgwAppToken = "";
}
```

---

## 10. 规则创建与管理

### 10.1 基础库管理

#### 10.1.1 变量库

**新增变量**:
1. 点击左侧列表"变量库" → 右上角"添加"
2. 选择所属领域(必填)
3. 选择所属应用(可选,选择后仅该应用可用)
4. 输入变量名称(显示名)
5. 输入变量类名(代码中的变量名)
6. 保存变量

**新增变量字段**:
1. 点击已创建的变量
2. 右侧弹出面板中添加字段
3. 输入字段标题(显示名)
4. 输入字段名(属性名)
5. 选择数据类型
6. 保存字段

#### 10.1.2 常量库

**新增常量**:
1. 点击"常量库" → "添加常量"
2. 选择所属领域
3. 选择所属应用(可选)
4. 输入常量名称(唯一标识)
5. 输入常量标题(显示名)
6. 输入服务地址(API接口,返回常量数据)
7. 保存常量

**常量服务接口要求**:
```json
[{
    "name": "北京",      // 显示值
    "value": "1",       // 实际值
    "type": "Integer"   // 数据类型
}]
```

**特殊常量**:
- `staff_id` - 员工选择器(员工ID)
- `staff_name` - 员工选择器(员工英文名)
- `unit_id` - 组织选择器
- `unit_name` - 组织选择器
- `post_id` - 岗位选择器
- `post_name` - 岗位选择器

#### 10.1.3 参数库

**新增参数**:
1. 点击"参数库" → "添加"
2. 选择所属领域
3. 选择所属应用(可选)
4. 输入参数标题(显示名)
5. 输入参数名称(代码中的参数名)
6. 选择数据类型
7. 保存参数

#### 10.1.4 方法库

**新增方法**:
1. 点击"方法库" → "添加"
2. 选择所属领域
3. 选择所属应用(可选)
4. 输入方法标题(显示名)
5. 输入方法名称(真实方法名)
6. 选择参数类型(可多选)
7. 选择返回值类型(单选)
8. 保存方法

**方法接入代码**:
```java
// 1. SDK版本改为0.0.4-SNAPSHOT
// 2. 本地方法写在FunctionGroup子类里
public class MyFunctionGroup extends FunctionGroup {
    public String myMethod(String param1) {
        return param1.toUpperCase();
    }
}

// 3. 执行规则时传入FunctionGroup对象
Map<String, Object> inputs = new HashMap<>();
inputs.put("_funcGroup", new MyFunctionGroup());
gaia.Execute("package_code", inputs);
```

### 10.2 规则库管理

#### 10.2.1 决策集

**添加决策集**:
1. 点击"决策集" → "添加"
2. 输入决策集名称、描述
3. 选择所属领域
4. 选择所属应用
5. 保存决策集

**添加规则**:
1. 点击已创建的决策集
2. 点击右上角"添加规则"
3. 输入规则名称
4. 设置优先级(数字越小越高,高优先级覆盖低优先级)
5. 配置互斥组(可选,同组规则互斥执行)
6. 选择规则类型(一般规则/循环规则)
7. 配置"如果"条件
8. 配置"那么"动作(条件满足时执行)
9. 配置"否则"动作(条件不满足时执行)
10. 保存规则

**规则配置示例**:
- **如果**: 变量"用户.角色" 等于 输入值"管理员"
- **那么**: 参数"审批结果" 赋值 输入值"自动通过"
- **否则**: 参数"审批结果" 赋值 输入值"需要审批"

#### 10.2.2 表达式

表达式是没有动作的决策集,只返回条件是否满足(Boolean)。

**添加表达式**:
1. 点击"表达式" → "添加"
2. 输入表达式名称、描述
3. 选择所属领域
4. 选择所属应用
5. 配置条件逻辑
6. 保存表达式

**返回值**: 默认返回参数`expression_result`(Boolean)

### 10.3 知识包管理

**添加知识包**:
1. 点击"知识包" → "添加知识包"
2. 输入知识包名称
3. 输入知识包编码(调用时的唯一标识)
4. 选择领域
5. 选择应用
6. 选择对应的规则库(决策集/表达式)
7. 保存知识包

**发布知识包**:
1. 点击知识包右侧"..." → "发布"
2. 输入版本号
3. 选择是否替换线上版本
4. 提交发布

**设置线上版本**:
1. 点击"..." → "更改线上版本"
2. 选择目标版本
3. 确认设置

**调用配置**:
- **独立服务模式**: 通过API/SDK远程调用
- **分布式模式**: 规则缓存到本地执行(推荐)

**快速测试**:
1. 点击"..." → "快速测试"
2. 输入测试参数
3. 点击"运行"
4. 查看执行结果

---

## 11. 常见问题

### 11.1 产品相关

**Q: 页面提示获取不到资源?**

A: 确认是否存在页面跨域的情况,同时采用woa.com域名。

**Q: 分布式模式和独立服务模式如何选择?**

A: 推荐使用分布式模式,性能更好。分布式模式将规则缓存到本地执行,响应速度快;独立服务模式需要通过网络调用,响应慢。

**Q: 规则更新后多久生效?**

A: 分布式模式下,规则更新后通过长连接推送,通常3秒内生效;独立服务模式下立即生效。

**Q: 如何实现规则灰度发布?**

A: 
1. 发布新版本(不替换线上版本)
2. 部分应用先调用新版本测试
3. 测试通过后,设置新版本为线上版本
4. 所有应用自动切换到新版本

**Q: 规则能否回滚?**

A: 可以。点击"更改线上版本",选择历史版本即可回滚。

---

## 12. 附录

### 12.1 枚举类型

#### 12.1.1 资源类型

```java
public enum ResourceType {
    Variable(1, "变量"),
    Constant(2, "常量"),
    Parameter(3, "参数"),
    Function(7, "函数"),
    LoopObject(10, "循环对象"),
    InputValue(6, "输入值"),
    MathSymbol(8, "数学符号"),
    BracketSymbol(9, "优先符号")
}
```

#### 12.1.2 规则类型

```java
public enum RuleType {
    Normal(1, "一般规则"),
    LoopResourceList(2, "指定的集合对象"),
    LoopVariable(3, "指定类型的所有变量对象")
}
```

#### 12.1.3 调用模式

```java
public enum InvokeMode {
    Independent(1, "独立服务模式"),
    Distributed(2, "分布式模式")
}
```

#### 12.1.4 知识包状态

```java
public enum PackageStatus {
    NotPublished(1, "未发布"),
    Running(2, "正在运行"),
    Stopped(3, "已停用")
}
```

### 12.2 相关文档

- **SDK Demo**: https://git.woa.com/zhenlychen/Gaia-Demo
- **微服务网关签名算法**: https://iwiki.woa.com/p/4009335092
- **规则结构思维导图**: https://docs.qq.com/mind/DUGJuZ0t1ZnN1c1hO

### 12.3 联系方式

- **负责人**: haozonggui(桂豪纵)、cxyxhhuang
- **团队**: 基础组件组
- **问题反馈**: 如有疑问可与haozonggui(桂豪纵)进一步沟通

---

**文档结束**
