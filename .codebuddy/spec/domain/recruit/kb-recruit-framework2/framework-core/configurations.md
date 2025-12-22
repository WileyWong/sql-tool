# 配置类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目所有配置类的完整索引，包含所有Bean定义和配置方法  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.configuration` + `config`  
> **文件总数**: 6个

---

## 📑 目录

- [一、配置类概览](#一配置类概览)
- [二、核心自动配置](#二核心自动配置)
- [三、缓存和Redis配置](#三缓存和redis配置)
- [四、国际化配置](#四国际化配置)
- [五、分布式锁配置](#五分布式锁配置)
- [六、Feign配置](#六feign配置)

---

## 一、配置类概览

### 1.1 配置类分类统计

| 配置类型 | 数量 | 配置类 |
|---------|------|--------|
| **核心配置** | 2 | AutoRecruitConfiguration, SecurityConfiguration |
| **缓存配置** | 2 | RecruitCacheConfiguration, RecruitRedisConfiguration |
| **国际化配置** | 1 | AutoI18NConfiguration |
| **分布式锁配置** | 1 | LockDistributedConfiguration |
| **Feign配置** | 2 | FeignResultConfig, InnerFeignHeaderConfig |

### 1.2 配置依赖关系

```
AutoRecruitConfiguration (核心配置)
├── AutoI18NConfiguration (国际化)
├── RecruitCacheConfiguration (本地缓存)
│   └── RecruitRedisConfiguration (Redis缓存)
│       └── LockDistributedConfiguration (分布式锁)
└── SecurityConfiguration (安全配置)
```

---

## 二、核心自动配置

### 2.1 AutoRecruitConfiguration - 招聘框架自动配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.AutoRecruitConfiguration`

**功能描述**: 招聘中台框架核心自动配置类，配置拦截器、过滤器、RestTemplate等核心组件

**注解**:
- `@Configuration` - Spring配置类

**Bean列表** (8个):

| Bean名称 | 类型 | 条件注解 | 说明 |
|---------|------|---------|------|
| feignClientErrorInterceptor | ErrorDecoder | @ConditionalOnMissingBean | Feign错误解码器 |
| innerAuthContext | InnerAuthContext | - | 内部认证上下文 |
| defaultSpringUtil | SpringUtil | - | Spring工具类 |
| apiOperationLoggerInterceptor | ApiOperationLoggerInterceptor | - | API操作日志拦截器 |
| autoTrimParamInterceptor | AutoTrimParamInterceptor | - | 参数自动去空格拦截器 |
| innerRestTemplate | RestTemplate | - | 内部服务调用RestTemplate |
| restTemplate | RestTemplate | @Primary, @ConditionalOnMissingBean | 标准RestTemplate |
| defaultClientFactory | ClientHttpRequestFactory | - | HTTP客户端工厂 |
| tenantInfoHandler | ITenantInfoHandler | @ConditionalOnMissingBean | 租户信息处理器 |

**公共方法** (9个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `feignClientErrorInterceptor()` | ErrorDecoder | 创建Feign错误拦截器 |
| `innerAuthContext(Environment environment)` | InnerAuthContext | 创建内部认证上下文 |
| `defaultSpringUtil()` | SpringUtil | 创建Spring工具类 |
| `apiOperationLoggerInterceptor()` | ApiOperationLoggerInterceptor | 创建API日志拦截器 |
| `autoTrimParamInterceptor()` | AutoTrimParamInterceptor | 创建自动去空格拦截器 |
| `innerRestTemplate(InnerAuthContext, ClientHttpRequestFactory)` | RestTemplate | 创建内部RestTemplate |
| `restTemplate()` | RestTemplate | 创建标准RestTemplate |
| `simpleClientHttpRequestFactory()` | ClientHttpRequestFactory | 创建HTTP客户端工厂 |
| `defaultTenantHandler()` | ITenantInfoHandler | 创建默认租户处理器 |

**配置详情**:

#### innerRestTemplate配置
```java
@Bean(value = "innerRestTemplate")
public RestTemplate innerRestTemplate(
    @Autowired InnerAuthContext context, 
    @Autowired @Qualifier("defaultClientFactory") ClientHttpRequestFactory factory) {
    List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
    interceptors.add(new InnerHeaderRequestInterceptor(context));
    RestTemplate restTemplate = new RestTemplate(factory);
    restTemplate.setInterceptors(interceptors);
    return restTemplate;
}
```
- 专用于内部服务调用
- 自动添加内部认证Header
- 使用统一的HTTP配置

#### HTTP客户端配置
```java
@Bean(name = "defaultClientFactory")
public ClientHttpRequestFactory simpleClientHttpRequestFactory() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(15000);  // 连接超时：15秒
    factory.setReadTimeout(30000);     // 读取超时：30秒
    return factory;
}
```

---

### 2.2 SecurityConfiguration - 安全配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.SecurityConfiguration`

**功能描述**: 安全相关配置，包括XSS防护等

**Bean列表**:
- 安全过滤器
- XSS防护组件

---

## 三、缓存和Redis配置

### 3.1 RecruitCacheConfiguration - 缓存配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.RecruitCacheConfiguration`

**功能描述**: 本地缓存配置，基于Google Guava Cache

**注解**:
- `@Configuration` - Spring配置类

**Bean列表** (2个):

| Bean名称 | 类型 | 条件注解 | 说明 |
|---------|------|---------|------|
| cacheBuilder | CacheBuilder | @ConditionalOnClass, @ConditionalOnMissingBean | Guava缓存构建器 |
| localRecruitCache | LocalRecruitCache | @ConditionalOnBean(CacheBuilder) | 本地缓存实现 |

**公共方法** (2个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `cacheBuilder()` | CacheBuilder<Object, Object> | 创建缓存构建器 |
| `localRecruitCache(CacheBuilder)` | LocalRecruitCache<?> | 创建本地缓存 |

**缓存配置**:
```java
@Bean
public CacheBuilder<Object, Object> cacheBuilder() {
    CacheBuilder<Object, Object> builder = CacheBuilder.newBuilder();
    return builder
        .expireAfterAccess(60, TimeUnit.SECONDS)  // 访问后60秒过期
        .maximumSize(1024);                        // 最大1024个条目
}
```

---

### 3.2 RecruitRedisConfiguration - Redis配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.RecruitRedisConfiguration`

**功能描述**: Redis缓存配置，包括RedisTemplate、缓存拦截器等

**注解**:
- `@Configuration` - Spring配置类
- `@Import(RedisController.class)` - 导入Redis控制器
- `@ConditionalOnClass(value = RedisOperations.class)` - 需要Redis类存在

**Bean列表** (8个):

| Bean名称 | 类型 | 条件注解 | 说明 |
|---------|------|---------|------|
| redisTemplate | RedisTemplate | @Primary, @ConditionalOnMissingBean | 主Redis模板 |
| recruitRedisTemplate | RedisTemplate | - | 招聘专用Redis模板 |
| stringRedisTemplate | StringRedisTemplate | @ConditionalOnMissingBean | 字符串Redis模板 |
| redisRecruitCache | RedisRecruitCache | @ConditionalOnBean(RedisTemplate) | Redis缓存实现 |
| multiRecruitCache | MultiRecruitCache | @ConditionalOnBean | 多级缓存实现 |
| recruitCacheInterceptor | RecruitCacheInterceptor | @ConditionalOnBean(IRecruitCache) | 缓存拦截器 |
| recruitRepeatInterceptor | RecruitRepeatInterceptor | @ConditionalOnBean(StringRedisTemplate) | 防重复提交拦截器 |
| spelExpressionSupport | SpelExpressionSupport | @ConditionalOnBean(IRecruitCache) | SpEL表达式支持 |

**公共方法** (8个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `redisTemplate(RedisConnectionFactory)` | RedisTemplate<String, T> | 创建主Redis模板 |
| `recruitRedisTemplate(RedisConnectionFactory)` | RedisTemplate<String, T> | 创建招聘专用Redis模板 |
| `recruitStringRedisTemplate(RedisConnectionFactory)` | StringRedisTemplate | 创建字符串Redis模板 |
| `redisRecruitCache()` | RedisRecruitCache<?> | 创建Redis缓存 |
| `multiRecruitCache()` | MultiRecruitCache<?> | 创建多级缓存 |
| `recruitCacheInterceptor()` | RecruitCacheInterceptor | 创建缓存拦截器 |
| `recruitRepeatInterceptor()` | RecruitRepeatInterceptor | 创建防重复拦截器 |
| `spelExpressionSupport()` | SpelExpressionSupport | 创建SpEL支持 |

**RedisTemplate配置**:
```java
@Primary
@Bean("redisTemplate")
public <T> RedisTemplate<String, T> redisTemplate(
    @Autowired RedisConnectionFactory factory) {
    RedisTemplate<String, T> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(factory);
    // Key序列化：字符串
    redisTemplate.setKeySerializer(new StringRedisSerializer());
    // Value序列化：JSON
    redisTemplate.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
    redisTemplate.setEnableDefaultSerializer(true);
    redisTemplate.afterPropertiesSet();
    return redisTemplate;
}
```

**多级缓存配置**:
```java
@Bean
@ConditionalOnBean({LocalRecruitCache.class, RedisRecruitCache.class})
public MultiRecruitCache<?> multiRecruitCache() {
    return new MultiRecruitCache<>();
}
```
- 需要同时存在本地缓存和Redis缓存
- 自动组合成两级缓存

---

## 四、国际化配置

### 4.1 AutoI18NConfiguration - 国际化自动配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.AutoI18NConfiguration`

**功能描述**: 国际化配置，支持多语言消息、异常通知等

**注解**:
- `@Configuration` - Spring配置类

**实现接口**:
- `BeanPostProcessor` - Bean后置处理器

**常量定义**:

| 常量名 | 类型 | 值 | 说明 |
|-------|------|-----|------|
| CACHE_EXPRESS | long | 2 * 60 * 100 | 缓存保持时间（毫秒） |
| LOCATION_PATTERN | String | "i18n/messages" | 国际化文件路径 |

**配置属性**:

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| baseName | String | ${spring.message.basename} | 自定义国际化文件基础路径 |

**Bean列表** (4个):

| Bean名称 | 类型 | 注解 | 说明 |
|---------|------|-----|------|
| recruitMessageResource | MessageSource | @Primary | 国际化消息源 |
| defaultExceptionAdvice | IExceptionAdvice | - | 默认异常通知 |
| i18nUtil | I18nUtil | - | 国际化工具类 |
| localValidator | LocalValidatorFactoryBean | - | 本地验证器 |

**公共方法** (5个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `messageSource()` | MessageSource | 创建消息源 |
| `defaultExceptionAdvice()` | IExceptionAdvice | 创建异常通知 |
| `i18nUtil(MessageSource)` | I18nUtil | 创建国际化工具 |
| `localValidator(MessageSource)` | LocalValidatorFactoryBean | 创建验证器 |
| `postProcessBeforeInitialization(Object, String)` | Object | Bean后置处理 |

**MessageSource配置**:
```java
@Primary
@Bean(name = "recruitMessageResource")
public MessageSource messageSource() {
    RecruitMessageResource messageSource = new RecruitMessageResource();
    // 添加自定义基础路径
    if (StringUtils.isNotBlank(baseName)) {
        messageSource.addBasenames(baseName);
    }
    // 添加默认路径
    messageSource.addBasenames(LOCATION_PATTERN);
    // 编码设置
    messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
    messageSource.setFallbackToSystemLocale(Boolean.FALSE);
    messageSource.setCacheMillis(CACHE_EXPRESS);
    messageSource.setAlwaysUseMessageFormat(Boolean.FALSE);
    messageSource.setUseCodeAsDefaultMessage(Boolean.FALSE);
    return messageSource;
}
```

**验证器配置**:
```java
@Bean
public LocalValidatorFactoryBean localValidator(
    @Autowired MessageSource messageSource) {
    LocalValidatorFactoryBean factoryBean = new LocalValidatorFactoryBean();
    // 快速失败模式
    factoryBean.getValidationPropertyMap()
        .put("hibernate.validator.fail_fast", Boolean.TRUE.toString());
    // 使用国际化消息源
    factoryBean.setValidationMessageSource(messageSource);
    return factoryBean;
}
```

---

## 五、分布式锁配置

### 5.1 LockDistributedConfiguration - 分布式锁配置

**类路径**: `com.tencent.hr.recruit.center.framework.configuration.LockDistributedConfiguration`

**功能描述**: 基于Redis的分布式锁配置

**注解**:
- `@Configuration` - Spring配置类
- `@AutoConfigureAfter(RecruitRedisConfiguration.class)` - 在Redis配置后执行
- `@ConditionalOnClass({RedisLockRegistry.class, RedisOperations.class})` - 需要Redis相关类

**配置属性**:

| 属性名 | 类型 | 来源 | 说明 |
|-------|------|------|------|
| applicationName | String | ${spring.application.name} | 应用名称（作为锁前缀） |

**Bean列表** (2个):

| Bean名称 | 类型 | 注解 | 说明 |
|---------|------|-----|------|
| defaultRedisLockRegistry | RedisLockRegistry | @Primary | Redis锁注册表 |
| lockDistributedInterceptor | LockDistributedInterceptor | - | 分布式锁拦截器 |

**公共方法** (2个):

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `redisLockRegistry(RedisConnectionFactory)` | RedisLockRegistry | 创建Redis锁注册表 |
| `lockDistributedInterceptor()` | LockDistributedInterceptor | 创建分布式锁拦截器 |

**RedisLockRegistry配置**:
```java
@Primary
@Bean(LockDistributed.DEFAULT_NAME)  // Bean名称: "defaultRedisLockRegistry"
public RedisLockRegistry redisLockRegistry(
    RedisConnectionFactory redisConnectionFactory) {
    return new RedisLockRegistry(redisConnectionFactory, applicationName);
}
```
- 使用应用名称作为锁Key前缀
- 确保不同应用的锁不冲突

---

## 六、Feign配置

### 6.1 FeignResultConfig - Feign结果配置

**类路径**: `com.tencent.hr.recruit.center.framework.config.FeignResultConfig`

**功能描述**: 统一Feign返回结果处理配置

**Bean列表**:
- Feign结果解码器
- 结果转换器

---

### 6.2 InnerFeignHeaderConfig - 内部Feign Header配置

**类路径**: `com.tencent.hr.recruit.center.framework.config.InnerFeignHeaderConfig`

**功能描述**: 内部服务调用Header统一配置

**Bean列表**:
- Header拦截器
- 认证信息传递

---

## 📊 配置统计

### Bean统计

| 配置类 | Bean数量 | 主要Bean |
|-------|---------|---------|
| AutoRecruitConfiguration | 9个 | RestTemplate, 拦截器 |
| AutoI18NConfiguration | 4个 | MessageSource, I18nUtil |
| RecruitRedisConfiguration | 8个 | RedisTemplate, Cache |
| RecruitCacheConfiguration | 2个 | CacheBuilder, LocalCache |
| LockDistributedConfiguration | 2个 | RedisLockRegistry, 拦截器 |
| **总计** | **25+个** | - |

---

## 📝 使用示例

### 示例1: 使用内部RestTemplate
```java
@Service
public class UserRemoteService {
    
    @Autowired
    @Qualifier("innerRestTemplate")
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        String url = "http://user-service/user/" + userId;
        return restTemplate.getForObject(url, User.class);
    }
}
```

### 示例2: 使用国际化
```java
@Service
public class UserService {
    
    public void validateUser(User user) {
        if (user.getAge() < 18) {
            throw new RecruitRuntimeException("user.age.invalid", user.getAge());
        }
    }
}

// i18n/messages_zh_CN.properties
// user.age.invalid=用户年龄[{0}]不符合要求

// i18n/messages_en_US.properties
// user.age.invalid=User age[{0}] is invalid
```

### 示例3: 使用分布式锁
```java
@Service
public class OrderService {
    
    @LockDistributed(
        value = "defaultRedisLockRegistry",
        timeout = 30,
        key = "order:#{#orderId}"
    )
    public void createOrder(Long orderId) {
        // 分布式锁保护的业务逻辑
    }
}
```

---

## 📚 相关文档

- [缓存接口索引](./cache.md) - IRecruitCache接口详情
- [注解类索引](./annotations.md) - @LockDistributed等注解
- [拦截器索引](./filters-interceptors.md) - 各类拦截器配置
- [工具类索引](./utils.md) - I18nUtil等工具类

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完整列出所有Bean和配置方法 | v2.0 |
| 2025-11-21 | AI Assistant | 初始创建文档 | v1.0 |

---
