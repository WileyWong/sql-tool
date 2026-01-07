# 微信小程序进阶专项审查指南

基于微信小程序高级特性的进阶代码审查，覆盖 Skyline、WXS、Behaviors、云开发等。

> 📚 **前置**: 请先阅读 [小程序基础审查指南](miniprogram-review.md)
> ⚠️ **版本要求**: 部分特性需要特定基础库版本

## 进阶审查维度

| 维度 | 权重 | 检查要点 |
|------|------|---------|
| Skyline 渲染引擎 | 25% | 兼容性、特有组件、性能对比 |
| WXS 深度优化 | 25% | 适用场景、性能优势、边界限制 |
| Behaviors 复用 | 25% | 设计模式、命名冲突、最佳实践 |
| 云开发集成 | 25% | 数据库、云函数、存储安全 |

---

## 一、Skyline 渲染引擎 [基础库 2.14.0+]

### 1.1 Skyline 概述

```json
// app.json - 全局启用 Skyline
{
  "renderer": "skyline",
  "lazyCodeLoading": "requiredComponents",
  "componentFramework": "glass-easel"
}

// 或页面级启用
// pages/index/index.json
{
  "renderer": "skyline"
}
```

### 1.2 兼容性检查

```javascript
// ✅ 检测渲染引擎
Page({
  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const renderer = this.renderer // 'webview' 或 'skyline'
    
    console.log('当前渲染引擎:', renderer)
    
    // 根据渲染引擎调整逻辑
    if (renderer === 'skyline') {
      this.initSkylineFeatures()
    } else {
      this.initWebviewFallback()
    }
  }
})

// ✅ 兼容性降级
// app.json
{
  "renderer": "skyline",
  "rendererOptions": {
    "skyline": {
      "defaultDisplayBlock": true,
      "disableABTest": false,
      "sdkVersionBegin": "3.0.0",
      "sdkVersionEnd": "15.255.255"
    }
  }
}
```

### 1.3 Skyline 特有组件

```xml
<!-- ✅ scroll-view 增强 -->
<scroll-view
  type="list"
  scroll-y
  enable-passive
  bounces="{{true}}"
  show-scrollbar="{{false}}"
  fast-deceleration="{{true}}"
  bind:scrolltoupper="onScrollToUpper"
  bind:scrolltolower="onScrollToLower"
>
  <!-- 列表内容 -->
</scroll-view>

<!-- ✅ 使用 sticky 布局 -->
<scroll-view type="list" scroll-y>
  <sticky-header>
    <view class="header">固定头部</view>
  </sticky-header>
  
  <sticky-section>
    <sticky-header>
      <view class="section-header">分组标题</view>
    </sticky-header>
    <view wx:for="{{items}}" wx:key="id">{{item.name}}</view>
  </sticky-section>
</scroll-view>

<!-- ✅ grid-view 网格布局 -->
<grid-view
  type="masonry"
  cross-axis-count="2"
  main-axis-gap="10"
  cross-axis-gap="10"
>
  <view wx:for="{{items}}" wx:key="id" class="grid-item">
    <image src="{{item.image}}" mode="widthFix" />
    <text>{{item.title}}</text>
  </view>
</grid-view>

<!-- ✅ 手势组件 -->
<pan-gesture-handler
  tag="pan"
  onGestureEvent="onPan"
>
  <view class="draggable">可拖拽元素</view>
</pan-gesture-handler>
```

```javascript
// ✅ 手势处理
Page({
  onPan(e) {
    const { state, deltaX, deltaY } = e.detail
    
    if (state === 'active') {
      // 拖拽中
      this.setData({
        translateX: this.data.translateX + deltaX,
        translateY: this.data.translateY + deltaY
      })
    } else if (state === 'end') {
      // 拖拽结束
      this.snapToPosition()
    }
  }
})
```

### 1.4 Skyline 样式差异

```css
/* ✅ Skyline 支持的 CSS 特性 */

/* 1. position: sticky */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 2. CSS 变量 */
:root {
  --primary-color: #1890ff;
  --spacing: 16rpx;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}

/* 3. Flexbox 完整支持 */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

/* 4. Grid 布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}

/* ⚠️ Skyline 不支持的特性 */
/* 1. 部分伪元素选择器 */
/* 2. 部分 CSS 动画属性 */
/* 3. 某些复杂选择器 */

/* ✅ 兼容写法 */
.item {
  /* Webview 和 Skyline 都支持 */
  display: flex;
  align-items: center;
}
```

