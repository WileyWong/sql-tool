# TDesign React 使用指南

## 目录
- [简介](#简介)
- [安装与配置](#安装与配置)
- [组件分类](#组件分类)
- [使用规范](#使用规范)
- [主题定制](#主题定制)
- [图标使用](#图标使用)
- [最佳实践](#最佳实践)

---

## 简介

TDesign 是腾讯的企业级设计系统，提供全面的 UI 组件和设计指南，用于构建一致、专业的 Web 应用程序。

### 核心特性
- 企业级组件库
- 完善的 TypeScript 支持
- 支持主题定制
- Tree-shaking 优化
- 丰富的图标库

---

## 安装与配置

### 1. 安装依赖

**必须使用以下固定版本：**

```bash
# 核心库
npm install tdesign-react@1.12.0

# 图标库
npm install tdesign-icons-react@0.5.0

# Less 编译支持
npm install less@4.3.0 --save-dev
```

### 2. 项目配置

#### Vite 配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@btn-height-default': '40px',
          // 在这里添加更多主题变量
        },
        javascriptEnabled: true
      }
    }
  }
});
```

#### TypeScript 配置 (tsconfig.app.json)

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

### 3. 样式导入

#### 按需导入（推荐）

```tsx
import { Button } from 'tdesign-react';
import 'tdesign-react/esm/style/index.js'; // 少量公共样式
```

#### 全局导入

```tsx
// 在 main.tsx 或 App.tsx 中
import 'tdesign-react/es/style/index.css';
```

---

## 组件分类

### 基础组件 (Base)

#### Button - 按钮
用于触发操作，如"删除"对象、"购买"商品等。

```tsx
import { Button } from 'tdesign-react';

function Example() {
  return (
    <>
      <Button variant="base">默认按钮</Button>
      <Button theme="primary">主要按钮</Button>
      <Button theme="success">成功按钮</Button>
      <Button theme="warning">警告按钮</Button>
      <Button theme="danger">危险按钮</Button>
      <Button disabled>禁用按钮</Button>
    </>
  );
}
```

#### Icon - 图标
作为 UI 的重要元素，影响整体界面风格。

```tsx
import { CloseIcon, CheckIcon } from 'tdesign-icons-react';

function Example() {
  return (
    <>
      <CloseIcon />
      <CheckIcon size="20px" />
      <CheckIcon style={{ color: 'red' }} />
    </>
  );
}
```

#### Typography - 排版
用于基础文本布局和样式。

```tsx
import { Typography } from 'tdesign-react';

const { Title, Paragraph, Text, Link } = Typography;

function Example() {
  return (
    <>
      <Title level="h2">二级标题</Title>
      <Paragraph ellipsis>这是一段可能会被省略的文本。</Paragraph>
      <Text type="danger" underline>警告文本</Text>
      <Link href="https://tdesign.tencent.com" target="_blank">
        TDesign 官网
      </Link>
    </>
  );
}
```

#### Divider - 分割线
用于将内容分组。

```tsx
import { Divider } from 'tdesign-react';

function Example() {
  return (
    <>
      <Divider />
      <Divider>文字内容</Divider>
      <Divider layout="vertical" />
    </>
  );
}
```

#### Link - 链接
用于导航到新页面，如内部项目链接或外部友情链接。

```tsx
import { Link } from 'tdesign-react';

function Example() {
  return (
    <>
      <Link href="https://tdesign.tencent.com">默认链接</Link>
      <Link theme="primary" underline>主色链接</Link>
      <Link disabled>禁用链接</Link>
    </>
  );
}
```

---

### 数据展示 (Data Display)

#### Table - 表格
用于以表格形式展示数据。

```tsx
import { Table } from 'tdesign-react';

function Example() {
  const columns = [
    { colKey: 'name', title: '姓名' },
    { colKey: 'age', title: '年龄' },
    { colKey: 'email', title: '邮箱' }
  ];

  const data = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey="id"
      bordered
    />
  );
}
```

#### Card - 卡片
用于在单个主题上显示内容和操作。

```tsx
import { Card } from 'tdesign-react';

