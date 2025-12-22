# 微信小程序代码审查指南

基于微信小程序原生开发的专业代码审查。

> 📚 **参考**: [微信小程序知识库](RAG: 微信小程序)
> 📁 **输出路径**: `workspace/{变更ID}/cr/cr-miniprogram-{时间戳}.md`

## ⚠️ 版本兼容性说明

本指南涵盖微信小程序基础库 2.x - 3.x 版本特性。审查时请注意项目的基础库版本要求。

| 基础库版本 | 主要特性 |
|-----------|----------|
| **2.9.0+** | 初始渲染缓存、分包预下载 |
| **2.11.0+** | 自定义 tabBar、页面间通信 |
| **2.14.0+** | Skyline 渲染引擎 |
| **2.19.0+** | 组件样式隔离增强 |
| **3.0.0+** | 新版组件模型、性能优化 |

## 审查重点

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| 组件设计 | 20% | 职责单一、大小合理、命名规范 |
| WXML 规范 | 15% | 数据绑定、条件渲染、列表渲染、节点数量 |
| 样式规范 | 10% | rpx 使用、样式隔离、选择器规范 |
| 性能优化 | 25% | setData 优化、分包策略、首屏渲染 |
| 安全性 | 20% | 敏感数据、网络请求、用户隐私 |
| 可维护性 | 10% | 代码结构、注释、配置管理 |

## 组件设计审查

### 组件大小

| 指标 | 阈值 | 说明 |
|------|------|------|
| 组件行数 | ≤ 300 行 | 超过应拆分 |
| WXML 行数 | ≤ 100 行 | 复杂模板提取子组件 |
| Properties 数量 | ≤ 10 个 | 过多考虑重构 |

### 组件命名

```javascript
// ✅ 多词组件名（kebab-case）
"user-profile": "/components/user-profile/user-profile"
"order-list": "/components/order-list/order-list"

// ❌ 单词组件名
"profile": "/components/profile/profile"
"list": "/components/list/list"
```

### Properties 定义

```javascript
// ✅ 完整类型定义
Component({
  properties: {
    userId: {
      type: Number,
      value: 0
    },
    userName: {
      type: String,
      value: ''
    },
    role: {
      type: String,
      value: 'user',
      optionalTypes: [String]
    }
  }
})

// ❌ 简写形式（缺少默认值）
Component({
  properties: {
    userId: Number,
    userName: String
  }
})
```

### 组件通信

```javascript
// ✅ 子组件触发事件
Component({
  methods: {
    onTap() {
      this.triggerEvent('update', { id: this.data.id })
    }
  }
})

// ✅ 父组件监听
<child-component bind:update="handleUpdate" />

// ❌ 直接操作父组件
this.selectOwnerComponent().setData({ ... })
```

## WXML 规范审查

### 数据绑定

```xml
<!-- ✅ 正确的数据绑定 -->
<view>{{userName}}</view>
<view class="item-{{index}}">{{item.name}}</view>

<!-- ❌ 复杂表达式（应在 JS 中处理） -->
<view>{{list.filter(item => item.active).map(item => item.name).join(',')}}</view>

<!-- ✅ 使用 WXS 处理复杂逻辑 -->
<wxs module="utils" src="./utils.wxs"></wxs>
<view>{{utils.formatList(list)}}</view>
```

### 条件渲染

```xml
<!-- ✅ wx:if 用于不频繁切换 -->
<view wx:if="{{showDetail}}">详情内容</view>

<!-- ✅ hidden 用于频繁切换 -->
<view hidden="{{!showTab}}">Tab 内容</view>

<!-- ❌ 大量 wx:if 嵌套 -->
<view wx:if="{{a}}">
  <view wx:if="{{b}}">
    <view wx:if="{{c}}">内容</view>
  </view>
</view>

<!-- ✅ 使用 wx:elif 简化 -->
<view wx:if="{{type === 'A'}}">A</view>
<view wx:elif="{{type === 'B'}}">B</view>
<view wx:else>C</view>
```

### 列表渲染

```xml
<!-- ✅ 使用唯一 key -->
<view wx:for="{{list}}" wx:key="id">{{item.name}}</view>

<!-- ❌ 使用 index 作为 key -->
<view wx:for="{{list}}" wx:key="index">{{item.name}}</view>

<!-- ❌ 缺少 wx:key -->
<view wx:for="{{list}}">{{item.name}}</view>

<!-- ✅ 自定义变量名 -->
<view wx:for="{{list}}" wx:for-item="user" wx:for-index="idx" wx:key="id">
  {{idx}}: {{user.name}}
</view>
```

### 节点数量控制

