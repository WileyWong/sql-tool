# 附件中台服务开发指南 - 第四分卷

> 📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part3.md)

---

## Java SDK、最佳实践、常见问题

本分卷包含Java SDK详细使用、最佳实践、常见问题及解决方案。

---

## 一、Java SDK使用指南

### 1.1 Maven依赖

#### 添加依赖

```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>hr-fileservices-starter</artifactId>
    <version>2.0.5-SNAPSHOT</version>
</dependency>
```

#### 推荐使用最新版本

- **最新版本**: `2.0.5-SNAPSHOT`
- **查看版本**: 参考本文档末尾的版本更新记录

---

### 1.2 配置文件

#### application.yml配置

```yaml
hr:
  security:
    # 两种写法任选其一,优先使用驼峰式
    app-token: YOUR_APP_TOKEN     # 或 appToken
    app-name: YOUR_APP_NAME       # 或 appName
  
  fileservices:
    enable: true

# 可选: 本地下载文件路径
local:
  download:
    filepath: /tmp/downloads
```

**配置说明**:

| 配置项 | 说明 | 必填 |
|--------|------|------|
| `hr.security.app-token` | 应用令牌 | ✅ |
| `hr.security.app-name` | 应用名称 | ✅ |
| `hr.fileservices.enable` | 是否启用文件服务 | ✅ |
| `local.download.filepath` | 本地下载文件存储路径 | ❌ |

> 📌 **注意**: `app-token` 和 `appToken` 都可以使用,同时存在时优先使用 `appToken`

---

### 1.3 注入使用

```java
import com.tencent.hr.fileservices.client.FileServicesClient;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class FileService {
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    public void testDownloadFile() {
        String fileUuid = "group1_M00/00/00/xxx.pdf";
        File file = fileServicesClient.downloadFile("", fileUuid);
        System.out.println("文件路径: " + file.getAbsolutePath());
    }
}
```

---

### 1.4 API概览

| 接口名称 | 接口功能 |
|---------|---------|
| `upload` | 上传文件,非加密,非共享,非转换 |
| `uploadShared` | 上传共享文件 |
| `uploadEncrypt` | 上传加密文件 |
| `uploadEncrypt` (重载) | 上传加密文件,可指定加密模式 |
| `uploadAndConvert` | 上传并转换该文件 |
| `uploadFile` | 上传文件,提供自定义上传配置 |
| `downloadFile` | 下载附件 |
| `downloadBatchFile` | 批量下载附件 |
| `getSignatureExt` | 生成签名ext |
| `getFileDetail` | 查看文件明细 |
| `authFile` | 将文件授权指定系统 |
| `addTags` | 添加标签 |
| `delTags` | 删除标签 |
| `getShareViewUrls` | 获取共享访问连接 |
| `isFileConverted` | 判断文件是否转换成功 |
| `dealPicture` | 处理图片 |
| `editRichTxt` | 编辑富文本 |
| `queryHistories` | 查询富文本更新历史 |
| `queryRichTxtContent` | 获取历史富文本内容 |
| `deleteFile` | 删除文件(v2.0.5+) |

---

### 1.5 核心接口详解

#### 1.5.1 基础上传

```java
/**
 * 基础上传: 非加密,非共享,非转换
 */
public String basicUpload(MultipartFile file) {
    String fileUuid = fileServicesClient.upload(file);
    return fileUuid;
}
```

#### 1.5.2 上传共享文件

```java
/**
 * 上传共享文件: 多个应用间可访问
 */
public String uploadSharedFile(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadShared(file);
    return fileUuid;
}
```

#### 1.5.3 上传加密文件

```java
/**
 * 上传加密文件: 默认normal模式
 */
public String uploadEncryptedFile(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadEncrypt(file);
    return fileUuid;
}

/**
 * 上传加密文件: 指定加密模式
 */
public String uploadEncryptedFileWithMode(MultipartFile file, String mode) {
    // mode: "normal" 或 "strictly"
    String fileUuid = fileServicesClient.uploadEncrypt(file, mode);
    return fileUuid;
}
```

#### 1.5.4 上传并转换

