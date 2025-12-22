# TAS 应用接入服务使用文档

## 文档概述

本文档提供TAS(Tencent Application Service)系统的完整API使用指南,涵盖登录网关服务、数据服务中心、开放服务及天枢管理平台的所有对外接口。

**当前版本**: v1.0  
**维护团队**: HRSDC团队  
**接口人**: jeeliu

## 文档导航

本文档采用分卷结构,请根据需求查阅对应部分:

- **[Part 1: 网关服务接口](./kb-tas-part1.md)** - 登录网关、用户身份验证、多渠道登录
- **[Part 2: 数据服务中心接口](./kb-tas-part2.md)** - 租户应用管理、平台用户信息、数据看板
- **[Part 3: 开放服务接口](./kb-tas-part3.md)** - OAuth2.0鉴权、API转发、响应加密
- **[Part 4: 天枢管理平台接口](./kb-tas-part4.md)** - 租户管理、应用开通、短信验证码

## 系统简介

### 产品定位

TAS提供一套集登录网关服务和用户数据服务的多渠道应用上架解决方案,助力内部产品快速上云,实现产品一次接入、多渠道快速上线。

### 核心能力

**支持渠道**:
- 企业微信自建应用
- 企业微信第三方服务提供商
- 微信公众号平台
- 手机号+验证码统一登录
- 邮箱+验证码统一登录
- 腾讯TOF登录(办公网环境)

**核心服务**:
- **登录网关**: 多渠道统一登录认证
- **数据服务**: 人员、组织、岗位、汇报链等数据接口
- **开放服务**: OAuth2.0鉴权、API转发
- **租户管理**: 租户与应用的生命周期管理

### 三元模型

从多租户、场景解决方案能力、用户群体三个维度理解TAS:
- **多租户**: 支持企业级多租户隔离
- **解决方案**: 提供完整的应用上架解决方案
- **用户群体**: 服务B端企业用户和C端个人用户

## 快速开始

### 前置条件

1. **应用注册**: 在TAS平台注册应用,获取`AppKey`和`AppToken`
2. **域名配置**: 配置应用访问域名
3. **网络环境**: 确保可访问TAS服务地址

### 环境地址

| 环境 | 网关服务 | 数据服务 | 开放服务 |
|------|---------|---------|---------|
| 测试环境 | https://test-caagw.yunassess.com | http://newehrtenant.testihrtas.com | https://newapi.test-caagw.yunassess.com |
| 正式环境 | https://ihr.tencent-cloud.com | http://newehrtenant.prodihrtas.com | https://newapi.ihr.tencent-cloud.com |

### 基础接入流程

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  应用注册    │ --> │  配置网关     │ --> │  调用API    │
│  获取凭证    │     │  验证签名     │     │  获取数据   │
└─────────────┘     └──────────────┘     └─────────────┘
```

**步骤详解**:

1. **应用注册** (联系接口人: jeeliu)
   - 获取应用标识: `AppKey`
   - 获取应用凭证: `AppToken`
   - 确认接口权限范围

2. **验证签名** (所有API调用必须)
   ```
   Signature = SHA256(AppKey + Timestamp + AppToken)
   ```

3. **调用接口**
   - 设置请求头: `EHR-DATA-APPKEY`, `EHR-DATA-TIMESTAMP`, `EHR-DATA-SIGNATURE`
   - 发送请求获取数据

### 最简示例

#### 网关获取用户身份

```javascript
// 从HTTP请求头获取用户信息
const globalId = request.headers['Caagw-Globalid'];      // 用户全局ID
const username = request.headers['Caagw-Username'];       // 用户名
const corpKey = request.headers['Caagw-Corpkey'];        // 企业标识
const signature = request.headers['Caagw-Signature'];     // 签名

// 验证签名(必须)
const appToken = 'your_app_token';
const timestamp = request.headers['Caagw-Timestamp'];
const expectedSig = sha256(globalId + corpKey + corpKey + timestamp + appToken);

if (signature !== expectedSig) {
    throw new Error('签名验证失败');
}

console.log(`用户${username}登录成功`);
```

#### 调用数据服务API

```javascript
const crypto = require('crypto');
const axios = require('axios');

// 配置信息
const appKey = 'your_app_key';
const appToken = 'your_app_token';
const timestamp = Math.floor(Date.now() / 1000);

