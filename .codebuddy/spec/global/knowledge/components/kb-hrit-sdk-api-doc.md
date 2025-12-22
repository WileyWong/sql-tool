# hrit-sdk-core 项目知识索引

> **生成时间**: 2025-11-12  
> **项目版本**: 0.1.7  
> **SDK API手册**: https://hrsdk.pages.woa.com/

---

## 📋 目录

- [项目概览](#项目概览)
  - [基本信息](#基本信息)
  - [项目定位](#项目定位)
  - [核心功能模块](#核心功能模块)
  - [技术栈](#技术栈)
- [核心服务层](#核心服务层)
  - [1. KMS 密钥管理服务](#1-kms-密钥管理服务)
    - [IKmsService](#服务接口ikmsservice)
    - [DefaultKmsService](#服务实现defaultkmsservice)
    - [KmsServiceFactory](#工厂类kmsservicefactory)
  - [2. COS 对象存储服务](#2-cos-对象存储服务)
    - [CosFunction](#核心类cosfunction)
  - [3. 事件总线服务](#3-事件总线服务)
    - [EventBridgeService](#核心类eventbridgeservice)
  - [4. 短链服务](#4-短链服务)
    - [ShortUrlService](#核心类shorturlservice)
  - [5. 文件服务](#5-文件服务)
    - [FileServicesClient](#核心类fileservicesclient)
  - [6. 消息通道服务](#6-消息通道服务)
    - [MessageChannelService](#核心类messagechannelservice)
  - [7. DOS 数据查询服务](#7-dos-数据查询服务)
    - [DosClient](#核心类dosclient)
  - [8. 工作流服务](#8-工作流服务)
    - [SDCWorkflowClient](#核心类sdcworkflowclient)
  - [9. 本地缓存服务](#9-本地缓存服务)
    - [LocalCache](#核心类localcache)
- [工具类层](#工具类层)
  - [1. HttpUtils](#1-httputils)
  - [2. JsonUtil](#2-jsonutil)
  - [3. AssertUtil](#3-assertutil)
  - [4. 加密工具类](#4-加密工具类)
    - [AESUtil](#aesutil)
    - [RSAUtil](#rsautil)
    - [SHAUtil](#shautil)
  - [5. 文件工具类](#5-文件工具类)
    - [FileUtils](#fileutils)
    - [LocalFileUtil](#localfileutil)
  - [6. 其他工具类](#6-其他工具类)
    - [DateUtil](#dateutil)
    - [StringUtil](#stringutil)
    - [Base64Util](#base64util)
    - [SnowFlakeUtil](#snowflakeutil)
    - [CommandUtil](#commandutil)
- [数据传输对象(DTO)](#数据传输对象dto)
  - [基础DTO](#基础dto)
    - [ResponseInfo](#responseinfo)
    - [Paginator](#paginator)
  - [KMS相关DTO](#kms相关dto)
    - [SecretTmpTokenDTO](#secrettmptokendto)
  - [文件服务DTO](#文件服务dto)
    - [FileBaseRequest](#filebaserequest)
    - [FileDTO](#filedto)
    - [FileShareDTO](#filesharedto)
    - [FileAuthDTO](#fileauthdto)
    - [FileSignatureDTO](#filesignaturedto)
    - [BatchDownloadDTO](#batchdownloaddto)
  - [消息服务DTO](#消息服务dto)
    - [MessageSendResultDTO](#messagesendresultdto)
    - [MessageSendResultPerReceiverDTO](#messagesendresultperreceiverdto)
    - [MailWhiteDTO](#mailwhitedto)
    - [SdkTemplateResponse](#sdktemplateresponse)
  - [DOS数据查询服务DTO](#dos数据查询服务dto)
    - [QueryDataResp](#querydataresp)
- [枚举类](#枚举类)
  - [环境枚举](#环境枚举)
    - [Env](#env)
  - [文件相关枚举](#文件相关枚举)
    - [FileEncryptModeEnum](#fileencryptmodeenum)
    - [UploadModeEnum](#uploadmodeenum)
  - [加密相关枚举](#加密相关枚举)
    - [AESModel](#aesmodel)
    - [AESPadding](#aespadding)
    - [RSAKeyLength](#rsakeylength)
- [异常体系](#异常体系)
  - [基础异常](#基础异常)
    - [AssertException](#assertexception)
  - [KMS异常](#kms异常)
    - [KmsException](#kmsexception)
    - [KmsUnAuthorizedException](#kmsunauthorizedexception)
  - [文件服务异常](#文件服务异常)
    - [FileServicesException](#fileservicesexception)
    - [FileServicesClientException](#fileservicesclientexception)
    - [FileServiceServerException](#fileserviceserverexception)
  - [其他异常](#其他异常)
    - [DosBizException](#dosbizexception)
    - [EventBridgeException](#eventbridgeexception)
    - [ShortUrlException](#shorturlexception)
- [依赖管理](#依赖管理)
  - [核心依赖](#核心依赖)
  - [编译配置](#编译配置)
- [开发指南](#开发指南)
- [相关文档](#相关文档)
- [附录](#附录)

---

## 项目概览

### 基本信息

| 项目信息 | 详情 |
|---------|------|
| 项目名称 | hrit-sdk-core |
| 组织 | com.tencent.hr.sdk |
| 版本 | 0.1.7 |
| 打包方式 | jar |
| Java版本 | 17 |

### 项目定位

hrit-sdk-core 是人平 Java SDK 的核心模块，提供了与腾讯内部各类服务集成的统一接口。该模块设计为最小依赖原则，不依赖 Spring 框架，可以在非 Spring 项目中直接使用。

### 核心功能模块

```
hrit-sdk-core/
├── kms/              # 密钥管理服务
├── cos/              # 对象存储服务
├── message/          # 消息通道服务
├── event/            # 事件总线服务
├── file/             # 文件服务
├── dos/              # 数据查询服务
├── workflow/         # 工作流服务
├── shortUrl/         # 短链服务
├── localCache/       # 本地缓存
├── crypto/           # 加密工具
├── tof/              # TOF认证
└── util/             # 通用工具类
```

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| OkHttp3 | - | HTTP客户端 |
| Jackson | - | JSON序列化/反序列化 |
| Lombok | - | 代码生成 |
| Logback | - | 日志框架 |
| Apache Commons | - | 通用工具 |
| Google Guava | - | 集合和并发工具 |
| Nimbus JOSE+JWT | - | JWT处理 |
| MapStruct | - | 对象映射 |
| Tencent COS SDK | - | 腾讯云对象存储 |
| Workflow Client | - | 工作流客户端 |

---

## 核心服务层

### 1. KMS 密钥管理服务

#### 服务接口：IKmsService

**类路径**: `com.tencent.hr.sdk.kms.IKmsService`

**功能说明**: 定义密钥管理服务的标准接口，提供密钥的创建、获取、授权、签名等核心功能。

**依赖注入**: 无（接口）

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `createOrUpdateSecret(String secretName, String value)` | secretName: 密钥名称<br>value: 密钥内容 | void | 创建或更新密钥 |
| `createOrUpdateSecretWithoutValue(String secretName)` | secretName: 密钥名称 | String | 创建密钥（服务器生成内容） |
| `getSecretContent(String secretName)` | secretName: 密钥名称 | String | 获取密钥内容 |
| `getSecretContents(String... secretNames)` | secretNames: 密钥名称数组 | GetSecretRet | 批量获取密钥内容 |
| `getSecretContentHistory(String secretName)` | secretName: 密钥名称 | GetSecretHistoryRet | 获取密钥历史记录 |
| `authSecrets(String authedApp, int count, Long expiry, String... secretNames)` | authedApp: 授权目标应用<br>count: 访问次数<br>expiry: 过期时间戳<br>secretNames: 密钥名称 | String | 授权密钥给指定应用 |
| `tokenAppendSecret(String tokenKey, String... secretName)` | tokenKey: Token<br>secretName: 密钥名称 | void | 向Token添加密钥 |
| `getSecretKeysByToken(String tokenKey)` | tokenKey: Token | List\<String\> | 通过Token获取密钥名称列表 |
| `getSecretContentByTokenAndKey(String tokenKey, String secretName)` | tokenKey: Token<br>secretName: 密钥名称 | String | 通过Token和密钥名获取内容 |
| `getAuthedSecretMapByTokenKey(String tokenKey)` | tokenKey: Token | Map\<String, String\> | 获取Token对应的所有密钥 |
| `signSecretNames(String authApp, int count, long expiry, String... secretNames)` | authApp: 授权应用<br>count: 访问次数<br>expiry: 过期时间<br>secretNames: 密钥名称 | String | 签名授权密钥集合 |
| `getAuthedSecretMapBySignature(String signature)` | signature: 签名 | Map\<String, String\> | 通过签名获取密钥 |
| `checkUntilLoginSuccess()` | 无 | void | 校验KMS登录状态 |

#### 服务实现：DefaultKmsService

**类路径**: `com.tencent.hr.sdk.kms.DefaultKmsService`

**功能说明**: KMS服务的默认实现，提供完整的密钥管理功能，包括密钥生命周期管理、访问控制、MOA认证等。通过双向SSL认证与KMS服务器进行安全通信。

**安全特性**:
- 双向SSL认证：客户端和服务器相互验证身份
- 数字签名：使用RSA私钥对授权信息进行签名
- 访问控制：基于应用名称和证书的访问权限控制
- 会话管理：通过随机密钥和登录状态管理会话

**依赖注入**:
- `OkHttpClient mutualSslClient`: 双向SSL HTTP客户端
- `PatchConfig config`: KMS服务配置信息
- `PrivateKey privateKey`: 客户端私钥
- `X509Certificate cert`: 客户端X.509证书

**核心方法**: 实现 IKmsService 接口的所有方法（详见服务接口部分）

#### 工厂类：KmsServiceFactory

**类路径**: `com.tencent.hr.sdk.kms.KmsServiceFactory`

**功能说明**: 负责创建和配置KMS服务实例，封装SSL证书配置、HTTP客户端构建、认证流程等复杂细节。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `getKmsService(PatchConfig config)` | config: KMS服务配置对象 | IKmsService | 创建KMS服务实例 |

**支持的证书类型**:
- PKCS12格式证书(.p12文件)
- 资源文件中的证书
- 磁盘文件中的证书
- 带MOA认证信息的证书

**调用示例**:

```java
// 1. 创建KMS服务配置
PatchConfig config = new PatchConfig();
config.setAppName("your-app-name");
config.setCertPath("classpath:certs/your-cert.p12");
config.setCertPassword("your-cert-password");
config.setKmsUrl("https://kms.woa.com");

// 2. 获取KMS服务实例
IKmsService kmsService = KmsServiceFactory.getKmsService(config);

// 3. 创建或更新密钥
kmsService.createOrUpdateSecret("db-password", "mySecretPassword123");

// 4. 获取密钥内容
String secretValue = kmsService.getSecretContent("db-password");
System.out.println("密钥内容: " + secretValue);

// 5. 授权密钥给其他应用（7天有效，可访问10次）
long expiry = System.currentTimeMillis() + 7 * 24 * 3600 * 1000L;
String token = kmsService.authSecrets("target-app", 10, expiry, "db-password");

// 6. 使用签名方式授权（推荐）
String signature = kmsService.signSecretNames("target-app", 10, expiry, 
    "db-password", "api-key");

// 7. 批量获取密钥
GetSecretRet secrets = kmsService.getSecretContents("db-password", "api-key", "secret-token");
Map<String, String> secretMap = secrets.getSecretMap();
```

---

### 2. COS 对象存储服务

#### 核心类：CosFunction

**类路径**: `com.tencent.hr.sdk.cos.CosFunction`

**功能说明**: 腾讯云对象存储（COS）服务功能类，封装文件上传、下载、临时密钥管理等操作。支持多种上传方式、预签名URL生成、临时密钥获取等功能。

**主要功能模块**:
1. 临时密钥管理：支持获取不同权限的临时密钥
2. 文件上传：支持本地文件上传和字节数组上传
3. 预签名URL：生成带有时效性的访问URL
4. 权限控制：精细化的权限管理

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `getUploadTmpCredential(String region, String bucket, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>durationSeconds: 有效时长（秒） | TmpCredential | 获取上传临时密钥 |
| `getUploadTmpCredential(String region, String bucket, String key, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>durationSeconds: 有效时长 | TmpCredential | 获取指定对象的上传临时密钥 |
| `getDownloadTmpCredential(String region, String bucket, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>durationSeconds: 有效时长 | TmpCredential | 获取下载临时密钥 |
| `getDownloadTmpCredential(String region, String bucket, String key, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>durationSeconds: 有效时长 | TmpCredential | 获取指定对象的下载临时密钥 |
| `getTmpCredential(String region, String bucket, String key, String[] actions, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>actions: 权限数组<br>durationSeconds: 有效时长 | TmpCredential | 获取自定义权限的临时密钥 |
| `UploadFile(String region, String bucket, String key, String localPath)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>localPath: 本地路径 | UploadFileResult | 上传本地文件 |
| `UploadFile(String region, String bucket, String key, byte[] bytes)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>bytes: 文件字节数组 | UploadFileResult | 上传字节数组 |
| `getPresignedUrl(String region, String bucket, String key, int durationSeconds)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>durationSeconds: 有效时长 | String | 生成预签名下载URL |
| `getPresignedUrl(String region, String bucket, String key, int durationSeconds, Map params, Map headers)` | region: 地域<br>bucket: 存储桶<br>key: 对象键<br>durationSeconds: 有效时长<br>params: 请求参数<br>headers: 请求头 | String | 生成带自定义参数的预签名URL |

**权限定义**:

| 权限常量 | 权限列表 | 用途 |
|---------|---------|------|
| ACTION_UPLOAD | PutObject, PostObject, InitiateMultipartUpload, ListMultipartUploads, ListParts, UploadPart, CompleteMultipartUpload, AbortMultipartUpload | 文件上传相关权限 |
| ACTION_DOWNLOAD | HeadObject, GetObject | 文件下载相关权限 |

**调用示例**:

```java
// 1. 创建COS服务实例
CosFunction cosFunction = new CosFunction("your-secret-id", "your-secret-key");

// 2. 获取上传临时密钥（有效期1小时）
TmpCredential uploadCredential = cosFunction.getUploadTmpCredential(
    "ap-guangzhou",     // 地域
    "my-bucket-1234",   // 存储桶
    3600                // 有效时长（秒）
);

// 3. 上传本地文件
UploadFileResult uploadResult = cosFunction.UploadFile(
    "ap-guangzhou",
    "my-bucket-1234",
    "files/document.pdf",    // 对象键
    "/local/path/document.pdf"  // 本地文件路径
);
System.out.println("文件上传成功: " + uploadResult.getRequestId());

// 4. 上传字节数组
byte[] fileBytes = "Hello COS!".getBytes();
UploadFileResult bytesResult = cosFunction.UploadFile(
    "ap-guangzhou",
    "my-bucket-1234",
    "files/hello.txt",
    fileBytes
);

// 5. 生成预签名下载URL（有效期30分钟）
String presignedUrl = cosFunction.getPresignedUrl(
    "ap-guangzhou",
    "my-bucket-1234",
    "files/document.pdf",
    1800  // 有效时长（秒）
);
System.out.println("下载链接: " + presignedUrl);

// 6. 获取下载临时密钥
TmpCredential downloadCredential = cosFunction.getDownloadTmpCredential(
    "ap-guangzhou",
    "my-bucket-1234",
    "files/document.pdf",
    3600
);
```

---

### 3. 事件总线服务

#### 核心类：EventBridgeService

**类路径**: `com.tencent.hr.sdk.event.service.EventBridgeService`

**功能说明**: 事件发布服务，负责将应用程序产生的业务事件发布到事件总线。采用标准的事件驱动架构模式，支持异步事件处理和系统解耦。

**核心功能**:
- 事件发布：将业务事件发布到事件总线
- 多环境支持：自动适配开发、测试、UAT和生产环境
- 身份认证：基于应用名称和Token的ESB认证
- 异常处理：完善的错误处理和异常传播机制

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `publishEvent(EventPublishParam eventPublishParam)` | eventPublishParam: 事件发布参数 | String | 发布标准化事件到事件总线 |

**环境映射**:

| 环境 | URL常量 | 说明 |
|------|---------|------|
| DEV/TEST | EventBridgeConstant.TEST_URL | 开发和测试环境 |
| UAT | EventBridgeConstant.UAT_URL | UAT环境 |
| PROD | EventBridgeConstant.PROD_URL | 生产环境 |

**调用示例**:

```java
// 1. 创建事件总线服务实例
EventBridgeService eventBridgeService = new EventBridgeService(
    "your-app-name",
    "your-app-token",
    Env.PROD  // 环境
);

// 2. 构建事件发布参数
EventPublishParam eventParam = new EventPublishParam();
eventParam.setEventType("user.registered");  // 事件类型
eventParam.setEventSource("user-service");   // 事件源
eventParam.setEventSubject("user-12345");    // 事件主题

// 3. 设置事件数据
Map<String, Object> eventData = new HashMap<>();
eventData.put("userId", "12345");
eventData.put("username", "zhangsan");
eventData.put("email", "zhangsan@tencent.com");
eventData.put("registerTime", System.currentTimeMillis());
eventParam.setEventData(eventData);

// 4. 发布事件
String eventId = eventBridgeService.publishEvent(eventParam);
System.out.println("事件发布成功，事件ID: " + eventId);

// 5. 发布业务事件示例
EventPublishParam orderEvent = EventPublishParam.builder()
    .eventType("order.created")
    .eventSource("order-service")
    .eventSubject("order-" + orderId)
    .eventData(Map.of(
        "orderId", orderId,
        "amount", 999.99,
        "status", "PENDING"
    ))
    .build();
    
eventBridgeService.publishEvent(orderEvent);
```

---

### 4. 短链服务

#### 核心类：ShortUrlService

**类路径**: `com.tencent.hr.sdk.shortUrl.service.ShortUrlService`

**功能说明**: 提供完整的短链管理功能，包括短链的生成、更新和删除操作。将长URL转换为短URL，便于分享和管理。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `getShortUrl(GetShortUrlParam param)` | param: 短链生成参数<br>包含：longUrl(长链接)、expireTime(过期时间)、type(类型) | String | 生成短链，返回短链ID |
| `updateShortUrl(UpdateShortUrlParam param)` | param: 短链更新参数<br>包含：urlId(短链ID)、longUrl(新的长链接)、expireTime(过期时间) | String | 更新已存在的短链配置 |
| `deleteShortUrl(String urlId)` | urlId: 短链ID | String | 删除短链（使短链失效），返回操作结果 |

**参数对象说明**:
- **GetShortUrlParam**: longUrl(必填), expireTime(可选), type(可选)
- **UpdateShortUrlParam**: urlId(必填), longUrl(必填), expireTime(可选)

**安全机制**:
- 使用appId和appSecret进行身份认证
- 基于时间戳和SHA256签名防止重放攻击
- 支持多环境配置

**调用示例**:

```java
// 1. 创建短链服务实例
ShortUrlService shortUrlService = new ShortUrlService(
    "your-app-id",
    "your-app-secret",
    Env.PROD
);

// 2. 生成短链
GetShortUrlParam getParam = new GetShortUrlParam();
getParam.setLongUrl("https://example.com/very/long/url/with/many/parameters?id=123");
getParam.setExpireTime(System.currentTimeMillis() + 30 * 24 * 3600 * 1000L); // 30天后过期
getParam.setType("custom");

String urlId = shortUrlService.getShortUrl(getParam);
System.out.println("短链ID: " + urlId);
System.out.println("短链地址: https://shorturl.woa.com/" + urlId);

// 3. 更新短链
UpdateShortUrlParam updateParam = new UpdateShortUrlParam();
updateParam.setUrlId(urlId);
updateParam.setLongUrl("https://example.com/updated/url");
updateParam.setExpireTime(System.currentTimeMillis() + 60 * 24 * 3600 * 1000L); // 延长到60天

String result = shortUrlService.updateShortUrl(updateParam);
System.out.println("更新结果: " + result);

// 4. 删除短链（使其失效）
String deleteResult = shortUrlService.deleteShortUrl(urlId);
System.out.println("删除结果: " + deleteResult);

// 5. 批量生成短链
List<String> longUrls = Arrays.asList(
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
);

for (String longUrl : longUrls) {
    GetShortUrlParam param = new GetShortUrlParam();
    param.setLongUrl(longUrl);
    String shortId = shortUrlService.getShortUrl(param);
    System.out.println(longUrl + " -> " + shortId);
}
```

---

### 5. 文件服务

#### 核心类：FileServicesClient

**类路径**: `com.tencent.hr.sdk.file.hrfile.service.FileServicesClient`

**功能说明**: 提供文件上传、下载、删除、授权等核心功能。支持大文件分片上传、文件加密、文件转换、批量操作等高级特性。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `upload(File file)` | file: 要上传的文件 | String | 上传文件（基础版本） |
| `uploadShared(File file)` | file: 要上传的文件 | String | 上传共享文件 |
| `uploadEncrypt(File file)` | file: 要上传的文件 | String | 上传加密文件 |
| `uploadAndConvert(File file)` | file: 要上传的文件 | String | 上传文件并生成预览文件 |
| `upload(FileDTO fileDTO)` | fileDTO: 文件上传参数对象 | String | 上传文件（核心方法） |
| `download(String filePath, String fileUuid)` | filePath: 保存路径<br>fileUuid: 文件UUID | File | 下载文件 |
| `batchDownloadFiles(String filePath, String compressName, Set<String> fileUuids)` | filePath: 保存路径<br>compressName: 压缩包名称<br>fileUuids: 文件UUID集合 | File | 批量下载文件 |
| `getSignature(FileSignatureDTO signatureDto)` | signatureDto: 签名生成参数 | String | 获取文件访问签名 |
| `getFileDetail(String fileUuid)` | fileUuid: 文件UUID | FileDetail | 查看文件信息 |
| `authFile(String fileUuid, String authAppName)` | fileUuid: 文件UUID<br>authAppName: 授权应用 | boolean | 文件授权给指定应用 |
| `getShareViewUrls(List<FileShareDTO> visitDtos)` | visitDtos: 文件共享参数列表 | List\<FileShareDTO\> | 获取文件共享访问链接 |
| `delete(FileBaseRequest fileBaseRequest)` | fileBaseRequest: 文件删除请求 | boolean | 删除文件 |
| `isFileConverted(String fileUuid)` | fileUuid: 文件UUID | boolean | 检查文件是否转换成功 |

**功能特性**:
- 自动分片上传：超过10MB自动使用分片上传
- 文件加密：支持AES256加密存储
- 文件转换：支持Office文档转换为预览格式
- 共享访问：生成CDN访问链接

**支持转换的文件格式**:
- Excel: xls, xlsx, xlsb, xltx, xltm, xlsm, xml, csv, tsv
- PowerPoint: ppt, pptx, pps, pos, ppsx, pptm, ppsm, potx, potm
- Word: doc, docx, rtf, dot, dotx, dotm, odt, txt, ott

**调用示例**:

```java
// 1. 创建文件服务客户端
FileServicesClient fileClient = new FileServicesClient(
    "your-app-name",
    "your-app-token",
    Env.PROD
);

// 2. 简单上传文件
File file = new File("/local/path/document.pdf");
String fileUuid = fileClient.upload(file);
System.out.println("文件上传成功，UUID: " + fileUuid);

// 3. 上传加密文件
String encryptedFileUuid = fileClient.uploadEncrypt(file);

// 4. 上传并生成预览文件
String convertFileUuid = fileClient.uploadAndConvert(new File("/local/report.docx"));

// 5. 高级上传（完整参数）
FileDTO fileDTO = new FileDTO();
fileDTO.setFile(file);
fileDTO.setFileName("重要文档.pdf");
fileDTO.setEncrypt(true);  // 加密存储
fileDTO.setConvert(true);  // 生成预览
fileDTO.setShared(true);   // 共享文件
fileDTO.setEncryptMode(FileEncryptModeEnum.AES256);

String advancedUuid = fileClient.upload(fileDTO);

// 6. 下载文件
File downloadedFile = fileClient.download("/download/path", fileUuid);
System.out.println("文件下载到: " + downloadedFile.getAbsolutePath());

// 7. 批量下载文件（自动打包为ZIP）
Set<String> fileUuids = new HashSet<>(Arrays.asList(
    "uuid-001", "uuid-002", "uuid-003"
));
File zipFile = fileClient.batchDownloadFiles(
    "/download/path",
    "批量文件.zip",
    fileUuids
);

// 8. 授权文件给其他应用
boolean authSuccess = fileClient.authFile(fileUuid, "target-app-name");

// 9. 获取文件共享访问链接
List<FileShareDTO> shareDtos = new ArrayList<>();
FileShareDTO shareDto = new FileShareDTO();
shareDto.setFileUuid(fileUuid);
shareDto.setPicParam("?imageView2/2/w/800");  // 图片处理参数

shareDtos.add(shareDto);
List<FileShareDTO> shareUrls = fileClient.getShareViewUrls(shareDtos);
System.out.println("共享链接: " + shareUrls.get(0).getShareViewUrl());

// 10. 获取文件签名（用于前端直传）
FileSignatureDTO signatureDto = new FileSignatureDTO();
signatureDto.setFileUuids(Arrays.asList(fileUuid));
signatureDto.setOperate(FileOperateAuthEnum.DOWNLOAD);
signatureDto.setStaffId("user-123");

String signature = fileClient.getSignature(signatureDto);

// 11. 查看文件详情
FileDetail fileDetail = fileClient.getFileDetail(fileUuid);
System.out.println("文件名: " + fileDetail.getFileName());
System.out.println("文件大小: " + fileDetail.getFileSize());

// 12. 删除文件
FileBaseRequest deleteRequest = new FileBaseRequest();
deleteRequest.setFileUuid(fileUuid);
boolean deleted = fileClient.delete(deleteRequest);
```

---

### 6. 消息通道服务

#### 核心类：MessageChannelService

**类路径**: `com.tencent.hr.sdk.message.v2.service.MessageChannelService`

**功能说明**: 提供统一的消息发送服务，支持多种消息类型的发送，包括短信、邮件、企业微信、MyOA、语音轮询、微信模板消息、日程消息、腾讯云邮件服务等。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `sendSmsMessage(SmsMessageParam smsMessageParam)` | smsMessageParam: 短信消息参数<br>包含：receivers(接收者列表)、content(消息内容)、priority(优先级) | MessageSendResultDTO | 发送短信消息（仅内网环境） |
| `sendSmsTemplateMessage(SmsTemplateMessageParam smsTemplateMessageParam)` | smsTemplateMessageParam: 模板短信参数<br>包含：receivers(接收者)、templateId(模板ID)、templateParams(模板参数) | MessageSendResultDTO | 发送模板短信消息（仅外网环境） |
| `sendTextMailMessage(MailMessageParam mailMessageParam)` | mailMessageParam: 邮件消息参数<br>包含：receivers(接收者)、subject(主题)、content(内容)、cc(抄送)、bcc(密送) | MessageSendResultDTO | 发送纯文本邮件消息 |
| `sendMailTemplateMessage(MailTemplateMessageParam mailTemplateMessageParam)` | mailTemplateMessageParam: 邮件模板参数<br>包含：receivers(接收者)、templateName(模板名)、templateParams(模板参数) | MessageSendResultDTO | 发送邮件模板消息 |
| `sendWorkChatMessage(WorkChatMessageParam workChatMessageParam)` | workChatMessageParam: 企业微信消息参数 | MessageSendResultDTO | 发送企业微信消息 |
| `sendMyOAMessage(MyOAMessageParam myOAMessageParam)` | myOAMessageParam: MyOA消息参数 | MessageSendResultDTO | 发送MyOA消息 |
| `sendCtiMessage(CtiMessageParam ctiMessageParam)` | ctiMessageParam: 语音轮询消息参数 | MessageSendResultDTO | 发送语音轮询消息 |
| `sendWeixinTemplateMessage(WeixinTemplateMessageParam weixinTemplateMessageParam)` | weixinTemplateMessageParam: 微信模板消息参数 | MessageSendResultDTO | 发送微信模板消息 |
| `sendCalendarMessage(CalendarMessageParam calendarMessageParam)` | calendarMessageParam: 日程消息参数 | MessageSendResultDTO | 发送日程消息 |
| `sendSesMessage(SesMessageParam sesMessageParam)` | sesMessageParam: 腾讯云邮件服务参数 | MessageSendResultDTO | 发送腾讯云邮件服务消息 |
| `getMailWhiteList(Integer sysId, Integer currentPage, Integer currentPageSize)` | sysId: 系统ID<br>currentPage: 当前页<br>currentPageSize: 页大小 | MailWhiteDTO | 获取邮件白名单列表 |
| `addMailWhiteList(Integer sysId, List<String> whiteList)` | sysId: 系统ID<br>whiteList: 白名单列表 | boolean | 添加邮件白名单 |
| `deleteMailWhiteList(Integer sysId, List<String> whiteList)` | sysId: 系统ID<br>whiteList: 白名单列表 | boolean | 删除邮件白名单 |
| `getTemplateByName(String templateName)` | templateName: 模板名称 | SdkTemplateResponse | 根据模板名称获取模板内容 |

**支持的消息类型**:
- 短信消息（SMS）
- 邮件消息（Email）
- 企业微信消息（WorkChat）
- MyOA消息
- 语音轮询消息（CTI）
- 微信模板消息
- 日程消息（Calendar）
- 腾讯云邮件服务（SES）

**环境配置**:

| 环境 | URL常量 | 说明 |
|------|---------|------|
| DEV/TEST/UAT | MessageConstant.TEST_URL | 内网测试环境 |
| PROD | MessageConstant.PROD_URL | 内网生产环境 |
| E_TEST | MessageConstant.E_TEST_URL | 外网测试环境 |
| E_PROD | MessageConstant.E_PROD_URL | 外网生产环境 |

**调用示例**:

```java
// 1. 创建消息通道服务实例
MessageChannelService messageService = new MessageChannelService(
    "your-app-name",
    "your-app-token",
    Env.PROD
);

// 2. 发送短信消息（内网环境）
SmsMessageParam smsParam = new SmsMessageParam();
smsParam.setReceivers(Arrays.asList("zhangsan", "lisi"));
smsParam.setContent("您的验证码是：123456，5分钟内有效。");
smsParam.setPriority(1);  // 高优先级

MessageSendResultDTO smsResult = messageService.sendSmsMessage(smsParam);
System.out.println("短信发送成功，消息ID: " + smsResult.getMsgId());

// 3. 发送模板短信（外网环境）
SmsTemplateMessageParam templateSmsParam = new SmsTemplateMessageParam();
templateSmsParam.setReceivers(Arrays.asList("13800138000"));
templateSmsParam.setTemplateId("SMS_123456");
templateSmsParam.setTemplateParams(Map.of("code", "123456", "time", "5"));

messageService.sendSmsTemplateMessage(templateSmsParam);

// 4. 发送纯文本邮件
MailMessageParam mailParam = new MailMessageParam();
mailParam.setReceivers(Arrays.asList("zhangsan@tencent.com"));
mailParam.setSubject("系统通知");
mailParam.setContent("您好，这是一封测试邮件。");
mailParam.setCc(Arrays.asList("lisi@tencent.com"));  // 抄送

MessageSendResultDTO mailResult = messageService.sendTextMailMessage(mailParam);

// 5. 发送邮件模板消息
MailTemplateMessageParam templateMailParam = new MailTemplateMessageParam();
templateMailParam.setReceivers(Arrays.asList("zhangsan@tencent.com"));
templateMailParam.setTemplateName("password_reset");
templateMailParam.setTemplateParams(Map.of(
    "username", "张三",
    "resetLink", "https://example.com/reset?token=xxx"
));

messageService.sendMailTemplateMessage(templateMailParam);

// 6. 发送企业微信消息
WorkChatMessageParam workChatParam = new WorkChatMessageParam();
workChatParam.setReceivers(Arrays.asList("zhangsan"));
workChatParam.setContent("【重要通知】请及时处理待办事项");
workChatParam.setMsgType("text");

messageService.sendWorkChatMessage(workChatParam);

// 7. 发送MyOA消息
MyOAMessageParam myoaParam = new MyOAMessageParam();
myoaParam.setReceivers(Arrays.asList("zhangsan"));
myoaParam.setTitle("审批通知");
myoaParam.setContent("您有一条待审批的申请");

messageService.sendMyOAMessage(myoaParam);

// 8. 管理邮件白名单
// 8.1 获取白名单列表
MailWhiteDTO whiteList = messageService.getMailWhiteList(1001, 1, 50);
System.out.println("白名单总数: " + whiteList.getTotal());

// 8.2 添加白名单
messageService.addMailWhiteList(1001, Arrays.asList(
    "test@example.com",
    "demo@example.com"
));

// 8.3 删除白名单
messageService.deleteMailWhiteList(1001, Arrays.asList("test@example.com"));

// 9. 获取邮件模板
SdkTemplateResponse template = messageService.getTemplateByName("welcome_email");
System.out.println("模板内容: " + template.getContent());

// 10. 批量发送不同类型消息
List<String> receivers = Arrays.asList("zhangsan", "lisi", "wangwu");
String content = "系统将于今晚22:00进行维护，请提前保存数据。";

// 同时发送短信和邮件
SmsMessageParam sms = new SmsMessageParam();
sms.setReceivers(receivers);
sms.setContent(content);
messageService.sendSmsMessage(sms);

MailMessageParam mail = new MailMessageParam();
mail.setReceivers(receivers.stream()
    .map(r -> r + "@tencent.com")
    .collect(Collectors.toList()));
mail.setSubject("系统维护通知");
mail.setContent(content);
messageService.sendTextMailMessage(mail);
```

---

### 7. DOS 数据查询服务

#### 核心类：DosClient

**类路径**: `com.tencent.hr.sdk.dos.DosClient`

**功能说明**: DOS（Data Object Service）数据查询服务客户端，提供分页查询和文件查询功能。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `queryData(String suffixUrl, QueryBody queryBody)` | suffixUrl: 接口后缀URL<br>queryBody: 查询参数 | QueryDataResp | 分页查询（首次查询） |
| `queryDataNextByPage(String suffixUrl, QueryBody queryBody, int pageIndex, int limit)` | suffixUrl: 接口后缀URL<br>queryBody: 查询参数<br>pageIndex: 页码<br>limit: 页数 | QueryDataResp | 普通分页查询 |
| `queryDataNextByCursor(String suffixUrl, QueryBody queryBody, String prevCursorIdx)` | suffixUrl: 接口后缀URL<br>queryBody: 查询参数<br>prevCursorIdx: 上次查询返回的游标 | QueryDataResp | 游标分页查询 |
| `queryFile(String suffixUrl, QueryBody queryBody)` | suffixUrl: 接口后缀URL<br>queryBody: 查询参数 | Optional\<InputStream\> | 查询全量数据（文件形式） |

**查询模式**:
- 首次查询：默认页码为1
- 普通分页：基于页码和页数
- 游标分页：基于游标ID连续查询
- 文件查询：返回InputStream流

**调用示例**:

```java
// 1. 创建DOS客户端
DosClient dosClient = new DosClient(
    "your-app-name",
    "your-app-token",
    Env.PROD
);

// 2. 构建查询条件
QueryBody queryBody = new QueryBody();
queryBody.setConditions(Map.of(
    "status", "active",
    "createTime", Map.of("$gte", "2024-01-01")
));
queryBody.setFields(Arrays.asList("id", "name", "status", "createTime"));
queryBody.setSort(Map.of("createTime", -1));  // 按创建时间倒序

// 3. 首次分页查询
QueryDataResp firstPage = dosClient.queryData("/api/v1/users", queryBody);
System.out.println("总记录数: " + firstPage.getTotal());
System.out.println("当前页数据: " + firstPage.getContent().size());

// 4. 普通分页查询（获取第2页，每页50条）
QueryDataResp secondPage = dosClient.queryDataNextByPage(
    "/api/v1/users",
    queryBody,
    2,    // 页码
    50    // 每页条数
);

// 5. 游标分页查询（推荐大数据量场景）
QueryDataResp cursorPage1 = dosClient.queryData("/api/v1/orders", queryBody);
String cursor = cursorPage1.getPrevId();  // 获取游标

while (cursorPage1.getHasNext()) {
    QueryDataResp nextPage = dosClient.queryDataNextByCursor(
        "/api/v1/orders",
        queryBody,
        cursor
    );
    
    // 处理数据
    nextPage.getContent().forEach(record -> {
        System.out.println("订单ID: " + record.get("orderId"));
    });
    
    cursor = nextPage.getPrevId();  // 更新游标
    cursorPage1 = nextPage;
}

// 6. 查询全量数据（文件形式）
Optional<InputStream> fileStream = dosClient.queryFile("/api/v1/export", queryBody);
if (fileStream.isPresent()) {
    try (InputStream in = fileStream.get();
         FileOutputStream out = new FileOutputStream("data-export.csv")) {
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
        System.out.println("数据导出成功");
    } catch (IOException e) {
        e.printStackTrace();
    }
}

// 7. 复杂查询示例
QueryBody complexQuery = new QueryBody();
complexQuery.setConditions(Map.of(
    "department", "技术部",
    "salary", Map.of("$gte", 10000, "$lte", 50000),
    "skills", Map.of("$in", Arrays.asList("Java", "Python", "Go"))
));
complexQuery.setFields(Arrays.asList("name", "position", "salary"));
complexQuery.setSort(Map.of("salary", -1));

QueryDataResp complexResult = dosClient.queryData("/api/v1/employees", complexQuery);

// 8. 分页遍历所有数据
int pageIndex = 1;
int pageSize = 100;
QueryDataResp page;

do {
    page = dosClient.queryDataNextByPage("/api/v1/logs", queryBody, pageIndex, pageSize);
    
    // 处理当前页数据
    page.getContent().forEach(log -> {
        // 业务处理
        System.out.println(log);
    });
    
    pageIndex++;
} while (page.getHasNext());
```

---

### 8. 工作流服务

#### 核心类：SDCWorkflowClient

**类路径**: `com.tencent.hr.sdk.workflow.SDCWorkflowClient`

**功能说明**: 基于 OkHttp 与 Jackson 封装对工作流服务的 HTTP 调用，提供统一的工作流操作接口。

**职责**:
- 统一构建 HTTP 请求（方法、URL、Headers、Body）
- 统一 JSON 序列化/反序列化，并返回 ResponseInfo 包装
- 对非 2xx 响应与异常进行日志记录与业务错误转换

**特性**:
- 可注入外部 OkHttpClient
- ObjectMapper 采用统一配置
- 线程安全：OkHttpClient 与 ObjectMapper 在构造后不变

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `doGet(String url, Map<String, String> headers, TypeReference<T> typeRef)` | url: 请求URL<br>headers: 请求头<br>typeRef: 返回类型引用 | ResponseInfo\<T\> | 执行GET请求 |
| `doPost(String url, Object body, Map<String, String> headers, TypeReference<T> typeRef)` | url: 请求URL<br>body: 请求体<br>headers: 请求头<br>typeRef: 返回类型引用 | ResponseInfo\<T\> | 执行POST请求 |
| `doPut(String url, Object body, Map<String, String> headers, TypeReference<T> typeRef)` | url: 请求URL<br>body: 请求体<br>headers: 请求头<br>typeRef: 返回类型引用 | ResponseInfo\<T\> | 执行PUT请求 |
| `doDelete(String url, Map<String, String> headers, TypeReference<T> typeRef)` | url: 请求URL<br>headers: 请求头<br>typeRef: 返回类型引用 | ResponseInfo\<T\> | 执行DELETE请求 |

**调用示例**:

```java
// 1. 创建工作流客户端（使用默认OkHttpClient）
SDCWorkflowClient workflowClient = new SDCWorkflowClient();

// 2. 或使用自定义OkHttpClient
OkHttpClient customClient = new OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(60, TimeUnit.SECONDS)
    .build();
SDCWorkflowClient customWorkflowClient = new SDCWorkflowClient(customClient);

// 3. 执行GET请求
Map<String, String> headers = new HashMap<>();
headers.put("Authorization", "Bearer your-token");
headers.put("X-App-Name", "your-app");

ResponseInfo<WorkflowInstance> getInstance = workflowClient.doGet(
    "https://workflow.woa.com/api/v1/instances/12345",
    headers,
    new TypeReference<WorkflowInstance>() {}
);

if (getInstance.isSuccess()) {
    WorkflowInstance instance = getInstance.getData();
    System.out.println("工作流实例: " + instance.getId());
}

// 4. 执行POST请求 - 创建工作流
WorkflowCreateRequest createRequest = new WorkflowCreateRequest();
createRequest.setWorkflowName("approval-flow");
createRequest.setInitiator("zhangsan");
createRequest.setVariables(Map.of(
    "amount", 5000,
    "type", "expense"
));

ResponseInfo<WorkflowInstance> createResult = workflowClient.doPost(
    "https://workflow.woa.com/api/v1/instances",
    createRequest,
    headers,
    new TypeReference<WorkflowInstance>() {}
);

// 5. 执行PUT请求 - 更新工作流
WorkflowUpdateRequest updateRequest = new WorkflowUpdateRequest();
updateRequest.setStatus("approved");
updateRequest.setComment("已批准");

ResponseInfo<WorkflowInstance> updateResult = workflowClient.doPut(
    "https://workflow.woa.com/api/v1/instances/12345",
    updateRequest,
    headers,
    new TypeReference<WorkflowInstance>() {}
);

// 6. 执行DELETE请求 - 取消工作流
ResponseInfo<Void> deleteResult = workflowClient.doDelete(
    "https://workflow.woa.com/api/v1/instances/12345",
    headers,
    new TypeReference<Void>() {}
);

// 7. 批量查询工作流任务
ResponseInfo<List<WorkflowTask>> tasks = workflowClient.doGet(
    "https://workflow.woa.com/api/v1/tasks?assignee=zhangsan&status=pending",
    headers,
    new TypeReference<List<WorkflowTask>>() {}
);

if (tasks.isSuccess()) {
    tasks.getData().forEach(task -> {
        System.out.println("任务ID: " + task.getId() + ", 名称: " + task.getName());
    });
}

// 8. 完成工作流任务
TaskCompleteRequest completeRequest = new TaskCompleteRequest();
completeRequest.setTaskId("task-001");
completeRequest.setVariables(Map.of("approved", true));

ResponseInfo<Void> completeResult = workflowClient.doPost(
    "https://workflow.woa.com/api/v1/tasks/complete",
    completeRequest,
    headers,
    new TypeReference<Void>() {}
);
```

---

### 9. 本地缓存服务

#### 核心类：LocalCache

**类路径**: `com.tencent.hr.sdk.localCache.LocalCache`

**功能说明**: 线程安全的本地缓存实现类，基于ConcurrentHashMap，支持过期策略、容量控制和异步操作。

**特性**:
- 线程安全：基于ConcurrentHashMap实现
- 过期策略：支持基于写入时间和访问时间的过期
- 容量控制：支持基于LRU的自动驱逐策略
- 异步操作：支持异步更新和后台清理

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `get(K key)` | key: 缓存键 | V | 获取缓存值（更新访问时间） |
| `getIfPresent(K key)` | key: 缓存键 | V | 获取缓存值（不更新访问时间） |
| `put(K key, V value)` | key: 缓存键<br>value: 缓存值 | void | 存入缓存值 |
| `putIfAbsent(K key, V value)` | key: 缓存键<br>value: 缓存值 | V | 如果键不存在则存入 |
| `putAll(Map<K, V> map)` | map: 键值对集合 | void | 批量存入缓存 |
| `remove(K key)` | key: 缓存键 | V | 移除缓存项 |
| `containsKey(K key)` | key: 缓存键 | boolean | 检查键是否存在 |
| `clear()` | 无 | void | 清空所有缓存 |
| `size()` | 无 | int | 获取缓存大小 |
| `getAllPresent()` | 无 | Map\<K, V\> | 获取所有未过期项 |
| `asyncUpdate(K key, Callable<V> valueLoader)` | key: 缓存键<br>valueLoader: 值加载器 | CompletableFuture\<V\> | 异步更新缓存值 |
| `evictIfNeeded()` | 无 | void | 检查并执行缓存驱逐 |
| `invalidateAll(Iterable<K> keys)` | keys: 键集合 | void | 批量使缓存项失效 |
| `invalidateExpired()` | 无 | void | 清除所有过期项 |
| `refresh(K key)` | key: 缓存键 | boolean | 刷新访问时间 |
| `refreshAll(Iterable<K> keys)` | keys: 键集合 | int | 批量刷新访问时间 |
| `isExpired(CacheEntry<K, V> entry)` | entry: 缓存条目 | boolean | 检查是否过期 |
| `shutdown()` | 无 | void | 关闭缓存释放资源 |
| `getConfig()` | 无 | CacheConfig\<K, V\> | 获取缓存配置 |

**调用示例**:

```java
// 1. 创建缓存
LocalCache<String, User> cache = LocalCache.<String, User>builder()
    .maximumSize(10000)
    .expireAfterWrite(30, TimeUnit.MINUTES)
    .build();

// 2. 基本操作
cache.put("user:001", new User("张三"));
User user = cache.get("user:001");
cache.asyncUpdate("user:002", () -> loadFromDB("002"));

// 3. 缓存服务示例
public class UserCacheService {
    private final LocalCache<String, User> cache;
    
    public User getUser(String userId) {
        User user = cache.get(userId);
        if (user == null) {
            user = userRepository.findById(userId);
            cache.put(userId, user);
        }
        return user;
    }
}
```

---

## 工具类层

<a id="httputils"></a>
### 1. HttpUtils

**类路径**: `com.tencent.hr.sdk.util.HttpUtils`

**功能说明**: 基于 OkHttp 的 HTTP 请求工具类，提供统一的 HTTP 请求封装。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `get(String url, Map<String, String> headers, TypeReference<T> typeReference)` | url: 请求URL<br>headers: 请求头<br>typeReference: 返回类型 | T | GET 请求 |
| `postJson(String url, String body, Map<String, String> headers, Class<T> clazz)` | url: 请求URL<br>body: 请求体<br>headers: 请求头<br>clazz: 返回类型 | T | POST JSON 请求 |
| `getEsbAuth(String appName, String appToken)` | appName: 应用名称<br>appToken: 应用令牌 | Map\<String, String\> | 获取ESB认证头 |

**配置方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `initHttpClient(OkHttpClient okHttpClient)` | okHttpClient: OkHttp客户端 | void | 初始化HTTP客户端 |
| `initHttpClientConfig(long connectTimeout, long readTimeout)` | connectTimeout: 连接超时<br>readTimeout: 读取超时 | void | 初始化HTTP客户端配置 |
| `getHttpClient(long connectTimeout, long readTimeout)` | connectTimeout: 连接超时<br>readTimeout: 读取超时 | RequestClient | 获取HTTP客户端 |

---

<a id="jsonutil"></a>
### 2. JsonUtil

**类路径**: `com.tencent.hr.sdk.util.JsonUtil`

**功能说明**: JSON 序列化和反序列化工具类，基于 Jackson。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `toJson(Object obj)` | obj: 对象 | String | 对象转JSON字符串 |
| `toObj(String json, Class<T> clazz)` | json: JSON字符串<br>clazz: 目标类型 | T | JSON字符串转对象 |
| `toObj(String json, TypeReference<T> typeReference)` | json: JSON字符串<br>typeReference: 类型引用 | T | JSON字符串转对象（泛型） |

---

<a id="assertutil"></a>
### 3. AssertUtil

**类路径**: `com.tencent.hr.sdk.util.AssertUtil`

**功能说明**: 参数断言工具类，提供各种参数校验方法。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `isNotEmptyString(String str, String message)` | str: 字符串<br>message: 错误消息 | void | 断言字符串不为空 |
| `isNotNull(Object obj, String message)` | obj: 对象<br>message: 错误消息 | void | 断言对象不为null |
| `isTrue(boolean expression, String message)` | expression: 表达式<br>message: 错误消息 | void | 断言表达式为true |

---

### 4. 加密工具类

<a id="aesutil"></a>
#### AESUtil

**类路径**: `com.tencent.hr.sdk.crypto.AESUtil`

**功能说明**: AES 加密/解密工具类，支持多种加密模式和填充方式。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `encrypt(String content, String key)` | content: 明文内容<br>key: 密钥 | String | AES加密（默认CBC模式，PKCS5Padding） |
| `encrypt(String content, String key, AESModel model, AESPadding padding)` | content: 明文<br>key: 密钥<br>model: 加密模式<br>padding: 填充方式 | String | AES加密（指定模式和填充） |
| `decrypt(String encryptedContent, String key)` | encryptedContent: 密文<br>key: 密钥 | String | AES解密（默认CBC模式，PKCS5Padding） |
| `decrypt(String encryptedContent, String key, AESModel model, AESPadding padding)` | encryptedContent: 密文<br>key: 密钥<br>model: 加密模式<br>padding: 填充方式 | String | AES解密（指定模式和填充） |
| `generateKey()` | 无 | String | 生成AES密钥（128位） |
| `generateKey(int keySize)` | keySize: 密钥长度（128/192/256） | String | 生成指定长度的AES密钥 |

<a id="rsautil"></a>
#### RSAUtil

**类路径**: `com.tencent.hr.sdk.crypto.RSAUtil`

**功能说明**: RSA 加密/解密工具类，支持公钥加密、私钥解密、数字签名等功能。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `generateKeyPair()` | 无 | KeyPair | 生成RSA密钥对（默认2048位） |
| `generateKeyPair(RSAKeyLength keyLength)` | keyLength: 密钥长度枚举 | KeyPair | 生成指定长度的RSA密钥对 |
| `encryptByPublicKey(String content, String publicKey)` | content: 明文<br>publicKey: 公钥字符串 | String | 使用公钥加密 |
| `decryptByPrivateKey(String encryptedContent, String privateKey)` | encryptedContent: 密文<br>privateKey: 私钥字符串 | String | 使用私钥解密 |
| `sign(String content, String privateKey)` | content: 待签名内容<br>privateKey: 私钥 | String | 使用私钥生成数字签名 |
| `verify(String content, String signature, String publicKey)` | content: 原始内容<br>signature: 签名<br>publicKey: 公钥 | boolean | 使用公钥验证签名 |
| `getPublicKeyString(PublicKey publicKey)` | publicKey: 公钥对象 | String | 将PublicKey对象转为Base64字符串 |
| `getPrivateKeyString(PrivateKey privateKey)` | privateKey: 私钥对象 | String | 将PrivateKey对象转为Base64字符串 |

<a id="shautil"></a>
#### SHAUtil

**类路径**: `com.tencent.hr.sdk.crypto.SHAUtil`

**功能说明**: SHA 哈希工具类，提供SHA-1、SHA-256、SHA-512等哈希算法。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `toSHA1(String data)` | data: 原始数据 | String | 计算SHA-1哈希值 |
| `toSHA256(String data)` | data: 原始数据 | String | 计算SHA-256哈希值 |
| `toSHA512(String data)` | data: 原始数据 | String | 计算SHA-512哈希值 |
| `toSHAWithSalt(String data, String salt)` | data: 原始数据<br>salt: 盐值 | String | 计算带盐值的SHA-256哈希 |

---

### 5. 文件工具类

<a id="fileutils"></a>
#### FileUtils

**类路径**: `com.tencent.hr.sdk.file.util.FileUtils`

**功能说明**: 文件操作工具类，提供文件名处理、文件验证、文件格式转换等功能。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `getSuffix(String filename)` | filename: 文件名 | String | 获取文件扩展名（不含点） |
| `getFileNameFromDisposition(String disposition)` | disposition: Content-Disposition头 | String | 从HTTP响应头提取文件名 |
| `createOrRenameFile(String path, String fileName)` | path: 文件路径<br>fileName: 文件名 | File | 创建文件，如存在则重命名 |
| `isValidFileName(String fileName)` | fileName: 文件名 | boolean | 验证文件名是否合法 |
| `getMd5(File file)` | file: 文件对象 | String | 计算文件MD5摘要 |
| `getMd5(InputStream inputStream)` | inputStream: 输入流 | String | 计算输入流MD5摘要 |
| `isImageFile(String fileName)` | fileName: 文件名 | boolean | 判断是否为图片文件 |
| `isOfficeFile(String fileName)` | fileName: 文件名 | boolean | 判断是否为Office文档 |
| `canConvert(String fileName)` | fileName: 文件名 | boolean | 判断文件是否支持转换 |

<a id="localfileutil"></a>
#### LocalFileUtil

**类路径**: `com.tencent.hr.sdk.util.LocalFileUtil`

**功能说明**: 本地文件操作工具类，提供文件读写、目录操作等功能。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `readFileToString(String filePath)` | filePath: 文件路径 | String | 读取文件内容为字符串 |
| `writeStringToFile(String filePath, String content)` | filePath: 文件路径<br>content: 文件内容 | void | 将字符串写入文件 |
| `copyFile(String sourcePath, String targetPath)` | sourcePath: 源文件路径<br>targetPath: 目标文件路径 | void | 复制文件 |
| `deleteFile(String filePath)` | filePath: 文件路径 | boolean | 删除文件 |
| `createDirectory(String dirPath)` | dirPath: 目录路径 | boolean | 创建目录 |
| `listFiles(String dirPath)` | dirPath: 目录路径 | List\<File\> | 列出目录下所有文件 |

---

### 6. 其他工具类

<a id="dateutil"></a>
#### DateUtil

**类路径**: `com.tencent.hr.sdk.util.DateUtil`

**功能说明**: 日期时间工具类，提供日期格式化、解析、计算等功能。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `format(Date date, String pattern)` | date: 日期对象<br>pattern: 格式模式 | String | 格式化日期为字符串 |
| `parse(String dateStr, String pattern)` | dateStr: 日期字符串<br>pattern: 格式模式 | Date | 解析字符串为日期 |
| `getCurrentTimestamp()` | 无 | long | 获取当前时间戳（毫秒） |
| `addDays(Date date, int days)` | date: 日期<br>days: 天数 | Date | 日期加减天数 |
| `addHours(Date date, int hours)` | date: 日期<br>hours: 小时数 | Date | 日期加减小时 |
| `getDaysBetween(Date start, Date end)` | start: 开始日期<br>end: 结束日期 | long | 计算两个日期间隔天数 |

<a id="stringutil"></a>
#### StringUtil

**类路径**: `com.tencent.hr.sdk.util.StringUtil`

**功能说明**: 字符串工具类，提供字符串常用操作方法。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `isEmpty(String str)` | str: 字符串 | boolean | 判断字符串是否为空 |
| `isNotEmpty(String str)` | str: 字符串 | boolean | 判断字符串是否非空 |
| `isBlank(String str)` | str: 字符串 | boolean | 判断字符串是否为空白 |
| `isNotBlank(String str)` | str: 字符串 | boolean | 判断字符串是否非空白 |
| `defaultIfEmpty(String str, String defaultStr)` | str: 原字符串<br>defaultStr: 默认值 | String | 字符串为空时返回默认值 |
| `join(List<?> list, String separator)` | list: 列表<br>separator: 分隔符 | String | 用分隔符连接列表元素 |
| `split(String str, String separator)` | str: 字符串<br>separator: 分隔符 | String[] | 按分隔符拆分字符串 |

<a id="base64util"></a>
#### Base64Util

**类路径**: `com.tencent.hr.sdk.util.Base64Util`

**功能说明**: Base64 编解码工具类。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `encode(String str)` | str: 原始字符串 | String | Base64编码 |
| `encode(byte[] bytes)` | bytes: 字节数组 | String | Base64编码字节数组 |
| `decode(String encodedStr)` | encodedStr: Base64字符串 | String | Base64解码为字符串 |
| `decodeToBytes(String encodedStr)` | encodedStr: Base64字符串 | byte[] | Base64解码为字节数组 |
| `encodeUrlSafe(String str)` | str: 原始字符串 | String | URL安全的Base64编码 |
| `decodeUrlSafe(String encodedStr)` | encodedStr: Base64字符串 | String | URL安全的Base64解码 |

<a id="snowflakeutil"></a>
#### SnowFlakeUtil

**类路径**: `com.tencent.hr.sdk.util.SnowFlakeUtil`

**功能说明**: 雪花算法ID生成工具类，生成分布式唯一ID。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `nextId()` | 无 | long | 生成下一个唯一ID |
| `nextIdStr()` | 无 | String | 生成下一个唯一ID（字符串形式） |
| `getInstance(long workerId, long datacenterId)` | workerId: 工作机器ID<br>datacenterId: 数据中心ID | SnowFlakeUtil | 获取雪花算法实例 |

<a id="commandutil"></a>
#### CommandUtil

**类路径**: `com.tencent.hr.sdk.util.CommandUtil`

**功能说明**: 命令执行工具类，用于执行系统命令。

**核心方法**:

| 方法签名 | 参数说明 | 返回值 | 功能说明 |
|---------|---------|--------|---------|
| `execute(String command)` | command: 命令字符串 | String | 执行系统命令并返回输出 |
| `execute(String[] commands)` | commands: 命令数组 | String | 执行多个系统命令 |
| `executeAsync(String command)` | command: 命令字符串 | CompletableFuture\<String\> | 异步执行系统命令 |

---

## 数据传输对象(DTO)

### 基础DTO

<a id="responseinfo"></a>
#### ResponseInfo

**类路径**: `com.tencent.hr.sdk.base.dto.ResponseInfo`

**功能说明**: 统一的响应信息封装类。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | int | 响应码 |
| message | String | 响应消息 |
| data | T | 响应数据 |
| success | boolean | 是否成功 |

<a id="paginator"></a>
#### Paginator

**类路径**: `com.tencent.hr.sdk.base.dto.Paginator`

**功能说明**: 分页信息封装类。

---

### KMS相关DTO

<a id="secrettmptokendto"></a>
#### SecretTmpTokenDTO

**类路径**: `com.tencent.hr.sdk.kms.dto.SecretTmpTokenDTO`

**功能说明**: 密钥临时 token 对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| secretNameMap | Map<String,String> | 密钥名称&值表 |

---

### 文件服务DTO

<a id="filebaserequest"></a>
#### FileBaseRequest

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.FileBaseRequest`

**功能说明**: 文件服务基础请求参数，其他文件相关DTO的父类。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| tenantId | String | 租户ID |
| encryptToken | String | 加密Token |
| fileUuid | String | 文件ID，文件分块续传需要指定 |

<a id="filedto"></a>
#### FileDTO

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.FileDTO`

**功能说明**: 文件上传参数对象，继承自 FileBaseRequest。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| file | File | 文件对象 |
| md5 | String | 文件MD5摘要信息 |
| fileName | String | 文件名称 |
| thirdpartViewMode | ThirdpartViewModeEnum | 第三方预览模式 |
| uploadMode | UploadModeEnum | 上传方式（完整上传/分片上传） |
| encrypt | boolean | 是否加密 |
| encryptMode | FileEncryptModeEnum | 加密方式 |
| convert | boolean | 是否生成预览文件 |
| shared | boolean | 是否为共享文件 |
| fileTotalSize | long | 文件大小，单位bytes |
| picParams | String | 图片处理参数 |
| richTxt | boolean | 是否是富文本 |
| dir | String | 文件目录 |

<a id="filesharedto"></a>
#### FileShareDTO

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.FileShareDTO`

**功能说明**: 文件共享参数对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| fileUuid | String | 文件id |
| picParam | String | 图片参数 |
| shareViewUrl | String | 分享链接 |
| accelerateMode | AccelerateModeEnum | 加速模式 |

<a id="fileauthdto"></a>
#### FileAuthDTO

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.FileAuthDTO`

**功能说明**: 文件授权参数对象，继承自 FileBaseRequest。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| authApp | String | 授权目标应用 |

<a id="filesignaturedto"></a>
#### FileSignatureDTO

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.FileSignatureDTO`

**功能说明**: 文件签名参数对象，继承自 FileBaseRequest。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| staffId | String | 员工ID |
| fileUuids | List<String> | 文件id集合 |
| operate | FileOperateAuthEnum | 操作权限 |
| prehotType | String | 预热类型 |
| watermarkMode | String | 水印类型 |
| watermarkContent | String | 水印内容 |
| watermarkBackground | Boolean | 是否是背景水印，默认false |

<a id="batchdownloaddto"></a>
#### BatchDownloadDTO

**类路径**: `com.tencent.hr.sdk.file.hrfile.dto.BatchDownloadDTO`

**功能说明**: 批量下载附件请求参数，继承自 FileBaseRequest。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| compressName | String | 压缩文件名 |
| fileUuids | Set<String> | 文件UUID集合 |

---

### 消息服务DTO

<a id="messagesendresultdto"></a>
#### MessageSendResultDTO

**类路径**: `com.tencent.hr.sdk.message.v2.dto.MessageSendResultDTO`

**功能说明**: 消息发送结果对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | String | 消息ID |
| batch | String | 批次id |
| msgId | String | 消息id |
| app | String | 应用名 |
| robot | String | 机器人名 |
| tenant | String | 租户 |
| idType | String | 接收者账号类型 |
| type | String | 消息类型 |
| priority | Integer | 消息优先级 |
| finished | boolean | 是否已发送完成 |
| allSuccess | boolean | 是否全部发送成功 |
| retryTime | Integer | 已重试次数，默认为0 |
| result | Set<MessageSendResultPerReceiverDTO> | 每个接收者的发送结果集合 |

<a id="messagesendresultperreceiverdto"></a>
#### MessageSendResultPerReceiverDTO

**类路径**: `com.tencent.hr.sdk.message.v2.dto.MessageSendResultPerReceiverDTO`

**功能说明**: 消息中每个接收者的发送状态。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| receiver | String | 接收人 |
| success | boolean | 是否发送成功 |
| sendTime | Date | 消息发送的时间 |
| msg | String | 发送记录消息 |

<a id="mailwhitedto"></a>
#### MailWhiteDTO

**类路径**: `com.tencent.hr.sdk.message.v2.dto.MailWhiteDTO`

**功能说明**: 邮件白名单对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| total | Integer | 总数 |
| currentPage | Integer | 当前页 |
| currentPageSize | Integer | 当前页条数 |
| sysId | Integer | 系统ID |
| list | List<String> | 白名单列表 |

<a id="sdktemplateresponse"></a>
#### SdkTemplateResponse

**类路径**: `com.tencent.hr.sdk.message.v2.dto.SdkTemplateResponse`

**功能说明**: 消息模板响应对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| name | String | 模板名 |
| labelCode | String | 标签码 |
| labelName | String | 标签名 |
| usage | String | 用途 |
| mailTitle | String | 标题 |
| content | String | 模板内容 |
| allContent | String | 全部内容，包含模板头和模板尾 |

---

### DOS数据查询服务DTO

<a id="querydataresp"></a>
#### QueryDataResp

**类路径**: `com.tencent.hr.sdk.dos.dto.resp.QueryDataResp`

**功能说明**: DOS数据查询响应对象。

**字段说明**:

| 字段名 | 类型 | 说明 |
|--------|------|------|
| hasNext | Boolean | 是否还有数据 |
| prevId | String | 上一次查询的结束id，用于下一次查询的开始id（游标分页） |
| pageIndex | Integer | 当前查询页码 |
| pageSize | Integer | 当前查询页记录数 |
| sequenceNo | String | 序列号 |
| total | Integer | 总记录数 |
| totalPage | Integer | 总页数 |
| hasRight | Boolean | 是否有权限查询数据 |
| content | List<Map<String, Object>> | 数据库记录 |

#### SmsMessageParam

**类路径**: `com.tencent.hr.sdk.message.v2.dto.param.SmsMessageParam`

**功能说明**: 短信消息参数对象。

#### MailMessageParam

**类路径**: `com.tencent.hr.sdk.message.v2.dto.param.MailMessageParam`

**功能说明**: 邮件消息参数对象。

---

## 枚举类

### 环境枚举

<a id="env"></a>
#### Env

**类路径**: `com.tencent.hr.sdk.base.Env`

**枚举值**:

| 枚举值 | 说明 |
|--------|------|
| DEV | 开发环境 |
| TEST | 测试环境 |
| UAT | UAT环境 |
| PROD | 生产环境 |
| E_TEST | 外网测试环境 |
| E_PROD | 外网生产环境 |

---

### 文件相关枚举

<a id="fileencryptmodeenum"></a>
#### FileEncryptModeEnum

**类路径**: `com.tencent.hr.sdk.file.hrfile.enums.FileEncryptModeEnum`

**功能说明**: 文件加密模式枚举。

<a id="uploadmodeenum"></a>
#### UploadModeEnum

**类路径**: `com.tencent.hr.sdk.file.hrfile.enums.UploadModeEnum`

**功能说明**: 上传模式枚举。

**枚举值**:

| 枚举值 | 说明 |
|--------|------|
| total | 完整上传 |
| append | 分片上传 |

---

### 加密相关枚举

<a id="aesmodel"></a>
#### AESModel

**类路径**: `com.tencent.hr.sdk.crypto.enums.AESModel`

**功能说明**: AES 加密模式枚举。

<a id="aespadding"></a>
#### AESPadding

**类路径**: `com.tencent.hr.sdk.crypto.enums.AESPadding`

**功能说明**: AES 填充模式枚举。

<a id="rsakeylength"></a>
#### RSAKeyLength

**类路径**: `com.tencent.hr.sdk.crypto.enums.RSAKeyLength`

**功能说明**: RSA 密钥长度枚举。

---

## 异常体系

### 基础异常

<a id="assertexception"></a>
#### AssertException

**类路径**: `com.tencent.hr.sdk.base.exception.AssertException`

**功能说明**: 断言异常，参数校验失败时抛出。

---

### KMS异常

<a id="kmsexception"></a>
#### KmsException

**类路径**: `com.tencent.hr.sdk.kms.exceptions.KmsException`

**功能说明**: KMS 服务异常。

<a id="kmsunauthorizedexception"></a>
#### KmsUnAuthorizedException

**类路径**: `com.tencent.hr.sdk.kms.exceptions.KmsUnAuthorizedException`

**功能说明**: KMS 未授权异常。

---

### 文件服务异常

<a id="fileservicesexception"></a>
#### FileServicesException

**类路径**: `com.tencent.hr.sdk.file.hrfile.exceptions.FileServicesException`

**功能说明**: 文件服务基础异常。

<a id="fileservicesclientexception"></a>
#### FileServicesClientException

**类路径**: `com.tencent.hr.sdk.file.hrfile.exceptions.FileServicesClientException`

**功能说明**: 文件服务客户端异常。

<a id="fileserviceserverexception"></a>
#### FileServiceServerException

**类路径**: `com.tencent.hr.sdk.file.hrfile.exceptions.FileServiceServerException`

**功能说明**: 文件服务服务端异常。

---

### 其他异常

<a id="dosbizexception"></a>
#### DosBizException

**类路径**: `com.tencent.hr.sdk.dos.exception.DosBizException`

**功能说明**: DOS 业务异常。

<a id="eventbridgeexception"></a>
#### EventBridgeException

**类路径**: `com.tencent.hr.sdk.event.dto.EventBridgeException`

**功能说明**: 事件总线异常。

<a id="shorturlexception"></a>
#### ShortUrlException

**类路径**: `com.tencent.hr.sdk.shortUrl.dto.ShortUrlException`

**功能说明**: 短链服务异常。

---

## 依赖管理

### 核心依赖

```xml
<dependencies>
    <!-- HTTP 客户端 -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
    </dependency>
    
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>logging-interceptor</artifactId>
    </dependency>

    <!-- JSON 处理 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <!-- 日志框架 -->
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
    </dependency>

    <!-- 代码生成 -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>

    <!-- 通用工具 -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>

    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
    </dependency>

    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>

    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-core</artifactId>
    </dependency>

    <!-- 腾讯云服务 -->
    <dependency>
        <groupId>com.qcloud</groupId>
        <artifactId>cos_api</artifactId>
    </dependency>

    <dependency>
        <groupId>com.qcloud</groupId>
        <artifactId>cos-sts_api</artifactId>
    </dependency>

    <!-- 工作流客户端 -->
    <dependency>
        <groupId>com.tencent.hr</groupId>
        <artifactId>workflow-client-java</artifactId>
    </dependency>

    <!-- JWT 处理 -->
    <dependency>
        <groupId>com.nimbusds</groupId>
        <artifactId>nimbus-jose-jwt</artifactId>
    </dependency>

    <!-- 对象映射 -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
    </dependency>

    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
    </dependency>
</dependencies>
```

### 编译配置

- **Java 版本**: 17
- **编码**: UTF-8
- **注解处理器**: MapStruct, Lombok

---

## 开发指南

### 技术选型原则

1. 优先关注项目中已引入的依赖项，避免重复引入
2. 关注依赖的 Issue 数、核心 Contributor 人数
3. 选择有开源组织或基金会背书的依赖
4. 版本号统一在父工程 pom.xml - dependencyManagement 中管理

### 接口设计原则

1. 考量接口的易用性和可扩展性
2. 提供全参版本方法和有默认值的缺损参数版本
3. 暴露请求地址供用户自定义，方便单元测试

### 单元测试

- Core 单元测试：使用 OkHttp 的 MockWebServer
- Spring Boot v2/v3 自动配置测试：参考官方文档方法

### 分支管理

- 开发分支：从 dev 拉取个人主题分支
- 分支命名：使用个人英文名
- 合并流程：个人分支 → dev → master
- 保护分支：dev 和 master 为保护分支，不允许直接提交

---

## 相关文档

- **SDK API手册**: https://hrsdk.pages.woa.com/
- **模块设计文档**: https://doc.weixin.qq.com/doc/w3_APcAbAbdAFwVJYVeZQWRCmo4Lh2Rh?scode=AJEAIQdfAAoNykDywM
- **DOS调用文档**: https://iwiki.woa.com/p/4007806350
- **Spring Boot 3.0 迁移指南**: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide

---

## 附录

### 项目结构

```
hrit-sdk-core/
├── src/main/java/com/tencent/hr/sdk/
│   ├── base/           # 基础类（环境枚举、响应码等）
│   ├── cos/            # 对象存储服务
│   ├── crypto/         # 加密工具
│   ├── distributedLock/# 分布式锁
│   ├── dos/            # 数据查询服务
│   ├── event/          # 事件总线服务
│   ├── file/           # 文件服务
│   ├── kms/            # 密钥管理服务
│   ├── localCache/     # 本地缓存
│   ├── localUploader/  # 本地上传器
│   ├── message/        # 消息服务
│   ├── scheduler/      # 调度服务
│   ├── securityLog/    # 安全日志
│   ├── shortUrl/       # 短链服务
│   ├── tof/            # TOF认证
│   ├── util/           # 工具类
│   └── workflow/       # 工作流服务
├── src/main/resources/
│   └── certs/          # 证书文件
└── src/test/java/      # 测试代码
```

### 配置示例

参考 Spring Boot Starter 模块的配置文件。

---

**文档维护**: 本文档由项目团队维护，如有疑问请联系 HR SDK Team。