```java
/**
 * 上传并自动转换为PDF(适用于Office文档)
 */
public String uploadAndConvertToPDF(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadAndConvert(file);
    
    // 等待转换完成
    boolean converted = waitForConversion(fileUuid, 60);
    if (!converted) {
        throw new RuntimeException("文件转换超时");
    }
    
    return fileUuid;
}

private boolean waitForConversion(String fileUuid, int maxWaitSeconds) {
    int waited = 0;
    while (waited < maxWaitSeconds) {
        if (fileServicesClient.isFileConverted(fileUuid)) {
            return true;
        }
        Thread.sleep(2000);
        waited += 2;
    }
    return false;
}
```

#### 1.5.5 自定义上传配置

```java
/**
 * 自定义上传配置: 完全控制上传参数
 */
public String customUpload(MultipartFile file) {
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setShared(false);          // 非共享
    param.setConvert(true);          // 转换为PDF
    param.setEncryptMode("normal");  // 普通加密
    param.setDir("documents/2024");  // 指定目录
    param.setStoreType("intranet");  // 仅内网访问
    
    String fileUuid = fileServicesClient.uploadFile(param);
    return fileUuid;
}
```

#### 1.5.6 下载文件

```java
/**
 * 下载文件到临时目录
 */
public File downloadToTemp(String fileUuid) {
    File file = fileServicesClient.downloadFile("", fileUuid);
    return file;
}

/**
 * 下载文件到指定目录
 */
public File downloadToDirectory(String fileUuid, String targetDir) {
    File tempFile = fileServicesClient.downloadFile("", fileUuid);
    
    // 移动到目标目录
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    File targetFile = new File(targetDir, detail.getOriginalName());
    
    Files.move(tempFile.toPath(), targetFile.toPath(), 
        StandardCopyOption.REPLACE_EXISTING);
    
    return targetFile;
}
```

#### 1.5.7 批量下载

```java
/**
 * 批量下载文件为ZIP
 */
public File batchDownload(List<String> fileUuids, String zipName) {
    File zipFile = fileServicesClient.downloadBatchFile(fileUuids, zipName);
    return zipFile;
}
```

#### 1.5.8 文件信息查询

```java
/**
 * 获取文件详细信息
 */
public FileDetail getFileInfo(String fileUuid) {
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    
    System.out.println("文件名: " + detail.getOriginalName());
    System.out.println("文件大小: " + detail.getFileSize() + " 字节");
    System.out.println("文件类型: " + detail.getExt());
    System.out.println("转换状态: " + detail.getConvertStatus());
    System.out.println("预览文件ID: " + detail.getViewFileUuid());
    
    return detail;
}
```

#### 1.5.9 文件删除

```java
/**
 * 删除文件 (v2.0.5+)
 */
public void deleteFile(String fileUuid) {
    fileServicesClient.deleteFile(fileUuid);
}
```

#### 1.5.10 获取签名

```java
/**
 * 获取访问签名
 */
public String getSignature(List<String> fileUuids, String operate) {
    return fileServicesClient.getSignatureExt(
        fileUuids, 
        operate,
        null,  // watermarkContent
        null   // watermarkMode
    );
}

/**
 * 获取带水印的签名
 */
public String getSignatureWithWatermark(List<String> fileUuids) {
    return fileServicesClient.getSignatureExt(
        fileUuids,
        "visit",
        "仅供内部使用",
        "darkgraysingle"
    );
}
```

#### 1.5.11 文件授权

```java
/**
 * 将文件授权给其他系统
 */
public void authorizeToApp(String fileUuid, String targetAppName) {
    fileServicesClient.authFile(fileUuid, targetAppName);
}
```

#### 1.5.12 标签管理

```java
/**
 * 添加或修改标签
 */
public void manageTags(String fileUuid) {
    Map<String, String> tags = new HashMap<>();
    tags.put("department", "HR");
    tags.put("year", "2024");
    tags.put("type", "contract");
    
    fileServicesClient.addTags(fileUuid, tags);
}

/**
 * 删除标签
 */
public void removeTags(String fileUuid) {
    Map<String, String> tagsToRemove = new HashMap<>();
    tagsToRemove.put("year", "2024");
    
    fileServicesClient.delTags(fileUuid, tagsToRemove);
}
```

#### 1.5.13 共享访问URL

```java
/**
 * 获取可直接访问的共享链接
 */
public List<String> getPublicUrls(List<String> fileUuids) {
    List<ShareUrlInfo> infos = fileServicesClient.getShareViewUrls(fileUuids);
    
    return infos.stream()
        .map(ShareUrlInfo::getShareViewUrl)
        .collect(Collectors.toList());
}
```

