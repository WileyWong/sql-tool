# Vue3 人事基础选择器组件库完整说明书

> **文档说明**: 本文档为 Vue3 版本的人事组件库 `@tencent/hr-vue-next` 完整说明书，基于组件官方文档整理。适配桌面端的基础人事选择器组件库，适合在 Vue 3.x 技术栈项目中使用。

---

## 快速开始

### 安装

#### 使用 tnpm 安装（推荐）

推荐使用 tnpm 方式进行开发

```bash
tnpm i @tencent/hr-vue-next
```

#### 使用 npm 安装

```bash
npm install @tencent/hr-vue-next --save
```

---

## 使用

hr-vue-next 提供了两种方式使用组件，具体使用方式如下：

### 基础使用（全量注册）

基础使用会全量注册所有组件，如果您的项目大规模使用组件，请放心使用这种方式。

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import hrVueNext from '@tencent/hr-vue-next';

// 引入组件库的少量全局样式变量
import '@tencent/hr-vue-next/es/style/index.css';

const app = createApp(App);
app.use(hrVueNext);

app.mount('#app');
```

### 按需引入使用（推荐）

如果您对产物大小有严格的要求，可以通过按需引入具体组件的方式来使用。

借助 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，可以达到按需引入的使用效果。

```javascript
import { createApp } from 'vue';
import { 
  HrStaffSelector, 
  HrUnitSelector, 
  HrPostSelector,
  HrDictSelector,
  HrContractCompanySelector,
  HrAreaSelector,
  HrCitySelector,
  HrManageSubjectSelector,
  HrOfficeBuildingSelector,
  HrPositionCascader,
  HrPositionLevel,
  HrStaffSubtypeSelector
} from '@tencent/hr-vue-next';
import App from './App.vue';

// 引入组件库的少量全局样式变量
import '@tencent/hr-vue-next/es/style/index.css';

const app = createApp(App);
app.use(HrStaffSelector);
app.use(HrUnitSelector);
app.use(HrPostSelector);
// ... 其他组件

app.mount('#app');
```

### 在组件中使用

```vue
<template>
  <div>
    <hr-staff-selector v-model="staffId" placeholder="请选择员工" />
    <hr-unit-selector v-model="unitId" placeholder="请选择组织" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const staffId = ref('');
const unitId = ref('');
</script>
```

---

## 目录

1. [HrUnitSelector 组织选择器](#1-hrunitselector-组织选择器)
2. [HrStaffSelector 员工选择器](#2-hrstaffselector-员工选择器)
3. [HrPostSelector 岗位选择器](#3-hrpostselector-岗位选择器)
4. [HrDictSelector 基础字典选择器](#4-hrdictselector-基础字典选择器)
5. [HrContractCompanySelector 合同公司选择器](#5-hrcontractcompanyselector-合同公司选择器)
6. [HrAreaSelector 工作地选择器](#6-hrareaselector-工作地选择器)
7. [HrCitySelector 省市选择器](#7-hrcityselector-省市选择器)
8. [HrManageSubjectSelector 管理主体选择器](#8-hrmanagesubjectselector-管理主体选择器)
9. [HrOfficeBuildingSelector 办公大厦选择器](#9-hrofficebuildingselector-办公大厦选择器)
10. [HrPositionCascader 职位级联选择器](#10-hrpositioncascader-职位级联选择器)
11. [HrPositionLevel 职级选择器](#11-hrpositionlevel-职级选择器)
12. [HrStaffSubtypeSelector 员工子类型选择器](#12-hrstaffsubtypeselector-员工子类型选择器)

---

## 1. HrUnitSelector 组织选择器

### 组件信息
- **组件名**: `HrUnitSelector` / `hr-unit-selector`
- **文档路径**: `/components/unit-selector/unit-selector.md`
- **API 文档**: `/common/docs/web/api/unit-selector.md`
- **示例路径**: `/components/unit-selector/_example/`

### 功能说明
用于选择组织，涉及的数据源均为远程数据。

### 核心功能
- ✅ 支持单选/多选模式
- ✅ 提供2种选择方式:
  - 输入关键字搜索，使用下拉菜单展示筛选后的组织
  - 点击右侧按钮打开弹窗，懒加载组织树
- ✅ 用 Tag 展示已选组织
- ✅ 支持设置初始选中项（通过方法设置）
- ✅ 支持设置根组织（`unitId` 属性）
- ✅ 支持限制组织选择范围（`includeUnitSortIds` 属性）
- ✅ 支持禁用组织操作（`disabledUnitIdList` 属性）
- ✅ 支持文本域模式（`textarea` 或 `textareaModel` 属性）
- ✅ 支持多种尺寸（`size` 属性）
- ✅ 支持弹窗插入到 body 中
- ✅ 支持自定义数据源

### 特别说明
- ⚠️ 由于选择器所需的组织选项至少需要包含 `unitId`、`unitName`、`unitFullName` 等属性，而本地没有完整的组织数据，因此不能简单通过修改 `v-model` 值来设置初始选择项
- ⚠️ 请避免在选择后动态改变选择器的宽度，这会造成 Tag 区域样式显示问题

### 属性 (Props)

| 参数                    | 说明                                                     | 类型                | 可选值                                   | 默认值          |
| ----------------------- | -------------------------------------------------------- | ------------------- | ---------------------------------------- | --------------- |
| v-model / modelValue         | 绑定值                                                   | String/Number/Array | —                                        | —               |
| unitId                  | 根组织Id                                                 | Number/Array        | —                                        | —               |
| multiple                | 是否多选                                                 | Boolean             | —                                        | false           |
| width                   | 输入框宽度                                                | String/Number       |   —                                     | —               |
| size                    | 输入框尺寸                                               | String              | medium/small                             | —               |
| search                  | 是否模糊搜索                                             | Boolean             | —                                        | true            |
| disabled                | 是否禁用                                                 | Boolean             | —                                        | false           |
| textarea            | 文本框 (上下布局)                                | Boolean             | —                      | false   |
| textareaModel        | 文本框 (左右布局)                               | Boolean             | —                      | false   |
| height            | 文本框高度                                    | Number/String             | —                      | 130   |
| showTotal               | 多选且非textarea模式下，是否显示后置的已选数量           | Boolean             | —                                        | true            |
| placeholder             | 占位符                                                   | String              | —                                        | —               |
| selectClass             | 选择框自定义类名                                         | String              | —                                        | —               |
| modalClass              | 弹窗自定义类名                                           | String              | —                                        | —               |
| modalWidth              | 弹窗自定义宽度                                           | String              | 参考Modal弹窗组件width                   | '750px'         |
| modalAppendToBody       | 弹窗自身是否插入至 body 元素上。                         | Boolean             | —                                        | false           |
| showLastLevels          | 是否只展示最后一级                                       | Boolean             | —                                        | true            |
| showFullTag             | 是否在输入框中展示完整的tag                              | Boolean             | —                                        | false           |
| filterEnableFlag        | 是否只包含有效组织                                       | Boolean             | —                                        | true            |
| includeVirtualUnit      | 是否包含虚拟组织                                         | Boolean             | —                                        | false           |
| includeUnitSortIds      | 限制组织选择范围                                         | Number Array        | 0-公司、6-bg、8-线、1-部门、7-中心、2-组   | -               |
| isLimitUnitExpand       | 是否限制展开范围中最小级别的组织, 仅限制组织选择范围时有效   | boolean            | -                                         | true            |
| disabledUnitIdList       | 禁用组织选项的操作                                          | Array            | -                                         | []            |
| defaultExpandedKeys     | 一级默认展开的节点的unitId的数组                         | Array               | —                                        | []              |
| props                   | 数据字段别名，具体见下表                                 | Object              | —                                        | —               |
| getDataList             | 通过关键字获取对应组织的方法                             | Function            | —                                        | —               |
| getTreeData             | 通过组织标识获取其子组织的方法                           | Function            | —                                        | —               |
| titleTip                | 弹窗标题旁提示文字                                       | String              | —                                        | —               |

### 事件 (Events)

| 事件名称 | 说明                 | 回调参数     |
| -------- | -------------------- | ------------ |
| change   | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名        | 说明                   | 参数                                                       |
| ------------- | ---------------------- | ---------------------------------------------------------- |
| setSelected   | 用于外部直接设置选中项 | 包含unitName、unitId、unitFullName属性的对象或其组成的数组 |
| clearSelected | 用于清空选中项         | —                                                          |

### props 配置

| 参数                    | 说明                            | 类型   | 可选值 | 默认值                    |
| ----------------------- | ------------------------------- | ------ | ------ | ------------------------- |
| unitId                  | 组织Id字段名                    | String | —      | 'unitId'                  |
| unitName                | 组织名称字段名                  | String | —      | 'unitName'                |
| unitFullName            | 组织完整名称字段名              | String | —      | 'unitFullName'            |
| unitOwnershipTypeId     | 组织管理归属类型Id字段名        | String | —      | 'unitOwnershipTypeId'     |
| unitOwnershipTypeNameCn | 组织管理归属类型名称-中文字段名 | String | —      | 'unitOwnershipTypeNameCn' |
| unitOwnershipTypeNameEn | 组织管理归属类型名称-英文字段名 | String | —      | 'unitOwnershipTypeNameEn' |
| unitIdPath              | 完整组织Id路径                 | String | —       |'unitIdPath' |
| unitLocationCode         | 完整组织code编码              | String | —      | 'unitLocationCode' |

### 代码示例

#### 示例 1: 基础用法 (base.vue)

单选和多选模式的基本使用。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">单选模式</span>
      <hr-unit-selector v-model="value1" selectClass="selectClass" modalClass="modalClass" showFullTag />
    </div>
    <div class="block">
      <span class="demonstration">多选模式</span>
      <hr-unit-selector multiple v-model="value2" @change="change"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref([]);
const change = (val) =>  {
  console.log(val)
}
</script>
```

