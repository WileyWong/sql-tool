---
name: techdesign-04-entity
description: 基于领域驱动设计（DDD）进行实体建模和领域设计 - 从业务概念到技术实现的结构化方法
category: techdesign
keywords: [实体设计, 领域模型, 对象关系映射, DDD, 值对象]
---

# Skill: 业务实体设计（Entity Design）

## 工作流位置

```
techdesign-01 架构设计
    ↓ 输出：架构方案、技术选型
techdesign-02 流程设计（可选）
    ↓ 输出：流程图、状态机
techdesign-03 功能设计
    ↓ 输出：功能规格、用例设计
techdesign-04 实体设计 ← 当前技能
    ↓ 输出：实体模型、领域模型、聚合根、值对象
techdesign-05 数据库设计 ─┬─ 可并行
techdesign-06 API设计    ─┘
    ↓ 输出：DDL、API文档
techdesign-07 交付规划（可选）
```

**上游输入**: 03-feature 功能规格、01-architecture 架构方案
**下游使用**: 05-database、06-api 将使用本技能输出的实体模型
**路径选择**: 参见 [techdesign-01-architecture 路径选择指南](mdc:skills/techdesign-01-architecture/SKILL.md)

> ⚠️ **必读**: [通用规范](mdc:.codebuddy/spec/global/standards/common/index.md) - 项目记忆引用和所有规范要求

## 核心原则（15秒速查）

1. **模型选择** - 根据业务复杂度选择贫血模型或充血模型
2. **ID 引用** - 跨聚合用 ID，聚合内用对象引用
3. **不可变值对象** - 无 setter，整体替换
4. **小聚合** - 一个事务修改一个聚合
5. **不变量保护** - 不能创建无效对象
6. **限界上下文** - 明确领域边界，避免概念混淆

## 技能信息

### 文档输出
- 遵循 [文档生成原则](mdc:.codebuddy/spec/global/standards/common/document-generation-rules.md)
- 输出路径: `workspace/{变更ID}/design/entity-design.md`
- 使用模板: `spec/global/templates/design/entity-design-template.md`
- 只在用户明确要求时生成文档

---

## 使用场景

### 何时使用
- 需求中出现大量业务名词（用户、订单、商品）
- 需要设计复杂业务规则和状态转换
- 新项目启动或现有系统重构

### 何时不用
- 简单 CRUD 无复杂业务逻辑 → 直接数据库设计
- 纯技术组件（缓存、队列、日志） → 架构设计
- 数据报表和统计分析 → 数据仓库设计

### 前置条件
- 已完成需求分析
- 了解 DDD 核心概念（实体、值对象、聚合根）
- 熟悉技术栈：Spring Boot 3、MyBatis-Plus、MySQL 8、Java 17
- 参考：[Spring Boot 3](mdc:.codebuddy/spec/global/knowledge/stack/springboot3.md)、[MyBatis-Plus](mdc:.codebuddy/spec/global/knowledge/stack/mybatis_plus.md)、[MySQL](mdc:.codebuddy/spec/global/knowledge/stack/mysql.md)

---

## 模型选择：贫血模型 vs 充血模型

**首先确定使用哪种模型**，这是实体设计的关键决策。

### 模型对比

| 维度 | 贫血模型 | 充血模型 |
|------|---------|---------|
| **业务逻辑位置** | Service 层 | 实体内部 |
| **实体职责** | 纯数据载体（DTO） | 数据 + 行为 |
| **学习成本** | 低 | 中高 |
| **适用场景** | 简单 CRUD、快速开发 | 复杂业务规则、领域驱动 |
| **团队要求** | 初级团队可用 | 需要 DDD 经验 |
| **代码组织** | 传统三层架构 | 领域模型 + 应用服务 |
| **测试难度** | Service 层测试 | 实体单元测试更容易 |

### 选择决策树

