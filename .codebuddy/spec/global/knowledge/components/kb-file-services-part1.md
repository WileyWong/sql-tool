# 附件中台服务开发指南 - 第一分卷

> 📖 [返回主文档](./kb-file-services.md) | [下一分卷 →](./kb-file-services-part2.md)

---

## 文件上传、下载、删除接口

本分卷包含附件服务最核心的文件操作接口,涵盖文件的上传、下载和删除功能。

---

## 一、文件上传接口

### 1.1 基础文件上传 [POST]

#### 接口地址

- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/fileUpload`
- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/fileUpload`

#### 请求方式

`POST` (Multipart/form-data)

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `file` | MultipartFile | ✅ | 上传的文件对象 |
| `fileUuid` | String | ❌ | 文件唯一主键,用于实现断点续传 |
| `shared` | Boolean | ❌ | 是否为共享文件,多个应用间可访问 |
| `isAppend` | Boolean | ❌ | 是否续传模式,开始续传设置为true,结束或非续传设置为false |
| `encryptMode` | String | ❌ | 加密模式: `privately`/`normal`/`strictly`,默认不加密 |
| `convert` | Boolean | ❌ | 上传后是否转换为预览文件,默认false |
| `signature` | String | SSO必填 | 签名认证(SSO模式必填,ESB模式不需要) |
| `picParams` | String | ❌ | 图片处理参数,需要UrlEncode编码 |
| `dir` | String | ❌ | 文件目录结构,用于批量下载时保留目录,示例: `aa/bb` |
| `storeType` | String | ❌ | `extranet`或`intranet`,默认`intranet` |
| `richTxt` | Boolean | ❌ | 是否为富文本,富文本不支持加密/续传/图片处理 |

> ⚠️ **重要提示**:
> - 断点续传每个分片需要 **≥ 5MB**
> - 参数 `fileOffset` 已废弃,不再生效
> - 参数 `encrypt` 已废弃,请使用 `encryptMode`

#### 响应参数

**上传成功**:
```json
{
  "code": 102,
  "success": true,
  "message": "该文件上传完成",
  "data": {
    "uuid": "group1_M00/00/00/Cgxbel2xVRuABdIcAF-3psSc29w606.pdf",
    "partUploadId": "16101111383fa445d7f248e4b05fa7610c04b4bc52fff0a559277be822de25a6a4b17df4b1"
  }
}
```

**上传失败**:
```json
{
  "code": 103,
  "success": false,
  "message": "该文件上传失败",
  "data": null
}
```

**上传空文件**:
```json
{
  "code": 104,
  "success": false,
  "message": "该文件内容不存在",
  "data": null
}
```

#### 示例代码

**Java (Postman模拟)**:

```bash
# 请求URL
POST http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileUpload

# 请求头
Content-Type: multipart/form-data

# 请求体 (form-data)
file: [选择文件]
convert: true
shared: false
```

**Java (SDK)**:

```java
@Autowired
private FileServicesClient fileServicesClient;

public String uploadFile(MultipartFile file) {
    // 基础上传
    String fileUuid = fileServicesClient.upload(file);
    return fileUuid;
}

// 上传并转换
public String uploadAndConvert(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadAndConvert(file);
    return fileUuid;
}

// 上传加密文件
public String uploadEncrypt(MultipartFile file) {
    String fileUuid = fileServicesClient.uploadEncrypt(file, "normal");
    return fileUuid;
}
```

**cURL**:

```bash
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileUpload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.pdf" \
  -F "convert=true" \
  -F "shared=false"
```

---

### 1.2 文件上传V2 [POST]

V2接口是对文件上传接口的改进,方便后续扩展更多功能。

#### 接口地址

- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/v2/fileUpload`
- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/v2/fileUpload`

#### 请求方式

`POST` (Multipart/form-data)

#### 请求头

