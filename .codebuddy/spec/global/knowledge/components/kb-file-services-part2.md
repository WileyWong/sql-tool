# 附件中台服务开发指南 - 第二分卷

> 📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part1.md) | [下一分卷 →](./kb-file-services-part3.md)

---

## 签名认证、预览、批量操作接口

本分卷包含签名获取、文件预览、文件转换、文件授权等核心接口。

---

## 一、签名认证接口

### 1.1 获取签名 (getVisitSignature) [GET]

#### 功能说明

该接口用于获取操作和访问文件服务的signature。前端通过SSO方式预览或下载附件时,必须先获取signature,并在调用接口时作为接口参数传递。

> ⚠️ **重要**: 该接口只能针对单个文件的操作,不能进行多文件授权和严格加密的密钥传递。建议使用 `getVisitSignatureExt` 接口。

#### 接口地址

**后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/getVisitSignature`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `staffId` | String | ❌ | 员工ID,指定可使用该签名的员工,为空则只有免认证员工可用 |
| `tenantId` | String | ❌ | 租户ID,指定签名对应的租户 |
| `fileUuid` | String | ❌ | 文件ID,确保签名不会对其他附件生效,为空则可访问业务系统其他附件 |
| `operate` | String | ❌ | 操作类型,见下表。为空默认为`all` |
| `watermarkContent` | String | ❌ | 水印文字内容 |
| `watermarkMode` | String | ❌ | 水印模式,默认为`darkgraysingle` |

**操作类型 (operate)枚举值**:

| 值 | 说明 |
|----|------|
| `upload` | 上传附件 |
| `visit` | 访问附件(下载和预览) |
| `view` | 仅预览,无下载权限 |
| `update` | 更新文件(转换文件、图片处理等) |
| `auth` | 附件授权操作 |
| `delete` | 删除附件 |
| `tags` | 添加或删除标签 |
| `docsqqmanager` | 注册腾讯文档管理员(公网暂不支持) |
| `all` | 所有操作权限(默认) |

**水印模式 (watermarkMode)枚举值**:

| 值 | 说明 |
|----|------|
| `lightcoralmulti` | 淡珊瑚色多个水印 |
| `lightcoralsingle` | 淡珊瑚色单个水印 |
| `darkgraysingle` | 深灰色单个水印(默认) |
| `darkgraymulti` | 深灰色多个水印 |
| `weakgraysingle` | 淡灰色单个水印 |
| `weakgraymulti` | 淡灰色多个水印 |

#### 响应参数

返回String类型的签名字符串,在Redis中作为key关联相关信息,有效期 **30分钟**。

#### 示例代码

**Java**:

```java
public String getSignature(String fileUuid, String operate, String watermark) {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignature";
    
    Map<String, String> params = new HashMap<>();
    params.put("fileUuid", fileUuid);
    params.put("operate", operate);
    if (watermark != null) {
        params.put("watermarkContent", watermark);
        params.put("watermarkMode", "darkgraysingle");
    }
    
    String signature = httpGet(url, params);
    return signature;
}

// 使用示例
String signature = getSignature(
    "group1_M00/00/00/xxx.pdf",
    "visit",
    "仅供内部使用"
);
```

**Python**:

```python
def get_signature(file_uuid, operate="visit", watermark=None):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignature"
    
    params = {
        'fileUuid': file_uuid,
        'operate': operate
    }
    
    if watermark:
        params['watermarkContent'] = watermark
        params['watermarkMode'] = 'darkgraysingle'
    
    response = requests.get(url, params=params)
    return response.text  # 直接返回签名字符串

# 使用
signature = get_signature(
    "group1_M00/00/00/xxx.pdf",
    operate="visit",
    watermark="仅供内部使用"
)
```

**cURL**:

```bash
curl "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignature?fileUuid=xxx&operate=visit&watermarkContent=%E4%BB%85%E4%BE%9B%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8"
```

---

### 1.2 获取签名扩展 (getVisitSignatureExt) [POST]

#### 功能说明

该接口是 `getVisitSignature` 的扩展版本,主要区别在于:
- 可以指定多个 `fileUuid`,实现批量授权
- 支持严格加密模式的 `encryptToken` 传递
- 支持背景水印设置
- 避免接口参数膨胀,便于后续扩展

#### 接口地址

**后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/getVisitSignatureExt`

