# Vue 3 可访问性与测试属性审查清单

Vue 3 项目的可访问性（A11y）、ARIA 规范和 `data-testid` 测试属性审查指南。

## 概述

本清单确保 Vue 3 组件符合 WCAG 2.1 AA 标准，并具备完善的自动化测试支持。

---

## 1. data-testid 规范

### 1.1 命名规范

| 元素类型 | 命名格式 | 示例 |
|----------|----------|------|
| 页面容器 | `page-{pageName}` | `data-testid="page-login"` |
| 表单 | `form-{formName}` | `data-testid="form-register"` |
| 输入框 | `input-{fieldName}` | `data-testid="input-email"` |
| 按钮 | `btn-{action}` | `data-testid="btn-submit"` |
| 链接 | `link-{target}` | `data-testid="link-home"` |
| 列表项 | `item-{listName}-{id}` | `data-testid="item-user-123"` |
| 表格行 | `row-{tableName}-{id}` | `data-testid="row-orders-456"` |
| 模态框 | `modal-{modalName}` | `data-testid="modal-confirm"` |
| 选项卡 | `tab-{tabName}` | `data-testid="tab-settings"` |
| 状态文本 | `text-{description}` | `data-testid="text-error"` |
| 徽章 | `badge-{type}` | `data-testid="badge-count"` |

### 1.2 必须添加 data-testid 的元素

#### 交互元素（必须 ⭐）
- [ ] 所有提交/确认按钮
- [ ] 所有取消/关闭按钮
- [ ] 所有删除/危险操作按钮
- [ ] 所有导航链接
- [ ] 分页控件（上一页、下一页、页码）
- [ ] 排序/筛选控件
- [ ] 搜索按钮

#### 表单元素（必须 ⭐）
- [ ] 所有文本输入框
- [ ] 所有下拉选择框
- [ ] 所有复选框/单选框
- [ ] 所有开关控件
- [ ] 日期/时间选择器
- [ ] 文件上传控件
- [ ] 表单容器

#### 数据展示（必须 ⭐）
- [ ] 表格行（使用唯一 ID）
- [ ] 列表项（使用唯一 ID 或索引）
- [ ] 状态显示文本
- [ ] 计数/统计数字
- [ ] 错误/成功提示

#### 容器元素（推荐）
- [ ] 页面主容器
- [ ] 模态框/对话框容器
- [ ] 抽屉容器
- [ ] 选项卡面板

### 1.3 Vue 3 组件示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  // 登录逻辑
}
</script>

<template>
  <form data-testid="form-login" @submit.prevent="handleLogin">
    <div class="form-group">
      <label for="username">用户名</label>
      <input 
        id="username"
        v-model="username"
        type="text"
        data-testid="input-username"
        aria-required="true"
      >
    </div>
    
    <div class="form-group">
      <label for="password">密码</label>
      <input 
        id="password"
        v-model="password"
        type="password"
        data-testid="input-password"
        aria-required="true"
      >
    </div>
    
    <button type="submit" data-testid="btn-login">登录</button>
    
    <p 
      v-if="errorMessage" 
      data-testid="text-error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>
  </form>
</template>
```

### 1.4 动态列表示例

```vue
<template>
  <table data-testid="table-users" role="grid">
    <tbody>
      <tr 
        v-for="user in users" 
        :key="user.id"
        :data-testid="`row-user-${user.id}`"
      >
        <td :data-testid="`cell-name-${user.id}`">{{ user.name }}</td>
        <td>
          <button :data-testid="`btn-edit-${user.id}`">编辑</button>
          <button :data-testid="`btn-delete-${user.id}`">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <nav data-testid="pagination-users" aria-label="分页">
    <button data-testid="btn-prev-page" :disabled="page === 1">上一页</button>
    <span data-testid="text-page-info">第 {{ page }} 页</span>
    <button data-testid="btn-next-page" :disabled="page === totalPages">下一页</button>
  </nav>
