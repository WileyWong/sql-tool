# TDesign Vue Next 完整使用指南

> TDesign Vue Next 版本使用规范和最佳实践

## 目录

- [基础信息](#基础信息)
- [安装配置](#安装配置)
- [组件使用](#组件使用)
- [图标系统](#图标系统)
- [样式主题](#样式主题)
- [最佳实践](#最佳实践)

---

## 基础信息

### 版本信息

- **核心包**: `tdesign-vue-next` - 最新稳定版本 `1.13.1`
- **图标包**: `tdesign-icons-vue-next` - 最新稳定版本 `0.3.6`

### 支持框架

- Vue 3 (Vue Next)
- TypeScript 5
- Vite 5

---

## 安装配置

### 1. 安装依赖

```bash
# 安装 TDesign Vue Next 核心库
npm install tdesign-vue-next@1.13.1

# 安装 TDesign 图标库
npm install tdesign-icons-vue-next@0.3.6
```

### 2. 全局注册（推荐）

在 `main.ts` 中全局注册：

```typescript
import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(TDesign).mount('#app');
```

全局注册后，所有组件使用 `t-` 前缀：

```vue
<template>
  <t-button>按钮</t-button>
  <t-radio>选项</t-radio>
  <t-input placeholder="请输入内容" />
</template>
```

### 3. 按需引入

```vue
<script setup lang="ts">
import { Button, Radio, Input } from 'tdesign-vue-next';
</script>

<template>
  <Button>按钮</Button>
  <Radio>选项</Radio>
  <Input placeholder="请输入内容" />
</template>
```

### 4. 配置多语言

```vue
<script setup lang="ts">
import { ConfigProvider } from 'tdesign-vue-next';
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN';
// import enConfig from 'tdesign-vue-next/es/locale/en_US';
// import jpConfig from 'tdesign-vue-next/es/locale/ja_JP';
// import koConfig from 'tdesign-vue-next/es/locale/ko_KR';

const globalConfig = {
  ...zhConfig,
  // 自定义全局配置
  animation: { exclude: [] },
  calendar: {},
  table: {},
  pagination: {}
};
</script>

<template>
  <ConfigProvider :globalConfig="globalConfig">
    <router-view />
  </ConfigProvider>
</template>
```

---

## 组件使用

### 基础组件

#### Button 按钮

用于开启闭环任务，如"删除"对象、"购买"商品等。

```vue
<template>
  <t-button>默认按钮</t-button>
  <t-button theme="primary">主要按钮</t-button>
  <t-button theme="danger">危险按钮</t-button>
  <t-button variant="outline">描边按钮</t-button>
  <t-button size="large">大按钮</t-button>
  <t-button :loading="true">加载中</t-button>
  <t-button :disabled="true">禁用按钮</t-button>
</template>
```

#### Link 链接

用于导航到新页面，如内部项目链接或外部友情链接。

```vue
<template>
  <t-link href="https://tdesign.tencent.com" target="_blank">
    TDesign 官网
  </t-link>
  <t-link theme="primary">主要链接</t-link>
  <t-link theme="danger">危险链接</t-link>
  <t-link :disabled="true">禁用链接</t-link>
</template>
```

#### Typography 排版

用于基础文本布局和样式。

```vue
<template>
  <t-typography>
    <Title>这是标题</Title>
    <Title :level="2">二级标题</Title>
    <Paragraph>这是一段普通文本内容。</Paragraph>
    <Text mark>标记文本</Text>
    <Text code>代码文本</Text>
    <Text delete>删除文本</Text>
    <Text strong>加粗文本</Text>
  </t-typography>
</template>

<script setup lang="ts">
import { Typography, Title, Paragraph, Text } from 'tdesign-vue-next';
</script>
```

#### Divider 分割线

用于将内容分隔为清晰的组。

```vue
<template>
  <t-divider />
  <t-divider>文本分割</t-divider>
  <t-divider layout="vertical" />
  <t-divider dashed>虚线分割</t-divider>
</template>
```

### 布局组件

#### Grid 栅格系统

```vue
<template>
  <t-row :gutter="16">
    <t-col :span="6">列 1</t-col>
    <t-col :span="6">列 2</t-col>
    <t-col :span="6">列 3</t-col>
    <t-col :span="6">列 4</t-col>
  </t-row>

  <!-- 响应式 -->
  <t-row>
    <t-col :xs="12" :sm="8" :md="6" :lg="4">响应式列</t-col>
  </t-row>
</template>

<script setup lang="ts">
import { Row, Col } from 'tdesign-vue-next';
</script>
```

#### Layout 布局

用于组织网页的框架结构。

```vue
<template>
  <t-layout>
    <t-header>Header</t-header>
    <t-layout>
      <t-aside>Aside</t-aside>
      <t-content>Content</t-content>
    </t-layout>
    <t-footer>Footer</t-footer>
  </t-layout>
</template>

<script setup lang="ts">
import { Layout, Header, Aside, Content, Footer } from 'tdesign-vue-next';
</script>
```

#### Space 间距

控制组件之间的间距。

```vue
<template>
  <t-space direction="vertical" size="large">
    <t-button>按钮1</t-button>
    <t-button>按钮2</t-button>
    <t-button>按钮3</t-button>
  </t-space>

  <t-space :size="16" align="center">
    <span>水平排列</span>
    <t-button>按钮</t-button>
  </t-space>
</template>
```

### 导航组件

#### Menu 菜单

用于容纳网站结构，提供可跳转的菜单列表。

```vue
<template>
  <t-menu :value="activeMenu" @change="handleMenuChange">
    <t-menu-item value="1">
      <template #icon><HomeIcon /></template>
      首页
    </t-menu-item>
    <t-sub-menu value="2" title="产品">
      <t-menu-item value="2-1">产品1</t-menu-item>
      <t-menu-item value="2-2">产品2</t-menu-item>
    </t-sub-menu>
    <t-menu-item value="3">关于</t-menu-item>
  </t-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Menu, MenuItem, SubMenu } from 'tdesign-vue-next';
import { HomeIcon } from 'tdesign-icons-vue-next';

const activeMenu = ref('1');

const handleMenuChange = (value: string) => {
  activeMenu.value = value;
};
</script>
```

#### Breadcrumb 面包屑

显示当前页面在系统层级结构中的位置。

```vue
<template>
  <t-breadcrumb>
    <t-breadcrumb-item>首页</t-breadcrumb-item>
    <t-breadcrumb-item>产品</t-breadcrumb-item>
    <t-breadcrumb-item>详情</t-breadcrumb-item>
  </t-breadcrumb>
</template>

<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from 'tdesign-vue-next';
</script>
```

#### Tabs 选项卡

用于容纳同一层级不同页面或类别的组件。

```vue
<template>
  <t-tabs v-model="activeTab">
    <t-tab-panel value="1" label="选项卡1">
      <p>选项卡1的内容</p>
    </t-tab-panel>
    <t-tab-panel value="2" label="选项卡2">
      <p>选项卡2的内容</p>
    </t-tab-panel>
    <t-tab-panel value="3" label="选项卡3">
      <p>选项卡3的内容</p>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabPanel } from 'tdesign-vue-next';

const activeTab = ref('1');
</script>
```

#### Pagination 分页

用于切换模块内的内容。

```vue
<template>
  <t-pagination
    v-model="current"
    :total="100"
    :pageSize="10"
    :showPageSize="true"
    :showJumper="true"
    @change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from 'tdesign-vue-next';

const current = ref(1);

const handlePageChange = (pageInfo: any) => {
  console.log('当前页:', pageInfo.current);
};
</script>
```

#### Steps 步骤条

用于引导用户完成任务，展示进度和当前步骤。

```vue
<template>
  <t-steps :current="current">
    <t-step-item title="步骤1" content="步骤1描述" />
    <t-step-item title="步骤2" content="步骤2描述" />
    <t-step-item title="步骤3" content="步骤3描述" />
  </t-steps>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Steps, StepItem } from 'tdesign-vue-next';

const current = ref(0);
</script>
```

#### Dropdown 下拉菜单

用于容纳大量操作，通过下拉展开更多操作。

```vue
<template>
  <t-dropdown>
    <t-button>
      更多操作
      <template #suffix><ChevronDownIcon /></template>
    </t-button>
    <template #dropdown>
      <t-dropdown-item @click="handleEdit">编辑</t-dropdown-item>
      <t-dropdown-item @click="handleDelete">删除</t-dropdown-item>
      <t-dropdown-item disabled>禁用项</t-dropdown-item>
    </template>
  </t-dropdown>
</template>

<script setup lang="ts">
import { Dropdown, DropdownItem, Button } from 'tdesign-vue-next';
import { ChevronDownIcon } from 'tdesign-icons-vue-next';

const handleEdit = () => {
  console.log('编辑');
};

const handleDelete = () => {
  console.log('删除');
};
</script>
```

### 表单组件

#### Input 输入框

用于容纳用户信息输入。

```vue
<template>
  <t-input
    v-model="inputValue"
    placeholder="请输入内容"
    clearable
  />

  <!-- 带前缀/后缀 -->
  <t-input v-model="searchValue">
    <template #prefix-icon><SearchIcon /></template>
  </t-input>

  <!-- 文本域 -->
  <t-textarea
    v-model="textareaValue"
    placeholder="请输入多行文本"
    :maxlength="200"
    :autosize="{ minRows: 3, maxRows: 6 }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input, Textarea } from 'tdesign-vue-next';
import { SearchIcon } from 'tdesign-icons-vue-next';

const inputValue = ref('');
const searchValue = ref('');
const textareaValue = ref('');
</script>
```

#### Select 选择器

用于容纳大量选项的信息输入。

```vue
<template>
  <t-select
    v-model="selectValue"
    placeholder="请选择"
    clearable
    :options="options"
  />

  <!-- 多选 -->
  <t-select
    v-model="multipleValue"
    placeholder="请选择多个"
    multiple
    clearable
    :options="options"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Select } from 'tdesign-vue-next';

const selectValue = ref('');
const multipleValue = ref([]);

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
];
</script>
```

#### Radio 单选框

表示从一组互斥选项中选择一个。

```vue
<template>
  <t-radio-group v-model="radioValue">
    <t-radio value="1">选项1</t-radio>
    <t-radio value="2">选项2</t-radio>
    <t-radio value="3">选项3</t-radio>
  </t-radio-group>

  <!-- 按钮样式 -->
  <t-radio-group v-model="radioValue2" variant="default-filled">
    <t-radio-button value="1">选项1</t-radio-button>
    <t-radio-button value="2">选项2</t-radio-button>
    <t-radio-button value="3">选项3</t-radio-button>
  </t-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from 'tdesign-vue-next';

const radioValue = ref('1');
const radioValue2 = ref('1');
</script>
```

#### Checkbox 复选框

允许用户通过点击在选中和未选中状态之间切换。

```vue
<template>
  <t-checkbox v-model="checked">复选框</t-checkbox>

  <t-checkbox-group v-model="checkboxValues">
    <t-checkbox value="1">选项1</t-checkbox>
    <t-checkbox value="2">选项2</t-checkbox>
    <t-checkbox value="3">选项3</t-checkbox>
  </t-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox, CheckboxGroup } from 'tdesign-vue-next';

const checked = ref(false);
const checkboxValues = ref(['1']);
</script>
```

#### Switch 开关

允许用户在两个互斥选项之间切换。

```vue
<template>
  <t-switch v-model="switchValue" />
  
  <t-switch v-model="switchValue2" label="开关文本" />
  
  <t-switch v-model="switchValue3" :customValue="['yes', 'no']" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from 'tdesign-vue-next';

const switchValue = ref(true);
const switchValue2 = ref(false);
const switchValue3 = ref('yes');
</script>
```

#### DatePicker 日期选择器

用于选择日期。

```vue
<template>
  <!-- 单个日期 -->
  <t-date-picker
    v-model="date"
    placeholder="请选择日期"
    clearable
  />

  <!-- 日期范围 -->
  <t-date-range-picker
    v-model="dateRange"
    placeholder="请选择日期范围"
    clearable
  />

  <!-- 日期时间 -->
  <t-date-picker
    v-model="datetime"
    placeholder="请选择日期时间"
    enableTimePicker
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker, DateRangePicker } from 'tdesign-vue-next';

const date = ref('');
const dateRange = ref([]);
const datetime = ref('');
</script>
```

#### Cascader 级联选择器

适用于具有明确层级结构的数据集合。

```vue
<template>
  <t-cascader
    v-model="cascaderValue"
    :options="cascaderOptions"
    placeholder="请选择"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cascader } from 'tdesign-vue-next';

const cascaderValue = ref([]);

const cascaderOptions = [
  {
    label: '北京',
    value: 'beijing',
    children: [
      { label: '海淀区', value: 'haidian' },
      { label: '朝阳区', value: 'chaoyang' }
    ]
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' }
    ]
  }
];
</script>
```

#### Upload 上传

允许用户传输文件或提交自己的内容。

```vue
<template>
  <t-upload
    v-model="files"
    action="https://your-upload-api.com"
    :multiple="true"
    :max="5"
    @success="handleUploadSuccess"
    @fail="handleUploadFail"
  >
    <t-button>
      <template #icon><UploadIcon /></template>
      选择文件
    </t-button>
  </t-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Upload, Button } from 'tdesign-vue-next';
import { UploadIcon } from 'tdesign-icons-vue-next';

const files = ref([]);

const handleUploadSuccess = (response: any) => {
  console.log('上传成功', response);
};

const handleUploadFail = (error: any) => {
  console.error('上传失败', error);
};
</script>
```

#### Form 表单

用于收集、验证和提交数据。

```vue
<template>
  <t-form
    ref="formRef"
    :data="formData"
    :rules="rules"
    @submit="handleSubmit"
  >
    <t-form-item label="用户名" name="username">
      <t-input v-model="formData.username" placeholder="请输入用户名" />
    </t-form-item>

    <t-form-item label="密码" name="password">
      <t-input
        v-model="formData.password"
        type="password"
        placeholder="请输入密码"
      />
    </t-form-item>

    <t-form-item label="邮箱" name="email">
      <t-input v-model="formData.email" placeholder="请输入邮箱" />
    </t-form-item>

    <t-form-item>
      <t-space>
        <t-button theme="primary" type="submit">提交</t-button>
        <t-button type="reset" @click="handleReset">重置</t-button>
      </t-space>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Form, FormItem, Input, Button, Space } from 'tdesign-vue-next';

const formRef = ref(null);

const formData = reactive({
  username: '',
  password: '',
  email: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度至少6位' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { email: true, message: '请输入正确的邮箱格式' }
  ]
};

const handleSubmit = (e: any) => {
  if (e.validateResult === true) {
    console.log('表单提交', formData);
  }
};

const handleReset = () => {
  formRef.value?.reset();
};
</script>
```

### 数据展示组件

#### Table 表格

用于展示和操作结构化数据。

```vue
<template>
  <t-table
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    rowKey="id"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table } from 'tdesign-vue-next';

const loading = ref(false);

const columns = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'email', title: '邮箱', ellipsis: true },
  {
    colKey: 'operation',
    title: '操作',
    width: 150,
    cell: (h: any, { row }: any) => {
      return (
        <t-space>
          <t-link theme="primary" onClick={() => handleEdit(row)}>编辑</t-link>
          <t-link theme="danger" onClick={() => handleDelete(row)}>删除</t-link>
        </t-space>
      );
    }
  }
];

const tableData = ref([
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com' }
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100
});

const handlePageChange = (pageInfo: any) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
};

const handleEdit = (row: any) => {
  console.log('编辑', row);
};

const handleDelete = (row: any) => {
  console.log('删除', row);
};
</script>
```

#### Card 卡片

最基本的卡片容器。

```vue
<template>
  <t-card title="卡片标题" :bordered="true">
    <p>卡片内容</p>
    <template #actions>
      <t-button theme="primary">操作</t-button>
    </template>
  </t-card>

  <!-- 带封面的卡片 -->
  <t-card
    :cover="coverImage"
    title="产品名称"
    description="产品描述信息"
  >
    <p>详细内容</p>
  </t-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, Button } from 'tdesign-vue-next';

const coverImage = ref('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0');
</script>
```

#### List 列表

使用连续的列展示多行元素。

```vue
<template>
  <t-list :split="true">
    <t-list-item v-for="item in listData" :key="item.id">
      <t-list-item-meta
        :title="item.title"
        :description="item.description"
        :image="item.image"
      />
      <template #action>
        <t-link theme="primary">查看</t-link>
      </template>
    </t-list-item>
  </t-list>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { List } from 'tdesign-vue-next';

const listData = ref([
  {
    id: 1,
    title: '标题1',
    description: '描述1',
    image: 'https://placehold.co/80x80'
  },
  {
    id: 2,
    title: '标题2',
    description: '描述2',
    image: 'https://placehold.co/80x80'
  }
]);
</script>
```

#### Tag 标签

用于标记、分类和选择。

```vue
<template>
  <t-space>
    <t-tag>默认标签</t-tag>
    <t-tag theme="primary">主要标签</t-tag>
    <t-tag theme="success">成功标签</t-tag>
    <t-tag theme="warning">警告标签</t-tag>
    <t-tag theme="danger">危险标签</t-tag>
    <t-tag closable @close="handleClose">可关闭</t-tag>
  </t-space>
</template>

<script setup lang="ts">
import { Tag, Space } from 'tdesign-vue-next';

const handleClose = () => {
  console.log('标签关闭');
};
</script>
```

#### Avatar 头像

用于以图标、图片或字符的形式展示用户或对象信息。

```vue
<template>
  <t-space>
    <t-avatar>张</t-avatar>
    <t-avatar :image="avatarUrl" />
    <t-avatar size="large">大</t-avatar>
    <t-avatar shape="square">方</t-avatar>
    
    <!-- 头像组 -->
    <t-avatar-group>
      <t-avatar>A</t-avatar>
      <t-avatar>B</t-avatar>
      <t-avatar>C</t-avatar>
    </t-avatar-group>
  </t-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar, AvatarGroup, Space } from 'tdesign-vue-next';

const avatarUrl = ref('https://placehold.co/40x40');
</script>
```

#### Badge 徽章

显示在图标或文本右上角的徽章。

```vue
<template>
  <t-space size="large">
    <t-badge :count="5">
      <t-button>消息</t-button>
    </t-badge>

    <t-badge :count="99" :maxCount="99">
      <t-button>通知</t-button>
    </t-badge>

    <t-badge dot>
      <t-button>提醒</t-button>
    </t-badge>
  </t-space>
</template>

<script setup lang="ts">
import { Badge, Button, Space } from 'tdesign-vue-next';
</script>
```

#### Progress 进度条

用于展示操作的当前进度。

```vue
<template>
  <t-progress :percentage="30" />
  <t-progress :percentage="60" theme="success" />
  <t-progress :percentage="80" theme="warning" />
  <t-progress :percentage="100" theme="success" />
  
  <!-- 圆形进度条 -->
  <t-progress type="circle" :percentage="75" />
</template>

<script setup lang="ts">
import { Progress } from 'tdesign-vue-next';
</script>
```

#### Loading 加载

表示数据加载状态。

```vue
<template>
  <t-loading :loading="loading">
    <div style="height: 200px;">
      <p>这是内容区域</p>
    </div>
  </t-loading>

  <!-- 全屏加载 -->
  <t-button @click="showFullLoading">显示全屏加载</t-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Loading, Button } from 'tdesign-vue-next';

const loading = ref(false);

const showFullLoading = () => {
  const loading = Loading({
    fullscreen: true,
    text: '加载中...'
  });

  setTimeout(() => {
    loading.hide();
  }, 2000);
};
</script>
```

#### Skeleton 骨架屏

表示数据加载状态。

```vue
<template>
  <t-skeleton :loading="loading" :rowCol="skeletonRowCol">
    <t-card title="实际内容">
      <p>这是加载完成后显示的实际内容</p>
    </t-card>
  </t-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Skeleton, Card } from 'tdesign-vue-next';

const loading = ref(true);

const skeletonRowCol = [
  { width: '100%', height: '30px' },
  { width: '80%', height: '30px' },
  { width: '60%', height: '30px' }
];

// 模拟加载
setTimeout(() => {
  loading.value = false;
}, 2000);
</script>
```

#### Tree 树

用于容纳具有父子关系的结构化内容。

```vue
<template>
  <t-tree
    :data="treeData"
    :expandAll="true"
    :activable="true"
    :checkable="true"
    @change="handleTreeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tree } from 'tdesign-vue-next';

const treeData = ref([
  {
    value: '1',
    label: '一级节点1',
    children: [
      { value: '1-1', label: '二级节点1-1' },
      { value: '1-2', label: '二级节点1-2' }
    ]
  },
  {
    value: '2',
    label: '一级节点2',
    children: [
      { value: '2-1', label: '二级节点2-1' },
      { value: '2-2', label: '二级节点2-2' }
    ]
  }
]);

const handleTreeChange = (value: any, context: any) => {
  console.log('树变化', value, context);
};
</script>
```

#### Collapse 折叠面板

可以对更多或更复杂的内容进行分组。

```vue
<template>
  <t-collapse v-model="activeNames" :defaultExpandAll="false">
    <t-collapse-panel value="1" header="面板标题1">
      <p>面板1的内容</p>
    </t-collapse-panel>
    <t-collapse-panel value="2" header="面板标题2">
      <p>面板2的内容</p>
    </t-collapse-panel>
    <t-collapse-panel value="3" header="面板标题3">
      <p>面板3的内容</p>
    </t-collapse-panel>
  </t-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, CollapsePanel } from 'tdesign-vue-next';

const activeNames = ref(['1']);
</script>
```

#### Timeline 时间线

用于垂直展示时间流信息。

```vue
<template>
  <t-timeline>
    <t-timeline-item label="2024-01-01" dot-color="primary">
      <p>事件1描述</p>
    </t-timeline-item>
    <t-timeline-item label="2024-01-02" dot-color="success">
      <p>事件2描述</p>
    </t-timeline-item>
    <t-timeline-item label="2024-01-03" dot-color="warning">
      <p>事件3描述</p>
    </t-timeline-item>
    <t-timeline-item label="2024-01-04" dot-color="danger">
      <p>事件4描述</p>
    </t-timeline-item>
  </t-timeline>
</template>

<script setup lang="ts">
import { Timeline, TimelineItem } from 'tdesign-vue-next';
</script>
```

### 反馈组件

#### Dialog 对话框

在页面中打开一个临时窗口。

```vue
<template>
  <t-button @click="visible = true">打开对话框</t-button>

  <t-dialog
    v-model:visible="visible"
    header="对话框标题"
    confirmBtn="确认"
    cancelBtn="取消"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <p>对话框内容</p>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, Button } from 'tdesign-vue-next';

const visible = ref(false);

const handleConfirm = () => {
  console.log('确认');
  visible.value = false;
};

const handleCancel = () => {
  console.log('取消');
  visible.value = false;
};
</script>
```

#### Drawer 抽屉

从屏幕边缘滑入的浮层面板。

```vue
<template>
  <t-button @click="drawerVisible = true">打开抽屉</t-button>

  <t-drawer
    v-model:visible="drawerVisible"
    header="抽屉标题"
    :placement="'right'"
    :size="'500px'"
  >
    <p>抽屉内容</p>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Drawer, Button } from 'tdesign-vue-next';

const drawerVisible = ref(false);
</script>
```

#### Message 消息

对用户操作的轻量级全局反馈。

```vue
<template>
  <t-space>
    <t-button @click="showSuccess">成功消息</t-button>
    <t-button @click="showWarning">警告消息</t-button>
    <t-button @click="showError">错误消息</t-button>
    <t-button @click="showInfo">信息消息</t-button>
  </t-space>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';

const showSuccess = () => {
  MessagePlugin.success('操作成功！');
};

const showWarning = () => {
  MessagePlugin.warning('警告信息！');
};

const showError = () => {
  MessagePlugin.error('操作失败！');
};

const showInfo = () => {
  MessagePlugin.info('提示信息！');
};
</script>
```

#### Notification 通知

轻量级全局消息提示和确认机制。

```vue
<template>
  <t-button @click="showNotification">显示通知</t-button>
</template>

<script setup lang="ts">
import { NotificationPlugin } from 'tdesign-vue-next';

const showNotification = () => {
  NotificationPlugin.success({
    title: '通知标题',
    content: '这是通知的内容描述',
    duration: 3000,
    placement: 'top-right'
  });
};
</script>
```

#### Popconfirm 气泡确认框

用于二次确认场景的浮层确认框。

```vue
<template>
  <t-popconfirm
    content="确定要删除吗？"
    @confirm="handleDelete"
  >
    <t-button theme="danger">删除</t-button>
  </t-popconfirm>
</template>

<script setup lang="ts">
import { Popconfirm, Button } from 'tdesign-vue-next';

const handleDelete = () => {
  console.log('确认删除');
};
</script>
```

#### Alert 警告提示

用于容纳需要用户关注的信息。

```vue
<template>
  <t-alert theme="info" message="信息提示" />
  <t-alert theme="success" message="成功提示" />
  <t-alert theme="warning" message="警告提示" />
  <t-alert theme="error" message="错误提示" />
  
  <t-alert
    theme="info"
    message="详细提示"
    description="这是详细的描述信息"
    closable
  />
</template>

<script setup lang="ts">
import { Alert } from 'tdesign-vue-next';
</script>
```

#### Tooltip 文字提示

用于文字提示的气泡框。

```vue
<template>
  <t-tooltip content="这是提示文字">
    <t-button>鼠标悬停</t-button>
  </t-tooltip>

  <t-tooltip placement="top" content="上方提示">
    <t-button>上方</t-button>
  </t-tooltip>

  <t-tooltip placement="bottom" content="下方提示">
    <t-button>下方</t-button>
  </t-tooltip>
</template>

<script setup lang="ts">
import { Tooltip, Button } from 'tdesign-vue-next';
</script>
```

---

## 图标系统

### TDesign 图标库

TDesign 提供了丰富的图标资源，通过 `tdesign-icons-vue-next` 包使用。

### 使用方式

```vue
<template>
  <!-- 直接使用图标组件 -->
  <HomeIcon />
  <UserIcon />
  <SearchIcon />
  
  <!-- 设置图标大小和颜色 -->
  <HomeIcon :size="24" color="#0052d9" />
  
  <!-- 在按钮中使用 -->
  <t-button>
    <template #icon><AddIcon /></template>
    添加
  </t-button>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UserIcon,
  SearchIcon,
  AddIcon
} from 'tdesign-icons-vue-next';
</script>
```

### 常用图标分类

#### 基础图标

```typescript
import {
  HomeIcon,           // 首页
  UserIcon,           // 用户
  SearchIcon,         // 搜索
  SettingIcon,        // 设置
  AddIcon,            // 添加
  DeleteIcon,         // 删除
  EditIcon,           // 编辑
  CloseIcon,          // 关闭
  CheckIcon,          // 勾选
  ErrorCircleIcon,    // 错误
  InfoCircleIcon,     // 信息
  HelpCircleIcon,     // 帮助
} from 'tdesign-icons-vue-next';
```

#### 方向图标

```typescript
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'tdesign-icons-vue-next';
```

#### 文件图标

```typescript
import {
  FileIcon,
  FolderIcon,
  FilePdfIcon,
  FileExcelIcon,
  FileWordIcon,
  FileImageIcon,
  UploadIcon,
  DownloadIcon,
} from 'tdesign-icons-vue-next';
```

#### Logo 图标

```typescript
import {
  LogoGithubIcon,
  LogoWechatIcon,
  LogoAlipayIcon,
  LogoAppleIcon,
  LogoAndroidIcon,
  LogoChromeIcon,
} from 'tdesign-icons-vue-next';
```

### 结合 Lucide 图标

对于 TDesign 未提供的图标，可以使用 `lucide-vue-next`：

```bash
npm install lucide-vue-next
```

```vue
<template>
  <Camera />
  <Music />
  <Video />
</template>

<script setup lang="ts">
import { Camera, Music, Video } from 'lucide-vue-next';
</script>
```

### 品牌图标（FontAwesome）

```bash
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/vue-fontawesome
```

在 `main.ts` 中注册：

```typescript
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faGithub, faTwitter);

app.component('font-awesome-icon', FontAwesomeIcon);
```

使用：

```vue
<template>
  <font-awesome-icon icon="fa-brands fa-github" />
  <font-awesome-icon icon="fa-brands fa-twitter" />
</template>
```

---

## 样式主题

### CSS 变量定制

TDesign 使用 CSS 变量来管理主题，可以通过覆盖这些变量来定制主题。

### 主要颜色变量

```css
:root {
  /* 品牌色 */
  --td-brand-color: #0052d9;
  --td-brand-color-hover: #366ef4;
  --td-brand-color-active: #003cab;
  
  /* 警告色 */
  --td-warning-color: #e37318;
  --td-warning-color-hover: #fa9550;
  --td-warning-color-active: #be5a00;
  
  /* 错误色 */
  --td-error-color: #d54941;
  --td-error-color-hover: #f6685d;
  --td-error-color-active: #ad352f;
  
  /* 成功色 */
  --td-success-color: #2ba471;
  --td-success-color-hover: #56c08d;
  --td-success-color-active: #008858;
  
  /* 文字颜色 */
  --td-text-color-primary: rgba(0, 0, 0, 0.9);
  --td-text-color-secondary: rgba(0, 0, 0, 0.6);
  --td-text-color-placeholder: rgba(0, 0, 0, 0.4);
  --td-text-color-disabled: rgba(0, 0, 0, 0.26);
  
  /* 背景色 */
  --td-bg-color-page: #eeeeee;
  --td-bg-color-container: #ffffff;
  --td-bg-color-container-hover: #f3f3f3;
  
  /* 边框色 */
  --td-border-level-1-color: #e8e8e8;
  --td-border-level-2-color: #dddddd;
  
  /* 阴影 */
  --td-shadow-1: 0 1px 10px rgba(0, 0, 0, 0.05);
  --td-shadow-2: 0 3px 14px 2px rgba(0, 0, 0, 0.05);
  --td-shadow-3: 0 6px 30px 5px rgba(0, 0, 0, 0.05);
}
```

### 自定义主题示例

在 `src/styles/theme.css` 中：

```css
:root {
  /* 自定义品牌色为紫色 */
  --td-brand-color: #7c3aed;
  --td-brand-color-hover: #8b5cf6;
  --td-brand-color-active: #6d28d9;
  
  /* 自定义圆角 */
  --td-radius-default: 8px;
  
  /* 自定义字体 */
  --td-font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

在 `main.ts` 中引入：

```typescript
import './styles/theme.css';
```

### 暗色主题

```css
[theme-mode="dark"] {
  --td-bg-color-page: #181818;
  --td-bg-color-container: #242424;
  --td-bg-color-container-hover: #2c2c2c;
  
  --td-text-color-primary: rgba(255, 255, 255, 0.9);
  --td-text-color-secondary: rgba(255, 255, 255, 0.6);
  --td-text-color-placeholder: rgba(255, 255, 255, 0.4);
  
  --td-border-level-1-color: #393939;
  --td-border-level-2-color: #4b4b4b;
}
```

---

## 最佳实践

### 1. 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── views/          # 页面
├── router/         # 路由
├── store/          # 状态管理
├── styles/         # 全局样式
│   ├── index.css   # Tailwind CSS
│   └── theme.css   # TDesign 主题定制
├── utils/          # 工具函数
├── App.vue
└── main.ts
```

### 2. 全局配置

在 `src/config/tdesign.ts` 中统一配置：

```typescript
import type { GlobalConfigProvider } from 'tdesign-vue-next';
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN';

export const globalConfig: GlobalConfigProvider = {
  ...zhConfig,
  
  // 全局动画配置
  animation: {
    exclude: [] // 排除不需要动画的组件
  },
  
  // 表格全局配置
  table: {
    // 空数据时的文案
    empty: '暂无数据',
    // 异步加载状态文案
    loadingText: '加载中...'
  },
  
  // 分页全局配置
  pagination: {
    showJumper: true,
    showPageSize: true,
    pageSizeOptions: [10, 20, 50, 100]
  },
  
  // 日历全局配置
  calendar: {
    // 周起始日
    firstDayOfWeek: 1
  }
};
```

### 3. 组件封装

封装常用的业务组件：

```vue
<!-- src/components/TablePage.vue -->
<template>
  <div class="table-page">
    <!-- 搜索栏 -->
    <t-card class="mb-4">
      <t-form :data="searchForm" layout="inline">
        <t-form-item label="关键词">
          <t-input v-model="searchForm.keyword" placeholder="请输入" />
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" @click="handleSearch">搜索</t-button>
            <t-button @click="handleReset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>

    <!-- 工具栏 -->
    <t-card class="mb-4">
      <t-space>
        <t-button theme="primary" @click="handleAdd">
          <template #icon><AddIcon /></template>
          新增
        </t-button>
        <t-button theme="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          <template #icon><DeleteIcon /></template>
          批量删除
        </t-button>
      </t-space>
    </t-card>

    <!-- 表格 -->
    <t-card>
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        rowKey="id"
        @page-change="handlePageChange"
        @select-change="handleSelectChange"
      />
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next';

// 组件逻辑...
</script>
```

### 4. 表单验证

```typescript
// src/utils/formRules.ts
export const formRules = {
  required: (message = '此项为必填') => ({
    required: true,
    message
  }),
  
  email: (message = '请输入正确的邮箱格式') => ({
    email: true,
    message
  }),
  
  phone: (message = '请输入正确的手机号') => ({
    pattern: /^1[3-9]\d{9}$/,
    message
  }),
  
  minLength: (min: number, message?: string) => ({
    min,
    message: message || `长度不能少于${min}位`
  }),
  
  maxLength: (max: number, message?: string) => ({
    max,
    message: message || `长度不能超过${max}位`
  })
};

// 使用
import { formRules } from '@/utils/formRules';

const rules = {
  username: [
    formRules.required('请输入用户名'),
    formRules.minLength(3),
    formRules.maxLength(20)
  ],
  email: [
    formRules.required('请输入邮箱'),
    formRules.email()
  ],
  phone: [
    formRules.required('请输入手机号'),
    formRules.phone()
  ]
};
```

### 5. 响应式设计

结合 Tailwind CSS 和 TDesign：

```vue
<template>
  <div class="container mx-auto px-4">
    <t-row :gutter="[16, 16]">
      <t-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in items" :key="item.id">
        <t-card :title="item.title" class="h-full">
          <p>{{ item.content }}</p>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>
```

### 6. 性能优化

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';

// 使用 shallowRef 优化大数据表格
const tableData = shallowRef([]);

// 使用 computed 缓存计算结果
const filteredData = computed(() => {
  return tableData.value.filter(item => item.status === 'active');
});

// 虚拟滚动处理大列表
</script>

<template>
  <t-table
    :data="filteredData"
    :max-height="600"
    :virtual-scroll="{ threshold: 100 }"
  />
</template>
```

### 7. TypeScript 类型定义

```typescript
// types/table.ts
export interface TableColumn {
  colKey: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  fixed?: 'left' | 'right';
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

// 使用
import type { TableColumn, PaginationConfig } from '@/types/table';

const columns: TableColumn[] = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'name', title: '姓名', width: 120 }
];

const pagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0
};
```

### 8. 国际化

```typescript
// i18n/zh-CN.ts
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    submit: '提交',
    reset: '重置',
    search: '搜索',
    add: '新增',
    edit: '编辑',
    delete: '删除'
  },
  message: {
    deleteSuccess: '删除成功',
    saveSuccess: '保存成功',
    operationSuccess: '操作成功'
  }
};
```

---

## 注意事项

### 1. 依赖版本

确保以下依赖版本匹配：

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "tdesign-vue-next": "^1.13.1",
    "tdesign-icons-vue-next": "^0.3.6"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.17"
  }
}
```

### 2. 样式引入顺序

```typescript
// main.ts
import 'tdesign-vue-next/es/style/index.css'; // TDesign 样式
import './styles/index.css'; // Tailwind CSS
import './styles/theme.css'; // 自定义主题
```

### 3. 按需引入优化

使用 Vite 的自动按需引入插件：

```bash
npm install unplugin-vue-components -D
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })]
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })]
    })
  ]
});
```

### 4. 避免样式冲突

使用 `scoped` 样式或 CSS Modules：

```vue
<style scoped>
.my-custom-button {
  /* 自定义样式不会影响 TDesign 组件 */
}
</style>
```

### 5. 错误处理

```typescript
import { MessagePlugin } from 'tdesign-vue-next';

const handleError = (error: any) => {
  console.error('操作失败:', error);
  MessagePlugin.error(error.message || '操作失败，请稍后重试');
};
```

---

## 参考资源

- [TDesign Vue Next 官方文档](https://tdesign.tencent.com/vue-next/overview)
- [TDesign 设计规范](https://tdesign.tencent.com/design/overview)
- [TDesign GitHub 仓库](https://github.com/Tencent/tdesign-vue-next)
- [在线演示和示例](https://tdesign.tencent.com/vue-next/components/overview)

---

## 更新日志

- **2024-12**: 基于 TDesign Vue Next 1.13.1 版本编写
- 包含所有主要组件的使用示例
- 添加 TypeScript 类型支持
- 整合 Tailwind CSS 最佳实践

---

**Happy Coding! 🎉**
