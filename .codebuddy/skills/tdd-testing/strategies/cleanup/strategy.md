# 清理策略

## 概述

本策略负责在集成测试/接口测试执行完成后，清理测试过程中产生的数据，确保测试环境的干净状态。

**注意**: 单元测试（使用 Mock）不需要执行此步骤。

## 适用场景

```yaml
需要清理:
  - 集成测试（真实数据库操作）
  - 接口测试（API 端到端测试）
  - 端到端测试（E2E）

不需要清理:
  - 单元测试（Mock 隔离）
  - 使用内存数据库的测试（H2）
  - 使用 @Transactional 自动回滚的测试
```

## 清理策略类型

### 1. 事务回滚清理（推荐）

```java
@SpringBootTest
@Transactional
public class UserApiTest {
    // 测试方法执行后自动回滚
    @Test
    void testCreateUser() {
        // 测试代码
    }
}
```

**优点**: 自动清理，无需手动编写清理代码
**限制**: 仅适用于单数据源、无跨服务调用的场景

### 2. 显式删除清理

```java
@AfterEach
void cleanup() {
    // 按依赖关系逆序删除
    orderItemRepository.deleteByOrderIdIn(testOrderIds);
    orderRepository.deleteByIdIn(testOrderIds);
    userRepository.deleteByIdIn(testUserIds);
}

@AfterAll
static void cleanupAll() {
    // 清理测试数据标记的所有数据
    jdbcTemplate.execute("DELETE FROM orders WHERE test_flag = true");
    jdbcTemplate.execute("DELETE FROM users WHERE email LIKE 'test_%@example.com'");
}
```

### 3. 数据标记清理

```yaml
# 测试数据标记规范
data_marking:
  方式1_特殊前缀:
    email: "test_*@example.com"
    name: "TEST_*"
    code: "TEST-*"
  
  方式2_标记字段:
    test_flag: true
    created_by: "API_TEST"
  
  方式3_时间范围:
    created_at: "> 测试开始时间"
```

### 4. 数据库快照恢复

```bash
# 测试前创建快照
mysqldump -u root -p testdb > snapshot_before_test.sql

# 测试后恢复
mysql -u root -p testdb < snapshot_before_test.sql
```

## 清理顺序

```yaml
# 按外键依赖关系逆序清理
cleanup_order:
  1. 子表数据（order_items, user_roles）
  2. 关联表数据（orders, permissions）
  3. 主表数据（users, products）
  4. 基础数据（categories, departments）

# 示例：用户订单系统
example_order:
  1. order_items      # 订单明细
  2. order_payments   # 支付记录
  3. orders           # 订单主表
  4. shopping_carts   # 购物车
  5. user_addresses   # 用户地址
  6. users            # 用户表
```

## 清理代码模板

### Java + Spring Boot

```java
@Component
public class TestDataCleaner {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final List<Long> createdUserIds = new ArrayList<>();
    private final List<Long> createdOrderIds = new ArrayList<>();
    
    /**
     * 记录创建的测试数据ID
     */
    public void recordCreatedUser(Long userId) {
        createdUserIds.add(userId);
    }
    
    public void recordCreatedOrder(Long orderId) {
        createdOrderIds.add(orderId);
    }
    
    /**
     * 清理所有记录的测试数据
     */
    public void cleanupAll() {
        // 按依赖顺序清理
        cleanupOrderItems();
        cleanupOrders();
        cleanupUsers();
        
        // 清空记录
        createdUserIds.clear();
        createdOrderIds.clear();
    }
    
    private void cleanupOrderItems() {
        if (!createdOrderIds.isEmpty()) {
            String ids = createdOrderIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
            jdbcTemplate.execute(
                "DELETE FROM order_items WHERE order_id IN (" + ids + ")"
            );
        }
    }
    
    private void cleanupOrders() {
        if (!createdOrderIds.isEmpty()) {
            String ids = createdOrderIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
            jdbcTemplate.execute(
                "DELETE FROM orders WHERE id IN (" + ids + ")"
            );
        }
    }
    
    private void cleanupUsers() {
        if (!createdUserIds.isEmpty()) {
            String ids = createdUserIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
            jdbcTemplate.execute(
                "DELETE FROM users WHERE id IN (" + ids + ")"
            );
        }
    }
    
    /**
     * 按标记清理（备用方案）
     */
    public void cleanupByMarker(String marker) {
        jdbcTemplate.execute(
            "DELETE FROM order_items WHERE order_id IN " +
            "(SELECT id FROM orders WHERE test_marker = '" + marker + "')"
        );
        jdbcTemplate.execute(
            "DELETE FROM orders WHERE test_marker = '" + marker + "'"
        );
        jdbcTemplate.execute(
            "DELETE FROM users WHERE test_marker = '" + marker + "'"
        );
    }
}
```

