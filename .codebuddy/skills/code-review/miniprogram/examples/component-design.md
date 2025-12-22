# 微信小程序组件设计示例

## 示例 1: 用户卡片组件

### 问题代码

```javascript
// components/user/user.js
Component({
  properties: {
    user: Object  // ❌ 缺少默认值和类型说明
  },
  data: {
    loading: false
  },
  methods: {
    onTap() {
      // ❌ 直接操作父组件
      this.selectOwnerComponent().setData({
        selectedUser: this.data.user
      })
    },
    // ❌ 组件内发起请求（职责不单一）
    async fetchDetail() {
      this.setData({ loading: true })
      const res = await wx.request({ url: '/api/user/' + this.data.user.id })
      this.setData({ detail: res.data, loading: false })
    }
  }
})
```

```xml
<!-- components/user/user.wxml -->
<!-- ❌ 模板过于复杂 -->
<view class="user-card" bindtap="onTap">
  <image src="{{user.avatar}}" />
  <view>{{user.name}}</view>
  <view>{{user.age}}岁</view>
  <view>{{user.gender === 1 ? '男' : '女'}}</view>
  <view>{{user.createTime.split('T')[0]}}</view>
  <view wx:if="{{loading}}">加载中...</view>
  <view wx:else>{{detail.bio}}</view>
</view>
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| Properties 缺少类型定义 | 🟠 P1 | 应定义完整类型和默认值 |
| 直接操作父组件 | 🔴 P0 | 应使用 triggerEvent |
| 组件内发起请求 | 🟡 P2 | 违反职责单一原则 |
| 模板中有复杂逻辑 | 🟡 P2 | 应使用 WXS 或在 JS 中处理 |

### 修复后代码

```javascript
// components/user-card/user-card.js
Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    userId: {
      type: Number,
      value: 0
    },
    userName: {
      type: String,
      value: ''
    },
    userAvatar: {
      type: String,
      value: '/assets/default-avatar.png'
    },
    userAge: {
      type: Number,
      value: 0
    },
    userGender: {
      type: Number,
      value: 0  // 0: 未知, 1: 男, 2: 女
    },
    createTime: {
      type: String,
      value: ''
    }
  },
  data: {
    genderText: '',
    formattedDate: ''
  },
  observers: {
    'userGender': function(gender) {
      const genderMap = { 0: '未知', 1: '男', 2: '女' }
      this.setData({ genderText: genderMap[gender] || '未知' })
    },
    'createTime': function(time) {
      if (time) {
        this.setData({ formattedDate: time.split('T')[0] })
      }
    }
  },
  methods: {
    onTap() {
      // ✅ 使用 triggerEvent 通知父组件
      this.triggerEvent('select', { userId: this.data.userId })
    }
  }
})
```

```xml
<!-- components/user-card/user-card.wxml -->
<view class="user-card" bindtap="onTap">
  <image class="avatar" src="{{userAvatar}}" mode="aspectFill" />
  <view class="info">
    <view class="name">{{userName}}</view>
    <view class="meta">{{userAge}}岁 · {{genderText}}</view>
    <view class="date">{{formattedDate}}</view>
  </view>
</view>
```

```css
/* components/user-card/user-card.wxss */
.user-card {
  display: flex;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.info {
  flex: 1;
  margin-left: 20rpx;
}

.name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.meta {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.date {
  font-size: 22rpx;
  color: #ccc;
  margin-top: 4rpx;
}
```

---

## 示例 2: 列表组件

### 问题代码

```xml
<!-- ❌ 使用 index 作为 key -->
<view wx:for="{{list}}" wx:key="index">
  <view>{{item.name}}</view>
</view>

<!-- ❌ 大列表直接渲染 -->
<view wx:for="{{allItems}}" wx:key="id">
  <!-- 1000+ 项直接渲染 -->
</view>
```

### 修复后代码

```javascript
// components/virtual-list/virtual-list.js
Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    itemHeight: {
      type: Number,
      value: 100  // rpx
    }
  },
  data: {
    visibleList: [],
    startIndex: 0,
    paddingTop: 0
  },
  lifetimes: {
    attached() {
      this.calculateVisibleItems(0)
    }
  },
  methods: {
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.calculateVisibleItems(scrollTop)
    },
    calculateVisibleItems(scrollTop) {
      const { list, itemHeight } = this.data
      const itemHeightPx = itemHeight * (wx.getSystemInfoSync().windowWidth / 750)
      const visibleCount = Math.ceil(wx.getSystemInfoSync().windowHeight / itemHeightPx) + 2
      
      const startIndex = Math.floor(scrollTop / itemHeightPx)
      const endIndex = Math.min(startIndex + visibleCount, list.length)
      
      this.setData({
        visibleList: list.slice(startIndex, endIndex),
        startIndex,
        paddingTop: startIndex * itemHeightPx
      })
    }
  }
})
```

```xml
<!-- components/virtual-list/virtual-list.wxml -->
<scroll-view 
  scroll-y 
  style="height: 100vh;"
  bindscroll="onScroll"
>
  <view style="padding-top: {{paddingTop}}px;">
    <view 
      wx:for="{{visibleList}}" 
      wx:key="id"
      style="height: {{itemHeight}}rpx;"
    >
      <slot name="item" item="{{item}}" index="{{startIndex + index}}"></slot>
    </view>
  </view>
</scroll-view>
```

---

## 示例 3: 表单组件

### 问题代码

```javascript
// ❌ 表单验证不完整
Page({
  data: {
    form: {}
  },
  onSubmit() {
    // 直接提交，无验证
    wx.request({
      url: '/api/submit',
      data: this.data.form
    })
  }
})
```

### 修复后代码

```javascript
// components/form-validator/form-validator.js
Component({
  properties: {
    rules: {
      type: Object,
      value: {}
    }
  },
  data: {
    errors: {}
  },
  methods: {
    validate(data) {
      const { rules } = this.data
      const errors = {}
      let isValid = true

      Object.keys(rules).forEach(field => {
        const rule = rules[field]
        const value = data[field]

        // 必填验证
        if (rule.required && !value) {
          errors[field] = rule.message || `${field}不能为空`
          isValid = false
          return
        }

        // 长度验证
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${field}长度不能少于${rule.minLength}位`
          isValid = false
          return
        }

        // 正则验证
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message || `${field}格式不正确`
          isValid = false
          return
        }
      })

      this.setData({ errors })
      return isValid
    },
    clearErrors() {
      this.setData({ errors: {} })
    }
  }
})
```

使用示例：

```javascript
// pages/register/register.js
Page({
  data: {
    form: {
      phone: '',
      password: ''
    },
    rules: {
      phone: {
        required: true,
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号'
      },
      password: {
        required: true,
        minLength: 6,
        message: '密码不能少于6位'
      }
    }
  },
  onSubmit() {
    const validator = this.selectComponent('#validator')
    if (validator.validate(this.data.form)) {
      // 验证通过，提交表单
      this.submitForm()
    }
  }
})
```

```xml
<!-- pages/register/register.wxml -->
<form-validator id="validator" rules="{{rules}}">
  <view class="form-item">
    <input 
      placeholder="手机号" 
      value="{{form.phone}}"
      bindinput="onPhoneInput"
    />
    <view class="error" wx:if="{{errors.phone}}">{{errors.phone}}</view>
  </view>
  <view class="form-item">
    <input 
      placeholder="密码" 
      password
      value="{{form.password}}"
      bindinput="onPasswordInput"
    />
    <view class="error" wx:if="{{errors.password}}">{{errors.password}}</view>
  </view>
  <button bindtap="onSubmit">注册</button>
</form-validator>
```
