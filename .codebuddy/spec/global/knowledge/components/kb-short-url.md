# 短地址服务开发指引文档

## 文档概述

本文档提供短地址服务(Short URL Service)的完整API使用指南，涵盖短链生成、更新、失效和查询的所有对外接口。

**当前版本**: v1.0  
**维护团队**: 基础组件组  
**接口人**: jeeliu(刘志杰)  
**接入文档**: https://iwiki.woa.com/p/4007101451  
**状态标识**: ✅ 稳定，推荐使用

## 系统简介

### 产品定位

短地址服务主要解决因资源访问路径过长导致的以下问题：
- 用户分享体验差
- 短信内容过长推送被截断
- 移动/PC端页面无法自适应客户端

通过开放API为各应用提供统一地址转换服务。

### 核心能力

**主要功能**:
- 长链接转短链接
- PC端/移动端链接自动适配
- 短地址增加query参数
- PC端扫码打开
- 移动端浏览器自动唤起微信(仅限`sdc.qq.com`及子域名)
- 移动端浏览器自动唤起MOA(woa域名)
- 自定义短码
- 链接query参数和path参数相互转换

**应用场景**:
- 短链分享
- 短信/浏览器唤起微信客户端
- 需要区分PC端和移动端访问的场景
- 需要设置链接有效期的场景

### 术语解释

**短地址**: 短域名 + 随机短码

示例：
- 短地址：`https://sdc.qq.com/s/ogarSG`
- 实际访问地址：`https://iwiki.woa.com/p/4007094463?from=shortUrl`

## 快速开始

### 前置条件

