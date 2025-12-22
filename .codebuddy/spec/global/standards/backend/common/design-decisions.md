# 数据库设计决策指南

**适用范围**: 所有基于 Spring Boot 3.x 的招聘相关微服务  
**文档版本**: 1.0  
**最后更新**: 2025-10-31

---

## 📋 概述

本指南说明了数据库设计中的关键决策，包括：
- 是否使用外键约束
- 是否进行分库分表
- 如何选择优化策略

---

## 🔑 决策 1: 外键约束

### 决策：不使用显式外键约束

**原因**：

1. **性能考虑**
   - 外键约束会增加数据库的检查开销
   - 在高并发场景下，外键检查会成为性能瓶颈
   - 删除操作需要检查所有关联表，性能很差

2. **灵活性考虑**
   - 外键约束限制了数据的修改和删除
   - 在微服务架构中，数据可能跨越多个数据库
   - 外键约束无法跨数据库工作

3. **开发效率考虑**
   - 外键约束会导致数据库操作变得复杂
   - 需要特殊处理级联删除、级联更新等
   - 增加了开发和测试的复杂度

### 替代方案：应用层保证数据一致性

**方案**：

```sql
-- 不使用外键约束
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID（关联 users 表）',
  order_no VARCHAR(32) NOT NULL,
  -- 不添加 FOREIGN KEY (user_id) REFERENCES users(id)
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**应用层实现**：

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 创建订单时，应用层检查用户是否存在
     */
    public Order createOrder(Long userId, OrderDTO dto) {
        // 1. 检查用户是否存在
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("用户不存在"));
        
        // 2. 检查用户是否启用
        if (user.getEnableFlag() == 0) {
            throw new UserDisabledException("用户已禁用");
        }
        
        // 3. 创建订单
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNo(dto.getOrderNo());
        return orderRepository.save(order);
    }
    
    /**
     * 删除用户时，应用层检查是否有关联订单
     */
    public void deleteUser(Long userId) {
        // 1. 检查是否有关联订单
        List<Order> orders = orderRepository.findByUserId(userId);
        if (!orders.isEmpty()) {
            throw new UserHasOrdersException("用户有关联订单，无法删除");
        }
        
        // 2. 删除用户
        userRepository.deleteById(userId);
    }
}
```

### 优势

- ✅ 性能更好（没有外键检查开销）
- ✅ 灵活性更高（可以跨数据库）
- ✅ 开发效率更高（逻辑清晰）
- ✅ 易于测试（可以独立测试）

### 劣势

- ❌ 需要应用层实现数据一致性检查
- ❌ 可能出现数据不一致（如果应用层逻辑有问题）

### 最佳实践

1. **在关联字段上建立索引**
   ```sql
   KEY `idx_user_id` (`user_id`)
   ```

2. **在应用层实现数据一致性检查**
   ```java
   // 创建前检查
   // 删除前检查
   // 更新前检查
   ```

3. **使用事务保证原子性**
   ```java
   @Transactional
   public void createOrder(Long userId, OrderDTO dto) {
       // 检查 + 创建 在同一个事务中
   }
   ```

4. **定期检查数据一致性**
   ```sql
   -- 查找孤立的订单（user_id 不存在）
   SELECT * FROM orders o
   WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = o.user_id);
   ```

---

## 📊 决策 2: 分库分表

### 决策：只在必要时进行分库分表

**原则**：分库分表是最后的优化手段，不是首选方案。

### 优化优先级

```
1. 索引优化 ← 首先尝试
2. 查询优化
3. 缓存策略
4. 读写分离
5. 分库分表 ← 最后才考虑
```

### 触发条件（必须满足以下条件之一，且有明确的业务需求）

#### 条件 1: 单表数据量 > 1000万

**评估方法**：

```sql
-- 查询表的行数
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'your_database';

-- 查询表的大小
SELECT TABLE_NAME, 
       ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'your_database'
ORDER BY size_mb DESC;
```

**判断标准**：
- 当前数据量 > 1000万 **且** 查询性能无法通过索引优化

