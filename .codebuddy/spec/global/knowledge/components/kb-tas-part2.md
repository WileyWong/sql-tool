# TAS API 使用文档 - Part 2: 数据服务中心接口

[返回主文档](./kb-tas.md) | [Part 1: 网关服务](./kb-tas-part1.md) | [Part 3: 开放服务](./kb-tas-part3.md) | [Part 4: 天枢管理平台](./kb-tas-part4.md)

---

## 目录

- [数据服务概述](#数据服务概述)
- [请求鉴权](#请求鉴权)
- [1. 租户和应用相关接口](#1-租户和应用相关接口)
- [2. 平台用户信息接口](#2-平台用户信息接口)
- [3. 数据看板接口](#3-数据看板接口)
- [4. 应用安装回调接口](#4-应用安装回调接口)
- [完整代码示例](#完整代码示例)

---

## 数据服务概述

### 核心职责

HR数据服务中心为网关和各业务系统提供多个数据接口,包括:
- 租户和应用管理
- 平台用户信息
- 数据看板展示
- 应用安装状态

### 服务地址

| 环境 | VPC内网地址 |
|------|------------|
| 测试环境 | http://newehrtenant.testihrtas.com |
| 正式环境 | http://newehrtenant.prodihrtas.com |

**说明**: VPC内网地址在腾讯云VPC内可直接访问

---

## 请求鉴权

### 请求头

所有接口调用必须包含以下请求头用于身份校验:

| Header名称 | 说明 | 示例值 |
|-----------|------|--------|
| EHR-DATA-APPKEY | 应用AppKey(应用注册时确定的应用唯一标志) | `mc` |
| EHR-DATA-TIMESTAMP | UTC时间戳(精确到秒) | `1730799202` |
| EHR-DATA-SIGNATURE | 应用签名(SHA256) | `f1dd037ad83bb679...` |

### 应用签名算法

```
EHR-DATA-SIGNATURE = SHA256(EHR-DATA-APPKEY + EHR-DATA-TIMESTAMP + Token)
```

**注意**: Token由HR数据服务中心为各应用分配,用作数据调用凭证,请妥善保管。

### 响应格式

所有接口统一返回JSON格式:

```json
{
  "code": "0",
  "success": true,
  "msg": "ok",
  "data": {}
}
```

| 参数名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 是否成功: true为执行成功,false为执行失败 |
| msg | string | 提示信息,不管成功、失败,接口提示信息都在这里 |
| data | object | 所有接口的数据都放在这里 |
| code | string | 错误码,成功时为0 |

---

## 1. 租户和应用相关接口

### 1.1 根据corpkey获取该租户购买的所有应用列表

**接口路径**: `GET /api/corpApp/getCorpAppInfoListByCorpkey?corpkey=CORPKEY`

**适用场景**: 提供给公共服务使用,查询租户购买了哪些应用及配置

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |

**请求示例**:
```http
GET /api/corpApp/getCorpAppInfoListByCorpkey?corpkey=ecorehr
EHR-DATA-APPKEY: mc
EHR-DATA-TIMESTAMP: 1730799202
EHR-DATA-SIGNATURE: f1dd037ad83bb6791eb4960087dda8435a1f60b51b92d43b314001cd70e38a41
Content-Type: application/json
```

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "ecorehr",
      "corpName": "核心人事公司",
      "appKey": "ehr",
      "webSites": "ehr-ecorehr.ihr.tencent-cloud.com",
      "extendsConfig": "[{\"key\":\"白名单\",\"value\":\"ddd\"},{\"key\":\"管理员\",\"value\":\"\"}]",
      "startTime": "2019-09-20 00:00:00",
      "endTime": "2020-11-30 23:59:59",
      "wxTemplateConfig": "[{\"key\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"dda\"}]",
      "pcUrl": "/ddd/aa",
      "mobileUrl": "/mobile/aa",
      "appWebSites": "ehr-qidian.ihr.tencent-cloud.com",
      "logo": "http://www.xx.com/a.png",
      "corpType": 5
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| corpName | 租户名 |
| appKey | 应用标识 |
| webSites | 应用域名 |
| extendsConfig | 该租户对应的应用配置,由应用解析,这里只负责存储(JSON字符串) |
| startTime | 租户该应用的开始使用时间 |
| endTime | 租户该应用的过期时间 |
| wxTemplateConfig | 微信模板消息配置,由公共应用解析(JSON字符串) |
| pcUrl | 应用PC端首页url(相对路径) |
| mobileUrl | 移动端首页url(相对路径) |
| appWebSites | 应用内访问的WebSites |
| logo | 应用logo地址 |
| corpType | 租户类型: 0-老版本E人事渠道, 1-企业微信应用市场渠道, 2-企点QQ渠道, 3-新版E人事渠道, 4-微瓴渠道, 5-腾讯会议渠道, 10-特殊渠道 |

---

### 1.2 根据AppKey获取应用注册信息

**接口路径**: `GET /api/corpApp/getAppInfoByAppKey?appkey=ehr`

**适用场景**: 提供给公共服务使用,获取应用的全局注册信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| appkey | string(Query) | 是 | 应用标识 |

**请求示例**:
```http
GET /api/corpApp/getAppInfoByAppKey?appkey=ehr
EHR-DATA-APPKEY: mc
EHR-DATA-TIMESTAMP: 1730799202
EHR-DATA-SIGNATURE: f1dd037ad83bb6791eb4960087dda8435a1f60b51b92d43b314001cd70e38a41
Content-Type: application/json
```

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": {
    "appKey": "ehr",
    "webSites": "ehr.ihr.tencent-cloud.com",
    "appType": 1,
    "appToken": "dfdsfdg",
    "basedEhrFlag": 1,
    "extendsConfig": "",
    "appExtendsConfig": "[{\"key\":\"白名单\",\"value\":\"\"},{\"key\":\"管理员\",\"value\":\"\"}]",
    "wxTemplateConfig": "[{\"key\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"\"}]",
    "pcUrl": "/ddd/bb",
    "mobileUrl": "/mobileaa/bb",
    "icon": "XXX",
    "appName": "e人事",
    "shelfDate": "2020-03-26 00:00:00"
  }
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| appKey | 应用标识 |
| webSites | 应用域名 |
| appType | 应用类型: 1-业务应用, 2-公共应用(网关属公共应用) |
| appToken | 应用Token |
| basedEhrFlag | 是否依赖ehr人事数据: 1-依赖, 2-不依赖 |
| extendsConfig | 网关上架配置,由网关解析 |
| appExtendsConfig | 该租户对应的应用配置,由应用解析,这里只负责存储(因网关已用extendsConfig字段故此添加一个字段) |
| wxTemplateConfig | 微信模板消息配置,由公共应用解析 |
| pcUrl | 应用PC端首页url(相对路径) |
| mobileUrl | 移动端首页url(相对路径) |
| icon | 应用图标地址 |
| appName | 应用名字 |
| shelfDate | 上架时间 |

---

### 1.3 查看租户所有应用的管理员信息

**接口路径**: `GET /api/adminDetails/getAllAdminDetails?corpkey=A456`

**适用场景**: 提供给公共服务使用,获取租户各应用的管理员列表

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "uuid": "2a99a2f0-69bf-465a-90c8-67d5d6cc26d1",
      "appKey": "A123",
      "globalId": "C123456",
      "corpKey": "A456",
      "engName": "v_qiicai",
      "name": "滋滋菜",
      "email": "2019-07-18 10:22:03",
      "phone": "15977191707",
      "status": 1
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| uuid | UUID唯一标识 |
| appKey | 应用标识 |
| globalId | 身份标识 |
| corpKey | 租户ID |
| engName | 英文名 |
| name | 中文名 |
| email | 管理员邮箱 |
| phone | 电话号码 |
| status | 状态 |

---

### 1.4 获取所有应用注册信息

**接口路径**: `GET /api/corpApp/getAppInfoList`

**适用场景**: 提供给公共服务使用,获取平台所有应用的注册信息

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "appKey": "ehr",
      "webSites": "ehr.ihr.tencent-cloud.com",
      "appType": 1,
      "appToken": "dfdsfdg",
      "basedEhrFlag": 1,
      "extendsConfig": "",
      "appExtendsConfig": "[{\"key\":\"白名单\",\"value\":\"\"},{\"key\":\"管理员\",\"value\":\"\"}]",
      "wxTemplateConfig": "[{\"key\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"\"}]",
      "pcUrl": "/ddd/bb",
      "mobileUrl": "/mobileaa/bb",
      "isTopApp": 1,
      "icon": "XXX",
      "appName": "e人事",
      "pcManageUrl": "",
      "mobileManageUrl": ""
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| isTopApp | 是否是顶级应用: 1-是, 2-不是,默认为1 |
| pcManageUrl | PC端管理后台地址 |
| mobileManageUrl | 移动端管理后台地址 |

*其他字段说明参考接口1.2*

---

### 1.5 获取企业注册相关数据

**接口路径**: `GET /api/corpApp/getCorpInfoList`

**适用场景**: 提供给公共服务使用,获取所有租户的基础信息

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "corpName": "微保",
      "webSites": "weibao.ihr.tencent-cloud.com",
      "startTime": "2019-08-08 00:00:00",
      "endTime": "2020-08-08 00:00:00",
      "corpType": 0
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| corpName | 租户名 |
| webSites | 租户域名 |
| startTime | 租户开始使用时间 |
| endTime | 租户过期时间 |
| corpType | 租户类型: 0-自建应用企业, 1-第三方应用企业, 2-企点QQ企业 |

---

### 1.6 获取使用该应用的所有企业的应用配置

**接口路径**: `GET /api/corpApp/getCorpAppInfoListByParameter?appKey=ehr`

**适用场景**: 提供给公共服务使用,查询某应用在所有租户的配置

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| appKey | string(Query) | 是 | 应用标识 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "ecorehr",
      "corpName": "核心人事公司",
      "appKey": "ehr",
      "webSites": "ehr-ecorehr.ihr.tencent-cloud.com",
      "extendsConfig": "[{\"key\":\"白名单\",\"value\":\"ddd\"},{\"key\":\"管理员\",\"value\":\"\"}]",
      "startTime": "2019-09-20 00:00:00",
      "endTime": "2020-11-30 23:59:59",
      "wxTemplateConfig": "[{\"key\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"dda\"}]",
      "pcUrl": "/ddd/aa",
      "mobileUrl": "/mobile/aa",
      "appWebSites": "ehr-qidian.ihr.tencent-cloud.com",
      "pcManageUrl": "",
      "mobileManageUrl": ""
    }
  ]
}
```

*响应字段说明参考接口1.1*

---

### 1.7 根据模板Key获取微信模板ID

**接口路径**: `GET /api/corpApp/getWXTemplateID?corpkey=XXX&appkey=XXX&wxTemplateKey=XXX`

**适用场景**: 提供给消息服务中心使用,根据corpKey、appKey和wxTemplateKey获取对应的模板ID

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |
| appkey | string(Query) | 是 | 应用标识 |
| wxTemplateKey | string(Query) | 是 | 模板消息Key |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": "jldjfljdjj"
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| data | 微信模板ID |

---

### 1.8 根据corpkey获取企微应用的agentid和accesstoken

**接口路径**: `GET /api/wechat/getAgentIdAndEntAccessToken?corpkey=%s&flag=%s`

**适用场景**: 获取租户企业微信应用的AgentID和AccessToken

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户key |
| flag | string(Query) | 否 | 当flag不为空时,强制不走缓存 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": {
    "access_token": "",
    "expires_in": "",
    "agent_id": ""
  }
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| access_token | 租户对应企微应用的AccessToken |
| agent_id | 租户对应企微应用的AgentId |
| expires_in | Token过期时间 |

---

### 1.9 根据集团用户英文名查询子公司租户key列表

**接口路径**: `GET /api/appUser/getCorpKeyByEngName?engName=zuzhang`

**适用场景**: 查询集团用户在哪些子公司有账号

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| engName | string(Query) | 是 | 用户英文名 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    "6241corptest",
    "ehrdev"
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| data | 数组,用户对应的子公司标签的租户key列表 |

---

## 2. 平台用户信息接口

### 2.1 根据Corpkey获取平台用户信息

**接口路径**: `GET /api/pfuser/getByCorpkey?corpkey=CORPKEY`

**适用场景**: 获取某租户的所有平台用户信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "mobile": "13652141414",
      "globalId": "1153228094996221952",
      "wxOpenId": "test",
      "corpUserId": "test",
      "miniOpenid": "test",
      "hrUnionId": ""
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| mobile | 手机号码 |
| globalId | 唯一用户标识 |
| wxOpenId | 微信openid |
| corpUserId | 企业微信userid |
| miniOpenid | 小程序openid |
| hrUnionId | hr助手微信公众号unionId |

---

### 2.2 根据corpkey和mobile获取单条平台用户信息

**接口路径**: `GET /api/pfuser/getByMobile?corpkey=CORPKEY&mobile=MOBILE`

**适用场景**: 通过手机号查询用户信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |
| mobile | string(Query) | 是 | 手机号码 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": {
    "corpKey": "weibao",
    "mobile": "13698521452",
    "globalId": "1153228104756367360",
    "wxOpenId": "test",
    "corpUserId": "test",
    "miniOpenid": "test",
    "hrUnionId": ""
  }
}
```

*响应字段说明参考接口2.1*

---

### 2.3 根据corpkey和globalid批量获取平台用户信息

**接口路径**: `POST /api/pfuser/getByGlobalid?corpkey=CORPKEY`

**适用场景**: 批量查询用户信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |
| Body | array | 是 | GlobalID数组 |

**请求示例**:
```http
POST /api/pfuser/getByGlobalid?corpkey=weibao
Content-Type: application/json

[
  "1156918441379106817",
  "1156918442150858753"
]
```

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "mobile": "13698521452",
      "globalId": "1153228104756367360",
      "wxOpenId": "test",
      "corpUserId": "test",
      "miniOpenid": "test",
      "email": "sjsjsj@qq.com"
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| email | 用户邮箱 |

*其他字段说明参考接口2.1*

---

### 2.4 新增(修改)平台侧用户信息

**接口路径**: `POST /api/pfuser/update`

**适用场景**: 创建或更新平台用户的第三方平台ID信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpKey | string | 是 | 租户标识 |
| mobile | string | 否 | 手机号码 |
| wxOpenId | string | 否 | 微信openid |
| corpUserId | string | 否 | 企业微信userid |
| miniOpenid | string | 否 | 小程序openid |
| globalId | string | 否 | 唯一用户标识 |
| hrWxUnionId | string | 否 | hr助手微信公众号unionId |

**请求示例**:
```json
{
  "corpKey": "weibao",
  "mobile": "13698521452",
  "wxOpenId": "test",
  "corpUserId": "test",
  "miniOpenid": "test",
  "globalId": "test",
  "hrWxUnionId": "test"
}
```

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok"
}
```

---

### 2.5 根据corpkey、appkey、globalid获取应用侧用户信息

**接口路径**: `POST /api/pfuser/getAppUser?corpkey=CORPKEY&appkey=APPKEY`

**适用场景**: 批量查询用户在某应用的详细信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |
| appkey | string(Query) | 是 | 应用标识 |
| Body | array | 是 | GlobalID数组 |

**请求示例**:
```http
POST /api/pfuser/getAppUser?corpkey=weibao&appkey=ehr
Content-Type: application/json

[
  "1156918441379106817",
  "1156918442150858753"
]
```

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "engName": "frankylan",
      "name": "frankylan",
      "email": "frankylan@tencent.com",
      "phone": "18079767917",
      "expireTime": "2020-08-01 00:00:00",
      "globalId": "1135769716854362113"
    }
  ]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| engName | 英文名 |
| name | 名字 |
| email | 邮箱 |
| phone | 手机号码 |
| expireTime | 用户过期时间 |
| globalId | 用户唯一标识,通过手机号码生成 |

**注意**: 会根据匹配的globalid返回,如globalidlist均不存在,则返回空数组

---

### 2.6 根据corpkey、globalid获取应用侧用户信息

**接口路径**: `GET /api/pfuser/getByGlobalid?corpkey=CORPKEY&globalid=GLOBALID`

**适用场景**: 查询单个用户信息

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |
| globalid | string(Query) | 是 | 用户全局ID |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": {
    "corpKey": "weizhong",
    "mobile": "13767997103",
    "corpUserId": "ceshier",
    "globalId": "1153228131125956609",
    "email": "jeanlu@wesure.cn",
    "wxOpenId": "test",
    "miniOpenid": "test"
  }
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| mobile | 手机号码,如果是企业微信第三方应用下的租户,mobile不存在会返回globalid |

*其他字段说明参考接口2.3*

---

## 3. 数据看板接口

### 3.1 获取数据看板所需数据

**接口路径**: `GET /api/corpDisplayBoard/getCorpDisplayBoardList`

**适用场景**: 提供给公共服务使用,获取租户、应用、管理员的全量数据

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": {
    "corpBaseDisplayList": [
      {
        "corpKey": "weibao",
        "corpName": "微保",
        "webSites": "weibao.sdc.qq.com",
        "startTime": "2019-07-17 16:21:38",
        "endTime": "2020-07-21 16:21:49",
        "corpType": 1,
        "status": 1,
        "deleteFlag": 1
      }
    ],
    "corpAppDisplayList": [
      {
        "corpKey": "weibao",
        "appKey": "ehr",
        "webSites": "www.app_laisha1.com",
        "extendsConfig": "该租户对应的应用配置,由应用解析,这里只负责存储",
        "wxTemplateConfig": "[{\"key1\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"dda\"}]",
        "platform": "租户开通的平台",
        "startTime": "2019-07-01 11:11:11",
        "endTime": "2099-07-01 11:11:11",
        "status": 1,
        "deleteFlag": 1,
        "pcUrl": "/pc",
        "mobileUrl": "/mobile"
      }
    ],
    "adminDisplayList": [
      {
        "appKey": "ehr",
        "globalId": "111",
        "corpKey": "weibao",
        "engName": "weibao1",
        "email": "1062986804@qq.com",
        "phone": "18077008701",
        "deleteFlag": 1
      }
    ]
  }
}
```

**响应字段说明**:

**corpBaseDisplayList**(租户基础信息集合):

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| corpName | 租户名 |
| webSites | 租户域名 |
| corpType | 租户类型: 0-自建, 1-企业微信, 2-企点 |
| startTime | 租户该应用的开始使用时间 |
| endTime | 租户该应用的过期时间 |
| status | 租户状态,默认为1,0为停用 |
| deleteFlag | 删除标识,默认为1,0为删除 |

**corpAppDisplayList**(租户应用信息集合):

| 参数 | 说明 |
|-----|------|
| corpKey | 租户标识 |
| appKey | 应用标识 |
| webSites | 应用域名 |
| extendsConfig | 该租户对应的应用配置,由应用解析,这里只负责储存 |
| wxTemplateConfig | 微信模板消息配置,由公共应用解析 |
| platform | 租户开通的平台 |
| startTime | 租户该应用的开始使用时间 |
| endTime | 租户该应用的过期时间 |
| status | 开启状态,默认为1,0为停用 |
| deleteFlag | 删除标识,默认为1,0为删除 |
| pcUrl | 应用PC端首页url(相对路径) |
| mobileUrl | 移动端首页url(相对路径) |

**adminDisplayList**(管理员集合):

| 参数 | 说明 |
|-----|------|
| appKey | 应用标识 |
| globalId | 身份标识 |
| corpKey | 租户标识 |
| engName | 英文名 |
| name | 中文名 |
| email | 邮箱 |
| phone | 手机号码 |
| deleteFlag | 删除标识,默认为1,0为删除 |

---

### 3.2 获取CorpBase列表相关数据

**接口路径**: `GET /api/corpDisplayBoard/getCorpBaseList`

**适用场景**: 提供给公共服务使用,获取所有租户基础信息列表

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "corpName": "微保",
      "webSites": "weibao.sdc.qq.com",
      "startTime": "2019-07-17 16:21:38",
      "endTime": "2020-07-21 16:21:49",
      "corpType": 1,
      "status": 1,
      "deleteFlag": 1
    }
  ]
}
```

*响应字段说明参考接口3.1的corpBaseDisplayList*

---

### 3.3 获取corpAppInfo列表数据

**接口路径**: `GET /api/corpDisplayBoard/getCorpAppList`

**适用场景**: 提供给公共服务使用,获取所有租户应用配置列表

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "corpKey": "weibao",
      "appKey": "ehr",
      "webSites": "www.app_laisha1.com",
      "extendsConfig": "该租户对应的应用配置,由应用解析,这里只负责存储",
      "wxTemplateConfig": "[{\"key1\":\"birthday\",\"name\":\"下级生日提醒消息模板\",\"value\":\"dda\"}]",
      "platform": "租户开通的平台",
      "startTime": "2019-07-01 11:11:11",
      "endTime": "2099-07-01 11:11:11",
      "status": 1,
      "deleteFlag": 1
    }
  ]
}
```