#### 示例 2: 设置初始选中项 (init.vue)

通过 `setSelected` 方法设置初始值，支持自定义字段映射。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-unit-selector ref="selector1" v-model="value1" multiple />
    </div>
    <div class="block">
      <hr-unit-selector ref="selector2" v-model="value2" :props="myProps" multiple />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
const selector1 = ref(null);
const selector2 = ref(null);
const myProps = ref({
  unitName: 'name',
  unitId: 'id',
  unitFullName: 'fullName',
});

onMounted(() => {
  const initial1 = [{ unitName: '企业综合部', unitId: 24704, unitFullName: 'TEG技术工程事业群/企业综合部' }];
  selector1.value.setSelected(initial1);
  const initial2 = [{ name: '企业综合部', id: 24704, fullName: 'TEG技术工程事业群/企业综合部' }];
  selector2.value.setSelected(initial2);
});
</script>
```

#### 示例 3: 设置根组织 (root.vue)

通过 `unitId` 属性指定根组织，可设置默认展开节点。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-unit-selector multiple :unitId="unitId" :defaultExpandedKeys="[4791]" v-model="value" />
    </div>
    <div class="block">
      <hr-unit-selector multiple :unitId="[0]" :defaultExpandedKeys="[0]" v-model="value2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const unitId = ref([4791]);
const value = ref([]);
const value2 = ref([]);
</script>
```

#### 示例 4: 限制组织选择范围 (range.vue)

通过 `includeUnitSortIds` 限制可选组织类型，通过 `isLimitUnitExpand` 控制是否限制展开范围。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">限制展开范围</span>
      <hr-unit-selector multiple :includeUnitSortIds="includeUnitSortIds" v-model="value" />
    </div>
    <div class="block">
      <span class="demonstration">不限制展开范围</span>
      <hr-unit-selector multiple :includeUnitSortIds="includeUnitSortIds" :isLimitUnitExpand="false" v-model="value2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
const includeUnitSortIds = ref([6, 1]);  // 6-bg、1-部门
const value2 = ref([]);
</script>
```

#### 示例 5: 禁用组织操作 (disable.vue)

通过 `disabledUnitIdList` 禁用特定组织的选择。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">单选禁用操作</span>
      <hr-unit-selector v-model="value" :disabledUnitIdList="disabledUnitIdList" ref="selector1" />
    </div>
    <div class="block">
      <span class="demonstration">多选禁用操作</span>
      <hr-unit-selector multiple v-model="value2" :disabledUnitIdList="disabledUnitIdList" ref="selector2"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const value = ref('');
const value2 = ref([]);
const disabledUnitIdList = ref([953, 1]);
const selector1 = ref(null)
const selector2 = ref(null)
onMounted(() => {
  const initial = [{ unitName: '总办', unitId: 1, unitFullName: '总办' }];
  selector1.value.setSelected(initial)
  selector2.value.setSelected(initial)
})
</script>
```

#### 示例 6: 文本域模式 (textarea.vue)

用于多行展示被选择的组织，支持上下布局和左右布局。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-unit-selector v-model="value" :height="170" textarea multiple placeholder="请选择" />
    </div>
    <div class="block">
      <hr-unit-selector v-model="value2" :height="170" textareaModel multiple placeholder="请选择" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref();
const value2 = ref([]);
</script>
```

#### 示例 7: 尺寸设置 (size.vue)

支持默认、medium、small 三种尺寸。

```vue
<template>
  <div class="example_flex_box">
    <div class="block size-block">
      <span class="demonstration">默认尺寸</span>
      <hr-unit-selector v-model="value1" />
    </div>
    <div class="block size-block">
      <span class="demonstration">中等尺寸</span>
      <hr-unit-selector size="medium" v-model="value2" />
    </div>
    <div class="block size-block">
      <span class="demonstration">较小尺寸</span>
      <hr-unit-selector size="small" v-model="value3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
</script>
```

#### 示例 8: 自定义数据源 (source.vue)

可自定义 `getDataList` 和 `getTreeData` 方法提供数据。

```vue
<template>
  <div class="example_init_box">
    <hr-unit-selector
      v-model="value"
      multiple
      modalWidth="1000px"
      :getDataList="customGetDataList"
      :getTreeData="customGetTreeData"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);

/**
 * @method 模糊搜索对应的组织列表
 * @param {String} name 关键字字符串
 * @returns 返回带有组织列表数据的promise
 */
const customGetDataList = (name) => {
  // 这里是模拟后端处理
  return new Promise((resolve, reject) => {
    const remoteData = [
      { unitName: 'TEG技术工程事业群', unitId: 958, unitFullName: 'TEG技术工程事业群' },
      { unitName: '企业综合部', unitId: 24704, unitFullName: 'TEG技术工程事业群/企业综合部' },
      { unitName: 'CDG企业发展事业群', unitId: 18051, unitFullName: 'CDG企业发展事业群' },
      { unitName: 'CDG职业发展委员会', unitId: 18163, unitFullName: 'CDG企业发展事业群/CDG职业发展委员会' },
      {
        unitName: 'CDG通道决策委员会',
        unitId: 18164,
        unitFullName: 'CDG企业发展事业群/CDG职业发展委员会/CDG通道决策委员会',
      },
    ];
    let data = remoteData.filter((item) => item.unitName.indexOf(name) !== -1);
    resolve(data);
  });
};

/**
 * @method 根据组织Id获取该组织下的子级组织列表
 * @param {String} unitId 组织Id
 * @returns 返回带有组织列表数据的promise
 */
const customGetTreeData = (unitId) => {
  return new Promise((resolve, reject) => {
    // 这里是模拟后端处理
    let data = [];
    if (unitId === 0) {
      data = [
        { unitName: 'TEG技术工程事业群', unitId: 958, unitFullName: 'TEG技术工程事业群' },
        { unitName: 'CDG企业发展事业群', unitId: 18051, unitFullName: 'CDG企业发展事业群' },
      ];
    }
    if (unitId === 958) {
      data = [{ unitName: '企业综合部', unitId: 24704, unitFullName: 'TEG技术工程事业群/企业综合部' }];
    }
    if (unitId === 18051) {
      data = [{ unitName: 'CDG职业发展委员会', unitId: 18163, unitFullName: 'CDG企业发展事业群/CDG职业发展委员会' }];
    }
    if (unitId === 18163) {
      data = [
        {
          unitName: 'CDG通道决策委员会',
          unitId: 18164,
          unitFullName: 'CDG企业发展事业群/CDG职业发展委员会/CDG通道决策委员会',
        },
      ];
    }
    resolve(data);
  });
};
</script>
```

#### 示例 9: 弹窗插入到body中 (body.vue)

设置 `modalAppendToBody` 属性将弹窗插入到 body 元素上。

```vue
<template>
  <div class="example_init_box">
    <hr-unit-selector v-model="value" modalAppendToBody />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