### 1.5 Skyline 性能对比

```javascript
// ✅ 性能监控
Page({
  onReady() {
    // 获取渲染性能数据
    const performance = wx.getPerformance()
    const observer = performance.createObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        console.log(`${entry.name}: ${entry.duration}ms`)
      })
    })
    
    observer.observe({ entryTypes: ['render', 'script'] })
  }
})

// ✅ Skyline 优势场景
const skylineAdvantages = {
  // 1. 长列表滚动
  longList: '原生滚动，更流畅',
  
  // 2. 复杂动画
  animation: 'CSS 动画性能更好',
  
  // 3. 手势交互
  gesture: '原生手势支持',
  
  // 4. 首屏渲染
  firstPaint: '更快的首屏时间'
}

// ⚠️ Skyline 劣势场景
const skylineLimitations = {
  // 1. 复杂 CSS
  complexCSS: '部分 CSS 不支持',
  
  // 2. 第三方组件
  thirdParty: '可能不兼容',
  
  // 3. 调试工具
  devtools: '调试体验不同'
}
```

---

## 二、WXS 深度优化

### 2.1 WXS 适用场景

```xml
<!-- ✅ 场景1：数据格式化（避免 setData） -->
<wxs module="format">
module.exports = {
  currency: function(value) {
    return '¥' + (value / 100).toFixed(2)
  },
  date: function(timestamp) {
    var d = getDate(timestamp)
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  },
  truncate: function(str, len) {
    if (!str) return ''
    return str.length > len ? str.substring(0, len) + '...' : str
  }
}
</wxs>

<view>价格: {{format.currency(price)}}</view>
<view>日期: {{format.date(createTime)}}</view>
<view>描述: {{format.truncate(description, 50)}}</view>

<!-- ✅ 场景2：条件判断（复杂逻辑） -->
<wxs module="logic">
module.exports = {
  getStatusClass: function(status, type) {
    var classMap = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      failed: 'status-failed'
    }
    var base = classMap[status] || 'status-default'
    return type === 'urgent' ? base + ' urgent' : base
  },
  canOperate: function(item, userRole) {
    if (userRole === 'admin') return true
    if (item.status === 'completed') return false
    return item.creatorId === item.currentUserId
  }
}
</wxs>

<view class="{{logic.getStatusClass(item.status, item.type)}}">
  {{item.name}}
</view>
<button wx:if="{{logic.canOperate(item, userRole)}}">操作</button>

<!-- ✅ 场景3：事件响应（无需通信） -->
<wxs module="touch" src="./touch.wxs"></wxs>

<view 
  bindtouchstart="{{touch.start}}"
  bindtouchmove="{{touch.move}}"
  bindtouchend="{{touch.end}}"
  style="transform: translateX({{offsetX}}px)"
>
  可滑动元素
</view>
```

```javascript
// touch.wxs
var startX = 0
var currentX = 0

module.exports = {
  start: function(event, ownerInstance) {
    startX = event.touches[0].pageX
    currentX = 0
  },
  
  move: function(event, ownerInstance) {
    var deltaX = event.touches[0].pageX - startX
    currentX = deltaX
    
    // 直接操作 DOM，无需 setData
    ownerInstance.selectComponent('.slider').setStyle({
      transform: 'translateX(' + deltaX + 'px)'
    })
  },
  
  end: function(event, ownerInstance) {
    // 触发回调到逻辑层
    ownerInstance.callMethod('onSlideEnd', {
      deltaX: currentX
    })
  }
}
```

### 2.2 WXS 性能优势

```javascript
// ❌ 传统方式：频繁 setData
Page({
  data: {
    items: []
  },
  
  formatItems(items) {
    // 每次都要 setData
    const formatted = items.map(item => ({
      ...item,
      priceText: '¥' + (item.price / 100).toFixed(2),
      dateText: this.formatDate(item.createTime)
    }))
    
    this.setData({ items: formatted })
  }
})

// ✅ WXS 方式：视图层直接处理
// 无需 setData，无通信开销
<wxs module="format" src="./format.wxs"></wxs>

<view wx:for="{{items}}" wx:key="id">
  <text>{{format.currency(item.price)}}</text>
  <text>{{format.date(item.createTime)}}</text>
</view>
```

