# 微信小程序性能优化示例

## 示例 1: setData 优化

### 问题代码

```javascript
// ❌ 频繁调用 setData
Page({
  data: {
    list: []
  },
  async loadData() {
    const items = await fetchItems()
    // 逐条更新，触发多次渲染
    for (let i = 0; i < items.length; i++) {
      this.setData({
        [`list[${i}]`]: items[i]
      })
    }
  }
})

// ❌ setData 传递大量无用数据
Page({
  data: {
    rawData: null  // 包含大量不需要渲染的字段
  },
  onLoad() {
    const data = fetchHugeData()  // 返回 100+ 字段
    this.setData({ rawData: data })  // 全部传递
  }
})
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 循环中调用 setData | 🔴 P0 | 导致频繁渲染，严重影响性能 |
| setData 数据量过大 | 🟠 P1 | 传递了不需要渲染的数据 |

### 修复后代码

```javascript
// ✅ 合并 setData 调用
Page({
  data: {
    list: []
  },
  async loadData() {
    const items = await fetchItems()
    // 一次性更新
    this.setData({ list: items })
  }
})

// ✅ 只传递需要渲染的数据
Page({
  data: {
    displayData: null
  },
  // 存储原始数据（不触发渲染）
  _rawData: null,
  
  onLoad() {
    const data = fetchHugeData()
    this._rawData = data  // 保存完整数据
    
    // 只传递渲染需要的字段
    this.setData({
      displayData: {
        id: data.id,
        name: data.name,
        avatar: data.avatar,
        summary: data.summary
      }
    })
  }
})

// ✅ 使用路径更新局部数据
Page({
  data: {
    user: {
      name: '',
      age: 0,
      settings: {
        theme: 'light'
      }
    }
  },
  updateTheme(theme) {
    // 只更新需要变化的字段
    this.setData({
      'user.settings.theme': theme
    })
  }
})
```

---

## 示例 2: 分包优化

### 问题配置

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/user/user",
    "pages/order/list",
    "pages/order/detail",
    "pages/product/list",
    "pages/product/detail",
    "pages/cart/cart",
    "pages/checkout/checkout",
    "pages/settings/settings",
    "pages/about/about"
  ]
  // ❌ 所有页面都在主包，导致主包过大
}
```

### 修复后配置

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/user/user"
  ],
  "subpackages": [
    {
      "root": "packageOrder",
      "name": "order",
      "pages": [
        "pages/list",
        "pages/detail"
      ]
    },
    {
      "root": "packageProduct",
      "name": "product",
      "pages": [
        "pages/list",
        "pages/detail"
      ]
    },
    {
      "root": "packageCart",
      "name": "cart",
      "pages": [
        "pages/cart",
        "pages/checkout"
      ]
    },
    {
      "root": "packageSettings",
      "name": "settings",
      "pages": [
        "pages/settings",
        "pages/about"
      ],
      "independent": true  // 独立分包
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["product"]  // 首页预加载商品分包
    },
    "pages/user/user": {
      "network": "wifi",
      "packages": ["order", "settings"]
    }
  }
}
```

---

## 示例 3: 首屏渲染优化

### 问题代码

```javascript
// ❌ 首屏加载慢
Page({
  data: {
    list: [],
    banners: [],
    categories: []
  },
  async onLoad() {
    // 串行请求，阻塞渲染
    const banners = await fetchBanners()
    this.setData({ banners })
    
    const categories = await fetchCategories()
    this.setData({ categories })
    
    const list = await fetchList()
    this.setData({ list })
  }
})
```

### 修复后代码

```javascript
// ✅ 首屏优化
Page({
  data: {
    loading: true,
    skeletonShow: true,
    list: [],
    banners: [],
    categories: []
  },
  
  onLoad() {
    // 并行请求
    Promise.all([
      this.fetchBanners(),
      this.fetchCategories(),
      this.fetchList()
    ]).then(([banners, categories, list]) => {
      // 一次性更新所有数据
      this.setData({
        banners,
        categories,
        list,
        loading: false,
        skeletonShow: false
      })
    })
  },
  
  async fetchBanners() {
    return await request('/api/banners')
  },
  
  async fetchCategories() {
    return await request('/api/categories')
  },
  
  async fetchList() {
    return await request('/api/list')
  }
})
```

```xml
<!-- 骨架屏 -->
<view wx:if="{{skeletonShow}}" class="skeleton">
  <view class="skeleton-banner"></view>
  <view class="skeleton-category">
    <view class="skeleton-item" wx:for="{{4}}" wx:key="index"></view>
  </view>
  <view class="skeleton-list">
    <view class="skeleton-card" wx:for="{{3}}" wx:key="index"></view>
  </view>
