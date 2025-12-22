# 附件中台服务开发指南 - 第三分卷

> 📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part2.md) | [下一分卷 →](./kb-file-services-part4.md)

---

## 高级功能(图片处理、富文本、第三方集成)

本分卷包含图片处理、富文本编辑、外网通过OSS网关访问、第三方集成等高级功能。

---

## 一、图片处理功能

### 1.1 图片处理规则格式

#### 标准格式

```
{type}/{type-arg}{/replace}/v{随机数}
```

**参数说明**:

| 部分 | 说明 |
|------|------|
| `type` | 处理规则名称(如`scale`、`rotate`) |
| `type-arg` | 处理规则相关参数 |
| `/replace` | 处理后是否替换原图片(可选),默认不替换 |
| `/v{随机数}` | 保证唯一性,用于幂等性校验,防止重复处理 |

#### 多条规则拼接

每条规则都只会对原始图片进行处理,可以通过 `&` 拼接多条规则:

```
scale/50&rotate/90/replace
```

上述示例表示:
1. 对原始图片压缩50%
2. 对原始图片顺时针旋转90度并替换原始文件

---

### 1.2 图片缩放 (scale)

#### 缩放比例

**按比例缩放**:
```
scale/{degree}
```
- `degree`: 1-100,表示缩放程度
- 示例: `scale/10` - 缩放至原始图片的10%

**按宽度缩放**:
```
scale/width/{degree}
```
- 示例: `scale/width/50` - 宽度缩放至50%,高度不变

**按高度缩放**:
```
scale/height/{degree}
```
- 示例: `scale/height/50` - 高度缩放至50%,宽度不变

**宽高同时缩放**:
```
scale/width/{degree1}/height/{degree2}
```
- 示例: `scale/width/50/height/50` - 宽高均缩放至50%

#### 限定像素大小

**限定宽度**:
```
scale/width/{num}/px
```
- 示例: `scale/width/200/px` - 限定宽度为200px,高度等比压缩

**限定高度**:
```
scale/height/{num}/px
```
- 示例: `scale/height/200/px` - 限定高度为200px,宽度等比压缩

**限定宽高最大值**:
```
scale/width/{num1}/height/{num2}/px
```
- 示例: `scale/width/200/height/200/px` - 宽高在压缩后不超过200px

---

### 1.3 图片旋转 (rotate)

```
rotate/{degree}
```

- `degree`: 0-360,表示顺时针旋转角度
- 示例: `rotate/90` - 顺时针旋转90度

---

### 1.4 图片处理接口 [POST]

#### 功能说明

用于对图片类文件进行处理,如缩放、旋转等。

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/dealPicture`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/dealPicture`

#### 请求方式

`POST`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 附件ID |
| `picParams` | String | ✅ | 图片处理参数,需要URLEncode编码 |
| `sync` | Boolean | ❌ | 是否同步处理,默认false |
| `signature` | String | SSO必填 | 前端访问需要携带,且signature的operate必须为`update` |

#### 响应参数

```json
{
  "code": 0,
  "success": true,
  "message": null
}
```

#### 示例代码

**Java**:

```java
@Autowired
private FileServicesClient fileServicesClient;

public void processImage(String fileUuid, String picParams) {
    fileServicesClient.dealPicture(fileUuid, picParams);
}

// 使用示例
// 压缩到50%
processImage("group1_M00/00/00/xxx.jpg", "scale/50");

// 旋转90度
processImage("group1_M00/00/00/xxx.jpg", "rotate/90");

// 限定宽度为800px
processImage("group1_M00/00/00/xxx.jpg", "scale/width/800/px");

// 多个规则: 压缩50% + 旋转90度并替换
processImage("group1_M00/00/00/xxx.jpg", "scale/50&rotate/90/replace");
```

**cURL**:

```bash
# 压缩图片到50%
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-load/dealPicture?fileUuid=xxx.jpg&picParams=scale%2F50"

# 旋转90度
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-load/dealPicture?fileUuid=xxx.jpg&picParams=rotate%2F90"
```

