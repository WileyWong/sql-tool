# 重构示例

## CSS 变量命名说明

本示例中使用 TDesign 设计系统，因此保留 `--td-*` 前缀的官方变量。

| 变量类型 | 前缀 | 示例 | 说明 |
|----------|------|------|------|
| **TDesign 官方** | `--td-*` | `--td-brand-color` | 设计系统变量，保持原样 |
| **业务扩展** | `--theme-*` | `--theme-primary` | 活动主题定制变量 |
| **组件级** | `--{component}-*` | `--card-bg` | 组件内部变量 |

> **注意**：如果项目不使用 TDesign，应统一使用 `--app-*` 前缀。详见 [css-refactoring.md](css-refactoring.md) 中的命名规范。

---

## 示例1：H5活动页CSS重构（TDesign 项目）

### 重构前代码（850行）

```css
/* 页面背景 - 重复定义 */
.page-welcome {
    min-height: 100vh;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #F5F7FA 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
}

.page-data {
    min-height: 100vh;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #F5F7FA 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
}

.page-no-access {
    min-height: 100vh;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #F5F7FA 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.page-no-data {
    min-height: 100vh;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #F5F7FA 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

/* 卡片样式 - 重复定义 */
.no-access-card {
    background: #fff;
    border-radius: 12px;
    padding: 48px 32px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    text-align: center;
    max-width: 320px;
    width: 100%;
}

.no-data-card {
    background: #fff;
    border-radius: 12px;
    padding: 48px 32px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    text-align: center;
    max-width: 320px;
    width: 100%;
}

.low-data-card {
    background: #fff;
    border-radius: 12px;
    padding: 40px 32px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    text-align: center;
    max-width: 320px;
    width: 100%;
}

/* 头像样式 - 重复定义 */
.welcome-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #fff;
    margin-bottom: 24px;
}

.data-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: #fff;
    margin-bottom: 16px;
}

.small-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
}

/* 标题样式 - 深色背景文字问题 */
.page-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;  /* 问题：深色背景上使用深色文字 */
    margin-bottom: 8px;
}

.page-desc {
    font-size: 16px;
    color: #666;  /* 问题：深色背景上对比度不足 */
    margin-bottom: 32px;
}

/* 更多重复样式... */
```

### 重构后代码（230行）

