# Feign接口索引文档

> **文档说明**: 本文档为 `RecruitCenterExceptionStarter` 项目 `feign` 包下所有Feign接口的完整索引  
> **生成时间**: 2025-11-24  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.error.feign`  
> **文件总数**: 1个

---

## 📑 目录

- [一、架构概览](#一架构概览)
- [二、详细清单](#二详细清单)
- [三、技术架构说明](#三技术架构说明)
- [四、最佳实践建议](#四最佳实践建议)

---

## 一、架构概览

### 1.1 目录结构

```
feign/
└── RecruitTenantSystemFeign.java (1个) - 系统配置Feign接口
```

### 1.2 按功能分类

| 功能模块 | 文件数量 | 核心功能 |
|---------|---------|---------|
| 系统配置远程调用 | 1 | 获取租户系统配置信息 |

---

## 二、详细清单

### 2.1 RecruitTenantSystemFeign - 系统配置Feign接口

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.error.feign.RecruitTenantSystemFeign`
- **文件大小**: 1.29 KB
- **目标服务**: recruit-standard-resource-service
- **注解**: `@FeignClient`

**@FeignClient配置**:

| 配置项 | 值 | 说明 |
|-------|-----|------|
| name | recruit-standard-resource-service | 服务名称（用于服务发现） |
| qualifier | recruitTenantSystemFeign | Bean限定符名称 |
| url | ${recruit-framework.recruit-standard-resource-api:} | 服务URL（可选，为空时使用服务发现） |
| configuration | {RecruitSystemFeignConfig.class} | Feign配置类 |

**接口方法** (1个):

### getByCode - 获取系统配置

**方法签名**:
```java
@GetMapping(value = "/api/remote/tenant-system-config/get", consumes = MediaType.ALL_VALUE)
Result<String> getByCode(@RequestParam String serviceName, @RequestParam String code);
```

**参数说明**:

| 参数名 | 类型 | 说明 |
|-------|------|------|
| serviceName | String | 服务名称（如：recruit-user-service） |
| code | String | 配置编码（如：ExceptionNoticeConfig） |

**返回值**:
- **类型**: Result&lt;String&gt;
- **data**: JSON字符串格式的配置内容
- **示例**:
```json
{
    "code": 200,
    "success": true,
    "data": "{\"members\":[\"zhangsan\",\"lisi\"],\"wxBotHook\":\"https://...\",\"limit\":10}"
}
```

**使用示例**:
```java
@Autowired
private RecruitTenantSystemFeign systemFeign;

// 获取异常通知配置
Result<String> result = systemFeign.getByCode("recruit-user-service", "ExceptionNoticeConfig");
if (Objects.isNull(result) || StringUtils.isBlank(result.getData())) {
    return null;
}

// 解析JSON为DTO
ExceptionNoticeDTO notice = JsonUtil.fromJsonToObject(result.getData(), ExceptionNoticeDTO.class);
```

**实际应用** (在CloudMessageExceptionAdvice中):
```java
private ExceptionNoticeDTO getExceptionNoticeConfig() {
    String redisKey = FrameworkRedisKey.EXCEPTION_NOTICE.key(serviceName);
    
    // 1. 先从Redis缓存获取
    ExceptionNoticeDTO notice = redisRecruitCache.get(redisKey, FrameworkRedisKey.EXCEPTION_NOTICE.expire());
    if (Objects.nonNull(notice)) return notice;
    
    // 2. 缓存未命中，调用Feign获取
    Result<String> result = systemFeign.getByCode(serviceName, "ExceptionNoticeConfig");
    if (Objects.isNull(result) || StringUtils.isBlank(result.getData())) {
        return null;
    }
    
    // 3. 解析JSON
    notice = JsonUtil.fromJsonToObject(result.getData(), ExceptionNoticeDTO.class);
    
    // 4. 写入Redis缓存
    redisRecruitCache.set(redisKey, notice, FrameworkRedisKey.EXCEPTION_NOTICE.expire());
    
    return notice;
}
```

**配置示例**:
```yaml
# application.yml
recruit-framework:
  recruit-standard-resource-api: http://recruit-standard-resource-service:8080
  # 或者留空，使用服务发现
  # recruit-standard-resource-api: 
```

---

## 三、技术架构说明