#### 条件 2: 单库 QPS > 1000

**评估方法**：

```sql
-- 查询当前 QPS
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Uptime';
-- QPS = Questions / Uptime

-- 或使用监控工具（Prometheus、Grafana）
```

**判断标准**：
- 单库 QPS > 1000 **且** 无法通过读写分离解决

#### 条件 3: 单表文件大小 > 10GB

**评估方法**：

```sql
-- 查询表的大小
SELECT TABLE_NAME, 
       ROUND(((data_length + index_length) / 1024 / 1024 / 1024), 2) AS size_gb
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'your_database'
ORDER BY size_gb DESC;
```

**判断标准**：
- 单表文件大小 > 10GB **且** 存储空间是瓶颈

### 分库分表的成本

**开发成本**：
- 需要实现分片路由逻辑
- 需要处理跨库查询
- 需要处理分布式事务
- 需要处理数据迁移

**运维成本**：
- 需要监控多个数据库
- 需要处理数据一致性
- 需要处理扩容和缩容
- 需要处理故障恢复

**总成本**：通常增加 30-50% 的开发和运维工作量

### 分库分表的替代方案

#### 方案 1: 索引优化

**成本**：低  
**效果**：通常可以解决 80% 的性能问题

```sql
-- 为高频查询字段建立索引
KEY `idx_user_id` (`user_id`)
KEY `idx_status_create_time` (`status`, `create_time`)
```

#### 方案 2: 查询优化

**成本**：低  
**效果**：通常可以解决 10-15% 的性能问题

```sql
-- ❌ 不好的查询
SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE status = 1);

-- ✅ 好的查询
SELECT o.* FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE u.status = 1;
```

#### 方案 3: 缓存策略

**成本**：中等  
**效果**：通常可以解决 5-10% 的性能问题

```java
@Service
public class OrderService {
    
    @Autowired
    private RedisTemplate<String, Order> redisTemplate;
    
    public Order getOrder(Long orderId) {
        // 1. 先查缓存
        Order order = redisTemplate.opsForValue().get("order:" + orderId);
        if (order != null) {
            return order;
        }
        
        // 2. 再查数据库
        order = orderRepository.findById(orderId).orElse(null);
        
        // 3. 存入缓存
        if (order != null) {
            redisTemplate.opsForValue().set("order:" + orderId, order, Duration.ofHours(1));
        }
        
        return order;
    }
}
```

#### 方案 4: 读写分离

**成本**：中等  
**效果**：通常可以解决 20-30% 的性能问题

```
主库（写）← 应用层写操作
↓
从库（读）← 应用层读操作
```

**实现**：

```java
@Service
public class OrderService {
    
    @Autowired
    @Qualifier("masterDataSource")
    private DataSource masterDataSource;
    
    @Autowired
    @Qualifier("slaveDataSource")
    private DataSource slaveDataSource;
    
    /**
     * 写操作使用主库
     */
    @Transactional
    public Order createOrder(OrderDTO dto) {
        // 使用主库
        return orderRepository.save(new Order(dto));
    }
    
    /**
     * 读操作使用从库
     */
    public Order getOrder(Long orderId) {
        // 使用从库
        return orderRepository.findById(orderId).orElse(null);
    }
}
```

### 何时选择分库分表

**只有在以下情况下才考虑分库分表**：

1. 已经尝试了索引优化、查询优化、缓存、读写分离
2. 性能仍然无法满足业务需求
3. 有明确的业务需求（如：数据量持续增长）
4. 有足够的开发和运维资源

### 分库分表的实现方案

#### 方案 1: 水平分表（推荐）

**分片键**：user_id  
**分片数量**：16 张表  
**路由规则**：`table_index = user_id % 16`

```sql
-- 创建分表
CREATE TABLE orders_0 LIKE orders;
CREATE TABLE orders_1 LIKE orders;
...
CREATE TABLE orders_15 LIKE orders;
```

**应用层实现**：