*响应字段说明参考接口3.1的corpAppDisplayList*

---

### 3.4 获取管理员列表数据

**接口路径**: `GET /api/corpDisplayBoard/getAdminList`

**适用场景**: 提供给公共服务使用,获取所有应用的管理员列表

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": [
    {
      "appKey": "ehr",
      "globalId": "111",
      "corpKey": "weibao",
      "engName": "weibao1",
      "email": "1062986804@qq.com",
      "phone": "18077008701",
      "deleteFlag": 1
    }
  ]
}
```

*响应字段说明参考接口3.1的adminDisplayList*

---

## 4. 应用安装回调接口

### 4.1 根据corpkey查看应用安装状态

**接口路径**: `GET /api/corpApp/getAppStatus?corpkey=CORPKEY`

**适用场景**: 公共服务权限,查询租户哪些应用尚未安装成功

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| corpkey | string(Query) | 是 | 租户标识 |

**响应示例**:
```json
{
  "success": true,
  "code": "0",
  "msg": "ok",
  "data": ["vi", "ehr"]
}
```

**响应字段说明**:

| 参数 | 说明 |
|-----|------|
| data | 返回未安装成功的应用appkey列表 |

---

## 完整代码示例

### Node.js示例: 数据服务完整实现

```javascript
const crypto = require('crypto');
const axios = require('axios');

