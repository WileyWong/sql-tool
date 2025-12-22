# TAS API 使用文档 - Part 4: 天枢管理平台接口

[返回主文档](./kb-tas.md) | [Part 1: 网关服务](./kb-tas-part1.md) | [Part 2: 数据服务中心](./kb-tas-part2.md) | [Part 3: 开放服务](./kb-tas-part3.md)

---

## 目录

- [天枢管理平台概述](#天枢管理平台概述)
- [租户管理接口](#租户管理接口)
- [租户应用管理接口](#租户应用管理接口)
- [短信验证码接口](#短信验证码接口)
- [完整代码示例](#完整代码示例)

---

## 天枢管理平台概述

### 核心职责

天枢管理平台提供租户和应用的生命周期管理接口,包括租户创建、应用开通、配置管理等核心功能。

### 服务地址

| 环境 | VPC内网地址 | 公网地址 |
|------|------------|---------|
| 测试环境 | http://newehrtenant.testihrtas.com | https://newapi.test-caagw.yunassess.com/open/ehrtenant |
| 正式环境 | http://newehrtenant.prodihrtas.com | https://newapi.ihr.tencent-cloud.com/open/ehrtenant |

**说明**:
- VPC内网地址: 腾讯云VPC内可直接访问,需要基础鉴权
- 公网地址: 通过开放服务访问,需要OAuth2.0鉴权([参考Part 3](./kb-tas-part3.md))

### 业务价值

- **租户生命周期管理**: 创建、修改、禁用租户
- **应用开通管理**: 为租户开通应用、配置有效期
- **灵活配置**: 支持应用自定义配置项
- **短信服务**: 提供验证码发送和校验能力

---

## 租户管理接口

### 1. 创建租户

**接口路径**: `POST /openapi/corp/addCorpInfo`

**适用场景**: 创建新租户,分配企业标识(CorpKey)

**请求头**:

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| EHR-DATA-APPKEY | 应用AppKey | `mc` |
| EHR-DATA-TIMESTAMP | UTC时间戳(秒或毫秒) | `1730799202` |
| EHR-DATA-SIGNATURE | 应用签名(SHA256) | `f1dd037ad83bb679...` |

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识(唯一,建议英文小写) |
| corpName | string | 是 | 租户名称 |
| corpNameEn | string | 否 | 租户英文名称 |
| startTime | Date | 是 | 开始时间(格式: `YYYY-MM-DD HH:mm:ss`) |
| endTime | Date | 是 | 结束时间 |
| admin | string | 否 | 管理员英文名 |
| adminMobile | string | 否 | 管理员手机号 |
| adminEmail | string | 否 | 管理员邮箱 |
| tags | List<String> | 否 | 租户标签 |

**租户标签(tags)枚举值**:

| 标签值 | 说明 |
|-------|------|
| whollyOwnedSubsidiary | 腾讯全资子公司 |
| outsourcingSupplier | 腾讯外包供应商 |

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "corpName": "测试公司",
  "corpNameEn": "Test Corp",
  "startTime": "2025-01-01 00:00:00",
  "endTime": "2026-12-31 23:59:59",
  "admin": "zhangsan",
  "adminMobile": "13812345678",
  "adminEmail": "zhangsan@testcorp.com",
  "tags": ["whollyOwnedSubsidiary"]
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "",
  "data": ""
}
```

**注意事项**:
- `corpKey`必须全局唯一,建议使用公司英文简称
- `startTime`和`endTime`决定租户的有效期
- 租户创建后默认处于启用状态
- 管理员信息可后续通过开通应用时添加

### 2. 修改租户

**接口路径**: `POST /openapi/corp/modifyCorpInfo`

**适用场景**: 修改租户基础信息、延期、更换管理员等

**请求参数**: 与创建租户相同

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "corpName": "测试公司(更新)",
  "corpNameEn": "Test Corp Updated",
  "startTime": "2025-01-01 00:00:00",
  "endTime": "2027-12-31 23:59:59",
  "admin": "lisi",
  "adminMobile": "13987654321",
  "adminEmail": "lisi@testcorp.com",
  "tags": ["outsourcingSupplier"]
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "",
  "data": ""
}
```

**注意事项**:
- `corpKey`不可修改,通过corpKey定位租户
- 可单独修改某些字段,其他字段保持不变
- 修改`endTime`可实现租户延期
- 修改`tags`会覆盖原有标签

### 3. 禁用租户及其应用

**接口路径**: `POST /openapi/corp/disableCorpAndCorpApp`

**适用场景**: 禁用租户及其购买的所有应用

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string(Query) | 是 | 租户标识 |

**请求示例**:
```http
POST /openapi/corp/disableCorpAndCorpApp?corpKey=testcorp
EHR-DATA-APPKEY: mc
EHR-DATA-TIMESTAMP: 1730799202
EHR-DATA-SIGNATURE: f1dd037ad83bb6791eb4960087dda8435a1f60b51b92d43b314001cd70e38a41
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "",
  "data": ""
}
```

**注意事项**:
- 禁用租户会同时禁用该租户下的所有应用
- 禁用后用户无法登录
- 数据不会删除,可通过修改接口重新启用

---

## 租户应用管理接口

### 1. 开通租户应用

**接口路径**: `POST /openapi/corpApp/addCorpAppInfo`

**适用场景**: 为租户开通应用,配置应用管理员和自定义配置

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识 |
| appKey | string | 是 | 应用标识 |
| startTime | Date | 是 | 开始时间 |
| endTime | Date | 是 | 结束时间 |
| adminList | List | 是 | 应用管理员列表 |
| customConfig | List | 否 | 应用自定义配置 |

**adminList子对象**:

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识 |
| appKey | string | 是 | 应用标识 |
| engName | string | 是 | 英文名 |
| phone | string | 是 | 手机号 |
| email | string | 是 | 邮箱 |

**customConfig子对象**:

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| key | string | 是 | 配置项key |
| name | string | 是 | 配置项名称 |
| must | number | 是 | 是否必填: 0-否, 1-是 |
| value | string | 是 | 配置项值 |

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "appKey": "ehr",
  "startTime": "2025-01-01 00:00:00",
  "endTime": "2026-12-31 23:59:59",
  "adminList": [
    {
      "corpKey": "testcorp",
      "appKey": "ehr",
      "engName": "zhangsan",
      "phone": "13812345678",
      "email": "zhangsan@testcorp.com"
    }
  ],
  "customConfig": [
    {
      "key": "CaptchaSign",
      "name": "验证码短信签名",
      "must": 0,
      "value": "测试公司"
    },
    {
      "key": "CaptchaTmpl",
      "name": "验证码短信模板",
      "must": 0,
      "value": "ehr_login"
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "",
  "data": ""
}
```

**常见自定义配置项**:

| Key | 说明 | 示例值 |
|-----|------|--------|
| CaptchaSign | 验证码短信签名 | `腾讯科技` |
| CaptchaTmpl | 验证码短信模板编码 | `login_verify` |
| EnableSSO | 是否启用单点登录 | `true`/`false` |
| MaxUsers | 最大用户数 | `1000` |
| WhiteList | 白名单用户列表 | `admin,hr,finance` |

**注意事项**:
- 开通应用前租户必须已创建
- `adminList`至少包含一个管理员
- `customConfig`根据应用需求配置,非必填
- 同一租户同一应用不可重复开通

### 2. 修改租户应用

**接口路径**: `POST /openapi/corpApp/modifyCorpAppInfo`

**适用场景**: 修改应用有效期、管理员、自定义配置

**请求参数**: 与开通租户应用相同

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "appKey": "ehr",
  "startTime": "2025-01-01 00:00:00",
  "endTime": "2027-12-31 23:59:59",
  "adminList": [
    {
      "corpKey": "testcorp",
      "appKey": "ehr",
      "engName": "lisi",
      "phone": "13987654321",
      "email": "lisi@testcorp.com"
    }
  ],
  "customConfig": [
    {
      "key": "MaxUsers",
      "name": "最大用户数",
      "must": 1,
      "value": "2000"
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "",
  "data": ""
}
```

**注意事项**:
- 修改`endTime`可实现应用延期
- 修改`adminList`会覆盖原有管理员列表
- 修改`customConfig`会覆盖原有配置

---

## 短信验证码接口

### 1. 发送短信验证码

**接口路径**: `POST /openapi/SendCaptchaSMS`

**适用场景**: 用户登录、手机号验证等场景发送验证码

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识 |
| userId | string | 是 | 用户标识(GlobalID) |
| nationCode | string | 否 | 国际区号,默认`86` |
| mobile | string | 是 | 手机号 |
| tmplCode | string | 是 | 验证码模板编码(需提前配置) |
| sign | string | 否 | 短信签名,默认为模板配置的签名 |

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "userId": "1156918441379106817",
  "nationCode": "86",
  "mobile": "13812345678",
  "tmplCode": "login_verify",
  "sign": "测试公司"
}
```

**响应示例(成功)**:
```json
{
  "code": "200",
  "success": true,
  "msg": "验证码发送成功",
  "data": null
}
```

**响应示例(频繁操作)**:
```json
{
  "code": "207",
  "success": false,
  "msg": "验证码已发送, 请勿频繁操作",
  "data": null
}
```

**错误码说明**:

| 错误码 | 说明 |
|-------|------|
| 200 | 发送成功 |
| 207 | 频繁操作(60秒内重复发送) |
| 400 | 参数错误 |
| 500 | 服务异常 |

**注意事项**:
- `tmplCode`需提前联系接口人配置
- 同一手机号60秒内只能发送一次
- 验证码有效期5分钟
- 测试环境可能不实际发送短信

### 2. 校验短信验证码

**接口路径**: `POST /openapi/SubmitCaptchaSMS`

**适用场景**: 验证用户输入的验证码是否正确

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识 |
| userId | string | 是 | 用户标识(GlobalID) |
| nationCode | string | 否 | 国际区号,默认`86` |
| mobile | string | 是 | 手机号 |
| tmplCode | string | 是 | 验证码模板编码 |
| captcha | string | 是 | 验证码值 |

**请求示例**:
```json
{
  "corpKey": "testcorp",
  "userId": "1156918441379106817",
  "nationCode": "86",
  "mobile": "13812345678",
  "tmplCode": "login_verify",
  "captcha": "123456"
}
```

**响应示例(成功)**:
```json
{
  "code": "200",
  "success": true,
  "msg": "验证成功",
  "data": null
}
```

**响应示例(失败)**:
```json
{
  "code": "205",
  "success": false,
  "msg": "校验验证码失败",
  "data": null
}
```

**错误码说明**:

| 错误码 | 说明 |
|-------|------|
| 200 | 验证成功 |
| 205 | 验证码错误 |
| 206 | 验证码已过期 |
| 400 | 参数错误 |

**注意事项**:
- 验证码连续输错5次后锁定1小时
- 验证成功后验证码立即失效
- `tmplCode`必须与发送时一致

---

## 完整代码示例

### Node.js: 租户和应用生命周期管理

```javascript
const crypto = require('crypto');
const axios = require('axios');

/**
 * 天枢管理平台客户端
 */
class TenantManagementClient {
    constructor(config) {
        this.baseURL = config.baseURL;
        this.appKey = config.appKey;
        this.appToken = config.appToken;
    }
    
    /**
     * 生成签名
     */
    generateSignature(timestamp) {
        return crypto
            .createHash('sha256')
            .update(this.appKey + timestamp + this.appToken)
            .digest('hex');
    }
    
    /**
     * 获取请求头
     */
    getHeaders() {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        return {
            'EHR-DATA-APPKEY': this.appKey,
            'EHR-DATA-TIMESTAMP': timestamp,
            'EHR-DATA-SIGNATURE': this.generateSignature(timestamp),
            'Content-Type': 'application/json'
        };
    }
    
    /**
     * 创建租户
     */
    async createTenant(tenantInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/corp/addCorpInfo`,
                tenantInfo,
                { headers: this.getHeaders() }
            );
            
            if (response.data.success) {
                console.log(`租户 ${tenantInfo.corpKey} 创建成功`);
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('创建租户失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 修改租户
     */
    async updateTenant(tenantInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/corp/modifyCorpInfo`,
                tenantInfo,
                { headers: this.getHeaders() }
            );
            
            if (response.data.success) {
                console.log(`租户 ${tenantInfo.corpKey} 修改成功`);
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('修改租户失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 禁用租户
     */
    async disableTenant(corpKey) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/corp/disableCorpAndCorpApp`,
                null,
                {
                    params: { corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                console.log(`租户 ${corpKey} 已禁用`);
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('禁用租户失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 开通租户应用
     */
    async enableCorpApp(appInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/corpApp/addCorpAppInfo`,
                appInfo,
                { headers: this.getHeaders() }
            );
            
            if (response.data.success) {
                console.log(`租户 ${appInfo.corpKey} 应用 ${appInfo.appKey} 开通成功`);
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('开通应用失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 修改租户应用
     */
    async updateCorpApp(appInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/corpApp/modifyCorpAppInfo`,
                appInfo,
                { headers: this.getHeaders() }
            );
            
            if (response.data.success) {
                console.log(`租户 ${appInfo.corpKey} 应用 ${appInfo.appKey} 修改成功`);
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('修改应用失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 发送短信验证码
     */
    async sendCaptchaSMS(smsInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/SendCaptchaSMS`,
                smsInfo,
                { headers: this.getHeaders() }
            );
            
            console.log(`验证码发送${response.data.success ? '成功' : '失败'}: ${response.data.msg}`);
            return response.data;
        } catch (error) {
            console.error('发送验证码失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 校验短信验证码
     */
    async verifyCaptchaSMS(verifyInfo) {
        try {
            const response = await axios.post(
                `${this.baseURL}/openapi/SubmitCaptchaSMS`,
                verifyInfo,
                { headers: this.getHeaders() }
            );
            
            return response.data;
        } catch (error) {
            console.error('校验验证码失败:', error.message);
            throw error;
        }
    }
}

// 使用示例
const client = new TenantManagementClient({
    baseURL: 'https://newapi.ihr.tencent-cloud.com/open/ehrtenant',
    appKey: 'mc',
    appToken: 'your_app_token'
});

(async () => {
    try {
        // 1. 创建租户
        await client.createTenant({
            corpKey: 'testcorp',
            corpName: '测试公司',
            corpNameEn: 'Test Corp',
            startTime: '2025-01-01 00:00:00',
            endTime: '2026-12-31 23:59:59',
            admin: 'zhangsan',
            adminMobile: '13812345678',
            adminEmail: 'zhangsan@testcorp.com',
            tags: ['whollyOwnedSubsidiary']
        });
        
        // 2. 为租户开通应用
        await client.enableCorpApp({
            corpKey: 'testcorp',
            appKey: 'ehr',
            startTime: '2025-01-01 00:00:00',
            endTime: '2026-12-31 23:59:59',
            adminList: [
                {
                    corpKey: 'testcorp',
                    appKey: 'ehr',
                    engName: 'zhangsan',
                    phone: '13812345678',
                    email: 'zhangsan@testcorp.com'
                }
            ],
            customConfig: [
                {
                    key: 'CaptchaSign',
                    name: '验证码短信签名',
                    must: 0,
                    value: '测试公司'
                }
            ]
        });
        
        // 3. 发送验证码
        await client.sendCaptchaSMS({
            corpKey: 'testcorp',
            userId: '1156918441379106817',
            nationCode: '86',
            mobile: '13812345678',
            tmplCode: 'login_verify',
            sign: '测试公司'
        });
        
        // 4. 校验验证码
        const verifyResult = await client.verifyCaptchaSMS({
            corpKey: 'testcorp',
            userId: '1156918441379106817',
            nationCode: '86',
            mobile: '13812345678',
            tmplCode: 'login_verify',
            captcha: '123456'
        });
        
        if (verifyResult.success) {
            console.log('验证码校验成功');
        } else {
            console.log('验证码校验失败:', verifyResult.msg);
        }
        
    } catch (error) {
        console.error('操作失败:', error.message);
    }
})();
```

### Java: Spring Boot服务

```java
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TenantManagementService {
    
    private final RestTemplate restTemplate;
    private final String baseURL;
    private final String appKey;
    private final String appToken;
    
    public TenantManagementService() {
        this.restTemplate = new RestTemplate();
        this.baseURL = "https://newapi.ihr.tencent-cloud.com/open/ehrtenant";
        this.appKey = "mc";
        this.appToken = "your_app_token";
    }
    
    /**
     * 生成请求头
     */
    private HttpHeaders generateHeaders() {
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String signature = DigestUtils.sha256Hex(appKey + timestamp + appToken);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("EHR-DATA-APPKEY", appKey);
        headers.set("EHR-DATA-TIMESTAMP", timestamp);
        headers.set("EHR-DATA-SIGNATURE", signature);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        return headers;
    }
    
    /**
     * 创建租户
     */
    public void createTenant(TenantInfo tenantInfo) {
        String url = baseURL + "/openapi/corp/addCorpInfo";
        
        HttpEntity<TenantInfo> entity = new HttpEntity<>(tenantInfo, generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body == null || !(Boolean) body.get("success")) {
            throw new RuntimeException("创建租户失败: " + body.get("msg"));
        }
        
        System.out.println("租户 " + tenantInfo.getCorpKey() + " 创建成功");
    }
    
    /**
     * 开通租户应用
     */
    public void enableCorpApp(CorpAppInfo appInfo) {
        String url = baseURL + "/openapi/corpApp/addCorpAppInfo";
        
        HttpEntity<CorpAppInfo> entity = new HttpEntity<>(appInfo, generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body == null || !(Boolean) body.get("success")) {
            throw new RuntimeException("开通应用失败: " + body.get("msg"));
        }
        
        System.out.println("租户 " + appInfo.getCorpKey() + " 应用 " + appInfo.getAppKey() + " 开通成功");
    }
    
    /**
     * 发送验证码
     */
    public void sendCaptchaSMS(SMSInfo smsInfo) {
        String url = baseURL + "/openapi/SendCaptchaSMS";
        
        HttpEntity<SMSInfo> entity = new HttpEntity<>(smsInfo, generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        System.out.println("验证码发送: " + body.get("msg"));
    }
}

// 实体类
@Data
class TenantInfo {
    private String corpKey;
    private String corpName;
    private String corpNameEn;
    private String startTime;
    private String endTime;
    private String admin;
    private String adminMobile;
    private String adminEmail;
    private List<String> tags;
}

@Data
class CorpAppInfo {
    private String corpKey;
    private String appKey;
    private String startTime;
    private String endTime;
    private List<AdminInfo> adminList;
    private List<ConfigItem> customConfig;
}

@Data
class AdminInfo {
    private String corpKey;
    private String appKey;
    private String engName;
    private String phone;
    private String email;
}

@Data
class ConfigItem {
    private String key;
    private String name;
    private Integer must;
    private String value;
}

@Data
class SMSInfo {
    private String corpKey;
    private String userId;
    private String nationCode;
    private String mobile;
    private String tmplCode;
    private String sign;
}
```

---

## 最佳实践

### 1. 租户命名规范

```javascript
// 推荐: 使用公司英文简称,小写字母
corpKey: 'tencent'
corpKey: 'wxg'

// 不推荐: 包含特殊字符或过长
corpKey: 'tencent-cloud'  // 包含特殊字符
corpKey: 'tencentcloudcomputingcompany' // 过长
```

### 2. 时间格式处理

```javascript
// 统一使用格式化函数
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 使用示例
const startTime = formatDateTime(new Date('2025-01-01'));
const endTime = formatDateTime(new Date('2026-12-31 23:59:59'));
```

### 3. 验证码重试机制

```javascript
async function sendCaptchaWithRetry(client, smsInfo, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await client.sendCaptchaSMS(smsInfo);
            if (result.success) {
                return result;
            }
            
            // 频繁操作,等待后重试
            if (result.code === '207') {
                console.log('请求过于频繁,等待60秒...');
                await new Promise(resolve => setTimeout(resolve, 60000));
                continue;
            }
            
            throw new Error(result.msg);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`第${i + 1}次重试...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
```

### 4. 批量操作

```javascript
// 批量创建租户
async function batchCreateTenants(client, tenantList) {
    const results = [];
    
    for (const tenant of tenantList) {
        try {
            const result = await client.createTenant(tenant);
            results.push({ corpKey: tenant.corpKey, success: true });
            
            // 避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            results.push({ 
                corpKey: tenant.corpKey, 
                success: false, 
                error: error.message 
            });
        }
    }
    
    return results;
}
```

---

## 常见问题

### Q1: 租户CorpKey可以修改吗?

不可以。`corpKey`一旦创建不可修改,它是租户的唯一标识。如需更换,只能创建新租户并迁移数据。

### Q2: 如何延期租户或应用?

调用修改接口,更新`endTime`字段即可:
```javascript
await client.updateTenant({
    corpKey: 'testcorp',
    corpName: '测试公司',
    startTime: '2025-01-01 00:00:00',
    endTime: '2027-12-31 23:59:59' // 延期到2027年
});
```

### Q3: 验证码模板如何配置?

联系TAS接口人(jeeliu)申请配置,需提供:
- 模板编码(`tmplCode`)
- 模板内容(包含`{code}`占位符)
- 短信签名

### Q4: 如何为租户添加多个管理员?

在`adminList`中添加多个管理员对象:
```javascript
adminList: [
    {
        corpKey: 'testcorp',
        appKey: 'ehr',
        engName: 'zhangsan',
        phone: '13812345678',
        email: 'zhangsan@testcorp.com'
    },
    {
        corpKey: 'testcorp',
        appKey: 'ehr',
        engName: 'lisi',
        phone: '13987654321',
        email: 'lisi@testcorp.com'
    }
]
```

### Q5: 应用自定义配置有哪些常用项?

常见配置项参考:
- `CaptchaSign`: 验证码短信签名
- `CaptchaTmpl`: 验证码模板编码
- `EnableSSO`: 是否启用单点登录
- `MaxUsers`: 最大用户数限制
- `WhiteList`: 白名单用户

---

## 总结

本文档完整介绍了TAS天枢管理平台的租户管理、应用开通和短信验证码接口。通过这些接口,您可以:

✅ 创建和管理租户  
✅ 为租户开通和配置应用  
✅ 发送和校验短信验证码  
✅ 灵活配置应用参数

**重要提醒**:
- 所有操作需要正确的鉴权(签名验证)
- 租户`corpKey`全局唯一且不可修改
- 验证码有效期5分钟,60秒内不可重复发送
- 联系接口人申请`tmplCode`和加密密钥

---

[返回主文档](./kb-tas.md) | [Part 1: 网关服务](./kb-tas-part1.md) | [Part 2: 数据服务中心](./kb-tas-part2.md) | [Part 3: 开放服务](./kb-tas-part3.md)
