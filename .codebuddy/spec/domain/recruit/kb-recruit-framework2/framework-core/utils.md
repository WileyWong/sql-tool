# 工具类索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目所有工具类的完整索引，包含所有公共方法  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.utils`  
> **文件总数**: 15个

---

## 📑 目录

- [一、工具类概览](#一工具类概览)
- [二、断言工具类](#二断言工具类)
- [三、JSON工具类](#三json工具类)
- [四、转换工具类](#四转换工具类)
- [五、数据工具类](#五数据工具类)
- [六、Spring工具类](#六spring工具类)
- [七、国际化工具类](#七国际化工具类)
- [八、ID生成工具类](#八id生成工具类)
- [九、其他工具类](#九其他工具类)

---

## 一、工具类概览

### 1.1 工具类分类统计

| 类型 | 工具类名称 | 说明 |
|------|-----------|------|
| **断言工具** | AssertUtl, AssertNoticeUtl | 参数校验和断言 |
| **JSON工具** | JsonUtil | JSON序列化反序列化 |
| **转换工具** | ConvertUtil | 对象转换和复制 |
| **数据工具** | DataUtil | 数据处理和集合转换 |
| **Spring工具** | SpringUtil, SpringEventUtil | Spring容器操作 |
| **国际化** | I18nUtil | 国际化消息 |
| **ID生成** | SnowflakeUtil | 雪花ID生成 |
| **其他** | ReflectUtil, TraceUtil, RedisHelper等 | 反射、追踪、Redis等 |

---

## 二、断言工具类

### 2.1 AssertUtl - 断言工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.AssertUtl`

**功能描述**: 提供断言方法，条件不满足时抛出异常，支持字符串错误码和ErrorCode两种方式

**公共方法** (28个):

#### 布尔断言

| 方法签名 | 说明 |
|---------|------|
| `static void isTrue(Boolean status, String code, Object... args)` | 为false则抛出RecruitRuntimeException |
| `static void isFalse(Boolean status, String code, Object... args)` | 为true则抛出RecruitRuntimeException |
| `static void isTrue(Boolean status, ErrorCode code, Object... args)` | 为false则抛出RecruitCheckException |
| `static void isFalse(Boolean status, ErrorCode code, Object... args)` | 为true则抛出RecruitCheckException |

#### 对象断言

| 方法签名 | 说明 |
|---------|------|
| `static void isNull(Object object, String code, Object... args)` | 不为null则抛出异常 |
| `static void nonNull(Object object, String code, Object... args)` | 为null则抛出异常 |
| `static void isNull(Object object, ErrorCode code, Object... args)` | 不为null则抛出异常 |
| `static void nonNull(Object object, ErrorCode code, Object... args)` | 为null则抛出异常 |

#### 集合断言

| 方法签名 | 说明 |
|---------|------|
| `static void isEmpty(Collection<?> object, String code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(Collection<?> object, String code, Object... args)` | 为空则抛出异常 |
| `static void isEmpty(Collection<?> object, ErrorCode code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(Collection<?> object, ErrorCode code, Object... args)` | 为空则抛出异常 |

#### Map断言

| 方法签名 | 说明 |
|---------|------|
| `static void isEmpty(Map<?,?> object, String code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(Map<?,?> object, String code, Object... args)` | 为空则抛出异常 |
| `static void isEmpty(Map<?,?> object, ErrorCode code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(Map<?,?> object, ErrorCode code, Object... args)` | 为空则抛出异常 |

#### 字符串断言

| 方法签名 | 说明 |
|---------|------|
| `static void isEmpty(String object, String code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(String object, String code, Object... args)` | 为空则抛出异常 |
| `static void isEmpty(String object, ErrorCode code, Object... args)` | 不为空则抛出异常 |
| `static void notEmpty(String object, ErrorCode code, Object... args)` | 为空则抛出异常 |
| `static void isBlank(String object, String code, Object... args)` | 不为空白则抛出异常 |
| `static void isNotBlank(String object, String code, Object... args)` | 为空白则抛出异常 |
| `static void isBlank(String object, ErrorCode code, Object... args)` | 不为空白则抛出异常 |
| `static void isNotBlank(String object, ErrorCode code, Object... args)` | 为空白则抛出异常 |

#### 数字断言

| 方法签名 | 说明 |
|---------|------|
| `static void isNumber(String object, String code, Object... args)` | 不为数字则抛出异常 |
| `static void isNotNumber(String object, String code, Object... args)` | 为数字则抛出异常 |
| `static void isNumber(String object, ErrorCode code, Object... args)` | 不为数字则抛出异常 |
| `static void isNotNumber(String object, ErrorCode code, Object... args)` | 为数字则抛出异常 |

**使用示例**:
```java
// 参数非空校验
AssertUtl.nonNull(userId, "user.id.required");
AssertUtl.notEmpty(userList, CommonErrorCode.PARAM_ERROR);

// 字符串校验
AssertUtl.isNotBlank(userName, "user.name.blank");
AssertUtl.isNumber(ageStr, "age.must.number");

// 布尔条件校验
AssertUtl.isTrue(user.isActive(), "user.not.active");
```

---

### 2.2 AssertNoticeUtl - 断言通知工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.AssertNoticeUtl`

**功能描述**: 与AssertUtl类似，但抛出的异常会触发通知机制

**公共方法**: 与AssertUtl完全相同，共28个方法

---

## 三、JSON工具类

### 3.1 JsonUtil - JSON序列化工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.JsonUtil`

**功能描述**: 基于Jackson的JSON序列化和反序列化工具类

**公共方法** (6个):

| 方法签名 | 说明 |
|---------|------|
| `static String toJson(Object object)` | 对象序列化为JSON字符串 |
| `static <T> T fromJsonToObject(String content, Class<T> valueType)` | JSON反序列化为对象 |
| `static String fromJsonToString(String content)` | 去除JSON字符串的引号 |
| `static <T> List<T> fromJsonToList(String content, Class<T> valueType)` | JSON反序列化为List |
| `static <T> Set<T> fromJsonToSet(String content, Class<T> valueType)` | JSON反序列化为Set |
| `static <K,V> Map<K,V> fromJsonToMap(String content, Class<K> keyClass, Class<V> valueType)` | JSON反序列化为Map |

**特性**:
- 自动处理LocalDateTime等Java8时间类型
- 忽略未知属性
- 支持上下文序列化器
- 禁用日期时间戳格式

**使用示例**:
```java
// 对象转JSON
String json = JsonUtil.toJson(user);

// JSON转对象
User user = JsonUtil.fromJsonToObject(json, User.class);

// JSON转List
List<User> users = JsonUtil.fromJsonToList(json, User.class);

// JSON转Map
Map<String, User> userMap = JsonUtil.fromJsonToMap(json, String.class, User.class);
```

---

## 四、转换工具类

### 4.1 ConvertUtil - 对象转换工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.ConvertUtil`

**功能描述**: 对象属性复制和批量转换

**公共方法** (4个):

| 方法签名 | 说明 |
|---------|------|
| `static <T> T to(Object source, Class<T> targetClass)` | 单个对象属性复制 |
| `static <T> List<T> toList(Collection<?> collection, Class<T> targetClass)` | 集合批量转换 |
| `static <T> void copyWithoutNull(T source, T target)` | 复制非空属性 |
| `static String[] getNullPropertyNames(Object source)` | 获取对象的null属性名 |

**使用示例**:
```java
// DTO转Entity
UserEntity entity = ConvertUtil.to(userDTO, UserEntity.class);

// 批量转换
List<UserVO> voList = ConvertUtil.toList(entityList, UserVO.class);

// 复制非空属性（更新场景）
ConvertUtil.copyWithoutNull(updateDTO, existEntity);
```

---

## 五、数据工具类

### 5.1 DataUtil - 数据处理工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.DataUtil`

**功能描述**: 数值判断和集合转换

**公共方法** (11个):

#### 数值判断

| 方法签名 | 说明 |
|---------|------|
| `static boolean notZero(Integer number)` | 判断Integer不为0 |
| `static boolean gtZero(Integer number)` | 判断Integer大于0 |
| `static boolean notZero(Long number)` | 判断Long不为0 |
| `static boolean gtZero(Long number)` | 判断Long大于0 |
| `static boolean notZero(Double number)` | 判断Double不为0 |
| `static boolean gtZero(Double number)` | 判断Double大于0 |
| `static <T extends Comparable<T>> boolean between(T value, T min, T max)` | 判断值在范围内 |

#### 集合转换

| 方法签名 | 说明 |
|---------|------|
| `static <K,V> Map<K,V> toMap(Collection<V> collection, Function<V,K> getKey)` | 集合转Map（value为自身） |
| `static <K,V,T> Map<K,V> toMap(Collection<T> collection, Function<T,K> getKey, Function<T,V> getValue)` | 集合转Map（自定义value） |

**使用示例**:
```java
// 数值判断
if (DataUtil.gtZero(userId)) {
    // userId > 0
}

// 范围判断
if (DataUtil.between(age, 18, 60)) {
    // age在18-60之间
}

// 集合转Map
Map<Long, User> userMap = DataUtil.toMap(userList, User::getId);

// 自定义value
Map<Long, String> nameMap = DataUtil.toMap(userList, User::getId, User::getName);
```

---

## 六、Spring工具类

### 6.1 SpringUtil - Spring容器工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.SpringUtil`

**功能描述**: 访问Spring容器，获取Bean和配置

**公共方法** (8个):

| 方法签名 | 说明 |
|---------|------|
| `static ApplicationContext getApplicationContext()` | 获取ApplicationContext |
| `static <T> T getBean(Class<T> tClass)` | 根据类型获取Bean |
| `static Object getBean(String name)` | 根据名称获取Bean |
| `static <T> T getBean(String name, Class<T> clazz)` | 根据名称和类型获取Bean |
| `static <T> List<T> getBeanList(Class<T> clazz)` | 获取指定类型的所有Bean列表 |
| `static <T> Map<String,T> getBeanMap(Class<T> clazz)` | 获取指定类型的所有Bean Map |
| `static String serviceName()` | 获取服务名称 |
| `static String active()` | 获取激活的profile |

**使用示例**:
```java
// 获取Bean
UserService userService = SpringUtil.getBean(UserService.class);

// 获取所有实现类
List<IMessageHandler> handlers = SpringUtil.getBeanList(IMessageHandler.class);

// 获取配置
String serviceName = SpringUtil.serviceName();
String env = SpringUtil.active();
```

---

### 6.2 SpringEventUtil - Spring事件工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.SpringEventUtil`

**功能描述**: 发布Spring应用事件

**公共方法** (1个):

| 方法签名 | 说明 |
|---------|------|
| `static void publishEvent(ApplicationEvent event)` | 发布应用事件 |

**使用示例**:
```java
// 发布事件
SpringEventUtil.publishEvent(new UserCreatedEvent(userId));
```

---

## 七、国际化工具类

### 7.1 I18nUtil - 国际化消息工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.I18nUtil`

**功能描述**: 获取国际化消息文本

**公共方法** (4个):

| 方法签名 | 说明 |
|---------|------|
| `static String getMessage(String key, Object... args)` | 根据key获取国际化消息 |
| `static String getMessage(RecruitRuntimeException exception)` | 获取运行异常的国际化消息 |
| `static String getMessage(RecruitException exception)` | 获取异常的国际化消息 |
| `static String getMessage(ErrorCode status, Object... args)` | 根据错误码获取国际化消息 |

**特性**:
- 自动根据当前Locale选择语言
- 支持占位符替换
- Class类型参数自动转换为国际化文本

**使用示例**:
```java
// 基本用法
String msg = I18nUtil.getMessage("user.not.found", userId);

// 错误码
String errorMsg = I18nUtil.getMessage(CommonErrorCode.PARAM_ERROR);

// 异常
String exMsg = I18nUtil.getMessage(exception);
```

---

## 八、ID生成工具类

### 8.1 SnowflakeUtil - 雪花ID生成器

**类路径**: `com.tencent.hr.recruit.center.framework.utils.SnowflakeUtil`

**功能描述**: 基于Snowflake算法生成分布式唯一ID

**公共方法** (1个):

| 方法签名 | 说明 |
|---------|------|
| `static long nextId()` | 生成下一个唯一ID |

**特性**:
- 趋势递增的64位long型ID
- 毫秒级别的时间戳
- 根据IP地址自动计算机器ID
- 单机每毫秒可生成4096个ID

**使用示例**:
```java
// 生成唯一ID
long id = SnowflakeUtil.nextId();
```

---

## 九、其他工具类

### 9.1 ReflectUtil - 反射工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.ReflectUtil`

**功能描述**: 反射相关操作

**主要方法**:
- 获取类的字段和方法
- 调用私有方法
- 设置字段值

---

### 9.2 TraceUtil - 链路追踪工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.TraceUtil`

**功能描述**: 分布式链路追踪ID管理

**主要方法**:
- 生成TraceId
- 获取当前TraceId
- 设置TraceId到上下文

---

### 9.3 RedisHelper - Redis辅助工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.RedisHelper`

**功能描述**: Redis操作辅助方法

---

### 9.4 DesensitizationUtil - 脱敏工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.DesensitizationUtil`

**功能描述**: 数据脱敏处理

**主要方法**:
- 手机号脱敏
- 身份证脱敏
- 邮箱脱敏

---

### 9.5 SHA1Util - SHA1加密工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.SHA1Util`

**功能描述**: SHA1哈希计算

---

### 9.6 StaffUtil - 员工信息工具

**类路径**: `com.tencent.hr.recruit.center.framework.utils.StaffUtil`

**功能描述**: 获取当前员工信息

---

## 📚 相关文档

- [核心类索引](./core.md) - Core包核心类
- [实体类索引](./entities.md) - 实体类字段列表
- [异常类索引](./exceptions.md) - 异常处理类
- [Support支持类索引](./support.md) - 支持类和辅助类

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 基于实际源码重写文档 | v2.0 |
| 2025-11-21 | AI Assistant | 初始创建文档 | v1.0 |

---