| 请求头 | 说明 |
|--------|------|
| `tenantid` (内网) | 租户ID |
| `caagw-corpkey` (外网) | 租户key |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `file` | MultipartFile | ✅ | 上传的文件 |
| `fileUuid` | String | ❌ | 断点续传时的文件ID |
| `uploadMode` | String | ❌ | `total`(默认)或`append`,续传过程设为`append`,结束时设为`total` |
| `encryptMode` | String | ❌ | 加密模式: `privately`/`normal`/`strictly` |
| `convert` | Boolean | ❌ | 是否转换为可预览文件 |
| `thirdpartViewMode` | String | ❌ | 第三方预览模式,支持`docqq`(腾讯文档) |
| `shared` | Boolean | ❌ | 是否所有人可共享 |
| `picParams` | String | ❌ | 图片处理参数,UrlEncode编码,多条规则用`&`拼接 |
| `dir` | String | ❌ | 文件目录结构 |
| `storeType` | String | ❌ | `extranet`或`intranet` |
| `richTxt` | Boolean | ❌ | 是否为富文本 |
| `signature` | String | SSO必填 | 签名认证 |

#### 响应参数

与基础上传接口相同。

#### 示例代码

**Java**:

```java
public String uploadFileV2(MultipartFile file) {
    // 使用V2接口上传
    FileUploadParam param = new FileUploadParam();
    param.setFile(file);
    param.setConvert(true);
    param.setEncryptMode("normal");
    param.setUploadMode("total");
    
    String fileUuid = fileServicesClient.uploadFile(param);
    return fileUuid;
}
```

**断点续传示例**:

```java
public String uploadLargeFile(MultipartFile file) throws IOException {
    String fileUuid = null;
    int chunkSize = 5 * 1024 * 1024; // 5MB
    InputStream inputStream = file.getInputStream();
    byte[] buffer = new byte[chunkSize];
    int bytesRead;
    boolean isFirst = true;
    
    while ((bytesRead = inputStream.read(buffer)) != -1) {
        MultipartFile chunk = createChunk(buffer, bytesRead);
        
        FileUploadParam param = new FileUploadParam();
        param.setFile(chunk);
        param.setFileUuid(fileUuid);
        
        if (isFirst) {
            param.setUploadMode("append"); // 开始续传
            isFirst = false;
        } else if (bytesRead < chunkSize) {
            param.setUploadMode("total"); // 最后一片,结束续传
        } else {
            param.setUploadMode("append"); // 中间片,继续续传
        }
        
        String result = fileServicesClient.uploadFile(param);
        if (fileUuid == null) {
            fileUuid = result;
        }
    }
    
    return fileUuid;
}
```

---

## 二、文件下载接口

### 2.1 HTTP下载 [GET]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/httpDownload?fileUuid={uuid}&signature={signature}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/httpDownload?fileUuid={uuid}`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件唯一标识 |
| `signature` | String | SSO必填 | 签名认证 |

#### 请求头

| 请求头 | 说明 |
|--------|------|
| `Range` | 实现分片下载,格式: `bytes=0-10` (从0开始下载10个字节) |

#### 响应头

| 响应头 | 说明 |
|--------|------|
| `Accept-Ranges` | 值为`bytes` |
| `Content-Type` | `application/octet-stream` (字节流) |
| `Content-Length` | 响应长度 |
| `Content-Disposition` | `attachment;filename=xxx` (指定下载文件名) |
| `Content-Range` | `bytes xx-xx` (响应文本范围) |
| `Status` | `206` (部分下载) |

#### 示例代码

**Java (SDK)**:

```java
@Autowired
private FileServicesClient fileServicesClient;

public File downloadFile(String fileUuid) {
    // 下载到临时文件
    File file = fileServicesClient.downloadFile("", fileUuid);
    return file;
}
```

**Java (原生HttpClient)**:

```java
public void downloadFile(String fileUuid, String savePath) throws IOException {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/httpDownload?fileUuid=" + fileUuid;
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpGet httpGet = new HttpGet(url);
    
    try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            try (FileOutputStream fos = new FileOutputStream(savePath)) {
                entity.writeTo(fos);
            }
        }
    }
}
```

**cURL**:

```bash
# 下载完整文件
curl -o downloaded.pdf "http://ntsgw.oa.com/api/esb/hr-fileservices-load/httpDownload?fileUuid=group1_M00/00/00/xxx.pdf"

# 分片下载 (Range方式)
curl -H "Range: bytes=0-1048576" \
  -o part1.pdf \
  "http://ntsgw.oa.com/api/esb/hr-fileservices-load/httpDownload?fileUuid=xxx"
```

**Python**:

```python
import requests

def download_file(file_uuid, save_path):
    url = f"http://ntsgw.oa.com/api/esb/hr-fileservices-load/httpDownload"
    params = {'fileUuid': file_uuid}
    
    response = requests.get(url, params=params, stream=True)
    
    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"文件已下载到: {save_path}")

# 使用
download_file("group1_M00/00/00/xxx.pdf", "./downloaded.pdf")
```

