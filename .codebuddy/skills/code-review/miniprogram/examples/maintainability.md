# 可维护性审查示例

展示微信小程序代码可维护性的常见问题和最佳实践。

## 示例 1：代码结构规范

### 问题代码

```javascript
// ❌ 问题：所有逻辑堆积在一个文件
// pages/order/order.js
Page({
  data: {
    orderList: [],
    userInfo: null,
    loading: false,
    // ... 50+ 个数据字段
  },
  
  onLoad() {
    this.getUserInfo()
    this.getOrderList()
    this.initSocket()
    this.bindEvents()
    // ... 20+ 行初始化代码
  },
  
  // 用户相关方法
  getUserInfo() { /* 50 行 */ },
  updateUserInfo() { /* 30 行 */ },
  
  // 订单相关方法
  getOrderList() { /* 80 行 */ },
  createOrder() { /* 100 行 */ },
  cancelOrder() { /* 60 行 */ },
  payOrder() { /* 120 行 */ },
  
  // 工具方法
  formatDate() { /* 20 行 */ },
  formatPrice() { /* 15 行 */ },
  
  // ... 总计 800+ 行
})
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 文件过大 | 🟠 P1 | 超过 300 行，难以维护 |
| 职责不单一 | 🟠 P1 | 用户、订单、工具逻辑混合 |
| 缺少模块化 | 🟡 P2 | 未使用 behaviors 或工具函数 |

### 修复代码

```javascript
// ✅ utils/format.js - 工具函数独立
export function formatDate(timestamp, format = 'YYYY-MM-DD') {
  // 日期格式化逻辑
}

export function formatPrice(price, unit = '元') {
  return `${(price / 100).toFixed(2)}${unit}`
}
```

```javascript
// ✅ services/order.js - 业务逻辑封装
import { request } from '../utils/request'

export const orderService = {
  async getList(params) {
    return request.get('/api/orders', params)
  },
  
  async create(data) {
    return request.post('/api/orders', data)
  },
  
  async cancel(orderId, reason) {
    return request.put(`/api/orders/${orderId}/cancel`, { reason })
  },
  
  async pay(orderId, paymentMethod) {
    return request.post(`/api/orders/${orderId}/pay`, { paymentMethod })
  }
}
```

```javascript
// ✅ behaviors/user.js - 用户相关 behavior
export const userBehavior = Behavior({
  data: {
    userInfo: null
  },
  
  methods: {
    async getUserInfo() {
      const userInfo = await userService.getInfo()
      this.setData({ userInfo })
    },
    
    async updateUserInfo(data) {
      await userService.update(data)
      await this.getUserInfo()
    }
  }
})
```

```javascript
// ✅ pages/order/order.js - 页面保持简洁
import { orderService } from '../../services/order'
import { userBehavior } from '../../behaviors/user'
import { formatDate, formatPrice } from '../../utils/format'

Page({
  behaviors: [userBehavior],
  
  data: {
    orderList: [],
    loading: false
  },
  
  async onLoad() {
    await this.initPage()
  },
  
  async initPage() {
    this.setData({ loading: true })
    try {
      await Promise.all([
        this.getUserInfo(),
        this.loadOrderList()
      ])
    } finally {
      this.setData({ loading: false })
    }
  },
  
  async loadOrderList() {
    const orderList = await orderService.getList()
    this.setData({
      orderList: orderList.map(order => ({
        ...order,
        formattedDate: formatDate(order.createTime),
        formattedPrice: formatPrice(order.totalPrice)
      }))
    })
  },
  
  async handlePay(e) {
    const { orderId } = e.currentTarget.dataset
    await orderService.pay(orderId, 'wechat')
    await this.loadOrderList()
  }
})
```

---

## 示例 2：配置管理规范

### 问题代码

```javascript
// ❌ 问题：硬编码配置散落各处
// pages/home/home.js
Page({
  onLoad() {
    wx.request({
      url: 'https://api.example.com/v1/products',
      header: {
        'X-App-Id': 'wx1234567890',
        'X-Version': '1.0.0'
      }
    })
  }
})