```
开始
 │
 ├─ 业务逻辑复杂度？
 │   ├─ 简单（CRUD为主，少量业务规则）→ 贫血模型
 │   └─ 复杂（多状态、多规则、领域知识丰富）→ 继续判断
 │
 ├─ 团队 DDD 经验？
 │   ├─ 缺乏经验 → 贫血模型（降低学习成本）
 │   └─ 有经验 → 继续判断
 │
 ├─ 项目周期？
 │   ├─ 紧急（< 1个月）→ 贫血模型（快速交付）
 │   └─ 正常/长期 → 充血模型（长期可维护）
 │
 └─ 业务变更频率？
     ├─ 稳定 → 贫血模型
     └─ 频繁变更 → 充血模型（业务逻辑内聚）
```

### 贫血模型示例

```java
// 实体：纯数据载体
@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// Service：包含所有业务逻辑
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        // 业务规则在 Service 中
        if (order.getStatus() != OrderStatus.PENDING 
            && order.getStatus() != OrderStatus.PAID) {
            throw new OrderException("订单状态不允许取消");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        order.setUpdatedAt(LocalDateTime.now());
        
        orderRepository.save(order);
        
        // 释放库存
        inventoryService.releaseStock(order.getItems());
    }
}
```

**贫血模型优点**:
- 简单直观，学习成本低
- 与传统三层架构一致
- 适合快速开发和简单业务

**贫血模型缺点**:
- 业务逻辑分散在 Service 层
- 实体缺乏封装，容易被误用
- 复杂业务时 Service 会膨胀

### 充血模型示例

```java
// 实体：数据 + 行为
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String cancelReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    // 工厂方法
    public static Order create(Long userId, List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("订单必须包含商品");
        }
        Order order = new Order();
        order.userId = userId;
        order.items = new ArrayList<>(items);
        order.status = OrderStatus.PENDING;
        order.createdAt = LocalDateTime.now();
        order.calculateTotalAmount();
        order.validateInvariant();
        return order;
    }
    
    // 业务方法：取消订单
    public void cancel(String reason) {
        if (status != OrderStatus.PENDING && status != OrderStatus.PAID) {
            throw new OrderException("订单状态不允许取消");
        }
        this.status = OrderStatus.CANCELLED;
        this.cancelReason = reason;
        this.updatedAt = LocalDateTime.now();
        validateInvariant();
    }
    
    // 业务方法：支付
    public void pay() {
        if (status != OrderStatus.PENDING) {
            throw new OrderException("订单状态不允许支付");
        }
        this.status = OrderStatus.PAID;
        this.updatedAt = LocalDateTime.now();
        validateInvariant();
    }
    
    // 不变量保护
    private void validateInvariant() {
        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("订单金额必须大于0");
        }
        if (items.isEmpty()) {
            throw new IllegalStateException("订单必须包含商品");
        }
    }
    
    // 计算总金额
    private void calculateTotalAmount() {
        this.totalAmount = items.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // 封装性：返回不可变视图
    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }
    
    // 只暴露必要的 getter，无 public setter
    public Long getId() { return id; }
    public OrderStatus getStatus() { return status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
}

// Service：只做编排，不包含业务逻辑
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final DomainEventPublisher eventPublisher;
    
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        order.cancel(reason);  // 业务逻辑在实体内
        orderRepository.save(order);
        
        // 发布领域事件
        eventPublisher.publish(new OrderCancelledEvent(order.getId(), reason));
    }
}
```

**充血模型优点**:
- 业务逻辑内聚，封装性好
- 实体自我保护，不变量始终有效
- 便于单元测试
- 适合复杂业务和长期维护

**充血模型缺点**:
- 学习成本较高
- 需要团队有 DDD 经验
- 简单场景可能过度设计

---

## 设计流程

### 1. 识别实体和值对象

从需求文档中提取名词，判断是实体还是值对象：

| 特征 | 实体（Entity） | 值对象（Value Object） |
|------|---------------|---------------------|
| 唯一标识 | 有 ID | 无 ID |
| 可变性 | 可变 | 不可变 |
| 持久化 | 独立表 | 嵌入父表 |
| 相等性 | 通过 ID | 通过所有属性 |

**示例**：

```java
// 实体：有 ID、可变、独立表
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private UserStatus status;
}

// 值对象：无 ID、不可变、嵌入
@Embeddable
public class Address {
    private final String province;
    private final String city;
    
    public Address(String province, String city) {
        this.province = province;
        this.city = city;
    }
    // 只有 getter，无 setter
}
```

