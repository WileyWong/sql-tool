# hrit-sdk-spring-boot3-starter 配置说明文档

## 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [全局配置](#全局配置)
- [服务配置](#服务配置)
  - [KMS密钥管理服务](#kms密钥管理服务)
  - [DOS数据查询服务](#dos数据查询服务)
  - [EventBridge事件总线](#eventbridge事件总线)
  - [文件服务](#文件服务)
  - [消息通道服务](#消息通道服务)
  - [短链服务](#短链服务)
  - [工作流服务](#工作流服务)
- [环境Profile配置](#环境profile配置)
- [自动配置详解](#自动配置详解)
- [完整配置示例](#完整配置示例)

---

## 项目概述

**项目名称**: hrit-sdk-spring-boot3-starter  
**版本**: 0.1.7  
**Spring Boot版本**: 3.3.7  
**JDK版本**: 17  
**依赖核心**: hrit-sdk-core

### 项目特性

- 基于 Spring Boot 3.x 自动装配机制
- 支持多环境配置（dev/test/uat/prod/etest/eprod）
- 条件化Bean注册，按需启用服务
- 统一的应用认证机制（appName + appToken）
- 智能环境识别与服务地址自动配置

### 核心依赖

| 依赖 | 版本 | 说明 |
|-----|------|------|
| hrit-sdk-core | 0.1.7 | SDK核心功能库 |
| spring-boot | 3.3.7 | Spring Boot框架 |
| spring-boot-autoconfigure | 3.3.7 | 自动配置支持 |
| guava | - | Google工具库 |
| lombok | 1.18.36 | 简化Java代码 |
| commons-lang3 | - | Apache通用工具 |

---

## 快速开始

### 1. Maven依赖

```xml
<dependency>
    <groupId>com.tencent.hr.sdk</groupId>
    <artifactId>hrit-sdk-spring-boot3-starter</artifactId>
    <version>0.1.7</version>
</dependency>
```

### 2. 基础配置

在 `application.yml` 中添加全局应用配置：

```yaml
hr:
  sdk:
    app:
      app-name: your-app-name      # 服务市场应用名称（必填）
      app-token: your-app-token    # 服务市场应用令牌（必填）
```

### 3. 启用所需服务

根据业务需要启用相应的服务模块，例如：

```yaml
hr:
  sdk:
    kms:
      enabled: true
      mode: normal
    dos:
      enabled: true
    message:
      enabled: true
```

---

## 全局配置

### AppConfiguration - 应用配置

**配置前缀**: `hr.sdk.app`  
**配置类**: `com.tencent.hr.sdk.common.property.AppConfiguration`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `app-name` | String | 是 | - | 服务市场应用名称，用于服务认证 |
| `app-token` | String | 是 | - | 服务市场应用令牌，用于服务认证 |

#### 配置示例

```yaml
hr:
  sdk:
    app:
      app-name: hrit-demo-app
      app-token: abc123def456xyz789
```

---

## 服务配置

### KMS密钥管理服务

**启用条件**: `hr.sdk.kms.mode=normal`  
**自动配置类**: `com.tencent.hr.sdk.kms.autoconfig.KmsAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.kms.property.KmsConfiguration`

#### 配置前缀

`hr.sdk.kms`

#### KmsMode - 密钥模式

| 模式 | 说明 | 使用场景 |
|-----|------|---------|
| `disabled` | 禁用KMS服务 | 不使用密钥管理时 |
| `normal` | 常规模式 | KMS作为普通服务使用，通过代码调用API |
| `startup` | 启动模式 | KMS密钥在启动时注入配置框架，服务依赖KMS启动 |

#### 配置项详解

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `mode` | KmsMode | 否 | normal | KMS工作模式：disabled/normal/startup |
| `kms-address` | String | 否 | 自动 | KMS服务地址，不配置时根据环境自动选择 |
| `key-store` | String | 是 | - | 客户端证书路径（.p12文件） |
| `key-store-password` | String | 是 | - | 客户端证书密码 |
| `trust-store` | String | 否 | 自动 | 信任证书路径，不配置时使用默认证书 |
| `trust-store-password` | String | 否 | 自动 | 信任证书密码，不配置时使用默认密码 |
| `provider` | PatchType | 否 | 自动 | KMS提供商类型，自动识别 |
| `connects` | List | 否 | 自动 | 连接配置，自动从环境加载 |
| `secret-names` | String | 否 | - | key-value密钥的key列表（逗号分隔），用于startup模式 |
| `json-secret-name` | String | 否 | - | JSON格式密钥的key，用于startup模式 |
| `strict` | Boolean | 否 | false | 是否启用严格模式 |

#### 配置示例

**常规模式（normal）**:

```yaml
hr:
  sdk:
    kms:
      mode: normal
      key-store: classpath:certs/409.p12
      key-store-password: your-cert-password
```

**启动模式（startup）**:

```yaml
hr:
  sdk:
    kms:
      mode: startup
      key-store: classpath:certs/409.p12
      key-store-password: your-cert-password
      secret-names: db.password,redis.password,oss.secret
      json-secret-name: app-config
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `kmsService` | IKmsService | KMS服务客户端，用于密钥管理操作 |

#### 环境后置处理器

**类**: `com.tencent.hr.sdk.kms.KmsEnvironmentPostProcessor`

- **功能**: 在启动模式下，将KMS密钥注入Spring配置
- **优先级**: `Ordered.LOWEST_PRECEDENCE`（最低优先级，在文件配置之后执行）
- **配置源名称**: `kms`
- **支持格式**:
  - key-value格式：通过`secret-names`配置
  - JSON格式：通过`json-secret-name`配置，自动解析为扁平化配置

---

### DOS数据查询服务

**启用条件**: `hr.sdk.dos.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.dos.autoconfig.DosAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.dos.property.DosConfiguration`

#### 配置前缀

`hr.sdk.dos`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用DOS服务 |
| `dos-base-url` | String | 是 | - | DOS API基础请求路径 |
| `connect-timeout` | Integer | 否 | - | 连接超时时间（毫秒） |
| `read-timeout` | Integer | 否 | - | 读取超时时间（毫秒） |

#### 环境默认地址

| 环境 | 地址 |
|-----|------|
| 测试环境（test/uat） | https://uat-hrdos.woa.com |
| 生产环境（prod） | https://hrdos.woa.com |

#### 配置示例

```yaml
hr:
  sdk:
    dos:
      enabled: true
      dos-base-url: https://uat-hrdos.woa.com
      connect-timeout: 5000
      read-timeout: 10000
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `dosClient` | DosClient | DOS客户端，用于数据查询操作 |

#### 依赖配置

DOS服务依赖全局应用配置（`hr.sdk.app.app-name`、`hr.sdk.app.app-token`）。

---

### EventBridge事件总线

**启用条件**: `hr.sdk.event.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.event.autoconfig.EventBridgeAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.event.property.EventBridgeConfiguration`

#### 配置前缀

`hr.sdk.event`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用EventBridge服务 |
| `url` | String | 否 | 自动 | 自定义请求URL，不配置时根据Profile自动选择 |

#### 环境自动地址

| Profile | 地址常量 |
|---------|---------|
| TEST_SET (dev/local/default/test) | EventBridgeConstant.TEST_URL |
| UAT_SET (uat) | EventBridgeConstant.UAT_URL |
| PROD_SET (prod) | EventBridgeConstant.PROD_URL |

#### 配置示例

**自动环境识别**:

```yaml
spring:
  profiles:
    active: test

hr:
  sdk:
    event:
      enabled: true
```

**自定义URL**:

```yaml
hr:
  sdk:
    event:
      enabled: true
      url: https://custom-eventbridge.woa.com
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `eventBridgeService` | EventBridgeService | 事件总线服务客户端 |

#### 依赖配置

依赖全局应用配置（`hr.sdk.app.app-name`、`hr.sdk.app.app-token`）。

---

### 文件服务

**启用条件**: `hr.sdk.hrfile.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.hrfile.autoconfig.HrFileAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.hrfile.property.HrFileConfiguration`

#### 配置前缀

`hr.sdk.hrfile`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用文件服务 |
| `base-url` | String | 否 | 自动 | 自定义服务根URL，例如: http://dev-ntsgw.woa.com |

#### 环境自动配置

当未配置`base-url`时，根据Profile自动选择环境：

| Profile | Env枚举 | 说明 |
|---------|---------|------|
| TEST_SET (dev/local/default/test) | Env.TEST | 测试环境 |
| UAT_SET (uat) | Env.UAT | UAT环境 |
| PROD_SET (prod) | Env.PROD | 生产环境 |
| E_TEST_SET (etest) | Env.E_TEST | 外网测试环境 |
| E_PROD_SET (eprod/eprd) | Env.E_PROD | 外网生产环境 |

#### 配置示例

**自动环境**:

```yaml
spring:
  profiles:
    active: uat

hr:
  sdk:
    hrfile:
      enabled: true
```

**自定义URL**:

```yaml
hr:
  sdk:
    hrfile:
      enabled: true
      base-url: http://custom-file-service.woa.com
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `fileServicesConfig` | FileServicesConfig | 文件服务配置对象 |
| `fileServicesClient` | FileServicesClient | 文件服务客户端 |

#### 依赖配置

依赖全局应用配置（`hr.sdk.app.app-name`、`hr.sdk.app.app-token`）。

---

### 消息通道服务

**启用条件**: `hr.sdk.message.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.message.autoconfig.MessageChannelAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.message.property.MessageChannelConfiguration`

#### 配置前缀

`hr.sdk.message`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用消息通道服务 |
| `url` | String | 否 | 自动 | 自定义请求URL |

#### 环境自动地址

| Profile | 地址常量 |
|---------|---------|
| TEST_SET (dev/local/default/test) | MessageConstant.TEST_URL |
| UAT_SET (uat) | MessageConstant.UAT_URL |
| PROD_SET (prod) | MessageConstant.PROD_URL |
| E_TEST_SET (etest) | MessageConstant.E_TEST_URL |
| E_PROD_SET (eprod/eprd) | MessageConstant.E_PROD_URL |

#### 配置示例

```yaml
spring:
  profiles:
    active: prod

hr:
  sdk:
    message:
      enabled: true
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `messageChannelService` | MessageChannelService | 消息通道服务客户端（支持短信、邮件、企业微信等） |

#### 依赖配置

依赖全局应用配置（`hr.sdk.app.app-name`、`hr.sdk.app.app-token`）。

---

### 短链服务

**启用条件**: `hr.sdk.shorturl.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.shortUrl.autoconfig.ShortUrlAutoConfiguration`  
**配置类**: `com.tencent.hr.sdk.shortUrl.property.ShortUrlConfiguration`

#### 配置前缀

`hr.sdk.shorturl`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用短链服务 |
| `app-id` | String | 是 | - | 短链服务应用标识 |
| `app-secret` | String | 是 | - | 短链服务调用凭证 |
| `url` | String | 否 | 自动 | 自定义服务URL |

#### 环境自动地址

| Profile | ShortUrlEnv | 说明 |
|---------|-------------|------|
| TEST_SET (dev/local/default/test) | TEST_DEVNET | 测试开发网 |
| UAT_SET (uat) | TEST_DEVNET | UAT使用测试环境 |
| PROD_SET (prod) | PROD_OA_VPC | 生产OA VPC |
| E_TEST_SET (etest) | TEST_CLOUD_VPC | 云测试VPC |
| E_PROD_SET (eprod/eprd) | PROD_CLOUD_VPC | 云生产VPC |

#### 配置示例

```yaml
hr:
  sdk:
    shorturl:
      enabled: true
      app-id: short-app-123
      app-secret: short-secret-xyz
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `shortUrlService` | ShortUrlService | 短链服务客户端 |

---

### 工作流服务

**启用条件**: `hr.sdk.workflow.enabled=true`  
**自动配置类**: `com.tencent.hr.sdk.workflow.autoconfig.WorkflowAutoConfiguration`  
**配置类**: `com.tencent.hr.workflow.config.WorkflowClientProperties`

#### 配置前缀

`hr.sdk.workflow`

#### 配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|-------|------|
| `enabled` | Boolean | 是 | false | 是否启用工作流服务 |
| `base-url` | String | 否 | 自动 | 工作流服务基础URL |
| `mgmt-url` | String | 否 | 自动 | 工作流管理服务URL |

#### 环境默认地址

| 环境 | base-url | mgmt-url |
|-----|----------|----------|
| TEST (dev/local/default/test) | http://dev-ntsgw.woa.com/api/esb/workflow-service/api | http://dev-ntsgw.woa.com/api/esb/workflow-mgmt-service/api |
| UAT | http://uat-ntsgw.woa.com/api/esb/workflow-service/api | http://uat-ntsgw.woa.com/api/esb/workflow-mgmt-service/api |
| PROD | http://ntsgw.woa.com/api/esb/workflow-service/api | http://ntsgw.woa.com/api/esb/workflow-mgmt-service/api |

#### 配置示例

```yaml
spring:
  profiles:
    active: uat

hr:
  sdk:
    workflow:
      enabled: true
```

#### 自动配置Bean

| Bean名称 | 类型 | 说明 |
|---------|------|------|
| `workflowClientProperties` | WorkflowClientProperties | 工作流客户端配置 |
| `workflowClient` | WorkflowClient | 工作流客户端（SDCWorkflowClient实现） |

#### 特殊说明

- 工作流服务会自动注入全局应用配置（`gwAppId`、`gwAppToken`）
- 支持自定义`OkHttpClient`注入
- 使用`@ConditionalOnMissingBean`避免重复注册

---

## 环境Profile配置

### ProfileConstant - 环境常量

**类**: `com.tencent.hr.sdk.common.ProfileConstant`

#### 环境分类

| 分类常量 | 包含Profile | 说明 |
|---------|------------|------|
| `TEST_SET` | dev, local, default, test | 测试环境集合 |
| `UAT_SET` | uat | UAT环境集合 |
| `PROD_SET` | prod | 生产环境集合 |
| `E_TEST_SET` | etest | 外网测试环境集合 |
| `E_PROD_SET` | eprod, eprd | 外网生产环境集合 |

#### 使用示例

```yaml
# 测试环境
spring:
  profiles:
    active: dev

---
# UAT环境
spring:
  profiles:
    active: uat

---
# 生产环境
spring:
  profiles:
    active: prod
```

#### 环境识别逻辑

各服务的自动配置会根据 `Environment.getActiveProfiles()` 识别当前环境，并自动选择对应的服务地址。判断逻辑如下：

```java
String[] profiles = environment.getActiveProfiles();

if (Arrays.stream(profiles).anyMatch(ProfileConstant.TEST_SET::contains)) {
    // 使用测试环境配置
} else if (Arrays.stream(profiles).anyMatch(ProfileConstant.UAT_SET::contains)) {
    // 使用UAT环境配置
} else if (Arrays.stream(profiles).anyMatch(ProfileConstant.PROD_SET::contains)) {
    // 使用生产环境配置
}
```

---

## 自动配置详解

### BaseAutoConfiguration - 基础自动配置

**类**: `com.tencent.hr.sdk.BaseAutoConfiguration`

```java
@ComponentScan
@EnableConfigurationProperties
public class BaseAutoConfiguration {
}
```

- **功能**: 启用组件扫描和配置属性绑定
- **注册方式**: 通过 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

### 自动配置注册

**文件**: `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

```
com.tencent.hr.sdk.BaseAutoConfiguration
```

这是 Spring Boot 3.x 推荐的自动配置注册方式（替代了Spring Boot 2.x的 `spring.factories`）。

### 条件化Bean注册

所有服务的自动配置都使用 `@ConditionalOnProperty` 实现按需启用：

| 自动配置类 | 条件属性 | 条件值 |
|-----------|---------|--------|
| KmsAutoConfiguration | hr.sdk.kms.mode | normal |
| DosAutoConfiguration | hr.sdk.dos.enabled | true |
| EventBridgeAutoConfiguration | hr.sdk.event.enabled | true |
| HrFileAutoConfiguration | hr.sdk.hrfile.enabled | true |
| MessageChannelAutoConfiguration | hr.sdk.message.enabled | true |
| ShortUrlAutoConfiguration | hr.sdk.shorturl.enabled | true |
| WorkflowAutoConfiguration | hr.sdk.workflow.enabled | true |

---

## 完整配置示例

### 开发环境（application-dev.yml）

```yaml
spring:
  profiles:
    active: dev

hr:
  sdk:
    # 全局应用配置
    app:
      app-name: hrit-demo-app
      app-token: dev-token-123456

    # KMS密钥管理（启动模式）
    kms:
      mode: startup
      key-store: classpath:certs/409.p12
      key-store-password: cert-pass-dev
      json-secret-name: app-dev-config
      strict: false

    # DOS数据查询
    dos:
      enabled: true
      dos-base-url: https://uat-hrdos.woa.com
      connect-timeout: 5000
      read-timeout: 10000

    # 事件总线
    event:
      enabled: true
      # url会自动选择测试环境地址

    # 文件服务
    hrfile:
      enabled: true
      # base-url会自动选择测试环境

    # 消息通道
    message:
      enabled: true
      # url会自动选择测试环境地址

    # 短链服务
    shorturl:
      enabled: true
      app-id: short-dev-id
      app-secret: short-dev-secret

    # 工作流服务
    workflow:
      enabled: true
      # base-url和mgmt-url会自动选择测试环境地址
```

### 生产环境（application-prod.yml）

```yaml
spring:
  profiles:
    active: prod

hr:
  sdk:
    # 全局应用配置
    app:
      app-name: hrit-prod-app
      app-token: ${PROD_APP_TOKEN}  # 从环境变量读取

    # KMS密钥管理（常规模式）
    kms:
      mode: normal
      key-store: file:/data/certs/prod.p12
      key-store-password: ${KMS_CERT_PASSWORD}

    # DOS数据查询
    dos:
      enabled: true
      dos-base-url: https://hrdos.woa.com
      connect-timeout: 3000
      read-timeout: 8000

    # 事件总线
    event:
      enabled: true

    # 文件服务
    hrfile:
      enabled: true

    # 消息通道
    message:
      enabled: true

    # 短链服务
    shorturl:
      enabled: true
      app-id: ${SHORT_URL_APP_ID}
      app-secret: ${SHORT_URL_APP_SECRET}

    # 工作流服务
    workflow:
      enabled: true
```

### 最小化配置示例

仅启用必要的服务：

```yaml
spring:
  profiles:
    active: test

hr:
  sdk:
    app:
      app-name: simple-app
      app-token: simple-token

    # 仅启用消息服务
    message:
      enabled: true
```

---

## 配置最佳实践

### 1. 环境隔离

- 为不同环境创建独立的配置文件（`application-{profile}.yml`）
- 生产环境敏感信息使用环境变量或密钥管理

### 2. KMS使用建议

- **开发/测试环境**: 使用`normal`模式，按需调用KMS API
- **生产环境**: 使用`startup`模式，启动时加载密钥到配置，避免频繁调用

### 3. 服务启用原则

- 仅启用业务实际使用的服务（`enabled: true`）
- 未使用的服务保持禁用状态，避免不必要的Bean初始化

### 4. 超时配置

根据服务特性合理配置超时时间：

- **连接超时（connect-timeout）**: 建议3-5秒
- **读取超时（read-timeout）**: 根据业务复杂度，建议5-15秒

### 5. 自定义URL

- 优先使用自动环境识别
- 仅在特殊网络环境或灰度发布时自定义URL

---

## 故障排查

### 问题1：服务未启用

**现象**: 注入Bean时报`NoSuchBeanDefinitionException`

**解决方案**:

1. 检查对应服务的`enabled`配置是否为`true`
2. 检查KMS的`mode`配置是否正确

### 问题2：环境识别错误

**现象**: 服务地址不符合预期环境

**解决方案**:

1. 检查`spring.profiles.active`配置
2. 查看启动日志中的Profile信息
3. 自定义`url`/`base-url`覆盖自动识别

### 问题3：KMS启动失败

**现象**: 启动时抛出`KmsException`

**解决方案**:

1. 检查`key-store`证书路径是否正确
2. 检查`key-store-password`是否正确
3. 验证证书文件是否可访问

### 问题4：应用认证失败

**现象**: 调用服务时返回401/403错误

**解决方案**:

1. 检查`hr.sdk.app.app-name`和`hr.sdk.app.app-token`配置
2. 确认应用已在服务市场注册
3. 验证token是否过期或失效

---

## 版本历史

| 版本 | 更新内容 |
|-----|---------|
| 0.1.7 | 当前版本，支持Spring Boot 3.3.7 |

---

## 相关链接

- [hrit-sdk-core 项目文档](../hrit-sdk-core/docs/project-knowledge-index.md)
- [Spring Boot 3.0 迁移指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide)

---

**文档生成时间**: 2025-11-12  
**文档版本**: v1.0
