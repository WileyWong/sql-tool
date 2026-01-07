# Vue 2 代码审查检查清单

Vue 2 Options API 代码审查检查清单，确保审查质量和一致性。

## ⚠️ Vue 2 EOL 提醒

Vue 2 已于 2023 年 12 月 31 日停止维护。审查时需额外关注：
- 是否有迁移到 Vue 3 的计划
- 是否使用了 Vue 3 已移除的特性（如 `filters`）
- 安全漏洞是否及时修复

---

## 🟢 基础审查 (15-30min)

### 代码规范
- [ ] ESLint 检查通过
- [ ] 组件使用多词命名（如 `UserProfile`）
- [ ] 组件有明确的 `name` 属性
- [ ] Options 顺序符合规范

### 组件大小
- [ ] 组件代码 < 300 行
- [ ] 模板代码 < 100 行
- [ ] Props 数量 ≤ 10 个
- [ ] data 属性 ≤ 10 个
- [ ] methods 方法 ≤ 10 个

### Props 定义
- [ ] Props 有类型定义
- [ ] 必填 Props 标记 `required: true`
- [ ] 对象/数组 Props 使用工厂函数默认值
- [ ] 复杂 Props 有 validator

---

## 🟡 标准审查 (45-60min)

**包含基础审查 +**

### 响应式系统
- [ ] data 是函数而非对象
- [ ] 新增对象属性使用 `$set`
- [ ] 数组操作使用响应式方法
- [ ] 派生状态使用 `computed`
- [ ] 无在模板中调用方法获取派生值

### Vue.nextTick 使用
- [ ] DOM 操作在 `$nextTick` 回调中执行
- [ ] 避免嵌套 `$nextTick`
- [ ] 异步更新后正确等待 DOM

### Mixins 检查
- [ ] 无命名冲突（data/methods/computed）
- [ ] 无隐式依赖组件属性
- [ ] 无嵌套 mixin 引用
- [ ] 考虑迁移为工具函数

### Event Bus 检查 ⚠️ 高频问题
- [ ] `$on` 注册的事件在 `beforeDestroy` 中 `$off`
- [ ] 事件名使用常量避免拼写错误
- [ ] 避免过度使用 Event Bus（推荐 Vuex）
- [ ] 无全局 Event Bus 滥用

### 组件通信
- [ ] 无直接修改 Props
- [ ] 事件命名使用 kebab-case
- [ ] 复杂数据使用 `.sync` 修饰符
- [ ] 跨层级通信使用 provide/inject

### 性能优化
- [ ] v-for 有唯一 key
- [ ] v-if 和 v-for 不同时使用
- [ ] 大组件使用异步加载
- [ ] 合理使用 keep-alive

### 安全性
- [ ] 无直接使用 `v-html`（或已使用 DOMPurify）
- [ ] 用户输入有验证
- [ ] 无控制台打印敏感信息
- [ ] 动态组件使用白名单验证

### 可访问性与测试属性 ⭐ 新增
- [ ] 交互元素有 `data-testid` 属性
- [ ] 表单输入有 `data-testid` 属性
- [ ] 图片有描述性 `alt` 属性
- [ ] 表单控件有关联 `<label>`
- [ ] 焦点状态清晰可见
- [ ] 可键盘操作（Tab/Enter/Escape）

---

## 🔴 专业审查 (2-3h)

**包含标准审查 +**

### 组件设计
- [ ] 组件职责单一
- [ ] 组件通信清晰（props down, events up）
- [ ] 复杂逻辑提取到工具函数
- [ ] 无过深的组件嵌套

### watch 使用
- [ ] 优先使用精确路径监听
- [ ] 深度监听有明确理由
- [ ] 需要立即执行时使用 `immediate: true`
- [ ] 无用 watch 代替 computed

### 生命周期
- [ ] mounted 中的事件监听在 beforeDestroy 清理
- [ ] 定时器在 beforeDestroy 清除
- [ ] Event Bus 事件在 beforeDestroy 清理
- [ ] 异步请求有取消机制
- [ ] keep-alive 组件使用 activated/deactivated
- [ ] 了解父子组件生命周期顺序

### 错误处理
- [ ] 有全局错误处理 `Vue.config.errorHandler`
- [ ] 关键组件有 `errorCaptured` 钩子
- [ ] API 请求有错误处理

### 性能深度检查
- [ ] 大型静态数据使用 `Object.freeze`
- [ ] 非响应式数据不放 data
- [ ] 无不必要的深度监听
- [ ] 图片懒加载
- [ ] 高频事件使用节流/防抖

### 安全深度检查
- [ ] 无原型污染风险（Object.assign 用户输入）
- [ ] 无动态模板编译用户输入
- [ ] 动态组件使用白名单
- [ ] 无 `javascript:` 协议 URL
- [ ] 第三方库无已知漏洞（npm audit）

---

## 常见问题检查

### 响应式问题
- [ ] 没有直接给对象添加新属性
- [ ] 没有通过索引直接修改数组
- [ ] 没有直接修改数组长度
- [ ] 没有将 data 定义为对象

### Mixins 问题
- [ ] 没有多个 mixin 同名属性
- [ ] 没有 mixin 依赖组件特定属性
- [ ] 没有过度使用 mixin

### Event Bus 问题 ⚠️
- [ ] 没有 `$on` 未配对 `$off`
- [ ] 没有组件销毁后仍触发事件
- [ ] 没有事件名拼写错误

### nextTick 问题
- [ ] 没有忘记在 DOM 操作前调用 `$nextTick`
- [ ] 没有嵌套 `$nextTick`

### 性能问题
- [ ] 没有在模板中调用方法（应使用 computed）
- [ ] 没有 v-for 缺少 key
- [ ] 没有 v-if 和 v-for 同时使用
- [ ] 没有未清理的定时器/事件监听

### 安全问题
- [ ] 没有 XSS 漏洞（v-html 未过滤）
- [ ] 没有敏感信息暴露
- [ ] 没有未验证的用户输入
- [ ] 没有原型污染风险
- [ ] 没有动态模板注入

---

## 检查工具

```bash
# ESLint 检查
npm run lint

# 组件大小检查
node tools/check-component-size.js

# 测试覆盖率
npm run test:coverage

# Event Bus 使用检查
grep -r "\$on(" src/ --include="*.vue" -l | xargs grep -L "\$off("

# 安全漏洞检查
npm audit

# 危险模式检查
grep -rn "v-html" src/ --include="*.vue"
grep -rn "Vue.compile" src/ --include="*.js"
```

---

## 评分计算

| 维度 | 权重 | 得分 |
|------|------|------|
| 组件设计 | 20% | /100 |
| Options API | 20% | /100 |
| Mixins | 15% | /100 |
| 性能优化 | 20% | /100 |
| 安全性 | 15% | /100 |
| 可维护性 | 10% | /100 |
| **综合得分** | | **/100** |

> 💡 **说明**: Event Bus 检查归入可维护性维度（事件清理、内存泄漏防护）

**等级**: A级(≥85) / B级(70-84) / C级(60-69) / D级(<60)