```xml
<!-- ❌ WXML 节点过多（>1000） -->
<view wx:for="{{longList}}" wx:key="id">
  <view class="item">{{item.name}}</view>
</view>

<!-- ✅ 使用虚拟列表或分页 -->
<scroll-view 
  scroll-y 
  bindscrolltolower="loadMore"
  style="height: 100vh;"
>
  <view wx:for="{{visibleList}}" wx:key="id">{{item.name}}</view>
</scroll-view>
```

## 样式规范审查

### rpx 单位使用

```css
/* ✅ 使用 rpx 适配不同屏幕 */
.container {
  width: 750rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

/* ❌ 使用 px（不同屏幕显示不一致） */
.container {
  width: 375px;
  padding: 10px;
  font-size: 14px;
}

/* ✅ 边框等细线可用 px */
.divider {
  border-bottom: 1px solid #eee;
}
```

### 样式隔离

```javascript
// ✅ 组件样式隔离
Component({
  options: {
    styleIsolation: 'isolated' // 完全隔离
    // 或 'apply-shared' 接受外部样式
    // 或 'shared' 共享样式
  }
})

// ❌ 未设置样式隔离（可能导致样式污染）
Component({
  // 默认 isolated
})
```

### 选择器规范

```css
/* ✅ 推荐使用 class 选择器 */
.user-card { }
.user-card .avatar { }

/* ❌ 避免使用标签选择器 */
view { }
text { }

/* ❌ 避免使用 ID 选择器 */
#user-card { }

/* ❌ 避免过深的选择器嵌套 */
.a .b .c .d .e { }
```

## 性能优化审查

### setData 优化

```javascript
// ❌ 频繁 setData
for (let i = 0; i < 100; i++) {
  this.setData({ [`list[${i}]`]: data[i] })
}

// ✅ 合并 setData
this.setData({ list: data })

// ❌ setData 数据量过大
this.setData({ 
  allData: hugeObject // 包含大量不需要渲染的数据
})

// ✅ 只传递需要渲染的数据
this.setData({ 
  displayList: hugeObject.slice(0, 20),
  total: hugeObject.length
})

// ✅ 使用路径更新
this.setData({
  'list[0].name': 'newName',
  'user.age': 25
})
```

### 分包策略

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/user/user"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "name": "packageA",
      "pages": [
        "pages/detail/detail"
      ]
    },
    {
      "root": "packageB",
      "name": "packageB",
      "pages": [
        "pages/order/order"
      ],
      "independent": true  // 独立分包
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]  // 预加载
    }
  }
}
```

### 首屏渲染优化

```javascript
// ✅ 使用骨架屏
Page({
  data: {
    loading: true,
    skeletonShow: true
  },
  onLoad() {
    this.fetchData().then(() => {
      this.setData({ 
        loading: false,
        skeletonShow: false 
      })
    })
  }
})

// ✅ 初始渲染缓存
{
  "initialRenderingCache": "static"  // 或 "dynamic"
}

// ✅ 按需注入
{
  "lazyCodeLoading": "requiredComponents"
}
```

### 图片优化

```xml
<!-- ✅ 使用 lazy-load -->
<image src="{{imgUrl}}" lazy-load mode="aspectFill" />

<!-- ✅ 使用 webp 格式 -->
<image src="{{imgUrl}}?type=webp" />

<!-- ❌ 大图片未压缩 -->
<image src="{{originalLargeImage}}" />

<!-- ✅ 使用 CDN 并指定尺寸 -->
<image src="{{imgUrl}}?w=200&h=200" style="width:200rpx;height:200rpx;" />
```

### 内存管理

```javascript
// ✅ 页面卸载时清理
Page({
  data: {
    timer: null,
    audioContext: null
  },
  onLoad() {
    this.data.timer = setInterval(() => {}, 1000)
    this.data.audioContext = wx.createInnerAudioContext()
  },
  onUnload() {
    clearInterval(this.data.timer)
    this.data.audioContext.destroy()
  }
})

// ❌ 未清理定时器和音频上下文
Page({
  onLoad() {
    setInterval(() => {}, 1000)  // 内存泄漏
    wx.createInnerAudioContext()  // 未销毁
  }
})
```

## 安全性审查

### 敏感数据处理

```javascript
// ❌ 明文存储敏感信息
wx.setStorageSync('password', password)
wx.setStorageSync('token', token)

// ✅ 敏感信息加密存储或不存储
// Token 应由服务端管理，使用 session

// ❌ 控制台打印敏感信息
console.log('用户密码:', password)
console.log('Token:', token)

// ✅ 生产环境禁用调试日志
if (__wxConfig.envVersion !== 'release') {
  console.log('Debug:', data)
}
```

### 网络请求安全

```javascript
// ✅ 使用 HTTPS
wx.request({
  url: 'https://api.example.com/data',
  method: 'POST',
  header: {
    'content-type': 'application/json'
  },
  data: { ... }
})

// ❌ 使用 HTTP（不安全）
wx.request({
  url: 'http://api.example.com/data'  // 小程序会阻止
})