```

### 使用场景
- 员工选择所属组织/部门
- 数据权限设置中选择可见组织
- 报表统计中选择统计组织范围
- 审批流程中选择审批组织

---

## 2. HrStaffSelector 员工选择器

### 组件信息
- **组件名**: `HrStaffSelector` / `hr-staff-selector`
- **文档路径**: `/components/staff-selector/staff-selector.md`
- **API 文档**: `/common/docs/web/api/staff-selector.md`
- **示例路径**: `/components/staff-selector/_example/`

### 功能说明
用于选择员工，涉及的数据源均为远程数据。

### 核心功能
- ✅ 支持单选/多选模式
- ✅ 提供3种选择方式:
  1. 输入关键字搜索，使用下拉菜单展示筛选后的员工
  2. 点击右侧按钮打开弹窗，懒加载员工树选择
  3. 粘贴员工姓名批量选择（格式: `staffName;staffName;` 或 `staffName\nstaffName`）
- ✅ 用 Tag 展示已选员工
- ✅ 支持设置初始选中项（通过方法设置）
- ✅ 支持限制选项范围（按组织、职级、员工类型等）
- ✅ 支持曾用名查询（`useFormerNameSearch` 属性）
- ✅ 支持文本域模式
- ✅ 支持多种尺寸
- ✅ 支持失焦不清除输入值（`blurClearInputValue` 属性）
- ✅ 支持弹窗插入到 body 中
- ✅ 支持自定义数据源（4个接口方法）

### 数据源说明
组件内置了4个默认数据源接口方法:
- **`getDataList`**: 用于输入关键字筛选员工
- **`getPasteResult`**: 用于粘贴姓名选择员工
- **`getTreeData`**: 用于懒加载组织树及其子员工
- **`getChildrenData`**: 用于批量选择组织下的所有员工

### 特别说明
- ⚠️ 由于选择器所需的员工选项至少需要包含 `staffId`、`staffName` 等属性，不能简单通过修改 `v-model` 值来设置初始选择项
- ⚠️ 动态切换组织时，已有选项需手动调用方法清空
- ⚠️ 曾用名查询时，搜索曾用名只支持英文名搜索，搜索现用名支持英文+(中文)
- ⚠️ 请避免在选择后动态改变选择器的宽度，这会造成 Tag 区域样式显示问题

### 属性 (Props)

| 参数                    | 说明                                                     | 类型                | 可选值                                   | 默认值          |
| ----------------------- | -------------------------------------------------------- | ------------------- | ---------------------------------------- | --------------- |
| v-model / modelValue         | 绑定值                                                   | String/Number/Array | —                                        | —               |
| unitId                  | 根组织Id                                                 | Number/Array        | —                                        | —               |
| multiple                | 是否多选                                                 | Boolean             | —                                        | false           |
| width                   | 输入框宽度                                                | String/Number       | —                                        | —               |
| size                    | 输入框尺寸                                               | String              | medium/small                             | —               |
| search                  | 是否模糊搜索                                             | Boolean             | —                                        | true            |
| disabled                | 是否禁用                                                 | Boolean             | —                                        | false           |
| textarea                | 文本框 (上下布局)                                        | Boolean             | —                                        | false           |
| textareaModel           | 文本框 (左右布局)                                        | Boolean             | —                                        | false           |
| height                  | 文本框高度                                               | Number/String       | —                                        | 130             |
| showTotal               | 多选且非textarea模式下，是否显示后置的已选数量           | Boolean             | —                                        | true            |
| placeholder             | 占位符                                                   | String              | —                                        | —               |
| selectClass             | 选择框自定义类名                                         | String              | —                                        | —               |
| modalClass              | 弹窗自定义类名                                           | String              | —                                        | —               |
| modalWidth              | 弹窗自定义宽度                                           | String              | 参考Modal弹窗组件width                   | '750px'         |
| modalAppendToBody       | 弹窗自身是否插入至 body 元素上                           | Boolean             | —                                        | false           |
| showFullTag             | 是否在输入框中展示完整的tag                              | Boolean             | —                                        | false           |
| includeDimission        | 是否包含离职员工                                         | Boolean             | —                                        | false           |
| includeOnBoarding       | 是否包含待入职员工                                       | Boolean             | —                                        | false           |
| includePartTimePost     | 是否显示组织下的兼岗员工                                 | Boolean             | —                                        | false           |
| useFormerNameSearch     | 是否使用曾用名搜索                                       | Boolean             | —                                        | false           |
| timeliness              | 曾用名搜索获取数据的时效性                               | String              | T0/T1                                    | 'T0'            |
| blurClearInputValue     | 失焦时是否清除输入框内容                                 | Boolean             | —                                        | true            |
| defaultExpandedKeys     | 一级默认展开的节点的unitId的数组                         | Array               | —                                        | []              |
| range                   | 限制选项范围，具体见下表                                 | Object              | —                                        | {}              |
| props                   | 数据字段别名，具体见下表                                 | Object              | —                                        | —               |
| getDataList             | 通过关键字获取对应员工的方法                             | Function            | —                                        | —               |
| getPasteResult          | 通过粘贴姓名获取对应员工的方法                           | Function            | —                                        | —               |
| getTreeData             | 通过组织标识获取其子组织和子员工的方法                   | Function            | —                                        | —               |
| getChildrenData         | 通过组织标识获取该组织下所有员工的方法                   | Function            | —                                        | —               |
| titleTip                | 弹窗标题旁提示文字                                       | String              | —                                        | —               |

### 事件 (Events)

| 事件名称 | 说明                 | 回调参数     |
| -------- | -------------------- | ------------ |
| change   | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名        | 说明                   | 参数                                           |
| ------------- | ---------------------- | ---------------------------------------------- |
| setSelected   | 用于外部直接设置选中项 | 包含staffName、staffId属性的对象或其组成的数组 |
| clearSelected | 用于清空选中项         | —                                              |

### props 配置

| 参数         | 说明             | 类型   | 可选值 | 默认值         |
| ------------ | ---------------- | ------ | ------ | -------------- |
| staffId      | 员工Id字段名     | String | —      | 'staffId'      |
| staffName    | 员工姓名字段名   | String | —      | 'staffName'    |
| engName      | 员工英文名字段名 | String | —      | 'engName'      |
| avatar       | 员工头像字段名   | String | —      | 'avatar'       |
| unitId       | 组织Id字段名     | String | —      | 'unitId'       |
| unitName     | 组织名称字段名   | String | —      | 'unitName'     |
| unitFullName | 组织全路径字段名 | String | —      | 'unitFullName' |

### range 配置

| 参数                       | 说明                             | 类型         | 可选值 | 默认值 |
| -------------------------- | -------------------------------- | ------------ | ------ | ------ |
| unitId                     | 组织Id,仅选择该组织下的子级员工  | Number/Array | —      | —      |
| contractCompanyIdList      | 合同公司Id集合                   | Array        | —      | —      |
| manageUnitIdList           | 管理主体Id集合                   | Array        | —      | —      |
| isContainSubStaff          | 是否包含子级员工                 | Boolean      | —      | false  |
| managerPositionLevelIdList | 职级Id集合                       | Array        | —      | —      |
| staffTypeIdList            | 员工类型Id集合                   | Array        | —      | —      |

### 代码示例

#### 示例 1: 基础用法 (base.vue)

单选和多选模式的基本使用。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">单选模式</span>
      <hr-staff-selector v-model="value1" selectClass="selectClass" modalClass="modalClass" showFullTag />
    </div>
    <div class="block">
      <span class="demonstration">多选模式</span>
      <hr-staff-selector multiple v-model="value2" @change="change"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref([]);
const change = (val) =>  {
  console.log(val)
}
</script>
```