function Example() {
  return (
    <Card
      title="卡片标题"
      actions="操作区域"
      bordered
      hoverShadow
    >
      <p>卡片内容</p>
    </Card>
  );
}
```

#### Tag - 标签
用于标记或分类内容。

```tsx
import { Tag } from 'tdesign-react';

function Example() {
  return (
    <>
      <Tag theme="default">默认标签</Tag>
      <Tag theme="primary">主要标签</Tag>
      <Tag theme="success">成功标签</Tag>
      <Tag theme="warning">警告标签</Tag>
      <Tag theme="danger">危险标签</Tag>
      <Tag closable>可关闭标签</Tag>
    </>
  );
}
```

#### Avatar - 头像
用于表示用户或对象。

```tsx
import { Avatar } from 'tdesign-react';

function Example() {
  return (
    <>
      <Avatar>张三</Avatar>
      <Avatar image="https://example.com/avatar.jpg" />
      <Avatar size="large">大</Avatar>
      <Avatar shape="round">圆</Avatar>
    </>
  );
}
```

#### Badge - 徽章
用于显示对象的状态或计数。

```tsx
import { Badge } from 'tdesign-react';

function Example() {
  return (
    <>
      <Badge count={5}>
        <div style={{ width: 40, height: 40, background: '#f0f0f0' }} />
      </Badge>
      <Badge dot>
        <div style={{ width: 40, height: 40, background: '#f0f0f0' }} />
      </Badge>
    </>
  );
}
```

#### List - 列表
用于显示一系列内容。

```tsx
import { List } from 'tdesign-react';

const { ListItem, ListItemMeta } = List;

function Example() {
  return (
    <List>
      <ListItem>
        <ListItemMeta title="列表标题" description="列表描述" />
      </ListItem>
      <ListItem>
        <ListItemMeta title="列表标题2" description="列表描述2" />
      </ListItem>
    </List>
  );
}
```

#### Statistic - 统计数值
用于显示数值数据。

```tsx
import { Statistic } from 'tdesign-react';

function Example() {
  return (
    <Statistic
      title="总资产"
      value={62.58}
      unit="%"
      trend="increase"
    />
  );
}
```

#### Image - 图片
用于显示图片。

```tsx
import { Image } from 'tdesign-react';

function Example() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1234567890"
      fit="cover"
      lazy
      error="加载失败"
    />
  );
}
```

#### Tooltip - 文字提示
用于在悬停或聚焦时显示提示信息。

```tsx
import { Tooltip, Button } from 'tdesign-react';

function Example() {
  return (
    <Tooltip content="这是提示文字">
      <Button>悬停显示提示</Button>
    </Tooltip>
  );
}
```

#### Popover - 气泡卡片
用于在悬停或点击时显示额外内容。

```tsx
import { Popover, Button } from 'tdesign-react';

function Example() {
  return (
    <Popover content="这是气泡内容" placement="top">
      <Button>点击显示</Button>
    </Popover>
  );
}
```

#### Timeline - 时间轴
用于按时间顺序显示一系列事件。

```tsx
import { Timeline } from 'tdesign-react';

const { TimelineItem } = Timeline;

function Example() {
  return (
    <Timeline>
      <TimelineItem label="2024-01-01">第一个事件</TimelineItem>
      <TimelineItem label="2024-01-02">第二个事件</TimelineItem>
      <TimelineItem label="2024-01-03">第三个事件</TimelineItem>
    </Timeline>
  );
}
```

#### Collapse - 折叠面板
用于显示或隐藏内容。

```tsx
import { Collapse } from 'tdesign-react';

const { Panel } = Collapse;