---

### 2. 定义属性和约束

为实体添加属性、类型和约束：

```java
@Entity
@Table(name = "user", indexes = {
    @Index(name = "idx_username", columnList = "username", unique = true)
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50, unique = true)
    @Pattern(regexp = "^[a-zA-Z0-9_]{4,50}$")
    private String username;
    
    @Column(nullable = false, length = 100, unique = true)
    @Email
    private String email;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    @Embedded
    private Address address;
    
    // 审计字段
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**要点**：
- 使用 `@Column` 定义约束（nullable、length、unique）
- 枚举用 `EnumType.STRING` 存储
- 金额用 `BigDecimal`，避免 `Float`/`Double`
- 添加审计字段（createdAt、updatedAt）

---

### 3. 设计关系

**原则**：跨聚合用 ID 引用，聚合内用对象引用

```java
// ✅ 推荐：跨聚合 - ID 引用
@Entity
public class Order {
    @Column(name = "user_id")
    private Long userId;  // 不持有 User 对象
}

// ✅ 推荐：聚合内 - 对象引用 + 级联
@Entity
public class Order {
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;  // 聚合内部
}

// ❌ 避免：双向关系
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    private List<Order> orders;  // 循环引用风险
}
```

---

### 4. 实现业务方法（充血模型）

业务逻辑封装在实体内部：

```java
@Entity
public class Order {
    private OrderStatus status;
    private BigDecimal totalAmount;
    private List<OrderItem> items;
    
    // 工厂方法
    public static Order create(Long userId, List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("订单必须包含商品");
        }
        Order order = new Order();
        order.userId = userId;
        order.items = new ArrayList<>(items);
        order.status = OrderStatus.PENDING;
        order.calculateTotalAmount();
        order.validateInvariant();
        return order;
    }
    
    // 业务方法
    public void pay() {
        if (status != OrderStatus.PENDING) {
            throw new OrderException("订单状态不允许支付");
        }
        this.status = OrderStatus.PAID;
        this.paidAt = LocalDateTime.now();
        validateInvariant();
    }
    
    public void cancel(String reason) {
        if (status != OrderStatus.PENDING && status != OrderStatus.PAID) {
            throw new OrderException("订单状态不允许取消");
        }
        this.status = OrderStatus.CANCELLED;
        this.cancelReason = reason;
        validateInvariant();
    }
    
    // 不变量保护
    private void validateInvariant() {
        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("订单金额必须大于0");
        }
        if (items.isEmpty()) {
            throw new IllegalStateException("订单必须包含商品");
        }
    }
    
    // 封装性：返回不可变视图
    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }
}
```

**Service 层只做编排**：

```java
@Service
public class OrderService {
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId);
        order.cancel(reason);  // 业务逻辑在实体内
        orderRepository.save(order);
    }
}
```

---

### 5. 设计聚合

聚合是事务一致性边界，通过聚合根操作内部对象：

```java
// 聚合根
@Entity
public class Order {  // Aggregate Root
    @Column(name = "user_id")
    private Long userId;  // 跨聚合：ID 引用
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;  // 聚合内部
    
    // 对外接口：只能通过聚合根操作内部对象
    public void addItem(Long productId, BigDecimal price, int quantity) {
        OrderItem item = new OrderItem(productId, price, quantity);
        items.add(item);
        calculateTotalAmount();
    }
}

