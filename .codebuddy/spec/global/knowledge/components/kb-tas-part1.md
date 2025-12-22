# TAS API 使用文档 - Part 1: 网关服务接口

[返回主文档](./kb-tas.md) | [Part 2: 数据服务中心](./kb-tas-part2.md) | [Part 3: 开放服务](./kb-tas-part3.md) | [Part 4: 天枢管理平台](./kb-tas-part4.md)

---

## 目录

- [网关服务概述](#网关服务概述)
- [支持的登录渠道](#支持的登录渠道)
- [获取用户身份信息](#获取用户身份信息)
- [网关保留路径](#网关保留路径)
- [企业微信JSAPI配置](#企业微信jsapi配置)
- [完整代码示例](#完整代码示例)

---

## 网关服务概述

### 核心职责

TAS登录网关为接入应用提供统一的多渠道登录认证服务,应用无需关心不同平台的登录差异,通过统一的HTTP请求头即可获取用户身份信息。

### 服务地址

| 环境 | 服务地址 |
|------|---------|
| 测试环境 | https://test-caagw.yunassess.com |
| 正式环境 | https://ihr.tencent-cloud.com |

### 业务价值

- **统一登录**: 一次接入支持6种登录方式
- **安全可靠**: 签名验证机制保证请求合法性
- **开发简单**: 通过HTTP Header透传用户信息
- **多端支持**: PC端、移动端、小程序全覆盖

---

## 支持的登录渠道

网关支持以下登录方式:

### 1. 手机号登录
- **适用场景**: PC端、移动端
- **登录方式**: 手机号 + 验证码
- **Header标识**: `Caagw-Login-Method: loginByMobile`

### 2. 邮箱登录
- **适用场景**: PC端、移动端
- **登录方式**: 邮箱 + 验证码
- **Header标识**: `Caagw-Login-Method: loginByEmail`

### 3. 企业微信自建应用
- **适用场景**: 企业微信客户端
- **登录方式**: OAuth授权静默登录
- **Header标识**: `Caagw-Platform: wxwork`

### 4. 企业微信第三方应用
- **适用场景**: 企业微信应用市场
- **登录方式**: OAuth授权静默登录
- **Header标识**: `Caagw-Platform: wxvendor`

### 5. 微信公众号
- **适用场景**: 微信公众号网页
- **登录方式**: 首次绑定手机号,后续OAuth静默登录
- **Header标识**: `Caagw-Platform: weixin`

### 6. 腾讯TOF登录
- **适用场景**: 公司办公网环境
- **登录方式**: TOF账号认证
- **Header标识**: `Caagw-Platform: pc`

---

## 获取用户身份信息

### 工作原理

用户通过网关登录后,网关会在转发请求到应用时,在HTTP请求头中注入用户身份信息。应用直接从请求头读取即可。

```
用户请求 --> 网关认证 --> 注入用户信息到Header --> 转发到应用
```

### 用户信息字段

以下字段从HTTP请求头(`request.headers`)中获取:

#### 核心字段(必有)

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| Caagw-Globalid | 用户全局ID(租户内唯一) | `1135769716854362113` |
| Caagw-Corpkey | 企业标识 | `tencent` |
| Caagw-Corpid | 企业标识(同Corpkey) | `tencent` |
| Caagw-Appkey | 应用标识 | `ehr` |
| Caagw-Signature | 用户信息签名(必须验证) | `a1b2c3d4...` |
| Caagw-Timestamp | Unix时间戳(秒) | `1730799202` |

#### 用户基础信息

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| Caagw-Username | 用户名(E人事英文名) | `zhangsan` |
| Caagw-Nickname | 用户昵称(平台昵称) | `张三` |
| Caagw-Headerimg | 用户头像URL | `http://...` |
| Caagw-Staffid | 人事系统ID | `100001` |

#### 企业信息

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| Caagw-Corpname | 企业名称 | `腾讯科技` |
| Caagw-Regionid | 园区标识 | `sz` |

#### 应用信息

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| Caagw-Extra-AppKey | 额外AppKey(体验环境) | `{ExtraAppKey}-ty-{CorpKey}` |
| Caagw-Version | 企业购买版本 | `standard` |
| Caagw-App-Version | 应用版本 | `薪云算薪版` |

#### 平台相关

| Header名称 | 说明 | 可选值 |
|-----------|------|--------|
| Caagw-Platform | 用户来源平台 | `weixin`/`wxwork`/`wxvendor`/`pc`/`qidian` |
| Caagw-Platform-Detail | 平台详情 | `wxwork-mobile`/`wxwork-pc` |
| Caagw-Openid | 第三方平台用户标识 | 微信公众号openid |
| Caagw-Unionid | 微信Unionid | 需绑定微信开放平台 |

#### C端用户专属

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| Caagw-Login-Name | C端登录标识 | 手机号/邮箱 |
| Caagw-Login-Nation-Code | 手机号国家码 | `86`/`852` |
| Caagw-User-Type | 用户类型 | `tob`/`toc` |
| Caagw-Login-Method | 登录方式 | `loginByMobile`/`loginByEmail` |

#### 扩展字段

| Header名称 | 说明 |
|-----------|------|
| Caagw-ExtendsInfo | 应用用户扩展字段(JSON) |
| Caagw-Staffcode | 员工code |

### 签名验证(必须)

为保证请求合法性,**必须验证**`Caagw-Signature`字段:

**签名算法**:
```
Caagw-Signature = SHA256(
    Caagw-Globalid + 
    Caagw-Corpkey + 
    Caagw-Corpid + 
    Caagw-Timestamp + 
    AppToken
)
```

**验证示例(Node.js)**:
```javascript
const crypto = require('crypto');

function verifySignature(headers, appToken) {
    const globalId = headers['caagw-globalid'];
    const corpKey = headers['caagw-corpkey'];
    const corpId = headers['caagw-corpid'];
    const timestamp = headers['caagw-timestamp'];
    const signature = headers['caagw-signature'];
    
    const expectedSig = crypto
        .createHash('sha256')
        .update(globalId + corpKey + corpId + timestamp + appToken)
        .digest('hex');
    
    return signature === expectedSig;
}

// 使用示例
if (!verifySignature(request.headers, 'your_app_token')) {
    return response.status(401).json({ error: '签名验证失败' });
}
```

**验证示例(Java)**:
```java
import org.apache.commons.codec.digest.DigestUtils;

public boolean verifySignature(HttpHeaders headers, String appToken) {
    String globalId = headers.getFirst("Caagw-Globalid");
    String corpKey = headers.getFirst("Caagw-Corpkey");
    String corpId = headers.getFirst("Caagw-Corpid");
    String timestamp = headers.getFirst("Caagw-Timestamp");
    String signature = headers.getFirst("Caagw-Signature");
    
    String expectedSig = DigestUtils.sha256Hex(
        globalId + corpKey + corpId + timestamp + appToken
    );
    
    return expectedSig.equals(signature);
}
```

---

## 网关保留路径

网关提供以下保留路径供应用调用:

### 1. 登录地址

**路径**: `GET /_login`

**功能**: 主动跳转到登录页,已登录用户直接重定向

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| url | string | 否 | 登录成功后跳转地址,默认为`Referer` |
| tob | string | 否 | `tob=1`表示需要身份鉴权 |
| toc | string | 否 | `toc=1`表示不校验租户成员 |

**使用示例**:
```javascript
// 跳转到登录页,成功后返回指定页面
location.href = '/_login?url=' + encodeURIComponent('/dashboard');

// B端用户登录(需鉴权)
location.href = '/_login?tob=1&url=/admin';

// C端用户登录(不校验租户)
location.href = '/_login?toc=1&url=/profile';
```

### 2. 退出登录地址

**路径**: `GET /_logout`

**功能**: 注销用户登录态,清理Cookie

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| url | string | 否 | 注销后跳转地址,默认为`Referer` |

**使用示例**:
```javascript
// 退出登录后跳转到首页
location.href = '/_logout?url=' + encodeURIComponent('/');
```

### 3. 获取租户导航菜单

**路径**: `GET /_caagw/getNavInfoByCorpKey`

**功能**: 获取租户购买的应用菜单列表

**响应示例**:
```json
{
  "code": "0",
  "msg": "ok",
  "success": true,
  "data": {
    "corpName": "腾讯HRSDC测试",
    "menus": [
      {
        "appKey": "contacts",
        "appName": "人事通讯录",
        "appUrl": "http://contacts-wxvendor.test-caagw.yunassess.com/"
      },
      {
        "appKey": "regist",
        "appName": "入职管理",
        "appUrl": "http://regist-wxvendor.test-caagw.yunassess.com/pc/"
      }
    ],
    "homeUrl": "http://assistant-wxvendor.test-caagw.yunassess.com/management",
    "guideUrl": "http://assistant-wxvendor.test-caagw.yunassess.com/management/guide",
    "appStoreUrl": "http://assistant-wxvendor.test-caagw.yunassess.com/",
    "userMenus": [
      {
        "name": "智能客服",
        "url": "http://assistant-wxvendor.test-caagw.yunassess.com/",
        "target": "_blank"
      }
    ]
  }
}
```

**响应字段说明**:

| 字段 | 说明 |
|-----|------|
| corpName | 租户名称 |
| menus | 应用菜单列表 |
| menus[].appKey | 应用标识 |
| menus[].appName | 应用名称 |
| menus[].appUrl | 应用跳转地址 |
| homeUrl | 首页地址(应用市场渠道) |
| guideUrl | 操作指南地址 |
| appStoreUrl | 商品中心地址 |
| userMenus | 用户下拉菜单 |
| userMenus[].name | 菜单名称 |
| userMenus[].url | 菜单地址 |
| userMenus[].target | 打开方式(`_blank`/`_self`) |

**使用示例(Vue.js)**:
```javascript
async function fetchAppMenus() {
    const response = await axios.get('/_caagw/getNavInfoByCorpKey');
    
    if (response.data.success) {
        const { corpName, menus } = response.data.data;
        
        // 渲染应用菜单
        this.appMenus = menus.map(menu => ({
            name: menu.appName,
            icon: menu.appKey,
            url: menu.appUrl
        }));
        
        console.log(`${corpName}共购买${menus.length}个应用`);
    }
}
```

### 4. 获取用户头像

**路径**: `GET /_caagw/avatar?user={username}`

**功能**: 获取租户用户头像图片

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| user | string | 是 | 用户名(Username) |

**使用示例**:
```html
<!-- 直接作为图片src -->
<img src="/_caagw/avatar?user=zhangsan" alt="用户头像" />
```

---

## 企业微信JSAPI配置

### 获取企业微信JSTicket配置

**路径**: `GET /_caagw/wxwork/getWxworkJSAPIConfig`

**功能**: 获取企业微信JSAPI所需的配置参数,用于调用企业微信JSSDK

**适用场景**:
- 在企业微信中调用分享、地理位置、扫一扫等功能
- 需要使用企业微信原生能力的H5页面

**响应示例**:
```json
{
    "code": "200",
    "success": true,
    "msg": "",
    "data": {
        "corpId": "ww440979ea20645651",
        "agentId": 1000245,
        "nonceStr": "1617007354",
        "timestamp": "1617007354",
        "wxSign": "b5215e4744f8267ea247394f3d1185ff4017e68d",
        "agentSign": "88b200ec1dcf1313860f7b6840d224cd9e96d579"
    }
}
```

**响应字段说明**:

| 字段 | 说明 |
|-----|------|
| corpId | 企业微信租户标识 |
| agentId | 应用在租户侧的AgentId |
| nonceStr | 随机字符串 |
| timestamp | 时间戳 |
| wxSign | `wx.config`用的签名 |
| agentSign | `wx.agentConfig`用的签名 |

**完整使用示例**:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
</head>
<body>
    <button onclick="scanQRCode()">扫一扫</button>
    
    <script>
    // 1. 获取JSAPI配置
    fetch('/_caagw/wxwork/getWxworkJSAPIConfig')
        .then(res => res.json())
        .then(result => {
            if (!result.success) {
                console.error('获取配置失败:', result.msg);
                return;
            }
            
            const config = result.data;
            
            // 2. 初始化wx.config
            wx.config({
                beta: true,
                debug: false,
                appId: config.corpId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.wxSign,
                jsApiList: [
                    'scanQRCode',
                    'getLocation',
                    'chooseImage'
                ]
            });
            
            // 3. 初始化wx.agentConfig
            wx.agentConfig({
                corpid: config.corpId,
                agentid: config.agentId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.agentSign,
                jsApiList: [
                    'scanQRCode',
                    'getLocation',
                    'chooseImage'
                ],
                success: function() {
                    console.log('企业微信JSAPI初始化成功');
                },
                fail: function(err) {
                    console.error('企业微信JSAPI初始化失败:', err);
                }
            });
        });
    
    // 4. 调用企业微信JSAPI
    function scanQRCode() {
        wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode", "barCode"],
            success: function(res) {
                const result = res.resultStr;
                alert('扫描结果: ' + result);
            },
            fail: function(err) {
                console.error('扫描失败:', err);
            }
        });
    }
    </script>
</body>
</html>
```

---

## 完整代码示例

### Express.js中间件示例

```javascript
const crypto = require('crypto');
const url = require('url');

/**
 * TAS网关用户认证中间件
 */
function tasAuthMiddleware(appToken) {
    return (req, res, next) => {
        // 1. 解码Header(RFC-2396标准)
        const decodeHeader = (key) => {
            const value = req.headers[key.toLowerCase()];
            return value ? url.pathUnescape(value) : null;
        };
        
        // 2. 提取用户信息
        const user = {
            globalId: decodeHeader('Caagw-Globalid'),
            username: decodeHeader('Caagw-Username'),
            nickname: decodeHeader('Caagw-Nickname'),
            corpKey: decodeHeader('Caagw-Corpkey'),
            corpName: decodeHeader('Caagw-Corpname'),
            appKey: decodeHeader('Caagw-Appkey'),
            platform: decodeHeader('Caagw-Platform'),
            userType: decodeHeader('Caagw-User-Type'),
            timestamp: decodeHeader('Caagw-Timestamp'),
            signature: decodeHeader('Caagw-Signature')
        };
        
        // 3. 验证签名
        const expectedSig = crypto
            .createHash('sha256')
            .update(
                user.globalId + 
                user.corpKey + 
                user.corpKey + 
                user.timestamp + 
                appToken
            )
            .digest('hex');
        
        if (user.signature !== expectedSig) {
            return res.status(401).json({
                success: false,
                code: '401',
                msg: '签名验证失败'
            });
        }
        
        // 4. 挂载到request对象
        req.tasUser = user;
        next();
    };
}

// 使用示例
const express = require('express');
const app = express();

app.use(tasAuthMiddleware('your_app_token'));

app.get('/api/userInfo', (req, res) => {
    res.json({
        success: true,
        data: {
            username: req.tasUser.username,
            nickname: req.tasUser.nickname,
            company: req.tasUser.corpName
        }
    });
});

app.listen(3000);
```

### Spring Boot拦截器示例

```java
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

@Component
public class TasAuthInterceptor implements HandlerInterceptor {
    
    private static final String APP_TOKEN = "your_app_token";
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {
        
        // 1. 解码并获取Header
        String globalId = decodeHeader(request, "Caagw-Globalid");
        String corpKey = decodeHeader(request, "Caagw-Corpkey");
        String corpId = decodeHeader(request, "Caagw-Corpid");
        String timestamp = decodeHeader(request, "Caagw-Timestamp");
        String signature = decodeHeader(request, "Caagw-Signature");
        
        // 2. 验证签名
        String expectedSig = DigestUtils.sha256Hex(
            globalId + corpKey + corpId + timestamp + APP_TOKEN
        );
        
        if (!expectedSig.equals(signature)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\":false,\"msg\":\"签名验证失败\"}");
            return false;
        }
        
        // 3. 构建用户信息对象
        TasUser user = TasUser.builder()
            .globalId(globalId)
            .username(decodeHeader(request, "Caagw-Username"))
            .nickname(decodeHeader(request, "Caagw-Nickname"))
            .corpKey(corpKey)
            .corpName(decodeHeader(request, "Caagw-Corpname"))
            .appKey(decodeHeader(request, "Caagw-Appkey"))
            .platform(decodeHeader(request, "Caagw-Platform"))
            .userType(decodeHeader(request, "Caagw-User-Type"))
            .build();
        
        // 4. 存储到请求属性
        request.setAttribute("tasUser", user);
        
        return true;
    }
    
    private String decodeHeader(HttpServletRequest request, String headerName) {
        String value = request.getHeader(headerName);
        if (value == null) {
            return null;
        }
        try {
            return URLDecoder.decode(value, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return value;
        }
    }
}

// 用户信息实体类
@Data
@Builder
public class TasUser {
    private String globalId;
    private String username;
    private String nickname;
    private String corpKey;
    private String corpName;
    private String appKey;
    private String platform;
    private String userType;
}

// Controller中使用
@RestController
@RequestMapping("/api")
public class UserController {
    
    @GetMapping("/profile")
    public Response getUserProfile(HttpServletRequest request) {
        TasUser user = (TasUser) request.getAttribute("tasUser");
        
        return Response.success(user);
    }
}
```

---

## 最佳实践

### 1. 安全建议

- ✅ **必须验证签名**: 每个请求都要验证`Caagw-Signature`
- ✅ **时间戳检查**: 验证`Caagw-Timestamp`在合理范围内(如5分钟)
- ✅ **AppToken保密**: 不要将AppToken硬编码或提交到代码仓库
- ✅ **HTTPS通信**: 生产环境必须使用HTTPS

### 2. 性能优化

- ✅ **缓存用户信息**: 在会话期间缓存用户基础信息
- ✅ **避免重复解码**: Header解码一次后缓存结果
- ✅ **异步日志**: 签名验证失败时异步记录日志

### 3. 错误处理

```javascript
// 统一错误处理
app.use((err, req, res, next) => {
    if (err.name === 'TasAuthError') {
        return res.status(401).json({
            success: false,
            code: '401',
            msg: err.message
        });
    }
    next(err);
});
```

### 4. 监控告警

建议监控以下指标:
- 签名验证失败率(正常应<0.01%)
- 401错误占比
- Header缺失情况
- 登录超时频率

---

## 常见问题

### Q1: Header中文乱码如何处理?

所有Header值都经过URL encode,必须先解码:

```javascript
// 错误
const nickname = headers['caagw-nickname']; // "%E5%BC%A0%E4%B8%89"

// 正确
const nickname = decodeURIComponent(headers['caagw-nickname']); // "张三"
```

### Q2: 如何区分用户来源平台?

通过`Caagw-Platform`和`Caagw-Platform-Detail`:

```javascript
const platform = headers['caagw-platform'];
const detail = headers['caagw-platform-detail'];

if (platform === 'wxwork') {
    if (detail === 'wxwork-mobile') {
        // 企业微信手机端
    } else if (detail === 'wxwork-pc') {
        // 企业微信PC端
    }
} else if (platform === 'weixin') {
    // 微信公众号
}
```

### Q3: TOB和TOC用户如何区分?

```javascript
const userType = headers['caagw-user-type'];

if (userType === 'tob') {
    // B端企业用户,有完整人事信息
    const staffId = headers['caagw-staffid'];
    const username = headers['caagw-username'];
} else if (userType === 'toc') {
    // C端个人用户,仅有登录标识
    const loginName = headers['caagw-login-name'];
    const loginMethod = headers['caagw-login-method'];
}
```

### Q4: Ajax请求401如何处理?

```javascript
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && 
            error.response?.data === '100000') {
            // 登录过期,刷新页面重新登录
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
```

---

**下一步**: 查看[Part 2: 数据服务中心接口文档](./kb-tas-part2.md)了解租户、应用、用户数据接口。

[返回主文档](./kb-tas.md)