#### 1.5.14 图片处理

```java
/**
 * 处理图片
 */
public void processImage(String fileUuid, String picParams) {
    fileServicesClient.dealPicture(fileUuid, picParams);
}

// 使用示例
processImage("xxx.jpg", "scale/50");            // 压缩50%
processImage("xxx.jpg", "rotate/90");           // 旋转90度
processImage("xxx.jpg", "scale/width/800/px");  // 限定宽度800px
```

---

### 1.6 完整业务示例

#### 示例1: 文件上传服务

```java
@Service
public class DocumentService {
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    /**
     * 上传普通文档
     */
    public DocumentVO uploadDocument(MultipartFile file, String category) {
        // 1. 上传文件
        String fileUuid = fileServicesClient.upload(file);
        
        // 2. 添加分类标签
        Map<String, String> tags = new HashMap<>();
        tags.put("category", category);
        tags.put("uploadTime", LocalDateTime.now().toString());
        fileServicesClient.addTags(fileUuid, tags);
        
        // 3. 获取文件信息
        FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
        
        // 4. 构建返回对象
        DocumentVO doc = new DocumentVO();
        doc.setFileUuid(fileUuid);
        doc.setFileName(detail.getOriginalName());
        doc.setFileSize(detail.getFileSize());
        doc.setCategory(category);
        
        return doc;
    }
    
    /**
     * 上传需要预览的文档
     */
    public DocumentVO uploadDocumentForPreview(MultipartFile file) {
        // 1. 上传并转换
        String fileUuid = fileServicesClient.uploadAndConvert(file);
        
        // 2. 等待转换完成
        waitForConversion(fileUuid, 60);
        
        // 3. 获取预览URL
        String previewUrl = getPreviewUrl(fileUuid);
        
        DocumentVO doc = new DocumentVO();
        doc.setFileUuid(fileUuid);
        doc.setPreviewUrl(previewUrl);
        
        return doc;
    }
    
    /**
     * 上传加密文档(敏感信息)
     */
    public DocumentVO uploadSecureDocument(MultipartFile file) {
        // 使用加密模式上传
        String fileUuid = fileServicesClient.uploadEncrypt(file, "normal");
        
        DocumentVO doc = new DocumentVO();
        doc.setFileUuid(fileUuid);
        doc.setEncrypted(true);
        
        return doc;
    }
    
    /**
     * 批量上传
     */
    public List<DocumentVO> batchUpload(List<MultipartFile> files) {
        return files.stream()
            .map(file -> uploadDocument(file, "batch"))
            .collect(Collectors.toList());
    }
}
```

#### 示例2: 文件下载服务

```java
@Service
public class DownloadService {
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    /**
     * 下载单个文件
     */
    public void downloadFile(String fileUuid, HttpServletResponse response) throws IOException {
        // 1. 获取文件信息
        FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
        
        // 2. 下载文件
        File file = fileServicesClient.downloadFile("", fileUuid);
        
        // 3. 设置响应头
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", 
            "attachment;filename=" + URLEncoder.encode(detail.getOriginalName(), "UTF-8"));
        
        // 4. 输出文件
        try (FileInputStream fis = new FileInputStream(file);
             OutputStream os = response.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        }
    }
    
    /**
     * 批量下载为ZIP
     */
    public void batchDownload(List<String> fileUuids, HttpServletResponse response) throws IOException {
        // 1. 批量下载
        File zipFile = fileServicesClient.downloadBatchFile(fileUuids, "documents");
        
        // 2. 设置响应头
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment;filename=documents.zip");
        
        // 3. 输出ZIP文件
        try (FileInputStream fis = new FileInputStream(zipFile);
             OutputStream os = response.getOutputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        }
        
        // 4. 删除临时文件
        zipFile.delete();
    }
}
```

---

### 1.7 SDK版本更新记录

#### v2.0.5-SNAPSHOT (最新)

**新特性**:
- ✅ 新增文件删除接口
- ✅ 支持设置租户信息

#### v2.0.3-SNAPSHOT

**新特性**:
- ✅ 兼容配置文件属性 `hr.security.app-token`
- ✅ 兼容配置文件属性 `hr.security.app-name`

