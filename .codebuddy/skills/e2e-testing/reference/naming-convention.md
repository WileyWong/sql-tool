# 命名规范

> ℹ️ **本文档包含强制规范和建议性规范，请注意区分。**

本文档定义 E2E 测试中各类标识符的命名规范。

## 规范级别说明

| 级别 | 标记 | 说明 |
|------|------|------|
| 强制 | 🔴 | 必须遵守，违反将导致校验失败 |
| 建议 | 🔵 | 推荐遵守，违反仅提示警告 |

## 用例ID命名规范 🔵

### 格式

```
TC-{系统名}-{模块名}-{用例名}-{编号}
```

### 组成部分

| 组成部分 | 说明 | 示例 |
|----------|------|------|
| `TC` | 固定前缀（Test Case） | TC |
| `系统名` | 所属系统/产品标识 | OA、ERP、Mall、CRM |
| `模块名` | 功能模块 | 登录、订单、用户、支付 |
| `用例名` | 简短用例描述 | 正常登录、密码错误、创建订单 |
| `编号` | 三位数序号 | 001、002、003 |

### 示例

```
TC-OA-登录-正常登录-001
TC-OA-登录-密码错误-002
TC-OA-登录-用户名为空-003
TC-Mall-订单-创建订单-001
TC-Mall-订单-取消订单-002
TC-ERP-库存-入库-001
```

### 规范级别

> **建议性规范**（🔵 Info 级别）
> - AI 自动生成时默认采用
> - 人工编写时可灵活调整
> - 审查时作为改进建议提出，不阻断执行

---

## 其他ID命名规范 🔴

以下ID规范为强制约束，违反将导致校验失败。

### 用户ID

```
格式: U{三位数编号}
示例: U001, U002, U003
```

### Mock场景ID

```
格式: MOCK{三位数编号}
示例: MOCK001, MOCK002, MOCK003
```

### 页面ID

```
格式: 小写字母 + 驼峰命名
示例: login, orderList, userProfile, paymentForm
```

### 元素ID

```
格式: 小写字母 + 驼峰命名
示例: username, password, submitBtn, searchInput
```

### 数据集名称

```
格式: {模块}_{场景}
示例: login_normal, login_empty_user, order_pending
```

---

## 文件命名规范 🔴

### Excel 文件

```
格式: TestSuite-{项目名}.xlsx
示例: TestSuite-OA.xlsx, TestSuite-Mall.xlsx
```

### YAML 文件

```
格式: TestSuite-{项目名}.yaml
示例: TestSuite-OA.yaml, TestSuite-Mall.yaml
```

### 输出目录

```
格式: execute-{YYYYMMDD-HHMMSS}
示例: execute-20251231-103000
位置: {outputDir}/execute-{timestamp}/
```

详见 [output-spec.md](output-spec.md)

### 截图文件

```
成功截图: {用例ID}_success.png
失败截图: {用例ID}_error.png
步骤截图: {用例ID}_step{N}.png
```

---

## 命名最佳实践

### 1. 清晰性

- 名称应能直接表达含义
- 避免使用缩写（除非是通用缩写）
- 使用中文时保持简洁

### 2. 一致性

- 同一项目内保持命名风格一致
- 同一模块内编号连续
- 同类元素使用相同命名模式

### 3. 可搜索性

- 名称应便于搜索和筛选
- 使用有意义的关键词
- 避免过于通用的名称

### 4. 可维护性

- 名称应便于理解和修改
- 避免过长的名称
- 保持层级关系清晰

---

## 正则表达式

用于校验的正则表达式：

```yaml
# ID 校验
用例ID（建议）: ^TC-[\w\u4e00-\u9fa5]+-[\w\u4e00-\u9fa5]+-[\w\u4e00-\u9fa5]+-\d{3}$
用户ID: ^U\d{3}$
Mock场景ID: ^MOCK\d{3}$
页面ID: ^[a-z][a-zA-Z0-9]*$
元素ID: ^[a-z][a-zA-Z0-9]*$
数据集: ^[a-z][a-z0-9_]*$

# 文件名校验
Excel文件: ^TestSuite-[\w\u4e00-\u9fa5]+\.xlsx$
YAML文件: ^TestSuite-[\w\u4e00-\u9fa5]+\.yaml$
输出目录: ^execute-\d{8}-\d{6}$
截图文件: ^.+_(success|error|step\d+)\.png$
```
