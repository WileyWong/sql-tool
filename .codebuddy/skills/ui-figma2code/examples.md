# Figma 设计稿转代码 - 使用示例

## 示例 1: 统计卡片组件（原子能力模式）

### 场景描述
在现有 Vue3 + TDesign 项目中添加统计卡片组件。

### 用户输入
```
我需要在现有项目中添加一个统计卡片组件，用来展示用户数、订单数等关键指标。
设计稿要求：
- 左侧显示图标
- 中间显示数值和标签
- 右侧显示趋势（上升绿色、下降红色）
- 支持悬浮效果
```

### 执行流程
1. **模式检测**: 发现 package.json，自动使用原子能力模式
2. **设计稿分析**: 提取卡片组件设计规范
3. **组件生成**: 创建 StatCard.vue 组件
4. **样式适配**: 使用现有项目的样式变量

### 输出结果
生成文件：`src/components/business/StatCard.vue`

使用示例：
```vue
<template>
  <StatCard
    icon="user"
    :value="12345"
    label="总用户数"
    :trend="12.5"
    trend-text="+12.5%"
    :formatter="(value) => value.toLocaleString()"
    @click="handleStatClick"
  />
</template>
```

---

## 示例 2: 管理后台首页（完整项目模式）

### 场景描述
从零开始创建管理后台首页项目。

### 用户输入
```
我需要创建一个管理后台首页项目，包含：
1. 左侧导航菜单（可收起）
2. 顶部用户信息栏
3. 统计卡片区域（用户数、订单数、收入、转化率）
4. 图表展示区域（趋势图和饼图）
5. 数据表格区域（最近活动记录）

技术栈：Vue3 + TDesign
```

### 执行流程
1. **模式选择**: 完整项目模式
2. **设计稿分析**: 识别 Layout、StatCard、Chart、Table 组件
3. **项目创建**: 生成 Vue3+Vite+TDesign 项目结构
4. **样式系统**: 创建主题变量文件
5. **组件开发**: 布局组件、业务组件、页面组件
6. **质量保证**: ESLint 检查、类型验证

### 输出结果
生成项目结构：
```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── business/
│   ├── views/
│   ├── assets/styles/
│   └── main.ts
├── package.json
├── vite.config.ts
└── README.md
```

项目特性：
- ✅ 完整的 Vue3 + TDesign 项目
- ✅ 响应式布局设计
- ✅ 组件化开发模式
- ✅ 完整的开发工具链

---

## 示例 3: 响应式商品卡片

### 场景描述
创建支持桌面端和移动端不同布局的商品卡片组件。

### 用户输入
```
我需要一个商品卡片组件，要求：
1. 支持桌面端和移动端不同布局
2. 包含商品图片、标题、价格、标签
3. 有收藏和购买按钮
4. 支持促销标签显示
```

### 响应式特性
- ✅ 桌面端：横向布局（图片左侧，信息右侧）
- ✅ 移动端：纵向布局（图片上方，信息下方）
- ✅ 按钮在移动端变为纵向排列
- ✅ 图片和文字尺寸自适应

---

**版本**: 3.1.0  
**最后更新**: 2025-11-10

### 🔄 执行流程

#### 步骤 1: 模式检测
```bash
检测到当前目录存在 package.json
自动选择：原子能力模式
技术栈确认：Vue3 + TDesign + Vite + TypeScript
```

#### 步骤 2: 设计稿分析
```yaml
组件分析:
  名称: StatCard
  类型: 业务组件
  
设计规范:
  颜色系统:
    - 主色: #0052d9
    - 成功色: #00a870  
    - 错误色: #d54941
    - 文本色: #000000, #666666
  
  字体系统:
    - 数值: 20px/700
    - 标签: 14px/400
    - 趋势: 14px/500
  
  间距系统:
    - 内边距: 24px
    - 元素间距: 16px
    - 图标大小: 32px

TDesign 组件映射:
  - 卡片容器: t-card
  - 图标: t-icon
  - 布局: flex 布局
```

#### 步骤 3: 项目结构分析
```bash
现有项目结构:
src/
├── components/
│   ├── common/
│   └── business/     # 目标目录
├── assets/styles/
└── views/

确认组件路径: src/components/business/StatCard.vue
```

#### 步骤 4: 组件代码生成

**生成的组件文件**:

```vue
<!-- src/components/business/StatCard.vue -->
<template>
  <t-card 
    class="stat-card" 
    hover
    @click="handleClick"
  >
    <div class="stat-card__content">
      <div class="stat-card__icon">
        <t-icon :name="icon" size="32px" />
      </div>
      <div class="stat-card__info">
        <div class="stat-card__value">{{ formattedValue }}</div>
        <div class="stat-card__label">{{ label }}</div>
      </div>
      <div 
        class="stat-card__trend" 
        :class="trendClass"
        v-if="showTrend && trend !== 0"
      >
        <t-icon :name="trendIcon" size="16px" />
        <span>{{ trendText }}</span>
      </div>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
interface Props {
  /** 图标名称 */
  icon: 'user' | 'chart' | 'money' | 'order'
  /** 显示数值 */
  value: string | number
  /** 标签文本 */
  label: string
  /** 趋势数值 */
  trend?: number
  /** 趋势文本 */
  trendText?: string
  /** 是否显示趋势 */
  showTrend?: boolean
  /** 数值格式化函数 */
  formatter?: (value: string | number) => string
}

const props = withDefaults(defineProps<Props>(), {
  trend: 0,
  trendText: '',
  showTrend: true,
  formatter: (value) => String(value)
})

// 事件定义
const emit = defineEmits<{
  /** 卡片点击事件 */
  click: [event: MouseEvent]
}>()

// 计算属性
const formattedValue = computed(() => {
  return props.formatter(props.value)
})

const trendClass = computed(() => ({
  'stat-card__trend--up': props.trend > 0,
  'stat-card__trend--down': props.trend < 0
}))

const trendIcon = computed(() => {
  if (props.trend > 0) return 'arrow-up'
  if (props.trend < 0) return 'arrow-down'
  return 'minus'
})

// 事件处理
const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="less" scoped>
.stat-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    background-color: #f5f7fa;
    color: #0052d9;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__value {
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__label {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    flex-shrink: 0;

    &--up {
      color: #00a870;
    }

    &--down {
      color: #d54941;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .stat-card {
    &__content {
      padding: 16px;
      gap: 12px;
    }

    &__icon {
      width: 48px;
      height: 48px;
    }

    &__value {
      font-size: 18px;
    }
  }
}
</style>
```