### 测试基类集成

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseApiTest {
    
    @Autowired
    protected TestDataCleaner testDataCleaner;
    
    @Autowired
    protected TestRestTemplate restTemplate;
    
    @AfterEach
    void cleanup() {
        testDataCleaner.cleanupAll();
    }
    
    /**
     * 创建测试用户并记录
     */
    protected UserDTO createTestUser(CreateUserRequest request) {
        ResponseEntity<UserDTO> response = restTemplate.postForEntity(
            "/api/users", request, UserDTO.class
        );
        UserDTO user = response.getBody();
        testDataCleaner.recordCreatedUser(user.getId());
        return user;
    }
    
    /**
     * 创建测试订单并记录
     */
    protected OrderDTO createTestOrder(CreateOrderRequest request) {
        ResponseEntity<OrderDTO> response = restTemplate.postForEntity(
            "/api/orders", request, OrderDTO.class
        );
        OrderDTO order = response.getBody();
        testDataCleaner.recordCreatedOrder(order.getId());
        return order;
    }
}
```

## 清理验证

```yaml
cleanup_verification:
  验证项:
    - 确认测试数据已删除
    - 检查关联数据完整性
    - 验证无孤立数据
  
  验证方法:
    - 查询删除的ID确认不存在
    - 检查外键关联表
    - 运行数据一致性检查
```

```java
@Test
void verifyCleanup() {
    // 执行清理
    testDataCleaner.cleanupAll();
    
    // 验证数据已删除
    for (Long userId : previouslyCreatedUserIds) {
        assertThat(userRepository.findById(userId)).isEmpty();
    }
    
    // 验证无孤立数据
    Long orphanCount = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM order_items oi " +
        "LEFT JOIN orders o ON oi.order_id = o.id " +
        "WHERE o.id IS NULL",
        Long.class
    );
    assertThat(orphanCount).isZero();
}
```

## 异常处理

```yaml
cleanup_error_handling:
  外键约束失败:
    原因: 清理顺序错误
    处理: 检查并调整清理顺序
  
  数据不存在:
    原因: 已被其他测试清理或测试失败未创建
    处理: 忽略，继续清理其他数据
  
  连接超时:
    原因: 数据库连接问题
    处理: 重试或记录日志后跳过
```

```java
public void safeCleanup() {
    try {
        cleanupAll();
    } catch (DataAccessException e) {
        log.warn("Cleanup failed, attempting force cleanup: {}", e.getMessage());
        forceCleanupByMarker();
    }
}

private void forceCleanupByMarker() {
    // 使用 ON DELETE CASCADE 或禁用外键检查
    jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
    try {
        jdbcTemplate.execute("DELETE FROM users WHERE email LIKE 'test_%'");
        jdbcTemplate.execute("DELETE FROM orders WHERE test_flag = true");
    } finally {
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
    }
}
```

## 与其他步骤的衔接

### 输入

- 来自 `run-test` 步骤的测试执行结果
- 测试过程中记录的数据ID

### 输出

- 清理完成确认
- 清理日志

### 流程结束

清理完成后，整个测试流程结束。