**Python**:

```python
import urllib.parse

def process_image(file_uuid, pic_params, sync=False):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/dealPicture"
    
    # URLEncode编码参数
    encoded_params = urllib.parse.quote(pic_params)
    
    params = {
        'fileUuid': file_uuid,
        'picParams': encoded_params,
        'sync': sync
    }
    
    response = requests.post(url, params=params)
    return response.json()

# 使用示例
# 压缩到50%
process_image("group1_M00/00/00/xxx.jpg", "scale/50")

# 限定宽高为800x600
process_image("group1_M00/00/00/xxx.jpg", "scale/width/800/height/600/px")

# 多规则: 压缩 + 旋转
process_image("group1_M00/00/00/xxx.jpg", "scale/50&rotate/90")
```

---

### 1.5 上传时处理图片

在上传接口中可以直接指定图片处理参数:

```java
public String uploadAndProcessImage(MultipartFile file) {
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    
    // 上传时直接压缩到50%
    param.setPicParams("scale/50");
    
    String fileUuid = fileServicesClient.uploadFile(param);
    return fileUuid;
}
```

**支持多条规则**:

```java
// 压缩 + 旋转
param.setPicParams("scale/50&rotate/90");
```

---

### 1.6 预览时处理图片

在预览接口中可以实时处理图片:

```java
// 预览压缩后的图片
String previewUrl = String.format(
    "http://ntsgw.oa.com/api/esb/hr-fileservices-view/viewOnline?fileUuid=%s&picParam=%s",
    fileUuid,
    URLEncoder.encode("scale/50", "UTF-8")
);
```

**注意**: 预览时的 `picParam` 只能是单个规则,不支持多规则拼接。

---

### 1.7 图片处理实战示例

#### 生成缩略图

```java
/**
 * 生成不同尺寸的缩略图
 */
public Map<String, String> generateThumbnails(String originalFileUuid) {
    Map<String, String> thumbnails = new HashMap<>();
    
    // 小缩略图: 100x100
    String smallThumb = processAndGetUrl(originalFileUuid, "scale/width/100/height/100/px");
    thumbnails.put("small", smallThumb);
    
    // 中缩略图: 300x300
    String mediumThumb = processAndGetUrl(originalFileUuid, "scale/width/300/height/300/px");
    thumbnails.put("medium", mediumThumb);
    
    // 大缩略图: 800x800
    String largeThumb = processAndGetUrl(originalFileUuid, "scale/width/800/height/800/px");
    thumbnails.put("large", largeThumb);
    
    return thumbnails;
}

private String processAndGetUrl(String fileUuid, String picParams) {
    // 1. 处理图片
    fileServicesClient.dealPicture(fileUuid, picParams);
    
    // 2. 获取共享访问URL
    List<ShareUrlInfo> urls = fileServicesClient.getShareViewUrls(
        Collections.singletonList(fileUuid)
    );
    
    return urls.get(0).getShareViewUrl();
}
```

#### 图片优化上传

```java
/**
 * 上传大图片时自动压缩
 */
public String uploadLargeImage(MultipartFile file) throws IOException {
    long fileSize = file.getSize();
    
    String picParams = null;
    
    // 如果文件 > 2MB,压缩到50%
    if (fileSize > 2 * 1024 * 1024) {
        picParams = "scale/50";
    }
    // 如果文件 > 5MB,压缩到30%
    else if (fileSize > 5 * 1024 * 1024) {
        picParams = "scale/30";
    }
    
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setPicParams(picParams);
    
    return fileServicesClient.uploadFile(param);
}
```

---

## 二、富文本功能

### 2.1 富文本特性说明

富文本类型的文件有以下限制:
- ❌ 不支持加密
- ❌ 不支持断点续传
- ❌ 不支持图片处理
- ✅ 仅提供后端访问接口

### 2.2 上传富文本

```java
public String uploadRichText(MultipartFile file) {
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setRichTxt(true);  // 标记为富文本
    
    String fileUuid = fileServicesClient.uploadFile(param);
    return fileUuid;
}
```