```css
/* ========== 第一层：设计令牌 ========== */
:root {
    /* 基础设计令牌（TDesign系统） */
    --td-brand-color: #125FFF;
    --td-text-color-primary: rgba(0,0,0,0.9);
    --td-text-color-anti: #FFFFFF;
    --td-bg-color-container: #FFFFFF;
    --td-bg-color-page: #F5F7FA;
    --td-radius-default: 3px;
    --td-radius-medium: 6px;
    --td-radius-large: 9px;
    --td-radius-extraLarge: 12px;
    --td-radius-round: 50%;
    --td-shadow-2: 0 2px 8px rgba(0,0,0,0.08);
    --td-shadow-3: 0 4px 16px rgba(0,0,0,0.12);
    --td-size-4: 8px;
    --td-size-6: 16px;
    --td-size-8: 24px;
    --td-size-10: 32px;
    
    /* 语义化令牌（活动主题） */
    --theme-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --theme-primary-start: #667eea;
    --theme-primary-end: #764ba2;
    --bg-gradient-theme: linear-gradient(180deg, #667eea 0%, #764ba2 50%, var(--td-bg-color-page) 100%);
    
    /* 组件级令牌 */
    --card-bg: var(--td-bg-color-container);
    --card-radius: var(--td-radius-extraLarge);
    --card-shadow: var(--td-shadow-3);
    --card-padding: 48px var(--td-size-10);
}

/* ========== 第二层：通用工具类 ========== */
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-col { display: flex; flex-direction: column; }
.flex-col-center { display: flex; flex-direction: column; align-items: center; }
.text-center { text-align: center; }

/* ========== 第三层：组件基类 ========== */

/* 页面容器 */
.page-base {
    min-height: 100vh;
    background: var(--bg-gradient-theme);
    padding: 60px 20px;
}
.page-base.flex-col-center { padding: 40px 20px; justify-content: center; }

/* 卡片组件 */
.card-base {
    background: var(--card-bg);
    border-radius: var(--card-radius);
    max-width: 320px;
    width: 100%;
}
.card-default { padding: var(--card-padding); box-shadow: var(--td-shadow-3); }
.card-compact { padding: 40px var(--td-size-10); box-shadow: var(--td-shadow-2); }

/* 头像组件 */
.avatar-base { 
    border-radius: var(--td-radius-round); 
    background: var(--theme-primary);
    color: var(--td-text-color-anti);
}
.avatar-sm { width: 60px; height: 60px; font-size: 28px; }
.avatar-md { width: 80px; height: 80px; font-size: 40px; margin-bottom: var(--td-size-8); }
.avatar-lg { width: 100px; height: 100px; font-size: 48px; margin-bottom: var(--td-size-6); }

/* ========== 第四层：页面布局 ========== */

/* 合并相同背景的页面 */
.page-welcome, .page-data, .page-no-access, .page-no-data { 
    min-height: 100vh;
    background: var(--bg-gradient-theme); 
}
.page-welcome, .page-data { padding: 60px 20px; }
.page-no-access, .page-no-data { padding: 40px 20px; justify-content: center; }

/* 合并相同样式的卡片 */
.no-access-card, .no-data-card, .low-data-card { 
    background: var(--td-bg-color-container); 
    border-radius: var(--td-radius-extraLarge); 
    max-width: 320px;
    width: 100%;
}
.no-access-card, .no-data-card { 
    padding: 48px var(--td-size-10); 
    box-shadow: var(--td-shadow-3); 
}
.low-data-card { 
    padding: 40px var(--td-size-10); 
    box-shadow: var(--td-shadow-2); 
}

/* ========== 第五层：深色背景文字 ========== */
.page-title { 
    font-size: 28px;
    font-weight: 600;
    color: var(--td-text-color-anti);
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    margin-bottom: var(--td-size-4);
}
.page-desc { 
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    margin-bottom: var(--td-size-10);
}
.page-tip {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
}
```

### 重构效果

| 指标 | 重构前 | 重构后 | 变化 |
|------|--------|--------|------|
| 代码行数 | 850 | 230 | -73% |
| 重复渐变定义 | 8处 | 1处 | -87.5% |
| 重复颜色值 | 24处 | 0处 | -100% |
| CSS变量数 | 0 | 22 | +22 |
| 选择器复用率 | 0% | 65% | +65% |

---

## 示例2：数据卡片组件重构

### 重构前

```css
.interview-count-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: #fff;
    text-align: center;
}

.interview-count-card .count {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 8px;
}

.interview-count-card .label {
    font-size: 14px;
    opacity: 0.85;
}

.pass-rate-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: #fff;
    text-align: center;
}

.pass-rate-card .count {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 8px;
}

.pass-rate-card .label {
    font-size: 14px;
    opacity: 0.85;
}

.duration-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: #fff;
    text-align: center;
}

.duration-card .count {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 8px;
}

.duration-card .label {
    font-size: 14px;
    opacity: 0.85;
}
```

### 重构后

```css
/* 数据卡片基类 */
.data-card {
    background: var(--theme-primary);
    border-radius: var(--td-radius-large);
    padding: var(--td-size-8);
    color: var(--td-text-color-anti);
    text-align: center;
}

.data-card .count {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: var(--td-size-4);
}

.data-card .label {
    font-size: 14px;
    opacity: 0.85;
}

/* 应用基类 */
.interview-count-card,
.pass-rate-card,
.duration-card {
    /* 继承 .data-card 样式，通过HTML添加类名 */
}
```

### HTML使用方式

```html
<!-- 重构前：每个卡片独立类名 -->
<div class="interview-count-card">
    <div class="count">128</div>
    <div class="label">面试场次</div>
</div>

<!-- 重构后：使用基类+语义类名 -->
<div class="data-card interview-count-card">
    <div class="count">128</div>
    <div class="label">面试场次</div>
</div>
```

