# Java 命名规范

> 继承自 [通用命名规范](../common/naming.md)，本文档补充 Java 特有规则

## 类命名

### 类名规则

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 普通类 | 大驼峰，名词 | `UserService`, `OrderManager` |
| 接口 | 大驼峰，形容词/名词 | `Serializable`, `UserRepository` |
| 抽象类 | `Abstract` 前缀 | `AbstractController`, `AbstractService` |
| 异常类 | `Exception` 后缀 | `BusinessException`, `ValidationException` |
| 工具类 | `Utils`/`Helper` 后缀 | `StringUtils`, `DateHelper` |
| 枚举类 | 大驼峰，名词 | `OrderStatus`, `UserType` |
| 测试类 | `Test` 后缀 | `UserServiceTest` |

### 分层类命名

| 层次 | 后缀 | 示例 |
|------|------|------|
| Controller | `Controller` | `UserController` |
| Service 接口 | `Service` | `UserService` |
| Service 实现 | `ServiceImpl` | `UserServiceImpl` |
| Mapper/DAO | `Mapper`/`Dao` | `UserMapper` |
| Entity | 无后缀 | `User`, `Order` |
| DTO | `DTO`/`Request`/`Response` | `UserDTO`, `CreateUserRequest` |
| VO | `VO` | `UserVO` |
| BO | `BO` | `UserBO` |

## 方法命名

### 通用规则

```java
// ✅ 动词开头，小驼峰
public User findById(Long id);
public void createUser(User user);
public boolean isValid();

// ❌ 错误示例
public User user(Long id);      // 缺少动词
public void Create_User();      // 大写开头，下划线
```

### 常用动词前缀

| 前缀 | 含义 | 示例 |
|------|------|------|
| `get` | 获取属性值 | `getName()`, `getId()` |
| `set` | 设置属性值 | `setName()`, `setId()` |
| `find` | 查询（可能返回 null/Optional） | `findById()`, `findByName()` |
| `query` | 复杂查询/列表查询 | `queryByCondition()` |
| `list` | 获取列表 | `listAll()`, `listByStatus()` |
| `create` | 创建 | `createUser()`, `createOrder()` |
| `add` | 添加到集合 | `addItem()`, `addRole()` |
| `save` | 保存（新增或更新） | `saveUser()` |
| `update` | 更新 | `updateStatus()`, `updateUser()` |
| `delete` | 删除 | `deleteById()`, `deleteUser()` |
| `remove` | 从集合移除 | `removeItem()`, `removeRole()` |
| `is/has/can` | 布尔判断 | `isValid()`, `hasPermission()`, `canAccess()` |
| `check` | 检查（可能抛异常） | `checkPermission()` |
| `validate` | 验证 | `validateInput()` |
| `convert` | 转换 | `convertToDTO()` |
| `build` | 构建 | `buildQuery()` |
| `init` | 初始化 | `initCache()` |

## 变量命名

### 局部变量

```java
// ✅ 小驼峰，有意义的名称
User currentUser = userService.findById(id);
List<Order> pendingOrders = orderService.listByStatus(PENDING);
int totalCount = list.size();

// ❌ 错误示例
User u = userService.findById(id);  // 过于简短
List<Order> list1 = ...;            // 无意义
int Total_Count = ...;              // 格式错误
```

### 常量命名

```java
// ✅ 全大写，下划线分隔
public static final int MAX_RETRY_COUNT = 3;
public static final String DEFAULT_CHARSET = "UTF-8";
public static final long CACHE_EXPIRE_TIME = 3600L;

// ❌ 错误示例
public static final int maxRetryCount = 3;  // 应全大写
public static final String DEFAULTCHARSET = "UTF-8";  // 缺少下划线
```

### 集合变量

```java
// ✅ 复数形式或集合类型后缀
List<User> users;
Set<String> roleNames;
Map<Long, User> userMap;
Map<String, Object> userIdToUserMap;

// ❌ 错误示例
List<User> userList;  // 冗余的 List 后缀（可接受但不推荐）
List<User> user;      // 单数形式
```

## 包命名

### 规则

```
com.company.project.module.layer
```

### 示例

```
com.example.shop.user.controller    # 用户模块控制器
com.example.shop.user.service       # 用户模块服务
com.example.shop.user.service.impl  # 服务实现
com.example.shop.user.mapper        # 数据访问
com.example.shop.user.entity        # 实体类
com.example.shop.user.dto           # 数据传输对象
com.example.shop.common.exception   # 公共异常
com.example.shop.common.util        # 公共工具
com.example.shop.config             # 配置类
```

## 枚举命名

```java
// ✅ 枚举类：大驼峰
// ✅ 枚举值：全大写下划线
public enum OrderStatus {
    PENDING_PAYMENT("待支付"),
    PAID("已支付"),
    SHIPPED("已发货"),
    COMPLETED("已完成"),
    CANCELLED("已取消");
    
    private final String description;
    
    OrderStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
```

## 泛型命名

| 符号 | 含义 | 示例 |
|------|------|------|
| `T` | Type，通用类型 | `List<T>` |
| `E` | Element，集合元素 | `Collection<E>` |
| `K` | Key，键 | `Map<K, V>` |
| `V` | Value，值 | `Map<K, V>` |
| `N` | Number，数字 | `Comparable<N>` |
| `R` | Result，返回值 | `Function<T, R>` |

```java
// ✅ 正确示例
public interface Repository<T, ID> {
    T findById(ID id);
    List<T> findAll();
}

public class Result<T> {
    private T data;
    private String message;
}
```

## 特殊场景

### Boolean 变量

```java
// ✅ is/has/can/should 前缀
private boolean isActive;
private boolean hasPermission;
private boolean canEdit;
private boolean shouldNotify;

// Getter 方法
public boolean isActive() { return isActive; }
public boolean hasPermission() { return hasPermission; }

// ❌ 错误示例
private boolean active;        // 缺少前缀（可接受但不推荐）
private boolean isIsActive;    // 重复
```

### 回调/监听器

```java
// ✅ on + 事件名
public interface OrderListener {
    void onOrderCreated(Order order);
    void onOrderPaid(Order order);
    void onOrderCancelled(Order order);
}
```

## 检查清单

- [ ] 类名使用大驼峰，准确描述职责
- [ ] 方法名使用小驼峰，动词开头
- [ ] 变量名有意义，避免单字母（循环变量除外）
- [ ] 常量全大写，下划线分隔
- [ ] 包名全小写，按模块分层组织
- [ ] 布尔变量使用 is/has/can 前缀
- [ ] 集合变量使用复数形式

## 参考

- [通用命名规范](../common/naming.md)
- [阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c)
