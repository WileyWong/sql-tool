# 用例设计规范

> ⚠️ **本文档为强制规范，非建议性指引。所有内容必须严格遵循。**

## 输入

| 类型 | 必需 | 说明 |
|------|------|------|
| POM 定义 | 推荐 | 页面对象模型 |
| 需求文档 | 可选 | PRD/用户故事/AC |
| 测试范围 | 可选 | 指定模块或功能 |

## 流程

### 1. 分析测试范围

- 读取需求文档（如有）
- 读取 POM 了解页面结构
- 确定测试边界

### 2. 识别测试场景

**正向场景（Happy Path）**：
- 核心业务流程
- 主要功能验证

**异常场景**：
- 边界条件
- 错误输入
- 异常状态

**按优先级排序**：P0 > P1 > P2

### 3. 设计用例结构

每个用例包含：
- 用例ID、名称、描述
- 前置条件、优先级
- 关联需求（如有）

### 4. 编写执行步骤

> 📌 完整的操作类型（35项）、等待策略（10项）、断言类型（22项）定义见 [excel-rules.md](excel-rules.md#sheet7-元数据-枚举定义)

**常用动作类型**：

| 动作 | 说明 | 参数 |
|------|------|------|
| SPA导航 | SPA 页面导航 | target (URL) |
| 点击 | 点击元素 | element (元素ID) |
| 双击 | 双击元素 | element (元素ID) |
| 输入 | 输入文本 | element, value |
| 清空并输入 | 清空后输入 | element, value |
| 选择 | 下拉选择 | element, value |
| 悬停 | 鼠标悬停 | element |
| 等待 | 等待元素 | type, value |
| 断言 | 断言验证 | type, expected |
| 截图 | 页面截图 | filename |
| 清理状态 | 清理 Storage | value (类型) |
| 注册API监听 | 注册 API 监听 | api (路径) |
| 等待API响应 | 等待 API 响应 | - |
| 上传文件 | 文件上传 | element, value (路径) |

**等待策略**：

| 策略 | 说明 |
|------|------|
| 无 | 不等待 |
| 网络空闲 | 等待网络请求完成 |
| 可见 | 等待元素可见 |
| 隐藏 | 等待元素隐藏 |
| DOM更新 | 等待 DOM 更新 |
| 可点击 | 等待元素可点击 |
| 稳定 | 等待位置稳定 |

### 5. 准备测试数据

KV 格式，支持多数据集：

```yaml
testData:
  validUser:
    username: "testuser"
    password: "Test@123"
  invalidUser:
    username: "wrong"
    password: "wrong"
```

## 输出格式

```yaml
testSuite:
  id: TS-Login
  name: 登录模块测试
  module: login
  
  cases:
    - id: TC-OA-登录-正常登录-001
      name: 正常登录
      description: 使用有效凭证登录系统
      priority: P0
      tags: ["@smoke", "@login"]
      
      preconditions:
        - 用户已注册
        - 系统可访问
      
      steps:
        - action: navigate
          target: login
          
        - action: input
          element: username
          value: "${username}"
          
        - action: input
          element: password
          value: "${password}"
          
        - action: click
          element: submitBtn
          
        - action: assert
          type: url
          expected: "/dashboard"
          
      testData:
        - username: "testuser"
          password: "Test@123"
```

## 用例ID 命名规范

格式：`TC-{系统}-{模块}-{场景}-{序号}`

示例：
- `TC-OA-登录-正常登录-001`
- `TC-OA-登录-密码错误-002`
- `TC-OA-登录-用户名为空-003`

## 优先级定义

| 优先级 | 说明 | 覆盖率 |
|--------|------|--------|
| P0 | 核心功能，阻塞性 | 必须 100% |
| P1 | 重要功能，影响使用 | 建议 90%+ |
| P2 | 一般功能，边缘场景 | 建议 70%+ |

## 断言类型

> 📌 完整的 22 项断言类型定义见 [excel-rules.md](excel-rules.md#sheet7-元数据-枚举定义)

**常用断言类型**：

| 类型 | 说明 | 示例 |
|------|------|------|
| 可见 | 元素可见 | `element: errorMsg` |
| 隐藏 | 元素隐藏 | `element: loading` |
| 存在 | 元素存在 | `element: submitBtn` |
| 不存在 | 元素不存在 | `element: errorTip` |
| 文本等于 | 文本完全匹配 | `element: msg, expected: "成功"` |
| 文本包含 | 文本包含指定内容 | `element: msg, expected: "成功"` |
| 值等于 | 输入值匹配 | `element: input, expected: "test"` |
| 值包含 | 输入值包含 | `element: input, expected: "test"` |
| 属性等于 | 属性值匹配 | `element: btn, attr: disabled, expected: true` |
| 元素数量 | 元素数量 | `selector: ".item", expected: 5` |
| URL包含 | URL 包含 | `expected: "/dashboard"` |
| URL等于 | URL 完全匹配 | `expected: "/dashboard"` |
| 标题包含 | 页面标题包含 | `expected: "首页"` |
| 已勾选 | 复选框已勾选 | `element: checkbox` |
| 未勾选 | 复选框未勾选 | `element: checkbox` |

## Excel 输出规范（强制约束）

**⚠️ 重要**：当输出 Excel 格式时，**必须**生成完整的 11 个 Sheet，缺一不可：

| Sheet 序号 | Sheet 名称 | 必需 | 说明 |
|-----------|-----------|------|------|
| Sheet0 | 用例-定义 | ✅ | 测试用例基本信息 |
| Sheet1 | 用例-执行步骤 | ✅ | 用例执行步骤详情 |
| Sheet2 | 用例-测试数据 | ✅ | KV 格式测试数据 |
| Sheet3 | 执行-执行计划 | ✅ | 执行计划配置 |
| Sheet4 | 配置-用户 | ✅ | 测试用户配置 |
| Sheet5 | 配置-全局 | ✅ | 全局环境配置 |
| Sheet6 | 元数据-POM | ✅ | 页面元素定位 |
| Sheet7 | 元数据-枚举定义 | ✅ | 下拉选项数据源 |
| Sheet8 | 元数据-操作类型参考 | ✅ | 操作类型说明文档 |
| Sheet9 | 元数据-等待策略参考 | ✅ | 等待策略说明文档 |
| Sheet10 | 元数据-Mock场景 | ✅ | API Mock 配置 |

**生成检查清单**：
```
Excel 生成完整性检查：
- [ ] Sheet0: 用例-定义
- [ ] Sheet1: 用例-执行步骤
- [ ] Sheet2: 用例-测试数据
- [ ] Sheet3: 执行-执行计划
- [ ] Sheet4: 配置-用户
- [ ] Sheet5: 配置-全局
- [ ] Sheet6: 元数据-POM
- [ ] Sheet7: 元数据-枚举定义
- [ ] Sheet8: 元数据-操作类型参考
- [ ] Sheet9: 元数据-等待策略参考
- [ ] Sheet10: 元数据-Mock场景

数据验证检查（共17项）：

【枚举类型引用 - 12项】
- [ ] Sheet0 优先级 → Sheet7.优先级
- [ ] Sheet0 用例状态 → Sheet7.用例状态
- [ ] Sheet1 操作类型 → Sheet7.操作类型
- [ ] Sheet1 等待策略 → Sheet7.等待策略
- [ ] Sheet1 断言类型 → Sheet7.断言类型
- [ ] Sheet3 Mock场景 → Sheet7.Mock场景
- [ ] Sheet3 状态隔离 → Sheet7.状态隔离
- [ ] Sheet3 启用 → "是,否"
- [ ] Sheet3 执行状态 → Sheet7.执行状态
- [ ] Sheet4 状态 → "启用,禁用"
- [ ] Sheet6 定位方式 → Sheet7.定位方式
- [ ] Sheet6 等待策略 → Sheet7.等待策略

【跨Sheet数据引用 - 5项】
- [ ] Sheet1 用例ID → Sheet0.用例ID
- [ ] Sheet1 目标元素 → Sheet6.元素ID
- [ ] Sheet3 用例ID → Sheet0.用例ID
- [ ] Sheet3 执行用户 → Sheet4.用户ID
- [ ] Sheet3 数据集 → Sheet2.数据集
```

各 Sheet 的详细字段定义和数据验证规范参见：[excel-rules.md](excel-rules.md)

---

## 参考

- YAML 规则：[yaml-rules.md](yaml-rules.md)
- Excel 规则：[excel-rules.md](excel-rules.md)
- 命名规范：[naming-convention.md](naming-convention.md)
