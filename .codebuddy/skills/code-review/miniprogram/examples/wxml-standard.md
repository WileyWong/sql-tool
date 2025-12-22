# WXML 规范审查示例

展示 WXML 模板的常见问题和最佳实践。

## 示例 1：数据绑定规范

### 问题代码

```xml
<!-- ❌ 问题：复杂表达式在模板中 -->
<view class="user-info">
  <text>{{userInfo.firstName + ' ' + userInfo.lastName}}</text>
  <text>{{userInfo.age >= 18 ? '成年' : '未成年'}}</text>
  <text>{{userInfo.balance.toFixed(2)}}</text>
  <text>{{new Date(userInfo.createTime).toLocaleDateString()}}</text>
</view>

<!-- ❌ 问题：过深的属性访问 -->
<view>{{order.user.address.city.name}}</view>

<!-- ❌ 问题：事件处理内联逻辑 -->
<button data-id="{{item.id}}" data-type="{{item.type}}" data-status="{{item.status}}" 
        bindtap="handleClick">操作</button>
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 模板内复杂表达式 | 🟠 P1 | 逻辑应在 JS 中处理，模板保持简洁 |
| 过深属性访问 | 🟡 P2 | 可能因数据未加载导致报错 |
| 过多 data-* 属性 | 🟡 P2 | 建议使用数据索引或 id 查找 |

### 修复代码

```javascript
// ✅ JS 中处理数据
Page({
  data: {
    displayName: '',
    ageLabel: '',
    formattedBalance: '',
    formattedDate: '',
    cityName: ''
  },
  
  onLoad() {
    this.formatUserInfo()
  },
  
  formatUserInfo() {
    const { userInfo, order } = this.data
    this.setData({
      displayName: `${userInfo.firstName} ${userInfo.lastName}`,
      ageLabel: userInfo.age >= 18 ? '成年' : '未成年',
      formattedBalance: userInfo.balance.toFixed(2),
      formattedDate: new Date(userInfo.createTime).toLocaleDateString(),
      cityName: order?.user?.address?.city?.name || '未知'
    })
  },
  
  handleClick(e) {
    const { id } = e.currentTarget.dataset
    const item = this.data.list.find(i => i.id === id)
    // 通过 id 查找完整数据
  }
})
```

```xml
<!-- ✅ 模板保持简洁 -->
<view class="user-info">
  <text>{{displayName}}</text>
  <text>{{ageLabel}}</text>
  <text>{{formattedBalance}}</text>
  <text>{{formattedDate}}</text>
</view>

<view>{{cityName}}</view>

<button data-id="{{item.id}}" bindtap="handleClick">操作</button>
```

---

## 示例 2：条件渲染优化

### 问题代码

```xml
<!-- ❌ 问题：重复条件判断 -->
<view wx:if="{{userInfo && userInfo.isVip}}">
  <text>VIP 用户</text>
</view>
<view wx:if="{{userInfo && userInfo.isVip}}">
  <text>专属权益</text>
</view>
<view wx:if="{{userInfo && userInfo.isVip}}">
  <button>VIP 专区</button>
</view>

<!-- ❌ 问题：wx:if 和 wx:for 同时使用 -->
<view wx:for="{{list}}" wx:key="id" wx:if="{{item.visible}}">
  {{item.name}}
</view>

<!-- ❌ 问题：频繁切换使用 wx:if -->
<view wx:if="{{showPanel}}">
  <complex-component data="{{panelData}}" />
</view>
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 重复条件判断 | 🟠 P1 | 使用 block 包裹，减少判断次数 |
| wx:if 与 wx:for 同级 | 🟠 P1 | wx:for 优先级高于 wx:if，导致不必要的循环 |
| 频繁切换用 wx:if | 🟡 P2 | 频繁切换场景应使用 hidden |

### 修复代码

```xml
<!-- ✅ 使用 block 包裹相同条件 -->
<block wx:if="{{userInfo && userInfo.isVip}}">
  <view>
    <text>VIP 用户</text>
  </view>
  <view>
    <text>专属权益</text>
  </view>
  <view>
    <button>VIP 专区</button>
  </view>
</block>

<!-- ✅ 先过滤数据，再渲染 -->
<!-- JS 中: visibleList = list.filter(item => item.visible) -->
<view wx:for="{{visibleList}}" wx:key="id">
  {{item.name}}
</view>

<!-- ✅ 频繁切换使用 hidden -->
<view hidden="{{!showPanel}}">
  <complex-component data="{{panelData}}" />
</view>
```