---

### 2.3 编辑富文本 [POST]

#### 接口地址

**后端调用**: `/api/esb/hr-fileservices-load/richTxt/edit`

#### 请求方式

`POST` (multipart/form-data)

#### 请求体

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `file` | MultipartFile | ✅ | 替换文件 |
| `fileUuid` | String | ✅ | 文件ID |

#### 响应参数

```json
{
  "success": true,
  "code": 0,
  "message": null,
  "data": null
}
```

#### 示例代码

**Java (SDK)**:

```java
public void editRichText(String fileUuid, MultipartFile newContent) {
    fileServicesClient.editRichTxt(fileUuid, newContent);
}
```

**Java (原生)**:

```java
public void editRichText(String fileUuid, File newFile) throws IOException {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/richTxt/edit";
    
    MultipartEntityBuilder builder = MultipartEntityBuilder.create();
    builder.addTextBody("fileUuid", fileUuid);
    builder.addBinaryBody("file", newFile, ContentType.DEFAULT_BINARY, newFile.getName());
    
    HttpPost httpPost = new HttpPost(url);
    httpPost.setEntity(builder.build());
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
        String result = EntityUtils.toString(response.getEntity());
        System.out.println("编辑结果: " + result);
    }
}
```

---

### 2.4 查询富文本更新历史 [GET]

#### 接口地址

**后端调用**: `/api/esb/hr-fileservices-load/richTxt/queryHistories`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件ID |

#### 响应参数

```json
{
  "success": true,
  "code": 0,
  "message": null,
  "data": [
    {
      "updateId": "1234567890",
      "updateDate": "2020-11-21 11:11:11"
    },
    {
      "updateId": "0987654321",
      "updateDate": "2020-11-22 15:30:00"
    }
  ]
}
```

#### 示例代码

**Java (SDK)**:

```java
public List<UpdateHistory> queryHistories(String fileUuid) {
    List<UpdateHistory> histories = fileServicesClient.queryHistories(fileUuid);
    
    for (UpdateHistory history : histories) {
        System.out.println("更新ID: " + history.getUpdateId());
        System.out.println("更新时间: " + history.getUpdateDate());
    }
    
    return histories;
}
```

---

### 2.5 获取历史富文本内容 [GET]

#### 接口地址

**后端调用**: `/api/esb/hr-fileservices-load/richTxt/queryContentByUpdateId`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件ID |
| `updateId` | String | ✅ | 更新ID |

#### 响应参数

```json
{
  "success": true,
  "code": 0,
  "message": null,
  "data": "AULJLJLLBFEDMNHFADF=="  // Base64编码的文件内容
}
```

#### 示例代码

**Java (SDK)**:

```java
public String queryRichTxtContent(String fileUuid, String updateId) {
    String base64Content = fileServicesClient.queryRichTxtContent(fileUuid, updateId);
    
    // 解码Base64
    byte[] decodedBytes = Base64.getDecoder().decode(base64Content);
    String content = new String(decodedBytes, StandardCharsets.UTF_8);
    
    return content;
}
```

**Python**:

```python
import base64

def query_rich_text_content(file_uuid, update_id):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/richTxt/queryContentByUpdateId"
    params = {
        'fileUuid': file_uuid,
        'updateId': update_id
    }
    
    response = requests.get(url, params=params)
    base64_content = response.json()['data']
    
    # 解码Base64
    content = base64.b64decode(base64_content).decode('utf-8')
    return content
```

---

### 2.6 富文本完整使用流程