---

## 示例3：按钮组件变体

### 重构前

```css
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
}

.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fff;
    color: #667eea;
    border: 1px solid #667eea;
}

.btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.5);
}
```

### 重构后

```css
/* 按钮基类 */
.btn-base {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: var(--td-radius-medium);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

/* 按钮变体 */
.btn-primary {
    background: var(--theme-primary);
    color: var(--td-text-color-anti);
}

.btn-secondary {
    background: var(--td-bg-color-container);
    color: var(--theme-primary-start);
    border: 1px solid var(--theme-primary-start);
}

.btn-ghost {
    background: transparent;
    color: var(--td-text-color-anti);
    border: 1px solid rgba(255,255,255,0.5);
}

/* 按钮尺寸变体 */
.btn-sm { padding: 8px 16px; font-size: 14px; }
.btn-lg { padding: 16px 32px; font-size: 18px; }
```

### HTML使用方式

```html
<!-- 组合使用基类和变体 -->
<button class="btn-base btn-primary">主要按钮</button>
<button class="btn-base btn-secondary">次要按钮</button>
<button class="btn-base btn-ghost">幽灵按钮</button>
<button class="btn-base btn-primary btn-lg">大号主要按钮</button>
```

---

## 示例4：深色背景文字可见性修复

### 问题代码

```css
/* 深色渐变背景 */
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 80px 20px;
}

/* 问题：深色背景上使用深色文字 */
.hero-title {
    font-size: 32px;
    font-weight: 700;
    color: #333;  /* ❌ 对比度严重不足 */
}

.hero-subtitle {
    font-size: 18px;
    color: #666;  /* ❌ 对比度不足 */
}

.hero-description {
    font-size: 14px;
    color: #999;  /* ❌ 几乎不可见 */
}
```

### 修复后代码

```css
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 80px 20px;
}

/* 修复：使用高对比度白色文字 */
.hero-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--td-text-color-anti);  /* ✅ #fff */
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);  /* ✅ 增强可读性 */
}

.hero-subtitle {
    font-size: 18px;
    color: rgba(255,255,255,0.9);  /* ✅ 高对比度 */
}

.hero-description {
    font-size: 14px;
    color: rgba(255,255,255,0.75);  /* ✅ 满足3:1对比度 */
}
```

### 对比度检查结果

| 元素 | 修复前对比度 | 修复后对比度 | 状态 |
|------|-------------|-------------|------|
| hero-title | 1.8:1 | 15.2:1 | ✅ 通过 |
| hero-subtitle | 2.1:1 | 12.8:1 | ✅ 通过 |
| hero-description | 1.4:1 | 8.5:1 | ✅ 通过 |

---

## 示例5：HTML语义化重构

### 重构前

```html
<div class="header">
  <div class="logo">公司名称</div>
  <div class="nav">
    <div class="nav-item" onclick="goTo('home')">首页</div>
    <div class="nav-item" onclick="goTo('about')">关于</div>
  </div>
</div>
<div class="content">
  <div class="title">文章标题</div>
  <div class="article">
    <div class="section-title">第一章</div>
    <div class="text">正文内容...</div>
    <div class="list">
      <div class="item">项目1</div>
      <div class="item">项目2</div>
    </div>
  </div>
</div>
<div class="footer">© 2024 公司名称</div>
```

### 重构后

```html
<header>
  <h1>公司名称</h1>
  <nav aria-label="主导航">
    <ul>
      <li><a href="/home">首页</a></li>
      <li><a href="/about">关于</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>文章标题</h1>
    <section>
      <h2>第一章</h2>
      <p>正文内容...</p>
      <ul>
        <li>项目1</li>
        <li>项目2</li>
      </ul>
    </section>
  </article>
</main>
<footer>
  <p>© 2024 公司名称</p>
</footer>
```

