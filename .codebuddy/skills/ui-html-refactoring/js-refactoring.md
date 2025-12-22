# JavaScript重构与优化指南

优化JavaScript代码结构，提升可读性、可维护性和性能。

## 执行流程

```
现有JavaScript代码
      ↓
步骤1：代码分析 → 识别代码异味、重复逻辑、性能问题
      ↓
步骤2：模块化重构 → 拆分职责、提取公共函数、组织模块
      ↓
步骤3：代码规范化 → 命名规范、ES6+语法、错误处理
      ↓
步骤4：性能优化 → 事件优化、DOM操作优化、异步处理
```

## 步骤1：代码分析

### 1.1 代码异味识别

| 异味类型 | 识别特征 | 重构方向 |
|----------|----------|----------|
| 过长函数 | 函数超过50行 | 拆分为小函数 |
| 重复代码 | 相似逻辑出现3+次 | 提取公共函数 |
| 过深嵌套 | 超过3层嵌套 | 提前返回/拆分 |
| 魔法数字 | 硬编码数值 | 提取常量 |
| 全局变量 | 污染全局作用域 | 模块化封装 |
| 回调地狱 | 多层回调嵌套 | Promise/async |

### 1.2 诊断检查项

- [ ] 是否存在超过50行的函数
- [ ] 是否有重复的代码块
- [ ] 是否有超过3层的嵌套
- [ ] 是否使用了全局变量
- [ ] 是否有未处理的错误
- [ ] 是否有性能瓶颈（频繁DOM操作等）

## 步骤2：模块化重构

### 2.1 函数拆分

**重构前**：
```javascript
function processOrder(order) {
    // 验证订单 (20行)
    if (!order.items) { ... }
    if (!order.customer) { ... }
    // 计算价格 (30行)
    let total = 0;
    for (const item of order.items) { ... }
    // 应用折扣 (20行)
    if (order.coupon) { ... }
    // 生成订单号 (10行)
    const orderId = ...;
    // 保存订单 (15行)
    await db.save(...);
}
```

**重构后**：
```javascript
function processOrder(order) {
    validateOrder(order);
    const subtotal = calculateSubtotal(order.items);
    const total = applyDiscount(subtotal, order.coupon);
    const orderId = generateOrderId();
    return saveOrder({ ...order, orderId, total });
}

function validateOrder(order) { ... }
function calculateSubtotal(items) { ... }
function applyDiscount(amount, coupon) { ... }
function generateOrderId() { ... }
function saveOrder(order) { ... }
```

### 2.2 提取公共函数

**重构前**：
```javascript
// 文件A
const userFullName = user.firstName + ' ' + user.lastName;
const userInitials = user.firstName[0] + user.lastName[0];

// 文件B
const authorName = author.firstName + ' ' + author.lastName;
const authorInitials = author.firstName[0] + author.lastName[0];
```

**重构后**：
```javascript
// utils/name.js
export function getFullName(person) {
    return `${person.firstName} ${person.lastName}`;
}

export function getInitials(person) {
    return `${person.firstName[0]}${person.lastName[0]}`;
}

// 使用
import { getFullName, getInitials } from './utils/name';
const userFullName = getFullName(user);
```

### 2.3 模块组织结构

```
src/
├── utils/           # 通用工具函数
│   ├── format.js    # 格式化工具
│   ├── validate.js  # 验证工具
│   └── dom.js       # DOM操作工具
├── services/        # 业务服务
│   ├── api.js       # API调用
│   └── storage.js   # 存储服务
├── components/      # UI组件逻辑
└── constants/       # 常量定义
    └── config.js
```

## 步骤3：代码规范化

### 3.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserInfo`, `isValid` |
| 常量 | UPPER_SNAKE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 类/构造函数 | PascalCase | `UserService`, `EventEmitter` |
| 私有属性 | _前缀或#前缀 | `_cache`, `#privateField` |
| 布尔值 | is/has/can前缀 | `isActive`, `hasPermission` |
| 事件处理 | handle/on前缀 | `handleClick`, `onSubmit` |

### 3.2 ES6+语法升级

**解构赋值**：
```javascript
// 重构前
const name = user.name;
const age = user.age;
const city = user.address.city;

// 重构后
const { name, age, address: { city } } = user;
```

**模板字符串**：
```javascript
// 重构前
const msg = 'Hello, ' + name + '! You have ' + count + ' messages.';

// 重构后
const msg = `Hello, ${name}! You have ${count} messages.`;
```