```java
@Service
public class RichTextService {
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    /**
     * 创建富文本
     */
    public String createRichText(String htmlContent) {
        // 1. 将HTML内容转为文件
        MultipartFile file = convertToMultipartFile(htmlContent);
        
        // 2. 上传富文本
        FileUploadParam param = new FileUploadParam();
        param.setFile(file);
        param.setRichTxt(true);
        
        return fileServicesClient.uploadFile(param);
    }
    
    /**
     * 编辑富文本
     */
    public void updateRichText(String fileUuid, String newHtmlContent) {
        MultipartFile file = convertToMultipartFile(newHtmlContent);
        fileServicesClient.editRichTxt(fileUuid, file);
    }
    
    /**
     * 查看富文本历史版本
     */
    public List<RichTextVersion> getRichTextVersions(String fileUuid) {
        List<UpdateHistory> histories = fileServicesClient.queryHistories(fileUuid);
        
        return histories.stream()
            .map(h -> new RichTextVersion(h.getUpdateId(), h.getUpdateDate()))
            .collect(Collectors.toList());
    }
    
    /**
     * 恢复到历史版本
     */
    public void revertToVersion(String fileUuid, String updateId) {
        // 1. 获取历史内容
        String content = fileServicesClient.queryRichTxtContent(fileUuid, updateId);
        
        // 2. 解码Base64
        byte[] decodedBytes = Base64.getDecoder().decode(content);
        String htmlContent = new String(decodedBytes, StandardCharsets.UTF_8);
        
        // 3. 更新为历史内容
        updateRichText(fileUuid, htmlContent);
    }
    
    private MultipartFile convertToMultipartFile(String content) {
        // 实现将字符串转为MultipartFile
        // ...省略实现
        return file;
    }
}
```

---

## 三、外网通过OSS网关访问

### 3.1 使用场景

IDC区域的业务系统需要访问OA区的"统一附件服务"时,可以通过OSS网关进行附件上传、下载、删除、预览等操作。

### 3.2 OSS网关地址

```
http://oss-esb.sdc.tencent.com
```

### 3.3 接入步骤

#### 步骤1: 申请OSS网关权限

