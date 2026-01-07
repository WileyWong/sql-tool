# 权限控制检测规则

## 规则概述

| 规则ID | 规则名称 | 风险等级 |
|--------|---------|---------|
| AUTH-001 | 缺少权限注解 | 🟠 高危 |
| AUTH-002 | 垂直越权风险 | 🟠 高危 |
| AUTH-003 | 水平越权风险 | 🟠 高危 |

---

## AUTH-001: 缺少权限注解

### 检测模式

```regex
@(Post|Put|Delete|Patch)Mapping\("/api/admin/.*"\)
public\s+\w+\s+\w+\(.*\)\s*\{
# 上述接口缺少 @PreAuthorize 或 @Secured 注解
```

### 危险代码示例

```java
// ❌ 危险: 管理接口缺少权限注解
@PostMapping("/api/admin/users")
public Result deleteUser(@PathVariable Long id) {
    userService.deleteById(id);
    return Result.success();
}

// ❌ 危险: 敏感操作缺少权限控制
@PostMapping("/api/config/update")
public Result updateConfig(@RequestBody ConfigDTO dto) {
    configService.update(dto);
    return Result.success();
}

// ❌ 危险: 批量操作缺少权限控制
@DeleteMapping("/api/users/batch")
public Result batchDelete(@RequestBody List<Long> ids) {
    userService.deleteByIds(ids);
    return Result.success();
}
```

### 安全代码示例

```java
// ✅ 安全: 使用 @PreAuthorize
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/api/admin/users")
public Result deleteUser(@PathVariable Long id) {
    userService.deleteById(id);
    return Result.success();
}

// ✅ 安全: 使用 @Secured
@Secured("ROLE_ADMIN")
@PostMapping("/api/config/update")
public Result updateConfig(@RequestBody ConfigDTO dto) {
    configService.update(dto);
    return Result.success();
}

// ✅ 安全: 使用 SpEL 表达式
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@DeleteMapping("/api/users/batch")
public Result batchDelete(@RequestBody List<Long> ids) {
    userService.deleteByIds(ids);
    return Result.success();
}

// ✅ 安全: 方法级权限控制
@PreAuthorize("hasPermission(#id, 'User', 'delete')")
public void deleteUser(Long id) {
    userRepository.deleteById(id);
}
```

### 需要权限控制的接口模式

| 路径模式 | 建议权限 |
|---------|---------|
| `/api/admin/**` | `ROLE_ADMIN` |
| `/api/config/**` | `ROLE_ADMIN` |
| `/api/*/delete` | 业务权限 |
| `/api/*/batch*` | 业务权限 |
| `/api/*/export` | 数据导出权限 |

---

## AUTH-002: 垂直越权风险

### 检测模式

```regex
# 检测直接操作资源，未验证权限
\.updateById\(
\.deleteById\(
\.save\(
# 缺少权限检查
```

### 危险代码示例

```java
// ❌ 危险: 未检查操作权限
@PutMapping("/api/orders/{id}")
public Result updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
    // 未检查当前用户是否有权限修改此订单
    orderService.updateById(id, dto);
    return Result.success();
}

// ❌ 危险: 未验证角色
@PostMapping("/api/users/{id}/role")
public Result updateRole(@PathVariable Long id, @RequestBody RoleDTO dto) {
    // 普通用户可能修改自己为管理员
    userService.updateRole(id, dto.getRoleId());
    return Result.success();
}
```

### 安全代码示例

```java
// ✅ 安全: 检查操作权限
@PutMapping("/api/orders/{id}")
@PreAuthorize("hasPermission(#id, 'Order', 'update')")
public Result updateOrder(@PathVariable Long id, @RequestBody OrderDTO dto) {
    orderService.updateById(id, dto);
    return Result.success();
}

// ✅ 安全: 验证角色修改权限
@PostMapping("/api/users/{id}/role")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public Result updateRole(@PathVariable Long id, @RequestBody RoleDTO dto) {
    // 只有超级管理员可以修改角色
    userService.updateRole(id, dto.getRoleId());
    return Result.success();
}

// ✅ 安全: 自定义权限检查器
@Component
public class OrderPermissionChecker {
    public boolean canUpdate(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) return false;
        return order.getUserId().equals(userId) || isAdmin(userId);
    }
}
```