**JavaScript (Node.js)**:

```javascript
const axios = require('axios');
const fs = require('fs');

async function downloadFile(fileUuid, savePath) {
  const url = `http://ntsgw.oa.com/api/esb/hr-fileservices-load/httpDownload`;
  
  const response = await axios({
    method: 'get',
    url: url,
    params: { fileUuid: fileUuid },
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(savePath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// 使用
downloadFile('group1_M00/00/00/xxx.pdf', './downloaded.pdf')
  .then(() => console.log('下载完成'))
  .catch(err => console.error('下载失败', err));
```

---

### 2.2 批量下载 [GET/POST]

#### 功能说明

将多个文件打包成ZIP文件进行下载,支持保留文件目录结构。

**目录结构示例**:
如果signature中指定了两个文件a和b,上传时指定dir分别是A和B,则下载的zip文件中目录结构为:
```
压缩包.zip
├── A/
│   └── a.pdf
└── B/
    └── b.pdf
```

#### 前端SSO调用 [GET]

**接口地址**: `http://域名/api/sso/hr-fileservices-load/batchHttpDownload?signature={xx}&compressName={test}`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `signature` | String | ✅ | 签名(从signature中获取所有授权的文件) |
| `compressName` | String | ❌ | 压缩包名称,默认为时间戳字符串 |

#### 后端ESB调用 [POST]

**接口地址**: `http://域名/api/esb/hr-fileservices-load/batchDownload`

**请求体**:

```json
{
  "compressName": "test",
  "fileUuids": [
    "group2_M00/00/00/Cgxbel6ZZ_-IIE1DAA-Yo-q1zQsAAAAGgNvazwAD5i7870.pdf",
    "group1_M00/02/1D/Cgxbel6ZR3WIELxtAAYtraoyI4UAAAAnQPvBJoABi3F013.pdf"
  ]
}
```

#### 响应头

| 响应头 | 说明 |
|--------|------|
| `Accept-Ranges` | `bytes` |
| `Content-Type` | `application/octet-stream` |
| `Content-Length` | 响应长度(后端下载需要根据此参数判断结束) |
| `Content-Disposition` | `attachment;filename=xxx` |
| `Status` | `206` |
| `Content-Range` | `bytes xx-xx` |

#### 示例代码

**Java (SDK)**:

```java
public File batchDownload(List<String> fileUuids, String compressName) {
    File zipFile = fileServicesClient.downloadBatchFile(fileUuids, compressName);
    return zipFile;
}
```

**Java (原生HttpClient)**:

```java
public void batchDownload(List<String> fileUuids, String savePath) throws IOException {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/batchDownload";
    
    // 构建请求体
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("compressName", "batch_files");
    requestBody.put("fileUuids", fileUuids);
    
    String json = new ObjectMapper().writeValueAsString(requestBody);
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpPost httpPost = new HttpPost(url);
    httpPost.setHeader("Content-Type", "application/json");
    httpPost.setEntity(new StringEntity(json, "UTF-8"));
    
    try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            try (FileOutputStream fos = new FileOutputStream(savePath)) {
                entity.writeTo(fos);
            }
        }
    }
}
```

**cURL**:

```bash
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-load/batchDownload" \
  -H "Content-Type: application/json" \
  -d '{
    "compressName": "batch_files",
    "fileUuids": [
      "group1_M00/00/00/xxx.pdf",
      "group1_M00/00/01/yyy.docx"
    ]
  }' \
  -o batch_files.zip
```

**Python**:

```python
import requests

def batch_download(file_uuids, save_path, compress_name="batch_files"):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/batchDownload"
    
    payload = {
        "compressName": compress_name,
        "fileUuids": file_uuids
    }
    
    response = requests.post(url, json=payload, stream=True)
    
    with open(save_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"批量下载完成: {save_path}")

# 使用
file_list = [
    "group1_M00/00/00/xxx.pdf",
    "group1_M00/00/01/yyy.docx"
]
batch_download(file_list, "./batch_files.zip")
```

---

### 2.3 异步批量下载 [POST]

#### 功能说明

与同步批量下载不同,异步批量下载适用于大量文件或大文件的场景,避免长时间等待。

**流程**:
1. 调用异步批量下载接口,获取 `batchFileId`
2. 轮询查询下载进度
3. 下载完成后,获取访问链接进行下载

#### 接口地址

**提交下载任务**: `http://域名/api/esb/hr-fileservices-load/asyncBatchDownload`

#### 请求体

```json
{
  "compressName": "test",
  "encrypt": true,  // 压缩文档是否加密
  "infos": [
    {
      "fileUuid": "in_nts-servicemarket/KSsOu4KGkJXsv2EKtAfgBg"
    },
    {
      "fileUuid": "in_nts-servicemarket/1575068096182493184.pdf",
      "name": "test"  // 指定文档名称,为空则取上传时的名称
    }
  ]
}
```

#### 响应参数

```json
{
  "success": true,
  "data": {
    "batchFileId": "1575441055996940288"  // 用于查询进度和获取下载地址
  },
  "message": null,
  "code": 0
}
```

#### 查询下载进度

**接口地址**: `http://域名/api/esb/hr-fileservices-load/asyncBatchDownloadProgress`

**请求体**:

```json
{
  "batchFileUuids": ["1580033163743338496", "1580029307328274432"]
}
```

**响应参数**:

```json
{
  "success": true,
  "data": [
    {
      "batchFileId": "1575409082830036992",
      "status": "success"  // init(接受), dealing(处理中), success(成功), fail(失败)
    },
    {
      "batchFileId": "1580033163743338496",
      "status": "dealing"
    }
  ],
  "message": null,
  "code": 0
}
```

#### 获取下载链接

**接口地址**: `http://域名/api/esb/hr-fileservices-load/batchFileVisitUrl?batchFileId={xx}`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `batchFileId` | String | ✅ | 异步批量下载返回的ID |

**响应参数**:

```json
{
  "success": true,
  "data": {
    "shareViewUrl": "http://s3rp-vpc-oa-test-1258638997.cos.ap-guangzhou.myqcloud.com/xxx.zip?sign=xxx",
    "encryptKey": "kh+fBztPRkp99X8TDYDyMxEZGT6cC8LL7S1o3411AHI="  // 解密密钥(如果请求时encrypt=true)
  },
  "message": null,
  "code": 0
}
```

#### 完整示例代码

**Java**:

```java
public String asyncBatchDownload(List<FileInfo> infos, String compressName, boolean encrypt) {
    // 1. 提交下载任务
    Map<String, Object> request = new HashMap<>();
    request.put("compressName", compressName);
    request.put("encrypt", encrypt);
    request.put("infos", infos);
    
    String response = httpPost("/asyncBatchDownload", request);
    String batchFileId = extractBatchFileId(response);
    
    // 2. 轮询查询进度
    while (true) {
        String status = checkProgress(batchFileId);
        if ("success".equals(status)) {
            break;
        } else if ("fail".equals(status)) {
            throw new RuntimeException("下载任务失败");
        }
        Thread.sleep(2000); // 等待2秒
    }
    
    // 3. 获取下载链接
    String downloadUrl = getDownloadUrl(batchFileId);
    return downloadUrl;
}
```

**Python**:

```python
import requests
import time

def async_batch_download(file_infos, compress_name="batch", encrypt=False):
    base_url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load"
    
    # 1. 提交下载任务
    payload = {
        "compressName": compress_name,
        "encrypt": encrypt,
        "infos": file_infos
    }
    
    response = requests.post(f"{base_url}/asyncBatchDownload", json=payload)
    batch_file_id = response.json()['data']['batchFileId']
    print(f"任务ID: {batch_file_id}")
    
    # 2. 轮询查询进度
    while True:
        progress_response = requests.post(
            f"{base_url}/asyncBatchDownloadProgress",
            json={"batchFileUuids": [batch_file_id]}
        )
        
        status = progress_response.json()['data'][0]['status']
        print(f"当前状态: {status}")
        
        if status == "success":
            break
        elif status == "fail":
            raise Exception("下载任务失败")
        
        time.sleep(2)
    
    # 3. 获取下载链接
    url_response = requests.get(
        f"{base_url}/batchFileVisitUrl",
        params={"batchFileId": batch_file_id}
    )
    
    result = url_response.json()['data']
    print(f"下载链接: {result['shareViewUrl']}")
    if 'encryptKey' in result:
        print(f"解密密钥: {result['encryptKey']}")
    
    return result

# 使用示例
file_infos = [
    {"fileUuid": "group1_M00/00/00/xxx.pdf"},
    {"fileUuid": "group1_M00/00/01/yyy.docx", "name": "custom_name.docx"}
]

result = async_batch_download(file_infos, "my_files", encrypt=True)
```

---

## 三、文件删除接口

### 3.1 删除文件 [DELETE]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/fileDelete?fileUuid={uuid}&signature={xx}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/fileDelete?fileUuid={uuid}`

#### 请求方式

`DELETE`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件唯一标识 |
| `signature` | String | SSO必填 | 签名认证 |

#### 响应参数

**删除成功**:
```json
{
  "code": 301,
  "success": true,
  "message": "目标文件已经成功删除",
  "data": {
    "uuid": "group1_M00/00/00/Cgxbel2xVRuABdIcAF-3psSc29w606.pdf"
  }
}
```

**删除失败**:
```json
{
  "code": 302,
  "success": false,
  "message": "目标文件删除失败",
  "data": null
}
```

**文件不存在**:
```json
{
  "code": 303,
  "success": true,
  "message": "目标文件不存在",
  "data": null
}
```

#### 示例代码

**Java (SDK)**:

```java
@Autowired
private FileServicesClient fileServicesClient;

public void deleteFile(String fileUuid) {
    // SDK版本 2.0.5-SNAPSHOT 及以上支持删除接口
    fileServicesClient.deleteFile(fileUuid);
}
```

**cURL**:

```bash
curl -X DELETE "http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileDelete?fileUuid=group1_M00/00/00/xxx.pdf"
```

**Python**:

```python
import requests

def delete_file(file_uuid):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileDelete"
    params = {'fileUuid': file_uuid}
    
    response = requests.delete(url, params=params)
    result = response.json()
    
    if result['success']:
        print(f"文件删除成功: {file_uuid}")
    else:
        print(f"文件删除失败: {result['message']}")
    
    return result

# 使用
delete_file("group1_M00/00/00/xxx.pdf")
```

**JavaScript (Node.js)**:

```javascript
const axios = require('axios');

async function deleteFile(fileUuid) {
  try {
    const response = await axios.delete(
      'http://ntsgw.oa.com/api/esb/hr-fileservices-load/fileDelete',
      { params: { fileUuid: fileUuid } }
    );
    
    if (response.data.success) {
      console.log('文件删除成功:', fileUuid);
    } else {
      console.log('文件删除失败:', response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('删除文件时出错:', error);
    throw error;
  }
}

// 使用
deleteFile('group1_M00/00/00/xxx.pdf');
```

---

## 四、文件信息查询

### 4.1 查看文件信息 [GET]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/getFileInfo?fileUuid={fileUuid}&signature={xx}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/getFileInfo?fileUuid={uuid}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件唯一标识 |
| `signature` | String | SSO必填 | 签名认证 |

#### 响应参数

```json
{
  "code": 0,
  "success": true,
  "message": null,
  "data": {
    "originalName": "技术中台(TSF-TKE)迁移指引-v1.2-20190102.docx",
    "preName": "技术中台(TSF-TKE)迁移指引-v1.2-20190102",
    "ext": "docx",
    "md5": null,
    "secretKey": null,
    "owner": "test",
    "fileUuid": "group1_M00/02/1C/Cgxbel4Ep5aId8LQAGME1O07xdMAAAAkgHfCgAAYwTs71.docx",
    "viewFileUuid": "group1_M00/02/1C/Cgxbel4EqNqIQFF_AGPRz4zjT4AAAAAkgJCDuwAY9Hn744.pdf",
    "fileSize": 6489300,
    "convertStatus": "转换完成",
    "viewType": "pdf",
    "encryptLength": 0,
    "fileChunkLenlst": [6489300]
  }
}
```

**字段说明**:

| 字段 | 说明 |
|------|------|
| `originalName` | 原始文件名 |
| `preName` | 文件名(不含扩展名) |
| `ext` | 文件扩展名 |
| `owner` | 所属应用 |
| `fileUuid` | 原始文件ID |
| `viewFileUuid` | 预览文件ID(转换后的PDF文件) |
| `fileSize` | 文件大小(字节) |
| `convertStatus` | 转换状态 |
| `viewType` | 预览类型 |

#### 示例代码

**Java (SDK)**:

```java
public FileDetail getFileInfo(String fileUuid) {
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    
    System.out.println("文件名: " + detail.getOriginalName());
    System.out.println("文件大小: " + detail.getFileSize());
    System.out.println("转换状态: " + detail.getConvertStatus());
    
    return detail;
}
```

**Python**:

```python
def get_file_info(file_uuid):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getFileInfo"
    params = {'fileUuid': file_uuid}
    
    response = requests.get(url, params=params)
    file_info = response.json()['data']
    
    print(f"文件名: {file_info['originalName']}")
    print(f"文件大小: {file_info['fileSize']} 字节")
    print(f"转换状态: {file_info['convertStatus']}")
    
    return file_info
```

---

## 五、最佳实践

### 5.1 上传大文件

对于大文件(>100MB),建议使用断点续传:

```java
public String uploadLargeFileWithProgress(File file) throws IOException {
    int chunkSize = 5 * 1024 * 1024; // 5MB per chunk
    FileInputStream fis = new FileInputStream(file);
    byte[] buffer = new byte[chunkSize];
    int bytesRead;
    String fileUuid = null;
    int chunkIndex = 0;
    long totalBytes = file.length();
    long uploadedBytes = 0;
    
    while ((bytesRead = fis.read(buffer)) != -1) {
        byte[] chunkData = Arrays.copyOf(buffer, bytesRead);
        MultipartFile chunk = createMultipartFile(chunkData, file.getName());
        
        FileUploadParam param = new FileUploadParam();
        param.setFile(chunk);
        param.setFileUuid(fileUuid);
        
        boolean isLastChunk = (uploadedBytes + bytesRead >= totalBytes);
        param.setUploadMode(isLastChunk ? "total" : "append");
        
        String result = fileServicesClient.uploadFile(param);
        if (fileUuid == null) {
            fileUuid = result;
        }
        
        uploadedBytes += bytesRead;
        chunkIndex++;
        
        // 打印进度
        int progress = (int) ((uploadedBytes * 100) / totalBytes);
        System.out.printf("上传进度: %d%% (分片 %d)%n", progress, chunkIndex);
    }
    
    fis.close();
    return fileUuid;
}
```

### 5.2 批量上传文件

```java
public List<String> batchUpload(List<MultipartFile> files) {
    List<String> fileUuids = new ArrayList<>();
    
    // 使用线程池并发上传
    ExecutorService executor = Executors.newFixedThreadPool(5);
    List<Future<String>> futures = new ArrayList<>();
    
    for (MultipartFile file : files) {
        Future<String> future = executor.submit(() -> {
            return fileServicesClient.upload(file);
        });
        futures.add(future);
    }
    
    // 收集结果
    for (Future<String> future : futures) {
        try {
            fileUuids.add(future.get());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    executor.shutdown();
    return fileUuids;
}
```

### 5.3 下载并保存到指定目录

```java
public void downloadAndSave(String fileUuid, String targetDir) {
    // 1. 获取文件信息
    FileDetail detail = fileServicesClient.getFileDetail(fileUuid);
    String fileName = detail.getOriginalName();
    
    // 2. 下载文件
    File tempFile = fileServicesClient.downloadFile("", fileUuid);
    
    // 3. 移动到目标目录
    File targetFile = new File(targetDir, fileName);
    Files.move(tempFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    
    System.out.println("文件已保存到: " + targetFile.getAbsolutePath());
}
```

---

## 六、常见问题

### Q1: 上传时提示"文件内容不存在"?

**原因**: 上传了空文件或MultipartFile对象为空。

**解决方案**:
```java
if (file == null || file.isEmpty()) {
    throw new IllegalArgumentException("文件不能为空");
}
```

### Q2: 断点续传失败?

**原因**: 
1. 分片大小< 5MB
2. uploadMode参数设置错误

**解决方案**:
```java
// 确保分片 >= 5MB
int chunkSize = 5 * 1024 * 1024;

// 正确设置uploadMode
// 开始和中间分片: uploadMode = "append"
// 最后一片: uploadMode = "total"
```

### Q3: 下载文件时中文文件名乱码?

**解决方案**:
```java
String fileName = URLDecoder.decode(
    response.getHeader("Content-Disposition")
        .split("filename=")[1],
    "UTF-8"
);
```

---

📖 [返回主文档](./kb-file-services.md) | [下一分卷 →](./kb-file-services-part2.md)