### 📤 输出结果

**生成的文件**:
- ✅ `src/components/business/StatCard.vue` - 统计卡片组件

**使用示例**:
```vue
<template>
  <div class="dashboard">
    <StatCard
      icon="user"
      :value="12345"
      label="总用户数"
      :trend="12.5"
      trend-text="+12.5%"
      :formatter="(value) => value.toLocaleString()"
      @click="handleStatClick"
    />
  </div>
</template>

<script setup>
import StatCard from '@/components/business/StatCard.vue'

const handleStatClick = (event) => {
  console.log('统计卡片被点击')
}
</script>
```

### ✅ 验证结果

- ✅ 组件正常渲染，样式还原度 98%
- ✅ TypeScript 类型检查通过
- ✅ 响应式布局工作正常
- ✅ 交互效果符合设计要求
- ✅ ESLint 检查无警告

---

## 示例 2: 管理后台首页（完整项目模式）

### 📝 场景描述

从零开始创建一个管理后台首页，包含导航、统计卡片、图表和数据表格。

### 🎨 设计稿信息

**Figma 设计链接**: `https://figma.com/file/admin-dashboard`

**设计要求**:
- 左侧收缩导航菜单
- 顶部用户信息栏
- 主内容区：4个统计卡片 + 2个图表 + 1个数据表格
- 整体采用蓝色主题，现代简约风格
- 支持响应式布局

### 💬 用户输入

```
我需要创建一个管理后台首页项目，包含以下功能：
1. 左侧导航菜单（可收起）
2. 顶部用户信息栏
3. 统计卡片区域（用户数、订单数、收入、转化率）
4. 图表展示区域（趋势图和饼图）
5. 数据表格区域（最近活动记录）

设计要求：
- 整体蓝色主题 (#0052d9)
- 现代简约风格
- 支持移动端适配
- 使用 Vue3 + TDesign 技术栈

请创建完整的项目。
```

### 🔄 执行流程

#### 步骤 1: 模式选择
```bash
检测当前目录为空
用户选择：完整项目模式
项目名称：admin-dashboard
技术栈：Vue3 + TDesign + Vite + TypeScript
```

#### 步骤 2: 设计稿分析
```yaml
页面结构:
  布局: 左侧导航 + 顶部栏 + 主内容区
  
组件清单:
  - AppLayout: 主布局组件
  - Sidebar: 侧边导航
  - Header: 顶部栏
  - StatCard: 统计卡片
  - DataChart: 图表组件
  - DataTable: 数据表格
  - Dashboard: 首页

设计规范:
  主题色: #0052d9
  成功色: #00a870
  警告色: #ed7b2f
  错误色: #d54941
  
  字体: PingFang SC
  间距: 8px, 16px, 24px, 32px
  圆角: 4px, 8px
  阴影: 0 2px 8px rgba(0,0,0,0.1)
```

#### 步骤 3: 项目结构创建
```bash
创建项目目录: admin-dashboard/
生成标准 Vue3 项目结构:

admin-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.vue
│   │   │   ├── Header.vue
│   │   │   └── Sidebar.vue
│   │   └── business/
│   │       ├── StatCard.vue
│   │       ├── DataChart.vue
│   │       └── DataTable.vue
│   ├── views/
│   │   └── Dashboard.vue
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.less
│   │       ├── mixins.less
│   │       └── global.less
│   ├── router/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

#### 步骤 4: 配置文件生成

**package.json**:
```json
{
  "name": "admin-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "format": "prettier --write ."
  },
  "dependencies": {
    "vue": "^3.3.8",
    "vue-router": "^4.2.5",
    "tdesign-vue-next": "^1.7.1",
    "tdesign-icons-vue-next": "^0.2.2",
    "echarts": "^5.4.3",
    "vue-echarts": "^6.6.1"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "@vitejs/plugin-vue": "^4.4.1",
    "eslint": "^8.54.0",
    "eslint-plugin-vue": "^9.18.1",
    "less": "^4.2.0",
    "prettier": "^3.1.0",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "vue-tsc": "^1.8.22"
  }
}
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "@/assets/styles/variables.less";`
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

#### 步骤 5: 样式系统生成

**variables.less**:
```less
// 主题色彩
@primary-color: #0052d9;
@success-color: #00a870;
@warning-color: #ed7b2f;
@error-color: #d54941;

// 文本颜色
@text-color-primary: #000000;
@text-color-secondary: #666666;
@text-color-placeholder: #bbbbbb;
@text-color-disabled: #cccccc;

// 背景颜色
@bg-color-page: #f5f7fa;
@bg-color-container: #ffffff;
@bg-color-sidebar: #001529;

// 字体系统
@font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
@font-size-xs: 12px;
@font-size-sm: 14px;
@font-size-md: 16px;
@font-size-lg: 18px;
@font-size-xl: 20px;

// 间距系统
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;

// 圆角系统
@border-radius-sm: 4px;
@border-radius-md: 8px;
@border-radius-lg: 12px;

// 阴影系统
@shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
@shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
@shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);

// 布局尺寸
@sidebar-width: 240px;
@sidebar-collapsed-width: 64px;
@header-height: 64px;
```

#### 步骤 6: 核心组件生成

**AppLayout.vue**:
```vue
<template>
  <div class="app-layout">
    <Sidebar 
      :collapsed="sidebarCollapsed" 
      @toggle="handleSidebarToggle"
    />
    <div class="app-layout__main" :class="{ 'collapsed': sidebarCollapsed }">
      <Header 
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="handleSidebarToggle"
      />
      <div class="app-layout__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const sidebarCollapsed = ref(false)

const handleSidebarToggle = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style lang="less" scoped>
.app-layout {
  display: flex;
  height: 100vh;
  
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: @sidebar-width;
    transition: margin-left 0.3s ease;
    
    &.collapsed {
      margin-left: @sidebar-collapsed-width;
    }
  }
  
  &__content {
    flex: 1;
    overflow: auto;
    background-color: @bg-color-page;
  }
}

