# Excel 测试套件规则

> ⚠️ **本文档为强制规范，非建议性指引。所有内容必须严格遵循。**

> 📌 **权威来源**：本文档是操作类型（35项）、断言类型（22项）、等待策略（10项）等枚举定义的**唯一权威来源**。YAML 规则和代码生成均以此为准。

本文档定义 E2E 测试用例 Excel 文件的格式与校验规则。

## 目录

- [Sheet 结构总览](#sheet-结构总览)
- [Sheet0: 用例-定义](#sheet0-用例-定义)
- [Sheet1: 用例-执行步骤](#sheet1-用例-执行步骤)
- [Sheet2: 用例-测试数据](#sheet2-用例-测试数据)
- [Sheet3: 执行-执行计划](#sheet3-执行-执行计划)
- [Sheet4: 配置-用户](#sheet4-配置-用户)
- [Sheet5: 配置-全局](#sheet5-配置-全局)
- [Sheet6: 元数据-POM](#sheet6-元数据-pom)
- [Sheet7: 元数据-枚举定义](#sheet7-元数据-枚举定义)
- [Sheet8: 元数据-操作类型参考](#sheet8-元数据-操作类型参考) *(参考)*
- [Sheet9: 元数据-等待策略参考](#sheet9-元数据-等待策略参考) *(参考)*
- [Sheet10: 元数据-Mock场景](#sheet10-元数据-mock场景)
- [变量引用语法](#变量引用语法)

---

## Sheet 结构总览

```
TestSuite.xlsx
│
├── 【核心数据 Sheet】
├── Sheet0: 用例-定义           ← 定义测什么（稳定）
├── Sheet1: 用例-执行步骤        ← 定义怎么测（稳定）
├── Sheet2: 用例-测试数据        ← 统一测试数据管理（KV格式）
├── Sheet3: 执行-执行计划        ← 本次执行范围（高频修改）
├── Sheet4: 配置-用户           ← 账号信息（较稳定）
├── Sheet5: 配置-全局           ← 环境配置（较稳定）
├── Sheet6: 元数据-POM          ← 页面元素定位（MCP 生成 + 人工补充）
├── Sheet7: 元数据-枚举定义      ← 所有下拉选项的数据源（集中管理）
│
├── 【参考文档 Sheet】（仅供查阅，不参与代码执行）
├── Sheet8: 元数据-操作类型参考   ← 操作类型说明文档 📖
├── Sheet9: 元数据-等待策略参考   ← 等待策略说明文档 📖
│
├── 【扩展功能 Sheet】
└── Sheet10: 元数据-Mock场景    ← API Mock 配置（SPA专用）
```

> **说明**：Sheet8 和 Sheet9 是参考性质的文档，提供操作类型和等待策略的详细说明，帮助用户理解各选项的含义和用法。这两个 Sheet 不参与校验和代码生成，可根据需要选择是否包含。

---

## Sheet0: 用例-定义

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 用例ID | string | ✅ | 唯一标识，建议格式: TC-系统-模块-用例名-编号 |
| 系统 | string | | 所属系统/产品，如：OA、ERP、Mall |
| 用例名称 | string | ✅ | 简洁描述用例目的 |
| 模块 | string | ✅ | 功能模块，如：登录、订单、上传 |
| 优先级 | enum | ✅ | P0/P1/P2/P3 |
| 前置条件 | string | | 执行前提，如"用户已注册" |
| 标签 | string | | 逗号分隔，用于筛选：冒烟,回归,异常 |
| 用例状态 | enum | | 草稿/待审核/已审核/已废弃 |
| 描述 | string | | 用例详细说明 |

---

## Sheet1: 用例-执行步骤

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 用例ID | string | ✅ | 关联用例定义 |
| 步骤序号 | number | ✅ | 执行顺序，从 1 开始 |
| 步骤描述 | string | | 步骤说明 |
| 操作类型 | enum | ✅ | 动作类型 |
| 目标元素 | string | 条件 | 元素定位器或 POM 引用 |
| 输入值 | string | 条件 | 操作参数，支持占位符 |
| 等待策略 | enum | 条件 | SPA等待策略 |
| 等待超时 | number | | 等待超时时间(ms) |
| 断言类型 | enum | 条件 | 验证方式 |
| 期望值 | string | 条件 | 预期结果，支持占位符 |
| API模式 | string | | API路径模式，用于Mock/等待 |
| Mock数据 | string | | JSON格式的Mock响应数据 |
| 备注 | string | | 步骤说明 |

---

## Sheet2: 用例-测试数据

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 数据集 | string | ✅ | 数据集标识，如 login_normal |
| 字段名 | string | ✅ | 字段名称（技术名） |
| 字段说明 | string | | 字段中文说明 |
| 值 | string | | 字段值 |

---

## Sheet3: 执行-执行计划

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 序号 | number | ✅ | 执行顺序 |
| 用例ID | string | ✅ | 关联用例定义 |
| 执行用户 | string | ✅ | 用户ID，关联用户配置 |
| 数据集 | string | | 测试数据集名称 |
| Mock场景 | string | | Mock场景ID |
| 状态隔离 | string | | 清理localStorage/sessionStorage |
| 覆盖配置 | string | | JSON格式的配置覆盖 |
| 启用 | enum | | 是/否 |
| 执行状态 | enum | | 待执行/执行中/通过/失败/跳过/阻塞 |
| 备注 | string | | 执行说明 |

---

## Sheet4: 配置-用户

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 用户ID | string | ✅ | 唯一标识，如 U001 |
| 用户名 | string | ✅ | 登录账号 |
| 密码 | string | ✅ | 登录密码 |
| 角色 | string | | 角色分类 |
| 权限 | string | | 权限描述 |
| 状态 | enum | | 启用/禁用 |
| 备注 | string | | 补充说明 |

---

## Sheet5: 配置-全局

采用 **配置分类 + 配置项 + 配置值 + 说明** 四列格式，便于分类管理。

### ⚠️ 强制约束：必须包含以下全部配置项

| 配置分类 | 配置项 | 配置值 | 说明 |
|----------|--------|--------|------|
| **基础配置** | baseURL | http://localhost:3000 | 应用基础 URL |
| 基础配置 | testDir | ./tests | 测试文件目录 |
| **超时配置** | timeout | 60000 | 全局超时(ms) |
| 超时配置 | expect.timeout | 10000 | 断言超时(ms) |
| 超时配置 | actionTimeout | 15000 | 操作超时(ms) |
| 超时配置 | navigationTimeout | 30000 | 导航超时(ms) |
| **浏览器配置** | headless | true | 无头模式 |
| 浏览器配置 | slowMo | 0 | 慢动作延迟(ms) |
|| 浏览器配置 | locale | zh-CN | 浏览器语言（中文） || 浏览器配置 | deviceScaleFactor | 1 | 设备像素比 |
| **截图录屏** | screenshot | only-on-failure | 截图策略：always/only-on-failure/off |
| 截图录屏 | video | retain-on-failure | 录屏策略：on/off/retain-on-failure |
| 截图录屏 | trace | retain-on-failure | Trace 策略：on/off/retain-on-failure |
| **重试配置** | retries | 0 | 本地重试次数 |
| 重试配置 | retries.ci | 2 | CI 环境重试次数 |
| **SPA 配置** | defaultWaitStrategy | 网络空闲 | 默认等待策略 |
| SPA 配置 | reducedMotion | reduce | 禁用动画 |
| **状态隔离** | clearLocalStorage | true | 清理 localStorage |
| 状态隔离 | clearSessionStorage | true | 清理 sessionStorage |
| 状态隔离 | clearCookies | true | 清理 Cookie |
| 状态隔离 | clearIndexedDB | false | 清理 IndexedDB |
| **认证配置** | storageStatePath | ./auth.json | 认证状态文件 |
| 认证配置 | globalSetup | ./global-setup.js | 全局 Setup 脚本 |
| **输出配置** | outputDir | ./workspace/e2e-test | 输出目录（详见 output-spec.md） |
| 输出配置 | reporterFormat | html,json | 报告格式 |

**配置项检查清单（共 25 项）**：
```
配置-全局完整性检查：
基础配置（2项）：
- [ ] baseURL
- [ ] testDir

超时配置（4项）：
- [ ] timeout
- [ ] expect.timeout
- [ ] actionTimeout
- [ ] navigationTimeout

浏览器配置（4项）：
- [ ] headless
- [ ] slowMo
- [ ] locale
- [ ] deviceScaleFactor

截图录屏（3项）：
- [ ] screenshot
- [ ] video
- [ ] trace

重试配置（2项）：
- [ ] retries
- [ ] retries.ci

SPA配置（2项）：
- [ ] defaultWaitStrategy
- [ ] reducedMotion

状态隔离（4项）：
- [ ] clearLocalStorage
- [ ] clearSessionStorage
- [ ] clearCookies
- [ ] clearIndexedDB

认证配置（2项）：
- [ ] storageStatePath
- [ ] globalSetup

输出配置（2项）：
- [ ] outputDir（默认 workspace/e2e-test/）
- [ ] reporterFormat
```

> **说明**：
> - 以上 25 项配置必须全部包含，配置值可根据实际情况调整
> - 传统 Web 应用可保持默认值
> - SPA 应用建议调整状态隔离和 SPA 配置的值

---

## Sheet6: 元数据-POM

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 页面ID | string | ✅ | 页面唯一标识，如 login、dashboard |
| 页面名称 | string | ✅ | 可读名称，如 登录页、首页 |
| 页面URL | string | ✅ | 页面 URL 路径，如 /login、/dashboard |
| 元素ID | string | ✅ | 元素唯一标识，如 username、submitBtn |
| 元素名称 | string | ✅ | 可读名称，如 用户名输入框、登录按钮 |
| 定位方式 | enum | | CSS选择器/XPath/ID/Name/Class/Text/TestId 等 |
| 定位值 | string | ✅ | 具体的定位表达式，如 #username、.login-form |
| 等待策略 | enum | | 元素等待策略：可见/隐藏/可点击/可编辑 等 |
| 等待超时 | number | | 等待超时时间(ms)，默认 10000 |
| API模式 | string | | 关联的 API 路径，用于等待数据加载 |
| 描述 | string | | 补充说明 |

---

## Sheet7: 元数据-枚举定义

采用 **列式布局**，每个枚举类型一列，枚举值按行排列。

### ⚠️ 强制约束：必须包含以下全部枚举列及其完整值

| 操作类型 | 等待策略 | 断言类型 | Mock场景 | 状态隔离 | 优先级 | 用例状态 | 执行状态 | 定位方式 | 网络模拟 | 设备模拟 |
|----------|----------|----------|----------|----------|--------|----------|----------|----------|----------|----------|
| 点击 | 无 | 可见 | 无 | 无 | P0 | 草稿 | 待执行 | CSS选择器 | 无 | 无 |
| 双击 | 网络空闲 | 隐藏 | 成功 | 清理localStorage | P1 | 待审核 | 执行中 | XPath | 离线 | iPhone 12 |
| 右键点击 | 可见 | 存在 | 空数据 | 清理sessionStorage | P2 | 已审核 | 通过 | ID | 慢速3G | iPhone 14 Pro |
| 输入 | 隐藏 | 不存在 | 网络错误 | 清理所有Storage | P3 | 已废弃 | 失败 | Name | 快速3G | iPad Pro |
| 清空并输入 | DOM更新 | 可用 | 服务器错误 | 清理Cookie | | | 跳过 | Class | 4G | Pixel 5 |
| 选择 | 附加 | 禁用 | 超时 | 清理IndexedDB | | | 阻塞 | Text | WiFi | Galaxy S21 |
| 悬停 | 分离 | 文本等于 | 未授权 | 清理全部 | | | | Placeholder | 自定义 | Desktop 1920x1080 |
| 拖拽 | 可编辑 | 文本包含 | 权限不足 | | | | | Role | | Desktop 1366x768 |
| 等待 | 可点击 | 值等于 | 数据校验失败 | | | | | Label | | |
| 断言 | 稳定 | 值包含 | 部分成功 | | | | | TestId | | |
| 截图 | | 属性等于 | | | | | | AltText | | |
| 执行JS | | 属性包含 | | | | | | Title | | |
| 清理状态 | | CSS属性等于 | | | | | | | | |
| SPA导航 | | 元素数量 | | | | | | | | |
| 等待URL | | URL包含 | | | | | | | | |
| 注册API监听 | | URL等于 | | | | | | | | |
| 等待API响应 | | 标题包含 | | | | | | | | |
| Mock路由 | | 标题等于 | | | | | | | | |
| 取消Mock | | 已勾选 | | | | | | | | |
| 展开下拉 | | 未勾选 | | | | | | | | |
| 滚动到底部 | | 聚焦 | | | | | | | | |
| 滚动到元素 | | 截图对比 | | | | | | | | |
| 上传文件 | | | | | | | | | | |
| 多文件上传 | | | | | | | | | | |
| 拖拽上传 | | | | | | | | | | |
| 注册下载监听 | | | | | | | | | | |
| 等待下载完成 | | | | | | | | | | |
| 等待iframe | | | | | | | | | | |
| 切换到iframe | | | | | | | | | | |
| 退出iframe | | | | | | | | | | |
| 注册新标签监听 | | | | | | | | | | |
| 切换到新标签 | | | | | | | | | | |
| 关闭标签页 | | | | | | | | | | |
| 模拟网络错误 | | | | | | | | | | |
| 模拟慢网络 | | | | | | | | | | |

**枚举定义检查清单（11 列，各列必需值数量）**：
```
枚举定义完整性检查：

1. 操作类型（36项）：
   点击、双击、右键点击、输入、清空并输入、选择、悬停、拖拽、
   等待、断言、截图、执行JS、清理状态、SPA导航、等待URL、
   注册API监听、等待API响应、Mock路由、取消Mock、展开下拉、
   滚动到底部、滚动到元素、上传文件、多文件上传、拖拽上传、
   注册下载监听、等待下载完成、等待iframe、切换到iframe、
   退出iframe、注册新标签监听、切换到新标签、关闭标签页、
   点击并导航、模拟网络错误、模拟慢网络

2. 等待策略（10项）：
   无、网络空闲、可见、隐藏、DOM更新、附加、分离、可编辑、可点击、稳定

3. 断言类型（22项）：
   可见、隐藏、存在、不存在、可用、禁用、文本等于、文本包含、
   值等于、值包含、属性等于、属性包含、CSS属性等于、元素数量、
   URL包含、URL等于、标题包含、标题等于、已勾选、未勾选、聚焦、截图对比

4. Mock场景（10项）：
   无、成功、空数据、网络错误、服务器错误、超时、未授权、
   权限不足、数据校验失败、部分成功

5. 状态隔离（7项）：
   无、清理localStorage、清理sessionStorage、清理所有Storage、
   清理Cookie、清理IndexedDB、清理全部

6. 优先级（4项）：
   P0、P1、P2、P3

7. 用例状态（4项）：
   草稿、待审核、已审核、已废弃

8. 执行状态（6项）：
   待执行、执行中、通过、失败、跳过、阻塞

9. 定位方式（12项）：
   CSS选择器、XPath、ID、Name、Class、Text、Placeholder、
   Role、Label、TestId、AltText、Title

   > ⚠️ **注意**：以下定位方式在被测页面不可用，代码生成时会自动转换：
   > - `Role`、`Label` - 依赖 ARIA 规范，页面未实现
   > - `TestId` - 依赖 data-testid 属性，页面未添加

   > ⚠️ **Vue SPA 项目特别注意**：
   > 
   > | 定位方式 | Element UI 2.x 可用性 | 说明 |
   > |----------|----------------------|------|
   > | CSS选择器 | ✅ 推荐 | 使用 UI 库公开类名（如 `.el-input__inner`） |
   > | Text | ✅ 推荐 | 用户可见文本 |
   > | Placeholder | ✅ 推荐 | 输入框首选 |
   > | Role | ⚠️ 部分可用 | 仅 button/input/link 可用，Tab/Header 不可用 |
   > | TestId | ❌ 不可用 | 页面未添加 |
   > | Label | ❌ 不可用 | 依赖 ARIA，不可靠 |
   >
   > **Element UI 推荐类名**：
   > ```
   > 输入框: .el-input__inner
   > 按钮: .el-button
   > 表格行: .el-table__row
   > 表头容器: .el-table__header-wrapper
   > Tab项: .el-tabs__item
   > 分页: .el-pagination
   > 弹窗: .el-dialog
   > ```
   >
   > 详见 [vue-spa-locator-spec.md](vue-spa-locator-spec.md)

10. 网络模拟（7项）：
    无、离线、慢速3G、快速3G、4G、WiFi、自定义

11. 设备模拟（8项）：
    无、iPhone 12、iPhone 14 Pro、iPad Pro、Pixel 5、
    Galaxy S21、Desktop 1920x1080、Desktop 1366x768
```

> **说明**：
> - 此 Sheet 作为下拉选项的数据源，Excel 中可通过数据验证引用这些列
> - **必须包含全部 11 列，每列必须包含上述检查清单中列出的所有枚举值**
> - 缺少任何枚举列或枚举值视为输出不完整

---

## Sheet8: 元数据-操作类型参考

> **📖 参考文档**：此 Sheet 仅供查阅，不参与数据校验和代码生成。

| 字段 | 类型 | 说明 |
|------|------|------|
| 操作类型 | string | 操作类型名称 |
| 说明 | string | 操作的功能描述 |
| Playwright方法 | string | 对应的 Playwright API |
| 示例 | string | 代码示例 |
| 适用场景 | string | 推荐使用场景 |

**预置操作类型**：

| 操作类型 | 说明 | Playwright方法 | 适用场景 |
|----------|------|----------------|----------|
| 点击 | 单击元素 | `locator.click()` | 按钮/链接 |
| 双击 | 双击元素 | `locator.dblclick()` | 编辑/选中 |
| 输入 | 输入文本 | `locator.fill()` | 表单输入 |
| 清空并输入 | 清空后输入 | `locator.fill("")+fill()` | 覆盖输入 |
| 选择 | 下拉选择 | `locator.selectOption()` | 下拉框 |
| 悬停 | 鼠标悬停 | `locator.hover()` | 触发悬停效果 |
| 拖拽 | 拖拽元素 | `locator.dragTo()` | 拖拽排序 |
| 等待 | 等待元素 | `locator.waitFor()` | 等待出现 |
| 断言 | 验证元素 | `expect(locator)` | 验证状态 |
| 截图 | 页面截图 | `page.screenshot()` | 记录状态 |
| 执行JS | 执行脚本 | `page.evaluate()` | 复杂操作 |
| 清理状态 | 清理Storage | `evaluate(localStorage.clear)` | SPA状态隔离 |
| SPA导航 | SPA路由跳转 | `Promise.all([waitForURL, click])` | SPA页面切换 |
| 等待URL | 等待URL变化 | `page.waitForURL()` | SPA导航后 |
| 注册API监听 | 注册响应监听 | `page.waitForResponse()` | 异步数据 |
| 等待API响应 | 等待响应返回 | `await responsePromise` | 数据加载完成 |
| Mock路由 | 拦截Mock API | `page.route()` | 模拟数据 |
| 上传文件 | 文件上传 | `setInputFiles()` | 单文件 |
| 拖拽上传 | 拖拽上传 | `dispatchEvent(drop)` | 拖拽区域 |
| 注册下载监听 | 下载事件 | `waitForEvent("download")` | 文件下载 |
| 等待iframe | 等待iframe | `frameLocator()` | iframe加载 |
| 切换到iframe | 进入iframe | `frame.locator()` | iframe操作 |
| 注册新标签监听 | 新标签事件 | `context.waitForEvent("page")` | 多标签页 |
| 切换到新标签 | 切换标签页 | `context.pages()[index]` | 新标签页已打开 |
| 关闭标签页 | 关闭当前页 | `page.close()` | 清理标签页 |
| 点击并导航 | 点击+自动处理导航 | `click + tabs检测 + 切换` | 可能打开新标签页的点击 |
| 模拟网络错误 | 网络断开 | `route.abort("failed")` | 异常测试 |

---

## Sheet9: 元数据-等待策略参考

> **📖 参考文档**：此 Sheet 仅供查阅，不参与数据校验和代码生成。

| 字段 | 类型 | 说明 |
|------|------|------|
| 等待策略 | string | 策略名称 |
| 说明 | string | 策略的功能描述 |
| Playwright参数 | string | 对应的 Playwright 参数 |
| 适用场景 | string | 推荐使用场景 |
| 示例 | string | 代码示例 |

**预置等待策略**：

| 等待策略 | 说明 | Playwright参数 | 适用场景 |
|----------|------|----------------|----------|
| 无 | 不等待 | - | 元素已存在 |
| 网络空闲 | 等待网络空闲 | `networkidle` | 页面初始加载 |
| 可见 | 等待元素可见 | `state: "visible"` | 元素显示 |
| 隐藏 | 等待元素隐藏 | `state: "hidden"` | Loading消失 |
| DOM更新 | 等待DOM更新 | `waitForFunction` | 虚拟DOM更新 |
| 附加 | 等待元素挂载 | `state: "attached"` | 懒加载组件 |
| 分离 | 等待元素移除 | `state: "detached"` | 元素删除 |
| 可编辑 | 等待可编辑 | `isEditable()` | 输入框就绪 |
| 可点击 | 等待可点击 | `isEnabled()` | 按钮可用 |
| 稳定 | 等待位置稳定 | 内置 | 动画完成 |

---

## Sheet10: 元数据-Mock场景

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 场景ID | string | ✅ | 唯一标识，如 MOCK001 |
| 场景名称 | string | ✅ | 可读名称 |
| API模式 | string | ✅ | API路径模式 |
| 响应状态 | number | ✅ | HTTP状态码 |
| 响应数据 | string | ✅ | JSON格式响应体 |
| 延迟(ms) | number | | 响应延迟 |
| 说明 | string | | 场景说明 |

---

## 变量引用语法

### 用户变量
- `${user.username}` - 当前执行用户的用户名
- `${user.password}` - 当前执行用户的密码
- `${user.role}` - 当前执行用户的角色

### 数据变量
- `${data.fieldName}` - 当前数据集的字段值
- `${data.nested.field}` - 嵌套字段

### 配置变量
- `${config.baseUrl}` - 全局配置中的基础URL
- `${config.timeout}` - 全局超时时间

### 运行时变量
- `${@variableName}` - 步骤中提取并存储的变量

---

## ⚠️ 数据验证规范（强制约束）

**生成 Excel 时，必须为所有引用字段设置下拉选项（Data Validation）**，包括：
1. **枚举类型引用** - 引用 Sheet7 元数据-枚举定义
2. **跨 Sheet 数据引用** - 引用其他 Sheet 的数据列

---

### 一、枚举类型引用（引用 Sheet7）

| Sheet | 字段名 | 引用 Sheet7 列 | 说明 |
|-------|--------|---------------|------|
| Sheet0: 用例-定义 | 优先级 | F列: 优先级 | P0/P1/P2/P3 |
| Sheet0: 用例-定义 | 用例状态 | G列: 用例状态 | 草稿/待审核/已审核/已废弃 |
| Sheet1: 用例-执行步骤 | 操作类型 | A列: 操作类型 | 35种操作类型 |
| Sheet1: 用例-执行步骤 | 等待策略 | B列: 等待策略 | 10种等待策略 |
| Sheet1: 用例-执行步骤 | 断言类型 | C列: 断言类型 | 22种断言类型 |
| Sheet3: 执行-执行计划 | Mock场景 | D列: Mock场景 | 10种Mock场景 |
| Sheet3: 执行-执行计划 | 状态隔离 | E列: 状态隔离 | 7种状态隔离 |
| Sheet3: 执行-执行计划 | 执行状态 | H列: 执行状态 | 6种执行状态 |
| Sheet3: 执行-执行计划 | 启用 | - | 是/否（直接设置） |
| Sheet4: 配置-用户 | 状态 | - | 启用/禁用（直接设置） |
| Sheet6: 元数据-POM | 定位方式 | I列: 定位方式 | 12种定位方式 |
| Sheet6: 元数据-POM | 等待策略 | B列: 等待策略 | 10种等待策略 |

---

### 二、跨 Sheet 数据引用（动态列表）

| Sheet | 字段名 | 引用 Sheet | 引用列 | 说明 |
|-------|--------|-----------|--------|------|
| Sheet1: 用例-执行步骤 | 用例ID | Sheet0: 用例-定义 | A列: 用例ID | 步骤关联到用例 |
| Sheet1: 用例-执行步骤 | 目标元素 | Sheet6: 元数据-POM | D列: 元素ID | 步骤引用POM元素 |
| Sheet3: 执行-执行计划 | 用例ID | Sheet0: 用例-定义 | A列: 用例ID | 执行计划关联用例 |
| Sheet3: 执行-执行计划 | 执行用户 | Sheet4: 配置-用户 | A列: 用户ID | 执行计划关联用户 |
| Sheet3: 执行-执行计划 | 数据集 | Sheet2: 用例-测试数据 | A列: 数据集 | 执行计划关联数据集（需去重） |

> **注意**：跨 Sheet 引用是动态的，引用范围需要根据实际数据行数调整。

---

### 三、Sheet 间引用关系图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Sheet 引用关系                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Sheet0: 用例-定义                                                   │
│  ├── 优先级 ────────────────────────────→ Sheet7.优先级              │
│  └── 用例状态 ──────────────────────────→ Sheet7.用例状态            │
│       ↑                                                             │
│       │ 用例ID                                                       │
│       │                                                             │
│  Sheet1: 用例-执行步骤                                               │
│  ├── 用例ID ────────────────────────────→ Sheet0.用例ID (外键)       │
│  ├── 操作类型 ──────────────────────────→ Sheet7.操作类型            │
│  ├── 等待策略 ──────────────────────────→ Sheet7.等待策略            │
│  ├── 断言类型 ──────────────────────────→ Sheet7.断言类型            │
│  └── 目标元素 ──────────────────────────→ Sheet6.元素ID (外键)       │
│                                                                     │
│  Sheet2: 用例-测试数据                                               │
│       ↑                                                             │
│       │ 数据集                                                       │
│       │                                                             │
│  Sheet3: 执行-执行计划                                               │
│  ├── 用例ID ────────────────────────────→ Sheet0.用例ID (外键)       │
│  ├── 执行用户 ──────────────────────────→ Sheet4.用户ID (外键)       │
│  ├── 数据集 ────────────────────────────→ Sheet2.数据集 (外键)       │
│  ├── Mock场景 ──────────────────────────→ Sheet7.Mock场景            │
│  ├── 状态隔离 ──────────────────────────→ Sheet7.状态隔离            │
│  └── 执行状态 ──────────────────────────→ Sheet7.执行状态            │
│                                                                     │
│  Sheet4: 配置-用户                                                   │
│  └── 状态 ──────────────────────────────→ 启用/禁用 (固定值)         │
│                                                                     │
│  Sheet6: 元数据-POM                                                  │
│  ├── 定位方式 ──────────────────────────→ Sheet7.定位方式            │
│  └── 等待策略 ──────────────────────────→ Sheet7.等待策略            │
│                                                                     │
│  Sheet7: 元数据-枚举定义 (数据源)                                     │
│  └── 11列枚举值，供其他 Sheet 引用                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 四、命名范围定义

#### 4.1 枚举命名范围（静态）

| 命名范围名称 | 引用范围 | 说明 |
|-------------|---------|------|
| 枚举_操作类型 | '元数据-枚举定义'!$A$2:$A$36 | 35种操作类型 |
| 枚举_等待策略 | '元数据-枚举定义'!$B$2:$B$11 | 10种等待策略 |
| 枚举_断言类型 | '元数据-枚举定义'!$C$2:$C$23 | 22种断言类型 |
| 枚举_Mock场景 | '元数据-枚举定义'!$D$2:$D$11 | 10种Mock场景 |
| 枚举_状态隔离 | '元数据-枚举定义'!$E$2:$E$8 | 7种状态隔离 |
| 枚举_优先级 | '元数据-枚举定义'!$F$2:$F$5 | 4种优先级 |
| 枚举_用例状态 | '元数据-枚举定义'!$G$2:$G$5 | 4种用例状态 |
| 枚举_执行状态 | '元数据-枚举定义'!$H$2:$H$7 | 6种执行状态 |
| 枚举_定位方式 | '元数据-枚举定义'!$I$2:$I$13 | 12种定位方式 |
| 枚举_网络模拟 | '元数据-枚举定义'!$J$2:$J$8 | 7种网络模拟 |
| 枚举_设备模拟 | '元数据-枚举定义'!$K$2:$K$9 | 8种设备模拟 |

#### 4.2 跨 Sheet 引用命名范围（动态）

| 命名范围名称 | 引用范围 | 说明 |
|-------------|---------|------|
| 列表_用例ID | '用例-定义'!$A$2:$A$1000 | 用例ID列表 |
| 列表_用户ID | '配置-用户'!$A$2:$A$100 | 用户ID列表 |
| 列表_元素ID | '元数据-POM'!$D$2:$D$500 | POM元素ID列表 |
| 列表_数据集 | '用例-测试数据'!$A$2:$A$500 | 数据集列表（需去重处理） |

> **注意**：跨 Sheet 引用范围应预留足够行数，或使用动态命名范围公式。

---

### 五、openpyxl 代码示例

```python
from openpyxl import Workbook
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.workbook.defined_name import DefinedName

wb = Workbook()

# ========== 1. 创建命名范围 ==========

# 枚举命名范围（静态）
wb.defined_names.add(DefinedName(
    name="枚举_操作类型",
    attr_text="'元数据-枚举定义'!$A$2:$A$36"
))
wb.defined_names.add(DefinedName(
    name="枚举_等待策略", 
    attr_text="'元数据-枚举定义'!$B$2:$B$11"
))
# ... 其他枚举命名范围

# 跨 Sheet 引用命名范围（动态）
wb.defined_names.add(DefinedName(
    name="列表_用例ID",
    attr_text="'用例-定义'!$A$2:$A$1000"
))
wb.defined_names.add(DefinedName(
    name="列表_用户ID",
    attr_text="'配置-用户'!$A$2:$A$100"
))
wb.defined_names.add(DefinedName(
    name="列表_元素ID",
    attr_text="'元数据-POM'!$D$2:$D$500"
))

# ========== 2. 设置数据验证 ==========

# --- Sheet0: 用例-定义 ---
ws_cases = wb["用例-定义"]
# 优先级列 (E列)
dv_priority = DataValidation(type="list", formula1="枚举_优先级", allow_blank=True)
dv_priority.add("E2:E1000")
ws_cases.add_data_validation(dv_priority)
# 用例状态列 (H列)
dv_case_status = DataValidation(type="list", formula1="枚举_用例状态", allow_blank=True)
dv_case_status.add("H2:H1000")
ws_cases.add_data_validation(dv_case_status)

# --- Sheet1: 用例-执行步骤 ---
ws_steps = wb["用例-执行步骤"]
# 用例ID列 (A列) → 引用 Sheet0
dv_case_id = DataValidation(type="list", formula1="列表_用例ID", allow_blank=False)
dv_case_id.add("A2:A5000")
ws_steps.add_data_validation(dv_case_id)
# 操作类型列 (D列)
dv_action = DataValidation(type="list", formula1="枚举_操作类型", allow_blank=False)
dv_action.add("D2:D5000")
ws_steps.add_data_validation(dv_action)
# 目标元素列 (E列) → 引用 Sheet6 POM
dv_element = DataValidation(type="list", formula1="列表_元素ID", allow_blank=True)
dv_element.add("E2:E5000")
ws_steps.add_data_validation(dv_element)
# 等待策略列 (G列)
dv_wait = DataValidation(type="list", formula1="枚举_等待策略", allow_blank=True)
dv_wait.add("G2:G5000")
ws_steps.add_data_validation(dv_wait)
# 断言类型列 (I列)
dv_assert = DataValidation(type="list", formula1="枚举_断言类型", allow_blank=True)
dv_assert.add("I2:I5000")
ws_steps.add_data_validation(dv_assert)

# --- Sheet3: 执行-执行计划 ---
ws_exec = wb["执行-执行计划"]
# 用例ID列 (B列) → 引用 Sheet0
dv_exec_case = DataValidation(type="list", formula1="列表_用例ID", allow_blank=False)
dv_exec_case.add("B2:B1000")
ws_exec.add_data_validation(dv_exec_case)
# 执行用户列 (C列) → 引用 Sheet4
dv_user = DataValidation(type="list", formula1="列表_用户ID", allow_blank=False)
dv_user.add("C2:C1000")
ws_exec.add_data_validation(dv_user)
# 数据集列 (D列) → 引用 Sheet2（注意：需要去重处理）
# 方式1：直接引用（可能有重复值）
dv_dataset = DataValidation(type="list", formula1="'用例-测试数据'!$A$2:$A$500", allow_blank=True)
dv_dataset.add("D2:D1000")
ws_exec.add_data_validation(dv_dataset)
# Mock场景列 (E列)
dv_mock = DataValidation(type="list", formula1="枚举_Mock场景", allow_blank=True)
dv_mock.add("E2:E1000")
ws_exec.add_data_validation(dv_mock)
# 状态隔离列 (F列)
dv_isolation = DataValidation(type="list", formula1="枚举_状态隔离", allow_blank=True)
dv_isolation.add("F2:F1000")
ws_exec.add_data_validation(dv_isolation)
# 启用列 (H列)
dv_enabled = DataValidation(type="list", formula1='"是,否"', allow_blank=True)
dv_enabled.add("H2:H1000")
ws_exec.add_data_validation(dv_enabled)
# 执行状态列 (I列)
dv_exec_status = DataValidation(type="list", formula1="枚举_执行状态", allow_blank=True)
dv_exec_status.add("I2:I1000")
ws_exec.add_data_validation(dv_exec_status)

# --- Sheet4: 配置-用户 ---
ws_users = wb["配置-用户"]
# 状态列 (F列)
dv_user_status = DataValidation(type="list", formula1='"启用,禁用"', allow_blank=True)
dv_user_status.add("F2:F100")
ws_users.add_data_validation(dv_user_status)

# --- Sheet6: 元数据-POM ---
ws_pom = wb["元数据-POM"]
# 定位方式列 (F列)
dv_locator = DataValidation(type="list", formula1="枚举_定位方式", allow_blank=True)
dv_locator.add("F2:F500")
ws_pom.add_data_validation(dv_locator)
# 等待策略列 (H列)
dv_pom_wait = DataValidation(type="list", formula1="枚举_等待策略", allow_blank=True)
dv_pom_wait.add("H2:H500")
ws_pom.add_data_validation(dv_pom_wait)

wb.save("TestSuite.xlsx")
```

---

### 六、数据验证完整性检查清单

```
数据验证完整性检查（共 17 项）：

═══════════════════════════════════════════════════════════════
【枚举类型引用】（12项）
═══════════════════════════════════════════════════════════════

Sheet0 用例-定义：
- [ ] 优先级列 → 枚举_优先级
- [ ] 用例状态列 → 枚举_用例状态

Sheet1 用例-执行步骤：
- [ ] 操作类型列 → 枚举_操作类型
- [ ] 等待策略列 → 枚举_等待策略
- [ ] 断言类型列 → 枚举_断言类型

Sheet3 执行-执行计划：
- [ ] Mock场景列 → 枚举_Mock场景
- [ ] 状态隔离列 → 枚举_状态隔离
- [ ] 启用列 → "是,否"
- [ ] 执行状态列 → 枚举_执行状态

Sheet4 配置-用户：
- [ ] 状态列 → "启用,禁用"

Sheet6 元数据-POM：
- [ ] 定位方式列 → 枚举_定位方式
- [ ] 等待策略列 → 枚举_等待策略

═══════════════════════════════════════════════════════════════
【跨 Sheet 数据引用】（5项）
═══════════════════════════════════════════════════════════════

Sheet1 用例-执行步骤：
- [ ] 用例ID列 → 列表_用例ID (Sheet0.用例ID)
- [ ] 目标元素列 → 列表_元素ID (Sheet6.元素ID)

Sheet3 执行-执行计划：
- [ ] 用例ID列 → 列表_用例ID (Sheet0.用例ID)
- [ ] 执行用户列 → 列表_用户ID (Sheet4.用户ID)
- [ ] 数据集列 → Sheet2.数据集 (去重)

═══════════════════════════════════════════════════════════════
【命名范围定义】（15项）
═══════════════════════════════════════════════════════════════

枚举命名范围（11项）：
- [ ] 枚举_操作类型
- [ ] 枚举_等待策略
- [ ] 枚举_断言类型
- [ ] 枚举_Mock场景
- [ ] 枚举_状态隔离
- [ ] 枚举_优先级
- [ ] 枚举_用例状态
- [ ] 枚举_执行状态
- [ ] 枚举_定位方式
- [ ] 枚举_网络模拟
- [ ] 枚举_设备模拟

跨Sheet命名范围（4项）：
- [ ] 列表_用例ID
- [ ] 列表_用户ID
- [ ] 列表_元素ID
- [ ] 列表_数据集
```

> **重要**：生成 Excel 文件时，必须完成以上全部 17 项数据验证设置，否则用户无法通过下拉选项选择值，严重影响使用体验。**未设置完整数据验证的 Excel 文件视为不合格输出。**