#### 示例 2: 设置初始选中项 (init.vue)

通过 `setSelected` 方法设置初始值，支持自定义字段映射。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-staff-selector ref="selector1" v-model="value1" multiple />
    </div>
    <div class="block">
      <hr-staff-selector ref="selector2" v-model="value2" :props="myProps" multiple />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
const selector1 = ref(null);
const selector2 = ref(null);
const myProps = ref({
  staffName: 'name',
  staffId: 'id',
});

onMounted(() => {
  const initial1 = [{ staffName: 'fourli(李四)', staffId: 288888 }];
  selector1.value.setSelected(initial1);
  const initial2 = [{ name: 'fourli(李四)', id: 288888 }];
  selector2.value.setSelected(initial2);
});
</script>
```

#### 示例 3: 限制员工选择范围 (range.vue)

通过 `includeStaffTypeList`、`includeWorkStatusIdList`、`includePositionLevelIdList` 限制可选员工范围。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">限制员工类型</span>
      <hr-staff-selector multiple :includeStaffTypeList="[1, 2]" v-model="value1" />
    </div>
    <div class="block">
      <span class="demonstration">限制在职状态</span>
      <hr-staff-selector multiple :includeWorkStatusIdList="[1]" v-model="value2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
</script>
```

#### 示例 4: 曾用名搜索 (search.vue)

通过 `useFormerNameSearch` 开启曾用名查询功能。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">开启曾用名搜索</span>
      <hr-staff-selector v-model="value" :useFormerNameSearch="true" multiple />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
</script>
```

#### 示例 5: 文本域模式 (textarea.vue)

用于多行展示被选择的员工，支持上下布局和左右布局。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-staff-selector v-model="value" :height="170" textarea multiple placeholder="请选择" />
    </div>
    <div class="block">
      <hr-staff-selector v-model="value2" :height="170" textareaModel multiple placeholder="请选择" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
const value2 = ref([]);
</script>
```

#### 示例 6: 尺寸设置 (size.vue)

支持默认、medium、small 三种尺寸。

```vue
<template>
  <div class="example_flex_box">
    <div class="block size-block">
      <span class="demonstration">默认尺寸</span>
      <hr-staff-selector v-model="value1" />
    </div>
    <div class="block size-block">
      <span class="demonstration">中等尺寸</span>
      <hr-staff-selector size="medium" v-model="value2" />
    </div>
    <div class="block size-block">
      <span class="demonstration">较小尺寸</span>
      <hr-staff-selector size="small" v-model="value3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
</script>
```

#### 示例 7: 失焦不清除输入值 (blur.vue)

设置 `blurClearInputValue` 为 false，失焦时不清除输入框内容。

```vue
<template>
  <div class="example_init_box">
    <hr-staff-selector v-model="value" :blurClearInputValue="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
```

#### 示例 8: 弹窗插入到body中 (body.vue)

设置 `modalAppendToBody` 属性将弹窗插入到 body 元素上。

```vue
<template>
  <div class="example_init_box">
    <hr-staff-selector v-model="value" modalAppendToBody />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
```

#### 示例 9: 自定义数据源 (source.vue)

可自定义 `getDataList`、`getPasteResult`、`getTreeData`、`getChildrenData` 方法提供数据。

```vue
<template>
  <div class="example_init_box">
    <hr-staff-selector
      v-model="value"
      multiple
      modalWidth="1000px"
      :getDataList="customGetDataList"
      :getPasteResult="customGetPasteResult"
      :getTreeData="customGetTreeData"
      :getChildrenData="customGetChildrenData"
    >
    </hr-staff-selector>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
const remoteData = ref([
  { staffName: 'fourli(李四)', staffId: 288888 },
  { staffName: 'fivewang(王五)', staffId: 123321 },
  { staffName: 'sixzhao(赵六)', staffId: 666666 },
  { staffName: 'sevenchen(陈七)', staffId: 233333 },
  { staffName: 'ninelin(林九)', staffId: 111111 },
]);

/**
 * @method 模糊搜索对应的员工
 * @param {String} name 关键字字符串
 * @returns 返回带有员工列表数据的promise
 */
const customGetDataList = (name) => {
  return new Promise((resolve, reject) => {
    let data = remoteData.value.filter((item) => item.staffName.indexOf(name) !== -1);
    resolve(data);
  });
};

/**
 * @method 粘贴员工姓名字符串获取对应的员工
 * @param {String} nameString 一个以上员工姓名组成的字符串
 * @returns 返回带有员工列表数据的promise
 */
const customGetPasteResult = (nameString) => {
  return new Promise((resolve, reject) => {
    let data = [];
    const names = nameString.split(';');
    data = remoteData.value.filter((item) => names.includes(item.staffName));
    resolve(data);
  });
};

/**
 * @method 根据组织Id获取该组织下的子级组织、子级员工列表
 * @param {String} unitId 组织Id
 * @returns 返回带有组织、员工列表数据的promise
 */
const customGetTreeData = (unitId) => {
  return new Promise((resolve, reject) => {
    let data = [];
    if (unitId === 0) {
      data = {
        unit: [
          { unitId: 1, unitName: '组织一' },
          { unitId: 2, unitName: '组织二' },
        ],
      };
    }
    if (unitId === 1) {
      data = {
        staff: [
          { staffName: 'fourli(李四)', staffId: 288888 },
          { staffName: 'fivewang(王五)', staffId: 123321 },
        ],
        unit: [{ unitId: 3, unitName: '组织三' }],
      };
    }
    if (unitId === 2) {
      data = {
        staff: [
          { staffName: 'sevenchen(陈七)', staffId: 233333 },
          { staffName: 'ninelin(林九)', staffId: 111111 },
        ],
      };
    }
    if (unitId === 3) {
      data = {
        staff: [{ staffName: 'sixzhao(赵六)', staffId: 666666 }],
      };
    }
    resolve(data);
  });
};

/**
 * @method 根据组织Id获取该组织下子级员工列表
 * @param {String} unitId 组织Id
 * @returns 返回带有员工列表数据的promise
 */
const customGetChildrenData = (unitId) => {
  return new Promise((resolve, reject) => {
    let data = [];
    if (unitId === 1) {
      data = [
        { staffName: 'fourli(李四)', staffId: 288888 },
        { staffName: 'fivewang(王五)', staffId: 123321 },
      ];
    }
    if (unitId === 2) {
      data = [
        { staffName: 'sevenchen(陈七)', staffId: 233333 },
        { staffName: 'ninelin(林九)', staffId: 111111 },
      ];
    }
    if (unitId === 3) {
      data = [{ staffName: 'sixzhao(赵六)', staffId: 666666 }];
    }
    resolve(data);
  });
};
</script>
```

### 使用场景
- 任务分配中选择负责人
- 审批流程中选择审批人/抄送人
- 权限管理中选择授权员工
- 组织架构调整中选择员工

---

## 3. HrPostSelector 岗位选择器

### 组件信息
- **组件名**: `HrPostSelector` / `hr-post-selector`
- **文档路径**: `/components/post-selector/post-selector.md`
- **API 文档**: `/common/docs/web/api/post-selector.md`
- **示例路径**: `/components/post-selector/_example/`

### 功能说明
用于选择岗位，涉及的数据源均为远程数据。

### 核心功能
- ✅ 支持单选/多选模式
- ✅ 提供2种选择方式:
  - 输入关键字搜索，使用下拉菜单展示筛选后的岗位
  - 点击右侧按钮打开弹窗，懒加载岗位树
- ✅ 用 Tag 展示已选岗位
- ✅ 支持设置初始选中项（通过方法设置）
- ✅ 支持限制选项范围（按组织限制）
- ✅ 支持文本域模式
- ✅ 支持多种尺寸
- ✅ 支持显示岗位ID（`showPostId` 属性）
- ✅ 支持弹窗插入到 body 中
- ✅ 支持自定义数据源（3个接口方法）