参考文档: [OSS网关接入指南](http://km.oa.com/group/17516/articles/show/306831)

#### 步骤2: 配置访问路径

将原来的OA内网域名替换为OSS网关地址:

**替换前** (OA内网):
```
http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileUpload
```

**替换后** (OSS网关):
```
http://oss-esb.sdc.tencent.com/api/esb/hr-fileservices-load/fileUpload
```

#### 步骤3: 调用接口

调用方式与OA内网完全相同,只需替换域名即可。

### 3.4 静态资源重定向处理

针对静态资源类(如ZIP打包的Excel转换后文件、HTML、CSS等)附件预览,需要进行返回路径的重定向处理。

**处理流程**:

1. IDC业务系统调用OSS网关预览接口
2. OSS网关转发请求到OA附件服务
3. OA附件服务返回静态资源URL
4. OSS网关将URL中的OA域名替换为OSS域名
5. 返回给IDC业务系统

**代码示例** (Java):

```java
public String previewFileViaOSS(String fileUuid) {
    String ossGatewayUrl = "http://oss-esb.sdc.tencent.com/api/esb/hr-fileservices-view/viewOnline";
    String previewUrl = ossGatewayUrl + "?fileUuid=" + fileUuid;
    
    // OSS网关会自动处理路径重定向
    return previewUrl;
}
```

### 3.5 完整示例

**上传文件**:

```java
public String uploadFileViaOSS(MultipartFile file) {
    String url = "http://oss-esb.sdc.tencent.com/api/esb/hr-fileservices-load/fileUpload";
    
    // 构建multipart请求
    MultipartEntityBuilder builder = MultipartEntityBuilder.create();
    builder.addBinaryBody("file", file.getInputStream(), 
        ContentType.DEFAULT_BINARY, file.getOriginalFilename());
    
    HttpPost httpPost = new HttpPost(url);
    httpPost.setEntity(builder.build());
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
        String result = EntityUtils.toString(response.getEntity());
        JSONObject json = JSON.parseObject(result);
        return json.getJSONObject("data").getString("uuid");
    }
}
```

**下载文件**:

```java
public void downloadFileViaOSS(String fileUuid, String savePath) throws IOException {
    String url = "http://oss-esb.sdc.tencent.com/api/esb/hr-fileservices-load/httpDownload?fileUuid=" + fileUuid;
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpGet httpGet = new HttpGet(url);
    
    try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
        HttpEntity entity = response.getEntity();
        try (FileOutputStream fos = new FileOutputStream(savePath)) {
            entity.writeTo(fos);
        }
    }
}
```

---

## 四、第三方预览集成

### 4.1 腾讯文档预览

#### 4.1.1 注册腾讯文档管理员 [POST]

**功能说明**: 授权应用使用腾讯文档预览能力,需要先注册管理员。

**接口地址**:
- 测试环境: `http://demo.ntsgw.oa.com/api/sso/hr-fileservices-thirdpart/docqq/registerManager`
- 生产环境: `http://v2.ntsgw.oa.com/api/sso/hr-fileservices-thirdpart/docqq/registerManager`

**请求方式**: `POST`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `signature` | String | ✅ | 身份签名,operate必须为`docsqqmanager` |

**响应**: 跳转到腾讯文档授权地址

#### 4.1.2 上传时指定腾讯文档预览

```java
public String uploadWithDocQQPreview(MultipartFile file) {
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setThirdpartViewMode("docqq");  // 指定使用腾讯文档预览
    
    return fileServicesClient.uploadFile(param);
}
```

#### 4.1.3 授权用户访问第三方预览 [GET]

**接口地址**: `http://域名/api/esb/hr-fileservices-view/auth/thirdpartViewUrl?fileUuid={uuid}&staffname={staffname}`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 原始文件ID |
| `staffname` | String | ✅ | 访问者名称(如ponyma) |

**响应参数**:

```json
{
  "success": true,
  "data": "http://xx.oa.xx/"
}
```

**示例代码**:

```java
public String getThirdpartPreviewUrl(String fileUuid, String staffName) {
    String url = String.format(
        "http://ntsgw.oa.com/api/esb/hr-fileservices-view/auth/thirdpartViewUrl?fileUuid=%s&staffname=%s",
        fileUuid, staffName
    );
    
    String response = httpGet(url);
    JSONObject json = JSON.parseObject(response);
    
    return json.getString("data");
}
```

---

## 五、加密存储详解

### 5.1 加密模式对比

| 模式 | 密钥管理 | 存储位置 | 安全级别 | 适用场景 |
|------|----------|----------|----------|----------|
| `normal` | 系统自动生成 | KMS服务 | ⭐⭐⭐ | 一般保密文件 |
| ~~`privately`~~ | ~~系统自动生成~~ | ~~FastDFS~~ | ~~⭐⭐~~ | ~~已废弃~~ |
| `strictly` | 业务系统提供 | 不落盘 | ⭐⭐⭐⭐⭐ | 薪酬等极高保密文件 |

### 5.2 普通加密 (normal)

#### 上传加密文件

```java
public String uploadEncryptedFile(MultipartFile file) {
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setEncryptMode("normal");  // 普通加密模式
    
    return fileServicesClient.uploadFile(param);
}
```

#### SDK方法

```java
// 使用SDK提供的便捷方法
String fileUuid = fileServicesClient.uploadEncrypt(file, "normal");
```

---

### 5.3 严格加密 (strictly)

#### 5.3.1 上传流程

**步骤1: 业务系统向KMS申请密钥Token**

```java
// 需要先从KMS系统获取encryptToken
String encryptToken = kmsClient.generateToken();
```

**步骤2: 上传时传递encryptToken**

```java
public String uploadStrictlyEncryptedFile(MultipartFile file, String encryptToken) {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/v2/fileUpload";
    
    // 在请求头中传递encryptToken
    Map<String, String> headers = new HashMap<>();
    headers.put("hrfile-encrypt-token", encryptToken);
    
    // 构建请求
    MultipartEntityBuilder builder = MultipartEntityBuilder.create();
    builder.addBinaryBody("file", file.getInputStream(), 
        ContentType.DEFAULT_BINARY, file.getOriginalFilename());
    builder.addTextBody("encryptMode", "strictly");
    
    // 发送请求(需要带上自定义请求头)
    return uploadWithHeaders(url, builder.build(), headers);
}
```

#### 5.3.2 预览/下载流程

**步骤1: 获取签名时传递encryptToken**

```java
public String getSignatureForStrictlyEncrypted(String fileUuid, String encryptToken) {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignatureExt";
    
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("fileUuids", Collections.singletonList(fileUuid));
    requestBody.put("operate", "visit");
    requestBody.put("encryptToken", encryptToken);  // 传递密钥Token
    
    String json = new ObjectMapper().writeValueAsString(requestBody);
    return httpPost(url, json);
}
```

**步骤2: 使用签名访问文件**

```java
String signature = getSignatureForStrictlyEncrypted(fileUuid, encryptToken);

String previewUrl = String.format(
    "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
    fileUuid, signature
);
```

#### 5.3.3 重要说明

> ⚠️ **严格加密安全保证**:
> - 附件系统不会以任何形式落盘密钥
> - 密钥仅在内存中临时存储用于加解密
> - 需要KMS SDK版本 ≥ 2.2.3

#### 5.3.4 完整示例

```java
@Service
public class SecureFileService {
    
    @Autowired
    private KmsClient kmsClient;
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    /**
     * 上传高保密文件(薪酬证明等)
     */
    public String uploadSecureFile(MultipartFile file) {
        // 1. 向KMS申请密钥Token
        String encryptToken = kmsClient.generateToken();
        
        // 2. 上传加密文件
        String fileUuid = uploadStrictlyEncrypted(file, encryptToken);
        
        // 3. 保存encryptToken到业务系统(用于后续预览/下载)
        saveEncryptToken(fileUuid, encryptToken);
        
        return fileUuid;
    }
    
    /**
     * 预览高保密文件
     */
    public String getSecureFilePreviewUrl(String fileUuid, String userId) {
        // 1. 从业务系统获取encryptToken
        String encryptToken = getEncryptToken(fileUuid);
        
        // 2. 获取签名
        String signature = getSignatureWithEncryptToken(fileUuid, encryptToken, userId);
        
        // 3. 构建预览URL
        return String.format(
            "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
            fileUuid, signature
        );
    }
}
```

---

## 六、性能优化建议

### 6.1 图片优化

#### 自动压缩大图片

```java
public String uploadImageWithAutoCompress(MultipartFile file) throws IOException {
    long fileSize = file.getSize();
    String picParams = null;
    
    // 根据文件大小自动选择压缩比例
    if (fileSize > 10 * 1024 * 1024) {
        picParams = "scale/20";  // >10MB,压缩到20%
    } else if (fileSize > 5 * 1024 * 1024) {
        picParams = "scale/40";  // >5MB,压缩到40%
    } else if (fileSize > 2 * 1024 * 1024) {
        picParams = "scale/60";  // >2MB,压缩到60%
    }
    
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setPicParams(picParams);
    
    return fileServicesClient.uploadFile(param);
}
```

### 6.2 并发控制

```java
@Configuration
public class FileUploadConfig {
    
    @Bean
    public ThreadPoolExecutor fileUploadExecutor() {
        return new ThreadPoolExecutor(
            5,      // 核心线程数
            10,     // 最大线程数
            60,     // 空闲线程存活时间
            TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(100)  // 队列大小
        );
    }
}
```

### 6.3 缓存签名

```java
@Service
public class SignatureCache {
    
    private final LoadingCache<String, String> cache = CacheBuilder.newBuilder()
        .expireAfterWrite(25, TimeUnit.MINUTES)  // 签名有效期30分钟,提前5分钟失效
        .build(new CacheLoader<String, String>() {
            @Override
            public String load(String fileUuid) {
                return generateSignature(fileUuid);
            }
        });
    
    public String getSignature(String fileUuid) {
        return cache.getUnchecked(fileUuid);
    }
}
```

---

📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part2.md) | [下一分卷 →](./kb-file-services-part4.md)