function Example() {
  return (
    <Collapse defaultValue={['1']}>
      <Panel header="面板1" value="1">
        面板1的内容
      </Panel>
      <Panel header="面板2" value="2">
        面板2的内容
      </Panel>
    </Collapse>
  );
}
```

---

### 数据录入 (Data Entry)

#### Form - 表单
用于收集和验证用户输入。

```tsx
import { Form, Input, Button } from 'tdesign-react';

const { FormItem } = Form;

function Example() {
  const [form] = Form.useForm();

  const onSubmit = (values: any) => {
    console.log('表单值:', values);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormItem label="用户名" name="username" rules={[{ required: true }]}>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="密码" name="password" rules={[{ required: true }]}>
        <Input type="password" placeholder="请输入密码" />
      </FormItem>
      <FormItem>
        <Button type="submit" theme="primary">提交</Button>
      </FormItem>
    </Form>
  );
}
```

#### Input - 输入框
用于输入文本。

```tsx
import { Input } from 'tdesign-react';

function Example() {
  return (
    <>
      <Input placeholder="请输入内容" />
      <Input type="password" placeholder="请输入密码" />
      <Input disabled placeholder="禁用状态" />
      <Input prefixIcon={<SearchIcon />} placeholder="带前缀图标" />
    </>
  );
}
```

#### Select - 选择器
用于从下拉列表中选择一个或多个选项。

```tsx
import { Select } from 'tdesign-react';

function Example() {
  const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ];

  return (
    <>
      <Select
        options={options}
        placeholder="请选择"
      />
      <Select
        options={options}
        multiple
        placeholder="多选"
      />
    </>
  );
}
```

#### Checkbox - 复选框
用于从一组选项中选择一个或多个。

```tsx
import { Checkbox } from 'tdesign-react';

const { Group: CheckboxGroup } = Checkbox;

function Example() {
  return (
    <>
      <Checkbox>选项</Checkbox>
      <CheckboxGroup defaultValue={['1']}>
        <Checkbox value="1">选项1</Checkbox>
        <Checkbox value="2">选项2</Checkbox>
        <Checkbox value="3">选项3</Checkbox>
      </CheckboxGroup>
    </>
  );
}
```

#### Radio - 单选框
用于从一组选项中选择单个选项。

```tsx
import { Radio } from 'tdesign-react';

const { Group: RadioGroup } = Radio;

function Example() {
  return (
    <RadioGroup defaultValue="1">
      <Radio value="1">选项1</Radio>
      <Radio value="2">选项2</Radio>
      <Radio value="3">选项3</Radio>
    </RadioGroup>
  );
}
```

#### Switch - 开关
用于在两种状态之间切换。

```tsx
import { Switch } from 'tdesign-react';

function Example() {
  return (
    <>
      <Switch defaultValue={true} />
      <Switch label={['开', '关']} />
    </>
  );
}
```

#### DatePicker - 日期选择器
用于选择日期。

```tsx
import { DatePicker } from 'tdesign-react';

function Example() {
  return (
    <>
      <DatePicker placeholder="请选择日期" />
      <DatePicker mode="year" placeholder="选择年份" />
      <DatePicker mode="month" placeholder="选择月份" />
    </>
  );
}
```

#### TimePicker - 时间选择器
用于选择时间。

```tsx
import { TimePicker } from 'tdesign-react';

function Example() {
  return (
    <TimePicker placeholder="请选择时间" />
  );
}
```

#### Upload - 上传
用于上传文件。

```tsx
import { Upload, Button } from 'tdesign-react';

function Example() {
  return (
    <Upload action="https://example.com/upload">
      <Button>选择文件</Button>
    </Upload>
  );
}
```

#### Slider - 滑块
用于从轨道中选择值或范围。

```tsx
import { Slider } from 'tdesign-react';

function Example() {
  return (
    <>
      <Slider defaultValue={50} />
      <Slider range defaultValue={[20, 60]} />
    </>
  );
}
```

#### InputNumber - 数字输入框
用于输入数值。

```tsx
import { InputNumber } from 'tdesign-react';

