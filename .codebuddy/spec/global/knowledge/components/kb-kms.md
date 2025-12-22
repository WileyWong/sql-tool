# KMS密钥管理服务接口文档

## 1. 基础信息层

- **服务名称**: KMS密钥管理服务 (Key Management Service)
- **所属模块**: HR基础组件组 / 基础组件研发
- **版本信息**: SDK v3.0.4 (Java), v1.0.4 (Go)
- **负责人/维护者**: teemochen(陈繁)、haozonggui(桂豪纵)
- **状态标识**: 生产环境稳定运行，推荐使用

## 2. 功能概述层

- **核心职责**: 提供企业级密钥管理能力，通过技术手段保障密钥100%安全，使得数据运维、开发人员都无法破解密钥
- **使用场景**: 
  - 业务系统中的数据库密码、哈希盐、私钥证书等高保密性信息的存储和管理
  - 数据同步加密（如Workday海外和国内双向数据同步）
  - 薪酬等最高级保密数据的加解密
  - 需要密钥集中管理和权限控制的场景
- **设计目的**: 通过集中化密钥管理、多重安全保障机制，确保应用密钥的绝对安全，降低密钥泄露风险
- **业务价值**: 
  - 保障数据安全：密钥100%安全，即使系统管理员、运维人员、开发人员都无法破解
  - 灵活授权：支持应用间临时授权、IP段限制、MOA确认等多种安全控制
  - 合规要求：满足薪酬等敏感数据的安全合规要求

## 3. 接口定义层

### 3.1 Java SDK接口

#### 3.1.1 创建或更新密钥

**接口名称**: `KmsSdkService.createOrUpdateSecret(String key, String value)`

**参数说明**:
```java
public boolean createOrUpdateSecret(String key, String value)
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | String | 是 | 密钥名称，应用内唯一标识 |
| value | String | 是 | 密钥内容（明文） |

**返回值说明**:
- 类型: `boolean`
- `true`: 创建/更新成功
- `false`: 创建/更新失败

#### 3.1.2 获取密钥内容

**接口名称**: `KmsSdkService.getSecretContent(String key)`

**参数说明**:
```java
public String getSecretContent(String key)
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | String | 是 | 密钥名称 |

**返回值说明**:
- 类型: `String`
- 返回密钥的明文内容
- 如果密钥不存在，返回 `null`

#### 3.1.3 获取密钥历史版本

**接口名称**: `KmsSdkService.getSecretContentHistory(String key)`

**参数说明**:
```java
public GetSecretHistoryRet getSecretContentHistory(String key)
```

**返回值说明**:
```java
public class GetSecretHistoryRet {
    private List<String> histories;  // 历史版本值列表
}
```

#### 3.1.4 授权第三方应用临时获取密钥

**接口名称**: `POST /automation/v2/sdk/authSecret`

