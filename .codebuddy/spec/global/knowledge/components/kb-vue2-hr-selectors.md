# Vue2 人事基础选择器组件库完整说明书

> **文档说明**: 本文档适用于vue2.x版本使用，包含所有组件的完整 API 文档，包括全部属性、方法、事件等详细信息。

---

## 快速开始

### 安装

sdc-webui-vue 组件库基于 Tdesign-vue，使用时会默认安装 tdesign-vue 正式版。

```bash
npm install @tencent/sdc-webui-vue --save
```

> **重要提示**: 
> - 如果在 Vue 2.7 中使用，请在 `package.json` 中指定 tdesign-vue 版本号: `"tdesign-vue": "1.10.3-naruto"`
> - 确保 `vue` 版本与 `vue-template-compiler` 版本一致

### 完整引入

在 `main.js` 中引入所有组件:

```javascript
import Vue from 'vue';
import SDCWebUIVue from '@tencent/sdc-webui-vue';
import '@tencent/sdc-webui-vue/lib/theme-grace/index.css';
import App from './App.vue';

Vue.use(SDCWebUIVue);

new Vue({
  el: '#app',
  render: (h) => h(App)
});
```

### 按需引入

**步骤 1**: 安装 babel-plugin-component

```bash
npm install babel-plugin-component -D
```

**步骤 2**: 配置 `.babelrc`

```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "@tencent/sdc-webui-vue",
        "styleLibraryName": "theme-grace"
      }
    ]
  ]
}
```

**步骤 3**: 在 `main.js` 中按需引入

```javascript
import Vue from 'vue';
import { 
  StaffSelector, 
  UnitSelector, 
  PostSelector,
  AreaSelector,
  CitySelector,
  PositionLevel,
  PositionCascader,
  ManageSubjectSelector,
  StaffSubtypeSelector,
  DictSelector,
  ContractCompanySelector,
  OfficeBuildingSelector
} from '@tencent/sdc-webui-vue';
import App from './App.vue';

// 方式 1: 使用 Vue.component
Vue.component(StaffSelector.name, StaffSelector);
Vue.component(UnitSelector.name, UnitSelector);
Vue.component(PostSelector.name, PostSelector);
// ... 其他组件

// 方式 2: 使用 Vue.use
// Vue.use(StaffSelector);
// Vue.use(UnitSelector);
// Vue.use(PostSelector);

new Vue({
  el: '#app',
  render: (h) => h(App)
});
```

### 常见问题

**Q1: 启动报错 `Vue packages version mismatch — Vue@2.6.14 - vue-template-compiler@2.7.16`**

A: 这是由于 `vue` 版本与 `vue-template-compiler` 版本不一致导致的。
- 如果项目用 Vue 2.6，将 `vue-template-compiler` 指定为与 `vue` 版本一致
- 如果项目用 Vue 2.7，在 `package.json` 中指定: `"tdesign-vue": "1.10.3-naruto"`

**Q2: 页面空白，控制台报错 `inject() can only be used inside setup()`**

A: 说明 `Vue` 版本与 `tdesign-vue` 版本不匹配。在 `package.json` 中指定: `"tdesign-vue": "1.10.3-naruto"`，然后重新安装。

---

## 目录