```javascript
// 性能对比测试
Page({
  // 测试数据
  data: {
    list: [] // 1000 条数据
  },
  
  // ❌ setData 方式
  testSetData() {
    console.time('setData')
    
    const formatted = this.data.list.map(item => ({
      ...item,
      displayPrice: '¥' + item.price.toFixed(2)
    }))
    
    this.setData({ list: formatted }, () => {
      console.timeEnd('setData')  // 约 50-100ms
    })
  },
  
  // ✅ WXS 方式
  testWXS() {
    console.time('wxs')
    // WXS 在视图层直接处理，无需 setData
    // 渲染时间约 10-20ms
    console.timeEnd('wxs')
  }
})
```

### 2.3 WXS 限制与边界

```javascript
// ⚠️ WXS 限制

// 1. 不能调用小程序 API
// ❌ 错误
module.exports = {
  getData: function() {
    wx.request({})  // 不可用
  }
}

// 2. 不能使用 ES6+ 语法
// ❌ 错误
var fn = () => {}  // 箭头函数不支持
var { a, b } = obj  // 解构不支持
var str = `hello ${name}`  // 模板字符串不支持

// ✅ 正确
var fn = function() {}
var a = obj.a
var b = obj.b
var str = 'hello ' + name

// 3. 数据类型限制
// 支持: number, string, boolean, object, array, function, regexp, date
// 不支持: Symbol, Map, Set, Promise

// 4. 与逻辑层通信限制
// WXS 只能通过 callMethod 调用逻辑层方法
// 不能直接修改 data

// ✅ 正确的通信方式
// wxs
module.exports = {
  handleTap: function(event, ownerInstance) {
    // 调用逻辑层方法
    ownerInstance.callMethod('onItemTap', {
      id: event.currentTarget.dataset.id
    })
  }
}

// js
Page({
  onItemTap(data) {
    console.log('Item tapped:', data.id)
  }
})
```

### 2.4 WXS 最佳实践

```xml
<!-- ✅ 模块化组织 -->
<!-- utils/format.wxs -->
<wxs module="format">
// 通用格式化函数
function currency(value, symbol) {
  symbol = symbol || '¥'
  if (typeof value !== 'number') return symbol + '0.00'
  return symbol + (value / 100).toFixed(2)
}

function percent(value, decimals) {
  decimals = decimals || 0
  if (typeof value !== 'number') return '0%'
  return (value * 100).toFixed(decimals) + '%'
}

function fileSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}

module.exports = {
  currency: currency,
  percent: percent,
  fileSize: fileSize
}
</wxs>

<!-- 使用 -->
<wxs module="format" src="../../utils/format.wxs"></wxs>
<view>{{format.currency(price)}}</view>

<!-- ✅ 复杂交互封装 -->
<!-- components/swipe-cell/swipe.wxs -->
<wxs module="swipe">
var THRESHOLD = 80
var MAX_OFFSET = 160

function start(event, ownerInstance) {
  var instance = ownerInstance.selectComponent('.swipe-cell')
  instance.setStyle({ transition: 'none' })
  
  ownerInstance.callMethod('onSwipeStart', {
    startX: event.touches[0].pageX
  })
}

function move(event, ownerInstance) {
  var state = ownerInstance.getState()
  var deltaX = event.touches[0].pageX - state.startX
  
  // 限制范围
  deltaX = Math.max(-MAX_OFFSET, Math.min(0, deltaX))
  
  var instance = ownerInstance.selectComponent('.swipe-cell')
  instance.setStyle({
    transform: 'translateX(' + deltaX + 'px)'
  })
}

function end(event, ownerInstance) {
  var state = ownerInstance.getState()
  var deltaX = event.changedTouches[0].pageX - state.startX
  
  var instance = ownerInstance.selectComponent('.swipe-cell')
  instance.setStyle({ transition: 'transform 0.3s' })
  
  if (deltaX < -THRESHOLD) {
    instance.setStyle({ transform: 'translateX(-' + MAX_OFFSET + 'px)' })
    ownerInstance.callMethod('onSwipeOpen')
  } else {
    instance.setStyle({ transform: 'translateX(0)' })
    ownerInstance.callMethod('onSwipeClose')
  }
}

module.exports = {
  start: start,
  move: move,
  end: end
}
</wxs>
```