**请求参数**:
```json
{
   "secretNames": ["secretKey1", "secretKey2"],
   "authedTo": "hrfileservices",
   "count": 10,
   "expiry": 1648192929765
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| secretNames | String[] | 是 | 要授权的密钥名称列表 |
| authedTo | String | 是 | 被授权的应用名称 |
| count | Integer | 是 | 允许使用次数 |
| expiry | Long | 是 | 过期时间戳（毫秒） |

**返回值说明**:
```json
{
   "tokenKey": "授权token"
}
```

### 3.2 Go SDK接口

#### 3.2.1 创建或更新密钥

**接口名称**: `kms.CreateOrUpdate(key string, value string) error`

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | string | 是 | 密钥名称 |
| value | string | 是 | 密钥内容 |

**返回值**: `error` - 错误信息，成功返回 `nil`

#### 3.2.2 获取密钥内容

**接口名称**: `kms.Get(key string) (string, error)`

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | string | 是 | 密钥名称 |

**返回值**: 
- `string`: 密钥内容
- `error`: 错误信息

### 3.3 HTTP接口

#### 3.3.1 证书登录（需要MOA认证时）

**Path**: `POST /automation/v2/sdk/login`

**请求参数**:
```json
{
   "random": 123
}
```

**返回值**: HTTP Status Code 200 表示登录请求已提交

#### 3.3.2 检查登录确认状态

**Path**: `GET /automation/v2/sdk/checkLoginConfirm?random=123`

**返回值**: HTTP Status Code 200 表示已允许登录

#### 3.3.3 创建或更新密钥内容

**Path**: `POST /automation/v2/secrets/sdk/{name}`

**请求参数**:
```json
{
   "content": "value"
}
```

**返回值**: HTTP Status Code 201 表示创建成功

#### 3.3.4 批量获取密钥内容

**Path**: `POST /automation/v2/secrets/sdk/request/contents`

**请求头**（需要MOA认证时）:
```
moa_random: 123
```

**请求参数**:
```json
{
   "secrets": ["name1", "name2"]
}
```

**返回值**:
```json
{
   "successSecrets": {
      "name1": "value1",
      "name2": "value2"
   },
   "missingSecrets": ["name3", "name4"]
}
```

#### 3.3.5 通过Token获取密钥

**Path**: `GET /automation/v2/sdk/getSecretInfos?tokenKey={tokenKey}`

**说明**: 需要携带KMS颁发的证书

**返回值**:
```json
{
   "secretNameMap": {
      "secretKey1": "value1",
      "secretKey2": "value2"
   }
}
```

#### 3.3.6 通过Token获取密钥Key列表

**Path**: `GET /automation/v2/sdk/secretKeysByToken?token={token}`

**说明**: 被授权应用需要带上KMS颁发的证书

**返回值**:
```json
["secretKey1", "secretKey2"]
```

#### 3.3.7 通过Token和Key获取密钥明文

**Path**: `GET /automation/v2/sdk/getSecretContentByTokenAndKey?token={token}&secretKey={secretKey}`

**说明**: 被授权应用需要带上KMS颁发的证书

**返回值**: 返回密钥明文字符串

#### 3.3.8 追加密钥到Token

**Path**: `POST /automation/v2/sdk/appendSecret`

**请求参数**:
```json
{
   "tokenKey": "token值",
   "secretNames": "name1,name2,name3"
}
```

## 4. 依赖关系层

### 4.1 上游依赖

**Java应用依赖**:
```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>kms-spring-boot-starter</artifactId>
    <version>3.0.4</version>
</dependency>
```

**Go应用依赖**:
```go
require "git.woa.com/hrplat-middletier/kmsgo" v1.0.4
```

**证书依赖**:
- 需要在KMS管理端申请客户端证书（.p12格式）
- 需要下载对应环境的CA根证书

### 4.2 环境依赖

**内网环境地址**:

| 环境 | 分区 | Profile | 访问地址 |
|------|------|---------|----------|
| 内网 | 开发 | dev | - |
| 内网 | 测试 | test | https://test-kms-ntsgw.woa.com |
| 内网 | UAT | uat | - |
| 内网 | 仿真 | sim | - |
| 内网 | 生产 | prod | https://kms-ntsgw.woa.com |
| 内网 | 生产严格 | prod | https://kms-strict-ntsgw.woa.com |

**外网环境地址**:

| 环境 | Profile | 访问地址 |
|------|---------|----------|
| 外网 | 测试 | etest | http://kms-ntp.test-caagw.yunassess.com |
| 外网 | UAT | - | https://kms-ntp.uathr.tencent-cloud.com/ |
| 外网 | 生产 | eprod | https://kms-ntp.ihr.tencent-cloud.com/ |

### 4.3 下游影响

- 业务系统依赖KMS存储和获取密钥
- 密钥变更会影响所有使用该密钥的业务系统
- 建议在密钥更新时使用历史版本功能保持兼容

## 5. 使用指南层

### 5.1 Java应用快速接入

#### 步骤1: 联系管理员开通权限

联系 **teemochen(陈繁)** 开通测试环境和正式环境KMS权限，获取应用管理员账号。

#### 步骤2: 申请并下载证书

在KMS管理端 **证书管理** 模块创建证书，下载 `.p12` 格式证书文件和密码。

#### 步骤3: 添加Maven依赖

```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>kms-spring-boot-starter</artifactId>
    <version>3.0.4</version>
