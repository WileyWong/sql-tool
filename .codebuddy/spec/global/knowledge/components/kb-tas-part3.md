# TAS API 使用文档 - Part 3: 开放服务接口

[返回主文档](./kb-tas.md) | [Part 1: 网关服务](./kb-tas-part1.md) | [Part 2: 数据服务中心](./kb-tas-part2.md) | [Part 4: 天枢管理平台](./kb-tas-part4.md)

---

## 目录

- [开放服务概述](#开放服务概述)
- [调用前准备](#调用前准备)
- [OAuth2.0鉴权流程](#oauth20鉴权流程)
- [API转发机制](#api转发机制)
- [响应结果加密](#响应结果加密)
- [完整代码示例](#完整代码示例)

---

## 开放服务概述

### 核心职责

开放服务为接入TAS的所有应用提供统一的OAuth2.0鉴权和API转发服务,允许第三方系统安全地调用TAS内部接口。

### 服务地址

| 环境 | 服务域名 |
|------|---------|
| 测试环境 | https://newapi.test-caagw.yunassess.com |
| 正式环境 | https://newapi.ihr.tencent-cloud.com |

### 业务价值

- **统一鉴权**: 基于OAuth2.0 Basic认证机制
- **安全转发**: 将公共接口安全开放到公网
- **灵活配置**: 支持响应数据加密
- **简化集成**: 标准化的API调用流程

### 工作原理

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  第三方系统  │ --> │  开放服务     │ --> │  内部API    │
│  获取Token   │     │  鉴权+转发    │     │  返回数据   │
└─────────────┘     └──────────────┘     └─────────────┘
```

**调用流程**:
1. 通过ClientID/ClientSecret获取AccessToken
2. 将AccessToken添加到API请求参数
3. 开放服务验证Token并转发请求
4. 返回结果(可选加密)

---

## 调用前准备

### 1. 申请凭证

联系TAS接口人(jeeliu)申请:

| 凭证类型 | 说明 | 示例 |
|---------|------|------|
| ClientID | 调用方唯一标识 | `client123` |
| ClientSecret | 调用方密钥 | `secret_abc_xyz` |
| 加密密钥(可选) | 响应结果加密密钥 | `encrypt_key_123` |
| 转发标识 | API转发路径前缀 | `/open/tdos` |

### 2. 说明调用接口

提供以下信息:
- 需要调用的内部API列表
- 预期QPS
- 是否需要响应加密
- 使用场景说明

### 3. 获取转发路径

**转发规则**:
```
实际调用地址 = 开放服务域名 + 转发标识 + 内部API路径 + ?access_token={token}
```

**示例**:
- 内部API: `http://newehrtenant.prodihrtas.com/api/ehrData/getAllStaffInfo`
- 转发标识: `/open/tdos`
- 实际调用: `https://newapi.ihr.tencent-cloud.com/open/tdos/api/ehrData/getAllStaffInfo?access_token=xxx`

---

## OAuth2.0鉴权流程

### 获取AccessToken

**接口路径**: `GET /api/token/get`

**认证方式**: Basic Auth

**请求头**:
```
Authorization: Basic {Base64(ClientID:ClientSecret)}
```

**Base64编码规则**:
```javascript
// 1. 拼接字符串
const credentials = clientId + ':' + clientSecret;

// 2. Base64编码
const encoded = Buffer.from(credentials).toString('base64');

// 3. 添加Basic前缀
const authHeader = 'Basic ' + encoded;
```

**请求示例**:
```http
GET /api/token/get HTTP/1.1
Host: newapi.ihr.tencent-cloud.com
Authorization: Basic Y2xpZW50MTIzOnNlY3JldF9hYmNfeHl6
```

**响应示例**:
```json
{
  "success": true,
  "code": 0,
  "msg": "success",
  "data": {
    "accessToken": "aVFzS005RVp5TnpQR1NwMHdFZDlSZDZpWFJMQ1d2UHBnNkJiZWdETjVoelNYN0VoRTIyMGlLV3hPWERTYk1ySA==",
    "expiresIn": 7200
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|-----|------|------|
| accessToken | string | 访问令牌 |
| expiresIn | number | 有效期(秒),默认7200秒(2小时) |

### Token管理策略

**建议实践**:

1. **提前刷新**: 在Token过期前5分钟刷新
2. **单例模式**: 全局共享同一个Token
3. **失败重试**: Token过期时自动重新获取
4. **本地缓存**: 缓存Token避免频繁请求

**Node.js示例**:
```javascript
class TokenManager {
    constructor(clientId, clientSecret, baseURL) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseURL = baseURL;
        this.token = null;
        this.expireTime = 0;
    }
    
    /**
     * 获取Token(自动缓存和刷新)
     */
    async getToken() {
        const now = Date.now() / 1000;
        
        // Token有效且未到刷新时间
        if (this.token && now < this.expireTime - 300) {
            return this.token;
        }
        
        // 获取新Token
        await this.refreshToken();
        return this.token;
    }
    
    /**
     * 刷新Token
     */
    async refreshToken() {
        const credentials = Buffer
            .from(`${this.clientId}:${this.clientSecret}`)
            .toString('base64');
        
        const response = await axios.get(
            `${this.baseURL}/api/token/get`,
            {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            }
        );
        
        if (response.data.success) {
            const { accessToken, expiresIn } = response.data.data;
            this.token = accessToken;
            this.expireTime = Date.now() / 1000 + expiresIn;
            
            console.log(`Token刷新成功,有效期至: ${new Date(this.expireTime * 1000)}`);
        } else {
            throw new Error(`获取Token失败: ${response.data.msg}`);
        }
    }
}

// 使用示例
const tokenManager = new TokenManager(
    'client123',
    'secret_abc_xyz',
    'https://newapi.ihr.tencent-cloud.com'
);

// 调用API前获取Token
const token = await tokenManager.getToken();
```

---

## API转发机制

### 调用方式

通过开放服务调用内部API:

**格式**:
```
{开放服务域名}/{转发标识}/{内部API路径}?access_token={AccessToken}&{其他参数}
```

**示例**:
```http
GET https://newapi.ihr.tencent-cloud.com/open/tdos/api/corpApp/getAppInfoByAppKey?access_token=xxx&appkey=ehr
```

### 完整调用流程

```javascript
const axios = require('axios');

class OpenAPIClient {
    constructor(config) {
        this.baseURL = config.baseURL;
        this.forwardMark = config.forwardMark;
        this.tokenManager = new TokenManager(
            config.clientId,
            config.clientSecret,
            config.baseURL
        );
    }
    
    /**
     * 通用API调用方法
     */
    async callAPI(path, params = {}, method = 'GET') {
        // 1. 获取AccessToken
        const accessToken = await this.tokenManager.getToken();
        
        // 2. 构建完整URL
        const url = `${this.baseURL}${this.forwardMark}${path}`;
        
        // 3. 添加access_token参数
        const requestParams = {
            ...params,
            access_token: accessToken
        };
        
        // 4. 发送请求
        try {
            const response = await axios({
                method,
                url,
                params: method === 'GET' ? requestParams : undefined,
                data: method === 'POST' ? params : undefined,
                params: method === 'POST' ? { access_token: accessToken } : undefined
            });
            
            return response.data;
        } catch (error) {
            // Token过期,重新获取
            if (error.response?.status === 401) {
                console.log('Token过期,重新获取...');
                await this.tokenManager.refreshToken();
                return this.callAPI(path, params, method);
            }
            throw error;
        }
    }
    
    /**
     * GET请求
     */
    async get(path, params = {}) {
        return this.callAPI(path, params, 'GET');
    }
    
    /**
     * POST请求
     */
    async post(path, data = {}) {
        return this.callAPI(path, data, 'POST');
    }
}

// 使用示例
const client = new OpenAPIClient({
    baseURL: 'https://newapi.ihr.tencent-cloud.com',
    forwardMark: '/open/tdos',
    clientId: 'client123',
    clientSecret: 'secret_abc_xyz'
});

// 调用API
const result = await client.get('/api/corpApp/getAppInfoByAppKey', {
    appkey: 'ehr'
});

console.log('应用信息:', result.data);
```

### 转发示例

**数据服务中心API转发**:

| 内部API | 转发后地址 |
|--------|-----------|
| `/api/corpApp/getAppInfoByAppKey` | `https://newapi.ihr.tencent-cloud.com/open/tdos/api/corpApp/getAppInfoByAppKey?access_token=xxx&appkey=ehr` |
| `/api/pfuser/getByMobile` | `https://newapi.ihr.tencent-cloud.com/open/tdos/api/pfuser/getByMobile?access_token=xxx&corpkey=tencent&mobile=138xxx` |

---

## 响应结果加密

### 加密机制

开放服务支持对API响应结果进行AES加密(可选功能,需提前配置)。

**加密算法**: AES/ECB/PKCS7Padding  
**编码格式**: UTF-8  
**密钥生成**: 对API密钥进行两次SHA1 Hash取前16位

### 密钥生成算法

**Java实现**:
```java
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class AESKeyGenerator {
    
    /**
     * 生成AES密钥
     * @param password API密钥
     * @return AES SecretKey
     */
    private static SecretKeySpec getSecretKey(String password) {
        try {
            KeyGenerator kg = KeyGenerator.getInstance("AES");
            
            // 使用SHA1PRNG算法生成随机数
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
            random.setSeed(password.getBytes());
            
            // 初始化密钥生成器(128位)
            kg.init(128, random);
            
            // 生成密钥
            SecretKey secretKey = kg.generateKey();
            
            return new SecretKeySpec(secretKey.getEncoded(), "AES");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("生成AES密钥失败", e);
        }
    }
}
```

**Golang实现**:
```go
import (
    "crypto/sha1"
)

func getAesKey(password string) []byte {
    // 两次SHA1 Hash
    h := sha1.New()
    h.Write([]byte(password))
    result := h.Sum(nil)
    
    h.Reset()
    h.Write(result)
    result = h.Sum(nil)
    
    // 取前16位作为AES密钥
    return result[:16]
}
```

### 解密响应数据

**Node.js解密示例**:
```javascript
const crypto = require('crypto');

class ResponseDecryptor {
    constructor(apiKey) {
        this.aesKey = this.generateAESKey(apiKey);
    }
    
    /**
     * 生成AES密钥
     */
    generateAESKey(password) {
        // 两次SHA1 Hash
        let hash = crypto.createHash('sha1').update(password).digest();
        hash = crypto.createHash('sha1').update(hash).digest();
        
        // 取前16字节
        return hash.slice(0, 16);
    }
    
    /**
     * 解密响应数据
     */
    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv(
            'aes-128-ecb',
            this.aesKey,
            null // ECB模式不需要IV
        );
        
        decipher.setAutoPadding(true); // PKCS7Padding
        
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }
}

// 使用示例
const decryptor = new ResponseDecryptor('your_api_key');

// API返回的加密数据
const encryptedResponse = 'aVFzS005RVp5TnpQR1NwMHdFZDlSZDZpWFJMQ1d2UHBnNkJiZWdETjVoelNYN0VoRTIyMGlLV3hPWERTYk1ySA==';

// 解密
const decryptedData = decryptor.decrypt(encryptedResponse);
console.log('解密后数据:', decryptedData);
```

**Java解密示例**:
```java
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class ResponseDecryptor {
    
    private final SecretKeySpec secretKey;
    
    public ResponseDecryptor(String apiKey) {
        this.secretKey = getSecretKey(apiKey);
    }
    
    /**
     * 解密响应数据
     */
    public String decrypt(String encryptedData) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            
            byte[] encrypted = Base64.getDecoder().decode(encryptedData);
            byte[] decrypted = cipher.doFinal(encrypted);
            
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("解密失败", e);
        }
    }
    
    /**
     * 生成AES密钥(同上面的getSecretKey方法)
     */
    private static SecretKeySpec getSecretKey(String password) {
        // ... (代码同上)
    }
}

// 使用示例
ResponseDecryptor decryptor = new ResponseDecryptor("your_api_key");
String decryptedData = decryptor.decrypt(encryptedResponse);
System.out.println("解密后数据: " + decryptedData);
```

---

## 完整代码示例

### 企业级Node.js客户端

```javascript
const axios = require('axios');
const crypto = require('crypto');

/**
 * TAS开放服务客户端
 */
class TasOpenAPIClient {
    constructor(config) {
        this.baseURL = config.baseURL;
        this.forwardMark = config.forwardMark;
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.enableEncryption = config.enableEncryption || false;
        this.apiKey = config.apiKey;
        
        // Token管理
        this.accessToken = null;
        this.tokenExpireTime = 0;
        
        // 解密器
        if (this.enableEncryption) {
            this.decryptor = new ResponseDecryptor(this.apiKey);
        }
    }
    
    /**
     * 获取AccessToken
     */
    async getAccessToken() {
        const now = Date.now() / 1000;
        
        // Token有效且未到刷新时间(提前5分钟刷新)
        if (this.accessToken && now < this.tokenExpireTime - 300) {
            return this.accessToken;
        }
        
        // 刷新Token
        await this.refreshToken();
        return this.accessToken;
    }
    
    /**
     * 刷新AccessToken
     */
    async refreshToken() {
        const credentials = Buffer
            .from(`${this.clientId}:${this.clientSecret}`)
            .toString('base64');
        
        try {
            const response = await axios.get(
                `${this.baseURL}/api/token/get`,
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    },
                    timeout: 10000
                }
            );
            
            if (response.data.success) {
                const { accessToken, expiresIn } = response.data.data;
                this.accessToken = accessToken;
                this.tokenExpireTime = Date.now() / 1000 + expiresIn;
                
                console.log(`[TAS] Token刷新成功,有效期: ${expiresIn}秒`);
            } else {
                throw new Error(`获取Token失败: ${response.data.msg}`);
            }
        } catch (error) {
            console.error('[TAS] Token刷新失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 通用API调用
     */
    async request(options) {
        const {
            path,
            method = 'GET',
            params = {},
            data = null,
            headers = {}
        } = options;
        
        // 获取Token
        const accessToken = await this.getAccessToken();
        
        // 构建URL
        const url = `${this.baseURL}${this.forwardMark}${path}`;
        
        // 添加access_token参数
        const requestParams = {
            ...params,
            access_token: accessToken
        };
        
        try {
            const response = await axios({
                method,
                url,
                params: requestParams,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                timeout: 30000
            });
            
            let responseData = response.data;
            
            // 如果启用加密,解密响应数据
            if (this.enableEncryption && typeof responseData === 'string') {
                responseData = this.decryptor.decrypt(responseData);
            }
            
            return responseData;
        } catch (error) {
            // Token过期,重试一次
            if (error.response?.status === 401 && !options._retry) {
                console.log('[TAS] Token过期,重新获取...');
                await this.refreshToken();
                return this.request({ ...options, _retry: true });
            }
            
            console.error('[TAS] API调用失败:', error.message);
            throw error;
        }
    }
    
    /**
     * GET请求
     */
    async get(path, params = {}) {
        return this.request({ path, method: 'GET', params });
    }
    
    /**
     * POST请求
     */
    async post(path, data = {}, params = {}) {
        return this.request({ path, method: 'POST', data, params });
    }
}

/**
 * 响应解密器
 */
class ResponseDecryptor {
    constructor(apiKey) {
        this.aesKey = this.generateAESKey(apiKey);
    }
    
    generateAESKey(password) {
        let hash = crypto.createHash('sha1').update(password).digest();
        hash = crypto.createHash('sha1').update(hash).digest();
        return hash.slice(0, 16);
    }
    
    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv('aes-128-ecb', this.aesKey, null);
        decipher.setAutoPadding(true);
        
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }
}

// 使用示例
const client = new TasOpenAPIClient({
    baseURL: 'https://newapi.ihr.tencent-cloud.com',
    forwardMark: '/open/tdos',
    clientId: 'client123',
    clientSecret: 'secret_abc_xyz',
    enableEncryption: false, // 是否启用响应加密
    apiKey: 'your_api_key'   // 加密密钥(启用加密时需要)
});

// 示例1: 获取应用信息
(async () => {
    try {
        const result = await client.get('/api/corpApp/getAppInfoByAppKey', {
            appkey: 'ehr'
        });
        console.log('应用信息:', result.data);
    } catch (error) {
        console.error('获取应用信息失败:', error.message);
    }
})();

// 示例2: 批量获取用户信息
(async () => {
    try {
        const result = await client.post(
            '/api/pfuser/getByGlobalid',
            ['1156918441379106817', '1156918442150858753'],
            { corpkey: 'tencent' }
        );
        console.log('用户信息:', result.data);
    } catch (error) {
        console.error('获取用户信息失败:', error.message);
    }
})();
```

### Python客户端示例

```python
import base64
import hashlib
import hmac
import time
import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import json

class TasOpenAPIClient:
    """TAS开放服务Python客户端"""
    
    def __init__(self, config):
        self.base_url = config['base_url']
        self.forward_mark = config['forward_mark']
        self.client_id = config['client_id']
        self.client_secret = config['client_secret']
        self.enable_encryption = config.get('enable_encryption', False)
        self.api_key = config.get('api_key', '')
        
        self.access_token = None
        self.token_expire_time = 0
        
        if self.enable_encryption:
            self.aes_key = self._generate_aes_key(self.api_key)
    
    def _generate_aes_key(self, password):
        """生成AES密钥"""
        hash1 = hashlib.sha1(password.encode()).digest()
        hash2 = hashlib.sha1(hash1).digest()
        return hash2[:16]
    
    def get_access_token(self):
        """获取AccessToken"""
        now = time.time()
        
        # Token有效且未到刷新时间
        if self.access_token and now < self.token_expire_time - 300:
            return self.access_token
        
        # 刷新Token
        self.refresh_token()
        return self.access_token
    
    def refresh_token(self):
        """刷新AccessToken"""
        credentials = base64.b64encode(
            f'{self.client_id}:{self.client_secret}'.encode()
        ).decode()
        
        response = requests.get(
            f'{self.base_url}/api/token/get',
            headers={'Authorization': f'Basic {credentials}'},
            timeout=10
        )
        
        result = response.json()
        if result['success']:
            self.access_token = result['data']['accessToken']
            self.token_expire_time = time.time() + result['data']['expiresIn']
            print(f'[TAS] Token刷新成功')
        else:
            raise Exception(f'获取Token失败: {result["msg"]}')
    
    def decrypt(self, encrypted_data):
        """解密响应数据"""
        cipher = AES.new(self.aes_key, AES.MODE_ECB)
        decrypted = unpad(
            cipher.decrypt(base64.b64decode(encrypted_data)),
            AES.block_size
        )
        return json.loads(decrypted.decode('utf-8'))
    
    def request(self, method, path, params=None, data=None):
        """通用API请求"""
        # 获取Token
        access_token = self.get_access_token()
        
        # 构建URL
        url = f'{self.base_url}{self.forward_mark}{path}'
        
        # 添加access_token参数
        if params is None:
            params = {}
        params['access_token'] = access_token
        
        # 发送请求
        try:
            response = requests.request(
                method,
                url,
                params=params,
                json=data,
                timeout=30
            )
            
            result = response.json()
            
            # 解密(如果启用)
            if self.enable_encryption and isinstance(result, str):
                result = self.decrypt(result)
            
            return result
        except requests.exceptions.RequestException as e:
            print(f'[TAS] API调用失败: {e}')
            raise
    
    def get(self, path, params=None):
        """GET请求"""
        return self.request('GET', path, params=params)
    
    def post(self, path, data=None, params=None):
        """POST请求"""
        return self.request('POST', path, params=params, data=data)

# 使用示例
client = TasOpenAPIClient({
    'base_url': 'https://newapi.ihr.tencent-cloud.com',
    'forward_mark': '/open/tdos',
    'client_id': 'client123',
    'client_secret': 'secret_abc_xyz',
    'enable_encryption': False,
    'api_key': 'your_api_key'
})

# 获取应用信息
result = client.get('/api/corpApp/getAppInfoByAppKey', params={'appkey': 'ehr'})
print('应用信息:', result['data'])

# 批量获取用户
result = client.post(
    '/api/pfuser/getByGlobalid',
    data=['1156918441379106817', '1156918442150858753'],
    params={'corpkey': 'tencent'}
)
print('用户信息:', result['data'])
```

---

## 最佳实践

### 1. Token管理

✅ **推荐做法**:
```javascript
// 单例模式,全局共享Token
const globalClient = new TasOpenAPIClient(config);

// 提前刷新,避免请求时Token过期
setInterval(() => {
    globalClient.refreshToken().catch(console.error);
}, 1.5 * 60 * 60 * 1000); // 每1.5小时刷新一次(Token有效期2小时)
```

❌ **避免做法**:
```javascript
// 每次请求都创建新客户端
const client = new TasOpenAPIClient(config);
await client.get('/api/xxx'); // 每次都要获取Token,效率低
```

### 2. 错误处理

```javascript
async function callAPIWithRetry(client, path, params, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await client.get(path, params);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            console.log(`第${i + 1}次重试...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### 3. 性能优化

```javascript
// 批量请求并发执行
const promises = globalIdList.map(id => 
    client.get('/api/pfuser/getByGlobalid', { corpkey: 'tencent', globalid: id })
);
const results = await Promise.all(promises);

// 或使用批量接口
const results = await client.post('/api/pfuser/getByGlobalid', globalIdList, {
    corpkey: 'tencent'
});
```

---

## 常见问题

### Q1: 如何生成Basic Auth Header?

```javascript
const credentials = `${clientId}:${clientSecret}`;
const encoded = Buffer.from(credentials).toString('base64');
const authHeader = `Basic ${encoded}`;
```

### Q2: Token过期如何处理?

客户端代码已实现自动重试机制,Token过期时会自动刷新并重试请求。

### Q3: 响应加密是否必须?

非必须,根据业务安全需求决定。启用加密需提前配置加密密钥。

### Q4: 如何测试加密解密?

```javascript
const decryptor = new ResponseDecryptor('test_key');

// 加密(假设后端返回)
const encrypted = 'xxx';

// 解密
const decrypted = decryptor.decrypt(encrypted);
console.log(decrypted);
```

---

**下一步**: 查看[Part 4: 天枢管理平台接口文档](./kb-tas-part4.md)了解租户和应用管理接口。

[返回主文档](./kb-tas.md)