---

## 三、Behaviors 复用

### 3.1 Behaviors 基础

```javascript
// ✅ 定义 Behavior
// behaviors/formBehavior.js
module.exports = Behavior({
  properties: {
    disabled: {
      type: Boolean,
      value: false
    }
  },
  
  data: {
    _formErrors: {}
  },
  
  methods: {
    validate(rules) {
      const errors = {}
      
      Object.keys(rules).forEach(field => {
        const value = this.data[field]
        const fieldRules = rules[field]
        
        if (fieldRules.required && !value) {
          errors[field] = fieldRules.message || `${field} 不能为空`
        }
        
        if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
          errors[field] = fieldRules.message || `${field} 格式不正确`
        }
      })
      
      this.setData({ _formErrors: errors })
      return Object.keys(errors).length === 0
    },
    
    clearErrors() {
      this.setData({ _formErrors: {} })
    },
    
    getError(field) {
      return this.data._formErrors[field]
    }
  }
})

// ✅ 使用 Behavior
// components/login-form/login-form.js
const formBehavior = require('../../behaviors/formBehavior')

Component({
  behaviors: [formBehavior],
  
  data: {
    username: '',
    password: ''
  },
  
  methods: {
    onSubmit() {
      const isValid = this.validate({
        username: { required: true, message: '请输入用户名' },
        password: { 
          required: true, 
          pattern: /^.{6,}$/,
          message: '密码至少6位' 
        }
      })
      
      if (isValid) {
        this.triggerEvent('submit', {
          username: this.data.username,
          password: this.data.password
        })
      }
    }
  }
})
```

### 3.2 Behaviors 组合

```javascript
// ✅ 多个 Behaviors 组合
// behaviors/loadingBehavior.js
module.exports = Behavior({
  data: {
    loading: false,
    error: null
  },
  
  methods: {
    setLoading(status) {
      this.setData({ loading: status })
    },
    
    setError(error) {
      this.setData({ error: error })
    },
    
    clearError() {
      this.setData({ error: null })
    }
  }
})

// behaviors/paginationBehavior.js
module.exports = Behavior({
  data: {
    page: 1,
    pageSize: 20,
    hasMore: true,
    list: []
  },
  
  methods: {
    resetPagination() {
      this.setData({
        page: 1,
        hasMore: true,
        list: []
      })
    },
    
    appendList(newItems) {
      this.setData({
        list: [...this.data.list, ...newItems],
        page: this.data.page + 1,
        hasMore: newItems.length >= this.data.pageSize
      })
    }
  }
})

// ✅ 组合使用
const loadingBehavior = require('../../behaviors/loadingBehavior')
const paginationBehavior = require('../../behaviors/paginationBehavior')

Component({
  behaviors: [loadingBehavior, paginationBehavior],
  
  methods: {
    async loadData() {
      if (this.data.loading || !this.data.hasMore) return
      
      this.setLoading(true)
      this.clearError()
      
      try {
        const res = await api.getList({
          page: this.data.page,
          pageSize: this.data.pageSize
        })
        this.appendList(res.data)
      } catch (e) {
        this.setError(e.message)
      } finally {
        this.setLoading(false)
      }
    }
  }
})
```

### 3.3 命名冲突处理

```javascript
// ⚠️ 命名冲突规则
// 1. 组件自身 > behaviors
// 2. 后面的 behavior > 前面的 behavior
// 3. 嵌套 behavior 被扁平化处理

// ❌ 冲突示例
const behaviorA = Behavior({
  data: { count: 1 }
})

const behaviorB = Behavior({
  data: { count: 2 }  // 会覆盖 behaviorA 的 count
})

Component({
  behaviors: [behaviorA, behaviorB],
  data: { count: 3 }  // 最终值是 3
})

// ✅ 避免冲突：使用命名前缀
const behaviorA = Behavior({
  data: {
    _behaviorA_count: 1
  },
  methods: {
    _behaviorA_increment() {
      this.setData({
        _behaviorA_count: this.data._behaviorA_count + 1
      })
    }
  }
})

// ✅ 避免冲突：使用私有数据
const behaviorA = Behavior({
  lifetimes: {
    created() {
      // 使用实例属性存储私有数据
      this._behaviorAData = {
        count: 1
      }
    }
  },
  methods: {
    getBehaviorACount() {
      return this._behaviorAData.count
    }
  }
})
```