@media (max-width: 768px) {
  .app-layout {
    &__main {
      margin-left: 0;
      
      &.collapsed {
        margin-left: 0;
      }
    }
  }
}
</style>
```

**Dashboard.vue**:
```vue
<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <div class="dashboard__stats">
      <t-row :gutter="16">
        <t-col 
          :xs="24" 
          :sm="12" 
          :md="6" 
          v-for="stat in stats" 
          :key="stat.id"
        >
          <StatCard
            :icon="stat.icon"
            :value="stat.value"
            :label="stat.label"
            :trend="stat.trend"
            :trend-text="stat.trendText"
            :formatter="stat.formatter"
            @click="handleStatClick(stat)"
          />
        </t-col>
      </t-row>
    </div>

    <!-- 图表区域 -->
    <div class="dashboard__charts">
      <t-row :gutter="16">
        <t-col :xs="24" :lg="12">
          <t-card title="数据趋势" class="chart-card">
            <DataChart :data="trendData" type="line" />
          </t-card>
        </t-col>
        <t-col :xs="24" :lg="12">
          <t-card title="分布情况" class="chart-card">
            <DataChart :data="pieData" type="pie" />
          </t-card>
        </t-col>
      </t-row>
    </div>

    <!-- 数据表格区域 -->
    <div class="dashboard__table">
      <t-card title="最近活动">
        <template #actions>
          <t-button 
            theme="primary" 
            @click="refreshData"
            :loading="loading"
          >
            <template #icon>
              <t-icon name="refresh" />
            </template>
            刷新
          </t-button>
        </template>
        <DataTable 
          :data="tableData" 
          :columns="tableColumns"
          :pagination="pagination"
          :loading="loading"
          @page-change="handlePageChange"
        />
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import StatCard from '@/components/business/StatCard.vue'
import DataChart from '@/components/business/DataChart.vue'
import DataTable from '@/components/business/DataTable.vue'

// 类型定义
interface StatItem {
  id: string
  icon: 'user' | 'chart' | 'money' | 'order'
  value: number
  label: string
  trend: number
  trendText: string
  formatter?: (value: number) => string
}

// 响应式数据
const loading = ref(false)

const stats = ref<StatItem[]>([
  {
    id: '1',
    icon: 'user',
    value: 12345,
    label: '总用户数',
    trend: 12.5,
    trendText: '+12.5%',
    formatter: (value) => value.toLocaleString()
  },
  {
    id: '2',
    icon: 'order',
    value: 8567,
    label: '订单数',
    trend: -5.2,
    trendText: '-5.2%',
    formatter: (value) => value.toLocaleString()
  },
  {
    id: '3',
    icon: 'money',
    value: 156789,
    label: '总收入',
    trend: 8.9,
    trendText: '+8.9%',
    formatter: (value) => `¥${value.toLocaleString()}`
  },
  {
    id: '4',
    icon: 'chart',
    value: 89.6,
    label: '转化率',
    trend: 2.1,
    trendText: '+2.1%',
    formatter: (value) => `${value}%`
  }
])

const trendData = ref([])
const pieData = ref([])
const tableData = ref([])

const tableColumns = ref([
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'name', title: '用户名', width: 120 },
  { colKey: 'action', title: '操作', width: 100 },
  { colKey: 'time', title: '时间', width: 180 },
  { colKey: 'status', title: '状态', width: 100 }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 事件处理
const handleStatClick = (stat: StatItem) => {
  console.log('统计卡片点击:', stat)
  // 可以跳转到详情页面
}

const handlePageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  loadTableData()
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadChartData(),
      loadTableData()
    ])
  } finally {
    loading.value = false
  }
}

// 数据加载
const loadStats = async () => {
  // 模拟 API 调用
  return new Promise(resolve => setTimeout(resolve, 1000))
}

const loadChartData = async () => {
  // 模拟图表数据
  trendData.value = [
    { name: '1月', value: 820 },
    { name: '2月', value: 932 },
    { name: '3月', value: 901 },
    { name: '4月', value: 934 },
    { name: '5月', value: 1290 },
    { name: '6月', value: 1330 }
  ]
  
  pieData.value = [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 }
  ]
}

const loadTableData = async () => {
  // 模拟表格数据
  const mockData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    action: '登录',
    time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    status: Math.random() > 0.5 ? '成功' : '失败'
  }))
  
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  tableData.value = mockData.slice(start, end)
  pagination.total = mockData.length
}

// 生命周期
onMounted(() => {
  refreshData()
})
</script>