// 聚合内部实体
@Entity
public class OrderItem {
    @Column(name = "product_id")
    private Long productId;  // 跨聚合：ID 引用
    private BigDecimal price;
    private Integer quantity;
}
```

**聚合设计原则**：
- 小聚合：Order 只包含 OrderItem，不包含 User、Product
- ID 引用：跨聚合通过 ID 引用
- 事务边界：一个事务只修改一个聚合
- 最终一致性：聚合间通过事件保持一致

---

## 质量检查

### 模型选择检查
- [ ] 已评估业务复杂度
- [ ] 已评估团队 DDD 经验
- [ ] 已明确选择贫血模型或充血模型
- [ ] 选择理由已记录

### 设计检查
- [ ] 实体和值对象区分清晰
- [ ] 每个实体有唯一标识（ID）
- [ ] 实体不超过 50 个字段（避免上帝实体）
- [ ] 优先使用单向关系 + ID 引用
- [ ] 聚合保持小而精

### 实现检查（充血模型）
- [ ] 业务逻辑在实体内
- [ ] 无参构造函数是 `protected`（JPA 要求）
- [ ] 关键字段无 `public setter`
- [ ] 不能创建无效对象（工厂方法验证）
- [ ] 金额用 `BigDecimal`，枚举用 `STRING`

### 实现检查（贫血模型）
- [ ] 实体作为纯数据载体
- [ ] 业务逻辑在 Service 层
- [ ] Service 方法职责单一
- [ ] 金额用 `BigDecimal`，枚举用 `STRING`

### 战略设计检查（大型项目）
- [ ] 限界上下文已识别
- [ ] 上下文映射关系已定义
- [ ] 领域事件已设计
- [ ] 跨上下文通信方式已明确

### 🚨 红灯信号
遇到以下情况，立即停止并重新设计：
- 单个实体超过 50 个字段（上帝实体）
- 大量双向 `@OneToMany`/`@ManyToOne`（循环引用）
- 值对象有 `@Id` 和 setter（误用）
- 可以创建负数金额的订单（不变量缺失）
- 充血模型：实体只有 getter/setter，无业务方法
- 贫血模型：实体包含复杂业务逻辑

---

## 常见问题

### 贫血模型 → 充血模型

```java
// ❌ 贫血模型：业务逻辑在 Service
@Service
public class OrderService {
    public void cancel(Order order, String reason) {
        if (order.getStatus() == PENDING || order.getStatus() == PAID) {
            order.setStatus(CANCELLED);
            order.setCancelReason(reason);
        }
    }
}

// ✅ 充血模型：业务逻辑在实体
@Entity
public class Order {
    public void cancel(String reason) {
        if (status != PENDING && status != PAID) {
            throw new OrderException("状态不允许取消");
        }
        this.status = CANCELLED;
        this.cancelReason = reason;
    }
}
```

### 双向关系 → ID 引用

```java
// ❌ 双向关系
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    private List<Order> orders;  // 循环引用
}

// ✅ ID 引用
@Entity
public class Order {
    @Column(name = "user_id")
    private Long userId;
}

// 需要 User 时，通过 Repository 查询
User user = userRepository.findById(order.getUserId());
```

### 上帝实体 → 聚合拆分

```java
// ❌ 上帝实体：100+ 字段
@Entity
public class User {
    // 基本信息、个人资料、偏好设置、统计信息...
}

// ✅ 聚合拆分
@Entity
public class User {  // 核心标识
    private Long id;
    private String username;
}

@Entity
public class UserProfile {  // 个人资料
    private Long userId;
    private String nickname;
}

@Entity
public class UserPreference {  // 偏好设置
    private Long userId;
    private String language;
}
```

---

## 输出要求

### 必须包含
1. **实体设计文档**（使用模板）
   - 实体清单（名称、类型、优先级）
   - 实体属性定义（属性名、类型、约束）
   - 实体关系图（PlantUML）
   - 领域规则说明

2. **代码框架**
   - 实体类（`@Entity`、属性、构造函数）
   - 值对象类（`@Embeddable`、不可变）
   - 业务方法（充血模型）
   - 不变量验证

### 建议包含
- 设计决策记录（为什么选择充血模型、为什么拆分聚合）
- 测试用例（工厂方法测试、状态转换测试）
- 迁移指南（贫血 → 充血模型）

---

## 相关技能

- 前置：[需求分析](mdc:skills/req-breakdown/SKILL.md)、[功能设计](mdc:skills/techdesign-03-feature/SKILL.md)
- 后续：[数据库设计](mdc:skills/techdesign-05-database/SKILL.md)、[API 设计](mdc:skills/techdesign-06-api/SKILL.md)
- 协同：[流程设计](mdc:skills/techdesign-02-process/SKILL.md)

---

## 战略设计：限界上下文 (Bounded Context)

### 什么是限界上下文

限界上下文是 DDD 战略设计的核心概念，定义了领域模型的边界。

**核心思想**:
- 同一个业务概念在不同上下文中可能有不同含义
- 每个上下文内部保持模型一致性
- 上下文之间通过明确的接口通信

**示例：电商系统中的"商品"**:
```markdown
## 限界上下文分析