// pages/user/user.js
Page({
  onLoad() {
    wx.request({
      url: 'https://api.example.com/v1/user',  // 重复的域名
      header: {
        'X-App-Id': 'wx1234567890',  // 重复的配置
        'X-Version': '1.0.0'
      }
    })
  }
})

// ❌ 问题：环境配置混乱
const API_URL = 'https://api.example.com'  // 生产环境
// const API_URL = 'https://dev-api.example.com'  // 开发环境（注释切换）
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 硬编码配置 | 🟠 P1 | 修改困难，容易遗漏 |
| 配置重复 | 🟡 P2 | 违反 DRY 原则 |
| 环境切换靠注释 | 🟠 P1 | 容易出错，不安全 |

### 修复代码

```javascript
// ✅ config/index.js - 统一配置管理
const ENV = __wxConfig.envVersion || 'release'

const envConfig = {
  develop: {
    API_BASE_URL: 'https://dev-api.example.com',
    LOG_LEVEL: 'debug'
  },
  trial: {
    API_BASE_URL: 'https://staging-api.example.com',
    LOG_LEVEL: 'info'
  },
  release: {
    API_BASE_URL: 'https://api.example.com',
    LOG_LEVEL: 'error'
  }
}

export const config = {
  ...envConfig[ENV],
  APP_ID: 'wx1234567890',
  VERSION: '1.0.0',
  
  // 请求超时时间
  REQUEST_TIMEOUT: 30000,
  
  // 分页配置
  PAGE_SIZE: 20,
  
  // 缓存键名
  CACHE_KEYS: {
    USER_INFO: 'user_info',
    TOKEN: 'access_token'
  }
}
```

```javascript
// ✅ utils/request.js - 封装请求
import { config } from '../config/index'

class Request {
  constructor() {
    this.baseURL = config.API_BASE_URL
    this.timeout = config.REQUEST_TIMEOUT
  }
  
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        timeout: this.timeout,
        header: {
          'Content-Type': 'application/json',
          'X-App-Id': config.APP_ID,
          'X-Version': config.VERSION,
          ...options.header
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(res)
          }
        },
        fail: reject
      })
    })
  }
  
  get(url, data) {
    return this.request({ url, method: 'GET', data })
  }
  
  post(url, data) {
    return this.request({ url, method: 'POST', data })
  }
}

export const request = new Request()
```

---

## 示例 3：注释规范

### 问题代码

```javascript
// ❌ 问题：缺少注释或注释无意义
Page({
  data: {
    a: 1,  // a
    list: [],
    flag: false
  },
  
  // 处理点击
  handleClick() {
    // 设置数据
    this.setData({ flag: true })
  },
  
  calc(x, y, z) {
    return x * y + z * 0.1 - (x > 100 ? 5 : 0)
  }
})
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 变量命名不清晰 | 🟠 P1 | `a`、`flag` 无法理解含义 |
| 注释重复代码 | 🟢 P3 | "设置数据"无实际价值 |
| 复杂逻辑无注释 | 🟠 P1 | `calc` 函数逻辑不明 |

### 修复代码

```javascript
/**
 * 订单详情页
 * @description 展示订单信息，支持支付、取消等操作
 */