</template>
```

---

## 2. ARIA 规范检查

### 2.1 必须检查项

| 组件类型 | 必需 ARIA 属性 | 检查项 |
|----------|----------------|--------|
| 自定义按钮 | `role="button"`, `tabindex="0"` | - [ ] 可键盘激活 |
| 展开/收起 | `aria-expanded` | - [ ] 状态同步更新 |
| 加载状态 | `aria-busy="true"` | - [ ] 加载完成后移除 |
| 模态框 | `role="dialog"`, `aria-modal="true"` | - [ ] 焦点陷阱正确 |
| 错误提示 | `role="alert"`, `aria-live="assertive"` | - [ ] 屏幕阅读器可读 |
| 状态更新 | `aria-live="polite"` | - [ ] 动态内容通知 |
| 必填字段 | `aria-required="true"` | - [ ] 表单验证关联 |
| 无效输入 | `aria-invalid="true"` | - [ ] 错误状态标识 |
| 描述关联 | `aria-describedby` | - [ ] 帮助文本关联 |

### 2.2 常见组件 ARIA 模式

#### 下拉菜单
```vue
<template>
  <div class="dropdown">
    <button 
      data-testid="btn-dropdown"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      选择选项
    </button>
    <ul 
      v-show="isOpen"
      role="menu"
      data-testid="menu-dropdown"
    >
      <li 
        v-for="option in options"
        :key="option.value"
        role="menuitem"
        :data-testid="`item-option-${option.value}`"
        @click="select(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
```

#### 选项卡
```vue
<template>
  <div class="tabs">
    <div role="tablist" aria-label="内容选项卡">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :data-testid="`tab-${tab.key}`"
        :aria-selected="activeTab === tab.key"
        :aria-controls="`panel-${tab.key}`"
        :tabindex="activeTab === tab.key ? 0 : -1"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div
      v-for="tab in tabs"
      :key="tab.key"
      v-show="activeTab === tab.key"
      :id="`panel-${tab.key}`"
      :data-testid="`panel-${tab.key}`"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.key}`"
    >
      <slot :name="tab.key" />
    </div>
  </div>
</template>
```

#### 模态框
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()

// 焦点管理
onMounted(() => {
  if (props.show) {
    previousFocus.value = document.activeElement as HTMLElement
    modalRef.value?.focus()
  }
})

onUnmounted(() => {
  previousFocus.value?.focus()
})

// 键盘处理
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="modalRef"
      data-testid="modal-container"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'modal-title'"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div class="modal-backdrop" @click="emit('close')" />
      <div class="modal-content">
        <h2 id="modal-title" data-testid="text-modal-title">{{ title }}</h2>
        <slot />
        <button 
          data-testid="btn-close-modal"
          aria-label="关闭对话框"
          @click="emit('close')"
        >
          ×
        </button>
      </div>
    </div>
  </Teleport>
</template>
```

#### 加载状态
```vue
<template>
  <div 
    :aria-busy="isLoading"
    aria-live="polite"
  >
    <div v-if="isLoading" data-testid="loading-spinner">
      <span class="sr-only">正在加载...</span>
      <Spinner />
    </div>
    <div v-else data-testid="content-loaded">
      <slot />
    </div>
  </div>