1. **应用注册**: 联系接口人注册应用信息，获取`AppID`和`AppSecret`
2. **域名白名单**: 确认源链接域名在白名单范围内(参考: https://iwiki.woa.com/p/4007094467)
3. **网络环境**: 确保可访问短链服务地址

### 环境地址

#### 生产环境

| 调用方区域 | 服务地址 | 备注 |
|-----------|---------|------|
| 公网 | `https://sdc.qq.com/openapi/` | - |
| 云-VPC | `http://srv.shortur.prodihrtas.com:18825/api/` | - |
| OA-VPC | `http://api.sgw.woa.com/hr-short-url/export_idc_esb_8080/https/sdc.qq.com/openapi/` | QPS限制100 |
| IDC | `http://api-idc.sgw.woa.com/hr-short-url/export_idc_esb_8080/https/sdc.qq.com/openapi/` | QPS限制100 |

#### 测试环境

| 调用方区域 | 服务地址 | 备注 |
|-----------|---------|------|
| 公网/DevNet | `http://s.test.yunassess.com/openapi/` | - |
| 云VPC测试 | `http://srv.shortur.testihrtas.com:18825/api/` | - |

### 基础接入流程

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  应用注册    │ --> │  计算签名     │ --> │  调用API    │
│  获取凭证    │     │  构建请求头   │     │  获取短链   │
└─────────────┘     └──────────────┘     └─────────────┘
```

**步骤详解**:

1. **应用注册** (联系接口人: jeeliu)
   - 获取应用标识: `AppID`
   - 获取应用凭证: `AppSecret`
   - 确认接口权限范围

2. **计算签名** (所有API调用必须)
   ```
   sdcapi-ticket = SHA256(AppID + AppSecret + sdcapi-timestamp)
   ```

3. **调用接口**
   - 设置请求头: `sdcapi-appid`, `sdcapi-timestamp`, `sdcapi-ticket`
   - 发送请求获取短链

### 最简示例

#### JavaScript 快速调用

```javascript
const crypto = require('crypto');
const axios = require('axios');

// 配置信息
const appId = 'your_app_id';
const appSecret = 'your_app_secret';
const timestamp = Math.floor(Date.now() / 1000).toString();

// 计算签名
const signature = crypto
    .createHash('sha256')
    .update(appId + appSecret + timestamp)
    .digest('hex');

// 调用API生成短链
const response = await axios.post(
    'https://sdc.qq.com/openapi/GetShortUrl',
    {
        pc_url: 'https://example.com/pc',
        mobile_url: 'https://example.com/mobile',
        expire_time: 604800  // 7天有效期
    },
    {
        headers: {
            'sdcapi-appid': appId,
            'sdcapi-timestamp': timestamp,
            'sdcapi-ticket': signature,
            'Content-Type': 'application/json'
        }
    }
);

console.log('生成的短链:', response.data.data);
```

#### Python 快速调用

```python
import hashlib
import requests
import time

# 配置信息
app_id = 'your_app_id'
app_secret = 'your_app_secret'
timestamp = str(int(time.time()))

# 计算签名
raw = f"{app_id}{app_secret}{timestamp}"
signature = hashlib.sha256(raw.encode()).hexdigest()

# 调用API生成短链
response = requests.post(
    'https://sdc.qq.com/openapi/GetShortUrl',
    headers={
        'sdcapi-appid': app_id,
        'sdcapi-timestamp': timestamp,
        'sdcapi-ticket': signature,
        'Content-Type': 'application/json'
    },
    json={
        'pc_url': 'https://example.com/pc',
        'mobile_url': 'https://example.com/mobile',
        'expire_time': 604800  # 7天有效期
    }
)

result = response.json()
if result['status'] == 0:
    print('生成的短链:', result['data'])
else:
    print('错误:', result['message'])
```

## 接口规范

### 通用请求头

所有API调用必须包含以下请求头进行身份校验:

| Header名称 | 类型 | 必填 | 说明 | 示例值 |
|-----------|------|------|------|--------|
| sdcapi-appid | string | 是 | 应用标识 | `app1` |
| sdcapi-timestamp | string | 是 | UTC时间戳(精确到秒) | `1655975172` |
| sdcapi-ticket | string | 是 | 请求签名(SHA256) | `26cf1831ecb14ac6...` |

### 签名算法

```
sdcapi-ticket = SHA256(sdcapi-appid + AppSecret + sdcapi-timestamp)
```

**示例计算**:
```
AppID = "app1"
AppSecret = "test"
sdcapi-timestamp = "1655975172"
sdcapi-ticket = SHA256("app1" + "test" + "1655975172")
              = "26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633"
```

**重要提示**:
- AppSecret用作调用凭证，请妥善保管，不要泄露
- 时间戳必须是UTC时间，精确到秒
- 时间戳有效期为3分钟
- 签名结果为小写十六进制字符串

### 通用响应格式

所有接口统一返回JSON格式:

```json
{
  "status": 0,
  "message": "OK",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，`0`表示成功，非`0`表示失败 |
| message | string | 提示信息 |
| data | object/string | 返回数据，具体结构查看对应接口 |

## 接口列表

### 1. 生成短链 (GET)

**接口地址**: `GET /GetWeChatRedirectKeyByURL`

**使用场景**: 快速生成单个URL的短链接

**特点**: 简单快速，适合单一链接场景

#### 请求参数

Query参数:

| 参数 | 类型 | 必填 | 说明 | 备注 |
|-----|------|------|------|------|
| url | string | 是 | 原始链接 | 需要进行URL转码 |
| expiretime | int | 否 | 有效时间，单位：秒 | 默认永久有效 |

#### 响应参数

```json
{
  "status": 0,
  "message": "OK",
  "data": "https://sdc.qq.com/s/xxx"
}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，0为成功 |
| message | string | 提示信息 |
| data | string | 生成的短链地址 |

#### 调用示例

**cURL**:
```bash
curl -X GET "https://sdc.qq.com/openapi/GetWeChatRedirectKeyByURL?url=https%3A%2F%2Fexample.com&expiretime=604800" \
  -H "sdcapi-appid: app1" \
  -H "sdcapi-timestamp: 1655975172" \
  -H "sdcapi-ticket: 26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633"
```

**JavaScript**:
```javascript
const crypto = require('crypto');
const axios = require('axios');

const appId = 'app1';
const appSecret = 'test';
const timestamp = Math.floor(Date.now() / 1000).toString();
const signature = crypto.createHash('sha256')
    .update(appId + appSecret + timestamp)
    .digest('hex');

const url = encodeURIComponent('https://example.com');
const response = await axios.get(
    `https://sdc.qq.com/openapi/GetWeChatRedirectKeyByURL?url=${url}&expiretime=604800`,
    {
        headers: {
            'sdcapi-appid': appId,
            'sdcapi-timestamp': timestamp,
            'sdcapi-ticket': signature
        }
    }
);

console.log('短链:', response.data.data);
```

---

### 2. 生成短链 (POST)

**接口地址**: `POST /GetShortUrl`

**使用场景**: 
- 需要区分PC端和移动端链接
- 需要自定义短链ID
- 需要指定跳转规则

**特点**: 功能完整，支持多种配置选项

#### 请求参数

Body参数(JSON格式):

| 参数 | 类型 | 必填 | 说明 | 备注 |
|-----|------|------|------|------|
| pc_url | string | 否 | PC端链接 | pc_url和mobile_url不能同时为空，为空时默认为mobile_url |
| mobile_url | string | 否 | 移动端链接 | pc_url和mobile_url不能同时为空，为空时默认为pc_url |
| expire_time | int | 否 | 有效时间，单位：秒 | 默认永久有效 |
| url_rule | string | 否 | 链接跳转规则 | 可选值：r0, r1, r2, r3, r4；默认r0 |
| url_id | string | 否 | 自定义短链id | 长度3到8位，全局唯一 |

**url_rule 说明**:
- `r0`: 在原始链接后面追加访问url参数
- `r1`: 使用访问url参数替换掉原始链接url参数
- `r2`: 使用访问path参数转为原始链接url参数值
- `r3`: link参数重定向，目标域名必须在域名白名单内
- `r4`: 原始链接占位符`${xx}`使用访问url参数替换

详细规则说明请参考: https://iwiki.woa.com/p/4007094467

#### 响应参数

```json
{
  "status": 0,
  "message": "OK",
  "data": "https://sdc.qq.com/s/xxx"
}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，0为成功 |
| message | string | 提示信息 |
| data | string | 生成的短链地址 |

#### 调用示例

**cURL**:
```bash
curl -X POST "https://sdc.qq.com/openapi/GetShortUrl" \
  -H "Content-Type: application/json" \
  -H "sdcapi-appid: app1" \
  -H "sdcapi-timestamp: 1655975172" \
  -H "sdcapi-ticket: 26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633" \
  -d '{
    "pc_url": "http://example.com/pc",
    "mobile_url": "http://example.com/mobile",
    "expire_time": 604800,
    "url_rule": "r0"
  }'
```

**Java**:
```java
import java.security.MessageDigest;
import java.net.http.*;
import java.net.URI;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

public class ShortUrlExample {
    public static void main(String[] args) throws Exception {
        String appId = "app1";
        String appSecret = "test";
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        
        // 计算签名
        String raw = appId + appSecret + timestamp;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(raw.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        String signature = hexString.toString();
        
        // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("pc_url", "http://example.com/pc");
        requestBody.put("mobile_url", "http://example.com/mobile");
        requestBody.put("expire_time", 604800);
        
        Gson gson = new Gson();
        String jsonBody = gson.toJson(requestBody);
        
        // 发送请求
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://sdc.qq.com/openapi/GetShortUrl"))
            .header("Content-Type", "application/json")
            .header("sdcapi-appid", appId)
            .header("sdcapi-timestamp", timestamp)
            .header("sdcapi-ticket", signature)
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println("响应: " + response.body());
    }
}
```

**Python**:
```python
import hashlib
import requests
import time
import json

app_id = 'app1'
app_secret = 'test'
timestamp = str(int(time.time()))

# 计算签名
raw = f"{app_id}{app_secret}{timestamp}"
signature = hashlib.sha256(raw.encode()).hexdigest()

# 发送请求
response = requests.post(
    'https://sdc.qq.com/openapi/GetShortUrl',
    headers={
        'Content-Type': 'application/json',
        'sdcapi-appid': app_id,
        'sdcapi-timestamp': timestamp,
        'sdcapi-ticket': signature
    },
    json={
        'pc_url': 'http://example.com/pc',
        'mobile_url': 'http://example.com/mobile',
        'expire_time': 604800,
        'url_rule': 'r0'
    }
)

result = response.json()
print('响应:', json.dumps(result, indent=2, ensure_ascii=False))
```

---

### 3. 更新短链

**接口地址**: `POST /UpdateShortUrl`

**使用场景**: 修改已生成短链的目标地址或有效期

**特点**: 可动态调整短链配置，无需重新生成

#### 请求参数

Body参数(JSON格式):

| 参数 | 类型 | 必填 | 说明 | 备注 |
|-----|------|------|------|------|
| url_id | string | 是 | 短链id | - |
| pc_url | string | 否 | PC端链接 | pc_url和mobile_url不能同时为空，为空时默认为mobile_url |
| mobile_url | string | 否 | 移动端链接 | pc_url和mobile_url不能同时为空，为空时默认为pc_url |
| expire_time | int | 否 | 有效时间，单位：秒 | -1表示永久有效 |
| url_rule | string | 否 | 链接跳转规则 | 可选值：r0, r1, r2, r3, r4；默认r0 |

#### 响应参数

```json
{
  "status": 0,
  "message": "OK",
  "data": "操作成功"
}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，0为成功 |
| message | string | 提示信息 |
| data | string | 更新结果 |

#### 调用示例

**cURL**:
```bash
curl -X POST "https://sdc.qq.com/openapi/UpdateShortUrl" \
  -H "Content-Type: application/json" \
  -H "sdcapi-appid: app1" \
  -H "sdcapi-timestamp: 1655975172" \
  -H "sdcapi-ticket: 26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633" \
  -d '{
    "url_id": "jfD3d9",
    "pc_url": "http://example.com/pc/new",
    "expire_time": -1
  }'
```

**Node.js**:
```javascript
const crypto = require('crypto');
const axios = require('axios');

async function updateShortUrl(urlId, pcUrl, expireTime) {
    const appId = 'app1';
    const appSecret = 'test';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash('sha256')
        .update(appId + appSecret + timestamp)
        .digest('hex');
    
    const response = await axios.post(
        'https://sdc.qq.com/openapi/UpdateShortUrl',
        {
            url_id: urlId,
            pc_url: pcUrl,
            expire_time: expireTime
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'sdcapi-appid': appId,
                'sdcapi-timestamp': timestamp,
                'sdcapi-ticket': signature
            }
        }
    );
    
    return response.data;
}

