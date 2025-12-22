# 微信小程序安全性示例

## 示例 1: 敏感数据存储

### 问题代码

```javascript
// ❌ 明文存储敏感信息
Page({
  onLogin(res) {
    const { token, password, phone } = res.data
    
    // 危险：明文存储
    wx.setStorageSync('token', token)
    wx.setStorageSync('password', password)
    wx.setStorageSync('phone', phone)
    
    // 危险：控制台打印
    console.log('登录成功，Token:', token)
    console.log('用户密码:', password)
  }
})
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 明文存储密码 | 🔴 P0 | 密码不应存储在客户端 |
| 明文存储 Token | 🟠 P1 | Token 应由服务端 Session 管理 |
| 控制台打印敏感信息 | 🔴 P0 | 可能被恶意获取 |

### 修复后代码

```javascript
// ✅ 安全的登录处理
Page({
  onLogin(res) {
    const { sessionKey } = res.data
    
    // 只存储会话标识，不存储敏感信息
    // Token 由服务端通过 Cookie/Session 管理
    
    // 生产环境不打印日志
    if (__wxConfig.envVersion !== 'release') {
      console.log('登录成功')
    }
    
    // 跳转到首页
    wx.switchTab({ url: '/pages/index/index' })
  }
})

// utils/logger.js
const logger = {
  debug(...args) {
    if (__wxConfig.envVersion !== 'release') {
      console.log('[DEBUG]', ...args)
    }
  },
  info(...args) {
    if (__wxConfig.envVersion !== 'release') {
      console.info('[INFO]', ...args)
    }
  },
  error(...args) {
    // 错误日志可以上报
    console.error('[ERROR]', ...args)
    // 上报到监控平台
    this.report('error', args)
  },
  report(level, data) {
    // 过滤敏感信息后上报
    const sanitized = this.sanitize(data)
    wx.request({
      url: '/api/log',
      method: 'POST',
      data: { level, data: sanitized }
    })
  },
  sanitize(data) {
    // 过滤敏感字段
    const sensitiveKeys = ['password', 'token', 'secret', 'key']
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        return '***'
      }
      return value
    }))
  }
}

module.exports = logger
```

---

## 示例 2: 网络请求安全

### 问题代码

```javascript
// ❌ 不安全的请求
function request(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,  // 可能是 HTTP
      data: data,
      success(res) {
        resolve(res.data)  // 未检查状态码
      }
    })
  })
}

// ❌ SQL 注入风险
Page({
  onSearch(e) {
    const keyword = e.detail.value
    // 直接拼接用户输入
    request('/api/search?keyword=' + keyword)
  }
})
```

### 修复后代码

```javascript
// utils/request.js
const config = require('./config')