1. [组织选择器 (UnitSelector)](#1-组织选择器-unitselector)
2. [员工选择器 (StaffSelector)](#2-员工选择器-staffselector)
3. [岗位选择器 (PostSelector)](#3-岗位选择器-postselector)
4. [工作地选择器 (AreaSelector)](#4-工作地选择器-areaselector)
5. [省市选择器 (CitySelector)](#5-省市选择器-cityselector)
6. [职级选择器 (PositionLevel)](#6-职级选择器-positionlevel)
7. [职位级联选择器 (PositionCascader)](#7-职位级联选择器-positioncascader)
8. [管理主体选择器 (ManageSubjectSelector)](#8-管理主体选择器-managesubjectselector)
9. [员工子类型选择器 (StaffSubtypeSelector)](#9-员工子类型选择器-staffsubtypeselector)
10. [基础字典选择器 (DictSelector)](#10-基础字典选择器-dictselector)
11. [合同公司选择器 (ContractCompanySelector)](#11-合同公司选择器-contractcompanyselector)
12. [办公大厦选择器 (OfficeBuildingSelector)](#12-办公大厦选择器-officebuildingselector)

---

## 1. 组织选择器 (UnitSelector)

### 基本信息
- **组件名**: `sdc-unit-selector`
- **文档路径**: `/unit-selector`
- **完整文档**: `/Users/cxyxhhuang/Desktop/code/sdc-webui-vue/docs/unit-selector.md`
- **用途**: 选择组织/部门

### 核心功能
- 支持单选/多选模式
- 提供两种选择方式: 关键字搜索 + 组织树懒加载
- Tag 展示已选组织
- 支持设置根组织、限制选择范围
- 支持文本域模式(多行展示)
- ⚠️ 请避免在选择后动态改变选择器的宽度，这会造成 Tag 区域样式显示问题
- ⚠️ 由于选择器所需的组织选项至少需要包含 `UnitID`、`UnitName`、`UnitFullName` 等属性，而本地没有完整的组织数据，因此不能简单通过修改 `v-model` 值来设置初始选择项，请使用 `setSelected` 方法

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | String/Number/Array | — | — |
| unitID | 根组织ID | Number/Array | — | — |
| multiple | 是否多选 | Boolean | — | false |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | medium/small | — |
| search | 是否模糊搜索 | Boolean | — | true |
| disabled | 是否禁用 | Boolean | — | false |
| textarea | 文本框 (上下布局) | Boolean | — | false |
| textareaModel | 文本框 (左右布局) | Boolean | — | false |
| height | 文本框高度 | Number/String | — | 130 |
| showTotal | 多选且非textarea模式下，是否显示后置的已选数量 | Boolean | — | true |
| placeholder | 占位符 | String | — | — |
| selectClass | 选择框自定义类名 | String | — | — |
| modalClass | 弹窗自定义类名 | String | — | — |
| modalWidth | 弹窗自定义宽度 | String | 参考Modal弹窗组件width | '750px' |
| modalAppendToBody | 弹窗自身是否插入至 body 元素上 | Boolean | — | false |
| showLastLevels | 是否只展示最后一级 | Boolean | — | true |
| showFullTag | 是否在输入框中展示完整的tag | Boolean | — | false |
| filterEnableFlag | 是否只包含有效组织 | Boolean | — | true |
| includeVirtualUnit | 是否包含虚拟组织 | Boolean | — | false |
| includeUnitSortIDs | 限制组织选择范围 | Number Array | 0-公司、6-bg、8-线、1-部门、7-中心、2-组 | — |
| isLimitUnitExpand | 是否限制展开范围中最小级别的组织, 仅限制组织选择范围时有效 | Boolean | — | true |
| disabledUnitIdList | 禁用组织选项的操作 | Array | — | [] |
| defaultExpandedKeys | 一级默认展开的节点的unitID的数组 | Array | — | [] |
| props | 数据字段别名，具体见下表 | Object | — | — |
| getDataList | 通过关键字获取对应组织的方法 | Function | — | — |
| getTreeData | 通过组织标识获取其子组织的方法 | Function | — | — |
| titleTip | 弹窗标题旁提示文字 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| setSelected | 用于外部直接设置选中项 | 包含UnitName、UnitID、UnitFullName属性的对象或其组成的数组 |
| clearSelected | 用于清空选中项 | — |

### props 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| unitID | 组织ID字段名 | String | — | 'UnitID' |
| unitName | 组织名称字段名 | String | — | 'UnitName' |
| unitFullName | 组织完整名称字段名 | String | — | 'UnitFullName' |
| unitOwnershipTypeId | 组织管理归属类型Id字段名 | String | — | 'UnitOwnershipTypeId' |
| unitOwnershipTypeNameCn | 组织管理归属类型名称-中文字段名 | String | — | 'UnitOwnershipTypeNameCn' |
| unitOwnershipTypeNameEn | 组织管理归属类型名称-英文字段名 | String | — | 'UnitOwnershipTypeNameEn' |
| unitIDPath | 完整组织ID路径 | String | — | 'UnitIDPath' |
| unitLocationCode | 完整组织code编码 | String | — | 'UnitLocationCode' |

### 使用示例

#### 示例 1: 单选模式

```vue
<template>
  <sdc-unit-selector
    v-model="unitId"
    placeholder="请选择组织"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      unitId: ''
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的组织:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选模式

```vue
<template>
  <sdc-unit-selector
    v-model="unitIds"
    :multiple="true"
    placeholder="请选择组织"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      unitIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的组织:', selected)
    }
  }
}
</script>
```

#### 示例 3: 限制组织范围（仅公司和BG）

```vue
<template>
  <sdc-unit-selector
    v-model="unitId"
    :include-unit-sort-i-d-s="[0, 6]"
    placeholder="请选择公司或BG"
  />
</template>

<script>
export default {
  data() {
    return {
      unitId: ''
    }
  }
}
</script>
```

#### 示例 4: 文本域模式 + 设置初始值

```vue
<template>
  <sdc-unit-selector
    ref="unitSelector"
    v-model="unitIds"
    :multiple="true"
    :textarea="true"
    :height="200"
    placeholder="请选择组织"
  />
</template>

<script>
export default {
  data() {
    return {
      unitIds: []
    }
  },
  mounted() {
    // 设置初始值
    this.$refs.unitSelector.setSelected([
      { UnitID: 12345, UnitName: '研发部', UnitFullName: '公司/事业群/研发部' },
      { UnitID: 67890, UnitName: '测试部', UnitFullName: '公司/事业群/测试部' }
    ])
  }
}
</script>
```

---

## 2. 员工选择器 (StaffSelector)

### 基本信息
- **组件名**: `sdc-staff-selector`
- **文档路径**: `/staff-selector`
- **用途**: 选择员工

### 核心功能
- 支持单选/多选模式
- 提供三种选择方式: 关键字搜索 + 员工树懒加载 + 粘贴姓名批量选择
- 支持限制选项范围 (按组织/职级/员工类型/合同公司等)
- 支持曾用名查询
- 支持包含离职/待入职/兼岗员工

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | String/Number/Array | — | — |
| multiple | 是否多选 | Boolean | — | false |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | medium/small | — |
| search | 是否模糊搜索 | Boolean | — | true |
| disabled | 是否禁用 | Boolean | — | false |
| textarea | 文本框 (上下布局) | Boolean | — | false |
| textareaModel | 文本框 (左右布局) | Boolean | — | false |
| height | 文本框高度 | Number/String | — | 130 |
| showTotal | 多选且非textarea模式下，是否显示后置的已选数量 | Boolean | — | true |
| showFullTag | 是否在输入框中展示完整的tag | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| selectClass | 选择框自定义类名 | String | — | — |
| modalClass | 弹窗自定义类名 | String | — | — |
| modalWidth | 弹窗自定义宽度 | String | 参考Modal弹窗组件width | '750px' |
| modalAppendToBody | 弹窗自身是否插入至 body 元素上 | Boolean | — | false |
| includeDimission | 是否包含离职员工 | Boolean | — | false |
| includeOnBoarding | 是否包含待入职员工 | Boolean | — | false |
| includePartTimePost | 是否显示组织下的兼岗员工 | Boolean | — | false |
| useFormerNameSearch | 是否使用曾用名搜索 | Boolean | — | false |
| timeliness | 曾用名搜索获取数据的时效性，T0代表T+0，T1代表T+1 | String | T0/T1 | T0 |
| defaultExpandedKeys | 一级默认展开的节点的unitID的数组 | Array | — | [] |
| range | 限制选项范围，具体见下表 | Object | — | — |
| props | 数据字段别名，具体见下表 | Object | — | — |
| blurClearInputValue | 失焦时清除输入值 | Boolean | — | true |
| getDataList | 通过关键字获取对应员工的方法 | Function | — | — |
| getPasteResult | 通过姓名字段串获取对应员工的方法 | Function | — | — |
| getTreeData | 通过组织标识获取其子组织、子员工的方法 | Function | — | — |
| getChildrenData | 通过组织标识获取其下所有员工的方法 | Function | — | — |
| titleTip | 弹窗标题旁提示文字 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| setSelected | 用于外部直接设置选中项 | 包含StaffName、StaffID、Avator属性的对象或其组成的数组 |
| clearSelected | 用于清空选中项 | — |
| getInputValue | 用于获取当前筛选框输入的值 | — |

### range 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| unitID | 组织ID, 仅选择该组织下的子级员工, 会先查对应的组织 | Number/Array | — | — |
| contractCompanyID | 合同公司ID, 仅选择该合同下的员工 | Number | — | — |
| contractCompanyIdList | 合同公司ID集合, 仅选择该合同下的员工 | Array | — | — |
| manageUnitIdList | 管理主体ID集合, 仅选择该管理主体下的员工 | Array | — | — |
| isContainSubStaff | 是否包含子级员工 | Boolean | — | false |
| managerPositionLevelIdList | 职级ID集合，仅选择对应职级的员工 | Array | — | — |
| staffTypeIdList | 员工类型ID集合, 仅选择该员工类型的员工 | Array | — | — |

### props 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| staffID | 员工ID字段名 | String | — | 'StaffID' |
| staffName | 员工姓名字段名 | String | — | 'StaffName' |
| engName | 员工英文名字段名 | String | — | 'EngName' |
| avatar | 员工头像字段名 | String | — | 'Avatar' |
| unitID | 组织ID字段名 | String | — | 'UnitID' |
| unitName | 组织名称字段名 | String | — | 'UnitName' |
| unitFullName | 组织全路径字段名 | String | — | 'UnitFullName' |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-staff-selector
    v-model="staffId"
    placeholder="请选择员工"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      staffId: ''
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的员工:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制组织范围

```vue
<template>
  <sdc-staff-selector
    v-model="staffIds"
    :multiple="true"
    :range="{ unitID: 12345, isContainSubStaff: true }"
    placeholder="请选择员工"
  />
</template>

<script>
export default {
  data() {
    return {
      staffIds: []
    }
  }
}
</script>
```

#### 示例 3: 包含离职员工 + 曾用名搜索

```vue
<template>
  <sdc-staff-selector
    v-model="staffId"
    :include-dimission="true"
    :use-former-name-search="true"
    placeholder="请选择员工（可搜索曾用名）"
  />
</template>

<script>
export default {
  data() {
    return {
      staffId: ''
    }
  }
}
</script>
```

#### 示例 4: 限制职级和员工类型

```vue
<template>
  <sdc-staff-selector
    ref="staffSelector"
    v-model="staffIds"
    :multiple="true"
    :range="{
      managerPositionLevelIdList: [10, 11, 12],
      staffTypeIdList: [1, 2]
    }"
    placeholder="请选择员工"
  />
</template>

<script>
export default {
  data() {
    return {
      staffIds: []
    }
  },
  mounted() {
    // 设置初始值
    this.$refs.staffSelector.setSelected([
      { StaffID: 111, StaffName: '张三', Avatar: 'http://...' },
      { StaffID: 222, StaffName: '李四', Avatar: 'http://...' }
    ])
  }
}
</script>
```

---

## 3. 岗位选择器 (PostSelector)

### 基本信息
- **组件名**: `sdc-post-selector`
- **文档路径**: `/post-selector`
- **用途**: 选择岗位

### 核心功能
- 支持单选/多选模式
- 提供关键字搜索 + 岗位树懒加载
- 支持限制选项范围 (按组织)
- 支持显示岗位ID

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | String/Number/Array | — | — |
| multiple | 是否多选 | Boolean | — | false |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | medium/small | — |
| search | 是否模糊搜索 | Boolean | — | true |
| disabled | 是否禁用 | Boolean | — | false |
| textarea | 文本框 (上下布局) | Boolean | — | false |
| textareaModel | 文本框 (左右布局) | Boolean | — | false |
| height | 文本框高度 | Number/String | — | 130 |
| showTotal | 多选且非textarea模式下，是否显示后置的已选数量 | Boolean | — | true |
| showPostID | 筛选时是否展示PostID | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| showLastLevels | 是否只展示最后一级 | Boolean | — | true |
| showFullTag | 是否在输入框中展示完整的tag | Boolean | — | false |
| filterEnableFlag | 是否只包含有效岗位 | Boolean | — | true |
| defaultExpandedKeys | 一级默认展开的节点的unitID的数组 | Array | — | [] |
| range | 限制选项范围，具体见下表 | Object | — | — |
| props | 数据字段别名，具体见下表 | Object | — | — |
| selectClass | 选择框自定义类名 | String | — | — |
| modalClass | 弹窗自定义类名 | String | — | — |
| modalWidth | 弹窗自定义宽度 | String | 参考Modal弹窗组件width | '800px' |
| modalAppendToBody | 弹窗自身是否插入至 body 元素上 | Boolean | — | false |
| getDataList | 通过关键字获取对应岗位的方法 | Function | — | — |
| getTreeData | 通过组织标识获取其子组织、岗位的方法 | Function | — | — |
| getChildrenData | 通过组织标识获取其下所有岗位的方法 | Function | — | — |
| titleTip | 弹窗标题旁提示文字 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| setSelected | 用于外部直接设置选中项 | 包含PostName、PostID、PostFullName属性的对象或其组成的数组 |
| clearSelected | 用于清空选中项 | — |

### range 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| unitID | 组织ID, 仅选择该组织下的子级岗位, 会先查对应的组织 | Number/Array | — | — |
| isContainSubUnit | 是否包含子级岗位 | Boolean | — | true |
| NotContainVirtualUnit | 是否包含虚拟组织岗位 | Boolean | — | false |
| staffTypeIdList | 员工类型ID | Array | — | — |

### props 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| postID | 岗位ID字段名 | String | — | 'PostID' |
| postName | 岗位名称字段名 | String | — | 'PostName' |
| postFullName | 岗位完整名称字段名 | String | — | 'PostFullName' |
| unitID | 组织ID字段名 | String | — | 'UnitID' |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-post-selector
    v-model="postId"
    placeholder="请选择岗位"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      postId: ''
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的岗位:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制组织范围

```vue
<template>
  <sdc-post-selector
    v-model="postIds"
    :multiple="true"
    :range="{ unitID: 12345, isContainSubUnit: true }"
    placeholder="请选择岗位"
  />
</template>

<script>
export default {
  data() {
    return {
      postIds: []
    }
  }
}
</script>
```

#### 示例 3: 显示岗位ID

```vue
<template>
  <sdc-post-selector
    v-model="postId"
    :show-post-i-d="true"
    placeholder="请选择岗位"
  />
</template>

<script>
export default {
  data() {
    return {
      postId: ''
    }
  }
}
</script>
```

---

## 4. 工作地选择器 (AreaSelector)

### 基本信息
- **组件名**: `sdc-area-selector`
- **文档路径**: `/area-selector`
- **用途**: 选择工作地点

### 核心功能
- 支持单选/多选模式
- 级联选择器逐级查看并选择
- 支持多语言 (中文/英文)
- 支持限制展示的大区或国家
- 支持选择任意一级选项
- 支持精简全选数据

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| lang | 语言 | String | en | — |
| level | 层级数 | Number | 1、2、3 | 3 |
| disabled | 是否禁用 | Boolean | — | false |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| excessTagsDisplayType | 标签超出时的呈现方式，有两种：横向滚动显示 和 换行显示 | String | scroll/break-line | scroll |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| checkStrictly | 父子节点选中状态不再关联，可各自选中或取消 | Boolean | — | false |
| valueMode | 选中值模式 | String | onlyLeaf/parentFirst/all | onlyLeaf |
| includeRegionList | 可展示的大区集合 | Array | — | [100, 200, 300, 400, 500] |
| includeCountryList | 可展示的国家集合（默认全展示） | Array | — | [] |
| map | 映射配置，具体见下表 | Object | — | — |
| getLocationList | 获取层级工作地数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName(完整名称)、trimmedName(每一级全名称)、trimmedId(每一级全id) |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |
| getTrimmedData | 精简获取全选选中的节点，返回值为Promise, resolve中返回`{trimmedIdList:[], trimmedNameList:[]}` | — |
| setTrimmedData | 通过精简设置选中的节点 | trimmedIdList |
| setDataByIdList | checkStrictly模式通过id集合转换成fullpath id全路径回显 | Array |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'item_id' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'item_name_cn' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### 使用示例

#### 示例 1: 基础单选（3级）

```vue
<template>
  <sdc-area-selector
    v-model="areaIds"
    placeholder="请选择工作地"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      areaIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的工作地:', selected)
      // selected 包含: label, value, path, fullName, trimmedName, trimmedId
    }
  }
}
</script>
```

#### 示例 2: 多选 + 可选任意级

```vue
<template>
  <sdc-area-selector
    v-model="areaIds"
    :map="{ multiple: true }"
    :check-strictly="true"
    placeholder="请选择工作地"
  />
</template>

<script>
export default {
  data() {
    return {
      areaIds: []
    }
  }
}
</script>
```

#### 示例 3: 限制大区和国家

```vue
<template>
  <sdc-area-selector
    v-model="areaIds"
    :include-region-list="[100, 200]"
    :include-country-list="[1, 2, 3]"
    placeholder="请选择工作地"
  />
</template>

<script>
export default {
  data() {
    return {
      areaIds: []
    }
  }
}
</script>
```

#### 示例 4: 精简全选数据

```vue
<template>
  <sdc-area-selector
    ref="areaSelector"
    v-model="areaIds"
    :map="{ multiple: true }"
    placeholder="请选择工作地"
  />
</template>

<script>
export default {
  data() {
    return {
      areaIds: []
    }
  },
  methods: {
    async getTrimmedData() {
      // 获取精简后的选中数据
      const result = await this.$refs.areaSelector.getTrimmedData()
      console.log('精简数据:', result)
      // result: { trimmedIdList: [], trimmedNameList: [] }
    },
    setTrimmedData() {
      // 通过精简数据回显
      this.$refs.areaSelector.setTrimmedData([100, 200, 300])
    }
  }
}
</script>
```

---

## 5. 省市选择器 (CitySelector)

### 基本信息
- **组件名**: `sdc-city-selector`
- **文档路径**: `/city-selector`
- **用途**: 级联选择省份和城市

### 核心功能
- 支持单选/多选模式
- 级联选择器逐级查看
- 支持多语言 (中文/英文)
- 支持搜索功能

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| level | 层级数 | Number | 1、2 | 2 |
| disabled | 是否禁用 | Boolean | — | false |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| map | 映射配置，具体见下表 | Object | — | — |
| promise | 获取层级省市数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-city-selector
    v-model="cityIds"
    placeholder="请选择省市"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      cityIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的省市:', selected)
      // selected 包含: label, value, path, fullName
    }
  }
}
</script>
```

#### 示例 2: 多选 + 英文

```vue
<template>
  <sdc-city-selector
    v-model="cityIds"
    :map="{ multiple: true }"
    lang="en"
    placeholder="Please select city"
  />
</template>

<script>
export default {
  data() {
    return {
      cityIds: []
    }
  }
}
</script>
```

#### 示例 3: 仅选择省份（1级）

```vue
<template>
  <sdc-city-selector
    v-model="provinceIds"
    :level="1"
    placeholder="请选择省份"
  />
</template>

<script>
export default {
  data() {
    return {
      provinceIds: []
    }
  }
}
</script>
```

---

## 6. 职级选择器 (PositionLevel)

### 基本信息
- **组件名**: `sdc-position-level`
- **文档路径**: `/position-level`
- **用途**: 选择管理/专业职级

### 核心功能
- 支持单选/多选模式 (默认多选)
- 支持限制职级选择范围
- 支持多语言 (中文/英文)
- 支持搜索功能

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Boolean/String/Number | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| disabled | 是否禁用 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| range | 限制选项范围，具体见下表 | Object | — | — |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| data | 自定义选项 | Array | — | [] |
| promise | 覆盖组件内部获取选项数据源的默认方法 | Promise | — | — |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| map | 映射配置，具体见下表 | Object | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### range 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| positionSystemTypeIdList | 通道族体系类型Id集合 | Array | — | [0] |
| positionSystemIdList | 通道族体系Id集合 | Array | — | [1] |
| positionClanIdList | 职位族Id集合 | Array | — | — |
| positionLevelIdList | 职级Id集合 | Array | — | — |

### 使用示例

#### 示例 1: 基础多选（默认）

```vue
<template>
  <sdc-position-level
    v-model="levelIds"
    placeholder="请选择职级"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      levelIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的职级:', selected)
    }
  }
}
</script>
```

#### 示例 2: 单选 + 限制管理职级

```vue
<template>
  <sdc-position-level
    v-model="levelId"
    :map="{ multiple: false }"
    :range="{ positionSystemIdList: [1] }"
    placeholder="请选择管理职级"
  />
</template>

<script>
export default {
  data() {
    return {
      levelId: ''
    }
  }
}
</script>
```

#### 示例 3: 多选 + 限制职位族和职级

```vue
<template>
  <sdc-position-level
    v-model="levelIds"
    :range="{
      positionClanIdList: [1, 2, 3],
      positionLevelIdList: [10, 11, 12]
    }"
    placeholder="请选择职级"
  />
</template>

<script>
export default {
  data() {
    return {
      levelIds: []
    }
  }
}
</script>
```

---

## 7. 职位级联选择器 (PositionCascader)

### 基本信息
- **组件名**: `sdc-position-cascader`
- **文档路径**: `/position-cascader`
- **用途**: 级联选择职位

### 核心功能
- 支持单选/多选模式
- 级联选择器逐级查看
- 支持定制需要显示的职位簇
- 支持多语言 (中文/英文)

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| level | 层级数 | Number | 1、2、3 | 3 |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| disabled | 是否禁用 | Boolean | — | false |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showTotal | 是否显示后置的已选数量 | Boolean | — | true |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| includeClans | 由需要包含的职位簇value组成的数组 | Array | — | — |
| map | 映射配置，具体见下表 | Object | — | — |
| getPositionData | 获取层级职位数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### 职位簇 (PostionClan)

| 职位簇值 | 名称 | 职位簇值 | 名称 | 职位簇值 | 名称 |
|---------|------|---------|------|---------|------|
| 1 | 管理族 | 6 | 操作族 | 14 | 产品/项目族（PD） |
| 15 | 管理族（LS） | 17 | 专业族（SC） | 18 | 技术族（TE） |
| 19 | 市场族（MA） | 20 | 客服族 | 22 | 设计族（DG） |
| 101 | Tencent Global | - | - | - | - |

### 使用示例

#### 示例 1: 基础单选（3级）

```vue
<template>
  <sdc-position-cascader
    v-model="positionIds"
    placeholder="请选择职位"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      positionIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的职位:', selected)
      // selected 包含: label, value, path, fullName
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制职位簇

```vue
<template>
  <sdc-position-cascader
    v-model="positionIds"
    :map="{ multiple: true }"
    :include-clans="[1, 18, 22]"
    placeholder="请选择职位（管理族/技术族/设计族）"
  />
</template>

<script>
export default {
  data() {
    return {
      positionIds: []
    }
  }
}
</script>
```

#### 示例 3: 英文模式 + 2级

```vue
<template>
  <sdc-position-cascader
    v-model="positionIds"
    :level="2"
    lang="en"
    placeholder="Please select position"
  />
</template>

<script>
export default {
  data() {
    return {
      positionIds: []
    }
  }
}
</script>
```

---

## 8. 管理主体选择器 (ManageSubjectSelector)

### 基本信息
- **组件名**: `sdc-manage-subject-selector`
- **文档路径**: `/manage-subject-selector`
- **用途**: 选择管理主体

### 核心功能
- 支持单选/多选模式
- 支持限制管理主体选择范围
- 支持多语言 (中文/英文)
- 支持选中值模式

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Boolean/String/Number | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| disabled | 是否禁用 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| range | 限制选项范围，具体见下表 | Object | — | — |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| valueMode | 选中值模式 | String | onlyLeaf/parentFirst/all | onlyLeaf |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| data | 自定义选项 | Array | — | — |
| promise | 覆盖组件内部获取选项数据源的默认方法 | Promise | — | — |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| map | 映射配置，具体见下表 | Object | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### range 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| manageUnitTypeIdList | 管理主体类型Id集合 | Array | — | — |
| manageUnitIdList | 管理主体Id集合 | Array | — | — |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-manage-subject-selector
    v-model="subjectIds"
    placeholder="请选择管理主体"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      subjectIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的管理主体:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制管理主体类型

```vue
<template>
  <sdc-manage-subject-selector
    v-model="subjectIds"
    :map="{ multiple: true }"
    :range="{ manageUnitTypeIdList: [1, 2] }"
    placeholder="请选择管理主体"
  />
</template>

<script>
export default {
  data() {
    return {
      subjectIds: []
    }
  }
}
</script>
```

#### 示例 3: 选中值模式（父节点优先）

```vue
<template>
  <sdc-manage-subject-selector
    v-model="subjectIds"
    :map="{ multiple: true }"
    value-mode="parentFirst"
    placeholder="请选择管理主体"
  />
</template>

<script>
export default {
  data() {
    return {
      subjectIds: []
    }
  }
}
</script>
```

---

## 9. 员工子类型选择器 (StaffSubtypeSelector)

### 基本信息
- **组件名**: `sdc-staff-subtype-selector`
- **文档路径**: `/staff-subtype-selector`
- **用途**: 选择员工的分类子类型

### 核心功能
- 支持单选/多选模式
- 级联选择器逐级查看
- 支持限制展示的员工类型
- 支持多语言 (中文/英文)

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| level | 层级数 | Number | 1、2 | 2 |
| disabled | 是否禁用 | Boolean | — | false |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| includeStaffTypeList | 可展示的员工类型集合（默认全展示） | Array | — | [] |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| valueMode | 选中值模式 | String | onlyLeaf/parentFirst/all | onlyLeaf |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| map | 映射配置，具体见下表 | Object | — | — |
| promise | 获取层级员工子类型数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### 使用示例

#### 示例 1: 基础单选（2级）

```vue
<template>
  <sdc-staff-subtype-selector
    v-model="subtypeIds"
    placeholder="请选择员工子类型"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      subtypeIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的员工子类型:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制员工类型

```vue
<template>
  <sdc-staff-subtype-selector
    v-model="subtypeIds"
    :map="{ multiple: true }"
    :include-staff-type-list="[1, 2, 3]"
    placeholder="请选择员工子类型"
  />
</template>

<script>
export default {
  data() {
    return {
      subtypeIds: []
    }
  }
}
</script>
```

#### 示例 3: 仅选择员工类型（1级）

```vue
<template>
  <sdc-staff-subtype-selector
    v-model="typeIds"
    :level="1"
    placeholder="请选择员工类型"
  />
</template>

<script>
export default {
  data() {
    return {
      typeIds: []
    }
  }
}
</script>
```

---

## 10. 基础字典选择器 (DictSelector)

### 基本信息
- **组件名**: `sdc-dict-selector`
- **文档路径**: `/dict-selector`
- **用途**: 根据字典名称选择对应选项

### 核心功能
- 支持单选/多选模式
- 根据字典类型动态加载选项
- 支持排除特定选项
- 支持自定义数据源
- 支持搜索筛选

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Boolean/String/Number | — | — |
| type | 字典名称 | String/Number | — | — |
| multiple | 是否多选 | Boolean | — | false |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | medium/small | — |
| disabled | 是否禁用 | Boolean | — | false |
| collapse-tags | 多选时是否将选中值按文字的形式展示 | Boolean | — | false |
| tagsLength | 多选时Tag最大展示文字数, 最小1 | Number | — | 13 |
| placeholder | 占位符 | String | — | 请选择 |
| filterable | 是否可搜索选项 | Boolean | — | true |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| no-match-text | 搜索条件无匹配时显示的文字 | String | — | 无匹配数据 |
| exclude | 排除选项 | Array | — | [] |
| data | 自定义选项 | Array | — | [] |
| promise | 覆盖组件内部获取选项数据源的默认方法 | Promise | — | — |
| labelMap | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| valueMap | 选项的值为选项对象的某个属性值 | String | — | 'value' |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| remove-tag | 多选模式下移除tag时触发 | 移除的tag值 |
| clear | 单选模式下用户点击清空按钮时触发 | — |
| blur | 当 input 失去焦点时触发 | (event: Event) |
| focus | 当 input 获得焦点时触发 | (event: Event) |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-dict-selector
    v-model="dictValue"
    type="Gender"
    placeholder="请选择性别"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      dictValue: ''
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的字典值:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选 + 排除选项

```vue
<template>
  <sdc-dict-selector
    v-model="dictValues"
    type="EmployeeStatus"
    :multiple="true"
    :exclude="[0, 9]"
    placeholder="请选择员工状态"
  />
</template>

<script>
export default {
  data() {
    return {
      dictValues: []
    }
  }
}
</script>
```

#### 示例 3: 自定义数据源

```vue
<template>
  <sdc-dict-selector
    v-model="dictValue"
    :data="customData"
    placeholder="请选择"
  />
</template>

<script>
export default {
  data() {
    return {
      dictValue: '',
      customData: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
        { label: '选项3', value: 3 }
      ]
    }
  }
}
</script>
```

#### 示例 4: 自定义字段映射

```vue
<template>
  <sdc-dict-selector
    v-model="dictValue"
    type="CustomDict"
    label-map="name"
    value-map="id"
    placeholder="请选择"
  />
</template>

<script>
export default {
  data() {
    return {
      dictValue: ''
    }
  }
}
</script>
```

---

## 11. 合同公司选择器 (ContractCompanySelector)

### 基本信息
- **组件名**: `sdc-contract-company-selector`
- **文档路径**: `/contract-company-selector`
- **用途**: 选择员工所属合同公司主体

### 核心功能
- 支持单选/多选模式
- 支持多语言 (中文/英文)
- 支持自定义数据源

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | medium/small | — |
| disabled | 是否禁用 | Boolean | — | false |
| lang | 语言 | String | 中文: zh，英文: en | zh |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| map | 映射配置，具体见下表 | Object | — | — |
| promise | 获取合同公司数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| multiple | 是否多选 | Boolean | — | false |
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |

### 使用示例

#### 示例 1: 基础单选

```vue
<template>
  <sdc-contract-company-selector
    v-model="companyIds"
    placeholder="请选择合同公司"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      companyIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的合同公司:', selected)
    }
  }
}
</script>
```

#### 示例 2: 多选模式

```vue
<template>
  <sdc-contract-company-selector
    v-model="companyIds"
    :map="{ multiple: true }"
    placeholder="请选择合同公司"
  />
</template>

<script>
export default {
  data() {
    return {
      companyIds: []
    }
  }
}
</script>
```

#### 示例 3: 英文模式

```vue
<template>
  <sdc-contract-company-selector
    v-model="companyIds"
    lang="en"
    placeholder="Please select contract company"
  />
</template>

<script>
export default {
  data() {
    return {
      companyIds: []
    }
  }
}
</script>
```

---

## 12. 办公大厦选择器 (OfficeBuildingSelector)

### 基本信息
- **组件名**: `sdc-office-building-selector`
- **文档路径**: `/office-building-selector`
- **用途**: 选择办公地点所在大厦

### 核心功能
- 支持单选/多选模式
- 级联选择器逐级查看
- 支持多语言 (中文/英文)
- 支持限制展示的大区/国家/城市

### 属性 (Attributes)

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | Array | — | — |
| width | 输入框宽度 | String/Number | — | — |
| size | 输入框尺寸 | String | small | — |
| lang | 语言 | String | en | — |
| level | 层级数 | Number | 1、2、3、4 | 4 |
| disabled | 是否禁用 | Boolean | — | false |
| showTotal | 是否显示后置的已选数量 | Boolean | — | false |
| placeholder | 占位符 | String | — | — |
| filterable | 是否可搜索选项 | Boolean | — | true |
| clearUnmatchedOptions | 回显时清除不存在选项列表中的选项 | Boolean | — | false |
| excessTagsDisplayType | 标签超出时的呈现方式 | String | scroll/break-line | scroll |
| separator | 选项分隔符 | String | — | 斜杠'/' |
| collapseTags | 多选模式下是否折叠Tag | Boolean | — | false |
| tagsLength | Tag最大展示文字数, 最小1 | Number | — | 13 |
| showAllLevels | 输入框中是否显示选中值的完整路径 | Boolean | — | true |
| includeRegionList | 可展示的大区集合 | Array | — | [100, 200, 300, 400, 500] |
| includeCountryList | 可展示的国家集合（默认全展示） | Array | — | [] |
| includeLocationList | 可展示的城市集合（默认全展示） | Array | — | [] |
| map | 映射配置，具体见下表 | Object | — | — |
| promise | 获取层级办公大厦数据的方法 | Promise | — | — |
| customClass | 自定义类名 | String | — | — |

### 事件 (Events)

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| change | 选中项发生变化时触发 | 目前的选中项, 包含label、value、path数组、fullName |

### 方法 (Methods)

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelected | 用于清空选中项 | — |
| getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
| getCheckedData | 获取选中的数据, 同change事件返回值 | — |

### map 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value | 指定选项的值为选项对象的某个属性值 | String | — | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | String | — | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | String | — | 'children' |
| emitPath | 在选中节点改变时，是否返回数组 | Boolean | — | false |
| multiple | 是否多选 | Boolean | — | false |

### 使用示例

#### 示例 1: 基础单选（4级）

```vue
<template>
  <sdc-office-building-selector
    v-model="buildingIds"
    placeholder="请选择办公大厦"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      buildingIds: []
    }
  },
  methods: {
    handleChange(selected) {
      console.log('选中的办公大厦:', selected)
      // selected 包含: label, value, path, fullName
    }
  }
}
</script>
```

#### 示例 2: 多选 + 限制大区和国家

```vue
<template>
  <sdc-office-building-selector
    v-model="buildingIds"
    :map="{ multiple: true }"
    :include-region-list="[100, 200]"
    :include-country-list="[1, 2, 3]"
    placeholder="请选择办公大厦"
  />
</template>

<script>
export default {
  data() {
    return {
      buildingIds: []
    }
  }
}
</script>
```

#### 示例 3: 限制到城市级（3级）

```vue
<template>
  <sdc-office-building-selector
    v-model="buildingIds"
    :level="3"
    :include-location-list="[100, 200, 300]"
    placeholder="请选择城市"
  />
</template>

<script>
export default {
  data() {
    return {
      buildingIds: []
    }
  }
}
</script>
```
