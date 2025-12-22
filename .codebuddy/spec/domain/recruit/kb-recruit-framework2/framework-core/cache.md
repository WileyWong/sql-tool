# 缓存接口索引文档

> **文档说明**: 本文档为 RecruitCenterFrameworkCore 项目缓存相关类的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `com.tencent.hr.recruit.center.framework.cache`  
> **文件总数**: 4个

---

## 📑 目录

- [一、缓存接口概览](#一缓存接口概览)
- [二、IRecruitCache接口](#二irecruitcache接口)
- [三、缓存实现类](#三缓存实现类)

---

## 一、缓存接口概览

### 1.1 缓存组件分类

| 类型 | 名称 | 说明 |
|------|------|------|
| **核心接口** | IRecruitCache | 缓存操作统一接口 |
| **实现类** | LocalRecruitCache | 本地缓存实现 |
| **实现类** | RedisRecruitCache | Redis缓存实现 |
| **实现类** | MultiRecruitCache | 多级缓存实现（本地+Redis） |

---

## 二、IRecruitCache接口

### 2.1 接口定义

**类路径**: `com.tencent.hr.recruit.center.framework.cache.IRecruitCache`

**功能描述**: 统一的缓存操作接口，支持泛型，提供多种数据结构的缓存操作

**泛型参数**: `T` - 缓存值类型

### 2.2 核心方法 (7个)

#### 基础Get方法

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `T get(String key)` | T | 获取单个对象 |
| `List<T> list(String key, Class<T> clazz)` | List\<T\> | 获取列表 |
| `Set<T> hashSet(String key, Class<T> clazz)` | Set\<T\> | 获取Set集合 |
| `<K> Map<K,T> map(String key, Class<K> keyClazz, Class<T> valueClass)` | Map\<K,T\> | 获取Map |

#### 基础Set方法

| 方法签名 | 说明 |
|---------|------|
| `void set(String key, T data)` | 永久缓存单个对象 |
| `<K> void set(String key, Map<K,T> data)` | 永久缓存Map |
| `void set(String key, Collection<T> data)` | 永久缓存集合 |

### 2.3 Key管理方法 (3个)

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `boolean hasKey(String key)` | boolean | 判断key是否存在 |
| `void remove(String... key)` | void | 批量删除key |
| `boolean expire(String key, long time)` | boolean | 设置过期时间（秒） |

### 2.4 过期时间管理 (2个)

| 方法签名 | 返回类型 | 说明 |
|---------|---------|------|
| `boolean expire(String key, Date date)` | boolean | 设置过期时间点 |
| `boolean expire(String key, long time, TimeUnit unit)` | boolean | 设置过期时间（指定单位） |

### 2.5 获取并刷新方法 (12个)

**单个对象**:
- `T get(String key, long time)` - 获取并刷新（秒）
- `T get(String key, Date time)` - 获取并刷新（时间点）
- `T get(String key, long time, TimeUnit unit)` - 获取并刷新（指定单位）

**列表**:
- `List<T> list(String key, Class<T> clazz, long time)` - 获取列表并刷新（秒）
- `List<T> list(String key, Class<T> clazz, Date time)` - 获取列表并刷新（时间点）
- `List<T> list(String key, Class<T> clazz, long time, TimeUnit unit)` - 获取列表并刷新（指定单位）

**Set集合**:
- `Set<T> hashSet(String key, Class<T> clazz, long time)` - 获取Set并刷新（秒）
- `Set<T> hashSet(String key, Class<T> clazz, Date time)` - 获取Set并刷新（时间点）
- `Set<T> hashSet(String key, Class<T> clazz, long time, TimeUnit unit)` - 获取Set并刷新（指定单位）

**Map**:
- `<K> Map<K,T> map(String key, Class<K> keyClazz, Class<T> valueClass, long time)` - 获取Map并刷新（秒）
- `<K> Map<K,T> map(String key, Class<K> keyClazz, Class<T> valueClass, Date time)` - 获取Map并刷新（时间点）
- `<K> Map<K,T> map(String key, Class<K> keyClazz, Class<T> valueClass, long time, TimeUnit unit)` - 获取Map并刷新（指定单位）

### 2.6 缓存并设置过期时间 (9个)

**单个对象**:
- `void set(String key, T data, long time)` - 缓存并设置过期（秒）
- `void set(String key, T data, Date time)` - 缓存并设置过期（时间点）
- `void set(String key, T data, long time, TimeUnit unit)` - 缓存并设置过期（指定单位）

**集合**:
- `void set(String key, Collection<T> data, long time)` - 缓存集合并设置过期（秒）
- `void set(String key, Collection<T> data, Date time)` - 缓存集合并设置过期（时间点）
- `void set(String key, Collection<T> data, long time, TimeUnit unit)` - 缓存集合并设置过期（指定单位）

**Map**:
- `<K> void set(String key, Map<K,T> data, long time)` - 缓存Map并设置过期（秒）
- `<K> void set(String key, Map<K,T> data, Date time)` - 缓存Map并设置过期（时间点）
- `<K> void set(String key, Map<K,T> data, long time, TimeUnit unit)` - 缓存Map并设置过期（指定单位）

### 2.7 使用示例

```java
// 1. 注入缓存接口
@Autowired
private IRecruitCache<User> userCache;

// 2. 基础缓存操作
// 缓存单个对象
userCache.set("user:123", user);

// 获取单个对象
User user = userCache.get("user:123");

// 3. 带过期时间的缓存
// 缓存1小时
userCache.set("user:123", user, 3600);

// 缓存到指定时间点
Date expireTime = DateUtils.addHours(new Date(), 1);
userCache.set("user:123", user, expireTime);

// 缓存指定时间单位
userCache.set("user:123", user, 1, TimeUnit.HOURS);

// 4. 列表缓存
List<User> userList = Arrays.asList(user1, user2);
userCache.set("userList", userList, 3600);

List<User> cached = userCache.list("userList", User.class);

// 5. Map缓存
Map<Long, User> userMap = new HashMap<>();
userMap.put(1L, user1);
userMap.put(2L, user2);
userCache.set("userMap", userMap, 3600);

Map<Long, User> cachedMap = userCache.map("userMap", Long.class, User.class);

// 6. 获取并刷新过期时间
User user = userCache.get("user:123", 3600); // 获取并刷新1小时

// 7. Key管理
// 判断key是否存在
if (userCache.hasKey("user:123")) {
    // ...
}

// 删除缓存
userCache.remove("user:123", "user:456");

// 更新过期时间
userCache.expire("user:123", 7200);
```

---

## 三、缓存实现类

### 3.1 LocalRecruitCache - 本地缓存

**类路径**: `com.tencent.hr.recruit.center.framework.cache.impl.LocalRecruitCache`

**功能描述**: 基于本地内存的缓存实现

**特性**:
- 使用ConcurrentHashMap存储
- 进程内缓存，速度快
- 不支持分布式
- 适用于单机场景

---

### 3.2 RedisRecruitCache - Redis缓存

**类路径**: `com.tencent.hr.recruit.center.framework.cache.impl.RedisRecruitCache`

**功能描述**: 基于Redis的分布式缓存实现

**特性**:
- 支持分布式
- 数据持久化
- 支持过期时间
- 适用于多节点部署

---

### 3.3 MultiRecruitCache - 多级缓存

**类路径**: `com.tencent.hr.recruit.center.framework.cache.impl.MultiRecruitCache`

**功能描述**: 本地缓存+Redis缓存的两级缓存实现

**特性**:
- 先查本地缓存，未命中再查Redis
- 写入时同时更新本地和Redis
- 兼顾速度和分布式特性
- 适用于高并发场景

**缓存策略**:
```
读取: 本地缓存 -> Redis缓存 -> 数据源
写入: 数据源 -> 本地缓存 + Redis缓存
删除: 本地缓存 + Redis缓存
```

---

## 📚 相关文档

- [核心类索引](./core.md) - IRecruitRedisKey等核心接口
- [配置类索引](./configurations.md) - RecruitCacheConfiguration配置
- [注解索引](./annotations.md) - @RecruitCache注解
- [拦截器索引](./filters-interceptors.md) - RecruitCacheInterceptor

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 创建缓存接口文档 | v1.0 |

---