</dependency>
```

#### 步骤4: 配置证书

将证书文件放到 `src/main/resources/certs` 目录下。

在 `application.properties` 中添加配置:
```properties
# 证书路径
kms.key-store=certs/xxxx.p12
# 证书密码
kms.key-store-password=证书密码
# 薪酬类应用需要设置为true
kms.strict=false
```

#### 步骤5: 设置Spring Profile

根据不同环境设置对应的profile值（见上述环境依赖表）。

#### 步骤6: 使用SDK

```java
@Autowired
KmsSdkService kmsSdkService;

// 创建或更新密钥
boolean result = kmsSdkService.createOrUpdateSecret("db_password", "MyPassword123");

// 获取密钥
String password = kmsSdkService.getSecretContent("db_password");
System.out.println("密码: " + password);

// 获取历史版本
GetSecretHistoryRet historyRet = kmsSdkService.getSecretContentHistory("db_password");
List<String> histories = historyRet.getHistories();
for(String value: histories){
    System.out.println("历史版本: " + value);
}
```

### 5.2 Go应用快速接入

#### 步骤1: 联系管理员

联系 **teemochen(陈繁)** 开通KMS权限，获取TLS证书及密码。

#### 步骤2: 添加依赖

在 `go.mod` 中添加:
```go
require "git.woa.com/hrplat-middletier/kmsgo" v1.0.4
```

#### 步骤3: 初始化并使用

```go
import kmsgo "git.woa.com/hrplat-middletier/kmsgo"

func main() {
    // 初始化KMS客户端
    kms, err := kmsgo.New(
        "https://test-kms-ntsgw.woa.com:18443",
        "/path/to/truststore.pem",   // CA证书路径
        "/path/to/client.p12",        // 客户端证书路径
        "证书密码")
    
    if err != nil {
        log.Fatal(err)
        return
    }
    
    // 创建密钥
    err = kms.CreateOrUpdate("db_password", "MyPassword123")
    if err != nil {
        log.Fatal(err)
        return
    }
    
    // 获取密钥
    content, err := kms.Get("db_password")
    if err != nil {
        log.Fatal(err)
        return
    }
    
    log.Printf("密钥内容: %s", content)
}
```

### 5.3 多证书配置示例

适用于一个应用需要引用多套证书的场景（SDK 3.0.2+）。

**配置示例**:
```properties
kms.strict=false

# 第一个证书配置
kms.connects[0].cert-name=app1
kms.connects[0].key-store=keys/371.p12
kms.connects[0].key-store-password=FY99xF5CkYDskf0qR3gC
kms.connects[0].enable=true

# 第二个证书配置
kms.connects[1].cert-name=app2
kms.connects[1].key-store=keys/372.p12
kms.connects[1].key-store-password=Iod93X48a1uKL7eWAbre
kms.connects[1].enable=true
```

**使用示例**:
```java
@Resource
KmsSdkServiceFactory kmsSdkServiceFactory;

void function(){
    // 使用app1证书
    KmsSdkService test1Service = kmsSdkServiceFactory.getSDKService("app1");
    String value = test1Service.getSecretContent("testKey");
    System.out.println(value);
    
    // 使用app2证书
    KmsSdkService uiTestService = kmsSdkServiceFactory.getSDKService("app2");
    String value2 = uiTestService.getSecretContent("my_key_1");
    System.out.println(value2);
}
```

### 5.4 Python使用授权Token获取密钥

```python
import requests
from requests_pkcs12 import get

requests.packages.urllib3.disable_warnings()

class KMS:
    """KMS客户端"""
    def __init__(self):
        self.cert_file = "/path/to/cert.p12"
        self.cert_pwd = "证书密码"
        self.url_prefix = "https://kms-ntsgw.woa.com"

    def get_secret_info_by_token(self, encryptToken: str):
        """通过Token获取密钥"""
        url = self.url_prefix + "/automation/v2/sdk/getSecretInfos?tokenKey=" + str(encryptToken)
        r = get(url,
                headers={"Content-Type": "application/json"},
                verify=False,
                pkcs12_filename=self.cert_file,
                pkcs12_password=self.cert_pwd)
        r.raise_for_status()
        res = r.json()
        return res