### 数据源说明
组件内置了3个默认数据源接口方法:
- **`getDataList`**: 用于输入关键字筛选岗位
- **`getTreeData`**: 用于懒加载组织树及其子岗位
- **`getChildrenData`**: 用于批量选择组织下的所有岗位

每个方法返回的岗位对象至少包含 `postName`、`postId`、`postFullName` 三个属性。

### 特别说明
- ⚠️ 由于选择器所需的岗位选项至少需要包含 `postId`、`postName`、`postFullName` 等属性，不能简单通过修改 `v-model` 值来设置初始选择项
- ⚠️ 动态切换组织时，已有选项需手动调用方法清空
- ⚠️ 请避免在选择后动态改变选择器的宽度，这会造成 Tag 区域样式显示问题

### 属性 (Props)

| 参数                    | 说明                                                     | 类型                | 可选值                                   | 默认值          |
| ----------------------- | -------------------------------------------------------- | ------------------- | ---------------------------------------- | --------------- |
| v-model / modelValue         | 绑定值                                                   | String/Number/Array | —                                        | —               |
| unitId                  | 根组织Id                                                 | Number/Array        | —                                        | —               |
| multiple                | 是否多选                                                 | Boolean             | —                                        | false           |
| width                   | 输入框宽度                                                | String/Number       | —                                        | —               |
| size                    | 输入框尺寸                                               | String              | medium/small                             | —               |
| search                  | 是否模糊搜索                                             | Boolean             | —                                        | true            |
| disabled                | 是否禁用                                                 | Boolean             | —                                        | false           |
| textarea                | 文本框 (上下布局)                                        | Boolean             | —                                        | false           |
| textareaModel           | 文本框 (左右布局)                                        | Boolean             | —                                        | false           |
| height                  | 文本框高度                                               | Number/String       | —                                        | 130             |
| showTotal               | 多选且非textarea模式下，是否显示后置的已选数量           | Boolean             | —                                        | true            |
| placeholder             | 占位符                                                   | String              | —                                        | —               |
| selectClass             | 选择框自定义类名                                         | String              | —                                        | —               |
| modalClass              | 弹窗自定义类名                                           | String              | —                                        | —               |
| modalWidth              | 弹窗自定义宽度                                           | String              | 参考Modal弹窗组件width                   | '750px'         |
| modalAppendToBody       | 弹窗自身是否插入至 body 元素上                           | Boolean             | —                                        | false           |
| showFullTag             | 是否在输入框中展示完整的tag                              | Boolean             | —                                        | false           |
| showPostId              | 是否显示岗位ID                                           | Boolean             | —                                        | false           |
| filterEnableFlag        | 是否只包含有效岗位                                       | Boolean             | —                                        | true            |
| defaultExpandedKeys     | 一级默认展开的节点的unitId的数组                         | Array               | —                                        | []              |
| props                   | 数据字段别名，具体见下表                                 | Object              | —                                        | —               |
| getDataList             | 通过关键字获取对应岗位的方法                             | Function            | —                                        | —               |
| getTreeData             | 通过组织标识获取其子组织和子岗位的方法                   | Function            | —                                        | —               |
| getChildrenData         | 通过组织标识获取该组织下所有岗位的方法                   | Function            | —                                        | —               |

### 事件 (Events)

| 事件名称 | 说明                 | 回调参数     |
| -------- | -------------------- | ------------ |
| change   | 选中项发生变化时触发 | 目前的选中项 |

### 方法 (Methods)

| 方法名        | 说明                   | 参数                                                         |
| ------------- | ---------------------- | ------------------------------------------------------------ |
| setSelected   | 用于外部直接设置选中项 | 包含postName、postId、postFullName属性的对象或其组成的数组   |
| clearSelected | 用于清空选中项         | —                                                            |

### props 配置

| 参数         | 说明               | 类型   | 可选值 | 默认值         |
| ------------ | ------------------ | ------ | ------ | -------------- |
| postId       | 岗位Id字段名       | String | —      | 'postId'       |
| postName     | 岗位名称字段名     | String | —      | 'postName'     |
| postFullName | 岗位完整名称字段名 | String | —      | 'postFullName' |

### 代码示例

#### 示例 1: 基础用法 (base.vue)

单选和多选模式的基本使用。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <span class="demonstration">单选模式</span>
      <hr-post-selector v-model="value1" showFullTag showPostId></hr-post-selector>
    </div>
    <div class="block">
      <span class="demonstration">多选模式</span>
      <hr-post-selector multiple v-model="value2"></hr-post-selector>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref([]);
</script>
```

#### 示例 2: 设置初始选中项 (init.vue)

通过 `setSelected` 方法设置初始值，支持自定义字段映射。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-post-selector ref="selector1" v-model="value1" multiple></hr-post-selector>
    </div>
    <div class="block">
      <hr-post-selector ref="selector2" v-model="value2" :props="myProps" multiple></hr-post-selector>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
const selector1 = ref(null);
const selector2 = ref(null);
const myProps = ref({
  postId: 'id',
  postName: 'name',
  postFullName: 'fullName',
});
onMounted(() => {
  const initial1 = [{ postId: 11, postName: '总经理', postFullName: 'TEG技术工程事业群/企业IT部/总经理' }];
  selector1.value.setSelected(initial1);
  const initial2 = [{ id: 11, name: '总经理', fullName: 'TEG技术工程事业群/企业IT部/总经理' }];
  selector2.value.setSelected(initial2);
});
</script>
```

#### 示例 3: 设置根组织 (root.vue)

通过 `unitId` 属性指定根组织。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-post-selector multiple :unitId="[4791]" v-model="value" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
</script>
```

#### 示例 4: 文本域模式 (textarea.vue)

用于多行展示被选择的岗位。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-post-selector v-model="value" :height="170" textarea multiple placeholder="请选择" />
    </div>
    <div class="block">
      <hr-post-selector v-model="value2" :height="170" textareaModel multiple placeholder="请选择" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);
const value2 = ref([]);
</script>
```

#### 示例 5: 尺寸设置 (size.vue)

支持默认、medium、small 三种尺寸。

```vue
<template>
  <div class="example_flex_box">
    <div class="block size-block">
      <span class="demonstration">默认尺寸</span>
      <hr-post-selector v-model="value1" />
    </div>
    <div class="block size-block">
      <span class="demonstration">中等尺寸</span>
      <hr-post-selector size="medium" v-model="value2" />
    </div>
    <div class="block size-block">
      <span class="demonstration">较小尺寸</span>
      <hr-post-selector size="small" v-model="value3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
</script>
```

#### 示例 6: 弹窗插入到body中 (body.vue)

设置 `modalAppendToBody` 属性将弹窗插入到 body 元素上。

```vue
<template>
  <div class="example_init_box">
    <hr-post-selector v-model="value" modalAppendToBody />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
```

#### 示例 7: 自定义数据源 (source.vue)

可自定义 `getDataList`、`getTreeData`、`getChildrenData` 方法提供数据。