### 商品上下文 (Product Context)
- 商品: 名称、描述、规格、图片、分类
- 关注: 商品信息管理、上下架

### 库存上下文 (Inventory Context)  
- 商品: SKU、库存数量、仓库位置
- 关注: 库存管理、出入库

### 订单上下文 (Order Context)
- 商品: 商品ID、名称快照、价格快照
- 关注: 订单中的商品信息（历史快照）

### 营销上下文 (Marketing Context)
- 商品: 商品ID、促销价格、活动标签
- 关注: 促销活动、价格策略
```

### 上下文映射

定义上下文之间的关系：

```markdown
## 上下文映射图

┌─────────────┐     ┌─────────────┐
│  商品上下文  │────▶│  库存上下文  │
│  (上游)     │ U/D │  (下游)     │
└─────────────┘     └─────────────┘
       │
       │ 发布语言
       ▼
┌─────────────┐     ┌─────────────┐
│  订单上下文  │◀────│  营销上下文  │
│  (下游)     │ ACL │  (上游)     │
└─────────────┘     └─────────────┘

关系类型:
- U/D (上游/下游): 上游提供接口，下游依赖
- ACL (防腐层): 隔离外部模型，转换为内部模型
- 发布语言: 共享的数据格式（如商品基本信息）
```

### 上下文关系类型

| 关系 | 说明 | 适用场景 |
|------|------|---------|
| **共享内核** | 两个上下文共享部分模型 | 紧密协作的团队 |
| **客户-供应商** | 上游提供，下游消费 | 明确的依赖关系 |
| **防腐层 (ACL)** | 隔离外部模型 | 集成遗留系统、第三方 |
| **开放主机服务** | 提供标准化 API | 多个下游消费者 |
| **发布语言** | 共享的数据格式 | 跨上下文数据交换 |

### 限界上下文设计模板

```markdown
## 限界上下文: {上下文名称}

### 职责
- 核心职责1
- 核心职责2

### 核心领域概念
| 概念 | 类型 | 说明 |
|------|------|------|
| Order | 聚合根 | 订单 |
| OrderItem | 实体 | 订单项 |
| Money | 值对象 | 金额 |

### 对外接口
- API: /api/v1/orders
- 事件: OrderCreated, OrderPaid

### 依赖的上下文
| 上下文 | 关系 | 接口 |
|--------|------|------|
| 商品上下文 | 客户-供应商 | ProductService |
| 用户上下文 | 防腐层 | UserAdapter |

### 团队归属
- 负责团队: 订单团队
- 联系人: xxx
```

---

## 领域事件 (Domain Event)

### 什么是领域事件

领域事件表示领域中发生的重要业务事实，用于解耦上下文和实现最终一致性。

**特征**:
- 不可变：事件一旦发生不可修改
- 过去式命名：OrderCreated, PaymentCompleted
- 自描述：包含足够信息供消费者处理

### 领域事件设计

**事件结构**:
```java
// 事件基类
public abstract class DomainEvent {
    private final String eventId;
    private final LocalDateTime occurredAt;
    private final String aggregateId;
    private final String aggregateType;
    
    protected DomainEvent(String aggregateId, String aggregateType) {
        this.eventId = UUID.randomUUID().toString();
        this.occurredAt = LocalDateTime.now();
        this.aggregateId = aggregateId;
        this.aggregateType = aggregateType;
    }
}

// 具体事件
public class OrderCreatedEvent extends DomainEvent {
    private final Long userId;
    private final BigDecimal totalAmount;
    private final List<OrderItemInfo> items;
    
    public OrderCreatedEvent(Order order) {
        super(order.getId().toString(), "Order");
        this.userId = order.getUserId();
        this.totalAmount = order.getTotalAmount();
        this.items = order.getItems().stream()
            .map(OrderItemInfo::from)
            .collect(Collectors.toList());
    }
}