// 使用示例
updateShortUrl('jfD3d9', 'http://example.com/pc/new', -1)
    .then(result => console.log('更新结果:', result))
    .catch(error => console.error('错误:', error));
```

---

### 4. 失效短链

**接口地址**: `POST /InvalidateShortUrl`

**使用场景**: 立即使某个短链失效

**特点**: 失效后无法恢复，需谨慎操作

#### 请求参数

Body参数(JSON格式):

| 参数 | 类型 | 必填 | 说明 | 备注 |
|-----|------|------|------|------|
| url_id | string | 是 | 短链id | - |

#### 响应参数

```json
{
  "status": 0,
  "message": "OK",
  "data": "操作成功"
}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，0为成功 |
| message | string | 提示信息 |
| data | string | 操作结果 |

#### 调用示例

**cURL**:
```bash
curl -X POST "https://sdc.qq.com/openapi/InvalidateShortUrl" \
  -H "Content-Type: application/json" \
  -H "sdcapi-appid: app1" \
  -H "sdcapi-timestamp: 1655975172" \
  -H "sdcapi-ticket: 26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633" \
  -d '{
    "url_id": "jfD3d9"
  }'
```

**Python**:
```python
import hashlib
import requests
import time

def invalidate_short_url(url_id):
    app_id = 'app1'
    app_secret = 'test'
    timestamp = str(int(time.time()))
    
    # 计算签名
    raw = f"{app_id}{app_secret}{timestamp}"
    signature = hashlib.sha256(raw.encode()).hexdigest()
    
    # 发送请求
    response = requests.post(
        'https://sdc.qq.com/openapi/InvalidateShortUrl',
        headers={
            'Content-Type': 'application/json',
            'sdcapi-appid': app_id,
            'sdcapi-timestamp': timestamp,
            'sdcapi-ticket': signature
        },
        json={'url_id': url_id}
    )
    
    return response.json()

# 使用示例
result = invalidate_short_url('jfD3d9')
print('失效结果:', result)
```

---

### 5. 查询原始链接信息

**接口地址**: `GET /GetUrlParam`

**使用场景**: 根据短链ID查询原始链接配置信息

**特点**: 可用于验证短链配置，获取完整信息

#### 请求参数

Query参数:

| 参数 | 类型 | 必填 | 说明 | 备注 |
|-----|------|------|------|------|
| urlId | string | 是 | 短链id | - |

#### 响应参数

```json
{
  "status": 0,
  "message": "OK",
  "data": {
    "pc_url": "https://test-otd.woa.com/ma/TalentArchive?staffId=${staffid}",
    "mobile_url": "https://test-otd.woa.com/mma/MADetail?StaffID=${staffid}",
    "expire_time": -1,
    "url_rule": "r4",
    "url_id": "LyyUom",
    "app_id": "commonapp"
  }
}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| status | int | 状态码，0为成功 |
| message | string | 提示信息 |
| pc_url | string | PC端链接 |
| mobile_url | string | 移动端链接 |
| expire_time | int | 剩余有效时间(秒)，-1表示永久有效 |
| url_rule | string | 链接跳转规则 |
| url_id | string | 短链id |
| app_id | string | 应用ID |

#### 调用示例

**cURL**:
```bash
curl -X GET "https://sdc.qq.com/openapi/GetUrlParam?urlId=LyyUom" \
  -H "sdcapi-appid: app1" \
  -H "sdcapi-timestamp: 1655975172" \
  -H "sdcapi-ticket: 26cf1831ecb14ac68cfcf07c3c9ece9315a4812c491750790ea0492fec98a633"
```

**Java**:
```java
import java.security.MessageDigest;
import java.net.http.*;
import java.net.URI;