</template>
```

### 2.3 ARIA 属性速查表

| 属性 | 用途 | 值 |
|------|------|-----|
| `role` | 定义元素角色 | `button`, `dialog`, `alert`, `tab`, `tabpanel`, `menu`, `menuitem`, `progressbar` |
| `aria-label` | 提供可访问名称 | 描述性文本 |
| `aria-labelledby` | 引用标签元素 | 元素 ID |
| `aria-describedby` | 引用描述元素 | 元素 ID |
| `aria-expanded` | 展开状态 | `true` / `false` |
| `aria-selected` | 选中状态 | `true` / `false` |
| `aria-checked` | 勾选状态 | `true` / `false` / `mixed` |
| `aria-disabled` | 禁用状态 | `true` / `false` |
| `aria-hidden` | 隐藏于辅助技术 | `true` / `false` |
| `aria-live` | 动态区域 | `polite` / `assertive` / `off` |
| `aria-atomic` | 整体更新 | `true` / `false` |
| `aria-busy` | 加载状态 | `true` / `false` |
| `aria-invalid` | 验证状态 | `true` / `false` / `grammar` / `spelling` |
| `aria-required` | 必填状态 | `true` / `false` |
| `aria-modal` | 模态状态 | `true` / `false` |
| `aria-haspopup` | 有弹出内容 | `true` / `menu` / `listbox` / `tree` / `grid` / `dialog` |
| `aria-controls` | 控制的元素 | 元素 ID |
| `aria-owns` | 拥有的元素 | 元素 ID |

---

## 3. 可访问性检查清单

### 3.1 基础级别（所有审查必须）

#### 图片可访问性
- [ ] 信息性图片有描述性 `alt` 属性
- [ ] 装饰性图片使用空 `alt=""`
- [ ] 复杂图片有 `figcaption` 或 `aria-describedby`
- [ ] 图标按钮有 `aria-label`

#### 表单可访问性
- [ ] 所有输入有关联的 `<label>`
- [ ] 必填字段有 `aria-required="true"`
- [ ] 错误字段有 `aria-invalid="true"`
- [ ] 错误消息有 `aria-describedby` 关联
- [ ] 表单有清晰的提交反馈

#### 颜色与对比度
- [ ] 文本对比度 ≥ 4.5:1（正文）
- [ ] 大文本对比度 ≥ 3:1（18px+ 或 14px 粗体）
- [ ] 不仅依赖颜色传达信息
- [ ] 链接有下划线或其他视觉区分

#### 键盘可访问性
- [ ] 所有交互元素可 Tab 键访问
- [ ] 焦点顺序符合视觉顺序
- [ ] 自定义控件可键盘操作
- [ ] 无键盘陷阱

### 3.2 标准级别

#### 焦点管理
- [ ] 焦点状态清晰可见（`:focus-visible`）
- [ ] 模态框打开时焦点移入
- [ ] 模态框关闭时焦点恢复
- [ ] 模态框有焦点陷阱

#### 语义结构
- [ ] 页面有且仅有一个 `<h1>`
- [ ] 标题层级正确递进（不跳级）
- [ ] 使用语义化 HTML 标签
- [ ] 页面有跳过导航链接

#### 动态内容
- [ ] 动态更新有 `aria-live` 通知
- [ ] 加载状态有 `aria-busy` 标识
- [ ] 错误消息使用 `role="alert"`
- [ ] 成功消息有适当通知

### 3.3 专业级别

#### 屏幕阅读器测试
- [ ] NVDA/VoiceOver 测试通过
- [ ] 所有交互可通过语音操作
- [ ] 表格有正确的行列标题
- [ ] 复杂组件有完整 ARIA 支持

#### 性能与兼容
- [ ] Lighthouse 可访问性评分 ≥ 90
- [ ] axe-core 无严重违规
- [ ] 支持 200% 缩放
- [ ] 支持高对比度模式

#### 国际化
- [ ] 页面有 `lang` 属性
- [ ] 文本方向正确（`dir` 属性）
- [ ] 日期/时间格式本地化
- [ ] 货币格式本地化

---

## 4. Vue 3 特定检查

### 4.1 Composable 可访问性

```typescript
// useAccessibleModal.ts
import { ref, onMounted, onUnmounted, watch } from 'vue'