Page({
  data: {
    /** 当前页码 */
    currentPage: 1,
    /** 订单列表 */
    orderList: [],
    /** 是否正在加载 */
    isLoading: false
  },
  
  /**
   * 处理支付按钮点击
   * @param {Object} e - 事件对象
   */
  handlePayClick(e) {
    const { orderId } = e.currentTarget.dataset
    this.setData({ isLoading: true })
    this.payOrder(orderId)
  },
  
  /**
   * 计算订单最终价格
   * @param {number} originalPrice - 原价（分）
   * @param {number} quantity - 数量
   * @param {number} discountRate - 折扣率（0-1）
   * @returns {number} 最终价格（分）
   * 
   * @example
   * calcFinalPrice(10000, 2, 0.9) // 返回 17500
   * 
   * 计算规则：
   * 1. 基础价格 = 原价 × 数量
   * 2. 折扣金额 = 基础价格 × 折扣率
   * 3. 满100减5优惠（原价超过100元时）
   */
  calcFinalPrice(originalPrice, quantity, discountRate) {
    const basePrice = originalPrice * quantity
    const discountedPrice = basePrice * discountRate
    const extraDiscount = originalPrice > 10000 ? 500 : 0
    return discountedPrice - extraDiscount
  }
})
```

---

## 示例 4：错误处理规范

### 问题代码

```javascript
// ❌ 问题：缺少错误处理
Page({
  async loadData() {
    const res = await wx.request({ url: '/api/data' })
    this.setData({ list: res.data })
  },
  
  async handleSubmit() {
    await this.submitForm()
    wx.navigateBack()
  }
})
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无 try-catch | 🔴 P0 | 请求失败导致页面白屏 |
| 无用户反馈 | 🟠 P1 | 用户不知道操作结果 |
| 无 loading 状态 | 🟡 P2 | 用户体验差 |

### 修复代码

```javascript
// ✅ utils/error-handler.js - 统一错误处理
export function handleError(error, context = '') {
  console.error(`[${context}]`, error)
  
  // 网络错误
  if (error.errMsg?.includes('request:fail')) {
    wx.showToast({
      title: '网络连接失败，请检查网络',
      icon: 'none'
    })
    return
  }
  
  // 业务错误
  if (error.code) {
    wx.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    })
    return
  }
  
  // 未知错误
  wx.showToast({
    title: '系统繁忙，请稍后重试',
    icon: 'none'
  })
}
```

```javascript
// ✅ 页面中使用
import { handleError } from '../../utils/error-handler'

Page({
  data: {
    list: [],
    isLoading: false,
    isSubmitting: false
  },
  
  async loadData() {
    if (this.data.isLoading) return
    
    this.setData({ isLoading: true })
    try {
      const res = await request.get('/api/data')
      this.setData({ list: res.data })
    } catch (error) {
      handleError(error, 'loadData')
      // 可选：设置空状态
      this.setData({ list: [] })
    } finally {
      this.setData({ isLoading: false })
    }
  },
  
  async handleSubmit() {
    if (this.data.isSubmitting) return
    
    this.setData({ isSubmitting: true })
    wx.showLoading({ title: '提交中...' })
    
    try {
      await this.submitForm()
      wx.showToast({ title: '提交成功', icon: 'success' })
      
      // 延迟返回，让用户看到成功提示
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      handleError(error, 'handleSubmit')
    } finally {
      this.setData({ isSubmitting: false })
      wx.hideLoading()
    }
  }
})
```

---

## 审查清单

### 可维护性检查项

| 检查项 | 说明 |
|--------|------|
| ☐ 页面/组件 ≤ 300 行 | 超过应拆分 |
| ☐ 职责单一 | 一个文件只做一件事 |
| ☐ 使用 behaviors 复用逻辑 | 避免代码重复 |
| ☐ 配置集中管理 | 无硬编码 |
| ☐ 环境配置自动切换 | 不靠注释切换 |
| ☐ 变量命名有意义 | 避免 a、b、flag |
| ☐ 复杂逻辑有注释 | 说明业务规则 |
| ☐ 统一错误处理 | try-catch + 用户反馈 |
| ☐ 有 loading 状态 | 异步操作有反馈 |
| ☐ 工具函数独立 | 放在 utils 目录 |

---

## 相关资源

- [审查指南](../miniprogram-review.md)
- [检查清单](../miniprogram-checklist.md)
- [组件设计示例](component-design.md)
- [WXML 规范示例](wxml-standard.md)
- [性能优化示例](performance.md)
- [安全审查示例](security.md)