public class QueryShortUrlExample {
    public static void main(String[] args) throws Exception {
        String appId = "app1";
        String appSecret = "test";
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        
        // 计算签名
        String raw = appId + appSecret + timestamp;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(raw.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        String signature = hexString.toString();
        
        // 发送请求
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://sdc.qq.com/openapi/GetUrlParam?urlId=LyyUom"))
            .header("sdcapi-appid", appId)
            .header("sdcapi-timestamp", timestamp)
            .header("sdcapi-ticket", signature)
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println("短链信息: " + response.body());
    }
}
```

**Node.js**:
```javascript
const crypto = require('crypto');
const axios = require('axios');

async function getUrlInfo(urlId) {
    const appId = 'app1';
    const appSecret = 'test';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash('sha256')
        .update(appId + appSecret + timestamp)
        .digest('hex');
    
    const response = await axios.get(
        `https://sdc.qq.com/openapi/GetUrlParam?urlId=${urlId}`,
        {
            headers: {
                'sdcapi-appid': appId,
                'sdcapi-timestamp': timestamp,
                'sdcapi-ticket': signature
            }
        }
    );
    
    return response.data;
}

// 使用示例
getUrlInfo('LyyUom')
    .then(result => console.log('短链信息:', JSON.stringify(result, null, 2)))
    .catch(error => console.error('错误:', error));
```

## 数据契约

### URL跳转规则详解

`url_rule` 参数控制短链的跳转行为，支持以下规则:

| url_rule | 说明 | 使用场景 | 示例 |
|----------|------|---------|------|
| r0 | 在原始链接后追加访问url参数 | 需要传递额外参数 | 原链接：`https://hr.woa.com/?from=shorturi`<br/>短链：`https://sdc.qq.com/s/r3exsj?arg=123`<br/>最终：`https://hr.woa.com/?from=shorturi&arg=123` |
| r1 | 访问url参数替换原始链接url参数 | 需要覆盖原参数 | 原链接：`http://rcts.woa.com/TalentPerspective?from`<br/>短链：`https://ihr.tencent.com/1FD6a5/?arg=123`<br/>最终：`http://rcts.woa.com/TalentPerspective?arg=123` |
| r2 | 访问path参数转为原始链接url参数值 | 使用路径传参 | 原链接：`http://hr.oa.com/hrportal/Calendar?month`<br/>短链：`https://ihr.tencent.com/w8AFnM/6`<br/>最终：`http://hr.oa.com/hrportal/Calendar?month=6` |
| r3 | link参数重定向 | 动态重定向 | 访问：`https://ihr.tencent.com/url?link=http%3A%2F%2Flearn.woa.com%2F`<br/>最终：`http://learn.woa.com/` |
| r4 | 占位符`${xx}`使用访问url参数替换 | 模板化链接 | 原链接：`https://mooc.woa.com/course/${id}`<br/>短链：`https://ihr.tencent.com/r4/TPs54H/?id=1990`<br/>最终：`https://mooc.woa.com/course/1990` |

### 有效期说明

- `expire_time` 单位为秒
- 不传或传`0`表示永久有效
- 更新接口中传`-1`表示设置为永久有效
- 查询接口返回的`expire_time`为剩余有效时间，`-1`表示永久有效

**常用时间**:
- 1小时: `3600`
- 1天: `86400`
- 7天: `604800`
- 30天: `2592000`

### 短链ID规范

- **长度**: 3-8位字符
- **字符范围**: 字母(大小写)和数字
- **唯一性**: 全局唯一，重复会报错
- **生成方式**: 
  - 自定义: 通过`url_id`参数指定
  - 自动生成: 不传`url_id`参数，系统随机生成

### PC/移动端链接规则

- `pc_url`和`mobile_url`不能同时为空
- 只提供`pc_url`: 移动端访问也跳转到`pc_url`
- 只提供`mobile_url`: PC端访问也跳转到`mobile_url`
- 同时提供: 系统根据User-Agent自动选择

### 域名白名单

短链服务仅支持白名单内的域名，当前支持的域名包括:

| 域名 | 说明 |
|------|------|
| qq.com | 腾讯集团域名(含子域名) |
| tencent.com | 腾讯集团域名(含子域名) |
| woa.com | 集团内部系统域名(含子域名) |
| oa.com | 集团内网域名(含子域名) |
| yunassess.com | 云评估及测试环境(含子域名) |
| ihr.tencent-cloud.com | TAS平台系统 |
| tcloudbaseapp.com | 腾讯云函数 |
| tencent.peakon.com | 集团海外问卷调查 |

**白名单规则**:
- 支持域名本身及所有子域名
- 例如: `yunassess.com`、`test.yunassess.com`、`s.test.yunassess.com`均支持

需要添加新域名请联系接口人。

### 短地址访问入口

**生产环境**:
- `https://sdc.qq.com/s/`
- `https://sdc.qq.com/ihr/`
- `https://ihr.tencent.com`

**测试环境**:
- `http://s.test.yunassess.com/s/`
- `http://s.test.yunassess.com/ihr/`
- `http://ihr.test.yunassess.com`

## 错误处理

### 状态码说明

| status | 说明 | 处理建议 |
|--------|------|----------|
| 0 | 处理成功 | 正常处理返回数据 |
| 非0 | 处理失败 | 查看message字段获取具体错误信息 |

### 常见错误场景及解决方案

#### 1. 签名验证失败

**错误表现**: 
- `status != 0`
- `message`: 签名验证失败相关提示

**可能原因**:
- 签名计算错误
- 时间戳过期(超过3分钟)
- AppID或AppSecret错误
- 字符串拼接顺序错误

**解决方案**:
1. 检查签名算法: `SHA256(AppID + AppSecret + sdcapi-timestamp)`
2. 确保时间戳是UTC时间，精确到秒
3. 验证时间戳在3分钟有效期内
4. 确认AppID和AppSecret正确
5. 检查是否有额外空格或换行符

**调试建议**:
```javascript
// 记录签名计算过程
console.log('AppID:', appId);
console.log('Timestamp:', timestamp);
console.log('Raw String:', appId + appSecret + timestamp);
console.log('Signature:', signature);
```

#### 2. 域名不在白名单

**错误表现**:
- `status != 0`
- `message`: 域名不在白名单相关提示

**解决方案**:
- 确认源链接域名是否在白名单内
- 联系接口人添加域名到白名单
- 检查域名拼写是否正确

#### 3. 短链ID已存在

**错误表现**:
- `status != 0`
- `message`: 短链ID已存在相关提示

**解决方案**:
- 更换`url_id`值
- 不传`url_id`参数，让系统自动生成
- 查询现有短链ID信息，确认是否可以复用

#### 4. 参数校验失败

**错误表现**:
- `status != 0`
- `message`: 参数错误相关提示

**常见情况**:
- `pc_url`和`mobile_url`同时为空
- URL格式不正确
- `url_id`长度不符合要求(3-8位)
- `expire_time`格式错误

**解决方案**:
1. 至少提供一个URL参数(`pc_url`或`mobile_url`)
2. 检查URL格式是否正确(需包含协议`http://`或`https://`)
3. 确保`url_id`长度在3-8位之间
4. 确保`expire_time`为正整数或-1

#### 5. 短链不存在

**错误表现**:
- 查询或更新时提示短链不存在

**解决方案**:
- 确认`url_id`是否正确
- 检查短链是否已被删除
- 确认是否在正确的环境(生产/测试)

#### 6. 时间戳过期

**错误表现**:
- `status != 0`
- `message`: 时间戳过期相关提示

**解决方案**:
- 确保每次请求生成新的时间戳
- 检查服务器时间是否准确
- 避免重复使用旧的签名

## 最佳实践

### 推荐做法

#### 1. 签名安全

✅ **推荐**:
- AppSecret存储在服务端，不要硬编码在客户端代码中
- 建议在服务端生成签名，前端调用服务端接口获取
- 定期更换AppSecret

❌ **不推荐**:
- 在前端直接暴露AppSecret
- 将AppSecret提交到代码仓库
- 多个应用共用一个AppSecret

**示例(服务端生成签名)**:
```javascript
// 服务端接口
app.post('/api/generate-short-url', async (req, res) => {
    const { pcUrl, mobileUrl, expireTime } = req.body;
    
    // 在服务端计算签名
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash('sha256')
        .update(APP_ID + APP_SECRET + timestamp)
        .digest('hex');
    
    // 调用短链服务
    const response = await axios.post(
        'https://sdc.qq.com/openapi/GetShortUrl',
        { pc_url: pcUrl, mobile_url: mobileUrl, expire_time: expireTime },
        {
            headers: {
                'sdcapi-appid': APP_ID,
                'sdcapi-timestamp': timestamp,
                'sdcapi-ticket': signature,
                'Content-Type': 'application/json'
            }
        }
    );
    
    res.json(response.data);
});
```

#### 2. 时间戳管理

✅ **推荐**:
- 每次请求生成新的时间戳
- 使用UTC时间
- 确保服务器时间准确(使用NTP同步)

❌ **不推荐**:
- 重复使用同一个时间戳
- 使用本地时区时间
- 缓存签名和时间戳

#### 3. URL编码

✅ **推荐**:
```javascript
// GET请求中的url参数必须进行URL编码
const url = encodeURIComponent('https://example.com/path?param=value');
const apiUrl = `https://sdc.qq.com/openapi/GetWeChatRedirectKeyByURL?url=${url}`;
```

❌ **不推荐**:
```javascript
// 直接使用未编码的URL
const apiUrl = `https://sdc.qq.com/openapi/GetWeChatRedirectKeyByURL?url=https://example.com/path?param=value`;
```

#### 4. 有效期设置

✅ **推荐**:
- 临时分享建议设置较短有效期(如7天: 604800秒)
- 长期使用可设置为永久有效
- 根据业务需求合理设置有效期

❌ **不推荐**:
- 所有短链都设置为永久有效
- 有效期设置过短导致频繁失效

**示例**:
```javascript
// 临时分享(7天)
const tempShortUrl = await createShortUrl({
    pcUrl: 'https://example.com',
    expireTime: 604800
});

// 长期使用(永久)
const permanentShortUrl = await createShortUrl({
    pcUrl: 'https://example.com',
    expireTime: 0  // 或不传此参数
});
```

#### 5. 错误处理

✅ **推荐**:
```javascript
async function createShortUrl(pcUrl, mobileUrl, expireTime) {
    try {
        const response = await axios.post(url, data, { headers });
        
        // 始终检查status字段
        if (response.data.status === 0) {
            return response.data.data;
        } else {
            // 根据错误信息进行处理
            throw new Error(`创建短链失败: ${response.data.message}`);
        }
    } catch (error) {
        // 实现重试机制(签名过期等可重试错误)
        if (isRetryableError(error)) {
            return await createShortUrl(pcUrl, mobileUrl, expireTime);
        }
        throw error;
    }
}
```

❌ **不推荐**:
```javascript
// 不检查status直接使用data
const shortUrl = response.data.data;  // 可能为undefined
```

#### 6. 自定义短链ID

✅ **推荐**:
- 使用有意义的ID便于管理(如: `promo2024`, `annual`)
- 确保ID的唯一性
- 长度控制在3-8位

❌ **不推荐**:
- 使用过于简单的ID(如: `abc`, `123`)容易冲突
- 使用超过8位的ID
- 使用特殊字符

#### 7. 批量操作

✅ **推荐**:
```javascript
// 控制并发数
const urls = [...];  // 需要生成短链的URL列表
const concurrency = 10;  // 并发数

async function batchCreateShortUrls(urls) {
    const results = [];
    for (let i = 0; i < urls.length; i += concurrency) {
        const batch = urls.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map(url => createShortUrl(url))
        );
        results.push(...batchResults);
        
        // 避免超过QPS限制，适当延迟
        if (i + concurrency < urls.length) {
            await sleep(100);  // 延迟100ms
        }
    }
    return results;
}
```

❌ **不推荐**:
```javascript
// 无限制并发
const results = await Promise.all(urls.map(url => createShortUrl(url)));
```

### 反模式(不推荐的做法)

#### ❌ 1. 在前端直接暴露AppSecret

**风险**: AppSecret泄露导致安全问题

**正确做法**: 在后端生成签名

#### ❌ 2. 不检查响应状态直接使用data

**风险**: 可能使用错误数据导致程序异常

**正确做法**: 先判断`status == 0`再使用data

#### ❌ 3. 使用过期的时间戳重复请求

**风险**: 请求失败

**正确做法**: 每次请求生成新的时间戳和签名

#### ❌ 4. 不对URL进行编码直接传递

**风险**: URL解析错误

**正确做法**: 使用`encodeURIComponent`编码

#### ❌ 5. 忽略QPS限制

**风险**: 请求被限流

**正确做法**: 控制请求频率，遵守QPS限制

#### ❌ 6. 缓存短链结果但不考虑有效期

**风险**: 使用已过期的短链

**正确做法**: 缓存时记录有效期，定期清理

## 性能建议

### QPS限制

| 环境 | QPS限制 | 说明 |
|-----|---------|------|
| OA-VPC生产环境 | 100 | 超过限制会被限流 |
| IDC生产环境 | 100 | 超过限制会被限流 |
| 其他环境 | 请咨询接口负责人 | - |

**超限处理**:
- 实现指数退避重试
- 使用队列进行削峰
- 预先生成短链并缓存

### 超时建议

| 场景 | 建议超时时间 | 说明 |
|-----|-------------|------|
| 正常调用 | 5-10秒 | 网络稳定环境 |
| 网络不稳定 | 15秒 | 公网环境 |
| 批量操作 | 30秒+ | 根据批量大小调整 |

### 批量操作建议

**场景**: 需要生成大量短链

**建议方案**:
1. 控制并发数(推荐10-20)
2. 使用队列进行削峰
3. 实现失败重试机制
4. 记录操作日志便于排查

**示例代码**:
```javascript
class ShortUrlBatchProcessor {
    constructor(concurrency = 10, qps = 90) {
        this.concurrency = concurrency;
        this.qps = qps;
        this.queue = [];
        this.processing = false;
    }
    