# 使用示例
if __name__ == "__main__":
    kms = KMS()
    encryptToken = "QLearningService_1540260834524180480"
    res = kms.get_secret_info_by_token(encryptToken)
    print(res)
    # {'secretNameMap': {'sdk_QLearningService_exam_user_face': 'iYR1F{#4eF?)6;E2'}}
```

### 5.5 最佳实践

#### ✅ 推荐做法

1. **密钥命名规范**: 使用有意义的命名，如 `db_password`、`redis_auth`、`jwt_secret`
2. **定期轮换密钥**: 定期更新敏感密钥，利用历史版本功能实现平滑过渡
3. **最小权限原则**: 只授权必要的应用访问密钥，设置合理的IP段限制
4. **临时授权**: 对第三方应用使用临时授权token，设置合理的过期时间和使用次数
5. **启用MOA确认**: 对于薪酬等高敏感场景，启用MOA确认增强安全性

#### ❌ 反模式

1. **不要将证书文件提交到代码库**: 证书应通过配置管理系统或环境变量注入
2. **不要在代码中硬编码密钥内容**: 所有密钥都应存储在KMS中
3. **不要过度授权**: 避免将密钥授权给不需要的应用
4. **不要忽略证书过期**: 定期检查并更新证书

### 5.6 性能建议

- **QPS限制**: 建议单应用QPS不超过100
- **超时时间**: 建议设置3-5秒超时时间
- **缓存策略**: 密钥内容可在应用内缓存，建议缓存时间5-30分钟
- **批量操作**: 使用批量获取接口一次性获取多个密钥，减少网络开销

## 6. 数据契约层

### 6.1 核心概念

**应用密钥（Secret）**:
- 业务系统中的数据库密码、哈希盐、私钥证书等高保密性信息
- 在KMS中存储加密后的内容，应用运行时从KMS获取明文

**系统管理员**:
- 负责添加或删除系统管理员，创建/编辑应用，给应用分配应用管理员
- 无法查看应用内的密钥数据，也无法生成应用的接入证书

**应用管理员**:
- 负责管理一个或多个应用内的密钥信息，生成客户端证书
- 不可对应用进行授权

**接入证书**:
- 由应用管理员生成，用于业务系统集成KMS SDK的证书
- 证书内包含应用身份信息、权限信息

**启动密钥**:
- KMS系统重启时需要启动密钥保管员输入启动密钥
- 完成初始化后系统才能正常提供服务

### 6.2 GetSecretHistoryRet 数据结构

```java
public class GetSecretHistoryRet {
    /**
     * 历史版本值列表
     * 按时间倒序排列，第一个元素为最新版本
     */
    private List<String> histories;
    
    public List<String> getHistories() {
        return histories;
    }
}
```

### 6.3 授权Token数据结构

**授权请求**:
```json
{
   "secretNames": ["密钥名称列表"],
   "authedTo": "被授权应用名",
   "count": 10,               // 使用次数限制
   "expiry": 1648192929765    // 过期时间戳（毫秒）
}
```

**授权响应**:
```json
{
   "tokenKey": "生成的授权token"
}
```

**通过Token获取密钥**:
```json
{
   "secretNameMap": {
      "secretKey1": "明文内容1",
      "secretKey2": "明文内容2"
   }
}
```

## 7. 运行时行为层

### 7.1 事务特性

- KMS不支持事务操作
- 建议在业务层控制密钥操作的原子性

### 7.2 幂等性

- `createOrUpdateSecret`: 幂等操作，重复调用会覆盖原有值
- `getSecretContent`: 幂等操作，重复调用返回相同结果
- 授权Token: 非幂等，每次授权生成新的token

### 7.3 并发安全

- SDK内部使用连接池，支持并发调用
- 密钥更新操作建议串行化，避免并发覆盖

### 7.4 异步特性

- SDK调用为同步阻塞调用
- HTTP接口均为同步请求

### 7.5 缓存策略

- SDK内部不做缓存
- 建议应用层根据业务需求实现缓存策略
- 推荐缓存时间: 5-30分钟

## 8. 错误处理层

### 8.1 常见错误场景

#### 错误1: Maven打包后启动报错

**错误信息**:
```
java.security.spec.InvalidKeySpecException DerInputStream.getLength(): lengthTag=111, too big.
```

**原因**: Maven在打包时会处理证书文件导致证书损坏

**解决方案**: 在 `pom.xml` 中配置Maven排除证书文件
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <configuration>
        <encoding>UTF-8</encoding>
        <nonFilteredFileExtensions>
            <nonFilteredFileExtension>p12</nonFilteredFileExtension>
            <nonFilteredFileExtension>pem</nonFilteredFileExtension>
            <nonFilteredFileExtension>pfx</nonFilteredFileExtension>
        </nonFilteredFileExtensions>
    </configuration>
</plugin>
```