**箭头函数**：
```javascript
// 重构前
const doubled = numbers.map(function(n) { return n * 2; });

// 重构后
const doubled = numbers.map(n => n * 2);
```

**展开运算符**：
```javascript
// 重构前
const merged = Object.assign({}, defaults, options);
const combined = arr1.concat(arr2);

// 重构后
const merged = { ...defaults, ...options };
const combined = [...arr1, ...arr2];
```

**可选链和空值合并**：
```javascript
// 重构前
const city = user && user.address && user.address.city;
const name = user.name !== null && user.name !== undefined ? user.name : 'Anonymous';

// 重构后
const city = user?.address?.city;
const name = user.name ?? 'Anonymous';
```

### 3.3 错误处理

**同步代码**：
```javascript
function parseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error('JSON解析失败:', error.message);
        return null;
    }
}
```

**异步代码**：
```javascript
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('获取用户失败:', error);
        throw error; // 或返回默认值
    }
}
```

**全局错误处理**：
```javascript
// 未捕获的Promise错误
window.addEventListener('unhandledrejection', event => {
    console.error('未处理的Promise错误:', event.reason);
});

// 全局错误
window.addEventListener('error', event => {
    console.error('全局错误:', event.error);
});
```

### 3.4 减少嵌套

**提前返回**：
```javascript
// 重构前
function getDiscount(user) {
    if (user) {
        if (user.isVIP) {
            if (user.years > 5) {
                return 0.3;
            } else {
                return 0.2;
            }
        } else {
            return 0.1;
        }
    } else {
        return 0;
    }
}

// 重构后
function getDiscount(user) {
    if (!user) return 0;
    if (!user.isVIP) return 0.1;
    if (user.years > 5) return 0.3;
    return 0.2;
}
```

## 步骤4：性能优化

### 4.1 事件优化

**事件委托**：
```javascript
// 重构前：每个元素绑定事件
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', handleClick);
});

// 重构后：事件委托
document.querySelector('.list').addEventListener('click', event => {
    if (event.target.matches('.item')) {
        handleClick(event);
    }
});
```

**防抖节流**：
```javascript
// 防抖：延迟执行，适合搜索输入
function debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// 节流：固定频率执行，适合滚动事件
function throttle(fn, interval = 100) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

// 使用
input.addEventListener('input', debounce(handleSearch, 300));
window.addEventListener('scroll', throttle(handleScroll, 100));
```

### 4.2 DOM操作优化

**批量DOM更新**：
```javascript
// 重构前：多次重排
items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li); // 每次都触发重排
});

// 重构后：使用DocumentFragment
const fragment = document.createDocumentFragment();
items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    fragment.appendChild(li);
});
list.appendChild(fragment); // 只触发一次重排
```

**减少强制同步布局**：
```javascript
// 重构前：读写交替触发多次重排
elements.forEach(el => {
    const height = el.offsetHeight; // 读
    el.style.height = height + 10 + 'px'; // 写
});

// 重构后：先读后写
const heights = elements.map(el => el.offsetHeight); // 批量读
elements.forEach((el, i) => {
    el.style.height = heights[i] + 10 + 'px'; // 批量写
});
```

### 4.3 异步处理

**Promise.all 并行请求**：
```javascript
// 重构前：串行请求
const user = await fetchUser(id);
const orders = await fetchOrders(id);
const reviews = await fetchReviews(id);

// 重构后：并行请求
const [user, orders, reviews] = await Promise.all([
    fetchUser(id),
    fetchOrders(id),
    fetchReviews(id)
]);
```

**懒加载**：
```javascript
// 动态导入
const module = await import('./heavy-module.js');

// 图片懒加载
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
});
```

## 验证清单

### 代码质量
- [ ] 函数长度不超过50行
- [ ] 嵌套层级不超过3层
- [ ] 无重复代码块
- [ ] 无魔法数字（已提取为常量）
- [ ] 无全局变量污染

### 规范遵循
- [ ] 命名符合规范
- [ ] 使用ES6+语法
- [ ] 有适当的错误处理
- [ ] 代码有必要的注释

### 性能优化
- [ ] 使用事件委托
- [ ] 高频事件有防抖/节流
- [ ] DOM操作已批量化
- [ ] 异步请求已并行化

## 常见反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| `eval()` | 安全风险 | 避免使用 |
| `with` | 作用域混乱 | 避免使用 |
| `==` | 类型转换 | 使用 `===` |
| `var` | 作用域问题 | 使用 `let`/`const` |
| 回调地狱 | 可读性差 | 使用 async/await |
| 同步XHR | 阻塞主线程 | 使用异步请求 |