    async add(url) {
        return new Promise((resolve, reject) => {
            this.queue.push({ url, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.concurrency);
            const startTime = Date.now();
            
            const results = await Promise.allSettled(
                batch.map(item => 
                    createShortUrl(item.url)
                        .then(result => item.resolve(result))
                        .catch(error => item.reject(error))
                )
            );
            
            // 控制QPS
            const elapsed = Date.now() - startTime;
            const minInterval = (1000 / this.qps) * batch.length;
            if (elapsed < minInterval) {
                await sleep(minInterval - elapsed);
            }
        }
        
        this.processing = false;
    }
}

// 使用
const processor = new ShortUrlBatchProcessor(10, 90);
const urls = [...];  // 大量URL

for (const url of urls) {
    processor.add(url)
        .then(shortUrl => console.log('成功:', shortUrl))
        .catch(error => console.error('失败:', error));
}
```

### 缓存策略

**推荐方案**:
- 缓存已生成的短链，避免重复生成
- 缓存查询结果，减少API调用
- 注意缓存失效时间与短链有效期保持一致

**示例代码**:
```javascript
const cache = new Map();

async function getCachedShortUrl(pcUrl, mobileUrl, expireTime) {
    const cacheKey = `${pcUrl}_${mobileUrl}_${expireTime}`;
    
    // 检查缓存
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (cached.expireAt > Date.now()) {
            return cached.shortUrl;
        }
        cache.delete(cacheKey);
    }
    
    // 生成短链
    const shortUrl = await createShortUrl(pcUrl, mobileUrl, expireTime);
    
    // 存入缓存
    cache.set(cacheKey, {
        shortUrl,
        expireAt: expireTime > 0 
            ? Date.now() + expireTime * 1000 
            : Number.MAX_SAFE_INTEGER
    });
    
    return shortUrl;
}
```

## 完整SDK示例

### Java SDK

```java
package com.tencent.shorturl;

import java.security.MessageDigest;
import java.net.http.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

/**
 * 短链服务客户端
 * 
 * @author jeeliu
 * @version 1.0
 */
public class ShortUrlClient {
    private String appId;
    private String appSecret;
    private String baseUrl;
    private HttpClient httpClient;
    private Gson gson;
    