function Example() {
  return (
    <InputNumber
      defaultValue={0}
      min={0}
      max={100}
      step={1}
    />
  );
}
```

#### Textarea - 多行文本框
用于输入多行文本。

```tsx
import { Textarea } from 'tdesign-react';

function Example() {
  return (
    <Textarea
      placeholder="请输入内容"
      rows={4}
      maxlength={200}
    />
  );
}
```

---

### 反馈 (Feedback)

#### Message - 全局提示
用于显示全局反馈消息。

```tsx
import { Message, Button } from 'tdesign-react';

function Example() {
  const showMessage = () => {
    Message.success('操作成功');
  };

  return (
    <>
      <Button onClick={() => Message.info('这是一条信息')}>信息</Button>
      <Button onClick={() => Message.success('操作成功')}>成功</Button>
      <Button onClick={() => Message.warning('警告信息')}>警告</Button>
      <Button onClick={() => Message.error('错误信息')}>错误</Button>
    </>
  );
}
```

#### Notification - 通知
用于显示全局通知。

```tsx
import { Notification, Button } from 'tdesign-react';

function Example() {
  return (
    <Button onClick={() => {
      Notification.success({
        title: '通知标题',
        content: '这是通知内容',
        duration: 3000
      });
    }}>
      显示通知
    </Button>
  );
}
```

#### Dialog - 对话框
用于显示重要信息或需要用户确认的操作。

```tsx
import { Dialog, Button } from 'tdesign-react';
import { useState } from 'react';

function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>打开对话框</Button>
      <Dialog
        visible={visible}
        header="对话框标题"
        onClose={() => setVisible(false)}
        onConfirm={() => {
          console.log('确认');
          setVisible(false);
        }}
      >
        对话框内容
      </Dialog>
    </>
  );
}
```

#### Drawer - 抽屉
用于从屏幕边缘滑入显示内容。

```tsx
import { Drawer, Button } from 'tdesign-react';
import { useState } from 'react';

function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>打开抽屉</Button>
      <Drawer
        visible={visible}
        header="抽屉标题"
        onClose={() => setVisible(false)}
      >
        抽屉内容
      </Drawer>
    </>
  );
}
```

#### Progress - 进度条
用于显示任务的进度。

```tsx
import { Progress } from 'tdesign-react';

function Example() {
  return (
    <>
      <Progress percentage={50} />
      <Progress percentage={100} status="success" />
      <Progress percentage={30} status="warning" />
      <Progress percentage={80} status="error" />
      <Progress theme="circle" percentage={75} />
    </>
  );
}
```

#### Alert - 警告提示
用于显示重要信息或警告消息。

```tsx
import { Alert } from 'tdesign-react';

function Example() {
  return (
    <>
      <Alert theme="info" message="这是一条信息提示" />
      <Alert theme="success" message="操作成功" />
      <Alert theme="warning" message="警告信息" />
      <Alert theme="error" message="错误信息" />
    </>
  );
}
```

#### Popconfirm - 气泡确认框
用于确认用户操作。

```tsx
import { Popconfirm, Button } from 'tdesign-react';

function Example() {
  return (
    <Popconfirm
      content="确定要删除吗？"
      onConfirm={() => console.log('确认删除')}
    >
      <Button theme="danger">删除</Button>
    </Popconfirm>
  );
}
```

#### Skeleton - 骨架屏
用于在内容加载时显示占位符。

```tsx
import { Skeleton } from 'tdesign-react';

function Example() {
  return (
    <>
      <Skeleton animation="gradient" />
      <Skeleton rowCol={[1, 1, { width: '70%' }]} />
    </>
  );
}
```

---

### 导航 (Navigation)

#### Menu - 菜单
用于导航和菜单选择。

```tsx
import { Menu } from 'tdesign-react';

const { MenuItem, SubMenu } = Menu;