#### 请求方式

`POST` (Content-Type: application/json)

#### 请求体

```json
{
  "fileUuids": [
    "group2_M00/00/00/Cgxbel6ZZ_-IIE1DAA-Yo-q1zQsAAAAGgNvazwAD5i7870.pdf",
    "group1_M00/02/1D/Cgxbel6ZR3WIELxtAAYtraoyI4UAAAAnQPvBJoABi3F013.pdf"
  ],
  "staffId": "167225",
  "tenantId": "tencent",
  "operate": "visit",
  "watermarkMode": "weakgraysingle",
  "watermarkContent": "hello",
  "watermarkBackground": true,
  "encryptToken": ""
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuids` | Array<String> | ✅ | 文件ID数组,签名对这些文件有效 |
| `staffId` | String | ❌ | 员工ID |
| `tenantId` | String | ❌ | 租户ID |
| `operate` | String | ❌ | 操作类型 |
| `watermarkMode` | String | ❌ | 水印模式 |
| `watermarkContent` | String | ❌ | 水印文字 |
| `watermarkBackground` | Boolean | ❌ | 是否为背景水印,默认false |
| `encryptToken` | String | ❌ | 严格加密模式时的密钥Token |

#### 响应参数

返回String类型的签名字符串,有效期 **30分钟**。

#### 示例代码

**Java**:

```java
public String getSignatureExt(List<String> fileUuids, String operate, String watermark) {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignatureExt";
    
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("fileUuids", fileUuids);
    requestBody.put("operate", operate);
    
    if (watermark != null) {
        requestBody.put("watermarkContent", watermark);
        requestBody.put("watermarkMode", "darkgraysingle");
        requestBody.put("watermarkBackground", true);
    }
    
    String json = new ObjectMapper().writeValueAsString(requestBody);
    String signature = httpPost(url, json);
    
    return signature;
}

// 使用示例
List<String> fileUuids = Arrays.asList(
    "group1_M00/00/00/xxx.pdf",
    "group1_M00/00/01/yyy.docx"
);

String signature = getSignatureExt(
    fileUuids,
    "visit",
    "仅供内部使用"
);
```

**Python**:

```python
def get_signature_ext(file_uuids, operate="visit", watermark=None, encrypt_token=None):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getVisitSignatureExt"
    
    payload = {
        "fileUuids": file_uuids,
        "operate": operate
    }
    
    if watermark:
        payload["watermarkContent"] = watermark
        payload["watermarkMode"] = "darkgraysingle"
        payload["watermarkBackground"] = True
    
    if encrypt_token:
        payload["encryptToken"] = encrypt_token
    
    response = requests.post(url, json=payload)
    return response.text

# 使用
file_uuids = [
    "group1_M00/00/00/xxx.pdf",
    "group1_M00/00/01/yyy.docx"
]

signature = get_signature_ext(
    file_uuids,
    operate="visit",
    watermark="仅供内部使用"
)
```

---

## 二、文件预览接口

### 2.1 浏览器文件预览 [GET]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-view/viewOnline?fileUuid={xx}&signature={xx}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-view/viewOnline?fileUuid={xx}&watermarkMode={xx}&watermarkContent={xx}`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件唯一标识 |
| `signature` | String | SSO必填 | 签名认证(SSO模式必填,ESB模式不需要) |
| `watermarkContent` | String | ❌ | 水印内容 |
| `watermarkMode` | String | ❌ | 水印模式,默认`darkgraysingle` |
| `watermarkBackground` | Boolean | ❌ | 是否背景水印(仅PDF),默认true |
| `downloadOrigin` | Boolean | ❌ | 文件不可预览时是否下载源文件 |
| `forceDownload` | Boolean | ❌ | 强制浏览器下载附件,可实现携带水印下载 |
| `picParam` | String | ❌ | 图片处理参数,单个规则 |

#### 响应头

| 响应头 | 说明 |
|--------|------|
| `Content-Type` | `image/xx` 或 `application/pdf` |
| `Content-Disposition` | `inline,filename=xxx` (inline表示内嵌显示) |