#### v2.0.2-SNAPSHOT

**新特性**:
- ✅ 配置文件属性 ~~`hr.security.token`~~ 变更为 `hr.security.appToken`
- ✅ 配置文件属性 ~~`hr.security.appname`~~ 变更为 `hr.security.appName`
- 🐛 修复了上传接口自定义入参 `fileName` 不生效问题

#### v2.0.1-SNAPSHOT

**新特性**:
- ✅ 对于 `hr-base` 依赖升级到 `3.0.0-SNAPSHOT`

#### v1.0.1-SNAPSHOT

**Bug修复**:
- 🐛 修复多次读取 `response.body()` 导致流已关闭异常问题

---

## 二、常见问题FAQ

### Q1: 启动报错 `ClassNotFoundException: com.tencent.hr.base.dto.ResponseInfo`

**错误信息**:
```
Caused by: java.lang.ClassNotFoundException: com.tencent.hr.base.dto.ResponseInfo
```

或

```
org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'xxx'
```

**原因**: 缺少 `hr-base` 依赖

**解决方法**:

```xml
<dependency>
    <groupId>com.tencent.hr</groupId>
    <artifactId>hr-base</artifactId>
    <version>3.0.0-SNAPSHOT</version>
</dependency>
```

---

### Q2: 中文文件名报错

**错误信息**:
```
java.lang.IllegalArgumentException: Unexpected char 0x4e0a at 40 in Content-Disposition value: 
form-data; name="file"; filename="这是中文文件名.pdf"
```

**原因**: okhttp版本过低,不支持中文文件名

**解决方法**:

升级okhttp依赖到3.14.2或更高版本:

```xml
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>3.14.2</version>
</dependency>

<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp-urlconnection</artifactId>
    <version>3.14.2</version>
</dependency>
```

---

### Q3: 签名过期怎么办?

**问题**: 签名30分钟后失效,导致访问失败。

**解决方案**:

```java
@Service
public class SignatureService {
    
    private final LoadingCache<String, String> signatureCache = CacheBuilder.newBuilder()
        .expireAfterWrite(25, TimeUnit.MINUTES)  // 提前5分钟失效
        .build(new CacheLoader<String, String>() {
            @Override
            public String load(String fileUuid) {
                return generateNewSignature(fileUuid);
            }
        });
    
    public String getValidSignature(String fileUuid) {
        return signatureCache.getUnchecked(fileUuid);
    }
}
```

---

### Q4: 如何判断文件是否转换完成?

**方法1: 使用SDK方法**

```java
boolean converted = fileServicesClient.isFileConverted(fileUuid);
```

**方法2: 查询转换状态**

```java
FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
String status = detail.getConvertStatus();

if ("转换完成".equals(status)) {
    // 转换完成
} else {
    // 尚未转换或转换中
}
```

**方法3: 轮询等待**

```java
public boolean waitForConversion(String fileUuid, int maxSeconds) throws InterruptedException {
    int waited = 0;
    while (waited < maxSeconds) {
        if (fileServicesClient.isFileConverted(fileUuid)) {
            return true;
        }
        Thread.sleep(2000);
        waited += 2;
    }
    return false;
}
```

---

### Q5: 上传大文件超时怎么办?

**解决方案1: 使用断点续传**

```java
public String uploadLargeFile(File file) throws IOException {
    int chunkSize = 5 * 1024 * 1024; // 5MB
    FileInputStream fis = new FileInputStream(file);
    byte[] buffer = new byte[chunkSize];
    String fileUuid = null;
    
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        MultipartFile chunk = createChunk(buffer, bytesRead);
        
        FileUploadParam param = new FileUploadParam();
        param.setFile(chunk);
        param.setFileUuid(fileUuid);
        param.setUploadMode(bytesRead < chunkSize ? "total" : "append");
        
        String result = fileServicesClient.uploadFile(param);
        if (fileUuid == null) {
            fileUuid = result;
        }
    }
    
    fis.close();
    return fileUuid;
}
```

**解决方案2: 增加超时时间**

```java
@Configuration
public class HttpClientConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory();
        
        factory.setConnectTimeout(30000);  // 连接超时: 30秒
        factory.setReadTimeout(300000);    // 读取超时: 5分钟
        
        return new RestTemplate(factory);
    }
}
```

---