### 3.1 核心技术栈
- **Spring Cloud OpenFeign**: 声明式REST客户端
- **Feign配置**: RecruitSystemFeignConfig提供请求拦截器
- **服务发现**: 支持通过服务名调用（url为空时）

### 3.2 设计模式
- **门面模式**: Feign接口封装HTTP调用细节
- **代理模式**: Feign动态代理实现接口调用
- **配置模式**: 通过RecruitSystemFeignConfig统一配置

### 3.3 关键特性
1. **服务发现**: 支持Eureka/Consul等服务注册中心
2. **直连模式**: 通过url配置支持直连调用
3. **请求拦截**: RecruitSystemFeignConfig添加认证信息
4. **统一响应**: 返回Result&lt;T&gt;统一响应格式

---

## 四、最佳实践建议

### 4.1 开发规范

```java
// ✅ 推荐做法：配置qualifier避免Bean冲突
@FeignClient(
    name = "recruit-standard-resource-service",
    qualifier = "recruitTenantSystemFeign",  // 指定Bean名称
    configuration = {RecruitSystemFeignConfig.class}
)
public interface RecruitTenantSystemFeign {
    // 接口定义
}

// ❌ 不推荐做法：不配置qualifier
@FeignClient(name = "recruit-standard-resource-service")
public interface RecruitTenantSystemFeign {
    // 可能与其他FeignClient冲突
}
```

### 4.2 调用建议

```java
// ✅ 推荐：加缓存避免频繁调用
private ExceptionNoticeDTO getConfig() {
    // 1. 先查缓存
    ExceptionNoticeDTO notice = cache.get(key);
    if (Objects.nonNull(notice)) return notice;
    
    // 2. 缓存未命中才调用Feign
    Result<String> result = feign.getByCode(serviceName, code);
    
    // 3. 写入缓存
    notice = parse(result.getData());
    cache.set(key, notice, expireTime);
    return notice;
}

// ❌ 不推荐：每次都调用Feign
private ExceptionNoticeDTO getConfig() {
    Result<String> result = feign.getByCode(serviceName, code);
    return parse(result.getData());
}
```

### 4.3 异常处理

```java
// ✅ 推荐：完整的异常处理
try {
    Result<String> result = feign.getByCode(serviceName, code);
    if (Objects.isNull(result)) {
        log.warn("Feign调用返回null");
        return null;
    }
    if (StringUtils.isBlank(result.getData())) {
        log.warn("配置内容为空");
        return null;
    }
    return JsonUtil.fromJsonToObject(result.getData(), ExceptionNoticeDTO.class);
} catch (Exception e) {
    log.error("获取配置失败", e);
    return null;
}

// ❌ 不推荐：不处理异常
Result<String> result = feign.getByCode(serviceName, code);
return JsonUtil.fromJsonToObject(result.getData(), ExceptionNoticeDTO.class);
```

### 4.4 配置建议

```yaml
# ✅ 推荐：支持多环境配置
spring:
  profiles:
    active: @spring.profiles.active@

---
spring:
  profiles: dev
recruit-framework:
  recruit-standard-resource-api: http://localhost:8080

---
spring:
  profiles: test
recruit-framework:
  recruit-standard-resource-api: http://test-server:8080

---
spring:
  profiles: prod
recruit-framework:
  recruit-standard-resource-api:  # 留空使用服务发现
```

### 4.5 常见问题

**问题1**: Feign调用超时
- **原因**: 默认超时时间较短
- **解决**: 配置Feign超时时间
```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 10000
```

**问题2**: 服务发现失败
- **原因**: url配置错误或服务未注册
- **解决**: 检查url配置和服务注册状态

**问题3**: 返回结果为null
- **原因**: 目标服务返回204或异常
- **解决**: 在调用处判空处理

**问题4**: 认证失败
- **原因**: RecruitSystemFeignConfig配置错误
- **解决**: 检查recruit-framework.recruit-standard-resource-api配置

---

## 📚 相关文档

- [Config配置索引](./config.md) - RecruitSystemFeignConfig详细配置
- [Advice索引](./advice.md) - CloudMessageExceptionAdvice使用示例
- [Configuration索引](./configuration.md) - @EnableFeignClients配置

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-24 | AI Assistant | 初始创建文档，完整记录所有接口方法和配置 | v1.0 |

---