export function useAccessibleModal(isOpen: Ref<boolean>) {
  const previousFocus = ref<HTMLElement | null>(null)
  const modalRef = ref<HTMLElement | null>(null)
  
  // 保存并恢复焦点
  watch(isOpen, (open) => {
    if (open) {
      previousFocus.value = document.activeElement as HTMLElement
      nextTick(() => {
        modalRef.value?.focus()
      })
    } else {
      previousFocus.value?.focus()
    }
  })
  
  // 焦点陷阱
  const trapFocus = (e: KeyboardEvent) => {
    if (!isOpen.value || e.key !== 'Tab') return
    
    const focusables = modalRef.value?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusables?.length) return
    
    const first = focusables[0] as HTMLElement
    const last = focusables[focusables.length - 1] as HTMLElement
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
  
  // Escape 关闭
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      isOpen.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', trapFocus)
    document.addEventListener('keydown', handleEscape)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', trapFocus)
    document.removeEventListener('keydown', handleEscape)
  })
  
  return { modalRef }
}
```

### 4.2 组件 Props 类型

```typescript
// 可访问性相关 Props 类型
interface AccessibleButtonProps {
  /** 按钮文本（无文本时必须提供 ariaLabel） */
  label?: string
  /** 无可见文本时的可访问名称 */
  ariaLabel?: string
  /** 按钮描述 */
  ariaDescribedby?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 测试标识 */
  testId: string
}

interface AccessibleInputProps {
  /** 输入框 ID（用于 label 关联） */
  id: string
  /** 标签文本 */
  label: string
  /** 是否必填 */
  required?: boolean
  /** 是否无效 */
  invalid?: boolean
  /** 错误消息 ID */
  errorId?: string
  /** 帮助文本 ID */
  helpId?: string
  /** 测试标识 */
  testId: string
}
```

### 4.3 检查工具集成

```typescript
// vitest 可访问性测试
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import MyComponent from './MyComponent.vue'

expect.extend(toHaveNoViolations)

describe('MyComponent 可访问性', () => {
  it('应无可访问性违规', async () => {
    const wrapper = mount(MyComponent)
    const results = await axe(wrapper.element)
    expect(results).toHaveNoViolations()
  })
  
  it('应有正确的 data-testid', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.find('[data-testid="btn-submit"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true)
  })
  
  it('表单应有正确的 ARIA 属性', () => {
    const wrapper = mount(MyComponent)
    const input = wrapper.find('[data-testid="input-email"]')
    expect(input.attributes('aria-required')).toBe('true')
  })
})
```

---

## 5. 审查评分

### 5.1 评分维度

| 维度 | 权重 | 检查项数 |
|------|------|----------|
| data-testid 覆盖 | 30% | 交互元素、表单、数据展示 |
| ARIA 规范 | 30% | 角色、状态、属性 |
| 基础可访问性 | 25% | 图片、表单、颜色、键盘 |
| 高级可访问性 | 15% | 焦点管理、动态内容、测试 |

### 5.2 评分标准

| 等级 | 分数 | 说明 |
|------|------|------|
| A级 | ≥ 90 | 优秀，符合 WCAG 2.1 AA |
| B级 | 75-89 | 良好，少量问题 |
| C级 | 60-74 | 及格，需要改进 |
| D级 | < 60 | 不及格，严重问题 |

### 5.3 常见扣分项

| 问题 | 扣分 | 优先级 |
|------|------|--------|
| 交互按钮无 data-testid | -5/个 | P0 |
| 表单输入无 data-testid | -5/个 | P0 |
| 图片无 alt 属性 | -3/个 | P0 |
| 表单无 label 关联 | -5/个 | P0 |
| 对比度不足 | -10 | P1 |
| 无键盘支持 | -15 | P0 |
| 模态框无焦点管理 | -10 | P1 |
| 动态内容无 aria-live | -5 | P2 |
| 自定义组件无 ARIA | -5/个 | P1 |

---

## 版本历史

- **v1.0.0** (2026-01-04): 初始版本
  - data-testid 命名规范
  - ARIA 规范检查清单
  - Vue 3 特定检查项
  - Composable 可访问性模式
  - 评分标准

---

**作者**: spec-code Team