#### 错误2: 调用接口返回403

**错误信息**: HTTP 403 Forbidden

**原因**: KMS服务地址配置错误或端口号错误

**解决方案**:
- 测试环境端口号是 `18443`
- 生产环境不需要端口号
- 或者删除地址配置，使用SDK默认地址

#### 错误3: 通过Token获取密钥报错

**原因**: Token授权配置错误

**解决方案**: 检查授权时的参数配置
- `count`: 访问次数限制
- `expiry`: 失效时间（毫秒时间戳）
- `authedTo`: 授权应用名（确保与证书应用名一致）

### 8.2 降级策略

- 当KMS服务不可用时，应用应该有本地降级机制
- 建议在应用启动时预加载关键密钥到内存
- 定期健康检查KMS服务可用性

### 8.3 重试机制

- SDK内部不提供重试机制
- 建议应用层实现指数退避重试策略
- 推荐重试次数: 3次
- 推荐重试间隔: 1s, 2s, 4s

## 9. 配置说明层

### 9.1 Java SDK配置项清单

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| kms.key-store | String | 是 | - | 证书文件路径 |
| kms.key-store-password | String | 是 | - | 证书密码 |
| kms.strict | Boolean | 否 | false | 是否严格模式（薪酬类应用设为true） |
| kms.connects[n].cert-name | String | 否 | - | 多证书模式下的证书名称 |
| kms.connects[n].key-store | String | 否 | - | 多证书模式下的证书路径 |
| kms.connects[n].key-store-password | String | 否 | - | 多证书模式下的证书密码 |
| kms.connects[n].enable | Boolean | 否 | true | 多证书模式下是否启用该证书 |

### 9.2 各环境配置示例

**测试环境配置**:
```properties
spring.profiles.active=test
kms.key-store=certs/test_cert.p12
kms.key-store-password=test_password
kms.strict=false
```

**生产环境配置**:
```properties
spring.profiles.active=prod
kms.key-store=certs/prod_cert.p12
kms.key-store-password=prod_password
kms.strict=false
```

**薪酬严格模式配置**:
```properties
spring.profiles.active=prod
kms.key-store=certs/salary_cert.p12
kms.key-store-password=salary_password
kms.strict=true
```

### 9.3 Go SDK初始化参数

```go
kms, err := kmsgo.New(
    "https://kms-ntsgw.woa.com",      // KMS服务地址
    "/path/to/truststore.pem",         // CA证书路径
    "/path/to/client.p12",             // 客户端证书路径
    "证书密码")                          // 证书密码
```

## 10. 应用实践

### 10.1 数据同步加密

**场景**: Workday海外和国内双向数据同步，涉及大量保密数据（岗位、offer等）

**方案**:
- KMS提供高性能、高安全、高解耦的加密方案
- 海外数据加密后同步到国内，国内系统使用KMS解密
- 国内数据加密后同步到Workday，保障数据安全

### 10.2 薪酬加密

**场景**: 薪酬属于最高级保密数据，需要100%安全保障

**安全措施**:
- 密钥加密存储
- 雪花码技术
- 限制各类角色权限
- 启用严格模式 `kms.strict=true`