</view>

<!-- 实际内容 -->
<view wx:else>
  <swiper>
    <swiper-item wx:for="{{banners}}" wx:key="id">
      <image src="{{item.image}}" lazy-load />
    </swiper-item>
  </swiper>
  <!-- ... -->
</view>
```

```json
// pages/index/index.json
{
  "initialRenderingCache": "static",
  "componentPlaceholder": {
    "heavy-component": "view"
  }
}
```

---

## 示例 4: 图片优化

### 问题代码

```xml
<!-- ❌ 图片未优化 -->
<image src="{{item.originalImage}}" />  <!-- 原图 3MB -->
<image src="{{item.image}}" />  <!-- 未使用 lazy-load -->
```

### 修复后代码

```javascript
// utils/image.js
/**
 * 获取优化后的图片 URL
 * @param {string} url - 原始图片 URL
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @param {string} format - 图片格式
 */
function getOptimizedImageUrl(url, width = 200, height = 200, format = 'webp') {
  if (!url) return ''
  // 假设使用 CDN 图片处理
  return `${url}?imageView2/1/w/${width}/h/${height}/format/${format}/q/80`
}

module.exports = { getOptimizedImageUrl }
```

```xml
<!-- ✅ 图片优化 -->
<wxs module="imageUtil" src="../../utils/image.wxs"></wxs>

<image 
  src="{{imageUtil.getOptimizedUrl(item.image, 200, 200)}}" 
  lazy-load
  mode="aspectFill"
  style="width: 200rpx; height: 200rpx;"
/>
```

```javascript
// utils/image.wxs
function getOptimizedUrl(url, width, height) {
  if (!url) return ''
  return url + '?imageView2/1/w/' + width + '/h/' + height + '/format/webp/q/80'
}

module.exports = {
  getOptimizedUrl: getOptimizedUrl
}
```

---

## 示例 5: 内存泄漏修复

### 问题代码

```javascript
// ❌ 内存泄漏
Page({
  onLoad() {
    // 定时器未清理
    setInterval(() => {
      this.fetchData()
    }, 5000)
    
    // 音频上下文未销毁
    this.audioContext = wx.createInnerAudioContext()
    this.audioContext.src = 'xxx.mp3'
    
    // 事件监听未移除
    wx.onNetworkStatusChange(this.handleNetworkChange)
  },
  
  handleNetworkChange(res) {
    console.log('网络状态:', res.isConnected)
  }
})
```

### 修复后代码

```javascript
// ✅ 正确清理资源
Page({
  data: {
    timer: null,
    audioContext: null
  },
  
  onLoad() {
    // 保存定时器引用
    this.data.timer = setInterval(() => {
      this.fetchData()
    }, 5000)
    
    // 保存音频上下文引用
    this.data.audioContext = wx.createInnerAudioContext()
    this.data.audioContext.src = 'xxx.mp3'
    
    // 绑定 this
    this._handleNetworkChange = this.handleNetworkChange.bind(this)
    wx.onNetworkStatusChange(this._handleNetworkChange)
  },
  
  onUnload() {
    // 清理定时器
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.data.timer = null
    }
    
    // 销毁音频上下文
    if (this.data.audioContext) {
      this.data.audioContext.destroy()
      this.data.audioContext = null
    }
    
    // 移除事件监听
    wx.offNetworkStatusChange(this._handleNetworkChange)
  },
  
  handleNetworkChange(res) {
    console.log('网络状态:', res.isConnected)
  }
})
```

---

## 性能检查清单

| 检查项 | 优化方法 | 预期收益 |
|--------|---------|---------|
| setData 调用频率 | 合并调用、路径更新 | 减少渲染次数 |
| setData 数据量 | 只传渲染数据 | 减少传输和解析时间 |
| 主包体积 | 分包加载 | 加快首次启动 |
| 首屏渲染 | 骨架屏、并行请求 | 提升用户体验 |
| 图片加载 | lazy-load、CDN 压缩 | 减少流量和加载时间 |
| 内存占用 | 清理定时器和监听器 | 避免内存泄漏 |