#### 示例代码

**前端HTML预览**:

```html
<!-- PDF预览 -->
<iframe 
  src="http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=xxx&signature=xxx"
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>

<!-- 图片预览 -->
<img 
  src="http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=xxx&signature=xxx"
  alt="图片预览"
/>

<!-- 带水印预览 -->
<iframe 
  src="http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=xxx&signature=xxx&watermarkContent=仅供内部使用&watermarkMode=darkgraysingle"
  width="100%" 
  height="800px">
</iframe>
```

**JavaScript动态生成预览URL**:

```javascript
async function previewFile(fileUuid, watermark) {
  // 1. 获取签名
  const signature = await getSignature(fileUuid, 'visit', watermark);
  
  // 2. 构建预览URL
  const baseUrl = 'http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline';
  const params = new URLSearchParams({
    fileUuid: fileUuid,
    signature: signature
  });
  
  if (watermark) {
    params.append('watermarkContent', watermark);
    params.append('watermarkMode', 'darkgraysingle');
  }
  
  const previewUrl = `${baseUrl}?${params.toString()}`;
  
  // 3. 在新窗口打开预览
  window.open(previewUrl, '_blank');
}

// 使用
previewFile('group1_M00/00/00/xxx.pdf', '仅供内部使用');
```

**Vue组件示例**:

```vue
<template>
  <div class="file-preview">
    <iframe 
      v-if="previewUrl"
      :src="previewUrl"
      width="100%"
      height="800px"
      frameborder="0"
    />
    <div v-else>加载中...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewUrl: ''
    }
  },
  
  async mounted() {
    await this.loadPreview();
  },
  
  methods: {
    async loadPreview() {
      const fileUuid = this.$route.params.fileUuid;
      
      // 获取签名
      const { data } = await this.$axios.get('/api/getSignature', {
        params: {
          fileUuid: fileUuid,
          operate: 'visit',
          watermarkContent: '仅供内部使用'
        }
      });
      
      // 构建预览URL
      this.previewUrl = `http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=${fileUuid}&signature=${data}`;
    }
  }
}
</script>
```

**后端直接预览(不需要签名)**:

```java
// 方式1: 直接重定向到预览URL
@GetMapping("/preview/{fileUuid}")
public void previewFile(@PathVariable String fileUuid, HttpServletResponse response) throws IOException {
    String previewUrl = String.format(
        "http://ntsgw.oa.com/api/esb/hr-fileservices-view/viewOnline?fileUuid=%s&watermarkContent=%s",
        fileUuid,
        URLEncoder.encode("仅供内部使用", "UTF-8")
    );
    
    response.sendRedirect(previewUrl);
}

// 方式2: 获取预览内容并返回
@GetMapping("/preview/{fileUuid}/inline")
public void previewInline(@PathVariable String fileUuid, HttpServletResponse response) throws IOException {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-view/viewOnline?fileUuid=" + fileUuid;
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpGet httpGet = new HttpGet(url);
    
    try (CloseableHttpResponse httpResponse = httpClient.execute(httpGet)) {
        // 复制响应头
        response.setContentType(httpResponse.getFirstHeader("Content-Type").getValue());
        
        // 输出内容
        httpResponse.getEntity().writeTo(response.getOutputStream());
    }
}
```

---

### 2.2 防复制预览 [GET]

#### 功能说明

提供防复制的预览能力,目前仅支持 **PDF** 和 **Excel(xlsx)** 文件。

#### 接口地址

- **测试环境**: `https://test-hrfileview.woa.com/?fileUuid={xxx}&signature={xxx}`
- **生产环境**: `https://hrfileview.woa.com/?fileUuid={xxx}&signature={xxx}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件ID |
| `signature` | String | ✅ | 签名 |

#### 示例代码

```html
<!-- 防复制预览 -->
<iframe 
  src="https://hrfileview.woa.com/?fileUuid=xxx&signature=xxx"
  width="100%" 
  height="800px"
  frameborder="0"
  sandbox="allow-scripts allow-same-origin">