**示例 - 薪酬附件加密流程**:

**附件上传**:
1. 前端上传附件
2. 薪酬系统生成密钥保存到KMS
3. 薪酬系统授权给附件系统
4. 附件系统使用密钥加密后存储

**附件下载**:
1. 前端请求预览
2. 薪酬系统授权token给附件系统
3. 附件系统通过token获取密钥解密
4. 返回附件明文给薪酬前端用户

### 10.3 临时授权场景

**适用场景**:
- 密钥不希望被其他应用长时间使用
- 授权应用需做好安全管控，不会将授权密钥落盘

**实现步骤**:

```java
// 1. 授权方：授权密钥给第三方应用
AuthSecretRequest request = new AuthSecretRequest();
request.setSecretNames(Arrays.asList("file_encrypt_key"));
request.setAuthedTo("hrfileservices");
request.setCount(10);  // 允许使用10次
request.setExpiry(System.currentTimeMillis() + 3600000);  // 1小时后过期

String tokenKey = kmsSdkService.authSecret(request);

// 2. 将tokenKey传递给第三方应用

// 3. 第三方应用：通过token获取密钥
KmsSdkService thirdPartyService = kmsSdkServiceFactory.getSDKService("hrfileservices");
Map<String, String> secrets = thirdPartyService.getSecretInfosByToken(tokenKey);
String encryptKey = secrets.get("file_encrypt_key");

// 使用密钥进行加解密操作
// ...
```

## 11. 安全特性

### 11.1 新版安全强度

- ✅ 通过公司级安全团队评审
- ✅ 系统管理员无法查看明文的应用凭据
- ✅ KMS数据库被攻击也不会导致凭据泄露
- ✅ 运维人员无法接触密钥文件
- ✅ 密钥文件分段保管，降低泄露可能性
- ✅ 即使密钥分段全泄露，没有腾讯云KMS解密也无法获得密钥
- ✅ 应用证书丢失不会导致凭据泄露
- ✅ 支持IP段校验
- ✅ 支持MOA确认
- ✅ 支持 Java、.Net Core、Go、Python、HTTP接口

### 11.2 架构设计

KMS采用内外网分离部署架构，确保不同网络环境的安全隔离：

- **内网部署**: OA办公网环境，适用于内部系统
- **外网部署**: 云环境，支持外部系统和云原生应用

### 11.3 测试环境MOA确认

由于测试环境KMS连接的是开发环境MOA，需要执行以下步骤开通功能：

1. 联系MOA开发组 **likowang(王立超)** 开通"切换到MOA开发环境的相关权限和入口"
2. 在手机MOA中搜索"切换"，找到"MOA环境切换"
3. 切换到开发环境，即可接收测试环境KMS的MOA推送
4. 测试完成后记得切回生产环境

## 12. 附录

### 12.1 CA根证书下载

**OA生产环境**:
- [ca_prod_truststore.pem](https://iwiki.woa.com/tencent/api/attachments/s3/url?attachmentid=37390166)

**OA测试/开发环境**:
- [dev_and_test_truststore.pem](https://iwiki.woa.com/tencent/api/attachments/s3/url?attachmentid=37390167)

### 12.2 相关文档链接

- **应用管理员操作手册**: https://iwiki.woa.com/pages/viewpage.action?pageId=1024619007
- **KMS管理端（测试）**: https://test-kms-ntsgw.woa.com/app/view
- **KMS管理端（生产）**: https://kms-ntsgw.woa.com/app/view
- **KMS管理端（生产严格）**: https://kms-strict-ntsgw.woa.com/app/view

### 12.3 联系方式

- **权限开通**: teemochen(陈繁)
- **技术支持**: haozonggui(桂豪纵)
- **MOA环境切换**: likowang(王立超)

### 12.4 下一步建设

- 对接公司证书系统，实现证书自动更新
- 容灾、多活架构
- 添加云主机监控，防止内存被盗取
- 强制密码定时轮换
- 等保认证
- 支持全球化部署

---

**文档版本**: v1.0  
**最后更新**: 2025-11-11  
**维护团队**: HR基础组件组