### 重构效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| 语义标签数 | 0 | 8 |
| 可访问性评分 | 45 | 92 |
| SEO友好度 | 低 | 高 |
| 键盘可操作 | 否 | 是 |

---

## 示例6：JavaScript模块化重构

### 重构前

```javascript
// 全局变量污染
var userData = null;
var orderList = [];
var API_URL = 'https://api.example.com';

// 过长函数 + 回调地狱
function loadUserData(userId, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', API_URL + '/users/' + userId);
    xhr.onload = function() {
        if (xhr.status === 200) {
            userData = JSON.parse(xhr.responseText);
            // 嵌套请求订单
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', API_URL + '/orders?userId=' + userId);
            xhr2.onload = function() {
                if (xhr2.status === 200) {
                    orderList = JSON.parse(xhr2.responseText);
                    // 计算总金额
                    var total = 0;
                    for (var i = 0; i < orderList.length; i++) {
                        total = total + orderList[i].amount;
                    }
                    callback(null, { user: userData, orders: orderList, total: total });
                } else {
                    callback('订单加载失败');
                }
            };
            xhr2.send();
        } else {
            callback('用户加载失败');
        }
    };
    xhr.send();
}
```

### 重构后

```javascript
// constants/api.js
export const API_URL = 'https://api.example.com';

// services/api.js
import { API_URL } from '../constants/api';

export async function fetchJSON(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

// services/user.js
import { fetchJSON } from './api';

export async function getUser(userId) {
    return fetchJSON(`/users/${userId}`);
}

export async function getUserOrders(userId) {
    return fetchJSON(`/orders?userId=${userId}`);
}

// utils/order.js
export function calculateTotal(orders) {
    return orders.reduce((sum, order) => sum + order.amount, 0);
}

// 使用
import { getUser, getUserOrders } from './services/user';
import { calculateTotal } from './utils/order';

async function loadUserData(userId) {
    try {
        const [user, orders] = await Promise.all([
            getUser(userId),
            getUserOrders(userId)
        ]);
        return { user, orders, total: calculateTotal(orders) };
    } catch (error) {
        console.error('加载失败:', error);
        throw error;
    }
}
```

### 重构效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| 全局变量 | 3 | 0 |
| 最大嵌套层级 | 5 | 2 |
| 代码复用率 | 0% | 80% |
| 可测试性 | 低 | 高 |

---

## 示例7：TypeScript类型安全重构

### 重构前

```typescript
// any 滥用
function processOrder(order: any): any {
    const items = order.items || [];
    let total = 0;
    for (const item of items) {
        total += item.price * item.quantity;
    }
    return {
        orderId: order.id,
        total: total,
        status: order.status
    };
}

// 类型断言滥用
function getUser(data: unknown) {
    const user = data as any;
    return user.name as string;
}

// 重复类型定义
interface OrderItem1 {
    id: number;
    name: string;
    price: number;
}

interface ProductItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}
```

### 重构后

```typescript
// types/order.ts
export interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    status: 'pending' | 'paid' | 'shipped' | 'completed';
    createdAt: Date;
}

export interface OrderSummary {
    orderId: string;
    total: number;
    status: Order['status'];
}

// types/product.ts - 复用基础类型
import type { OrderItem } from './order';

export interface Product extends Omit<OrderItem, 'quantity'> {
    stock: number;
    category: string;
}

// utils/order.ts
import type { Order, OrderSummary } from '../types/order';

export function processOrder(order: Order): OrderSummary {
    const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    return {
        orderId: order.id,
        total,
        status: order.status
    };
}

// 类型守卫替代断言
interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(data: unknown): data is User {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'name' in data &&
        'email' in data
    );
}

function getUser(data: unknown): string {
    if (!isUser(data)) {
        throw new Error('Invalid user data');
    }
    return data.name;
}
```

### 重构效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| any 类型数 | 4 | 0 |
| 类型断言数 | 2 | 0 |
| 重复类型定义 | 是 | 否 |
| 类型安全性 | 低 | 高 |

---

## 示例8：Vue 2.x 组件重构