### Q6: 如何预览加密文件?

**步骤**:

1. 获取带签名的预览URL
2. 如果是严格加密,签名中需要包含encryptToken

```java
// 普通加密
public String previewEncryptedFile(String fileUuid) {
    String signature = fileServicesClient.getSignatureExt(
        Collections.singletonList(fileUuid),
        "visit",
        null,
        null
    );
    
    return String.format(
        "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
        fileUuid, signature
    );
}

// 严格加密
public String previewStrictlyEncryptedFile(String fileUuid, String encryptToken) {
    // 使用原生HTTP调用,传递encryptToken
    String signature = getSignatureWithEncryptToken(fileUuid, encryptToken);
    
    return String.format(
        "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
        fileUuid, signature
    );
}
```

---

### Q7: 批量下载时目录结构丢失?

**原因**: 上传时没有指定 `dir` 参数

**解决方案**:

```java
// 上传时指定目录
FileUploadParam param = new FileUploadParam();
param.setFile(file);
param.setDir("documents/2024/contracts");  // 指定目录结构

String fileUuid = fileServicesClient.uploadFile(param);
```

批量下载时会保留这个目录结构。

---

### Q8: 如何实现图片懒加载?

**前端实现**:

```html
<img 
  data-src="http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=xxx&signature=xxx&picParam=scale/50"
  class="lazy-load"
  alt="图片"
/>

<script>
// 懒加载实现
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
});
</script>
```

---

### Q9: 如何实现文件秒传?

**思路**: 上传前计算文件MD5,查询是否已存在相同文件

```java
@Service
public class FastUploadService {
    
    // 文件MD5 -> fileUuid映射
    private Map<String, String> md5Cache = new ConcurrentHashMap<>();
    
    /**
     * 秒传实现
     */
    public String fastUpload(MultipartFile file) throws IOException {
        // 1. 计算文件MD5
        String md5 = calculateMD5(file);
        
        // 2. 查询缓存
        if (md5Cache.containsKey(md5)) {
            String existingFileUuid = md5Cache.get(md5);
            
            // 3. 验证文件是否还存在
            try {
                fileServicesClient.getFileDetail(existingFileUuid);
                return existingFileUuid;  // 秒传成功
            } catch (Exception e) {
                // 文件已被删除,移除缓存
                md5Cache.remove(md5);
            }
        }
        
        // 4. 实际上传
        String fileUuid = fileServicesClient.upload(file);
        
        // 5. 缓存MD5
        md5Cache.put(md5, fileUuid);
        
        return fileUuid;
    }
    
    private String calculateMD5(MultipartFile file) throws IOException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(file.getBytes());
        return DatatypeConverter.printHexBinary(digest);
    }
}
```

---

### Q10: 如何实现文件访问权限控制?

**方案**: 使用签名机制控制访问权限

```java
@Service
public class FileAccessControl {
    
    /**
     * 为特定用户生成访问签名
     */
    public String generateUserSignature(String fileUuid, String userId) {
        // 调用后端接口生成签名
        String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignature";
        
        Map<String, String> params = new HashMap<>();
        params.put("fileUuid", fileUuid);
        params.put("staffId", userId);
        params.put("operate", "visit");
        
        String signature = httpGet(url, params);
        return signature;
    }
    
    /**
     * 验证用户是否有权限访问
     */
    public boolean canAccess(String fileUuid, String userId) {
        // 根据业务规则判断
        // 例如: 检查文件所有者、部门权限等
        return checkPermission(fileUuid, userId);
    }
    
    /**
     * 生成带权限控制的预览URL
     */
    public String getSecurePreviewUrl(String fileUuid, String userId) {
        // 1. 验证权限
        if (!canAccess(fileUuid, userId)) {
            throw new ForbiddenException("无权访问该文件");
        }
        
        // 2. 生成签名
        String signature = generateUserSignature(fileUuid, userId);
        
        // 3. 构建URL
        return String.format(
            "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
            fileUuid, signature
        );
    }
}
```

---

### Q11: 如何监控文件上传进度?

**前端实现**:

```javascript
function uploadWithProgress(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const xhr = new XMLHttpRequest();
  
  // 监听上传进度
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      console.log(`上传进度: ${percentComplete.toFixed(2)}%`);
      updateProgressBar(percentComplete);
    }
  });
  
  // 上传完成
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      console.log('上传成功:', result.data.uuid);
    }
  });
  
  // 发送请求
  xhr.open('POST', '/api/esb/hr-fileservices-load/fileUpload');
  xhr.send(formData);
}
```

