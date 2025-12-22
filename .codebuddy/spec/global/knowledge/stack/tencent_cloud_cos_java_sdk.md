# 腾讯云对象存储 COS Java SDK 使用指南

> **文档版本**: v1.0  
> **SDK版本**: 5.6.227+  
> **更新时间**: 2025-11-13  
> **文档类型**: 技术栈知识库  
> **适用场景**: Java项目集成腾讯云COS对象存储服务

---

## 📚 目录

- [简介](#-简介)
- [环境要求](#-环境要求)
- [安装配置](#-安装配置)
- [快速开始](#-快速开始)
- [核心API](#-核心api)
- [高级功能](#-高级功能)
- [最佳实践](#-最佳实践)
- [常见问题](#-常见问题)
- [相关资源](#-相关资源)

---

## 📖 简介

### 产品概述

**腾讯云对象存储（Cloud Object Storage，COS）** 是腾讯云提供的海量、安全、低成本、高可靠的云存储服务。COS Java SDK 提供了完整的Java语言接口，方便开发者快速集成对象存储功能。

### 核心特性

- ✅ **海量存储**: 支持PB级别数据存储
- ✅ **高可用性**: 99.95%服务可用性，99.999999999%数据可靠性
- ✅ **低成本**: 按需付费，自动降冷
- ✅ **安全可靠**: 多重数据加密，细粒度权限控制
- ✅ **数据处理**: 集成数据万象，支持图片处理、内容审核、文档转换等

### SDK版本说明

- **推荐版本**: XML Java SDK（cos_api 5.6.227+）
- **已淘汰**: JSON Java SDK（不再维护）
- **源码地址**: [GitHub - cos-java-sdk-v5](https://github.com/tencentyun/cos-java-sdk-v5)
- **版本日志**: [CHANGELOG](https://github.com/tencentyun/cos-java-sdk-v5/blob/master/CHANGELOG.md)

### 适用场景

- 静态资源托管（图片、视频、文档）
- 大文件上传下载
- 数据备份与归档
- 多媒体内容分发
- 数据湖构建

---

## 🔧 环境要求

### JDK版本

- **最低要求**: JDK 1.8
- **推荐版本**: JDK 11 或 JDK 17
- **查看当前版本**: `java -version`
- **安装指南**: [Java安装与配置](https://cloud.tencent.com/document/product/436/10865)

### 包结构说明

```
com.qcloud.cos.*                  // 客户端配置类
com.qcloud.cos.auth.*             // 权限认证类
com.qcloud.cos.exception.*        // 异常处理类
com.qcloud.cos.model.*            // 请求/响应模型类
com.qcloud.cos.transfer.*         // 高级传输API
com.qcloud.cos.region.Region      // 地域配置类
```

---

## 📦 安装配置

### 方式一: Maven安装（推荐）

在项目的 `pom.xml` 中添加依赖:

```xml
<dependency>
    <groupId>com.qcloud</groupId>
    <artifactId>cos_api</artifactId>
    <version>5.6.227</version>
</dependency>
```

> 💡 **提示**: 访问 [Maven中央仓库](https://mvnrepository.com/artifact/com.qcloud/cos_api) 查看最新版本

### 方式二: 源码安装

1. **下载源码**
   - GitHub: https://github.com/tencentyun/cos-java-sdk-v5
   - 快速下载: https://cos-sdk-archive-1253960454.file.myqcloud.com/cos-java-sdk-v5/latest/cos-java-sdk-v5.zip

2. **导入IDE**
   - 通过 Maven 导入到 Eclipse、IntelliJ IDEA 等IDE
   - 使用 `mvn clean install` 构建

### 卸载SDK

- Maven方式: 删除 `pom.xml` 中的依赖声明
- 源码方式: 删除源码目录

---

## 🚀 快速开始

### 步骤1: 获取访问凭证

#### 临时密钥（强烈推荐）

使用临时密钥可大幅提升安全性，遵循最小权限原则。

```java
// 临时密钥包含三个部分
String tmpSecretId = "SECRETID";        // 临时访问密钥ID
String tmpSecretKey = "SECRETKEY";      // 临时访问密钥Key
String sessionToken = "TOKEN";          // 会话令牌
```

**获取方式**: 
- 使用 STS（Security Token Service）动态生成
- 参考文档: [临时密钥生成及使用指引](https://cloud.tencent.com/document/product/436/14048)

#### 永久密钥（不推荐）

```java
// 仅用于测试环境，生产环境禁止使用
String secretId = "SECRETID";
String secretKey = "SECRETKEY";
```

**获取位置**: [API密钥管理](https://console.cloud.tencent.com/cam/capi)

### 步骤2: 初始化COS客户端

```java
import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicSessionCredentials;
import com.qcloud.cos.http.HttpProtocol;
import com.qcloud.cos.region.Region;

public class CosClientExample {
    
    public static COSClient createCOSClient() {
        // 1. 初始化用户身份信息（临时密钥）
        String tmpSecretId = "SECRETID";
        String tmpSecretKey = "SECRETKEY";
        String sessionToken = "TOKEN";
        BasicSessionCredentials cred = new BasicSessionCredentials(tmpSecretId, tmpSecretKey, sessionToken);
        
        // 2. 设置存储桶地域
        // COS_REGION 参数：ap-beijing, ap-guangzhou, ap-shanghai 等
        Region region = new Region("COS_REGION");
        
        // 3. 生成客户端配置
        ClientConfig clientConfig = new ClientConfig(region);
        
        // 推荐使用HTTPS协议
        clientConfig.setHttpProtocol(HttpProtocol.https);
        
        // 可选: 设置超时时间（毫秒）
        clientConfig.setSocketTimeout(30000);
        clientConfig.setConnectionTimeout(30000);
        
        // 4. 生成COS客户端
        COSClient cosClient = new COSClient(cred, clientConfig);
        
        return cosClient;
    }
}
```

### 步骤3: 基础操作示例

#### 创建存储桶

```java
import com.qcloud.cos.model.CreateBucketRequest;
import com.qcloud.cos.model.CannedAccessControlList;

public void createBucket(COSClient cosClient) {
    String bucket = "examplebucket-1250000000"; // 存储桶名称
    CreateBucketRequest createBucketRequest = new CreateBucketRequest(bucket);
    // 设置存储桶权限为私有读写（Private）
    createBucketRequest.setCannedAcl(CannedAccessControlList.Private);
    cosClient.createBucket(createBucketRequest);
    System.out.println("存储桶创建成功");
}
```

#### 上传对象（简单上传）

适用于小于5GB的文件:

```java
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.PutObjectResult;
import java.io.File;

public void uploadFile(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "folder/picture.jpg";  // 对象键（Key）
    File localFile = new File("/path/to/local/file.jpg");
    
    PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
    PutObjectResult putObjectResult = cosClient.putObject(putObjectRequest);
    
    // 获取文件的 ETag
    String etag = putObjectResult.getETag();
    System.out.println("上传成功，ETag: " + etag);
}
```

#### 下载对象

```java
import com.qcloud.cos.model.GetObjectRequest;
import com.qcloud.cos.model.COSObject;
import com.qcloud.cos.model.COSObjectInputStream;
import java.io.File;

public void downloadFile(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "folder/picture.jpg";
    
    // 方式1: 下载到流
    GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, key);
    COSObject cosObject = cosClient.getObject(getObjectRequest);
    COSObjectInputStream cosObjectInput = cosObject.getObjectContent();
    // 处理流...
    cosObjectInput.close();
    
    // 方式2: 直接下载到本地文件
    File downFile = new File("/path/to/local/download.jpg");
    cosClient.getObject(getObjectRequest, downFile);
    System.out.println("下载成功");
}
```

#### 删除对象

```java
public void deleteFile(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "folder/picture.jpg";
    
    cosClient.deleteObject(bucketName, key);
    System.out.println("删除成功");
}
```

#### 查询存储桶列表

```java
import com.qcloud.cos.model.Bucket;
import java.util.List;

public void listBuckets(COSClient cosClient) {
    List<Bucket> buckets = cosClient.listBuckets();
    for (Bucket bucket : buckets) {
        System.out.println("存储桶名称: " + bucket.getName());
        System.out.println("创建时间: " + bucket.getCreationDate());
        System.out.println("所有者: " + bucket.getOwner().getDisplayName());
    }
}
```

### 步骤4: 关闭客户端

```java
// 确认不再使用COS客户端之后，关闭客户端
cosClient.shutdown();
```

---

## 🔑 核心API

### 对象操作

| 操作 | API类 | 方法 | 说明 |
|------|-------|------|------|
| 简单上传 | `PutObjectRequest` | `cosClient.putObject()` | 适用于≤5GB文件 |
| 分块上传 | `InitiateMultipartUploadRequest` | `cosClient.initiateMultipartUpload()` | 适用于大文件 |
| 下载对象 | `GetObjectRequest` | `cosClient.getObject()` | 支持下载到流或文件 |
| 删除单个对象 | - | `cosClient.deleteObject()` | 删除指定对象 |
| 批量删除 | `DeleteObjectsRequest` | `cosClient.deleteObjects()` | 批量删除对象 |
| 列出对象 | `ListObjectsRequest` | `cosClient.listObjects()` | 支持前缀、分隔符查询 |
| 复制对象 | `CopyObjectRequest` | `cosClient.copyObject()` | 复制对象到新位置 |
| 查询对象元数据 | `GetObjectMetadataRequest` | `cosClient.getObjectMetadata()` | 获取对象属性 |

### 存储桶操作

| 操作 | API类 | 方法 | 说明 |
|------|-------|------|------|
| 创建存储桶 | `CreateBucketRequest` | `cosClient.createBucket()` | 创建新存储桶 |
| 删除存储桶 | - | `cosClient.deleteBucket()` | 删除空存储桶 |
| 列出存储桶 | - | `cosClient.listBuckets()` | 查询所有存储桶 |
| 查询存储桶 | - | `cosClient.doesBucketExist()` | 检查存储桶是否存在 |
| 设置访问权限 | `SetBucketAclRequest` | `cosClient.setBucketAcl()` | 设置存储桶ACL |
| 查询访问权限 | `GetBucketAclRequest` | `cosClient.getBucketAcl()` | 获取存储桶ACL |

### 列出对象示例

```java
import com.qcloud.cos.model.ListObjectsRequest;
import com.qcloud.cos.model.ObjectListing;
import com.qcloud.cos.model.COSObjectSummary;

public void listObjects(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    
    ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
    listObjectsRequest.setBucketName(bucketName);
    // 设置前缀，列出指定前缀的对象
    listObjectsRequest.setPrefix("folder/");
    // 设置最大返回数量
    listObjectsRequest.setMaxKeys(100);
    
    ObjectListing objectListing = cosClient.listObjects(listObjectsRequest);
    for (COSObjectSummary cosObjectSummary : objectListing.getObjectSummaries()) {
        System.out.println("对象键: " + cosObjectSummary.getKey());
        System.out.println("文件大小: " + cosObjectSummary.getSize());
        System.out.println("最后修改时间: " + cosObjectSummary.getLastModified());
    }
}
```

---

## 🚀 高级功能

### 1. 分块上传（大文件上传）

使用 `TransferManager` 高级接口，支持断点续传和并发上传:

```java
import com.qcloud.cos.transfer.TransferManager;
import com.qcloud.cos.transfer.Upload;
import com.qcloud.cos.transfer.TransferManagerConfiguration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public void uploadLargeFile(COSClient cosClient) throws InterruptedException {
    // 创建线程池
    ExecutorService threadPool = Executors.newFixedThreadPool(32);
    
    // 创建TransferManager实例
    TransferManager transferManager = new TransferManager(cosClient, threadPool);
    
    // 设置分块上传阈值和分块大小
    TransferManagerConfiguration transferManagerConfiguration = new TransferManagerConfiguration();
    transferManagerConfiguration.setMultipartUploadThreshold(5 * 1024 * 1024); // 5MB以上使用分块上传
    transferManagerConfiguration.setMinimumUploadPartSize(1 * 1024 * 1024);   // 分块大小1MB
    transferManager.setConfiguration(transferManagerConfiguration);
    
    String bucketName = "examplebucket-1250000000";
    String key = "largefile.zip";
    File localFile = new File("/path/to/large/file.zip");
    
    // 开始上传
    Upload upload = transferManager.upload(bucketName, key, localFile);
    
    // 等待上传完成
    upload.waitForCompletion();
    
    System.out.println("大文件上传完成");
    
    // 关闭TransferManager
    transferManager.shutdownNow(false);
}
```

### 2. 生成预签名URL

用于临时分享文件下载链接:

```java
import com.qcloud.cos.http.HttpMethodName;
import java.net.URL;
import java.util.Date;

public void generatePresignedUrl(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "folder/picture.jpg";
    
    // 设置签名过期时间（1小时后过期）
    Date expirationDate = new Date(System.currentTimeMillis() + 3600 * 1000);
    
    // 生成下载链接
    URL url = cosClient.generatePresignedUrl(bucketName, key, expirationDate, HttpMethodName.GET);
    
    System.out.println("预签名URL: " + url.toString());
}
```

### 3. 设置对象元数据

```java
import com.qcloud.cos.model.ObjectMetadata;

public void uploadWithMetadata(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "document.pdf";
    File localFile = new File("/path/to/document.pdf");
    
    // 设置元数据
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentType("application/pdf");
    metadata.setContentDisposition("attachment; filename=\"report.pdf\"");
    metadata.setHeader("x-cos-meta-author", "John Doe");
    
    PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
    putObjectRequest.setMetadata(metadata);
    
    cosClient.putObject(putObjectRequest);
    System.out.println("上传成功（含自定义元数据）");
}
```

### 4. 服务端加密

```java
import com.qcloud.cos.model.SSECOSKeyManagementParams;

public void uploadWithEncryption(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "encrypted-file.txt";
    File localFile = new File("/path/to/file.txt");
    
    PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
    
    // 使用COS托管加密密钥（SSE-COS）
    putObjectRequest.setSSECOSKeyManagementParams(new SSECOSKeyManagementParams());
    
    cosClient.putObject(putObjectRequest);
    System.out.println("加密上传成功");
}
```

### 5. 图片处理（集成数据万象）

```java
import com.qcloud.cos.model.ciModel.persistence.ImageInfo;
import com.qcloud.cos.model.ciModel.persistence.PicOperations;

public void uploadWithImageProcess(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String key = "original.jpg";
    File localFile = new File("/path/to/image.jpg");
    
    PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
    
    // 配置图片处理规则
    PicOperations picOperations = new PicOperations();
    picOperations.setIsPicInfo(1); // 返回原图信息
    
    // 添加缩略图规则（宽度800px，保持比例）
    List<PicOperations.Rule> rules = new ArrayList<>();
    PicOperations.Rule rule1 = new PicOperations.Rule();
    rule1.setFileId("thumbnail.jpg");
    rule1.setRule("imageMogr2/thumbnail/800x");
    rules.add(rule1);
    
    picOperations.setRules(rules);
    putObjectRequest.setPicOperations(picOperations);
    
    cosClient.putObject(putObjectRequest);
    System.out.println("上传并处理图片成功");
}
```

---

## 💡 最佳实践

### 1. 密钥安全管理

✅ **推荐做法**:
```java
// 使用临时密钥，定期轮换
// 通过STS服务动态获取临时密钥
BasicSessionCredentials cred = new BasicSessionCredentials(
    getTempSecretId(),    // 从安全服务获取
    getTempSecretKey(),   // 从安全服务获取
    getSessionToken()     // 会话令牌
);
```

❌ **避免做法**:
```java
// 不要在代码中硬编码永久密钥
String secretId = "AKIDxxxxxxxxxxxxxxxx"; // 危险！
String secretKey = "xxxxxxxxxxxxxxxxxx";  // 危险！
```

### 2. 客户端复用

✅ **推荐做法**:
```java
// 使用单例模式，全局复用COSClient实例
public class CosClientSingleton {
    private static volatile COSClient instance;
    
    public static COSClient getInstance() {
        if (instance == null) {
            synchronized (CosClientSingleton.class) {
                if (instance == null) {
                    instance = createCOSClient();
                }
            }
        }
        return instance;
    }
}
```

❌ **避免做法**:
```java
// 不要每次操作都创建新的客户端
public void upload() {
    COSClient cosClient = new COSClient(...); // 资源浪费
    cosClient.putObject(...);
    cosClient.shutdown();
}
```

### 3. 异常处理

```java
import com.qcloud.cos.exception.CosServiceException;
import com.qcloud.cos.exception.CosClientException;

public void uploadWithErrorHandling(COSClient cosClient) {
    try {
        String bucketName = "examplebucket-1250000000";
        String key = "file.txt";
        File localFile = new File("/path/to/file.txt");
        
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, localFile);
        cosClient.putObject(putObjectRequest);
        
    } catch (CosServiceException e) {
        // 服务端异常：权限不足、存储桶不存在等
        System.err.println("COS服务异常:");
        System.err.println("错误码: " + e.getErrorCode());
        System.err.println("错误信息: " + e.getErrorMessage());
        System.err.println("请求ID: " + e.getRequestId());
        System.err.println("状态码: " + e.getStatusCode());
        
    } catch (CosClientException e) {
        // 客户端异常：网络异常、IO异常等
        System.err.println("客户端异常: " + e.getMessage());
        e.printStackTrace();
    }
}
```

### 4. 超时和重试配置

```java
ClientConfig clientConfig = new ClientConfig(new Region("ap-beijing"));

// 设置连接超时时间（默认30秒）
clientConfig.setConnectionTimeout(30 * 1000);

// 设置Socket读取超时时间（默认30秒）
clientConfig.setSocketTimeout(30 * 1000);

// 设置最大连接数（默认1024）
clientConfig.setMaxConnectionsCount(1024);

// 自定义重试策略（仅IO异常重试）
clientConfig.setRetryPolicy(new RetryPolicy() {
    @Override
    public boolean shouldRetry(CosServiceException exception, int retryCount) {
        // 仅网络异常时重试，最多3次
        return exception.getStatusCode() >= 500 && retryCount < 3;
    }
});
```

### 5. 大文件上传优化

```java
TransferManagerConfiguration config = new TransferManagerConfiguration();

// 设置分块上传阈值（5MB以上使用分块）
config.setMultipartUploadThreshold(5 * 1024 * 1024);

// 设置分块大小（1MB）
config.setMinimumUploadPartSize(1 * 1024 * 1024);

// 设置并发线程数
ExecutorService threadPool = Executors.newFixedThreadPool(32);
TransferManager transferManager = new TransferManager(cosClient, threadPool);
transferManager.setConfiguration(config);
```

### 6. 目录管理

COS没有真实的目录概念，通过对象键（Key）的`/`分隔符模拟目录:

```java
// 创建"目录"（上传一个以/结尾的空对象）
public void createFolder(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String folderKey = "myfolder/";  // 以/结尾表示目录
    
    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentLength(0);
    
    InputStream emptyContent = new ByteArrayInputStream(new byte[0]);
    PutObjectRequest putObjectRequest = new PutObjectRequest(
        bucketName, folderKey, emptyContent, metadata
    );
    
    cosClient.putObject(putObjectRequest);
}

// 列出"目录"下的文件
public void listFolder(COSClient cosClient) {
    String bucketName = "examplebucket-1250000000";
    String folderPrefix = "myfolder/";
    
    ListObjectsRequest request = new ListObjectsRequest();
    request.setBucketName(bucketName);
    request.setPrefix(folderPrefix);        // 前缀匹配
    request.setDelimiter("/");              // 分隔符，实现目录层级
    
    ObjectListing listing = cosClient.listObjects(request);
    // 处理结果...
}
```

---

## ❓ 常见问题

### Q1: 如何选择合适的地域（Region）?

**A**: 选择距离业务用户最近的地域，降低访问延迟。常用地域代码:

| 地域名称 | 地域代码 | 说明 |
|---------|---------|------|
| 北京 | `ap-beijing` | 华北地区 |
| 上海 | `ap-shanghai` | 华东地区 |
| 广州 | `ap-guangzhou` | 华南地区 |
| 成都 | `ap-chengdu` | 西南地区 |
| 香港 | `ap-hongkong` | 港澳台地区 |
| 新加坡 | `ap-singapore` | 东南亚地区 |

完整地域列表: https://cloud.tencent.com/document/product/436/6224

### Q2: 上传大文件失败怎么办?

**A**: 使用分块上传（`TransferManager`），优势:
- 支持断点续传
- 并发上传，提升速度
- 单个分块失败可单独重试

### Q3: 如何处理权限错误（AccessDenied）?

**A**: 检查以下几点:
1. 密钥是否正确（SecretId、SecretKey）
2. 临时密钥是否过期
3. 存储桶是否存在
4. 存储桶ACL权限设置
5. 存储桶策略（Bucket Policy）是否允许操作

### Q4: 如何测试网络连通性?

**A**: 使用以下命令测试:
```bash
# 测试网络是否可达
ping cos.ap-guangzhou.myqcloud.com

# 测试HTTPS连接
curl https://examplebucket-1250000000.cos.ap-guangzhou.myqcloud.com
```

### Q5: 如何提升上传下载速度?

**A**: 优化建议:
1. 使用就近的地域
2. 启用分块上传/下载
3. 增加并发线程数
4. 使用CDN加速（针对下载）
5. 开启传输加速功能

### Q6: COS支持哪些存储类型?

**A**: 
- **标准存储（STANDARD）**: 高频访问，低延迟
- **低频存储（STANDARD_IA）**: 低频访问，存储成本更低
- **智能分层存储（INTELLIGENT_TIERING）**: 自动降冷
- **归档存储（ARCHIVE）**: 长期归档，成本极低
- **深度归档存储（DEEP_ARCHIVE）**: 极低成本，取回时间较长

---

## 📚 相关资源

### 官方文档

- **产品文档**: https://cloud.tencent.com/document/product/436
- **Java SDK文档**: https://cloud.tencent.com/document/product/436/10199
- **API参考**: https://cloud.tencent.com/document/product/436/7751
- **最佳实践**: https://cloud.tencent.com/document/product/436/35214
- **常见问题**: https://cloud.tencent.com/document/product/436/50746

### 代码示例

- **GitHub示例代码**: https://github.com/tencentyun/cos-java-sdk-v5/tree/master/src/main/java/com/qcloud/cos/demo
- **快速入门示例**: https://cloud.tencent.com/document/product/436/65935

### 工具推荐

- **COSBrowser**: 图形化工具，支持可视化操作
  - 下载地址: https://cloud.tencent.com/document/product/436/11366
- **COSCLI**: 命令行工具，适合批量操作
  - 使用指南: https://cloud.tencent.com/document/product/436/63143
- **COSCMD**: Python命令行工具（老版本）
  - 使用指南: https://cloud.tencent.com/document/product/436/10976

### 控制台

- **COS控制台**: https://console.cloud.tencent.com/cos
- **密钥管理**: https://console.cloud.tencent.com/cam/capi
- **访问管理CAM**: https://console.cloud.tencent.com/cam

---

## 📝 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-11-13 | 初始版本，基于SDK 5.6.227编写 |

---

## 🔗 相关文档

- [Spring Kafka 使用指南](./spring_kafka.md)
- [数据库连接池配置](./database_connection_pool.md)
- [Redis 使用最佳实践](./redis_best_practices.md)

---

**文档维护**: 本文档由Spec-Code项目组维护，如有疑问或建议，请提交Issue。