<style lang="less" scoped>
.dashboard {
  padding: @spacing-lg;
  
  &__stats {
    margin-bottom: @spacing-xl;
  }
  
  &__charts {
    margin-bottom: @spacing-xl;
    
    .chart-card {
      height: 400px;
    }
  }
  
  &__table {
    :deep(.t-card__body) {
      padding: 0;
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: @spacing-md;
    
    &__charts {
      .t-col {
        margin-bottom: @spacing-md;
      }
    }
  }
}
</style>
```

#### 步骤 7: 项目初始化和验证

```bash
# 安装依赖
cd admin-dashboard
npm install

# 启动开发服务器
npm run dev

# 验证项目
✅ 项目成功启动在 http://localhost:3000
✅ 所有组件正常渲染
✅ 样式还原度 96%
✅ 响应式布局工作正常
✅ TypeScript 类型检查通过
✅ ESLint 检查通过
```

### 📤 输出结果

**生成的项目结构**:
```
admin-dashboard/
├── 📁 public/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── 📄 AppLayout.vue
│   │   │   ├── 📄 Header.vue
│   │   │   └── 📄 Sidebar.vue
│   │   └── 📁 business/
│   │       ├── 📄 StatCard.vue
│   │       ├── 📄 DataChart.vue
│   │       └── 📄 DataTable.vue
│   ├── 📁 views/
│   │   └── 📄 Dashboard.vue
│   ├── 📁 assets/styles/
│   ├── 📁 router/
│   └── 📄 main.ts
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
└── 📄 README.md
```

**项目特性**:
- ✅ 完整的 Vue3 + TDesign + TypeScript 项目
- ✅ 现代化的项目结构和配置
- ✅ 响应式布局设计
- ✅ 组件化开发模式
- ✅ 完整的开发工具链（ESLint、Prettier、TypeScript）
- ✅ 生产级代码质量

### ✅ 验证结果

**功能验证**:
- ✅ 侧边栏收缩功能正常
- ✅ 统计卡片显示和交互正常
- ✅ 图表渲染正常
- ✅ 数据表格分页功能正常
- ✅ 移动端适配正常

**性能验证**:
- ✅ 首次加载时间 < 2s
- ✅ 交互响应时间 < 100ms
- ✅ 内存使用合理
- ✅ 打包体积 < 2MB

---

## 示例 3: 数据表格页面（原子能力模式）

### 📝 场景描述

在现有项目中添加一个数据表格页面，包含搜索、筛选、排序、分页等功能。

### 🎨 设计稿信息

**设计要求**:
- 顶部搜索和筛选区域
- 中间数据表格区域（支持排序、选择）
- 底部分页组件
- 操作按钮（新增、编辑、删除）
- 支持响应式布局

### 💬 用户输入

```
我需要在现有项目中添加一个用户管理页面，包含：
1. 顶部搜索框和状态筛选
2. 用户列表表格（姓名、邮箱、状态、注册时间、操作）
3. 支持批量操作（删除、导出）
4. 分页功能
5. 新增/编辑用户弹窗

请生成对应的页面组件。
```

### 🔄 执行流程

#### 步骤 1: 模式检测和分析
```bash
检测模式：原子能力模式
组件分析：
- UserManagement.vue (页面组件)
- UserForm.vue (表单弹窗组件)
- SearchFilter.vue (搜索筛选组件)
```

#### 步骤 2: 组件代码生成

**UserManagement.vue**:
```vue
<template>
  <div class="user-management">
    <!-- 搜索筛选区域 -->
    <t-card class="search-card">
      <SearchFilter 
        v-model:keyword="searchParams.keyword"
        v-model:status="searchParams.status"
        @search="handleSearch"
        @reset="handleReset"
      />
    </t-card>

    <!-- 表格区域 -->
    <t-card>
      <template #header>
        <div class="table-header">
          <h3>用户列表</h3>
          <div class="table-actions">
            <t-button 
              theme="primary" 
              @click="handleAdd"
            >
              <template #icon>
                <t-icon name="add" />
              </template>
              新增用户
            </t-button>
            <t-button 
              theme="default" 
              :disabled="!selectedRowKeys.length"
              @click="handleBatchDelete"
            >
              批量删除
            </t-button>
            <t-button 
              theme="default"
              @click="handleExport"
            >
              导出数据
            </t-button>
          </div>
        </div>
      </template>

      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :selected-row-keys="selectedRowKeys"
        :pagination="pagination"
        row-key="id"
        select-on-row-click
        @select-change="handleSelectChange"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
      />
    </t-card>

    <!-- 用户表单弹窗 -->
    <UserForm
      v-model:visible="formVisible"
      :data="currentUser"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import SearchFilter from '@/components/business/SearchFilter.vue'
import UserForm from '@/components/business/UserForm.vue'

// 类型定义
interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
  registerTime: string
}

interface SearchParams {
  keyword: string
  status: string
}

// 响应式数据
const loading = ref(false)
const formVisible = ref(false)
const selectedRowKeys = ref<number[]>([])
const currentUser = ref<User | null>(null)

const searchParams = reactive<SearchParams>({
  keyword: '',
  status: ''
})

const tableData = ref<User[]>([])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true
})

// 表格列配置
const columns = ref([
  {
    colKey: 'name',
    title: '姓名',
    sortable: true,
    width: 120
  },
  {
    colKey: 'email',
    title: '邮箱',
    width: 200
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cell: (h: any, { row }: any) => {
      const statusMap = {
        active: { label: '激活', theme: 'success' },
        inactive: { label: '未激活', theme: 'warning' }
      }
      const status = statusMap[row.status as keyof typeof statusMap]
      return h('t-tag', { theme: status.theme }, status.label)
    }
  },
  {
    colKey: 'registerTime',
    title: '注册时间',
    sortable: true,
    width: 180
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 150,
    cell: (h: any, { row }: any) => {
      return h('div', { class: 'table-operations' }, [
        h('t-button', {
          theme: 'primary',
          variant: 'text',
          size: 'small',
          onClick: () => handleEdit(row)
        }, '编辑'),
        h('t-button', {
          theme: 'danger',
          variant: 'text',
          size: 'small',
          onClick: () => handleDelete(row)
        }, '删除')
      ])
    }
  }
])

// 事件处理
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchParams.keyword = ''
  searchParams.status = ''
  pagination.current = 1
  loadData()
}

const handleAdd = () => {
  currentUser.value = null
  formVisible.value = true
}

const handleEdit = (user: User) => {
  currentUser.value = { ...user }
  formVisible.value = true
}

const handleDelete = async (user: User) => {
  try {
    // 模拟删除 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    MessagePlugin.success('删除成功')
    loadData()
  } catch (error) {
    MessagePlugin.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  if (!selectedRowKeys.value.length) return
  
  try {
    // 模拟批量删除 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    MessagePlugin.success(`已删除 ${selectedRowKeys.value.length} 个用户`)
    selectedRowKeys.value = []
    loadData()
  } catch (error) {
    MessagePlugin.error('批量删除失败')
  }
}

const handleExport = () => {
  // 模拟导出功能
  MessagePlugin.success('导出成功')
}

const handleSelectChange = (value: number[]) => {
  selectedRowKeys.value = value
}

const handlePageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  loadData()
}

const handleSortChange = (sortInfo: any) => {
  console.log('排序变化:', sortInfo)
  loadData()
}

const handleSubmit = async (formData: Partial<User>) => {
  try {
    loading.value = true
    
    if (currentUser.value) {
      // 编辑用户
      await new Promise(resolve => setTimeout(resolve, 1000))
      MessagePlugin.success('编辑成功')
    } else {
      // 新增用户
      await new Promise(resolve => setTimeout(resolve, 1000))
      MessagePlugin.success('新增成功')
    }
    
    formVisible.value = false
    loadData()
  } catch (error) {
    MessagePlugin.error('操作失败')
  } finally {
    loading.value = false
  }
}