function Example() {
  return (
    <Menu>
      <MenuItem value="1">菜单项1</MenuItem>
      <MenuItem value="2">菜单项2</MenuItem>
      <SubMenu value="sub" title="子菜单">
        <MenuItem value="3">子菜单项1</MenuItem>
        <MenuItem value="4">子菜单项2</MenuItem>
      </SubMenu>
    </Menu>
  );
}
```

#### Tabs - 标签页
用于在不同视图或内容之间切换。

```tsx
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

function Example() {
  return (
    <Tabs defaultValue="1">
      <TabPanel value="1" label="标签1">
        内容1
      </TabPanel>
      <TabPanel value="2" label="标签2">
        内容2
      </TabPanel>
      <TabPanel value="3" label="标签3">
        内容3
      </TabPanel>
    </Tabs>
  );
}
```

#### Breadcrumb - 面包屑
用于指示当前页面在导航层次结构中的位置。

```tsx
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>产品</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

#### Pagination - 分页
用于将内容分页。

```tsx
import { Pagination } from 'tdesign-react';

function Example() {
  return (
    <Pagination
      total={100}
      pageSize={10}
      onChange={(pageInfo) => console.log(pageInfo)}
    />
  );
}
```

#### Steps - 步骤条
用于显示多步骤流程的进度。

```tsx
import { Steps } from 'tdesign-react';

const { StepItem } = Steps;

function Example() {
  return (
    <Steps current={1}>
      <StepItem title="步骤1" content="步骤1描述" />
      <StepItem title="步骤2" content="步骤2描述" />
      <StepItem title="步骤3" content="步骤3描述" />
    </Steps>
  );
}
```

#### Dropdown - 下拉菜单
用于显示操作列表或选项。

```tsx
import { Dropdown, Button } from 'tdesign-react';

function Example() {
  const options = [
    { content: '选项1', value: '1' },
    { content: '选项2', value: '2' },
    { content: '选项3', value: '3' }
  ];

  return (
    <Dropdown options={options}>
      <Button>下拉菜单</Button>
    </Dropdown>
  );
}
```

#### Anchor - 锚点
用于页面锚点导航。

```tsx
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

function Example() {
  return (
    <Anchor>
      <AnchorItem href="#section1" title="第一节" />
      <AnchorItem href="#section2" title="第二节" />
      <AnchorItem href="#section3" title="第三节" />
    </Anchor>
  );
}
```

---

### 布局 (Layout)

#### Layout - 布局
用于构建页面的基本结构。

```tsx
import { Layout } from 'tdesign-react';

const { Header, Content, Footer, Aside } = Layout;

function Example() {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Aside>Aside</Aside>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}
```

#### Space - 间距
用于设置元素之间的间距。

```tsx
import { Space, Button } from 'tdesign-react';

function Example() {
  return (
    <>
      <Space>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
      
      <Space direction="vertical">
        <Button>按钮1</Button>
        <Button>按钮2</Button>
      </Space>
      
      <Space size="large">
        <Button>按钮1</Button>
        <Button>按钮2</Button>
      </Space>
    </>
  );
}
```

#### Grid - 栅格
用于构建响应式布局。

```tsx
import { Row, Col } from 'tdesign-react';

function Example() {
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
      </Row>
    </>
  );
}
```

---

### 其他 (Other)

#### ConfigProvider - 全局配置
用于为组件提供全局配置。

```tsx
import { ConfigProvider, Button } from 'tdesign-react';

function Example() {
  return (
    <ConfigProvider globalConfig={{ 
      locale: 'zh-CN',
      // 其他全局配置
    }}>
      <Button>按钮</Button>
    </ConfigProvider>
  );
}
```

#### Watermark - 水印
用于为内容添加水印。

```tsx
import { Watermark } from 'tdesign-react';

function Example() {
  return (
    <Watermark content="TDesign">
      <div style={{ height: 400 }}>
        内容区域
      </div>
    </Watermark>
  );
}
```

---

## 使用规范

### 1. 导入规范

#### ✅ 正确示例

