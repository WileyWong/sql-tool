# 第三方接口

> **项目**: {{PROJECT_NAME}}  
> **生成时间**: {{SCAN_DATE}}

---

## 📋 接口列表

| 接口 | 提供方 | 用途 | 调用方式 | 封装类 |
|------|--------|------|----------|--------|
| {{INTERFACE_NAME}} | {{PROVIDER}} | {{PURPOSE}} | {{CALL_TYPE}} | `{{WRAPPER_CLASS}}` |

---

## 📝 接口详情

### {{INTERFACE_NAME}}

**基础信息**:
- **提供方**: {{PROVIDER}}
- **文档**: {{DOC_URL}}
- **调用类**: `{{WRAPPER_CLASS}}`

**接口方法**:

#### {{METHOD_NAME}}
```java
public {{RETURN_TYPE}} {{METHOD_NAME}}(
    {{PARAMS_WITH_ANNOTATIONS}}
) throws {{EXCEPTION_TYPE}}
```
- **参数说明**:
  | 参数 | 类型 | 必填 | 说明 |
  |------|------|:----:|------|
  | {{PARAM_NAME}} | {{PARAM_TYPE}} | {{REQUIRED}} | {{PARAM_DESC}} |
- **返回**: `{{RETURN_TYPE}}` - {{RETURN_DESC}}
- **异常**: `{{EXCEPTION_TYPE}}` - {{EXCEPTION_DESC}}
- **对应API**: `{{HTTP_METHOD}} {{API_PATH}}`
- **说明**: {{METHOD_DESC}}

#### {{METHOD_NAME_2}}
```java
public {{RETURN_TYPE}} {{METHOD_NAME_2}}(
    @NotNull String orderId,
    @NotNull BigDecimal amount
) throws PaymentException
```
- **参数说明**:
  | 参数 | 类型 | 必填 | 说明 |
  |------|------|:----:|------|
  | orderId | String | 是 | 订单号 |
  | amount | BigDecimal | 是 | 支付金额 |
- **返回**: `PaymentResult` - 支付结果
- **异常**: `PaymentException` - 支付异常
- **对应API**: `POST /pay/unifiedorder`
- **说明**: 创建支付订单

**配置**:
```yaml
{{CONFIG_PREFIX}}:
  {{CONFIG_KEY_1}}: {{CONFIG_VALUE_1}}
  {{CONFIG_KEY_2}}: {{CONFIG_VALUE_2}}
```

**错误码**:
| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| {{ERROR_CODE}} | {{ERROR_DESC}} | {{ERROR_HANDLING}} |

---

### {{INTERFACE_NAME_2}}

**基础信息**:
- **提供方**: {{PROVIDER}}
- **文档**: {{DOC_URL}}
- **调用类**: `{{WRAPPER_CLASS}}`

**接口方法**:

#### sendSms
```java
public SendSmsResponse sendSms(
    @NotBlank String phoneNumber,
    @NotBlank String templateCode,
    Map<String, String> templateParams
) throws SmsException
```
- **参数说明**:
  | 参数 | 类型 | 必填 | 说明 |
  |------|------|:----:|------|
  | phoneNumber | String | 是 | 手机号码 |
  | templateCode | String | 是 | 短信模板编码 |
  | templateParams | Map<String, String> | 否 | 模板参数 |
- **返回**: `SendSmsResponse` - 发送结果
- **异常**: `SmsException` - 发送异常
- **说明**: 发送短信

---

## 🔗 调用封装

所有第三方接口调用统一封装在 `{{INTEGRATION_PACKAGE}}` 包下：

```
{{INTEGRATION_PACKAGE}}/
├── {{PROVIDER_1}}/
│   └── {{WRAPPER_CLASS_1}}.java
├── {{PROVIDER_2}}/
│   ├── {{WRAPPER_CLASS_2}}.java
│   └── {{WRAPPER_CLASS_3}}.java
└── common/
    └── {{COMMON_CLASS}}.java
```

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| {{SCAN_DATE}} | AI自动生成 | 初始创建文档 | v1.0 |