    public ShortUrlClient(String appId, String appSecret, String baseUrl) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.baseUrl = baseUrl;
        this.httpClient = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    /**
     * 生成签名
     */
    private String generateSignature(String timestamp) throws Exception {
        String raw = appId + appSecret + timestamp;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    /**
     * 获取请求头
     */
    private Map<String, String> getHeaders() throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String signature = generateSignature(timestamp);
        
        Map<String, String> headers = new HashMap<>();
        headers.put("sdcapi-appid", appId);
        headers.put("sdcapi-timestamp", timestamp);
        headers.put("sdcapi-ticket", signature);
        return headers;
    }
    
    /**
     * 生成短链
     * 
     * @param pcUrl PC端链接
     * @param mobileUrl 移动端链接
     * @param expireTime 有效时间(秒)
     * @param urlRule 跳转规则
     * @param urlId 自定义短链ID
     * @return 短链地址
     * @throws Exception 生成失败时抛出异常
     */
    public String createShortUrl(String pcUrl, String mobileUrl, Integer expireTime, 
                                 String urlRule, String urlId) throws Exception {
        Map<String, String> headers = getHeaders();
        
        Map<String, Object> requestBody = new HashMap<>();
        if (pcUrl != null) requestBody.put("pc_url", pcUrl);
        if (mobileUrl != null) requestBody.put("mobile_url", mobileUrl);
        if (expireTime != null) requestBody.put("expire_time", expireTime);
        if (urlRule != null) requestBody.put("url_rule", urlRule);
        if (urlId != null) requestBody.put("url_id", urlId);
        
        String jsonBody = gson.toJson(requestBody);
        
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/GetShortUrl"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody));
        
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            requestBuilder.header(entry.getKey(), entry.getValue());
        }
        
        HttpRequest request = requestBuilder.build();
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        Map<String, Object> result = gson.fromJson(response.body(), Map.class);
        
        int status = ((Double) result.get("status")).intValue();
        if (status == 0) {
            return (String) result.get("data");
        } else {
            throw new RuntimeException("创建短链失败: " + result.get("message"));
        }
    }
    
    /**
     * 更新短链
     */
    public String updateShortUrl(String urlId, String pcUrl, String mobileUrl, 
                                 Integer expireTime, String urlRule) throws Exception {
        Map<String, String> headers = getHeaders();
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("url_id", urlId);
        if (pcUrl != null) requestBody.put("pc_url", pcUrl);
        if (mobileUrl != null) requestBody.put("mobile_url", mobileUrl);
        if (expireTime != null) requestBody.put("expire_time", expireTime);
        if (urlRule != null) requestBody.put("url_rule", urlRule);
        
        String jsonBody = gson.toJson(requestBody);
        
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/UpdateShortUrl"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody));
        
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            requestBuilder.header(entry.getKey(), entry.getValue());
        }
        
        HttpRequest request = requestBuilder.build();
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        Map<String, Object> result = gson.fromJson(response.body(), Map.class);
        
        int status = ((Double) result.get("status")).intValue();
        if (status == 0) {
            return (String) result.get("data");
        } else {
            throw new RuntimeException("更新短链失败: " + result.get("message"));
        }
    }
    
    /**
     * 失效短链
     */
    public String invalidateShortUrl(String urlId) throws Exception {
        Map<String, String> headers = getHeaders();
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("url_id", urlId);
        
        String jsonBody = gson.toJson(requestBody);
        
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/InvalidateShortUrl"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody));
        
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            requestBuilder.header(entry.getKey(), entry.getValue());
        }
        
        HttpRequest request = requestBuilder.build();
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        Map<String, Object> result = gson.fromJson(response.body(), Map.class);
        
        int status = ((Double) result.get("status")).intValue();
        if (status == 0) {
            return (String) result.get("data");
        } else {
            throw new RuntimeException("失效短链失败: " + result.get("message"));
        }
    }
    
    /**
     * 查询短链信息
     */
    public Map<String, Object> getUrlInfo(String urlId) throws Exception {
        Map<String, String> headers = getHeaders();
        
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/GetUrlParam?urlId=" + urlId))
            .GET();
        
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            requestBuilder.header(entry.getKey(), entry.getValue());
        }
        
        HttpRequest request = requestBuilder.build();
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        Map<String, Object> result = gson.fromJson(response.body(), Map.class);
        
        int status = ((Double) result.get("status")).intValue();
        if (status == 0) {
            return (Map<String, Object>) result.get("data");
        } else {
            throw new RuntimeException("查询失败: " + result.get("message"));
        }
    }
}