### 重构前

```vue
<script>
// 巨型组件 + Mixin 滥用
import formMixin from '@/mixins/form'
import validationMixin from '@/mixins/validation'

export default {
  mixins: [formMixin, validationMixin],
  data() {
    return {
      // 用户信息
      userName: '',
      userEmail: '',
      userPhone: '',
      // 订单信息
      orderList: [],
      orderStatus: 'all',
      orderTotal: 0,
      // 表单状态
      loading: false,
      errors: {}
    }
  },
  methods: {
    async fetchUser() { /* 20行 */ },
    async updateUser() { /* 15行 */ },
    async fetchOrders() { /* 20行 */ },
    filterOrders() { /* 10行 */ },
    calculateTotal() { /* 10行 */ },
    validateForm() { /* 15行 */ },
    submitForm() { /* 20行 */ }
  }
}
</script>
```

### 重构后

```vue
<!-- UserProfile.vue - 父组件 -->
<template>
  <div class="user-profile">
    <UserInfo :user-id="userId" @update="handleUserUpdate" />
    <OrderList :user-id="userId" />
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  methods: {
    handleUserUpdate(user) {
      this.$emit('user-updated', user)
    }
  }
}
</script>
```

```vue
<!-- UserInfo.vue - 用户信息组件 -->
<script>
import { validateEmail, validatePhone } from '@/utils/validation'

export default {
  name: 'UserInfo',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: { name: '', email: '', phone: '' },
      loading: false,
      errors: {}
    }
  },
  computed: {
    isValid() {
      return !Object.keys(this.errors).length
    }
  },
  async created() {
    await this.fetchUser()
  },
  methods: {
    async fetchUser() {
      this.loading = true
      try {
        this.user = await this.$api.getUser(this.userId)
      } finally {
        this.loading = false
      }
    },
    validate() {
      this.errors = {}
      if (!validateEmail(this.user.email)) {
        this.errors.email = '邮箱格式不正确'
      }
      if (!validatePhone(this.user.phone)) {
        this.errors.phone = '手机号格式不正确'
      }
      return this.isValid
    },
    async handleSubmit() {
      if (!this.validate()) return
      this.$emit('update', this.user)
    }
  }
}
</script>
```

### 重构效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| 组件行数 | 150+ | 60 |
| Mixins 数量 | 2 | 0 |
| data 属性数 | 9 | 4 |
| 职责分离 | 否 | 是 |

---

## 示例9：Vue 3.x Composition API 重构

### 重构前（Options API）

```vue
<script>
export default {
  data() {
    return {
      count: 0,
      user: null,
      loading: false
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  watch: {
    count(newVal) {
      console.log('Count changed:', newVal)
    }
  },
  mounted() {
    this.fetchUser()
  },
  methods: {
    increment() {
      this.count++
    },
    async fetchUser() {
      this.loading = true
      try {
        this.user = await api.getUser()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

### 重构后（Composition API + Composables）

```typescript
// composables/useCounter.ts
import { ref, computed, watch } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  watch(count, (newVal) => {
    console.log('Count changed:', newVal)
  })

  return { count, doubleCount, increment }
}

// composables/useUser.ts
import { ref, onMounted } from 'vue'
import type { User } from '@/types'

export function useUser() {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function fetchUser() {
    loading.value = true
    try {
      user.value = await api.getUser()
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchUser)

  return { user, loading, refetch: fetchUser }
}
```

```vue
<!-- 组件使用 -->
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'
import { useUser } from '@/composables/useUser'

const { count, doubleCount, increment } = useCounter()
const { user, loading } = useUser()
</script>

<template>
  <div>
    <p>Count: {{ count }} (Double: {{ doubleCount }})</p>
    <button @click="increment">+1</button>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="user">{{ user.name }}</div>
  </div>
</template>
```

### 重构效果

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| 代码行数 | 40 | 25 (组件) |
| 逻辑复用性 | 0% | 100% |
| TypeScript 支持 | 弱 | 强 |
| 测试难度 | 高 | 低 |