```tsx
// 第三方库：直接使用包名导入
import React, { useState, useEffect } from 'react';
import { Button, Input } from 'tdesign-react';
import { CloseIcon } from 'tdesign-icons-react';

// 本地文件：使用精确的相对路径
import { UserService } from './services/user';
import { formatDate } from '../utils/date';
import type { User } from '../../types/user';
```

#### ❌ 错误示例

```tsx
// ❌ 不要在第三方库前加路径前缀
import { Button } from '@/tdesign-react';

// ❌ 不要使用错误的相对路径
import { UserService } from 'services/user';
```

### 2. 类型定义规范

所有需要在其他文件中使用的类型、接口、类必须使用 `export` 关键字。

```tsx
// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
```

### 3. 样式规范

#### 优先使用 Tailwind CSS

```tsx
function Example() {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <span className="text-lg font-semibold">标题</span>
      <Button>操作</Button>
    </div>
  );
}
```

#### 交互状态样式

```tsx
function Example() {
  return (
    <button className="
      px-4 py-2 bg-blue-500 text-white rounded
      hover:bg-blue-600
      active:bg-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:bg-gray-300 disabled:cursor-not-allowed
    ">
      按钮
    </button>
  );
}
```

### 4. 错误处理规范

**不要使用 try-catch**，应使用 `console.error` 输出错误。

```tsx
// ✅ 正确
function fetchData() {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('获取数据失败:', err));
}

// ❌ 错误
function fetchData() {
  try {
    // ...
  } catch (error) {
    // ...
  }
}
```

### 5. 表单输入规范

#### 使用原生 input 标签

```tsx
// ✅ 正确
<input 
  type="text" 
  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
  placeholder="请输入内容"
/>

// ❌ 错误：不要用 div 模拟 input
<div className="input-like" contentEditable>
  输入内容
</div>
```

#### 使用原生 button 标签

```tsx
// ✅ 正确
<button 
  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
  onClick={handleClick}
>
  点击
</button>

// ❌ 错误：不要用 div 模拟 button
<div className="button-like" onClick={handleClick}>
  点击
</div>
```

### 6. 布局规范

#### 导航栏固定定位

```tsx
function Layout() {
  return (
    <div className="min-h-screen">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        导航栏内容
      </nav>
      
      {/* 主要内容区域 - 设置顶部 padding */}
      <main className="pt-16">
        页面内容
      </main>
      
      {/* 底部导航栏 */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        底部内容
      </footer>
    </div>
  );
}
```

### 7. 内容规范

- 内容文本必须真实且丰富
- **严格禁止**使用占位符文本
- 示例：生成"北欧风格布艺沙发"而不是"产品描述"

```tsx
// ✅ 正确
<Card title="北欧风格布艺沙发">
  <p>这款北欧风格布艺沙发采用优质亚麻面料，填充高密度海绵，
     坐感舒适。简约的线条设计，适合现代家居风格...</p>
</Card>

// ❌ 错误
<Card title="产品名称">
  <p>产品描述</p>
</Card>
```

---

## 主题定制

### 使用 Less 变量定制

在 `vite.config.ts` 中配置：

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 主色
          '@brand-color': '#0052D9',
          '@brand-color-hover': '#266FE8',
          '@brand-color-active': '#0034B5',
          
          // 按钮
          '@btn-height-default': '40px',
          '@btn-border-radius': '6px',
          
          // 字体
          '@font-size-base': '14px',
          '@font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          
          // 边框
          '@border-radius-default': '6px',
          
          // 阴影
          '@shadow-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
          '@shadow-2': '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        javascriptEnabled: true
      }
    }
  }
});
```

### 常用主题变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `@brand-color` | 主品牌色 | `#0052D9` |
| `@warning-color` | 警告色 | `#ED7B2F` |
| `@error-color` | 错误色 | `#D54941` |
| `@success-color` | 成功色 | `#00A870` |
| `@font-size-base` | 基础字号 | `14px` |
| `@border-radius-default` | 默认圆角 | `3px` |

---

## 图标使用

### 安装图标库