// 数据加载
const loadData = async () => {
  try {
    loading.value = true
    
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
      email: `user${index + 1}@example.com`,
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      registerTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleString()
    })) as User[]
    
    // 筛选数据
    let filteredData = mockData
    if (searchParams.keyword) {
      filteredData = filteredData.filter(item => 
        item.name.includes(searchParams.keyword) || 
        item.email.includes(searchParams.keyword)
      )
    }
    if (searchParams.status) {
      filteredData = filteredData.filter(item => item.status === searchParams.status)
    }
    
    // 分页数据
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
    
  } catch (error) {
    MessagePlugin.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.user-management {
  padding: @spacing-lg;
  
  .search-card {
    margin-bottom: @spacing-lg;
  }
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: @font-size-lg;
      font-weight: 500;
    }
    
    .table-actions {
      display: flex;
      gap: @spacing-sm;
    }
  }
  
  :deep(.table-operations) {
    display: flex;
    gap: @spacing-sm;
  }
}

@media (max-width: 768px) {
  .user-management {
    padding: @spacing-md;
    
    .table-header {
      flex-direction: column;
      align-items: flex-start;
      gap: @spacing-md;
      
      .table-actions {
        width: 100%;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
```

### 📤 输出结果

**生成的文件**:
- ✅ `src/views/UserManagement.vue` - 用户管理页面
- ✅ `src/components/business/SearchFilter.vue` - 搜索筛选组件
- ✅ `src/components/business/UserForm.vue` - 用户表单组件

**页面功能**:
- ✅ 搜索和筛选功能
- ✅ 数据表格展示
- ✅ 排序和分页
- ✅ 批量操作
- ✅ 新增/编辑用户
- ✅ 响应式布局

---

## 示例 4: 移动端商品卡片（响应式设计）

### 📝 场景描述

创建一个商品卡片组件，需要在桌面端和移动端有不同的布局表现。

### 🎨 设计稿信息

**设计要求**:
- 桌面端：横向布局，图片在左，信息在右
- 移动端：纵向布局，图片在上，信息在下
- 包含：商品图片、标题、价格、标签、操作按钮
- 支持收藏和购买操作

### 💬 用户输入

```
我需要一个商品卡片组件，要求：
1. 支持桌面端和移动端不同布局
2. 包含商品图片、标题、价格、标签
3. 有收藏和购买按钮
4. 支持促销标签显示
5. 价格支持原价和现价显示

请生成响应式的商品卡片组件。
```

### 🔄 执行流程

**ProductCard.vue**:
```vue
<template>
  <t-card class="product-card" hover>
    <div class="product-card__content">
      <!-- 商品图片 -->
      <div class="product-card__image">
        <img :src="product.image" :alt="product.title" />
        <div class="product-card__badges" v-if="product.badges?.length">
          <t-tag 
            v-for="badge in product.badges"
            :key="badge.text"
            :theme="badge.theme"
            size="small"
            class="product-badge"
          >
            {{ badge.text }}
          </t-tag>
        </div>
        <div class="product-card__favorite" @click="handleFavorite">
          <t-icon 
            :name="isFavorited ? 'heart-filled' : 'heart'" 
            :class="{ 'favorited': isFavorited }"
          />
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="product-card__info">
        <h3 class="product-card__title">{{ product.title }}</h3>
        <p class="product-card__description" v-if="product.description">
          {{ product.description }}
        </p>
        
        <!-- 价格信息 -->
        <div class="product-card__price">
          <span class="current-price">¥{{ product.currentPrice }}</span>
          <span 
            class="original-price" 
            v-if="product.originalPrice && product.originalPrice !== product.currentPrice"
          >
            ¥{{ product.originalPrice }}
          </span>
          <span 
            class="discount" 
            v-if="discountPercent"
          >
            {{ discountPercent }}折
          </span>
        </div>

        <!-- 商品属性 -->
        <div class="product-card__attrs" v-if="product.attrs?.length">
          <t-tag 
            v-for="attr in product.attrs"
            :key="attr"
            variant="light"
            size="small"
          >
            {{ attr }}
          </t-tag>
        </div>

        <!-- 操作按钮 -->
        <div class="product-card__actions">
          <t-button 
            theme="primary" 
            block
            @click="handleBuy"
            :loading="buyLoading"
          >
            立即购买
          </t-button>
          <t-button 
            theme="default" 
            variant="outline"
            block
            @click="handleAddToCart"
            :loading="cartLoading"
          >
            加入购物车
          </t-button>
        </div>
      </div>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 类型定义
interface Badge {
  text: string
  theme: 'primary' | 'success' | 'warning' | 'danger'
}

interface Product {
  id: number
  title: string
  description?: string
  image: string
  currentPrice: number
  originalPrice?: number
  badges?: Badge[]
  attrs?: string[]
}

interface Props {
  product: Product
  favorited?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  favorited: false
})

// 事件定义
const emit = defineEmits<{
  favorite: [productId: number, favorited: boolean]
  buy: [product: Product]
  addToCart: [product: Product]
}>()

// 响应式数据
const isFavorited = ref(props.favorited)
const buyLoading = ref(false)
const cartLoading = ref(false)

// 计算属性
const discountPercent = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice === props.product.currentPrice) {
    return null
  }
  const percent = (props.product.currentPrice / props.product.originalPrice * 10).toFixed(1)
  return percent
})

// 事件处理
const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite', props.product.id, isFavorited.value)
  MessagePlugin.success(isFavorited.value ? '已收藏' : '已取消收藏')
}

const handleBuy = async () => {
  try {
    buyLoading.value = true
    // 模拟购买操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('buy', props.product)
    MessagePlugin.success('购买成功')
  } catch (error) {
    MessagePlugin.error('购买失败')
  } finally {
    buyLoading.value = false
  }
}

const handleAddToCart = async () => {
  try {
    cartLoading.value = true
    // 模拟加入购物车操作
    await new Promise(resolve => setTimeout(resolve, 800))
    emit('addToCart', props.product)
    MessagePlugin.success('已加入购物车')
  } catch (error) {
    MessagePlugin.error('加入购物车失败')
  } finally {
    cartLoading.value = false
  }
}
</script>

