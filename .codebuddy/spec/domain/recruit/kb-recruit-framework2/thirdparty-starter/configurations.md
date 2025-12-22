# 配置类索引文档

> **生成时间**: 2025-11-21  
> **项目**: RecruitCenterThirdPartyStarter  
> **说明**: 本文档列出项目中所有Configuration和Config类及其配置信息

---

## 📋 目录

- [1. 注解启用配置](#1-注解启用配置)
- [2. 效率模块配置 (efficiency)](#2-效率模块配置-efficiency)
- [3. 文件服务配置 (file)](#3-文件服务配置-file)
- [4. 权限配置 (hrright)](#4-权限配置-hrright)
- [5. 假期服务配置 (holiday)](#5-假期服务配置-holiday)
- [6. 数据市场配置 (market)](#6-数据市场配置-market)

---

## 1. 注解启用配置

### 1.1 EnableRecruitConfig
**路径**: `annotation/EnableRecruitConfig.java`  
**类型**: 注解

#### 功能说明
开启招聘相关的接口服务

#### 自动导入配置
| 配置类 | 说明 |
|--------|------|
| RecruitEfficiencyConfiguration | 招聘效率配置 |
| RecruitDataMarketConfiguration | 招聘数据市场配置 |

#### 使用方式
```java
@EnableRecruitConfig
@SpringBootApplication
public class Application {
    // ...
}
```

---

## 2. 效率模块配置 (efficiency)

### 2.1 RecruitEfficiencyFeignConfig
**路径**: `efficiency/config/RecruitEfficiencyFeignConfig.java`  
**类型**: Feign配置类

#### Bean定义
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| requestInterceptor | RequestInterceptor | Feign请求拦截器 |

#### 配置属性
| 属性名 | 说明 |
|--------|------|
| recruit-framework.recruit-efficiency-api | 招聘效率API地址 |

#### 关键方法
```java
public RequestInterceptor requestInterceptor(Environment environment)
```

---

### 2.2 TencentEfficiencyFeignConfig
**路径**: `efficiency/config/TencentEfficiencyFeignConfig.java`  
**类型**: Feign配置类

#### Bean定义
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| requestInterceptor | RequestInterceptor | Feign请求拦截器 |

#### 配置属性
| 属性名 | 说明 |
|--------|------|
| recruit-framework.tencent-efficiency-api | 腾讯效率API地址 |

---

### 2.3 RecruitEfficiencyConfiguration
**路径**: `efficiency/configuration/RecruitEfficiencyConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Configuration, @EnableFeignClients

#### Feign扫描包
```
com.tencent.hr.recruit.center.framework.third.efficiency.feign
```

#### Bean定义
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| recruitConfigService | RecruitConfigService | 招聘配置服务 |

---

## 3. 文件服务配置 (file)

### 3.1 RecruitFileServiceConfiguration
**路径**: `file/configuration/RecruitFileServiceConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Configuration

#### Bean定义
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| recruitFileService | FileService | 文件服务实现 |

---

## 4. 权限配置 (hrright)

### 4.1 RecruitRightConfiguration
**路径**: `hrright/configuration/RecruitRightConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Configuration, @ConditionalOnBean(AuthService.class)

#### 前置条件
需要存在AuthService Bean

#### Bean定义

##### 4.1.1 核心Bean
| Bean名称 | 类型 | 说明 | 依赖条件 |
|----------|------|------|----------|
| rightHandler | RecruitRightHandler | 权限处理器 | - |
| recruitAuthInterceptor | RecruitAuthInterceptor | 权限拦截器 | RecruitRightHandler |
| staffRightUtils | StaffRightUtils | 员工权限工具类 | RecruitRightHandler |

##### 4.1.2 规则Bean
| Bean名称 | 类型 | 说明 | 依赖条件 |
|----------|------|------|----------|
| defaultAndRule | AndRule | AND规则 | RecruitRightHandler |
| defaultOrRule | OrRule | OR规则 | RecruitRightHandler |
| defaultSpelRule | SpelRule | SpEL规则 | RecruitRightHandler |

##### 4.1.3 环境Bean
| Bean名称 | 类型 | Profile | 说明 |
|----------|------|---------|------|
| defaultActuator | StaffActuator | dev,uat,test,local,prod | 默认用户执行器 |
| tenantActuator | TenantStaffActuator | edev,euat,etest,elocal,eprod | 租户用户执行器 |

---

## 5. 假期服务配置 (holiday)

### 5.1 HolidayConfig
**路径**: `holiday/config/HolidayConfig.java`  
**类型**: 配置类  
**注解**: @Data, @RequiredArgsConstructor

#### 字段定义
| 字段名 | 类型 | 注解 | 说明 |
|--------|------|------|------|
| apiUrl | String | @Value | 假期API地址配置 |
| defaultApiUrl | String | final | 默认假期API地址 |

#### 配置属性
| 属性名 | 默认值 | 说明 |
|--------|--------|------|
| recruit-framework.holiday-api | "" | 假期API地址 |

#### 公共方法
| 方法签名 | 返回类型 | 说明 |
|----------|----------|------|
| `getUrl()` | String | 获取实际使用的URL（配置优先） |
| `build(String url)` | HolidayConfig | 静态工厂方法 |

---

### 5.2 RecruitHolidayConfiguration
**路径**: `holiday/configuration/RecruitHolidayConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Configuration

#### Bean定义（按环境）

##### 5.2.1 通用Bean
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| holidayService | HolidayService | 假期服务 |

##### 5.2.2 开发环境Bean
| Bean名称 | 类型 | Profile | 配置值 |
|----------|------|---------|--------|
| holidayConfig | HolidayConfig | test,uat,dev,local | http://dev.newholiday.oa.com/api/public/GetHolidayDays |

##### 5.2.3 生产环境Bean
| Bean名称 | 类型 | Profile | 配置值 |
|----------|------|---------|--------|
| holidayConfig | HolidayConfig | prod | http://holiday.oa.com/api/public/GetHolidayDays |

---

## 6. 数据市场配置 (market)

### 6.1 OpLogPulsarConfig
**路径**: `market/config/OpLogPulsarConfig.java`  
**类型**: 配置类  
**注解**: @Data, @Configuration, @ConfigurationProperties

#### 配置前缀
```
recruit-framework.log-pulsar
```

#### 字段定义
| 字段名 | 类型 | 说明 |
|--------|------|------|
| serviceUrl | String | Pulsar服务URL |
| tokenAuthValue | String | Token认证值 |
| tenant | String | 租户 |
| namespace | String | 命名空间 |

#### 完整配置示例
```yaml
recruit-framework:
  log-pulsar:
    service-url: pulsar://xxx
    token-auth-value: xxx
    tenant: xxx
    namespace: xxx
```

---

### 6.2 RecruitDataMarketFeignConfig
**路径**: `market/config/RecruitDataMarketFeignConfig.java`  
**类型**: Feign配置类

#### Bean定义
| Bean名称 | 类型 | 说明 |
|----------|------|------|
| requestInterceptor | RequestInterceptor | Feign请求拦截器 |

#### 配置属性
| 属性名 | 说明 |
|--------|------|
| recruit-framework.recruit-standard-resource-api | 招聘标准资源API地址 |

---

### 6.3 RecruitDataMarketConfiguration
**路径**: `market/configuration/RecruitDataMarketConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Configuration, @EnableFeignClients

#### Feign扫描包
```
com.tencent.hr.recruit.center.framework.third.market.feign
```

#### Bean定义（按环境）

##### 6.3.1 腾讯环境Bean
| Bean名称 | 类型 | Profile | 实现类 |
|----------|------|---------|--------|
| dataMarketRemoteService | DataMarketRemoteService | dev,test,uat,prod | TencentDataMarketRemoteService |
| hrcDataRemoteService | HRCDataRemoteService | dev,test,uat,prod | HRCDataRemoteServiceImpl |

##### 6.3.2 租户环境Bean
| Bean名称 | 类型 | Profile | 实现类 |
|----------|------|---------|--------|
| dataMarketRemoteService | DataMarketRemoteService | edev,etest,euat,eprod | TenantDataMarketRemoteService |

---

### 6.4 RecruitOpLogConfiguration
**路径**: `market/configuration/RecruitOpLogConfiguration.java`  
**类型**: Spring配置类  
**注解**: @Slf4j, @Configuration, @ImportAutoConfiguration

#### 自动导入配置
| 配置类 | 说明 |
|--------|------|
| OpLogPulsarConfig | 操作日志Pulsar配置 |

#### 字段定义
| 字段名 | 类型 | 注解 | 说明 |
|--------|------|------|------|
| applicationName | String | @Value | 应用名称 |
| config | OpLogPulsarConfig | @Autowired | Pulsar配置 |

#### 生命周期方法

##### 初始化方法
| 方法名 | 注解 | 说明 |
|--------|------|------|
| opLogProducerInit() | @PostConstruct | 初始化操作日志生产者 |

**功能**:
1. 创建PulsarClient客户端
2. 配置Token认证
3. 创建消息生产者
4. 设置服务名称

##### 销毁方法
| 方法名 | 注解 | 说明 |
|--------|------|------|
| close() | @PreDestroy | 关闭Pulsar连接 |

---

## 📊 统计信息

- **配置类总数**: 12
- **注解配置**: 1
- **Feign配置**: 3
- **Spring配置**: 7
- **普通配置**: 2
- **环境Bean总数**: 8个（不同Profile）

---

## 🔧 配置分类

### 按功能分类
| 类别 | 数量 | 配置类 |
|------|------|--------|
| 启用注解 | 1 | EnableRecruitConfig |
| Feign配置 | 3 | RecruitEfficiencyFeignConfig, TencentEfficiencyFeignConfig, RecruitDataMarketFeignConfig |
| 服务配置 | 4 | RecruitEfficiencyConfiguration, RecruitFileServiceConfiguration, RecruitHolidayConfiguration, RecruitDataMarketConfiguration |
| 权限配置 | 1 | RecruitRightConfiguration |
| 消息配置 | 1 | RecruitOpLogConfiguration |
| 参数配置 | 2 | HolidayConfig, OpLogPulsarConfig |

### 按环境分类
| 环境类型 | Profile | 说明 |
|----------|---------|------|
| 腾讯内部环境 | dev, test, uat, prod | 使用腾讯数据市场服务 |
| 租户环境 | edev, etest, euat, eprod | 使用租户数据市场服务 |

---

## 📝 配置属性清单

### 必需配置
| 属性名 | 说明 | 示例 |
|--------|------|------|
| recruit-framework.recruit-efficiency-api | 招聘效率API地址 | http://xxx |
| recruit-framework.tencent-efficiency-api | 腾讯效率API地址 | http://xxx |
| recruit-framework.recruit-standard-resource-api | 招聘标准资源API地址 | http://xxx |
| recruit-framework.log-pulsar.service-url | Pulsar服务URL | pulsar://xxx |
| recruit-framework.log-pulsar.token-auth-value | Pulsar Token | xxx |
| recruit-framework.log-pulsar.tenant | Pulsar租户 | xxx |
| recruit-framework.log-pulsar.namespace | Pulsar命名空间 | xxx |
| spring.application.name | 应用名称 | xxx |

### 可选配置
| 属性名 | 默认值 | 说明 |
|--------|--------|------|
| recruit-framework.holiday-api | 环境默认值 | 假期API地址 |

---

## 🎯 使用建议

1. **启用配置**: 使用`@EnableRecruitConfig`注解快速启用招聘相关服务
2. **环境隔离**: 通过Profile区分腾讯内部和租户环境
3. **Feign配置**: 各模块的Feign客户端已自动配置拦截器
4. **权限配置**: 需要AuthService Bean才能启用权限功能
5. **日志配置**: OpLog需要正确配置Pulsar连接信息

---

*文档生成完成*