```bash
npm install tdesign-icons-react@0.5.0
```

### 基本用法

```tsx
import { 
  CloseIcon, 
  CheckIcon, 
  SearchIcon,
  UserIcon,
  SettingIcon 
} from 'tdesign-icons-react';

function Example() {
  return (
    <div className="flex gap-4">
      <CloseIcon />
      <CheckIcon size="20px" />
      <SearchIcon style={{ color: '#0052D9' }} />
      <UserIcon className="text-blue-500" />
      <SettingIcon onClick={() => console.log('点击')} />
    </div>
  );
}
```

### 图标属性

- `size`: 图标大小 (如 `"20px"`, `"1em"`)
- `style`: 自定义样式对象
- `className`: CSS 类名
- `onClick`: 点击事件处理

### 常用图标示例

```tsx
import {
  // 操作类
  AddIcon, DeleteIcon, EditIcon, SearchIcon, CloseIcon,
  
  // 方向类
  ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon,
  
  // 状态类
  CheckCircleIcon, CloseCircleIcon, ErrorCircleIcon, InfoCircleIcon,
  
  // 用户类
  UserIcon, UsergroupIcon, UserAddIcon,
  
  // 文件类
  FileIcon, FolderIcon, FileAddIcon, FileImageIcon,
  
  // 通用类
  HomeIcon, SettingIcon, MenuIcon, HeartIcon
} from 'tdesign-icons-react';
```

### 图标分类

TDesign 提供超过 1000+ 个图标，主要分类包括：

- **基础图标**：Add, Close, Check, Search 等
- **方向图标**：Arrow, Chevron, Caret 等
- **文件图标**：File, Folder, Document 等
- **用户图标**：User, Avatar, Member 等
- **系统图标**：Setting, System, Control 等
- **品牌图标**：Logo 系列（Github, Wechat 等）

### 图标查找