// 使用示例
public class Main {
    public static void main(String[] args) {
        try {
            ShortUrlClient client = new ShortUrlClient(
                "your_app_id",
                "your_app_secret",
                "https://sdc.qq.com/openapi"
            );
            
            // 创建短链
            String shortUrl = client.createShortUrl(
                "https://example.com/pc",
                "https://example.com/mobile",
                604800,
                "r0",
                null
            );
            System.out.println("生成的短链: " + shortUrl);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Python SDK

```python
import hashlib
import requests
import time
from typing import Optional, Dict, Any

class ShortUrlClient:
    """短链服务客户端"""
    
    def __init__(self, app_id: str, app_secret: str, base_url: str):
        """
        初始化客户端
        
        Args:
            app_id: 应用ID
            app_secret: 应用密钥
            base_url: 服务基础URL
        """
        self.app_id = app_id
        self.app_secret = app_secret
        self.base_url = base_url
    
    def _generate_signature(self, timestamp: str) -> str:
        """生成签名"""
        raw = f"{self.app_id}{self.app_secret}{timestamp}"
        return hashlib.sha256(raw.encode()).hexdigest()
    
    def _get_headers(self) -> Dict[str, str]:
        """获取请求头"""
        timestamp = str(int(time.time()))
        signature = self._generate_signature(timestamp)
        return {
            'sdcapi-appid': self.app_id,
            'sdcapi-timestamp': timestamp,
            'sdcapi-ticket': signature
        }
    
    def create_short_url(self, 
                        pc_url: Optional[str] = None,
                        mobile_url: Optional[str] = None,
                        expire_time: Optional[int] = None,
                        url_rule: Optional[str] = None,
                        url_id: Optional[str] = None) -> str:
        """
        创建短链
        
        Args:
            pc_url: PC端链接
            mobile_url: 移动端链接
            expire_time: 有效时间(秒)
            url_rule: 跳转规则(r0-r4)
            url_id: 自定义短链ID(3-8位)
            
        Returns:
            短链地址
            
        Raises:
            Exception: 创建失败时抛出异常
        """
        url = f"{self.base_url}/GetShortUrl"
        headers = self._get_headers()
        headers['Content-Type'] = 'application/json'
        
        data = {}
        if pc_url:
            data['pc_url'] = pc_url
        if mobile_url:
            data['mobile_url'] = mobile_url
        if expire_time is not None:
            data['expire_time'] = expire_time
        if url_rule:
            data['url_rule'] = url_rule
        if url_id:
            data['url_id'] = url_id
        
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        
        if result['status'] == 0:
            return result['data']
        else:
            raise Exception(f"创建短链失败: {result['message']}")
    
    def update_short_url(self,
                        url_id: str,
                        pc_url: Optional[str] = None,
                        mobile_url: Optional[str] = None,
                        expire_time: Optional[int] = None,
                        url_rule: Optional[str] = None) -> str:
        """更新短链"""
        url = f"{self.base_url}/UpdateShortUrl"
        headers = self._get_headers()
        headers['Content-Type'] = 'application/json'
        
        data = {'url_id': url_id}
        if pc_url:
            data['pc_url'] = pc_url
        if mobile_url:
            data['mobile_url'] = mobile_url
        if expire_time is not None:
            data['expire_time'] = expire_time
        if url_rule:
            data['url_rule'] = url_rule
        
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        
        if result['status'] == 0:
            return result['data']
        else:
            raise Exception(f"更新短链失败: {result['message']}")
    
    def invalidate_short_url(self, url_id: str) -> str:
        """失效短链"""
        url = f"{self.base_url}/InvalidateShortUrl"
        headers = self._get_headers()
        headers['Content-Type'] = 'application/json'
        
        data = {'url_id': url_id}
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        
        if result['status'] == 0:
            return result['data']
        else:
            raise Exception(f"失效短链失败: {result['message']}")
    
    def get_url_info(self, url_id: str) -> Dict[str, Any]:
        """查询短链信息"""
        url = f"{self.base_url}/GetUrlParam?urlId={url_id}"
        headers = self._get_headers()
        
        response = requests.get(url, headers=headers)
        result = response.json()
        
        if result['status'] == 0:
            return result['data']
        else:
            raise Exception(f"查询失败: {result['message']}")

# 使用示例
if __name__ == '__main__':
    client = ShortUrlClient(
        app_id='your_app_id',
        app_secret='your_app_secret',
        base_url='https://sdc.qq.com/openapi'
    )
    
    try:
        # 创建短链
        short_url = client.create_short_url(
            pc_url='https://example.com/pc',
            mobile_url='https://example.com/mobile',
            expire_time=604800
        )
        print(f'生成的短链: {short_url}')
        
    except Exception as e:
        print(f'错误: {e}')
```

### Node.js SDK

```javascript
const crypto = require('crypto');
const axios = require('axios');

/**
 * 短链服务客户端
 */
class ShortUrlClient {
    constructor(appId, appSecret, baseUrl) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.baseUrl = baseUrl;
    }
    
    /**
     * 生成签名
     */
    generateSignature(timestamp) {
        const raw = `${this.appId}${this.appSecret}${timestamp}`;
        return crypto.createHash('sha256').update(raw).digest('hex');
    }
    
    /**
     * 获取请求头
     */
    getHeaders() {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = this.generateSignature(timestamp);
        
        return {
            'sdcapi-appid': this.appId,
            'sdcapi-timestamp': timestamp,
            'sdcapi-ticket': signature
        };
    }
    
    /**
     * 创建短链
     */
    async createShortUrl({ pcUrl, mobileUrl, expireTime, urlRule, urlId }) {
        const url = `${this.baseUrl}/GetShortUrl`;
        const headers = {
            ...this.getHeaders(),
            'Content-Type': 'application/json'
        };
        
        const data = {};
        if (pcUrl) data.pc_url = pcUrl;
        if (mobileUrl) data.mobile_url = mobileUrl;
        if (expireTime !== undefined) data.expire_time = expireTime;
        if (urlRule) data.url_rule = urlRule;
        if (urlId) data.url_id = urlId;
        
        try {
            const response = await axios.post(url, data, { headers });
            const result = response.data;
            
            if (result.status === 0) {
                return result.data;
            } else {
                throw new Error(`创建短链失败: ${result.message}`);
            }
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }
    
    /**
     * 更新短链
     */
    async updateShortUrl({ urlId, pcUrl, mobileUrl, expireTime, urlRule }) {
        const url = `${this.baseUrl}/UpdateShortUrl`;
        const headers = {
            ...this.getHeaders(),
            'Content-Type': 'application/json'
        };
        
        const data = { url_id: urlId };
        if (pcUrl) data.pc_url = pcUrl;
        if (mobileUrl) data.mobile_url = mobileUrl;
        if (expireTime !== undefined) data.expire_time = expireTime;
        if (urlRule) data.url_rule = urlRule;
        
        try {
            const response = await axios.post(url, data, { headers });
            const result = response.data;
            
            if (result.status === 0) {
                return result.data;
            } else {
                throw new Error(`更新短链失败: ${result.message}`);
            }
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }
    
    /**
     * 失效短链
     */
    async invalidateShortUrl(urlId) {
        const url = `${this.baseUrl}/InvalidateShortUrl`;
        const headers = {
            ...this.getHeaders(),
            'Content-Type': 'application/json'
        };
        
        const data = { url_id: urlId };
        
        try {
            const response = await axios.post(url, data, { headers });
            const result = response.data;
            
            if (result.status === 0) {
                return result.data;
            } else {
                throw new Error(`失效短链失败: ${result.message}`);
            }
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }
    
    /**
     * 查询短链信息
     */
    async getUrlInfo(urlId) {
        const url = `${this.baseUrl}/GetUrlParam?urlId=${urlId}`;
        const headers = this.getHeaders();
        
        try {
            const response = await axios.get(url, { headers });
            const result = response.data;
            
            if (result.status === 0) {
                return result.data;
            } else {
                throw new Error(`查询失败: ${result.message}`);
            }
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }
}

module.exports = ShortUrlClient;

// 使用示例
(async () => {
    const client = new ShortUrlClient(
        'your_app_id',
        'your_app_secret',
        'https://sdc.qq.com/openapi'
    );
    
    try {
        const shortUrl = await client.createShortUrl({
            pcUrl: 'https://example.com/pc',
            mobileUrl: 'https://example.com/mobile',
            expireTime: 604800
        });
        console.log('生成的短链:', shortUrl);
    } catch (error) {
        console.error('错误:', error.message);
    }
})();
```

## 常见问题 FAQ

### Q1: 如何获取AppID和AppSecret?

**A**: 联系接口负责人jeeliu(刘志杰)注册应用信息，会为您分配AppID和AppSecret。

申请时需提供:
- 应用名称和描述
- 应用负责人和联系方式
- 使用场景说明

### Q2: 签名验证总是失败怎么办?

**A**: 请按以下步骤排查:

1. 确认签名算法正确: `SHA256(AppID + AppSecret + sdcapi-timestamp)`
2. 确保时间戳是UTC时间，精确到秒
3. 检查时间戳是否在3分钟有效期内
4. 确认AppID和AppSecret正确无误
5. 检查是否有多余的空格或换行符
6. 确认签名结果为小写十六进制字符串

**调试技巧**:
```javascript
console.log('AppID:', appId);
console.log('AppSecret:', appSecret);  // 注意:生产环境不要打印
console.log('Timestamp:', timestamp);
console.log('Raw String:', appId + appSecret + timestamp);
console.log('Signature:', signature);
```

### Q3: 可以生成永久有效的短链吗?

**A**: 可以。有两种方式:

1. 不传`expire_time`参数
2. 传`expire_time=0`

两种方式都会生成永久有效的短链。

### Q4: 如何区分PC端和移动端访问?

**A**: 在创建短链时同时提供`pc_url`和`mobile_url`参数，系统会根据访问设备的User-Agent自动选择对应链接。

示例:
```javascript
const shortUrl = await client.createShortUrl({
    pc_url: 'https://example.com/pc/index.html',
    mobile_url: 'https://example.com/mobile/index.html'
});
```

### Q5: 短链ID可以自定义吗?

**A**: 可以。在创建短链时通过`url_id`参数指定，要求:

- 长度: 3-8位
- 字符: 字母(大小写)和数字
- 唯一性: 全局唯一，重复会报错

示例:
```javascript
const shortUrl = await client.createShortUrl({
    pc_url: 'https://example.com',
    url_id: 'promo24'  // 自定义ID
});
```

### Q6: 如何修改已生成的短链?

**A**: 使用更新短链接口`/UpdateShortUrl`，提供`url_id`和需要修改的字段:

```javascript
const result = await client.updateShortUrl({
    urlId: 'abc123',
    pcUrl: 'https://example.com/new',  // 新的PC端链接
    expireTime: -1  // 设置为永久有效
});
```

### Q7: 短链失效后还能恢复吗?

**A**: 不能。短链失效后无法恢复，需要重新生成。请谨慎使用失效接口。

### Q8: QPS限制是多少?

**A**: 

| 环境 | QPS限制 |
|-----|---------|
| OA-VPC生产环境 | 100 |
| IDC生产环境 | 100 |
| 其他环境 | 请咨询接口负责人 |

如需更高QPS，请联系接口负责人评估扩容。

### Q9: 支持批量生成短链吗?

**A**: 接口不直接支持批量操作，但可以通过客户端控制并发数进行批量调用。

建议:
- 控制并发数(推荐10-20)
- 遵守QPS限制
- 实现失败重试机制

参考"性能建议"章节的批量操作示例代码。

### Q10: 域名白名单如何添加?

**A**: 联系接口负责人jeeliu，提供以下信息:

- 需要添加的域名列表
- 域名用途说明
- 域名所属应用

域名添加后会支持该域名及其所有子域名。

### Q11: 唤起微信功能有什么限制?

**A**: 

1. 仅支持`sdc.qq.com`及其子域名
2. 短链唤起的微信webview只能打开登记的域名
3. 不支持新增域名
4. 不支持长按识别图片二维码
5. 不支持二次跳转到外链
6. 不支持唤起微信支付

如有唤起微信需求，请联系接口负责人开启。

### Q12: 如何选择合适的url_rule?

**A**: 根据业务需求选择:

| 需求 | 推荐规则 |
|-----|---------|
| 需要传递额外参数 | r0 |
| 需要覆盖原参数 | r1 |
| 使用路径传参 | r2 |
| 动态重定向 | r3 |
| 模板化链接(占位符) | r4 |

详细规则说明请参考"数据契约"章节。

## 特殊能力说明

### 唤起微信能力

**适用域名**: 仅限`sdc.qq.com`及其子域名

**功能限制**:
1. 短链唤起的微信webview只能打开登记的域名(`*.sdc.qq.com`, `iauth.wecity.qq.com`)
2. 其他域名无法打开，且不支持新增域名
3. 不支持长按识别图片二维码能力
4. 不支持二次跳转到外链
5. 不支持唤起微信支付能力

**开启方式**: 联系接口负责人jeeliu开启

### 唤起MOA能力

**适用域名**: woa域名

**功能**: 移动端浏览器打开时自动唤起MOA应用

## 联系方式

**接口负责人**: jeeliu(刘志杰)

**联系场景**:
- AppID和AppSecret申请
- 域名白名单添加
- 唤起微信能力开启
- 技术支持和问题咨询
- QPS扩容评估

**参考文档**: 
- 接入文档: https://iwiki.woa.com/p/4007101451
- 使用手册: https://iwiki.woa.com/p/4007094467

---

**文档版本**: v1.0  
**最后更新**: 2025-01-12  
**维护团队**: 基础组件组