class TasDataService {
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
     * 1.1 获取租户购买的应用列表
     */
    async getCorpAppList(corpKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/corpApp/getCorpAppInfoListByCorpkey`,
                {
                    params: { corpkey: corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取租户应用列表失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 1.2 获取应用注册信息
     */
    async getAppInfo(appKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/corpApp/getAppInfoByAppKey`,
                {
                    params: { appkey: appKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取应用信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 1.3 获取租户所有应用的管理员信息
     */
    async getAllAdminDetails(corpKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/adminDetails/getAllAdminDetails`,
                {
                    params: { corpkey: corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取管理员信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 1.7 获取微信模板ID
     */
    async getWXTemplateID(corpKey, appKey, wxTemplateKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/corpApp/getWXTemplateID`,
                {
                    params: {
                        corpkey: corpKey,
                        appkey: appKey,
                        wxTemplateKey: wxTemplateKey
                    },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取微信模板ID失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 1.8 获取企微应用AccessToken
     */
    async getWechatAccessToken(corpKey, forceRefresh = false) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/wechat/getAgentIdAndEntAccessToken`,
                {
                    params: {
                        corpkey: corpKey,
                        flag: forceRefresh ? '1' : ''
                    },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取企微AccessToken失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.1 根据corpkey获取平台用户信息
     */
    async getPlatformUsersByCorpKey(corpKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/pfuser/getByCorpkey`,
                {
                    params: { corpkey: corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取平台用户信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.2 根据手机号获取用户信息
     */
    async getUserByMobile(corpKey, mobile) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/pfuser/getByMobile`,
                {
                    params: { corpkey: corpKey, mobile: mobile },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('根据手机号获取用户失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.3 批量根据GlobalID获取平台用户信息
     */
    async batchGetPlatformUsers(corpKey, globalIdList) {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/pfuser/getByGlobalid`,
                globalIdList,
                {
                    params: { corpkey: corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('批量获取平台用户失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.4 新增或修改平台用户信息
     */
    async updatePlatformUser(userData) {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/pfuser/update`,
                userData,
                {
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('更新平台用户信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.5 批量获取应用用户信息
     */
    async getAppUsers(corpKey, appKey, globalIdList) {
        try {
            const response = await axios.post(
                `${this.baseURL}/api/pfuser/getAppUser`,
                globalIdList,
                {
                    params: { corpkey: corpKey, appkey: appKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取应用用户信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 2.6 根据GlobalID获取单个用户信息
     */
    async getUserByGlobalId(corpKey, globalId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/pfuser/getByGlobalid`,
                {
                    params: { corpkey: corpKey, globalid: globalId },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取用户信息失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 3.1 获取数据看板完整数据
     */
    async getDisplayBoardData() {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/corpDisplayBoard/getCorpDisplayBoardList`,
                {
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取数据看板数据失败:', error.message);
            throw error;
        }
    }
    
    /**
     * 4.1 查看应用安装状态
     */
    async getAppInstallStatus(corpKey) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/corpApp/getAppStatus`,
                {
                    params: { corpkey: corpKey },
                    headers: this.getHeaders()
                }
            );
            
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            console.error('获取应用安装状态失败:', error.message);
            throw error;
        }
    }
}

// 使用示例
const service = new TasDataService({
    baseURL: 'http://newehrtenant.prodihrtas.com',
    appKey: 'your_app_key',
    appToken: 'your_app_token'
});

(async () => {
    try {
        // 获取租户应用列表
        const apps = await service.getCorpAppList('tencent');
        console.log('租户应用列表:', apps);
        
        // 获取应用信息
        const appInfo = await service.getAppInfo('ehr');
        console.log('应用信息:', appInfo);
        
        // 批量获取用户信息
        const users = await service.batchGetPlatformUsers('tencent', [
            '1156918441379106817',
            '1156918442150858753'
        ]);
        console.log('用户信息:', users);
        
        // 更新用户平台信息
        await service.updatePlatformUser({
            corpKey: 'tencent',
            mobile: '13812345678',
            globalId: '1156918441379106817',
            wxOpenId: 'oABC123xyz',
            corpUserId: 'zhangsan'
        });
        console.log('用户信息已更新');
        
        // 获取数据看板数据
        const boardData = await service.getDisplayBoardData();
        console.log('数据看板:', boardData);
        
    } catch (error) {
        console.error('操作失败:', error.message);
    }
})();
```

---

### Java示例: Spring Boot服务

```java
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TasDataService {
    
    private final RestTemplate restTemplate;
    private final String baseURL;
    private final String appKey;
    private final String appToken;
    
    public TasDataService() {
        this.restTemplate = new RestTemplate();
        this.baseURL = "http://newehrtenant.prodihrtas.com";
        this.appKey = "your_app_key";
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
     * 1.1 获取租户购买的应用列表
     */
    public List<Map<String, Object>> getCorpAppList(String corpKey) {
        String url = UriComponentsBuilder
            .fromHttpUrl(baseURL + "/api/corpApp/getCorpAppInfoListByCorpkey")
            .queryParam("corpkey", corpKey)
            .toUriString();
        
        HttpEntity<Void> entity = new HttpEntity<>(generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body != null && (Boolean) body.get("success")) {
            return (List<Map<String, Object>>) body.get("data");
        }
        
        throw new RuntimeException("获取租户应用列表失败: " + body.get("msg"));
    }
    
    /**
     * 2.3 批量获取平台用户信息
     */
    public List<Map<String, Object>> batchGetPlatformUsers(String corpKey, List<String> globalIdList) {
        String url = UriComponentsBuilder
            .fromHttpUrl(baseURL + "/api/pfuser/getByGlobalid")
            .queryParam("corpkey", corpKey)
            .toUriString();
        
        HttpEntity<List<String>> entity = new HttpEntity<>(globalIdList, generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body != null && (Boolean) body.get("success")) {
            return (List<Map<String, Object>>) body.get("data");
        }
        
        throw new RuntimeException("批量获取用户信息失败: " + body.get("msg"));
    }
    
    /**
     * 2.4 更新平台用户信息
     */
    public void updatePlatformUser(Map<String, String> userData) {
        String url = baseURL + "/api/pfuser/update";
        
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(userData, generateHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body == null || !(Boolean) body.get("success")) {
            throw new RuntimeException("更新用户信息失败: " + body.get("msg"));
        }
    }
}
```

---

## 最佳实践

### 1. 签名生成

```javascript
// 正确示例: 直接字符串拼接
const signature = crypto
    .createHash('sha256')
    .update(appKey + timestamp + appToken)
    .digest('hex');

// 注意: 时间戳精确到秒
const timestamp = Math.floor(Date.now() / 1000).toString();
```

### 2. 批量查询优化

```javascript
// 推荐: 批量查询
const globalIds = ['id1', 'id2', 'id3', 'id4', 'id5'];
const users = await batchGetPlatformUsers('tencent', globalIds);

// 不推荐: 循环单次查询
for (const id of globalIds) {
    const user = await getUserByGlobalId('tencent', id); // 性能差
}
```

### 3. 错误处理

```javascript
try {
    const apps = await getCorpAppList('tencent');
} catch (error) {
    if (error.response?.status === 401) {
        console.error('签名验证失败,请检查AppKey和AppToken');
    } else if (error.response?.status === 404) {
        console.error('租户不存在');
    } else {
        console.error('请求失败:', error.message);
    }
}
```

---

## 常见问题

### Q1: 如何获取AppKey和AppToken?

联系TAS接口人(jeeliu)申请应用注册

### Q2: 签名验证失败如何排查?

1. 检查`AppKey`和`AppToken`是否正确
2. 确认时间戳格式(精确到秒)
3. 验证字符串拼接顺序: `AppKey + Timestamp + AppToken`
4. 确认使用SHA256算法且结果为小写十六进制

### Q3: 批量查询有数量限制吗?

建议单次批量查询不超过100条,大批量数据建议分批处理

### Q4: 接口返回空数据?

可能原因:
- 租户不存在或已过期
- 应用未开通或已禁用
- 用户不存在或已删除

---

**下一步**: 查看[Part 3: 开放服务接口文档](./kb-tas-part3.md)了解OAuth2.0鉴权和API转发机制。

[返回主文档](./kb-tas.md)