```java
@Service
public class OrderService {
    
    /**
     * 根据 user_id 路由到对应的表
     */
    private String getTableName(Long userId) {
        int tableIndex = (int) (userId % 16);
        return "orders_" + tableIndex;
    }
    
    public Order createOrder(Long userId, OrderDTO dto) {
        String tableName = getTableName(userId);
        // 使用 tableName 执行 SQL
    }
}
```

#### 方案 2: 水平分库

**分片键**：user_id  
**分片数量**：4 个库  
**路由规则**：`db_index = user_id % 4`

```
db_0: orders_0, orders_1, orders_2, orders_3
db_1: orders_4, orders_5, orders_6, orders_7
db_2: orders_8, orders_9, orders_10, orders_11
db_3: orders_12, orders_13, orders_14, orders_15
```

#### 方案 3: 垂直分表

**按字段拆分**：常用字段和不常用字段分开

```sql
-- 常用字段表
CREATE TABLE orders_main (
  id BIGINT UNSIGNED PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  order_no VARCHAR(32),
  status TINYINT,
  create_time DATETIME
);

-- 不常用字段表
CREATE TABLE orders_detail (
  id BIGINT UNSIGNED PRIMARY KEY,
  order_id BIGINT UNSIGNED,
  description TEXT,
  remark TEXT
);
```

### 分库分表的风险

**风险 1: 跨库查询困难**

```sql
-- ❌ 无法直接查询
SELECT * FROM orders WHERE order_no = 'ORD-001';

-- ✅ 需要查询所有分片
SELECT * FROM orders_0 WHERE order_no = 'ORD-001'
UNION
SELECT * FROM orders_1 WHERE order_no = 'ORD-001'
...
```

**解决方案**：建立映射表

```sql
CREATE TABLE order_no_mapping (
  order_no VARCHAR(32) PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  KEY `idx_user_id` (`user_id`)
);
```

**风险 2: 分布式事务**

```java
// ❌ 跨库事务很复杂
@Transactional
public void transferOrder(Long fromUserId, Long toUserId, Long orderId) {
    // 需要处理分布式事务
    // 可能导致数据不一致
}
```

**解决方案**：使用最终一致性

```java
@Service
public class OrderService {
    
    /**
     * 使用最终一致性替代分布式事务
     */
    public void transferOrder(Long fromUserId, Long toUserId, Long orderId) {
        // 1. 在源库中标记为转移中
        updateOrderStatus(fromUserId, orderId, "TRANSFERRING");
        
        // 2. 在目标库中创建新订单
        createOrder(toUserId, orderId);
        
        // 3. 在源库中删除订单
        deleteOrder(fromUserId, orderId);
        
        // 4. 如果失败，通过定时任务重试
    }
}
```

---

## 📋 决策检查清单

在进行数据库设计时，使用此清单确保做出正确的决策：

### 外键约束决策

- [ ] 是否需要使用外键约束？
  - [ ] 是：需要数据库级别的强制一致性
  - [ ] 否：由应用层保证数据一致性（推荐）
- [ ] 如果不使用外键约束，是否在应用层实现了检查？
- [ ] 是否为关联字段建立了索引？
- [ ] 是否定期检查数据一致性？

### 分库分表决策

- [ ] 当前数据量是否 > 1000万？
- [ ] 当前 QPS 是否 > 1000？
- [ ] 当前表大小是否 > 10GB？
- [ ] 是否已经尝试了索引优化？
- [ ] 是否已经尝试了查询优化？
- [ ] 是否已经尝试了缓存策略？
- [ ] 是否已经尝试了读写分离？
- [ ] 是否有足够的开发和运维资源？
- [ ] 是否有明确的业务需求？

---

## 📚 参考资源

- [数据库设计规范](./database.md)
- [索引设计指南](./index-design-guide.md)
- [数据库设计 Skill](../../skills/design/design-database/SKILL.md)
- 《高性能 MySQL》- Baron Schwartz
- 《分布式系统设计》- Martin Kleppmann

---

**文档版本**: v1.0  
**最后更新**: 2025-10-31  
**维护者**: 架构团队