---

### Q12: 如何处理并发上传?

**方案**: 使用线程池控制并发数

```java
@Service
public class ConcurrentUploadService {
    
    private final ExecutorService uploadExecutor = Executors.newFixedThreadPool(5);
    
    /**
     * 并发上传多个文件
     */
    public List<String> concurrentUpload(List<MultipartFile> files) {
        List<Future<String>> futures = new ArrayList<>();
        
        // 提交上传任务
        for (MultipartFile file : files) {
            Future<String> future = uploadExecutor.submit(() -> {
                return fileServicesClient.upload(file);
            });
            futures.add(future);
        }
        
        // 收集结果
        List<String> fileUuids = new ArrayList<>();
        for (Future<String> future : futures) {
            try {
                fileUuids.add(future.get());
            } catch (Exception e) {
                log.error("文件上传失败", e);
            }
        }
        
        return fileUuids;
    }
}
```

---

## 三、最佳实践

### 3.1 文件上传最佳实践

#### ✅ 推荐做法

1. **上传前校验**
```java
public String uploadWithValidation(MultipartFile file) {
    // 1. 校验文件不为空
    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException("文件不能为空");
    }
    
    // 2. 校验文件大小
    long maxSize = 100 * 1024 * 1024; // 100MB
    if (file.getSize() > maxSize) {
        throw new IllegalArgumentException("文件大小不能超过100MB");
    }
    
    // 3. 校验文件类型
    String ext = getFileExtension(file.getOriginalFilename());
    List<String> allowedTypes = Arrays.asList("pdf", "doc", "docx", "xls", "xlsx");
    if (!allowedTypes.contains(ext.toLowerCase())) {
        throw new IllegalArgumentException("不支持的文件类型");
    }
    
    // 4. 上传
    return fileServicesClient.upload(file);
}
```

2. **自动选择合适的上传方式**
```java
public String smartUpload(MultipartFile file) {
    long fileSize = file.getSize();
    
    // 大文件使用断点续传
    if (fileSize > 50 * 1024 * 1024) {
        return uploadWithChunks(file);
    }
    
    // Office文档自动转换
    String ext = getFileExtension(file.getOriginalFilename());
    if (Arrays.asList("doc", "docx", "xls", "xlsx", "ppt", "pptx").contains(ext)) {
        return fileServicesClient.uploadAndConvert(file);
    }
    
    // 普通上传
    return fileServicesClient.upload(file);
}
```

3. **添加业务标签**
```java
public String uploadWithTags(MultipartFile file, Map<String, String> businessTags) {
    // 1. 上传文件
    String fileUuid = fileServicesClient.upload(file);
    
    // 2. 添加业务标签
    Map<String, String> tags = new HashMap<>(businessTags);
    tags.put("uploadTime", LocalDateTime.now().toString());
    tags.put("uploader", getCurrentUserId());
    
    fileServicesClient.addTags(fileUuid, tags);
    
    return fileUuid;
}
```

#### ❌ 反模式

1. **不检查文件就上传**
```java
// ❌ 错误: 没有任何校验
public String badUpload(MultipartFile file) {
    return fileServicesClient.upload(file);
}
```

2. **同步等待转换太久**
```java
// ❌ 错误: 可能阻塞很长时间
public String badConvert(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadAndConvert(file);
    
    // 一直等待,没有超时控制
    while (!fileServicesClient.isFileConverted(fileUuid)) {
        Thread.sleep(1000);
    }
    
    return fileUuid;
}
```

3. **重复上传相同文件**
```java
// ❌ 错误: 没有去重机制
public List<String> badBatchUpload(List<MultipartFile> files) {
    return files.stream()
        .map(file -> fileServicesClient.upload(file))
        .collect(Collectors.toList());
}
```

---

### 3.2 文件下载最佳实践

#### ✅ 推荐做法