public class OrderCancelledEvent extends DomainEvent {
    private final String cancelReason;
    private final LocalDateTime cancelledAt;
    
    public OrderCancelledEvent(Long orderId, String reason) {
        super(orderId.toString(), "Order");
        this.cancelReason = reason;
        this.cancelledAt = LocalDateTime.now();
    }
}
```

### 事件发布与订阅

```java
// 事件发布器
public interface DomainEventPublisher {
    void publish(DomainEvent event);
    void publishAll(List<DomainEvent> events);
}

// Spring 实现
@Component
public class SpringDomainEventPublisher implements DomainEventPublisher {
    private final ApplicationEventPublisher publisher;
    
    @Override
    public void publish(DomainEvent event) {
        publisher.publishEvent(event);
    }
}

// 事件处理器
@Component
public class OrderEventHandler {
    
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        // 发送通知
        // 更新统计
        // 触发后续流程
    }
    
    @EventListener
    @Async
    public void handleOrderCancelled(OrderCancelledEvent event) {
        // 释放库存
        // 退款处理
        // 发送通知
    }
}
```

### 事件设计最佳实践

```markdown
## 领域事件设计清单

### 命名规范
- ✅ 使用过去式: OrderCreated, PaymentCompleted
- ❌ 避免使用动词: CreateOrder, CompletePayment

### 事件内容
- ✅ 包含必要的业务数据
- ✅ 包含聚合标识和类型
- ✅ 包含事件ID和时间戳
- ❌ 不包含敏感信息（密码、完整卡号）
- ❌ 不包含过多冗余数据

### 事件粒度
- ✅ 一个业务动作一个事件
- ❌ 不要把多个动作合并为一个事件

### 常见领域事件
| 领域 | 事件 |
|------|------|
| 用户 | UserRegistered, UserActivated, PasswordChanged |
| 订单 | OrderCreated, OrderPaid, OrderShipped, OrderCancelled |
| 支付 | PaymentInitiated, PaymentCompleted, PaymentFailed |
| 库存 | StockReserved, StockDeducted, StockReleased |
```

---

---

## 进阶：CQRS 模式（命令查询职责分离）

> 本节为进阶内容，适用于高并发、复杂查询场景。简单 CRUD 系统可跳过。

### 什么是 CQRS

CQRS (Command Query Responsibility Segregation) 将读操作和写操作分离到不同的模型中：

- **Command（命令）**: 修改数据，不返回数据（或只返回 ID）
- **Query（查询）**: 读取数据，不修改数据

```
┌─────────────────────────────────────────────────────────┐
│                      客户端                              │
└─────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
    ┌─────────────┐                ┌─────────────┐
    │   Command   │                │    Query    │
    │   Service   │                │   Service   │
    └─────────────┘                └─────────────┘
           │                              │
           ▼                              ▼
    ┌─────────────┐                ┌─────────────┐
    │   写模型    │  ──事件──▶    │   读模型    │
    │  (领域模型) │                │  (查询模型) │
    └─────────────┘                └─────────────┘
           │                              │
           ▼                              ▼
    ┌─────────────┐                ┌─────────────┐
    │   写数据库  │                │   读数据库  │
    │   (MySQL)   │                │ (ES/Redis)  │
    └─────────────┘                └─────────────┘
```

### 何时使用 CQRS

| 场景 | 是否使用 | 说明 |
|------|---------|------|
| 简单 CRUD | ❌ 不需要 | 过度设计 |
| 读写比例悬殊（10:1 以上） | ✅ 推荐 | 读写分离优化 |
| 复杂查询需求 | ✅ 推荐 | 查询模型可针对优化 |
| 高并发写入 | ✅ 推荐 | 写模型专注业务逻辑 |
| 事件溯源系统 | ✅ 推荐 | 天然配合 |
| 团队经验不足 | ⚠️ 谨慎 | 增加复杂度 |

### CQRS 实现示例

**写模型（Command）**:
```java
// 命令对象
public record CreateOrderCommand(
    Long userId,
    List<OrderItemCommand> items
) {}

// 命令处理器
@Service
@RequiredArgsConstructor
public class OrderCommandService {
    private final OrderRepository orderRepository;
    private final DomainEventPublisher eventPublisher;
    
