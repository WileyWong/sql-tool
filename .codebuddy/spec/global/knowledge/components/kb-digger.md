# Digger 用户行为日志采集服务 - API 使用指南

## 一、基础信息

### 1.1 组件名称
**Digger** - 用户行为日志采集工具

### 1.2 所属模块
- **项目位置**: 基础组件组
- **所属空间**: 基础组件组 / 基础组件研发
- **iWiki文档**: https://iwiki.woa.com/p/4007094478

### 1.3 版本信息
- **当前版本**: v1.10 (SDK版本: v20251017)
- **兼容性**: 支持 PC、移动端、微信小程序
- **域名要求**: 必须使用 woa.com 域名（oa.com 已过期）

### 1.4 负责人
- **联系人**: jeeliu(刘志杰)
- **数据查看平台**: [URC平台](https://urc.woa.com/)

### 1.5 状态标识
- ✅ **稳定版本**，推荐使用
- ⚠️ **重要提示**: oa.com 域名证书已过期，必须迁移至 woa.com

---

## 二、功能概述

### 2.1 核心职责
Digger 是一套**自动化用户行为日志采集工具**，业务侧只需在页面引入 SDK 组件即可实现用户行为自动上报，无需手动埋点。

### 2.2 使用场景
- 所有需要上报用户行为数据的业务应用
- 需要页面性能监控的应用
- 需要用户访问路径分析的应用
- 需要跨站点链路追踪的应用

### 2.3 设计目的
- **降低埋点成本**: 自动采集，无需手动埋点
- **统一数据标准**: 统一的数据模型和上报格式
- **多平台兼容**: 一次接入，同时上报 Digger + 灯塔 + Beacon
- **快速迭代**: 配置热更新，无需重新发布代码

### 2.4 业务价值
- 帮助产品快速实现用户行为埋点及统计分析
- 支持页面性能监控、接口监控、错误监控
- 提供跨站点链路追踪能力（业内首创）
- 降低埋点开发和维护成本

---

## 三、核心术语

| 术语 | 全称 | 含义 | 用途 |
|------|------|------|------|
| **PV** | Page View | 页面浏览量，每打开1个页面记录1个PV | 反映网站活跃程度和内容关注度 |
| **UV** | Unique Visitor | 独立访客，按员工StaffId唯一标识 | 反映网站用户规模 |
| **VV** | Visit View | 访问会话，30分钟无活动后重新计算 | 反映网站粘性和用户忠诚度 |
| **UID** | - | 每次页面访问的唯一标识ID | 用于PV统计 |
| **PreUID** | - | SPA应用中上一次访问页面的UID | 用于SPA应用路径分析 |
| **TraceID** | - | 用户一次访问站点的会话ID | 用于站内页面跳转路径跟踪和跨站链路跟踪 |

---

## 四、快速开始

### 4.1 基础接入（PC/移动端）

#### 步骤1: 引入 Digger SDK

```html
<script>
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.type = 'text/javascript'
  
  // 动态选择域名（支持 oa/woa 双域名）
  var host = 'digger.oa.com'
  if (location.host.includes('woa.com')) {
    host = 'digger.woa.com'
  } else if (location.host.includes('m.tencent.com')) {
    var appkey = 'your-app-key' // 替换为自己的应用key
    host = location.host + '/an:' + appkey + '/ts:digger.oa.com'
  }
  
  script.src = '//' + host + '/script/digger-{your-token}.js' // 替换为自己的应用token
  head.appendChild(script)
</script>
```

#### 步骤2: 验证接入
访问页面后，可在 [URC平台](https://urc.woa.com/) 查看上报数据。

### 4.2 微信小程序接入

详见：[Digger微信小程序接入方法](https://iwiki.woa.com/p/4016458213)（需MOA权限）

### 4.3 最简示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Digger Demo</title>
  <!-- 引入 Digger SDK -->
  <script src="//digger.woa.com/script/digger-xxx.js"></script>
</head>
<body>
  <h1>欢迎使用 Digger</h1>
  <!-- 页面访问会自动上报，无需额外代码 -->
</body>
</html>
```

---

## 五、核心功能

### 5.1 自动采集功能

#### 5.1.1 访问日志自动采集
- ✅ 自动上报页面访问记录
- ✅ 自动嵌入用户信息（StaffId、姓名、组织等）
- ✅ 自动嵌入位置信息
- ✅ 自动嵌入时间信息
- ✅ 自动嵌入访问设备信息
- ✅ 兼容 Vue/React 等 SPA 单页应用的路由跳转

**自动上报字段**: 参考 [字段说明](https://iwiki.woa.com/p/4008398804)

#### 5.1.2 性能监控自动采集
- ✅ 页面接口性能监听
  - HttpRequest 请求耗时
  - 接口返回状态码
- ✅ 页面资源加载监听
  - 静态资源加载耗时
  - 页面加载白屏时间
- ✅ 页面报错自动监听
  - JavaScript 未捕获错误
  - Promise 错误捕获

#### 5.1.3 行为溯源自动采集
- ✅ **跨站链路追踪**（业内首创）
  - 支持跨站点的访问路径分析
  - TraceID 自动传递
- ✅ 用户页面行为采集
  - 页面打开、关闭、最小化、激活
  - 支持用户停留时长分析

### 5.2 手动上报功能

#### 5.2.1 自定义事件上报

**方法签名**:
```javascript
/**
 * 自定义上报事件
 * @param {string} key - 必填，事件key/事件名称
 * @param {object} params - 必填，事件参数对象，为空时传 {}
 * @param {object} pluginOptions - 可选，配置项
 */
window.digger.event(key, params, pluginOptions);
```

**基础用法**:
```javascript
// 示例1: 基础事件上报
window.digger.event('button_click', {
  form_id: 'user_register',
  button_text: '提交'
});

// 示例2: 事件参数为空
window.digger.event('page_loaded', {});

// 示例3: 同时上报到灯塔平台
window.digger.event('click_event1', {
  name: 'bugtian',
  sex: 'boy',
  age: 13
}, {
  beacon: true
});

// 示例4: 处理长内容上报（使用POST方式）
window.digger.event('long_content_event', {
  content: '很长的内容...',
  data: largeObject
}, {
  reportWithPost: true  // v1.8+
});
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | string | ✅ | 事件名称/事件key，建议使用字母、数字和下划线 |
| `params` | object | ✅ | 事件参数对象，为空时传 `{}`，不能为 null |
| `pluginOptions` | object | ❌ | 配置项，详见下表 |

**pluginOptions 配置项**:

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `beacon` | boolean | 同时上报到灯塔平台，需在注册时填写灯塔配置 |
| `reportWithPost` | boolean | 通过 POST 方式上报事件，处理 params 过大的场景（v1.8+） |
| ~~`mta`~~ | boolean | ~~同时上报到MTA~~，已废弃 |

#### 5.2.2 手动上报访问记录

**方法签名**:
```javascript
/**
 * 手动上报访问记录函数
 * @param {string} url - 要上报的路径
 */
window.digger.reportUrl(url);
```

**使用示例**:
```javascript
// 上报特定URL访问记录
window.digger.reportUrl('http://www.example.com/custom-page');

// 上报当前页面（通常不需要，会自动上报）
window.digger.reportUrl(window.location.href);
```

#### 5.2.3 获取TraceID

**方法签名**:
```javascript
/**
 * 获取当前 trace id
 * @returns {string} trace id
 */
window.digger.getTraceId();
```

**使用示例**:
```javascript
const traceId = window.digger.getTraceId();
console.log('当前TraceID:', traceId);

// 用于跨系统传递
const url = `https://other-system.com?traceId=${traceId}`;
```

#### 5.2.4 获取用户访问标识

**方法签名**:
```javascript
/**
 * 获取当前用户访问标识
 * @returns {string} uid
 */
window.digger.getUid();
```

**使用示例**:
```javascript
const uid = window.digger.getUid();
console.log('当前访问UID:', uid);
```

#### 5.2.5 获取配置信息

**方法签名**:
```javascript
/**
 * 获取当前digger实例参数配置
 * @returns {object} config object
 */
window.digger.getConfig();
```

**使用示例**:
```javascript
const config = window.digger.getConfig();
console.log('Digger配置:', config);
```

#### 5.2.6 灯塔平台直接上报（高级）

**方法签名**:
```javascript
/**
 * 灯塔主动上报事件
 * @param {string} eventId - 事件ID
 * @param {object} params - 事件参数，不可以使用嵌套object，object中只能有一层 key -> val
 */
window.digger.beaconDirectEvent(eventId, params);
```

**使用示例**:
```javascript
window.digger.beaconDirectEvent('beaconClick', {
  parama: true,
  paramb: false
});
```

**注意**: 参数对象只能有一层键值对，不支持嵌套对象。

#### 5.2.7 服务端事件上报

详见：[服务端开放接口文档](https://iwiki.woa.com/p/4016458217)（需MOA权限）

### 5.3 高级功能

#### 5.3.1 可视化埋点
产品运营人员可在 Digger 后台可视化选择要埋点的元素并配置上报数据项，配置完成后无需修改代码即可生效。

#### 5.3.2 配置热更新
在 Digger 后台修改配置项后，无需修改接入代码立即生效，包括：
- 可视化埋点配置
- 第三方平台开关
- 上报参数配置

#### 5.3.3 第三方平台兼容
接入 Digger 后，可通过配置同时接入：
- ✅ 灯塔 (Beacon)
- ✅ 腾讯分析 (TA) - 已下线
- ✅ MTA

一次接入，多处使用。

#### 5.3.4 心跳上报
支持心跳上报开关控制，用于监控用户在线状态（v1.7+）。

---

## 六、完整API参考

### 6.1 API方法列表

| 方法 | 说明 | 版本 | 状态 |
|------|------|------|------|
| `event(key, params, pluginOptions)` | 自定义上报事件 | v1.0+ | ✅ 推荐 |
| `reportUrl(url)` | 手动上报访问记录 | v1.0+ | ✅ 推荐 |
| `getTraceId()` | 获取当前 trace id | v1.7+ | ✅ 推荐 |
| `getUid()` | 获取当前用户访问标识 | v1.0+ | ✅ 推荐 |
| `getConfig()` | 获取配置信息 | v1.0+ | ✅ 推荐 |
| `beaconDirectEvent(eventId, params)` | 灯塔平台直接上报 | v1.0+ | ⚠️ 高级 |
| ~~`mtaClick(eventId, params)`~~ | ~~MTA事件上报~~ | v1.0+ | ❌ 已废弃 |
| ~~`mtapgv()`~~ | ~~MTA访问记录上报~~ | v1.0+ | ❌ 已废弃 |
| ~~`customUrl(url)`~~ | ~~旧版上报访问记录~~ | v1.0+ | ❌ 已废弃 |

### 6.2 实例访问方式

Digger SDK 加载后会自动挂载到 `window` 对象上，提供以下访问方式：

```javascript
// 方式1: 使用 window.digger（推荐）
window.digger.event('click', {});

// 方式2: 使用 window.hrm（兼容旧版）
window.hrm.event('click', {});

// 方式3: 自定义变量名
const myDigger = window.digger;
myDigger.event('click', {});
```

**注意**: 所有示例中的 `window.digger` 和 `window.hrm` 都指向同一个实例。

---

## 七、依赖关系

### 7.1 上游依赖
- **域名要求**: 必须使用 woa.com 域名
- **浏览器要求**: 支持现代浏览器（Chrome、Firefox、Safari、Edge）
- **网络要求**: 可访问 digger.woa.com
- **CMDB接入**: 应用需挂靠到 CMDB 项目（v1.6+）

### 7.2 下游影响
- 数据存储在 URC 平台
- 数据模型存储在 TDW 数据仓库（DWM层）
- 支持多个数据分析平台使用

### 7.3 环境依赖
- **数据平台**: URC (https://urc.woa.com/)
- **数据仓库**: TDW (DWM层)

---

## 八、数据契约

### 8.1 自动上报数据模型

Digger 自动采集的主要字段包括：

**用户信息**:
- `staff_id`: 员工ID
- `staff_name_nick`: 员工英文名
- `staff_name_display`: 员工全名
- `staff_type_name_cn`: 员工类型
- `hr_flag`: HR标识（S3非人平人员标识为Y）
- `manager_level`: 管理职级
- `clan_name`: 族
- `professional_level`: 专业职级
- `age`: 年龄
- `service_duration`: 司龄
- `gender_name_cn`: 性别

**组织信息**:
- `org_id`: 组织ID
- `org_name_cn`: 组织名称
- `org_full_path`: 组织全路径
- `org_full_name_cn`: 组织全路径名称
- `bg_id`: BG_ID
- `bg_name_cn`: BG名称
- `dept_id`: 部门ID
- `dept_name_cn`: 部门名称
- `center_id`: 中心ID
- `center_name_cn`: 中心名称
- `team_id`: 组ID
- `team_name_cn`: 组名称

**访问信息**:
- `visit_date`: 访问日期
- `visit_hour`: 访问小时（1～24）
- `uid`: 访问唯一标识
- `pre_uid`: 上一次访问UID（SPA应用）
- `trace_id`: 会话ID（30分钟刷新）
- `source`: 访问来源（v1.9+）

**产品信息**:
- `subject_id`: 领域ID
- `subject_name`: 领域名称
- `product_id`: 产品ID
- `product_name`: 产品名称

**性能指标**:
- `page_stay`: 页面停留时长（ms）
- `page_load`: 页面加载时长（ms）
- `interface_duration`: 接口耗时（ms）
- `interface_status_code`: 接口状态码

**自定义标签**: 支持 50 个自定义 tag 字段（tag1 ~ tag50）

### 8.2 数据仓库模型

#### DWM 层数据表

1. **PV/UV 统计表**
   - `dwm_s3_urc_pvuv_pagestay_byuser_di`: PV/UV/页面停留时长最近30天统计（按天）
   - `dwm_s3_urc_pvuv_pagestay_byuser_mi`: PV/UV/页面停留时长月度汇总
   - `dwm_s3_urc_pvuv_byproduct_di`: PV/UV最近1年到天统计（按产品）

2. **点击事件统计表**
   - `dwm_s3_urc_eventcount_byuser_di`: 点击事件量最近30天统计（按用户）
   - `dwm_s3_urc_eventcount_byuser_mi`: 点击事件量月度汇总

3. **性能监控表**
   - `dwm_s3_urc_pageload_interfaceduration_di`: 页面加载时长、接口耗时天统计
   - `dwm_s3_urc_interface_errorcount_di`: 接口报错天统计
   - `dwm_s3_urc_interfaceduration_level_di`: 接口耗时分级统计
   - `dwm_s3_urc_page_errorcount_di`: 页面报错天统计

**分区字段**:
- 天级表: `visit_date` (bigint)
- 月级表: `visit_month` (bigint)

---

## 九、运行时行为

### 9.1 TraceID 刷新机制（v1.7+）
- TraceID 每 30 分钟自动刷新
- 用于区分不同的访问会话（VV统计）
- 支持跨站点传递

### 9.2 心跳上报
- 支持心跳上报开关控制
- 用于监控用户在线状态

### 9.3 iframe 内应用上报（v1.7+）
- iframe 内应用的自定义事件可同时上报到父窗口应用
- 详见：[iframe应用上报方案](https://iwiki.woa.com/p/4016458218)

### 9.4 并发安全
- SDK 自动处理并发上报
- 使用队列机制保证数据不丢失

### 9.5 异步上报
- 所有数据上报均为异步操作
- 不阻塞页面渲染和用户交互

---

## 十、错误处理

### 10.1 常见错误及解决方案

#### 错误1: 控制台报错 "net::ERR_CERT_DATE_INVALID"

**原因**: oa.com 域名的 HTTPS 证书已过期（2023年9月19日起）

**解决方案**: 
```javascript
// 切换到 woa.com 域名
script.src = '//digger.woa.com/script/digger-xxx.js'
```

#### 错误2: 跨域错误

**原因**: 
- 业务站点与 Digger 脚本的 schema 不一致
- 根域名不一致

**解决方案**:
```javascript
// 使用 // 自动适配协议
script.src = '//digger.woa.com/script/digger-xxx.js'

// 确保根域名一致（woa.com）
```

#### 错误3: 数据未上报

**排查步骤**:
1. 检查网络连接，确保可访问 digger.woa.com
2. 检查 SDK 是否正确加载
3. 查看浏览器控制台是否有报错
4. 在 URC 平台查看应用数据上报状态

### 10.2 降级策略
- 如果 Digger 服务不可用，不影响业务正常运行
- SDK 内部有异常捕获，不会导致页面崩溃

---

## 十一、配置说明

### 11.1 基础配置

```javascript
// 在 Digger 后台配置以下选项：
{
  // 第三方平台开关
  enableBeacon: true,     // 是否开启灯塔上报
  enableTA: false,        // 是否开启腾讯分析（已下线）
  
  // 功能开关
  enablePerformance: true,    // 是否开启性能监控
  enableError: true,          // 是否开启错误监控
  enableHeartbeat: true,      // 是否开启心跳上报
  
  // 上报参数
  source: 'custom_source'     // 访问来源（v1.9+）
}
```

### 11.2 动态配置（热更新）
以下配置支持在 Digger 后台修改后立即生效：
- 可视化埋点配置
- 第三方平台开关
- 功能开关
- source 参数

### 11.3 默认配置
- 性能监控: 默认开启
- 错误监控: 默认开启
- 心跳上报: 默认关闭
- TraceID 刷新: 30 分钟

---

## 十二、最佳实践

### 12.1 推荐用法

#### 1. 动态域名选择
```javascript
// 支持 oa/woa 双域名环境
var host = location.host.includes('woa.com') ? 'digger.woa.com' : 'digger.oa.com'
script.src = '//' + host + '/script/digger-xxx.js'
```

#### 2. 自定义事件命名规范
```javascript
// 使用下划线分隔，语义化命名
window.digger.event('button_click_submit', {});
window.digger.event('form_submit_success', { form_type: 'register' });
window.digger.event('page_scroll_bottom', { page_name: 'home' });
```

#### 3. 长内容上报
```javascript
// 内容过长时使用 POST 方式
window.digger.event('form_data', {
  data: JSON.stringify(largeObject)
}, {
  reportWithPost: true  // v1.8+
});
```

#### 4. 正确使用变量引用
```javascript
// Digger 会自动挂载到 window 对象上
// 方式1: 直接使用 window.digger
window.digger.event('click', {});

// 方式2: 使用别名（兼容旧版）
window.hrm.event('click', {});

// 方式3: 自定义变量名
const myDigger = window.digger;
myDigger.event('click', {});
```

#### 5. 获取TraceID用于跨系统传递
```javascript
// 获取当前会话的TraceID
const traceId = window.digger.getTraceId();

// 在跳转到其他系统时传递TraceID
window.location.href = `https://other-system.com?traceId=${traceId}`;
```

### 12.2 反模式（不推荐）

#### ❌ 不推荐: 硬编码 oa.com 域名
```javascript
// 错误示例：证书已过期
script.src = '//digger.oa.com/script/digger-xxx.js'
```

#### ❌ 不推荐: 错误的参数格式
```javascript
// 错误示例1：使用对象参数（旧的错误示例）
Digger.event({ name: 'click', value: 'test' })  // ❌ 错误

// 正确示例：使用三个参数
window.digger.event('click', { value: 'test' })  // ✅ 正确
```

#### ❌ 不推荐: params 参数为 null 或 undefined
```javascript
// 错误示例
window.digger.event('click', null)        // ❌ 错误
window.digger.event('click', undefined)   // ❌ 错误

// 正确示例
window.digger.event('click', {})          // ✅ 正确
```

#### ❌ 不推荐: 频繁调用自定义事件
```javascript
// 错误示例：在循环中调用
for (let i = 0; i < 1000; i++) {
  window.digger.event('loop_event', {})  // 会产生大量请求
}

// 正确示例：合并上报
window.digger.event('batch_event', { count: 1000 })
```

#### ❌ 不推荐: 在 iframe 中重复引入
```javascript
// 错误示例：父窗口和 iframe 都引入 SDK
// 应该只在父窗口引入，iframe 内事件会自动上报（v1.7+）
```

#### ❌ 不推荐: beaconDirectEvent 使用嵌套对象
```javascript
// 错误示例
window.digger.beaconDirectEvent('event', {
  data: {              // ❌ 嵌套对象不支持
    nested: 'value'
  }
});

// 正确示例：扁平化对象
window.digger.beaconDirectEvent('event', {
  data_nested: 'value'  // ✅ 只有一层键值对
});
```

### 12.3 性能建议
- 自定义事件上报频率不超过 10次/秒
- 避免在高频事件（如 scroll、mousemove）中直接上报
- 长内容上报使用 `reportWithPost: true`

---

## 十三、版本变更历史

| 时间 | 版本 | 主要变更 | Breaking Changes |
|------|------|----------|------------------|
| 2024-05 | v1.9 | 1. 小程序SDK支持source上报参数<br/>2. 修复traceid刷新的bug<br/>3. 自定义事件上报参数支持选填 | 无 |
| 2024-03 | v1.8 | 自定义事件上报添加参数reportWithPost，处理事件内容过长上报失败的问题 | 无 |
| 2023-11 | v1.7 | 1. 新增traceId 30分钟刷新逻辑<br/>2. 支持iframe内应用自定义上报事件同时上报到父窗口应用<br/>3. 添加心跳上报开关控制 | 无 |
| 2023-08 | v1.6 | 1. SDK新增版本号字段<br/>2. 更新小程序版本SDK以支持woa域名上报<br/>3. 移除页面录像组件<br/>4. 新增用户页面行为上报<br/>5. CMDB接入<br/>6. 数据模型完善员工信息 | ⚠️ 移除页面回放功能 |
| 2022-11 | v1.5 | 1. 新增支持woa.com域名接入<br/>2. 新增全局事件采集上报能力<br/>3. 下线腾讯分析上报模块<br/>4. 升级灯塔sdk版本到4.5.9<br/>5. 新增服务端事件上报接口 | ⚠️ 腾讯分析模块下线 |
| 2021-09 | v1.0 | 首个正式版本发布 | - |

### 迁移指南

#### 从 oa.com 迁移到 woa.com
```javascript
// 1. 更新引入脚本域名
// 旧版本
script.src = '//digger.oa.com/script/digger-xxx.js'

// 新版本
script.src = '//digger.woa.com/script/digger-xxx.js'

// 2. 如需兼容双域名，使用动态判断
var host = location.host.includes('woa.com') ? 'digger.woa.com' : 'digger.oa.com'
script.src = '//' + host + '/script/digger-xxx.js'
```

---

## 十四、常见问题 (FAQ)

### Q1: 如何查看上报数据？
**A**: 访问 [URC平台](https://urc.woa.com/)，使用员工账号登录后可查看应用的上报数据。

### Q2: SPA 单页应用需要特殊处理吗？
**A**: 不需要。Digger 已兼容基于 JS 的前端路由跳转（如 Vue Router、React Router），会自动监听路由变化并上报。

### Q3: 是否支持自定义字段？
**A**: 支持。使用自定义事件上报的 `params` 参数，或使用数据模型中的 50 个 tag 字段（tag1 ~ tag50）。

### Q4: 如何禁用某些自动采集功能？
**A**: 在 Digger 后台配置功能开关，支持热更新，无需修改代码。

### Q5: TraceID 如何跨站传递？
**A**: 使用 `window.digger.getTraceId()` 获取当前 TraceID，然后通过 URL 参数传递给其他站点。详见：[traceId 跨根域名传递技术方案](https://iwiki.woa.com/p/4016458215)（需MOA权限）

### Q6: 如何获取应用 token？
**A**: 联系 jeeliu(刘志杰) 或在 Digger 后台创建应用获取。

### Q7: 数据保留多久？
**A**: 
- 天级数据: 保留 30 天
- 月级数据: 长期保留
- 详细数据: 参考 URC 平台的数据保留策略

### Q8: `Digger.event()` 和 `window.digger.event()` 有什么区别？
**A**: Digger SDK 只会挂载到 `window.digger` 和 `window.hrm` 上，不会创建全局的 `Digger` 对象。请使用 `window.digger.event()` 或 `window.hrm.event()`。

### Q9: 为什么调用 `event()` 方法时提示参数错误？
**A**: 请确保使用正确的参数格式：
```javascript
// ❌ 错误：使用对象参数
Digger.event({ name: 'click', value: 'test' })

// ✅ 正确：使用三个独立参数
window.digger.event('click', { value: 'test' })
```

### Q10: 如何同时上报到灯塔平台？
**A**: 在调用 `event()` 方法时，设置 `pluginOptions.beacon = true`：
```javascript
window.digger.event('event_name', { param: 'value' }, { beacon: true })
```

### Q11: params 参数可以为空吗？
**A**: 不能传 `null` 或 `undefined`，为空时请传 `{}`：
```javascript
// ❌ 错误
window.digger.event('click', null)

// ✅ 正确
window.digger.event('click', {})
```

---

## 十五、附录

### 15.1 相关文档
- [Digger 接入文档](https://iwiki.woa.com/p/4007094482)（需MOA权限）
- [Digger 字段说明](https://iwiki.woa.com/p/4008398804)
- [Digger 微信小程序接入方法](https://iwiki.woa.com/p/4016458213)（需MOA权限）
- [自定义事件上报API](https://iwiki.woa.com/p/4016458214)（需MOA权限）
- [digger 上报访问来源技术方案](https://iwiki.woa.com/p/4016458216)（需MOA权限）
- [traceId 跨根域名传递技术方案](https://iwiki.woa.com/p/4016458215)（需MOA权限）
- [服务端开放接口文档](https://iwiki.woa.com/p/4016458217)（需MOA权限）
- [iframe 应用上报方案](https://iwiki.woa.com/p/4016458218)（需MOA权限）
- [Digger 数据仓库DWM数据模型](https://iwiki.woa.com/p/4016458219)

### 15.2 对比其他方案

| 功能 | Digger | HRLog 1.0 | MTA | Beacon |
|------|--------|-----------|-----|--------|
| 自动采集访问日志 | ✅ 支持SPA | ✅ | ✅ | ✅ |
| 页面资源监控 | ✅ | ❌ | ❌ | ❌ |
| 页面报错监听 | ✅ 含Promise | 部分支持 | ✅ | ❌ |
| 接口性能监听 | ✅ | ❌ | ❌ | ❌ |
| 第三方平台兼容 | ✅ Beacon+灯塔 | 部分支持 | ❌ | ❌ |
| 跨站链路追踪 | ✅ 首创 | 仅站内 | ❌ | ❌ |
| 配置热更新 | ✅ | ❌ | 部分支持 | ❌ |
| 可视化埋点 | ✅ | ❌ | ❌ | ❌ |

### 15.3 联系方式
- **技术支持**: jeeliu(刘志杰)
- **iWiki文档**: https://iwiki.woa.com/p/4016458208
- **URC平台**: https://urc.woa.com/

---

**文档版本**: v1.0  
**最后更新**: 2025-11-12  
**适用于**: Digger SDK v1.9+