1. **流式下载大文件**
```java
public void streamDownload(String fileUuid, HttpServletResponse response) throws IOException {
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    File file = fileServicesClient.downloadFile("", fileUuid);
    
    response.setContentType("application/octet-stream");
    response.setContentLengthLong(detail.getFileSize());
    response.setHeader("Content-Disposition", 
        "attachment;filename=" + URLEncoder.encode(detail.getOriginalName(), "UTF-8"));
    
    try (FileInputStream fis = new FileInputStream(file);
         BufferedInputStream bis = new BufferedInputStream(fis);
         OutputStream os = response.getOutputStream()) {
        
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = bis.read(buffer)) != -1) {
            os.write(buffer, 0, bytesRead);
        }
        os.flush();
    } finally {
        file.delete();  // 删除临时文件
    }
}
```

2. **支持断点下载**
```java
public void rangeDownload(String fileUuid, HttpServletRequest request, 
                         HttpServletResponse response) throws IOException {
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    File file = fileServicesClient.downloadFile("", fileUuid);
    
    long fileLength = detail.getFileSize();
    long start = 0;
    long end = fileLength - 1;
    
    // 解析Range头
    String range = request.getHeader("Range");
    if (range != null && range.startsWith("bytes=")) {
        String[] ranges = range.substring(6).split("-");
        start = Long.parseLong(ranges[0]);
        if (ranges.length > 1) {
            end = Long.parseLong(ranges[1]);
        }
    }
    
    long contentLength = end - start + 1;
    
    response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
    response.setContentType("application/octet-stream");
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Content-Range", 
        String.format("bytes %d-%d/%d", start, end, fileLength));
    response.setContentLengthLong(contentLength);
    
    try (RandomAccessFile raf = new RandomAccessFile(file, "r");
         OutputStream os = response.getOutputStream()) {
        
        raf.seek(start);
        byte[] buffer = new byte[8192];
        long remaining = contentLength;
        
        while (remaining > 0) {
            int bytesToRead = (int) Math.min(buffer.length, remaining);
            int bytesRead = raf.read(buffer, 0, bytesToRead);
            if (bytesRead == -1) break;
            
            os.write(buffer, 0, bytesRead);
            remaining -= bytesRead;
        }
        os.flush();
    } finally {
        file.delete();
    }
}
```

---

### 3.3 性能优化建议

1. **使用连接池**
```java
@Configuration
public class HttpClientConfig {
    
    @Bean
    public PoolingHttpClientConnectionManager connectionManager() {
        PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        cm.setMaxTotal(200);  // 最大连接数
        cm.setDefaultMaxPerRoute(20);  // 每个路由的最大连接数
        return cm;
    }
}
```

2. **启用压缩**
```java
FileUploadParam param = new FileUploadParam();
param.setFile(file);

// 图片自动压缩
if (isImage(file)) {
    param.setPicParams("scale/80");
}

return fileServicesClient.uploadFile(param);
```

3. **缓存文件信息**
```java
@Cacheable(value = "fileDetails", key = "#fileUuid")
public FileDetail getFileDetailCached(String fileUuid) {
    return fileServicesClient.getFileDetail(fileUuid);
}
```

---

## 四、参考资料

### 4.1 相关文档

- [签名计算方式文档](http://tapd.oa.com/HR_Platform/markdown_wikis/view/#1020394402011174689)
- [图片处理参数文档](http://tapd.oa.com/HR_Platform/markdown_wikis/show/#1220394402001838723)
- [密钥模式说明文档](http://tapd.oa.com/HR_Platform/markdown_wikis/show/#1220394402001886483)
- [富文本对接文档](http://tapd.oa.com/HR_Platform/markdown_wikis/show/#1220394402002127771)
- [OSS网关接入指南](http://km.oa.com/group/17516/articles/show/306831)

### 4.2 代码仓库

- Demo示例代码: https://git.code.oa.com/hrplat-middletier/hr-tsf-demo/tree/master/fileserver-demo

---

## 五、技术支持

### 联系方式

- **接口人**: jeeliu(刘志杰)
- **管理端**: 
  - 测试: https://dev-ntsapps.woa.com/fileservices/
  - 生产: https://ntsapps.woa.com/fileservices/
  
### 权限申请

- **测试环境**: [权限中台申请](https://test-hrright.woa.com/apply/commonApplyNew/role?sysCode=hr-ms-fileservices&type=public)
- **生产环境**: [权限中台申请](https://hrright.woa.com/apply/commonApplyNew/role?sysCode=hr-ms-fileservices&type=public)

---

📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part3.md)