    @Transactional
    public Long createOrder(CreateOrderCommand command) {
        // 使用领域模型处理业务逻辑
        Order order = Order.create(command.userId(), command.items());
        orderRepository.save(order);
        
        // 发布事件，同步到读模型
        eventPublisher.publish(new OrderCreatedEvent(order));
        
        return order.getId();
    }
    
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        order.cancel(reason);
        orderRepository.save(order);
        
        eventPublisher.publish(new OrderCancelledEvent(order.getId(), reason));
    }
}
```

**读模型（Query）**:
```java
// 查询对象（扁平化，针对查询优化）
@Document(indexName = "orders")
public class OrderView {
    private String id;
    private String orderNo;
    private String userName;      // 冗余用户名，避免关联查询
    private String userPhone;     // 冗余用户手机
    private BigDecimal totalAmount;
    private String status;
    private String statusText;    // 状态中文名
    private List<OrderItemView> items;
    private LocalDateTime createdAt;
}

// 查询服务
@Service
@RequiredArgsConstructor
public class OrderQueryService {
    private final OrderViewRepository orderViewRepository;  // ES Repository
    
    public Page<OrderView> searchOrders(OrderSearchCriteria criteria, Pageable pageable) {
        // 直接从读模型查询，无需关联
        return orderViewRepository.search(criteria, pageable);
    }
    
    public OrderView getOrderDetail(String orderId) {
        return orderViewRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }
}

// 事件处理器：同步读模型
@Component
@RequiredArgsConstructor
public class OrderViewSynchronizer {
    private final OrderViewRepository orderViewRepository;
    private final UserQueryService userQueryService;
    
    @EventListener
    @Async
    public void onOrderCreated(OrderCreatedEvent event) {
        UserView user = userQueryService.getUser(event.getUserId());
        
        OrderView view = OrderView.builder()
            .id(event.getOrderId().toString())
            .orderNo(event.getOrderNo())
            .userName(user.getName())
            .userPhone(user.getPhone())
            .totalAmount(event.getTotalAmount())
            .status(event.getStatus().name())
            .statusText(event.getStatus().getDisplayName())
            .createdAt(event.getCreatedAt())
            .build();
        
        orderViewRepository.save(view);
    }
    
    @EventListener
    @Async
    public void onOrderCancelled(OrderCancelledEvent event) {
        orderViewRepository.updateStatus(
            event.getOrderId().toString(),
            "CANCELLED",
            "已取消"
        );
    }
}
```

### CQRS 最佳实践

```markdown
### 设计原则
- ✅ 写模型使用领域模型（充血模型）
- ✅ 读模型使用扁平化 DTO（针对查询优化）
- ✅ 通过领域事件同步读写模型
- ✅ 读模型可以冗余数据，避免关联查询
- ❌ 不要在查询服务中修改数据
- ❌ 不要在命令服务中返回复杂查询结果

### 一致性处理
- 最终一致性：读模型可能有短暂延迟（毫秒级）
- 强一致性场景：写操作后直接查写库
- 补偿机制：事件处理失败时重试或告警

### 技术选型
| 组件 | 写模型 | 读模型 |
|------|--------|--------|
| 数据库 | MySQL（事务支持） | ES/MongoDB/Redis |
| ORM | JPA/MyBatis-Plus | Spring Data ES |
| 同步方式 | 领域事件 | 事件监听器 |
```

---

## 版本历史

- **v3.1** (2025-12-18): 增加 CQRS 进阶内容
  - 新增 CQRS 模式说明和实现示例
  - 统一输出路径命名规范

- **v3.0** (2025-11-10): 简洁优化版本
  - 按照 Claude Skill 最佳实践大幅精简（减少 60% token）
  - 调整自由度：从低自由度改为中自由度
  - 合并重复章节：验证清单、最佳实践、常见错误
  - 简化代码示例：保留核心模式，删除冗余说明
  - 添加核心原则速查卡
  - 减少 emoji 使用

- **v2.1** (2025-11-10): 结构化优化版本
- **v2.0** (2025-11-07): 软件研发专业化版本
- **v1.0**: 初始版本