<style lang="less" scoped>
.product-card {
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: @shadow-lg;
    transform: translateY(-2px);
  }
  
  &__content {
    display: flex;
    height: 100%;
  }
  
  &__image {
    position: relative;
    flex-shrink: 0;
    width: 200px;
    height: 150px;
    border-radius: @border-radius-md;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-card__badges {
      position: absolute;
      top: @spacing-sm;
      left: @spacing-sm;
      display: flex;
      flex-direction: column;
      gap: @spacing-xs;
    }
    
    .product-card__favorite {
      position: absolute;
      top: @spacing-sm;
      right: @spacing-sm;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
      }
      
      .t-icon {
        font-size: 18px;
        color: #666;
        
        &.favorited {
          color: @error-color;
        }
      }
    }
  }
  
  &__info {
    flex: 1;
    padding-left: @spacing-lg;
    display: flex;
    flex-direction: column;
  }
  
  &__title {
    font-size: @font-size-lg;
    font-weight: 500;
    color: @text-color-primary;
    margin: 0 0 @spacing-sm 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  
  &__description {
    font-size: @font-size-sm;
    color: @text-color-secondary;
    margin: 0 0 @spacing-md 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  
  &__price {
    display: flex;
    align-items: baseline;
    gap: @spacing-sm;
    margin-bottom: @spacing-md;
    
    .current-price {
      font-size: @font-size-xl;
      font-weight: 600;
      color: @error-color;
    }
    
    .original-price {
      font-size: @font-size-sm;
      color: @text-color-secondary;
      text-decoration: line-through;
    }
    
    .discount {
      font-size: @font-size-xs;
      color: @error-color;
      background-color: rgba(213, 73, 65, 0.1);
      padding: 2px 6px;
      border-radius: @border-radius-sm;
    }
  }
  
  &__attrs {
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-xs;
    margin-bottom: @spacing-lg;
  }
  
  &__actions {
    margin-top: auto;
    display: flex;
    gap: @spacing-sm;
  }
}

// 移动端响应式布局
@media (max-width: 768px) {
  .product-card {
    &__content {
      flex-direction: column;
    }
    
    &__image {
      width: 100%;
      height: 200px;
    }
    
    &__info {
      padding-left: 0;
      padding-top: @spacing-lg;
    }
    
    &__actions {
      flex-direction: column;
    }
  }
}

// 小屏幕移动端
@media (max-width: 480px) {
  .product-card {
    &__image {
      height: 180px;
    }
    
    &__title {
      font-size: @font-size-md;
    }
    
    &__price {
      .current-price {
        font-size: @font-size-lg;
      }
    }
  }
}
</style>
```

### 📤 输出结果

**使用示例**:
```vue
<template>
  <div class="product-list">
    <t-row :gutter="16">
      <t-col 
        :xs="24" 
        :sm="12" 
        :lg="8" 
        v-for="product in products" 
        :key="product.id"
      >
        <ProductCard
          :product="product"
          :favorited="favoriteIds.includes(product.id)"
          @favorite="handleFavorite"
          @buy="handleBuy"
          @add-to-cart="handleAddToCart"
        />
      </t-col>
    </t-row>
  </div> </template>

<script setup>
import ProductCard from '@/components/business/ProductCard.vue'

const products = ref([
  {
    id: 1,
    title: 'iPhone 15 Pro 256GB',
    description: '钛金属设计，A17 Pro 芯片，专业级摄像系统',
    image: '/images/iphone15pro.jpg',
    currentPrice: 8999,
    originalPrice: 9999,
    badges: [
      { text: '新品', theme: 'primary' },
      { text: '热销', theme: 'danger' }
    ],
    attrs: ['256GB', '钛金属', '5G']
  }
])

const favoriteIds = ref([])

const handleFavorite = (productId, favorited) => {
  if (favorited) {
    favoriteIds.value.push(productId)
  } else {
    const index = favoriteIds.value.indexOf(productId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
    }
  }
}
</script>
```

**响应式特性**:
- ✅ 桌面端：横向布局，图片左侧，信息右侧
- ✅ 移动端：纵向布局，图片上方，信息下方
- ✅ 按钮在移动端变为纵向排列
- ✅ 图片尺寸自适应屏幕大小
- ✅ 文字大小在小屏幕上适当缩小

---

## 示例 5: 复杂表单页面（完整项目模式）

### 📝 场景描述

创建一个包含多步骤的复杂表单页面，用于用户信息收集和验证。

### 🎨 设计稿信息

**表单步骤**:
1. 基本信息（姓名、邮箱、电话）
2. 地址信息（省市区、详细地址）
3. 偏好设置（兴趣标签、通知设置）
4. 信息确认（预览和提交）

### 💬 用户输入

```
我需要创建一个用户注册流程，包含多个步骤：
1. 基本信息填写
2. 地址信息填写
3. 兴趣偏好选择
4. 信息确认提交

要求：
- 步骤导航显示当前进度
- 表单验证和错误提示
- 支持上一步/下一步操作
- 最后一步预览所有信息
- 使用 Vue3 + TDesign

请创建完整的项目。
```

### 🔄 执行流程

**MultiStepForm.vue**:
```vue
<template>
  <div class="multi-step-form">
    <t-card>
      <!-- 步骤导航 -->
      <t-steps 
        :current="currentStep" 
        :options="stepOptions"
        class="form-steps"
      />

      <!-- 表单内容 -->
      <div class="form-content">
        <t-form
          ref="formRef"
          :model="formData"
          :rules="currentRules"
          layout="vertical"
          @submit="handleSubmit"
        >
          <!-- 步骤 1: 基本信息 -->
          <div v-show="currentStep === 0" class="step-content">
            <h3>基本信息</h3>
            <t-row :gutter="16">
              <t-col :span="12">
                <t-form-item label="姓名" name="basicInfo.name">
                  <t-input 
                    v-model="formData.basicInfo.name"
                    placeholder="请输入姓名"
                    clearable
                  />
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="性别" name="basicInfo.gender">
                  <t-radio-group v-model="formData.basicInfo.gender">
                    <t-radio value="male">男</t-radio>
                    <t-radio value="female">女</t-radio>
                    <t-radio value="other">其他</t-radio>
                  </t-radio-group>
                </t-form-item>
              </t-col>
            </t-row>
            
            <t-row :gutter="16">
              <t-col :span="12">
                <t-form-item label="邮箱" name="basicInfo.email">
                  <t-input 
                    v-model="formData.basicInfo.email"
                    placeholder="请输入邮箱地址"
                    type="email"
                    clearable
                  />
                </t-form-item>
              </t-col>
              <t-col :span="12">
                <t-form-item label="手机号" name="basicInfo.phone">
                  <t-input 
                    v-model="formData.basicInfo.phone"
                    placeholder="请输入手机号"
                    clearable
                  />
                </t-form-item>
              </t-col>
            </t-row>

            <t-form-item label="生日" name="basicInfo.birthday">
              <t-date-picker 
                v-model="formData.basicInfo.birthday"
                placeholder="请选择生日"
                clearable
              />
            </t-form-item>
          </div>

          <!-- 步骤 2: 地址信息 -->
          <div v-show="currentStep === 1" class="step-content">
            <h3>地址信息</h3>
            <t-row :gutter="16">
              <t-col :span="8">
                <t-form-item label="省份" name="addressInfo.province">
                  <t-select 
                    v-model="formData.addressInfo.province"
                    placeholder="请选择省份"
                    clearable
                    @change="handleProvinceChange"
                  >
                    <t-option 
                      v-for="province in provinces"
                      :key="province.value"
                      :value="province.value"
                      :label="province.label"
                    />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="城市" name="addressInfo.city">
                  <t-select 
                    v-model="formData.addressInfo.city"
                    placeholder="请选择城市"
                    clearable
                    :disabled="!formData.addressInfo.province"
                    @change="handleCityChange"
                  >
                    <t-option 
                      v-for="city in cities"
                      :key="city.value"
                      :value="city.value"
                      :label="city.label"
                    />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item label="区县" name="addressInfo.district">
                  <t-select 
                    v-model="formData.addressInfo.district"
                    placeholder="请选择区县"
                    clearable
                    :disabled="!formData.addressInfo.city"
                  >
                    <t-option 
                      v-for="district in districts"
                      :key="district.value"
                      :value="district.value"
                      :label="district.label"
                    />
                  </t-select>
                </t-form-item>
              </t-col>
            </t-row>

            <t-form-item label="详细地址" name="addressInfo.detail">
              <t-textarea 
                v-model="formData.addressInfo.detail"
                placeholder="请输入详细地址"
                :maxlength="200"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </t-form-item>
          </div>

          <!-- 步骤 3: 偏好设置 -->
          <div v-show="currentStep === 2" class="step-content">
            <h3>偏好设置</h3>
            <t-form-item label="兴趣标签" name="preferences.interests">
              <t-checkbox-group v-model="formData.preferences.interests">
                <t-checkbox 
                  v-for="interest in interestOptions"
                  :key="interest.value"
                  :value="interest.value"
                >
                  {{ interest.label }}
                </t-checkbox>
              </t-checkbox-group>
            </t-form-item>

            <t-form-item label="通知设置">
              <t-switch 
                v-model="formData.preferences.emailNotification"
                label="邮件通知"
              />
              <br><br>
              <t-switch 
                v-model="formData.preferences.smsNotification"
                label="短信通知"
              />
            </t-form-item>

            <t-form-item label="语言偏好" name="preferences.language">
              <t-radio-group v-model="formData.preferences.language">
                <t-radio value="zh">中文</t-radio>
                <t-radio value="en">English</t-radio>
              </t-radio-group>
            </t-form-item>
          </div>

          <!-- 步骤 4: 信息确认 -->
          <div v-show="currentStep === 3" class="step-content">
            <h3>信息确认</h3>
            <div class="form-preview">
              <t-card title="基本信息" class="preview-section">
                <p><strong>姓名：</strong>{{ formData.basicInfo.name }}</p>
                <p><strong>性别：</strong>{{ getGenderLabel(formData.basicInfo.gender) }}</p>
                <p><strong>邮箱：</strong>{{ formData.basicInfo.email }}</p>
                <p><strong>手机：</strong>{{ formData.basicInfo.phone }}</p>
                <p><strong>生日：</strong>{{ formData.basicInfo.birthday }}</p>
              </t-card>

              <t-card title="地址信息" class="preview-section">
                <p><strong>地址：</strong>
                  {{ getAddressText() }}
                </p>
                <p><strong>详细地址：</strong>{{ formData.addressInfo.detail }}</p>
              </t-card>

              <t-card title="偏好设置" class="preview-section">
                <p><strong>兴趣：</strong>{{ getInterestsText() }}</p>
                <p><strong>邮件通知：</strong>{{ formData.preferences.emailNotification ? '开启' : '关闭' }}</p>
                <p><strong>短信通知：</strong>{{ formData.preferences.smsNotification ? '开启' : '关闭' }}</p>
                <p><strong>语言：</strong>{{ formData.preferences.language === 'zh' ? '中文' : 'English' }}</p>
              </t-card>
            </div>
          </div>
        </t-form>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <t-button 
          v-if="currentStep > 0"
          theme="default"
          @click="handlePrevious"
        >
          上一步
        </t-button>
        <t-button 
          v-if="currentStep < stepOptions.length - 1"
          theme="primary"
          @click="handleNext"
          :loading="validating"
        >
          下一步
        </t-button>
        <t-button 
          v-if="currentStep === stepOptions.length - 1"
          theme="primary"
          @click="handleSubmit"
          :loading="submitting"
        >
          提交
        </t-button>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 类型定义
interface FormData {
  basicInfo: {
    name: string
    gender: string
    email: string
    phone: string
    birthday: string
  }
  addressInfo: {
    province: string
    city: string
    district: string
    detail: string
  }
  preferences: {
    interests: string[]
    emailNotification: boolean
    smsNotification: boolean
    language: string
  }
}

// 响应式数据
const currentStep = ref(0)
const validating = ref(false)
const submitting = ref(false)
const formRef = ref()

const formData = reactive<FormData>({
  basicInfo: {
    name: '',
    gender: '',
    email: '',
    phone: '',
    birthday: ''
  },
  addressInfo: {
    province: '',
    city: '',
    district: '',
    detail: ''
  },
  preferences: {
    interests: [],
    emailNotification: true,
    smsNotification: false,
    language: 'zh'
  }
})

// 步骤配置
const stepOptions = [
  { title: '基本信息', content: '填写个人基本信息' },
  { title: '地址信息', content: '填写联系地址' },
  { title: '偏好设置', content: '设置个人偏好' },
  { title: '信息确认', content: '确认提交信息' }
]

// 表单验证规则
const formRules = {
  step0: {
    'basicInfo.name': [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    'basicInfo.gender': [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    'basicInfo.email': [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    'basicInfo.phone': [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  },
  step1: {
    'addressInfo.province': [
      { required: true, message: '请选择省份', trigger: 'change' }
    ],
    'addressInfo.city': [
      { required: true, message: '请选择城市', trigger: 'change' }
    ],
    'addressInfo.district': [
      { required: true, message: '请选择区县', trigger: 'change' }
    ],
    'addressInfo.detail': [
      { required: true, message: '请输入详细地址', trigger: 'blur' }
    ]
  },
  step2: {
    'preferences.interests': [
      { required: true, message: '请至少选择一个兴趣', trigger: 'change' }
    ]
  }
}

const currentRules = computed(() => {
  return formRules[`step${currentStep.value}` as keyof typeof formRules] || {}
})

// 选项数据
const provinces = ref([
  { value: 'beijing', label: '北京市' },
  { value: 'shanghai', label: '上海市' },
  { value: 'guangdong', label: '广东省' },
  { value: 'jiangsu', label: '江苏省' }
])

const cities = ref([])
const districts = ref([])

const interestOptions = [
  { value: 'sports', label: '运动健身' },
  { value: 'music', label: '音乐' },
  { value: 'reading', label: '阅读' },
  { value: 'travel', label: '旅行' },
  { value: 'cooking', label: '烹饪' },
  { value: 'photography', label: '摄影' }
]

// 事件处理
const handleNext = async () => {
  if (currentStep.value < stepOptions.length - 1) {
    const isValid = await validateCurrentStep()
    if (isValid) {
      currentStep.value++
    }
  }
}

const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const validateCurrentStep = async () => {
  if (!formRef.value) return false
  
  try {
    validating.value = true
    await formRef.value.validate()
    return true
  } catch (error) {
    console.error('表单验证失败:', error)
    return false
  } finally {
    validating.value = false
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // 模拟提交 API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    MessagePlugin.success('注册成功！')
    
    // 重置表单
    resetForm()
    
  } catch (error) {
    MessagePlugin.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 0
  Object.assign(formData.basicInfo, {
    name: '',
    gender: '',
    email: '',
    phone: '',
    birthday: ''
  })
  Object.assign(formData.addressInfo, {
    province: '',
    city: '',
    district: '',
    detail: ''
  })
  Object.assign(formData.preferences, {
    interests: [],
    emailNotification: true,
    smsNotification: false,
    language: 'zh'
  })
}

// 辅助方法
const getGenderLabel = (gender: string) => {
  const genderMap = {
    male: '男',
    female: '女',
    other: '其他'
  }
  return genderMap[gender as keyof typeof genderMap] || ''
}

const getAddressText = () => {
  const province = provinces.value.find(p => p.value === formData.addressInfo.province)?.label || ''
  const city = cities.value.find(c => c.value === formData.addressInfo.city)?.label || ''
  const district = districts.value.find(d => d.value === formData.addressInfo.district)?.label || ''
  return `${province} ${city} ${district}`
}

const getInterestsText = () => {
  return formData.preferences.interests
    .map(interest => interestOptions.find(opt => opt.value === interest)?.label)
    .filter(Boolean)
    .join('、')
}

const handleProvinceChange = () => {
  formData.addressInfo.city = ''
  formData.addressInfo.district = ''
  // 模拟加载城市数据
  cities.value = [
    { value: 'city1', label: '城市1' },
    { value: 'city2', label: '城市2' }
  ]
}

const handleCityChange = () => {
  formData.addressInfo.district = ''
  // 模拟加载区县数据
  districts.value = [
    { value: 'district1', label: '区县1' },
    { value: 'district2', label: '区县2' }
  ]
}
</script>

<style lang="less" scoped>
.multi-step-form {
  max-width: 800px;
  margin: 0 auto;
  padding: @spacing-lg;
  
  .form-steps {
    margin-bottom: @spacing-xl;
  }
  
  .form-content {
    min-height: 400px;
    margin-bottom: @spacing-xl;
  }
  
  .step-content {
    h3 {
      margin-bottom: @spacing-lg;
      font-size: @font-size-lg;
      font-weight: 500;
      color: @text-color-primary;
    }
  }
  
  .form-preview {
    .preview-section {
      margin-bottom: @spacing-lg;
      
      p {
        margin-bottom: @spacing-sm;
        line-height: 1.6;
        
        strong {
          display: inline-block;
          width: 80px;
          color: @text-color-primary;
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: @spacing-md;
    padding-top: @spacing-lg;
    border-top: 1px solid #e7e7e7;
  }
}

@media (max-width: 768px) {
  .multi-step-form {
    padding: @spacing-md;
    
    .form-actions {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
```

### 📤 输出结果

**完整项目结构**:
```
multi-step-form-project/
├── src/
│   ├── components/
│   │   └── MultiStepForm.vue
│   ├── views/
│   │   └── Register.vue
│   ├── assets/styles/
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
└── README.md
```

**项目特性**:
- ✅ 多步骤表单导航
- ✅ 分步骤表单验证
- ✅ 联动选择器（省市区）
- ✅ 复杂表单控件（日期、多选、开关）
- ✅ 信息预览和确认
- ✅ 响应式布局
- ✅ 表单重置功能
- ✅ 加载状态处理

---

## 🎯 总结

通过以上 5 个详细示例，展示了 `ui-figma2code` Skill 在不同场景下的应用：

### 适用场景总结
1. **原子能力模式**: 适合在现有项目中添加单个组件或页面
2. **完整项目模式**: 适合从零创建完整的前端项目
3. **响应式设计**: 支持桌面端和移动端的不同布局需求
4. **复杂交互**: 支持多步骤表单、数据表格等复杂业务场景

### 代码质量特点
- ✅ **TypeScript 支持**: 完整的类型定义和验证
- ✅ **Vue3 最佳实践**: 使用 Composition API 和现代化写法
- ✅ **TDesign 集成**: 充分利用企业级组件库
- ✅ **响应式设计**: 支持多种屏幕尺寸适配
- ✅ **性能优化**: 包含必要的性能优化措施
- ✅ **错误处理**: 完善的边界情况处理

### 使用建议
1. **简单组件**: 优先选择原子能力模式
2. **新项目**: 使用完整项目模式获得最佳开发体验
3. **复杂业务**: 可以组合多个示例中的最佳实践
4. **团队协作**: 参考示例中的代码规范和文档标准

---

**版本**: 3.1.0  
**最后更新**: 2025-11-10  
**维护者**: Spec-Code Team