访问 TDesign 官网图标页面查看所有可用图标：
[https://tdesign.tencent.com/react/components/icon](https://tdesign.tencent.com/react/components/icon)

---

## 最佳实践

### 1. 性能优化

#### 按需导入组件

```tsx
// ✅ 推荐：按需导入
import { Button } from 'tdesign-react';

// ❌ 不推荐：全量导入
import TDesign from 'tdesign-react';
```

#### 使用 React.memo 优化

```tsx
import { memo } from 'react';
import { Card } from 'tdesign-react';

const UserCard = memo(({ user }) => (
  <Card title={user.name}>
    {user.description}
  </Card>
));
```

### 2. 响应式设计

```tsx
import { Row, Col } from 'tdesign-react';

function ResponsiveLayout() {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>响应式卡片 1</Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>响应式卡片 2</Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>响应式卡片 3</Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card>响应式卡片 4</Card>
      </Col>
    </Row>
  );
}
```

### 3. 表单验证

```tsx
import { Form, Input, Button } from 'tdesign-react';

function LoginForm() {
  const [form] = Form.useForm();

  const rules = {
    username: [
      { required: true, message: '用户名不能为空' },
      { min: 3, message: '用户名至少3个字符' }
    ],
    password: [
      { required: true, message: '密码不能为空' },
      { min: 6, message: '密码至少6个字符' }
    ]
  };

  const handleSubmit = (values: any) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      rules={rules}
      labelWidth={80}
    >
      <Form.FormItem label="用户名" name="username">
        <Input placeholder="请输入用户名" />
      </Form.FormItem>
      
      <Form.FormItem label="密码" name="password">
        <Input type="password" placeholder="请输入密码" />
      </Form.FormItem>
      
      <Form.FormItem>
        <Button type="submit" theme="primary" block>
          登录
        </Button>
      </Form.FormItem>
    </Form>
  );
}
```

### 4. 数据加载状态

```tsx
import { useState, useEffect } from 'react';
import { Table, Loading } from 'tdesign-react';

function DataTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载失败:', err);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading text="加载中..." />;
  }

  return <Table data={data} columns={columns} />;
}
```

### 5. 组件组合使用

```tsx
import { Card, Space, Button, Tag, Avatar } from 'tdesign-react';
import { EditIcon, DeleteIcon } from 'tdesign-icons-react';

function UserCard({ user }) {
  return (
    <Card
      title={
        <Space>
          <Avatar>{user.name[0]}</Avatar>
          <span>{user.name}</span>
          <Tag theme={user.status === 'active' ? 'success' : 'default'}>
            {user.status}
          </Tag>
        </Space>
      }
      actions={
        <Space>
          <Button icon={<EditIcon />} variant="text">编辑</Button>
          <Button icon={<DeleteIcon />} variant="text" theme="danger">
            删除
          </Button>
        </Space>
      }
    >
      <p>邮箱: {user.email}</p>
      <p>部门: {user.department}</p>
    </Card>
  );
}
```

### 6. 全局配置

```tsx
// main.tsx 或 App.tsx
import { ConfigProvider } from 'tdesign-react';
import zhCN from 'tdesign-react/es/locale/zh_CN';

function App() {
  return (
    <ConfigProvider globalConfig={zhCN}>
      {/* 你的应用组件 */}
    </ConfigProvider>
  );
}
```

### 7. 暗色模式支持

```tsx
import { useState } from 'react';
import { Switch } from 'tdesign-react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = (value: boolean) => {
    setDarkMode(value);
    document.documentElement.setAttribute(
      'theme-mode', 
      value ? 'dark' : 'light'
    );
  };

  return (
    <Switch 
      label={['🌙', '☀️']}
      value={darkMode}
      onChange={toggleTheme}
    />
  );
}
```

---

## 常见问题

### 1. 样式不生效

**问题**：组件样式没有正确显示。

**解决方案**：
- 确保正确导入样式文件
- 检查 Less 配置是否正确
- 确认 `javascriptEnabled: true` 已设置

### 2. 图标无法显示

**问题**：图标组件不显示或报错。

**解决方案**：
- 确保安装了 `tdesign-icons-react`
- 检查图标名称是否正确
- 确认版本兼容性

### 3. TypeScript 类型错误

**问题**：TypeScript 提示类型错误。

**解决方案**：
- 确保安装了 `@types/react`
- 更新 TypeScript 配置
- 使用正确的类型导入

### 4. 主题定制不生效

**问题**：修改 Less 变量后主题没有变化。

**解决方案**：
- 检查 vite.config.ts 配置
- 确保变量名正确
- 重启开发服务器

---

## 快速开始项目

### 使用 TDesign CLI

```bash
# 安装 CLI
npm i tdesign-starter-cli@latest -g

# 创建项目
td-starter init my-project -type react

# 进入项目
cd my-project

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 项目模板选项

- **lite**: 轻量级模板（推荐）
- **all**: 完整功能模板

### 构建工具选择

- **vite**: 快速开发体验（推荐）
- **webpack**: 传统构建工具

---

## 资源链接

- **官方网站**: [https://tdesign.tencent.com](https://tdesign.tencent.com)
- **React 文档**: [https://tdesign.tencent.com/react/overview](https://tdesign.tencent.com/react/overview)
- **图标库**: [https://tdesign.tencent.com/react/components/icon](https://tdesign.tencent.com/react/components/icon)
- **GitHub**: [https://github.com/Tencent/tdesign-react](https://github.com/Tencent/tdesign-react)
- **设计指南**: [https://tdesign.tencent.com/design/](https://tdesign.tencent.com/design/)

---

## 总结

TDesign React 是一个功能完善、易于使用的企业级组件库。通过遵循本指南中的最佳实践和规范，你可以快速构建出高质量、一致性强的 Web 应用程序。

**关键要点**：
- 使用固定版本避免兼容性问题
- 遵循导入和命名规范
- 结合 Tailwind CSS 实现灵活样式
- 充分利用组件的各种特性和配置
- 注重性能优化和用户体验

祝你使用愉快！🎉