```javascript
// ✅ 在 JS 中过滤数据
Page({
  data: {
    list: [],
    visibleList: []
  },
  
  updateList(list) {
    this.setData({
      list,
      visibleList: list.filter(item => item.visible)
    })
  }
})
```

---

## 示例 3：列表渲染最佳实践

### 问题代码

```xml
<!-- ❌ 问题：使用 index 作为 key -->
<view wx:for="{{list}}" wx:key="index">
  <text>{{item.name}}</text>
</view>

<!-- ❌ 问题：嵌套循环无 key -->
<view wx:for="{{categories}}" wx:for-item="category">
  <view wx:for="{{category.items}}">
    <text>{{item.name}}</text>
  </view>
</view>

<!-- ❌ 问题：长列表直接渲染 -->
<scroll-view scroll-y>
  <view wx:for="{{longList}}" wx:key="id" class="item">
    <image src="{{item.image}}" />
    <text>{{item.title}}</text>
  </view>
</scroll-view>
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| index 作为 key | 🟠 P1 | 列表变化时导致不必要的重渲染 |
| 嵌套循环缺少 key | 🔴 P0 | 可能导致数据错乱 |
| 长列表直接渲染 | 🟠 P1 | 性能问题，应使用虚拟列表 |

### 修复代码

```xml
<!-- ✅ 使用唯一 id 作为 key -->
<view wx:for="{{list}}" wx:key="id">
  <text>{{item.name}}</text>
</view>

<!-- ✅ 嵌套循环都有 key -->
<view wx:for="{{categories}}" wx:key="categoryId" wx:for-item="category">
  <view wx:for="{{category.items}}" wx:key="itemId" wx:for-item="subItem">
    <text>{{subItem.name}}</text>
  </view>
</view>

<!-- ✅ 长列表使用虚拟列表或分页 -->
<recycle-view 
  batch="{{batchSetRecycleData}}" 
  id="recycleId"
  height="{{windowHeight}}"
>
  <recycle-item wx:for="{{recycleList}}" wx:key="id">
    <view class="item">
      <image src="{{item.image}}" lazy-load />
      <text>{{item.title}}</text>
    </view>
  </recycle-item>
</recycle-view>
```

---

## 示例 4：节点数量控制

### 问题代码

```xml
<!-- ❌ 问题：过多嵌套层级 -->
<view class="container">
  <view class="wrapper">
    <view class="content">
      <view class="inner">
        <view class="item">
          <view class="text-wrapper">
            <text>内容</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</view>

<!-- ❌ 问题：不必要的包裹节点 -->
<view>
  <view class="title">
    <text>标题</text>
  </view>
</view>
```

### 审查意见

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 过多嵌套层级 | 🟡 P2 | 增加渲染开销，建议不超过 10 层 |
| 不必要的包裹节点 | 🟡 P2 | 减少 DOM 节点数量 |

### 修复代码

```xml
<!-- ✅ 减少嵌套层级 -->
<view class="container">
  <view class="content">
    <text class="item-text">内容</text>
  </view>
</view>

<!-- ✅ 移除不必要的包裹 -->
<view class="title">标题</view>

<!-- ✅ 使用 block 替代无样式包裹 -->
<block wx:if="{{showContent}}">
  <text>内容1</text>
  <text>内容2</text>
</block>
```

---

## 审查清单

### WXML 规范检查项

| 检查项 | 说明 |
|--------|------|
| ☐ 模板内无复杂表达式 | 逻辑在 JS 中处理 |
| ☐ 属性访问有防空处理 | 避免 undefined 报错 |
| ☐ wx:for 使用唯一 key | 非 index |
| ☐ wx:if 和 wx:for 不同级 | 先过滤再渲染 |
| ☐ 频繁切换用 hidden | wx:if 用于不常变化的条件 |
| ☐ 嵌套层级 ≤ 10 | 减少渲染开销 |
| ☐ 长列表使用虚拟滚动 | > 50 项考虑优化 |
| ☐ 图片使用 lazy-load | 列表中的图片延迟加载 |

---

## 相关资源

- [审查指南](../miniprogram-review.md)
- [检查清单](../miniprogram-checklist.md)
- [组件设计示例](component-design.md)
- [性能优化示例](performance.md)
- [安全审查示例](security.md)