// 计算签名
const signature = crypto
    .createHash('sha256')
    .update(appKey + timestamp + appToken)
    .digest('hex');

// 调用API
const response = await axios.get(
    'https://ihr.tencent-cloud.com/api/corpApp/getAppInfoByAppKey',
    {
        params: { appkey: appKey },
        headers: {
            'EHR-DATA-APPKEY': appKey,
            'EHR-DATA-TIMESTAMP': timestamp,
            'EHR-DATA-SIGNATURE': signature
        }
    }
);

console.log('应用信息:', response.data);
```

## 接口规范

### 通用请求头

所有API调用必须包含以下请求头:

| Header名称 | 说明 | 示例值 |
|-----------|------|-------|
| EHR-DATA-APPKEY | 应用标识 | `mc` |
| EHR-DATA-TIMESTAMP | UTC时间戳(秒或毫秒) | `1730799202` |
| EHR-DATA-SIGNATURE | 签名(SHA256) | `f1dd037ad83bb679...` |

### 签名算法

```
EHR-DATA-SIGNATURE = SHA256(EHR-DATA-APPKEY + EHR-DATA-TIMESTAMP + AppToken)
```

**示例计算**:
```
AppToken = "token"
AppKey = "mc"
Timestamp = "1730799202"
Signature = SHA256("mc" + "1730799202" + "token")
         = "f1dd037ad83bb6791eb4960087dda8435a1f60b51b92d43b314001cd70e38a41"
```

### 通用响应格式

所有接口统一返回JSON格式:

```json
{
  "success": true,
  "code": "0",
  "msg": "成功",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| success | boolean | 请求是否成功 |
| code | string | 状态码,`0`或`200`表示成功 |
| msg | string | 提示信息 |
| data | object | 返回数据 |

## 注意事项

### Header编解码

所有Header字段值都会进行URL encode(RFC-2396标准),业务应用需要decode后使用:

```javascript
// 错误示例: 直接使用
const nickname = headers['Caagw-Nickname']; // "%E5%B9%B8%E8%BF%90%2052"

// 正确示例: 先解码
const nickname = decodeURIComponent(headers['Caagw-Nickname']); // "幸运 52"
```

### Ajax请求标识

所有Ajax请求必须添加请求头:
```
X-Requested-With: XMLHttpRequest
```

### 登录状态过期处理

- **Ajax请求**: 返回`401`状态码,响应体`100000`,需重定向到登录页
- **非Ajax请求**: 自动`307`重定向到授权登录页面

### 避免浏览器缓存

所有请求必须添加随机参数:
```javascript
// GET请求
axios.get('/api/account/Login?_=' + Date.now());

// 页面跳转
location.href = '/home?_=' + Date.now();
```

## 常见问题

### Q1: 如何获取AppKey和AppToken?

联系TAS接口人(jeeliu)申请应用注册,提供以下信息:
- 应用名称和描述
- 应用域名
- 需要调用的接口列表
- 应用负责人和联系方式

### Q2: 签名验证失败如何排查?

1. 检查`AppKey`和`AppToken`是否正确
2. 确认时间戳格式(秒级或毫秒级需统一)
3. 验证字符串拼接顺序: `AppKey + Timestamp + AppToken`
4. 确认使用SHA256算法且结果为小写十六进制
5. 检查是否有额外的空格或换行符

### Q3: 如何处理多渠道登录?

TAS网关会根据用户来源平台自动识别并返回`Caagw-Platform`字段:
- `weixin`: 微信公众号
- `wxwork`: 企业微信
- `wxvendor`: 企业微信第三方
- `pc`: PC端
- `qidian`: 企点QQ

业务应用可根据此字段进行差异化处理。

### Q4: 如何区分B端和C端用户?

通过`Caagw-User-Type`请求头判断:
- `tob`: B端企业用户
- `toc`: C端个人用户

### Q5: 接口调用有频率限制吗?

不同接口有不同的QPS限制,建议:
- 批量查询优于单次循环调用
- 合理使用缓存减少调用频率
- 高频接口联系接口人评估扩容

## 技术支持

- **接口人**: jeeliu
- **接入文档**: https://iwiki.woa.com/p/4007090747
- **问题反馈**: 通过企业微信联系接口人

## 版本历史

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2025-01 | 初始版本,整合网关、数据服务、开放服务文档 |

---

**下一步**: 请根据业务需求查阅对应的分卷文档了解详细API说明。