```vue
<template>
  <div class="example_init_box">
    <hr-post-selector
      v-model="value"
      multiple
      modalWidth="1000px"
      :getDataList="customGetDataList"
      :getTreeData="customGetTreeData"
      :getChildrenData="customGetChildrenData"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref([]);

/**
 * @method 模糊搜索对应的岗位
 * @param {String} name 关键字字符串
 * @returns 返回带有岗位列表数据的promise
 */
const customGetDataList = (name) => {
  return new Promise((resolve) => {
    const remoteData = [
      { postId: 11, postName: '总经理', postFullName: 'TEG技术工程事业群/企业IT部/总经理' },
      { postId: 22, postName: '副总经理', postFullName: 'TEG技术工程事业群/企业IT部/副总经理' },
    ];
    let data = remoteData.filter((item) => item.postName.indexOf(name) !== -1);
    resolve(data);
  });
};

/**
 * @method 根据组织Id获取该组织下的子级组织、子级岗位列表
 * @param {String} unitId 组织Id
 * @returns 返回带有组织、岗位列表数据的promise
 */
const customGetTreeData = (unitId) => {
  return new Promise((resolve) => {
    let data = {};
    if (unitId === 0) {
      data = {
        unit: [
          { unitId: 958, unitName: 'TEG技术工程事业群' },
        ],
      };
    }
    if (unitId === 958) {
      data = {
        post: [
          { postId: 11, postName: '总经理', postFullName: 'TEG技术工程事业群/企业IT部/总经理' },
        ],
      };
    }
    resolve(data);
  });
};

/**
 * @method 根据组织Id获取该组织下所有岗位
 * @param {String} unitId 组织Id
 * @returns 返回带有岗位列表数据的promise
 */
const customGetChildrenData = (unitId) => {
  return new Promise((resolve) => {
    let data = [];
    if (unitId === 958) {
      data = [
        { postId: 11, postName: '总经理', postFullName: 'TEG技术工程事业群/企业IT部/总经理' },
      ];
    }
    resolve(data);
  });
};
</script>
```

### 使用场景
- 员工岗位分配
- 岗位权限配置
- 组织架构管理中的岗位设置
- 招聘系统中的岗位选择

---

## 4. HrDictSelector 基础字典选择器

### 组件信息
- **组件名**: `HrDictSelector` / `hr-dict-selector`
- **文档路径**: `/components/dict-selector/dict-selector.md`
- **API 文档**: `/common/docs/web/api/dict-selector.md`
- **示例路径**: `/components/dict-selector/_example/`

### 功能说明
根据不同的字典名称，使用下拉菜单展示对应的选项并选择内容。

### 核心功能
- ✅ 支持单选/多选模式
- ✅ 用 Tag 展示已选内容
- ✅ 支持排除选项（`exclude` 属性）
- ✅ 支持自定义选项（`custom` 属性）
- ✅ 根据字典类型动态加载选项
- ✅ 支持多选 Tag 折叠展示
- ✅ 支持搜索功能
- ✅ 支持多种尺寸

### 属性 (Props)

| 参数         | 说明                                         | 类型          | 可选值       | 默认值 |
| ------------ | -------------------------------------------- | ------------- | ------------ | ------ |
| v-model / modelValue  | 绑定值                                       | String/Number/Array | —            | —      |
| type         | 字典类型（必填）                             | String        | —            | —      |
| multiple     | 是否多选                                     | Boolean       | —            | false  |
| disabled     | 是否禁用                                     | Boolean       | —            | false  |
| clearable    | 是否可清空                                   | Boolean       | —            | true   |
| placeholder  | 占位符                                       | String        | —            | —      |
| size         | 输入框尺寸                                   | String        | medium/small | —      |
| filterable   | 是否可搜索                                   | Boolean       | —            | false  |
| collapseTags | 多选时是否折叠Tag                            | Boolean       | —            | false  |
| tagsLength   | Tag最大展示文字数                            | Number        | —            | —      |
| exclude      | 排除的选项值数组                             | Array         | —            | []     |
| custom       | 自定义选项数组，格式: [{label, value}]       | Array         | —            | []     |

### 事件 (Events)

| 事件名称 | 说明                 | 回调参数     |
| -------- | -------------------- | ------------ |
| change   | 选中项发生变化时触发 | 目前的选中项 |

### 代码示例

#### 示例 1: 基础用法 (base.vue)

单选模式的基本使用。

```vue
<template>
  <div class="example_init_box">
    <hr-dict-selector v-model="value" type="1" placeholder="请选择" @change="change"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
const change = (val) => {
  console.log(val);
}
</script>
```

#### 示例 2: 多选模式 (multiple.vue)

多选模式支持 Tag 折叠和文字长度限制。

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-dict-selector v-model="value1" multiple type="1" />
    </div>
    <div class="block">
      <hr-dict-selector
        v-model="value2"
        multiple
        type="1"
        :tagsLength="3"
        :filterable="false"
        collapse-tags
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
</script>
```

#### 示例 3: 排除选项 (exclude.vue)

通过 `exclude` 属性排除特定选项。

```vue
<template>
  <div class="example_init_box">
    <hr-dict-selector v-model="value" type="1" :exclude="[1, 2]" placeholder="请选择" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
</script>
```

#### 示例 4: 自定义选项 (custom.vue)

通过 `custom` 属性添加自定义选项。

```vue
<template>
  <div class="example_init_box">
    <hr-dict-selector
      v-model="value"
      type="1"
      :custom="customOptions"
      placeholder="请选择"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref('');
const customOptions = ref([
  { label: '自定义选项1', value: 'custom1' },
  { label: '自定义选项2', value: 'custom2' },
]);
</script>
```

### 常用字典类型

常见的字典类型包括:
- **type="1"**: 性别
- **type="2"**: 员工状态
- **type="3"**: 合同类型
- 等等...（根据实际业务定义）

### 使用场景
- 性别选择
- 员工状态选择
- 合同类型选择
- 其他基础字典数据选择

---

## 5. HrContractCompanySelector 合同公司选择器

### 组件信息
- **组件名**: `HrContractCompanySelector` / `hr-contract-company-selector`
- **文档路径**: `/components/contract-company-selector/contract-company-selector.md`
- **API 文档**: `/common/docs/web/api/contract-company-selector.md`
- **示例路径**: `/components/contract-company-selector/_example/`

### 功能说明
使用下拉菜单展示合同公司的选项并选择内容。

### 核心功能
- ✅ 支持单选模式
- ✅ 支持多选模式
- ✅ 支持多种尺寸
- ✅ 支持自定义选项
- ✅ 支持Tag折叠展示
- ✅ 支持搜索功能

### 属性 (Props)

| 参数         | 说明                          | 类型          | 可选值       | 默认值 |
| ------------ | ----------------------------- | ------------- | ------------ | ------ |
| v-model / modelValue  | 绑定值                        | String/Number/Array | —            | —      |
| map          | 配置对象，包含 multiple 等    | Object        | —            | {}     |
| disabled     | 是否禁用                      | Boolean       | —            | false  |
| clearable    | 是否可清空                    | Boolean       | —            | true   |
| placeholder  | 占位符                        | String        | —            | —      |
| size         | 输入框尺寸                    | String        | medium/small | —      |
| filterable   | 是否可搜索                    | Boolean       | —            | false  |
| collapseTags | 多选时是否折叠Tag             | Boolean       | —            | false  |
| tagsLength   | Tag最大展示文字数             | Number        | —            | —      |
| custom       | 自定义选项数组                | Array         | —            | []     |

### 代码示例

#### 示例 1: 基础用法 (base.vue)

```vue
<template>
  <div class="example_init_box">
    <hr-contract-company-selector v-model="value" placeholder="请选择" @change="change"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value = ref(1);