</iframe>
```

---

## 三、文件转换接口

### 3.1 转换指定文件 [POST]

#### 功能说明

该接口用于在预览时发现原始文件尚未转换成预览文件时,发送转换请求。将生成一个转换任务,用于转换原始文件(如Word/Excel转PDF)。

#### 接口地址

- **前端PUB调用**: `http://域名/api/pub/hr-fileservices-load/convertFile?fileUuid={uuid}`
- **TSF服务后端调用**: `http://hr-fileservices-load/convertFile?fileUuid={uuid}`

#### 请求方式

`POST`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 原始文件ID |

#### 响应参数

```json
{
  "success": true,
  "message": "已成功发送转换消息",
  "data": null
}
```

#### 示例代码

**Java**:

```java
public void convertFile(String fileUuid) {
    String url = "http://ntsgw.oa.com/api/pub/hr-fileservices-load/convertFile?fileUuid=" + fileUuid;
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpPost httpPost = new HttpPost(url);
    
    try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
        String result = EntityUtils.toString(response.getEntity());
        System.out.println("转换请求结果: " + result);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

**cURL**:

```bash
curl -X POST "http://ntsgw.oa.com/api/pub/hr-fileservices-load/convertFile?fileUuid=xxx"
```

---

### 3.2 获取文件转换结果 [GET]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/getConvertResult?fileUuid={uuid}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/getConvertResult?fileUuid={uuid}`

#### 请求方式

`GET`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 原始文件ID |

#### 响应参数

**转换未完成**:
```json
{
  "success": false,
  "message": "文件尚未转换完成",
  "data": null
}
```

**转换成功**:
```json
{
  "success": true,
  "message": "文件转换成功",
  "data": null
}
```

#### 示例代码

**Java (轮询等待转换完成)**:

```java
public boolean waitForConversion(String fileUuid, int maxWaitSeconds) throws InterruptedException {
    String url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getConvertResult?fileUuid=" + fileUuid;
    
    int waited = 0;
    int interval = 2; // 每2秒查询一次
    
    while (waited < maxWaitSeconds) {
        String result = httpGet(url);
        JSONObject json = JSON.parseObject(result);
        
        if (json.getBoolean("success")) {
            System.out.println("文件转换成功");
            return true;
        }
        
        Thread.sleep(interval * 1000);
        waited += interval;
        System.out.println("等待转换... (" + waited + "s)");
    }
    
    System.out.println("转换超时");
    return false;
}

// 使用
convertFile(fileUuid);
boolean success = waitForConversion(fileUuid, 60); // 最多等待60秒
```

**Python**:

```python
import time

def wait_for_conversion(file_uuid, max_wait_seconds=60):
    url = f"http://ntsgw.oa.com/api/esb/hr-fileservices-load/getConvertResult"
    params = {'fileUuid': file_uuid}
    
    waited = 0
    interval = 2
    
    while waited < max_wait_seconds:
        response = requests.get(url, params=params)
        result = response.json()
        
        if result['success']:
            print("文件转换成功")
            return True
        
        time.sleep(interval)
        waited += interval
        print(f"等待转换... ({waited}s)")
    
    print("转换超时")
    return False

# 使用
convert_file(file_uuid)
success = wait_for_conversion(file_uuid, 60)
```

---

## 四、文件授权接口

### 4.1 归属文件 [POST]

#### 功能说明

该接口用于给通过 `/api/pub` 上传的文件设置所属系统。

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-view/setOwner?fileUuid={xx}&appName={xx}&signature={xxx}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-view/setOwner?fileUuid={xx}&appName={xx}`

#### 请求方式

`POST`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件ID |
| `appName` | String | ✅ | 所属应用名称 |
| `signature` | String | SSO必填 | 签名认证 |

#### 示例代码

**Java**:

```java
public void setFileOwner(String fileUuid, String appName) {
    String url = String.format(
        "http://ntsgw.oa.com/api/esb/hr-fileservices-view/setOwner?fileUuid=%s&appName=%s",
        fileUuid, appName
    );
    
    httpPost(url, null);
}
```

**cURL**:

```bash
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-view/setOwner?fileUuid=xxx&appName=my-app"
```

---

### 4.2 授权文件 [POST]

#### 功能说明

将文件授权给其他系统使用。

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/authApp?fileUuid={xx}&appName={xx}&signature={xxx}`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/authApp`

#### 请求方式

`POST`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件唯一标识 |
| `appName` | String | ✅ | 被授权系统名称 |
| `signature` | String | SSO必填 | 签名认证 |

#### 示例代码

**Java (SDK)**:

```java
@Autowired
private FileServicesClient fileServicesClient;