### 3.4 Behaviors vs Mixins vs Composables

```javascript
// 对比分析

// 1. Behaviors（小程序原生）
// 优点：原生支持，性能好
// 缺点：命名冲突，隐式依赖
const behavior = Behavior({
  data: { loading: false },
  methods: {
    setLoading(v) { this.setData({ loading: v }) }
  }
})

// 2. 工具函数（推荐简单场景）
// 优点：显式调用，无冲突
// 缺点：无法访问组件状态
function formatPrice(value) {
  return '¥' + (value / 100).toFixed(2)
}

// 3. 高阶组件（复杂场景）
// 优点：完全隔离
// 缺点：实现复杂
function withLoading(options) {
  return {
    ...options,
    data: {
      ...options.data,
      _loading: false
    },
    methods: {
      ...options.methods,
      setLoading(v) {
        this.setData({ _loading: v })
      }
    }
  }
}

Component(withLoading({
  data: { items: [] },
  methods: {
    async loadItems() {
      this.setLoading(true)
      // ...
    }
  }
}))
```

---

## 四、云开发集成

### 4.1 云数据库安全

```javascript
// ✅ 安全规则配置
// database/security-rules.json
{
  "users": {
    // 只能读写自己的数据
    "read": "auth.openid == doc.openid",
    "write": "auth.openid == doc.openid"
  },
  "posts": {
    // 所有人可读，只有作者可写
    "read": true,
    "write": "auth.openid == doc.authorId"
  },
  "admin_logs": {
    // 只有管理员可访问
    "read": "auth.openid in get('database.admins.${auth.openid}').adminIds",
    "write": false
  }
}

// ✅ 数据验证
// 云函数中验证数据
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  
  // 验证必填字段
  if (!event.title || !event.content) {
    return { success: false, error: '标题和内容不能为空' }
  }
  
  // 验证数据长度
  if (event.title.length > 100) {
    return { success: false, error: '标题不能超过100字' }
  }
  
  // 验证数据类型
  if (typeof event.price !== 'number' || event.price < 0) {
    return { success: false, error: '价格必须是正数' }
  }
  
  // XSS 防护
  const sanitizedContent = sanitizeHtml(event.content)
  
  // 写入数据
  const result = await db.collection('posts').add({
    data: {
      title: event.title,
      content: sanitizedContent,
      authorId: OPENID,
      createTime: db.serverDate()
    }
  })
  
  return { success: true, id: result._id }
}
```

### 4.2 云函数最佳实践

```javascript
// ✅ 云函数结构
// cloudfunctions/user/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 统一响应格式
function success(data) {
  return { code: 0, data }
}

function error(message, code = -1) {
  return { code, message }
}

// 路由处理
const handlers = {
  // 获取用户信息
  async getProfile(event, context) {
    const { OPENID } = cloud.getWXContext()
    
    const user = await db.collection('users')
      .where({ openid: OPENID })
      .get()
    
    if (user.data.length === 0) {
      return error('用户不存在', 404)
    }
    
    return success(user.data[0])
  },
  
  // 更新用户信息
  async updateProfile(event, context) {
    const { OPENID } = cloud.getWXContext()
    const { nickname, avatar } = event
    
    // 参数验证
    if (!nickname || nickname.length > 20) {
      return error('昵称不能为空且不超过20字')
    }
    
    await db.collection('users')
      .where({ openid: OPENID })
      .update({
        data: {
          nickname,
          avatar,
          updateTime: db.serverDate()
        }
      })
    
    return success({ updated: true })
  }
}

// 主入口
exports.main = async (event, context) => {
  const { action } = event
  
  if (!handlers[action]) {
    return error('未知操作')
  }
  
  try {
    return await handlers[action](event, context)
  } catch (e) {
    console.error(e)
    return error('服务器错误', 500)
  }
}
```

### 4.3 云存储安全