/**
 * 安全的网络请求封装
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {} } = options
    
    // 确保使用 HTTPS
    const fullUrl = url.startsWith('http') ? url : config.baseUrl + url
    if (!fullUrl.startsWith('https://')) {
      reject(new Error('必须使用 HTTPS 协议'))
      return
    }
    
    wx.request({
      url: fullUrl,
      method,
      data,
      header: {
        'content-type': 'application/json',
        // 添加 CSRF Token
        'X-CSRF-Token': getApp().globalData.csrfToken
      },
      success(res) {
        // 检查 HTTP 状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 检查业务状态码
          if (res.data.code === 0) {
            resolve(res.data.data)
          } else if (res.data.code === 401) {
            // Token 过期，重新登录
            wx.redirectTo({ url: '/pages/login/login' })
            reject(new Error('登录已过期'))
          } else {
            wx.showToast({ 
              title: res.data.message || '请求失败', 
              icon: 'none' 
            })
            reject(res.data)
          }
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode}`))
        }
      },
      fail(err) {
        wx.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

// ✅ 安全的搜索
Page({
  onSearch(e) {
    const keyword = e.detail.value
    
    // 输入验证
    if (!this.validateInput(keyword)) {
      wx.showToast({ title: '输入包含非法字符', icon: 'none' })
      return
    }
    
    // 使用参数化请求
    request({
      url: '/api/search',
      method: 'POST',
      data: { keyword }  // 服务端进行参数化处理
    })
  },
  
  validateInput(value) {
    // 检查长度
    if (value.length > 100) return false
    // 检查危险字符
    if (/<script|javascript:|on\w+=/i.test(value)) return false
    return true
  }
})

module.exports = { request }
```

---

## 示例 3: 用户输入验证

### 问题代码

```javascript
// ❌ 未验证用户输入
Page({
  data: {
    userInput: ''
  },
  onInput(e) {
    this.setData({ userInput: e.detail.value })
  },
  onSubmit() {
    // 直接使用用户输入
    request('/api/submit', { content: this.data.userInput })
  }
})
```

```xml
<!-- ❌ 直接渲染用户输入的 HTML -->
<rich-text nodes="{{userInput}}" />
```

### 修复后代码

```javascript
// utils/validator.js
const validator = {
  // 验证手机号
  phone(value) {
    return /^1[3-9]\d{9}$/.test(value)
  },
  
  // 验证邮箱
  email(value) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
  },
  
  // 验证长度
  length(value, min, max) {
    const len = value.length
    return len >= min && len <= max
  },
  
  // XSS 过滤
  sanitizeHtml(html) {
    if (!html) return ''
    // 移除危险标签和属性
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  },
  
  // 通用输入验证
  input(value, options = {}) {
    const { maxLength = 500, allowHtml = false } = options
    
    if (!value) return { valid: false, message: '内容不能为空' }
    if (value.length > maxLength) {
      return { valid: false, message: `内容不能超过${maxLength}字` }
    }
    if (!allowHtml && /<[^>]+>/g.test(value)) {
      return { valid: false, message: '内容包含非法字符' }
    }
    
    return { valid: true }
  }
}

module.exports = validator
```

```javascript
// pages/submit/submit.js
const validator = require('../../utils/validator')

Page({
  data: {
    userInput: '',
    sanitizedHtml: ''
  },
  
  onInput(e) {
    const value = e.detail.value
    const result = validator.input(value, { maxLength: 200 })
    
    if (!result.valid) {
      wx.showToast({ title: result.message, icon: 'none' })
      return
    }
    
    this.setData({ userInput: value })
  },
  
  onSubmit() {
    const { userInput } = this.data
    const result = validator.input(userInput)
    
    if (!result.valid) {
      wx.showToast({ title: result.message, icon: 'none' })
      return
    }
    
    request({
      url: '/api/submit',
      method: 'POST',
      data: { content: userInput }
    })
  },
  
  // 安全渲染富文本
  renderRichText(html) {
    const sanitized = validator.sanitizeHtml(html)
    this.setData({ sanitizedHtml: sanitized })
  }
})
```

```xml
<!-- ✅ 渲染过滤后的内容 -->
<rich-text nodes="{{sanitizedHtml}}" />
```

---

## 示例 4: WebView 安全

### 问题代码

```javascript
// ❌ 直接使用用户输入的 URL
Page({
  data: {
    webviewUrl: ''
  },
  onLoad(options) {
    // 危险：直接使用 URL 参数
    this.setData({ webviewUrl: decodeURIComponent(options.url) })
  }
})
```

```xml
<!-- ❌ 未验证的 URL -->
<web-view src="{{webviewUrl}}" />
```

### 修复后代码

```javascript
// utils/url-validator.js
const allowedDomains = [
  'example.com',
  'trusted-partner.com',
  'cdn.example.com'
]

function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    
    // 必须是 HTTPS
    if (parsed.protocol !== 'https:') {
      return { valid: false, message: '必须使用 HTTPS 协议' }
    }
    
    // 检查域名白名单
    const hostname = parsed.hostname
    const isAllowed = allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
    
    if (!isAllowed) {
      return { valid: false, message: '不允许访问该域名' }
    }
    
    // 检查危险路径
    if (parsed.pathname.includes('..')) {
      return { valid: false, message: 'URL 包含非法路径' }
    }
    
    return { valid: true, url: parsed.href }
  } catch (e) {
    return { valid: false, message: 'URL 格式不正确' }
  }
}

module.exports = { isValidUrl, allowedDomains }
```

```javascript
// pages/webview/webview.js
const { isValidUrl } = require('../../utils/url-validator')

Page({
  data: {
    webviewUrl: '',
    isValid: false
  },
  
  onLoad(options) {
    if (!options.url) {
      wx.showToast({ title: '缺少 URL 参数', icon: 'none' })
      wx.navigateBack()
      return
    }
    
    const url = decodeURIComponent(options.url)
    const result = isValidUrl(url)
    
    if (result.valid) {
      this.setData({ 
        webviewUrl: result.url,
        isValid: true
      })
    } else {
      wx.showModal({
        title: '安全提示',
        content: result.message,
        showCancel: false,
        success: () => wx.navigateBack()
      })
    }
  }
})
```

```xml
<!-- ✅ 只渲染验证通过的 URL -->
<web-view wx:if="{{isValid}}" src="{{webviewUrl}}" />
<view wx:else class="loading">验证中...</view>
```

---

## 示例 5: 隐私权限管理

### 问题代码

```javascript
// ❌ 过度获取权限
Page({
  onLoad() {
    // 一次性获取所有权限
    wx.authorize({ scope: 'scope.userLocation' })
    wx.authorize({ scope: 'scope.camera' })
    wx.authorize({ scope: 'scope.record' })
    wx.authorize({ scope: 'scope.writePhotosAlbum' })
  }
})
```

### 修复后代码

```javascript
// utils/permission.js
const permissionManager = {
  // 权限描述映射
  scopeDesc: {
    'scope.userLocation': '获取您的位置信息，用于显示附近门店',
    'scope.camera': '使用相机，用于扫码功能',
    'scope.record': '使用麦克风，用于语音搜索',
    'scope.writePhotosAlbum': '保存图片到相册'
  },
  
  /**
   * 按需请求权限
   * @param {string} scope - 权限范围
   * @returns {Promise<boolean>}
   */
  async request(scope) {
    try {
      // 先检查是否已授权
      const setting = await wx.getSetting()
      
      if (setting.authSetting[scope]) {
        return true
      }
      
      if (setting.authSetting[scope] === false) {
        // 用户之前拒绝过，引导去设置页
        return this.openSetting(scope)
      }
      
      // 首次请求
      await wx.authorize({ scope })
      return true
    } catch (e) {
      return this.openSetting(scope)
    }
  },
  
  /**
   * 引导用户打开设置
   */
  async openSetting(scope) {
    const desc = this.scopeDesc[scope] || '使用该功能'
    
    return new Promise((resolve) => {
      wx.showModal({
        title: '权限申请',
        content: `需要${desc}，请在设置中开启权限`,
        confirmText: '去设置',
        success: async (res) => {
          if (res.confirm) {
            const setting = await wx.openSetting()
            resolve(!!setting.authSetting[scope])
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}

module.exports = permissionManager
```

```javascript
// pages/scan/scan.js
const permission = require('../../utils/permission')

Page({
  async onScanTap() {
    // 按需请求相机权限
    const hasPermission = await permission.request('scope.camera')
    
    if (hasPermission) {
      wx.scanCode({
        success: (res) => {
          this.handleScanResult(res.result)
        }
      })
    } else {
      wx.showToast({ title: '需要相机权限才能扫码', icon: 'none' })
    }
  }
})
```

---

## 安全检查清单

| 检查项 | 风险等级 | 修复方案 |
|--------|---------|---------|
| 明文存储密码 | 🔴 严重 | 不存储密码，使用 Session |
| 控制台打印敏感信息 | 🔴 严重 | 生产环境禁用日志 |
| HTTP 请求 | 🟠 高危 | 强制使用 HTTPS |
| 未验证用户输入 | 🟠 高危 | 前端验证 + 后端验证 |
| XSS 漏洞 | 🟠 高危 | 过滤 HTML 标签 |
| WebView URL 未验证 | 🟠 高危 | 域名白名单 |
| 过度获取权限 | 🟡 中危 | 按需申请 |
