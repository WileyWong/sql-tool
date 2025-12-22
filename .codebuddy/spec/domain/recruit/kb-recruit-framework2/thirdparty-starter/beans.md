# Bean对象索引文档

> **文档说明**: 本文档为 `RecruitCenterThirdPartyStarter` 项目Bean对象的完整索引  
> **生成时间**: 2025-11-21  
> **覆盖范围**: `hrright.bean`  
> **文件总数**: 2个

---

## 📑 目录

- [一、Bean对象概览](#一bean对象概览)
- [二、详细清单](#二详细清单)
- [三、最佳实践建议](#三最佳实践建议)

---

## 一、Bean对象概览

### 1.1 目录结构

```
hrright/bean/
├── DataScopeBean.java       # 数据范围Bean
└── StaffRightBean.java      # 员工权限Bean
```

### 1.2 功能分类

| Bean类 | 用途 | 主要场景 |
|--------|------|----------|
| DataScopeBean | 数据权限范围 | 权限过滤、数据范围控制 |
| StaffRightBean | 员工权限信息 | 权限缓存、操作权限判断 |

---

## 二、详细清单

### 2.1 DataScopeBean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.bean.DataScopeBean`
- **注解**: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Accessors(chain = true)`
- **实现**: `Serializable`
- **用途**: 封装数据权限范围信息

**字段列表** (2个):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `allows` | `boolean` | 判断scopes数据是拥有的权限，还是排除的权限 |
| `scopes` | `Set<String>` | 权限范围集合 |

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|\n| `hasAll()` | `boolean` | 判断是否拥有全部权限 (`!allows && scopes为空`) |
| `hasEmpty()` | `boolean` | 判断是否无权限 (`allows && scopes为空`) |

**技术特点**:
```java
@Data
@Accessors(chain = true)
public class DataScopeBean implements Serializable {
    private boolean allows;
    private Set<String> scopes;
    
    // 全部权限判断
    public boolean hasAll() {
        return !allows && CollectionUtils.isEmpty(scopes);
    }
    
    // 无权限判断
    public boolean hasEmpty() {
        return allows && CollectionUtils.isEmpty(scopes);
    }
}
```

**应用场景**:
- 数据权限过滤
- 权限范围判断
- 多权限合并处理

---

### 2.2 StaffRightBean

**基本信息**:
- **类路径**: `com.tencent.hr.recruit.center.framework.third.hrright.bean.StaffRightBean`
- **注解**: `@Data`, `@Accessors(chain = true)`
- **实现**: `Serializable`
- **序列化版本号**: `8781726747381110641L`
- **用途**: 封装员工权限信息

**字段列表** (3个):

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `roleCode` | `Set<String>` | 角色代码集合（默认HashSet） |
| `operateCode` | `Set<String>` | 操作权限代码集合（默认HashSet） |
| `context` | `Object` | 上下文信息（如当前用户信息） |

**公共方法** (2个):

| 方法签名 | 返回类型 | 功能说明 |
|---------|---------|---------|\n| `recruitRole()` | `RecruitRole` | 获取招聘角色枚举 |
| `set(AuthModel model)` | `void` | 设置权限模型信息（添加角色和操作权限） |

**技术特点**:
```java
@Data
@Accessors(chain = true)
public class StaffRightBean implements Serializable {
    private Set<String> roleCode = Sets.newHashSet();
    private Set<String> operateCode = Sets.newHashSet();
    private Object context;
    
    // 获取招聘角色
    public RecruitRole recruitRole() {
        return RecruitRole.get(roleCode);
    }
    
    // 设置权限信息
    public void set(AuthModel model) {
        roleCode.add(model.getRolecode());
        operateCode.addAll(model.getOperateCodes());
    }
}
```

**应用场景**:
- 权限缓存存储
- 权限信息传递
- 操作权限校验
- 角色权限判断

---

## 三、最佳实践建议

### 3.1 Bean使用规范

#### ✅ 推荐做法

```java
// 1. 使用链式调用
DataScopeBean scope = new DataScopeBean()
    .setAllows(true)
    .setScopes(Sets.newHashSet("dept1", "dept2"));

// 2. 权限判断
if (scope.hasAll()) {
    // 拥有全部权限
} else if (scope.hasEmpty()) {
    // 无权限
}

// 3. 员工权限缓存
StaffRightBean right = new StaffRightBean();
right.set(authModel);
redisCache.set(key, right);

// 4. 角色判断
RecruitRole role = right.recruitRole();
if (role == RecruitRole.Recruit_HRInterviewMan) {
    // 面试官权限
}
```

#### ❌ 不推荐做法

```java
// 1. 不要直接修改集合
bean.getRoleCode().clear(); // ❌ 应该通过set方法

// 2. 不要忽略null检查
if (bean.getScopes().isEmpty()) { } // ❌ scopes可能为null

// 3. 不要混淆allows和scopes的关系
DataScopeBean bean = new DataScopeBean();
bean.setAllows(true);
bean.setScopes(null);
// hasAll()返回false, hasEmpty()返回true ✓
```

### 3.2 常见问题

**Q1: DataScopeBean的allows字段如何理解？**
- `allows=true`: scopes是允许的权限范围（白名单）
- `allows=false`: scopes是排除的权限范围（黑名单）
- `allows=false && scopes为空`: 拥有全部权限
- `allows=true && scopes为空`: 无权限

**Q2: StaffRightBean如何使用？**
```java
// 从缓存获取
StaffRightBean right = StaffRightUtils.get(staffId);

// 检查操作权限
boolean has = right.getOperateCode().contains("CANDIDATE_VIEW");

// 检查角色
RecruitRole role = right.recruitRole();
```

---

## 📚 相关文档

- [工具类索引](./utils.md) - DataScopeUtils、StaffRightUtils
- [枚举类索引](./enums.md) - RecruitRole、DataScopeCode、OperateCode
- [组件索引](./components.md) - RecruitRightHandler
- [配置类索引](./configurations.md) - RecruitRightConfiguration
- [Service服务索引](./services.md) - 权限服务

---

## 📝 维护记录

| 时间 | 维护人 | 维护内容 | 版本 |
|------|--------|----------|------|
| 2025-11-21 | AI Assistant | 完善Bean对象字段和方法说明 | v1.1 |
| 2025-11-21 | AI Assistant | 初始创建Bean对象索引文档 | v1.0 |

---