```javascript
// ✅ 文件上传安全
Page({
  async uploadImage() {
    // 1. 选择图片
    const res = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed']
    })
    
    const file = res.tempFiles[0]
    
    // 2. 验证文件
    if (file.size > 5 * 1024 * 1024) {
      wx.showToast({ title: '图片不能超过5MB', icon: 'none' })
      return
    }
    
    // 3. 生成安全的文件名
    const ext = file.tempFilePath.split('.').pop()
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif']
    
    if (!allowedExts.includes(ext.toLowerCase())) {
      wx.showToast({ title: '不支持的图片格式', icon: 'none' })
      return
    }
    
    const cloudPath = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    
    // 4. 上传
    const uploadRes = await wx.cloud.uploadFile({
      cloudPath,
      filePath: file.tempFilePath
    })
    
    return uploadRes.fileID
  }
})

// ✅ 云函数中处理文件
exports.main = async (event, context) => {
  const { fileID } = event
  
  // 验证文件 ID 格式
  if (!fileID || !fileID.startsWith('cloud://')) {
    return { success: false, error: '无效的文件ID' }
  }
  
  // 获取文件临时链接
  const res = await cloud.getTempFileURL({
    fileList: [fileID]
  })
  
  return { success: true, url: res.fileList[0].tempFileURL }
}
```

### 4.4 云开发性能优化

```javascript
// ✅ 数据库查询优化
async function getOrderList(userId, page, pageSize) {
  const db = cloud.database()
  const _ = db.command
  
  // 1. 使用索引字段查询
  // 确保 userId 和 createTime 有索引
  const orders = await db.collection('orders')
    .where({
      userId: userId,
      status: _.neq('deleted')
    })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .field({  // 2. 只返回需要的字段
      _id: true,
      orderNo: true,
      totalAmount: true,
      status: true,
      createTime: true
    })
    .get()
  
  return orders.data
}

// ✅ 批量操作
async function batchUpdateStatus(orderIds, status) {
  const db = cloud.database()
  const _ = db.command
  
  // 使用 where + update 批量更新
  const result = await db.collection('orders')
    .where({
      _id: _.in(orderIds)
    })
    .update({
      data: {
        status: status,
        updateTime: db.serverDate()
      }
    })
  
  return result.stats.updated
}

// ✅ 聚合查询
async function getOrderStats(userId) {
  const db = cloud.database()
  const $ = db.command.aggregate
  
  const result = await db.collection('orders')
    .aggregate()
    .match({
      userId: userId
    })
    .group({
      _id: '$status',
      count: $.sum(1),
      totalAmount: $.sum('$totalAmount')
    })
    .end()
  
  return result.list
}

// ✅ 事务处理
async function createOrder(orderData) {
  const db = cloud.database()
  
  const transaction = await db.startTransaction()
  
  try {
    // 1. 检查库存
    const product = await transaction.collection('products')
      .doc(orderData.productId)
      .get()
    
    if (product.data.stock < orderData.quantity) {
      await transaction.rollback()
      return { success: false, error: '库存不足' }
    }
    
    // 2. 扣减库存
    await transaction.collection('products')
      .doc(orderData.productId)
      .update({
        data: {
          stock: db.command.inc(-orderData.quantity)
        }
      })
    
    // 3. 创建订单
    await transaction.collection('orders')
      .add({
        data: orderData
      })
    
    await transaction.commit()
    return { success: true }
    
  } catch (e) {
    await transaction.rollback()
    throw e
  }
}
```

---

## 审查检查清单

### Skyline 检查

- [ ] 检测渲染引擎并做兼容处理
- [ ] 使用 Skyline 特有组件提升性能
- [ ] CSS 样式兼容 Skyline 限制
- [ ] 手势交互使用原生组件

### WXS 检查

- [ ] 格式化逻辑使用 WXS 避免 setData
- [ ] 复杂交互使用 WXS 提升响应速度
- [ ] WXS 代码遵循 ES5 语法
- [ ] WXS 模块化组织

### Behaviors 检查

- [ ] Behaviors 职责单一
- [ ] 使用命名前缀避免冲突
- [ ] 文档说明 Behavior 依赖
- [ ] 考虑是否需要用 Behavior

### 云开发检查

- [ ] 数据库安全规则配置
- [ ] 云函数参数验证
- [ ] 文件上传类型和大小限制
- [ ] 数据库查询使用索引
- [ ] 敏感操作使用事务

---

## 相关资源

- [小程序基础审查指南](miniprogram-review.md)
- [小程序检查清单](miniprogram-checklist.md)
- [Skyline 官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)
- [WXS 官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)
- [Behaviors 官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)
- [云开发官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