// ✅ 请求参数验证
function validateParams(params) {
  if (!params.id || typeof params.id !== 'number') {
    throw new Error('Invalid params')
  }
}
```

### 用户隐私保护

```javascript
// ✅ 按需获取用户信息
wx.getUserProfile({
  desc: '用于完善会员资料',
  success: (res) => {
    // 仅获取必要信息
  }
})

// ❌ 过度获取权限
wx.authorize({
  scope: 'scope.userLocation'  // 非必要不获取
})

// ✅ 隐私协议声明
// app.json
{
  "__usePrivacyCheck__": true
}
```

### 输入验证

```javascript
// ✅ 前端输入验证
function validateInput(value) {
  // 长度限制
  if (value.length > 100) return false
  // XSS 防护
  if (/<script|javascript:/i.test(value)) return false
  return true
}

// ✅ 富文本安全渲染
<rich-text nodes="{{sanitizedHtml}}" />

// ❌ 直接渲染用户输入
<rich-text nodes="{{userInput}}" />
```

### WebView 安全

```javascript
// ✅ WebView URL 白名单验证
const allowedDomains = ['example.com', 'trusted.com']

function isValidUrl(url) {
  try {
    const { hostname } = new URL(url)
    return allowedDomains.some(domain => hostname.endsWith(domain))
  } catch {
    return false
  }
}

// ❌ 直接使用用户输入的 URL
<web-view src="{{userInputUrl}}" />

// ✅ 验证后使用
<web-view wx:if="{{isValidUrl}}" src="{{validatedUrl}}" />
```

## 可维护性审查

### 目录结构

```
├── app.js
├── app.json
├── app.wxss
├── pages/                 # 页面
│   ├── index/
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── user/
├── components/            # 组件
│   ├── user-card/
│   └── order-item/
├── utils/                 # 工具函数
│   ├── request.js
│   └── util.js
├── services/              # API 服务
│   ├── user.js
│   └── order.js
├── constants/             # 常量
│   └── index.js
└── assets/               # 静态资源
    └── images/
```

### 代码注释

```javascript
/**
 * 用户服务模块
 * @module services/user
 */

/**
 * 获取用户信息
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
function getUserInfo(userId) {
  return request({
    url: '/api/user/' + userId,
    method: 'GET'
  })
}

// ❌ 缺少注释
function fn(a, b) {
  return a + b
}
```

### 配置管理

```javascript
// ✅ 环境配置分离
// config/env.js
const envConfig = {
  develop: {
    baseUrl: 'https://dev-api.example.com'
  },
  trial: {
    baseUrl: 'https://test-api.example.com'
  },
  release: {
    baseUrl: 'https://api.example.com'
  }
}

const env = __wxConfig.envVersion || 'develop'
export default envConfig[env]

// ❌ 硬编码配置
wx.request({
  url: 'https://api.example.com/data'  // 无法切换环境
})
```

### 错误处理

```javascript
// ✅ 统一错误处理
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success(res) {
        if (res.statusCode === 200 && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' })
          reject(res.data)
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

// ❌ 未处理错误
wx.request({
  url: '/api/data',
  success(res) {
    // 未检查 statusCode 和业务码
    this.setData({ data: res.data })
  }
})
```

## 检查工具

### 微信开发者工具

```bash
# 代码质量检查
微信开发者工具 → 详情 → 本地设置 → 开启代码质量检查

# 性能分析
微信开发者工具 → 调试器 → Audits

# 体验评分
微信开发者工具 → 调试器 → Audits → 体验评分
```

### 代码规范检查

```bash
# ESLint 检查
npm run lint

# 小程序专用规则
npx eslint --ext .js,.wxs miniprogram/
```

### 包体积分析

```bash
# 查看代码包大小
微信开发者工具 → 详情 → 本地设置 → 代码包大小

# 分包大小检查
# 主包 ≤ 2MB，单个分包 ≤ 2MB，总包 ≤ 20MB
```

## 评分细则

### 组件设计 (20%)

| 子项 | 占比 |
|------|------|
| 职责单一 | 40% |
| 大小合理 | 30% |
| 命名规范 | 30% |

### WXML 规范 (15%)

| 子项 | 占比 |
|------|------|
| 数据绑定正确 | 30% |
| 条件渲染合理 | 30% |
| 列表渲染规范 | 40% |

### 性能优化 (25%)

| 子项 | 占比 |
|------|------|
| setData 优化 | 40% |
| 分包策略 | 30% |
| 首屏渲染 | 30% |

## 相关资源

- [检查清单](miniprogram-checklist.md)
- [组件设计示例](examples/component-design.md)
- [性能优化示例](examples/performance.md)
- [安全性示例](examples/security.md)

> 💡 如需专项安全扫描，请使用独立的 `code-security-scan` 技能