const change = (val) => {
  console.log(val);
}
</script>
```

#### 示例 2: 多选模式 (multiple.vue)

```vue
<template>
  <div class="example_flex_box">
    <div class="block">
      <hr-contract-company-selector v-model="value1" :map="map"/>
    </div>
    <div class="block">
      <hr-contract-company-selector
        v-model="value2"
        :map="map"
        :tagsLength="3"
        :filterable="false"
        collapse-tags
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const value1 = ref([]);
const value2 = ref([]);
const map = { multiple: true };
</script>
```

### 使用场景
- 员工合同公司选择
- 合同管理系统中的公司选择
- 报表统计中的合同公司筛选

---

## 6. HrAreaSelector 工作地选择器

### 组件信息
- **组件名**: `HrAreaSelector` / `hr-area-selector`
- **文档路径**: `/components/area-selector/area-selector.md`
- **API 文档**: `/common/docs/web/api/area-selector.md`
- **示例路径**: `/components/area-selector/_example/`

### 功能说明
用于选择工作地。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 提供2种选择方式:
  - 展开级联面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的工作地
- ✅ 用 Tag 展示已选工作地
- ✅ 支持 Tag 展示控制（折叠、仅显示最后一级等）
- ✅ 支持多语言（中文/英文）
- ✅ 支持限制展示的大区或国家
  - 100——中国大陆
  - 200——亚太
  - 300——美洲
  - 400——欧洲
  - 500——中东及非洲
- ✅ 支持完整 value 值或仅最后一级
- ✅ 支持展示层级设置（默认3级）
- ✅ 支持回显过滤
- ✅ 支持精简全选数据（`getTrimmedData`/`setTrimmedData` 方法）
- ✅ 支持选择任意一级选项（`checkStrictly` 属性）
- ✅ 支持选中值模式（onlyLeaf/parentFirst/all）
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                                         | 类型          | 可选值                       | 默认值      |
| ----------------------- | -------------------------------------------- | ------------- | ---------------------------- | ----------- |
| v-model / modelValue         | 绑定值                                       | String/Number/Array | —                            | —           |
| map                     | 配置对象                                     | Object        | —                            | {}          |
| disabled                | 是否禁用                                     | Boolean       | —                            | false       |
| clearable               | 是否可清空                                   | Boolean       | —                            | true        |
| placeholder             | 占位符                                       | String        | —                            | —           |
| size                    | 输入框尺寸                                   | String        | medium/small                 | —           |
| filterable              | 是否可搜索                                   | Boolean       | —                            | true        |
| collapseTags            | 多选时是否折叠Tag                            | Boolean       | —                            | false       |
| showAllLevels           | 是否显示完整路径                             | Boolean       | —                            | true        |
| tagsLength              | Tag最大展示文字数                            | Number        | —                            | —           |
| lang                    | 语言                                         | String        | cn/en                        | 'cn'        |
| level                   | 展示层级                                     | Number        | —                            | 3           |
| includeRegionList       | 限制展示的大区                               | Array         | —                            | []          |
| includeCountryList      | 限制展示的国家                               | Array         | —                            | []          |
| includeAreaIdList       | 限制展示的工作地ID                           | Array         | —                            | []          |
| checkStrictly           | 是否可选择任意一级                           | Boolean       | —                            | false       |
| valueMode               | 选中值模式                                   | String        | onlyLeaf/parentFirst/all     | 'onlyLeaf'  |
| clearUnmatchedOptions   | 回显时清除不存在的选项                       | Boolean       | —                            | false       |
| getLocationData         | 自定义数据源方法                             | Function      | —                            | —           |

### 方法 (Methods)

| 方法名          | 说明                       | 参数 |
| --------------- | -------------------------- | ---- |
| getTrimmedData  | 获取精简的全选数据         | —    |
| setTrimmedData  | 设置精简的全选数据进行回显 | data |

### 使用场景
- 员工工作地选择
- 出差申请中的目的地选择
- 报表统计中的地区筛选
- 组织架构中的办公地点设置

---

## 7. HrCitySelector 省市选择器

### 组件信息
- **组件名**: `HrCitySelector` / `hr-city-selector`
- **文档路径**: `/components/city-selector/city-selector.md`
- **API 文档**: `/common/docs/web/api/city-selector.md`
- **示例路径**: `/components/city-selector/_example/`

### 功能说明
可通过级联选择器逐级查看并选择省市。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 提供2种选择方式:
  - 展开级联面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的省市
- ✅ 用 Tag 展示已选省市
- ✅ 支持级联面板展示层级设置（默认2级）
- ✅ 支持多选 Tag 折叠展示
- ✅ 支持仅展示最后一级
- ✅ 支持搜索功能（默认开启）
- ✅ 支持多语言（中文/英文）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                   | 类型          | 可选值       | 默认值 |
| ----------------------- | ---------------------- | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                 | String/Number/Array | —            | —      |
| map                     | 配置对象               | Object        | —            | {}     |
| disabled                | 是否禁用               | Boolean       | —            | false  |
| clearable               | 是否可清空             | Boolean       | —            | true   |
| placeholder             | 占位符                 | String        | —            | —      |
| size                    | 输入框尺寸             | String        | medium/small | —      |
| filterable              | 是否可搜索             | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag      | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径       | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数      | Number        | —            | —      |
| lang                    | 语言                   | String        | cn/en        | 'cn'   |
| level                   | 展示层级               | Number        | —            | 2      |
| clearUnmatchedOptions   | 回显时清除不存在的选项 | Boolean       | —            | false  |
| promise                 | 自定义数据源方法       | Function      | —            | —      |

### 使用场景
- 地址选择中的省市选择
- 业务范围设置
- 报表统计中的省市筛选

---

## 8. HrManageSubjectSelector 管理主体选择器

### 组件信息
- **组件名**: `HrManageSubjectSelector` / `hr-manage-subject-selector`
- **文档路径**: `/components/manage-subject-selector/manage-subject-selector.md`
- **API 文档**: `/common/docs/web/api/manage-subject-selector.md`
- **示例路径**: `/components/manage-subject-selector/_example/`

### 功能说明
用于选择管理主体。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 用 Tag 展示已选内容
- ✅ 支持限制管理主体选择范围
  - 按管理主体类型限制（`range.manageUnitTypeIdList`）
  - 按管理主体 ID 限制（`range.manageUnitIdList`）
- ✅ 支持多语言（中文/英文）
- ✅ 支持仅展示最后一级
- ✅ 支持搜索功能（默认开启）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                   | 类型          | 可选值       | 默认值 |
| ----------------------- | ---------------------- | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                 | String/Number/Array | —            | —      |
| map                     | 配置对象               | Object        | —            | {}     |
| range                   | 范围限制对象           | Object        | —            | {}     |
| disabled                | 是否禁用               | Boolean       | —            | false  |
| clearable               | 是否可清空             | Boolean       | —            | true   |
| placeholder             | 占位符                 | String        | —            | —      |
| size                    | 输入框尺寸             | String        | medium/small | —      |
| filterable              | 是否可搜索             | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag      | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径       | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数      | Number        | —            | —      |
| lang                    | 语言                   | String        | cn/en        | 'cn'   |
| clearUnmatchedOptions   | 回显时清除不存在的选项 | Boolean       | —            | false  |
| data                    | 自定义数据源           | Array         | —            | []     |
| promise                 | 自定义数据源方法       | Function      | —            | —      |

### 使用场景
- 权限管理中的管理主体选择
- 数据隔离配置
- 报表统计中的管理主体筛选

---

## 9. HrOfficeBuildingSelector 办公大厦选择器

### 组件信息
- **组件名**: `HrOfficeBuildingSelector` / `hr-office-building-selector`
- **文档路径**: `/components/office-building-selector/office-building-selector.md`
- **API 文档**: `/common/docs/web/api/office-building-selector.md`
- **示例路径**: `/components/office-building-selector/_example/`

### 功能说明
办公大厦选择器，用于选择员工的办公大厦。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 提供2种选择方式:
  - 展开级联面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的办公大厦
- ✅ 用 Tag 展示已选办公大厦
- ✅ 支持 Tag 展示控制（折叠、仅显示最后一级等）
- ✅ 支持多语言（中文/英文）
- ✅ 支持限制展示的大区或国家
- ✅ 支持完整 value 值（4级: 地区id/国家id/城市id/办公大厦id）
- ✅ 支持展示层级设置（默认4级）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                           | 类型          | 可选值       | 默认值 |
| ----------------------- | ------------------------------ | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                         | String/Number/Array | —            | —      |
| map                     | 配置对象                       | Object        | —            | {}     |
| disabled                | 是否禁用                       | Boolean       | —            | false  |
| clearable               | 是否可清空                     | Boolean       | —            | true   |
| placeholder             | 占位符                         | String        | —            | —      |
| size                    | 输入框尺寸                     | String        | medium/small | —      |
| filterable              | 是否可搜索                     | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag              | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径               | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数              | Number        | —            | —      |
| lang                    | 语言                           | String        | cn/en        | 'cn'   |
| level                   | 展示层级                       | Number        | —            | 4      |
| includeRegionList       | 限制展示的大区                 | Array         | —            | []     |
| includeCountryList      | 限制展示的国家                 | Array         | —            | []     |
| clearUnmatchedOptions   | 回显时清除不存在的选项         | Boolean       | —            | false  |
| getLocationList         | 自定义数据源方法               | Function      | —            | —      |

### 使用场景
- 员工办公地点选择
- 会议室预定中的大厦选择
- 资产管理中的地点选择
- 访客登记中的大厦选择

---

## 10. HrPositionCascader 职位级联选择器

### 组件信息
- **组件名**: `HrPositionCascader` / `hr-position-cascader`
- **文档路径**: `/components/position-cascader/position-cascader.md`
- **API 文档**: `/common/docs/web/api/position-cascader.md`
- **示例路径**: `/components/position-cascader/_example/`

### 功能说明
当能一次性获取有清晰层级结构的职位集合时，可通过级联选择器逐级查看并选择。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 提供2种选择方式:
  - 展开级联面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的职位
- ✅ 用 Tag 展示已选职位
- ✅ 支持定制需要显示的职位簇（`includeClans` 属性）
- ✅ 支持级联面板展示层级设置（默认3级）
- ✅ 支持多选 Tag 折叠展示
- ✅ 支持仅展示最后一级
- ✅ 支持多语言（中文/英文）
- ✅ 支持搜索功能（默认开启）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                   | 类型          | 可选值       | 默认值 |
| ----------------------- | ---------------------- | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                 | String/Number/Array | —            | —      |
| map                     | 配置对象               | Object        | —            | {}     |
| disabled                | 是否禁用               | Boolean       | —            | false  |
| clearable               | 是否可清空             | Boolean       | —            | true   |
| placeholder             | 占位符                 | String        | —            | —      |
| size                    | 输入框尺寸             | String        | medium/small | —      |
| filterable              | 是否可搜索             | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag      | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径       | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数      | Number        | —            | —      |
| lang                    | 语言                   | String        | cn/en        | 'cn'   |
| level                   | 展示层级               | Number        | —            | 3      |
| includeClans            | 限制显示的职位簇       | Array         | —            | []     |
| clearUnmatchedOptions   | 回显时清除不存在的选项 | Boolean       | —            | false  |
| getPositionData         | 自定义数据源方法       | Function      | —            | —      |

### 使用场景
- 员工职位选择
- 招聘系统中的职位选择
- 职位权限配置
- 职业发展规划中的职位选择

---

## 11. HrPositionLevel 职级选择器

### 组件信息
- **组件名**: `HrPositionLevel` / `hr-position-level`
- **文档路径**: `/components/position-level/position-level.md`
- **API 文档**: `/common/docs/web/api/position-level.md`
- **示例路径**: `/components/position-level/_example/`

### 功能说明
用于选择职级。

### 核心功能
- ✅ 支持单选/多选模式（默认多选）
- ✅ 提供2种选择方式:
  - 展开下拉面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的职级
- ✅ 支持多选 Tag 折叠展示
- ✅ 支持限制职级选择范围:
  - 按通道族体系类型限制（`range.positionSystemTypeIdList`）
  - 按通道族体系限制（`range.positionSystemIdList`，默认 [1] 管理职级）
  - 按职位族限制（`range.positionClanIdList`）
  - 按职级 ID 限制（`range.positionLevelIdList`）
- ✅ 支持多语言（中文/英文）
- ✅ 支持仅展示最后一级
- ✅ 支持搜索功能（默认开启）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 特别说明
- ⚠️ 动态切换条件时，会清空已有选项

### 属性 (Props)

| 参数                    | 说明                   | 类型          | 可选值       | 默认值 |
| ----------------------- | ---------------------- | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                 | String/Number/Array | —            | —      |
| map                     | 配置对象               | Object        | —            | {}     |
| range                   | 范围限制对象           | Object        | —            | {}     |
| disabled                | 是否禁用               | Boolean       | —            | false  |
| clearable               | 是否可清空             | Boolean       | —            | true   |
| placeholder             | 占位符                 | String        | —            | —      |
| size                    | 输入框尺寸             | String        | medium/small | —      |
| filterable              | 是否可搜索             | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag      | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径       | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数      | Number        | —            | —      |
| lang                    | 语言                   | String        | cn/en        | 'cn'   |
| clearUnmatchedOptions   | 回显时清除不存在的选项 | Boolean       | —            | false  |
| data                    | 自定义数据源           | Array         | —            | []     |
| promise                 | 自定义数据源方法       | Function      | —            | —      |

### 使用场景
- 员工职级选择
- 职级权限配置
- 薪酬体系中的职级设置
- 职业发展规划

---

## 12. HrStaffSubtypeSelector 员工子类型选择器

### 组件信息
- **组件名**: `HrStaffSubtypeSelector` / `hr-staff-subtype-selector`
- **文档路径**: `/components/staff-subtype-selector/staff-subtype-selector.md`
- **API 文档**: `/common/docs/web/api/staff-subtype-selector.md`
- **示例路径**: `/components/staff-subtype-selector/_example/`

### 功能说明
可通过级联选择器逐级查看并选择员工子类型。

### 核心功能
- ✅ 支持单选/多选模式（默认单选）
- ✅ 提供2种选择方式:
  - 展开级联面板选择
  - 输入关键字搜索，使用下拉菜单展示筛选后的员工子类型
- ✅ 用 Tag 展示已选员工子类型
- ✅ 支持多选 Tag 折叠展示
- ✅ 支持限制展示的员工类型（`includeStaffTypeList` 属性，默认全展示）
- ✅ 支持级联面板展示层级设置（默认2级）
- ✅ 支持仅展示最后一级
- ✅ 支持搜索功能（默认开启）
- ✅ 支持多语言（中文/英文）
- ✅ 支持回显过滤
- ✅ 支持多种尺寸
- ✅ 支持自定义数据源

### 属性 (Props)

| 参数                    | 说明                   | 类型          | 可选值       | 默认值 |
| ----------------------- | ---------------------- | ------------- | ------------ | ------ |
| v-model / modelValue         | 绑定值                 | String/Number/Array | —            | —      |
| map                     | 配置对象               | Object        | —            | {}     |
| disabled                | 是否禁用               | Boolean       | —            | false  |
| clearable               | 是否可清空             | Boolean       | —            | true   |
| placeholder             | 占位符                 | String        | —            | —      |
| size                    | 输入框尺寸             | String        | medium/small | —      |
| filterable              | 是否可搜索             | Boolean       | —            | true   |
| collapseTags            | 多选时是否折叠Tag      | Boolean       | —            | false  |
| showAllLevels           | 是否显示完整路径       | Boolean       | —            | true   |
| tagsLength              | Tag最大展示文字数      | Number        | —            | —      |
| lang                    | 语言                   | String        | cn/en        | 'cn'   |
| level                   | 展示层级               | Number        | —            | 2      |
| includeStaffTypeList    | 限制展示的员工类型     | Array         | —            | []     |
| clearUnmatchedOptions   | 回显时清除不存在的选项 | Boolean       | —            | false  |
| promise                 | 自定义数据源方法       | Function      | —            | —      |

### 使用场景
- 员工分类管理
- 权限配置中的员工类型选择
- 报表统计中的员工类型筛选
- 薪酬福利配置中的员工类型选择

---

## 组件通用特性

### 1. 数据源
- 所有选择器的数据均来自远程服务器
- 支持自定义数据源接口
- 支持字段映射配置

### 2. 展示控制
- **Tag 展示**: 多选模式下支持 Tag 折叠、限制文字长度
- **完整路径**: 支持显示完整路径或仅最后一级
- **尺寸**: 支持 medium、small 等多种尺寸

### 3. 交互功能
- **搜索**: 大部分组件支持关键字搜索
- **多语言**: 部分组件支持中英文切换
- **回显过滤**: 支持回显时清除不存在的选项
- **禁用**: 支持禁用整个组件或特定选项

### 4. 高级功能
- **限制范围**: 支持按各种条件限制可选项范围
- **批量操作**: 员工选择器支持粘贴姓名批量选择
- **精简数据**: 工作地选择器支持精简全选数据
- **曾用名查询**: 员工选择器支持曾用名查询