---

## AUTH-003: 水平越权风险

### 检测模式

```regex
# 检测直接使用用户传入的 ID 查询/操作
\.findById\(.*id\)
\.getById\(.*id\)
# 未验证资源所有权
```

### 危险代码示例

```java
// ❌ 危险: 未验证资源所有权
@GetMapping("/api/orders/{id}")
public Result getOrder(@PathVariable Long id) {
    // 用户 A 可以查看用户 B 的订单
    Order order = orderService.getById(id);
    return Result.success(order);
}

// ❌ 危险: 未验证用户 ID
@GetMapping("/api/users/{userId}/profile")
public Result getProfile(@PathVariable Long userId) {
    // 用户可以查看任意用户的资料
    return Result.success(userService.getById(userId));
}

// ❌ 危险: 批量操作未验证所有权
@DeleteMapping("/api/orders/batch")
public Result batchDelete(@RequestBody List<Long> ids) {
    // 未验证这些订单是否属于当前用户
    orderService.deleteByIds(ids);
    return Result.success();
}
```

### 安全代码示例

```java
// ✅ 安全: 验证资源所有权
@GetMapping("/api/orders/{id}")
public Result getOrder(@PathVariable Long id) {
    Long currentUserId = SecurityUtils.getCurrentUserId();
    Order order = orderService.getById(id);
    
    if (!order.getUserId().equals(currentUserId)) {
        throw new ForbiddenException("无权访问此订单");
    }
    
    return Result.success(order);
}

// ✅ 安全: 使用当前用户 ID
@GetMapping("/api/profile")
public Result getProfile() {
    Long currentUserId = SecurityUtils.getCurrentUserId();
    return Result.success(userService.getById(currentUserId));
}

// ✅ 安全: 查询时过滤用户
@GetMapping("/api/orders")
public Result getOrders() {
    Long currentUserId = SecurityUtils.getCurrentUserId();
    List<Order> orders = orderService.findByUserId(currentUserId);
    return Result.success(orders);
}

// ✅ 安全: 批量操作验证所有权
@DeleteMapping("/api/orders/batch")
public Result batchDelete(@RequestBody List<Long> ids) {
    Long currentUserId = SecurityUtils.getCurrentUserId();
    
    // 验证所有订单都属于当前用户
    List<Order> orders = orderService.findByIds(ids);
    boolean allOwned = orders.stream()
        .allMatch(o -> o.getUserId().equals(currentUserId));
    
    if (!allOwned) {
        throw new ForbiddenException("包含无权操作的订单");
    }
    
    orderService.deleteByIds(ids);
    return Result.success();
}

// ✅ 安全: 使用 SpEL 表达式
@PreAuthorize("@orderService.isOwner(#id, authentication.principal.id)")
@GetMapping("/api/orders/{id}")
public Result getOrder(@PathVariable Long id) {
    return Result.success(orderService.getById(id));
}
```

---

## 权限检查最佳实践

### 1. 统一权限拦截器

```java
@Component
public class OwnershipInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        // 统一检查资源所有权
        String resourceId = extractResourceId(request);
        String resourceType = extractResourceType(request);
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        if (!permissionService.canAccess(resourceType, resourceId, currentUserId)) {
            throw new ForbiddenException("无权访问此资源");
        }
        
        return true;
    }
}
```

### 2. 数据范围过滤

```java
// MyBatis-Plus 数据权限插件
@Component
public class DataScopeInterceptor implements InnerInterceptor {
    
    @Override
    public void beforeQuery(Executor executor, MappedStatement ms, 
                           Object parameter, RowBounds rowBounds, 
                           ResultHandler resultHandler, BoundSql boundSql) {
        // 自动添加用户 ID 过滤条件
        Long userId = SecurityUtils.getCurrentUserId();
        // 修改 SQL 添加 WHERE user_id = ?
    }
}
```

---

## 参考资料

- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [CWE-285: Improper Authorization](https://cwe.mitre.org/data/definitions/285.html)
- [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)

---

**版本**: 1.0.0  
**更新时间**: 2025-12-22