public void authorizeFile(String fileUuid, String targetAppName) {
    fileServicesClient.authFile(fileUuid, targetAppName);
    System.out.println("文件已授权给: " + targetAppName);
}
```

**cURL**:

```bash
curl -X POST "http://ntsgw.oa.com/api/esb/hr-fileservices-load/authApp?fileUuid=xxx&appName=target-app"
```

---

## 五、标签管理接口

### 5.1 添加/修改标签 [POST]

#### 功能说明

给指定附件添加或修改标签。如果标签key不存在则新增,如果已存在则覆盖value。

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/addTags`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/addTags`

#### 请求方式

`POST` (Content-Type: application/json)

#### 请求体

```json
{
  "fileUuid": "group2_M00/00/02/CnsZUl7sE2qANRQXAAYTRVqi9C4326.pdf",
  "metaTags": {
    "favors": "book",
    "affect": "view",
    "department": "HR"
  }
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 附件主键 |
| `metaTags` | Map<String,String> | ✅ | 标签键值对 |

#### 示例代码

**Java (SDK)**:

```java
public void addTags(String fileUuid, Map<String, String> tags) {
    fileServicesClient.addTags(fileUuid, tags);
}

// 使用
Map<String, String> tags = new HashMap<>();
tags.put("department", "HR");
tags.put("type", "contract");
tags.put("year", "2024");

addTags("group1_M00/00/00/xxx.pdf", tags);
```

**Python**:

```python
def add_tags(file_uuid, tags):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/addTags"
    
    payload = {
        "fileUuid": file_uuid,
        "metaTags": tags
    }
    
    response = requests.post(url, json=payload)
    return response.json()

# 使用
tags = {
    "department": "HR",
    "type": "contract",
    "year": "2024"
}

add_tags("group1_M00/00/00/xxx.pdf", tags)
```

---

### 5.2 删除标签 [DELETE]

#### 接口地址

- **前端SSO调用**: `http://域名/api/sso/hr-fileservices-load/delTags`
- **后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/delTags`

#### 请求方式

`DELETE` (Content-Type: application/json)

#### 请求体

```json
{
  "fileUuid": "group2_M00/00/02/CnsZUl7sE2qANRQXAAYTRVqi9C4326.pdf",
  "metaTags": {
    "favors": "book",
    "affect": "view"
  }
}
```

#### 示例代码

**Java (SDK)**:

```java
public void deleteTags(String fileUuid, Map<String, String> tags) {
    fileServicesClient.delTags(fileUuid, tags);
}

// 使用
Map<String, String> tagsToDelete = new HashMap<>();
tagsToDelete.put("department", "HR");

deleteTags("group1_M00/00/00/xxx.pdf", tagsToDelete);
```

**Python**:

```python
def delete_tags(file_uuid, tags):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/delTags"
    
    payload = {
        "fileUuid": file_uuid,
        "metaTags": tags
    }
    
    response = requests.delete(url, json=payload)
    return response.json()

# 使用
tags_to_delete = {
    "department": "HR"
}

delete_tags("group1_M00/00/00/xxx.pdf", tags_to_delete)
```

---

## 六、共享访问接口

### 6.1 获取共享访问链接 [POST]

#### 功能说明

针对需要跳过权限认证且可以分享给他人访问的附件,生成共享访问链接。

#### 接口地址

**后端ESB调用**: `http://域名/api/esb/hr-fileservices-load/getShareViewUrls`

#### 请求方式

`POST` (Content-Type: application/json)

#### 请求体

```json
[
  {
    "fileUuid": "out-s_xxxx/xxxxx.docx"
  },
  {
    "fileUuid": "group1_M00/00/00/xxx.jpg",
    "picParam": "scale/20"
  }
]
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `fileUuid` | String | ✅ | 文件ID |
| `picParam` | String | ❌ | 图片处理参数(仅图片文件) |

#### 响应参数

```json
{
  "code": 0,
  "success": true,
  "message": null,
  "data": [
    {
      "fileUuid": "out-s_nts-xx/xxxx.docx",
      "shareViewUrl": "https://cdn.tmp.ihr.tencent-cloud.com/xxx.pdf?sign=ca4b2db46d776280aed89361d7ebbed8&t=1606390754",
      "accelerateMode": null
    }
  ]
}
```

#### 示例代码

**Java (SDK)**:

```java
public List<String> getShareUrls(List<String> fileUuids) {
    List<ShareUrlInfo> infos = fileServicesClient.getShareViewUrls(fileUuids);
    
    return infos.stream()
        .map(ShareUrlInfo::getShareViewUrl)
        .collect(Collectors.toList());
}

// 使用
List<String> fileUuids = Arrays.asList(
    "group1_M00/00/00/xxx.pdf",
    "group1_M00/00/01/yyy.jpg"
);

List<String> shareUrls = getShareUrls(fileUuids);
shareUrls.forEach(System.out::println);
```

**Python**:

```python
def get_share_urls(file_uuids):
    url = "http://ntsgw.oa.com/api/esb/hr-fileservices-load/getShareViewUrls"
    
    payload = [{"fileUuid": uuid} for uuid in file_uuids]
    
    response = requests.post(url, json=payload)
    result = response.json()
    
    share_urls = [item['shareViewUrl'] for item in result['data']]
    return share_urls

# 使用
file_uuids = [
    "group1_M00/00/00/xxx.pdf",
    "group1_M00/00/01/yyy.jpg"
]

urls = get_share_urls(file_uuids)
for url in urls:
    print(url)
```

**使用场景示例**:

```java
// 场景: 生成分享链接供外部访问
public String generateShareLink(String fileUuid) {
    List<ShareUrlInfo> infos = fileServicesClient.getShareViewUrls(
        Collections.singletonList(fileUuid)
    );
    
    if (infos.isEmpty()) {
        throw new RuntimeException("生成分享链接失败");
    }
    
    String shareUrl = infos.get(0).getShareViewUrl();
    
    // 可以生成短链或二维码
    String shortUrl = generateShortUrl(shareUrl);
    String qrCode = generateQRCode(shareUrl);
    
    return shortUrl;
}
```

---

## 七、完整业务场景示例

### 场景1: 上传文件并生成预览链接

```java
@Service
public class FileService {
    
    @Autowired
    private FileServicesClient fileServicesClient;
    
    /**
     * 上传文件并返回预览链接
     */
    public String uploadAndGetPreviewUrl(MultipartFile file, String watermark) {
        // 1. 上传文件并转换
        String fileUuid = fileServicesClient.uploadAndConvert(file);
        
        // 2. 等待转换完成
        waitForConversion(fileUuid, 60);
        
        // 3. 获取签名
        String signature = getSignatureForPreview(fileUuid, watermark);
        
        // 4. 构建预览URL
        String previewUrl = String.format(
            "http://ntsgw.oa.com/api/sso/hr-fileservices-view/viewOnline?fileUuid=%s&signature=%s",
            fileUuid, signature
        );
        
        return previewUrl;
    }
    
    private String getSignatureForPreview(String fileUuid, String watermark) {
        // 调用后端接口获取签名
        // ...实现省略
        return signature;
    }
}
```

### 场景2: 批量下载带水印的文件

```java
public File batchDownloadWithWatermark(List<String> fileUuids, String watermark) {
    // 1. 获取支持批量下载的签名
    String signature = getSignatureExt(fileUuids, "visit", watermark);
    
    // 2. 前端调用批量下载
    String downloadUrl = String.format(
        "http://ntsgw.oa.com/api/sso/hr-fileservices-load/batchHttpDownload?signature=%s&compressName=files",
        signature
    );
    
    // 返回下载URL供前端使用
    return downloadUrl;
}
```

---

📖 [返回主文档](./kb-file-services.md) | [← 上一分卷](./kb-file-services-part1.md) | [下一分卷 →](./kb-file-services-part3.md)
